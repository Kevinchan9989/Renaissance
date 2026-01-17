# Backup & Sync Features

The Renaissance Data Migration Tool includes a comprehensive backup and sync system to protect your data and enable collaboration.

## Overview

The backup system provides two complementary approaches:

1. **Local File System Backups** - Automatic and manual backups stored on your computer
2. **Google Drive Sync** - Cloud backups synced to your Google Drive (requires setup)

Both backup methods can be used independently or together for maximum data protection.

## Features

### Local Backups

✅ **Automatic Periodic Backups**
- Configurable interval (5-1440 minutes, default: 15 minutes)
- Runs in the background while you work
- Stores backups in your user data directory

✅ **Manual Backup Controls**
- "Backup Now" button for on-demand backups
- Export to custom file location
- Import from backup file
- Open backup folder in file explorer

✅ **Smart Retention**
- Automatically cleans old backups
- Configurable retention count (keep last N backups)
- Prevents disk space buildup

✅ **Backup Management**
- View all local backups with timestamps and file sizes
- Restore from any backup with one click
- Confirmation dialogs prevent accidental data loss

### Google Drive Sync

✅ **Cloud Storage**
- Automatic sync to Google Drive
- Configurable sync interval (15-1440 minutes, default: 30 minutes)
- Access your backups from anywhere

✅ **Secure Authentication**
- OAuth 2.0 authentication
- Limited scope (only accesses files created by this app)
- Easy disconnect/reconnect

✅ **Backup Management**
- View all Drive backups with timestamps
- Download and restore from any backup
- Delete old backups individually
- Automatic cleanup of old backups

### Data Protection

🔒 **What Gets Backed Up**
- All SQL scripts (Oracle, PostgreSQL, DBML)
- All parsed schema data (tables, columns, constraints, indexes)
- All mapping projects and column mappings
- All transformation rules
- Project metadata

🔒 **What Doesn't Get Backed Up**
- Application settings (theme, UI preferences)
- ERD diagram positions (stored separately per script)
- Temporary files
- OAuth tokens

## Getting Started

### Local Backups (No Setup Required)

Local backups work immediately without any configuration:

1. Click on **Backup & Sync** tab in the sidebar
2. In the "Local Backup" section, configure your preferences:
   - **Enable automatic local backups**: Toggle on/off
   - **Backup Interval**: How often to create backups (minutes)
   - **Keep Last N Backups**: How many backups to retain
3. Click **Save Settings**

That's it! Your data is now being backed up automatically.

#### Manual Operations

- **Backup Now**: Create a backup immediately
- **Export to File**: Save a backup to a custom location (useful for sharing or archiving)
- **Import from File**: Restore data from a backup file
- **Open Backup Folder**: View all backup files in your file explorer

### Google Drive Sync (Requires Setup)

Google Drive sync requires OAuth credentials from Google Cloud Console. Follow these steps:

#### One-Time Setup

1. **Create Google Cloud Project**
   - See [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md) for detailed instructions
   - Enable Google Drive API
   - Create OAuth 2.0 credentials

2. **Configure Application**
   - Edit `src/config/googleDrive.config.ts`
   - Add your Client ID and Client Secret

3. **Connect Google Drive**
   - Go to **Backup & Sync** tab
   - Click **Connect Google Drive**
   - Authorize the application in your browser
   - Return to the app (automatic redirect)

#### Usage

Once connected:

1. **Enable automatic sync**:
   - Toggle "Enable automatic Google Drive sync"
   - Set sync interval (how often to upload)
   - Set retention count (how many backups to keep)
   - Click **Save Settings**

2. **Manual operations**:
   - **Sync Now**: Upload a backup immediately
   - **Restore**: Download and restore from any Drive backup
   - **Delete**: Remove individual backups from Drive
   - **Disconnect**: Logout from Google Drive

## Backup File Format

Backups are stored as JSON files with the following structure:

```json
{
  "version": "1.0",
  "exportDate": "2025-12-12T15:00:00.000Z",
  "scripts": [...],
  "mappingProjects": [...]
}
```

### Naming Convention

- **Local**: `backup_YYYY-MM-DD_HH-mm-ss.json`
- **Google Drive**: `Renaissance_DM_Backup_YYYY-MM-DD_HH-mm-ss.json`

## Storage Locations

### Local Backups

Backups are stored in your system's user data directory:

