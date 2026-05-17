# Source / Target Inventory — GSIB Migration Workspace

Snapshot of the dm-tool Script JSON files in `gsib-migration/workspace/` plus the OMEGA data dictionary. Inventory only — no src→tgt mapping yet.

Notes on file layout: every Script JSON in this workspace has `data.sources = []` and the parsed Table[] under `data.targets`, regardless of whether the script represents a legacy source DDL dump or an OMEGA target. Schema is identified by the `schema` field on each table object plus the script `name`.

---

## 1. Source schema map

| Script | Logical role | DDL `name` | DDL `type` | Schema(s) on tables | Tables |
|---|---|---|---|---|---|
| `gsib-migration/workspace/script-00-BE_MNETD.json` | Backend Oracle source (MNETD) | `BE_MNETD` | `oracle` | `MS9ABA` | 104 |
| `gsib-migration/workspace/script-04-FE_TRI1.json` | Frontend Oracle source (TRI1) | `FE_TRI1` | `oracle` | `MS9ABA` | 120 |

Findings:
- **Both BE_MNETD and FE_TRI1 use the same Oracle schema name `MS9ABA`** on every parsed table. There is no distinct `TRI1`/`PRI1` schema in the parsed `data.targets`.
- **No PRI1 anywhere.** Searched both Oracle scripts: zero tables with a PRI1 schema, and the strings TRI1/PRI1 do not appear as schema qualifiers in the DDL. The scripts are tagged TRI1 only via filename and the `name` field. The user's TRI/PRI1 ambiguity appears to be a naming-only concern, not a schema split.
- **FE_TRI1 contains a DB Link to MNET** (`script-04-FE_TRI1.json` rawContent line ~5): `CREATE DATABASE LINK "MNET" CONNECT TO "MS7ABA"` — note the `MS7ABA` (note `7`, not `9`) referenced through the link, suggesting MNETD may live on a separate DB instance reached via the `MNET` DB link from the FE side.
- **No top-level module summary comment** in either Oracle file. Module grouping has to be inferred from table-name prefixes (ABA0xxx / AQA0xxx / BATCH_*).

---

## 2. Source tables — BE_MNETD (104 tables, schema `MS9ABA`)

`gsib-migration/workspace/script-00-BE_MNETD.json` — all `data.targets[].description` are empty. CSV: `gsib-migration/workspace/_notes/_be_mnetd_tables.csv`.

Module grouping inferred from prefix conventions (ABA00xx = core SGS auction/issuance, ABA01xx = SSB, ABA02xx = SSB workflow/cd, ABA05xx = ERF/repo/auction summary, ABA06xx = ERF v6, AQA = secondary/auxiliary, etc.).

### ABA0001 — Security Master (9 tables, all variants of one logical entity)
| Table | Cols |
|---|---|
| ABA0001_SECURITY_MASTER | 42 |
| ABA0001_SECURITY_MASTER_20230428 | 48 |
| ABA0001_SECURITY_MASTER_20230512 | 48 |
| ABA0001_SECURITY_MASTER_20230515 | 48 |
| ABA0001_SECURITY_MASTER_20230516 | 48 |
| ABA0001_SECURITY_MASTER_20230529 | 48 |
| ABA0001_SECURITY_MASTER_20230601 | 42 |
| ABA0001_SECURITY_MASTER_R2_20231212 | 42 |
| ABA0001_SECURITY_MASTER_T | 48 |

### ABA0002–ABA0036 — Core SGS Auction & Issuance module
| Table | Cols |
|---|---|
| ABA0002_FRN_ISSUE | 3 |
| ABA0004_RETAIL_BID_TRANS | 9 |
| ABA0004_RETAIL_BID_TRANS_20230428 | 9 |
| ABA0004_RETAIL_BID_TRANS_BKP | 9 |
| ABA0005_RSA_TEXT_ENC_TRANS | 15 |
| ABA0005_RSA_TEXT_ENC_TRANS_20230428 | 15 |
| ABA0006_AUCTION_RESULT | 7 |
| ABA0006_AUCTION_RESULT_20230428 | 7 |
| ABA0007_DETAIL_AUCTION_RESULT | 24 |
| ABA0007_DETAIL_AUCTION_RESULT_20230428 | 24 |
| ABA0008_STAGE_SECURITY_MASTER | 41 |
| ABA0009_BANK_MASTER (+4 BKUP variants) | 5 |
| ABA0010_ANNOUNCE_TEXT | 4 |
| ABA0011_DAILY_PRICE | 11 |
| ABA0012_DP_STATUS | 5 |
| ABA0013_PRIMARY_DEALER | 4 |
| ABA0015_PRICE_SPREAD | 7 |
| ABA0016_DAILY_EXTRA_DATA | 7 |
| ABA0017_FINAL_DAILY_PRICE | 23 |
| ABA0018_FINAL_EXTRA_PRICE | 6 |
| ABA0019_PUBLIC_HOLIDAY | 4 |
| ABA0020_STAGING_BANK_MASTER | 5 |
| ABA0021_ISSUE_CALENDAR | 13 |
| ABA0022_NON_BENCHMARK (+ 20230428 variant) | 3 |
| ABA0023_AUDIT_ACTION | 4 |
| ABA0024_USER_SESSION | 3 |
| ABA0025_OUTSTANDING_SGS | 6 |
| ABA0026_OUTSTANDING_MAS | 8 |
| ABA0027_BATCH_JOB | 5 |
| ABA0028_BATCH_JOB_EXECUTION | 9 |
| ABA0029_SORA_RATE (+3 bkp/dated variants) | 14 |
| ABA0030_CORP_PASS_MAPPING | 8 |
| ABA0031_OUTSTANDING_FRN (+1 BKP) | 11 |
| ABA0032_EAPPS_CONFIG | 2 |
| ABA0033_ISSUANCE_REDEMPT_SGS (+1 BKP) | 6 |
| ABA0034_EAPPS_SUBMISSION_CUTOFF_TIME | 6 |
| ABA0034_STG_SC_SECURITY_MASTER | 48 |
| ABA0035_RETAILBID_FILE | 8 |
| ABA0035_RETAILBID_FILE_TMP | 8 |
| ABA0036_STAGE_SORA_AMMO | 12 |
| ABA0036_STAGE_SORA_AMMO_T | 12 |

