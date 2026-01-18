# FMBS Interface Specification

> **Document Type:** Interface Specification
> **Source File:** FMBS_Interface_Spec.docx
> **System:** Old eApps System (Legacy)
> **Target System:** FMBS (Financial Market Business System)

---

## 1. Overview

The FMBS interface receives multiple file types from eApps for financial market operations:

1. **closingprice_fmbs.txt** - Daily closing prices
2. **secupdt_fmbs.txt** - Security updates after auction
3. **auction_fmbs.txt** - Bank auction results
4. **fmbs_erf.txt** - ERF (Electronic Repo Facility) results
5. **fmbs_erf_agg_bids.csv** - ERF aggregated bids

---

## 2. File 1: closingprice_fmbs.txt

### 2.1 Purpose
Send SGS Bonds, FRN, T-Bills, and MAS Bills closing prices to FMBS daily.

### 2.2 Source Tables
| Table Name | Description |
|------------|-------------|
| `ABA0001_SECURITY_MASTER` | Security master data |
| `ABA0017_FINAL_DAILY_PRICE` | Final daily price data |

### 2.3 File Format
- **Delimiter:** Semicolon (`;`)

### 2.4 Field Specification

| # | Field Name | Length | Source | Description |
|---|-----------|--------|--------|-------------|
| 1 | Submission Date | 8 | `ABA0017_SUBMISSION_DATE` | Format: YYYYMMDD |
| 2 | Security ISIN Code | 12 | `ABA0001_ISIN_CODE` | 12-character ISIN |
| 3 | Security Code | 8 | `ABA0017_SECURITY_CODE` | Security identifier |
| 4 | MLA Price | 8 | See logic | Market Liquidity Adjustment price |
| 5 | T1 Dirty Price | 8 | `ABA0017_T1_DIRTY_PRICE` | T+1 dirty price |
| 6 | Yield | 9 | See logic | Yield with sign indicator |

### 2.5 Field Logic by Security Type

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

### 2.6 Value Encoding Rules

#### Price Encoding (8 digits)
| Original | Encoded |
|----------|---------|
| 99.938 | 09993800 |
| 100.101 | 10010100 |

#### Yield Encoding (9 characters with sign)
| Original | Encoded |
|----------|---------|
| -3.200 | -00320000 |
| 0.000 | +00000000 |
| 3.200 | +00320000 |

### 2.7 Sample Records
```
20140113;SGUATJAN1422;N214001T;09940000;09940000;+00032000
20140113;SGUATJAN1401;MX13502T;09988300;09988400;+00030000
20140113;SGUATJAN1402;BS14002T;09985000;09985000;+00030000
```

---

## 3. File 2: secupdt_fmbs.txt

### 3.1 Purpose
Send security update information after auction completion. Same format as MEPS+ secupdt.txt.

### 3.2 File Format
- **Format:** Fixed-width positional
- **Record Types:**
  - T-Bills/MAS-Bills: Fields 1-26
  - Bonds: Fields 1-33

### 3.3 Field Specification

| # | Field | Format | Position | Description |
|---|-------|--------|----------|-------------|
| 1 | ISSUE_CODE | X(8) | 1-8 | e.g., NX00100H |
| 2 | ISSUE_NO | 9(1) | 9 | 1=new, 2-9=re-opening |
| 3 | ISSUE_TYPE | X(1) | 10 | Always space |
| 4 | CURR | X(3) | 11-13 | Always 'SGD' |
| 5 | ISSUE_DESC | X(30) | 14-43 | ISIN description |
| 6 | ISSUE_DATE | X(8) | 44-51 | YYYYMMDD |
| 7 | TENDER_DATE | X(8) | 52-59 | YYYYMMDD |
| 8 | QTY_OFFERED | 9(13) | 60-72 | Total auction nominal |
| 9 | QTY_APPLIED | 9(13) | 73-85 | Applied quantity |
| 10 | AVE_YIELD | S9(3)v9(2) | 86-91 | Average yield with +/- |
| 11 | CUT_OFF_YIELD | S9(3)v9(2) | 92-97 | Cutoff yield with +/- |
| 12 | MATURITY_DATE | X(8) | 98-105 | YYYYMMDD |
| 13 | PERCENT_COY | 9(3)v9(2) | 106-110 | Percentage cover |
| 14 | PERCENT_SUB | 9(3)v9(2) | 111-115 | Percentage subscribed |
| 15 | NC_PERCENT | 9(3)v9(2) | 116-120 | Non-competitive percentage |
| 16 | NC_QTY_ALLOT | 9(13) | 121-133 | NC quantity allotted |
| 17 | INT_RATE | 9(3)v9(4) | 134-140 | Coupon rate (0 for new) |
| 18 | TAX_STATUS | X(1) | 141 | Y or N |
| 19 | CUT_OFF_YIELD_PRICE | 9(3)v9(4) | 142-148 | Cutoff price |
| 20 | AVE_YIELD_PRICE | 9(3)v9(4) | 149-155 | Average price |
| 21 | CLOSING_PRICE | 9(3)v9(4) | 156-162 | Closing price |
| 22 | ISIN_CODE | X(12) | 163-174 | ISIN code |
| 23 | TENOR | 9(3) | 175-177 | Days (T-Bills) or Years (Bonds) |
| 24 | ETENDER_IND | X(1) | 178 | 'Y' if ISSUE_DATE > 14012002 |
| 25 | MAS_APPLIED | 9(13) | 179-191 | MAS applied amount |
| 26 | MAS_ALLOTTED | 9(13) | 192-204 | MAS allotted amount |

