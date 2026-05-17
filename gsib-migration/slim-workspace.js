/**
 * Slims down workspace.json for Google Doc transfer.
 *
 * Strategy:
 *   - Strip ALL version history (saves ~17MB) — can be rebuilt from rawContent
 *   - Strip rawContent excessive whitespace (tabs in Oracle DDL)
 *   - Keep: data (parsed tables/columns/explanations), rawContent, masterCodes, sampleData metadata
 *   - Split into per-script JSON files for manageable Google Doc tabs
 *
 * Usage: node slim-workspace.js
 * Output: gsib-migration/workspace/ folder with split files
 */

const fs = require('fs');
const path = require('path');

const INPUT = path.join(__dirname, '..', 'backups', 'workspace.json');
const OUTPUT_DIR = path.join(__dirname, 'workspace');

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('Reading workspace.json...');
const workspace = JSON.parse(fs.readFileSync(INPUT, 'utf-8'));

// ============================================
// 1. Workspace metadata (small)
// ============================================
const meta = {
  version: workspace.version,
  exportDate: workspace.exportDate,
  theme: workspace.theme,
  themeVariant: workspace.themeVariant,
  erdPositions: workspace.erdPositions,
  ddVisibleColumns: workspace.ddVisibleColumns,
  ddColumnWidths: workspace.ddColumnWidths,
  mappingProjects: workspace.mappingProjects,
  typeRuleSets: workspace.typeRuleSets,
  flowchartScripts: workspace.flowchartScripts,
  scriptIndex: workspace.scripts.map(s => ({
    id: s.id,
    name: s.name,
    type: s.type,
    tableCount: (s.data?.targets || []).length,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  })),
};

const metaFile = path.join(OUTPUT_DIR, 'workspace-meta.json');
fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2));
console.log(`  workspace-meta.json: ${(fs.statSync(metaFile).size / 1024).toFixed(1)} KB`);

// ============================================
// 2. Per-script files (data dictionary content)
// ============================================
console.log('\nProcessing scripts:');

workspace.scripts.forEach((script, i) => {
  // Strip versions (biggest space saver)
  // Strip sampleDataAttachments raw data (keep match results only)
  const slim = {
    id: script.id,
    name: script.name,
    type: script.type,
    createdAt: script.createdAt,
    updatedAt: script.updatedAt,
    // Keep rawContent but compress whitespace
    rawContent: compressWhitespace(script.rawContent || ''),
    // Keep full parsed data (tables, columns, explanations, mappings)
    data: script.data,
    // Keep master codes
    masterCodes: script.masterCodes || [],
    masterCodeCategories: script.masterCodeCategories || [],
    // Keep sample data match results (but not raw CSV)
    sampleDataAttachments: (script.sampleDataAttachments || []).map(att => ({
      id: att.id,
      fileName: att.fileName,
      uploadedAt: att.uploadedAt,
      matchResults: att.matchResults,
      warnings: att.warnings,
    })),
    // Version count info only
    _versionInfo: {
      hadVersions: (script.versions || []).length,
      latestVersionId: script.currentVersionId || null,
      note: 'Versions stripped to reduce size. Re-enable versioning after import to start fresh.',
    },
  };

  // Sanitize filename
  const safeName = script.name.replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `script-${String(i).padStart(2, '0')}-${safeName}.json`;
  const filePath = path.join(OUTPUT_DIR, fileName);

  fs.writeFileSync(filePath, JSON.stringify(slim, null, 2));
  const sizeKB = (fs.statSync(filePath).size / 1024).toFixed(1);

  console.log(`  ${fileName}: ${sizeKB} KB (${(script.data?.targets || []).length} tables)`);
});

// ============================================
// 3. Also create a single combined slim workspace
//    (for direct import if small enough)
// ============================================
const combined = {
  version: workspace.version,
  exportDate: new Date().toISOString(),
  scripts: workspace.scripts.map(s => ({
    id: s.id,
    name: s.name,
    type: s.type,
    rawContent: compressWhitespace(s.rawContent || ''),
    data: s.data,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
    masterCodes: s.masterCodes || [],
    masterCodeCategories: s.masterCodeCategories || [],
    sampleDataAttachments: (s.sampleDataAttachments || []).map(att => ({
      id: att.id, fileName: att.fileName, uploadedAt: att.uploadedAt,
      matchResults: att.matchResults, warnings: att.warnings,
    })),
    // No versions, no currentVersionId
  })),
  flowchartScripts: workspace.flowchartScripts || [],
  mappingProjects: workspace.mappingProjects || [],
  typeRuleSets: workspace.typeRuleSets || [],
  theme: workspace.theme,
  themeVariant: workspace.themeVariant,
  erdPositions: workspace.erdPositions || {},
  ddVisibleColumns: workspace.ddVisibleColumns || {},
  ddColumnWidths: workspace.ddColumnWidths || {},
};

const combinedFile = path.join(OUTPUT_DIR, 'workspace-slim.json');
fs.writeFileSync(combinedFile, JSON.stringify(combined, null, 2));
const combinedSizeMB = (fs.statSync(combinedFile).size / 1024 / 1024).toFixed(2);
console.log(`\n  workspace-slim.json (combined): ${combinedSizeMB} MB`);

// ============================================
// Summary
// ============================================
const allFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.json'));
let totalSize = 0;
allFiles.forEach(f => {
  totalSize += fs.statSync(path.join(OUTPUT_DIR, f)).size;
});

console.log('\n=== SUMMARY ===');
console.log(`Original workspace.json:  ${(fs.statSync(INPUT).size / 1024 / 1024).toFixed(2)} MB`);
console.log(`Slim combined:            ${combinedSizeMB} MB`);
console.log(`Reduction:                ${((1 - fs.statSync(combinedFile).size / fs.statSync(INPUT).size) * 100).toFixed(0)}%`);
console.log(`Split files:              ${allFiles.length} files, ${(totalSize / 1024 / 1024).toFixed(2)} MB total`);
console.log(`\nOutput: ${OUTPUT_DIR}`);

// ============================================
// Helper
// ============================================
function compressWhitespace(str) {
  // Oracle DDLs have tons of trailing tabs per line — strip them
  return str
    .split('\n')
    .map(line => line.replace(/\t+$/, '').replace(/\t+/g, '\t'))
    .join('\n');
}
