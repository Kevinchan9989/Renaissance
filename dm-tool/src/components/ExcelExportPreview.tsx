import { useState, useMemo, useRef, useEffect } from 'react';
import { Table } from '../types';
import { EXCEL_COLUMNS, ExcelColumnKey, exportDataDictionaryToExcel } from '../utils/excelExport';
import { loadExcelExportColumns, saveExcelExportColumns } from '../utils/storage';
import { X, FileDown, Check, Home, ArrowLeft } from 'lucide-react';

interface ExcelExportPreviewProps {
  scriptName: string;
  tables: Array<Table & { isSource?: boolean }>;
  getMappingInfo: (tableName: string, colName: string) => string | null;
  getColumnTags: (table: Table, colName: string) => string[];
  onClose: () => void;
  isDarkTheme?: boolean;
}

// Shared table row renderer for Index page
function IndexTableRow({ t, i, onClick, textPrimary, textSecondary, bg, completedBg, selected, onToggle, isDarkTheme }: {
  t: Table & { isSource?: boolean; _idx: number };
  i: number;
  onClick: () => void;
  textPrimary: string;
  textSecondary: string;
  bg: string;
  completedBg: string;
  selected: boolean;
  onToggle: () => void;
  isDarkTheme?: boolean;
}) {
  const tdStyle = { padding: '5px 12px', fontSize: '11px', border: '1px solid #000', color: textPrimary, backgroundColor: bg };
  return (
    <tr style={{ backgroundColor: t.explanationCompleted ? completedBg : bg, opacity: selected ? 1 : 0.5 }}>
      <td style={{ ...tdStyle, textAlign: 'center' as const, width: '36px' }}>
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          style={{
            width: '14px', height: '14px', cursor: 'pointer',
            accentColor: isDarkTheme ? '#6b7280' : '#4b5563',
          }}
        />
      </td>
      <td style={{ ...tdStyle, color: textSecondary }}>{i + 1}</td>
      <td style={tdStyle}>{t.schema || '-'}</td>
      <td style={{ ...tdStyle }}>
        <button
          onClick={onClick}
          style={{
            background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer',
            fontFamily: 'Consolas, monospace', fontWeight: 600, fontSize: '11px',
            padding: 0, textDecoration: 'underline',
          }}
        >
          {t.tableName}
        </button>
      </td>
      <td style={tdStyle}>{t.description || '-'}</td>
      <td style={{ ...tdStyle, textAlign: 'center' as const }}>{t.columns.length}</td>
    </tr>
  );
}

