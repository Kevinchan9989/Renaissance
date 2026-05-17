# v0.01 Mapping Sheets vs Current Target Schema — Drift Report

> For each v0.01 sheet, surface a column-level diff between v0.01's target rows and the current `omega-ddl-current.dict.json` schema. Phase 1 grounding D7 applied: the v0.01 sheet `MAS-OMEGA-SECMST-001` is rebadged from `sec.sec_security_master` → `iss.iss_security_master` before diffing. The FK column `sec_security_master_uuid` (referenced in SECMST-002 row 2) is likewise treated as `iss_security_master_uuid` under D7.
>
> Sources:
> - `gsib-migration/workspace/_notes/v001-excel-analysis.md` §3.2–§3.11 (every v0.01 mapping row)
> - `gsib-migration/workspace/omega-ddl-current.dict.json` (canonical current schema)
>
> **Standard "noise" columns** (uniformly handled, kept in current dict, almost never written by source rows): `id`, `uuid`, `version`, `is_deleted`, `is_migrated`, `created_dt`, `created_by`, `updated_dt`, `updated_by`, plus `user_action` where present. Convention:
> - `id` — autoincrement, not migrated.
> - `uuid` — `Generate UUID` per natural key.
> - `version` — `Map to constant value: 1`.
> - `is_deleted` — `Map to constant value: 'N'`.
> - `is_migrated` — `Map to constant value: 'Y'` (legacy migration flag).
> - `created_dt` / `updated_dt` — `Map to current timestamp` or `Map to NULL`.
> - `created_by` / `updated_by` — `Map to constant value: 'MIGRATION'` (or NULL).
> - `user_action`, `wf_process_id` — `Map to NULL` (operational fields, not migrated).
>
> A consistent finding across **all 10 sheets**: v0.01 omits `is_deleted`, `is_migrated`, `created_dt`, `created_by`, `updated_dt`, `updated_by` mapping rows entirely. v0.02 must add these uniformly. The Oracle datatype leak (`NUMBER(*)` instead of `NUMERIC(*)`) appears in v0.01 ISSANN-001 row 25 and BIDCOL-001 row 21 — flag as `Direct Mapping` with corrected target type.

## Headline counts

| Sheet | v0.01 rows mapped (To-mig=Y) | Current cols | Dropped from v0.01 | Added by current dict (need v0.02 row) | Type-changed |
|---|---:|---:|---:|---:|---:|
| SECMST-001 → iss_security_master | 10 | 19 | 0 | 9 (incl. 9 noise) — only `security_type` is a real new business col | 0 |
| SECMST-002 → iss_issuance | 50 | 67 | 1 (`bid_to_cover_ratio` → renamed) | 17 (incl. 9 noise + 6 new business + 2 renames) | 2 (`comp_cutoff_allotment_pct` precision; `bid_to_cover_ratio`→`subscription_pct` rename) |
| ISSCAL-001 → iss_calendar_listing | 6 | 21 | 0 | 15 (incl. 9 noise + 6 new business) | 0 |
| ISSCAL-002 → iss_calendar_listing | 6 | 21 | 0 | 15 (same as ISSCAL-001) | 0 |
| ISSCAL-003 → iss_calendar_data | 12 | 31 | 0 | 19 (incl. 7 noise + 12 new business) | 1 (`tenor_value` → renamed `tenor`) |
| ISSCAL-004 → iss_calendar_data | 13 | 31 | 1 (`public_offer_start_dt` → exists; OK) / `tenor_value` rename | 18 (same shape as ISSCAL-003) | 1 (`tenor_value` → `tenor`) |
| ISSANN-001 → iss_announcement_details | 31 | 42 | 4 (`security_code`, `isin_code`, `tenor_value`, `mas_intended_tender_amount`, `footnotes`) — see notes | 15 (incl. 9 noise + 6 new business / renames) | 2 (`coupon_rate` `NUMERIC(7,4)→VARCHAR(100)`, `tenor_value`→`tenor`) |
| BIDCOL-001 → iss_bid_retail | 21 | 41 | 11 (lookup-FK renames + dropped fields) | 31 (incl. 9 noise + several renamed/refactored FKs) | 2 (`bank_ref_no` `VARCHAR(16)→VARCHAR(8)`, `nric_passport` `VARCHAR(20)→VARCHAR(14)`, `nationality_code`→`nation_code`, `settlement_amount` `NUMERIC(13,0)→NUMERIC(17,2)`) |
| BIDCOL-002 → iss_bid_retail | 3 | 41 | 0 (subset only) | n/a — partial draft | 0 |
| BIDCOL-003 → iss_bid_institutional | 17 | 37 | 8 (FK renames + dropped fields) | 28 (incl. 9 noise + several FK renames) | 2 (`bank_ref_no` `VARCHAR(16)→VARCHAR(8)`, `settlement_bank_code` `VARCHAR(4)` OK, `settlement_amount` `NUMERIC(13,0)→NUMERIC(17,2)`) |

(Counts above include noise columns in "Added"; per-sheet sections below split them out.)

---

## SECMST-001 → iss.iss_security_master (post-D7)

v0.01 had 10 source rows targeting `sec.sec_security_master`. After D7 rebadge, target is `iss.iss_security_master`.

**Columns in BOTH (kept):**

| Column | v0.01 type | Current type | Notes |
|---|---|---|---|
| uuid | VARCHAR(36) | VARCHAR(36) | OK |
| security_code | VARCHAR(8) | VARCHAR(8) | OK |
| isin_code | VARCHAR(12) | VARCHAR(12) | OK |
| security_name | VARCHAR(50) | VARCHAR(30) | **Type drift**: v0.01 says VARCHAR(50), current is VARCHAR(30). v0.01 over-allocated; current is correct. |
| tax_status | VARCHAR(1) | VARCHAR(1) | OK |
| etender_ind | VARCHAR(1) | VARCHAR(1) | OK |
| currency | VARCHAR(3) | VARCHAR(3) | OK |
| sgs_type | VARCHAR(20) | VARCHAR(50) | **Type drift**: v0.01 says VARCHAR(20), current is VARCHAR(50). |
| first_coupon_payment_dt | TIMESTAMP | TIMESTAMP | OK |
| coupon_pay_frequency | VARCHAR(20) | VARCHAR(50) | **Type drift**: v0.01 says VARCHAR(20), current is VARCHAR(50). |

