// =============================================================================
// MigrationSplash — full-screen overlay shown during the one-shot
// shards-to-SQLite migration.
//
// Dark-launched in this PR. PR2 will wire this into App.tsx's startup flow:
// it should render BEFORE the renderer's initial loadWorkspaceFromElectron()
// when (a) isSqliteStorageEnabled() is true and (b) the migration hasn't
// already run (db.status().scriptCount === 0 with shards present).
//
// On migration failure, per the chosen UX, we show an error dialog with the
// failure message and let the user retry or skip (skip falls back to the
// shard read path for this session).
// =============================================================================

import { useEffect, useRef, useState } from 'react';
import { Database, AlertTriangle } from 'lucide-react';
import { dbBootstrap, dbMigrateFromShards } from '../services/dbStorage';

type Phase = 'bootstrapping' | 'migrating' | 'done' | 'error';

interface MigrationSplashProps {
  /** Called once the migration has completed successfully (or the user skipped). */
  onComplete: (outcome: 'migrated' | 'skipped') => void;
  isDarkTheme?: boolean;
}

export default function MigrationSplash({ onComplete, isDarkTheme = false }: MigrationSplashProps) {
  const [phase, setPhase] = useState<Phase>('bootstrapping');
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [skipped, setSkipped] = useState<Record<string, number> | null>(null);
  // Guard against double-invocation in React StrictMode dev.
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    void run();
  }, []);

  async function run() {
    setError(null);
    setPhase('bootstrapping');

    const bootstrap = await dbBootstrap();
    if (!bootstrap) {
      setError('Could not initialize the SQLite database. The native module may not be installed for this Electron version. Run `npm run rebuild` and restart.');
      setPhase('error');
      return;
    }

    setPhase('migrating');
    const result = await dbMigrateFromShards();
    if (!result.ok) {
      setError(result.error || 'Unknown migration error');
      setPhase('error');
      return;
    }

    setCounts(result.counts || null);
    setSkipped(result.skipped || null);
    setPhase('done');
    // Brief pause so the user sees "Done" before we unmount. If we skipped
    // anything, hold longer so the user can read the warning.
    const totalSkipped = Object.values(result.skipped || {}).reduce((a, b) => a + b, 0);
    setTimeout(() => onComplete('migrated'), totalSkipped > 0 ? 2500 : 600);
  }

  const overlayBg = isDarkTheme ? 'rgba(15, 23, 42, 0.96)' : 'rgba(255, 255, 255, 0.96)';
  const fg = isDarkTheme ? '#f1f5f9' : '#0f172a';
  const dim = isDarkTheme ? '#94a3b8' : '#64748b';
  const cardBg = isDarkTheme ? '#1e293b' : '#ffffff';
  const cardBorder = isDarkTheme ? '#334155' : '#e2e8f0';
  const accent = '#3b82f6';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: overlayBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        color: fg,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: 12,
          padding: '32px 40px',
          minWidth: 420,
          maxWidth: 560,
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        }}
      >
        {phase !== 'error' ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <Database size={28} color={accent} />
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                {phase === 'bootstrapping' && 'Preparing local database…'}
                {phase === 'migrating' && 'Migrating workspace to SQLite…'}
                {phase === 'done' && 'Migration complete'}
              </h2>
            </div>

            <p style={{ color: dim, fontSize: 13, lineHeight: 1.55, margin: '0 0 16px' }}>
              {phase === 'bootstrapping' &&
                'Setting up the new local database. This only happens once.'}
              {phase === 'migrating' &&
                'Importing your scripts, mappings, and version history. Don\'t close the app.'}
              {phase === 'done' && counts && (
                <>
                  Imported {counts.scripts ?? 0} scripts, {counts.tables ?? 0} tables,{' '}
                  {counts.columns ?? 0} columns, {counts.versions ?? 0} versions.
                </>
              )}
            </p>

            {phase === 'done' && skipped && Object.values(skipped).some((v) => v > 0) && (
              <div style={{
                background: isDarkTheme ? '#0f172a' : '#fffbeb',
                border: `1px solid ${isDarkTheme ? '#334155' : '#fde68a'}`,
                borderRadius: 6,
                padding: 10,
                fontSize: 12,
                color: isDarkTheme ? '#fbbf24' : '#92400e',
                marginBottom: 8,
              }}>
                <div style={{ fontWeight: 500, marginBottom: 4 }}>Some legacy data was skipped:</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {(skipped.erdOrphanScripts || 0) > 0 && (
                    <li>{skipped.erdOrphanScripts} ERD position {skipped.erdOrphanScripts === 1 ? 'entry' : 'entries'} for deleted scripts</li>
                  )}
                  {(skipped.mappingProjectsMissingScript || 0) > 0 && (
                    <li>{skipped.mappingProjectsMissingScript} mapping {skipped.mappingProjectsMissingScript === 1 ? 'project' : 'projects'} referencing deleted source/target scripts</li>
                  )}
                  {(skipped.mappingProjectsRuleSetNulled || 0) > 0 && (
                    <li>{skipped.mappingProjectsRuleSetNulled} mapping {skipped.mappingProjectsRuleSetNulled === 1 ? 'project' : 'projects'} pointed at a missing type rule set (cleared)</li>
                  )}
                </ul>
              </div>
            )}

            {phase !== 'done' && <ProgressBar accent={accent} dim={dim} />}
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <AlertTriangle size={28} color="#ef4444" />
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Migration failed</h2>
            </div>

            <p style={{ color: dim, fontSize: 13, lineHeight: 1.55, margin: '0 0 8px' }}>
              The app could not migrate your workspace to SQLite. Your existing data in{' '}
              <code>workspace-shards/</code> is untouched and the app will continue using it.
            </p>
            <pre
              style={{
                background: isDarkTheme ? '#0f172a' : '#f8fafc',
                border: `1px solid ${cardBorder}`,
                borderRadius: 6,
                padding: 12,
                fontSize: 12,
                color: '#ef4444',
                overflowX: 'auto',
                margin: '0 0 16px',
              }}
            >
              {error}
            </pre>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => onComplete('skipped')}
                style={{
                  padding: '8px 16px',
                  border: `1px solid ${cardBorder}`,
                  background: 'transparent',
                  color: fg,
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                Continue with old storage
              </button>
              <button
                onClick={() => {
                  startedRef.current = false;
                  void run();
                }}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  background: accent,
                  color: '#fff',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Retry
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ accent, dim }: { accent: string; dim: string }) {
  // Indeterminate animated bar — actual progress isn't reported per-script
  // by the migration today; could be added later.
  return (
    <div
      style={{
        height: 4,
        background: dim,
        opacity: 0.2,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          height: '100%',
          width: '40%',
          background: accent,
          borderRadius: 2,
          animation: 'migration-splash-slide 1.2s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes migration-splash-slide {
          0%   { left: -40%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
