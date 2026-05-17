# Target-Side Scope Classification (v0.02)

> Per-table tag: **Migrate** (legacy source loaded by DM pipeline) / **Configure** (OMEGA-native seed or runtime-only) / **TBD** (genuinely uncertain — needs user discussion).
> Source: `omega-ddl-current.dict.json` filtered to `cm.*` and `iss.*` BASE tables (excludes `_t` audit twins, `stg.*`, and old `sec.*` per D5/D7). The misplaced `iss.cm_applicant_submission_group_t` key is also excluded.
> Total in scope: 25 cm + 21 iss = 46 base tables.
> Cross-references: v0.01 sheet IDs (SECMST/ISSCAL/ISSANN/BIDCOL) from `_notes/v001-excel-analysis.md` §3; source coverage / `draft_to_migrate` flags from `phase1/inventory.json`.

## Summary (resolved 2026-05-05 by user)

| Class | Count |
|---|---|
| Migrate | 21 |
| Configure | 25 |
| TBD | 0 |
| **Total** | **46** |

By schema:

| Schema | Migrate | Configure | TBD | Total |
|---|---|---|---|---|
| cm.* | 5 | 20 | 0 | 25 |
| iss.* | 16 | 5 | 0 | 21 |

---

## cm.* base tables (25 tables)

| Target | Class | Likely legacy source | Reasoning |
|---|---|---|---|
| cm.cm_applicant | Configure | — | User decision 2026-05-05: institutional applicants are OMEGA-native; ABA0223_SB_APPLICANT goes to iss.iss_sb_applicant for retail. |
| cm.cm_applicant_mapping | Configure | — | Maps non-PD applicants to PD counterparties; OMEGA-native relationship not present in legacy. Seeded post-go-live. |
| cm.cm_applicant_submission_group | Configure | — | Bulk applicant upload batch tracker — runtime workflow artefact, no legacy precursor. |
| cm.cm_bank_master | Migrate | ABA0009_BANK_MASTER | User decision 2026-05-05: one-time load from legacy snapshot; MEPS+ banks.txt feed will refresh post-go-live. |
| cm.cm_batch_job | Configure | — | OMEGA batch job execution log (Spring Batch-style); written at runtime. Legacy ABA0027/ABA0028 are MNETD-internal and excluded (`draft_to_migrate=N`). |
| cm.cm_batch_job_detail | Configure | — | Per-record details under cm_batch_job; runtime-written child of an OMEGA-native parent. |
| cm.cm_corppass_role_map | Configure | ABA0030_CORP_PASS_MAPPING (reference only) | OMEGA-native Corppass↔Kaizen role mapping. ABA0030 has different shape; treat as configuration seed, not migration. |
| cm.cm_counterparty | Migrate | ABA0013_PRIMARY_DEALER + ABA0222_SB_ORG (+ ABA0009_BANK_MASTER for bank_code) | Counterparty profile consolidates PDs and SB orgs. Inventory marks ABA0013 / ABA0222 as `Y`. |
| cm.cm_documents | Configure | — | S3 storage references for files OMEGA itself processes — created at runtime. |
| cm.cm_file_record_error | Configure | — | Per-record validation errors raised by OMEGA file ingestion — runtime artefact. |
| cm.cm_file_registry | Configure | — | OMEGA's own batch-file tracker for interface feeds and uploads — runtime artefact. |
| cm.cm_internal_role_group | Configure | — | OMEGA-native internal role group master, defined by configuration. |
| cm.cm_internal_role_group_map | Configure | — | OMEGA role-group → Kaizen-role mapping; configuration seed. |
| cm.cm_master_code | Configure | — | User confirmed: seeded fresh in OMEGA. |
| cm.cm_master_code_category | Configure | — | User confirmed: seeded fresh in OMEGA (parent of cm_master_code). |
| cm.cm_properties | Configure | — | Spring Cloud Config-style key-value store; environment configuration, not migrated. |
| cm.cm_public_holiday | Migrate | ABA0019_PUBLIC_HOLIDAY | User decision 2026-05-05: load historical + future Singapore holiday calendar. |
| cm.cm_report_metadata | Configure | — | Report template paths and data-source definitions; configuration seed. |
| cm.cm_sectype_params | Configure | AQA0008_SEC_AUCTION_PARA (reference only) | Core security-type parameter table. Inventory marks AQA0008 as `N`. OMEGA-native parameterization, seeded. |
| cm.cm_status_map | Configure | — | Internal↔external status code mapping; OMEGA-native seed. |
| cm.cm_subtype_params | Configure | — | Sub-level params for SGS Bond MDP/Infrastructure/Green variants — OMEGA-native config (these subtypes are post-legacy). |
| cm.cm_system_params | Configure | ABA0506/ABA0606/ABA0127_SB_SYSTEM_CONFIG (reference only) | OMEGA's own timing/offset/buffer parameters. Different shape and scope to legacy SYSTEM_PARM tables. |
| cm.cm_tenor_params | Configure | — | Tenor configurations driving issue-code naming and calendar generation; OMEGA-native config. |
| cm.cm_user_role_group_assign | Configure | — | User → role-group assignment; configuration / runtime user-management. |
| cm.cm_user_tbl | Configure | — | User decision 2026-05-05: users re-provisioned via IAM at go-live; legacy AQA0003_USER / ABA0237_SB_USER not loaded. |

---

## iss.* base tables (21 tables)

