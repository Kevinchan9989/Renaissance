import { useState } from 'react';
import { Script, Table, Column } from '../types';
import { downloadJson } from '../utils/storage';
import { FileDown, Edit3, Save, X } from 'lucide-react';

interface DataDictionaryProps {
  script: Script;
  selectedTableId: number | null;
  onSelectTable: (id: number | null) => void;
  onUpdateTable: (tableId: number, updates: Partial<Table>) => void;
  onUpdateScript: (rawContent: string) => void;
}

export default function DataDictionary({
  script,
  selectedTableId,
  onSelectTable: _onSelectTable,
  onUpdateTable,
  onUpdateScript
}: DataDictionaryProps) {
  // _onSelectTable is available for future use (e.g., clicking related tables)
  void _onSelectTable;
  const [editMode, setEditMode] = useState(false);
  const [editContent, setEditContent] = useState('');

  const selectedTable = script.data.targets.find(t => t.id === selectedTableId);

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

    onUpdateTable(selectedTable.id, { columns: updatedColumns });
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
        <textarea
          className="editor-textarea"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          style={{ flex: 1 }}
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
              onBlur={(e) => onUpdateTable(selectedTable.id, { description: e.currentTarget.textContent || '' })}
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
                  <td>
                    <span className={`key-tag ${c.type === 'Primary Key' ? 'pk-tag' : c.type === 'Foreign Key' ? 'fk-tag' : 'uq-tag'}`}>
                      {c.type}
                    </span>
                  </td>
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
      <table className="data-table">
        <thead>
          <tr>
            <th>Column</th>
            <th>Type</th>
            <th>Nullable</th>
            <th>Default</th>
            <th>Explanation</th>
            <th>Mapping</th>
          </tr>
        </thead>
        <tbody>
          {selectedTable.columns.map((col, i) => {
            const tags = getColumnTags(selectedTable, col.name);

            return (
              <tr key={i}>
                <td className="code-cell">
                  {col.name}
                  {tags.map(tag => (
                    <span
                      key={tag}
                      className={`key-tag ${tag === 'PK' ? 'pk-tag' : tag === 'FK' ? 'fk-tag' : 'uq-tag'}`}
                    >
                      {tag}
                    </span>
                  ))}
                </td>
                <td className="code-cell">{col.type}</td>
                <td>{col.nullable}</td>
                <td className="code-cell">{col.default || '-'}</td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateColumnField(col.name, 'explanation', e.currentTarget.textContent || '')}
                  style={{ cursor: 'text', minWidth: '150px' }}
                >
                  {col.explanation || ''}
                </td>
                <td
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateColumnField(col.name, 'mapping', e.currentTarget.textContent || '')}
                  style={{ cursor: 'text', color: '#3498db', minWidth: '150px' }}
                >
                  {col.mapping || ''}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
