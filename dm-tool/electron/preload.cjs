const { contextBridge, ipcRenderer } = require('electron');

/**
 * Electron Preload Script
 * Exposes safe file system APIs to the renderer process
 */

contextBridge.exposeInMainWorld('electronAPI', {
  // Platform info
  platform: process.platform,
  isElectron: true,

  // Git Sync - Save workspace to custom path
  saveWorkspaceToPath: (filePath, data) => ipcRenderer.invoke('save-workspace-to-path', filePath, data),

  // Git Sync - Load workspace from custom path
  loadWorkspaceFromPath: (filePath) => ipcRenderer.invoke('load-workspace-from-path', filePath),

  // Git Sync - Select folder dialog
  selectFolder: () => ipcRenderer.invoke('select-folder'),

  // Git Sync - Select file dialog
  selectFile: () => ipcRenderer.invoke('select-file'),

  // Git Sync - Check if path exists
  pathExists: (filePath) => ipcRenderer.invoke('path-exists', filePath),

  // Git Sync - Get default backups path
  getDefaultBackupsPath: () => ipcRenderer.invoke('get-default-backups-path'),

  // Legacy workspace functions (for compatibility)
  saveWorkspace: (data) => ipcRenderer.invoke('save-workspace', data),
  loadWorkspace: () => ipcRenderer.invoke('load-workspace'),
  exportWorkspace: (data, filename) => ipcRenderer.invoke('export-workspace', data, filename),
  importWorkspace: () => ipcRenderer.invoke('import-workspace'),

  // Backup functions
  enableAutoSave: (intervalMinutes) => ipcRenderer.invoke('enable-auto-save', intervalMinutes),
  disableAutoSave: () => ipcRenderer.invoke('disable-auto-save'),
  listBackups: () => ipcRenderer.invoke('list-backups'),
  restoreBackup: (filename) => ipcRenderer.invoke('restore-backup', filename),
  deleteBackup: (filename) => ipcRenderer.invoke('delete-backup', filename),
  openDataDirectory: () => ipcRenderer.invoke('open-data-directory'),
  getDataDirectory: () => ipcRenderer.invoke('get-data-directory'),

  // Event listeners
  onAutoSaveComplete: (callback) => {
    const subscription = (_event, data) => callback(data);
    ipcRenderer.on('auto-save-complete', subscription);
    return () => ipcRenderer.removeListener('auto-save-complete', subscription);
  },
  onAutoSaveError: (callback) => {
    const subscription = (_event, error) => callback(error);
    ipcRenderer.on('auto-save-error', subscription);
    return () => ipcRenderer.removeListener('auto-save-error', subscription);
  },
});

console.log('Preload script loaded - electronAPI exposed');