**v0.01 references but DROPPED in current dict:** (none)

**Current dict has but NOT mapped in v0.01 (ADD in v0.02):**
- `security_type` (VARCHAR(50)) — **NEW BUSINESS FIELD**: required on the issuer-level master too. Use the same prefix-derivation logic as SECMST-002 row 4 (BA → SECTYPE_CMTB, B → SECTYPE_TBILL, N → SECTYPE_SGS, M1 → SECTYPE_MAS_FRN, M → SECTYPE_MASBILL).

**Standard noise columns in current dict (must be added uniformly):**
- `id` (BIGINT) — autoincrement
- `version` (NUMERIC(5,0)) — `Map to constant value: 1`
- `is_deleted` (VARCHAR(1)) — `Map to constant value: 'N'`
- `is_migrated` (VARCHAR(1)) — `Map to constant value: 'Y'`
- `created_dt` (TIMESTAMP), `created_by` (VARCHAR(36))
- `updated_dt` (TIMESTAMP), `updated_by` (VARCHAR(36))

(SECMST-001 has no `user_action` / `wf_process_id` in current dict.)

---

## SECMST-002 → iss.iss_issuance

v0.01 has 50 rows (1 generate-uuid, 1 FK lookup, 47 column maps, 1 NULL placeholder).

**Columns in BOTH (kept):**

| Column | v0.01 type | Current type | Notes |
|---|---|---|---|
| uuid | VARCHAR(36) | VARCHAR(36) | OK (Generate UUID) |
| issue_no | NUMERIC(2,0) | NUMERIC(2,0) | OK |
| issuance_type | VARCHAR(50) | VARCHAR(50) | OK |
| auction_status | VARCHAR(50) | VARCHAR(50) | OK (`Map to NULL`) |
| new_reopen_flag | VARCHAR(1) | VARCHAR(1) | OK |
| is_benchmark | VARCHAR(1) | VARCHAR(1) | OK |
| issue_dt | TIMESTAMP | TIMESTAMP | OK |
| auction_dt | TIMESTAMP | TIMESTAMP | OK |
| maturity_dt | TIMESTAMP | TIMESTAMP | OK |
| announcement_dt | TIMESTAMP | TIMESTAMP | OK |
| bid_submission_end_dt | TIMESTAMP | TIMESTAMP | OK |
| last_coupon_payment_dt | TIMESTAMP | TIMESTAMP | OK |
| next_coupon_payment_dt | TIMESTAMP | TIMESTAMP | OK |
| ex_int_dt | TIMESTAMP | TIMESTAMP | OK |
| pricing_dt | TIMESTAMP | TIMESTAMP | OK (TBD row) |
| public_offer_start_dt | TIMESTAMP | TIMESTAMP | OK (TBD row) |
| public_offer_end_dt | TIMESTAMP | TIMESTAMP | OK (TBD row) |
| app_closing_dt | TIMESTAMP | TIMESTAMP | OK |
| settlement_dt | TIMESTAMP | TIMESTAMP | OK |
| int_date1 / int_date2 | TIMESTAMP | TIMESTAMP | OK |
| total_amount_offered | NUMERIC(20,2) | NUMERIC(13,0) | **Type drift**: v0.01 NUMERIC(20,2), current NUMERIC(13,0). |
| denomination | NUMERIC(10,0) | NUMERIC(10,0) | OK |
| total_amount_applied | NUMERIC(20,2) | NUMERIC(13,0) | **Type drift** |
| total_amount_allotted | NUMERIC(20,2) | NUMERIC(13,0) | **Type drift** |
| total_amount_applied_comp | NUMERIC(20,2) | NUMERIC(13,0) | **Type drift** |
| total_amount_applied_noncomp | NUMERIC(20,2) | NUMERIC(13,0) | **Type drift** |
| mas_intended_tender_amount | NUMERIC(20,2) | NUMERIC(13,0) | **Type drift** |
| mas_amount_allotted | NUMERIC(20,2) | NUMERIC(13,0) | **Type drift** |
| noncomp_amount_allotted | NUMERIC(20,2) | NUMERIC(13,0) | **Type drift** |
| coupon_rate | NUMERIC(7,4) | NUMERIC(7,4) | OK |
| cutoff_yield | NUMERIC(5,2) | NUMERIC(5,2) | OK |
| average_yield | NUMERIC(5,2) | NUMERIC(5,2) | OK |
| median_yield | NUMERIC(5,2) | NUMERIC(5,2) | OK |
| cutoff_price | NUMERIC(7,4) | NUMERIC(7,4) | OK |
| average_price | NUMERIC(7,4) | NUMERIC(7,4) | OK |
| median_price | NUMERIC(7,4) | NUMERIC(7,4) | OK |
| closing_price | NUMERIC(9,4) | NUMERIC(9,4) | OK |
| accrued_interest_value | NUMERIC(7,4) | NUMERIC(7,4) | OK |
| accrued_interest_days | NUMERIC(3,0) | NUMERIC(3,0) | OK |
| comp_cutoff_allotment_pct | NUMERIC(5,2) | NUMERIC(4,2) | **Type drift**: v0.01 (5,2), current (4,2). Tighter precision in current. |
| noncomp_allotment_pct | NUMERIC(5,2) | NUMERIC(5,2) | OK |
| tenor_value | NUMERIC(3,0) | NUMERIC(3,0) | OK |
| tenor_unit | VARCHAR(1) | VARCHAR(1) | OK |
| int_paid_ind | VARCHAR(1) | VARCHAR(1) | OK |
| meps_tenor | NUMERIC(3,0) | NUMERIC(3,0) | OK |