Two distinct ABA0034_* tables collide on the prefix — `EAPPS_SUBMISSION_CUTOFF_TIME` vs `STG_SC_SECURITY_MASTER`. Likely a number-reuse anomaly (the latter looks like a staging variant of ABA0001).

### ABA0101–ABA0223 — SSB (Singapore Savings Bond) module on the BE side
| Table | Cols |
|---|---|
| ABA0101_SB_SECURITY_MASTER | 30 |
| ABA0101_SB_SECURITY_MASTER_T | 36 |
| ABA0108_SB_STAGE_SEC_MASTER | 30 |
| ABA0110_SB_ANNOUNCE_TEXT | 4 |
| ABA0121_SB_ISSUE_CALENDAR | 12 |
| ABA0124_SB_COUPON_RATE_DETAILS | 6 |
| ABA0125_SB_STAGE_COUPON_RATE | 4 |
| ABA0126_SB_REDEMPTION_RESULT | 4 |
| ABA0127_SB_SYSTEM_CONFIG | 4 |
| ABA0134_STG_SB_SC_SEC_MASTER | 36 |
| ABA0214_SB_CD_FILE_TYPE | 5 |
| ABA0222_SB_ORG | 11 |
| ABA0223_SB_PGP_CONFIG | 2 |

### ABA0501–ABA0507 — ERF v5 (encrypted repo / Eligible Repo Facility)
| Table | Cols |
|---|---|
| ABA0501_ENCRYPTED_REPO_TRANS | 7 |
| ABA0502_PUB_KEY | 3 |
| ABA0503_OPEN_ISSUES | 7 |
| ABA0504_AUCTION_SUMMARY | 15 |
| ABA0505_AUCTION_DETAILS | 21 |
| ABA0506_SYSTEM_PARM | 3 |
| ABA0507_SPLIT_BIDS | 4 |

### ABA0601–ABA0610 — ERF v6 (newer ERF generation; partial overlap with ABA05xx)
| Table | Cols |
|---|---|
| ABA0601_ENCRYPTED_REPO_TRANS | 10 |
| ABA0603_OPEN_ISSUES | 4 |
| ABA0605_TRADE_DETAILS | 28 |
| ABA0606_SYSTEM_PARM | 6 |
| ABA0607_SPLIT_BIDS | 4 |
| ABA0608_LEGAL_LOG | 2 |
| ABA0610_REJECTED_ISSUES | 4 |

### ABA2000 — Task registry
| Table | Cols |
|---|---|
| ABA2000_TASK_REGISTRY | 3 |

### AQA00xx — Auxiliary / cross-module (auction params, eApps transactions)
| Table | Cols |
|---|---|
| AQA0001_LIMIT | 5 |
| AQA0002_TRANSACTION (+ 20230428 variant) | 33 |
| AQA0005_REPORT_COUNTER | 3 |
| AQA0006_EAPPS_TRANSACTION (+ 20230428 variant) | 33 |
| AQA0008_SEC_AUCTION_PARA | 10 |
| AQA0020_AUCTION_RESULTS_REPORT | 37 |

### Untyped / utility / temp
| Table | Cols | Note |
|---|---|---|
| FINAL_DAILY_PRICE | 21 | likely materialized view backing |
| FX_FACTORS | 2 | fx-rate utility |
| TEMP | 2 | dev scratch |
| TEMP_SUBSCRIPTION_ENTRY | 28 | dev scratch / migration helper |
| TEMP1 | 2 | dev scratch |
| TEST_CLOB | 4 | dev scratch |
| USER_SESSION | 3 | session table; presumably superseded by ABA0024_USER_SESSION |

---

## 3. Source tables — FE_TRI1 (120 tables, schema `MS9ABA`)

`gsib-migration/workspace/script-04-FE_TRI1.json`. Like BE_MNETD, all `description` fields are empty. CSV: `gsib-migration/workspace/_notes/_fe_tri1_tables.csv`.

### ABA0001 — Security Master (4 variants on FE side)
| Table | Cols |
|---|---|
| ABA0001_SECURITY_MASTER | 42 |
| ABA0001_SECURITY_MASTER_20230515 | 48 |
| ABA0001_SECURITY_MASTER_20230516 | 48 |
| ABA0001_SECURITY_MASTER_R2_20231212 | 42 |

### ABA0006–ABA0036 — Core SGS surface on FE
| Table | Cols |
|---|---|
| ABA0006_AUCTION_RESULT | 7 |
| ABA0007_DETAIL_AUCTION_RESULT | 24 |
| ABA0008_AUCTION_AUDIT_LOG | 3 |
| ABA0009_EAUCTION_CONFIG (+ TMP) | 2 |
| ABA0010_EAUCTION_AUCTION_CUTOFF_TIME | 6 |
| ABA0035_SECURITY_MASTER_CTG_STG | 19 |
| ABA0036_RETAILBID_FILE | 5 |

ABA0008 and ABA0009 numbers are **reused** with different semantics on FE vs BE (BE: STAGE_SECURITY_MASTER / BANK_MASTER; FE: AUCTION_AUDIT_LOG / EAUCTION_CONFIG). Number-collision risk for any naive cross-side join.

