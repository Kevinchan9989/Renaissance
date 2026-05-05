---
title: MAS OMEGA DM Conversion Mapping Specification — v0.2 design
date: 2026-05-04
status: draft
authors: [kevinchan]
scope: R1 wave only (eApps, SBA, Syndication, MLOG, System Batch Job)
inputs:
  - gsib-migration/workspace/MAS_OMEGA_DM_Conversion_Mapping_Specification _v0.01.xlsx
  - gsib-migration/workspace/omega-ddl-current.dict.json
  - gsib-migration/workspace/script-*.json (parsed source DDL)
  - backups/workspace.json (dm-tool persisted sample data)
  - NotebookLM "OMEGA documentation source" (per memory)
output: gsib-migration/workspace/MAS_OMEGA_DM_Conversion_Mapping_Specification_v0.02.xlsx
---

# MAS OMEGA DM Conversion Mapping Specification — v0.2 design

## 1. Problem statement

The v0.01 mapping specification covers four module families (SECMST, ISSCAL, ISSANN, BIDCOL)
sourced from a small set of eApps tables. The remaining R1 source surface is unmapped, the
OMEGA target DDL has changed since v0.01 was authored, and a sizeable portion of the source
inventory (`SBA`, `Syndication`) is marked TBD pending domain analysis. The current dm-tool
exports a per-table data dictionary; it cannot produce a workbook in the v0.01 cross-system
mapping format.

The goal of v0.2 is a complete, signed-off mapping spec for the audited R1 scope, produced
from authoritative sources (NotebookLM, source DDL, target DDL, sample data, OMEGA DB),
authored inside dm-tool, and exported as an xlsx whose layout, voice, and styling match
v0.01 exactly.

## 2. Goals and non-goals

### Goals

1. Produce `MAS_OMEGA_DM_Conversion_Mapping_Specification_v0.02.xlsx` covering all R1 source
   tables that the audit determines should migrate.
2. Replace the draft `Y/N/TBD` decisions in v0.01's *List of Source Tables* with audited,
   evidence-cited decisions for the R1 scope.
3. Establish a repeatable methodology (the "dm-playbook") for future waves and revisions,
   extracted from the work of producing v0.2.
4. Extend dm-tool to model Modules, Migration Summary, and Overview metadata, and to export
   a workbook that round-trips v0.01 byte-equivalently before being trusted for v0.2.
5. Capture every NotebookLM and legacy-source Q&A verbatim with citations and a per-claim
   evaluation, so every decision in the spec is traceable.

### Non-goals (this design)

- R2 wave (Daily Price, ERF). Out of scope for v0.2.
- Authoring or running the actual migration SQL. v0.2 is the *spec*; execution is downstream.
- Migrating away from the existing v0.01 voice/format. The spec format is fixed.
- Replacing dm-tool's per-table data-dictionary export. The new mapping-spec exporter is
  additive; the existing exporter stays.

## 3. Architecture — five phases, gated

