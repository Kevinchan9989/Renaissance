# MERIT Interface Specification

> **Document Type:** Interface Specification
> **Source File:** MERIT_Interface_Spec.docx
> **System:** Old eApps System (Legacy)
> **Target System:** MERIT (MAS Enterprise Reporting & Information Tool)

---

## 1. Overview

The MERIT interface sends monthly SGS yield data from eApps to MERIT for reporting purposes. The interface file contains daily closing yields for all SGS securities (bonds and T-bills) for the previous month.

---

## 2. File: GL.I.EAPPS.SGS_MASTER.YYYYMMDDHHMMSS.TXT

### 2.1 Purpose
Send previous month's daily closing prices and yields to MERIT for SGS bonds and T-bills.

### 2.2 Reference Document
MERIT F1 0-07 GL Interface Sub FS V 1.0.docx

### 2.3 File Naming Convention
`GL.I.EAPPS.SGS_MASTER.YYYYMMDDHHMMSS.TXT`

Where:
- `YYYYMMDD` = Generation date
- `HHMMSS` = Generation time

Example: `GL.I.EAPPS.SGS_MASTER.20231101093000.TXT`

### 2.4 Content Description
- Contains daily yield data for every day of the previous month
- Includes both working days and non-working days
- Non-working days have zero values
- Only includes bonds and T-bills (not MAS Bills)

---

## 3. Field Specification

| # | Field Name | Type | Length | Format | Description |
|---|-----------|------|--------|--------|-------------|
| 1 | Date | Numeric | 8 | YYYYMMDD | Applicable date for yield extracted |
| 2 | Issue code | Alphanumeric | 8 | - | SGS security code |
| 3 | Issue date | Numeric | 8 | YYYYMMDD | Issue date of SGS security |
| 4 | Maturity date | Numeric | 8 | YYYYMMDD | Maturity date of SGS security |
| 5 | Sign | Alphanumeric | 1 | `+` or `-` | Sign indicator for yield |
| 6 | SGS yield | Numeric | 5 | Leading zeros | Daily SGS closing yield |
| 7 | SGS issue size | Numeric | 15 | Leading zeros | Total issue size |

---

## 4. Value Encoding Rules

### 4.1 Date Fields (Fields 1, 3, 4)
- Format: `YYYYMMDD`
- Example: January 15, 2024 = `20240115`

### 4.2 Sign Field (Field 5)
| Condition | Sign Character |
|-----------|----------------|
| Positive yield | `+` |
| Zero yield | `+` |
| Negative yield | `-` |

### 4.3 SGS Yield Encoding (Field 6)
| Original Value | Encoded Value |
|----------------|---------------|
| 12.30 | 01230 |
| 3.45 | 00345 |
| 0.50 | 00050 |
| 0.00 | 00000 |

**Rule:**
- 5-digit numeric field
- Implied decimal: 2 decimal places (divide by 100 to get actual value)
- Leading zeros for alignment
- Example: `01230` = 12.30%

### 4.4 SGS Issue Size Encoding (Field 7)
| Original Value | Encoded Value |
|----------------|---------------|
| 1234.00 | 000000000123400 |
| 500.00 | 000000000050000 |
| 10000.00 | 000000001000000 |

**Rule:**
- 15-digit numeric field
- Implied decimal: 2 decimal places (divide by 100 to get actual value)
- Leading zeros for alignment
- Example: `000000000123400` = 1234.00 (million SGD)

---

## 5. Sample Data

### 5.1 Sample Records
```
20231001NX23001H20230315202603150012500000000500000000
20231001NX23002H20230601202606010025000000001000000000
20231002NX23001H20230315202603150012600000000500000000
20231002NX23002H20230601202606010025100000001000000000
```

### 5.2 Record Breakdown (First Line)
| Field | Value | Interpretation |
|-------|-------|----------------|
| Date | 20231001 | October 1, 2023 |
| Issue code | NX23001H | SGS security code |
| Issue date | 20230315 | March 15, 2023 |
| Maturity date | 20260315 | March 15, 2026 |
| Sign | + | Positive yield |
| SGS yield | 01250 | 12.50% |
| SGS issue size | 000000500000000 | 500,000.00 (million SGD) |

---

## 6. File Generation Logic

### 6.1 Trigger
- Generated at the start of each new month
- Contains data for the entire previous month

### 6.2 Date Range
- Start: First day of previous month
- End: Last day of previous month
- Includes all calendar days (working and non-working)

### 6.3 Securities Included
- All SGS Bonds
- All T-Bills
- Excludes MAS Bills

### 6.4 Non-Working Day Handling
- Records are still generated for non-working days
- Yield values are set to zero (00000)
- Issue size remains unchanged

---

## 7. Transmission Details

### 7.1 Frequency
Monthly (at the beginning of each month for previous month's data)

### 7.2 Direction
eApps → MERIT

### 7.3 Protocol
MAS internal file transfer

### 7.4 File Size Estimation
- Approximately 31 records per security per month
- Total records = (number of securities) × 31

---

## 8. Validation Rules

### 8.1 Field-Level Validation
| Field | Validation Rule |
|-------|-----------------|
| Date | Must be valid YYYYMMDD format |
| Issue code | Must be 8 alphanumeric characters |
| Issue date | Must be valid YYYYMMDD, must be ≤ Date |
| Maturity date | Must be valid YYYYMMDD, must be > Issue date |
| Sign | Must be `+` or `-` only |
| SGS yield | Must be 5 numeric digits |
| SGS issue size | Must be 15 numeric digits |

### 8.2 File-Level Validation
1. File must contain complete month data
2. All securities must have 28-31 records (depending on month)
3. Dates must be consecutive within the month
4. No duplicate records (same date + issue code)

---

## 9. Error Handling

### 9.1 Missing Data
- If closing price data is unavailable for a security on a given date, use previous day's value
- If no previous value exists, use zero

### 9.2 File Generation Failures
- Retry file generation up to 3 times
- Alert operations team if generation fails

---

## 10. Business Rules

### 10.1 Security Selection
- Only securities with `issue_date <= report_date` are included
- Only securities with `maturity_date > report_date` are included
- Matured securities are excluded from the file

### 10.2 Yield Source
- Daily closing yields are sourced from `ABA0017_FINAL_DAILY_PRICE` table
- Validated and approved yields only

### 10.3 Issue Size Source
- Issue size from `ABA0001_SECURITY_MASTER` table
- Reflects the latest outstanding amount
