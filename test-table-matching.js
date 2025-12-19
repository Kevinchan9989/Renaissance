// Test table matching logic in ERD

// Simulate the tables after parsing
const tables = [
  {
    id: 1,
    schema: 'iss',
    tableName: 'iss_sec_params',
    constraints: [],
    columns: []
  },
  {
    id: 2,
    schema: 'iss',
    tableName: 'iss_announcement_allotment_params',
    constraints: [
      {
        name: 'fk_annparams_secparams',
        type: 'Foreign Key',
        localCols: 'iss_sec_params_uuid',
        ref: 'iss.iss_sec_params(uuid)'
      }
    ],
    columns: []
  }
];

// ERD Viewer logic (line 273-298)
const tableNames = new Set(tables.map(t => t.tableName.toUpperCase()));
console.log('Available tables (uppercase):', Array.from(tableNames));

const edges = [];
for (const table of tables) {
  for (const constraint of table.constraints) {
    if (constraint.type === 'Foreign Key' && constraint.ref) {
      console.log('\nProcessing FK:', constraint.name);
      console.log('  Ref string:', constraint.ref);

      const refMatch = constraint.ref.match(/(?:(\w+)\.)?(\w+)\(([^)]+)\)/);
      if (refMatch) {
        console.log('  Regex matched!');
        console.log('    Schema:', refMatch[1]);
        console.log('    Table:', refMatch[2]);
        console.log('    Column:', refMatch[3]);

        const refTable = refMatch[2].toUpperCase();
        const refCol = refMatch[3].split(',')[0].trim();

        console.log('  Looking for table:', refTable);
        console.log('  Table exists?:', tableNames.has(refTable));

        if (tableNames.has(refTable)) {
          console.log('  ✅ Creating edge');
          edges.push({
            id: `${table.tableName}-${refTable}-${constraint.localCols}`,
            sourceTable: table.tableName.toUpperCase(),
            sourceColumn: constraint.localCols.split(',')[0].trim(),
            targetTable: refTable,
            targetColumn: refCol
          });
        } else {
          console.log('  ❌ Table not found in tableNames set');
        }
      } else {
        console.log('  ❌ Regex did not match');
      }
    }
  }
}

console.log('\n=== Final Edges ===');
console.log('Count:', edges.length);
edges.forEach(edge => {
  console.log(`  ${edge.sourceTable}.${edge.sourceColumn} -> ${edge.targetTable}.${edge.targetColumn}`);
});
