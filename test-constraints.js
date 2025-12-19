// Test constraint parsing with the sample DDL

const fs = require('fs');

// Sample SQL with all constraint types
const testSQL = `
CREATE TABLE "SCHEMA_NAME"."SAMPLE_TABLE_STANDARD"
(	COLUMN_01_CHAR CHAR(8 BYTE),
	COLUMN_02_VARCHAR VARCHAR2(50 BYTE),
	COLUMN_03_DATE DATE,
	COLUMN_04_NUMBER NUMBER(16,0),
	COLUMN_05_DECIMAL NUMBER(5,2),
	COLUMN_06_DEFAULT CHAR(1 BYTE) DEFAULT 'N'
) SEGMENT CREATION IMMEDIATE
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255
NOCOMPRESS LOGGING
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
TABLESPACE "TABLESPACE_NAME" ;

CREATE UNIQUE INDEX "SCHEMA_NAME"."PK_SAMPLE_INDEX_PATTERN" ON "SCHEMA_NAME"."SAMPLE_TABLE_STANDARD" ("COLUMN_01_CHAR", "COLUMN_02_VARCHAR")
PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
TABLESPACE "TABLESPACE_NAME" ;

ALTER TABLE "SCHEMA_NAME"."SAMPLE_TABLE_STANDARD" MODIFY ("COLUMN_01_CHAR" NOT NULL ENABLE);
ALTER TABLE "SCHEMA_NAME"."SAMPLE_TABLE_STANDARD" MODIFY ("COLUMN_02_VARCHAR" NOT NULL ENABLE);
ALTER TABLE "SCHEMA_NAME"."SAMPLE_TABLE_STANDARD" ADD CONSTRAINT "PK_SAMPLE_INDEX_PATTERN" PRIMARY KEY ("COLUMN_01_CHAR", "COLUMN_02_VARCHAR")
USING INDEX "SCHEMA_NAME"."PK_SAMPLE_INDEX_PATTERN"  ENABLE;

CREATE TABLE "SCHEMA_NAME"."SAMPLE_TABLE_WITH_LOB"
(	KEY_COLUMN NUMBER(4,0),
	DATE_COLUMN DATE,
	TEXT_COLUMN VARCHAR2(50 BYTE),
	BLOB_COLUMN_A BLOB,
	BLOB_COLUMN_B BLOB
) SEGMENT CREATION IMMEDIATE
PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255
NOCOMPRESS LOGGING
STORAGE(INITIAL 1048576 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1
BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
TABLESPACE "TABLESPACE_NAME";

ALTER TABLE "SCHEMA_NAME"."SAMPLE_TABLE_WITH_LOB" ADD CONSTRAINT "FK_SAMPLE_REF" FOREIGN KEY ("KEY_COLUMN")
	REFERENCES "SCHEMA_NAME"."SAMPLE_TABLE_STANDARD" ("COLUMN_04_NUMBER") ENABLE;
`;

console.log('Testing Oracle Constraint Parsing\n');
console.log('=' .repeat(60));

// Clean SQL
const cleanSql = testSQL.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

