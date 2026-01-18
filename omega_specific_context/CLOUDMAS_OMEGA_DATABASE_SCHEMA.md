# CloudMAS Database Schema Documentation

> Comprehensive DDL, sample data, and master code reference for CloudMAS database schemas.
> Generated: 2026-01-17

## Overview

CloudMAS database contains 5 primary schemas:

| Schema | Purpose | Tables (excl. _t) |
|--------|---------|-------------------|
| **cm** | Common/Master Data | 9 tables |
| **sec** | Security Master | 2 tables |
| **iss** | Issuance Management | 19 tables |
| **stg** | Staging/Integration | 20 tables |
| **dpr** | (Reserved - Empty) | 0 tables |

**Note**: Tables with `_t` suffix are temporal/transaction tables for audit history.

---

# Master Code Reference (Complete)

All system lookup values organized by category.

## Master Code Categories

| Category Code | Description |
|---------------|-------------|
| `ALLOT` | Allotment Status |
| `BIDCOL` | Bid Collation Status |
| `BIDFSTAT` | Bid File Registry Status |
| `BIDFTYPE` | Bid File Type |
| `CALMETHOD` | Creation Methods |
| `CALPERIOD` | Calendar Periods |
| `CMSTAT` | Common Status |
| `ISSANN` | Announcement Status |
| `ISSBIDSTAT` | Bid Status |
| `ISSCAL` | Issuance Calendar Status |
| `ISSSTAT` | Issuance Status |
| `ISSSUBMTH` | Bid Submission Method |
| `ISSTYPE` | Issuance Types |
| `MOSALE` | Method of Sale |
| `SECTYPE` | Security Types |
| `SGSTYPE` | SGS Types |
| `TENOR` | Tenor Units |
| `USERACT` | Workflow User Actions |

---

## ALLOT - Allotment Status

| Code Key | Value | Description |
|----------|-------|-------------|
| `ALLOTSTAT_CANCELLED` | CANCELLED | Cancelled |
| `ALLOTSTAT_UNPUBLISHED` | UNPUBLISHED | Unpublished |
| `ALLOTSTAT_SCHEDULED` | SCHEDULED | Scheduled |
| `ALLOTSTAT_PENDING_APPROVAL` | PENDING_APPROVAL | Pending approval |
| `ALLOTSTAT_PENDING_VERIFICATION` | PENDING_VERIFICATION | Pending verification |
| `ALLOTSTAT_IN_PROGRESS` | IN_PROGRESS | In progress |
| `ALLOTSTAT_PENDING_PUBLICATION` | PENDING_PUBLICATION | Pending publication |
| `ALLOTSTAT_ERROR` | ERROR | Error |
| `ALLOTSTAT_RESULTS_PUBLISHED` | RESULTS_PUBLISHED | Results published |

## BIDCOL - Bid Collation Status

| Code Key | Value | Description |
|----------|-------|-------------|
| `BIDCOLSTAT_OPEN` | OPEN | Open |
| `BIDCOLSTAT_CLOSED` | CLOSED | Closed |

## BIDFSTAT - Bid File Registry Status

| Code Key | Value | Description |
|----------|-------|-------------|
| `BIDFSTAT_PROCESSING` | PROCESSING | Processing |
| `BIDFSTAT_PARTIAL_PROCESSED` | PARTIAL_PROCESSED | Partial Processed |
| `BIDFSTAT_FULL_PROCESSED` | FULL_PROCESSED | Full Processed |
| `BIDFSTAT_FAILED` | FAILED | Failed |

## BIDFTYPE - Bid File Type

| Code Key | Value | Description |
|----------|-------|-------------|
| `BIDFTYPE_INST_FILEUPLOAD` | INSTITUTIONAL_FILEUPLOAD | Institutional Bid File Upload |
| `BIDFTYPE_RETAIL_FILEUPLOAD` | RETAIL_FILEUPLOAD | Retail Bid File Upload |
| `BIDFTYPE_RETAIL_AP1` | RETAIL_INTERFACE_CASH | Retail Interface (Cash/AP1) |
| `BIDFTYPE_RETAIL_AP2` | RETAIL_INTERFACE_CPFIS | Retail Interface (CPFIS/AP2) |
| `BIDFTYPE_RETAIL_AP3` | RETAIL_INTERFACE_SRS | Retail Interface (SRS/AP3) |

## CALMETHOD - Creation Methods

| Code Key | Value | Description |
|----------|-------|-------------|
| `CALMETHOD_ALGO` | ALGO | Algorithm |
| `CALMETHOD_MANUAL` | MANUAL | Manual Entry |
| `CALMETHOD_UPLOAD` | UPLOAD | File Upload |

## CALPERIOD - Calendar Periods

| Code Key | Value | Description |
|----------|-------|-------------|
| `CALPERIOD_H1` | H1 | First Half |
| `CALPERIOD_H2` | H2 | Second Half |
| `CALPERIOD_YEARLY` | YEARLY | Yearly |

## CMSTAT - Common Status

| Code Key | Value | Description |
|----------|-------|-------------|
| `CMSTAT_ACTIVE` | ACTIVE | Active |
| `CMSTAT_DELETED` | DELETED | Deleted |
| `CMSTAT_INACTIVE` | INACTIVE | Inactive |
| `CMSTAT_TEMPORARY` | TEMPORARY | Temporary |

## ISSANN - Announcement Status

| Code Key | Value | Description |
|----------|-------|-------------|
| `ISSANNSTAT_UNPUBLISHED` | UNPUBLISHED | Unpublished |
| `ISSANNSTAT_DRAFT` | DRAFT | Draft |
| `ISSANNSTAT_PENDING_APPROVAL` | PENDING_APPROVAL | Pending approval |
| `ISSANNSTAT_PENDING_MEPS` | PENDING_MEPS | Pending MEPS+ |
| `ISSANNSTAT_PENDING_PUBLICATION` | PENDING_PUBLICATION | Pending publication |
| `ISSANNSTAT_MEPS_ERROR` | MEPS_ERROR | MEPS+ error |
| `ISSANNSTAT_PUBLISHED` | PUBLISHED | Published |
| `ISSANNSTAT_REJECTED` | REJECTED | Rejected |

## ISSBIDSTAT - Bid Status

| Code Key | Value | Description |
|----------|-------|-------------|
| `ISSBIDSTAT_PENDING_APPROVAL` | PENDING_APPROVAL | Pending Approval |
| `ISSBIDSTAT_SUBMITTED` | SUBMITTED | Submitted (Approved) |
| `ISSBIDSTAT_ACCEPTED` | ACCEPTED | Accepted |
| `ISSBIDSTAT_ALLOTTED` | ALLOTTED | Allotted |
| `ISSBIDSTAT_REJECTED` | REJECTED | Rejected |
| `ISSBIDSTAT_DELETED` | DELETED | Deleted |

## ISSCAL - Issuance Calendar Status

| Code Key | Value | Description |
|----------|-------|-------------|
| `ISSCALSTAT_DRAFT` | DRAFT | Draft |
| `ISSCALSTAT_PENDING_APPROVAL` | PENDING_APPROVAL | Pending approval |
| `ISSCALSTAT_PENDING_PUBLICATION` | PENDING_PUBLICATION | Pending publication |
| `ISSCALSTAT_PUBLISHED` | PUBLISHED | Published |
| `ISSCALSTAT_REJECTED` | REJECTED | Rejected |

## ISSSTAT - Issuance Status

| Code Key | Value | Description |
|----------|-------|-------------|
| `ISSSTAT_DRAFT` | DRAFT | Draft |
| `ISSSTAT_PUBLISHED` | PUBLISHED | Published |
| `ISSSTAT_UNPUBLISHED` | UNPUBLISHED | Unpublished |

## ISSSUBMTH - Bid Submission Method

| Code Key | Value | Description |
|----------|-------|-------------|
| `ISSSUBMTH_MANUAL` | MANUAL | Manual Entry |
| `ISSSUBMTH_FILE_UPLOAD` | FILE_UPLOAD | File Upload |
| `ISSSUBMTH_INTERFACE` | INTERFACE | Interface |

## ISSTYPE - Issuance Types

| Code Key | Value | Description |
|----------|-------|-------------|
| `ISSTYPE_AUCTION` | AUCTION | Auction |
| `ISSTYPE_SYNDICATION` | SYNDICATION | Syndication |
| `ISSTYPE_MINIAUCTION` | MINI_AUCTION | Mini Auction |

## MOSALE - Method of Sale

| Code Key | Value | Description |
|----------|-------|-------------|
| `MOSALE_UNIFORM_PRICE` | UNIFORM_PRICE | Uniform Price |
| `MOSALE_QTY_CEILING` | QTY_CEILING | Quantity Ceiling |

## SECTYPE - Security Types

| Code Key | Value | Description |
|----------|-------|-------------|
| `SECTYPE_SGS` | SGS | SGS Bond |
| `SECTYPE_TBILL` | TBILL | T-Bill |
| `SECTYPE_MASBILL` | MASBILL | MAS Bill |
| `SECTYPE_SSB` | SSB | Singapore Savings Bond |
| `SECTYPE_CMTB` | CMTB | Cash Management Treasury Bill |
| `SECTYPE_FRN` | FRN | Floating Rate Note |

## SGSTYPE - SGS Types

| Code Key | Value | Description |
|----------|-------|-------------|
| `SGSTYPE_MD` | MARKET_DEV | Market Development |
| `SGSTYPE_INFRA` | INFRA | Infrastructure |
| `SGSTYPE_GREEN_INFRA` | GREEN | Green Bond |

## TENOR - Tenor Units

| Code Key | Value | Description |
|----------|-------|-------------|
| `TENOR_YEAR` | YEAR | Year |
| `TENOR_MONTH` | MONTH | Month |
| `TENOR_DAY` | DAY | Day |

## USERACT - Workflow User Actions

| Code Key | Value | Description |
|----------|-------|-------------|
| `USERACT_CREATE` | CREATE | Create |
| `USERACT_SUBMIT` | SUBMIT | Submit |
| `USERACT_APPROVE` | APPROVE | Approve |
| `USERACT_REJECT` | REJECT | Reject |
| `USERACT_WITHDRAW` | WITHDRAW | Withdraw |
| `USERACT_UPDATE` | UPDATE | Update |
| `USERACT_UNPUBLISH` | UNPUBLISH | Unpublish |
| `USERACT_OVERRIDE` | OVERRIDE | Override |
| `USERACT_DELETE` | DELETE | Delete |

---

# CM Schema (Common/Master Data)

Master reference data for banks, batch jobs, codes, properties, and holidays.

## cm.cm_bank_master

**Description**: Stores master reference data for Banks, including flags and Savings Bond specific configurations.

### DDL

