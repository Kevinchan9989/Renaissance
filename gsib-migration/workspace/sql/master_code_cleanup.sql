-- ==========================================================================
-- OMEGA master_code / master_code_category cleanup
-- Generated for: descriptive rename + cate_code fix + category removal
--
-- Applies the following to cm.cm_master_code_category and cm.cm_master_code:
--
--   RENAMES (category_description only)
--     CALMETHOD : 'Creation Methods'              → 'Calendar Generation Method'
--     CPTYSTAT  : 'Admin Counterparty Status'     → 'Counterparty Status'
--     FILETYPE  : 'Bid File Types'                → 'Interface File Type'
--     ISSBIDSTAT: 'Bid Status'                    → 'Bid Collation Status'
--                 ⚠ duplicates BIDCOLSTAT's description — confirm before run
--
--   RENAMES (cate_code + description)
--     ISSANN → ISSANNSTAT  ('Announcement Status'      → 'Issuance Announcement Status')
--     ISSCAL → ISSCALSTAT  ('Issuance Calendar Status' unchanged)
--
--   REMOVALS (delete child codes first, then category)
--     BIDFSTAT  (4 codes:  FAILED / FULL_PROCESSED / PARTIAL_PROCESSED / PROCESSING)
--     ISSSTAT   (3 codes:  DRAFT / PUBLISHED / UNPUBLISHED)
--     TENOR     (3 codes:  DAY / MONTH / YEAR)
--
-- WARNING: Hard DELETEs are used for the removals. If any other table has an
-- FK / soft reference to these category rows or codes, the DELETE will fail or
-- orphan that data. Verify with the pre-flight queries at the bottom of this
-- file BEFORE running the transaction. To keep history instead, swap the
-- DELETE block for the SOFT-DELETE block (commented out below).
-- ==========================================================================

BEGIN;

-- --------------------------------------------------------------------------
-- 1. RENAMES — category description only
-- --------------------------------------------------------------------------
UPDATE cm.cm_master_code_category
SET    category_description = 'Calendar Generation Method',
       updated_dt           = NOW(),
       updated_by           = 'SYSTEM',
       version              = version + 1
WHERE  cate_code = 'CALMETHOD';

UPDATE cm.cm_master_code_category
SET    category_description = 'Counterparty Status',
       updated_dt           = NOW(),
       updated_by           = 'SYSTEM',
       version              = version + 1
WHERE  cate_code = 'CPTYSTAT';

UPDATE cm.cm_master_code_category
SET    category_description = 'Interface File Type',
       updated_dt           = NOW(),
       updated_by           = 'SYSTEM',
       version              = version + 1
WHERE  cate_code = 'FILETYPE';

UPDATE cm.cm_master_code_category
SET    category_description = 'Bid Collation Status',  -- ⚠ duplicates BIDCOLSTAT
       updated_dt           = NOW(),
       updated_by           = 'SYSTEM',
       version              = version + 1
WHERE  cate_code = 'ISSBIDSTAT';

-- --------------------------------------------------------------------------
-- 2. RENAMES — cate_code + description (ISSANN, ISSCAL)
--    The uuid stays the same so all cm_master_code rows (which reference the
--    category by uuid in mastercode_category_uuid) remain linked.
-- --------------------------------------------------------------------------
UPDATE cm.cm_master_code_category
SET    cate_code            = 'ISSANNSTAT',
       category_description = 'Issuance Announcement Status',
       updated_dt           = NOW(),
       updated_by           = 'SYSTEM',
       version              = version + 1
WHERE  cate_code = 'ISSANN';

UPDATE cm.cm_master_code_category
SET    cate_code            = 'ISSCALSTAT',
       -- description already 'Issuance Calendar Status' — left as-is
       updated_dt           = NOW(),
       updated_by           = 'SYSTEM',
       version              = version + 1
WHERE  cate_code = 'ISSCAL';

