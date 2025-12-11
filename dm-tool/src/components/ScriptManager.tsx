import { useState, useEffect, useRef } from 'react';
import { Script, ScriptType } from '../types';
import { parseScript } from '../utils/parsers';
import CodeEditor from './CodeEditor';
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
  Download
} from 'lucide-react';

interface ScriptManagerProps {
  scripts: Script[];
  activeScriptId: string | null;
  onSelectScript: (id: string) => void;
  onCreateScript: (name: string, type: ScriptType, content: string) => void;
  onUpdateScript: (id: string, updates: Partial<Script>) => void;
  onDeleteScript: (id: string) => void;
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
  isDarkTheme = false,
  darkThemeVariant = 'slate'
}: ScriptManagerProps) {
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(activeScriptId);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editName, setEditName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<ScriptType>('postgresql');
  const [newContent, setNewContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Save edit
  const handleSaveEdit = () => {
    if (!selectedScript) return;

    const data = parseScript(editContent, selectedScript.type);
    onUpdateScript(selectedScript.id, {
      name: editName,
      rawContent: editContent,
      data
    });
    setIsEditing(false);
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent('');
    setEditName('');
  };

  // Create new script
  const handleCreate = () => {
    if (!newName.trim() || !newContent.trim()) {
      alert('Please provide both name and content');
      return;
    }
    onCreateScript(newName.trim(), newType, newContent);
    setIsCreating(false);
    setNewName('');
    setNewType('postgresql');
    setNewContent('');
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

  return (
    <div className="script-manager">
      {/* Left Panel - Script List */}
      <div className="script-manager-list">
        <div className="script-manager-list-header">
          <h3>Scripts ({scripts.length})</h3>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setIsCreating(true)}
          >
            <Plus size={14} />
            New
          </button>
        </div>

        <div className="script-manager-items">
          {scripts.length === 0 ? (
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
            scripts.map(script => {
              const typeBadge = getTypeBadgeColor(script.type);
              const isSelected = selectedScriptId === script.id;

              return (
                <div
                  key={script.id}
                  className={`script-manager-item ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectScript(script.id)}
                >
                  <div className="script-manager-item-content">
                    <div className="script-manager-item-header">
                      <span className="script-manager-item-name">{script.name}</span>
                      <span
                        className="script-manager-item-type"
                        style={{ backgroundColor: typeBadge.bg, color: typeBadge.color }}
                      >
                        {script.type}
                      </span>
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
          )}
        </div>
      </div>

      {/* Right Panel - Preview/Edit */}
      <div className="script-manager-detail">
        {isCreating ? (
          /* Create New Script Form */
          <div className="script-manager-create">
            <div className="script-manager-detail-header">
              <h3>Create New Script</h3>
              <div className="script-manager-actions">
                <button className="btn btn-sm" onClick={() => setIsCreating(false)}>
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
                <div className="form-group" style={{ flex: 2 }}>
                  <label className="form-label">Script Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g., User Management Tables"
                  />
                </div>
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
              </div>

              <div className="form-group" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label className="form-label">DDL / Schema Content</label>
                <CodeEditor
                  value={newContent}
                  onChange={setNewContent}
                  language={newType}
                  isDarkTheme={isDarkTheme}
                  darkThemeVariant={darkThemeVariant}
                  placeholder="Paste your CREATE TABLE statements here..."
                  minHeight="300px"
                />
              </div>
            </div>
          </div>
        ) : selectedScript ? (
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
                <h3>{selectedScript.name}</h3>
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
                />
              )}
            </div>
          </>
        ) : (
          /* No Script Selected */
          <div className="script-manager-empty-detail">
            <FileCode size={48} />
            <h3>Select a Script</h3>
            <p>Choose a script from the list to view or edit it</p>
          </div>
        )}
      </div>
    </div>
  );
}
