# Backend Database Schema Documentation (BE_mnetd.ddl)

## Overview

This document provides comprehensive documentation for the **MS9ABA backend database schema** stored on the **NETAPP tablespace**. This is the backend/server-side schema that handles core data processing, pricing calculations, batch jobs, and external system integrations for MAS (Monetary Authority of Singapore) securities management.

**Source File**: `BE_mnetd.ddl` (5,701 lines)
**Schema**: MS9ABA
**Tablespace**: NETAPP
**Database**: Oracle

---

## Database Architecture

### Relationship with Frontend Schema
- **Frontend (FE_tri1.ddl)**: ABAAPP tablespace - User-facing operations, eAuction, web interfaces
- **Backend (BE_mnetd.ddl)**: NETAPP tablespace - Core processing, pricing, batch jobs, integrations

### Database Links
The backend schema connects to external systems via:
- **TCMA**: External MAS database link A
- **TCMB**: External MAS database link B

---

## Table Categories

### 1. Security Master Tables (Core Reference Data)

| Table Name | Primary Key | Description |
|------------|-------------|-------------|
| ABA0001_SECURITY_MASTER | SECURITY_CODE + ISSUE_NO | Master table for all SGS securities |
| ABA0002_FRN_ISSUE | SECURITY_CODE + ISSUE_NO | Floating Rate Notes (FRN) specific data |
| ABA0008_STAGE_SECURITY_MASTER | SECURITY_CODE + ISSUE_NO | Staging table for security updates |
| ABA0034_STG_SC_SECURITY_MASTER | SECURITY_CODE + ISSUE_NO | Staging for scheduled security updates |

#### ABA0001_SECURITY_MASTER Key Fields
```
SECURITY_CODE       - 8-char code (e.g., 'NZ23100M' for T-Bill)
ISSUE_NO            - Issue sequence number
ISSUE_TYPE          - Security type code
CURR                - Currency (SGD)
SECURITY_NAME       - Descriptive name
ISSUE_DATE          - Date of issue
TENDER_DATE         - Auction tender date
ISSUE_SIZE          - Total amount issued
MATURITY_DATE       - Maturity date
INTEREST_RATE       - Coupon rate
CUTOFF_YIELD        - Auction cutoff yield
AVE_YIELD           - Average yield
AVE_PRICE           - Average price
ISIN_CODE           - ISIN identifier
ETENDER_IND         - Electronic tender indicator
BENCHMARK_IND       - Benchmark security flag
SEC_CAT             - Security category
SEC_TYPE_ID         - Type identifier
```

### 2. Retail Bid Transaction Tables

| Table Name | Primary Key | Description |
|------------|-------------|-------------|
| ABA0004_RETAIL_BID_TRANS | SECURITY_CODE + ISSUE_NO + BANK_REF_NO | Retail investor bid records |
| ABA0005_RSA_TEXT_ENC_TRANS | SECURITY_CODE + ISSUE_NO + BANK_REF_NO | RSA encrypted bid data |

#### ABA0004_RETAIL_BID_TRANS Key Fields
```
SECURITY_CODE       - Security being bid for
ISSUE_NO            - Issue number
BANK_REF_NO         - Bank's reference number
FORM_NO             - Form/application number
FILE_TYPE           - File type code
PRI_DLR_CODE        - Primary dealer code
NOMINAL_AMT         - Bid amount
COMPETITIVE_CHECK   - Competitive/non-competitive indicator
BID_YIELD           - Bid yield
NAME_OF_APPLICANT   - Applicant name
NRIC_NO             - National ID number
CDP_ACCT_NO         - CDP account number
CPF_ACCT_NO         - CPF account number (if using CPF)
SUB_MTD             - Submission method
REC_STATUS          - Record status
```

### 3. Auction Result Tables

| Table Name | Primary Key | Description |
|------------|-------------|-------------|
| ABA0006_AUCTION_RESULT | SECURITY_CODE + ISSUE_NO + BANK_ACC_CODE + TENDER_DATE + LINE_NO | Summary auction results |
| ABA0007_DETAIL_AUCTION_RESULT | SECURITY_CODE + ISSUE_NO + FORM_NO | Detailed individual results |
| AQA0020_AUCTION_RESULTS_REPORT | SECURITY_CODE + ISSUE_NO + FORM_NO | Report-ready auction results |
| AQA0008_SEC_AUCTION_PARA | SECURITY_CODE + ISSUE_NO | Auction parameters |

