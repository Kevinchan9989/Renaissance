import { Script, MappingProject, TypeRuleSet, ScriptVersion } from '../types';
import { saveWorkspaceToFile, isElectron } from '../services/electronStorage';

const STORAGE_KEY = 'dm_tool_data';
const THEME_KEY = 'dm_tool_theme';
const THEME_VARIANT_KEY = 'dm_tool_theme_variant';
const MAPPING_PROJECTS_KEY = 'dm_tool_mapping_projects';
const TYPE_RULE_SETS_KEY = 'dm_tool_type_rule_sets';
const MAPPING_WORKSPACE_KEY = 'dm_tool_mapping_workspace';

// Auto-save to Electron file system when data changes (debounced)
let electronSaveTimeout: NodeJS.Timeout | null = null;
function scheduleElectronSave() {
  if (!isElectron()) return;

  // Debounce: wait 2 seconds after last change before saving
  if (electronSaveTimeout) {
    clearTimeout(electronSaveTimeout);
  }

  electronSaveTimeout = setTimeout(async () => {
    try {
      const workspaceData = exportWorkspace();
      await saveWorkspaceToFile(workspaceData);
      console.log('📁 Auto-saved to local file');
    } catch (error) {
      console.error('Failed to auto-save to file:', error);
    }
  }, 2000);
}

// ============================================
// Script Storage
// ============================================

export function loadScripts(): Script[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load scripts:', e);
  }
  return [];
}

