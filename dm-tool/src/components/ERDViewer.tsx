import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Stage, Layer, Rect, Text, Line, Group, Path } from 'react-konva';
import Konva from 'konva';
import dagre from '@dagrejs/dagre';
import { Table } from '../types';
import { TABLE_COLORS, SIZING, FONTS, LIGHT_THEME, DARK_THEME, ThemeColors } from '../constants/erd';
import { ZoomIn, ZoomOut, Maximize2, Download, RotateCcw, Maximize, Search, X } from 'lucide-react';

interface ERDViewerProps {
  tables: Table[];
  isDarkTheme: boolean;
  scriptId: string;
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

// Get theme based on dark mode
const getTheme = (isDark: boolean): ThemeColors => isDark ? DARK_THEME : LIGHT_THEME;

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

export default function ERDViewer({ tables, isDarkTheme, scriptId }: ERDViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(0.8);
  const [stagePosition, setStagePosition] = useState({ x: 50, y: 50 });
  const [isDraggingStage, setIsDraggingStage] = useState(false);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Table positions stored separately from nodes to avoid re-layout
  const [tablePositions, setTablePositions] = useState<Record<string, { x: number; y: number }>>({});
  const [initialLayoutDone, setInitialLayoutDone] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [highlightedTable, setHighlightedTable] = useState<string | null>(null);
  const [highlightedColumn, setHighlightedColumn] = useState<{ table: string; column: string } | null>(null);

  const theme = getTheme(isDarkTheme);

  // Load saved positions on mount
  useEffect(() => {
    const saved = localStorage.getItem(getStorageKey(scriptId));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTablePositions(parsed);
        setInitialLayoutDone(true);
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

  // Keyboard shortcut for search (Cmd/Ctrl + F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowSearchDropdown(false);
        setSearchQuery('');
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        const originalIndex = tables.findIndex(t => t.tableName === table.tableName);
        g.setNode(table.tableName.toUpperCase(), { width, height, colorIndex: originalIndex % TABLE_COLORS.length });
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
        const originalIndex = tables.findIndex(t => t.tableName === table.tableName);

        const x = node ? node.x - width / 2 : SIZING.DIAGRAM_PADDING;
        const y = node ? node.y - height / 2 : SIZING.DIAGRAM_PADDING;

        layout[tableId] = {
          x,
          y,
          width,
          height,
          colorIndex: originalIndex % TABLE_COLORS.length
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
        const originalIndex = tables.findIndex(t => t.tableName === table.tableName);

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
          colorIndex: originalIndex % TABLE_COLORS.length
        };

        currentX += width + SIZING.TABLES_GAP_X;
        rowMaxHeight = Math.max(rowMaxHeight, height);
      });
    }

