# MAS Interface with Banks and CDP

> **Document Type:** Interface Specification
> **Source File:** MAS Interface with Banks and CDP v2.8.docx
> **Version:** 2.8
> **System:** Old eApps System (Legacy)

---

## 1. Overview

This document specifies interfaces between MAS and:
- **Banks:** DBS, OCBC, UOB
- **CDP:** Central Depository Pte Ltd (SGX)

### 1.1 Security Types Covered
| Type | Description |
|------|-------------|
| SSB | Singapore Savings Bonds |
| SGS | Singapore Government Securities (Bonds) |
| T-Bills | Treasury Bills |

### 1.2 Account Types
| Code | Description | File Suffix |
|------|-------------|-------------|
| CASH | Cash applications | AP1, RE1, RA1, RR1 |
| CPFIS | CPF Investment Scheme | AP2, AA2, RA2 |
| SRS | Supplementary Retirement Scheme | AP3, RE3, RA3, RR3 |

### 1.3 Communication Channel
- **Primary:** MEFT-access (MAS Electronic File Transfer via SFTP)
- **Encryption:** PGP (Pretty Good Privacy)
- **Contingency:** MEFT email

---

## 2. SSB Interface Files Summary

| File Type | Direction | Purpose | Frequency |
|-----------|-----------|---------|-----------|
| Issuance Calendar | MAS → Banks | SSB issuance schedule | Monthly |
| Subscription File | Banks → MAS | SSB purchase applications | Daily |
| Redemption File | Banks/CDP → MAS | SSB redemption requests | Daily |
| Acknowledgement File | MAS → Banks/CDP | Processing status confirmation | Per submission |
| Allotment Results | MAS → Banks/CDP | Subscription results | Monthly |
| Redemption Results | MAS → Banks/CDP | Redemption results | Monthly |
| Holdings File | CDP/Banks → MAS | Current holdings info | 3x monthly |
| Holdings Ack File | MAS → CDP/Banks | Holdings processing status | Per submission |
| Coupon/Rate File | MAS → Banks/CDP | SSB coupon rates | Monthly |

---

## 3. File Naming Conventions

### 3.1 SSB Issuance Calendar (MAS → Banks)
| Bank | Filename |
|------|----------|
| DBS | `EAPPSDBSZZ00RT_MASSG.DBS.ABA.sb_cal.txt.pgp` |
| OCBC | `EAPPSOCBCZ00RT_MASSG.OCBCSSB.ABA.sb_cal.txt.pgp` |
| UOB | `EAPPSUOBZZ00RT_MASSG.UOBSFTP.ABA.acosbissuecal.txt.pgp` |

### 3.2 SSB Subscription Files (Banks → MAS)
| Bank | CASH | SRS |
|------|------|-----|
| DBS | `sb_dbs_ap1.txt.pgp` | `sb_dbs_ap3.txt.pgp` |
| OCBC | `sb_ocbc_ap1.txt.pgp` | `sb_ocbc_ap3.txt.pgp` |
| UOB | `sb_uob_ap1.txt.pgp` | `sb_uob_ap3.txt.pgp` |

### 3.3 SSB Redemption Files (Banks/CDP → MAS)
| Entity | CASH | SRS |
|--------|------|-----|
| DBS | - | `sb_dbs_re3.txt.pgp` |
| OCBC | - | `sb_ocbc_re3.txt.pgp` |
| UOB | - | `sb_uob_re3.txt.pgp` |
| CDP | `sb_cdp_re1.txt.pgp` | - |

### 3.4 SSB Subscription Acknowledgement (MAS → Banks)
| Bank | CASH | SRS |
|------|------|-----|
| DBS | `EAPPSDBSZZ00RT_MASSG.DBS.ABA.sb_dbs_aa1.txt.pgp` | `EAPPSDBSZZ00RT_MASSG.DBS.ABA.sb_dbs_aa3.txt.pgp` |
| OCBC | `EAPPSOCBCZ00RT_MASSG.OCBCSSB.ABA.sb_ocbc_aa1.txt.pgp` | `EAPPSOCBCZ00RT_MASSG.OCBCSSB.ABA.sb_ocbc_aa3.txt.pgp` |
| UOB | `EAPPSUOBZZ00RT_MASSG.UOBSFTP.ABA.acosbapplack.txt.pgp` | `EAPPSUOBZZ00RT_MASSG.UOBSFTP.ABA.srssbapplack.txt.pgp` |

