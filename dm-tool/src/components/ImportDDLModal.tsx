import { useState, useRef } from 'react';
import {
  X,
  Upload,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  MinusCircle,
  PlusCircle,
  Info,
  Database,
  ArrowLeft,
  FileText
} from 'lucide-react';
import { Script, ScriptType, ScriptVersion, TableDiff, ColumnDiff, DiffHunk, LineDiff } from '../types';
import { parseScript } from '../utils/parsers';
import { compareTables, tablesToMap } from '../utils/compare';
import { computeVersionDiff, buildUnifiedRows, CharDiff } from '../utils/versionDiff';
import { createScriptVersion, migrateScriptToVersioning } from '../utils/storage';
import CodeEditor from './CodeEditor';

interface ImportDDLModalProps {
  script: Script;
  onClose: () => void;
  onImport: (updatedScript: Script) => void;
  isDarkTheme?: boolean;
  darkThemeVariant?: 'slate' | 'vscode-gray';
}

type Phase = 'input' | 'preview';
type PreviewTab = 'schema' | 'raw';

export default function ImportDDLModal({
  script,
  onClose,
  onImport,
  isDarkTheme = false,
  darkThemeVariant = 'slate'
}: ImportDDLModalProps) {
  const [phase, setPhase] = useState<Phase>('input');
  const [ddlContent, setDdlContent] = useState('');
  const [scriptType, setScriptType] = useState<ScriptType>(script.type);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PreviewTab>('schema');
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  // Preview data
  const [schemaDiff, setSchemaDiff] = useState<Record<string, TableDiff> | null>(null);
  const [diffHunks, setDiffHunks] = useState<DiffHunk[]>([]);
  const [parsedContent, setParsedContent] = useState<string>('');

  const diffContainerRef = useRef<HTMLDivElement>(null);

  // Theme colors
  const isVscode = darkThemeVariant === 'vscode-gray';
  const bgColor = isDarkTheme ? (isVscode ? '#1e1e1e' : '#1e293b') : '#ffffff';
  const textColor = isDarkTheme ? '#e4e4e7' : '#18181b';
  const textSecondary = isDarkTheme ? '#a1a1aa' : '#71717a';
  const borderColor = isDarkTheme ? (isVscode ? '#3c3c3c' : '#334155') : '#e5e7eb';
  const cardBg = isDarkTheme ? (isVscode ? '#252526' : '#0f172a') : '#f9fafb';

  // Handle preview
  const handlePreview = () => {
    setError(null);

    if (!ddlContent.trim()) {
      setError('Please paste DDL content to import.');
      return;
    }

    try {
      const newData = parseScript(ddlContent, scriptType);

      if (newData.targets.length === 0) {
        setError('No tables found in the provided DDL. Check the script type and content format.');
        return;
      }

      // Compare schemas
      const oldMap = tablesToMap(script.data.targets);
      const newMap = tablesToMap(newData.targets);
      const diff = compareTables(oldMap, newMap);
      setSchemaDiff(diff);

      // Compute raw DDL diff
      const oldVersion: ScriptVersion = {
        id: 'old',
        versionNumber: 0,
        content: script.rawContent,
        data: script.data,
        createdAt: Date.now(),
      };
      const newVersion: ScriptVersion = {
        id: 'new',
        versionNumber: 0,
        content: ddlContent,
        data: newData,
        createdAt: Date.now(),
      };
      const diffResult = computeVersionDiff(oldVersion, newVersion, 3, false, true);
      setDiffHunks(diffResult.hunks);

      setParsedContent(ddlContent);
      setPhase('preview');
    } catch (e) {
      setError(`Failed to parse DDL: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  // Handle apply
  const handleApply = () => {
    const newData = parseScript(parsedContent, scriptType);

    // Migrate to versioning if not already enabled
    let scriptToUpdate = script;
    if (!script.versioningEnabled) {
      scriptToUpdate = migrateScriptToVersioning(script);
    }

    // Create version snapshot of current content
    const versionedScript = createScriptVersion(scriptToUpdate, 'Before DDL import');

    // Replace content with new DDL
    const updatedScript: Script = {
      ...versionedScript,
      rawContent: parsedContent,
      data: newData,
      type: scriptType,
      updatedAt: Date.now(),
    };

    // Create another version for the new content
    const finalScript = createScriptVersion(updatedScript, 'DDL import');

    onImport(finalScript);
  };

  // Get schema diff stats
  const getStats = () => {
    if (!schemaDiff) return { added: 0, removed: 0, modified: 0, unchanged: 0 };

    let added = 0, removed = 0, modified = 0, unchanged = 0;
    for (const diff of Object.values(schemaDiff)) {
      switch (diff.status) {
        case 'ADDED': added++; break;
        case 'MISSING': removed++; break;
        case 'MODIFIED':
        case 'SOFT_MATCH': modified++; break;
        case 'IDENTICAL': unchanged++; break;
      }
    }
    return { added, removed, modified, unchanged };
  };

  // Toggle table expansion
  const toggleTable = (key: string) => {
    const next = new Set(expandedTables);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setExpandedTables(next);
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
      case 'MISSING': return 'Removed';
      case 'ADDED': return 'New';
      case 'MODIFIED': return 'Modified';
      case 'SOFT_MATCH': return 'Soft Match';
      default: return 'Unchanged';
    }
  };

  // Get row style for column diff
  const getRowStyle = (type: string): React.CSSProperties => {
    switch (type) {
      case 'MODIFIED':
      case 'SOFT':
        return { background: 'var(--diff-modified-bg, rgba(234, 179, 8, 0.15))' };
      case 'ADDED':
        return { background: 'var(--diff-added-bg, rgba(34, 197, 94, 0.12))' };
      case 'DELETED':
      case 'MISSING':
        return { background: 'var(--diff-deleted-bg, rgba(239, 68, 68, 0.12))' };
      default:
        return {};
    }
  };

  // Render char-highlighted content
  const renderCharHighlightedContent = (charDiffs: CharDiff[], side: 'old' | 'new') => {
    return charDiffs.map((diff, i) => {
      if (diff.type === 'unchanged') {
        return <span key={i}>{diff.text}</span>;
      } else if (diff.type === 'added' && side === 'new') {
        return <span key={i} className="diff-char-added">{diff.text}</span>;
      } else if (diff.type === 'deleted' && side === 'old') {
        return <span key={i} className="diff-char-deleted">{diff.text}</span>;
      }
      return <span key={i}>{diff.text}</span>;
    });
  };

  const stats = getStats();
  const hasChanges = stats.added > 0 || stats.removed > 0 || stats.modified > 0;

  // Get all lines from hunks
  const allLines: LineDiff[] = diffHunks.flatMap(h => h.lines);
  const unifiedRows = buildUnifiedRows(allLines);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        className="import-ddl-modal"
        style={{
          backgroundColor: bgColor,
          borderRadius: '12px',
          width: '95vw',
          maxWidth: '1200px',
          maxHeight: '85vh',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: `1px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {phase === 'preview' && (
              <button
                onClick={() => setPhase('input')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: textSecondary,
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Back to input"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <h2 style={{ margin: 0, color: textColor, fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={18} />
                Import DDL
              </h2>
              <p style={{ margin: '2px 0 0 0', color: textSecondary, fontSize: '13px' }}>
                {script.name} {phase === 'preview' ? '- Preview Changes' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: textSecondary,
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {phase === 'input' ? (
            /* Phase 1: Input */
            <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Script type selector */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: textColor, fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>
                  Script Type
                </label>
                <select
                  className="form-select"
                  value={scriptType}
                  onChange={e => setScriptType(e.target.value as ScriptType)}
                  style={{
                    maxWidth: '200px',
                    backgroundColor: bgColor,
                    color: textColor,
                    borderColor: borderColor,
                  }}
                >
                  <option value="postgresql">PostgreSQL</option>
                  <option value="oracle">Oracle</option>
                  <option value="dbml">DBML</option>
                </select>
              </div>

              {/* Code editor */}
              <div style={{ flex: 1, minHeight: '300px' }}>
                <label style={{ color: textColor, fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>
                  Paste DDL Content
                </label>
                <div style={{ height: 'calc(100% - 24px)' }}>
                  <CodeEditor
                    value={ddlContent}
                    onChange={(val) => { setDdlContent(val); setError(null); }}
                    language={scriptType}
                    isDarkTheme={isDarkTheme}
                    darkThemeVariant={darkThemeVariant}
                    placeholder="Paste your CREATE TABLE statements here..."
                    minHeight="300px"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: isDarkTheme ? '#450a0a' : '#fef2f2',
                  border: `1px solid ${isDarkTheme ? '#7f1d1d' : '#fecaca'}`,
                  marginTop: '12px',
                }}>
                  <AlertCircle size={16} color={isDarkTheme ? '#fca5a5' : '#dc2626'} />
                  <span style={{ color: isDarkTheme ? '#fca5a5' : '#dc2626', fontSize: '13px' }}>
                    {error}
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* Phase 2: Preview */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Summary bar */}
              <div className="import-ddl-summary-bar" style={{
                padding: '12px 24px',
                borderBottom: `1px solid ${borderColor}`,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                backgroundColor: cardBg,
                flexShrink: 0,
              }}>
                {stats.added > 0 && (
                  <span className="import-ddl-stat import-ddl-stat-added">
                    <PlusCircle size={14} />
                    +{stats.added} added
                  </span>
                )}
                {stats.removed > 0 && (
                  <span className="import-ddl-stat import-ddl-stat-removed">
                    <MinusCircle size={14} />
                    -{stats.removed} removed
                  </span>
                )}
                {stats.modified > 0 && (
                  <span className="import-ddl-stat import-ddl-stat-modified">
                    <AlertCircle size={14} />
                    ~{stats.modified} modified
                  </span>
                )}
                {stats.unchanged > 0 && (
                  <span className="import-ddl-stat import-ddl-stat-unchanged">
                    <CheckCircle size={14} />
                    {stats.unchanged} unchanged
                  </span>
                )}
                {!hasChanges && (
                  <span style={{ color: textSecondary, fontSize: '13px', fontStyle: 'italic' }}>
                    No schema changes detected
                  </span>
                )}
              </div>

              {/* Tabs */}
              <div className="import-ddl-tabs" style={{
                padding: '0 24px',
                borderBottom: `1px solid ${borderColor}`,
                display: 'flex',
                gap: '0',
                flexShrink: 0,
              }}>
                <button
                  className={`import-ddl-tab ${activeTab === 'schema' ? 'active' : ''}`}
                  onClick={() => setActiveTab('schema')}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderBottom: activeTab === 'schema' ? '2px solid #3b82f6' : '2px solid transparent',
                    background: 'none',
                    color: activeTab === 'schema' ? '#3b82f6' : textSecondary,
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Database size={14} />
                  Schema Changes
                </button>
                <button
                  className={`import-ddl-tab ${activeTab === 'raw' ? 'active' : ''}`}
                  onClick={() => setActiveTab('raw')}
                  style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderBottom: activeTab === 'raw' ? '2px solid #3b82f6' : '2px solid transparent',
                    background: 'none',
                    color: activeTab === 'raw' ? '#3b82f6' : textSecondary,
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <FileText size={14} />
                  Raw DDL Diff
                </button>
              </div>

              {/* Tab content */}
              <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
                {activeTab === 'schema' ? (
                  /* Schema Changes Tab */
                  <div className="import-ddl-table-list">
                    {schemaDiff && Object.entries(schemaDiff)
                      .sort(([, a], [, b]) => {
                        const order: Record<string, number> = { 'ADDED': 0, 'MISSING': 1, 'MODIFIED': 2, 'SOFT_MATCH': 3, 'IDENTICAL': 4 };
                        return (order[a.status] ?? 5) - (order[b.status] ?? 5);
                      })
                      .map(([key, diff]) => {
                        const table = diff.src || diff.tgt;
                        const isExpanded = expandedTables.has(key);
                        const hasDetails = diff.details && diff.details.changes.length > 0;

                        return (
                          <div
                            key={key}
                            className="import-ddl-table-item"
                            style={{
                              borderRadius: '8px',
                              border: `1px solid ${borderColor}`,
                              marginBottom: '8px',
                              overflow: 'hidden',
                            }}
                          >
                            {/* Table header */}
                            <div
                              className="import-ddl-table-header"
                              onClick={() => hasDetails && toggleTable(key)}
                              style={{
                                padding: '10px 14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: hasDetails ? 'pointer' : 'default',
                                backgroundColor: diff.status !== 'IDENTICAL' ? cardBg : 'transparent',
                              }}
                            >
                              {hasDetails ? (
                                isExpanded
                                  ? <ChevronDown size={14} style={{ color: textSecondary, flexShrink: 0 }} />
                                  : <ChevronRight size={14} style={{ color: textSecondary, flexShrink: 0 }} />
                              ) : (
                                <span style={{ width: 14, flexShrink: 0 }} />
                              )}
                              {getStatusIcon(diff.status)}
                              <span style={{
                                fontFamily: 'ui-monospace, monospace',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: textColor,
                                flex: 1,
                              }}>
                                {table?.schema ? `${table.schema}.` : ''}{table?.tableName || key}
                              </span>
                              <span
                                className={`compare-status-badge status-${diff.status.toLowerCase().replace('_', '-')}`}
                                style={{
                                  fontSize: '10px',
                                  padding: '2px 8px',
                                  borderRadius: '10px',
                                  fontWeight: 600,
                                }}
                              >
                                {getStatusLabel(diff.status)}
                              </span>
                              {hasDetails && (
                                <span style={{ fontSize: '11px', color: textSecondary }}>
                                  {diff.details!.changes.filter(c => c.type !== 'SAME').length} changes
                                </span>
                              )}
                            </div>

                            {/* Expanded column details */}
                            {isExpanded && hasDetails && (
                              <div style={{
                                borderTop: `1px solid ${borderColor}`,
                                padding: '12px',
                              }}>
                                <div style={{ display: 'flex', gap: '12px', overflow: 'auto' }}>
                                  {/* Source columns */}
                                  <div style={{ flex: 1, minWidth: '280px' }}>
                                    <div style={{
                                      padding: '6px 10px',
                                      background: 'var(--compare-header-bg, #3b82f6)',
                                      color: '#fff',
                                      fontWeight: 600,
                                      fontSize: '11px',
                                      borderRadius: '4px 4px 0 0',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                    }}>
                                      <Database size={12} />
                                      CURRENT: {diff.src?.tableName || 'N/A'}
                                    </div>
                                    <table className="compare-table compare-side-table" style={{ tableLayout: 'fixed', width: '100%', fontSize: '11px' }}>
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
                                        {diff.details!.changes.map((row: ColumnDiff, i: number) => (
                                          <tr key={i} style={getRowStyle(row.type)}>
                                            {row.s ? (
                                              <>
                                                <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                  <strong>{row.col}</strong>
                                                </td>
                                                <td style={{ fontFamily: 'monospace', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                  {row.s.type}
                                                </td>
                                                <td>
                                                  <span className="nullable-badge">{row.s.nullable === 'Yes' ? 'NULL' : 'NOT NULL'}</span>
                                                </td>
                                              </>
                                            ) : (
                                              <>
                                                <td style={{ color: textSecondary, fontStyle: 'italic' }}>&mdash;</td>
                                                <td style={{ color: textSecondary }}>&mdash;</td>
                                                <td style={{ color: textSecondary }}>&mdash;</td>
                                              </>
                                            )}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>

                                  {/* Target columns */}
                                  <div style={{ flex: 1, minWidth: '280px' }}>
                                    <div style={{
                                      padding: '6px 10px',
                                      background: 'var(--compare-header-tgt-bg, #22c55e)',
                                      color: '#fff',
                                      fontWeight: 600,
                                      fontSize: '11px',
                                      borderRadius: '4px 4px 0 0',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                    }}>
                                      <Database size={12} />
                                      INCOMING: {diff.tgt?.tableName || 'N/A'}
                                    </div>
                                    <table className="compare-table compare-side-table" style={{ tableLayout: 'fixed', width: '100%', fontSize: '11px' }}>
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
                                        {diff.details!.changes.map((row: ColumnDiff, i: number) => (
                                          <tr key={i} style={getRowStyle(row.type)}>
                                            {row.t ? (
                                              <>
                                                <td style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                  <strong>{row.col}</strong>
                                                </td>
                                                <td style={{ fontFamily: 'monospace', fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                  {row.t.type}
                                                </td>
                                                <td>
                                                  <span className="nullable-badge">{row.t.nullable === 'Yes' ? 'NULL' : 'NOT NULL'}</span>
                                                </td>
                                              </>
                                            ) : (
                                              <>
                                                <td style={{ color: textSecondary, fontStyle: 'italic' }}>&mdash;</td>
                                                <td style={{ color: textSecondary }}>&mdash;</td>
                                                <td style={{ color: textSecondary }}>&mdash;</td>
                                              </>
                                            )}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                {diff.details!.pkDiff && (
                                  <div style={{
                                    marginTop: '8px',
                                    padding: '6px 10px',
                                    borderRadius: '4px',
                                    backgroundColor: isDarkTheme ? 'rgba(234, 179, 8, 0.1)' : 'rgba(234, 179, 8, 0.08)',
                                    border: '1px solid rgba(234, 179, 8, 0.3)',
                                    fontSize: '11px',
                                    color: isDarkTheme ? '#fbbf24' : '#b45309',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}>
                                    <AlertCircle size={12} />
                                    Primary key columns differ between current and incoming
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    }
                  </div>
                ) : (
                  /* Raw DDL Diff Tab */
                  <div className="version-popup-diff-wrapper" ref={diffContainerRef} style={{ maxHeight: 'none' }}>
                    <table className="version-popup-diff-table">
                      <colgroup>
                        <col className="diff-col-num" />
                        <col className="diff-col-content" />
                        <col className="diff-col-num" />
                        <col className="diff-col-content" />
                      </colgroup>
                      <thead>
                        <tr className="version-popup-diff-header-row">
                          <th colSpan={2} className="version-popup-diff-header-cell version-popup-diff-header-old">
                            <FileText size={14} />
                            <span>Current</span>
                          </th>
                          <th colSpan={2} className="version-popup-diff-header-cell">
                            <FileText size={14} />
                            <span>Incoming</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {unifiedRows.map((row, i) => (
                          <tr
                            key={i}
                            className={`diff-table-row diff-row-${row.type}`}
                            data-old-line={row.oldLineNum}
                            data-new-line={row.newLineNum}
                          >
                            {/* Old side */}
                            <td className={`diff-cell-num ${row.type === 'added' ? 'diff-cell-empty' : `diff-cell-${row.type}`}`}>
                              {row.oldLineNum || ''}
                            </td>
                            <td className={`diff-cell-content ${row.type === 'added' ? 'diff-cell-empty' : `diff-cell-${row.type}`}`}>
                              {row.type === 'modified' && row.oldChars ? (
                                <>
                                  <span className="diff-marker diff-marker-deleted">&minus;</span>
                                  <code className="diff-code">{renderCharHighlightedContent(row.oldChars, 'old')}</code>
                                </>
                              ) : row.type === 'deleted' ? (
                                <>
                                  <span className="diff-marker diff-marker-deleted">&minus;</span>
                                  <code className="diff-code">{row.oldContent}</code>
                                </>
                              ) : row.type !== 'added' ? (
                                <code className="diff-code">{row.oldContent}</code>
                              ) : null}
                            </td>

                            {/* New side */}
                            <td className={`diff-cell-num ${row.type === 'deleted' ? 'diff-cell-empty' : `diff-cell-${row.type}`}`}>
                              {row.newLineNum || ''}
                            </td>
                            <td className={`diff-cell-content ${row.type === 'deleted' ? 'diff-cell-empty' : `diff-cell-${row.type}`}`}>
                              {row.type === 'modified' && row.newChars ? (
                                <>
                                  <span className="diff-marker diff-marker-added">+</span>
                                  <code className="diff-code">{renderCharHighlightedContent(row.newChars, 'new')}</code>
                                </>
                              ) : row.type === 'added' ? (
                                <>
                                  <span className="diff-marker diff-marker-added">+</span>
                                  <code className="diff-code">{row.newContent}</code>
                                </>
                              ) : row.type !== 'deleted' ? (
                                <code className="diff-code">{row.newContent}</code>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: `1px solid ${borderColor}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          flexShrink: 0,
        }}>
          {phase === 'input' ? (
            <>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePreview}
                disabled={!ddlContent.trim()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: ddlContent.trim() ? '#3b82f6' : (isDarkTheme ? '#334155' : '#e2e8f0'),
                  color: ddlContent.trim() ? '#ffffff' : textSecondary,
                  border: 'none',
                  borderRadius: '6px',
                  cursor: ddlContent.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '13px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                Preview Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setPhase('input')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  color: textColor,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <button
                onClick={handleApply}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#22c55e',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Upload size={14} />
                Apply Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
