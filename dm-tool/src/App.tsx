import { useState, useEffect, useCallback } from 'react';
import { Script, ScriptType, AppView, Table } from './types';
import { loadScripts, saveScripts, generateId, loadTheme, saveTheme } from './utils/storage';
import { parseScript } from './utils/parsers';
import Sidebar from './components/Sidebar';
import DataDictionary from './components/DataDictionary';
import SchemaCompare from './components/SchemaCompare';
import ERDViewer from './components/ERDViewer';
import CreateScriptModal from './components/CreateScriptModal';
import { Database, GitCompare, Share2, Sun, Moon } from 'lucide-react';

export default function App() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [activeScriptId, setActiveScriptId] = useState<string | null>(null);
  const [view, setView] = useState<AppView>('dictionary');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load initial data
  useEffect(() => {
    const savedScripts = loadScripts();
    const savedTheme = loadTheme();
    setScripts(savedScripts);
    setTheme(savedTheme);

    if (savedScripts.length > 0) {
      setActiveScriptId(savedScripts[0].id);
    }

    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
    }
  }, []);

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
    setShowCreateModal(false);
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
    if (!confirm('Delete this script?')) return;

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
    document.body.classList.toggle('dark-theme');
  }, [theme]);

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

  // Render main content based on view
  const renderContent = () => {
    if (!activeScript) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Database size={48} />
          </div>
          <div className="empty-state-title">No Script Selected</div>
          <div className="empty-state-text">
            Create a new script or select an existing one from the sidebar.
          </div>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => setShowCreateModal(true)}>
            Create Script
          </button>
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
          />
        );
      case 'compare':
        return <SchemaCompare scripts={scripts} activeScript={activeScript} />;
      case 'erd':
        return <ERDViewer tables={activeScript.data.targets} isDarkTheme={theme === 'dark'} scriptId={activeScript.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <Sidebar
        scripts={scripts}
        activeScriptId={activeScriptId}
        activeScript={activeScript}
        view={view}
        searchTerm={searchTerm}
        selectedTableId={selectedTableId}
        onSelectScript={setActiveScriptId}
        onSelectView={setView}
        onSelectTable={setSelectedTableId}
        onSearchChange={setSearchTerm}
        onCreateScript={() => setShowCreateModal(true)}
        onDeleteScript={deleteScript}
      />

      <div className="main-container">
        <div className="toolbar">
          <div className="toolbar-group">
            <button
              className={`btn ${view === 'dictionary' ? 'btn-primary' : ''}`}
              onClick={() => setView('dictionary')}
            >
              <Database size={16} />
              Dictionary
            </button>
            <button
              className={`btn ${view === 'compare' ? 'btn-primary' : ''}`}
              onClick={() => setView('compare')}
            >
              <GitCompare size={16} />
              Compare
            </button>
            <button
              className={`btn ${view === 'erd' ? 'btn-primary' : ''}`}
              onClick={() => setView('erd')}
            >
              <Share2 size={16} />
              ERD
            </button>
          </div>

          <div className="toolbar-group">
            {activeScript && (
              <span className="toolbar-title">
                {activeScript.name} ({activeScript.type.toUpperCase()})
              </span>
            )}
            <button className="btn" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </div>

        <div className="content-area">
          {renderContent()}
        </div>
      </div>

      {showCreateModal && (
        <CreateScriptModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createScript}
        />
      )}
    </div>
  );
}