-- --------------------------------------------------------------------------
-- 3. REMOVALS — delete child master_code rows, then the category
--    (Use the category uuid for the FK column mastercode_category_uuid.)
-- --------------------------------------------------------------------------

-- 3a. BIDFSTAT  (uuid 46ec784c-4aaf-4bc1-940d-e919d8df986b)
DELETE FROM cm.cm_master_code
WHERE  mastercode_category_uuid = '46ec784c-4aaf-4bc1-940d-e919d8df986b';

DELETE FROM cm.cm_master_code_category
WHERE  cate_code = 'BIDFSTAT';

-- 3b. ISSSTAT  (uuid 482a730a-bc45-4193-a4da-c7200e56d231)
DELETE FROM cm.cm_master_code
WHERE  mastercode_category_uuid = '482a730a-bc45-4193-a4da-c7200e56d231';

DELETE FROM cm.cm_master_code_category
WHERE  cate_code = 'ISSSTAT';

-- 3c. TENOR  (uuid f26b7ce3-92a9-43fa-bb68-4b679f8a571d)
DELETE FROM cm.cm_master_code
WHERE  mastercode_category_uuid = 'f26b7ce3-92a9-43fa-bb68-4b679f8a571d';

DELETE FROM cm.cm_master_code_category
WHERE  cate_code = 'TENOR';

-- --------------------------------------------------------------------------
-- 3d. CODE-DESCRIPTION CORRECTIONS (align to FSD / DB conventions)
--    These are pure code_description fixes; key, uuid, category all unchanged.
--    Key-based WHERE means a missing row simply no-ops (safe across envs).
-- --------------------------------------------------------------------------
UPDATE cm.cm_master_code
SET    code_description = 'Pending Approval',
       updated_dt = NOW(), updated_by = 'SYSTEM', version = version + 1
WHERE  master_code_key = 'BIDEXTSTAT_PENDING_APPROVAL';

UPDATE cm.cm_master_code
SET    code_description = 'Oversubscription',
       updated_dt = NOW(), updated_by = 'SYSTEM', version = version + 1
WHERE  master_code_key = 'BIDSTAT_OS';

UPDATE cm.cm_master_code
SET    code_description = 'Limit exceeded',
       updated_dt = NOW(), updated_by = 'SYSTEM', version = version + 1
WHERE  master_code_key = 'BIDSTAT_LE';

UPDATE cm.cm_master_code
SET    code_description = 'Partially accepted',
       updated_dt = NOW(), updated_by = 'SYSTEM', version = version + 1
WHERE  master_code_key = 'BIDSTAT_PA';

UPDATE cm.cm_master_code
SET    code_description = 'Generate with algorithm',
       updated_dt = NOW(), updated_by = 'SYSTEM', version = version + 1
WHERE  master_code_key = 'CALMETHOD_ALGO';

UPDATE cm.cm_master_code
SET    code_description = 'Manual entry',
       updated_dt = NOW(), updated_by = 'SYSTEM', version = version + 1
WHERE  master_code_key = 'CALMETHOD_MANUAL';

UPDATE cm.cm_master_code
SET    code_description = 'File upload',
       updated_dt = NOW(), updated_by = 'SYSTEM', version = version + 1
WHERE  master_code_key = 'CALMETHOD_UPLOAD';

UPDATE cm.cm_master_code
SET    code_description = 'SGS (Infra)',     -- strip leading tab
       updated_dt = NOW(), updated_by = 'SYSTEM', version = version + 1
WHERE  master_code_key = 'SGSTYPE_INFRA';

UPDATE cm.cm_master_code
SET    code_description = 'MAS Bill',        -- plural → singular
       updated_dt = NOW(), updated_by = 'SYSTEM', version = version + 1
WHERE  master_code_key = 'SECTYPE_MASBILL';

