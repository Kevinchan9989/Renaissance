"""Generates phase1/open-questions.md grouped by channel.

Reads:
  - gsib-migration/workspace/omega-ddl-current.dict.json (target DDL with reviewed flag)
  - gsib-migration/workspace/script-00-BE_MNETD.json (source DDL, oracle)
  - gsib-migration/workspace/script-04-FE_TRI1.json (source DDL, oracle)
  - phase1/inventory.json (LT1 output)

Emits:
  - phase1/open-questions.md (Q&A backlog grouped by channel)
"""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import extract_source_ddl as src

REPO_ROOT = Path(__file__).parent.parent.parent
DEFAULT_TARGET_DICT = REPO_ROOT / "gsib-migration" / "workspace" / "omega-ddl-current.dict.json"
DEFAULT_INVENTORY = REPO_ROOT / "docs" / "superpowers" / "specs" / "dm-migration-v0.2" / "phase1" / "inventory.json"
DEFAULT_OUT = REPO_ROOT / "docs" / "superpowers" / "specs" / "dm-migration-v0.2" / "phase1" / "open-questions.md"

EXCLUDED_TARGET_SCHEMAS = {"stg"}


# ---------------- Comprehension batch template ----------------


def _format_columns_block(columns):
    """Render a list of cols as bullet lines for the prompt."""
    lines = []
    for c in columns:
        name = c.get("name", "?")
        ctype = c.get("type", "?")
        nullable = c.get("nullable", True)
        default = c.get("default")
        default_str = "-" if default is None or default == "" else str(default)
        lines.append(f"  - {name} ({ctype}, nullable={nullable}, default={default_str})")
    return "\n".join(lines)


def _comprehension_prompt(table_qualified, domain, columns):
    cols_block = _format_columns_block(columns)
    yaml_block = "\n".join(
        f"    {c['name']}:\n      explanation: \"...\"\n      possible_values: \"...\"\n      notes: \"...\""
        for c in columns
    )
    return f"""Comprehend every column on `{table_qualified}` ({domain}). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
{cols_block}

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
{yaml_block}
"""


# ---------------- Target comprehension ----------------


def _is_t_twin(table_name):
    return table_name.endswith("_t")


def _split_qualified(key):
    return key.split(".", 1) if "." in key else ("", key)


def _parse_target_columns(types_dict):
    """Convert target-dict types map into column dicts. Strips NOT NULL, default."""
    import re as _re
    cols = []
    for col_name, decl in (types_dict or {}).items():
        raw = (decl or "").strip()
        nullable = "NOT NULL" not in raw.upper()
        cleaned = _re.sub(r"\b(NOT\s+NULL|NULL)\b", "", raw, flags=_re.IGNORECASE).strip()
        default = None
        m = _re.search(r"DEFAULT\s+(.+)$", cleaned, flags=_re.IGNORECASE)
        if m:
            default = m.group(1).strip()
            cleaned = cleaned[:m.start()].strip()
        cols.append({
            "name": col_name,
            "type": cleaned,
            "nullable": nullable,
            "default": default,
        })
    return cols


def build_target_comprehension_prompts(target_dict):
    """For each target table not yet reviewed, emit a comprehension batch prompt."""
    prompts = []
    seq = 0
    for key in sorted(target_dict.keys()):
        sch, tbl = _split_qualified(key)
        if sch in EXCLUDED_TARGET_SCHEMAS:
            continue
        if _is_t_twin(tbl):
            continue
        v = target_dict[key] or {}
        if v.get("reviewed") is True:
            continue
        cols = _parse_target_columns(v.get("types") or {})
        if not cols:
            continue
        seq += 1
        prompts.append({
            "id": f"QC-NLM-{seq:03d}",
            "channel": "notebooklm",
            "table_qualified": key,
            "prompt": _comprehension_prompt(key, sch, cols),
        })
    return prompts


# ---------------- Source comprehension ----------------