**v0.01 references but DROPPED in current dict:**
- `bid_to_cover_ratio` (was `NUMERIC(6,2)` in v0.01) — **RENAMED to `subscription_pct` (NUMERIC(5,2))** in current dict. Mapping logic stays: `ABA0001_PERCENT_SUB → subscription_pct`.
- `status` (v0.01 row 6: `VARCHAR(50)`, derived from TENDER_DATE) — current dict has no `status` column on `iss_issuance`. The functional concept lives on `iss_announcement_details.status` and elsewhere. **Drop the row** in v0.02 (or move to ISSANN-001).
- `sec_security_master_uuid` (v0.01 row 2 FK) — under D7, current column is `iss_security_master_uuid`. **Rename** the FK in v0.02 row 2; lookup logic unchanged (post-D7 rebadge).

**Current dict has but NOT mapped in v0.01 (ADD in v0.02):**
- `subscription_pct` (NUMERIC(5,2)) — accept this is the rename of `bid_to_cover_ratio` (see above).
- `iss_security_master_uuid` (VARCHAR(36)) — rename target of `sec_security_master_uuid` (D7).
- `syndication_status` (VARCHAR(50)) — **NEW BUSINESS FIELD**. Likely `Map to NULL` for legacy auctions, populated only for syndications.
- `random_seed` (VARCHAR(100)) — **NEW**. `Map to NULL` (auction-run artefact, not in legacy).
- `remarks` (VARCHAR(4000)) — **NEW**. `Map to NULL`.
- `cutoff_amount` (NUMERIC(13,0)) — **NEW**. `Map to NULL` (derived at run-time).
- `random_alloted_amount` (NUMERIC(13,0)) — **NEW**. `Map to NULL`.
- `random_alloted_pct` (NUMERIC(4,2)) — **NEW**. `Map to NULL`.
- `total_amount_rejected` (NUMERIC(13,0)) — **NEW**. `Map to NULL`.
- `total_amount_within_limit` (NUMERIC(13,0)) — **NEW**. `Map to NULL`.
- `wf_process_id` (VARCHAR(255)) — `Map to NULL` (workflow artefact).

**Standard noise columns in current dict:** `id`, `version`, `is_deleted`, `is_migrated`, `created_dt`, `created_by`, `updated_dt`, `updated_by`, `user_action`. Apply uniform handling.

---

## ISSCAL-001 → iss.iss_calendar_listing

v0.01 has 17 rows but only 6 with To-mig=Y (rows 1–6); rows 7–17 are source-side dropped (`Migrated to iss.iss_calendar_data` / `Not applicable`).

**Columns in BOTH (kept):**

| Column | v0.01 type | Current type | Notes |
|---|---|---|---|
| year | NUMERIC(4,0) | NUMERIC(4,0) | OK |
| security_type | VARCHAR(50) | VARCHAR(50) | OK |
| publication_dt | TIMESTAMP | TIMESTAMP | OK (`Map to NULL`) |
| period | VARCHAR(50) | VARCHAR(50) | OK (`Map to constant value: 'CALPERIOD_YEARLY'`) |
| status | VARCHAR(50) | VARCHAR(50) | OK (`Map to constant value: 'ISSCALSTAT_PUBLISHED'`) |
| version | NUMERIC(5,0) | NUMERIC(5,0) | OK (`Map to constant value: 1`) — note v0.01 lists this as a real row; in v0.02 treat as standard noise |

**v0.01 references but DROPPED in current dict:** (none)

**Current dict has but NOT mapped in v0.01 (ADD in v0.02):**
- `uuid` (VARCHAR(36)) — `Generate UUID` per (year + security_type) — v0.01 forgot the parent UUID row.
- `is_published_immediately` (VARCHAR(1)) — `Map to NULL` or `'N'`.
- `calendar_footnotes` (TEXT) — `Map to NULL`.
- `remarks` (VARCHAR(4000)) — `Map to NULL`.
- `creation_method` (VARCHAR(50)) — `Map to constant value: 'MIGRATION'` or NULL — needs business decision (open question).
- `cm_documents_uuid` (VARCHAR(36)) — `Map to NULL`.
- `wf_process_id` (VARCHAR(255)) — `Map to NULL`.
- `user_action` (VARCHAR(50)) — `Map to NULL`.

**Standard noise columns:** `id`, `is_deleted`, `is_migrated`, `created_dt`, `created_by`, `updated_dt`, `updated_by` (and `version` per noise convention; v0.01 row 6 already covers this).

---

## ISSCAL-002 → iss.iss_calendar_listing (SB)

Same target as ISSCAL-001. v0.01 maps the same 6 columns from `ABA0121_SB_ISSUE_CALENDAR`. Diff is identical.

**Columns in BOTH (kept):** `year`, `security_type`, `publication_dt`, `period`, `status`, `version` — all OK (same shape as ISSCAL-001).

**v0.01 references but DROPPED in current dict:** (none).

**Current dict has but NOT mapped in v0.01 (ADD in v0.02):** Same list as ISSCAL-001 — `uuid`, `is_published_immediately`, `calendar_footnotes`, `remarks`, `creation_method`, `cm_documents_uuid`, `wf_process_id`, `user_action`.

**Standard noise columns:** Same list as ISSCAL-001.

---

## ISSCAL-003 → iss.iss_calendar_data

v0.01 has 16 source rows; 12 are To-mig=Y mappings.

**Columns in BOTH (kept):**

| Column | v0.01 type | Current type | Notes |
|---|---|---|---|
| iss_calendar_listing_uuid | VARCHAR(36) | VARCHAR(36) | OK (FK lookup) |
| security_code | VARCHAR(8) | VARCHAR(8) | OK |
| isin_code | VARCHAR(12) | VARCHAR(12) | OK |
| security_type | VARCHAR(50) | VARCHAR(50) | OK |
| sgs_type | VARCHAR(50) | VARCHAR(50) | OK |
| issuance_type | VARCHAR(50) | VARCHAR(50) | OK |
| tenor_unit | VARCHAR(1) | VARCHAR(1) | OK |
| new_reopen_flag | VARCHAR(1) | VARCHAR(1) | OK |
| announcement_dt | TIMESTAMP | TIMESTAMP | OK |
| auction_dt | TIMESTAMP | TIMESTAMP | OK |
| issue_dt | TIMESTAMP | TIMESTAMP | OK |