-- --------------------------------------------------------------------------
-- 3e. ISSBIDSTAT restructure
--   FINAL SET (8 codes):
--     PENDING_APPROVAL, SUBMITTED, REJECTED, WITHDRAWN,
--     COMPLETED, COMPLETED_OS, COMPLETED_LE, COMPLETED_PA
--
--   Removed: ACCEPTED, ALLOTTED, DELETED, PENDING_APPROVAL_CREATE
--   Renamed: SUBMITTED desc 'Submitted (Approved)' → 'Submitted'
--            REJECTED sequence_no 50 → 30
--   Added:   WITHDRAWN + COMPLETED + COMPLETED_OS/LE/PA
-- --------------------------------------------------------------------------

-- Delete the 4 obsolete codes (idempotent — no-op if already removed)
DELETE FROM cm.cm_master_code
WHERE  master_code_key IN (
   'ISSBIDSTAT_ACCEPTED',
   'ISSBIDSTAT_ALLOTTED',
   'ISSBIDSTAT_DELETED',
   'ISSBIDSTAT_PENDING_APPROVAL_CREATE'
);

-- Description + sequence fixes on the two kept rows
UPDATE cm.cm_master_code
SET    code_description = 'Submitted',
       updated_dt = NOW(), updated_by = 'SYSTEM', version = version + 1
WHERE  master_code_key = 'ISSBIDSTAT_SUBMITTED';

UPDATE cm.cm_master_code
SET    sequence_no = 30,
       updated_dt = NOW(), updated_by = 'SYSTEM', version = version + 1
WHERE  master_code_key = 'ISSBIDSTAT_REJECTED';

-- Five new codes. WHERE NOT EXISTS keeps the script re-runnable.
INSERT INTO cm.cm_master_code (id, uuid, master_code_key, mastercode_category_uuid,
       code_value, code_description, filter_value, sequence_no, remarks, status,
       effective_from, effective_to, version, is_editable, is_centrally_managed,
       is_deleted, is_migrated, created_dt, created_by, updated_dt, updated_by)
SELECT v.id, v.uuid, v.master_code_key, 'adaa2fec-6ce9-4574-821a-1297e77c5487',
       v.code_value, v.code_description, NULL, v.seq_no, NULL, 'CMSTAT_ACTIVE',
       NOW(), NULL, 1, 'Y', 'N', 'N', 'N', NOW(), 'SYSTEM', NOW(), 'SYSTEM'
FROM (VALUES
   (150000000001100, gen_random_uuid()::text, 'ISSBIDSTAT_WITHDRAWN',    'WITHDRAWN',    'Withdrawn',                       40),
   (150000000001101, gen_random_uuid()::text, 'ISSBIDSTAT_COMPLETED',    'COMPLETED',    'Completed',                       50),
   (150000000001102, gen_random_uuid()::text, 'ISSBIDSTAT_COMPLETED_OS', 'COMPLETED_OS', 'Completed (Oversubscription)',    60),
   (150000000001103, gen_random_uuid()::text, 'ISSBIDSTAT_COMPLETED_LE', 'COMPLETED_LE', 'Completed (Limit exceeded)',      70),
   (150000000001104, gen_random_uuid()::text, 'ISSBIDSTAT_COMPLETED_PA', 'COMPLETED_PA', 'Completed (Partially accepted)',  80)
) AS v(id, uuid, master_code_key, code_value, code_description, seq_no)
WHERE  NOT EXISTS (
   SELECT 1 FROM cm.cm_master_code mc
   WHERE  mc.master_code_key = v.master_code_key
);

-- --------------------------------------------------------------------------
-- 3f. SFGDSTAT — new "Auction Safeguards Status" category + 3 codes
--   PENDING_CONFIG  → "Pending Configuration"
--   PENDING_APPROVAL → "Pending Approval"
--   CONFIGURED      → "Configured"
-- WHERE-NOT-EXISTS pattern keeps this re-runnable.
-- --------------------------------------------------------------------------
INSERT INTO cm.cm_master_code_category (id, uuid, category_description, is_editable,
       cate_code, version, is_deleted, is_migrated, created_dt, created_by,
       updated_dt, updated_by)
