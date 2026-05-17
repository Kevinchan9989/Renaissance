// =============================================================================
// Tests for the SQLite persistence layer.
//
// Run via: npm test  (uses Node's built-in node:test runner — zero deps)
//
// Skips gracefully if better-sqlite3 isn't installed yet (fresh clone before
// `npm install` + `npm run rebuild`).
// =============================================================================

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function makeFakeApp(tmpDir) {
  // Mimics enough of Electron's `app` for db.cjs / dbMigration.cjs.
  return {
    getPath(key) {
      if (key === 'userData') return tmpDir;
      return tmpDir;
    },
  };
}

function freshTmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'dm-tool-db-test-'));
}

function rmRecursive(dir) {
  try { fs.rmSync(dir, { recursive: true, force: true }); } catch {}
}

function loadDbModuleFresh() {
  // Bust require cache so each test gets its own module-level state.
  delete require.cache[require.resolve('../db.cjs')];
  delete require.cache[require.resolve('../dbMigration.cjs')];
  return {
    db: require('../db.cjs'),
    migration: require('../dbMigration.cjs'),
  };
}

// Verify the native binding is loadable for the CURRENT Node ABI. Just
// requiring the module isn't enough — the .node addon is loaded lazily on
// first `new Database()`, which is the actual point of failure when Electron
// has rebuilt the binding for its own ABI.
let driverAvailable = true;
try {
  const Driver = require('better-sqlite3');
  const probe = new Driver(':memory:');
  probe.close();
} catch (e) {
  driverAvailable = false;
  console.warn(`[db.test] Skipping all tests: ${e.message?.split('\n')[0] || e}`);
  console.warn('[db.test] If you ran `npm run rebuild`, the binding is built for');
  console.warn('[db.test] Electron, not system Node. Close the app and run `npm install`');
  console.warn('[db.test] (or just run tests from a fresh node_modules before rebuild).');
}

// -----------------------------------------------------------------------------
// Fixtures
// -----------------------------------------------------------------------------

function fixtureScript(overrides = {}) {
  const id = overrides.id || 'script-1';
  return {
    id,
    name: overrides.name || 'OMEGA Test',
    type: overrides.type || 'postgresql',
    rawContent: overrides.rawContent || 'CREATE TABLE foo (id INT);',
    data: overrides.data || {
      targets: [
        {
          id: 1,
          schema: 'public',
          tableName: 'foo',
          description: 'Test table',
          constraints: [
            { name: 'pk_foo', type: 'Primary Key', localCols: 'id' },
          ],
          columns: [
            {
              name: 'id',
              type: 'INT',
              nullable: 'NOT NULL',
              default: null,
              explanation: 'Primary key',
              mapping: '',
              migrationNeeded: true,
              sampleValues: ['1', '2', '3'],
              possibleValues: '1-N',
            },
            {
              name: 'description',
              type: 'TEXT',
              nullable: '',
              default: null,
              explanation: '',
              mapping: '',
            },
          ],
        },
      ],
      sources: [
        {
          id: 2,
          schema: 'src',
          tableName: 'src_foo',
          description: '',
          constraints: [],
          columns: [
            { name: 'id', type: 'NUMBER', nullable: '', default: null, explanation: '', mapping: '' },
          ],
        },
      ],
    },
    createdAt: 1700000000000,
    updatedAt: 1700000001000,
    currentVersionId: overrides.currentVersionId || 'v-1',
    versioningEnabled: true,
    maxVersions: 50,
    versions: overrides.versions || [
      {
        id: 'v-1',
        versionNumber: 1,
        content: 'CREATE TABLE foo (id INT);',
        data: {
          targets: [{ schema: 'public', tableName: 'foo', columns: [{ name: 'id' }] }],
          sources: [],
        },
        message: 'Initial',
        createdAt: 1700000000000,
      },
    ],
    masterCodes: [{ key: 'A', definition: 'Active' }],
    masterCodeCategories: [{ key: 'STATUS', definition: 'Status codes' }],
    sampleDataAttachments: [],
    ...overrides.passthrough,
  };
}

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

