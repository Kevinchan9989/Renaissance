# AGD Electronic File Transfer Interface Specification

> **Document Type:** Interface Specification
> **Source File:** SDS - AGD Electronic File Transfer.doc
> **Version:** 5.0
> **System:** Old eApps System (Legacy)
> **Target System:** AGD (Accountant-General Department)

---

## 1. Overview

The AGD Electronic File Transfer process transfers SGS Bond, T-Bill, and Savings Bond data (Static and Transaction Data) along with ERF data from MAS to AGD.

### 1.1 File Types
| File | Scheduled Run | Ad-hoc Run | Content |
|------|---------------|------------|---------|
| Static Data | IT030048.TXT | IT032048.TXT | Security master data |
| Transaction Data | IT040048.TXT | IT042048.TXT | Transaction records |
| ERF Data | IT050048.TXT | IT052048.TXT | ERF transaction records |

### 1.2 Transfer Schedule
- **Scheduled:** Every Wednesday and last business day of month at 10:30 PM
- **Ad-hoc:** On-request basis with configurable date range

### 1.3 Date Range Logic
- **Scheduled Run:** Previous Thursday to Current Wednesday
- **Ad-hoc Run:** Configurable via `adhoc_run.txt` properties file

---

## 2. Static Data File (IT030048.TXT / IT032048.TXT)

### 2.1 Control Header Record

| Field | Size | Type | Format | Example |
|-------|------|------|--------|---------|
| Row Identifier | 3 | Char | - | 999 |
| Transaction ID | 15 | Char | - | GTSD |
| Filler | 4 | Char | - | blank |
| File Origin | 16 | Char | - | MAS |
| Filler | 20 | Char | - | blank |
| Creation Date/Time | 26 | Dttm | MM/DD/YYYY HH:MI:SS | File creation timestamp |

### 2.2 T-Bill Static Data

| Field | Size | Type | Format | Description |
|-------|------|------|--------|-------------|
| Row Identifier | 3 | Char | - | 000 |
| SD Type | 5 | Char | - | TBILL |
| ISIN Code | 30 | Char | - | 12 alphanumeric chars |
| Description | 50 | Char | - | Security description |
| Issuance Date | 8 | Date | YYYYMMDD | Issue date |
| Maturity Date | 8 | Date | YYYYMMDD | Maturity date |
| Nominal Value | 13.4 | Num | - | Face value |
| Discount/Premium | S13.4 | Num | - | Always negative (discount) |

### 2.3 SGS Bond Static Data

| Field | Size | Type | Format | Description |
|-------|------|------|--------|-------------|
| Row Identifier | 3 | Char | - | 000 |
| SD Type | 5 | Char | - | SGS |
| ISIN Code | 30 | Char | - | 12 alphanumeric chars |
| Description | 70 | Char | - | Security description |
| Issuance Date | 8 | Date | YYYYMMDD | First issuance date |
| Maturity Date | 8 | Date | YYYYMMDD | Maturity date |
| Nominal Value | 13.4 | Num | - | Face value |
| Discount/Premium | S13.4 | Num | - | Negative=discount, Positive=premium |
| Coupon Rate | 3.4 | Num | - | e.g., 002.6250 = 2.625% |
| First Coupon Date | 8 | Date | YYYYMMDD | Last coupon payment date |
| Second Coupon Date | 8 | Date | YYYYMMDD | Next coupon payment date |

### 2.4 Savings Bond Static Data

| Field | Size | Type | Format | Description |
|-------|------|------|--------|-------------|
| Row Identifier | 3 | Char | - | 000 |
| SD Type | 5 | Char | - | SB |
| ISIN Code | 30 | Char | - | 12 alphanumeric chars |
| Description | 70 | Char | - | Security description |
| Issuance Date | 8 | Date | YYYYMMDD | First issuance date |
| Maturity Date | 8 | Date | YYYYMMDD | Maturity date |
| Nominal Value | 13.4 | Num | - | Quantity allotted |
| Discount/Premium | S13.4 | Num | - | Always 0 |
| Coupon Rate | 3.4 | Num | - | First coupon rate |
| First Coupon Date | 8 | Date | YYYYMMDD | Issue date (for new) |
| Second Coupon Date | 8 | Date | YYYYMMDD | Next coupon date |