### 3.5 SSB Allotment Results (MAS → Banks/CDP)
| Entity | CASH | SRS |
|--------|------|-----|
| DBS | `EAPPSDBSZZ00RT_MASSG.DBS.ABA.sb_dbs_ra1.txt.pgp` | `EAPPSDBSZZ00RT_MASSG.DBS.ABA.sb_dbs_ra3.txt.pgp` |
| OCBC | `EAPPSOCBCZ00RT_MASSG.OCBCSSB.ABA.sb_ocbc_ra1.txt.pgp` | `EAPPSOCBCZ00RT_MASSG.OCBCSSB.ABA.sb_ocbc_ra3.txt.pgp` |
| UOB | `EAPPSUOBZZ00RT_MASSG.UOBSFTP.ABA.acosbapplres.txt.pgp` | `EAPPSUOBZZ00RT_MASSG.UOBSFTP.ABA.srssbapplres.txt.pgp` |
| CDP | `EAPPSSGXZZ00PCDPS.SHLD.SSBMAS.ALLOCATE.SEQDISK.pgp` | `EAPPSSGXZZ00SSB_SRS_Allocation.pgp` |

### 3.6 SSB Redemption Results (MAS → Banks/CDP)
| Entity | CASH | SRS |
|--------|------|-----|
| DBS | `EAPPSDBSZZ00RT_MASSG.DBS.ABA.sb_dbs_rr1.txt.pgp` | `EAPPSDBSZZ00RT_MASSG.DBS.ABA.sb_dbs_rr3.txt.pgp` |
| OCBC | `EAPPSOCBCZ00RT_MASSG.OCBCSSB.ABA.sb_ocbc_rr1.txt.pgp` | `EAPPSOCBCZ00RT_MASSG.OCBCSSB.ABA.sb_ocbc_rr3.txt.pgp` |
| UOB | `EAPPSUOBZZ00RT_MASSG.UOBSFTP.ABA.acosbredmres.txt.pgp` | `EAPPSUOBZZ00RT_MASSG.UOBSFTP.ABA.srssbredmres.txt.pgp` |
| CDP | `EAPPSSGXZZ00PCDPS.SHLD.SSBMAS.REDEMEXP.SEQDISK.pgp` | `EAPPSSGXZZ00SSB_SRS_RedemptionRej.pgp` |

### 3.7 SSB Holdings Files (Banks/CDP → MAS)
| Entity | CASH | SRS |
|--------|------|-----|
| DBS | - | `sb_dbs_hol3.txt.pgp` |
| OCBC | - | `sb_ocbc_hol3.txt.pgp` |
| UOB | - | `sb_uob_hol3.txt.pgp` |
| CDP | `sb_cdp_hol1.txt.pgp` | - |

### 3.8 SSB Coupon/Rate File (MAS → Banks/CDP)
| Entity | Filename |
|--------|----------|
| DBS | `EAPPSDBSZZ00RT_MASSG.DBS.ABA.sb_dbs_cpn.txt.pgp` |
| OCBC | `EAPPSOCBCZ00RT_MASSG.OCBCSSB.ABA.sb_ocbc_cpn.txt.pgp` |
| UOB | `EAPPSUOBZZ00RT_MASSG.UOBSFTP.ABA.srssbcpnrate.txt.pgp` |
| CDP | `EAPPSSGXZZ00SSB_Rates.pgp` |

---

## 4. SGS/T-Bills Interface Files

### 4.1 Subscription Files (Banks → MAS)
| Bank | CASH | SRS | CPFIS |
|------|------|-----|-------|
| DBS | `ea_dbs_ap1.txt.pgp` | `ea_dbs_ap3.txt.pgp` | `ea_dbs_ap2.txt.pgp` |
| OCBC | `ea_ocbc_ap1.txt.pgp` | `ea_ocbc_ap3.txt.pgp` | `ea_ocbc_ap2.txt.pgp` |
| UOB | `ea_uob_ap1.txt.pgp` | `ea_uob_ap3.txt.pgp` | `ea_uob_ap2.txt.pgp` |

