import { useState } from 'react';
import { Script } from '../types';
import { X, Check, AlertTriangle, Upload } from 'lucide-react';

interface ImportTableDescriptionsModalProps {
  script: Script;
  onClose: () => void;
  onImport: (updatedScript: Script) => void;
  isDarkTheme?: boolean;
  darkThemeVariant?: 'slate' | 'vscode-gray';
}

interface ParsedTableData {
  tableName: string;
  description: string | null;
  domain: string | null;
  toIgnore: boolean | null;
  matched: boolean;
  matchedTableName: string | null;
  isSource: boolean;
}

export default function ImportTableDescriptionsModal({
  script,
  onClose,
  onImport,
  isDarkTheme = false,
  darkThemeVariant = 'slate'
}: ImportTableDescriptionsModalProps) {
  const [inputText, setInputText] = useState('');
  const [parsedResults, setParsedResults] = useState<ParsedTableData[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  // Theme colors (matching Settings)
  const isVscode = darkThemeVariant === 'vscode-gray';
  const bgColor = isDarkTheme ? (isVscode ? '#1e1e1e' : '#1e293b') : '#ffffff';
  const textColor = isDarkTheme ? '#e4e4e7' : '#18181b';
  const textSecondary = isDarkTheme ? '#a1a1aa' : '#71717a';
  const borderColor = isDarkTheme ? (isVscode ? '#3c3c3c' : '#334155') : '#e5e7eb';
  const cardBg = isDarkTheme ? (isVscode ? '#252526' : '#0f172a') : '#f9fafb';

  // Get all tables
  const allTables = [
    ...script.data.targets.map(t => ({ ...t, isSource: false })),
    ...script.data.sources.map(t => ({ ...t, isSource: true })),
  ];

  // Find matching table (case-insensitive)
  const findMatchingTable = (tableName: string) => {
    const normalizedInput = tableName.trim().toUpperCase();

    // Try exact match first
    let match = allTables.find(t => t.tableName.toUpperCase() === normalizedInput);
    if (match) return match;

    // Try partial match (input contains table name or vice versa)
    match = allTables.find(t =>
      t.tableName.toUpperCase().includes(normalizedInput) ||
      normalizedInput.includes(t.tableName.toUpperCase())
    );

    return match || null;
  };

  // Parse the input text
  const handleParse = () => {
    setParseError(null);
    const lines = inputText.trim().split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      setParseError('Please enter at least one line in the format: TABLE_NAME | Description | Domain | ToIgnore');
      return;
    }

    const results: ParsedTableData[] = [];
    const errors: string[] = [];

    lines.forEach((line, idx) => {
      // Skip header line if it looks like a header
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes('table') && lowerLine.includes('description') && idx === 0) {
        return;
      }

      // Split by pipe separator
      const parts = line.split('|').map(p => p.trim());

      if (parts.length < 1 || !parts[0]) {
        errors.push(`Line ${idx + 1}: Missing table name`);
        return;
      }

      const tableName = parts[0].trim();
      const description = parts[1]?.trim() || null;
      const domain = parts[2]?.trim() || null;
      const toIgnoreRaw = parts[3]?.trim().toUpperCase();

      // Parse toIgnore: Y/YES/TRUE/1 = true, N/NO/FALSE/0 = false, empty = null
      let toIgnore: boolean | null = null;
      if (toIgnoreRaw === 'Y' || toIgnoreRaw === 'YES' || toIgnoreRaw === 'TRUE' || toIgnoreRaw === '1') {
        toIgnore = true;
      } else if (toIgnoreRaw === 'N' || toIgnoreRaw === 'NO' || toIgnoreRaw === 'FALSE' || toIgnoreRaw === '0') {
        toIgnore = false;
      }

      // Check if at least one field has a value
      if (!description && !domain && toIgnore === null) {
        errors.push(`Line ${idx + 1}: No data to import (all fields empty)`);
        return;
      }

      const matchedTable = findMatchingTable(tableName);

      results.push({
        tableName: tableName.toUpperCase(),
        description,
        domain,
        toIgnore,
        matched: !!matchedTable,
        matchedTableName: matchedTable?.tableName || null,
        isSource: matchedTable?.isSource || false,
      });
    });

    if (errors.length > 0 && results.length === 0) {
      setParseError(errors.join('; '));
      return;
    }

    setParsedResults(results);
  };

  // Apply the data to the script
  const handleApply = () => {
    const matchedResults = parsedResults.filter(r => r.matched);
    if (matchedResults.length === 0) return;

    const updatedScript = {
      ...script,
      data: {
        targets: script.data.targets.map(table => {
          const match = matchedResults.find(
            r => !r.isSource && r.matchedTableName?.toUpperCase() === table.tableName.toUpperCase()
          );
          if (match) {
            return {
              ...table,
              ...(match.description !== null && { description: match.description }),
              ...(match.domain !== null && { schema: match.domain }),
              ...(match.toIgnore !== null && { toIgnore: match.toIgnore }),
            };
          }
          return table;
        }),
        sources: script.data.sources.map(table => {
          const match = matchedResults.find(
            r => r.isSource && r.matchedTableName?.toUpperCase() === table.tableName.toUpperCase()
          );
          if (match) {
            return {
              ...table,
              ...(match.description !== null && { description: match.description }),
              ...(match.domain !== null && { schema: match.domain }),
              ...(match.toIgnore !== null && { toIgnore: match.toIgnore }),
            };
          }
          return table;
        })
      }
    };

    onImport(updatedScript);
  };

  const matchedCount = parsedResults.filter(r => r.matched).length;
  const unmatchedCount = parsedResults.filter(r => !r.matched).length;

  // Count what fields will be updated
  const descCount = parsedResults.filter(r => r.matched && r.description !== null).length;
  const domainCount = parsedResults.filter(r => r.matched && r.domain !== null).length;
  const ignoreCount = parsedResults.filter(r => r.matched && r.toIgnore !== null).length;

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
          width: '700px',
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
            <h2 style={{ margin: 0, color: textColor, fontSize: '18px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Upload size={20} />
              Import Table Data
            </h2>
            <p style={{ margin: '4px 0 0 0', color: textSecondary, fontSize: '13px' }}>
              {script.name} • {allTables.length} tables available
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
                Paste Table Data
              </div>
              <div style={{ color: textSecondary, fontSize: '12px', lineHeight: '1.6' }}>
                Format: <code style={{
                  backgroundColor: isDarkTheme ? '#334155' : '#e2e8f0',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                }}>TABLE_NAME | Description | Domain | ToIgnore</code>
                <br />
                <span style={{ fontSize: '11px', color: textSecondary }}>
                  • Use pipe (|) as separator • Empty fields are skipped • ToIgnore: Y/N
                </span>
              </div>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setParsedResults([]);
                setParseError(null);
              }}
              placeholder="USERS | User accounts and profiles | CORE | N
