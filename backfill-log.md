# OMEGA DDL (Current) — Backfill Log

**Date:** 2026-04-29
**Target script:** `OMEGA DDL (Current)` — id `1777435262394-mfwwbicj0` (132 tables, 3,414 columns)
**Source script:** `OMEGA Full` — id `1769748075633-thy4gl0om` (122 tables)
**Storage:** SQLite — `C:\Users\ECQ1025\AppData\Roaming\dm-tool\workspace.db`

## Overall (Phase A — backfill from OMEGA Full)

- 47 of 132 tables had a match in OMEGA Full → all 47 backfilled
- 85 tables remain (DDL-only, no source) → Phase B (NotebookLM)
- Column `explanation`: 1,028 of 3,414 filled (30%)
- Column `possible_values`: 747 of 3,414 filled (22%)
- Tables flagged `explanation_completed=1`: 6
- Table `description` set: 47

## Write rules applied

- Never overwrite a non-empty cell.
- `explanation`: convention dictionary first (uniformity), OMEGA Full source second.
- `possible_values`: OMEGA Full source first (per-table examples), convention dictionary second.
- `description`: copied from OMEGA Full when target was empty.
- `explanation_completed=1` only when the table has every column explained.
- `_t` shadow rows that were `"-"` placeholder in OMEGA Full are skipped (not propagated).

## Conventions used (auto-applied to matching column names)

### explanation (14 columns)
| Column | Wording |
|---|---|
| `id` | Primary Key. Auto-incremented system generated identifier. |
| `uuid` | Unique system generated identifier used for foreign key linkages. |
| `is_deleted` | Record deletion indicator. Default is 'N'. |
| `is_migrated` | Data migration indicator. Default is 'N'. |
| `created_dt` | System timestamp of record creation. |
| `created_by` | Identifier of the user or system component that created the record. |
| `updated_dt` | System timestamp of last record modification. |
| `updated_by` | Identifier of the user or system component that last modified the record. |
| `version` | System-assigned value for record versioning used in optimistic locking. Default is '1'. |
| `trans_id` | Primary Key. Auto-incremented system generated identifier for this specific transaction/audit record. |
| `trans_uuid` | Unique system generated identifier for this specific transaction/audit record. |
| `audit_action` | The specific action that triggered this transaction record (e.g., Insert, Update, Delete). |
| `audit_timestamp` | System timestamp of when this specific audit/transaction record was captured. |
| `is_history` | Indicator marking if this record represents a finalised historical state ('Y') or if it is currently holding a pending workflow change awaiting Checker approval ('N'). Default is 'Y'. |

### possible_values (14 columns)
| Column | Example |
|---|---|
| `is_deleted` / `is_migrated` / `is_history` | 'Y', 'N' |
| `version` | e.g. '1', '2' |
| `id` | e.g. '150000000000001' (Native), '120000000001' (Migrated) |
| `uuid` | e.g. 'b4e8619b-b012-4484-be12-660991876f5d' |
| `iss_issuance_uuid` | e.g. '2915ad89-9993-41c0-9433-b222e74d24ad' |
| `trans_id` | e.g. '150000000000001' |
| `trans_uuid` | e.g. '85e1217f-ch8c-480f-9401-58062340629c' |
| `audit_action` | e.g. 'I', 'U', 'D' |
| `audit_timestamp` | e.g. '2026-03-15 10:15:30.000' |
| `created_by` / `updated_by` | e.g. 'SYSTEM', '74e68145-7428-50c7-a8e7-g91250898g4e' |
| `created_dt` | e.g. '2026-02-03 16:39:54.798' |

## Batches completed (47 tables, 10 batches)

Format: `table — explanations / total cols, possible_values / total cols, complete?`

### Batch 1 (highest-impact issuance tables)
- `iss.iss_announcement_details` — 39/43 expl, 37/43 pv
- `iss.iss_announcement_details_t` — 44/48 expl, 14/48 pv
- `iss.iss_bid_retail` — 36/42 expl, 35/42 pv
- `iss.iss_bid_retail_t` — 41/47 expl, 14/47 pv
- `iss.iss_issuance` — 36/67 expl, 36/67 pv

### Batch 2
- `iss.iss_issuance_t` — 40/72 expl, 13/72 pv
- `iss.iss_calendar_data` — 31/32 expl, 31/32 pv
- `iss.iss_calendar_data_t` — 36/37 expl, 13/37 pv
- `iss.iss_bid_institutional` — 28/37 expl, 27/37 pv
- `iss.iss_bid_institutional_t` — 33/42 expl, 14/42 pv

### Batch 3
- `iss.iss_calendar_listing` — 21/21 expl, 21/21 pv ✓ complete
- `iss.iss_calendar_listing_t` — 26/26 expl, 13/26 pv ✓ complete
- `cm.cm_master_code` — 20/21 expl, 19/21 pv
- `cm.cm_master_code_t` — 25/26 expl, 13/26 pv
- `iss.iss_auction_run` — 20/44 expl, 21/44 pv