```sql
CREATE TABLE cm.cm_bank_master (
    id                    BIGINT NOT NULL,
    uuid                  VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    bank_code             VARCHAR(10) NOT NULL,
    bank_name             VARCHAR(255),
    bank_shortname        VARCHAR(20),
    autodebit_indicator   CHAR(1),
    participant_indicator CHAR(1),
    is_primary_dealer     CHAR(1) DEFAULT 'N',
    is_mas_repo_eligible  CHAR(1) DEFAULT 'N',
    is_mas_user           CHAR(1) DEFAULT 'N',
    sb_org_type           CHAR(1),           -- Savings Bond organization type
    sb_omnibus_acc_no     VARCHAR(16),       -- Savings Bond omnibus account
    sb_member_code        VARCHAR(8),        -- Savings Bond member code
    sb_custody_code       VARCHAR(3),        -- Savings Bond custody code
    version               NUMERIC(5,0) NOT NULL DEFAULT 1,
    is_deleted            CHAR(1) NOT NULL DEFAULT 'N',
    is_migrated           CHAR(1) NOT NULL DEFAULT 'N',
    created_dt            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by            VARCHAR(36) NOT NULL,
    updated_dt            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by            VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

### Sample Data

```json
[
  {
    "id": "150000000000001",
    "uuid": "test-bank-pd001",
    "bank_code": "PD001",
    "bank_name": "Test Primary Dealer 1",
    "bank_shortname": "TPD1",
    "is_primary_dealer": "Y",
    "is_mas_repo_eligible": "N",
    "is_mas_user": "N",
    "created_by": "SYSTEM",
    "updated_by": "MEPS+"
  },
  {
    "id": "150000000000002",
    "uuid": "test-bank-pd002",
    "bank_code": "PD002",
    "bank_name": "Test Primary Dealer 2",
    "bank_shortname": "TPD2",
    "is_primary_dealer": "Y",
    "is_mas_repo_eligible": "N",
    "is_mas_user": "N"
  },
  {
    "id": "150000000000003",
    "uuid": "test-bank-001",
    "bank_code": "BANK001",
    "bank_name": "Test Commercial Bank 1",
    "bank_shortname": "TCB1",
    "is_primary_dealer": "N"
  },
  {
    "id": "150000000000004",
    "uuid": "test-bank-retail",
    "bank_code": "RETAIL001",
    "bank_name": "Test Retail Bank",
    "bank_shortname": "TRB",
    "is_primary_dealer": "N"
  },
  {
    "id": "150000000001288",
    "uuid": "07b9b33b-3395-474e-a5d1-cfa07cdeae47",
    "bank_code": "0101",
    "bank_name": "TEST Bic MASGSGSM",
    "bank_shortname": "MASGSGSM",
    "autodebit_indicator": "Y",
    "participant_indicator": "Y"
  },
  {
    "id": "150000000001290",
    "uuid": "cbcadbc4-df6c-40fb-948b-dfd03c496b8b",
    "bank_code": "1002",
    "bank_name": "IMF A/C 1",
    "bank_shortname": "IMFDACC1",
    "autodebit_indicator": "N",
    "participant_indicator": "N",
    "is_primary_dealer": "Y"
  }
]
```

---

## cm.cm_bank_master_map

**Description**: Stores mappings between bank codes and internal system references.

### DDL

```sql
CREATE TABLE cm.cm_bank_master_map (
    id                BIGINT NOT NULL,
    uuid              VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    ref_id            VARCHAR(36) NOT NULL,    -- External reference ID
    cm_bank_master_id VARCHAR(36) NOT NULL,    -- FK to cm_bank_master.uuid
    version           NUMERIC(5,0) NOT NULL,
    is_deleted        CHAR(1) NOT NULL,
    is_migrated       CHAR(1) NOT NULL,
    created_dt        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by        VARCHAR(36) NOT NULL,
    updated_dt        TIMESTAMP NOT NULL,
    updated_by        VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## cm.cm_batch_job

**Description**: Stores header information for system batch job executions.

### DDL

```sql
CREATE TABLE cm.cm_batch_job (
    id                  BIGINT NOT NULL,
    uuid                VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    job_id_code         VARCHAR(50),
    job_name            VARCHAR(255),
    job_parameter_json  TEXT,              -- JSON parameters for the job
    job_handler         VARCHAR(1024),     -- Handler class/function reference
    start_datetime      TIMESTAMP,
    end_datetime        TIMESTAMP,
    status_code         VARCHAR(50),       -- RUNNING, COMPLETED, FAILED, etc.
    job_type            VARCHAR(50),
    exception_details   TEXT,              -- Error stack trace if failed
    outcome             TEXT,              -- Job result/summary
    version             NUMERIC(5,0) NOT NULL,
    is_deleted          CHAR(1) NOT NULL,
    is_migrated         CHAR(1) NOT NULL,
    created_dt          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          VARCHAR(36) NOT NULL,
    updated_dt          TIMESTAMP NOT NULL,
    updated_by          VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## cm.cm_batch_job_detail

**Description**: Stores detailed execution logs, steps, and status for specific batch jobs.

### DDL

```sql
CREATE TABLE cm.cm_batch_job_detail (
    id                BIGINT NOT NULL,
    uuid              VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    cm_batch_job_uuid VARCHAR(36),         -- FK to cm_batch_job.uuid
    ref_id            VARCHAR(36),         -- Reference to related entity
    ref_table         VARCHAR(100),        -- Source table name
    status            VARCHAR(100),
    txn_id            VARCHAR(100),        -- Transaction ID
    remark            VARCHAR(4000),
    version           NUMERIC(5,0) NOT NULL,
    is_deleted        CHAR(1) NOT NULL,
    is_migrated       CHAR(1) NOT NULL,
    created_dt        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by        VARCHAR(36) NOT NULL,
    updated_dt        TIMESTAMP NOT NULL,
    updated_by        VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## cm.cm_documents

**Description**: Stores document metadata with S3/storage references.

### DDL

```sql
CREATE TABLE cm.cm_documents (
    id            BIGINT NOT NULL,
    uuid          VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    ref_id        VARCHAR(36),           -- Related entity UUID
    ref_type      VARCHAR(16),           -- Entity type (ISSUANCE, CALENDAR, etc.)
    bucket        VARCHAR(128) NOT NULL, -- S3 bucket name
    path          VARCHAR(256) NOT NULL, -- S3 object path
    file_name     VARCHAR(128) NOT NULL,
    s3_version_id VARCHAR(1024),         -- S3 version for versioned buckets
    version       NUMERIC(5,0) NOT NULL,
    is_deleted    CHAR(1) NOT NULL,
    is_migrated   CHAR(1) NOT NULL,
    created_dt    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by    VARCHAR(36) NOT NULL,
    updated_dt    TIMESTAMP NOT NULL,
    updated_by    VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## cm.cm_master_code

**Description**: Stores system-wide reference data, lookup values, and enumerations.

### DDL

```sql
CREATE TABLE cm.cm_master_code (
    id                    BIGINT NOT NULL,
    uuid                  VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    master_code_key       VARCHAR(50) NOT NULL,  -- Unique key identifier
    mastercode_category_id VARCHAR(36),          -- FK to cm_master_code_category
    code_value            VARCHAR(512) NOT NULL, -- Actual code value
    code_description      VARCHAR(512),          -- Human-readable description
    filter_value          VARCHAR(512),          -- Additional filter criteria
    sequence_no           NUMERIC NOT NULL,      -- Display order
    remarks               VARCHAR(255),
    status                VARCHAR(20) NOT NULL,  -- CMSTAT_ACTIVE, etc.
    effective_from        TIMESTAMP NOT NULL,
    effective_to          TIMESTAMP,
    version               NUMERIC(5,0) NOT NULL,
    is_editable           CHAR(1),
    is_centrally_managed  CHAR(1),
    is_deleted            CHAR(1) NOT NULL,
    is_migrated           CHAR(1) NOT NULL,
    created_dt            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by            VARCHAR(36) NOT NULL,
    updated_dt            TIMESTAMP NOT NULL,
    updated_by            VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

### Sample Data

> **Note**: See "Master Code Reference (Complete)" section above for all master codes.

```json
[
  {
    "master_code_key": "SECTYPE_SGS",
    "mastercode_category_id": "f233c2f6-8b2a-4449-96d2-0f5eb6e7ead2",
    "code_value": "SGS",
    "code_description": "SGS Bond",
    "sequence_no": "10",
    "status": "CMSTAT_ACTIVE",
    "is_editable": "Y",
    "is_centrally_managed": "N"
  },
  {
    "master_code_key": "SECTYPE_TBILL",
    "code_value": "TBILL",
    "code_description": "T-Bill",
    "sequence_no": "20",
    "status": "CMSTAT_ACTIVE"
  },
  {
    "master_code_key": "SECTYPE_SSB",
    "code_value": "SSB",
    "code_description": "Singapore Savings Bond",
    "sequence_no": "40",
    "status": "CMSTAT_ACTIVE"
  }
]
```

---

## cm.cm_master_code_category

**Description**: Stores categories and types used for grouping master codes.

### DDL

```sql
CREATE TABLE cm.cm_master_code_category (
    id                  BIGINT NOT NULL,
    uuid                VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    category_description VARCHAR(512),
    is_editable         CHAR(1) NOT NULL,
    cate_code           VARCHAR(20),        -- Category code
    version             NUMERIC(5,0) NOT NULL,
    is_deleted          CHAR(1) NOT NULL,
    is_migrated         CHAR(1) NOT NULL,
    created_dt          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          VARCHAR(36) NOT NULL,
    updated_dt          TIMESTAMP NOT NULL,
    updated_by          VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

### Sample Data

```json
[
  {
    "uuid": "f233c2f6-8b2a-4449-96d2-0f5eb6e7ead2",
    "cate_code": "SECTYPE",
    "category_description": "Security Types",
    "is_editable": "Y"
  },
  {
    "uuid": "63d57034-6317-49b6-97d6-f80149787f3d",
    "cate_code": "ISSCAL",
    "category_description": "Issuance Calendar Status",
    "is_editable": "Y"
  },
  {
    "uuid": "8b570393-e9f2-4a4a-9c8a-811ca777cc81",
    "cate_code": "ISSANN",
    "category_description": "Announcement Status",
    "is_editable": "Y"
  },
  {
    "uuid": "f9215639-e15a-4051-a132-220263edc874",
    "cate_code": "USERACT",
    "category_description": "Workflow User Actions",
    "is_editable": "Y"
  },
  {
    "uuid": "3761e3a0-c08a-4043-91da-6008adf33fac",
    "cate_code": "ALLOT",
    "category_description": "Allotment Status",
    "is_editable": "Y"
  }
]
```

---

## cm.cm_properties

**Description**: Stores application configuration settings and key-value pairs.

### DDL

```sql
CREATE TABLE cm.cm_properties (
    id          BIGINT NOT NULL,
    uuid        VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    application VARCHAR(50) NOT NULL,   -- Application name
    profile     VARCHAR(50) NOT NULL,   -- Environment profile (dev, uat, prod)
    label       VARCHAR(50) NOT NULL,   -- Configuration label/version
    key         VARCHAR(255) NOT NULL,  -- Property key
    value       VARCHAR(4000) NOT NULL, -- Property value
    version     NUMERIC(5,0) NOT NULL,
    is_deleted  CHAR(1) NOT NULL,
    is_migrated CHAR(1) NOT NULL,
    created_dt  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  VARCHAR(36) NOT NULL,
    updated_dt  TIMESTAMP NOT NULL,
    updated_by  VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## cm.cm_public_holiday

**Description**: Stores the list of public holidays for relevant countries.

### DDL

```sql
CREATE TABLE cm.cm_public_holiday (
    id          BIGINT NOT NULL,
    uuid        VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    date        TIMESTAMP NOT NULL,
    description VARCHAR(255) NOT NULL,
    country     VARCHAR(2) NOT NULL,    -- ISO country code (SG, etc.)
    status      VARCHAR(20) NOT NULL,   -- ACTIVE, INACTIVE
    version     NUMERIC(5,0) NOT NULL DEFAULT 1,
    is_deleted  CHAR(1) NOT NULL DEFAULT 'N',
    is_migrated CHAR(1) NOT NULL DEFAULT 'N',
    created_dt  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by  VARCHAR(36) NOT NULL,
    updated_dt  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by  VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

### Sample Data

```json
[
  {"date": "2025-01-01", "description": "New Year's Day", "country": "SG", "status": "ACTIVE"},
  {"date": "2025-01-29", "description": "Chinese New Year", "country": "SG", "status": "ACTIVE"},
  {"date": "2025-01-30", "description": "Chinese New Year", "country": "SG", "status": "ACTIVE"},
  {"date": "2025-03-31", "description": "Hari Raya Puasa", "country": "SG", "status": "ACTIVE"},
  {"date": "2025-04-18", "description": "Good Friday", "country": "SG", "status": "ACTIVE"},
  {"date": "2025-05-01", "description": "Labour Day", "country": "SG", "status": "ACTIVE"},
  {"date": "2025-05-03", "description": "Polling Day", "country": "SG", "status": "ACTIVE"},
  {"date": "2025-05-12", "description": "Vesak Day", "country": "SG", "status": "ACTIVE"},
  {"date": "2025-06-07", "description": "Hari Raya Haji", "country": "SG", "status": "ACTIVE"},
  {"date": "2025-08-09", "description": "National Day", "country": "SG", "status": "ACTIVE"}
]
```

---

# SEC Schema (Security Master)

Security master data and coupon schedules.

## sec.sec_security_master

**Description**: Stores the master list of securities and their core static data.

### DDL

```sql
CREATE TABLE sec.sec_security_master (
    id                      BIGINT NOT NULL,
    uuid                    VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    isin_code               VARCHAR(12) NOT NULL,  -- International Securities ID
    issue_code              VARCHAR(8) NOT NULL,   -- Local issue code
    issue_desc              VARCHAR(30),           -- Issue description
    tax_status              CHAR(1),               -- Y/N taxable
    etender_ind             CHAR(1),               -- Y/N e-tender eligible
    currency                CHAR(3),               -- Currency code (SGD)
    sgs_type                VARCHAR(20),           -- SGSTYPE_MD, SGSTYPE_INF, etc.
    first_coupon_payment_dt TIMESTAMP,
    coupon_pay_frequency    VARCHAR(20),           -- SEMI_ANNUALLY, ANNUALLY, etc.
    version                 NUMERIC(5,0) NOT NULL,
    is_deleted              CHAR(1) NOT NULL,
    is_migrated             CHAR(1) NOT NULL,
    created_dt              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by              VARCHAR(36) NOT NULL,
    updated_dt              TIMESTAMP NOT NULL,
    updated_by              VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

### Sample Data

```json
[
  {
    "uuid": "73045a63-50ef-433f-9c3f-e913981b18d6",
    "isin_code": "MDDAUG240018",
    "issue_code": "BS24080A",
    "issue_desc": "182D TBILL 2024 DUE030325 BS24",
    "tax_status": "Y",
    "etender_ind": "Y",
    "currency": "SGD",
    "sgs_type": null,
    "coupon_pay_frequency": null
  },
  {
    "uuid": "f789df0b-f15b-4962-9bf5-8c28a2222bdf",
    "isin_code": "MDDAUG240075",
    "issue_code": "GX14005E",
    "issue_desc": "10YR BOND 2024 DUE010934 NX240",
    "tax_status": "Y",
    "etender_ind": "Y",
    "currency": "SGD",
    "first_coupon_payment_dt": "2025-03-01",
    "coupon_pay_frequency": "SEMI_ANNUALLY"
  },
  {
    "uuid": "e4637db3-ebd0-4dd4-8177-1c7cad3ec334",
    "isin_code": "SGXF25686589",
    "issue_code": "NX25100H",
    "issue_desc": "10YR BOND 2025 DUE030325",
    "tax_status": "Y",
    "etender_ind": "Y",
    "currency": "SGD",
    "sgs_type": "SGSTYPE_MD",
    "first_coupon_payment_dt": "2026-07-01",
    "coupon_pay_frequency": "SEMI_ANNUALLY",
    "created_by": "OMEGA"
  },
  {
    "uuid": "4b970f2c-6360-473d-ab5d-5d77f5f29e89",
    "isin_code": "SGXZ50596402",
    "issue_code": "GX26020S",
    "issue_desc": "10YR BOND 2024 DUE010934",
    "tax_status": "N",
    "etender_ind": "Y",
    "currency": "SGD",
    "first_coupon_payment_dt": "2026-08-01",
    "coupon_pay_frequency": "SEMI_ANNUALLY"
  }
]
```

---

## sec.sec_coupon_schedule

**Description**: Stores the schedule of coupon payments for securities.

### DDL

```sql
CREATE TABLE sec.sec_coupon_schedule (
    id                    BIGINT NOT NULL,
    uuid                  VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    sec_security_master_id VARCHAR(36) NOT NULL,  -- FK to sec_security_master.uuid
    coupon_index          NUMERIC(2,0) NOT NULL,  -- Payment sequence number
    coupon_payment_dt     TIMESTAMP NOT NULL,     -- Payment date
    version               NUMERIC(5,0) NOT NULL,
    is_deleted            CHAR(1) NOT NULL,
    is_migrated           CHAR(1) NOT NULL,
    created_dt            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by            VARCHAR(36) NOT NULL,
    updated_dt            TIMESTAMP NOT NULL,
    updated_by            VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

# ISS Schema (Issuance Management)

Core issuance lifecycle management - calendars, announcements, bids, allotments.

## iss.iss_issuance

**Description**: Core issuance records linking securities to specific auctions/offerings.

### DDL

```sql
CREATE TABLE iss.iss_issuance (
    id                      BIGINT NOT NULL,
    uuid                    VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    sec_security_master_id  VARCHAR(36),          -- FK to sec_security_master
    issue_no                VARCHAR(10),          -- Issue number within security
    issuance_type           VARCHAR(20),          -- AUCTION, SYNDICATION, etc.
    status                  VARCHAR(30),          -- ISSSTAT_DRAFT, ISSSTAT_PUBLISHED
    auction_status          VARCHAR(20),          -- OPEN, CLOSED
    issue_dt                TIMESTAMP,
    auction_dt              TIMESTAMP,
    bid_submission_end_dt   TIMESTAMP,
    maturity_dt             TIMESTAMP,
    total_amount_offered    NUMERIC,
    qty_applied             NUMERIC,
    avg_yield               NUMERIC(10,2),
    cutoff_yield            NUMERIC(10,2),
    cutoff_yield_pct        NUMERIC,
    subscription_pct        NUMERIC,
    non_comp_allotment_pct  NUMERIC,
    non_comp_qty_allotted   NUMERIC,
    coupon_rate             NUMERIC(10,4),
    cutoff_yield_price      NUMERIC(10,4),
    avg_price               NUMERIC,
    closing_price           NUMERIC(10,4),
    tenor                   VARCHAR(10),          -- 182, 10, etc.
    tenor_unit              CHAR(1),              -- D=Days, Y=Years, M=Months
    mas_intended_tender_amt NUMERIC,
    mas_alloted_amt         NUMERIC,
    int_paid_ind            CHAR(1),              -- Y/N
    last_coupon_payment_dt  TIMESTAMP,
    next_coupon_payment_dt  TIMESTAMP,
    accrued_interest_days   NUMERIC,
    ex_int_date             TIMESTAMP,
    announcement_dt         TIMESTAMP,
    denomination            VARCHAR(10),          -- 500, 1000
    new_reopen_flag         CHAR(1),              -- N=New, R=Reopen
    issue_type              VARCHAR(20),          -- SECTYPE_TBILL, SECTYPE_SGS, SECTYPE_SSB
    pricing_dt              TIMESTAMP,
    public_offer_start_dt   TIMESTAMP,
    public_offer_end_dt     TIMESTAMP,
    app_closing_dt          TIMESTAMP,
    is_benchmark            CHAR(1),
    version                 NUMERIC(5,0) NOT NULL,
    is_deleted              CHAR(1) NOT NULL,
    is_migrated             CHAR(1) NOT NULL,
    created_dt              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by              VARCHAR(36) NOT NULL,
    updated_dt              TIMESTAMP NOT NULL,
    updated_by              VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

### Sample Data

```json
[
  {
    "uuid": "7fa82135-b569-4c40-8f1f-f4901e949773",
    "sec_security_master_id": "73045a63-50ef-433f-9c3f-e913981b18d6",
    "issue_no": "1",
    "issuance_type": "AUCTION",
    "status": "ISSSTAT_DRAFT",
    "auction_status": "OPEN",
    "issue_dt": "2024-09-02",
    "auction_dt": "2024-08-16",
    "bid_submission_end_dt": "2026-02-13",
    "total_amount_offered": "20000000000",
    "tenor": "182",
    "tenor_unit": "D",
    "denomination": "1000",
    "issue_type": "SECTYPE_TBILL",
    "maturity_dt": "2025-03-03"
  },
  {
    "uuid": "b472125d-4290-4d84-8cdd-12964d84510a",
    "sec_security_master_id": "f789df0b-f15b-4962-9bf5-8c28a2222bdf",
    "issue_no": "1",
    "issuance_type": "AUCTION",
    "status": "ISSSTAT_PUBLISHED",
    "auction_status": "OPEN",
    "total_amount_offered": "2000000000",
    "tenor": "10",
    "tenor_unit": "Y",
    "denomination": "500",
    "issue_type": "SECTYPE_SSB",
    "mas_intended_tender_amt": "600000000",
    "int_paid_ind": "N"
  }
]
```

---

## iss.iss_announcement_details

**Description**: Stores announcement details for issuances (pre-auction publication).

### DDL

```sql
CREATE TABLE iss.iss_announcement_details (
    id                       BIGINT NOT NULL,
    uuid                     VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    iss_issuance_id          VARCHAR(36),
    calendar_data_ref_id     VARCHAR(36),
    issue_code               VARCHAR(8),
    isin_code                VARCHAR(12),
    issue_type               VARCHAR(20),          -- SECTYPE_SGS, etc.
    issuance_type            VARCHAR(20),          -- AUCTION
    sgs_type                 VARCHAR(20),          -- SGSTYPE_MD, SGSTYPE_INF
    tenor                    VARCHAR(10),
    tenor_unit               CHAR(1),
    new_reopen_flag          CHAR(1),
    is_benchmark             CHAR(1),
    announcement_dt          TIMESTAMP,
    auction_dt               TIMESTAMP,
    issue_dt                 TIMESTAMP,
    maturity_dt              TIMESTAMP,
    publication_dt           TIMESTAMP,
    first_coupon_payment_dt  TIMESTAMP,
    next_coupon_payment_dt   TIMESTAMP,
    pricing_dt               TIMESTAMP,
    public_offer_start_dt    TIMESTAMP,
    public_offer_end_dt      TIMESTAMP,
    app_closing_dt           TIMESTAMP,
    total_amount_offered     NUMERIC,
    mas_intended_tender_amt  NUMERIC,
    coupon_rate              TEXT,                 -- May contain text like "To be determined..."
    accrued_interest_days    VARCHAR(10),
    footnotes                TEXT,                 -- HTML content for public notice
    remarks                  TEXT,
    is_published_immediately CHAR(1),
    user_action              VARCHAR(30),          -- USERACT_SUBMIT, USERACT_OVERRIDE
    status                   VARCHAR(30),          -- ISSANNSTAT_DRAFT, ISSANNSTAT_PUBLISHED
    wf_process_id            VARCHAR(50),          -- Workflow process reference
    version                  NUMERIC(5,0) NOT NULL,
    is_deleted               CHAR(1) NOT NULL,
    is_migrated              CHAR(1) NOT NULL,
    created_dt               TIMESTAMP NOT NULL,
    created_by               VARCHAR(36) NOT NULL,
    updated_dt               TIMESTAMP NOT NULL,
    updated_by               VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

### Sample Data

```json
[
  {
    "uuid": "68d14aab-43f5-4378-8a5a-f7afec444dab",
    "calendar_data_ref_id": "76b6a9d0-4b10-4925-a26c-5da6242f4213",
    "issue_code": "NX25100H",
    "isin_code": "SGXF25686589",
    "issue_type": "SECTYPE_SGS",
    "issuance_type": "AUCTION",
    "sgs_type": "SGSTYPE_MD",
    "tenor": "10",
    "tenor_unit": "Y",
    "new_reopen_flag": "R",
    "is_benchmark": "N",
    "announcement_dt": "2026-01-07",
    "auction_dt": "2026-01-13",
    "issue_dt": "2026-01-16",
    "maturity_dt": "2036-01-01",
    "first_coupon_payment_dt": "2026-07-01",
    "total_amount_offered": "110000000000",
    "mas_intended_tender_amt": "90000000000",
    "coupon_rate": "To be determined based on the cut-off yield of successful applications.",
    "accrued_interest_days": "61",
    "footnotes": "<p>This is a public notice issued pursuant to Section 17 of the Significant Infrastructure Government Loan Act.</p>",
    "is_published_immediately": "Y",
    "user_action": "USERACT_OVERRIDE",
    "status": "ISSANNSTAT_PUBLISHED"
  }
]
```

---

## iss.iss_bid_institutional

**Description**: Institutional bid submissions (Primary Dealers, Banks).

### DDL

```sql
CREATE TABLE iss.iss_bid_institutional (
    id                    BIGINT NOT NULL,
    uuid                  VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    iss_issuance_id       VARCHAR(36),           -- FK to iss_issuance
    cm_bank_master_map_id VARCHAR(36),           -- FK to bank mapping
    allotment_run_id      VARCHAR(36),           -- FK to allotment run
    bank_ref_no           VARCHAR(20),           -- Bank's reference number
    submission_ref_id     VARCHAR(36),
    applicant_type        VARCHAR(10),           -- PD, BANK
    applicant_name        VARCHAR(100),
    settlement_bank_code  VARCHAR(10),           -- DBS, OCBC, etc.
    custody_code          VARCHAR(10),           -- CDP, etc.
    nominal_amount        NUMERIC(18,2),
    accepted_amount       NUMERIC,
    allotted_amount       NUMERIC(18,2),
    is_competitive        CHAR(1),               -- Y/N
    yield_pct             NUMERIC(10,2),         -- For competitive bids
    price                 NUMERIC,
    submission_method     VARCHAR(20),           -- MANUAL, FILE, API
    user_action           VARCHAR(20),           -- SUBMIT
    status                VARCHAR(20),           -- ACTIVE, CANCELLED
    remarks               TEXT,
    version               NUMERIC(5,0) NOT NULL,
    is_deleted            CHAR(1) NOT NULL,
    is_migrated           CHAR(1) NOT NULL,
    created_dt            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by            VARCHAR(36) NOT NULL,
    updated_dt            TIMESTAMP NOT NULL,
    updated_by            VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

### Sample Data

```json
[
  {
    "uuid": "test-bid-comp-001",
    "iss_issuance_id": "test-issuance-001",
    "cm_bank_master_map_id": "test-map-pd001",
    "bank_ref_no": "BIDREF001",
    "applicant_type": "PD",
    "applicant_name": "Test Primary Dealer 1",
    "settlement_bank_code": "DBS",
    "custody_code": "CDP",
    "nominal_amount": "10000000.00",
    "allotted_amount": "10000000.00",
    "accepted_amount": "10000000",
    "is_competitive": "Y",
    "yield_pct": "2.50",
    "submission_method": "MANUAL",
    "user_action": "SUBMIT",
    "status": "ACTIVE"
  },
  {
    "uuid": "test-bid-noncomp-002",
    "iss_issuance_id": "test-issuance-001",
    "cm_bank_master_map_id": "test-map-bank001",
    "bank_ref_no": "BIDREF005",
    "applicant_type": "BANK",
    "applicant_name": "Test Commercial Bank 1",
    "settlement_bank_code": "OCBC",
    "custody_code": "CDP",
    "nominal_amount": "500000.00",
    "allotted_amount": "500000.00",
    "accepted_amount": "500000",
    "is_competitive": "N",
    "submission_method": "MANUAL",
    "status": "ACTIVE"
  }
]
```

---

## iss.iss_bid_retail

**Description**: Retail investor bid submissions (individual investors).

### DDL

```sql
CREATE TABLE iss.iss_bid_retail (
    id                  BIGINT NOT NULL,
    uuid                VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    iss_issuance_id     VARCHAR(36),
    retail_bank_id      VARCHAR(36),            -- FK to cm_bank_master (distributing bank)
    allotment_run_id    VARCHAR(36),
    bank_ref_no         VARCHAR(20),
    submission_ref_id   VARCHAR(36),
    nric_passport       VARCHAR(20),            -- Applicant ID (masked)
    applicant_name      VARCHAR(100),
    nationality_code    VARCHAR(2),             -- SG, etc.
    application_source  VARCHAR(20),            -- INTERNET, ATM, BRANCH
    cdp_account_no      VARCHAR(20),            -- CDP securities account
    cpf_srs_account_no  VARCHAR(20),            -- CPF/SRS account
    nominal_amount      NUMERIC(18,2),
    accepted_amount     NUMERIC(18,2),
    allotted_amount     NUMERIC(18,2),
    is_competitive      CHAR(1),                -- Usually N for retail
    yield_pct           NUMERIC(10,2),
    submission_method   VARCHAR(20),
    user_action         VARCHAR(20),
    status              VARCHAR(20),
    remarks             TEXT,
    version             NUMERIC(5,0) NOT NULL,
    is_deleted          CHAR(1) NOT NULL,
    is_migrated         CHAR(1) NOT NULL,
    created_dt          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by          VARCHAR(36) NOT NULL,
    updated_dt          TIMESTAMP NOT NULL,
    updated_by          VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

### Sample Data

```json
[
  {
    "uuid": "test-bid-retail-001",
    "iss_issuance_id": "test-issuance-001",
    "retail_bank_id": "test-bank-retail",
    "bank_ref_no": "RETAILREF001",
    "nric_passport": "S1234567A",
    "applicant_name": "John Doe",
    "nationality_code": "SG",
    "application_source": "INTERNET",
    "nominal_amount": "50000.00",
    "accepted_amount": "50000.00",
    "allotted_amount": "50000.00",
    "is_competitive": "N",
    "submission_method": "MANUAL",
    "user_action": "SUBMIT",
    "status": "ACTIVE"
  },
  {
    "uuid": "test-bid-retail-002",
    "retail_bank_id": "test-bank-retail",
    "bank_ref_no": "RETAILREF002",
    "nric_passport": "S7654321B",
    "applicant_name": "Jane Smith",
    "nationality_code": "SG",
    "application_source": "INTERNET",
    "nominal_amount": "100000.00",
    "accepted_amount": "100000.00",
    "allotted_amount": "100000.00",
    "is_competitive": "N",
    "status": "ACTIVE"
  }
]
```

---

## iss.iss_allotment_run

**Description**: Tracks allotment execution runs for each issuance. Supports multiple runs per issuance for rerun scenarios.

### DDL

```sql
CREATE TABLE iss.iss_allotment_run (
    id                      BIGINT NOT NULL,
    uuid                    VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    iss_issuance_id         VARCHAR(36),
    calendar_data_ref_id    VARCHAR(36),
    announcement_detail_id  VARCHAR(36),
    run_number              INTEGER,
    run_type                VARCHAR(20),          -- INITIAL, RERUN
    run_status              VARCHAR(20),          -- PENDING, RUNNING, COMPLETED, FAILED
    trigger_type            VARCHAR(20),          -- MANUAL, SCHEDULED, AUTO
    triggered_by_user       VARCHAR(36),
    start_timestamp         TIMESTAMP,
    end_timestamp           TIMESTAMP,
    duration_seconds        INTEGER,
    issue_size              NUMERIC,
    cut_off_yield           NUMERIC(10,6),
    auction_strength        VARCHAR(20),          -- NORMAL, STRONG, WEAK
    random_seed             VARCHAR(50),          -- For reproducible tie-breaking
    -- Bid Statistics
    total_bids_count        INTEGER,
    total_bids_amount       NUMERIC,
    competitive_bids_count  INTEGER,
    competitive_bids_amount NUMERIC,
    noncomp_bids_count      INTEGER,
    noncomp_bids_amount     NUMERIC,
    -- Accepted Statistics
    accepted_comp_count     INTEGER,
    accepted_comp_amount    NUMERIC,
    accepted_noncomp_count  INTEGER,
    accepted_noncomp_amount NUMERIC,
    -- Allotted Statistics
    allotted_comp_count     INTEGER,
    allotted_comp_amount    NUMERIC,
    allotted_noncomp_count  INTEGER,
    allotted_noncomp_amount NUMERIC,
    total_allotted_amount   NUMERIC,
    -- Safeguard Flags
    safeguard_enabled       CHAR(1),
    safeguard_triggered     CHAR(1),
    safeguard_type          VARCHAR(20),
    upper_bound_yield       NUMERIC,
    lower_bound_yield       NUMERIC,
    -- Underbidding Detection
    underbid_detected       CHAR(1),
    underbid_pd_count       INTEGER,
    underbid_details        TEXT,
    -- MAS Bids
    mas_bid_1_noncomp_amt   NUMERIC,
    mas_bid_2_noncomp_amt   NUMERIC,
    mas_bid_1_comp_amt      NUMERIC,
    mas_bid_1_noncomp_allot NUMERIC,
    mas_bid_2_noncomp_allot NUMERIC,
    mas_bid_1_comp_allot    NUMERIC,
    -- Processing Details
    warnings                TEXT,
    errors                  TEXT,
    validation_failures     TEXT,
    -- Phase Completion Tracking (8-phase allotment)
    phase_1_completed       CHAR(1),
    phase_2_completed       CHAR(1),
    phase_3_completed       CHAR(1),
    phase_4_completed       CHAR(1),
    phase_5_completed       CHAR(1),
    phase_6_completed       CHAR(1),
    phase_7_completed       CHAR(1),
    phase_8_completed       CHAR(1),
    version                 INTEGER,
    is_deleted              CHAR(1) NOT NULL,
    is_migrated             CHAR(1) NOT NULL,
    created_dt              TIMESTAMP NOT NULL,
    created_by              VARCHAR(36) NOT NULL,
    updated_dt              TIMESTAMP NOT NULL,
    updated_by              VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

### Sample Data

```json
[
  {
    "uuid": "eb267df7-13bc-4ec2-883b-4fa39c9b9b9d",
    "iss_issuance_id": "test-issuance-001",
    "run_number": 1,
    "run_type": "INITIAL",
    "run_status": "COMPLETED",
    "trigger_type": "MANUAL",
    "issue_size": "100000000",
    "cut_off_yield": "3.000000",
    "auction_strength": "NORMAL",
    "random_seed": "1767378512731",
    "total_bids_count": 7,
    "total_bids_amount": "32650000",
    "competitive_bids_count": 3,
    "competitive_bids_amount": "30000000",
    "noncomp_bids_count": 4,
    "noncomp_bids_amount": "2650000",
    "accepted_comp_count": 3,
    "accepted_comp_amount": "30000000",
    "accepted_noncomp_count": 2,
    "accepted_noncomp_amount": "2500000",
    "allotted_comp_count": 3,
    "allotted_comp_amount": "97350000",
    "allotted_noncomp_count": 2,
    "allotted_noncomp_amount": "2650000",
    "total_allotted_amount": "100000000",
    "safeguard_enabled": "N",
    "safeguard_triggered": "N",
    "underbid_detected": "N",
    "underbid_pd_count": 0,
    "phase_1_completed": "Y",
    "phase_2_completed": "Y",
    "phase_3_completed": "Y",
    "phase_4_completed": "Y",
    "phase_5_completed": "Y",
    "phase_6_completed": "Y",
    "phase_7_completed": "Y",
    "phase_8_completed": "Y"
  }
]
```

---

## iss.iss_allotment_pd_obligation

**Description**: Tracks Primary Dealer obligations and underbidding detection for each allotment run.

### DDL

```sql
CREATE TABLE iss.iss_allotment_pd_obligation (
    id                     BIGINT NOT NULL DEFAULT nextval('iss_allotment_pd_obligation_id_seq'),
    uuid                   VARCHAR(36) NOT NULL,
    allotment_run_id       VARCHAR(36) NOT NULL,
    iss_issuance_id        VARCHAR(36) NOT NULL,
    pd_bank_id             VARCHAR(36) NOT NULL,
    pd_code                VARCHAR(20) NOT NULL,
    pd_name                VARCHAR(100) NOT NULL,
    total_pds              INTEGER NOT NULL,
    issue_size             NUMERIC NOT NULL,
    obligated_amount       NUMERIC NOT NULL,       -- Required minimum bid
    total_bid_amount       NUMERIC,
    competitive_bid_amt    NUMERIC,
    noncomp_bid_amt        NUMERIC,
    total_accepted_amount  NUMERIC,
    competitive_accepted   NUMERIC,
    noncomp_accepted       NUMERIC,
    total_allotted_amount  NUMERIC,
    competitive_allotted   NUMERIC,
    noncomp_allotted       NUMERIC,
    is_underbid            CHAR(1) DEFAULT 'N',
    shortfall_amount       NUMERIC,
    shortfall_percentage   NUMERIC,
    version                INTEGER,
    is_deleted             CHAR(1) NOT NULL,
    is_migrated            CHAR(1) NOT NULL,
    created_dt             TIMESTAMP NOT NULL,
    created_by             VARCHAR(36) NOT NULL,
    updated_dt             TIMESTAMP NOT NULL,
    updated_by             VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## iss.iss_allotment_yield_distribution

**Description**: Tracks yield distribution for competitive bids to support cut-off yield calculation.

### DDL

```sql
CREATE TABLE iss.iss_allotment_yield_distribution (
    id                 BIGINT NOT NULL DEFAULT nextval('iss_allotment_yield_distribution_id_seq'),
    uuid               VARCHAR(36) NOT NULL,
    allotment_run_id   VARCHAR(36) NOT NULL,
    yield_value        NUMERIC(10,6) NOT NULL,
    bid_count          INTEGER NOT NULL,
    bid_amount         NUMERIC NOT NULL,
    cumulative_amount  NUMERIC NOT NULL,
    is_cutoff_yield    CHAR(1) DEFAULT 'N',
    allotted_amount    NUMERIC,
    allotment_ratio    NUMERIC(10,6),
    version            INTEGER,
    is_deleted         CHAR(1) NOT NULL,
    is_migrated        CHAR(1) NOT NULL,
    created_dt         TIMESTAMP NOT NULL,
    created_by         VARCHAR(36) NOT NULL,
    updated_dt         TIMESTAMP NOT NULL,
    updated_by         VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## iss.iss_calendar_listing

**Description**: Issuance calendar listings by year and security type.

### DDL

```sql
CREATE TABLE iss.iss_calendar_listing (
    id                       BIGINT NOT NULL,
    uuid                     VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    year                     VARCHAR(4),
    period                   VARCHAR(20),           -- Yearly, Quarterly
    security_type            VARCHAR(20),           -- SECTYPE_SGS, SECTYPE_TBILL
    user_action              VARCHAR(30),
    status                   VARCHAR(30),           -- ISSCALSTAT_DRAFT, ISSCALSTAT_PUBLISHED
    publication_dt           TIMESTAMP,
    is_published_immediately CHAR(1),
    footnotes                TEXT,
    remarks                  TEXT,
    creation_method          VARCHAR(20),           -- MANUAL_ENTRY, ALGORITHM
    cmdoc_ref_id             VARCHAR(36),
    wf_process_id            VARCHAR(50),
    version                  NUMERIC(5,0) NOT NULL,
    is_deleted               CHAR(1) NOT NULL,
    is_migrated              CHAR(1) NOT NULL,
    created_dt               TIMESTAMP NOT NULL,
    created_by               VARCHAR(36) NOT NULL,
    updated_dt               TIMESTAMP NOT NULL,
    updated_by               VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

### Sample Data

```json
[
  {
    "uuid": "fd141116-7a27-41ed-acf7-43f57d937133",
    "year": "2025",
    "period": "Yearly",
    "security_type": "SECTYPE_SGS",
    "status": "ISSCALSTAT_PUBLISHED",
    "is_published_immediately": "Y",
    "footnotes": "Footnote need to add.",
    "creation_method": "MANUAL_ENTRY"
  },
  {
    "uuid": "463c196d-9b35-4956-bf2c-687ef36ef025",
    "year": "2026",
    "period": "Yearly",
    "security_type": "SECTYPE_TBILL",
    "user_action": "USERACT_SUBMIT",
    "status": "ISSCALSTAT_PUBLISHED",
    "is_published_immediately": "Y",
    "creation_method": "ALGORITHM"
  }
]
```

---

## iss.iss_calendar_data

**Description**: Individual calendar entries with auction/issue dates.

### DDL

```sql
CREATE TABLE iss.iss_calendar_data (
    id                      BIGINT NOT NULL,
    uuid                    VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    iss_calendar_listing_id VARCHAR(36),
    issue_code              VARCHAR(8),
    isin_code               VARCHAR(12),
    issuance_type           VARCHAR(20),
    issue_type              VARCHAR(20),
    sgs_type                VARCHAR(20),
    tenor                   VARCHAR(10),
    tenor_unit              CHAR(1),
    new_reopen_flag         CHAR(1),
    is_benchmark            CHAR(1),
    announcement_dt         TIMESTAMP,
    auction_dt              TIMESTAMP,
    issue_dt                TIMESTAMP,
    maturity_dt             TIMESTAMP,
    first_coupon_payment_dt TIMESTAMP,
    public_offer_start_dt   TIMESTAMP,
    public_offer_end_dt     TIMESTAMP,
    app_closing_dt          TIMESTAMP,
    cdp_naming_convention   VARCHAR(50),
    is_provisioned_isin     CHAR(1),
    version                 NUMERIC(5,0) NOT NULL,
    is_deleted              CHAR(1) NOT NULL,
    is_migrated             CHAR(1) NOT NULL,
    created_dt              TIMESTAMP NOT NULL,
    created_by              VARCHAR(36) NOT NULL,
    updated_dt              TIMESTAMP NOT NULL,
    updated_by              VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

### Sample Data

```json
[
  {
    "uuid": "76b6a9d0-4b10-4925-a26c-5da6242f4213",
    "iss_calendar_listing_id": "fd141116-7a27-41ed-acf7-43f57d937133",
    "issue_code": "NX25100H",
    "isin_code": "SGXF25686589",
    "issuance_type": "AUCTION",
    "issue_type": "SECTYPE_SGS",
    "sgs_type": "SGSTYPE_MD",
    "tenor": "10",
    "tenor_unit": "Y",
    "new_reopen_flag": "N",
    "is_benchmark": "Y",
    "announcement_dt": "2026-01-07",
    "auction_dt": "2026-01-13",
    "issue_dt": "2026-01-16",
    "maturity_dt": "2036-01-01"
  },
  {
    "uuid": "c4069e42-5bf5-4ee1-bd06-2f92c4f0966a",
    "issue_code": "BS26101E",
    "isin_code": "SGXZ15837941",
    "issuance_type": "AUCTION",
    "issue_type": "SECTYPE_TBILL",
    "tenor": "6",
    "tenor_unit": "M",
    "announcement_dt": "2026-01-08",
    "auction_dt": "2026-01-15",
    "issue_dt": "2026-01-20",
    "maturity_dt": "2026-07-21"
  },
  {
    "uuid": "d6ee3ce9-1267-40da-bdd8-0bb7fd748ad6",
    "issue_code": "GX26020S",
    "isin_code": "SGXZ50596402",
    "issuance_type": "AUCTION",
    "issue_type": "SECTYPE_SSB",
    "tenor": "10",
    "tenor_unit": "Y",
    "app_closing_dt": "2026-01-27",
    "cdp_naming_convention": "SBFEB26 GX26020S"
  }
]
```

---

## iss.iss_calendar_parameters

**Description**: Stores configuration parameters and rules for generating issuance calendars.

### DDL

```sql
CREATE TABLE iss.iss_calendar_parameters (
    id                    BIGINT NOT NULL,
    uuid                  VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    security_type         VARCHAR(20),
    bill_bond             VARCHAR(10),           -- BILL, BOND
    tenor                 VARCHAR(10),
    tenor_unit            CHAR(1),
    is_active             CHAR(1),
    generation_by_algorithm CHAR(1),
    issue_code_prefix     VARCHAR(5),
    calendar_generation   VARCHAR(20),           -- ANNUALLY, SEMI_ANNUALLY
    issue_frequency       VARCHAR(20),           -- WEEKLY, BI_WEEKLY, QUARTERLY
    bid_collation_period  VARCHAR(20),           -- IN_DAYS
    issue_day             VARCHAR(10),           -- TUESDAY, FRIDAY
    announcement_day      VARCHAR(5),
    auction_allotment_day VARCHAR(5),
    closing_day           VARCHAR(5),
    bond_announcement_date VARCHAR(5),
    size_announcement_date VARCHAR(5),
    maturity_day          VARCHAR(10),
    status                VARCHAR(20),
    version               NUMERIC(5,0) NOT NULL,
    is_deleted            CHAR(1) NOT NULL,
    is_migrated           CHAR(1) NOT NULL,
    created_dt            TIMESTAMP NOT NULL,
    created_by            VARCHAR(36) NOT NULL,
    updated_dt            TIMESTAMP NOT NULL,
    updated_by            VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

### Sample Data

```json
[
  {
    "security_type": "SECTYPE_TBILL",
    "bill_bond": "BILL",
    "tenor": "6",
    "tenor_unit": "M",
    "is_active": "Y",
    "generation_by_algorithm": "Y",
    "issue_code_prefix": "BS",
    "calendar_generation": "ANNUALLY",
    "issue_frequency": "BI_WEEKLY",
    "bid_collation_period": "IN_DAYS",
    "issue_day": "TUESDAY",
    "announcement_day": "8",
    "auction_allotment_day": "3",
    "maturity_day": "TUESDAY",
    "status": "ACTIVE"
  },
  {
    "security_type": "SECTYPE_SGS",
    "bill_bond": "BOND",
    "tenor": "10",
    "tenor_unit": "Y",
    "is_active": "Y",
    "generation_by_algorithm": "N",
    "issue_code_prefix": "N",
    "calendar_generation": "ANNUALLY",
    "bid_collation_period": "IN_DAYS",
    "announcement_day": "7",
    "auction_allotment_day": "3",
    "bond_announcement_date": "1",
    "size_announcement_date": "1",
    "status": "ACTIVE"
  },
  {
    "security_type": "SECTYPE_MASBILLS",
    "bill_bond": "BILL",
    "tenor": "4",
    "tenor_unit": "W",
    "is_active": "Y",
    "generation_by_algorithm": "Y",
    "issue_code_prefix": "MD",
    "calendar_generation": "SEMI_ANNUALLY",
    "issue_frequency": "WEEKLY",
    "issue_day": "FRIDAY",
    "announcement_day": "4",
    "auction_allotment_day": "3",
    "status": "ACTIVE"
  }
]
```

---

## iss.iss_auction_safeguard

**Description**: Stores auction safeguard bounds (upper/lower yield limits) for each issuance with approval workflow.

### DDL

```sql
CREATE TABLE iss.iss_auction_safeguard (
    id                  BIGINT NOT NULL,
    uuid                VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    iss_issuance_id     VARCHAR(36),
    upper_bound_yield   NUMERIC(10,6),
    lower_bound_yield   NUMERIC(10,6),
    reference_yield     NUMERIC(10,6),
    safeguard_type      VARCHAR(20),
    is_enabled          CHAR(1),
    approval_status     VARCHAR(30),
    approved_by         VARCHAR(36),
    approved_dt         TIMESTAMP,
    remarks             TEXT,
    version             NUMERIC(5,0) NOT NULL,
    is_deleted          CHAR(1) NOT NULL,
    is_migrated         CHAR(1) NOT NULL,
    created_dt          TIMESTAMP NOT NULL,
    created_by          VARCHAR(36) NOT NULL,
    updated_dt          TIMESTAMP NOT NULL,
    updated_by          VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## iss.iss_announcement_stepup_rates

**Description**: Stores the schedule of step-up coupon rates and average annual returns (for SSB).

### DDL

```sql
CREATE TABLE iss.iss_announcement_stepup_rates (
    id                      BIGINT NOT NULL,
    uuid                    VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    announcement_detail_id  VARCHAR(36),
    year_number             INTEGER,
    interest_rate           NUMERIC(10,6),
    average_return          NUMERIC(10,6),
    version                 NUMERIC(5,0) NOT NULL,
    is_deleted              CHAR(1) NOT NULL,
    is_migrated             CHAR(1) NOT NULL,
    created_dt              TIMESTAMP NOT NULL,
    created_by              VARCHAR(36) NOT NULL,
    updated_dt              TIMESTAMP NOT NULL,
    updated_by              VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## iss.iss_coupon_payment_dates

**Description**: Stores specific recurring month and day schedules for coupon payments linked to an announcement.

### DDL

```sql
CREATE TABLE iss.iss_coupon_payment_dates (
    id                     BIGINT NOT NULL,
    uuid                   VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    announcement_detail_id VARCHAR(36),
    payment_month          INTEGER,            -- 1-12
    payment_day            INTEGER,            -- 1-31
    version                NUMERIC(5,0) NOT NULL,
    is_deleted             CHAR(1) NOT NULL,
    is_migrated            CHAR(1) NOT NULL,
    created_dt             TIMESTAMP NOT NULL,
    created_by             VARCHAR(36) NOT NULL,
    updated_dt             TIMESTAMP NOT NULL,
    updated_by             VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## iss.issuance_coupon_payment_dates

**Description**: Stores the scheduled coupon payment month and days for a specific issuance.

### DDL

```sql
CREATE TABLE iss.issuance_coupon_payment_dates (
    id               BIGINT NOT NULL,
    uuid             VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    iss_issuance_id  VARCHAR(36),
    payment_month    INTEGER,
    payment_day      INTEGER,
    version          NUMERIC(5,0) NOT NULL,
    is_deleted       CHAR(1) NOT NULL,
    is_migrated      CHAR(1) NOT NULL,
    created_dt       TIMESTAMP NOT NULL,
    created_by       VARCHAR(36) NOT NULL,
    updated_dt       TIMESTAMP NOT NULL,
    updated_by       VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## iss.issuance_stepup_rates

**Description**: Stores the finalized step-up interest rates for a specific Savings Bond issuance.

### DDL

```sql
CREATE TABLE iss.issuance_stepup_rates (
    id               BIGINT NOT NULL,
    uuid             VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    iss_issuance_id  VARCHAR(36),
    year_number      INTEGER,
    interest_rate    NUMERIC(10,6),
    average_return   NUMERIC(10,6),
    version          NUMERIC(5,0) NOT NULL,
    is_deleted       CHAR(1) NOT NULL,
    is_migrated      CHAR(1) NOT NULL,
    created_dt       TIMESTAMP NOT NULL,
    created_by       VARCHAR(36) NOT NULL,
    updated_dt       TIMESTAMP NOT NULL,
    updated_by       VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## iss.iss_bid_file_registry

**Description**: Tracks uploaded bid files and their processing status.

### DDL

```sql
CREATE TABLE iss.iss_bid_file_registry (
    id               BIGINT NOT NULL,
    uuid             VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    iss_issuance_id  VARCHAR(36),
    cm_documents_id  VARCHAR(36),
    file_name        VARCHAR(255),
    file_type        VARCHAR(20),
    upload_status    VARCHAR(20),
    processing_status VARCHAR(20),
    records_total    INTEGER,
    records_success  INTEGER,
    records_failed   INTEGER,
    error_details    TEXT,
    version          NUMERIC(5,0) NOT NULL,
    is_deleted       CHAR(1) NOT NULL,
    is_migrated      CHAR(1) NOT NULL,
    created_dt       TIMESTAMP NOT NULL,
    created_by       VARCHAR(36) NOT NULL,
    updated_dt       TIMESTAMP NOT NULL,
    updated_by       VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## iss.iss_sec_params

**Description**: Security-specific parameters for issuance configuration.

### DDL

```sql
CREATE TABLE iss.iss_sec_params (
    id               BIGINT NOT NULL,
    uuid             VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    security_type    VARCHAR(20),
    parameter_key    VARCHAR(50),
    parameter_value  VARCHAR(500),
    description      VARCHAR(500),
    effective_from   TIMESTAMP,
    effective_to     TIMESTAMP,
    version          NUMERIC(5,0) NOT NULL,
    is_deleted       CHAR(1) NOT NULL,
    is_migrated      CHAR(1) NOT NULL,
    created_dt       TIMESTAMP NOT NULL,
    created_by       VARCHAR(36) NOT NULL,
    updated_dt       TIMESTAMP NOT NULL,
    updated_by       VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## iss.iss_announcement_allotment_params

**Description**: Allotment parameters specific to announcements.

### DDL

```sql
CREATE TABLE iss.iss_announcement_allotment_params (
    id                     BIGINT NOT NULL,
    uuid                   VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    announcement_detail_id VARCHAR(36),
    parameter_key          VARCHAR(50),
    parameter_value        VARCHAR(500),
    version                NUMERIC(5,0) NOT NULL,
    is_deleted             CHAR(1) NOT NULL,
    is_migrated            CHAR(1) NOT NULL,
    created_dt             TIMESTAMP NOT NULL,
    created_by             VARCHAR(36) NOT NULL,
    updated_dt             TIMESTAMP NOT NULL,
    updated_by             VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## iss.iss_calendar_params

**Description**: Calendar generation parameters.

### DDL

```sql
CREATE TABLE iss.iss_calendar_params (
    id                      BIGINT NOT NULL,
    uuid                    VARCHAR(36) NOT NULL DEFAULT gen_random_uuid(),
    iss_calendar_listing_id VARCHAR(36),
    parameter_key           VARCHAR(50),
    parameter_value         VARCHAR(500),
    version                 NUMERIC(5,0) NOT NULL,
    is_deleted              CHAR(1) NOT NULL,
    is_migrated             CHAR(1) NOT NULL,
    created_dt              TIMESTAMP NOT NULL,
    created_by              VARCHAR(36) NOT NULL,
    updated_dt              TIMESTAMP NOT NULL,
    updated_by              VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

# STG Schema (Staging/Integration)

Staging tables for file-based integration with MEPS+ and external systems.

## File Naming Convention

| Prefix | Direction | System | Description |
|--------|-----------|--------|-------------|
| `stg_fi_in_` | Inbound | FI Systems | Files received from financial intermediaries |
| `stg_fi_out_` | Outbound | FI Systems | Files sent to financial intermediaries |
| `stg_meps_in_` | Inbound | MEPS+ | Files received from MEPS+ |
| `stg_meps_out_` | Outbound | MEPS+ | Files sent to MEPS+ |

## stg.stg_meps_in_secmast

**Description**: Security master data received from MEPS+.

### DDL

```sql
CREATE TABLE stg.stg_meps_in_secmast (
    id                BIGINT NOT NULL,
    uuid              VARCHAR(36) NOT NULL,
    cm_documents_uuid VARCHAR(36) NOT NULL,
    line_number       VARCHAR(10),
    issue_code        VARCHAR(8),
    issue_no          VARCHAR(2),
    issue_type        VARCHAR(10),
    curr              VARCHAR(3),
    issue_desc        VARCHAR(30),
    issue_date        VARCHAR(8),          -- YYYYMMDD format
    tender_date       VARCHAR(8),
    qty_offered       VARCHAR(13),         -- Zero-padded numeric string
    qty_applied       VARCHAR(13),
    ave_yield         VARCHAR(5),
    cut_off_yield     VARCHAR(5),
    maturity_date     VARCHAR(8),
    percent_coy       VARCHAR(5),
    percent_sub       VARCHAR(5),
    nc_percent        VARCHAR(5),
    nc_qty_allot      VARCHAR(13),
    int_rate          VARCHAR(7),
    tax_status        CHAR(1),
    cut_off_yield_price VARCHAR(7),
    ave_yield_price   VARCHAR(7),
    closing_price     VARCHAR(7),
    isin_code         VARCHAR(12),
    tenor             VARCHAR(3),
    etender_ind       CHAR(1),
    mas_applied       VARCHAR(13),
    mas_allotted      VARCHAR(13),
    int_paid_ind      CHAR(1),
    last_int_date     VARCHAR(8),
    next_int_date     VARCHAR(8),
    accrued_int_days  VARCHAR(3),
    int_date1         VARCHAR(4),          -- MMDD format
    int_date2         VARCHAR(4),
    ex_int_date       VARCHAR(8),
    version           VARCHAR(10) NOT NULL,
    is_deleted        CHAR(1) NOT NULL,
    is_migrated       CHAR(1) NOT NULL,
    created_dt        TIMESTAMP NOT NULL,
    created_by        VARCHAR(36) NOT NULL,
    updated_dt        TIMESTAMP NOT NULL,
    updated_by        VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

### Sample Data

```json
[
  {
    "issue_code": "NX25100H",
    "issue_no": "01",
    "curr": "SGD",
    "issue_desc": "10YR BOND 2025 DUE030325",
    "issue_date": "20260116",
    "tender_date": "20260113",
    "qty_offered": "0110000000000",
    "qty_applied": "0000000000000",
    "maturity_date": "20360101",
    "isin_code": "SGXF25686589",
    "tenor": "010",
    "etender_ind": "Y",
    "mas_applied": "0090000000000",
    "int_paid_ind": "Y",
    "int_date1": "0101",
    "int_date2": "0701",
    "created_by": "OMEGA"
  },
  {
    "issue_code": "MD26101F",
    "issue_no": "01",
    "curr": "SGD",
    "issue_desc": "10YR BOND 2024 DUE010934",
    "issue_date": "20250201",
    "tender_date": "20250128",
    "qty_offered": "0000002000000",
    "maturity_date": "20320201",
    "int_rate": "0000012",
    "tax_status": "N",
    "isin_code": "SG9876543210",
    "tenor": "010",
    "etender_ind": "Y",
    "int_paid_ind": "N",
    "accrued_int_days": "180"
  }
]
```

---

## stg.stg_meps_in_bank

**Description**: Bank master data received from MEPS+.

### DDL

```sql
CREATE TABLE stg.stg_meps_in_bank (
    id                BIGINT NOT NULL,
    uuid              VARCHAR(36) NOT NULL,
    cm_documents_uuid VARCHAR(36) NOT NULL,
    line_number       NUMERIC(10,0) NOT NULL,
    bank_code         VARCHAR(4),
    bank_name         VARCHAR(40),
    shortname         VARCHAR(20),
    autodebit_ind     CHAR(1),
    participant_ind   CHAR(1),
    version           VARCHAR(10) NOT NULL,
    is_deleted        CHAR(1) NOT NULL,
    is_migrated       CHAR(1) NOT NULL,
    created_dt        TIMESTAMP NOT NULL,
    created_by        VARCHAR(36) NOT NULL,
    updated_dt        TIMESTAMP NOT NULL,
    updated_by        VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## stg.stg_meps_in_couponrates

**Description**: Coupon rates received from MEPS+.

### DDL

```sql
CREATE TABLE stg.stg_meps_in_couponrates (
    id                BIGINT NOT NULL,
    uuid              VARCHAR(36) NOT NULL,
    cm_documents_uuid VARCHAR(36) NOT NULL,
    line_number       NUMERIC(10,0) NOT NULL,
    issue_code        VARCHAR(8),
    year_number       VARCHAR(2),
    interest_rate     VARCHAR(7),
    average_return    VARCHAR(7),
    version           VARCHAR(10) NOT NULL,
    is_deleted        CHAR(1) NOT NULL,
    is_migrated       CHAR(1) NOT NULL,
    created_dt        TIMESTAMP NOT NULL,
    created_by        VARCHAR(36) NOT NULL,
    updated_dt        TIMESTAMP NOT NULL,
    updated_by        VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## stg.stg_meps_in_secint

**Description**: Security interest/coupon schedule data from MEPS+.

### DDL

```sql
CREATE TABLE stg.stg_meps_in_secint (
    id                BIGINT NOT NULL,
    uuid              VARCHAR(36) NOT NULL,
    cm_documents_uuid VARCHAR(36) NOT NULL,
    line_number       NUMERIC(10,0) NOT NULL,
    issue_code        VARCHAR(8),
    coupon_index      VARCHAR(2),
    coupon_payment_dt VARCHAR(8),
    version           VARCHAR(10) NOT NULL,
    is_deleted        CHAR(1) NOT NULL,
    is_migrated       CHAR(1) NOT NULL,
    created_dt        TIMESTAMP NOT NULL,
    created_by        VARCHAR(36) NOT NULL,
    updated_dt        TIMESTAMP NOT NULL,
    updated_by        VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## stg.stg_meps_out_auction

**Description**: Auction results sent to MEPS+.

### DDL

```sql
CREATE TABLE stg.stg_meps_out_auction (
    id                BIGINT NOT NULL,
    uuid              VARCHAR(36) NOT NULL,
    cm_documents_uuid VARCHAR(36),
    iss_issuance_id   VARCHAR(36),
    allotment_run_id  VARCHAR(36),
    line_number       NUMERIC(10,0),
    issue_code        VARCHAR(8),
    tender_date       VARCHAR(8),
    issue_date        VARCHAR(8),
    qty_offered       VARCHAR(13),
    qty_applied       VARCHAR(13),
    avg_yield         VARCHAR(5),
    cutoff_yield      VARCHAR(5),
    cutoff_yield_price VARCHAR(7),
    avg_price         VARCHAR(7),
    nc_percent        VARCHAR(5),
    nc_qty_allot      VARCHAR(13),
    mas_allotted      VARCHAR(13),
    int_rate          VARCHAR(7),
    percent_coy       VARCHAR(5),
    percent_sub       VARCHAR(5),
    status            VARCHAR(20),
    version           VARCHAR(10) NOT NULL,
    is_deleted        CHAR(1) NOT NULL,
    is_migrated       CHAR(1) NOT NULL,
    created_dt        TIMESTAMP NOT NULL,
    created_by        VARCHAR(36) NOT NULL,
    updated_dt        TIMESTAMP NOT NULL,
    updated_by        VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## stg.stg_meps_out_auction_sbond

**Description**: Savings Bond auction results sent to MEPS+.

### DDL

```sql
CREATE TABLE stg.stg_meps_out_auction_sbond (
    id                BIGINT NOT NULL,
    uuid              VARCHAR(36) NOT NULL,
    cm_documents_uuid VARCHAR(36),
    iss_issuance_id   VARCHAR(36),
    allotment_run_id  VARCHAR(36),
    line_number       NUMERIC(10,0),
    issue_code        VARCHAR(8),
    tender_date       VARCHAR(8),
    issue_date        VARCHAR(8),
    qty_offered       VARCHAR(13),
    qty_applied       VARCHAR(13),
    qty_allotted      VARCHAR(13),
    status            VARCHAR(20),
    version           VARCHAR(10) NOT NULL,
    is_deleted        CHAR(1) NOT NULL,
    is_migrated       CHAR(1) NOT NULL,
    created_dt        TIMESTAMP NOT NULL,
    created_by        VARCHAR(36) NOT NULL,
    updated_dt        TIMESTAMP NOT NULL,
    updated_by        VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## stg.stg_fi_in_ea_ap

**Description**: Electronic Application (Auction) bid file from financial intermediaries.

### DDL

```sql
CREATE TABLE stg.stg_fi_in_ea_ap (
    id                BIGINT NOT NULL,
    uuid              VARCHAR(36) NOT NULL,
    cm_documents_uuid VARCHAR(36) NOT NULL,
    line_number       NUMERIC(10,0) NOT NULL,
    record_type_ind   VARCHAR(10) NOT NULL,
    file_type         VARCHAR(3),
    pri_dlr_code      VARCHAR(4),
    bank_name         VARCHAR(20),
    processing_date   VARCHAR(8),
    issue_code        VARCHAR(8),
    isin_code         VARCHAR(12),
    tender_date       VARCHAR(8),
    curr              VARCHAR(3),
    issue_desc        VARCHAR(30),
    trans_ref         VARCHAR(8),
    received_date     VARCHAR(8),
    received_time     VARCHAR(6),
    trans_type        VARCHAR(3),
    nominal_amt       VARCHAR(13),
    comp_nocomp       CHAR(1),
    bid_yield_sign    CHAR(1),
    bid_yield         VARCHAR(5),
    price             VARCHAR(7),
    name_of_appln     VARCHAR(100),
    nationality       CHAR(1),
    settlement_bank   VARCHAR(4),
    custody_code      VARCHAR(3),
    version           VARCHAR(10) NOT NULL,
    is_deleted        CHAR(1) NOT NULL,
    is_migrated       CHAR(1) NOT NULL,
    created_dt        TIMESTAMP NOT NULL,
    created_by        VARCHAR(36) NOT NULL,
    updated_dt        TIMESTAMP NOT NULL,
    updated_by        VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## stg.stg_fi_in_sb_ap

**Description**: Savings Bond application file from financial intermediaries.

### DDL

```sql
CREATE TABLE stg.stg_fi_in_sb_ap (
    id                BIGINT NOT NULL,
    uuid              VARCHAR(36) NOT NULL,
    cm_documents_uuid VARCHAR(36) NOT NULL,
    line_number       NUMERIC(10,0) NOT NULL,
    record_type_ind   VARCHAR(10),
    file_type         VARCHAR(3),
    member_code       VARCHAR(8),
    bank_name         VARCHAR(20),
    processing_date   VARCHAR(8),
    issue_code        VARCHAR(8),
    app_ref_no        VARCHAR(16),
    received_date     VARCHAR(8),
    received_time     VARCHAR(6),
    trans_type        VARCHAR(1),
    nric_passport     VARCHAR(9),
    name              VARCHAR(40),
    nationality       CHAR(1),
    app_source        CHAR(1),
    nominal_amt       VARCHAR(13),
    version           VARCHAR(10) NOT NULL,
    is_deleted        CHAR(1) NOT NULL,
    is_migrated       CHAR(1) NOT NULL,
    created_dt        TIMESTAMP NOT NULL,
    created_by        VARCHAR(36) NOT NULL,
    updated_dt        TIMESTAMP NOT NULL,
    updated_by        VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## stg.stg_fi_in_sb_re

**Description**: Savings Bond redemption request file from financial intermediaries.

### DDL

```sql
CREATE TABLE stg.stg_fi_in_sb_re (
    id                BIGINT NOT NULL,
    uuid              VARCHAR(36) NOT NULL,
    cm_documents_uuid VARCHAR(36) NOT NULL,
    line_number       NUMERIC(10,0) NOT NULL,
    record_type_ind   VARCHAR(10),
    file_type         VARCHAR(3),
    member_code       VARCHAR(8),
    processing_date   VARCHAR(8),
    issue_code        VARCHAR(8),
    redemption_ref_no VARCHAR(16),
    redemption_date   VARCHAR(8),
    redemption_time   VARCHAR(6),
    trans_type        CHAR(1),
    nric_passport     VARCHAR(9),
    nominal_amt       VARCHAR(13),
    version           VARCHAR(10) NOT NULL,
    is_deleted        CHAR(1) NOT NULL,
    is_migrated       CHAR(1) NOT NULL,
    created_dt        TIMESTAMP NOT NULL,
    created_by        VARCHAR(36) NOT NULL,
    updated_dt        TIMESTAMP NOT NULL,
    updated_by        VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## stg.stg_fi_in_sb_hol

**Description**: Savings Bond holdings file from financial intermediaries.

### DDL

```sql
CREATE TABLE stg.stg_fi_in_sb_hol (
    id                BIGINT NOT NULL,
    uuid              VARCHAR(36) NOT NULL,
    cm_documents_uuid VARCHAR(36) NOT NULL,
    line_number       NUMERIC(10,0) NOT NULL,
    record_type_ind   VARCHAR(10),
    file_type         VARCHAR(3),
    member_code       VARCHAR(8),
    processing_date   VARCHAR(8),
    issue_code        VARCHAR(8),
    nric_passport     VARCHAR(9),
    holding_amount    VARCHAR(13),
    version           VARCHAR(10) NOT NULL,
    is_deleted        CHAR(1) NOT NULL,
    is_migrated       CHAR(1) NOT NULL,
    created_dt        TIMESTAMP NOT NULL,
    created_by        VARCHAR(36) NOT NULL,
    updated_dt        TIMESTAMP NOT NULL,
    updated_by        VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## stg.stg_fi_out_sb_ra

**Description**: Savings Bond result/allotment file sent to financial intermediaries.

### DDL

```sql
CREATE TABLE stg.stg_fi_out_sb_ra (
    id                BIGINT NOT NULL,
    uuid              VARCHAR(36) NOT NULL,
    cm_documents_uuid VARCHAR(36),
    iss_issuance_id   VARCHAR(36),
    allotment_run_id  VARCHAR(36),
    line_number       NUMERIC(10,0),
    record_type_ind   VARCHAR(10),
    file_type         VARCHAR(3),
    member_code       VARCHAR(8),
    processing_date   VARCHAR(8),
    issue_code        VARCHAR(8),
    app_ref_no        VARCHAR(16),
    nric_passport     VARCHAR(9),
    applied_amt       VARCHAR(13),
    allotted_amt      VARCHAR(13),
    refund_amt        VARCHAR(13),
    status            VARCHAR(20),
    version           VARCHAR(10) NOT NULL,
    is_deleted        CHAR(1) NOT NULL,
    is_migrated       CHAR(1) NOT NULL,
    created_dt        TIMESTAMP NOT NULL,
    created_by        VARCHAR(36) NOT NULL,
    updated_dt        TIMESTAMP NOT NULL,
    updated_by        VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## stg.stg_fi_out_ea_aa

**Description**: Electronic Application auction allotment file sent to financial intermediaries.

### DDL

```sql
CREATE TABLE stg.stg_fi_out_ea_aa (
    id                BIGINT NOT NULL,
    uuid              VARCHAR(36) NOT NULL,
    cm_documents_uuid VARCHAR(36),
    iss_issuance_id   VARCHAR(36),
    allotment_run_id  VARCHAR(36),
    line_number       NUMERIC(10,0),
    record_type_ind   VARCHAR(10),
    file_type         VARCHAR(3),
    pri_dlr_code      VARCHAR(4),
    processing_date   VARCHAR(8),
    issue_code        VARCHAR(8),
    trans_ref         VARCHAR(8),
    nominal_amt       VARCHAR(13),
    allotted_amt      VARCHAR(13),
    allotted_yield    VARCHAR(5),
    allotted_price    VARCHAR(7),
    status            VARCHAR(20),
    version           VARCHAR(10) NOT NULL,
    is_deleted        CHAR(1) NOT NULL,
    is_migrated       CHAR(1) NOT NULL,
    created_dt        TIMESTAMP NOT NULL,
    created_by        VARCHAR(36) NOT NULL,
    updated_dt        TIMESTAMP NOT NULL,
    updated_by        VARCHAR(36) NOT NULL,
    PRIMARY KEY (id)
);
```

---

## Additional STG Tables

| Table | Description |
|-------|-------------|
| `stg_fi_out_cal` | Calendar publication file to FI |
| `stg_fi_out_ea_es_ra` | EA electronic submission result/allotment |
| `stg_fi_out_ins_ea_ra` | Institutional EA result/allotment |
| `stg_fi_out_sb_ack` | Savings Bond acknowledgment file |
| `stg_fi_out_sb_ah` | Savings Bond allotment history |
| `stg_fi_out_sb_cpn` | Savings Bond coupon payment file |
| `stg_fi_out_sb_rr` | Savings Bond redemption result |
| `stg_meps_out_closingprice` | Closing price update to MEPS+ |
| `stg_meps_out_meps_sora_index` | SORA index data to MEPS+ |
| `stg_meps_out_rdmpartial_sbond` | Partial redemption data to MEPS+ |
| `stg_meps_out_secupdt` | Security update to MEPS+ |

---

# Common Patterns

## Standard Audit Columns

All tables include:

```sql
version       NUMERIC(5,0) NOT NULL,  -- Optimistic locking
is_deleted    CHAR(1) NOT NULL,       -- Soft delete flag ('Y'/'N')
is_migrated   CHAR(1) NOT NULL,       -- Migration tracking ('Y'/'N')
created_dt    TIMESTAMP NOT NULL,     -- Creation timestamp
created_by    VARCHAR(36) NOT NULL,   -- Creator user ID
updated_dt    TIMESTAMP NOT NULL,     -- Last update timestamp
updated_by    VARCHAR(36) NOT NULL    -- Last updater user ID
```

## UUID Pattern

- Primary key: `id` (BIGINT) for performance
- Business key: `uuid` (VARCHAR(36)) for external references
- Foreign keys reference `uuid`, not `id`

## Temporal Tables (_t suffix)

Tables with `_t` suffix store transaction/audit history:
- Same structure as base table
- Used for maker-checker workflows
- Stores draft/pending states before approval

## Status Code Patterns

| Prefix | Domain | Example |
|--------|--------|---------|
| `CMSTAT_` | Common | `CMSTAT_ACTIVE` |
| `ISSSTAT_` | Issuance | `ISSSTAT_DRAFT`, `ISSSTAT_PUBLISHED` |
| `ISSCALSTAT_` | Calendar | `ISSCALSTAT_PENDING_APPROVAL` |
| `ISSANNSTAT_` | Announcement | `ISSANNSTAT_PUBLISHED` |
| `SECTYPE_` | Security Type | `SECTYPE_SGS`, `SECTYPE_TBILL`, `SECTYPE_SSB` |
| `SGSTYPE_` | SGS Type | `SGSTYPE_MD`, `SGSTYPE_INF` |

---

# Entity Relationships

```
sec_security_master
    └── iss_issuance (1:N)
            ├── iss_bid_institutional (1:N)
            ├── iss_bid_retail (1:N)
            ├── iss_allotment_run (1:N)
            │       ├── iss_allotment_pd_obligation (1:N)
            │       └── iss_allotment_yield_distribution (1:N)
            ├── issuance_coupon_payment_dates (1:N)
            ├── issuance_stepup_rates (1:N)
            └── iss_auction_safeguard (1:1)

iss_calendar_listing
    └── iss_calendar_data (1:N)
            └── iss_announcement_details (1:1)
                    ├── iss_announcement_stepup_rates (1:N)
                    ├── iss_coupon_payment_dates (1:N)
                    └── iss_announcement_allotment_params (1:N)

cm_bank_master
    └── cm_bank_master_map (1:N)
            └── iss_bid_institutional.cm_bank_master_map_id (N:1)

cm_master_code_category
    └── cm_master_code (1:N)
```

---

*Document generated from CloudMAS PostgreSQL database exploration.*