test('schema bootstrap: opens DB, creates expected tables, sets user_version', { skip: !driverAvailable }, () => {
  const tmp = freshTmpDir();
  try {
    const { db } = loadDbModuleFresh();
    const realDb = db.openDb(makeFakeApp(tmp));

    // user_version should be at least 1 (after running 001_init.sql).
    const v = realDb.pragma('user_version', { simple: true });
    assert.ok(v >= 1, `expected user_version >= 1, got ${v}`);

    // Sanity-check a few core tables exist.
    const tables = realDb.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all().map((r) => r.name);
    for (const expected of ['scripts', 'tables', 'columns', 'constraints', 'script_versions',
                            'master_codes', 'master_code_categories', 'sample_data_attachments',
                            'mapping_projects', 'table_mappings', 'column_mappings', 'transformations',
                            'type_rule_sets', 'type_rules', 'flowchart_scripts', 'erd_layouts', 'meta']) {
      assert.ok(tables.includes(expected), `missing table: ${expected}`);
    }

    // status() works.
    const s = db.status();
    assert.equal(s.dbOpen, true);
    assert.equal(s.scriptCount, 0);

    db.close();
  } finally {
    rmRecursive(tmp);
  }
});

test('schema bootstrap: idempotent (running twice leaves user_version stable)', { skip: !driverAvailable }, () => {
  const tmp = freshTmpDir();
  try {
    const { db } = loadDbModuleFresh();
    db.openDb(makeFakeApp(tmp));
    const v1 = db._internal.db().pragma('user_version', { simple: true });
    db.close();

    const m2 = loadDbModuleFresh();
    m2.db.openDb(makeFakeApp(tmp));
    const v2 = m2.db._internal.db().pragma('user_version', { simple: true });
    assert.equal(v1, v2);
    m2.db.close();
  } finally {
    rmRecursive(tmp);
  }
});

test('saveDiff + loadWorkspace round-trip: a single script with versions and master codes', { skip: !driverAvailable }, () => {
  const tmp = freshTmpDir();
  try {
    const { db } = loadDbModuleFresh();
    db.openDb(makeFakeApp(tmp));

    const script = fixtureScript();
    db.saveDiff({
      changedScripts: [script],
      removedScriptIds: [],
      changedFlowcharts: [],
      removedFlowchartIds: [],
      meta: { theme: 'light', themeVariant: 'slate' },
    });

    const ws = db.loadWorkspace();
    assert.equal(ws.scripts.length, 1);
    const loaded = ws.scripts[0];

    assert.equal(loaded.id, script.id);
    assert.equal(loaded.name, script.name);
    assert.equal(loaded.type, script.type);
    assert.equal(loaded.rawContent, script.rawContent, 'raw content should be reconstructed from current version');
    assert.equal(loaded.data.targets.length, 1);
    assert.equal(loaded.data.sources.length, 1);
    assert.equal(loaded.data.targets[0].columns.length, 2);
    assert.equal(loaded.data.targets[0].columns[0].name, 'id');
    assert.deepEqual(loaded.data.targets[0].columns[0].sampleValues, ['1', '2', '3']);
    assert.equal(loaded.data.targets[0].constraints[0].type, 'Primary Key');

    assert.deepEqual(loaded.masterCodes, [{ key: 'A', definition: 'Active' }]);
    assert.deepEqual(loaded.masterCodeCategories, [{ key: 'STATUS', definition: 'Status codes' }]);

    // Versions: metadata returned, content/data lazy.
    assert.equal(loaded.versions.length, 1);
    assert.equal(loaded.versions[0].id, 'v-1');
    assert.equal(loaded.versions[0].content, '', 'version content should be lazy in loadWorkspace');

    db.close();
  } finally {
    rmRecursive(tmp);
  }
});

