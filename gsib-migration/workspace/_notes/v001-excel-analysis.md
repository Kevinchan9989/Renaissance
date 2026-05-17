# v0.01 Excel Mapping Spec — Reference Analysis

Source workbook: `gsib-migration/workspace/MAS_OMEGA_DM_Conversion_Mapping_Specification _v0.01.xlsx`
(note the literal space before `_v0.01`)
Compared against: `tools/conversion-spec-exporter/data/sample.cjs`
Date of analysis: 2026-05-05

---

## 1. Sheet inventory

| # | Sheet name (verbatim) | Rows | Cols | Purpose | Covered by sample.cjs? |
|---|---|---|---|---|---|
| 1 | `Overview` | 29 | 5 | Cover page: about, revision history, sign-off table, additional notes. | Yes (`overview` block) |
| 2 | `List of Source Tables` | 146 | 8 | Full inventory of legacy source tables with module/domain, source schema (MNETD / PRI1 / MNETD & PRI1), to-migrate flag, R1/R2 release tag. | **Partially** — sample.cjs calls this `inventory` and only ships 4 stub rows. **Sheet name differs: workbook uses `List of Source Tables`, sample assumes `Inventory`.** |
| 3 | `Migration Summary` | 15 | 6 | Sequencing/dependency table for the 11 modules. | Yes |
| 4 | `MAS-OMEGA-SECMST-001` | 12 | 12 | Map ABA0001 → `sec.sec_security_master` (one record per security_code). | **No** — sample ships a one-row stub only. |
| 5 | `MAS-OMEGA-SECMST-002` | 52 | 12 | Map ABA0001 → `iss.iss_issuance` (one record per (security_code, issue_no)). | **No** — sample ships a stub. |
| 6 | `MAS-OMEGA-ISSCAL-001` | 27 | 16 | Map ABA0021 → `iss.iss_calendar_listing` (auction/eApps yearly listing). | Partially — sample has 4 example rows; real sheet has 17 data rows + 14 extra columns past col 12 (cols 13-16 are blank — likely unused). |
| 7 | `MAS-OMEGA-ISSCAL-002` | 32 | 12 | Map ABA0121_SB → `iss.iss_calendar_listing` (Savings Bonds yearly). | **No** — sample stub. |
| 8 | `MAS-OMEGA-ISSCAL-003` | 49 | 12 | Map ABA0021 → `iss.iss_calendar_data` (eApps per-issuance calendar rows). | Partially — sample has 3 rows; real sheet has 16 data rows. |
| 9 | `MAS-OMEGA-ISSCAL-004` | 25 | 12 | Map ABA0121_SB → `iss.iss_calendar_data` (SB per-issuance calendar rows). | **No** — sample stub. |
| 10 | `MAS-OMEGA-ISSANN-001` | 33 | 12 | Map ABA0001 → `iss.iss_announcement_details` (announcement details per issuance). | **No** — sample stub. |
| 11 | `MAS-OMEGA-BIDCOL-001` | 23 | 12 | Map ABA0007 → `iss.iss_bid_retail` (retail bids parent record). | **No** — sample stub. |
| 12 | `MAS-OMEGA-BIDCOL-002` | 5 | 12 | Map ABA0004 → `iss.iss_bid_retail` (retail bid file/batch grouping fields — only 3 data rows; **clearly a partial draft**). | **No** — sample stub. |
| 13 | `MAS-OMEGA-BIDCOL-003` | 19 | 12 | Map ABA0007 → `iss.iss_bid_institutional` (institutional bids; mirrors BIDCOL-001 structure). | **No** — sample stub. |
| 14 | `Codes` | 5 | 8 | Reference codes block — `title2`, `test_script`, `test_type`, `flow_type`, `test_crit`. Looks like a leftover from a test plan template; not used elsewhere in the workbook. | Yes (matches verbatim) |

### Key sheet-level drift
- **Inventory tab name mismatch**: workbook says `List of Source Tables`; sample.cjs builder code likely emits `Inventory`. Update either the builder or the data layer to align.
- **No `Codes` columns spec**: sample.cjs labels rows positionally (`title2`, `test_script`, etc.) — workbook does the same exact labels but only 5 rows total.
- **No yellow-fill TBC markers exist in v0.01**. The workbook uses the literal strings `TBC`, `TBD`, or `TBD ` (trailing space) inside the Transformation Logic / Remarks cells instead of cell fill. The only fills present are header navy `#102B4E` (row-1 banner) and pale-blue `#DAEEF3` (header row 2). The `__tbc=true` flag in sample.cjs is therefore **purely a sample/builder convention**, not something v0.01 mirrors. Decide whether you keep that convention going forward — the source of truth is plain text "TBD"/"TBC" today.

---

## 2. Migration Summary tab — verbatim rows

Header row: `Migration Sequence | Module Name | Source Table(s) | Target Table(s) | Dependency | Filter Rule / Selection Logic`

| Seq | Module ID | Source Table(s) | Target Table(s) | Dependency | Filter Rule / Selection Logic |
|----:|---|---|---|---|---|
| 10 | MAS-OMEGA-SECMST-001 | ABA0001_SECURITY_MASTER | sec.sec_security_master | `-` | `To migrate record with MAX(ABA0001_ISSUE_NO) There will only be one record per security` *(sentence runs off — see drift note)* |
| 20 | MAS-OMEGA-SECMST-002 | ABA0001_SECURITY_MASTER | iss.iss_issuance | `Must run after MAS-OMEGA-SECMST-001` | `To migrate record via composite key (ABA0001_SECURITY_CODE, ABA0001_ISSUE_NO)` |
| 30 | MAS-OMEGA-ISSCAL-001 | ABA0021_ISSUE_CALENDAR | iss.iss_calendar_listing | `-` | `To migrate one record per year extracted from ABA0021_ISSUE_DATETIME` |
| 40 | MAS-OMEGA-ISSCAL-002 | ABA0121_SB_ISSUE_CALENDAR | iss.iss_calendar_listing | `-` | `To migrate one record per year extracted from ABA0121_ISSUE_DATETIME ` *(trailing space)* |
| 50 | MAS-OMEGA-ISSCAL-003 | ABA0021_ISSUE_CALENDAR | iss.iss_calendar_data | `Must run after MAS-OMEGA-ISSCAL-001` | `To migrate record linked to iss_calendar_listing_uuid via year ` |
| 60 | MAS-OMEGA-ISSCAL-004 | ABA0121_SB_ISSUE_CALENDAR | iss.iss_calendar_data | `Must run after MAS-OMEGA-ISSCAL-002` | `To migrate record linked to iss_calendar_listing_uuid via year ` |
| 70 | MAS-OMEGA-ISSANN-001 | ABA0001_SECURITY_MASTER | iss.iss_announcement_details | `Must run after MAS-OMEGA-ISSCAL-003/004 and MAS-OMEGA-SECMST-002` | `To migrate record via composite key (ABA0001_SECURITY_CODE, ABA0001_ISSUE_NO)` |
| 80 | MAS-OMEGA-BIDCOL-001 | ABA0007_DETAIL_AUCTION_RESULT | iss.iss_bid_retail | `Must run after MAS-OMEGA-SECMST-002` | `To migrate records where ABA0007_TYPE_OF_APPLN= 'IND'` |
| 100 | MAS-OMEGA-BIDCOL-002 | ABA0004_RETAIL_BID_TRANS | iss.iss_bid_retail | `Must run after MAS-OMEGA-BIDCOL-001  ` *(double trailing space)* | `To migrate via unique composite key (ABA0004_BANK_REF_NO + ABA0004_RECEIVED_DATE + ABA0004_FILE_TYPE)` |
| 110 | MAS-OMEGA-BIDCOL-003 | ABA0007_DETAIL_AUCTION_RESULT | iss.iss_bid_institutional | `Must run after MAS-OMEGA-SECMST-002` | `To migrate records where ABA0007_TYPE_OF_APPLN is not 'IND'` |

**Note**: Seq jumps 80 → 100 (gap at 90). Standard pattern is a 10-step gap.

### Dependency phrasing pattern
- A blank/no-prereq row uses literal hyphen `-` (single character).
- Otherwise: `Must run after <MODULE-ID>` for one prereq.
- For multiple prereqs: `Must run after <MODULE-ID-A>/<B> and <MODULE-ID-C>` (slash joins parallel children of the same parent, `and` joins disjoint parents).

### Filter phrasing pattern
Always starts with `To migrate ...` (gerund clause). Common variants:
- `To migrate record with MAX(<col>)` — single deduped row.
- `To migrate record via composite key (<col1>, <col2>)` — 1:1 by composite.
- `To migrate one record per <unit> extracted from <col>` — derive value (e.g., year).
- `To migrate record linked to <fk_uuid> via <key>` — child FK linkage.
- `To migrate records where <col> = '<value>'` / `... is not '<value>'` — predicate filter.
- `To migrate via unique composite key (<col1> + <col2> + <col3>)` — concatenated grouping key (uses `+` not `,`).

---

## 3. Mapping sheets — full content

### 3.1 Header convention (rows 1 + 2 every sheet)

- **Row 1 col A**: Module ID banner (e.g. `MAS-OMEGA-SECMST-001`), navy fill `#102B4E`, white text. **Note**: BIDCOL-002 has the wrong banner (says `MAS-OMEGA-BIDCOL-001`) and BIDCOL-003 also has wrong banner (`MAS-OMEGA-BIDCOL-002`) — typos in the source.
- **Row 2**: Column headers, pale-blue fill `#DAEEF3`. Exact 12 column names:
  `Module ID | Source Table | Source Column | Source Datatype | Source Nullable | To migrate | Target Table | Target Column | Target Datatype | Target Nullable | Transformation/Mapping Logic | Remarks`
- **Row 3+**: data. For not-migrated source columns, columns G–K are filled with `-` (single hyphen) and Remarks holds the explanation (typically `Migrated to <table>` or `Not applicable to OMEGA`).

### 3.2 MAS-OMEGA-SECMST-001 (10 data rows, target `sec.sec_security_master`)

