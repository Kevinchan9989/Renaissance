import { useState, useRef } from 'react';
import { Script, SampleDataMatchResult } from '../types';
import {
  parseCSVSampleData,
  matchSampleDataToScript,
  extractSampleValues,
  applySampleValuesToScript,
  createSampleDataAttachment,
  ParsedCSVData
} from '../utils/sampleDataParser';
import {
  X,
  Upload,
  FileSpreadsheet,
  Check,
  AlertTriangle,
  XCircle,
  Table2,
  Columns,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface AttachSampleDataModalProps {
  script: Script;
  onClose: () => void;
  onAttach: (updatedScript: Script) => void;
  isDarkTheme?: boolean;
  darkThemeVariant?: 'slate' | 'vscode-gray';
}

export default function AttachSampleDataModal({
  script,
  onClose,
  onAttach,
  isDarkTheme = false,
  darkThemeVariant = 'slate'
}: AttachSampleDataModalProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [csvContent, setCsvContent] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedCSVData | null>(null);
  const [matchResults, setMatchResults] = useState<SampleDataMatchResult[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedTables, setExpandedTables] = useState<Set<number>>(new Set());

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Theme colors (matching Settings)
  const isVscode = darkThemeVariant === 'vscode-gray';
  const bgColor = isDarkTheme ? (isVscode ? '#1e1e1e' : '#1e293b') : '#ffffff';
  const textColor = isDarkTheme ? '#e4e4e7' : '#18181b';
  const textSecondary = isDarkTheme ? '#a1a1aa' : '#71717a';
  const borderColor = isDarkTheme ? (isVscode ? '#3c3c3c' : '#334155') : '#e5e7eb';
  const cardBg = isDarkTheme ? (isVscode ? '#252526' : '#0f172a') : '#f9fafb';

  // Toggle table expansion
  const toggleTableExpand = (idx: number) => {
    setExpandedTables(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError(null);
    setIsProcessing(true);

    try {
      const content = await file.text();
      setFileName(file.name);
      setCsvContent(content);

      // Parse CSV
      const parsed = parseCSVSampleData(content, file.name);
      setParsedData(parsed);

      if (parsed.errors.length > 0 && parsed.tables.length === 0) {
        setParseError(parsed.errors.join('; '));
        setMatchResults([]);
      } else {
        // Match to script
        const results = matchSampleDataToScript(parsed, script);
        setMatchResults(results);
      }
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Failed to read file');
      setParsedData(null);
      setMatchResults([]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle attach button
  const handleAttach = () => {
    if (!csvContent || !fileName || !parsedData) return;

    // Extract sample values
    const sampleValues = extractSampleValues(parsedData, matchResults);

    // Apply to script
    let updatedScript = applySampleValuesToScript(script, sampleValues);

    // Create attachment record
    const attachment = createSampleDataAttachment(fileName, matchResults, parsedData.errors);

    // Add attachment to script
    updatedScript = {
      ...updatedScript,
      sampleDataAttachments: [
        ...(updatedScript.sampleDataAttachments || []),
        attachment
      ]
    };

    onAttach(updatedScript);
  };

  // Calculate stats
  const totalMatched = matchResults.reduce(
    (sum, r) => sum + (r.matchedScriptTable ? 1 : 0),
    0
  );
  const totalMatchedCols = matchResults.reduce(
    (sum, r) => sum + r.matchedColumns.length,
    0
  );

  // Find script tables that have NO sample data (not matched by any CSV table)
  const matchedScriptTableNames = new Set(
    matchResults
      .filter(r => r.matchedScriptTable)
      .map(r => r.matchedScriptTable!)
  );
  const scriptTablesWithoutData = script.data.targets.filter(
    t => !matchedScriptTableNames.has(t.tableName)
  );
  const totalScriptTables = script.data.targets.length;
  const missingCount = scriptTablesWithoutData.length;

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
        style={{
          backgroundColor: bgColor,
          borderRadius: '12px',
          width: '680px',
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
          padding: '20px 24px',
          borderBottom: `1px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ margin: 0, color: textColor, fontSize: '18px', fontWeight: 600 }}>
              Attach Sample Data
            </h2>
            <p style={{ margin: '4px 0 0 0', color: textSecondary, fontSize: '13px' }}>
              {script.name}
            </p>
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
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {/* File Upload Card */}
          <div style={{
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: cardBg,
            border: `1px solid ${borderColor}`,
            marginBottom: '16px',
          }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: textColor, fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                CSV File
              </div>
              <div style={{ color: textSecondary, fontSize: '12px' }}>
                CSV should have a <code style={{
                  backgroundColor: isDarkTheme ? '#334155' : '#e2e8f0',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                }}>TBL_NAME</code> column to identify tables
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDarkTheme ? '#475569' : '#cbd5e1'}`,
                borderRadius: '8px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: bgColor,
                transition: 'border-color 0.2s, background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
                e.currentTarget.style.backgroundColor = isDarkTheme ? '#1e3a5f' : '#eff6ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isDarkTheme ? '#475569' : '#cbd5e1';
                e.currentTarget.style.backgroundColor = bgColor;
              }}
            >
              {fileName ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <FileSpreadsheet size={20} color="#22c55e" />
                  <span style={{ fontWeight: 500, color: textColor }}>{fileName}</span>
                  <span style={{
                    color: textSecondary,
                    fontSize: '12px',
                    padding: '2px 8px',
                    backgroundColor: cardBg,
                    borderRadius: '4px',
                  }}>
                    Click to change
                  </span>
                </div>
              ) : (
                <>
                  <Upload size={28} color={textSecondary} style={{ marginBottom: '8px' }} />
                  <div style={{ color: textColor, fontWeight: 500, fontSize: '13px' }}>
                    Click to select a CSV file
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Processing indicator */}
          {isProcessing && (
            <div style={{
              textAlign: 'center',
              padding: '16px',
              color: textSecondary,
              fontSize: '13px',
            }}>
              Processing CSV file...
            </div>
          )}

          {/* Parse error */}
          {parseError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: isDarkTheme ? '#450a0a' : '#fef2f2',
              border: `1px solid ${isDarkTheme ? '#7f1d1d' : '#fecaca'}`,
              marginBottom: '16px',
            }}>
              <XCircle size={16} color={isDarkTheme ? '#fca5a5' : '#dc2626'} />
              <span style={{ color: isDarkTheme ? '#fca5a5' : '#dc2626', fontSize: '13px' }}>
                {parseError}
              </span>
            </div>
          )}

          {/* Match Results */}
          {matchResults.length > 0 && (
            <>
              {/* Stats Row */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '16px',
                padding: '14px 16px',
                backgroundColor: cardBg,
                borderRadius: '8px',
                border: `1px solid ${borderColor}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Table2 size={16} color={textSecondary} />
                  <span style={{ fontWeight: 600, color: textColor }}>{totalScriptTables}</span>
                  <span style={{ color: textSecondary, fontSize: '13px' }}>tables</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} color="#22c55e" />
                  <span style={{ fontWeight: 600, color: '#22c55e' }}>{totalMatched}</span>
                  <span style={{ color: textSecondary, fontSize: '13px' }}>matched</span>
                </div>
                {missingCount > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <XCircle size={16} color="#dc2626" />
                    <span style={{ fontWeight: 600, color: '#dc2626' }}>{missingCount}</span>
                    <span style={{ color: textSecondary, fontSize: '13px' }}>missing</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Columns size={16} color={textSecondary} />
                  <span style={{ fontWeight: 600, color: textColor }}>{totalMatchedCols}</span>
                  <span style={{ color: textSecondary, fontSize: '13px' }}>columns</span>
                </div>
              </div>

              {/* Match Preview */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ color: textColor, fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
                  Match Preview
                </div>
                <div style={{
                  maxHeight: '220px',
                  overflow: 'auto',
                  borderRadius: '8px',
                  border: `1px solid ${borderColor}`,
                }}>
                  {matchResults.map((result, idx) => {
                    const isExpanded = expandedTables.has(idx);
                    const isUnmatched = !result.matchedScriptTable;

                    return (
                      <div key={idx}>
                        <div
                          onClick={() => toggleTableExpand(idx)}
                          style={{
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            borderBottom: `1px solid ${borderColor}`,
                            backgroundColor: isUnmatched
                              ? (isDarkTheme ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2')
                              : 'transparent',
                            transition: 'background-color 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            if (!isUnmatched) {
                              e.currentTarget.style.backgroundColor = isDarkTheme ? '#334155' : '#f8fafc';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isUnmatched) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            } else {
                              e.currentTarget.style.backgroundColor = isDarkTheme
                                ? 'rgba(239, 68, 68, 0.1)'
                                : '#fef2f2';
                            }
                          }}
                        >
                          {isExpanded
                            ? <ChevronDown size={14} style={{ color: textSecondary, flexShrink: 0 }} />
                            : <ChevronRight size={14} style={{ color: textSecondary, flexShrink: 0 }} />
                          }
                          {result.matchedScriptTable ? (
                            <Check size={14} color="#22c55e" style={{ flexShrink: 0 }} />
                          ) : (
                            <XCircle size={14} color="#ef4444" style={{ flexShrink: 0 }} />
                          )}
                          <span style={{
                            fontWeight: 500,
                            fontSize: '12px',
                            color: isUnmatched ? '#dc2626' : textColor,
                            fontFamily: 'ui-monospace, monospace',
                          }}>
                            {result.csvTableName}
                          </span>
                          {result.matchedScriptTable && (
                            <>
                              <span style={{ color: '#22c55e', fontSize: '11px' }}>
                                → {result.matchedScriptTable}
                              </span>
                              {result.matchMethod === 'columns' && (
                                <span style={{
                                  backgroundColor: isDarkTheme ? '#1e3a5f' : '#dbeafe',
                                  color: isDarkTheme ? '#93c5fd' : '#1d4ed8',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '10px',
                                  fontWeight: 500
                                }}>
                                  {Math.round((result.matchScore || 0) * 100)}%
                                </span>
                              )}
                            </>
                          )}
                          {!result.matchedScriptTable && (
                            <span style={{ color: '#ef4444', fontSize: '11px' }}>(no match)</span>
                          )}
                          <span style={{
                            marginLeft: 'auto',
                            fontSize: '10px',
                            color: textSecondary,
                            padding: '2px 6px',
                            backgroundColor: cardBg,
                            borderRadius: '10px',
                          }}>
                            {result.matchedColumns.length}/{result.matchedColumns.length + result.unmatchedCsvColumns.length} cols
                          </span>
                        </div>

                        {/* Expanded column details */}
                        {isExpanded && result.matchedScriptTable && (
                          <div style={{
                            padding: '10px 14px 12px 40px',
                            backgroundColor: cardBg,
                            borderBottom: `1px solid ${borderColor}`,
                            fontSize: '11px',
                          }}>
                            {result.matchedColumns.length > 0 && (
                              <div style={{ marginBottom: '8px' }}>
                                <span style={{ color: '#22c55e', fontWeight: 500 }}>Matched:</span>
                                <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                  {result.matchedColumns.map((m, i) => (
                                    <span key={i} style={{
                                      padding: '2px 6px',
                                      backgroundColor: isDarkTheme ? '#064e3b' : '#dcfce7',
                                      color: isDarkTheme ? '#6ee7b7' : '#166534',
                                      borderRadius: '4px',
                                      fontSize: '10px',
                                      fontFamily: 'ui-monospace, monospace',
                                    }}>
                                      {m.scriptColumn}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {result.unmatchedCsvColumns.length > 0 && (
                              <div style={{ marginBottom: '8px' }}>
                                <span style={{ color: '#f59e0b', fontWeight: 500 }}>CSV not matched:</span>
                                <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                  {result.unmatchedCsvColumns.map((col, i) => (
                                    <span key={i} style={{
                                      padding: '2px 6px',
                                      backgroundColor: isDarkTheme ? '#78350f' : '#fef3c7',
                                      color: isDarkTheme ? '#fcd34d' : '#92400e',
                                      borderRadius: '4px',
                                      fontSize: '10px',
                                      fontFamily: 'ui-monospace, monospace',
                                    }}>
                                      {col}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {result.unmatchedScriptColumns.length > 0 && (
                              <div>
                                <span style={{ color: textSecondary, fontWeight: 500 }}>Script without data:</span>
                                <div style={{ marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                  {result.unmatchedScriptColumns.map((col, i) => (
                                    <span key={i} style={{
                                      padding: '2px 6px',
                                      backgroundColor: isDarkTheme ? '#334155' : '#e2e8f0',
                                      color: textSecondary,
                                      borderRadius: '4px',
                                      fontSize: '10px',
                                      fontFamily: 'ui-monospace, monospace',
                                    }}>
                                      {col}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {isExpanded && !result.matchedScriptTable && (
                          <div style={{
                            padding: '10px 14px 10px 40px',
                            backgroundColor: isDarkTheme ? 'rgba(239, 68, 68, 0.08)' : '#fef2f2',
                            borderBottom: `1px solid ${borderColor}`,
                            fontSize: '11px',
                            color: '#dc2626',
                          }}>
                            No matching table found. This data will not be imported.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Script tables without sample data */}
              {scriptTablesWithoutData.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    color: '#dc2626',
                    fontSize: '13px',
                    fontWeight: 500,
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <XCircle size={14} />
                    Tables Without Sample Data ({scriptTablesWithoutData.length})
                  </div>
                  <div style={{
                    maxHeight: '150px',
                    overflow: 'auto',
                    borderRadius: '8px',
                    border: `1px solid ${isDarkTheme ? '#7f1d1d' : '#fecaca'}`,
                    backgroundColor: isDarkTheme ? 'rgba(239, 68, 68, 0.08)' : '#fef2f2',
                  }}>
                    {scriptTablesWithoutData.map((table, idx) => {
                      const isExpanded = expandedTables.has(matchResults.length + idx);

                      return (
                        <div key={table.id}>
                          <div
                            onClick={() => toggleTableExpand(matchResults.length + idx)}
                            style={{
                              padding: '8px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              borderBottom: idx < scriptTablesWithoutData.length - 1
                                ? `1px solid ${isDarkTheme ? '#7f1d1d' : '#fecaca'}`
                                : 'none',
                              transition: 'background-color 0.15s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = isDarkTheme
                                ? 'rgba(239, 68, 68, 0.15)'
                                : '#fee2e2';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            {isExpanded
                              ? <ChevronDown size={12} style={{ color: '#dc2626', flexShrink: 0 }} />
                              : <ChevronRight size={12} style={{ color: '#dc2626', flexShrink: 0 }} />
                            }
                            <XCircle size={12} color="#dc2626" style={{ flexShrink: 0 }} />
                            <span style={{
                              fontWeight: 500,
                              fontSize: '11px',
                              color: '#dc2626',
                              fontFamily: 'ui-monospace, monospace',
                            }}>
                              {table.schema ? `${table.schema}.` : ''}{table.tableName}
                            </span>
                            <span style={{
                              marginLeft: 'auto',
                              fontSize: '10px',
                              color: '#dc2626',
                              padding: '2px 6px',
                              backgroundColor: isDarkTheme ? '#7f1d1d' : '#fecaca',
                              borderRadius: '10px',
                            }}>
                              {table.columns.length} cols
                            </span>
                          </div>

                          {isExpanded && (
                            <div style={{
                              padding: '6px 12px 8px 32px',
                              backgroundColor: isDarkTheme ? 'rgba(127, 29, 29, 0.2)' : '#fee2e2',
                              borderBottom: idx < scriptTablesWithoutData.length - 1
                                ? `1px solid ${isDarkTheme ? '#7f1d1d' : '#fecaca'}`
                                : 'none',
                            }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {table.columns.map((col, i) => (
                                  <span key={i} style={{
                                    padding: '2px 6px',
                                    backgroundColor: isDarkTheme ? '#7f1d1d' : '#fecaca',
                                    color: isDarkTheme ? '#fca5a5' : '#991b1b',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    fontFamily: 'ui-monospace, monospace',
                                  }}>
                                    {col.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Warnings from parse */}
              {parsedData && parsedData.errors.length > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: isDarkTheme ? '#451a03' : '#fffbeb',
                  border: `1px solid ${isDarkTheme ? '#92400e' : '#fde68a'}`,
                }}>
                  <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <div style={{ color: '#f59e0b', fontWeight: 500, fontSize: '13px', marginBottom: '4px' }}>
                      Warnings
                    </div>
                    {parsedData.errors.map((err, i) => (
                      <div key={i} style={{ color: textSecondary, fontSize: '12px' }}>{err}</div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${borderColor}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
        }}>
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
            onClick={handleAttach}
            disabled={!fileName || matchResults.length === 0 || totalMatched === 0}
            style={{
              padding: '10px 20px',
              backgroundColor: (fileName && matchResults.length > 0 && totalMatched > 0)
                ? '#22c55e'
                : (isDarkTheme ? '#334155' : '#e2e8f0'),
              color: (fileName && matchResults.length > 0 && totalMatched > 0)
                ? '#ffffff'
                : textSecondary,
              border: 'none',
              borderRadius: '6px',
              cursor: (fileName && matchResults.length > 0 && totalMatched > 0)
                ? 'pointer'
                : 'not-allowed',
              fontSize: '13px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileSpreadsheet size={14} />
            Attach Sample Data
          </button>
        </div>
      </div>
    </div>
  );
}
