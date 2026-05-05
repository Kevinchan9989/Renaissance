"""Extracts FK relationships (declared + implicit + sample-join validated) from
source DDL and writes phase1/edges.json.

Inputs:
  - Source-side table records from extract_source_ddl.extract_all() (existing module)
  - Per-table sample values from backups/workspace.json (read directly here)

Outputs:
  - phase1/edges.json with {version, generated_at, edges:[]}

Each edge:
  {
    id, kind: "fk-declared"|"fk-implicit",
    from: {table, column}, to: {table, column},
    cardinality: "unknown"  # populated later via Q&A or DB queries
    evidence: {
      declared: bool,
      naming_match: bool,
      sample_join: {matched, orphans, coverage}
    },
    confidence: "high"|"medium"|"low"
  }
"""
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

import extract_source_ddl as src

REPO_ROOT = Path(__file__).parent.parent.parent
DEFAULT_WORKSPACE = REPO_ROOT / "backups" / "workspace.json"
DEFAULT_OUT = REPO_ROOT / "docs" / "superpowers" / "specs" / "dm-migration-v0.2" / "phase1" / "edges.json"


# ---------------- Sample data loader (inline; minimal, no extractor module) ----------------


def load_samples(workspace_path):
    """Reads backups/workspace.json and returns a per-table sample dict.

    Shape: { tableName: { columns: { col_name: { sample_values: [...] } } } }

    NOTE: dm-tool stores all DDL (source-side Oracle tables included) under
    data.targets regardless of the script's type field. data.sources is
    always empty. We read targets from oracle-type scripts only to stay
    consistent with extract_source_ddl's oracle-only scope.
    """
    with open(workspace_path, "r", encoding="utf-8") as f:
        ws = json.load(f)
    out = {}
    for s in ws.get("scripts") or []:
        if s.get("type") != "oracle":
            continue
        # dm-tool quirk: source-side DDL lives in data.targets, not data.sources
        sources = ((s.get("data") or {}).get("targets")) or []
        for tbl in sources:
            name = tbl.get("tableName")
            if not name:
                continue
            cols = {}
            for c in tbl.get("columns") or []:
                cn = c.get("name")
                if not cn:
                    continue
                cols[cn] = {"sample_values": list(c.get("sampleValues") or [])}
            existing = out.get(name)
            new_size = sum(len(v["sample_values"]) for v in cols.values())
            existing_size = (
                sum(len(v["sample_values"]) for v in existing["columns"].values())
                if existing else -1
            )
            if new_size > existing_size:
                out[name] = {"columns": cols}
    return out


# ---------------- Edge proposal ----------------


def _strip_table_prefix(col_name):
    """ABA0007_SECURITY_CODE -> SECURITY_CODE; otherwise returns input unchanged."""
    m = re.match(r"^[A-Za-z]{2,4}\d{2,4}_(.*)$", col_name)
    return m.group(1) if m else col_name


def _base_type(t):
    """Extracts the base type token from a column type string.

    'CHAR(8)' -> 'CHAR'
    'VARCHAR2(30)' -> 'VARCHAR2'
    'NUMBER(4,0)' -> 'NUMBER'
    'DATE' -> 'DATE'
    Returns '' if input is falsy.
    """
    if not t:
        return ""
    return str(t).split("(", 1)[0].strip().upper()


# Treat a few near-equivalents as the same family (Oracle quirks).
_TYPE_FAMILIES = {
    "CHAR": "TEXT", "VARCHAR": "TEXT", "VARCHAR2": "TEXT", "CLOB": "TEXT", "TEXT": "TEXT",
    "NUMBER": "NUM", "NUMERIC": "NUM", "INT": "NUM", "INTEGER": "NUM", "DECIMAL": "NUM",
    "DATE": "DATE", "TIMESTAMP": "DATE",
}


def _types_compatible(t_child, t_parent):
    """Two types are compatible iff their base type or family matches.

    Generous-by-design: we only want to filter the OBVIOUSLY incompatible
    pairs (e.g., NUMBER vs CHAR), not enforce exact match.
    """
    bc = _base_type(t_child)
    bp = _base_type(t_parent)
    if not bc or not bp:
        return True  # don't reject when type info is missing
    if bc == bp:
        return True
    return _TYPE_FAMILIES.get(bc, bc) == _TYPE_FAMILIES.get(bp, bp)


_BACKUP_TABLE_PATTERNS = [
    re.compile(r"_\d{8}$"),                    # ABA0001_SECURITY_MASTER_20230428
    re.compile(r"_R\d+_\d{8}$"),               # ABA0001_SECURITY_MASTER_R2_20231212
    re.compile(r"_BKP$|_BKP_", re.IGNORECASE), # explicit backup naming
    re.compile(r"_STG$|_STG_", re.IGNORECASE), # staging clone
    re.compile(r"_TMP$|_TMP_", re.IGNORECASE), # temp clone
    re.compile(r"_OLD$|_OLD_", re.IGNORECASE),
]


def _is_backup_table(name):
    if not name:
        return False
    return any(p.search(name) for p in _BACKUP_TABLE_PATTERNS)