test('version policy: drops parsed data on history, keeps it on current version', { skip: !driverAvailable }, () => {
  const tmp = freshTmpDir();
  try {
    const { db } = loadDbModuleFresh();
    db.openDb(makeFakeApp(tmp));

    const script = fixtureScript({
      currentVersionId: 'v-2',
      versions: [
        {
          id: 'v-2',
          versionNumber: 2,
          content: 'CREATE TABLE bar (id INT);',
          data: { targets: [{ tableName: 'bar', columns: [{ name: 'id' }] }], sources: [] },
          message: 'v2',
          createdAt: 1700000002000,
        },
        {
          id: 'v-1',
          versionNumber: 1,
          content: 'CREATE TABLE foo (id INT);',
          data: { targets: [{ tableName: 'foo', columns: [{ name: 'id' }] }], sources: [] },
          message: 'v1',
          createdAt: 1700000000000,
        },
      ],
    });

    db.saveDiff({ changedScripts: [script], removedScriptIds: [], changedFlowcharts: [], removedFlowchartIds: [], meta: {} });

    // Lazily fetch each version's content.
    const cur = db.getVersionContent('v-2');
    assert.equal(cur.content, 'CREATE TABLE bar (id INT);');
    assert.ok(cur.data, 'current version should retain parsed data for fast restore');

    const old = db.getVersionContent('v-1');
    assert.equal(old.content, 'CREATE TABLE foo (id INT);');
    assert.equal(old.data, null, 'historical version data should be null (drop-on-history policy)');

    db.close();
  } finally {
    rmRecursive(tmp);
  }
});

test('compression: version content is gzip-compressed on disk', { skip: !driverAvailable }, () => {
  const tmp = freshTmpDir();
  try {
    const { db } = loadDbModuleFresh();
    db.openDb(makeFakeApp(tmp));

    // Highly compressible repetitive content.
    const big = 'CREATE TABLE foo (id INT);\n'.repeat(2000);
    const script = fixtureScript({
      versions: [{
        id: 'v-1', versionNumber: 1, content: big,
        data: { targets: [], sources: [] }, createdAt: 1700000000000,
      }],
    });
    db.saveDiff({ changedScripts: [script], removedScriptIds: [], changedFlowcharts: [], removedFlowchartIds: [], meta: {} });

    const row = db._internal.db().prepare(`SELECT content FROM script_versions WHERE id = 'v-1'`).get();
    assert.ok(row.content instanceof Buffer, 'content should be a BLOB');
    // gzip magic number: 0x1f 0x8b
    assert.equal(row.content[0], 0x1f);
    assert.equal(row.content[1], 0x8b);
    assert.ok(row.content.length < big.length / 5, `expected compression > 5x; got ${big.length} -> ${row.content.length}`);

    db.close();
  } finally {
    rmRecursive(tmp);
  }
});

