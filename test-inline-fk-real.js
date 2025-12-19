// Test with your EXACT SQL formatting

const testSQL = `
CREATE TABLE iss.iss_calendar_params (
	id int8 NOT NULL,
	"uuid" varchar(36) NOT NULL DEFAULT gen_random_uuid(),
	iss_sec_params_uuid varchar(36) NOT NULL,
	CONSTRAINT iss_calendar_params_pkey PRIMARY KEY (id),
	CONSTRAINT iss_calendar_params_unique_config UNIQUE (iss_sec_params_uuid, tenor, tenor_unit),
	CONSTRAINT iss_calendar_params_uuid_key UNIQUE (uuid),
	CONSTRAINT fk_calparams_secparams FOREIGN KEY (iss_sec_params_uuid) REFERENCES iss.iss_sec_params("uuid")
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

// Extract table body
const createRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s*\(([\s\S]*?)\)\s*;/gi;
const match = createRegex.exec(testSQL);

if (match) {
  const tableName = match[2];
  const body = match[3];

  console.log('Table:', tableName);
  console.log('\n=== Splitting params ===');

  const lines = splitSqlParams(body);
  console.log('Total params:', lines.length);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const upperLine = line.toUpperCase();

    if (upperLine.includes('FOREIGN KEY')) {
      console.log(`\n--- Param ${i} (FK) ---`);
      console.log('Raw:', line);

      // Test the FK regex
      const fkRegex = /(?:CONSTRAINT\s+(\w+)\s+)?FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s*\(([^)]+)\)/i;
      const fkMatch = line.match(fkRegex);

      if (fkMatch) {
        console.log('✅ MATCHED!');
        console.log('  Constraint:', fkMatch[1]);
        console.log('  Local cols:', fkMatch[2]);
        console.log('  Ref schema:', fkMatch[3]);
        console.log('  Ref table:', fkMatch[4]);
        console.log('  Ref cols:', fkMatch[5]);

        const localCols = fkMatch[2].split(',').map(c => cleanName(c)).join(', ');
        const refSchema = fkMatch[3] || 'public';
        const refTable = fkMatch[4];
        const refCols = fkMatch[5].split(',').map(c => cleanName(c)).join(', ');

        console.log('\n  After cleaning:');
        console.log('  Local:', localCols);
        console.log('  Ref:', `${refSchema}.${refTable}(${refCols})`);
      } else {
        console.log('❌ NO MATCH!');
      }
    }
  }
}