```
Phase 1  Scope & Relationship Map (R1)
         Inputs:  source DDL (script-*.json), target DDL (omega-ddl-current.dict.json),
                  v0.01 inventory, NotebookLM, legacy-source codebase, OMEGA DB,
                  dm-tool sample data (backups/workspace.json)
         Outputs: phase1/scope-relationship-map.md
                  phase1/scope-relationship-map.json
                  phase1/notebooklm-archive/        (one file per NLM Q&A)
                  phase1/legacy-source-archive/     (one file per legacy-source Q&A)
                  phase1/db-queries-archive/        (one file per OMEGA DB query+result)
                  phase1/source-target-matrix.md    (cross-system heatmap)
                  phase1/open-questions.md          (Q&A backlog, batched by channel)
         Gate: schema valid · zero unresolved review items · user sign-off

Phase 2  Methodology Playbook (extracted)
         Inputs:  Phase 1 outputs, v0.01 module structure
         Outputs: phase2/dm-playbook.md
         Gate: playbook reproduces all v0.01 modules retroactively (sanity check)

Phase 3  Vertical-slice loop (one module per loop)
         Per slice:
           3a. Pick next module candidate from Phase 1 map
           3b. Run methodology: Q&A → decompose → draft mapping rows in markdown
           3c. Extend dm-tool minimally to support this module's shape
           3d. Enter content into dm-tool
           3e. Export Excel, compare against v0.01 conventions
           3f. User validates, iterate, next module
         Outputs: phase3/module-drafts/MAS-OMEGA-{XXX-NNN}.md (transient)
                  dm-tool storage entries (Modules, rows)
                  dm-tool source code increments (per slice, committed separately)
         Gate per slice: per-row checks green · user accepts the slice

Phase 4  Stabilization
         Activities: refactor any duplicated tool code from Phase 3 increments;
                     run v0.01 round-trip regression test; freeze playbook + tool API.
         Outputs: phase4/v0.01-roundtrip-diff.md (must show zero unaccepted diffs)
         Gate: round-trip diff is clean (or accepted differences explicitly documented)

Phase 5  Bulk-fill v0.2
         Activities: walk remaining R1 modules through the locked playbook + tool;
                     refresh List of Source Tables; refresh Migration Summary;
                     final export.
         Outputs: gsib-migration/workspace/MAS_OMEGA_DM_Conversion_Mapping_Specification_v0.02.xlsx
                  Updated phase1/scope-relationship-map.* with final state
         Gate: user signs off on v0.2.xlsx
```

The methodology playbook is *extracted* from Phase 1 + the first slices, not written
upfront. The dm-tool data model is built to fit Phase 1's needs plus what the first three
slices reveal — not prophesied. Phase 4 is the format-fidelity gate before v0.2 is trusted.

## 4. Components and deliverables

### 4.1 Repo artifacts

All under `docs/superpowers/specs/dm-migration-v0.2/` unless noted.

| Phase | Path | Purpose |
|------:|------|---------|
| 0 | `2026-05-04-dm-mapping-spec-design.md` | This design spec |
| 0 | `2026-05-04-dm-mapping-spec-plan.md` | Implementation plan (writing-plans output) |
| 1 | `phase1/scope-relationship-map.md` | Human-readable R1 inventory + relationships + audited decisions |
| 1 | `phase1/scope-relationship-map.json` | Machine-readable twin; feeds dm-tool import |
| 1 | `phase1/notebooklm-archive/` | One file per NotebookLM Q&A |
| 1 | `phase1/legacy-source-archive/` | One file per legacy-source codebase Q&A |
| 1 | `phase1/db-queries-archive/` | One file per OMEGA DB query + result |
| 1 | `phase1/source-target-matrix.md` | 2-D heatmap (source tables × target tables) |
| 1 | `phase1/open-questions.md` | Backlog, batched by channel (NLM / legacy / DB) |
| 2 | `phase2/dm-playbook.md` | Methodology extracted from doing Phase 1 + slices |
| 3 | `phase3/module-drafts/MAS-OMEGA-{XXX-NNN}.md` | Per-module markdown drafts (transient staging) |
| 4 | `phase4/v0.01-roundtrip-diff.md` | Round-trip regression report |
| 5 | `gsib-migration/workspace/MAS_OMEGA_DM_Conversion_Mapping_Specification_v0.02.xlsx` | Final v0.2 |

### 4.2 dm-tool extension — types

Note on target tables: **`_t` (audit twin) tables are out of scope for v0.2 mapping
rows by default.** Per NotebookLM grounding (`phase1/notebooklm-archive/grounding/g003`),
`_t` tables are populated by Hibernate Envers-style ORM listeners post-Go-Live; migration
populates the *base* tables only. Mapping rows whose `tgtTable` ends in `_t` are rejected
unless an explicit override is recorded for that module (DVT-driven exception).

Added to `dm-tool/src/types/index.ts`:

