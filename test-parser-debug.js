// Debug the Oracle parser with the sample DDL

const sampleSQL = `
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
`;

// Clean SQL
const cleanSql = sampleSQL.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

// Find CREATE TABLE
const createRegex = /CREATE\s+TABLE\s+(?:["`]?(\w+)["`]?\.)?["`]?(\w+)["`]?\s*\(/gi;
const match = createRegex.exec(cleanSql);

if (match) {
    console.log('Match found!');
    console.log('Schema:', match[1]);
    console.log('Table:', match[2]);
    console.log('Match index:', match.index);
    console.log('Match[0] length:', match[0].length);

    // Manual parenthesis matching
    const startPos = match.index + match[0].length;
    let depth = 1;
    let endPos = startPos;

    console.log('\nStarting parenthesis matching from position:', startPos);
    console.log('Character at start:', cleanSql[startPos]);

    while (depth > 0 && endPos < cleanSql.length) {
        if (cleanSql[endPos] === '(') {
            depth++;
            console.log(`Position ${endPos}: '(' depth=${depth}`);
        }
        else if (cleanSql[endPos] === ')') {
            depth--;
            console.log(`Position ${endPos}: ')' depth=${depth}`);
        }
        endPos++;

        if (endPos > startPos + 500) {
            console.log('Breaking at 500 chars to avoid infinite loop');
            break;
        }
    }

    const body = cleanSql.substring(startPos, endPos - 1);
    console.log('\nExtracted body length:', body.length);
    console.log('Body content:\n', body);

    // Split by comma
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

    const lines = splitSqlParams(body);
    console.log('\nSplit into', lines.length, 'parts');
    lines.forEach((line, i) => {
        console.log(`Line ${i + 1}:`, line.trim().substring(0, 100));
    });
} else {
    console.log('NO MATCH!');
}
