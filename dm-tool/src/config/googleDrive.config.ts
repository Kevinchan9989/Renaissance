/**
 * Google Drive OAuth Configuration
 *
 * PLACEHOLDER CONFIG - Google Drive sync is disabled by default
 *
 * To enable Google Drive sync:
 * 1. Follow the setup guide in GOOGLE_DRIVE_SETUP.md
 * 2. Replace the values below with your actual OAuth credentials from Google Cloud Console
 *
 * IMPORTANT: Never commit your actual credentials to version control!
 */

export const GOOGLE_DRIVE_CONFIG = {
  // Your OAuth 2.0 Client ID from Google Cloud Console
  clientId: '94218082947-konn8elq0vbki8qfdjoftt3nkbqm4b00.apps.googleusercontent.com',

  // Your OAuth 2.0 Client Secret from Google Cloud Console
  clientSecret: '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',

  // Redirect URI (automatically set to current origin + /oauth/callback)
  redirectUri: typeof window !== 'undefined'
    ? window.location.origin + '/oauth/callback'
    : 'http://localhost:3000/oauth/callback',
};

// Check if config is properly set up
export const isGoogleDriveConfigured = () => {
  return (
    GOOGLE_DRIVE_CONFIG.clientId !== 'YOUR_CLIENT_ID.apps.googleusercontent.com' &&
    GOOGLE_DRIVE_CONFIG.clientSecret !== 'YOUR_CLIENT_SECRET'
  );
};