```ts
export interface Module {
  id: string;                    // "MAS-OMEGA-SECMST-001"
  description?: string;
  sequence: number;              // Migration Summary order (10, 20, ...)
  sourceTableNames: string[];
  targetTableNames: string[];
  dependency?: string;           // e.g. "Must run after MAS-OMEGA-SECMST-001"
  filterRule?: string;           // e.g. "ABA0007_TYPE_OF_APPLN = 'IND'"
  status: 'draft' | 'review' | 'approved';
}

export interface ModuleMappingRow {
  moduleId: string;
  srcTable: string | '-';
  srcColumn: string | '-';
  srcDataType: string | '-';
  srcNullable: 'Y' | 'N' | '-';
  toMigrate: 'Y' | 'N';
  tgtTable: string | '-';
  tgtColumn: string | '-';
  tgtDataType: string | '-';
  tgtNullable: 'Y' | 'N' | '-';
  transformation: string;        // locked vocabulary; see playbook
  remarks: string;               // '-' when empty
}

export interface ProjectMetadata {
  projectName: string;
  documentName: string;
  documentVersion: string;
  sourceSystems: string[];
  targetSystem: string;
  preparedBy: string;
  reviewedBy: string;
  date: string;
}

export interface RevisionEntry {
  date: string;
  version: string;
  description: string;
  author: string;
  remark: string;
}

export interface SignOffEntry {
  role: string;                  // "Prepared By (TECQ)" etc.
  nameDesignation: string;
  signature?: string;
  date?: string;
}
```

`Script` gains optional `modules?: Module[]`, `mappingRows?: ModuleMappingRow[]`,
`projectMetadata?: ProjectMetadata`, `revisions?: RevisionEntry[]`, `signOffs?: SignOffEntry[]`.

### 4.3 dm-tool extension — UI

- New **Modules** view in sidebar alongside *Tables*, *ERD*, *Mapping*.
- Module editor: header form (metadata) + editable rows table; column pickers backed by
  schemas already loaded in tool.
- **Migration Summary** view: derived list of all modules ordered by sequence; editable
  sequence/dependency/filter inline.
- **Overview** editor: project metadata + revision history + sign-off entries.
- Re-use existing `ERDViewer` to render source-side and target-side ERDs from Phase 1
  outputs (no new viewer needed).

### 4.4 dm-tool extension — exporter

`dm-tool/src/utils/mappingSpecExport.ts` — produces v0.01 layout:

1. `Overview` — project metadata, revision history, sign-off (merged-cell layout matches v0.01).
2. `List of Source Tables` — from Phase 1's audited inventory.
3. `Migration Summary` — from `Module[]` ordered by sequence.
4. One sheet per Module with the 12-column row shape.
5. `Codes` — constants/enums lookup.

Reuses styling primitives in existing `excelExport.ts`:
`TITLE_BG '1B3A5C'`, `SECTION_BG '2C5282'`, `HEADER_BG 'E2E8F0'`, thin black borders,
`DATA_ROW_HEIGHT`, `estimateRowHeight`, merged-cell helper.

### 4.5 Methodology playbook contents

1. **Decomposition rules** — the patterns observed in v0.01 plus any new patterns surfaced
   by Phase 1:
   - One module per (source table → target table) pair.
   - Multi-source-to-one-target produces multiple modules (one per source).
   - Filter splits on the same source→target produce multiple modules.
2. **Q&A prompt templates** — typed by channel (see §5.4):
   - NotebookLM: business purpose, OMEGA design intent, master-code definitions.
   - Legacy source: actual data flow in eApps/SBA, stored-procedure logic, observed nulls.
   - OMEGA DB: row counts, FK integrity joins, NULL ratios, sample values.
