// =============================================================================
// Diagnostic — reads the user's actual shards and reports every data-integrity
// issue that would break the SQLite migration:
//
//   - Mapping projects referencing missing source/target scripts
//   - Mapping projects referencing missing type rule sets
//   - Column mappings referencing missing projects (shouldn't happen, but check)
//   - Type rules with duplicate (rule_set_id, id)
//   - Column mappings with duplicate (project_id, id)
//   - Transformations with duplicate (project_id, column_mapping_id, sequence)
//   - ERD positions for missing scripts
//   - Script-level: tables with duplicate (schema, name, is_source)
//   - Script-level: columns with duplicate (table_index, name)
//   - Versions with duplicate id (across scripts) — would still fail on global PK
//
// Run with:  node electron/__tests__/diagnose.cjs [shards-root]
// Default shards-root: %APPDATA%/dm-tool/workspace-shards (Windows)
// =============================================================================

const fs = require('fs');
const path = require('path');
const os = require('os');

function defaultShardsRoot() {
  const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
  return path.join(appData, 'dm-tool', 'workspace-shards');
}

function readJsonOrNull(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')); } catch { return null; }
}

function safeShardName(id) {
  return String(id).replace(/[^a-zA-Z0-9_.-]/g, '_');
}

const root = process.argv[2] || defaultShardsRoot();
console.log(`\n=== Diagnosing shards at: ${root} ===\n`);

const manifest = readJsonOrNull(path.join(root, 'manifest.json'));
const meta = readJsonOrNull(path.join(root, 'meta.json'));
if (!manifest) { console.error('No manifest.json found.'); process.exit(1); }

const scriptIds = new Set(Array.isArray(manifest.scriptIds) ? manifest.scriptIds : []);
const scripts = [];
for (const id of scriptIds) {
  const s = readJsonOrNull(path.join(root, 'scripts', safeShardName(id) + '.json'));
  if (s) scripts.push(s);
}

const issues = [];
function add(severity, category, message, detail) {
  issues.push({ severity, category, message, detail: detail || null });
}

// ---------------------------------------------------------------------------
// Manifest sanity
// ---------------------------------------------------------------------------
console.log(`Scripts in manifest: ${scriptIds.size}`);
console.log(`Scripts loaded:      ${scripts.length}`);
if (scripts.length !== scriptIds.size) {
  add('warn', 'manifest', `${scriptIds.size - scripts.length} scripts in manifest had missing/unreadable shard files`);
}

// ---------------------------------------------------------------------------
// Per-script integrity (table dupes, column dupes, etc.)
// ---------------------------------------------------------------------------
const allTablesByScript = new Map(); // scriptId -> Set of "schema.name|isSource"
const allVersionIds = new Map();     // version_id -> count (global PK on script_versions.id)

for (const s of scripts) {
  const tableKeys = new Set();
  const inspectTables = (list, isSource) => {
    list.forEach((t, ti) => {
      const key = `${t.schema || ''}.${t.tableName || ''}|${isSource ? 1 : 0}`;
      if (tableKeys.has(key)) {
        add('error', 'table-dupe',
          `Script "${s.name}" (${s.id}): duplicate table "${t.schema}.${t.tableName}" in ${isSource ? 'sources' : 'targets'}`,
          { scriptId: s.id, ordinal: ti, key });
      }
      tableKeys.add(key);

      // Column dupes within table
      const colNames = new Set();
      (t.columns || []).forEach((c, ci) => {
        if (colNames.has(c.name)) {
          add('error', 'column-dupe',
            `Script "${s.name}" / ${t.tableName}: duplicate column "${c.name}"`,
            { scriptId: s.id, table: t.tableName, ordinal: ci });
        }
        colNames.add(c.name);
      });
    });
  };
  inspectTables(s.data?.targets || [], false);
  inspectTables(s.data?.sources || [], true);
  allTablesByScript.set(s.id, tableKeys);

  // Versions
  for (const v of s.versions || []) {
    const cur = allVersionIds.get(v.id) || 0;
    allVersionIds.set(v.id, cur + 1);
  }

  // currentVersionId points at a version that exists?
  if (s.currentVersionId) {
    const found = (s.versions || []).find((v) => v.id === s.currentVersionId);
    if (!found) {
      add('error', 'current-version-missing',
        `Script "${s.name}": currentVersionId "${s.currentVersionId}" not in versions[]`,
        { scriptId: s.id });
    }
  }

  // Master codes / categories with duplicate keys
  const mcKeys = new Set();
  for (const m of s.masterCodes || []) {
    if (mcKeys.has(m.key)) add('error', 'master-code-dupe', `Script "${s.name}": duplicate masterCode key "${m.key}"`, { scriptId: s.id });
    mcKeys.add(m.key);
  }
  const mcCatKeys = new Set();
  for (const m of s.masterCodeCategories || []) {
    if (mcCatKeys.has(m.key)) add('error', 'master-code-cat-dupe', `Script "${s.name}": duplicate masterCodeCategory key "${m.key}"`, { scriptId: s.id });
    mcCatKeys.add(m.key);
  }
}

// Versions: duplicate IDs across scripts (script_versions.id is global PK in schema)
for (const [vid, count] of allVersionIds) {
  if (count > 1) {
    add('error', 'version-id-dupe',
      `Version id "${vid}" appears in ${count} scripts (script_versions.id is a global PK)`,
      { count });
  }
}

