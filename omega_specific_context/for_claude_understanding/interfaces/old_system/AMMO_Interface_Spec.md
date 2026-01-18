# AMMO Interface Specification

> **Document Type:** Interface Specification
> **Source File:** AMMO_Interface_Spec.docx
> **System:** Old eApps System (Legacy)
> **Target System:** AMMO (Automated Money Market Operations) E-Platform

---

## 1. Overview

The AMMO interface sends daily closing prices for SGS securities from eApps to the AMMO E-Platform. Two file types are transmitted:

1. **closingprice_ammo.txt** - Daily closing prices for SGS Bonds, FRN, T-Bills, and MAS Bills
2. **SORA_yyyyMMdd_HHmmss.txt** - Singapore Overnight Rate Average data

---

## 2. File 1: closingprice_ammo.txt

### 2.1 Purpose
Send SGS Bonds, FRN, T-Bills, and MAS Bills closing prices to AMMO E-Platform daily.

### 2.2 Source Tables
| Table Name | Description |
|------------|-------------|
| `ABA0001_SECURITY_MASTER` | Security master data |
| `ABA0017_FINAL_DAILY_PRICE` | Final daily price data |

### 2.3 Data Filter
Only securities where `aba0001_issue_date <= SYSDATE` (i.e., issued securities only)

### 2.4 File Format
- **Delimiter:** Semicolon (`;`)
- **Character Set:** ASCII

### 2.5 Field Specification

| # | Field Name | Length | Source | Description |
|---|-----------|--------|--------|-------------|
| 1 | Submission Date | 8 | `ABA0017_SUBMISSION_DATE` | Format: YYYYMMDD |
| 2 | Security ISIN Code | 12 | `ABA0001_ISIN_CODE` | 12-character ISIN code |
| 3 | Security Code | 8 | `ABA0017_SECURITY_CODE` | 8-character security code |
| 4 | MLA Price | 8 | See logic below | Market Liquidity Adjustment price |
| 5 | T1 Dirty Price | 8 | `ABA0017_T1_DIRTY_PRICE` | T+1 dirty price |
| 6 | Yield | 9 | See logic below | Yield with sign indicator |
| 7 | Clean Price | 8 | See logic below | Clean price value |

### 2.6 Field Logic by Security Type

#### MLA Price (Field 4)
| Security Type | Source Field |
|--------------|--------------|
| T-Bill / MAS-Bill | `ABA0017_YIELD` |
| Bond / FRN | `ABA0017_MLA_PRICE` |

#### Yield (Field 6)
| Security Type | Source Field |
|--------------|--------------|
| T-Bill / MAS-Bill | `ABA0017_AVE_PRICE` |
| Bond / FRN | `ABA0017_YIELD` |

#### Clean Price (Field 7)
| Security Type | Source Field |
|--------------|--------------|
| T-Bill / MAS-Bill | `ABA0017_YIELD` |
| Bond / FRN | `ABA0017_AVE_PRICE` |

### 2.7 Value Encoding Rules

#### Price Encoding (8 digits)
| Original Value | Encoded Value |
|----------------|---------------|
| 99.938 | 09993800 |
| 100.101 | 10010100 |

**Rule:** Remove decimal point, pad with leading zeros to 8 digits, pad with trailing zeros for decimal precision.

#### Yield Encoding (9 characters with sign)
| Original Value | Encoded Value |
|----------------|---------------|
| -3.200 | -00320000 |
| 0.000 | +00000000 |
| 3.200 | +00320000 |

**Rule:** First character is sign (`+` or `-`), followed by 8-digit value with leading zeros.

### 2.8 Sample Records
```
20140113;SGUATJAN1422;N214001T;09940000;09940000;+00032000;09930000
20140113;SGUATJAN1401;MX13502T;09988300;09988400;+00030000;09988300
20140113;SGUATJAN1402;BS14002T;09985000;09985000;+00030000;09985000
```

#### Sample Record Breakdown (First Line)
| Field | Value | Description |
|-------|-------|-------------|
| Submission Date | 20140113 | January 13, 2014 |
| ISIN Code | SGUATJAN1422 | Security ISIN |
| Security Code | N214001T | Internal security code |
| MLA Price | 09940000 | 99.40000 |
| T1 Dirty Price | 09940000 | 99.40000 |
| Yield | +00032000 | +0.32000% |
| Clean Price | 09930000 | 99.30000 |

