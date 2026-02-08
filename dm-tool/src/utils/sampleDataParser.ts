import { Script, SampleDataMatchResult, SampleDataAttachment, Table, Column } from '../types';
import { generateId } from './storage';

// ============================================
// Types for Parsed CSV Data
// ============================================

export interface ParsedCSVRow {
  [columnName: string]: string;
}

export interface ParsedCSVTable {
  tableName: string;
  headers: string[];
  rows: ParsedCSVRow[];
}

export interface ParsedCSVData {
  tables: ParsedCSVTable[];
  errors: string[];
}

// ============================================
// CSV Parsing Functions
// ============================================

/**
 * Parse a CSV line handling quoted fields with commas inside
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else if (char === '"') {
        // End of quoted field
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        // Start of quoted field
        inQuotes = true;
      } else if (char === ',') {
        // End of field
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
  }

  // Add last field
  result.push(current.trim());

  return result;
}

/**
 * Detect if a row is a header row by checking for table name columns or common header patterns
 */
function isHeaderRow(values: string[]): boolean {
  const tableNamePatterns = [
    'TBL_NAME', 'TABLE_NAME', 'TABLENAME', 'TABLE', 'TBL',
    'ENTITY_NAME', 'ENTITY', 'SOURCE_TABLE', 'TARGET_TABLE'
  ];

  // Check if any table name column is present
  if (values.some(v => tableNamePatterns.includes(v.toUpperCase()))) {
    return true;
  }

  // Check if values look like column headers (all uppercase, no numbers, etc.)
  const headerPatterns = /^[A-Z][A-Z0-9_]*$/;
  const headerLikeCount = values.filter(v => headerPatterns.test(v)).length;
  return headerLikeCount >= values.length * 0.7; // 70% look like headers
}

/**
 * Find the index of a table name column in headers
 * Checks for common variations: TBL_NAME, TABLE_NAME, TABLENAME, TABLE, etc.
 */
function findTableNameColumnIndex(headers: string[]): number {
  const tableNamePatterns = [
    'TBL_NAME', 'TABLE_NAME', 'TABLENAME', 'TABLE', 'TBL',
    'ENTITY_NAME', 'ENTITY', 'SOURCE_TABLE', 'TARGET_TABLE'
  ];

  for (const pattern of tableNamePatterns) {
    const index = headers.findIndex(h => h.toUpperCase() === pattern);
    if (index >= 0) return index;
  }

  return -1;
}

/**
 * Check if a line looks like metadata/garbage (not actual data)
 */
function isMetadataLine(line: string): boolean {
  const trimmed = line.trim();
  // Skip lines that start with common metadata patterns
  if (trimmed.startsWith('>>')) return true;
  if (trimmed.startsWith('--')) return true;
  if (trimmed.startsWith('#')) return true;
  if (trimmed.startsWith('/*')) return true;
  if (trimmed.toLowerCase().startsWith('query')) return true;
  if (trimmed.toLowerCase().startsWith('result')) return true;
  if (trimmed.toLowerCase().startsWith('rows affected')) return true;
  if (trimmed.toLowerCase().startsWith('execution')) return true;
  // Single value lines are likely metadata
  if (!trimmed.includes(',') && !trimmed.includes('\t')) return true;
  return false;
}

/**
 * Check if a table name looks valid (not garbage/code)
 * Valid table names: start with letter, contain only alphanumeric and underscore,
 * reasonable length, not Java/SQL keywords
 */
function isValidTableName(name: string): boolean {
  if (!name || name.length === 0) return false;
  if (name.length > 100) return false;  // Too long, likely garbage
  if (name.length < 2) return false;    // Too short

  // Must match pattern: starts with letter, contains only alphanumeric and underscore
  const validPattern = /^[A-Za-z][A-Za-z0-9_]*$/;
  if (!validPattern.test(name)) return false;

  // Skip common Java/SQL keywords and garbage
  const invalidNames = new Set([
    'TBL_NAME', 'TABLE_NAME', 'TABLENAME',  // Header row values
    'NULL', 'TRUE', 'FALSE', 'UNDEFINED',
    'THROWS', 'THROW', 'TRY', 'CATCH', 'FINALLY',  // Java keywords
    'PUBLIC', 'PRIVATE', 'PROTECTED', 'STATIC', 'VOID', 'CLASS', 'INTERFACE',
    'IMPORT', 'PACKAGE', 'EXTENDS', 'IMPLEMENTS', 'RETURN', 'NEW',
    'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE',  // SQL keywords
    'TEMP', 'TEMP1', 'TEMP2', 'TEST', 'TEST1', 'TEST2'  // Common temp names
  ]);

  if (invalidNames.has(name.toUpperCase())) return false;

  // Skip if contains Java-like patterns
  if (name.includes('Exception') || name.includes('Error')) return false;
  if (name.startsWith('java') || name.startsWith('org') || name.startsWith('com')) return false;

  return true;
}

