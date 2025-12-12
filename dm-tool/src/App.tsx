import { useState, useEffect, useCallback, useRef } from 'react';
import { Script, ScriptType, AppView, Table, MappingProject } from './types';
import { loadScripts, saveScripts, generateId, loadTheme, saveTheme, saveMappingProject, loadDarkThemeVariant, saveDarkThemeVariant, DarkThemeVariant } from './utils/storage';
import { parseScript } from './utils/parsers';
import Sidebar from './components/Sidebar';
import DataDictionary from './components/DataDictionary';
import SchemaCompare from './components/SchemaCompare';
import ERDViewer from './components/ERDViewer';
import ScriptManager from './components/ScriptManager';
import ColumnMapper, { MappingStateForSidebar } from './components/ColumnMapper';
import { Database, Sun, Moon, PanelLeftClose, PanelLeft, ChevronDown, GripVertical, Palette, Settings, Download, Upload } from 'lucide-react';
import { exportWorkspace, importWorkspace, downloadJson, WorkspaceData } from './utils/storage';

// Mapping state interface for sidebar - includes callbacks from ColumnMapper
interface MappingState {
  project: MappingProject | null;
  sourceScript: Script | null;
  targetScript: Script | null;
  selectedMappingId: string | null;
  expandedTables: Set<string>;
  searchTerm: string;
  // Callbacks to call back into ColumnMapper
  handleSelectMapping: (id: string | null) => void;
  handleToggleTable: (tableName: string) => void;
}

