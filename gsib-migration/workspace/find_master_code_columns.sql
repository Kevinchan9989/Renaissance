-- =============================================================
-- find_master_code_columns.sql
-- Auto-detects which cm.cm_master_code_category each VARCHAR(50)
-- column in the OMEGA schemas (cm, iss, stg) maps to, by joining
-- its distinct values against cm.cm_master_code.master_code_key.
--
-- Output: TWO CSV blocks streamed to STDOUT (the console), each
-- preceded by a marker line so they are easy to separate.
--
-- USAGE (psql command-line; just run, output goes to your terminal):
--   psql -d <dbname> -U <user> -h <host> -f find_master_code_columns.sql
--
-- USAGE (redirect to file if you prefer):
--   psql -d <dbname> -U <user> -h <host> -f find_master_code_columns.sql > master_code_columns.csv
--
-- USAGE (pgAdmin / DBeaver / DataGrip):
--   COPY ... TO STDOUT typically works and dumps CSV to the
--   "Messages"/"Output" panel. If your client rejects it, replace
--   each "COPY (...) TO STDOUT WITH (...)" with the inner SELECT
--   and export each result grid as CSV manually.
--
-- The two CSV blocks are emitted back-to-back. Tell them apart by
-- their header rows:
--   Section 1 (categories): category, category_description, code_count, keys
--   Section 2 (column map): schema_name, table_name, column_name, ...
-- =============================================================

-- Section 1: Master code categories (CSV)
COPY (
  SELECT
    c.cate_code            AS category,
    c.category_description AS category_description,
    COUNT(m.id)            AS code_count,
    STRING_AGG(m.master_code_key, ', ' ORDER BY m.sequence_no, m.master_code_key) AS keys
  FROM cm.cm_master_code_category c
  LEFT JOIN cm.cm_master_code m
    ON m.mastercode_category_uuid = c.uuid
   AND COALESCE(m.is_deleted, 'N') = 'N'
  WHERE COALESCE(c.is_deleted, 'N') = 'N'
  GROUP BY c.cate_code, c.category_description
  ORDER BY c.cate_code
) TO STDOUT WITH (FORMAT CSV, HEADER, FORCE_QUOTE *);


-- Section 2: VARCHAR(50) column -> master code category mapping
DROP TABLE IF EXISTS pg_temp.mc_col_scan;
CREATE TEMP TABLE pg_temp.mc_col_scan (
  schema_name       text,
  table_name        text,
  column_name       text,
  distinct_total    integer,
  distinct_matched  integer,
  matched_category  text,
  matched_keys      text,
  unmatched_samples text
);

DO $outer$
DECLARE
  r   record;
  q   text;
  rec record;
BEGIN
  FOR r IN
    SELECT table_schema, table_name, column_name
    FROM information_schema.columns
    WHERE table_schema IN ('cm','iss','stg')
      AND data_type = 'character varying'
      AND character_maximum_length = 50
      AND table_name NOT LIKE '%\_t' ESCAPE '\'                       -- skip _t audit tables
      AND table_name NOT IN ('cm_master_code','cm_master_code_category')
      AND column_name NOT IN ('created_by','updated_by','uuid','trans_uuid')
    ORDER BY table_schema, table_name, column_name
  LOOP
    q := format(
      $f$
        WITH d AS (
          SELECT DISTINCT %1$I::text AS v
          FROM %2$I.%3$I
          WHERE %1$I IS NOT NULL
        ),
        joined AS (
          SELECT d.v, mcc.cate_code, mc.master_code_key
          FROM d
          LEFT JOIN cm.cm_master_code mc
            ON mc.master_code_key = d.v
           AND COALESCE(mc.is_deleted, 'N') = 'N'
          LEFT JOIN cm.cm_master_code_category mcc
            ON mcc.uuid = mc.mastercode_category_uuid
        )
        SELECT
          (SELECT COUNT(*) FROM d)                                              AS distinct_total,
          (SELECT COUNT(*) FROM joined WHERE master_code_key IS NOT NULL)       AS distinct_matched,
          (SELECT STRING_AGG(DISTINCT cate_code, ', ' ORDER BY cate_code)
             FROM joined WHERE cate_code IS NOT NULL)                           AS matched_category,
          (SELECT STRING_AGG(master_code_key, ', ' ORDER BY master_code_key)
             FROM (SELECT DISTINCT master_code_key FROM joined
                   WHERE master_code_key IS NOT NULL ORDER BY 1 LIMIT 30) k)    AS matched_keys,
          (SELECT STRING_AGG(v, ', ' ORDER BY v)
             FROM (SELECT v FROM joined WHERE master_code_key IS NULL
                   ORDER BY v LIMIT 15) u)                                      AS unmatched_samples
      $f$,
      r.column_name, r.table_schema, r.table_name
    );
    BEGIN
      EXECUTE q INTO rec;
      INSERT INTO pg_temp.mc_col_scan VALUES (
        r.table_schema, r.table_name, r.column_name,
        rec.distinct_total, rec.distinct_matched,
        rec.matched_category, rec.matched_keys, rec.unmatched_samples
      );
    EXCEPTION WHEN OTHERS THEN
      INSERT INTO pg_temp.mc_col_scan VALUES (
        r.table_schema, r.table_name, r.column_name,
        NULL, NULL, NULL, NULL, '<error: ' || SQLERRM || '>'
      );
    END;
  END LOOP;
END
$outer$;

COPY (
  SELECT
    schema_name,
    table_name,
    column_name,
    distinct_total,
    distinct_matched,
    matched_category,
    matched_keys,
    unmatched_samples
  FROM pg_temp.mc_col_scan
  ORDER BY
    -- columns where ALL distinct values matched a category come first
    CASE WHEN distinct_matched = distinct_total AND distinct_total > 0 THEN 0
         WHEN distinct_matched > 0 THEN 1
         ELSE 2 END,
    schema_name, table_name, column_name
) TO STDOUT WITH (FORMAT CSV, HEADER, FORCE_QUOTE *);


-- -----------------------------------------------------------------
-- Cleanup: drop the scratch temp table now that results are returned
-- (temp tables are session-scoped anyway, but drop explicitly so the
-- session is left clean even if reused.)
-- -----------------------------------------------------------------
DROP TABLE IF EXISTS pg_temp.mc_col_scan;
