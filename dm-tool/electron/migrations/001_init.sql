-- =============================================================================
-- Migration 001 — initial schema
--
-- Mirrors the WorkspaceData / Script / Table / Column / Constraint shapes from
-- src/types/index.ts, decomposed into relational tables for the live state.
-- Historical script versions remain blob-stored (compressed) — they are read
-- as units, never queried by field.
--
-- Pragmas (WAL, NORMAL sync, foreign_keys) are set in db.cjs at open time,
-- not here, because PRAGMA is per-connection.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- scripts: lightweight metadata + pointer to the active version.
-- raw_content + parsed `data` do NOT live here. Current parsed state lives
-- in tables/columns/constraints below; raw SQL lives only on script_versions.
-- The renderer's Script.rawContent is reconstructed from the current version.
-- -----------------------------------------------------------------------------
CREATE TABLE scripts (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  type                TEXT NOT NULL CHECK (type IN ('postgresql','oracle','dbml')),
  current_version_id  TEXT,                                 -- nullable until first version exists
  versioning_enabled  INTEGER NOT NULL DEFAULT 1,           -- bool 0/1
  max_versions        INTEGER NOT NULL DEFAULT 50,
  display_order       INTEGER NOT NULL DEFAULT 0,           -- replaces dm_tool_script_order localStorage
  created_at          INTEGER NOT NULL,
  updated_at          INTEGER NOT NULL
);
CREATE INDEX idx_scripts_order ON scripts(display_order);

-- -----------------------------------------------------------------------------
-- tables: current parsed view of a script's tables. NOT versioned per-row;
-- rebuilt on parse/reparse. Historical snapshots live as blobs in
-- script_versions.data_json (when retained at all — see version policy).
-- -----------------------------------------------------------------------------
CREATE TABLE tables (
  id                       INTEGER PRIMARY KEY AUTOINCREMENT,
  script_id                TEXT NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  ordinal                  INTEGER NOT NULL,                -- preserves source order — SQL has no insertion order
  schema                   TEXT NOT NULL,
  table_name               TEXT NOT NULL,
  description              TEXT NOT NULL DEFAULT '',
  to_ignore                INTEGER NOT NULL DEFAULT 0,
  explanation_completed    INTEGER NOT NULL DEFAULT 0,
  t_checked                INTEGER NOT NULL DEFAULT 0,
  legacy_id                INTEGER,                         -- the existing numeric Table.id, kept for renderer compat
  -- Source-table flag: a script splits its tables into `targets` (the script's
  -- own DDL output) and `sources` (referenced source DDL). One bit captures it.
  is_source                INTEGER NOT NULL DEFAULT 0,
  UNIQUE (script_id, schema, table_name, is_source)
);
CREATE INDEX idx_tables_script ON tables(script_id, is_source, ordinal);

-- -----------------------------------------------------------------------------
-- columns: the data dictionary itself.
-- -----------------------------------------------------------------------------
CREATE TABLE columns (
  id                       INTEGER PRIMARY KEY AUTOINCREMENT,
  table_id                 INTEGER NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  ordinal                  INTEGER NOT NULL,
  name                     TEXT NOT NULL,
  type                     TEXT NOT NULL,
  nullable                 TEXT NOT NULL DEFAULT '',
  default_value            TEXT,                            -- null preserved (Column.default is `string | null`)
  explanation              TEXT NOT NULL DEFAULT '',
  mapping                  TEXT NOT NULL DEFAULT '',
  migration_needed         INTEGER,                         -- 3-state: NULL=undefined, 0=false, 1=true
  non_migration_comment    TEXT,
  sample_values_json       TEXT,                            -- JSON array of strings
  possible_values          TEXT,
  UNIQUE (table_id, name)
);
CREATE INDEX idx_columns_table ON columns(table_id, ordinal);
CREATE INDEX idx_columns_name  ON columns(name);            -- cross-script "find this column" without scanning

-- -----------------------------------------------------------------------------
-- constraints: PK / FK / Unique on a table.
-- -----------------------------------------------------------------------------
CREATE TABLE constraints (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  table_id    INTEGER NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
  ordinal     INTEGER NOT NULL,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('Primary Key','Foreign Key','Unique')),
  local_cols  TEXT NOT NULL,                                -- comma-separated, matches existing shape
  ref         TEXT
);
CREATE INDEX idx_constraints_table ON constraints(table_id, ordinal);