### ABA0212–ABA0285 — SSB workflow + reference codes (SB Reports, SB Subscript, SB Redemption, SB HLD Info, SB Audit, etc.)
| Table | Cols |
|---|---|
| ABA0212_SB_REPORT | 3 |
| ABA0213_SB_REPORT_FILE | 8 |
| ABA0214_SB_CD_FILE_TYPE | 5 |
| ABA0215_SB_CD_FILE_STATUS | 2 |
| ABA0216_SB_CD_RECORD_STATUS | 2 |
| ABA0217_SB_CD_NATION | 2 |
| ABA0218_SB_CD_NATION_CTY | 2 |
| ABA0219_SB_CD_FILE_ERROR_DESC | 2 |
| ABA0220_SB_CD_RECORD_ERR_DESC | 2 |
| ABA0221_SB_CD_BATCHJOB_STATUS | 2 |
| ABA0222_SB_ORG | 11 |
| ABA0223_SB_APPLICANT | 7 |
| ABA0224_SB_SUBSCRIPT (+ BKUP) | 18 |
| ABA0225_SB_SUBSCRIPT_DT (+ BKUP) | 26 |
| ABA0226_SB_SUBSCRIPT_DT_ERR (+ BKUP) | 27 |
| ABA0227_SB_REDEMPTION (+ BKUP) | 13 |
| ABA0228_SB_REDEMPTION_DT (+ BKUP) | 27 |
| ABA0229_SB_REDEMPTION_DT_ERR (+ BKUP) | 29 |
| ABA0230_SB_HLD_INFO (+ BKUP) | 13 |
| ABA0231_SB_HLD_INFO_DT (+ BACKUP, + BKUP) | 10 |
| ABA0232_SB_ALLOTMENT_RESULT (+ BKUP) | 10 |
| ABA0233_SB_BATCH_JOB (+ BKUP, + ABA233_SB_BATCH_JOB_BKUP misspelled) | 5 |
| ABA0234_SB_BATCH_JOB_EXECUTION (+ BKUP) | 9 |
| ABA0235_SB_SUBMISSION_SUMMARY (+ BKUP) | 11 |
| ABA0236_SB_HLD_INFO_DT_ERR (+ BKUP) | 14 |
| ABA0237_SB_USER | 3 |
| ABA0238_SB_LEVEL_ACTION | 3 |
| ABA0239_SB_ACTION_REF | 3 |
| ABA0240_SB_CD_SUBMISSION_TYPE | 2 |
| ABA0241_SB_RESULT_FILE (+ BKUP) | 7 |
| ABA0250_SB_AUDIT_LOG (+ BKUP) | 5 |
| ABA0251_SB_CONT_MAKE_CHECK | 14 |
| ABA0252_SB_SYSCONF_MAKE_CHECK | 12 |
| ABA0282_SB_CD_APPLICATION_TYPE | 2 |
| ABA0283_SB_COUPON_RESULT_FILE | 12 |
| ABA0284_SB_PORTAL_SYNC (+ BK) | 3 |
| ABA0285_SB_USER_SESSION | 3 |

### AQA00xx — Auction processing & syndication (FE-specific extensions vs BE's AQA0xxx)
| Table | Cols |
|---|---|
| AQA0001_LIMIT | 5 |
| AQA0002_TRANSACTION (+ 3 dated/bkp variants) | 34 |
| AQA0003_USER | 4 |
| AQA0004_LEVEL_ACTION | 3 |
| AQA0005_REPORT_COUNTER | 3 |
| AQA0006_EAPPS_TRANSACTION | 37 |
| AQA0007_COPY_SEC_MASTER_IND | 3 |
| AQA0008_SEC_AUCTION_PARA | 10 |
| AQA0009_SEC_AUCTION_PARA_CTG_STG | 6 |
| AQA0010_ACTION_REF | 3 |
| AQA0011_USER_SESSION | 3 |
| AQA0012_SYNDICATION_INS_RET_DT | 15 |
| AQA0013_SYNDICATION_COUPON_DT | 14 |
| AQA0014_SYNDICATION_RPT_COUNT | 3 |
| AQA0015_COPY_SYND_SEC_MAST_IND | 3 |
| AQA0016_SYNDICATED_SEC_MAST_DT | 21 |
| AQA0017_AUCTION_IND (+ 20230817 variant) | 4 |
| AQA0018_RETAIL_BID_PROC_IND | 2 |
| AQA0018_RETAIL_BID_PROC_TMP | 2 |
| AQA0019_AUCTION_REPORT_IND | 3 |
| AQA0020_AUCTION_RESULTS_REPORT (+ 20231115 variant) | 37 |
| AQA0021_AUCTION_RESULTS_REPORT_CTG_STG | 9 |

### AQA01xx — ERF / Repo (FE side has ERF tables that BE doesn't)
| Table | Cols |
|---|---|
| AQA0101_REPO_TRANS | 23 |
| AQA0102_USER | 4 |
| AQA0103_PRIVATE_KEY | 3 |
| AQA0104_ERF_SYSTEM_PARM | 6 |
| AQA0104_SYSTEM_PARM | 4 |
| AQA0105_CYCLE | 3 |
| AQA0105_ERF_CYCLE | 3 |
| AQA0107_AUDIT_LOG | 4 |
| AQA0107_ERF_AUDIT_LOG | 4 |
| AQA0108_ERF_LOG_DETAIL | 2 |
| AQA0108_LOG_DETAIL | 2 |
| AQA0109_HAIRCUT_SETTINGS | 3 |
| AQA0111_CANCEL_TRADE | 7 |
| AQA0112_DUR_RATE | 5 |
| AQA0113_USER_SESSION | 3 |

Note the duplicate-prefix pairs (`AQA0104_ERF_SYSTEM_PARM` vs `AQA0104_SYSTEM_PARM`, etc.) — same numeric prefix pointing at two tables. Likely one is "base" and the other is the ERF flavor.

