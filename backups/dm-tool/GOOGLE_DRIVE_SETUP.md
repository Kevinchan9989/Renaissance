# Google Drive Backup Setup Guide

This guide explains how to set up Google Drive integration for automatic cloud backups.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

## Step 2: Enable Google Drive API

1. In your Google Cloud project, go to **APIs & Services** > **Library**
2. Search for "Google Drive API"
3. Click **Enable**

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - User Type: **External** (for personal use) or **Internal** (for organization)
   - App name: `Renaissance Data Migration Tool`
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add `https://www.googleapis.com/auth/drive.file` (access to files created by the app)
   - Test users: Add your email if using External type
   - Save and continue

4. Create OAuth client ID:
   - Application type: **Web application**
   - Name: `Renaissance DM Tool - Desktop`
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:3001`
     - `http://localhost:3002`
     - `http://localhost:3003`
     - `http://localhost:3004`
     - `http://localhost:3005`
   - Authorized redirect URIs:
     - `http://localhost:3000/oauth/callback`
     - `http://localhost:3001/oauth/callback`
     - `http://localhost:3002/oauth/callback`
     - `http://localhost:3003/oauth/callback`
     - `http://localhost:3004/oauth/callback`
     - `http://localhost:3005/oauth/callback`
   - Click **Create**

5. Download the credentials:
   - You'll see a dialog with your **Client ID** and **Client Secret**
   - Copy these values

## Step 4: Configure the Application

1. Open the file: `dm-tool/src/config/googleDrive.config.ts` (create if doesn't exist)

2. Add your credentials:

```typescript
export const GOOGLE_DRIVE_CONFIG = {
  clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: window.location.origin + '/oauth/callback',
};
```

3. Replace `YOUR_CLIENT_ID` and `YOUR_CLIENT_SECRET` with the values from Step 3

## Step 5: Update BackupSettings Component

1. Open `dm-tool/src/components/BackupSettings.tsx`

2. Replace the placeholder config:

```typescript
// Replace this:
const googleDriveConfig = {
  clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
  clientSecret: 'YOUR_CLIENT_SECRET',
  redirectUri: window.location.origin + '/oauth/callback',
};

// With this:
import { GOOGLE_DRIVE_CONFIG } from '../config/googleDrive.config';

const googleDriveConfig = GOOGLE_DRIVE_CONFIG;
```

## Step 6: Test the Integration

1. Start the application
2. Navigate to **Backup & Sync** tab
3. Click **Connect Google Drive**
4. You should be redirected to Google's OAuth consent screen
5. Grant the required permissions
6. You'll be redirected back to the application
7. The status should show "Connected"

## Security Notes

⚠️ **IMPORTANT**: Never commit your `googleDrive.config.ts` file to version control!

Add to `.gitignore`:
```
src/config/googleDrive.config.ts
```

## Scopes Required

The application requires the following OAuth scope:
- `https://www.googleapis.com/auth/drive.file` - Access to files created by this app only

This is a restricted scope that only allows the app to:
- Create its own backup folder
- Upload backup files
- Download/delete backup files created by the app
- **Cannot** access any other files in your Google Drive

## Troubleshooting

### Error: "Access blocked: This app's request is invalid"
- Make sure you've enabled the Google Drive API
- Verify your OAuth consent screen is configured correctly
- Check that the redirect URI matches exactly

### Error: "redirect_uri_mismatch"
- Verify the redirect URI in Google Cloud Console matches your app's URL
- Make sure to include the correct port number
- Check for trailing slashes (should not have one)

### Error: "invalid_client"
- Double-check your Client ID and Client Secret
- Ensure there are no extra spaces or quotes

### Authentication works but uploads fail
- Verify the Google Drive API is enabled
- Check browser console for detailed error messages
- Ensure you granted the `drive.file` scope

## Alternative: Environment Variables

For Electron builds, you can use environment variables:

1. Create `.env` file:
```
VITE_GOOGLE_CLIENT_ID=your_client_id
VITE_GOOGLE_CLIENT_SECRET=your_client_secret
```

2. Update `googleDrive.config.ts`:
```typescript
export const GOOGLE_DRIVE_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET,
  redirectUri: window.location.origin + '/oauth/callback',
};
```

3. Add `.env` to `.gitignore`

## Production Deployment

For production builds:
1. Update redirect URIs to your production domain
2. Update authorized JavaScript origins
3. Publish your OAuth consent screen (if External type)
4. Consider using environment-specific configurations
