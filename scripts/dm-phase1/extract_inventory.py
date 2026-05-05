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


def _col(idx, name):
    if name not in idx:
        raise ValueError(
            f"Header column {name!r} not found in 'List of Source Tables' sheet; "
            f"got headers={list(idx)}"
        )
    return idx[name]


def extract_from_xlsx(path):
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb[SHEET_NAME]
    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        return {}
    header_row = rows[0]
    idx = {h: i for i, h in enumerate(header_row) if h}
    # Resolve all required headers up-front; raise loudly if any drift.
    name_i = _col(idx, "Table Name")
    domain_i = _col(idx, "Module / Domain")
    schema_i = _col(idx, "Source Schema")
    mig_i = _col(idx, "To Migrate")
    wave_i = _col(idx, "Migrate in")
    result = {}
    for r in rows[1:]:
        # Defensive against ragged rows: openpyxl can produce short tuples
        # if trailing cells are unset. Pad with None.
        if name_i >= len(r):
            continue
        name = r[name_i]
        if not name or not str(name).strip():
            continue
        def _safe(i):
            return r[i] if i < len(r) else None
        result[str(name).strip()] = {
            "domain": _str(_safe(domain_i)),
            "schema": _str(_safe(schema_i)),
            "draft_to_migrate": _str(_safe(mig_i)).upper(),
            "wave": _str(_safe(wave_i)).upper(),
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