### 4.2 Issuance Calendar (MAS → Banks)
| Bank | Filename |
|------|----------|
| DBS | `EAPPSDBSZZ00RT_MASSG.DBS.ABA.ea_cal.txt.pgp` |
| OCBC | `EAPPSOCBCZ00RT_MASSG.OCBCSSB.ABA.ea_cal.txt.pgp` |
| UOB | `EAPPSUOBZZ00RT_MASSG.UOBSFTP.ABA.acoeaicfbt.txt.pgp` |

---

## 5. File Type Codes

| Code | Description |
|------|-------------|
| AP1 | Application - CASH |
| AP2 | Application - CPFIS |
| AP3 | Application - SRS |
| RE1 | Redemption - CASH |
| RE3 | Redemption - SRS |
| AA1 | Acknowledgement for Application - CASH |
| AA2 | Acknowledgement for Application - CPFIS |
| AA3 | Acknowledgement for Application - SRS |
| AR1 | Acknowledgement for Redemption - CASH |
| AR3 | Acknowledgement for Redemption - SRS |
| RA1 | Result for Application - CASH |
| RA2 | Result for Application - CPFIS |
| RA3 | Result for Application - SRS |
| RR1 | Result for Redemption - CASH |
| RR3 | Result for Redemption - SRS |
| RX1 | Result for Exception - CASH (CDP only) |
| CAL | Issuance Calendar |
| HOL | Holdings Information |
| AH1 | Holdings Acknowledgement - CASH |
| AH3 | Holdings Acknowledgement - SRS |
| CPN | Coupon/Redemption Rates |

---

## 6. Common File Structure

All files follow a 3-part structure:
1. **Header Record** - File metadata (RECORD_TYPE = 'HHHHHHHHHH')
2. **Detail Records** - Transaction data (RECORD_TYPE = 'DDDDDDDDDD')
3. **Control Record** - Summary/checksum (RECORD_TYPE = 'TTTTTTTTTT')

---

## 7. Issuance Calendar File Format

### 7.1 Header Record
| # | Field | Format | Description |
|---|-------|--------|-------------|
| 1 | RECORD_TYPE | X(10) | HHHHHHHHHH |
| 2 | FILE_TYPE | X(3) | CAL |
| 3 | PROCESSING_DATE | 9(8) | YYYYMMDD - Download date |

### 7.2 Detail Record (Repetitive)
| # | Field | Format | Description |
|---|-------|--------|-------------|
| 4 | RECORD_TYPE | X(10) | DDDDDDDDDD |
| 5 | ISSUE_IND | X(1) | S=Savings Bond, T=T-Bill, B=Bond |
| 6 | ISSUE_CODE | X(8) | e.g., GX15080H, BY18101E |
| 7 | ISIN_CODE | X(12) | 12-char ISIN |
| 8 | TENOR | 9(3) | Term length |
| 9 | TENOR_MEASURE | X(1) | D=Days, Y=Years |
| 10 | NEW_REOPEN_IND | X(1) | N=New, R=Reopen |
| 11 | CURR | X(3) | SGD |
| 12 | ANNOUNCE_DATE | 9(8) | YYYYMMDD |
| 13 | ANNOUNCE_TIME | 9(4) | HHMM (24hr) |
| 14 | AUCTION_DATE | 9(8) | YYYYMMDD |
| 15 | AUCTION_TIME | 9(4) | HHMM (24hr) |
| 16 | ISSUE_DATE | 9(8) | YYYYMMDD |
| 17 | CHECK_SUM | 9(14) | Sum of numeric fields |

### 7.3 Control Record
| # | Field | Format | Description |
|---|-------|--------|-------------|
| 18 | RECORD_TYPE | X(10) | TTTTTTTTTT |
| 19 | RECORD_COUNT | 9(9) | Total detail records |
| 20 | OVERALL_CHK_SUM | 9(14) | Sum of all checksums |

---

## 8. Subscription File Format

### 8.1 Header Record
| # | Field | Format | Description |
|---|-------|--------|-------------|
| 1 | RECORD_TYPE | X(10) | HHHHHHHHHH |
| 2 | FILE_TYPE | X(3) | AP1/AP2/AP3 |
| 3 | PRI_DLR_CODE | 9(4) | Bank code |
| 4 | BANK_NAME | X(20) | Bank name |
| 5 | PROCESSING_DATE | 9(8) | YYYYMMDD |

