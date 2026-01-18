# OMEGA FIs and CDP Interface Specification

> **Document Type:** Interface Specification
> **Source File:** MAS_OMEGA - Interface Functional Specifications Document (FIs and CDP)_v0.02.docx
> **System:** OMEGA (Open Market Execution Gateway) - New System
> **Target Systems:** FIs (DBS, OCBC, UOB), CDP
> **Version:** 0.02

---

## 1. Overview

### 1.1 Purpose
OMEGA interfaces with Financial Institutions (FIs) and Central Depository Pte Limited (CDP) for retail securities issuance lifecycle, including subscription, allotment, redemption, and holdings management.

### 1.2 Scope
This specification covers:
- Issuance calendar distribution
- SSB subscription, redemption, allotment, holdings
- SGS Bonds/T-Bills retail subscription and results
- Institutional auction results

### 1.3 Interfacing Systems
| System | Type | Acronym (for filenames) |
|--------|------|------------------------|
| Central Depository (Pte) Limited | CDP | cdp |
| DBS Bank Ltd | Retail Bank | dbs |
| Oversea-Chinese Banking Corporation Ltd | Retail Bank | ocbc |
| United Overseas Bank Ltd | Retail Bank | uob |

### 1.4 Application Types
| Code | Description | Securities |
|------|-------------|------------|
| AP1 | CASH | SSB, SGS Bonds, T-Bills |
| AP2 | CPFIS | SGS Bonds, T-Bills only |
| AP3 | SRS | SSB, SGS Bonds, T-Bills |

### 1.5 Interface Direction Convention
- **Incoming**: Files received by OMEGA
- **Outgoing**: Files sent by OMEGA

---

## 2. Technical Requirements

### 2.1 Communication Channel
- **Protocol**: MEFT (MAS Enterprise File Transfer) via SFTP
- **Routing**: MEFT prepends routing prefix during transit, auto-removed before delivery

### 2.2 Data Format (.txt files)
- **Format**: Fixed-width text
- **Structure**: Header → Detail Header (if applicable) → Detail Records → Control

### 2.3 Record Types
| Type | RECORD_TYPE | Description |
|------|-------------|-------------|
| Header | HHHHHHHHHH | First line of file |
| Detail Header | BBBBBBBBBB | Security context (subscription/results files) |
| Detail | DDDDDDDDDD | Data records |
| Control | TTTTTTTTTT | Last line of file |

### 2.4 Data Type Notation

| Symbol | Meaning | Example |
|--------|---------|---------|
| X(n) | n-char alphanumeric | X(8) = 8 chars |
| 9(n) | n-digit numeric | 9(10) = 10 digits |
| 9(n)v9(m) | Implicit decimal | 9(3)v9(2) = 123.45 stored as 12345 |

### 2.5 Padding Rules
| Field Type | Alignment | Padding |
|-----------|-----------|---------|
| Numeric (9) | Right-aligned | Leading zeros |
| Alphanumeric (X) | Left-aligned | Trailing spaces |

**Data Normalization**: OMEGA trims all leading/trailing spaces from incoming alphanumeric fields.

### 2.6 Data Integrity (Checksum)
- **Record-level**: Sum of all numeric fields in each detail record
- **File-level**: Sum of all record checksums in Control Record
- **Overflow**: If sum > 99,999,999,999,999, use last 14 digits

### 2.7 Encryption
- **Method**: PGP encryption
- **Extension**: Append `.pgp` to filename (e.g., `sb_dbs_ap1.txt.pgp`)
- **Process**: Source encrypts with Destination's public key; Destination decrypts with private key

---

## 3. Institutional Auction Results Format (.csv)

### 3.1 File Structure
- Standard CSV format with comma delimiters
- First line contains field names
- Values with commas enclosed in double quotes
- Literal double quotes represented as ""

### 3.2 Data Type Notation for CSV
| Symbol | Meaning | Example |
|--------|---------|---------|
| X(n) | Max n chars | X(8) = up to 8 chars |
| 9(n).9(m) | Explicit decimal | 9(3).9(2) = 123.45 |
| S9(n).9(m) | Signed decimal | -123.45 or 123.45 |

---

## 4. SSB Interface Files

### 4.1 File Summary