test('migration from shards: reads shard layout and produces equivalent SQLite state', { skip: !driverAvailable }, async () => {
  const tmp = freshTmpDir();
  try {
    const shardsRoot = path.join(tmp, 'workspace-shards');
    fs.mkdirSync(path.join(shardsRoot, 'scripts'), { recursive: true });
    fs.mkdirSync(path.join(shardsRoot, 'flowcharts'), { recursive: true });

    // Distinct version IDs across scripts (script_versions.id is globally unique).
    const s1 = fixtureScript({
      id: 'script-1', name: 'A',
      currentVersionId: 's1-v1',
      versions: [{ id: 's1-v1', versionNumber: 1, content: 'CREATE TABLE a();', data: { targets: [], sources: [] }, createdAt: 1700000000000 }],
    });
    const s2 = fixtureScript({
      id: 'script-2', name: 'B',
      currentVersionId: 's2-v1',
      versions: [{ id: 's2-v1', versionNumber: 1, content: 'CREATE TABLE b();', data: { targets: [], sources: [] }, createdAt: 1700000000000 }],
    });

    fs.writeFileSync(path.join(shardsRoot, 'scripts', 'script-1.json'), JSON.stringify(s1));
    fs.writeFileSync(path.join(shardsRoot, 'scripts', 'script-2.json'), JSON.stringify(s2));
    fs.writeFileSync(path.join(shardsRoot, 'manifest.json'), JSON.stringify({
      version: '1.2.0',
      scriptIds: ['script-1', 'script-2'],
      flowchartIds: [],
      updatedAt: new Date().toISOString(),
    }));
    fs.writeFileSync(path.join(shardsRoot, 'meta.json'), JSON.stringify({
      theme: 'dark',
      themeVariant: 'vscode-gray',
      mappingProjects: [],
      typeRuleSets: [],
      erdPositions: { 'script-1': { 'public.foo': { x: 100, y: 200 } } },
    }));

    const { db, migration } = loadDbModuleFresh();
    const result = await migration.migrateFromShards(makeFakeApp(tmp));
    assert.equal(result.success, true, 'migration should succeed: ' + (result.error || ''));
    assert.equal(result.counts.scripts, 2);
    assert.equal(result.counts.dbScriptCount, 2);

    const ws = db.loadWorkspace();
    assert.equal(ws.scripts.length, 2);
    assert.equal(ws.theme, 'dark');
    assert.equal(ws.themeVariant, 'vscode-gray');
    assert.deepEqual(ws.erdPositions['script-1']['public.foo'], { x: 100, y: 200 });

    db.close();
  } finally {
    rmRecursive(tmp);
  }
});

test('integrityCheck on a fresh DB returns ok', { skip: !driverAvailable }, () => {
  const tmp = freshTmpDir();
  try {
    const { db } = loadDbModuleFresh();
    db.openDb(makeFakeApp(tmp));
    const r = db.integrityCheck();
    assert.equal(r.ok, true);
    db.close();
  } finally {
    rmRecursive(tmp);
  }
});

// ---------------------------------------------------------------------------
// PR2 cutover-flow tests
// ---------------------------------------------------------------------------

test('cutover: partial saveDiff only touches the changed script', { skip: !driverAvailable }, () => {
  const tmp = freshTmpDir();
  try {
    const { db } = loadDbModuleFresh();
    db.openDb(makeFakeApp(tmp));

    const a = fixtureScript({ id: 'a', name: 'A', currentVersionId: 'a-v1',
      versions: [{ id: 'a-v1', versionNumber: 1, content: 'A1', data: { targets: [], sources: [] }, createdAt: 1 }] });
    const b = fixtureScript({ id: 'b', name: 'B', currentVersionId: 'b-v1',
      versions: [{ id: 'b-v1', versionNumber: 1, content: 'B1', data: { targets: [], sources: [] }, createdAt: 1 }] });

    db.saveDiff({ changedScripts: [a, b], removedScriptIds: [], changedFlowcharts: [], removedFlowchartIds: [], meta: {} });

    // Track the row counts before the partial save.
    const realDb = db._internal.db();
    const tablesBefore = realDb.prepare(`SELECT script_id, COUNT(*) n FROM tables GROUP BY script_id`).all();

    // Re-save only `a`, with a different table name.
    const a2 = { ...a, data: { targets: [{ schema: 's', tableName: 'a_renamed', description: '', constraints: [], columns: [{ name: 'x', type: 'INT', nullable: '', default: null, explanation: '', mapping: '' }] }], sources: [] }, updatedAt: 2 };
    db.saveDiff({ changedScripts: [a2], removedScriptIds: [], changedFlowcharts: [], removedFlowchartIds: [], meta: {} });

    const tablesAfter = realDb.prepare(`SELECT script_id, table_name FROM tables ORDER BY script_id, table_name`).all();

    // `a` was rewritten with a single new table; `b`'s tables are intact.
    const aTables = tablesAfter.filter((r) => r.script_id === 'a').map((r) => r.table_name);
    const bTables = tablesAfter.filter((r) => r.script_id === 'b').map((r) => r.table_name);
    assert.deepEqual(aTables, ['a_renamed']);
    assert.equal(bTables.length, tablesBefore.find((r) => r.script_id === 'b').n,
      "b's tables should be unchanged after a's partial save");

    db.close();
  } finally {
    rmRecursive(tmp);
  }
});