### Spring Batch metadata (BATCH_*)
Standard Spring Batch admin tables, all on FE only:
| Table | Cols |
|---|---|
| BATCH_JOB_EXECUTION | 11 |
| BATCH_JOB_EXECUTION_CONTEXT | 3 |
| BATCH_JOB_EXECUTION_PARAMS | 8 |
| BATCH_JOB_INSTANCE | 4 |
| BATCH_STEP_EXECUTION | 18 |
| BATCH_STEP_EXECUTION_CONTEXT | 3 |

### Untyped / utility / temp
| Table | Cols | Note |
|---|---|---|
| TEMP_AFTERDBEXPORT | 1 | dev scratch |
| TEMP1 | 2 | dev scratch |
| TEST_DB_DUMP | 1 | dev scratch |
| TESTSYNC | 4 | dev scratch |
| TMP_CALL_CENTRE | 3 | call-centre import scratch? |

### Tables that exist in BOTH BE_MNETD and FE_TRI1 (15)
These are candidates for "data flows both ways" or shared lookup tables. Note BE/FE versions may differ in column count.

| Table | BE cols | FE cols |
|---|---|---|
| ABA0001_SECURITY_MASTER | 42 | 42 |
| ABA0001_SECURITY_MASTER_20230515 | 48 | 48 |
| ABA0001_SECURITY_MASTER_20230516 | 48 | 48 |
| ABA0001_SECURITY_MASTER_R2_20231212 | 42 | 42 |
| ABA0006_AUCTION_RESULT | 7 | 7 |
| ABA0007_DETAIL_AUCTION_RESULT | 24 | 24 |
| ABA0214_SB_CD_FILE_TYPE | 5 | 5 |
| ABA0222_SB_ORG | 11 | 11 |
| AQA0001_LIMIT | 5 | 5 |
| AQA0002_TRANSACTION | 33 | 34 |
| AQA0005_REPORT_COUNTER | 3 | 3 |
| AQA0006_EAPPS_TRANSACTION | 33 | 37 |
| AQA0008_SEC_AUCTION_PARA | 10 | 10 |
| AQA0020_AUCTION_RESULTS_REPORT | 37 | 37 |
| TEMP1 | 2 | 2 |

`AQA0002_TRANSACTION` (33 vs 34) and `AQA0006_EAPPS_TRANSACTION` (33 vs 37) drift between sides — schema divergence between BE/FE that the migration design has to reconcile.

---

## 4. Target tables — OMEGA (PostgreSQL)

Target is split into per-schema scripts plus a combined OMEGA Full script. Counts and per-table descriptions below pull from `omega-ddl-current.dict.json` (the canonical data-dictionary). Tables that exist in `script-10-OMEGA_Full.json` but not in the dict are flagged.

CSV: `gsib-migration/workspace/_notes/_omega_dict.csv`.

### Script roll-up

| Script | Schema(s) | Tables |
|---|---|---|
| `script-01-iss.json` | iss | 37 |
| `script-02-sec.json` | sec | 4 |
| `script-03-cm.json` | cm | 18 |
| `script-07-stg.json` | stg | 10 |
| `script-10-OMEGA_Full.json` | cm + iss + sec + stg | 122 (cm 36, iss 57, sec 4, stg 25) |
| `script-12-OMEGA_Full_Temp.json` | cm + iss + sec + stg | 96 (cm 35, iss 34, sec 4, stg 23) — has SCHEMA TABLE SUMMARY header in raw |
| `script-14-BKP_OMEGA_FULL.json` | cm + iss + sec + stg | 99 (cm 27, iss 43, sec 4, stg 25) |
| `omega-ddl-current.dict.json` | cm + iss + stg (no sec) | 129 (cm 49, iss 43, stg 37) |

`script-10-OMEGA_Full.json` is the broadest target script (122 tables) but **the dict (129 keys) is broader still on cm/stg**, while script-10 is broader on iss (it carries multiple `*_bkp` variants the dict omits). They are not in sync — see anomalies (§5).

### cm.* — common reference data (49 tables in dict)

Per-table descriptions from `omega-ddl-current.dict.json`. Tables with `(Click to add)` placeholders flagged.