### 8.2 Detail Header (Per Issue)
| # | Field | Format | Description |
|---|-------|--------|-------------|
| 6 | RECORD_TYPE | X(10) | BBBBBBBBBB |
| 7 | ISSUE_CODE | X(8) | e.g., GX15080H |
| 8 | ISIN_CODE | X(12) | ISIN |
| 9 | TENDER_DATE | 9(8) | YYYYMMDD |
| 10 | CURR | X(3) | SGD |
| 11 | ISSUE_DESC | X(30) | Description |

### 8.3 Detail Record (Repetitive)
| # | Field | Format | Description |
|---|-------|--------|-------------|
| 12 | RECORD_TYPE | X(10) | DDDDDDDDDD |
| 13 | ISSUE_CODE | X(8) | Security code |
| 14 | TRANS_REF | X(8) | Unique per bank per issue |
| 15 | RECEIVED_DATE | 9(8) | ATM/iBanking receipt date |
| 16 | RECEIVED_TIME | 9(6) | ATM/iBanking receipt time |
| 17 | TRANS_TYPE | X(3) | TE_ |
| 18 | NOMINAL_AMT | 9(11) | Subscription amount |
| 19 | COMP_NOCOMP | X(1) | Unused for SSB |
| 20 | BID_YIELD_SIGN | X(1) | Unused for SSB |
| 21 | BID_YIELD | 9(3)v9(2) | Unused for SSB |
| 22 | NAME_OF_APPLN | X(100) | Applicant name |
| 23 | NATIONALITY | X(1) | S=Citizen, P=PR, F=Foreigner |
| 24 | NATIONALITY_COUNTRY | X(2) | ISO 3166 code |
| 25 | IC_PASSPORT | X(14) | NRIC/FIN/Passport |
| 26 | CUST_BANK_CODE | 9(4) | Settlement bank |
| 27 | CUST_BANK_BC | X(1) | C for retail |
| 28 | TYPE_OF_APPLN | X(3) | IND |
| 29 | REC_STATUS | X(1) | Unused |
| 30 | CDP_ACCT_NO | X(16) | CDP account (no hash) |
| 31 | SUB_METHOD | X(1) | A=ATM, B=iBanking, C=Mobile |
| 32 | CPFIS/SRS_ACCT_NO | X(16) | CPFIS/SRS account |
| 33 | FILLER | X(20) | Reserved |
| 34 | CHECK_SUM | 9(14) | Checksum |

### 8.4 Control Record
| # | Field | Format | Description |
|---|-------|--------|-------------|
| 35 | RECORD_TYPE | X(10) | TTTTTTTTTT |
| 36 | RECORD_COUNT | 9(9) | Total records |
| 37 | OVERALL_CHK_SUM | 9(14) | Sum of checksums |

---

## 9. Redemption File Format

### 9.1 Header Record
| # | Field | Format | Description |
|---|-------|--------|-------------|
| 1 | RECORD_TYPE | X(10) | HHHHHHHHHH |
| 2 | FILE_TYPE | X(3) | RE1/RE2/RE3 |
| 3 | PRI_DLR_CODE | 9(4) | Bank code |
| 4 | BANK_NAME | X(20) | Bank name |
| 5 | PROCESSING_DATE | 9(8) | YYYYMMDD |

### 9.2 Detail Record (Repetitive)
| # | Field | Format | Description |
|---|-------|--------|-------------|
| 6 | RECORD_TYPE | X(10) | DDDDDDDDDD |
| 7 | ISSUE_CODE | X(8) | Security code |
| 8 | ISIN_CODE | X(12) | ISIN |
| 9 | TRANS_REF | X(8) | Unique per bank per cycle |
| 10 | RECEIVED_DATE | 9(8) | YYYYMMDD |
| 11 | RECEIVED_TIME | 9(6) | HHMMSS |
| 12 | NOMINAL_AMT | 9(11) | Redemption quantity |
| 13-27 | ... | ... | Similar to Subscription |
| 28 | CHECK_SUM | 9(14) | Checksum |

---

## 10. Acknowledgement File Format

### 10.1 Header Record
| # | Field | Format | Description |
|---|-------|--------|-------------|
| 1 | RECORD_TYPE | X(10) | HHHHHHHHHH |
| 2 | FILE_TYPE | X(3) | AA1/AA2/AA3/AR1/AR3 |
| 3 | PRI_DLR_CODE | 9(4) | Bank code |
| 4 | BANK_NAME | X(20) | Bank name |
| 5 | PROCESSING_DATE | 9(8) | YYYYMMDD |
| 6 | PROCESSING_TIME | 9(6) | HHMMSS |
| 7 | FILE_STATUS | X(1) | P=Pass, F=Fail |
| 8 | FILE_ERROR_DESC | X(20) | Error description |

