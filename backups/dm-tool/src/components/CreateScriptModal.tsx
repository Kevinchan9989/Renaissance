import { useState } from 'react';
import { ScriptType } from '../types';
import { detectScriptType } from '../utils/parsers';
import CodeEditor from './CodeEditor';
import { X } from 'lucide-react';

interface CreateScriptModalProps {
  onClose: () => void;
  onCreate: (name: string, type: ScriptType, content: string) => void;
  isDarkTheme?: boolean;
  darkThemeVariant?: 'slate' | 'vscode-gray';
}

export default function CreateScriptModal({ onClose, onCreate, isDarkTheme = false, darkThemeVariant = 'slate' }: CreateScriptModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<ScriptType>('postgresql');
  const [content, setContent] = useState('');
  const [autoDetect, setAutoDetect] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; content?: string }>({});

  const handleContentChange = (value: string) => {
    setContent(value);
    // Clear content error when user starts typing
    if (errors.content && value.trim()) {
      setErrors(prev => ({ ...prev, content: undefined }));
    }
    if (autoDetect && value.trim()) {
      const detected = detectScriptType(value);
      setType(detected);
    }
  };

  const handleNameChange = (value: string) => {
    setName(value);
    // Clear name error when user starts typing
    if (errors.name && value.trim()) {
      setErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handleSubmit = () => {
    const newErrors: { name?: string; content?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Script name is required';
    }
    if (!content.trim()) {
      newErrors.content = 'Script content is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onCreate(name.trim(), type, content);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ minWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="modal-title" style={{ margin: 0 }}>Create New Script</h2>
          <button className="btn" onClick={onClose} style={{ padding: '4px 8px' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Script Name</label>
            <input
              type="text"
              className={`form-input ${errors.name ? 'form-input-error' : ''}`}
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., OMEGA Production Schema"
            />
            {errors.name && <span className="form-error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Script Type</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select
                className="form-select"
                value={type}
                onChange={(e) => {
                  setType(e.target.value as ScriptType);
                  setAutoDetect(false);
                }}
                style={{ flex: 1 }}
              >
                <option value="postgresql">PostgreSQL</option>
                <option value="oracle">Oracle SQL</option>
                <option value="dbml">DBML</option>
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#666' }}>
                <input
                  type="checkbox"
                  checked={autoDetect}
                  onChange={(e) => setAutoDetect(e.target.checked)}
                />
                Auto-detect
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">DDL / DBML Content</label>
            <div className={errors.content ? 'code-editor-error-wrapper' : ''}>
              <CodeEditor
                value={content}
                onChange={handleContentChange}
                language={type}
                isDarkTheme={isDarkTheme}
                darkThemeVariant={darkThemeVariant}
                placeholder={getPlaceholder(type)}
                minHeight="250px"
              />
            </div>
            {errors.content && <span className="form-error-message">{errors.content}</span>}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-success" onClick={handleSubmit}>Create Script</button>
        </div>
      </div>
    </div>
  );
}

function getPlaceholder(type: ScriptType): string {
  switch (type) {
    case 'postgresql':
      return `-- PostgreSQL DDL
CREATE TABLE schema.table_name (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);`;
    case 'oracle':
      return `-- Oracle SQL DDL
CREATE TABLE schema.table_name (
    id NUMBER(10) PRIMARY KEY,
    name VARCHAR2(100) NOT NULL,
    created_at DATE DEFAULT SYSDATE
);`;
    case 'dbml':
      return `// DBML Schema
Table schema.table_name {
    id int [pk, increment]
    name varchar(100) [not null]
    created_at timestamp [default: \`now()\`]
}`;
    default:
      return '';
  }
}
