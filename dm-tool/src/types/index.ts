// ============================================
// Core Data Types
// ============================================

export type ScriptType = 'postgresql' | 'oracle' | 'dbml';

export interface Column {
  name: string;
  type: string;
  nullable: string;
  default: string | null;
  explanation: string;
  mapping: string;
  migrationNeeded?: boolean;
  nonMigrationComment?: string;
}

export interface Constraint {
  name: string;
  type: 'Primary Key' | 'Foreign Key' | 'Unique';
  localCols: string;
  ref?: string;
}

export interface Table {
  id: number;
  schema: string;
  tableName: string;
  description: string;
  constraints: Constraint[];
  columns: Column[];
}

export interface ScriptData {
  targets: Table[];
  sources: Table[];
}

export interface Script {
  id: string;
  name: string;
  type: ScriptType;
  rawContent: string;
  data: ScriptData;
  createdAt: number;
  updatedAt: number;
  // Versioning fields (optional for backward compatibility)
  currentVersionId?: string;
  versions?: ScriptVersion[];
  versioningEnabled?: boolean;
  maxVersions?: number;
}

// ============================================
// Script Versioning Types
// ============================================

export interface ScriptVersion {
  id: string;
  versionNumber: number;
  content: string;
  data: ScriptData;
  message?: string;
  createdAt: number;
}

export interface VersionDiffStats {
  linesAdded: number;
  linesDeleted: number;
  linesModified: number;
  tablesAdded: number;
  tablesDeleted: number;
  tablesModified: number;
}

export type LineDiffType = 'unchanged' | 'added' | 'deleted' | 'modified';

export interface LineDiff {
  type: LineDiffType;
  oldContent?: string;
  newContent?: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export type DiffHunkType = 'addition' | 'deletion' | 'modification' | 'context';

export interface DiffHunk {
  startLine: number;
  endLine: number;
  lines: LineDiff[];
  type: DiffHunkType;
}

export interface VersionCompareResult {
  oldVersion: ScriptVersion;
  newVersion: ScriptVersion;
  hunks: DiffHunk[];
  stats: VersionDiffStats;
  schemaDiff?: Record<string, TableDiff>;
}

export type DiffMarkerType = 'added' | 'deleted' | 'modified';

export interface DiffMarker {
  startPercent: number;
  endPercent: number;
  type: DiffMarkerType;
  lineStart: number;
  lineEnd: number;
}

// ============================================
// ERD Types
// ============================================

export interface ERDNode {
  id: string;
  table: Table;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ERDEdge {
  id: string;
  source: string;
  sourceColumn: string;
  target: string;
  targetColumn: string;
}

// ============================================
// Schema Compare Types
// ============================================

export type DiffStatus = 'IDENTICAL' | 'MODIFIED' | 'MISSING' | 'ADDED' | 'SOFT_MATCH';
export type ColumnDiffType = 'SAME' | 'SOFT' | 'MODIFIED' | 'ADDED' | 'DELETED';

export interface ColumnDiff {
  col: string;
  type: ColumnDiffType;
  s: Column | null;
  t: Column | null;
  note?: string;
}

export interface TableDiff {
  status: DiffStatus;
  src: Table | null;
  tgt: Table | null;
  details?: {
    hasHardDiff: boolean;
    hasSoftDiff: boolean;
    pkDiff: boolean;
    changes: ColumnDiff[];
  };
}

// ============================================
// App State Types
// ============================================

export type AppView = 'scripts' | 'dictionary' | 'compare' | 'erd' | 'mapping' | 'flowcharts';

export interface AppState {
  scripts: Script[];
  activeScriptId: string | null;
  view: AppView;
  theme: 'light' | 'dark';
}

// ============================================
// Column Mapping Types
// ============================================

export type MappingStatus = 'unmapped' | 'mapped' | 'conflict' | 'auto';
export type TypeCompatibility = 'exact' | 'compatible' | 'needs_conversion' | 'incompatible';

export interface ColumnMapping {
  id: string;

  // Source
  sourceScriptId: string;
  sourceTable: string;
  sourceColumn: string;
  sourceType: string;

  // Target
  targetScriptId: string;
  targetTable: string;
  targetColumn: string;
  targetType: string;

  // Mapping metadata
  mapType: 'manual' | 'auto' | 'suggested';
  typeCompatibility: TypeCompatibility;

  // Validation results
  validation: MappingValidation;
  validationResolved?: boolean; // True if validation issues have been manually resolved/acknowledged

  // Transformations (ordered)
  transformations: Transformation[];

  // User notes and approval
  remarks?: string;
  approvedBy?: string;
  approvedAt?: number;