**v0.01 references but DROPPED in current dict:**
- `tenor_value` (was NUMERIC(3,0)) — **RENAMED to `tenor` (NUMERIC(3,0))** in current dict. Mapping logic unchanged.

**Current dict has but NOT mapped in v0.01 (ADD in v0.02):**
- `tenor` (NUMERIC(3,0)) — rename target of `tenor_value`.
- `uuid` (VARCHAR(36)) — `Generate UUID` (v0.01 omitted the PK generator row).
- `maturity_dt` (TIMESTAMP) — **NEW**. Map from `ABA0021_MATURITY_DATE` (or NULL if not in source).
- `public_offer_start_dt` (TIMESTAMP) — **NEW**. `Map to NULL` for non-syndication.
- `public_offer_end_dt` (TIMESTAMP) — **NEW**. `Map to NULL` for non-syndication.
- `bond_announcement_dt` (TIMESTAMP) — **NEW**. `Map to NULL`.
- `size_announcement_dt` (TIMESTAMP) — **NEW**. `Map to NULL`.
- `app_closing_dt` (TIMESTAMP) — **NEW**. `Map to NULL` (or derive from auction_dt).
- `pricing_dt` (TIMESTAMP) — **NEW**. `Map to NULL`.
- `cdp_naming_convention` (VARCHAR(16)) — **NEW**. `Map to NULL`.
- `is_provisioned_isin` (VARCHAR(1)) — **NEW**. `Map to constant value: 'N'`.
- `is_benchmark` (VARCHAR(1)) — **NEW**. Map from `ABA0001_BENCHMARK_IND` if joinable, else `Map to NULL`.

**Standard noise columns:** `id`, `version`, `is_deleted`, `is_migrated`, `created_dt`, `created_by`, `updated_dt`, `updated_by`. (No `user_action` on this table.)

---

## ISSCAL-004 → iss.iss_calendar_data (SB)

Same target as ISSCAL-003; v0.01 has 17 rows, 13 with To-mig=Y.

**Columns in BOTH (kept):**

| Column | v0.01 type | Current type | Notes |
|---|---|---|---|
| iss_calendar_listing_uuid | VARCHAR(36) | VARCHAR(36) | OK |
| security_code | VARCHAR(8) | VARCHAR(8) | OK |
| isin_code | VARCHAR(12) | VARCHAR(12) | OK |
| security_type | VARCHAR(50) | VARCHAR(50) | OK (`Map to constant value: 'SECTYPE_SSB'`) |
| sgs_type | VARCHAR(50) | VARCHAR(50) | OK (`Map to NULL`) |
| issuance_type | VARCHAR(50) | VARCHAR(50) | OK (`Map to constant value: 'ISSTYPE_AUCTION'`) |
| tenor_unit | VARCHAR(1) | VARCHAR(1) | OK |
| new_reopen_flag | VARCHAR(1) | VARCHAR(1) | OK |
| announcement_dt | TIMESTAMP | TIMESTAMP | OK |
| public_offer_start_dt | TIMESTAMP | TIMESTAMP | OK (`Map to NULL`) |
| app_closing_dt | TIMESTAMP | TIMESTAMP | OK |
| auction_dt | TIMESTAMP | TIMESTAMP | OK |
| issue_dt | TIMESTAMP | TIMESTAMP | OK |

**v0.01 references but DROPPED in current dict:**
- `tenor_value` (was NUMERIC(3,0)) — **RENAMED to `tenor`** (same as ISSCAL-003).

**Current dict has but NOT mapped in v0.01 (ADD in v0.02):**
- `tenor` (NUMERIC(3,0)) — rename target of `tenor_value`.
- `uuid` (VARCHAR(36)) — `Generate UUID` (v0.01 omitted).
- `maturity_dt` (TIMESTAMP) — **NEW**. Map from SB master if available; else NULL.
- `public_offer_end_dt` (TIMESTAMP) — **NEW**. `Map to NULL`.
- `bond_announcement_dt`, `size_announcement_dt`, `pricing_dt` (TIMESTAMP) — **NEW**. `Map to NULL`.
- `cdp_naming_convention` (VARCHAR(16)) — **NEW**. `Map to NULL`.
- `is_provisioned_isin` (VARCHAR(1)) — **NEW**. `Map to constant value: 'N'`.
- `is_benchmark` (VARCHAR(1)) — **NEW**. `Map to NULL` (SB has no benchmark concept).

**Standard noise columns:** Same list as ISSCAL-003.

---

## ISSANN-001 → iss.iss_announcement_details

v0.01 has 31 rows, all To-mig=Y.

**Columns in BOTH (kept):**