| Source Col | Datatype | NN | To mig | Target Col | T-Type | NN | Transformation | Remarks |
|---|---|---|---|---|---|---|---|---|
| - | - | - | Y | uuid | VARCHAR(36) | N | `Generate UUID: Create a unique UUID for every distinct SECURITY_CODE.` | `This is to migrate per security code, multiple issuances with different issue_no will be migrated to iss.iss_issuance` |
| ABA0001_SECURITY_CODE | CHAR(8) | N | Y | security_code | VARCHAR(8) | N | `Transformation:\n\nSELECT DISTINCT ABA0001_SECURITY_CODE\n\nIF duplicates exist (due to multiple Issue Nos) -> SELECT record with MAX(ABA0001_ISSUE_NO)` | `To migrate the most recent security code details.` |
| ABA0001_ISIN_CODE | CHAR(12) | Y | Y | isin_code | VARCHAR(12) | Y | `Direct Mapping` | `-` |
| ABA0001_SECURITY_NAME | VARCHAR2(30) | N | Y | security_name | VARCHAR(50) | Y | `Direct Mapping` | `-` |
| ABA0001_TAX_STATUS | CHAR(1) | Y | Y | tax_status | VARCHAR(1) | Y | `Direct Mapping` | `-` |
| ABA0001_ETENDER_IND | CHAR(1) | Y | Y | etender_ind | VARCHAR(1) | Y | `Direct Mapping` | `-` |
| ABA0001_CURR | CHAR(3) | Y | Y | currency | VARCHAR(3) | Y | `Direct Mapping` | `-` |
| ABA0001_SECURITY_CODE | CHAR(8) | N | Y | sgs_type | VARCHAR(20) | Y | `Transformation:\n\nIF Starts with 'N' AND 4th last char is '2' -> 'SGSTYPE_INFRA'\nIF Starts with 'N' AND 4th last char is '3' -> 'SGSTYPE_GREEN_INFRA'\nIF Starts with 'N' (and 4th last char not '2' or '3') -> 'SGSTYPE_MD'` | `To derive specific SGS Type based on legacy naming conventions.` |
| ABA0001_FIRST_CPN_PAYM_DATE | DATE | Y | Y | first_coupon_payment_dt | TIMESTAMP | Y | `Direct Mapping` | `-` |
| ABA0001_SECURITY_CODE | CHAR(8) | N | Y | coupon_pay_frequency | VARCHAR(20) | Y | `Transformation:\n\nIF SECURITY_CODE Starts with 'N' -> 'SEMI_ANNUAL'\nIF SECURITY_CODE Starts with 'M1' -> 'SEMI_ANNUAL'\nELSE -> 'AT_MATURITY'` | `To derive coupon payment frequency based on Security Type` |

### 3.3 MAS-OMEGA-SECMST-002 (50 data rows, target `iss.iss_issuance`)

Headers verbatim. Below: every data row, `\n` represents a literal newline inside the cell.

1. `- | - | - | - | Y | iss.iss_issuance | uuid | VARCHAR(36) | N | Generate UUID: Create a new UUID for every unique combination of SECURITY_CODE + ISSUE_NO. | Primary Key for OMEGA Issuance table.`
2. `ABA0001_SECURITY_CODE | CHAR(8) | N | Y | iss.iss_issuance | sec_security_master_uuid | VARCHAR(36) | N | Lookup: Query sec.sec_security_master.uuid where security_code matches ABA0001_SECURITY_CODE. | Mandatory Foreign Key. Ensure Security Master is migrated first.`
3. `ABA0001_ISSUE_NO | CHAR(1) | N | Y | issue_no | NUMERIC(2,0) | N | Direct Mapping | -`
4. `ABA0001_SECURITY_CODE | CHAR(8) | N | Y | security_type | VARCHAR(50) | N | Transformation:\n\nIF Starts with 'BA' -> 'SECTYPE_CMTB'\nIF Starts with 'B' (and not 'BA') -> 'SECTYPE_TBILL'\nIF Starts with 'N' AND 4th last char is '2' -> 'SECTYPE_SGS'\nIF Starts with 'N' AND 4th last char is '3' -> 'SECTYPE_SGS'\nIF Starts with 'N' (and 4th last char not '2' or '3') -> 'SECTYPE_SGS'\nIF Starts with 'M1' -> 'SECTYPE_MAS_FRN'\nIF Starts with 'M' (and not 'M1') -> 'SECTYPE_MASBILL' | To map security type based on security code prefix`
5. `ABA0001_TENDER_DATE | DATE | N | Y | issuance_type | VARCHAR(50) | N | Transformation:\n\nWHEN ABA0001_TENDER_DATE < ABA0001_ANNOUNCE_DATE THEN 'ISSTYPE_SYNDICATION': | To determine issuance_type = 'ISSTYPE_SYNDICATION' based on condition if ABA0001_TENDER_DATE < ABA0001_ANNOUNCE_DATE` *(trailing colon on the WHEN line is a typo, kept verbatim)*
6. `ABA0001_TENDER_DATE | DATE | N | Y | status | VARCHAR(50) | N | Transformation:\n\nIF ABA0001_TENDER_DATE < SYSDATE -> 'ISSSTAT_PUBLISHED' | Derived status based on ABA0001_TENDER_DATE.`
7. `- | - | - | - | N | auction_status | VARCHAR(50) | Y | Map to NULL | -`
8. `ABA0001_ISSUE_NO | CHAR(1) | N | Y | new_reopen_flag | VARCHAR(1) | Y | Transformation:\n\nIF '1' -> 'N'\nELSE -> 'R' | Any ABA0001_ISSUE_NO > 1 indicates its an reopen issue` *(typo: "its an reopen" — kept verbatim)*
9. `ABA0001_BENCHMARK_IND | CHAR(1) | Y | Y | is_benchmark | VARCHAR(1) | Y | Direct Mapping | -`
10. `ABA0001_ISSUE_DATE | DATE | N | Y | issue_dt | TIMESTAMP | N | Direct Mapping | -`
11. `ABA0001_TENDER_DATE | DATE | N | Y | auction_dt | TIMESTAMP | N | Direct Mapping | -`
12. `ABA0001_MATURITY_DATE | DATE | N | Y | maturity_dt | TIMESTAMP | N | Direct Mapping | -`
13. `ABA0001_ANNOUNCE_DATE | DATE | Y | Y | announcement_dt | TIMESTAMP | Y | Direct Mapping | -`
14. `ABA0001_TENDER_DATE | DATE | N | Y | bid_submission_end_dt | TIMESTAMP | Y | Direct Mapping | -`
15. `ABA0001_LAST_INT_DATE | DATE | Y | Y | last_coupon_payment_dt | TIMESTAMP | Y | Direct Mapping | -`
16. `ABA0001_NEXT_INT_DATE | DATE | Y | Y | next_coupon_payment_dt | TIMESTAMP | Y | Direct Mapping | -`
17. `ABA0001_EX_INT_DATE | DATE | Y | Y | ex_int_dt | TIMESTAMP | Y | Direct Mapping | -`
18. `- | - | - | - | N | pricing_dt | TIMESTAMP | Y | TBD  | For Syndication, will provide the mapping in next revision.` *(TBD with two trailing spaces)*
19. `ABA0001_ANNOUNCE_DATE | DATE | Y | Y | public_offer_start_dt | TIMESTAMP | Y | TBD  | For Syndication, will provide the mapping in next revision.`
20. `ABA0001_TENDER_DATE | DATE | N | Y | public_offer_end_dt | TIMESTAMP | Y | TBD  | For Syndication, will provide the mapping in next revision.`
21. `- | - | - | - | N | app_closing_dt | TIMESTAMP | Y | Map to NULL | Derived from submission end.`
22. `ABA0001_ISSUE_DATE | DATE | N | Y | settlement_dt | TIMESTAMP | Y | Direct Mapping | -`
23. `ABA0001_INT_DATE1 | DATE | Y | Y | int_date1 | TIMESTAMP | Y | Direct Mapping | -`
24. `ABA0001_INT_DATE2 | DATE | Y | Y | int_date2 | TIMESTAMP | Y | Direct Mapping | -`
25. `ABA0001_ISSUE_SIZE | NUMBER(13,0) | N | Y | total_amount_offered | NUMERIC(20,2) | N | Direct Mapping | -`
26. `- | - | - | - | N | denomination | NUMERIC(10,0) | Y | Default map to '1000' | This value is currently hardcoded in system logic as '1000' for SGS Bonds/T-Bills/MAS-Bills,  propose to default map to 1000`
27. `ABA0001_QTY_APPLIED | NUMBER(13,0) | Y | Y | total_amount_applied | NUMERIC(20,2) | Y | Direct Mapping | -`
28. `ABA0001_QTY_APPLIED | NUMBER(13,0) | Y | Y | total_amount_allotted | NUMERIC(20,2) | Y | Direct Mapping | Note: ABA0001 lacks explicit 'Total Allotted' col, usually implies QTY_OFFERED if fully sub, or derived. Use ABA0504_TOT_AMT_ALLOTED if available. [Source 78]`
29. `ABA0001_QTY_APP_COMP | NUMBER(13,0) | Y | Y | total_amount_applied_comp | NUMERIC(20,2) | Y | Direct Mapping | -`
30. `ABA0001_QTY_APP_NONCOMP | NUMBER(13,0) | Y | Y | total_amount_applied_noncomp | NUMERIC(20,2) | Y | Direct Mapping | -`
31. `ABA0001_MAS_APPLIED | NUMBER(13,0) | Y | Y | mas_intended_tender_amount | NUMERIC(20,2) | Y | Direct Mapping | -`
32. `ABA0001_MAS_ALLOTTED | NUMBER(13,0) | Y | Y | mas_amount_allotted | NUMERIC(20,2) | Y | Direct Mapping | -`
33. `ABA0001_NC_QTY_ALLOT | NUMBER(13,0) | Y | Y | noncomp_amount_allotted | NUMERIC(20,2) | Y | Direct Mapping | -`
34. `ABA0001_INTEREST_RATE | NUMBER(7,4) | Y | Y | coupon_rate | NUMERIC(7,4) | Y | Direct Mapping | -`
35. `ABA0001_CUTOFF_YIELD | NUMBER(5,2) | Y | Y | cutoff_yield | NUMERIC(5,2) | Y | Direct Mapping | -`
36. `ABA0001_AVE_YIELD | NUMBER(5,2) | Y | Y | average_yield | NUMERIC(5,2) | Y | Direct Mapping | -`
37. `ABA0001_MEDIAN_YIELD | NUMBER(5,2) | Y | Y | median_yield | NUMERIC(5,2) | Y | Direct Mapping | -`
38. `ABA0001_COY_PRICE | NUMBER(7,4) | Y | Y | cutoff_price | NUMERIC(7,4) | Y | Direct Mapping | -`
39. `ABA0001_AVE_PRICE | NUMBER(7,4) | Y | Y | average_price | NUMERIC(7,4) | Y | Direct Mapping | -`
40. `ABA0001_MEDIAN_PRICE | NUMBER(7,4) | Y | Y | median_price | NUMERIC(7,4) | Y | Direct Mapping | -`
41. `ABA0001_CLOSING_PRICE | NUMBER(9,4) | Y | Y | closing_price | NUMERIC(9,4) | Y | Direct Mapping | -`
42. `ABA0001_ACCRUED_INT | NUMBER(7,4) | Y | Y | accrued_interest_value | NUMERIC(7,4) | Y | Direct Mapping | -`
43. `ABA0001_ACCRUED_INT_DAYS | NUMBER(3,0) | Y | Y | accrued_interest_days | NUMERIC(3,0) | Y | Direct Mapping | -`
44. `ABA0001_PERCENT_COY | NUMBER(5,2) | Y | Y | comp_cutoff_allotment_pct | NUMERIC(5,2) | Y | Direct Mapping | -`
45. `ABA0001_NC_PERCENT | NUMBER(5,2) | Y | Y | noncomp_allotment_pct | NUMERIC(5,2) | Y | Direct Mapping | -`
46. `ABA0001_PERCENT_SUB | NUMBER(5,2) | Y | Y | bid_to_cover_ratio | NUMERIC(6,2) | Y | Direct Mapping | -`
47. `ABA0001_TENOR | NUMBER(3,0) | Y | Y | tenor_value | NUMERIC(3,0) | Y | Direct Mapping | -`
48. `ABA0001_TENOR_UNIT | CHAR(1) | Y | Y | tenor_unit | VARCHAR(1) | N | Direct Mapping | -`
49. `ABA0001_INT_PAID_IND | CHAR(1) | Y | Y | int_paid_ind | VARCHAR(1) | Y | Direct Mapping | -`
50. `- | - | - | - | N | meps_tenor | NUMERIC(3,0) | Y | Map to NULL | Only applicable specifically to OMEGA `

