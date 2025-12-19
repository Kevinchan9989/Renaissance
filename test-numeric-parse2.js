// Test with actual comma-separated line (as it comes from splitSqlParams)

const testLines = [
  'col1 NUMERIC(7) NOT NULL',
  'col2 NUMERIC(13)',
  'col3 NUMERIC(5,2)',
  'col4 NUMERIC(5, 2)',  // with space after comma
  'col5 VARCHAR(100) DEFAULT NULL'
];

testLines.forEach(trimmedLine => {
  const colMatch = trimmedLine.match(/^["`]?(\w+)["`]?\s+(.+)$/);

  if (colMatch) {
    const name = colMatch[1];
    let rest = colMatch[2];
    let type = '';

    const typeMatch = rest.match(/^([A-Za-z_]\w*)\s*(\([^)]*\))?(.*)$/);
    if (typeMatch) {
      type = typeMatch[1] + (typeMatch[2] || '');
      rest = typeMatch[3] || '';
    }

    // Normalize (like in the actual code)
    type = type.trim().toUpperCase().replace(/\s+/g, '');

    console.log(`Input: "${trimmedLine}"`);
    console.log(`  -> Column: ${name}, Type: "${type}"`);
    console.log();
  }
});
