import { Script, MappingProject, TypeRuleSet } from '../types';

const STORAGE_KEY = 'dm_tool_data';
const THEME_KEY = 'dm_tool_theme';
const THEME_VARIANT_KEY = 'dm_tool_theme_variant';
const MAPPING_PROJECTS_KEY = 'dm_tool_mapping_projects';
const TYPE_RULE_SETS_KEY = 'dm_tool_type_rule_sets';
const MAPPING_WORKSPACE_KEY = 'dm_tool_mapping_workspace';

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
