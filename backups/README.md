# Workspace Backups

This directory contains exported workspace backups from the DM Tool application.

## How to Create a Backup

1. Open the DM Tool application
2. Click the **Settings** icon (gear icon) in the top right
3. Navigate to the **Workspace** tab
4. Click **Export Workspace** button
5. Save the file to this `backups/` directory with a descriptive name like:
   - `workspace-YYYY-MM-DD.json`
   - `workspace-before-migration.json`
   - `workspace-production-snapshot.json`

## What's Included in a Backup

Each workspace export includes:
- **Scripts**: All your SQL DDL scripts and their parsed table structures
- **Mapping Projects**: All column mappings between source and target databases
- **Type Rule Sets**: Custom data type transformation rules
- **Theme Settings**: Your UI theme preferences
- **ERD Positions**: Saved positions of tables in ERD diagrams

## Restoring from Backup

1. Open the DM Tool application
2. Click the **Settings** icon
3. Navigate to the **Workspace** tab
4. Click **Import Workspace** button
5. Select the backup JSON file
6. Confirm the import

## Git Tracking

Workspace backups should be committed to git regularly to:
- Track changes to your data mapping work
- Collaborate with team members
- Maintain version history
- Enable rollback if needed

**Recommended**: Create a backup before major changes or at the end of each work session.