SELECT 150000000000062, '7e3a9b1c-4d8f-4e1a-bc3e-8d2f5a6c91e0',
       'Auction Safeguards Status', 'Y', 'SFGDSTAT', 1, 'N', 'N',
       NOW(), 'SYSTEM', NOW(), 'SYSTEM'
WHERE NOT EXISTS (
    SELECT 1 FROM cm.cm_master_code_category WHERE cate_code = 'SFGDSTAT'
);

INSERT INTO cm.cm_master_code (id, uuid, master_code_key, mastercode_category_uuid,
       code_value, code_description, filter_value, sequence_no, remarks, status,
       effective_from, effective_to, version, is_editable, is_centrally_managed,
       is_deleted, is_migrated, created_dt, created_by, updated_dt, updated_by)
SELECT v.id, gen_random_uuid()::text, v.master_code_key,
       '7e3a9b1c-4d8f-4e1a-bc3e-8d2f5a6c91e0',
       v.code_value, v.code_description, NULL, v.seq_no, NULL, 'CMSTAT_ACTIVE',
       NOW(), NULL, 1, 'Y', 'N', 'N', 'N', NOW(), 'SYSTEM', NOW(), 'SYSTEM'
FROM (VALUES
   (150000000001110, 'SFGDSTAT_PENDING_CONFIG',   'PENDING_CONFIG',   'Pending Configuration', 10),
   (150000000001111, 'SFGDSTAT_PENDING_APPROVAL', 'PENDING_APPROVAL', 'Pending Approval',      20),
   (150000000001112, 'SFGDSTAT_CONFIGURED',       'CONFIGURED',       'Configured',            30)
) AS v(id, master_code_key, code_value, code_description, seq_no)
WHERE NOT EXISTS (
   SELECT 1 FROM cm.cm_master_code mc WHERE mc.master_code_key = v.master_code_key
);

-- --------------------------------------------------------------------------
-- 3h. APTSUBTYPE — remove all child codes (category itself retained)
-- --------------------------------------------------------------------------
DELETE FROM cm.cm_master_code
WHERE  master_code_key IN (
   'APTSUBTYPE_NEW',
   'APTSUBTYPE_UPDATE',
   'APTSUBTYPE_DELETE'
);

-- --------------------------------------------------------------------------
-- 3i. Drop orphan categories with zero child codes
--   APTSUBTYPE  — child codes removed in §3h
--   BIDCOLSTAT  — never had codes; semantically duplicated by ISSBIDSTAT
-- --------------------------------------------------------------------------
DELETE FROM cm.cm_master_code_category
WHERE  cate_code IN ('APTSUBTYPE', 'BIDCOLSTAT');