// ---------------------------------------------------------------------------
// Mapping projects FK integrity
// ---------------------------------------------------------------------------
const mappingProjects = (meta && Array.isArray(meta.mappingProjects)) ? meta.mappingProjects : [];
const typeRuleSets = (meta && Array.isArray(meta.typeRuleSets)) ? meta.typeRuleSets : [];
const ruleSetIds = new Set(typeRuleSets.map((r) => r.id));

console.log(`Mapping projects:  ${mappingProjects.length}`);
console.log(`Type rule sets:    ${typeRuleSets.length}`);
console.log(``);

const mpIds = new Set();
for (const mp of mappingProjects) {
  if (mpIds.has(mp.id)) {
    add('error', 'mapping-project-id-dupe', `Duplicate mapping project id "${mp.id}"`, null);
  }
  mpIds.add(mp.id);

  if (!scriptIds.has(mp.sourceScriptId)) {
    add('error', 'fk-source-script',
      `MappingProject "${mp.name}" (${mp.id}) → sourceScriptId "${mp.sourceScriptId}" does not exist`,
      { projectId: mp.id, missingScriptId: mp.sourceScriptId });
  }
  if (!scriptIds.has(mp.targetScriptId)) {
    add('error', 'fk-target-script',
      `MappingProject "${mp.name}" (${mp.id}) → targetScriptId "${mp.targetScriptId}" does not exist`,
      { projectId: mp.id, missingScriptId: mp.targetScriptId });
  }
  if (mp.typeRuleSetId && !ruleSetIds.has(mp.typeRuleSetId)) {
    add('error', 'fk-rule-set',
      `MappingProject "${mp.name}" (${mp.id}) → typeRuleSetId "${mp.typeRuleSetId}" does not exist`,
      { projectId: mp.id, missingRuleSetId: mp.typeRuleSetId });
  }

  // Column mapping duplicates within this project
  const cmIds = new Set();
  for (const cm of mp.mappings || []) {
    if (cmIds.has(cm.id)) {
      add('error', 'column-mapping-id-dupe',
        `MappingProject "${mp.name}" (${mp.id}): duplicate column mapping id "${cm.id}"`,
        { projectId: mp.id });
    }
    cmIds.add(cm.id);

    // Transformations: duplicate (sequence) within this column mapping
    const seqs = new Set();
    (cm.transformations || []).forEach((t, ti) => {
      const seq = typeof t.sequence === 'number' ? t.sequence : ti;
      if (seqs.has(seq)) {
        add('error', 'transformation-seq-dupe',
          `MappingProject "${mp.name}" / ColumnMapping "${cm.id}": duplicate transformation sequence ${seq}`,
          { projectId: mp.id, columnMappingId: cm.id });
      }
      seqs.add(seq);
    });
  }

  // Table mappings: duplicate (sourceTable, targetTable)
  const tmKeys = new Set();
  for (const tm of mp.tableMappings || []) {
    const key = `${tm.sourceTable}->${tm.targetTable}`;
    if (tmKeys.has(key)) {
      add('error', 'table-mapping-dupe',
        `MappingProject "${mp.name}": duplicate table mapping "${key}"`,
        { projectId: mp.id });
    }
    tmKeys.add(key);
  }
}

// ---------------------------------------------------------------------------
// Type rule sets: duplicate (rule_set_id, rule_id)
// ---------------------------------------------------------------------------
for (const rs of typeRuleSets) {
  const ruleIds = new Set();
  for (const r of rs.rules || []) {
    if (ruleIds.has(r.id)) {
      add('error', 'type-rule-id-dupe',
        `TypeRuleSet "${rs.name}" (${rs.id}): duplicate rule id "${r.id}"`,
        { ruleSetId: rs.id });
    }
    ruleIds.add(r.id);
  }
}

// ---------------------------------------------------------------------------
// ERD positions: scripts that don't exist (would fail FK on erd_layouts.script_id)
// ---------------------------------------------------------------------------
const erdPositions = (meta && meta.erdPositions) || {};
for (const [scriptId, _] of Object.entries(erdPositions)) {
  if (!scriptIds.has(scriptId)) {
    add('error', 'erd-orphan',
      `ERD positions exist for non-existent script "${scriptId}" — would FK-fail erd_layouts.script_id`,
      { scriptId });
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
const byCategory = new Map();
for (const i of issues) {
  if (!byCategory.has(i.category)) byCategory.set(i.category, []);
  byCategory.get(i.category).push(i);
}

console.log(`Total issues found: ${issues.length}\n`);
if (issues.length === 0) {
  console.log('✅ Data is clean. SQLite migration should succeed.');
  process.exit(0);
}

console.log('Breakdown by category:');
for (const [cat, list] of [...byCategory.entries()].sort()) {
  console.log(`  ${list[0].severity.toUpperCase().padEnd(5)} ${cat.padEnd(28)} ${list.length}`);
}

console.log('\nFirst 30 issues:');
for (const i of issues.slice(0, 30)) {
  console.log(`  [${i.severity}] ${i.message}`);
}
if (issues.length > 30) {
  console.log(`  ... and ${issues.length - 30} more`);
}

process.exit(issues.some((i) => i.severity === 'error') ? 2 : 0);
