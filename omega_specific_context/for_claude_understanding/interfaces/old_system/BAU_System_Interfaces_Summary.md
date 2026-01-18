# BAU OMEGA System Interfaces Summary

> **Document Type:** Interface Summary
> **Source File:** BAU_OMEGA_System Interfaces.xlsx
> **System:** eApps/OMEGA BAU Operations
> **Purpose:** High-level summary of all system interfaces

---

## 1. Overview

This document provides a consolidated view of all interfaces in the eApps/OMEGA ecosystem, including communication channels, file types, and operational triggers.

---

## 2. Interfacing Systems Summary

| S.No | System | Direction | Communication Channel | Protocol |
|------|--------|-----------|----------------------|----------|
| 1 | MEPS+ | In/Out | MEFT | SFTP |
| 2 | FMBS | Out | MEFT | SFTP |
| 3 | AGD | Out | MEFT | SFTP |
| 4 | AMMO | Out | MEFT | SFTP |
| 5 | MERIT | Out | MEFT | SFTP |
| 6 | Financial Institutions (DBS, OCBC, UOB) | In/Out | MEFT | SFTP |
| 7 | CDP | In/Out | MEFT | SFTP |
| 8 | SSB Portal | Out | API | HTTPS |
| 9 | SAMS | In | API | HTTPS |
| 10 | SGX | Out | MEFT | SFTP |
| 11 | MAS Website | Out | API | HTTPS |
| 12 | Market Data Provider | In | API | HTTPS |

---

## 3. Interface Triggers

| Trigger Type | Description |
|--------------|-------------|
| Time Scheduled | Automated at specific times (e.g., 7 AM daily) |
| Job Dependency | Triggered after completion of dependent job |
| Ad-hoc by Users | Manually triggered by operators |
| Event-driven | Triggered by specific business events |

---

## 4. MEPS+ Interfaces

### 4.1 Incoming from MEPS+

| File | Purpose |
|------|---------|
| secmast.txt | Receive new issues/re-openings |
| bank.txt | Receive bank info |
| secint.txt | Receive security interest rates |
| couponrates_sbond.txt | Receive SSB coupon rates |

### 4.2 Outgoing to MEPS+

| File | Purpose |
|------|---------|
| auction.txt | Send auction results |
| secupdt.txt | Send securities update after auction |
| auction_sbond.txt | Send SSB allotment results |
| rdmpartial_sbond.txt | Send SSB partial redemption |
| closingprice.txt | Send closing prices |
| meps_sora_index.txt | Send SORA rates |

**Reference**: MEPS+ Interface Specifications - eApps v1.23

---

## 5. FMBS Interfaces

### 5.1 Outgoing to FMBS

| File | Purpose |
|------|---------|
| closingprice_fmbs.txt | Send closing prices |
| secupdt_fmbs.txt | Send securities update after auction |
| auction_fmbs.txt | Send auction results |
| fmbs_erf.txt | Send ERF results |
| fmbs_erf_agg_bids.csv | Send aggregated ERF bids |

**Reference**: FMBS_Interface_Spec.docx

---

## 6. AGD Interfaces

### 6.1 Outgoing to AGD (Scheduled)

| File | Purpose | Schedule |
|------|---------|----------|
| IT030048.txt | Static Data | Weekly (Wed) + Month-end |
| IT040048.txt | Transaction Data | Weekly (Wed) + Month-end |
| IT050048.txt | ERF Data | Weekly (Wed) + Month-end |

### 6.2 Outgoing to AGD (Ad-hoc/Syndication)

| File | Purpose |
|------|---------|
| IT032048.txt | Static Data (ad-hoc) |
| IT042048.txt | Transaction Data (ad-hoc) |
| IT052048.txt | ERF Data (ad-hoc) |

**Reference**: ERF Interface Specification - ERF to AGD v0.2.docx

---

## 7. AMMO Interfaces

### 7.1 Outgoing to AMMO

| File | Purpose |
|------|---------|
| closingprice_ammo.txt | Send closing prices daily |
| SORA.txt | SORA data |

**Reference**: AMMO_Interface_Spec.docx

---

## 8. MERIT Interfaces

### 8.1 Outgoing to MERIT

| File | Purpose |
|------|---------|
| GL.I.EAPP.SGS_MASTER.YYYYMM.txt | Previous month's closing prices (bonds/T-bills) |

**Note**: File contains closing price details (e.g., yield) for every day of the previous month, regardless of working day. Zero values if no data available.

**Reference**: MERIT_Interface_Spec.docx

---

## 9. Financial Institutions (FIs) / CDP Interfaces

### 9.1 SSB Issuance Calendar

