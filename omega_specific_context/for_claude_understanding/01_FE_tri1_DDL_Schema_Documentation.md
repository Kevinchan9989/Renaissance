# FE_tri1.ddl - Frontend Database Schema Documentation

## Overview

**Source File**: `old_system/Source DDL/FE_tri1.ddl`
**Schema Name**: MS9ABA (MAS Singapore ABA)
**Database Type**: Oracle Database
**Tablespace**: ABAAPP
**Total Lines**: 5,339
**Purpose**: Frontend system for MAS (Monetary Authority of Singapore) securities auction, savings bonds, and repurchase facility management

---

## Database Architecture

### Database Links
| Link Name | Purpose |
|-----------|---------|
| MNET | Backend/network system connection |
| TCMA | Cross-system data synchronization |
| TCMB | Cross-system data synchronization (backup) |

---

## Table Categories

### 1. Security Master Tables (ABA0001_*)

| Table Name | Purpose | Key Fields |
|------------|---------|------------|
| ABA0001_SECURITY_MASTER | Core security/bond master data | SECURITY_CODE, ISSUE_NO, SECURITY_NAME, ISSUE_DATE, TENDER_DATE, ISSUE_SIZE, MATURITY_DATE |
| ABA0035_SECURITY_MASTER_CTG_STG | Staging table for security master (CTG) | SECURITY_CODE, ISSUE_NO |

**Key Concepts**:
- SECURITY_CODE: 8-character code identifying the security
- ISSUE_NO: Issue number (typically '0' or '1')
- Tracks tender dates, issue dates, maturity dates, and issue sizes

---

### 2. Auction Processing Tables (ABA0006_* to ABA0008_*)

| Table Name | Purpose | Key Fields |
|------------|---------|------------|
| ABA0006_AUCTION_RESULT | Aggregated auction results by bank | SECURITY_CODE, ISSUE_NO, BANK_ACC_CODE, TENDER_DATE, LINE_NO |
| ABA0007_DETAIL_AUCTION_RESULT | Individual application auction results | SECURITY_CODE, ISSUE_NO, FORM_NO |
| ABA0008_AUCTION_AUDIT_LOG | Audit trail for auction actions | USER_ID, ACTION, timestamp |

**Key Concepts**:
- PRI_DLR_CODE: Primary Dealer Code
- COMPETITIVE vs NON-COMPETITIVE bids (COMP_CHECK field)
- YIELD-based bidding
- QTY_APP (quantity applied) vs QTY_ALLOT (quantity allotted)

---

### 3. eAuction Configuration Tables (ABA0009_*, ABA0010_*)

| Table Name | Purpose |
|------------|---------|
| ABA0009_EAUCTION_CONFIG | Key-value configuration settings for electronic auction |
| ABA0009_EAUCTION_CONFIG_TMP | Temporary config for pending changes |
| ABA0010_EAUCTION_AUCTION_CUTOFF_TIME | Cutoff times for different auction types |

---

### 4. Retail Bid Processing Tables (ABA0036_*)

| Table Name | Purpose |
|------------|---------|
| ABA0036_RETAILBID_FILE | Tracks retail bid file processing with acknowledgments |

---

### 5. Singapore Savings Bond (SB) Tables (ABA0101_* to ABA0284_*)

This is the largest group of tables, managing the complete lifecycle of Singapore Savings Bonds.

#### 5.1 Security Master (SB)
| Table Name | Purpose |
|------------|---------|
| ABA0101_SB_SECURITY_MASTER | SB security master (via synonym to MNET) |
| ABA0124_SB_COUPON_RATE_DETAILS | Coupon rate schedule (via synonym) |

