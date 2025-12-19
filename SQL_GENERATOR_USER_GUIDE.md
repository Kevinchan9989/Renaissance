# SQL Alignment Generator - User Guide

## Overview
The SQL Alignment Generator creates ALTER TABLE scripts to synchronize schema differences between your source and target databases based on your column mappings.

## How to Access

### Step 1: Navigate to Data Mapping
1. Open the Renaissance DM Tool at **http://localhost:3002/**
2. Click on **"Data Mapping"** from the main navigation menu

### Step 2: Create Column Mappings
1. Select your **Source Schema** and **Source Table** from the dropdowns
2. Select your **Target Schema** and **Target Table** from the dropdowns
3. Create column mappings by:
   - **Click-to-map**: Click a source column, then click the target column
   - **Drag-to-map**: Drag from source column to target column
4. Verify your mappings in the canvas view

### Step 3: Open Linkage Table
1. Click on the **"Linkage Table"** tab at the top of the mapping area
2. You should see all your column mappings in a table format with:
   - Source Column, Type, Nullable
   - Target Column, Type, Nullable
   - Validation status

### Step 4: Access SQL Generator
1. Click the **"Generate SQL"** button in the top-right corner of the Linkage Table
   - Note: This button is only enabled when you have at least one mapping
2. A modal dialog will open with the SQL Generator

## Using the SQL Generator

### Alignment Direction

Choose which schema to modify:

- **Align Target to Source**:
  - Modifies the **target schema** to match the source
  - Use when you want the target database to conform to source specifications
  - Example: Source is the new design, target is the legacy database

- **Align Source to Target**:
  - Modifies the **source schema** to match the target
  - Use when you want the source database to conform to target specifications
  - Example: Target is the production standard, source is the development schema

### Include Options

Select which changes to include in the generated SQL:

- **✓ Nullable**: Include ALTER statements to align NULL/NOT NULL constraints
  - Example: If source column is NOT NULL but target is NULL, generates statement to add NOT NULL

- **✓ Data Type (with auto-mapping)**: Include ALTER statements to align data types
  - Automatically maps types between database platforms
  - Example mappings:
    - Oracle → PostgreSQL: `VARCHAR2(100)` → `VARCHAR(100)`
    - Oracle → PostgreSQL: `NUMBER(10,0)` → `INTEGER`
    - PostgreSQL → Oracle: `TEXT` → `CLOB`
    - PostgreSQL → Oracle: `INTEGER` → `NUMBER`

### Generate and Export SQL

1. **Click "Generate"** button to create the SQL script
   - The script appears in the text area below
   - Includes header with metadata (direction, schemas, timestamp, options)

2. **Copy to Clipboard**: Click the "Copy" button to copy SQL to clipboard

3. **Download as File**: Click the "Download" button to save as `.sql` file
   - Filename format: `alignment_[direction]_[date].sql`
   - Example: `alignment_toSource_2025-12-17.sql`

## Example Workflow

### Scenario: Migrating Oracle to PostgreSQL

1. **Create mappings** between Oracle (source) and PostgreSQL (target) schemas
2. Open **Linkage Table** tab
3. Click **Generate SQL** button
4. Select **"Align Target to Source"** (modify PostgreSQL to match Oracle)
5. Check both **Nullable** and **Data Type** options
6. Click **Generate**
7. Review the generated SQL:

```sql
-- SQL Alignment Script
-- Direction: Align target to source
-- Modifying: PostgreSQL_Schema
-- Reference: Oracle_Schema
-- Generated: 2025-12-17T10:30:00.000Z
-- Options: Nullable Datatype

ALTER TABLE customers
  ALTER COLUMN customer_id TYPE INTEGER,
  ALTER COLUMN customer_name TYPE VARCHAR(100),
  ALTER COLUMN email DROP NOT NULL;

ALTER TABLE orders
  ALTER COLUMN order_date TYPE TIMESTAMP,
  ALTER COLUMN total_amount TYPE DECIMAL(10,2);
```

8. **Copy** or **Download** the SQL
9. Review and execute in your database

## Supported Datatype Mappings

### Oracle → PostgreSQL
| Oracle Type | PostgreSQL Type |
|-------------|----------------|
| VARCHAR2(n) | VARCHAR(n) |
| NUMBER(p,0) | INTEGER |
| NUMBER(p,s) | DECIMAL(p,s) |
| NUMBER | NUMERIC |
| DATE | TIMESTAMP |
| CLOB | TEXT |
| BLOB | BYTEA |
| CHAR(n) | CHAR(n) |

### PostgreSQL → Oracle
| PostgreSQL Type | Oracle Type |
|----------------|-------------|
| VARCHAR(n) | VARCHAR2(n) |
| TEXT | CLOB |
| INTEGER | NUMBER |
| BIGINT | NUMBER |
| DECIMAL(p,s) | NUMBER(p,s) |
| TIMESTAMP | TIMESTAMP |
| BYTEA | BLOB |
| BOOLEAN | NUMBER(1,0) |

## Tips

- **Review before execution**: Always review the generated SQL before running it on your database
- **Test in dev first**: Test the alignment scripts in a development environment
- **Backup data**: Take database backups before making schema changes
- **Check constraints**: The generator focuses on nullability and datatypes; review other constraints separately
- **Multiple tables**: If you have mappings across multiple tables, the SQL will group changes by table
- **Cross-schema mappings**: Works with mappings between different schemas

## Troubleshooting

**Q: Generate SQL button is disabled**
- A: You need to create at least one column mapping first

**Q: No SQL generated / Shows "No alignment changes needed"**
- A: The source and target columns already match for the selected options (nullable/datatype)

**Q: Datatype not mapping correctly**
- A: The tool uses predefined mapping rules. For custom types, you may need to manually adjust the generated SQL

**Q: Want to align only specific columns**
- A: Currently generates SQL for all mappings. Filter the generated SQL manually or create separate mapping projects

## Future Enhancements

Potential future features:
- Custom datatype mapping rules
- Constraint alignment (CHECK, DEFAULT values)
- Index synchronization
- Selective column/table filtering
- Dry-run validation against actual databases
