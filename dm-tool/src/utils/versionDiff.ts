import {
  ScriptVersion,
  LineDiff,
  DiffHunk,
  DiffHunkType,
  VersionCompareResult,
  VersionDiffStats,
  DiffMarker,
  TableDiff,
} from '../types';
import { compareTables, tablesToMap } from './compare';

// ============================================
// Myers Diff Algorithm Implementation
// ============================================

interface DiffEdit {
  type: 'equal' | 'insert' | 'delete';
  oldStart: number;
  oldEnd: number;
  newStart: number;
  newEnd: number;
}

/**
 * Compute the longest common subsequence using Myers' algorithm
 * Returns a list of edit operations (insert, delete, equal)
 */
function myersDiff(oldLines: string[], newLines: string[]): DiffEdit[] {
  const n = oldLines.length;
  const m = newLines.length;
  const max = n + m;
  const v: Record<number, number> = { 1: 0 };
  const trace: Array<Record<number, number>> = [];

  // Forward pass to find shortest edit path
  for (let d = 0; d <= max; d++) {
    trace.push({ ...v });

    for (let k = -d; k <= d; k += 2) {
      let x: number;
      if (k === -d || (k !== d && v[k - 1] < v[k + 1])) {
        x = v[k + 1]; // Move down
      } else {
        x = v[k - 1] + 1; // Move right
      }

      let y = x - k;

      // Follow diagonal (matching lines)
      while (x < n && y < m && oldLines[x] === newLines[y]) {
        x++;
        y++;
      }

      v[k] = x;

      if (x >= n && y >= m) {
        // Found the shortest path, backtrack to build edits
        return backtrack(trace, oldLines, newLines);
      }
    }
  }

  return [];
}

/**
 * Backtrack through the trace to construct edit operations
 */
function backtrack(
  trace: Array<Record<number, number>>,
  oldLines: string[],
  newLines: string[]
): DiffEdit[] {
  const edits: DiffEdit[] = [];
  let x = oldLines.length;
  let y = newLines.length;

  for (let d = trace.length - 1; d >= 0; d--) {
    const v = trace[d];
    const k = x - y;

    let prevK: number;
    if (k === -d || (k !== d && v[k - 1] < v[k + 1])) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }

    const prevX = v[prevK];
    const prevY = prevX - prevK;

    // Add diagonal moves (equal lines) in reverse
    while (x > prevX && y > prevY) {
      x--;
      y--;
      edits.unshift({
        type: 'equal',
        oldStart: x,
        oldEnd: x + 1,
        newStart: y,
        newEnd: y + 1,
      });
    }

    if (d > 0) {
      if (x === prevX) {
        // Insert (moved down)
        edits.unshift({
          type: 'insert',
          oldStart: x,
          oldEnd: x,
          newStart: prevY,
          newEnd: y,
        });
      } else {
        // Delete (moved right)
        edits.unshift({
          type: 'delete',
          oldStart: prevX,
          oldEnd: x,
          newStart: y,
          newEnd: y,
        });
      }
    }

    x = prevX;
    y = prevY;
  }

  return edits;
}

/**
 * Convert Myers diff edits to LineDiff array
 */
function editsToLineDiffs(
  edits: DiffEdit[],
  oldLines: string[],
  newLines: string[]
): LineDiff[] {
  const lineDiffs: LineDiff[] = [];

  for (const edit of edits) {
    switch (edit.type) {
      case 'equal':
        for (let i = edit.oldStart; i < edit.oldEnd; i++) {
          const j = edit.newStart + (i - edit.oldStart);
          lineDiffs.push({
            type: 'unchanged',
            oldContent: oldLines[i],
            newContent: newLines[j],
            oldLineNumber: i + 1,
            newLineNumber: j + 1,
          });
        }
        break;

      case 'delete':
        for (let i = edit.oldStart; i < edit.oldEnd; i++) {
          lineDiffs.push({
            type: 'deleted',
            oldContent: oldLines[i],
            oldLineNumber: i + 1,
          });
        }
        break;

      case 'insert':
        for (let j = edit.newStart; j < edit.newEnd; j++) {
          lineDiffs.push({
            type: 'added',
            newContent: newLines[j],
            newLineNumber: j + 1,
          });
        }
        break;
    }
  }

  return lineDiffs;
}