| Target | Class | Likely legacy source | Reasoning |
|---|---|---|---|
| iss.iss_announcement_details | Migrate | ABA0001_SECURITY_MASTER (+ ABA0010_ANNOUNCE_TEXT, ABA0110_SB_ANNOUNCE_TEXT) | v0.01 ISSANN-001. Announcement attributes derived from security master + announcement text. |
| iss.iss_announcement_stepup_rates | Migrate | ABA0124_SB_COUPON_RATE_DETAILS | SSB step-up coupon rates per year — held in SB coupon rate details on legacy. |
| iss.iss_auction_run | Migrate | ABA0006_AUCTION_RESULT + ABA0007_DETAIL_AUCTION_RESULT | Non-SSB UPA auction execution outcomes. ABA0007 marked `Y` in inventory. |
| iss.iss_auction_safeguard | Configure | — | Configured safeguard offsets/bounds for UPAs — OMEGA-native parameterization, no legacy precursor. |
| iss.iss_bid_institutional | Migrate | ABA0007_DETAIL_AUCTION_RESULT | v0.01 BIDCOL-003. Institutional competitive/non-competitive bids per auction. |
| iss.iss_bid_retail | Migrate | ABA0004_RETAIL_BID_TRANS (+ ABA0035_RETAILBID_FILE) | v0.01 BIDCOL-001/002. Retail bid applications for SGS Bonds/T-Bills. |
| iss.iss_bid_submission_end_mapping | Configure | — | Bid-window-extension request linkage; OMEGA-native workflow artefact (no legacy concept). |
| iss.iss_bid_submission_end_time | Configure | — | Bid-window-extension request records with maker-checker; OMEGA-native workflow. |
| iss.iss_bid_submission_group | Configure | — | Bid batch / maker-checker grouping; OMEGA-native. Legacy bids have no submission-group concept. |
| iss.iss_calendar_data | Migrate | ABA0021_ISSUE_CALENDAR + ABA0121_SB_ISSUE_CALENDAR | v0.01 ISSCAL-003/004. Per-issuance calendar entries (the body rows of a calendar). |
| iss.iss_calendar_listing | Migrate | ABA0021_ISSUE_CALENDAR + ABA0121_SB_ISSUE_CALENDAR | v0.01 ISSCAL-001/002. Calendar header (year/period/security_type). |
| iss.iss_issuance | Migrate | ABA0001_SECURITY_MASTER + ABA0101_SB_SECURITY_MASTER | v0.01 SECMST-002. Issuance-level details (issue_no, dates, amounts) extracted from legacy security master. |
| iss.iss_issuance_stepup_rates | Migrate | ABA0124_SB_COUPON_RATE_DETAILS | Finalized SSB step-up rates and payment schedule per year. |
| iss.iss_participating_dealers | Configure | — | Verified 2026-05-05: legacy has no per-announcement PD list. ABA0013_PRIMARY_DEALER is the master only (= cm.cm_counterparty); AQA0008_SEC_AUCTION_PARA is auction params, not PD authorization. OMEGA seeds going forward. |
| iss.iss_sb_allotment_run | Migrate | ABA0232_SB_ALLOTMENT_RESULT | SSB Quantity Ceiling allotment run outcomes. Inventory marks `TBD` but user has called out SSB allotment as in-scope. |
| iss.iss_sb_applicant | Migrate | ABA0223_SB_APPLICANT | SSB retail applicant identity profiles (NRIC/passport/name/nationality). Direct semantic match. |
| iss.iss_sb_holdings | Migrate | ABA0230_SB_HLD_INFO (+ ABA0231_SB_HLD_INFO_DT) | Current SSB holdings per retail investor — funding source, custody, SGD face value. |
| iss.iss_sb_redemption | Migrate | ABA0227_SB_REDEMPTION (+ ABA0228_SB_REDEMPTION_DT) | Individual SSB redemption requests. |
| iss.iss_sb_subscription | Migrate | ABA0224_SB_SUBSCRIPT (+ ABA0225_SB_SUBSCRIPT_DT) | Retail SSB subscription applications. |
| iss.iss_security_master | Migrate | ABA0001_SECURITY_MASTER (+ ABA0101_SB_SECURITY_MASTER for SSB) | v0.01 SECMST-001 (rebadged from sec.sec_security_master per D7). Master security definitions. |
| iss.iss_synd_allotment_run | Migrate | AQA0012_SYNDICATION_INS_RET_DT (+ AQA0013_SYNDICATION_COUPON_DT, AQA0016_SYNDICATED_SEC_MAST_DT) | Syndication allotment runs across public-offer + placement tranches. Inventory `TBD` but Syndication domain is in source scope. |

---

## Resolved (2026-05-05)

All 5 prior TBDs resolved by user. Updated counts: **21 Migrate / 25 Configure / 0 TBD**.

- ✓ cm.cm_applicant → Configure (institutional applicants OMEGA-native)
- ✓ cm.cm_bank_master → Migrate (ABA0009 one-time load)
- ✓ cm.cm_public_holiday → Migrate (ABA0019)
- ✓ cm.cm_user_tbl → Configure (IAM re-provisioning)
- ✓ iss.iss_participating_dealers → Configure (no legacy per-announcement PD list — verified by source DDL inspection)

## Lower-priority items still open

6. **cm.cm_corppass_role_map vs ABA0030_CORP_PASS_MAPPING.** ABA0030 is `Y` in inventory, but its 8-column shape doesn't match the OMEGA Corppass↔Kaizen mapping. Is ABA0030 the legacy source (Migrate) or for a different target? Currently classified Configure pending review.
7. **cm.cm_sectype_params vs AQA0008_SEC_AUCTION_PARA.** Both relate to per-security-type auction parameters. AQA0008 is `N` in inventory, but worth confirming OMEGA seeds these fresh and discards legacy values.