### 3.4 Bond-Only Fields (27-33)

| # | Field | Format | Position | Description |
|---|-------|--------|----------|-------------|
| 27 | INT_PAID_IND | X(1) | 205 | Interest paid indicator |
| 28 | LAST_INT_DATE | X(8) | 206-213 | YYYYMMDD |
| 29 | NEXT_INT_DATE | X(8) | 214-221 | YYYYMMDD |
| 30 | ACCRUED_INT_DAYS | 9(3) | 222-224 | Always 000 |
| 31 | INT_DATE1 | 9(4) | 225-228 | MMDD |
| 32 | INT_DATE2 | 9(4) | 229-232 | MMDD |
| 33 | EX_INT_DATE | X(8) | 233-240 | YYYYMMDD |

### 3.5 Yield Value Encoding
| Original | Encoded |
|----------|---------|
| 123.45 | +12345 |
| 23.45 | +02345 |
| 3.4 | +00340 |
| 0 | +00000 |
| -123.45 | -12345 |
| -23.45 | -02345 |
| -3.4 | -00340 |

### 3.6 Format Notation
| Symbol | Meaning |
|--------|---------|
| 9(n) | n-digit numeric |
| X(n) | n-character alphanumeric |
| S | Signed (+/-) |
| v | Implied decimal point |

---

## 4. File 3: auction_fmbs.txt

### 4.1 Purpose
Send MAS allotted auction results to FMBS.

### 4.2 File Format
- **Delimiter:** Semicolon (`;`)
- **Note:** File only has values if MAS is allotted bids

### 4.3 Field Specification

| # | Field | Format | Line | Col | Description |
|---|-------|--------|------|-----|-------------|
| 1 | ISIN_CODE | X(12) | 1 | 1 | e.g., SG1234567890 |
| 2 | ISSUE_CODE | X(8) | 1 | 2 | e.g., NX00100H |
| 3 | ISSUE_DATE | X(8) | 1 | 3 | YYYYMMDD |
| 4 | REC_NUM | 9(3) | 1 | 4 | Always 001 |
| 5 | MBR_CODE | X(8) | 1 | 5 | Always MASGSGSG |
| 6 | BANK_CODE | 9(4) | 1 | 6 | Always 2500 |
| 7 | CUSTODY_CODE | X(3) | 1 | 7 | Always TRD |
| 8 | PRICE | 9(3)v9(9) | 1 | 8 | Modified clean price |
| 9 | NOMINAL_AMT | 9(13) | 1 | 9 | Nominal amount |
| 10 | SETT_AMT | 9(15)v9(2) | 1 | 10 | Settlement amount |

### 4.4 Price Encoding
| Original | Encoded |
|----------|---------|
| 124.005001234 | 124005001234 |

### 4.5 Settlement Amount
| Original | Encoded |
|----------|---------|
| $100,000.00 | 10000000 |

---

## 5. File 4: fmbs_erf.txt

### 5.1 Purpose
Send MAS Repo Facility (ERF) transaction results to FMBS.

### 5.2 Reference
ERF Interface Specification - ERF to FMBS v0.1.docx

### 5.3 File Structure
- Each transaction has 3 lines:
  - **Line 1:** Receiving securities (INOUT_INDICATOR = 'I')
  - **Line 2:** Delivering securities (INOUT_INDICATOR = 'O')
  - **Line 3:** End transaction indicator (ENDTXN)
- **Delimiter:** Semicolon (`;`)
- **Note:** Each file contains only ONE MAS Repo Facility transaction

### 5.4 Line 1 - Receiving Securities

