import { Script, MappingProject } from '../types';
import { loadScripts, loadMappingProjects } from '../utils/storage';
import { LocalBackupManager } from './localBackup';
import { GoogleDriveSync, BackupData, GoogleDriveConfig } from './googleDriveSync';

/**
 * Unified Backup Manager
 * Coordinates local file system backups and Google Drive sync
 */

export interface BackupSettings {
  local: {
    enabled: boolean;
    intervalMinutes: number;
    keepCount: number;
  };
  googleDrive: {
    enabled: boolean;
    intervalMinutes: number;
    keepCount: number;
    config: GoogleDriveConfig | null;
  };
}

export class BackupManager {
  private localBackup: LocalBackupManager;
  private googleDrive: GoogleDriveSync;
  private settings: BackupSettings;

  constructor() {
    this.localBackup = new LocalBackupManager();
    this.googleDrive = new GoogleDriveSync();
    this.settings = this.loadSettings();
  }

  /**
   * Initialize backup manager with settings
   */
  async initialize(): Promise<void> {
    // Initialize Google Drive if configured
    if (this.settings.googleDrive.config) {
      this.googleDrive.initialize(this.settings.googleDrive.config);
    }

    // Start auto-backups if enabled
    if (this.settings.local.enabled) {
      await this.startLocalAutoBackup();
    }

    if (this.settings.googleDrive.enabled && this.googleDrive.isAuthenticated()) {
      await this.startGoogleDriveAutoSync();
    }
  }