| File | Destination |
|------|-------------|
| RT_MASSG.DBS.ABA.sb_cal.txt.pgp | DBS |
| RT_MASSG.OCBCSSB.ABA.sb_cal.txt.pgp | OCBC |
| RT_MASSG.UOBSFTP.ABA.acosbissuecal.txt.pgp | UOB |

### 9.2 SGS/T-Bills Issuance Calendar

| File | Destination |
|------|-------------|
| RT_MASSG.DBS.ABA.ea_cal.txt.pgp | DBS |
| RT_MASSG.OCBCSSB.ABA.ea_cal.txt.pgp | OCBC |
| RT_MASSG.UOBSFTP.ABA.acoeaicfbt.txt.pgp | UOB |

### 9.3 SSB Subscription (Incoming)

| Account Type | File Pattern |
|--------------|--------------|
| CASH | sb_[bank]_ap1.txt.pgp |
| SRS | sb_[bank]_ap3.txt.pgp |

**Bank-specific files:**
- DBS: sb_dbs_ap1.txt.pgp, sb_dbs_ap3.txt.pgp
- OCBC: sb_ocbc_ap1.txt.pgp, sb_ocbc_ap3.txt.pgp
- UOB: sb_uob_ap1.txt.pgp, sb_uob_ap3.txt.pgp

### 9.4 SSB Subscription Acknowledgement (Outgoing)

| File | Destination |
|------|-------------|
| RT_MASSG.DBS.ABA.sb_dbs_aa1.txt.pgp | DBS (CASH) |
| RT_MASSG.DBS.ABA.sb_dbs_aa3.txt.pgp | DBS (SRS) |
| RT_MASSG.OCBCSSB.ABA.sb_ocbc_aa1.txt.pgp | OCBC (CASH) |
| RT_MASSG.OCBCSSB.ABA.sb_ocbc_aa3.txt.pgp | OCBC (SRS) |
| RT_MASSG.UOBSFTP.ABA.acosbapplack.txt.pgp | UOB (CASH) |
| RT_MASSG.UOBSFTP.ABA.srssbapplack.txt.pgp | UOB (SRS) |

### 9.5 SSB Redemption (Incoming)

| Account Type | Source | File |
|--------------|--------|------|
| CASH | CDP | sb_cdp_re1.txt.pgp |
| SRS | DBS | sb_dbs_re3.txt.pgp |
| SRS | OCBC | sb_ocbc_re3.txt.pgp |
| SRS | UOB | sb_uob_re3.txt.pgp |

### 9.6 SSB Redemption Acknowledgement (Outgoing)

| File | Destination |
|------|-------------|
| RT_MASSG.DBS.ABA.sb_dbs_ar3.txt.pgp | DBS (SRS) |
| RT_MASSG.OCBCSSB.ABA.sb_ocbc_ar3.txt.pgp | OCBC (SRS) |
| RT_MASSG.UOBSFTP.ABA.srssbredmack.txt.pgp | UOB (SRS) |
| PCDPS.SHLD.SSBMAS.REDEMACK.SEQDISK.pgp | CDP (CASH) |

### 9.7 SSB Allotment Results (Outgoing)

| File | Destination |
|------|-------------|
| RT_MASSG.DBS.ABA.sb_dbs_ra1.txt.pgp | DBS (CASH) |
| RT_MASSG.DBS.ABA.sb_dbs_ra3.txt.pgp | DBS (SRS) |
| RT_MASSG.OCBCSSB.ABA.sb_ocbc_ra1.txt.pgp | OCBC (CASH) |
| RT_MASSG.OCBCSSB.ABA.sb_ocbc_ra3.txt.pgp | OCBC (SRS) |
| RT_MASSG.UOBSFTP.ABA.acosbapplres.txt.pgp | UOB (CASH) |
| RT_MASSG.UOBSFTP.ABA.srssbapplres.txt.pgp | UOB (SRS) |
| PCDPS.SHLD.SSBMAS.ALLOCATE.SEQDISK.pgp | CDP (CASH) |
| SSB_SRS_Allocation.pgp | CDP (SRS) |

### 9.8 SSB Redemption Results (Outgoing)

| File | Destination |
|------|-------------|
| RT_MASSG.DBS.ABA.sb_dbs_rr1.txt.pgp | DBS (CASH) |
| RT_MASSG.DBS.ABA.sb_dbs_rr3.txt.pgp | DBS (SRS) |
| RT_MASSG.OCBCSSB.ABA.sb_ocbc_rr1.txt.pgp | OCBC (CASH) |
| RT_MASSG.OCBCSSB.ABA.sb_ocbc_rr3.txt.pgp | OCBC (SRS) |
| RT_MASSG.UOBSFTP.ABA.acosbredmres.txt.pgp | UOB (CASH) |
| RT_MASSG.UOBSFTP.ABA.srssbredmres.txt.pgp | UOB (SRS) |
| PCDPS.SHLD.SSBMAS.REDEMEXP.SEQDISK.pgp | CDP (CASH) |
| SSB_SRS_RedemptionRej.pgp | CDP (SRS) |