/**
 * Find the header row index by looking for a row with multiple columns
 */
function findHeaderRowIndex(lines: string[]): number {
  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i];
    if (isMetadataLine(line)) continue;

    const values = parseCSVLine(line);
    // A header row should have multiple columns and look like identifiers
    if (values.length >= 3) {
      const headerPattern = /^[A-Z][A-Z0-9_]*$/i;
      const headerCount = values.filter(v => headerPattern.test(v.trim())).length;
      if (headerCount >= values.length * 0.5) {
        console.log('[SampleData] Found header row at line:', i);
        return i;
      }
    }
  }
  return 0; // Default to first line
}

/**
 * Parse CSV content into table-grouped data
 * Handles multi-table CSVs where TBL_NAME column identifies the table
 */
export function parseCSVSampleData(content: string, fileName: string): ParsedCSVData {
  const errors: string[] = [];
  const allLines = content.split(/\r?\n/).filter(line => line.trim().length > 0);

  console.log('[SampleData] Parsing CSV:', fileName);
  console.log('[SampleData] Total lines:', allLines.length);

  if (allLines.length === 0) {
    return { tables: [], errors: ['CSV file is empty'] };
  }

  // Find the actual header row (skip metadata lines)
  const headerRowIndex = findHeaderRowIndex(allLines);
  const lines = allLines.slice(headerRowIndex);

  if (headerRowIndex > 0) {
    console.log('[SampleData] Skipped', headerRowIndex, 'metadata lines');
  }

  if (lines.length === 0) {
    return { tables: [], errors: ['No data rows found after skipping metadata'] };
  }

  // Parse the header row
  const headerValues = parseCSVLine(lines[0]);
  const tblNameIndex = findTableNameColumnIndex(headerValues);

  console.log('[SampleData] Header values:', headerValues.slice(0, 10), '... (total:', headerValues.length, ')');
  console.log('[SampleData] TBL_NAME column index:', tblNameIndex);
  if (tblNameIndex >= 0) {
    console.log('[SampleData] TBL_NAME column name:', headerValues[tblNameIndex]);
  }

  // Group rows by table name
  const tableGroups = new Map<string, { headers: string[]; rows: ParsedCSVRow[] }>();
  let currentHeaders = headerValues;

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);

    // Check if this is a new header row (table boundary)
    if (isHeaderRow(values) && findTableNameColumnIndex(values) >= 0) {
      currentHeaders = values;
      continue;
    }

    // Determine table name
    let tableName: string;
    if (tblNameIndex >= 0 && values[tblNameIndex]) {
      tableName = values[tblNameIndex].trim();
      if (i === 1) {
        console.log('[SampleData] First row TBL_NAME value:', tableName);
      }
    } else {
      // Use filename as table name if no TBL_NAME column
      tableName = fileName.replace(/\.[^.]+$/, ''); // Remove extension
      if (i === 1) {
        console.log('[SampleData] No TBL_NAME found, using filename:', tableName);
      }
    }

    // Skip if no table name or invalid table name (garbage/code)
    if (!tableName || !isValidTableName(tableName)) continue;

    // Get or create table group
    const tableNameColumnIndex = findTableNameColumnIndex(currentHeaders);
    if (!tableGroups.has(tableName)) {
      tableGroups.set(tableName, {
        headers: currentHeaders.filter((_, idx) => idx !== tableNameColumnIndex),
        rows: []
      });
    }

    // Create row object
    const row: ParsedCSVRow = {};
    for (let j = 0; j < currentHeaders.length; j++) {
      if (j !== tableNameColumnIndex) {
        const header = currentHeaders[j];
        row[header] = values[j] || '';
      }
    }

    tableGroups.get(tableName)!.rows.push(row);
  }

  // Convert to array of ParsedCSVTable
  const tables: ParsedCSVTable[] = [];
  for (const [tableName, data] of tableGroups) {
    tables.push({
      tableName,
      headers: data.headers,
      rows: data.rows
    });
  }

  if (tables.length === 0) {
    errors.push('No data rows found in CSV');
  }

  return { tables, errors };
}