3. **Fill conventions** — initial vocabulary for the `Transformation` cell, derived from
   v0.01: `Direct Mapping`, `Map to constant value: 'X'`, `Map to NULL`,
   `IF X -> 'CONST'` ladders, `Generate UUID: …`. Remarks default to `-` when empty.
   Phase 2 finalizes the full vocabulary by exhaustively scanning v0.01 — any phrasing
   used in v0.01 that is not in this initial list is added to the locked set so the
   `voiceLint` check does not reject historically-accepted phrasings.
4. **Validation checks** — per-row and per-module gates listed in §6.

## 5. Data flow

### 5.1 Inputs

| Source | Format | Used for |
|--------|--------|----------|
| NotebookLM (OMEGA notebook) | Q&A via notebooklm-skill | OMEGA target intent, master codes, business semantics |
| Legacy-source Claude/Cursor session | Q&A relayed by user | Source-system behavior, eApps/SBA logic, observed values |
| OMEGA DB (user-run queries) | SQL + result relayed by user | Row counts, FK integrity, sample values at scale |
| `omega-ddl-current.dict.json` | JSON | Target schema (tables, columns, types, declared FKs) |
| `gsib-migration/workspace/script-*.json` | JSON | Parsed source DDL with constraints |
| `backups/workspace.json` (dm-tool persistence) | JSON | Existing sample CSV data attached per source table |
| `MAS_OMEGA_DM_Conversion_Mapping_Specification _v0.01.xlsx` | XLSX | Regression baseline + voice/styling reference |

### 5.2 Phase-by-phase flow

```
[NotebookLM] ─┐
[Legacy src] ─┤
[OMEGA DB]   ─┼─► Phase 1 ─► scope-relationship-map.{md,json}
[Source DDL] ─┤              source-target-matrix.md
[Target DDL] ─┤              open-questions.md
[Sample CSV] ─┘              {nlm,legacy,db}-archive/
                                 │  (user reviews, evaluations resolved)
                                 ▼
                              Phase 2 ─► dm-playbook.md
                                 │
                                 ▼
       ┌─── Phase 3 (loop, per module) ────────────────────┐
       │  scope-map.json + playbook → pick module          │
       │       │                                           │
       │       ▼                                           │
       │  Q&A (3 channels) → archives                      │
       │       │                                           │
       │       ▼                                           │
       │  module-draft.md → dm-tool entry → export sheet   │
       │       │                                           │
       │       ▼                                           │
       │  visual diff vs v0.01 → user validates → next     │
       └───────────────────────────────────────────────────┘
                                 │
                                 ▼
                              Phase 4 ─► v0.01-roundtrip-diff.md
                                 │     gate: must pass before Phase 5
                                 ▼
                              Phase 5 ─► v0.2.xlsx (final)
```

### 5.3 Single source of truth at each stage

- **Scope/relationship facts**: `scope-relationship-map.json`. Phase 3+ never re-derive
  scope; they read this.
- **Mapping content (rows)**: dm-tool's storage (electronStorage / `backups/workspace.json`).
  Markdown drafts in Phase 3 are *staging* only; deleted or archived once the row is in tool.
- **Final spec**: the exported xlsx is *derived*, never hand-edited. Edits go back into the
  tool.
- **Q&A**: `phase1/{nlm,legacy,db}-archive/` is append-only, never rewritten.

### 5.4 Q&A topology — three channels

| Channel | Best for | Format I emit |
|---------|----------|--------------|
| **NotebookLM (OMEGA notebook)** | Target system intent, master-code semantics, OMEGA design rationale | English prompt |
| **Legacy-source Claude/Cursor session** (user relays) | Source-system behaviors, eApps/SBA logic, observed nulls, code references in legacy | English prompt + relevant table/column names |
| **OMEGA DB direct queries** (user runs) | Row counts, FK integrity, NULL ratios, value distributions, sample extraction | SQL block |

`phase1/open-questions.md` is split into three sections (one per channel) so each batch can
be pasted into the right place.

### 5.5 "Preserve & evaluate" rule

Every Q&A produces a file with this shape:

```yaml
---
id: 001
date: 2026-05-04
phase: 1
channel: notebooklm | legacy-source | omega-db
topic: "ABA0009_BANK_MASTER business purpose"
prompt: |
  <verbatim prompt sent>
answer: |
  <verbatim answer>
citations:
  - source: "OMEGA FSD §4.2"
    quality: high | medium | low
evaluation:
  confidence: high | medium | low
  contradictions: []
  gaps: []
  decision: "Migrate (Y); see scope-map row 9"
  needs_user_review: false
---
```

If `needs_user_review: true`, that fact does not become a decision until you confirm.
The map's JSON cross-references the archive file ID for every claim that came from a Q&A
channel.

### 5.6a Column-level comprehension (added 2026-05-05)

Phase 1 must establish, before any per-module mapping work begins, a column-level
*understanding* of every Y-to-migrate column on both source and target sides. Without
this, transformation cells in Phase 5 are guesswork dressed in citations.

**Per-column requirement:** every Y-to-migrate column has either:
- `comprehension_status: "reviewed"` with `explanation` (string) and `possible_values`
  (string) populated, plus at least one entry in `comprehension_evidence_refs` pointing
  at a Q&A archive ID, OR
- `comprehension_status: "skip"` with a one-sentence rationale in the column's
  `explanation` field (e.g., "legacy artifact column, not migrated, source-side only").

`comprehension_status: "pending"` is allowed during Phase 1 execution but **the Phase 1
gate fails if any Y-to-migrate column on a Y-to-migrate table is still pending.**

**Sourcing comprehension (priority order):**

1. **dm-tool's existing `reviewed: true` entries** in `omega-ddl-current.dict.json` —
   target-side; already trustworthy. T8 combiner seeds these as `reviewed`.
2. **NotebookLM batched table-level queries** — for each Y-to-migrate target table where
   coverage from (1) is incomplete, emit one prompt covering all the table's columns at
   once. Reduces query count from per-column to per-table.
3. **Legacy-source channel** — same pattern for source-side tables (eApps, SBA,
   Syndication, etc.).
4. **OMEGA DB sample-value queries** — when business semantics are clear but value
   distributions / null patterns aren't.
5. **User direct** — your input fills any residual gaps; recorded as a user-channel Q&A.

**Comprehension Q&A archive shape (extension of §5.5):**

```yaml
---
id: QC-NNN
date: 2026-MM-DD
phase: 1
channel: notebooklm | legacy-source | omega-db | user
topic: "Column comprehension: <table_name>"
prompt: |
  <verbatim batched prompt covering all table columns>
answer: |
  <verbatim batched answer>
column_explanations:
  <column_name>:
    explanation: "..."
    possible_values: "..."
    citation: "..."   # optional per-column citation
  <column_name>:
    ...
evaluation:
  confidence: high | medium | low
  needs_user_review: <bool>
---
```

The merger (Task 16) reads `column_explanations` and assigns each column's entry into
the scope-relationship-map's `tables[].columns[]` records, setting
`comprehension_status: "reviewed"` and appending the archive ID to
`comprehension_evidence_refs`.

**Mirror-back to dm-tool (Phase 5):** at v0.2 export time, comprehension content also
flows back into dm-tool's storage so the tool's data dictionary reflects the audited
explanations. This keeps two sources of truth from drifting and lets future you
re-author from the tool's UI without losing context.

### 5.6 Sample-data integration

dm-tool already persists CSV samples per source table via `sampleDataAttachments` (in
`backups/workspace.json`). Phase 1 reads these to:

- Validate candidate FKs by attempting joins on the available samples.
- Capture observed-value distributions per column (feeds master-code derivation).
- Estimate cardinality direction (1:1, 1:N, N:N) where samples are sufficient.

Where samples are partial or absent and the FK is critical, Phase 1 emits an OMEGA DB query
to the DB channel and records the validation as `pending_user_run` until the answer comes
back.

### 5.7 scope-relationship-map.json shape