### 9.9 SSB Holdings (Incoming)

| Account Type | Source | File |
|--------------|--------|------|
| CASH | CDP | sb_cdp_hol1.txt.pgp |
| SRS | DBS | sb_dbs_hol3.txt.pgp |
| SRS | OCBC | sb_ocbc_hol3.txt.pgp |
| SRS | UOB | sb_uob_hol3.txt.pgp |

### 9.10 SSB Holdings Acknowledgement (Outgoing)

| File | Destination |
|------|-------------|
| RT_MASSG.SGX.ABA.sb_cdp_ah1.txt.pgp | CDP (CASH) |
| RT_MASSG.DBS.ABA.sb_dbs_ah3.txt.pgp | DBS (SRS) |
| RT_MASSG.OCBCSSB.ABA.sb_ocbc_ah3.txt.pgp | OCBC (SRS) |
| RT_MASSG.UOBSFTP.ABA.srssbholdack.txt.pgp | UOB (SRS) |

### 9.11 SSB Coupon/Redemption Rate (Outgoing)

| File | Destination |
|------|-------------|
| RT_MASSG.UOBSFTP.ABA.sb_uob_cpn.txt.pgp | UOB |
| RT_MASSG.DBS.ABA.sb_dbs_cpn.txt.pgp | DBS |
| RT_MASSG.OCBCSSB.ABA.sb_ocbc_cpn.txt.pgp | OCBC |
| RT_MASSG.SGX.ABA.sb_cdp_cpn.txt.pgp | CDP |

### 9.12 SGS/T-Bills Subscription (Incoming)

| Account Type | Files |
|--------------|-------|
| CASH | ea_DBS_ap1.txt, ea_OCBC_ap1.txt, ea_UOB_ap1.txt |
| CPFIS | ea_DBS_ap2.txt, ea_OCBC_ap2.txt, ea_UOB_ap2.txt |
| SRS | ea_DBS_ap3.txt, ea_OCBC_ap3.txt, ea_UOB_ap3.txt |

### 9.13 SGS/T-Bills Subscription Acknowledgement (Outgoing)

| File | Destination |
|------|-------------|
| RT_MASSG.DBS.ABA.ea_dbs_aa1.txt.pgp | DBS (CASH) |
| RT_MASSG.DBS.ABA.ea_dbs_aa2.txt.pgp | DBS (CPFIS) |
| RT_MASSG.DBS.ABA.ea_dbs_aa3.txt.pgp | DBS (SRS) |
| RT_MASSG.OCBCSSB.ABA.ea_ocbc_aa1.txt.pgp | OCBC (CASH) |
| RT_MASSG.OCBCSSB.ABA.ea_ocbc_aa2.txt.pgp | OCBC (CPFIS) |
| RT_MASSG.OCBCSSB.ABA.ea_ocbc_aa3.txt.pgp | OCBC (SRS) |
| RT_MASSG.UOBSFTP.ABA.acoeaapplack.txt.pgp | UOB (CASH) |
| RT_MASSG.UOBSFTP.ABA.ea_uob_aa2.txt.pgp | UOB (CPFIS) |
| RT_MASSG.UOBSFTP.ABA.srseaapplack.txt.pgp | UOB (SRS) |

### 9.14 SGS/T-Bills Auction Results (Outgoing)

| File | Destination |
|------|-------------|
| RT_MASSG.DBS.ABA.ea_dbs_ra1.txt.pgp | DBS (CASH) |
| RT_MASSG.DBS.ABA.ea_dbs_ra2.txt.pgp | DBS (CPFIS) |
| RT_MASSG.DBS.ABA.ea_dbs_ra3.txt.pgp | DBS (SRS) |
| RT_MASSG.OCBCSSB.ABA.ea_ocbc_ra1.txt.pgp | OCBC (CASH) |
| RT_MASSG.OCBCSSB.ABA.ea_ocbc_ra2.txt.pgp | OCBC (CPFIS) |
| RT_MASSG.OCBCSSB.ABA.ea_ocbc_ra3.txt.pgp | OCBC (SRS) |
| RT_MASSG.UOBSFTP.ABA.acoeaapplres.txt.pgp | UOB (CASH) |
| RT_MASSG.UOBSFTP.ABA.ea_uob_ra2.txt.pgp | UOB (CPFIS) |
| RT_MASSG.UOBSFTP.ABA.srseaapplres.txt.pgp | UOB (SRS) |

**Reference**: MAS Interface with Banks and CDP v2.8

