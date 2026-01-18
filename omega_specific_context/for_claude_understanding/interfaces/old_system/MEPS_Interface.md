# MEPS+ Interface Specification

> **Document Type:** Interface Specification
> **Source Files:**
> [cite_start]* MEPS+ Interface Specifications - eApps v1.32.pdf [cite: 55]
> [cite_start]* MEPS+_Sora_File_Spec.docx [cite: 1772]
> **Version:** 1.32
> **System:** MEPS+ SGS (Singapore Government Securities) System
> **Target System:** MAS eApps System / Savings Bonds System

---

## 1. Overview

The MEPS+ SGS system interfaces with the MAS eApps system to manage the lifecycle of Singapore Government Securities (SGS), Treasury Bills, and Savings Bonds. [cite_start]This includes the transmission of issuance details, auction results, daily prices, and redemption requests[cite: 227, 228, 229, 231].

### 1.1 Interface Summary

| Filename | Description | Direction | Mode | Trigger |
|:---|:---|:---|:---|:---|
| `secmast.txt` | New Issuance or Re-opening of ISINs | SGS $\to$ eApps | Ad-hoc | [cite_start]Manual Trigger [cite: 236] |
| `secupdt.txt` | ISIN Summary After Auction | eApps $\to$ SGS | Online | [cite_start]Event-based [cite: 236] |
| `secint.txt` | Daily ISIN Update | SGS $\to$ eApps | Batch | [cite_start]End-of-Day (EOD) [cite: 236] |
| `auction.txt` | Bank Auction Details | eApps $\to$ SGS | Online | [cite_start]Event-based [cite: 236] |
| `bank.txt` | Daily Bank List | SGS $\to$ eApps | Batch | [cite_start]End-of-Day (EOD) [cite: 236] |
| `masrepo.txt` | MAS Repo Transaction Details | eApps $\to$ SGS | Online | [cite_start]Event-based (Currently Disabled) [cite: 236, 237] |
| `closingprice.txt` | Daily Closing Prices | eApps $\to$ SGS | Online | [cite_start]Event-based [cite: 236] |
| `auction_sbond.txt` | Savings Bonds Auction Results | eApps $\to$ SGS | Online | [cite_start]Event-based [cite: 236] |
| `couponrates_sbond.txt` | Step-up Coupon Rates | SGS $\to$ eApps | Ad-hoc | [cite_start]Manual Trigger [cite: 236] |
| `rdmpartial_sbond.txt` | Partial Redemption Requests | eApps $\to$ SGS | Online | [cite_start]Event-based [cite: 243] |
| `meps_sora_index.txt` | Daily SORA Index | eApps $\to$ SGS | Online | [cite_start]Daily [cite: 243] |

### 1.2 Communication Channel
* [cite_start]**Protocol:** WMQ to WMQ (IBM WebSphere MQ)[cite: 245].
* **Queue Mapping:**
    * [cite_start]**Incoming to SGS (Prices):** `MSAB.SABMNEAP.MNET2MEPS`[cite: 251].
    * [cite_start]**Incoming to SGS (Auctions/Repo/SORA):** `MSAB.SABAUEAP.SGS2MEPS`[cite: 253].
    * [cite_start]**Outgoing from SGS:** `MSAB.SABMNEAP.MEPS2MNET`[cite: 255].

---

## 2. New Issuance / Re-opening File (secmast.txt)

**Direction:** SGS $\to$ eApps
[cite_start]**Trigger:** Manual trigger via function screen[cite: 236].

### 2.1 File Structure
* **Padding:** Numeric fields (`9`) right-justified with leading zeros; [cite_start]Alphanumeric fields (`X`) left-justified with trailing spaces[cite: 286, 287, 288].

