import type { Table } from '../types';

// Column keys matching DataDictionary
export type ExcelColumnKey = 'column' | 'type' | 'nullable' | 'default' | 'explanation' | 'mapping' | 'sampleValues' | 'possibleValues' | 'mappedTo' | 'migrationNeeded' | 'nonMigrationComment';

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

// Styling constants
const TITLE_BG = '1B3A5C';         // Dark blue
const TITLE_FONT_COLOR = 'FFFFFF'; // White
const SECTION_BG = '2C5282';       // Medium dark blue for section headers
const SECTION_FONT_COLOR = 'FFFFFF';
const HEADER_BG = 'E2E8F0';        // Light gray for column headers
const HEADER_FONT_COLOR = '1A202C';
const CELL_FONT_COLOR = '000000';
const CODE_FONT_COLOR = '1A365D';
const COMPLETED_ROW_FILL = 'E8FAF0';
const LABEL_BG = 'F7FAFC';         // Very light gray for info labels
const BORDER_COLOR = '000000';      // Black borders

const THIN_BORDER: import('exceljs').Border = { style: 'thin', color: { argb: BORDER_COLOR } };
const ALL_BORDERS: Partial<import('exceljs').Borders> = {
  top: THIN_BORDER,
  bottom: THIN_BORDER,
  left: THIN_BORDER,
  right: THIN_BORDER,
};

const DATA_ROW_HEIGHT = 20;
const MAX_ROW_HEIGHT = 120;
const CHARS_PER_LINE = 40;
const LINE_HEIGHT = 14;

function sanitizeSheetName(name: string): string {
  return name.replace(/[\[\]:*?/\\]/g, '_').substring(0, 31);
}

function deduplicateSheetNames(names: string[]): string[] {
  const seen = new Map<string, number>();
  return names.map(name => {
    const sanitized = sanitizeSheetName(name);
    const count = seen.get(sanitized) || 0;
    seen.set(sanitized, count + 1);
    if (count === 0) return sanitized;
    const suffix = `_${count}`;
    return sanitized.substring(0, 31 - suffix.length) + suffix;
  });
}

function estimateRowHeight(values: string[], colWidths: number[]): number {
  let maxLines = 1;
  values.forEach((val, i) => {
    if (!val) return;
    const charWidth = colWidths[i] || CHARS_PER_LINE;
    const lines = Math.ceil(val.length / (charWidth * 0.9)) + (val.split('\n').length - 1);
    if (lines > maxLines) maxLines = lines;
  });
  const height = Math.max(DATA_ROW_HEIGHT, maxLines * LINE_HEIGHT);
  return Math.min(height, MAX_ROW_HEIGHT);
}

function applyMergedCell(
  sheet: import('exceljs').Worksheet,
  row: number, col1: number, col2: number,
  value: string,
  font: Partial<import('exceljs').Font>,
  fill: import('exceljs').Fill,
  alignment?: Partial<import('exceljs').Alignment>,
) {
  if (col2 > col1) sheet.mergeCells(row, col1, row, col2);
  const cell = sheet.getCell(row, col1);
  cell.value = value;
  cell.font = font;
  cell.fill = fill;
  cell.alignment = alignment || { vertical: 'middle', horizontal: 'left', wrapText: true };
  cell.border = ALL_BORDERS;
  for (let c = col1 + 1; c <= col2; c++) {
    sheet.getCell(row, c).border = ALL_BORDERS;
  }
}

export interface ExcelExportOptions {
  scriptName: string;
  tables: Array<Table & { isSource?: boolean }>;
  getMappingInfo: (tableName: string, colName: string) => string | null;
  getColumnTags: (table: Table, colName: string) => string[];
  visibleColumns: ExcelColumnKey[];
}

