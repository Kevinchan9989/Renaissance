import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2,
  GitCompare,
  FileText
} from 'lucide-react';
import { ScriptVersion, VersionCompareResult, DiffHunk, LineDiff } from '../../types';
import { computeVersionDiff, countChanges } from '../../utils/versionDiff';

interface VersionCompareProps {
  oldVersion: ScriptVersion;
  newVersion: ScriptVersion;
  onClose: () => void;
  isDarkTheme?: boolean;
  isInline?: boolean;
}

// Character-level diff for highlighting individual character changes
interface CharDiff {
  text: string;
  type: 'unchanged' | 'added' | 'deleted';
}

/**
 * Compute character-level diff between two strings
 */
function computeCharDiff(oldStr: string, newStr: string): { oldChars: CharDiff[], newChars: CharDiff[] } {
  if (!oldStr && !newStr) {
    return { oldChars: [], newChars: [] };
  }
  if (!oldStr) {
    return {
      oldChars: [],
      newChars: [{ text: newStr, type: 'added' }]
    };
  }
  if (!newStr) {
    return {
      oldChars: [{ text: oldStr, type: 'deleted' }],
      newChars: []
    };
  }

  const oldChars: CharDiff[] = [];
  const newChars: CharDiff[] = [];

  // Find common prefix
  let prefixLen = 0;
  while (prefixLen < oldStr.length && prefixLen < newStr.length && oldStr[prefixLen] === newStr[prefixLen]) {
    prefixLen++;
  }

  // Find common suffix
  let suffixLen = 0;
  while (
    suffixLen < oldStr.length - prefixLen &&
    suffixLen < newStr.length - prefixLen &&
    oldStr[oldStr.length - 1 - suffixLen] === newStr[newStr.length - 1 - suffixLen]
  ) {
    suffixLen++;
  }

  // Build the result
  if (prefixLen > 0) {
    const prefix = oldStr.substring(0, prefixLen);
    oldChars.push({ text: prefix, type: 'unchanged' });
    newChars.push({ text: prefix, type: 'unchanged' });
  }

  const oldMiddle = oldStr.substring(prefixLen, oldStr.length - suffixLen);
  const newMiddle = newStr.substring(prefixLen, newStr.length - suffixLen);

  if (oldMiddle) {
    oldChars.push({ text: oldMiddle, type: 'deleted' });
  }
  if (newMiddle) {
    newChars.push({ text: newMiddle, type: 'added' });
  }

  if (suffixLen > 0) {
    const suffix = oldStr.substring(oldStr.length - suffixLen);
    oldChars.push({ text: suffix, type: 'unchanged' });
    newChars.push({ text: suffix, type: 'unchanged' });
  }

  return { oldChars, newChars };
}

// Unified diff row for GitHub-style table
interface UnifiedDiffRow {
  oldLineNum: number | null;
  newLineNum: number | null;
  oldContent: string;
  newContent: string;
  type: 'unchanged' | 'added' | 'deleted' | 'modified';
  oldChars?: CharDiff[];
  newChars?: CharDiff[];
}

/**
 * Build unified diff rows that align old and new content side by side
 */
function buildUnifiedRows(lines: LineDiff[]): UnifiedDiffRow[] {
  const rows: UnifiedDiffRow[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.type === 'unchanged') {
      rows.push({
        oldLineNum: line.oldLineNumber || null,
        newLineNum: line.newLineNumber || null,
        oldContent: line.oldContent || '',
        newContent: line.newContent || '',
        type: 'unchanged'
      });
      i++;
    } else if (line.type === 'modified') {
      const { oldChars, newChars } = computeCharDiff(line.oldContent || '', line.newContent || '');
      rows.push({
        oldLineNum: line.oldLineNumber || null,
        newLineNum: line.newLineNumber || null,
        oldContent: line.oldContent || '',
        newContent: line.newContent || '',
        type: 'modified',
        oldChars,
        newChars
      });
      i++;
    } else if (line.type === 'deleted') {
      // Look ahead for a matching added line (modification pair)
      const nextLine = lines[i + 1];
      if (nextLine && nextLine.type === 'added') {
        // This is a modification - show side by side
        const { oldChars, newChars } = computeCharDiff(line.oldContent || '', nextLine.newContent || '');
        rows.push({
          oldLineNum: line.oldLineNumber || null,
          newLineNum: nextLine.newLineNumber || null,
          oldContent: line.oldContent || '',
          newContent: nextLine.newContent || '',
          type: 'modified',
          oldChars,
          newChars
        });
        i += 2;
      } else {
        // Pure deletion
        rows.push({
          oldLineNum: line.oldLineNumber || null,
          newLineNum: null,
          oldContent: line.oldContent || '',
          newContent: '',
          type: 'deleted'
        });
        i++;
      }
    } else if (line.type === 'added') {
      // Pure addition (not paired with deletion)
      rows.push({
        oldLineNum: null,
        newLineNum: line.newLineNumber || null,
        oldContent: '',
        newContent: line.newContent || '',
        type: 'added'
      });
      i++;
    } else {
      i++;
    }
  }

  return rows;
}