// ============================================
// Hunk Grouping
// ============================================

/**
 * Group line diffs into hunks with context lines
 */
function groupIntoHunks(lineDiffs: LineDiff[], contextLines: number = 3): DiffHunk[] {
  const hunks: DiffHunk[] = [];
  let currentHunk: LineDiff[] = [];
  let unchangedCount = 0;
  let hunkStartLine = 1;

  for (let i = 0; i < lineDiffs.length; i++) {
    const diff = lineDiffs[i];

    if (diff.type === 'unchanged') {
      unchangedCount++;

      // If we have a current hunk and too many unchanged lines, close it
      if (currentHunk.length > 0 && unchangedCount > contextLines * 2) {
        // Add trailing context
        const trailingStart = currentHunk.length - unchangedCount + contextLines;
        if (trailingStart > 0 && trailingStart < currentHunk.length) {
          currentHunk = currentHunk.slice(0, trailingStart + 1);
        }

        // Close current hunk
        if (currentHunk.some(l => l.type !== 'unchanged')) {
          hunks.push(createHunk(currentHunk, hunkStartLine));
        }
        currentHunk = [];
        unchangedCount = 0;
        hunkStartLine = (diff.oldLineNumber || diff.newLineNumber || 1);
      }

      currentHunk.push(diff);
    } else {
      // Changed line
      if (currentHunk.length === 0) {
        // Start new hunk with leading context
        const contextStart = Math.max(0, i - contextLines);
        for (let j = contextStart; j < i; j++) {
          if (lineDiffs[j].type === 'unchanged') {
            currentHunk.push(lineDiffs[j]);
          }
        }
        hunkStartLine = lineDiffs[contextStart]?.oldLineNumber || lineDiffs[contextStart]?.newLineNumber || 1;
      }

      currentHunk.push(diff);
      unchangedCount = 0;
    }
  }

  // Close final hunk
  if (currentHunk.length > 0 && currentHunk.some(l => l.type !== 'unchanged')) {
    // Trim trailing unchanged lines to context
    let trailingUnchanged = 0;
    for (let i = currentHunk.length - 1; i >= 0; i--) {
      if (currentHunk[i].type === 'unchanged') {
        trailingUnchanged++;
      } else {
        break;
      }
    }
    if (trailingUnchanged > contextLines) {
      currentHunk = currentHunk.slice(0, currentHunk.length - trailingUnchanged + contextLines);
    }
    hunks.push(createHunk(currentHunk, hunkStartLine));
  }

  return hunks;
}

/**
 * Create a DiffHunk from a list of LineDiffs
 */
function createHunk(lines: LineDiff[], startLine: number): DiffHunk {
  const hasAdditions = lines.some(l => l.type === 'added');
  const hasDeletions = lines.some(l => l.type === 'deleted');
  const hasModifications = lines.some(l => l.type === 'modified');

  let type: DiffHunkType = 'context';
  if (hasModifications || (hasAdditions && hasDeletions)) {
    type = 'modification';
  } else if (hasAdditions) {
    type = 'addition';
  } else if (hasDeletions) {
    type = 'deletion';
  }

  const endLine = lines.reduce((max, l) => {
    const lineNum = l.oldLineNumber || l.newLineNumber || 0;
    return Math.max(max, lineNum);
  }, startLine);

  return {
    startLine,
    endLine,
    lines,
    type,
  };
}

// ============================================
// Statistics
// ============================================

/**
 * Compute diff statistics from hunks
 */
function computeStats(
  hunks: DiffHunk[],
  schemaDiff?: Record<string, TableDiff>
): VersionDiffStats {
  let linesAdded = 0;
  let linesDeleted = 0;
  let linesModified = 0;

  for (const hunk of hunks) {
    for (const line of hunk.lines) {
      switch (line.type) {
        case 'added':
          linesAdded++;
          break;
        case 'deleted':
          linesDeleted++;
          break;
        case 'modified':
          linesModified++;
          break;
      }
    }
  }

  // Schema-level stats
  let tablesAdded = 0;
  let tablesDeleted = 0;
  let tablesModified = 0;

  if (schemaDiff) {
    for (const diff of Object.values(schemaDiff)) {
      switch (diff.status) {
        case 'ADDED':
          tablesAdded++;
          break;
        case 'MISSING':
          tablesDeleted++;
          break;
        case 'MODIFIED':
        case 'SOFT_MATCH':
          tablesModified++;
          break;
      }
    }
  }

  return {
    linesAdded,
    linesDeleted,
    linesModified,
    tablesAdded,
    tablesDeleted,
    tablesModified,
  };
}