| File Type | Filename Pattern | Direction | Source | Destination |
|-----------|-----------------|-----------|--------|-------------|
| Issuance Calendar | sb_[acronym]_cal.txt | Outgoing | OMEGA | Retail Banks, CDP |
| Subscription (CASH) | sb_[acronym]_ap1.txt | Incoming | Retail Banks | OMEGA |
| Subscription (SRS) | sb_[acronym]_ap3.txt | Incoming | Retail Banks | OMEGA |
| Redemption (CASH) | sb_[acronym]_re1.txt | Incoming | CDP | OMEGA |
| Redemption (SRS) | sb_[acronym]_re3.txt | Incoming | Retail Banks | OMEGA |
| Ack - Sub (CASH) | sb_[acronym]_aa1.txt | Outgoing | OMEGA | Retail Banks |
| Ack - Sub (SRS) | sb_[acronym]_aa3.txt | Outgoing | OMEGA | Retail Banks |
| Ack - Redeem (CASH) | sb_[acronym]_ar1.txt | Outgoing | OMEGA | CDP |
| Ack - Redeem (SRS) | sb_[acronym]_ar3.txt | Outgoing | OMEGA | Retail Banks |
| Allotment (CASH) | sb_[acronym]_ra1.txt | Outgoing | OMEGA | Retail Banks, CDP |
| Allotment (SRS) | sb_[acronym]_ra3.txt | Outgoing | OMEGA | Retail Banks, CDP |
| Redemption Results (CASH) | sb_[acronym]_rr1.txt | Outgoing | OMEGA | Retail Banks, CDP |
| Redemption Results (SRS) | sb_[acronym]_rr3.txt | Outgoing | OMEGA | Retail Banks, CDP |
| Holdings (CASH) | sb_[acronym]_hol1.txt | Incoming | CDP | OMEGA |
| Holdings (SRS) | sb_[acronym]_hol3.txt | Incoming | Retail Banks | OMEGA |
| Ack - Holdings (CASH) | sb_[acronym]_ah1.txt | Outgoing | OMEGA | CDP |
| Ack - Holdings (SRS) | sb_[acronym]_ah3.txt | Outgoing | OMEGA | Retail Banks |
| Coupon/Redemption Rate | sb_[acronym]_cpn.txt | Outgoing | OMEGA | Retail Banks, CDP |

### 4.2 Issuance Calendar File

#### Purpose
OMEGA provides issuance calendar details for upcoming SSB, SGS Bonds, and T-Bills with retail participation.

#### File Names by Security Type
| Security | Filename |
|----------|----------|
| SSB | sb_[acronym]_cal.txt |
| SGS Bonds | sg_[acronym]_cal.txt |
| T-Bills | tb_[acronym]_cal.txt |

#### Generation Rules
- Generated when at least one record is updated/created
- Only records with complete data (no TBA values) included
- Destinations must implement full replacement logic per calendar year

#### Key Fields
| Field | Type | Description |
|-------|------|-------------|
| ISSUE_IND | X(1) | S=SSB, T=T-Bills, B=SGS Bonds |
| ISSUE_CODE | X(8) | Issue code (e.g., GX15080H) |
| ISIN_CODE | X(12) | 12-char ISIN |
| TENOR | 9(3) | Days (T-Bills) or Years (SSB/SGS) |
| TENOR_MEASURE | X(1) | D=Days, Y=Years |
| NEW_REOPEN_IND | X(1) | N=New, R=Reopen |
| ANNOUNCE_DATE | 9(8) | Announcement date (YYYYMMDD) |
| ANNOUNCE_TIME | 9(4) | Announcement time (HHMM) |
| AUCTION_DATE | 9(8) | Auction/Allotment date |
| AUCTION_TIME | 9(4) | Cutoff time |
| ISSUE_DATE | 9(8) | Issue date |
| MATURITY_DATE | 9(8) | Maturity date |
| ISSUANCE_METHOD | X(1) | A=Auction/Allotment, S=Syndication |
| PRICE | 9(3)v9(4) | Syndication price (zeros if auction) |
| YIELD_SIGN | X(1) | +/- for syndication yield |
| YIELD | 9(3)v9(2) | Syndication yield |

### 4.3 SSB Subscription File

