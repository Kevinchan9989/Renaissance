// Test the NUMERIC parsing fix

const testInput = `
  col1 NUMERIC(7) NOT NULL,
  col2 NUMERIC(13),
  col3 NUMERIC(5,2),
  col4 VARCHAR(100),
  col5 INTEGER
`;

const lines = testInput.trim().split('\n');

lines.forEach(line => {
  const trimmedLine = line.trim();

  // Match column definition
  const colMatch = trimmedLine.match(/^["`]?(\w+)["`]?\s+(.+)$/);

  if (colMatch) {
    const name = colMatch[1];
    let rest = colMatch[2];
    let type = '';

    // Extract type with optional parentheses
    const typeMatch = rest.match(/^([A-Za-z_]\w*)\s*(\([^)]*\))?(.*)$/);
    if (typeMatch) {
      type = typeMatch[1] + (typeMatch[2] || '');
      rest = typeMatch[3] || '';
    }

    console.log(`Column: ${name}`);
    console.log(`  Type: "${type}"`);
    console.log(`  Rest: "${rest.trim()}"`);
    console.log();
  }
});
