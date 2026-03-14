import { useState, useMemo, useEffect, useRef } from 'react';
import { Script, Table, TableDiff, ColumnDiff } from '../types';
import { compareTables, tablesToMap } from '../utils/compare';
import { parseScript } from '../utils/parsers';
import { replaceTableDDL } from '../utils/ddlGenerator';
import DDLDiffView from './DDLDiffView';
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

export interface SchemaCompareCache {
  sourceId: string;
  targetId: string;
  targetContent: string;
  useCustomTarget: boolean;
  results: Record<string, TableDiff> | null;
  selectedTable: string | null;
  searchTerm: string;
  expandedSchemas: string[];
  statusFilter: FilterType;
  detailView: 'diff' | 'ddl';
}

interface SchemaCompareProps {
  scripts: Script[];
  activeScript: Script;
  onUpdateScript?: (scriptId: string, rawContent: string) => void;
  cache?: React.MutableRefObject<SchemaCompareCache | null>;
}

type FilterType = 'all' | 'modified' | 'added' | 'deleted' | 'identical';

export default function SchemaCompare({ scripts, activeScript, onUpdateScript, cache }: SchemaCompareProps) {
  const cached = cache?.current;
  const [sourceId, setSourceId] = useState<string>(cached?.sourceId ?? activeScript.id);
  const [targetId, setTargetId] = useState<string>(cached?.targetId ?? '');
  const [targetContent, setTargetContent] = useState(cached?.targetContent ?? '');
  const [useCustomTarget, setUseCustomTarget] = useState(cached?.useCustomTarget ?? true);
  const [results, setResults] = useState<Record<string, TableDiff> | null>(cached?.results ?? null);
  const [selectedTable, setSelectedTable] = useState<string | null>(cached?.selectedTable ?? null);
  const [searchTerm, setSearchTerm] = useState(cached?.searchTerm ?? '');
  const [expandedSchemas, setExpandedSchemas] = useState<Set<string>>(new Set(cached?.expandedSchemas ?? []));
  const [statusFilter, setStatusFilter] = useState<FilterType>(cached?.statusFilter ?? 'all');
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [targetDropdownOpen, setTargetDropdownOpen] = useState(false);
  const [detailView, setDetailView] = useState<'diff' | 'ddl'>(cached?.detailView ?? 'diff');
  const [ddlVersion, setDdlVersion] = useState(0);

  // Keep a ref of latest state for saving to cache on unmount
  const stateRef = useRef({
    sourceId, targetId, targetContent, useCustomTarget,
    results, selectedTable, searchTerm, expandedSchemas, statusFilter, detailView
  });
  stateRef.current = {
    sourceId, targetId, targetContent, useCustomTarget,
    results, selectedTable, searchTerm, expandedSchemas, statusFilter, detailView
  };

  // Save state to cache on unmount
  useEffect(() => {
    return () => {
      if (cache) {
        const s = stateRef.current;
        cache.current = {
          sourceId: s.sourceId,
          targetId: s.targetId,
          targetContent: s.targetContent,
          useCustomTarget: s.useCustomTarget,
          results: s.results,
          selectedTable: s.selectedTable,
          searchTerm: s.searchTerm,
          expandedSchemas: Array.from(s.expandedSchemas),
          statusFilter: s.statusFilter,
          detailView: s.detailView,
        };
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset detail view when selected table changes
  useEffect(() => {
    setDetailView('diff');
  }, [selectedTable]);

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

  // Core comparison logic — returns diff or null
  const computeComparison = (): Record<string, TableDiff> | null => {
    if (!sourceScript) return null;

    let targetTables: Table[];

    if (useCustomTarget) {
      if (!targetContent.trim()) return null;
      const parsed = parseScript(targetContent, sourceScript.type);
      targetTables = parsed.targets;
    } else {
      if (!targetScript) return null;
      targetTables = targetScript.data.targets;
    }

    const sourceMap = tablesToMap(sourceScript.data.targets);
    const targetMap = tablesToMap(targetTables);
    return compareTables(sourceMap, targetMap);
  };

  // Run comparison (user-initiated — resets selection)
  const runCompare = () => {
    if (!sourceScript) return;

    if (useCustomTarget && !targetContent.trim()) {
      alert('Please enter target DDL/DBML');
      return;
    }
    if (!useCustomTarget && !targetScript) {
      alert('Please select a target script');
      return;
    }

    const diff = computeComparison();
    if (!diff) return;

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

  // Auto-recompare when script data changes (after DDL edit/save) — preserves selection
  const sourceRaw = sourceScript?.rawContent;
  const targetRaw = targetScript?.rawContent;
  useEffect(() => {
    if (!results) return; // only recompare if a comparison was already run
    const diff = computeComparison();
    if (diff) {
      setResults(diff);
      // Keep selectedTable — don't reset it
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceRaw, targetRaw]);

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

  // DDL save handlers — recompare synchronously so preview updates immediately
  const handleSaveSourceDDL = (newDDL: string) => {
    if (!sourceScript || !selectedTable || !results) return;
    const table = results[selectedTable]?.src;
    if (!table) return;
    const updatedRawContent = replaceTableDDL(sourceScript.rawContent, table, newDDL, sourceScript.type);

    // Parse the updated content and recompare immediately
    const newData = parseScript(updatedRawContent, sourceScript.type);
    const sourceMap = tablesToMap(newData.targets);
    let targetTables: Table[];
    if (useCustomTarget) {
      if (!targetContent.trim()) return;
      targetTables = parseScript(targetContent, sourceScript.type).targets;
    } else {
      if (!targetScript) return;
      targetTables = targetScript.data.targets;
    }
    const targetMap = tablesToMap(targetTables);
    const diff = compareTables(sourceMap, targetMap);
    setResults(diff);
    setDdlVersion(v => v + 1);

    // Persist the change
    if (onUpdateScript) {
      onUpdateScript(sourceScript.id, updatedRawContent);
    }
  };

  const handleSaveTargetDDL = (newDDL: string) => {
    if (!targetScript || useCustomTarget || !selectedTable || !results) return;
    const table = results[selectedTable]?.tgt;
    if (!table) return;
    const updatedRawContent = replaceTableDDL(targetScript.rawContent, table, newDDL, targetScript.type);

    // Parse the updated content and recompare immediately
    const newData = parseScript(updatedRawContent, targetScript.type);
    const sourceMap = tablesToMap(sourceScript?.data.targets || []);
    const targetMap = tablesToMap(newData.targets);
    const diff = compareTables(sourceMap, targetMap);
    setResults(diff);
    setDdlVersion(v => v + 1);

    // Persist the change
    if (onUpdateScript) {
      onUpdateScript(targetScript.id, updatedRawContent);
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
          {/* View Toggle */}
          <div className="compare-view-toggle">
            <button
              className={`toggle-btn ${detailView === 'diff' ? 'active' : ''}`}
              onClick={() => setDetailView('diff')}
            >
              <GitCompare size={14} />
              Diff View
            </button>
            <button
              className={`toggle-btn ${detailView === 'ddl' ? 'active' : ''}`}
              onClick={() => setDetailView('ddl')}
            >
              <FileCode size={14} />
              DDL View
            </button>
          </div>
          <span className={`compare-status-badge status-${status.toLowerCase()}`}>
            {getStatusIcon(status)}
            {getStatusLabel(status)}
          </span>
        </div>

        <div className="compare-details-content">
          {detailView === 'diff' ? (
            <>
              {status === 'IDENTICAL' && (
                <>
                  <div className="compare-message compare-message-info">
                    <CheckCircle size={18} />
                    <span>Tables are identical. No differences found.</span>
                  </div>
                  {src && renderDiffTable(
                    src.columns.map(col => ({ col: col.name, type: 'SAME' as const, s: col, t: col })),
                    src, tgt
                  )}
                </>
              )}

              {status === 'MISSING' && (
                <>
                  <div className="compare-message compare-message-error">
                    <MinusCircle size={18} />
                    <span>This table exists in Source but was deleted in Target.</span>
                  </div>
                  {src && renderDiffTable(
                    src.columns.map(col => ({ col: col.name, type: 'SAME' as const, s: col, t: null })),
                    src, null
                  )}
                </>
              )}

              {status === 'ADDED' && (
                <>
                  <div className="compare-message compare-message-success">
                    <PlusCircle size={18} />
                    <span>This table is new in Target (not in Source).</span>
                  </div>
                  {tgt && renderDiffTable(
                    tgt.columns.map(col => ({ col: col.name, type: 'SAME' as const, s: null, t: col })),
                    null, tgt
                  )}
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
            </>
          ) : (
            <DDLDiffView
              key={ddlVersion}
              sourceTable={src || null}
              targetTable={tgt || null}
              scriptType={sourceScript?.type || 'postgresql'}
              targetScriptType={useCustomTarget ? (sourceScript?.type || 'postgresql') : (targetScript?.type || 'postgresql')}
              changes={details?.changes || []}
              pkDiff={details?.pkDiff || false}
              canEditSource={!!onUpdateScript && !!sourceScript}
              canEditTarget={!!onUpdateScript && !useCustomTarget && !!targetScript}
              onSaveSource={handleSaveSourceDDL}
              onSaveTarget={handleSaveTargetDDL}
            />
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

  // Render side-by-side diff table with aligned rows
  const renderDiffTable = (changes: ColumnDiff[], src: Table | null, tgt: Table | null) => {
    const srcPks = src?.constraints.find(c => c.type === 'Primary Key')?.localCols.split(',').map(s => s.trim().toUpperCase()) || [];
    const tgtPks = tgt?.constraints.find(c => c.type === 'Primary Key')?.localCols.split(',').map(s => s.trim().toUpperCase()) || [];

    // Row highlight styles based on change type
    const getRowStyle = (type: string): React.CSSProperties => {
      switch (type) {
        case 'MODIFIED':
        case 'SOFT':
          // Yellow highlight - less bright/more transparent in dark mode
          return { background: 'var(--diff-modified-bg, rgba(234, 179, 8, 0.15))' };
        case 'ADDED':
          // Green for new rows (only in target)
          return { background: 'var(--diff-added-bg, rgba(34, 197, 94, 0.12))' };
        case 'DELETED':
        case 'MISSING':
          // Red for deleted rows (only in source, missing in target)
          return { background: 'var(--diff-deleted-bg, rgba(239, 68, 68, 0.12))' };
        default:
          // SAME - no highlight
          return {};
      }
    };

    return (
      <div className="compare-table-section">
        <h4>Column Comparison (Side-by-Side)</h4>
        <div style={{ display: 'flex', gap: '16px', overflow: 'auto' }}>
          {/* Source Table */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{
              padding: '8px 12px',
              background: 'var(--compare-header-bg, #3b82f6)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '12px',
              borderRadius: '6px 6px 0 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Database size={14} />
              SOURCE: {src?.tableName || 'N/A'}
            </div>
            <table className="compare-table compare-side-table" style={{ tableLayout: 'fixed', width: '100%' }}>
              <colgroup>
                <col style={{ width: '40%' }} />
                <col style={{ width: '35%' }} />
                <col style={{ width: '25%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Type</th>
                  <th>Nullable</th>
                </tr>
              </thead>
              <tbody>
                {changes.map((row, i) => {
                  const srcIsPk = srcPks.includes(row.col.toUpperCase());
                  const hasSource = !!row.s;
                  const rowStyle = getRowStyle(row.type);

                  return (
                    <tr key={i} style={rowStyle}>
                      {hasSource ? (
                        <>
                          <td className="column-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {srcIsPk && <span className="key-badge pk">PK</span>}
                            <strong>{row.col}</strong>
                          </td>
                          <td style={{ fontFamily: 'monospace', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {row.s?.type}
                          </td>
                          <td>
                            <span className="nullable-badge">
                              {row.s?.nullable === 'Yes' ? 'NULL' : 'NOT NULL'}
                            </span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ color: 'var(--text-muted, #9ca3af)', fontStyle: 'italic' }}>—</td>
                          <td style={{ color: 'var(--text-muted, #9ca3af)' }}>—</td>
                          <td style={{ color: 'var(--text-muted, #9ca3af)' }}>—</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Target Table */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{
              padding: '8px 12px',
              background: 'var(--compare-header-tgt-bg, #22c55e)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '12px',
              borderRadius: '6px 6px 0 0',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <Database size={14} />
              TARGET: {tgt?.tableName || 'N/A'}
            </div>
            <table className="compare-table compare-side-table" style={{ tableLayout: 'fixed', width: '100%' }}>
              <colgroup>
                <col style={{ width: '40%' }} />
                <col style={{ width: '35%' }} />
                <col style={{ width: '25%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Type</th>
                  <th>Nullable</th>
                </tr>
              </thead>
              <tbody>
                {changes.map((row, i) => {
                  const tgtIsPk = tgtPks.includes(row.col.toUpperCase());
                  const hasTarget = !!row.t;
                  const rowStyle = getRowStyle(row.type);

                  return (
                    <tr key={i} style={rowStyle}>
                      {hasTarget ? (
                        <>
                          <td className="column-name" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {tgtIsPk && <span className="key-badge pk">PK</span>}
                            <strong>{row.col}</strong>
                          </td>
                          <td style={{ fontFamily: 'monospace', fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {row.t?.type}
                          </td>
                          <td>
                            <span className="nullable-badge">
                              {row.t?.nullable === 'Yes' ? 'NULL' : 'NOT NULL'}
                            </span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td style={{ color: 'var(--text-muted, #9ca3af)', fontStyle: 'italic' }}>—</td>
                          <td style={{ color: 'var(--text-muted, #9ca3af)' }}>—</td>
                          <td style={{ color: 'var(--text-muted, #9ca3af)' }}>—</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          gap: '16px',
          marginTop: '12px',
          padding: '8px 12px',
          background: 'var(--legend-bg, rgba(0,0,0,0.03))',
          borderRadius: '6px',
          fontSize: '11px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--diff-modified-bg, rgba(234, 179, 8, 0.3))' }} />
            <span>Modified</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--diff-added-bg, rgba(34, 197, 94, 0.25))' }} />
            <span>Added (New in Target)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'var(--diff-deleted-bg, rgba(239, 68, 68, 0.25))' }} />
            <span>Deleted (Missing in Target)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: 'transparent', border: '1px solid var(--border-color, #e5e7eb)' }} />
            <span>Identical</span>
          </div>
        </div>
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