// Test CREATE INDEX
console.log('\n1. Testing CREATE INDEX extraction:');
const createIndexRegex = /CREATE\s+(?:(UNIQUE)\s+)?INDEX\s+(?:["`]?\w+["`]?\.)?["`]?(\w+)["`]?\s+ON\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s*\(([^)]+)\)[^;]*;?/gi;
let match;
let indexCount = 0;

while ((match = createIndexRegex.exec(cleanSql)) !== null) {
    indexCount++;
    console.log(`  Index ${indexCount}:`);
    console.log(`    Name: ${match[2]}`);
    console.log(`    Type: ${match[1] ? 'UNIQUE' : 'REGULAR'}`);
    console.log(`    Schema: ${match[3] || 'SYSTEM'}`);
    console.log(`    Table: ${match[4]}`);
    console.log(`    Columns: ${match[5]}`);
}
console.log(`  Total indexes found: ${indexCount}`);

// Test ALTER TABLE PRIMARY KEY
console.log('\n2. Testing ALTER TABLE PRIMARY KEY extraction:');
const alterPkRegex = /ALTER\s+TABLE\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s+ADD\s+(?:CONSTRAINT\s+["`]?(\w+)["`]?\s+)?PRIMARY\s+KEY\s*\(([^)]+)\)/gi;
let pkCount = 0;

createIndexRegex.lastIndex = 0; // Reset
while ((match = alterPkRegex.exec(cleanSql)) !== null) {
    pkCount++;
    console.log(`  PK ${pkCount}:`);
    console.log(`    Schema: ${match[1] || 'SYSTEM'}`);
    console.log(`    Table: ${match[2]}`);
    console.log(`    Constraint Name: ${match[3] || '(unnamed)'}`);
    console.log(`    Columns: ${match[4]}`);
}
console.log(`  Total PKs found: ${pkCount}`);

// Test ALTER TABLE FOREIGN KEY
console.log('\n3. Testing ALTER TABLE FOREIGN KEY extraction:');
const alterFkRegex = /ALTER\s+TABLE\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s+ADD\s+(?:CONSTRAINT\s+["`]?(\w+)["`]?\s+)?FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s*\(([^)]+)\)(?:\s+(?:ENABLE|DISABLE|NOT\s+DEFERRABLE|DEFERRABLE|INITIALLY\s+(?:IMMEDIATE|DEFERRED)|VALIDATE|NOVALIDATE|ON\s+DELETE\s+(?:CASCADE|SET\s+NULL)))*\s*;?/gi;
let fkCount = 0;

while ((match = alterFkRegex.exec(cleanSql)) !== null) {
    fkCount++;
    console.log(`  FK ${fkCount}:`);
    console.log(`    Schema: ${match[1] || 'SYSTEM'}`);
    console.log(`    Table: ${match[2]}`);
    console.log(`    Constraint Name: ${match[3] || '(unnamed)'}`);
    console.log(`    Local Columns: ${match[4]}`);
    console.log(`    Ref Schema: ${match[5] || 'SYSTEM'}`);
    console.log(`    Ref Table: ${match[6]}`);
    console.log(`    Ref Columns: ${match[7]}`);
}
console.log(`  Total FKs found: ${fkCount}`);

// Test ALTER TABLE MODIFY for NOT NULL
console.log('\n4. Testing ALTER TABLE MODIFY (NOT NULL):');
const alterModifyRegex = /ALTER\s+TABLE\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s+MODIFY\s*\(\s*["`]?(\w+)["`]?\s+NOT\s+NULL/gi;
let notNullCount = 0;

while ((match = alterModifyRegex.exec(cleanSql)) !== null) {
    notNullCount++;
    console.log(`  NOT NULL ${notNullCount}:`);
    console.log(`    Schema: ${match[1] || 'SYSTEM'}`);
    console.log(`    Table: ${match[2]}`);
    console.log(`    Column: ${match[3]}`);
}
console.log(`  Total NOT NULL constraints found: ${notNullCount}`);

console.log('\n' + '='.repeat(60));
console.log('\nSummary:');
console.log(`  - Tables: Should find 2 (SAMPLE_TABLE_STANDARD, SAMPLE_TABLE_WITH_LOB)`);
console.log(`  - Indexes: Found ${indexCount} (Expected: 1 - PK_SAMPLE_INDEX_PATTERN)`);
console.log(`  - Primary Keys: Found ${pkCount} (Expected: 1)`);
console.log(`  - Foreign Keys: Found ${fkCount} (Expected: 1 - FK_SAMPLE_REF)`);
console.log(`  - NOT NULL Constraints: Found ${notNullCount} (Expected: 2)`);

if (indexCount === 1 && pkCount === 1 && fkCount === 1 && notNullCount === 2) {
    console.log('\n✅ All constraints parsed correctly!');
} else {
    console.log('\n⚠️ Some constraints may be missing');
}
