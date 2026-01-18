# OMEGA MEPS+, FMBS and AGD Interface Specification

> **Document Type:** Interface Specification
> **Source File:** MAS_OMEGA - Interface Functional Specifications Document (MEPS+,FMBS and AGD)_v0.02.docx
> **System:** OMEGA (Open Market Execution Gateway) - New System
> **Target Systems:** MEPS+, FMBS, AGD
> **Version:** 0.02

---

## 1. Overview

### 1.1 Purpose
OMEGA interfaces with MEPS+ (MAS Electronic Payment System+), FMBS (Front Middle and Back Office System), and AGD (Accountant-General's Department) for data exchange related to the securities issuance lifecycle.

### 1.2 Scope
This specification covers interface files supporting:
- Security issuance and auction details
- Allotment results for various security types
- Coupon rates and redemptions for SSB
- Daily securities updates and closing prices

### 1.3 Security Types Covered
| Security Type | Full Name |
|--------------|-----------|
| CMTB | Cash Management Treasury Bills |
| MAS Bills | MAS Bills |
| SGS Bonds | Singapore Government Securities Bonds |
| SSB | Singapore Savings Bond |
| T-Bills | Treasury Bills |

### 1.4 Interface Direction Convention
All descriptions are from OMEGA's perspective:
- **Incoming**: Files received by OMEGA
- **Outgoing**: Files sent by OMEGA

---

## 2. Technical & Operational Requirements

### 2.1 Communication Channel
- **Protocol**: MEFT (MAS Enterprise File Transfer) via SFTP
- **Routing**: MEFT prepends routing prefix during transit, automatically removed before delivery

### 2.2 Data Format
- **Format**: Fixed-width text (.txt)
- **Structure**: Sequential with line separation
- Each record begins on a new line

### 2.3 Field Delimiters
**Semicolon (`;`) delimited files:**
- auction.txt
- couponrates_sbond.txt
- auction_sbond.txt
- rdmpartial_sbond.txt
- auction_fmbs.txt
- closingprice.txt [R2]

**No delimiter (fixed-width positional):**
- All other files

### 2.4 Data Type Notation

| Symbol | Meaning | Example |
|--------|---------|---------|
| X(n) | n-character alphanumeric | X(8) = 8 chars |
| 9(n) | n-digit numeric | 9(10) = 10 digits |
| 9(n)v9(m) | Implicit decimal | 9(3)v9(2) = 123.45 (stored as 12345) |
| 9(n).9(m) | Explicit decimal (AGD only) | 9(3).9(2) = 123.45 (stored as 123.45) |
| S9(n)v9(m) | Signed numeric | S9(3)v9(2) = +12345 or -12345 |

### 2.5 Padding Rules
| Field Type | Alignment | Padding | Example |
|-----------|-----------|---------|---------|
| Numeric (9) | Right-aligned | Leading zeros | 123 → 00000123 |
| Alphanumeric (X) | Left-aligned | Trailing spaces | ABC → ABC_____ |

**Data Normalization**: OMEGA trims all leading/trailing spaces from incoming alphanumeric fields.

### 2.6 Encryption
| Target System | Encryption |
|--------------|------------|
| MEPS+ | None |
| FMBS | None |
| AGD | PGP required (.pgp extension) |

**AGD Encryption Process:**
1. Source encrypts with Destination's public key
2. Append `.pgp` extension (e.g., IT030048.txt.pgp)
3. Destination decrypts with private key
4. Remove `.pgp` extension

---

## 3. MEPS+ Interface Files

### 3.1 File Summary

| File | Direction | Description | Frequency |
|------|-----------|-------------|-----------|
| secmast.txt | Incoming | New Issuance/Reopening | Manual trigger |
| secint.txt | Incoming | Daily Securities Update | Daily 7 AM |
| secupdt.txt | Outgoing | Securities Update after Auction | After auction |
| auction.txt | Outgoing | Auction Results | After auction |
| couponrates_sbond.txt | Incoming | SSB Step-up Coupon Rates | Manual trigger |
| auction_sbond.txt | Outgoing | SSB Allotment Results | Allotment date |
| rdmpartial_sbond.txt | Outgoing | SSB Partial Redemption | Allotment date |
| bank.txt | Incoming | Daily Bank List | Daily 7 AM |
| closingprice.txt | Outgoing | Daily Closing Prices | [R2] |

### 3.2 New Issuance/Reopening File (secmast.txt)

#### Purpose
MEPS+ sends security details following creation of new issuance or re-opening. OMEGA validates against Announcement module data.

#### Securities Involved
CMTB, MAS Bills, SGS Bonds, SSB, T-Bills

#### Processing
- OMEGA polls MEFT every 5 minutes
- Processes records in 'Pending MEPS+' or 'MEPS+ Validation error' status
- Records without matching announcement are ignored

#### Field Specification (33 fields)

| # | Field | Type(Length) | Position | Description | Remarks |
|---|-------|--------------|----------|-------------|---------|
| 1 | ISSUE_CODE | X(8) | 1 | Issue code | e.g., NX00100H |
| 2 | ISSUE_NO | 9(2) | 9 | Issue number | 01=new, 02-99=re-opening |
| 3 | ISSUE_TYPE | X(1) | 11 | Issue type | Always space |
| 4 | CURR | X(3) | 12 | Currency | Always 'SGD' |
| 5 | ISSUE_DESC | X(30) | 15 | Issue description | ISIN description |
| 6 | ISSUE_DATE | 9(8) | 45 | Issue date | YYYYMMDD |
| 7 | TENDER_DATE | 9(8) | 53 | Tender date | YYYYMMDD |
| 8 | QTY_OFFERED | 9(13) | 61 | Issue size | Nominal amount offered |
| 9 | QTY_APPLIED | 9(13) | 74 | Applied amount | Zeros until secupdt |
| 10 | AVE_YIELD | 9(3)v9(2) | 87 | Average yield | Zeros until secupdt |
| 11 | CUT_OFF_YIELD | 9(3)v9(2) | 92 | Cutoff yield | Zeros until secupdt |
| 12 | MATURITY_DATE | 9(8) | 97 | Maturity date | YYYYMMDD |
| 13 | PERCENT_COY | 9(3)v9(2) | 105 | Competitive % at cutoff | Zeros until secupdt |
| 14 | PERCENT_SUB | 9(3)v9(2) | 110 | Subscription % | Zeros until secupdt |
| 15 | NC_PERCENT | 9(3)v9(2) | 115 | Non-competitive % | Zeros until secupdt |
| 16 | NC_QTY_ALLOT | 9(13) | 120 | NC amount allotted | Zeros until secupdt |
| 17 | INT_RATE | 9(3)v9(4) | 133 | Interest rate | 0 for new, coupon for reopening |
| 18 | TAX_STATUS | X(1) | 140 | Tax status | Y or N |
| 19 | CUT_OFF_YIELD_PRICE | 9(3)v9(4) | 141 | Cutoff price | Zeros until secupdt |
| 20 | AVE_YIELD_PRICE | 9(3)v9(4) | 148 | Average price | Zeros until secupdt |
| 21 | CLOSING_PRICE | 9(3)v9(4) | 155 | Closing price | Zeros until secupdt |
| 22 | ISIN_CODE | X(12) | 162 | ISIN code | 12-character ISIN |
| 23 | TENOR | 9(3) | 174 | Tenor | Years (Bonds/SSB) or Days (Bills) |
| 24 | ETENDER_IND | X(1) | 177 | E-tender indicator | Always 'Y' |
| 25 | MAS_APPLIED | 9(13) | 178 | MAS applied amount | |
| 26 | MAS_ALLOTTED | 9(13) | 191 | MAS allotted amount | Zeros until secupdt |

**Bond/SSB Only Fields (27-33):**
| # | Field | Type(Length) | Position | Description |
|---|-------|--------------|----------|-------------|
| 27 | INT_PAID_IND | X(1) | 204 | Interest paid indicator |
| 28 | LAST_INT_DATE | 9(8) | 205 | Last coupon payment date |
| 29 | NEXT_INT_DATE | 9(8) | 213 | Next coupon payment date |
| 30 | ACCRUED_INT_DAYS | 9(3) | 221 | Accrued interest days |
| 31 | INT_DATE1 | 9(4) | 224 | Coupon date 1 (MMDD) |
| 32 | INT_DATE2 | 9(4) | 228 | Coupon date 2 (MMDD) |
| 33 | EX_INT_DATE | 9(8) | 232 | Next ex-date |

### 3.3 Daily Securities Update File (secint.txt)

#### Purpose
MEPS+ provides daily update on coupon payment information for primary issuances (ISSUE_NO always 01).

#### Processing Schedule
- **Scheduled**: Daily at 7 AM, Mon-Fri excluding PHs
- **Ad-hoc**: Manually triggered

#### Field Specification
Same structure as secmast.txt with updates to:
- INT_PAID_IND, LAST_INT_DATE, NEXT_INT_DATE, EX_INT_DATE

### 3.4 Securities Update After Auction File (secupdt.txt)

#### Purpose
OMEGA sends securities updates after auction/allotment completion. Results must be verified by Auction Operator.

#### Time & Frequency
- **Auction**: At configurable [Auction results release time] on auction date
- **SSB**: At configurable [SSB results release time] on allotment date
- **Syndication**: Manual trigger after institutional results verified

#### Yield Encoding
| Original | Encoded |
|----------|---------|
| 123.45 | +12345 |
| 23.45 | +02345 |
| 0 | +00000 |
| -3.4 | -00340 |
| -123.45 | -12345 |

#### Key Fields Updated After Auction
- QTY_APPLIED: Total applied amount
- AVE_YIELD / CUT_OFF_YIELD: With +/- sign prefix
- PERCENT_COY / PERCENT_SUB / NC_PERCENT: Percentages
- NC_QTY_ALLOT: Non-competitive allocation
- INT_RATE: For new issuance
- CUT_OFF_YIELD_PRICE / AVE_YIELD_PRICE / CLOSING_PRICE
- MAS_ALLOTTED: MAS allotment

### 3.5 Auction Results File (auction.txt)

#### Purpose
OMEGA sends auction/syndication results consolidated by bank.

#### File Structure
```
[Security Info Line]
[Repetitive Auction Details - one per bank]
ENDTXN
[Next security batch...]
```

#### Field Specification

**Security Information Line:**
| Field | Type(Length) | Position | Description |
|-------|--------------|----------|-------------|
| ISIN_CODE | X(12) | 1 | ISIN code |
| ISSUE_CODE | X(8) | 14 | Issue code |
| ISSUE_DATE | 9(8) | 23 | YYYYMMDD |
| REC_NUM | 9(3) | 32 | Number of detail lines |

**Repetitive Auction Details (semicolon delimited):**
| Field | Type(Length) | Description |
|-------|--------------|-------------|
| MBR_CODE | X(8) | 8-char BIC or member code |
| BANK_CODE | 9(4) | 4-digit bank code |
| CUSTODY_CODE | X(3) | CUS, TRD, or RES |
| PRICE | 9(3)v9(5) | Cutoff price |
| NOMINAL_AMT | 9(13) | Nominal amount allotted |
| SETT_AMT | 9(13)v9(2) | Settlement amount |

**End Indicator:**
| Field | Type(Length) | Description |
|-------|--------------|-------------|
| END_TXN | X(6) | Always 'ENDTXN' |

### 3.6 SSB Step-up Coupon Rates File (couponrates_sbond.txt)

#### Purpose
MEPS+ sends SSB step-up coupon rates for validation against Announcement module.

#### Validation Rules
- Coupon rates (COUPON_RATE) must be identical for all COUPON_NUMBER entries sharing same YEAR_NUMBER
- Each YEAR_NUMBER rate must match announcement coupon rate for that year

#### File Structure
```
[Security Info Line]
[Repetitive Coupon Rate Records]
ENDREC
```

#### Field Specification

**Security Information:**
| Field | Type(Length) | Position | Description |
|-------|--------------|----------|-------------|
| ISIN_CODE | X(12) | 1 | SSB ISIN |
| ISSUE_CODE | X(8) | 14 | SSB issue code |
| FREQUENCY | X(1) | 23 | M/Q/S/Y/T |
| RECORD_NUMBER | 9(3) | 25 | Total coupon records |

**Repetitive Coupon Rate Record:**
| Field | Type(Length) | Position | Description |
|-------|--------------|----------|-------------|
| YEAR_NUMBER | 9(2) | 1 | Year number (01, 02, etc.) |
| COUPON_NUMBER | 9(2) | 4 | Coupon number of year |
| COUPON_PAYMENT_DATE | 9(8) | 7 | YYYYMMDD |
| COUPON_RATE | 9(3)v9(5) | 16 | Step-up coupon rate |

### 3.7 SSB Allotment Results File (auction_sbond.txt)

#### Purpose
OMEGA sends SSB allotment results consolidated by bank.

#### Structure
Same as auction.txt with:
- CUSTODY_CODE always 'CUS' for SSB
- END_TXN marks end of each allotment batch

### 3.8 SSB Partial Redemption File (rdmpartial_sbond.txt)

#### Purpose
OMEGA sends consolidated SSB redemption results per bank before redemption date.

#### Field Specification
| Field | Type(Length) | Position | Description |
|-------|--------------|----------|-------------|
| ISIN_CODE | X(12) | 1 | SSB ISIN |
| ISSUE_CODE | X(8) | 14 | SSB issue code |
| REDEMPTION_DATE | 9(8) | 23 | Future redemption date |
| MEMBER_CODE | X(8) | 32 | BIC or member code |
| BANK_CODE | 9(4) | 41 | 4-digit bank code |
| CUSTODY_CODE | X(3) | 46 | Always 'CUS' |
| NOMINAL_AMOUNT | 9(13) | 50 | Amount to redeem |
| CALL_PRICE | 9(3)v9(5) | 64 | Call price per lot |

### 3.9 Daily Bank List File (bank.txt)

#### Purpose
MEPS+ provides all active members for settlement bank validation during bid collation.

#### Validation Logic
- **Auto-debit eligible**: AUTODEBIT_INDICATOR = 'Y'
- **Custody codes by applicant type:**
  - PD: CUS, TRD, RES
  - Non-PD with PARTICIPANT_INDICATOR = 'Y': TRD, RES
  - Non-PD with PARTICIPANT_INDICATOR = 'N': RES only

#### Field Specification
| Field | Type(Length) | Position | Description |
|-------|--------------|----------|-------------|
| BANK_CODE | 9(4) | 1 | 4-digit bank code (e.g., 2500 for MAS) |
| BANK_NAME | X(40) | 5 | Member name |
| BANK_SHORTNAME | X(15) | 45 | 8-char member code (e.g., OCBCSGSG) |
| AUTODEBIT_INDICATOR | X(1) | 60 | Y or N |
| PARTICIPANT_INDICATOR | X(1) | 61 | Y (Participant/MAS) or N (Non-Participant) |

### 3.10 Daily Closing Prices File (closingprice.txt)
**[To be implemented in R2]**

---

## 4. FMBS Interface Files

### 4.1 File Summary

| File | Direction | Description | Frequency |
|------|-----------|-------------|-----------|
| secupdt_fmbs.txt | Outgoing | Securities Update after Auction | After auction |
| auction_fmbs.txt | Outgoing | MAS Auction Results | After auction |
| closingprice_fmbs.txt | Outgoing | Daily Closing Prices | [R2] |
| fmbs_erf.txt / fmbs_erf_agg_bids.csv | Outgoing | ERF Results | [R2] |

### 4.2 Securities Update File (secupdt_fmbs.txt)

#### Purpose
Same as secupdt.txt but **excludes SSB** (MAS does not participate in SSB allotment).

#### Securities Involved
CMTB, MAS Bills, SGS Bonds, T-Bills

#### Field Specification
Identical to secupdt.txt

### 4.3 Auction Results File (auction_fmbs.txt)

#### Purpose
OMEGA sends consolidated MAS auction/syndication results. File generated only if MAS is allotted bids.

#### Field Specification (semicolon delimited)
| Field | Type(Length) | Description |
|-------|--------------|-------------|
| ISIN_CODE | X(12) | ISIN code |
| ISSUE_CODE | X(8) | Issue code |
| ISSUE_DATE | X(8) | YYYYMMDD |
| REC_NUM | 9(3) | Always '001' |
| MBR_CODE | X(8) | Always 'MASGSGSG' |
| BANK_CODE | 9(4) | Always '2500' |
| CUSTODY_CODE | X(3) | Always 'TRD' |
| PRICE | 9(3)v9(9) | Modified clean price (3 + 9 decimals) |
| NOMINAL_AMT | 9(13) | MAS total nominal |
| SETT_AMT | 9(15)v9(2) | MAS settlement amount |

### 4.4 Daily Closing Prices File (closingprice_fmbs.txt)
**[To be implemented in R2]**

### 4.5 ERF Results Files (fmbs_erf.txt & fmbs_erf_agg_bids.csv)
**[To be implemented in R2]**

---

## 5. AGD Interface Files

### 5.1 File Summary

| Request Type | Static Data | Transaction Data | ERF Data |
|-------------|-------------|------------------|----------|
| Scheduled | IT030048.txt | IT040048.txt | IT050048.txt [R2] |
| Syndication/Ad-hoc | IT032048.txt | IT042048.txt | IT052048.txt [R2] |

**Direction**: All Outgoing (OMEGA → AGD)

**Encryption**: PGP required

### 5.2 Static Data File (IT030048.txt & IT032048.txt)

#### Purpose
Securities static data updates on scheduled basis or after syndication allotment.

#### Securities Involved
SGS Bonds, SSB, T-Bills

#### Schedule
- **IT030048.txt (Scheduled)**: Every Wednesday at 10:30 PM and last business day of month
  - If Wednesday is PH, shifted to next business day
  - Data range: Previous Thursday to current Wednesday
- **IT032048.txt (Syndication)**: Manual trigger after institutional results verified
- **IT032048.txt (Ad-hoc)**: Manual trigger with configurable date range

#### Filter Date Definition
| Security Type | Filter Date |
|--------------|-------------|
| SGS Bonds (non-syndication) | Auction date |
| SGS Bonds (syndication) | Syndication allotment date |
| T-Bills | Auction date |
| SSB | Issue date |

#### File Structure
```
999 Header Record
000 Data Record 1
000 Data Record 2
...
TRL Trailer Record
```

#### Header Record
| Field | Type(Length) | Position | Description |
|-------|--------------|----------|-------------|
| ROW_IDENTIFIER | X(3) | 1 | Always '999' |
| TRANSACTION_ID | X(15) | 4 | 'GTSD' + spaces |
| FILLER | X(4) | 19 | Spaces |
| FILE_ORIGIN | X(16) | 23 | 'MAS' + spaces |
| FILLER | X(20) | 39 | Spaces |
| CREATION_DATETIME | X(26) | 59 | MM/DD/YYYY HH:MM:SS + spaces |

#### T-Bills Data Record
| Field | Type(Length) | Position | Description |
|-------|--------------|----------|-------------|
| ROW_IDENTIFIER | X(3) | 1 | Always '000' |
| SD_TYPE | X(5) | 4 | 'TBILL' |
| ISIN_CODE | X(30) | 9 | ISIN + spaces |
| DESCRIPTION | X(50) | 39 | Security description |
| ISSUANCE_DATE | 9(8) | 89 | YYYYMMDD |
| MATURITY_DATE | 9(8) | 97 | YYYYMMDD |
| NOMINAL_VALUE | 9(13).9(4) | 105 | Issue size (18 chars) |
| DISCOUNT_PREMIUM | S9(13).9(4) | 123 | Always negative (19 chars) |

#### SGS Bonds Data Record (New Issuance Only)
| Field | Type(Length) | Position | Description |
|-------|--------------|----------|-------------|
| ROW_IDENTIFIER | X(3) | 1 | Always '000' |
| SD_TYPE | X(5) | 4 | 'SGS' + spaces |
| ISIN_CODE | X(30) | 9 | ISIN + spaces |
| DESCRIPTION | X(70) | 39 | Security description |
| ISSUANCE_DATE | 9(8) | 109 | YYYYMMDD |
| MATURITY_DATE | 9(8) | 117 | YYYYMMDD |
| NOMINAL_VALUE | 9(13).9(4) | 125 | Issue size (18 chars) |
| DISCOUNT_PREMIUM | S9(13).9(4) | 143 | +ve premium or -ve discount |
| COUPON_RATE | 9(3).9(4) | 162 | Coupon rate (8 chars) |
| FIRST_COUPON_DATE | 9(8) | 170 | YYYYMMDD |
| SECOND_COUPON_DATE | 9(8) | 178 | YYYYMMDD |

**Note**: SGS re-openings do not generate static data records.

#### SSB Data Record
| Field | Type(Length) | Position | Description |
|-------|--------------|----------|-------------|
| ROW_IDENTIFIER | X(3) | 1 | Always '000' |
| SD_TYPE | X(5) | 4 | 'SB' + spaces |
| ISIN_CODE | X(30) | 9 | ISIN + spaces |
| DESCRIPTION | X(70) | 39 | Security description |
| ISSUANCE_DATE | 9(8) | 109 | YYYYMMDD |
| MATURITY_DATE | 9(8) | 117 | YYYYMMDD |
| NOMINAL_VALUE | 9(13).9(4) | 125 | Amount allotted (18 chars) |
| DISCOUNT_PREMIUM | S9(13).9(4) | 143 | Always +0000000000000.0000 |
| COUPON_RATE | 9(3).9(4) | 162 | 1st coupon rate (8 chars) |
| FIRST_COUPON_DATE | 9(8) | 170 | YYYYMMDD |
| SECOND_COUPON_DATE | 9(8) | 178 | YYYYMMDD |

#### Trailer Record
| Field | Type(Length) | Position | Description |
|-------|--------------|----------|-------------|
| ROW_IDENTIFIER | X(3) | 1 | Always 'TRL' |
| TRANSACTION_ID | X(15) | 4 | 'GTSD' + spaces |
| TOTAL_FEED_LINE | 9(9) | 19 | Total records including header/trailer |

### 5.3 Transaction Data File (IT040048.txt & IT042048.txt)

#### Purpose
Securities transaction data updates for lifecycle events.

#### Transaction Types
| Code | Description | Applicable Securities |
|------|-------------|----------------------|
| ISS | New issuance | T-Bills, SGS Bonds, SSB |
| MAT | Maturity | T-Bills, SGS Bonds, SSB |
| REO | Re-opening | T-Bills, SGS Bonds |
| CPN | Coupon payment | SGS Bonds, SSB |
| RED | Early redemption | SSB only |

#### Schedule
Same as Static Data files with TRANSACTION_DATE-based extraction.

#### TRANSACTION_DATE Definition
| Transaction Type | Transaction Date |
|-----------------|------------------|
| ISS | Auction date / Syndication allotment date / Issue date (SSB) |
| MAT | Maturity date |
| REO | Auction date / Syndication allotment date |
| CPN | Last coupon payment date / Next coupon payment date (SSB) |
| RED | Early redemption date |

#### Header Record
| Field | Type(Length) | Position | Description |
|-------|--------------|----------|-------------|
| ROW_IDENTIFIER | X(3) | 1 | Always '999' |
| TRANSACTION_ID | X(15) | 4 | 'GTTD' + spaces |
| FILLER | X(4) | 19 | Spaces |
| FILE_ORIGIN | X(16) | 23 | 'MAS' + spaces |
| FILLER | X(20) | 39 | Spaces |
| CREATION_DATETIME | X(26) | 59 | MM/DD/YYYY HH:MM:SS + spaces |

#### T-Bills and SGS Bonds Transaction Record
| Field | Type(Length) | Position | Description |
|-------|--------------|----------|-------------|
| ROW_IDENTIFIER | X(3) | 1 | Always '000' |
| TRANSACTION_TYPE | X(3) | 4 | ISS, MAT, REO, or CPN |
| ISIN_CODE | X(30) | 7 | ISIN + spaces |
| TRANSACTION_NUMBER | 9(10) | 37 | YYMMDD + 4-digit sequence |
| TRANSACTION_DATE | 9(8) | 47 | YYYYMMDD |
| INTEREST_PAID | 9(13).9(4) | 55 | See calculation rules |
| ACCRUED_INTEREST | S9(13).9(4) | 73 | See calculation rules |
| NOMINAL_AMOUNT | 9(13).9(4) | 92 | Issue size (sum if reopened) |
| DISCOUNT_PREMIUM | S9(13).9(4) | 110 | See calculation rules |

#### Interest Calculation Rules (T-Bills/SGS)
| Type | INTEREST_PAID | ACCRUED_INTEREST | DISCOUNT_PREMIUM |
|------|---------------|------------------|------------------|
| ISS | 0 | 0 | Settlement - Issue size |
| MAT (T-Bills) | 0 | 0 | 0 |
| MAT (SGS) | (Coupon/2) × Nominal | 0 | 0 |
| REO | 0 | Sum of accrued | Settlement - Issue size |
| CPN | (Coupon/2) × Nominal | 0 | 0 |

#### SSB Transaction Record
| Field | Type(Length) | Position | Description |
|-------|--------------|----------|-------------|
| ROW_IDENTIFIER | X(3) | 1 | Always '000' |
| TRANSACTION_TYPE | X(3) | 4 | ISS, MAT, RED, or CPN |
| ISIN_CODE | X(30) | 7 | ISIN + spaces |
| TRANSACTION_NUMBER | 9(10) | 37 | YYMMDD + 4-digit sequence |
| TRANSACTION_DATE | 9(8) | 47 | YYYYMMDD |
| INTEREST_PAID | 9(13).9(4) | 55 | See calculation rules |
| ACCRUED_INTEREST | S9(13).9(4) | 73 | Always 0 |
| NOMINAL_AMOUNT | 9(13).9(4) | 92 | See calculation rules |
| DISCOUNT_PREMIUM | S9(13).9(4) | 110 | Always 0 |
| COUPON_RATE | 9(3).9(4) | 129 | Prevailing coupon rate |

#### SSB Interest/Nominal Calculation Rules
| Type | INTEREST_PAID | NOMINAL_AMOUNT |
|------|---------------|----------------|
| ISS | 0 | Total allotted |
| MAT | (Coupon/2) × Outstanding | Outstanding amount |
| RED | ((Coupon/2) × Nominal) × (DCS/E) | Redemption amount |
| CPN (regular) | (Coupon/2) × Outstanding | Outstanding amount |
| CPN (irregular 1st) | ((Coupon/2) × Nominal) × (DCS/E) | Outstanding amount |

Where:
- DCS = Issue date - Settlement date
- E = Days in assumed coupon period
- Outstanding = Allotted - Redeemed

#### Trailer Record
| Field | Type(Length) | Position | Description |
|-------|--------------|----------|-------------|
| ROW_IDENTIFIER | X(3) | 1 | Always 'TRL' |
| TRANSACTION_ID | X(15) | 4 | 'GTTD' + spaces |
| TOTAL_FEED_LINE | 9(9) | 19 | Total records including header/trailer |

### 5.4 ERF Data File (IT050048.txt & IT052048.txt)
**[To be implemented in R2]**

---

## 6. Key Differences: OMEGA vs eApps (Legacy)

| Aspect | eApps (Legacy) | OMEGA (New) |
|--------|---------------|-------------|
| System Name | eApps | OMEGA |
| Architecture | Legacy system | Modern gateway |
| Validation | Basic file validation | Status-driven processing |
| Announcement | Separate system | Integrated module |
| Processing | Batch-oriented | Poll-based (5-min intervals) |
| Syndication | Limited support | Full syndication workflow |
| Configurable Times | Fixed schedules | Configurable parameters |
| Status Management | Manual tracking | Automated status flow |

---

## 7. Configurable System Parameters

| Parameter | Description | Used By |
|-----------|-------------|---------|
| [Auction results release time] | Publication time for auction results | secupdt.txt, auction.txt |
| [SSB results release time] | Publication time for SSB allotment | auction_sbond.txt, rdmpartial_sbond.txt |
| [Syndication retail results release time] | Release time for retail results | secupdt.txt, auction.txt |
| [Start Date] / [End Date] | Ad-hoc extraction range | AGD files |

---

## 8. Status Flow for Announcements

```
Pending MEPS+ → MEPS+ Validation error (if validation fails)
                ↓
           MEPS+ Validated
                ↓
           Pending Publication
                ↓
             Published
```

---

## 9. Validation Summary

### Common Validations
- Date fields: Valid YYYYMMDD format
- Numeric fields: Must contain only digits
- ISIN codes: 12 characters, must match OMEGA records
- Issue codes: 8 characters
- Signed yields: Must have +/- prefix

### OMEGA-Specific Validations
- Status-driven processing for incoming files
- Matching against existing announcement records
- Verification by operators before file release
- Configurable time-based scheduled processing

---

## 10. Release Notes

### Version 0.02 (31 Dec 2025)
- Updated section headers with filenames
- Refined Description and Time & Frequency sections

### Version 0.01 (24 Dec 2025)
- Initial draft

### Features Planned for R2
- closingprice.txt (MEPS+)
- closingprice_fmbs.txt (FMBS)
- fmbs_erf.txt & fmbs_erf_agg_bids.csv (FMBS)
- IT050048.txt & IT052048.txt (AGD)
