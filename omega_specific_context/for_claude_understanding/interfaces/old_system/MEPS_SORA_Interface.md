# MEPS+ SORA Interface Specification

> **Document Type:** Interface Specification
> **Source File:** MEPS+_Sora_File_Spec.docx
> **System:** Old eApps System (Legacy)
> **Target System:** MEPS+ (MAS Electronic Payment System Plus)

---

## 1. Overview

The MEPS+ SORA interface sends the Singapore Overnight Rate Average (SORA) index data from eApps to the MEPS+ system daily.

### 1.1 Purpose
Provide SORA index values to MEPS+ for use in FRN (Floating Rate Note) calculations and other monetary operations.

### 1.2 Reference Document
FRN_SORA_SDS_V1.4.docx

---

## 2. File: meps_sora_index.txt

### 2.1 File Characteristics
| Property | Value |
|----------|-------|
| Filename | `meps_sora_index.txt` |
| Delimiter | Pipe character (`|`) |
| Records per file | One record only |
| Frequency | Daily |
| Condition | SORA Publication Date = System Date |

### 2.2 Source Table
`ABA0029_SORA_RATE`

---

## 3. Field Specification

| # | Field Name | Format | Source | Description |
|---|-----------|--------|--------|-------------|
| 1 | SORA Publication Date | X(8) | `ABA0029_SORA_PUB_DT` | YYYYMMDD format |
| 2 | Value Date | X(8) | `ABA0029_SORA_VALUE_DT` | YYYYMMDD format |
| 3 | SORA Rate | 9(3)v9(10) | `ABA0029_SORA_INDEX` | SORA Index value |

---

## 4. Field Details

### 4.1 SORA Publication Date
- **Format:** YYYYMMDD
- **Source:** `ABA0029_SORA_PUB_DT`
- **Description:** The date when the SORA rate is published
- **Example:** `20231015` (October 15, 2023)

### 4.2 Value Date
- **Format:** YYYYMMDD
- **Source:** `ABA0029_SORA_VALUE_DT`
- **Description:** The value date associated with the SORA rate
- **Example:** `20231013` (October 13, 2023)

### 4.3 SORA Rate
- **Format:** 9(3)v9(10) - 3 whole digits + 10 decimal places
- **Source:** `ABA0029_SORA_INDEX`
- **Description:** Singapore Overnight Rate Average Index
- **Encoding:** Remove decimal point, pad to 13 digits

---

## 5. Value Encoding

### 5.1 SORA Rate Examples
| Original Value | Encoded Value |
|----------------|---------------|
| 124.0050100000 | 1240050100000 |
| 100.1234567890 | 1001234567890 |
| 99.9999999999 | 0999999999999 |

**Rule:**
- 13-digit total (3 whole + 10 decimal)
- Implicit decimal after 3rd digit
- Leading zeros for values < 100
- Trailing zeros to fill 10 decimal places

---

## 6. Sample Record

```
20231015|20231013|1240050100000
```

### 6.1 Record Breakdown
| Field | Value | Interpretation |
|-------|-------|----------------|
| SORA Publication Date | 20231015 | October 15, 2023 |
| Value Date | 20231013 | October 13, 2023 |
| SORA Rate | 1240050100000 | 124.0050100000 |

---

## 7. Transmission Details

### 7.1 Schedule
- **Frequency:** Daily
- **Timing:** Upon SORA publication
- **Condition:** Only generated when SORA Publication Date equals System Date

### 7.2 Direction
eApps → MEPS+

### 7.3 Protocol
MEFT (MAS Electronic File Transfer)

---

## 8. Database Schema

### 8.1 ABA0029_SORA_RATE Table
| Column | Type | Description |
|--------|------|-------------|
| SORA_PUB_DT | DATE | Publication date |
| SORA_VALUE_DT | DATE | Value date |
| SORA_INDEX | NUMBER(13,10) | SORA index value |

---

## 9. Validation Rules

### 9.1 File-Level Validation
1. File must contain exactly one record
2. All three fields must be present
3. Fields must be pipe-delimited

### 9.2 Field-Level Validation
| Field | Validation |
|-------|------------|
| SORA Publication Date | Valid YYYYMMDD, equals system date |
| Value Date | Valid YYYYMMDD, typically < Publication Date |
| SORA Rate | 13 numeric digits, non-zero |

---

## 10. Business Rules

### 10.1 Publication Timing
- SORA is typically published at 9:00 AM SGT
- Value date is usually T-1 (one business day before publication)

### 10.2 File Generation
- File generated only once per day
- No file generated on non-publication days (weekends/holidays)

### 10.3 SORA Index Usage
- Used for FRN (Floating Rate Note) coupon calculations
- Reference rate for various MEPS+ monetary operations

---

## 11. Format Notation

| Symbol | Meaning |
|--------|---------|
| X(n) | n-character alphanumeric |
| 9(n) | n-digit numeric |
| 9(n)v9(m) | n whole digits + m decimal places |

---

## 12. Integration with Other SORA Files

This interface is related to:
- **SORA_yyyyMMdd_HHmmss.txt** (AMMO interface) - Contains additional SORA metrics
- **meps_sora_index.txt** (this file) - Contains only the SORA index for MEPS+

The AMMO file includes additional fields like compounded SORA rates, aggregate volume, and transaction rates not included in the MEPS+ file.