| Column | v0.01 type | Current type | Notes |
|---|---|---|---|
| iss_calendar_data_uuid | VARCHAR(36) | VARCHAR(36) | OK (FK lookup) |
| iss_issuance_uuid | VARCHAR(36) | VARCHAR(36) | OK |
| security_type | VARCHAR(50) | VARCHAR(50) | OK |
| issuance_type | VARCHAR(50) | VARCHAR(50) | OK |
| sgs_type | VARCHAR(50) | VARCHAR(50) | OK |
| new_reopen_flag | VARCHAR(1) | VARCHAR(1) | OK |
| is_benchmark | VARCHAR(1) | VARCHAR(1) | OK |
| tenor_unit | VARCHAR(1) | VARCHAR(1) | OK |
| announcement_dt | TIMESTAMP | TIMESTAMP | OK |
| publication_dt | TIMESTAMP | TIMESTAMP | OK |
| auction_dt | TIMESTAMP | TIMESTAMP | OK |
| issue_dt | TIMESTAMP | TIMESTAMP | OK |
| maturity_dt | TIMESTAMP | TIMESTAMP | OK |
| first_coupon_payment_dt | TIMESTAMP | TIMESTAMP | OK |
| next_coupon_payment_dt | TIMESTAMP | TIMESTAMP | OK |
| pricing_dt | TIMESTAMP | TIMESTAMP | OK (TBD) |
| public_offer_start_dt | TIMESTAMP | TIMESTAMP | OK (TBD) |
| public_offer_end_dt | TIMESTAMP | TIMESTAMP | OK (TBD) |
| app_closing_dt | TIMESTAMP | TIMESTAMP | OK (TBD) |
| total_amount_offered | NUMERIC(13,0) | NUMERIC(13,0) | OK |
| accrued_interest_days | NUMERIC(3,0) | NUMERIC(3,0) | OK |
| remarks | VARCHAR(4000) | VARCHAR(4000) | OK (`Map to NULL`) |
| user_action | VARCHAR(50) | VARCHAR(50) | OK (`Map to NULL`) — v0.01 unusually maps user_action explicitly. |
| status | VARCHAR(50) | VARCHAR(50) | OK |
| is_published_immediately | VARCHAR(1) | VARCHAR(1) | OK (`Map to NULL`) |

**v0.01 references but DROPPED in current dict:**
- `security_code` (v0.01 row 3: VARCHAR(8)) — current dict still has `security_code`. Wait — re-check: yes, `security_code` is in current dict for `iss_announcement_details`. **NOT dropped.** Move to "Kept".
- `isin_code` (v0.01 row 4: VARCHAR(12)) — also still present. **NOT dropped.**
- `tenor_value` (v0.01 row 10: NUMERIC(3,0)) — **RENAMED to `tenor`** in current dict.
- `mas_intended_tender_amount` (v0.01 row 24: NUMERIC(13,0)) — **RENAMED to `mas_intended_tender_amt`** (NUMERIC(13,0)) in current dict.
- `footnotes` (v0.01 row 27: VARCHAR(10000)) — **RENAMED to `announcement_footnotes` (TEXT)** in current dict.
- `coupon_rate` (v0.01 row 25: written as `NUMBER(7,4)` — Oracle leak) — current dict has `coupon_rate VARCHAR(100)`. **TYPE CHANGED**: current uses VARCHAR(100), not NUMERIC. Likely the schema now stores formatted rate strings (e.g. "1.234%"). Mapping must convert: `Direct Mapping with cast to VARCHAR`.

(Correction to drift table above: `security_code`, `isin_code` are kept — see updated headline counts mental note: real DROPS = `tenor_value`, `mas_intended_tender_amount`, `footnotes` = 3 renames, plus `coupon_rate` type change.)

**Current dict has but NOT mapped in v0.01 (ADD in v0.02):**
- `uuid` (VARCHAR(36)) — `Generate UUID` (v0.01 omitted PK generator row).
- `tenor` (NUMERIC(3,0)) — rename target of `tenor_value`.
- `mas_intended_tender_amt` (NUMERIC(13,0)) — rename target of `mas_intended_tender_amount`.
- `announcement_footnotes` (TEXT) — rename target of `footnotes`.
- `int_date1` (TIMESTAMP) — **NEW**. Map from `ABA0001_INT_DATE1` (consistent with SECMST-002 row 23).
- `int_date2` (TIMESTAMP) — **NEW**. Map from `ABA0001_INT_DATE2`.
- `wf_process_id` (VARCHAR(255)) — `Map to NULL`.

**Standard noise columns:** `id`, `version`, `is_deleted`, `is_migrated`, `created_dt`, `created_by`, `updated_dt`, `updated_by`. Apply uniform handling.

---

## BIDCOL-001 → iss.iss_bid_retail

v0.01 has 21 rows, 19 with To-mig=Y (rows 4 and 20 are NULL/anomaly).

**Columns in BOTH (kept):**

| Column | v0.01 type | Current type | Notes |
|---|---|---|---|
| iss_issuance_uuid | VARCHAR(36) | VARCHAR(36) | OK |
| applicant_name | VARCHAR(100) | VARCHAR(100) | OK |
| cdp_account_no | VARCHAR(16) | VARCHAR(16) | OK |
| cpf_srs_account_no | VARCHAR(16) | VARCHAR(16) | OK |
| type_of_applicant | VARCHAR(50) | VARCHAR(50) | OK |
| nominal_amount | NUMERIC(13,0) | NUMERIC(13,0) | OK |
| is_competitive | VARCHAR(1) | VARCHAR(1) | OK |
| bid_yield | NUMERIC(5,2) | — | **DROPPED — see below** |
| application_source | VARCHAR(50) | — | **DROPPED — see below** |
| submission_method | VARCHAR(50) | VARCHAR(50) | OK |
| custody_code | VARCHAR(50) | VARCHAR(50) | OK |
| status | VARCHAR(50) | VARCHAR(50) | OK |
| allotted_amount | NUMERIC(13,0) | NUMERIC(13,0) | OK |
| accepted_amount | NUMERIC(13,0) | NUMERIC(13,0) | OK |