| Field | Size | Type | Remarks |
|:---|:---|:---|:---|
| ISSUE_CODE | 8 | Char | [cite_start]E.g., NX00100H [cite: 279] |
| ISSUE_NO | 2 | Num | [cite_start]`01` for new, `02-99` for reopen [cite: 279] |
| ISSUE_TYPE | 1 | Char | [cite_start]Always space [cite: 279] |
| CURR | 3 | Char | [cite_start]Always `SGD` [cite: 279] |
| ISSUE_DESC | 30 | Char | [cite_start]ISIN Description [cite: 279] |
| ISSUE_DATE | 8 | Date | [cite_start]YYYYMMDD (Allotment Date) [cite: 279] |
| TENDER_DATE | 8 | Date | [cite_start]YYYYMMDD (Auction Date) [cite: 279] |
| QTY_OFFERED | 13 | Num | [cite_start]Total nominal amount [cite: 279] |
| QTY_APPLIED | 13 | Num | [cite_start]Always 0 for SGS output [cite: 279, 311] |
| AVE_YIELD | 3.2 | Num | [cite_start]Always 0 for SGS output [cite: 279, 313] |
| CUT_OFF_YIELD | S3.2 | Num | [cite_start]Always 0 for SGS output [cite: 279, 315] |
| MATURITY_DATE | 8 | Date | [cite_start]YYYYMMDD [cite: 279] |
| PERCENT_COY | 3.2 | Num | [cite_start]Always 0 for SGS output [cite: 279, 326] |
| PERCENT_SUB | 3.2 | Num | [cite_start]Always 0 for SGS output [cite: 279, 328] |
| NC_PERCENT | 3.2 | Num | [cite_start]Always 0 for SGS output [cite: 279, 330] |
| NC_QTY_ALLOT | 13 | Num | [cite_start]Always 0 for SGS output [cite: 279, 332] |
| INT_RATE | 3.4 | Num | 0 for new; [cite_start]Coupon Rate for reopen [cite: 279, 334] |
| TAX_STATUS | 1 | Char | [cite_start]`Y` or `N` [cite: 279] |
| CUT_OFF_YIELD_PRICE | 3.4 | Num | [cite_start]Always 0 for SGS output [cite: 279, 339] |
| AVE_YIELD_PRICE | 3.4 | Num | [cite_start]Always 0 for SGS output [cite: 279, 341] |
| CLOSING_PRICE | 3.4 | Num | [cite_start]Always 0 for SGS output [cite: 279, 343] |
| ISIN_CODE | 12 | Char | [cite_start]E.g., SG1234567890 [cite: 279] |
| TENOR | 3 | Num | [cite_start]Years (Bonds), Days (T-Bills), Months (FRN) [cite: 279, 347] |
| ETENDER_IND | 1 | Char | [cite_start]`Y` if Issue Date > 14012002 [cite: 279, 351] |
| MAS_APPLIED | 13 | Num | [cite_start]MAS Applied Amount [cite: 279, 353] |
| MAS_ALLOTTED | 13 | Num | [cite_start]Always 0 for SGS output [cite: 279, 355] |
| INT_PAID_IND | 1 | Char | [cite_start]Bonds only [cite: 279, 362] |
| LAST_INT_DATE | 8 | Char | [cite_start]YYYYMMDD (Bonds only) [cite: 279, 364] |
| NEXT_INT_DATE | 8 | Char | [cite_start]YYYYMMDD (Bonds only) [cite: 279, 368] |
| ACCRUED_INT_DAYS | 3 | Num | [cite_start]`000` (Bonds only) [cite: 279, 371] |
| INT_DATE1 | 4 | Num | [cite_start]MMDD (Bonds only) [cite: 279, 374] |
| INT_DATE2 | 4 | Num | [cite_start]MMDD (Bonds only) [cite: 285, 377] |
| EX_INT_DATE | 8 | Char | [cite_start]YYYYMMDD (Bonds only) [cite: 285, 381] |

### 2.2 Business Rules
* **Tenor Calculation:**
    * [cite_start]**Bonds:** Days between maturity and issue / 365. Mapped to specific years (2, 5, 10, 15, 20, 30, 40, 50) [cite: 405-424].
    * [cite_start]**T-Bills:** Days / 7[cite: 428].
    * [cite_start]**FRN:** Days / (Days in Year/12)[cite: 426].
* [cite_start]**T-Bills:** Fill fields up to `MAS_ALLOTTED` (Field 26)[cite: 289].
* [cite_start]**Bonds:** Fill fields up to `EX_INT_DATE` (Field 33)[cite: 289].

---

## 3. ISIN Summary After Auction (secupdt.txt)

