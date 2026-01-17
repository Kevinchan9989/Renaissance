import { ColumnMapping, DatatypeMapping, Script, Table, Column } from '../types';

// Default datatype mappings from Oracle to PostgreSQL
export const DEFAULT_ORACLE_TO_POSTGRES_MAPPINGS: DatatypeMapping[] = [
  { sourcePattern: '^VARCHAR2\\(', targetType: 'VARCHAR' },
  { sourcePattern: '^NUMBER\\(\\d+,0\\)$', targetType: 'INTEGER' },
  { sourcePattern: '^NUMBER\\(\\d+,\\d+\\)$', targetType: 'DECIMAL' },
  { sourcePattern: '^NUMBER$', targetType: 'NUMERIC' },
  { sourcePattern: '^DATE$', targetType: 'TIMESTAMP' },
  { sourcePattern: '^TIMESTAMP', targetType: 'TIMESTAMP' },
  { sourcePattern: '^CLOB$', targetType: 'TEXT' },
  { sourcePattern: '^BLOB$', targetType: 'BYTEA' },
  { sourcePattern: '^RAW\\(', targetType: 'BYTEA' },
  { sourcePattern: '^CHAR\\(', targetType: 'CHAR' },
  { sourcePattern: '^NVARCHAR2\\(', targetType: 'VARCHAR' },
  { sourcePattern: '^NCHAR\\(', targetType: 'CHAR' },
];

// Default datatype mappings from PostgreSQL to Oracle
export const DEFAULT_POSTGRES_TO_ORACLE_MAPPINGS: DatatypeMapping[] = [
  { sourcePattern: '^VARCHAR\\(', targetType: 'VARCHAR2' },
  { sourcePattern: '^TEXT$', targetType: 'CLOB' },
  { sourcePattern: '^INTEGER$', targetType: 'NUMBER' },
  { sourcePattern: '^BIGINT$', targetType: 'NUMBER' },
  { sourcePattern: '^SMALLINT$', targetType: 'NUMBER' },
  { sourcePattern: '^DECIMAL\\(', targetType: 'NUMBER' },
  { sourcePattern: '^NUMERIC\\(', targetType: 'NUMBER' },
  { sourcePattern: '^TIMESTAMP', targetType: 'TIMESTAMP' },
  { sourcePattern: '^DATE$', targetType: 'DATE' },
  { sourcePattern: '^BYTEA$', targetType: 'BLOB' },
  { sourcePattern: '^CHAR\\(', targetType: 'CHAR' },
  { sourcePattern: '^BOOLEAN$', targetType: 'NUMBER(1,0)' },
];

/**
 * Get default datatype mappings based on source and target script types
 */
export function getDefaultDatatypeMappings(
  sourceType: string,
  targetType: string
): DatatypeMapping[] {
  const key = `${sourceType}-${targetType}`;

  switch (key) {
    case 'oracle-postgresql':
      return DEFAULT_ORACLE_TO_POSTGRES_MAPPINGS;
    case 'postgresql-oracle':
      return DEFAULT_POSTGRES_TO_ORACLE_MAPPINGS;
    default:
      return [];
  }
}

/**
 * Extract size/precision from a datatype string
 * E.g., "VARCHAR(100)" -> "100", "NUMERIC(10,2)" -> "10,2"
 */
function extractSize(type: string): string | null {
  const sizeMatch = type.match(/\(([^)]+)\)/);
  return sizeMatch ? sizeMatch[1] : null;
}

/**
 * Get base type without size
 * E.g., "VARCHAR(100)" -> "VARCHAR", "NUMERIC(10,2)" -> "NUMERIC"
 */
function getBaseType(type: string): string {
  return type.replace(/\s*\([^)]*\)\s*/, '').trim().toUpperCase();
}

/**
 * Adjust datatype size to match reference
 * Keeps the existing base type, only adjusts size/precision
 */
export function adjustDatatypeSize(
  currentType: string,
  referenceType: string
): string {
  const currentBase = getBaseType(currentType);
  const referenceSize = extractSize(referenceType);

  // If reference has size, apply it to current base type
  if (referenceSize) {
    return `${currentBase}(${referenceSize})`;
  }

  // No size adjustment needed
  return currentBase;
}

/**
 * Generate SQL ALTER TABLE statements to align schemas
 */
