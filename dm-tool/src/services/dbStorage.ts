// =============================================================================
// Renderer-side wrapper around the SQLite IPC layer (window.electronAPI.db).
//
// Dark-launched in this PR. Nothing in the existing app calls these helpers;
// they exist so PR2 can swap the persistence path behind isSqliteStorageEnabled()
// without redesigning the boundary at cutover time.
//
// Each helper:
//   - returns null on failure (and console.error's the IPC error)
//   - returns the unwrapped success payload on success
// =============================================================================

import type { WorkspaceData } from '../utils/storage';
import type { ShardSavePayload, DbStatus } from './electronStorage';
import { isElectron } from './electronStorage';

function api() {
  if (!isElectron()) return null;
  return window.electronAPI?.db || null;
}

export async function dbBootstrap(): Promise<DbStatus | null> {
  const db = api();
  if (!db) return null;
  const r = await db.bootstrap();
  if (!r.success) {
    console.error('[db.bootstrap]', r.error);
    return null;
  }
  return r.status;
}

export async function dbStatus(): Promise<DbStatus | null> {
  const db = api();
  if (!db) return null;
  const r = await db.status();
  if (!r.success) {
    console.error('[db.status]', r.error);
    return null;
  }
  return r.status;
}

export async function dbLoadWorkspace(): Promise<WorkspaceData | null> {
  const db = api();
  if (!db) return null;
  const r = await db.loadWorkspace();
  if (!r.success) {
    console.error('[db.loadWorkspace]', r.error);
    return null;
  }
  return r.data;
}

export async function dbSaveDiff(payload: ShardSavePayload): Promise<boolean> {
  const db = api();
  if (!db) return false;
  const r = await db.saveDiff(payload);
  if (!r.success) {
    console.error('[db.saveDiff]', r.error);
    return false;
  }
  return true;
}

export async function dbGetVersionContent(
  versionId: string,
): Promise<{ content: string; data: unknown } | null> {
  const db = api();
  if (!db) return null;
  const r = await db.getVersionContent(versionId);
  if (!r.success) {
    console.error('[db.getVersionContent]', r.error);
    return null;
  }
  return r.content;
}

export async function dbMigrateFromShards(): Promise<{
  ok: boolean;
  error?: string;
  counts?: Record<string, number>;
  skipped?: Record<string, number>;
  durationMs?: number;
}> {
  const db = api();
  if (!db) return { ok: false, error: 'Not in Electron' };
  const r = await db.migrateFromShards();
  if (!r.success) return { ok: false, error: r.error };
  return { ok: true, counts: r.counts, skipped: (r as any).skipped, durationMs: r.durationMs };
}

export async function dbIntegrityCheck(): Promise<{ ok: boolean; details?: unknown[]; error?: string }> {
  const db = api();
  if (!db) return { ok: false, error: 'Not in Electron' };
  const r = await db.integrityCheck();
  if (!r.success) return { ok: false, error: r.error };
  return { ok: r.ok, details: r.details };
}

export async function dbVacuum(opts?: { ifNeeded?: boolean }): Promise<boolean> {
  const db = api();
  if (!db) return false;
  const r = await db.vacuum(opts);
  if (!r.success) {
    console.error('[db.vacuum]', r.error);
    return false;
  }
  return r.ran;
}