**Direction:** eApps $\to$ SGS
[cite_start]**Trigger:** Online (After auction completion)[cite: 236].

### 3.1 File Structure
* [cite_start]**Padding:** Unused area padded with leading zeros (Num) or trailing spaces (Char)[cite: 458].
* **Format:** Matches `secmast.txt` structure but with auction results filled in.

| Field | Size | Type | Description/Update Rule |
|:---|:---|:---|:---|
| ISSUE_CODE | 8 | Char | [cite_start]Same as request [cite: 450] |
| ... | ... | ... | (Fields 2-8 same as secmast.txt) |
| QTY_APPLIED | 13 | Num | [cite_start]**Updated:** Total nominal amount applied [cite: 450] |
| AVE_YIELD | S3.2 | Num | [cite_start]**Updated:** Signed (+/-) Average Yield [cite: 450, 460] |
| CUT_OFF_YIELD | S3.2 | Num | [cite_start]**Updated:** Signed (+/-) Cutoff Yield [cite: 450, 460] |
| ... | ... | ... | (Field 12 same as secmast.txt) |
| PERCENT_COY | 3.2 | Num | [cite_start]**Updated:** Percent [cite: 450] |
| PERCENT_SUB | 3.2 | Num | [cite_start]**Updated:** Percent [cite: 450] |
| NC_PERCENT | 3.2 | Num | [cite_start]**Updated:** Percent [cite: 450] |
| NC_QTY_ALLOT | 13 | Num | [cite_start]**Updated:** Non-Competitive Quantity Allotted [cite: 450] |
| INT_RATE | 3.4 | Num | [cite_start]**Updated:** Coupon Rate (for new issuance) [cite: 450] |
| ... | ... | ... | (Field 18 same as secmast.txt) |
| CUT_OFF_YIELD_PRICE | 3.4 | Num | [cite_start]**Updated:** Price [cite: 450] |
| AVE_YIELD_PRICE | 3.4 | Num | [cite_start]**Updated:** Price [cite: 450] |
| CLOSING_PRICE | 3.4 | Num | [cite_start]**Updated:** Price [cite: 450] |
| ... | ... | ... | (Fields 22-25 same as secmast.txt) |
| MAS_ALLOTTED | 13 | Num | [cite_start]**Updated:** MAS Allotted Amount [cite: 450] |
| ... | ... | ... | (Fields 27-33 same as secmast.txt) |

### 3.2 Processing Logic
1.  [cite_start]**Validation:** ISIN Type must be Bonds, Treasury Bills, or MAS Bills[cite: 609].
2.  **Duplicate Check:** None. [cite_start]Later records overwrite earlier ones[cite: 618].
3.  [cite_start]**Negative Yield:** For new bond issuance with negative yield, SGS uses the `INT_RATE` from this file (floored at zero by eApps logic)[cite: 625, 626].
4.  [cite_start]**Cut-off:** Must be received before EOD of T-1 (business day before issuance)[cite: 664].

---

## 4. Daily ISIN Update (secint.txt)

**Direction:** SGS $\to$ eApps
[cite_start]**Trigger:** End of Day (EOD) Batch[cite: 236].

### 4.1 File Structure
* **Content:** Extracts New, Active, and Suspended ISINs. [cite_start]Also includes redeemed FRNs on their maturity date[cite: 744, 745].
* **Format:** Matches `secmast.txt` with one additional field for FRN.

| Field | Size | Type | Remarks |
|:---|:---|:---|:---|
| ... | ... | ... | [cite_start]Fields 1-33 match `secmast.txt` format [cite: 685] |
| CPN_PAYM_IND | 1 | Char | **New Field:** `Y` or Blank. [cite_start]Only for MAS FRN Bonds [cite: 692, 740] |

### 4.2 Business Rules
* [cite_start]**CPN_PAYM_IND:** Set to `Y` if there is a coupon payment for the MAS FRN Bond on that day[cite: 692].
* [cite_start]**FRN Logic:** Redeemed FRN details appear in `secint.txt` only on the Current Value Date of redemption[cite: 745].

---

## 5. Bank Auction Results (auction.txt)

