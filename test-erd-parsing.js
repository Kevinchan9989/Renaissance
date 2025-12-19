// Complete test of FK parsing and ERD relationship extraction

// Step 1: Parser cleanName and FK extraction
function cleanName(str) {
  return str ? str.replace(/["`\[\]]/g, '').trim() : '';
}

const fkLine = 'CONSTRAINT fk_annparams_secparams FOREIGN KEY (iss_sec_params_uuid) REFERENCES iss.iss_sec_params("uuid")';
const fkRegex = /(?:CONSTRAINT\s+(\w+)\s+)?FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s*\(([^)]+)\)/i;

const fkMatch = fkLine.match(fkRegex);
if (fkMatch) {
  const constraintName = fkMatch[1] || 'fk_default';
  const localCols = fkMatch[2].split(',').map(c => cleanName(c)).join(', ');
  const refSchema = fkMatch[3] || 'public';
  const refTable = fkMatch[4];
  const refCols = fkMatch[5].split(',').map(c => cleanName(c)).join(', ');

  const refString = `${refSchema}.${refTable}(${refCols})`;

  console.log('=== Parser Output ===');
  console.log('Constraint name:', constraintName);
  console.log('Local cols:', localCols);
  console.log('Ref string:', refString);

  // Step 2: ERD Viewer parsing
  console.log('\n=== ERD Viewer Parsing ===');
  const erdRegex = /(?:(\w+)\.)?(\w+)\(([^)]+)\)/;
  const refMatch = refString.match(erdRegex);

  if (refMatch) {
    const refTable = refMatch[2].toUpperCase();
    const refCol = refMatch[3].split(',')[0].trim();

    console.log('✅ ERD successfully parsed:');
    console.log('  Ref table:', refTable);
    console.log('  Ref column:', refCol);
  } else {
    console.log('❌ ERD failed to parse ref string:', refString);
  }
} else {
  console.log('❌ Parser failed to match FK line');
}

// Step 3: Test with potential problem case - quoted table name
console.log('\n=== Testing with quoted referenced table ===');
const quotedFkLine = 'CONSTRAINT fk_test FOREIGN KEY (col1) REFERENCES "schema"."table"("col2")';
const quotedMatch = quotedFkLine.match(fkRegex);
if (quotedMatch) {
  console.log('Schema:', quotedMatch[3]);
  console.log('Table:', quotedMatch[4]);
  console.log('Cols:', quotedMatch[5]);
  const refStr = `${quotedMatch[3]}.${quotedMatch[4]}(${cleanName(quotedMatch[5])})`;
  console.log('Ref string:', refStr);
} else {
  console.log('❌ Failed to match quoted FK');
}
