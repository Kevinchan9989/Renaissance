# Missing / Inferred Master Codes — Verification Tracker

This file tracks master code categories and values referenced in `omega-ddl-current.dict.json`, with verification status against OMEGA seed data per NotebookLM.

**Verification statuses:**
- ✅ **Confirmed in seed** — category exists in OMEGA `cm_master_code_category` per NotebookLM.
- 🟡 **FSD-documented values, prefix inferred** — FSD enumerates the values explicitly but is silent on whether stored as master code; prefix is inferred from convention.
- ⚠ **Inferred (FSD silent on values & storage)** — applied based on OMEGA convention only; both prefix and value list need runtime verification.
- ❌ **Confirmed NOT a master code per NB** — verified absent from seed; keep as plain literal storage.

---

## ✅ Master code categories confirmed in OMEGA seed (per NotebookLM enumeration)

This is the **comprehensive list of master code categories** documented in the OMEGA setup data. Authoritative reference for any new fields needing master-code style.

| Category prefix | Description | Used by (representative dict columns) |
|---|---|---|
| `ISSCALSTAT` | Issuance Calendar Status | `iss.iss_calendar_listing.status` (uses `ISSCALSTAT_DRAFT` etc — actual prefix may be `ISSCAL`; see footnote A) |
| `ISSANNSTAT` | Announcement Status | (uses `ISSANNSTAT_PENDING_APPROVAL` etc — actual prefix may be `ISSANN`; see footnote A) |
| `BIDCOLSTAT` | Bid Collation Status | not yet referenced |
| `ALLOTSTAT` | Allotment Status | `iss.iss_sb_allotment_run.status` |
| `CMSTAT` | Common Status | `cm.cm_master_code.status` |
| `SECTYPE` | Security Types | (config field) |
| `CALPERIOD` | Calendar Periods (Yearly/H1/H2/Q1-Q4) | not yet referenced — relevant to `iss.iss_calendar_listing.period` |
| `CALMETHOD` | Creation Methods | `iss.iss_calendar_listing.creation_method` |
| `ISSTYPE` | Issuance Types | not yet referenced |
| `SGSTYPE` | SGS Types | not yet referenced |
| `MOSALE` | Method of Sale | not yet referenced |
| `USERACT` | Workflow User Actions | `cm.cm_applicant.user_action`, `iss.iss_bid_submission_end_time.user_action`, etc. |
| `TENOR` | Tenor Units | ⚠ **NB lists this category, but user confirmed `tenor_unit` stores raw `'D'/'M'/'Y'` (varchar 1) — may be `TENOR.code_value` rather than `master_code_key`** |
| `ISSSTAT` | Issuance Status | not yet referenced |
| `ISSBIDSTAT` | Bid Status (workflow) | `iss.iss_bid_submission_group.status`, `iss.iss_bid_retail.status`, `iss.iss_bid_institutional.bid_status` |
| `SUBMTHD` | Bid Submission Method | not yet referenced |
| `BIDFSTAT` | Bid File Registry Status | not yet referenced |
| `APPSRC` | Application Source | `iss.iss_bid_submission_group.application_source` (currently uses raw 'PORTAL'/'FILE_UPLOAD' — should be `APPSRC_*`) |
| `APPLNTYPE` | Type of Applicant | (referenced in iss_bid_retail per NB but not in current dict cols filled) |
| `APPTYPE` | Application Type | (cash/SRS funding source) |
| `NTNLTY` | Nationality | ⚠ `iss.iss_sb_applicant.nationality` currently uses raw `'S'/'P'/'F'` — may be `NTNLTY_S/P/F` master codes |
| `CTY` | Country Codes | `cm.cm_public_holiday.country` (uses `CTY_SG`); `iss.iss_sb_applicant.nation_code` (uses raw `'SG'` — inconsistent) |
| `HLDTYPE` | SSB Holding Type | `iss.iss_sb_holdings.holding_type` |
| `RECERR` | Record Error Description | `iss.iss_bid_retail.bid_error_desc`, `iss.iss_bid_institutional.bid_error_desc` |
| `BIDEXTSTAT` | Bid Submission Window Extension Status | `iss.iss_bid_submission_end_time.status` |
| `CUSTCODE` | Custody Account Identifier | (referenced in iss_bid_retail per NB) |
| `CUSTBC` | Bank-or-Custodian Indicator | ⚠ NOT YET in seed. Master DB columns store `'CUSTBC_B'` / `'CUSTBC_C'`; interface files extract single-char `'B'` / `'C'`. Used by `iss.iss_bid_retail.cust_bank_bc`, `iss.iss_sb_subscription.cust_bank_bc`, `iss.iss_sb_redemption.cust_bank_bc`. Always 'CUSTBC_C' for retail/individual applicants. |
| `SYNDSTAT` | Syndication Status | ⚠ NOT YET in seed. Used by `iss.iss_issuance.syndication_status`. Governs the institutional placement phase post-public-offer publication. Values: `SYNDSTAT_PENDING_PLACEMENT`, `SYNDSTAT_PENDING_APPROVAL`, `SYNDSTAT_PENDING_VERIFICATION`, `SYNDSTAT_PENDING_PUBLICATION`, `SYNDSTAT_PUBLISHED`. |
| `FILESRC` | File Source Channel | ⚠ NOT YET in seed. Used by `cm.cm_file_registry.file_source`. Distinguishes manual UI uploads vs automated interface ingestion. Values: `FILESRC_MANUAL_UPLOAD`, `FILESRC_INTERFACE`. |
| `FREGSTAT` | File Registry Processing Status | ⚠ NOT YET in seed. Used by `cm.cm_file_registry.status`. Tracks ingestion processing lifecycle. Values: `FREGSTAT_PROCESSING`, `FREGSTAT_PARTIAL`, `FREGSTAT_SUCCESS`, `FREGSTAT_FAILED`. |
| `CPNFREQ` | Coupon Payment Frequency | ✅ **Added to seed** (per user 2026-05-07). Used by `cm.cm_sectype_params.coupon_payment_freq` and `iss.iss_security_master.coupon_pay_frequency`. Values: `CPNFREQ_MONTHLY` (1 month), `CPNFREQ_QUARTERLY` (3 months), `CPNFREQ_SEMIANNUAL` (6 months), `CPNFREQ_ANNUAL` (12 months). Interface staging tables continue to store single-char form. |
| `FILEERR` | File-Level Error Code | ✅ **Added to seed** (per user 2026-05-07, prefix renamed from FERR → FILEERR). Used by `cm.cm_file_registry.file_error_code`. Captures only errors that don't tie to any specific line — i.e. whole-file failures before line-level parsing. Values: `FILEERR_DECRYPT_FAILED` (decryption failed), `FILEERR_INVALID_FORMAT` (invalid file format). (FSD Appendix B.1 / Table 30 lists 12 codes — items 3-12 trace to specific Header/Detail/Control Record lines, so they belong in RECERR per OMEGA's strict file-vs-line scope distinction.) |
| `EXTSTAT` | External Display Status | not yet referenced |
| `FILETYPE` | Bid File Types | `cm.cm_file_registry.file_type` (currently uses raw `'CAL'`/`'AP1'` — should be `FILETYPE_CAL` etc; see footnote B) |
| `RECSTAT` | Bid Allotment Results Status | possibly `iss.iss_bid_retail.bid_status` (final allotment outcome), distinct from `ISSBIDSTAT` workflow status — needs verification |