**Direction:** eApps $\to$ SGS
[cite_start]**Trigger:** Online[cite: 236].
[cite_start]**Delimiter:** Semicolon `;`[cite: 870].

### 5.1 File Structure
This file contains a header followed by repetitive auction details. Each detail starts on a new line.

#### Header Record
| Field | Format | Description |
|:---|:---|:---|
| ISIN_CODE | X(12) | [cite_start]ISIN [cite: 817] |
| ISSUE_CODE | X(8) | [cite_start]Issue Code [cite: 822] |
| ISSUE_DATE | X(8) | [cite_start]YYYYMMDD [cite: 827] |
| REC_NUM | 9(3) | [cite_start]Total number of detail records [cite: 832] |

#### Detail Record (Repetitive)
| Field | Format | Description |
|:---|:---|:---|
| MBR_CODE | X(8) | [cite_start]Member BIC [cite: 838] |
| BANK_CODE | 9(4) | [cite_start]Bank Code (MAS = 2500) [cite: 842, 895] |
| CUSTODY_CODE | X(3) | [cite_start]E.g., `TRD`, `CUS` [cite: 847] |
| PRICE | 9(3)v9(5) | [cite_start]Cutoff Price (e.g., 124.005) [cite: 851] |
| NOMINAL_AMT | 9(13) | [cite_start]Nominal Amount [cite: 855] |
| SETT_AMT | 9(13)v9(2) | [cite_start]Settlement Amount [cite: 859] |

#### Trailer (End Indicator)
| Field | Format | Value |
|:---|:---|:---|
| End_Txn | X(6) | [cite_start]`ENDTXN` [cite: 864] |

### 5.2 Processing Logic
* [cite_start]**Delimiter:** Usage of pipe or other delimiters will cause failure[cite: 870].
* **Batching:** Multiple auctions can be in one file, separated by `ENDTXN`. [cite_start]Validated separately[cite: 940].
* [cite_start]**Validation:** Sum of nominal amounts must equal total quantity offered[cite: 921].
* [cite_start]**Timing:** Must be received before EOD of T-1[cite: 987].

---

## 6. Daily Bank List (bank.txt)

**Direction:** SGS $\to$ eApps
[cite_start]**Trigger:** End of Day (EOD) Batch[cite: 236].

### 6.1 File Structure
* **Padding:** Standard numeric/alphanumeric padding rules apply.

| Field | Size | Type | Remarks |
|:---|:---|:---|:---|
| BANK_CODE | 4 | Num | [cite_start]E.g., 7339 [cite: 1022] |
| BANK_NAME | 40 | Char | [cite_start]Member Name [cite: 1022] |
| BANK_SHORTNAME | 15 | Char | [cite_start]Member Code (8 chars) [cite: 1022] |
| AUTODEBIT_INDICATOR | 1 | Char | [cite_start]`Y` or `N` [cite: 1022] |
| PARTICIPANT_INDICATOR | 1 | Char | [cite_start]`Y` (Participant) or `N` (Non-Participant) [cite: 1022] |

---

## 7. Daily Closing Prices (closingprice.txt)

**Direction:** eApps $\to$ SGS
[cite_start]**Trigger:** Online[cite: 236].
[cite_start]**Delimiter:** Semicolon `;`[cite: 1260].

### 7.1 File Structure
* **Repetitive:** Each line is a closing price record.

| Field | Format | Description |
|:---|:---|:---|
| VAL_DATE | X(8) | [cite_start]YYYYMMDD [cite: 1234] |
| ISIN_CODE | X(12) | [cite_start]ISIN [cite: 1237] |
| ISSUE_CODE | X(8) | [cite_start]Issue Code [cite: 1240] |
| MLA_PRICE | 9(3)v9(5) | [cite_start]Closing price for MLA valuation [cite: 1244] |
| ILF_PRICE | 9(3)v9(5) | [cite_start]Price for ILF valuation (next day) [cite: 1248] |
| CLOSING_YIELD | X(1) + S9(3)v9(5) | [cite_start]Signed Yield (e.g., +00220000 for 2.2) [cite: 1253] |

