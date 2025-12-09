import { Table, Column, TableDiff, ColumnDiff, DiffStatus } from '../types';

// ============================================
// Type Comparison Utilities
// ============================================

function normalizeTypeForCompare(t: string): string {
  let type = t.trim().toUpperCase().replace(/\s+/g, '');

  // PostgreSQL normalizations
  if (type.startsWith('BPCHAR')) type = type.replace('BPCHAR', 'CHAR');
  if (type.startsWith('INT8')) type = 'BIGINT';
  if (type.startsWith('INT4')) type = 'INTEGER';
  if (type.startsWith('INT2')) type = 'SMALLINT';
  if (type.startsWith('FLOAT8')) type = 'DOUBLEPRECISION';
  if (type.startsWith('BOOL')) type = 'BOOLEAN';

  return type;
}

interface TypeCheckResult {
  match: boolean;
  soft: boolean;
  reason?: string;
}

function checkTypes(t1: string, t2: string): TypeCheckResult {
  const n1 = normalizeTypeForCompare(t1);
  const n2 = normalizeTypeForCompare(t2);

  if (n1 === n2) return { match: true, soft: false };

  // VARCHAR / VARCHAR2 compatibility
  if ((n1.startsWith('VARCHAR') && n2.startsWith('VARCHAR')) ||
      (n1.startsWith('VARCHAR2') && n2.startsWith('VARCHAR2'))) {
    // Check if only difference is VARCHAR vs VARCHAR2
    const base1 = n1.replace(/\d+$/, '').replace(/\(.*\)/, '');
    const base2 = n2.replace(/\d+$/, '').replace(/\(.*\)/, '');
    if (base1.replace('2', '') === base2.replace('2', '')) {
      return { match: true, soft: true, reason: 'VARCHAR ≈ VARCHAR2' };
    }
  }

  // NUMERIC precision compatibility
  if (n1.startsWith('NUMERIC') && n2.startsWith('NUMERIC')) {
    const p1 = getNumericParams(n1);
    const p2 = getNumericParams(n2);
    if (p1[0] === p2[0] && p1[1] === p2[1]) {
      return { match: true, soft: true, reason: 'Scale ignored (0)' };
    }
  }

  // NUMBER (Oracle) vs NUMERIC (Postgres)
  if ((n1.startsWith('NUMBER') && n2.startsWith('NUMERIC')) ||
      (n1.startsWith('NUMERIC') && n2.startsWith('NUMBER'))) {
    return { match: true, soft: true, reason: 'NUMBER ≈ NUMERIC' };
  }

  return { match: false, soft: false };
}

function getNumericParams(typeStr: string): [number, number] {
  const match = typeStr.match(/\(([0-9,]+)\)/);
  if (!match) return [0, 0];

  const parts = match[1].split(',');
  const precision = parseInt(parts[0]) || 0;
  const scale = parts.length > 1 ? parseInt(parts[1]) : 0;

  return [precision, scale];
}

// ============================================
// Compare Tables
// ============================================

export function compareTables(
  source: Record<string, Table>,
  target: Record<string, Table>
): Record<string, TableDiff> {
  const results: Record<string, TableDiff> = {};

  // Check source tables
  for (const key of Object.keys(source)) {
    const srcTable = source[key];
    const tgtTable = target[key];

    if (!tgtTable) {
      results[key] = {
        status: 'MISSING',
        src: srcTable,
        tgt: null
      };
    } else {
      const diff = compareColumns(srcTable, tgtTable);
      let status: DiffStatus = 'IDENTICAL';

      if (diff.hasHardDiff) {
        status = 'MODIFIED';
      } else if (diff.hasSoftDiff) {
        status = 'SOFT_MATCH';
      }

      results[key] = {
        status,
        src: srcTable,
        tgt: tgtTable,
        details: diff
      };
    }
  }

  // Check for added tables in target
  for (const key of Object.keys(target)) {
    if (!source[key]) {
      results[key] = {
        status: 'ADDED',
        src: null,
        tgt: target[key]
      };
    }
  }

  return results;
}

function compareColumns(src: Table, tgt: Table): {
  hasHardDiff: boolean;
  hasSoftDiff: boolean;
  pkDiff: boolean;
  changes: ColumnDiff[];
} {
  const changes: ColumnDiff[] = [];
  let hasHardDiff = false;
  let hasSoftDiff = false;

  // Compare PKs
  const srcPk = src.constraints.find(c => c.type === 'Primary Key')?.localCols || '';
  const tgtPk = tgt.constraints.find(c => c.type === 'Primary Key')?.localCols || '';
  const pkDiff = srcPk.split(',').sort().join(',') !== tgtPk.split(',').sort().join(',');
  if (pkDiff) hasHardDiff = true;

  // Build column maps
  const srcCols: Record<string, Column> = {};
  const tgtCols: Record<string, Column> = {};

  for (const col of src.columns) {
    srcCols[col.name.toUpperCase()] = col;
  }
  for (const col of tgt.columns) {
    tgtCols[col.name.toUpperCase()] = col;
  }

  // Get all column names
  const allCols = new Set([...Object.keys(srcCols), ...Object.keys(tgtCols)]);

  for (const colName of allCols) {
    const sCol = srcCols[colName];
    const tCol = tgtCols[colName];

    if (!sCol) {
      changes.push({ col: colName, type: 'ADDED', s: null, t: tCol });
      hasHardDiff = true;
    } else if (!tCol) {
      changes.push({ col: colName, type: 'DELETED', s: sCol, t: null });
      hasHardDiff = true;
    } else {
      // Compare types
      const typeCheck = checkTypes(sCol.type, tCol.type);
      const nullMatch = sCol.nullable === tCol.nullable;

      if (!nullMatch) {
        changes.push({
          col: colName,
          type: 'MODIFIED',
          s: sCol,
          t: tCol,
          note: 'Nullable changed'
        });
        hasHardDiff = true;
      } else if (typeCheck.match) {
        if (typeCheck.soft) {
          changes.push({
            col: colName,
            type: 'SOFT',
            s: sCol,
            t: tCol,
            note: typeCheck.reason
          });
          hasSoftDiff = true;
        } else {
          changes.push({
            col: colName,
            type: 'SAME',
            s: sCol,
            t: tCol
          });
        }
      } else {
        changes.push({
          col: colName,
          type: 'MODIFIED',
          s: sCol,
          t: tCol
        });
        hasHardDiff = true;
      }
    }
  }

  return { hasHardDiff, hasSoftDiff, pkDiff, changes };
}

// ============================================
// Parse Schema to Map
// ============================================

export function tablesToMap(tables: Table[]): Record<string, Table> {
  const map: Record<string, Table> = {};
  for (const table of tables) {
    const key = table.tableName.toUpperCase();
    map[key] = table;
  }
  return map;
}
