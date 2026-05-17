# Source-Side Migration Scope Proposal (v0.02 R1)

> Working back from target-scope-classification.md (21 Migrate target tables) → which source tables must we read.
> Inventory totals (R1 wave only, 77 source tables): 11 eApps Y, 3 eApps TBD, 48 SBA TBD, 5 Syndication TBD, 32 eApps N, 8 System Batch Job N, 3 MLOG N (already excluded).
> **Proposal: migrate 22 source tables in v0.02. Skip 55 R1 tables (configure/audit/staging/sessions/derived).**

---

## A. Confirmed Migrate (22 tables)

### A1. Core eApps / SGS Auction (6 tables) — drives the spine

| # | Source | → Target(s) | Why |
|---|---|---|---|
| 1 | `ABA0001_SECURITY_MASTER` (MNETD & PRI1) | `iss.iss_security_master` (master), `iss.iss_issuance` (per-issuance), `iss.iss_announcement_details` | Single legacy entity; v0.01 already maps it via 3 modules. Most central source table. |
| 2 | `ABA0021_ISSUE_CALENDAR` (MNETD) | `iss.iss_calendar_listing`, `iss.iss_calendar_data` | v0.01 ISSCAL-001/003. Year-grouped calendar for non-SSB securities. |
| 3 | `ABA0010_ANNOUNCE_TEXT` (MNETD) | `iss.iss_announcement_details` (`announcement_footnotes` text) | Holds the long-form announcement text per security. v0.01 bug — wasn't joined; will fold in v0.02. |
| 4 | `ABA0006_AUCTION_RESULT` (MNETD & PRI1) | `iss.iss_auction_run` (header) | Auction-run summary (one row per auction). |
| 5 | `ABA0007_DETAIL_AUCTION_RESULT` (MNETD & PRI1) | `iss.iss_bid_retail` (TYPE='IND'), `iss.iss_bid_institutional` (TYPE!='IND') | v0.01 BIDCOL-001/003. Per-bid records. |
| 6 | `ABA0004_RETAIL_BID_TRANS` (MNETD) | `iss.iss_bid_retail` (2nd-pass update: file submission group, app type, received_dt) | v0.01 BIDCOL-002. Bridges file uploads to bid records. |

### A2. SSB / SBA core (12 tables)

| # | Source | → Target(s) | Why |
|---|---|---|---|
| 7 | `ABA0101_SB_SECURITY_MASTER` (MNETD) | `iss.iss_security_master`, `iss.iss_issuance` (SSB) | SSB equivalent of ABA0001. |
| 8 | `ABA0121_SB_ISSUE_CALENDAR` (MNETD) | `iss.iss_calendar_listing`, `iss.iss_calendar_data` (SSB) | v0.01 ISSCAL-002/004. SSB calendar. |
| 9 | `ABA0110_SB_ANNOUNCE_TEXT` (MNETD) | `iss.iss_announcement_details` (SSB footnotes) | Same role as ABA0010 for SSB. |
| 10 | `ABA0124_SB_COUPON_RATE_DETAILS` (MNETD) | `iss.iss_announcement_stepup_rates`, `iss.iss_issuance_stepup_rates` | Per-year SSB step-up coupon rates. |
| 11 | `ABA0223_SB_APPLICANT` (PRI1) | `iss.iss_sb_applicant` | SSB retail applicant identity (NRIC/passport/name/nationality). |
| 12 | `ABA0224_SB_SUBSCRIPT` + `ABA0225_SB_SUBSCRIPT_DT` (PRI1) | `iss.iss_sb_subscription` | SSB subscription apps (header + details). |
| 13 | `ABA0227_SB_REDEMPTION` + `ABA0228_SB_REDEMPTION_DT` (PRI1) | `iss.iss_sb_redemption` | SSB redemption requests. |
| 14 | `ABA0230_SB_HLD_INFO` + `ABA0231_SB_HLD_INFO_DT` (PRI1) | `iss.iss_sb_holdings` | Current SSB holdings per investor. |
| 15 | `ABA0232_SB_ALLOTMENT_RESULT` (PRI1) | `iss.iss_sb_allotment_run` | SSB Quantity Ceiling allotment run outcomes. |

(items 12–14 each merge a header + detail table — counted as one logical source per migration row.)

### A3. Syndication (3 tables)

| # | Source | → Target(s) | Why |
|---|---|---|---|
| 16 | `AQA0012_SYNDICATION_INS_RET_DT` (PRI1) | `iss.iss_synd_allotment_run` | Syndication instrument retention details. |
| 17 | `AQA0013_SYNDICATION_COUPON_DT` (PRI1) | `iss.iss_synd_allotment_run` (coupon block) | Syndication coupon details per issue. |
| 18 | `AQA0016_SYNDICATED_SEC_MAST_DT` (PRI1) | `iss.iss_synd_allotment_run` (syndicated sec details) | Syndicated security master details. |