test('cutover: removedScriptIds cascades to tables, columns, versions', { skip: !driverAvailable }, () => {
  const tmp = freshTmpDir();
  try {
    const { db } = loadDbModuleFresh();
    db.openDb(makeFakeApp(tmp));

    const a = fixtureScript({ id: 'a', currentVersionId: 'a-v1',
      versions: [{ id: 'a-v1', versionNumber: 1, content: 'X', data: { targets: [], sources: [] }, createdAt: 1 }] });
    db.saveDiff({ changedScripts: [a], removedScriptIds: [], changedFlowcharts: [], removedFlowchartIds: [], meta: {} });

    const realDb = db._internal.db();
    assert.ok(realDb.prepare(`SELECT 1 FROM scripts WHERE id='a'`).get(), 'script should exist before delete');
    assert.ok(realDb.prepare(`SELECT 1 FROM tables WHERE script_id='a'`).get(), 'tables should exist before delete');
    assert.ok(realDb.prepare(`SELECT 1 FROM script_versions WHERE script_id='a'`).get(), 'versions should exist before delete');

    db.saveDiff({ changedScripts: [], removedScriptIds: ['a'], changedFlowcharts: [], removedFlowchartIds: [], meta: {} });

    assert.equal(realDb.prepare(`SELECT 1 FROM scripts WHERE id='a'`).get(), undefined);
    assert.equal(realDb.prepare(`SELECT 1 FROM tables WHERE script_id='a'`).get(), undefined,
      'tables should cascade-delete with the script');
    assert.equal(realDb.prepare(`SELECT 1 FROM script_versions WHERE script_id='a'`).get(), undefined,
      'versions should cascade-delete with the script');

    db.close();
  } finally {
    rmRecursive(tmp);
  }
});

test('cutover: meta KV (theme, ddVisibleColumns) round-trips', { skip: !driverAvailable }, () => {
  const tmp = freshTmpDir();
  try {
    const { db } = loadDbModuleFresh();
    db.openDb(makeFakeApp(tmp));

    db.saveDiff({
      changedScripts: [], removedScriptIds: [], changedFlowcharts: [], removedFlowchartIds: [],
      meta: {
        theme: 'dark',
        themeVariant: 'vscode-gray',
        ddVisibleColumns: { 'script-1': { visible: ['name', 'type'], knownColumns: ['name', 'type', 'description'] } },
        ddColumnWidths: { 'script-1': { name: 200, type: 100 } },
        mappingProjects: [],
        typeRuleSets: [],
      },
    });

    const ws = db.loadWorkspace();
    assert.equal(ws.theme, 'dark');
    assert.equal(ws.themeVariant, 'vscode-gray');
    assert.deepEqual(ws.ddVisibleColumns, {
      'script-1': { visible: ['name', 'type'], knownColumns: ['name', 'type', 'description'] },
    });
    assert.deepEqual(ws.ddColumnWidths, { 'script-1': { name: 200, type: 100 } });

    db.close();
  } finally {
    rmRecursive(tmp);
  }
});