#### 5.2 Reference Data / Code Tables
| Table Name | Code | Purpose |
|------------|------|---------|
| ABA0214_SB_CD_FILE_TYPE | CD | File types (AP1=Cash, SRS=SRS applications) |
| ABA0215_SB_CD_FILE_STATUS | CD | File processing status |
| ABA0216_SB_CD_RECORD_STATUS | CD | Individual record status |
| ABA0217_SB_CD_NATION | CD | Nationality codes (S=Singaporean, P=PR, etc.) |
| ABA0218_SB_CD_NATION_CTY | CD | Nationality/Country combination codes |
| ABA0219_SB_CD_FILE_ERROR_DESC | CD | File-level error descriptions |
| ABA0220_SB_CD_RECORD_ERR_DESC | CD | Record-level error descriptions |
| ABA0221_SB_CD_BATCHJOB_STATUS | CD | Batch job status codes |
| ABA0240_SB_CD_SUBMISSION_TYPE | CD | Submission method types |
| ABA0282_SB_CD_APPLICATION_TYPE | CD | Application type codes |

#### 5.3 Organization Management
| Table Name | Purpose |
|------------|---------|
| ABA0222_SB_ORG | Bank/Organization master (ORG_TYPE, ORG_CODE, ORG_NAME, MEMBER_CODE, CUSTODY_CODE) |

#### 5.4 Applicant Management
| Table Name | Purpose |
|------------|---------|
| ABA0223_SB_APPLICANT | Individual applicant records (IC_PASSPORT, NAME, CD_NATION, CD_NATION_CTY) |

**Key Uniqueness**: Applicants are uniquely identified by combination of IC_PASSPORT + NAME + NATION + NATION_CTY

#### 5.5 Subscription Processing
| Table Name | Purpose |
|------------|---------|
| ABA0224_SB_SUBSCRIPT | Subscription file header (links to batch job, org, file type) |
| ABA0225_SB_SUBSCRIPT_DT | Subscription detail records (individual applications) |
| ABA0226_SB_SUBSCRIPT_DT_ERR | Subscription error records |

