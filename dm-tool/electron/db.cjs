// =============================================================================
// SQLite persistence module (Electron main process).
//
// Dark-launched in this PR — main.cjs registers IPC handlers that delegate
// here, but the renderer flag (`dm_tool_use_sqlite_storage`) stays OFF by
// default. All existing shard-based storage continues to work unchanged.
//
// Public API (used by main.cjs IPC handlers):
//   openDb(app)               — idempotent; returns a connected Database
//   status()                  — { dbExists, schemaVersion, scriptCount, ... }
//   loadWorkspace()           — returns WorkspaceData-shaped object
//   saveDiff(payload)         — upsert changed scripts/flowcharts/meta in one txn
//   integrityCheck()          — PRAGMA integrity_check; returns 'ok' or error text
//   vacuum()                  — VACUUM; reclaims free pages
//   close()                   — closes the connection (call on quit)
//
// Conventions:
// - better-sqlite3 is synchronous. All public methods are sync; main.cjs wraps
//   them in async IPC handlers.
// - Blobs (version content / data_json, flowchart data_json) are gzip-compressed.
// - Schema bootstrap runs migrations/NNN_*.sql in order, gated by PRAGMA
//   user_version. Wrapped per-file in a transaction.
// - We never throw across the IPC boundary — main.cjs catches and returns
//   { success: false, error }. This module may throw freely.
// =============================================================================

const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

// Lazy require so a missing native module doesn't crash app startup. The
// renderer flag is OFF by default; SQLite isn't touched until first IPC call.
let BetterSqlite3 = null;
function loadDriver() {
  if (BetterSqlite3) return BetterSqlite3;
  BetterSqlite3 = require('better-sqlite3');
  return BetterSqlite3;
}

let db = null;
let stmts = null;
let dbPath = null;

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

// -----------------------------------------------------------------------------
// gzip helpers
// -----------------------------------------------------------------------------
function gz(text) {
  if (text == null) return null;
  return zlib.gzipSync(Buffer.from(text, 'utf-8'));
}
function ungz(buf) {
  if (buf == null) return null;
  return zlib.gunzipSync(buf).toString('utf-8');
}

// -----------------------------------------------------------------------------
// Open / migrate / prepare
// -----------------------------------------------------------------------------
function openDb(app) {
  if (db) return db;
  const Driver = loadDriver();
  dbPath = path.join(app.getPath('userData'), 'workspace.db');

  db = new Driver(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  db.pragma('foreign_keys = ON');
  db.pragma('busy_timeout = 5000');

  runMigrations();
  prepareStatements();
  return db;
}

function close() {
  if (db) {
    try { db.close(); } catch {}
    db = null;
    stmts = null;
  }
}

function runMigrations() {
  let entries;
  try {
    entries = fs.readdirSync(MIGRATIONS_DIR);
  } catch (err) {
    if (err.code === 'ENOENT') return; // no migrations yet
    throw err;
  }

  const files = entries
    .filter((n) => /^(\d+)_.+\.sql$/.test(n))
    .map((n) => ({ name: n, version: parseInt(n.match(/^(\d+)_/)[1], 10) }))
    .sort((a, b) => a.version - b.version);

  const current = db.pragma('user_version', { simple: true });

  for (const f of files) {
    if (f.version <= current) continue;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, f.name), 'utf-8');
    // Each migration runs in its own transaction. If it throws, rollback and
    // re-throw; the next launch will retry the same file from the same point.
    db.exec('BEGIN');
    try {
      db.exec(sql);
      db.pragma(`user_version = ${f.version}`);
      db.exec('COMMIT');
    } catch (err) {
      try { db.exec('ROLLBACK'); } catch {}
      throw new Error(`Migration ${f.name} failed: ${err.message}`);
    }
  }
}