### A4. Common reference (4 tables)

| # | Source | → Target(s) | Why |
|---|---|---|---|
| 19 | `ABA0013_PRIMARY_DEALER` (MNETD) | `cm.cm_counterparty` | PD master (4 cols: code/name/shortname/MASrepo_ind). |
| 20 | `ABA0222_SB_ORG` (MNETD & PRI1) | `cm.cm_counterparty` | SB org master / non-PD applicants. |
| 21 | `ABA0009_BANK_MASTER` (MNETD) | `cm.cm_bank_master` | Bank master snapshot. User decision 2026-05-05: one-time load (MEPS+ banks.txt feed refreshes post-go-live). |
| 22 | `ABA0019_PUBLIC_HOLIDAY` (MNETD) | `cm.cm_public_holiday` | Singapore holiday calendar (historical + future per user decision). |

---

## B. Proposed Skip (with reasoning)

### B1. eApps Y in inventory but conflicts with target classification (4 tables)

These are flagged `Y` in `inventory.json` but my target-side classification (post user decisions 2026-05-05) says the corresponding cm.* targets are **Configure**, not Migrate. **Recommendation: flip these to N.**

| # | Source | Inventory wave/flag | Why skip |
|---|---|---|---|
| — | `ABA0030_CORP_PASS_MAPPING` (MNETD) | R1, Y | `cm.cm_corppass_role_map` is OMEGA-native Configure (Q6 in classification). ABA0030's 8-col shape doesn't match the OMEGA Corppass↔Kaizen mapping. Likely seeded fresh. |
| — | `AQA0003_USER` (PRI1) | R1, Y | `cm.cm_user_tbl` is Configure (user decision 2026-05-05: users re-provisioned via IAM at go-live). |
| — | `AQA0004_LEVEL_ACTION` (PRI1) | R1, Y | Internal user-level / action mapping — OMEGA-native role config (cm_internal_role_group / cm_user_role_group_assign — both Configure). |
| — | `AQA0010_ACTION_REF` (PRI1) | R1, Y | Action reference / lookup — equivalent to cm.cm_master_code seeded fresh. |

### B2. eApps TBD — proposed Skip (3 tables)

| # | Source | Why skip |
|---|---|---|
| — | `ABA0008_STAGE_SECURITY_MASTER` | Transient staging variant of ABA0001. Migration reads ABA0001 directly. |
| — | `ABA0020_STAGING_BANK_MASTER` | Transient staging variant of ABA0009. Migration reads ABA0009 directly. |
| — | `ABA0022_NON_BENCHMARK` | Redundant: ABA0001 already has `BENCHMARK_IND` column (v0.01 SECMST-002 row 9 maps it directly). |

### B3. SBA TBD — proposed Skip (36 of 48)

Code lookups (8): `ABA0214_SB_CD_FILE_TYPE`, `ABA0215_SB_CD_FILE_STATUS`, `ABA0216_SB_CD_RECORD_STATUS`, `ABA0217_SB_CD_NATION`, `ABA0218_SB_CD_NATION_CTY`, `ABA0219_SB_CD_FILE_ERROR_DESC`, `ABA0220_SB_CD_RECORD_ERR_DESC`, `ABA0221_SB_CD_BATCHJOB_STATUS`, `ABA0240_SB_CD_SUBMISSION_TYPE`, `ABA0282_SB_CD_APPLICATION_TYPE` — **cm.cm_master_code is seeded fresh** (user decision); these legacy lookups don't migrate.

Audit / error / log (5): `ABA0226_SB_SUBSCRIPT_DT_ERR`, `ABA0229_SB_REDEMPTION_DT_ERR`, `ABA0236_SB_HLD_INFO_DT_ERR`, `ABA0250_SB_AUDIT_LOG`, `ABA0223_SB_PGP_CONFIG` — pure error / audit logs (per D6 Phase 1 grounding, audit translation is TBD with MAS but defaults to NO).

Reports / files (5): `ABA0212_SB_REPORT`, `ABA0213_SB_REPORT_FILE`, `ABA0241_SB_RESULT_FILE`, `ABA0283_SB_COUPON_RESULT_FILE`, `ABA0235_SB_SUBMISSION_SUMMARY` — generated artefacts; OMEGA regenerates from migrated business data.

Sessions / sync / temp (4): `ABA0285_SB_USER_SESSION`, `ABA0284_SB_PORTAL_SYNC`, `ABA0280_SB_TEMP_APP_SUB_DT`, `ABA0281_SB_TEMP_HOLDING` — runtime / temp data.

