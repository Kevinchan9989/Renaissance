/**
 * TypeScript declarations for Electron APIs exposed via preload script
 */

import { WorkspaceData } from '../utils/storage';

export interface ElectronAPI {
  platform: string;
  isElectron: boolean;

  // File operations
  saveWorkspace: (data: WorkspaceData) => Promise<{
    success: boolean;
    path?: string;
    error?: string;
  }>;

  loadWorkspace: () => Promise<{
    success: boolean;
    data?: WorkspaceData;
    error?: string;
  }>;

  exportWorkspace: (data: WorkspaceData, filename?: string) => Promise<{
    success: boolean;
    path?: string;
    canceled?: boolean;
    error?: string;
  }>;

  importWorkspace: () => Promise<{
    success: boolean;
    data?: WorkspaceData;
    canceled?: boolean;
    error?: string;
  }>;

  // Auto-save operations
  enableAutoSave: (intervalMinutes: number) => Promise<{
    success: boolean;
    error?: string;
  }>;

  disableAutoSave: () => Promise<{
    success: boolean;
    error?: string;
  }>;

  // Backup operations
  listBackups: () => Promise<{
    success: boolean;
    backups?: Array<{
      filename: string;
      path: string;
      size: number;
      createdAt: string;
      modifiedAt: string;
    }>;
    error?: string;
  }>;

  restoreBackup: (filename: string) => Promise<{
    success: boolean;
    data?: WorkspaceData;
    error?: string;
  }>;

  deleteBackup: (filename: string) => Promise<{
    success: boolean;
    error?: string;
  }>;

  // Utility operations
  openDataDirectory: () => Promise<{
    success: boolean;
    error?: string;
  }>;

  getDataDirectory: () => Promise<{
    success: boolean;
    path?: string;
  }>;

  // Event listeners
  onAutoSaveComplete: (callback: (data: any) => void) => () => void;
  onAutoSaveError: (callback: (error: any) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};
