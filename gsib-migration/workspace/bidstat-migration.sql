-- ============================================================================
-- BIDSTAT master code introduction + bid_status/record_status migration
-- ============================================================================
-- Adds new master code category 'BIDSTAT' (Bid Outcome Status) with 4 values.
-- Applied to:
--   iss.iss_bid_retail.bid_status
--   iss.iss_bid_institutional.bid_status
--   iss.iss_sb_subscription.record_status
--
-- iss.iss_sb_redemption.record_status remains on existing RECSTAT category
-- (P / F — Pass / Fail) — no change.
--
-- Run order:
--   1. Insert new category + values
--   2. (Optional) Migrate existing data from RECSTAT_* to BIDSTAT_*
--   3. Code/UI changes happen in application layer (not SQL)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- STEP 1: New category 'BIDSTAT'
-- (Replace UUIDs with newly generated ones — values shown are placeholders)
-- ----------------------------------------------------------------------------
INSERT INTO cm.cm_master_code_category
    (id, uuid, category_description, is_editable, cate_code,
     version, is_deleted, is_migrated, created_dt, created_by, updated_dt, updated_by)
VALUES
    (150000000000062,            -- TODO: confirm next available id
     gen_random_uuid(),           -- new uuid
     'Bid Outcome Status',
     'Y',
     'BIDSTAT',
     1, 'N', 'N',
     CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM');

-- ----------------------------------------------------------------------------
-- STEP 2: 4 master code values for BIDSTAT
-- (cate uuid will be the one inserted above — set via SELECT below)
-- ----------------------------------------------------------------------------
WITH cate AS (
    SELECT uuid AS cate_uuid FROM cm.cm_master_code_category WHERE cate_code = 'BIDSTAT'
)
INSERT INTO cm.cm_master_code
    (id, uuid, master_code_key, mastercode_category_uuid, code_value, code_description,
     filter_value, sequence_no, remarks, status,
     effective_from, effective_to, version, is_editable, is_centrally_managed,
     is_deleted, is_migrated, created_dt, created_by, updated_dt, updated_by)
SELECT
    150000000000800 + rn,        -- TODO: confirm starting id range
    gen_random_uuid(),
    mkey,
    (SELECT cate_uuid FROM cate),
    cval,
    cdesc,
    NULL,
    seq,
    NULL,
    'CMSTAT_ACTIVE',
    CURRENT_TIMESTAMP, NULL, 1, 'Y', 'N',
    'N', 'N', CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM'
FROM (VALUES
    (1, 'BIDSTAT_COMPLETED', 'COMPLETED', 'Completed (fully or partially allotted)', 10),
    (2, 'BIDSTAT_LE',        'LE',        'Limit Exceeded',                          20),
    (3, 'BIDSTAT_OS',        'OS',        'Oversubscribed',                          30),
    (4, 'BIDSTAT_PA',        'PA',        'Partially Accepted',                      40)
) AS v(rn, mkey, cval, cdesc, seq);

-- ----------------------------------------------------------------------------
-- STEP 3 (OPTIONAL): Migrate existing RECSTAT_* values in the 3 tables
-- ----------------------------------------------------------------------------
-- Mapping logic (review before running):
--   RECSTAT_FULLY_ALLOTED   -> BIDSTAT_COMPLETED
--   RECSTAT_PARTIAL_ALLOTED -> BIDSTAT_COMPLETED  (per user: COMPLETED covers both fully + partially allotted)
--   RECSTAT_FAIL + bid_error_desc='RECERR_LE'    -> BIDSTAT_LE
--   RECSTAT_FAIL + bid_error_desc='RECERR_OS'    -> BIDSTAT_OS
--   RECSTAT_FAIL + bid_error_desc IS NULL/other  -> BIDSTAT_LE   -- TBD default
-- ----------------------------------------------------------------------------

-- iss.iss_bid_retail.bid_status
UPDATE iss.iss_bid_retail
   SET bid_status = CASE
       WHEN bid_status IN ('RECSTAT_FULLY_ALLOTED', 'RECSTAT_PARTIAL_ALLOTED', 'F', 'P') THEN 'BIDSTAT_COMPLETED'
       WHEN bid_status IN ('RECSTAT_FAIL', 'I') AND bid_error_desc = 'RECERR_OS'         THEN 'BIDSTAT_OS'
       WHEN bid_status IN ('RECSTAT_FAIL', 'I')                                          THEN 'BIDSTAT_LE'
       ELSE bid_status   -- preserve unmapped values for inspection
   END
 WHERE bid_status IS NOT NULL;

-- iss.iss_bid_institutional.bid_status
UPDATE iss.iss_bid_institutional
   SET bid_status = CASE
       WHEN bid_status IN ('RECSTAT_FULLY_ALLOTED', 'RECSTAT_PARTIAL_ALLOTED', 'F', 'P') THEN 'BIDSTAT_COMPLETED'
       WHEN bid_status IN ('RECSTAT_FAIL', 'I') AND bid_error_desc = 'RECERR_OS'         THEN 'BIDSTAT_OS'
       WHEN bid_status IN ('RECSTAT_FAIL', 'I')                                          THEN 'BIDSTAT_LE'
       ELSE bid_status
   END
 WHERE bid_status IS NOT NULL;

-- iss.iss_sb_subscription.record_status
UPDATE iss.iss_sb_subscription
   SET record_status = CASE
       WHEN record_status IN ('RECSTAT_FULLY_ALLOTED', 'RECSTAT_PARTIAL_ALLOTED', 'F', 'P') THEN 'BIDSTAT_COMPLETED'
       WHEN record_status IN ('RECSTAT_FAIL', 'I')                                          THEN 'BIDSTAT_LE'
       ELSE record_status
   END
 WHERE record_status IS NOT NULL;

-- Note: BIDSTAT_PA is intentionally left out of the auto-migration mapping
--       because it is a more granular state introduced for new records;
--       if older records had a way to flag "partially accepted" distinct from
--       "fully completed" please update the mapping above before running.

-- ----------------------------------------------------------------------------
-- STEP 4: iss.iss_sb_redemption.record_status — NO CHANGE
-- ----------------------------------------------------------------------------
-- Keeps using existing RECSTAT_FULLY_ALLOTED ('P') for SSB redemptions
-- (always full per FSD). RECSTAT_FAIL only if the redemption file ingestion
-- failed.
