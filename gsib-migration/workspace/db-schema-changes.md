# DB Schema Changes — Pending Application

This file tracks schema changes that need to be applied to the **actual production OMEGA database** (separate from the dm-tool workspace.db, which is updated via the helper scripts).

**Statuses:**
- ⏳ **Pending** — change identified, not yet applied to actual DB
- 🟡 **Applied to dm-tool workspace.db only** — change reflected in JSON dict + dm-tool DB; not yet in production
- ✅ **Applied to production** — change live in OMEGA prod schema

---

## Change Log

### Change #1: Drop `submission_type`; consolidate into `user_action`

**Status:** ⏳ Pending

**Rationale:** All tables that currently distinguish a "submission_type" should reuse the existing `user_action` column instead. Submission lifecycle is logically equivalent to user-action workflow — keep one column, not two. The `APTSUBTYPE` master code category is no longer relevant.

**Affected tables (4):**

| Table | Has `submission_type`? | Has `user_action`? | Action |
|---|---|---|---|
| `cm.cm_applicant_submission_group` (master) | ✅ | ✅ | **Drop `submission_type`** column. Existing data should be migrated into `user_action` if not already present. |
| `iss.cm_applicant_submission_group_t` (audit) | ✅ | ✅ | **Drop `submission_type`** column. Same migration logic. |
| `iss.iss_bid_submission_group` (master) | ✅ | ❌ | **Add `user_action` column (VARCHAR(50))**, migrate existing `submission_type` values into it, then **drop `submission_type`**. |
| `iss.iss_bid_submission_group_t` (audit) | ✅ | ❌ | Same as above — add `user_action`, migrate, drop `submission_type`. |

**Note on `_t` tables:** Most `_t` audit tables across the dict already have `user_action` (12 of 13 _t tables that hold workflow records). Only `iss.iss_bid_submission_group_t` is missing — it will be added as part of this change.

**Pending — `user_action` values from user:**

> ⏳ User will provide the canonical `user_action` master code values that should replace the existing `submission_type` values. The values currently in `submission_type` (raw `'New'/'Amendment'/'Deletion'` or DDL-seeded `APTSUBTYPE_*`) need a 1:1 mapping to the target `USERACT_*` values.

**SQL (Postgres template — finalize once mapping confirmed):**

```sql
-- Step 1: Add user_action column where missing
ALTER TABLE iss.iss_bid_submission_group ADD COLUMN user_action VARCHAR(50);
ALTER TABLE iss.iss_bid_submission_group_t ADD COLUMN user_action VARCHAR(50);

-- Step 2: Migrate submission_type values into user_action (mapping TBC by user)
UPDATE iss.iss_bid_submission_group
SET user_action = CASE submission_type
  WHEN '<existing_value_1>' THEN 'USERACT_???'   -- TBC
  WHEN '<existing_value_2>' THEN 'USERACT_???'   -- TBC
  WHEN '<existing_value_3>' THEN 'USERACT_???'   -- TBC
END
WHERE submission_type IS NOT NULL;

-- Repeat for the other 3 tables, with same CASE mapping
-- (cm.cm_applicant_submission_group + _t may not need this step
--  if user_action already holds the canonical values there)

-- Step 3: Drop submission_type from all 4 tables
ALTER TABLE cm.cm_applicant_submission_group DROP COLUMN submission_type;
ALTER TABLE iss.cm_applicant_submission_group_t DROP COLUMN submission_type;
ALTER TABLE iss.iss_bid_submission_group DROP COLUMN submission_type;
ALTER TABLE iss.iss_bid_submission_group_t DROP COLUMN submission_type;
```

