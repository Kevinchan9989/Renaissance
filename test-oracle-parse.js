// Test Oracle SQL type parsing for NUMBER(7,2)

const testOracleSQL = `
CREATE TABLE SYSTEM.test_table (
  id NUMBER(10) PRIMARY KEY,
  amount NUMBER(7,2) NOT NULL,
  price DECIMAL(10,3),
  name VARCHAR2(100 BYTE)
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

function cleanName(str) {
  return str ? str.replace(/["`\[\]]/g, '').trim() : '';
}

// Extract the body from CREATE TABLE
const createMatch = testOracleSQL.match(/CREATE\s+TABLE\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s*\(/i);
if (createMatch) {
  console.log('Table schema:', createMatch[1] || 'SYSTEM');
  console.log('Table name:', createMatch[2]);

  // Find matching closing paren
  const startPos = testOracleSQL.indexOf('(', createMatch.index + createMatch[0].length - 1) + 1;
  let depth = 1;
  let endPos = startPos;

  while (depth > 0 && endPos < testOracleSQL.length) {
    if (testOracleSQL[endPos] === '(') depth++;
    else if (testOracleSQL[endPos] === ')') depth--;
    endPos++;
  }

  const body = testOracleSQL.substring(startPos, endPos - 1);
  console.log('\nExtracted body:');
  console.log(body);
  console.log('\n---\n');

  const lines = splitSqlParams(body);
  console.log('Split into', lines.length, 'parts:');

  lines.forEach((line, idx) => {
    const trimmedLine = line.trim();
    console.log(`\nPart ${idx}: "${trimmedLine}"`);

    const upperLine = trimmedLine.toUpperCase();
    if (upperLine.startsWith('CONSTRAINT') || upperLine.startsWith('PRIMARY') ||
        upperLine.startsWith('FOREIGN') || upperLine.startsWith('UNIQUE') ||
        upperLine.startsWith('CHECK')) {
      console.log('  -> This is a constraint, skipping');
      return;
    }

    // Column definition
    const colMatch = trimmedLine.match(/^["`]?(\w+)["`]?\s+(\w+)(.*)$/);
    if (colMatch) {
      const name = colMatch[1];
      let type = colMatch[2];
      let rest = colMatch[3] || '';

      console.log('  Column name:', name);
      console.log('  Base type:', type);
      console.log('  Rest:', rest);

      // Handle types with arguments
      if (rest.trim().startsWith('(')) {
        const parenMatch = rest.match(/^\s*\(([^)]+)\)/);
        if (parenMatch) {
          let typeArgs = parenMatch[1].trim();
          console.log('  Type args before clean:', typeArgs);

          // Remove BYTE/CHAR qualifiers
          typeArgs = typeArgs.replace(/\s+BYTE\s*$/i, '').replace(/\s+CHAR\s*$/i, '');
          console.log('  Type args after clean:', typeArgs);

          type += `(${typeArgs})`;
          rest = rest.substring(rest.indexOf(')') + 1);

          console.log('  Final type:', type);
          console.log('  Remaining rest:', rest);
        }
      }

      const nullable = rest.toUpperCase().includes('NOT NULL') ? 'No' : 'Yes';
      console.log('  Nullable:', nullable);
    }
  });
}
