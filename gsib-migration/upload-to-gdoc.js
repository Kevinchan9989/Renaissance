/**
 * Upload gsib-migration files into Google Docs with TABS.
 *
 * Creates TWO Google Docs:
 *   1. "Renaissance - Design Specs"    → 9 tabs (design JSONs, ~400KB total)
 *   2. "Renaissance - Workspace Data"  → 17 tabs (workspace meta + per-script data, ~5.5MB)
 *
 * SETUP (one-time):
 *   1. Go to https://console.cloud.google.com/apis/credentials
 *   2. Create project (or use existing) → Enable "Google Docs API" + "Google Drive API"
 *   3. Create OAuth 2.0 Client ID → type "Desktop app"
 *   4. Copy Client ID + Client Secret below
 *   5. npm install googleapis
 *   6. First run:  node slim-workspace.js     (creates workspace/ folder)
 *   7. Then run:   node upload-to-gdoc.js     (uploads to Google Docs)
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const http = require('http');

// =============================================
// FILL IN YOUR OAUTH CREDENTIALS HERE
// =============================================
const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';

// =============================================
// CONFIG
// =============================================
const REDIRECT_URI = 'http://localhost:8844/oauth2callback';
const BASE_DIR = __dirname;
const WORKSPACE_DIR = path.join(__dirname, 'workspace');
const SCOPES = [
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/drive.file',
];

// =============================================
// OAuth2 - browser consent flow
// =============================================
function authenticate() {
  return new Promise((resolve, reject) => {
    const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
    const authUrl = oauth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });

    const server = http.createServer(async (req, res) => {
      try {
        const url = new URL(req.url, 'http://localhost:8844');
        if (url.pathname !== '/oauth2callback') return;
        const code = url.searchParams.get('code');
        if (!code) { res.end('No code received.'); return; }
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        res.end('Authenticated! You can close this tab.');
        server.close();
        resolve(oauth2Client);
      } catch (err) {
        res.end('Auth failed: ' + err.message);
        reject(err);
      }
    });

    server.listen(8844, () => {
      console.log('\n=== GOOGLE DOCS UPLOAD ===');
      console.log('Opening browser for sign-in...\n');
      console.log('If browser does not open, copy this URL:\n');
      console.log(authUrl + '\n');
      const cmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
      require('child_process').exec(`${cmd} "" "${authUrl}"`);
    });
  });
}

// =============================================
// Create a Google Doc with multiple tabs
// =============================================
async function createDocWithTabs(docs, title, fileList) {
  // Create doc
  console.log(`\nCreating: "${title}"`);
  const createResp = await docs.documents.create({ requestBody: { title } });
  const docId = createResp.data.documentId;
  console.log(`  URL: https://docs.google.com/document/d/${docId}/edit`);

  // Get default tab ID
  const docData = await docs.documents.get({ documentId: docId, includeTabsContent: true });
  const defaultTabId = docData.data.tabs[0].tabProperties.tabId;

  for (let i = 0; i < fileList.length; i++) {
    const { tabName, content } = fileList[i];
    const displaySize = (Buffer.byteLength(content, 'utf-8') / 1024).toFixed(1);

    console.log(`  [${i + 1}/${fileList.length}] "${tabName}" (${displaySize} KB)`);

    if (i === 0) {
      // Use default tab for first file
      await docs.documents.batchUpdate({
        documentId: docId,
        requestBody: {
          requests: [
            {
              updateDocumentTab: {
                tabProperties: { tabId: defaultTabId, title: tabName },
                fields: 'title',
              },
            },
            {
              insertText: {
                location: { index: 1, tabId: defaultTabId },
                text: content,
              },
            },
            {
              updateTextStyle: {
                range: { startIndex: 1, endIndex: content.length + 1, tabId: defaultTabId },
                textStyle: {
                  weightedFontFamily: { fontFamily: 'Courier New' },
                  fontSize: { magnitude: 7, unit: 'PT' },
                },
                fields: 'weightedFontFamily,fontSize',
              },
            },
          ],
        },
      });
    } else {
      // Create new tab
      const tabResp = await docs.documents.batchUpdate({
        documentId: docId,
        requestBody: { requests: [{ createDocumentTab: { newPosition: { index: i } } }] },
      });
      const newTabId = tabResp.data.replies[0].createDocumentTab.tabId;

      // Rename + insert content + set font
      await docs.documents.batchUpdate({
        documentId: docId,
        requestBody: {
          requests: [
            {
              updateDocumentTab: {
                tabProperties: { tabId: newTabId, title: tabName },
                fields: 'title',
              },
            },
            {
              insertText: {
                location: { index: 1, tabId: newTabId },
                text: content,
              },
            },
            {
              updateTextStyle: {
                range: { startIndex: 1, endIndex: content.length + 1, tabId: newTabId },
                textStyle: {
                  weightedFontFamily: { fontFamily: 'Courier New' },
                  fontSize: { magnitude: 7, unit: 'PT' },
                },
                fields: 'weightedFontFamily,fontSize',
              },
            },
          ],
        },
      });
    }

    // Rate-limit protection
    await sleep(300);
  }

  return docId;
}

// =============================================
// Main
// =============================================
async function main() {
  // Check workspace/ exists
  if (!fs.existsSync(WORKSPACE_DIR)) {
    console.error('ERROR: workspace/ folder not found. Run "node slim-workspace.js" first.');
    process.exit(1);
  }

  const auth = await authenticate();
  const docs = google.docs({ version: 'v1', auth });

  // --- DOC 1: Design Specs ---
  const designFiles = fs.readdirSync(BASE_DIR)
    .filter(f => f.endsWith('.json'))
    .sort()
    .map(f => ({
      tabName: f.replace('.json', ''),
      content: formatJson(fs.readFileSync(path.join(BASE_DIR, f), 'utf-8')),
    }));

  const doc1Id = await createDocWithTabs(docs, 'Renaissance - Design Specs', designFiles);

  // --- DOC 2: Workspace Data ---
  const workspaceFiles = fs.readdirSync(WORKSPACE_DIR)
    .filter(f => f.endsWith('.json') && f !== 'workspace-slim.json') // skip combined (too big for one tab)
    .sort()
    .map(f => ({
      tabName: f.replace('.json', ''),
      content: formatJson(fs.readFileSync(path.join(WORKSPACE_DIR, f), 'utf-8')),
    }));

  const doc2Id = await createDocWithTabs(docs, 'Renaissance - Workspace Data', workspaceFiles);

  console.log('\n========================================');
  console.log('ALL DONE!');
  console.log('========================================');
  console.log(`Design Specs:   https://docs.google.com/document/d/${doc1Id}/edit`);
  console.log(`Workspace Data: https://docs.google.com/document/d/${doc2Id}/edit`);
  console.log(`\nDesign tabs:    ${designFiles.length}`);
  console.log(`Workspace tabs: ${workspaceFiles.length}`);
}

// =============================================
// Helpers
// =============================================
function formatJson(str) {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

main().catch(err => {
  console.error('\nError:', err.message);
  if (err.errors) err.errors.forEach(e => console.error('  -', e.message));
  process.exit(1);
});