  /**
   * Get current data for backup
   */
  private async getCurrentData(): Promise<BackupData> {
    const scripts = loadScripts();
    const mappingProjects = loadMappingProjects();

    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      scripts,
      mappingProjects,
    };
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): BackupSettings {
    try {
      const saved = localStorage.getItem('dm_tool_backup_settings');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load backup settings:', e);
    }

    // Default settings
    return {
      local: {
        enabled: true,
        intervalMinutes: 15,
        keepCount: 10,
      },
      googleDrive: {
        enabled: false,
        intervalMinutes: 30,
        keepCount: 10,
        config: null,
      },
    };
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('dm_tool_backup_settings', JSON.stringify(this.settings));
    } catch (e) {
      console.error('Failed to save backup settings:', e);
    }
  }

  /**
   * Get current settings
   */
  getSettings(): BackupSettings {
    return { ...this.settings };
  }

  /**
   * Update settings
   */
  updateSettings(settings: Partial<BackupSettings>): void {
    this.settings = {
      ...this.settings,
      ...settings,
      local: { ...this.settings.local, ...(settings.local || {}) },
      googleDrive: { ...this.settings.googleDrive, ...(settings.googleDrive || {}) },
    };
    this.saveSettings();

    // Restart auto-backups with new settings
    this.restartAutoBackups();
  }

  /**
   * Restart auto-backups based on current settings
   */
  private async restartAutoBackups(): Promise<void> {
    // Stop existing backups
    this.localBackup.stopAutoBackup();
    this.googleDrive.stopAutoSync();

    // Restart if enabled
    if (this.settings.local.enabled) {
      await this.startLocalAutoBackup();
    }

    if (this.settings.googleDrive.enabled && this.googleDrive.isAuthenticated()) {
      await this.startGoogleDriveAutoSync();
    }
  }

  // ============================================
  // Local Backup Methods
  // ============================================

  /**
   * Start local auto-backup
   */
  private async startLocalAutoBackup(): Promise<void> {
    await this.localBackup.startAutoBackup(
      this.settings.local.intervalMinutes,
      async () => await this.getCurrentData(),
      this.settings.local.keepCount
    );
  }

  /**
   * Create local backup now
   */
  async createLocalBackup(): Promise<boolean> {
    const data = await this.getCurrentData();
    return await this.localBackup.createBackup(data, this.settings.local.keepCount);
  }

  /**
   * List local backups
   */
  async listLocalBackups() {
    return await this.localBackup.listBackups();
  }

  /**
   * Load local backup
   */
  async loadLocalBackup(filepath: string): Promise<BackupData | null> {
    return await this.localBackup.loadBackup(filepath);
  }

  /**
   * Get latest local backup
   */
  async getLatestLocalBackup(): Promise<BackupData | null> {
    return await this.localBackup.getLatestBackup();
  }

  /**
   * Export to user-selected file
   */
  async exportToFile(): Promise<boolean> {
    const data = await this.getCurrentData();
    return await this.localBackup.exportToFile(data);
  }

  /**
   * Import from user-selected file
   */
  async importFromFile(): Promise<BackupData | null> {
    return await this.localBackup.importFromFile();
  }

  /**
   * Open backup directory
   */
  async openBackupDirectory(): Promise<void> {
    await this.localBackup.openBackupDirectory();
  }

  // ============================================
  // Google Drive Methods
  // ============================================

  /**
   * Configure Google Drive
   */
  configureGoogleDrive(config: GoogleDriveConfig): void {
    this.settings.googleDrive.config = config;
    this.saveSettings();
    this.googleDrive.initialize(config);
  }

  /**
   * Authenticate with Google Drive
   */
  async authenticateGoogleDrive(): Promise<boolean> {
    return await this.googleDrive.authenticate();
  }

  /**
   * Check if Google Drive is authenticated
   */
  isGoogleDriveAuthenticated(): boolean {
    return this.googleDrive.isAuthenticated();
  }

  /**
   * Logout from Google Drive
   */
  logoutGoogleDrive(): void {
    this.googleDrive.logout();
    this.settings.googleDrive.enabled = false;
    this.saveSettings();
  }

  /**
   * Start Google Drive auto-sync
   */
  private async startGoogleDriveAutoSync(): Promise<void> {
    await this.googleDrive.startAutoSync(
      this.settings.googleDrive.intervalMinutes,
      async () => await this.getCurrentData()
    );
  }

  /**
   * Sync to Google Drive now
   */
  async syncToGoogleDrive(): Promise<boolean> {
    const data = await this.getCurrentData();
    return await this.googleDrive.syncNow(async () => data);
  }

  /**
   * List Google Drive backups
   */
  async listGoogleDriveBackups() {
    return await this.googleDrive.listBackups();
  }

  /**
   * Download backup from Google Drive
   */
  async downloadFromGoogleDrive(fileId: string): Promise<BackupData | null> {
    return await this.googleDrive.downloadBackup(fileId);
  }

  /**
   * Delete backup from Google Drive
   */
  async deleteGoogleDriveBackup(fileId: string): Promise<boolean> {
    return await this.googleDrive.deleteBackup(fileId);
  }

  /**
   * Get latest Google Drive backup
   */
  async getLatestGoogleDriveBackup(): Promise<BackupData | null> {
    return await this.googleDrive.getLatestBackup();
  }

  // ============================================
  // Restore Methods
  // ============================================

  /**
   * Restore data from backup
   */
  async restoreFromBackup(data: BackupData): Promise<boolean> {
    try {
      // Save to localStorage
      localStorage.setItem('dm_tool_data', JSON.stringify(data.scripts));
      localStorage.setItem('dm_tool_mapping_projects', JSON.stringify(data.mappingProjects));

      console.log('✅ Data restored successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to restore data:', error);
      return false;
    }
  }

  /**
   * Restore from latest local backup
   */
  async restoreFromLatestLocal(): Promise<boolean> {
    const data = await this.getLatestLocalBackup();
    if (!data) {
      console.error('No local backup found');
      return false;
    }

    return await this.restoreFromBackup(data);
  }

  /**
   * Restore from latest Google Drive backup
   */
  async restoreFromLatestGoogleDrive(): Promise<boolean> {
    const data = await this.getLatestGoogleDriveBackup();
    if (!data) {
      console.error('No Google Drive backup found');
      return false;
    }

    return await this.restoreFromBackup(data);
  }

  // ============================================
  // Backup Status
  // ============================================

  /**
   * Get backup status
   */
  async getBackupStatus() {
    const localBackups = await this.listLocalBackups();
    const googleDriveBackups = this.isGoogleDriveAuthenticated()
      ? await this.listGoogleDriveBackups()
      : [];

    return {
      local: {
        enabled: this.settings.local.enabled,
        backupCount: localBackups.length,
        latestBackup: localBackups[0] || null,
      },
      googleDrive: {
        enabled: this.settings.googleDrive.enabled,
        authenticated: this.isGoogleDriveAuthenticated(),
        backupCount: googleDriveBackups.length,
        latestBackup: googleDriveBackups[0] || null,
      },
    };
  }
}

// Export singleton instance
export const backupManager = new BackupManager();