#### ABA0006_AUCTION_RESULT Key Fields
```
SECURITY_CODE       - Security code
ISSUE_NO            - Issue number
BANK_ACC_CODE       - Submitting bank code
TENDER_DATE         - Tender/auction date
LINE_NO             - Line number (for multiple bids)
QTY_APPLIED         - Quantity applied
QTY_ALLOTTED        - Quantity allotted
COMP_NOCOMP         - Competitive/Non-competitive flag
BID_YIELD           - Bid yield
PRICE               - Allotment price
```

### 4. Daily Pricing Tables

| Table Name | Primary Key | Description |
|------------|-------------|-------------|
| ABA0011_DAILY_PRICE | SECURITY_CODE + ISSUE_NO + BANK_ACC_CODE + SUBMISSION_DATE | Raw daily price submissions |
| ABA0012_DP_STATUS | BANK_ACC_CODE + SUBMISSION_DATE | Daily price submission status |
| ABA0017_FINAL_DAILY_PRICE | SECURITY_CODE + ISSUE_NO + SUBMISSION_DATE | Final computed daily prices |
| ABA0018_FINAL_EXTRA_PRICE | SECURITY_TYPE + SUBMISSION_DATE | Additional pricing data |
| FINAL_DAILY_PRICE | (same as ABA0017) | Alternative daily price table |

#### ABA0017_FINAL_DAILY_PRICE Key Fields
```
SECURITY_CODE       - Security code
ISSUE_NO            - Issue number
SUBMISSION_DATE     - Date of price
HIGH_PRICE          - Daily high price
LOW_PRICE           - Daily low price
AVE_PRICE           - Average price
DIRTY_PRICE         - Dirty price (with accrued interest)
MLA_PRICE           - MLA benchmark price
YIELD               - Computed yield
T1_DATE             - T+1 settlement date
T1_DIRTY_PRICE      - T+1 dirty price
MODIFIED_DURATION   - Duration metric
BENCH_PRICE_FLAG    - Benchmark price indicator
```

### 5. Bank Master Tables

| Table Name | Primary Key | Description |
|------------|-------------|-------------|
| ABA0009_BANK_MASTER | BANK_CODE | Master list of banks |
| ABA0013_PRIMARY_DEALER | BANK_CODE | Primary dealer banks |
| ABA0020_STAGING_BANK_MASTER | BANK_CODE | Staging for bank updates |

#### ABA0009_BANK_MASTER Key Fields
```
BANK_CODE           - Numeric bank code
BANK_NAME           - Full bank name
BANK_SHORTNAME      - Short name
PRI_DLR_IND         - Primary dealer indicator
BANK_TYPE           - Bank type classification
ACTIVE_IND          - Active status
```

### 6. SORA Rate Tables

| Table Name | Primary Key | Description |
|------------|-------------|-------------|
| ABA0029_SORA_RATE | SORA_PUB_DT | Daily SORA (Singapore Overnight Rate Average) |
| ABA0036_STAGE_SORA_AMMO | SORA_PUB_DT | Staging table for AMMO SORA import |

#### ABA0029_SORA_RATE Key Fields
```
SORA_PUB_DT         - Publication date
SORA_VALUE_DT       - Value date
SORA_RATE           - SORA rate value
COMPD_SORA_RATE     - Compounded SORA rate
AVG_SORA_RATE_1M    - 1-month average
AVG_SORA_RATE_3M    - 3-month average
AVG_SORA_RATE_6M    - 6-month average
LAST_MODIFIED_DT    - Last update timestamp
LAST_MODIFIED_BY    - User who updated
```

### 7. Singapore Savings Bond (SSB) Tables

