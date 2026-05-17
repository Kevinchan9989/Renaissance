-- ============================================================================
-- OMEGA Setup Data — Pending Changes
-- Generated 2026-05-08, source: cross-check between
--   gsib-migration/workspace/omega-ddl-current.dict.json (data dict)
--   gsib-migration/workspace/omega_setup_data.json       (current setup data)
--
-- Apply these statements to align the OMEGA setup data with the data dict.
-- Note: some statements require the actual cm.cm_master_code_category.uuid /
-- mastercode_category_uuid to be looked up at runtime. Replace placeholders
-- accordingly or use the WITH-CTE pattern shown in section 2.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. RENAME categories to align with dict references (long form *_STAT)
--    Dict uses 'ISSANNSTAT' / 'ISSCALSTAT'; setup currently has short ISSANN / ISSCAL.
--    The master_codes are already in long form so only the category key needs renaming.
-- ----------------------------------------------------------------------------
UPDATE cm.cm_master_code_category SET cate_code = 'ISSANNSTAT' WHERE cate_code = 'ISSANN';
UPDATE cm.cm_master_code_category SET cate_code = 'ISSCALSTAT' WHERE cate_code = 'ISSCAL';


-- ----------------------------------------------------------------------------
-- 2. ADD 4 new categories (CUSTBC, ISSFREQ, PHSTAT, SFGDSTAT) and their codes
--    Replace gen_random_uuid() / id-generation with your seed-id convention.
-- ----------------------------------------------------------------------------