### 7.2 Processing Logic
* [cite_start]**Timing:** Should arrive before Beginning of Day (BOD) of the next business day[cite: 1355].
* [cite_start]**Zero Values:** Since v1.32, zero value closing yields are updated in the system (previously ignored)[cite: 1289].

---

## 8. Savings Bonds Auction Results (auction_sbond.txt)

**Direction:** eApps $\to$ SGS
[cite_start]**Trigger:** Online[cite: 236].
[cite_start]**Delimiter:** Semicolon `;`[cite: 1381].

### 8.1 File Structure
Structure mirrors `auction.txt` closely.

#### Header
| Field | Format | Description |
|:---|:---|:---|
| ISIN_Code | X(12) | [cite_start]ISIN [cite: 1377] |
| Issue_Code | X(8) | [cite_start]Issue Code [cite: 1377] |
| Issue_Date | X(8) | [cite_start]YYYYMMDD [cite: 1377] |
| Record_Number | 9(3) | [cite_start]Count of detail records [cite: 1377] |

#### Detail (Repetitive)
| Field | Format | Description |
|:---|:---|:---|
| Member_Code | X(8) | [cite_start]Participant BIC [cite: 1377] |
| Bank_Code | 9(4) | [cite_start]Bank Code [cite: 1377] |
| Custody_Code | X(3) | [cite_start]Must be `CUS`, `WT0`, `WT1`, or `WT2` [cite: 1377, 1406] |
| Price | 9(3)v9(5) | [cite_start]Cutoff Price [cite: 1377] |
| Nominal_Amount | 9(13) | [cite_start]Allotted Amount [cite: 1377] |
| Settlement_Amount | 9(13)v9(2) | [cite_start]Amount to pay [cite: 1377] |

#### Trailer
| Field | Format | Value |
|:---|:---|:---|
| End_of_auction | X(6) | [cite_start]`ENDTXN` [cite: 1377] |

---

## 9. Step-up Coupon Rates (couponrates_sbond.txt)

**Direction:** SGS $\to$ eApps
[cite_start]**Trigger:** Manual Trigger[cite: 236].
[cite_start]**Delimiter:** Semicolon `;`[cite: 1568].

### 9.1 File Structure

#### Header
| Field | Format | Description |
|:---|:---|:---|
| ISIN_Code | X(12) | [cite_start]ISIN [cite: 1565] |
| Issue_Code | X(8) | [cite_start]Issue Code [cite: 1565] |
| Frequency | X(1) | [cite_start]`M`, `Q`, `S`, `Y`, `T` (At Maturity) [cite: 1565] |
| Record_Number | 9(3) | [cite_start]Count of coupon records [cite: 1565] |

#### Detail (Repetitive)
| Field | Format | Description |
|:---|:---|:---|
| Year_Number | 9(2) | [cite_start]Year sequence (e.g., 01) [cite: 1565] |
| Coupon_Number | 9(2) | [cite_start]Coupon sequence [cite: 1565] |
| Coupon_Payment_Date | X(8) | [cite_start]YYYYMMDD [cite: 1565] |
| Coupon_Rate | 9(3)v9(5) | [cite_start]Step-up rate [cite: 1565] |

#### Trailer
| Field | Format | Value |
|:---|:---|:---|
| End_of_record | X(6) | [cite_start]`ENDREC` [cite: 1565] |

---

## 10. Partial Redemption Requests (rdmpartial_sbond.txt)

**Direction:** eApps $\to$ SGS
[cite_start]**Trigger:** Online[cite: 243].
[cite_start]**Delimiter:** Semicolon `;`[cite: 1624].

### 10.1 File Structure
* **Repetitive:** Each line is a redemption request.

| Field | Format | Description |
|:---|:---|:---|
| ISIN_Code | X(12) | [cite_start]ISIN [cite: 1621] |
| Issue_Code | X(8) | [cite_start]Issue Code [cite: 1621] |
| Redemption_Date | X(8) | [cite_start]YYYYMMDD [cite: 1621] |
| Member_Code | X(8) | [cite_start]BIC [cite: 1621] |
| Bank_Code | 9(4) | [cite_start]Bank Code [cite: 1621] |
| Custody_Code | X(3) | [cite_start]`CUS`, `WT0`, `WT1`, `WT2` [cite: 1621] |
| Nominal_Amount | 9(13) | [cite_start]Redemption Amount [cite: 1621] |
| Call_Price | 9(3)v9(5) | [cite_start]Call price per lot [cite: 1621] |

