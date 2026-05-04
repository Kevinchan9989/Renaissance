import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from extract_source_ddl import extract_from_script_file

FIXTURES = Path(__file__).parent.parent / "fixtures"

def test_extracts_table_count():
    tables = extract_from_script_file(FIXTURES / "source_script_min.json")
    assert len(tables) == 2

def test_extracts_columns():
    tables = extract_from_script_file(FIXTURES / "source_script_min.json")
    secmast = next(t for t in tables if t["name"] == "ABA0001_SECURITY_MASTER")
    assert len(secmast["columns"]) == 2
    assert secmast["columns"][0]["name"] == "ABA0001_SECURITY_CODE"
    assert secmast["columns"][0]["nullable"] is False  # 'No' -> False
    assert secmast["columns"][1]["nullable"] is True   # 'Yes' -> True

def test_extracts_primary_key():
    tables = extract_from_script_file(FIXTURES / "source_script_min.json")
    secmast = next(t for t in tables if t["name"] == "ABA0001_SECURITY_MASTER")
    assert secmast["primary_key"] == ["ABA0001_SECURITY_CODE", "ABA0001_ISSUE_NO"]

def test_no_pk_returns_empty_list():
    tables = extract_from_script_file(FIXTURES / "source_script_min.json")
    aba0007 = next(t for t in tables if t["name"] == "ABA0007_DETAIL_AUCTION_RESULT")
    assert aba0007["primary_key"] == []

def test_emits_side_source():
    tables = extract_from_script_file(FIXTURES / "source_script_min.json")
    assert all(t["side"] == "source" for t in tables)

def test_keeps_schema():
    tables = extract_from_script_file(FIXTURES / "source_script_min.json")
    assert all(t["schema"] == "MNETD" for t in tables)

def test_ignores_non_oracle_scripts():
    tables = extract_from_script_file(FIXTURES / "postgresql_script_min.json")
    assert tables == []
