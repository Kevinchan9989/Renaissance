const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Get the project root directory (for default backups path)
const PROJECT_ROOT = path.join(__dirname, '..');

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
      webSecurity: true,
      preload: path.join(__dirname, 'preload.cjs')
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

// ============================================
// IPC Handlers for Git Sync
// ============================================

// Save workspace to a custom path
ipcMain.handle('save-workspace-to-path', async (event, filePath, data) => {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    logInfo('Workspace saved to custom path', { path: filePath });

    return { success: true, path: filePath };
  } catch (error) {
    logError('Failed to save workspace to path', { path: filePath, error: error.message });
    return { success: false, error: error.message };
  }
});

// Load workspace from a custom path
ipcMain.handle('load-workspace-from-path', async (event, filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      return { success: false, error: 'File not found' };
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    logInfo('Workspace loaded from custom path', { path: filePath });

    return { success: true, data };
  } catch (error) {
    logError('Failed to load workspace from path', { path: filePath, error: error.message });
    return { success: false, error: error.message };
  }
});

// Select folder dialog
ipcMain.handle('select-folder', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory', 'createDirectory'],
      title: 'Select Git Sync Folder',
      buttonLabel: 'Select Folder'
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, canceled: true };
    }

    return { success: true, path: result.filePaths[0] };
  } catch (error) {
    logError('Failed to show folder dialog', { error: error.message });
    return { success: false, error: error.message };
  }
});

// Select file dialog
ipcMain.handle('select-file', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      title: 'Select Workspace File',
      buttonLabel: 'Select File',
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, canceled: true };
    }

    return { success: true, path: result.filePaths[0] };
  } catch (error) {
    logError('Failed to show file dialog', { error: error.message });
    return { success: false, error: error.message };
  }
});

// Check if path exists
ipcMain.handle('path-exists', async (event, filePath) => {
  try {
    const exists = fs.existsSync(filePath);
    return { success: true, exists };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get default backups path (Renaissance/backups/)
ipcMain.handle('get-default-backups-path', async () => {
  try {
    // Go up from dm-tool to Renaissance, then to backups
    const backupsPath = path.join(PROJECT_ROOT, '..', 'backups');
    const normalizedPath = path.normalize(backupsPath);

    // Ensure it exists
    if (!fs.existsSync(normalizedPath)) {
      fs.mkdirSync(normalizedPath, { recursive: true });
    }

    return { success: true, path: normalizedPath };
  } catch (error) {
    logError('Failed to get default backups path', { error: error.message });
    return { success: false, error: error.message };
  }
});

// Legacy handlers for compatibility
ipcMain.handle('save-workspace', async (event, data) => {
  // Default save location in app data
  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, 'workspace.json');
  return ipcMain.emit('save-workspace-to-path', event, filePath, data);
});

ipcMain.handle('load-workspace', async () => {
  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, 'workspace.json');

  if (!fs.existsSync(filePath)) {
    return { success: false, error: 'No workspace file found' };
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return { success: true, data: JSON.parse(content) };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-data-directory', async () => {
  return { success: true, path: app.getPath('userData') };
});

logInfo('IPC handlers registered');