function prepareStatements() {
  stmts = {
    // scripts
    upsertScript: db.prepare(`
      INSERT INTO scripts (id, name, type, current_version_id, versioning_enabled, max_versions, display_order, created_at, updated_at)
      VALUES (@id, @name, @type, @current_version_id, @versioning_enabled, @max_versions, @display_order, @created_at, @updated_at)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        type = excluded.type,
        current_version_id = excluded.current_version_id,
        versioning_enabled = excluded.versioning_enabled,
        max_versions = excluded.max_versions,
        display_order = excluded.display_order,
        updated_at = excluded.updated_at
    `),
    deleteScript: db.prepare(`DELETE FROM scripts WHERE id = ?`),
    selectScripts: db.prepare(`SELECT * FROM scripts ORDER BY display_order, created_at`),

    // tables / columns / constraints — replace-per-script semantics
    deleteTablesForScript: db.prepare(`DELETE FROM tables WHERE script_id = ?`),
    insertTable: db.prepare(`
      INSERT INTO tables (script_id, ordinal, schema, table_name, description, to_ignore, explanation_completed, t_checked, legacy_id, is_source)
      VALUES (@script_id, @ordinal, @schema, @table_name, @description, @to_ignore, @explanation_completed, @t_checked, @legacy_id, @is_source)
    `),
    insertColumn: db.prepare(`
      INSERT INTO columns (table_id, ordinal, name, type, nullable, default_value, explanation, mapping, migration_needed, non_migration_comment, sample_values_json, possible_values)
      VALUES (@table_id, @ordinal, @name, @type, @nullable, @default_value, @explanation, @mapping, @migration_needed, @non_migration_comment, @sample_values_json, @possible_values)
    `),
    insertConstraint: db.prepare(`
      INSERT INTO constraints (table_id, ordinal, name, type, local_cols, ref)
      VALUES (@table_id, @ordinal, @name, @type, @local_cols, @ref)
    `),
    selectTablesForScript: db.prepare(`SELECT * FROM tables WHERE script_id = ? ORDER BY is_source, ordinal`),
    selectColumnsForTable:  db.prepare(`SELECT * FROM columns WHERE table_id = ? ORDER BY ordinal`),
    selectConstraintsForTable: db.prepare(`SELECT * FROM constraints WHERE table_id = ? ORDER BY ordinal`),

    // versions
    deleteVersionsForScript: db.prepare(`DELETE FROM script_versions WHERE script_id = ?`),
    deleteVersionById: db.prepare(`DELETE FROM script_versions WHERE id = ?`),
    insertVersion: db.prepare(`
      INSERT INTO script_versions (id, script_id, version_number, content, data_json, summary_json, message, created_at)
      VALUES (@id, @script_id, @version_number, @content, @data_json, @summary_json, @message, @created_at)
    `),
    selectVersionsForScript: db.prepare(`
      SELECT id, script_id, version_number, summary_json, message, created_at
      FROM script_versions WHERE script_id = ? ORDER BY version_number DESC
    `),
    selectVersionContent: db.prepare(`SELECT content, data_json FROM script_versions WHERE id = ?`),

    // master codes
    deleteMasterCodesForScript: db.prepare(`DELETE FROM master_codes WHERE script_id = ?`),
    insertMasterCode: db.prepare(`
      INSERT INTO master_codes (script_id, ordinal, key, definition) VALUES (?, ?, ?, ?)
    `),
    selectMasterCodesForScript: db.prepare(`SELECT key, definition FROM master_codes WHERE script_id = ? ORDER BY ordinal`),

    deleteMasterCodeCategoriesForScript: db.prepare(`DELETE FROM master_code_categories WHERE script_id = ?`),
    insertMasterCodeCategory: db.prepare(`
      INSERT INTO master_code_categories (script_id, ordinal, key, definition) VALUES (?, ?, ?, ?)
    `),
    selectMasterCodeCategoriesForScript: db.prepare(`SELECT key, definition FROM master_code_categories WHERE script_id = ? ORDER BY ordinal`),

    // sample data
    deleteSampleAttachmentsForScript: db.prepare(`DELETE FROM sample_data_attachments WHERE script_id = ?`),
    insertSampleAttachment: db.prepare(`
      INSERT INTO sample_data_attachments (id, script_id, file_name, uploaded_at, match_results, warnings_json)
      VALUES (@id, @script_id, @file_name, @uploaded_at, @match_results, @warnings_json)
    `),
    selectSampleAttachmentsForScript: db.prepare(`SELECT * FROM sample_data_attachments WHERE script_id = ? ORDER BY uploaded_at`),

    // type rule sets — replace-all semantics
    deleteAllTypeRuleSets: db.prepare(`DELETE FROM type_rule_sets`),
    insertTypeRuleSet: db.prepare(`
      INSERT INTO type_rule_sets (id, name, description, source_db, target_db, is_built_in, created_at, updated_at)
      VALUES (@id, @name, @description, @source_db, @target_db, @is_built_in, @created_at, @updated_at)
    `),
    insertTypeRule: db.prepare(`
      INSERT INTO type_rules (id, rule_set_id, name, description, source_pattern, target_pattern, compatibility, conversion_sql, warning, priority, enabled)
      VALUES (@id, @rule_set_id, @name, @description, @source_pattern, @target_pattern, @compatibility, @conversion_sql, @warning, @priority, @enabled)
    `),
    selectTypeRuleSets: db.prepare(`SELECT * FROM type_rule_sets ORDER BY created_at`),
    selectTypeRulesForSet: db.prepare(`SELECT * FROM type_rules WHERE rule_set_id = ? ORDER BY priority DESC`),

    // mapping projects — replace-all semantics
    deleteAllMappingProjects: db.prepare(`DELETE FROM mapping_projects`),
    insertMappingProject: db.prepare(`
      INSERT INTO mapping_projects (id, name, source_script_id, target_script_id, type_rule_set_id, created_at, updated_at)
      VALUES (@id, @name, @source_script_id, @target_script_id, @type_rule_set_id, @created_at, @updated_at)
    `),
    insertTableMapping: db.prepare(`
      INSERT INTO table_mappings (project_id, source_table, target_table, status, auto_map_count, manual_map_count)
      VALUES (@project_id, @source_table, @target_table, @status, @auto_map_count, @manual_map_count)
    `),
    insertColumnMapping: db.prepare(`
      INSERT INTO column_mappings (id, project_id, source_script_id, source_table, source_column, source_type, target_script_id, target_table, target_column, target_type, map_type, type_compatibility, validation_json, validation_resolved, remarks, approved_by, approved_at, confidence, created_at, updated_at)
      VALUES (@id, @project_id, @source_script_id, @source_table, @source_column, @source_type, @target_script_id, @target_table, @target_column, @target_type, @map_type, @type_compatibility, @validation_json, @validation_resolved, @remarks, @approved_by, @approved_at, @confidence, @created_at, @updated_at)
    `),
    insertTransformation: db.prepare(`
      INSERT INTO transformations (id, project_id, column_mapping_id, sequence, type, params_json, expression)
      VALUES (@id, @project_id, @column_mapping_id, @sequence, @type, @params_json, @expression)
    `),
    selectMappingProjects: db.prepare(`SELECT * FROM mapping_projects ORDER BY created_at`),
    selectTableMappingsForProject: db.prepare(`SELECT * FROM table_mappings WHERE project_id = ?`),
    selectColumnMappingsForProject: db.prepare(`SELECT * FROM column_mappings WHERE project_id = ? ORDER BY created_at`),
    selectTransformationsForMapping: db.prepare(`SELECT * FROM transformations WHERE project_id = ? AND column_mapping_id = ? ORDER BY sequence`),

    // flowcharts
    upsertFlowchart: db.prepare(`
      INSERT INTO flowchart_scripts (id, name, raw_content, data_json, display_order, created_at, updated_at)
      VALUES (@id, @name, @raw_content, @data_json, @display_order, @created_at, @updated_at)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        raw_content = excluded.raw_content,
        data_json = excluded.data_json,
        display_order = excluded.display_order,
        updated_at = excluded.updated_at
    `),
    deleteFlowchart: db.prepare(`DELETE FROM flowchart_scripts WHERE id = ?`),
    selectFlowcharts: db.prepare(`SELECT * FROM flowchart_scripts ORDER BY display_order, created_at`),

    // erd layouts — replace-all-for-script semantics on save
    deleteErdLayoutsForScript: db.prepare(`DELETE FROM erd_layouts WHERE script_id = ?`),
    insertErdLayout: db.prepare(`INSERT INTO erd_layouts (script_id, table_key, x, y) VALUES (?, ?, ?, ?)`),
    selectAllErdLayouts: db.prepare(`SELECT * FROM erd_layouts`),

    // meta KV
    upsertMeta: db.prepare(`
      INSERT INTO meta (key, value) VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `),
    deleteMeta: db.prepare(`DELETE FROM meta WHERE key = ?`),
    selectAllMeta: db.prepare(`SELECT key, value FROM meta`),
    selectMeta: db.prepare(`SELECT value FROM meta WHERE key = ?`),

    // info
    countScripts: db.prepare(`SELECT COUNT(*) as n FROM scripts`),
    countColumns: db.prepare(`SELECT COUNT(*) as n FROM columns`),
    scriptExists: db.prepare(`SELECT 1 FROM scripts WHERE id = ?`),
    typeRuleSetExists: db.prepare(`SELECT 1 FROM type_rule_sets WHERE id = ?`),
  };
}

