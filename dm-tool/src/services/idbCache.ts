/**
 * idbCache: a minimal IndexedDB-backed key-value store for large JSON blobs
 * that exceed the localStorage 10 MB-ish cap.
 *
 * Design constraints:
 *   - Public API stays synchronous on the read side (the existing storage.ts
 *     contract is `loadScripts(): Script[]`, called from React render paths).
 *     We preserve that by hydrating an in-memory cache once at startup and
 *     serving reads from the cache.
 *   - Writes are async fire-and-forget; the cache is updated synchronously
 *     so subsequent reads see the new value immediately.
 *   - One-time migration from localStorage on first hydrate. If the IDB blob
 *     for a key is empty but localStorage has it, we adopt the localStorage
 *     value, write it to IDB, and remove it from localStorage. Safe to re-run.
 *   - All writes are coalesced per key (latest wins) so a flurry of edits
 *     doesn't queue 50 outstanding transactions.
 *
 * Scope: intentionally only used for the three large keys
 *   - dm_tool_data (scripts)
 *   - dm_flowchart_scripts
 *   - dm_tool_mapping_projects
 * Small keys (theme, zoom, ERD per-script positions, etc.) keep using
 * localStorage. They're tiny and migrating them would touch ~80 call sites
 * across 6 files for no measurable benefit.
 */

const DB_NAME = 'dm_tool_idb';
const DB_VERSION = 1;
const STORE_NAME = 'kv';

let dbPromise: Promise<IDBDatabase> | null = null;
const memCache = new Map<string, string>();
let hydrated = false;
let hydratePromise: Promise<void> | null = null;
const pendingWrites = new Map<string, string>();
let writeFlushScheduled = false;

function isAvailable(): boolean {
  try {
    return typeof indexedDB !== 'undefined';
  } catch {
    return false;
  }
}

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('IDB open blocked'));
  });
  return dbPromise;
}

async function idbGet(key: string): Promise<string | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function idbPutMany(entries: Array<[string, string]>): Promise<void> {
  if (entries.length === 0) return;
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const [k, v] of entries) store.put(v, k);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

/**
 * Hydrate the in-memory cache from IDB and migrate any large keys still
 * sitting in localStorage. Idempotent. Must be awaited before the renderer
 * reads any of the managed keys for the first time.
 */
export async function initIdbCache(keys: string[]): Promise<void> {
  if (hydrated) return;
  if (hydratePromise) return hydratePromise;

  hydratePromise = (async () => {
    if (!isAvailable()) {
      console.warn('IndexedDB unavailable — falling back to localStorage only');
      hydrated = true;
      return;
    }

    try {
      for (const key of keys) {
        let value = await idbGet(key);
        if (value == null) {
          // First-run migration: pull from localStorage if present, then move it.
          const ls = localStorage.getItem(key);
          if (ls != null) {
            try {
              await idbPutMany([[key, ls]]);
              localStorage.removeItem(key);
              value = ls;
              console.log(`📦 Migrated ${key} from localStorage to IDB (${(ls.length / 1024 / 1024).toFixed(2)} MB)`);
            } catch (err) {
              console.error(`Failed to migrate ${key} to IDB:`, err);
              value = ls; // keep using localStorage value
            }
          }
        }
        if (value != null) memCache.set(key, value);
      }
    } catch (err) {
      console.error('IDB hydrate failed, will use localStorage fallback:', err);
    } finally {
      hydrated = true;
    }
  })();

  return hydratePromise;
}

/**
 * Synchronous read. Returns the cached value if hydrated, otherwise falls
 * back to localStorage so callers that race the hydrate still get something
 * sensible (the pre-migration value).
 */
export function getSync(key: string): string | null {
  if (memCache.has(key)) return memCache.get(key)!;
  // Fallback before hydrate completes, or if IDB is unavailable.
  return localStorage.getItem(key);
}

function scheduleFlush() {
  if (writeFlushScheduled) return;
  writeFlushScheduled = true;
  // Microtask: batches many setSync() calls in the same tick into one tx.
  queueMicrotask(async () => {
    writeFlushScheduled = false;
    if (pendingWrites.size === 0) return;
    const entries = Array.from(pendingWrites.entries());
    pendingWrites.clear();
    if (!isAvailable()) return; // memCache + localStorage fallback already updated
    try {
      await idbPutMany(entries);
    } catch (err) {
      console.error('IDB write failed:', err);
    }
  });
}

/**
 * Synchronous write. Updates the in-memory cache immediately so subsequent
 * getSync() reflects the change; queues the IDB write for the next microtask.
 * Multiple writes to the same key in one tick are coalesced — only the
 * latest value is persisted.
 */
export function setSync(key: string, value: string): void {
  memCache.set(key, value);
  pendingWrites.set(key, value);
  scheduleFlush();
}

/**
 * Wait until all pending IDB writes have been flushed to disk.
 * Call before app-quit / beforeunload to avoid losing the last edit.
 */
export async function flushPending(): Promise<void> {
  if (pendingWrites.size === 0) return;
  const entries = Array.from(pendingWrites.entries());
  pendingWrites.clear();
  if (!isAvailable()) return;
  await idbPutMany(entries);
}

/**
 * Test-only / settings-tools-only: which keys are currently held in the cache.
 */
export function debugCachedKeys(): string[] {
  return Array.from(memCache.keys());
}
