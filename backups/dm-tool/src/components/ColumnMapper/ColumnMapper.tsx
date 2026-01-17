import { useState, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import { Stage, Layer, Rect, Text, Line, Group, Path } from 'react-konva';
import Konva from 'konva';
import {
  Script,
  Table,
  Column,
  MappingProject,
  ColumnMapping,
  TypeRuleSet,
  TypeCompatibilityRule,
} from '../../types';
import {
  generateId,
  saveMappingProject,
  loadMappingProjects,
  loadMappingWorkspaceState,
  saveMappingWorkspaceState,
  loadScripts,
  saveScripts,
  loadTypeRuleSets,
  saveTypeRuleSet,
  migrateProjectTypeRules,
  consolidateTypeRuleSets,
  getOrCreateDefaultTypeRuleSet,
} from '../../utils/storage';
import {
  generateAlignmentSql,
  getDefaultDatatypeMappings,
} from '../../utils/sqlAlignment';
import {
  createManualMapping,
  validateColumnMapping,
  checkTypeCompatibility,
} from '../../utils/mapping';
import {
  getRuleSetsForDatabases,
} from '../../constants/typeMatrix';
import { TABLE_COLORS, SIZING, FONTS, LIGHT_THEME, getDarkTheme, DarkThemeVariant } from '../../constants/erd';
import {
  Trash2,
  ChevronDown,
  ChevronRight,
  Database,
  ArrowRightLeft,
  Check,
  X,
  List,
  Grid3X3,
  MousePointer,
  Layers,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Settings2,
  ExternalLink,
  Code,
  Copy,
  Download,
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
  darkThemeVariant?: DarkThemeVariant;
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

// State for column search popup (click-to-map with search)
interface ColumnSearchPopup {
  side: 'source' | 'target';  // Which side was clicked
  tableName: string;
  columnName: string;
  column: Column;  // Full column object to access migration fields
  x: number;  // Screen position for popup
  y: number;
}

// State for showing "navigate to mapped column" popup
interface MappedColumnPopup {
  mapping: ColumnMapping;
  side: 'source' | 'target';
  clickedColumn: string;
  clickedTable: string;
  x: number;
  y: number;
}

// State for showing all mapped tables (right-click)
interface AllMappedTablesPopup {
  side: 'source' | 'target';
  tableName: string;
  columnName: string;
  mappings: ColumnMapping[];
  x: number;
  y: number;
}

// Lighter colors for mapping lines (using table colors)
const LINE_COLORS = TABLE_COLORS.map(c => c.regular);

// Tab for canvas view
type CanvasTab = 'canvas' | 'linkage' | 'summary' | 'rules';

// Get theme based on dark mode and variant
const getTheme = (isDark: boolean, variant: DarkThemeVariant = 'slate') =>
  isDark ? getDarkTheme(variant) : LIGHT_THEME;

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
  scripts: propScripts,
  isDarkTheme,
  darkThemeVariant = 'slate',
  onMappingStateChange,
}: ColumnMapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<Konva.Stage>(null);

  // Maintain local copy of scripts that can be updated
  // Always load from localStorage to ensure we have the latest changes
  const [scripts, setScripts] = useState<Script[]>(() => {
    const savedScripts = loadScripts();
    // Ensure we always return an array, even if propScripts is undefined
    return savedScripts.length > 0 ? savedScripts : (Array.isArray(propScripts) ? propScripts : []);
  });

  // Reload scripts from localStorage whenever component mounts or becomes visible
  useEffect(() => {
    const reloadScripts = () => {
      const savedScripts = loadScripts();
      if (savedScripts.length > 0) {
        setScripts(savedScripts);
      }
    };

    // Reload immediately
    reloadScripts();

    // Listen for storage events from other components
    const handleStorageEvent = () => {
      reloadScripts();
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, []);

  // Tab for canvas view (canvas vs linkage table)
  const [activeTab, setActiveTab] = useState<CanvasTab>('canvas');
  const [expandedTargetTables, setExpandedTargetTables] = useState<Set<string>>(new Set());
  const [expandedLinkageTablePairs, setExpandedLinkageTablePairs] = useState<Set<string>>(new Set());

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

  // Type rule dropdown states - track which row has which dropdown open
  const [typeRuleSourceDropdownOpen, setTypeRuleSourceDropdownOpen] = useState<string | null>(null);
  const [typeRuleTargetDropdownOpen, setTypeRuleTargetDropdownOpen] = useState<string | null>(null);
  const [typeRuleSourceSearch, setTypeRuleSourceSearch] = useState<Record<string, string>>({});
  const [typeRuleTargetSearch, setTypeRuleTargetSearch] = useState<Record<string, string>>({});

  // Search terms for table dropdowns
  const [sourceTableSearch, setSourceTableSearch] = useState('');
  const [targetTableSearch, setTargetTableSearch] = useState('');

  // Project state (contains merged mappings from all related projects for display)
  const [project, setProject] = useState<MappingProject | null>(null);

  // Global type rule set state
  const [activeTypeRuleSet, setActiveTypeRuleSet] = useState<TypeRuleSet | null>(null);

  // Canvas state - start with 0 to avoid initial flash
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Column search popup state for click-to-map
  const [columnSearchPopup, setColumnSearchPopup] = useState<ColumnSearchPopup | null>(null);
  const [searchPopupTerm, setSearchPopupTerm] = useState('');
  const [localMigrationNeeded, setLocalMigrationNeeded] = useState<boolean>(true);
  const [localNonMigrationComment, setLocalNonMigrationComment] = useState<string>('');

  // Popup state for already-mapped columns
  const [mappedColumnPopup, setMappedColumnPopup] = useState<MappedColumnPopup | null>(null);

  // Popup state for all mapped tables (right-click)
  const [allMappedTablesPopup, setAllMappedTablesPopup] = useState<AllMappedTablesPopup | null>(null);

  // Selection state
  const [selectedMappingId, setSelectedMappingId] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<{ table: string; column: string; side: 'source' | 'target' } | null>(null);

  // Drag state for drag-to-map
  const [dragState, setDragState] = useState({
    isDragging: false,
    hasMoved: false, // Track if mouse actually moved (to distinguish click from drag)
    startNodeId: null as string | null,
    startColumn: null as string | null,
    startType: null as 'source' | 'target' | null,
    currentX: 0,
    currentY: 0,
  });

  // Editing remarks
  const [editingRemarkId, setEditingRemarkId] = useState<string | null>(null);
  const [editingRemarkValue, setEditingRemarkValue] = useState('');

  // SQL Generator state
  const [showSqlGenerator, setShowSqlGenerator] = useState(false);
  const [sqlAlignDirection, setSqlAlignDirection] = useState<'toSource' | 'toTarget'>('toSource');
  const [sqlIncludeNullable, setSqlIncludeNullable] = useState(true);
  const [sqlIncludeDatatype, setSqlIncludeDatatype] = useState(true);
  const [generatedSql, setGeneratedSql] = useState<string>('');

  // Context menu state for linkage table
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    mapping: ColumnMapping;
  } | null>(null);

  // SQL Preview modal state
  const [sqlPreview, setSqlPreview] = useState<{
    sql: string;
    direction: 'toSource' | 'toTarget';
  } | null>(null);

  // Multi-select state for linkage table
  const [selectedMappingIds, setSelectedMappingIds] = useState<Set<string>>(new Set());
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null);

  // Sidebar state - manage expandedTables here and sync to parent
  const [searchTerm] = useState('');
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  const theme = getTheme(isDarkTheme, darkThemeVariant);

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
      // Close type rule dropdowns if clicking outside
      if (!target.closest('.type-rule-dropdown')) {
        setTypeRuleSourceDropdownOpen(null);
        setTypeRuleTargetDropdownOpen(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Get scripts
  const sourceScript = useMemo(() =>
    scripts?.find(s => s.id === sourceScriptId) || null
  , [scripts, sourceScriptId]);

  const targetScript = useMemo(() =>
    scripts?.find(s => s.id === targetScriptId) || null
  , [scripts, targetScriptId]);

  // Get selected tables
  const sourceTable = useMemo(() =>
    sourceScript?.data?.targets?.find(t => t.tableName === sourceTableName) || null
  , [sourceScript, sourceTableName]);

  const targetTable = useMemo(() =>
    targetScript?.data?.targets?.find(t => t.tableName === targetTableName) || null
  , [targetScript, targetTableName]);

  // Sync local migration state when column data changes
  useEffect(() => {
    if (columnSearchPopup) {
      const table = columnSearchPopup.side === 'source' ? sourceTable : targetTable;
      const freshColumn = table?.columns?.find(c => c.name === columnSearchPopup.columnName);
      if (freshColumn) {
        setLocalMigrationNeeded(freshColumn.migrationNeeded !== false);
        setLocalNonMigrationComment(freshColumn.nonMigrationComment || '');
      }
    }
  }, [columnSearchPopup, sourceTable, targetTable]);

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

  // Run migration and consolidation once on component mount
  useEffect(() => {
    migrateProjectTypeRules();
    consolidateTypeRuleSets();
  }, []);

  // Load type rule set when project changes
  useEffect(() => {
    if (!project) {
      setActiveTypeRuleSet(null);
      return;
    }

    // Load the type rule set referenced by the project
    if (project.typeRuleSetId) {
      const ruleSets = loadTypeRuleSets() || [];
      const ruleSet = ruleSets.find(rs => rs.id === project.typeRuleSetId);

      // If TypeRuleSet not found, fallback to default (shouldn't happen after consolidation)
      if (!ruleSet) {
        const defaultRuleSet = getOrCreateDefaultTypeRuleSet();
        setActiveTypeRuleSet(defaultRuleSet);

        // Update project to reference the default rule set
        const updatedProject = {
          ...project,
          typeRuleSetId: defaultRuleSet.id,
          updatedAt: Date.now(),
        };
        setProject(updatedProject);
        saveMappingProject(updatedProject);
      } else {
        setActiveTypeRuleSet(ruleSet);
      }
    } else {
      // Get or create default type rule set
      const defaultRuleSet = getOrCreateDefaultTypeRuleSet();
      setActiveTypeRuleSet(defaultRuleSet);

      // Update project to reference the default rule set
      const updatedProject = {
        ...project,
        typeRuleSetId: defaultRuleSet.id,
        updatedAt: Date.now(),
      };
      setProject(updatedProject);
      saveMappingProject(updatedProject);
    }
  }, [project?.id, project?.typeRuleSetId]);

  // Load or create project when scripts change
  // Also merge mappings from all related projects for cross-schema visibility
  useEffect(() => {
    if (!sourceScriptId || !targetScriptId) {
      setProject(null);
      return;
    }

    const projects = loadMappingProjects() || [];
    const existing = projects.find(
      p => p.sourceScriptId === sourceScriptId && p.targetScriptId === targetScriptId
    );

    if (existing) {
      // Get all mappings from all projects involving either the source or target script
      // This enables cross-schema mapping visibility
      const allRelatedMappings = projects
        .filter(p => p.sourceScriptId === sourceScriptId || p.targetScriptId === targetScriptId)
        .flatMap(p => p.mappings);

      // Deduplicate mappings by ID (in case same mapping appears in multiple projects)
      const uniqueMappings = Array.from(
        new Map(allRelatedMappings.map(m => [m.id, m])).values()
      );

      // Merge into current project for display (but don't save merged mappings back)
      const projectWithAllMappings = {
        ...existing,
        mappings: uniqueMappings,
      };

      setProject(projectWithAllMappings);
    } else {
      // Create new project - typeRuleSetId will be assigned by the useEffect
      setProject({
        id: generateId(),
        name: `${sourceScript?.name || 'Source'} → ${targetScript?.name || 'Target'}`,
        sourceScriptId,
        targetScriptId,
        mappings: [],
        tableMappings: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  }, [sourceScriptId, targetScriptId, sourceScript?.name, targetScript?.name]);

  // Helper function to save a mapping to the correct project (not the merged one)
  const saveToCorrectProject = useCallback((mapping: ColumnMapping, action: 'add' | 'update' | 'delete') => {
    if (!sourceScriptId || !targetScriptId) return;

    const projects = loadMappingProjects() || [];

    // For delete/update, find project by mapping ID (more robust than script ID matching)
    // For add, use script ID matching as before
    let ownerProject: MappingProject | undefined;

    if (action === 'delete' || action === 'update') {
      // Find project that contains this mapping ID
      ownerProject = projects.find(p => p.mappings?.some(m => m.id === mapping.id));
    } else {
      // For 'add', find by script IDs
      ownerProject = projects.find(
        p => p.sourceScriptId === mapping.sourceScriptId && p.targetScriptId === mapping.targetScriptId
      );
    }

    if (ownerProject) {
      // Update the existing project
      let updatedMappings: ColumnMapping[];
      if (action === 'add') {
        updatedMappings = [...ownerProject.mappings, mapping];
      } else if (action === 'delete') {
        updatedMappings = ownerProject.mappings.filter(m => m.id !== mapping.id);
      } else {
        // update
        updatedMappings = ownerProject.mappings.map(m => m.id === mapping.id ? mapping : m);
      }

      const updatedProject = {
        ...ownerProject,
        mappings: updatedMappings,
        updatedAt: Date.now(),
      };

      saveMappingProject(updatedProject);

      // Reload merged project to reflect changes
      const updatedProjects = projects.map(p => p.id === updatedProject.id ? updatedProject : p);
      const allRelatedMappings = updatedProjects
        .filter(p => p.sourceScriptId === sourceScriptId || p.targetScriptId === targetScriptId)
        .flatMap(p => p.mappings);

      // Deduplicate mappings by ID
      const uniqueMappings = Array.from(
        new Map(allRelatedMappings.map(m => [m.id, m])).values()
      );

      setProject(prev => prev ? { ...prev, mappings: uniqueMappings, updatedAt: Date.now() } : null);
    } else if (action === 'add') {
      // Create new project for this source->target pair
      const newProject: MappingProject = {
        id: generateId(),
        name: `${sourceScript?.name || 'Source'} → ${targetScript?.name || 'Target'}`,
        sourceScriptId: mapping.sourceScriptId,
        targetScriptId: mapping.targetScriptId,
        mappings: [mapping],
        tableMappings: [],
        typeRules: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      saveMappingProject(newProject);

      // Reload merged project
      const updatedProjects = [...projects, newProject];
      const allRelatedMappings = updatedProjects
        .filter(p => p.sourceScriptId === sourceScriptId || p.targetScriptId === targetScriptId)
        .flatMap(p => p.mappings);

      // Deduplicate mappings by ID
      const uniqueMappings = Array.from(
        new Map(allRelatedMappings.map(m => [m.id, m])).values()
      );

      setProject(prev => prev ? { ...prev, mappings: uniqueMappings, updatedAt: Date.now() } : null);
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

  // Filter mappings for current tables - show all mappings involving either selected table
  // This allows viewing cross-schema mappings in linkage table
  // Also re-validates mappings when scripts change
  const currentMappings = useMemo(() => {
    if (!project || !project.mappings) return [];

    let filteredMappings: ColumnMapping[] = [];

    // If both source and target are selected, show mappings involving either table
    if (sourceTableName && targetTableName) {
      filteredMappings = project.mappings.filter(
        m => (m.sourceTable === sourceTableName) || (m.targetTable === targetTableName)
      );
    }
    // If only source is selected, show all mappings from that source
    else if (sourceTableName) {
      filteredMappings = project.mappings.filter(m => m.sourceTable === sourceTableName);
    }
    // If only target is selected, show all mappings to that target
    else if (targetTableName) {
      filteredMappings = project.mappings.filter(m => m.targetTable === targetTableName);
    }

    // Re-validate mappings with current script data
    // This ensures validation status updates when scripts are modified
    if (sourceScript && targetScript && filteredMappings.length > 0) {
      const ruleSets = getRuleSetsForDatabases(sourceScript.type, targetScript.type);

      filteredMappings = filteredMappings.map(mapping => {
        // Find the current column definitions from the scripts
        const sourceTable = sourceScript?.data?.targets?.find(t => t.tableName === mapping.sourceTable);
        const targetTable = targetScript?.data?.targets?.find(t => t.tableName === mapping.targetTable);

        if (sourceTable && targetTable) {
          const sourceCol = sourceTable.columns?.find(c => c.name === mapping.sourceColumn);
          const targetCol = targetTable.columns?.find(c => c.name === mapping.targetColumn);

          if (sourceCol && targetCol) {
            // Re-validate with current column data
            const validation = validateColumnMapping(sourceCol, targetCol, sourceTable, targetTable, ruleSets);
            const typeCheck = checkTypeCompatibility(sourceCol.type, targetCol.type, ruleSets);

            // Return mapping with updated validation and types
            return {
              ...mapping,
              sourceType: sourceCol.type,
              targetType: targetCol.type,
              typeCompatibility: typeCheck.compatibility,
              validation,
            };
          }
        }

        // If we can't find the columns, return the mapping as-is
        return mapping;
      });
    }

    // Sort mappings: group by source table, then target table, then column order in DDL
    if (sourceScript && filteredMappings.length > 0) {
      // Get all source tables involved
      const sourceTableMap = new Map<string, Table>();
      sourceScript.data.targets.forEach(table => {
        sourceTableMap.set(table.tableName, table);
      });

      filteredMappings.sort((a, b) => {
        // First, group by source table
        if (a.sourceTable !== b.sourceTable) {
          return a.sourceTable.localeCompare(b.sourceTable);
        }

        // Same source table, group by target table
        if (a.targetTable !== b.targetTable) {
          return a.targetTable.localeCompare(b.targetTable);
        }

        // Same source and target table, sort by source column order in DDL
        const sourceTable = sourceTableMap.get(a.sourceTable);
        if (sourceTable) {
          const indexA = sourceTable.columns.findIndex(c => c.name === a.sourceColumn);
          const indexB = sourceTable.columns.findIndex(c => c.name === b.sourceColumn);
          return indexA - indexB;
        }

        return 0;
      });
    }

    return filteredMappings;
  }, [project, sourceTableName, targetTableName, sourceScript, targetScript]);

  // Auto-expand all table pairs in linkage view when mappings change
  useEffect(() => {
    if (currentMappings.length > 0 && activeTab === 'linkage') {
      const tablePairs = new Set<string>();
      currentMappings.forEach(mapping => {
        const pairKey = `${mapping.sourceTable}→${mapping.targetTable}`;
        tablePairs.add(pairKey);
      });
      setExpandedLinkageTablePairs(tablePairs);
    }
  }, [currentMappings.length, activeTab]);

  // For canvas, only show mappings where BOTH tables are visible
  // (source and target must match the currently selected tables)
  const visibleMappings = useMemo(() => {
    if (!project || !project.mappings || !sourceTableName || !targetTableName) return [];
    return project.mappings.filter(
      m => m.sourceTable === sourceTableName && m.targetTable === targetTableName
    );
  }, [project, sourceTableName, targetTableName]);

  // Get available columns for search popup (unmapped columns from opposite side)
  const availableColumnsForSearch = useMemo(() => {
    if (!columnSearchPopup) return [];

    // Get the opposite side's table
    const oppositeSide = columnSearchPopup.side === 'source' ? 'target' : 'source';
    const oppositeTable = oppositeSide === 'source' ? sourceTable : targetTable;

    if (!oppositeTable) return [];

    // Get columns that are already mapped on the opposite side
    const mappedCols = new Set(
      currentMappings.map(m => oppositeSide === 'source' ? m.sourceColumn : m.targetColumn)
    );

    // Filter to unmapped columns and apply search term
    const searchLower = searchPopupTerm.toLowerCase();
    return oppositeTable.columns
      .filter(col => !mappedCols.has(col.name))
      .filter(col => col.name.toLowerCase().includes(searchLower) || col.type.toLowerCase().includes(searchLower))
      .map(col => ({
        tableName: oppositeTable.tableName,
        columnName: col.name,
        columnType: col.type,
      }));
  }, [columnSearchPopup, sourceTable, targetTable, currentMappings, searchPopupTerm]);

  // Handle mapping creation (from click-to-map or drag)
  const createMapping = useCallback((
    srcTableName: string,
    srcColumnName: string,
    tgtTableName: string,
    tgtColumnName: string
  ) => {
    if (!project || !project.mappings || !sourceScript || !targetScript) return;

    const srcTable = sourceScript?.data?.targets?.find(t => t.tableName === srcTableName);
    const tgtTable = targetScript?.data?.targets?.find(t => t.tableName === tgtTableName);
    if (!srcTable || !tgtTable) return;

    const srcColumn = srcTable?.columns?.find(c => c.name === srcColumnName);
    const tgtColumn = tgtTable?.columns?.find(c => c.name === tgtColumnName);
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

    // Save to the correct project (not the merged one)
    saveToCorrectProject(newMapping, 'add');
    setSelectedMappingId(newMapping.id);

    // Sync the new mapping to data dictionary immediately
    // We can't use the callback since it's defined later, so we inline the logic
    const allScripts = loadScripts();
    const updatedScripts = allScripts.map((script: Script) => {
      // Update source column
      if (script.id === sourceScript.id) {
        const scriptCopy = { ...script };
        scriptCopy.data = {
          ...scriptCopy.data,
          targets: scriptCopy.data.targets.map(table => {
            if (table.tableName === srcTableName) {
              return {
                ...table,
                columns: table.columns.map(col => {
                  if (col.name === srcColumnName) {
                    const targetInfo = `${targetScript.name}.${tgtTableName}.${tgtColumnName}`;
                    const remarkText = srcColumn.migrationNeeded === false && srcColumn.nonMigrationComment
                      ? srcColumn.nonMigrationComment
                      : '';
                    const newMappingText = remarkText
                      ? `Mapped to ${targetInfo}<br>${remarkText}`
                      : `Mapped to ${targetInfo}`;
                    return { ...col, mapping: newMappingText };
                  }
                  return col;
                }),
              };
            }
            return table;
          }),
        };
        scriptCopy.updatedAt = Date.now();
        return scriptCopy;
      }

      // Update target column
      if (script.id === targetScript.id) {
        const scriptCopy = { ...script };
        scriptCopy.data = {
          ...scriptCopy.data,
          targets: scriptCopy.data.targets.map(table => {
            if (table.tableName === tgtTableName) {
              return {
                ...table,
                columns: table.columns.map(col => {
                  if (col.name === tgtColumnName) {
                    const sourceInfo = `${sourceScript.name}.${srcTableName}.${srcColumnName}`;
                    const remarkText = tgtColumn.migrationNeeded === false && tgtColumn.nonMigrationComment
                      ? tgtColumn.nonMigrationComment
                      : '';
                    const newMappingText = remarkText
                      ? `Mapped to ${sourceInfo}<br>${remarkText}`
                      : `Mapped to ${sourceInfo}`;
                    return { ...col, mapping: newMappingText };
                  }
                  return col;
                }),
              };
            }
            return table;
          }),
        };
        scriptCopy.updatedAt = Date.now();
        return scriptCopy;
      }

      return script;
    });

    saveScripts(updatedScripts);
    window.dispatchEvent(new Event('storage'));
  }, [project, sourceScript, targetScript, sourceScriptId, targetScriptId, saveToCorrectProject]);

  // Helper function to check if a column is already mapped
  const findExistingMapping = useCallback((
    side: 'source' | 'target',
    tableName: string,
    columnName: string
  ): ColumnMapping | null => {
    if (!project || !project.mappings) return null;

    return project.mappings.find(m => {
      if (side === 'source') {
        return m.sourceTable === tableName && m.sourceColumn === columnName;
      } else {
        return m.targetTable === tableName && m.targetColumn === columnName;
      }
    }) || null;
  }, [project]);

  // Handle navigation to mapped column (select the table pair and highlight the mapping)
  const handleNavigateToMapping = useCallback((mapping: ColumnMapping) => {
    // Update script selections to match the mapping's source and target
    setSourceScriptId(mapping.sourceScriptId);
    setTargetScriptId(mapping.targetScriptId);

    // Set the source and target tables to show this mapping
    setSourceTableName(mapping.sourceTable);
    setTargetTableName(mapping.targetTable);

    // Select the mapping
    setSelectedMappingId(mapping.id);

    // Close the popup
    setMappedColumnPopup(null);
  }, []);

  // Handle column click - shows search popup for mapping to opposite side
  const handleColumnClick = useCallback((
    side: 'source' | 'target',
    tableName: string,
    columnName: string,
    clickX?: number,
    clickY?: number
  ) => {
    // Close any existing popups
    setMappedColumnPopup(null);

    // Get the column object
    const table = side === 'source' ? sourceTable : targetTable;
    const column = table?.columns?.find(c => c.name === columnName);
    if (!column) return;

    // Check if this column is already mapped
    const existingMapping = findExistingMapping(side, tableName, columnName);

    if (existingMapping) {
      // If column is already mapped, show popup asking if user wants to navigate
      setMappedColumnPopup({
        mapping: existingMapping,
        side,
        clickedColumn: columnName,
        clickedTable: tableName,
        x: clickX || 200,
        y: clickY || 200,
      });

      // Also select the mapping to highlight it
      setSelectedMappingId(existingMapping.id);
      setColumnSearchPopup(null);
      return;
    }

    // If clicking same column again, close popup
    if (columnSearchPopup &&
        columnSearchPopup.side === side &&
        columnSearchPopup.tableName === tableName &&
        columnSearchPopup.columnName === columnName) {
      setColumnSearchPopup(null);
      setSearchPopupTerm('');
      return;
    }

    // Show search popup for selecting a column from the opposite side
    setColumnSearchPopup({
      side,
      tableName,
      columnName,
      column,
      x: clickX || 200,
      y: clickY || 200,
    });
    setSearchPopupTerm('');

    // Initialize local migration state
    setLocalMigrationNeeded(column.migrationNeeded !== false);
    setLocalNonMigrationComment(column.nonMigrationComment || '');
  }, [columnSearchPopup, findExistingMapping, sourceTable, targetTable]);

  // Handle selecting a column from search popup to create mapping
  const handleSearchPopupSelect = useCallback((targetTableName: string, targetColumnName: string) => {
    if (!columnSearchPopup) return;

    const { side, tableName: sourceTableName, columnName: sourceColumnName } = columnSearchPopup;

    // Create the mapping
    if (side === 'source') {
      createMapping(sourceTableName, sourceColumnName, targetTableName, targetColumnName);
    } else {
      createMapping(targetTableName, targetColumnName, sourceTableName, sourceColumnName);
    }

    // Close the popup
    setColumnSearchPopup(null);
    setSearchPopupTerm('');
  }, [columnSearchPopup, createMapping]);

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

    // Note: Don't clear search popup here - it's needed for click-to-map
    // The click handler will check hasMoved to distinguish clicks from drags

    setDragState({
      isDragging: true,
      hasMoved: false,
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

    // Clear search popup when user actually starts dragging
    if (!dragState.hasMoved) {
      setColumnSearchPopup(null);
      setSearchPopupTerm('');
    }

    setDragState(prev => ({
      ...prev,
      hasMoved: true, // Mark that we've moved (distinguishes click from drag)
      currentX: pos.x,
      currentY: pos.y,
    }));
  }, [dragState.isDragging, dragState.hasMoved]);

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
        hasMoved: false,
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
      hasMoved: false,
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
        hasMoved: false,
        startNodeId: null,
        startColumn: null,
        startType: null,
        currentX: 0,
        currentY: 0,
      });
    }
  }, [dragState.isDragging]);

  // Handle click on empty canvas area to close popups
  const handleStageClick = useCallback((e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    // Only cancel if clicking directly on stage (not on table elements)
    // Check if the click target is the stage itself or the background
    const clickedOnStage = e.target === e.target.getStage();
    if (clickedOnStage) {
      if (columnSearchPopup) {
        setColumnSearchPopup(null);
        setSearchPopupTerm('');
      }
      if (mappedColumnPopup) {
        setMappedColumnPopup(null);
      }
      if (allMappedTablesPopup) {
        setAllMappedTablesPopup(null);
      }
      // Also clear selection when clicking on empty canvas
      setSelectedMappingId(null);
    }
  }, [columnSearchPopup, mappedColumnPopup, allMappedTablesPopup]);

  // Handle mapping deletion
  const handleDeleteMapping = useCallback((mappingId: string) => {
    if (!project || !project.mappings) return;

    const mappingToDelete = project.mappings.find(m => m.id === mappingId);
    if (!mappingToDelete) return;

    // Delete from the correct project (not the merged one)
    saveToCorrectProject(mappingToDelete, 'delete');

    if (selectedMappingId === mappingId) {
      setSelectedMappingId(null);
    }
  }, [project, selectedMappingId, saveToCorrectProject]);

  // Handle keyboard events for Delete key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete or Backspace to delete selected mapping
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedMappingId && activeTab === 'canvas') {
        // Don't delete if user is typing in an input
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
          return;
        }
        e.preventDefault();
        handleDeleteMapping(selectedMappingId);
      }
      // Escape to clear selection and close popup
      if (e.key === 'Escape') {
        setSelectedMappingId(null);
        setColumnSearchPopup(null);
        setSearchPopupTerm('');
        setMappedColumnPopup(null);
        setAllMappedTablesPopup(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMappingId, activeTab, handleDeleteMapping]);

  // Update mapping remarks
  const handleUpdateRemarks = useCallback((mappingId: string, remarks: string) => {
    if (!project || !project.mappings) return;

    const mapping = project.mappings.find(m => m.id === mappingId);
    if (!mapping) return;

    const updatedMapping = { ...mapping, remarks, updatedAt: Date.now() };

    // Save to the correct project (not the merged one)
    saveToCorrectProject(updatedMapping, 'update');
    setEditingRemarkId(null);
    setEditingRemarkValue('');

    // Sync remarks to data dictionary
    syncMappingToDataDictionary(updatedMapping);
  }, [project, saveToCorrectProject]);

  // Sync mapping information to data dictionary
  const syncMappingToDataDictionary = useCallback((mapping: ColumnMapping) => {
    if (!sourceScript || !targetScript) return;

    const allScripts = loadScripts();
    let updated = false;

    // Get source and target columns to check migration status
    const sourceTable = sourceScript?.data?.targets?.find(t => t.tableName === mapping.sourceTable);
    const targetTable = targetScript?.data?.targets?.find(t => t.tableName === mapping.targetTable);
    const sourceColumn = sourceTable?.columns?.find(c => c.name === mapping.sourceColumn);
    const targetColumn = targetTable?.columns?.find(c => c.name === mapping.targetColumn);

    const updatedScripts = allScripts.map((script: Script) => {
      // Update source column
      if (script.id === sourceScript.id && sourceColumn) {
        const scriptCopy = { ...script };
        scriptCopy.data = {
          ...scriptCopy.data,
          targets: scriptCopy.data.targets.map(table => {
            if (table.tableName === mapping.sourceTable) {
              return {
                ...table,
                columns: table.columns.map(col => {
                  if (col.name === mapping.sourceColumn) {
                    const targetInfo = `${targetScript.name}.${mapping.targetTable}.${mapping.targetColumn}`;
                    const remarkText = sourceColumn.migrationNeeded === false && sourceColumn.nonMigrationComment
                      ? sourceColumn.nonMigrationComment
                      : (mapping.remarks || '');
                    const newMapping = remarkText
                      ? `Mapped to ${targetInfo}<br>${remarkText}`
                      : `Mapped to ${targetInfo}`;
                    updated = true;
                    return { ...col, mapping: newMapping };
                  }
                  return col;
                }),
              };
            }
            return table;
          }),
        };
        scriptCopy.updatedAt = Date.now();
        return scriptCopy;
      }

      // Update target column
      if (script.id === targetScript.id && targetColumn) {
        const scriptCopy = { ...script };
        scriptCopy.data = {
          ...scriptCopy.data,
          targets: scriptCopy.data.targets.map(table => {
            if (table.tableName === mapping.targetTable) {
              return {
                ...table,
                columns: table.columns.map(col => {
                  if (col.name === mapping.targetColumn) {
                    const sourceInfo = `${sourceScript.name}.${mapping.sourceTable}.${mapping.sourceColumn}`;
                    const remarkText = targetColumn.migrationNeeded === false && targetColumn.nonMigrationComment
                      ? targetColumn.nonMigrationComment
                      : (mapping.remarks || '');
                    const newMapping = remarkText
                      ? `Mapped to ${sourceInfo}<br>${remarkText}`
                      : `Mapped to ${sourceInfo}`;
                    updated = true;
                    return { ...col, mapping: newMapping };
                  }
                  return col;
                }),
              };
            }
            return table;
          }),
        };
        scriptCopy.updatedAt = Date.now();
        return scriptCopy;
      }

      return script;
    });

    if (updated) {
      saveScripts(updatedScripts);
      window.dispatchEvent(new Event('storage'));
    }
  }, [sourceScript, targetScript]);

  // Handle SQL generation
  const handleGenerateSql = useCallback(() => {
    if (!sourceScript || !targetScript || !project) return;

    const mappings = currentMappings;
    if (mappings.length === 0) {
      setGeneratedSql('-- No mappings available to generate SQL');
      return;
    }

    // Get default datatype mappings based on script types
    const datatypeMappings = sqlIncludeDatatype
      ? getDefaultDatatypeMappings(
          sqlAlignDirection === 'toSource' ? targetScript.type : sourceScript.type,
          sqlAlignDirection === 'toSource' ? sourceScript.type : targetScript.type
        )
      : [];

    const sql = generateAlignmentSql(
      mappings,
      sourceScript,
      targetScript,
      sqlAlignDirection,
      sqlIncludeNullable,
      sqlIncludeDatatype,
      datatypeMappings
    );

    setGeneratedSql(sql);
  }, [sourceScript, targetScript, project, currentMappings, sqlAlignDirection, sqlIncludeNullable, sqlIncludeDatatype]);

  // Copy SQL to clipboard
  const handleCopySql = useCallback(() => {
    navigator.clipboard.writeText(generatedSql);
  }, [generatedSql]);

  // Download SQL as file
  const handleDownloadSql = useCallback(() => {
    const blob = new Blob([generatedSql], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `alignment_${sqlAlignDirection}_${new Date().toISOString().split('T')[0]}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generatedSql, sqlAlignDirection]);

  // Generate SQL for a single column mapping
  const handleGenerateSingleColumnSql = useCallback((mapping: ColumnMapping, direction: 'toSource' | 'toTarget') => {
    if (!sourceScript || !targetScript) return '';

    // Get default datatype mappings
    const datatypeMappings = getDefaultDatatypeMappings(
      direction === 'toSource' ? targetScript.type : sourceScript.type,
      direction === 'toSource' ? sourceScript.type : targetScript.type
    );

    const sql = generateAlignmentSql(
      [mapping], // Single mapping
      sourceScript,
      targetScript,
      direction,
      true, // include nullable
      true, // include datatype
      datatypeMappings
    );

    return sql;
  }, [sourceScript, targetScript]);

  // Generate SQL for multiple selected mappings
  const handleGenerateMultipleColumnsSql = useCallback((mappingIds: Set<string>, direction: 'toSource' | 'toTarget') => {
    if (!sourceScript || !targetScript || mappingIds.size === 0) return '';

    // Get all selected mappings
    const selectedMappings = currentMappings.filter(m => mappingIds.has(m.id));

    if (selectedMappings.length === 0) return '';

    // Get default datatype mappings
    const datatypeMappings = getDefaultDatatypeMappings(
      direction === 'toSource' ? targetScript.type : sourceScript.type,
      direction === 'toSource' ? sourceScript.type : targetScript.type
    );

    const sql = generateAlignmentSql(
      selectedMappings,
      sourceScript,
      targetScript,
      direction,
      true, // include nullable
      true, // include datatype
      datatypeMappings
    );

    return sql;
  }, [sourceScript, targetScript, currentMappings]);

  // Handle row click with multi-select support
  const handleLinkageRowClick = useCallback((e: React.MouseEvent, mapping: ColumnMapping, index: number) => {
    if (e.shiftKey && lastClickedIndex !== null) {
      // Shift+click: select range
      const start = Math.min(lastClickedIndex, index);
      const end = Math.max(lastClickedIndex, index);
      const newSelection = new Set(selectedMappingIds);

      for (let i = start; i <= end; i++) {
        const mappingAtIndex = currentMappings[i];
        if (mappingAtIndex) {
          newSelection.add(mappingAtIndex.id);
        }
      }

      setSelectedMappingIds(newSelection);
    } else if (e.ctrlKey || e.metaKey) {
      // Ctrl+click: toggle selection
      const newSelection = new Set(selectedMappingIds);
      if (newSelection.has(mapping.id)) {
        newSelection.delete(mapping.id);
      } else {
        newSelection.add(mapping.id);
      }
      setSelectedMappingIds(newSelection);
      setLastClickedIndex(index);
    } else {
      // Normal click: single select
      setSelectedMappingIds(new Set([mapping.id]));
      setSelectedMappingId(mapping.id);
      setLastClickedIndex(index);
    }
  }, [lastClickedIndex, selectedMappingIds, currentMappings]);

  // Handle context menu for linkage table
  const handleLinkageRowContextMenu = useCallback((e: React.MouseEvent, mapping: ColumnMapping) => {
    e.preventDefault();

    // If right-clicked row is not in selection, select only that row
    if (!selectedMappingIds.has(mapping.id)) {
      setSelectedMappingIds(new Set([mapping.id]));
    }

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      mapping
    });
  }, [selectedMappingIds]);

  // Close context menu
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  // Update column migration status
  const handleUpdateColumnMigration = useCallback((
    side: 'source' | 'target',
    tableName: string,
    columnName: string,
    migrationNeeded: boolean,
    nonMigrationComment?: string
  ) => {
    // Update the script with the new migration status
    const script = side === 'source' ? sourceScript : targetScript;
    if (!script) return;

    const updatedScript = {
      ...script,
      data: {
        ...script.data,
        targets: script.data.targets.map(table => {
          if (table.tableName === tableName) {
            return {
              ...table,
              columns: table.columns.map(col => {
                if (col.name === columnName) {
                  // Update migration status
                  let updatedCol = {
                    ...col,
                    migrationNeeded,
                    nonMigrationComment: migrationNeeded ? undefined : nonMigrationComment,
                  };

                  // Update mapping field in data dictionary
                  if (!migrationNeeded && nonMigrationComment) {
                    // For non-migrated columns, set mapping to "Not Mapped"
                    updatedCol.mapping = `Not Mapped<br>${nonMigrationComment}`;
                  } else if (migrationNeeded) {
                    // For migrated columns without a mapping yet, clear the "Not Mapped" text
                    if (col.mapping && col.mapping.startsWith('Not Mapped')) {
                      updatedCol.mapping = '';
                    }
                  }

                  return updatedCol;
                }
                return col;
              }),
            };
          }
          return table;
        }),
      },
      updatedAt: Date.now(),
    };

    // Update all scripts with the modified one
    const allScripts = loadScripts();
    const updatedScripts = allScripts.map((s: Script) => s.id === updatedScript.id ? updatedScript : s);
    saveScripts(updatedScripts);

    // Update local scripts state immediately so UI reflects changes
    setScripts(updatedScripts);

    // Trigger storage event to refresh other components
    window.dispatchEvent(new Event('storage'));

    // Note: Don't update checkbox/textarea local state here - it's already been updated by the onChange/onBlur handlers
    // Updating it here can cause race conditions and override user input

    // Sync to data dictionary if there's an existing mapping for this column
    if (project && project.mappings) {
      const existingMapping = project.mappings.find(m =>
        (side === 'source' && m.sourceTable === tableName && m.sourceColumn === columnName) ||
        (side === 'target' && m.targetTable === tableName && m.targetColumn === columnName)
      );
      if (existingMapping) {
        syncMappingToDataDictionary(existingMapping);
      }
    }
  }, [sourceScript, targetScript, project, syncMappingToDataDictionary]);

  // Render table node
  const renderTable = useCallback((node: TableNode) => {
    const { table, x, y, width, side, colorIndex } = node;
    const color = TABLE_COLORS[colorIndex];
    const isDropTarget = dragState.isDragging && dragState.startType !== side;

    // Get mapped columns with their colors, mapping IDs, and connected table info
    const mappedColsWithColors = new Map<string, {
      colorIndex: number;
      color: typeof TABLE_COLORS[0];
      mappingId: string;
      connectedTable: string;
      isCurrentConnection: boolean;
    }>();

    // Get ALL mappings involving this table, not just current selection
    const allProjectMappings = project?.mappings || [];
    allProjectMappings
      .filter(m => side === 'source'
        ? m.sourceTable === table.tableName
        : m.targetTable === table.tableName
      )
      .forEach(m => {
        const colName = side === 'source' ? m.sourceColumn : m.targetColumn;
        const connectedTable = side === 'source' ? m.targetTable : m.sourceTable;
        const mappingColorIndex = getMappingColorIndex(m);

        // Check if this is the currently active connection (both tables selected)
        const isCurrentConnection = side === 'source'
          ? (m.targetTable === targetTableName)
          : (m.sourceTable === sourceTableName);

        mappedColsWithColors.set(colName, {
          colorIndex: mappingColorIndex,
          color: TABLE_COLORS[mappingColorIndex],
          mappingId: m.id,
          connectedTable: connectedTable,
          isCurrentConnection: isCurrentConnection
        });
      });

    // Get column with active search popup
    const isPopupTable = columnSearchPopup?.tableName === table.tableName && columnSearchPopup?.side === side;

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
          const hasPopupOpen = isPopupTable && columnSearchPopup?.columnName === col.name;
          const isBeingDragged = dragState.isDragging &&
            dragState.startType === side &&
            dragState.startNodeId === table.tableName &&
            dragState.startColumn === col.name;
          const isHovered = hoveredRow?.table === table.tableName &&
                           hoveredRow?.column === col.name &&
                           hoveredRow?.side === side;
          const isValidDropTarget = isDropTarget && isHovered;
          const isSelected = selectedMappingId && mappingInfo?.mappingId === selectedMappingId;
          const migrationNotNeeded = col.migrationNeeded === false;

          return (
            <Group key={col.name} y={colY}>
              {/* Clickable row area */}
              <Rect
                x={0}
                width={width}
                height={SIZING.COLUMN_HEIGHT}
                fill={
                  migrationNotNeeded ? 'transparent' :
                  hasPopupOpen ? (side === 'source' ? '#3b82f6' : '#22c55e') :
                  isBeingDragged ? (side === 'source' ? '#3b82f6' : '#22c55e') :
                  isValidDropTarget ? '#22c55e' :
                  isSelected ? (isDarkTheme ? '#808080' : mappingColor.regular) :
                  isMapped ? (isDarkTheme ? '#808080' : mappingColor.lighter) :
                  'transparent'
                }
                opacity={hasPopupOpen || isBeingDragged || isValidDropTarget ? 0.4 : isSelected ? (isDarkTheme ? 0.1 : 0.6) : isMapped ? (isDarkTheme ? 0.1 : 0.5) : 1}
                stroke={isSelected ? mappingColor.regular : undefined}
                strokeWidth={isSelected ? 2 : 0}
                onMouseDown={(e) => handleDragStart(side, table.tableName, col.name, e)}
                onTouchStart={(e) => handleDragStart(side, table.tableName, col.name, e)}
                onClick={() => {
                  // Only handle as click if mouse hasn't moved (i.e., not a drag)
                  if (!dragState.hasMoved) {
                    // If column is mapped, select the mapping
                    if (mappingInfo?.mappingId) {
                      setSelectedMappingId(mappingInfo.mappingId);
                    } else {
                      // Get click position in screen coordinates for popup positioning
                      const stage = stageRef.current;
                      let clickX = 200, clickY = 200;
                      if (stage) {
                        const pos = stage.getPointerPosition();
                        const container = stage.container();
                        const rect = container.getBoundingClientRect();
                        if (pos) {
                          // Convert canvas coordinates to screen coordinates
                          clickX = pos.x + rect.left;
                          clickY = pos.y + rect.top;
                        }
                      }
                      handleColumnClick(side, table.tableName, col.name, clickX, clickY);
                    }
                  }
                  // Reset drag state after click
                  setDragState({
                    isDragging: false,
                    hasMoved: false,
                    startNodeId: null,
                    startColumn: null,
                    startType: null,
                    currentX: 0,
                    currentY: 0,
                  });
                }}
                onContextMenu={(e) => {
                  e.evt.preventDefault();
                  // Get all mappings for this column across all schemas
                  const allProjects = loadMappingProjects();
                  const allMappingsRaw = allProjects.flatMap(proj => proj.mappings).filter(m =>
                    (side === 'source' && m.sourceTable === table.tableName && m.sourceColumn === col.name) ||
                    (side === 'target' && m.targetTable === table.tableName && m.targetColumn === col.name)
                  );

                  // Deduplicate mappings by ID
                  const allMappings = Array.from(
                    new Map(allMappingsRaw.map(m => [m.id, m])).values()
                  );

                  if (allMappings.length > 0) {
                    const stage = stageRef.current;
                    let clickX = 200, clickY = 200;
                    if (stage) {
                      const pos = stage.getPointerPosition();
                      const container = stage.container();
                      const rect = container.getBoundingClientRect();
                      if (pos) {
                        // Convert canvas coordinates to screen coordinates
                        clickX = pos.x + rect.left;
                        clickY = pos.y + rect.top;
                      }
                    }
                    setAllMappedTablesPopup({
                      side,
                      tableName: table.tableName,
                      columnName: col.name,
                      mappings: allMappings,
                      x: clickX,
                      y: clickY,
                    });
                  }
                }}
                onDblClick={() => {
                  // Double-click on mapped column jumps to linkage tab
                  if (mappingInfo?.mappingId) {
                    setSelectedMappingId(mappingInfo.mappingId);
                    setActiveTab('linkage');
                  }
                }}
                onDblTap={() => {
                  // Double-tap on mapped column jumps to linkage tab (touch support)
                  if (mappingInfo?.mappingId) {
                    setSelectedMappingId(mappingInfo.mappingId);
                    setActiveTab('linkage');
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
                width={width - SIZING.PADDING - 12}
                fontSize={FONTS.SIZE_SM}
                fontFamily={FONTS.FAMILY}
                fontStyle={isMapped || hasPopupOpen ? 'bold' : 'normal'}
                fill={migrationNotNeeded ? '#666666' : hasPopupOpen ? (side === 'source' ? '#3b82f6' : '#22c55e') : isMapped ? mappingColor.regular : theme.text.primary}
                wrap="none"
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
                fill={migrationNotNeeded ? '#666666' : theme.text.secondary}
                wrap="none"
                align="right"
                listening={false}
              />
            </Group>
          );
        })}
      </Group>
    );
  }, [theme, currentMappings, dragState, hoveredRow, columnSearchPopup, selectedMappingId, handleDragStart, handleDragEnd, handleColumnClick]);

  // Pre-compute edge data for better performance
  // Use visibleMappings (not currentMappings) because canvas can only render edges between visible tables
  const edgeData = useMemo(() => {
    if (!sourceNode || !targetNode) return [];

    return visibleMappings.map(mapping => {
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
  }, [sourceNode, targetNode, visibleMappings, getColumnY]);

  // Handle double-click on mapping to jump to linkage tab
  const handleMappingDoubleClick = useCallback((mappingId: string) => {
    setSelectedMappingId(mappingId);
    setActiveTab('linkage');
  }, []);

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
          {/* Invisible wider path for easier clicking */}
          <Path
            data={edge.pathData}
            stroke="transparent"
            strokeWidth={12}
            lineCap="round"
            onClick={() => setSelectedMappingId(edge.id)}
            onTap={() => setSelectedMappingId(edge.id)}
            onDblClick={() => handleMappingDoubleClick(edge.id)}
            onDblTap={() => handleMappingDoubleClick(edge.id)}
          />
          <Path
            data={edge.pathData}
            stroke={edge.lineColor}
            strokeWidth={isSelected ? 3 : 2}
            lineCap="round"
            opacity={0.8}
            listening={false}
          />
        </Group>
      );
    });
  }, [edgeData, selectedMappingId, handleMappingDoubleClick]);

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

  // Helper function to check if a type mapping is allowed by a type rule
  const isTypeMatchedByRule = (sourceType: string, targetType: string, rules: TypeCompatibilityRule[]): boolean => {
    if (!rules || rules.length === 0) return false;

    // Extract base types (without precision/scale) for comparison
    const sourceBase = getBaseDatatype(sourceType);
    const targetBase = getBaseDatatype(targetType);

    // Check if there's an enabled rule that matches this base type pair
    return rules.some(rule => {
      if (!rule.enabled) return false;

      // Compare base types only (case-insensitive)
      const ruleSourceBase = rule.sourcePattern.trim().toUpperCase();
      const ruleTargetBase = rule.targetPattern.trim().toUpperCase();

      return ruleSourceBase === sourceBase && ruleTargetBase === targetBase;
    });
  };

  // Render linkage table
  const renderLinkageTable = () => {
    if (!currentMappings || currentMappings.length === 0) {
      return (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: theme.canvas.background,
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: theme.text.secondary,
            padding: '16px',
          }}>
            <ArrowRightLeft size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>No mappings yet</div>
            <div style={{ fontSize: '13px', opacity: 0.7 }}>
              Click columns in the canvas to create mappings
            </div>
          </div>
        </div>
      );
    }

    // Group mappings by table pairs (source table -> target table)
    const tablePairGroups = new Map<string, ColumnMapping[]>();

    currentMappings.forEach(mapping => {
      if (!mapping || !mapping.sourceTable || !mapping.targetTable) {
        console.warn('Skipping invalid mapping:', mapping);
        return;
      }
      const pairKey = `${mapping.sourceTable}→${mapping.targetTable}`;
      if (!tablePairGroups.has(pairKey)) {
        tablePairGroups.set(pairKey, []);
      }
      tablePairGroups.get(pairKey)!.push(mapping);
    });

    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: theme.canvas.background,
        overflow: 'hidden',
      }}>
        <div style={{
          flex: 1,
          overflow: 'auto',
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
            tableLayout: 'fixed',
          }}>
          <colgroup>
            <col style={{ width: '18%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '5%' }} />
            <col style={{ width: '40px' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '5%' }} />
            <col style={{ width: '50px' }} />
            <col style={{ width: 'auto' }} />
            <col style={{ width: '50px' }} />
          </colgroup>
          <thead>
            <tr style={{
              background: theme.table.headerBackground,
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#3b82f6' }}>Source Column</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>Null</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}></th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, color: '#22c55e' }}>Target Column</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>Type</th>
              <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }}>Null</th>
              <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600 }} title="Validation Status">⚠</th>
              <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600 }}>Remarks</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>
            {Array.from(tablePairGroups.entries()).map(([pairKey, mappings]) => {
              const [pairSourceTableName, pairTargetTableName] = pairKey.split('→');
              const isExpanded = expandedLinkageTablePairs.has(pairKey);

              return (
                <Fragment key={pairKey}>
                  {/* Table pair header row */}
                  <tr
                    onClick={() => {
                      const newExpanded = new Set(expandedLinkageTablePairs);
                      if (isExpanded) {
                        newExpanded.delete(pairKey);
                      } else {
                        newExpanded.add(pairKey);
                      }
                      setExpandedLinkageTablePairs(newExpanded);
                    }}
                    style={{
                      background: theme.table.headerBackground,
                      cursor: 'pointer',
                      borderTop: `2px solid ${theme.table.border}`,
                      borderBottom: `1px solid ${theme.table.border}`,
                    }}
                  >
                    <td colSpan={10} style={{ padding: '8px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        <span style={{ color: '#3b82f6' }}>{pairSourceTableName}</span>
                        <span style={{ color: theme.text.secondary }}>→</span>
                        <span style={{ color: '#22c55e' }}>{pairTargetTableName}</span>
                        <span style={{
                          marginLeft: 'auto',
                          fontSize: '12px',
                          color: theme.text.secondary,
                          fontWeight: 400,
                        }}>
                          {mappings.length} {mappings.length === 1 ? 'mapping' : 'mappings'}
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Column mapping rows (only shown when expanded) */}
                  {isExpanded && mappings.map((mapping, i) => {
              const colorIndex = getMappingColorIndex(mapping);
              const lineColor = LINE_COLORS[colorIndex];
              const isSelected = selectedMappingId === mapping.id;

              // Get source and target tables - search both sources and targets arrays (like All Mappings tab)
              const allSourceTables = (sourceScript?.data?.sources || []).concat(sourceScript?.data?.targets || []);
              const allTargetTables = (targetScript?.data?.sources || []).concat(targetScript?.data?.targets || []);

              let mappingSourceTable = allSourceTables.find(t => t.tableName === mapping.sourceTable);
              let mappingTargetTable = allTargetTables.find(t => t.tableName === mapping.targetTable);

              // If not found in target script, search all scripts (for ISS schema tables etc)
              if (!mappingTargetTable && scripts) {
                for (const script of scripts) {
                  const allTables = (script?.data?.sources || []).concat(script?.data?.targets || []);
                  const found = allTables.find(t => t.tableName === mapping.targetTable);
                  if (found) {
                    mappingTargetTable = found;
                    break;
                  }
                }
              }

              // Also search all scripts for source table if not found
              if (!mappingSourceTable && scripts) {
                for (const script of scripts) {
                  const allTables = (script?.data?.sources || []).concat(script?.data?.targets || []);
                  const found = allTables.find(t => t.tableName === mapping.sourceTable);
                  if (found) {
                    mappingSourceTable = found;
                    break;
                  }
                }
              }

              // Get nullable values from source and target columns
              const sourceCol = mappingSourceTable?.columns?.find(c => c.name === mapping.sourceColumn);
              const targetCol = mappingTargetTable?.columns?.find(c => c.name === mapping.targetColumn);
              const sourceNullable = sourceCol?.nullable ? (sourceCol.nullable.toUpperCase() === 'YES' || sourceCol.nullable.toUpperCase() === 'Y' ? 'NULL' : 'NOT NULL') : '';
              const targetNullable = targetCol?.nullable ? (targetCol.nullable.toUpperCase() === 'YES' || targetCol.nullable.toUpperCase() === 'Y' ? 'NULL' : 'NOT NULL') : '';

              // Use actual column types instead of stored mapping types (in case mapping data is stale)
              const displaySourceType = sourceCol?.type || mapping.sourceType;
              const displayTargetType = targetCol?.type || mapping.targetType;

              // Check if this is a cross-schema mapping
              const isCrossSchemaSource = mapping.sourceTable !== sourceTableName;
              const isCrossSchemaTarget = mapping.targetTable !== targetTableName;

              const isMultiSelected = selectedMappingIds.has(mapping.id);

              // Detect mismatches for highlighting
              // Check if types don't match, but ALSO check if there's a type rule that allows this mapping
              const typesAreDifferent = displaySourceType && displayTargetType &&
                displaySourceType.trim().toLowerCase() !== displayTargetType.trim().toLowerCase();

              const isAllowedByTypeRule = displaySourceType && displayTargetType && activeTypeRuleSet?.rules
                ? isTypeMatchedByRule(displaySourceType, displayTargetType, activeTypeRuleSet.rules)
                : false;

              // Only flag as mismatch if types are different AND not allowed by a rule
              const hasTypeMismatch = typesAreDifferent && !isAllowedByTypeRule;

              const hasNullableMismatch = sourceNullable && targetNullable && sourceNullable !== targetNullable;

              return (
                <tr
                  key={mapping.id}
                  onClick={(e) => handleLinkageRowClick(e, mapping, i)}
                  onContextMenu={(e) => handleLinkageRowContextMenu(e, mapping)}
                  style={{
                    background: isMultiSelected
                      ? theme.accent.primary + '30'
                      : isSelected
                      ? theme.accent.primary + '20'
                      : theme.table.background,
                    cursor: 'pointer',
                    borderBottom: `1px solid ${theme.table.border}`,
                  }}
                >
                  <td style={{ padding: '10px 12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: lineColor,
                        flexShrink: 0,
                      }} />
                      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <span style={{ color: theme.text.primary, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {mapping.sourceColumn}
                        </span>
                        {isCrossSchemaSource && (
                          <span style={{ fontSize: '11px', color: theme.text.secondary, fontStyle: 'italic' }}>
                            {mapping.sourceTable}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{
                    padding: '10px 8px',
                    color: hasTypeMismatch ? '#f59e0b' : theme.text.secondary,
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: hasTypeMismatch ? 600 : 400,
                  }} title={hasTypeMismatch ? `Type mismatch: ${displaySourceType} ≠ ${displayTargetType}` : displaySourceType}>
                    {displaySourceType}
                  </td>
                  <td style={{
                    padding: '10px 6px',
                    textAlign: 'center',
                    color: hasNullableMismatch ? '#f59e0b' : theme.text.secondary,
                    fontSize: '11px',
                    fontWeight: hasNullableMismatch ? 600 : 400,
                  }} title={hasNullableMismatch ? `Nullable mismatch: ${sourceNullable} ≠ ${targetNullable}` : sourceNullable}>
                    {sourceNullable}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', color: theme.text.secondary }}>
                    →
                  </td>
                  <td style={{ padding: '10px 12px', color: theme.text.primary, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {mapping.targetColumn}
                      </span>
                      {isCrossSchemaTarget && (
                        <span style={{ fontSize: '11px', color: theme.text.secondary, fontStyle: 'italic' }}>
                          {mapping.targetTable}
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{
                    padding: '10px 8px',
                    color: hasTypeMismatch ? '#f59e0b' : theme.text.secondary,
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: hasTypeMismatch ? 600 : 400,
                  }} title={hasTypeMismatch ? `Type mismatch: ${displaySourceType} ≠ ${displayTargetType}` : displayTargetType}>
                    {displayTargetType}
                  </td>
                  <td style={{
                    padding: '10px 6px',
                    textAlign: 'center',
                    color: hasNullableMismatch ? '#f59e0b' : theme.text.secondary,
                    fontSize: '11px',
                    fontWeight: hasNullableMismatch ? 600 : 400,
                  }} title={hasNullableMismatch ? `Nullable mismatch: ${sourceNullable} ≠ ${targetNullable}` : targetNullable}>
                    {targetNullable}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    {mapping.validation?.errors?.length > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#ef4444' }} title={mapping.validation.errors.join('\n')}>
                        <AlertCircle size={16} />
                      </div>
                    ) : mapping.validation?.warnings?.length > 0 ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#f59e0b' }} title={mapping.validation.warnings.join('\n')}>
                        <AlertTriangle size={16} />
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#22c55e' }} title="No validation issues">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '10px 12px', overflow: 'hidden', minWidth: '150px' }}>
                    {editingRemarkId === mapping.id ? (
                      <textarea
                        value={editingRemarkValue}
                        onChange={(e) => setEditingRemarkValue(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onBlur={() => {
                          handleUpdateRemarks(mapping.id, editingRemarkValue);
                          setEditingRemarkId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.shiftKey) {
                            // Allow Shift+Enter for new line
                            return;
                          } else if (e.key === 'Enter') {
                            e.preventDefault();
                            handleUpdateRemarks(mapping.id, editingRemarkValue);
                            setEditingRemarkId(null);
                          } else if (e.key === 'Escape') {
                            setEditingRemarkId(null);
                            setEditingRemarkValue(mapping.remarks || '');
                          }
                        }}
                        autoFocus
                        style={{
                          width: '100%',
                          minHeight: '60px',
                          padding: '4px 8px',
                          border: `1px solid ${theme.table.border}`,
                          borderRadius: '4px',
                          background: 'transparent',
                          color: theme.text.primary,
                          fontSize: '12px',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          outline: 'none',
                        }}
                      />
                    ) : (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingRemarkId(mapping.id);
                          setEditingRemarkValue(mapping.remarks || '');
                        }}
                        style={{
                          color: mapping.remarks ? theme.text.primary : theme.text.secondary,
                          fontStyle: mapping.remarks ? 'normal' : 'italic',
                          cursor: 'text',
                          display: 'block',
                          overflow: 'auto',
                          maxHeight: '100px',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {mapping.remarks || 'Click to add...'}
                      </div>
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
                </Fragment>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    );
  };

  // Render all mappings summary table - grouped by target table, then by source table
  const renderSummaryTable = () => {
    const allMappings = project?.mappings || [];

    // Group mappings by target table, then by source table within each target
    const groupedByTarget = new Map<string, Map<string, ColumnMapping[]>>();

    allMappings.forEach(mapping => {
      if (!groupedByTarget.has(mapping.targetTable)) {
        groupedByTarget.set(mapping.targetTable, new Map());
      }
      const sourceMap = groupedByTarget.get(mapping.targetTable)!;
      if (!sourceMap.has(mapping.sourceTable)) {
        sourceMap.set(mapping.sourceTable, []);
      }
      sourceMap.get(mapping.sourceTable)!.push(mapping);
    });

    // Sort mappings within each group by source column order in DDL
    if (sourceScript) {
      const sourceTableMap = new Map<string, Table>();
      sourceScript.data.targets.forEach(table => {
        sourceTableMap.set(table.tableName, table);
      });

      groupedByTarget.forEach((sourceMap) => {
        sourceMap.forEach((mappings, sourceTableName) => {
          const sourceTable = sourceTableMap.get(sourceTableName);
          if (sourceTable) {
            mappings.sort((a, b) => {
              const indexA = sourceTable.columns.findIndex(c => c.name === a.sourceColumn);
              const indexB = sourceTable.columns.findIndex(c => c.name === b.sourceColumn);
              return indexA - indexB;
            });
          }
        });
      });
    }

    return (
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '16px',
        background: theme.canvas.background,
      }}>
        {allMappings.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: theme.text.secondary,
          }}>
            <Layers size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>No mappings in project</div>
            <div style={{ fontSize: '13px', opacity: 0.7 }}>
              Create mappings in the canvas to see them here
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {Array.from(groupedByTarget.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([targetTable, sourceMap]) => {
              const isExpanded = expandedTargetTables.has(targetTable);

              return (
                <div key={targetTable} style={{
                  background: theme.table.background,
                  borderRadius: '8px',
                  border: `1px solid ${theme.table.border}`,
                  overflow: 'hidden',
                }}>
                  {/* Target Table Header - Clickable */}
                  <div
                    onClick={() => {
                      const newExpanded = new Set(expandedTargetTables);
                      if (isExpanded) {
                        newExpanded.delete(targetTable);
                      } else {
                        newExpanded.add(targetTable);
                      }
                      setExpandedTargetTables(newExpanded);
                    }}
                    style={{
                      padding: '12px 16px',
                      background: theme.table.headerBackground,
                      borderBottom: isExpanded ? `1px solid ${theme.table.border}` : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.canvas.grid;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = theme.table.headerBackground;
                    }}
                  >
                    {isExpanded ? <ChevronDown size={16} color={theme.text.secondary} /> : <ChevronRight size={16} color={theme.text.secondary} />}
                    <span style={{
                      background: '#22c55e',
                      color: '#fff',
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontWeight: 600,
                    }}>TGT</span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: theme.text.primary,
                    }}>{targetTable}</span>
                    <span style={{
                      fontSize: '12px',
                      color: theme.text.secondary,
                      marginLeft: 'auto',
                    }}>
                      {Array.from(sourceMap.values()).flat().length} mapping{Array.from(sourceMap.values()).flat().length !== 1 ? 's' : ''}
                    </span>
                  </div>

                {/* Source tables within this target - only show if expanded */}
                {isExpanded && Array.from(sourceMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([sourceTable, mappings]) => (
                  <div key={sourceTable}>
                    {/* Source Table Sub-header */}
                    <div style={{
                      padding: '8px 16px 8px 32px',
                      background: theme.canvas.grid,
                      borderBottom: `1px solid ${theme.table.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <span style={{
                        background: '#3b82f6',
                        color: '#fff',
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontWeight: 600,
                      }}>SRC</span>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: theme.text.primary,
                      }}>{sourceTable}</span>
                      <span style={{
                        fontSize: '11px',
                        color: theme.text.secondary,
                        marginLeft: 'auto',
                      }}>
                        {mappings.length} column{mappings.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Mappings table for this source */}
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '13px',
                      tableLayout: 'auto',
                    }}>
                      <colgroup>
                        <col style={{ width: '14%' }} />
                        <col style={{ width: '12%' }} />
                        <col style={{ width: '5%' }} />
                        <col style={{ width: '40px' }} />
                        <col style={{ width: '14%' }} />
                        <col style={{ width: '12%' }} />
                        <col style={{ width: '5%' }} />
                        <col style={{ width: '40px' }} />
                        <col style={{ width: 'auto' }} />
                        <col style={{ width: '80px' }} />
                      </colgroup>
                      <tbody>
                        {mappings.map(mapping => {
                          const colorIndex = getMappingColorIndex(mapping);
                          const lineColor = LINE_COLORS[colorIndex];
                          const isSelected = selectedMappingId === mapping.id;

                          // Get nullable values from scripts
                          const srcScript = (sourceScript?.data?.sources || []).concat(sourceScript?.data?.targets || []);
                          const tgtScript = (targetScript?.data?.sources || []).concat(targetScript?.data?.targets || []);
                          const srcTable = srcScript?.find(t => t.tableName === mapping.sourceTable);
                          let tgtTable = tgtScript?.find(t => t.tableName === mapping.targetTable);

                          // If not found in target script, search all scripts (for ISS schema tables etc)
                          if (!tgtTable && scripts) {
                            for (const script of scripts) {
                              const allTables = (script?.data?.sources || []).concat(script?.data?.targets || []);
                              const found = allTables?.find(t => t.tableName === mapping.targetTable);
                              if (found) {
                                tgtTable = found;
                                break;
                              }
                            }
                          }

                          const sourceCol = srcTable?.columns?.find(c => c.name === mapping.sourceColumn);
                          const targetCol = tgtTable?.columns?.find(c => c.name === mapping.targetColumn);
                          const sourceNullable = sourceCol?.nullable ? (sourceCol.nullable.toUpperCase() === 'YES' || sourceCol.nullable.toUpperCase() === 'Y' ? 'NULL' : 'NOT NULL') : '';
                          const targetNullable = targetCol?.nullable ? (targetCol.nullable.toUpperCase() === 'YES' || targetCol.nullable.toUpperCase() === 'Y' ? 'NULL' : 'NOT NULL') : '';

                          // Use actual column types instead of stored mapping types (in case mapping data is stale)
                          const displaySourceType = sourceCol?.type || mapping.sourceType;
                          const displayTargetType = targetCol?.type || mapping.targetType;

                          return (
                            <tr
                              key={mapping.id}
                              onClick={() => setSelectedMappingId(mapping.id)}
                              style={{
                                background: isSelected
                                  ? theme.accent.primary + '30'
                                  : 'transparent',
                                cursor: 'pointer',
                                borderBottom: `1px solid ${theme.table.border}`,
                              }}
                            >
                              <td style={{ padding: '8px 16px 8px 48px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: lineColor,
                                    flexShrink: 0,
                                  }} />
                                  <span style={{ color: '#3b82f6', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {mapping.sourceColumn}
                                  </span>
                                </div>
                              </td>
                              <td style={{ padding: '8px 12px', color: theme.text.secondary, fontFamily: 'monospace', fontSize: '11px' }}>
                                {displaySourceType}
                              </td>
                              <td style={{ padding: '8px 12px', textAlign: 'center', color: theme.text.secondary, fontSize: '11px' }}>
                                {sourceNullable}
                              </td>
                              <td style={{ padding: '8px 12px', textAlign: 'center', color: theme.text.secondary }}>
                                →
                              </td>
                              <td style={{ padding: '8px 12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                <span style={{ color: '#22c55e', fontWeight: 500 }}>
                                  {mapping.targetColumn}
                                </span>
                              </td>
                              <td style={{ padding: '8px 12px', color: theme.text.secondary, fontFamily: 'monospace', fontSize: '11px' }}>
                                {displayTargetType}
                              </td>
                              <td style={{ padding: '8px 12px', textAlign: 'center', color: theme.text.secondary, fontSize: '11px' }}>
                                {targetNullable}
                              </td>
                              <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                                {mapping.validation?.errors?.length > 0 ? (
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#ef4444' }} title={mapping.validation.errors.join('\n')}>
                                    <AlertCircle size={14} />
                                  </div>
                                ) : mapping.validation?.warnings?.length > 0 ? (
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#f59e0b' }} title={mapping.validation.warnings.join('\n')}>
                                    <AlertTriangle size={14} />
                                  </div>
                                ) : (
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#22c55e' }} title="No validation issues">
                                    <CheckCircle2 size={14} />
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '8px 12px', overflow: 'hidden', minWidth: '150px' }}>
                                {editingRemarkId === mapping.id ? (
                                  <textarea
                                    value={editingRemarkValue}
                                    onChange={(e) => setEditingRemarkValue(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    onBlur={() => {
                                      handleUpdateRemarks(mapping.id, editingRemarkValue);
                                      setEditingRemarkId(null);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && e.shiftKey) {
                                        // Allow Shift+Enter for new line
                                        return;
                                      } else if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleUpdateRemarks(mapping.id, editingRemarkValue);
                                        setEditingRemarkId(null);
                                      } else if (e.key === 'Escape') {
                                        setEditingRemarkId(null);
                                        setEditingRemarkValue(mapping.remarks || '');
                                      }
                                    }}
                                    autoFocus
                                    style={{
                                      width: '100%',
                                      minHeight: '60px',
                                      padding: '4px 8px',
                                      border: `1px solid ${theme.table.border}`,
                                      borderRadius: '4px',
                                      background: 'transparent',
                                      color: theme.text.primary,
                                      fontSize: '12px',
                                      resize: 'vertical',
                                      fontFamily: 'inherit',
                                      outline: 'none',
                                    }}
                                  />
                                ) : (
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingRemarkId(mapping.id);
                                      setEditingRemarkValue(mapping.remarks || '');
                                    }}
                                    style={{
                                      color: mapping.remarks ? theme.text.primary : theme.text.secondary,
                                      fontStyle: mapping.remarks ? 'normal' : 'italic',
                                      fontSize: '12px',
                                      cursor: 'text',
                                      display: 'block',
                                      overflow: 'auto',
                                      maxHeight: '100px',
                                      whiteSpace: 'pre-wrap',
                                      wordBreak: 'break-word',
                                    }}
                                  >
                                    {mapping.remarks || 'Click to add...'}
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Switch to canvas tab and set the tables from this mapping
                                      // Update script selections to match the mapping's source and target
                                      setSourceScriptId(mapping.sourceScriptId);
                                      setTargetScriptId(mapping.targetScriptId);
                                      setActiveTab('canvas');
                                      setSourceTableName(mapping.sourceTable);
                                      setTargetTableName(mapping.targetTable);
                                      setSelectedMappingId(mapping.id);
                                    }}
                                    style={{
                                      padding: '4px',
                                      background: 'transparent',
                                      border: 'none',
                                      cursor: 'pointer',
                                      opacity: 0.6,
                                    }}
                                    title="Jump to canvas with this mapping"
                                  >
                                    <ExternalLink size={14} color={theme.accent.primary} />
                                  </button>
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
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            );
          })}
          </div>
        )}
      </div>
    );
  };

  // Render dropdown
  const renderDropdown = (
    _label: string,
    value: string | null,
    placeholder: string,
    options: { id: string; name: string }[],
    isOpen: boolean,
    setIsOpen: (open: boolean) => void,
    onChange: (id: string | null) => void,
    color: string,
    searchTerm?: string,
    setSearchTerm?: (term: string) => void
  ) => {
    // Calculate dynamic width based on longest option name
    const longestName = options.reduce((longest, opt) =>
      opt.name.length > longest.length ? opt.name : longest,
      placeholder
    );
    // Approximate width: 8px per character + padding + icon space
    const dynamicWidth = Math.max(180, longestName.length * 8 + 60);

    // Filter options by search term if provided
    const filteredOptions = searchTerm && setSearchTerm
      ? options.filter(opt => opt.name.toLowerCase().includes(searchTerm.toLowerCase()))
      : options;

    return (
      <div className="mapper-dropdown" style={{ position: 'relative' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Close all other dropdowns first
            if (!isOpen) {
              setSourceScriptDropdownOpen(false);
              setTargetScriptDropdownOpen(false);
              setSourceTableDropdownOpen(false);
              setTargetTableDropdownOpen(false);
            }
            setIsOpen(!isOpen);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: theme.table.headerBackground,
            border: `1px solid ${theme.table.border}`,
            borderRadius: '6px',
            cursor: 'pointer',
            minWidth: `${dynamicWidth}px`,
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
          background: theme.table.background,
          border: `1px solid ${theme.table.border}`,
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 100,
          maxHeight: '300px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Search input for table dropdowns */}
          {searchTerm !== undefined && setSearchTerm && (
            <div style={{ padding: '8px', borderBottom: `1px solid ${theme.table.border}` }}>
              <input
                type="text"
                placeholder="Search tables..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  fontSize: '13px',
                  border: `1px solid ${theme.table.border}`,
                  borderRadius: '4px',
                  background: theme.canvas.background,
                  color: theme.text.primary,
                  outline: 'none',
                }}
              />
            </div>
          )}
          <div style={{ maxHeight: '250px', overflow: 'auto' }}>
            {filteredOptions.length === 0 ? (
              <div style={{ padding: '12px', color: theme.text.secondary, fontSize: '13px' }}>
                {searchTerm ? 'No matching tables' : 'No options available'}
              </div>
            ) : (
              filteredOptions.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                    if (setSearchTerm) setSearchTerm('');
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 12px',
                    background: value === opt.name ? theme.table.headerBackground : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: theme.text.primary,
                    fontSize: '13px',
                  }}
                  onMouseEnter={(e) => {
                    if (value !== opt.name) {
                      e.currentTarget.style.background = theme.canvas.background;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (value !== opt.name) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {opt.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
    );
  };

  // Helper function to extract base datatype (without precision/scale)
  const getBaseDatatype = (typeStr: string): string => {
    // Remove everything after the first opening parenthesis to get base type
    // e.g., "VARCHAR2(100)" -> "VARCHAR2", "NUMBER(10,2)" -> "NUMBER"
    const normalized = typeStr.trim().toUpperCase();
    const parenIndex = normalized.indexOf('(');
    return parenIndex > 0 ? normalized.substring(0, parenIndex) : normalized;
  };

  // Helper function to extract all unique BASE datatypes from schemas
  const extractUniqueDatatypes = (sourceScr: Script | null, targetScr: Script | null): { sourceTypes: string[]; targetTypes: string[] } => {
    const sourceTypes = new Set<string>();
    const targetTypes = new Set<string>();

    // Extract from source script
    if (sourceScr) {
      const tables = [...(sourceScr.data.sources || []), ...(sourceScr.data.targets || [])];
      tables.forEach(table => {
        table.columns.forEach(col => {
          if (col.type && col.type.trim()) {
            const baseType = getBaseDatatype(col.type);
            sourceTypes.add(baseType);
          }
        });
      });
    }

    // Extract from target script
    if (targetScr) {
      const tables = [...(targetScr.data.sources || []), ...(targetScr.data.targets || [])];
      tables.forEach(table => {
        table.columns.forEach(col => {
          if (col.type && col.type.trim()) {
            const baseType = getBaseDatatype(col.type);
            targetTypes.add(baseType);
          }
        });
      });
    }

    return {
      sourceTypes: Array.from(sourceTypes).sort(),
      targetTypes: Array.from(targetTypes).sort(),
    };
  };

  // Render Type Rules tab
  const renderRulesTab = () => {
    if (!project || !activeTypeRuleSet) return null;

    const projectRules = activeTypeRuleSet.rules || [];

    // Extract unique datatypes from both source and target scripts
    const { sourceTypes, targetTypes } = extractUniqueDatatypes(sourceScript, targetScript);

    return (
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '16px',
        background: theme.canvas.background,
      }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: theme.text.primary }}>Type Compatibility Rules</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: theme.text.secondary }}>
              Define custom datatype mapping rules for {sourceScript?.type?.toUpperCase()} → {targetScript?.type?.toUpperCase()}
            </p>
          </div>
          <button
            onClick={() => {
              // Add new empty rule to global type rule set
              const newRule = {
                id: generateId(),
                name: '',  // Name is auto-generated from source/target types
                sourcePattern: '',
                targetPattern: '',
                compatibility: 'compatible' as const,
                priority: projectRules.length,
                enabled: true,
              };
              const updatedRuleSet = {
                ...activeTypeRuleSet,
                rules: [...projectRules, newRule],
                updatedAt: Date.now(),
              };
              setActiveTypeRuleSet(updatedRuleSet);
              saveTypeRuleSet(updatedRuleSet);
            }}
            style={{
              padding: '8px 16px',
              background: '#22c55e',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Check size={14} />
            Add Rule
          </button>
        </div>

        {projectRules.length === 0 ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'calc(100% - 80px)',
            color: theme.text.secondary,
          }}>
            <Settings2 size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>No custom type rules</div>
            <div style={{ fontSize: '13px', opacity: 0.7, textAlign: 'center', maxWidth: '400px' }}>
              Add custom rules to define how datatypes should map between source and target databases
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
                background: theme.table.headerBackground,
                position: 'sticky',
                top: 0,
              }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, width: '25%', color: '#3b82f6' }}>Source Type</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, width: '25%', color: '#22c55e' }}>Target Type</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, width: '20%' }}>Compatibility</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontWeight: 600, width: '20%' }}>Conversion SQL</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600, width: '60px' }}>Enabled</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', width: '50px' }}></th>
              </tr>
            </thead>
            <tbody>
              {projectRules.map((rule, index) => (
                <tr
                  key={rule.id}
                  style={{
                    background: theme.table.background,
                    borderBottom: `1px solid ${theme.table.border}`,
                  }}
                >
                  <td style={{ padding: '10px 12px', position: 'relative' }}>
                    {/* Source Type Dropdown with Search */}
                    <div className="type-rule-dropdown" style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (typeRuleSourceDropdownOpen === rule.id) {
                            setTypeRuleSourceDropdownOpen(null);
                          } else {
                            setTypeRuleSourceDropdownOpen(rule.id);
                            setTypeRuleTargetDropdownOpen(null);
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '4px 8px',
                          border: `1px solid ${theme.table.border}`,
                          borderRadius: '4px',
                          background: theme.canvas.background,
                          color: theme.text.primary,
                          fontSize: '12px',
                          fontFamily: 'monospace',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span>{rule.sourcePattern || 'Select type...'}</span>
                        <ChevronDown size={14} />
                      </button>

                      {typeRuleSourceDropdownOpen === rule.id && (
                        <div
                          className="type-rule-dropdown"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            zIndex: 1000,
                            background: theme.canvas.background,
                            border: `1px solid ${theme.table.border}`,
                            borderRadius: '6px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            width: '250px',
                            maxHeight: '300px',
                            overflow: 'hidden',
                            marginTop: '4px',
                          }}>
                          <input
                            type="text"
                            placeholder="Search types..."
                            value={typeRuleSourceSearch[rule.id] || ''}
                            onChange={(e) => {
                              setTypeRuleSourceSearch({
                                ...typeRuleSourceSearch,
                                [rule.id]: e.target.value,
                              });
                            }}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: 'none',
                              borderBottom: `1px solid ${theme.table.border}`,
                              background: theme.canvas.background,
                              color: theme.text.primary,
                              fontSize: '12px',
                              outline: 'none',
                            }}
                            autoFocus
                          />
                          <div style={{ maxHeight: '250px', overflow: 'auto' }}>
                            {sourceTypes.length === 0 ? (
                              <div style={{ padding: '16px', textAlign: 'center', color: theme.text.secondary, fontSize: '12px' }}>
                                No datatypes found in source schema
                              </div>
                            ) : sourceTypes
                              .filter(type => {
                                const search = (typeRuleSourceSearch[rule.id] || '').toLowerCase();
                                return type.toLowerCase().includes(search);
                              })
                              .map(type => (
                                <button
                                  key={type}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const updated = [...projectRules];
                                    updated[index] = { ...rule, sourcePattern: type };
                                    const updatedRuleSet = {
                                      ...activeTypeRuleSet,
                                      rules: updated,
                                      updatedAt: Date.now(),
                                    };
                                    setActiveTypeRuleSet(updatedRuleSet);
                                    saveTypeRuleSet(updatedRuleSet);
                                    setTypeRuleSourceDropdownOpen(null);
                                    setTypeRuleSourceSearch({ ...typeRuleSourceSearch, [rule.id]: '' });
                                  }}
                                  style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: 'none',
                                    background: rule.sourcePattern === type ? theme.accent.primary + '20' : 'transparent',
                                    color: theme.text.primary,
                                    fontSize: '12px',
                                    fontFamily: 'monospace',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s',
                                  }}
                                  onMouseEnter={(e) => {
                                    if (rule.sourcePattern !== type) {
                                      e.currentTarget.style.background = theme.canvas.background;
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (rule.sourcePattern !== type) {
                                      e.currentTarget.style.background = 'transparent';
                                    }
                                  }}
                                >
                                  {type}
                                </button>
                              ))
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', position: 'relative' }}>
                    {/* Target Type Dropdown with Search */}
                    <div className="type-rule-dropdown" style={{ position: 'relative' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (typeRuleTargetDropdownOpen === rule.id) {
                            setTypeRuleTargetDropdownOpen(null);
                          } else {
                            setTypeRuleTargetDropdownOpen(rule.id);
                            setTypeRuleSourceDropdownOpen(null);
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '4px 8px',
                          border: `1px solid ${theme.table.border}`,
                          borderRadius: '4px',
                          background: theme.canvas.background,
                          color: theme.text.primary,
                          fontSize: '12px',
                          fontFamily: 'monospace',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span>{rule.targetPattern || 'Select type...'}</span>
                        <ChevronDown size={14} />
                      </button>

                      {typeRuleTargetDropdownOpen === rule.id && (
                        <div
                          className="type-rule-dropdown"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            zIndex: 1000,
                            background: theme.canvas.background,
                            border: `1px solid ${theme.table.border}`,
                            borderRadius: '6px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            width: '250px',
                            maxHeight: '300px',
                            overflow: 'hidden',
                            marginTop: '4px',
                          }}>
                          <input
                            type="text"
                            placeholder="Search types..."
                            value={typeRuleTargetSearch[rule.id] || ''}
                            onChange={(e) => {
                              setTypeRuleTargetSearch({
                                ...typeRuleTargetSearch,
                                [rule.id]: e.target.value,
                              });
                            }}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: 'none',
                              borderBottom: `1px solid ${theme.table.border}`,
                              background: theme.canvas.background,
                              color: theme.text.primary,
                              fontSize: '12px',
                              outline: 'none',
                            }}
                            autoFocus
                          />
                          <div style={{ maxHeight: '250px', overflow: 'auto' }}>
                            {targetTypes.length === 0 ? (
                              <div style={{ padding: '16px', textAlign: 'center', color: theme.text.secondary, fontSize: '12px' }}>
                                No datatypes found in target schema
                              </div>
                            ) : targetTypes
                              .filter(type => {
                                const search = (typeRuleTargetSearch[rule.id] || '').toLowerCase();
                                return type.toLowerCase().includes(search);
                              })
                              .map(type => (
                                <button
                                  key={type}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const updated = [...projectRules];
                                    updated[index] = { ...rule, targetPattern: type };
                                    const updatedRuleSet = {
                                      ...activeTypeRuleSet,
                                      rules: updated,
                                      updatedAt: Date.now(),
                                    };
                                    setActiveTypeRuleSet(updatedRuleSet);
                                    saveTypeRuleSet(updatedRuleSet);
                                    setTypeRuleTargetDropdownOpen(null);
                                    setTypeRuleTargetSearch({ ...typeRuleTargetSearch, [rule.id]: '' });
                                  }}
                                  style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: 'none',
                                    background: rule.targetPattern === type ? theme.accent.primary + '20' : 'transparent',
                                    color: theme.text.primary,
                                    fontSize: '12px',
                                    fontFamily: 'monospace',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    transition: 'background 0.15s',
                                  }}
                                  onMouseEnter={(e) => {
                                    if (rule.targetPattern !== type) {
                                      e.currentTarget.style.background = theme.canvas.background;
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (rule.targetPattern !== type) {
                                      e.currentTarget.style.background = 'transparent';
                                    }
                                  }}
                                >
                                  {type}
                                </button>
                              ))
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <select
                      value={rule.compatibility || 'compatible'}
                      onChange={(e) => {
                        const updated = [...projectRules];
                        updated[index] = { ...rule, compatibility: e.target.value as any };
                        const updatedRuleSet = {
                          ...activeTypeRuleSet,
                          rules: updated,
                          updatedAt: Date.now(),
                        };
                        setActiveTypeRuleSet(updatedRuleSet);
                        saveTypeRuleSet(updatedRuleSet);
                      }}
                      style={{
                        width: '100%',
                        padding: '4px 8px',
                        border: `1px solid ${theme.table.border}`,
                        borderRadius: '4px',
                        background: theme.canvas.background,
                        color: theme.text.primary,
                        fontSize: '12px',
                      }}
                    >
                      <option value="exact">Exact</option>
                      <option value="compatible">Compatible</option>
                      <option value="needs_conversion">Needs Conversion</option>
                      <option value="incompatible">Incompatible</option>
                    </select>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <input
                      type="text"
                      value={rule.conversionSql || ''}
                      onChange={(e) => {
                        const updated = [...projectRules];
                        updated[index] = { ...rule, conversionSql: e.target.value };
                        const updatedRuleSet = {
                          ...activeTypeRuleSet,
                          rules: updated,
                          updatedAt: Date.now(),
                        };
                        setActiveTypeRuleSet(updatedRuleSet);
                        saveTypeRuleSet(updatedRuleSet);
                      }}
                      placeholder="Optional"
                      style={{
                        width: '100%',
                        padding: '4px 8px',
                        border: `1px solid ${theme.table.border}`,
                        borderRadius: '4px',
                        background: theme.canvas.background,
                        color: theme.text.primary,
                        fontSize: '11px',
                        fontFamily: 'monospace',
                      }}
                    />
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={rule.enabled !== false}
                      onChange={(e) => {
                        const updated = [...projectRules];
                        updated[index] = { ...rule, enabled: e.target.checked };
                        const updatedRuleSet = {
                          ...activeTypeRuleSet,
                          rules: updated,
                          updatedAt: Date.now(),
                        };
                        setActiveTypeRuleSet(updatedRuleSet);
                        saveTypeRuleSet(updatedRuleSet);
                      }}
                      style={{
                        width: '16px',
                        height: '16px',
                        cursor: 'pointer',
                      }}
                    />
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <button
                      onClick={() => {
                        const updated = projectRules.filter((_, i) => i !== index);
                        const updatedRuleSet = {
                          ...activeTypeRuleSet,
                          rules: updated,
                          updatedAt: Date.now(),
                        };
                        setActiveTypeRuleSet(updatedRuleSet);
                        saveTypeRuleSet(updatedRuleSet);
                      }}
                      style={{
                        padding: '4px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        opacity: 0.6,
                      }}
                      title="Delete rule"
                    >
                      <Trash2 size={14} color="#ef4444" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  // Check if we have valid selection
  const hasValidSelection = sourceTable && targetTable;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Header with selections */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${theme.table.border}`,
        background: theme.table.background,
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
            '#3b82f6',
            sourceTableSearch,
            setSourceTableSearch
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
            '#22c55e',
            targetTableSearch,
            setTargetTableSearch
          )}
        </div>

        {/* Search popup indicator in header */}
        {columnSearchPopup && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            background: columnSearchPopup.side === 'source' ? '#3b82f620' : '#22c55e20',
            borderRadius: '16px',
            marginLeft: 'auto',
          }}>
            <MousePointer size={14} color={columnSearchPopup.side === 'source' ? '#3b82f6' : '#22c55e'} />
            <span style={{
              fontSize: '12px',
              color: columnSearchPopup.side === 'source' ? '#3b82f6' : '#22c55e',
              fontWeight: 500,
            }}>
              Mapping: {columnSearchPopup.columnName}
            </span>
            <button
              onClick={() => {
                setColumnSearchPopup(null);
                setSearchPopupTerm('');
              }}
              style={{
                padding: '2px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
              }}
            >
              <X size={14} color={columnSearchPopup.side === 'source' ? '#3b82f6' : '#22c55e'} />
            </button>
          </div>
        )}
      </div>

      {/* Content area */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0%', minHeight: 0, overflow: 'hidden' }}>
        {/* Tab bar - always visible */}
        <div style={{
            display: 'flex',
            gap: '4px',
            padding: '8px 16px',
            background: theme.canvas.background,
            borderBottom: `1px solid ${theme.table.border}`,
          }}>
            <button
              onClick={() => setActiveTab('canvas')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: activeTab === 'canvas'
                  ? theme.table.headerBackground
                  : 'transparent',
                border: activeTab === 'canvas'
                  ? `1px solid ${theme.table.border}`
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
                  ? theme.table.headerBackground
                  : 'transparent',
                border: activeTab === 'linkage'
                  ? `1px solid ${theme.table.border}`
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
                  background: theme.table.border,
                  borderRadius: '10px',
                  fontSize: '11px',
                }}>
                  {currentMappings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: activeTab === 'summary'
                  ? theme.table.headerBackground
                  : 'transparent',
                border: activeTab === 'summary'
                  ? `1px solid ${theme.table.border}`
                  : '1px solid transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: activeTab === 'summary' ? theme.text.primary : theme.text.secondary,
                fontSize: '13px',
                fontWeight: activeTab === 'summary' ? 600 : 400,
              }}
            >
              <Layers size={14} />
              All Mappings
              {project && project.mappings && project.mappings.length > 0 && (
                <span style={{
                  padding: '2px 6px',
                  background: theme.table.border,
                  borderRadius: '10px',
                  fontSize: '11px',
                }}>
                  {project.mappings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                background: activeTab === 'rules'
                  ? theme.table.headerBackground
                  : 'transparent',
                border: activeTab === 'rules'
                  ? `1px solid ${theme.table.border}`
                  : '1px solid transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                color: activeTab === 'rules' ? theme.text.primary : theme.text.secondary,
                fontSize: '13px',
                fontWeight: activeTab === 'rules' ? 600 : 400,
              }}
            >
              <Settings2 size={14} />
              Type Rules
              {activeTypeRuleSet && activeTypeRuleSet.rules && activeTypeRuleSet.rules.length > 0 && (
                <span style={{
                  padding: '2px 6px',
                  background: theme.table.border,
                  borderRadius: '10px',
                  fontSize: '11px',
                }}>
                  {activeTypeRuleSet.rules.length}
                </span>
              )}
            </button>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Generate SQL button - visible on linkage tab when mappings exist */}
            {currentMappings.length > 0 && activeTab === 'linkage' && (
              <button
                onClick={() => setShowSqlGenerator(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  background: theme.accent.primary,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <Code size={14} />
                Generate SQL
              </button>
            )}

            {/* Delete selected mapping button */}
            {selectedMappingId && activeTab === 'canvas' && (
              <button
                onClick={() => handleDeleteMapping(selectedMappingId)}
                title="Delete selected mapping (Delete key)"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#ef4444',
                  fontSize: '13px',
                  fontWeight: 500,
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                }}
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </div>

          {/* Tab content */}
          {activeTab === 'canvas' && hasValidSelection && (
            <div
              ref={containerRef}
              style={{
                flex: '1 1 0%',
                minHeight: 0,
                width: '100%',
                position: 'relative',
                overflow: 'auto',
                background: theme.canvas.background,
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
                background: `${theme.table.background}f2`,
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

              {/* Mapped column popup */}
              {mappedColumnPopup && (
                <div
                  style={{
                    position: 'fixed',
                    left: Math.min(mappedColumnPopup.x, window.innerWidth - 280),
                    top: Math.min(mappedColumnPopup.y + 10, window.innerHeight - 170),
                    background: theme.table.background,
                    border: `1px solid ${theme.table.border}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    zIndex: 100,
                    minWidth: '260px',
                    overflow: 'hidden',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Popup header */}
                  <div style={{
                    padding: '12px 16px',
                    background: theme.table.headerBackground,
                    borderBottom: `1px solid ${theme.table.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: theme.text.primary,
                    }}>
                      Column Already Mapped
                    </span>
                    <button
                      onClick={() => setMappedColumnPopup(null)}
                      style={{
                        padding: '4px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        opacity: 0.6,
                      }}
                    >
                      <X size={16} color={theme.text.secondary} />
                    </button>
                  </div>

                  {/* Popup content */}
                  <div style={{ padding: '16px' }}>
                    <div style={{
                      fontSize: '12px',
                      color: theme.text.secondary,
                      marginBottom: '12px',
                    }}>
                      <span style={{ color: mappedColumnPopup.side === 'source' ? '#3b82f6' : '#22c55e', fontWeight: 600 }}>
                        {mappedColumnPopup.clickedColumn}
                      </span>
                      {' '}is mapped to{' '}
                      <span style={{ color: mappedColumnPopup.side === 'source' ? '#22c55e' : '#3b82f6', fontWeight: 600 }}>
                        {mappedColumnPopup.side === 'source'
                          ? mappedColumnPopup.mapping.targetColumn
                          : mappedColumnPopup.mapping.sourceColumn
                        }
                      </span>
                      {' '}in{' '}
                      <span style={{ fontWeight: 500 }}>
                        {mappedColumnPopup.side === 'source'
                          ? mappedColumnPopup.mapping.targetTable
                          : mappedColumnPopup.mapping.sourceTable
                        }
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleNavigateToMapping(mappedColumnPopup.mapping)}
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: theme.accent.primary,
                          border: 'none',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <ArrowRightLeft size={14} />
                        Go to Mapping
                      </button>
                      <button
                        onClick={() => setMappedColumnPopup(null)}
                        style={{
                          padding: '8px 12px',
                          background: theme.table.headerBackground,
                          border: `1px solid ${theme.table.border}`,
                          borderRadius: '6px',
                          color: theme.text.primary,
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* All mapped tables popup (right-click) */}
              {allMappedTablesPopup && (
                <div
                  style={{
                    position: 'fixed',
                    left: Math.min(allMappedTablesPopup.x, window.innerWidth - 320),
                    top: Math.min(allMappedTablesPopup.y + 10, window.innerHeight - 420),
                    background: theme.table.background,
                    border: `1px solid ${theme.table.border}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    zIndex: 100,
                    width: '280px',
                    overflow: 'hidden',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Popup header */}
                  <div style={{
                    padding: '12px 16px',
                    background: allMappedTablesPopup.side === 'source' ? '#3b82f615' : '#22c55e15',
                    borderBottom: `1px solid ${theme.table.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{
                        fontSize: '11px',
                        color: theme.text.secondary,
                        marginBottom: '2px',
                      }}>
                        All Mappings
                      </div>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: allMappedTablesPopup.side === 'source' ? '#3b82f6' : '#22c55e',
                      }}>
                        {allMappedTablesPopup.columnName}
                      </span>
                    </div>
                    <button
                      onClick={() => setAllMappedTablesPopup(null)}
                      style={{
                        padding: '4px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        opacity: 0.6,
                      }}
                    >
                      <X size={16} color={theme.text.secondary} />
                    </button>
                  </div>

                  {/* Mappings list */}
                  <div style={{
                    maxHeight: '300px',
                    overflowY: 'auto',
                    borderTop: `1px solid ${theme.table.border}`,
                  }}>
                    {allMappedTablesPopup.mappings.map((mapping, idx) => {
                      const oppositeTable = allMappedTablesPopup.side === 'source' ? mapping.targetTable : mapping.sourceTable;
                      const oppositeColumn = allMappedTablesPopup.side === 'source' ? mapping.targetColumn : mapping.sourceColumn;
                      const colorIndex = getMappingColorIndex(mapping);
                      const lineColor = LINE_COLORS[colorIndex];
                      const hasIssues = (mapping.validation?.errors?.length ?? 0) > 0 || (mapping.validation?.warnings?.length ?? 0) > 0;

                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            // Navigate to canvas with this mapping
                            // Update script selections to match the mapping's source and target
                            setSourceScriptId(mapping.sourceScriptId);
                            setTargetScriptId(mapping.targetScriptId);
                            setSourceTableName(mapping.sourceTable);
                            setTargetTableName(mapping.targetTable);
                            setSelectedMappingId(mapping.id);
                            setAllMappedTablesPopup(null);
                            setActiveTab('canvas');
                          }}
                          style={{
                            padding: '10px 16px',
                            cursor: 'pointer',
                            borderBottom: `1px solid ${theme.table.border}`,
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = theme.canvas.background;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px',
                          }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                fontSize: '12px',
                                fontWeight: 500,
                                color: theme.text.primary,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                marginBottom: '2px',
                              }}>
                                {oppositeColumn}
                              </div>
                              <div style={{
                                fontSize: '11px',
                                color: theme.text.secondary,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}>
                                {oppositeTable}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                              <div style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: lineColor,
                              }} />
                              {hasIssues && (
                                (mapping.validation?.errors?.length ?? 0) > 0 ? (
                                  <AlertCircle size={14} color="#ef4444" />
                                ) : (
                                  <AlertTriangle size={14} color="#f59e0b" />
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Column search popup for click-to-map */}
              {columnSearchPopup && (() => {
                // Get fresh column data from current scripts
                const table = columnSearchPopup.side === 'source' ? sourceTable : targetTable;
                const freshColumn = table?.columns?.find(c => c.name === columnSearchPopup.columnName) || columnSearchPopup.column;

                return (
                <div
                  style={{
                    position: 'fixed',
                    left: Math.min(columnSearchPopup.x, window.innerWidth - 320),
                    top: Math.min(columnSearchPopup.y + 10, window.innerHeight - 370),
                    background: theme.table.background,
                    border: `1px solid ${theme.table.border}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    zIndex: 100,
                    width: '280px',
                    overflow: 'hidden',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Popup header */}
                  <div style={{
                    padding: '12px 16px',
                    background: columnSearchPopup.side === 'source' ? '#3b82f615' : '#22c55e15',
                    borderBottom: `1px solid ${theme.table.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div>
                      <div style={{
                        fontSize: '11px',
                        color: theme.text.secondary,
                        marginBottom: '2px',
                      }}>
                        Map to {columnSearchPopup.side === 'source' ? 'Target' : 'Source'}
                      </div>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: columnSearchPopup.side === 'source' ? '#3b82f6' : '#22c55e',
                      }}>
                        {columnSearchPopup.columnName}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setColumnSearchPopup(null);
                        setSearchPopupTerm('');
                      }}
                      style={{
                        padding: '4px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        opacity: 0.6,
                      }}
                    >
                      <X size={16} color={theme.text.secondary} />
                    </button>
                  </div>

                  {/* Migration needed checkbox and reason */}
                  <div style={{
                    padding: '12px',
                    borderBottom: `1px solid ${theme.table.border}`,
                    background: theme.canvas.background,
                  }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      color: theme.text.primary,
                      cursor: 'pointer',
                      marginBottom: !localMigrationNeeded ? '8px' : '0',
                    }}>
                      <input
                        type="checkbox"
                        checked={localMigrationNeeded}
                        onChange={(e) => {
                          const migrationNeeded = e.target.checked;
                          setLocalMigrationNeeded(migrationNeeded);
                          if (!migrationNeeded) {
                            // Keep current comment when unchecking
                            handleUpdateColumnMigration(
                              columnSearchPopup.side,
                              columnSearchPopup.tableName,
                              columnSearchPopup.columnName,
                              false,
                              localNonMigrationComment
                            );
                          } else {
                            // Clear comment when checking
                            setLocalNonMigrationComment('');
                            handleUpdateColumnMigration(
                              columnSearchPopup.side,
                              columnSearchPopup.tableName,
                              columnSearchPopup.columnName,
                              true,
                              undefined
                            );
                          }
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: '14px',
                          height: '14px',
                          cursor: 'pointer',
                        }}
                      />
                      <span>Migration Needed</span>
                    </label>

                    {/* Reason for not migrating */}
                    {!localMigrationNeeded && (
                      <textarea
                        placeholder="Reason for not migrating..."
                        value={localNonMigrationComment}
                        onChange={(e) => {
                          setLocalNonMigrationComment(e.target.value);
                        }}
                        onBlur={(e) => {
                          handleUpdateColumnMigration(
                            columnSearchPopup.side,
                            columnSearchPopup.tableName,
                            columnSearchPopup.columnName,
                            false,
                            e.target.value
                          );
                        }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: '100%',
                          minHeight: '60px',
                          padding: '6px 8px',
                          fontSize: '12px',
                          border: `1px solid ${theme.table.border}`,
                          borderRadius: '4px',
                          background: theme.table.background,
                          color: theme.text.primary,
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          outline: 'none',
                        }}
                      />
                    )}
                  </div>

                  {/* Search input */}
                  <div style={{ padding: '12px' }}>
                    <input
                      type="text"
                      placeholder="Search columns..."
                      value={searchPopupTerm}
                      onChange={(e) => setSearchPopupTerm(e.target.value)}
                      disabled={!localMigrationNeeded}
                      autoFocus={localMigrationNeeded}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        fontSize: '13px',
                        border: `1px solid ${theme.table.border}`,
                        borderRadius: '6px',
                        background: theme.canvas.background,
                        color: theme.text.primary,
                        outline: 'none',
                        opacity: !localMigrationNeeded ? 0.5 : 1,
                        cursor: !localMigrationNeeded ? 'not-allowed' : 'text',
                      }}
                    />
                  </div>

                  {/* Column list */}
                  <div style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    borderTop: `1px solid ${theme.table.border}`,
                  }}>
                    {availableColumnsForSearch.length === 0 ? (
                      <div style={{
                        padding: '16px',
                        textAlign: 'center',
                        color: theme.text.secondary,
                        fontSize: '12px',
                      }}>
                        {searchPopupTerm ? 'No matching columns' : 'No available columns'}
                      </div>
                    ) : (
                      availableColumnsForSearch.map((col) => (
                        <div
                          key={col.columnName}
                          onClick={() => handleSearchPopupSelect(col.tableName, col.columnName)}
                          style={{
                            padding: '10px 16px',
                            cursor: 'pointer',
                            borderBottom: `1px solid ${theme.table.border}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = columnSearchPopup.side === 'source' ? '#22c55e15' : '#3b82f615';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <span style={{
                            fontSize: '13px',
                            color: theme.text.primary,
                            fontWeight: 500,
                          }}>
                            {col.columnName}
                          </span>
                          <span style={{
                            fontSize: '11px',
                            color: theme.text.secondary,
                          }}>
                            {col.columnType}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                );
              })()}
            </div>
          )}
          {activeTab === 'linkage' && hasValidSelection && renderLinkageTable()}
          {activeTab === 'summary' && hasValidSelection && renderSummaryTable()}
          {activeTab === 'rules' && hasValidSelection && renderRulesTab()}

          {/* Empty state when no selection */}
          {!hasValidSelection && (
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
          )}
        </div>

      {/* Context Menu for Linkage Table */}
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            background: theme.table.background,
            border: `1px solid ${theme.table.border}`,
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 2000,
            minWidth: '220px',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: '4px 0' }}>
            {/* Show selection count if multiple selected */}
            {selectedMappingIds.size > 1 && (
              <div style={{
                padding: '6px 12px',
                fontSize: '11px',
                color: theme.text.secondary,
                borderBottom: `1px solid ${theme.table.border}`,
                fontWeight: 600,
              }}>
                {selectedMappingIds.size} columns selected
              </div>
            )}

            {/* Generate SQL - Align Target to Source */}
            <div
              onClick={() => {
                const sql = selectedMappingIds.size > 1
                  ? handleGenerateMultipleColumnsSql(selectedMappingIds, 'toSource')
                  : handleGenerateSingleColumnSql(contextMenu.mapping, 'toSource');
                setSqlPreview({ sql, direction: 'toSource' });
                setContextMenu(null);
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: theme.text.primary,
                background: theme.table.background,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkTheme ? '#374151' : '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = theme.table.background;
              }}
            >
              <Code size={14} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 500 }}>Align Target to Source</span>
                <span style={{ fontSize: '11px', color: theme.text.secondary }}>
                  Modify {targetScript?.name}
                </span>
              </div>
            </div>

            {/* Generate SQL - Align Source to Target */}
            <div
              onClick={() => {
                const sql = selectedMappingIds.size > 1
                  ? handleGenerateMultipleColumnsSql(selectedMappingIds, 'toTarget')
                  : handleGenerateSingleColumnSql(contextMenu.mapping, 'toTarget');
                setSqlPreview({ sql, direction: 'toTarget' });
                setContextMenu(null);
              }}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: theme.text.primary,
                background: theme.table.background,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDarkTheme ? '#374151' : '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = theme.table.background;
              }}
            >
              <Code size={14} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: 500 }}>Align Source to Target</span>
                <span style={{ fontSize: '11px', color: theme.text.secondary }}>
                  Modify {sourceScript?.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SQL Preview Modal */}
      {sqlPreview && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
          }}
          onClick={() => setSqlPreview(null)}
        >
          <div
            style={{
              background: theme.table.background,
              borderRadius: '12px',
              width: '90%',
              maxWidth: '1000px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: `1px solid ${theme.table.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: theme.text.primary }}>
                  SQL Alignment Preview
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: theme.text.secondary }}>
                  {sqlPreview.direction === 'toSource'
                    ? `Align Target to Source (Modify: ${targetScript?.name})`
                    : `Align Source to Target (Modify: ${sourceScript?.name})`
                  }
                </p>
              </div>
              <button
                onClick={() => setSqlPreview(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: theme.text.secondary,
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* SQL Content - Editable Textarea */}
            <div style={{
              flex: 1,
              overflow: 'hidden',
              padding: '16px',
              background: isDarkTheme ? '#1a1a1a' : '#f5f5f5',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <textarea
                id="sql-preview-textarea"
                defaultValue={sqlPreview.sql}
                spellCheck={false}
                style={{
                  flex: 1,
                  margin: 0,
                  padding: '12px',
                  fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  color: theme.text.primary,
                  background: isDarkTheme ? '#1e1e1e' : '#ffffff',
                  border: `1px solid ${theme.table.border}`,
                  borderRadius: '6px',
                  resize: 'none',
                  outline: 'none',
                  whiteSpace: 'pre',
                  overflowWrap: 'normal',
                  overflowX: 'auto',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.accent.primary;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.table.border;
                }}
              />
            </div>

            {/* Footer with Copy Button */}
            <div
              style={{
                padding: '12px 20px',
                borderTop: `1px solid ${theme.table.border}`,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <button
                onClick={() => setSqlPreview(null)}
                style={{
                  padding: '8px 16px',
                  background: theme.table.background,
                  color: theme.text.primary,
                  border: `1px solid ${theme.table.border}`,
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Get current value from textarea (may have been edited)
                  const textarea = document.getElementById('sql-preview-textarea') as HTMLTextAreaElement;
                  const sqlText = textarea?.value || sqlPreview.sql;
                  navigator.clipboard.writeText(sqlText);
                  // Show brief feedback
                  const btn = document.activeElement as HTMLButtonElement;
                  const originalText = btn.textContent;
                  btn.textContent = 'Copied!';
                  setTimeout(() => {
                    btn.textContent = originalText;
                  }, 1500);
                }}
                style={{
                  padding: '8px 16px',
                  background: theme.accent.primary,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Copy size={16} />
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SQL Generator Modal */}
      {showSqlGenerator && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowSqlGenerator(false)}
        >
          <div
            style={{
              background: theme.table.background,
              borderRadius: '12px',
              width: '90%',
              maxWidth: '900px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: `1px solid ${theme.table.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: theme.text.primary }}>
                Generate SQL Alignment Script
              </h3>
              <button
                onClick={() => setShowSqlGenerator(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: theme.text.secondary,
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', flex: 1, overflow: 'auto' }}>
              {/* Options */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 600, color: theme.text.primary }}>
                  Alignment Options
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Direction */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500, color: theme.text.primary }}>
                      Align Direction
                    </label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          checked={sqlAlignDirection === 'toSource'}
                          onChange={() => setSqlAlignDirection('toSource')}
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '13px', color: theme.text.primary }}>
                          Align Target to Source (Modify: {targetScript?.name})
                        </span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          checked={sqlAlignDirection === 'toTarget'}
                          onChange={() => setSqlAlignDirection('toTarget')}
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '13px', color: theme.text.primary }}>
                          Align Source to Target (Modify: {sourceScript?.name})
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Include options */}
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 500, color: theme.text.primary }}>
                      Include Changes
                    </label>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={sqlIncludeNullable}
                          onChange={(e) => setSqlIncludeNullable(e.target.checked)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '13px', color: theme.text.primary }}>Nullable</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={sqlIncludeDatatype}
                          onChange={(e) => setSqlIncludeDatatype(e.target.checked)}
                          style={{ cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '13px', color: theme.text.primary }}>Data Type (with auto-mapping)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generated SQL */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: theme.text.primary }}>
                    Generated SQL
                  </h4>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={handleGenerateSql}
                      style={{
                        padding: '6px 12px',
                        background: theme.accent.primary,
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Code size={14} />
                      Generate
                    </button>
                    {generatedSql && (
                      <>
                        <button
                          onClick={handleCopySql}
                          style={{
                            padding: '6px 12px',
                            background: theme.table.background,
                            color: theme.text.primary,
                            border: `1px solid ${theme.table.border}`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Copy size={14} />
                          Copy
                        </button>
                        <button
                          onClick={handleDownloadSql}
                          style={{
                            padding: '6px 12px',
                            background: theme.table.background,
                            color: theme.text.primary,
                            border: `1px solid ${theme.table.border}`,
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Download size={14} />
                          Download
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <textarea
                  value={generatedSql}
                  readOnly
                  placeholder="Click 'Generate' to create SQL script..."
                  style={{
                    width: '100%',
                    height: '400px',
                    padding: '12px',
                    background: isDarkTheme ? '#1a1a1a' : '#f5f5f5',
                    color: theme.text.primary,
                    border: `1px solid ${theme.table.border}`,
                    borderRadius: '6px',
                    fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                    fontSize: '12px',
                    lineHeight: '1.5',
                    resize: 'none',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
