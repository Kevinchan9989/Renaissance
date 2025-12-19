// Test SQL type parsing for NUMERIC(5,3)

const testSQL = `
CREATE TABLE public.test_table (
  col1 VARCHAR(100),
  col2 NUMERIC(5,3),
  col3 INTEGER
);
`;

function splitSqlParams(txt) {
  const result = [];
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

// Test the function
const body = `
  col1 VARCHAR(100),
  col2 NUMERIC(5,3),
  col3 INTEGER
`;

console.log('Testing splitSqlParams:');
const parts = splitSqlParams(body);
parts.forEach((part, i) => {
  console.log(`Part ${i}:`, part.trim());
});

// Test the type extraction regex
parts.forEach(line => {
  const trimmedLine = line.trim();
  console.log('\nProcessing:', trimmedLine);

  const colMatch = trimmedLine.match(/^["`]?(\w+)["`]?\s+(.+)$/);
  if (colMatch) {
    const name = colMatch[1];
    let rest = colMatch[2];
    console.log('  Column name:', name);
    console.log('  Rest:', rest);

    // PostgreSQL type extraction
    const typeMatch = rest.match(/^([A-Za-z_]\w*)\s*(\([^)]*\))?(.*)$/);
    if (typeMatch) {
      const type = typeMatch[1] + (typeMatch[2] || '');
      console.log('  Type extracted:', type);
      console.log('  Type match groups:', typeMatch);
    }
  }
});
