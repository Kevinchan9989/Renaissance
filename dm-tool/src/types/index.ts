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

export type AppView = 'dictionary' | 'compare' | 'erd';

export interface AppState {
  scripts: Script[];
  activeScriptId: string | null;
  view: AppView;
  theme: 'light' | 'dark';
}
