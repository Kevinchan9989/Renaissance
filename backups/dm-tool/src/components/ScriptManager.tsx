import { useState, useEffect, useRef } from 'react';
import { Script, ScriptType, FlowchartScript } from '../types';
import { parseScript, parsePUML } from '../utils/parsers';
import {
  createScriptVersion,
  migrateScriptToVersioning,
  getCurrentVersion
} from '../utils/storage';
import CodeEditor from './CodeEditor';
import { VersionBadge, VersionHistoryPopup } from './versioning';
import SearchOverlay from './SearchOverlay';
import {
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  FileCode,
  Clock,
  ChevronRight,
  Copy,
  Download,
  GitBranch,
  History,
  Workflow
} from 'lucide-react';

interface ScriptManagerProps {
  scripts: Script[];
  activeScriptId: string | null;
  onSelectScript: (id: string) => void;
  onCreateScript: (name: string, type: ScriptType, content: string) => void;
  onUpdateScript: (id: string, updates: Partial<Script>) => void;
  onDeleteScript: (id: string) => void;
  // Flowchart scripts (separate storage)
  flowchartScripts: FlowchartScript[];
  onCreateFlowchartScript: (name: string, content: string) => void;
  onUpdateFlowchartScript: (id: string, updates: Partial<FlowchartScript>) => void;
  onDeleteFlowchartScript: (id: string) => void;
  isDarkTheme?: boolean;
  darkThemeVariant?: 'slate' | 'vscode-gray';
}

