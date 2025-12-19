import { useState, useEffect, useRef } from 'react';
import { Download, Upload, Trash2, FileDown, X, Copy, Check } from 'lucide-react';
import { exportWorkspace, importWorkspace, downloadJson, WorkspaceData } from '../utils/storage';
import { getLogs, clearLogs, subscribeToLogs, formatTimestamp, downloadLogs, exportLogsAsText } from '../utils/debugLogger';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'light' | 'dark';
  darkThemeVariant: 'slate' | 'vscode-gray';
}

type TabType = 'workspace' | 'logs' | 'erd';

export default function SettingsModal({ isOpen, onClose, theme, darkThemeVariant }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('workspace');
  const [logs, setLogs] = useState(getLogs());
  const [autoScroll, setAutoScroll] = useState(true);
  const [copied, setCopied] = useState(false);
  const [groupTemporalColors, setGroupTemporalColors] = useState(
    localStorage.getItem('erd_group_temporal_colors') === 'true'
  );
  const logsEndRef = useRef<HTMLDivElement>(null);

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
          maxWidth: '800px',
          width: '90%',
          maxHeight: '85vh',
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

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '0 32px',
          borderBottom: `1px solid ${borderColor}`,
          backgroundColor: isDark ? (isVscode ? '#252526' : '#0f172a') : '#f9fafb',
        }}>
          <button
            onClick={() => setActiveTab('workspace')}
            style={{
              padding: '12px 20px',
              background: activeTab === 'workspace' ? bgColor : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'workspace' ? `2px solid #3b82f6` : '2px solid transparent',
              color: activeTab === 'workspace' ? textColor : textSecondary,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            Workspace
          </button>
          <button
            onClick={() => setActiveTab('erd')}
            style={{
              padding: '12px 20px',
              background: activeTab === 'erd' ? bgColor : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'erd' ? `2px solid #3b82f6` : '2px solid transparent',
              color: activeTab === 'erd' ? textColor : textSecondary,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            ERD
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            style={{
              padding: '12px 20px',
              background: activeTab === 'logs' ? bgColor : 'transparent',
              border: 'none',
              borderBottom: activeTab === 'logs' ? `2px solid #3b82f6` : '2px solid transparent',
              color: activeTab === 'logs' ? textColor : textSecondary,
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            Debug Logs ({logs.length})
          </button>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          padding: '32px',
          overflowY: 'auto',
        }}>
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
                maxHeight: '400px',
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
  );
}