// ============================================
// Column Matching Functions
// ============================================

/**
 * Extract the base column name by stripping common table prefixes
 * e.g., "ABA0001_SECURITY_CODE" -> "SECURITY_CODE"
 * e.g., "MNETD_COLUMN_NAME" -> "COLUMN_NAME"
 * e.g., "BE_MNETD_COLUMN" -> "COLUMN"
 */
function stripTablePrefix(columnName: string): string {
  let result = columnName;

  // Pattern 1: table prefix like ABA0001_ (2-4 letters + 0-4 digits + underscore)
  result = result.replace(/^[A-Z]{2,4}\d{0,4}_/i, '');

  // Pattern 2: table prefix like MNETD_ or BE_MNETD_ (letters only + underscore, up to 10 chars)
  result = result.replace(/^[A-Z]{2,10}_/i, '');

  // Pattern 3: Multiple prefixes like BE_MNETD_ (remove again if there's another prefix)
  result = result.replace(/^[A-Z]{2,10}_/i, '');

  return result;
}

/**
 * Match a CSV column name to script column names
 * Returns the matched script column name or null
 */
function findMatchingColumn(
  csvColumn: string,
  scriptColumns: string[]
): string | null {
  const csvUpper = csvColumn.toUpperCase();
  const csvStripped = stripTablePrefix(csvColumn).toUpperCase();

  // Try exact match first
  for (const scriptCol of scriptColumns) {
    if (scriptCol.toUpperCase() === csvUpper) {
      return scriptCol;
    }
  }

  // Try stripped CSV column vs original script column
  for (const scriptCol of scriptColumns) {
    if (scriptCol.toUpperCase() === csvStripped) {
      return scriptCol;
    }
  }

  // Try original CSV column vs stripped script column
  for (const scriptCol of scriptColumns) {
    const scriptStripped = stripTablePrefix(scriptCol).toUpperCase();
    if (scriptStripped === csvUpper) {
      return scriptCol;
    }
  }

  // Try stripped CSV column vs stripped script column
  for (const scriptCol of scriptColumns) {
    const scriptStripped = stripTablePrefix(scriptCol).toUpperCase();
    if (scriptStripped === csvStripped && csvStripped.length >= 3) {
      return scriptCol;
    }
  }

  // Try if one contains the other (for cases like CSV: "MNETD_NAME" vs Script: "NAME")
  for (const scriptCol of scriptColumns) {
    const scriptUpper = scriptCol.toUpperCase();
    if (scriptUpper.length >= 4 && csvStripped.length >= 4) {
      if (csvStripped.endsWith(scriptUpper) || scriptUpper.endsWith(csvStripped)) {
        return scriptCol;
      }
    }
  }

  return null;
}

/**
 * Extract the core table identifier from a name
 * Removes common prefixes (BE_, ABA0001_, etc.) and suffixes (_sampledata*, _offset*, etc.)
 */
function extractCoreTableName(name: string): string {
  let core = name.toUpperCase();

  // Remove common suffixes like _sampledata_offset_50, _sample, _data, etc.
  core = core.replace(/_SAMPLEDATA.*$/i, '');
  core = core.replace(/_SAMPLE.*$/i, '');
  core = core.replace(/_OFFSET.*$/i, '');
  core = core.replace(/_DATA$/i, '');
  core = core.replace(/_BACKUP$/i, '');
  core = core.replace(/_COPY$/i, '');
  core = core.replace(/_TEST$/i, '');

  // Remove common prefixes like BE_, SRC_, TGT_, or pattern like ABA0001_
  core = core.replace(/^(BE_|SRC_|TGT_|SOURCE_|TARGET_|OLD_|NEW_)/i, '');
  core = core.replace(/^[A-Z]{2,4}\d{2,4}_/i, ''); // Pattern like ABA0001_

  return core;
}