**v0.01 references but DROPPED in current dict:**
- `cm_bank_master_uuid` (v0.01 row 2 FK) — **RENAMED to `cm_counterparty_uuid`** (VARCHAR(36)) in current dict. Lookup target table also renamed (`cm.cm_bank_master` → `cm.cm_counterparty` — confirm separately).
- `iss_bid_file_registry_uuid` (v0.01 row 3 FK, VARCHAR(36)) — **RENAMED to `cm_file_registry_uuid`** (VARCHAR(36)).
- `iss_allotment_run_uuid` (v0.01 row 4 FK, VARCHAR(36)) — **RENAMED to `iss_auction_run_uuid`** (VARCHAR(36)).
- `bank_ref_no` — column kept but **TYPE CHANGED**: v0.01 VARCHAR(16), current VARCHAR(8). v0.01's source (ABA0007_BANK_REF_NO) is VARCHAR2(12) — current dict's VARCHAR(8) is **a real shrink**. Risk: source values >8 chars will overflow. Open question: confirm length policy.
- `nric_passport` — column kept but **TYPE CHANGED**: v0.01 VARCHAR(20), current VARCHAR(14). Source is VARCHAR2(14) so VARCHAR(14) is fine.
- `nationality_code` (v0.01 row 8) — **RENAMED**. Current dict has both `nationality VARCHAR(50)` and `nation_code VARCHAR(50)`. The OMEGA-mastercode value (`NATIONLTY_SG_CITIZEN` etc.) maps to one of them — likely `nationality` or `nation_code`. Open question; suggest `nationality` for the mastercode.
- `bid_yield` (NUMERIC(5,2)) — **RENAMED to `yield_pct`** (NUMERIC(5,2)).
- `application_source` (VARCHAR(50)) — current dict has **no `application_source`** field on `iss_bid_retail`. The closest is `application_type` (VARCHAR(50)). Either drop the row or remap to `application_type` (open question).
- `settlement_amount` — column kept but **TYPE CHANGED**: v0.01 NUMERIC(13,0) (also written `NUMBER(15,2)` in source — Oracle leak), current NUMERIC(17,2). v0.02 should use NUMERIC(17,2).

**Current dict has but NOT mapped in v0.01 (ADD in v0.02):**
- `uuid` (VARCHAR(36)) — `Generate UUID`.
- `cm_counterparty_uuid` — rename target.
- `iss_bid_submission_group_uuid` (VARCHAR(36)) — **NEW**. Replaces v0.01's `submission_ref_uuid` (which was on BIDCOL-002 row 1). Map via the same SUBSTR(BANK_REF_NO,1,4) + RECEIVED_DATE + FILE_TYPE recipe; resolve to UUID after staging insert.
- `cm_file_registry_uuid` — rename target.
- `iss_auction_run_uuid` — rename target.
- `role_group` (VARCHAR(50)) — **NEW**. Likely `Map to constant value: 'ROLEGRP_RETAIL'` or NULL. Open question.
- `user_action` (VARCHAR(50)) — `Map to NULL`.
- `nationality` (VARCHAR(50)) — receives the mastercode (rename target of `nationality_code`).
- `nation_code` (VARCHAR(50)) — **NEW**. Map ABA0007_NATIONALITY raw value, or NULL.
- `application_type` (VARCHAR(50)) — already mapped in BIDCOL-002 row 2 (`AP1/AP2/AP3` mastercode). Move that row into BIDCOL-001 in v0.02.
- `cust_bank_code` (VARCHAR(4)) — **NEW** for retail. Map from `ABA0007_CUST_BANK_CODE` (consistent with BIDCOL-003).
- `cust_bank_bc` (VARCHAR(50)) — **NEW**. Map raw `ABA0007_CUST_BANK_BC` (current spec keeps both raw and mastercode).
- `currency` (VARCHAR(3)) — **NEW**. `Map to constant value: 'SGD'`.
- `yield_pct` (NUMERIC(5,2)) — rename target of `bid_yield`.
- `received_dt` (TIMESTAMP) — already in BIDCOL-002 row 3. Move into BIDCOL-001 in v0.02.
- `bid_status` (VARCHAR(50)) — **NEW**. `Map to NULL`.
- `bid_error_desc` (VARCHAR(50)) — **NEW**. `Map to NULL`.
- `remarks` (VARCHAR(4000)) — **NEW**. `Map to NULL`.
- `wf_process_id` (VARCHAR(255)) — `Map to NULL`.

**Standard noise columns:** `id`, `version`, `is_deleted`, `is_migrated`, `created_dt`, `created_by`, `updated_dt`, `updated_by`.

---

## BIDCOL-002 → iss.iss_bid_retail

Partial draft — only 3 rows: `submission_ref_uuid`, `application_type`, `received_dt`. All target columns exist in current dict (with `iss_bid_submission_group_uuid` as the rename of `submission_ref_uuid`). **In v0.02, fold these 3 rows into BIDCOL-001.** Diff is otherwise the same as BIDCOL-001 (same target table).

**Columns in BOTH:** `application_type` (VARCHAR(50)), `received_dt` (TIMESTAMP).
**Renamed:** `submission_ref_uuid` → `iss_bid_submission_group_uuid`.
**Dropped/Added:** see BIDCOL-001 list (BIDCOL-002 doesn't add anything new beyond BIDCOL-001's diff).

---

## BIDCOL-003 → iss.iss_bid_institutional

v0.01 has 17 rows, 14 with To-mig=Y (rows 3, 4, 15 are NULL placeholders).

**Columns in BOTH (kept):**

| Column | v0.01 type | Current type | Notes |
|---|---|---|---|
| iss_issuance_uuid | VARCHAR(36) | VARCHAR(36) | OK |
| applicant_name | VARCHAR(100) | VARCHAR(100) | OK |
| type_of_applicant | VARCHAR(50) | VARCHAR(50) | OK |
| submission_method | VARCHAR(50) | VARCHAR(50) | OK |
| custody_code | VARCHAR(50) | VARCHAR(50) | OK |
| settlement_bank_code | VARCHAR(4) | VARCHAR(4) | OK |
| nominal_amount | NUMERIC(13,0) | NUMERIC(13,0) | OK |
| allotted_amount | NUMERIC(13,0) | NUMERIC(13,0) | OK |
| is_competitive | VARCHAR(1) | VARCHAR(1) | OK |
| yield_pct | NUMERIC(5,2) | NUMERIC(5,2) | OK |
| application_source | VARCHAR(50) | — | **DROPPED — see below** |

