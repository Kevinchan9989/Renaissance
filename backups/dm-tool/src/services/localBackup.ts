import { Script, MappingProject } from '../types';

/**
 * Local File System Backup Manager for Electron
 * Handles automatic backups to local file system
 */

export interface BackupData {
  version: string;
  exportDate: string;
  scripts: Script[];
  mappingProjects: MappingProject[];
}

export interface BackupFile {
  filename: string;
  path: string;
  size: number;
  createdAt: Date;
}

export class LocalBackupManager {
  private backupDir: string = '';
  private intervalId: NodeJS.Timer | null = null;
  private isElectron: boolean = false;
  private fs: any = null;
  private path: any = null;
  private app: any = null;

  constructor() {
    // Check if running in Electron
    this.isElectron = !!(window as any).require;

    if (this.isElectron) {
      this.initializeElectron();
    }
  }

  private initializeElectron() {
    try {
      const electron = (window as any).require('electron');
      this.fs = (window as any).require('fs');
      this.path = (window as any).require('path');

      // Get app from remote or direct
      this.app = electron.remote?.app || electron.app;

      if (this.app) {
        this.backupDir = this.path.join(this.app.getPath('userData'), 'backups');
        this.ensureBackupDirectory();
      }
    } catch (error) {
      console.error('Failed to initialize Electron APIs:', error);
      this.isElectron = false;
    }
  }

  private ensureBackupDirectory() {
    if (!this.fs || !this.backupDir) return;

    if (!this.fs.existsSync(this.backupDir)) {
      this.fs.mkdirSync(this.backupDir, { recursive: true });
      console.log(`Backup directory created: ${this.backupDir}`);
    }
  }

  /**
   * Check if local backup is available
   */
  isAvailable(): boolean {
    return this.isElectron && !!this.fs && !!this.backupDir;
  }

  /**
   * Start automatic backup on interval
   */
  async startAutoBackup(intervalMinutes: number = 5, onBackup?: (success: boolean) => void) {
    if (!this.isAvailable()) {
      console.warn('Local backup not available (not running in Electron)');
      return false;
    }

    // Create initial backup
    await this.createBackup(onBackup);

    // Schedule periodic backups
    this.intervalId = setInterval(async () => {
      await this.createBackup(onBackup);
    }, intervalMinutes * 60 * 1000);

    console.log(`Local auto-backup started (every ${intervalMinutes} minutes)`);
    return true;
  }

  /**
   * Stop automatic backup
   */
  stopAutoBackup() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Local auto-backup stopped');
    }
  }

  /**
   * Create a backup now
   */
  async createBackup(onComplete?: (success: boolean) => void): Promise<string | null> {
    if (!this.isAvailable()) {
      onComplete?.(false);
      return null;
    }

    try {
      // Get data from IndexedDB (this will be passed from caller)
      const data = await this.getCurrentData();

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const filename = `renaissance-backup-${timestamp}.json`;
      const filepath = this.path.join(this.backupDir, filename);

      // Write to file
      this.fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');

      console.log(`✅ Backup created: ${filename}`);

      // Clean old backups
      await this.cleanOldBackups(20);

      onComplete?.(true);
      return filepath;
    } catch (error) {
      console.error('❌ Failed to create backup:', error);
      onComplete?.(false);
      return null;
    }
  }

  /**
   * Get current data from IndexedDB (placeholder - will be injected)
   */
  private async getCurrentData(): Promise<BackupData> {
    // This will be implemented by injecting the db instance
    // For now, return empty structure
    return {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      scripts: [],
      mappingProjects: []
    };
  }

  /**
   * List all backup files
   */
  async listBackups(): Promise<BackupFile[]> {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      const files = this.fs.readdirSync(this.backupDir)
        .filter((f: string) => f.startsWith('renaissance-backup-') && f.endsWith('.json'))
        .map((filename: string) => {
          const filepath = this.path.join(this.backupDir, filename);
          const stats = this.fs.statSync(filepath);
          return {
            filename,
            path: filepath,
            size: stats.size,
            createdAt: stats.mtime
          };
        })
        .sort((a: BackupFile, b: BackupFile) => b.createdAt.getTime() - a.createdAt.getTime());

      return files;
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  }

  /**
   * Load backup from file
   */
  async loadBackup(filepath: string): Promise<BackupData | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const content = this.fs.readFileSync(filepath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to load backup:', error);
      return null;
    }
  }

  /**
   * Get the latest backup
   */
  async getLatestBackup(): Promise<BackupData | null> {
    const backups = await this.listBackups();
    if (backups.length === 0) {
      return null;
    }

    return await this.loadBackup(backups[0].path);
  }

  /**
   * Clean old backups, keeping only the most recent N
   */
  private async cleanOldBackups(keepCount: number) {
    if (!this.isAvailable()) {
      return;
    }

    try {
      const backups = await this.listBackups();

      // Delete backups beyond keepCount
      const toDelete = backups.slice(keepCount);

      for (const backup of toDelete) {
        this.fs.unlinkSync(backup.path);
        console.log(`Deleted old backup: ${backup.filename}`);
      }
    } catch (error) {
      console.error('Failed to clean old backups:', error);
    }
  }

  /**
   * Export backup to user-selected location
   */
  async exportToFile(data: BackupData): Promise<boolean> {
    if (!this.isAvailable()) {
      console.warn('Export not available in browser mode');
      return false;
    }

    try {
      const electron = (window as any).require('electron');
      const { dialog } = electron.remote || electron;

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const defaultFilename = `renaissance-export-${timestamp}.json`;

      const result = await dialog.showSaveDialog({
        title: 'Export Database',
        defaultPath: defaultFilename,
        filters: [
          { name: 'JSON Files', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (result.canceled || !result.filePath) {
        return false;
      }

      this.fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✅ Database exported to: ${result.filePath}`);
      return true;
    } catch (error) {
      console.error('Failed to export database:', error);
      return false;
    }
  }

  /**
   * Import backup from user-selected file
   */
  async importFromFile(): Promise<BackupData | null> {
    if (!this.isAvailable()) {
      console.warn('Import not available in browser mode');
      return null;
    }

    try {
      const electron = (window as any).require('electron');
      const { dialog } = electron.remote || electron;

      const result = await dialog.showOpenDialog({
        title: 'Import Database',
        filters: [
          { name: 'JSON Files', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
      });

      if (result.canceled || result.filePaths.length === 0) {
        return null;
      }

      const content = this.fs.readFileSync(result.filePaths[0], 'utf8');
      const data = JSON.parse(content);

      console.log(`✅ Database imported from: ${result.filePaths[0]}`);
      return data;
    } catch (error) {
      console.error('Failed to import database:', error);
      return null;
    }
  }

  /**
   * Get backup directory path
   */
  getBackupDirectory(): string {
    return this.backupDir;
  }

  /**
   * Open backup directory in file explorer
   */
  openBackupDirectory() {
    if (!this.isAvailable()) {
      return;
    }

    try {
      const electron = (window as any).require('electron');
      const { shell } = electron;
      shell.openPath(this.backupDir);
    } catch (error) {
      console.error('Failed to open backup directory:', error);
    }
  }
}

// Export singleton instance
export const localBackup = new LocalBackupManager();