---

## 3. File 2: SORA_yyyyMMdd_HHmmss.txt

### 3.1 Purpose
Send Singapore Overnight Rate Average (SORA) data to AMMO E-Platform.

### 3.2 Reference Document
MAS AMMO E-Platform FS - SORA v1.5

### 3.3 File Naming Convention
`SORA_yyyyMMdd_HHmmss.txt`

Where:
- `yyyyMMdd` = Date (e.g., 20231015)
- `HHmmss` = Time (e.g., 093045)

### 3.4 Field Specification

| # | Field Name | Type | Format | Description |
|---|-----------|------|--------|-------------|
| 1 | publication_date | Date | YYYY-MM-DD | SORA publication date |
| 2 | value_date | Date | YYYY-MM-DD | SORA value date |
| 3 | sora_rate | Number | Max 7.4 digits | SORA rate (half round up) |
| 4 | sora_index | Number | Max 13.10 digits | SORA index value (half round up) |
| 5 | compounded_sora_1m | Number | Max 7.4 digits | 1-month compounded SORA (half round up) |
| 6 | compounded_sora_3m | Number | Max 7.4 digits | 3-month compounded SORA (half round up) |
| 7 | compounded_sora_6m | Number | Max 7.4 digits | 6-month compounded SORA (half round up) |
| 8 | aggregate_volume | Number | Max 5 digits | Trading volume (empty if Contingency) |
| 9 | highest_transacted_rate | Number | Max 7.4 digits | Highest rate (empty if Contingency) |
| 10 | lowest_transacted_rate | Number | Max 7.4 digits | Lowest rate (empty if Contingency) |
| 11 | calculation_method | Text | Max 50 chars | Calculation method used |
| 12 | last_modified_by | Text | - | Always "SORA" |

### 3.5 Numeric Precision Rules

| Field | Whole Numbers | Decimal Places | Rounding |
|-------|--------------|----------------|----------|
| sora_rate | 7 | 4 | Half round up |
| sora_index | 13 | 10 | Half round up |
| compounded_sora_1m | 7 | 4 | Half round up |
| compounded_sora_3m | 7 | 4 | Half round up |
| compounded_sora_6m | 7 | 4 | Half round up |
| aggregate_volume | 5 | 0 | Half round up |
| highest_transacted_rate | 7 | 4 | Half round up |
| lowest_transacted_rate | 7 | 4 | Half round up |

### 3.6 Contingency Mode
When SORA is calculated using the contingency method, the following fields are left empty:
- aggregate_volume
- highest_transacted_rate
- lowest_transacted_rate

---

## 4. Transmission Details

### 4.1 Frequency
- **closingprice_ammo.txt:** Daily (end of business day)
- **SORA_yyyyMMdd_HHmmss.txt:** Daily (upon SORA publication)

### 4.2 Direction
eApps → AMMO E-Platform

### 4.3 Protocol
MEFT (MAS Electronic File Transfer)

---

## 5. Database Schema Reference

### 5.1 ABA0001_SECURITY_MASTER
| Field | Description |
|-------|-------------|
| ISIN_CODE | 12-character ISIN |
| ISSUE_DATE | Security issue date |

### 5.2 ABA0017_FINAL_DAILY_PRICE
| Field | Description |
|-------|-------------|
| SUBMISSION_DATE | Price submission date |
| SECURITY_CODE | Security identifier |
| YIELD | Yield value |
| MLA_PRICE | Market Liquidity Adjustment price |
| T1_DIRTY_PRICE | T+1 dirty price |
| AVE_PRICE | Average price |

---

## 6. Validation Rules

### 6.1 closingprice_ammo.txt
1. All securities must have `issue_date <= system_date`
2. All price fields must be 8 digits
3. Yield field must be 9 characters (sign + 8 digits)
4. ISIN code must be exactly 12 characters
5. Security code must be exactly 8 characters
6. Submission date must be valid YYYYMMDD format

### 6.2 SORA File
1. Publication date must be valid YYYY-MM-DD format
2. Value date must be valid YYYY-MM-DD format
3. Numeric fields must not exceed specified precision
4. last_modified_by must be "SORA"
5. If calculation_method is "Contingency", volume and rate fields should be empty
