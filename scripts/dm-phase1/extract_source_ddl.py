"""Extracts source-side table records from dm-tool script-*.json exports.

Quirk: dm-tool stores all parsed DDL tables in `data.targets` regardless of
file type. The source/target distinction lives at the FILE level via the
`type` field (`oracle` -> source-side legacy, `postgresql` -> OMEGA target).
This extractor reads ONLY oracle-type scripts; non-oracle files yield [].
"""
import json
import sys
import glob
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent.parent
DEFAULT_SCRIPT_GLOB = str(REPO_ROOT / "gsib-migration" / "workspace" / "script-*.json")


def _parse_pk(constraints):
    for c in constraints or []:
        if c.get("type") == "Primary Key":
            cols = c.get("localCols") or ""
            return [s.strip() for s in cols.split(",") if s.strip()]
    return []


def _parse_fks(constraints):
    fks = []
    for c in constraints or []:
        if c.get("type") == "Foreign Key":
            local = c.get("localCols") or ""
            ref = c.get("ref") or ""
            fks.append({
                "local_columns": [s.strip() for s in local.split(",") if s.strip()],
                "ref": ref,
            })
    return fks


def _coerce_nullable(value):
    if value is None:
        return True
    s = str(value).strip().upper()
    if s in ("Y", "YES", "TRUE", "T", "1", "NULL"):
        return True
    if s in ("N", "NO", "FALSE", "F", "0", "NOT NULL"):
        return False
    return True  # default


def extract_from_script_file(path):
    with open(path, "r", encoding="utf-8") as f:
        doc = json.load(f)
    if doc.get("type") != "oracle":
        return []  # only oracle-type scripts hold source-side legacy DDL
    # NOTE: dm-tool stores DDL in data.targets regardless of file type.
    tables = (doc.get("data") or {}).get("targets") or []
    out = []
    for t in tables:
        out.append({
            "name": t.get("tableName"),
            "schema": t.get("schema") or "",
            "side": "source",
            "description": t.get("description") or "",
            "columns": [
                {
                    "name": c.get("name"),
                    "type": c.get("type"),
                    "nullable": _coerce_nullable(c.get("nullable")),
                    "default": c.get("default"),
                }
                for c in (t.get("columns") or [])
            ],
            "primary_key": _parse_pk(t.get("constraints")),
            "declared_fks": _parse_fks(t.get("constraints")),
        })
    return out


def extract_all(script_glob=DEFAULT_SCRIPT_GLOB):
    seen = {}
    for p in sorted(glob.glob(script_glob)):
        for t in extract_from_script_file(p):
            name = t["name"]
            if not name:
                continue
            # First occurrence wins; record source script for audit
            if name not in seen:
                t["_source_script"] = Path(p).name
                seen[name] = t
    return list(seen.values())


def main(argv):
    out_path = REPO_ROOT / "scripts" / "dm-phase1" / "build" / "source-tables.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    tables = extract_all()
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(tables, f, indent=2)
    print(f"Wrote {len(tables)} source tables -> {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
