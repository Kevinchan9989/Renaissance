import { useState, useMemo } from 'react';
import { Script, Table, TableDiff, ColumnDiff } from '../types';
import { compareTables, tablesToMap } from '../utils/compare';
import { parseScript } from '../utils/parsers';
import { Play, ChevronDown } from 'lucide-react';

interface SchemaCompareProps {
  scripts: Script[];
  activeScript: Script;
}

export default function SchemaCompare({ scripts, activeScript }: SchemaCompareProps) {
  const [sourceId, setSourceId] = useState<string>(activeScript.id);
  const [targetId, setTargetId] = useState<string>('');
  const [targetContent, setTargetContent] = useState('');
  const [useCustomTarget, setUseCustomTarget] = useState(true);
  const [results, setResults] = useState<Record<string, TableDiff> | null>(null);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Get source script
  const sourceScript = scripts.find(s => s.id === sourceId);

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
      const targetScript = scripts.find(s => s.id === targetId);
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
  };

  // Group results by schema
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

      groups[schema].push({ key, diff });
    }

    // Sort within groups
    for (const schema of Object.keys(groups)) {
      groups[schema].sort((a, b) => a.key.localeCompare(b.key));
    }

    return groups;
  }, [results, searchTerm]);

  // Toggle schema collapse
  const toggleSchema = (e: React.MouseEvent) => {
    const header = e.currentTarget as HTMLElement;
    const list = header.nextElementSibling as HTMLElement;
    const arrow = header.querySelector('.schema-arrow') as HTMLElement;

    if (list) list.classList.toggle('hidden');
    if (arrow) arrow.classList.toggle('collapsed');
  };

  // Get flag class
  const getFlagClass = (status: string) => {
    switch (status) {
      case 'MISSING': return 'flag-del';
      case 'ADDED': return 'flag-add';
      case 'MODIFIED': return 'flag-mod';
      case 'SOFT_MATCH': return 'flag-soft';
      default: return 'flag-ok';
    }
  };

  // Get flag text
  const getFlagText = (status: string) => {
    switch (status) {
      case 'MISSING': return 'Del';
      case 'ADDED': return 'New';
      case 'MODIFIED': return 'Mod';
      case 'SOFT_MATCH': return 'Soft';
      default: return 'OK';
    }
  };

  // Render selected table details
  const renderDetails = () => {
    if (!selectedTable || !results) return null;

    const diff = results[selectedTable];
    if (!diff) return null;

    const { status, src, tgt, details } = diff;

    return (
      <div style={{ padding: '20px', overflow: 'auto', flex: 1 }}>
        <h2 style={{ marginBottom: '16px', fontSize: '16px' }}>{selectedTable}</h2>

        {status === 'IDENTICAL' && (
          <div style={{ padding: '12px', background: '#e2e3e5', borderRadius: '4px', marginBottom: '16px' }}>
            Tables are identical.
          </div>
        )}

        {status === 'MISSING' && (
          <>
            <div style={{ padding: '12px', background: '#fbe9eb', color: '#c0392b', borderRadius: '4px', marginBottom: '16px' }}>
              Table deleted in Target.
            </div>
            {src && renderTableStructure(src, 'Source (Deleted)')}
          </>
        )}

        {status === 'ADDED' && (
          <>
            <div style={{ padding: '12px', background: '#eafaf1', color: '#27ae60', borderRadius: '4px', marginBottom: '16px' }}>
              Table added in Target.
            </div>
            {tgt && renderTableStructure(tgt, 'Target (New)')}
          </>
        )}

        {(status === 'MODIFIED' || status === 'SOFT_MATCH') && details && (
          <>
            {details.pkDiff && (
              <div style={{ padding: '12px', background: '#fff3cd', color: '#856404', borderRadius: '4px', marginBottom: '16px' }}>
                <strong>PK Mismatch:</strong> Source[{src?.constraints.find(c => c.type === 'Primary Key')?.localCols || ''}] vs
                Target[{tgt?.constraints.find(c => c.type === 'Primary Key')?.localCols || ''}]
              </div>
            )}
            {renderDiffTable(details.changes, src, tgt)}
          </>
        )}
      </div>
    );
  };

  // Render table structure
  const renderTableStructure = (table: Table, title: string) => (
    <>
      <h4 style={{ marginBottom: '12px', fontSize: '14px' }}>{title}</h4>
      <table className="data-table" style={{ marginBottom: '24px' }}>
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
                <td className="code-cell">
                  {col.name}
                  {isPk && <span className="key-tag pk-tag">PK</span>}
                </td>
                <td>{col.type}</td>
                <td>{col.nullable}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );

  // Render diff table
  const renderDiffTable = (changes: ColumnDiff[], src: Table | null, tgt: Table | null) => {
    const srcPks = src?.constraints.find(c => c.type === 'Primary Key')?.localCols.split(',').map(s => s.trim().toUpperCase()) || [];
    const tgtPks = tgt?.constraints.find(c => c.type === 'Primary Key')?.localCols.split(',').map(s => s.trim().toUpperCase()) || [];

    return (
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '20%' }}>Column</th>
            <th style={{ width: '30%' }}>Source</th>
            <th style={{ width: '30%' }}>Target</th>
            <th style={{ width: '20%' }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {changes.map((row, i) => {
            let rowClass = '';
            switch (row.type) {
              case 'SOFT': rowClass = 'row-soft'; break;
              case 'DELETED': rowClass = 'row-miss'; break;
              case 'ADDED': rowClass = 'row-add'; break;
              case 'MODIFIED': rowClass = 'row-mod'; break;
            }

            const srcIsPk = srcPks.includes(row.col.toUpperCase());
            const tgtIsPk = tgtPks.includes(row.col.toUpperCase());

            return (
              <tr key={i} className={rowClass}>
                <td className="code-cell">
                  <strong>{row.col}</strong>
                </td>
                <td>
                  {row.s ? (
                    <>
                      {srcIsPk && <span className="key-tag pk-tag">PK</span>}
                      {' '}
                      <span className={row.type === 'MODIFIED' && row.t && row.s.type !== row.t.type ? 'diff-val' : ''}>
                        {row.s.type}
                      </span>
                      {' '}
                      <small className={row.type === 'MODIFIED' && row.t && row.s.nullable !== row.t.nullable ? 'diff-val' : ''}>
                        {row.s.nullable === 'Yes' ? 'NULL' : 'NOT NULL'}
                      </small>
                    </>
                  ) : (
                    <em>Missing</em>
                  )}
                </td>
                <td>
                  {row.t ? (
                    <>
                      {tgtIsPk && <span className="key-tag pk-tag">PK</span>}
                      {' '}
                      <span className={row.type === 'MODIFIED' && row.s && row.s.type !== row.t.type ? 'diff-val' : ''}>
                        {row.t.type}
                      </span>
                      {' '}
                      <small className={row.type === 'MODIFIED' && row.s && row.s.nullable !== row.t.nullable ? 'diff-val' : ''}>
                        {row.t.nullable === 'Yes' ? 'NULL' : 'NOT NULL'}
                      </small>
                    </>
                  ) : (
                    <em>Missing</em>
                  )}
                </td>
                <td style={{ fontSize: '11px', fontStyle: 'italic', color: '#666' }}>
                  {row.note || ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <div style={{ display: 'flex', height: '100%', gap: '0' }}>
      {/* Left Panel - Input */}
      <div style={{ width: results ? '320px' : '100%', borderRight: results ? '1px solid #e0e0e0' : 'none', display: 'flex', flexDirection: 'column' }}>
        {/* Source/Target Selection */}
        <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
          <div style={{ marginBottom: '12px' }}>
            <label className="form-label">Source Script</label>
            <select
              className="form-select"
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
            >
              {scripts.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <input
                type="checkbox"
                checked={useCustomTarget}
                onChange={(e) => setUseCustomTarget(e.target.checked)}
              />
              <span className="form-label" style={{ margin: 0 }}>Use Custom Target</span>
            </label>

            {!useCustomTarget ? (
              <select
                className="form-select"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
              >
                <option value="">Select target script...</option>
                {scripts.filter(s => s.id !== sourceId).map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            ) : (
              <textarea
                className="editor-textarea"
                value={targetContent}
                onChange={(e) => setTargetContent(e.target.value)}
                placeholder="Paste target DDL/DBML here..."
                style={{ minHeight: results ? '150px' : '300px' }}
              />
            )}
          </div>

          <button className="btn btn-success" onClick={runCompare} style={{ width: '100%' }}>
            <Play size={16} />
            Run Compare
          </button>
        </div>

        {/* Results List */}
        {results && (
          <>
            <div style={{ padding: '8px 16px', borderBottom: '1px solid #e0e0e0' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '12px' }}
              />
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
              {Object.keys(groupedResults).sort().map(schema => (
                <div key={schema} className="schema-block" style={{ background: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
                  <div
                    className="schema-header"
                    onClick={toggleSchema}
                    style={{ background: '#e9ecef', padding: '8px 16px' }}
                  >
                    <span className="schema-header-title" style={{ color: '#333' }}>{schema}</span>
                    <ChevronDown size={14} className="schema-arrow" style={{ color: '#666' }} />
                  </div>
                  <ul className="table-list" style={{ background: '#fff' }}>
                    {groupedResults[schema].map(({ key, diff }) => (
                      <li
                        key={key}
                        className={`table-item ${selectedTable === key ? 'active' : ''}`}
                        onClick={() => setSelectedTable(key)}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          color: '#333',
                          background: selectedTable === key ? '#3498db' : undefined
                        }}
                      >
                        <span style={{ color: selectedTable === key ? '#fff' : '#333' }}>
                          {diff.src?.tableName || diff.tgt?.tableName}
                        </span>
                        <span className={`flag ${getFlagClass(diff.status)}`}>
                          {getFlagText(diff.status)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right Panel - Details */}
      {results && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff' }}>
          {selectedTable ? (
            renderDetails()
          ) : (
            <div className="empty-state">
              <div className="empty-state-title">Comparison Complete</div>
              <div className="empty-state-text">
                Select a table from the list to view differences.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