| Table | Description |
|---|---|
| cm.cm_applicant | Stores the master registry of non-Primary Dealer applicants and entities authorized to participate in bids. |
| cm.cm_applicant_mapping | Links each non-Primary Dealer applicant to its Primary Dealer counterparty for bid submission and allotment. |
| cm.cm_applicant_mapping_t | Audit/history of cm_applicant_mapping. |
| cm.cm_applicant_submission_group | Bulk applicant submission groups, linking each batch to its uploaded source document and tracking maker-checker status. |
| cm.cm_applicant_t | Audit/history of cm_applicant. |
| cm.cm_bank_master | Master list of participating banks/FIs from MEPS+ banks.txt. |
| cm.cm_bank_master_t | Audit/history of cm_bank_master. |
| cm.cm_batch_job | Master execution log for OMEGA batch jobs (params, timings, outcomes). |
| cm.cm_batch_job_detail | Per-record execution details of a batch job, linked to target records. |
| cm.cm_batch_job_detail_t | Audit/history of cm_batch_job_detail. |
| cm.cm_batch_job_t | **(Click to add)** — placeholder, no description supplied yet. |
| cm.cm_corppass_role_map | Maps external Corppass digital service roles to internal OMEGA (Kaizen) roles. |
| cm.cm_corppass_role_map_t | Audit/history of cm_corppass_role_map. |
| cm.cm_counterparty | Configured profile details and operational roles of system counterparties. |
| cm.cm_counterparty_t | Audit/history of cm_counterparty. |
| cm.cm_documents | S3 storage references and metadata for files processed by OMEGA. |
| cm.cm_documents_t | Audit/history of cm_documents. |
| cm.cm_file_record_error | Per-record validation errors detected during file processing, linked to file_registry. |
| cm.cm_file_record_error_t | Audit/history of cm_file_record_error. |
| cm.cm_file_registry | Tracking records for all batch files processed by OMEGA (interface feeds + bulk uploads). |
| cm.cm_file_registry_t | Audit/history of cm_file_registry. |
| cm.cm_internal_role_group | Master list of internal OMEGA role groups, defining role-based permissions. |
| cm.cm_internal_role_group_map | Maps internal role groups to Kaizen role codes. |
| cm.cm_internal_role_group_map_t | Audit/history of cm_internal_role_group_map. |
| cm.cm_internal_role_group_t | Audit/history of cm_internal_role_group. |
| cm.cm_master_code | Master code keys/values/definitions used throughout OMEGA. |
| cm.cm_master_code_category | Master code category headers for cm_master_code. |
| cm.cm_master_code_category_t | Audit/history of cm_master_code_category. |
| cm.cm_master_code_t | Audit/history of cm_master_code. |
| cm.cm_properties | Dynamic Spring Cloud Config-style key-value config store. |
| cm.cm_properties_t | Audit/history of cm_properties. |
| cm.cm_public_holiday | Master list of recognized public holidays per country. |
| cm.cm_public_holiday_t | Audit/history of cm_public_holiday. |
| cm.cm_report_metadata | Report metadata (template path, data source, output formats). |
| cm.cm_report_metadata_t | Audit/history of cm_report_metadata. |
| cm.cm_sectype_params | Core OMEGA security-level parameters (issuance calendar, announcement, auction/allotment). |
| cm.cm_sectype_params_t | Audit/history of cm_sectype_params. |
| cm.cm_status_map | Maps internal OMEGA status codes to external counterparty-specific status codes. |
| cm.cm_status_map_t | Audit/history of cm_status_map. |
| cm.cm_subtype_params | Sub-level configurations for security-type variations (BMD, Infrastructure, Green). |
| cm.cm_subtype_params_t | Audit/history of cm_subtype_params. |
| cm.cm_system_params | OMEGA's system-wide key-value configuration parameters (timings, offsets, buffers). |
| cm.cm_system_params_t | Audit/history of cm_system_params. |
| cm.cm_tenor_params | Tenor configurations per security type for issuance calendar generation and naming. |
| cm.cm_tenor_params_t | Audit/history of cm_tenor_params. |
| cm.cm_user_role_group_assign | Assigns each internal user to one or more role groups. |
| cm.cm_user_role_group_assign_t | Audit/history of cm_user_role_group_assign. |
| cm.cm_user_tbl | Master record of OMEGA users (internal MAS staff + counterparty users), linked to IAM. |
| cm.cm_user_tbl_t | Audit/history of cm_user_tbl. |

### iss.* — issuance lifecycle (43 tables in dict)

| Table | Description |
|---|---|
| iss.cm_applicant_submission_group_t | Audit/history of cm_applicant_submission_group (note: dict places this `_t` under iss schema). |
| iss.iss_announcement_details | Announcement details of upcoming issuances; source for MAS-website publication. |
| iss.iss_announcement_details_t | Audit/history of iss_announcement_details. |
| iss.iss_announcement_stepup_rates | Announced step-up coupon rates per year for SSB announcements. |
| iss.iss_announcement_stepup_rates_t | Audit/history of iss_announcement_stepup_rates. |
| iss.iss_auction_run | Execution params and outcomes for a non-SSB Uniform Price Auction run. |
| iss.iss_auction_run_t | Audit/history of iss_auction_run. |
| iss.iss_auction_safeguard | Configured safeguard configurations for Uniform Price Auctions. |
| iss.iss_auction_safeguard_t | Audit/history of iss_auction_safeguard. |
| iss.iss_bid_institutional | All institutional competitive and non-competitive bids submitted by PDs/institutions. |
| iss.iss_bid_institutional_t | Audit/history of iss_bid_institutional. |
| iss.iss_bid_retail | Retail applications submitted by individual investors for SGS Bonds and T-Bills. |
| iss.iss_bid_retail_t | Audit/history of iss_bid_retail. |
| iss.iss_bid_submission_end_mapping | Links a bid window extension request to the affected auction issuances. |
| iss.iss_bid_submission_end_mapping_t | Audit/history of iss_bid_submission_end_mapping. |
| iss.iss_bid_submission_end_time | Proposed new closing times, justifications and workflow statuses for bid extension requests. |
| iss.iss_bid_submission_end_time_t | Audit/history of iss_bid_submission_end_time. |
| iss.iss_bid_submission_group | Bid submission groups (batches) aggregating individual bids per issuance, with maker-checker. |
| iss.iss_bid_submission_group_t | Audit/history of iss_bid_submission_group. |
| iss.iss_calendar_data | Issuance calendar details for every individual issuance planned within a calendar period. |
| iss.iss_calendar_data_t | Audit/history of iss_calendar_data. |
| iss.iss_calendar_listing | Header information of an issuance calendar. |
| iss.iss_calendar_listing_t | Audit/history of iss_calendar_listing. |
| iss.iss_issuance | **Single source of truth for issuance-level details of a security.** |
| iss.iss_issuance_stepup_rates | Finalized step-up coupon rates and payment schedule per year for SSB issuances. |
| iss.iss_issuance_stepup_rates_t | Audit/history of iss_issuance_stepup_rates. |
| iss.iss_issuance_t | Audit/history of iss_issuance. |
| iss.iss_participating_dealers | Mapping of authorized PDs permitted to submit bids for a specific announcement. |
| iss.iss_participating_dealers_t | Audit/history of iss_participating_dealers. |
| iss.iss_sb_allotment_run | Execution params and outcomes for an SSB Quantity Ceiling allotment run. |
| iss.iss_sb_allotment_run_t | Audit/history of iss_sb_allotment_run. |
| iss.iss_sb_applicant | SSB retail applicant identity profiles (NRIC/passport, name, nationality). |
| iss.iss_sb_applicant_t | Audit/history of iss_sb_applicant. |
| iss.iss_sb_holdings | Current SSB holdings of retail investors (funding source, custody account, SGD face value). |
| iss.iss_sb_holdings_t | Audit/history of iss_sb_holdings. |
| iss.iss_sb_redemption | Individual SSB redemption requests submitted by retail applicants through banks. |
| iss.iss_sb_redemption_t | Audit/history of iss_sb_redemption. |
| iss.iss_sb_subscription | Retail applications submitted by individual investors specifically for SSB. |
| iss.iss_sb_subscription_t | Audit/history of iss_sb_subscription. |
| iss.iss_security_master | Master security definitions for issued securities (codes, ISIN, classification, coupon/tender). |
| iss.iss_security_master_t | Audit/history of iss_security_master. |
| iss.iss_synd_allotment_run | Syndication allotment run executions (applied/allotted across public + placement tranches). |
| iss.iss_synd_allotment_run_t | Audit/history of iss_synd_allotment_run. |

