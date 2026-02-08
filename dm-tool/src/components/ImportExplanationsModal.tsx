import { useState } from 'react';
import { Script } from '../types';
import { X, Check, AlertTriangle } from 'lucide-react';

interface ImportExplanationsModalProps {
  script: Script;
  onClose: () => void;
  onImport: (updatedScript: Script) => void;
  isDarkTheme?: boolean;
  darkThemeVariant?: 'slate' | 'vscode-gray';
}

interface ParsedExplanation {
  tableName: string;
  columnName: string;
  explanation: string;
  matched: boolean;
  tableFound: boolean;
  columnFound: boolean;
}

export default function ImportExplanationsModal({
  script,
  onClose,
  onImport,
  isDarkTheme = false,
  darkThemeVariant = 'slate'
}: ImportExplanationsModalProps) {
  const [inputText, setInputText] = useState('');
  const [parsedResults, setParsedResults] = useState<ParsedExplanation[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  // Theme colors (matching Settings)
  const isVscode = darkThemeVariant === 'vscode-gray';
  const bgColor = isDarkTheme ? (isVscode ? '#1e1e1e' : '#1e293b') : '#ffffff';
  const textColor = isDarkTheme ? '#e4e4e7' : '#18181b';
  const textSecondary = isDarkTheme ? '#a1a1aa' : '#71717a';
  const borderColor = isDarkTheme ? (isVscode ? '#3c3c3c' : '#334155') : '#e5e7eb';
  const cardBg = isDarkTheme ? (isVscode ? '#252526' : '#0f172a') : '#f9fafb';

  // Parse the input text
  const handleParse = () => {
    setParseError(null);
    const lines = inputText.trim().split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      setParseError('Please enter at least one line in the format: TABLE.COLUMN: explanation');
      return;
    }

    const results: ParsedExplanation[] = [];
    const errors: string[] = [];

    lines.forEach((line, idx) => {
      const match = line.match(/^([^.]+)\.([^:]+):\s*(.+)$/);

      if (!match) {
        errors.push(`Line ${idx + 1}: Invalid format`);
        return;
      }

      const [, tableName, columnName, explanation] = match;
      const tableNameTrimmed = tableName.trim().toUpperCase();
      const columnNameTrimmed = columnName.trim().toUpperCase();
      const explanationTrimmed = explanation.trim();

      const allTables = [...script.data.targets, ...script.data.sources];
      const table = allTables.find(t =>
        t.tableName.toUpperCase() === tableNameTrimmed
      );

      const column = table?.columns.find(c =>
        c.name.toUpperCase() === columnNameTrimmed
      );

      results.push({
        tableName: tableNameTrimmed,
        columnName: columnNameTrimmed,
        explanation: explanationTrimmed,
        matched: !!column,
        tableFound: !!table,
        columnFound: !!column
      });
    });

    if (errors.length > 0 && results.length === 0) {
      setParseError(errors.join('; '));
      return;
    }

    setParsedResults(results);
  };

  // Apply the explanations to the script
  const handleApply = () => {
    const matchedResults = parsedResults.filter(r => r.matched);
    if (matchedResults.length === 0) return;

    const updatedScript = {
      ...script,
      data: {
        targets: script.data.targets.map(table => ({
          ...table,
          columns: table.columns.map(col => {
            const match = matchedResults.find(
              r => r.tableName === table.tableName.toUpperCase() &&
                   r.columnName === col.name.toUpperCase()
            );
            if (match) {
              return { ...col, explanation: match.explanation };
            }
            return col;
          })
        })),
        sources: script.data.sources.map(table => ({
          ...table,
          columns: table.columns.map(col => {
            const match = matchedResults.find(
              r => r.tableName === table.tableName.toUpperCase() &&
                   r.columnName === col.name.toUpperCase()
            );
            if (match) {
              return { ...col, explanation: match.explanation };
            }
            return col;
          })
        }))
      }
    };

    onImport(updatedScript);
  };

  const matchedCount = parsedResults.filter(r => r.matched).length;
  const unmatchedCount = parsedResults.filter(r => !r.matched).length;

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
          width: '560px',
          maxHeight: '80vh',
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
              Import Explanations
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
          {/* Input Card */}
          <div style={{
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: cardBg,
            border: `1px solid ${borderColor}`,
            marginBottom: '16px',
          }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: textColor, fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                Paste Explanations
              </div>
              <div style={{ color: textSecondary, fontSize: '12px' }}>
                Format: <code style={{
                  backgroundColor: isDarkTheme ? '#334155' : '#e2e8f0',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                }}>TABLE.COLUMN: explanation</code>
              </div>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setParsedResults([]);
                setParseError(null);
              }}
              placeholder="USERS.ID: Primary key for user identification
