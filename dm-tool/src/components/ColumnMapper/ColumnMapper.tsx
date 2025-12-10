import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Stage, Layer, Rect, Text, Line, Group, Path } from 'react-konva';
import Konva from 'konva';
import {
  Script,
  Table,
  MappingProject,
  ColumnMapping,
} from '../../types';
import {
  generateId,
  saveMappingProject,
  loadMappingProjects,
  loadMappingWorkspaceState,
  saveMappingWorkspaceState,
} from '../../utils/storage';
import {
  createManualMapping,
} from '../../utils/mapping';
import {
  getRuleSetsForDatabases,
} from '../../constants/typeMatrix';
import { TABLE_COLORS, SIZING, FONTS, LIGHT_THEME, DARK_THEME } from '../../constants/erd';
import {
  Trash2,
  ChevronDown,
  Database,
  ArrowRightLeft,
  Check,
  X,
  List,
  Grid3X3,
  MousePointer,
} from 'lucide-react';

// Export mapping state interface for Sidebar integration
export interface MappingStateForSidebar {
  project: MappingProject | null;
  sourceScript: Script | null;
  targetScript: Script | null;
  selectedMappingId: string | null;
  expandedTables: Set<string>;
  searchTerm: string;
  // Callbacks for sidebar to call back into ColumnMapper
  handleSelectMapping: (id: string | null) => void;
  handleToggleTable: (tableName: string) => void;
}

interface ColumnMapperProps {
  scripts: Script[];
  isDarkTheme: boolean;
  onMappingStateChange?: (state: MappingStateForSidebar) => void;
}

interface TableNode {
  id: string;
  table: Table;
  side: 'source' | 'target';
  x: number;
  y: number;
  width: number;
  height: number;
  colorIndex: number;
}

// Pending state for click-to-map
interface PendingMapping {
  side: 'source' | 'target';
  tableName: string;
  columnName: string;
}

// Lighter colors for mapping lines (using table colors)
const LINE_COLORS = TABLE_COLORS.map(c => c.regular);

// Tab for canvas view
type CanvasTab = 'canvas' | 'linkage';

// Get theme based on dark mode
const getTheme = (isDark: boolean) => isDark ? DARK_THEME : LIGHT_THEME;

