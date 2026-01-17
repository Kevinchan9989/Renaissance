import { GitBranch, History, AlertCircle } from 'lucide-react';
import { Script } from '../../types';
import { getCurrentVersion, hasUnsavedChanges } from '../../utils/storage';

interface VersionBadgeProps {
  script: Script;
  onClick?: () => void;
  showUnsavedIndicator?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function VersionBadge({
  script,
  onClick,
  showUnsavedIndicator = true,
  size = 'md'
}: VersionBadgeProps) {
  const currentVersion = getCurrentVersion(script);
  const unsaved = showUnsavedIndicator && hasUnsavedChanges(script);
  const versionCount = script.versions?.length || 0;

  const sizeClasses = {
    sm: 'version-badge-sm',
    md: 'version-badge-md',
    lg: 'version-badge-lg'
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14
  };

  if (!script.versioningEnabled) {
    return null;
  }

  return (
    <button
      className={`version-badge ${sizeClasses[size]} ${unsaved ? 'version-badge-unsaved' : ''} ${onClick ? 'version-badge-clickable' : ''}`}
      onClick={onClick}
      title={`Version ${currentVersion?.versionNumber || 1} of ${versionCount}${unsaved ? ' (unsaved changes)' : ''}\nClick to view history`}
    >
      <GitBranch size={iconSizes[size]} />
      <span className="version-badge-number">
        v{currentVersion?.versionNumber || 1}
      </span>
      {unsaved && (
        <AlertCircle size={iconSizes[size]} className="version-badge-unsaved-icon" />
      )}
      {onClick && versionCount > 1 && (
        <History size={iconSizes[size]} className="version-badge-history-icon" />
      )}
    </button>
  );
}
