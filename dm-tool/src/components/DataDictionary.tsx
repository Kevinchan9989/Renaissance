import { useState } from 'react';
import { Script, Table, Column } from '../types';
import { downloadJson, loadMappingProjects } from '../utils/storage';
import CodeEditor from './CodeEditor';
import { FileDown, Edit3, Save, X } from 'lucide-react';

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
    <div style={{ height: '100%', overflow: 'auto' }}>
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
        Column Details
      </h3>
      <table className="data-table" style={{ tableLayout: 'fixed', width: '100%' }}>
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
          {selectedTable.columns.map((col, i) => {
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

            return (
              <tr key={i}>
                <td className="code-cell" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}>
                  {col.name}{tags.length > 0 ? ` (${tags.join(', ')})` : ''}
                </td>
                <td className="code-cell" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}>{col.type}</td>
                <td>{col.nullable?.toUpperCase() === 'YES' || col.nullable?.toUpperCase() === 'Y' ? 'NULL' : 'NOT NULL'}</td>
                <td className="code-cell" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}>{col.default || '-'}</td>
                <td>
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
                      // Clear placeholder on focus
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
                </td>
                <td>
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
                      // Clear placeholder on focus
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
                </td>
                <td>
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