The block below illustrates the JSON shape (truncations like `[...]` and `"..."` are
elisions, not literal placeholders). The authoritative shape is the JSON schema at
`dm-tool/src/schemas/scope-relationship-map.schema.json` (created in Phase 1).

```json
{
  "$schema": "./schemas/scope-relationship-map.schema.json",
  "version": "0.2-draft",
  "generated_at": "2026-05-04T...",
  "scope": "R1",
  "tables": [
    {
      "name": "ABA0007_DETAIL_AUCTION_RESULT",
      "domain": "eApps",
      "schema": "MNETD & PRI1",
      "wave": "R1",
      "columns": [...],
      "primary_key": [...],
      "row_volume_estimate": { "value": 482, "source": "sample" },
      "decision": {
        "to_migrate": "Y",
        "rationale": "Authoritative auction-result store; required for BIDCOL",
        "evidence_refs": ["nlm-archive/017", "legacy-archive/004"]
      }
    }
  ],
  "edges": [
    {
      "id": "E-001",
      "kind": "fk-declared | fk-implicit | business-hierarchy",
      "from": { "table": "...", "column": "..." },
      "to":   { "table": "...", "column": "..." },
      "evidence": {
        "ddl_declared": false,
        "naming_match": true,
        "nlm_archive_id": "017",
        "sample_join": { "matched": 482, "orphans": 0, "coverage": "partial" },
        "db_validation": { "status": "pending_user_run", "query_id": "Q-007" }
      },
      "cardinality": "N:1",
      "confidence": "medium",
      "needs_user_review": false
    }
  ],
  "source_target_matrix": [
    { "source": "ABA0001_SECURITY_MASTER", "targets": ["sec.sec_security_master", "iss.iss_issuance"] }
  ],
  "questions_open": [
    { "id": "Q-007", "channel": "omega-db", "prompt": "...", "for_edge": "E-001" }
  ]
}
```

## 6. Validation, error handling, and gates

### 6.1 Per-phase validation

**Phase 1**

- Every R1 source table has a migrate decision (Y/N) with citation refs.
- Every claimed FK / hierarchy edge cites its source.
- `scope-relationship-map.json` validates against its JSON schema.
- Zero entries with `needs_user_review: true` remain unresolved.

**Phase 2**

- Every decomposition rule has ≥1 example from v0.01.
- Applying the playbook retroactively to v0.01's modules reproduces them.
- Every fill convention is in a locked vocabulary set.

**Phase 3 — per slice (automated where possible)**

| Check | Pass criterion |
|---|---|
| Source coverage | Every source column has either `toMigrate=Y` w/ target OR `toMigrate=N` w/ Remarks reason |
| Target coverage | Every target column has a non-empty transformation |
| Non-null safety | Every NOT-NULL target column has a non-NULL transformation |
| PK preservation | Every PK column on target has a transformation |
| FK integrity | Every target FK references a table in target schema |
| Voice | Transformation cells use only locked vocabulary; Remarks `-` when empty |
| Sequence | Module's `dependency` references existing module IDs only |
| _t exclusion | No `tgtTable` ends in `_t` (unless module flagged with explicit DVT override) |
| Excel diff | Exported sheet visually matches v0.01 conventions |

**Phase 4 — round-trip gate (must pass before Phase 5)**

1. Import v0.01 content into tool (Modules + rows + Overview + Migration Summary).
2. Export.
3. Compare to original v0.01.xlsx:
   - Structural diff (sheet count, names, headers, column widths, merged ranges) → zero.
   - Content diff (per-cell value) → zero.
   - Style diff (font, fill, border, alignment, numFmt per cell) → zero, or any documented
     intentional difference explicitly accepted.
4. Diff report attached to `phase4/v0.01-roundtrip-diff.md`.

**Phase 5**

- Migration Summary's dependency graph is acyclic.
- Sequence numbers strictly increasing.
- Every module's source & target tables exist in audited inventory.
- All per-slice checks re-run before final export.

### 6.2 Conflict resolution rules

