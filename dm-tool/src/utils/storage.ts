import { Script, MappingProject, TypeRuleSet, ScriptVersion, FlowchartScript } from '../types';
import {
  saveWorkspaceToFile,
  isElectron,
  saveWorkspaceShards,
  type ShardSavePayload,
} from '../services/electronStorage';
import {
  initIdbCache,
  getSync as idbGetSync,
  setSync as idbSetSync,
  flushPending as idbFlushPending,
} from '../services/idbCache';

const STORAGE_KEY = 'dm_tool_data';
const THEME_KEY = 'dm_tool_theme';
const THEME_VARIANT_KEY = 'dm_tool_theme_variant';
const MAPPING_PROJECTS_KEY = 'dm_tool_mapping_projects';
const TYPE_RULE_SETS_KEY = 'dm_tool_type_rule_sets';
const MAPPING_WORKSPACE_KEY = 'dm_tool_mapping_workspace';
const FLOWCHART_SCRIPTS_KEY = 'dm_flowchart_scripts';
const ACTIVE_SCRIPT_ID_KEY = 'dm_tool_active_script_id';

// Git sync settings keys
const GIT_SYNC_PATH_KEY = 'dm_tool_git_sync_path';
const GIT_SYNC_ENABLED_KEY = 'dm_tool_git_sync_enabled';
const GIT_SYNC_LAST_SAVED_KEY = 'dm_tool_git_sync_last_saved';

// ============================================
// SQLite storage feature flag
//
// New default since PR2 (cutover): ON for fresh users. Existing users get
// the default applied on first launch via ensureSqliteStorageDefault(),
// which then triggers MigrationSplash to import shards into SQLite.
//
// When ON the renderer:
//   1. tries db.loadWorkspace() first; falls back to shards on failure
//   2. dual-writes saves to both shards and SQLite (rollback safety during
//      the 2-release ramp; Phase 4 drops the shard write)
//
// Users can flip the flag from Settings → Storage to roll back at any time.
// ============================================
const SQLITE_STORAGE_FLAG_KEY = 'dm_tool_use_sqlite_storage';
const SQLITE_STORAGE_DEFAULT_APPLIED_KEY = 'dm_tool_use_sqlite_storage_default_applied';

