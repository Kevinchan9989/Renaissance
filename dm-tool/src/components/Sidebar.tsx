import { Script, AppView, Table } from '../types';
import { Database, GitCompare, Share2, Plus, Trash2, ChevronDown, Search } from 'lucide-react';

interface SidebarProps {
  scripts: Script[];
  activeScriptId: string | null;
  activeScript: Script | null;
  view: AppView;
  searchTerm: string;
  selectedTableId: number | null;
  onSelectScript: (id: string) => void;
  onSelectView: (view: AppView) => void;
  onSelectTable: (id: number | null) => void;
  onSearchChange: (term: string) => void;
  onCreateScript: () => void;
  onDeleteScript: (id: string) => void;
}

export default function Sidebar({
  scripts,
  activeScriptId,
  activeScript,
  view,
  searchTerm,
  selectedTableId,
  onSelectScript,
  onSelectView,
  onSelectTable,
  onSearchChange,
  onCreateScript,
  onDeleteScript
}: SidebarProps) {
  // Group tables by schema
  const getTablesBySchema = () => {
    if (!activeScript) return {};

    const groups: Record<string, Table[]> = {};
    const tables = activeScript.data.targets || [];

    for (const table of tables) {
      const schema = table.schema || '(No Schema)';
      if (!groups[schema]) groups[schema] = [];
      groups[schema].push(table);
    }

    // Sort tables within each schema
    for (const schema of Object.keys(groups)) {
      groups[schema].sort((a, b) => a.tableName.localeCompare(b.tableName));
    }

    return groups;
  };

  const tablesBySchema = getTablesBySchema();

  // Filter tables by search term
  const filterTables = (tables: Table[]) => {
    if (!searchTerm) return tables;
    const term = searchTerm.toLowerCase();
    return tables.filter(t =>
      t.tableName.toLowerCase().includes(term) ||
      t.schema.toLowerCase().includes(term)
    );
  };

  // Toggle schema collapse
  const toggleSchema = (e: React.MouseEvent) => {
    const header = e.currentTarget as HTMLElement;
    const list = header.nextElementSibling as HTMLElement;
    const arrow = header.querySelector('.schema-arrow') as HTMLElement;

    if (list) list.classList.toggle('hidden');
    if (arrow) arrow.classList.toggle('collapsed');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>Renaissance DM</h1>
      </div>

      {/* Navigation */}
      <div className="sidebar-nav">
        <button
          className={`nav-btn ${view === 'dictionary' ? 'active' : ''}`}
          onClick={() => onSelectView('dictionary')}
        >
          <Database size={16} />
          Data Dictionary
        </button>
        <button
          className={`nav-btn ${view === 'compare' ? 'active' : ''}`}
          onClick={() => onSelectView('compare')}
        >
          <GitCompare size={16} />
          Schema Compare
        </button>
        <button
          className={`nav-btn ${view === 'erd' ? 'active' : ''}`}
          onClick={() => onSelectView('erd')}
        >
          <Share2 size={16} />
          ERD Viewer
        </button>
      </div>

      {/* Scripts Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Scripts</span>
          <button
            className="btn btn-sm btn-primary"
            onClick={onCreateScript}
            style={{ padding: '2px 8px' }}
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Script List */}
      <div style={{ maxHeight: '150px', overflowY: 'auto', borderBottom: '1px solid #34495e' }}>
        {scripts.length === 0 ? (
          <div style={{ padding: '16px', color: '#7f8c8d', fontSize: '12px', textAlign: 'center' }}>
            No scripts yet
          </div>
        ) : (
          scripts.map(script => (
            <div
              key={script.id}
              className={`script-item ${activeScriptId === script.id ? 'active' : ''}`}
              onClick={() => onSelectScript(script.id)}
            >
              <div>
                <div className="script-item-name">{script.name}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="script-item-type">{script.type}</span>
                <button
                  className="btn btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteScript(script.id);
                  }}
                  style={{ padding: '2px 4px', background: 'transparent', border: 'none', color: '#e74c3c' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Search Box */}
      {activeScript && view === 'dictionary' && (
        <div className="search-box">
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#95a5a6' }} />
            <input
              type="text"
              className="search-input"
              placeholder="Search tables..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              style={{ paddingLeft: '32px' }}
            />
          </div>
        </div>
      )}

      {/* Table List (only show in dictionary view) */}
      {activeScript && view === 'dictionary' && (
        <div className="script-list">
          {Object.keys(tablesBySchema).sort().map(schema => {
            const filteredTables = filterTables(tablesBySchema[schema]);
            if (filteredTables.length === 0) return null;

            return (
              <div key={schema} className="schema-block">
                <div className="schema-header" onClick={toggleSchema}>
                  <span className="schema-header-title">{schema}</span>
                  <ChevronDown size={14} className="schema-arrow" />
                </div>
                <ul className="table-list">
                  {filteredTables.map(table => (
                    <li
                      key={table.id}
                      className={`table-item ${selectedTableId === table.id ? 'active' : ''}`}
                      onClick={() => onSelectTable(table.id)}
                    >
                      {table.tableName}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
