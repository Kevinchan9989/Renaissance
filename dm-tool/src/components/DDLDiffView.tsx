import { useState, useMemo, useEffect } from 'react';
import { Pencil, Save, X, Database } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import { Table, ScriptType, ColumnDiff } from '../types';
import { generateTableDDL } from '../utils/ddlGenerator';
import CodeEditor from './CodeEditor';

function getPrismLanguage(scriptType: ScriptType): string {
  switch (scriptType) {
    case 'postgresql':
    case 'oracle':
      return 'sql';
    case 'dbml':
      return 'javascript';
    default:
      return 'sql';
  }
}

function highlightLine(text: string, lang: string): string {
  try {
    return Prism.highlight(text, Prism.languages[lang], lang);
  } catch {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}

interface DDLDiffViewProps {
  sourceTable: Table | null;
  targetTable: Table | null;
  scriptType: ScriptType;
  targetScriptType: ScriptType;
  changes: ColumnDiff[];
  pkDiff: boolean;
  canEditSource: boolean;
  canEditTarget: boolean;
  onSaveSource?: (newDDL: string) => void;
  onSaveTarget?: (newDDL: string) => void;
}

type LineHighlight = 'none' | 'modified' | 'added' | 'deleted';

interface AnnotatedLine {
  text: string;
  highlight: LineHighlight;
}

/**
 * Given a DDL string and the column diff changes, annotate each line with a highlight.
 * We detect column lines by matching column names from the changes array.
 */
function annotateDDLLines(
  ddl: string,
  changes: ColumnDiff[],
  side: 'source' | 'target',
  pkDiff: boolean
): AnnotatedLine[] {
  const lines = ddl.split('\n');

  // Build lookup from column name (uppercase) to diff type
  const colDiffMap = new Map<string, LineHighlight>();
  for (const change of changes) {
    const colName = change.col.toUpperCase();
    switch (change.type) {
      case 'MODIFIED':
      case 'SOFT':
        colDiffMap.set(colName, 'modified');
        break;
      case 'ADDED':
        // Added in target means: target line is green, source doesn't have it
        colDiffMap.set(colName, side === 'target' ? 'added' : 'none');
        break;
      case 'DELETED':
        // Deleted from target means: source line is red, target doesn't have it
        colDiffMap.set(colName, side === 'source' ? 'deleted' : 'none');
        break;
      default:
        colDiffMap.set(colName, 'none');
    }
  }

  return lines.map(line => {
    const trimmed = line.trim();

    // Skip empty lines, CREATE TABLE header, closing paren, ALTER TABLE lines
    if (!trimmed || trimmed.startsWith('CREATE TABLE') || trimmed.startsWith('Table ') || trimmed === ')' || trimmed === ');' || trimmed === '}') {
      return { text: line, highlight: 'none' };
    }

    // Check if this is a PK constraint line
    if (pkDiff && /PRIMARY\s+KEY/i.test(trimmed)) {
      return { text: line, highlight: 'modified' };
    }

    // Check if this is a column line — extract the first word as column name
    // Column lines typically start with whitespace + column_name + type
    const colMatch = trimmed.match(/^["`]?(\w+)["`]?\s+/);
    if (colMatch) {
      const colName = colMatch[1].toUpperCase();
      const highlight = colDiffMap.get(colName);
      if (highlight && highlight !== 'none') {
        return { text: line, highlight };
      }
    }

    // Check if this line contains a CONSTRAINT keyword — might not be a column
    if (/^CONSTRAINT\s/i.test(trimmed) || /^ALTER\s+TABLE/i.test(trimmed)) {
      return { text: line, highlight: 'none' };
    }

    return { text: line, highlight: 'none' };
  });
}


export default function DDLDiffView({
  sourceTable,
  targetTable,
  scriptType,
  targetScriptType,
  changes,
  pkDiff,
  canEditSource,
  canEditTarget,
  onSaveSource,
  onSaveTarget,
}: DDLDiffViewProps) {
  const [editingSource, setEditingSource] = useState(false);
  const [editingTarget, setEditingTarget] = useState(false);
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');

  // Detect theme from DOM
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [darkThemeVariant, setDarkThemeVariant] = useState<'slate' | 'vscode-gray'>('slate');

  useEffect(() => {
    const checkTheme = () => {
      const body = document.body;
      setIsDarkTheme(body.classList.contains('dark-theme'));
      setDarkThemeVariant(body.classList.contains('vscode-gray') ? 'vscode-gray' : 'slate');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Generate DDL from Table objects
  const sourceDDL = useMemo(() => {
    if (!sourceTable) return '';
    return generateTableDDL(sourceTable, scriptType);
  }, [sourceTable, scriptType]);

  const targetDDL = useMemo(() => {
    if (!targetTable) return '';
    return generateTableDDL(targetTable, targetScriptType);
  }, [targetTable, targetScriptType]);

  // Annotate lines with highlights
  const sourceLines = useMemo(() => {
    if (!sourceTable) return [];
    return annotateDDLLines(sourceDDL, changes, 'source', pkDiff);
  }, [sourceDDL, changes, pkDiff, sourceTable]);

  const targetLines = useMemo(() => {
    if (!targetTable) return [];
    return annotateDDLLines(targetDDL, changes, 'target', pkDiff);
  }, [targetDDL, changes, pkDiff, targetTable]);

  const handleEditSource = () => {
    setSourceText(sourceDDL);
    setEditingSource(true);
  };

  const handleEditTarget = () => {
    setTargetText(targetDDL);
    setEditingTarget(true);
  };

  const handleSaveSource = () => {
    try {
      if (onSaveSource) {
        onSaveSource(sourceText);
      }
    } finally {
      setEditingSource(false);
    }
  };

  const handleSaveTarget = () => {
    try {
      if (onSaveTarget) {
        onSaveTarget(targetText);
      }
    } finally {
      setEditingTarget(false);
    }
  };

  const renderPanel = (
    side: 'source' | 'target',
    table: Table | null,
    lines: AnnotatedLine[],
    editing: boolean,
    text: string,
    setText: (v: string) => void,
    canEdit: boolean,
    onEdit: () => void,
    onSave: () => void,
    onCancel: () => void,
    panelScriptType: ScriptType
  ) => {
    const isSource = side === 'source';
    const headerClass = isSource ? 'source' : 'target';
    const label = isSource ? 'SOURCE' : 'TARGET';
    const tableName = table?.tableName || 'N/A';

    return (
      <div className="ddl-panel">
        {/* Panel Header */}
        <div className={`ddl-panel-header ${headerClass}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={14} />
            <span>{label}: {tableName}</span>
          </div>
          <div className="ddl-panel-actions">
            {editing ? (
              <>
                <button onClick={onSave} title="Save changes">
                  <Save size={12} />
                  Save
                </button>
                <button onClick={onCancel} title="Cancel editing">
                  <X size={12} />
                  Cancel
                </button>
              </>
            ) : (
              canEdit && table && (
                <button onClick={onEdit} title="Edit DDL">
                  <Pencil size={12} />
                  Edit
                </button>
              )
            )}
          </div>
        </div>

        {/* Panel Body */}
        <div className="ddl-panel-body">
          {!table ? (
            <div className="ddl-empty-panel">
              <span>This table does not exist in the {side} schema.</span>
            </div>
          ) : editing ? (
            <CodeEditor
              value={text}
              onChange={setText}
              language={panelScriptType}
              isDarkTheme={isDarkTheme}
              darkThemeVariant={darkThemeVariant}
              readOnly={false}
              minHeight="200px"
              placeholder="Enter DDL..."
            />
          ) : (
            <div className="ddl-lines-container">
              {lines.map((line, i) => {
                const lang = getPrismLanguage(panelScriptType);
                const html = line.text.trim() ? highlightLine(line.text, lang) : ' ';
                return (
                  <div
                    key={i}
                    className={`ddl-line ${line.highlight !== 'none' ? `highlight-${line.highlight}` : ''}`}
                  >
                    <span className="ddl-line-number">{i + 1}</span>
                    <span
                      className="ddl-line-text"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="ddl-diff-container">
      {renderPanel(
        'source',
        sourceTable,
        sourceLines,
        editingSource,
        sourceText,
        setSourceText,
        canEditSource,
        handleEditSource,
        handleSaveSource,
        () => setEditingSource(false),
        scriptType
      )}
      {renderPanel(
        'target',
        targetTable,
        targetLines,
        editingTarget,
        targetText,
        setTargetText,
        canEditTarget,
        handleEditTarget,
        handleSaveTarget,
        () => setEditingTarget(false),
        targetScriptType
      )}
    </div>
  );
}