-- -----------------------------------------------------------------------------
-- script_versions: opaque historical snapshots, gzip-compressed.
--
--   content      — raw SQL (gzip BLOB; always present)
--   data_json    — parsed Tables/Columns at that point (gzip BLOB; nullable).
--                  Per the chosen version policy, we drop this on history and
--                  re-parse from `content` on demand. The current version may
--                  retain it for fast restore without a parser round-trip.
--   summary_json — small JSON: { tableCount, columnCount, sourceCount }.
--                  Lets the version-list UI render counts without inflating
--                  the BLOBs.
-- -----------------------------------------------------------------------------
CREATE TABLE script_versions (
  id              TEXT PRIMARY KEY,
  script_id       TEXT NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  version_number  INTEGER NOT NULL,
  content         BLOB NOT NULL,                            -- gzip(rawContent)
  data_json       BLOB,                                     -- gzip(JSON.stringify(data)); nullable
  summary_json    TEXT,                                     -- {tableCount,columnCount,...}
  message         TEXT,
  created_at      INTEGER NOT NULL,
  UNIQUE (script_id, version_number)
);
CREATE INDEX idx_versions_script ON script_versions(script_id, version_number DESC);

-- -----------------------------------------------------------------------------
-- master_codes / master_code_categories — appendix entries on a script.
-- -----------------------------------------------------------------------------
CREATE TABLE master_codes (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  script_id   TEXT NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  ordinal     INTEGER NOT NULL,
  key         TEXT NOT NULL,
  definition  TEXT NOT NULL DEFAULT '',
  UNIQUE (script_id, key)
);
CREATE INDEX idx_master_codes_script ON master_codes(script_id, ordinal);

CREATE TABLE master_code_categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  script_id   TEXT NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  ordinal     INTEGER NOT NULL,
  key         TEXT NOT NULL,
  definition  TEXT NOT NULL DEFAULT '',
  UNIQUE (script_id, key)
);
CREATE INDEX idx_master_code_categories_script ON master_code_categories(script_id, ordinal);

-- -----------------------------------------------------------------------------
-- sample_data_attachments: CSV uploads matched against a script.
-- match_results / warnings stay as JSON — they're read as a unit, never by field.
-- -----------------------------------------------------------------------------
CREATE TABLE sample_data_attachments (
  id              TEXT PRIMARY KEY,
  script_id       TEXT NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  file_name       TEXT NOT NULL,
  uploaded_at     INTEGER NOT NULL,
  match_results   TEXT NOT NULL,
  warnings_json   TEXT NOT NULL DEFAULT '[]'
);
CREATE INDEX idx_sample_attachments_script ON sample_data_attachments(script_id);

-- -----------------------------------------------------------------------------
-- Type compatibility rule sets. Decomposed because the UI pages through rules
-- and YAML import/export operates per-rule.
-- -----------------------------------------------------------------------------
CREATE TABLE type_rule_sets (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  description  TEXT,
  source_db    TEXT NOT NULL,
  target_db    TEXT NOT NULL,
  is_built_in  INTEGER NOT NULL DEFAULT 0,
  created_at   INTEGER NOT NULL,
  updated_at   INTEGER NOT NULL
);

-- type_rules.id is renderer-local and not globally unique (rule sets can carry
-- copies of the same rule from imports/templates). Composite PK reflects that.
CREATE TABLE type_rules (
  rule_set_id     TEXT NOT NULL REFERENCES type_rule_sets(id) ON DELETE CASCADE,
  id              TEXT NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  source_pattern  TEXT NOT NULL,
  target_pattern  TEXT NOT NULL,
  compatibility   TEXT NOT NULL,
  conversion_sql  TEXT,
  warning         TEXT,
  priority        INTEGER NOT NULL DEFAULT 0,
  enabled         INTEGER NOT NULL DEFAULT 1,
  PRIMARY KEY (rule_set_id, id)
);
CREATE INDEX idx_type_rules_set_priority ON type_rules(rule_set_id, priority DESC);

-- -----------------------------------------------------------------------------
-- Mapping projects + decomposed mappings.
-- ColumnMapping carries source/target script ids of its own (per the type def);
-- preserved here for fidelity even though they normally match the project's.
-- -----------------------------------------------------------------------------
CREATE TABLE mapping_projects (
  id                 TEXT PRIMARY KEY,
  name               TEXT NOT NULL,
  source_script_id   TEXT NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  target_script_id   TEXT NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  type_rule_set_id   TEXT REFERENCES type_rule_sets(id),    -- nullable; ON DELETE handled by app
  created_at         INTEGER NOT NULL,
  updated_at         INTEGER NOT NULL
);
CREATE INDEX idx_mapping_projects_src ON mapping_projects(source_script_id);
CREATE INDEX idx_mapping_projects_tgt ON mapping_projects(target_script_id);

