# OMEGA Process Flows Overview

> **Document Type:** Process Flow Summary
> **Source Files:** Flow chart PDFs (1-4)
> **System:** OMEGA System Process Design

---

## 1. Process Flow Legend

| Visual Element | Meaning |
|----------------|---------|
| Solid Blue Background | Automated process |
| White Background | Human actions with OMEGA |
| Solid Orange Background | Other human actions (outside OMEGA) |
| Diamond Shape | Checks by platform (validation) |
| Diamond with border | Checks by human (approval) |

---

## 2. Process Flow 1: Issuance Calendar

### 2.1 Overview
The Issuance Calendar process handles the creation, approval, and publication of the securities issuance schedule.

### 2.2 Process Steps

```
START
  │
  ▼
┌─────────────────────────────────────┐
│ Auto: Populate issuance calendar    │
│ based on predetermined logic,       │
│ validations, and public holidays    │
└─────────────────────────────────────┘
  │
  ▼
◇ Is manual update required?
  │
  ├─ YES → Allow manual update of calendar
  │
  └─ NO ───┐
           │
           ▼
┌─────────────────────────────────────┐
│ Save as draft                       │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ MDD Ops: Download file with         │
│ securities requiring SGX ISINs      │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ MDD Ops: Send/receive file          │
│ from SGX with ISINs                 │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ MDD Ops: Upload file from SGX       │
│ to update security details          │
└─────────────────────────────────────┘
  │
  ▼
◇ Pass validation checks? ──NO──→ [Fix issues]
  │
  YES
  │
  ▼
◇ Approve? ──NO──→ Approver rejects with comments
  │
  YES
  │
  ▼
┌─────────────────────────────────────┐
│ Auto: Publish issuance calendar     │
│ and footnote to MAS website         │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Auto: Store in database,            │
│ generate reports                    │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Auto: Send email to internal users, │
│ system notifications to FIs         │
└─────────────────────────────────────┘
  │
  ▼
◇ Is edit required?
  │
  ├─ YES → Edit cycle (MDD edits → validation → approval)
  │
  └─ NO → STOP
```

### 2.3 Key Features
- **Auto-population:** Calendar populated based on predetermined logic and public holidays
- **Manual override:** Allowed for specific security types (MAS Bills, T-Bills, Savings Bonds)
- **SGX ISIN Integration:** MDD Ops coordinates with SGX for ISIN codes
- **Dual validation:** Platform validation + human approval
- **Publication:** Automatic to MAS website
- **Notifications:** Email to internal users + system notifications to FIs

---

## 3. Process Flow 2: Announcement

### 3.1 Overview
The Announcement process handles the publication of securities offering details on announcement day.

### 3.2 Process Steps

```
START
  │
  ▼
┌─────────────────────────────────────┐
│ Auto: Send email alert at 8 AM      │
│ to FD & MDD about announcement      │
│ securities and timings              │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Auto: Enable form for MDD to enter  │
│ issuance sizes & allotment details  │
│ (with defaults e.g. SSB coupon)     │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ MDD: Enter issuance sizes &         │
│ allotment details (e.g. allotment   │
│ window, coupon rates)               │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Auto: Send notification & email     │
│ reminder to approvers               │
└─────────────────────────────────────┘
  │
  ▼
◇ Approve? ──NO──→ Approver rejects with comments
  │
  YES
  │
  ▼
┌─────────────────────────────────────┐
│ Auto: Send details to FD for        │
│ securities creation in MEPS+        │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ FD: Create security in MEPS+        │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Auto: Security details sent by      │
│ MEPS+ to OMEGA                      │
└─────────────────────────────────────┘
  │
  ▼
◇ Pass validation checks?
  │
  YES
  │
  ▼
◇ Is it SGS Bonds?
  │
  ├─ YES → ◇ Issued via Auction?
  │         │
  │         ├─ NO → Syndication retail bid collation
  │         │
  │         └─ YES ───┐
  │                   │
  └─ NO ──────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│ Auto: At announcement publication   │
│ time, publish to MAS website        │
└─────────────────────────────────────┘
  │
  ▼
→ Flows to Bid Collation
```

### 3.3 Key Features
- **Morning alert:** 8 AM email to FD & MDD
- **Pre-populated forms:** Default/computed values (e.g., SSB coupon rates)
- **MEPS+ Integration:** Securities created in MEPS+ and synced back to OMEGA
- **Branching logic:** Different paths for SGS Bonds (auction vs syndication)

---

## 4. Process Flow 3: Bid Submission/Collation

### 4.1 Overview
Handles the collection and compilation of bids from various sources.

### 4.2 Bid Sources

| Source | Bid Types |
|--------|-----------|
| Banks | Retail & institutional bid submission, amendments, withdrawals |
| MAS Users | Bid submission on behalf of MAS, amendments, withdrawals |
| MAS Auction Operator | Bid submission on behalf of PDs (contingency), amendments, withdrawals |

### 4.3 Process Steps