export function generateAlignmentSql(
  mappings: ColumnMapping[],
  sourceScript: Script,
  targetScript: Script,
  direction: 'toSource' | 'toTarget',
  includeNullable: boolean,
  includeDatatype: boolean,
  datatypeMappings: DatatypeMapping[]
): string {
  const sqlStatements: string[] = [];

  // Determine which schema to modify
  const modifyScript = direction === 'toSource' ? targetScript : sourceScript;
  const referenceScript = direction === 'toSource' ? sourceScript : targetScript;

  // Group mappings by table being modified
  const mappingsByTable = new Map<string, ColumnMapping[]>();

  mappings.forEach(mapping => {
    const tableToModify = direction === 'toSource' ? mapping.targetTable : mapping.sourceTable;
    if (!mappingsByTable.has(tableToModify)) {
      mappingsByTable.set(tableToModify, []);
    }
    mappingsByTable.get(tableToModify)!.push(mapping);
  });

  // Generate ALTER TABLE statements for each table
  mappingsByTable.forEach((tableMappings, tableName) => {
    const alterStatements: string[] = [];

    tableMappings.forEach(mapping => {
      const modifyColumn = direction === 'toSource'
        ? { name: mapping.targetColumn, type: mapping.targetType, table: mapping.targetTable }
        : { name: mapping.sourceColumn, type: mapping.sourceType, table: mapping.sourceTable };

      const referenceColumn = direction === 'toSource'
        ? { name: mapping.sourceColumn, type: mapping.sourceType, table: mapping.sourceTable }
        : { name: mapping.targetColumn, type: mapping.targetType, table: mapping.targetTable };

      // Get full column details from scripts
      const modifyTable = modifyScript.data.targets.find(t => t.tableName === modifyColumn.table);
      const referenceTable = referenceScript.data.targets.find(t => t.tableName === referenceColumn.table);

      if (!modifyTable || !referenceTable) return;

      const modifyColDetails = modifyTable.columns.find(c => c.name === modifyColumn.name);
      const referenceColDetails = referenceTable.columns.find(c => c.name === referenceColumn.name);

      if (!modifyColDetails || !referenceColDetails) return;

      // Adjust datatype size to match reference (keep base type, adjust size only)
      const adjustedDatatype = adjustDatatypeSize(modifyColDetails.type, referenceColDetails.type);

      // Check nullable
      const modifyNullable = modifyColDetails.nullable.toUpperCase() === 'YES' || modifyColDetails.nullable.toUpperCase() === 'Y';
      const referenceNullable = referenceColDetails.nullable.toUpperCase() === 'YES' || referenceColDetails.nullable.toUpperCase() === 'Y';

      // Build parts for single ALTER statement
      const parts: string[] = [];

      // Add datatype change if different
      if (includeDatatype && modifyColDetails.type.toUpperCase() !== adjustedDatatype.toUpperCase()) {
        parts.push(adjustedDatatype);
      }

      // Add nullable change if different
      if (includeNullable && modifyNullable !== referenceNullable) {
        if (referenceNullable) {
          parts.push('NULL');
        } else {
          parts.push('NOT NULL');
        }
      }

      // Generate single-line ALTER statement if there are changes
      if (parts.length > 0) {
        // Get schema for the table
        const schema = modifyTable.schema || 'public';
        const qualifiedTableName = `${schema}.${tableName}`;

        if (modifyScript.type === 'postgresql') {
          // PostgreSQL: ALTER TABLE schema.table_name ALTER COLUMN col_name TYPE type, ALTER COLUMN col_name SET/DROP NOT NULL;
          const statements: string[] = [];
          if (includeDatatype && modifyColDetails.type.toUpperCase() !== adjustedDatatype.toUpperCase()) {
            statements.push(`ALTER TABLE ${qualifiedTableName} ALTER COLUMN ${modifyColumn.name} TYPE ${adjustedDatatype};`);
          }
          if (includeNullable && modifyNullable !== referenceNullable) {
            if (referenceNullable) {
              statements.push(`ALTER TABLE ${qualifiedTableName} ALTER COLUMN ${modifyColumn.name} DROP NOT NULL;`);
            } else {
              statements.push(`ALTER TABLE ${qualifiedTableName} ALTER COLUMN ${modifyColumn.name} SET NOT NULL;`);
            }
          }
          sqlStatements.push(...statements);
        } else if (modifyScript.type === 'oracle') {
          // Oracle: ALTER TABLE schema.table_name MODIFY col_name type NULL/NOT NULL;
          sqlStatements.push(`ALTER TABLE ${qualifiedTableName} MODIFY ${modifyColumn.name} ${parts.join(' ')};`);
        }
      }
    });
  });

  if (sqlStatements.length === 0) {
    return '-- No alignment changes needed';
  }

  const header = `-- SQL Alignment Script
-- Direction: Align ${direction === 'toSource' ? 'target to source' : 'source to target'}
-- Modifying: ${modifyScript.name}
-- Reference: ${referenceScript.name}
-- Generated: ${new Date().toISOString()}
-- Options: ${includeNullable ? 'Nullable' : ''} ${includeDatatype ? 'Datatype' : ''}

`;

  return header + sqlStatements.join('\n');
}
