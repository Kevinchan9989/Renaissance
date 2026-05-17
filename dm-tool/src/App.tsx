import { useState, useEffect, useCallback, useRef } from 'react';
import { Script, ScriptType, AppView, Table, MappingProject, FlowchartScript } from './types';
import { loadScripts, saveScripts, generateId, loadTheme, saveTheme, saveMappingProject, loadDarkThemeVariant, saveDarkThemeVariant, DarkThemeVariant, loadWorkspaceFromElectron, getSortedScripts, loadFlowchartScripts, saveFlowchartScripts, flushElectronSaves, initStorage, isSqliteStorageEnabled, ensureSqliteStorageDefault, loadActiveScriptId, saveActiveScriptId } from './utils/storage';
import { parseScript, reparseScript, parsePUML } from './utils/parsers';
import Sidebar from './components/Sidebar';
import DataDictionary from './components/DataDictionary';
import SchemaCompare, { SchemaCompareCache } from './components/SchemaCompare';
import ERDViewer from './components/ERDViewer';
import ScriptManager from './components/ScriptManager';
import ColumnMapper, { MappingStateForSidebar } from './components/ColumnMapper';
import FlowchartViewer from './components/FlowchartViewer';
import { Database, PanelLeftClose, PanelLeft, ChevronDown, GripVertical, Settings } from 'lucide-react';
// Storage functions imported for workspace management (used in settings modal)
import { isElectron, getStorageMtimes } from './services/electronStorage';
import { dbStatus } from './services/dbStorage';
import { initDebugLogger } from './utils/debugLogger';
import SettingsModal from './components/SettingsModal';
import MigrationSplash from './components/MigrationSplash';