### sec.* — security master (4 tables in script-02-sec.json + script-10; **NOT in dict**)

`script-10-OMEGA_Full.json` carries inline descriptions for the two parents:

| Table | Cols | Description (from script-10) |
|---|---|---|
| sec.sec_security_master | 19 | Stores single source of truth for security-level details of a security. |
| sec.sec_security_master_t | 24 | Audit/history of sec_security_master. |
| sec.sec_coupon_schedule | 12 | (no description in script) |
| sec.sec_coupon_schedule_t | 17 | (no description in script) |

The `sec` schema is **the only target schema entirely missing from `omega-ddl-current.dict.json`** (0 of 4 tables present). Either the dict was generated before sec was added, or sec is governed elsewhere. Flagged below.

### stg.* — staging (37 tables in dict)

Each table is described as: "Staging table that stores the raw text data parsed from the [direction] [filename] [file] [from/to] [counterparty]." Key axes: direction (in/out), counterparty (AGD, eApps, FI, FMBS, MEPS+), security type (cash/CPF/SRS, SGS Bond/SSB).

| Table | Description |
|---|---|
| stg.stg_agd_out_it030048 | Outgoing CASH subscription file (IT030048) to AGD. |
| stg.stg_agd_out_it032048 | Outgoing CASH subscription override (IT032048) to AGD. |
| stg.stg_agd_out_it040048 | Outgoing CPF subscription (IT040048) to AGD. |
| stg.stg_agd_out_it042048 | Outgoing CPF subscription override (IT042048) to AGD. |
| stg.stg_agd_out_it050048 | Outgoing SRS subscription (IT050048) to AGD. |
| stg.stg_agd_out_it052048 | Outgoing SRS subscription override (IT052048) to AGD. |
| stg.stg_eapps_in_closingprice | Incoming Closing Price file from eApps. |
| stg.stg_eapps_out_secupdt | Outgoing Securities Update file to eApps. |
| stg.stg_fi_in_ea_ap | Incoming Auction Application file from FI. |
| stg.stg_fi_in_sb_ap | Incoming SSB Subscription Application file from FI. |
| stg.stg_fi_in_sb_hol | Incoming SSB Holdings file from FI. |
| stg.stg_fi_in_sb_re | Incoming SSB Redemption Application file from FI. |
| stg.stg_fi_out_cal | Outgoing Issuance Calendar file to FI. |
| stg.stg_fi_out_ea_aa | Outgoing Auction Allotment Application file to FI. |
| stg.stg_fi_out_ea_ra | Outgoing Auction Result Application file to FI. |
| stg.stg_fi_out_es_ra | Outgoing Eligible Securities Result Application file to FI. |
| stg.stg_fi_out_ins_ea_ra | Outgoing Institutional Auction Result Application file to FI. |
| stg.stg_fi_out_sb_aa | Outgoing SSB Allotment Application file to FI. |
| stg.stg_fi_out_sb_ah | Outgoing SSB Allotment History file to FI. |
| stg.stg_fi_out_sb_ar | Outgoing SSB Allotment Result file to FI. |
| stg.stg_fi_out_sb_cpn | Outgoing SSB Coupon file to FI. |
| stg.stg_fi_out_sb_ra | Outgoing SSB Redemption Application file to FI. |
| stg.stg_fi_out_sb_rr | Outgoing SSB Redemption Result file to FI. |
| stg.stg_fmbs_out_auction | Outgoing Auction file to FMBS. |
| stg.stg_fmbs_out_closingprice | Outgoing Closing Price file to FMBS. |
| stg.stg_fmbs_out_erf | Outgoing ERF file to FMBS. |
| stg.stg_fmbs_out_erf_agg_bids | Outgoing ERF Aggregated Bids file to FMBS. |
| stg.stg_fmbs_out_secupdt | Outgoing Securities Update file to FMBS. |
| stg.stg_meps_in_bank | Incoming Daily Bank List file from MEPS+. |
| stg.stg_meps_in_couponrates | Incoming Coupon Rates file from MEPS+. |
| stg.stg_meps_in_secint | Incoming MEPS+ Daily Securities Update File (secint.txt). |
| stg.stg_meps_in_secmast | Incoming MEPS+ New Issuance / Reopening of Securities File (secmast.txt). |
| stg.stg_meps_out_auction | **(Click to add)** — placeholder. |
| stg.stg_meps_out_auction_sbond | Outgoing SGS Bond Auction file to MEPS+. |
| stg.stg_meps_out_closingprice | **(Click to add)** — placeholder. |
| stg.stg_meps_out_rdmpartial_sbond | Outgoing SGS Bond Partial Redemption file to MEPS+. |
| stg.stg_meps_out_secupdt | Outgoing Securities Update file to MEPS+. |

### Working / temp / draft scripts (just noted, not part of canonical target)