### 2.5 Trailer Record

| Field | Size | Type | Format | Description |
|-------|------|------|--------|-------------|
| Row Identifier | 3 | Char | - | TRL |
| Transaction ID | 15 | Char | - | GTSD |
| Total Feed Line | 9 | Num | - | Total records including header/trailer |

---

## 3. Transaction Data File (IT040048.TXT / IT042048.TXT)

### 3.1 Control Header Record

| Field | Size | Type | Format | Example |
|-------|------|------|--------|---------|
| Row Identifier | 3 | Char | - | 999 |
| Transaction ID | 15 | Char | - | GTTD |
| Filler | 4 | Char | - | blank |
| File Origin | 16 | Char | - | MAS |
| Filler | 20 | Char | - | blank |
| Creation Date/Time | 26 | Dttm | MM/DD/YYYY HH:MI:SS | File creation timestamp |

### 3.2 Transaction Types

| Code | Description | Applicable To |
|------|-------------|---------------|
| ISS | New Issue | T-Bills, SGS Bonds, Savings Bonds |
| MAT | Maturity | T-Bills, SGS Bonds, Savings Bonds |
| REO | Reopen | SGS Bonds only |
| CPN | Coupon Payment | SGS Bonds, Savings Bonds |
| RED | Early Redemption | Savings Bonds only |

### 3.3 T-Bill/SGS Bond Transaction Data

| Field | Size | Type | Format | Description |
|-------|------|------|--------|-------------|
| Row Identifier | 3 | Char | - | 000 |
| Transaction Type | 3 | Char | - | ISS/MAT/REO/CPN |
| ISIN Code | 30 | Char | - | 12 alphanumeric chars |
| Transaction Number | 10 | Char | YYMMDDxxxx | Date + sequential number |
| Transaction Date | 8 | Date | YYYYMMDD | Event date |
| Interest Paid | 13.4 | Num | - | Interest amount |
| Accrued Interest | S13.4 | Num | - | Signed accrued interest |
| Nominal Amount | 13.4 | Num | - | Transaction amount |
| Discount/Premium | S13.4 | Num | - | Discount/premium amount |

### 3.4 Savings Bond Transaction Data

| Field | Size | Type | Format | Description |
|-------|------|------|--------|-------------|
| Row Identifier | 3 | Char | - | 000 |
| Transaction Type | 3 | Char | - | ISS/MAT/RED/CPN |
| ISIN Code | 30 | Char | - | 12 alphanumeric chars |
| Transaction Number | 10 | Char | YYMMDDxxxx | Date + sequential number |
| Transaction Date | 8 | Date | YYYYMMDD | Event date |
| Interest Paid | 13.4 | Num | - | Interest amount |
| Accrued Interest | S13.4 | Num | - | Always 0 |
| Nominal Amount | 13.4 | Num | - | Transaction amount |
| Discount/Premium | S13.4 | Num | - | Always 0 |
| Coupon Rate | 3.4 | Num | - | Prevailing coupon rate |

### 3.5 Transaction Data Logic by Type

#### ISS (New Issue) - T-Bills/SGS Bonds
- **Condition:** Tender date within date range AND issue number = 1
- **Transaction Date:** Auction date
- **Interest Paid:** 0
- **Accrued Interest:** 0
- **Nominal Amount:** Total allotment amount
- **Discount/Premium:** Sum of settlement amount minus issue size

#### ISS (New Issue) - Savings Bonds
- **Condition:** Issue date within date range
- **Transaction Date:** Auction date
- **Interest Paid:** 0
- **Accrued Interest:** 0
- **Nominal Amount:** Quantity allotted
- **Discount/Premium:** 0

#### REO (Reopen) - SGS Bonds Only
- **Condition:** Tender date within date range AND issue number ≠ 1
- **Transaction Date:** Auction date of reopen
- **Interest Paid:** 0
- **Accrued Interest:** +ve if before ex-interest date, -ve if after
- **Nominal Amount:** Reissue amount
- **Discount/Premium:** Settlement minus face value minus accrued interest