-- --------------------------------------------------------------------------
-- 3j. FILETYPE — enrich descriptions with the file's purpose
--   Existing values were bare account types (CASH / CPFIS / SRS). Replace
--   with "<account> (<purpose>)" so the row is self-explanatory.
--
--   Convention by prefix:
--     AP* = Application / Subscription      (inbound)
--     AA* = Subscription Acknowledgement    (outbound)
--     RA* = Allotment / Auction Results     (outbound)
--     RE* = Redemption Submission           (inbound)
--     AR* = Redemption Acknowledgement      (outbound)
--     RR* = Redemption Results              (outbound)
--     HOL  = SSB Holdings                   (inbound)
--     AH* = Holdings Acknowledgement        (outbound)
--     CAL  = Issuance Calendar              (outbound)
--     CPN  = Coupon / Redemption Rate       (outbound)
--     Suffix 1=CASH, 2=CPFIS, 3=SRS (no 2 for AR/AH — CPFIS doesn't redeem/hold this way)
-- --------------------------------------------------------------------------
UPDATE cm.cm_master_code SET code_description = v.new_desc,
       updated_dt = NOW(), updated_by = 'SYSTEM', version = version + 1
FROM (VALUES
   ('FILETYPE_AP1', 'Subscription (CASH)'),
   ('FILETYPE_AP2', 'Subscription (CPFIS)'),
   ('FILETYPE_AP3', 'Subscription (SRS)'),
   ('FILETYPE_AA1', 'Subscription Acknowledgement (CASH)'),
   ('FILETYPE_AA2', 'Subscription Acknowledgement (CPFIS)'),
   ('FILETYPE_AA3', 'Subscription Acknowledgement (SRS)'),
   ('FILETYPE_RA1', 'Allotment Results (CASH)'),
   ('FILETYPE_RA2', 'Allotment Results (CPFIS)'),
   ('FILETYPE_RA3', 'Allotment Results (SRS)'),
   ('FILETYPE_RE1', 'Redemption Submission (CASH)'),
   ('FILETYPE_RE2', 'Redemption Submission (CPFIS)'),
   ('FILETYPE_RE3', 'Redemption Submission (SRS)'),
   ('FILETYPE_AR1', 'Redemption Acknowledgement (CASH)'),
   ('FILETYPE_AR3', 'Redemption Acknowledgement (SRS)'),
   ('FILETYPE_RR1', 'Redemption Results (CASH)'),
   ('FILETYPE_RR2', 'Redemption Results (CPFIS)'),
   ('FILETYPE_RR3', 'Redemption Results (SRS)'),
   ('FILETYPE_HOL', 'SSB Holdings (CASH/SRS)'),
   ('FILETYPE_AH1', 'Holdings Acknowledgement (CASH)'),
   ('FILETYPE_AH3', 'Holdings Acknowledgement (SRS)'),
   ('FILETYPE_CAL', 'Issuance Calendar (SSB/SGS/T-Bills)'),
   ('FILETYPE_CPN', 'Coupon / Redemption Rate (SSB)')
) AS v(master_code_key, new_desc)
WHERE cm.cm_master_code.master_code_key = v.master_code_key;

-- --------------------------------------------------------------------------
-- 3k. Drop BIDSTAT — replaced by RECSTAT in bid_status / record_status columns
-- --------------------------------------------------------------------------
DELETE FROM cm.cm_master_code
WHERE  master_code_key IN ('BIDSTAT_COMPLETED','BIDSTAT_LE','BIDSTAT_OS','BIDSTAT_PA');

DELETE FROM cm.cm_master_code_category
WHERE  cate_code = 'BIDSTAT';

-- --------------------------------------------------------------------------
-- 3l. Add 4 new categories + 12 codes
--   AUCSTR    — Auction Strength (NORMAL/STRONG/WEAK)
--   PHSTAT    — Public Holiday Status (NEW/PENDING_APPROVAL/APPROVED)
--   ISSFREQ   — Issuance Frequency (MONTHLY/QUARTERLY/SEMI_ANNUALLY/ANNUALLY)
--   CUSTBC    — Custody Bank Code (B/C) — descriptions are placeholders;
--               clarify with FSD before go-live
-- --------------------------------------------------------------------------
INSERT INTO cm.cm_master_code_category (id, uuid, category_description, is_editable,
       cate_code, version, is_deleted, is_migrated, created_dt, created_by,
       updated_dt, updated_by)
SELECT v.id, v.uuid, v.descr, 'Y', v.cate_code, 1, 'N', 'N',
       NOW(), 'SYSTEM', NOW(), 'SYSTEM'
FROM (VALUES
   (150000000000063, '5d8b1c2a-3e6f-4a7b-9c0d-1e2f3a4b5c6d', 'AUCSTR',  'Auction Strength'),
   (150000000000064, '6e9c2d3b-4f7a-4b8c-ad1e-2f3a4b5c6d7e', 'PHSTAT',  'Public Holiday Status'),
   (150000000000065, '7fad3e4c-5a8b-4c9d-be2f-3a4b5c6d7e8f', 'ISSFREQ', 'Issuance Frequency'),
   (150000000000066, '8abe4f5d-6b9c-4daf-cf3a-4b5c6d7e8f90', 'CUSTBC',  'Custody Bank Code')
) AS v(id, uuid, cate_code, descr)
WHERE NOT EXISTS (
   SELECT 1 FROM cm.cm_master_code_category c WHERE c.cate_code = v.cate_code
);

INSERT INTO cm.cm_master_code (id, uuid, master_code_key, mastercode_category_uuid,
       code_value, code_description, filter_value, sequence_no, remarks, status,
       effective_from, effective_to, version, is_editable, is_centrally_managed,
       is_deleted, is_migrated, created_dt, created_by, updated_dt, updated_by)
SELECT v.id, gen_random_uuid()::text, v.master_code_key, v.cat_uuid,
       v.code_value, v.code_description, NULL, v.seq_no, NULL, 'CMSTAT_ACTIVE',
       NOW(), NULL, 1, 'Y', 'N', 'N', 'N', NOW(), 'SYSTEM', NOW(), 'SYSTEM'
FROM (VALUES
   (150000000001120, 'AUCSTR_NORMAL',           'NORMAL',           'Normal',           10, '5d8b1c2a-3e6f-4a7b-9c0d-1e2f3a4b5c6d'),
   (150000000001121, 'AUCSTR_STRONG',           'STRONG',           'Strong',           20, '5d8b1c2a-3e6f-4a7b-9c0d-1e2f3a4b5c6d'),
   (150000000001122, 'AUCSTR_WEAK',             'WEAK',             'Weak',             30, '5d8b1c2a-3e6f-4a7b-9c0d-1e2f3a4b5c6d'),
   (150000000001123, 'PHSTAT_NEW',              'NEW',              'New',              10, '6e9c2d3b-4f7a-4b8c-ad1e-2f3a4b5c6d7e'),
   (150000000001124, 'PHSTAT_PENDING_APPROVAL', 'PENDING_APPROVAL', 'Pending Approval', 20, '6e9c2d3b-4f7a-4b8c-ad1e-2f3a4b5c6d7e'),
   (150000000001125, 'PHSTAT_APPROVED',         'APPROVED',         'Approved',         30, '6e9c2d3b-4f7a-4b8c-ad1e-2f3a4b5c6d7e'),
   (150000000001126, 'ISSFREQ_MONTHLY',         'MONTHLY',          'Monthly',          10, '7fad3e4c-5a8b-4c9d-be2f-3a4b5c6d7e8f'),
   (150000000001127, 'ISSFREQ_QUARTERLY',       'QUARTERLY',        'Quarterly',        20, '7fad3e4c-5a8b-4c9d-be2f-3a4b5c6d7e8f'),
   (150000000001128, 'ISSFREQ_SEMI_ANNUALLY',   'SEMI_ANNUALLY',    'Semi-Annually',    30, '7fad3e4c-5a8b-4c9d-be2f-3a4b5c6d7e8f'),
   (150000000001129, 'ISSFREQ_ANNUALLY',        'ANNUALLY',         'Annually',         40, '7fad3e4c-5a8b-4c9d-be2f-3a4b5c6d7e8f'),
   (150000000001130, 'CUSTBC_B',                'B',                'B',                10, '8abe4f5d-6b9c-4daf-cf3a-4b5c6d7e8f90'),
   (150000000001131, 'CUSTBC_C',                'C',                'C',                20, '8abe4f5d-6b9c-4daf-cf3a-4b5c6d7e8f90')
) AS v(id, master_code_key, code_value, code_description, seq_no, cat_uuid)
WHERE NOT EXISTS (
   SELECT 1 FROM cm.cm_master_code mc WHERE mc.master_code_key = v.master_code_key
);

-- --------------------------------------------------------------------------
-- 4. VERIFICATION — review counts before commit
-- --------------------------------------------------------------------------
DO $$
DECLARE
    expected_renames CONSTANT INT := 6;     -- CALMETHOD,CPTYSTAT,FILETYPE,ISSBIDSTAT,ISSANN→ISSANNSTAT,ISSCAL→ISSCALSTAT
    actual_renames   INT;
    leftover_cats    INT;
    leftover_codes   INT;
BEGIN
    SELECT COUNT(*) INTO actual_renames
    FROM cm.cm_master_code_category
    WHERE cate_code IN ('CALMETHOD','CPTYSTAT','FILETYPE','ISSBIDSTAT','ISSANNSTAT','ISSCALSTAT');

    SELECT COUNT(*) INTO leftover_cats
    FROM cm.cm_master_code_category
    WHERE cate_code IN ('BIDFSTAT','ISSSTAT','TENOR','ISSANN','ISSCAL');

    SELECT COUNT(*) INTO leftover_codes
    FROM cm.cm_master_code
    WHERE master_code_key LIKE 'BIDFSTAT\_%' ESCAPE '\'
       OR master_code_key LIKE 'ISSSTAT\_%' ESCAPE '\'
       OR master_code_key LIKE 'TENOR\_%' ESCAPE '\';

    RAISE NOTICE 'Renamed categories present: % (expected 6)', actual_renames;
    RAISE NOTICE 'Leftover removed categories: % (expected 0)', leftover_cats;
    RAISE NOTICE 'Leftover removed codes: % (expected 0)', leftover_codes;

    IF actual_renames <> expected_renames OR leftover_cats <> 0 OR leftover_codes <> 0 THEN
        RAISE EXCEPTION 'Cleanup verification failed — rolling back.';
    END IF;
END$$;

COMMIT;

-- ==========================================================================
-- ALTERNATIVE: soft-delete variant (preserve history)
-- ==========================================================================
-- Replace block 3 above with this if you want to keep the rows but flag them
-- as deleted. Skip the verification's leftover-checks if you go this route.
--
-- UPDATE cm.cm_master_code
-- SET    is_deleted = 'Y', updated_dt = NOW(), updated_by = 'SYSTEM', version = version + 1
-- WHERE  mastercode_category_uuid IN (
--           '46ec784c-4aaf-4bc1-940d-e919d8df986b',   -- BIDFSTAT
--           '482a730a-bc45-4193-a4da-c7200e56d231',   -- ISSSTAT
--           'f26b7ce3-92a9-43fa-bb68-4b679f8a571d'    -- TENOR
--        );
--
-- UPDATE cm.cm_master_code_category
-- SET    is_deleted = 'Y', updated_dt = NOW(), updated_by = 'SYSTEM', version = version + 1
-- WHERE  cate_code IN ('BIDFSTAT','ISSSTAT','TENOR');

-- ==========================================================================
-- PRE-FLIGHT (run separately, NOT inside the transaction above)
-- ==========================================================================
-- 1) Confirm the categories targeted for removal currently exist:
-- SELECT cate_code, category_description, id, uuid
-- FROM   cm.cm_master_code_category
-- WHERE  cate_code IN ('BIDFSTAT','ISSSTAT','TENOR','ISSANN','ISSCAL','CALMETHOD','CPTYSTAT','FILETYPE','ISSBIDSTAT');
--
-- 2) Confirm how many child codes would be deleted:
-- SELECT mastercode_category_uuid, COUNT(*)
-- FROM   cm.cm_master_code
-- WHERE  mastercode_category_uuid IN (
--           '46ec784c-4aaf-4bc1-940d-e919d8df986b',
--           '482a730a-bc45-4193-a4da-c7200e56d231',
--           'f26b7ce3-92a9-43fa-bb68-4b679f8a571d')
-- GROUP BY mastercode_category_uuid;
--
-- 3) Find any FK references from other tables (replace search target as needed):
-- SELECT conrelid::regclass AS table_with_fk, conname, pg_get_constraintdef(oid)
-- FROM   pg_constraint
-- WHERE  confrelid IN ('cm.cm_master_code'::regclass, 'cm.cm_master_code_category'::regclass);