**Dictionary updates needed (sync after schema change applied):**
- Remove `submission_type` key from JSON dict for the 4 tables
- For `iss.iss_bid_submission_group` and `_t`: add `user_action` field with confirmed `USERACT_*` master code values (matching the same explanation pattern used by other tables' `user_action`)
- Update dm-tool workspace.db: `columns` table + `script_versions.content` compressed DDL

**Tracker hygiene:**
- The current `iss.iss_bid_submission_group.submission_type` dict entry references master code `APTSUBTYPE` — that reference is now obsolete and will be removed when this change is applied.
- `APTSUBTYPE` category itself remains seeded in OMEGA; future use would be the OMEGA team's call.

---

### Change #2: Drop `role_group` from `iss.iss_bid_retail` and `iss.iss_bid_retail_t`

**Status:** 🟡 Applied to dm-tool workspace.db only (production not yet)

**Rationale:** `role_group` access-control segregation is not needed for retail bids — retail uses a single `EXT_RT_MKR` / `EXT_RT_VWR` role pair without sub-groups. The column adds unused complexity.

**Affected tables:**
- `iss.iss_bid_retail` (master) — `role_group VARCHAR(50)` dropped
- `iss.iss_bid_retail_t` (audit) — `role_group VARCHAR(50)` dropped

**Done in dm-tool workspace.db (2026-05-05):**
- ✅ Removed from JSON dict (both tables)
- ✅ Deleted from `columns` table (cid=115408, cid=115452)
- ✅ Removed from `script_versions.content` compressed DDL (DDL went 186,414 → 186,358 chars)

**SQL to apply on production OMEGA database:**

```sql
ALTER TABLE iss.iss_bid_retail DROP COLUMN role_group;
ALTER TABLE iss.iss_bid_retail_t DROP COLUMN role_group;
```

---

### Change #3: `iss.iss_bid_institutional.role_group` semantics — store group number, not full role code

**Status:** 🟡 Applied to dm-tool workspace.db only (dictionary updated; production schema unchanged — column type stays `VARCHAR(50)`)

**Rationale:** The institutional `role_group` should hold the group number (`'1'`, `'2'`, or `'3'`) corresponding to the 3 institutional bid groups, NOT the full KAIZEN role code (e.g. not `'EXT_INST_MKR_1'`). The role code prefix carries the maker/viewer distinction; the group number is what segregates bid visibility.

**Affected:**
- `iss.iss_bid_institutional.role_group` — explanation + pv updated in JSON to reflect `'1' / '2' / '3'`
- `iss.iss_bid_institutional_t.role_group` — same semantic applies (inherited via `_t` standard pattern)

**No DB schema change required** — column type remains `VARCHAR(50)` (loose for now). Could be tightened to `VARCHAR(1)` or `NUMERIC(1,0)` in production if desired:

```sql
-- Optional tightening (only if production data confirmed to be 1/2/3 only):
-- ALTER TABLE iss.iss_bid_institutional ALTER COLUMN role_group TYPE VARCHAR(1);
-- ALTER TABLE iss.iss_bid_institutional_t ALTER COLUMN role_group TYPE VARCHAR(1);
```

**Production data verification needed:** confirm existing `role_group` rows store `'1'/'2'/'3'` (not full role codes). If they store full codes, a data migration would be needed:
```sql
-- Example mapping (TBC):
UPDATE iss.iss_bid_institutional
SET role_group = CASE
  WHEN role_group LIKE '%_1' THEN '1'
  WHEN role_group LIKE '%_2' THEN '2'
  WHEN role_group LIKE '%_3' THEN '3'
END
WHERE role_group IS NOT NULL;
```

---

## How to use this file

1. When a schema change is identified during dict review, add a new entry following the Change #N pattern above.
2. Mark status as ⏳ until applied.
3. When user confirms ready to apply: run the SQL on the actual DB, then update the JSON dict + dm-tool workspace.db, then mark ✅.
4. Keep this file as the audit trail of all production schema deltas driven by the data-dict review process.

### Change #4: Remove `SECTYPE_FRN` master code (FRN no longer applicable)

**Status:** 🟡 Applied to JSON dict only (production seed not yet)

**Rationale:** Floating Rate Notes (FRN) are no longer in scope for OMEGA. The `SECTYPE_FRN` master code value should be removed from the seed and any references in the dict.

**Done in dict (2026-05-06):**
- ✅ Removed `'SECTYPE_FRN'` from `iss.iss_calendar_listing.security_type` pv list

**SQL to apply on production OMEGA database:**

```sql
-- Verify no production data references SECTYPE_FRN before deleting
SELECT 'iss_calendar_listing' AS tbl, COUNT(*) AS rows_with_frn
  FROM iss.iss_calendar_listing WHERE security_type = 'SECTYPE_FRN'
UNION ALL
SELECT 'iss_security_master', COUNT(*)
  FROM iss.iss_security_master WHERE security_type = 'SECTYPE_FRN';

-- If counts are zero, soft-delete the master code:
UPDATE cm.cm_master_code
   SET is_deleted = 'Y', status = 'CMSTAT_INACTIVE',
       updated_dt = CURRENT_TIMESTAMP, updated_by = 'SYSTEM'
 WHERE master_code_key = 'SECTYPE_FRN';

-- (Or hard-delete if no historical references at all):
-- DELETE FROM cm.cm_master_code WHERE master_code_key = 'SECTYPE_FRN';
```

---

### Change #5: Drop `submission_type` (consolidates with `user_action`) — see Change #1

(Same as Change #1 — kept for cross-reference)

---

### Change #6: Rename FK columns to follow `_uuid` convention

**Status:** 🟡 Applied to dm-tool workspace.db only (production not yet)

**Rationale:** Foreign key columns in OMEGA convention end in `_uuid` (matching the target table's UUID column). Two columns in `iss.iss_auction_safeguard` (and its `_t`) violated the convention with `_id` suffixes.

**Affected tables (2):**
- `iss.iss_auction_safeguard`
- `iss.iss_auction_safeguard_t`

**Renames:**
| From | To | FK target |
|---|---|---|
| `iss_issuance_id` | `iss_issuance_uuid` | `iss.iss_issuance.uuid` |
| `cmdoc_ref_id` | `cm_documents_uuid` | `cm.cm_documents.uuid` |

**Done in dm-tool workspace.db (2026-05-06):**
- ✅ Renamed in JSON dict (4 column entries)
- ✅ Renamed in `columns` table (cid=115277, 115284, 115300, 115307)
- ✅ Renamed in `script_versions.content` compressed DDL (length 186,358 → 186,372)

**SQL to apply on production OMEGA database:**

```sql
ALTER TABLE iss.iss_auction_safeguard RENAME COLUMN iss_issuance_id TO iss_issuance_uuid;
ALTER TABLE iss.iss_auction_safeguard RENAME COLUMN cmdoc_ref_id TO cm_documents_uuid;
ALTER TABLE iss.iss_auction_safeguard_t RENAME COLUMN iss_issuance_id TO iss_issuance_uuid;
ALTER TABLE iss.iss_auction_safeguard_t RENAME COLUMN cmdoc_ref_id TO cm_documents_uuid;
```

**Note:** `cm.cm_batch_job_detail.ref_id` and `cm.cm_batch_job_detail_t.ref_id` are intentionally left as `_id` because they are polymorphic FKs (target table indicated by companion `ref_table` column). Not a typed FK to a single table, so the convention doesn't apply.

---

### Change #7: Standardize `iss.iss_auction_safeguard` MAS amount columns to `NUMERIC(13,0)`

**Status:** ⏳ Pending (not yet applied to dm-tool DB or production)

**Rationale:** Three columns in `iss.iss_auction_safeguard` are `NUMERIC(20,0)` — out of step with all other OMEGA MAS amount columns which are `NUMERIC(13,0)`. NB confirmed via FSD that this is a schema inconsistency, not a deliberate choice for extreme upper bounds.

**FSD evidence:**
- Allotment FSD §2.6 (Non-Functional Requirement): system max issuance size = `S$9,999,999,999,999` (13 digits, aligned with MEPS+ secmast.txt)
- Allotment FSD §2.7.6.4: UI input field for these amounts has `Max Length: 13`
- Surrounding tables consistent: `cm.cm_sectype_params.default_mas_a_amount` (13,0); `cm.cm_sectype_params.mas_max_notional` (13,0); `iss.iss_auction_run.mas_noncomp_alloted_amt_a/b/c` (13,0); `iss.iss_announcement_details.mas_intended_tender_amt` (13,0); `iss.iss_issuance.mas_amount_allotted` (13,0)

**Affected columns (3 columns × 2 tables = 6 changes):**
| Table | Column | From | To |
|---|---|---|---|
| `iss.iss_auction_safeguard` | `mas_a_amt` | NUMERIC(20,0) | NUMERIC(13,0) |
| `iss.iss_auction_safeguard` | `mas_b_amt` | NUMERIC(20,0) | NUMERIC(13,0) |
| `iss.iss_auction_safeguard` | `mas_max_amt` | NUMERIC(20,0) | NUMERIC(13,0) |
| `iss.iss_auction_safeguard_t` | `mas_a_amt` | NUMERIC(20,0) | NUMERIC(13,0) |
| `iss.iss_auction_safeguard_t` | `mas_b_amt` | NUMERIC(20,0) | NUMERIC(13,0) |
| `iss.iss_auction_safeguard_t` | `mas_max_amt` | NUMERIC(20,0) | NUMERIC(13,0) |

**SQL to apply on production OMEGA database:**

```sql
-- Pre-check: confirm no existing rows exceed NUMERIC(13,0) range (i.e. >= 10^13)
SELECT COUNT(*) AS rows_exceeding_13_digits
  FROM iss.iss_auction_safeguard
 WHERE mas_a_amt   >= 10000000000000
    OR mas_b_amt   >= 10000000000000
    OR mas_max_amt >= 10000000000000;

-- If zero, apply alterations:
ALTER TABLE iss.iss_auction_safeguard   ALTER COLUMN mas_a_amt   TYPE NUMERIC(13,0);
ALTER TABLE iss.iss_auction_safeguard   ALTER COLUMN mas_b_amt   TYPE NUMERIC(13,0);
ALTER TABLE iss.iss_auction_safeguard   ALTER COLUMN mas_max_amt TYPE NUMERIC(13,0);
ALTER TABLE iss.iss_auction_safeguard_t ALTER COLUMN mas_a_amt   TYPE NUMERIC(13,0);
ALTER TABLE iss.iss_auction_safeguard_t ALTER COLUMN mas_b_amt   TYPE NUMERIC(13,0);
ALTER TABLE iss.iss_auction_safeguard_t ALTER COLUMN mas_max_amt TYPE NUMERIC(13,0);
```

**Field semantics (FSD §2.7.6.4) — also updated in dict explanations:**
- `mas_a_amt` — min non-comp amount MAS subscribes to (not reduced in strong auction; pro-rated only when overall non-comp limit hit)
- `mas_b_amt` — additional non-comp buffer (reduced in strong auction; typically MMO repo amount)
- `mas_max_amt` — absolute ceiling computed as `(min of MAS max-notional or MAS max-% × issue size) + MAS-A + MAS-B`

---

### Change #8: Drop `nric_hash` from `cm.cm_user_tbl` and `_t`

**Status:** 🟡 Applied to dm-tool workspace.db only (production not yet)

**Rationale:** NB confirmed FSD is silent on this column's purpose. KAIZEN external-user login from Corppass returns the raw NRIC ID (e.g. `S1234567A`); FSD does not document writing it as a hash. Likely an unused/legacy column.

**Affected tables:**
- `cm.cm_user_tbl` — `nric_hash VARCHAR(255)` dropped
- `cm.cm_user_tbl_t` — same (audit mirror)

**Done in dm-tool workspace.db (2026-05-06):**
- ✅ Removed from JSON dict
- ✅ Deleted from `columns` table (cid=115028, 115047)
- ✅ Removed from `script_versions.content` compressed DDL (186,372 → 186,316 chars)

**SQL to apply on production OMEGA database:**

```sql
-- Pre-check (verify column exists, no critical data being lost)
SELECT COUNT(*) AS rows_with_hash
  FROM cm.cm_user_tbl WHERE nric_hash IS NOT NULL;

-- Drop column
ALTER TABLE cm.cm_user_tbl DROP COLUMN nric_hash;
ALTER TABLE cm.cm_user_tbl_t DROP COLUMN nric_hash;
```

**Caveat before applying to production:** verify no application code references nric_hash (search prompt provided in conversation context). If found, do NOT drop — investigate first.

---

_Last updated: 2026-05-06 — Added Change #8 (drop nric_hash from cm_user_tbl + _t)._


---

### Change #9: Rename coupon-frequency columns to `coupon_payment_frequency`

**Status:** 🟡 Applied to dm-tool workspace.db only (production not yet)

**Rationale:** Two columns store coupon payment frequency under different names. Standardize on `coupon_payment_frequency` (full word, consistent across both tables).

**Affected columns:**
- `cm.cm_sectype_params.coupon_payment_freq` → `coupon_payment_frequency`
- `iss.iss_security_master.coupon_pay_frequency` → `coupon_payment_frequency`

Both fields use the `CPNFREQ` master code (added to seed 2026-05-07).

**SQL:**

```sql
ALTER TABLE cm.cm_sectype_params RENAME COLUMN coupon_payment_freq TO coupon_payment_frequency;
ALTER TABLE iss.iss_security_master RENAME COLUMN coupon_pay_frequency TO coupon_payment_frequency;
```

**Already applied to dm-tool layer (2026-05-07):**
- JSON dict: `omega-ddl-current.dict.json` — both keys renamed (master + `_t` audit pairs)
- dm-tool DB `columns` table — all 4 rows updated (2 master + 2 `_t`)
- `script_versions.content` compressed DDL — all 4 column declarations renamed

**Helper scripts:** `.tmp-rename-cpnfreq.cjs` (master pair), `.tmp-fix-t-style.cjs` (`_t` pair propagation)

**Production SQL also needs:**

```sql
ALTER TABLE cm.cm_sectype_params_t RENAME COLUMN coupon_payment_freq TO coupon_payment_frequency;
ALTER TABLE iss.iss_security_master_t RENAME COLUMN coupon_pay_frequency TO coupon_payment_frequency;
``` 