export function isSqliteStorageEnabled(): boolean {
  try {
    return localStorage.getItem(SQLITE_STORAGE_FLAG_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setSqliteStorageEnabled(enabled: boolean): void {
  try {
    if (enabled) localStorage.setItem(SQLITE_STORAGE_FLAG_KEY, 'true');
    else localStorage.removeItem(SQLITE_STORAGE_FLAG_KEY);
    // Mark the default as applied so we don't re-flip it back on next launch.
    localStorage.setItem(SQLITE_STORAGE_DEFAULT_APPLIED_KEY, 'true');
  } catch {}
}

/**
 * Apply the SQLite-by-default policy if it hasn't been applied yet.
 * Idempotent — safe to call on every launch. After the first call, the flag
 * is "owned" by the user (manual toggles via setSqliteStorageEnabled persist).
 *
 * Only takes effect in Electron, since the SQLite layer doesn't exist in web.
 */
export function ensureSqliteStorageDefault(): void {
  try {
    if (typeof window === 'undefined') return;
    if (!window.electronAPI?.isElectron) return;
    if (localStorage.getItem(SQLITE_STORAGE_DEFAULT_APPLIED_KEY) === 'true') return;
    // Default is ON for everyone the first time we see them in Electron.
    localStorage.setItem(SQLITE_STORAGE_FLAG_KEY, 'true');
    localStorage.setItem(SQLITE_STORAGE_DEFAULT_APPLIED_KEY, 'true');
  } catch {}
}

// Git repository sync filename
export const GIT_WORKSPACE_FILENAME = 'workspace.json';

// ============================================
// Git Sync Path Settings
// ============================================

export interface GitSyncSettings {
  path: string | null;
  enabled: boolean;
  lastSaved: number | null;
}

export function getGitSyncSettings(): GitSyncSettings {
  return {
    path: localStorage.getItem(GIT_SYNC_PATH_KEY),
    enabled: localStorage.getItem(GIT_SYNC_ENABLED_KEY) === 'true',
    lastSaved: localStorage.getItem(GIT_SYNC_LAST_SAVED_KEY)
      ? parseInt(localStorage.getItem(GIT_SYNC_LAST_SAVED_KEY)!, 10)
      : null,
  };
}

export function setGitSyncPath(path: string | null): void {
  if (path) {
    localStorage.setItem(GIT_SYNC_PATH_KEY, path);
  } else {
    localStorage.removeItem(GIT_SYNC_PATH_KEY);
  }
}

export function setGitSyncEnabled(enabled: boolean): void {
  localStorage.setItem(GIT_SYNC_ENABLED_KEY, String(enabled));
}

export function updateGitSyncLastSaved(): void {
  localStorage.setItem(GIT_SYNC_LAST_SAVED_KEY, String(Date.now()));
}

export function getFullGitSyncPath(): string | null {
  const settings = getGitSyncSettings();
  if (!settings.path) return null;
  return `${settings.path}/${GIT_WORKSPACE_FILENAME}`;
}

// Git sync auto-save (debounced)
let gitSyncTimeout: ReturnType<typeof setTimeout> | null = null;
let gitSyncListeners: Array<(status: 'saving' | 'saved' | 'error', message?: string) => void> = [];

export function subscribeToGitSyncStatus(
  callback: (status: 'saving' | 'saved' | 'error', message?: string) => void
): () => void {
  gitSyncListeners.push(callback);
  return () => {
    gitSyncListeners = gitSyncListeners.filter(cb => cb !== callback);
  };
}

function notifyGitSyncStatus(status: 'saving' | 'saved' | 'error', message?: string): void {
  gitSyncListeners.forEach(cb => cb(status, message));
}

async function performGitSync(): Promise<void> {
  const settings = getGitSyncSettings();
  if (!settings.enabled || !settings.path) return;
  if (!isElectron()) return;

  const fullPath = getFullGitSyncPath();
  if (!fullPath) return;

  notifyGitSyncStatus('saving');

  try {
    const api = window.electronAPI;
    if (!api) throw new Error('Electron API not available');

    const workspace = exportWorkspace();
    const result = await api.saveWorkspaceToPath(fullPath, workspace);

    if (result.success) {
      updateGitSyncLastSaved();
      notifyGitSyncStatus('saved');
      console.log('✅ Git sync: Workspace saved to', fullPath);
    } else {
      throw new Error(result.error || 'Unknown error');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    notifyGitSyncStatus('error', message);
    console.error('❌ Git sync failed:', message);
  }
}

function scheduleGitSync(): void {
  const settings = getGitSyncSettings();
  if (!settings.enabled || !settings.path) return;

  // Debounce: wait 3 seconds after last change before syncing
  if (gitSyncTimeout) {
    clearTimeout(gitSyncTimeout);
  }

  gitSyncTimeout = setTimeout(() => {
    performGitSync();
  }, 3000);
}

// Manual git sync (immediate)
export async function triggerGitSync(): Promise<boolean> {
  if (gitSyncTimeout) {
    clearTimeout(gitSyncTimeout);
    gitSyncTimeout = null;
  }

  const settings = getGitSyncSettings();
  if (!settings.path) return false;

  // Temporarily enable for this sync
  const wasEnabled = settings.enabled;
  if (!wasEnabled) {
    setGitSyncEnabled(true);
  }

  await performGitSync();

  if (!wasEnabled) {
    setGitSyncEnabled(false);
  }

  return true;
}

// ============================================
// Auto-save scheduler (sharded fast path + slow monolithic snapshot)
//
// Fast path (1 sec debounce): write only changed script/flowchart shards
// to userData/workspace-shards/. Change detection is reference equality
// against the last-saved snapshot, which matches React's immutable update
// pattern (unchanged scripts retain object identity across array updates).
//
// Slow path (30 sec debounce): consolidate the full WorkspaceData into
// userData/workspace.json. Keeps the canonical single-file artifact that
// existing backups, git sync, and import/export rely on.
// ============================================

// In-memory mirrors of the latest scripts / flowcharts arrays as passed in
// by the renderer. These hold the SAME object references React holds, which
// is what makes reference-equality change detection correct. Reading from
// localStorage instead would parse JSON each time and return fresh objects,
// defeating the diff. Mirrors are populated by saveScripts / saveFlowchartScripts
// (and seedSaveSnapshot at startup); reads inside the save scheduler must use
// these, never loadScripts/loadFlowchartScripts.
let scriptsMirror: Script[] = [];
let flowchartsMirror: FlowchartScript[] = [];

// Snapshots used for change detection. Map by id → reference last persisted.
const lastSavedScriptRef = new Map<string, Script>();
const lastSavedFlowchartRef = new Map<string, FlowchartScript>();
// Stringified meta sub-fields (small) — string compare is cheap and exact.
let lastSavedMetaJson: string | null = null;

function buildMetaForShards() {
  // Mirrors the meta portion that exportWorkspace assembles, but drops the
  // heavy scripts/flowcharts arrays (those go to per-shard files).
  const erdPositions: Record<string, Record<string, { x: number; y: number }>> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('erd_positions_')) {
      const scriptId = key.replace('erd_positions_', '');
      const data = localStorage.getItem(key);
      if (data) {
        try { erdPositions[scriptId] = JSON.parse(data); } catch {}
      }
    }
  }
  let ddVisibleColumns: unknown = undefined;
  let ddColumnWidths: unknown = undefined;
  try {
    const v = localStorage.getItem(DD_VISIBLE_COLUMNS_KEY);
    if (v) ddVisibleColumns = JSON.parse(v);
  } catch {}
  try {
    const w = localStorage.getItem(DD_COLUMN_WIDTHS_KEY);
    if (w) ddColumnWidths = JSON.parse(w);
  } catch {}
  return {
    theme: loadTheme(),
    themeVariant: loadDarkThemeVariant(),
    mappingProjects: loadMappingProjects(),
    typeRuleSets: loadTypeRuleSets(),
    erdPositions,
    ddVisibleColumns,
    ddColumnWidths,
  };
}

function diffShardsAgainstSnapshot(
  scripts: Script[],
  flowcharts: FlowchartScript[]
): {
  changedScripts: Script[];
  removedScriptIds: string[];
  changedFlowcharts: FlowchartScript[];
  removedFlowchartIds: string[];
} {
  const changedScripts: Script[] = [];
  const seenScriptIds = new Set<string>();
  for (const s of scripts) {
    seenScriptIds.add(s.id);
    if (lastSavedScriptRef.get(s.id) !== s) changedScripts.push(s);
  }
  const removedScriptIds: string[] = [];
  for (const id of lastSavedScriptRef.keys()) {
    if (!seenScriptIds.has(id)) removedScriptIds.push(id);
  }

  const changedFlowcharts: FlowchartScript[] = [];
  const seenFlowIds = new Set<string>();
  for (const f of flowcharts) {
    seenFlowIds.add(f.id);
    if (lastSavedFlowchartRef.get(f.id) !== f) changedFlowcharts.push(f);
  }
  const removedFlowchartIds: string[] = [];
  for (const id of lastSavedFlowchartRef.keys()) {
    if (!seenFlowIds.has(id)) removedFlowchartIds.push(id);
  }

  return { changedScripts, removedScriptIds, changedFlowcharts, removedFlowchartIds };
}

/**
 * Seed the change-detection snapshot from the current mirrors. Called after
 * a fresh load from disk so the first save after startup is a no-op rather
 * than a spurious full rewrite.
 *
 * Must be called AFTER importWorkspace so the mirrors are populated. The
 * `scripts` / `flowcharts` parameters are accepted for backward compatibility
 * but ignored — refs come from the mirrors which are guaranteed to match
 * what the renderer holds.
 */
export function seedSaveSnapshot(_scripts?: Script[], _flowcharts?: FlowchartScript[]): void {
  lastSavedScriptRef.clear();
  for (const s of scriptsMirror) lastSavedScriptRef.set(s.id, s);
  lastSavedFlowchartRef.clear();
  for (const f of flowchartsMirror) lastSavedFlowchartRef.set(f.id, f);
  // Snapshot the meta as well so the first auto-save after load doesn't
  // rewrite meta.json with content identical to what's already on disk.
  try {
    lastSavedMetaJson = JSON.stringify(buildMetaForShards());
  } catch {
    lastSavedMetaJson = null;
  }
}

let shardSaveTimeout: ReturnType<typeof setTimeout> | null = null;
let monolithicSaveTimeout: ReturnType<typeof setTimeout> | null = null;
let shardSaveInFlight: Promise<void> | null = null;

async function performShardSave(): Promise<void> {
  if (!isElectron()) return;
  // If a shard save is currently running, just chain — the next call will
  // see the latest in-memory state.
  if (shardSaveInFlight) {
    await shardSaveInFlight.catch(() => {});
  }

  const run = (async () => {
    // Read from in-memory mirrors so refs are stable across reads
    // (loadScripts would re-parse JSON and produce fresh refs each call,
    // making every script appear "changed").
    const scripts = scriptsMirror;
    const flowcharts = flowchartsMirror;

    const diff = diffShardsAgainstSnapshot(scripts, flowcharts);
    const meta = buildMetaForShards();
    const metaJson = JSON.stringify(meta);
    const metaChanged = metaJson !== lastSavedMetaJson;

    if (
      diff.changedScripts.length === 0 &&
      diff.removedScriptIds.length === 0 &&
      diff.changedFlowcharts.length === 0 &&
      diff.removedFlowchartIds.length === 0 &&
      !metaChanged
    ) {
      return; // nothing to do
    }

    const payload: ShardSavePayload = {
      changedScripts: diff.changedScripts,
      removedScriptIds: diff.removedScriptIds,
      changedFlowcharts: diff.changedFlowcharts,
      removedFlowchartIds: diff.removedFlowchartIds,
      meta,
      manifest: {
        version: '1.2.0',
        scriptIds: scripts.map(s => s.id),
        flowchartIds: flowcharts.map(f => f.id),
        updatedAt: new Date().toISOString(),
      },
    };

    const ok = await saveWorkspaceShards(payload);
    if (!ok) {
      console.error('❌ Shard save reported failure — snapshot left untouched, will retry next change');
      return;
    }

    // Dual-write to SQLite when the flag is ON. The shard write above is the
    // source of truth during the rollback ramp; SQLite is shadowed alongside
    // it so a flag flip-back is consistent. If the SQLite write fails we
    // log + continue — the shard write already succeeded, so user data is safe.
    // Phase 4 (post-soak) drops the shard write and leaves SQLite as the
    // sole writer.
    if (isSqliteStorageEnabled()) {
      try {
        const { dbSaveDiff } = await import('../services/dbStorage');
        const dbOk = await dbSaveDiff(payload);
        if (!dbOk) {
          console.error('❌ SQLite mirror write failed (shards succeeded); next save will retry');
        }
      } catch (err) {
        console.error('❌ SQLite mirror write threw (shards succeeded):', err);
      }
    }

    // Update snapshot only after a successful disk write so a failure
    // doesn't drop the change from future diffs.
    for (const s of diff.changedScripts) lastSavedScriptRef.set(s.id, s);
    for (const id of diff.removedScriptIds) lastSavedScriptRef.delete(id);
    for (const f of diff.changedFlowcharts) lastSavedFlowchartRef.set(f.id, f);
    for (const id of diff.removedFlowchartIds) lastSavedFlowchartRef.delete(id);
    if (metaChanged) lastSavedMetaJson = metaJson;

    console.log(
      `📁 Sharded save: ${diff.changedScripts.length} scripts, ` +
      `${diff.changedFlowcharts.length} flowcharts, ` +
      `removed ${diff.removedScriptIds.length + diff.removedFlowchartIds.length}, ` +
      `meta=${metaChanged}`
    );
  })();

  shardSaveInFlight = run;
  try { await run; } finally { shardSaveInFlight = null; }
}

async function performMonolithicSave(): Promise<void> {
  if (!isElectron()) return;
  try {
    const workspaceData = exportWorkspace();
    await saveWorkspaceToFile(workspaceData);
    console.log('📁 Auto-saved consolidated workspace.json');
  } catch (error) {
    console.error('Failed to consolidate workspace.json:', error);
  }
}

function scheduleElectronSave() {
  if (!isElectron()) return;

  // Git sync (unchanged debounce)
  scheduleGitSync();

  // Fast path: 1 sec debounce, only changed shards
  if (shardSaveTimeout) clearTimeout(shardSaveTimeout);
  shardSaveTimeout = setTimeout(() => { performShardSave(); }, 1000);

  // Slow path: 30 sec debounce, full workspace.json consolidation
  if (monolithicSaveTimeout) clearTimeout(monolithicSaveTimeout);
  monolithicSaveTimeout = setTimeout(() => { performMonolithicSave(); }, 30000);
}

/**
 * Force-flush all pending writes:
 *   - IDB-cached large keys (scripts/flowcharts/mappingProjects)
 *   - Sharded workspace files (Electron only)
 *   - Consolidated workspace.json (Electron only)
 * Call before exporting, before quitting, or whenever the user explicitly saves.
 */
export async function flushElectronSaves(): Promise<void> {
  // IDB flush is needed in both Electron and web modes
  await idbFlushPending();
  if (!isElectron()) return;
  if (shardSaveTimeout) { clearTimeout(shardSaveTimeout); shardSaveTimeout = null; }
  if (monolithicSaveTimeout) { clearTimeout(monolithicSaveTimeout); monolithicSaveTimeout = null; }
  await performShardSave();
  await performMonolithicSave();
}

// ============================================
// Script Storage
// ============================================

// Keys routed through IDB rather than localStorage. They store the largest
// JSON blobs in the app and were hitting Chromium's ~10MB localStorage cap.
const IDB_KEYS = [STORAGE_KEY, FLOWCHART_SCRIPTS_KEY, MAPPING_PROJECTS_KEY];

/**
 * Hydrate the IDB-backed cache for large keys. Must be awaited at startup
 * before any reads of scripts / flowcharts / mapping projects. After this
 * resolves, sync reads return the IDB value (or the migrated localStorage
 * value if this is the first run on a new build).
 */
export async function initStorage(): Promise<void> {
  await initIdbCache(IDB_KEYS);
}

export function loadScripts(): Script[] {
  try {
    const data = idbGetSync(STORAGE_KEY);
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
    scriptsMirror = scripts; // canonical refs for the diff path
    idbSetSync(STORAGE_KEY, JSON.stringify(scripts));
    scheduleElectronSave(); // Auto-save to file when running in Electron
  } catch (e) {
    console.error('Failed to save scripts:', e);
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function loadScriptOrder(): string[] {
  try {
    const data = localStorage.getItem('dm_tool_script_order');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load script order:', e);
  }
  return [];
}

// Persist which script the user has selected in the top dropdown so the same
// one is restored on next launch. Tiny string value — kept on localStorage
// (no need for IDB). On load we still validate that the saved id exists in
// the loaded scripts array; if the script was deleted in the meantime we
// fall back to the first available one.
export function loadActiveScriptId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_SCRIPT_ID_KEY);
  } catch {
    return null;
  }
}

export function saveActiveScriptId(id: string | null): void {
  try {
    if (id) localStorage.setItem(ACTIVE_SCRIPT_ID_KEY, id);
    else localStorage.removeItem(ACTIVE_SCRIPT_ID_KEY);
  } catch {
    // ignore quota / privacy-mode errors — selection just won't persist
  }
}

export function getSortedScripts(scripts: Script[]): Script[] {
  const order = loadScriptOrder();
  if (order.length === 0) return scripts;

  return [...scripts].sort((a, b) => {
    const indexA = order.indexOf(a.id);
    const indexB = order.indexOf(b.id);
    // If not in order list, put at end
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
}

export function reparseScript(scriptId: string): void {
  const scripts = loadScripts();
  const scriptIndex = scripts.findIndex(s => s.id === scriptId);

  if (scriptIndex === -1) {
    console.error('Script not found');
    return;
  }

  const script = scripts[scriptIndex];

  // Re-parse the raw content
  const { parsePostgreSQL, parseOracle, parseDBML } = require('./parsers');

  let newData;
  switch (script.type) {
    case 'postgresql':
      newData = parsePostgreSQL(script.rawContent);
      break;
    case 'oracle':
      newData = parseOracle(script.rawContent);
      break;
    case 'dbml':
      newData = parseDBML(script.rawContent);
      break;
    default:
      console.error('Unknown script type');
      return;
  }

  // Update the script with new parsed data
  scripts[scriptIndex] = {
    ...script,
    data: newData,
    updatedAt: Date.now()
  };

  saveScripts(scripts);

  // Trigger storage event to reload in other components
  window.dispatchEvent(new Event('storage'));

  console.log('Script re-parsed successfully');
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
  flowchartScripts?: FlowchartScript[];  // Added for complete workspace sync
  mappingProjects: MappingProject[];
  typeRuleSets: TypeRuleSet[];
  theme: 'light' | 'dark';
  themeVariant: DarkThemeVariant;
  erdPositions: Record<string, Record<string, { x: number; y: number }>>;
  ddVisibleColumns?: Record<string, DDColumnState | string[]>;  // Data Dictionary column visibility per script
  ddColumnWidths?: Record<string, Record<string, number>>;  // Data Dictionary column widths per script
}

// ============================================
// Flowchart Scripts Storage
// ============================================

export function loadFlowchartScripts(): FlowchartScript[] {
  try {
    const data = idbGetSync(FLOWCHART_SCRIPTS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load flowchart scripts:', e);
  }
  return [];
}

export function saveFlowchartScripts(scripts: FlowchartScript[]): void {
  try {
    flowchartsMirror = scripts; // canonical refs for the diff path
    idbSetSync(FLOWCHART_SCRIPTS_KEY, JSON.stringify(scripts));
    scheduleElectronSave();
  } catch (e) {
    console.error('Failed to save flowchart scripts:', e);
  }
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

  // Load DD visible columns
  let ddVisibleColumns: Record<string, DDColumnState | string[]> = {};
  try {
    const ddData = localStorage.getItem(DD_VISIBLE_COLUMNS_KEY);
    if (ddData) {
      ddVisibleColumns = JSON.parse(ddData);
    }
  } catch (e) {
    console.warn('Failed to parse DD visible columns for export');
  }

  // Load DD column widths
  let ddColumnWidths: Record<string, Record<string, number>> = {};
  try {
    const cwData = localStorage.getItem(DD_COLUMN_WIDTHS_KEY);
    if (cwData) {
      ddColumnWidths = JSON.parse(cwData);
    }
  } catch (e) {
    console.warn('Failed to parse DD column widths for export');
  }

  return {
    version: '1.1.0',  // Bumped version for flowchart support
    exportDate: new Date().toISOString(),
    scripts: loadScripts(),
    flowchartScripts: loadFlowchartScripts(),  // Include flowcharts
    mappingProjects: loadMappingProjects(),
    typeRuleSets: loadTypeRuleSets(),
    theme: loadTheme(),
    themeVariant: loadDarkThemeVariant(),
    erdPositions,
    ddVisibleColumns,
    ddColumnWidths,
  };
}

export function importWorkspace(data: WorkspaceData): void {
  // Import scripts
  saveScripts(data.scripts || []);

  // Import flowchart scripts (new in v1.1.0)
  if (data.flowchartScripts) {
    saveFlowchartScripts(data.flowchartScripts);
  }

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

  // Import DD visible columns
  if (data.ddVisibleColumns) {
    localStorage.setItem(DD_VISIBLE_COLUMNS_KEY, JSON.stringify(data.ddVisibleColumns));
  }

  // Import DD column widths
  if (data.ddColumnWidths) {
    localStorage.setItem(DD_COLUMN_WIDTHS_KEY, JSON.stringify(data.ddColumnWidths));
  }

  // Save to Electron file if running in Electron
  scheduleElectronSave();
}

// ============================================
// Git Repository Sync Functions
// ============================================

/**
 * Export workspace for git repository sync
 * Downloads the file with a fixed name that can be committed to git
 */
export function exportWorkspaceForGit(): void {
  const workspace = exportWorkspace();
  downloadJson(workspace, GIT_WORKSPACE_FILENAME);
}

/**
 * Get workspace summary for display
 */
export function getWorkspaceSummary(): {
  scripts: number;
  flowcharts: number;
  mappingProjects: number;
  typeRuleSets: number;
  totalSize: string;
} {
  const workspace = exportWorkspace();
  const jsonStr = JSON.stringify(workspace);
  const sizeInMB = (jsonStr.length / (1024 * 1024)).toFixed(2);

  return {
    scripts: workspace.scripts.length,
    flowcharts: workspace.flowchartScripts?.length || 0,
    mappingProjects: workspace.mappingProjects.length,
    typeRuleSets: workspace.typeRuleSets.length,
    totalSize: `${sizeInMB} MB`,
  };
}

/**
 * Load workspace from Electron file system on startup.
 *
 * Source preference (since PR2 cutover):
 *   0. SQLite via window.electronAPI.db.loadWorkspace() when the flag is ON.
 *      Migration from shards (if needed) is handled by MigrationSplash before
 *      this is called, so by the time we get here SQLite either has the data
 *      or we fall through to shards.
 *   1. workspace-shards/ if its manifest is newer than workspace.json
 *   2. workspace.json otherwise (legacy / consolidated snapshot)
 *
 * After loading, seed the change-detection snapshot so the first edit
 * after startup only writes the actually-changed shard.
 */
export async function loadWorkspaceFromElectron(): Promise<boolean> {
  if (!isElectron()) {
    return false;
  }

  try {
    const {
      loadWorkspaceFromFile,
      loadWorkspaceShards,
      getStorageMtimes,
    } = await import('../services/electronStorage');

    let data: WorkspaceData | null = null;

    // (0) SQLite path. On any failure (missing native module, integrity error,
    // empty DB) we silently fall through to the shard reader. The shard files
    // remain on disk during the rollback ramp, so this is a safe escape hatch.
    if (isSqliteStorageEnabled()) {
      try {
        const { dbLoadWorkspace, dbStatus } = await import('../services/dbStorage');
        const status = await dbStatus();
        if (status && (status.scriptCount || 0) > 0) {
          console.log('📁 Loading workspace from SQLite...');
          data = await dbLoadWorkspace();
        } else {
          console.log('📁 SQLite enabled but DB is empty — falling back to shards.');
        }
      } catch (err) {
        console.error('SQLite load failed; falling back to shards', err);
      }
    }

    if (!data) {
      const mtimes = await getStorageMtimes();
      const useShards =
        mtimes.shardsMs !== null &&
        (mtimes.workspaceMs === null || mtimes.shardsMs >= mtimes.workspaceMs);

      if (useShards) {
        console.log('📁 Loading workspace from shards (newer than workspace.json)...');
        data = await loadWorkspaceShards();
      }
      if (!data) {
        console.log('📁 Loading workspace from workspace.json...');
        data = await loadWorkspaceFromFile();
      }
    }

    if (data) {
      importWorkspace(data);
      // Seed change-detection snapshot from what was just loaded so the
      // first save after startup is a no-op (no spurious full rewrite).
      seedSaveSnapshot(data.scripts || [], data.flowchartScripts || []);
      console.log('✅ Workspace loaded');
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
    const data = idbGetSync(MAPPING_PROJECTS_KEY);
    if (data) {
      const projects = JSON.parse(data) as MappingProject[];
      // Migrate old mappings that might be missing the validation property
      let needsSave = false;
      for (const project of projects) {
        for (const mapping of project.mappings) {
          if (!mapping.validation) {
            mapping.validation = {
              typeMatch: true,
              sizeMatch: true,
              nullableMatch: true,
              precisionMatch: true,
              defaultMatch: true,
              constraintMatch: true,
              warnings: [],
              errors: [],
            };
            needsSave = true;
          }
        }
      }
      // Save migrated data if any changes were made
      if (needsSave) {
        idbSetSync(MAPPING_PROJECTS_KEY, JSON.stringify(projects));
        console.log('Migrated mapping projects to add missing validation properties');
      }
      return projects;
    }
  } catch (e) {
    console.error('Failed to load mapping projects:', e);
  }
  return [];
}

export function saveMappingProjects(projects: MappingProject[]): void {
  try {
    idbSetSync(MAPPING_PROJECTS_KEY, JSON.stringify(projects));
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
// Migration: Convert inline typeRules to global TypeRuleSet
// ============================================

export function migrateProjectTypeRules(): void {
  const projects = loadMappingProjects();
  const ruleSets = loadTypeRuleSets();
  let needsSave = false;

  // Find or create a single shared default TypeRuleSet
  let defaultRuleSet = ruleSets.find(rs => rs.name === 'Default Type Rules');

  if (!defaultRuleSet) {
    defaultRuleSet = {
      id: generateId(),
      name: 'Default Type Rules',
      description: 'Shared type compatibility rules across all schemas',
      sourceDb: 'any',
      targetDb: 'any',
      rules: [],
      isBuiltIn: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    ruleSets.push(defaultRuleSet);
    needsSave = true;
  }

  // Migrate all projects to use the shared default TypeRuleSet
  projects.forEach(project => {
    // Skip if already using a TypeRuleSet
    if (project.typeRuleSetId) {
      return;
    }

    // Merge any inline rules into the shared default TypeRuleSet
    if (project.typeRules && project.typeRules.length > 0) {
      // Add rules that don't already exist in the default set
      project.typeRules.forEach(rule => {
        const exists = defaultRuleSet!.rules.some(r =>
          r.sourcePattern === rule.sourcePattern &&
          r.targetPattern === rule.targetPattern
        );
        if (!exists) {
          defaultRuleSet!.rules.push(rule);
        }
      });
      defaultRuleSet!.updatedAt = Date.now();
      delete project.typeRules;
    }

    // Assign all projects to the shared default TypeRuleSet
    project.typeRuleSetId = defaultRuleSet!.id;
    needsSave = true;
  });

  if (needsSave) {
    saveTypeRuleSets(ruleSets);
    saveMappingProjects(projects);
    console.log('Migrated all projects to shared Default Type Rules');
  }
}

// Consolidate all TypeRuleSets into one shared default
export function consolidateTypeRuleSets(): void {
  try {
    const projects = loadMappingProjects();
    const ruleSets = loadTypeRuleSets();

    // Skip if there's only 0 or 1 TypeRuleSet (nothing to consolidate)
    if (ruleSets.length <= 1) {
      console.log('No consolidation needed - already using single TypeRuleSet');
      return;
    }

    // Find or create the shared default TypeRuleSet
    let defaultRuleSet = ruleSets.find(rs => rs.name === 'Default Type Rules');

    if (!defaultRuleSet) {
      defaultRuleSet = {
        id: generateId(),
        name: 'Default Type Rules',
        description: 'Shared type compatibility rules across all schemas',
        sourceDb: 'any',
        targetDb: 'any',
        rules: [],
        isBuiltIn: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    }

    // Merge all rules from other TypeRuleSets into the default
    const otherRuleSets = ruleSets.filter(rs => rs.name !== 'Default Type Rules');
    otherRuleSets.forEach(ruleSet => {
      if (ruleSet.rules && Array.isArray(ruleSet.rules)) {
        ruleSet.rules.forEach(rule => {
          const exists = defaultRuleSet!.rules.some(r =>
            r.sourcePattern === rule.sourcePattern &&
            r.targetPattern === rule.targetPattern
          );
          if (!exists) {
            defaultRuleSet!.rules.push(rule);
          }
        });
      }
    });

    // Update all projects to use the shared default TypeRuleSet
    projects.forEach(project => {
      project.typeRuleSetId = defaultRuleSet!.id;
    });

    // Save only the default TypeRuleSet (remove all others)
    saveTypeRuleSets([defaultRuleSet]);
    saveMappingProjects(projects);

    console.log(`Consolidated ${otherRuleSets.length} TypeRuleSets into shared Default Type Rules with ${defaultRuleSet!.rules.length} rules`);
  } catch (error) {
    console.error('Error consolidating TypeRuleSets:', error);
    // Don't throw - allow app to continue even if consolidation fails
  }
}

// Get or create a default type rule set for a project
export function getOrCreateDefaultTypeRuleSet(): TypeRuleSet {
  const ruleSets = loadTypeRuleSets();

  // Look for existing default rule set
  let defaultRuleSet = ruleSets.find(rs => rs.name === 'Default Type Rules');

  if (!defaultRuleSet) {
    // Create a new default rule set
    defaultRuleSet = {
      id: generateId(),
      name: 'Default Type Rules',
      description: 'Shared type compatibility rules across all schemas',
      sourceDb: 'any',
      targetDb: 'any',
      rules: [],
      isBuiltIn: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    saveTypeRuleSet(defaultRuleSet);
  }

  return defaultRuleSet;
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
        warnings: m.validation?.warnings ?? [],
        errors: m.validation?.errors ?? [],
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
//
// Canonical storage: one localStorage key per script, named
// `erd_positions_<scriptId>`. Written by ERDViewer.tsx (debounced) on drag
// and read by exportWorkspace() when assembling WorkspaceData.
//
// A separate consolidated key (`dm_tool_erd_positions`) plus a parallel set
// of save/load/clear helpers used to live here, but they had zero callers
// across the codebase — orphaned dead code from an earlier design. Removed
// to eliminate the "two parallel mechanisms" footgun (see audit fix #8).
// If a future feature needs ERD positions outside the viewer, read the
// per-script keys directly the way exportWorkspace() does at line ~346.
// ============================================

export interface ERDTablePosition {
  x: number;
  y: number;
}
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

// ============================================
// Data Dictionary Visible Columns Persistence
// ============================================

const DD_VISIBLE_COLUMNS_KEY = 'dm_tool_dd_visible_columns';

// Storage format: { visible: string[], knownColumns: string[] }
// knownColumns tracks which columns existed at save time so we can
// distinguish "new column added" from "user deliberately hid column"
interface DDColumnState {
  visible: string[];
  knownColumns: string[];
}

export function loadDDVisibleColumns(scriptId: string): { visible: string[]; knownColumns: string[] } | null {
  try {
    const data = localStorage.getItem(DD_VISIBLE_COLUMNS_KEY);
    if (data) {
      const allStates = JSON.parse(data) as Record<string, DDColumnState | string[]>;
      const entry = allStates[scriptId];
      if (!entry) return null;
      // Backward compatibility: old format was just string[]
      if (Array.isArray(entry)) {
        return { visible: entry, knownColumns: entry };
      }
      return entry;
    }
  } catch (e) {
    console.error('Failed to load DD visible columns:', e);
  }
  return null;
}

export function saveDDVisibleColumns(scriptId: string, visible: string[], knownColumns: string[]): void {
  try {
    const data = localStorage.getItem(DD_VISIBLE_COLUMNS_KEY);
    const allStates = data ? JSON.parse(data) as Record<string, DDColumnState | string[]> : {};
    allStates[scriptId] = { visible, knownColumns };
    localStorage.setItem(DD_VISIBLE_COLUMNS_KEY, JSON.stringify(allStates));
    scheduleElectronSave(); // Persist to workspace file
  } catch (e) {
    console.error('Failed to save DD visible columns:', e);
  }
}

// Column widths persistence
const DD_COLUMN_WIDTHS_KEY = 'dm_tool_dd_column_widths';

export function loadDDColumnWidths(scriptId: string): Record<string, number> | null {
  try {
    const data = localStorage.getItem(DD_COLUMN_WIDTHS_KEY);
    if (data) {
      const allStates = JSON.parse(data) as Record<string, Record<string, number>>;
      return allStates[scriptId] || null;
    }
  } catch (e) {
    console.error('Failed to load DD column widths:', e);
  }
  return null;
}

export function saveDDColumnWidths(scriptId: string, widths: Record<string, number>): void {
  try {
    const data = localStorage.getItem(DD_COLUMN_WIDTHS_KEY);
    const allStates = data ? JSON.parse(data) as Record<string, Record<string, number>> : {};
    allStates[scriptId] = widths;
    localStorage.setItem(DD_COLUMN_WIDTHS_KEY, JSON.stringify(allStates));
    scheduleElectronSave();
  } catch (e) {
    console.error('Failed to save DD column widths:', e);
  }
}

// Excel export column selection persistence
const EXCEL_EXPORT_COLUMNS_KEY = 'dm_tool_excel_export_columns';

export function loadExcelExportColumns(): string[] | null {
  try {
    const data = localStorage.getItem(EXCEL_EXPORT_COLUMNS_KEY);
    if (data) return JSON.parse(data) as string[];
    return null;
  } catch {
    return null;
  }
}

export function saveExcelExportColumns(columns: string[]): void {
  try {
    localStorage.setItem(EXCEL_EXPORT_COLUMNS_KEY, JSON.stringify(columns));
  } catch (e) {
    console.error('Failed to save Excel export columns:', e);
  }
}

// Per-script Excel export selection (which tables / master codes / categories
// to include). Stored as exclusion lists so unknown new items default to
// "include" rather than vanishing on schema growth.
export interface ExcelExportSelection {
  excludedTableNames: string[];      // e.g. ['cm.cm_master_code', 'iss.iss_bid_retail']
  excludedMasterCodeKeys: string[];  // e.g. ['ALLOTSTAT_WARNING']
  excludedCategoryKeys: string[];    // e.g. ['SFGDSTAT']
}

const EXCEL_EXPORT_SELECTION_KEY_PREFIX = 'dm_tool_excel_export_selection:';
const EXCEL_EXPORT_DEFAULTS_VERSION_KEY = 'dm_tool_excel_export_defaults_version:';

// Bump when DEFAULT_EXCLUSIONS changes so existing users get the new
// defaults merged into their saved selection on next load.
const EXCEL_EXPORT_DEFAULTS_VERSION = 1;

// Out-of-the-box exclusions per script. Applied automatically:
//   - first time the user opens the preview (no saved selection)
//   - or whenever EXCEL_EXPORT_DEFAULTS_VERSION is bumped (added defaults
//     are merged INTO the user's existing exclusion lists; nothing is removed)
const DEFAULT_EXCLUSIONS: Record<string, ExcelExportSelection> = {
  'OMEGA DDL (Current)': {
    excludedTableNames: [
      // ERF — Designated for Release 2
      'stg.stg_agd_out_it050048',
      'stg.stg_agd_out_it052048',
      'stg.stg_fmbs_out_erf',
      'stg.stg_fmbs_out_erf_agg_bids',
      // Daily Prices — R2-only
      'stg.stg_fmbs_out_closingprice',
      // Syndication — R2 institutional work
      'iss.iss_synd_allotment_run',
      'iss.iss_synd_allotment_run_t',
    ],
    excludedMasterCodeKeys: ['ISSTYPE_SYNDICATION'],
    excludedCategoryKeys: [],
  },
};

function mergeUnique(a: string[], b: string[]): string[] {
  return Array.from(new Set([...a, ...b]));
}

export function loadExcelExportSelection(scriptKey: string): ExcelExportSelection | null {
  try {
    const defaults = DEFAULT_EXCLUSIONS[scriptKey];
    const versionKey = EXCEL_EXPORT_DEFAULTS_VERSION_KEY + scriptKey;
    const appliedVersion = Number(localStorage.getItem(versionKey) || '0');
    const data = localStorage.getItem(EXCEL_EXPORT_SELECTION_KEY_PREFIX + scriptKey);

    // No saved selection yet → return the baked-in defaults verbatim.
    if (!data) {
      if (defaults) {
        localStorage.setItem(versionKey, String(EXCEL_EXPORT_DEFAULTS_VERSION));
        return defaults;
      }
      return null;
    }

    const parsed = JSON.parse(data);
    const current: ExcelExportSelection = {
      excludedTableNames:     Array.isArray(parsed.excludedTableNames)     ? parsed.excludedTableNames     : [],
      excludedMasterCodeKeys: Array.isArray(parsed.excludedMasterCodeKeys) ? parsed.excludedMasterCodeKeys : [],
      excludedCategoryKeys:   Array.isArray(parsed.excludedCategoryKeys)   ? parsed.excludedCategoryKeys   : [],
    };

    // Saved selection exists. If the defaults version moved forward,
    // merge the new defaults IN (never remove anything the user excluded).
    if (defaults && appliedVersion < EXCEL_EXPORT_DEFAULTS_VERSION) {
      const merged: ExcelExportSelection = {
        excludedTableNames:     mergeUnique(current.excludedTableNames,     defaults.excludedTableNames),
        excludedMasterCodeKeys: mergeUnique(current.excludedMasterCodeKeys, defaults.excludedMasterCodeKeys),
        excludedCategoryKeys:   mergeUnique(current.excludedCategoryKeys,   defaults.excludedCategoryKeys),
      };
      localStorage.setItem(EXCEL_EXPORT_SELECTION_KEY_PREFIX + scriptKey, JSON.stringify(merged));
      localStorage.setItem(versionKey, String(EXCEL_EXPORT_DEFAULTS_VERSION));
      return merged;
    }

    return current;
  } catch {
    return DEFAULT_EXCLUSIONS[scriptKey] || null;
  }
}

export function saveExcelExportSelection(scriptKey: string, sel: ExcelExportSelection): void {
  try {
    localStorage.setItem(EXCEL_EXPORT_SELECTION_KEY_PREFIX + scriptKey, JSON.stringify(sel));
  } catch (e) {
    console.error('Failed to save Excel export selection:', e);
  }
}

/**
 * Get storage size in human-readable format
 */
export function formatStorageSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