### 10.2 Processing Logic
* [cite_start]**Timing:** eApps sends consolidated requests at end of month, prior to redemption date[cite: 1674].
* **Execution:** For requests before T, processing happens at EOD T-1. [cite_start]For same-day requests (T), manual activation is required[cite: 1676, 1677].

---

## 11. Daily SORA Index (meps_sora_index.txt)

**Direction:** eApps $\to$ SGS
[cite_start]**Trigger:** Online (Daily ~0900hrs)[cite: 243, 1742].
[cite_start]**Delimiter:** Pipe `|`[cite: 1778, 1704].

### 11.1 File Structure
* [cite_start]**Constraint:** Only one record allowed per file[cite: 1702].

| Field | Format | Description | Mapping |
|:---|:---|:---|:---|
| SORA Publication Date | X(8) | YYYYMMDD (Date of publication) | [cite_start]`ABA0029_SORA_PUB_DT` [cite: 1776] |
| Value Date | X(8) | YYYYMMDD (Date of rate, T-1) | [cite_start]`ABA0029_SORA_VALUE_DT` [cite: 1776] |
| SORA Rate | 9(3)v9(10) | Index Rate (e.g., 124.0050100000) | [cite_start]`ABA0029_SORA_INDEX` [cite: 1776] |

### 11.2 Processing Logic
* [cite_start]**Validation:** SORA Publication Date must be later than Value Date[cite: 1733].
* [cite_start]**Timing:** Should arrive before SGS EOD Backup[cite: 1750].
* [cite_start]**Alert:** If no SORA rate is found for the day, system raises TEC alert `[MEP01062]`[cite: 1756].

---

## 12. MAS Repo Facility (masrepo.txt)
[cite_start]*Status: Currently not enabled[cite: 237].*

**Direction:** eApps $\to$ SGS
[cite_start]**Delimiter:** Semicolon `;`[cite: 1065].

### 12.1 File Structure
Header with Transaction Ref, followed by repetitive security details, ending with `ENDTXN`.
* [cite_start]**Key Fields:** `TXN_REF_NO`, `MSG_FUNCTION` (NEWM/CANC), `MBR_CODE`, `TXN_AMT`, `DELIVERING_ISIN`, `RECEIVING_ISIN`[cite: 1061].

---

## 13. System Configuration

### 13.1 Directory & Queues
* **Environment:** Unix-based.
* [cite_start]**Job Controller:** MQ Listeners are controlled by SOD/EOD startup scripts[cite: 263].
* [cite_start]**SGS Queue (Incoming):** `MSAB.SABAUEAP.SGS2MEPS`[cite: 253].
* [cite_start]**SGS Queue (Outgoing):** `MSAB.SABMNEAP.MEPS2MNET`[cite: 255].

### 13.2 Contingency
* [cite_start]**Manual Upload:** All interface files (`secmast`, `secupdt`, `auction`, `closingprice`, `masrepo`, `sbond` files) support manual upload via the MEPS+ SGS Manual Contingency utilities if the MQ link fails[cite: 396, 627, 937, 1309, 1550].

---

## 14. Error Handling

| Scenario | System Action | Recovery |
|:---|:---|:---|
| **Validation Failure** | Logged in `SGBP0901` report. [cite_start]TEC Alert displayed (e.g., `MEP05004`, `MEP05024`). [cite: 602, 603, 1428] | Correct error and re-send file. |
| **Empty File** | [cite_start]Rejected with "Empty file/message received". [cite: 606] | Re-send valid file. |
| **Duplicate File** | [cite_start]**SGS does not check for duplicates.** Latest file/record takes precedence and overwrites existing data (except for Repo cancellation). [cite: 618, 938] | Ensure correct version is sent last. |
| **Partial Failure** | For multi-record files (Auction, Repo), validation is at record level (`ENDTXN`). [cite_start]Valid records are processed; invalid ones rejected. [cite: 943] | Re-send only rejected records (or full file if operational procedure dictates). |