// -----------------------------------------------------------------------------
// status
// -----------------------------------------------------------------------------
function status() {
  if (!db) return { dbOpen: false };
  const schemaVersion = db.pragma('user_version', { simple: true });
  const scriptCount = stmts.countScripts.get().n;
  const columnCount = stmts.countColumns.get().n;
  const dbSize = (() => {
    try { return fs.statSync(dbPath).size; } catch { return 0; }
  })();
  return { dbOpen: true, dbPath, schemaVersion, scriptCount, columnCount, dbSize };
}

// -----------------------------------------------------------------------------
// loadWorkspace — assembles a WorkspaceData-shaped object from SQLite.
// Versions are returned WITHOUT content/data_json (lazy-loaded on demand
// elsewhere). Each version carries its summary_json so the version-list UI
// renders without extra round-trips.
// -----------------------------------------------------------------------------
function loadWorkspace() {
  if (!db) throw new Error('DB not open');

  const scripts = stmts.selectScripts.all().map((row) => hydrateScript(row));
  const flowchartScripts = stmts.selectFlowcharts.all().map((row) => hydrateFlowchart(row));
  const typeRuleSets = stmts.selectTypeRuleSets.all().map((row) => hydrateTypeRuleSet(row));
  const mappingProjects = stmts.selectMappingProjects.all().map((row) => hydrateMappingProject(row));

  // ERD positions: nested map { scriptId: { tableKey: {x,y} } }
  const erdPositions = {};
  for (const r of stmts.selectAllErdLayouts.all()) {
    if (!erdPositions[r.script_id]) erdPositions[r.script_id] = {};
    erdPositions[r.script_id][r.table_key] = { x: r.x, y: r.y };
  }

  // Meta KV → spread into the WorkspaceData top level
  const meta = {};
  for (const r of stmts.selectAllMeta.all()) {
    try { meta[r.key] = JSON.parse(r.value); } catch { meta[r.key] = r.value; }
  }

  return {
    version: '1.1.0',
    exportDate: new Date().toISOString(),
    scripts,
    flowchartScripts,
    mappingProjects,
    typeRuleSets,
    theme: meta.theme || 'light',
    themeVariant: meta.themeVariant || 'slate',
    erdPositions,
    ddVisibleColumns: meta.ddVisibleColumns,
    ddColumnWidths: meta.ddColumnWidths,
  };
}