| # | Field | Format | Description |
|---|-------|--------|-------------|
| 1 | TXN_REF_NO | 9(16) | Transaction reference |
| 2 | MSG_FUNCTION | X(8) | e.g., NEWM |
| 3 | MBR_CODE | X(8) | Bank short name |
| 4 | BANK_CODE | 9(4) | Bank code |
| 5 | CUSTODY_CODE | 9(3) | e.g., TRD |
| 6 | EXECUTION_DATE | X(8) | YYYYMMDD |
| 7 | REVERSAL_DATE | X(8) | YYYYMMDD |
| 8 | TXN_AMT | 9(13)v9(2) | Repo Fee (`ABA0605_REPO_FEE`) |
| 9 | DELIVERING_ISIN | 9(1) | No. of ISINs to deliver |
| 10 | RECEIVING_ISIN | 9(1) | No. of ISINs to receive |
| 11 | PREV_TXN_REF_NO | X(16) | Previous transaction reference |
| 12 | INOUT_INDICATOR | X(1) | 'I' = Receiving |
| 13 | ISIN_CODE | X(12) | ISIN code |
| 14 | ISSUE_CODE | X(8) | `ABA0605_SECURITY_CODE` |
| 15 | NOMINAL_AMT | 9(13) | `ABA0605_AMT_ALLOTTED` |
| 16 | PRICE | 9(3)v9(5) | Dirty price with haircut (`ABA0605_DIRTY_PRICE`) |
| 17 | CURRENT_VALUE | 9(18)v9(2) | Dirty Price × Nominal Amount |
| 18 | HAIRCUT | 9(3)v9(2) | e.g., 10.5 → 01050000 |
| 19 | REPO_RATE | 9(4)v9(3) | `ABA0605_REPO_RATE` |

### 5.5 Line 2 - Delivering Securities

| # | Field | Format | Description |
|---|-------|--------|-------------|
| 20-30 | Same as Line 1 | | Same structure |
| 31 | INOUT_INDICATOR | X(1) | 'O' = Delivering |
| 32 | ISIN_CODE | X(12) | ISIN code |
| 33 | ISSUE_CODE | X(8) | `ABA0605_EXG_SEC_CODE` |
| 34 | NOMINAL_AMT | 9(13) | `ABA0605_EXG_NOMINAL_AMT` |
| 35-38 | Same as Line 1 | | Same fields |
| 39 | END_TRANSACTION_INDICATOR | X(6) | ENDTXN (Line 3 only) |

### 5.6 Price Encoding
| Original | Encoded |
|----------|---------|
| 100.999 | 10099900 |

### 5.7 Haircut Encoding
| Original | Encoded |
|----------|---------|
| 10.5% | 01050000 |

### 5.8 Repo Rate Encoding
| Original | Encoded |
|----------|---------|
| 0.1% | 0000100 |

---

## 6. File 5: fmbs_erf_agg_bids.csv

### 6.1 Purpose
Aggregated ERF bid summary.

### 6.2 File Format
- **Delimiter:** Comma (`,`)
- **Note:** Each file contains only ONE MAS Repo Facility transaction

### 6.3 Field Specification

| # | Field | Format | Description |
|---|-------|--------|-------------|
| 1 | TXN_REF_NO | 9(16) | Transaction reference |
| 2 | ISSUE_CODE | X(8) | e.g., NX00100H |
| 3 | AGG_NOM_AMT | 9(13) | Aggregated nominal amount |
| 4 | EXECUTION_DATE | X(8) | YYYYMMDD |
| 5 | REVERSAL_DATE | X(8) | YYYYMMDD |
| 6 | EOD_CLOSING_PRICE | 9(3)v9(5) | Dirty price with haircut |
| 7 | CURRENT_VALUE | 9(18)v9(2) | Dirty Price × Nominal Amount |

---

## 7. Database Tables Referenced

| Table | Description |
|-------|-------------|
| `ABA0001_SECURITY_MASTER` | Security master data |
| `ABA0017_FINAL_DAILY_PRICE` | Daily closing prices |
| `ABA0605_*` | ERF transaction data |

---

## 8. Format Notation Reference

| Symbol | Meaning | Example |
|--------|---------|---------|
| 9(n) | n-digit numeric | 9(8) = 8 digits |
| 9(n)v9(m) | n whole + m decimal | 9(3)v9(4) = 123.4567 |
| S9(n)v9(m) | Signed numeric | S9(3)v9(2) = +123.45 |
| X(n) | n-char alphanumeric | X(12) = 12 chars |

---

## 9. Transmission Summary

| File | Frequency | Content |
|------|-----------|---------|
| closingprice_fmbs.txt | Daily | Closing prices |
| secupdt_fmbs.txt | Per auction | Security updates |
| auction_fmbs.txt | Per auction | MAS auction results |
| fmbs_erf.txt | Per ERF transaction | ERF results |
| fmbs_erf_agg_bids.csv | Per ERF transaction | Aggregated ERF bids |

---

## 10. Validation Rules

### 10.1 General Rules
1. Unused areas padded with leading zeros or spaces
2. Decimal fields padded with trailing zeros
3. Record length excess characters are ignored

### 10.2 Field-Specific Rules
1. Date fields must be valid YYYYMMDD
2. Numeric fields must contain only digits
3. ISIN codes must be 12 characters
4. Issue codes must be 8 characters
5. Signed yields must have +/- prefix
