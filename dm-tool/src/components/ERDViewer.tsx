import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { Stage, Layer, Rect, Text, Line, Group, Path } from 'react-konva';
import Konva from 'konva';
import dagre from '@dagrejs/dagre';
import ELK from 'elkjs/lib/elk.bundled.js';
import { Table } from '../types';
import { TABLE_COLORS, SIZING, FONTS, LIGHT_THEME, getDarkTheme, ThemeColors, DarkThemeVariant } from '../constants/erd';
import { ZoomIn, ZoomOut, Maximize2, Download, RotateCcw, Maximize, Search, X, RefreshCw, Copy, MousePointer2 } from 'lucide-react';
import ERDExportPreview from './ERDExportPreview';
import { loadScripts } from '../utils/storage';

// Initialize ELK instance
const elk = new ELK();

// Get list of scripts that have positions for tables matching current schema
const getScriptsWithMatchingPositions = (
  currentScriptId: string,
  currentTables: Table[]
): { scriptId: string; scriptName: string; matchCount: number }[] => {
  const currentTableNames = new Set(currentTables.map(t => t.tableName.toUpperCase()));
  const currentSchemas = new Set(currentTables.map(t => t.schema?.toUpperCase() || 'DEFAULT'));
  const allScripts = loadScripts();
  const result: { scriptId: string; scriptName: string; matchCount: number }[] = [];

  for (const script of allScripts) {
    if (script.id === currentScriptId) continue;

    const savedPositions = localStorage.getItem(getStorageKey(script.id));
    if (!savedPositions) continue;

    try {
      const positions = JSON.parse(savedPositions) as Record<string, { x: number; y: number }>;
      const scriptTables = [...(script.data?.targets || []), ...(script.data?.sources || [])];
      const scriptSchemas = new Set(scriptTables.map(t => t.schema?.toUpperCase() || 'DEFAULT'));

      // Check schema match
      const hasMatchingSchema = [...currentSchemas].some(s => scriptSchemas.has(s));
      if (!hasMatchingSchema) continue;

      // Count matching tables
      let matchCount = 0;
      for (const tableId of Object.keys(positions)) {
        if (currentTableNames.has(tableId)) {
          matchCount++;
        }
      }

      if (matchCount > 0) {
        result.push({
          scriptId: script.id,
          scriptName: script.name,
          matchCount
        });
      }
    } catch (e) {
      // Skip this script
    }
  }

  // Sort by match count descending
  return result.sort((a, b) => b.matchCount - a.matchCount);
};

// Copy positions from a specific script
const copyPositionsFromScript = (
  sourceScriptId: string,
  currentTables: Table[]
): Record<string, { x: number; y: number }> => {
  const matchedPositions: Record<string, { x: number; y: number }> = {};
  const currentTableNames = new Set(currentTables.map(t => t.tableName.toUpperCase()));

  const savedPositions = localStorage.getItem(getStorageKey(sourceScriptId));
  if (!savedPositions) return matchedPositions;

  try {
    const positions = JSON.parse(savedPositions) as Record<string, { x: number; y: number }>;

    for (const [tableId, pos] of Object.entries(positions)) {
      if (currentTableNames.has(tableId)) {
        matchedPositions[tableId] = pos;
      }
    }
  } catch (e) {
    console.error('Failed to copy positions from script:', sourceScriptId);
  }

  return matchedPositions;
};

interface ERDViewerProps {
  tables: Table[];
  isDarkTheme: boolean;
  darkThemeVariant?: DarkThemeVariant;
  scriptId: string;
  scriptName?: string;
  onRefresh?: () => void;
}

interface TableNode {
  id: string;
  table: Table;
  x: number;
  y: number;
  width: number;
  height: number;
  colorIndex: number;
}

interface Edge {
  id: string;
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
}

interface SearchResult {
  type: 'table' | 'column';
  tableName: string;
  columnName?: string;
  tableId: string;
}

// Position enum for bezier calculations
enum Position {
  Left = 'left',
  Right = 'right',
}

// Storage key for table positions
const getStorageKey = (scriptId: string) => `erd_positions_${scriptId}`;

// Get theme based on dark mode and variant
const getTheme = (isDark: boolean, variant: DarkThemeVariant = 'slate'): ThemeColors =>
  isDark ? getDarkTheme(variant) : LIGHT_THEME;

// Helper to get color index for a table, grouping temporal tables with their master
const getTableColorIndex = (tableName: string, allTables: Table[], groupTemporal: boolean): number => {
  if (!groupTemporal) {
    const index = allTables.findIndex(t => t.tableName === tableName);
    return index % TABLE_COLORS.length;
  }

  // Check if this is a temporal table (ends with _t)
  const upperName = tableName.toUpperCase();
  if (upperName.endsWith('_T')) {
    // Find the master table (without _t suffix)
    const masterName = tableName.slice(0, -2);
    const masterIndex = allTables.findIndex(t => t.tableName.toUpperCase() === masterName.toUpperCase());
    if (masterIndex !== -1) {
      return masterIndex % TABLE_COLORS.length;
    }
  }

  // For master tables or tables without a temporal pair, use their own index
  const index = allTables.findIndex(t => t.tableName === tableName);
  return index % TABLE_COLORS.length;
};

// Calculate table width based on content - ensure column name + type fit without wrapping
const calculateTableWidth = (table: Table): number => {
  // Measure table name (with some padding for header)
  const tableNameWidth = table.tableName.length * 8 + 30;

  // Measure each column: name on left (~50%), type on right (~40%)
  // We need width such that both name and type fit comfortably
  const columnWidths = table.columns.map(col => {
    const nameWidth = col.name.length * 7.5 + 30; // 7.5px per char + padding for key icon
    const typeWidth = col.type.length * 7 + 20; // type column
    // Name gets ~50% of width, type gets ~40% (with gaps)
    const widthForName = nameWidth / 0.48;
    const widthForType = typeWidth / 0.38;
    return Math.max(widthForName, widthForType);
  });

  const maxColumnWidth = columnWidths.length > 0 ? Math.max(...columnWidths) : 0;
  const estimatedWidth = Math.max(tableNameWidth, maxColumnWidth);

  return Math.min(Math.max(estimatedWidth, SIZING.TABLE_MIN_WIDTH), SIZING.TABLE_MAX_WIDTH);
};

// Calculate table height
const calculateTableHeight = (table: Table): number => {
  return SIZING.TABLE_COLOR_HEIGHT + SIZING.TABLE_HEADER_HEIGHT +
         (table.columns.length * SIZING.COLUMN_HEIGHT) + SIZING.PADDING * 2;
};

// Bezier curve calculation (from db-schema-visualizer / xyflow)
const CONNECTION_SYMBOL_OFFSET = 12;

function calculateControlOffset(distance: number, curvature: number): number {
  if (distance >= 0) {
    return 0.5 * distance;
  }
  return curvature * 25 * Math.sqrt(-distance);
}

function getControlWithCurvature(
  pos: Position,
  x1: number,
  y1: number,
  x2: number,
  _y2: number,
  curvature: number
): [number, number] {
  switch (pos) {
    case Position.Left:
      return [x1 - calculateControlOffset(x1 - x2, curvature), y1];
    case Position.Right:
      return [x1 + calculateControlOffset(x2 - x1, curvature), y1];
    default:
      return [x1, y1];
  }
}

function computeSymbolOffset(position: Position, startPoint: { x: number; y: number }): { x: number; y: number } {
  const x = position === Position.Left
    ? startPoint.x - CONNECTION_SYMBOL_OFFSET
    : startPoint.x + CONNECTION_SYMBOL_OFFSET;
  return { x, y: startPoint.y };
}