test('cutover: workspace round-trip preserves columns, constraints, master codes, sample attachments', { skip: !driverAvailable }, () => {
  const tmp = freshTmpDir();
  try {
    const { db } = loadDbModuleFresh();
    db.openDb(makeFakeApp(tmp));

    const original = fixtureScript({
      id: 'omega',
      name: 'OMEGA',
      currentVersionId: 'om-v1',
      versions: [{
        id: 'om-v1', versionNumber: 1, content: 'CREATE TABLE foo();',
        data: { targets: [], sources: [] }, createdAt: 1700000000000,
      }],
      passthrough: {
        sampleDataAttachments: [{
          id: 'sda-1', fileName: 'data.csv', uploadedAt: 1700000005000,
          matchResults: [{ csvTableName: 'foo', matchedScriptTable: 'foo', matchedColumns: [], unmatchedCsvColumns: [], unmatchedScriptColumns: [] }],
          warnings: ['truncated to 100 rows'],
        }],
      },
    });

    db.saveDiff({ changedScripts: [original], removedScriptIds: [], changedFlowcharts: [], removedFlowchartIds: [], meta: {} });

    const ws = db.loadWorkspace();
    const loaded = ws.scripts.find((s) => s.id === 'omega');
    assert.ok(loaded, 'script should be loaded');

    // Hot-path round-trip checks.
    assert.equal(loaded.name, original.name);
    assert.equal(loaded.data.targets.length, original.data.targets.length);
    assert.equal(loaded.data.sources.length, original.data.sources.length);
    assert.equal(loaded.data.targets[0].columns.length, original.data.targets[0].columns.length);

    // Master codes and categories preserved as arrays.
    assert.deepEqual(loaded.masterCodes, original.masterCodes);
    assert.deepEqual(loaded.masterCodeCategories, original.masterCodeCategories);

    // Sample attachments round-trip.
    assert.equal(loaded.sampleDataAttachments?.length, 1);
    assert.equal(loaded.sampleDataAttachments[0].fileName, 'data.csv');
    assert.deepEqual(loaded.sampleDataAttachments[0].warnings, ['truncated to 100 rows']);

    db.close();
  } finally {
    rmRecursive(tmp);
  }
});

test('FK orphans: ERD positions for missing scripts are skipped, not fatal', { skip: !driverAvailable }, () => {
  const tmp = freshTmpDir();
  try {
    const { db } = loadDbModuleFresh();
    db.openDb(makeFakeApp(tmp));

    const a = fixtureScript({ id: 'real-script', currentVersionId: 'rs-v1',
      versions: [{ id: 'rs-v1', versionNumber: 1, content: 'X', data: { targets: [], sources: [] }, createdAt: 1 }] });

    const result = db.saveDiff({
      changedScripts: [a], removedScriptIds: [], changedFlowcharts: [], removedFlowchartIds: [],
      meta: {
        // Mix of valid and orphan ERD entries — orphan would FK-fail without defensive handling.
        erdPositions: {
          'real-script': { 'public.foo': { x: 100, y: 200 } },
          'ghost-script-id': { 'public.bar': { x: 50, y: 60 } },
          'another_compound_id_that_isnt_a_script': { 'public.baz': { x: 1, y: 2 } },
        },
      },
    });

    assert.equal(result.skipped.erdOrphanScripts, 2,
      'two orphan ERD scripts should have been skipped (not fatal)');

    // Real script's positions are preserved.
    const ws = db.loadWorkspace();
    assert.deepEqual(ws.erdPositions['real-script'], { 'public.foo': { x: 100, y: 200 } });
    assert.equal(ws.erdPositions['ghost-script-id'], undefined);

    db.close();
  } finally {
    rmRecursive(tmp);
  }
});

test('FK orphans: mapping projects with missing source/target scripts are skipped', { skip: !driverAvailable }, () => {
  const tmp = freshTmpDir();
  try {
    const { db } = loadDbModuleFresh();
    db.openDb(makeFakeApp(tmp));

    const realScript = fixtureScript({ id: 'real', currentVersionId: 'rv1',
      versions: [{ id: 'rv1', versionNumber: 1, content: 'X', data: { targets: [], sources: [] }, createdAt: 1 }] });

    const result = db.saveDiff({
      changedScripts: [realScript], removedScriptIds: [], changedFlowcharts: [], removedFlowchartIds: [],
      meta: {
        mappingProjects: [
          // Valid: both ends exist.
          {
            id: 'mp-good', name: 'Good', sourceScriptId: 'real', targetScriptId: 'real',
            mappings: [], tableMappings: [],
            createdAt: 1, updatedAt: 1,
          },
          // Orphan: target script doesn't exist.
          {
            id: 'mp-bad', name: 'Bad', sourceScriptId: 'real', targetScriptId: 'ghost',
            mappings: [], tableMappings: [],
            createdAt: 1, updatedAt: 1,
          },
        ],
      },
    });

    assert.equal(result.skipped.mappingProjectsMissingScript, 1,
      'orphan mapping project should be skipped, not fatal');

    const ws = db.loadWorkspace();
    assert.equal(ws.mappingProjects.length, 1);
    assert.equal(ws.mappingProjects[0].id, 'mp-good');

    db.close();
  } finally {
    rmRecursive(tmp);
  }
});

