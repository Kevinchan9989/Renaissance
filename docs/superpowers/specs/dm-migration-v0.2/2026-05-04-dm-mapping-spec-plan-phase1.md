# DM Mapping Spec v0.2 — Phase 1 Implementation Plan

> ⚠️ **PARTIALLY SUPERSEDED 2026-05-05.** Tasks 1–4 of this plan are STILL IN EFFECT
> (commits `4d266ee`, `e177e17`, `6161f1e`, `27356ad`, `74a9b92`). Tasks 5–17 below
> have been REPLACED by `2026-05-05-dm-mapping-spec-plan-phase1-lean.md`. Reason: the
> original plan built parallel data structures (a unified `scope-relationship-map.json`)
> that duplicated 80% of `omega-ddl-current.dict.json`. The lean plan reuses existing
> files as the source of truth and only creates sidecars for genuinely new information.
> See the lean plan for current Tasks LT1–LT9.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce `phase1/scope-relationship-map.{md,json}` for the R1 wave — an audited, evidence-cited inventory of every R1 source table with its migration decision, declared & implicit FK relationships, business hierarchies, sample-data validation, row-volume estimates, and a cross-system source→target matrix; plus a Q&A backlog (`open-questions.md`) and verbatim Q&A archives.

**Architecture:** Small Python extractor scripts (no framework) read source DDL (`gsib-migration/workspace/script-*.json`), target DDL (`omega-ddl-current.dict.json`), v0.01 inventory (xlsx), and dm-tool sample data (`backups/workspace.json`); a combiner emits a draft JSON; a sample-join validator verifies FK candidates against attached samples; renderers produce markdown views. JSON validates against a JSON Schema kept inside `dm-tool/` for downstream tool consumption. Q&A iteration (NotebookLM, legacy-source Claude session, OMEGA DB) closes uncertainty through three append-only archives.

