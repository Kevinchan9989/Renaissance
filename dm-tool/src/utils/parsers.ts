import { Table, ScriptData, ScriptType } from '../types';

// ============================================
// Shared Utilities
// ============================================

function cleanName(str: string): string {
  return str ? str.replace(/["`\[\]]/g, '').trim() : '';
}

function splitSqlParams(txt: string): string[] {
  const result: string[] = [];
  let buffer = '';
  let depth = 0;

  for (let i = 0; i < txt.length; i++) {
    const char = txt[i];
    if (char === '(') depth++;
    else if (char === ')') depth--;

    if (char === ',' && depth === 0) {
      result.push(buffer);
      buffer = '';
    } else {
      buffer += char;
    }
  }

  if (buffer.trim()) result.push(buffer);
  return result;
}

function normalizeType(t: string): string {
  let type = t.trim().toUpperCase().replace(/\s+/g, '');

  // PostgreSQL normalizations
  if (type.startsWith('BPCHAR')) type = type.replace('BPCHAR', 'CHAR');
  if (type.startsWith('INT8')) type = 'BIGINT';
  if (type.startsWith('INT4')) type = 'INTEGER';
  if (type.startsWith('FLOAT8')) type = 'DOUBLE PRECISION';
  if (type.startsWith('INT2')) type = 'SMALLINT';
  if (type.startsWith('BOOL')) type = 'BOOLEAN';

  return type;
}

// ============================================
// PostgreSQL Parser
// ============================================

export function parsePostgreSQL(sql: string): ScriptData {
  console.log('🚀 PARSER: parsePostgreSQL CALLED! SQL length:', sql.length);

  const tables: Table[] = [];
  const tablesMap: Record<string, Table> = {};

  // Clean comments
  const cleanSql = sql
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  console.log('🚀 PARSER: After cleaning, length:', cleanSql.length);

  // Parse CREATE TABLE
  const createRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s*\(([\s\S]*?)\)\s*;/gi;
  let match: RegExpExecArray | null;
  let idCounter = 1;

  console.log('🔍 PARSER: Starting PostgreSQL parsing...');

  while ((match = createRegex.exec(cleanSql)) !== null) {
    const schema = match[1] || 'public';
    const tableName = match[2];
    const body = match[3];

    const tableObj: Table = {
      id: idCounter++,
      schema,
      tableName,
      description: '',
      constraints: [],
      columns: []
    };

    const lines = splitSqlParams(body);
    const pkCols = new Set<string>();
    const uniqueCols = new Set<string>();

    // Debug log for specific tables
    const debugTables = ['iss_sec_params', 'iss_calendar_params', 'iss_announcement_allotment_params'];
    if (debugTables.includes(tableName.toLowerCase())) {
      console.log(`\n🔍 PARSER: Processing table ${schema}.${tableName}`);
      console.log(`  Body length: ${body.length} chars`);
      console.log(`  Split into ${lines.length} lines`);
      lines.forEach((line, idx) => {
        const preview = line.trim().substring(0, 80);
        const fullLine = line.trim();
        console.log(`  Line ${idx}: ${preview}${line.trim().length > 80 ? '...' : ''}`);

        // Check if this line contains FK
        if (fullLine.toUpperCase().includes('FOREIGN KEY')) {
          console.log(`    ⚠️ FK DETECTED on line ${idx}! Full length: ${fullLine.length}`);
          console.log(`    Full content: "${fullLine}"`);
        }
      });
    }

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      const upperLine = trimmedLine.toUpperCase();

      // Inline constraint: PRIMARY KEY
      if (upperLine.includes('PRIMARY KEY') && (upperLine.startsWith('CONSTRAINT') || upperLine.startsWith('PRIMARY KEY'))) {
        const pkMatch = trimmedLine.match(/(?:CONSTRAINT\s+(\w+)\s+)?PRIMARY\s+KEY\s*\(([^)]+)\)/i);
        if (pkMatch) {
          const cols = pkMatch[2].split(',').map(c => cleanName(c)).join(', ');
          tableObj.constraints.push({
            name: pkMatch[1] || `pk_${tableName}`,
            type: 'Primary Key',
            localCols: cols
          });
          pkMatch[2].split(',').forEach(c => pkCols.add(cleanName(c)));
        }
        continue;
      }

      // Inline constraint: UNIQUE
      if (upperLine.includes('UNIQUE') && (upperLine.startsWith('CONSTRAINT') || upperLine.startsWith('UNIQUE'))) {
        const uqMatch = trimmedLine.match(/(?:CONSTRAINT\s+(\w+)\s+)?UNIQUE\s*\(([^)]+)\)/i);
        if (uqMatch) {
          const cols = uqMatch[2].split(',').map(c => cleanName(c)).join(', ');
          tableObj.constraints.push({
            name: uqMatch[1] || `uq_${tableName}`,
            type: 'Unique',
            localCols: cols
          });
          uqMatch[2].split(',').forEach(c => uniqueCols.add(cleanName(c)));
        }
        continue;
      }

      // Inline constraint: FOREIGN KEY
      if (upperLine.includes('FOREIGN KEY') && (upperLine.startsWith('CONSTRAINT') || upperLine.startsWith('FOREIGN'))) {
        console.log(`🔍 PARSER: Found FK line in ${schema}.${tableName}`);
        console.log(`  Full line (${trimmedLine.length} chars):`, trimmedLine);
        const fkMatch = trimmedLine.match(/(?:CONSTRAINT\s+(\w+)\s+)?FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s*\(([^)]+)\)/i);
        if (fkMatch) {
          const constraintName = fkMatch[1] || `fk_${tableName}`;
          const localCols = fkMatch[2].split(',').map(c => cleanName(c)).join(', ');
          const refSchema = fkMatch[3] || 'public';
          const refTable = fkMatch[4];
          const refCols = fkMatch[5].split(',').map(c => cleanName(c)).join(', ');

          console.log(`✅ PARSER: FK matched! ${constraintName} → ${refSchema}.${refTable}(${refCols})`);
          tableObj.constraints.push({
            name: constraintName,
            type: 'Foreign Key',
            localCols,
            ref: `${refSchema}.${refTable}(${refCols})`
          });
        } else {
          console.log(`❌ PARSER: FK regex did NOT match in ${schema}.${tableName}`);
        }
        continue;
      }

      // Column definition
      const colMatch = trimmedLine.match(/^["`]?(\w+)["`]?\s+(.+)$/);
      if (colMatch && !upperLine.startsWith('CONSTRAINT') && !upperLine.startsWith('PRIMARY') && !upperLine.startsWith('FOREIGN') && !upperLine.startsWith('UNIQUE') && !upperLine.startsWith('CHECK')) {
        const name = colMatch[1];
        let rest = colMatch[2];
        let type = '';

        // Extract type (may include parentheses with precision/scale)
        // Match patterns like: VARCHAR(100), NUMERIC(10,2), NUMERIC(13), INTEGER, etc.
        const typeMatch = rest.match(/^([A-Za-z_]\w*)\s*(\([^)]*\))?(.*)$/);
        if (typeMatch) {
          type = typeMatch[1] + (typeMatch[2] || '');
          rest = typeMatch[3] || '';
        } else {
          // Fallback: take first word as type
          const parts = rest.split(/\s+/);
          type = parts[0];
          rest = parts.slice(1).join(' ');
        }

        const nullable = rest.toUpperCase().includes('NOT NULL') ? 'No' : 'Yes';

        let defaultVal: string | null = null;
        if (rest.toUpperCase().includes('GENERATED')) {
          defaultVal = 'IDENTITY';
        } else {
          const defMatch = rest.match(/DEFAULT\s+([^,]+)/i);
          if (defMatch) {
            defaultVal = defMatch[1].trim().replace(/::\w+/g, '').replace(/'/g, '');
          }
        }

        // Check for inline PRIMARY KEY
        if (rest.toUpperCase().includes('PRIMARY KEY')) {
          pkCols.add(name);
        }

        const normalizedType = normalizeType(type);

        tableObj.columns.push({
          name,
          type: normalizedType,
          nullable,
          default: defaultVal,
          explanation: '',
          mapping: ''
        });
      }
    }

    // Add PK constraint if found inline
    if (pkCols.size > 0 && !tableObj.constraints.some(c => c.type === 'Primary Key')) {
      tableObj.constraints.push({
        name: `pk_${tableName}`,
        type: 'Primary Key',
        localCols: Array.from(pkCols).join(', ')
      });
    }

    tables.push(tableObj);
    tablesMap[`${schema}.${tableName}`] = tableObj;
  }

  // Parse ALTER TABLE for Foreign Keys
  const alterRegex = /ALTER\s+TABLE\s+(?:ONLY\s+)?(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s+ADD\s+CONSTRAINT\s+(\w+)\s+FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s*\(([^)]+)\)/gi;

  while ((match = alterRegex.exec(cleanSql)) !== null) {
    const tSchema = match[1] || 'public';
    const tName = match[2];
    const cName = match[3];
    const localCols = match[4].split(',').map(c => cleanName(c)).join(', ');
    const refSchema = match[5] || 'public';
    const refTable = match[6];
    const refCols = match[7].split(',').map(c => cleanName(c)).join(', ');

    const targetObj = tablesMap[`${tSchema}.${tName}`];
    if (targetObj) {
      targetObj.constraints.push({
        name: cName,
        type: 'Foreign Key',
        localCols,
        ref: `${refSchema}.${refTable}(${refCols})`
      });
    }
  }

  // Parse ALTER TABLE for Primary Keys
  const alterPkRegex = /ALTER\s+TABLE\s+(?:ONLY\s+)?(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s+ADD\s+CONSTRAINT\s+(\w+)\s+PRIMARY\s+KEY\s*\(([^)]+)\)/gi;

  while ((match = alterPkRegex.exec(cleanSql)) !== null) {
    const tSchema = match[1] || 'public';
    const tName = match[2];
    const cName = match[3];
    const localCols = match[4].split(',').map(c => cleanName(c)).join(', ');

    const targetObj = tablesMap[`${tSchema}.${tName}`];
    if (targetObj && !targetObj.constraints.some(c => c.type === 'Primary Key')) {
      targetObj.constraints.push({
        name: cName,
        type: 'Primary Key',
        localCols
      });
    }
  }

  return { targets: tables, sources: [] };
}

// ============================================
// Oracle SQL Parser
// ============================================

export function parseOracleSQL(sql: string): ScriptData {
  const tables: Table[] = [];
  const tablesMap: Record<string, Table> = {};

  // Clean comments
  const cleanSql = sql
    .replace(/--.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');

  // Parse CREATE TABLE - using manual parentheses matching to handle nested STORAGE(...)
  // This approach finds the matching closing paren for the column list, then ignores everything after
  const createRegex = /CREATE\s+TABLE\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s*\(/gi;
  let match: RegExpExecArray | null;
  let idCounter = 1;

  while ((match = createRegex.exec(cleanSql)) !== null) {
    const schema = match[1] || 'SYSTEM';
    const tableName = match[2];

    // Find the matching closing parenthesis for the column list
    // Start after the opening paren
    const startPos = match.index + match[0].length;
    let depth = 1;
    let endPos = startPos;

    while (depth > 0 && endPos < cleanSql.length) {
      if (cleanSql[endPos] === '(') depth++;
      else if (cleanSql[endPos] === ')') depth--;
      endPos++;
    }

    const body = cleanSql.substring(startPos, endPos - 1);

    const tableObj: Table = {
      id: idCounter++,
      schema,
      tableName,
      description: '',
      constraints: [],
      columns: []
    };

    const lines = splitSqlParams(body);
    const pkCols = new Set<string>();

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      const upperLine = trimmedLine.toUpperCase();

      // Skip constraint definitions for now (handle later)
      if (upperLine.startsWith('CONSTRAINT') || upperLine.startsWith('PRIMARY') ||
          upperLine.startsWith('FOREIGN') || upperLine.startsWith('UNIQUE') ||
          upperLine.startsWith('CHECK')) {

        // Inline PRIMARY KEY
        const pkMatch = trimmedLine.match(/(?:CONSTRAINT\s+(\w+)\s+)?PRIMARY\s+KEY\s*\(([^)]+)\)/i);
        if (pkMatch) {
          const cols = pkMatch[2].split(',').map(c => cleanName(c)).join(', ');
          tableObj.constraints.push({
            name: pkMatch[1] || `pk_${tableName}`,
            type: 'Primary Key',
            localCols: cols
          });
          pkMatch[2].split(',').forEach(c => pkCols.add(cleanName(c)));
        }

        // Inline UNIQUE
        const uqMatch = trimmedLine.match(/(?:CONSTRAINT\s+(\w+)\s+)?UNIQUE\s*\(([^)]+)\)/i);
        if (uqMatch) {
          const cols = uqMatch[2].split(',').map(c => cleanName(c)).join(', ');
          tableObj.constraints.push({
            name: uqMatch[1] || `uq_${tableName}`,
            type: 'Unique',
            localCols: cols
          });
        }
        continue;
      }

      // Column definition
      // Oracle format: column_name DATA_TYPE(precision, scale) [BYTE|CHAR] [DEFAULT value] [NOT NULL]
      const colMatch = trimmedLine.match(/^["`]?(\w+)["`]?\s+(\w+)(.*)$/);
      if (colMatch) {
        const name = colMatch[1];
        let type = colMatch[2];
        let rest = colMatch[3] || '';

        // Handle types with arguments: NUMBER(10,2), VARCHAR2(100 BYTE), CHAR(8 BYTE), etc.
        if (rest.trim().startsWith('(')) {
          const parenMatch = rest.match(/^\s*\(([^)]+)\)/);
          if (parenMatch) {
            // Extract the content inside parentheses and clean it
            let typeArgs = parenMatch[1].trim();

            // Remove BYTE/CHAR qualifiers (Oracle-specific)
            typeArgs = typeArgs.replace(/\s+BYTE\s*$/i, '').replace(/\s+CHAR\s*$/i, '');

            type += `(${typeArgs})`;
            rest = rest.substring(rest.indexOf(')') + 1);
          }
        }

        // Oracle type mappings
        type = normalizeOracleType(type);

        const nullable = rest.toUpperCase().includes('NOT NULL') ? 'No' : 'Yes';

        let defaultVal: string | null = null;
        const defMatch = rest.match(/DEFAULT\s+([^,\s]+(?:\s*\([^)]*\))?)/i);
        if (defMatch) {
          defaultVal = defMatch[1].trim().replace(/'/g, '');
        }

        // Check for inline PRIMARY KEY
        if (rest.toUpperCase().includes('PRIMARY KEY')) {
          pkCols.add(name);
        }

        tableObj.columns.push({
          name,
          type,
          nullable,
          default: defaultVal,
          explanation: '',
          mapping: ''
        });
      }
    }

    // Add PK constraint if found inline
    if (pkCols.size > 0 && !tableObj.constraints.some(c => c.type === 'Primary Key')) {
      tableObj.constraints.push({
        name: `pk_${tableName}`,
        type: 'Primary Key',
        localCols: Array.from(pkCols).join(', ')
      });
    }

    tables.push(tableObj);
    tablesMap[`${schema}.${tableName}`] = tableObj;
  }

  // Parse ALTER TABLE for constraints (with optional Oracle clauses)
  const alterFkRegex = /ALTER\s+TABLE\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s+ADD\s+(?:CONSTRAINT\s+["`]?(\w+)["`]?\s+)?FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s*\(([^)]+)\)(?:\s+(?:ENABLE|DISABLE|NOT\s+DEFERRABLE|DEFERRABLE|INITIALLY\s+(?:IMMEDIATE|DEFERRED)|VALIDATE|NOVALIDATE|ON\s+DELETE\s+(?:CASCADE|SET\s+NULL)))*\s*;?/gi;

  while ((match = alterFkRegex.exec(cleanSql)) !== null) {
    const tSchema = match[1] || 'SYSTEM';
    const tName = match[2];
    const cName = match[3] || `fk_${tName}`;
    const localCols = match[4].split(',').map(c => cleanName(c)).join(', ');
    const refSchema = match[5] || 'SYSTEM';
    const refTable = match[6];
    const refCols = match[7].split(',').map(c => cleanName(c)).join(', ');

    const targetObj = tablesMap[`${tSchema}.${tName}`];
    if (targetObj) {
      targetObj.constraints.push({
        name: cName,
        type: 'Foreign Key',
        localCols,
        ref: `${refSchema}.${refTable}(${refCols})`
      });
    }
  }

  // Parse ALTER TABLE for Primary Keys
  const alterPkRegex = /ALTER\s+TABLE\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s+ADD\s+(?:CONSTRAINT\s+["`]?(\w+)["`]?\s+)?PRIMARY\s+KEY\s*\(([^)]+)\)/gi;

  while ((match = alterPkRegex.exec(cleanSql)) !== null) {
    const tSchema = match[1] || 'SYSTEM';
    const tName = match[2];
    const cName = match[3] || `pk_${tName}`;
    const localCols = match[4].split(',').map(c => cleanName(c)).join(', ');

    const targetObj = tablesMap[`${tSchema}.${tName}`];
    if (targetObj && !targetObj.constraints.some(c => c.type === 'Primary Key')) {
      targetObj.constraints.push({
        name: cName,
        type: 'Primary Key',
        localCols
      });
    }
  }

  // Parse ALTER TABLE for UNIQUE constraints
  const alterUqRegex = /ALTER\s+TABLE\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s+ADD\s+(?:CONSTRAINT\s+["`]?(\w+)["`]?\s+)?UNIQUE\s*\(([^)]+)\)/gi;

  while ((match = alterUqRegex.exec(cleanSql)) !== null) {
    const tSchema = match[1] || 'SYSTEM';
    const tName = match[2];
    const cName = match[3] || `uq_${tName}`;
    const localCols = match[4].split(',').map(c => cleanName(c)).join(', ');

    const targetObj = tablesMap[`${tSchema}.${tName}`];
    if (targetObj) {
      targetObj.constraints.push({
        name: cName,
        type: 'Unique',
        localCols
      });
    }
  }

  // Parse CREATE INDEX statements - handle schema-qualified index names and table names
  const createIndexRegex = /CREATE\s+(?:(UNIQUE)\s+)?INDEX\s+(?:["`]?\w+["`]?\.)?["`]?(\w+)["`]?\s+ON\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s*\(([^)]+)\)[^;]*;?/gi;

  while ((match = createIndexRegex.exec(cleanSql)) !== null) {
    const isUnique = match[1] !== undefined;
    const indexName = match[2];
    const tSchema = match[3] || 'SYSTEM';
    const tName = match[4];
    const indexCols = match[5].split(',').map(c => cleanName(c)).join(', ');

    const targetObj = tablesMap[`${tSchema}.${tName}`];
    if (targetObj && isUnique) {
      // Check if constraint with same name already exists (avoid duplicates)
      const exists = targetObj.constraints.some(c => c.name === indexName);
      if (!exists) {
        // Add unique constraint for unique indexes
        targetObj.constraints.push({
          name: indexName,
          type: 'Unique',
          localCols: indexCols
        });
      }
    }
    // Note: Regular (non-unique) indexes are not added as constraints
  }

  // Parse ALTER TABLE MODIFY for NOT NULL constraints
  const alterModifyRegex = /ALTER\s+TABLE\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s+MODIFY\s*\(\s*["`]?(\w+)["`]?\s+NOT\s+NULL(?:\s+ENABLE|\s+DISABLE)?\s*\)/gi;

  while ((match = alterModifyRegex.exec(cleanSql)) !== null) {
    const tSchema = match[1] || 'SYSTEM';
    const tName = match[2];
    const colName = match[3];

    const targetObj = tablesMap[`${tSchema}.${tName}`];
    if (targetObj) {
      // Update the column's nullable status
      const column = targetObj.columns.find(col => col.name.toUpperCase() === colName.toUpperCase());
      if (column) {
        column.nullable = 'No';
      }
    }
  }

  return { targets: tables, sources: [] };
}

function normalizeOracleType(type: string): string {
  const upperType = type.toUpperCase();

  // Oracle type mappings
  const mappings: Record<string, string> = {
    'VARCHAR2': 'VARCHAR2',
    'NVARCHAR2': 'NVARCHAR2',
    'NUMBER': 'NUMBER',
    'INTEGER': 'INTEGER',
    'FLOAT': 'FLOAT',
    'BINARY_FLOAT': 'BINARY_FLOAT',
    'BINARY_DOUBLE': 'BINARY_DOUBLE',
    'DATE': 'DATE',
    'TIMESTAMP': 'TIMESTAMP',
    'CLOB': 'CLOB',
    'NCLOB': 'NCLOB',
    'BLOB': 'BLOB',
    'RAW': 'RAW',
    'LONG': 'LONG',
    'CHAR': 'CHAR',
    'NCHAR': 'NCHAR',
    'ROWID': 'ROWID',
    'UROWID': 'UROWID',
    'XMLTYPE': 'XMLTYPE',
    'BFILE': 'BFILE',
  };

  // Extract base type (without precision)
  const baseType = upperType.replace(/\(.*\)/, '');

  return mappings[baseType] ? type.toUpperCase() : type.toUpperCase();
}

// ============================================
// DBML Parser
// ============================================

export function parseDBML(dbml: string): ScriptData {
  const tables: Table[] = [];

  // Remove comments
  const cleanDbml = dbml.replace(/\/\/.*$/gm, '');

  // Parse Table definitions
  const tableRegex = /Table\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s*(?:as\s+\w+\s*)?\{([\s\S]*?)\}/gi;
  let match: RegExpExecArray | null;
  let idCounter = 1;

  while ((match = tableRegex.exec(cleanDbml)) !== null) {
    const schema = match[1] || 'public';
    const tableName = match[2];
    const content = match[3];

    const tableObj: Table = {
      id: idCounter++,
      schema,
      tableName,
      description: '',
      constraints: [],
      columns: []
    };

    const pkCols = new Set<string>();
    const uniqueCols = new Set<string>();
    const fkCols: { col: string; ref: string }[] = [];

    const lines = content.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('Note:') || trimmedLine.startsWith('indexes')) continue;

      // Skip index blocks
      if (trimmedLine === '{' || trimmedLine === '}') continue;

      // Column definition: column_name type [settings]
      // Handle types with precision that may contain spaces like NUMERIC(20, 2)
      const colMatch = trimmedLine.match(/^["`]?(\w+)["`]?\s+(\w+(?:\([^)]*\))?)(?:\s*\[([^\]]*)\])?/);
      if (colMatch) {
        const name = colMatch[1];
        const type = normalizeType(colMatch[2].replace(/\s+/g, ''));
        const settings = colMatch[3] || '';
        const settingsLower = settings.toLowerCase();

        const nullable = settingsLower.includes('not null') ? 'No' : 'Yes';

        let defaultVal: string | null = null;
        const defMatch = settings.match(/default:\s*['"`]?([^'"`\],]+)['"`]?/i);
        if (defMatch) {
          defaultVal = defMatch[1].trim();
        }

        // Check for pk
        if (settingsLower.includes('pk') || settingsLower.includes('primary key')) {
          pkCols.add(name);
        }

        // Check for unique
        if (settingsLower.includes('unique')) {
          uniqueCols.add(name);
        }

        // Check for ref
        const refMatch = settings.match(/ref:\s*[<>-]\s*([^\],]+)/i);
        if (refMatch) {
          fkCols.push({ col: name, ref: refMatch[1].trim() });
        }

        // Check for note
        let explanation = '';
        const noteMatch = settings.match(/note:\s*['"`]([^'"`]+)['"`]/i);
        if (noteMatch) {
          explanation = noteMatch[1];
        }

        tableObj.columns.push({
          name,
          type,
          nullable,
          default: defaultVal,
          explanation,
          mapping: ''
        });
      }
    }

    // Add constraints
    if (pkCols.size > 0) {
      tableObj.constraints.push({
        name: `pk_${tableName}`,
        type: 'Primary Key',
        localCols: Array.from(pkCols).join(', ')
      });
    }

    if (uniqueCols.size > 0) {
      tableObj.constraints.push({
        name: `uq_${tableName}`,
        type: 'Unique',
        localCols: Array.from(uniqueCols).join(', ')
      });
    }

    for (const fk of fkCols) {
      tableObj.constraints.push({
        name: `fk_${tableName}_${fk.col}`,
        type: 'Foreign Key',
        localCols: fk.col,
        ref: fk.ref
      });
    }

    tables.push(tableObj);
  }

  // Parse Ref definitions (standalone references)
  const refRegex = /Ref(?:\s+\w+)?:\s*(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\.(\w+)\s*([<>-])\s*(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\.(\w+)/gi;

  while ((match = refRegex.exec(cleanDbml)) !== null) {
    const srcSchema = match[1] || 'public';
    const srcTable = match[2];
    const srcCol = match[3];
    // match[4] is refType (<, >, -) - reserved for future use
    const tgtSchema = match[5] || 'public';
    const tgtTable = match[6];
    const tgtCol = match[7];

    // Find source table and add FK
    const sourceTable = tables.find(t => t.tableName.toLowerCase() === srcTable.toLowerCase() && t.schema.toLowerCase() === srcSchema.toLowerCase());
    if (sourceTable) {
      sourceTable.constraints.push({
        name: `fk_${srcTable}_${srcCol}`,
        type: 'Foreign Key',
        localCols: srcCol,
        ref: `${tgtSchema}.${tgtTable}(${tgtCol})`
      });
    }
  }

  return { targets: tables, sources: [] };
}

// ============================================
// Auto-detect and Parse
// ============================================

export function detectScriptType(content: string): ScriptType {
  const trimmed = content.trim();

  // DBML detection
  if (/^\s*Table\s+\w+/m.test(trimmed) || /^\s*Ref\s*:/m.test(trimmed)) {
    return 'dbml';
  }

  // Oracle detection
  if (/VARCHAR2|NUMBER\s*\(|CLOB|NCLOB|BLOB|RAW\s*\(|ROWID/i.test(trimmed)) {
    return 'oracle';
  }

  // Default to PostgreSQL
  return 'postgresql';
}

export function parseScript(content: string, type: ScriptType): ScriptData {
  switch (type) {
    case 'postgresql':
      return parsePostgreSQL(content);
    case 'oracle':
      return parseOracleSQL(content);
    case 'dbml':
      return parseDBML(content);
    default:
      return { targets: [], sources: [] };
  }
}