```
START
  │
  ├─────────────────────────────────────────────────┐
  │                                                 │
  ▼                                                 ▼
┌──────────────────┐                    ┌──────────────────┐
│ Banks: Retail &  │                    │ MAS Users: Bid   │
│ institutional    │                    │ on behalf of MAS │
│ bid submission   │                    │                  │
└──────────────────┘                    └──────────────────┘
  │                                                 │
  │                                                 │
  ├──────────────────────┬──────────────────────────┘
  │                      │
  ▼                      ▼
◇ Approve?          ◇ Approve?
  │                      │
  YES                   YES
  │                      │
  └──────────┬───────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Auto: Compile the bids              │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Display: Total submitted bids       │
│ vs minimum required bid             │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ View the bids submitted             │
└─────────────────────────────────────┘
  │
  ▼
◇ All banks have submitted?
  │
  ├─ YES → Flows to Allotment
  │
  └─ NO → ◇ Should closing time be extended?
           │
           ├─ NO → [Wait]
           │
           └─ YES → Extend bid submission closing time
                    │
                    ▼
                    ◇ Approve? → [If YES, time extended]
```

### 4.4 Key Features
- **Multiple bid sources:** Banks, MAS users, auction operators (contingency)
- **Real-time compilation:** System compiles bids automatically
- **Dashboard:** Shows total submitted vs minimum required
- **Time extension:** Option to extend closing time if not all banks submitted
- **Approval workflow:** All submissions require approval

---

## 5. Process Flow 4: Allotment Day

### 5.1 Overview
Handles the allotment process including safeguard mechanisms and result publication.

### 5.2 Process Steps

```
START
  │
  ▼
┌─────────────────────────────────────┐
│ Auto: Send email alert at 8 AM      │
│ on allotment securities & timings   │
└─────────────────────────────────────┘
  │
  ▼
◇ Is it SGS Bonds?
  │
  ├─ NO ──────────────────────────────────────┐
  │                                           │
  └─ YES → ◇ Issued via Auction?              │
            │                                 │
            ├─ NO → Syndication retail        │
            │       allotment                 │
            │                                 │
            └─ YES ───────────────────────────┘
                        │
                        ▼
◇ Does safeguard option need to be turned off?
  │
  ├─ NO ───┐
  │        │
  └─ YES ──┘
           │
           ▼
┌─────────────────────────────────────┐
│ MAS: Set/submit auction safeguard   │
│ parameters, upload documents        │
└─────────────────────────────────────┘
  │
  ▼
◇ Approve by MDD div heads?
  │
  YES
  │
  ▼
┌─────────────────────────────────────┐
│ Auto: Take in upper bound, lower    │
│ bound, MAS Max automatically        │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Auto: Trigger allotment at          │
│ cut-off time                        │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ ALLOTMENT (including safeguard)     │
└─────────────────────────────────────┘
  │
  ▼
◇ Is it SSB?
  │
  ├─ YES → [SSB specific allotment]
  │
  └─ NO → ◇ Underbidding?
           │
           ├─ YES → Alert + Auto compute underbidded
           │        amount/yield, insert comp bid
           │
           └─ NO → ◇ Safeguard triggered?
                    │
                    ├─ YES → Alert + Trigger re-allotment
                    │
                    └─ NO → Alert: Allotment completed
```

### 5.3 Post-Allotment Steps

```
┌─────────────────────────────────────┐
│ Auto: Validation checks, warnings,  │
│ notifications (underbidding,        │
│ safeguard activation)               │
└─────────────────────────────────────┘
  │
  ▼
◇ Is there a warning or notification?
  │
  ├─ YES → FD needs MDD involvement before review
  │
  └─ NO ───┐
           │
           ▼
◇ Is retrigger required?
  │
  ├─ YES → [Re-run allotment]
  │
  └─ NO ───┐
           │
           ▼
┌─────────────────────────────────────┐
│ FD: Complete review                 │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Auto: At results publication time,  │
│ send email alert - results released │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Auto: Send results to banks,        │
│ FMBS, MEPS+, publish on MAS website │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Report generation                   │
└─────────────────────────────────────┘
  │
  ▼
STOP
```

### 5.4 Allotment Methods (Notes)

1. **Uniform pricing method** - Standard auction allotment
2. **Quantity ceiling method for SSB** - SSB-specific allocation
3. **Syndication quantity ceiling** - For retail syndicated bonds

### 5.5 Safeguard Features

- Automatically pro-rate MAS bids if auction is too strong
- Upper/lower bounds configuration
- MAS Max limits
- Safeguard activation triggers re-allotment

### 5.6 Reports Generated

- Allotment/auction details
- Settlement details
- Underbidding details
- Comparison with previous allotments (adjustable date range)
- NRIC-based bid reports (for COI checks - internal MAS use)

---

## 6. Key Integrations

| System | Integration Purpose |
|--------|---------------------|
| MEPS+ | Security creation, auction results |
| FMBS | Auction results, settlement |
| MAS Website | Issuance calendar, announcements, results publication |
| SGX | ISIN codes for new securities |
| Banks | Bid submission, results download |

---

## 7. Approval Workflow Summary

| Process | Approval Required |
|---------|-------------------|
| Issuance Calendar | MDD approval for publication |
| Announcement | Approval before sending to MEPS+ |
| Bid Submission | Approval for each bid type |
| Time Extension | Approval for closing time extension |
| Safeguard Parameters | MDD division heads approval |
