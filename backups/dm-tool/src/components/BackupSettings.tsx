import React, { useState, useEffect } from 'react';
import { Save, Upload, Download, HardDrive, Cloud, RefreshCw, FolderOpen, LogOut, LogIn, AlertCircle } from 'lucide-react';
import { backupManager } from '../services/backupManager';
import { BackupSettings as BackupSettingsType } from '../services/backupManager';
import { DriveFile } from '../services/googleDriveSync';
import { GOOGLE_DRIVE_CONFIG, isGoogleDriveConfigured } from '../config/googleDrive.config';

interface BackupSettingsProps {
  isDarkTheme: boolean;
  darkThemeVariant?: 'slate' | 'vscode-gray';
}

interface BackupFile {
  filename: string;
  filepath: string;
  size: number;
  createdAt: Date;
}

export function BackupSettings({ isDarkTheme, darkThemeVariant }: BackupSettingsProps) {
  const [settings, setSettings] = useState<BackupSettingsType>(backupManager.getSettings());
  const [localBackups, setLocalBackups] = useState<BackupFile[]>([]);
  const [googleDriveBackups, setGoogleDriveBackups] = useState<DriveFile[]>([]);
  const [isGoogleDriveAuthenticated, setIsGoogleDriveAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check if Google Drive is configured
  const googleDriveConfigured = isGoogleDriveConfigured();

  useEffect(() => {
    loadBackupLists();
    setIsGoogleDriveAuthenticated(backupManager.isGoogleDriveAuthenticated());

    // Listen for storage changes (in case token was set in popup)
    const handleStorageChange = () => {
      const authenticated = backupManager.isGoogleDriveAuthenticated();
      console.log('Storage changed, authenticated:', authenticated);
      setIsGoogleDriveAuthenticated(authenticated);
      if (authenticated) {
        loadBackupLists();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check every second for the first 10 seconds (in case user is authenticating)
    const interval = setInterval(() => {
      const authenticated = backupManager.isGoogleDriveAuthenticated();
      if (authenticated !== isGoogleDriveAuthenticated) {
        console.log('Auth state changed:', authenticated);
        setIsGoogleDriveAuthenticated(authenticated);
        if (authenticated) {
          loadBackupLists();
          clearInterval(interval);
        }
      }
    }, 1000);

    setTimeout(() => clearInterval(interval), 10000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const loadBackupLists = async () => {
    try {
      const local = await backupManager.listLocalBackups();
      setLocalBackups(local);

      if (backupManager.isGoogleDriveAuthenticated()) {
        const drive = await backupManager.listGoogleDriveBackups();
        setGoogleDriveBackups(drive);
      }
    } catch (error) {
      console.error('Failed to load backup lists:', error);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSettingsChange = (updates: Partial<BackupSettingsType>) => {
    const newSettings = {
      ...settings,
      ...updates,
      local: { ...settings.local, ...(updates.local || {}) },
      googleDrive: { ...settings.googleDrive, ...(updates.googleDrive || {}) },
    };
    setSettings(newSettings);
  };

  const handleSaveSettings = () => {
    backupManager.updateSettings(settings);
    showMessage('success', 'Settings saved successfully');
  };

  const handleCreateLocalBackup = async () => {
    setLoading(true);
    const success = await backupManager.createLocalBackup();
    setLoading(false);

    if (success) {
      showMessage('success', 'Local backup created');
      await loadBackupLists();
    } else {
      showMessage('error', 'Failed to create backup');
    }
  };

  const handleExportToFile = async () => {
    setLoading(true);
    const success = await backupManager.exportToFile();
    setLoading(false);

    if (success) {
      showMessage('success', 'Data exported successfully');
    } else {
      showMessage('error', 'Failed to export data');
    }
  };

  const handleImportFromFile = async () => {
    setLoading(true);
    const data = await backupManager.importFromFile();
    setLoading(false);

    if (data) {
      const confirmed = window.confirm(
        'This will replace all current data. Are you sure you want to continue?'
      );

      if (confirmed) {
        const success = await backupManager.restoreFromBackup(data);
        if (success) {
          showMessage('success', 'Data imported successfully. Please refresh the page.');
        } else {
          showMessage('error', 'Failed to import data');
        }
      }
    }
  };

  const handleOpenBackupDirectory = async () => {
    await backupManager.openBackupDirectory();
  };

  const handleGoogleDriveAuth = async () => {
    if (!googleDriveConfigured) {
      showMessage(
        'error',
        'Google Drive is not configured. Please see GOOGLE_DRIVE_SETUP.md for instructions.'
      );
      return;
    }

    if (!backupManager.isGoogleDriveAuthenticated()) {
      console.log('Starting Google Drive authentication...');
      backupManager.configureGoogleDrive(GOOGLE_DRIVE_CONFIG);
      setLoading(true);

      try {
        const success = await backupManager.authenticateGoogleDrive();
        console.log('Authentication result:', success);
        setLoading(false);

        if (success) {
          console.log('Setting authenticated state to true');
          setIsGoogleDriveAuthenticated(true);
          showMessage('success', 'Google Drive authenticated');
          await loadBackupLists();
        } else {
          console.warn('Authentication failed');
          showMessage('error', 'Google Drive authentication failed');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setLoading(false);
        showMessage('error', 'Google Drive authentication error');
      }
    } else {
      console.log('Logging out from Google Drive');
      backupManager.logoutGoogleDrive();
      setIsGoogleDriveAuthenticated(false);
      setGoogleDriveBackups([]);
      showMessage('success', 'Logged out from Google Drive');
    }
  };

  const handleSyncToGoogleDrive = async () => {
    setLoading(true);
    const success = await backupManager.syncToGoogleDrive();
    setLoading(false);

    if (success) {
      showMessage('success', 'Synced to Google Drive');
      await loadBackupLists();
    } else {
      showMessage('error', 'Failed to sync to Google Drive');
    }
  };

  const handleRestoreLocal = async (filepath: string) => {
    const confirmed = window.confirm(
      'This will replace all current data with this backup. Are you sure?'
    );

    if (confirmed) {
      setLoading(true);
      const data = await backupManager.loadLocalBackup(filepath);
      if (data) {
        const success = await backupManager.restoreFromBackup(data);
        setLoading(false);

        if (success) {
          showMessage('success', 'Data restored successfully. Please refresh the page.');
        } else {
          showMessage('error', 'Failed to restore data');
        }
      } else {
        setLoading(false);
        showMessage('error', 'Failed to load backup');
      }
    }
  };

  const handleRestoreGoogleDrive = async (fileId: string) => {
    const confirmed = window.confirm(
      'This will replace all current data with this backup. Are you sure?'
    );

    if (confirmed) {
      setLoading(true);
      const data = await backupManager.downloadFromGoogleDrive(fileId);
      if (data) {
        const success = await backupManager.restoreFromBackup(data);
        setLoading(false);

        if (success) {
          showMessage('success', 'Data restored successfully. Please refresh the page.');
        } else {
          showMessage('error', 'Failed to restore data');
        }
      } else {
        setLoading(false);
        showMessage('error', 'Failed to download backup');
      }
    }
  };

  const handleDeleteGoogleDrive = async (fileId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this backup?');

    if (confirmed) {
      setLoading(true);
      const success = await backupManager.deleteGoogleDriveBackup(fileId);
      setLoading(false);

      if (success) {
        showMessage('success', 'Backup deleted');
        await loadBackupLists();
      } else {
        showMessage('error', 'Failed to delete backup');
      }
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', color: isDarkTheme ? '#e4e4e7' : '#18181b' }}>
        Backup & Sync Settings
      </h2>

      {message && (
        <div
          style={{
            padding: '12px 16px',
            marginBottom: '20px',
            borderRadius: '6px',
            backgroundColor: message.type === 'success' ? '#22c55e20' : '#ef444420',
            color: message.type === 'success' ? '#22c55e' : '#ef4444',
            border: `1px solid ${message.type === 'success' ? '#22c55e40' : '#ef444440'}`,
          }}
        >
          {message.text}
        </div>
      )}

      {/* Local Backup Settings */}
      <div
        style={{
          backgroundColor: isDarkTheme
            ? darkThemeVariant === 'vscode-gray'
              ? '#1e1e1e'
              : '#1e293b'
            : '#ffffff',
          border: `1px solid ${isDarkTheme ? '#334155' : '#e2e8f0'}`,
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <HardDrive size={20} color={isDarkTheme ? '#94a3b8' : '#64748b'} />
          <h3 style={{ margin: 0, color: isDarkTheme ? '#e4e4e7' : '#18181b' }}>
            Local Backup
          </h3>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.local.enabled}
              onChange={(e) =>
                handleSettingsChange({ local: { ...settings.local, enabled: e.target.checked } })
              }
            />
            <span style={{ color: isDarkTheme ? '#cbd5e1' : '#475569' }}>
              Enable automatic local backups
            </span>
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '13px',
                color: isDarkTheme ? '#94a3b8' : '#64748b',
              }}
            >
              Backup Interval (minutes)
            </label>
            <input
              type="number"
              min="5"
              max="1440"
              value={settings.local.intervalMinutes}
              onChange={(e) =>
                handleSettingsChange({
                  local: { ...settings.local, intervalMinutes: parseInt(e.target.value) || 15 },
                })
              }
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: `1px solid ${isDarkTheme ? '#334155' : '#cbd5e1'}`,
                backgroundColor: isDarkTheme
                  ? darkThemeVariant === 'vscode-gray'
                    ? '#252526'
                    : '#0f172a'
                  : '#ffffff',
                color: isDarkTheme ? '#e4e4e7' : '#18181b',
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                marginBottom: '4px',
                fontSize: '13px',
                color: isDarkTheme ? '#94a3b8' : '#64748b',
              }}
            >
              Keep Last N Backups
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={settings.local.keepCount}
              onChange={(e) =>
                handleSettingsChange({
                  local: { ...settings.local, keepCount: parseInt(e.target.value) || 10 },
                })
              }
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: `1px solid ${isDarkTheme ? '#334155' : '#cbd5e1'}`,
                backgroundColor: isDarkTheme
                  ? darkThemeVariant === 'vscode-gray'
                    ? '#252526'
                    : '#0f172a'
                  : '#ffffff',
                color: isDarkTheme ? '#e4e4e7' : '#18181b',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-sm btn-primary"
            onClick={handleCreateLocalBackup}
            disabled={loading}
          >
            <Save size={14} />
            Backup Now
          </button>
          <button
            className="btn btn-sm"
            onClick={handleExportToFile}
            disabled={loading}
          >
            <Download size={14} />
            Export to File
          </button>
          <button
            className="btn btn-sm"
            onClick={handleImportFromFile}
            disabled={loading}
          >
            <Upload size={14} />
            Import from File
          </button>
          <button
            className="btn btn-sm"
            onClick={handleOpenBackupDirectory}
          >
            <FolderOpen size={14} />
            Open Backup Folder
          </button>
        </div>

        {/* Local Backup List */}
        {localBackups.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ marginBottom: '8px', color: isDarkTheme ? '#cbd5e1' : '#475569', fontSize: '14px' }}>
              Local Backups ({localBackups.length})
            </h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {localBackups.map((backup, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 12px',
                    marginBottom: '4px',
                    backgroundColor: isDarkTheme
                      ? darkThemeVariant === 'vscode-gray'
                        ? '#252526'
                        : '#0f172a'
                      : '#f8fafc',
                    borderRadius: '4px',
                    fontSize: '13px',
                  }}
                >
                  <div>
                    <div style={{ color: isDarkTheme ? '#e4e4e7' : '#18181b', marginBottom: '2px' }}>
                      {backup.filename}
                    </div>
                    <div style={{ color: isDarkTheme ? '#64748b' : '#94a3b8', fontSize: '11px' }}>
                      {formatDate(backup.createdAt)} • {formatFileSize(backup.size)}
                    </div>
                  </div>
                  <button
                    className="btn btn-sm"
                    onClick={() => handleRestoreLocal(backup.filepath)}
                    disabled={loading}
                  >
                    <RefreshCw size={12} />
                    Restore
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Google Drive Settings */}
      <div
        style={{
          backgroundColor: isDarkTheme
            ? darkThemeVariant === 'vscode-gray'
              ? '#1e1e1e'
              : '#1e293b'
            : '#ffffff',
          border: `1px solid ${isDarkTheme ? '#334155' : '#e2e8f0'}`,
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <Cloud size={20} color={isDarkTheme ? '#94a3b8' : '#64748b'} />
          <h3 style={{ margin: 0, color: isDarkTheme ? '#e4e4e7' : '#18181b' }}>
            Google Drive Sync
          </h3>
          <span
            style={{
              marginLeft: 'auto',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '11px',
              backgroundColor: isGoogleDriveAuthenticated ? '#22c55e20' : '#64748b20',
              color: isGoogleDriveAuthenticated ? '#22c55e' : '#64748b',
            }}
          >
            {isGoogleDriveAuthenticated ? 'Connected' : 'Not Connected'}
          </span>
        </div>

        {!googleDriveConfigured && (
          <div
            style={{
              padding: '12px',
              marginBottom: '16px',
              borderRadius: '6px',
              backgroundColor: '#f59e0b20',
              border: '1px solid #f59e0b40',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
            }}
          >
            <AlertCircle size={16} color="#f59e0b" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div style={{ fontSize: '12px', color: isDarkTheme ? '#fbbf24' : '#d97706' }}>
              <div style={{ fontWeight: 500, marginBottom: '4px' }}>Google Drive Not Configured</div>
              <div style={{ opacity: 0.9 }}>
                To enable Google Drive sync, follow the setup guide in <code style={{ padding: '2px 4px', backgroundColor: isDarkTheme ? '#00000040' : '#ffffff40', borderRadius: '3px' }}>GOOGLE_DRIVE_SETUP.md</code>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <button
            className="btn btn-sm"
            onClick={handleGoogleDriveAuth}
            disabled={loading || !googleDriveConfigured}
          >
            {isGoogleDriveAuthenticated ? (
              <>
                <LogOut size={14} />
                Disconnect
              </>
            ) : (
              <>
                <LogIn size={14} />
                Connect Google Drive
              </>
            )}
          </button>
        </div>

        {isGoogleDriveAuthenticated && (
          <>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.googleDrive.enabled}
                  onChange={(e) =>
                    handleSettingsChange({
                      googleDrive: { ...settings.googleDrive, enabled: e.target.checked },
                    })
                  }
                />
                <span style={{ color: isDarkTheme ? '#cbd5e1' : '#475569' }}>
                  Enable automatic Google Drive sync
                </span>
              </label>
            </div>

            <div
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}
            >
              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '13px',
                    color: isDarkTheme ? '#94a3b8' : '#64748b',
                  }}
                >
                  Sync Interval (minutes)
                </label>
                <input
                  type="number"
                  min="15"
                  max="1440"
                  value={settings.googleDrive.intervalMinutes}
                  onChange={(e) =>
                    handleSettingsChange({
                      googleDrive: {
                        ...settings.googleDrive,
                        intervalMinutes: parseInt(e.target.value) || 30,
                      },
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: `1px solid ${isDarkTheme ? '#334155' : '#cbd5e1'}`,
                    backgroundColor: isDarkTheme
                      ? darkThemeVariant === 'vscode-gray'
                        ? '#252526'
                        : '#0f172a'
                      : '#ffffff',
                    color: isDarkTheme ? '#e4e4e7' : '#18181b',
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    marginBottom: '4px',
                    fontSize: '13px',
                    color: isDarkTheme ? '#94a3b8' : '#64748b',
                  }}
                >
                  Keep Last N Backups
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={settings.googleDrive.keepCount}
                  onChange={(e) =>
                    handleSettingsChange({
                      googleDrive: { ...settings.googleDrive, keepCount: parseInt(e.target.value) || 10 },
                    })
                  }
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: `1px solid ${isDarkTheme ? '#334155' : '#cbd5e1'}`,
                    backgroundColor: isDarkTheme
                      ? darkThemeVariant === 'vscode-gray'
                        ? '#252526'
                        : '#0f172a'
                      : '#ffffff',
                    color: isDarkTheme ? '#e4e4e7' : '#18181b',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <button
                className="btn btn-sm btn-primary"
                onClick={handleSyncToGoogleDrive}
                disabled={loading}
              >
                <Cloud size={14} />
                Sync Now
              </button>
            </div>

            {/* Google Drive Backup List */}
            {googleDriveBackups.length > 0 && (
              <div style={{ marginTop: '16px' }}>
                <h4
                  style={{
                    marginBottom: '8px',
                    color: isDarkTheme ? '#cbd5e1' : '#475569',
                    fontSize: '14px',
                  }}
                >
                  Google Drive Backups ({googleDriveBackups.length})
                </h4>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {googleDriveBackups.map((backup) => (
                    <div
                      key={backup.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '8px 12px',
                        marginBottom: '4px',
                        backgroundColor: isDarkTheme
                          ? darkThemeVariant === 'vscode-gray'
                            ? '#252526'
                            : '#0f172a'
                          : '#f8fafc',
                        borderRadius: '4px',
                        fontSize: '13px',
                      }}
                    >
                      <div>
                        <div style={{ color: isDarkTheme ? '#e4e4e7' : '#18181b', marginBottom: '2px' }}>
                          {backup.name}
                        </div>
                        <div style={{ color: isDarkTheme ? '#64748b' : '#94a3b8', fontSize: '11px' }}>
                          {formatDate(backup.createdTime)} • {backup.size}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          className="btn btn-sm"
                          onClick={() => handleRestoreGoogleDrive(backup.id)}
                          disabled={loading}
                          style={{ padding: '4px 8px' }}
                        >
                          <RefreshCw size={12} />
                          Restore
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteGoogleDrive(backup.id)}
                          disabled={loading}
                          style={{ padding: '4px 8px' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Save Settings Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          className="btn btn-primary"
          onClick={handleSaveSettings}
          disabled={loading}
        >
          <Save size={16} />
          Save Settings
        </button>
      </div>
    </div>
  );
}