export default function ExcelExportPreview({
  scriptName,
  tables: allTables,
  getMappingInfo,
  getColumnTags,
  onClose,
  isDarkTheme = false,
}: ExcelExportPreviewProps) {
  // Filter out tables marked as "To Ignore"
  const tables = useMemo(() => allTables.filter(t => !t.toIgnore), [allTables]);

  const [selectedTab, setSelectedTab] = useState(-1);
  const [exporting, setExporting] = useState(false);
  const [selectedTableIds, setSelectedTableIds] = useState<Set<number>>(() => new Set(tables.map(t => t.id)));

  const toggleTableSelection = (id: number) => {
    setSelectedTableIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllTables = (tableList: Array<Table & { isSource?: boolean }>, select: boolean) => {
    setSelectedTableIds(prev => {
      const next = new Set(prev);
      tableList.forEach(t => { if (select) next.add(t.id); else next.delete(t.id); });
      return next;
    });
  };

  const selectedCount = tables.filter(t => selectedTableIds.has(t.id)).length;
  const exportTables = useMemo(() => tables.filter(t => selectedTableIds.has(t.id)), [tables, selectedTableIds]);
  const [visibleColumns, setVisibleColumns] = useState<Set<ExcelColumnKey>>(() => {
    const saved = loadExcelExportColumns();
    if (saved && saved.length > 0) {
      const valid = saved.filter(k => EXCEL_COLUMNS.some(c => c.key === k)) as ExcelColumnKey[];
      if (valid.length > 0) return new Set(valid);
    }
    return new Set(EXCEL_COLUMNS.map(c => c.key));
  });
  const [homeSearch, setHomeSearch] = useState('');
  const tabStripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    saveExcelExportColumns(Array.from(visibleColumns));
  }, [visibleColumns]);

  useEffect(() => {
    if (selectedTab >= 0 && tabStripRef.current) {
      const buttons = tabStripRef.current.querySelectorAll('button[data-tab-idx]');
      const target = buttons[selectedTab + 1] as HTMLElement;
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedTab]);

  const toggleColumn = (key: ExcelColumnKey) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size <= 1) return prev;
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (visibleColumns.size === EXCEL_COLUMNS.length) {
      setVisibleColumns(new Set(['column']));
    } else {
      setVisibleColumns(new Set(EXCEL_COLUMNS.map(c => c.key)));
    }
  };

  const activeCols = useMemo(
    () => EXCEL_COLUMNS.filter(c => visibleColumns.has(c.key)),
    [visibleColumns]
  );

  const tableAtTab = selectedTab >= 0 ? tables[selectedTab] : null;
  const table = tableAtTab && selectedTableIds.has(tableAtTab.id) ? tableAtTab : null;

  const handleExport = async () => {
    if (selectedCount === 0) return;
    setExporting(true);
    try {
      await exportDataDictionaryToExcel({
        scriptName, tables: exportTables, getMappingInfo, getColumnTags,
        visibleColumns: Array.from(visibleColumns),
      });
    } finally {
      setExporting(false);
    }
  };

  // Styles
  const bg = isDarkTheme ? '#0f172a' : '#ffffff';
  const bgAlt = isDarkTheme ? '#1e293b' : '#f8fafc';
  const textPrimary = isDarkTheme ? '#e2e8f0' : '#1a202c';
  const textSecondary = isDarkTheme ? '#94a3b8' : '#64748b';
  const borderColor = isDarkTheme ? '#334155' : '#e2e8f0';
  const titleBg = '#1B3A5C';
  const sectionBg = '#2C5282';
  const headerBg = isDarkTheme ? '#334155' : '#e2e8f0';
  const completedBg = isDarkTheme ? '#064e3b22' : '#E8FAF0';
  const labelBg = isDarkTheme ? '#1e293b' : '#f7fafc';

  const getNullableDisplay = (nullable: string) => {
    const upper = nullable?.toUpperCase();
    if (upper === 'Y' || upper === 'YES') return 'NULL';
    if (upper === 'N' || upper === 'NO') return 'NOT NULL';
    return nullable || '';
  };

  // Index page: filter tables
  const filteredHomeTables = useMemo(() => {
    if (!homeSearch.trim()) return tables.map((t, i) => ({ ...t, _idx: i }));
    const q = homeSearch.toLowerCase();
    return tables
      .map((t, i) => ({ ...t, _idx: i }))
      .filter(t =>
        t.tableName.toLowerCase().includes(q) ||
        (t.schema || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        t.columns.some(c => c.name.toLowerCase().includes(q))
      );
  }, [tables, homeSearch]);

  const targetTables = filteredHomeTables.filter(t => !t.isSource);
  const sourceTables = filteredHomeTables.filter(t => t.isSource);

  const thStyle = { padding: '6px 12px', fontSize: '11px', fontWeight: 600 as const, backgroundColor: headerBg, border: '1px solid #000', textAlign: 'left' as const, color: textPrimary };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: bg, display: 'flex', flexDirection: 'column' as const, overflow: 'hidden',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', borderBottom: `1px solid ${borderColor}`,
        backgroundColor: bgAlt, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: textPrimary }}>
            Excel Export Preview
          </h2>
          <span style={{ fontSize: '13px', color: textSecondary }}>
            {scriptName} &middot; {selectedCount}/{tables.length} table{tables.length !== 1 ? 's' : ''} selected
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={handleExport} disabled={exporting || selectedCount === 0} style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 20px',
            backgroundColor: (exporting || selectedCount === 0) ? '#64748b' : '#22c55e', color: '#fff',
            border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600,
            cursor: (exporting || selectedCount === 0) ? 'not-allowed' : 'pointer',
          }}>
            <FileDown size={16} />
            {exporting ? 'Exporting...' : selectedCount === 0 ? 'No Tables Selected' : `Export .xlsx (${selectedCount})`}
          </button>
          <button onClick={onClose} style={{
            display: 'flex', alignItems: 'center', padding: '8px',
            backgroundColor: 'transparent', border: `1px solid ${borderColor}`,
            borderRadius: '6px', cursor: 'pointer', color: textPrimary,
          }}>
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Column selector */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px',
        borderBottom: `1px solid ${borderColor}`, backgroundColor: bgAlt,
        flexShrink: 0, flexWrap: 'wrap' as const,
      }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: textSecondary, marginRight: '4px' }}>Columns:</span>
        <button onClick={toggleAll} style={{
          padding: '3px 10px', fontSize: '11px', fontWeight: 600,
          border: `1px solid ${borderColor}`, borderRadius: '4px',
          backgroundColor: visibleColumns.size === EXCEL_COLUMNS.length ? (isDarkTheme ? '#334155' : '#e2e8f0') : 'transparent',
          color: textPrimary, cursor: 'pointer',
        }}>
          {visibleColumns.size === EXCEL_COLUMNS.length ? 'Deselect All' : 'Select All'}
        </button>
        {EXCEL_COLUMNS.map(col => (
          <button key={col.key} onClick={() => toggleColumn(col.key)} style={{
            display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 10px', fontSize: '11px',
            border: `1px solid ${visibleColumns.has(col.key) ? '#3b82f6' : borderColor}`, borderRadius: '4px',
            backgroundColor: visibleColumns.has(col.key) ? (isDarkTheme ? '#1e3a5f' : '#dbeafe') : 'transparent',
            color: visibleColumns.has(col.key) ? '#3b82f6' : textSecondary, cursor: 'pointer',
            fontWeight: visibleColumns.has(col.key) ? 600 : 400,
          }}>
            {visibleColumns.has(col.key) && <Check size={12} />}
            {col.header}
          </button>
        ))}
      </div>

      {/* Tab strip */}
      <div ref={tabStripRef} style={{
        display: 'flex', gap: '0', padding: '0 20px',
        borderBottom: `1px solid ${borderColor}`, backgroundColor: bgAlt,
        overflowX: 'auto', flexShrink: 0,
      }}>
        <button data-tab-idx={-1} onClick={() => setSelectedTab(-1)} style={{
          display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px',
          fontSize: '12px', fontWeight: selectedTab === -1 ? 700 : 500,
          color: selectedTab === -1 ? '#3b82f6' : textSecondary,
          backgroundColor: selectedTab === -1 ? bg : 'transparent',
          border: 'none', borderBottom: selectedTab === -1 ? '2px solid #3b82f6' : '2px solid transparent',
          borderRight: `1px solid ${borderColor}`, cursor: 'pointer', whiteSpace: 'nowrap',
          position: 'sticky', left: 0, zIndex: 2,
        }}>
          <Home size={14} />
          Index
        </button>
        {tables.map((t, i) => {
          if (!selectedTableIds.has(t.id)) return null;
          const isActive = i === selectedTab;
          const prefix = t.isSource ? 'SRC_' : '';
          return (
            <button key={t.id} data-tab-idx={i} onClick={() => setSelectedTab(i)} style={{
              padding: '8px 16px', fontSize: '12px', fontWeight: isActive ? 600 : 400,
              color: isActive ? '#3b82f6' : textSecondary,
              backgroundColor: isActive ? bg : 'transparent',
              border: 'none', borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'Consolas, monospace',
            }}>
              {prefix}{t.tableName}
            </button>
          );
        })}
      </div>

      {/* ==================== INDEX PAGE ==================== */}
      {selectedTab === -1 && (
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Title */}
            <div style={{
              backgroundColor: titleBg, color: '#ffffff', padding: '14px 20px',
              fontSize: '16px', fontWeight: 700, borderRadius: '6px 6px 0 0',
              border: '1px solid #000', borderBottom: 'none',
            }}>
              {scriptName} - Table Index
            </div>
            {/* Search bar */}
            <div style={{
              padding: '12px 20px', backgroundColor: labelBg,
              border: '1px solid #000', borderBottom: 'none',
              display: 'flex', alignItems: 'center', gap: '12px',
            }}>
              <input
                type="text"
                placeholder="Search by table name, schema, or column name..."
                value={homeSearch}
                onChange={e => setHomeSearch(e.target.value)}
                style={{
                  flex: 1, padding: '6px 12px', fontSize: '13px',
                  border: `1px solid ${borderColor}`, borderRadius: '4px',
                  backgroundColor: bg, color: textPrimary, outline: 'none',
                }}
              />
              <span style={{ fontSize: '12px', color: textSecondary }}>
                {filteredHomeTables.length} of {tables.length} tables
              </span>
            </div>

            {/* Table List (targets) */}
            {targetTables.length > 0 && (
              <>
                <div style={{
                  backgroundColor: sectionBg, color: '#ffffff', padding: '8px 20px',
                  fontSize: '13px', fontWeight: 700, border: '1px solid #000', borderBottom: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span>Table List ({targetTables.length})</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => toggleAllTables(targetTables, true)} style={{
                      background: 'none', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '3px',
                      color: '#fff', fontSize: '11px', padding: '2px 8px', cursor: 'pointer',
                    }}>Select All</button>
                    <button onClick={() => toggleAllTables(targetTables, false)} style={{
                      background: 'none', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '3px',
                      color: '#fff', fontSize: '11px', padding: '2px 8px', cursor: 'pointer',
                    }}>Deselect All</button>
                  </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width: '36px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={targetTables.every(t => selectedTableIds.has(t.id))}
                          onChange={(e) => toggleAllTables(targetTables, e.target.checked)}
                          style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: isDarkTheme ? '#6b7280' : '#4b5563' }}
                        />
                      </th>
                      <th style={{ ...thStyle, width: '40px' }}>#</th>
                      <th style={{ ...thStyle, width: '140px' }}>Schema</th>
                      <th style={thStyle}>Table Name</th>
                      <th style={thStyle}>Description</th>
                      <th style={{ ...thStyle, textAlign: 'center', width: '70px' }}>Columns</th>
                    </tr>
                  </thead>
                  <tbody>
                    {targetTables.map((t, i) => (
                      <IndexTableRow key={t.id} t={t} i={i} onClick={() => setSelectedTab(t._idx)}
                        textPrimary={textPrimary} textSecondary={textSecondary} bg={bg} completedBg={completedBg}
                        selected={selectedTableIds.has(t.id)} onToggle={() => toggleTableSelection(t.id)} isDarkTheme={isDarkTheme} />
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {targetTables.length > 0 && sourceTables.length > 0 && <div style={{ height: '20px' }} />}

            {/* Source tables */}
            {sourceTables.length > 0 && (
              <>
                <div style={{
                  backgroundColor: sectionBg, color: '#ffffff', padding: '8px 20px',
                  fontSize: '13px', fontWeight: 700, border: '1px solid #000', borderBottom: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}>
                  <span>Source Tables ({sourceTables.length})</span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => toggleAllTables(sourceTables, true)} style={{
                      background: 'none', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '3px',
                      color: '#fff', fontSize: '11px', padding: '2px 8px', cursor: 'pointer',
                    }}>Select All</button>
                    <button onClick={() => toggleAllTables(sourceTables, false)} style={{
                      background: 'none', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '3px',
                      color: '#fff', fontSize: '11px', padding: '2px 8px', cursor: 'pointer',
                    }}>Deselect All</button>
                  </div>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ ...thStyle, width: '36px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={sourceTables.every(t => selectedTableIds.has(t.id))}
                          onChange={(e) => toggleAllTables(sourceTables, e.target.checked)}
                          style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: isDarkTheme ? '#6b7280' : '#4b5563' }}
                        />
                      </th>
                      <th style={{ ...thStyle, width: '40px' }}>#</th>
                      <th style={{ ...thStyle, width: '140px' }}>Schema</th>
                      <th style={thStyle}>Table Name</th>
                      <th style={thStyle}>Description</th>
                      <th style={{ ...thStyle, textAlign: 'center', width: '70px' }}>Columns</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sourceTables.map((t, i) => (
                      <IndexTableRow key={t.id} t={t} i={i} onClick={() => setSelectedTab(t._idx)}
                        textPrimary={textPrimary} textSecondary={textSecondary} bg={bg} completedBg={completedBg}
                        selected={selectedTableIds.has(t.id)} onToggle={() => toggleTableSelection(t.id)} isDarkTheme={isDarkTheme} />
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      )}

      {/* ==================== TABLE PAGE ==================== */}
      {table && (
        <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {/* Back to Index */}
            <button onClick={() => setSelectedTab(-1)} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', marginBottom: '12px',
              backgroundColor: 'transparent', border: `1px solid ${borderColor}`,
              borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: '#3b82f6',
            }}>
              <ArrowLeft size={14} />
              Back to Index
            </button>

            {/* SECTION 1: Table Title — same font size as headers, narrow width */}
            <div style={{ maxWidth: '500px' }}>
              <div style={{
                backgroundColor: titleBg, color: '#ffffff', padding: '8px 16px',
                fontSize: '12px', fontWeight: 700, border: '1px solid #000', borderBottom: 'none',
              }}>
                {table.isSource ? '[SOURCE] ' : ''}{table.schema ? table.schema + '.' : ''}{table.tableName}
              </div>

              {/* Table Information */}
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <tbody>
                  {[
                    ['Schema', table.schema || '-'],
                    ['Table Name', table.tableName],
                    ['Total Columns', String(table.columns.length)],
                    ['Description', table.description || '-'],
                  ].map(([label, value], i) => (
                    <tr key={i}>
                      <td style={{
                        width: '160px', padding: '6px 12px', fontSize: '12px', fontWeight: 600,
                        color: textPrimary, backgroundColor: labelBg, border: '1px solid #000',
                      }}>{label}</td>
                      <td style={{
                        padding: '6px 12px', fontSize: '12px', color: textPrimary,
                        backgroundColor: bg, border: '1px solid #000',
                      }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ height: '20px' }} />

            {/* SECTION 2: Constraints */}
            <div style={{
              backgroundColor: sectionBg, color: '#ffffff', padding: '8px 16px',
              fontSize: '12px', fontWeight: 700, border: '1px solid #000', borderBottom: 'none',
            }}>
              Constraints
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              {table.constraints.length > 0 ? (
                <>
                  <thead>
                    <tr>
                      {['Constraint Name', 'Type', 'Columns', 'Reference'].map(h => (
                        <th key={h} style={{
                          padding: '6px 12px', fontSize: '11px', fontWeight: 600,
                          color: isDarkTheme ? '#e2e8f0' : '#1a202c',
                          backgroundColor: headerBg, border: '1px solid #000', textAlign: 'left',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.constraints.map((c, i) => (
                      <tr key={i}>
                        <td style={{ padding: '5px 12px', fontSize: '11px', border: '1px solid #000', color: textPrimary, backgroundColor: bg, fontWeight: 700 }}>{c.name}</td>
                        <td style={{ padding: '5px 12px', fontSize: '11px', border: '1px solid #000', color: textPrimary, backgroundColor: bg }}>{c.type}</td>
                        <td style={{ padding: '5px 12px', fontSize: '11px', border: '1px solid #000', color: textPrimary, backgroundColor: bg, fontFamily: 'Consolas, monospace' }}>{c.localCols}</td>
                        <td style={{ padding: '5px 12px', fontSize: '11px', border: '1px solid #000', color: textPrimary, backgroundColor: bg }}>{c.ref || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              ) : (
                <tbody>
                  <tr>
                    <td style={{
                      padding: '8px 12px', fontSize: '11px', fontStyle: 'italic',
                      color: textSecondary, border: '1px solid #000', backgroundColor: bg,
                    }}>
                      No constraints defined
                    </td>
                  </tr>
                </tbody>
              )}
            </table>

            <div style={{ height: '20px' }} />

            {/* SECTION 3: Column Details */}
            <div style={{
              backgroundColor: sectionBg, color: '#ffffff', padding: '8px 16px',
              fontSize: '12px', fontWeight: 700, border: '1px solid #000', borderBottom: 'none',
            }}>
              Column Details
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed',
                minWidth: `${activeCols.length * 120}px`,
              }}>
                <thead>
                  <tr>
                    {activeCols.map(col => (
                      <th key={col.key} style={{
                        padding: '6px 10px', fontSize: '11px', fontWeight: 600,
                        color: isDarkTheme ? '#e2e8f0' : '#1a202c',
                        backgroundColor: headerBg, border: '1px solid #000', textAlign: 'left',
                        width: `${col.width * 8}px`,
                      }}>{col.header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map((col, rowIdx) => {
                    const tags = getColumnTags(table, col.name);
                    const tagStr = tags.length > 0 ? ` (${tags.join(', ')})` : '';
                    const mappingInfo = getMappingInfo(table.tableName, col.name);
                    let mappedTo: string;
                    if (mappingInfo) mappedTo = mappingInfo;
                    else if (col.migrationNeeded === false) mappedTo = `Not Mapped${col.nonMigrationComment ? ' - ' + col.nonMigrationComment : ''}`;
                    else mappedTo = '-';
                    const sampleVals = col.sampleValues || [];
                    const sampleText = sampleVals.slice(0, 5).join(', ') + (sampleVals.length > 5 ? '...' : '');
                    const allValues: Record<ExcelColumnKey, string> = {
                      column: col.name + tagStr, type: col.type,
                      nullable: getNullableDisplay(col.nullable), default: col.default || '',
                      explanation: col.explanation || '', mapping: col.mapping || '',
                      sampleValues: sampleText, possibleValues: col.possibleValues || '', mappedTo,
                    };
                    return (
                      <tr key={rowIdx} style={{ backgroundColor: table.explanationCompleted ? completedBg : bg }}>
                        {activeCols.map(c => (
                          <td key={c.key} style={{
                            padding: '5px 10px', fontSize: '11px', border: '1px solid #000',
                            color: textPrimary, verticalAlign: 'top', wordBreak: 'break-word',
                            fontFamily: (c.key === 'column' || c.key === 'type') ? 'Consolas, monospace' : 'inherit',
                            fontWeight: (c.key === 'column' || c.key === 'type') ? 700 : 400,
                          }}>
                            {allValues[c.key]}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