| Script | Purpose (inferred) |
|---|---|
| `script-05-tmp_-_sec_params.json` | Working draft for `iss.iss_announcement_allotment_params`, `iss.iss_calendar_params`, `iss.iss_sec_params` (+ `_t` audit pairs). Older naming (`*_params` vs current `cm_sectype_params`). 6 tables, schema iss. |
| `script-06-tmp_-_secmast.json` | Working draft of `iss.iss_issuance` + `iss.iss_issuance_t` only (33 / 38 cols vs current 40 / 45). Pre-final iteration of the issuance master. |
| `script-08-tmp_-_Bids_Collation.json` | Working draft of `iss.iss_bid_institutional`, `iss.iss_bid_retail`, `iss.iss_bid_file_registry` (+ `_t` audit pairs). Pre-final bid collation tables. |
| `script-09-tmp_-_org___bank.json` | Working draft of `cm.cm_bank_master`, `cm.cm_bank_master_map`, `cm.cm_organization` (+ `_t`). Note: `cm.cm_organization` does not exist in current dict — was apparently renamed/folded into `cm_counterparty` or `cm_entities`. |
| `script-11-Trace__For_migration_.json` | Migration trace table `public.mig_trace_map` (16 cols). One-off audit table for mapping source→target IDs during migration; not part of OMEGA target proper. RawContent self-documents fields: src key columns, target uuid, parent linkage, status, remarks. |
| `script-12-OMEGA_Full_Temp.json` | Snapshot of OMEGA Full taken Wed Feb 11 2026 (96 tables, schema-summary header in raw). Older revision of script-10. |
| `script-13-Draft_allotment_run_and_allotment_results_table.json` | Draft consolidated allotment-run / allotment-results redesign (16 iss tables, includes both auction + SSB + syndication allotment shapes side-by-side, with `_t` pairs). Effectively an in-flight redesign covering iss_issuance, iss_run, iss_auction_run, iss_auction_results, iss_sb_allotment_run, iss_sb_allotment_results, iss_synd_allotment_run, iss_synd_allotment_results plus `_t` audits. |
| `script-14-BKP_OMEGA_FULL.json` | Backup of OMEGA Full (99 tables: cm 27, iss 43, sec 4, stg 25). |

---

## 5. Anomalies / questions raised

### 5.1 Source-side anomalies

1. **No PRI1/MS7ABA tables in `data.targets`.** FE_TRI1 declares a DB Link to `MS7ABA` (`script-04-FE_TRI1.json` rawContent ~line 5) but every parsed table lives under `MS9ABA`. If the user expected a PRI1 schema with its own tables, it is **not** present in this workspace — only the link to it.
2. **Both BE and FE are tagged `MS9ABA`.** They are still distinct DBs (the file split + the existence of a `MNET` DB link on FE confirm that), but the parsed schema name on every table is identical. Any tool that joins `schema + table` across both sides will collide unless the migration owner injects an extra qualifier.
3. **Number-prefix collisions across BE vs FE:**
   - ABA0008 — BE: STAGE_SECURITY_MASTER ; FE: AUCTION_AUDIT_LOG
   - ABA0009 — BE: BANK_MASTER ; FE: EAUCTION_CONFIG
   - ABA0010 — BE: ANNOUNCE_TEXT ; FE: EAUCTION_AUCTION_CUTOFF_TIME
   - ABA0035 — BE: RETAILBID_FILE ; FE: SECURITY_MASTER_CTG_STG
   - ABA0036 — BE: STAGE_SORA_AMMO ; FE: RETAILBID_FILE
   The numeric prefix is **not** a stable inter-system key.
4. **Number-prefix collisions inside FE_TRI1 itself (ERF flavor split):**
   - AQA0104 — `AQA0104_ERF_SYSTEM_PARM` (6 cols) and `AQA0104_SYSTEM_PARM` (4 cols)
   - AQA0105 — `AQA0105_CYCLE` (3 cols) and `AQA0105_ERF_CYCLE` (3 cols)
   - AQA0107 — `AQA0107_AUDIT_LOG` and `AQA0107_ERF_AUDIT_LOG`
   - AQA0108 — `AQA0108_LOG_DETAIL` and `AQA0108_ERF_LOG_DETAIL`
   - ABA0034 in BE — `ABA0034_EAPPS_SUBMISSION_CUTOFF_TIME` (6 cols) vs `ABA0034_STG_SC_SECURITY_MASTER` (48 cols)
   Looks like ERF v5 vs ERF v6 dual-living tables. Open question: which set is live, which is legacy?
5. **Drift between BE and FE for shared table names:** `AQA0002_TRANSACTION` 33 cols (BE) vs 34 cols (FE); `AQA0006_EAPPS_TRANSACTION` 33 cols (BE) vs 37 cols (FE). Even tables with the same name do not share a schema between the two systems.
6. **Table-name typos in source DDL:** `ABA233_SB_BATCH_JOB_BKUP` (note the missing trailing `0` in 233 vs 0233) coexists with `ABA0233_SB_BATCH_JOB_BKUP` in FE_TRI1. Likely a stale dev-time backup.
7. **Heavy backup/dated-snapshot pollution.** ~25 source tables across BE/FE are `*_BKUP*`, `*_BKP*`, `*_BACKUP*`, or `*_YYYYMMDD*` dated snapshots (e.g. ABA0001_SECURITY_MASTER × 9 variants on BE alone). The migration only needs one canonical row per logical entity — the rest should be `toIgnore`.
8. **Dev-test scratch tables:** TEMP, TEMP1, TEMP_SUBSCRIPTION_ENTRY, TEST_CLOB, TEST_DB_DUMP, TESTSYNC, TEMP_AFTERDBEXPORT, TMP_CALL_CENTRE, USER_SESSION (BE-only stub overlapping ABA0024_USER_SESSION). Almost certainly out-of-scope for migration; flag as `toIgnore`.
9. **All source tables have empty `description`, `toIgnore`, `explanationCompleted`** in the parsed JSON. No human curation has happened on the source side yet.

