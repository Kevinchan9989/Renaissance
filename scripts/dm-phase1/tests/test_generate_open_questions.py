import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from generate_open_questions import (
    build_target_comprehension_prompts,
    build_source_comprehension_prompts,
    build_decision_audit_prompts,
    build_grounding_followups,
    render_markdown,
)

FIXTURES = Path(__file__).parent.parent / "fixtures"


def _sample_target_dict():
    return {
        "cm.cm_master_code": {
            "description": "Master code lookup",
            "reviewed": True,  # already done; should be SKIPPED
            "types": {"uuid": "VARCHAR(36) NOT NULL"},
            "explanations": {"uuid": "..."},
            "possible_values": {},
        },
        "cm.cm_bank_master": {
            "description": "Bank master",
            "reviewed": False,  # NOT reviewed; should be INCLUDED
            "types": {
                "uuid": "VARCHAR(36) NOT NULL",
                "bank_code": "VARCHAR(11) NOT NULL",
            },
        },
        "cm.cm_bank_master_t": {
            "description": "Audit twin",
            "reviewed": False,
            "types": {"uuid": "VARCHAR(36)"},
        },
        "stg.stg_eapps_in_closingprice": {
            "description": "Interface staging",
            "reviewed": False,
            "types": {"raw_line": "TEXT"},
        },
    }


def _sample_source_records():
    return [
        {
            "name": "ABA0001_SECURITY_MASTER",
            "schema": "MNETD",
            "columns": [
                {"name": "ABA0001_SECURITY_CODE", "type": "CHAR(8)", "nullable": False, "default": None},
                {"name": "ABA0001_ISIN_CODE", "type": "CHAR(12)", "nullable": True, "default": None},
            ],
            "primary_key": ["ABA0001_SECURITY_CODE"],
            "declared_fks": [],
        },
        {
            "name": "ABA0099_NOT_MIGRATED",
            "schema": "MNETD",
            "columns": [{"name": "X", "type": "CHAR(1)", "nullable": False, "default": None}],
            "primary_key": [],
            "declared_fks": [],
        },
    ]


def _sample_inventory():
    return {
        "ABA0001_SECURITY_MASTER": {"domain": "eApps", "schema": "MNETD", "draft_to_migrate": "Y", "wave": "R1"},
        "ABA0099_NOT_MIGRATED": {"domain": "eApps", "schema": "MNETD", "draft_to_migrate": "N", "wave": "R1"},
    }


def test_target_comprehension_skips_reviewed_tables():
    prompts = build_target_comprehension_prompts(_sample_target_dict())
    ids = [p["id"] for p in prompts]
    # cm_master_code is reviewed -> SKIPPED
    # cm_bank_master_t is _t -> SKIPPED
    # stg.stg_* is stg schema -> SKIPPED
    # cm_bank_master is the only one INCLUDED
    assert len(prompts) == 1
    assert prompts[0]["table_qualified"] == "cm.cm_bank_master"
    assert prompts[0]["channel"] == "notebooklm"


def test_target_comprehension_prompt_lists_all_columns():
    prompts = build_target_comprehension_prompts(_sample_target_dict())
    p = prompts[0]
    assert "uuid" in p["prompt"]
    assert "bank_code" in p["prompt"]
    assert "VARCHAR(11)" in p["prompt"]
    assert "column_explanations:" in p["prompt"]


def test_source_comprehension_includes_only_y_or_tbd():
    prompts = build_source_comprehension_prompts(
        _sample_source_records(), _sample_inventory()
    )
    # ABA0099_NOT_MIGRATED has draft_to_migrate=N -> SKIPPED
    # ABA0001 has draft_to_migrate=Y -> INCLUDED
    assert len(prompts) == 1
    assert prompts[0]["table"] == "ABA0001_SECURITY_MASTER"
    assert prompts[0]["channel"] == "legacy-source"


def test_source_comprehension_prompt_uses_table_columns():
    prompts = build_source_comprehension_prompts(
        _sample_source_records(), _sample_inventory()
    )
    p = prompts[0]
    assert "ABA0001_SECURITY_CODE" in p["prompt"]
    assert "ABA0001_ISIN_CODE" in p["prompt"]
    assert "CHAR(8)" in p["prompt"]
    assert "CHAR(12)" in p["prompt"]


def test_decision_audit_only_for_tbd():
    inv_with_tbd = {
        "X_Y_TABLE": {"domain": "eApps", "schema": "MNETD", "draft_to_migrate": "Y", "wave": "R1"},
        "X_TBD_TABLE": {"domain": "SBA", "schema": "PRI1", "draft_to_migrate": "TBD", "wave": "R1"},
        "X_N_TABLE": {"domain": "eApps", "schema": "MNETD", "draft_to_migrate": "N", "wave": "R1"},
        "X_R2_TABLE": {"domain": "ERF", "schema": "MNETD", "draft_to_migrate": "TBD", "wave": "R2"},
    }
    prompts = build_decision_audit_prompts(inv_with_tbd)
    # TBD on R1 only
    assert len(prompts) == 1
    assert prompts[0]["table"] == "X_TBD_TABLE"


def test_grounding_followups_returns_three():
    prompts = build_grounding_followups()
    ids = [p["id"] for p in prompts]
    assert "QG-001" in ids
    assert "QG-002" in ids
    assert "QG-003" in ids
    assert len(prompts) == 3
    # QG-001 and QG-002 are legacy-source; QG-003 is notebooklm
    by_id = {p["id"]: p for p in prompts}
    assert by_id["QG-001"]["channel"] == "legacy-source"
    assert by_id["QG-002"]["channel"] == "legacy-source"
    assert by_id["QG-003"]["channel"] == "notebooklm"


def test_render_markdown_groups_by_channel():
    nlm = [{"id": "QC-NLM-001", "table_qualified": "cm.foo", "prompt": "p1", "channel": "notebooklm"}]
    leg = [
        {"id": "QC-LEG-001", "table": "BAR", "prompt": "p2", "channel": "legacy-source"},
        {"id": "QG-001", "title": "MLOG use-case", "prompt": "p3", "channel": "legacy-source"},
    ]
    md = render_markdown(nlm_prompts=nlm, legacy_prompts=leg, db_prompts=[], user_prompts=[])
    assert "## NotebookLM channel" in md
    assert "## Legacy-source channel" in md
    assert "## OMEGA DB queries" in md
    assert "QC-NLM-001" in md
    assert "QC-LEG-001" in md
    assert "QG-001" in md