- **DDL vs Q&A disagree on a structural fact** → DDL wins; conflict logged.
- **Two Q&A channels disagree** → flag for user review; don't silently pick one.
- **Q&A citation quality is low** (no clear source) → confidence ≤ medium; if used for a
  migrate/skip decision, `needs_user_review: true`.
- **Tool export differs from v0.01** during Phase 4 → tool bug, not acceptable variance,
  unless explicitly accepted in writing in the diff report.

### 6.3 Runtime error handling

- **Q&A channel unavailable / auth expired** → halt phase, surface to user, retry once on
  transient errors. No guessing.
- **DDL parse failure** → halt; surface line + context.
- **Tool storage corruption / version mismatch** → versioned migrations on
  `electronStorage` writes; refuse to load on version mismatch.
- **Round-trip diff partial fail** → block Phase 5; itemize differences; user decides each
  (fix vs accept).

### 6.4 Gates summary

```
Phase 1 → 2 : map JSON valid · 0 unresolved review items · user sign-off
Phase 2 → 3 : playbook reproduces all v0.01 modules retroactively
Phase 3 → 4 : ≥3 slices completed · all per-slice checks green
Phase 4 → 5 : round-trip diff is clean (or accepted differences documented)
Phase 5 → ✓ : user signs off on v0.2.xlsx
```

## 7. Testing

### 7.1 Test pyramid

```
┌──────────────────────────────────────────────────────┐
│  User sign-off (manual)                              │  Phase 1 map, slices, final v0.2
├──────────────────────────────────────────────────────┤
│  Format-fidelity round-trip (Phase 4 gate)           │  TOP PRIORITY
├──────────────────────────────────────────────────────┤
│  Integration: tool ↔ exporter (Vitest + jsdom)       │
├──────────────────────────────────────────────────────┤
│  Unit: validators, schema, voice, coverage           │
└──────────────────────────────────────────────────────┘
```

### 7.2 Unit tests in dm-tool (Vitest)

- `mappingSpecExport.test.ts` — fixture Modules + rows + metadata produce expected sheet
  names, headers, row contents (asserted via `exceljs`).
- `scopeMapSchema.test.ts` — invalid JSON shapes rejected; valid shapes pass.
- `moduleGraph.test.ts` — cyclic dependencies rejected; missing refs rejected; topological
  sort stable.
- `voiceLint.test.ts` — transformation cells outside locked vocabulary flagged.
- `coverage.test.ts` — missing target coverage / NOT-NULL violations flagged.

### 7.3 Integration tests

- Seed dm-tool storage from a fixture `scope-relationship-map.json` → modules appear in
  UI → export → workbook round-trips back to the same Module fixture.
- v0.01 import → Module list matches v0.01's 11 modules exactly.

### 7.4 Format-fidelity round-trip (the gate test)

Standalone script `scripts/v01-roundtrip-test.ts`:

```
1. Load v0.01.xlsx via exceljs → extract Modules, rows, metadata.
2. Seed a tool workspace from that extraction.
3. Run mappingSpecExport.ts → tool-exported.xlsx.
4. Compare original vs tool-exported:
     sheet names + order, per-cell value, per-cell style
     (font, fill, border, alignment, numFmt), merged ranges,
     column widths, row heights.
5. Emit diff → phase4/v0.01-roundtrip-diff.md.
6. Exit non-zero on any unaccepted diff.
```

Wired to npm: `npm run test:fidelity`.

### 7.5 Test fixtures

- `tests/fixtures/v0.01-snapshot.json` — extracted ground truth from v0.01.xlsx.
- `tests/fixtures/sample-module.json` — minimal Module + 5 rows.
- `tests/fixtures/scope-map.sample.json` — minimal valid scope map.

### 7.6 Out of scope for automated testing

- Correctness of NotebookLM / legacy / DB answers (handled by "preserve & evaluate" + user
  review).
