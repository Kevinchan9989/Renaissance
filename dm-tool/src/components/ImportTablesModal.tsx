import { useState } from 'react';
import {
  X,
  Upload,
  AlertCircle,
  PlusCircle,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Script } from '../types';
import { insertOrReplaceMultipleTables, TableInsertResult } from '../utils/ddlGenerator';
import CodeEditor from './CodeEditor';

interface ImportTablesModalProps {
  script: Script;
  onClose: () => void;
  onImport: (newRawContent: string) => void;
  isDarkTheme?: boolean;
  darkThemeVariant?: 'slate' | 'vscode-gray';
}

type Phase = 'input' | 'preview';

export default function ImportTablesModal({
  script,
  onClose,
  onImport,
  isDarkTheme = false,
  darkThemeVariant = 'slate',
}: ImportTablesModalProps) {
  const [phase, setPhase] = useState<Phase>('input');
  const [ddlContent, setDdlContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Preview data
  const [results, setResults] = useState<TableInsertResult[]>([]);
  const [newContent, setNewContent] = useState('');
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  // Theme
  const isVscode = darkThemeVariant === 'vscode-gray';
  const bgColor = isDarkTheme ? (isVscode ? '#1e1e1e' : '#1e293b') : '#ffffff';
  const textColor = isDarkTheme ? '#e4e4e7' : '#18181b';
  const textSecondary = isDarkTheme ? '#a1a1aa' : '#71717a';
  const borderColor = isDarkTheme ? (isVscode ? '#3c3c3c' : '#334155') : '#e5e7eb';
  const cardBg = isDarkTheme ? (isVscode ? '#252526' : '#0f172a') : '#f9fafb';

  const handlePreview = () => {
    setError(null);
    if (!ddlContent.trim()) {
      setError('Please paste CREATE TABLE statements to import.');
      return;
    }

    try {
      const result = insertOrReplaceMultipleTables(script.rawContent, ddlContent);
      if (result.results.length === 0) {
        setError('No CREATE TABLE statements found in the pasted content.');
        return;
      }
      setResults(result.results);
      setNewContent(result.newContent);
      setPhase('preview');
    } catch (e) {
      setError(`Failed to parse DDL: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  };

  const handleApply = () => {
    onImport(newContent);
  };

  const toggleTable = (tableName: string) => {
    const next = new Set(expandedTables);
    if (next.has(tableName)) next.delete(tableName);
    else next.add(tableName);
    setExpandedTables(next);
  };

  const insertCount = results.filter(r => r.action === 'inserted').length;
  const replaceCount = results.filter(r => r.action === 'replaced').length;

  // Extract the DDL block for a given table from newContent for preview
  const getTableDDL = (tableName: string): string => {
    const headerRe = new RegExp(
      `-{50,}\\s*\\n--\\s+DDL\\s+for\\s+Table\\s+${tableName}\\s*\\n-{50,}`,
      'i'
    );
    const match = headerRe.exec(newContent);
    if (!match) return '';

    const start = match.index;
    // Find next OMEGA header or ALTER section or end
    const rest = newContent.substring(match.index + match[0].length);
    const nextHeader = rest.search(/-{50,}\s*\n--\s+DDL\s+for\s+Table\s+/i);
    const nextAlter = rest.search(/\nALTER\s+TABLE\s+/i);

    let endOffset: number;
    if (nextHeader >= 0 && (nextAlter < 0 || nextHeader <= nextAlter)) {
      endOffset = nextHeader;
    } else if (nextAlter >= 0) {
      endOffset = nextAlter;
    } else {
      endOffset = rest.length;
    }

    return newContent.substring(start, match.index + match[0].length + endOffset).trim();
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
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
          maxWidth: '900px',
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
                  background: 'none', border: 'none',
                  color: textSecondary, cursor: 'pointer',
                  padding: '4px', display: 'flex', alignItems: 'center',
                }}
                title="Back to input"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <h2 style={{ margin: 0, color: textColor, fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={18} />
                Import Tables
              </h2>
              <p style={{ margin: '2px 0 0 0', color: textSecondary, fontSize: '13px' }}>
                {script.name} {phase === 'preview' ? '— Preview' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              color: textSecondary, cursor: 'pointer',
              padding: '4px', display: 'flex', alignItems: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          {phase === 'input' ? (
            <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Info banner */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 14px', borderRadius: '8px',
                backgroundColor: isDarkTheme ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.06)',
                border: `1px solid ${isDarkTheme ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'}`,
                marginBottom: '16px',
              }}>
                <Info size={16} color="#3b82f6" style={{ flexShrink: 0 }} />
                <span style={{ color: isDarkTheme ? '#93c5fd' : '#1e40af', fontSize: '12px' }}>
                  Tables will be inserted at their alphabetical position with OMEGA headers. Existing tables with the same name will be replaced.
                </span>
              </div>

              {/* Code editor */}
              <div style={{ flex: 1, minHeight: '300px' }}>
                <label style={{ color: textColor, fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>
                  Paste CREATE TABLE Statements
                </label>
                <div style={{ height: 'calc(100% - 24px)' }}>
                  <CodeEditor
                    value={ddlContent}
                    onChange={(val) => { setDdlContent(val); setError(null); }}
                    language={script.type}
                    isDarkTheme={isDarkTheme}
                    darkThemeVariant={darkThemeVariant}
                    placeholder="Paste one or more CREATE TABLE statements here..."
                    minHeight="300px"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '12px 16px', borderRadius: '8px',
                  backgroundColor: isDarkTheme ? '#450a0a' : '#fef2f2',
                  border: `1px solid ${isDarkTheme ? '#7f1d1d' : '#fecaca'}`,
                  marginTop: '12px',
                }}>
                  <AlertCircle size={16} color={isDarkTheme ? '#fca5a5' : '#dc2626'} />
                  <span style={{ color: isDarkTheme ? '#fca5a5' : '#dc2626', fontSize: '13px' }}>{error}</span>
                </div>
              )}
            </div>
          ) : (
            /* Phase 2: Preview */
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Summary bar */}
              <div style={{
                padding: '12px 24px',
                borderBottom: `1px solid ${borderColor}`,
                display: 'flex', alignItems: 'center', gap: '16px',
                backgroundColor: cardBg, flexShrink: 0,
              }}>
                {insertCount > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#22c55e', fontWeight: 500 }}>
                    <PlusCircle size={14} />
                    {insertCount} to insert
                  </span>
                )}
                {replaceCount > 0 && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#f59e0b', fontWeight: 500 }}>
                    <AlertCircle size={14} />
                    {replaceCount} to replace
                  </span>
                )}
                <span style={{ color: textSecondary, fontSize: '12px', marginLeft: 'auto' }}>
                  {results.length} table{results.length !== 1 ? 's' : ''} total
                </span>
              </div>

              {/* Table list */}
              <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
                {results.map((r) => {
                  const isExpanded = expandedTables.has(r.tableName);
                  const isInsert = r.action === 'inserted';

                  return (
                    <div
                      key={r.tableName}
                      style={{
                        borderRadius: '8px',
                        border: `1px solid ${borderColor}`,
                        marginBottom: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Row header */}
                      <div
                        onClick={() => toggleTable(r.tableName)}
                        style={{
                          padding: '10px 14px',
                          display: 'flex', alignItems: 'center', gap: '10px',
                          cursor: 'pointer',
                          backgroundColor: cardBg,
                        }}
                      >
                        {isExpanded
                          ? <ChevronDown size={14} style={{ color: textSecondary, flexShrink: 0 }} />
                          : <ChevronRight size={14} style={{ color: textSecondary, flexShrink: 0 }} />
                        }
                        {isInsert
                          ? <PlusCircle size={14} color="#22c55e" />
                          : <AlertCircle size={14} color="#f59e0b" />
                        }
                        <span style={{
                          fontFamily: 'ui-monospace, monospace',
                          fontSize: '12px', fontWeight: 600,
                          color: textColor, flex: 1,
                        }}>
                          {r.tableName}
                        </span>
                        <span style={{
                          fontSize: '10px', padding: '2px 8px',
                          borderRadius: '10px', fontWeight: 600,
                          backgroundColor: isInsert
                            ? (isDarkTheme ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)')
                            : (isDarkTheme ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.1)'),
                          color: isInsert ? '#22c55e' : '#f59e0b',
                        }}>
                          {isInsert ? 'Insert' : 'Replace'}
                        </span>
                      </div>

                      {/* Expanded DDL preview */}
                      {isExpanded && (
                        <div style={{
                          borderTop: `1px solid ${borderColor}`,
                          padding: '12px',
                          maxHeight: '300px',
                          overflow: 'auto',
                        }}>
                          <pre style={{
                            margin: 0,
                            fontFamily: 'ui-monospace, monospace',
                            fontSize: '11px',
                            color: textColor,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-all',
                          }}>
                            {getTableDDL(r.tableName)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: `1px solid ${borderColor}`,
          display: 'flex', justifyContent: 'flex-end', gap: '12px',
          flexShrink: 0,
        }}>
          {phase === 'input' ? (
            <>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 20px', backgroundColor: 'transparent',
                  color: textColor, border: `1px solid ${borderColor}`,
                  borderRadius: '6px', cursor: 'pointer',
                  fontSize: '13px', fontWeight: 500,
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
                  border: 'none', borderRadius: '6px',
                  cursor: ddlContent.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '13px', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '6px',
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
                  padding: '10px 20px', backgroundColor: 'transparent',
                  color: textColor, border: `1px solid ${borderColor}`,
                  borderRadius: '6px', cursor: 'pointer',
                  fontSize: '13px', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <button
                onClick={handleApply}
                style={{
                  padding: '10px 20px', backgroundColor: '#22c55e',
                  color: '#ffffff', border: 'none', borderRadius: '6px',
                  cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                <Upload size={14} />
                Apply
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
