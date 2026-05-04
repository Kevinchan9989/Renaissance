"""Validates a scope-relationship-map JSON against the schema in dm-tool/."""
import json
import sys
from pathlib import Path
from jsonschema import validate as _jsonschema_validate, Draft7Validator

REPO_ROOT = Path(__file__).parent.parent.parent
SCHEMA_PATH = REPO_ROOT / "dm-tool" / "src" / "schemas" / "scope-relationship-map.schema.json"


def load_schema():
    with SCHEMA_PATH.open() as f:
        return json.load(f)


def validate(doc):
    schema = load_schema()
    Draft7Validator.check_schema(schema)
    _jsonschema_validate(instance=doc, schema=schema)


def main(argv):
    if len(argv) != 2:
        print("Usage: validate_scope_map.py <path-to-json>")
        return 2
    with open(argv[1]) as f:
        doc = json.load(f)
    try:
        validate(doc)
    except Exception as e:
        print(f"INVALID: {e}")
        return 1
    print(f"VALID: {argv[1]}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
