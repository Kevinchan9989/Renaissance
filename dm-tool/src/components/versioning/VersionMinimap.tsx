import { useRef, useState, useEffect, useCallback, RefObject } from 'react';
import { VersionCompareResult, DiffMarker } from '../../types';
import { generateDiffMarkers } from '../../utils/versionDiff';

interface VersionMinimapProps {
  diffResult: VersionCompareResult;
  onMarkerClick: (lineNumber: number) => void;
  containerRef: RefObject<HTMLDivElement>;
}

export default function VersionMinimap({
  diffResult,
  onMarkerClick,
  containerRef
}: VersionMinimapProps) {
  const minimapRef = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<DiffMarker[]>([]);
  const [viewportPosition, setViewportPosition] = useState({ top: 0, height: 10 });
  const [isDragging, setIsDragging] = useState(false);

  // Calculate total lines from new version
  const totalLines = diffResult.newVersion.content.split('\n').length;

  // Generate markers when diff result changes
  useEffect(() => {
    const diffMarkers = generateDiffMarkers(diffResult.hunks, totalLines);
    setMarkers(diffMarkers);
  }, [diffResult, totalLines]);

  // Update viewport position based on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateViewport = () => {
      const scrollPercent = container.scrollTop / (container.scrollHeight - container.clientHeight);
      const viewportHeightPercent = (container.clientHeight / container.scrollHeight) * 100;

      setViewportPosition({
        top: scrollPercent * (100 - viewportHeightPercent),
        height: Math.max(viewportHeightPercent, 5) // Minimum 5% height
      });
    };

    updateViewport();
    container.addEventListener('scroll', updateViewport);
    return () => container.removeEventListener('scroll', updateViewport);
  }, [containerRef]);

  // Handle click on minimap
  const handleMinimapClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const minimap = minimapRef.current;
    const container = containerRef.current;
    if (!minimap || !container) return;

    const rect = minimap.getBoundingClientRect();
    const clickPercent = (e.clientY - rect.top) / rect.height;
    const lineNumber = Math.floor(clickPercent * totalLines);

    onMarkerClick(Math.max(1, lineNumber));
  }, [containerRef, onMarkerClick, totalLines]);

  // Handle drag on viewport indicator
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // Handle drag move
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const minimap = minimapRef.current;
      const container = containerRef.current;
      if (!minimap || !container) return;

      const rect = minimap.getBoundingClientRect();
      const dragPercent = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

      container.scrollTop = dragPercent * (container.scrollHeight - container.clientHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, containerRef]);

  // Get marker color based on type
  const getMarkerColor = (type: DiffMarker['type']) => {
    switch (type) {
      case 'added':
        return 'var(--diff-added-marker, #2ea043)';
      case 'deleted':
        return 'var(--diff-deleted-marker, #f85149)';
      case 'modified':
        return 'var(--diff-modified-marker, #bb8009)';
      default:
        return '#888';
    }
  };

  return (
    <div
      ref={minimapRef}
      className="version-minimap"
      onClick={handleMinimapClick}
      title="Click to navigate, drag viewport to scroll"
    >
      {/* Background track */}
      <div className="version-minimap-track" />

      {/* Diff markers */}
      {markers.map((marker, i) => (
        <div
          key={i}
          className={`version-minimap-marker version-minimap-marker-${marker.type}`}
          style={{
            top: `${marker.startPercent}%`,
            height: `${Math.max(marker.endPercent - marker.startPercent, 0.5)}%`,
            backgroundColor: getMarkerColor(marker.type)
          }}
          onClick={(e) => {
            e.stopPropagation();
            onMarkerClick(marker.lineStart);
          }}
          title={`${marker.type}: lines ${marker.lineStart}-${marker.lineEnd}`}
        />
      ))}

      {/* Viewport indicator */}
      <div
        className={`version-minimap-viewport ${isDragging ? 'dragging' : ''}`}
        style={{
          top: `${viewportPosition.top}%`,
          height: `${viewportPosition.height}%`
        }}
        onMouseDown={handleDragStart}
      />
    </div>
  );
}
