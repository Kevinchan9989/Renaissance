// =============================================================================
// Deep-equal for WorkspaceData with first-divergence reporting.
//
// Used by Phase 2 validation to compare a shard-loaded workspace against a
// SQLite-loaded one and assert the migration was lossless. Configurable
// ignores cover known-acceptable divergences (top-level `version` /
// `exportDate`, lazy version blobs, drop-on-history parsed data, etc.).
// =============================================================================

export interface CompareResult {
  equal: boolean;
  /** dotted path to the first divergence, e.g. "scripts[3].data.targets[1].columns[7].explanation" */
  path?: string;
  a?: unknown;
  b?: unknown;
  reason?: string;
}

export interface CompareOptions {
  /**
   * Glob-ish path patterns to ignore (matched against the dotted path).
   * Supports `*` (single segment) and `**` (any depth).
   */
  ignorePaths?: string[];
}

const DEFAULT_IGNORES: string[] = [
  // Top-level WorkspaceData metadata that legitimately differs between sources.
  'version',
  'exportDate',
  // Historical version content/data are lazy-loaded from SQLite (only loaded on
  // demand). Phase 2 validation should compare summary stats only, not blobs.
  'scripts[*].versions[*].content',
  'scripts[*].versions[*].data',
  // Internal scratch field set by migration paths to carry display order.
  'scripts[*]._displayOrder',
  'flowchartScripts[*]._displayOrder',
];

export function compareWorkspaceData(
  a: unknown,
  b: unknown,
  options: CompareOptions = {},
): CompareResult {
  const ignores = compileIgnores([...(options.ignorePaths || []), ...DEFAULT_IGNORES]);
  return walk(a, b, '', ignores);
}

// -----------------------------------------------------------------------------
// internals
// -----------------------------------------------------------------------------

function walk(a: unknown, b: unknown, path: string, ignores: RegExp[]): CompareResult {
  if (matchesIgnore(path, ignores)) return { equal: true };

  if (a === b) return { equal: true };

  if (a == null || b == null) {
    // null/undefined treated as interchangeable for "field absent" semantics
    if (a == null && b == null) return { equal: true };
    return { equal: false, path, a, b, reason: 'one side is null/undefined' };
  }

  if (typeof a !== typeof b) {
    return { equal: false, path, a, b, reason: `type mismatch: ${typeof a} vs ${typeof b}` };
  }

  if (typeof a !== 'object') {
    // primitives that didn't ===
    return { equal: false, path, a, b, reason: 'primitive inequality' };
  }

  if (Array.isArray(a) !== Array.isArray(b)) {
    return { equal: false, path, a, b, reason: 'array vs object' };
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return { equal: false, path, a: a.length, b: b.length, reason: `array length ${a.length} vs ${b.length}` };
    }
    for (let i = 0; i < a.length; i++) {
      const r = walk(a[i], b[i], `${path}[${i}]`, ignores);
      if (!r.equal) return r;
    }
    return { equal: true };
  }

  const aKeys = Object.keys(a as object).filter((k) => (a as Record<string, unknown>)[k] !== undefined);
  const bKeys = Object.keys(b as object).filter((k) => (b as Record<string, unknown>)[k] !== undefined);

  // Find first key that exists in one but not the other (after ignore filtering)
  const allKeys = new Set([...aKeys, ...bKeys]);
  for (const k of allKeys) {
    const childPath = path ? `${path}.${k}` : k;
    if (matchesIgnore(childPath, ignores)) continue;
    const av = (a as Record<string, unknown>)[k];
    const bv = (b as Record<string, unknown>)[k];
    if (!aKeys.includes(k)) {
      return { equal: false, path: childPath, a: undefined, b: bv, reason: 'key only on b' };
    }
    if (!bKeys.includes(k)) {
      return { equal: false, path: childPath, a: av, b: undefined, reason: 'key only on a' };
    }
    const r = walk(av, bv, childPath, ignores);
    if (!r.equal) return r;
  }

  return { equal: true };
}

function compileIgnores(patterns: string[]): RegExp[] {
  return patterns.map((p) => {
    // Escape regex specials, then translate our glob tokens.
    const escaped = p.replace(/[.+^${}()|\\]/g, '\\$&').replace(/\[/g, '\\[').replace(/\]/g, '\\]');
    // Restore intentional [*] for array-index wildcard.
    const withArrayWildcard = escaped.replace(/\\\[\\\*\\\]/g, '\\[\\d+\\]');
    // ** = any path remainder; * = single segment (no dot or bracket)
    const re = withArrayWildcard
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^.\\[\\]]+');
    return new RegExp(`^${re}$`);
  });
}

function matchesIgnore(path: string, ignores: RegExp[]): boolean {
  if (!path) return false;
  for (const re of ignores) if (re.test(path)) return true;
  return false;
}
