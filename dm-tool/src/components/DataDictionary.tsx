import { useState, useRef, useEffect, useCallback } from 'react';
import { Script, Table, Column } from '../types';
import { downloadJson, loadMappingProjects } from '../utils/storage';
import CodeEditor from './CodeEditor';
import { FileDown, Edit3, Save, X, Grid3X3, Table as TableIcon, Database, Rows3, List, Filter, ChevronDown, Settings2 } from 'lucide-react';

// Cell coordinate type for Excel-like selection
interface CellCoord {
  row: number;
  col: number; // 0=name, 1=type, 2=nullable, 3=default, 4=explanation, 5=mapping, 6=sampleValues (read-only), 7=mappedTo (computed)
}

// Column fields for copy operations (6=sampleValues read-only, 7=mappedTo computed)
const COLUMN_COUNT = 8;

interface DataDictionaryProps {
  script: Script;
  selectedTableId: number | null;
  onSelectTable: (id: number | null) => void;
  onUpdateTable: (tableId: number, updates: Partial<Table>, isSource?: boolean) => void;
  onUpdateScript: (rawContent: string) => void;
  isDarkTheme?: boolean;
  darkThemeVariant?: 'slate' | 'vscode-gray';
}

export default function DataDictionary({
  script,
  selectedTableId,
  onSelectTable: _onSelectTable,
  onUpdateTable,
  onUpdateScript,
  isDarkTheme = false,
  darkThemeVariant = 'slate'
}: DataDictionaryProps) {
  // _onSelectTable is available for future use (e.g., clicking related tables)
  void _onSelectTable;
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');

  // View mode: 'tableList' for all tables, 'dictionary' for column definitions, 'data' for sample data rows
  const [viewMode, setViewMode] = useState<'tableList' | 'dictionary' | 'data'>('dictionary');

  // Table List filters
  // Multi-select filter state (arrays for Excel-like filtering)
  interface TableListFilters {
    tableName: string[];
    domain: string[];
    purpose: string[];
    toIgnore: string[]; // 'Y', 'N'
  }
  const [tableListFilters, setTableListFilters] = useState<TableListFilters>({
    tableName: [],
    domain: [],
    purpose: [],
    toIgnore: [],
  });
  // Pending filters - only applied when user clicks Apply
  const [pendingFilters, setPendingFilters] = useState<TableListFilters>({
    tableName: [],
    domain: [],
    purpose: [],
    toIgnore: [],
  });
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);
  const [filterSearchText, setFilterSearchText] = useState('');

  // Column visibility for dictionary view
  type ColumnKey = 'column' | 'type' | 'nullable' | 'default' | 'explanation' | 'mapping' | 'sampleValues' | 'mappedTo';
  const allColumns: { key: ColumnKey; label: string; width: string }[] = [
    { key: 'column', label: 'Column', width: '12%' },
    { key: 'type', label: 'Type', width: '10%' },
    { key: 'nullable', label: 'Nullable', width: '6%' },
    { key: 'default', label: 'Default', width: '7%' },
    { key: 'explanation', label: 'Explanation', width: '14%' },
    { key: 'mapping', label: 'Mapping Logic', width: '14%' },
    { key: 'sampleValues', label: 'Sample Values', width: '17%' },
    { key: 'mappedTo', label: 'Mapped To', width: '20%' },
  ];
  const [visibleColumns, setVisibleColumns] = useState<Set<ColumnKey>>(new Set(allColumns.map(c => c.key)));
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Excel-like editing mode
  const [excelMode, setExcelMode] = useState(false);
  const [selectedCells, setSelectedCells] = useState<CellCoord[]>([]);
  const [activeCell, setActiveCell] = useState<CellCoord | null>(null);
  const [editingCell, setEditingCell] = useState<CellCoord | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectionStart, setSelectionStart] = useState<CellCoord | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const tableRef = useRef<HTMLTableElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateCellValueRef = useRef<(row: number, col: number, value: string, skipUndo?: boolean) => void>(() => {});
  const editingCellRef = useRef<CellCoord | null>(null);
  const [editInputPosition, setEditInputPosition] = useState<{ top: number; left: number; width: number; height: number } | null>(null);

  // Undo/Redo history stacks (stores column snapshots)
  const undoStackRef = useRef<Column[][]>([]);
  const redoStackRef = useRef<Column[][]>([]);
  const MAX_UNDO = 50;

  // Find selected table from both targets and sources
  const selectedTableFromTargets = script.data.targets.find(t => t.id === selectedTableId);
  const selectedTableFromSources = script.data.sources?.find(t => t.id === selectedTableId);
  const selectedTable = selectedTableFromTargets || selectedTableFromSources;
  const isSourceTable = !selectedTableFromTargets && !!selectedTableFromSources;

  // Load mapping projects to show mapping info
  const mappingProjects = loadMappingProjects();

  // Find relevant mapping for current column
  const getMappingInfo = (tableName: string, columnName: string) => {
    for (const project of mappingProjects) {
      // Check if this script is source
      if (project.sourceScriptId === script.id) {
        const mapping = project.mappings.find(
          m => m.sourceTable === tableName && m.sourceColumn === columnName
        );
        if (mapping) {
          const targetInfo = `${mapping.targetTable}.${mapping.targetColumn}`;
          const remarks = mapping.remarks || '';
          return `Mapped to ${targetInfo}${remarks ? ` - ${remarks}` : ''}`;
        }
      }
      // Check if this script is target
      if (project.targetScriptId === script.id) {
        const mapping = project.mappings.find(
          m => m.targetTable === tableName && m.targetColumn === columnName
        );
        if (mapping) {
          const sourceInfo = `${mapping.sourceTable}.${mapping.sourceColumn}`;
          const remarks = mapping.remarks || '';
          return `Mapped from ${sourceInfo}${remarks ? ` - ${remarks}` : ''}`;
        }
      }
    }
    return null;
  };

  // Get PK, FK, UQ columns
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

  // Update column field
  const updateColumnField = (colName: string, field: keyof Column, value: string) => {
    if (!selectedTable) return;

    const updatedColumns = selectedTable.columns.map(col => {
      if (col.name === colName) {
        return { ...col, [field]: value };
      }
      return col;
    });

    onUpdateTable(selectedTable.id, { columns: updatedColumns }, isSourceTable);
  };

  // ============================================
  // EXCEL-LIKE EDITING FUNCTIONS
  // ============================================

  // Get cell value by coordinates (for copy operation)
  const getCellValue = useCallback((row: number, col: number): string => {
    if (!selectedTable || row < 0 || row >= selectedTable.columns.length) return '';
    const column = selectedTable.columns[row];

    switch (col) {
      case 0: return column.name || '';
      case 1: return column.type || '';
      case 2: return column.nullable?.toUpperCase() === 'YES' || column.nullable?.toUpperCase() === 'Y' ? 'NULL' : 'NOT NULL';
      case 3: return column.default || '';
      case 4: return column.explanation || '';
      case 5: return column.mapping || '';
      case 6: {
        // Sample Values column (read-only)
        if (column.sampleValues && column.sampleValues.length > 0) {
          return column.sampleValues.join(', ');
        }
        return '-';
      }
      case 7: {
        // Computed "Mapped To" column
        const mappingInfo = getMappingInfo(selectedTable.tableName, column.name);
        const migrationNeeded = column.migrationNeeded !== false;
        if (mappingInfo) return mappingInfo;
        if (!migrationNeeded) return `Not Mapped${column.nonMigrationComment ? ` - ${column.nonMigrationComment}` : ''}`;
        return '-';
      }
      default: return '';
    }
  }, [selectedTable, getMappingInfo]);

  // Field map for column index to Column property
  const fieldMap: { [key: number]: keyof Column } = {
    0: 'name',
    1: 'type',
    2: 'nullable',
    3: 'default',
    4: 'explanation',
    5: 'mapping',
  };

  // Push current column state to undo stack before making changes
  const pushUndo = useCallback(() => {
    if (!selectedTable) return;
    const snapshot = selectedTable.columns.map(c => ({ ...c }));
    undoStackRef.current.push(snapshot);
    if (undoStackRef.current.length > MAX_UNDO) {
      undoStackRef.current.shift();
    }
    // Clear redo stack on new action
    redoStackRef.current = [];
  }, [selectedTable]);

  // Update a single cell value by coordinates (only for editable columns 0-5)
  // skipUndo: used by debounced auto-save to avoid pushing undo on every keystroke
  const updateCellValue = useCallback((row: number, col: number, value: string, skipUndo = false) => {
    if (!selectedTable || row < 0 || row >= selectedTable.columns.length) return;
    if (col >= 6) return; // "Mapped To" is read-only
    const column = selectedTable.columns[row];

    const field = fieldMap[col];
    if (field) {
      if (!skipUndo) pushUndo();
      updateColumnField(column.name, field, value);
    }
  }, [selectedTable, updateColumnField, pushUndo]);

  // Batch update multiple cells in one onUpdateTable call
  // This is critical for paste and multi-delete: calling updateCellValue in a loop
  // would cause each call to read from stale data, so only the last write survives.
  const batchUpdateCells = useCallback((updates: { row: number; col: number; value: string }[]) => {
    if (!selectedTable) return;

    pushUndo(); // Save state before batch change

    const updatedColumns = [...selectedTable.columns.map(c => ({ ...c }))];

    for (const { row, col, value } of updates) {
      if (row < 0 || row >= updatedColumns.length || col >= 6) continue;
      const field = fieldMap[col];
      if (field) {
        updatedColumns[row] = { ...updatedColumns[row], [field]: value };
      }
    }

    onUpdateTable(selectedTable.id, { columns: updatedColumns }, isSourceTable);
  }, [selectedTable, onUpdateTable, isSourceTable, pushUndo]);

  // Undo: restore previous column state
  const handleUndo = useCallback(() => {
    if (!selectedTable || undoStackRef.current.length === 0) return;
    // Save current state to redo stack
    const currentSnapshot = selectedTable.columns.map(c => ({ ...c }));
    redoStackRef.current.push(currentSnapshot);
    // Pop and apply previous state
    const previousState = undoStackRef.current.pop()!;
    onUpdateTable(selectedTable.id, { columns: previousState }, isSourceTable);
  }, [selectedTable, onUpdateTable, isSourceTable]);

  // Redo: re-apply undone change
  const handleRedo = useCallback(() => {
    if (!selectedTable || redoStackRef.current.length === 0) return;
    // Save current state to undo stack
    const currentSnapshot = selectedTable.columns.map(c => ({ ...c }));
    undoStackRef.current.push(currentSnapshot);
    // Pop and apply redo state
    const redoState = redoStackRef.current.pop()!;
    onUpdateTable(selectedTable.id, { columns: redoState }, isSourceTable);
  }, [selectedTable, onUpdateTable, isSourceTable]);

  // Check if cell is selected
  const isCellSelected = useCallback((row: number, col: number): boolean => {
    return selectedCells.some(c => c.row === row && c.col === col);
  }, [selectedCells]);

  // Check if cell is active (has focus)
  const isCellActive = useCallback((row: number, col: number): boolean => {
    return activeCell?.row === row && activeCell?.col === col;
  }, [activeCell]);

  // Get range of cells between two coordinates
  const getCellRange = useCallback((start: CellCoord, end: CellCoord): CellCoord[] => {
    const cells: CellCoord[] = [];
    const minRow = Math.min(start.row, end.row);
    const maxRow = Math.max(start.row, end.row);
    const minCol = Math.min(start.col, end.col);
    const maxCol = Math.max(start.col, end.col);

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        cells.push({ row, col });
      }
    }
    return cells;
  }, []);

  // Handle cell click
  const handleCellClick = useCallback((row: number, col: number, e: React.MouseEvent) => {
    if (!excelMode) return;

    // If we were editing, the input's onBlur already saved.
    // Just clear editing state if it's somehow still set.
    if (editingCell) {
      // Flush any pending debounced save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
      }
      setEditingCell(null);
    }

    if (e.shiftKey && activeCell) {
      // Shift+click: extend selection from active cell
      const range = getCellRange(activeCell, { row, col });
      setSelectedCells(range);
    } else if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd+click: toggle cell in selection
      if (isCellSelected(row, col)) {
        setSelectedCells(prev => prev.filter(c => !(c.row === row && c.col === col)));
      } else {
        setSelectedCells(prev => [...prev, { row, col }]);
      }
      setActiveCell({ row, col });
    } else {
      // Regular click: select single cell
      setSelectedCells([{ row, col }]);
      setActiveCell({ row, col });
    }
  }, [excelMode, activeCell, getCellRange, isCellSelected, editingCell]);

  // Handle cell double click to enter edit mode
  const handleCellDoubleClick = useCallback((row: number, col: number) => {
    if (!excelMode) return;
    if (col >= 6) return; // Can't edit read-only columns (sample values, mapped to)

    pushUndo(); // Save state before editing starts
    setEditingCell({ row, col });
    setEditValue(getCellValue(row, col));
    setActiveCell({ row, col });
    setSelectedCells([{ row, col }]);
  }, [excelMode, getCellValue, pushUndo]);

  // Handle mouse down for drag selection
  const handleCellMouseDown = useCallback((row: number, col: number, e: React.MouseEvent) => {
    if (!excelMode || e.button !== 0) return;

    // Don't start drag if modifier keys are pressed (handled by click)
    if (e.shiftKey || e.ctrlKey || e.metaKey) return;

    setSelectionStart({ row, col });
    setIsDragging(true);
    setSelectedCells([{ row, col }]);
    setActiveCell({ row, col });
  }, [excelMode]);

  // Handle mouse move for drag selection
  const handleCellMouseMove = useCallback((row: number, col: number) => {
    if (!isDragging || !selectionStart) return;

    const range = getCellRange(selectionStart, { row, col });
    setSelectedCells(range);
  }, [isDragging, selectionStart, getCellRange]);

  // Handle mouse up to end drag selection
  useEffect(() => {
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setSelectionStart(null);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [isDragging]);

  // Commit edit and move to next cell
  const commitEdit = useCallback((moveDirection?: 'down' | 'right' | 'up' | 'left') => {
    if (editingCell) {
      // skipUndo=true because undo was pushed when editing started (double-click/Enter/typing)
      updateCellValue(editingCell.row, editingCell.col, editValue, true);
      setEditingCell(null);

      if (moveDirection && activeCell && selectedTable) {
        let newRow = activeCell.row;
        let newCol = activeCell.col;
        const maxRow = selectedTable.columns.length - 1;
        const maxCol = COLUMN_COUNT - 1;

        switch (moveDirection) {
          case 'down': newRow = Math.min(newRow + 1, maxRow); break;
          case 'up': newRow = Math.max(newRow - 1, 0); break;
          case 'right': newCol = Math.min(newCol + 1, maxCol); break;
          case 'left': newCol = Math.max(newCol - 1, 0); break;
        }

        setActiveCell({ row: newRow, col: newCol });
        setSelectedCells([{ row: newRow, col: newCol }]);
      }
    }
  }, [editingCell, editValue, updateCellValue, activeCell, selectedTable]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!excelMode || !selectedTable) return;

    const maxRow = selectedTable.columns.length - 1;
    const maxCol = COLUMN_COUNT - 1;

    // Handle editing mode
    if (editingCell) {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitEdit('down');
      } else if (e.key === 'Tab') {
        e.preventDefault();
        commitEdit(e.shiftKey ? 'left' : 'right');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setEditingCell(null);
      }
      return;
    }

    // Handle undo (Ctrl+Z)
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
      return;
    }

    // Handle redo (Ctrl+Y or Ctrl+Shift+Z)
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey) || (e.key === 'Z' && e.shiftKey))) {
      e.preventDefault();
      handleRedo();
      return;
    }

    // Handle copy (Ctrl+C)
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
      e.preventDefault();
      handleCopy();
      return;
    }

    // Handle paste (Ctrl+V)
    if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
      e.preventDefault();
      handlePaste();
      return;
    }

    // Handle select all (Ctrl+A)
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      e.preventDefault();
      const allCells: CellCoord[] = [];
      for (let row = 0; row <= maxRow; row++) {
        for (let col = 0; col <= maxCol; col++) {
          allCells.push({ row, col });
        }
      }
      setSelectedCells(allCells);
      return;
    }

    // Navigation without active cell
    if (!activeCell) {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
        setActiveCell({ row: 0, col: 0 });
        setSelectedCells([{ row: 0, col: 0 }]);
      }
      return;
    }

    let newRow = activeCell.row;
    let newCol = activeCell.col;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newRow = Math.max(0, activeCell.row - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newRow = Math.min(maxRow, activeCell.row + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newCol = Math.max(0, activeCell.col - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newCol = Math.min(maxCol, activeCell.col + 1);
        break;
      case 'Tab':
        e.preventDefault();
        if (e.shiftKey) {
          newCol = activeCell.col - 1;
          if (newCol < 0) {
            newCol = maxCol;
            newRow = Math.max(0, activeCell.row - 1);
          }
        } else {
          newCol = activeCell.col + 1;
          if (newCol > maxCol) {
            newCol = 0;
            newRow = Math.min(maxRow, activeCell.row + 1);
          }
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (e.shiftKey) {
          newRow = Math.max(0, activeCell.row - 1);
        } else {
          // Start editing on Enter
          if (activeCell.col < 6) {
            pushUndo();
            setEditingCell(activeCell);
            setEditValue(getCellValue(activeCell.row, activeCell.col));
          }
          return;
        }
        break;
      case 'F2':
        // F2 to edit cell
        e.preventDefault();
        if (activeCell.col < 6) {
          pushUndo();
          setEditingCell(activeCell);
          setEditValue(getCellValue(activeCell.row, activeCell.col));
        }
        return;
      case 'Delete':
      case 'Backspace':
        // Clear selected cells (batch update to avoid stale data)
        e.preventDefault();
        batchUpdateCells(selectedCells.map(cell => ({ row: cell.row, col: cell.col, value: '' })));
        return;
      default:
        // Start editing on any printable character
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          if (activeCell.col < 6) {
            e.preventDefault();
            pushUndo();
            setEditingCell(activeCell);
            setEditValue(e.key);
          }
          return;
        }
        return;
    }

    // Handle shift+arrow for selection extension
    if (e.shiftKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      const range = getCellRange(
        selectedCells.length > 0 ? selectedCells[0] : activeCell,
        { row: newRow, col: newCol }
      );
      setSelectedCells(range);
      setActiveCell({ row: newRow, col: newCol });
    } else {
      setActiveCell({ row: newRow, col: newCol });
      setSelectedCells([{ row: newRow, col: newCol }]);
    }
  }, [excelMode, selectedTable, editingCell, activeCell, selectedCells, commitEdit, getCellValue, getCellRange, batchUpdateCells, handleUndo, handleRedo, pushUndo]);

  // Handle copy to clipboard
  const handleCopy = useCallback(async () => {
    if (!selectedTable || selectedCells.length === 0) return;

    // Get bounding box of selection
    const rows = selectedCells.map(c => c.row);
    const cols = selectedCells.map(c => c.col);
    const minRow = Math.min(...rows);
    const maxRow = Math.max(...rows);
    const minCol = Math.min(...cols);
    const maxCol = Math.max(...cols);

    // Build TSV string (tab-separated values like Excel)
    const lines: string[] = [];
    for (let row = minRow; row <= maxRow; row++) {
      const values: string[] = [];
      for (let col = minCol; col <= maxCol; col++) {
        if (isCellSelected(row, col)) {
          values.push(getCellValue(row, col));
        } else {
          values.push('');
        }
      }
      lines.push(values.join('\t'));
    }
    const tsvText = lines.join('\n');

    try {
      await navigator.clipboard.writeText(tsvText);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [selectedTable, selectedCells, getCellValue, isCellSelected]);

  // Handle paste from clipboard
  const handlePaste = useCallback(async () => {
    if (!selectedTable) return;

    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;

      // Parse TSV only (tab-separated) — Excel/spreadsheet apps copy as TSV.
      // Do NOT split on commas, as cell values may legitimately contain commas.
      const lines = text.split(/\r?\n/).filter(line => line.length > 0);
      const clipboardRows = lines.map(line => line.split('\t'));

      const clipboardRowCount = clipboardRows.length;
      const clipboardColCount = Math.max(...clipboardRows.map(r => r.length));
      const isSingleValue = clipboardRowCount === 1 && clipboardColCount === 1;
      const singleValue = isSingleValue ? clipboardRows[0][0].trim() : '';

      const tableMaxRow = selectedTable.columns.length - 1;
      const tableMaxCol = COLUMN_COUNT - 1;

      // Collect all updates, then apply in one batch
      const updates: { row: number; col: number; value: string }[] = [];

      // Case 1: Multiple cells selected - paste to all selected cells
      if (selectedCells.length > 1) {
        if (isSingleValue) {
          // Single value clipboard: paste same value to all selected cells
          selectedCells.forEach(cell => {
            if (cell.row <= tableMaxRow && cell.col <= tableMaxCol) {
              updates.push({ row: cell.row, col: cell.col, value: singleValue });
            }
          });
        } else {
          // Multiple values clipboard: tile/repeat across selected area
          const selRows = selectedCells.map(c => c.row);
          const selCols = selectedCells.map(c => c.col);
          const minSelRow = Math.min(...selRows);
          const maxSelRow = Math.max(...selRows);
          const minSelCol = Math.min(...selCols);
          const maxSelCol = Math.max(...selCols);

          // Paste with tiling across the selection area
          for (let row = minSelRow; row <= maxSelRow && row <= tableMaxRow; row++) {
            for (let col = minSelCol; col <= maxSelCol && col <= tableMaxCol; col++) {
              // Only paste to cells that are actually selected (for non-rectangular selections)
              if (isCellSelected(row, col)) {
                const clipRow = (row - minSelRow) % clipboardRowCount;
                const clipCol = (col - minSelCol) % clipboardColCount;
                const value = clipboardRows[clipRow]?.[clipCol] ?? '';
                updates.push({ row, col, value: value.trim() });
              }
            }
          }
        }
      }
      // Case 2: Single cell selected or no selection - paste starting from active cell
      else if (activeCell) {
        const startRow = activeCell.row;
        const startCol = activeCell.col;
        const newSelectedCells: CellCoord[] = [];

        clipboardRows.forEach((rowValues, rowOffset) => {
          const targetRow = startRow + rowOffset;
          if (targetRow > tableMaxRow) return;

          rowValues.forEach((value, colOffset) => {
            const targetCol = startCol + colOffset;
            if (targetCol > tableMaxCol) return;

            updates.push({ row: targetRow, col: targetCol, value: value.trim() });
            newSelectedCells.push({ row: targetRow, col: targetCol });
          });
        });

        // Select all pasted cells
        if (newSelectedCells.length > 0) {
          setSelectedCells(newSelectedCells);
        }
      }

      // Apply all updates in a single batch
      if (updates.length > 0) {
        batchUpdateCells(updates);
      }
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  }, [selectedTable, activeCell, selectedCells, batchUpdateCells, isCellSelected]);

  // Keep refs in sync to avoid stale closures in debounced save
  useEffect(() => { updateCellValueRef.current = updateCellValue; }, [updateCellValue]);
  useEffect(() => { editingCellRef.current = editingCell; }, [editingCell]);

  // Calculate input position when editing starts
  useEffect(() => {
    if (editingCell && tableRef.current) {
      // Find the cell element to position the input
      const rows = tableRef.current.querySelectorAll('tbody tr');
      if (rows[editingCell.row]) {
        const cells = rows[editingCell.row].querySelectorAll('td');
        if (cells[editingCell.col]) {
          const cell = cells[editingCell.col] as HTMLElement;
          const tableRect = tableRef.current.getBoundingClientRect();
          const cellRect = cell.getBoundingClientRect();

          setEditInputPosition({
            top: cellRect.top - tableRect.top,
            left: cellRect.left - tableRect.left,
            width: cellRect.width,
            height: cellRect.height,
          });
        }
      }
    } else {
      setEditInputPosition(null);
    }
  }, [editingCell]);

  // Focus input after position is calculated and input is rendered
  useEffect(() => {
    if (editingCell && editInputPosition && inputRef.current) {
      inputRef.current.focus();
      // Only select all if entering edit mode (not on position recalc)
      inputRef.current.select();
    }
  }, [editingCell, editInputPosition]);

  // Debounced auto-save for Excel mode editing
  // IMPORTANT: Only depend on editValue to avoid infinite loop.
  // updateCellValue changes when selectedTable changes (after save), which would re-trigger this effect.
  // Using refs for editingCell and updateCellValue to always get current values without triggering the effect.
  useEffect(() => {
    if (editingCellRef.current) {
      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout for auto-save (300ms debounce)
      // skipUndo=true because undo was pushed when editing started
      saveTimeoutRef.current = setTimeout(() => {
        const cell = editingCellRef.current;
        if (cell) {
          updateCellValueRef.current(cell.row, cell.col, editValue, true);
        }
      }, 300);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editValue]);

  // Clear selection and undo/redo when switching tables or modes
  useEffect(() => {
    setSelectedCells([]);
    setActiveCell(null);
    setEditingCell(null);
    undoStackRef.current = [];
    redoStackRef.current = [];
  }, [selectedTableId, excelMode]);

  // Toggle Excel mode
  const toggleExcelMode = useCallback(() => {
    setExcelMode(!excelMode);
    if (!excelMode) {
      // Entering Excel mode
      setSelectedCells([]);
      setActiveCell(null);
      setEditingCell(null);
    }
  }, [excelMode]);

  // ============================================
  // END EXCEL-LIKE EDITING FUNCTIONS
  // ============================================

  // Toggle edit mode
  const handleEditMode = () => {
    if (editMode) {
      // Save changes
      onUpdateScript(editContent);
      setEditMode(false);
    } else {
      // Enter edit mode
      setEditContent(script.rawContent);
      setEditMode(true);
    }
  };

  if (editMode) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '16px' }}>Edit Source ({script.type.toUpperCase()})</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn" onClick={() => setEditMode(false)}>
              <X size={16} />
              Cancel
            </button>
            <button className="btn btn-success" onClick={handleEditMode}>
              <Save size={16} />
              Save & Parse
            </button>
          </div>
        </div>
        <CodeEditor
          value={editContent}
          onChange={setEditContent}
          language={script.type}
          isDarkTheme={isDarkTheme}
          darkThemeVariant={darkThemeVariant}
          minHeight="100%"
        />
      </div>
    );
  }

  if (!selectedTable && viewMode !== 'tableList') {
    // In this block, viewMode is narrowed to 'dictionary' | 'data'
    const isDict = viewMode === 'dictionary';
    const isData = viewMode === 'data';

    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '16px' }}>Data Dictionary</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* View Mode Toggle */}
            <div style={{
              display: 'flex',
              borderRadius: '6px',
              overflow: 'hidden',
              border: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`,
            }}>
              <button
                className="btn"
                onClick={() => setViewMode('tableList')}
                style={{
                  borderRadius: 0,
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: undefined,
                }}
                title="All tables overview"
              >
                <List size={16} />
                Tables
              </button>
              <button
                className="btn"
                onClick={() => setViewMode('dictionary')}
                style={{
                  borderRadius: 0,
                  border: 'none',
                  borderLeft: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`,
                  backgroundColor: isDict
                    ? (isDarkTheme ? '#3b82f6' : '#2563eb')
                    : 'transparent',
                  color: isDict ? '#fff' : undefined,
                }}
                title="Column definitions view"
              >
                <Database size={16} />
                Dictionary
              </button>
              <button
                className="btn"
                onClick={() => setViewMode('data')}
                style={{
                  borderRadius: 0,
                  border: 'none',
                  borderLeft: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`,
                  backgroundColor: isData
                    ? (isDarkTheme ? '#3b82f6' : '#2563eb')
                    : 'transparent',
                  color: isData ? '#fff' : undefined,
                }}
                title="Sample data rows view"
              >
                <Rows3 size={16} />
                Data View
              </button>
            </div>
            <button className="btn" onClick={handleEditMode}>
              <Edit3 size={16} />
              Edit Source
            </button>
            <button className="btn" onClick={() => downloadJson(script.data, `${script.name}.json`)}>
              <FileDown size={16} />
              Export JSON
            </button>
          </div>
        </div>

        <div className="empty-state">
          <div className="empty-state-title">Select a Table</div>
          <div className="empty-state-text">
            Choose a table from the sidebar to view its structure, or click "Tables" to see all tables.
          </div>
        </div>
      </div>
    );
  }

  // For tableList view without selectedTable, we still render the main component
  if (!selectedTable && viewMode === 'tableList') {
    // Combine targets and sources
    const allTables = [
      ...script.data.targets.map(t => ({ ...t, isSource: false })),
      ...script.data.sources.map(t => ({ ...t, isSource: true })),
    ];

    // Apply filters (multi-select: if array is empty, no filter; otherwise value must be in array)
    const filteredTables = allTables.filter(table => {
      if (tableListFilters.tableName.length > 0 && !tableListFilters.tableName.includes(table.tableName)) {
        return false;
      }
      if (tableListFilters.domain.length > 0 && !tableListFilters.domain.includes(table.schema || '')) {
        return false;
      }
      if (tableListFilters.purpose.length > 0 && !tableListFilters.purpose.includes(table.description || '')) {
        return false;
      }
      if (tableListFilters.toIgnore.length > 0) {
        const tableIgnoreValue = table.toIgnore ? 'Y' : 'N';
        if (!tableListFilters.toIgnore.includes(tableIgnoreValue)) {
          return false;
        }
      }
      return true;
    });

    // Get unique values for filter dropdown
    const getUniqueValues = (field: 'tableName' | 'domain' | 'purpose' | 'toIgnore') => {
      const values = new Set<string>();
      allTables.forEach(table => {
        if (field === 'tableName') values.add(table.tableName);
        else if (field === 'domain') values.add(table.schema || '');
        else if (field === 'purpose') values.add(table.description || '');
        else if (field === 'toIgnore') values.add(table.toIgnore ? 'Y' : 'N');
      });
      return Array.from(values).filter(v => v).sort();
    };

    // Filter header component with multi-select like Excel
    const FilterHeader = ({ column, label, width }: { column: 'tableName' | 'domain' | 'purpose' | 'toIgnore'; label: string; width: string }) => {
      const isActive = activeFilterColumn === column;
      const appliedValues = tableListFilters[column];
      const pendingValues = pendingFilters[column];
      const hasFilter = appliedValues.length > 0;
      const uniqueValues = getUniqueValues(column);

      // Filter unique values by search text
      const filteredUniqueValues = filterSearchText
        ? uniqueValues.filter(v => v.toLowerCase().includes(filterSearchText.toLowerCase()))
        : uniqueValues;

      // Check if all filtered values are selected
      const allSelected = filteredUniqueValues.length > 0 && filteredUniqueValues.every(v => pendingValues.includes(v));

      const toggleValue = (value: string) => {
        setPendingFilters(prev => {
          const current = prev[column];
          if (current.includes(value)) {
            return { ...prev, [column]: current.filter(v => v !== value) };
          } else {
            return { ...prev, [column]: [...current, value] };
          }
        });
      };

      const toggleSelectAll = () => {
        if (allSelected) {
          // Clear all filtered values
          setPendingFilters(prev => ({
            ...prev,
            [column]: prev[column].filter(v => !filteredUniqueValues.includes(v))
          }));
        } else {
          // Select all filtered values
          setPendingFilters(prev => ({
            ...prev,
            [column]: [...new Set([...prev[column], ...filteredUniqueValues])]
          }));
        }
      };

      const handleApply = () => {
        setTableListFilters({ ...pendingFilters });
        setActiveFilterColumn(null);
        setFilterSearchText('');
      };

      const handleCancel = () => {
        setPendingFilters({ ...tableListFilters });
        setActiveFilterColumn(null);
        setFilterSearchText('');
      };

      return (
        <th style={{ width, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
            <span>{label}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFilterSearchText('');
                if (isActive) {
                  handleCancel();
                } else {
                  // Initialize pending from applied when opening
                  setPendingFilters({ ...tableListFilters });
                  setActiveFilterColumn(column);
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                color: hasFilter ? (isDarkTheme ? '#e4e4e7' : '#374151') : (isDarkTheme ? '#6b7280' : '#9ca3af'),
                backgroundColor: hasFilter ? (isDarkTheme ? '#4b5563' : '#e5e7eb') : 'transparent',
                borderRadius: '4px',
              }}
              title={hasFilter ? `${appliedValues.length} selected` : 'Click to filter'}
              onMouseEnter={(e) => {
                if (!hasFilter) {
                  e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!hasFilter) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <Filter size={14} />
              {hasFilter && <span style={{ fontSize: '10px', marginLeft: '2px' }}>{appliedValues.length}</span>}
              <ChevronDown size={12} />
            </button>
          </div>
          {isActive && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                zIndex: 1000,
                backgroundColor: isDarkTheme ? '#374151' : '#f3f4f6',
                border: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`,
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                padding: '8px',
                minWidth: '200px',
                maxWidth: '280px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search box */}
              <input
                type="text"
                value={filterSearchText}
                onChange={(e) => setFilterSearchText(e.target.value)}
                placeholder="Search..."
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  fontSize: '12px',
                  border: `1px solid ${isDarkTheme ? '#6b7280' : '#d1d5db'}`,
                  borderRadius: '4px',
                  backgroundColor: isDarkTheme ? '#1f2937' : '#ffffff',
                  color: isDarkTheme ? '#e4e4e7' : '#18181b',
                  marginBottom: '8px',
                }}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    handleCancel();
                  } else if (e.key === 'Enter') {
                    handleApply();
                  }
                }}
              />

              {/* Toggle Select All / Clear All button */}
              <div style={{ marginBottom: '8px', borderBottom: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`, paddingBottom: '8px' }}>
                <button
                  onClick={toggleSelectAll}
                  style={{
                    width: '100%',
                    padding: '4px 8px',
                    fontSize: '11px',
                    border: `1px solid ${isDarkTheme ? '#6b7280' : '#d1d5db'}`,
                    borderRadius: '4px',
                    backgroundColor: isDarkTheme ? '#4b5563' : '#e5e7eb',
                    color: isDarkTheme ? '#e4e4e7' : '#374151',
                    cursor: 'pointer',
                  }}
                >
                  {allSelected ? 'Clear All' : 'Select All'}
                </button>
              </div>

              {/* Checkbox list */}
              <div style={{ maxHeight: '180px', overflowY: 'auto', fontSize: '12px' }}>
                {filteredUniqueValues.length === 0 ? (
                  <div style={{ padding: '8px', color: isDarkTheme ? '#9ca3af' : '#6b7280', fontStyle: 'italic', textAlign: 'center' }}>
                    No matches
                  </div>
                ) : (
                  filteredUniqueValues.map(value => (
                    <label
                      key={value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 8px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        backgroundColor: pendingValues.includes(value) ? (isDarkTheme ? '#4b5563' : '#e5e7eb') : 'transparent',
                      }}
                      onMouseEnter={(e) => {
                        if (!pendingValues.includes(value)) {
                          e.currentTarget.style.backgroundColor = isDarkTheme ? '#4b5563' : '#e5e7eb';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!pendingValues.includes(value)) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={pendingValues.includes(value)}
                        onChange={() => toggleValue(value)}
                        style={{
                          width: '14px',
                          height: '14px',
                          accentColor: isDarkTheme ? '#9ca3af' : '#6b7280',
                        }}
                      />
                      <span style={{
                        color: isDarkTheme ? '#e4e4e7' : '#374151',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {value || '(empty)'}
                      </span>
                    </label>
                  ))
                )}
              </div>

              {/* Apply / Cancel buttons */}
              <div style={{ marginTop: '8px', borderTop: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`, paddingTop: '8px', display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleCancel}
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    fontSize: '12px',
                    border: `1px solid ${isDarkTheme ? '#6b7280' : '#d1d5db'}`,
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    color: isDarkTheme ? '#e4e4e7' : '#374151',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  style={{
                    flex: 1,
                    padding: '6px 12px',
                    fontSize: '12px',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: isDarkTheme ? '#6b7280' : '#6b7280',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </th>
      );
    };

    // Table List columns: 0=#(readonly), 1=TableName(readonly), 2=Domain, 3=Purpose, 4=ToIgnore
    const TABLE_LIST_COL_COUNT = 5;
    const EDITABLE_COLS = [2, 3, 4]; // Domain, Purpose, To Ignore

    // Get cell value for table list
    const getTableListCellValue = (rowIdx: number, colIdx: number): string => {
      const table = filteredTables[rowIdx];
      if (!table) return '';
      switch (colIdx) {
        case 0: return String(rowIdx + 1);
        case 1: return table.tableName;
        case 2: return table.schema || '';
        case 3: return table.description || '';
        case 4: return table.toIgnore ? 'Y' : 'N';
        default: return '';
      }
    };

    // Update table list cell
    const updateTableListCell = (rowIdx: number, colIdx: number, value: string) => {
      const table = filteredTables[rowIdx];
      if (!table) return;
      if (colIdx === 2) {
        onUpdateTable(table.id, { schema: value }, table.isSource);
      } else if (colIdx === 3) {
        onUpdateTable(table.id, { description: value }, table.isSource);
      } else if (colIdx === 4) {
        const boolValue = value.toUpperCase() === 'Y';
        onUpdateTable(table.id, { toIgnore: boolValue }, table.isSource);
      }
    };

    // Check if cell is editable
    const isEditableCol = (colIdx: number) => EDITABLE_COLS.includes(colIdx);

    // Excel mode cell selection style
    const getTableListSelectionStyle = (rowIdx: number, colIdx: number): React.CSSProperties => {
      if (!excelMode) return {};

      const isActive = activeCell?.row === rowIdx && activeCell?.col === colIdx;
      const isSelected = selectedCells.some(c => c.row === rowIdx && c.col === colIdx);

      if (isActive) {
        return {
          outline: '2px solid #2563eb',
          outlineOffset: '-2px',
          backgroundColor: isDarkTheme ? 'rgba(30, 58, 95, 0.5)' : 'rgba(219, 234, 254, 0.7)',
        };
      }
      if (isSelected) {
        return {
          backgroundColor: isDarkTheme ? 'rgba(30, 58, 95, 0.3)' : 'rgba(191, 219, 254, 0.5)',
        };
      }
      return {};
    };

    // Excel mode cell event handlers for table list
    const getTableListCellProps = (rowIdx: number, colIdx: number) => {
      if (!excelMode) return {};

      return {
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          if (e.shiftKey && activeCell) {
            const range = getCellRange(activeCell, { row: rowIdx, col: colIdx });
            setSelectedCells(range);
          } else if (e.ctrlKey || e.metaKey) {
            if (isCellSelected(rowIdx, colIdx)) {
              setSelectedCells(prev => prev.filter(c => !(c.row === rowIdx && c.col === colIdx)));
            } else {
              setSelectedCells(prev => [...prev, { row: rowIdx, col: colIdx }]);
            }
            setActiveCell({ row: rowIdx, col: colIdx });
          } else {
            setSelectedCells([{ row: rowIdx, col: colIdx }]);
            setActiveCell({ row: rowIdx, col: colIdx });
          }
          if (editingCell) setEditingCell(null);
        },
        onDoubleClick: () => {
          if (isEditableCol(colIdx)) {
            setEditingCell({ row: rowIdx, col: colIdx });
            setEditValue(getTableListCellValue(rowIdx, colIdx));
            setActiveCell({ row: rowIdx, col: colIdx });
            setSelectedCells([{ row: rowIdx, col: colIdx }]);
          }
        },
        onMouseDown: (e: React.MouseEvent) => {
          if (e.button !== 0 || e.shiftKey || e.ctrlKey || e.metaKey) return;
          setSelectionStart({ row: rowIdx, col: colIdx });
          setIsDragging(true);
          setSelectedCells([{ row: rowIdx, col: colIdx }]);
          setActiveCell({ row: rowIdx, col: colIdx });
        },
        onMouseMove: () => {
          if (isDragging && selectionStart) {
            const range = getCellRange(selectionStart, { row: rowIdx, col: colIdx });
            setSelectedCells(range);
          }
        },
        style: {
          ...getTableListSelectionStyle(rowIdx, colIdx),
          cursor: excelMode ? 'cell' : 'default',
          userSelect: 'none' as const,
        },
      };
    };

    // Handle keyboard for table list
    const handleTableListKeyDown = (e: React.KeyboardEvent) => {
      if (!excelMode) return;

      const maxRow = filteredTables.length - 1;
      const maxCol = TABLE_LIST_COL_COUNT - 1;

      // Handle editing
      if (editingCell) {
        if (e.key === 'Enter') {
          e.preventDefault();
          updateTableListCell(editingCell.row, editingCell.col, editValue);
          setEditingCell(null);
          // Move down
          const newRow = Math.min(editingCell.row + 1, maxRow);
          setActiveCell({ row: newRow, col: editingCell.col });
          setSelectedCells([{ row: newRow, col: editingCell.col }]);
        } else if (e.key === 'Tab') {
          e.preventDefault();
          updateTableListCell(editingCell.row, editingCell.col, editValue);
          setEditingCell(null);
          // Move right/left
          let newCol = e.shiftKey ? editingCell.col - 1 : editingCell.col + 1;
          let newRow = editingCell.row;
          if (newCol > maxCol) { newCol = 0; newRow = Math.min(newRow + 1, maxRow); }
          if (newCol < 0) { newCol = maxCol; newRow = Math.max(newRow - 1, 0); }
          setActiveCell({ row: newRow, col: newCol });
          setSelectedCells([{ row: newRow, col: newCol }]);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setEditingCell(null);
        }
        return;
      }

      if (!activeCell) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
          setActiveCell({ row: 0, col: 0 });
          setSelectedCells([{ row: 0, col: 0 }]);
        }
        return;
      }

      let newRow = activeCell.row;
      let newCol = activeCell.col;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newRow = Math.max(0, activeCell.row - 1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          newRow = Math.min(maxRow, activeCell.row + 1);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newCol = Math.max(0, activeCell.col - 1);
          break;
        case 'ArrowRight':
          e.preventDefault();
          newCol = Math.min(maxCol, activeCell.col + 1);
          break;
        case 'Tab':
          e.preventDefault();
          if (e.shiftKey) {
            newCol = activeCell.col - 1;
            if (newCol < 0) { newCol = maxCol; newRow = Math.max(0, activeCell.row - 1); }
          } else {
            newCol = activeCell.col + 1;
            if (newCol > maxCol) { newCol = 0; newRow = Math.min(maxRow, activeCell.row + 1); }
          }
          break;
        case 'Enter':
        case 'F2':
          e.preventDefault();
          if (isEditableCol(activeCell.col)) {
            setEditingCell(activeCell);
            setEditValue(getTableListCellValue(activeCell.row, activeCell.col));
          }
          return;
        case 'Delete':
        case 'Backspace':
          e.preventDefault();
          selectedCells.forEach(cell => {
            if (isEditableCol(cell.col)) {
              updateTableListCell(cell.row, cell.col, cell.col === 4 ? 'N' : '');
            }
          });
          return;
        default:
          // Start editing on printable character
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            if (isEditableCol(activeCell.col)) {
              e.preventDefault();
              setEditingCell(activeCell);
              setEditValue(e.key);
            }
          }
          return;
      }

      if (e.shiftKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        const range = getCellRange(selectedCells[0] || activeCell, { row: newRow, col: newCol });
        setSelectedCells(range);
      } else {
        setSelectedCells([{ row: newRow, col: newCol }]);
      }
      setActiveCell({ row: newRow, col: newCol });
    };

    const hasActiveFilters = Object.values(tableListFilters).some(v => v.length > 0);

    return (
      <div
        style={{ height: '100%', display: 'flex', flexDirection: 'column', outline: 'none' }}
        onClick={() => setActiveFilterColumn(null)}
        tabIndex={excelMode ? 0 : undefined}
        onKeyDown={excelMode ? handleTableListKeyDown : undefined}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '16px' }}>Data Dictionary</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {/* View Mode Toggle */}
            <div style={{
              display: 'flex',
              borderRadius: '6px',
              overflow: 'hidden',
              border: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`,
            }}>
              <button
                className="btn"
                onClick={() => setViewMode('tableList')}
                style={{
                  borderRadius: 0,
                  border: 'none',
                  backgroundColor: isDarkTheme ? '#3b82f6' : '#2563eb',
                  color: '#fff',
                }}
                title="All tables overview"
              >
                <List size={16} />
                Tables
              </button>
              <button
                className="btn"
                onClick={() => setViewMode('dictionary')}
                style={{
                  borderRadius: 0,
                  border: 'none',
                  borderLeft: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`,
                  backgroundColor: 'transparent',
                  color: undefined,
                }}
                title="Column definitions view"
              >
                <Database size={16} />
                Dictionary
              </button>
              <button
                className="btn"
                onClick={() => setViewMode('data')}
                style={{
                  borderRadius: 0,
                  border: 'none',
                  borderLeft: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`,
                  backgroundColor: 'transparent',
                  color: undefined,
                }}
                title="Sample data rows view"
              >
                <Rows3 size={16} />
                Data View
              </button>
            </div>
            <button
              className={`btn ${excelMode ? 'btn-success' : ''}`}
              onClick={toggleExcelMode}
              title={excelMode ? 'Switch to normal view' : 'Switch to Excel-like edit mode (multi-select, copy/paste)'}
            >
              {excelMode ? <TableIcon size={16} /> : <Grid3X3 size={16} />}
              {excelMode ? 'Normal Mode' : 'Excel Mode'}
            </button>
            <div style={{ position: 'relative' }}>
              <button
                className="btn"
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                title="Choose which columns to display"
              >
                <Settings2 size={16} />
                Columns
              </button>
              {showColumnSelector && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: isDarkTheme ? '#374151' : '#ffffff',
                    border: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    padding: '12px',
                    minWidth: '200px',
                    marginTop: '4px',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: `1px solid ${isDarkTheme ? '#4b5563' : '#e5e7eb'}` }}>
                    <button
                      onClick={() => {
                        if (visibleColumns.size === allColumns.length) {
                          setVisibleColumns(new Set(['column']));
                        } else {
                          setVisibleColumns(new Set(allColumns.map(c => c.key)));
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '4px 8px',
                        fontSize: '11px',
                        border: `1px solid ${isDarkTheme ? '#6b7280' : '#d1d5db'}`,
                        borderRadius: '4px',
                        backgroundColor: isDarkTheme ? '#4b5563' : '#e5e7eb',
                        color: isDarkTheme ? '#e4e4e7' : '#374151',
                        cursor: 'pointer',
                      }}
                    >
                      {visibleColumns.size === allColumns.length ? 'Hide All' : 'Show All'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {allColumns.map(col => (
                      <label
                        key={col.key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 8px',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          backgroundColor: visibleColumns.has(col.key) ? (isDarkTheme ? '#4b5563' : '#e5e7eb') : 'transparent',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.has(col.key)}
                          onChange={() => {
                            const newVisible = new Set(visibleColumns);
                            if (newVisible.has(col.key)) {
                              if (newVisible.size > 1) {
                                newVisible.delete(col.key);
                              }
                            } else {
                              newVisible.add(col.key);
                            }
                            setVisibleColumns(newVisible);
                          }}
                          style={{
                            width: '14px',
                            height: '14px',
                            accentColor: isDarkTheme ? '#9ca3af' : '#6b7280',
                          }}
                        />
                        <span style={{ fontSize: '12px', color: isDarkTheme ? '#e4e4e7' : '#374151' }}>
                          {col.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: `1px solid ${isDarkTheme ? '#4b5563' : '#e5e7eb'}` }}>
                    <button
                      onClick={() => setShowColumnSelector(false)}
                      style={{
                        width: '100%',
                        padding: '6px 12px',
                        fontSize: '12px',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: isDarkTheme ? '#6b7280' : '#6b7280',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button className="btn" onClick={handleEditMode}>
              <Edit3 size={16} />
              Edit Source
            </button>
            <button className="btn" onClick={() => downloadJson(script.data, `${script.name}.json`)}>
              <FileDown size={16} />
              Export JSON
            </button>
          </div>
        </div>

        {/* Excel Mode Help Banner */}
        {excelMode && (
          <div style={{
            backgroundColor: isDarkTheme ? '#1e3a5f' : '#dbeafe',
            padding: '8px 12px',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '12px',
            color: isDarkTheme ? '#93c5fd' : '#1e40af',
          }}>
            <strong>Excel Mode:</strong> Click to select • Shift+Click for range • Ctrl+Click for multi-select •
            Arrow keys to navigate • Enter/F2 to edit • Tab to move • Delete to clear •
            Use Y/N for "To Ignore"
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderBottom: `2px solid ${isDarkTheme ? '#334155' : '#eee'}`, paddingBottom: '8px' }}>
          <h3 style={{ fontSize: '14px', color: isDarkTheme ? '#e4e4e7' : '#2c3e50', margin: 0 }}>
            All Tables
            <span style={{ fontWeight: 'normal', fontSize: '12px', color: isDarkTheme ? '#a1a1aa' : '#6b7280', marginLeft: '8px' }}>
              ({filteredTables.length}{hasActiveFilters ? ` of ${allTables.length}` : ''} tables)
              {excelMode && selectedCells.length > 0 && ` • ${selectedCells.length} cell${selectedCells.length !== 1 ? 's' : ''} selected`}
            </span>
          </h3>
          {hasActiveFilters && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setTableListFilters({ tableName: [], domain: [], purpose: [], toIgnore: [] });
              }}
              style={{
                background: 'none',
                border: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`,
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '12px',
                cursor: 'pointer',
                color: isDarkTheme ? '#a1a1aa' : '#6b7280',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <X size={12} />
              Clear Filters
            </button>
          )}
        </div>

        <div style={{ overflowX: 'auto', overflowY: 'visible', flex: 1, position: 'relative', minHeight: '500px' }}>
          <table className={`data-table ${excelMode ? 'excel-mode' : ''}`} style={{ tableLayout: 'fixed', width: '100%' }}>
            <thead>
              <tr>
                <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                <FilterHeader column="tableName" label="Table Name" width="25%" />
                <FilterHeader column="domain" label="Domain" width="15%" />
                <FilterHeader column="purpose" label="Purpose" width="45%" />
                <FilterHeader column="toIgnore" label="To Ignore?" width="80px" />
              </tr>
            </thead>
            <tbody>
              {filteredTables.map((table, rowIdx) => (
                <tr key={`${table.isSource ? 'src' : 'tgt'}-${table.id}`}>
                  {/* # column - readonly */}
                  <td
                    {...getTableListCellProps(rowIdx, 0)}
                    style={{
                      textAlign: 'center',
                      color: isDarkTheme ? '#a1a1aa' : '#9ca3af',
                      fontSize: '12px',
                      ...getTableListSelectionStyle(rowIdx, 0),
                      ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                    }}
                  >
                    {rowIdx + 1}
                  </td>
                  {/* Table Name - readonly */}
                  <td
                    className="code-cell"
                    {...getTableListCellProps(rowIdx, 1)}
                    style={{
                      wordBreak: 'break-word',
                      ...getTableListSelectionStyle(rowIdx, 1),
                      ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {table.tableName}
                      {table.isSource && (
                        <span style={{
                          fontSize: '10px',
                          padding: '1px 4px',
                          borderRadius: '3px',
                          backgroundColor: isDarkTheme ? '#3b82f6' : '#dbeafe',
                          color: isDarkTheme ? '#dbeafe' : '#1d4ed8',
                        }}>SRC</span>
                      )}
                    </div>
                  </td>
                  {/* Domain - editable */}
                  <td
                    {...getTableListCellProps(rowIdx, 2)}
                    style={{
                      ...getTableListSelectionStyle(rowIdx, 2),
                      ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                    }}
                  >
                    {editingCell?.row === rowIdx && editingCell?.col === 2 ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => {
                          updateTableListCell(rowIdx, 2, editValue);
                          setEditingCell(null);
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                        autoFocus
                        style={{
                          width: '100%',
                          padding: '4px',
                          fontSize: '13px',
                          border: '2px solid #2563eb',
                          borderRadius: '2px',
                          backgroundColor: isDarkTheme ? '#1e293b' : '#ffffff',
                          color: isDarkTheme ? '#e4e4e7' : '#18181b',
                          outline: 'none',
                        }}
                      />
                    ) : excelMode ? (
                      <div style={{ padding: '4px', minHeight: '20px' }}>
                        {table.schema || <span style={{ color: '#999', fontStyle: 'italic' }}>-</span>}
                      </div>
                    ) : (
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdateTable(table.id, { schema: e.currentTarget.textContent || '' }, table.isSource)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); } }}
                        style={{
                          cursor: 'text', whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: '20px', padding: '4px', borderRadius: '4px',
                          border: '1px dashed transparent', color: table.schema ? (isDarkTheme ? '#e4e4e7' : '#18181b') : (isDarkTheme ? '#6b7280' : '#999'),
                          fontStyle: table.schema ? 'normal' : 'italic', transition: 'border-color 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = isDarkTheme ? '#4b5563' : '#ccc'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
                      >
                        {table.schema || '(Click to add)'}
                      </div>
                    )}
                  </td>
                  {/* Purpose - editable */}
                  <td
                    {...getTableListCellProps(rowIdx, 3)}
                    style={{
                      ...getTableListSelectionStyle(rowIdx, 3),
                      ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                    }}
                  >
                    {editingCell?.row === rowIdx && editingCell?.col === 3 ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => {
                          updateTableListCell(rowIdx, 3, editValue);
                          setEditingCell(null);
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                        autoFocus
                        style={{
                          width: '100%',
                          padding: '4px',
                          fontSize: '13px',
                          border: '2px solid #2563eb',
                          borderRadius: '2px',
                          backgroundColor: isDarkTheme ? '#1e293b' : '#ffffff',
                          color: isDarkTheme ? '#e4e4e7' : '#18181b',
                          outline: 'none',
                        }}
                      />
                    ) : excelMode ? (
                      <div style={{ padding: '4px', minHeight: '20px' }}>
                        {table.description || <span style={{ color: '#999', fontStyle: 'italic' }}>-</span>}
                      </div>
                    ) : (
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => onUpdateTable(table.id, { description: e.currentTarget.textContent || '' }, table.isSource)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); } }}
                        style={{
                          cursor: 'text', whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: '20px', padding: '4px', borderRadius: '4px',
                          border: '1px dashed transparent', color: table.description ? (isDarkTheme ? '#e4e4e7' : '#18181b') : (isDarkTheme ? '#6b7280' : '#999'),
                          fontStyle: table.description ? 'normal' : 'italic', transition: 'border-color 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = isDarkTheme ? '#4b5563' : '#ccc'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
                      >
                        {table.description || '(Click to add)'}
                      </div>
                    )}
                  </td>
                  {/* To Ignore - editable Y/N */}
                  <td
                    {...getTableListCellProps(rowIdx, 4)}
                    style={{
                      textAlign: 'center',
                      ...getTableListSelectionStyle(rowIdx, 4),
                      ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                    }}
                  >
                    {editingCell?.row === rowIdx && editingCell?.col === 4 ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value.toUpperCase())}
                        onBlur={() => {
                          updateTableListCell(rowIdx, 4, editValue);
                          setEditingCell(null);
                        }}
                        onKeyDown={(e) => e.stopPropagation()}
                        autoFocus
                        style={{
                          width: '40px',
                          padding: '4px',
                          fontSize: '13px',
                          border: '2px solid #2563eb',
                          borderRadius: '2px',
                          backgroundColor: isDarkTheme ? '#1e293b' : '#ffffff',
                          color: isDarkTheme ? '#e4e4e7' : '#18181b',
                          outline: 'none',
                          textAlign: 'center',
                        }}
                        maxLength={1}
                      />
                    ) : excelMode ? (
                      <div style={{ padding: '4px', minHeight: '20px' }}>
                        {table.toIgnore ? 'Y' : 'N'}
                      </div>
                    ) : (
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          const val = e.currentTarget.textContent || 'N';
                          const boolValue = val.toUpperCase() === 'Y';
                          onUpdateTable(table.id, { toIgnore: boolValue }, table.isSource);
                        }}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); } }}
                        style={{
                          cursor: 'text', minHeight: '20px', padding: '4px', borderRadius: '4px',
                          border: '1px dashed transparent', transition: 'border-color 0.2s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = isDarkTheme ? '#4b5563' : '#ccc'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
                      >
                        {table.toIgnore ? 'Y' : 'N'}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ height: '100%', overflow: 'auto', outline: excelMode ? 'none' : undefined }}
      tabIndex={excelMode ? 0 : undefined}
      onKeyDown={excelMode ? handleKeyDown : undefined}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '16px' }}>Data Dictionary</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* View Mode Toggle */}
          <div style={{
            display: 'flex',
            borderRadius: '6px',
            overflow: 'hidden',
            border: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`,
          }}>
            <button
              className="btn"
              onClick={() => setViewMode('tableList')}
              style={{
                borderRadius: 0,
                border: 'none',
                backgroundColor: viewMode === 'tableList'
                  ? (isDarkTheme ? '#3b82f6' : '#2563eb')
                  : 'transparent',
                color: viewMode === 'tableList' ? '#fff' : undefined,
              }}
              title="All tables overview"
            >
              <List size={16} />
              Tables
            </button>
            <button
              className="btn"
              onClick={() => setViewMode('dictionary')}
              style={{
                borderRadius: 0,
                border: 'none',
                borderLeft: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`,
                backgroundColor: viewMode === 'dictionary'
                  ? (isDarkTheme ? '#3b82f6' : '#2563eb')
                  : 'transparent',
                color: viewMode === 'dictionary' ? '#fff' : undefined,
              }}
              title="Column definitions view"
            >
              <Database size={16} />
              Dictionary
            </button>
            <button
              className="btn"
              onClick={() => setViewMode('data')}
              style={{
                borderRadius: 0,
                border: 'none',
                borderLeft: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`,
                backgroundColor: viewMode === 'data'
                  ? (isDarkTheme ? '#3b82f6' : '#2563eb')
                  : 'transparent',
                color: viewMode === 'data' ? '#fff' : undefined,
              }}
              title="Sample data rows view"
            >
              <Rows3 size={16} />
              Data View
            </button>
          </div>
          {(viewMode === 'dictionary' || viewMode === 'tableList') && (
            <button
              className={`btn ${excelMode ? 'btn-success' : ''}`}
              onClick={toggleExcelMode}
              title={excelMode ? 'Switch to normal view' : 'Switch to Excel-like edit mode (multi-select, copy/paste)'}
            >
              {excelMode ? <TableIcon size={16} /> : <Grid3X3 size={16} />}
              {excelMode ? 'Normal Mode' : 'Excel Mode'}
            </button>
          )}
          {viewMode === 'dictionary' && (
            <div style={{ position: 'relative' }}>
              <button
                className="btn"
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                title="Choose which columns to display"
              >
                <Settings2 size={16} />
                Columns
              </button>
              {showColumnSelector && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    zIndex: 1000,
                    backgroundColor: isDarkTheme ? '#374151' : '#ffffff',
                    border: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                    padding: '12px',
                    minWidth: '200px',
                    marginTop: '4px',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: `1px solid ${isDarkTheme ? '#4b5563' : '#e5e7eb'}` }}>
                    <button
                      onClick={() => {
                        if (visibleColumns.size === allColumns.length) {
                          setVisibleColumns(new Set(['column']));
                        } else {
                          setVisibleColumns(new Set(allColumns.map(c => c.key)));
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '4px 8px',
                        fontSize: '11px',
                        border: `1px solid ${isDarkTheme ? '#6b7280' : '#d1d5db'}`,
                        borderRadius: '4px',
                        backgroundColor: isDarkTheme ? '#4b5563' : '#e5e7eb',
                        color: isDarkTheme ? '#e4e4e7' : '#374151',
                        cursor: 'pointer',
                      }}
                    >
                      {visibleColumns.size === allColumns.length ? 'Hide All' : 'Show All'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {allColumns.map(col => (
                      <label
                        key={col.key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '6px 8px',
                          cursor: 'pointer',
                          borderRadius: '4px',
                          backgroundColor: visibleColumns.has(col.key) ? (isDarkTheme ? '#4b5563' : '#e5e7eb') : 'transparent',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={visibleColumns.has(col.key)}
                          onChange={() => {
                            const newVisible = new Set(visibleColumns);
                            if (newVisible.has(col.key)) {
                              if (newVisible.size > 1) {
                                newVisible.delete(col.key);
                              }
                            } else {
                              newVisible.add(col.key);
                            }
                            setVisibleColumns(newVisible);
                          }}
                          style={{
                            width: '14px',
                            height: '14px',
                            accentColor: isDarkTheme ? '#9ca3af' : '#6b7280',
                          }}
                        />
                        <span style={{ fontSize: '12px', color: isDarkTheme ? '#e4e4e7' : '#374151' }}>
                          {col.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: `1px solid ${isDarkTheme ? '#4b5563' : '#e5e7eb'}` }}>
                    <button
                      onClick={() => setShowColumnSelector(false)}
                      style={{
                        width: '100%',
                        padding: '6px 12px',
                        fontSize: '12px',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: isDarkTheme ? '#6b7280' : '#6b7280',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <button className="btn" onClick={handleEditMode}>
            <Edit3 size={16} />
            Edit Source
          </button>
          <button className="btn" onClick={() => downloadJson(script.data, `${script.name}.json`)}>
            <FileDown size={16} />
            Export JSON
          </button>
        </div>
      </div>

      {/* Table List View Mode */}
      {viewMode === 'tableList' && (
        (() => {
          // Combine targets and sources
          const allTables = [
            ...script.data.targets.map(t => ({ ...t, isSource: false })),
            ...script.data.sources.map(t => ({ ...t, isSource: true })),
          ];

          // Apply filters (multi-select)
          const filteredTables = allTables.filter(table => {
            if (tableListFilters.tableName.length > 0 && !tableListFilters.tableName.includes(table.tableName)) {
              return false;
            }
            if (tableListFilters.domain.length > 0 && !tableListFilters.domain.includes(table.schema)) {
              return false;
            }
            if (tableListFilters.purpose.length > 0 && !tableListFilters.purpose.includes(table.description || '')) {
              return false;
            }
            if (tableListFilters.toIgnore.length > 0) {
              const tableIgnoreValue = table.toIgnore ? 'Y' : 'N';
              if (!tableListFilters.toIgnore.includes(tableIgnoreValue)) {
                return false;
              }
            }
            return true;
          });

          // Table List columns: 0=#(readonly), 1=TableName(readonly), 2=Domain, 3=Purpose, 4=ToIgnore
          const TABLE_LIST_COL_COUNT = 5;
          const EDITABLE_COLS = [2, 3, 4]; // Domain, Purpose, To Ignore

          // Get cell value for table list
          const getTableListCellValue = (rowIdx: number, colIdx: number): string => {
            const table = filteredTables[rowIdx];
            if (!table) return '';
            switch (colIdx) {
              case 0: return String(rowIdx + 1);
              case 1: return table.tableName;
              case 2: return table.schema || '';
              case 3: return table.description || '';
              case 4: return table.toIgnore ? 'Y' : 'N';
              default: return '';
            }
          };

          // Update table field
          const updateTableListCell = (rowIdx: number, colIdx: number, value: string) => {
            const table = filteredTables[rowIdx];
            if (!table) return;
            if (colIdx === 2) {
              onUpdateTable(table.id, { schema: value }, table.isSource);
            } else if (colIdx === 3) {
              onUpdateTable(table.id, { description: value }, table.isSource);
            } else if (colIdx === 4) {
              const boolValue = value.toUpperCase() === 'Y';
              onUpdateTable(table.id, { toIgnore: boolValue }, table.isSource);
            }
          };

          // Check if cell is editable
          const isEditableCol = (colIdx: number) => EDITABLE_COLS.includes(colIdx);

          // Get unique values for filter dropdown
          const getUniqueValues = (field: 'tableName' | 'domain' | 'purpose' | 'toIgnore') => {
            const values = new Set<string>();
            allTables.forEach(table => {
              if (field === 'tableName') values.add(table.tableName);
              else if (field === 'domain') values.add(table.schema || '');
              else if (field === 'purpose') values.add(table.description || '');
              else if (field === 'toIgnore') values.add(table.toIgnore ? 'Y' : 'N');
            });
            return Array.from(values).filter(v => v).sort();
          };

          // Filter header component with multi-select like Excel
          const FilterHeader = ({ column, label, width }: { column: 'tableName' | 'domain' | 'purpose' | 'toIgnore'; label: string; width: string }) => {
            const isActive = activeFilterColumn === column;
            const appliedValues = tableListFilters[column];
            const pendingValues = pendingFilters[column];
            const hasFilter = appliedValues.length > 0;
            const uniqueValues = getUniqueValues(column);

            // Filter unique values by search text
            const filteredUniqueValues = filterSearchText
              ? uniqueValues.filter(v => v.toLowerCase().includes(filterSearchText.toLowerCase()))
              : uniqueValues;

            // Check if all filtered values are selected
            const allSelected = filteredUniqueValues.length > 0 && filteredUniqueValues.every(v => pendingValues.includes(v));

            const toggleValue = (value: string) => {
              setPendingFilters(prev => {
                const current = prev[column];
                if (current.includes(value)) {
                  return { ...prev, [column]: current.filter(v => v !== value) };
                } else {
                  return { ...prev, [column]: [...current, value] };
                }
              });
            };

            const toggleSelectAll = () => {
              if (allSelected) {
                // Clear all filtered values
                setPendingFilters(prev => ({
                  ...prev,
                  [column]: prev[column].filter(v => !filteredUniqueValues.includes(v))
                }));
              } else {
                // Select all filtered values
                setPendingFilters(prev => ({
                  ...prev,
                  [column]: [...new Set([...prev[column], ...filteredUniqueValues])]
                }));
              }
            };

            const handleApply = () => {
              setTableListFilters({ ...pendingFilters });
              setActiveFilterColumn(null);
              setFilterSearchText('');
            };

            const handleCancel = () => {
              setPendingFilters({ ...tableListFilters });
              setActiveFilterColumn(null);
              setFilterSearchText('');
            };

            return (
              <th style={{ width, position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                  <span>{label}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterSearchText('');
                      if (isActive) {
                        handleCancel();
                      } else {
                        // Initialize pending from applied when opening
                        setPendingFilters({ ...tableListFilters });
                        setActiveFilterColumn(column);
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      color: hasFilter ? (isDarkTheme ? '#e4e4e7' : '#374151') : (isDarkTheme ? '#6b7280' : '#9ca3af'),
                      backgroundColor: hasFilter ? (isDarkTheme ? '#4b5563' : '#e5e7eb') : 'transparent',
                      borderRadius: '4px',
                    }}
                    title={hasFilter ? `${appliedValues.length} selected` : 'Click to filter'}
                    onMouseEnter={(e) => {
                      if (!hasFilter) {
                        e.currentTarget.style.backgroundColor = isDarkTheme ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!hasFilter) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Filter size={14} />
                    {hasFilter && <span style={{ fontSize: '10px', marginLeft: '2px' }}>{appliedValues.length}</span>}
                    <ChevronDown size={12} />
                  </button>
                </div>
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      zIndex: 1000,
                      backgroundColor: isDarkTheme ? '#374151' : '#f3f4f6',
                      border: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`,
                      borderRadius: '4px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                      padding: '8px',
                      minWidth: '200px',
                      maxWidth: '280px',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Search box */}
                    <input
                      type="text"
                      value={filterSearchText}
                      onChange={(e) => setFilterSearchText(e.target.value)}
                      placeholder="Search..."
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        fontSize: '12px',
                        border: `1px solid ${isDarkTheme ? '#6b7280' : '#d1d5db'}`,
                        borderRadius: '4px',
                        backgroundColor: isDarkTheme ? '#1f2937' : '#ffffff',
                        color: isDarkTheme ? '#e4e4e7' : '#18181b',
                        marginBottom: '8px',
                      }}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          handleCancel();
                        } else if (e.key === 'Enter') {
                          handleApply();
                        }
                      }}
                    />

                    {/* Toggle Select All / Clear All button */}
                    <div style={{ marginBottom: '8px', borderBottom: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`, paddingBottom: '8px' }}>
                      <button
                        onClick={toggleSelectAll}
                        style={{
                          width: '100%',
                          padding: '4px 8px',
                          fontSize: '11px',
                          border: `1px solid ${isDarkTheme ? '#6b7280' : '#d1d5db'}`,
                          borderRadius: '4px',
                          backgroundColor: isDarkTheme ? '#4b5563' : '#e5e7eb',
                          color: isDarkTheme ? '#e4e4e7' : '#374151',
                          cursor: 'pointer',
                        }}
                      >
                        {allSelected ? 'Clear All' : 'Select All'}
                      </button>
                    </div>

                    {/* Checkbox list */}
                    <div style={{ maxHeight: '180px', overflowY: 'auto', fontSize: '12px' }}>
                      {filteredUniqueValues.length === 0 ? (
                        <div style={{ padding: '8px', color: isDarkTheme ? '#9ca3af' : '#6b7280', fontStyle: 'italic', textAlign: 'center' }}>
                          No matches
                        </div>
                      ) : (
                        filteredUniqueValues.map(value => (
                          <label
                            key={value}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '6px 8px',
                              cursor: 'pointer',
                              borderRadius: '4px',
                              backgroundColor: pendingValues.includes(value) ? (isDarkTheme ? '#4b5563' : '#e5e7eb') : 'transparent',
                            }}
                            onMouseEnter={(e) => {
                              if (!pendingValues.includes(value)) {
                                e.currentTarget.style.backgroundColor = isDarkTheme ? '#4b5563' : '#e5e7eb';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!pendingValues.includes(value)) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                              }
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={pendingValues.includes(value)}
                              onChange={() => toggleValue(value)}
                              style={{
                                width: '14px',
                                height: '14px',
                                accentColor: isDarkTheme ? '#9ca3af' : '#6b7280',
                              }}
                            />
                            <span style={{
                              color: isDarkTheme ? '#e4e4e7' : '#374151',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}>
                              {value || '(empty)'}
                            </span>
                          </label>
                        ))
                      )}
                    </div>

                    {/* Apply / Cancel buttons */}
                    <div style={{ marginTop: '8px', borderTop: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`, paddingTop: '8px', display: 'flex', gap: '8px' }}>
                      <button
                        onClick={handleCancel}
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          fontSize: '12px',
                          border: `1px solid ${isDarkTheme ? '#6b7280' : '#d1d5db'}`,
                          borderRadius: '4px',
                          backgroundColor: 'transparent',
                          color: isDarkTheme ? '#e4e4e7' : '#374151',
                          cursor: 'pointer',
                          fontWeight: 500,
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleApply}
                        style={{
                          flex: 1,
                          padding: '6px 12px',
                          fontSize: '12px',
                          border: 'none',
                          borderRadius: '4px',
                          backgroundColor: isDarkTheme ? '#6b7280' : '#6b7280',
                          color: '#ffffff',
                          cursor: 'pointer',
                          fontWeight: 500,
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </th>
            );
          };

          // Excel mode cell selection style
          const getTableListSelectionStyle = (rowIdx: number, colIdx: number): React.CSSProperties => {
            if (!excelMode) return {};

            const isActive = activeCell?.row === rowIdx && activeCell?.col === colIdx;
            const isSelected = selectedCells.some(c => c.row === rowIdx && c.col === colIdx);

            if (isActive) {
              return {
                outline: '2px solid #2563eb',
                outlineOffset: '-2px',
                backgroundColor: isDarkTheme ? 'rgba(30, 58, 95, 0.5)' : 'rgba(219, 234, 254, 0.7)',
              };
            }
            if (isSelected) {
              return {
                backgroundColor: isDarkTheme ? 'rgba(30, 58, 95, 0.3)' : 'rgba(191, 219, 254, 0.5)',
              };
            }
            return {};
          };

          // Excel mode cell event handlers for table list
          const getTableListCellProps = (rowIdx: number, colIdx: number) => {
            if (!excelMode) return {};

            return {
              onClick: (e: React.MouseEvent) => {
                e.stopPropagation();
                if (e.shiftKey && activeCell) {
                  const range = getCellRange(activeCell, { row: rowIdx, col: colIdx });
                  setSelectedCells(range);
                } else if (e.ctrlKey || e.metaKey) {
                  if (isCellSelected(rowIdx, colIdx)) {
                    setSelectedCells(prev => prev.filter(c => !(c.row === rowIdx && c.col === colIdx)));
                  } else {
                    setSelectedCells(prev => [...prev, { row: rowIdx, col: colIdx }]);
                  }
                  setActiveCell({ row: rowIdx, col: colIdx });
                } else {
                  setSelectedCells([{ row: rowIdx, col: colIdx }]);
                  setActiveCell({ row: rowIdx, col: colIdx });
                }
                if (editingCell) setEditingCell(null);
              },
              onDoubleClick: () => {
                if (isEditableCol(colIdx)) {
                  setEditingCell({ row: rowIdx, col: colIdx });
                  setEditValue(getTableListCellValue(rowIdx, colIdx));
                  setActiveCell({ row: rowIdx, col: colIdx });
                  setSelectedCells([{ row: rowIdx, col: colIdx }]);
                }
              },
              onMouseDown: (e: React.MouseEvent) => {
                if (e.button !== 0 || e.shiftKey || e.ctrlKey || e.metaKey) return;
                setSelectionStart({ row: rowIdx, col: colIdx });
                setIsDragging(true);
                setSelectedCells([{ row: rowIdx, col: colIdx }]);
                setActiveCell({ row: rowIdx, col: colIdx });
              },
              onMouseMove: () => {
                if (isDragging && selectionStart) {
                  const range = getCellRange(selectionStart, { row: rowIdx, col: colIdx });
                  setSelectedCells(range);
                }
              },
              style: {
                ...getTableListSelectionStyle(rowIdx, colIdx),
                cursor: excelMode ? 'cell' : 'default',
                userSelect: 'none' as const,
              },
            };
          };

          // Handle keyboard for table list
          const handleTableListKeyDown = (e: React.KeyboardEvent) => {
            if (!excelMode) return;

            const maxRow = filteredTables.length - 1;
            const maxCol = TABLE_LIST_COL_COUNT - 1;

            // Handle editing
            if (editingCell) {
              if (e.key === 'Enter') {
                e.preventDefault();
                updateTableListCell(editingCell.row, editingCell.col, editValue);
                setEditingCell(null);
                // Move down
                const newRow = Math.min(editingCell.row + 1, maxRow);
                setActiveCell({ row: newRow, col: editingCell.col });
                setSelectedCells([{ row: newRow, col: editingCell.col }]);
              } else if (e.key === 'Tab') {
                e.preventDefault();
                updateTableListCell(editingCell.row, editingCell.col, editValue);
                setEditingCell(null);
                // Move right/left
                let newCol = e.shiftKey ? editingCell.col - 1 : editingCell.col + 1;
                let newRow = editingCell.row;
                if (newCol > maxCol) { newCol = 0; newRow = Math.min(newRow + 1, maxRow); }
                if (newCol < 0) { newCol = maxCol; newRow = Math.max(newRow - 1, 0); }
                setActiveCell({ row: newRow, col: newCol });
                setSelectedCells([{ row: newRow, col: newCol }]);
              } else if (e.key === 'Escape') {
                e.preventDefault();
                setEditingCell(null);
              }
              return;
            }

            if (!activeCell) {
              if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'].includes(e.key)) {
                setActiveCell({ row: 0, col: 0 });
                setSelectedCells([{ row: 0, col: 0 }]);
              }
              return;
            }

            let newRow = activeCell.row;
            let newCol = activeCell.col;

            switch (e.key) {
              case 'ArrowUp':
                e.preventDefault();
                newRow = Math.max(0, activeCell.row - 1);
                break;
              case 'ArrowDown':
                e.preventDefault();
                newRow = Math.min(maxRow, activeCell.row + 1);
                break;
              case 'ArrowLeft':
                e.preventDefault();
                newCol = Math.max(0, activeCell.col - 1);
                break;
              case 'ArrowRight':
                e.preventDefault();
                newCol = Math.min(maxCol, activeCell.col + 1);
                break;
              case 'Tab':
                e.preventDefault();
                if (e.shiftKey) {
                  newCol = activeCell.col - 1;
                  if (newCol < 0) { newCol = maxCol; newRow = Math.max(0, activeCell.row - 1); }
                } else {
                  newCol = activeCell.col + 1;
                  if (newCol > maxCol) { newCol = 0; newRow = Math.min(maxRow, activeCell.row + 1); }
                }
                break;
              case 'Enter':
              case 'F2':
                e.preventDefault();
                if (isEditableCol(activeCell.col)) {
                  setEditingCell(activeCell);
                  setEditValue(getTableListCellValue(activeCell.row, activeCell.col));
                }
                return;
              case 'Delete':
              case 'Backspace':
                e.preventDefault();
                selectedCells.forEach(cell => {
                  if (isEditableCol(cell.col)) {
                    updateTableListCell(cell.row, cell.col, cell.col === 4 ? 'N' : '');
                  }
                });
                return;
              default:
                // Start editing on printable character
                if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                  if (isEditableCol(activeCell.col)) {
                    e.preventDefault();
                    setEditingCell(activeCell);
                    setEditValue(e.key);
                  }
                }
                return;
            }

            if (e.shiftKey && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
              const range = getCellRange(selectedCells[0] || activeCell, { row: newRow, col: newCol });
              setSelectedCells(range);
            } else {
              setSelectedCells([{ row: newRow, col: newCol }]);
            }
            setActiveCell({ row: newRow, col: newCol });
          };

          const hasActiveFilters = Object.values(tableListFilters).some(v => v.length > 0);

          return (
            <div
              tabIndex={excelMode ? 0 : undefined}
              onKeyDown={excelMode ? handleTableListKeyDown : undefined}
              onClick={() => setActiveFilterColumn(null)}
              style={{ outline: 'none' }}
            >
              {/* Excel Mode Help Banner */}
              {excelMode && (
                <div style={{
                  backgroundColor: isDarkTheme ? '#1e3a5f' : '#dbeafe',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  marginBottom: '16px',
                  fontSize: '12px',
                  color: isDarkTheme ? '#93c5fd' : '#1e40af',
                }}>
                  <strong>Excel Mode:</strong> Click to select • Shift+Click for range • Ctrl+Click for multi-select •
                  Arrow keys to navigate • Enter/F2 to edit • Tab to move • Delete to clear •
                  Use Y/N for "To Ignore"
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', borderBottom: `2px solid ${isDarkTheme ? '#334155' : '#eee'}`, paddingBottom: '8px' }}>
                <h3 style={{ fontSize: '14px', color: isDarkTheme ? '#e4e4e7' : '#2c3e50', margin: 0 }}>
                  All Tables
                  <span style={{ fontWeight: 'normal', fontSize: '12px', color: isDarkTheme ? '#a1a1aa' : '#6b7280', marginLeft: '8px' }}>
                    ({filteredTables.length}{hasActiveFilters ? ` of ${allTables.length}` : ''} tables)
                    {excelMode && selectedCells.length > 0 && ` • ${selectedCells.length} cell${selectedCells.length !== 1 ? 's' : ''} selected`}
                  </span>
                </h3>
                {hasActiveFilters && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTableListFilters({ tableName: [], domain: [], purpose: [], toIgnore: [] });
                    }}
                    style={{
                      background: 'none',
                      border: `1px solid ${isDarkTheme ? '#4b5563' : '#d1d5db'}`,
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      color: isDarkTheme ? '#a1a1aa' : '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <X size={12} />
                    Clear Filters
                  </button>
                )}
              </div>

              <div style={{ overflowX: 'auto', overflowY: 'visible', maxHeight: 'calc(100vh - 250px)', minHeight: '500px', position: 'relative' }}>
                <table className={`data-table ${excelMode ? 'excel-mode' : ''}`} style={{ tableLayout: 'fixed', width: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{ width: '50px', textAlign: 'center' }}>#</th>
                      <FilterHeader column="tableName" label="Table Name" width="25%" />
                      <FilterHeader column="domain" label="Domain" width="15%" />
                      <FilterHeader column="purpose" label="Purpose" width="45%" />
                      <FilterHeader column="toIgnore" label="To Ignore?" width="80px" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTables.map((table, rowIdx) => (
                      <tr key={`${table.isSource ? 'src' : 'tgt'}-${table.id}`}>
                        {/* # column - readonly */}
                        <td
                          {...getTableListCellProps(rowIdx, 0)}
                          style={{
                            textAlign: 'center',
                            color: isDarkTheme ? '#a1a1aa' : '#9ca3af',
                            fontSize: '12px',
                            ...getTableListSelectionStyle(rowIdx, 0),
                            ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                          }}
                        >
                          {rowIdx + 1}
                        </td>
                        {/* Table Name - readonly */}
                        <td
                          className="code-cell"
                          {...getTableListCellProps(rowIdx, 1)}
                          style={{
                            wordBreak: 'break-word',
                            ...getTableListSelectionStyle(rowIdx, 1),
                            ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {table.tableName}
                            {table.isSource && (
                              <span style={{
                                fontSize: '10px',
                                padding: '1px 4px',
                                borderRadius: '3px',
                                backgroundColor: isDarkTheme ? '#3b82f6' : '#dbeafe',
                                color: isDarkTheme ? '#dbeafe' : '#1d4ed8',
                              }}>SRC</span>
                            )}
                          </div>
                        </td>
                        {/* Domain - editable */}
                        <td
                          {...getTableListCellProps(rowIdx, 2)}
                          style={{
                            ...getTableListSelectionStyle(rowIdx, 2),
                            ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                          }}
                        >
                          {editingCell?.row === rowIdx && editingCell?.col === 2 ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={() => {
                                updateTableListCell(rowIdx, 2, editValue);
                                setEditingCell(null);
                              }}
                              onKeyDown={(e) => e.stopPropagation()}
                              autoFocus
                              style={{
                                width: '100%',
                                padding: '4px',
                                fontSize: '13px',
                                border: '2px solid #2563eb',
                                borderRadius: '2px',
                                backgroundColor: isDarkTheme ? '#1e293b' : '#ffffff',
                                color: isDarkTheme ? '#e4e4e7' : '#18181b',
                                outline: 'none',
                              }}
                            />
                          ) : excelMode ? (
                            <div style={{ padding: '4px', minHeight: '20px' }}>
                              {table.schema || <span style={{ color: '#999', fontStyle: 'italic' }}>-</span>}
                            </div>
                          ) : (
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => onUpdateTable(table.id, { schema: e.currentTarget.textContent || '' }, table.isSource)}
                              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); } }}
                              style={{
                                cursor: 'text', whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: '20px', padding: '4px', borderRadius: '4px',
                                border: '1px dashed transparent', color: table.schema ? (isDarkTheme ? '#e4e4e7' : '#18181b') : (isDarkTheme ? '#6b7280' : '#999'),
                                fontStyle: table.schema ? 'normal' : 'italic', transition: 'border-color 0.2s',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = isDarkTheme ? '#4b5563' : '#ccc'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
                            >
                              {table.schema || '(Click to add)'}
                            </div>
                          )}
                        </td>
                        {/* Purpose - editable */}
                        <td
                          {...getTableListCellProps(rowIdx, 3)}
                          style={{
                            ...getTableListSelectionStyle(rowIdx, 3),
                            ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                          }}
                        >
                          {editingCell?.row === rowIdx && editingCell?.col === 3 ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onBlur={() => {
                                updateTableListCell(rowIdx, 3, editValue);
                                setEditingCell(null);
                              }}
                              onKeyDown={(e) => e.stopPropagation()}
                              autoFocus
                              style={{
                                width: '100%',
                                padding: '4px',
                                fontSize: '13px',
                                border: '2px solid #2563eb',
                                borderRadius: '2px',
                                backgroundColor: isDarkTheme ? '#1e293b' : '#ffffff',
                                color: isDarkTheme ? '#e4e4e7' : '#18181b',
                                outline: 'none',
                              }}
                            />
                          ) : excelMode ? (
                            <div style={{ padding: '4px', minHeight: '20px' }}>
                              {table.description || <span style={{ color: '#999', fontStyle: 'italic' }}>-</span>}
                            </div>
                          ) : (
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => onUpdateTable(table.id, { description: e.currentTarget.textContent || '' }, table.isSource)}
                              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); } }}
                              style={{
                                cursor: 'text', whiteSpace: 'pre-wrap', wordBreak: 'break-word', minHeight: '20px', padding: '4px', borderRadius: '4px',
                                border: '1px dashed transparent', color: table.description ? (isDarkTheme ? '#e4e4e7' : '#18181b') : (isDarkTheme ? '#6b7280' : '#999'),
                                fontStyle: table.description ? 'normal' : 'italic', transition: 'border-color 0.2s',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = isDarkTheme ? '#4b5563' : '#ccc'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
                            >
                              {table.description || '(Click to add)'}
                            </div>
                          )}
                        </td>
                        {/* To Ignore - editable Y/N */}
                        <td
                          {...getTableListCellProps(rowIdx, 4)}
                          style={{
                            textAlign: 'center',
                            ...getTableListSelectionStyle(rowIdx, 4),
                            ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                          }}
                        >
                          {editingCell?.row === rowIdx && editingCell?.col === 4 ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value.toUpperCase())}
                              onBlur={() => {
                                updateTableListCell(rowIdx, 4, editValue);
                                setEditingCell(null);
                              }}
                              onKeyDown={(e) => e.stopPropagation()}
                              autoFocus
                              maxLength={1}
                              style={{
                                width: '40px',
                                padding: '4px',
                                fontSize: '13px',
                                border: '2px solid #2563eb',
                                borderRadius: '2px',
                                backgroundColor: isDarkTheme ? '#1e293b' : '#ffffff',
                                color: isDarkTheme ? '#e4e4e7' : '#18181b',
                                outline: 'none',
                                textAlign: 'center',
                              }}
                            />
                          ) : excelMode ? (
                            <div style={{ padding: '4px' }}>
                              {table.toIgnore ? 'Y' : 'N'}
                            </div>
                          ) : (
                            <div
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => {
                                const val = e.currentTarget.textContent?.trim().toUpperCase() || 'N';
                                onUpdateTable(table.id, { toIgnore: val === 'Y' }, table.isSource);
                                e.currentTarget.textContent = val === 'Y' ? 'Y' : 'N';
                              }}
                              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
                              style={{
                                cursor: 'text', padding: '4px', borderRadius: '4px', border: '1px dashed transparent',
                                transition: 'border-color 0.2s',
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.borderColor = isDarkTheme ? '#4b5563' : '#ccc'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'transparent'; }}
                            >
                              {table.toIgnore ? 'Y' : 'N'}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()
      )}

      {/* Data View Mode */}
      {viewMode === 'data' && selectedTable && (
        (() => {
          // Get sample data - build rows from column sample values
          const columnsWithData = selectedTable.columns.filter(col => col.sampleValues && col.sampleValues.length > 0);
          const maxRows = Math.max(...selectedTable.columns.map(col => col.sampleValues?.length || 0), 0);
          const hasData = maxRows > 0;

          return (
            <div>
              <h3 style={{ fontSize: '14px', color: '#2c3e50', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>
                Sample Data
                {hasData && (
                  <span style={{ fontWeight: 'normal', fontSize: '12px', color: '#6b7280', marginLeft: '8px' }}>
                    ({maxRows} rows, {columnsWithData.length}/{selectedTable.columns.length} columns with data)
                  </span>
                )}
              </h3>

              {!hasData ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#6b7280',
                }}>
                  <Rows3 size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>No sample data attached</div>
                  <div style={{ fontSize: '12px', marginTop: '4px' }}>
                    Use "Attach Sample Data" in the Script Manager to add CSV data
                  </div>
                </div>
              ) : (
                <div style={{ overflow: 'auto', maxHeight: 'calc(100vh - 250px)' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '40px', textAlign: 'center' }}>#</th>
                        {selectedTable.columns.map((col, i) => (
                          <th key={i}>
                            <div className="code-cell">{col.name}</div>
                            <div style={{ fontSize: '11px', fontWeight: 'normal', opacity: 0.7 }}>{col.type}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: maxRows }, (_, rowIdx) => (
                        <tr key={rowIdx}>
                          <td style={{ textAlign: 'center', color: '#9ca3af', fontSize: '11px' }}>
                            {rowIdx + 1}
                          </td>
                          {selectedTable.columns.map((col, colIdx) => {
                            const value = col.sampleValues?.[rowIdx];
                            const isNull = value === undefined || value === null;
                            const isEmpty = value === '';
                            return (
                              <td
                                key={colIdx}
                                className="code-cell"
                                style={{
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                  verticalAlign: 'top',
                                }}
                              >
                                {isNull ? (
                                  <span style={{ fontStyle: 'italic', opacity: 0.5 }}>NULL</span>
                                ) : isEmpty ? (
                                  <span>&nbsp;</span>
                                ) : (
                                  value
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })()
      )}

      {/* Dictionary View Mode */}
      {viewMode === 'dictionary' && selectedTable && (
        <>
          {/* Excel Mode Help Banner */}
          {excelMode && (
            <div style={{
              backgroundColor: isDarkTheme ? '#1e3a5f' : '#dbeafe',
              padding: '8px 12px',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '12px',
              color: isDarkTheme ? '#93c5fd' : '#1e40af',
            }}>
              <strong>Excel Mode:</strong> Click to select • Shift+Click for range • Ctrl+Click for multi-select •
              Drag to select range • Arrow keys to navigate • Enter/F2 to edit • Tab to move right •
              Ctrl+C to copy • Ctrl+V to paste • Delete to clear • Ctrl+Z undo • Ctrl+Y redo
            </div>
          )}

          {/* Table Metadata */}
      <h3 style={{ fontSize: '14px', color: '#2c3e50', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>
        Table Information
      </h3>
      <table className="data-table" style={{ marginBottom: '24px' }}>
        <tbody>
          <tr>
            <th style={{ width: '150px' }}>Schema</th>
            <td>{selectedTable.schema}</td>
          </tr>
          <tr>
            <th>Table Name</th>
            <td className="code-cell">{selectedTable.tableName}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => onUpdateTable(selectedTable.id, { description: e.currentTarget.textContent || '' }, isSourceTable)}
              style={{ cursor: 'text' }}
            >
              {selectedTable.description || '(Click to add description)'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Constraints */}
      {selectedTable.constraints.length > 0 && (
        <>
          <h3 style={{ fontSize: '14px', color: '#2c3e50', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>
            Constraints
          </h3>
          <table className="data-table" style={{ marginBottom: '24px' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Columns</th>
                <th>Reference</th>
              </tr>
            </thead>
            <tbody>
              {selectedTable.constraints.map((c, i) => (
                <tr key={i}>
                  <td className="code-cell">{c.name}</td>
                  <td>{c.type}</td>
                  <td className="code-cell">{c.localCols}</td>
                  <td className="code-cell">{c.ref || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Columns */}
      <h3 style={{ fontSize: '14px', color: isDarkTheme ? '#e4e4e7' : '#2c3e50', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>
        Column Details {excelMode && `(${selectedCells.length} cell${selectedCells.length !== 1 ? 's' : ''} selected)`}
      </h3>

      {/* Single table with optional Excel mode selection overlay */}
      <div style={{ position: 'relative' }}>
      <table
        ref={tableRef}
        className={`data-table ${excelMode ? 'excel-mode' : ''}`}
        style={{ tableLayout: 'fixed', width: '100%' }}
      >
        <thead>
          <tr>
            {visibleColumns.has('column') && <th style={{ width: allColumns.find(c => c.key === 'column')?.width }}>Column</th>}
            {visibleColumns.has('type') && <th style={{ width: allColumns.find(c => c.key === 'type')?.width }}>Type</th>}
            {visibleColumns.has('nullable') && <th style={{ width: allColumns.find(c => c.key === 'nullable')?.width }}>Nullable</th>}
            {visibleColumns.has('default') && <th style={{ width: allColumns.find(c => c.key === 'default')?.width }}>Default</th>}
            {visibleColumns.has('explanation') && <th style={{ width: allColumns.find(c => c.key === 'explanation')?.width }}>Explanation</th>}
            {visibleColumns.has('mapping') && <th style={{ width: allColumns.find(c => c.key === 'mapping')?.width }}>Mapping Logic</th>}
            {visibleColumns.has('sampleValues') && <th style={{ width: allColumns.find(c => c.key === 'sampleValues')?.width }}>Sample Values</th>}
            {visibleColumns.has('mappedTo') && <th style={{ width: allColumns.find(c => c.key === 'mappedTo')?.width }}>Mapped To</th>}
          </tr>
        </thead>
        <tbody>
          {selectedTable.columns.map((col, rowIndex) => {
            const tags = getColumnTags(selectedTable, col.name);
            const mappingInfo = getMappingInfo(selectedTable.tableName, col.name);
            const migrationNeeded = col.migrationNeeded !== false; // default true

            // Determine display text for "Mapped To" column (auto-populated)
            let mappedToDisplay = '';
            if (mappingInfo) {
              mappedToDisplay = mappingInfo;
            } else if (!migrationNeeded) {
              mappedToDisplay = `Not Mapped${col.nonMigrationComment ? ` - ${col.nonMigrationComment}` : ''}`;
            } else {
              mappedToDisplay = '-';
            }

            // Helper to get selection style for a cell
            const getSelectionStyle = (colIndex: number): React.CSSProperties => {
              if (!excelMode) return {};

              const isActive = isCellActive(rowIndex, colIndex);
              const isSelected = isCellSelected(rowIndex, colIndex);

              if (isActive) {
                return {
                  outline: '2px solid #2563eb',
                  outlineOffset: '-2px',
                  backgroundColor: isDarkTheme ? 'rgba(30, 58, 95, 0.5)' : 'rgba(219, 234, 254, 0.7)',
                };
              }
              if (isSelected) {
                return {
                  backgroundColor: isDarkTheme ? 'rgba(30, 58, 95, 0.3)' : 'rgba(191, 219, 254, 0.5)',
                };
              }
              return {};
            };

            // Helper for Excel mode cell event handlers
            const excelCellProps = (colIndex: number) => excelMode ? {
              onClick: (e: React.MouseEvent) => handleCellClick(rowIndex, colIndex, e),
              onDoubleClick: () => handleCellDoubleClick(rowIndex, colIndex),
              onMouseDown: (e: React.MouseEvent) => handleCellMouseDown(rowIndex, colIndex, e),
              onMouseMove: () => handleCellMouseMove(rowIndex, colIndex),
              style: {
                ...getSelectionStyle(colIndex),
                cursor: 'cell',
                userSelect: 'none' as const,
              },
            } : {};

            return (
              <tr key={rowIndex}>
                {/* Column Name */}
                {visibleColumns.has('column') && (
                <td
                  className="code-cell"
                  {...excelCellProps(0)}
                  style={{
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                    ...getSelectionStyle(0),
                    ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                  }}
                >
                  {col.name}{tags.length > 0 ? ` (${tags.join(', ')})` : ''}
                </td>
                )}

                {/* Type */}
                {visibleColumns.has('type') && (
                <td
                  className="code-cell"
                  {...excelCellProps(1)}
                  style={{
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                    ...getSelectionStyle(1),
                    ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                  }}
                >
                  {col.type}
                </td>
                )}

                {/* Nullable */}
                {visibleColumns.has('nullable') && (
                <td
                  {...excelCellProps(2)}
                  style={{
                    ...getSelectionStyle(2),
                    ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                  }}
                >
                  {col.nullable?.toUpperCase() === 'YES' || col.nullable?.toUpperCase() === 'Y' ? 'NULL' : 'NOT NULL'}
                </td>
                )}

                {/* Default */}
                {visibleColumns.has('default') && (
                <td
                  className="code-cell"
                  {...excelCellProps(3)}
                  style={{
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    whiteSpace: 'normal',
                    ...getSelectionStyle(3),
                    ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                  }}
                >
                  {col.default || '-'}
                </td>
                )}

                {/* Explanation */}
                {visibleColumns.has('explanation') && (
                <td
                  {...excelCellProps(4)}
                  style={{
                    ...getSelectionStyle(4),
                    ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                  }}
                >
                  {excelMode ? (
                    <div
                      style={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        minHeight: '20px',
                        padding: '4px',
                      }}
                      dangerouslySetInnerHTML={{ __html: col.explanation || '<span style="color: #999; font-style: italic;">-</span>' }}
                    />
                  ) : (
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      title="Click to edit explanation"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          e.currentTarget.blur();
                        }
                      }}
                      onBlur={(e) => updateColumnField(col.name, 'explanation', e.currentTarget.innerHTML || '')}
                      onFocus={(e) => {
                        if (e.currentTarget.innerHTML === '<span style="color: #999; font-style: italic;">(Click to add)</span>') {
                          e.currentTarget.innerHTML = '';
                        }
                      }}
                      dangerouslySetInnerHTML={{ __html: col.explanation || '<span style="color: #999; font-style: italic;">(Click to add)</span>' }}
                      style={{
                        cursor: 'text',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        minHeight: '20px',
                        padding: '4px',
                        borderRadius: '4px',
                        border: '1px dashed transparent',
                        transition: 'border-color 0.2s, background-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#ccc';
                        e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    />
                  )}
                </td>
                )}

                {/* Mapping Logic */}
                {visibleColumns.has('mapping') && (
                <td
                  {...excelCellProps(5)}
                  style={{
                    ...getSelectionStyle(5),
                    ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                  }}
                >
                  {excelMode ? (
                    <div
                      style={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        minHeight: '20px',
                        padding: '4px',
                      }}
                      dangerouslySetInnerHTML={{ __html: col.mapping || '<span style="color: #999; font-style: italic;">-</span>' }}
                    />
                  ) : (
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      title="Click to edit mapping logic"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          e.currentTarget.blur();
                        }
                      }}
                      onBlur={(e) => updateColumnField(col.name, 'mapping', e.currentTarget.innerHTML || '')}
                      onFocus={(e) => {
                        if (e.currentTarget.innerHTML === '<span style="color: #999; font-style: italic;">(Click to add)</span>') {
                          e.currentTarget.innerHTML = '';
                        }
                      }}
                      dangerouslySetInnerHTML={{ __html: col.mapping || '<span style="color: #999; font-style: italic;">(Click to add)</span>' }}
                      style={{
                        cursor: 'text',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        minHeight: '20px',
                        padding: '4px',
                        borderRadius: '4px',
                        border: '1px dashed transparent',
                        transition: 'border-color 0.2s, background-color 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#ccc';
                        e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    />
                  )}
                </td>
                )}

                {/* Sample Values (read-only) */}
                {visibleColumns.has('sampleValues') && (
                <td
                  {...(excelMode ? {
                    onClick: (e: React.MouseEvent) => handleCellClick(rowIndex, 6, e),
                    onMouseDown: (e: React.MouseEvent) => handleCellMouseDown(rowIndex, 6, e),
                    onMouseMove: () => handleCellMouseMove(rowIndex, 6),
                  } : {})}
                  style={{
                    ...getSelectionStyle(6),
                    ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                  }}
                >
                  <div
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      minHeight: '20px',
                      fontSize: '12px',
                      color: col.sampleValues && col.sampleValues.length > 0 ? (isDarkTheme ? '#93c5fd' : '#2563eb') : '#999',
                    }}
                  >
                    {col.sampleValues && col.sampleValues.length > 0 ? (
                      <>
                        <span style={{ marginRight: '4px' }}>📎</span>
                        {col.sampleValues.slice(0, 5).join(', ')}
                        {col.sampleValues.length > 5 && '...'}
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                </td>
                )}

                {/* Mapped To (read-only, not selectable in Excel mode for editing but viewable) */}
                {visibleColumns.has('mappedTo') && (
                <td
                  {...(excelMode ? {
                    onClick: (e: React.MouseEvent) => handleCellClick(rowIndex, 7, e),
                    onMouseDown: (e: React.MouseEvent) => handleCellMouseDown(rowIndex, 7, e),
                    onMouseMove: () => handleCellMouseMove(rowIndex, 7),
                  } : {})}
                  style={{
                    ...getSelectionStyle(7),
                    ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{ __html: mappedToDisplay }}
                    style={{
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      minHeight: '20px',
                      color: mappedToDisplay === '-' ? '#999' : 'inherit',
                    }}
                  />
                </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Excel mode editing input overlay */}
      {excelMode && editingCell && editInputPosition && (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => {
            e.stopPropagation(); // Prevent bubbling to parent handlers
            setEditValue(e.target.value);
          }}
          onKeyDown={(e) => {
            // CRITICAL: Stop propagation so parent div's handleKeyDown doesn't also fire
            // Without this, Enter/Tab/Escape get handled TWICE (input + parent div),
            // causing double saves and double cursor movement
            e.stopPropagation();

            if (e.key === 'Enter') {
              e.preventDefault();
              // Flush any pending debounced save first
              if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
                saveTimeoutRef.current = null;
              }
              commitEdit('down');
            } else if (e.key === 'Tab') {
              e.preventDefault();
              if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
                saveTimeoutRef.current = null;
              }
              commitEdit(e.shiftKey ? 'left' : 'right');
            } else if (e.key === 'Escape') {
              e.preventDefault();
              // Cancel: clear pending save and discard
              if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
                saveTimeoutRef.current = null;
              }
              setEditingCell(null);
            }
          }}
          onBlur={() => {
            // Save and close editing on blur (clicking elsewhere)
            // Flush any pending debounced save
            if (saveTimeoutRef.current) {
              clearTimeout(saveTimeoutRef.current);
              saveTimeoutRef.current = null;
            }
            if (editingCell) {
              updateCellValue(editingCell.row, editingCell.col, editValue);
              setEditingCell(null);
            }
          }}
          style={{
            position: 'absolute',
            top: editInputPosition.top,
            left: editInputPosition.left,
            width: editInputPosition.width,
            height: editInputPosition.height,
            minWidth: '60px',
            boxSizing: 'border-box',
            padding: '4px 8px',
            fontSize: '13px',
            fontFamily: 'inherit',
            border: '2px solid #2563eb',
            borderRadius: '2px',
            outline: 'none',
            backgroundColor: isDarkTheme ? '#1e293b' : '#ffffff',
            color: isDarkTheme ? '#e2e8f0' : '#1e293b',
            zIndex: 100,
          }}
        />
      )}
      </div>
        </>
      )}
    </div>
  );
}