function hydrateScript(row) {
  // Build data { targets, sources } from decomposed tables/columns/constraints.
  const targets = [];
  const sources = [];
  for (const t of stmts.selectTablesForScript.all(row.id)) {
    const cols = stmts.selectColumnsForTable.all(t.id).map((c) => ({
      name: c.name,
      type: c.type,
      nullable: c.nullable,
      default: c.default_value,
      explanation: c.explanation,
      mapping: c.mapping,
      ...(c.migration_needed != null ? { migrationNeeded: !!c.migration_needed } : {}),
      ...(c.non_migration_comment != null ? { nonMigrationComment: c.non_migration_comment } : {}),
      ...(c.sample_values_json ? { sampleValues: safeParse(c.sample_values_json, []) } : {}),
      ...(c.possible_values != null ? { possibleValues: c.possible_values } : {}),
    }));
    const cons = stmts.selectConstraintsForTable.all(t.id).map((k) => ({
      name: k.name,
      type: k.type,
      localCols: k.local_cols,
      ...(k.ref != null ? { ref: k.ref } : {}),
    }));
    const tableObj = {
      id: t.legacy_id != null ? t.legacy_id : t.id,
      schema: t.schema,
      tableName: t.table_name,
      description: t.description,
      constraints: cons,
      columns: cols,
      ...(t.to_ignore ? { toIgnore: true } : {}),
      ...(t.explanation_completed ? { explanationCompleted: true } : {}),
      ...(t.t_checked ? { _tChecked: true } : {}),
    };
    (t.is_source ? sources : targets).push(tableObj);
  }

  // Versions metadata only (lazy content)
  const versions = stmts.selectVersionsForScript.all(row.id).map((v) => ({
    id: v.id,
    versionNumber: v.version_number,
    // content/data populated lazily — placeholders preserve renderer typing
    content: '',
    data: { targets: [], sources: [] },
    message: v.message || undefined,
    createdAt: v.created_at,
    _summary: v.summary_json ? safeParse(v.summary_json, null) : null,
  }));

  // Reconstruct rawContent from current version (decompressed). If absent, ''.
  let rawContent = '';
  if (row.current_version_id) {
    const cv = stmts.selectVersionContent.get(row.current_version_id);
    if (cv && cv.content) rawContent = ungz(cv.content) || '';
  }

  const masterCodes = stmts.selectMasterCodesForScript.all(row.id);
  const masterCodeCategories = stmts.selectMasterCodeCategoriesForScript.all(row.id);
  const sampleAttachments = stmts.selectSampleAttachmentsForScript.all(row.id).map((a) => ({
    id: a.id,
    fileName: a.file_name,
    uploadedAt: a.uploaded_at,
    matchResults: safeParse(a.match_results, []),
    warnings: safeParse(a.warnings_json, []),
  }));

  const script = {
    id: row.id,
    name: row.name,
    type: row.type,
    rawContent,
    data: { targets, sources },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
  if (row.current_version_id) script.currentVersionId = row.current_version_id;
  if (versions.length) script.versions = versions;
  if (row.versioning_enabled) script.versioningEnabled = true;
  if (row.max_versions) script.maxVersions = row.max_versions;
  if (sampleAttachments.length) script.sampleDataAttachments = sampleAttachments;
  if (masterCodes.length) script.masterCodes = masterCodes;
  if (masterCodeCategories.length) script.masterCodeCategories = masterCodeCategories;
  return script;
}

function hydrateFlowchart(row) {
  const dataStr = row.data_json ? ungz(row.data_json) : '{}';
  return {
    id: row.id,
    name: row.name,
    rawContent: row.raw_content,
    data: safeParse(dataStr, { name: row.name, nodes: [], connections: [], swimlanes: [], partitions: [], notes: [] }),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function hydrateTypeRuleSet(row) {
  const rules = stmts.selectTypeRulesForSet.all(row.id).map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description || undefined,
    sourcePattern: r.source_pattern,
    targetPattern: r.target_pattern,
    compatibility: r.compatibility,
    conversionSql: r.conversion_sql || undefined,
    warning: r.warning || undefined,
    priority: r.priority,
    enabled: !!r.enabled,
  }));
  return {
    id: row.id,
    name: row.name,
    description: row.description || undefined,
    sourceDb: row.source_db,
    targetDb: row.target_db,
    rules,
    isBuiltIn: !!row.is_built_in,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function hydrateMappingProject(row) {
  const tableMappings = stmts.selectTableMappingsForProject.all(row.id).map((tm) => ({
    sourceTable: tm.source_table,
    targetTable: tm.target_table,
    status: tm.status,
    autoMapCount: tm.auto_map_count,
    manualMapCount: tm.manual_map_count,
  }));
  const mappings = stmts.selectColumnMappingsForProject.all(row.id).map((m) => {
    const transformations = stmts.selectTransformationsForMapping.all(row.id, m.id).map((t) => ({
      id: t.id,
      type: t.type,
      sequence: t.sequence,
      ...(t.params_json ? { params: safeParse(t.params_json, {}) } : {}),
      ...(t.expression != null ? { expression: t.expression } : {}),
    }));
    return {
      id: m.id,
      sourceScriptId: m.source_script_id,
      sourceTable: m.source_table,
      sourceColumn: m.source_column,
      sourceType: m.source_type,
      targetScriptId: m.target_script_id,
      targetTable: m.target_table,
      targetColumn: m.target_column,
      targetType: m.target_type,
      mapType: m.map_type,
      typeCompatibility: m.type_compatibility,
      validation: safeParse(m.validation_json, {}),
      ...(m.validation_resolved ? { validationResolved: true } : {}),
      transformations,
      ...(m.remarks != null ? { remarks: m.remarks } : {}),
      ...(m.approved_by != null ? { approvedBy: m.approved_by } : {}),
      ...(m.approved_at != null ? { approvedAt: m.approved_at } : {}),
      confidence: m.confidence,
      createdAt: m.created_at,
      updatedAt: m.updated_at,
    };
  });
  return {
    id: row.id,
    name: row.name,
    sourceScriptId: row.source_script_id,
    targetScriptId: row.target_script_id,
    mappings,
    tableMappings,
    ...(row.type_rule_set_id ? { typeRuleSetId: row.type_rule_set_id } : {}),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function safeParse(s, fallback) {
  try { return JSON.parse(s); } catch { return fallback; }
}

// -----------------------------------------------------------------------------
// saveDiff — payload mirrors the existing ShardSavePayload from the renderer:
//   {
//     changedScripts: Script[],
//     removedScriptIds: string[],
//     changedFlowcharts: FlowchartScript[],
//     removedFlowchartIds: string[],
//     meta: { theme, themeVariant, mappingProjects, typeRuleSets, erdPositions,
//             ddVisibleColumns, ddColumnWidths }
//   }
// All work runs in one transaction.
// -----------------------------------------------------------------------------
function saveDiff(payload) {
  if (!db) throw new Error('DB not open');

  // Counters returned to the caller for telemetry / migration reports.
  const skipped = {
    erdOrphanScripts: 0,         // ERD positions whose script_id doesn't exist
    mappingProjectsMissingScript: 0,  // project's source/target script doesn't exist
    mappingProjectsRuleSetNulled: 0,  // typeRuleSetId pointed at a missing rule set
  };

  const txn = db.transaction((p) => {
    // --- Scripts: remove first, then upsert
    for (const id of p.removedScriptIds || []) stmts.deleteScript.run(id);
    for (const s of p.changedScripts || []) writeScript(s);

    // --- Flowcharts
    for (const id of p.removedFlowchartIds || []) stmts.deleteFlowchart.run(id);
    for (const f of p.changedFlowcharts || []) writeFlowchart(f);

    // --- Meta (small; replace-all-or-none for the lists, KV for scalars)
    const meta = p.meta || {};

    if (meta.theme != null) stmts.upsertMeta.run('theme', JSON.stringify(meta.theme));
    if (meta.themeVariant != null) stmts.upsertMeta.run('themeVariant', JSON.stringify(meta.themeVariant));
    if (meta.ddVisibleColumns !== undefined) stmts.upsertMeta.run('ddVisibleColumns', JSON.stringify(meta.ddVisibleColumns));
    if (meta.ddColumnWidths !== undefined) stmts.upsertMeta.run('ddColumnWidths', JSON.stringify(meta.ddColumnWidths));

    // Order matters here. mapping_projects.type_rule_set_id has NO ON DELETE
    // action (it's nullable; the FK is RESTRICT by default), so deleting from
    // type_rule_sets while a mapping project still references one fails.
    // We always delete mapping_projects FIRST, then refresh type_rule_sets,
    // then re-insert mapping_projects with FK validation.
    const willReplaceMappingProjects = Array.isArray(meta.mappingProjects);
    const willReplaceTypeRuleSets = Array.isArray(meta.typeRuleSets);

    if (willReplaceMappingProjects) {
      stmts.deleteAllMappingProjects.run(); // cascades to table_mappings, column_mappings, transformations
    }

    if (willReplaceTypeRuleSets) {
      stmts.deleteAllTypeRuleSets.run(); // cascades to type_rules; safe now that mapping_projects is empty
      for (const rs of meta.typeRuleSets) writeTypeRuleSet(rs);
    }

    // Mapping projects come AFTER scripts and type_rule_sets are in, because
    // we validate each project's FKs before inserting it. Projects referencing
    // a script that doesn't exist are skipped; missing typeRuleSetId is nulled.
    if (willReplaceMappingProjects) {
      for (const mp of meta.mappingProjects) {
        if (!stmts.scriptExists.get(mp.sourceScriptId) || !stmts.scriptExists.get(mp.targetScriptId)) {
          skipped.mappingProjectsMissingScript++;
          continue;
        }
        let projectToWrite = mp;
        if (mp.typeRuleSetId && !stmts.typeRuleSetExists.get(mp.typeRuleSetId)) {
          projectToWrite = { ...mp, typeRuleSetId: undefined };
          skipped.mappingProjectsRuleSetNulled++;
        }
        writeMappingProject(projectToWrite);
      }
    }

    if (meta.erdPositions && typeof meta.erdPositions === 'object') {
      // For each script present in payload, replace its ERD layout rows.
      // Orphan keys (compound source_target ids that leak in from the mapping
      // canvas, scripts deleted while ERD positions stuck around, etc.) are
      // skipped with a counter — they would otherwise FK-fail and abort.
      for (const [scriptId, positions] of Object.entries(meta.erdPositions)) {
        if (!stmts.scriptExists.get(scriptId)) {
          skipped.erdOrphanScripts++;
          continue;
        }
        stmts.deleteErdLayoutsForScript.run(scriptId);
        if (positions && typeof positions === 'object') {
          for (const [tableKey, pos] of Object.entries(positions)) {
            if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') continue;
            stmts.insertErdLayout.run(scriptId, tableKey, pos.x, pos.y);
          }
        }
      }
    }
  });

  txn(payload);
  return { skipped };
}

function writeScript(s) {
  stmts.upsertScript.run({
    id: s.id,
    name: s.name,
    type: s.type,
    current_version_id: s.currentVersionId || null,
    versioning_enabled: s.versioningEnabled ? 1 : 0,
    max_versions: s.maxVersions || 50,
    display_order: typeof s._displayOrder === 'number' ? s._displayOrder : 0,
    created_at: s.createdAt,
    updated_at: s.updatedAt,
  });

  // Replace tables/columns/constraints for this script.
  stmts.deleteTablesForScript.run(s.id);
  if (s.data) {
    writeTablesFor(s.id, s.data.targets || [], 0);
    writeTablesFor(s.id, s.data.sources || [], 1);
  }

  // Master codes & categories — replace for this script.
  stmts.deleteMasterCodesForScript.run(s.id);
  (s.masterCodes || []).forEach((m, i) => {
    stmts.insertMasterCode.run(s.id, i, m.key, m.definition || '');
  });
  stmts.deleteMasterCodeCategoriesForScript.run(s.id);
  (s.masterCodeCategories || []).forEach((m, i) => {
    stmts.insertMasterCodeCategory.run(s.id, i, m.key, m.definition || '');
  });

  // Sample data attachments — replace for this script.
  stmts.deleteSampleAttachmentsForScript.run(s.id);
  for (const a of s.sampleDataAttachments || []) {
    stmts.insertSampleAttachment.run({
      id: a.id,
      script_id: s.id,
      file_name: a.fileName,
      uploaded_at: a.uploadedAt,
      match_results: JSON.stringify(a.matchResults || []),
      warnings_json: JSON.stringify(a.warnings || []),
    });
  }

  // Versions: reconcile by id. Insert new ones, leave existing ones alone.
  // Removal of versions beyond maxVersions is the renderer's responsibility;
  // we delete here only versions that disappeared from the array.
  if (Array.isArray(s.versions)) {
    const existing = new Set(stmts.selectVersionsForScript.all(s.id).map((v) => v.id));
    const incoming = new Set(s.versions.map((v) => v.id));
    for (const oldId of existing) {
      if (!incoming.has(oldId)) stmts.deleteVersionById.run(oldId);
    }
    for (const v of s.versions) {
      if (existing.has(v.id)) continue;
      const isCurrent = v.id === s.currentVersionId;
      const summary = computeVersionSummary(v.data);
      stmts.insertVersion.run({
        id: v.id,
        script_id: s.id,
        version_number: v.versionNumber,
        content: gz(v.content || ''),
        // Drop parsed data on history; keep only on the current version for fast restore.
        data_json: isCurrent && v.data ? gz(JSON.stringify(v.data)) : null,
        summary_json: summary ? JSON.stringify(summary) : null,
        message: v.message || null,
        created_at: v.createdAt,
      });
    }
  }
}

function writeTablesFor(scriptId, list, isSource) {
  list.forEach((t, ti) => {
    const info = stmts.insertTable.run({
      script_id: scriptId,
      ordinal: ti,
      schema: t.schema || '',
      table_name: t.tableName || '',
      description: t.description || '',
      to_ignore: t.toIgnore ? 1 : 0,
      explanation_completed: t.explanationCompleted ? 1 : 0,
      t_checked: t._tChecked ? 1 : 0,
      legacy_id: typeof t.id === 'number' ? t.id : null,
      is_source: isSource,
    });
    const tableId = info.lastInsertRowid;

    (t.columns || []).forEach((c, ci) => {
      stmts.insertColumn.run({
        table_id: tableId,
        ordinal: ci,
        name: c.name || '',
        type: c.type || '',
        nullable: c.nullable || '',
        default_value: c.default == null ? null : c.default,
        explanation: c.explanation || '',
        mapping: c.mapping || '',
        migration_needed: c.migrationNeeded == null ? null : (c.migrationNeeded ? 1 : 0),
        non_migration_comment: c.nonMigrationComment == null ? null : c.nonMigrationComment,
        sample_values_json: Array.isArray(c.sampleValues) ? JSON.stringify(c.sampleValues) : null,
        possible_values: c.possibleValues == null ? null : c.possibleValues,
      });
    });

    (t.constraints || []).forEach((k, ki) => {
      stmts.insertConstraint.run({
        table_id: tableId,
        ordinal: ki,
        name: k.name || '',
        type: k.type,
        local_cols: k.localCols || '',
        ref: k.ref == null ? null : k.ref,
      });
    });
  });
}

function computeVersionSummary(data) {
  if (!data) return null;
  const targets = data.targets || [];
  const sources = data.sources || [];
  let columnCount = 0;
  for (const t of [...targets, ...sources]) columnCount += (t.columns || []).length;
  return {
    tableCount: targets.length + sources.length,
    targetTableCount: targets.length,
    sourceTableCount: sources.length,
    columnCount,
  };
}

function writeFlowchart(f) {
  stmts.upsertFlowchart.run({
    id: f.id,
    name: f.name,
    raw_content: f.rawContent || '',
    data_json: gz(JSON.stringify(f.data || {})),
    display_order: typeof f._displayOrder === 'number' ? f._displayOrder : 0,
    created_at: f.createdAt,
    updated_at: f.updatedAt,
  });
}

function writeTypeRuleSet(rs) {
  stmts.insertTypeRuleSet.run({
    id: rs.id,
    name: rs.name,
    description: rs.description || null,
    source_db: rs.sourceDb,
    target_db: rs.targetDb,
    is_built_in: rs.isBuiltIn ? 1 : 0,
    created_at: rs.createdAt,
    updated_at: rs.updatedAt,
  });
  for (const r of rs.rules || []) {
    stmts.insertTypeRule.run({
      id: r.id,
      rule_set_id: rs.id,
      name: r.name,
      description: r.description || null,
      source_pattern: r.sourcePattern,
      target_pattern: r.targetPattern,
      compatibility: r.compatibility,
      conversion_sql: r.conversionSql || null,
      warning: r.warning || null,
      priority: r.priority || 0,
      enabled: r.enabled === false ? 0 : 1,
    });
  }
}

function writeMappingProject(mp) {
  stmts.insertMappingProject.run({
    id: mp.id,
    name: mp.name,
    source_script_id: mp.sourceScriptId,
    target_script_id: mp.targetScriptId,
    type_rule_set_id: mp.typeRuleSetId || null,
    created_at: mp.createdAt,
    updated_at: mp.updatedAt,
  });
  for (const tm of mp.tableMappings || []) {
    stmts.insertTableMapping.run({
      project_id: mp.id,
      source_table: tm.sourceTable,
      target_table: tm.targetTable,
      status: tm.status,
      auto_map_count: tm.autoMapCount || 0,
      manual_map_count: tm.manualMapCount || 0,
    });
  }
  for (const m of mp.mappings || []) {
    stmts.insertColumnMapping.run({
      id: m.id,
      project_id: mp.id,
      source_script_id: m.sourceScriptId,
      source_table: m.sourceTable,
      source_column: m.sourceColumn,
      source_type: m.sourceType,
      target_script_id: m.targetScriptId,
      target_table: m.targetTable,
      target_column: m.targetColumn,
      target_type: m.targetType,
      map_type: m.mapType,
      type_compatibility: m.typeCompatibility,
      validation_json: JSON.stringify(m.validation || {}),
      validation_resolved: m.validationResolved ? 1 : 0,
      remarks: m.remarks || null,
      approved_by: m.approvedBy || null,
      approved_at: m.approvedAt || null,
      confidence: m.confidence || 0,
      created_at: m.createdAt,
      updated_at: m.updatedAt,
    });
    (m.transformations || []).forEach((t, ti) => {
      stmts.insertTransformation.run({
        id: t.id,
        project_id: mp.id,
        column_mapping_id: m.id,
        sequence: typeof t.sequence === 'number' ? t.sequence : ti,
        type: t.type,
        params_json: t.params ? JSON.stringify(t.params) : null,
        expression: t.expression || null,
      });
    });
  }
}

// -----------------------------------------------------------------------------
// Lazy version content fetch (used when user opens a historical version).
// Returns { content, data } where data may be null (drop-on-history policy);
// caller is expected to re-parse from content if data is needed.
// -----------------------------------------------------------------------------
function getVersionContent(versionId) {
  if (!db) throw new Error('DB not open');
  const row = stmts.selectVersionContent.get(versionId);
  if (!row) return null;
  return {
    content: row.content ? ungz(row.content) : '',
    data: row.data_json ? safeParse(ungz(row.data_json), null) : null,
  };
}

// -----------------------------------------------------------------------------
// integrity / vacuum
// -----------------------------------------------------------------------------
function integrityCheck() {
  if (!db) throw new Error('DB not open');
  const result = db.prepare('PRAGMA integrity_check').all();
  // Result is an array of rows like [{ integrity_check: 'ok' }] on success,
  // or multiple rows describing problems.
  const ok = result.length === 1 && result[0].integrity_check === 'ok';
  return { ok, details: result };
}

function vacuum() {
  if (!db) throw new Error('DB not open');
  db.exec('VACUUM');
}

// Heuristic: VACUUM if free pages exceed 25% of total. Cheap to check.
function vacuumIfNeeded() {
  if (!db) return { ran: false };
  const freelist = db.pragma('freelist_count', { simple: true });
  const total = db.pragma('page_count', { simple: true });
  if (total > 0 && freelist / total > 0.25) {
    vacuum();
    return { ran: true, freelist, total };
  }
  return { ran: false, freelist, total };
}

module.exports = {
  openDb,
  close,
  status,
  loadWorkspace,
  saveDiff,
  getVersionContent,
  integrityCheck,
  vacuum,
  vacuumIfNeeded,
  // exposed for the migration module
  _internal: { stmts: () => stmts, db: () => db, gz, ungz, computeVersionSummary },
};
