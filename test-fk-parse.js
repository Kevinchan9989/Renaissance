// Test FK parsing for the specific pattern
const testSQL = `
CREATE TABLE iss.iss_announcement_allotment_params (
	id int8 NOT NULL,
	iss_sec_params_uuid varchar(36) NOT NULL,
	CONSTRAINT iss_ann_allot_params_pkey PRIMARY KEY (id),
	CONSTRAINT iss_ann_allot_params_uuid_key UNIQUE (uuid),
	CONSTRAINT fk_annparams_secparams FOREIGN KEY (iss_sec_params_uuid) REFERENCES iss.iss_sec_params("uuid")
);
`;

// Test the FK regex pattern from parsers.ts line 121
const fkRegex = /(?:CONSTRAINT\s+(\w+)\s+)?FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s*\(([^)]+)\)/i;

const lines = testSQL.split('\n');
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed.toUpperCase().includes('FOREIGN KEY')) {
    console.log('Testing line:', trimmed);
    const match = trimmed.match(fkRegex);
    if (match) {
      console.log('✅ MATCHED!');
      console.log('  Constraint name:', match[1]);
      console.log('  Local cols:', match[2]);
      console.log('  Ref schema:', match[3]);
      console.log('  Ref table:', match[4]);
      console.log('  Ref cols:', match[5]);
    } else {
      console.log('❌ NO MATCH');
    }
  }
}

// Also test what splitSqlParams does
console.log('\n--- Testing splitSqlParams ---');
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

const tableBody = testSQL.match(/CREATE\s+TABLE\s+.*?\(([\s\S]*?)\);/i)?.[1];
if (tableBody) {
  const params = splitSqlParams(tableBody);
  console.log('Split params count:', params.length);
  params.forEach((p, i) => {
    const trimmed = p.trim();
    if (trimmed.toUpperCase().includes('FOREIGN')) {
      console.log(`Param ${i}:`, trimmed.substring(0, 100) + '...');
    }
  });
}