def build_source_comprehension_prompts(source_records, inventory):
    """For each source table whose draft_to_migrate is Y or TBD, emit prompt."""
    prompts = []
    seq = 0
    for t in sorted(source_records, key=lambda x: x["name"]):
        name = t["name"]
        meta = inventory.get(name) or {}
        draft = (meta.get("draft_to_migrate") or "").upper()
        if draft not in ("Y", "TBD"):
            continue
        domain = meta.get("domain") or "?"
        schema = t.get("schema") or meta.get("schema") or ""
        qualified = f"{schema}.{name}" if schema else name
        seq += 1
        prompts.append({
            "id": f"QC-LEG-{seq:03d}",
            "channel": "legacy-source",
            "table": name,
            "prompt": _comprehension_prompt(qualified, domain, t.get("columns") or []),
        })
    return prompts


# ---------------- Decision audits ----------------


def build_decision_audit_prompts(inventory):
    """For each R1 source table marked TBD, emit a decision audit prompt."""
    prompts = []
    seq = 0
    for name in sorted(inventory.keys()):
        meta = inventory[name]
        if (meta.get("draft_to_migrate") or "").upper() != "TBD":
            continue
        if (meta.get("wave") or "").upper() != "R1":
            continue
        seq += 1
        domain = meta.get("domain") or "?"
        schema = meta.get("schema") or ""
        prompts.append({
            "id": f"QD-{seq:03d}",
            "channel": "legacy-source",
            "table": name,
            "prompt": (
                f"Source table `{schema}.{name}` (domain={domain}, wave=R1, draft=TBD).\n"
                f"Should this table migrate to OMEGA in v0.2 (R1)?\n"
                f"  - If YES: which target tables in cm.* / iss.* does it feed?\n"
                f"  - If NO: rationale (deprecated, audit-only, replaced by another mechanism, "
                f"interface-only, etc.).\n"
                f"Cite the OMEGA FSD or legacy SDS where this is established."
            ),
        })
    return prompts


# ---------------- Grounding follow-ups ----------------


def build_grounding_followups():
    """Three hardcoded follow-ups from grounding-decisions.md (D4, D6)."""
    return [
        {
            "id": "QG-001",
            "channel": "legacy-source",
            "title": "MLOG database use-case",
            "prompt": (
                "What is the purpose of the legacy MLOG database / tables? Is it a log/audit "
                "store? Are there any operational dependencies on MLOG data post-OMEGA Go-Live? "
                "Specifically, does any R1 or R2 OMEGA module read or reference MLOG data?"
            ),
        },
        {
            "id": "QG-002",
            "channel": "legacy-source",
            "title": "ABA0023_AUDIT_ACTION contents",
            "prompt": (
                "What does ABA0023_AUDIT_ACTION contain? What columns, what events does it log "
                "(insert/update/delete? schema changes? business actions?)? Retention period, "
                "row volume estimate. Is it consulted by any operational legacy report or job?"
            ),
        },
        {
            "id": "QG-003",
            "channel": "notebooklm",
            "title": "FSD requirement for legacy audit translation into _t",
            "prompt": (
                "Does any OMEGA FSD (Reports, Admin, or DM-related) explicitly require legacy "
                "audit data (e.g., eApps ABA0023_AUDIT_ACTION) to be translated and loaded into "
                "OMEGA's _t historical format at Go-Live? If so, which target _t tables are in "
                "scope and what is the row-level translation rule?"
            ),
        },
    ]


# ---------------- Markdown rendering ----------------


def _render_prompt_block(p):
    """Return one prompt-section block as markdown."""
    head_id = p["id"]
    if "table_qualified" in p:
        sub = f"_For target table: `{p['table_qualified']}`_"
    elif "table" in p:
        sub = f"_For source table: `{p['table']}`_"
    elif "title" in p:
        sub = f"_{p['title']}_"
    else:
        sub = ""
    return f"### {head_id}\n{sub}\n\n```\n{p['prompt']}\n```\n"