| Table Name | Primary Key | Description |
|------------|-------------|-------------|
| ABA0101_SB_SECURITY_MASTER | SB_SECURITY_CODE | SSB master data |
| ABA0108_SB_STAGE_SEC_MASTER | SB_SECURITY_CODE | SSB staging |
| ABA0110_SB_ANNOUNCE_TEXT | NAME + USED_BEFORE | SSB announcement templates |
| ABA0121_SB_ISSUE_CALENDAR | SECURITY_CODE + ISSUE_NO | SSB issuance calendar |
| ABA0124_SB_COUPON_RATE_DETAILS | ISSUE_CODE + YEAR_NUMBER + COUPON_NUMBER | SSB coupon rates by year |
| ABA0126_SB_REDEMPTION_RESULT | REDEMPTION_DATE + SECURITY_CODE | SSB redemption results |
| ABA0127_SB_SYSTEM_CONFIG | PROPERTY_NAME | SSB system configuration |
| ABA0134_STG_SB_SC_SEC_MASTER | SB_SECURITY_CODE | SSB staging for scheduled updates |
| ABA0214_SB_CD_FILE_TYPE | CD_FILE_TYPE | SSB CDP file types |
| ABA0222_SB_ORG | ORG_ID | SSB organization master |
| ABA0223_SB_PGP_CONFIG | PGP_PROPERTY_KEY | SSB PGP encryption config |

#### ABA0101_SB_SECURITY_MASTER Key Fields
```
SB_SECURITY_CODE    - SSB code (e.g., 'SBJAN24')
SB_ISSUE_NO         - Issue number
SB_SECURITY_NAME    - Description
SB_ISIN_CODE        - ISIN code
SB_ISSUE_DATE       - Issue date
SB_MATURITY_DATE    - Maturity date (10 years)
SB_TENOR            - Tenor in months
SB_ISSUE_SIZE       - Total issue size
SB_QTY_APPLIED      - Total applications
SB_QTY_ALLOTTED     - Total allotted
SB_QTY_REDEEMED     - Total redeemed
SB_CUTOFF_AMT       - Cutoff amount
SB_RANDOM_ALLOT_RATE - Random allotment rate
INT_DATE1           - First interest date (Jun 1)
INT_DATE2           - Second interest date (Dec 1)
```

### 8. Repo/ERF Trading Tables (Series 05xx)

| Table Name | Primary Key | Description |
|------------|-------------|-------------|
| ABA0501_ENCRYPTED_REPO_TRANS | BANK_CODE + TRANS_REF_NO + RECEIVED_DT | Encrypted repo bid submissions |
| ABA0503_OPEN_ISSUES | SECURITY_CODE + UPDATED_DT | Open repo issues |
| ABA0504_AUCTION_SUMMARY | SECURITY_CODE + UPDATED_DT | Repo auction summaries |
| ABA0505_AUCTION_DETAILS | SECURITY_CODE + BANK_CODE + SEQ_NO + TRANS_REF_NO | Repo auction bid details |
| ABA0506_SYSTEM_PARM | (single row) | Repo system parameters |
| ABA0507_SPLIT_BIDS | TRANS_REF_NO + SEQ_NO | Split bid tracking |

### 9. ERF Trading Tables (Series 06xx)

| Table Name | Primary Key | Description |
|------------|-------------|-------------|
| ABA0601_ENCRYPTED_REPO_TRANS | BANK_CODE + TRANS_REF_NO + RECEIVED_DT | ERF encrypted transactions |
| ABA0603_OPEN_ISSUES | SECURITY_CODE + UPDATED_DT | ERF open issues |
| ABA0605_TRADE_DETAILS | SECURITY_CODE + BANK_CODE + SEQ_NO + TRANS_REF_NO | ERF trade details |
| ABA0606_SYSTEM_PARM | (single row) | ERF system parameters |
| ABA0607_SPLIT_BIDS | TRANS_REF_NO + SEQ_NO | ERF split bids |
| ABA0608_LEGAL_LOG | (no formal PK) | ERF legal/audit logging |
| ABA0610_REJECTED_ISSUES | SECURITY_CODE + UPDATED_DT | Rejected ERF issues |

