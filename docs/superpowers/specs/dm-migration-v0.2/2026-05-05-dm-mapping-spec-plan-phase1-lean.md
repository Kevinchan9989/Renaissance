# DM Mapping Spec v0.2 — Phase 1 LEAN PLAN

> **Supersedes Tasks 5–17 of the prior plan** (`2026-05-04-dm-mapping-spec-plan-phase1.md`).
> Tasks 1–4 of the prior plan are STILL IN EFFECT — commits `4d266ee`, `e177e17`, `6161f1e`,
> `27356ad`, `74a9b92`. Their artifacts (JSON schema, venv, validator, source DDL extractor)
> are reused by this lean plan.

**Goal:** Minimum-viable Phase 1 — gather column-level comprehension + migrate decisions
+ relationship inventory for R1 source tables, **reusing existing files as the source of
truth** wherever possible. Add only small sidecars for facts that don't fit in existing files.

**Why this exists:** The prior plan built a unified `scope-relationship-map.json` that
duplicated 80% of `omega-ddl-current.dict.json`. User correctly pushed back: "do we really
need this, or can we refer to the DDL?" The DDL is already on disk in usable form. This
lean plan reuses it and only creates artifacts where genuinely new information lives.

**End-state:** dm-tool's `omega-ddl-current.dict.json` has every R1-relevant target table
fully reviewed. A `source-explanations.json` sidecar holds the same for source columns.
Three small sidecars (`decisions.json`, `edges.json`, `source-target-matrix.json`) hold
the migration-specific facts. After this, Phase 5 writes v0.2.xlsx directly from these
inputs — no further intermediate artifacts.

---

## File layout (final shape after Phase 1)

| Path | Status | Source of truth for |
|---|---|---|
| `gsib-migration/workspace/omega-ddl-current.dict.json` | EXISTING — mutated during Q&A | Target column comprehension (explanations, possible_values, reviewed) |
| `gsib-migration/workspace/script-00-BE_MNETD.json`, `script-04-FE_TRI1.json` | EXISTING — read-only | Source DDL structure (cols, types, constraints) |
| `backups/workspace.json` | EXISTING — read-only | Source-side sample data attachments |
| `phase1/inventory.json` | NEW (LT1) | R1 source tables list with domain/wave/draft Y-N |
| `phase1/source-explanations.json` | NEW (LT5) | Per-source-table column comprehension |
| `phase1/decisions.json` | NEW (LT7) | Per-source-table migrate Y/N + rationale + evidence refs |
| `phase1/edges.json` | NEW (LT2) | FK relationships (declared + implicit + sample-join validated) |
| `phase1/source-target-matrix.json` | NEW (LT8) | source_table → [target_table…] mapping intent |
| `phase1/source-target-matrix.md` | NEW (LT8) | Rendered view of the above |
| `phase1/open-questions.md` | NEW (LT3) | Q&A backlog grouped by channel |
| `phase1/notebooklm-archive/` | NEW (LT4) | Verbatim NotebookLM Q&A |
| `phase1/legacy-source-archive/` | NEW (LT5) | Verbatim legacy-source Q&A |
| `phase1/db-queries-archive/` | NEW (LT6) | Verbatim OMEGA DB query results |

**Removed from prior plan:**
- `scope-relationship-map.json` — not needed; existing files + sidecars cover it
- `extract_target_ddl.py`, `extract_sample_data.py`, `build_scope_map_draft.py`, `render_scope_map_md.py` — redundant
- The unified JSON schema `dm-tool/src/schemas/scope-relationship-map.schema.json` stays in tree as historical reference but is not enforced

---

## Tasks

### LT1 — Inventory extractor (subagent — haiku, ~10 min)

**Files:**
- Create: `scripts/dm-phase1/extract_inventory.py` (effectively the same as prior plan T6)
- Create: `scripts/dm-phase1/tests/test_extract_inventory.py`
- Create: `scripts/dm-phase1/fixtures/inventory_min.xlsx`
- Output: `docs/superpowers/specs/dm-migration-v0.2/phase1/inventory.json`

**Spec:** Read v0.01 *List of Source Tables* sheet → emit dict keyed by tableName with
fields `{ domain, schema, draft_to_migrate, wave }`. Emit ALL rows (no filter). Consumers filter on the `wave` field as needed.
This is more flexible than baking the filter into the extractor and matches
what downstream tasks (LT2 edges, LT3 open-questions) want anyway.

(Use the original Plan Task 6 code verbatim; just change the output path to write directly
to `phase1/inventory.json` rather than the build/ dir.)

### LT2 — Edges extractor (subagent — sonnet, ~20 min)

**Files:**
- Create: `scripts/dm-phase1/extract_edges.py`
- Create: `scripts/dm-phase1/tests/test_extract_edges.py`
- Output: `docs/superpowers/specs/dm-migration-v0.2/phase1/edges.json`