ORDERS | Order transactions history | SALES | N
AUDIT_LOG | System audit trail | SYSTEM | Y
TEMP_DATA | Temporary processing table | | Y"
              style={{
                width: '100%',
                minHeight: '120px',
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
                flexWrap: 'wrap',
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
                <div style={{ borderLeft: `1px solid ${borderColor}`, paddingLeft: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {descCount > 0 && (
                    <span style={{ fontSize: '12px', color: textSecondary }}>
                      <strong style={{ color: textColor }}>{descCount}</strong> descriptions
                    </span>
                  )}
                  {domainCount > 0 && (
                    <span style={{ fontSize: '12px', color: textSecondary }}>
                      <strong style={{ color: textColor }}>{domainCount}</strong> domains
                    </span>
                  )}
                  {ignoreCount > 0 && (
                    <span style={{ fontSize: '12px', color: textSecondary }}>
                      <strong style={{ color: textColor }}>{ignoreCount}</strong> ignore flags
                    </span>
                  )}
                </div>
              </div>

              {/* Results List */}
              <div style={{
                borderRadius: '8px',
                border: `1px solid ${borderColor}`,
                overflow: 'hidden',
                maxHeight: '250px',
                overflowY: 'auto',
              }}>
                {parsedResults.map((result, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 14px',
                      borderBottom: idx < parsedResults.length - 1 ? `1px solid ${borderColor}` : 'none',
                      backgroundColor: !result.matched
                        ? (isDarkTheme ? 'rgba(245, 158, 11, 0.08)' : '#fffbeb')
                        : 'transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
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
                        {result.tableName}
                      </span>
                      {result.matched && result.matchedTableName !== result.tableName && (
                        <span style={{
                          fontSize: '10px',
                          color: '#22c55e',
                          backgroundColor: isDarkTheme ? '#052e16' : '#dcfce7',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}>
                          → {result.matchedTableName}
                        </span>
                      )}
                      {result.matched && result.isSource && (
                        <span style={{
                          fontSize: '10px',
                          padding: '1px 4px',
                          borderRadius: '3px',
                          backgroundColor: isDarkTheme ? '#3b82f6' : '#dbeafe',
                          color: isDarkTheme ? '#dbeafe' : '#1d4ed8',
                        }}>SRC</span>
                      )}
                      {!result.matched && (
                        <span style={{
                          fontSize: '10px',
                          color: '#f59e0b',
                          backgroundColor: isDarkTheme ? '#451a03' : '#fef3c7',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}>
                          table not found
                        </span>
                      )}
                    </div>
                    {/* Show what will be imported */}
                    <div style={{
                      fontSize: '12px',
                      color: textSecondary,
                      marginLeft: '22px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}>
                      {result.description !== null && (
                        <span>
                          <strong style={{ color: textColor }}>Desc:</strong> {result.description || '(empty)'}
                        </span>
                      )}
                      {result.domain !== null && (
                        <span>
                          <strong style={{ color: textColor }}>Domain:</strong> {result.domain || '(empty)'}
                        </span>
                      )}
                      {result.toIgnore !== null && (
                        <span>
                          <strong style={{ color: textColor }}>Ignore:</strong> {result.toIgnore ? 'Y' : 'N'}
                        </span>
                      )}
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
              Apply to {matchedCount} Table{matchedCount !== 1 ? 's' : ''}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
