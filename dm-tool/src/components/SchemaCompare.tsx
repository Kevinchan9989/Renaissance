import { useState, useMemo, useEffect } from 'react';
import { Script, Table, TableDiff, ColumnDiff } from '../types';
import { compareTables, tablesToMap } from '../utils/compare';
import { parseScript } from '../utils/parsers';
import {
  Play,
  ChevronDown,
  ChevronRight,
  Search,
  AlertCircle,
  CheckCircle,
  MinusCircle,
  PlusCircle,
  Info,
  GitCompare,
  Database,
  ArrowRight,
  Filter,
  FileCode
} from 'lucide-react';

interface SchemaCompareProps {
  scripts: Script[];
  activeScript: Script;
}

type FilterType = 'all' | 'modified' | 'added' | 'deleted' | 'identical';

export default function SchemaCompare({ scripts, activeScript }: SchemaCompareProps) {
  const [sourceId, setSourceId] = useState<string>(activeScript.id);
  const [targetId, setTargetId] = useState<string>('');
  const [targetContent, setTargetContent] = useState('');
  const [useCustomTarget, setUseCustomTarget] = useState(true);
  const [results, setResults] = useState<Record<string, TableDiff> | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSchemas, setExpandedSchemas] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [targetDropdownOpen, setTargetDropdownOpen] = useState(false);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.compare-dropdown')) {
        setSourceDropdownOpen(false);
        setTargetDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Get source/target scripts
  const sourceScript = scripts.find(s => s.id === sourceId);
  const targetScript = scripts.find(s => s.id === targetId);

  // Run comparison
  const runCompare = () => {
    if (!sourceScript) return;

    let targetTables: Table[];

    if (useCustomTarget) {
      if (!targetContent.trim()) {
        alert('Please enter target DDL/DBML');
        return;
      }
      const parsed = parseScript(targetContent, sourceScript.type);
      targetTables = parsed.targets;
    } else {
      if (!targetScript) {
        alert('Please select a target script');
        return;
      }
      targetTables = targetScript.data.targets;
    }

    const sourceMap = tablesToMap(sourceScript.data.targets);
    const targetMap = tablesToMap(targetTables);
    const diff = compareTables(sourceMap, targetMap);

    setResults(diff);
    setSelectedTable(null);

    // Expand all schemas by default
    const schemas = new Set<string>();
    for (const [, d] of Object.entries(diff)) {
      const table = d.src || d.tgt;
      schemas.add(table?.schema || '(Default)');
    }
    setExpandedSchemas(schemas);
  };

  // Summary stats
  const stats = useMemo(() => {
    if (!results) return null;

    let identical = 0, modified = 0, added = 0, deleted = 0, softMatch = 0;

    for (const diff of Object.values(results)) {
      switch (diff.status) {
        case 'IDENTICAL': identical++; break;
        case 'MODIFIED': modified++; break;
        case 'ADDED': added++; break;
        case 'MISSING': deleted++; break;
        case 'SOFT_MATCH': softMatch++; break;
      }
    }

    return { identical, modified, added, deleted, softMatch, total: Object.keys(results).length };
  }, [results]);

  // Group and filter results by schema
  const groupedResults = useMemo(() => {
    if (!results) return {};

    const groups: Record<string, { key: string; diff: TableDiff }[]> = {};

    for (const [key, diff] of Object.entries(results)) {
      const table = diff.src || diff.tgt;
      const schema = table?.schema || '(Default)';

      if (!groups[schema]) groups[schema] = [];

      // Filter by search
      if (searchTerm && !key.toLowerCase().includes(searchTerm.toLowerCase())) {
        continue;
      }

      // Filter by status
      if (statusFilter !== 'all') {
        const statusMap: Record<FilterType, string[]> = {
          all: [],
          modified: ['MODIFIED', 'SOFT_MATCH'],
          added: ['ADDED'],
          deleted: ['MISSING'],
          identical: ['IDENTICAL']
        };
        if (!statusMap[statusFilter].includes(diff.status)) continue;
      }

      groups[schema].push({ key, diff });
    }

    // Sort within groups and remove empty groups
    const filtered: Record<string, { key: string; diff: TableDiff }[]> = {};
    for (const schema of Object.keys(groups)) {
      if (groups[schema].length > 0) {
        groups[schema].sort((a, b) => a.key.localeCompare(b.key));
        filtered[schema] = groups[schema];
      }
    }

    return filtered;
  }, [results, searchTerm, statusFilter]);

  // Toggle schema expand/collapse
  const toggleSchema = (schema: string) => {
    const newExpanded = new Set(expandedSchemas);
    if (newExpanded.has(schema)) {
      newExpanded.delete(schema);
    } else {
      newExpanded.add(schema);
    }
    setExpandedSchemas(newExpanded);
  };

  // Get status icon
  const getStatusIcon = (status: string, size = 14) => {
    switch (status) {
      case 'MISSING': return <MinusCircle size={size} className="status-icon status-deleted" />;
      case 'ADDED': return <PlusCircle size={size} className="status-icon status-added" />;
      case 'MODIFIED': return <AlertCircle size={size} className="status-icon status-modified" />;
      case 'SOFT_MATCH': return <Info size={size} className="status-icon status-soft" />;
      default: return <CheckCircle size={size} className="status-icon status-ok" />;
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'MISSING': return 'Deleted';
      case 'ADDED': return 'New';
      case 'MODIFIED': return 'Modified';
      case 'SOFT_MATCH': return 'Soft Match';
      default: return 'Identical';
    }
  };

  // Render selected table details
  const renderDetails = () => {
    if (!selectedTable || !results) return null;

    const diff = results[selectedTable];
    if (!diff) return null;

    const { status, src, tgt, details } = diff;

    return (
      <div className="compare-details">
        <div className="compare-details-header">
          <h3>{selectedTable}</h3>
          <span className={`compare-status-badge status-${status.toLowerCase()}`}>
            {getStatusIcon(status)}
            {getStatusLabel(status)}
          </span>
        </div>

        <div className="compare-details-content">
          {status === 'IDENTICAL' && (
            <div className="compare-message compare-message-info">
              <CheckCircle size={18} />
              <span>Tables are identical. No differences found.</span>
            </div>
          )}

          {status === 'MISSING' && (
            <>
              <div className="compare-message compare-message-error">
                <MinusCircle size={18} />
                <span>This table exists in Source but was deleted in Target.</span>
              </div>
              {src && renderTableStructure(src, 'Source Structure')}
            </>
          )}

          {status === 'ADDED' && (
            <>
              <div className="compare-message compare-message-success">
                <PlusCircle size={18} />
                <span>This table is new in Target (not in Source).</span>
              </div>
              {tgt && renderTableStructure(tgt, 'Target Structure')}
            </>
          )}

          {(status === 'MODIFIED' || status === 'SOFT_MATCH') && details && (
            <>
              {details.pkDiff && (
                <div className="compare-message compare-message-warning">
                  <AlertCircle size={18} />
                  <span>
                    <strong>Primary Key Mismatch:</strong>{' '}
                    Source [{src?.constraints.find(c => c.type === 'Primary Key')?.localCols || 'none'}] vs{' '}
                    Target [{tgt?.constraints.find(c => c.type === 'Primary Key')?.localCols || 'none'}]
                  </span>
                </div>
              )}
              {renderDiffTable(details.changes, src, tgt)}
            </>
          )}
        </div>
      </div>
    );
  };

  // Render table structure
  const renderTableStructure = (table: Table, title: string) => (
    <div className="compare-table-section">
      <h4>{title}</h4>
      <table className="compare-table">
        <thead>
          <tr>
            <th>Column</th>
            <th>Type</th>
            <th>Nullable</th>
          </tr>
        </thead>
        <tbody>
          {table.columns.map((col, i) => {
            const isPk = table.constraints.some(c =>
              c.type === 'Primary Key' &&
              c.localCols.split(',').map(s => s.trim().toUpperCase()).includes(col.name.toUpperCase())
            );

            return (
              <tr key={i}>
                <td className="column-name">
                  {col.name}
                  {isPk && <span className="key-badge pk">PK</span>}
                </td>
                <td className="column-type">{col.type}</td>
                <td className="column-nullable">{col.nullable === 'Yes' ? 'NULL' : 'NOT NULL'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // Render diff table
  const renderDiffTable = (changes: ColumnDiff[], src: Table | null, tgt: Table | null) => {
    const srcPks = src?.constraints.find(c => c.type === 'Primary Key')?.localCols.split(',').map(s => s.trim().toUpperCase()) || [];
    const tgtPks = tgt?.constraints.find(c => c.type === 'Primary Key')?.localCols.split(',').map(s => s.trim().toUpperCase()) || [];

    return (
      <div className="compare-table-section">
        <h4>Column Comparison</h4>
        <table className="compare-table compare-diff-table">
          <thead>
            <tr>
              <th style={{ width: '20%' }}>Column</th>
              <th style={{ width: '30%' }}>Source</th>
              <th style={{ width: '30%' }}>Target</th>
              <th style={{ width: '20%' }}>Change</th>
            </tr>
          </thead>
          <tbody>
            {changes.map((row, i) => {
              const srcIsPk = srcPks.includes(row.col.toUpperCase());
              const tgtIsPk = tgtPks.includes(row.col.toUpperCase());

              return (
                <tr key={i} className={`diff-row diff-row-${row.type.toLowerCase()}`}>
                  <td className="column-name">
                    <strong>{row.col}</strong>
                  </td>
                  <td>
                    {row.s ? (
                      <div className="column-info">
                        {srcIsPk && <span className="key-badge pk">PK</span>}
                        <span className={row.type === 'MODIFIED' && row.t && row.s.type !== row.t.type ? 'diff-highlight' : ''}>
                          {row.s.type}
                        </span>
                        <span className={`nullable-badge ${row.type === 'MODIFIED' && row.t && row.s.nullable !== row.t.nullable ? 'diff-highlight' : ''}`}>
                          {row.s.nullable === 'Yes' ? 'NULL' : 'NOT NULL'}
                        </span>
                      </div>
                    ) : (
                      <span className="column-missing">—</span>
                    )}
                  </td>
                  <td>
                    {row.t ? (
                      <div className="column-info">
                        {tgtIsPk && <span className="key-badge pk">PK</span>}
                        <span className={row.type === 'MODIFIED' && row.s && row.s.type !== row.t.type ? 'diff-highlight' : ''}>
                          {row.t.type}
                        </span>
                        <span className={`nullable-badge ${row.type === 'MODIFIED' && row.s && row.s.nullable !== row.t.nullable ? 'diff-highlight' : ''}`}>
                          {row.t.nullable === 'Yes' ? 'NULL' : 'NOT NULL'}
                        </span>
                      </div>
                    ) : (
                      <span className="column-missing">—</span>
                    )}
                  </td>
                  <td>
                    <span className={`change-badge change-${row.type.toLowerCase()}`}>
                      {row.type === 'SAME' ? 'Unchanged' :
                       row.type === 'SOFT' ? 'Soft Match' :
                       row.type === 'MODIFIED' ? 'Modified' :
                       row.type === 'ADDED' ? 'Added' : 'Deleted'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Total filtered count
  const filteredCount = useMemo(() => {
    return Object.values(groupedResults).reduce((sum, arr) => sum + arr.length, 0);
  }, [groupedResults]);

  return (
    <div className="schema-compare">
      {/* Left Panel - Configuration & Results List */}
      <div className={`compare-sidebar ${results ? 'has-results' : ''}`}>
        {/* Header */}
        <div className="compare-header">
          <GitCompare size={20} />
          <span>Schema Compare</span>
        </div>

        {/* Source/Target Selection */}
        <div className="compare-config">
          {/* Source Selection */}
          <div className="compare-source-target">
            <div className="compare-endpoint">
              <div className="compare-endpoint-label">
                <Database size={14} />
                <span>Source</span>
              </div>
              <div className="compare-dropdown">
                <button
                  className="compare-dropdown-trigger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSourceDropdownOpen(!sourceDropdownOpen);
                    setTargetDropdownOpen(false);
                  }}
                >
                  <Database size={14} />
                  <span className="compare-dropdown-label">
                    {sourceScript?.name || 'Select source...'}
                  </span>
                  {sourceScript && (
                    <span className={`compare-dropdown-type type-${sourceScript.type}`}>
                      {sourceScript.type}
                    </span>
                  )}
                  <ChevronDown size={14} className={`compare-dropdown-arrow ${sourceDropdownOpen ? 'open' : ''}`} />
                </button>
                {sourceDropdownOpen && (
                  <div className="compare-dropdown-menu">
                    {scripts.map(s => (
                      <button
                        key={s.id}
                        className={`compare-dropdown-item ${sourceId === s.id ? 'active' : ''}`}
                        onClick={() => {
                          setSourceId(s.id);
                          setSourceDropdownOpen(false);
                        }}
                      >
                        <span className="compare-dropdown-item-name">{s.name}</span>
                        <span className={`compare-dropdown-item-type type-${s.type}`}>
                          {s.type}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="compare-endpoint-info">
                {sourceScript?.data.targets.length || 0} tables
              </div>
            </div>

            <div className="compare-arrow">
              <ArrowRight size={20} />
            </div>

            <div className="compare-endpoint">
              <div className="compare-endpoint-label">
                <Database size={14} />
                <span>Target</span>
              </div>

              {/* Target Type Toggle */}
              <div className="compare-target-toggle">
                <button
                  className={`toggle-btn ${!useCustomTarget ? 'active' : ''}`}
                  onClick={() => setUseCustomTarget(false)}
                >
                  <FileCode size={12} />
                  Script
                </button>
                <button
                  className={`toggle-btn ${useCustomTarget ? 'active' : ''}`}
                  onClick={() => setUseCustomTarget(true)}
                >
                  Paste DDL
                </button>
              </div>

              {!useCustomTarget ? (
                <>
                  <div className="compare-dropdown">
                    <button
                      className="compare-dropdown-trigger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTargetDropdownOpen(!targetDropdownOpen);
                        setSourceDropdownOpen(false);
                      }}
                    >
                      <Database size={14} />
                      <span className="compare-dropdown-label">
                        {targetScript?.name || 'Select target...'}
                      </span>
                      {targetScript && (
                        <span className={`compare-dropdown-type type-${targetScript.type}`}>
                          {targetScript.type}
                        </span>
                      )}
                      <ChevronDown size={14} className={`compare-dropdown-arrow ${targetDropdownOpen ? 'open' : ''}`} />
                    </button>
                    {targetDropdownOpen && (
                      <div className="compare-dropdown-menu">
                        {scripts.filter(s => s.id !== sourceId).length === 0 ? (
                          <div className="compare-dropdown-empty">
                            No other scripts available
                          </div>
                        ) : (
                          scripts.filter(s => s.id !== sourceId).map(s => (
                            <button
                              key={s.id}
                              className={`compare-dropdown-item ${targetId === s.id ? 'active' : ''}`}
                              onClick={() => {
                                setTargetId(s.id);
                                setTargetDropdownOpen(false);
                              }}
                            >
                              <span className="compare-dropdown-item-name">{s.name}</span>
                              <span className={`compare-dropdown-item-type type-${s.type}`}>
                                {s.type}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                  <div className="compare-endpoint-info">
                    {targetScript?.data.targets.length || 0} tables
                  </div>
                </>
              ) : (
                <textarea
                  className="compare-textarea"
                  value={targetContent}
                  onChange={(e) => setTargetContent(e.target.value)}
                  placeholder={`Paste ${sourceScript?.type.toUpperCase() || 'DDL'} here...`}
                />
              )}
            </div>
          </div>

          <button className="compare-run-btn" onClick={runCompare}>
            <Play size={16} />
            Compare Schemas
          </button>
        </div>

        {/* Results Section */}
        {results && stats && (
          <>
            {/* Summary Stats */}
            <div className="compare-summary">
              <div className="compare-summary-grid">
                <button
                  className={`summary-stat ${statusFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('all')}
                >
                  <span className="stat-value">{stats.total}</span>
                  <span className="stat-label">Total</span>
                </button>
                <button
                  className={`summary-stat stat-modified ${statusFilter === 'modified' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('modified')}
                >
                  <span className="stat-value">{stats.modified + stats.softMatch}</span>
                  <span className="stat-label">Changed</span>
                </button>
                <button
                  className={`summary-stat stat-added ${statusFilter === 'added' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('added')}
                >
                  <span className="stat-value">{stats.added}</span>
                  <span className="stat-label">Added</span>
                </button>
                <button
                  className={`summary-stat stat-deleted ${statusFilter === 'deleted' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('deleted')}
                >
                  <span className="stat-value">{stats.deleted}</span>
                  <span className="stat-label">Deleted</span>
                </button>
                <button
                  className={`summary-stat stat-identical ${statusFilter === 'identical' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('identical')}
                >
                  <span className="stat-value">{stats.identical}</span>
                  <span className="stat-label">Same</span>
                </button>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="compare-filter-bar">
              <div className="compare-search">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Filter tables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {statusFilter !== 'all' && (
                <button className="filter-clear" onClick={() => setStatusFilter('all')}>
                  <Filter size={12} />
                  Clear
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="compare-results-info">
              Showing {filteredCount} of {stats.total} tables
            </div>

            {/* Results List */}
            <div className="compare-results-list">
              {Object.keys(groupedResults).length === 0 ? (
                <div className="compare-no-results">
                  <Search size={24} />
                  <span>No tables match your filter</span>
                </div>
              ) : (
                Object.keys(groupedResults).sort().map(schema => (
                  <div key={schema} className="compare-schema-group">
                    <button
                      className="compare-schema-header"
                      onClick={() => toggleSchema(schema)}
                    >
                      {expandedSchemas.has(schema) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                      <span className="schema-name">{schema}</span>
                      <span className="compare-schema-count">{groupedResults[schema].length}</span>
                    </button>

                    {expandedSchemas.has(schema) && (
                      <div className="compare-schema-tables">
                        {groupedResults[schema].map(({ key, diff }) => (
                          <button
                            key={key}
                            className={`compare-table-item ${selectedTable === key ? 'active' : ''}`}
                            onClick={() => setSelectedTable(key)}
                          >
                            {getStatusIcon(diff.status)}
                            <span className="table-name">{diff.src?.tableName || diff.tgt?.tableName}</span>
                            <span className={`table-status-label status-${diff.status.toLowerCase()}`}>
                              {getStatusLabel(diff.status)}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Right Panel - Details */}
      <div className="compare-main">
        {!results ? (
          <div className="compare-empty">
            <GitCompare size={64} strokeWidth={1} />
            <h3>Compare Database Schemas</h3>
            <p>Select source and target schemas, then click "Compare Schemas" to see differences.</p>
            <div className="compare-help">
              <h4>How it works:</h4>
              <ul>
                <li><strong>Source</strong>: Your baseline/original schema</li>
                <li><strong>Target</strong>: The schema to compare against (script or pasted DDL)</li>
                <li>Compares table structures, columns, types, and constraints</li>
                <li>Handles cross-database type mappings (VARCHAR≈VARCHAR2, NUMBER≈NUMERIC)</li>
              </ul>
            </div>
          </div>
        ) : selectedTable ? (
          renderDetails()
        ) : (
          <div className="compare-empty">
            <GitCompare size={48} />
            <h3>Comparison Complete</h3>
            <p>Select a table from the list to view detailed differences.</p>
          </div>
        )}
      </div>
    </div>
  );
}