**v0.01 references but DROPPED in current dict:**
- `cm_bank_master_uuid` (v0.01 row 2 FK) — **RENAMED to `cm_counterparty_uuid`**.
- `iss_bid_file_registry_uuid` (v0.01 row 3) — **RENAMED to `cm_file_registry_uuid`**.
- `iss_allotment_run_uuid` (v0.01 row 4) — **RENAMED to `iss_auction_run_uuid`**.
- `submission_ref_uuid` (v0.01 row 5) — **RENAMED to `iss_bid_submission_group_uuid`**.
- `bank_ref_no` — kept but **TYPE CHANGED**: v0.01 VARCHAR(16), current VARCHAR(8). Same risk as BIDCOL-001.
- `application_source` (VARCHAR(50), value `'APPSRC_MANUAL ENTRY'`) — current dict has **no `application_source`** column on `iss_bid_institutional`. Map onto `application_type` instead, or drop. Open question (same as BIDCOL-001).
- `settlement_amount` — kept but **TYPE CHANGED**: v0.01 NUMERIC(13,0), current NUMERIC(17,2). Use NUMERIC(17,2) in v0.02.

**Current dict has but NOT mapped in v0.01 (ADD in v0.02):**
- `uuid` (VARCHAR(36)) — `Generate UUID`.
- `cm_counterparty_uuid`, `iss_bid_submission_group_uuid`, `cm_file_registry_uuid`, `iss_auction_run_uuid` — rename targets.
- `role_group` (VARCHAR(50)) — **NEW**. Likely `Map to constant value: 'ROLEGRP_INSTITUTIONAL'` or NULL.
- `user_action` (VARCHAR(50)) — `Map to NULL`.
- `application_type` (VARCHAR(50)) — **NEW** for institutional. `Map to NULL` (no AP1/2/3 concept on institutional side) or derive.
- `currency` (VARCHAR(3)) — **NEW**. `Map to constant value: 'SGD'`.
- `price` (NUMERIC(7,4)) — **NEW**. `Map to NULL` (institutional usually bid by yield, not price).
- `accepted_amount` (NUMERIC(13,0)) — **NEW**. `Map to NULL` (auction-run derived).
- `received_dt` (TIMESTAMP) — **NEW**. Map from `ABA0007_TENDER_DATE` or NULL.
- `bid_status` (VARCHAR(50)), `bid_error_desc` (VARCHAR(50)) — **NEW**. `Map to NULL`.
- `remarks` (VARCHAR(4000)) — **NEW**. `Map to NULL`.
- `wf_process_id` (VARCHAR(255)) — `Map to NULL`.
- `status` (VARCHAR(50)) — **NEW**. `Map to constant value: 'BIDCOLSTAT_CLOSED'` (parallel to BIDCOL-001 row 18).

**Standard noise columns:** `id`, `version`, `is_deleted`, `is_migrated`, `created_dt`, `created_by`, `updated_dt`, `updated_by`.

---

## Headline reconciliation findings

1. **No sheet escapes rework.** Every sheet is missing the standard noise columns (`is_deleted`, `is_migrated`, `created_dt/by`, `updated_dt/by`). This is the single biggest, uniform v0.02 patch — it adds 6–9 rows per sheet.

2. **Heaviest rework: BIDCOL-001 / BIDCOL-003.** The bid-collation tables have been refactored: 4 FK columns renamed (`cm_bank_master_uuid` → `cm_counterparty_uuid`, `iss_bid_file_registry_uuid` → `cm_file_registry_uuid`, `iss_allotment_run_uuid` → `iss_auction_run_uuid`, `submission_ref_uuid` → `iss_bid_submission_group_uuid`). `bid_yield` → `yield_pct`. `application_source` removed. Type tightening on `bank_ref_no` (VARCHAR(16)→VARCHAR(8)) is a **migration risk** — confirm.

3. **ISSANN-001 has multiple renames + a type flip:** `tenor_value` → `tenor`, `mas_intended_tender_amount` → `mas_intended_tender_amt`, `footnotes` → `announcement_footnotes`, and `coupon_rate` is now VARCHAR(100) (was NUMERIC). The coupon_rate change is the only **semantic** change — implies the column now stores formatted strings.

4. **ISSCAL-003/004 missing six new TIMESTAMP columns** (`maturity_dt`, `public_offer_*_dt`, `bond_announcement_dt`, `size_announcement_dt`, `pricing_dt`, `app_closing_dt`) plus `cdp_naming_convention`, `is_provisioned_isin`, `is_benchmark`. Likely all `Map to NULL` for legacy.

5. **SECMST-002 has 7 new operational/stats columns** (`syndication_status`, `random_seed`, `cutoff_amount`, `random_alloted_amount`, `random_alloted_pct`, `total_amount_rejected`, `total_amount_within_limit`, `wf_process_id`, `remarks`) — all `Map to NULL` for legacy. Plus `bid_to_cover_ratio` → `subscription_pct` rename. Plus FK rename via D7: `sec_security_master_uuid` → `iss_security_master_uuid`.

6. **SECMST-001 is light**: only one real new field (`security_type`). Plus the standard noise columns.

7. **Type-drift pattern**: v0.01 over-allocates monetary widths (NUMERIC(20,2)) while current dict consistently uses NUMERIC(13,0) for issuance-level amounts and NUMERIC(17,2) for bid-level settlement amounts. v0.02 must use the current dict's tighter widths.

8. **Oracle datatype leak**: v0.01 ISSANN-001 row 25 (`NUMBER(7,4)`) and BIDCOL-001 row 21 (`NUMBER(15,2)`) use Oracle's `NUMBER` syntax in the **target** column. v0.02 must rewrite these as `NUMERIC(*)` consistently — and for ISSANN-001 the type itself flips to VARCHAR(100).

9. **Constant-value typo**: BIDCOL-001 row 15 / BIDCOL-003 row 15 use `'APPSRC_MANUAL ENTRY'` (literal space). The mastercode convention is underscore — `'APPSRC_MANUAL_ENTRY'`. Also: `application_source` is **not in the current dict** for either bid-collation table. Flag as open question.