// Migration gate states.
//   'checking'  — deciding whether the splash needs to run (typically <50ms)
//   'splash'    — MigrationSplash is rendered; main app is hidden
//   'ready'     — proceed with normal startup
type MigrationGate = 'checking' | 'splash' | 'ready';

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
  // Lazy init: read the persisted active-script id BEFORE the persist effect
  // runs at mount. Otherwise the effect would fire with the initial `null`,
  // call saveActiveScriptId(null) → localStorage.removeItem(), and wipe the
  // saved value before initializeApp ever gets a chance to read it.
  // The id may not yet exist in the loaded scripts; initializeApp validates
  // membership and falls back to scripts[0] if it's stale.
  const [activeScriptId, setActiveScriptId] = useState<string | null>(() => loadActiveScriptId());
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
  const compareCacheRef = useRef<SchemaCompareCache | null>(null);

  // Mapping state for sidebar integration
  const [mappingState, setMappingState] = useState<MappingState | null>(null);

  // Settings modal
  const [showSettings, setShowSettings] = useState(false);

  // SQLite migration gate. Resolves to 'ready' as soon as the app decides
  // whether MigrationSplash should run. Initial render is gated on this
  // so the user never sees a flash of empty workspace before the splash.
  const [migrationGate, setMigrationGate] = useState<MigrationGate>('checking');

  // Initialize debug logger on mount
  useEffect(() => {
    initDebugLogger();
    console.log('🚀 Renaissance DM Tool initialized');
  }, []);

  // Decide whether to show MigrationSplash. Runs once, before the main load.
  // Logic:
  //   - Set the SQLite flag default ON for first-run users (no-op if already set).
  //   - In Electron with the flag ON: open the DB, ask its status.
  //     - DB has scripts → migration already done; gate = 'ready'.
  //     - DB empty + shards exist → first-run migration; gate = 'splash'.
  //     - DB empty + no shards → fresh install; gate = 'ready' (start blank).
  //   - In web mode or with flag OFF: gate = 'ready' immediately.
  //
  // On any error querying the DB (e.g. native module not rebuilt), fall back
  // to 'ready' so the existing shard path keeps working — the splash is a
  // best-effort upgrade, not a hard requirement.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        ensureSqliteStorageDefault();

        if (!isElectron() || !isSqliteStorageEnabled()) {
          if (!cancelled) setMigrationGate('ready');
          return;
        }

        const status = await dbStatus();
        const dbHasData = !!status && (status.scriptCount || 0) > 0;
        if (dbHasData) {
          if (!cancelled) setMigrationGate('ready');
          return;
        }

        const mtimes = await getStorageMtimes();
        const shardsExist = mtimes.shardsMs !== null || mtimes.workspaceMs !== null;

        if (!cancelled) setMigrationGate(shardsExist ? 'splash' : 'ready');
      } catch (err) {
        console.error('[migration-gate] failed to decide; defaulting to ready', err);
        if (!cancelled) setMigrationGate('ready');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Flush any pending shard / consolidated writes before window close so
  // the last edits aren't lost in flight.
  useEffect(() => {
    const handler = () => { flushElectronSaves(); };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  // Persist the active script selection so the same one is restored on the
  // next launch. Single useEffect catches every setActiveScriptId caller —
  // dropdown picker, sidebar list, createScript, deleteScript fallback, etc.
  // — without having to thread a save into each one. Initial mount fires
  // once with the just-loaded id (a no-op rewrite of the same value).
  useEffect(() => {
    saveActiveScriptId(activeScriptId);
  }, [activeScriptId]);

  // Load initial data — gated on migrationGate === 'ready' so the splash
  // (when shown) finishes before we touch the storage layer.
  useEffect(() => {
    if (migrationGate !== 'ready') return;

    const initializeApp = async () => {
      // Hydrate IDB-backed cache for large keys before any sync read
      // (loadScripts, loadFlowchartScripts, loadMappingProjects).
      await initStorage();

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
            // Prefer the last-selected script; if it no longer exists
            // (deleted, renamed, etc.) fall back to the first one.
            const lastActive = loadActiveScriptId();
            const restored = lastActive && savedScripts.some(s => s.id === lastActive)
              ? lastActive
              : savedScripts[0].id;
            setActiveScriptId(restored);
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
        // Same restoration as the Electron branch: last-selected or first.
        const lastActive = loadActiveScriptId();
        const restored = lastActive && savedScripts.some(s => s.id === lastActive)
          ? lastActive
          : savedScripts[0].id;
        setActiveScriptId(restored);
      }

      if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        if (savedVariant === 'vscode-gray') {
          document.body.classList.add('vscode-gray');
        }
      }
    };

    initializeApp();
  }, [migrationGate]);

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

  // Stable callbacks for heavy children. Inline arrows on the JSX would
  // create a new function ref every render of App and defeat React.memo on
  // DataDictionary / ERDViewer — meaning theme toggle, sidebar resize, and
  // every dropdown click would fully re-render those components.
  const handleDictionaryUpdateScript = useCallback(
    (rawContent: string) => {
      if (!activeScript) return;
      const data = reparseScript(rawContent, activeScript.type, activeScript.data);
      updateScript(activeScript.id, { rawContent, data });
    },
    [activeScript, updateScript]
  );

  const handleDictionaryUpdateScriptPartial = useCallback(
    (updates: Partial<Script>) => {
      if (!activeScript) return;
      updateScript(activeScript.id, updates);
    },
    [activeScript, updateScript]
  );

  const handleERDRefresh = useCallback(() => {
    if (!activeScript) return;
    const data = reparseScript(activeScript.rawContent, activeScript.type, activeScript.data);
    updateScript(activeScript.id, { data });
  }, [activeScript, updateScript]);

  const handleSchemaCompareUpdateScript = useCallback(
    (scriptId: string, rawContent: string) => {
      const target = scripts.find(s => s.id === scriptId);
      if (!target) return;
      const data = reparseScript(rawContent, target.type, target.data);
      updateScript(scriptId, { rawContent, data });
    },
    [scripts, updateScript]
  );

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
            onUpdateScript={handleDictionaryUpdateScript}
            onUpdateScriptPartial={handleDictionaryUpdateScriptPartial}
            isDarkTheme={theme === 'dark'}
            darkThemeVariant={darkThemeVariant}
          />
        );
      case 'compare':
        return (
          <SchemaCompare
            scripts={scripts}
            activeScript={activeScript}
            onUpdateScript={handleSchemaCompareUpdateScript}
            cache={compareCacheRef}
          />
        );
      case 'erd':
        return (
          <ERDViewer
            tables={activeScript.data.targets}
            isDarkTheme={theme === 'dark'}
            darkThemeVariant={darkThemeVariant}
            scriptId={activeScript.id}
            scriptName={activeScript.name}
            onRefresh={handleERDRefresh}
          />
        );
      default:
        return null;
    }
  };

  // Check if current view needs a script
  const viewNeedsScript = view !== 'scripts' && view !== 'mapping';

  // Render the splash before the main app when the migration gate has decided
  // a one-shot upgrade is needed. 'checking' renders nothing briefly (typically
  // <50ms while the gate decides) — this matches the existing empty-app loading
  // experience and avoids a flash of "no scripts" before the splash appears.
  if (migrationGate === 'checking') {
    return null;
  }
  if (migrationGate === 'splash') {
    return (
      <MigrationSplash
        isDarkTheme={theme === 'dark'}
        onComplete={() => setMigrationGate('ready')}
      />
    );
  }

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
