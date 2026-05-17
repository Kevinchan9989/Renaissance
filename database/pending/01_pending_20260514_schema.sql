BEGIN;

-- 1. Rename bid_status → record_status on bid tables.
ALTER TABLE iss.iss_bid_institutional   RENAME COLUMN bid_status TO record_status;
ALTER TABLE iss.iss_bid_institutional_t RENAME COLUMN bid_status TO record_status;
ALTER TABLE iss.iss_bid_retail          RENAME COLUMN bid_status TO record_status;
ALTER TABLE iss.iss_bid_retail_t        RENAME COLUMN bid_status TO record_status;

-- 2. Drop status from submission_group tables.
ALTER TABLE iss.iss_bid_submission_group         DROP COLUMN IF EXISTS status;
ALTER TABLE iss.iss_bid_submission_group_t       DROP COLUMN IF EXISTS status;
ALTER TABLE cm.cm_applicant_submission_group     DROP COLUMN IF EXISTS status;
ALTER TABLE cm.cm_applicant_submission_group_t   DROP COLUMN IF EXISTS status;

-- 3. Drop remarks from bid tables (kept on bid_submission_group).
ALTER TABLE iss.iss_bid_institutional   DROP COLUMN IF EXISTS remarks;
ALTER TABLE iss.iss_bid_institutional_t DROP COLUMN IF EXISTS remarks;
ALTER TABLE iss.iss_bid_retail          DROP COLUMN IF EXISTS remarks;
ALTER TABLE iss.iss_bid_retail_t        DROP COLUMN IF EXISTS remarks;

-- 4. Add coupon_rate numeric(7,4) to auction / allotment run tables.
ALTER TABLE iss.iss_auction_run          ADD COLUMN IF NOT EXISTS coupon_rate numeric(7,4);
ALTER TABLE iss.iss_auction_run_t        ADD COLUMN IF NOT EXISTS coupon_rate numeric(7,4);
ALTER TABLE iss.iss_sb_allotment_run     ADD COLUMN IF NOT EXISTS coupon_rate numeric(7,4);
ALTER TABLE iss.iss_sb_allotment_run_t   ADD COLUMN IF NOT EXISTS coupon_rate numeric(7,4);
ALTER TABLE iss.iss_synd_allotment_run   ADD COLUMN IF NOT EXISTS coupon_rate numeric(7,4);
ALTER TABLE iss.iss_synd_allotment_run_t ADD COLUMN IF NOT EXISTS coupon_rate numeric(7,4);

-- 5. Add iss_bid_submission_group_uuid FK to sb_subscription tables.
ALTER TABLE iss.iss_sb_subscription   ADD COLUMN IF NOT EXISTS iss_bid_submission_group_uuid varchar(36) REFERENCES iss.iss_bid_submission_group(uuid);
ALTER TABLE iss.iss_sb_subscription_t ADD COLUMN IF NOT EXISTS iss_bid_submission_group_uuid varchar(36);

COMMIT;