#### CPN (Coupon Payment)
- **Condition:** Last interest payment date within date range
- **Transaction Date:** Coupon payment date
- **Interest Paid:** (Coupon Rate / 2) × Total nominal value
- **Accrued Interest:** 0
- **Nominal Amount:** Total outstanding amount
- **Discount/Premium:** 0

#### MAT (Maturity)
- **Condition:** Maturity date within date range
- **Transaction Date:** Maturity date
- **Interest Paid:** (Coupon Rate / 2) × Total nominal (for bonds) or 0 (for T-bills)
- **Accrued Interest:** 0
- **Nominal Amount:** Total outstanding amount
- **Discount/Premium:** 0

#### RED (Early Redemption) - Savings Bonds Only
- **Condition:** Redemption date within date range
- **Transaction Date:** Early redemption settlement date
- **Interest Paid:** ((Coupon Rate / 2) × Nominal) × (DCS / E)
- **Accrued Interest:** 0
- **Nominal Amount:** Redemption amount
- **Discount/Premium:** 0

### 3.6 Trailer Record

| Field | Size | Type | Format | Description |
|-------|------|------|--------|-------------|
| Row Identifier | 3 | Char | - | TRL |
| Transaction ID | 15 | Char | - | GTTD |
| Total Feed Line | 9 | Num | - | Total records including header/trailer |

---

## 4. ERF Data File (IT050048.TXT / IT052048.TXT)

### 4.1 Control Header Record

| Field | Size | Type | Format | Example |
|-------|------|------|--------|---------|
| Row Identifier | 3 | Char | - | 999 |
| Transaction ID | 15 | Char | - | GTED |
| Filler | 4 | Char | - | blank |
| File Origin | 16 | Char | - | MAS |
| Filler | 20 | Char | - | blank |
| Creation Date/Time | 26 | Dttm | MM/DD/YYYY HH:MI:SS | File creation timestamp |

### 4.2 ERF Transaction Data

| Field | Size | Type | Format | Description |
|-------|------|------|--------|-------------|
| Row Identifier | 3 | Char | - | 000 |
| Transaction Number | 10 | Char | YYMMDDxxxx | Date + sequential number |
| RPO Date | 8 | Date | YYYYMMDD | Opening leg settlement date |
| RPC Date | 8 | Date | YYYYMMDD | Closing leg settlement date |
| ISIN Code | 30 | Char | - | 12 alphanumeric chars |
| Nominal Amount | 13 | Num | - | Total allotted nominal |
| Price | 3.5 | Num | - | Dirty price (e.g., 100.99900) |
| Settlement Amount | 18.2 | Num | - | Dirty Price × Nominal Amount |

### 4.3 Trailer Record

| Field | Size | Type | Format | Description |
|-------|------|------|--------|-------------|
| Row Identifier | 3 | Char | - | TRL |
| Transaction ID | 15 | Char | - | GTED |
| Total Feed Line | 9 | Num | - | Total records including header/trailer |

---

## 5. Database Mappings

### 5.1 Source Tables
| Table | Content |
|-------|---------|
| `aba0001_security_master` | T-Bill/SGS Bond master data |
| `aba0007_detail_auction_result` | Auction result details |
| `aba0101_sb_security_master` | Savings Bond master data |
| `aba0124_sb_coupon_rate_details` | Savings Bond coupon rates |
| `aba0126_sb_redemption_result` | Savings Bond redemption results |
| `aba0604_trade_summary_view` | ERF trade summary |
| `aba0017_final_daily_price` | Daily closing prices |

### 5.2 Key Field Mappings

#### T-Bill/SGS Bond Static Data
| Output Field | Source Table | Source Field |
|--------------|--------------|--------------|
| ISIN Code | aba0001_security_master | aba0001_isin_code |
| Description | aba0001_security_master | aba0001_security_name |
| Issuance Date | aba0001_security_master | aba0001_issue_date |
| Maturity Date | aba0001_security_master | aba0001_maturity_date |
| Nominal Value | aba0001_security_master | aba0001_issue_size |
| Coupon Rate | aba0001_security_master | aba0001_interest_rate |
| First Coupon Date | aba0001_security_master | aba0001_last_int_date |
| Second Coupon Date | aba0001_security_master | aba0001_next_int_date |

