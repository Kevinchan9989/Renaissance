import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from extract_inventory import extract_from_xlsx

FIXTURES = Path(__file__).parent.parent / "fixtures"

def test_returns_dict_keyed_by_table_name():
    inv = extract_from_xlsx(FIXTURES / "inventory_min.xlsx")
    assert "ABA0001_SECURITY_MASTER" in inv
    assert inv["ABA0001_SECURITY_MASTER"]["domain"] == "eApps"
    assert inv["ABA0001_SECURITY_MASTER"]["wave"] == "R1"
    assert inv["ABA0001_SECURITY_MASTER"]["draft_to_migrate"] == "Y"

def test_handles_tbd():
    inv = extract_from_xlsx(FIXTURES / "inventory_min.xlsx")
    assert inv["cm_aprm_user"]["draft_to_migrate"] == "TBD"

def test_skips_blank_rows():
    inv = extract_from_xlsx(FIXTURES / "inventory_min.xlsx")
    assert None not in inv

def test_raises_on_missing_header(tmp_path):
    import openpyxl
    p = tmp_path / "missing_header.xlsx"
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "List of Source Tables"
    # Missing 'Module / Domain' header
    ws.append(['No.', 'Table Name', 'Source Schema', 'To Migrate', 'Migrate in'])
    ws.append([1, 'X_TABLE', 'MNETD', 'Y', 'R1'])
    wb.save(str(p))
    import pytest
    with pytest.raises(ValueError, match="Module / Domain"):
        extract_from_xlsx(p)
