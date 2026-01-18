import { useState, useEffect, useCallback, useRef } from 'react';
import { Script, ScriptType, AppView, Table, MappingProject, FlowchartScript } from './types';
import { loadScripts, saveScripts, generateId, loadTheme, saveTheme, saveMappingProject, loadDarkThemeVariant, saveDarkThemeVariant, DarkThemeVariant, loadWorkspaceFromElectron, getSortedScripts, loadFlowchartScripts, saveFlowchartScripts } from './utils/storage';
import { parseScript, parsePUML } from './utils/parsers';
import Sidebar from './components/Sidebar';
import DataDictionary from './components/DataDictionary';
import SchemaCompare from './components/SchemaCompare';
import ERDViewer from './components/ERDViewer';
import ScriptManager from './components/ScriptManager';
import ColumnMapper, { MappingStateForSidebar } from './components/ColumnMapper';
import FlowchartViewer from './components/FlowchartViewer';
import { Database, PanelLeftClose, PanelLeft, ChevronDown, GripVertical, Settings } from 'lucide-react';
// Storage functions imported for workspace management (used in settings modal)
import { isElectron } from './services/electronStorage';
import { initDebugLogger } from './utils/debugLogger';
import SettingsModal from './components/SettingsModal';

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
  const [flowchartScripts, setFlowchartScripts] = useState<FlowchartScript[]>([]);
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

  // Initialize debug logger on mount
  useEffect(() => {
    initDebugLogger();
    console.log('🚀 Renaissance DM Tool initialized');
  }, []);

  // Load initial data
  useEffect(() => {
    const initializeApp = async () => {
      // Try to load from Electron file first if running in Electron
      if (isElectron()) {
        console.log('🚀 Running in Electron, attempting to load from local file...');
        const loadedFromFile = await loadWorkspaceFromElectron();

        if (loadedFromFile) {
          console.log('✅ Loaded workspace from Electron file');
          // Reload data from localStorage (which was updated by loadWorkspaceFromElectron)
          const savedScripts = loadScripts();
          const savedFlowchartScripts = loadFlowchartScripts();
          const savedTheme = loadTheme();
          const savedVariant = loadDarkThemeVariant();
          setScripts(savedScripts);
          setFlowchartScripts(savedFlowchartScripts);
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
          return;
        }
      }

      // Fallback to loading from localStorage (web mode or no Electron file)
      const savedScripts = loadScripts();
      const savedFlowchartScripts = loadFlowchartScripts();
      const savedTheme = loadTheme();
      const savedVariant = loadDarkThemeVariant();
      setScripts(savedScripts);
      setFlowchartScripts(savedFlowchartScripts);
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
    };

    initializeApp();
  }, []);

  // Listen for storage events to reload scripts when updated
  useEffect(() => {
    const handleStorageEvent = () => {
      const savedScripts = loadScripts();
      setScripts(savedScripts);
    };

    window.addEventListener('storage', handleStorageEvent);
    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
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

  // Flowchart script management
  const createFlowchartScript = useCallback((name: string, content: string) => {
    const data = parsePUML(content);
    const newScript: FlowchartScript = {
      id: generateId(),
      name,
      rawContent: content,
      data,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    const updated = [...flowchartScripts, newScript];
    setFlowchartScripts(updated);
    saveFlowchartScripts(updated);
  }, [flowchartScripts]);

  const updateFlowchartScript = useCallback((id: string, updates: Partial<FlowchartScript>) => {
    const updated = flowchartScripts.map(s => {
      if (s.id === id) {
        return { ...s, ...updates, updatedAt: Date.now() };
      }
      return s;
    });
    setFlowchartScripts(updated);
    saveFlowchartScripts(updated);
  }, [flowchartScripts]);

  const deleteFlowchartScript = useCallback((id: string) => {
    const updated = flowchartScripts.filter(s => s.id !== id);
    setFlowchartScripts(updated);
    saveFlowchartScripts(updated);
  }, [flowchartScripts]);

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


  // Update table data (for inline editing) - supports both targets and sources
  const updateTable = useCallback((tableId: number, updates: Partial<Table>, isSource?: boolean) => {
    if (!activeScript) return;

    if (isSource) {
      // Update in sources array
      const updatedSources = (activeScript.data.sources || []).map(t => {
        if (t.id === tableId) {
          return { ...t, ...updates };
        }
        return t;
      });

      updateScript(activeScript.id, {
        data: { ...activeScript.data, sources: updatedSources }
      });
    } else {
      // Update in targets array (default)
      const updatedTargets = activeScript.data.targets.map(t => {
        if (t.id === tableId) {
          return { ...t, ...updates };
        }
        return t;
      });

      updateScript(activeScript.id, {
        data: { ...activeScript.data, targets: updatedTargets }
      });
    }
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
          flowchartScripts={flowchartScripts}
          onCreateFlowchartScript={createFlowchartScript}
          onUpdateFlowchartScript={updateFlowchartScript}
          onDeleteFlowchartScript={deleteFlowchartScript}
          isDarkTheme={theme === 'dark'}
          darkThemeVariant={darkThemeVariant}
        />
      );
    }

    // Mapping view has its own script selectors
    if (view === 'mapping') {
      const sortedScripts = getSortedScripts(scripts);
      return (
        <ColumnMapper
          scripts={sortedScripts}
          isDarkTheme={theme === 'dark'}
          darkThemeVariant={darkThemeVariant}
          onMappingStateChange={handleMappingStateChange}
        />
      );
    }

    // Flowcharts view - standalone flowchart viewer
    if (view === 'flowcharts') {
      return (
        <FlowchartViewer
          flowchartScripts={flowchartScripts}
          isDarkTheme={theme === 'dark'}
          darkThemeVariant={darkThemeVariant}
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
            scriptName={activeScript.name}
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
              title="Settings"
            >
              <Settings size={18} />
            </button>
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
        <div className={`content-area ${view === 'erd' ? 'content-area-erd' : ''} ${view === 'scripts' ? 'content-area-scripts' : ''} ${view === 'mapping' ? 'content-area-mapping' : ''} ${view === 'flowcharts' ? 'content-area-flowcharts' : ''}`}>
          {renderContent()}
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        theme={theme}
        darkThemeVariant={darkThemeVariant}
        onToggleTheme={toggleTheme}
        onToggleDarkThemeVariant={toggleDarkThemeVariant}
      />
    </div>
  );
}