export default function App() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [activeScriptId, setActiveScriptId] = useState<string | null>(null);
  const [view, setView] = useState<AppView>('dictionary');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [darkThemeVariant, setDarkThemeVariant] = useState<DarkThemeVariant>('slate');
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [scriptDropdownOpen, setScriptDropdownOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{ startX: number; startWidth: number } | null>(null);

  // Mapping state for sidebar integration
  const [mappingState, setMappingState] = useState<MappingState | null>(null);

  // Settings modal
  const [showSettings, setShowSettings] = useState(false);

  // Load initial data
  useEffect(() => {
    const savedScripts = loadScripts();
    const savedTheme = loadTheme();
    const savedVariant = loadDarkThemeVariant();
    setScripts(savedScripts);
    setTheme(savedTheme);
    setDarkThemeVariant(savedVariant);

    if (savedScripts.length > 0) {
      setActiveScriptId(savedScripts[0].id);
    }

    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      if (savedVariant === 'vscode-gray') {
        document.body.classList.add('vscode-gray');
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.script-dropdown')) {
        setScriptDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle sidebar resize
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    resizeRef.current = { startX: e.clientX, startWidth: sidebarWidth };
    setIsResizing(true);
  }, [sidebarWidth]);

  useEffect(() => {
    const handleResizeMove = (e: MouseEvent) => {
      if (!isResizing || !resizeRef.current) return;

      const delta = e.clientX - resizeRef.current.startX;
      const newWidth = Math.min(Math.max(resizeRef.current.startWidth + delta, 200), 500);
      setSidebarWidth(newWidth);
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
      resizeRef.current = null;
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleResizeMove);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // Get active script
  const activeScript = scripts.find(s => s.id === activeScriptId) || null;

  // Script management
  const createScript = useCallback((name: string, type: ScriptType, content: string) => {
    const data = parseScript(content, type);
    const newScript: Script = {
      id: generateId(),
      name,
      type,
      rawContent: content,
      data,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const updated = [...scripts, newScript];
    setScripts(updated);
    saveScripts(updated);
    setActiveScriptId(newScript.id);
  }, [scripts]);

  const updateScript = useCallback((id: string, updates: Partial<Script>) => {
    const updated = scripts.map(s => {
      if (s.id === id) {
        return { ...s, ...updates, updatedAt: Date.now() };
      }
      return s;
    });
    setScripts(updated);
    saveScripts(updated);
  }, [scripts]);

  const deleteScript = useCallback((id: string) => {
    const updated = scripts.filter(s => s.id !== id);
    setScripts(updated);
    saveScripts(updated);

    if (activeScriptId === id) {
      setActiveScriptId(updated.length > 0 ? updated[0].id : null);
    }
  }, [scripts, activeScriptId]);

  // Theme toggle
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    saveTheme(newTheme);
    if (newTheme === 'dark') {
      document.body.classList.add('dark-theme');
      if (darkThemeVariant === 'vscode-gray') {
        document.body.classList.add('vscode-gray');
      }
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.remove('vscode-gray');
    }
  }, [theme, darkThemeVariant]);

  // Toggle dark theme variant
  const toggleDarkThemeVariant = useCallback(() => {
    const newVariant: DarkThemeVariant = darkThemeVariant === 'slate' ? 'vscode-gray' : 'slate';
    setDarkThemeVariant(newVariant);
    saveDarkThemeVariant(newVariant);
    if (theme === 'dark') {
      if (newVariant === 'vscode-gray') {
        document.body.classList.add('vscode-gray');
      } else {
        document.body.classList.remove('vscode-gray');
      }
    }
  }, [darkThemeVariant, theme]);

  // Export workspace
  const handleExportWorkspace = useCallback(() => {
    const workspace = exportWorkspace();
    const filename = `renaissance-workspace-${new Date().toISOString().split('T')[0]}.json`;
    downloadJson(workspace, filename);
    setShowSettings(false);
  }, []);

  // Import workspace
  const handleImportWorkspace = useCallback(() => {
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
              setShowSettings(false);
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
  }, []);

  // Update table data (for inline editing)
  const updateTable = useCallback((tableId: number, updates: Partial<Table>) => {
    if (!activeScript) return;

    const updatedTables = activeScript.data.targets.map(t => {
      if (t.id === tableId) {
        return { ...t, ...updates };
      }
      return t;
    });

    updateScript(activeScript.id, {
      data: { ...activeScript.data, targets: updatedTables }
    });
  }, [activeScript, updateScript]);

  // Handle view change - switch to dictionary if no script selected for data views
  const handleViewChange = useCallback((newView: AppView) => {
    setView(newView);
    // Clear table selection when changing views
    if (newView !== 'dictionary') {
      setSelectedTableId(null);
    }
    // Clear mapping state when leaving mapping view
    if (newView !== 'mapping') {
      setMappingState(null);
    }
  }, []);

  // Handle mapping state updates from ColumnMapper
  const handleMappingStateChange = useCallback((state: MappingStateForSidebar) => {
    setMappingState(state);
  }, []);

  // Mapping sidebar callbacks - delegate to ColumnMapper's handlers
  const handleMappingSearchChange = useCallback((term: string) => {
    // Search is display-only in sidebar, doesn't need to call back
    if (mappingState) {
      setMappingState({ ...mappingState, searchTerm: term });
    }
  }, [mappingState]);

  // These now call back into ColumnMapper which owns the state
  const handleSelectMapping = useCallback((id: string | null) => {
    if (mappingState?.handleSelectMapping) {
      mappingState.handleSelectMapping(id);
    }
  }, [mappingState]);

  const handleToggleMappingTable = useCallback((tableName: string) => {
    if (mappingState?.handleToggleTable) {
      mappingState.handleToggleTable(tableName);
    }
  }, [mappingState]);

  const handleClearMappings = useCallback(() => {
    if (mappingState?.project) {
      const clearedProject = { ...mappingState.project, mappings: [], updatedAt: Date.now() };
      saveMappingProject(clearedProject);
      setMappingState({ ...mappingState, project: clearedProject });
    }
  }, [mappingState]);

  // Rules dialog state - used in sidebar callback
  const [, setShowRulesDialog] = useState(false);

  // Render main content based on view
  const renderContent = () => {
    // Scripts view doesn't require an active script
    if (view === 'scripts') {
      return (
        <ScriptManager
          scripts={scripts}
          activeScriptId={activeScriptId}
          onSelectScript={setActiveScriptId}
          onCreateScript={createScript}
          onUpdateScript={updateScript}
          onDeleteScript={deleteScript}
          isDarkTheme={theme === 'dark'}
          darkThemeVariant={darkThemeVariant}
        />
      );
    }

    // Mapping view has its own script selectors
    if (view === 'mapping') {
      return (
        <ColumnMapper
          scripts={scripts}
          isDarkTheme={theme === 'dark'}
          darkThemeVariant={darkThemeVariant}
          onMappingStateChange={handleMappingStateChange}
        />
      );
    }


    if (!activeScript) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Database size={48} />
          </div>
          <div className="empty-state-title">No Script Selected</div>
          <div className="empty-state-text">
            Create a new script or select one from the dropdown above.
          </div>
        </div>
      );
    }

    switch (view) {
      case 'dictionary':
        return (
          <DataDictionary
            script={activeScript}
            selectedTableId={selectedTableId}
            onSelectTable={setSelectedTableId}
            onUpdateTable={updateTable}
            onUpdateScript={(rawContent) => {
              const data = parseScript(rawContent, activeScript.type);
              updateScript(activeScript.id, { rawContent, data });
            }}
            isDarkTheme={theme === 'dark'}
            darkThemeVariant={darkThemeVariant}
          />
        );
      case 'compare':
        return <SchemaCompare scripts={scripts} activeScript={activeScript} />;
      case 'erd':
        return (
          <ERDViewer
            tables={activeScript.data.targets}
            isDarkTheme={theme === 'dark'}
            darkThemeVariant={darkThemeVariant}
            scriptId={activeScript.id}
            onRefresh={() => {
              const data = parseScript(activeScript.rawContent, activeScript.type);
              updateScript(activeScript.id, { data });
            }}
          />
        );
      default:
        return null;
    }
  };

  // Check if current view needs a script
  const viewNeedsScript = view !== 'scripts' && view !== 'mapping';

  return (
    <div className="app-container">
      {/* Sidebar Toggle Button (visible when collapsed) */}
      {sidebarCollapsed && (
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarCollapsed(false)}
          title="Show Sidebar"
        >
          <PanelLeft size={20} />
        </button>
      )}

      {/* Sidebar with Resize Handle */}
      {!sidebarCollapsed && (
        <div style={{ display: 'flex', flexShrink: 0, position: 'relative' }}>
          <div style={{ width: sidebarWidth }}>
            <Sidebar
              scripts={scripts}
              activeScriptId={activeScriptId}
              activeScript={activeScript}
              view={view}
              searchTerm={searchTerm}
              selectedTableId={selectedTableId}
              onSelectScript={setActiveScriptId}
              onSelectView={handleViewChange}
              onSelectTable={setSelectedTableId}
              onSearchChange={setSearchTerm}
              // Mapping props
              mappingState={mappingState ?? undefined}
              onMappingSearchChange={handleMappingSearchChange}
              onSelectMapping={handleSelectMapping}
              onToggleMappingTable={handleToggleMappingTable}
              onClearMappings={handleClearMappings}
              onShowRulesDialog={() => setShowRulesDialog(true)}
            />
          </div>
          {/* Resize Handle */}
          <div
            onMouseDown={handleResizeStart}
            style={{
              width: '6px',
              cursor: 'col-resize',
              background: isResizing ? (theme === 'dark' ? '#3b82f6' : '#2563eb') : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              right: '-3px',
              top: 0,
              bottom: 0,
              zIndex: 10,
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              if (!isResizing) {
                e.currentTarget.style.background = theme === 'dark' ? '#374151' : '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (!isResizing) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <GripVertical size={10} style={{ color: theme === 'dark' ? '#6b7280' : '#9ca3af', opacity: 0.7 }} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main-container">
        {/* Top Toolbar */}
        <div className="toolbar">
          <div className="toolbar-left">
            {/* Script Dropdown */}
            {viewNeedsScript && (
              <div className="script-dropdown">
                <button
                  className="script-dropdown-trigger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setScriptDropdownOpen(!scriptDropdownOpen);
                  }}
                >
                  <Database size={16} />
                  <span className="script-dropdown-label">
                    {activeScript ? activeScript.name : 'Select Script'}
                  </span>
                  {activeScript && (
                    <span className={`script-dropdown-type type-${activeScript.type}`}>
                      {activeScript.type}
                    </span>
                  )}
                  <ChevronDown size={14} className={`script-dropdown-arrow ${scriptDropdownOpen ? 'open' : ''}`} />
                </button>

                {scriptDropdownOpen && (
                  <div className="script-dropdown-menu">
                    {scripts.length === 0 ? (
                      <div className="script-dropdown-empty">
                        No scripts available. Go to Scripts to create one.
                      </div>
                    ) : (
                      scripts.map(script => (
                        <button
                          key={script.id}
                          className={`script-dropdown-item ${activeScriptId === script.id ? 'active' : ''}`}
                          onClick={() => {
                            setActiveScriptId(script.id);
                            setScriptDropdownOpen(false);
                          }}
                        >
                          <span className="script-dropdown-item-name">{script.name}</span>
                          <span className={`script-dropdown-item-type type-${script.type}`}>
                            {script.type}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {!viewNeedsScript && (
              <span className="toolbar-title">Scripts Management</span>
            )}
          </div>

          <div className="toolbar-right">
            <button
              className="toolbar-icon-btn"
              onClick={() => setShowSettings(true)}
              title="Settings (Export/Import Workspace)"
            >
              <Settings size={18} />
            </button>
            <button
              className="toolbar-icon-btn"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            {theme === 'dark' && (
              <button
                className="toolbar-icon-btn"
                onClick={toggleDarkThemeVariant}
                title={darkThemeVariant === 'slate' ? 'Switch to VS Code Gray' : 'Switch to Slate'}
                style={{
                  color: darkThemeVariant === 'vscode-gray' ? '#569cd6' : undefined
                }}
              >
                <Palette size={18} />
              </button>
            )}
            <button
              className="toolbar-icon-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Show Sidebar' : 'Hide Sidebar'}
            >
              {sidebarCollapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className={`content-area ${view === 'erd' ? 'content-area-erd' : ''} ${view === 'scripts' ? 'content-area-scripts' : ''} ${view === 'mapping' ? 'content-area-mapping' : ''}`}>
          {renderContent()}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
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
          onClick={() => setShowSettings(false)}
        >
          <div
            style={{
              backgroundColor: theme === 'dark'
                ? (darkThemeVariant === 'vscode-gray' ? '#1e1e1e' : '#1e293b')
                : '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{
              margin: '0 0 24px 0',
              color: theme === 'dark' ? '#e4e4e7' : '#18181b',
              fontSize: '24px',
              fontWeight: 600,
            }}>
              Workspace Settings
            </h2>

            <p style={{
              margin: '0 0 24px 0',
              color: theme === 'dark' ? '#a1a1aa' : '#71717a',
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

              <button
                className="btn"
                onClick={() => setShowSettings(false)}
                style={{
                  marginTop: '8px',
                  fontSize: '14px',
                  padding: '10px 16px',
                }}
              >
                Close
              </button>
            </div>

            <div style={{
              marginTop: '24px',
              padding: '12px',
              borderRadius: '6px',
              backgroundColor: theme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
              border: `1px solid ${theme === 'dark' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)'}`,
            }}>
              <p style={{
                margin: 0,
                fontSize: '12px',
                color: theme === 'dark' ? '#94a3b8' : '#64748b',
                lineHeight: '1.5',
              }}>
                <strong>Note:</strong> The exported file includes all your work and can be used as a backup or to transfer your workspace to another device.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