### Batch 4
- `iss.iss_auction_run_t` — 25/49 expl, 14/49 pv
- `stg.stg_meps_in_secint` — 45/45 expl, 11/45 pv ✓ complete
- `stg.stg_meps_in_secmast` — 44/44 expl, 11/44 pv ✓ complete
- `cm.cm_sectype_params` — 41/56 expl, 41/56 pv
- `cm.cm_sectype_params_t` — 14/61 expl, 13/61 pv (source had no col explanations; only convention applied)

### Batch 5
- `iss.iss_auction_safeguard` — 16/21 expl, 14/21 pv
- `iss.iss_auction_safeguard_t` — 21/26 expl, 13/26 pv
- `cm.cm_counterparty` — 16/26 expl, 16/26 pv
- `cm.cm_counterparty_t` — 20/29 expl, 13/29 pv
- `cm.cm_bank_master` — 14/22 expl, 14/22 pv

### Batch 6
- `cm.cm_bank_master_t` — 19/26 expl, 13/26 pv
- `cm.cm_documents` — 13/15 expl, 13/15 pv
- `cm.cm_documents_t` — 18/20 expl, 13/20 pv
- `cm.cm_master_code_category` — 12/12 expl, 12/12 pv ✓ complete
- `cm.cm_master_code_category_t` — 17/17 expl, 13/17 pv ✓ complete

### Batch 7
- `iss.iss_sb_allotment_run` — 12/20 expl, 13/20 pv
- `iss.iss_sb_allotment_run_t` — 17/25 expl, 14/25 pv
- `iss.iss_sb_subscription` — 29/36 expl, 29/36 pv
- `cm.cm_file_registry` — 12/18 expl, 12/18 pv
- `cm.cm_batch_job_t` — 14/24 expl, 13/24 pv (source had no col explanations; only convention applied)

### Batch 8 (description-only sources)
- `cm.cm_properties` — 9/14 expl, 8/14 pv
- `cm.cm_properties_t` — 14/19 expl, 13/19 pv
- `cm.cm_public_holiday` — 9/13 expl, 8/13 pv
- `cm.cm_public_holiday_t` — 14/18 expl, 13/18 pv
- `cm.cm_subtype_params` — 9/13 expl, 8/13 pv

### Batch 9 (description-only sources)
- `cm.cm_subtype_params_t` — 14/18 expl, 13/18 pv
- `cm.cm_system_params` — 9/11 expl, 8/11 pv
- `cm.cm_system_params_t` — 14/16 expl, 13/16 pv
- `cm.cm_tenor_params` — 9/17 expl, 8/17 pv
- `cm.cm_tenor_params_t` — 14/22 expl, 13/22 pv

### Batch 10 (description-only sources)
- `stg.stg_meps_out_auction` — 9/23 expl, 8/23 pv
- `stg.stg_meps_out_closingprice` — 9/17 expl, 8/17 pv

## Backups (in `%APPDATA%\dm-tool\db-backups\`)

- `workspace.db.bak-pre-backfill-20260429-170312` (before any write)
- `workspace.db.bak-pre-batch1-pv-20260429-171534` (before possible_values added to batch 1)
- `workspace.db.bak-pre-batch2-20260429-172335` (before batch 2)
- `workspace.db.bak-pre-batches-3to10-20260429-172509` (before batches 3–10)

To roll back: close the app, copy the chosen `.bak` over `workspace.db`, also restore the matching `-wal` file, then reopen.

## Phase B — DDL-only tables (next, not started)

85 tables to fill via NotebookLM. Schemas:
- `cm` (~15 tables): `cm_applicant`, `cm_corppass_role_map`, `cm_internal_role_group*`, `cm_status_map`, `cm_user_*`, `cm_report_metadata`, `cm_file_record_error`, `cm_counterparty_new`, etc.
- `iss` (~14 tables): `iss_announcement_stepup_rates`, `iss_bid_submission_*`, `iss_participating_dealers`, `iss_sb_applicant`, `iss_sb_holdings`, `iss_sb_redemption`, `iss_security_master`, `iss_issuance_stepup_rates`, etc.
- `stg` (~14 tables): `stg_agd_out_*` (6), `stg_eapps_*` (2), `stg_fmbs_out_*` (5)

Plan when resuming:
1. Use NotebookLM to define functional scope groups across the 85 tables (1 call).
2. Split into 5-table batches (~17 batches), grouped by scope.
3. Per batch, query NotebookLM to return `description`, `explanation`, AND `possible_values` for each table+column.
4. Write into SQLite via the same `.tmp-backfill.cjs` mechanism.

## Files used

- `.tmp-backfill.cjs` — the backfill script (Node + sqlite3 CLI)
- `.tmp-backfill-batches.json` — batch plan
- `.tmp-column-convention.json` — explanation convention dictionary (14 entries)
- `.tmp-possible-values-convention.json` — possible_values convention dictionary (14 entries)
- `.tmp-batch-{1..10}.sql` — per-batch SQL transactions actually applied
- `.tmp-final-state.json` — per-table fill state at end of Phase A
