import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Clock,
  RotateCcw,
  Trash2,
  GitCompare,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  FileText
} from 'lucide-react';
import { Script, ScriptVersion, VersionCompareResult, LineDiff, DiffHunk } from '../../types';
import {
  getCurrentVersion,
  setCurrentVersion,
  deleteScriptVersion,
  getVersionsStorageSize,
  formatStorageSize
} from '../../utils/storage';
import { computeVersionDiff, countChanges, buildUnifiedRows, CharDiff } from '../../utils/versionDiff';

interface VersionHistoryPopupProps {
  script: Script;
  onClose: () => void;
  onScriptUpdate: (script: Script) => void;
  isDarkTheme?: boolean;
}

export default function VersionHistoryPopup({
  script,
  onClose,
  onScriptUpdate,
  isDarkTheme: _isDarkTheme = false
}: VersionHistoryPopupProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmSetCurrent, setConfirmSetCurrent] = useState<string | null>(null);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [diffResult, setDiffResult] = useState<VersionCompareResult | null>(null);
  const [currentChangeIndex, setCurrentChangeIndex] = useState(0);

  const diffContainerRef = useRef<HTMLDivElement>(null);

  const versions = script.versions || [];
  const currentVersion = getCurrentVersion(script);
  const storageSize = getVersionsStorageSize(script);

  // Get selected version for comparison
  const selectedVersion = selectedVersionId
    ? versions.find(v => v.id === selectedVersionId)
    : null;

  // Compute diff when selection changes
  useEffect(() => {
    if (selectedVersion && currentVersion && selectedVersion.id !== currentVersion.id) {
      // Always show older version on left, newer on right
      const isOlder = selectedVersion.versionNumber < currentVersion.versionNumber;
      const oldV = isOlder ? selectedVersion : currentVersion;
      const newV = isOlder ? currentVersion : selectedVersion;
      // showAllLines: true - show FULL script, not just changed lines with context
      const result = computeVersionDiff(oldV, newV, 3, true, true);
      setDiffResult(result);
      setCurrentChangeIndex(0);
    } else {
      setDiffResult(null);
    }
  }, [selectedVersion, currentVersion]);

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

  // Handle version selection
  const handleVersionClick = (version: ScriptVersion) => {
    if (version.id === currentVersion?.id) {
      setSelectedVersionId(null);
      return;
    }
    setSelectedVersionId(version.id);
  };

  // Handle setting a version as current
  const handleSetAsCurrent = (versionId: string) => {
    const updatedScript = setCurrentVersion(script, versionId);
    onScriptUpdate(updatedScript);
    setConfirmSetCurrent(null);
    setSelectedVersionId(null);
  };

  // Handle delete
  const handleDelete = (versionId: string) => {
    const updatedScript = deleteScriptVersion(script, versionId);
    onScriptUpdate(updatedScript);
    setConfirmDelete(null);
    if (selectedVersionId === versionId) {
      setSelectedVersionId(null);
    }
  };

  // Navigate to change
  const navigateToChange = useCallback((direction: 'next' | 'prev') => {
    if (!diffResult || !diffContainerRef.current) return;

    const totalChanges = countChanges(diffResult);
    if (totalChanges === 0) return;

    let newIndex = currentChangeIndex;
    if (direction === 'next') {
      newIndex = (currentChangeIndex + 1) % totalChanges;
    } else {
      newIndex = (currentChangeIndex - 1 + totalChanges) % totalChanges;
    }
    setCurrentChangeIndex(newIndex);

    // Scroll to the change
    const changeHunks = diffResult.hunks.filter(h => h.type !== 'context');
    if (changeHunks[newIndex]) {
      const lineNumber = changeHunks[newIndex].startLine;
      scrollToLine(lineNumber);
    }
  }, [diffResult, currentChangeIndex]);

  // Scroll to specific line
  const scrollToLine = useCallback((lineNumber: number) => {
    if (!diffContainerRef.current) return;

    const rows = diffContainerRef.current.querySelectorAll('.diff-table-row');
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

  const totalChanges = diffResult ? countChanges(diffResult) : 0;
  const allLines = diffResult ? getAllLines(diffResult.hunks) : [];
  const unifiedRows = buildUnifiedRows(allLines);

  return (
    <div className="version-popup-overlay" onClick={onClose}>
      <div className="version-popup-container" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="version-popup-header">
          <div className="version-popup-title">
            <GitCompare size={18} />
            <h3>Version History - {script.name}</h3>
            <span className="version-popup-count">{versions.length} versions</span>
          </div>
          <button className="btn btn-sm btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Main Content - styles handled in CSS */}
        <div className="version-popup-content">
          {/* Left Panel - Version List */}
          <div className="version-popup-list">
            <div className="version-popup-list-header">
              <span>Versions</span>
              <span className="version-popup-storage">{formatStorageSize(storageSize)}</span>
            </div>
            <div className="version-popup-list-items">
              {versions.map((version) => {
                const isCurrent = version.id === currentVersion?.id;
                const isSelected = version.id === selectedVersionId;

                return (
                  <div
                    key={version.id}
                    className={`version-popup-item ${isCurrent ? 'current' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleVersionClick(version)}
                  >
                    <div className="version-popup-item-content">
                      <div className="version-popup-item-header">
                        <span className="version-popup-item-name">v{version.versionNumber}</span>
                        {isCurrent && (
                          <span className="version-popup-item-badge">Current</span>
                        )}
                      </div>
                      <div className="version-popup-item-meta">
                        <Clock size={12} />
                        <span>{formatDate(version.createdAt)}</span>
                      </div>
                      {version.message && version.message !== `Version ${version.versionNumber}` && (
                        <div className="version-popup-item-message">{version.message}</div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="version-popup-item-actions">
                      {!isCurrent && (
                        <>
                          {confirmSetCurrent === version.id ? (
                            <div className="version-popup-confirm">
                              <span>Set as current?</span>
                              <button
                                className="btn btn-xs btn-success"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSetAsCurrent(version.id);
                                }}
                              >
                                Yes
                              </button>
                              <button
                                className="btn btn-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmSetCurrent(null);
                                }}
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmSetCurrent(version.id);
                              }}
                              title="Set as current version"
                            >
                              <RotateCcw size={12} />
                            </button>
                          )}
                        </>
                      )}

                      {versions.length > 1 && (
                        <>
                          {confirmDelete === version.id ? (
                            <div className="version-popup-confirm">
                              <span>Delete?</span>
                              <button
                                className="btn btn-xs btn-danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(version.id);
                                }}
                              >
                                Yes
                              </button>
                              <button
                                className="btn btn-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmDelete(null);
                                }}
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-xs btn-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDelete(version.id);
                              }}
                              title="Delete this version"
                              disabled={isCurrent && versions.length === 1}
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </>
                      )}

                      {!isCurrent && <ChevronRight size={14} className="version-popup-item-arrow" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Comparison - styles handled in CSS */}
          <div className="version-popup-compare">
            {selectedVersion && diffResult ? (
              <>
                {/* Comparison Header */}
                <div className="version-popup-compare-header">
                  <div className="version-popup-compare-info">
                    <span className="version-popup-compare-label">
                      Comparing v{diffResult.oldVersion.versionNumber} → v{diffResult.newVersion.versionNumber}
                    </span>
                    <div className="version-popup-compare-stats">
                      <span className="stat-added">+{diffResult.stats.linesAdded}</span>
                      <span className="stat-deleted">-{diffResult.stats.linesDeleted}</span>
                    </div>
                  </div>
                  {totalChanges > 0 && (
                    <div className="version-popup-compare-nav">
                      <button
                        className="btn btn-sm"
                        onClick={() => navigateToChange('prev')}
                        title="Previous change (Ctrl+K)"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <span className="version-popup-nav-info">
                        {currentChangeIndex + 1} / {totalChanges}
                      </span>
                      <button
                        className="btn btn-sm"
                        onClick={() => navigateToChange('next')}
                        title="Next change (Ctrl+J)"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Diff Table - SCROLLABLE - styles handled in CSS */}
                <div
                  className="version-popup-diff-wrapper"
                  ref={diffContainerRef}
                >
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
                          <span>v{diffResult.oldVersion.versionNumber}</span>
                          <span className="version-popup-diff-header-date">{formatDate(diffResult.oldVersion.createdAt)}</span>
                        </th>
                        <th colSpan={2} className="version-popup-diff-header-cell">
                          <FileText size={14} />
                          <span>v{diffResult.newVersion.versionNumber}</span>
                          <span className="version-popup-diff-header-date">{formatDate(diffResult.newVersion.createdAt)}</span>
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
              </>
            ) : (
              <div className="version-popup-compare-empty">
                <GitCompare size={48} />
                <h4>Select a version to compare</h4>
                <p>Click on any version from the list to compare it with the current version</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