---

## 10. UOB-Specific File Naming

UOB uses different file naming conventions:

| Standard Pattern | UOB Pattern |
|------------------|-------------|
| sb_[bank]_ap1 | acosbappl |
| sb_[bank]_ap3 | srssbappl |
| sb_[bank]_aa1 | acosbapplack |
| sb_[bank]_aa3 | srssbapplack |
| sb_[bank]_ra1 | acosbapplres |
| sb_[bank]_ra3 | srssbapplres |
| sb_[bank]_rr1 | acosbredmres |
| sb_[bank]_rr3 | srssbredmres |
| sb_[bank]_ah3 | srssbholdack |
| sb_[bank]_cal | acosbissuecal |
| ea_[bank]_ap1 | acoeaappl |
| ea_[bank]_aa1 | acoeaapplack |
| ea_[bank]_ra1 | acoeaapplres |
| ea_[bank]_cal | acoeaicfbt |

---

## 11. MEFT Routing Prefixes

Files transmitted via MEFT use routing prefixes:
- **RT_MASSG.DBS.ABA.** - DBS routing
- **RT_MASSG.OCBCSSB.ABA.** - OCBC routing
- **RT_MASSG.UOBSFTP.ABA.** - UOB routing
- **RT_MASSG.SGX.ABA.** - SGX/CDP routing
- **PCDPS.SHLD.SSBMAS.** - CDP direct

---

## 12. Special Operations

### 12.1 Closing Price Unlock
**Purpose**: Unlock the status of closing prices to allow users to regenerate and send updated closing prices to MEPS+

### 12.2 ERF Operations
**Files**:
- erf_bids.txt / fmbs_erf.txt
- erf_agg_bids.csv / fmbs_erf_agg_bids.csv

### 12.3 SSB Allotment Processing
Process allotment for new issue. Generates:
- Detailed result files to banks and CDP
- Aggregate result file to MEPS+

### 12.4 SSB Redemption Processing
Process redemption submissions for current cycle. Generates:
- Reports
- Detailed result files for banks and CDP
- Aggregate result file for MEPS+

---

## 13. Reference Documents

| Document | Coverage |
|----------|----------|
| MEPS+ Interface Specifications - eApps v1.23 | MEPS+ interfaces |
| FMBS_Interface_Spec.docx | FMBS interfaces |
| AMMO_Interface_Spec.docx | AMMO interfaces |
| MERIT_Interface_Spec.docx | MERIT interfaces |
| MEPS+_Sora_File_Spec.docx | SORA interfaces |
| MAS Interface with Banks and CDP v2.8 | FI/CDP interfaces |
| ERF Interface Specification - ERF to AGD v0.2.docx | AGD ERF interfaces |

---

## 14. Sample File Locations

Sample files are available at:
- Subscriptions (SSB): `https://team.dms.mas.gov.sg/.../Sample Files/Subscriptions/SBA`
- Subscriptions (SGS/T-Bills): `https://team.dms.mas.gov.sg/.../Sample Files/Subscriptions/SGS-Bonds and T-Bills`
- Issuance Calendar: `https://team.dms.mas.gov.sg/.../Sample Files/IssuanceCalendar`
- Holdings: `https://team.dms.mas.gov.sg/.../Sample Files/Holdings`
- Redemption: `https://team.dms.mas.gov.sg/.../Sample Files/Redemption`
- Redemption Process: `https://team.dms.mas.gov.sg/.../Sample Files/RedemptionProcess`
- Coupon/Redemptions: `https://team.dms.mas.gov.sg/.../Sample Files/CouponRedemptions`
- Allotment Results: `https://team.dms.mas.gov.sg/.../Sample Files/AllotmentResult`
- Auction Results: `https://team.dms.mas.gov.sg/.../Sample Files/SGS_AuctionResult`
- AGD: `https://team.dms.mas.gov.sg/.../AGD (WIP)/Sample Files`

---

## 15. Additional BAU Operations

### 15.1 Letter Generation to AGD

| Letter Type | Trigger | Notes |
|-------------|---------|-------|
| T-Bills | Auction day or Coupon X date + 1 | 1 Issuance + 1 Redemption of T-Bills |
| SGS | MEPS+ SGS System Redemption | Double verification on Interest Paid field required (cent accurate) |
| SSB | SSB operations | Not down to cents |

### 15.2 ERF Reporting to AGD

**Daily ERF Issuance**: Monthly at start of new month
- Source: IRIS → Prewritten script → Massage data → Wit → Daily ERF Issuance

**ERF Balance**: From MEPS+ (on-demand)
- Total ERF Issue
- Redemption (first BD)
- Net ERF Issuance

**Reference**: ERF AGD User Manual, Condensed User Guide - ERF reports to AGD