def render_markdown(nlm_prompts, legacy_prompts, db_prompts, user_prompts):
    out = []
    out.append("# Phase 1 Open Questions")
    out.append("")
    out.append(
        f"_Generated: {datetime.now(timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z')}_  "
        f"_Sources: omega-ddl-current.dict.json, script-00-BE_MNETD.json, "
        f"script-04-FE_TRI1.json, inventory.json_"
    )
    out.append("")
    out.append(
        "Each question below is ready to paste into the appropriate channel. Bring the "
        "answer back to the corresponding archive directory."
    )
    out.append("")

    out.append(f"## NotebookLM channel  ({len(nlm_prompts)} questions)")
    out.append("")
    out.append(
        "Paste each prompt into your NotebookLM session for the OMEGA notebook "
        "(https://notebooklm.google.com/notebook/05fa56a8-dd88-425c-a678-643a7c24d0aa). "
        "Archive answers as `phase1/notebooklm-archive/q-<id>-<slug>.md` using the YAML "
        "schema from spec §5.5 (extended with `column_explanations` per §5.6a)."
    )
    out.append("")
    if not nlm_prompts:
        out.append("_None._")
    for p in nlm_prompts:
        out.append(_render_prompt_block(p))

    out.append(f"## Legacy-source channel  ({len(legacy_prompts)} questions)")
    out.append("")
    out.append(
        "Paste each prompt into your separate Claude/Cursor session on the legacy source "
        "codebase. Archive answers as `phase1/legacy-source-archive/q-<id>-<slug>.md`."
    )
    out.append("")
    if not legacy_prompts:
        out.append("_None._")
    for p in legacy_prompts:
        out.append(_render_prompt_block(p))

    out.append(f"## OMEGA DB queries  ({len(db_prompts)} queries)")
    out.append("")
    if not db_prompts:
        out.append(
            "_No DB queries enqueued yet. Will populate after legacy-source channel surfaces "
            "FK ambiguities that need scale-validation._"
        )
    for p in db_prompts:
        out.append(_render_prompt_block(p))

    out.append("")
    out.append(f"## User direct  ({len(user_prompts)} questions)")
    out.append("")
    if not user_prompts:
        out.append("_None at this time._")
    for p in user_prompts:
        out.append(_render_prompt_block(p))

    return "\n".join(out) + "\n"


# ---------------- Main ----------------


def main(argv):
    with DEFAULT_TARGET_DICT.open("r", encoding="utf-8") as f:
        target_dict = json.load(f)
    with DEFAULT_INVENTORY.open("r", encoding="utf-8") as f:
        inventory = json.load(f)
    sources = src.extract_all()

    nlm_target = build_target_comprehension_prompts(target_dict)
    leg_source = build_source_comprehension_prompts(sources, inventory)
    decisions = build_decision_audit_prompts(inventory)
    grounding = build_grounding_followups()

    # Split grounding into channels
    nlm_grounding = [g for g in grounding if g["channel"] == "notebooklm"]
    leg_grounding = [g for g in grounding if g["channel"] == "legacy-source"]

    nlm_all = nlm_target + nlm_grounding
    leg_all = leg_source + decisions + leg_grounding

    md = render_markdown(
        nlm_prompts=nlm_all,
        legacy_prompts=leg_all,
        db_prompts=[],
        user_prompts=[],
    )
    DEFAULT_OUT.parent.mkdir(parents=True, exist_ok=True)
    with DEFAULT_OUT.open("w", encoding="utf-8") as f:
        f.write(md)
    print(
        f"Wrote open-questions.md: {len(nlm_all)} NLM ({len(nlm_target)} target + "
        f"{len(nlm_grounding)} grounding) + {len(leg_all)} legacy "
        f"({len(leg_source)} source + {len(decisions)} decisions + "
        f"{len(leg_grounding)} grounding) -> {DEFAULT_OUT}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