- **Windows**: `C:\Users\YourName\AppData\Roaming\renaissance-dm-tool\backups\`
- **macOS**: `~/Library/Application Support/renaissance-dm-tool/backups/`
- **Linux**: `~/.config/renaissance-dm-tool/backups/`

Use the "Open Backup Folder" button to navigate there directly.

### Google Drive Backups

Backups are stored in a dedicated folder in your Google Drive:

- **Folder Name**: `Renaissance DM Backups`
- **Location**: Root of "My Drive"
- **Access**: Only visible to this application (restricted scope)

## Restoring from Backup

### Local Restore

1. Go to **Backup & Sync** tab
2. In the "Local Backups" list, find the backup you want to restore
3. Click the **Restore** button next to it
4. Confirm the restore operation
5. Refresh the page to see restored data

### Google Drive Restore

1. Go to **Backup & Sync** tab
2. Make sure you're connected to Google Drive
3. In the "Google Drive Backups" list, find the backup you want to restore
4. Click the **Restore** button next to it
5. Confirm the restore operation
6. Refresh the page to see restored data

### Import from File

If you have a backup file from another source:

1. Click **Import from File**
2. Select the JSON backup file
3. Confirm the import operation
4. Refresh the page to see imported data

⚠️ **Warning**: Restoring or importing will replace ALL current data. Make sure to export your current data first if you want to keep it!

## Best Practices

### Recommended Settings

For typical use:
- **Local backups**: Enabled, 15-minute interval, keep last 10
- **Google Drive sync**: Enabled, 30-minute interval, keep last 10

For active development:
- **Local backups**: Enabled, 5-minute interval, keep last 20
- **Google Drive sync**: Enabled, 60-minute interval, keep last 5

For occasional use:
- **Local backups**: Enabled, 30-minute interval, keep last 5
- **Google Drive sync**: Optional

### Data Protection Strategy

1. **Enable local backups** - This provides fast, automatic protection
2. **Export important milestones** - Save major versions manually to a safe location
3. **Enable Google Drive sync** - This provides off-site backup and access from multiple machines
4. **Test restores periodically** - Verify that your backups are working correctly

### Disk Space Management

Each backup is typically 100KB - 2MB depending on the size of your data.

With default settings (10 local + 10 Drive backups), you'll use approximately 2-40MB of space.

To reduce disk usage:
- Decrease retention count (keep fewer backups)
- Increase backup interval (create backups less frequently)
- Manually delete old backups you no longer need

## Troubleshooting

### Local Backups Not Creating

**Issue**: No backups appearing in the list

**Solutions**:
1. Check that "Enable automatic local backups" is toggled on
2. Click "Save Settings" after making changes
3. Click "Backup Now" to create a manual backup
4. Check the browser console for error messages
5. Verify you have write permissions to the user data directory

### Google Drive Authentication Fails

**Issue**: "Google Drive authentication failed" error

**Solutions**:
1. Verify your OAuth credentials in `googleDrive.config.ts`
2. Check that Google Drive API is enabled in Google Cloud Console
3. Ensure redirect URI matches exactly (including port number)
4. Check browser console for detailed error messages
5. Try logging out and reconnecting
6. See [GOOGLE_DRIVE_SETUP.md](GOOGLE_DRIVE_SETUP.md) for detailed troubleshooting

### Cannot Restore Backup

**Issue**: Restore button doesn't work or shows error

**Solutions**:
1. Check that the backup file is valid JSON
2. Ensure you have permission to read the file
3. Try exporting current data first, then try restore
4. Check browser console for error messages
5. Try importing the file manually using "Import from File"

### Backups Taking Too Much Space

**Issue**: Too many backup files using disk space

**Solutions**:
1. Reduce "Keep Last N Backups" setting
2. Manually delete old backups from the list
3. Use "Open Backup Folder" and manually clean up
4. Increase backup interval to create fewer backups

## Security & Privacy

### Local Backups

- Stored in your user data directory
- Not encrypted (stored as plain JSON)
- Only accessible to your user account
- Not transmitted over the network

### Google Drive Backups

- Transmitted over HTTPS (encrypted in transit)
- Stored in your personal Google Drive
- Only accessible with your Google account credentials
- Uses restricted OAuth scope (app can only access its own files)
- Can be deleted at any time from Google Drive web interface

### Credentials

- OAuth tokens stored in browser localStorage
- Client Secret stored in source code (acceptable for desktop apps)
- Never commit actual credentials to version control
- Use `.gitignore` to protect `googleDrive.config.ts` if you add real credentials

## API Reference

### Backup Manager

The backup manager is available globally:

```typescript
import { backupManager } from './services/backupManager';

// Create backup
await backupManager.createLocalBackup();

// Sync to Drive
await backupManager.syncToGoogleDrive();

// List backups
const local = await backupManager.listLocalBackups();
const drive = await backupManager.listGoogleDriveBackups();

// Restore
const backup = await backupManager.getLatestLocalBackup();
await backupManager.restoreFromBackup(backup);
```

See [backupManager.ts](src/services/backupManager.ts) for full API documentation.

## Future Enhancements

Potential features for future versions:

- [ ] Backup encryption for sensitive data
- [ ] Backup compression to reduce file size
- [ ] Incremental backups (only changes)
- [ ] Backup scheduling (specific times)
- [ ] Email notifications on backup failures
- [ ] Dropbox/OneDrive integration
- [ ] Backup verification and integrity checks
- [ ] Automatic backup before major operations
- [ ] Backup comparison and diff view
- [ ] Team collaboration features