/**
 * Calculate how many CSV columns match a script table's columns
 * Returns the match score (number of matched columns)
 */
function calculateColumnMatchScore(
  csvHeaders: string[],
  scriptTable: Table
): { score: number; matchedCount: number; totalCsvCols: number } {
  const scriptColumnNames = scriptTable.columns.map(c => c.name);
  let matchedCount = 0;

  for (const csvHeader of csvHeaders) {
    const matched = findMatchingColumn(csvHeader, scriptColumnNames);
    if (matched) {
      matchedCount++;
    }
  }

  // Score is the percentage of CSV columns matched
  const score = csvHeaders.length > 0 ? matchedCount / csvHeaders.length : 0;

  return { score, matchedCount, totalCsvCols: csvHeaders.length };
}

interface ColumnMatchResult {
  table: Table;
  score: number;
  matchedCount: number;
}

/**
 * Find the best matching table by analyzing column names
 * This is a fallback when table name matching fails
 */
function findBestMatchByColumns(
  csvHeaders: string[],
  scriptTables: Table[],
  minMatchScore: number = 0.3  // At least 30% of columns must match
): ColumnMatchResult | null {
  let bestMatch: Table | null = null;
  let bestScore = 0;
  let bestMatchedCount = 0;

  console.log('[SampleData] Attempting column-based matching for CSV headers:', csvHeaders.slice(0, 5), '...');

  for (const table of scriptTables) {
    const { score, matchedCount } = calculateColumnMatchScore(csvHeaders, table);

    if (score > bestScore && matchedCount >= 3) {  // Need at least 3 column matches
      bestScore = score;
      bestMatchedCount = matchedCount;
      bestMatch = table;
    }
  }

  if (bestMatch && bestScore >= minMatchScore) {
    console.log('[SampleData] Column-based match found:', bestMatch.tableName,
      `(${bestMatchedCount}/${csvHeaders.length} columns matched, ${(bestScore * 100).toFixed(0)}%)`);
    return { table: bestMatch, score: bestScore, matchedCount: bestMatchedCount };
  }

  console.log('[SampleData] No column-based match found (best score:', (bestScore * 100).toFixed(0), '%)');
  return null;
}

interface TableMatchResult {
  table: Table | null;
  matchMethod: 'name' | 'columns';
  matchScore?: number;
}

/**
 * Match a CSV table name to script table names
 * Returns the matched script table and match metadata
 */
function findMatchingTable(
  csvTableName: string,
  scriptTables: Table[],
  csvHeaders?: string[]  // Optional: for column-based fallback matching
): TableMatchResult {
  const csvUpper = csvTableName.toUpperCase();
  const csvCore = extractCoreTableName(csvTableName);

  console.log('[SampleData] Matching CSV table:', csvTableName);
  console.log('[SampleData] CSV core name:', csvCore);

  // Try exact match first
  for (const table of scriptTables) {
    if (table.tableName.toUpperCase() === csvUpper) {
      console.log('[SampleData] Exact match found:', table.tableName);
      return { table, matchMethod: 'name' };
    }
  }

  // Try core name match (most common case)
  for (const table of scriptTables) {
    const scriptCore = extractCoreTableName(table.tableName);
    console.log('[SampleData] Comparing cores:', csvCore, 'vs', scriptCore, '(from', table.tableName, ')');
    if (csvCore === scriptCore && csvCore.length >= 3) {
      console.log('[SampleData] Core match found:', table.tableName);
      return { table, matchMethod: 'name' };
    }
  }

  // Try if core name is contained in the other
  for (const table of scriptTables) {
    const scriptCore = extractCoreTableName(table.tableName);
    if (csvCore.length >= 4 && scriptCore.length >= 4) {
      if (csvCore.includes(scriptCore) || scriptCore.includes(csvCore)) {
        return { table, matchMethod: 'name' };
      }
    }
  }

  // Try suffix match (CSV table might have prefix that script table doesn't)
  for (const table of scriptTables) {
    if (csvUpper.endsWith(table.tableName.toUpperCase())) {
      return { table, matchMethod: 'name' };
    }
    if (table.tableName.toUpperCase().endsWith(csvUpper)) {
      return { table, matchMethod: 'name' };
    }
  }

  // Try partial match (table name contained in CSV table name)
  for (const table of scriptTables) {
    const scriptUpper = table.tableName.toUpperCase();
    if (scriptUpper.length >= 5) {
      if (csvUpper.includes(scriptUpper) || scriptUpper.includes(csvUpper)) {
        console.log('[SampleData] Partial match found:', table.tableName);
        return { table, matchMethod: 'name' };
      }
    }
  }

  // FALLBACK: Try column-based matching when table name doesn't match
  if (csvHeaders && csvHeaders.length > 0) {
    console.log('[SampleData] No name match, trying column-based matching...');
    const columnMatch = findBestMatchByColumns(csvHeaders, scriptTables);
    if (columnMatch) {
      return {
        table: columnMatch.table,
        matchMethod: 'columns',
        matchScore: columnMatch.score
      };
    }
  }

  console.log('[SampleData] No match found for:', csvTableName);
  return { table: null, matchMethod: 'name' };
}

