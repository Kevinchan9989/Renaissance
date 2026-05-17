import { WorkspaceData } from '../utils/storage';
import type { Script, FlowchartScript, MappingProject, TypeRuleSet } from '../types';

export interface ShardSavePayload {
  changedScripts: Script[];
  removedScriptIds: string[];
  changedFlowcharts: FlowchartScript[];
  removedFlowchartIds: string[];
  meta: {
    theme: 'light' | 'dark';
    themeVariant: 'slate' | 'vscode-gray';
    mappingProjects: MappingProject[];
    typeRuleSets: TypeRuleSet[];
    erdPositions: Record<string, Record<string, { x: number; y: number }>>;
    ddVisibleColumns?: unknown;
    ddColumnWidths?: unknown;
  };
  manifest: {
    version: string;
    scriptIds: string[];
    flowchartIds: string[];
    updatedAt: string;
  };
}

/**
 * Electron Storage Service
 * Handles local file system operations when running in Electron
 */

export interface ElectronAPI {
  platform: string;
  isElectron: boolean;

  // Git Sync APIs (new)
  saveWorkspaceToPath: (filePath: string, data: WorkspaceData) => Promise<{ success: boolean; path?: string; error?: string }>;
  loadWorkspaceFromPath: (filePath: string) => Promise<{ success: boolean; data?: WorkspaceData; error?: string }>;
  selectFolder: () => Promise<{ success: boolean; path?: string; canceled?: boolean; error?: string }>;
  selectFile: () => Promise<{ success: boolean; path?: string; canceled?: boolean; error?: string }>;
  pathExists: (filePath: string) => Promise<{ success: boolean; exists?: boolean; error?: string }>;
  getDefaultBackupsPath: () => Promise<{ success: boolean; path?: string; error?: string }>;
  pruneBackups: (options?: { keepRecent?: number; dryRun?: boolean }) => Promise<{
    success: boolean;
    kept?: string[];
    deleted?: string[];
    freedBytes?: number;
    error?: string;
  }>;

  // Sharded workspace storage
  saveWorkspaceShards: (payload: ShardSavePayload) => Promise<{
    success: boolean;
    counts?: {
      scriptsWritten: number;
      scriptsRemoved: number;
      flowchartsWritten: number;
      flowchartsRemoved: number;
    };
    error?: string;
  }>;
  loadWorkspaceShards: () => Promise<{
    success: boolean;
    data?: WorkspaceData;
    manifestUpdatedAt?: string | null;
    error?: string;
  }>;
  getStorageMtimes: () => Promise<{
    success: boolean;
    workspaceMs: number | null;
    shardsMs: number | null;
  }>;

  // Legacy APIs
  saveWorkspace: (data: WorkspaceData) => Promise<{ success: boolean; path?: string; error?: string }>;
  loadWorkspace: () => Promise<{ success: boolean; data?: WorkspaceData; error?: string }>;
  exportWorkspace: (data: WorkspaceData, filename?: string) => Promise<{ success: boolean; path?: string; canceled?: boolean; error?: string }>;
  importWorkspace: () => Promise<{ success: boolean; data?: WorkspaceData; canceled?: boolean; error?: string }>;
  enableAutoSave: (intervalMinutes: number) => Promise<{ success: boolean; error?: string }>;
  disableAutoSave: () => Promise<{ success: boolean; error?: string }>;
  listBackups: () => Promise<{ success: boolean; backups?: any[]; error?: string }>;
  restoreBackup: (filename: string) => Promise<{ success: boolean; data?: WorkspaceData; error?: string }>;
  deleteBackup: (filename: string) => Promise<{ success: boolean; error?: string }>;
  openDataDirectory: () => Promise<{ success: boolean; error?: string }>;
  getDataDirectory: () => Promise<{ success: boolean; path?: string }>;
  onAutoSaveComplete: (callback: (data: any) => void) => () => void;
  onAutoSaveError: (callback: (error: any) => void) => () => void;

  // SQLite layer (dark-launched — gated by isSqliteStorageEnabled() in storage.ts;
  // default OFF in this PR. PR2 flips the default to ON post-soak.)
  db: {
    bootstrap: () => Promise<DbResult<{ status: DbStatus }>>;
    status: () => Promise<DbResult<{ status: DbStatus }>>;
    loadWorkspace: () => Promise<DbResult<{ data: WorkspaceData }>>;
    saveDiff: (payload: ShardSavePayload) => Promise<DbResult>;
    getVersionContent: (versionId: string) => Promise<DbResult<{ content: { content: string; data: unknown } | null }>>;
    migrateFromShards: () => Promise<DbResult<{ counts: Record<string, number>; durationMs: number }>>;
    integrityCheck: () => Promise<DbResult<{ ok: boolean; details: unknown[] }>>;
    vacuum: (opts?: { ifNeeded?: boolean }) => Promise<DbResult<{ ran: boolean }>>;
  };
}

