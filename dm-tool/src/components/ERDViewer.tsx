import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Stage, Layer, Rect, Text, Line, Group } from 'react-konva';
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

// Storage key for table positions
const getStorageKey = (scriptId: string) => `erd_positions_${scriptId}`;

// Get theme based on dark mode
const getTheme = (isDark: boolean): ThemeColors => isDark ? DARK_THEME : LIGHT_THEME;

// Calculate table width based on content
const calculateTableWidth = (table: Table): number => {
  const maxColNameLength = Math.max(
    table.tableName.length,
    ...table.columns.map(c => c.name.length + c.type.length + 2)
  );
  const estimatedWidth = maxColNameLength * 8 + 40;
  return Math.min(Math.max(estimatedWidth, SIZING.TABLE_MIN_WIDTH), SIZING.TABLE_MAX_WIDTH);
};

// Calculate table height
const calculateTableHeight = (table: Table): number => {
  return SIZING.TABLE_COLOR_HEIGHT + SIZING.TABLE_HEADER_HEIGHT +
         (table.columns.length * SIZING.COLUMN_HEIGHT) + SIZING.PADDING * 2;
};

export default function ERDViewer({ tables, isDarkTheme, scriptId }: ERDViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(0.8);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Table positions (persisted)
  const [tablePositions, setTablePositions] = useState<Record<string, { x: number; y: number }>>({});

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
        setTablePositions(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved positions');
      }
    }
  }, [scriptId]);

  // Save positions when they change
  const savePositions = useCallback((positions: Record<string, { x: number; y: number }>) => {
    setTablePositions(positions);
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

  // Layout with Dagre (only for initial positions)
  const nodes = useMemo((): TableNode[] => {
    if (tables.length === 0) return [];

    const g = new dagre.graphlib.Graph();
    g.setGraph({
      rankdir: 'LR',
      nodesep: SIZING.TABLES_GAP_Y,
      ranksep: SIZING.TABLES_GAP_X,
      marginx: SIZING.DIAGRAM_PADDING,
      marginy: SIZING.DIAGRAM_PADDING
    });
    g.setDefaultEdgeLabel(() => ({}));

    // Add nodes
    tables.forEach((table, index) => {
      const width = calculateTableWidth(table);
      const height = calculateTableHeight(table);
      g.setNode(table.tableName.toUpperCase(), { width, height, table, colorIndex: index % TABLE_COLORS.length });
    });

    // Add edges
    edges.forEach(edge => {
      g.setEdge(edge.sourceTable, edge.targetTable);
    });

    // Run layout
    dagre.layout(g);

    // Extract positioned nodes (use saved positions if available)
    return tables.map((table, index) => {
      const node = g.node(table.tableName.toUpperCase());
      const width = calculateTableWidth(table);
      const height = calculateTableHeight(table);
      const tableId = table.tableName.toUpperCase();

      // Use saved position if available, otherwise use Dagre layout
      const savedPos = tablePositions[tableId];
      const x = savedPos ? savedPos.x : (node ? node.x - width / 2 : index * 300);
      const y = savedPos ? savedPos.y : (node ? node.y - height / 2 : index * 50);

      return {
        id: tableId,
        table,
        x,
        y,
        width,
        height,
        colorIndex: index % TABLE_COLORS.length
      };
    });
  }, [tables, edges, tablePositions]);

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

    // Sort: exact matches first, then tables before columns, then alphabetically
    results.sort((a, b) => {
      const aExact = (a.type === 'table' ? a.tableName : a.columnName)?.toLowerCase() === query;
      const bExact = (b.type === 'table' ? b.tableName : b.columnName)?.toLowerCase() === query;
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      if (a.type !== b.type) return a.type === 'table' ? -1 : 1;
      return a.tableName.localeCompare(b.tableName);
    });

    setSearchResults(results.slice(0, 10)); // Limit to 10 results
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
      setPosition({ x: centerX, y: centerY });
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
      x: (pointer.x - position.x) / oldScale,
      y: (pointer.y - position.y) / oldScale
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * SIZING.STAGE_SCALE_BY : oldScale / SIZING.STAGE_SCALE_BY;
    const clampedScale = Math.min(Math.max(newScale, 0.1), 3);

    setScale(clampedScale);
    setPosition({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale
    });
  }, [scale, position]);

  // Zoom controls
  const handleZoomIn = () => setScale(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setScale(prev => Math.max(prev / 1.2, 0.1));

  const handleReset = () => {
    setScale(0.8);
    setPosition({ x: 50, y: 50 });
  };

  const handleResetPositions = () => {
    savePositions({});
    setScale(0.8);
    setPosition({ x: 50, y: 50 });
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
    setPosition({
      x: (dimensions.width - contentWidth * newScale) / 2 - minX * newScale + SIZING.DIAGRAM_PADDING,
      y: (dimensions.height - contentHeight * newScale) / 2 - minY * newScale + SIZING.DIAGRAM_PADDING
    });
  }, [nodes, dimensions]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.parentElement?.requestFullscreen();
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

  // Stage drag handlers
  const handleDragStart = () => setIsDragging(true);
  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    setIsDragging(false);
    setPosition({ x: e.target.x(), y: e.target.y() });
  };

  // Table drag handler
  const handleTableDrag = useCallback((tableId: string, newX: number, newY: number) => {
    const newPositions = {
      ...tablePositions,
      [tableId]: { x: newX, y: newY }
    };
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
        onDragEnd={(e) => {
          handleTableDrag(node.id, e.target.x(), e.target.y());
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
  }, [theme, hoveredTable, highlightedTable, highlightedColumn, handleTableDrag]);

  // Render edge with smooth bezier curves
  const renderEdge = useCallback((edge: Edge) => {
    const sourceNode = nodes.find(n => n.id === edge.sourceTable);
    const targetNode = nodes.find(n => n.id === edge.targetTable);
    if (!sourceNode || !targetNode) return null;

    const sourceY = getColumnY(sourceNode, edge.sourceColumn);
    const targetY = getColumnY(targetNode, edge.targetColumn);

    const startX = sourceNode.x + sourceNode.width;
    const endX = targetNode.x;

    const offset = Math.min(Math.abs(endX - startX) / 2, 80);

    const isHovered = hoveredTable === edge.sourceTable || hoveredTable === edge.targetTable;
    const sourceColor = TABLE_COLORS[sourceNode.colorIndex];

    return (
      <Group key={edge.id}>
        <Line
          points={[startX, sourceY, startX + offset, sourceY, endX - offset, targetY, endX, targetY]}
          stroke={isHovered ? sourceColor.regular : theme.connection.default}
          strokeWidth={isHovered ? 2.5 : SIZING.CONNECTION_STROKE_WIDTH}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          opacity={isHovered ? 1 : 0.6}
        />

        <Line
          points={[endX - 8, targetY - 4, endX, targetY, endX - 8, targetY + 4]}
          stroke={isHovered ? sourceColor.regular : theme.connection.default}
          strokeWidth={isHovered ? 2.5 : SIZING.CONNECTION_STROKE_WIDTH}
          lineCap="round"
          lineJoin="round"
          opacity={isHovered ? 1 : 0.6}
        />

        <Rect
          x={startX - 4}
          y={sourceY - 4}
          width={8}
          height={8}
          fill={isHovered ? sourceColor.regular : theme.connection.default}
          cornerRadius={4}
          opacity={isHovered ? 1 : 0.6}
        />
      </Group>
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
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: isFullscreen ? theme.canvas.background : 'transparent'
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '12px',
        alignItems: 'center',
        padding: '8px 12px',
        background: isDarkTheme ? '#1f2937' : '#f8fafc',
        borderRadius: '8px',
        border: `1px solid ${isDarkTheme ? '#374151' : '#e5e7eb'}`,
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
      <div
        ref={containerRef}
        style={{
          flex: 1,
          background: theme.canvas.background,
          borderRadius: isFullscreen ? 0 : '8px',
          overflow: 'hidden',
          cursor: isDragging ? 'grabbing' : 'grab',
          border: isFullscreen ? 'none' : `1px solid ${theme.table.border}`
        }}
      >
        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onWheel={handleWheel}
        >
          <Layer>
            {edges.map(edge => renderEdge(edge))}
            {nodes.map(node => renderTable(node))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