#### Processing Schedule
- **Scheduled**: Daily at 9 AM, Mon-Fri excluding PHs (during subscription window)
- **Ad-hoc**: Manually triggered

#### File Structure
```
HHHHHHHHHH Header Record
BBBBBBBBBB Detail Header (Security Context)
DDDDDDDDDD Detail Record 1
DDDDDDDDDD Detail Record 2
...
TTTTTTTTTT Control Record
```

#### Header Fields
| Field | Type | Position | Description |
|-------|------|----------|-------------|
| RECORD_TYPE | X(10) | 1 | HHHHHHHHHH |
| FILE_TYPE | X(3) | 11 | AP1 (CASH) or AP3 (SRS) |
| PRI_DLR_CODE | 9(4) | 14 | 4-digit bank code |
| BANK_NAME | X(20) | 18 | Bank name |
| PROCESSING_DATE | 9(8) | 38 | YYYYMMDD |

#### Detail Header Fields
| Field | Type | Position | Description |
|-------|------|----------|-------------|
| RECORD_TYPE | X(10) | 1 | BBBBBBBBBB |
| ISSUE_CODE | X(8) | 11 | SSB issue code |
| ISIN_CODE | X(12) | 19 | ISIN code |
| TENDER_DATE | 9(8) | 31 | Allotment date |
| CURR | X(3) | 39 | SGD |
| ISSUE_DESC | X(30) | 42 | Description |

#### Key Detail Fields
| Field | Type | Position | Description |
|-------|------|----------|-------------|
| TRANS_REF | X(8) | 19 | Bank transaction reference |
| RECEIVED_DATE | 9(8) | 27 | Date received from customer |
| RECEIVED_TIME | 9(6) | 35 | Time received (HHMMSS) |
| TRANS_TYPE | X(3) | 41 | Always 'TE_' |
| NOMINAL_AMT | 9(11) | 44 | Subscription amount |
| NAME_OF_APPLN | X(100) | 62 | Applicant name |
| NATIONALITY | X(1) | 162 | S=Citizen, P=PR, F=Foreigner |
| NATIONALITY_COUNTRY | X(2) | 163 | ISO country code |
| IC_PASSPORT | X(14) | 165 | NRIC/FIN/Passport |
| CUST_BANK_CODE | 9(4) | 179 | Settlement bank |
| CDP_ACCT_NO | X(16) | 188 | CDP account |
| SUB_METHOD | X(1) | 204 | A=ATM, B=iBanking, C=Mobile |
| CPFIS_SRS_ACCT_NO | X(16) | 205 | SRS account (SRS only) |
| CHECKSUM | 9(14) | 241 | Record checksum |

### 4.4 SSB Redemption File

#### Processing Schedule
- **Scheduled**: Daily at 8:30 AM, Mon-Fri excluding PHs
- **Note**: CDP provides consolidated CASH redemptions; Banks provide SRS redemptions

### 4.5 SSB Acknowledgement File

#### Purpose
Indicates file and record processing status (Pass/Fail) with error descriptions.

#### Key Fields
| Field | Type | Description |
|-------|------|-------------|
| FILE_STATUS | X(1) | P=Pass, F=Fail |
| FILE_ERROR_DESC | X(20) | File-level error |
| REC_STATUS | X(1) | P=Pass, F=Fail |
| REC_ERROR_DESC | X(20) | Record-level error |

**Note**: Redemption acknowledgement to CDP contains only failed records.

### 4.6 SSB Allotment Results File

#### Processing Schedule
- **Scheduled**: At configurable [SSB results release time] on allotment date
- CDP receives consolidated file; Banks receive individual files

#### Key Fields
| Field | Type | Description |
|-------|------|-------------|
| CUTOFF_PRICE | 9(3)v9(4) | Always 1000000 (=100) for SSB |
| PROCESSED_AMT | 9(11) | Successfully allotted amount |
| SETTLEMENT_AMT | 9(13)v9(2) | Same as processed amount for SSB |
| REC_STATUS | X(1) | P=Full, F=Zero, I=Partial allotment |
| REC_ERROR_DESC | X(20) | "Limit exceeded" or "Oversubscription" |

### 4.7 SSB Redemption Results File