**Footnote A:** NB's enumeration listed shorter abbreviations (e.g. `ISSCAL`, `ISSANN`) for some categories. Earlier examples in the dict use the longer `*STAT_` form (`ISSCALSTAT_DRAFT`, `ISSANNSTAT_PENDING_APPROVAL`). Likely the actual `master_code_category.code` is the long form, with NB abbreviating in the listing. **Action:** verify against runtime `cm_master_code_category` table.

**Footnote B:** `file_type` in `cm.cm_file_registry` was filled with raw values `'CAL'` / `'AP1'` per NB. If FILETYPE is master-code-backed, the actual stored value may be `'FILETYPE_CAL'` etc. (the master_code_key) — or the code_value (`'CAL'`). **Action:** verify against runtime data.

---

## ❌ Confirmed NOT master code per NotebookLM (kept as plain literal storage / specific format)

| Field | Storage | Reason |
|---|---|---|
| `cm.cm_public_holiday.status` | Currently `'PHSTAT_NEW'` etc (master code style applied per user request, Option A) | ⚠ NB confirms no `PHSTAT` category in seed. User chose Option A: keep master-code style with caveat. Verify against runtime DB. |
| `cm.cm_tenor_params.issue_frequency` | Currently `'ISSFREQ_*'` (master code style applied per user request) | ⚠ NB confirms no `ISSFREQ` category in seed. Keep with caveat per user. |
| `cm.cm_tenor_params.tenor_unit` (and similar in iss tables) | Raw `'D'/'M'/'W'/'Y'` (varchar 1) | User logically validated: master codes never store single-char abbreviations |
| `iss.iss_calendar_data.tenor_unit` | Raw `'D'/'M'/'W'/'Y'` | Same as above |
| `iss.iss_issuance.tenor_unit` | Raw `'D'/'M'/'W'/'Y'` | Same as above |

---

## Inconsistencies flagged for review

| Field | Issue | Tables |
|---|---|---|
| Country code storage | `'CTY_SG'` (master-code style) vs `'SG'` (raw ISO-2) used inconsistently | `cm.cm_public_holiday.country` vs `iss.iss_sb_applicant.nation_code` |
| `bid_status` semantics | `ISSBIDSTAT` (workflow) vs `RECSTAT` (final allotment outcome) — currently `bid_status` uses `ISSBIDSTAT` everywhere; may need split | `iss.iss_bid_retail`, `iss.iss_bid_institutional` |
| `auction_dt` / `allotment_dt` nullability | FSD silent on DB-level population behavior (only governs UI display rules) | `iss.iss_calendar_data` |

---

## Action items for runtime verification

1. Run `SELECT DISTINCT category_code FROM cm_master_code_category` against runtime DB to confirm all categories from the table above.
2. Spot-check a few sample rows in actual data for inconsistency cases (e.g. `nationality` = `'S'` or `'NTNLTY_S'`?, `file_type` = `'CAL'` or `'FILETYPE_CAL'`?).
3. Confirm `PHSTAT` and `ISSFREQ` either exist (maybe seed is incomplete in indexed FSD) or genuinely absent.
4. Confirm shorter prefixes from NB enumeration (`ISSCAL`, `ISSANN`) match the longer forms used in dict (`ISSCALSTAT`, `ISSANNSTAT`) or are distinct.

_Last updated: 2026-05-05 — added comprehensive master code category enumeration from NotebookLM bid_institutional/sectype_params query._