**Tech Stack:** Python 3.12 (already installed at `C:\Users\ECQ1025\AppData\Local\Programs\Python\Python312\`), `openpyxl` for xlsx parsing (install via `pip install openpyxl jsonschema`), `jsonschema` for validation. No additional infrastructure.

**Scope of Phase 1:** ~99 R1 source tables (eApps R1 + SBA R1 TBDs + Syndication R1 TBDs + System Batch Job R1 + MLOG R1) → ~46 mappable target tables (cm.* + iss.* base, excluding `_t` audit twins and `stg.*` runtime-only).

**Out of Phase 1 scope (deferred to later phase plans):**
- Methodology playbook authoring (Phase 2)
- dm-tool extension code (Phases 3+)
- v0.01 round-trip regression test (Phase 4)
- v0.2.xlsx export (Phase 5)

---

## File structure

### Created in this plan

| Path | Responsibility |
|------|----------------|
| `dm-tool/src/schemas/scope-relationship-map.schema.json` | JSON Schema for scope-relationship-map (truth source for shape) |
| `scripts/dm-phase1/__init__.py` | Marks dir as a package for tests |
| `scripts/dm-phase1/extract_source_ddl.py` | Reads `gsib-migration/workspace/script-*.json` → emits per-table records (cols, declared FKs) |
| `scripts/dm-phase1/extract_target_ddl.py` | Reads `omega-ddl-current.dict.json` → emits per-table records (cols, declared FKs, schema) |
| `scripts/dm-phase1/extract_inventory.py` | Reads v0.01 *List of Source Tables* sheet → emits per-table inventory (domain, wave, draft Y/N) |
| `scripts/dm-phase1/extract_sample_data.py` | Reads `backups/workspace.json` → emits per-table sample column values + row-count estimates |
| `scripts/dm-phase1/build_scope_map_draft.py` | Combines the above → emits `scope-relationship-map.json` (draft, structural facts only) |
| `scripts/dm-phase1/validate_scope_map.py` | Validates emitted JSON against schema |
| `scripts/dm-phase1/sample_join_validate.py` | For each candidate FK, attempts join on attached samples; updates JSON with match/orphan stats |
| `scripts/dm-phase1/render_scope_map_md.py` | JSON → human-readable markdown (`scope-relationship-map.md`) |
| `scripts/dm-phase1/render_source_target_matrix.py` | JSON → 2-D heatmap markdown (`source-target-matrix.md`) |
| `scripts/dm-phase1/generate_open_questions.py` | JSON → grouped backlog (`open-questions.md`) split by channel |
| `scripts/dm-phase1/merge_qa_answers.py` | Reads archive YAMLs → updates JSON evaluations |
| `scripts/dm-phase1/tests/test_extract_source_ddl.py` | Unit test for source DDL extractor |
| `scripts/dm-phase1/tests/test_extract_target_ddl.py` | Unit test for target DDL extractor |
| `scripts/dm-phase1/tests/test_extract_inventory.py` | Unit test for inventory extractor |
| `scripts/dm-phase1/tests/test_extract_sample_data.py` | Unit test for sample-data extractor |
| `scripts/dm-phase1/tests/test_build_scope_map_draft.py` | Unit test for combiner |
| `scripts/dm-phase1/tests/test_sample_join_validate.py` | Unit test for join validator |
| `scripts/dm-phase1/tests/test_render_scope_map_md.py` | Unit test for renderer |
| `scripts/dm-phase1/fixtures/source_script_min.json` | Minimal fixture mimicking `script-*.json` |
| `scripts/dm-phase1/fixtures/target_dict_min.json` | Minimal fixture mimicking `omega-ddl-current.dict.json` |
| `scripts/dm-phase1/fixtures/inventory_min.xlsx` | Minimal xlsx fixture mimicking *List of Source Tables* |
| `scripts/dm-phase1/fixtures/workspace_min.json` | Minimal fixture mimicking `backups/workspace.json` |
| `scripts/dm-phase1/requirements.txt` | `openpyxl`, `jsonschema`, `pytest` pinned versions |
| `docs/superpowers/specs/dm-migration-v0.2/phase1/scope-relationship-map.json` | Generated artifact (draft → final) |
| `docs/superpowers/specs/dm-migration-v0.2/phase1/scope-relationship-map.md` | Generated artifact |
| `docs/superpowers/specs/dm-migration-v0.2/phase1/source-target-matrix.md` | Generated artifact |
| `docs/superpowers/specs/dm-migration-v0.2/phase1/open-questions.md` | Generated artifact |
| `docs/superpowers/specs/dm-migration-v0.2/phase1/notebooklm-archive/q-NNN-*.md` | Q&A archives (one per question) |
| `docs/superpowers/specs/dm-migration-v0.2/phase1/legacy-source-archive/q-NNN-*.md` | Q&A archives |
| `docs/superpowers/specs/dm-migration-v0.2/phase1/db-queries-archive/q-NNN-*.md` | Q&A archives |

### Pre-existing (read-only, do NOT modify)

- `gsib-migration/workspace/MAS_OMEGA_DM_Conversion_Mapping_Specification _v0.01.xlsx`
- `gsib-migration/workspace/omega-ddl-current.dict.json`
- `gsib-migration/workspace/script-*.json` (15 files)
- `backups/workspace.json`
- `docs/superpowers/specs/dm-migration-v0.2/2026-05-04-dm-mapping-spec-design.md` (the spec)
- `docs/superpowers/specs/dm-migration-v0.2/phase1/grounding-decisions.md` (D1–D7 from grounding)
- `docs/superpowers/specs/dm-migration-v0.2/phase1/notebooklm-archive/grounding/g001..g003` (grounding archive — already created)

---

## Section A — Scaffolding

### Task 1: Create the JSON Schema

**Files:**
- Create: `dm-tool/src/schemas/scope-relationship-map.schema.json`

- [ ] **Step 1: Write the schema file**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Scope Relationship Map",
  "type": "object",
  "required": ["version", "generated_at", "scope", "tables", "edges", "source_target_matrix", "questions_open"],
  "properties": {
    "version": { "type": "string" },
    "generated_at": { "type": "string", "format": "date-time" },
    "scope": { "type": "string", "enum": ["R1", "R2", "ALL"] },
    "tables": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "domain", "wave", "decision"],
        "properties": {
          "name": { "type": "string" },
          "domain": { "type": "string" },
          "schema": { "type": "string" },
          "wave": { "type": "string", "enum": ["R1", "R2"] },
          "side": { "type": "string", "enum": ["source", "target"] },
          "description": { "type": "string" },
          "reviewed": { "type": "boolean" },
          "columns": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["name", "type", "nullable"],
              "properties": {
                "name": { "type": "string" },
                "type": { "type": "string" },
                "nullable": { "type": "boolean" },
                "default": { "type": ["string", "null"] },
                "explanation": { "type": "string" },
                "possible_values": { "type": "string" },
                "comprehension_status": { "type": "string", "enum": ["reviewed", "pending", "skip"] },
                "comprehension_evidence_refs": { "type": "array", "items": { "type": "string" } }
              }
            }
          },
          "primary_key": { "type": "array", "items": { "type": "string" } },
          "row_volume_estimate": {
            "type": "object",
            "properties": {
              "value": { "type": ["integer", "null"] },
              "source": { "type": "string", "enum": ["sample", "omega-db", "estimate", "unknown"] }
            }
          },
          "decision": {
            "type": "object",
            "required": ["to_migrate"],
            "properties": {
              "to_migrate": { "type": "string", "enum": ["Y", "N", "TBD"] },
              "rationale": { "type": "string" },
              "evidence_refs": { "type": "array", "items": { "type": "string" } },
              "needs_user_review": { "type": "boolean" }
            }
          }
        }
      }
    },
    "edges": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "kind", "from", "to", "evidence", "confidence"],
        "properties": {
          "id": { "type": "string" },
          "kind": { "type": "string", "enum": ["fk-declared", "fk-implicit", "business-hierarchy"] },
          "from": {
            "type": "object",
            "required": ["table", "column"],
            "properties": {
              "table": { "type": "string" },
              "column": { "type": "string" }
            }
          },
          "to": {
            "type": "object",
            "required": ["table", "column"],
            "properties": {
              "table": { "type": "string" },
              "column": { "type": "string" }
            }
          },
          "cardinality": { "type": "string", "enum": ["1:1", "1:N", "N:1", "N:N", "unknown"] },
          "evidence": {
            "type": "object",
            "properties": {
              "ddl_declared": { "type": "boolean" },
              "naming_match": { "type": "boolean" },
              "nlm_archive_id": { "type": ["string", "null"] },
              "legacy_archive_id": { "type": ["string", "null"] },
              "sample_join": {
                "type": "object",
                "properties": {
                  "matched": { "type": "integer" },
                  "orphans": { "type": "integer" },
                  "coverage": { "type": "string", "enum": ["full", "partial", "none", "disjoint"] }
                }
              },
              "db_validation": {
                "type": "object",
                "properties": {
                  "status": { "type": "string", "enum": ["pending_user_run", "passed", "failed", "n/a"] },
                  "query_id": { "type": ["string", "null"] }
                }
              }
            }
          },
          "confidence": { "type": "string", "enum": ["high", "medium", "low"] },
          "needs_user_review": { "type": "boolean" }
        }
      }
    },
    "source_target_matrix": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["source", "targets"],
        "properties": {
          "source": { "type": "string" },
          "targets": { "type": "array", "items": { "type": "string" } }
        }
      }
    },
    "questions_open": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "channel", "prompt"],
        "properties": {
          "id": { "type": "string" },
          "channel": { "type": "string", "enum": ["notebooklm", "legacy-source", "omega-db", "user"] },
          "prompt": { "type": "string" },
          "for_table": { "type": ["string", "null"] },
          "for_edge": { "type": ["string", "null"] }
        }
      }
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add dm-tool/src/schemas/scope-relationship-map.schema.json
git commit -m "feat(dm-phase1): add JSON schema for scope-relationship-map"
```

---

### Task 2: Create Python package skeleton + requirements

**Files:**
- Create: `scripts/dm-phase1/__init__.py`
- Create: `scripts/dm-phase1/requirements.txt`
- Create: `scripts/dm-phase1/tests/__init__.py`

- [ ] **Step 1: Create empty package marker**

Write file `scripts/dm-phase1/__init__.py` with content:
```python
```

Write file `scripts/dm-phase1/tests/__init__.py` with content:
```python
```

- [ ] **Step 2: Pin requirements**

Write file `scripts/dm-phase1/requirements.txt`:
```
openpyxl==3.1.2
jsonschema==4.21.1
pytest==8.0.0
```

- [ ] **Step 3: Install into a venv**

```bash
cd scripts/dm-phase1
python -m venv .venv
.venv/Scripts/python -m pip install -r requirements.txt
```

Expected: 3 packages install without errors.

- [ ] **Step 4: Commit**

```bash
git add scripts/dm-phase1/__init__.py scripts/dm-phase1/tests/__init__.py scripts/dm-phase1/requirements.txt
echo ".venv/" >> scripts/dm-phase1/.gitignore
git add scripts/dm-phase1/.gitignore
git commit -m "feat(dm-phase1): scaffold Python package + pinned deps"
```

---

### Task 3: Schema validator

**Files:**
- Create: `scripts/dm-phase1/validate_scope_map.py`
- Create: `scripts/dm-phase1/tests/test_validate_scope_map.py`
- Create: `scripts/dm-phase1/fixtures/scope_map_minimal.json`

- [ ] **Step 1: Write fixture (minimal valid scope map)**

`scripts/dm-phase1/fixtures/scope_map_minimal.json`:
```json
{
  "version": "0.2-draft",
  "generated_at": "2026-05-04T12:00:00Z",
  "scope": "R1",
  "tables": [],
  "edges": [],
  "source_target_matrix": [],
  "questions_open": []
}
```

- [ ] **Step 2: Write the failing test**

`scripts/dm-phase1/tests/test_validate_scope_map.py`:
```python
import json
import pytest
from pathlib import Path
from scripts.dm_phase1.validate_scope_map import validate

FIXTURES = Path(__file__).parent.parent / "fixtures"

def test_minimal_valid_passes():
    with (FIXTURES / "scope_map_minimal.json").open() as f:
        doc = json.load(f)
    validate(doc)  # raises on failure

def test_missing_required_field_fails():
    doc = {
        "version": "0.2-draft",
        # missing generated_at, scope, etc.
    }
    with pytest.raises(Exception):
        validate(doc)

def test_invalid_enum_fails():
    doc = {
        "version": "0.2-draft",
        "generated_at": "2026-05-04T12:00:00Z",
        "scope": "R3",  # invalid enum
        "tables": [], "edges": [], "source_target_matrix": [], "questions_open": []
    }
    with pytest.raises(Exception):
        validate(doc)
```

- [ ] **Step 3: Run test to verify it fails**

```bash
cd scripts/dm-phase1
.venv/Scripts/python -m pytest tests/test_validate_scope_map.py -v
```

Expected: FAIL — `ModuleNotFoundError: No module named 'scripts.dm_phase1.validate_scope_map'`

- [ ] **Step 4: Implement the validator**

Note on import path: tests import as `scripts.dm_phase1.validate_scope_map` — but Python doesn't like the hyphen in `dm-phase1`. Rename: keep folder as `scripts/dm-phase1/` on disk, but tests run with `cd scripts/dm-phase1 && pytest tests/` and the test imports become local: `from validate_scope_map import validate`.

Edit the test file to use local imports instead:

`scripts/dm-phase1/tests/test_validate_scope_map.py`:
```python
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
    validate(doc)

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
```

`scripts/dm-phase1/validate_scope_map.py`:
```python
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
```

- [ ] **Step 5: Run tests to verify they pass**

```bash
cd scripts/dm-phase1
.venv/Scripts/python -m pytest tests/test_validate_scope_map.py -v
```

Expected: 3 passed.

- [ ] **Step 6: Smoke-test the CLI**

```bash
cd scripts/dm-phase1
.venv/Scripts/python validate_scope_map.py fixtures/scope_map_minimal.json
```

Expected: `VALID: fixtures/scope_map_minimal.json`

- [ ] **Step 7: Commit**

```bash
git add scripts/dm-phase1/validate_scope_map.py scripts/dm-phase1/fixtures/scope_map_minimal.json scripts/dm-phase1/tests/test_validate_scope_map.py
git commit -m "feat(dm-phase1): scope-map JSON schema validator"
```

---

## Section B — Source DDL extraction

### Task 4: Extract source DDL from script-*.json

**Files:**
- Create: `scripts/dm-phase1/extract_source_ddl.py`
- Create: `scripts/dm-phase1/tests/test_extract_source_ddl.py`
- Create: `scripts/dm-phase1/fixtures/source_script_min.json`

**Background:** `gsib-migration/workspace/script-*.json` files are dm-tool exports. **Important quirk discovered during execution:** dm-tool stores all parsed DDL tables in `data.targets` regardless of whether the file holds source-side or target-side schemas. `data.sources` is always empty. The source-vs-target distinction lives at the file level via the `type` field:

- `type: "oracle"` scripts hold legacy SOURCE-side DDL (e.g., `script-00-BE_MNETD.json`, `script-04-FE_TRI1.json`)
- `type: "postgresql"` scripts hold TARGET-side DDL (OMEGA schemas)

For Task 4 (source DDL), we filter to `type == "oracle"` files only and read their `data.targets` arrays. We dedupe by `tableName` across the (typically 2) oracle script files.

Real data also uses `"Yes"`/`"No"` (not `"Y"`/`"N"`) for column `nullable` values; the `_coerce_nullable` helper handles both.

- [ ] **Step 1: Inspect a real script-*.json to confirm shape (already discovered; this is a sanity check)**

Run once interactively:
```bash
cd "/c/Users/ECQ1025/Downloads/MAS Securities/MAS DM/Renaissance"
python -c "import json; d=json.load(open('gsib-migration/workspace/script-00-BE_MNETD.json')); print('type=', d.get('type'), 'sources=', len(d['data'].get('sources',[])), 'targets=', len(d['data'].get('targets',[])))"
```

Expected output: `type= oracle sources= 0 targets= 104` (or similar non-zero target count).

If the shape differs from this expectation, STOP and report.

- [ ] **Step 2: Write fixture**

`scripts/dm-phase1/fixtures/source_script_min.json`:
```json
{
  "id": "test-script",
  "name": "test",
  "type": "oracle",
  "data": {
    "sources": [],
    "targets": [
      {
        "id": 1,
        "schema": "MNETD",
        "tableName": "ABA0001_SECURITY_MASTER",
        "description": "Security master legacy table",
        "columns": [
          { "name": "ABA0001_SECURITY_CODE", "type": "CHAR(8)", "nullable": "No", "default": null, "explanation": "", "mapping": "" },
          { "name": "ABA0001_ISIN_CODE", "type": "CHAR(12)", "nullable": "Yes", "default": null, "explanation": "", "mapping": "" }
        ],
        "constraints": [
          { "name": "PK_ABA0001", "type": "Primary Key", "localCols": "ABA0001_SECURITY_CODE,ABA0001_ISSUE_NO" }
        ]
      },
      {
        "id": 2,
        "schema": "MNETD",
        "tableName": "ABA0007_DETAIL_AUCTION_RESULT",
        "description": "Auction result",
        "columns": [
          { "name": "ABA0007_SECURITY_CODE", "type": "CHAR(8)", "nullable": "No", "default": null, "explanation": "", "mapping": "" }
        ],
        "constraints": []
      }
    ]
  },
  "createdAt": 0,
  "updatedAt": 0
}
```

Also create a fixture for a non-oracle script that should be ignored by the source extractor:

`scripts/dm-phase1/fixtures/postgresql_script_min.json`:
```json
{
  "id": "pg-script",
  "name": "pg-test",
  "type": "postgresql",
  "data": {
    "sources": [],
    "targets": [
      {
        "id": 1,
        "schema": "iss",
        "tableName": "iss_security_master",
        "columns": [
          { "name": "uuid", "type": "VARCHAR(36)", "nullable": "No", "default": null, "explanation": "", "mapping": "" }
        ],
        "constraints": []
      }
    ]
  },
  "createdAt": 0,
  "updatedAt": 0
}
```

- [ ] **Step 3: Write the failing test**

`scripts/dm-phase1/tests/test_extract_source_ddl.py`:
```python
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
    assert secmast["columns"][0]["nullable"] is False  # 'N' -> False
    assert secmast["columns"][1]["nullable"] is True   # 'Y' -> True

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
```

- [ ] **Step 4: Run test to verify failure**

```bash
cd scripts/dm-phase1
.venv/Scripts/python -m pytest tests/test_extract_source_ddl.py -v
```

Expected: 7 errors — `ModuleNotFoundError`.

- [ ] **Step 5: Implement the extractor**

`scripts/dm-phase1/extract_source_ddl.py`:
```python
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
                    # Preserve any explanation/possibleValues already authored in
                    # dm-tool. dm-tool uses camelCase 'possibleValues' on its column
                    # type; we normalize to snake_case 'possible_values' here.
                    "explanation": c.get("explanation") or "",
                    "possible_values": c.get("possibleValues") or "",
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
    print(f"Wrote {len(tables)} source tables → {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
```

- [ ] **Step 6: Run tests to verify pass**

```bash
cd scripts/dm-phase1
.venv/Scripts/python -m pytest tests/test_extract_source_ddl.py -v
```

Expected: 7 passed.

- [ ] **Step 7: Smoke run on real data**

```bash
cd scripts/dm-phase1
.venv/Scripts/python extract_source_ddl.py
```

Expected: `Wrote N source tables → .../build/source-tables.json` where N is the unique count across the **2 oracle-type** script-*.json files (`script-00-BE_MNETD.json` and `script-04-FE_TRI1.json`). Likely ~150–230 unique tables. Inspect output to verify shape.

- [ ] **Step 8: Add build/ to gitignore (intermediate artifacts not committed)**

```bash
echo "build/" >> scripts/dm-phase1/.gitignore
```

- [ ] **Step 9: Commit**

```bash
git add scripts/dm-phase1/extract_source_ddl.py scripts/dm-phase1/tests/test_extract_source_ddl.py scripts/dm-phase1/fixtures/source_script_min.json scripts/dm-phase1/fixtures/postgresql_script_min.json scripts/dm-phase1/.gitignore
git commit -m "feat(dm-phase1): extract source DDL from oracle-type script-*.json"
```

---

## Section C — Target DDL extraction

### Task 5: Extract target DDL from omega-ddl-current.dict.json

**Files:**
- Create: `scripts/dm-phase1/extract_target_ddl.py`
- Create: `scripts/dm-phase1/tests/test_extract_target_ddl.py`
- Create: `scripts/dm-phase1/fixtures/target_dict_min.json`

**Background:** `gsib-migration/workspace/omega-ddl-current.dict.json` keys are `"schema.table_name"` (e.g., `"cm.cm_master_code"`); values are dicts with `description`, `types` (column→type map), `explanations`, `possible_values`. The shape was confirmed in `.tmp-omega-schemas.py` output. Spec decision D5: exclude all `_t` tables. Spec decision D7: also exclude `stg.*` (runtime-only).

- [ ] **Step 1: Write fixture**

`scripts/dm-phase1/fixtures/target_dict_min.json`:
```json
{
  "cm.cm_master_code": {
    "description": "Master code lookup",
    "reviewed": true,
    "types": {
      "uuid": "VARCHAR(36) NOT NULL",
      "category_uuid": "VARCHAR(36) NOT NULL",
      "code": "VARCHAR(50) NOT NULL"
    },
    "explanations": {
      "uuid": "Surrogate primary key, generated on insert",
      "code": "Business code value e.g. 'SECTYPE_TBILL'"
    },
    "possible_values": {
      "code": "SECTYPE_TBILL, SECTYPE_SGS, APPSRC_*, RECERR_*"
    }
  },
  "cm.cm_master_code_t": {
    "description": "Audit twin",
    "reviewed": false,
    "types": { "uuid": "VARCHAR(36)" }
  },
  "iss.iss_security_master": {
    "description": "Security master",
    "reviewed": false,
    "types": {
      "uuid": "VARCHAR(36) NOT NULL",
      "security_code": "VARCHAR(8) NOT NULL"
    },
    "explanations": {},
    "possible_values": {}
  },
  "stg.stg_eapps_in_closingprice": {
    "description": "Interface staging",
    "reviewed": false,
    "types": { "raw_line": "TEXT" }
  }
}
```

- [ ] **Step 2: Write the failing test**

`scripts/dm-phase1/tests/test_extract_target_ddl.py`:
```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from extract_target_ddl import extract_from_dict_file

FIXTURES = Path(__file__).parent.parent / "fixtures"

def test_excludes_t_audit_twins():
    tables = extract_from_dict_file(FIXTURES / "target_dict_min.json")
    names = [t["name"] for t in tables]
    assert "cm_master_code_t" not in names

def test_excludes_stg_schema():
    tables = extract_from_dict_file(FIXTURES / "target_dict_min.json")
    schemas = {t["schema"] for t in tables}
    assert "stg" not in schemas

def test_keeps_base_tables():
    tables = extract_from_dict_file(FIXTURES / "target_dict_min.json")
    names = [t["name"] for t in tables]
    assert "cm_master_code" in names
    assert "iss_security_master" in names

def test_parses_columns_with_nullable():
    tables = extract_from_dict_file(FIXTURES / "target_dict_min.json")
    cmc = next(t for t in tables if t["name"] == "cm_master_code")
    cols = {c["name"]: c for c in cmc["columns"]}
    assert cols["uuid"]["nullable"] is False
    assert "VARCHAR(36)" in cols["uuid"]["type"]

def test_emits_side_target():
    tables = extract_from_dict_file(FIXTURES / "target_dict_min.json")
    assert all(t["side"] == "target" for t in tables)

def test_preserves_table_description():
    tables = extract_from_dict_file(FIXTURES / "target_dict_min.json")
    cmc = next(t for t in tables if t["name"] == "cm_master_code")
    assert cmc["description"] == "Master code lookup"

def test_preserves_reviewed_flag():
    tables = extract_from_dict_file(FIXTURES / "target_dict_min.json")
    by_name = {t["name"]: t for t in tables}
    assert by_name["cm_master_code"]["reviewed"] is True
    assert by_name["iss_security_master"]["reviewed"] is False

def test_preserves_column_explanations():
    tables = extract_from_dict_file(FIXTURES / "target_dict_min.json")
    cmc = next(t for t in tables if t["name"] == "cm_master_code")
    cols = {c["name"]: c for c in cmc["columns"]}
    assert "Surrogate primary key" in cols["uuid"].get("explanation", "")
    assert "SECTYPE_TBILL" in cols["code"].get("possible_values", "")

def test_columns_with_no_explanation_use_empty_string():
    tables = extract_from_dict_file(FIXTURES / "target_dict_min.json")
    iss = next(t for t in tables if t["name"] == "iss_security_master")
    cols = {c["name"]: c for c in iss["columns"]}
    assert cols["uuid"].get("explanation", "") == ""
```

- [ ] **Step 3: Run to verify failure**

```bash
cd scripts/dm-phase1
.venv/Scripts/python -m pytest tests/test_extract_target_ddl.py -v
```

Expected: 5 errors.

- [ ] **Step 4: Implement extractor**

`scripts/dm-phase1/extract_target_ddl.py`:
```python
"""Extracts target-side table records from omega-ddl-current.dict.json.

Excludes _t audit twins (per grounding D5) and stg.* runtime-only (per D7).
"""
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent.parent
DEFAULT_DICT_PATH = REPO_ROOT / "gsib-migration" / "workspace" / "omega-ddl-current.dict.json"

EXCLUDED_SCHEMAS = {"stg"}


def _split_qualified(key):
    if "." in key:
        sch, tbl = key.split(".", 1)
        return sch, tbl
    return "", key


def _is_t_twin(table_name):
    return table_name.endswith("_t")


def _parse_type_decl(decl):
    """Splits 'VARCHAR(36) NOT NULL DEFAULT ...' into (type, nullable, default)."""
    raw = (decl or "").strip()
    nullable = "NOT NULL" not in raw.upper()
    # Strip the NOT NULL / NULL tokens
    cleaned = re.sub(r"\b(NOT\s+NULL|NULL)\b", "", raw, flags=re.IGNORECASE).strip()
    default = None
    m = re.search(r"DEFAULT\s+(.+)$", cleaned, flags=re.IGNORECASE)
    if m:
        default = m.group(1).strip()
        cleaned = cleaned[:m.start()].strip()
    return cleaned, nullable, default


def extract_from_dict_file(path):
    with open(path, "r", encoding="utf-8") as f:
        d = json.load(f)
    out = []
    for key, val in d.items():
        sch, tbl = _split_qualified(key)
        if sch in EXCLUDED_SCHEMAS:
            continue
        if _is_t_twin(tbl):
            continue
        v = val or {}
        types = v.get("types") or {}
        explanations = v.get("explanations") or {}
        possible_values = v.get("possible_values") or {}
        table_reviewed = bool(v.get("reviewed", False))
        cols = []
        for col_name, decl in types.items():
            t, nullable, default = _parse_type_decl(decl)
            col_expl = explanations.get(col_name) or ""
            col_pv = possible_values.get(col_name) or ""
            # Comprehension status: "reviewed" only if the table is reviewed
            # AND the column has both explanation and possible_values populated.
            # Otherwise "pending" — Phase 1 Q&A must populate it before gate.
            if table_reviewed and col_expl and col_pv:
                comp_status = "reviewed"
            else:
                comp_status = "pending"
            cols.append({
                "name": col_name,
                "type": t,
                "nullable": nullable,
                "default": default,
                "explanation": col_expl,
                "possible_values": col_pv,
                "comprehension_status": comp_status,
                "comprehension_evidence_refs": [],
            })
        out.append({
            "name": tbl,
            "schema": sch,
            "side": "target",
            "description": v.get("description") or "",
            "reviewed": bool(v.get("reviewed", False)),
            "columns": cols,
            "primary_key": [],   # not in dict.json; derived elsewhere if needed
            "declared_fks": [],  # not in dict.json
        })
    return out


def main(argv):
    out_path = REPO_ROOT / "scripts" / "dm-phase1" / "build" / "target-tables.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    tables = extract_from_dict_file(DEFAULT_DICT_PATH)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(tables, f, indent=2)
    print(f"Wrote {len(tables)} target tables (base, ex-stg) → {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
```

- [ ] **Step 5: Run tests to verify pass**

```bash
cd scripts/dm-phase1
.venv/Scripts/python -m pytest tests/test_extract_target_ddl.py -v
```

Expected: 5 passed.

- [ ] **Step 6: Smoke run on real data**

```bash
cd scripts/dm-phase1
.venv/Scripts/python extract_target_ddl.py
```

Expected: `Wrote ~46 target tables (base, ex-stg) → .../build/target-tables.json`. Verify the count matches grounding decision D5/D7 expectations (~46 base mappable tables).

- [ ] **Step 7: Commit**

```bash
git add scripts/dm-phase1/extract_target_ddl.py scripts/dm-phase1/tests/test_extract_target_ddl.py scripts/dm-phase1/fixtures/target_dict_min.json
git commit -m "feat(dm-phase1): extract target DDL from omega-ddl-current.dict.json"
```

---

## Section D — Inventory + Sample data

### Task 6: Extract inventory from v0.01 List of Source Tables

**Files:**
- Create: `scripts/dm-phase1/extract_inventory.py`
- Create: `scripts/dm-phase1/tests/test_extract_inventory.py`
- Create: `scripts/dm-phase1/fixtures/inventory_min.xlsx`

**Background:** v0.01's *List of Source Tables* sheet has columns `No. | Table Name | Module / Domain | Source Schema | To Migrate | Migrate in`. We want a JSON inventory keyed by `tableName` with the draft Y/N/TBD decision and wave.

- [ ] **Step 1: Build the test fixture xlsx**

```bash
cd scripts/dm-phase1
.venv/Scripts/python -c "
import openpyxl
wb = openpyxl.Workbook()
ws = wb.active
ws.title = 'List of Source Tables'
ws.append(['No.', 'Table Name', 'Module / Domain', 'Source Schema', 'To Migrate', 'Migrate in'])
ws.append([1, 'ABA0001_SECURITY_MASTER', 'eApps', 'MNETD & PRI1', 'Y', 'R1'])
ws.append([2, 'ABA0009_BANK_MASTER', 'eApps', 'MNETD', 'Y', 'R1'])
ws.append([3, 'ABA0501_ENCRYPTED_REPO_TRANS', 'ERF', 'MNETD', 'Y', 'R2'])
ws.append([4, 'cm_aprm_user', 'SBA', 'PRI1', 'TBD', 'R1'])
wb.save('fixtures/inventory_min.xlsx')
print('wrote fixture')
"
```

Expected: `wrote fixture`

- [ ] **Step 2: Write failing test**

`scripts/dm-phase1/tests/test_extract_inventory.py`:
```python
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
```

- [ ] **Step 3: Run to verify failure**

```bash
cd scripts/dm-phase1
.venv/Scripts/python -m pytest tests/test_extract_inventory.py -v
```

Expected: 3 errors.

- [ ] **Step 4: Implement**

`scripts/dm-phase1/extract_inventory.py`:
```python
"""Extracts the v0.01 'List of Source Tables' sheet → per-table inventory dict."""
import json
import sys
from pathlib import Path
import openpyxl

REPO_ROOT = Path(__file__).parent.parent.parent
DEFAULT_XLSX = REPO_ROOT / "gsib-migration" / "workspace" / "MAS_OMEGA_DM_Conversion_Mapping_Specification _v0.01.xlsx"
SHEET_NAME = "List of Source Tables"


def extract_from_xlsx(path):
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb[SHEET_NAME]
    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        return {}
    header_row = rows[0]
    # column index lookup
    idx = {h: i for i, h in enumerate(header_row) if h}
    result = {}
    for r in rows[1:]:
        name = r[idx.get("Table Name", 1)] if "Table Name" in idx else r[1]
        if not name or not str(name).strip():
            continue
        result[str(name).strip()] = {
            "domain": _str(r[idx.get("Module / Domain", 2)]),
            "schema": _str(r[idx.get("Source Schema", 3)]),
            "draft_to_migrate": _str(r[idx.get("To Migrate", 4)]).upper(),
            "wave": _str(r[idx.get("Migrate in", 5)]).upper(),
        }
    return result


def _str(v):
    return "" if v is None else str(v).strip()


def main(argv):
    out_path = REPO_ROOT / "scripts" / "dm-phase1" / "build" / "inventory.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    inv = extract_from_xlsx(DEFAULT_XLSX)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(inv, f, indent=2)
    print(f"Wrote {len(inv)} inventory entries → {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
```

- [ ] **Step 5: Run tests**

```bash
cd scripts/dm-phase1
.venv/Scripts/python -m pytest tests/test_extract_inventory.py -v
```

Expected: 3 passed.

- [ ] **Step 6: Smoke-run on real data**

```bash
cd scripts/dm-phase1
.venv/Scripts/python extract_inventory.py
```

Expected: `Wrote 145 inventory entries → ...` (matches earlier inventory tally).

- [ ] **Step 7: Commit**

```bash
git add scripts/dm-phase1/extract_inventory.py scripts/dm-phase1/tests/test_extract_inventory.py scripts/dm-phase1/fixtures/inventory_min.xlsx
git commit -m "feat(dm-phase1): extract inventory from v0.01 List of Source Tables"
```

---

### Task 7: Extract sample data from backups/workspace.json

**Files:**
- Create: `scripts/dm-phase1/extract_sample_data.py`
- Create: `scripts/dm-phase1/tests/test_extract_sample_data.py`
- Create: `scripts/dm-phase1/fixtures/workspace_min.json`

**Background:** dm-tool persists per-table `sampleValues` (column→list of values) and per-script `sampleDataAttachments` in `backups/workspace.json`. We want, per table name, the sample size and per-column observed values.

- [ ] **Step 1: Inspect real workspace.json shape**

```bash
cd "/c/Users/ECQ1025/Downloads/MAS Securities/MAS DM/Renaissance"
python -c "
import json
d = json.load(open('backups/workspace.json'))
print('top-keys:', list(d.keys())[:10])
" 2>&1 | head -20
```

Use the discovered shape to verify the fixture below matches. If structure differs significantly from the expected `{ scripts: [{ data: { sources: [{ tableName, columns: [{ sampleValues: [] }] }] } }] }`, adjust the extractor logic below before testing.

- [ ] **Step 2: Write fixture**

`scripts/dm-phase1/fixtures/workspace_min.json`:
```json
{
  "scripts": [
    {
      "id": "s1",
      "name": "test",
      "data": {
        "sources": [
          {
            "tableName": "ABA0001_SECURITY_MASTER",
            "columns": [
              { "name": "ABA0001_SECURITY_CODE", "sampleValues": ["N123Z456", "N123Z457"] },
              { "name": "ABA0001_ISSUE_NO", "sampleValues": ["1", "2", "1"] }
            ]
          },
          {
            "tableName": "ABA0009_BANK_MASTER",
            "columns": [
              { "name": "ABA0009_BANK_CODE", "sampleValues": [] }
            ]
          }
        ],
        "targets": []
      },
      "sampleDataAttachments": [
        { "id": "a1", "fileName": "secmast.csv", "uploadedAt": 0, "matchResults": [], "warnings": [] }
      ]
    }
  ]
}
```

- [ ] **Step 3: Write failing test**

`scripts/dm-phase1/tests/test_extract_sample_data.py`:
```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from extract_sample_data import extract_from_workspace_file

FIXTURES = Path(__file__).parent.parent / "fixtures"

def test_per_table_samples_keyed_by_name():
    samples = extract_from_workspace_file(FIXTURES / "workspace_min.json")
    assert "ABA0001_SECURITY_MASTER" in samples
    sec = samples["ABA0001_SECURITY_MASTER"]
    assert sec["columns"]["ABA0001_SECURITY_CODE"]["sample_values"] == ["N123Z456", "N123Z457"]
    assert sec["columns"]["ABA0001_SECURITY_CODE"]["distinct_count"] == 2

def test_handles_empty_samples():
    samples = extract_from_workspace_file(FIXTURES / "workspace_min.json")
    bm = samples["ABA0009_BANK_MASTER"]
    assert bm["columns"]["ABA0009_BANK_CODE"]["sample_values"] == []
    assert bm["columns"]["ABA0009_BANK_CODE"]["distinct_count"] == 0

def test_distinct_count_dedupes():
    samples = extract_from_workspace_file(FIXTURES / "workspace_min.json")
    sec = samples["ABA0001_SECURITY_MASTER"]
    issue_no = sec["columns"]["ABA0001_ISSUE_NO"]
    assert issue_no["sample_values"] == ["1", "2", "1"]
    assert issue_no["distinct_count"] == 2  # 1, 2

def test_row_count_estimate_uses_max_column_size():
    samples = extract_from_workspace_file(FIXTURES / "workspace_min.json")
    sec = samples["ABA0001_SECURITY_MASTER"]
    # Two columns with 2 and 3 values; estimate = 3
    assert sec["row_count_estimate"] == 3
```

- [ ] **Step 4: Run to verify failure**

```bash
cd scripts/dm-phase1
.venv/Scripts/python -m pytest tests/test_extract_sample_data.py -v
```

Expected: 4 errors.

- [ ] **Step 5: Implement**

`scripts/dm-phase1/extract_sample_data.py`:
```python
"""Extracts per-table sample data from dm-tool's persisted workspace.json.

Returns: { tableName: { row_count_estimate, columns: { col_name: { sample_values, distinct_count } } } }
"""
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent.parent
DEFAULT_WORKSPACE = REPO_ROOT / "backups" / "workspace.json"


def extract_from_workspace_file(path):
    with open(path, "r", encoding="utf-8") as f:
        ws = json.load(f)
    out = {}
    scripts = ws.get("scripts") or []
    for s in scripts:
        sources = ((s.get("data") or {}).get("sources")) or []
        for tbl in sources:
            name = tbl.get("tableName")
            if not name:
                continue
            cols_out = {}
            max_size = 0
            for c in tbl.get("columns") or []:
                cn = c.get("name")
                if not cn:
                    continue
                vals = c.get("sampleValues") or []
                cols_out[cn] = {
                    "sample_values": list(vals),
                    "distinct_count": len(set(vals)),
                }
                if len(vals) > max_size:
                    max_size = len(vals)
            # Merge with prior entry if seen across scripts; prefer richer one
            existing = out.get(name)
            if existing is None or max_size > existing["row_count_estimate"]:
                out[name] = {
                    "row_count_estimate": max_size,
                    "columns": cols_out,
                }
    return out


def main(argv):
    out_path = REPO_ROOT / "scripts" / "dm-phase1" / "build" / "samples.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    samples = extract_from_workspace_file(DEFAULT_WORKSPACE)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(samples, f, indent=2)
    print(f"Wrote samples for {len(samples)} tables → {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
```

- [ ] **Step 6: Run tests**

```bash
cd scripts/dm-phase1
.venv/Scripts/python -m pytest tests/test_extract_sample_data.py -v
```

Expected: 4 passed.

- [ ] **Step 7: Smoke-run**

```bash
cd scripts/dm-phase1
.venv/Scripts/python extract_sample_data.py
```

Expected: `Wrote samples for N tables → ...` where N is the count of unique source tables that have any sampleValues. Inspect output.

- [ ] **Step 8: Commit**

```bash
git add scripts/dm-phase1/extract_sample_data.py scripts/dm-phase1/tests/test_extract_sample_data.py scripts/dm-phase1/fixtures/workspace_min.json
git commit -m "feat(dm-phase1): extract sample data from backups/workspace.json"
```

---

## Section E — Combiner

### Task 8: Build draft scope-relationship-map.json

**Files:**
- Create: `scripts/dm-phase1/build_scope_map_draft.py`
- Create: `scripts/dm-phase1/tests/test_build_scope_map_draft.py`

**Goal:** Combines outputs of T4 (source DDL), T5 (target DDL), T6 (inventory), T7 (sample data) into a single draft `scope-relationship-map.json` covering R1 only. Decisions remain `TBD` (audited Y/N comes later via Q&A); structural facts (columns, FKs, samples) populated.

- [ ] **Step 1: Write failing test**

`scripts/dm-phase1/tests/test_build_scope_map_draft.py`:
```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from build_scope_map_draft import build_draft

FIXTURES = Path(__file__).parent.parent / "fixtures"

def test_filters_to_r1_scope():
    doc = build_draft(
        source_xlsx=FIXTURES / "inventory_min.xlsx",
        source_script=FIXTURES / "source_script_min.json",
        target_dict=FIXTURES / "target_dict_min.json",
        workspace=FIXTURES / "workspace_min.json",
        scope="R1",
    )
    table_names = [t["name"] for t in doc["tables"]]
    # ABA0501 is R2 — must be filtered out when scope=R1
    assert "ABA0501_ENCRYPTED_REPO_TRANS" not in table_names

def test_includes_target_tables():
    doc = build_draft(
        source_xlsx=FIXTURES / "inventory_min.xlsx",
        source_script=FIXTURES / "source_script_min.json",
        target_dict=FIXTURES / "target_dict_min.json",
        workspace=FIXTURES / "workspace_min.json",
        scope="R1",
    )
    target_names = [t["name"] for t in doc["tables"] if t.get("side") == "target"]
    assert "iss_security_master" in target_names

def test_default_decision_is_tbd():
    doc = build_draft(
        source_xlsx=FIXTURES / "inventory_min.xlsx",
        source_script=FIXTURES / "source_script_min.json",
        target_dict=FIXTURES / "target_dict_min.json",
        workspace=FIXTURES / "workspace_min.json",
        scope="R1",
    )
    src = next(t for t in doc["tables"] if t.get("side") == "source" and t["name"] == "ABA0001_SECURITY_MASTER")
    # Inventory drafted Y, but our rule: audit-required, default decision is TBD
    assert src["decision"]["to_migrate"] == "TBD"
    assert src["decision"]["needs_user_review"] is True

def test_attaches_row_volume_from_samples():
    doc = build_draft(
        source_xlsx=FIXTURES / "inventory_min.xlsx",
        source_script=FIXTURES / "source_script_min.json",
        target_dict=FIXTURES / "target_dict_min.json",
        workspace=FIXTURES / "workspace_min.json",
        scope="R1",
    )
    src = next(t for t in doc["tables"] if t["name"] == "ABA0001_SECURITY_MASTER")
    assert src["row_volume_estimate"]["value"] == 3
    assert src["row_volume_estimate"]["source"] == "sample"

def test_validates_against_schema():
    from validate_scope_map import validate
    doc = build_draft(
        source_xlsx=FIXTURES / "inventory_min.xlsx",
        source_script=FIXTURES / "source_script_min.json",
        target_dict=FIXTURES / "target_dict_min.json",
        workspace=FIXTURES / "workspace_min.json",
        scope="R1",
    )
    validate(doc)  # raises on failure
```

- [ ] **Step 2: Run to verify failure**

```bash
cd scripts/dm-phase1
.venv/Scripts/python -m pytest tests/test_build_scope_map_draft.py -v
```

Expected: 5 errors.

- [ ] **Step 3: Implement combiner**

`scripts/dm-phase1/build_scope_map_draft.py`:
```python
"""Combines extractor outputs → draft scope-relationship-map.json (R1 scope)."""
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

import extract_source_ddl as src
import extract_target_ddl as tgt
import extract_inventory as inv
import extract_sample_data as sd

REPO_ROOT = Path(__file__).parent.parent.parent


def _attach_comprehension_status(columns, table_reviewed):
    """Adds comprehension_status + comprehension_evidence_refs to each column.

    A column is 'reviewed' only if its parent table is reviewed AND both
    explanation and possible_values are non-empty. Otherwise 'pending'.
    Phase 1 Q&A must populate explanations before the gate; the gate fails
    on any 'pending' column whose parent table has decision.to_migrate == 'Y'.
    """
    out = []
    for c in columns:
        col = {**c}
        if "explanation" not in col:
            col["explanation"] = ""
        if "possible_values" not in col:
            col["possible_values"] = ""
        if table_reviewed and col["explanation"] and col["possible_values"]:
            col["comprehension_status"] = "reviewed"
        else:
            col["comprehension_status"] = "pending"
        col.setdefault("comprehension_evidence_refs", [])
        out.append(col)
    return out


def build_draft(source_xlsx, source_script, target_dict, workspace, scope="R1"):
    inventory = inv.extract_from_xlsx(source_xlsx)
    source_tables = src.extract_from_script_file(source_script)
    target_tables = tgt.extract_from_dict_file(target_dict)
    samples = sd.extract_from_workspace_file(workspace)

    tables_out = []

    # Source tables, filtered by wave
    for t in source_tables:
        meta = inventory.get(t["name"], {})
        wave = meta.get("wave", "").upper()
        if scope != "ALL" and wave != scope:
            continue
        sample = samples.get(t["name"]) or {}
        rv_value = sample.get("row_count_estimate")
        rv_source = "sample" if rv_value else "unknown"
        tables_out.append({
            "name": t["name"],
            "domain": meta.get("domain", ""),
            "schema": t.get("schema", ""),
            "wave": wave or "R1",
            "side": "source",
            # Source side: there's no "reviewed" flag in legacy script-*.json,
            # so default to False — every source column starts as pending until
            # legacy-source channel Q&A populates its explanation.
            "columns": _attach_comprehension_status(t["columns"], table_reviewed=False),
            "primary_key": t["primary_key"],
            "row_volume_estimate": {
                "value": rv_value,
                "source": rv_source,
            },
            "decision": {
                "to_migrate": "TBD",
                "rationale": f"Draft inventory said {meta.get('draft_to_migrate', '?')}; pending audit.",
                "evidence_refs": [],
                "needs_user_review": True,
            },
        })

    # Target tables (not filtered by wave; targets are shared across waves)
    for t in target_tables:
        tables_out.append({
            "name": t["name"],
            "domain": t["schema"],  # use schema as domain proxy for targets
            "schema": t["schema"],
            "wave": "R1",  # placeholder; targets aren't really wave-scoped
            "side": "target",
            "description": t.get("description", ""),
            "reviewed": t.get("reviewed", False),
            # Target side: comprehension_status comes from per-table reviewed
            # AND per-column explanation/possible_values via the helper.
            "columns": _attach_comprehension_status(t["columns"], table_reviewed=t.get("reviewed", False)),
            "primary_key": [],
            "row_volume_estimate": {"value": None, "source": "unknown"},
            "decision": {
                "to_migrate": "Y",  # we always migrate INTO target tables; this signals the table is in OMEGA
                "rationale": "OMEGA target table; mapping rows authored separately.",
                "evidence_refs": [],
                "needs_user_review": False,
            },
        })

    return {
        "version": "0.2-draft",
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
        "scope": scope,
        "tables": tables_out,
        "edges": [],
        "source_target_matrix": [],
        "questions_open": [],
    }


def main(argv):
    out_dir = REPO_ROOT / "docs" / "superpowers" / "specs" / "dm-migration-v0.2" / "phase1"
    out_path = out_dir / "scope-relationship-map.json"
    out_dir.mkdir(parents=True, exist_ok=True)

    # Use real inputs; for source-script combine all 15 files via extract_all
    inventory = inv.extract_from_xlsx(inv.DEFAULT_XLSX)
    source_tables = src.extract_all()
    target_tables = tgt.extract_from_dict_file(tgt.DEFAULT_DICT_PATH)
    samples = sd.extract_from_workspace_file(sd.DEFAULT_WORKSPACE)

    tables_out = []
    for t in source_tables:
        meta = inventory.get(t["name"], {})
        wave = meta.get("wave", "").upper()
        if wave != "R1":
            continue
        sample = samples.get(t["name"]) or {}
        rv_value = sample.get("row_count_estimate")
        rv_source = "sample" if rv_value else "unknown"
        tables_out.append({
            "name": t["name"],
            "domain": meta.get("domain", ""),
            "schema": t.get("schema", ""),
            "wave": wave or "R1",
            "side": "source",
            "columns": _attach_comprehension_status(t["columns"], table_reviewed=False),
            "primary_key": t["primary_key"],
            "row_volume_estimate": {"value": rv_value, "source": rv_source},
            "decision": {
                "to_migrate": "TBD",
                "rationale": f"Draft inventory said {meta.get('draft_to_migrate', '?')}; pending audit.",
                "evidence_refs": [],
                "needs_user_review": True,
            },
        })

    for t in target_tables:
        tables_out.append({
            "name": t["name"],
            "domain": t["schema"],
            "schema": t["schema"],
            "wave": "R1",
            "side": "target",
            "description": t.get("description", ""),
            "reviewed": t.get("reviewed", False),
            "columns": _attach_comprehension_status(t["columns"], table_reviewed=t.get("reviewed", False)),
            "primary_key": [],
            "row_volume_estimate": {"value": None, "source": "unknown"},
            "decision": {
                "to_migrate": "Y",
                "rationale": "OMEGA target table; mapping rows authored separately.",
                "evidence_refs": [],
                "needs_user_review": False,
            },
        })

    doc = {
        "version": "0.2-draft",
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
        "scope": "R1",
        "tables": tables_out,
        "edges": [],
        "source_target_matrix": [],
        "questions_open": [],
    }

    with out_path.open("w", encoding="utf-8") as f:
        json.dump(doc, f, indent=2)
    print(f"Wrote draft scope map ({len(tables_out)} tables) → {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
```

- [ ] **Step 4: Run tests**

```bash
cd scripts/dm-phase1
.venv/Scripts/python -m pytest tests/test_build_scope_map_draft.py -v
```

Expected: 5 passed.

- [ ] **Step 5: Generate the real draft**

```bash
cd scripts/dm-phase1
.venv/Scripts/python build_scope_map_draft.py
```

Expected: `Wrote draft scope map (~145 tables) → docs/.../phase1/scope-relationship-map.json` (~99 source R1 + ~46 target = ~145 entries).

- [ ] **Step 6: Validate the real draft**

```bash
cd scripts/dm-phase1
.venv/Scripts/python validate_scope_map.py ../../docs/superpowers/specs/dm-migration-v0.2/phase1/scope-relationship-map.json
```

Expected: `VALID: ...`

- [ ] **Step 7: Commit**

```bash
git add scripts/dm-phase1/build_scope_map_draft.py scripts/dm-phase1/tests/test_build_scope_map_draft.py docs/superpowers/specs/dm-migration-v0.2/phase1/scope-relationship-map.json
git commit -m "feat(dm-phase1): combine extractors → draft scope-relationship-map.json"
```

---

## Section F — Sample-join FK validation

### Task 9: Sample-data join validator

**Files:**
- Create: `scripts/dm-phase1/sample_join_validate.py`
- Create: `scripts/dm-phase1/tests/test_sample_join_validate.py`

**Goal:** For each candidate FK (declared + name-match heuristic), join sample values; record `{matched, orphans, coverage}` per edge. Updates the JSON in-place. Heuristic for implicit FKs: a column on table A whose name (case-insensitive, stripped of common prefixes like `ABA0007_`) equals a PK column of table B is a candidate.

- [ ] **Step 1: Write failing test**

`scripts/dm-phase1/tests/test_sample_join_validate.py`:
```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from sample_join_validate import propose_implicit_fks, sample_join

def test_proposes_naming_match():
    tables = [
        {
            "name": "ABA0007_DETAIL_AUCTION_RESULT",
            "side": "source",
            "columns": [{"name": "ABA0007_SECURITY_CODE", "type": "CHAR(8)", "nullable": False, "default": None}],
            "primary_key": []
        },
        {
            "name": "ABA0001_SECURITY_MASTER",
            "side": "source",
            "columns": [{"name": "ABA0001_SECURITY_CODE", "type": "CHAR(8)", "nullable": False, "default": None}],
            "primary_key": ["ABA0001_SECURITY_CODE"]
        }
    ]
    edges = propose_implicit_fks(tables)
    assert len(edges) == 1
    e = edges[0]
    assert e["from"]["table"] == "ABA0007_DETAIL_AUCTION_RESULT"
    assert e["from"]["column"] == "ABA0007_SECURITY_CODE"
    assert e["to"]["table"] == "ABA0001_SECURITY_MASTER"
    assert e["to"]["column"] == "ABA0001_SECURITY_CODE"
    assert e["kind"] == "fk-implicit"

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
```

- [ ] **Step 2: Run to verify failure**

```bash
cd scripts/dm-phase1
.venv/Scripts/python -m pytest tests/test_sample_join_validate.py -v
```

Expected: 3 errors.

- [ ] **Step 3: Implement**

`scripts/dm-phase1/sample_join_validate.py`:
```python
"""Adds sample-join evidence to scope-relationship-map.json edges."""
import json
import re
import sys
from pathlib import Path

import extract_sample_data as sd

REPO_ROOT = Path(__file__).parent.parent.parent
DEFAULT_MAP_PATH = REPO_ROOT / "docs" / "superpowers" / "specs" / "dm-migration-v0.2" / "phase1" / "scope-relationship-map.json"


def _strip_table_prefix(col_name):
    """ABA0007_SECURITY_CODE -> SECURITY_CODE (best-effort)."""
    m = re.match(r"^[A-Z]{2,4}\d{2,4}_(.*)$", col_name)
    return m.group(1) if m else col_name


def propose_implicit_fks(tables):
    """For each non-PK column on any table, find another table whose PK column
    matches by stripped suffix. Source side only."""
    edges = []
    sources = [t for t in tables if t.get("side") == "source"]
    pk_index = {}
    for t in sources:
        for pk_col in t.get("primary_key", []):
            stripped = _strip_table_prefix(pk_col)
            pk_index.setdefault(stripped, []).append((t["name"], pk_col))

    eid = 0
    for child in sources:
        child_pks = set(child.get("primary_key", []))
        for col in child.get("columns", []):
            cname = col["name"]
            if cname in child_pks:
                continue
            stripped = _strip_table_prefix(cname)
            for parent_name, parent_col in pk_index.get(stripped, []):
                if parent_name == child["name"]:
                    continue
                eid += 1
                edges.append({
                    "id": f"E-{eid:04d}",
                    "kind": "fk-implicit",
                    "from": {"table": child["name"], "column": cname},
                    "to": {"table": parent_name, "column": parent_col},
                    "cardinality": "unknown",
                    "evidence": {
                        "ddl_declared": False,
                        "naming_match": True,
                        "nlm_archive_id": None,
                        "legacy_archive_id": None,
                        "sample_join": {"matched": 0, "orphans": 0, "coverage": "none"},
                        "db_validation": {"status": "n/a", "query_id": None},
                    },
                    "confidence": "low",
                    "needs_user_review": True,
                })
    return edges


def sample_join(samples, child_table, child_col, parent_table, parent_col):
    cs = ((samples.get(child_table) or {}).get("columns") or {}).get(child_col, {}).get("sample_values") or []
    ps = ((samples.get(parent_table) or {}).get("columns") or {}).get(parent_col, {}).get("sample_values") or []
    if not cs or not ps:
        return {"matched": 0, "orphans": 0, "coverage": "none"}
    parent_set = set(ps)
    matched = sum(1 for v in cs if v in parent_set)
    orphans = len(cs) - matched
    full = matched == len(cs) and len(cs) >= 100
    coverage = "full" if full else "partial"
    return {"matched": matched, "orphans": orphans, "coverage": coverage}


def main(argv):
    map_path = DEFAULT_MAP_PATH
    samples = sd.extract_from_workspace_file(sd.DEFAULT_WORKSPACE)

    with map_path.open("r", encoding="utf-8") as f:
        doc = json.load(f)

    # Add proposed implicit edges (only if not already present)
    existing = {(e["from"]["table"], e["from"]["column"], e["to"]["table"], e["to"]["column"]) for e in doc["edges"]}
    for e in propose_implicit_fks(doc["tables"]):
        key = (e["from"]["table"], e["from"]["column"], e["to"]["table"], e["to"]["column"])
        if key not in existing:
            doc["edges"].append(e)

    # For every edge with kind starting with 'fk-', run sample-join
    for e in doc["edges"]:
        if not e["kind"].startswith("fk-"):
            continue
        ft = e["from"]["table"]
        fc = e["from"]["column"]
        tt = e["to"]["table"]
        tc = e["to"]["column"]
        e["evidence"]["sample_join"] = sample_join(samples, ft, fc, tt, tc)
        # Bump confidence if all matched
        sj = e["evidence"]["sample_join"]
        if sj["coverage"] == "partial" and sj["orphans"] == 0:
            e["confidence"] = "medium"

    with map_path.open("w", encoding="utf-8") as f:
        json.dump(doc, f, indent=2)
    print(f"Updated {len(doc['edges'])} edges with sample-join evidence")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
```

- [ ] **Step 4: Run tests**

```bash
cd scripts/dm-phase1
.venv/Scripts/python -m pytest tests/test_sample_join_validate.py -v
```

Expected: 3 passed.

- [ ] **Step 5: Run on real data**

```bash
cd scripts/dm-phase1
.venv/Scripts/python sample_join_validate.py
```

Expected: `Updated N edges with sample-join evidence`. Inspect the JSON to see proposed implicit edges and their join statistics.

- [ ] **Step 6: Re-validate JSON**

```bash
.venv/Scripts/python validate_scope_map.py ../../docs/superpowers/specs/dm-migration-v0.2/phase1/scope-relationship-map.json
```

Expected: `VALID: ...`

- [ ] **Step 7: Commit**

```bash
git add scripts/dm-phase1/sample_join_validate.py scripts/dm-phase1/tests/test_sample_join_validate.py docs/superpowers/specs/dm-migration-v0.2/phase1/scope-relationship-map.json
git commit -m "feat(dm-phase1): propose implicit FKs + sample-join validation"
```

---

## Section G — Renderers

### Task 10: Render scope-relationship-map.md

**Files:**
- Create: `scripts/dm-phase1/render_scope_map_md.py`
- Create: `scripts/dm-phase1/tests/test_render_scope_map_md.py`

- [ ] **Step 1: Write failing test**

`scripts/dm-phase1/tests/test_render_scope_map_md.py`:
```python
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))
from render_scope_map_md import render

def test_renders_table_section():
    doc = {
        "version": "0.2-draft",
        "generated_at": "2026-05-04T12:00:00Z",
        "scope": "R1",
        "tables": [
            {
                "name": "ABA0001_SECURITY_MASTER",
                "domain": "eApps",
                "schema": "MNETD",
                "wave": "R1",
                "side": "source",
                "columns": [{"name": "ABA0001_SECURITY_CODE", "type": "CHAR(8)", "nullable": False, "default": None}],
                "primary_key": ["ABA0001_SECURITY_CODE"],
                "row_volume_estimate": {"value": 482, "source": "sample"},
                "decision": {"to_migrate": "TBD", "rationale": "pending audit", "evidence_refs": [], "needs_user_review": True},
            }
        ],
        "edges": [],
        "source_target_matrix": [],
        "questions_open": [],
    }
    md = render(doc)
    assert "ABA0001_SECURITY_MASTER" in md
    assert "## Source tables" in md
    assert "TBD" in md

def test_renders_edges_section():
    doc = {
        "version": "0.2-draft",
        "generated_at": "2026-05-04T12:00:00Z",
        "scope": "R1",
        "tables": [],
        "edges": [{
            "id": "E-0001",
            "kind": "fk-implicit",
            "from": {"table": "A", "column": "FK"},
            "to": {"table": "B", "column": "PK"},
            "cardinality": "N:1",
            "evidence": {"ddl_declared": False, "naming_match": True, "nlm_archive_id": None, "legacy_archive_id": None, "sample_join": {"matched": 5, "orphans": 0, "coverage": "partial"}, "db_validation": {"status": "n/a", "query_id": None}},
            "confidence": "medium",
            "needs_user_review": False,
        }],
        "source_target_matrix": [],
        "questions_open": [],
    }
    md = render(doc)
    assert "## Relationships" in md
    assert "E-0001" in md
    assert "A.FK -> B.PK" in md or "A.FK → B.PK" in md
```

- [ ] **Step 2: Run to verify failure**

```bash
cd scripts/dm-phase1
.venv/Scripts/python -m pytest tests/test_render_scope_map_md.py -v
```

Expected: 2 errors.

- [ ] **Step 3: Implement**

`scripts/dm-phase1/render_scope_map_md.py`:
```python
"""Renders scope-relationship-map.json as human-readable markdown."""
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent.parent
DEFAULT_JSON = REPO_ROOT / "docs" / "superpowers" / "specs" / "dm-migration-v0.2" / "phase1" / "scope-relationship-map.json"
DEFAULT_OUT = REPO_ROOT / "docs" / "superpowers" / "specs" / "dm-migration-v0.2" / "phase1" / "scope-relationship-map.md"


def render(doc):
    out = []
    out.append(f"# Scope & Relationship Map — {doc['scope']}")
    out.append("")
    out.append(f"_Generated: {doc['generated_at']}_  ·  _Version: {doc['version']}_")
    out.append("")

    # Group tables by side
    sources = [t for t in doc["tables"] if t.get("side") == "source"]
    targets = [t for t in doc["tables"] if t.get("side") == "target"]

    out.append(f"**Counts:** {len(sources)} source tables, {len(targets)} target tables, {len(doc['edges'])} edges")
    out.append("")

    # Sources by domain
    out.append("## Source tables")
    out.append("")
    out.append("| Domain | Table | Schema | Wave | Cols | PK | Rows (est) | Decision | Needs review |")
    out.append("|---|---|---|---|---|---|---|---|---|")
    for t in sorted(sources, key=lambda x: (x.get("domain", ""), x["name"])):
        rv = t.get("row_volume_estimate") or {}
        rv_disp = f"{rv.get('value')} ({rv.get('source')})" if rv.get("value") is not None else "—"
        pk_disp = ",".join(t.get("primary_key", []) or []) or "—"
        out.append(f"| {t.get('domain','')} | `{t['name']}` | {t.get('schema','')} | {t.get('wave','')} | {len(t.get('columns', []))} | {pk_disp} | {rv_disp} | **{t['decision']['to_migrate']}** | {'⚠️' if t['decision'].get('needs_user_review') else ''} |")
    out.append("")

    # Targets by schema
    out.append("## Target tables")
    out.append("")
    out.append("| Schema | Table | Cols |")
    out.append("|---|---|---|")
    for t in sorted(targets, key=lambda x: (x.get("schema", ""), x["name"])):
        out.append(f"| {t.get('schema','')} | `{t['name']}` | {len(t.get('columns', []))} |")
    out.append("")

    # Edges
    out.append("## Relationships")
    out.append("")
    out.append("| ID | Kind | From | To | Cardinality | Sample-join | Confidence | Needs review |")
    out.append("|---|---|---|---|---|---|---|---|")
    for e in doc["edges"]:
        sj = (e.get("evidence") or {}).get("sample_join") or {}
        sj_disp = f"{sj.get('matched',0)}/{sj.get('matched',0)+sj.get('orphans',0)} ({sj.get('coverage','none')})"
        out.append(f"| {e['id']} | {e['kind']} | `{e['from']['table']}.{e['from']['column']}` | `{e['to']['table']}.{e['to']['column']}` | {e.get('cardinality','—')} | {sj_disp} | {e.get('confidence','—')} | {'⚠️' if e.get('needs_user_review') else ''} |")
    out.append("")

    # Open questions
    if doc.get("questions_open"):
        out.append("## Open questions")
        out.append("")
        out.append("See `open-questions.md` for the full backlog grouped by channel.")
        out.append("")

    return "\n".join(out)


def main(argv):
    with DEFAULT_JSON.open("r", encoding="utf-8") as f:
        doc = json.load(f)
    md = render(doc)
    with DEFAULT_OUT.open("w", encoding="utf-8") as f:
        f.write(md)
    print(f"Wrote markdown ({len(md)} chars) → {DEFAULT_OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
```

- [ ] **Step 4: Run tests**

```bash
cd scripts/dm-phase1
.venv/Scripts/python -m pytest tests/test_render_scope_map_md.py -v
```

Expected: 2 passed.

- [ ] **Step 5: Render real data**

```bash
cd scripts/dm-phase1
.venv/Scripts/python render_scope_map_md.py
```

Expected: `Wrote markdown (~N chars) → ...phase1/scope-relationship-map.md`. Inspect the markdown for readability.

- [ ] **Step 6: Commit**

```bash
git add scripts/dm-phase1/render_scope_map_md.py scripts/dm-phase1/tests/test_render_scope_map_md.py docs/superpowers/specs/dm-migration-v0.2/phase1/scope-relationship-map.md
git commit -m "feat(dm-phase1): render scope-relationship-map.md from JSON"
```

---

### Task 11: Render source-target-matrix.md

**Files:**
- Create: `scripts/dm-phase1/render_source_target_matrix.py`

**Goal:** A 2-D heatmap of which source tables map to which target tables. Until Phase 5 fills the matrix, this renders an "asserted matrix is empty" header showing zero mappings — but the structure is in place. The matrix will populate once user-channel Q&A resolves source→target intent.

- [ ] **Step 1: Implement (no test needed; pure rendering of JSON `source_target_matrix` field)**

`scripts/dm-phase1/render_source_target_matrix.py`:
```python
"""Renders source_target_matrix as a markdown heatmap."""
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent.parent
DEFAULT_JSON = REPO_ROOT / "docs" / "superpowers" / "specs" / "dm-migration-v0.2" / "phase1" / "scope-relationship-map.json"
DEFAULT_OUT = REPO_ROOT / "docs" / "superpowers" / "specs" / "dm-migration-v0.2" / "phase1" / "source-target-matrix.md"


def render(doc):
    out = []
    out.append("# Source → Target Mapping Matrix")
    out.append("")
    matrix = doc.get("source_target_matrix") or []
    if not matrix:
        out.append("_No source→target mappings asserted yet. Populates as Q&A resolves migration intent per source table._")
        out.append("")
        return "\n".join(out)

    # Collect all targets across all sources
    all_targets = sorted({t for entry in matrix for t in entry.get("targets", [])})
    out.append(f"**Sources:** {len(matrix)}  ·  **Targets covered:** {len(all_targets)}")
    out.append("")
    header = ["Source ↓ / Target →"] + all_targets
    out.append("| " + " | ".join(header) + " |")
    out.append("|" + "|".join(["---"] * len(header)) + "|")
    for entry in sorted(matrix, key=lambda x: x["source"]):
        cells = ["✓" if t in entry.get("targets", []) else "" for t in all_targets]
        out.append("| `" + entry["source"] + "` | " + " | ".join(cells) + " |")
    out.append("")
    return "\n".join(out)


def main(argv):
    with DEFAULT_JSON.open("r", encoding="utf-8") as f:
        doc = json.load(f)
    md = render(doc)
    with DEFAULT_OUT.open("w", encoding="utf-8") as f:
        f.write(md)
    print(f"Wrote matrix ({len(md)} chars) → {DEFAULT_OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
```

- [ ] **Step 2: Run**

```bash
cd scripts/dm-phase1
.venv/Scripts/python render_source_target_matrix.py
```

Expected: `Wrote matrix (...chars) → .../phase1/source-target-matrix.md`. Initial render says "no mappings asserted yet" — that's expected.

- [ ] **Step 3: Commit**

```bash
git add scripts/dm-phase1/render_source_target_matrix.py docs/superpowers/specs/dm-migration-v0.2/phase1/source-target-matrix.md
git commit -m "feat(dm-phase1): render source-target-matrix.md"
```

---

## Section H — Open questions backlog

### Task 12: Generate open-questions.md grouped by channel

**Files:**
- Create: `scripts/dm-phase1/generate_open_questions.py`

**Goal:** Walk the JSON for entries with `needs_user_review: true` (tables with TBD decision; edges with low confidence) AND for tables with any column at `comprehension_status: "pending"`. For each, generate a ready-to-paste prompt. Group by channel (NotebookLM / legacy-source / OMEGA DB / user). Also include the four pre-existing questions from `grounding-decisions.md` (D4, D6 for legacy-source + NotebookLM).

**Comprehension batches (added 2026-05-05):** for any table whose decision is Y or TBD AND that has ≥1 pending column, emit a single prompt covering ALL its pending columns at once (one prompt per table, not per column). Routing rule: source-side tables → legacy-source channel; target-side tables → NotebookLM channel. Prompt template:

```
Comprehend every column on `<table_name>` (<schema/domain>). For each column listed
below, respond with:
  - explanation: 1-2 sentence purpose / business role
  - possible_values: known set of values, ranges, or master-code categories;
                     "free-form" if not enumerable
  - notes: any cross-column invariants, lifecycle states, deprecation, or gotchas

Columns:
  - <col_1> (<type>, nullable=<bool>, default=<default>)
  - <col_2> (<type>, nullable=<bool>, default=<default>)
  ...

Return your answer in YAML form so I can paste it into an archive:

  column_explanations:
    <col_1>:
      explanation: "..."
      possible_values: "..."
      notes: "..."
    <col_2>:
      ...
```

These prompts are tagged with id prefix `QC-` (Q-Comprehension) and stored under
their channel's archive directory. Task 16's merger reads `column_explanations`
from the archive YAML and updates each column's `explanation`, `possible_values`,
and flips its `comprehension_status` to `reviewed`.

- [ ] **Step 1: Implement**

`scripts/dm-phase1/generate_open_questions.py`:
```python
"""Generates phase1/open-questions.md grouped by channel."""
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent.parent
DEFAULT_JSON = REPO_ROOT / "docs" / "superpowers" / "specs" / "dm-migration-v0.2" / "phase1" / "scope-relationship-map.json"
DEFAULT_OUT = REPO_ROOT / "docs" / "superpowers" / "specs" / "dm-migration-v0.2" / "phase1" / "open-questions.md"


def _table_question(t):
    return (
        f"Source table `{t['name']}` (domain={t.get('domain','?')}, wave={t.get('wave','?')}). "
        f"Inventory drafted '{t['decision']['rationale']}'. "
        f"Should this table be migrated to OMEGA in v0.2 (R1)? If YES, which target tables in cm.* / iss.* "
        f"does it feed (one source can feed multiple targets)? If NO, what's the rationale "
        f"(deprecated, audit-only, replaced by another mechanism, etc.)? Cite the OMEGA FSD or legacy SDS."
    )


def _edge_question(e):
    return (
        f"Edge {e['id']}: candidate FK `{e['from']['table']}.{e['from']['column']}` -> "
        f"`{e['to']['table']}.{e['to']['column']}` (kind={e['kind']}, "
        f"sample_join coverage={e.get('evidence',{}).get('sample_join',{}).get('coverage','none')}). "
        f"Confirm: is this a real referential relationship in the legacy system? Cardinality (1:1, 1:N, N:1, N:N)? "
        f"Are there orphans expected at production scale? If yes, what's the cleanup story?"
    )


def main(argv):
    with DEFAULT_JSON.open("r", encoding="utf-8") as f:
        doc = json.load(f)

    nlm_qs = []
    legacy_qs = []
    db_qs = []
    user_qs = []

    # Hard-coded grounding follow-ups (from D4, D6 in grounding-decisions.md)
    legacy_qs.append({
        "id": "QL-001",
        "prompt": "What is the purpose of the legacy MLOG database / tables? Is it a log/audit store? "
                  "Are there any operational dependencies on MLOG data post-OMEGA Go-Live? "
                  "Specifically, does any R1 or R2 OMEGA module read or reference MLOG data?",
        "for_table": "MLOG-domain (3 tables)",
    })
    legacy_qs.append({
        "id": "QL-002",
        "prompt": "What does ABA0023_AUDIT_ACTION contain? What columns, what events does it log "
                  "(insert/update/delete? schema changes? business actions?)? Retention period, row volume estimate. "
                  "Is it consulted by any operational legacy report or job?",
        "for_table": "ABA0023_AUDIT_ACTION",
    })
    nlm_qs.append({
        "id": "QN-001",
        "prompt": "Does any OMEGA FSD (Reports, Admin, or DM-related) explicitly require legacy audit data "
                  "(e.g., eApps ABA0023_AUDIT_ACTION) to be translated and loaded into OMEGA's _t historical "
                  "format at Go-Live? If so, which target _t tables are in scope and what is the row-level "
                  "translation rule?",
        "for_table": None,
    })

    # Walk tables; for each TBD source table, add an NLM question
    next_qn = 2
    next_ql = 3
    for t in doc["tables"]:
        if t.get("side") != "source":
            continue
        if t["decision"]["to_migrate"] != "TBD":
            continue
        nlm_qs.append({
            "id": f"QN-{next_qn:03d}",
            "prompt": _table_question(t),
            "for_table": t["name"],
        })
        next_qn += 1

    # Walk edges; for each needs_user_review edge, add a legacy-source question
    for e in doc["edges"]:
        if not e.get("needs_user_review"):
            continue
        legacy_qs.append({
            "id": f"QL-{next_ql:03d}",
            "prompt": _edge_question(e),
            "for_edge": e["id"],
        })
        next_ql += 1

    # Render
    out = []
    out.append("# Phase 1 Open Questions")
    out.append("")
    out.append("Each question below is ready to paste into the appropriate channel. Bring back the answer to the corresponding archive directory.")
    out.append("")

    out.append(f"## NotebookLM channel  ({len(nlm_qs)} questions)")
    out.append("")
    out.append("Paste each prompt into your NotebookLM session for the OMEGA notebook.")
    out.append("Archive answers as `phase1/notebooklm-archive/q-{id}-*.md` using the YAML schema from spec §5.5.")
    out.append("")
    for q in nlm_qs:
        out.append(f"### {q['id']}")
        if q.get("for_table"):
            out.append(f"_For: {q['for_table']}_")
        elif q.get("for_edge"):
            out.append(f"_For edge: {q['for_edge']}_")
        out.append("")
        out.append("```")
        out.append(q["prompt"])
        out.append("```")
        out.append("")

    out.append(f"## Legacy-source codebase channel  ({len(legacy_qs)} questions)")
    out.append("")
    out.append("Paste each prompt into your separate Claude/Cursor session on the legacy source codebase.")
    out.append("Archive answers as `phase1/legacy-source-archive/q-{id}-*.md`.")
    out.append("")
    for q in legacy_qs:
        out.append(f"### {q['id']}")
        if q.get("for_table"):
            out.append(f"_For: {q['for_table']}_")
        elif q.get("for_edge"):
            out.append(f"_For edge: {q['for_edge']}_")
        out.append("")
        out.append("```")
        out.append(q["prompt"])
        out.append("```")
        out.append("")

    out.append(f"## OMEGA DB queries  ({len(db_qs)} queries)")
    out.append("")
    out.append("Run each SQL block against your OMEGA staging DB; paste the result back as `phase1/db-queries-archive/q-{id}-*.md`.")
    out.append("")
    if not db_qs:
        out.append("_No DB queries enqueued yet. Will populate after legacy-source channel surfaces FK ambiguities that need scale-validation._")
    else:
        for q in db_qs:
            out.append(f"### {q['id']}")
            out.append("```sql")
            out.append(q["prompt"])
            out.append("```")
            out.append("")

    out.append(f"## User direct  ({len(user_qs)} questions)")
    out.append("")
    if not user_qs:
        out.append("_None at this time._")

    text = "\n".join(out)
    with DEFAULT_OUT.open("w", encoding="utf-8") as f:
        f.write(text)
    print(f"Wrote open-questions.md ({len(nlm_qs)} NLM + {len(legacy_qs)} legacy + {len(db_qs)} DB + {len(user_qs)} user) → {DEFAULT_OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
```

- [ ] **Step 2: Run**

```bash
cd scripts/dm-phase1
.venv/Scripts/python generate_open_questions.py
```

Expected: `Wrote open-questions.md (~N NLM + ~M legacy + 0 DB + 0 user) → .../phase1/open-questions.md`

Inspect the file. Each question should be self-contained — pasteable into the correct channel without my intervention.

- [ ] **Step 3: Commit**

```bash
git add scripts/dm-phase1/generate_open_questions.py docs/superpowers/specs/dm-migration-v0.2/phase1/open-questions.md
git commit -m "feat(dm-phase1): generate open-questions.md backlog"
```

---

## Section I — Q&A iteration (interactive)

These tasks are not 2-5 minute coding cycles; they're per-batch question-and-answer cycles. Do them with the user actively in the loop.

### Task 13: Execute NotebookLM batch

**Tool:** notebooklm-skill (already available; auth confirmed at session start).

- [ ] **Step 1: For each `QN-NNN` question in `open-questions.md`, run:**

```bash
cd "C:/Users/ECQ1025/.claude/skills/notebooklm-skill"
PYTHONIOENCODING=utf-8 python scripts/run.py ask_question.py \
  --question "<paste prompt verbatim>" \
  --notebook-url "https://notebooklm.google.com/notebook/05fa56a8-dd88-425c-a678-643a7c24d0aa"
```

- [ ] **Step 2: For each answer, write archive file:**

Path: `docs/superpowers/specs/dm-migration-v0.2/phase1/notebooklm-archive/q-{id}-{slug}.md`

YAML frontmatter (per spec §5.5):
```yaml
---
id: QN-NNN
date: 2026-MM-DD
phase: 1
channel: notebooklm
topic: "..."
prompt: |
  <verbatim>
answer: |
  <verbatim>
citations:
  - source: "..."
    quality: high|medium|low
evaluation:
  confidence: high|medium|low
  contradictions: []
  gaps: []
  decision: "..."
  needs_user_review: <true|false>
---
```

- [ ] **Step 3: Budget:** NotebookLM free tier = 50 queries/day. If `open-questions.md` has > 40 NLM questions, batch across multiple days. The skill records query timestamps in `~/.claude/skills/notebooklm-skill/data/`.

- [ ] **Step 4: Stop condition:** all NLM questions in `open-questions.md` have a corresponding archive file. (Use `ls phase1/notebooklm-archive/q-QN-* | wc -l` to count vs. `grep -c '^### QN-' phase1/open-questions.md`.)

- [ ] **Step 5: Commit batches** (every ~10 archives is a reasonable commit unit):

```bash
git add docs/superpowers/specs/dm-migration-v0.2/phase1/notebooklm-archive/q-QN-*.md
git commit -m "docs(dm-phase1): NotebookLM Q&A batch (questions QN-XXX..QN-YYY)"
```

---

### Task 14: Execute legacy-source batch

**Tool:** the user's separate Claude/Cursor session on the legacy source codebase.

- [ ] **Step 1: Hand the legacy-source prompts to the user as a copy-pasteable block.** Use the AskUserQuestion tool to confirm when the answers come back.

- [ ] **Step 2: For each answer the user pastes back, archive at:**

`docs/superpowers/specs/dm-migration-v0.2/phase1/legacy-source-archive/q-{id}-{slug}.md`

YAML frontmatter:
```yaml
---
id: QL-NNN
date: 2026-MM-DD
phase: 1
channel: legacy-source
topic: "..."
prompt: |
  <verbatim>
answer: |
  <verbatim — include any code/file references the user shared>
citations:
  - source: "<file path or function name in legacy codebase>"
    quality: high|medium|low
evaluation:
  confidence: high|medium|low
  contradictions: []
  gaps: []
  decision: "..."
  needs_user_review: <true|false>
---
```

- [ ] **Step 3: Stop condition:** all `QL-NNN` questions in `open-questions.md` have a corresponding archive file.

- [ ] **Step 4: Commit batches:**

```bash
git add docs/superpowers/specs/dm-migration-v0.2/phase1/legacy-source-archive/q-QL-*.md
git commit -m "docs(dm-phase1): legacy-source Q&A batch (questions QL-XXX..QL-YYY)"
```

---

### Task 15: Execute OMEGA DB batch (if questions enqueued)

**Tool:** the user's direct OMEGA staging DB connection.

- [ ] **Step 1: Hand the user each SQL block from `open-questions.md` § OMEGA DB queries section.**

- [ ] **Step 2: User runs the query, pastes the result back as a markdown table or numeric value.**

- [ ] **Step 3: Archive:**

`docs/superpowers/specs/dm-migration-v0.2/phase1/db-queries-archive/q-{id}-{slug}.md`:

```yaml
---
id: QD-NNN
date: 2026-MM-DD
phase: 1
channel: omega-db
query: |
  <SQL>
result: |
  <result>
evaluation:
  confidence: high  # DB query results are deterministic
  decision: "..."
  needs_user_review: false
---
```

- [ ] **Step 4: Commit batches:**

```bash
git add docs/superpowers/specs/dm-migration-v0.2/phase1/db-queries-archive/q-QD-*.md
git commit -m "docs(dm-phase1): OMEGA DB query batch (questions QD-XXX..QD-YYY)"
```

---

### Task 16: Merge Q&A answers back into scope-map.json

**Files:**
- Create: `scripts/dm-phase1/merge_qa_answers.py`

**Goal:** Walks the three archive directories. For each archive whose `evaluation.decision` resolves a TBD table or low-confidence edge, updates the JSON entry: sets `to_migrate`, fills `evidence_refs`, clears `needs_user_review`. If `evaluation.decision` adds an FK or hierarchy edge that wasn't in the JSON, appends it.

- [ ] **Step 1: Implement**

`scripts/dm-phase1/merge_qa_answers.py`:
```python
"""Merges archived Q&A answers back into scope-relationship-map.json."""
import json
import re
import sys
import yaml
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent.parent
PHASE1 = REPO_ROOT / "docs" / "superpowers" / "specs" / "dm-migration-v0.2" / "phase1"
MAP_PATH = PHASE1 / "scope-relationship-map.json"
ARCHIVE_DIRS = {
    "notebooklm": PHASE1 / "notebooklm-archive",
    "legacy-source": PHASE1 / "legacy-source-archive",
    "omega-db": PHASE1 / "db-queries-archive",
}


def _read_archive(path):
    text = path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---", text, re.DOTALL)
    if not m:
        return None
    return yaml.safe_load(m.group(1))


def main(argv):
    with MAP_PATH.open("r", encoding="utf-8") as f:
        doc = json.load(f)

    archives = []
    for ch, d in ARCHIVE_DIRS.items():
        if not d.exists():
            continue
        for p in sorted(d.glob("q-Q*-*.md")):
            ar = _read_archive(p)
            if ar is None:
                continue
            ar["__channel__"] = ch
            ar["__archive_path__"] = str(p.relative_to(REPO_ROOT))
            archives.append(ar)

    name_to_table = {t["name"]: t for t in doc["tables"]}
    eid_to_edge = {e["id"]: e for e in doc["edges"]}
    merges = 0

    for ar in archives:
        decision = (ar.get("evaluation") or {}).get("decision") or ""
        for_table = ar.get("for_table") or ""
        for_edge = ar.get("for_edge") or ""

        # Heuristic: parse 'Migrate (Y)' or 'Skip (N)' from decision text
        if for_table and for_table in name_to_table:
            t = name_to_table[for_table]
            if "(Y)" in decision or "Migrate (Y)" in decision:
                t["decision"]["to_migrate"] = "Y"
                t["decision"]["needs_user_review"] = False
                t["decision"]["rationale"] = decision[:280]
                t["decision"]["evidence_refs"].append(ar["id"])
                merges += 1
            elif "(N)" in decision or "Skip (N)" in decision:
                t["decision"]["to_migrate"] = "N"
                t["decision"]["needs_user_review"] = False
                t["decision"]["rationale"] = decision[:280]
                t["decision"]["evidence_refs"].append(ar["id"])
                merges += 1

        if for_edge and for_edge in eid_to_edge:
            e = eid_to_edge[for_edge]
            ev = ar.get("evaluation") or {}
            conf = ev.get("confidence")
            if conf in ("high", "medium", "low"):
                e["confidence"] = conf
            if not ev.get("needs_user_review"):
                e["needs_user_review"] = False
            channel = ar["__channel__"]
            archive_id_field = {"notebooklm": "nlm_archive_id", "legacy-source": "legacy_archive_id"}.get(channel)
            if archive_id_field:
                e["evidence"][archive_id_field] = ar["id"]
            merges += 1

    with MAP_PATH.open("w", encoding="utf-8") as f:
        json.dump(doc, f, indent=2)
    print(f"Merged {merges} archived Q&A answers into {MAP_PATH}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
```

Note: requires `pyyaml`. Add to `requirements.txt`:
```
pyyaml==6.0.1
```
And reinstall: `.venv/Scripts/python -m pip install -r requirements.txt`.

- [ ] **Step 2: Run**

```bash
cd scripts/dm-phase1
.venv/Scripts/python merge_qa_answers.py
```

Expected: `Merged N archived Q&A answers into ...`. Inspect the JSON to verify TBD → Y/N flips happened where expected.

- [ ] **Step 3: Validate JSON**

```bash
.venv/Scripts/python validate_scope_map.py ../../docs/superpowers/specs/dm-migration-v0.2/phase1/scope-relationship-map.json
```

Expected: `VALID: ...`

- [ ] **Step 4: Re-render markdown views**

```bash
.venv/Scripts/python render_scope_map_md.py
.venv/Scripts/python render_source_target_matrix.py
```

- [ ] **Step 5: Commit**

```bash
git add scripts/dm-phase1/merge_qa_answers.py scripts/dm-phase1/requirements.txt docs/superpowers/specs/dm-migration-v0.2/phase1/scope-relationship-map.json docs/superpowers/specs/dm-migration-v0.2/phase1/scope-relationship-map.md docs/superpowers/specs/dm-migration-v0.2/phase1/source-target-matrix.md
git commit -m "feat(dm-phase1): merge Q&A archives into scope map; re-render views"
```

---

## Section J — Final Phase 1 gate

### Task 17: Verify gate criteria

- [ ] **Step 1: Check zero unresolved review items in JSON**

```bash
cd "C:/Users/ECQ1025/Downloads/MAS Securities/MAS DM/Renaissance"
python -c "
import json
d = json.load(open('docs/superpowers/specs/dm-migration-v0.2/phase1/scope-relationship-map.json'))
unresolved_t = [t['name'] for t in d['tables'] if t.get('decision',{}).get('needs_user_review')]
unresolved_e = [e['id'] for e in d['edges'] if e.get('needs_user_review')]
print(f'Unresolved tables: {len(unresolved_t)}')
print(f'Unresolved edges: {len(unresolved_e)}')
if unresolved_t:
    print('  ', unresolved_t[:10], '...' if len(unresolved_t) > 10 else '')
if unresolved_e:
    print('  ', unresolved_e[:10], '...' if len(unresolved_e) > 10 else '')
"
```

Expected: `Unresolved tables: 0` and `Unresolved edges: 0`. If non-zero, return to Task 13/14/15 for the residual questions.

- [ ] **Step 1b: Check zero pending column comprehension on Y-to-migrate tables**

```bash
cd "C:/Users/ECQ1025/Downloads/MAS Securities/MAS DM/Renaissance"
python -c "
import json
d = json.load(open('docs/superpowers/specs/dm-migration-v0.2/phase1/scope-relationship-map.json'))
pending = []
for t in d['tables']:
    if t.get('decision', {}).get('to_migrate') != 'Y':
        continue
    for c in t.get('columns', []) or []:
        if c.get('comprehension_status') == 'pending':
            pending.append(f\"{t['name']}.{c['name']}\")
print(f'Pending columns on Y-to-migrate tables: {len(pending)}')
if pending:
    for p in pending[:20]: print(' ', p)
    if len(pending) > 20: print(f'  ... +{len(pending)-20} more')
"
```

Expected: `Pending columns on Y-to-migrate tables: 0`. If non-zero, return to Task 13/14 for column comprehension batches (QC-* prompts).

- [ ] **Step 2: Validate JSON**

```bash
cd scripts/dm-phase1
.venv/Scripts/python validate_scope_map.py ../../docs/superpowers/specs/dm-migration-v0.2/phase1/scope-relationship-map.json
```

Expected: `VALID: ...`

- [ ] **Step 3: Run all unit tests one last time**

```bash
.venv/Scripts/python -m pytest tests/ -v
```

Expected: all green.

- [ ] **Step 4: Inspect markdown views**

Open and read top-to-bottom:
- `docs/superpowers/specs/dm-migration-v0.2/phase1/scope-relationship-map.md`
- `docs/superpowers/specs/dm-migration-v0.2/phase1/source-target-matrix.md`

Confirm: every R1 source table has a definitive Y/N decision; every edge has confidence ≥ medium or is explicitly low with a documented reason.

- [ ] **Step 5: Update grounding-decisions.md to "resolved" for D4 and D6**

In `phase1/grounding-decisions.md`, find the open-questions table at the bottom; mark:
- `1 (MLOG)` — resolved by `legacy-archive/q-QL-001-*.md`
- `2 (ABA0023_AUDIT_ACTION)` — resolved by `legacy-archive/q-QL-002-*.md`
- `3 (FSD audit translation)` — resolved by `notebooklm-archive/q-QN-001-*.md`

Use Edit tool to strikethrough each row with a "resolved YYYY-MM-DD: see q-QX-NNN" annotation.

- [ ] **Step 6: User sign-off**

Use AskUserQuestion to ask:

> "Phase 1 outputs ready for review:
>  - `phase1/scope-relationship-map.md` (X source + Y target tables, Z edges)
>  - `phase1/source-target-matrix.md`
>  - `phase1/open-questions.md` (all questions resolved)
>  - `phase1/scope-relationship-map.json` (validates against schema)
>
> Approve Phase 1 as complete? (Yes / Request changes / Investigate specific table)"

- [ ] **Step 7: On approval — commit final**

```bash
git add docs/superpowers/specs/dm-migration-v0.2/phase1/
git commit -m "docs(dm-phase1): Phase 1 complete — scope & relationship map for R1"
```

- [ ] **Step 8: Tag**

```bash
git tag dm-spec-v0.2-phase1-complete
```

---

## Self-review checklist for the engineer running this plan

Before claiming Phase 1 done, verify:

1. ✅ All `tests/test_*.py` pass.
2. ✅ `validate_scope_map.py` returns `VALID` on the final JSON.
3. ✅ Zero entries with `needs_user_review: true` in the JSON.
4. ✅ Every source table has at least one entry in `evidence_refs` from a real archive file.
5. ✅ `scope-relationship-map.md` reads sensibly top-to-bottom; no `?` or `—` in critical decision columns.
6. ✅ `source-target-matrix.md` shows real mappings (not "no mappings asserted yet").
7. ✅ `grounding-decisions.md` open-questions table has all rows marked resolved.
8. ✅ Last commit message is `docs(dm-phase1): Phase 1 complete — scope & relationship map for R1`.

If any check fails: stop and surface to user. Do not advance to Phase 2 planning until all pass.

---

## What's next (after Phase 1 sign-off)

A new plan will be authored for Phase 2 (Methodology Playbook). It is gated by Phase 1 completion. Do not start Phase 2 work in this plan; the per-phase decomposition is intentional.

The Phase 2 plan will draw from Phase 1's archived Q&A and the rules implicitly encoded in the resolved scope map (e.g., naming conventions, FK patterns, decision rationales) to produce `phase2/dm-playbook.md`.