10. **D7 confirmed needed in two places**: (a) SECMST-001 sheet target table, (b) SECMST-002 row 2 FK column name `sec_security_master_uuid` → `iss_security_master_uuid`. Both align cleanly with current dict after rebadge.

## v0.02 action list

1. **D7 rebadge** — apply to SECMST-001 banner/target and SECMST-002 row 2 FK column. Leave the lookup logic (`sec.sec_security_master.uuid`) intact in remarks but update target column name.
2. **Add uniform "noise columns" block at the end of every sheet** — rows for `version`, `is_deleted`, `is_migrated`, `created_dt`, `created_by`, `updated_dt`, `updated_by` (and `user_action` / `wf_process_id` where present in target). Use standard constants.
3. **SECMST-001**: add `security_type` row (replicate SECMST-002 row 4 logic). Tighten `security_name` to VARCHAR(30); widen `sgs_type` and `coupon_pay_frequency` to VARCHAR(50).
4. **SECMST-002**:
   - Rename `bid_to_cover_ratio` → `subscription_pct` (NUMERIC(5,2)).
   - Drop `status` row (no such column).
   - Tighten all `NUMERIC(20,2)` to `NUMERIC(13,0)`.
   - Tighten `comp_cutoff_allotment_pct` to `NUMERIC(4,2)`.
   - Add `Map to NULL` rows for: `syndication_status`, `random_seed`, `remarks`, `cutoff_amount`, `random_alloted_amount`, `random_alloted_pct`, `total_amount_rejected`, `total_amount_within_limit`, `wf_process_id`.
5. **ISSCAL-001 / ISSCAL-002**: add rows for `uuid` (Generate UUID), `is_published_immediately`, `calendar_footnotes`, `remarks`, `creation_method` (open question on default value), `cm_documents_uuid`, `wf_process_id`, `user_action` (all `Map to NULL` except `creation_method`).
6. **ISSCAL-003 / ISSCAL-004**:
   - Rename `tenor_value` → `tenor`.
   - Add `Map to NULL` rows for `maturity_dt`, `public_offer_start_dt`, `public_offer_end_dt`, `bond_announcement_dt`, `size_announcement_dt`, `pricing_dt`, `app_closing_dt`, `cdp_naming_convention`, `is_benchmark` (where missing).
   - Add `is_provisioned_isin` = `Map to constant value: 'N'`.
   - Add `uuid` Generate UUID row to ISSCAL-003 (ISSCAL-004 already implicit).
7. **ISSANN-001**:
   - Rename `tenor_value` → `tenor`, `mas_intended_tender_amount` → `mas_intended_tender_amt`, `footnotes` → `announcement_footnotes`.
   - Change `coupon_rate` target type to VARCHAR(100), add cast in transformation.
   - Add `int_date1`, `int_date2`, `wf_process_id` rows.
   - Add `uuid` Generate UUID row.
   - Replace `NUMBER(7,4)` Oracle leak with proper `NUMERIC(*)` notation (then VARCHAR(100) per above).
8. **BIDCOL-001 / BIDCOL-003 (heavy refactor)**:
   - Rename FKs: `cm_bank_master_uuid`→`cm_counterparty_uuid`, `iss_bid_file_registry_uuid`→`cm_file_registry_uuid`, `iss_allotment_run_uuid`→`iss_auction_run_uuid`, `submission_ref_uuid`→`iss_bid_submission_group_uuid`. Update lookup target tables in transformation text.
   - BIDCOL-001 only: rename `bid_yield`→`yield_pct`; rename `nationality_code`→`nationality` (open question on `nation_code` raw).
   - Both: drop or remap `application_source` (open question).
   - Both: tighten `settlement_amount` to NUMERIC(17,2) and rewrite Oracle leak.
   - Both: confirm `bank_ref_no` shrink to VARCHAR(8) (open question — possible truncation).
   - Both: add `role_group`, `user_action`, `currency`, `bid_status`, `bid_error_desc`, `remarks`, `wf_process_id` rows.
   - BIDCOL-003 only: add `application_type`, `received_dt`, `price`, `accepted_amount`, `status` rows.
   - BIDCOL-001 only: add `cust_bank_code`, `cust_bank_bc` rows (currently only `custody_code` mastercode is mapped).
   - Add `uuid` Generate UUID row to both.
9. **Fold BIDCOL-002 (3 rows) into BIDCOL-001** as `iss_bid_submission_group_uuid`, `application_type`, `received_dt` rows. Retire BIDCOL-002 sheet (or keep as informational pointer).
10. **Fix banner/Module-ID typos** noted in v001-excel-analysis.md (BIDCOL-002, BIDCOL-003 banners; stray `c` in ISSCAL-004 row 15; trailing whitespace cleanup).
11. **`'APPSRC_MANUAL ENTRY'` → `'APPSRC_MANUAL_ENTRY'`** (underscore) in BIDCOL-003 — pending open question on whether `application_source` even survives.

## Open questions for the source team (carry into open-questions.md)

- A. `iss.iss_calendar_listing.creation_method` — default value for migrated records?
- B. `iss.iss_bid_retail.bank_ref_no` shrunk to VARCHAR(8) — confirm? Source is VARCHAR2(12), risk of truncation.
- C. `application_source` removed from both bid tables — was it merged into `application_type`, or genuinely dropped? `'APPSRC_INTERFACE'` / `'APPSRC_MANUAL_ENTRY'` semantics need a home.
- D. `iss.iss_bid_retail.nationality` vs `nation_code` — which receives the mastercode `NATIONLTY_*` and which receives the raw `S/P/F` value?
- E. `iss.iss_bid_*.role_group` — default constant for migrated records?
- F. `iss.iss_announcement_details.coupon_rate VARCHAR(100)` — confirm formatted-string semantic; how to format (e.g. `"%.4f"` or include `%` suffix)?
- G. `iss.iss_calendar_data.is_benchmark` for SB (ISSCAL-004) — always NULL, or derive from somewhere?