export type DbResult<T = Record<string, unknown>> =
  | ({ success: true } & T)
  | { success: false; error: string };

export interface DbStatus {
  dbOpen: boolean;
  dbPath?: string;
  schemaVersion?: number;
  scriptCount?: number;
  columnCount?: number;
  dbSize?: number;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

/**
 * Check if the app is running in Electron
 */
export function isElectron(): boolean {
  return window.electronAPI?.isElectron === true;
}

/**
 * Get the Electron API (throws if not in Electron)
 */
function getElectronAPI(): ElectronAPI {
  if (!window.electronAPI) {
    throw new Error('Electron API not available. Are you running in Electron?');
  }
  return window.electronAPI;
}

/**
 * Save workspace to local file system
 */
export async function saveWorkspaceToFile(data: WorkspaceData): Promise<boolean> {
  if (!isElectron()) {
    console.warn('Not running in Electron, cannot save to file system');
    return false;
  }

  try {
    const api = getElectronAPI();
    const result = await api.saveWorkspace(data);

    if (result.success) {
      console.log('✅ Workspace saved to:', result.path);
      return true;
    } else {
      console.error('❌ Failed to save workspace:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error saving workspace:', error);
    return false;
  }
}

/**
 * Load workspace from local file system
 */
export async function loadWorkspaceFromFile(): Promise<WorkspaceData | null> {
  if (!isElectron()) {
    console.warn('Not running in Electron, cannot load from file system');
    return null;
  }

  try {
    const api = getElectronAPI();
    const result = await api.loadWorkspace();

    if (result.success && result.data) {
      console.log('✅ Workspace loaded from file');
      return result.data;
    } else {
      console.log('ℹ️ No workspace file found or failed to load:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error loading workspace:', error);
    return null;
  }
}

/**
 * Export workspace with file picker
 */
export async function exportWorkspaceWithPicker(data: WorkspaceData, filename?: string): Promise<boolean> {
  if (!isElectron()) {
    console.warn('Not running in Electron, cannot use file picker');
    return false;
  }

  try {
    const api = getElectronAPI();
    const result = await api.exportWorkspace(data, filename);

    if (result.canceled) {
      console.log('ℹ️ Export canceled by user');
      return false;
    }

    if (result.success) {
      console.log('✅ Workspace exported to:', result.path);
      return true;
    } else {
      console.error('❌ Failed to export workspace:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error exporting workspace:', error);
    return false;
  }
}

/**
 * Import workspace with file picker
 */
export async function importWorkspaceWithPicker(): Promise<WorkspaceData | null> {
  if (!isElectron()) {
    console.warn('Not running in Electron, cannot use file picker');
    return null;
  }

  try {
    const api = getElectronAPI();
    const result = await api.importWorkspace();

    if (result.canceled) {
      console.log('ℹ️ Import canceled by user');
      return null;
    }

    if (result.success && result.data) {
      console.log('✅ Workspace imported from file');
      return result.data;
    } else {
      console.error('❌ Failed to import workspace:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error importing workspace:', error);
    return null;
  }
}

/**
 * Enable auto-save (Electron will save periodically)
 */
export async function enableAutoSave(intervalMinutes: number = 5): Promise<boolean> {
  if (!isElectron()) {
    console.warn('Not running in Electron, cannot enable auto-save');
    return false;
  }

  try {
    const api = getElectronAPI();
    const result = await api.enableAutoSave(intervalMinutes);

    if (result.success) {
      console.log(`✅ Auto-save enabled (every ${intervalMinutes} minutes)`);
      return true;
    } else {
      console.error('❌ Failed to enable auto-save:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error enabling auto-save:', error);
    return false;
  }
}

/**
 * Disable auto-save
 */
export async function disableAutoSave(): Promise<boolean> {
  if (!isElectron()) {
    return false;
  }

  try {
    const api = getElectronAPI();
    const result = await api.disableAutoSave();

    if (result.success) {
      console.log('✅ Auto-save disabled');
      return true;
    } else {
      console.error('❌ Failed to disable auto-save:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error disabling auto-save:', error);
    return false;
  }
}

/**
 * List all backups
 */
export async function listBackups(): Promise<any[]> {
  if (!isElectron()) {
    return [];
  }

  try {
    const api = getElectronAPI();
    const result = await api.listBackups();

    if (result.success && result.backups) {
      return result.backups;
    } else {
      console.error('❌ Failed to list backups:', result.error);
      return [];
    }
  } catch (error) {
    console.error('❌ Error listing backups:', error);
    return [];
  }
}

/**
 * Restore backup by filename
 */
export async function restoreBackup(filename: string): Promise<WorkspaceData | null> {
  if (!isElectron()) {
    return null;
  }

  try {
    const api = getElectronAPI();
    const result = await api.restoreBackup(filename);

    if (result.success && result.data) {
      console.log('✅ Backup restored:', filename);
      return result.data;
    } else {
      console.error('❌ Failed to restore backup:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error restoring backup:', error);
    return null;
  }
}

/**
 * Delete backup by filename
 */
export async function deleteBackup(filename: string): Promise<boolean> {
  if (!isElectron()) {
    return false;
  }

  try {
    const api = getElectronAPI();
    const result = await api.deleteBackup(filename);

    if (result.success) {
      console.log('✅ Backup deleted:', filename);
      return true;
    } else {
      console.error('❌ Failed to delete backup:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error deleting backup:', error);
    return false;
  }
}

/**
 * Open the data directory in file explorer
 */
export async function openDataDirectory(): Promise<boolean> {
  if (!isElectron()) {
    return false;
  }

  try {
    const api = getElectronAPI();
    const result = await api.openDataDirectory();

    if (result.success) {
      console.log('✅ Data directory opened');
      return true;
    } else {
      console.error('❌ Failed to open data directory:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error opening data directory:', error);
    return false;
  }
}

/**
 * Get the data directory path
 */
export async function getDataDirectory(): Promise<string | null> {
  if (!isElectron()) {
    return null;
  }

  try {
    const api = getElectronAPI();
    const result = await api.getDataDirectory();

    if (result.success && result.path) {
      return result.path;
    } else {
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting data directory:', error);
    return null;
  }
}

/**
 * Prune root /backups directory.
 * Keeps `keepRecent` newest snapshots plus one per calendar month for older files.
 * Returns the deleted file list and bytes freed.
 */
export async function pruneBackups(
  options: { keepRecent?: number; dryRun?: boolean } = {}
): Promise<{ kept: string[]; deleted: string[]; freedBytes: number } | null> {
  if (!isElectron()) return null;
  try {
    const api = getElectronAPI();
    const result = await api.pruneBackups(options);
    if (result.success) {
      return {
        kept: result.kept || [],
        deleted: result.deleted || [],
        freedBytes: result.freedBytes || 0,
      };
    }
    console.error('❌ Backup prune failed:', result.error);
    return null;
  } catch (error) {
    console.error('❌ Error pruning backups:', error);
    return null;
  }
}

/**
 * Save only changed shards to the sharded workspace store.
 */
export async function saveWorkspaceShards(payload: ShardSavePayload): Promise<boolean> {
  if (!isElectron()) return false;
  try {
    const api = getElectronAPI();
    const result = await api.saveWorkspaceShards(payload);
    if (!result.success) {
      console.error('❌ Shard save failed:', result.error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('❌ Error saving shards:', error);
    return false;
  }
}

/**
 * Load workspace from shards. Returns null if no shards manifest exists.
 */
export async function loadWorkspaceShards(): Promise<WorkspaceData | null> {
  if (!isElectron()) return null;
  try {
    const api = getElectronAPI();
    const result = await api.loadWorkspaceShards();
    if (result.success && result.data) return result.data;
    return null;
  } catch (error) {
    console.error('❌ Error loading shards:', error);
    return null;
  }
}

/**
 * Compare modification times of monolithic workspace.json vs shards manifest.
 * Used at startup to pick the newer source.
 */
export async function getStorageMtimes(): Promise<{ workspaceMs: number | null; shardsMs: number | null }> {
  if (!isElectron()) return { workspaceMs: null, shardsMs: null };
  try {
    const api = getElectronAPI();
    const r = await api.getStorageMtimes();
    return { workspaceMs: r.workspaceMs, shardsMs: r.shardsMs };
  } catch {
    return { workspaceMs: null, shardsMs: null };
  }
}

/**
 * Setup auto-save listener
 */
export function setupAutoSaveListener(onSave: () => WorkspaceData): () => void {
  if (!isElectron()) {
    return () => {};
  }

  const api = getElectronAPI();

  const unsubscribeComplete = api.onAutoSaveComplete((data) => {
    console.log('✅ Auto-save complete:', data);
  });

  const unsubscribeError = api.onAutoSaveError((error) => {
    console.error('❌ Auto-save error:', error);
  });

  // Return cleanup function
  return () => {
    unsubscribeComplete();
    unsubscribeError();
  };
}
