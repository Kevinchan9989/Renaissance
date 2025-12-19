// Export workspace backup script
// This script exports the current workspace data from localStorage to a JSON file

const fs = require('fs');
const path = require('path');

// Define localStorage keys
const SCRIPTS_KEY = 'dm_tool_scripts';
const MAPPING_PROJECTS_KEY = 'dm_tool_mapping_projects';
const TYPE_RULE_SETS_KEY = 'dm_tool_type_rule_sets';
const THEME_KEY = 'dm_tool_theme';
const DARK_THEME_VARIANT_KEY = 'dm_tool_dark_theme_variant';

// Path to Electron's localStorage
// This is a common path, adjust if needed based on your app name
const userDataPath = process.env.APPDATA || (process.platform === 'darwin' ? path.join(process.env.HOME, 'Library/Application Support') : path.join(process.env.HOME, '.config'));
const appDataPath = path.join(userDataPath, 'dm-tool', 'Local Storage', 'leveldb');

console.log('🔍 Looking for Electron localStorage at:', appDataPath);

// For web browser localStorage, we'll need to manually copy the data
// Let's create a placeholder that can be filled manually
const workspaceData = {
  version: '1.0.0',
  exportDate: new Date().toISOString(),
  scripts: [],
  mappingProjects: [],
  typeRuleSets: [],
  theme: 'dark',
  themeVariant: 'slate',
  erdPositions: {},
  note: 'To populate this file, open the app, go to Settings, and click Export Workspace. Then copy the downloaded file here.'
};

// Save to backups folder
const backupsDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
const filename = `workspace-backup-${timestamp}.json`;
const filepath = path.join(backupsDir, filename);

fs.writeFileSync(filepath, JSON.stringify(workspaceData, null, 2), 'utf8');

console.log('✅ Workspace backup template created at:', filepath);
console.log('');
console.log('📋 To complete the backup:');
console.log('   1. Open the DM Tool app');
console.log('   2. Click the Settings icon');
console.log('   3. Go to the Workspace tab');
console.log('   4. Click "Export Workspace"');
console.log('   5. Save the file to:', filepath);
console.log('');
console.log('   Then you can commit this file to git.');