**Spec:** Reads source DDL via `extract_source_ddl.extract_all()` (already implemented at
commit `74a9b92`) and sample data directly from `backups/workspace.json`. For each pair
of source tables:

1. Capture declared FKs from `data.targets[].constraints[]` where type == "Foreign Key".
2. Propose implicit FKs by name match (strip `ABA0007_` prefixes; match suffix to a PK column on another table).
3. For each candidate edge, attempt sample join. Record `{matched, orphans, coverage}`.
4. Compute confidence: declared+sample=high, naming-only+full sample=medium, naming-only+partial sample=low.

Emits `edges.json`:
```json
{
  "version": "0.2",
  "generated_at": "...",
  "edges": [
    {
      "id": "E-001",
      "kind": "fk-declared" | "fk-implicit",
      "from": { "table": "ABA0007_DETAIL_AUCTION_RESULT", "column": "ABA0007_SECURITY_CODE" },
      "to":   { "table": "ABA0001_SECURITY_MASTER", "column": "ABA0001_SECURITY_CODE" },
      "cardinality": "N:1",
      "evidence": {
        "declared": false,
        "naming_match": true,
        "sample_join": { "matched": 482, "orphans": 0, "coverage": "partial" }
      },
      "confidence": "medium"
    }
  ]
}
```

Tests: 4 — declared FK extraction, implicit FK proposal, sample-join match rate calc, confidence rollup.

### LT3 — Open-questions generator (subagent — sonnet, ~15 min)

**Files:**
- Create: `scripts/dm-phase1/generate_open_questions.py`
- Output: `docs/superpowers/specs/dm-migration-v0.2/phase1/open-questions.md`

**Spec:** Reads `omega-ddl-current.dict.json` + the two oracle script JSONs + `inventory.json` directly. Emits a backlog grouped by channel:

**Section: NotebookLM (target comprehension batches)**
For each target table whose `reviewed != true`: emit one prompt covering ALL its columns at once. Routes through `notebooklm-archive/`. Format per the comprehension batch template in spec §5.6a (`column_explanations` YAML response template).

**Section: Legacy-source (source comprehension batches)**
For each R1 source table currently drafted Y or TBD: emit one prompt covering all columns. Routes through `legacy-source-archive/`.

**Section: Migrate-decision audits**
For each R1 source table draft=TBD: emit a decision audit prompt ("Should this table migrate? If yes, to what target tables? If no, why?").

**Section: Grounding follow-ups (3 hardcoded)**
- Legacy-source: MLOG use-case
- Legacy-source: ABA0023_AUDIT_ACTION contents
- NotebookLM: FSD requirement for legacy audit translation into _t

**Section: OMEGA DB**
Empty initially; populates as edges/comprehension surface FK ambiguities.

### LT4 — NotebookLM Q&A burn (controller-driven, multi-session)

**Files affected (mutated):**
- `gsib-migration/workspace/omega-ddl-current.dict.json` — set per-column `explanations` + `possible_values`; flip table-level `reviewed: true` when all columns answered.
- `phase1/notebooklm-archive/q-QC-NNN-<table>.md` — verbatim archive per query.

**Process:** For each NotebookLM batch prompt in `open-questions.md`:

1. Invoke `notebooklm-skill` with the verbatim prompt.
2. Save the answer to `phase1/notebooklm-archive/q-QC-NNN-<table>.md` with full YAML frontmatter (per spec §5.5 + §5.6a column_explanations map).
3. Parse the `column_explanations` block; write each `(column → {explanation, possible_values})` into `omega-ddl-current.dict.json`.
4. Once a table's columns are all populated, flip `reviewed: true`.

Budget: NotebookLM free-tier 50 queries/day. ~46 R1-relevant target tables → ~1 day if uninterrupted; realistically 2–3 days with interruptions.

### LT5 — Legacy-source Q&A burn (user-in-loop, multi-session)

**Files affected:**
- `phase1/source-explanations.json` — keyed by source table name → per-column `{explanation, possible_values, citation}`
- `phase1/legacy-source-archive/q-QL-NNN-<table>.md` — verbatim archive

**Process:** For each legacy-source batch prompt in `open-questions.md`, hand to user. User pastes into their separate Claude/Cursor session on the legacy codebase, brings the answer back. Controller archives + parses + updates `source-explanations.json`.

### LT6 — OMEGA DB Q&A burn (user-in-loop, ad hoc)

Only fired when an edge or comprehension query needs scale-validation (sample data insufficient). User runs the SQL, pastes the result. Archived in `db-queries-archive/`.

### LT7 — Decisions consolidation (controller + user)

**Files:**
- Output: `phase1/decisions.json`

**Process:** With comprehension answered for source tables, controller drafts a migrate Y/N decision per R1 source table:
- If NotebookLM/legacy-source confirms business relevance and OMEGA target accepts the data → Y.
- If table is deprecated, audit-only, replaced by an interface, or dm-tool's draft was wrong on inspection → N.