#### ABA0605_TRADE_DETAILS Key Fields
```
SECURITY_CODE       - Security code
BANK_CODE           - Bank code
SEQ_NO              - Sequence number
TRANS_REF_NO        - Transaction reference
RECEIVED_DT         - Received date/time
AMT_APPLIED         - Amount applied
AMT_ALLOTTED        - Amount allotted
CLEAN_PRICE         - Clean price
DIRTY_PRICE         - Dirty price
HAIRCUT_CLEAN_PRICE - Haircut clean price
HAIRCUT_DIRTY_PRICE - Haircut dirty price
S_DURATION          - Spread duration
G_DURATION          - Gross duration
REPO_FEE            - Repo fee
NET_CASH            - Net cash amount
STATUS_FLAG         - Status (N=New, A=Allotted, C=Confirmed, V=Void)
```

### 10. Batch Job/Task Tables

| Table Name | Primary Key | Description |
|------------|-------------|-------------|
| ABA2000_TASK_REGISTRY | TASK_ID | Task registry for Spring Batch |
| ABA0027_BATCH_JOB | JOB_ID | Batch job definitions |
| ABA0028_BATCH_JOB_EXECUTION | JOB_EXECUTION_ID | Job execution history |

#### ABA2000_TASK_REGISTRY Key Fields
```
TASK_ID             - Unique task identifier
TASK_DESC           - Task description
TASK_TYPE           - Type of task
IS_ACTIVE           - Active flag
```

### 11. Transaction Tables (AQA Series)

| Table Name | Primary Key | Description |
|------------|-------------|-------------|
| AQA0002_TRANSACTION | SECURITY_CODE + ISSUE_NO + FORM_NO | General transactions |
| AQA0005_REPORT_COUNTER | DATE + COUNT | Report counters |
| AQA0006_EAPPS_TRANSACTION | SECURITY_CODE + ISSUE_NO + REFERENCE_NO | eApps transactions |

### 12. Configuration Tables

| Table Name | Primary Key | Description |
|------------|-------------|-------------|
| ABA0010_ANNOUNCE_TEXT | NAME + USED_BEFORE | Announcement text templates |
| ABA0015_PRICE_SPREAD | TYPE | Price spread parameters |
| ABA0019_PUBLIC_HOLIDAY | DATE + COUNTRY | Public holiday calendar |
| ABA0021_ISSUE_CALENDAR | SECURITY_CODE + ISSUE_NO | Securities issue calendar |
| ABA0022_NON_BENCHMARK | SECURITY_CODE + ISSUE_NO | Non-benchmark securities |
| ABA0030_CORP_PASS_MAPPING | BANK_CODE + CP_ENTITY_ID + CP_UID | CorpPass authentication mapping |
| ABA0032_EAPPS_CONFIG | KEY | eApps configuration |
| ABA0034_EAPPS_SUBMISSION_CUTOFF_TIME | NAME | eApps submission cutoff times |

### 13. Outstanding/Statistics Tables

| Table Name | Primary Key | Description |
|------------|-------------|-------------|
| ABA0025_OUTSTANDING_SGS | YEAR | Outstanding SGS by year |
| ABA0026_OUTSTANDING_MAS | YEAR | Outstanding MAS securities |
| ABA0031_OUTSTANDING_FRN | YEAR + MONTH | Outstanding FRN by month |
| ABA0033_ISSUANCE_REDEMPT_SGS | YEAR + MONTH + SECURITY_CATEGORY | Issuance/redemption stats |

### 14. Audit Tables

| Table Name | Description |
|------------|-------------|
| ABA0023_AUDIT_ACTION | Audit log for user actions |

### 15. Utility/Temporary Tables

| Table Name | Description |
|------------|-------------|
| TEMP | General temporary table |
| TEMP1 | Secondary temporary table |
| TEMP_SUBSCRIPTION_ENTRY | Temporary subscription data |
| TEST_CLOB | Test table for XML documents |
| USER_SESSION | User session tracking |
| FX_FACTORS | Foreign exchange conversion factors |

---

## Views

### Trade Summary Views
| View Name | Description |
|-----------|-------------|
| ABA0604_TRADE_SUMMARY_VIEW | Aggregated trade summaries by date and security |
| ABA0604_TRADE_SUMMARY_VW_TEST | Test version of trade summary |
| ABA0604_TRD_SUM_MASTER_VIEW | Master trade summary view |