test('FK orphans: mapping projects with missing typeRuleSetId have it nulled', { skip: !driverAvailable }, () => {
  const tmp = freshTmpDir();
  try {
    const { db } = loadDbModuleFresh();
    db.openDb(makeFakeApp(tmp));

    const realScript = fixtureScript({ id: 'real', currentVersionId: 'rv1',
      versions: [{ id: 'rv1', versionNumber: 1, content: 'X', data: { targets: [], sources: [] }, createdAt: 1 }] });

    const result = db.saveDiff({
      changedScripts: [realScript], removedScriptIds: [], changedFlowcharts: [], removedFlowchartIds: [],
      meta: {
        typeRuleSets: [],  // empty — no rule sets exist
        mappingProjects: [
          {
            id: 'mp', name: 'Test', sourceScriptId: 'real', targetScriptId: 'real',
            typeRuleSetId: 'ghost-rule-set', // points at a deleted rule set
            mappings: [], tableMappings: [],
            createdAt: 1, updatedAt: 1,
          },
        ],
      },
    });

    assert.equal(result.skipped.mappingProjectsRuleSetNulled, 1);

    const ws = db.loadWorkspace();
    assert.equal(ws.mappingProjects.length, 1);
    assert.equal(ws.mappingProjects[0].typeRuleSetId, undefined,
      'typeRuleSetId should be null/undefined after orphan nulling');

    db.close();
  } finally {
    rmRecursive(tmp);
  }
});

test('saveDiff is idempotent: running it twice with the same payload does not FK-fail', { skip: !driverAvailable }, () => {
  // Repro of the bug where a second saveDiff failed with
  // "FOREIGN KEY constraint failed" because deleting type_rule_sets ran
  // before deleting mapping_projects (which still referenced them).
  const tmp = freshTmpDir();
  try {
    const { db } = loadDbModuleFresh();
    db.openDb(makeFakeApp(tmp));

    const realScript = fixtureScript({ id: 'real', currentVersionId: 'rv1',
      versions: [{ id: 'rv1', versionNumber: 1, content: 'X', data: { targets: [], sources: [] }, createdAt: 1 }] });

    const payload = {
      changedScripts: [realScript], removedScriptIds: [], changedFlowcharts: [], removedFlowchartIds: [],
      meta: {
        typeRuleSets: [{
          id: 'rs-1', name: 'Default', sourceDb: 'any', targetDb: 'any',
          rules: [], isBuiltIn: false, createdAt: 1, updatedAt: 1,
        }],
        mappingProjects: [{
          id: 'mp-1', name: 'P1', sourceScriptId: 'real', targetScriptId: 'real',
          typeRuleSetId: 'rs-1',  // references the rule set above
          mappings: [], tableMappings: [],
          createdAt: 1, updatedAt: 1,
        }],
      },
    };

    // First save: tables empty, succeeds.
    db.saveDiff(payload);

    // Second save with identical payload — used to fail with FK error because
    // we deleted type_rule_sets while mapping_projects.type_rule_set_id still
    // pointed at it. Should now delete mapping_projects first, then proceed.
    db.saveDiff(payload);

    const ws = db.loadWorkspace();
    assert.equal(ws.mappingProjects.length, 1);
    assert.equal(ws.mappingProjects[0].typeRuleSetId, 'rs-1');
    assert.equal(ws.typeRuleSets.length, 1);

    db.close();
  } finally {
    rmRecursive(tmp);
  }
});