#### Processing Schedule
- **Scheduled**: At [SSB results release time] on allotment date (simultaneous with allotment)

### 4.8 SSB Holdings File

#### Purpose
CDP (CASH) and Retail Banks (SRS) submit daily SSB holdings information.

#### Processing Schedule
- **Scheduled**: Daily at 7 AM, Mon-Fri excluding PHs

### 4.9 SSB Coupon/Redemption Rate File

#### Purpose
Monthly coupon and redemption rate data for all active SSB issues.

#### Processing Schedule
- **Scheduled**: 7 AM, 1 business day after SSB announcement date

#### Retrieval Criteria
- Include active SSB where issue date < early redemption date and maturity date >= coupon payment date
- Exclude SSB where early redemption date = issue date
- Sort by issue code ascending

---

## 5. SGS Bonds/T-Bills Interface Files

### 5.1 File Summary

| File Type | Filename Pattern | Direction | Source | Destination |
|-----------|-----------------|-----------|--------|-------------|
| Issuance Calendar (SGS) | sg_[acronym]_cal.txt | Outgoing | OMEGA | Retail Banks, CDP |
| Issuance Calendar (T-Bills) | tb_[acronym]_cal.txt | Outgoing | OMEGA | Retail Banks, CDP |
| Subscription (CASH) | ea_[acronym]_ap1.txt | Incoming | Retail Banks | OMEGA |
| Subscription (CPFIS) | ea_[acronym]_ap2.txt | Incoming | Retail Banks | OMEGA |
| Subscription (SRS) | ea_[acronym]_ap3.txt | Incoming | Retail Banks | OMEGA |
| Ack - Sub (CASH) | ea_[acronym]_aa1.txt | Outgoing | OMEGA | Retail Banks |
| Ack - Sub (CPFIS) | ea_[acronym]_aa2.txt | Outgoing | OMEGA | Retail Banks |
| Ack - Sub (SRS) | ea_[acronym]_aa3.txt | Outgoing | OMEGA | Retail Banks |
| Auction Results (CASH) | ea_[acronym]_ra1.txt | Outgoing | OMEGA | Retail Banks |
| Auction Results (CPFIS) | ea_[acronym]_ra2.txt | Outgoing | OMEGA | Retail Banks |
| Auction Results (SRS) | ea_[acronym]_ra3.txt | Outgoing | OMEGA | Retail Banks |
| Syndication Results (CASH) | es_[acronym]_ra1.txt | Outgoing | OMEGA | Retail Banks |
| Syndication Results (CPFIS) | es_[acronym]_ra2.txt | Outgoing | OMEGA | Retail Banks |
| Syndication Results (SRS) | es_[acronym]_ra3.txt | Outgoing | OMEGA | Retail Banks |

### 5.2 SGS/T-Bills Subscription File

#### Processing Schedule
- **Scheduled**: Daily at 8 AM, Mon-Fri excluding PHs

#### Key Differences from SSB
| Field | SSB | SGS/T-Bills |
|-------|-----|-------------|
| COMP_NOCOMP | Unused (space) | C=Competitive, N=Non-competitive |
| BID_YIELD_SIGN | Unused (space) | + or - |
| BID_YIELD | Unused (zeros) | Yield value |
| NAME_OF_APPLN | X(100) | X(30) |
| CPFIS_SRS_ACCT_NO | CPFIS not applicable | OA/SA prefix for CPFIS |

#### CPFIS Account Prefix
- **OA**: CPF Ordinary Account → stored as CPFIS-OA
- **SA**: CPF Special Account → stored as CPFIS-SA
- **No prefix**: Default to CPFIS-OA

### 5.3 SGS/T-Bills Results File

#### Processing Schedule
- **Auction**: At [Auction results release time] on auction date
- **Syndication**: At [Syndication retail results release time] on allotment date

#### Key Fields
| Field | Type | Description |
|-------|------|-------------|
| CUTOFF_YIELD_SIGN | X(1) | + or - |
| CUTOFF_YIELD | 9(3)v9(2) | Cutoff yield |
| CUTOFF_PRICE | 9(3)v9(4) | Cutoff price |
| ALLOTTED_AMT | 9(11) | Successfully allotted |
| SETTLEMENT_AMT | 9(13)v9(2) | = (Allotted / 100) × Price |