  // Timestamps
  confidence: number;  // 0-1 for auto-mappings
  createdAt: number;
  updatedAt: number;
}

export interface MappingValidation {
  typeMatch: boolean;
  sizeMatch: boolean;
  nullableMatch: boolean;
  precisionMatch: boolean;
  defaultMatch: boolean;
  constraintMatch: boolean;
  warnings: string[];
  errors: string[];
}

export interface Transformation {
  id: string;
  type: TransformationType;
  sequence: number;
  params?: Record<string, unknown>;
  expression?: string;  // For custom/advanced rules
}

export type TransformationType =
  | 'trim'
  | 'uppercase'
  | 'lowercase'
  | 'concat'
  | 'substring'
  | 'replace'
  | 'date_format'
  | 'number_format'
  | 'type_cast'
  | 'default_value'
  | 'lookup'
  | 'custom';

export interface MappingProject {
  id: string;
  name: string;
  sourceScriptId: string;
  targetScriptId: string;
  mappings: ColumnMapping[];
  tableMappings: TableMapping[];
  typeRuleSetId?: string;  // Reference to global TypeRuleSet
  typeRules?: TypeCompatibilityRule[];  // Deprecated: kept for backward compatibility
  createdAt: number;
  updatedAt: number;
}

export interface TableMapping {
  sourceTable: string;
  targetTable: string;
  status: 'complete' | 'partial' | 'unmapped';
  autoMapCount: number;
  manualMapCount: number;
}

// ============================================
// Type Compatibility Rules (Script-Based Config)
// ============================================

export interface TypeCompatibilityRule {
  id: string;
  name: string;
  description?: string;
  sourcePattern: string;  // Regex pattern for source type
  targetPattern: string;  // Regex pattern for target type
  compatibility: TypeCompatibility;
  conversionSql?: string;
  warning?: string;
  priority: number;  // Higher priority rules checked first
  enabled: boolean;
}

export interface TypeRuleSet {
  id: string;
  name: string;
  description?: string;
  sourceDb: 'oracle' | 'postgresql' | 'mysql' | 'sqlserver' | 'any';
  targetDb: 'oracle' | 'postgresql' | 'mysql' | 'sqlserver' | 'any';
  rules: TypeCompatibilityRule[];
  isBuiltIn: boolean;  // System vs user-defined
  createdAt: number;
  updatedAt: number;
}

// ============================================
// Mapping Canvas Types (for visual connectors)
// ============================================

export interface MappingNode {
  id: string;
  type: 'source' | 'target';
  table: Table;
  x: number;
  y: number;
  width: number;
  height: number;
  collapsed: boolean;
}

export interface MappingEdge {
  id: string;
  mappingId: string;  // Reference to ColumnMapping
  sourceNodeId: string;
  sourceColumn: string;
  targetNodeId: string;
  targetColumn: string;
  compatibility: TypeCompatibility;
}

export interface DragState {
  isDragging: boolean;
  startNodeId: string | null;
  startColumn: string | null;
  startType: 'source' | 'target' | null;
  currentX: number;
  currentY: number;
}

// ============================================
// SQL Alignment Types
// ============================================

export interface DatatypeMapping {
  sourcePattern: string; // Regex pattern for source type (e.g., "VARCHAR2\(.*\)")
  targetType: string;    // Target type to map to (e.g., "VARCHAR")
}

export interface SqlAlignmentConfig {
  direction: 'toSource' | 'toTarget';
  includeNullable: boolean;
  includeDatatype: boolean;
  datatypeMappings: DatatypeMapping[];
}

// ============================================
// Flowchart/PUML Types
// ============================================

// Flowchart Script (separate from DDL Script)
export interface FlowchartScript {
  id: string;
  name: string;
  rawContent: string;
  data: PUMLDiagram;
  createdAt: number;
  updatedAt: number;
}

// PUML Node Types (full activity diagram support)
export type PUMLNodeType =
  | 'start'
  | 'stop'
  | 'activity'
  | 'decision'
  | 'fork'
  | 'join'
  | 'note'
  | 'partition-start'
  | 'partition-end'
  | 'while-start'
  | 'while-end'
  | 'repeat-start'
  | 'repeat-end'
  | 'detach'
  | 'kill';

export interface PUMLNode {
  id: string;
  type: PUMLNodeType;
  text: string;
  swimlane?: string;
  partition?: string;
  condition?: string;         // For decision text (e.g., "Validation OK?")
  branches?: PUMLBranch[];    // For decision/switch branches
  loopCondition?: string;     // For while/repeat loops
  loopExitLabel?: string;     // Label for loop exit (e.g., "no")
}

export interface PUMLBranch {
  label: string;              // Branch label (e.g., "yes", "no")
  targetId: string;           // ID of the node this branch leads to
}

export interface PUMLConnection {
  id: string;
  from: string;               // Source node ID
  to: string;                 // Target node ID
  label?: string;             // Arrow label
  condition?: string;         // Condition label (yes/no for decisions)
  color?: string;             // Custom arrow color (e.g., "#blue")
  style?: 'solid' | 'dashed' | 'dotted' | 'hidden';
}

export interface PUMLSwimlane {
  id: string;
  name: string;
  color?: string;             // Custom color (e.g., "#lightblue") or auto-assigned
  order: number;              // Left-to-right order (0-based)
}

export interface PUMLPartition {
  id: string;
  name: string;
  nodeIds: string[];          // IDs of nodes contained in this partition
}

export interface PUMLNote {
  id: string;
  text: string;
  position: 'left' | 'right' | 'top' | 'bottom';
  attachedTo?: string;        // Node ID this note is attached to (if not floating)
  isFloating: boolean;
}

export interface PUMLDiagram {
  name: string;
  nodes: PUMLNode[];
  connections: PUMLConnection[];
  swimlanes: PUMLSwimlane[];
  partitions: PUMLPartition[];
  notes: PUMLNote[];
}