// Calculate table width based on content
const calculateTableWidth = (table: Table): number => {
  const tableNameWidth = table.tableName.length * 8 + 30;
  const columnWidths = table.columns.map(col => {
    const nameWidth = col.name.length * 7.5 + 30;
    const typeWidth = col.type.length * 7 + 20;
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

// Bezier path for mapping connections
function getBezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const controlOffset = Math.min(Math.abs(x2 - x1) * 0.4, 120);
  return `M${x1},${y1} C${x1 + controlOffset},${y1} ${x2 - controlOffset},${y2} ${x2},${y2}`;
}

// Get a consistent color index for a mapping based on its properties
function getMappingColorIndex(mapping: ColumnMapping): number {
  // Use a hash of the mapping id to get consistent color
  let hash = 0;
  for (let i = 0; i < mapping.id.length; i++) {
    hash = ((hash << 5) - hash) + mapping.id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % LINE_COLORS.length;
}

export default function ColumnMapper({
  scripts,
  isDarkTheme,
  onMappingStateChange,
}: ColumnMapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  // Tab for canvas view (canvas vs linkage table)
  const [activeTab, setActiveTab] = useState<CanvasTab>('canvas');

  // Load cached workspace state
  const cachedState = useMemo(() => loadMappingWorkspaceState(), []);

  // Script and table selection - now single selection (initialize from cache)
  const [sourceScriptId, setSourceScriptId] = useState<string | null>(cachedState?.sourceScriptId || null);
  const [targetScriptId, setTargetScriptId] = useState<string | null>(cachedState?.targetScriptId || null);
  const [sourceTableName, setSourceTableName] = useState<string | null>(cachedState?.selectedSourceTables?.[0] || null);
  const [targetTableName, setTargetTableName] = useState<string | null>(cachedState?.selectedTargetTables?.[0] || null);

  // Dropdown states
  const [sourceScriptDropdownOpen, setSourceScriptDropdownOpen] = useState(false);
  const [targetScriptDropdownOpen, setTargetScriptDropdownOpen] = useState(false);
  const [sourceTableDropdownOpen, setSourceTableDropdownOpen] = useState(false);
  const [targetTableDropdownOpen, setTargetTableDropdownOpen] = useState(false);

  // Project state
  const [project, setProject] = useState<MappingProject | null>(null);

  // Canvas state - start with 0 to avoid initial flash
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Pending mapping state for click-to-map
  const [pendingMapping, setPendingMapping] = useState<PendingMapping | null>(null);

  // Selection state
  const [selectedMappingId, setSelectedMappingId] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<{ table: string; column: string; side: 'source' | 'target' } | null>(null);

  // Drag state for drag-to-map
  const [dragState, setDragState] = useState({
    isDragging: false,
    startNodeId: null as string | null,
    startColumn: null as string | null,
    startType: null as 'source' | 'target' | null,
    currentX: 0,
    currentY: 0,
  });

  // Editing remarks
  const [editingRemarkId, setEditingRemarkId] = useState<string | null>(null);
  const [editingRemarkValue, setEditingRemarkValue] = useState('');

  // Sidebar state - manage expandedTables here and sync to parent
  const [searchTerm] = useState('');
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  const theme = getTheme(isDarkTheme);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.mapper-dropdown')) {
        setSourceScriptDropdownOpen(false);
        setTargetScriptDropdownOpen(false);
        setSourceTableDropdownOpen(false);
        setTargetTableDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Get scripts
  const sourceScript = useMemo(() =>
    scripts.find(s => s.id === sourceScriptId) || null
  , [scripts, sourceScriptId]);

  const targetScript = useMemo(() =>
    scripts.find(s => s.id === targetScriptId) || null
  , [scripts, targetScriptId]);

  // Get selected tables
  const sourceTable = useMemo(() =>
    sourceScript?.data.targets.find(t => t.tableName === sourceTableName) || null
  , [sourceScript, sourceTableName]);

  const targetTable = useMemo(() =>
    targetScript?.data.targets.find(t => t.tableName === targetTableName) || null
  , [targetScript, targetTableName]);

  // Update dimensions on resize - more robust handling
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const width = Math.floor(rect.width || containerRef.current.offsetWidth || containerRef.current.clientWidth);
        const height = Math.floor(rect.height || containerRef.current.offsetHeight || containerRef.current.clientHeight);

        // Only update if we have valid dimensions and they've changed
        if (width > 0 && height > 0) {
          setDimensions(prev => {
            if (prev.width !== width || prev.height !== height) {
              return { width, height };
            }
            return prev;
          });
        }
      }
    };

    // Initial update with multiple attempts for timing issues
    updateDimensions();
    const timeoutIds = [
      setTimeout(updateDimensions, 50),
      setTimeout(updateDimensions, 150),
      setTimeout(updateDimensions, 300),
    ];

    const resizeObserver = new ResizeObserver(() => {
      // Use requestAnimationFrame for smoother updates
      requestAnimationFrame(updateDimensions);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateDimensions);

    return () => {
      timeoutIds.forEach(id => clearTimeout(id));
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [activeTab, sourceTable, targetTable]);

  // Load or create project when scripts change
  useEffect(() => {
    if (!sourceScriptId || !targetScriptId) {
      setProject(null);
      return;
    }

    const projects = loadMappingProjects();
    const existing = projects.find(
      p => p.sourceScriptId === sourceScriptId && p.targetScriptId === targetScriptId
    );

    if (existing) {
      setProject(existing);
    } else {
      setProject({
        id: generateId(),
        name: `${sourceScript?.name || 'Source'} → ${targetScript?.name || 'Target'}`,
        sourceScriptId,
        targetScriptId,
        mappings: [],
        tableMappings: [],
        typeRules: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  }, [sourceScriptId, targetScriptId, sourceScript?.name, targetScript?.name]);

  // Handlers for sidebar actions - ColumnMapper owns all state
  const handleSidebarSelectMapping = useCallback((id: string | null) => {
    setSelectedMappingId(id);
  }, []);

  const handleSidebarToggleTable = useCallback((tableName: string) => {
    setExpandedTables(prev => {
      const next = new Set(prev);
      if (next.has(tableName)) {
        next.delete(tableName);
      } else {
        next.add(tableName);
      }
      return next;
    });
  }, []);

  // Notify parent of state changes for sidebar integration
  useEffect(() => {
    if (onMappingStateChange && sourceTable && targetTable) {
      onMappingStateChange({
        project,
        sourceScript,
        targetScript,
        selectedMappingId,
        expandedTables,
        searchTerm,
        handleSelectMapping: handleSidebarSelectMapping,
        handleToggleTable: handleSidebarToggleTable,
      });
    }
  }, [onMappingStateChange, project, sourceScript, targetScript, selectedMappingId, expandedTables, searchTerm, sourceTable, targetTable, handleSidebarSelectMapping, handleSidebarToggleTable]);

  // Save workspace state when selections change
  useEffect(() => {
    saveMappingWorkspaceState({
      currentView: 'mapping-canvas',
      sourceScriptId,
      targetScriptId,
      selectedSourceTables: sourceTableName ? [sourceTableName] : [],
      selectedTargetTables: targetTableName ? [targetTableName] : [],
      tablePositions: {},
      scale: 1,
      stagePosition: { x: 0, y: 0 },
    });
  }, [sourceScriptId, targetScriptId, sourceTableName, targetTableName]);

  // Calculate table nodes for the canvas (1 source, 1 target)
  const { sourceNode, targetNode, canvasSize } = useMemo(() => {
    if (!sourceTable || !targetTable) {
      return { sourceNode: null, targetNode: null, canvasSize: { width: 0, height: 0 } };
    }

    const sourceWidth = calculateTableWidth(sourceTable);
    const sourceHeight = calculateTableHeight(sourceTable);
    const targetWidth = calculateTableWidth(targetTable);
    const targetHeight = calculateTableHeight(targetTable);

    // Fixed margins and gap
    const margin = 60;
    const gap = 200; // Gap between tables
    const totalWidth = sourceWidth + gap + targetWidth;
    const maxHeight = Math.max(sourceHeight, targetHeight);

    // Required canvas size (content + margins on both sides)
    const requiredWidth = totalWidth + margin * 2;
    const requiredHeight = maxHeight + margin * 2;

    // Use the larger of viewport or required size
    const canvasWidth = Math.max(dimensions.width, requiredWidth);
    const canvasHeight = Math.max(dimensions.height, requiredHeight);

    // Center horizontally within the canvas
    const startX = Math.max(margin, (canvasWidth - totalWidth) / 2);
    // Center vertically within the canvas
    const startY = Math.max(margin, (canvasHeight - maxHeight) / 2);

    const srcNode: TableNode = {
      id: `source-${sourceTable.tableName}`,
      table: sourceTable,
      side: 'source',
      x: startX,
      y: startY,
      width: sourceWidth,
      height: sourceHeight,
      colorIndex: 0,
    };

    const tgtNode: TableNode = {
      id: `target-${targetTable.tableName}`,
      table: targetTable,
      side: 'target',
      x: startX + sourceWidth + gap,
      y: startY,
      width: targetWidth,
      height: targetHeight,
      colorIndex: 5,
    };

    return {
      sourceNode: srcNode,
      targetNode: tgtNode,
      canvasSize: { width: canvasWidth, height: canvasHeight }
    };
  }, [sourceTable, targetTable, dimensions]);

  // Get column Y position for a table node
  const getColumnY = useCallback((node: TableNode, colName: string): number => {
    const colIndex = node.table.columns.findIndex(
      c => c.name.toUpperCase() === colName.toUpperCase()
    );
    const baseY = node.y + SIZING.TABLE_COLOR_HEIGHT + SIZING.TABLE_HEADER_HEIGHT;
    if (colIndex === -1) return baseY + SIZING.COLUMN_HEIGHT / 2;
    return baseY + (colIndex * SIZING.COLUMN_HEIGHT) + SIZING.COLUMN_HEIGHT / 2;
  }, []);

  // Filter mappings for current tables
  const currentMappings = useMemo(() => {
    if (!project || !sourceTableName || !targetTableName) return [];
    return project.mappings.filter(
      m => m.sourceTable === sourceTableName && m.targetTable === targetTableName
    );
  }, [project, sourceTableName, targetTableName]);

  // Handle mapping creation (from click-to-map or drag)
  const createMapping = useCallback((
    srcTableName: string,
    srcColumnName: string,
    tgtTableName: string,
    tgtColumnName: string
  ) => {
    if (!project || !sourceScript || !targetScript) return;

    const srcTable = sourceScript.data.targets.find(t => t.tableName === srcTableName);
    const tgtTable = targetScript.data.targets.find(t => t.tableName === tgtTableName);
    if (!srcTable || !tgtTable) return;

    const srcColumn = srcTable.columns.find(c => c.name === srcColumnName);
    const tgtColumn = tgtTable.columns.find(c => c.name === tgtColumnName);
    if (!srcColumn || !tgtColumn) return;

    // Check for existing mapping
    const existingMapping = project.mappings.find(
      m => m.sourceTable === srcTableName &&
           m.sourceColumn === srcColumnName &&
           m.targetTable === tgtTableName &&
           m.targetColumn === tgtColumnName
    );
    if (existingMapping) return;

    const ruleSets = getRuleSetsForDatabases(sourceScript.type, targetScript.type);
    const newMapping = createManualMapping(
      srcColumn,
      tgtColumn,
      srcTable,
      tgtTable,
      sourceScriptId!,
      targetScriptId!,
      ruleSets
    );

    const updatedProject = {
      ...project,
      mappings: [...project.mappings, newMapping],
      updatedAt: Date.now(),
    };

    setProject(updatedProject);
    saveMappingProject(updatedProject);
    setSelectedMappingId(newMapping.id);
  }, [project, sourceScript, targetScript, sourceScriptId, targetScriptId]);

  // Handle column click (for click-to-map)
  const handleColumnClick = useCallback((
    side: 'source' | 'target',
    tableName: string,
    columnName: string
  ) => {
    // If same column clicked again, cancel pending
    if (pendingMapping &&
        pendingMapping.side === side &&
        pendingMapping.tableName === tableName &&
        pendingMapping.columnName === columnName) {
      setPendingMapping(null);
      return;
    }

    // If we have a pending mapping from the other side, complete the mapping
    if (pendingMapping && pendingMapping.side !== side) {
      if (pendingMapping.side === 'source') {
        createMapping(pendingMapping.tableName, pendingMapping.columnName, tableName, columnName);
      } else {
        createMapping(tableName, columnName, pendingMapping.tableName, pendingMapping.columnName);
      }
      setPendingMapping(null);
      return;
    }

    // Start a new pending mapping
    setPendingMapping({ side, tableName, columnName });
  }, [pendingMapping, createMapping]);

  // Drag handlers for creating mappings
  const handleDragStart = useCallback((
    side: 'source' | 'target',
    tableName: string,
    columnName: string,
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    e.cancelBubble = true;
    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    setPendingMapping(null); // Clear any pending click-to-map

    setDragState({
      isDragging: true,
      startNodeId: tableName,
      startColumn: columnName,
      startType: side,
      currentX: pos.x,
      currentY: pos.y,
    });
  }, []);

  const handleDragMove = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!dragState.isDragging) return;

    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    setDragState(prev => ({
      ...prev,
      currentX: pos.x,
      currentY: pos.y,
    }));
  }, [dragState.isDragging]);

  const handleDragEnd = useCallback((
    targetSide: 'source' | 'target',
    targetTableName: string,
    targetColumn: string
  ) => {
    if (!dragState.isDragging) return;

    // Only allow cross-side connections
    if (dragState.startType === targetSide) {
      setDragState({
        isDragging: false,
        startNodeId: null,
        startColumn: null,
        startType: null,
        currentX: 0,
        currentY: 0,
      });
      return;
    }

    // Determine source and target
    const isSourceToTarget = dragState.startType === 'source';
    const srcTableName = isSourceToTarget ? dragState.startNodeId! : targetTableName;
    const srcColumnName = isSourceToTarget ? dragState.startColumn! : targetColumn;
    const tgtTableName = isSourceToTarget ? targetTableName : dragState.startNodeId!;
    const tgtColumnName = isSourceToTarget ? targetColumn : dragState.startColumn!;

    createMapping(srcTableName, srcColumnName, tgtTableName, tgtColumnName);

    setDragState({
      isDragging: false,
      startNodeId: null,
      startColumn: null,
      startType: null,
      currentX: 0,
      currentY: 0,
    });
  }, [dragState, createMapping]);

  const cancelDrag = useCallback(() => {
    if (dragState.isDragging) {
      setDragState({
        isDragging: false,
        startNodeId: null,
        startColumn: null,
        startType: null,
        currentX: 0,
        currentY: 0,
      });
    }
  }, [dragState.isDragging]);

  // Handle click on empty canvas area to cancel pending mapping
  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    // Only cancel if clicking directly on stage (not on table elements)
    // Check if the click target is the stage itself or the background
    const clickedOnStage = e.target === e.target.getStage();
    if (clickedOnStage && pendingMapping) {
      setPendingMapping(null);
    }
  }, [pendingMapping]);

  // Handle mapping deletion
  const handleDeleteMapping = useCallback((mappingId: string) => {
    if (!project) return;

    const updatedProject = {
      ...project,
      mappings: project.mappings.filter(m => m.id !== mappingId),
      updatedAt: Date.now(),
    };

    setProject(updatedProject);
    saveMappingProject(updatedProject);

    if (selectedMappingId === mappingId) {
      setSelectedMappingId(null);
    }
  }, [project, selectedMappingId]);

  // Update mapping remarks
  const handleUpdateRemarks = useCallback((mappingId: string, remarks: string) => {
    if (!project) return;

    const updatedProject = {
      ...project,
      mappings: project.mappings.map(m =>
        m.id === mappingId ? { ...m, remarks, updatedAt: Date.now() } : m
      ),
      updatedAt: Date.now(),
    };

    setProject(updatedProject);
    saveMappingProject(updatedProject);
    setEditingRemarkId(null);
    setEditingRemarkValue('');
  }, [project]);

  // Render table node
  const renderTable = useCallback((node: TableNode) => {
    const { table, x, y, width, side, colorIndex } = node;
    const color = TABLE_COLORS[colorIndex];
    const isDropTarget = dragState.isDragging && dragState.startType !== side;

    // Get mapped columns with their colors
    const mappedColsWithColors = new Map<string, { colorIndex: number; color: typeof TABLE_COLORS[0] }>();
    currentMappings
      .filter(m => side === 'source'
        ? m.sourceTable === table.tableName
        : m.targetTable === table.tableName
      )
      .forEach(m => {
        const colName = side === 'source' ? m.sourceColumn : m.targetColumn;
        const mappingColorIndex = getMappingColorIndex(m);
        mappedColsWithColors.set(colName, {
          colorIndex: mappingColorIndex,
          color: TABLE_COLORS[mappingColorIndex]
        });
      });

    // Get pending column
    const isPendingTable = pendingMapping?.tableName === table.tableName && pendingMapping?.side === side;

    return (
      <Group key={node.id} x={x} y={y}>
        {/* Shadow */}
        <Rect
          width={width}
          height={node.height}
          fill={theme.table.shadow}
          cornerRadius={6}
          offsetX={-3}
          offsetY={-3}
        />

        {/* Main container */}
        <Rect
          width={width}
          height={node.height}
          fill={theme.table.background}
          stroke={theme.table.border}
          strokeWidth={1}
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
          width={width - SIZING.PADDING * 2 - 50}
          fontSize={FONTS.SIZE_TABLE_TITLE}
          fontFamily={FONTS.FAMILY}
          fontStyle="bold"
          fill={theme.text.primary}
          ellipsis
        />

        {/* Oval badge for SRC/TGT */}
        <Rect
          x={width - 42}
          y={SIZING.TABLE_COLOR_HEIGHT + 8}
          width={34}
          height={20}
          fill={side === 'source' ? '#3b82f6' : '#22c55e'}
          cornerRadius={10}
        />
        <Text
          text={side === 'source' ? 'SRC' : 'TGT'}
          x={width - 42}
          y={SIZING.TABLE_COLOR_HEIGHT + 13}
          width={34}
          fontSize={10}
          fontFamily={FONTS.FAMILY}
          fontStyle="bold"
          fill="#fff"
          align="center"
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
          const mappingInfo = mappedColsWithColors.get(col.name);
          const isMapped = !!mappingInfo;
          const mappingColor = mappingInfo?.color || color; // Use mapping color or fallback to table color
          const isPending = isPendingTable && pendingMapping?.columnName === col.name;
          const isBeingDragged = dragState.isDragging &&
            dragState.startType === side &&
            dragState.startNodeId === table.tableName &&
            dragState.startColumn === col.name;
          const isHovered = hoveredRow?.table === table.tableName &&
                           hoveredRow?.column === col.name &&
                           hoveredRow?.side === side;
          const isValidDropTarget = isDropTarget && isHovered;
          const canAcceptPending = pendingMapping && pendingMapping.side !== side;

          return (
            <Group key={col.name} y={colY}>
              {/* Clickable row area */}
              <Rect
                x={0}
                width={width}
                height={SIZING.COLUMN_HEIGHT}
                fill={
                  isPending ? (side === 'source' ? '#3b82f6' : '#22c55e') :
                  isBeingDragged ? (side === 'source' ? '#3b82f6' : '#22c55e') :
                  isValidDropTarget ? '#22c55e' :
                  isHovered && (isDropTarget || canAcceptPending) ? '#22c55e40' :
                  isMapped ? mappingColor.lighter :
                  'transparent'
                }
                opacity={isPending || isBeingDragged || isValidDropTarget ? 0.4 : isMapped ? 0.5 : 1}
                onMouseDown={(e) => handleDragStart(side, table.tableName, col.name, e)}
                onTouchStart={(e) => handleDragStart(side, table.tableName, col.name, e)}
                onClick={() => {
                  if (!dragState.isDragging) {
                    handleColumnClick(side, table.tableName, col.name);
                  }
                }}
                onMouseUp={() => {
                  if (isDropTarget) {
                    handleDragEnd(side, table.tableName, col.name);
                  }
                }}
                onTouchEnd={() => {
                  if (isDropTarget) {
                    handleDragEnd(side, table.tableName, col.name);
                  }
                }}
                onMouseEnter={() => {
                  setHoveredRow({ table: table.tableName, column: col.name, side });
                  const stage = stageRef.current;
                  if (stage) {
                    stage.container().style.cursor = dragState.isDragging
                      ? (isDropTarget ? 'copy' : 'not-allowed')
                      : 'pointer';
                  }
                }}
                onMouseLeave={() => {
                  setHoveredRow(null);
                  const stage = stageRef.current;
                  if (stage && !dragState.isDragging) {
                    stage.container().style.cursor = 'default';
                  }
                }}
              />

              {/* Column name */}
              <Text
                text={col.name}
                x={SIZING.PADDING + 6}
                y={8}
                width={width * 0.5}
                fontSize={FONTS.SIZE_SM}
                fontFamily={FONTS.FAMILY}
                fontStyle={isMapped || isPending ? 'bold' : 'normal'}
                fill={isPending ? (side === 'source' ? '#3b82f6' : '#22c55e') : isMapped ? mappingColor.regular : theme.text.primary}
                ellipsis
                listening={false}
              />

              {/* Column type */}
              <Text
                text={col.type}
                x={width * 0.5}
                y={8}
                width={width * 0.45 - SIZING.PADDING}
                fontSize={FONTS.SIZE_SM - 1}
                fontFamily={FONTS.FAMILY}
                fill={theme.text.secondary}
                ellipsis
                align="right"
                listening={false}
              />
            </Group>
          );
        })}
      </Group>
    );
  }, [theme, currentMappings, dragState, hoveredRow, pendingMapping, handleDragStart, handleDragEnd, handleColumnClick]);

  // Pre-compute edge data for better performance
  const edgeData = useMemo(() => {
    if (!sourceNode || !targetNode) return [];

    return currentMappings.map(mapping => {
      const sourceY = getColumnY(sourceNode, mapping.sourceColumn);
      const targetY = getColumnY(targetNode, mapping.targetColumn);
      const sourceX = sourceNode.x + sourceNode.width;
      const targetX = targetNode.x;
      const pathData = getBezierPath(sourceX, sourceY, targetX, targetY);
      const colorIndex = getMappingColorIndex(mapping);
      const lineColor = LINE_COLORS[colorIndex];

      return {
        id: mapping.id,
        pathData,
        lineColor,
      };
    });
  }, [sourceNode, targetNode, currentMappings, getColumnY]);

  // Render mapping edges with lighter colors
  const renderMappingEdges = useCallback(() => {
    return edgeData.map(edge => {
      const isSelected = selectedMappingId === edge.id;

      return (
        <Group key={edge.id}>
          {isSelected && (
            <Path
              data={edge.pathData}
              stroke={edge.lineColor}
              strokeWidth={6}
              opacity={0.3}
              lineCap="round"
            />
          )}
          <Path
            data={edge.pathData}
            stroke={edge.lineColor}
            strokeWidth={isSelected ? 3 : 2}
            lineCap="round"
            opacity={0.8}
            onClick={() => setSelectedMappingId(edge.id)}
            onTap={() => setSelectedMappingId(edge.id)}
          />
        </Group>
      );
    });
  }, [edgeData, selectedMappingId]);

  // Render drag line
  const renderDragLine = useCallback(() => {
    if (!dragState.isDragging || !sourceNode || !targetNode) return null;

    const startNode = dragState.startType === 'source' ? sourceNode : targetNode;
    const startY = getColumnY(startNode, dragState.startColumn!);
    const startX = dragState.startType === 'source'
      ? startNode.x + startNode.width
      : startNode.x;

    return (
      <Line
        points={[startX, startY, dragState.currentX, dragState.currentY]}
        stroke={dragState.startType === 'source' ? '#3b82f6' : '#22c55e'}
        strokeWidth={2}
        dash={[5, 5]}
        opacity={0.7}
      />
    );
  }, [dragState, sourceNode, targetNode, getColumnY]);

  // Render linkage table
  const renderLinkageTable = () => (
    <div style={{
      flex: 1,
      overflow: 'auto',
      padding: '16px',
      background: isDarkTheme ? '#111827' : '#f8fafc',
    }}>
      {currentMappings.length === 0 ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: theme.text.secondary,
        }}>
          <ArrowRightLeft size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>No mappings yet</div>
          <div style={{ fontSize: '13px', opacity: 0.7 }}>
            Click columns in the canvas to create mappings
          </div>
        </div>
      ) : (
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13px',
        }}>
          <thead>
            <tr style={{
              background: isDarkTheme ? '#1f2937' : '#f1f5f9',
              position: 'sticky',
              top: 0,
            }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#3b82f6' }}>Source Column</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '10px 12px', textAlign: 'center', width: '40px' }}></th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#22c55e' }}>Target Column</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>Remarks</th>
              <th style={{ padding: '10px 12px', textAlign: 'center', width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            {currentMappings.map(mapping => {
              const colorIndex = getMappingColorIndex(mapping);
              const lineColor = LINE_COLORS[colorIndex];
              const isSelected = selectedMappingId === mapping.id;

              return (
                <tr
                  key={mapping.id}
                  onClick={() => setSelectedMappingId(mapping.id)}
                  style={{
                    background: isSelected
                      ? (isDarkTheme ? '#1e3a5f' : '#dbeafe')
                      : (isDarkTheme ? '#1f2937' : '#fff'),
                    cursor: 'pointer',
                    borderBottom: `1px solid ${isDarkTheme ? '#374151' : '#e5e7eb'}`,
                  }}
                >
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: lineColor,
                      }} />
                      <span style={{ color: theme.text.primary, fontWeight: 500 }}>
                        {mapping.sourceColumn}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', color: theme.text.secondary, fontFamily: 'monospace', fontSize: '12px' }}>
                    {mapping.sourceType}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', color: theme.text.secondary }}>
                    →
                  </td>
                  <td style={{ padding: '10px 12px', color: theme.text.primary, fontWeight: 500 }}>
                    {mapping.targetColumn}
                  </td>
                  <td style={{ padding: '10px 12px', color: theme.text.secondary, fontFamily: 'monospace', fontSize: '12px' }}>
                    {mapping.targetType}
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    {editingRemarkId === mapping.id ? (
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <input
                          type="text"
                          value={editingRemarkValue}
                          onChange={(e) => setEditingRemarkValue(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateRemarks(mapping.id, editingRemarkValue);
                            } else if (e.key === 'Escape') {
                              setEditingRemarkId(null);
                            }
                          }}
                          autoFocus
                          style={{
                            flex: 1,
                            padding: '4px 8px',
                            border: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`,
                            borderRadius: '4px',
                            background: isDarkTheme ? '#374151' : '#fff',
                            color: theme.text.primary,
                            fontSize: '12px',
                          }}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateRemarks(mapping.id, editingRemarkValue);
                          }}
                          style={{
                            padding: '4px',
                            background: '#22c55e',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <Check size={12} color="#fff" />
                        </button>
                      </div>
                    ) : (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingRemarkId(mapping.id);
                          setEditingRemarkValue(mapping.remarks || '');
                        }}
                        style={{
                          color: mapping.remarks ? theme.text.primary : theme.text.secondary,
                          fontStyle: mapping.remarks ? 'normal' : 'italic',
                          cursor: 'text',
                        }}
                      >
                        {mapping.remarks || 'Click to add...'}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMapping(mapping.id);
                      }}
                      style={{
                        padding: '4px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        opacity: 0.6,
                      }}
                      title="Delete mapping"
                    >
                      <Trash2 size={14} color="#ef4444" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );

  // Render dropdown
  const renderDropdown = (
    _label: string,
    value: string | null,
    placeholder: string,
    options: { id: string; name: string }[],
    isOpen: boolean,
    setIsOpen: (open: boolean) => void,
    onChange: (id: string | null) => void,
    color: string
  ) => (
    <div className="mapper-dropdown" style={{ position: 'relative' }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          background: isDarkTheme ? '#374151' : '#f3f4f6',
          border: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`,
          borderRadius: '6px',
          cursor: 'pointer',
          minWidth: '180px',
        }}
      >
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: color,
        }} />
        <span style={{
          flex: 1,
          textAlign: 'left',
          color: value ? theme.text.primary : theme.text.secondary,
          fontSize: '13px',
        }}>
          {value || placeholder}
        </span>
        <ChevronDown size={14} color={theme.text.secondary} />
      </button>

      {isOpen && (
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
          zIndex: 100,
          maxHeight: '300px',
          overflow: 'auto',
        }}>
          {options.length === 0 ? (
            <div style={{ padding: '12px', color: theme.text.secondary, fontSize: '13px' }}>
              No options available
            </div>
          ) : (
            options.map(opt => (
              <button
                key={opt.id}
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 12px',
                  background: value === opt.name ? (isDarkTheme ? '#374151' : '#f3f4f6') : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  color: theme.text.primary,
                  fontSize: '13px',
                }}
              >
                {opt.name}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );

  // Check if we have valid selection
  const hasValidSelection = sourceTable && targetTable;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Header with selections */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${isDarkTheme ? '#374151' : '#e5e7eb'}`,
        background: isDarkTheme ? '#1f2937' : '#fff',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        {/* Source Script */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#3b82f6' }}>SOURCE</span>
          {renderDropdown(
            'Script',
            sourceScript?.name || null,
            'Select script...',
            scripts.map(s => ({ id: s.id, name: s.name })),
            sourceScriptDropdownOpen,
            setSourceScriptDropdownOpen,
            (id) => {
              setSourceScriptId(id);
              setSourceTableName(null);
            },
            '#3b82f6'
          )}
          {sourceScript && renderDropdown(
            'Table',
            sourceTableName,
            'Select table...',
            sourceScript.data.targets.map(t => ({ id: t.tableName, name: t.tableName })),
            sourceTableDropdownOpen,
            setSourceTableDropdownOpen,
            (name) => setSourceTableName(name),
            '#3b82f6'
          )}
        </div>

        <ArrowRightLeft size={20} color={theme.text.secondary} />

        {/* Target Script */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#22c55e' }}>TARGET</span>
          {renderDropdown(
            'Script',
            targetScript?.name || null,
            'Select script...',
            scripts.map(s => ({ id: s.id, name: s.name })),
            targetScriptDropdownOpen,
            setTargetScriptDropdownOpen,
            (id) => {
              setTargetScriptId(id);
              setTargetTableName(null);
            },
            '#22c55e'
          )}
          {targetScript && renderDropdown(
            'Table',
            targetTableName,
            'Select table...',
            targetScript.data.targets.map(t => ({ id: t.tableName, name: t.tableName })),
            targetTableDropdownOpen,
            setTargetTableDropdownOpen,
            (name) => setTargetTableName(name),
            '#22c55e'
          )}
        </div>

        {/* Pending indicator */}
        {pendingMapping && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            background: pendingMapping.side === 'source' ? '#3b82f620' : '#22c55e20',
            borderRadius: '16px',
            marginLeft: 'auto',
          }}>
            <MousePointer size={14} color={pendingMapping.side === 'source' ? '#3b82f6' : '#22c55e'} />
            <span style={{
              fontSize: '12px',
              color: pendingMapping.side === 'source' ? '#3b82f6' : '#22c55e',
              fontWeight: 500,
            }}>
              Select {pendingMapping.side === 'source' ? 'target' : 'source'} column...
            </span>
            <button
              onClick={() => setPendingMapping(null)}
              style={{
                padding: '2px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
              }}
            >
              <X size={14} color={pendingMapping.side === 'source' ? '#3b82f6' : '#22c55e'} />
            </button>
          </div>
        )}
      </div>

      {/* Content area */}
      {!hasValidSelection ? (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.text.secondary,
        }}>
          <Database size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>Select Source and Target Tables</div>
          <div style={{ fontSize: '13px', opacity: 0.7 }}>
            Choose a script and table for both source and target to start mapping
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0%', minHeight: 0, overflow: 'hidden' }}>
          {/* Tab bar */}
          <div style={{
            display: 'flex',
            gap: '4px',
            padding: '8px 16px',
            background: isDarkTheme ? '#111827' : '#f8fafc',
            borderBottom: `1px solid ${isDarkTheme ? '#374151' : '#e5e7eb'}`,
          }}>
            <button
              onClick={() => setActiveTab('canvas')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: activeTab === 'canvas'
                  ? (isDarkTheme ? '#374151' : '#fff')
                  : 'transparent',
                border: activeTab === 'canvas'
                  ? `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`
                  : '1px solid transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: activeTab === 'canvas' ? theme.text.primary : theme.text.secondary,
                fontSize: '13px',
                fontWeight: activeTab === 'canvas' ? 600 : 400,
              }}
            >
              <Grid3X3 size={14} />
              Canvas
            </button>
            <button
              onClick={() => setActiveTab('linkage')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: activeTab === 'linkage'
                  ? (isDarkTheme ? '#374151' : '#fff')
                  : 'transparent',
                border: activeTab === 'linkage'
                  ? `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`
                  : '1px solid transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: activeTab === 'linkage' ? theme.text.primary : theme.text.secondary,
                fontSize: '13px',
                fontWeight: activeTab === 'linkage' ? 600 : 400,
              }}
            >
              <List size={14} />
              Linkage Table
              {currentMappings.length > 0 && (
                <span style={{
                  padding: '2px 6px',
                  background: isDarkTheme ? '#4b5563' : '#e5e7eb',
                  borderRadius: '10px',
                  fontSize: '11px',
                }}>
                  {currentMappings.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'canvas' ? (
            <div
              ref={containerRef}
              style={{
                flex: '1 1 0%',
                minHeight: 0,
                width: '100%',
                position: 'relative',
                overflow: 'auto',
                background: isDarkTheme ? '#0f172a' : '#f1f5f9',
              }}
            >
              {dimensions.width > 0 && dimensions.height > 0 && canvasSize.width > 0 && (
                <div style={{
                  width: canvasSize.width,
                  height: canvasSize.height,
                  minWidth: '100%',
                  minHeight: '100%',
                }}>
                  <Stage
                    ref={stageRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    onClick={handleStageClick}
                    onTap={handleStageClick}
                    onMouseMove={handleDragMove}
                    onTouchMove={handleDragMove}
                    onMouseUp={cancelDrag}
                    onTouchEnd={cancelDrag}
                    onMouseLeave={cancelDrag}
                    style={{ cursor: dragState.isDragging ? 'crosshair' : 'default' }}
                  >
                    <Layer>
                      {renderMappingEdges()}
                      {renderDragLine()}
                      {sourceNode && renderTable(sourceNode)}
                      {targetNode && renderTable(targetNode)}
                    </Layer>
                  </Stage>
                </div>
              )}

              {/* Instructions overlay */}
              <div style={{
                position: 'fixed',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                padding: '8px 16px',
                background: isDarkTheme ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                fontSize: '12px',
                color: theme.text.secondary,
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 10,
              }}>
                <span>Click a column to start mapping</span>
                <span>|</span>
                <span>Or drag from source to target</span>
              </div>
            </div>
          ) : (
            renderLinkageTable()
          )}
        </div>
      )}
    </div>
  );
}
