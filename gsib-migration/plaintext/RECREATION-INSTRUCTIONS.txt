# Renaissance DM Tool - Complete Recreation Instructions

> This file provides comprehensive specifications for recreating the Renaissance DM Tool as a Vite + React + TypeScript web application. The user needs only three core features: **Data Dictionary**, **ERD/UML diagram viewer**, and **Excel export of the data dictionary**.

---

## 1. Project Setup

### 1.1 Package Dependencies

```json
{
  "name": "dm-tool",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@dagrejs/dagre": "^1.1.2",
    "elkjs": "^0.11.0",
    "exceljs": "^4.4.0",
    "konva": "^9.3.6",
    "lucide-react": "^0.365.0",
    "prismjs": "^1.30.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-konva": "^18.2.10",
    "react-simple-code-editor": "^0.14.1"
  },
  "devDependencies": {
    "@types/prismjs": "^1.26.5",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

### 1.2 File/Folder Structure

```
dm-tool/
  public/
    index.html
  src/
    App.tsx
    main.tsx
    types/
      index.ts
    components/
      DataDictionary.tsx        # Main data dictionary (largest component ~4600 lines)
      Sidebar.tsx
      ERDViewer.tsx
      ExcelExportPreview.tsx
      CodeEditor.tsx
      ScriptManager.tsx
      CreateScriptModal.tsx
      ImportExplanationsModal.tsx
      ImportTableDescriptionsModal.tsx
      ImportMasterCodeModal.tsx
      ImportMasterCodeCategoryModal.tsx
      AttachSampleDataModal.tsx
      ImportTablesModal.tsx
      SettingsModal.tsx
    utils/
      parsers.ts                # DDL parsing (PostgreSQL, Oracle, DBML)
      ddlGenerator.ts           # Generate DDL from parsed Table objects
      excelExport.ts            # Excel workbook generation
      storage.ts                # localStorage persistence
    constants/
      erd.ts                    # ERD sizing, colors, theme constants
    styles/
      index.css                 # Global styles
  vite.config.ts
  tsconfig.json
```

### 1.3 index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Renaissance DM Tool</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

### 1.4 main.tsx

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

---

## 2. Data Model (types/index.ts)

### 2.1 Core Types

```typescript
export type ScriptType = 'postgresql' | 'oracle' | 'dbml';

export interface Column {
  name: string;
  type: string;
  nullable: string;                // "Yes"/"No"/"Y"/"N"
  default: string | null;
  explanation: string;             // User-written column explanation
  mapping: string;                 // Mapping logic text
  migrationNeeded?: boolean;       // Whether column needs migration
  nonMigrationComment?: string;    // Reason if not migrated
  sampleValues?: string[];         // Sample values from attached CSV
  possibleValues?: string;         // User-entered possible values (e.g. "Y/N", "Active, Inactive")
}

export interface Constraint {
  name: string;
  type: 'Primary Key' | 'Foreign Key' | 'Unique';
  localCols: string;               // Comma-separated column names
  ref?: string;                    // For FK: "schema.table(col1, col2)"
}

export interface Table {
  id: number;
  schema: string;
  tableName: string;
  description: string;
  constraints: Constraint[];
  columns: Column[];
  toIgnore?: boolean;              // Flag to mark table as ignored for migration
  explanationCompleted?: boolean;  // Flag to mark table explanation as completed
  _tChecked?: boolean;             // Flag for _t checkbox (auto-checked if table name contains _t)
}

export interface MasterCode {
  key: string;
  definition: string;
}

export interface MasterCodeCategory {
  key: string;
  definition: string;
}

export interface ScriptData {
  targets: Table[];
  sources: Table[];
}

export interface SampleDataMatchResult {
  csvTableName: string;
  matchedScriptTable: string | null;
  matchedColumns: { csvColumn: string; scriptColumn: string }[];
  unmatchedCsvColumns: string[];
  unmatchedScriptColumns: string[];
  matchMethod?: 'name' | 'columns';
  matchScore?: number;
}

export interface SampleDataAttachment {
  id: string;
  fileName: string;
  uploadedAt: number;
  matchResults: SampleDataMatchResult[];
  warnings: string[];
}

export interface Script {
  id: string;
  name: string;
  type: ScriptType;
  rawContent: string;
  data: ScriptData;
  createdAt: number;
  updatedAt: number;
  currentVersionId?: string;
  versions?: ScriptVersion[];
  versioningEnabled?: boolean;
  maxVersions?: number;
  sampleDataAttachments?: SampleDataAttachment[];
  masterCodes?: MasterCode[];
  masterCodeCategories?: MasterCodeCategory[];
}

export interface ScriptVersion {
  id: string;
  versionNumber: number;
  content: string;
  data: ScriptData;
  message?: string;
  createdAt: number;
}
```

### 2.2 ERD Types

```typescript
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
```

### 2.3 App State Types

```typescript
export type AppView = 'scripts' | 'dictionary' | 'compare' | 'erd' | 'mapping' | 'flowcharts';