### Savings Bond Views
| View Name | Description |
|-----------|-------------|
| VWALLOTMENTRESULTS | SSB allotment results view |
| VWAMOUNTOUTSTANDING | SSB amount outstanding with yearly redemptions |
| VWSTEPUPINTEREST | SSB step-up interest rates over 10 years |

---

## Stored Procedures

### Data Refresh Procedures
| Procedure | Description |
|-----------|-------------|
| ABA0017_REFRESH | Refresh final daily price data via TCMA link |
| ABA0018_REFRESH | Refresh extra price data via TCMA link |
| ABA0019_REFRESH | Refresh via ms9gsw.aba0019_refresh@tcma |
| UPDATEABA0017 | Push ABA0017 data to TCMA and TCMB databases |

### Auction Processing Procedures
| Procedure | Description |
|-----------|-------------|
| ABA0505_GET_SPLIT_BIDS | Calculate and store split bids for repo auctions |
| DELETE_ALL_BIDS | Delete all bids for a given auction date |

### ERF Processing Procedures
| Procedure | Description |
|-----------|-------------|
| ABA0609_RETRIGGER_APP_PROC | Re-trigger ERF application processing |

### SSB Replication Procedures
| Procedure | Description |
|-----------|-------------|
| USPCURSORALLOTMENTRESULTS | Replicate allotment results to TCMA/TCMB |
| USPCURSORAMOUNTOUTSTANDING | Replicate outstanding amounts to TCMA/TCMB |
| USPCURSORSTEPUPINTEREST | Replicate step-up interest to TCMA/TCMB |

### Testing Procedures
| Procedure | Description |
|-----------|-------------|
| SELENIUM_CHECK_SECURITY_EXISTS | Automation testing for eApps (creates test securities) |
| TEST | Simple test procedure |

---

## Functions

| Function | Description |
|----------|-------------|
| MLAPERIODPRICE | Get MLA price for a specific period (moving average) |
| UFNGETCOUPONPERCENTAGE | Get SSB coupon percentage for year/coupon number |
| UFNGETRETURNRATEPERCENTAGE | Get SSB return rate percentage for year/coupon |
| UFNGETYEARLYREDEMPTIONRESULT | Get yearly SSB redemption total |

### MLAPERIODPRICE Logic
```sql
-- Returns MLA price from 14-21 days before period date
-- Excludes weekends (day 1, 7) and public holidays
SELECT NVL(ABA0017_MLA_PRICE, 0)
FROM ABA0017_FINAL_DAILY_PRICE
WHERE SUBMISSION_DATE = MAX(date between periodDate-21 and periodDate-14)
AND date NOT IN (weekends, public_holidays)
```

---

## Materialized View Logs

The following tables have materialized view logs for data replication:
- ABA0001_SECURITY_MASTER (MLOG$_ABA0001_SECURITY_MAS)
- ABA0017_FINAL_DAILY_PRICE (MLOG$_ABA0017_FINAL_DAILY_)
- ABA0018_FINAL_EXTRA_PRICE (MLOG$_ABA0018_FINAL_EXTRA_)

---

## Key Business Processes

### 1. Securities Auction Flow (Backend)
```
1. Banks submit encrypted bids via RSA (ABA0005_RSA_TEXT_ENC_TRANS)
2. Decrypted into retail bid records (ABA0004_RETAIL_BID_TRANS)
3. Auction processing creates results (ABA0006_AUCTION_RESULT)
4. Detailed results stored (ABA0007_DETAIL_AUCTION_RESULT)
5. Results replicated to TCMA/TCMB via procedures
```

### 2. Daily Price Calculation Flow
```
1. Primary dealers submit daily prices (ABA0011_DAILY_PRICE)
2. Status tracked in ABA0012_DP_STATUS
3. System calculates final prices (ABA0017_FINAL_DAILY_PRICE)
4. Extra pricing data computed (ABA0018_FINAL_EXTRA_PRICE)
5. Data replicated via materialized view logs
```

### 3. Savings Bond (SSB) Processing
```
1. Security created in ABA0101_SB_SECURITY_MASTER
2. Coupon rates stored in ABA0124_SB_COUPON_RATE_DETAILS
3. Results tracked in redemption tables
4. Views provide step-up interest and outstanding calculations
5. USP procedures replicate to external systems
```

