const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;

// SQLite layer (dark-launched — only invoked when the renderer flag
// dm_tool_use_sqlite_storage is ON, which defaults to OFF in this PR).
let dbModule = null;
let dbMigrationModule = null;
function getDbModule() {
  if (!dbModule) dbModule = require('./db.cjs');
  return dbModule;
}
function getDbMigrationModule() {
  if (!dbMigrationModule) dbMigrationModule = require('./dbMigration.cjs');
  return dbMigrationModule;
}

// Get the project root directory (for default backups path)
const PROJECT_ROOT = path.join(__dirname, '..');

// Single-instance lock: prevents two app instances from racing on the same
// userData (workspace.json, workspace-shards/, and the future workspace.db).
// Second invocations focus the existing window instead of opening a new one.
const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
  app.quit();
  process.exit(0);
}
app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

// ============================================
// Per-path write coalescing
// While a write is in flight, a second request marks the file dirty;
// when the first completes, the latest pending payload is flushed once.
// Prevents two parallel 40 MB writes from racing on the same file.
// ============================================
const writeQueue = new Map(); // filePath -> { inFlight: Promise, pending: { data, pretty } | null }

async function coalescedWriteJson(filePath, data, { pretty = false } = {}) {
  const dir = path.dirname(filePath);
  await fsp.mkdir(dir, { recursive: true });

  const json = pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  const tmp = filePath + '.tmp';

  const slot = writeQueue.get(filePath);
  if (slot && slot.inFlight) {
    slot.pending = { json };
    return slot.inFlight;
  }

  const flush = async (payload) => {
    await fsp.writeFile(tmp, payload, 'utf-8');
    await fsp.rename(tmp, filePath); // atomic on same filesystem
  };

  const newSlot = { inFlight: null, pending: null };
  writeQueue.set(filePath, newSlot);

  newSlot.inFlight = (async () => {
    try {
      let payload = json;
      while (true) {
        await flush(payload);
        const next = newSlot.pending;
        if (!next) break;
        newSlot.pending = null;
        payload = next.json;
      }
    } finally {
      writeQueue.delete(filePath);
    }
  })();

  return newSlot.inFlight;
}

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

  // Remove default menu for cleaner look. Keep DevTools reachable via
  // F12 / Ctrl+Shift+I via the BeforeInputEvent handler below.
  Menu.setApplicationMenu(null);

  // Allow F12 / Ctrl+Shift+I to toggle DevTools (the default menu shortcut
  // is gone after setApplicationMenu(null), so we wire it up manually).
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown') return;
    const isF12 = input.key === 'F12';
    const isCtrlShiftI = input.control && input.shift && (input.key === 'I' || input.key === 'i');
    if (isF12 || isCtrlShiftI) {
      mainWindow.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

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

// Save workspace to a custom path (git sync target — pretty-printed for diffability)
ipcMain.handle('save-workspace-to-path', async (event, filePath, data) => {
  try {
    await coalescedWriteJson(filePath, data, { pretty: true });
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
    let content;
    try {
      content = await fsp.readFile(filePath, 'utf-8');
    } catch (err) {
      if (err.code === 'ENOENT') return { success: false, error: 'File not found' };
      throw err;
    }
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

// Legacy auto-save handler — compact JSON (no pretty-print) for speed.
// 40 MB pretty-printed → ~30 MB compact (~25% smaller, ~40% faster to write).
ipcMain.handle('save-workspace', async (event, data) => {
  try {
    const userDataPath = app.getPath('userData');
    const filePath = path.join(userDataPath, 'workspace.json');
    await coalescedWriteJson(filePath, data, { pretty: false });
    return { success: true, path: filePath };
  } catch (error) {
    logError('Failed auto-save workspace', { error: error.message });
    return { success: false, error: error.message };
  }
});

ipcMain.handle('load-workspace', async () => {
  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, 'workspace.json');

  try {
    const content = await fsp.readFile(filePath, 'utf-8');
    return { success: true, data: JSON.parse(content) };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { success: false, error: 'No workspace file found' };
    }
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-data-directory', async () => {
  return { success: true, path: app.getPath('userData') };
});

// ============================================
// Backup pruning
// Renaissance/backups/ accumulated 230+ MB of full-workspace snapshots
// with no rotation. Policy: keep the N most recent always, plus retain
// at most one snapshot per calendar month for older files.
// Filenames matched: renaissance-workspace-YYYY-MM-DD.json
// `workspace.json` (current state) is never touched.
// ============================================
const BACKUP_FILE_RX = /^renaissance-workspace-(\d{4})-(\d{2})-(\d{2})\.json$/;

async function pruneBackupsDir(dir, { keepRecent = 5, dryRun = false } = {}) {
  let entries;
  try {
    entries = await fsp.readdir(dir);
  } catch (err) {
    if (err.code === 'ENOENT') return { kept: [], deleted: [], freedBytes: 0 };
    throw err;
  }

  const matched = [];
  for (const name of entries) {
    const m = name.match(BACKUP_FILE_RX);
    if (!m) continue;
    const full = path.join(dir, name);
    let stat;
    try { stat = await fsp.stat(full); } catch { continue; }
    if (!stat.isFile()) continue;
    matched.push({
      name, full, size: stat.size,
      // sort key from filename (more reliable than mtime)
      date: `${m[1]}-${m[2]}-${m[3]}`,
      monthKey: `${m[1]}-${m[2]}`,
    });
  }

  // Newest first
  matched.sort((a, b) => b.date.localeCompare(a.date));

  const keep = new Set();
  // Always keep the N most recent
  matched.slice(0, keepRecent).forEach(f => keep.add(f.name));
  // Plus one per month for the rest (the newest within that month)
  const seenMonths = new Set();
  for (const f of matched.slice(keepRecent)) {
    if (!seenMonths.has(f.monthKey)) {
      seenMonths.add(f.monthKey);
      keep.add(f.name);
    }
  }

  const kept = matched.filter(f => keep.has(f.name)).map(f => f.name);
  const toDelete = matched.filter(f => !keep.has(f.name));

  let freedBytes = 0;
  const deleted = [];
  for (const f of toDelete) {
    freedBytes += f.size;
    if (!dryRun) {
      try {
        await fsp.unlink(f.full);
        deleted.push(f.name);
      } catch (err) {
        logError('Backup prune: failed to delete', { file: f.name, error: err.message });
      }
    } else {
      deleted.push(f.name);
    }
  }

  return { kept, deleted, freedBytes };
}

ipcMain.handle('prune-backups', async (event, options = {}) => {
  try {
    const backupsPath = path.normalize(path.join(PROJECT_ROOT, '..', 'backups'));
    const result = await pruneBackupsDir(backupsPath, {
      keepRecent: typeof options.keepRecent === 'number' ? options.keepRecent : 5,
      dryRun: !!options.dryRun,
    });
    logInfo('Backup prune complete', {
      dir: backupsPath,
      keptCount: result.kept.length,
      deletedCount: result.deleted.length,
      freedMB: (result.freedBytes / 1024 / 1024).toFixed(1),
      dryRun: !!options.dryRun,
    });
    return { success: true, ...result };
  } catch (error) {
    logError('Backup prune failed', { error: error.message });
    return { success: false, error: error.message };
  }
});

// ============================================
// Sharded workspace storage
// Each script and flowchart is its own file. Saves only rewrite shards
// whose content actually changed (renderer-side ref-eq detection).
// `workspace.json` continues to exist as the canonical full snapshot
// (consolidated on a slower cadence and on quit) so existing tooling and
// backups still work unchanged.
// ============================================
function shardsRoot() {
  return path.join(app.getPath('userData'), 'workspace-shards');
}

function safeShardName(id) {
  // Filenames are ids generated by `${Date.now()}-${random}` so they are safe,
  // but defend against future changes that might allow path separators.
  return String(id).replace(/[^a-zA-Z0-9_.-]/g, '_');
}

async function readJsonIfExists(file) {
  try {
    const c = await fsp.readFile(file, 'utf-8');
    return JSON.parse(c);
  } catch (err) {
    if (err.code === 'ENOENT') return null;
    throw err;
  }
}

// Save changed shards. Payload shape:
// {
//   changedScripts: Script[],         // full objects, only the ones that changed
//   removedScriptIds: string[],
//   changedFlowcharts: FlowchartScript[],
//   removedFlowchartIds: string[],
//   meta: { ... },                    // small (theme, rules, mapping projects, ERD positions, etc.)
//   manifest: { scriptIds: string[], flowchartIds: string[], version, updatedAt }
// }
ipcMain.handle('save-workspace-shards', async (event, payload) => {
  try {
    const root = shardsRoot();
    const scriptsDir = path.join(root, 'scripts');
    const flowDir = path.join(root, 'flowcharts');
    await fsp.mkdir(scriptsDir, { recursive: true });
    await fsp.mkdir(flowDir, { recursive: true });

    const writes = [];

    for (const s of payload.changedScripts || []) {
      if (!s || !s.id) continue;
      const file = path.join(scriptsDir, safeShardName(s.id) + '.json');
      writes.push(coalescedWriteJson(file, s, { pretty: false }));
    }
    for (const f of payload.changedFlowcharts || []) {
      if (!f || !f.id) continue;
      const file = path.join(flowDir, safeShardName(f.id) + '.json');
      writes.push(coalescedWriteJson(file, f, { pretty: false }));
    }
    for (const id of payload.removedScriptIds || []) {
      const file = path.join(scriptsDir, safeShardName(id) + '.json');
      writes.push(fsp.unlink(file).catch(err => {
        if (err.code !== 'ENOENT') throw err;
      }));
    }
    for (const id of payload.removedFlowchartIds || []) {
      const file = path.join(flowDir, safeShardName(id) + '.json');
      writes.push(fsp.unlink(file).catch(err => {
        if (err.code !== 'ENOENT') throw err;
      }));
    }
    if (payload.meta) {
      writes.push(coalescedWriteJson(path.join(root, 'meta.json'), payload.meta, { pretty: false }));
    }

    await Promise.all(writes);

    // Manifest is written LAST (after all shard writes succeed) so a crash
    // mid-save leaves the previous manifest pointing at consistent shards.
    if (payload.manifest) {
      await coalescedWriteJson(path.join(root, 'manifest.json'), payload.manifest, { pretty: false });
    }

    return {
      success: true,
      counts: {
        scriptsWritten: (payload.changedScripts || []).length,
        scriptsRemoved: (payload.removedScriptIds || []).length,
        flowchartsWritten: (payload.changedFlowcharts || []).length,
        flowchartsRemoved: (payload.removedFlowchartIds || []).length,
      },
    };
  } catch (error) {
    logError('Failed to save workspace shards', { error: error.message });
    return { success: false, error: error.message };
  }
});

// Load shards into a single WorkspaceData-shaped object. If no manifest
// exists, returns null so the renderer can fall back to workspace.json.
ipcMain.handle('load-workspace-shards', async () => {
  try {
    const root = shardsRoot();
    const manifest = await readJsonIfExists(path.join(root, 'manifest.json'));
    if (!manifest) return { success: false, error: 'No shards manifest' };

    const scriptIds = Array.isArray(manifest.scriptIds) ? manifest.scriptIds : [];
    const flowIds = Array.isArray(manifest.flowchartIds) ? manifest.flowchartIds : [];
    const meta = (await readJsonIfExists(path.join(root, 'meta.json'))) || {};

    // Read all shards in parallel — fast even for hundreds of files.
    const [scripts, flowcharts] = await Promise.all([
      Promise.all(scriptIds.map(id =>
        readJsonIfExists(path.join(root, 'scripts', safeShardName(id) + '.json'))
      )),
      Promise.all(flowIds.map(id =>
        readJsonIfExists(path.join(root, 'flowcharts', safeShardName(id) + '.json'))
      )),
    ]);

    // Filter out any nulls (shard missing despite being in manifest — shouldn't
    // happen because manifest is written last, but be defensive).
    const validScripts = scripts.filter(Boolean);
    const validFlows = flowcharts.filter(Boolean);

    return {
      success: true,
      data: {
        version: manifest.version || '1.2.0',
        exportDate: manifest.updatedAt || new Date().toISOString(),
        scripts: validScripts,
        flowchartScripts: validFlows,
        mappingProjects: meta.mappingProjects || [],
        typeRuleSets: meta.typeRuleSets || [],
        theme: meta.theme || 'light',
        themeVariant: meta.themeVariant || 'slate',
        erdPositions: meta.erdPositions || {},
        ddVisibleColumns: meta.ddVisibleColumns,
        ddColumnWidths: meta.ddColumnWidths,
      },
      manifestUpdatedAt: manifest.updatedAt || null,
    };
  } catch (error) {
    logError('Failed to load workspace shards', { error: error.message });
    return { success: false, error: error.message };
  }
});

// Returns timestamps so the renderer can decide which source is newer
// (shards vs monolithic workspace.json) at startup.
ipcMain.handle('get-storage-mtimes', async () => {
  const out = { workspaceMs: null, shardsMs: null };
  try {
    const userData = app.getPath('userData');
    try {
      const s = await fsp.stat(path.join(userData, 'workspace.json'));
      out.workspaceMs = s.mtimeMs;
    } catch {}
    try {
      const s = await fsp.stat(path.join(shardsRoot(), 'manifest.json'));
      out.shardsMs = s.mtimeMs;
    } catch {}
  } catch (err) {
    logError('get-storage-mtimes failed', { error: err.message });
  }
  return { success: true, ...out };
});

// Run a prune on startup (non-blocking, conservative defaults)
app.whenReady().then(async () => {
  try {
    const backupsPath = path.normalize(path.join(PROJECT_ROOT, '..', 'backups'));
    const r = await pruneBackupsDir(backupsPath, { keepRecent: 5 });
    if (r.deleted.length > 0) {
      logInfo('Startup backup prune', {
        kept: r.kept.length,
        deleted: r.deleted.length,
        freedMB: (r.freedBytes / 1024 / 1024).toFixed(1),
      });
    }
  } catch (e) {
    logError('Startup backup prune error', { error: e.message });
  }
});

// ============================================
// SQLite IPC handlers (dark-launched in this PR)
//
// Each handler returns { success: true, ... } or { success: false, error }.
// The renderer never sees a thrown exception — it gets a structured result.
// Native module failures (e.g. better-sqlite3 not yet rebuilt for the current
// Electron version) are caught here and surfaced as `error`, so the renderer
// can degrade gracefully back to the shard layout.
// ============================================
function dbResult(fn) {
  try {
    const result = fn();
    return { success: true, ...(result || {}) };
  } catch (err) {
    logError('DB IPC handler failed', { error: err.message, stack: err.stack });
    return { success: false, error: err.message || String(err) };
  }
}

ipcMain.handle('db-bootstrap', async () => dbResult(() => {
  getDbModule().openDb(app);
  return { status: getDbModule().status() };
}));

ipcMain.handle('db-status', async () => dbResult(() => {
  // If the DB file exists, open it so status() can report real counts.
  // Without this, the renderer can't tell whether the DB has data — every
  // launch would re-trigger the migration splash even when the DB is healthy.
  const dbPath = path.join(app.getPath('userData'), 'workspace.db');
  if (fs.existsSync(dbPath)) {
    getDbModule().openDb(app);
  }
  return { status: getDbModule().status() };
}));

ipcMain.handle('db-load-workspace', async () => dbResult(() => {
  getDbModule().openDb(app);
  return { data: getDbModule().loadWorkspace() };
}));

ipcMain.handle('db-save-diff', async (event, payload) => dbResult(() => {
  getDbModule().openDb(app);
  const r = getDbModule().saveDiff(payload || {});
  return r || {};
}));

ipcMain.handle('db-get-version-content', async (event, versionId) => dbResult(() => {
  getDbModule().openDb(app);
  return { content: getDbModule().getVersionContent(versionId) };
}));

ipcMain.handle('db-migrate-from-shards', async () => {
  try {
    const result = await getDbMigrationModule().migrateFromShards(app);
    if (result.success) {
      logInfo('DB migration from shards complete', result.counts);
    } else {
      logError('DB migration from shards failed', { error: result.error });
    }
    return result;
  } catch (err) {
    logError('DB migration from shards threw', { error: err.message, stack: err.stack });
    return { success: false, error: err.message || String(err) };
  }
});

ipcMain.handle('db-integrity-check', async () => dbResult(() => {
  getDbModule().openDb(app);
  return getDbModule().integrityCheck();
}));

ipcMain.handle('db-vacuum', async (event, opts) => dbResult(() => {
  getDbModule().openDb(app);
  if (opts && opts.ifNeeded) return getDbModule().vacuumIfNeeded();
  getDbModule().vacuum();
  return { ran: true };
}));

// Auto-vacuum on quit if free pages > 25% (per the chosen vacuum policy).
app.on('before-quit', () => {
  if (!dbModule) return;
  try {
    const r = dbModule.vacuumIfNeeded();
    if (r && r.ran) logInfo('Auto-vacuum on quit ran', r);
    dbModule.close();
  } catch (e) {
    logError('Auto-vacuum / close on quit failed', { error: e.message });
  }
});

logInfo('IPC handlers registered');