Batch / sysconfig (4): `ABA0233_SB_BATCH_JOB`, `ABA0234_SB_BATCH_JOB_EXECUTION`, `ABA0127_SB_SYSTEM_CONFIG`, `ABA0252_SB_SYSCONF_MAKE_CHECK` — `cm.cm_batch_job*`, `cm.cm_system_params` are Configure.

Maker-checker / users / refs / staging (10): `ABA0237_SB_USER`, `ABA0238_SB_LEVEL_ACTION`, `ABA0239_SB_ACTION_REF`, `ABA0251_SB_CONT_MAKE_CHECK`, `ABA0108_SB_STAGE_SEC_MASTER`, `ABA0125_SB_STAGE_COUPON_RATE`, `ABA0126_SB_REDEMPTION_RESULT` — staging / user / ref tables; either Configure or transient.

### B4. Syndication TBD — proposed Skip (2 of 5)

| # | Source | Why skip |
|---|---|---|
| — | `AQA0014_SYNDICATION_RPT_COUNT` | Report counter (numeric counter); not migrated business data. |
| — | `AQA0015_COPY_SYND_SEC_MAST_IND` | Indicator flag for sync state; transient. |

### B5. Already excluded (43 tables in inventory marked N)

- 32 eApps `N`: ABA0023_AUDIT_ACTION (per D6, deferred), ABA0024/ABA0034/ABA0035/ABA0036/ABA0011-0018/ERF/etc.
- 8 System Batch Job `N`: BATCH_JOB_EXECUTION + 5 sibling Spring Batch tables; OMEGA replaces with cm.cm_batch_job (Configure).
- 3 MLOG `N`: per Phase 1 D4 (deferred until use-case verified).

These stay N — already locked.

### B6. R2 wave (35 tables — Daily Price 12 + ERF 23)

Out of scope for v0.02 (this is the R2 release wave).

---

## C. Items needing your call (8 questions)

### C1. Source bugs to fix in v0.02

The v0.01 spec already imposed a known data flow on `ABA0010_ANNOUNCE_TEXT` and `ABA0110_SB_ANNOUNCE_TEXT` but NEVER joined them in any mapping sheet — they're flagged `Y` in inventory but no mapping row. **In v0.02, do we actually populate `iss.iss_announcement_details.announcement_footnotes` from ABA0010/ABA0110 (and how) — or leave footnotes NULL on migrated records (per FSD reservation)?** Currently in v0.02 draft: TBD.

### C2. ABA0030_CORP_PASS_MAPPING

Inventory says Y, target is Configure. Confirm we DON'T migrate this and that ABA0030 is a legacy operational reference (not a true source for cm.cm_corppass_role_map).

### C3. AQA0003_USER, AQA0004_LEVEL_ACTION, AQA0010_ACTION_REF

3 user/role-related tables flagged Y in inventory. Confirm SKIP per cm_user_tbl / cm_internal_role_group / cm_master_code being Configure.

### C4. SBA "core 12" vs full-48 SBA scope

User said "SBA in scope" — confirm the **12-table core** (A2 above) is right, and the other 36 SBA tables (B3) are correctly Skip.

### C5. Syndication core-3

Confirm `AQA0012/0013/0016` migrate to `iss.iss_synd_allotment_run` and `AQA0014/0015` skip.

### C6. ABA0022_NON_BENCHMARK redundancy

ABA0001 already has BENCHMARK_IND. Confirm ABA0022 is informational only (manually maintained list) and the BENCHMARK_IND value is the source-of-truth.

### C7. ABA0126_SB_REDEMPTION_RESULT

Sounds like it could be a redemption settlement / outcome record. Migrate (→ iss_sb_redemption) or skip (regenerate from migrated business data)? Currently proposed Skip.

### C8. ABA0235_SB_SUBMISSION_SUMMARY

Aggregated submission summary. Migrate or regenerate? Currently proposed Skip.

---

## D. Summary inventory diff if proposal approved

| Category | Inventory current | After v0.02 | Change |
|---|---|---|---|
| R1 source migrated (Y) | 11 | **22** | +11 (SBA core 12 + Syndication core 3 + drop 4 conflicting eApps Y) |
| R1 source TBD | 56 (3 eApps + 48 SBA + 5 Synd) | 0 | -56 (all resolved) |
| R1 source N (skip) | 43 | **77 - 22 = 55** | +12 (added SBA 36, eApps 3, Synd 2 → -27 because we keep 12+3 of those as Y, etc — net effect: row counts balance) |
| R2 source | 35 | 35 | unchanged |