**Key Fields in ABA0225_SB_SUBSCRIPT_DT**:
- APPLICANT_ID (FK to ABA0223)
- REFERENCE_NO, TRANS_REF
- CDP_ACCT_NO (Central Depository account)
- NOMINAL_AMT (subscription amount)
- RECEIVED_DT, RECEIVED_TIME
- SUB_METHOD (submission method)
- CUST_BANK_CODE (customer's bank)
- CPF_ACCT_NO (CPF account number)
- PAYMENT_MODE

#### 5.6 Redemption Processing
| Table Name | Purpose |
|------------|---------|
| ABA0227_SB_REDEMPTION | Redemption file header |
| ABA0228_SB_REDEMPTION_DT | Redemption detail records |
| ABA0229_SB_REDEMPTION_DT_ERR | Redemption error records |

#### 5.7 Holdings Management
| Table Name | Purpose |
|------------|---------|
| ABA0230_SB_HLD_INFO | Holdings file header (from CDP/banks) |
| ABA0231_SB_HLD_INFO_DT | Holdings detail records per applicant per security |
| ABA0236_SB_HLD_INFO_DT_ERR | Holdings error records |

**Key Fields**:
- HLD_AMT (holding amount)
- HLD_TYPE (holding type)

#### 5.8 Allotment Processing
| Table Name | Purpose |
|------------|---------|
| ABA0232_SB_ALLOTMENT_RESULT | Allotment results linking subscriptions to outcomes |

**Key Fields**:
- ACCEPTED_AMT (amount accepted)
- PROCESSED_AMT (amount allotted)
- CD_RECORD_STATUS, CD_RECORD_ERR_DESC

#### 5.9 Batch Job Management
| Table Name | Purpose |
|------------|---------|
| ABA0233_SB_BATCH_JOB | Job definition (JOB_TYPE, JOB_INSTANCE_ID) |
| ABA0234_SB_BATCH_JOB_EXECUTION | Job execution steps and status |
| ABA0235_SB_SUBMISSION_SUMMARY | Summary statistics per org per security |

#### 5.10 User Management (SB)
| Table Name | Purpose |
|------------|---------|
| ABA0237_SB_USER | SB module user records |
| ABA0238_SB_LEVEL_ACTION | Permission levels per module |
| ABA0239_SB_ACTION_REF | Action reference definitions |

#### 5.11 Audit and Control
| Table Name | Purpose |
|------------|---------|
| ABA0250_SB_AUDIT_LOG | User action audit trail (USER_ID, FUNCTION, DETAILS) |
| ABA0251_SB_CONT_MAKE_CHECK | Maker-checker control for operations |
| ABA0252_SB_SYSCONF_MAKE_CHECK | Maker-checker for system config changes |

#### 5.12 Reporting
| Table Name | Purpose |
|------------|---------|
| ABA0212_SB_REPORT | Report definitions |
| ABA0213_SB_REPORT_FILE | Generated report files |
| ABA0241_SB_RESULT_FILE | Result file tracking |
| ABA0283_SB_COUPON_RESULT_FILE | Coupon payment result files |

#### 5.13 Temporary/Staging Tables
| Table Name | Purpose |
|------------|---------|
| ABA0280_SB_TEMP_APP_SUB_DT | Temporary subscription data |
| ABA0281_SB_TEMP_HOLDING | Temporary holding data |

#### 5.14 Synchronization
| Table Name | Purpose |
|------------|---------|
| ABA0284_SB_PORTAL_SYNC | Portal synchronization tracking |

---

### 6. eApps Transaction Tables (AQA0002_*, AQA0006_*)

| Table Name | Purpose |
|------------|---------|
| AQA0002_TRANSACTION | Institution bid transactions (supports up to 5 yield/amount pairs) |
| AQA0006_EAPPS_TRANSACTION | eApps transaction records with multiple bids |

**Key Concepts**:
- Supports competitive and non-competitive bids
- Each transaction can have up to 5 separate yield/amount combinations
- FILE_TYPE distinguishes different application sources

---

### 7. User and Access Control Tables (AQA0003_*, AQA0004_*)

| Table Name | Purpose |
|------------|---------|
| AQA0003_USER | User records with access levels |
| AQA0004_LEVEL_ACTION | Module/action permissions per level |
| AQA0010_ACTION_REF | Action reference descriptions |
| AQA0011_USER_SESSION | Active user sessions |

---

### 8. Syndication Tables (AQA0012_* to AQA0016_*)

| Table Name | Purpose |
|------------|---------|
| AQA0012_SYNDICATION_INS_RET_DT | Syndication instruction return details |
| AQA0013_SYNDICATION_COUPON_DT | Syndication coupon details |
| AQA0014_SYNDICATION_RPT_COUNT | Syndication report counter |
| AQA0015_COPY_SYND_SEC_MAST_IND | Syndication security master copy indicator |
| AQA0016_SYNDICATED_SEC_MAST_DT | Syndicated security master details |

**Key Fields**:
- COUPON_RATE, COY_PRICE (company price)
- CUTOFF_YIELD, BID_TO_COVER ratio
- ACCRUED_INT (accrued interest)

---

### 9. Auction Control Tables (AQA0017_* to AQA0021_*)

| Table Name | Purpose |
|------------|---------|
| AQA0017_AUCTION_IND | Auction run indicator (DECRYPT_BIDS, AUCTION_ENGINE flags) |
| AQA0018_RETAIL_BID_PROC_IND | Retail bid processing indicator |
| AQA0019_AUCTION_REPORT_IND | Auction report run indicator |
| AQA0020_AUCTION_RESULTS_REPORT | Auction results for reporting |
| AQA0021_AUCTION_RESULTS_REPORT_CTG_STG | Staging table for CTG auction results |

---

### 10. Repurchase Facility (ERF/Repo) Tables (AQA0101_* to AQA0113_*)

| Table Name | Purpose |
|------------|---------|
| AQA0101_REPO_TRANS | Repo transaction records |
| AQA0102_USER | ERF module user records |
| AQA0103_PRIVATE_KEY | Encryption key storage |
| AQA0104_ERF_SYSTEM_PARM | ERF system parameters (limits) |
| AQA0104_SYSTEM_PARM | General system parameters |
| AQA0105_CYCLE | Price/cycle date tracking |
| AQA0105_ERF_CYCLE | ERF-specific cycle dates |
| AQA0107_AUDIT_LOG | Repo audit log |
| AQA0107_ERF_AUDIT_LOG | ERF-specific audit log |
| AQA0108_LOG_DETAIL | Log code descriptions |
| AQA0108_ERF_LOG_DETAIL | ERF log code descriptions |
| AQA0109_HAIRCUT_SETTINGS | Haircut percentage settings |
| AQA0111_CANCEL_TRADE | Cancelled trade records |
| AQA0112_DUR_RATE | Duration-based repo rates |
| AQA0113_USER_SESSION | ERF user sessions |

**Key ERF Concepts**:
- REQ_SEC_CODE vs EXG_SEC_CODE (requested vs exchange security)
- DIRTY_PRICE vs CLEAN_PRICE
- HAIRCUT percentage
- REPO_RATE, REPO_FEE

---

### 11. Daily Price Tables (ABA0017_*)

| Table Name | Purpose |
|------------|---------|
| ABA0017_FINAL_DAILY_PRICE | Final daily pricing data |
| ABA0019_PUBLIC_HOLIDAY | Public holiday calendar (via synonym) |

---

### 12. Spring Batch Framework Tables

| Table Name | Purpose |
|------------|---------|
| BATCH_JOB_INSTANCE | Job instance definitions |
| BATCH_JOB_EXECUTION | Job execution records |
| BATCH_JOB_EXECUTION_CONTEXT | Job execution context (CLOB) |
| BATCH_JOB_EXECUTION_PARAMS | Job parameters |
| BATCH_STEP_EXECUTION | Step execution records |
| BATCH_STEP_EXECUTION_CONTEXT | Step execution context (CLOB) |

---

## Database Views

| View Name | Purpose |
|-----------|---------|
| HOLD_ALLOT_REPORTS | Combined holding and allotment reports |
| VW_ERF_001 | ERF trading view |
| VW_HLD_001 | Holdings view (Base64 encoded IC) |
| VW_MASTER_001 | Security master summary view |
| VW_QA_HLD_001 | QA Holdings view (partial IC masking) |
| VW_QA_MASTER_001 | QA Security master view |
| VW_QA_REDEM_001 | QA Redemption view |
| VW_QA_SUB_001 | QA Subscription view with age calculation |
| VW_REDEM_001 | Redemption view (Base64 encoded IC) |
| VW_SUB_001 | Subscription view (Base64 encoded IC) |
| VW_SUB_002 | Subscription summary view |

**Note**: Views use Base64 encoding (utl_encode.base64_encode) to protect IC/Passport numbers

---

## Stored Procedures

| Procedure Name | Purpose |
|----------------|---------|
| ABA0017_REFRESH | Refresh ABA0017 data (cross-DB) |
| ABA0018_REFRESH | Refresh ABA0018 data (cross-DB) |
| ABA0019_REFRESH | Refresh ABA0019 data (cross-DB) |
| ERF_MIGRATE_USERS | Migrate users to ERF module |
| ERF_UPDATE_DUR_RATES | Update duration-based repo rates |
| TEST | Test procedure |
| UPDATEABA0017 | Push ABA0017 data to TCMA/TCMB |

---

## Functions

| Function Name | Purpose |
|---------------|---------|
| MLAPERIODPRICE | Calculate MLA period price for a security |

---

## Synonyms (Links to MNET Backend)

| Synonym Name | Target |
|--------------|--------|
| ABA0019_PUBLIC_HOLIDAY | MS9ABA.ABA0019_PUBLIC_HOLIDAY@MNET |
| ABA0101_SB_SECURITY_MASTER | MS9ABA.ABA0101_SB_SECURITY_MASTER@MNET |
| ABA0124_SB_COUPON_RATE_DETAILS | MS9ABA.ABA0124_SB_COUPON_RATE_DETAILS@MNET |
| ABA0126_SB_REDEMPTION_RESULT | MS9ABA.ABA0126_SB_REDEMPTION_RESULT@MNET |
| ABA0127_SB_SYSTEM_CONFIG | MS9ABA.ABA0127_SB_SYSTEM_CONFIG@MNET |
| ABA0223_SB_PGP_CONFIG | MS9ABA.ABA0223_SB_PGP_CONFIG@MNET |

---

## Key Sequences

The schema uses many sequences for auto-generated IDs:
- SEQ_ABA0212_REPORT_ID
- SEQ_ABA0213_REPORT_FILE_ID
- SEQ_ABA0223_APPLICANT_ID
- SEQ_ABA0224_SUB_ID
- SEQ_ABA0225_SUB_DETAIL_ID
- SEQ_ABA0226_SUB_DT_ERR_ID
- SEQ_ABA0227_REDEM_ID
- SEQ_ABA0228_REDEM_DT_ID
- SEQ_ABA0229_REDEM_DT_ERR_ID
- SEQ_ABA0230_HLD_INFO_ID
- SEQ_ABA0231_HLD_INFO_DT_ID
- SEQ_ABA0232_ALLOT_RESULT_ID
- SEQ_ABA0233_BATCH_JOB_ID
- SEQ_ABA0234_JOB_EXECUTION_ID
- SEQ_ABA0235_SUB_SUMM_ID
- SEQ_ABA0236_HLD_INFO_DT_ERR_ID
- SEQ_ABA0241_RESULT_FILE_ID
- SEQ_ABA0250_AUDIT_ID
- SEQ_ABA0251_CONT_MAKE_CHECK_ID
- SEQ_ABA0252_SYSCONF_MAKE_CHECK

---

## Key Relationships (Foreign Keys)

### SB Module Relationships
```
ABA0223_SB_APPLICANT
    └── ABA0217_SB_CD_NATION (FK: CD_NATION)

ABA0224_SB_SUBSCRIPT
    ├── ABA0222_SB_ORG (FK: ORG_ID)
    ├── ABA0214_SB_CD_FILE_TYPE (FK: CD_FILE_TYPE)
    ├── ABA0233_SB_BATCH_JOB (FK: BATCH_JOB_ID)
    ├── ABA0219_SB_CD_FILE_ERROR_DESC (FK: CD_FILE_ERR_DESC)
    └── ABA0215_SB_CD_FILE_STATUS (FK: CD_FILE_STATUS)

ABA0225_SB_SUBSCRIPT_DT
    ├── ABA0223_SB_APPLICANT (FK: APPLICANT_ID)
    ├── ABA0224_SB_SUBSCRIPT (FK: SUB_ID)
    ├── ABA0240_SB_CD_SUBMISSION_TYPE (FK: SUB_METHOD)
    └── ABA0216_SB_CD_RECORD_STATUS (FK: CD_RECORD_STATUS)

ABA0232_SB_ALLOTMENT_RESULT
    ├── ABA0216_SB_CD_RECORD_STATUS (FK: CD_RECORD_STATUS)
    ├── ABA0225_SB_SUBSCRIPT_DT (FK: SUB_DETAIL_ID)
    ├── ABA0233_SB_BATCH_JOB (FK: BATCH_JOB_ID)
    └── ABA0220_SB_CD_RECORD_ERR_DESC (FK: CD_RECORD_ERR_DESC)
```

---

## Business Process Flow

### 1. Savings Bond Subscription Flow
1. Banks submit subscription files (AP1=Cash, SRS=SRS)
2. Files loaded into ABA0224_SB_SUBSCRIPT (header) and ABA0225_SB_SUBSCRIPT_DT (detail)
3. Applicants matched/created in ABA0223_SB_APPLICANT
4. Batch job processes submissions (ABA0233_SB_BATCH_JOB)
5. Allotment engine runs, results stored in ABA0232_SB_ALLOTMENT_RESULT
6. Result files generated (ABA0241_SB_RESULT_FILE)

### 2. Auction Processing Flow
1. Security setup in ABA0001_SECURITY_MASTER
2. Bids collected in AQA0002_TRANSACTION or AQA0006_EAPPS_TRANSACTION
3. Auction parameters set in AQA0008_SEC_AUCTION_PARA
4. Auction run indicator set in AQA0017_AUCTION_IND
5. Results computed and stored in ABA0006_AUCTION_RESULT and ABA0007_DETAIL_AUCTION_RESULT
6. Reports generated via views (VW_* and HOLD_ALLOT_REPORTS)

### 3. Holdings Reconciliation Flow
1. CDP/Banks send holding files
2. Files loaded into ABA0230_SB_HLD_INFO (header) and ABA0231_SB_HLD_INFO_DT (detail)
3. Matched against applicant records in ABA0223_SB_APPLICANT
4. Errors captured in ABA0236_SB_HLD_INFO_DT_ERR

---

## Data Backup Tables

Many tables have corresponding backup tables (suffix _BKUP or _BACKUP):
- ABA0223_SB_APPLICANT_BKUP
- ABA0224_SB_SUBSCRIPT_BKUP
- ABA0225_SB_SUBSCRIPT_DT_BKUP
- ABA0227_SB_REDEMPTION_BKUP
- ABA0228_SB_REDEMPTION_DT_BKUP
- ABA0230_SB_HLD_INFO_BKUP
- ABA0231_SB_HLD_INFO_DT_BKUP
- ABA0232_SB_ALLOTMENT_RESULT_BKUP
- ABA0233_SB_BATCH_JOB_BKUP
- ABA0234_SB_BATCH_JOB_EXECUTION_BKUP
- ABA0235_SB_SUBMISSION_SUMMARY_BKUP
- ABA0236_SB_HLD_INFO_DT_ERR_BKUP
- ABA0241_SB_RESULT_FILE_BKUP
- ABA0250_SB_AUDIT_LOG_BKUP

---

## Historical/Dated Tables

Some tables have date-stamped versions for point-in-time snapshots:
- ABA0001_SECURITY_MASTER_20230515
- ABA0001_SECURITY_MASTER_20230516
- ABA0001_SECURITY_MASTER_R2_20231212
- AQA0002_TRANSACTION_20231209
- AQA0017_AUCTION_IND_20230817
- AQA0020_AUCTION_RESULTS_REPORT_20231115

---

## Materialized View Logs

The schema includes materialized view logs for:
- MLOG$_ABA0223_SB_APPLICANT
- MLOG$_ABA0225_SB_SUBSCRIPT

These enable incremental refresh of materialized views for performance optimization.

---

## Security Considerations

1. **IC/Passport Protection**: Views use Base64 encoding to mask sensitive identification numbers
2. **Audit Logging**: Comprehensive audit tables (ABA0250_SB_AUDIT_LOG, AQA0107_AUDIT_LOG)
3. **Maker-Checker Controls**: ABA0251_SB_CONT_MAKE_CHECK, ABA0252_SB_SYSCONF_MAKE_CHECK
4. **User Session Management**: AQA0011_USER_SESSION, AQA0113_USER_SESSION
5. **Private Key Storage**: AQA0103_PRIVATE_KEY for encryption

---

## Document Information
- **Created**: 2026-01-17
- **Source**: FE_tri1.ddl (5,339 lines)
- **Purpose**: Claude AI comprehension of MAS Frontend Database Schema
