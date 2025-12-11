import { Script, AppView, Table, MappingProject } from '../types';
import { COMPATIBILITY_COLORS } from '../constants/typeMatrix';
import {
  Database,
  GitCompare,
  Share2,
  ChevronDown,
  ChevronRight,
  Search,
  FileCode,
  ArrowRightLeft,
  CheckCircle,
  AlertCircle,
  Info,
  Trash2,
  Download,
  Settings,
  Eye,
} from 'lucide-react';

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
  // Mapping-specific props
  mappingState?: MappingState;
  onMappingSearchChange?: (term: string) => void;
  onSelectMapping?: (id: string | null) => void;
  onToggleMappingTable?: (tableName: string) => void;
  onDeleteMapping?: (id: string) => void;
  onClearMappings?: () => void;
  onShowRulesDialog?: () => void;
  onEditWorkspace?: () => void;
}

export default function Sidebar({
  activeScript,
  view,
  searchTerm,
  selectedTableId,
  onSelectView,
  onSelectTable,
  onSearchChange,
  // Mapping props
  mappingState,
  onMappingSearchChange,
  onSelectMapping,
  onToggleMappingTable,
  // onDeleteMapping - reserved for future individual mapping deletion
  onClearMappings,
  onShowRulesDialog,
  onEditWorkspace,
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

  // Filter tables by search term - includes column name search
  const filterTables = (tables: Table[]) => {
    if (!searchTerm) return tables;
    const term = searchTerm.toLowerCase();
    return tables.filter(t => {
      // Search table name and schema
      if (t.tableName.toLowerCase().includes(term) ||
          t.schema.toLowerCase().includes(term)) {
        return true;
      }

      // Search column names
      return t.columns.some(col => col.name.toLowerCase().includes(term));
    });
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
      {/* Header */}
      <div className="sidebar-header">
        <h1>Renaissance DM</h1>
      </div>

      {/* View Navigation */}
      <div className="sidebar-nav">
        <button
          className={`nav-btn ${view === 'scripts' ? 'active' : ''}`}
          onClick={() => onSelectView('scripts')}
        >
          <FileCode size={16} />
          Scripts
        </button>
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
        <button
          className={`nav-btn ${view === 'mapping' ? 'active' : ''}`}
          onClick={() => onSelectView('mapping')}
        >
          <ArrowRightLeft size={16} />
          Data Mapping
        </button>
      </div>

      {/* Table Search & List (only in dictionary view with active script) */}
      {activeScript && view === 'dictionary' && (
        <>
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
        </>
      )}

      {/* Mapping Controls (only in mapping view with active mapping state) */}
      {view === 'mapping' && mappingState && (
        <>
          {/* Script Info */}
          <div className="sidebar-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                background: '#3b82f6',
                color: '#fff',
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '10px',
                fontWeight: 600,
              }}>SRC</span>
              <span className="sidebar-script-name">
                {mappingState.sourceScript?.name || 'Not selected'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: '#22c55e',
                color: '#fff',
                fontSize: '10px',
                padding: '2px 8px',
                borderRadius: '10px',
                fontWeight: 600,
              }}>TGT</span>
              <span className="sidebar-script-name">
                {mappingState.targetScript?.name || 'Not selected'}
              </span>
            </div>
          </div>

          {/* Mapping Actions */}
          {mappingState.project && (
            <div className="sidebar-section" style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-sm sidebar-mapping-btn"
                onClick={onShowRulesDialog}
                title="View Transformation Rules"
              >
                <Eye size={14} />
                Rules
              </button>
              <button
                className="btn btn-sm sidebar-mapping-btn"
                onClick={onEditWorkspace}
                style={{ flex: 'none' }}
                title="Edit Workspace"
              >
                <Settings size={14} />
              </button>
            </div>
          )}

          {/* Mapping Search */}
          {mappingState.project && mappingState.project.mappings.length > 0 && (
            <div className="search-box">
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#95a5a6' }} />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Filter mappings..."
                  value={mappingState.searchTerm}
                  onChange={(e) => onMappingSearchChange?.(e.target.value)}
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>
          )}

          {/* Mappings List Grouped by Target Table */}
          <div className="script-list">
            {mappingState.project && mappingState.project.mappings.length > 0 ? (
              (() => {
                // Group mappings by TARGET table
                const grouped = new Map<string, typeof mappingState.project.mappings>();
                const searchLower = mappingState.searchTerm.toLowerCase();

                mappingState.project.mappings.forEach(m => {
                  // Filter by search
                  if (searchLower) {
                    const matches =
                      m.sourceTable.toLowerCase().includes(searchLower) ||
                      m.sourceColumn.toLowerCase().includes(searchLower) ||
                      m.targetTable.toLowerCase().includes(searchLower) ||
                      m.targetColumn.toLowerCase().includes(searchLower);
                    if (!matches) return;
                  }

                  // Group by TARGET table
                  if (!grouped.has(m.targetTable)) {
                    grouped.set(m.targetTable, []);
                  }
                  grouped.get(m.targetTable)!.push(m);
                });

                if (grouped.size === 0) {
                  return (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#95a5a6' }}>
                      <Search size={20} style={{ marginBottom: '8px', opacity: 0.5 }} />
                      <div style={{ fontSize: '12px' }}>No mappings match filter</div>
                    </div>
                  );
                }

                return Array.from(grouped.entries()).map(([tableName, mappings]) => (
                  <div key={tableName} className="schema-block">
                    <div
                      className="schema-header"
                      onClick={() => onToggleMappingTable?.(tableName)}
                      style={{ padding: '8px 16px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                        {mappingState.expandedTables.has(tableName) ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        )}
                        <span className="schema-header-title" style={{ fontSize: '11px' }}>{tableName}</span>
                      </div>
                      <span className="mapping-count-badge">
                        {mappings.length}
                      </span>
                    </div>

                    {mappingState.expandedTables.has(tableName) && (
                      <ul className="table-list">
                        {mappings.map(mapping => {
                          const statusColor = COMPATIBILITY_COLORS[mapping.typeCompatibility];
                          return (
                            <li
                              key={mapping.id}
                              className={`table-item ${mappingState.selectedMappingId === mapping.id ? 'active' : ''}`}
                              onClick={() => onSelectMapping?.(mapping.id)}
                              style={{
                                padding: '6px 16px 6px 24px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                              }}
                            >
                              {mapping.typeCompatibility === 'exact' || mapping.typeCompatibility === 'compatible' ? (
                                <CheckCircle size={12} style={{ color: statusColor.stroke, flexShrink: 0 }} />
                              ) : mapping.typeCompatibility === 'needs_conversion' ? (
                                <AlertCircle size={12} style={{ color: statusColor.stroke, flexShrink: 0 }} />
                              ) : (
                                <Info size={12} style={{ color: statusColor.stroke, flexShrink: 0 }} />
                              )}
                              <span style={{ flex: 1, fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {mapping.targetColumn} ← {mapping.sourceTable}.{mapping.sourceColumn}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ));
              })()
            ) : mappingState.project ? (
              <div className="sidebar-empty-text" style={{ padding: '40px 20px', textAlign: 'center' }}>
                <ArrowRightLeft size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <div style={{ fontSize: '12px' }}>No mappings yet</div>
                <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.8 }}>
                  Drag columns in canvas to create mappings
                </div>
              </div>
            ) : (
              <div className="sidebar-empty-text" style={{ padding: '40px 20px', textAlign: 'center' }}>
                <Database size={24} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <div style={{ fontSize: '12px' }}>Select scripts to begin</div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {mappingState.project && mappingState.project.mappings.length > 0 && (
            <div className="sidebar-footer">
              <button
                className="btn btn-sm sidebar-mapping-btn"
                onClick={onClearMappings}
              >
                <Trash2 size={14} />
                Clear
              </button>
              <button
                className="btn btn-sm btn-primary"
                style={{ flex: 1 }}
              >
                <Download size={14} />
                Export
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