#### SUB_METHOD Values
| Code | Description |
|------|-------------|
| A | ATM via interface files |
| B | iBanking via interface files |
| C | Mobile app via interface files |
| E | Electronic via OMEGA web app |
| M | Contingency via ASP/ORCA |

**Note**: Subscriptions processed via ORCA retain original A/B/C codes.

---

## 6. Institutional Auction Results File

### 6.1 Overview

| Property | Value |
|----------|-------|
| Filename | ins_ea_[bank_code]_ra1.csv |
| Format | CSV |
| Direction | Outgoing |
| Destination | Primary Dealers (PDs) |
| Application Type | CASH only |

### 6.2 Securities Involved
- SGS Bonds (auction & mini-auction)
- T-Bills
- CMTBs
- MAS-Bills

### 6.3 Processing Schedule
- **Scheduled**: At [Auction results release time] on auction date

### 6.4 Primary Dealer Bank Codes

| Institution | Bank Code |
|-------------|-----------|
| Australia & New Zealand Banking Group Ltd | 7931 |
| Bank of America, National Association | 7065 |
| Barclays Bank PLC | 7533 |
| BNP Paribas SA | 7418 |
| Citibank, NA | 7214 |
| DBS Bank Ltd | 7171 |
| Deutsche Bank AG | 7463 |
| Hongkong and Shanghai Banking Corporation Ltd | 7232 |
| Malayan Banking Bhd | 9636 |
| Oversea-Chinese Banking Corporation Ltd | 7339 |
| Standard Chartered Bank (Singapore) Limited | 9496 |
| United Overseas Bank Ltd | 7375 |

### 6.5 CSV Field Specification

| Field | Type | Description |
|-------|------|-------------|
| PD Code | 9(4) | 4-digit PD bank code |
| PD Name | X(50) | PD name |
| Issue Code | X(8) | Issue code |
| ISIN Code | X(12) | ISIN code |
| Auction Date | X(10) | dd-mm-yyyy |
| Issue Date | X(10) | dd-mm-yyyy |
| Maturity Date | X(10) | dd-mm-yyyy |
| Cut-off Yield (%) | S9(3).9(2) | 2 decimal places |
| Cut-off Price | 9(3).9(3) | 3 decimal places |
| Applicant Name | X(50) | Financial institution name |
| Bank Reference No | X(8) | Unique per issue/PD |
| Amount Applied | 9(13) | Positive integer |
| Competitive (Yes/No) | X(3) | Yes or No |
| Bid Yield | S9(3).9(2) | 2 decimal places |
| Amount Accepted | 9(13) | Positive integer or 0 |
| Amount Allotted | 9(13) | Positive integer or 0 |
| Discount/Premium Amount | S9(13).9(2) | 2 decimal places |
| Settlement Amount | 9(13).9(2) | 2 decimal places |
| Accrued Interest | S9(13).9(2) | 0.00 for new issuance |
| Settlement Bank Code | 9(4) | 4-digit bank code |
| Custody Code | X(3) | CUS, TRD, or RES |
| Applicant Type | X(3) | From OMEGA dropdown |
| Remarks | X(20) | "Underbidding" or empty |

---

## 7. Error Codes

### 7.1 File-Level Errors (FILE_ERROR_DESC)

| Error Description | Invalid Field |
|-------------------|---------------|
| Decryption error | N/A (non-ASCII characters) |
| Invalid file format | RECORD_TYPE or N/A |
| Invalid file type | FILE_TYPE |
| Invalid pri dlr code | PRI_DLR_CODE |
| Invalid proc date | PROCESSING_DATE |
| Invalid issue code | ISSUE_CODE |
| Invalid ISIN code | ISIN_CODE |
| Invalid tender date | TENDER_DATE |
| Invalid currency | CURR |
| Invalid rec count | RECORD_COUNT |
| Invalid total chksum | OVERALL_CHECKSUM |

### 7.2 Record-Level Errors (REC_ERROR_DESC for Acknowledgement)

