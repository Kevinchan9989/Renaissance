// Debug Logger Utility
// Captures console logs for debugging purposes

interface LogEntry {
  timestamp: number;
  level: 'log' | 'warn' | 'error' | 'info';
  message: string;
  args: any[];
}

const MAX_LOGS = 1000; // Keep last 1000 logs
let logs: LogEntry[] = [];
let listeners: Array<() => void> = [];

// Store original console methods
const originalConsole = {
  log: console.log,
  warn: console.warn,
  error: console.error,
  info: console.info,
};

// Flag to prevent infinite loops
let isLogging = false;

/**
 * Initialize debug logger to intercept console calls
 */
export function initDebugLogger() {
  console.log = (...args: any[]) => {
    if (!isLogging) {
      isLogging = true;
      addLog('log', args);
      isLogging = false;
    }
    originalConsole.log(...args);
  };

  console.warn = (...args: any[]) => {
    if (!isLogging) {
      isLogging = true;
      addLog('warn', args);
      isLogging = false;
    }
    originalConsole.warn(...args);
  };

  console.error = (...args: any[]) => {
    if (!isLogging) {
      isLogging = true;
      addLog('error', args);
      isLogging = false;
    }
    originalConsole.error(...args);
  };

  console.info = (...args: any[]) => {
    if (!isLogging) {
      isLogging = true;
      addLog('info', args);
      isLogging = false;
    }
    originalConsole.info(...args);
  };
}

/**
 * Add a log entry
 */
function addLog(level: LogEntry['level'], args: any[]) {
  const message = args.map(arg => {
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg, null, 2);
      } catch (e) {
        return String(arg);
      }
    }
    return String(arg);
  }).join(' ');

  logs.push({
    timestamp: Date.now(),
    level,
    message,
    args,
  });

  // Keep only last MAX_LOGS
  if (logs.length > MAX_LOGS) {
    logs = logs.slice(-MAX_LOGS);
  }

  // Notify listeners
  notifyListeners();
}

/**
 * Get all logs
 */
export function getLogs(): LogEntry[] {
  return [...logs];
}

/**
 * Clear all logs
 */
export function clearLogs() {
  logs = [];
  notifyListeners();
}

/**
 * Subscribe to log changes
 */
export function subscribeToLogs(callback: () => void): () => void {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
}

/**
 * Notify all listeners (deferred to avoid setState during render)
 */
let notifyTimeout: ReturnType<typeof setTimeout> | null = null;

function notifyListeners() {
  // Defer notification to after React's commit phase to avoid setState during render
  // Using a longer timeout ensures we're well outside React's synchronous render cycle
  if (notifyTimeout) {
    clearTimeout(notifyTimeout);
  }
  notifyTimeout = setTimeout(() => {
    notifyTimeout = null;
    // Use requestAnimationFrame to further ensure we're outside React's render
    requestAnimationFrame(() => {
      listeners.forEach(listener => listener());
    });
  }, 16); // ~1 frame delay to ensure React render is complete
}

/**
 * Format timestamp
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  });
}

/**
 * Export logs as text
 */
export function exportLogsAsText(): string {
  return logs.map(log => {
    const time = formatTimestamp(log.timestamp);
    const level = log.level.toUpperCase().padEnd(5);
    return `[${time}] ${level} ${log.message}`;
  }).join('\n');
}

/**
 * Download logs as file
 */
export function downloadLogs() {
  const text = exportLogsAsText();
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `debug-logs-${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