Each entry:
```json
{
  "ABA0001_SECURITY_MASTER": {
    "to_migrate": "Y",
    "rationale": "Authoritative source for SGS security master; feeds iss.iss_security_master and iss.iss_issuance.",
    "evidence_refs": ["legacy-archive/q-QL-005", "notebooklm-archive/q-QN-012"],
    "decided_by": "controller",
    "user_confirmed": true
  }
}
```

User confirms each Y/N before it's locked.

### LT8 — Source→target matrix (controller + user)

**Files:**
- Output: `phase1/source-target-matrix.json` and `source-target-matrix.md`

**Process:** For each Y-decision source table, identify which target tables it feeds. Sources of intent:
1. v0.01's existing modules (e.g., ABA0001 → sec.sec_security_master + iss.iss_issuance — note v0.07 sec.* needs rename to iss.* per grounding D7).
2. NotebookLM answers about target table data sources.
3. User's domain knowledge for new mappings.

```json
{
  "ABA0001_SECURITY_MASTER": ["iss.iss_security_master", "iss.iss_issuance"],
  "ABA0021_ISSUE_CALENDAR": ["iss.iss_calendar_listing", "iss.iss_calendar_data"]
}
```

Render markdown view as 2-D heatmap.

### LT9 — Phase 1 gate verification + sign-off (controller + user)

**Checks:**
1. Every R1 source table from `inventory.json` has an entry in `decisions.json`.
2. Every Y-decision source table has all its columns covered in `source-explanations.json`.
3. Every target table referenced by `source-target-matrix.json` has `reviewed: true` in `omega-ddl-current.dict.json`.
4. `open-questions.md` is empty (every prompt has a corresponding archive file).
5. `edges.json` validates structurally.

User reviews + signs off.

---

## Coding conventions (carried forward from prior plan)

- All Python lives in `scripts/dm-phase1/` (already scaffolded at commit `e177e17`).
- TDD: failing test before implementation; tests under `scripts/dm-phase1/tests/`.
- Sample fixtures under `scripts/dm-phase1/fixtures/`.
- Small JSON validation: write per-sidecar JSON Schema if needed; or just inline validation.
- Commit messages: `feat(dm-phase1):` / `fix(dm-phase1):` / `docs(dm-phase1):`.

## Effort estimate

| Phase | Time | Token cost |
|---|---|---|
| LT1–LT3 (3 subagent tasks) | ~45 min in this session | ~150–200K tokens |
| LT4 (NotebookLM burn) | 2–3 sessions, ~50 NLM queries/session | mostly tool calls, low chat tokens |
| LT5 (legacy Q&A) | 2–3 sessions, paced by user | low |
| LT6 (DB queries) | 1 session if needed | low |
| LT7–LT8 (decisions + matrix) | 1 session, with user | medium |
| LT9 (gate) | 30 min | low |

**Calendar time:** plausible 1–2 weeks if you're available a few hours per session.

---

## What comes after Phase 1

Phase 5 — direct v0.2.xlsx authoring via Python + openpyxl, reading:
- `omega-ddl-current.dict.json` for target column types/explanations
- `source-explanations.json` for source column explanations
- `decisions.json` for which sources migrate
- `source-target-matrix.json` for module decomposition
- `edges.json` for Migration Summary dependency ordering
- v0.01.xlsx for styling reference (copy cell styles via openpyxl)

The dm-tool extension (originally Phases 3–4) becomes optional polish — not on the critical
path to producing v0.2.xlsx. Decide whether to do it after v0.2 is produced and reviewed.

---

## Plan amendments to TaskList

The original TaskList had Plan Tasks 5–17. The lean plan replaces them as follows:

| Original Task | Lean replacement |
|---|---|
| T5 (target DDL extractor) | OBSOLETE — read dict.json directly |
| T6 (inventory extractor) | LT1 (kept) |
| T7 (sample-data extractor) | OBSOLETE — read workspace.json directly |
| T8 (combiner) | OBSOLETE — no scope-map.json |
| T9 (FK validator) | LT2 (renamed, simplified) |
| T10 (render scope-map.md) | OBSOLETE |
| T11 (matrix renderer) | LT8 (subsumed) |
| T12 (open-questions generator) | LT3 |
| T13 (NotebookLM Q&A) | LT4 |
| T14 (legacy-source Q&A) | LT5 |
| T15 (OMEGA DB Q&A) | LT6 |
| T16 (Q&A merger) | absorbed into LT4/LT5 (write directly to dict.json + sidecars during Q&A burn, no batched merge) |
| T17 (gate) | LT9 |

Net: 13 → 9 tasks. 6 of those 9 are interactive (LT4–LT9), so subagent count drops from ~13 to ~3 (LT1, LT2, LT3).