function getBezierPath(
  source: { x: number; y: number },
  target: { x: number; y: number },
  sourcePosition: Position,
  targetPosition: Position,
  curvature: number = 0.5
): string {
  const [sourceControlX, sourceControlY] = getControlWithCurvature(
    sourcePosition,
    source.x,
    source.y,
    target.x,
    target.y,
    curvature
  );

  const [targetControlX, targetControlY] = getControlWithCurvature(
    targetPosition,
    target.x,
    target.y,
    source.x,
    source.y,
    curvature
  );

  const sourceOffset = computeSymbolOffset(sourcePosition, source);
  const targetOffset = computeSymbolOffset(targetPosition, target);

  return `M${source.x},${source.y} L${sourceOffset.x},${sourceOffset.y} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetOffset.x},${targetOffset.y} L${target.x},${target.y}`;
}

// Compute which side to connect from
function computeConnectionHandlePos(
  sourceX: number,
  sourceW: number,
  targetX: number,
  targetW: number
): [Position, Position, number, number] {
  const sourceEndX = sourceX + sourceW;
  const targetEndX = targetX + targetW;
  const intersectionGap = 40;

  const horizontalIntersection = Math.max(sourceEndX, targetEndX) - Math.min(sourceX, targetX);

  if (horizontalIntersection <= targetW + sourceW + intersectionGap) {
    return [Position.Left, Position.Left, sourceX, targetX];
  }

  if (sourceEndX < targetEndX) {
    return [Position.Right, Position.Left, sourceEndX, targetX];
  }

  return [Position.Left, Position.Right, sourceX, targetEndX];
}

// Relation symbols
function getOneSymbol(x: number, y: number, position: Position): string {
  const halfHeight = 3;
  const offset = computeSymbolOffset(position, { x, y });
  return `M${offset.x},${y - halfHeight} L${offset.x},${y + halfHeight}`;
}

function getManySymbol(x: number, y: number, position: Position): string {
  const halfHeight = 5;
  const offset = computeSymbolOffset(position, { x, y });
  return `M${x},${y - halfHeight} L${offset.x},${y} L${x},${y + halfHeight}`;
}

// Memoized Table Node Component - prevents re-render when other tables change
interface ERDTableNodeProps {
  node: TableNode;
  theme: ThemeColors;
  isHighlighted: boolean;
  highlightedColumn: { table: string; column: string } | null;
  isSelected: boolean;
  onDragStart: (tableId: string, x: number, y: number, e: Konva.KonvaEventObject<DragEvent>) => void;
  onDragMove: (tableId: string, x: number, y: number) => void;
  onDragEnd: (tableId: string, x: number, y: number) => void;
  onHoverChange: (tableId: string | null) => void;
  onClick: (tableId: string, e: Konva.KonvaEventObject<MouseEvent>) => void;
  stageRef: React.RefObject<Konva.Stage>;
}

const ERDTableNode = memo(function ERDTableNode({
  node,
  theme,
  isHighlighted,
  highlightedColumn,
  isSelected,
  onDragStart,
  onDragMove,
  onDragEnd,
  onHoverChange,
  onClick,
  stageRef
}: ERDTableNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  const { table, x, y, width, height, colorIndex } = node;
  const color = TABLE_COLORS[colorIndex];

  // Get PK and FK columns
  const pkCols = useMemo(() => {
    const set = new Set<string>();
    table.constraints.forEach(c => {
      if (c.type === 'Primary Key') {
        c.localCols.split(',').map(s => s.trim().toUpperCase()).forEach(col => set.add(col));
      }
    });
    return set;
  }, [table.constraints]);

  const fkCols = useMemo(() => {
    const set = new Set<string>();
    table.constraints.forEach(c => {
      if (c.type === 'Foreign Key') {
        c.localCols.split(',').map(s => s.trim().toUpperCase()).forEach(col => set.add(col));
      }
    });
    return set;
  }, [table.constraints]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    onHoverChange(node.id);
    const stage = stageRef.current;
    if (stage) {
      stage.container().style.cursor = 'move';
    }
  }, [node.id, onHoverChange, stageRef]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    onHoverChange(null);
    const stage = stageRef.current;
    if (stage) {
      stage.container().style.cursor = 'grab';
    }
  }, [onHoverChange, stageRef]);

  return (
    <Group
      x={x}
      y={y}
      draggable
      onDragStart={(e) => {
        e.cancelBubble = true;
        onDragStart(node.id, e.target.x(), e.target.y(), e);
      }}
      onDragMove={(e) => {
        e.cancelBubble = true;
        onDragMove(node.id, e.target.x(), e.target.y());
      }}
      onDragEnd={(e) => {
        e.cancelBubble = true;
        onDragEnd(node.id, e.target.x(), e.target.y());
      }}
      onClick={(e) => {
        e.cancelBubble = true;
        onClick(node.id, e);
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Shadow */}
      <Rect
        width={width}
        height={height}
        fill={theme.table.shadow}
        cornerRadius={6}
        offsetX={-3}
        offsetY={-3}
      />

      {/* Selection border (for multi-select) */}
      {isSelected && (
        <Rect
          x={-5}
          y={-5}
          width={width + 10}
          height={height + 10}
          stroke="#3b82f6"
          strokeWidth={3}
          cornerRadius={8}
          fill="rgba(59, 130, 246, 0.08)"
        />
      )}

      {/* Highlight border (for search) */}
      {isHighlighted && !isSelected && (
        <Rect
          x={-4}
          y={-4}
          width={width + 8}
          height={height + 8}
          stroke={color.regular}
          strokeWidth={3}
          cornerRadius={8}
          dash={[8, 4]}
        />
      )}

      {/* Main container */}
      <Rect
        width={width}
        height={height}
        fill={theme.table.background}
        stroke={isSelected ? '#3b82f6' : (isHovered || isHighlighted ? color.regular : theme.table.border)}
        strokeWidth={isSelected || isHovered || isHighlighted ? 2 : 1}
        cornerRadius={6}
      />

      {/* Color strip at top */}
      <Rect
        width={width}
        height={SIZING.TABLE_COLOR_HEIGHT}
        fill={color.regular}
        cornerRadius={[6, 6, 0, 0]}
      />

      {/* Header background */}
      <Rect
        y={SIZING.TABLE_COLOR_HEIGHT}
        width={width}
        height={SIZING.TABLE_HEADER_HEIGHT}
        fill={theme.table.headerBackground}
      />

      {/* Table name */}
      <Text
        text={table.tableName}
        x={SIZING.PADDING + 6}
        y={SIZING.TABLE_COLOR_HEIGHT + 10}
        width={width - SIZING.PADDING * 2 - 12}
        fontSize={FONTS.SIZE_TABLE_TITLE}
        fontFamily={FONTS.FAMILY}
        fontStyle="bold"
        fill={theme.text.primary}
        ellipsis={true}
      />

      {/* Separator line */}
      <Line
        points={[0, SIZING.TABLE_COLOR_HEIGHT + SIZING.TABLE_HEADER_HEIGHT, width, SIZING.TABLE_COLOR_HEIGHT + SIZING.TABLE_HEADER_HEIGHT]}
        stroke={theme.table.border}
        strokeWidth={1}
      />

      {/* Columns */}
      {table.columns.map((col, i) => {
        const colY = SIZING.TABLE_COLOR_HEIGHT + SIZING.TABLE_HEADER_HEIGHT + (i * SIZING.COLUMN_HEIGHT);
        const isPk = pkCols.has(col.name.toUpperCase());
        const isFk = fkCols.has(col.name.toUpperCase());
        const isColHighlighted = highlightedColumn?.table === node.id &&
                                  highlightedColumn?.column.toUpperCase() === col.name.toUpperCase();
        const isColHovered = hoveredColumn === col.name;

        return (
          <Group key={col.name} y={colY}>
            {/* Row highlight for search */}
            {isColHighlighted && (
              <Rect
                x={1}
                width={width - 2}
                height={SIZING.COLUMN_HEIGHT}
                fill={color.regular}
                opacity={0.15}
              />
            )}

            {/* Row highlight for hover */}
            {isColHovered && !isColHighlighted && (
              <Rect
                x={1}
                width={width - 2}
                height={SIZING.COLUMN_HEIGHT}
                fill={theme.table.headerBackground}
                opacity={0.8}
              />
            )}

            {/* Row background for PK/FK */}
            {(isPk || isFk) && !isColHighlighted && !isColHovered && (
              <Rect
                x={1}
                width={width - 2}
                height={SIZING.COLUMN_HEIGHT}
                fill={isPk ? color.lighter : '#f0f9ff'}
                opacity={0.3}
              />
            )}

            {/* Invisible rect for hover detection */}
            <Rect
              x={0}
              width={width}
              height={SIZING.COLUMN_HEIGHT}
              fill="transparent"
              onMouseEnter={() => setHoveredColumn(col.name)}
              onMouseLeave={() => setHoveredColumn(null)}
            />

            {/* Key indicator */}
            {(isPk || isFk) && (
              <Text
                text={isPk ? '🔑' : '🔗'}
                x={6}
                y={7}
                fontSize={10}
              />
            )}

            {/* Column name */}
            <Text
              text={col.name}
              x={isPk || isFk ? 22 : SIZING.PADDING + 6}
              y={8}
              width={width * 0.5}
              fontSize={FONTS.SIZE_SM}
              fontFamily={FONTS.FAMILY}
              fontStyle={isPk || isColHighlighted ? 'bold' : 'normal'}
              fill={isPk ? color.regular : theme.text.primary}
              ellipsis={true}
            />

            {/* Column type */}
            <Text
              text={col.type}
              x={width * 0.55}
              y={8}
              width={width * 0.4}
              fontSize={FONTS.SIZE_SM - 1}
              fontFamily={FONTS.FAMILY}
              fill={theme.text.secondary}
              ellipsis={true}
              align="right"
            />
          </Group>
        );
      })}
    </Group>
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render when necessary
  return (
    prevProps.node.id === nextProps.node.id &&
    prevProps.node.x === nextProps.node.x &&
    prevProps.node.y === nextProps.node.y &&
    prevProps.node.width === nextProps.node.width &&
    prevProps.node.height === nextProps.node.height &&
    prevProps.node.colorIndex === nextProps.node.colorIndex &&
    prevProps.theme === nextProps.theme &&
    prevProps.isHighlighted === nextProps.isHighlighted &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.highlightedColumn?.table === nextProps.highlightedColumn?.table &&
    prevProps.highlightedColumn?.column === nextProps.highlightedColumn?.column
  );
});