USERS.EMAIL: User email address
ORDERS.AMOUNT: Total order amount in USD"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                borderRadius: '6px',
                border: `1px solid ${borderColor}`,
                backgroundColor: bgColor,
                color: textColor,
                fontFamily: 'ui-monospace, monospace',
                fontSize: '12px',
                resize: 'vertical',
                outline: 'none',
              }}
            />
          </div>

          {/* Parse Error */}
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
              <AlertTriangle size={16} color={isDarkTheme ? '#fca5a5' : '#dc2626'} />
              <span style={{ color: isDarkTheme ? '#fca5a5' : '#dc2626', fontSize: '13px' }}>
                {parseError}
              </span>
            </div>
          )}

          {/* Parse Button */}
          {parsedResults.length === 0 && (
            <button
              onClick={handleParse}
              disabled={!inputText.trim()}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: inputText.trim() ? '#3b82f6' : (isDarkTheme ? '#334155' : '#e2e8f0'),
                color: inputText.trim() ? '#ffffff' : textSecondary,
                border: 'none',
                borderRadius: '8px',
                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'background-color 0.2s',
              }}
            >
              Parse & Preview
            </button>
          )}

          {/* Results Preview */}
          {parsedResults.length > 0 && (
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
                  <Check size={16} color="#22c55e" />
                  <span style={{ fontWeight: 600, color: '#22c55e' }}>{matchedCount}</span>
                  <span style={{ color: textSecondary, fontSize: '13px' }}>matched</span>
                </div>
                {unmatchedCount > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={16} color="#f59e0b" />
                    <span style={{ fontWeight: 600, color: '#f59e0b' }}>{unmatchedCount}</span>
                    <span style={{ color: textSecondary, fontSize: '13px' }}>not found</span>
                  </div>
                )}
              </div>

              {/* Results List */}
              <div style={{
                borderRadius: '8px',
                border: `1px solid ${borderColor}`,
                overflow: 'hidden',
                maxHeight: '200px',
                overflowY: 'auto',
              }}>
                {parsedResults.map((result, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 14px',
                      borderBottom: idx < parsedResults.length - 1 ? `1px solid ${borderColor}` : 'none',
                      backgroundColor: !result.matched
                        ? (isDarkTheme ? 'rgba(245, 158, 11, 0.08)' : '#fffbeb')
                        : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {result.matched ? (
                        <Check size={14} color="#22c55e" />
                      ) : (
                        <AlertTriangle size={14} color="#f59e0b" />
                      )}
                      <span style={{
                        fontFamily: 'ui-monospace, monospace',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: result.matched ? textColor : '#f59e0b',
                      }}>
                        {result.tableName}.{result.columnName}
                      </span>
                      {!result.matched && (
                        <span style={{
                          fontSize: '10px',
                          color: '#f59e0b',
                          backgroundColor: isDarkTheme ? '#451a03' : '#fef3c7',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}>
                          {!result.tableFound ? 'table not found' : 'column not found'}
                        </span>
                      )}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: textSecondary,
                      marginTop: '4px',
                      marginLeft: '22px',
                    }}>
                      {result.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {parsedResults.length > 0 && (
          <div style={{
            padding: '16px 24px',
            borderTop: `1px solid ${borderColor}`,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}>
            <button
              onClick={() => {
                setParsedResults([]);
                setParseError(null);
              }}
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
              Back
            </button>
            <button
              onClick={handleApply}
              disabled={matchedCount === 0}
              style={{
                padding: '10px 20px',
                backgroundColor: matchedCount > 0 ? '#3b82f6' : (isDarkTheme ? '#334155' : '#e2e8f0'),
                color: matchedCount > 0 ? '#ffffff' : textSecondary,
                border: 'none',
                borderRadius: '6px',
                cursor: matchedCount > 0 ? 'pointer' : 'not-allowed',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              Apply {matchedCount} Explanation{matchedCount !== 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