CREATE TABLE table_mappings (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id         TEXT NOT NULL REFERENCES mapping_projects(id) ON DELETE CASCADE,
  source_table       TEXT NOT NULL,
  target_table       TEXT NOT NULL,
  status             TEXT NOT NULL CHECK (status IN ('complete','partial','unmapped')),
  auto_map_count     INTEGER NOT NULL DEFAULT 0,
  manual_map_count   INTEGER NOT NULL DEFAULT 0,
  UNIQUE (project_id, source_table, target_table)
);

-- ColumnMapping.id is generated by generateId() in the renderer but is NOT
-- guaranteed globally unique — copies between projects (drag-and-drop, import
-- templates, manual edits) leave duplicates that JSON tolerates. Composite PK
-- (project_id, id) reflects the actual invariant.
CREATE TABLE column_mappings (
  project_id               TEXT NOT NULL REFERENCES mapping_projects(id) ON DELETE CASCADE,
  id                       TEXT NOT NULL,
  source_script_id         TEXT NOT NULL,                   -- preserved as-is (per ColumnMapping type)
  source_table             TEXT NOT NULL,
  source_column            TEXT NOT NULL,
  source_type              TEXT NOT NULL,
  target_script_id         TEXT NOT NULL,
  target_table             TEXT NOT NULL,
  target_column            TEXT NOT NULL,
  target_type              TEXT NOT NULL,
  map_type                 TEXT NOT NULL CHECK (map_type IN ('manual','auto','suggested')),
  type_compatibility       TEXT NOT NULL,
  validation_json          TEXT NOT NULL,                   -- MappingValidation as JSON; small, opaque
  validation_resolved      INTEGER NOT NULL DEFAULT 0,
  remarks                  TEXT,
  approved_by              TEXT,
  approved_at              INTEGER,
  confidence               REAL NOT NULL DEFAULT 0,
  created_at               INTEGER NOT NULL,
  updated_at               INTEGER NOT NULL,
  PRIMARY KEY (project_id, id)
);
CREATE INDEX idx_colmap_src     ON column_mappings(project_id, source_table, source_column);
CREATE INDEX idx_colmap_tgt     ON column_mappings(project_id, target_table, target_column);

-- Transformations are nested under column_mappings. Renderer-side `id` is also
-- not globally unique. Use a synthetic auto-incrementing PK; renderer's id is
-- preserved as a regular column for round-trip fidelity.
CREATE TABLE transformations (
  pk                 INTEGER PRIMARY KEY AUTOINCREMENT,
  id                 TEXT NOT NULL,
  project_id         TEXT NOT NULL,
  column_mapping_id  TEXT NOT NULL,
  sequence           INTEGER NOT NULL,
  type               TEXT NOT NULL,
  params_json        TEXT,
  expression         TEXT,
  FOREIGN KEY (project_id, column_mapping_id) REFERENCES column_mappings(project_id, id) ON DELETE CASCADE,
  UNIQUE (project_id, column_mapping_id, sequence)
);
CREATE INDEX idx_transformations_mapping ON transformations(project_id, column_mapping_id);

-- -----------------------------------------------------------------------------
-- Flowcharts: PUMLDiagram is read/written as a unit; don't decompose.
-- -----------------------------------------------------------------------------
CREATE TABLE flowchart_scripts (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  raw_content   TEXT NOT NULL,
  data_json     BLOB NOT NULL,                              -- gzip(JSON.stringify(PUMLDiagram))
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    INTEGER NOT NULL,
  updated_at    INTEGER NOT NULL
);
CREATE INDEX idx_flowcharts_order ON flowchart_scripts(display_order);

-- -----------------------------------------------------------------------------
-- ERD per-table positions. Keyed by (script_id, table_key) where table_key is
-- "schema.table_name" — survives reparses (which regenerate numeric Table.id).
-- Replaces erd_positions_<scriptId> localStorage keys.
-- -----------------------------------------------------------------------------
CREATE TABLE erd_layouts (
  script_id   TEXT NOT NULL REFERENCES scripts(id) ON DELETE CASCADE,
  table_key   TEXT NOT NULL,
  x           REAL NOT NULL,
  y           REAL NOT NULL,
  PRIMARY KEY (script_id, table_key)
);

-- -----------------------------------------------------------------------------
-- meta: small key/value store for prefs that don't deserve their own schema.
-- Replaces a bag of localStorage keys (theme, theme_variant, dd_visible_columns,
-- dd_column_widths, schema_states, mapping_workspace, etc.). Values are JSON.
-- -----------------------------------------------------------------------------
CREATE TABLE meta (
  key    TEXT PRIMARY KEY,
  value  TEXT NOT NULL                                      -- JSON-encoded
);