- Correctness of mapping decisions (Y/N, transformation logic) — user-reviewed and signed
  off.
- Actual data migration behavior — downstream effort, not this spec.

### 7.7 Local commands

```
cd dm-tool
npm test                                           # units + integration
npm run test:fidelity                              # round-trip gate
npm run validate:scope-map -- ../docs/superpowers/specs/dm-migration-v0.2/phase1/scope-relationship-map.json
npm run validate:modules
```

## 8. Operational notes

### 8.1 Effort level

Each execution session for Phase 1 (map authoring), Phase 3 slices, Phase 4 round-trip, and
Phase 5 bulk-fill should be run in `/effort max`. The brainstorming/spec-writing session
that produced this document was already at max; subsequent sessions need to set it again at
session start.

### 8.2 Confidence ceiling

This design will not deliver "150%" relationship clarity. What it delivers:

- **Structural facts (column types, declared FKs, NOT NULLs)**: ~100% (DDL is authoritative).
- **Implicit FKs**: 95%+ via sample-data joins + Q&A + user confirmation.
- **Business semantics**: ~90% via NotebookLM + legacy-source channel + user expertise.
  The remaining ~10% is irreducible without speaking to the original system owners and
  is captured explicitly as risks in `phase1/open-questions.md`.

### 8.3 What this spec does *not* settle

- Whether the SBA TBDs (48) and Syndication TBDs (5) actually flip to Y. Phase 1 settles
  this with evidence; we cannot pre-decide it here.
- The exact UI ergonomics of the Modules view in dm-tool. Phase 3 will refine through use.
- The shape of Phase 5's progress reporting. Decided when we get there.

## 9. Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| NotebookLM coverage gaps for legacy source-system semantics | Phase 1 stalls on TBDs | Legacy-source Claude/Cursor channel covers this; explicitly typed prompts route there |
| Sample data is partial → FK validation incomplete | Lower confidence on relationships | Targeted OMEGA DB queries for high-stakes FKs; non-critical edges marked `coverage: partial` honestly |
| Tool extension grows scope beyond what's needed | Phase 3 slices stall on UI work | Each slice extends tool *only* for its module's needs; refactor pass at Phase 4 |
| Format drift between tool export and v0.01 | v0.2 fails sign-off review | Phase 4 round-trip is a hard gate; programmatic styling diff catches drift |
| Q&A archives bloat the repo | Repo navigation slowed | Archive files are small (~1-3KB each); estimated ≤500 files for R1 |

## 10. Success criteria

- `MAS_OMEGA_DM_Conversion_Mapping_Specification_v0.02.xlsx` exists and is signed off.
- Every cell's content is traceable to (a) source DDL, (b) target DDL, (c) a dated Q&A
  archive, or (d) a recorded user decision.
- The exporter passes `npm run test:fidelity` against v0.01 with zero unaccepted diffs.
- The dm-playbook, when applied to a fresh source table by another engineer, produces a
  module spec consistent with the existing v0.2 modules.

## 11. References

- v0.01 spec: `gsib-migration/workspace/MAS_OMEGA_DM_Conversion_Mapping_Specification _v0.01.xlsx`
- Target DDL: `gsib-migration/workspace/omega-ddl-current.dict.json`
- Source DDL bundles: `gsib-migration/workspace/script-*.json`
- Sample data store: `backups/workspace.json` (dm-tool persistence)
- Existing exporter (styling primitives to reuse): `dm-tool/src/utils/excelExport.ts`
- Existing types: `dm-tool/src/types/index.ts`
- Existing ERDViewer (reused for visual review): `dm-tool/src/components/ERDViewer.tsx`
- Memory: `~/.claude/.../memory/notebooklm_omega.md` — NotebookLM "OMEGA documentation source"
- Pre-Phase-1 grounding archive: `phase1/notebooklm-archive/grounding/g001..g003`
- Pre-Phase-1 grounding decisions: `phase1/grounding-decisions.md` (D1..D7 + schema snapshot)
