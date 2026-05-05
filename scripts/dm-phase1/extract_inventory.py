"""Extracts the v0.01 'List of Source Tables' sheet -> per-table inventory dict."""
import json
import sys
from pathlib import Path
import openpyxl

REPO_ROOT = Path(__file__).parent.parent.parent
DEFAULT_XLSX = REPO_ROOT / "gsib-migration" / "workspace" / "MAS_OMEGA_DM_Conversion_Mapping_Specification _v0.01.xlsx"
SHEET_NAME = "List of Source Tables"


def _str(v):
    return "" if v is None else str(v).strip()


def extract_from_xlsx(path):
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb[SHEET_NAME]
    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        return {}
    header_row = rows[0]
    idx = {h: i for i, h in enumerate(header_row) if h}
    result = {}
    for r in rows[1:]:
        # Read by header name with safe fallback to positional indexes
        name_idx = idx.get("Table Name", 1)
        name = r[name_idx] if name_idx < len(r) else None
        if not name or not str(name).strip():
            continue
        result[str(name).strip()] = {
            "domain": _str(r[idx.get("Module / Domain", 2)]) if idx.get("Module / Domain", 2) < len(r) else "",
            "schema": _str(r[idx.get("Source Schema", 3)]) if idx.get("Source Schema", 3) < len(r) else "",
            "draft_to_migrate": _str(r[idx.get("To Migrate", 4)]).upper() if idx.get("To Migrate", 4) < len(r) else "",
            "wave": _str(r[idx.get("Migrate in", 5)]).upper() if idx.get("Migrate in", 5) < len(r) else "",
        }
    return result


def main(argv):
    out_path = REPO_ROOT / "docs" / "superpowers" / "specs" / "dm-migration-v0.2" / "phase1" / "inventory.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    inv = extract_from_xlsx(DEFAULT_XLSX)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(inv, f, indent=2)
    print(f"Wrote {len(inv)} inventory entries -> {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