// Memoized Edge Component - prevents re-render when unrelated state changes
interface ERDEdgePathProps {
  edge: Edge;
  sourceNode: TableNode;
  targetNode: TableNode;
  theme: ThemeColors;
  hoveredTableId: string | null;
}

const ERDEdgePath = memo(function ERDEdgePath({
  edge,
  sourceNode,
  targetNode,
  theme,
  hoveredTableId
}: ERDEdgePathProps) {
  // Get column Y position
  const getColumnY = (node: TableNode, colName: string): number => {
    const colIndex = node.table.columns.findIndex(
      c => c.name.toUpperCase() === colName.toUpperCase()
    );
    const baseY = node.y + SIZING.TABLE_COLOR_HEIGHT + SIZING.TABLE_HEADER_HEIGHT;
    if (colIndex === -1) return baseY + SIZING.COLUMN_HEIGHT / 2;
    return baseY + (colIndex * SIZING.COLUMN_HEIGHT) + SIZING.COLUMN_HEIGHT / 2;
  };

  const sourceY = getColumnY(sourceNode, edge.sourceColumn);
  const targetY = getColumnY(targetNode, edge.targetColumn);

  const [sourcePosition, targetPosition, sourceX, targetX] = computeConnectionHandlePos(
    sourceNode.x,
    sourceNode.width,
    targetNode.x,
    targetNode.width
  );

  const sourcePoint = { x: sourceX, y: sourceY };
  const targetPoint = { x: targetX, y: targetY };

  const pathData = getBezierPath(sourcePoint, targetPoint, sourcePosition, targetPosition);
  const sourceSymbol = getManySymbol(sourceX, sourceY, sourcePosition);
  const targetSymbol = getOneSymbol(targetX, targetY, targetPosition);

  const fullPath = `${pathData} ${sourceSymbol} ${targetSymbol}`;

  const isHovered = hoveredTableId === edge.sourceTable || hoveredTableId === edge.targetTable;
  const sourceColor = TABLE_COLORS[sourceNode.colorIndex];

  return (
    <Path
      data={fullPath}
      stroke={isHovered ? sourceColor.regular : theme.connection.default}
      strokeWidth={isHovered ? 2.5 : SIZING.CONNECTION_STROKE_WIDTH}
      lineCap="round"
      lineJoin="round"
      opacity={isHovered ? 1 : 0.7}
    />
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render when nodes move or hover changes
  return (
    prevProps.edge.id === nextProps.edge.id &&
    prevProps.sourceNode.x === nextProps.sourceNode.x &&
    prevProps.sourceNode.y === nextProps.sourceNode.y &&
    prevProps.targetNode.x === nextProps.targetNode.x &&
    prevProps.targetNode.y === nextProps.targetNode.y &&
    prevProps.theme === nextProps.theme &&
    prevProps.hoveredTableId === nextProps.hoveredTableId
  );
});

export default function ERDViewer({ tables, isDarkTheme, darkThemeVariant = 'slate', scriptId, scriptName = 'ERD', onRefresh }: ERDViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dragRafRef = useRef<number | null>(null);
  const pendingDragRef = useRef<{ tableId: string; x: number; y: number } | null>(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(0.8);
  const [stagePosition, setStagePosition] = useState({ x: 50, y: 50 });
  const [isDraggingStage, setIsDraggingStage] = useState(false);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExportPreview, setShowExportPreview] = useState(false);

  // Table positions stored separately from nodes to avoid re-layout
  const [tablePositions, setTablePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [initialLayoutDone, setInitialLayoutDone] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [highlightedTable, setHighlightedTable] = useState<string | null>(null);
  const [highlightedColumn, setHighlightedColumn] = useState<{ table: string; column: string } | null>(null);

  // ERD settings
  const [groupTemporalColors, setGroupTemporalColors] = useState(
    localStorage.getItem('erd_group_temporal_colors') === 'true'
  );
  const [smartAutoLayout, setSmartAutoLayout] = useState(
    localStorage.getItem('erd_smart_auto_layout') === 'true'
  );
  const [isComputingLayout, setIsComputingLayout] = useState(false);

  // Multi-select state
  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set());
  // For multi-drag: store initial positions and track latest drag position
  const multiDragStartRef = useRef<{
    draggedTableId: string;
    initialPositions: Record<string, { x: number; y: number }>;
  } | null>(null);
  const pendingMultiDragRef = useRef<{ x: number; y: number } | null>(null);

  // Selection rectangle state (for Ctrl+drag marquee selection)
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionRect, setSelectionRect] = useState<{ startX: number; startY: number; endX: number; endY: number } | null>(null);

  // Position copy dropdown state
  const [showCopyPositionsDropdown, setShowCopyPositionsDropdown] = useState(false);
  const [matchingScripts, setMatchingScripts] = useState<{ scriptId: string; scriptName: string; matchCount: number }[]>([]);

  // Zoom sensitivity (default to 1.1 = Medium)
  const [zoomSensitivity, setZoomSensitivity] = useState(() => {
    const saved = localStorage.getItem('erd_zoom_sensitivity');
    return saved ? parseFloat(saved) : 1.1;
  });

  // Listen for settings changes
  useEffect(() => {
    const handleSettingsChange = () => {
      setGroupTemporalColors(localStorage.getItem('erd_group_temporal_colors') === 'true');
      setSmartAutoLayout(localStorage.getItem('erd_smart_auto_layout') === 'true');
      const savedZoom = localStorage.getItem('erd_zoom_sensitivity');
      setZoomSensitivity(savedZoom ? parseFloat(savedZoom) : 1.1);
    };
    window.addEventListener('erd-settings-changed', handleSettingsChange);
    return () => window.removeEventListener('erd-settings-changed', handleSettingsChange);
  }, []);

  const theme = getTheme(isDarkTheme, darkThemeVariant);

  // Load saved positions on mount
  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey(scriptId));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTablePositions(parsed);
        setInitialLayoutDone(true); // Mark as done so we don't overwrite with auto-layout
      } catch (e) {
        console.error('Failed to load saved positions');
      }
    }
  }, [scriptId]);

  // Save positions when they change
  const savePositions = useCallback((positions: Record<string, { x: number; y: number }>) => {
    localStorage.setItem(getStorageKey(scriptId), JSON.stringify(positions));
  }, [scriptId]);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + F for search
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      // Ctrl/Cmd + A to select all tables
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        // Only if not focused on an input
        if (document.activeElement?.tagName !== 'INPUT') {
          e.preventDefault();
          const allTableIds = new Set(tables.map(t => t.tableName.toUpperCase()));
          setSelectedTables(allTableIds);
        }
      }
      // Escape to clear selection and close dropdowns
      if (e.key === 'Escape') {
        setShowSearchDropdown(false);
        setSearchQuery('');
        setShowCopyPositionsDropdown(false);
        setSelectedTables(new Set());
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tables]);

  // Extract FK relationships
  const edges = useMemo((): Edge[] => {
    const result: Edge[] = [];
    const tableNames = new Set(tables.map(t => t.tableName.toUpperCase()));

    for (const table of tables) {
      for (const constraint of table.constraints) {
        if (constraint.type === 'Foreign Key' && constraint.ref) {
          const refMatch = constraint.ref.match(/(?:(\w+)\.)?(\w+)\(([^)]+)\)/);
          if (refMatch) {
            const refTable = refMatch[2].toUpperCase();
            const refCol = refMatch[3].split(',')[0].trim();

            if (tableNames.has(refTable)) {
              result.push({
                id: `${table.tableName}-${refTable}-${constraint.localCols}`,
                sourceTable: table.tableName.toUpperCase(),
                sourceColumn: constraint.localCols.split(',')[0].trim(),
                targetTable: refTable,
                targetColumn: refCol
              });
            }
          }
        }
      }
    }

    return result;
  }, [tables]);

  // Helper to identify master/temporal table pairs and group them
  const getTableGroups = useCallback((tableList: Table[]): Map<string, { master: Table; temporal?: Table }> => {
    const groups = new Map<string, { master: Table; temporal?: Table }>();
    const tableMap = new Map<string, Table>();

    tableList.forEach(t => tableMap.set(t.tableName.toUpperCase(), t));

    tableList.forEach(table => {
      const upperName = table.tableName.toUpperCase();

      // Check if this is a temporal table (ends with _T)
      if (upperName.endsWith('_T')) {
        const masterName = upperName.slice(0, -2);
        const masterTable = tableMap.get(masterName);
        if (masterTable) {
          // Add to master's group
          const existing = groups.get(masterName);
          if (existing) {
            existing.temporal = table;
          } else {
            groups.set(masterName, { master: masterTable, temporal: table });
          }
          return;
        }
      }

      // Not a temporal table or no master found
      if (!upperName.endsWith('_T') && !groups.has(upperName)) {
        groups.set(upperName, { master: table });
      }
    });

    // Add any temporal tables without masters as standalone
    tableList.forEach(table => {
      const upperName = table.tableName.toUpperCase();
      if (upperName.endsWith('_T')) {
        const masterName = upperName.slice(0, -2);
        if (!groups.has(masterName)) {
          groups.set(upperName, { master: table });
        }
      }
    });

    return groups;
  }, []);

  // Compute smart layout using ELK.js
  const computeSmartLayout = useCallback(async (): Promise<Record<string, { x: number; y: number }>> => {
    if (tables.length === 0) return {};

    // Get table groups (master + temporal pairs)
    const tableGroups = getTableGroups(tables);

    // Build ELK graph structure
    // Group tables by schema for better organization
    const schemaGroups = new Map<string, Table[]>();
    tables.forEach(table => {
      const schema = table.schema || 'DEFAULT';
      if (!schemaGroups.has(schema)) {
        schemaGroups.set(schema, []);
      }
      schemaGroups.get(schema)!.push(table);
    });

    // Create ELK nodes with partitioning
    // Partition logic: master + _T tables share same partition for side-by-side placement
    const elkNodes: any[] = [];
    let partitionIndex = 0;
    const tablePartitions = new Map<string, number>();

    // Assign partitions to table groups
    tableGroups.forEach((group, _masterName) => {
      tablePartitions.set(group.master.tableName.toUpperCase(), partitionIndex);
      if (group.temporal) {
        tablePartitions.set(group.temporal.tableName.toUpperCase(), partitionIndex);
      }
      partitionIndex++;
    });

    tables.forEach(table => {
      const tableId = table.tableName.toUpperCase();
      const width = calculateTableWidth(table);
      const height = calculateTableHeight(table);
      const partition = tablePartitions.get(tableId) ?? 0;

      elkNodes.push({
        id: tableId,
        width,
        height,
        layoutOptions: {
          'partitioning.partition': partition.toString()
        }
      });
    });

    // Create ELK edges
    const elkEdges: any[] = edges.map((edge, i) => ({
      id: `e${i}`,
      sources: [edge.sourceTable],
      targets: [edge.targetTable]
    }));

    // Build ELK graph
    const elkGraph = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': 'RIGHT',
        'elk.spacing.nodeNode': String(SIZING.TABLES_GAP_Y),
        'elk.layered.spacing.nodeNodeBetweenLayers': String(SIZING.TABLES_GAP_X),
        'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
        'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
        'elk.padding': `[top=${SIZING.DIAGRAM_PADDING},left=${SIZING.DIAGRAM_PADDING},bottom=${SIZING.DIAGRAM_PADDING},right=${SIZING.DIAGRAM_PADDING}]`,
        // Enable partitioning to group related tables
        'elk.partitioning.activate': 'true',
        // Improve edge routing
        'elk.layered.unnecessaryBendpoints': 'true',
        'elk.layered.mergeEdges': 'true'
      },
      children: elkNodes,
      edges: elkEdges
    };

    try {
      const layoutResult = await elk.layout(elkGraph);

      // Extract positions from ELK result
      const positions: Record<string, { x: number; y: number }> = {};

      if (layoutResult.children) {
        layoutResult.children.forEach((node: any) => {
          positions[node.id] = {
            x: node.x ?? 0,
            y: node.y ?? 0
          };
        });
      }

      // Post-process: ensure master + _T tables are truly side-by-side
      // ELK partitioning puts them in same layer, but we want them adjacent horizontally
      tableGroups.forEach((group, _masterName) => {
        if (group.temporal) {
          const masterId = group.master.tableName.toUpperCase();
          const temporalId = group.temporal.tableName.toUpperCase();
          const masterPos = positions[masterId];
          const temporalPos = positions[temporalId];

          if (masterPos && temporalPos) {
            const masterWidth = calculateTableWidth(group.master);

            // If they're not already side-by-side, adjust temporal position
            // Place temporal table to the right of master with small gap
            const idealTemporalX = masterPos.x + masterWidth + 30; // 30px gap

            // Only adjust if temporal is not already close to master horizontally
            if (Math.abs(temporalPos.x - idealTemporalX) > masterWidth) {
              positions[temporalId] = {
                x: idealTemporalX,
                y: masterPos.y // Same Y position for side-by-side
              };
            }
          }
        }
      });

      // Handle collision detection after positioning temporal tables
      // Sort by Y then X to process in order
      const sortedPositions = Object.entries(positions).sort(([, a], [, b]) => {
        if (Math.abs(a.y - b.y) < 10) return a.x - b.x;
        return a.y - b.y;
      });

      // Simple collision resolution - push overlapping tables down
      for (let i = 0; i < sortedPositions.length; i++) {
        const [id1, pos1] = sortedPositions[i];
        const table1 = tables.find(t => t.tableName.toUpperCase() === id1);
        if (!table1) continue;

        const width1 = calculateTableWidth(table1);
        const height1 = calculateTableHeight(table1);

        for (let j = i + 1; j < sortedPositions.length; j++) {
          const [id2, pos2] = sortedPositions[j];
          const table2 = tables.find(t => t.tableName.toUpperCase() === id2);
          if (!table2) continue;

          const width2 = calculateTableWidth(table2);
          const height2 = calculateTableHeight(table2);

          // Check for overlap
          const overlapX = pos1.x < pos2.x + width2 && pos1.x + width1 > pos2.x;
          const overlapY = pos1.y < pos2.y + height2 && pos1.y + height1 > pos2.y;

          if (overlapX && overlapY) {
            // Push the second table to the right or down
            if (pos2.x - pos1.x < pos2.y - pos1.y) {
              // Push right
              positions[id2] = {
                x: pos1.x + width1 + SIZING.TABLES_GAP_X,
                y: pos2.y
              };
            } else {
              // Push down
              positions[id2] = {
                x: pos2.x,
                y: pos1.y + height1 + SIZING.TABLES_GAP_Y
              };
            }
            sortedPositions[j] = [id2, positions[id2]];
          }
        }
      }

      return positions;
    } catch (error) {
      console.error('ELK layout failed:', error);
      return {};
    }
  }, [tables, edges, getTableGroups]);

  // Initial layout with Dagre - handles connected and isolated tables separately
  const initialLayout = useMemo((): Record<string, { x: number; y: number; width: number; height: number; colorIndex: number }> => {
    if (tables.length === 0) return {};

    // Identify connected vs isolated tables
    const connectedTables = new Set<string>();
    edges.forEach(edge => {
      connectedTables.add(edge.sourceTable);
      connectedTables.add(edge.targetTable);
    });

    const connectedTablesList = tables.filter(t => connectedTables.has(t.tableName.toUpperCase()));
    const isolatedTablesList = tables.filter(t => !connectedTables.has(t.tableName.toUpperCase()));

    const layout: Record<string, { x: number; y: number; width: number; height: number; colorIndex: number }> = {};
    let maxY = SIZING.DIAGRAM_PADDING;
    let maxX = SIZING.DIAGRAM_PADDING;

    // Layout connected tables with Dagre
    if (connectedTablesList.length > 0) {
      const g = new dagre.graphlib.Graph();
      g.setGraph({
        rankdir: 'LR',
        nodesep: SIZING.TABLES_GAP_Y,
        ranksep: SIZING.TABLES_GAP_X,
        marginx: SIZING.DIAGRAM_PADDING,
        marginy: SIZING.DIAGRAM_PADDING
      });
      g.setDefaultEdgeLabel(() => ({}));

      // Add connected nodes
      connectedTablesList.forEach((table) => {
        const width = calculateTableWidth(table);
        const height = calculateTableHeight(table);
        const colorIndex = getTableColorIndex(table.tableName, tables, groupTemporalColors);
        g.setNode(table.tableName.toUpperCase(), { width, height, colorIndex });
      });

      // Add edges
      edges.forEach(edge => {
        g.setEdge(edge.sourceTable, edge.targetTable);
      });

      // Run layout
      dagre.layout(g);

      // Extract positioned nodes
      connectedTablesList.forEach((table) => {
        const node = g.node(table.tableName.toUpperCase());
        const width = calculateTableWidth(table);
        const height = calculateTableHeight(table);
        const tableId = table.tableName.toUpperCase();
        const colorIndex = getTableColorIndex(table.tableName, tables, groupTemporalColors);

        const x = node ? node.x - width / 2 : SIZING.DIAGRAM_PADDING;
        const y = node ? node.y - height / 2 : SIZING.DIAGRAM_PADDING;

        layout[tableId] = {
          x,
          y,
          width,
          height,
          colorIndex
        };

        maxX = Math.max(maxX, x + width);
        maxY = Math.max(maxY, y + height);
      });
    }

    // Layout isolated tables HORIZONTALLY below connected tables
    if (isolatedTablesList.length > 0) {
      const startY = connectedTablesList.length > 0 ? maxY + SIZING.TABLES_GAP_Y * 1.5 : SIZING.DIAGRAM_PADDING;
      let currentX = SIZING.DIAGRAM_PADDING;
      let rowMaxHeight = 0;
      let currentY = startY;
      const maxRowWidth = Math.max(maxX, 1200); // Use connected tables width or reasonable default

      isolatedTablesList.forEach((table) => {
        const width = calculateTableWidth(table);
        const height = calculateTableHeight(table);
        const tableId = table.tableName.toUpperCase();
        const colorIndex = getTableColorIndex(table.tableName, tables, groupTemporalColors);

        // Check if we need to wrap to next row
        if (currentX + width > maxRowWidth && currentX > SIZING.DIAGRAM_PADDING) {
          currentX = SIZING.DIAGRAM_PADDING;
          currentY += rowMaxHeight + SIZING.TABLES_GAP_Y;
          rowMaxHeight = 0;
        }

        layout[tableId] = {
          x: currentX,
          y: currentY,
          width,
          height,
          colorIndex
        };

        currentX += width + SIZING.TABLES_GAP_X;
        rowMaxHeight = Math.max(rowMaxHeight, height);
      });
    }

    return layout;
  }, [tables, edges, groupTemporalColors]);

  // Set initial positions from layout if not already set
  useEffect(() => {
    // Only set positions from auto-layout if:
    // 1. We haven't done initial layout yet
    // 2. There's no saved positions in localStorage
    // 3. We have tables to layout
    if (!initialLayoutDone && Object.keys(initialLayout).length > 0) {
      const saved = localStorage.getItem(getStorageKey(scriptId));
      if (!saved) {
        // No saved positions, compute layout
        if (smartAutoLayout) {
          // Use smart ELK.js layout for initial positioning
          setIsComputingLayout(true);
          computeSmartLayout()
            .then(positions => {
              if (Object.keys(positions).length > 0) {
                setTablePositions(positions);
                savePositions(positions);
              } else {
                // Fallback to dagre
                const dagrePositions: Record<string, { x: number; y: number }> = {};
                for (const [id, layout] of Object.entries(initialLayout)) {
                  dagrePositions[id] = { x: layout.x, y: layout.y };
                }
                setTablePositions(dagrePositions);
              }
            })
            .catch(() => {
              // Fallback to dagre on error
              const dagrePositions: Record<string, { x: number; y: number }> = {};
              for (const [id, layout] of Object.entries(initialLayout)) {
                dagrePositions[id] = { x: layout.x, y: layout.y };
              }
              setTablePositions(dagrePositions);
            })
            .finally(() => {
              setIsComputingLayout(false);
            });
        } else {
          // Use dagre layout
          const positions: Record<string, { x: number; y: number }> = {};
          for (const [id, layout] of Object.entries(initialLayout)) {
            positions[id] = { x: layout.x, y: layout.y };
          }
          setTablePositions(positions);
        }
      }
      setInitialLayoutDone(true);
    }
  }, [initialLayout, initialLayoutDone, scriptId, smartAutoLayout, computeSmartLayout, savePositions]);

  // Compute nodes with current positions
  const nodes = useMemo((): TableNode[] => {
    return tables.map((table, index) => {
      const tableId = table.tableName.toUpperCase();
      const layout = initialLayout[tableId];
      const savedPos = tablePositions[tableId];

      return {
        id: tableId,
        table,
        x: savedPos?.x ?? layout?.x ?? index * 300,
        y: savedPos?.y ?? layout?.y ?? index * 50,
        width: layout?.width ?? calculateTableWidth(table),
        height: layout?.height ?? calculateTableHeight(table),
        colorIndex: layout?.colorIndex ?? getTableColorIndex(table.tableName, tables, groupTemporalColors)
      };
    });
  }, [tables, initialLayout, tablePositions, groupTemporalColors]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    for (const table of tables) {
      const tableId = table.tableName.toUpperCase();

      // Search table name
      if (table.tableName.toLowerCase().includes(query)) {
        results.push({
          type: 'table',
          tableName: table.tableName,
          tableId
        });
      }

      // Search column names
      for (const col of table.columns) {
        if (col.name.toLowerCase().includes(query)) {
          results.push({
            type: 'column',
            tableName: table.tableName,
            columnName: col.name,
            tableId
          });
        }
      }
    }

    // Sort: exact matches first, then tables before columns
    results.sort((a, b) => {
      const aExact = (a.type === 'table' ? a.tableName : a.columnName)?.toLowerCase() === query;
      const bExact = (b.type === 'table' ? b.tableName : b.columnName)?.toLowerCase() === query;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      if (a.type !== b.type) return a.type === 'table' ? -1 : 1;
      return a.tableName.localeCompare(b.tableName);
    });

    setSearchResults(results.slice(0, 10));
    setShowSearchDropdown(results.length > 0);
  }, [searchQuery, tables]);

  // Handle search result selection
  const handleSelectResult = (result: SearchResult) => {
    setHighlightedTable(result.tableId);
    if (result.type === 'column' && result.columnName) {
      setHighlightedColumn({ table: result.tableId, column: result.columnName });
    } else {
      setHighlightedColumn(null);
    }

    // Center on the table
    const node = nodes.find(n => n.id === result.tableId);
    if (node) {
      const centerX = dimensions.width / 2 - (node.x + node.width / 2) * scale;
      const centerY = dimensions.height / 2 - (node.y + node.height / 2) * scale;
      setStagePosition({ x: centerX, y: centerY });
    }

    setShowSearchDropdown(false);
    setSearchQuery('');

    // Clear highlight after 3 seconds
    setTimeout(() => {
      setHighlightedTable(null);
      setHighlightedColumn(null);
    }, 3000);
  };

  // Zoom handler with smooth scaling
  const handleWheel = useCallback((e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();

    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stagePosition.x) / oldScale,
      y: (pointer.y - stagePosition.y) / oldScale
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    // Use zoomSensitivity from settings (default 1.1 = 10% per scroll)
    const newScale = direction > 0 ? oldScale * zoomSensitivity : oldScale / zoomSensitivity;
    const clampedScale = Math.min(Math.max(newScale, 0.1), 3);

    setScale(clampedScale);
    setStagePosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale
    });
  }, [scale, stagePosition, zoomSensitivity]);

  // Zoom controls
  const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.1));

  const handleReset = () => {
    setScale(0.8);
    setStagePosition({ x: 50, y: 50 });
  };

  const handleResetPositions = useCallback(async () => {
    // Clear saved positions
    localStorage.removeItem(getStorageKey(scriptId));

    if (smartAutoLayout) {
      // Use smart ELK.js layout
      setIsComputingLayout(true);
      try {
        const positions = await computeSmartLayout();
        if (Object.keys(positions).length > 0) {
          setTablePositions(positions);
          savePositions(positions);
        } else {
          // Fallback to dagre if ELK fails
          setTablePositions({});
          setInitialLayoutDone(false);
        }
      } catch (error) {
        console.error('Smart layout failed, falling back to dagre:', error);
        setTablePositions({});
        setInitialLayoutDone(false);
      } finally {
        setIsComputingLayout(false);
      }
    } else {
      // Use standard dagre layout
      setTablePositions({});
      setInitialLayoutDone(false);
    }

    setScale(0.8);
    setStagePosition({ x: 50, y: 50 });
  }, [scriptId, smartAutoLayout, computeSmartLayout, savePositions]);

  const handleFitView = useCallback(() => {
    if (nodes.length === 0) return;

    const minX = Math.min(...nodes.map(n => n.x));
    const minY = Math.min(...nodes.map(n => n.y));
    const maxX = Math.max(...nodes.map(n => n.x + n.width));
    const maxY = Math.max(...nodes.map(n => n.y + n.height));

    const contentWidth = maxX - minX + SIZING.DIAGRAM_PADDING * 2;
    const contentHeight = maxY - minY + SIZING.DIAGRAM_PADDING * 2;

    const scaleX = dimensions.width / contentWidth;
    const scaleY = dimensions.height / contentHeight;
    const newScale = Math.min(scaleX, scaleY, 1) * 0.9;

    setScale(newScale);
    setStagePosition({
      x: (dimensions.width - contentWidth * newScale) / 2 - minX * newScale + SIZING.DIAGRAM_PADDING,
      y: (dimensions.height - contentHeight * newScale) / 2 - minY * newScale + SIZING.DIAGRAM_PADDING
    });
  }, [nodes, dimensions]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Show export preview modal
  const handleExport = () => {
    setShowExportPreview(true);
  };

  // Stage drag handlers - only update position without affecting tables
  const handleStageDragStart = () => setIsDraggingStage(true);
  const handleStageDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setIsDraggingStage(false);
    setStagePosition({ x: e.target.x(), y: e.target.y() });
  };

  // Handle table click for selection (Ctrl+click to toggle, regular click to clear and select)
  const handleTableClick = useCallback((tableId: string, e: Konva.KonvaEventObject<MouseEvent>) => {
    const isCtrlPressed = e.evt.ctrlKey || e.evt.metaKey;

    if (isCtrlPressed) {
      // Toggle selection
      setSelectedTables(prev => {
        const newSet = new Set(prev);
        if (newSet.has(tableId)) {
          newSet.delete(tableId);
        } else {
          newSet.add(tableId);
        }
        return newSet;
      });
    } else {
      // If clicking on a selected table without Ctrl, don't change selection
      // This allows dragging the selection
      if (!selectedTables.has(tableId)) {
        // Clear selection if clicking unselected table without Ctrl
        setSelectedTables(new Set());
      }
    }
  }, [selectedTables]);

  // Handle table drag start - prepare for multi-drag if table is selected
  const handleTableDragStart = useCallback((tableId: string, _startX: number, _startY: number, _e: Konva.KonvaEventObject<DragEvent>) => {
    if (selectedTables.has(tableId) && selectedTables.size > 1) {
      // Starting multi-drag - get positions from nodes array (has ALL table positions, not just dragged ones)
      const initialPositions: Record<string, { x: number; y: number }> = {};
      selectedTables.forEach(id => {
        // Find the node to get its current position (nodes has computed positions for all tables)
        const node = nodes.find(n => n.id === id);
        if (node) {
          initialPositions[id] = { x: node.x, y: node.y };
        }
      });
      multiDragStartRef.current = {
        draggedTableId: tableId,
        initialPositions
      };
      pendingMultiDragRef.current = null;
    } else {
      // Not a multi-drag, clear ref
      multiDragStartRef.current = null;
    }
  }, [selectedTables, nodes]);

  // Table drag handler - throttled with requestAnimationFrame for smooth performance
  const handleTableDragMove = useCallback((tableId: string, newX: number, newY: number) => {
    // Check if this is a multi-drag - only rely on ref, not state (avoids stale closure issues)
    // multiDragStartRef is set at drag start and contains all selected table IDs
    const multiDragStart = multiDragStartRef.current;
    const isMultiDrag = multiDragStart !== null &&
                        multiDragStart.draggedTableId === tableId &&
                        Object.keys(multiDragStart.initialPositions).length > 1;

    if (isMultiDrag && multiDragStart) {
      // Store the latest position for the dragged table
      pendingMultiDragRef.current = { x: newX, y: newY };

      if (dragRafRef.current === null) {
        dragRafRef.current = requestAnimationFrame(() => {
          const currentMultiDrag = multiDragStartRef.current;
          const latestPos = pendingMultiDragRef.current;

          if (currentMultiDrag && latestPos) {
            // Calculate delta from the dragged table's initial position
            const draggedInitialPos = currentMultiDrag.initialPositions[currentMultiDrag.draggedTableId];
            if (draggedInitialPos) {
              const deltaX = latestPos.x - draggedInitialPos.x;
              const deltaY = latestPos.y - draggedInitialPos.y;

              // Apply delta to all selected tables
              const newPositions: Record<string, { x: number; y: number }> = {};
              Object.entries(currentMultiDrag.initialPositions).forEach(([id, origPos]) => {
                newPositions[id] = {
                  x: origPos.x + deltaX,
                  y: origPos.y + deltaY
                };
              });
              setTablePositions(prev => ({ ...prev, ...newPositions }));
            }
          }
          dragRafRef.current = null;
        });
      }
    } else {
      // Single table drag
      pendingDragRef.current = { tableId, x: newX, y: newY };

      if (dragRafRef.current === null) {
        dragRafRef.current = requestAnimationFrame(() => {
          const pending = pendingDragRef.current;
          if (pending) {
            setTablePositions(prev => ({
              ...prev,
              [pending.tableId]: { x: pending.x, y: pending.y }
            }));
          }
          dragRafRef.current = null;
        });
      }
    }
  }, []);

  const handleTableDragEnd = useCallback((tableId: string, newX: number, newY: number) => {
    const multiDragStart = multiDragStartRef.current;
    // Only rely on ref, not state (avoids stale closure issues)
    const isMultiDrag = multiDragStart !== null &&
                        multiDragStart.draggedTableId === tableId &&
                        Object.keys(multiDragStart.initialPositions).length > 1;

    if (isMultiDrag && multiDragStart) {
      // Multi-drag end: calculate final positions for all selected tables
      const draggedInitialPos = multiDragStart.initialPositions[tableId];
      if (draggedInitialPos) {
        const deltaX = newX - draggedInitialPos.x;
        const deltaY = newY - draggedInitialPos.y;

        // Use functional update to get latest tablePositions
        setTablePositions(prev => {
          const newPositions = { ...prev };
          Object.entries(multiDragStart.initialPositions).forEach(([id, origPos]) => {
            newPositions[id] = {
              x: origPos.x + deltaX,
              y: origPos.y + deltaY
            };
          });
          savePositions(newPositions);
          return newPositions;
        });
      }
    } else {
      // Single table drag end
      setTablePositions(prev => {
        const newPositions = {
          ...prev,
          [tableId]: { x: newX, y: newY }
        };
        savePositions(newPositions);
        return newPositions;
      });
    }
    // Always clear refs at end
    multiDragStartRef.current = null;
    pendingMultiDragRef.current = null;
  }, [savePositions]);

  // Stable callback for hover changes (used by memoized table components for edge highlighting)
  const handleTableHoverChange = useCallback((tableId: string | null) => {
    setHoveredTable(tableId);
  }, []);

  // Clear selection when clicking on empty canvas (without Ctrl)
  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    // Only clear if clicking directly on stage (not on a table) and not using Ctrl
    if (e.target === e.currentTarget && !e.evt.ctrlKey && !e.evt.metaKey) {
      setSelectedTables(new Set());
    }
  }, []);

  // Handle stage mouse down for marquee selection (Ctrl+drag)
  const handleStageMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    // Only start selection if Ctrl is pressed and clicking on empty canvas
    if ((e.evt.ctrlKey || e.evt.metaKey) && e.target === e.currentTarget) {
      const stage = stageRef.current;
      if (!stage) return;

      // Get pointer position in canvas coordinates (accounting for scale and position)
      const pointerPos = stage.getPointerPosition();
      if (!pointerPos) return;

      const canvasX = (pointerPos.x - stagePosition.x) / scale;
      const canvasY = (pointerPos.y - stagePosition.y) / scale;

      setIsSelecting(true);
      setSelectionRect({
        startX: canvasX,
        startY: canvasY,
        endX: canvasX,
        endY: canvasY
      });

      // Prevent stage dragging when selecting
      e.evt.preventDefault();
    }
  }, [scale, stagePosition]);

  // Handle stage mouse move for marquee selection
  const handleStageMouseMove = useCallback((_e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!isSelecting || !selectionRect) return;

    const stage = stageRef.current;
    if (!stage) return;

    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    const canvasX = (pointerPos.x - stagePosition.x) / scale;
    const canvasY = (pointerPos.y - stagePosition.y) / scale;

    setSelectionRect(prev => prev ? {
      ...prev,
      endX: canvasX,
      endY: canvasY
    } : null);
  }, [isSelecting, selectionRect, scale, stagePosition]);

  // Handle stage mouse up for marquee selection - select tables within rect
  const handleStageMouseUp = useCallback(() => {
    if (!isSelecting || !selectionRect) return;

    // Calculate normalized rectangle (handle negative width/height)
    const minX = Math.min(selectionRect.startX, selectionRect.endX);
    const maxX = Math.max(selectionRect.startX, selectionRect.endX);
    const minY = Math.min(selectionRect.startY, selectionRect.endY);
    const maxY = Math.max(selectionRect.startY, selectionRect.endY);

    // Find all tables that intersect with the selection rectangle
    const selectedIds = new Set<string>();
    nodes.forEach(node => {
      // Check if table overlaps with selection rectangle
      const tableLeft = node.x;
      const tableRight = node.x + node.width;
      const tableTop = node.y;
      const tableBottom = node.y + node.height;

      const overlapsX = tableLeft < maxX && tableRight > minX;
      const overlapsY = tableTop < maxY && tableBottom > minY;

      if (overlapsX && overlapsY) {
        selectedIds.add(node.id);
      }
    });

    // Add to existing selection (Ctrl+drag adds to selection)
    setSelectedTables(prev => {
      const newSet = new Set(prev);
      selectedIds.forEach(id => newSet.add(id));
      return newSet;
    });

    setIsSelecting(false);
    setSelectionRect(null);
  }, [isSelecting, selectionRect, nodes]);

  // Select all tables
  const handleSelectAll = useCallback(() => {
    const allTableIds = new Set(tables.map(t => t.tableName.toUpperCase()));
    setSelectedTables(allTableIds);
  }, [tables]);

  // Clear selection
  const handleClearSelection = useCallback(() => {
    setSelectedTables(new Set());
  }, []);

  // Create a lookup map for nodes by ID (for edge rendering)
  const nodeMap = useMemo(() => {
    const map = new Map<string, TableNode>();
    nodes.forEach(node => map.set(node.id, node));
    return map;
  }, [nodes]);

  if (tables.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-title">No Tables to Display</div>
        <div className="empty-state-text">
          The current script has no tables. Add tables to see the ERD.
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: theme.canvas.background,
        overflow: 'hidden'
      }}
    >
      {/* Floating Toolbar */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        zIndex: 100,
        display: 'flex',
        gap: '8px',
        alignItems: 'center',
        padding: '8px 12px',
        background: isDarkTheme
          ? (darkThemeVariant === 'vscode-gray' ? 'rgba(45, 45, 48, 0.95)' : 'rgba(31, 41, 55, 0.95)')
          : 'rgba(248, 250, 252, 0.95)',
        borderRadius: '8px',
        border: `1px solid ${theme.table.border}`,
        backdropFilter: 'blur(8px)',
        flexWrap: 'wrap'
      }}>
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '300px' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: theme.text.secondary
              }}
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tables or columns... (⌘F)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
              style={{
                width: '100%',
                padding: '6px 32px 6px 32px',
                border: `1px solid ${theme.table.border}`,
                borderRadius: '6px',
                fontSize: '12px',
                background: theme.table.headerBackground,
                color: theme.text.primary,
                outline: 'none'
              }}
            />
            {searchQuery && (
              <X
                size={14}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  cursor: 'pointer',
                  color: theme.text.secondary
                }}
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchDropdown(false);
                }}
              />
            )}
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '4px',
              background: theme.table.background,
              border: `1px solid ${theme.table.border}`,
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {searchResults.map((result, i) => (
                <div
                  key={`${result.tableId}-${result.columnName || 'table'}-${i}`}
                  onClick={() => handleSelectResult(result)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer',
                    borderBottom: i < searchResults.length - 1 ? `1px solid ${theme.table.border}` : 'none',
                    background: theme.table.background,
                    transition: 'background 0.1s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = theme.table.headerBackground}
                  onMouseLeave={(e) => e.currentTarget.style.background = theme.table.background}
                >
                  <div style={{
                    fontSize: '12px',
                    fontWeight: result.type === 'table' ? 600 : 400,
                    color: theme.text.primary
                  }}>
                    {result.type === 'table' ? result.tableName : `${result.tableName}.${result.columnName}`}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: theme.text.secondary,
                    textTransform: 'uppercase'
                  }}>
                    {result.type}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button className="btn btn-sm" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn size={16} />
          </button>
          <button className="btn btn-sm" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut size={16} />
          </button>
          <button className="btn btn-sm" onClick={handleFitView} title="Fit to View">
            <Maximize2 size={16} />
          </button>
          <button className="btn btn-sm" onClick={handleReset} title="Reset View">
            <RotateCcw size={16} />
          </button>
        </div>

        <div style={{
          padding: '4px 10px',
          background: theme.table.headerBackground,
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 500,
          color: theme.text.primary
        }}>
          {Math.round(scale * 100)}%
        </div>

        <div style={{ flex: 1 }} />

        {/* Selection indicator and controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 10px',
          background: selectedTables.size > 0 ? 'rgba(59, 130, 246, 0.1)' : theme.table.headerBackground,
          border: selectedTables.size > 0 ? '1px solid rgba(59, 130, 246, 0.3)' : `1px solid ${theme.table.border}`,
          borderRadius: '6px',
        }}>
          <MousePointer2 size={14} style={{ color: selectedTables.size > 0 ? '#3b82f6' : theme.text.secondary }} />
          {selectedTables.size > 0 ? (
            <>
              <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 500 }}>
                {selectedTables.size} selected
              </span>
              <button
                onClick={handleClearSelection}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '2px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#3b82f6'
                }}
                title="Clear selection (Esc)"
              >
                <X size={14} />
              </button>
            </>
          ) : (
            <button
              onClick={handleSelectAll}
              style={{
                background: 'none',
                border: 'none',
                padding: '0',
                cursor: 'pointer',
                fontSize: '12px',
                color: theme.text.secondary
              }}
              title="Select all tables (Ctrl+A)"
            >
              Select All
            </button>
          )}
        </div>

        {/* Copy positions from other scripts dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            className="btn btn-sm"
            onClick={() => {
              const scripts = getScriptsWithMatchingPositions(scriptId, tables);
              setMatchingScripts(scripts);
              setShowCopyPositionsDropdown(!showCopyPositionsDropdown);
            }}
            title="Copy table positions from another script with same schema"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Copy size={14} />
            Copy Positions
          </button>

          {showCopyPositionsDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '4px',
              background: theme.table.background,
              border: `1px solid ${theme.table.border}`,
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 1000,
              minWidth: '250px',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              <div style={{
                padding: '8px 12px',
                borderBottom: `1px solid ${theme.table.border}`,
                fontSize: '11px',
                color: theme.text.secondary,
                fontWeight: 600,
                textTransform: 'uppercase'
              }}>
                Scripts with matching tables
              </div>
              {matchingScripts.length === 0 ? (
                <div style={{
                  padding: '16px 12px',
                  color: theme.text.secondary,
                  fontSize: '12px',
                  textAlign: 'center'
                }}>
                  No scripts with matching table positions found
                </div>
              ) : (
                matchingScripts.map((script) => (
                  <div
                    key={script.scriptId}
                    onClick={() => {
                      const positions = copyPositionsFromScript(script.scriptId, tables);
                      if (Object.keys(positions).length > 0) {
                        // Merge with current positions (keep non-matching tables where they are)
                        const newPositions = { ...tablePositions, ...positions };
                        setTablePositions(newPositions);
                        savePositions(newPositions);
                        // Auto-select all matched tables so user can drag them as a group
                        setSelectedTables(new Set(Object.keys(positions)));
                      }
                      setShowCopyPositionsDropdown(false);
                    }}
                    style={{
                      padding: '10px 12px',
                      cursor: 'pointer',
                      borderBottom: `1px solid ${theme.table.border}`,
                      transition: 'background 0.1s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = theme.table.headerBackground}
                    onMouseLeave={(e) => e.currentTarget.style.background = theme.table.background}
                  >
                    <div style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: theme.text.primary,
                      marginBottom: '2px'
                    }}>
                      {script.scriptName}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: theme.text.secondary
                    }}>
                      {script.matchCount} matching table{script.matchCount > 1 ? 's' : ''}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {onRefresh && (
          <button className="btn btn-sm" onClick={onRefresh} title="Refresh Schema">
            <RefreshCw size={16} />
          </button>
        )}

        <button
          className="btn btn-sm"
          onClick={handleResetPositions}
          title={smartAutoLayout ? "Smart Auto Arrange (ELK.js)" : "Auto Arrange (Reset Positions)"}
          disabled={isComputingLayout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            opacity: isComputingLayout ? 0.7 : 1
          }}
        >
          {isComputingLayout ? (
            <>
              <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
              Computing...
            </>
          ) : (
            smartAutoLayout ? 'Smart Layout' : 'Reset Layout'
          )}
        </button>

        <button className="btn btn-sm" onClick={toggleFullscreen} title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
          <Maximize size={16} />
        </button>

        <button className="btn btn-sm btn-primary" onClick={handleExport} title="Export as HTML">
          <Download size={16} />
          Export
        </button>

        <span style={{ fontSize: '12px', color: theme.text.secondary }}>
          {tables.length} tables • {edges.length} relations
        </span>
      </div>

      {/* Canvas */}
      <Stage
        ref={stageRef}
        width={dimensions.width}
        height={dimensions.height}
        scaleX={scale}
        scaleY={scale}
        x={stagePosition.x}
        y={stagePosition.y}
        draggable={!isSelecting}
        onDragStart={handleStageDragStart}
        onDragEnd={handleStageDragEnd}
        onWheel={handleWheel}
        onClick={handleStageClick}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        onMouseLeave={handleStageMouseUp}
        style={{ cursor: isSelecting ? 'crosshair' : (isDraggingStage ? 'grabbing' : 'grab') }}
      >
        <Layer>
          {edges.map(edge => {
            const sourceNode = nodeMap.get(edge.sourceTable);
            const targetNode = nodeMap.get(edge.targetTable);
            if (!sourceNode || !targetNode) return null;
            return (
              <ERDEdgePath
                key={edge.id}
                edge={edge}
                sourceNode={sourceNode}
                targetNode={targetNode}
                theme={theme}
                hoveredTableId={hoveredTable}
              />
            );
          })}
          {nodes.map(node => (
            <ERDTableNode
              key={node.id}
              node={node}
              theme={theme}
              isHighlighted={highlightedTable === node.id}
              highlightedColumn={highlightedColumn}
              isSelected={selectedTables.has(node.id)}
              onDragStart={handleTableDragStart}
              onDragMove={handleTableDragMove}
              onDragEnd={handleTableDragEnd}
              onHoverChange={handleTableHoverChange}
              onClick={handleTableClick}
              stageRef={stageRef}
            />
          ))}

          {/* Selection rectangle (marquee) */}
          {isSelecting && selectionRect && (
            <Rect
              x={Math.min(selectionRect.startX, selectionRect.endX)}
              y={Math.min(selectionRect.startY, selectionRect.endY)}
              width={Math.abs(selectionRect.endX - selectionRect.startX)}
              height={Math.abs(selectionRect.endY - selectionRect.startY)}
              fill="rgba(59, 130, 246, 0.1)"
              stroke="#3b82f6"
              strokeWidth={1}
              dash={[4, 4]}
            />
          )}
        </Layer>
      </Stage>

      {/* Export Preview Modal */}
      <ERDExportPreview
        isOpen={showExportPreview}
        onClose={() => setShowExportPreview(false)}
        tables={tables}
        nodes={nodes}
        edges={edges}
        isDarkTheme={isDarkTheme}
        darkThemeVariant={darkThemeVariant}
        scriptName={scriptName}
      />
    </div>
  );
}