def extract_declared_fks(sources):
    """Walks source records and emits one edge per declared FK constraint.

    Parses a `ref` string like 'PARENT(ID)' or 'PARENT(ID,X)' loosely.
    """
    edges = []
    eid = 0
    for child in sources:
        for fk in child.get("declared_fks", []) or []:
            local_cols = fk.get("local_columns") or []
            ref = (fk.get("ref") or "").strip()
            m = re.match(r"^([A-Za-z0-9_]+)\s*\(\s*([^)]*)\s*\)\s*$", ref)
            if not m:
                continue
            parent_table = m.group(1)
            parent_cols = [s.strip() for s in m.group(2).split(",") if s.strip()]
            for i, lc in enumerate(local_cols):
                pc = parent_cols[i] if i < len(parent_cols) else (parent_cols[0] if parent_cols else "")
                eid += 1
                edges.append({
                    "id": f"E-{eid:04d}",
                    "kind": "fk-declared",
                    "from": {"table": child["name"], "column": lc},
                    "to": {"table": parent_table, "column": pc},
                    "cardinality": "unknown",
                    "evidence": {
                        "declared": True,
                        "naming_match": False,
                        "sample_join": {"matched": 0, "orphans": 0, "coverage": "none"},
                    },
                    "confidence": "low",  # bumped later after sample_join
                })
    return edges


def propose_implicit_fks(sources, eid_start=10000):
    """For each non-PK column, check if its stripped suffix matches any other
    table's PK column suffix. Skips backup-pattern parent tables. Requires
    type-compatibility between child and parent columns.
    """
    edges = []
    pk_index = {}
    for t in sources:
        if _is_backup_table(t["name"]):
            # Don't propose backup tables as canonical parents
            continue
        for pk_col in t.get("primary_key", []) or []:
            stripped = _strip_table_prefix(pk_col)
            # Find type for this PK col
            pk_type = ""
            for c in t.get("columns", []) or []:
                if c.get("name") == pk_col:
                    pk_type = c.get("type", "")
                    break
            pk_index.setdefault(stripped, []).append((t["name"], pk_col, pk_type))

    eid = eid_start
    for child in sources:
        child_pks = set(child.get("primary_key", []) or [])
        for col in child.get("columns", []) or []:
            cname = col.get("name")
            ctype = col.get("type", "")
            if not cname or cname in child_pks:
                continue
            stripped = _strip_table_prefix(cname)
            for parent_name, parent_col, parent_type in pk_index.get(stripped, []):
                if parent_name == child["name"]:
                    continue
                if not _types_compatible(ctype, parent_type):
                    continue
                eid += 1
                edges.append({
                    "id": f"E-{eid:04d}",
                    "kind": "fk-implicit",
                    "from": {"table": child["name"], "column": cname},
                    "to": {"table": parent_name, "column": parent_col},
                    "cardinality": "unknown",
                    "evidence": {
                        "declared": False,
                        "naming_match": True,
                        "sample_join": {"matched": 0, "orphans": 0, "coverage": "none"},
                    },
                    "confidence": "low",
                })
    return edges


# ---------------- Sample join + confidence ----------------


def sample_join(samples, child_table, child_col, parent_table, parent_col):
    """Joins child_col values into the set of parent_col values.

    Returns {matched, orphans, coverage}.
    coverage:
      - 'none'     if either side has no sample values
      - 'disjoint' if both sides have samples but matched == 0 (strong rejection)
      - 'full'     if all child values matched AND child sample size >= 100
      - 'partial'  otherwise (some matches, not 100%)
    """
    cs = (((samples.get(child_table) or {}).get("columns") or {}).get(child_col, {}).get("sample_values")) or []
    ps = (((samples.get(parent_table) or {}).get("columns") or {}).get(parent_col, {}).get("sample_values")) or []
    if not cs or not ps:
        return {"matched": 0, "orphans": 0, "coverage": "none"}
    parent_set = set(ps)
    matched = sum(1 for v in cs if v in parent_set)
    orphans = len(cs) - matched
    if matched == 0:
        coverage = "disjoint"
    elif matched == len(cs) and len(cs) >= 100:
        coverage = "full"
    else:
        coverage = "partial"
    return {"matched": matched, "orphans": orphans, "coverage": coverage}


def rollup_confidence(declared, naming_match, sample_join):
    """Combines evidence into a confidence rating.

    declared + clean sample (no orphans, any coverage)        -> high
    declared with no sample data                                -> medium (declared alone is decent)
    naming_match-only + clean sample (no orphans, partial+)    -> medium
    everything else                                             -> low
    """
    sj = sample_join or {}
    coverage = sj.get("coverage", "none")
    orphans = sj.get("orphans", 0)
    matched = sj.get("matched", 0)

    if declared:
        if coverage in ("full", "partial") and orphans == 0:
            return "high"
        return "medium"  # declared alone

    if naming_match:
        if coverage in ("full", "partial") and orphans == 0 and matched > 0:
            return "medium"
        return "low"

    return "low"


# ---------------- Wiring ----------------


def build_edges(sources, samples):
    """Top-level: produce all edges with sample-join evidence + confidence."""
    edges = extract_declared_fks(sources) + propose_implicit_fks(sources)
    seen = set()
    deduped = []
    for e in edges:
        key = (e["from"]["table"], e["from"]["column"], e["to"]["table"], e["to"]["column"])
        if key in seen:
            continue
        seen.add(key)
        # Run sample join
        e["evidence"]["sample_join"] = sample_join(
            samples,
            e["from"]["table"], e["from"]["column"],
            e["to"]["table"], e["to"]["column"],
        )
        e["confidence"] = rollup_confidence(
            declared=e["evidence"]["declared"],
            naming_match=e["evidence"]["naming_match"],
            sample_join=e["evidence"]["sample_join"],
        )
        deduped.append(e)
    return deduped


def main(argv):
    sources = src.extract_all()
    samples = load_samples(DEFAULT_WORKSPACE)
    edges = build_edges(sources, samples)

    DEFAULT_OUT.parent.mkdir(parents=True, exist_ok=True)
    with DEFAULT_OUT.open("w", encoding="utf-8") as f:
        json.dump({
            "version": "0.2",
            "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
            "edges": edges,
        }, f, indent=2)
    print(f"Wrote {len(edges)} edges -> {DEFAULT_OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