### 10.2 Detail Record
| # | Field | Format | Description |
|---|-------|--------|-------------|
| 9-29 | ... | ... | Original record fields |
| 30 | REC_STATUS | X(1) | P=Pass, F=Fail |
| 31 | REC_ERROR_DESC | X(20) | Error description |
| 32 | CHECK_SUM | 9(14) | Checksum |

---

## 11. Result File Format

### 11.1 Result Status Codes
| Code | Meaning |
|------|---------|
| P | Pass (full allotment/redemption) |
| F | Fail (zero allotment/redemption) |
| I | Incomplete (partial allotment/redemption) |

### 11.2 Additional Result Fields
| Field | Format | Description |
|-------|--------|-------------|
| PROCESSED_AMT | 9(11) | Successfully processed quantity |
| SETTLEMENT_AMT | 9(13)v9(2) | Settlement amount |
| CUTOFF_YIELD | 9(3)v9(2) | Cutoff yield (SGS/T-Bills) |
| CUTOFF_PRICE | 9(3)v9(4) | Cutoff price |

---

## 12. Holdings File Format

### 12.1 Header Record
| # | Field | Format | Description |
|---|-------|--------|-------------|
| 1 | RECORD_TYPE | X(10) | HHHHHHHHHH |
| 2 | FILE_TYPE | X(3) | HOL |
| 3 | ORG_CODE | 9(4) | Organization code |
| 4 | ORG_NAME | X(20) | Organization name |
| 5 | HOLDING_TYPE | X(3) | CAS/CPF/SRS |
| 6 | PROCESSING_DATE | 9(8) | YYYYMMDD |
| 7 | PROCESSING_TIME | 9(6) | HHMMSS |

### 12.2 Detail Record
| # | Field | Format | Description |
|---|-------|--------|-------------|
| 8 | RECORD_TYPE | X(10) | DDDDDDDDDD |
| 9 | NAME_OF_APPL | X(100) | Holder name |
| 10 | NATIONALITY | X(1) | S/P/F |
| 11 | NATIONALITY_COUNTRY | X(2) | ISO code |
| 12 | IC_PASSPORT | X(14) | ID number |
| 13 | CDP_ACCT_NO | X(16) | CDP account |
| 14 | ACCT_NO | X(16) | CPF/SRS account |
| 15 | ISSUE_CODE | X(8) | Security code |
| 16 | ISIN_CODE | X(12) | ISIN |
| 17 | HOLDING_AMT | 9(11) | Holding amount |
| 18 | CHECK_SUM | 9(14) | Checksum |

---

## 13. Coupon/Redemption Rate File Format

### 13.1 Header Record
| # | Field | Format | Description |
|---|-------|--------|-------------|
| 1 | RECORD_TYPE | X(10) | HHHHHHHHHH |
| 2 | FILE_TYPE | X(3) | CPN |
| 3 | CPN_PAYMENT_DATE | 9(8) | YYYYMMDD |
| 4 | REDEMPTION_DATE | 9(8) | YYYYMMDD |
| 5 | PROCESSING_DATE | 9(8) | YYYYMMDD |

### 13.2 Detail Record
| # | Field | Format | Description |
|---|-------|--------|-------------|
| 6 | RECORD_TYPE | X(10) | DDDDDDDDDD |
| 7 | ISSUE_CODE | X(8) | Security code |
| 8 | ISIN_CODE | X(12) | ISIN |
| 9 | MATURITY_DATE | 9(8) | YYYYMMDD |
| 10 | CPN_RATE | 9(3)v9(5) | Coupon rate |
| 11 | NEXT_CPN_DATE | 9(8) | Next coupon date |
| 12 | REMARKS_CPN_RATE | X(30) | Formula remarks |
| 13 | REDEMPTION_RATE | 9(3)v9(5) | Early redemption rate |
| 14 | REMARKS_RED_RATE | X(30) | Formula remarks |
| 15 | FILLER | X(20) | Reserved |
| 16 | CHECK_SUM | 9(14) | Checksum |

---

## 14. SGS/T-Bills Specific Fields

For SGS/T-Bills (competitive bidding), additional fields:

| Field | Format | Description |
|-------|--------|-------------|
| COMP_NOCOMP | X(1) | C=Competitive, N=Non-competitive |
| BID_YIELD_SIGN | X(1) | + or - |
| BID_YIELD | 9(3)v9(2) | Bid yield (e.g., 00305 = 3.05%) |
| CUTOFF_YIELD_SIGN | X(1) | + or - |
| CUTOFF_YIELD | 9(3)v9(2) | Cutoff yield |
| CUTOFF_PRICE | 9(3)v9(4) | Cutoff price (e.g., 1022230 = 102.223) |
| ALLOTTED_AMT | 9(11) | Allotted quantity |

---

## 15. Checksum Calculation

### 15.1 Record Checksum
Sum of specified numeric fields:
- **Calendar:** TENOR + ANNOUNCE_DATE + ANNOUNCE_TIME + AUCTION_DATE + AUCTION_TIME + ISSUE_DATE
- **Subscription/Redemption:** RECEIVED_DATE + RECEIVED_TIME + NOMINAL_AMT + BID_YIELD + CUST_BANK_CODE
- **Holdings:** CDP_ACC_NO (last 8 digits) + HOLDING_AMT
- **Coupon:** CPN_RATE + NEXT_CPN_DATE + REDEMPTION_RATE

### 15.2 Overflow Handling
If sum > 99,999,999,999,999, use last 14 digits only.

---

## 16. Error Descriptions

### 16.1 File-Level Errors
| Code | Description |
|------|-------------|
| 1 | Invalid file format |
| 2 | Invalid rec count |
| 3 | Invalid total chksum |
| 4 | Invalid pri dlr code |
| 5 | Invalid issue code |
| 6 | Invalid ISIN code |
| 7 | Invalid tender date |
| 8 | Invalid proc date |
| 9 | Invalid file type |
| 10 | Invalid currency |
| 11 | Decryption error |

### 16.2 Record-Level Errors
| Code | Description |
|------|-------------|
| 1 | Invalid bank code |
| 2 | Invalid issue code |
| 3 | Invalid ISIN code |
| 4 | Invalid tender date |
| 5 | Invalid nominal amt |
| 6 | Invalid NRIC |
| 7 | Invalid sub method |
| 8 | Duplicate record |
| 9 | Invalid rec chksum |
| 10 | Invalid bank ref no |
| 11 | Invalid recvd date |
| 12 | Invalid recvd time |
| 13 | Invalid trans type |
| 14 | Invalid nationality |
| 15 | Invalid cust ind |
| 16 | Invalid appl type |
| 17 | Invalid passport |
| 18 | Invalid comp nocomp |
| 19 | Invalid bid sign |
| 20 | Invalid bid yield |
| 21 | Invalid appl name |
| 22 | SRS acct no required |

### 16.3 Result File Errors
| Type | Error |
|------|-------|
| Subscription | Limit exceeded, Oversubscription |
| Redemption | NA |

---

## 17. Processing Schedule

### 17.1 SSB Monthly Cycle
| Timing | Activity |
|--------|----------|
| Announcement Day + 1 | Coupon/Rate file generated |
| Allotment Day - 2 WD | Holdings file processing |
| Allotment Day | Holdings + Allotment processing |
| Issuance Day + 1 | Holdings file processing |

### 17.2 Daily Processing
- Subscription/Redemption files: End of day processing
- Cut-off: Day before auction (standardized time)
- Acknowledgement: Generated per submission

---

## 18. Business Rules

### 18.1 Subscription Rules
- **SSB:** Min $500, multiples of $500
- **SGS/T-Bills:** Min $1,000, multiples of $1,000

### 18.2 Validation Rules
1. NRIC validation for Singapore IC numbers (S, T series, FIN)
2. Transaction reference unique per bank per issue (subscription) or per cycle (redemption)
3. SRS account holders use bank's omnibus CDP account
4. CPFIS applications require CPF account number validation

### 18.3 RECEIVED_DATE/TIME
Must be actual ATM/iBanking transaction time (used for first-in-first-processed priority in allocation)

---

## 19. Format Notation

| Symbol | Meaning |
|--------|---------|
| 9(n) | n-digit numeric |
| 9(n)v9(m) | n whole + m decimal digits |
| S9(n)v9(m) | Signed numeric |
| X(n) | n-character alphanumeric |
