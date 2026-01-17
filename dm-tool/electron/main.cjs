const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

// ============================================
// File-based logging for debugging
// ============================================
const LOG_DIR = path.join(__dirname, '../backups/logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

// Ensure log directory exists
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function writeLog(level, message, data = null) {
  const timestamp = new Date().toISOString();
  let logLine = `[${timestamp}] [${level}] ${message}`;
  if (data) {
    logLine += '\n' + JSON.stringify(data, null, 2);
  }
  logLine += '\n';

  // Append to log file
  fs.appendFileSync(LOG_FILE, logLine);

  // Also log to console
  console.log(logLine);
}

function logInfo(message, data = null) {
  writeLog('INFO', message, data);
}

function logError(message, data = null) {
  writeLog('ERROR', message, data);
}

function logWarn(message, data = null) {
  writeLog('WARN', message, data);
}

// Clear old logs on startup (keep last 1000 lines)
function trimLogFile() {
  try {
    if (fs.existsSync(LOG_FILE)) {
      const content = fs.readFileSync(LOG_FILE, 'utf-8');
      const lines = content.split('\n');
      if (lines.length > 1000) {
        const trimmed = lines.slice(-1000).join('\n');
        fs.writeFileSync(LOG_FILE, trimmed);
        logInfo('Log file trimmed to last 1000 lines');
      }
    }
  } catch (e) {
    console.error('Failed to trim log file:', e);
  }
}

trimLogFile();
logInfo('=== Application Starting ===');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    title: 'Renaissance DM Tool',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    },
    show: false,
    backgroundColor: '#f4f4f9'
  });

  // Remove default menu for cleaner look
  Menu.setApplicationMenu(null);

  // Load the app
  const isDev = !app.isPackaged;
  logInfo('App mode: ' + (isDev ? 'development' : 'production'));

  if (isDev) {
    // Development: load from Vite dev server
    mainWindow.loadURL('http://localhost:3000').catch(err => {
      logError('Failed to load URL', { error: err.message });
    });
    // Open DevTools in development
    // mainWindow.webContents.openDevTools();
  } else {
    // Production: load from built files
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Log loading errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    logError('Failed to load page', { errorCode, errorDescription });
  });

  // Log renderer crashes
  mainWindow.webContents.on('crashed', (event, killed) => {
    logError('Renderer process crashed', { killed });
  });

  // Log console messages from renderer
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    if (level >= 2) { // Only log warnings and errors
      const levelName = level === 2 ? 'WARN' : 'ERROR';
      writeLog(`RENDERER-${levelName}`, message, { line, sourceId });
    }
  });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create window when app is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create window on macOS when dock icon is clicked
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle any errors
process.on('uncaughtException', (error) => {
  logError('Uncaught Exception', {
    message: error.message,
    stack: error.stack
  });
});

process.on('unhandledRejection', (reason, promise) => {
  logError('Unhandled Promise Rejection', {
    reason: reason?.toString?.() || reason
  });
});

// Log when app is quitting
app.on('before-quit', () => {
  logInfo('=== Application Quitting ===');
});
