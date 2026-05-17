// =============================================================================
// One-shot migration: workspace-shards/ → SQLite.
//
// Read-only against the shard layout. The shards stay on disk untouched so
// the renderer can fall back to them if anything goes wrong.
//
// Phase 2 validation (separate module) compares the resulting WorkspaceData
// against the shard-loaded WorkspaceData via deep-eq.
// =============================================================================

const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;

const dbModule = require('./db.cjs');

function shardsRoot(app) {
  return path.join(app.getPath('userData'), 'workspace-shards');
}

async function readJsonIfExists(file) {
  try {
    const raw = await fsp.readFile(file, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

function safeShardName(id) {
  return String(id).replace(/[^a-zA-Z0-9_.-]/g, '_');
}

// -----------------------------------------------------------------------------
// migrateFromShards(app)
//
// Returns:
//   { success: true, counts: { scripts, tables, columns, ... }, durationMs }
//   { success: false, error: string }
// -----------------------------------------------------------------------------
async function migrateFromShards(app) {
  const t0 = Date.now();

  const root = shardsRoot(app);
  const manifest = await readJsonIfExists(path.join(root, 'manifest.json'));
  if (!manifest) {
    return { success: false, error: 'No shards manifest found at ' + root };
  }
  const meta = (await readJsonIfExists(path.join(root, 'meta.json'))) || {};

  const scriptIds = Array.isArray(manifest.scriptIds) ? manifest.scriptIds : [];
  const flowIds   = Array.isArray(manifest.flowchartIds) ? manifest.flowchartIds : [];

  const scripts = [];
  for (let i = 0; i < scriptIds.length; i++) {
    const id = scriptIds[i];
    const file = path.join(root, 'scripts', safeShardName(id) + '.json');
    const data = await readJsonIfExists(file);
    if (data) {
      // Carry display order so the saveDiff path can persist it.
      data._displayOrder = i;
      scripts.push(data);
    }
  }

  const flowcharts = [];
  for (let i = 0; i < flowIds.length; i++) {
    const id = flowIds[i];
    const file = path.join(root, 'flowcharts', safeShardName(id) + '.json');
    const data = await readJsonIfExists(file);
    if (data) {
      data._displayOrder = i;
      flowcharts.push(data);
    }
  }

  // Open DB (creates and migrates schema if needed).
  dbModule.openDb(app);

  // Treat the migration as a single saveDiff: everything is "changed".
  // saveDiff opens its own transaction, so this is atomic — a crash mid-write
  // rolls back and leaves the DB schema-only-but-empty for retry next launch.
  let saveResult;
  try {
    saveResult = dbModule.saveDiff({
      changedScripts: scripts,
      removedScriptIds: [],
      changedFlowcharts: flowcharts,
      removedFlowchartIds: [],
      meta: {
        theme: meta.theme,
        themeVariant: meta.themeVariant,
        mappingProjects: Array.isArray(meta.mappingProjects) ? meta.mappingProjects : [],
        typeRuleSets: Array.isArray(meta.typeRuleSets) ? meta.typeRuleSets : [],
        erdPositions: meta.erdPositions || {},
        ddVisibleColumns: meta.ddVisibleColumns,
        ddColumnWidths: meta.ddColumnWidths,
      },
    });
  } catch (err) {
    return { success: false, error: 'saveDiff failed: ' + (err.message || String(err)) };
  }

  // Mark migration complete in meta KV.
  try {
    const stmts = dbModule._internal.stmts();
    stmts.upsertMeta.run('migrated_from_shards_at', JSON.stringify(new Date().toISOString()));
    stmts.upsertMeta.run('migrated_from_shards_manifest_version',
      JSON.stringify(manifest.version || 'unknown'));
  } catch {}

  const status = dbModule.status();
  return {
    success: true,
    durationMs: Date.now() - t0,
    counts: {
      scripts: scripts.length,
      flowcharts: flowcharts.length,
      tables: countTables(scripts),
      columns: countColumns(scripts),
      versions: countVersions(scripts),
      mappingProjects: (meta.mappingProjects || []).length,
      typeRuleSets: (meta.typeRuleSets || []).length,
      // Post-write counts for sanity:
      dbScriptCount: status.scriptCount,
      dbColumnCount: status.columnCount,
      dbSize: status.dbSize,
    },
    // Anything that couldn't be inserted because of an FK orphan (legacy data
    // drift). Surfaced so the UI can warn the user and Settings can offer a
    // cleanup of the source shards if needed.
    skipped: (saveResult && saveResult.skipped) || {},
  };
}

function countTables(scripts) {
  let n = 0;
  for (const s of scripts) {
    n += (s.data?.targets || []).length + (s.data?.sources || []).length;
  }
  return n;
}

function countColumns(scripts) {
  let n = 0;
  for (const s of scripts) {
    for (const t of [...(s.data?.targets || []), ...(s.data?.sources || [])]) {
      n += (t.columns || []).length;
    }
  }
  return n;
}

function countVersions(scripts) {
  let n = 0;
  for (const s of scripts) n += (s.versions || []).length;
  return n;
}

module.exports = { migrateFromShards };