export interface AppState {
  scripts: Script[];
  activeScriptId: string | null;
  view: AppView;
  theme: 'light' | 'dark';
}
```

---

## 3. Data Dictionary Component - FULL SPECIFICATION

This is the largest and most important component (~4600 lines). It handles all data dictionary views.

### 3.1 Props Interface

```typescript
interface DataDictionaryProps {
  script: Script;
  selectedTableId: number | null;
  onSelectTable: (id: number | null) => void;
  onUpdateTable: (tableId: number, updates: Partial<Table>, isSource?: boolean) => void;
  onUpdateScript: (rawContent: string) => void;
  onUpdateScriptPartial?: (updates: Partial<Script>) => void;
  isDarkTheme?: boolean;
  darkThemeVariant?: 'slate' | 'vscode-gray';
}
```

### 3.2 View Modes

The component has 5 view modes controlled by `viewMode` state:

| Mode | Label | Icon | Description |
|------|-------|------|-------------|
| `tableList` | Tables | `List` | All tables overview with filters |
| `dictionary` | Dictionary | `Database` | Column definitions grid for selected table |
| `data` | Data View | `Rows3` | Sample data rows (transposed from column sampleValues) |
| `code` | Code View | `FileCode` | Generated DDL for selected table |
| `masterCodes` | Master Codes | `BookOpen` | Master code/category definitions |

View mode toggle is rendered as a button group with rounded borders (`borderRadius: '6px'`), each button having `borderRadius: 0` and separated by `1px solid` border. Active view gets `backgroundColor: isDarkTheme ? '#3b82f6' : '#2563eb'` and `color: '#fff'`.

When no table is selected, only `tableList` and `masterCodes` views are accessible. The other views show a "Select a Table" empty state.

### 3.3 Dictionary View (Column Grid)

#### Column Definitions

9 columns with default percentage widths:

| Index | Key | Label | Default Width | Editable | Notes |
|-------|-----|-------|---------------|----------|-------|
| 0 | `column` | Column | 11% | Yes | Shows PK/FK/UQ tags |
| 1 | `type` | Type | 9% | Yes | |
| 2 | `nullable` | Nullable | 5% | Yes | |
| 3 | `default` | Default | 6% | Yes | |
| 4 | `explanation` | Explanation | 13% | Yes | |
| 5 | `mapping` | Mapping Logic | 13% | Yes | |
| 6 | `sampleValues` | Sample Values | 13% | **No** (read-only) | Joined from `col.sampleValues[]` |
| 7 | `possibleValues` | Possible Values | 12% | Yes | |
| 8 | `mappedTo` | Mapped To | 18% | **No** (computed) | From mapping projects |

#### Field Mapping (col index to Column property)

```typescript
const fieldMap: { [key: number]: keyof Column } = {
  0: 'name',
  1: 'type',
  2: 'nullable',
  3: 'default',
  4: 'explanation',
  5: 'mapping',
  7: 'possibleValues',
};
// 6 = sampleValues (read-only, col.sampleValues.join(', '))
// 8 = mappedTo (computed from mapping projects)
```

#### Column Visibility Toggle

- Triggered by `Settings2` icon button labeled "Columns"
- Opens a dropdown (`position: absolute, top: 100%, right: 0, zIndex: 1000`)
- Each column is a checkbox label
- "Show All" / "Hide All" toggle button at top
- "Done" button at bottom
- Minimum 1 column must remain visible
- Persisted to localStorage via `saveDDVisibleColumns(scriptId, visible[], knownColumns[])`
- New columns (not in `knownColumns` at save time) are auto-included

#### Column Resize

- Drag handle rendered on each `<th>` (a div with `position: absolute, right: 0, width: 4px, cursor: col-resize`)
- On mousedown: capture `startX` and `startWidth`
- On mousemove: `newWidth = Math.max(startWidth + delta, 50)` (minimum 50px)
- On mouseup: save widths to localStorage via `saveDDColumnWidths(scriptId, widths)`
- During resize: `document.body.style.cursor = 'col-resize'` and `userSelect = 'none'`
- Widths reset when visible columns change

#### Column Tags

In column 0 (name), PK/FK/UQ tags are shown after the column name:
```typescript
const getColumnTags = (table: Table, colName: string) => {
  const tags: string[] = [];
  for (const c of table.constraints) {
    const cols = c.localCols.split(',').map(s => s.trim().toUpperCase());
    if (cols.includes(colName.toUpperCase())) {
      if (c.type === 'Primary Key') tags.push('PK');
      if (c.type === 'Foreign Key') tags.push('FK');
      if (c.type === 'Unique') tags.push('UQ');
    }
  }
  return tags;
};
```

Tags are rendered as small colored badges next to the column name.

#### Table Info Header

Above the column grid:
- **Table Information** section with a `data-table`:
  - Row: Schema | `selectedTable.schema`
  - Row: Table Name | `selectedTable.tableName` (class `code-cell`)
  - Row: Description | contentEditable div, saves on blur

#### Constraints Section

Below table info, above column grid:
- Header: "Constraints"
- Table with columns: Name, Type, Columns, Reference
- Only shown if `selectedTable.constraints.length > 0`

### 3.4 Excel Mode (Excel-like Editing)

#### Cell Coordinate Type

```typescript
interface CellCoord {
  row: number;
  col: number; // 0-8 for dictionary, 0-6 for table list
}
const COLUMN_COUNT = 9;
```

#### Selection Model

State variables:
- `excelMode: boolean` - toggle between normal and Excel mode
- `selectedCells: CellCoord[]` - all currently selected cells
- `activeCell: CellCoord | null` - the "focus" cell (blue border)
- `editingCell: CellCoord | null` - cell currently being edited
- `editValue: string` - current edit value
- `selectionStart: CellCoord | null` - anchor for drag selection
- `isDragging: boolean` - whether mouse is dragging

#### Mouse Interactions

- **Single click**: Select single cell, set as active
- **Shift+Click**: Range select from active cell to clicked cell (`getCellRange()`)
- **Ctrl/Cmd+Click**: Toggle cell in/out of selection
- **Drag** (mousedown + mousemove + mouseup): Range select from start to current position
- **Double-click**: Enter edit mode on that cell (if editable)

#### Cell Styling

Active cell:
```css
box-shadow: inset 0 0 0 1.5px #3b82f6, 0 0 0 1px rgba(59, 130, 246, 0.2);
/* dark: inset 0 0 0 1.5px #60a5fa, 0 0 0 1px rgba(96, 165, 250, 0.25) */
background-color: rgba(219, 234, 254, 0.5);
/* dark: rgba(30, 58, 95, 0.35) */
```

Selected cell (not active):
```css
background-color: rgba(191, 219, 254, 0.35);
/* dark: rgba(30, 58, 95, 0.2) */
```

#### Edit Input Overlay

When editing, an `<input>` is positioned absolutely over the cell:
```typescript
const editInputPosition = {
  top: cellRect.top - tableRect.top,
  left: cellRect.left - tableRect.left,
  width: cellRect.width,
  height: cellRect.height,
};
```
The input gets `autoFocus` and `select()` on mount.

#### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Arrow keys | Navigate (move active cell) |
| Shift+Arrow | Extend selection range |
| Tab | Move right (wraps to next row) |
| Shift+Tab | Move left (wraps to prev row) |
| Enter | Start editing active cell; when editing, commit and move down |
| F2 | Start editing active cell |
| Escape | Cancel edit |
| Delete/Backspace | Clear all selected cells (batch update) |
| Ctrl+C | Copy selection as TSV (tab-separated) |
| Ctrl+V | Paste TSV; single value fills all selected; multi-value tiles over selection |
| Ctrl+Z | Undo (max 50 states, column snapshot) |
| Ctrl+Y / Ctrl+Shift+Z | Redo |
| Ctrl+A | Select all cells |
| Any printable character | Start editing with that character |

#### Copy (Ctrl+C)

Builds a TSV string from selected cells' bounding box. Unselected cells within the box get empty string.

#### Paste (Ctrl+V)

- Parse clipboard as TSV (split on `\t` and `\n`)
- **Single value, multiple cells selected**: Fill all selected cells with that value
- **Multiple values, multiple cells selected**: Tile/repeat clipboard data across selection area
- **Single/no selection**: Paste starting from active cell, expanding down and right
- All updates applied via `batchUpdateCells()` in one call

#### Undo/Redo

- `undoStackRef` and `redoStackRef` are `useRef<Column[][]>([])`
- `MAX_UNDO = 50`
- `pushUndo()`: Snapshot current `selectedTable.columns`, push to undo stack, clear redo
- On undo: Pop undo stack, push current to redo, apply previous state
- On redo: Pop redo stack, push current to undo, apply redo state

#### Debounced Auto-Save

While editing a cell, a 300ms debounced timeout saves the current `editValue`:
```typescript
saveTimeoutRef.current = setTimeout(() => {
  updateCellValueRef.current(cell.row, cell.col, editValue, true); // skipUndo=true
}, 300);
```

#### Batch Update

Critical for paste and multi-delete. Instead of calling `updateCellValue` per cell (which reads stale state), `batchUpdateCells` clones columns, applies all changes, then calls `onUpdateTable` once.

### 3.5 Table List View

#### Columns

| Index | Label | Width | Type |
|-------|-------|-------|------|
| 0 | # | 50px | Read-only row number |
| 1 | Table Name | 22% | Clickable link (navigates to dictionary view) |
| 2 | _t | 70px | Checkbox (auto-checked if table name contains `_t`) |
| 3 | Domain | 12% | Editable (contentEditable in normal mode, input in Excel mode) |
| 4 | Explanation | 35% | Editable (contentEditable in normal mode, input in Excel mode) |
| 5 | Expl. Done? | 90px | Checkbox |
| 6 | To Ignore? | 80px | Checkbox |

`TABLE_LIST_COL_COUNT = 7`
`EDITABLE_COLS = [2, 3, 4, 5, 6]`

#### Excel-like Filter Dropdowns

Each column header has a `FilterHeader` component with:

1. **Filter icon button** (`Filter` + `ChevronDown` icons)
   - Shows count badge when filter is active
   - Highlighted background when filter active
2. **Filter dropdown** (position: absolute, top: 100%, zIndex: 1000):
   - Search input (autoFocus, Enter applies, Escape cancels)
   - "Select All" / "Clear All" toggle button
   - Scrollable checkbox list (max-height: 180px)
   - "Apply" and "Cancel" buttons
3. **Pending vs Applied filter state**: Changes in the dropdown are "pending" until Apply
4. **"Clear Filters" button**: Shown when any filter is active, resets all filters

#### Row Highlighting

- Completed tables (`explanationCompleted === true`): `backgroundColor: rgba(34, 197, 94, 0.08)` (light) or `rgba(34, 197, 94, 0.12)` (dark)
- Source tables show `SRC` badge next to table name

#### Excel Mode in Table List

Works the same as dictionary Excel mode but with 7 columns. Editable columns: 2 (_t), 3 (Domain), 4 (Explanation), 5 (Expl Done), 6 (To Ignore). For checkbox columns (2, 5, 6), Delete sets to 'N'.

### 3.6 Code View

- Shows generated DDL for the selected table via `generateTableDDL(selectedTable, script.type)`
- Uses `CodeEditor` component (read-only by default)
- **"Edit DDL" button**: Switches to editable mode
- **"Save & Sync" button**: Calls `replaceTableDDL(script.rawContent, selectedTable, codeViewText, script.type)` then `onUpdateScript(updatedRawContent)`. This preserves user metadata via `reparseScript`.
- **"Cancel" button**: Reverts to read-only mode

### 3.7 Data View

- Shows sample data as a table grid
- Columns: # (row number), then each column of the selected table
- Header shows column name (monospace) and type (small, faded)
- Rows built from `col.sampleValues[rowIdx]`
- `maxRows = Math.max(...columns.map(col => col.sampleValues?.length || 0))`
- NULL values shown as italic "NULL", empty values as `&nbsp;`
- Empty state: "No sample data attached" with instruction text

### 3.8 Master Codes View

- **Two sub-tabs**: "Codes" and "Categories" (toggle button group, same style as view mode)
- **Search box**: Filters by key or definition (case-insensitive)
- **Import button**: Opens `ImportMasterCodeModal` or `ImportMasterCodeCategoryModal`
- **Copy button**: Copies all entries as "KEY: definition" lines

Table structure:
| Column | Width | Notes |
|--------|-------|-------|
| # | 60px | Row number |
| Key | 220px | contentEditable, monospace (`code-cell`) |
| Definition | auto | contentEditable |
| (delete) | 50px | Trash2 icon button |

- Inline editing via `contentEditable` + `onBlur`
- Empty state: Dashed border box with "No master codes imported yet" + import link
- On edit: calls `onUpdateScriptPartial({ masterCodes: updated })`

### 3.9 Actions Dropdown

Button: `MoreVertical` icon + "Actions" + `ChevronDown`.
Dropdown items (in order, with table selected):

| Icon | Label | Action |
|------|-------|--------|
| `Edit3` | Edit Source | Enter full source edit mode |
| `FileDown` | Export JSON | Download `script.data` as JSON |
| `FileDown` | Export Excel | Open ExcelExportPreview modal |
| `Paperclip` | Sample Data | Open AttachSampleDataModal. Shows green count badge if attachments exist |
| `Upload` | Import Tables | Open ImportTablesModal |
| `Upload` | Import Descriptions | Open ImportTableDescriptionsModal |
| `FileText` | Import Explanations | Open ImportExplanationsModal |
| `ClipboardCopy` | Copy All Explanations | Copy all table.column explanations to clipboard |
| `ClipboardCopy` | Copy Table Explanations | Copy selected table's explanations (disabled if no table selected, opacity: 0.4) |
| `FileText` | Import Master Codes | Open ImportMasterCodeModal |
| `FileText` | Import Master Code Categories | Open ImportMasterCodeCategoryModal |
| `Eye` | Preview / Copy | Toggle export preview popup (disabled if no table selected) |

### 3.10 Export Preview Popup

- Position: absolute, top: 100%, right: 0, marginTop: 4px
- Width: 520px, maxHeight: 400px
- Header: table name + "Visible Columns" label, Copy button, Close button
- Content: `<pre>` block showing `generateExportText()`:
  ```
  TABLE.COLUMN: explanation | possible values
  ```
- Copy button shows "Copied!" feedback for 2 seconds

---

## 4. Excel Export - FULL SPECIFICATION

### 4.1 Column Definitions

```typescript
export const EXCEL_COLUMNS: { key: ExcelColumnKey; header: string; width: number }[] = [
  { key: 'column', header: 'Column', width: 28 },
  { key: 'type', header: 'Type', width: 22 },
  { key: 'nullable', header: 'Nullable', width: 14 },
  { key: 'default', header: 'Default', width: 20 },
  { key: 'explanation', header: 'Explanation', width: 56 },
  { key: 'mapping', header: 'Mapping Logic', width: 38 },
  { key: 'sampleValues', header: 'Sample Values', width: 36 },
  { key: 'possibleValues', header: 'Possible Values', width: 52 },
  { key: 'mappedTo', header: 'Mapped To', width: 42 },
  { key: 'migrationNeeded', header: 'Migration Needed', width: 18 },
  { key: 'nonMigrationComment', header: 'Non-Migration Comment', width: 36 },
];
```

### 4.2 Color Constants

```typescript
const TITLE_BG = '1B3A5C';           // Dark blue
const TITLE_FONT_COLOR = 'FFFFFF';    // White
const SECTION_BG = '2C5282';          // Medium dark blue
const SECTION_FONT_COLOR = 'FFFFFF';
const HEADER_BG = 'E2E8F0';           // Light gray
const HEADER_FONT_COLOR = '1A202C';
const CELL_FONT_COLOR = '000000';
const CODE_FONT_COLOR = '1A365D';     // Dark blue for code cells
const LABEL_BG = 'F7FAFC';            // Very light gray for info labels
const BORDER_COLOR = '000000';         // Black borders
```

### 4.3 Workbook Structure

Uses `exceljs` library. Structure:

#### Index Sheet
- Title row: merged across 5 columns, 14pt bold Calibri, dark blue background, height 30
- Section headers: "Table List (N)" for targets, "Source Tables (N)" for sources
- Table list with columns: #, Schema, Table Name (hyperlink to table sheet), Description, Columns
- Table Name column: Consolas font, blue underlined hyperlink
- Auto-filter on header row

#### Per-Table Sheets
- Sheet name: sanitized (`[\[\]:*?/\\]` replaced with `_`, max 31 chars), prefixed with `SRC_` for source tables
- Deduplication: appends `_1`, `_2`, etc. if names collide
- Row 1: "Back to Index" hyperlink (blue, underlined)
- **Table Information section** (4 cols max): Title row (dark blue), info rows (Schema, Table Name, Total Columns, Description)
- **Constraints section**: Section header (medium blue), constraint headers (light gray), constraint rows
- **Column Details section**: Section header, column headers with auto-filter, data rows

#### Cell Formatting
- Fonts: Calibri for text, Consolas for code cells (column name, type)
- All cells have thin black borders on all sides
- Data rows: vertical align top, horizontal left, wrapText: true
- `column` and `type` columns use Consolas 10pt bold, color `CODE_FONT_COLOR`

#### Nullable Display Logic
```
Y/YES -> "NULL"
N/NO  -> "NOT NULL"
other -> as-is
```

#### Row Height Estimation
```typescript
const DATA_ROW_HEIGHT = 20;
const MAX_ROW_HEIGHT = 120;
const CHARS_PER_LINE = 40;
const LINE_HEIGHT = 14;