-- 2a. Bank-or-Custodian Indicator (CUSTBC)
INSERT INTO cm.cm_master_code_category (uuid, cate_code, category_description, is_editable, is_deleted, is_migrated, version, created_dt, created_by, updated_dt, updated_by)
VALUES (gen_random_uuid(), 'CUSTBC', 'Bank-or-Custodian Indicator', 'Y', 'N', 'N', 1, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM');

INSERT INTO cm.cm_master_code (uuid, master_code_key, mastercode_category_uuid, code_value, code_description, sequence_no, status, version, is_editable, is_deleted, is_migrated, created_dt, created_by, updated_dt, updated_by)
SELECT gen_random_uuid(), v.k, c.id, v.v, v.d, v.s, 'CMSTAT_ACTIVE', 1, 'Y', 'N', 'N', CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM'
FROM cm.cm_master_code_category c, (VALUES
    ('CUSTBC_B', 'B', 'Bank',                       10),
    ('CUSTBC_C', 'C', 'Bank''s Customer / Custodian', 20)
) AS v(k, v, d, s)
WHERE c.cate_code = 'CUSTBC';

-- 2b. Issuance Frequency (ISSFREQ)
INSERT INTO cm.cm_master_code_category (uuid, cate_code, category_description, is_editable, is_deleted, is_migrated, version, created_dt, created_by, updated_dt, updated_by)
VALUES (gen_random_uuid(), 'ISSFREQ', 'Issuance Frequency', 'Y', 'N', 'N', 1, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM');

INSERT INTO cm.cm_master_code (uuid, master_code_key, mastercode_category_uuid, code_description, sequence_no, status, version, is_editable, is_deleted, is_migrated, created_dt, created_by, updated_dt, updated_by)
SELECT gen_random_uuid(), v.k, c.id, v.d, v.s, 'CMSTAT_ACTIVE', 1, 'Y', 'N', 'N', CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM'
FROM cm.cm_master_code_category c, (VALUES
    ('ISSFREQ_MONTHLY',        'Monthly',         10),
    ('ISSFREQ_QUARTERLY',      'Quarterly',       20),
    ('ISSFREQ_SEMI_ANNUALLY',  'Semi-Annually',   30),
    ('ISSFREQ_ANNUALLY',       'Annually',        40)
) AS v(k, d, s)
WHERE c.cate_code = 'ISSFREQ';

-- 2c. Public Holiday Status (PHSTAT)
INSERT INTO cm.cm_master_code_category (uuid, cate_code, category_description, is_editable, is_deleted, is_migrated, version, created_dt, created_by, updated_dt, updated_by)
VALUES (gen_random_uuid(), 'PHSTAT', 'Public Holiday Status', 'Y', 'N', 'N', 1, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM');

INSERT INTO cm.cm_master_code (uuid, master_code_key, mastercode_category_uuid, code_description, sequence_no, status, version, is_editable, is_deleted, is_migrated, created_dt, created_by, updated_dt, updated_by)
SELECT gen_random_uuid(), v.k, c.id, v.d, v.s, 'CMSTAT_ACTIVE', 1, 'Y', 'N', 'N', CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM'
FROM cm.cm_master_code_category c, (VALUES
    ('PHSTAT_NEW',              'New',              10),
    ('PHSTAT_PENDING_APPROVAL', 'Pending approval', 20),
    ('PHSTAT_APPROVED',         'Approved',         30)
) AS v(k, d, s)
WHERE c.cate_code = 'PHSTAT';

-- 2d. Auction Safeguard Status (SFGDSTAT)
INSERT INTO cm.cm_master_code_category (uuid, cate_code, category_description, is_editable, is_deleted, is_migrated, version, created_dt, created_by, updated_dt, updated_by)
VALUES (gen_random_uuid(), 'SFGDSTAT', 'Auction Safeguard Status', 'Y', 'N', 'N', 1, CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM');

INSERT INTO cm.cm_master_code (uuid, master_code_key, mastercode_category_uuid, code_description, sequence_no, status, version, is_editable, is_deleted, is_migrated, created_dt, created_by, updated_dt, updated_by)
SELECT gen_random_uuid(), v.k, c.id, v.d, v.s, 'CMSTAT_ACTIVE', 1, 'Y', 'N', 'N', CURRENT_TIMESTAMP, 'SYSTEM', CURRENT_TIMESTAMP, 'SYSTEM'
FROM cm.cm_master_code_category c, (VALUES
    ('SFGDSTAT_PENDING_CONFIG',   'Pending configuration', 10),
    ('SFGDSTAT_PENDING_APPROVAL', 'Pending approval',      20),
    ('SFGDSTAT_CONFIGURED',       'Configured',            30)
) AS v(k, d, s)
WHERE c.cate_code = 'SFGDSTAT';


-- ----------------------------------------------------------------------------
-- 3. REMOVE unused categories + their codes
--    Verified not referenced anywhere in the data dict.
-- ----------------------------------------------------------------------------
DELETE FROM cm.cm_master_code
 WHERE mastercode_category_uuid IN (
   SELECT id FROM cm.cm_master_code_category
    WHERE cate_code IN ('ISSSTAT', 'BIDFSTAT', 'TENOR', 'BIDCOLSTAT')
 );
DELETE FROM cm.cm_master_code_category WHERE cate_code IN ('ISSSTAT', 'BIDFSTAT', 'TENOR', 'BIDCOLSTAT');


-- ----------------------------------------------------------------------------
-- 4. REMOVE SECTYPE_FRN (Change #4 in db-schema-changes.md)
-- ----------------------------------------------------------------------------
DELETE FROM cm.cm_master_code WHERE master_code_key = 'SECTYPE_FRN';


-- ----------------------------------------------------------------------------
-- 5. FIX data quality issues
-- ----------------------------------------------------------------------------
-- Strip TAB character from SGSTYPE_INFRA description
UPDATE cm.cm_master_code
   SET code_description = REPLACE(code_description, CHR(9), '')
 WHERE master_code_key = 'SGSTYPE_INFRA';


-- ----------------------------------------------------------------------------
-- 6. RECSTAT → BIDSTAT migration (3 bid-outcome fields)
--    See bidstat-migration.sql for the full mapping logic. Summary:
--      RECSTAT_FULLY_ALLOTED   -> BIDSTAT_COMPLETED
--      RECSTAT_PARTIAL_ALLOTED -> BIDSTAT_COMPLETED
--      RECSTAT_FAIL + bid_error_desc='RECERR_OS' -> BIDSTAT_OS
--      RECSTAT_FAIL (other)                       -> BIDSTAT_LE
--    Note: setup data only has compact RECSTAT_F / RECSTAT_P, not the long
--    names referenced by the dict — rerun bidstat-migration.sql once data is
--    confirmed in production.
--
--    iss.iss_sb_redemption.record_status stays on RECSTAT (P/F).
-- ----------------------------------------------------------------------------
-- (Migration UPDATE statements live in bidstat-migration.sql)


-- ----------------------------------------------------------------------------
-- VERIFICATION QUERIES (run after applying)
-- ----------------------------------------------------------------------------
-- SELECT cate_code FROM cm.cm_master_code_category ORDER BY cate_code;
-- SELECT master_code_key FROM cm.cm_master_code WHERE master_code_key LIKE 'CUSTBC_%' OR master_code_key LIKE 'PHSTAT_%' OR master_code_key LIKE 'ISSFREQ_%' OR master_code_key LIKE 'SFGDSTAT_%';