| Error Description | Invalid Field |
|-------------------|---------------|
| Invalid issue code | ISSUE_CODE |
| Invalid ISIN code | ISIN_CODE |
| Invalid tender date | TENDER_DATE |
| Invalid nominal amt | NOMINAL_AMT |
| Invalid holding amt | HOLDING_AMT |
| Invalid NRIC | IC_PASSPORT |
| Invalid passport | IC_PASSPORT |
| Invalid sub method | SUB_METHOD |
| Invalid bank ref no | TRANS_REF (empty) |
| Duplicate record | TRANS_REF (duplicated) |
| Invalid recvd date | RECEIVED_DATE |
| Invalid recvd time | RECEIVED_TIME |
| Invalid trans type | TRANS_TYPE |
| Invalid nationality | NATIONALITY |
| Invalid bank code | CUST_BANK_CODE |
| Invalid cust ind | CUST_BANK_BC |
| Invalid appl type | TYPE_OF_APPLN |
| Invalid comp nocomp | COMP_NOCOMP |
| Invalid bid sign | BID_YIELD_SIGN |
| Invalid bid yield | BID_YIELD |
| Invalid appl name | NAME_OF_APPLN |
| Invalid SRS acct no | CPFIS_SRS_ACCT_NO |
| Invalid CPF acct no | CPFIS_SRS_ACCT_NO |
| Invalid rec chksum | CHECKSUM |

### 7.3 SSB Allotment Errors (REC_ERROR_DESC)

| Error Description | Meaning |
|-------------------|---------|
| Limit exceeded | Individual limit exceeded |
| Oversubscription | Issue oversubscribed |

---

## 8. Configurable System Parameters

| Parameter | Used By |
|-----------|---------|
| [Auction time] | Issuance Calendar AUCTION_TIME |
| [SSB allotment time] | Issuance Calendar AUCTION_TIME |
| [Syndication retail allotment time] | Issuance Calendar AUCTION_TIME |
| [Minimum denomination] | Subscription validation |
| [SSB results release time] | Allotment/Redemption results |
| [Auction results release time] | Auction results |
| [Syndication retail results release time] | Syndication results |

---

## 9. Processing Schedules Summary

| File Type | Schedule | Time |
|-----------|----------|------|
| SSB Subscription | Daily (subscription window) | 9:00 AM |
| SSB Redemption | Daily (redemption window) | 8:30 AM |
| SSB Holdings | Daily | 7:00 AM |
| SSB Coupon/Rate | Monthly (announcement+1 BD) | 7:00 AM |
| SSB Allotment Results | Monthly (allotment date) | [SSB results release time] |
| SSB Redemption Results | Monthly (allotment date) | [SSB results release time] |
| SGS/T-Bills Subscription | Daily (subscription window) | 8:00 AM |
| SGS/T-Bills Auction Results | Auction date | [Auction results release time] |
| SGS/T-Bills Syndication Results | Allotment date | [Syndication retail results release time] |
| Institutional Auction Results | Auction date | [Auction results release time] |
| Acknowledgement Files | Event-driven | After processing |
| Issuance Calendar | Event-driven | After update |

---

## 10. Key Differences: OMEGA vs eApps (Legacy)

| Aspect | eApps (Legacy) | OMEGA (New) |
|--------|---------------|-------------|
| Institutional Results | .txt format | .csv format |
| CDP Redemption Ack | All records | Failed records only |
| CPFIS Support | Limited | Full (OA/SA differentiation) |
| Contingency | Manual | ASP/ORCA integrated |
| SUB_METHOD | A/B/C only | A/B/C/E/M |
| Calendar Updates | Full year per file | Event-driven per security type |

---

## 11. Validation Rules Summary

### NRIC Validation
- Singapore Citizens/PRs: Must be valid NRIC format
- Foreigners: Uppercase, no special characters

### Amount Validation
- Must be [Minimum denomination] per application
- Must be in multiples of [Minimum denomination]

### Reference Number Validation
- TRANS_REF must be unique per issue code per bank

### Checksum Calculation
- Sum all numeric fields in detail record
- If > 99,999,999,999,999, use last 14 digits
- Overall checksum = sum of all record checksums

---

## 12. Version History

### Version 0.02 (30 Dec 2025)
- Updated Communication Channel with MEFT auto-prefixing
- Refined Time & Frequency sections
- Changed Institutional Auction Results to .csv format

### Version 0.01 (15 Dec 2025)
- Initial draft