function estimateRowHeight(values: string[], colWidths: number[]): number {
  let maxLines = 1;
  values.forEach((val, i) => {
    if (!val) return;
    const charWidth = colWidths[i] || CHARS_PER_LINE;
    const lines = Math.ceil(val.length / (charWidth * 0.9)) + (val.split('\n').length - 1);
    if (lines > maxLines) maxLines = lines;
  });
  return Math.min(Math.max(DATA_ROW_HEIGHT, maxLines * LINE_HEIGHT), MAX_ROW_HEIGHT);
}
```

#### Appendix Sheet (Master Code Definitions)
- Navigation: "Back to Index" hyperlink
- Title: merged, 14pt bold, dark blue
- Headers: Key, Definition (widths 30, 80)
- Key column: Consolas bold, Definition: Calibri
- Auto-filter on header row

#### Appendix - Categories Sheet
- Same structure as Appendix sheet but for `masterCodeCategories`

### 4.4 ExcelExportPreview Component

```typescript
interface ExcelExportPreviewProps {
  scriptName: string;
  tables: Array<Table & { isSource?: boolean }>;
  getMappingInfo: (tableName: string, colName: string) => string | null;
  getColumnTags: (table: Table, colName: string) => string[];
  onClose: () => void;
  isDarkTheme?: boolean;
  masterCodes?: MasterCode[];
  masterCodeCategories?: MasterCodeCategory[];
}
```

Full-screen modal with:
- **Header**: script name, close button (X)
- **Left sidebar**: table selector with checkboxes to include/exclude tables
- **Column visibility toggles**: checkboxes for each EXCEL_COLUMN
- **Two preview modes**:
  - "Index" page: shows the Index sheet preview
  - "Table" page: shows per-table sheet preview (navigate between tables with arrows)
- **Live HTML preview**: renders tables matching Excel output styling with the same color constants
- **Export button** (`FileDown` icon): triggers `exportDataDictionaryToExcel()` which generates and downloads `.xlsx`
- Dark theme support via `isDarkTheme` prop

---

## 5. ERD Viewer - FULL SPECIFICATION

### 5.1 Technology

- `react-konva` (Konva.js) for canvas rendering: `Stage`, `Layer`, `Rect`, `Text`, `Line`, `Group`, `Path`
- Layout algorithms: `@dagrejs/dagre` (default) and `elkjs` (smart mode)

### 5.2 ERD Constants

```typescript
export const SIZING = {
  TABLE_MIN_WIDTH: 250,
  TABLE_MAX_WIDTH: 440,
  COLUMN_HEIGHT: 34,
  TABLE_COLOR_HEIGHT: 6,
  TABLE_HEADER_HEIGHT: 40,
  LINE_HEIGHT: 25,
  PADDING: 5,
  TABLES_GAP_X: 80,
  TABLES_GAP_Y: 60,
  DIAGRAM_PADDING: 60,
  CONNECTION_STROKE_WIDTH: 2,
  CONNECTION_MIN_MARGIN: 40,
  CROSS_CONNECTION_MIN_MARGIN: 20,
  CONNECTION_HANDLE_OFFSET: 20,
  STAGE_SCALE_BY: 1.02,
  RELATION_SYMBOL_OFFSET: 8,
};