### 3.4 MAS-OMEGA-ISSCAL-001 (17 data rows, target `iss.iss_calendar_listing`)

Note: Source Nullable column uses `Y/N`, not `NULL/NOT NULL`, on this sheet specifically (inconsistent with ISSCAL-002 etc.).

1. `ABA0021_ISSUE_CALENDAR | ABA0021_ISSUE_DATETIME | DATE | Y | Y | iss.iss_calendar_listing | year | NUMERIC(4,0) | N | To select distinct and map to year extracted from Issue Datetime | There should only be one record migrated per year.`
2. `ABA0021_ISSUE_CALENDAR | ABA0021_ISSUE_TYPE | VARCHAR2(1) | Y | Y | iss.iss_calendar_listing | security_type | VARCHAR(50) | N | Transformation:\n\nIF 'T' -> 'SECTYPE_TBILL' \nIF 'B' or 'I' or 'G' -> 'SECTYPE_SGS' | Transformed into OMEGA specific mastercode`
3. `- | - | - | - | Y | iss.iss_calendar_listing | publication_dt | TIMESTAMP | Y | Map to NULL | The issue calendar publication date is stored as part of audit table under ABA0023_AUDIT_ACTION, propose to map this to NULL for migrated records`
4. `- | - | - | - | Y | iss.iss_calendar_listing | period | VARCHAR(50) | N | Map to constant value: 'CALPERIOD_YEARLY' | -`
5. `- | - | - | - | Y | iss.iss_calendar_listing | status | VARCHAR(50) | N | Map to constant value: 'ISSCALSTAT_PUBLISHED' | -`
6. `- | - | - | - | Y | iss.iss_calendar_listing | version | NUMERIC(5,0) | NOT NULL | Map to constant value: 1 | -` *(NN col here uses `NOT NULL` literal — inconsistent with `N` elsewhere on this sheet)*
7. `ABA0021_ISSUE_CALENDAR | ABA0021_SECURITY_CODE | VARCHAR2(8) | N | N | - | - | - | - | - | Migrated to iss.iss_calendar_data`
8. `ABA0021_ISSUE_CALENDAR | ABA0021_ISSUE_NO | VARCHAR2(1) | N | N | - | - | - | - | - | Not applicable to OMEGA`
9. `ABA0021_ISSUE_CALENDAR | ABA0021_ISIN_CODE | VARCHAR2(12) | Y | N | - | - | - | - | - | Migrated to iss.iss_calendar_data`
10. `ABA0021_ISSUE_CALENDAR | ABA0021_TENOR | NUMBER(3,0) | Y | N | - | - | - | - | - | Migrated to iss.iss_calendar_data`
11. `ABA0021_ISSUE_CALENDAR | ABA0021_TENOR_UNIT | VARCHAR2(1) | Y | N | - | - | - | - | - | Migrated to iss.iss_calendar_data`
12. `ABA0021_ISSUE_CALENDAR | ABA0021_CURR | VARCHAR2(3) | Y | N | - | - | - | - | - | Not applicable to OMEGA`
13. `ABA0021_ISSUE_CALENDAR | ABA0021_NEW_REOPEN | VARCHAR2(1) | Y | N | - | - | - | - | - | Migrated to iss.iss_calendar_data`
14. `ABA0021_ISSUE_CALENDAR | ABA0121_OPEN_DATETIME | DATE | Y | N | - | - | - | - | - | Migrated to iss.iss_calendar_data` *(note: source col is mis-labelled `ABA0121_OPEN_DATETIME` — the SB prefix in an ABA0021 sheet is a typo, kept verbatim)*
15. `ABA0021_ISSUE_CALENDAR | ABA0021_CLOSE_DATETIME | DATE | Y | N | - | - | - | - | - | Migrated to iss.iss_calendar_data`
16. `ABA0021_ISSUE_CALENDAR | ABA0021_FLAG | VARCHAR2(1) | Y | N | - | - | - | - | - | Not applicable to OMEGA`
17. `ABA0021_ISSUE_CALENDAR | ABA0021_PD_ISSUE_TYPE | VARCHAR2(1) | Y | N | - | - | - | - | - | Not applicable to OMEGA`

### 3.5 MAS-OMEGA-ISSCAL-002 (16 data rows, target `iss.iss_calendar_listing` for SB)