export default function ScriptManager({
  scripts,
  activeScriptId,
  onSelectScript,
  onCreateScript,
  onUpdateScript,
  onDeleteScript,
  flowchartScripts,
  onCreateFlowchartScript,
  onUpdateFlowchartScript,
  onDeleteFlowchartScript,
  isDarkTheme = false,
  darkThemeVariant = 'slate'
}: ScriptManagerProps) {
  // View mode: scripts or flowcharts
  const [viewMode, setViewMode] = useState<'scripts' | 'flowcharts'>('scripts');

  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(activeScriptId);
  const [selectedFlowchartId, setSelectedFlowchartId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editName, setEditName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<ScriptType>('postgresql');
  const [newContent, setNewContent] = useState('');
  const [createErrors, setCreateErrors] = useState<{ name?: string; content?: string }>({});
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Versioning state
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Search state
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [searchMatches, setSearchMatches] = useState<Array<{ start: number; end: number }>>([]);

  // Load script order from localStorage
  const [scriptOrder, setScriptOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('dm_tool_script_order');
    return saved ? JSON.parse(saved) : scripts.map(s => s.id);
  });

  // Sort scripts by custom order
  const sortedScripts = [...scripts].sort((a, b) => {
    const indexA = scriptOrder.indexOf(a.id);
    const indexB = scriptOrder.indexOf(b.id);
    // If not in order list, put at end
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const selectedScript = scripts.find(s => s.id === selectedScriptId);

  // Sync with activeScriptId
  useEffect(() => {
    if (activeScriptId && !selectedScriptId) {
      setSelectedScriptId(activeScriptId);
    }
  }, [activeScriptId, selectedScriptId]);

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get script type badge color
  const getTypeBadgeColor = (type: ScriptType) => {
    switch (type) {
      case 'postgresql': return { bg: '#e7f5ff', color: '#1971c2' };
      case 'oracle': return { bg: '#fff4e6', color: '#e67700' };
      case 'dbml': return { bg: '#f3f0ff', color: '#7048e8' };
      default: return { bg: '#f1f3f5', color: '#495057' };
    }
  };

  // Handle script selection
  const handleSelectScript = (id: string) => {
    if (isEditing) {
      if (!confirm('You have unsaved changes. Discard them?')) return;
      setIsEditing(false);
    }
    setSelectedScriptId(id);
    onSelectScript(id);
  };

  // Start editing
  const handleStartEdit = () => {
    if (!selectedScript) return;
    setEditContent(selectedScript.rawContent);
    setEditName(selectedScript.name);
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  // Save edit with auto-versioning (no prompt)
  const handleSaveEdit = () => {
    if (!selectedScript) return;

    const data = parseScript(editContent, selectedScript.type);

    // Migrate script to versioning if not already enabled
    let scriptToUpdate = selectedScript;
    if (!selectedScript.versioningEnabled) {
      scriptToUpdate = migrateScriptToVersioning(selectedScript);
    }

    // Update the script content
    const updatedScript: Partial<Script> = {
      name: editName,
      rawContent: editContent,
      data,
      versioningEnabled: true,
      versions: scriptToUpdate.versions,
      currentVersionId: scriptToUpdate.currentVersionId,
      maxVersions: scriptToUpdate.maxVersions
    };

    // Auto-create a new version (no message prompt)
    const tempScript = { ...scriptToUpdate, ...updatedScript } as Script;
    const versionedScript = createScriptVersion(tempScript);
    updatedScript.versions = versionedScript.versions;
    updatedScript.currentVersionId = versionedScript.currentVersionId;

    onUpdateScript(selectedScript.id, updatedScript);
    setIsEditing(false);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent('');
    setEditName('');
  };

  // Handle new name change with error clearing
  const handleNewNameChange = (value: string) => {
    setNewName(value);
    if (createErrors.name && value.trim()) {
      setCreateErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  // Handle new content change with error clearing
  const handleNewContentChange = (value: string) => {
    setNewContent(value);
    if (createErrors.content && value.trim()) {
      setCreateErrors(prev => ({ ...prev, content: undefined }));
    }
  };

  // Create new script (DDL or Flowchart based on viewMode)
  const handleCreate = () => {
    const errors: { name?: string; content?: string } = {};

    if (!newName.trim()) {
      errors.name = viewMode === 'scripts' ? 'Script name is required' : 'Flowchart name is required';
    }
    if (!newContent.trim()) {
      errors.content = viewMode === 'scripts' ? 'Script content is required' : 'PUML content is required';
    }

    if (Object.keys(errors).length > 0) {
      setCreateErrors(errors);
      return;
    }

    if (viewMode === 'flowcharts') {
      onCreateFlowchartScript(newName.trim(), newContent);
    } else {
      onCreateScript(newName.trim(), newType, newContent);
    }

    setIsCreating(false);
    setNewName('');
    setNewType('postgresql');
    setNewContent('');
    setCreateErrors({});
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (!selectedScript) return;
    await navigator.clipboard.writeText(selectedScript.rawContent);
  };

  // Download script
  const handleDownload = () => {
    if (!selectedScript) return;
    const ext = selectedScript.type === 'dbml' ? 'dbml' : 'sql';
    const blob = new Blob([selectedScript.rawContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedScript.name}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Delete script
  const handleDelete = () => {
    if (!selectedScript) return;
    if (!confirm(`Delete "${selectedScript.name}"? This cannot be undone.`)) return;
    onDeleteScript(selectedScript.id);
    setSelectedScriptId(scripts.length > 1 ? scripts.find(s => s.id !== selectedScript.id)?.id || null : null);
  };

  // Enable versioning for script
  const handleEnableVersioning = () => {
    if (!selectedScript) return;
    const versionedScript = migrateScriptToVersioning(selectedScript);
    onUpdateScript(selectedScript.id, {
      versioningEnabled: versionedScript.versioningEnabled,
      versions: versionedScript.versions,
      currentVersionId: versionedScript.currentVersionId,
      maxVersions: versionedScript.maxVersions
    });
  };

  // Handle drag start
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Reorder scripts
    const newOrder = [...scriptOrder];
    const draggedId = sortedScripts[draggedIndex].id;
    const dropId = sortedScripts[dropIndex].id;

    // Remove dragged item
    const draggedOrderIndex = newOrder.indexOf(draggedId);
    newOrder.splice(draggedOrderIndex, 1);

    // Insert at new position
    const dropOrderIndex = newOrder.indexOf(dropId);
    newOrder.splice(dropOrderIndex, 0, draggedId);

    setScriptOrder(newOrder);
    localStorage.setItem('dm_tool_script_order', JSON.stringify(newOrder));

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Update order when scripts change (new scripts added)
  useEffect(() => {
    const newScriptIds = scripts.map(s => s.id);
    const currentOrder = scriptOrder.filter(id => newScriptIds.includes(id));
    const addedScripts = newScriptIds.filter(id => !scriptOrder.includes(id));

    if (addedScripts.length > 0) {
      const updatedOrder = [...currentOrder, ...addedScripts];
      setScriptOrder(updatedOrder);
      localStorage.setItem('dm_tool_script_order', JSON.stringify(updatedOrder));
    } else if (currentOrder.length !== scriptOrder.length) {
      // Some scripts were deleted
      setScriptOrder(currentOrder);
      localStorage.setItem('dm_tool_script_order', JSON.stringify(currentOrder));
    }
  }, [scripts]);

  // Handle version history panel script update
  const handleVersionHistoryUpdate = (updatedScript: Script) => {
    onUpdateScript(updatedScript.id, {
      versions: updatedScript.versions,
      currentVersionId: updatedScript.currentVersionId,
      rawContent: updatedScript.rawContent,
      data: updatedScript.data
    });
  };

  // Search functionality
  useEffect(() => {
    if (!searchText || !selectedScript) {
      setSearchMatches([]);
      setCurrentMatchIndex(0);
      return;
    }

    const content = isEditing ? editContent : selectedScript.rawContent;
    const matches: Array<{ start: number; end: number }> = [];

    const flags = caseSensitive ? 'g' : 'gi';
    const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedSearch, flags);

    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push({
        start: match.index,
        end: match.index + match[0].length
      });
    }

    setSearchMatches(matches);
    setCurrentMatchIndex(0);
  }, [searchText, caseSensitive, selectedScript, isEditing, editContent]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F or Cmd+F to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setSearchVisible(true);
      }
      // Escape to close search
      if (e.key === 'Escape' && searchVisible) {
        e.preventDefault();
        setSearchVisible(false);
        setSearchText('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchVisible]);

  // Navigate to next match
  const handleNextMatch = () => {
    if (searchMatches.length === 0) return;
    setCurrentMatchIndex((prev) => (prev + 1) % searchMatches.length);
  };

  // Navigate to previous match
  const handlePrevMatch = () => {
    if (searchMatches.length === 0) return;
    setCurrentMatchIndex((prev) => (prev - 1 + searchMatches.length) % searchMatches.length);
  };

  // Reset search when changing scripts
  useEffect(() => {
    setSearchVisible(false);
    setSearchText('');
    setSearchMatches([]);
    setCurrentMatchIndex(0);
  }, [selectedScriptId]);

  return (
    <div className="script-manager">
      {/* Left Panel - Script List */}
      <div className="script-manager-list">
        <div className="script-manager-list-header">
          <h3>
            {viewMode === 'scripts' ? `Scripts (${scripts.length})` : `Flowcharts (${flowchartScripts.length})`}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* View Mode Toggle */}
            <div className="compare-target-toggle" style={{ marginBottom: 0 }}>
              <button
                className={`toggle-btn ${viewMode === 'scripts' ? 'active' : ''}`}
                onClick={() => setViewMode('scripts')}
              >
                <FileCode size={12} />
                Scripts
              </button>
              <button
                className={`toggle-btn ${viewMode === 'flowcharts' ? 'active' : ''}`}
                onClick={() => setViewMode('flowcharts')}
              >
                <Workflow size={12} />
                Flowcharts
              </button>
            </div>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => setIsCreating(true)}
            >
              <Plus size={14} />
              New
            </button>
          </div>
        </div>

        <div className="script-manager-items">
          {viewMode === 'scripts' ? (
            /* DDL Scripts List */
            scripts.length === 0 ? (
              <div className="script-manager-empty">
                <FileCode size={32} />
                <p>No scripts yet</p>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setIsCreating(true)}
                >
                  Create your first script
                </button>
              </div>
            ) : (
              sortedScripts.map((script, index) => {
                const typeBadge = getTypeBadgeColor(script.type);
                const isSelected = selectedScriptId === script.id;
                const currentVersion = getCurrentVersion(script);
                const isDragging = draggedIndex === index;
                const isDragOver = dragOverIndex === index;

                return (
                  <div
                    key={script.id}
                    className={`script-manager-item ${isSelected ? 'active' : ''} ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
                    onClick={() => handleSelectScript(script.id)}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="script-manager-item-content">
                      <div className="script-manager-item-header">
                        <span className="script-manager-item-name">{script.name}</span>
                        <div className="script-manager-item-badges">
                          {script.versioningEnabled && currentVersion && (
                            <span className="script-manager-item-version">
                              v{currentVersion.versionNumber}
                            </span>
                          )}
                          <span
                            className="script-manager-item-type"
                            style={{ backgroundColor: typeBadge.bg, color: typeBadge.color }}
                          >
                            {script.type}
                          </span>
                        </div>
                      </div>
                      <div className="script-manager-item-meta">
                        <Clock size={12} />
                        <span>{formatDate(script.updatedAt)}</span>
                        <span className="script-manager-item-tables">
                          {script.data.targets.length} tables
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="script-manager-item-arrow" />
                  </div>
                );
              })
            )
          ) : (
            /* Flowchart Scripts List */
            flowchartScripts.length === 0 ? (
              <div className="script-manager-empty">
                <Workflow size={32} />
                <p>No flowcharts yet</p>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setIsCreating(true)}
                >
                  Create your first flowchart
                </button>
              </div>
            ) : (
              flowchartScripts.map((flowchart) => {
                const isSelected = selectedFlowchartId === flowchart.id;

                return (
                  <div
                    key={flowchart.id}
                    className={`script-manager-item ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedFlowchartId(flowchart.id);
                      setIsEditing(false);
                    }}
                  >
                    <div className="script-manager-item-content">
                      <div className="script-manager-item-header">
                        <span className="script-manager-item-name">{flowchart.name}</span>
                        <div className="script-manager-item-badges">
                          <span
                            className="script-manager-item-type"
                            style={{ backgroundColor: '#fef3c7', color: '#d97706' }}
                          >
                            PUML
                          </span>
                        </div>
                      </div>
                      <div className="script-manager-item-meta">
                        <Clock size={12} />
                        <span>{formatDate(flowchart.updatedAt)}</span>
                        <span className="script-manager-item-tables">
                          {flowchart.data.nodes.length} nodes
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="script-manager-item-arrow" />
                  </div>
                );
              })
            )
          )}
        </div>
      </div>

      {/* Right Panel - Preview/Edit/Compare */}
      <div className="script-manager-detail">
        {isCreating ? (
          /* Create New Script/Flowchart Form */
          <div className="script-manager-create">
            <div className="script-manager-detail-header">
              <h3>{viewMode === 'scripts' ? 'Create New Script' : 'Create New Flowchart'}</h3>
              <div className="script-manager-actions">
                <button className="btn btn-sm" onClick={() => { setIsCreating(false); setCreateErrors({}); }}>
                  <X size={14} />
                  Cancel
                </button>
                <button className="btn btn-sm btn-success" onClick={handleCreate}>
                  <Save size={14} />
                  Create
                </button>
              </div>
            </div>

            <div className="script-manager-form">
              <div className="form-row">
                <div className="form-group" style={{ flex: viewMode === 'scripts' ? 2 : 1 }}>
                  <label className="form-label">{viewMode === 'scripts' ? 'Script Name' : 'Flowchart Name'}</label>
                  <input
                    type="text"
                    className={`form-input ${createErrors.name ? 'form-input-error' : ''}`}
                    value={newName}
                    onChange={e => handleNewNameChange(e.target.value)}
                    placeholder={viewMode === 'scripts' ? 'e.g., User Management Tables' : 'e.g., Data Migration Flow'}
                  />
                  {createErrors.name && <span className="form-error-message">{createErrors.name}</span>}
                </div>
                {viewMode === 'scripts' && (
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Type</label>
                    <select
                      className="form-select"
                      value={newType}
                      onChange={e => setNewType(e.target.value as ScriptType)}
                    >
                      <option value="postgresql">PostgreSQL</option>
                      <option value="oracle">Oracle</option>
                      <option value="dbml">DBML</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label className="form-label">
                  {viewMode === 'scripts' ? 'DDL / Schema Content' : 'PlantUML Content'}
                </label>
                <div className={createErrors.content ? 'code-editor-error-wrapper' : ''} style={{ flex: 1 }}>
                  <CodeEditor
                    value={newContent}
                    onChange={handleNewContentChange}
                    language={viewMode === 'scripts' ? newType : 'puml'}
                    isDarkTheme={isDarkTheme}
                    darkThemeVariant={darkThemeVariant}
                    placeholder={viewMode === 'scripts'
                      ? 'Paste your CREATE TABLE statements here...'
                      : `@startuml FlowchartName
start
:Step 1;
:Step 2;
if (Condition?) then (yes)
  :Action A;
else (no)
  :Action B;
endif
stop
@enduml`}
                    minHeight="300px"
                  />
                </div>
                {createErrors.content && <span className="form-error-message">{createErrors.content}</span>}
              </div>
            </div>
          </div>
        ) : viewMode === 'scripts' && selectedScript ? (
          /* Script Detail View */
          <>
            <div className="script-manager-detail-header">
              {isEditing ? (
                <input
                  type="text"
                  className="form-input script-manager-name-input"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
              ) : (
                <div className="script-manager-title-row">
                  <h3>{selectedScript.name}</h3>
                  {selectedScript.versioningEnabled && (
                    <VersionBadge
                      script={selectedScript}
                      onClick={() => setShowVersionHistory(true)}
                      size="md"
                    />
                  )}
                </div>
              )}

              <div className="script-manager-actions">
                {isEditing ? (
                  <>
                    <button className="btn btn-sm" onClick={handleCancelEdit}>
                      <X size={14} />
                      Cancel
                    </button>
                    <button className="btn btn-sm btn-success" onClick={handleSaveEdit}>
                      <Save size={14} />
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    {!selectedScript.versioningEnabled && (
                      <button
                        className="btn btn-sm"
                        onClick={handleEnableVersioning}
                        title="Enable version history"
                      >
                        <GitBranch size={14} />
                        Enable Versioning
                      </button>
                    )}
                    {selectedScript.versioningEnabled && (
                      <button
                        className="btn btn-sm"
                        onClick={() => setShowVersionHistory(true)}
                        title="View version history"
                      >
                        <History size={14} />
                      </button>
                    )}
                    <button className="btn btn-sm" onClick={handleCopy} title="Copy to clipboard">
                      <Copy size={14} />
                    </button>
                    <button className="btn btn-sm" onClick={handleDownload} title="Download">
                      <Download size={14} />
                    </button>
                    <button className="btn btn-sm" onClick={handleStartEdit}>
                      <Edit3 size={14} />
                      Edit
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={handleDelete}>
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Script Info Bar */}
            {!isEditing && (
              <div className="script-manager-info">
                <span
                  className="script-manager-type-badge"
                  style={getTypeBadgeColor(selectedScript.type)}
                >
                  {selectedScript.type.toUpperCase()}
                </span>
                <span className="script-manager-info-item">
                  <Clock size={12} />
                  Updated: {formatDate(selectedScript.updatedAt)}
                </span>
                <span className="script-manager-info-item">
                  {selectedScript.data.targets.length} tables
                </span>
                <span className="script-manager-info-item">
                  {selectedScript.rawContent.split('\n').length} lines
                </span>
                {selectedScript.versioningEnabled && selectedScript.versions && (
                  <span className="script-manager-info-item">
                    <GitBranch size={12} />
                    {selectedScript.versions.length} versions
                  </span>
                )}
              </div>
            )}

            {/* Content Area */}
            <div className="script-manager-content">
              {isEditing ? (
                <CodeEditor
                  value={editContent}
                  onChange={setEditContent}
                  language={selectedScript.type}
                  isDarkTheme={isDarkTheme}
                  darkThemeVariant={darkThemeVariant}
                  minHeight="100%"
                  searchText={searchText}
                  searchMatches={searchMatches}
                  currentMatchIndex={currentMatchIndex}
                />
              ) : (
                <CodeEditor
                  value={selectedScript.rawContent}
                  onChange={() => {}}
                  language={selectedScript.type}
                  isDarkTheme={isDarkTheme}
                  darkThemeVariant={darkThemeVariant}
                  readOnly={true}
                  minHeight="100%"
                  searchText={searchText}
                  searchMatches={searchMatches}
                  currentMatchIndex={currentMatchIndex}
                />
              )}

              {/* Search Overlay */}
              {searchVisible && (
                <SearchOverlay
                  searchText={searchText}
                  onSearchChange={setSearchText}
                  currentMatch={currentMatchIndex}
                  totalMatches={searchMatches.length}
                  onNextMatch={handleNextMatch}
                  onPrevMatch={handlePrevMatch}
                  onClose={() => {
                    setSearchVisible(false);
                    setSearchText('');
                  }}
                  caseSensitive={caseSensitive}
                  onToggleCaseSensitive={() => setCaseSensitive(!caseSensitive)}
                />
              )}
            </div>
          </>
        ) : viewMode === 'flowcharts' && selectedFlowchartId ? (
          /* Flowchart Detail View */
          (() => {
            const selectedFlowchart = flowchartScripts.find(f => f.id === selectedFlowchartId);
            if (!selectedFlowchart) return null;

            return (
              <>
                <div className="script-manager-detail-header">
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-input script-manager-name-input"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                    />
                  ) : (
                    <div className="script-manager-title-row">
                      <h3>{selectedFlowchart.name}</h3>
                    </div>
                  )}

                  <div className="script-manager-actions">
                    {isEditing ? (
                      <>
                        <button className="btn btn-sm" onClick={() => {
                          setIsEditing(false);
                          setEditContent('');
                          setEditName('');
                        }}>
                          <X size={14} />
                          Cancel
                        </button>
                        <button className="btn btn-sm btn-success" onClick={() => {
                          const data = parsePUML(editContent);
                          onUpdateFlowchartScript(selectedFlowchart.id, {
                            name: editName,
                            rawContent: editContent,
                            data
                          });
                          setIsEditing(false);
                        }}>
                          <Save size={14} />
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-sm" onClick={async () => {
                          await navigator.clipboard.writeText(selectedFlowchart.rawContent);
                        }} title="Copy to clipboard">
                          <Copy size={14} />
                        </button>
                        <button className="btn btn-sm" onClick={() => {
                          const blob = new Blob([selectedFlowchart.rawContent], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `${selectedFlowchart.name}.puml`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }} title="Download">
                          <Download size={14} />
                        </button>
                        <button className="btn btn-sm" onClick={() => {
                          setEditContent(selectedFlowchart.rawContent);
                          setEditName(selectedFlowchart.name);
                          setIsEditing(true);
                        }}>
                          <Edit3 size={14} />
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => {
                          if (!confirm(`Delete "${selectedFlowchart.name}"? This cannot be undone.`)) return;
                          onDeleteFlowchartScript(selectedFlowchart.id);
                          setSelectedFlowchartId(flowchartScripts.length > 1
                            ? flowchartScripts.find(f => f.id !== selectedFlowchart.id)?.id || null
                            : null);
                        }}>
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Flowchart Info Bar */}
                {!isEditing && (
                  <div className="script-manager-info">
                    <span
                      className="script-manager-type-badge"
                      style={{ backgroundColor: '#fef3c7', color: '#d97706' }}
                    >
                      PUML
                    </span>
                    <span className="script-manager-info-item">
                      <Clock size={12} />
                      Updated: {formatDate(selectedFlowchart.updatedAt)}
                    </span>
                    <span className="script-manager-info-item">
                      {selectedFlowchart.data.nodes.length} nodes
                    </span>
                    <span className="script-manager-info-item">
                      {selectedFlowchart.data.swimlanes.length} swimlanes
                    </span>
                    <span className="script-manager-info-item">
                      {selectedFlowchart.rawContent.split('\n').length} lines
                    </span>
                  </div>
                )}

                {/* Content Area */}
                <div className="script-manager-content">
                  {isEditing ? (
                    <CodeEditor
                      value={editContent}
                      onChange={setEditContent}
                      language="puml"
                      isDarkTheme={isDarkTheme}
                      darkThemeVariant={darkThemeVariant}
                      minHeight="100%"
                    />
                  ) : (
                    <CodeEditor
                      value={selectedFlowchart.rawContent}
                      onChange={() => {}}
                      language="puml"
                      isDarkTheme={isDarkTheme}
                      darkThemeVariant={darkThemeVariant}
                      readOnly={true}
                      minHeight="100%"
                    />
                  )}
                </div>
              </>
            );
          })()
        ) : (
          /* No Script/Flowchart Selected */
          <div className="script-manager-empty-detail">
            {viewMode === 'scripts' ? (
              <>
                <FileCode size={48} />
                <h3>Select a Script</h3>
                <p>Choose a script from the list to view or edit it</p>
              </>
            ) : (
              <>
                <Workflow size={48} />
                <h3>Select a Flowchart</h3>
                <p>Choose a flowchart from the list to view or edit it</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Version History Popup */}
      {showVersionHistory && selectedScript && (
        <VersionHistoryPopup
          script={selectedScript}
          onClose={() => setShowVersionHistory(false)}
          onScriptUpdate={handleVersionHistoryUpdate}
          isDarkTheme={isDarkTheme}
        />
      )}
    </div>
  );
}