#### Savings Bond Static Data
| Output Field | Source Table | Source Field |
|--------------|--------------|--------------|
| ISIN Code | aba0101_sb_security_master | aba0101_sb_isin_code |
| Description | aba0101_sb_security_master | aba0101_sb_security_name |
| Nominal Value | aba0101_sb_security_master | aba0101_sb_qty_allotted |
| Coupon Rate | aba0124_sb_coupon_rate_details | aba0124_coupon_rate |

#### ERF Data
| Output Field | Source Table | Source Field |
|--------------|--------------|--------------|
| RPO Date | aba0017_final_daily_price | aba0017_repot1_date |
| RPC Date | aba0017_final_daily_price | aba0017_repot2_date |
| ISIN Code | aba0001_security_master | aba0001_isin_code |
| Nominal Amount | aba0604_trade_summary_view | amt_alloted |
| Price | aba0604_trade_summary_view | dirty_price |

---

## 6. Value Encoding Rules

### 6.1 Numeric Fields
- Right-justified with leading zeros
- Example: 200,000 → `0000000200000.0000` (18 chars)

### 6.2 Signed Numeric Fields
- Include +/- sign
- Example: 123456.1234 → `+0000000123456.1234` (19 chars)
- Example: -123456.1234 → `-0000000123456.1234` (19 chars)

### 6.3 Character Fields
- Left-justified with trailing spaces

### 6.4 Coupon Rate
- Example: 2.6250% → `002.6250` (8 chars)

---

## 7. Business Rules

### 7.1 Static Data Rules
1. For SGS reopening, no static data file is required
2. If no records for the week, file contains only header and trailer
3. T-Bill and SGS Bond record lengths differ (T-Bills have no coupon dates)

### 7.2 Transaction Data Rules
1. For CPN/MAT, nominal amount includes first issue plus all reopened issues
2. Accrued interest is positive if before ex-interest date, negative if after
3. Each transaction must start on a new line

### 7.3 Discount/Premium Calculation
- **T-Bills:** Discount = Settlement Amount - Face Value (always negative)
- **SGS Bonds (New Issue):** Same as T-Bills
- **SGS Bonds (Reopen):** Discount/Premium = Settlement - Face Value - Accrued Interest

### 7.4 Interest Paid Formula
- **Regular Coupon:** (Coupon Rate / 2) × Total Nominal Value
- **Irregular First Coupon:** ((Coupon Rate / 2) × Nominal) × (DCS / E) / 100
  - DCS = Days between Issue Date and Settlement Date
  - E = Days in assumed coupon period

---

## 8. File Transfer Process

### 8.1 Scheduled Run Flow
1. Job `MSABBAGDFILE` generates data files
2. Job `MSABBAGDFW01` watches for IT050048.TXT
3. Job `MSABBFTP2AGD` transfers files via SFTP

### 8.2 Ad-hoc Run Flow
1. Configure `adhoc_run.txt` with date range
2. Job `MSABBAGDFIL2` generates data files
3. Job `MSABBAGDFW11` watches for IT052048.TXT
4. Job `MSABBFTP2AG2` transfers files via SFTP

### 8.3 Directory Structure
| Directory | Purpose |
|-----------|---------|
| /mas_appl/aba/jobs/agd | Job scripts and JAR file |
| /mas_appl/aba/data/agd | Generated data files |
| /mas_appl/aba/data/agd/backup | Archived files |
| /mas_appl/aba/logs | System logs |

### 8.4 FTP Destination
- Server: NFS FTP server
- Directory: /HOME/IN/
- Protocol: SFTP

---

## 9. Ad-hoc Configuration

### 9.1 adhoc_run.txt Format
```
#use format MM/DD/YYYY
StartDate=02/01/2014
EndDate=02/28/2014
ConversionDate=
```

---

## 10. Error Handling

| Error Message | Meaning | Recovery |
|---------------|---------|----------|
| APPLICATION ERRORS | Generic error | Check MnetError.log |
| DATABASE CONNECTION ERRORS | DB connection failed | Check DBConnBroker.log, sgsedt.log |
| MISSING ADHOC JOB PROPERTIES FILE | adhoc_run.txt issue | Verify file exists with correct format |
| ERRORS GENERATING OUTPUT FILE | File creation failed | Check MnetError.log |