// ============================================
// Main API
// ============================================

/**
 * Compute version diff between two script versions
 * @param showAllLines - If true, return ALL lines (full file view), not just hunks with context
 */
export function computeVersionDiff(
  oldVersion: ScriptVersion,
  newVersion: ScriptVersion,
  contextLines: number = 3,
  includeSchema: boolean = true,
  showAllLines: boolean = false
): VersionCompareResult {
  // Split content into lines
  const oldLines = oldVersion.content.split('\n');
  const newLines = newVersion.content.split('\n');

  // Compute Myers diff
  const edits = myersDiff(oldLines, newLines);

  // Convert to LineDiffs
  const lineDiffs = editsToLineDiffs(edits, oldLines, newLines);

  // Group into hunks OR create a single hunk with all lines
  let hunks: DiffHunk[];
  if (showAllLines) {
    // Create a single hunk containing ALL lines for full-file view
    hunks = lineDiffs.length > 0 ? [createHunk(lineDiffs, 1)] : [];
  } else {
    hunks = groupIntoHunks(lineDiffs, contextLines);
  }

  // Compute schema diff if requested
  let schemaDiff: Record<string, TableDiff> | undefined;
  if (includeSchema && oldVersion.data && newVersion.data) {
    const oldMap = tablesToMap(oldVersion.data.targets);
    const newMap = tablesToMap(newVersion.data.targets);
    schemaDiff = compareTables(oldMap, newMap);
  }

  // Compute stats
  const stats = computeStats(hunks, schemaDiff);

  return {
    oldVersion,
    newVersion,
    hunks,
    stats,
    schemaDiff,
  };
}

/**
 * Generate diff markers for minimap from hunks
 */
export function generateDiffMarkers(
  hunks: DiffHunk[],
  totalLines: number
): DiffMarker[] {
  if (totalLines === 0) return [];

  return hunks
    .filter(h => h.type !== 'context')
    .map(hunk => ({
      startPercent: (hunk.startLine / totalLines) * 100,
      endPercent: (hunk.endLine / totalLines) * 100,
      type: hunk.type === 'addition' ? 'added' as const :
            hunk.type === 'deletion' ? 'deleted' as const : 'modified' as const,
      lineStart: hunk.startLine,
      lineEnd: hunk.endLine,
    }));
}

/**
 * Get all line diffs from hunks (flattened)
 */
export function getAllLineDiffs(hunks: DiffHunk[]): LineDiff[] {
  return hunks.flatMap(h => h.lines);
}

/**
 * Find the index of the next change from a given line
 */
export function findNextChange(hunks: DiffHunk[], currentLine: number): number | null {
  for (const hunk of hunks) {
    if (hunk.startLine > currentLine && hunk.type !== 'context') {
      return hunk.startLine;
    }
  }
  return null;
}

/**
 * Find the index of the previous change from a given line
 */
export function findPrevChange(hunks: DiffHunk[], currentLine: number): number | null {
  let prevHunk: DiffHunk | null = null;
  for (const hunk of hunks) {
    if (hunk.startLine >= currentLine) {
      break;
    }
    if (hunk.type !== 'context') {
      prevHunk = hunk;
    }
  }
  return prevHunk?.startLine || null;
}

/**
 * Count total changes in diff result
 */
export function countChanges(result: VersionCompareResult): number {
  return result.hunks.filter(h => h.type !== 'context').length;
}

/**
 * Get change index for a given line number
 */
export function getChangeIndex(hunks: DiffHunk[], lineNumber: number): number {
  let index = 0;
  for (const hunk of hunks) {
    if (hunk.type === 'context') continue;
    if (hunk.startLine <= lineNumber && hunk.endLine >= lineNumber) {
      return index;
    }
    if (hunk.startLine > lineNumber) {
      break;
    }
    index++;
  }
  return -1;
}