export const FONTS = {
  FAMILY: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  SIZE_SM: 14,
  SIZE_MD: 16,
  SIZE_LG: 18,
  SIZE_TABLE_TITLE: 16,
};
```

### 5.3 Table Colors (17 colors)

```typescript
export const TABLE_COLORS = [
  { regular: '#6366f1', lighter: '#e0e7ff' },  // Indigo
  { regular: '#8b5cf6', lighter: '#ede9fe' },  // Violet
  { regular: '#a855f7', lighter: '#f3e8ff' },  // Purple
  { regular: '#d946ef', lighter: '#fae8ff' },  // Fuchsia
  { regular: '#ec4899', lighter: '#fce7f3' },  // Pink
  { regular: '#f43f5e', lighter: '#ffe4e6' },  // Rose
  { regular: '#ef4444', lighter: '#fee2e2' },  // Red
  { regular: '#f97316', lighter: '#ffedd5' },  // Orange
  { regular: '#f59e0b', lighter: '#fef3c7' },  // Amber
  { regular: '#eab308', lighter: '#fef9c3' },  // Yellow
  { regular: '#84cc16', lighter: '#ecfccb' },  // Lime
  { regular: '#22c55e', lighter: '#dcfce7' },  // Green
  { regular: '#10b981', lighter: '#d1fae5' },  // Emerald
  { regular: '#14b8a6', lighter: '#ccfbf1' },  // Teal
  { regular: '#06b6d4', lighter: '#cffafe' },  // Cyan
  { regular: '#0ea5e9', lighter: '#e0f2fe' },  // Sky
  { regular: '#3b82f6', lighter: '#dbeafe' },  // Blue
];
```

### 5.4 Theme Constants

**Light Theme:**
```typescript
export const LIGHT_THEME = {
  text: { primary: '#1f2937', secondary: '#6b7280' },
  connection: { active: '#3b82f6', default: '#9ca3af' },
  table: { background: '#ffffff', headerBackground: '#f8fafc', border: '#e5e7eb', shadow: 'rgba(0, 0, 0, 0.08)' },
  canvas: { background: '#f9fafb', grid: '#e5e7eb' },
  accent: { primary: '#3b82f6', success: '#22c55e', warning: '#f59e0b', danger: '#ef4444' },
};
```

**Dark Theme (Slate):**
```typescript
export const DARK_THEME = {
  text: { primary: '#f3f4f6', secondary: '#9ca3af' },
  connection: { active: '#60a5fa', default: '#6b7280' },
  table: { background: '#1f2937', headerBackground: '#374151', border: '#4b5563', shadow: 'rgba(0, 0, 0, 0.3)' },
  canvas: { background: '#111827', grid: '#1f2937' },
  accent: { primary: '#60a5fa', success: '#34d399', warning: '#fbbf24', danger: '#f87171' },
};
```

**VS Code Gray Theme:**
```typescript
export const VSCODE_GRAY_THEME = {
  text: { primary: '#d4d4d4', secondary: '#858585' },
  connection: { active: '#569cd6', default: '#505050' },
  table: { background: '#252526', headerBackground: '#2d2d30', border: '#3c3c3c', shadow: 'rgba(0, 0, 0, 0.4)' },
  canvas: { background: '#1e1e1e', grid: '#252526' },
  accent: { primary: '#569cd6', success: '#4ec9b0', warning: '#dcdcaa', danger: '#f48771' },
};
```

### 5.5 Table Node Rendering (Konva)

Each table is a `Group` containing:
1. Shadow `Rect` (behind everything, slight offset)
2. Colored strip at top (TABLE_COLOR_HEIGHT = 6px, using TABLE_COLORS[index % 17])
3. Header `Rect` (TABLE_HEADER_HEIGHT = 40px) with table name `Text` (schema.tableName)
4. Column rows: each COLUMN_HEIGHT = 34px with:
   - Column name `Text` (left-aligned)
   - Column type `Text` (right-aligned, secondary color)
   - PK/FK/UQ indicator icons

### 5.6 FK Connections

- Bezier curves (`Line` with `bezier: true`) connecting FK source to referenced table
- Crow's foot notation at the target end
- Connection color: theme.connection.active for hovered, theme.connection.default otherwise

### 5.7 Layout Algorithms

**Dagre (default):**
- `rankdir: 'LR'` (left-to-right)
- `ranksep: TABLES_GAP_X`, `nodesep: TABLES_GAP_Y`

**ELK (smart mode):**
- `elk.algorithm: 'layered'`
- Better handling of complex graphs

### 5.8 Interaction

- **Drag tables**: mousedown on table header, mousemove updates position
- **Zoom**: mouse wheel, `STAGE_SCALE_BY = 1.02`
- **Pan**: drag on empty canvas area
- **Marquee select**: Ctrl+drag draws selection rectangle
- **Search**: Ctrl+F opens search overlay for tables/columns
- **Fullscreen toggle**: Maximize icon button
- **Export to image**: Download icon button
- **Position persistence**: saved to localStorage per script ID

### 5.9 Toolbar

Icons from `lucide-react`: `ZoomIn`, `ZoomOut`, `Maximize2`, `Download`, `RotateCcw`, `Maximize`, `Search`, `X`, `RefreshCw`, `Copy`, `MousePointer2`

---

## 6. Sidebar Component

### 6.1 Structure

```
.sidebar (width: 100%, bg: #2c3e50, color: white)
  .sidebar-header (bg: #233140) - "Renaissance DM"
  .sidebar-nav - View navigation buttons
  .search-box (bg: #233140) - Search input
  .script-list - Table list grouped by schema
```

### 6.2 Navigation Buttons

| View | Icon | Label |
|------|------|-------|
| scripts | `FileCode` | Scripts |
| dictionary | `Database` | Data Dictionary |
| compare | `GitCompare` | Schema Compare |
| erd | `Share2` | ERD Viewer |
| mapping | `ArrowRightLeft` | Data Mapping |
| flowcharts | `Workflow` | Flowcharts |

Active button: `background-color: #3498db`, `color: white`, `font-weight: 600`

### 6.3 Table List

- Shown only in dictionary view with active script
- Search box with `Search` icon (filters tables and columns)
- Tables grouped by schema (collapsible with `ChevronDown` arrow)
- Selected table: class `active`
- When search matches columns but not table name, shows nested column list with match highlighting

### 6.4 Column Search Results

When search matches column names, shows a nested `<ul>` under the table item:
- Left border: 2px solid #e5e7eb
- Each column shows: `Columns` icon (10px), highlighted column name, type in monospace

---

## 7. DDL Parsers (utils/parsers.ts)

### 7.1 Main API

```typescript
export function parseScript(content: string, type: ScriptType): ScriptData;
export function reparseScript(content: string, type: ScriptType, oldData: ScriptData): ScriptData;
export function detectScriptType(content: string): ScriptType;
```

### 7.2 PostgreSQL Parser (`parsePostgreSQL`)

Algorithm:
1. Clean comments: remove `--` line comments and `/* */` block comments
2. Find `CREATE TABLE` statements using regex with optional `IF NOT EXISTS`, optional schema
3. For each match, use paren-depth matching to find the closing `)` of the CREATE TABLE body
4. Split body by commas (respecting nested parens via `splitSqlParams()`)
5. For each line:
   - If starts with `CONSTRAINT` or `PRIMARY KEY` and contains `PRIMARY KEY(...)`: parse as PK constraint
   - If starts with `CONSTRAINT` or `UNIQUE` and contains `UNIQUE(...)`: parse as Unique constraint
   - If starts with `CONSTRAINT` or `FOREIGN` and contains `FOREIGN KEY(...)REFERENCES...`: parse as FK constraint
   - Otherwise: parse as column definition (name + type + nullable/default)
6. Parse `ALTER TABLE ... ADD FOREIGN KEY` statements after CREATE TABLE blocks
7. Type normalization: BPCHAR->CHAR, INT8->BIGINT, INT4->INTEGER, FLOAT8->DOUBLE PRECISION, INT2->SMALLINT, BOOL->BOOLEAN
8. Default parsing: Detect `GENERATED ... AS IDENTITY` patterns, regular `DEFAULT` values
9. Nullable: Check for `NOT NULL` in rest of column definition

### 7.3 Oracle Parser (`parseOracle`)

Similar to PostgreSQL but handles Oracle-specific syntax:
- `NUMBER(10,2)`, `VARCHAR2(100)`, `CLOB`, `BLOB`
- `DEFAULT SYSDATE`
- Oracle quoting with double-quotes

### 7.4 DBML Parser (`parseDBML`)

- Regex: `Table schema.name { ... }`
- Column format: `name type [settings]`
- Settings: `pk`, `not null`, `unique`, `default: value`, `ref: > table.col`

### 7.5 reparseScript (Metadata Preservation)

Critical function that re-parses DDL while preserving user-entered metadata:

```typescript
export function reparseScript(content: string, type: ScriptType, oldData: ScriptData): ScriptData {
  const newData = parseScript(content, type);
  // Merge metadata from oldData into newData:
  // - Table-level: description, schema, explanationCompleted, toIgnore
  // - Column-level: explanation, mapping, migrationNeeded, nonMigrationComment, sampleValues, possibleValues
  // Match by table name (case-insensitive) and column name (case-insensitive)
  return mergedData;
}
```

---

## 8. Storage (utils/storage.ts)

### 8.1 localStorage Keys

| Key | Purpose |
|-----|---------|
| `dm_tool_data` | Main scripts array |
| `dm_tool_theme` | Theme preference ('light' / 'dark') |
| `dm_tool_theme_variant` | Dark theme variant ('slate' / 'vscode-gray') |
| `dm_tool_mapping_projects` | Column mapping projects |
| `dm_tool_type_rule_sets` | Type compatibility rule sets |
| `dm_tool_mapping_workspace` | Mapping workspace state |
| `dm_flowchart_scripts` | Flowchart (PUML) scripts |
| `dm_tool_script_order` | Custom script ordering |
| `dd_visible_columns_{scriptId}` | Data dictionary visible columns per script |
| `dd_column_widths_{scriptId}` | Data dictionary column widths per script |
| `excel_export_columns_{scriptId}` | Excel export column selection per script |
| `erd_positions_{scriptId}` | ERD table positions per script |

### 8.2 Core Functions

```typescript
export function loadScripts(): Script[];
export function saveScripts(scripts: Script[]): void;
export function generateId(): string;                    // crypto.randomUUID() or fallback
export function loadTheme(): 'light' | 'dark';
export function saveTheme(theme: 'light' | 'dark'): void;
export function downloadJson(data: any, filename: string): void;

// Data Dictionary column visibility
export function loadDDVisibleColumns(scriptId: string): { visible: string[]; knownColumns?: string[] } | null;
export function saveDDVisibleColumns(scriptId: string, visible: string[], knownColumns: string[]): void;

// Data Dictionary column widths
export function loadDDColumnWidths(scriptId: string): Record<string, number> | null;
export function saveDDColumnWidths(scriptId: string, widths: Record<string, number>): void;

// Excel export columns
export function loadExcelExportColumns(scriptId: string): string[] | null;
export function saveExcelExportColumns(scriptId: string, columns: string[]): void;

// Mapping projects
export function loadMappingProjects(): MappingProject[];
export function saveMappingProject(project: MappingProject): void;
```

### 8.3 Workspace Export/Import

```typescript
export interface WorkspaceData {
  version: string;  // "1.1.0"
  exportedAt: number;
  scripts: Script[];
  mappingProjects: MappingProject[];
  typeRuleSets: TypeRuleSet[];
  flowchartScripts: FlowchartScript[];
  theme: 'light' | 'dark';
  themeVariant: 'slate' | 'vscode-gray';
}

export function exportWorkspace(): WorkspaceData;
export function importWorkspace(data: WorkspaceData): void;
```

---

## 9. Script Manager (ScriptManager.tsx)

### 9.1 Layout

Split panel:
- **Left panel**: Script list with drag-and-drop reordering
- **Right panel**: Selected script detail (read-only CodeEditor or edit mode)

### 9.2 Script List Item

Shows: name, type badge (color-coded), version badge (if versioning enabled), last updated date, table count

### 9.3 Create Script

Form with:
- Script name (text input)
- Script type (select: PostgreSQL, Oracle, DBML) with auto-detect checkbox
- DDL content (CodeEditor component)

### 9.4 Actions

- Edit (toggle CodeEditor to editable)
- Copy to clipboard
- Download as .sql/.dbml file
- Delete (with confirmation)
- Attach Sample Data
- Import Explanations
- Import Table Descriptions
- Import DDL (Insert/Replace tables)
- Enable Versioning / View Version History

---

## 10. Import Modals

### 10.1 Import Explanations Modal

**Format**: `TABLE.COLUMN: explanation` or `TABLE.COLUMN: explanation | possible values`

Parse flow:
1. Split input by newlines
2. Match regex: `/^([^.]+)\.([^:]+):\s*(.+)$/`
3. Split values on `|` to separate explanation from possibleValues
4. Match against script tables/columns (case-insensitive)
5. Show preview with matched (green check) and unmatched (yellow warning)
6. Apply: update column.explanation and column.possibleValues

### 10.2 Import Table Descriptions Modal

**Format**: `TABLE_NAME | Description | Domain | ToIgnore`

- Pipe-separated
- Auto-skips header line if detected
- ToIgnore: Y/YES/TRUE/1 = true, N/NO/FALSE/0 = false
- Matches tables case-insensitive, supports partial matching

### 10.3 Import Master Codes Modal

**Format**: `KEY: definition` or `KEY | definition` or `KEY\tdefinition`

- Detects duplicates against existing codes
- Merge strategy: update existing keys, add new ones
- Shows existing codes list with delete buttons

### 10.4 Import Master Code Categories Modal

Same as Import Master Codes but operates on `script.masterCodeCategories`.

---

## 11. Theme System

### 11.1 Toggle

- Light/Dark toggle in Settings modal
- Dark theme has two variants: 'slate' (default) and 'vscode-gray'

### 11.2 CSS Classes

```css
body { /* light theme defaults */ }
body.dark-theme { /* dark theme overrides */ }
body.dark-theme.vscode-gray { /* VS Code gray variant overrides */ }
```

### 11.3 Key Color Values

**Light theme:**
- Body bg: `#f4f4f9`
- Sidebar bg: `#2c3e50`
- Main content bg: `#fff`
- Toolbar bg: `#f8f9fa`

**Dark theme (Slate):**
- Body bg: `#0f172a`
- Main content bg: `#1e293b`
- Text primary: `#e4e4e7`
- Border: `#334155`

**Dark theme (VS Code Gray):**
- Body bg: `#1e1e1e`
- Main content bg: `#252526`
- Text primary: `#d4d4d4`
- Border: `#3c3c3c`

### 11.4 Component-Level Theme

Components receive `isDarkTheme` and `darkThemeVariant` props. Theme colors are computed inline:

```typescript
const isVscode = darkThemeVariant === 'vscode-gray';
const bgColor = isDarkTheme ? (isVscode ? '#1e1e1e' : '#1e293b') : '#ffffff';
const textColor = isDarkTheme ? '#e4e4e7' : '#18181b';
const textSecondary = isDarkTheme ? '#a1a1aa' : '#71717a';
const borderColor = isDarkTheme ? (isVscode ? '#3c3c3c' : '#334155') : '#e5e7eb';
const cardBg = isDarkTheme ? (isVscode ? '#252526' : '#0f172a') : '#f9fafb';
```

---

## 12. Workspace Import

### 12.1 Loading Sequence (App.tsx)

1. On mount, try to load from Electron file (if running in Electron)
2. Fallback: load from localStorage
3. `loadScripts()` reads from `dm_tool_data` key
4. Set active script to first script
5. Apply theme from `dm_tool_theme` and variant from `dm_tool_theme_variant`

### 12.2 workspace-slim.json Import

To initialize the app with existing data:
1. Use Settings modal > Workspace tab > Import Workspace
2. Upload `workspace-slim.json` (or `workspace.json`)
3. `importWorkspace()` writes all data to localStorage
4. App reloads scripts from localStorage

### 12.3 Data Flow

```
User creates script (name, type, DDL content)
  -> parseScript(content, type) -> ScriptData { targets: Table[], sources: Table[] }
  -> Script object with id, rawContent, data
  -> saveScripts() to localStorage

User edits table metadata (explanation, mapping, etc.)
  -> onUpdateTable(tableId, updates) -> update in-memory + saveScripts()

User edits DDL (source edit or code view)
  -> onUpdateScript(rawContent)
  -> reparseScript(rawContent, type, oldData) // preserves metadata
  -> saveScripts()
```

---

## 13. DDL Generator (utils/ddlGenerator.ts)

### 13.1 generateTableDDL

```typescript
export function generateTableDDL(table: Table, scriptType: ScriptType): string;
```

For SQL (PostgreSQL/Oracle):
- `CREATE TABLE [schema.]tableName (`
- Column lines: `name type [NOT NULL] [DEFAULT value]`
- Inline constraints: PRIMARY KEY, UNIQUE
- `);\n`
- ALTER TABLE for Foreign Keys

For DBML:
- `Table schema.tableName {`
- Column lines: `name type [settings]`
- `}`

### 13.2 replaceTableDDL

```typescript
export function replaceTableDDL(
  rawContent: string, table: Table, newDDL: string, scriptType: ScriptType
): string;
```

Finds and replaces the specific table's CREATE TABLE block (and FK ALTER TABLE blocks) in the raw script content. Uses paren-depth matching to find block boundaries.

---

## 14. CodeEditor Component

```typescript
interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: ScriptType | 'puml';
  isDarkTheme?: boolean;
  darkThemeVariant?: 'slate' | 'vscode-gray';
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: string;
  searchText?: string;
  searchMatches?: Array<{ start: number; end: number }>;
  currentMatchIndex?: number;
}
```

- Uses `react-simple-code-editor` with `prismjs` syntax highlighting
- Language mapping: postgresql/oracle -> 'sql', dbml/puml -> 'javascript'
- Font: Consolas, 13px, line-height 1.6
- Search highlighting: DOM manipulation with `<mark>` elements
- VS Code-inspired theme colors applied via CSS custom properties

---

## 15. App.tsx - Top-Level Component

### 15.1 State

```typescript
const [scripts, setScripts] = useState<Script[]>([]);
const [activeScriptId, setActiveScriptId] = useState<string | null>(null);
const [view, setView] = useState<AppView>('dictionary');
const [theme, setTheme] = useState<'light' | 'dark'>('light');
const [darkThemeVariant, setDarkThemeVariant] = useState<DarkThemeVariant>('slate');
const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
const [searchTerm, setSearchTerm] = useState('');
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
const [sidebarWidth, setSidebarWidth] = useState(280);
```

### 15.2 Layout

```
.app-container (display: flex, height: 100vh)
  Sidebar (width: sidebarWidth, collapsible)
  Resize Handle (6px, cursor: col-resize, min 200, max 500)
  .main-container (flex: 1)
    .toolbar (script dropdown, settings, sidebar toggle)
    .content-area (renders active view)
```

### 15.3 Script Management Callbacks

```typescript
createScript(name, type, content) -> parseScript -> saveScripts
updateScript(id, updates) -> saveScripts
deleteScript(id) -> saveScripts
updateTable(tableId, updates, isSource?) -> update in script.data -> saveScripts
```

### 15.4 View Rendering

```typescript
switch (view) {
  case 'scripts': return <ScriptManager ... />;
  case 'dictionary': return <DataDictionary ... />;
  case 'erd': return <ERDViewer ... />;
  // compare, mapping, flowcharts - not needed for recreation
}
```

---

## 16. CSS Core Layout (styles/index.css)

### 16.1 Global

```css
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #f4f4f9;
  color: #333;
  overflow: hidden;
}
```

### 16.2 Layout Classes

```css
.app-container { display: flex; height: 100vh; overflow: hidden; }
.sidebar { width: 100%; height: 100%; background-color: #2c3e50; color: white; display: flex; flex-direction: column; }
.sidebar-header { padding: 16px 20px; background-color: #233140; border-bottom: 1px solid #1a252f; }
.sidebar-header h1 { font-size: 16px; font-weight: 700; letter-spacing: 0.5px; }
.sidebar-nav { padding: 12px 0; border-bottom: 1px solid #34495e; }
.nav-btn { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 20px; background: transparent; border: none; color: #bdc3c7; font-size: 13px; cursor: pointer; }
.nav-btn:hover { background-color: #34495e; color: white; }
.nav-btn.active { background-color: #3498db; color: white; font-weight: 600; }
.main-container { flex: 1; display: flex; flex-direction: column; overflow: hidden; background-color: #fff; }
.toolbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background-color: #f8f9fa; border-bottom: 1px solid #e0e0e0; }
.btn { padding: 8px 16px; border: 1px solid #ddd; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 13px; }
```

### 16.3 Data Table

```css
.data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.data-table th { padding: 8px 12px; text-align: left; background-color: #f0f0f0; border: 1px solid #e0e0e0; font-weight: 600; font-size: 12px; }
.data-table td { padding: 8px 12px; border: 1px solid #e0e0e0; vertical-align: top; }
.code-cell { font-family: 'Consolas', 'Courier New', monospace; font-size: 12px; }
```

---

## 17. Key Implementation Notes

### 17.1 Table ID Generation

Tables get sequential integer IDs during parsing (`idCounter++`). Source tables are stored in `script.data.sources`, target tables in `script.data.targets`.

### 17.2 Source vs Target Tables

A table is identified as source or target based on which array it's in:
```typescript
const selectedTableFromTargets = script.data.targets.find(t => t.id === selectedTableId);
const selectedTableFromSources = script.data.sources?.find(t => t.id === selectedTableId);
const selectedTable = selectedTableFromTargets || selectedTableFromSources;
const isSourceTable = !selectedTableFromTargets && !!selectedTableFromSources;
```

### 17.3 Mapped To Column (Index 8)

The "Mapped To" column is computed, not stored. It checks mapping projects:
```typescript
const getMappingInfo = (tableName: string, columnName: string) => {
  for (const project of mappingProjects) {
    // Check if this script is source -> "Mapped to targetTable.targetColumn"
    // Check if this script is target -> "Mapped from sourceTable.sourceColumn"
  }
  return null;
};
```

If no mapping found and `col.migrationNeeded === false`, shows "Not Mapped" + nonMigrationComment.

### 17.4 Lucide Icons Used

Main icons from `lucide-react`:
- Navigation: `FileCode`, `Database`, `GitCompare`, `Share2`, `ArrowRightLeft`, `Workflow`
- Actions: `Edit3`, `Save`, `X`, `FileDown`, `Upload`, `Paperclip`, `ClipboardCopy`, `Eye`, `FileText`, `Trash2`, `MoreVertical`, `BookOpen`
- UI: `Grid3X3`, `Table` (as `TableIcon`), `Rows3`, `List`, `Filter`, `ChevronDown`, `Settings2`, `Search`, `Plus`, `Copy`, `Download`
- ERD: `ZoomIn`, `ZoomOut`, `Maximize2`, `Maximize`, `RotateCcw`, `RefreshCw`, `MousePointer2`

### 17.5 Dark Theme Application

```typescript
// Toggle
if (newTheme === 'dark') {
  document.body.classList.add('dark-theme');
  if (darkThemeVariant === 'vscode-gray') {
    document.body.classList.add('vscode-gray');
  }
} else {
  document.body.classList.remove('dark-theme');
  document.body.classList.remove('vscode-gray');
}
```

---

## 18. Settings Modal (SettingsModal.tsx)

Tabs: `appearance`, `workspace`, `git-sync`, `logs`, `erd`

### Appearance Tab
- Light/Dark theme toggle (Sun/Moon icons)
- Dark theme variant toggle: "Slate" vs "VS Code Gray" (Palette icon)

### Workspace Tab
- Export Workspace (downloads JSON)
- Import Workspace (file upload)
- Clear All Data (with confirmation)

### ERD Tab
- Group temporal colors toggle
- Smart auto-layout toggle
- Zoom sensitivity slider

---

## 19. Attach Sample Data Modal

Allows uploading a CSV file to populate column `sampleValues`:

1. File upload (click-to-browse, drag-and-drop styled)
2. CSV parsing: expects `TBL_NAME` column to identify tables
3. Auto-matching: matches CSV tables to script tables by name, then by column overlap
4. Preview: shows matched/unmatched tables and columns with expand/collapse
5. Shows "Tables Without Sample Data" section for script tables not in CSV
6. Apply: sets `col.sampleValues` arrays and creates `SampleDataAttachment` record

---

## 20. Recreating with Reduced Scope

Since the user only needs Data Dictionary + ERD + Excel Export, you can omit:
- Schema Compare (`SchemaCompare.tsx`)
- Column Mapper (`ColumnMapper.tsx`)
- Flowchart Viewer (`FlowchartViewer.tsx`)
- PUML types and parsing
- Mapping types and storage

Keep the Sidebar navigation but disable/hide Compare, Mapping, and Flowcharts buttons. The core data flow remains:

```
Script (rawContent + type)
  -> parseScript() -> ScriptData { targets, sources }
  -> DataDictionary renders selected table
  -> ExcelExportPreview -> exportDataDictionaryToExcel()
  -> ERDViewer renders tables with FK connections
```

All user-entered metadata (explanations, mappings, descriptions, master codes) is persisted via `saveScripts()` to localStorage and survives page reloads.