export function saveScripts(scripts: Script[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
    scheduleElectronSave(); // Auto-save to file when running in Electron
  } catch (e) {
    console.error('Failed to save scripts:', e);
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================
// Theme Storage
// ============================================

export function loadTheme(): 'light' | 'dark' {
  return (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light';
}

export function saveTheme(theme: 'light' | 'dark'): void {
  localStorage.setItem(THEME_KEY, theme);
}

// ============================================
// Theme Variant Storage (Slate vs VS Code Gray)
// ============================================

export type DarkThemeVariant = 'slate' | 'vscode-gray';

export function loadDarkThemeVariant(): DarkThemeVariant {
  return (localStorage.getItem(THEME_VARIANT_KEY) as DarkThemeVariant) || 'slate';
}

export function saveDarkThemeVariant(variant: DarkThemeVariant): void {
  localStorage.setItem(THEME_VARIANT_KEY, variant);
}

// ============================================
// Workspace Export/Import
// ============================================

export interface WorkspaceData {
  version: string;
  exportDate: string;
  scripts: Script[];
  mappingProjects: MappingProject[];
  typeRuleSets: TypeRuleSet[];
  theme: 'light' | 'dark';
  themeVariant: DarkThemeVariant;
  erdPositions: Record<string, Record<string, { x: number; y: number }>>;
}

export function exportWorkspace(): WorkspaceData {
  // Collect all ERD positions from localStorage
  const erdPositions: Record<string, Record<string, { x: number; y: number }>> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('erd_positions_')) {
      const scriptId = key.replace('erd_positions_', '');
      const data = localStorage.getItem(key);
      if (data) {
        try {
          erdPositions[scriptId] = JSON.parse(data);
        } catch (e) {
          console.warn(`Failed to parse ERD positions for ${scriptId}`);
        }
      }
    }
  }

  return {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    scripts: loadScripts(),
    mappingProjects: loadMappingProjects(),
    typeRuleSets: loadTypeRuleSets(),
    theme: loadTheme(),
    themeVariant: loadDarkThemeVariant(),
    erdPositions,
  };
}

export function importWorkspace(data: WorkspaceData): void {
  // Import scripts
  saveScripts(data.scripts || []);

  // Import mapping projects
  saveMappingProjects(data.mappingProjects || []);

  // Import type rule sets
  if (data.typeRuleSets) {
    localStorage.setItem(TYPE_RULE_SETS_KEY, JSON.stringify(data.typeRuleSets));
  }

  // Import theme
  if (data.theme) {
    saveTheme(data.theme);
  }

  // Import theme variant
  if (data.themeVariant) {
    saveDarkThemeVariant(data.themeVariant);
  }

  // Import ERD positions
  if (data.erdPositions) {
    for (const [scriptId, positions] of Object.entries(data.erdPositions)) {
      localStorage.setItem(`erd_positions_${scriptId}`, JSON.stringify(positions));
    }
  }

  // Save to Electron file if running in Electron
  scheduleElectronSave();
}

/**
 * Load workspace from Electron file system on startup
 * This should be called when the app initializes
 */
export async function loadWorkspaceFromElectron(): Promise<boolean> {
  if (!isElectron()) {
    return false;
  }

  try {
    const { loadWorkspaceFromFile } = await import('../services/electronStorage');
    const data = await loadWorkspaceFromFile();

    if (data) {
      console.log('📁 Loading workspace from local file...');
      importWorkspace(data);
      console.log('✅ Workspace loaded from local file');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Failed to load workspace from Electron:', error);
    return false;
  }
}

// ============================================
// Export/Download
// ============================================

export function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadText(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================
// Mapping Project Storage
// ============================================

export function loadMappingProjects(): MappingProject[] {
  try {
    const data = localStorage.getItem(MAPPING_PROJECTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load mapping projects:', e);
  }
  return [];
}

export function saveMappingProjects(projects: MappingProject[]): void {
  try {
    localStorage.setItem(MAPPING_PROJECTS_KEY, JSON.stringify(projects));
    scheduleElectronSave(); // Auto-save to file when running in Electron
  } catch (e) {
    console.error('Failed to save mapping projects:', e);
  }
}

export function loadMappingProject(projectId: string): MappingProject | null {
  const projects = loadMappingProjects();
  return projects.find(p => p.id === projectId) || null;
}

export function saveMappingProject(project: MappingProject): void {
  const projects = loadMappingProjects();
  const index = projects.findIndex(p => p.id === project.id);

  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }

  saveMappingProjects(projects);
}

export function deleteMappingProject(projectId: string): void {
  const projects = loadMappingProjects();
  const filtered = projects.filter(p => p.id !== projectId);
  saveMappingProjects(filtered);
}

// ============================================
// Type Rule Sets Storage
// ============================================

export function loadTypeRuleSets(): TypeRuleSet[] {
  try {
    const data = localStorage.getItem(TYPE_RULE_SETS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load type rule sets:', e);
  }
  return [];
}

export function saveTypeRuleSets(ruleSets: TypeRuleSet[]): void {
  try {
    localStorage.setItem(TYPE_RULE_SETS_KEY, JSON.stringify(ruleSets));
    scheduleElectronSave(); // Auto-save to file when running in Electron
  } catch (e) {
    console.error('Failed to save type rule sets:', e);
  }
}

export function saveTypeRuleSet(ruleSet: TypeRuleSet): void {
  const ruleSets = loadTypeRuleSets();
  const index = ruleSets.findIndex(r => r.id === ruleSet.id);

  if (index >= 0) {
    ruleSets[index] = ruleSet;
  } else {
    ruleSets.push(ruleSet);
  }

  saveTypeRuleSets(ruleSets);
}

export function deleteTypeRuleSet(ruleSetId: string): void {
  const ruleSets = loadTypeRuleSets();
  const filtered = ruleSets.filter(r => r.id !== ruleSetId);
  saveTypeRuleSets(filtered);
}

// ============================================
// YAML Export/Import for Type Rules
// ============================================

export function exportRulesToYaml(ruleSet: TypeRuleSet): string {
  const lines: string[] = [];

  lines.push(`# Type Compatibility Rules`);
  lines.push(`# ${ruleSet.name}`);
  lines.push(`# Exported: ${new Date().toISOString()}`);
  lines.push('');
  lines.push(`version: "1.0"`);
  lines.push(`name: "${ruleSet.name}"`);
  if (ruleSet.description) {
    lines.push(`description: "${ruleSet.description}"`);
  }
  lines.push(`sourceDb: ${ruleSet.sourceDb}`);
  lines.push(`targetDb: ${ruleSet.targetDb}`);
  lines.push('');
  lines.push('rules:');

  for (const rule of ruleSet.rules) {
    lines.push(`  - id: "${rule.id}"`);
    lines.push(`    name: "${rule.name}"`);
    if (rule.description) {
      lines.push(`    description: "${rule.description}"`);
    }
    lines.push(`    sourcePattern: "${rule.sourcePattern}"`);
    lines.push(`    targetPattern: "${rule.targetPattern}"`);
    lines.push(`    compatibility: ${rule.compatibility}`);
    if (rule.conversionSql) {
      lines.push(`    conversionSql: "${rule.conversionSql}"`);
    }
    if (rule.warning) {
      lines.push(`    warning: "${rule.warning}"`);
    }
    lines.push(`    priority: ${rule.priority}`);
    lines.push(`    enabled: ${rule.enabled}`);
    lines.push('');
  }

  return lines.join('\n');
}

export function downloadYaml(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/yaml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ============================================
// Mapping Project Export
// ============================================

export interface MappingExport {
  version: string;
  exportedAt: string;
  project: {
    name: string;
    source: { scriptId: string; scriptName: string; type: string };
    target: { scriptId: string; scriptName: string; type: string };
  };
  tableMappings: Array<{
    sourceTable: string;
    targetTable: string;
    status: string;
  }>;
  columnMappings: Array<{
    source: { table: string; column: string; type: string };
    target: { table: string; column: string; type: string };
    compatibility: string;
    transformations: Array<{ type: string; params?: Record<string, unknown> }>;
    remarks?: string;
    validation: {
      warnings: string[];
      errors: string[];
    };
  }>;
}

export function exportMappingProject(
  project: MappingProject,
  sourceScript: Script,
  targetScript: Script
): MappingExport {
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    project: {
      name: project.name,
      source: {
        scriptId: sourceScript.id,
        scriptName: sourceScript.name,
        type: sourceScript.type,
      },
      target: {
        scriptId: targetScript.id,
        scriptName: targetScript.name,
        type: targetScript.type,
      },
    },
    tableMappings: project.tableMappings.map(tm => ({
      sourceTable: tm.sourceTable,
      targetTable: tm.targetTable,
      status: tm.status,
    })),
    columnMappings: project.mappings.map(m => ({
      source: {
        table: m.sourceTable,
        column: m.sourceColumn,
        type: m.sourceType,
      },
      target: {
        table: m.targetTable,
        column: m.targetColumn,
        type: m.targetType,
      },
      compatibility: m.typeCompatibility,
      transformations: m.transformations.map(t => ({
        type: t.type,
        params: t.params,
      })),
      remarks: m.remarks,
      validation: {
        warnings: m.validation.warnings,
        errors: m.validation.errors,
      },
    })),
  };
}

export function exportMappingToYaml(exportData: MappingExport): string {
  const lines: string[] = [];

  lines.push(`# Data Mapping Export`);
  lines.push(`# ${exportData.project.name}`);
  lines.push(`# Exported: ${exportData.exportedAt}`);
  lines.push('');
  lines.push(`version: "${exportData.version}"`);
  lines.push('');
  lines.push('project:');
  lines.push(`  name: "${exportData.project.name}"`);
  lines.push(`  source: ${exportData.project.source.scriptName} (${exportData.project.source.type})`);
  lines.push(`  target: ${exportData.project.target.scriptName} (${exportData.project.target.type})`);
  lines.push('');
  lines.push('mappings:');

  for (const mapping of exportData.columnMappings) {
    lines.push(`  - source: ${mapping.source.table}.${mapping.source.column}`);
    lines.push(`    target: ${mapping.target.table}.${mapping.target.column}`);
    lines.push(`    compatibility: ${mapping.compatibility}`);
    if (mapping.transformations.length > 0) {
      lines.push(`    transformations:`);
      for (const t of mapping.transformations) {
        lines.push(`      - ${t.type}`);
      }
    }
    if (mapping.remarks) {
      lines.push(`    remarks: "${mapping.remarks}"`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ============================================
// Mapping Workspace State Persistence
// ============================================

export interface MappingWorkspaceState {
  currentView: 'script-selection' | 'workspace-setup' | 'mapping-canvas';
  sourceScriptId: string | null;
  targetScriptId: string | null;
  selectedSourceTables: string[];
  selectedTargetTables: string[];
  tablePositions: Record<string, { x: number; y: number }>;
  scale: number;
  stagePosition: { x: number; y: number };
  activeTab?: 'canvas' | 'linkage' | 'summary' | 'rules'; // Active tab per schema
  expandedTargetTables?: string[]; // Expanded tables in summary view
}

// Store per-schema UI state
interface SchemaUIState {
  activeTab: 'canvas' | 'linkage' | 'summary' | 'rules';
  expandedTargetTables: string[];
  selectedSourceTable: string | null;
  selectedTargetTable: string | null;
}

// Global storage for per-schema states
const SCHEMA_STATES_KEY = 'dm_tool_schema_states';

function getSchemaKey(sourceScriptId: string, targetScriptId: string): string {
  return `${sourceScriptId}::${targetScriptId}`;
}

export function loadSchemaUIState(sourceScriptId: string, targetScriptId: string): SchemaUIState | null {
  try {
    const data = localStorage.getItem(SCHEMA_STATES_KEY);
    if (data) {
      const allStates = JSON.parse(data) as Record<string, SchemaUIState>;
      const key = getSchemaKey(sourceScriptId, targetScriptId);
      return allStates[key] || null;
    }
  } catch (e) {
    console.error('Failed to load schema UI state:', e);
  }
  return null;
}

export function saveSchemaUIState(
  sourceScriptId: string,
  targetScriptId: string,
  state: SchemaUIState
): void {
  try {
    const data = localStorage.getItem(SCHEMA_STATES_KEY);
    const allStates = data ? JSON.parse(data) as Record<string, SchemaUIState> : {};
    const key = getSchemaKey(sourceScriptId, targetScriptId);
    allStates[key] = state;
    localStorage.setItem(SCHEMA_STATES_KEY, JSON.stringify(allStates));
  } catch (e) {
    console.error('Failed to save schema UI state:', e);
  }
}

export function loadMappingWorkspaceState(): MappingWorkspaceState | null {
  try {
    const data = localStorage.getItem(MAPPING_WORKSPACE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load mapping workspace state:', e);
  }
  return null;
}

export function saveMappingWorkspaceState(state: MappingWorkspaceState): void {
  try {
    localStorage.setItem(MAPPING_WORKSPACE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save mapping workspace state:', e);
  }
}

export function clearMappingWorkspaceState(): void {
  try {
    localStorage.removeItem(MAPPING_WORKSPACE_KEY);
  } catch (e) {
    console.error('Failed to clear mapping workspace state:', e);
  }
}

// ============================================
// ERD Table Positions Storage (per script)
// ============================================

const ERD_POSITIONS_KEY = 'dm_tool_erd_positions';

export interface ERDTablePosition {
  x: number;
  y: number;
}

export interface ERDPositionsState {
  [scriptId: string]: {
    tablePositions: Record<string, ERDTablePosition>; // tableId -> position
    scale: number;
    stagePosition: { x: number; y: number };
  };
}

export function loadERDPositions(scriptId: string): {
  tablePositions: Record<string, ERDTablePosition>;
  scale: number;
  stagePosition: { x: number; y: number };
} | null {
  try {
    const data = localStorage.getItem(ERD_POSITIONS_KEY);
    if (data) {
      const allPositions: ERDPositionsState = JSON.parse(data);
      return allPositions[scriptId] || null;
    }
  } catch (e) {
    console.error('Failed to load ERD positions:', e);
  }
  return null;
}

export function saveERDPositions(
  scriptId: string,
  tablePositions: Record<string, ERDTablePosition>,
  scale: number,
  stagePosition: { x: number; y: number }
): void {
  try {
    const data = localStorage.getItem(ERD_POSITIONS_KEY);
    const allPositions: ERDPositionsState = data ? JSON.parse(data) : {};

    allPositions[scriptId] = {
      tablePositions,
      scale,
      stagePosition,
    };

    localStorage.setItem(ERD_POSITIONS_KEY, JSON.stringify(allPositions));
  } catch (e) {
    console.error('Failed to save ERD positions:', e);
  }
}

export function clearERDPositions(scriptId: string): void {
  try {
    const data = localStorage.getItem(ERD_POSITIONS_KEY);
    if (data) {
      const allPositions: ERDPositionsState = JSON.parse(data);
      delete allPositions[scriptId];
      localStorage.setItem(ERD_POSITIONS_KEY, JSON.stringify(allPositions));
    }
  } catch (e) {
    console.error('Failed to clear ERD positions:', e);
  }
}

// ============================================
// Script Versioning
// ============================================

const DEFAULT_MAX_VERSIONS = 50;

/**
 * Migrate existing scripts to include versioning fields
 * Creates an initial version from the current state
 */
export function migrateScriptToVersioning(script: Script): Script {
  // Already has versioning
  if (script.versions && script.versions.length > 0) {
    return script;
  }

  // Create initial version from current state
  const initialVersion: ScriptVersion = {
    id: generateId(),
    versionNumber: 1,
    content: script.rawContent,
    data: script.data,
    message: 'Initial version',
    createdAt: script.createdAt,
  };

  return {
    ...script,
    currentVersionId: initialVersion.id,
    versions: [initialVersion],
    versioningEnabled: true,
    maxVersions: DEFAULT_MAX_VERSIONS,
  };
}

/**
 * Migrate all scripts to versioning format
 */
export function migrateScriptsToVersioning(scripts: Script[]): Script[] {
  return scripts.map(migrateScriptToVersioning);
}

/**
 * Create a new version for a script
 * Returns the updated script with the new version
 */
export function createScriptVersion(
  script: Script,
  message?: string
): Script {
  // Ensure script has versioning enabled
  const migratedScript = migrateScriptToVersioning(script);

  const versions = migratedScript.versions || [];
  const newVersionNumber = versions.length > 0
    ? Math.max(...versions.map(v => v.versionNumber)) + 1
    : 1;

  const newVersion: ScriptVersion = {
    id: generateId(),
    versionNumber: newVersionNumber,
    content: migratedScript.rawContent,
    data: migratedScript.data,
    message: message || `Version ${newVersionNumber}`,
    createdAt: Date.now(),
  };

  // Prepend new version (newest first)
  let updatedVersions = [newVersion, ...versions];

  // Enforce max versions limit
  const maxVersions = migratedScript.maxVersions || DEFAULT_MAX_VERSIONS;
  if (updatedVersions.length > maxVersions) {
    updatedVersions = updatedVersions.slice(0, maxVersions);
  }

  return {
    ...migratedScript,
    currentVersionId: newVersion.id,
    versions: updatedVersions,
    updatedAt: Date.now(),
  };
}

/**
 * Set a version as the current version (jump to that version)
 * Does NOT create a new version - just switches the current pointer
 * If user edits after this, a new version will be created
 */
export function setCurrentVersion(
  script: Script,
  versionId: string
): Script {
  const versions = script.versions || [];
  const targetVersion = versions.find(v => v.id === versionId);

  if (!targetVersion) {
    throw new Error(`Version ${versionId} not found`);
  }

  return {
    ...script,
    currentVersionId: targetVersion.id,
    rawContent: targetVersion.content,
    data: targetVersion.data,
    updatedAt: Date.now(),
  };
}

/**
 * @deprecated Use setCurrentVersion instead
 * Restore a previous version by setting it as current
 */
export function restoreScriptVersion(
  script: Script,
  versionId: string
): Script {
  return setCurrentVersion(script, versionId);
}

/**
 * Get a specific version by ID
 */
export function getScriptVersion(
  script: Script,
  versionId: string
): ScriptVersion | null {
  return script.versions?.find(v => v.id === versionId) || null;
}

/**
 * Get the current version of a script
 */
export function getCurrentVersion(script: Script): ScriptVersion | null {
  if (!script.currentVersionId || !script.versions) {
    return null;
  }
  return script.versions.find(v => v.id === script.currentVersionId) || null;
}

/**
 * Get the previous version (before current)
 */
export function getPreviousVersion(script: Script): ScriptVersion | null {
  if (!script.versions || script.versions.length < 2) {
    return null;
  }
  // Versions are sorted newest first, so index 1 is the previous
  return script.versions[1] || null;
}

/**
 * Check if script has unsaved changes compared to current version
 */
export function hasUnsavedChanges(script: Script): boolean {
  const currentVersion = getCurrentVersion(script);
  if (!currentVersion) {
    return true; // No versions means changes haven't been saved
  }
  return script.rawContent !== currentVersion.content;
}

/**
 * Delete a specific version (cannot delete the only version)
 */
export function deleteScriptVersion(
  script: Script,
  versionId: string
): Script {
  const versions = script.versions || [];

  if (versions.length <= 1) {
    throw new Error('Cannot delete the only version');
  }

  const filteredVersions = versions.filter(v => v.id !== versionId);

  // If we deleted the current version, set current to the newest remaining
  let currentVersionId = script.currentVersionId;
  if (currentVersionId === versionId) {
    currentVersionId = filteredVersions[0]?.id;
  }

  return {
    ...script,
    currentVersionId,
    versions: filteredVersions,
    updatedAt: Date.now(),
  };
}

/**
 * Update max versions setting for a script
 */
export function setMaxVersions(script: Script, maxVersions: number): Script {
  const clampedMax = Math.max(1, Math.min(100, maxVersions));
  let versions = script.versions || [];

  // Trim versions if exceeding new limit
  if (versions.length > clampedMax) {
    versions = versions.slice(0, clampedMax);
  }

  return {
    ...script,
    maxVersions: clampedMax,
    versions,
    updatedAt: Date.now(),
  };
}

/**
 * Calculate approximate storage size for a script's versions
 */
export function getVersionsStorageSize(script: Script): number {
  if (!script.versions) return 0;

  let totalSize = 0;
  for (const version of script.versions) {
    // Rough estimate: content length + JSON overhead
    totalSize += (version.content?.length || 0) * 2; // UTF-16 encoding
    totalSize += JSON.stringify(version.data || {}).length;
    totalSize += 200; // Metadata overhead
  }

  return totalSize;
}

/**
 * Get storage size in human-readable format
 */
export function formatStorageSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