    return layout;
  }, [tables, edges]);

  // Set initial positions from layout if not already set
  useEffect(() => {
    if (!initialLayoutDone && Object.keys(initialLayout).length > 0) {
      const positions: Record<string, { x: number; y: number }> = {};
      for (const [id, layout] of Object.entries(initialLayout)) {
        positions[id] = { x: layout.x, y: layout.y };
      }
      setTablePositions(positions);
      setInitialLayoutDone(true);
    }
  }, [initialLayout, initialLayoutDone]);

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
        colorIndex: layout?.colorIndex ?? index % TABLE_COLORS.length
      };
    });
  }, [tables, initialLayout, tablePositions]);

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

  // Get column Y position for edge connections
  const getColumnY = useCallback((node: TableNode, colName: string): number => {
    const colIndex = node.table.columns.findIndex(
      c => c.name.toUpperCase() === colName.toUpperCase()
    );
    const baseY = node.y + SIZING.TABLE_COLOR_HEIGHT + SIZING.TABLE_HEADER_HEIGHT;
    if (colIndex === -1) return baseY + SIZING.COLUMN_HEIGHT / 2;
    return baseY + (colIndex * SIZING.COLUMN_HEIGHT) + SIZING.COLUMN_HEIGHT / 2;
  }, []);

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
    const newScale = direction > 0 ? oldScale * SIZING.STAGE_SCALE_BY : oldScale / SIZING.STAGE_SCALE_BY;
    const clampedScale = Math.min(Math.max(newScale, 0.1), 3);

    setScale(clampedScale);
    setStagePosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale
    });
  }, [scale, stagePosition]);

  // Zoom controls
  const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.1));

  const handleReset = () => {
    setScale(0.8);
    setStagePosition({ x: 50, y: 50 });
  };

  const handleResetPositions = () => {
    // Clear saved positions and re-layout
    localStorage.removeItem(getStorageKey(scriptId));
    setTablePositions({});
    setInitialLayoutDone(false);
    setScale(0.8);
    setStagePosition({ x: 50, y: 50 });
  };

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

  // Export as PNG
  const handleExport = () => {
    const stage = stageRef.current;
    if (!stage) return;

    const uri = stage.toDataURL({ pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = 'erd-diagram.png';
    link.href = uri;
    link.click();
  };

  // Stage drag handlers - only update position without affecting tables
  const handleStageDragStart = () => setIsDraggingStage(true);
  const handleStageDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setIsDraggingStage(false);
    setStagePosition({ x: e.target.x(), y: e.target.y() });
  };

  // Table drag handler - updates table position independently
  const handleTableDragMove = useCallback((tableId: string, newX: number, newY: number) => {
    setTablePositions(prev => ({
      ...prev,
      [tableId]: { x: newX, y: newY }
    }));
  }, []);

  const handleTableDragEnd = useCallback((tableId: string, newX: number, newY: number) => {
    const newPositions = {
      ...tablePositions,
      [tableId]: { x: newX, y: newY }
    };
    setTablePositions(newPositions);
    savePositions(newPositions);
  }, [tablePositions, savePositions]);

  // Render table node
  const renderTable = useCallback((node: TableNode) => {
    const { table, x, y, width, height, colorIndex } = node;
    const color = TABLE_COLORS[colorIndex];
    const isHovered = hoveredTable === node.id;
    const isHighlighted = highlightedTable === node.id;

    // Get PK and FK columns
    const pkCols = new Set<string>();
    const fkCols = new Set<string>();
    table.constraints.forEach(c => {
      const cols = c.localCols.split(',').map(s => s.trim().toUpperCase());
      if (c.type === 'Primary Key') cols.forEach(col => pkCols.add(col));
      if (c.type === 'Foreign Key') cols.forEach(col => fkCols.add(col));
    });

    return (
      <Group
        key={node.id}
        x={x}
        y={y}
        draggable
        onDragMove={(e) => {
          // Prevent stage from moving
          e.cancelBubble = true;
          handleTableDragMove(node.id, e.target.x(), e.target.y());
        }}
        onDragEnd={(e) => {
          e.cancelBubble = true;
          handleTableDragEnd(node.id, e.target.x(), e.target.y());
        }}
        onMouseEnter={() => {
          setHoveredTable(node.id);
          const stage = stageRef.current;
          if (stage) {
            stage.container().style.cursor = 'move';
          }
        }}
        onMouseLeave={() => {
          setHoveredTable(null);
          const stage = stageRef.current;
          if (stage) {
            stage.container().style.cursor = 'grab';
          }
        }}
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

        {/* Highlight border (for search) */}
        {isHighlighted && (
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
          stroke={isHovered || isHighlighted ? color.regular : theme.table.border}
          strokeWidth={isHovered || isHighlighted ? 2 : 1}
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

          return (
            <Group key={col.name} y={colY}>
              {/* Row highlight for search */}
              {isColHighlighted && (
                <Rect
                  x={1}
                  width={width - 2}
                  height={SIZING.COLUMN_HEIGHT}
                  fill={color.regular}
                  opacity={0.3}
                />
              )}

              {/* Row background for PK/FK */}
              {(isPk || isFk) && !isColHighlighted && (
                <Rect
                  x={1}
                  width={width - 2}
                  height={SIZING.COLUMN_HEIGHT}
                  fill={isPk ? color.lighter : '#f0f9ff'}
                  opacity={0.5}
                />
              )}

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
  }, [theme, hoveredTable, highlightedTable, highlightedColumn, handleTableDragMove, handleTableDragEnd]);

  // Render edge with smooth bezier curves (following db-schema-visualizer pattern)
  const renderEdge = useCallback((edge: Edge) => {
    const sourceNode = nodes.find(n => n.id === edge.sourceTable);
    const targetNode = nodes.find(n => n.id === edge.targetTable);
    if (!sourceNode || !targetNode) return null;

    const sourceY = getColumnY(sourceNode, edge.sourceColumn);
    const targetY = getColumnY(targetNode, edge.targetColumn);

    // Compute connection positions (left or right side)
    const [sourcePosition, targetPosition, sourceX, targetX] = computeConnectionHandlePos(
      sourceNode.x,
      sourceNode.width,
      targetNode.x,
      targetNode.width
    );

    const sourcePoint = { x: sourceX, y: sourceY };
    const targetPoint = { x: targetX, y: targetY };

    // Generate bezier path
    const pathData = getBezierPath(sourcePoint, targetPoint, sourcePosition, targetPosition);

    // Generate relation symbols (many-to-one: crow's foot at source, line at target)
    const sourceSymbol = getManySymbol(sourceX, sourceY, sourcePosition);
    const targetSymbol = getOneSymbol(targetX, targetY, targetPosition);

    const fullPath = `${pathData} ${sourceSymbol} ${targetSymbol}`;

    const isHovered = hoveredTable === edge.sourceTable || hoveredTable === edge.targetTable;
    const sourceColor = TABLE_COLORS[sourceNode.colorIndex];

    return (
      <Path
        key={edge.id}
        data={fullPath}
        stroke={isHovered ? sourceColor.regular : theme.connection.default}
        strokeWidth={isHovered ? 2.5 : SIZING.CONNECTION_STROKE_WIDTH}
        lineCap="round"
        lineJoin="round"
        opacity={isHovered ? 1 : 0.7}
      />
    );
  }, [nodes, getColumnY, theme, hoveredTable]);

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
        background: isDarkTheme ? 'rgba(31, 41, 55, 0.95)' : 'rgba(248, 250, 252, 0.95)',
        borderRadius: '8px',
        border: `1px solid ${isDarkTheme ? '#374151' : '#e5e7eb'}`,
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
                color: isDarkTheme ? '#6b7280' : '#9ca3af'
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
                border: `1px solid ${isDarkTheme ? '#374151' : '#e5e7eb'}`,
                borderRadius: '6px',
                fontSize: '12px',
                background: isDarkTheme ? '#374151' : '#fff',
                color: isDarkTheme ? '#f3f4f6' : '#1f2937',
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
                  color: isDarkTheme ? '#6b7280' : '#9ca3af'
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
              background: isDarkTheme ? '#1f2937' : '#fff',
              border: `1px solid ${isDarkTheme ? '#374151' : '#e5e7eb'}`,
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
                    borderBottom: i < searchResults.length - 1 ? `1px solid ${isDarkTheme ? '#374151' : '#e5e7eb'}` : 'none',
                    background: isDarkTheme ? '#1f2937' : '#fff',
                    transition: 'background 0.1s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = isDarkTheme ? '#374151' : '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.background = isDarkTheme ? '#1f2937' : '#fff'}
                >
                  <div style={{
                    fontSize: '12px',
                    fontWeight: result.type === 'table' ? 600 : 400,
                    color: isDarkTheme ? '#f3f4f6' : '#1f2937'
                  }}>
                    {result.type === 'table' ? result.tableName : `${result.tableName}.${result.columnName}`}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: isDarkTheme ? '#6b7280' : '#9ca3af',
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
          background: isDarkTheme ? '#374151' : '#e5e7eb',
          borderRadius: '4px',
          fontSize: '12px',
          fontWeight: 500,
          color: isDarkTheme ? '#f3f4f6' : '#374151'
        }}>
          {Math.round(scale * 100)}%
        </div>

        <div style={{ flex: 1 }} />

        <button className="btn btn-sm" onClick={handleResetPositions} title="Reset Table Positions">
          Reset Layout
        </button>

        <button className="btn btn-sm" onClick={toggleFullscreen} title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
          <Maximize size={16} />
        </button>

        <button className="btn btn-sm btn-primary" onClick={handleExport} title="Export PNG">
          <Download size={16} />
          Export
        </button>

        <span style={{ fontSize: '12px', color: isDarkTheme ? '#6b7280' : '#9ca3af' }}>
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
        draggable
        onDragStart={handleStageDragStart}
        onDragEnd={handleStageDragEnd}
        onWheel={handleWheel}
        style={{ cursor: isDraggingStage ? 'grabbing' : 'grab' }}
      >
        <Layer>
          {edges.map(edge => renderEdge(edge))}
          {nodes.map(node => renderTable(node))}
        </Layer>
      </Stage>
    </div>
  );
}
