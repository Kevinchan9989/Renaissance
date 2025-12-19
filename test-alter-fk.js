// Test ALTER TABLE FK parsing with your exact SQL

const testSQL = `
CREATE TABLE iss.iss_sec_params (
	id int8 NOT NULL,
	"uuid" varchar(36) NOT NULL,
	security_type varchar(50) NOT NULL,
	CONSTRAINT iss_sec_params_pkey PRIMARY KEY (id)
);

CREATE TABLE iss.iss_calendar_params (
	id int8 NOT NULL,
	"uuid" varchar(36) NOT NULL,
	iss_sec_params_uuid varchar(36) NOT NULL,
	CONSTRAINT iss_calendar_params_pkey PRIMARY KEY (id)
);

-- FK defined via ALTER TABLE
ALTER TABLE iss.iss_calendar_params
    ADD CONSTRAINT fk_calparams_secparams
    FOREIGN KEY (iss_sec_params_uuid) REFERENCES iss.iss_sec_params("uuid");
`;

// Simulate parser behavior
const tables = [];
const tablesMap = {};

function cleanName(str) {
  return str ? str.replace(/["`\[\]]/g, '').trim() : '';
}

// Parse CREATE TABLE
const createRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s*\(([\s\S]*?)\)\s*;/gi;
let match;

while ((match = createRegex.exec(testSQL)) !== null) {
  const schema = match[1] || 'public';
  const tableName = match[2];

  const tableObj = {
    schema,
    tableName,
    constraints: []
  };

  tables.push(tableObj);
  const key = `${schema}.${tableName}`;
  tablesMap[key] = tableObj;
  console.log(`Created table with key: "${key}"`);
}

console.log('\nTablesMap keys:', Object.keys(tablesMap));

// Parse ALTER TABLE FK
const alterRegex = /ALTER\s+TABLE\s+(?:ONLY\s+)?(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s+ADD\s+CONSTRAINT\s+(\w+)\s+FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s*\(([^)]+)\)/gi;

while ((match = alterRegex.exec(testSQL)) !== null) {
  const tSchema = match[1] || 'public';
  const tName = match[2];
  const cName = match[3];
  const localCols = match[4].split(',').map(c => cleanName(c)).join(', ');
  const refSchema = match[5] || 'public';
  const refTable = match[6];
  const refCols = match[7].split(',').map(c => cleanName(c)).join(', ');

  console.log('\n--- Processing ALTER TABLE ---');
  console.log('Schema:', tSchema);
  console.log('Table:', tName);
  console.log('Looking for key:', `${tSchema}.${tName}`);

  const targetObj = tablesMap[`${tSchema}.${tName}`];
  if (targetObj) {
    console.log('✅ Found table!');
    targetObj.constraints.push({
      name: cName,
      type: 'Foreign Key',
      localCols,
      ref: `${refSchema}.${refTable}(${refCols})`
    });
  } else {
    console.log('❌ Table not found in map');
    console.log('Available keys:', Object.keys(tablesMap));
  }
}

console.log('\n=== Final Results ===');
tables.forEach(t => {
  console.log(`\nTable: ${t.schema}.${t.tableName}`);
  console.log('Constraints:', t.constraints);
});
