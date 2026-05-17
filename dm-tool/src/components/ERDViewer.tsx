import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { Stage, Layer, Rect, Text, Line, Group, Path } from 'react-konva';
import Konva from 'konva';
import dagre from '@dagrejs/dagre';
import { Table } from '../types';
import { TABLE_COLORS, SIZING, FONTS, LIGHT_THEME, getDarkTheme, ThemeColors, DarkThemeVariant } from '../constants/erd';
import { ZoomIn, ZoomOut, Maximize2, Download, RotateCcw, Maximize, Search, X, RefreshCw, Copy, MousePointer2 } from 'lucide-react';
import ERDExportPreview from './ERDExportPreview';
import { loadScripts } from '../utils/storage';
import { computeStructuredLayout } from '../utils/erdLayout';

// Auto-arrange ("Smart Layout") is now handled by computeStructuredLayout
// (utils/erdLayout.ts) — a deterministic pipeline of pair-merge → component
// detection → tidy LR tree (or Dagre fallback) → skyline pack. ELK and its
// black-box partitioning + the ad-hoc collision pass that lived here have
// been removed.

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

// Calculate table width based on content — ensures column name + type fit
// without wrapping. Char-width factors are kept at the same fontSize-px
// ratio as before so widths track text size automatically:
//   title:  10 px/char @ SIZE_TABLE_TITLE 20  (= 0.50 px per fontSize-px)
//   name:   9.7 px/char @ SIZE_SM 18          (≈ 0.54 — accounts for the
//                                              key-icon column on the left)
//   type:   9 px/char @ SIZE_SM-1 = 17        (≈ 0.53)
// Padding constants (38 / 28) bumped one step to keep the comfortable
// breathing room around text.
const calculateTableWidth = (table: Table): number => {
  const tableNameWidth = table.tableName.length * 10 + 38;

  const columnWidths = table.columns.map(col => {
    const nameWidth = col.name.length * 9.7 + 38;   // name + key-icon padding
    const typeWidth = col.type.length * 9 + 28;     // type column
    // Name occupies ~48 % of the table width, type ~38 % (rest is gaps).
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
  /**
   * Fired when the user clicks a column row inside the table (separate from
   * the table-level click). Used to anchor a small FK popup at the cursor.
   * Coordinates are viewport-relative (clientX/clientY) so the DOM overlay
   * can position itself with `position: fixed`.
   */
  onColumnClick: (tableId: string, columnName: string, clientX: number, clientY: number) => void;
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
  onColumnClick,
  stageRef
}: ERDTableNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);
  const mainRectRef = useRef<Konva.Rect>(null);

  const { table, x, y, width, height, colorIndex } = node;
  const color = TABLE_COLORS[colorIndex];

  // Search-highlight pulse. When `isHighlighted` flips to true (user picked
  // a search result and we routed to this table), do a single half-sine
  // pulse on strokeWidth — 2 → 5 → 2 over 800 ms — so the user can spot
  // where the camera landed. We drive it imperatively via Konva, NOT React
  // state, to avoid 60 setState/sec re-renders on a memoized component.
  // Steady-state border (after the pulse, while still highlighted) matches
  // the hover style: same color, strokeWidth 2 — the user requested this
  // explicitly so search-routed and hover look identical.
  useEffect(() => {
    if (!isHighlighted || !mainRectRef.current) return;
    const rect = mainRectRef.current;
    let raf = 0;
    const start = performance.now();
    const duration = 800;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const phase = Math.sin(t * Math.PI); // 0 → 1 → 0
      rect.strokeWidth(2 + phase * 3);
      rect.getLayer()?.batchDraw();
      if (t < 1) raf = requestAnimationFrame(tick);
      else rect.strokeWidth(2);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isHighlighted]);

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

      {/* Main container.
          Search-highlight uses the SAME visual as hover (colored border,
          strokeWidth 2) — no separate dashed ring — per UX request. The
          pulse animation above briefly oscillates strokeWidth on highlight
          so the routed-to table is easy to spot, then settles to the
          hover-equivalent border. Connected FK edges are unaffected because
          they only watch `hoveredTableId`, not `isHighlighted`. */}
      <Rect
        ref={mainRectRef}
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

      {/* Table name — vertically centered in the header band:
          y = (TABLE_HEADER_HEIGHT − SIZE_TABLE_TITLE) / 2 = (50 − 20) / 2 = 15 */}
      <Text
        text={table.tableName}
        x={SIZING.PADDING + 6}
        y={SIZING.TABLE_COLOR_HEIGHT + 15}
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

            {/* Invisible rect for hover + click detection.
                Click cancelBubble so it doesn't trigger the table-level
                onClick (drag still works because Konva fires click only when
                pointer didn't move between mousedown/up). */}
            <Rect
              x={0}
              width={width}
              height={SIZING.COLUMN_HEIGHT}
              fill="transparent"
              onMouseEnter={() => setHoveredColumn(col.name)}
              onMouseLeave={() => setHoveredColumn(null)}
              onClick={(ev) => {
                ev.cancelBubble = true;
                onColumnClick(node.id, col.name, ev.evt.clientX, ev.evt.clientY);
              }}
            />

            {/* Key indicator — fontSize 14 in row 42:
                y = (42 − 14) / 2 = 14. */}
            {(isPk || isFk) && (
              <Text
                text={isPk ? '🔑' : '🔗'}
                x={7}
                y={14}
                fontSize={14}
              />
            )}

            {/* Column name — vertically centered in COLUMN_HEIGHT 42 with
                fontSize 18: y = (42 − 18) / 2 = 12. Left X 26 to clear
                the wider key icon. */}
            <Text
              text={col.name}
              x={isPk || isFk ? 26 : SIZING.PADDING + 6}
              y={12}
              width={width * 0.5}
              fontSize={FONTS.SIZE_SM}
              fontFamily={FONTS.FAMILY}
              fontStyle={isPk || isColHighlighted ? 'bold' : 'normal'}
              fill={isPk ? color.regular : theme.text.primary}
              ellipsis={true}
            />

            {/* Column type — same Y offset as the name so they baseline up. */}
            <Text
              text={col.type}
              x={width * 0.55}
              y={12}
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
  /** Fires when the user clicks the FK line itself (not a connected table). */
  onEdgeClick?: (edge: Edge) => void;
}

