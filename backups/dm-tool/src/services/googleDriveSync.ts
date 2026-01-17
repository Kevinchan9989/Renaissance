import { Script, MappingProject } from '../types';

/**
 * Google Drive Sync Manager
 * Handles authentication and syncing to Google Drive
 */

export interface BackupData {
  version: string;
  exportDate: string;
  scripts: Script[];
  mappingProjects: MappingProject[];
}

export interface DriveFile {
  id: string;
  name: string;
  createdTime: string;
  size: string;
}

export interface GoogleDriveConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export class GoogleDriveSync {
  private accessToken: string = '';
  private folderName = 'Renaissance DM Backups';
  private folderId: string | null = null;
  private intervalId: NodeJS.Timer | null = null;
  private config: GoogleDriveConfig | null = null;

  /**
   * Initialize with configuration
   */
  initialize(config: GoogleDriveConfig) {
    this.config = config;

    // Load saved access token
    const saved = localStorage.getItem('gdrive_access_token');
    if (saved) {
      this.accessToken = saved;
    }
  }

  /**
   * Check if authenticated
   */
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Authenticate with Google Drive
   */
  async authenticate(): Promise<boolean> {
    if (!this.config) {
      console.error('Google Drive not configured');
      return false;
    }

    try {
      const { clientId, redirectUri } = this.config;

      // Create auth URL
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', clientId);
      authUrl.searchParams.set('redirect_uri', redirectUri);
      authUrl.searchParams.set('response_type', 'token');
      authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/drive.file');

      console.log('🔐 Opening Google Drive authentication...');
      console.log('Redirect URI:', redirectUri);

      // Open auth window
      const authWindow = window.open(
        authUrl.toString(),
        'Google Drive Auth',
        'width=600,height=700,left=100,top=100'
      );

      if (!authWindow) {
        console.error('Failed to open auth window. Please allow popups for this site.');
        return false;
      }

      // Wait for callback via postMessage
      return new Promise((resolve) => {
        const messageHandler = (event: MessageEvent) => {
          // Check origin for security
          if (event.origin !== window.location.origin) {
            return;
          }

          if (event.data.type === 'google_drive_auth_success') {
            const token = event.data.accessToken;
            if (token) {
              this.accessToken = token;
              localStorage.setItem('gdrive_access_token', token);
              console.log('✅ Google Drive authenticated successfully');
              window.removeEventListener('message', messageHandler);
              resolve(true);
            }
          }
        };

        window.addEventListener('message', messageHandler);

        // Also check if window was closed
        const checkClosed = setInterval(() => {
          if (authWindow?.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageHandler);

            // Check if token was saved
            const token = localStorage.getItem('gdrive_access_token');
            if (token && !this.accessToken) {
              this.accessToken = token;
              console.log('✅ Google Drive authenticated (from localStorage)');
              resolve(true);
            } else {
              console.log('❌ Authentication window closed without completing');
              resolve(this.isAuthenticated());
            }
          }
        }, 500);

        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageHandler);
          authWindow?.close();
          console.log('⏱️ Authentication timeout');
          resolve(false);
        }, 5 * 60 * 1000);
      });
    } catch (error) {
      console.error('Authentication failed:', error);
      return false;
    }
  }

  /**
   * Logout / disconnect
   */
  logout() {
    this.accessToken = '';
    this.folderId = null;
    localStorage.removeItem('gdrive_access_token');
    localStorage.removeItem('gdrive_folder_id');
    this.stopAutoSync();
    console.log('Logged out from Google Drive');
  }

  /**
   * Ensure backup folder exists
   */
  private async ensureBackupFolder(): Promise<string> {
    if (this.folderId) {
      return this.folderId;
    }

    // Check if saved
    const saved = localStorage.getItem('gdrive_folder_id');
    if (saved) {
      this.folderId = saved;
      return saved;
    }

    try {
      // Search for existing folder
      const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${encodeURIComponent(this.folderName)}' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id,name)`;

      const searchResponse = await fetch(searchUrl, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      const searchData = await searchResponse.json();

      if (searchData.files && searchData.files.length > 0) {
        this.folderId = searchData.files[0].id;
      } else {
        // Create new folder
        const createResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.folderName,
            mimeType: 'application/vnd.google-apps.folder',
          }),
        });

        const createData = await createResponse.json();
        this.folderId = createData.id;
      }

      // Save folder ID
      localStorage.setItem('gdrive_folder_id', this.folderId!);
      return this.folderId!;
    } catch (error) {
      console.error('Failed to ensure backup folder:', error);
      throw error;
    }
  }

  /**
   * Upload backup to Google Drive
   */
  async uploadBackup(data: BackupData): Promise<string | null> {
    if (!this.isAuthenticated()) {
      console.error('Not authenticated with Google Drive');
      return null;
    }

    try {
      const folderId = await this.ensureBackupFolder();

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const filename = `renaissance-backup-${timestamp}.json`;

      // Create metadata
      const metadata = {
        name: filename,
        parents: [folderId],
        mimeType: 'application/json',
      };

      // Create file content
      const content = JSON.stringify(data, null, 2);

      // Create multipart form data
      const boundary = '-------314159265358979323846';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        content +
        closeDelimiter;

      // Upload
      const uploadResponse = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,createdTime',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': `multipart/related; boundary=${boundary}`,
          },
          body: multipartRequestBody,
        }
      );

      const uploadData = await uploadResponse.json();

      if (uploadData.id) {
        console.log(`✅ Backup uploaded to Google Drive: ${filename}`);
        return uploadData.id;
      } else {
        throw new Error('Upload failed: ' + JSON.stringify(uploadData));
      }
    } catch (error) {
      console.error('❌ Failed to upload backup:', error);
      return null;
    }
  }

  /**
   * List all backups in Google Drive
   */
  async listBackups(): Promise<DriveFile[]> {
    if (!this.isAuthenticated()) {
      return [];
    }

    try {
      const folderId = await this.ensureBackupFolder();

      const listUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and name contains 'renaissance-backup-' and trashed=false&fields=files(id,name,createdTime,size)&orderBy=createdTime desc`;

      const response = await fetch(listUrl, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      const data = await response.json();
      return data.files || [];
    } catch (error) {
      console.error('Failed to list backups:', error);
      return [];
    }
  }

  /**
   * Download backup from Google Drive
   */
  async downloadBackup(fileId: string): Promise<BackupData | null> {
    if (!this.isAuthenticated()) {
      return null;
    }

    try {
      const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;

      const response = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to download backup:', error);
      return null;
    }
  }

  /**
   * Delete backup from Google Drive
   */
  async deleteBackup(fileId: string): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      const deleteUrl = `https://www.googleapis.com/drive/v3/files/${fileId}`;

      await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      });

      console.log(`Deleted backup: ${fileId}`);
      return true;
    } catch (error) {
      console.error('Failed to delete backup:', error);
      return false;
    }
  }

  /**
   * Clean old backups (keep last N)
   */
  async cleanOldBackups(keepCount: number = 10): Promise<void> {
    try {
      const backups = await this.listBackups();

      // Delete backups beyond keepCount
      const toDelete = backups.slice(keepCount);

      for (const backup of toDelete) {
        await this.deleteBackup(backup.id);
      }
    } catch (error) {
      console.error('Failed to clean old backups:', error);
    }
  }

  /**
   * Start automatic sync
   */
  async startAutoSync(intervalMinutes: number = 15, getData: () => Promise<BackupData>) {
    if (!this.isAuthenticated()) {
      console.error('Cannot start auto-sync: not authenticated');
      return false;
    }

    // Initial sync
    await this.syncNow(getData);

    // Periodic sync
    this.intervalId = setInterval(async () => {
      await this.syncNow(getData);
    }, intervalMinutes * 60 * 1000);

    console.log(`Google Drive auto-sync started (every ${intervalMinutes} minutes)`);
    return true;
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Google Drive auto-sync stopped');
    }
  }

  /**
   * Sync now
   */
  async syncNow(getData: () => Promise<BackupData>): Promise<boolean> {
    try {
      const data = await getData();
      const fileId = await this.uploadBackup(data);

      if (fileId) {
        await this.cleanOldBackups(10);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Sync failed:', error);
      return false;
    }
  }

  /**
   * Get latest backup
   */
  async getLatestBackup(): Promise<BackupData | null> {
    const backups = await this.listBackups();
    if (backups.length === 0) {
      return null;
    }

    return await this.downloadBackup(backups[0].id);
  }
}

// Export singleton instance
export const googleDriveSync = new GoogleDriveSync();