test('column_mapping ids can repeat across projects (composite PK)', { skip: !driverAvailable }, () => {
  const tmp = freshTmpDir();
  try {
    const { db } = loadDbModuleFresh();
    db.openDb(makeFakeApp(tmp));

    const realScript = fixtureScript({ id: 'real', currentVersionId: 'rv1',
      versions: [{ id: 'rv1', versionNumber: 1, content: 'X', data: { targets: [], sources: [] }, createdAt: 1 }] });

    const sharedMapping = (projectId) => ({
      id: 'cm-shared', // SAME id in both projects — would have failed v1 schema's TEXT PK
      sourceScriptId: 'real', sourceTable: 't', sourceColumn: 'a', sourceType: 'INT',
      targetScriptId: 'real', targetTable: 't', targetColumn: 'a', targetType: 'INT',
      mapType: 'manual', typeCompatibility: 'exact',
      validation: {}, transformations: [],
      confidence: 0, createdAt: 1, updatedAt: 1,
      projectId,
    });

    const result = db.saveDiff({
      changedScripts: [realScript], removedScriptIds: [], changedFlowcharts: [], removedFlowchartIds: [],
      meta: {
        mappingProjects: [
          {
            id: 'p1', name: 'P1', sourceScriptId: 'real', targetScriptId: 'real',
            mappings: [sharedMapping('p1')], tableMappings: [],
            createdAt: 1, updatedAt: 1,
          },
          {
            id: 'p2', name: 'P2', sourceScriptId: 'real', targetScriptId: 'real',
            mappings: [sharedMapping('p2')], tableMappings: [],
            createdAt: 1, updatedAt: 1,
          },
        ],
      },
    });

    // Should NOT have hit any FK / unique skip; both mappings co-exist.
    assert.equal(result.skipped.mappingProjectsMissingScript, 0);

    const ws = db.loadWorkspace();
    assert.equal(ws.mappingProjects.length, 2);
    assert.equal(ws.mappingProjects[0].mappings[0].id, 'cm-shared');
    assert.equal(ws.mappingProjects[1].mappings[0].id, 'cm-shared');

    db.close();
  } finally {
    rmRecursive(tmp);
  }
});

test('cutover: version reconciliation removes versions absent from new array', { skip: !driverAvailable }, () => {
  const tmp = freshTmpDir();
  try {
    const { db } = loadDbModuleFresh();
    db.openDb(makeFakeApp(tmp));

    const initial = fixtureScript({
      id: 'a', currentVersionId: 'v3',
      versions: [
        { id: 'v3', versionNumber: 3, content: 'v3', data: { targets: [], sources: [] }, createdAt: 3 },
        { id: 'v2', versionNumber: 2, content: 'v2', data: { targets: [], sources: [] }, createdAt: 2 },
        { id: 'v1', versionNumber: 1, content: 'v1', data: { targets: [], sources: [] }, createdAt: 1 },
      ],
    });
    db.saveDiff({ changedScripts: [initial], removedScriptIds: [], changedFlowcharts: [], removedFlowchartIds: [], meta: {} });

    const realDb = db._internal.db();
    assert.equal(realDb.prepare(`SELECT COUNT(*) n FROM script_versions WHERE script_id='a'`).get().n, 3);

    // Drop v1 — simulate a renderer-side prune.
    const pruned = { ...initial, versions: initial.versions.slice(0, 2) }; // v3, v2
    db.saveDiff({ changedScripts: [pruned], removedScriptIds: [], changedFlowcharts: [], removedFlowchartIds: [], meta: {} });

    const remaining = realDb.prepare(`SELECT id FROM script_versions WHERE script_id='a' ORDER BY version_number DESC`).all().map((r) => r.id);
    assert.deepEqual(remaining, ['v3', 'v2']);

    db.close();
  } finally {
    rmRecursive(tmp);
  }
});