const ERDEdgePath = memo(function ERDEdgePath({
  edge,
  sourceNode,
  targetNode,
  theme,
  hoveredTableId,
  onEdgeClick,
}: ERDEdgePathProps) {
  // Direct hover on the edge itself (independent of table hover). Local
  // state so only this edge re-renders on enter/leave — the parent's edge
  // list doesn't have to know about it.
  const [isDirectlyHovered, setIsDirectlyHovered] = useState(false);
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

  const isTableHovered =
    hoveredTableId === edge.sourceTable || hoveredTableId === edge.targetTable;
  const isHighlighted = isDirectlyHovered || isTableHovered;
  const sourceColor = TABLE_COLORS[sourceNode.colorIndex];

  return (
    <Path
      data={fullPath}
      stroke={isHighlighted ? sourceColor.regular : theme.connection.default}
      // Direct hover on the line is even thicker so it stands out among
      // many sibling edges; a hovered TABLE just bumps the line slightly.
      strokeWidth={
        isDirectlyHovered ? 3.5 : isTableHovered ? 2.5 : SIZING.CONNECTION_STROKE_WIDTH
      }
      lineCap="round"
      lineJoin="round"
      opacity={isHighlighted ? 1 : 0.7}
      // Generous hit area so a thin curve is still easy to grab without
      // visually fattening the line itself.
      hitStrokeWidth={14}
      onMouseEnter={(ev) => {
        setIsDirectlyHovered(true);
        const stage = ev.target.getStage();
        if (stage) stage.container().style.cursor = 'pointer';
      }}
      onMouseLeave={(ev) => {
        setIsDirectlyHovered(false);
        const stage = ev.target.getStage();
        if (stage) stage.container().style.cursor = 'grab';
      }}
      onClick={(ev) => {
        ev.cancelBubble = true;
        onEdgeClick?.(edge);
      }}
    />
  );
}, (prevProps, nextProps) => {
  // Custom comparison - only re-render when nodes move or hover changes.
  // onEdgeClick is expected to be a stable useCallback ref; if it's not,
  // memo will be over-conservative and re-render — annoying but not wrong.
  return (
    prevProps.edge.id === nextProps.edge.id &&
    prevProps.sourceNode.x === nextProps.sourceNode.x &&
    prevProps.sourceNode.y === nextProps.sourceNode.y &&
    prevProps.targetNode.x === nextProps.targetNode.x &&
    prevProps.targetNode.y === nextProps.targetNode.y &&
    prevProps.theme === nextProps.theme &&
    prevProps.hoveredTableId === nextProps.hoveredTableId &&
    prevProps.onEdgeClick === nextProps.onEdgeClick
  );
});

