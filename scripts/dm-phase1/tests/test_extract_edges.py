import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from extract_edges import (
    propose_implicit_fks,
    sample_join,
    extract_declared_fks,
    rollup_confidence,
)

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_extract_declared_fks_from_source_records():
    sources = [
        {
            "name": "CHILD",
            "columns": [{"name": "PARENT_ID", "type": "INT", "nullable": False, "default": None}],
            "primary_key": [],
            "declared_fks": [{"local_columns": ["PARENT_ID"], "ref": "PARENT(ID)"}],
        }
    ]
    edges = extract_declared_fks(sources)
    assert len(edges) == 1
    e = edges[0]
    assert e["kind"] == "fk-declared"
    assert e["from"]["table"] == "CHILD"
    assert e["from"]["column"] == "PARENT_ID"
    assert e["to"]["table"] == "PARENT"
    assert e["to"]["column"] == "ID"
    assert e["evidence"]["declared"] is True
    assert e["evidence"]["naming_match"] is False


def test_propose_implicit_fks_by_name_match():
    sources = [
        {
            "name": "ABA0007_DETAIL_AUCTION_RESULT",
            "columns": [{"name": "ABA0007_SECURITY_CODE", "type": "CHAR(8)", "nullable": False, "default": None}],
            "primary_key": [],
            "declared_fks": [],
        },
        {
            "name": "ABA0001_SECURITY_MASTER",
            "columns": [{"name": "ABA0001_SECURITY_CODE", "type": "CHAR(8)", "nullable": False, "default": None}],
            "primary_key": ["ABA0001_SECURITY_CODE"],
            "declared_fks": [],
        },
    ]
    edges = propose_implicit_fks(sources)
    assert len(edges) == 1
    e = edges[0]
    assert e["kind"] == "fk-implicit"
    assert e["from"] == {"table": "ABA0007_DETAIL_AUCTION_RESULT", "column": "ABA0007_SECURITY_CODE"}
    assert e["to"] == {"table": "ABA0001_SECURITY_MASTER", "column": "ABA0001_SECURITY_CODE"}
    assert e["evidence"]["naming_match"] is True
    assert e["evidence"]["declared"] is False


def test_sample_join_match_rate():
    samples = {
        "child": {"columns": {"fk": {"sample_values": ["A", "B", "C", "X"]}}},
        "parent": {"columns": {"pk": {"sample_values": ["A", "B", "C"]}}},
    }
    result = sample_join(samples, "child", "fk", "parent", "pk")
    assert result["matched"] == 3
    assert result["orphans"] == 1
    assert result["coverage"] == "partial"


def test_sample_join_no_data_returns_none_coverage():
    samples = {"child": {"columns": {}}, "parent": {"columns": {}}}
    result = sample_join(samples, "child", "fk", "parent", "pk")
    assert result["coverage"] == "none"
    assert result["matched"] == 0
    assert result["orphans"] == 0


def test_rollup_confidence():
    # declared + clean sample join => high
    assert rollup_confidence(declared=True, naming_match=False,
                              sample_join={"coverage": "partial", "matched": 100, "orphans": 0}) == "high"
    # naming-only + clean partial sample => medium
    assert rollup_confidence(declared=False, naming_match=True,
                              sample_join={"coverage": "partial", "matched": 482, "orphans": 0}) == "medium"
    # naming-only + orphans present => low
    assert rollup_confidence(declared=False, naming_match=True,
                              sample_join={"coverage": "partial", "matched": 100, "orphans": 5}) == "low"
    # no evidence => low
    assert rollup_confidence(declared=False, naming_match=False,
                              sample_join={"coverage": "none", "matched": 0, "orphans": 0}) == "low"


def test_types_compatible_helper():
    sys.path.insert(0, str(Path(__file__).parent.parent))
    from extract_edges import _types_compatible
    assert _types_compatible("CHAR(8)", "VARCHAR2(8)") is True
    assert _types_compatible("NUMBER(4,0)", "INTEGER") is True
    assert _types_compatible("CHAR(8)", "NUMBER(4,0)") is False
    assert _types_compatible("DATE", "TIMESTAMP") is True
    assert _types_compatible("", "CHAR(8)") is True  # missing -> permissive


def test_backup_table_detection():
    sys.path.insert(0, str(Path(__file__).parent.parent))
    from extract_edges import _is_backup_table
    assert _is_backup_table("ABA0001_SECURITY_MASTER_20230428") is True
    assert _is_backup_table("ABA0001_SECURITY_MASTER_R2_20231212") is True
    assert _is_backup_table("ABA0001_BKP") is True
    assert _is_backup_table("STG_FOO") is False  # leading STG is not a clone marker
    assert _is_backup_table("FOO_STG") is True
    assert _is_backup_table("ABA0001_SECURITY_MASTER") is False


def test_propose_implicit_fks_excludes_backup_parents():
    sources = [
        {
            "name": "CHILD",
            "columns": [{"name": "ABA0001_X", "type": "CHAR(8)", "nullable": False, "default": None}],
            "primary_key": [],
            "declared_fks": [],
        },
        {
            "name": "ABA0001_PARENT",
            "columns": [{"name": "ABA0001_X", "type": "CHAR(8)", "nullable": False, "default": None}],
            "primary_key": ["ABA0001_X"],
            "declared_fks": [],
        },
        {
            "name": "ABA0001_PARENT_20230428",
            "columns": [{"name": "ABA0001_X", "type": "CHAR(8)", "nullable": False, "default": None}],
            "primary_key": ["ABA0001_X"],
            "declared_fks": [],
        },
    ]
    edges = propose_implicit_fks(sources)
    assert len(edges) == 1
    assert edges[0]["to"]["table"] == "ABA0001_PARENT"


def test_propose_implicit_fks_skips_incompatible_types():
    sources = [
        {
            "name": "CHILD",
            "columns": [{"name": "X_CODE", "type": "NUMBER(4,0)", "nullable": False, "default": None}],
            "primary_key": [],
            "declared_fks": [],
        },
        {
            "name": "PARENT",
            "columns": [{"name": "X_CODE", "type": "CHAR(8)", "nullable": False, "default": None}],
            "primary_key": ["X_CODE"],
            "declared_fks": [],
        },
    ]
    edges = propose_implicit_fks(sources)
    assert edges == []


def test_sample_join_disjoint_coverage():
    samples = {
        "child": {"columns": {"fk": {"sample_values": ["A", "B"]}}},
        "parent": {"columns": {"pk": {"sample_values": ["X", "Y"]}}},
    }
    result = sample_join(samples, "child", "fk", "parent", "pk")
    assert result["matched"] == 0
    assert result["orphans"] == 2
    assert result["coverage"] == "disjoint"
