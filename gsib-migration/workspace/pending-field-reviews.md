# Pending Field-Level Review Follow-Ups

Tables that have been **flipped to `reviewed: true`** at table level, but where specific fields still need follow-up review (typically waiting on NB clarification or external confirmation).

---

## Open follow-ups

| Table | Field(s) | Reason | Logged |
|---|---|---|---|
| `iss.iss_auction_run` + `iss.iss_issuance` | `closing_price` | Field is duplicated across both tables with identical explanation ("Clean cut-off price = dirty cut-off − accrued interest"). Need FSD verification: (1) where closing_price is actually computed/stored — auction_run vs issuance — and (2) whether the duplicate is legacy/redundant or intentional. NB query pending. | 2026-05-07 |

## Resolved

| Table | Field | Resolution | Resolved |
|---|---|---|---|
| `iss.iss_sb_subscription` | `record_status` | NB confirmed: needed; mapped to outgoing SSB Result files (sb_*_ra1.txt CASH / sb_*_ra3.txt SRS) as 'P'/'I'/'F'. Updated explanation. | 2026-05-06 |
| `iss.iss_announcement_details` | MEPS+ verification fields | NB returned verbatim FSD mapping table (Section 5). Reconciled: added `tenor` and `first_coupon_payment_dt` (were missing). 12 → 14 fields now flagged. Step-up coupon rates handled in `iss.iss_announcement_stepup_rates` (separate table) via `couponrates_sbond.txt`. | 2026-05-06 |
| `iss.iss_auction_safeguard` | `status` | NB confirmed: FSD Allotment §2.4/2.7.5.3/2.8/2.10 documents 3 states only — Pending Configuration, Pending Approval, Configured. Rejection reverts to previous state (no separate REJECTED state). Updated pv to 3 values: `SFGDSTAT_PENDING_CONFIG`, `SFGDSTAT_PENDING_APPROVAL`, `SFGDSTAT_CONFIGURED`. SFGDSTAT category prefix still inferred (not in seed) — logged in missing-master-codes.md. | 2026-05-06 |

---

## How to use this file

1. When a table is mostly-reviewed but a specific field is still pending → add a row here, flip the table's `reviewed: true`.
2. Once the field clarification lands → resolve here, mark the field as updated in the dict, and remove the row.
3. Avoids losing track of "small" follow-ups when bulk reviewing.

_Last updated: 2026-05-06 — initial entry: iss.iss_sb_subscription.record_status pending NB._