### 5.2 Target-side anomalies

10. **`sec` schema is entirely absent from `omega-ddl-current.dict.json`** (0 of 4 sec tables present). The dict has 49 cm + 43 iss + 37 stg = 129 keys; `script-10-OMEGA_Full.json` has 36 cm + 57 iss + 4 sec + 25 stg = 122 tables. Both `sec_security_master` and `sec_coupon_schedule` (plus `_t` audits) need to be added to the dict, or a separate `sec`-dict source must be located.
11. **Dict keys placed under wrong schema:** `iss.cm_applicant_submission_group_t` is keyed under `iss.*` in the dict despite being a `cm_*` audit table. Either the dict has a typo or the table actually lives in the `iss` schema in the OMEGA DDL (a `_t` for a `cm_*` parent crossing schemas would be unusual). Worth verifying against `script-01-iss.json` rawContent.
12. **Dict and script-10-OMEGA_Full disagree heavily on iss tables.**
    - In script-10 but not in dict (50 tables): includes all `iss_*_bkp` / `iss_*_t_bkp` (27 of these are explicit backups), plus some live tables: `iss_run`, `iss_run_t`, `iss_auction_results`, `iss_auction_results_t`, `iss_subscription_t`, `iss_holdings`, `iss_holdings_t`, `iss_redemption`, `iss_redemption_t`, `iss_file_error`, `iss_file_error_t`, `iss_file_registry_t`, `iss_bid_file_registry`, `iss_bid_file_registry_t`, `iss_sb_announcement_stepup_rates(+_t)`, `iss_sb_issuance_stepup_rates(+_t)`, `iss_sb_allotment_results(+_t)`, `iss_synd_allotment_results(+_t)`, `iss_calendar_params*`, `iss_sec_params*`, `iss_coupon_payment_dates*`, `iss_announcement_allotment_params*`. The non-`_bkp` ones likely should be added to the dict.
    - In dict but not in script-10 (mostly cm): all 22 `cm_applicant*`, `cm_corppass*`, `cm_file_record_error*`, `cm_file_registry_t`, `cm_internal_role_group*`, `cm_report_metadata*`, `cm_status_map*`, `cm_user_role_group_assign*`, `cm_user_tbl*`, plus the 5 `iss_announcement_stepup_rates*`, `iss_bid_submission_end_*`, `iss_bid_submission_group*`, `iss_issuance_stepup_rates*`, `iss_participating_dealers*`, `iss_sb_applicant*`, `iss_sb_holdings*`, `iss_sb_redemption*`, `iss_sb_subscription_t`, `iss_security_master*`, plus 13 `stg_*` (all `agd_out_*`, `eapps_*`, plus `fmbs_out_auction/closingprice/erf/erf_agg_bids/secupdt`).
    - **Bottom line:** neither the dict nor `script-10-OMEGA_Full.json` is the authoritative target list. They diverge in opposite directions. The user needs to pick one as canonical (probably the dict) and reconcile.
13. **Backup tables polluting target-side script-10:** 27 `*_bkp` / `*_t_bkp` tables (`iss_allotment_run_bkp`, `iss_announcement_allotment_params_bkp`, `iss_calendar_parameters_bkp`, `iss_calendar_params_bkp`, `iss_coupon_payment_dates_bkp`, `iss_sec_params_bkp`, `issuance_coupon_payment_dates_bkp`, plus all their `_t_bkp` pairs). These are old shapes — the live shapes are typically `iss_calendar_data` / `iss_calendar_listing` etc. Should not be in the canonical target.
14. **Target table name without `iss_` prefix:** `iss.issuance_coupon_payment_dates_bkp` and `iss.issuance_coupon_payment_dates_t_bkp` — note `issuance_*`, not `iss_*`. Unique in the script. Dead/legacy.
15. **`(Click to add)` placeholders** on three live tables (description not filled): `cm.cm_batch_job_t`, `stg.stg_meps_out_auction`, `stg.stg_meps_out_closingprice`. Need user input for the dict.
16. **Mojibake in two dict descriptions:** `cm.cm_file_registry` and `cm.cm_master_code` have `â€”` (UTF-8 of em-dash misread as Latin-1) in their descriptions, suggesting a bad encoding round-trip when the dict was last saved. Fixable with a one-shot re-save.
17. **`script-13-Draft_allotment_run_and_allotment_results_table.json`** redesigns the allotment shape across auction/SSB/syndication. If accepted, it potentially supersedes `iss_allotment_run_bkp` family AND `iss_run` AND `iss_auction_run` — currently coexisting in script-10 with overlapping responsibilities. Status (draft/approved) is not declared.
18. **`script-09-tmp_-_org___bank.json` references `cm.cm_organization`** which does not exist in current dict or script-10. Either renamed to `cm_counterparty` or dropped. The temp script is therefore stale.
19. **`script-11-Trace__For_migration_.json`** is the migration trace table (`public.mig_trace_map`). It is migration-tooling, not part of OMEGA target. Should be tagged accordingly so it doesn't get migrated into OMEGA.

### 5.3 Cross-cutting questions for the user

- Are TRI1 and PRI1 the same system, or is PRI1 a third source we haven't received DDL for yet?
- Which OMEGA target list is canonical: `omega-ddl-current.dict.json` (129 tables, no sec) or `script-10-OMEGA_Full.json` (122 tables incl. sec, plus 27 `_bkp` tables)?
- Should the `_BKUP` / `_BKP` / `_YYYYMMDD` source tables and the `_bkp` target tables all be marked `toIgnore` so they fall out of mapping work?
- Is `iss.cm_applicant_submission_group_t` really an `iss` table, or is the dict key mis-prefixed?
- What is the status of `script-13-Draft_allotment_run_and_allotment_results_table.json` — accepted redesign, or still under review?