/**
 * Match CSV data to script tables and columns
 */
export function matchSampleDataToScript(
  csvData: ParsedCSVData,
  script: Script
): SampleDataMatchResult[] {
  const results: SampleDataMatchResult[] = [];
  const allTables = [...script.data.targets, ...(script.data.sources || [])];

  console.log('[SampleData] Matching CSV tables to script');
  console.log('[SampleData] CSV tables found:', csvData.tables.map(t => t.tableName));
  console.log('[SampleData] Script tables:', allTables.map(t => t.tableName));

  for (const csvTable of csvData.tables) {
    // Pass CSV headers for column-based fallback matching
    const matchResult = findMatchingTable(csvTable.tableName, allTables, csvTable.headers);
    const matchedTable = matchResult.table;

    const result: SampleDataMatchResult = {
      csvTableName: csvTable.tableName,
      matchedScriptTable: matchedTable?.tableName || null,
      matchedColumns: [],
      unmatchedCsvColumns: [],
      unmatchedScriptColumns: [],
      matchMethod: matchResult.matchMethod,
      matchScore: matchResult.matchScore
    };

    if (matchedTable) {
      const scriptColumnNames = matchedTable.columns.map(c => c.name);
      const matchedScriptCols = new Set<string>();

      // Try to match each CSV column
      for (const csvHeader of csvTable.headers) {
        const matchedCol = findMatchingColumn(csvHeader, scriptColumnNames);
        if (matchedCol) {
          result.matchedColumns.push({
            csvColumn: csvHeader,
            scriptColumn: matchedCol
          });
          matchedScriptCols.add(matchedCol.toUpperCase());
        } else {
          result.unmatchedCsvColumns.push(csvHeader);
        }
      }

      // Find script columns not matched
      for (const scriptCol of scriptColumnNames) {
        if (!matchedScriptCols.has(scriptCol.toUpperCase())) {
          result.unmatchedScriptColumns.push(scriptCol);
        }
      }
    } else {
      // No table match - all CSV columns are unmatched
      result.unmatchedCsvColumns = [...csvTable.headers];
    }

    results.push(result);
  }

  return results;
}

/**
 * Extract sample values for matched columns (first N unique values)
 * Returns a nested map: tableName -> columnName -> string[]
 */
export function extractSampleValues(
  csvData: ParsedCSVData,
  matchResults: SampleDataMatchResult[],
  maxValues: number = 5
): Map<string, Map<string, string[]>> {
  const result = new Map<string, Map<string, string[]>>();

  for (const matchResult of matchResults) {
    if (!matchResult.matchedScriptTable) continue;

    const csvTable = csvData.tables.find(t => t.tableName === matchResult.csvTableName);
    if (!csvTable) continue;

    const tableValues = new Map<string, string[]>();

    for (const colMatch of matchResult.matchedColumns) {
      const values: string[] = [];
      const seenValues = new Set<string>();

      for (const row of csvTable.rows) {
        const value = row[colMatch.csvColumn];
        if (value && value.trim() && !seenValues.has(value)) {
          seenValues.add(value);
          values.push(value);
          if (values.length >= maxValues) break;
        }
      }

      if (values.length > 0) {
        tableValues.set(colMatch.scriptColumn, values);
      }
    }

    if (tableValues.size > 0) {
      result.set(matchResult.matchedScriptTable, tableValues);
    }
  }

  return result;
}

