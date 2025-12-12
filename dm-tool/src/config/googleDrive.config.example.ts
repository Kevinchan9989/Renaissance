/**
 * Google Drive OAuth Configuration
 *
 * To enable Google Drive sync:
 * 1. Copy this file to googleDrive.config.ts
 * 2. Follow the setup guide in GOOGLE_DRIVE_SETUP.md
 * 3. Replace the placeholder values with your actual OAuth credentials
 *
 * IMPORTANT: Never commit googleDrive.config.ts to version control!
 */

export const GOOGLE_DRIVE_CONFIG = {
  // Your OAuth 2.0 Client ID from Google Cloud Console
  clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',

  // Your OAuth 2.0 Client Secret from Google Cloud Console
  clientSecret: 'YOUR_CLIENT_SECRET',

  // Redirect URI (automatically set to current origin + /oauth/callback)
  redirectUri: typeof window !== 'undefined'
    ? window.location.origin + '/oauth/callback'
    : 'http://localhost:3000/oauth/callback',
};
