# Phase 1 — Grounding Decisions

This document records decisions derived from pre-Phase-1 NotebookLM grounding queries
(`phase1/notebooklm-archive/grounding/g001..g003`) plus user answers given on 2026-05-04.
Treat these as authoritative inputs for Phase 1 work.

## D1 — Migration pipeline shape

**Decision:** AWS DMS Full Load → temp Oracle env → cloud → custom ETL + DB object
translation → PostgreSQL OMEGA. Validation by iterative DVT (Data Verification Tests) +
DCT (Data Continuity Tests) by MAS users → Full Dress Rehearsal (FDR) → Go-Live Cutover.

**Source:** `notebooklm-archive/grounding/g001`

**Implication for Phase 1:** the scope-relationship-map should note for each migrated
table which DVT batch it belongs to (where known), so Phase 5 can sequence v0.2's
Migration Summary against DVT cycles.

## D2 — R1 / R2 split is by business module

**Decision:**
- R1 modules: `int_issuance_calendar`, `int_bills_bonds`, `int_ssb`, `int_allotment`.
- R2 modules: `int_erf`, `int_closing_price`.
- eApps is *partially* decommissioned in R1: OMEGA acts as interim middleware router for
  Daily Closing Prices and Securities Updates.

**Source:** `notebooklm-archive/grounding/g001`

**Implication:** the inventory's `Migrate in` column (`R1` / `R2`) reflects the wave the
*table* belongs to, but the deciding factor is which OMEGA business module owns it.
SBA and Syndication TBDs in R1 are evaluated against `int_ssb` / synd-related modules in
`iss.*`.

## D3 — MNETD = MNET (user-confirmed)

**Decision:** Inventory's `MNETD` and NotebookLM's `MNET` refer to the same physical
legacy database. Treat as one.

**Source:** user, 2026-05-04

**Implication:** no inventory edit needed; this is just a vocabulary normalization for
documentation (use the term consistently within `scope-relationship-map.md`).

## D4 — MLOG: pending use-case check

**Decision:** likely a log table; probably not needed in R1 or R2. **Treat as
out-of-scope (`to_migrate: N`) with `needs_user_review: true`** until use-case is
verified.

**Source:** user, 2026-05-04 (tentative)

**Open question (legacy-source channel):**
> "What is the purpose of the legacy MLOG database / tables? Is it a log/audit store?
>  Are there any operational dependencies on MLOG data post-OMEGA Go-Live? Specifically,
>  does any R1 or R2 OMEGA module read or reference MLOG data?"

**Implication for Phase 1:** route this to legacy-source Q&A. Until resolved, mark all
3 MLOG-domain rows in inventory as `to_migrate: N` with `decision: "Pending MLOG
use-case verification"`.

## D5 — `_t` audit twins are out of scope (default)

**Decision:** All `_t`-suffixed tables in OMEGA target schema (`cm.*_t`, `iss.*_t`) are
out of scope for v0.2 mapping rows. Migration populates base tables only; OMEGA's
application tier (Hibernate Envers-style ORM listeners) populates `_t` tables
post-Go-Live as users interact with the system.

**Source:** `notebooklm-archive/grounding/g003`

**Implication:** target table surface for mapping reduces from 129 → ~64 base tables.
Per-row check `_t exclusion` enforced (see §6.1 of design spec).

## D6 — Audit-action legacy translation: TBD with MAS

**Decision:** Whether MAS requires legacy audit tables (e.g., eApps `ABA0023_AUDIT_ACTION`)
to be translated into OMEGA's `_t` row-level historical format is **unconfirmed**.
Default assumption: NO. Mark as open until MAS DVT requirements are clarified.

**Source:** user, 2026-05-04 (deferred to MAS confirmation)

**Open questions:**

1. **Legacy-source channel:**
   > "What does ABA0023_AUDIT_ACTION contain? What columns, what events does it log
   >  (insert/update/delete? schema changes? business actions?), retention period, row
   >  volume estimate. Is it consulted by any operational legacy report or job?"

2. **NotebookLM channel:**
   > "Does any OMEGA FSD (Reports, Admin, or DM-related) explicitly require legacy
   >  audit data (e.g., eApps ABA0023_AUDIT_ACTION) to be translated and loaded into
   >  OMEGA's `_t` historical format at Go-Live? If so, which target `_t` tables are in
   >  scope and what is the row-level translation rule?"

**Implication:** treat audit-action translation as a deferred work item. Phase 1 should
flag this as a question, not block.

## D7 — `sec` schema folded into `iss` (user-confirmed)

**Decision:** v0.01's `sec.sec_security_master` no longer exists in current OMEGA target
DDL. The `sec` schema was **folded into `iss`** as part of the DDL change since v0.01.
Specifically:
- `sec.sec_security_master` → `iss.iss_security_master` (rename / move)

**Source:** user, 2026-05-04

**Implication:**
- v0.2 **patches** v0.01 modules rather than re-decomposing SECMST from scratch.
- Affected v0.01 modules to update in v0.2:
  - `MAS-OMEGA-SECMST-001` — change `Target Table` cell on every row from
    `sec.sec_security_master` to `iss.iss_security_master`.
- Phase 4 v0.01 round-trip test must account for this: the round-trip baseline is
  v0.01 *as-is*; the round-trip test exercises the exporter, not the content.
  Content updates (sec → iss) are a v0.2 delta, not a regression.

## Schema inventory snapshot (target side)

Derived locally from `gsib-migration/workspace/omega-ddl-current.dict.json` on 2026-05-04:

| Schema | Base tables | `_t` twins | Total |
|--------|-------------|------------|-------|
| `cm`   | ~24         | ~25        | 49    |
| `iss`  | ~22         | ~21        | 43    |
| `stg`  | 37          | 0          | 37    |
| **Total** | **~83** | **~46**   | **129** |

Mapping-row scope (excluding `_t`): **~83 base tables + ~37 `stg` interface tables**.

Note: `stg` schema is an *interface staging* zone (e.g., `stg_eapps_in_closingprice`,
`stg_meps_out_secupdt`) — its tables mirror byte-level interface file layouts. **User
confirmed (2026-05-04): `stg.*` is populated by runtime interface processing, NOT by
migration.** All 37 `stg.*` tables are out-of-scope for v0.2 mapping rows.

Effective target table surface for v0.2 mapping:
- `cm.*` base tables (excluding `_t`): ~24
- `iss.*` base tables (excluding `_t`): ~22
- **Total mappable target tables: ~46**

## Open questions consolidated (going into open-questions.md when Phase 1 starts)

| # | Channel | Question |
|---|---------|----------|
| 1 | legacy-source | MLOG database use-case + dependencies |
| 2 | legacy-source | ABA0023_AUDIT_ACTION contents / volume / row-level structure |
| 3 | NotebookLM | FSD requirement for legacy audit translation into `_t` |
| ~~4~~ | ~~user direct~~ | ~~Is `stg.*` populated by migration, or only by runtime interface processing?~~ — **resolved 2026-05-04: runtime only, out of migration scope** |
