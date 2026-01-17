import { useState } from 'react';
import {
  X,
  Clock,
  RotateCcw,
  Trash2,
  Save,
  ChevronRight
} from 'lucide-react';
import { Script, ScriptVersion } from '../../types';
import {
  getCurrentVersion,
  setCurrentVersion,
  deleteScriptVersion,
  getVersionsStorageSize,
  formatStorageSize
} from '../../utils/storage';

interface VersionHistoryProps {
  script: Script;
  onClose: () => void;
  onScriptUpdate: (script: Script) => void;
  onCompareVersions: (oldVersion: ScriptVersion, newVersion: ScriptVersion) => void;
}

export default function VersionHistory({
  script,
  onClose,
  onScriptUpdate,
  onCompareVersions
}: VersionHistoryProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmSetCurrent, setConfirmSetCurrent] = useState<string | null>(null);

  const versions = script.versions || [];
  const currentVersion = getCurrentVersion(script);
  const storageSize = getVersionsStorageSize(script);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle clicking on a version - compare with current
  const handleVersionClick = (version: ScriptVersion) => {
    if (!currentVersion || version.id === currentVersion.id) return;

    // Compare the clicked version with the current version
    // Always show older version on left, newer on right
    if (version.versionNumber < currentVersion.versionNumber) {
      onCompareVersions(version, currentVersion);
    } else {
      onCompareVersions(currentVersion, version);
    }
  };

  // Handle setting a version as current (jump to that version)
  const handleSetAsCurrent = (versionId: string) => {
    const updatedScript = setCurrentVersion(script, versionId);
    onScriptUpdate(updatedScript);
    setConfirmSetCurrent(null);
  };

  const handleDelete = (versionId: string) => {
    const updatedScript = deleteScriptVersion(script, versionId);
    onScriptUpdate(updatedScript);
    setConfirmDelete(null);
  };

  return (
    <div className="version-history-overlay">
      <div className="version-history-panel">
        {/* Header */}
        <div className="version-history-header">
          <div className="version-history-title">
            <h3>Version History</h3>
            <span className="version-history-count">{versions.length} versions</span>
          </div>
          <button className="btn btn-sm btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Storage Info */}
        <div className="version-history-storage">
          <span>Storage: {formatStorageSize(storageSize)}</span>
          <span>Max versions: {script.maxVersions || 50}</span>
        </div>

        {/* Help Text */}
        <div className="version-history-help">
          <span>Click any version to compare with current</span>
        </div>

        {/* Version List - Script Manager Style */}
        <div className="version-history-list">
          {versions.length === 0 ? (
            <div className="version-history-empty">
              <Save size={32} />
              <p>No versions saved yet</p>
              <p className="version-history-empty-hint">
                Edit and save your script to create versions
              </p>
            </div>
          ) : (
            <div className="version-items">
              {versions.map((version) => {
                const isCurrent = version.id === currentVersion?.id;

                return (
                  <div
                    key={version.id}
                    className={`version-item ${isCurrent ? 'current' : ''}`}
                    onClick={() => !isCurrent && handleVersionClick(version)}
                  >
                    <div className="version-item-content">
                      <div className="version-item-header">
                        <span className="version-item-number">v{version.versionNumber}</span>
                        {isCurrent && (
                          <span className="version-item-current-badge">Current</span>
                        )}
                      </div>
                      <div className="version-item-meta">
                        <Clock size={12} />
                        <span>{formatDate(version.createdAt)}</span>
                        {version.message && version.message !== `Version ${version.versionNumber}` && (
                          <>
                            <span className="version-item-separator">•</span>
                            <span className="version-item-message">{version.message}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="version-item-actions">
                      {!isCurrent && (
                        <>
                          {confirmSetCurrent === version.id ? (
                            <div className="version-history-confirm">
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
                            <div className="version-history-confirm">
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

                      {!isCurrent && <ChevronRight size={14} className="version-item-arrow" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