function ERDViewer({ tables, isDarkTheme, darkThemeVariant = 'slate', scriptId, scriptName = 'ERD', onRefresh }: ERDViewerProps) {
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

  // Save positions when they change.
  // Drag handlers fire ~60×/sec, so a sync localStorage write per call would
  // block the main thread and cause noticeable jitter. We coalesce: keep the
  // latest payload in a ref, and flush after 150 ms of inactivity OR on flush().
  const pendingPositionsRef = useRef<Record<string, { x: number; y: number }> | null>(null);
  const positionsFlushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flushPositions = useCallback(() => {
    if (positionsFlushTimerRef.current) {
      clearTimeout(positionsFlushTimerRef.current);
      positionsFlushTimerRef.current = null;
    }
    const pending = pendingPositionsRef.current;
    if (pending) {
      try {
        localStorage.setItem(getStorageKey(scriptId), JSON.stringify(pending));
      } catch (e) {
        console.error('Failed to persist ERD positions', e);
      }
      pendingPositionsRef.current = null;
    }
  }, [scriptId]);

  const savePositions = useCallback((positions: Record<string, { x: number; y: number }>) => {
    pendingPositionsRef.current = positions;
    if (positionsFlushTimerRef.current) clearTimeout(positionsFlushTimerRef.current);
    positionsFlushTimerRef.current = setTimeout(flushPositions, 150);
  }, [flushPositions]);

  // Flush on unmount and on script change so we never lose the last drag.
  useEffect(() => {
    return () => { flushPositions(); };
  }, [flushPositions]);
  useEffect(() => {
    const handler = () => flushPositions();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [flushPositions]);

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

  // Extract FK relationships. Structurally stable: when the underlying FK
  // structure is unchanged we return the previous array reference, even if
  // `tables` itself got a new ref (typical case: user edits a column comment,
  // which has nothing to do with edges). This stops the cascade into Dagre
  // layout and Konva re-render on every keystroke.
  const edgesRef = useRef<Edge[]>([]);
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

    // Reuse previous array ref if structurally identical.
    const prev = edgesRef.current;
    if (prev.length === result.length) {
      let same = true;
      for (let i = 0; i < result.length; i++) {
        const a = prev[i], b = result[i];
        if (a.id !== b.id ||
            a.sourceTable !== b.sourceTable ||
            a.sourceColumn !== b.sourceColumn ||
            a.targetTable !== b.targetTable ||
            a.targetColumn !== b.targetColumn) {
          same = false;
          break;
        }
      }
      if (same) return prev;
    }
    edgesRef.current = result;
    return result;
  }, [tables]);

  // Topology signature: changes only when something that actually affects
  // graph layout changes (table set, column counts, FK structure). A column
  // comment / type-text edit leaves this string identical, so the expensive
  // Dagre layout below skips rerun on those edits.
  const layoutTopologyKey = useMemo(() => {
    const tablesSig = tables
      .map(t => `${t.tableName.toUpperCase()}:${t.columns.length}`)
      .join('|');
    const edgesSig = edges.map(e => e.id).join('|');
    return `${tablesSig}#${edgesSig}`;
  }, [tables, edges]);

  // (The local `getTableGroups` helper that used to live here has moved
  //  into utils/erdLayout.ts → buildUnits, where pair-merging is the very
  //  first stage of the layout pipeline.)

  // Compute structured "smart" layout. Delegates to the standalone algorithm
  // in utils/erdLayout.ts:
  //   1. pair-merge master+_T into super-nodes
  //   2. cluster tables by schema → name-prefix → "Other" (spatial chunking
  //      only; no rendered borders or labels)
  //   3. per cluster, per FK-connected component:
  //        layered TB — master at top, dependents flow downward, every
  //        depth-N table on the same Y row, ranks wider than maxRankSize
  //        wrap into a sub-row directly below at the same logical depth.
  //        Cyclic components fall back to Dagre TB with edges reversed so
  //        master still ends up at the top.
  //   4. shelf-pack components within each cluster, then shelf-pack
  //      clusters at the top level — clusterGap > componentGap so chunks
  //      read as visually distinct without needing borders.
  // Async signature is preserved so existing call sites (which `await` it)
  // keep working; the body is fully synchronous now.
  const computeSmartLayout = useCallback(async (): Promise<Record<string, { x: number; y: number }>> => {
    if (tables.length === 0) return {};
    const positions = computeStructuredLayout(tables, edges, {
      measure: (t) => ({ width: calculateTableWidth(t), height: calculateTableHeight(t) }),
      // Vertical gap between depth levels (parent → child) — +50 % of the
      // base inter-row spacing so layers read as distinct rows.
      rankGap: Math.round(SIZING.TABLES_GAP_Y * 1.5),
      // Horizontal gap between siblings stacked within a rank.
      siblingGap: SIZING.TABLES_GAP_X,
      pairGap: 30,            // master ↔ _T side-by-side gap
      componentGap: SIZING.TABLES_GAP_X, // between disconnected components in same cluster
      padding: SIZING.DIAGRAM_PADDING,
      // If a rank has more than this many tables, wrap into a sub-row
      // directly below at the same logical depth (subRankGap-spaced).
      maxRankSize: 10,
    });
    return positions;
    // Topology-key memoization unchanged — function identity only refreshes
    // when graph structure changes, not on column-comment edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutTopologyKey]);

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
    // Keyed on the topology signature (table set + column counts + FK ids).
    // The function body still closes over the latest `tables` / `edges` —
    // that's intentional, since when topology *does* change we want fresh
    // data — but the memo only re-runs when the signature changes, not on
    // every edit that produces a new tables array reference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutTopologyKey, groupTemporalColors]);

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

  // (Cluster rendering was previously here — drawn dashed swim-lane boxes
  //  with schema/prefix labels. Removed per UX request: clustering still
  //  happens spatially in the layout pipeline so chunks of related tables
  //  group together, but we no longer draw any border or label around them.
  //  The visual signal is just the larger gap between groups.)

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

  // Center the camera on a table and pulse-highlight it. Shared between the
  // search-result picker, edge-click navigation, and FK-popup row clicks so
  // every "jump to that table" action behaves identically.
  const routeToTable = useCallback((tableId: string, columnName?: string) => {
    setHighlightedTable(tableId);
    setHighlightedColumn(columnName ? { table: tableId, column: columnName } : null);

    const node = nodes.find(n => n.id === tableId);
    if (node) {
      const centerX = dimensions.width / 2 - (node.x + node.width / 2) * scale;
      const centerY = dimensions.height / 2 - (node.y + node.height / 2) * scale;
      setStagePosition({ x: centerX, y: centerY });
    }

    // Clear highlight after 3 seconds (matches search behaviour).
    setTimeout(() => {
      setHighlightedTable(null);
      setHighlightedColumn(null);
    }, 3000);
  }, [nodes, dimensions.width, dimensions.height, scale]);

  // Handle search result selection
  const handleSelectResult = (result: SearchResult) => {
    routeToTable(
      result.tableId,
      result.type === 'column' ? result.columnName : undefined
    );
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  // Click an FK line → navigate to the parent (target/PK side). Convention:
  // clicking an FK arrow takes you to "what it points to," matching most
  // ERD tools (DBeaver, DataGrip).
  const handleEdgeClick = useCallback((edge: Edge) => {
    routeToTable(edge.targetTable, edge.targetColumn);
  }, [routeToTable]);

  // Click a column row → open a small DOM popup at the cursor listing the
  // FK relationships involving this column. Coordinates are viewport-relative
  // (clientX/clientY captured in the Konva handler) so the overlay can use
  // `position: fixed` and stay put even if the canvas scrolls.
  const [columnPopup, setColumnPopup] = useState<
    { tableId: string; columnName: string; clientX: number; clientY: number } | null
  >(null);

  const handleColumnClick = useCallback(
    (tableId: string, columnName: string, clientX: number, clientY: number) => {
      setColumnPopup({ tableId, columnName, clientX, clientY });
    },
    []
  );

  // Dismiss popup on outside click. Defer attaching the listener by one
  // microtask so the same click that opened the popup doesn't close it.
  useEffect(() => {
    if (!columnPopup) return;
    let attached = false;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('.erd-column-popup')) return;
      setColumnPopup(null);
    };
    const id = window.setTimeout(() => {
      document.addEventListener('mousedown', onDocClick);
      attached = true;
    }, 0);
    return () => {
      window.clearTimeout(id);
      if (attached) document.removeEventListener('mousedown', onDocClick);
    };
  }, [columnPopup]);

  // FKs incident to the popup's column — split by direction so the UI can
  // label them "Referenced by" vs "References".
  const popupFKs = useMemo(() => {
    if (!columnPopup) return null;
    const upper = columnPopup.columnName.toUpperCase();
    const incoming = edges.filter(e =>
      e.targetTable === columnPopup.tableId && e.targetColumn.toUpperCase() === upper
    );
    const outgoing = edges.filter(e =>
      e.sourceTable === columnPopup.tableId && e.sourceColumn.toUpperCase() === upper
    );
    return { incoming, outgoing };
  }, [columnPopup, edges]);

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
                onEdgeClick={handleEdgeClick}
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
              onColumnClick={handleColumnClick}
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

      {/* FK reference popup — opens at the cursor when a column is clicked.
          Pulls all colors from the same `theme` object the table cards and
          edges use, so the popup blends with both Slate and VS-Code-Gray
          dark variants automatically. Each row's left bar is the OTHER
          end's table color (incoming → child color, outgoing → target). */}
      {columnPopup && popupFKs &&
       (popupFKs.incoming.length > 0 || popupFKs.outgoing.length > 0) && (
        <div
          className="erd-column-popup"
          style={{
            position: 'fixed',
            left: columnPopup.clientX + 8,
            top: columnPopup.clientY + 8,
            zIndex: 1000,
            minWidth: '220px',
            maxWidth: '320px',
            maxHeight: '60vh',
            overflowY: 'auto',
            background: theme.table.background,
            color: theme.text.primary,
            border: `1px solid ${theme.table.border}`,
            borderRadius: '8px',
            boxShadow: `0 10px 25px ${theme.table.shadow}`,
            fontSize: '12px',
            fontFamily: FONTS.FAMILY,
            padding: '6px',
          }}
        >
          <div
            style={{
              padding: '4px 8px 6px',
              borderBottom: `1px solid ${theme.table.border}`,
              marginBottom: '4px',
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: '11px',
                color: theme.text.secondary,
              }}
            >
              {columnPopup.tableId}
            </div>
            <div style={{ fontWeight: 700, fontSize: '13px' }}>
              {columnPopup.columnName}
            </div>
          </div>

          {popupFKs.incoming.length > 0 && (
            <div style={{ marginBottom: popupFKs.outgoing.length > 0 ? '6px' : 0 }}>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: theme.text.secondary,
                  padding: '4px 8px',
                }}
              >
                Referenced by ({popupFKs.incoming.length})
              </div>
              {popupFKs.incoming.map(e => {
                const otherNode = nodeMap.get(e.sourceTable);
                const color = otherNode
                  ? TABLE_COLORS[otherNode.colorIndex].regular
                  : theme.connection.default;
                return (
                  <button
                    key={e.id}
                    onClick={() => {
                      routeToTable(e.sourceTable, e.sourceColumn);
                      setColumnPopup(null);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      background: 'transparent',
                      border: 'none',
                      borderLeft: `3px solid ${color}`,
                      padding: '6px 8px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      color: 'inherit',
                      fontFamily: 'inherit',
                      fontSize: '12px',
                    }}
                    onMouseEnter={(ev) => {
                      ev.currentTarget.style.background = theme.table.headerBackground;
                    }}
                    onMouseLeave={(ev) => {
                      ev.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{e.sourceTable}</div>
                    <div style={{ color: theme.text.secondary, fontSize: '11px' }}>
                      .{e.sourceColumn}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {popupFKs.outgoing.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: theme.text.secondary,
                  padding: '4px 8px',
                }}
              >
                References ({popupFKs.outgoing.length}) →
              </div>
              {popupFKs.outgoing.map(e => {
                const otherNode = nodeMap.get(e.targetTable);
                const color = otherNode
                  ? TABLE_COLORS[otherNode.colorIndex].regular
                  : theme.connection.default;
                return (
                  <button
                    key={e.id}
                    onClick={() => {
                      routeToTable(e.targetTable, e.targetColumn);
                      setColumnPopup(null);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      background: 'transparent',
                      border: 'none',
                      borderLeft: `3px solid ${color}`,
                      padding: '6px 8px',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      color: 'inherit',
                      fontFamily: 'inherit',
                      fontSize: '12px',
                    }}
                    onMouseEnter={(ev) => {
                      ev.currentTarget.style.background = theme.table.headerBackground;
                    }}
                    onMouseLeave={(ev) => {
                      ev.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{e.targetTable}</div>
                    <div style={{ color: theme.text.secondary, fontSize: '11px' }}>
                      .{e.targetColumn}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Memo'd default export. Prevents full re-mount of the Konva stage on every
// theme toggle / sidebar resize / dropdown open. Relies on App.tsx passing
// useCallback'd `onRefresh` so prop refs are stable across unrelated renders.
export default memo(ERDViewer);
