import { useState, useRef, useEffect, useCallback } from 'react';
import { Script, Table, Column } from '../types';
import { downloadJson, loadMappingProjects } from '../utils/storage';
import CodeEditor from './CodeEditor';
import { FileDown, Edit3, Save, X, Grid3X3, Table as TableIcon } from 'lucide-react';

// Cell coordinate type for Excel-like selection
interface CellCoord {
  row: number;
  col: number; // 0=name, 1=type, 2=nullable, 3=default, 4=explanation, 5=mapping, 6=mappedTo (computed)
}

// Column fields for copy operations (6 is computed "Mapped To")
const COLUMN_COUNT = 7;

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

  // Update cell value by coordinates (only for editable columns 0-5)
  const updateCellValue = useCallback((row: number, col: number, value: string) => {
    if (!selectedTable || row < 0 || row >= selectedTable.columns.length) return;
    if (col >= 6) return; // "Mapped To" is read-only
    const column = selectedTable.columns[row];

    const fieldMap: { [key: number]: keyof Column } = {
      0: 'name',
      1: 'type',
      2: 'nullable',
      3: 'default',
      4: 'explanation',
      5: 'mapping',
    };

    const field = fieldMap[col];
    if (field) {
      updateColumnField(column.name, field, value);
    }
  }, [selectedTable, updateColumnField]);

  // Check if cell is selected
  const isCellSelected = useCallback((row: number, col: number): boolean => {
    return selectedCells.some(c => c.row === row && c.col === col);
  }, [selectedCells]);

  // Check if cell is active (has focus)
  const isCellActive = useCallback((row: number, col: number): boolean => {
    return activeCell?.row === row && activeCell?.col === col;
  }, [activeCell]);

  // Check if cell is being edited
  const isCellEditing = useCallback((row: number, col: number): boolean => {
    return editingCell?.row === row && editingCell?.col === col;
  }, [editingCell]);

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

    // Clear any editing state
    if (editingCell) {
      setEditingCell(null);
    }
  }, [excelMode, activeCell, getCellRange, isCellSelected, editingCell]);

  // Handle cell double click to enter edit mode
  const handleCellDoubleClick = useCallback((row: number, col: number) => {
    if (!excelMode) return;

    setEditingCell({ row, col });
    setEditValue(getCellValue(row, col));
    setActiveCell({ row, col });
    setSelectedCells([{ row, col }]);
  }, [excelMode, getCellValue]);

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
      updateCellValue(editingCell.row, editingCell.col, editValue);
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
          setEditingCell(activeCell);
          setEditValue(getCellValue(activeCell.row, activeCell.col));
          return;
        }
        break;
      case 'F2':
        // F2 to edit cell
        e.preventDefault();
        setEditingCell(activeCell);
        setEditValue(getCellValue(activeCell.row, activeCell.col));
        return;
      case 'Delete':
      case 'Backspace':
        // Clear selected cells
        e.preventDefault();
        selectedCells.forEach(cell => {
          updateCellValue(cell.row, cell.col, '');
        });
        return;
      default:
        // Start editing on any printable character
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          setEditingCell(activeCell);
          setEditValue(e.key);
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
  }, [excelMode, selectedTable, editingCell, activeCell, selectedCells, commitEdit, getCellValue, getCellRange, updateCellValue]);

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

      // Parse TSV/CSV (handle both tab and comma separators)
      const lines = text.split(/\r?\n/).filter(line => line.length > 0);
      const clipboardRows = lines.map(line => {
        // Prefer tab-separated (Excel default) but fall back to comma
        if (line.includes('\t')) {
          return line.split('\t');
        }
        return line.split(',');
      });

      const clipboardRowCount = clipboardRows.length;
      const clipboardColCount = Math.max(...clipboardRows.map(r => r.length));
      const isSingleValue = clipboardRowCount === 1 && clipboardColCount === 1;
      const singleValue = isSingleValue ? clipboardRows[0][0].trim() : '';

      const tableMaxRow = selectedTable.columns.length - 1;
      const tableMaxCol = COLUMN_COUNT - 1;

      // Case 1: Multiple cells selected - paste to all selected cells
      if (selectedCells.length > 1) {
        if (isSingleValue) {
          // Single value clipboard: paste same value to all selected cells
          selectedCells.forEach(cell => {
            if (cell.row <= tableMaxRow && cell.col <= tableMaxCol) {
              updateCellValue(cell.row, cell.col, singleValue);
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
                updateCellValue(row, col, value.trim());
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

            updateCellValue(targetRow, targetCol, value.trim());
            newSelectedCells.push({ row: targetRow, col: targetCol });
          });
        });

        // Select all pasted cells
        if (newSelectedCells.length > 0) {
          setSelectedCells(newSelectedCells);
        }
      }
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  }, [selectedTable, activeCell, selectedCells, updateCellValue, isCellSelected]);

  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingCell]);

  // Clear selection when switching tables or modes
  useEffect(() => {
    setSelectedCells([]);
    setActiveCell(null);
    setEditingCell(null);
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

  // Get cell style based on selection state
  const getCellStyle = useCallback((row: number, col: number): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      cursor: excelMode ? 'cell' : 'default',
      userSelect: excelMode ? 'none' : 'auto',
      position: 'relative',
      padding: '6px 8px',
      wordBreak: 'break-word',
      overflowWrap: 'break-word',
      whiteSpace: 'normal',
    };

    if (!excelMode) return baseStyle;

    if (isCellActive(row, col)) {
      return {
        ...baseStyle,
        outline: '2px solid #2563eb',
        outlineOffset: '-2px',
        backgroundColor: isDarkTheme ? '#1e3a5f' : '#dbeafe',
      };
    }

    if (isCellSelected(row, col)) {
      return {
        ...baseStyle,
        backgroundColor: isDarkTheme ? '#1e3a5f80' : '#bfdbfe',
      };
    }

    return baseStyle;
  }, [excelMode, isCellActive, isCellSelected, isDarkTheme]);

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

  if (!selectedTable) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '16px' }}>Data Dictionary</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
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
            Choose a table from the sidebar to view its structure.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ height: '100%', overflow: 'auto' }}
      tabIndex={excelMode ? 0 : undefined}
      onKeyDown={excelMode ? handleKeyDown : undefined}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '16px' }}>Data Dictionary</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${excelMode ? 'btn-success' : ''}`}
            onClick={toggleExcelMode}
            title={excelMode ? 'Switch to normal view' : 'Switch to Excel-like edit mode (multi-select, copy/paste)'}
          >
            {excelMode ? <TableIcon size={16} /> : <Grid3X3 size={16} />}
            {excelMode ? 'Normal Mode' : 'Excel Mode'}
          </button>
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
          Drag to select range • Arrow keys to navigate • Enter/F2 to edit • Tab to move right •
          Ctrl+C to copy • Ctrl+V to paste • Delete to clear
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
      <h3 style={{ fontSize: '14px', color: '#2c3e50', marginBottom: '12px', borderBottom: '2px solid #eee', paddingBottom: '8px' }}>
        Column Details {excelMode && `(${selectedCells.length} cell${selectedCells.length !== 1 ? 's' : ''} selected)`}
      </h3>

      {/* Single table with optional Excel mode selection overlay */}
      <table
        ref={tableRef}
        className={`data-table ${excelMode ? 'excel-mode' : ''}`}
        style={{ tableLayout: 'fixed', width: '100%' }}
      >
        <thead>
          <tr>
            <th style={{ width: '14%' }}>Column</th>
            <th style={{ width: '12%' }}>Type</th>
            <th style={{ width: '7%' }}>Nullable</th>
            <th style={{ width: '9%' }}>Default</th>
            <th style={{ width: '18%' }}>Explanation</th>
            <th style={{ width: '18%' }}>Mapping Logic</th>
            <th style={{ width: '22%' }}>Mapped To</th>
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

                {/* Type */}
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

                {/* Nullable */}
                <td
                  {...excelCellProps(2)}
                  style={{
                    ...getSelectionStyle(2),
                    ...(excelMode ? { cursor: 'cell', userSelect: 'none' } : {}),
                  }}
                >
                  {col.nullable?.toUpperCase() === 'YES' || col.nullable?.toUpperCase() === 'Y' ? 'NULL' : 'NOT NULL'}
                </td>

                {/* Default */}
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

                {/* Explanation */}
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

                {/* Mapping Logic */}
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

                {/* Mapped To (read-only, not selectable in Excel mode for editing but viewable) */}
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