/**
 * Apply sample values to script columns
 * Returns a new Script with updated column sample values
 */
export function applySampleValuesToScript(
  script: Script,
  sampleValues: Map<string, Map<string, string[]>>
): Script {
  const updateColumns = (tables: Table[]): Table[] => {
    return tables.map(table => {
      const tableValues = sampleValues.get(table.tableName);
      if (!tableValues) return table;

      const updatedColumns: Column[] = table.columns.map(col => {
        const colValues = tableValues.get(col.name);
        if (colValues) {
          return { ...col, sampleValues: colValues };
        }
        return col;
      });

      return { ...table, columns: updatedColumns };
    });
  };

  return {
    ...script,
    data: {
      targets: updateColumns(script.data.targets),
      sources: script.data.sources ? updateColumns(script.data.sources) : []
    },
    updatedAt: Date.now()
  };
}

/**
 * Remove sample values from all columns in a script
 */
export function removeSampleValuesFromScript(script: Script): Script {
  const clearColumns = (tables: Table[]): Table[] => {
    return tables.map(table => ({
      ...table,
      columns: table.columns.map(col => {
        const { sampleValues: _, ...rest } = col;
        return rest;
      })
    }));
  };

  return {
    ...script,
    data: {
      targets: clearColumns(script.data.targets),
      sources: script.data.sources ? clearColumns(script.data.sources) : []
    },
    updatedAt: Date.now()
  };
}

/**
 * Create a sample data attachment from parsed data and match results
 */
export function createSampleDataAttachment(
  fileName: string,
  matchResults: SampleDataMatchResult[],
  parseErrors: string[]
): SampleDataAttachment {
  const warnings: string[] = [...parseErrors];

  // Add warnings for unmatched tables
  for (const result of matchResults) {
    if (!result.matchedScriptTable) {
      warnings.push(`Table "${result.csvTableName}" not found in script`);
    } else {
      if (result.unmatchedCsvColumns.length > 0) {
        warnings.push(
          `Table "${result.csvTableName}": ${result.unmatchedCsvColumns.length} CSV columns not matched`
        );
      }
    }
  }

  return {
    id: generateId(),
    fileName,
    uploadedAt: Date.now(),
    matchResults,
    warnings
  };
}

/**
 * Process a CSV file and attach sample data to a script
 * Returns the updated script and the attachment
 */
export function attachSampleDataToScript(
  script: Script,
  csvContent: string,
  fileName: string
): { script: Script; attachment: SampleDataAttachment } {
  // Parse CSV
  const csvData = parseCSVSampleData(csvContent, fileName);

  // Match to script
  const matchResults = matchSampleDataToScript(csvData, script);

  // Extract sample values
  const sampleValues = extractSampleValues(csvData, matchResults);

  // Apply to script
  let updatedScript = applySampleValuesToScript(script, sampleValues);

  // Create attachment record
  const attachment = createSampleDataAttachment(fileName, matchResults, csvData.errors);

  // Add attachment to script
  updatedScript = {
    ...updatedScript,
    sampleDataAttachments: [
      ...(updatedScript.sampleDataAttachments || []),
      attachment
    ]
  };

  return { script: updatedScript, attachment };
}

/**
 * Remove a sample data attachment from a script
 */
export function removeSampleDataAttachment(
  script: Script,
  attachmentId: string
): Script {
  const attachments = script.sampleDataAttachments || [];
  const updatedAttachments = attachments.filter(a => a.id !== attachmentId);

  // If no more attachments, clear sample values
  let updatedScript: Script = {
    ...script,
    sampleDataAttachments: updatedAttachments
  };

  if (updatedAttachments.length === 0) {
    updatedScript = removeSampleValuesFromScript(updatedScript);
  }

  return updatedScript;
}
