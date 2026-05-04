import json
import sys
import pytest
from pathlib import Path

# Make scripts/dm-phase1 importable
sys.path.insert(0, str(Path(__file__).parent.parent))
from validate_scope_map import validate

FIXTURES = Path(__file__).parent.parent / "fixtures"

def test_minimal_valid_passes():
    with (FIXTURES / "scope_map_minimal.json").open() as f:
        doc = json.load(f)
    validate(doc)  # raises on failure

def test_missing_required_field_fails():
    doc = {"version": "0.2-draft"}
    with pytest.raises(Exception):
        validate(doc)

def test_invalid_enum_fails():
    doc = {
        "version": "0.2-draft",
        "generated_at": "2026-05-04T12:00:00Z",
        "scope": "R3",
        "tables": [], "edges": [], "source_target_matrix": [], "questions_open": []
    }
    with pytest.raises(Exception):
        validate(doc)