### 4. Repo/ERF Trading Flow
```
1. Encrypted bids received (ABA0501/ABA0601)
2. Open issues tracked (ABA0503/ABA0603)
3. Auction summary created (ABA0504)
4. Trade details recorded (ABA0505/ABA0605)
5. Split bids calculated via ABA0505_GET_SPLIT_BIDS
```

### 5. SORA Rate Processing
```
1. SORA rates received from AMMO (staged in ABA0036)
2. Loaded into ABA0029_SORA_RATE
3. Compounded rates and averages calculated
4. Used for FRN coupon calculations
```

---

## Foreign Key Relationships

### From Security Master
- ABA0002_FRN_ISSUE → ABA0001_SECURITY_MASTER
- ABA0005_RSA_TEXT_ENC_TRANS → ABA0001_SECURITY_MASTER
- ABA0006_AUCTION_RESULT → ABA0001_SECURITY_MASTER
- ABA0008_STAGE_SECURITY_MASTER → ABA0001_SECURITY_MASTER
- ABA0011_DAILY_PRICE → ABA0001_SECURITY_MASTER
- ABA0017_FINAL_DAILY_PRICE → ABA0001_SECURITY_MASTER
- ABA0022_NON_BENCHMARK → ABA0001_SECURITY_MASTER

### From SSB Security Master
- ABA0124_SB_COUPON_RATE_DETAILS → ABA0101_SB_SECURITY_MASTER
- ABA0126_SB_REDEMPTION_RESULT → ABA0101_SB_SECURITY_MASTER

### Batch Job Relationships
- ABA0028_BATCH_JOB_EXECUTION → ABA0027_BATCH_JOB

---

## Backup Tables

Multiple backup tables exist with date suffixes (e.g., _20230428, _20230515):
- ABA0001_SECURITY_MASTER_* (multiple date snapshots)
- ABA0004_RETAIL_BID_TRANS_20230428
- ABA0005_RSA_TEXT_ENC_TRANS_20230428
- ABA0006_AUCTION_RESULT_20230428
- ABA0007_DETAIL_AUCTION_RESULT_20230428
- ABA0009_BANK_MASTER_BKUP, BKUP1, BKUP2, BKUP3, BKUP4
- ABA0022_NON_BENCHMARK_20230428
- ABA0029_SORA_RATE_* (multiple backups)
- AQA0006_EAPPS_TRANSACTION_20230428

---

## Integration Points

### External System Integration
1. **TCMA Database Link**: Primary external MAS database
2. **TCMB Database Link**: Secondary external MAS database
3. **AMMO**: Automated Money Market Operations (SORA rates)
4. **CorpPass**: Government authentication (ABA0030_CORP_PASS_MAPPING)
5. **CDP**: Central Depository integration
6. **PGP Encryption**: For file transfers (ABA0223_SB_PGP_CONFIG)

### Data Replication
- Materialized view logs enable real-time replication
- USP* procedures handle SSB data replication to TCMA/TCMB
- UPDATEABA0017 pushes daily prices to external systems

---

## Security Considerations

1. **RSA Encryption**: Bid data encrypted in ABA0005_RSA_TEXT_ENC_TRANS
2. **PGP Configuration**: File encryption keys in ABA0223_SB_PGP_CONFIG
3. **CorpPass Authentication**: Mapped in ABA0030_CORP_PASS_MAPPING
4. **Audit Logging**: Actions tracked in ABA0023_AUDIT_ACTION

---

## Differences from Frontend Schema

| Aspect | Frontend (ABAAPP) | Backend (NETAPP) |
|--------|-------------------|------------------|
| Focus | User interfaces, eAuction | Core processing, integrations |
| Tables | Form/entry tables | Master tables, pricing |
| Links | MNET link | TCMA, TCMB links |
| Jobs | Spring Batch params | Full batch job tables |
| Pricing | Submission tables | Final calculated prices |
| SSB | Application forms | Master + rates + redemption |

---

## Document Information

- **Generated from**: BE_mnetd.ddl (5,701 lines)
- **Documentation Date**: January 2025
- **Table Count**: ~95 tables (including backups)
- **View Count**: 5 views
- **Procedure Count**: 10 procedures
- **Function Count**: 4 functions
