import { useState } from 'react';
import { Script, MasterCodeCategory } from '../types';
import { X, Check, AlertTriangle, Trash2 } from 'lucide-react';

interface ImportMasterCodeCategoryModalProps {
  script: Script;
  onClose: () => void;
  onImport: (updatedScript: Script) => void;
  isDarkTheme?: boolean;
  darkThemeVariant?: 'slate' | 'vscode-gray';
}

interface ParsedEntry {
  key: string;
  definition: string;
  isDuplicate: boolean;
}

export default function ImportMasterCodeCategoryModal({
  script,
  onClose,
  onImport,
  isDarkTheme = false,
  darkThemeVariant = 'slate'
}: ImportMasterCodeCategoryModalProps) {
  const [inputText, setInputText] = useState('');
  const [parsedResults, setParsedResults] = useState<ParsedEntry[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [existingCodes, setExistingCodes] = useState<MasterCodeCategory[]>(script.masterCodeCategories || []);

  // Theme colors
  const isVscode = darkThemeVariant === 'vscode-gray';
  const bgColor = isDarkTheme ? (isVscode ? '#1e1e1e' : '#1e293b') : '#ffffff';
  const textColor = isDarkTheme ? '#e4e4e7' : '#18181b';
  const textSecondary = isDarkTheme ? '#a1a1aa' : '#71717a';
  const borderColor = isDarkTheme ? (isVscode ? '#3c3c3c' : '#334155') : '#e5e7eb';
  const cardBg = isDarkTheme ? (isVscode ? '#252526' : '#0f172a') : '#f9fafb';

  const handleParse = () => {
    setParseError(null);
    const lines = inputText.trim().split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      setParseError('Please enter at least one line in the format: KEY: definition');
      return;
    }

    const results: ParsedEntry[] = [];
    const errors: string[] = [];
    const existingKeys = new Set([...existingCodes.map(c => c.key.toUpperCase())]);
    const seenKeys = new Set<string>();

    lines.forEach((line, idx) => {
      // Support formats: KEY: definition  or  KEY | definition  or  KEY\tdefinition
      const match = line.match(/^([^:|]+)[:|]\s*(.+)$/) || line.match(/^([^\t]+)\t+(.+)$/);

      if (!match) {
        errors.push(`Line ${idx + 1}: Invalid format - expected "KEY: definition" or "KEY | definition"`);
        return;
      }

      const key = match[1].trim();
      const definition = match[2].trim();

      if (!key || !definition) {
        errors.push(`Line ${idx + 1}: Both key and definition are required`);
        return;
      }

      const upperKey = key.toUpperCase();
      const isDuplicate = existingKeys.has(upperKey) || seenKeys.has(upperKey);
      seenKeys.add(upperKey);

      results.push({ key, definition, isDuplicate });
    });

    if (errors.length > 0 && results.length === 0) {
      setParseError(errors.join('; '));
      return;
    }

    setParsedResults(results);
  };

  const handleApply = () => {
    if (parsedResults.length === 0) return;

    // Merge: update existing keys, add new ones
    const updatedMap = new Map<string, MasterCodeCategory>();
    existingCodes.forEach(c => updatedMap.set(c.key.toUpperCase(), c));
    parsedResults.forEach(r => {
      updatedMap.set(r.key.toUpperCase(), { key: r.key, definition: r.definition });
    });

    const merged = Array.from(updatedMap.values());
    setExistingCodes(merged);

    const updatedScript: Script = {
      ...script,
      masterCodeCategories: merged,
    };

    onImport(updatedScript);
  };

  const handleRemove = (key: string) => {
    const updated = existingCodes.filter(c => c.key.toUpperCase() !== key.toUpperCase());
    setExistingCodes(updated);
    const updatedScript: Script = { ...script, masterCodeCategories: updated };
    onImport(updatedScript);
  };

  const newCount = parsedResults.filter(r => !r.isDuplicate).length;
  const updateCount = parsedResults.filter(r => r.isDuplicate).length;

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: bgColor, borderRadius: '12px',
          width: '620px', maxHeight: '85vh',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${borderColor}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ margin: 0, color: textColor, fontSize: '18px', fontWeight: 600 }}>
              Import Master Code Categories
            </h2>
            <p style={{ margin: '4px 0 0 0', color: textSecondary, fontSize: '13px' }}>
              {script.name} &middot; {existingCodes.length} existing categor{existingCodes.length !== 1 ? 'ies' : 'y'}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: textSecondary, cursor: 'pointer',
            padding: '4px', display: 'flex', alignItems: 'center',
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {/* Existing Categories */}
          {existingCodes.length > 0 && parsedResults.length === 0 && (
            <div style={{
              marginBottom: '16px', padding: '16px', borderRadius: '8px',
              backgroundColor: cardBg, border: `1px solid ${borderColor}`,
            }}>
              <div style={{ color: textColor, fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>
                Existing Categories ({existingCodes.length})
              </div>
              <div style={{ maxHeight: '150px', overflowY: 'auto', borderRadius: '6px', border: `1px solid ${borderColor}` }}>
                {existingCodes.map((code, idx) => (
                  <div key={idx} style={{
                    padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderBottom: idx < existingCodes.length - 1 ? `1px solid ${borderColor}` : 'none',
                    fontSize: '12px',
                  }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 600, color: textColor }}>{code.key}</span>
                      <span style={{ color: textSecondary, marginLeft: '12px' }}>{code.definition}</span>
                    </div>
                    <button onClick={() => handleRemove(code.key)} style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                      color: textSecondary, display: 'flex', alignItems: 'center',
                    }} title="Remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Input Card */}
          <div style={{
            padding: '16px', borderRadius: '8px',
            backgroundColor: cardBg, border: `1px solid ${borderColor}`, marginBottom: '16px',
          }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: textColor, fontSize: '13px', fontWeight: 500, marginBottom: '4px' }}>
                Paste Master Code Categories
              </div>
              <div style={{ color: textSecondary, fontSize: '12px' }}>
                Format: <code style={{
                  backgroundColor: isDarkTheme ? '#334155' : '#e2e8f0',
                  padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px',
                }}>KEY: definition</code>
                {' '}or{' '}
                <code style={{
                  backgroundColor: isDarkTheme ? '#334155' : '#e2e8f0',
                  padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '11px',
                }}>KEY | definition</code>
              </div>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setParsedResults([]);
                setParseError(null);
              }}
              placeholder={"ACCT: Account related master codes\nTXN: Transaction related master codes\nREF: Reference data master codes\nSEC: Security and access control codes"}
              style={{
                width: '100%', minHeight: '100px', padding: '12px', borderRadius: '6px',
                border: `1px solid ${borderColor}`, backgroundColor: bgColor, color: textColor,
                fontFamily: 'ui-monospace, monospace', fontSize: '12px', resize: 'vertical', outline: 'none',
              }}
            />
          </div>

          {/* Parse Error */}
          {parseError && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '12px 16px', borderRadius: '8px',
              backgroundColor: isDarkTheme ? '#450a0a' : '#fef2f2',
              border: `1px solid ${isDarkTheme ? '#7f1d1d' : '#fecaca'}`,
              marginBottom: '16px',
            }}>
              <AlertTriangle size={16} color={isDarkTheme ? '#fca5a5' : '#dc2626'} />
              <span style={{ color: isDarkTheme ? '#fca5a5' : '#dc2626', fontSize: '13px' }}>{parseError}</span>
            </div>
          )}

          {/* Parse Button */}
          {parsedResults.length === 0 && (
            <button
              onClick={handleParse}
              disabled={!inputText.trim()}
              style={{
                width: '100%', padding: '12px 16px',
                backgroundColor: inputText.trim() ? '#3b82f6' : (isDarkTheme ? '#334155' : '#e2e8f0'),
                color: inputText.trim() ? '#ffffff' : textSecondary,
                border: 'none', borderRadius: '8px',
                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                fontSize: '14px', fontWeight: 500,
              }}
            >
              Parse & Preview
            </button>
          )}

          {/* Results Preview */}
          {parsedResults.length > 0 && (
            <>
              <div style={{
                display: 'flex', gap: '16px', marginBottom: '16px',
                padding: '14px 16px', backgroundColor: cardBg, borderRadius: '8px',
                border: `1px solid ${borderColor}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={16} color="#22c55e" />
                  <span style={{ fontWeight: 600, color: '#22c55e' }}>{newCount}</span>
                  <span style={{ color: textSecondary, fontSize: '13px' }}>new</span>
                </div>
                {updateCount > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={16} color="#f59e0b" />
                    <span style={{ fontWeight: 600, color: '#f59e0b' }}>{updateCount}</span>
                    <span style={{ color: textSecondary, fontSize: '13px' }}>will update existing</span>
                  </div>
                )}
              </div>

              <div style={{
                borderRadius: '8px', border: `1px solid ${borderColor}`,
                overflow: 'hidden', maxHeight: '200px', overflowY: 'auto',
              }}>
                {parsedResults.map((result, idx) => (
                  <div key={idx} style={{
                    padding: '10px 14px',
                    borderBottom: idx < parsedResults.length - 1 ? `1px solid ${borderColor}` : 'none',
                    backgroundColor: result.isDuplicate
                      ? (isDarkTheme ? 'rgba(245, 158, 11, 0.08)' : '#fffbeb')
                      : 'transparent',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Check size={14} color={result.isDuplicate ? '#f59e0b' : '#22c55e'} />
                      <span style={{
                        fontFamily: 'ui-monospace, monospace', fontSize: '12px', fontWeight: 600,
                        color: textColor,
                      }}>
                        {result.key}
                      </span>
                      {result.isDuplicate && (
                        <span style={{
                          fontSize: '10px', color: '#f59e0b',
                          backgroundColor: isDarkTheme ? '#451a03' : '#fef3c7',
                          padding: '2px 6px', borderRadius: '4px',
                        }}>
                          update
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12px', color: textSecondary, marginTop: '4px', marginLeft: '22px' }}>
                      {result.definition}
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
            padding: '16px 24px', borderTop: `1px solid ${borderColor}`,
            display: 'flex', justifyContent: 'flex-end', gap: '12px',
          }}>
            <button
              onClick={() => { setParsedResults([]); setParseError(null); }}
              style={{
                padding: '10px 20px', backgroundColor: 'transparent', color: textColor,
                border: `1px solid ${borderColor}`, borderRadius: '6px', cursor: 'pointer',
                fontSize: '13px', fontWeight: 500,
              }}
            >
              Back
            </button>
            <button
              onClick={handleApply}
              disabled={parsedResults.length === 0}
              style={{
                padding: '10px 20px',
                backgroundColor: parsedResults.length > 0 ? '#3b82f6' : (isDarkTheme ? '#334155' : '#e2e8f0'),
                color: parsedResults.length > 0 ? '#ffffff' : textSecondary,
                border: 'none', borderRadius: '6px',
                cursor: parsedResults.length > 0 ? 'pointer' : 'not-allowed',
                fontSize: '13px', fontWeight: 500,
              }}
            >
              Apply {parsedResults.length} Categor{parsedResults.length !== 1 ? 'ies' : 'y'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