export default function VersionCompare({
  oldVersion,
  newVersion,
  onClose,
  isDarkTheme: _isDarkTheme = false,
  isInline = false
}: VersionCompareProps) {
  const [diffResult, setDiffResult] = useState<VersionCompareResult | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentChangeIndex, setCurrentChangeIndex] = useState(0);

  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Compute diff on mount
  useEffect(() => {
    const result = computeVersionDiff(oldVersion, newVersion, 3, true);
    setDiffResult(result);
  }, [oldVersion, newVersion]);

  // Navigate to change
  const navigateToChange = useCallback((direction: 'next' | 'prev') => {
    if (!diffResult || !tableContainerRef.current) return;

    const totalChanges = countChanges(diffResult);
    if (totalChanges === 0) return;

    let newIndex = currentChangeIndex;
    if (direction === 'next') {
      newIndex = (currentChangeIndex + 1) % totalChanges;
    } else {
      newIndex = (currentChangeIndex - 1 + totalChanges) % totalChanges;
    }
    setCurrentChangeIndex(newIndex);

    // Find the hunk and scroll to it
    const changeHunks = diffResult.hunks.filter(h => h.type !== 'context');
    if (changeHunks[newIndex]) {
      const lineNumber = changeHunks[newIndex].startLine;
      scrollToLine(lineNumber);
    }
  }, [diffResult, currentChangeIndex]);

  // Scroll to specific line
  const scrollToLine = useCallback((lineNumber: number) => {
    if (!tableContainerRef.current) return;

    const rows = tableContainerRef.current.querySelectorAll('.diff-table-row');
    for (const row of rows) {
      const oldNum = row.getAttribute('data-old-line');
      const newNum = row.getAttribute('data-new-line');
      if ((oldNum && parseInt(oldNum) >= lineNumber) || (newNum && parseInt(newNum) >= lineNumber)) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      }
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'j' || e.key === 'ArrowDown') {
        if (e.ctrlKey || e.metaKey) {
          navigateToChange('next');
          e.preventDefault();
        }
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        if (e.ctrlKey || e.metaKey) {
          navigateToChange('prev');
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateToChange, onClose]);

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render character-level highlighted content
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

  // Flatten hunks into lines for rendering
  const getAllLines = (hunks: DiffHunk[]): LineDiff[] => {
    return hunks.flatMap(h => h.lines);
  };

  if (!diffResult) {
    return (
      <div className="version-compare-loading">
        <div className="spinner"></div>
        <span>Computing diff...</span>
      </div>
    );
  }

  const totalChanges = countChanges(diffResult);
  const allLines = getAllLines(diffResult.hunks);
  const unifiedRows = buildUnifiedRows(allLines);

  // Wrapper class based on inline mode
  const wrapperClass = isInline
    ? 'version-compare-inline'
    : `version-compare-overlay ${isFullscreen ? 'fullscreen' : ''}`;

  return (
    <div className={wrapperClass}>
      <div className="version-compare-container">
        {/* Header */}
        <div className="version-compare-header">
          <div className="version-compare-title">
            <GitCompare size={18} />
            <h3>Compare Versions</h3>
          </div>

          <div className="version-compare-stats">
            <span className="stat-added">+{diffResult.stats.linesAdded}</span>
            <span className="stat-deleted">-{diffResult.stats.linesDeleted}</span>
            {diffResult.stats.linesModified > 0 && (
              <span className="stat-modified">~{diffResult.stats.linesModified}</span>
            )}
          </div>

          <div className="version-compare-actions">
            {!isInline && (
              <button
                className="btn btn-sm btn-icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            )}

            <button className="btn btn-sm btn-icon" onClick={onClose}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        {totalChanges > 0 && (
          <div className="version-compare-nav">
            <button
              className="btn btn-sm"
              onClick={() => navigateToChange('prev')}
              title="Previous change (Ctrl+K)"
            >
              <ChevronUp size={14} />
              Prev
            </button>
            <span className="version-compare-nav-info">
              Change {currentChangeIndex + 1} of {totalChanges}
            </span>
            <button
              className="btn btn-sm"
              onClick={() => navigateToChange('next')}
              title="Next change (Ctrl+J)"
            >
              Next
              <ChevronDown size={14} />
            </button>
          </div>
        )}

        {/* GitHub-style Split Diff Table */}
        <div className="diff-table-wrapper" ref={tableContainerRef}>
          <table className="diff-table">
            <colgroup>
              <col className="diff-col-num" />
              <col className="diff-col-content" />
              <col className="diff-col-num" />
              <col className="diff-col-content" />
            </colgroup>
            <thead>
              <tr className="diff-table-header-row">
                <th colSpan={2} className="diff-table-header-cell diff-table-header-old">
                  <FileText size={14} />
                  <span className="diff-header-version">v{oldVersion.versionNumber}</span>
                  <span className="diff-header-date">{formatDate(oldVersion.createdAt)}</span>
                </th>
                <th colSpan={2} className="diff-table-header-cell diff-table-header-new">
                  <FileText size={14} />
                  <span className="diff-header-version">v{newVersion.versionNumber}</span>
                  <span className="diff-header-date">{formatDate(newVersion.createdAt)}</span>
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
                        <span className="diff-marker diff-marker-deleted">−</span>
                        <code className="diff-code">{renderCharHighlightedContent(row.oldChars, 'old')}</code>
                      </>
                    ) : row.type === 'deleted' ? (
                      <>
                        <span className="diff-marker diff-marker-deleted">−</span>
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

        {/* Schema Diff Summary (if available) */}
        {diffResult.schemaDiff && Object.keys(diffResult.schemaDiff).length > 0 && (
          <div className="version-compare-schema">
            <h4>Schema Changes</h4>
            <div className="version-compare-schema-stats">
              {diffResult.stats.tablesAdded > 0 && (
                <span className="schema-stat schema-stat-added">
                  +{diffResult.stats.tablesAdded} tables
                </span>
              )}
              {diffResult.stats.tablesDeleted > 0 && (
                <span className="schema-stat schema-stat-deleted">
                  -{diffResult.stats.tablesDeleted} tables
                </span>
              )}
              {diffResult.stats.tablesModified > 0 && (
                <span className="schema-stat schema-stat-modified">
                  ~{diffResult.stats.tablesModified} tables
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
