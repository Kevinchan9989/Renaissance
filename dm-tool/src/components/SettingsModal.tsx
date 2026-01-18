import { useState, useEffect, useRef, useCallback } from 'react';
import { Download, Upload, Trash2, FileDown, X, Copy, Check, Sun, Moon, Palette, GitBranch, FolderSync, Database, FileCode, Folder, RefreshCw, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { exportWorkspace, importWorkspace, downloadJson, WorkspaceData, exportWorkspaceForGit, getWorkspaceSummary, GIT_WORKSPACE_FILENAME, getGitSyncSettings, setGitSyncPath, setGitSyncEnabled, triggerGitSync, subscribeToGitSyncStatus, GitSyncSettings } from '../utils/storage';
import { getLogs, clearLogs, subscribeToLogs, formatTimestamp, downloadLogs, exportLogsAsText } from '../utils/debugLogger';
import { isElectron } from '../services/electronStorage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  darkThemeVariant: 'slate' | 'vscode-gray';
  onToggleTheme: () => void;
  onToggleDarkThemeVariant: () => void;
}

type TabType = 'appearance' | 'workspace' | 'git-sync' | 'logs' | 'erd';

export default function SettingsModal({ isOpen, onClose, theme, darkThemeVariant, onToggleTheme, onToggleDarkThemeVariant }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('appearance');
  const [logs, setLogs] = useState(getLogs());
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const [groupTemporalColors, setGroupTemporalColors] = useState(
    localStorage.getItem('erd_group_temporal_colors') === 'true'
  );
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Git sync state
  const [gitSyncSettings, setGitSyncSettingsState] = useState<GitSyncSettings>(getGitSyncSettings);
  const [gitSyncStatus, setGitSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [gitSyncError, setGitSyncError] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Refresh git sync settings when modal opens
  useEffect(() => {
    if (isOpen) {
      setGitSyncSettingsState(getGitSyncSettings());
    }
  }, [isOpen]);

  // Subscribe to git sync status updates
  useEffect(() => {
    const unsubscribe = subscribeToGitSyncStatus((status, message) => {
      setGitSyncStatus(status);
      if (status === 'error') {
        setGitSyncError(message || 'Unknown error');
      } else {
        setGitSyncError(null);
      }
      if (status === 'saved') {
        setGitSyncSettingsState(getGitSyncSettings()); // Refresh to get new lastSaved
      }
    });
    return unsubscribe;
  }, []);

  // Subscribe to log updates
  useEffect(() => {
    const unsubscribe = subscribeToLogs(() => {
      setLogs(getLogs());
    });
    return unsubscribe;
  }, []);

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    if (autoScroll && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  // Git sync handlers
  const handleSelectGitSyncFolder = useCallback(async () => {
    if (!isElectron() || !window.electronAPI) {
      alert('Folder selection requires the desktop app (Electron)');
      return;
    }

    const result = await window.electronAPI.selectFolder();
    if (result.success && result.path) {
      setGitSyncPath(result.path);
      setGitSyncSettingsState(getGitSyncSettings());
    }
  }, []);

  const handleSetDefaultPath = useCallback(async () => {
    if (!isElectron() || !window.electronAPI) {
      alert('This feature requires the desktop app (Electron)');
      return;
    }

    const result = await window.electronAPI.getDefaultBackupsPath();
    if (result.success && result.path) {
      setGitSyncPath(result.path);
      setGitSyncSettingsState(getGitSyncSettings());
    }
  }, []);

  const handleClearGitSyncPath = useCallback(() => {
    setGitSyncPath(null);
    setGitSyncEnabled(false);
    setGitSyncSettingsState(getGitSyncSettings());
  }, []);

  const handleToggleAutoSync = useCallback((enabled: boolean) => {
    setGitSyncEnabled(enabled);
    setGitSyncSettingsState(getGitSyncSettings());
  }, []);

  const handleManualSync = useCallback(async () => {
    if (!gitSyncSettings.path) {
      alert('Please set a sync path first');
      return;
    }

    setIsSyncing(true);
    try {
      await triggerGitSync();
      setGitSyncSettingsState(getGitSyncSettings());
    } finally {
      setIsSyncing(false);
    }
  }, [gitSyncSettings.path]);

  const handleLoadFromSyncPath = useCallback(async () => {
    if (!isElectron() || !window.electronAPI || !gitSyncSettings.path) {
      return;
    }

    const fullPath = `${gitSyncSettings.path}/${GIT_WORKSPACE_FILENAME}`;
    const result = await window.electronAPI.loadWorkspaceFromPath(fullPath);

    if (result.success && result.data) {
      const confirmed = window.confirm(
        'This will replace all current data including scripts, mappings, and ERD positions. Are you sure?'
      );
      if (confirmed) {
        importWorkspace(result.data as WorkspaceData);
        onClose();
        window.location.reload();
      }
    } else {
      alert(`Failed to load workspace: ${result.error || 'File not found'}`);
    }
  }, [gitSyncSettings.path, onClose]);

  const formatLastSaved = (timestamp: number | null): string => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;

    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const isVscode = darkThemeVariant === 'vscode-gray';

  const bgColor = isDark ? (isVscode ? '#1e1e1e' : '#1e293b') : '#ffffff';
  const textColor = isDark ? '#e4e4e7' : '#18181b';
  const textSecondary = isDark ? '#a1a1aa' : '#71717a';
  const borderColor = isDark ? (isVscode ? '#3c3c3c' : '#334155') : '#e5e7eb';
  const hoverColor = isDark ? (isVscode ? '#2a2a2a' : '#334155') : '#f3f4f6';

  const handleExportWorkspace = () => {
    const workspace = exportWorkspace();
    const filename = `renaissance-workspace-${new Date().toISOString().split('T')[0]}.json`;
    downloadJson(workspace, filename);
  };

  const handleImportWorkspace = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string) as WorkspaceData;
            const confirmed = window.confirm(
              'This will replace all current data including scripts, mappings, and ERD positions. Are you sure?'
            );
            if (confirmed) {
              importWorkspace(data);
              onClose();
              window.location.reload();
            }
          } catch (error) {
            alert('Failed to import workspace. Please check the file format.');
            console.error('Import error:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearLogs = () => {
    if (window.confirm('Are you sure you want to clear all logs?')) {
      clearLogs();
      setLogs([]);
    }
  };

  const handleCopyLogs = async () => {
    try {
      const logsText = exportLogsAsText();
      await navigator.clipboard.writeText(logsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy logs:', err);
      alert('Failed to copy logs to clipboard');
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return '#f87171';
      case 'warn': return '#fbbf24';
      case 'info': return '#60a5fa';
      default: return textColor;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: bgColor,
          borderRadius: '12px',
          width: '900px',
          height: '700px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: `1px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <h2 style={{
            margin: 0,
            color: textColor,
            fontSize: '24px',
            fontWeight: 600,
          }}>
            Settings
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: textSecondary,
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Content with Sidebar */}
        <div style={{
          flex: 1,
          display: 'flex',
          overflow: 'hidden',
        }}>
          {/* Left Sidebar Navigation */}
          <div style={{
            width: '220px',
            borderRight: `1px solid ${borderColor}`,
            backgroundColor: isDark ? (isVscode ? '#252526' : '#0f172a') : '#f9fafb',
            padding: '16px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}>
            <button
              onClick={() => setActiveTab('appearance')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'appearance' ? (isDark ? (isVscode ? '#37373d' : '#1e293b') : '#e5e7eb') : 'transparent',
                border: 'none',
                borderLeft: activeTab === 'appearance' ? `3px solid #3b82f6` : '3px solid transparent',
                color: activeTab === 'appearance' ? textColor : textSecondary,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === 'appearance' ? 600 : 500,
                textAlign: 'left',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'appearance') {
                  e.currentTarget.style.backgroundColor = hoverColor;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'appearance') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Palette size={16} />
              Appearance
            </button>
            <button
              onClick={() => setActiveTab('workspace')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'workspace' ? (isDark ? (isVscode ? '#37373d' : '#1e293b') : '#e5e7eb') : 'transparent',
                border: 'none',
                borderLeft: activeTab === 'workspace' ? `3px solid #3b82f6` : '3px solid transparent',
                color: activeTab === 'workspace' ? textColor : textSecondary,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === 'workspace' ? 600 : 500,
                textAlign: 'left',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'workspace') {
                  e.currentTarget.style.backgroundColor = hoverColor;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'workspace') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Download size={16} />
              Workspace
            </button>
            <button
              onClick={() => setActiveTab('git-sync')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'git-sync' ? (isDark ? (isVscode ? '#37373d' : '#1e293b') : '#e5e7eb') : 'transparent',
                border: 'none',
                borderLeft: activeTab === 'git-sync' ? `3px solid #10b981` : '3px solid transparent',
                color: activeTab === 'git-sync' ? textColor : textSecondary,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === 'git-sync' ? 600 : 500,
                textAlign: 'left',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'git-sync') {
                  e.currentTarget.style.backgroundColor = hoverColor;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'git-sync') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <GitBranch size={16} />
              Git Sync
            </button>
            <button
              onClick={() => setActiveTab('erd')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'erd' ? (isDark ? (isVscode ? '#37373d' : '#1e293b') : '#e5e7eb') : 'transparent',
                border: 'none',
                borderLeft: activeTab === 'erd' ? `3px solid #3b82f6` : '3px solid transparent',
                color: activeTab === 'erd' ? textColor : textSecondary,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === 'erd' ? 600 : 500,
                textAlign: 'left',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'erd') {
                  e.currentTarget.style.backgroundColor = hoverColor;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'erd') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              ERD
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'logs' ? (isDark ? (isVscode ? '#37373d' : '#1e293b') : '#e5e7eb') : 'transparent',
                border: 'none',
                borderLeft: activeTab === 'logs' ? `3px solid #3b82f6` : '3px solid transparent',
                color: activeTab === 'logs' ? textColor : textSecondary,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: activeTab === 'logs' ? 600 : 500,
                textAlign: 'left',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'logs') {
                  e.currentTarget.style.backgroundColor = hoverColor;
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'logs') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                Debug Logs
              </span>
              <span style={{
                backgroundColor: isDark ? '#3b82f6' : '#2563eb',
                color: '#ffffff',
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '10px',
                fontWeight: 600,
              }}>
                {logs.length}
              </span>
            </button>
          </div>

          {/* Content Area */}
          <div style={{
            flex: 1,
            padding: '32px',
            overflowY: 'auto',
          }}>
          {activeTab === 'appearance' && (
            <div>
              <h3 style={{
                margin: '0 0 8px 0',
                color: textColor,
                fontSize: '18px',
                fontWeight: 600,
              }}>
                Theme
              </h3>
              <p style={{
                margin: '0 0 24px 0',
                color: textSecondary,
                fontSize: '14px',
                lineHeight: '1.6',
              }}>
                Customize the appearance of the application.
              </p>

              {/* Light/Dark Mode Toggle */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: isDark ? (isVscode ? '#252526' : '#1e293b') : '#f9fafb',
                border: `1px solid ${borderColor}`,
                marginBottom: '16px',
              }}>
                <div>
                  <div style={{ color: textColor, fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                    Theme Mode
                  </div>
                  <div style={{ color: textSecondary, fontSize: '13px' }}>
                    Switch between light and dark mode
                  </div>
                </div>
                <button
                  onClick={onToggleTheme}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    backgroundColor: isDark ? '#3b82f6' : '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? '#2563eb' : '#1d4ed8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? '#3b82f6' : '#2563eb';
                  }}
                >
                  {theme === 'light' ? (
                    <>
                      <Moon size={16} />
                      Dark Mode
                    </>
                  ) : (
                    <>
                      <Sun size={16} />
                      Light Mode
                    </>
                  )}
                </button>
              </div>

              {/* Dark Theme Variant (only shown in dark mode) */}
              {theme === 'dark' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? (isVscode ? '#252526' : '#1e293b') : '#f9fafb',
                  border: `1px solid ${borderColor}`,
                }}>
                  <div>
                    <div style={{ color: textColor, fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                      Dark Theme Variant
                    </div>
                    <div style={{ color: textSecondary, fontSize: '13px' }}>
                      Current: {darkThemeVariant === 'slate' ? 'Slate Gray' : 'VS Code Gray'}
                    </div>
                  </div>
                  <button
                    onClick={onToggleDarkThemeVariant}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      backgroundColor: darkThemeVariant === 'vscode-gray' ? '#569cd6' : '#64748b',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 500,
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkThemeVariant === 'vscode-gray' ? '#4a8bc2' : '#52677a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = darkThemeVariant === 'vscode-gray' ? '#569cd6' : '#64748b';
                    }}
                  >
                    <Palette size={16} />
                    {darkThemeVariant === 'slate' ? 'VS Code Gray' : 'Slate Gray'}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'erd' && (
            <div>
              <p style={{
                margin: '0 0 24px 0',
                color: textSecondary,
                fontSize: '14px',
                lineHeight: '1.6',
              }}>
                Configure how ERD diagrams display tables and relationships.
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: isDark ? (isVscode ? '#252526' : '#1e293b') : '#f9fafb',
                border: `1px solid ${borderColor}`,
              }}>
                <div>
                  <div style={{ color: textColor, fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                    Group Temporal Tables Colors
                  </div>
                  <div style={{ color: textSecondary, fontSize: '13px' }}>
                    Master tables and their _t temporal tables share the same color
                  </div>
                </div>
                <label style={{
                  position: 'relative',
                  display: 'inline-block',
                  width: '48px',
                  height: '26px',
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={groupTemporalColors}
                    onChange={(e) => {
                      const newValue = e.target.checked;
                      setGroupTemporalColors(newValue);
                      localStorage.setItem('erd_group_temporal_colors', String(newValue));
                      window.dispatchEvent(new CustomEvent('erd-settings-changed'));
                    }}
                    style={{
                      opacity: 0,
                      width: 0,
                      height: 0,
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    cursor: 'pointer',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: groupTemporalColors ? '#3b82f6' : (isDark ? '#4b5563' : '#d1d5db'),
                    transition: '0.3s',
                    borderRadius: '26px',
                  }}>
                    <span style={{
                      position: 'absolute',
                      content: '',
                      height: '20px',
                      width: '20px',
                      left: groupTemporalColors ? '25px' : '3px',
                      bottom: '3px',
                      backgroundColor: 'white',
                      transition: '0.3s',
                      borderRadius: '50%',
                    }} />
                  </span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div>
              <p style={{
                margin: '0 0 24px 0',
                color: textSecondary,
                fontSize: '14px',
                lineHeight: '1.6',
              }}>
                Export your entire workspace (scripts, mappings, ERD positions, theme) or import a previously exported workspace.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  className="btn btn-primary"
                  onClick={handleExportWorkspace}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '15px',
                    padding: '12px 20px',
                  }}
                >
                  <Download size={18} />
                  Export Workspace
                </button>

                <button
                  className="btn"
                  onClick={handleImportWorkspace}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '15px',
                    padding: '12px 20px',
                  }}
                >
                  <Upload size={18} />
                  Import Workspace
                </button>
              </div>

              <div style={{
                marginTop: '24px',
                padding: '12px',
                borderRadius: '6px',
                backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
                border: `1px solid ${isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'}`,
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  color: isDark ? '#94a3b8' : '#64748b',
                  lineHeight: '1.5',
                }}>
                  <strong>Note:</strong> The exported file includes all your work and can be used as a backup or to transfer your workspace to another device.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'git-sync' && (
            <div>
              <h3 style={{
                margin: '0 0 8px 0',
                color: textColor,
                fontSize: '18px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <GitBranch size={20} style={{ color: '#10b981' }} />
                Git Repository Sync
              </h3>
              <p style={{
                margin: '0 0 24px 0',
                color: textSecondary,
                fontSize: '14px',
                lineHeight: '1.6',
              }}>
                Auto-save your workspace to a folder in your Git repository. Changes sync automatically when you make edits.
              </p>

              {/* Sync Path Configuration */}
              <div style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: isDark ? (isVscode ? '#252526' : '#1e293b') : '#f9fafb',
                border: `1px solid ${gitSyncSettings.path ? '#10b981' : borderColor}`,
                marginBottom: '16px',
              }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: textColor,
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <Folder size={14} />
                  Sync Folder
                </div>

                {gitSyncSettings.path ? (
                  <>
                    <div style={{
                      padding: '10px 12px',
                      backgroundColor: isDark ? '#0f172a' : '#e5e7eb',
                      borderRadius: '6px',
                      fontFamily: "'SF Mono', 'Fira Code', monospace",
                      fontSize: '12px',
                      color: textColor,
                      marginBottom: '12px',
                      wordBreak: 'break-all',
                    }}>
                      {gitSyncSettings.path}/{GIT_WORKSPACE_FILENAME}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={handleSelectGitSyncFolder}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: isDark ? '#374151' : '#e5e7eb',
                          color: textColor,
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <Folder size={14} />
                        Change
                      </button>
                      <button
                        onClick={handleClearGitSyncPath}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: 'transparent',
                          color: '#ef4444',
                          border: `1px solid #ef4444`,
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px',
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <button
                      onClick={handleSetDefaultPath}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <FolderSync size={14} />
                      Use Renaissance/backups
                    </button>
                    <button
                      onClick={handleSelectGitSyncFolder}
                      style={{
                        padding: '10px 16px',
                        backgroundColor: isDark ? '#374151' : '#e5e7eb',
                        color: textColor,
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Folder size={14} />
                      Browse...
                    </button>
                  </div>
                )}
              </div>

              {/* Auto-Sync Toggle */}
              {gitSyncSettings.path && (
                <div style={{
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: isDark ? (isVscode ? '#252526' : '#1e293b') : '#f9fafb',
                  border: `1px solid ${borderColor}`,
                  marginBottom: '16px',
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{ color: textColor, fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                        Auto-Sync
                      </div>
                      <div style={{ color: textSecondary, fontSize: '12px' }}>
                        Automatically save workspace when you make changes
                      </div>
                    </div>
                    <label style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '48px',
                      height: '26px',
                      cursor: 'pointer',
                    }}>
                      <input
                        type="checkbox"
                        checked={gitSyncSettings.enabled}
                        onChange={(e) => handleToggleAutoSync(e.target.checked)}
                        style={{
                          opacity: 0,
                          width: 0,
                          height: 0,
                        }}
                      />
                      <span style={{
                        position: 'absolute',
                        cursor: 'pointer',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: gitSyncSettings.enabled ? '#10b981' : (isDark ? '#4b5563' : '#d1d5db'),
                        transition: '0.3s',
                        borderRadius: '26px',
                      }}>
                        <span style={{
                          position: 'absolute',
                          content: '',
                          height: '20px',
                          width: '20px',
                          left: gitSyncSettings.enabled ? '25px' : '3px',
                          bottom: '3px',
                          backgroundColor: 'white',
                          transition: '0.3s',
                          borderRadius: '50%',
                        }} />
                      </span>
                    </label>
                  </div>

                  {/* Status indicator */}
                  <div style={{
                    marginTop: '12px',
                    paddingTop: '12px',
                    borderTop: `1px solid ${borderColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      color: textSecondary,
                    }}>
                      {gitSyncStatus === 'saving' || isSyncing ? (
                        <>
                          <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                          <span>Saving...</span>
                        </>
                      ) : gitSyncStatus === 'saved' ? (
                        <>
                          <CheckCircle size={14} style={{ color: '#10b981' }} />
                          <span style={{ color: '#10b981' }}>Saved</span>
                        </>
                      ) : gitSyncStatus === 'error' ? (
                        <>
                          <AlertCircle size={14} style={{ color: '#ef4444' }} />
                          <span style={{ color: '#ef4444' }}>{gitSyncError || 'Error'}</span>
                        </>
                      ) : (
                        <>
                          <span>Last saved: {formatLastSaved(gitSyncSettings.lastSaved)}</span>
                        </>
                      )}
                    </div>
                    <button
                      onClick={handleManualSync}
                      disabled={isSyncing}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'transparent',
                        color: '#10b981',
                        border: `1px solid #10b981`,
                        borderRadius: '6px',
                        cursor: isSyncing ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        opacity: isSyncing ? 0.5 : 1,
                      }}
                    >
                      <RefreshCw size={12} style={{ animation: isSyncing ? 'spin 1s linear infinite' : 'none' }} />
                      Sync Now
                    </button>
                  </div>
                </div>
              )}

              {/* Workspace Summary */}
              {(() => {
                const summary = getWorkspaceSummary();
                return (
                  <div style={{
                    padding: '16px',
                    borderRadius: '8px',
                    backgroundColor: isDark ? (isVscode ? '#252526' : '#1e293b') : '#f9fafb',
                    border: `1px solid ${borderColor}`,
                    marginBottom: '16px',
                  }}>
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: textColor,
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}>
                      <Database size={14} />
                      Workspace Contents
                    </div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '8px',
                      fontSize: '13px',
                    }}>
                      <div style={{ color: textSecondary }}>
                        DDL Scripts: <span style={{ color: textColor, fontWeight: 500 }}>{summary.scripts}</span>
                      </div>
                      <div style={{ color: textSecondary }}>
                        Flowcharts: <span style={{ color: textColor, fontWeight: 500 }}>{summary.flowcharts}</span>
                      </div>
                      <div style={{ color: textSecondary }}>
                        Mapping Projects: <span style={{ color: textColor, fontWeight: 500 }}>{summary.mappingProjects}</span>
                      </div>
                      <div style={{ color: textSecondary }}>
                        Type Rule Sets: <span style={{ color: textColor, fontWeight: 500 }}>{summary.typeRuleSets}</span>
                      </div>
                      <div style={{ color: textSecondary, gridColumn: 'span 2' }}>
                        Total Size: <span style={{ color: '#10b981', fontWeight: 500 }}>{summary.totalSize}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Manual Export/Import */}
              <div style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: isDark ? (isVscode ? '#252526' : '#1e293b') : '#f9fafb',
                border: `1px solid ${borderColor}`,
                marginBottom: '16px',
              }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: textColor,
                  marginBottom: '12px',
                }}>
                  Manual Sync
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => exportWorkspaceForGit()}
                    style={{
                      padding: '8px 14px',
                      backgroundColor: isDark ? '#374151' : '#e5e7eb',
                      color: textColor,
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Download size={14} />
                    Download {GIT_WORKSPACE_FILENAME}
                  </button>
                  {gitSyncSettings.path ? (
                    <button
                      onClick={handleLoadFromSyncPath}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: isDark ? '#374151' : '#e5e7eb',
                        color: textColor,
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Upload size={14} />
                      Load from Sync Folder
                    </button>
                  ) : (
                    <button
                      onClick={handleImportWorkspace}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: isDark ? '#374151' : '#e5e7eb',
                        color: textColor,
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Upload size={14} />
                      Import from File
                    </button>
                  )}
                </div>
              </div>

              {/* Git Instructions */}
              <div style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                border: `1px solid ${isDark ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.15)'}`,
              }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#10b981',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <FileCode size={14} />
                  Git Workflow
                </div>
                <div style={{
                  fontSize: '12px',
                  color: isDark ? '#94a3b8' : '#64748b',
                  lineHeight: '1.8',
                }}>
                  <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: textColor }}>Push changes:</strong>
                  </div>
                  <code style={{
                    display: 'block',
                    backgroundColor: isDark ? '#0f172a' : '#e5e7eb',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    marginBottom: '12px',
                    wordBreak: 'break-all',
                  }}>
                    git add backups/{GIT_WORKSPACE_FILENAME} && git commit -m "Update workspace" && git push
                  </code>
                  <div style={{ marginBottom: '8px' }}>
                    <strong style={{ color: textColor }}>Pull on another device:</strong>
                  </div>
                  <code style={{
                    display: 'block',
                    backgroundColor: isDark ? '#0f172a' : '#e5e7eb',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '11px',
                  }}>
                    git pull
                  </code>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
              {/* Logs toolbar */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  className="btn"
                  onClick={handleClearLogs}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    padding: '8px 12px',
                  }}
                >
                  <Trash2 size={14} />
                  Clear Logs
                </button>
                <button
                  className="btn"
                  onClick={handleCopyLogs}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    padding: '8px 12px',
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  className="btn"
                  onClick={downloadLogs}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    padding: '8px 12px',
                  }}
                >
                  <FileDown size={14} />
                  Download
                </button>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  color: textSecondary,
                  marginLeft: 'auto',
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={autoScroll}
                    onChange={(e) => setAutoScroll(e.target.checked)}
                    style={{ cursor: 'pointer' }}
                  />
                  Auto-scroll
                </label>
              </div>

              {/* Logs display */}
              <div style={{
                flex: 1,
                backgroundColor: isDark ? (isVscode ? '#1e1e1e' : '#0f172a') : '#f9fafb',
                border: `1px solid ${borderColor}`,
                borderRadius: '6px',
                padding: '12px',
                fontFamily: "'SF Mono', 'Fira Code', 'Consolas', monospace",
                fontSize: '12px',
                lineHeight: '1.5',
                overflowY: 'auto',
                minHeight: 0,
              }}>
                {logs.length === 0 ? (
                  <div style={{ color: textSecondary, textAlign: 'center', padding: '32px' }}>
                    No logs captured yet. Console logs will appear here.
                  </div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} style={{
                      marginBottom: '4px',
                      color: getLogColor(log.level),
                      wordBreak: 'break-word',
                    }}>
                      <span style={{ color: textSecondary, marginRight: '8px' }}>
                        [{formatTimestamp(log.timestamp)}]
                      </span>
                      <span style={{ color: getLogColor(log.level), marginRight: '8px' }}>
                        {log.level.toUpperCase()}
                      </span>
                      <span>{log.message}</span>
                    </div>
                  ))
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