Source Nullable here uses `NULL` / `NOT NULL` literals (different from ISSCAL-001's Y/N).

1. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_ISSUE_DATETIME | DATE | NULL | Y | iss.iss_calendar_listing | year | NUMERIC(4,0) | NOT NULL | To select distinct and map to year extracted from Issue Datetime. | There should only be one record migrated per year.`
2. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_ISSUE_TYPE | VARCHAR2(1) | NULL | Y | iss.iss_calendar_listing | security_type | VARCHAR(50) | NOT NULL | Transformation:\n\nIF 'S' -> 'SECTYPE_SSB' | Transformed into OMEGA specific mastercode`
3. `- | - | - | - | Y | iss.iss_calendar_listing | publication_dt | TIMESTAMP | NULL | Map to NULL for migrated records | -`
4. `- | - | - | - | Y | iss.iss_calendar_listing | period | VARCHAR(50) | NOT NULL | Map to constant value: 'CALPERIOD_YEARLY' | -`
5. `- | - | - | - | Y | iss.iss_calendar_listing | status | VARCHAR(50) | NOT NULL | Map to constant value: 'ISSCALSTAT_PUBLISHED' | -`
6. `- | - | - | - | Y | iss.iss_calendar_listing | version | NUMERIC(5,0) | NOT NULL | Map to constant value: 1 | -`
7. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_SECURITY_CODE | VARCHAR2(8) | NOT NULL | N | - | - | - | - | - | Migrated to iss.iss_calendar_data`
8. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_ISSUE_NO | VARCHAR2(1) | NOT NULL | N | - | - | - | - | - | Not applicable to OMEGA`
9. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_ISIN_CODE | VARCHAR2(12) | NULL | N | - | - | - | - | - | Migrated to iss.iss_calendar_data`
10. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_TENOR | NUMBER(3,0) | NULL | N | - | - | - | - | - | Migrated to iss.iss_calendar_data`
11. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_TENOR_UNIT | VARCHAR2(1) | NULL | N | - | - | - | - | - | Migrated to iss.iss_calendar_data`
12. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_CURR | VARCHAR2(3) | NULL | N | - | - | - | - | - | Not applicable to OMEGA`
13. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_NEW_REOPEN | VARCHAR2(1) | NULL | N | - | - | - | - | - | Migrated to iss.iss_calendar_data`
14. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_OPEN_DATETIME | DATE | NULL | N | - | - | - | - | - | Migrated to iss.iss_calendar_data`
15. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_CLOSE_DATETIME | DATE | NULL | N | - | - | - | - | - | Migrated to iss.iss_calendar_data`
16. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_FLAG | VARCHAR2(1) | NULL | N | - | - | - | - | - | Not applicable to OMEGA`

### 3.6 MAS-OMEGA-ISSCAL-003 (16 data rows, target `iss.iss_calendar_data`)

Source Nullable mixed here too: a mix of `N`/`NOT NULL`/`NULL`.

1. `ABA0021_ISSUE_CALENDAR | - | - | - | Y | iss.iss_calendar_data | iss_calendar_listing_uuid | VARCHAR(36) | NOT NULL | Lookup UUID from iss.iss_calendar_listing where year = Extracted Source Year and security_type matches Source logic. | Mandatory linkage to Parent Listing table`
2. `ABA0021_ISSUE_CALENDAR | ABA0021_SECURITY_CODE | VARCHAR2(8) | NOT NULL | Y | iss.iss_calendar_data | security_code | VARCHAR(8) | NULL | Direct Mapping | -`
3. `ABA0021_ISSUE_CALENDAR | ABA0021_ISSUE_NO | VARCHAR2(1) | NOT NULL | N | - | - | - | - | - | Replaced by number of issuances in ississ_issuance table tied under same sec_security_master_uuid` *(typo "ississ_issuance", kept verbatim)*
4. `ABA0021_ISSUE_CALENDAR | ABA0021_ISIN_CODE | VARCHAR2(12) | NULL | Y | iss.iss_calendar_data | isin_code | VARCHAR(12) | NULL | Direct Mapping | -`
5. `ABA0021_ISSUE_CALENDAR | ABA0021_ISSUE_TYPE | VARCHAR2(1) | NULL | Y | iss.iss_calendar_data | security_type | VARCHAR(50) | NOT NULL | Transformation:\n\nIF 'T' -> 'SECTYPE_TBILL'\nIF 'B', 'I', or 'G' -> 'SECTYPE_SGS' | -`
6. `ABA0021_ISSUE_CALENDAR | ABA0021_ISSUE_TYPE | VARCHAR2(1) | NULL | Y | iss.iss_calendar_data | sgs_type | VARCHAR(50) | NULL | Transformation:\n\nIF 'B' -> 'SGSTYPE_MD'\nIF 'I' -> 'SGSTYPE_INFRA'\nIF 'G' -> 'SGSTYPE_GREEN_INFRA'\nIF 'T' -> NULL | Derived from the ABA0021_ISSUE_TYPE column`
7. `- | - | - | - | Y | iss.iss_calendar_data | issuance_type | VARCHAR(50) | NOT NULL | Transformation:\n\nLookup from iss.iss_issuance using composite key (ABA0021_SECURITY_CODE, ABA0021_ISSUE_NO)\n\nIF iss.iss_issuance.issuance_type = 'ISSTYPE_SYNDICATION' -> 'ISSTYPE_SYNDICATION'\nELSE -> 'ISSTYPE_AUCTION' | -`
8. `ABA0021_ISSUE_CALENDAR | ABA0021_TENOR | NUMBER(3,0) | NULL | Y | iss.iss_calendar_data | tenor_value | NUMERIC(3,0) | NULL | Direct Mapping | -`
9. `ABA0021_ISSUE_CALENDAR | ABA0021_TENOR_UNIT | VARCHAR2(1) | NULL | Y | iss.iss_calendar_data | tenor_unit | VARCHAR(1) | NOT NULL | Direct Mapping  | Possible values are \n'Y' - Year\n'M' - Month\n'D' - Day` *(double space after "Mapping ")*
10. `ABA0021_ISSUE_CALENDAR | ABA0021_CURR | VARCHAR2(3) | NULL | N | - | - | - | - | - | Not applicable to OMEGA`
11. `ABA0021_ISSUE_CALENDAR | ABA0021_NEW_REOPEN | VARCHAR2(1) | NULL | Y | iss.iss_calendar_data | new_reopen_flag | VARCHAR(1) | NULL | Direct Mapping  | Possible values are \n'N' - New\n'R' - Reopen`
12. `ABA0021_ISSUE_CALENDAR | ABA0021_OPEN_DATETIME | DATE | NULL | Y | iss.iss_calendar_data | announcement_dt | TIMESTAMP | NULL | Direct Mapping  | -`
13. `ABA0021_ISSUE_CALENDAR | ABA0021_CLOSE_DATETIME | DATE | NULL | Y | iss.iss_calendar_data | auction_dt | TIMESTAMP | NULL | Direct Mapping  | -`
14. `ABA0021_ISSUE_CALENDAR | ABA0021_ISSUE_DATETIME | DATE | NULL | Y | iss.iss_calendar_data | issue_dt | TIMESTAMP | NULL | Direct Mapping  | -`
15. `ABA0021_ISSUE_CALENDAR | ABA0021_FLAG | VARCHAR2(1) | NULL | N | - | - | - | - | - | Not applicable to OMEGA`
16. `ABA0021_ISSUE_CALENDAR | ABA0021_PD_ISSUE_TYPE | VARCHAR2(1) | NULL | N | - | - | - | - | - | Not applicable to OMEGA`

### 3.7 MAS-OMEGA-ISSCAL-004 (17 data rows, target `iss.iss_calendar_data` for SB)

1. `ABA0121_SB_ISSUE_CALENDAR | - | - | - | Y | iss.iss_calendar_data | iss_calendar_listing_uuid | VARCHAR(36) | N | Lookup UUID from iss.iss_calendar_listing where year = extracted Source Year and security_type = 'SECTYPE_SSB'. | Mandatory linkage to Parent Listing table`
2. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_SECURITY_CODE | VARCHAR2(8) | N | Y | iss.iss_calendar_data | security_code | VARCHAR(8) | Y | Direct Mapping | -`
3. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_ISSUE_NO | VARCHAR2(1) | N | N | - | - | - | - | - | Replaced by number of issuances in ississ_issuance table tied under same sec_security_master_uuid`
4. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_ISIN_CODE | VARCHAR2(12) | Y | Y | iss.iss_calendar_data | isin_code | VARCHAR(12) | Y | Direct Mapping | -`
5. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_ISSUE_TYPE | VARCHAR2(1) | Y | Y | iss.iss_calendar_data | security_type | VARCHAR(50) | N | Map to constant value: 'SECTYPE_SSB' | All records in this source table are Savings Bonds`
6. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_ISSUE_TYPE | VARCHAR2(1) | Y | Y | iss.iss_calendar_data | sgs_type | VARCHAR(50) | Y | Map to NULL | Not applicable for Savings Bonds`
7. `- | - | - | - | Y | iss.iss_calendar_data | issuance_type | VARCHAR(50) | N | Map to constant value: 'ISSTYPE_AUCTION' | -`
8. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_TENOR | NUMBER(3,0) | Y | Y | iss.iss_calendar_data | tenor_value | NUMERIC(3,0) | Y | Direct Mapping | -`
9. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_TENOR_UNIT | VARCHAR2(1) | Y | Y | iss.iss_calendar_data | tenor_unit | VARCHAR(1) | N | Direct Mapping | "Possible values are \n'Y' - Year\n'M' - Month\n'D' - Day"` *(remarks wrapped in literal double-quotes — unusual)*
10. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_CURR | VARCHAR2(3) | Y | N | - | - | - | - | - | Not applicable to OMEGA`
11. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_NEW_REOPEN | VARCHAR2(1) | Y | Y | iss.iss_calendar_data | new_reopen_flag | VARCHAR(1) | Y | Direct Mapping | "Possible values are\n'N' - New` *(unterminated quote — content visibly truncated; likely a copy-paste bug in the source spec)*
12. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_OPEN_DATETIME | DATE | Y | Y | iss.iss_calendar_data | announcement_dt | TIMESTAMP | Y | Direct Mapping | -`
13. `- | - | - | - | N | iss.iss_calendar_data | public_offer_start_dt | TIMESTAMP | Y | Map to NULL | -`
14. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_CLOSE_DATETIME | DATE | Y | Y | iss.iss_calendar_data | app_closing_dt | TIMESTAMP | Y | Direct Mapping | -`
15. `c | - | - | - | - | N | iss.iss_calendar_data | auction_dt | TIMESTAMP | Y | Transformation:\n\nLookup from ABA0101_SB_SECURITY_MASTER using composite key (ABA0121_SECURITY_CODE, ABA0121_ISSUE_NO)\n\nResult -> ABA0101_TENDER_DATE | -` *(Module ID col contains stray `c` — typo, kept verbatim)*
16. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_ISSUE_DATETIME | DATE | Y | Y | iss.iss_calendar_data | issue_dt | TIMESTAMP | Y | Direct Mapping | -`
17. `ABA0121_SB_ISSUE_CALENDAR | ABA0121_FLAG | VARCHAR2(1) | Y | N | - | - | - | - | - | Not applicable to OMEGA`

### 3.8 MAS-OMEGA-ISSANN-001 (31 data rows, target `iss.iss_announcement_details`)

1. `ABA0001_SECURITY_MASTER | - | - | - | N | iss.iss_announcement_details | iss_calendar_data_uuid | VARCHAR(36) | NOT NULL | Lookup UUID from iss.iss_calendar_data where security_code matches composite key (ABA0001_SECURITY_CODE + ABA0001_ISSUE_NO) | Mandatory linkage to Calendar Data.`
2. `ABA0001_SECURITY_MASTER | - | - | - | N | iss.iss_announcement_details | iss_issuance_uuid | VARCHAR(36) | NULL | Lookup UUID from iss.iss_issuance where security_code matches composite key (ABA0001_SECURITY_CODE + ABA0001_ISSUE_NO) | -`
3. `ABA0001_SECURITY_MASTER | ABA0001_SECURITY_CODE | VARCHAR2(8) | NOT NULL | Y | iss.iss_announcement_details | security_code | VARCHAR(8) | NOT NULL | Direct Mapping | -`
4. `ABA0001_SECURITY_MASTER | ABA0001_ISIN_CODE | VARCHAR2(12) | NULL | Y | iss.iss_announcement_details | isin_code | VARCHAR(12) | NOT NULL | Direct Mapping | -`
5. `ABA0001_SECURITY_MASTER | ABA0001_SECURITY_CODE | VARCHAR2(8) | NOT NULL | Y | iss.iss_announcement_details | security_type | VARCHAR(50) | NULL | Transformation:\n\n<same security_type prefix logic as SECMST-002 row 4> | -`
6. `ABA0001_SECURITY_MASTER | ABA0001_TENDER_DATE | DATE | N | Y | iss.iss_announcement_details | issuance_type | VARCHAR(50) | NULL | Transformation:\n\nWHEN ABA0001_TENDER_DATE < ABA0001_ANNOUNCE_DATE THEN 'ISSTYPE_SYNDICATION': | -`
7. `- | - | - | - | N | iss.iss_announcement_details | sgs_type | VARCHAR(50) | NULL | Lookup iss.iss_calendar_data via iss_calendar_data_uuid established to map to sgs_type | -`
8. `ABA0001_SECURITY_MASTER | ABA0001_ISSUE_NO | CHAR(1) | N | Y | iss.iss_announcement_details | new_reopen_flag | VARCHAR(1) | Y | Transformation:\n\nIF '1' -> 'N'\nELSE -> 'R' | Any ABA0001_ISSUE_NO > 1 indicates its an reopen issue`
9. `ABA0001_SECURITY_MASTER | ABA0001_BENCHMARK_IND | CHAR(1) | NULL | Y | iss.iss_announcement_details | is_benchmark | VARCHAR(1) | NULL | Direct Mapping | -`
10. `ABA0001_SECURITY_MASTER | ABA0001_TENOR | NUMBER(3,0) | NULL | Y | iss.iss_announcement_details | tenor_value | NUMERIC(3,0) | NULL | Direct Mapping | -`
11. `ABA0001_SECURITY_MASTER | ABA0001_TENOR_UNIT | VARCHAR2(1) | NULL | Y | iss.iss_announcement_details | tenor_unit | VARCHAR(1) | NULL | Direct Mapping | Possible values are \n'Y' - Year\n'M' - Month\n'D' - Day"` *(stray closing double-quote)*
12. `ABA0001_SECURITY_MASTER | ABA0001_ANNOUNCE_DATE | DATE | NULL | Y | iss.iss_announcement_details | announcement_dt | TIMESTAMP | NULL | Direct Mapping | -`
13. `- | - | - | - | N | iss.iss_announcement_details | publication_dt | TIMESTAMP | NULL | Map to NULL | The issue calendar publication date is stored as part of audit table under ABA0023_AUDIT_ACTION, propose to map this to NULL for migrated records`
14. `ABA0001_SECURITY_MASTER | ABA0001_TENDER_DATE | DATE | NOT NULL | Y | iss.iss_announcement_details | auction_dt | TIMESTAMP | NULL | Direct Mapping | -`
15. `ABA0001_SECURITY_MASTER | ABA0001_ISSUE_DATE | DATE | NOT NULL | Y | iss.iss_announcement_details | issue_dt | TIMESTAMP | NOT NULL | Direct Mapping | -`
16. `ABA0001_SECURITY_MASTER | ABA0001_MATURITY_DATE | DATE | NOT NULL | Y | iss.iss_announcement_details | maturity_dt | TIMESTAMP | NOT NULL | Direct Mapping | -`
17. `ABA0001_SECURITY_MASTER | ABA0001_FIRST_CPN_PAYM_DATE | DATE | NULL | Y | iss.iss_announcement_details | first_coupon_payment_dt | TIMESTAMP | NULL | Direct Mapping | -`
18. `ABA0001_SECURITY_MASTER | ABA0001_NEXT_INT_DATE | DATE | NULL | Y | iss.iss_announcement_details | next_coupon_payment_dt | TIMESTAMP | NULL | Direct Mapping | -`
19. `- | - | - | - | N | iss.iss_announcement_details | pricing_dt | TIMESTAMP | NULL | TBD  | For Syndication, will provide the mapping in next revision.`
20. `ABA0001_SECURITY_MASTER | ABA0001_ANNOUNCE_DATE | DATE | NULL | Y | iss.iss_announcement_details | public_offer_start_dt | TIMESTAMP | NULL | TBD  | For Syndication, will provide the mapping in next revision.`
21. `ABA0001_SECURITY_MASTER | ABA0001_TENDER_DATE | DATE | NOT NULL | Y | iss.iss_announcement_details | public_offer_end_dt | TIMESTAMP | NULL | TBD  | For Syndication, will provide the mapping in next revision.`
22. `ABA0001_SECURITY_MASTER | ABA0001_TENDER_DATE | DATE | NOT NULL | Y | iss.iss_announcement_details | app_closing_dt | TIMESTAMP | NULL | TBD | -` *(single-trailing-space TBD; the others above use 2 trailing spaces — inconsistent whitespace)*
23. `ABA0001_SECURITY_MASTER | ABA0001_ISSUE_SIZE | NUMBER(13,0) | NOT NULL | Y | iss.iss_announcement_details | total_amount_offered | NUMERIC(13,0) | NOT NULL | Direct Mapping | -`
24. `ABA0001_SECURITY_MASTER | ABA0001_MAS_APPLIED | NUMBER(13,0) | NULL | Y | iss.iss_announcement_details | mas_intended_tender_amount | NUMERIC(13,0) | NULL | Direct Mapping | -`
25. `ABA0001_SECURITY_MASTER | ABA0001_INTEREST_RATE | NUMBER(7,4) | NULL | Y | iss.iss_announcement_details | coupon_rate | NUMBER(7,4) | NULL | Direct Mapping | -` *(target datatype written as `NUMBER(7,4)` here — stray Oracle syntax in OMEGA target column; likely typo, should probably be `NUMERIC(7,4)`)*
26. `ABA0001_SECURITY_MASTER | ABA0001_ACCRUED_INT_DAYS | NUMBER(3,0) | NULL | Y | iss.iss_announcement_details | accrued_interest_days | NUMERIC(3,0) | NULL | Direct Mapping | -`
27. `- | - | - | - | N | iss.iss_announcement_details | footnotes | VARCHAR(10000) | NOT NULL | TBD | Footnotes is current stored as config in legacy eApps system, to discuss and decide whether to migrate footnotes for legacy records`
28. `- | - | - | - | N | iss.iss_announcement_details | remarks | VARCHAR(4000) | NULL | Map to NULL | Not applicable in legacy eApps system`
29. `- | - | - | - | N | iss.iss_announcement_details | status | VARCHAR(50) | NULL | Transformation:\n\nIF 'Y' -> 'PUBLISHED'\nIF 'N' -> 'TBD' | -`
30. `- | - | - | - | N | iss.iss_announcement_details | user_action | VARCHAR(50) | NULL | Map to NULL | Not applicable in legacy eApps system`
31. `- | - | - | - | N | iss.iss_announcement_details | is_published_immediately | VARCHAR(1) | NULL | Map to NULL | Not applicable in legacy eApps system`

### 3.9 MAS-OMEGA-BIDCOL-001 (21 data rows, target `iss.iss_bid_retail`)

1. `ABA0007_DETAIL_AUCTION_RESULT | ABA0007_SECURITY_CODE | VARCHAR2(8) | N | Y | iss.iss_bid_retail | iss_issuance_uuid | VARCHAR(36) | N | Lookup iss.iss_issuance.uuid where security_code matches ABA0007_SECURITY_CODE and ABA0007_ISSUE_NO. | Mandatory Linkage. To ensure iss_issuance is migrated first.`
2. `ABA0007_DETAIL_AUCTION_RESULT | ABA0007_PRI_DLR_CODE | NUMBER(4) | N | Y | iss.iss_bid_retail | cm_bank_master_uuid | VARCHAR(36) | N | Lookup cm.cm_bank_master.uuid where bank_code matches ABA0007_PRI_DLR_CODE. | -`
3. `- | - | - | - | N | iss.iss_bid_retail | iss_bid_file_registry_uuid | VARCHAR(36) | Y | Map to NULL | Propose to skip physical file migration as currently the interface bids are stored in both ABA0005_RSA_TEXT_ENC_TRANS & ABA0035_RETAILBID_FILE, OMEGA is currently storing as S3 File and the bids records will be extracted and parsed into the respective staging tables`
4. `- | - | - | - | N | iss.iss_bid_retail | iss_allotment_run_uuid | VARCHAR(36) | Y | Map to NULL | Not applicable to legacy eApps schema`
5. `ABA0007_DETAIL_AUCTION_RESULT | ABA0007_BANK_REF_NO | VARCHAR2(12) | Y | Y | iss.iss_bid_retail | bank_ref_no | VARCHAR(16) | N | Direct Mapping | -`
6. `ABA0007_DETAIL_AUCTION_RESULT | ABA0007_IC_PASSPORT | VARCHAR2(14) | Y | Y | iss.iss_bid_retail | nric_passport | VARCHAR(20) | N | Direct Mapping | -`
7. `ABA0007_DETAIL_AUCTION_RESULT | ABA0007_NAME_OF_APPLN | VARCHAR2(30) | Y | Y | iss.iss_bid_retail | applicant_name | VARCHAR(100) | N | Direct Mapping | -`
8. `ABA0007_DETAIL_AUCTION_RESULT | ABA0007_NATIONALITY | VARCHAR2(1) | Y | Y | iss.iss_bid_retail | nationality_code | VARCHAR(2) | N | Transformation:\n\nIF 'S' -> 'NATIONLTY_SG_CITIZEN'\nIF 'P' -> 'NATIONLTY_SG_PR'\nIF 'F' -> 'NATIONLTY_FOREIGNER' | Transformed into OMEGA specific mastercode`
9. `ABA0007_DETAIL_AUCTION_RESULT | ABA0007_CDP_ACC_NO | VARCHAR2(16) | Y | Y | iss.iss_bid_retail | cdp_account_no | VARCHAR(16) | Y | Direct Mapping | Only populated if Application Type is CASH.`
10. `ABA0007_DETAIL_AUCTION_RESULT | ABA0007_CPF_ACNO | CHAR(16) | Y | Y | iss.iss_bid_retail | cpf_srs_account_no | VARCHAR(16) | Y | Direct Mapping | Only populated if Application Type is CPFIS/SRS.`
11. `ABA0007_DETAIL_AUCTION_RESULT | ABA0007_TYPE_OF_APPLN | VARCHAR2(3) | Y | Y | iss.iss_bid_retail | type_of_applicant | VARCHAR(50) | Y | Transformation:\n\nIF 'IND' -> 'APPLNTYPE_IND' | Only records with ABA0007_TYPE_OF_APPLN = 'IND' will be inserted into iss.iss_bid_retail`
12. `ABA0007_DETAIL_AUCTION_RESULT | ABA0007_APPLIED_AMT | NUMBER(11) | Y | Y | iss.iss_bid_retail | nominal_amount | NUMERIC(13,0) | N | Direct Mapping | -`
13. `ABA0007_DETAIL_AUCTION_RESULT | ABA0007_COMP_NONCOMP | VARCHAR2(1) | Y | Y | iss.iss_bid_retail | is_competitive | VARCHAR(1) | Y | Transformation:\n\nIF 'C' -> 'Y',\nELSE -> 'N' | -` *(stray comma after 'Y')*
14. `ABA0007_DETAIL_AUCTION_RESULT | ABA0007_BID_YIELD | NUMBER(5,2) | Y | Y | iss.iss_bid_retail | bid_yield | NUMERIC(5,2) | Y | Direct Mapping | -`
15. `- | - | - | - | N | iss.iss_bid_retail | application_source | VARCHAR(50) | N | Default map to 'APPSRC_INTERFACE' | To consider legacy file uploads as Interface submissions`
16. `ABA0007_DETAIL_AUCTION_RESULT | ABA0007_SUB_MTD | CHAR(1) | Y | Y | iss.iss_bid_retail | submission_method | VARCHAR(50) | N | Transformation:\n\nIF 'A' -> 'ISSSUBMTH_A'\nIF 'B' -> 'ISSSUBMTH_B'\nIF 'C' -> 'ISSSUBMTH_C'\nIF 'M' -> 'ISSSUBMTH_M' | Only submission types with ABA0007_TYPE_OF_APPLN = 'IND' will be pushed into iss.iss_bid_retail`
17. `ABA0007_DETAIL_AUCTION_RESULT | ABA0007_CUST_BANK_BC | VARCHAR2(1) | Y | Y | iss.iss_bid_retail | custody_code | VARCHAR(50) | Y | Transformation:\n\nIF 'C' -> 'CUSTCD_CUS'\nIF 'B' -> 'CUSTCD_TRD' | Transformed into OMEGA specific mastercode`
18. `- | - | - | - | N | iss.iss_bid_retail | status | VARCHAR(50) | N | Default map to 'BIDCOLSTAT_CLOSED' | -`
19. `ABA0007_DETAIL_AUCTION_RESULT | ABA0007_ALLOTED_AMT | NUMBER(11) | Y | Y | iss.iss_bid_retail | allotted_amount | NUMERIC(13,0) | Y | Direct Mapping | -`
20. `- | - | - | - | - | iss.iss_bid_retail | accepted_amount | NUMERIC(13,0) | Y | Map to NULL | This is amount calculated for auction run purposes. Propose to keep NULL for legacy migrated records` *(To-migrate cell is `-` instead of Y/N — anomaly)*
21. `ABA0007_DETAIL_AUCTION_RESULT | ABA0007_SETTLEMENT_AMT | NUMBER(15,2) | Y | Y | iss.iss_bid_retail | settlement_amount | NUMBER(15,2) | Y | Direct Mapping | -` *(target datatype again written as `NUMBER(15,2)` — Oracle syntax leak)*

### 3.10 MAS-OMEGA-BIDCOL-002 (3 data rows; partial draft, target `iss.iss_bid_retail`)

The banner cell A1 says `MAS-OMEGA-BIDCOL-001` (typo) but the rows reference `MAS-OMEGA-BIDCOL-002`. Only 3 data rows ship — clearly a partial draft for the supplemental retail-bid mapping.

1. `MAS-OMEGA-BIDCOL-002 | ABA0004_RETAIL_BID_TRANS | ABA0004_BANK_REF_NO\nABA0004_RECEIVED_DATE\nABA0004_FILE_TYPE | - | - | Y | iss.iss_bid_retail | submission_ref_uuid | VARCHAR(36) | Y | To assign a grouping submission_ref_uuid using identifier below\n\n(SUBSTR(ABA0004_BANK_REF_NO, 1, 4) + ABA0004_RECEIVED_DATE + ABA0004_FILE_TYPE) | Used to group bids under a unique Submission ID (Batch) as legacy did not have a single UUID for this.`
2. `MAS-OMEGA-BIDCOL-002 | ABA0004_RETAIL_BID_TRANS | ABA0004_FILE_TYPE | VARCHAR2(3) | N | Y | iss.iss_bid_retail | application_type | VARCHAR(50) | Y | Transformation:\n\nIF 'AP1' -> 'APPTYPE_CASH'\nIF 'AP2' -> 'APPTYPE_CPFIS'\nIF 'AP3' -> 'APPTYPE_SRS' | Transformed into OMEGA specific mastercode`
3. `MAS-OMEGA-BIDCOL-002 | ABA0004_RETAIL_BID_TRANS | ABA0004_RECEIVED_DATE | DATE | Y | Y | iss.iss_bid_retail | received_dt | TIMESTAMP | Y | Transformation: \n\nExtract and merge ABA0004_RECEIVED_DATE + ABA0004_RECEIVED_TIME | -`

### 3.11 MAS-OMEGA-BIDCOL-003 (17 data rows, target `iss.iss_bid_institutional`)

Banner row says `MAS-OMEGA-BIDCOL-002` (typo). All Module-ID column values say `MAS-OMEGA-BIDCOL-001` (also a copy-paste typo) — the *real* module ID for these rows is BIDCOL-003. Kept verbatim below.

1. `MAS-OMEGA-BIDCOL-001 | ABA0007_DETAIL_AUCTION_RESULT | ABA0007_SECURITY_CODE | VARCHAR2(8) | N | Y | iss.iss_bid_institutional | iss_issuance_uuid | VARCHAR(36) | N | Lookup iss.iss_issuance.uuid where security_code matches ABA0007_SECURITY_CODE and ABA0007_ISSUE_NO. | Mandatory Linkage. To ensure iss_issuance is migrated first.`
2. `MAS-OMEGA-BIDCOL-001 | ABA0007_DETAIL_AUCTION_RESULT | ABA0007_PRI_DLR_CODE | NUMBER(4) | N | Y | iss.iss_bid_institutional | cm_bank_master_uuid | VARCHAR(36) | N | Lookup cm.cm_bank_master.uuid where bank_code matches ABA0007_PRI_DLR_CODE. | -`
3. `MAS-OMEGA-BIDCOL-001 | - | - | - | - | Y | iss.iss_bid_institutional | iss_bid_file_registry_uuid | VARCHAR(36) | Y | Map to NULL | -` *(unique here: To-migrate is Y but mapping is NULL — anomaly relative to the BIDCOL-001 sibling row, which is N)*
4. `MAS-OMEGA-BIDCOL-001 | - | - | - | - | N | iss.iss_bid_institutional | iss_allotment_run_uuid | VARCHAR(36) | Y | Map to NULL | Not applicable to legacy eApps schema.`
5. `MAS-OMEGA-BIDCOL-001 | ABA0007_DETAIL_AUCTION_RESULT | ABA0007_BANK_REF_NO\nABA0007_TENDER_DATE | - | - | Y | iss.iss_bid_institutional | submission_ref_uuid | VARCHAR(36) | Y | To assign a grouping submission_ref_uuid using identifier below\n\n(SUBSTR(ABA0007_BANK_REF_NO, 1, 4) + ABA0007_TENDER_DATE) | Used to group bids under a unique Submission ID. For institutional, the Bank Ref No is unique per submission form.`
6. `MAS-OMEGA-BIDCOL-001 | ABA0007_DETAIL_AUCTION_RESULT | ABA0007_BANK_REF_NO | VARCHAR2(12) | Y | Y | iss.iss_bid_institutional | bank_ref_no | VARCHAR(16) | N | Direct Mapping | -`
7. `MAS-OMEGA-BIDCOL-001 | ABA0007_DETAIL_AUCTION_RESULT | ABA0007_NAME_OF_APPLN | VARCHAR2(30) | Y | Y | iss.iss_bid_institutional | applicant_name | VARCHAR(100) | N | Direct Mapping | -`
8. `MAS-OMEGA-BIDCOL-001 | ABA0007_DETAIL_AUCTION_RESULT | ABA0007_TYPE_OF_APPLN | VARCHAR2(3) | Y | Y | iss.iss_bid_institutional | type_of_applicant | VARCHAR(50) | Y | Transformation:\n\nIF 'PD' -> 'APPLNTYPE_PD'\nIF 'FB' -> 'APPLNTYPE_FB'\nIF 'RB' -> 'APPLNTYPE_RB'\nIF 'OB' -> 'APPLNTYPE_OB'\nIF 'NB' -> 'APPLNTYPE_NB'\nIF 'MB' -> 'APPLNTYPE_MB'\nIF 'IA' -> 'APPLNTYPE_IA'\nIF 'FC' -> 'APPLNTYPE_FC'\nIF 'INS' -> 'APPLNTYPE_INS'\nIF 'SB' -> 'APPLNTYPE_SB'\nIF 'SGX' -> 'APPLNTYPE_SGX'\nIF 'MAS' -> 'APPLNTYPE_MAS'\nELSE -> 'APPLNTYPE_OTH' | Only submission types with ABA0007_TYPE_OF_APPLN = 'IND' will be pushed into iss.iss_bid_institutional` *(remark says 'IND' but logic is the inverse — likely copy/paste error)*
9. `MAS-OMEGA-BIDCOL-001 | ABA0007_DETAIL_AUCTION_RESULT | ABA0007_APPLIED_AMT | NUMBER(11) | Y | Y | iss.iss_bid_institutional | nominal_amount | NUMERIC(13,0) | N | Direct Mapping | -`
10. `MAS-OMEGA-BIDCOL-001 | ABA0007_DETAIL_AUCTION_RESULT | ABA0007_COMP_NONCOMP | VARCHAR2(1) | Y | Y | iss.iss_bid_institutional | is_competitive | VARCHAR(1) | Y | Transformation:\n\nIF 'C' -> 'Y',\nELSE -> 'N' | -`
11. `MAS-OMEGA-BIDCOL-001 | ABA0007_DETAIL_AUCTION_RESULT | ABA0007_BID_YIELD | NUMBER(5,2) | Y | Y | iss.iss_bid_institutional | yield_pct | NUMERIC(5,2) | Y | Direct Mapping | -`
12. `MAS-OMEGA-BIDCOL-001 | ABA0007_DETAIL_AUCTION_RESULT | ABA0007_CUST_BANK_CODE | NUMBER(4) | Y | Y | iss.iss_bid_institutional | settlement_bank_code | VARCHAR(4) | N | Direct Mapping | -`
13. `MAS-OMEGA-BIDCOL-001 | ABA0007_DETAIL_AUCTION_RESULT | ABA0007_CUST_BANK_BC | VARCHAR2(1) | Y | Y | iss.iss_bid_institutional | custody_code | VARCHAR(50) | Y | Transformation:\n\nIF 'C' -> 'CUSTCD_CUS'\nIF 'B' -> 'CUSTCD_TRD' | Transformed into OMEGA specific mastercode`
14. `MAS-OMEGA-BIDCOL-001 | ABA0007_DETAIL_AUCTION_RESULT | ABA0007_SUB_MTD | CHAR(1) | Y | Y | iss.iss_bid_institutional | submission_method | VARCHAR(50) | N | Transformation:\n\nIF 'E' -> 'ISSSUBMTH_E'\nIF 'M' -> 'ISSSUBMTH_M' | Transformed into OMEGA specific mastercode\n\nOnly institutional bids with 'E' (Electronic/Web) or 'M' (Manual Contingency) will be migrated into iss.iss_bid_institutional`
15. `MAS-OMEGA-BIDCOL-001 | - | - | - | - | N | iss.iss_bid_institutional | application_source | VARCHAR(50) | N | Default map to 'APPSRC_MANUAL ENTRY' | Assuming majority of institutional bids are web-entered.` *(constant has a literal space: `APPSRC_MANUAL ENTRY` — likely should be `APPSRC_MANUAL_ENTRY`; the space is in the source)*
16. `MAS-OMEGA-BIDCOL-001 | ABA0007_DETAIL_AUCTION_RESULT | ABA0007_ALLOTED_AMT | NUMBER(11) | Y | Y | iss.iss_bid_institutional | allotted_amount | NUMERIC(13,0) | Y | Direct Mapping | -`
17. `MAS-OMEGA-BIDCOL-001 | ABA0007_DETAIL_AUCTION_RESULT | ABA0007_SETTLEMENT_AMT | NUMBER(15,2) | Y | Y | iss.iss_bid_institutional | settlement_amount | NUMERIC(13,0) | Y | Direct Mapping | -`

---

## 4. Inventory tab (workbook label: `List of Source Tables`)

145 data rows. Header: `No. | Table Name | Module / Domain | Source Schema | To Migrate | Migrate in`. Two trailing spacer columns (G, H) are blank — the printable area is 6 cols.

Rows are grouped by `Module / Domain` (no explicit group separators — the rows are simply sorted such that all "Daily Price" rows appear together, then "eApps", "ERF", "MLOG", "SBA", "Syndication", "System Batch Job"). The `No.` column is **not contiguous** — it is the table's index in some other master list (e.g. row 1 is `No. 14 / ABA0011_DAILY_PRICE` and the numbers jump non-monotonically; the order in this sheet is by domain group first, then by `No.`).

| To Migrate values seen | Count |
|---|---|
| `Y` | 51 |
| `N` | 30 |
| `TBD` | 64 (mostly SBA + Syndication) |

| Migrate in values | Count |
|---|---|
| `R1` | ~115 (eApps, SBA, Syndication, System Batch Job) |
| `R2` | ~30 (Daily Price, ERF) |

(The full 145-row dump is in `_raw-dump.txt` r047–r192.)

### Sample rows for style reference

- `14 | ABA0011_DAILY_PRICE | Daily Price | MNETD | Y | R2`
- `1  | ABA0001_SECURITY_MASTER | eApps | MNETD & PRI1 | Y | R1`
- `9  | ABA0008_STAGE_SECURITY_MASTER | eApps | MNETD | TBD | R1`
- `41 | ABA0101_SB_SECURITY_MASTER | SBA | MNETD | TBD | R1`
- `137| BATCH_JOB_EXECUTION | System Batch Job | PRI1 | N | R1`

Source-schema values are: `MNETD`, `PRI1`, `MNETD & PRI1` (with literal spaces around `&`).

---

## 5. Codes tab — verbatim

5 rows, label-then-values style. The first column is a "row label" rather than a header value.

```
title2      | Requirement ID | Service Req No
test_script | UT | SIT | SSAT | Performance Test | Security Test | Pre-UAT | UAT
test_type   | Boundary Testing | Business Rule | Data Validation | Date Range Validation | Mandatory Field Validation | Storage Testing | UI Validation
flow_type   | Positive Testing | Negative Testing
test_crit   | High | Medium | Low
```

This sheet is a leftover from a test-plan template; nothing in the mapping sheets references it. Sample.cjs reproduces it verbatim — keep as-is.

---

## 6. Voice & style analysis (Transformation Logic and Remarks)

### Phrase patterns

1. **Direct Mapping** — Used whenever target value = source column with no transform. Title Case, no period, no quotes. Often followed by Remarks `-` (single hyphen meaning "no further note"). Sometimes written `Direct Mapping ` (single trailing space) or `Direct Mapping  ` (double trailing space) — the source spec is **inconsistent on trailing whitespace**, so don't normalise blindly.
2. **Map to NULL** — for unconditional NULL writes. Title Case, no period.
3. **Map to constant value: '<CONSTANT>'** — the constant is single-quoted (with a literal `'`), Master-Code style ALL_CAPS_SNAKE prefixed with a domain abbreviation (e.g. `'CALPERIOD_YEARLY'`, `'ISSCALSTAT_PUBLISHED'`, `'SECTYPE_SSB'`). Numeric constants are written without quotes: `Map to constant value: 1`.
4. **Default map to '<CONSTANT>'** — used when the value is a sensible default rather than a hard requirement. Same single-quote convention. Sometimes followed by a Remarks justification (`To consider legacy file uploads as Interface submissions`).
5. **Generate UUID:** — followed by a colon, a space, and a description. `Generate UUID: Create a unique UUID for every distinct SECURITY_CODE.` and `Generate UUID: Create a new UUID for every unique combination of SECURITY_CODE + ISSUE_NO.`
6. **Lookup ...** — for FK linkage. Two visible patterns:
   - `Lookup: Query <schema.table.uuid> where <col> matches <SOURCE_COL>.` (with leading `Lookup:` header)
   - `Lookup <schema.table.uuid> where <col> matches <SOURCE_COL>.` (no colon)
   - `Lookup UUID from <schema.table> where <predicate>.` — the most common form. Final period sometimes present, sometimes not.
7. **Transformation:\n\n<conditions>** — multi-condition logic. The literal token `Transformation:` is followed by **two newlines** (blank line) and then a list. Conditions are line-separated, each line is one rule:
   - `IF <predicate> -> '<value>'`
   - `IF <col> Starts with 'X' -> '<value>'`
   - `IF <col> Starts with 'X' AND 4th last char is '2' -> '<value>'`
   - `ELSE -> '<value>'` (catch-all, always last)
   - `WHEN <predicate> THEN '<value>'` (Oracle CASE-style — used in 2 places)
   - Mixed within a single block is fine, but the predominant form is `IF ... -> '...'`.
8. **TBD / TBC** — literal text in the cell, not a fill color. `TBD` (3 chars) is by far the more common; `TBC` appears only in the sample.cjs example, not in v0.01 (sample.cjs got the abbreviation slightly wrong). Watch for `TBD ` / `TBD  ` (1 or 2 trailing spaces).
9. **Refer to MAS-OMEGA-...** — appears in the sample.cjs example but **does not appear** in v0.01. The v0.01 spec uses `Migrated to <table>` or `Replaced by <description>` instead.
10. **Remarks vocabulary** — Title-Case sentence fragments. Frequent leads: `Mandatory linkage to ...`, `Mandatory Foreign Key. ...`, `Transformed into OMEGA specific mastercode`, `Possible values are \n'<v>' - <Label>\n...`, `Only populated if <condition>.`, `Not applicable to OMEGA`, `Not applicable in legacy eApps system`, `Only applicable specifically to OMEGA`. Periods are inconsistent — sometimes ending with `.`, sometimes not.
11. **Capitalization** — Mastercode values are ALL_CAPS_SNAKE (`SECTYPE_SGS`, `APPLNTYPE_PD`, `BIDCOLSTAT_CLOSED`). Source columns are ALL_CAPS_SNAKE with the table prefix (`ABA0001_SECURITY_CODE`). Target columns are lower_snake_case (`security_code`, `iss_calendar_listing_uuid`). Schema names are lower_case_dotted (`iss.iss_calendar_listing`). Datatypes for source use Oracle conventions (`VARCHAR2`, `NUMBER`, `CHAR`, `DATE`); for target, OMEGA conventions (`VARCHAR`, `NUMERIC`, `TIMESTAMP`) — but **two leak rows write `NUMBER(7,4)` and `NUMBER(15,2)` for the target**, which are typos.
12. **Multi-condition layout** — newline-separated within the cell using Excel-native wraps. The standard separator between the header and the rules is **two `\n`s** (one blank line). Between subsequent rules: a single `\n`. Yields a tidy two-section block:
    ```
    Transformation:

    IF X -> 'A'
    IF Y -> 'B'
    ELSE -> 'C'
    ```

### 5+ exemplar phrases (verbatim)

Use these as a copy-paste style baseline:

- `Direct Mapping`
- `Map to NULL`
- `Map to constant value: 'CALPERIOD_YEARLY'`
- `Default map to 'APPSRC_INTERFACE'`
- `Generate UUID: Create a new UUID for every unique combination of SECURITY_CODE + ISSUE_NO.`
- `Lookup UUID from iss.iss_calendar_listing where year = Extracted Source Year and security_type matches Source logic.`
- `Lookup cm.cm_bank_master.uuid where bank_code matches ABA0007_PRI_DLR_CODE.`
- `Transformation:\n\nIF Starts with 'BA' -> 'SECTYPE_CMTB'\nIF Starts with 'B' (and not 'BA') -> 'SECTYPE_TBILL'\n... \nIF Starts with 'M' (and not 'M1') -> 'SECTYPE_MASBILL'`
- `Transformation:\n\nIF '1' -> 'N'\nELSE -> 'R'`
- `To select distinct and map to year extracted from Issue Datetime`
- `To assign a grouping submission_ref_uuid using identifier below\n\n(SUBSTR(ABA0004_BANK_REF_NO, 1, 4) + ABA0004_RECEIVED_DATE + ABA0004_FILE_TYPE)`
- `Transformed into OMEGA specific mastercode`
- `Mandatory linkage to Parent Listing table`
- `For Syndication, will provide the mapping in next revision.`
- `Not applicable to OMEGA`
- `Migrated to iss.iss_calendar_data`
- `Replaced by number of issuances in ississ_issuance table tied under same sec_security_master_uuid`

### Tone summary

- Telegraphic, gerund- or imperative-led sentence fragments (`To migrate ...`, `Lookup ...`, `Map to ...`, `Direct Mapping`).
- Code identifiers and constants always in their native casing; surrounding prose in Title Case for the lead word, sentence case otherwise.
- Periods optional; trailing whitespace common (don't be fussy).
- Multi-condition logic always uses the `Transformation:\n\n<rules>` block; never inline `CASE WHEN` SQL within a single line.
- When something is not migrated, the **Source Datatype, Source Nullable, Target Table, Target Column, Target Datatype, Target Nullable, Transformation/Mapping Logic** cells all use a single-character `-`. Remarks gives the why.

---

## 7. Drift between sample.cjs and v0.01

### Things sample.cjs got wrong or missed

| Area | sample.cjs assumed | v0.01 actual |
|---|---|---|
| Inventory sheet name | `Inventory` (implicit in the variable name; whatever the builder emits) | `List of Source Tables` |
| Inventory row count | 4 stub rows | 145 rows |
| Inventory schema column values | mixes `MNETD`, `MNETD & PRI1` | also `PRI1` (PRI1-only tables exist) |
| Inventory `toMigrate` | only `Y` examples | also `N` and `TBD` are used |
| Migration Summary | 11 rows, mostly correct | matches; minor: real Filter for SECMST-001 ends with `... per security ` (truncated mid-sentence in source). Sample's `... per security_code.` is an interpretation. |
| BIDCOL-002 filter | uses `+` between cols | matches; v0.01 has 3 cols (`+ ABA0004_FILE_TYPE`), sample has 2 |
| Mapping sheet completeness | 5 sheets stubbed, 2 sheets (ISSCAL-001 and ISSCAL-003) partially filled with sample rows | every sheet has full real data (10–50 data rows each) — sample is missing ~95 % of mappings |
| `__tbc=true` flag | sample sets this on ISSCAL-003 row 3 (`issuance_type` row) | **No yellow fills exist in v0.01.** TBC/TBD is conveyed by the literal cell text `TBD` (often `TBD ` with trailing space). The yellow fill is a *future convention* the team wants — not present today. |
| `Refer to MAS-OMEGA-…` | sample uses this phrase in one ISSCAL-001 stub row | Not used anywhere in v0.01. Replace with `Migrated to iss.iss_calendar_data` (most common) or `Replaced by ...` (when source-side col is dropped because the target schema models it differently). |
| Constant string `'YEARLY'` | sample has `Map to constant value: 'YEARLY'` for `period` | v0.01 uses `'CALPERIOD_YEARLY'` (mastercode-prefixed). Sample is wrong — period values are mastercodes, not raw text. |
| Constant string `'TBC'` | sample has plain `TBC` text for the issuance_type row | v0.01 uses `TBD` consistently (with trailing whitespace), not `TBC`. |
| BIDCOL-002 / BIDCOL-003 banner cells | sample's stubs are correctly named per sheet | v0.01 has typos in banner cell A1 (BIDCOL-002 says "BIDCOL-001"; BIDCOL-003 says "BIDCOL-002") and Module-ID column on BIDCOL-003 says `MAS-OMEGA-BIDCOL-001` for every row. **Fix when rebuilding.** |
| `Codes` sheet | sample reproduces verbatim | matches |
| Source Nullable column | sample uses `NULL`/`NOT NULL` strings | v0.01 mixes — some sheets use `NULL/NOT NULL` literals, some use `Y/N`, some mix both within one sheet (ISSCAL-001 has both). When normalising, pick `NULL/NOT NULL` (matches the more recent sheets ISSCAL-002/003). |
| Source Datatype values | sample uses Oracle-flavored datatypes | matches; v0.01 also has stray Oracle syntax (`NUMBER(7,4)`, `NUMBER(15,2)`) leaking into target columns where it should be `NUMERIC` — these are typos and worth fixing in the rebuild |

### Issues unique to v0.01 worth flagging in the rebuild

- **Banner typos** on BIDCOL-002 and BIDCOL-003 sheets (wrong module ID in row 1).
- **Module-ID column typo on BIDCOL-003**: every data row says `MAS-OMEGA-BIDCOL-001` but should say `MAS-OMEGA-BIDCOL-003`.
- **Truncated filter for SECMST-001** in Migration Summary: `... There will only be one record per security` — sentence ends mid-word. Restore to `... per security_code.`
- **Stray `c` in MAS-OMEGA-ISSCAL-004 row 15 col A** (Module ID should be `MAS-OMEGA-ISSCAL-004`).
- **BIDCOL-003 row 8 remark** says "Only submission types with ABA0007_TYPE_OF_APPLN = 'IND' will be pushed into iss.iss_bid_institutional" — but the rule explicitly excludes 'IND'. Looks like a copy/paste error from BIDCOL-001. Should likely read "Only types <> 'IND' will be pushed".
- **ISSANN-001 row 19 (`pricing_dt`) `To migrate` is `N`** but a source mapping is described — clarify whether row should be `Y` or whether mapping is for documentation only.
- **BIDCOL-001 row 22 (`accepted_amount`) `To migrate` is `-`** (single hyphen) — should be `N` or `Y`. Looks like a data-entry slip.
- **Inconsistent `Source Nullable` style** across sheets (Y/N vs NULL/NOT NULL vs mixed).
- **`'APPSRC_MANUAL ENTRY'`** — embedded space in the constant. Confirm if intentional or should be `APPSRC_MANUAL_ENTRY`.
- **`ABA0121_OPEN_DATETIME`** appearing inside an `ABA0021_ISSUE_CALENDAR` mapping (ISSCAL-001 row 14) — wrong table prefix.

### Things sample.cjs got right

- Overview block — fields match; date `2026-02-12`; "OMEGA – Open Market Execution Gateway" with the en-dash; `[TBA]` for sign-offs.
- Migration Summary 11 entries with correct seq numbers (10, 20, 30, 40, 50, 60, 70, 80, 100, 110) — note the 90 gap.
- 12-element row layout for mapping sheets (Module ID through Remarks).
- Codes sheet labels and order.
- Use of `\n` to indicate cell-internal newlines.
- Convention of `-` for not-migrated rows in cols D–K and the Remarks-as-explanation pattern.

---

## Quick-reference cheat sheet for filling new mappings

When writing a new row in a MAS-OMEGA-* mapping sheet, follow this decision tree:

```
Source col exists & migrating 1:1
  -> Transformation/Mapping Logic = "Direct Mapping"
     Remarks = "-"  (or a short note like "Possible values are \n'X' - Foo\n...")

Source col exists, value transformed (mapping/codification)
  -> Logic = "Transformation:\n\nIF '<src_val>' -> '<TARGET_MASTERCODE>'\n...\nELSE -> '<DEFAULT_MASTERCODE>'"
     Remarks = "Transformed into OMEGA specific mastercode"  (or contextual note)

Source col exists but column not migrated for this target
  -> cols G-K all "-"
     Remarks = "Migrated to <other_table>"  (if it goes to a different OMEGA table)
            or "Not applicable to OMEGA"   (if dropped)
            or "Replaced by <description>" (if OMEGA models it differently)

Target col is a UUID PK
  -> Logic = "Generate UUID: Create a <unique|new> UUID for every <distinct/unique combination of> <key>."
     Remarks = "Primary Key for OMEGA <table> table." or short purpose note

Target col is a UUID FK
  -> Logic = "Lookup UUID from <fk_schema.table> where <predicate>."
     Remarks = "Mandatory linkage to <Parent>"  (if NOT NULL)
            or "-"  (if nullable)

Target col is a literal constant
  -> Logic = "Map to constant value: '<MASTERCODE>'"  (string)
          or "Map to constant value: 1"               (number)
     Remarks = "-"  or context

Target col defaulted (not strictly required)
  -> Logic = "Default map to '<MASTERCODE>'"
     Remarks = brief justification

Target col deferred / undecided
  -> Logic = "TBD"  (note: TBD with possibly 1-2 trailing spaces — be loose)
     Remarks = "<reason or hand-off note, e.g. 'For Syndication, will provide the mapping in next revision.'>"

Composite/derived (e.g. group key from multiple cols)
  -> Source Column = newline-separated col list
     Logic = "To <verb> <target> using identifier below\n\n(<expression with + or SUBSTR(...)>)"
     Remarks = "Used to group bids under a unique Submission ID..."
```

Always: source datatypes use Oracle conventions (VARCHAR2, NUMBER, CHAR, DATE); target uses OMEGA conventions (VARCHAR, NUMERIC, TIMESTAMP). Mastercodes ALL_CAPS_SNAKE prefixed by domain (`SECTYPE_*`, `ISSTYPE_*`, `ISSCALSTAT_*`, `CALPERIOD_*`, `APPLNTYPE_*`, `APPSRC_*`, `BIDCOLSTAT_*`, `CUSTCD_*`, `ISSSUBMTH_*`, `NATIONLTY_*`, `SGSTYPE_*`).