export async function exportDataDictionaryToExcel(options: ExcelExportOptions): Promise<void> {
  const ExcelJS = await import('exceljs');
  const workbook = new ExcelJS.Workbook();

  const { scriptName, tables: allTables, getMappingInfo, getColumnTags, visibleColumns } = options;

  // Include all tables (including those marked "To Ignore" so data is preserved)
  const tables = allTables;

  const activeCols = EXCEL_COLUMNS.filter(c => visibleColumns.includes(c.key));
  const colCount = activeCols.length;

  const rawNames = tables.map(t => {
    const prefix = t.isSource ? 'SRC_' : '';
    return prefix + t.tableName;
  });
  const sheetNames = deduplicateSheetNames(rawNames);

  const tableSheetMap = new Map<number, string>();
  tables.forEach((_, i) => tableSheetMap.set(i, sheetNames[i]));

  // ═══════════════════════════════════════
  // INDEX SHEET
  // ═══════════════════════════════════════
  {
    const homeSheet = workbook.addWorksheet('Index');
    const homeCols = 8;
    homeSheet.columns = [
      { width: 8 },   // #
      { width: 20 },  // Schema
      { width: 30 },  // Table Name
      { width: 40 },  // Description
      { width: 12 },  // Columns
      { width: 10 },  // _t
      { width: 16 },  // Expl Completed
      { width: 12 },  // To Ignore
    ];

    let hr = 1;
    applyMergedCell(homeSheet, hr, 1, homeCols, `${scriptName} - Table Index`,
      { name: 'Calibri', size: 14, bold: true, color: { argb: TITLE_FONT_COLOR } },
      { type: 'pattern', pattern: 'solid', fgColor: { argb: TITLE_BG } },
    );
    homeSheet.getRow(hr).height = 30;
    hr++;

    const targets = tables.filter(t => !t.isSource);
    const sources = tables.filter(t => t.isSource);

    const writeGroup = (label: string, group: Array<Table & { isSource?: boolean }>, globalIndices: number[]) => {
      applyMergedCell(homeSheet, hr, 1, homeCols, `${label} (${group.length})`,
        { name: 'Calibri', size: 11, bold: true, color: { argb: SECTION_FONT_COLOR } },
        { type: 'pattern', pattern: 'solid', fgColor: { argb: SECTION_BG } },
      );
      homeSheet.getRow(hr).height = 24;
      hr++;

      const headerRowNum = hr;
      const headers = ['#', 'Schema', 'Table Name', 'Description', 'Columns', '_t', 'Expl Completed', 'To Ignore'];
      headers.forEach((h, ci) => {
        const cell = homeSheet.getCell(hr, ci + 1);
        cell.value = h;
        cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: HEADER_FONT_COLOR } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_BG } };
        cell.alignment = { vertical: 'middle', horizontal: ci >= 4 ? 'center' : 'left' };
        cell.border = ALL_BORDERS;
      });
      hr++;

      group.forEach((t, i) => {
        const gIdx = globalIndices[i];
        const sName = tableSheetMap.get(gIdx) || '';
        const vals = [
          String(i + 1),
          t.schema || '-',
          t.tableName,
          t.description || '-',
          String(t.columns.length),
          (t._tChecked ?? t.tableName.toLowerCase().includes('_t')) ? 'Y' : 'N',
          t.explanationCompleted ? 'Y' : 'N',
          t.toIgnore ? 'Y' : 'N',
        ];
        vals.forEach((v, ci) => {
          const cell = homeSheet.getCell(hr, ci + 1);
          if (ci === 2) {
            cell.value = {
              text: v,
              hyperlink: `#'${sName}'!A1`,
            } as import('exceljs').CellHyperlinkValue;
            cell.font = { name: 'Consolas', size: 10, bold: true, color: { argb: '2563EB' }, underline: true };
          } else {
            cell.value = v;
            cell.font = { name: 'Calibri', size: 10, color: { argb: CELL_FONT_COLOR } };
          }
          cell.alignment = { vertical: 'middle', horizontal: ci >= 4 ? 'center' : 'left' };
          cell.border = ALL_BORDERS;
          if (t.explanationCompleted) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COMPLETED_ROW_FILL } };
          }
        });
        homeSheet.getRow(hr).height = DATA_ROW_HEIGHT;
        hr++;
      });

      homeSheet.autoFilter = {
        from: { row: headerRowNum, column: 1 },
        to: { row: headerRowNum + group.length, column: homeCols },
      };

      hr++;
    };

    if (targets.length > 0) {
      const targetIndices = tables.map((t, i) => ({ t, i })).filter(x => !x.t.isSource).map(x => x.i);
      writeGroup('Table List', targets, targetIndices);
    }
    if (sources.length > 0) {
      const sourceIndices = tables.map((t, i) => ({ t, i })).filter(x => x.t.isSource).map(x => x.i);
      writeGroup('Source Tables', sources, sourceIndices);
    }
  }

  // ═══════════════════════════════════════
  // TABLE SHEETS
  // ═══════════════════════════════════════
  tables.forEach((table, idx) => {
    const sheet = workbook.addWorksheet(sheetNames[idx]);

    // Column widths — same as column details
    sheet.columns = activeCols.map(c => ({ width: c.width }));

    let currentRow = 1;

    // "Back to Index" hyperlink
    const navCell = sheet.getCell(currentRow, 1);
    navCell.value = {
      text: '\u2190 Back to Index',
      hyperlink: "#'Index'!A1",
    } as import('exceljs').CellHyperlinkValue;
    navCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: '2563EB' }, underline: true };
    navCell.alignment = { vertical: 'middle', horizontal: 'left' };
    sheet.getRow(currentRow).height = 20;
    currentRow++;

    // ═══ SECTION 1: TABLE INFORMATION (narrow — 4 cols max) ═══

    const infoSpan = Math.min(4, colCount);

    // Title row — same font size/type as headers, keep dark blue color
    const sourcePrefix = table.isSource ? '[SOURCE] ' : '';
    const titleText = `${sourcePrefix}${table.schema ? table.schema + '.' : ''}${table.tableName}`;
    applyMergedCell(sheet, currentRow, 1, infoSpan, titleText,
      { name: 'Calibri', size: 10, bold: true, color: { argb: TITLE_FONT_COLOR } },
      { type: 'pattern', pattern: 'solid', fgColor: { argb: TITLE_BG } },
    );
    sheet.getRow(currentRow).height = 24;
    currentRow++;

    // Info rows — label in col 1, value merged across cols 2..infoSpan
    const writeInfoRow = (label: string, value: string) => {
      const labelCell = sheet.getCell(currentRow, 1);
      labelCell.value = label;
      labelCell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: CELL_FONT_COLOR } };
      labelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: LABEL_BG } };
      labelCell.alignment = { vertical: 'middle', horizontal: 'left' };
      labelCell.border = ALL_BORDERS;

      if (infoSpan > 2) sheet.mergeCells(currentRow, 2, currentRow, infoSpan);
      const valCell = sheet.getCell(currentRow, 2);
      valCell.value = value;
      valCell.font = { name: 'Calibri', size: 10, color: { argb: CELL_FONT_COLOR } };
      valCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      valCell.border = ALL_BORDERS;
      for (let c = 3; c <= infoSpan; c++) sheet.getCell(currentRow, c).border = ALL_BORDERS;
      currentRow++;
    };

    // Order: Schema, Table Name, Total Columns, Description, _t, Expl Completed, To Ignore
    writeInfoRow('Schema', table.schema || '-');
    writeInfoRow('Table Name', table.tableName);
    writeInfoRow('Total Columns', String(table.columns.length));
    writeInfoRow('Description', table.description || '-');
    writeInfoRow('_t', (table._tChecked ?? table.tableName.toLowerCase().includes('_t')) ? 'Y' : 'N');
    writeInfoRow('Explanation Completed', table.explanationCompleted ? 'Y' : 'N');
    writeInfoRow('To Ignore', table.toIgnore ? 'Y' : 'N');

    // Blank separator row
    currentRow++;

    // ═══ SECTION 2: CONSTRAINTS ═══

    applyMergedCell(sheet, currentRow, 1, colCount, 'Constraints',
      { name: 'Calibri', size: 10, bold: true, color: { argb: SECTION_FONT_COLOR } },
      { type: 'pattern', pattern: 'solid', fgColor: { argb: SECTION_BG } },
    );
    sheet.getRow(currentRow).height = 24;
    currentRow++;

    if (table.constraints.length > 0) {
      const constraintHeaders = ['Constraint Name', 'Type', 'Columns', 'Reference'];
      const cCount = Math.min(constraintHeaders.length, colCount);
      constraintHeaders.slice(0, cCount).forEach((h, ci) => {
        const cell = sheet.getCell(currentRow, ci + 1);
        cell.value = h;
        cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: HEADER_FONT_COLOR } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_BG } };
        cell.alignment = { vertical: 'middle', horizontal: 'left' };
        cell.border = ALL_BORDERS;
      });
      currentRow++;

      table.constraints.forEach(constraint => {
        const cValues = [constraint.name, constraint.type, constraint.localCols, constraint.ref || '-'];
        cValues.slice(0, cCount).forEach((val, ci) => {
          const cell = sheet.getCell(currentRow, ci + 1);
          cell.value = val;
          cell.font = ci === 0
            ? { name: 'Calibri', size: 10, bold: true, color: { argb: CELL_FONT_COLOR } }
            : { name: 'Calibri', size: 10, color: { argb: CELL_FONT_COLOR } };
          cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
          cell.border = ALL_BORDERS;
        });
        sheet.getRow(currentRow).height = DATA_ROW_HEIGHT;
        currentRow++;
      });
    } else {
      applyMergedCell(sheet, currentRow, 1, colCount, 'No constraints defined',
        { name: 'Calibri', size: 10, italic: true, color: { argb: '718096' } },
        { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } },
      );
      currentRow++;
    }

    // Blank separator row
    currentRow++;

    // ═══ SECTION 3: COLUMN DETAILS ═══

    applyMergedCell(sheet, currentRow, 1, colCount, 'Column Details',
      { name: 'Calibri', size: 10, bold: true, color: { argb: SECTION_FONT_COLOR } },
      { type: 'pattern', pattern: 'solid', fgColor: { argb: SECTION_BG } },
    );
    sheet.getRow(currentRow).height = 24;
    currentRow++;

    const headerRow = currentRow;

    // Column headers
    activeCols.forEach((col, colIdx) => {
      const cell = sheet.getCell(currentRow, colIdx + 1);
      cell.value = col.header;
      cell.font = { name: 'Calibri', size: 10, bold: true, color: { argb: HEADER_FONT_COLOR } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_BG } };
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      cell.border = ALL_BORDERS;
    });
    sheet.getRow(currentRow).height = 22;
    currentRow++;

    // Data rows
    table.columns.forEach(col => {
      const tags = getColumnTags(table, col.name);
      const tagStr = tags.length > 0 ? ` (${tags.join(', ')})` : '';

      const mappingInfo = getMappingInfo(table.tableName, col.name);
      let mappedTo: string;
      if (mappingInfo) {
        mappedTo = mappingInfo;
      } else if (col.migrationNeeded === false) {
        mappedTo = `Not Mapped${col.nonMigrationComment ? ' - ' + col.nonMigrationComment : ''}`;
      } else {
        mappedTo = '-';
      }

      const sampleVals = col.sampleValues || [];
      const sampleText = sampleVals.slice(0, 5).join(', ') + (sampleVals.length > 5 ? '...' : '');

      const nullableDisplay = col.nullable?.toUpperCase() === 'Y' || col.nullable?.toUpperCase() === 'YES'
        ? 'NULL'
        : col.nullable?.toUpperCase() === 'N' || col.nullable?.toUpperCase() === 'NO'
          ? 'NOT NULL'
          : col.nullable || '';

      const allValues: Record<ExcelColumnKey, string> = {
        column: col.name + tagStr,
        type: col.type,
        nullable: nullableDisplay,
        default: col.default || '',
        explanation: col.explanation || '',
        mapping: col.mapping || '',
        sampleValues: sampleText,
        possibleValues: col.possibleValues || '',
        mappedTo: mappedTo,
        migrationNeeded: col.migrationNeeded === undefined ? '' : col.migrationNeeded ? 'Y' : 'N',
        nonMigrationComment: col.nonMigrationComment || '',
      };

      const rowValues = activeCols.map(c => allValues[c.key]);
      const colWidths = activeCols.map(c => c.width);

      rowValues.forEach((val, colIdx) => {
        const cell = sheet.getCell(currentRow, colIdx + 1);
        cell.value = val;
        cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
        cell.border = ALL_BORDERS;

        const colKey = activeCols[colIdx].key;
        if (colKey === 'column' || colKey === 'type') {
          cell.font = { name: 'Consolas', size: 10, bold: true, color: { argb: CODE_FONT_COLOR } };
        } else {
          cell.font = { name: 'Calibri', size: 10, color: { argb: CELL_FONT_COLOR } };
        }

        if (table.explanationCompleted) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COMPLETED_ROW_FILL } };
        }
      });

      const rowHeight = estimateRowHeight(rowValues, colWidths);
      sheet.getRow(currentRow).height = rowHeight;
      currentRow++;
    });

    // Auto-filter on column header row
    if (table.columns.length > 0) {
      sheet.autoFilter = {
        from: { row: headerRow, column: 1 },
        to: { row: headerRow + table.columns.length, column: colCount },
      };
    }
  });

  // Generate and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${scriptName}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
