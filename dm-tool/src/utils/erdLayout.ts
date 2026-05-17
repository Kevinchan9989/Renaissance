/**
 * Structured ERD layout.
 *
 * A clean, deterministic auto-arrange algorithm tailored for FK-driven ERDs.
 * The pipeline:
 *
 *   1. Pair-merge   → master + master_T tables become a single "unit"
 *                     (super-node). They are positioned atomically by every
 *                     downstream stage, so they always end up side-by-side.
 *
 *   2. Unit graph   → rebuild the FK graph at the unit level. Internal
 *                     master↔_T edges become self-loops on a unit and are
 *                     dropped. Parallel edges between two units are deduped.
 *
 *   3. Components   → BFS over unit-level edges to split the graph into
 *                     connected components. Each component is laid out
 *                     independently, then packed.
 *
 *   4. Per-component layout:
 *        Tree?  (|edges| == |units|−1)  → tidy LR tree (Walker-style):
 *           a. Pick root by highest in-degree (most-referenced unit), then
 *              lex order as tie-break (deterministic).
 *           b. Bottom-up: subtreeHeight per node (max of own height OR sum
 *              of children's subtreeHeights + gaps).
 *           c. Top-down: place each node's children stacked vertically and
 *              centered against the parent's vertical midpoint. Each child
 *              sits centered within its allotted subtreeHeight.
 *        Otherwise → Dagre LR (Sugiyama). Standard graphlib layered layout
 *           is the right call when the graph has cycles or multiple parents.
 *
 *   5. Skyline pack → components arranged in wrapped rows, tallest-first to
 *                     minimize wasted vertical space. Each component lives
 *                     inside its own bounding box, so cross-component
 *                     overlap is impossible by construction (no more
 *                     greedy push-right-or-down collision pass).
 *
 *   6. Expand       → for each unit, the master goes at the unit's anchor
 *                     and the _T (if any) goes at masterWidth + pairGap.
 *
 * All iteration orders sort by table name so layouts are reproducible run
 * to run (no jitter from Map iteration order).
 *
 * Public API: `computeStructuredLayout(tables, edges, options)`. Returns a
 * `Record<TABLENAME_UPPERCASE, { x, y }>` ready to set on tablePositions.
 */

import dagre from '@dagrejs/dagre';
import { Table } from '../types';

// ============================================================
// Cluster keying
//
// Single source of truth for "which cluster does this table belong to" —
// shared by the layout pipeline (so positions are clustered) AND by the
// renderer (so swim-lane boxes wrap the right tables). Both paths must use
// these helpers to stay consistent.
//
// Rules:
//   1. table.schema (if non-empty)            → "schema:OMEGA"
//   2. name prefix before first underscore    → "prefix:ISS"
//      (master/_T pairs end up in the same prefix because we strip the
//      trailing _T before extracting the prefix)
//   3. fallback bucket                        → "misc"
// ============================================================
function clusterKey(table: Table): string {
  const schema = (table.schema ?? '').trim();
  if (schema) return `schema:${schema.toUpperCase()}`;

  const name = (table.tableName ?? '').toUpperCase();
  // Strip a trailing _T so master/temporal pairs share the same prefix
  // bucket even when the temporal table is the one being keyed.
  const baseForPrefix = name.replace(/_T$/, '');
  const m = baseForPrefix.match(/^([A-Z][A-Z0-9]*)_/);
  if (m) return `prefix:${m[1]}`;

  return 'misc';
}

function clusterDisplayName(key: string): string {
  if (key === 'misc') return 'Other';
  const idx = key.indexOf(':');
  return idx >= 0 ? key.slice(idx + 1) : key;
}

export interface LayoutCluster {
  /** Display label shown on the swim-lane header. */
  name: string;
  /** Internal key (used by layout for grouping; same form as clusterKey). */
  key: string;
  /** Uppercase table names belonging to this cluster. */
  tableNames: string[];
}

/**
 * Derive cluster membership from the table set alone — no positions involved.
 * The renderer uses this to compute swim-lane bounding boxes from current
 * positions; the layout pipeline uses the same rule internally so spatial
 * grouping matches the membership.
 *
 * Order: schema-keyed clusters first (alphabetical), then prefix-keyed
 * (alphabetical), then "Other" last. Deterministic across runs.
 */
export function getClusters(tables: Table[]): LayoutCluster[] {
  const buckets = new Map<string, string[]>();
  for (const t of tables) {
    const key = clusterKey(t);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push((t.tableName ?? '').toUpperCase());
  }
  const keys = Array.from(buckets.keys()).sort((a, b) => {
    // schemas first, then prefixes, then misc; alphabetical within each tier.
    const tier = (k: string) =>
      k === 'misc' ? 2 : k.startsWith('schema:') ? 0 : 1;
    const ta = tier(a), tb = tier(b);
    if (ta !== tb) return ta - tb;
    return clusterDisplayName(a).localeCompare(clusterDisplayName(b));
  });
  return keys.map(key => ({
    key,
    name: clusterDisplayName(key),
    tableNames: buckets.get(key)!.slice().sort(),
  }));
}

export interface LayoutEdge {
  sourceTable: string; // uppercase table name
  targetTable: string;
}

export interface LayoutOptions {
  measure: (table: Table) => { width: number; height: number };
  /**
   * Gap between depth levels (parent → child distance).
   * In TB this is vertical, in LR this is horizontal.
   */
  rankGap: number;
  /**
   * Gap between siblings stacked within a rank.
   * In TB this is horizontal, in LR this is vertical.
   */
  siblingGap: number;
  /** Gap between master and its _T temporal pair. */
  pairGap: number;
  /** Gap between disconnected components within a single cluster. */
  componentGap: number;
  /** Outer padding so nothing touches the canvas origin. */
  padding: number;
  /** Soft cap on shelf-pack row width; wraps clusters/components when exceeded. */
  maxRowWidth?: number;
  /**
   * Per-rank cap: tables in one rank wrap into a sub-rank at the same
   * logical depth when the count exceeds this. Default 10.
   */
  maxRankSize?: number;
  /**
   * Gap between sub-ranks of the same depth (smaller than rankGap so
   * wrapped sub-ranks still read as one logical layer).
   * Defaults to ~30 % of rankGap.
   */
  subRankGap?: number;
}

interface Unit {
  id: string;             // uppercase master name (or uppercase _T name if orphan)
  master: Table;
  temporal?: Table;
  width: number;
  height: number;
  /** Master x-offset within the unit (0). Reserved for symmetry. */
  masterDx: number;
  /** Temporal x-offset within the unit (masterWidth + pairGap), or undefined. */
  tempDx?: number;
  // Mutable layout output — assigned later, in component-local frame:
  x?: number;
  y?: number;
}

interface Component {
  units: Unit[];
  /** Directed unit-level edges (preserved for tree root selection). */
  directed: Array<{ from: string; to: string }>;
  /** Adjacency at unit level — undirected. */
  neighbors: Map<string, Set<string>>;
  // Mutable bounding-box fields filled during layout/pack:
  bboxWidth?: number;
  bboxHeight?: number;
  absoluteX?: number;
  absoluteY?: number;
}

// ============================================================
// 1. Pair-merge
// ============================================================
function buildUnits(
  tables: Table[],
  measure: LayoutOptions['measure'],
  pairGap: number
): { units: Unit[]; unitOf: Map<string, Unit> } {
  const units: Unit[] = [];
  const unitOf = new Map<string, Unit>();

  // Pass 1: every non-_T table becomes a unit anchored on its master.
  for (const t of tables) {
    const upper = t.tableName.toUpperCase();
    if (upper.endsWith('_T')) continue;
    const dim = measure(t);
    const u: Unit = {
      id: upper,
      master: t,
      width: dim.width,
      height: dim.height,
      masterDx: 0,
    };
    units.push(u);
    unitOf.set(upper, u);
  }

  // Pass 2: attach _T tables to their master units, or create standalone
  // units for orphan _T (master not in this script).
  for (const t of tables) {
    const upper = t.tableName.toUpperCase();
    if (!upper.endsWith('_T')) continue;
    const masterUpper = upper.slice(0, -2);
    const masterUnit = unitOf.get(masterUpper);
    if (masterUnit) {
      const masterDim = measure(masterUnit.master);
      const tempDim = measure(t);
      masterUnit.temporal = t;
      masterUnit.width = masterDim.width + pairGap + tempDim.width;
      masterUnit.height = Math.max(masterDim.height, tempDim.height);
      masterUnit.tempDx = masterDim.width + pairGap;
      // Lookups by either name resolve to the same unit so edge-graph build
      // routes FKs originating from / pointing to the _T into the unit.
      unitOf.set(upper, masterUnit);
    } else {
      const dim = measure(t);
      const u: Unit = {
        id: upper,
        master: t,
        width: dim.width,
        height: dim.height,
        masterDx: 0,
      };
      units.push(u);
      unitOf.set(upper, u);
    }
  }

  // Deterministic ordering for downstream passes.
  units.sort((a, b) => a.id.localeCompare(b.id));
  return { units, unitOf };
}

// ============================================================
// 2. Unit graph
// ============================================================
function buildUnitGraph(
  units: Unit[],
  edges: LayoutEdge[],
  unitOf: Map<string, Unit>
): { neighbors: Map<string, Set<string>>; directed: Array<{ from: string; to: string }> } {
  const neighbors = new Map<string, Set<string>>();
  for (const u of units) neighbors.set(u.id, new Set());

  const seen = new Set<string>();
  const directed: Array<{ from: string; to: string }> = [];

  for (const e of edges) {
    const fromUnit = unitOf.get(e.sourceTable.toUpperCase());
    const toUnit = unitOf.get(e.targetTable.toUpperCase());
    if (!fromUnit || !toUnit) continue;
    if (fromUnit.id === toUnit.id) continue; // master↔_T internal edge
    const undirKey = fromUnit.id < toUnit.id
      ? `${fromUnit.id}|${toUnit.id}`
      : `${toUnit.id}|${fromUnit.id}`;
    if (seen.has(undirKey)) continue; // dedup parallel edges between same unit pair
    seen.add(undirKey);
    neighbors.get(fromUnit.id)!.add(toUnit.id);
    neighbors.get(toUnit.id)!.add(fromUnit.id);
    directed.push({ from: fromUnit.id, to: toUnit.id });
  }
  return { neighbors, directed };
}

// ============================================================
// 3. Connected components
// ============================================================
function findComponents(
  units: Unit[],
  neighbors: Map<string, Set<string>>,
  directed: Array<{ from: string; to: string }>
): Component[] {
  const unitById = new Map<string, Unit>(units.map(u => [u.id, u]));
  const visited = new Set<string>();
  const components: Component[] = [];

  for (const start of units) {
    if (visited.has(start.id)) continue;
    const queue: string[] = [start.id];
    const componentUnits: Unit[] = [];
    const componentIds = new Set<string>();
    while (queue.length) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      componentUnits.push(unitById.get(id)!);
      componentIds.add(id);
      // Sorted neighbor walk for deterministic BFS order.
      const ns = Array.from(neighbors.get(id) ?? []).sort();
      for (const n of ns) if (!visited.has(n)) queue.push(n);
    }

    components.push({
      units: componentUnits,
      directed: directed.filter(e => componentIds.has(e.from) && componentIds.has(e.to)),
      neighbors: new Map(
        componentUnits.map(u => [u.id, new Set(Array.from(neighbors.get(u.id) ?? []).filter(n => componentIds.has(n)))])
      ),
    });
  }
  return components;
}

// ============================================================
// 4a. Layered TB per component (Sugiyama-style with rank size cap)
//
// Top-down: master at the top (rank 0), dependents fan downward at
// increasing depth. Every unit at depth N sits on the same Y row — true
// layered alignment, not Walker tidy-tree subtree drift. Ranks wider than
// `maxRankSize` wrap into a sub-row directly below at the same logical
// depth, separated by `subRankGap` (vs the larger `rankGap` between
// different depths) so wrapped sub-rows still read as one layer.
//
// Within each rank, children are sorted by their parent's index in the
// previous rank (barycenter heuristic) — keeps children clustered under
// their own parent's column, minimising edge zigzag.
// ============================================================
function pickTreeRoot(component: Component): string {
  // Highest in-degree wins (most-referenced unit ≈ central reference table).
  // Tie-break: lexicographic — keeps layout reproducible across runs.
  const inDegree = new Map<string, number>();
  for (const u of component.units) inDegree.set(u.id, 0);
  for (const e of component.directed) inDegree.set(e.to, (inDegree.get(e.to) ?? 0) + 1);
  return [...component.units]
    .sort((a, b) => {
      const di = (inDegree.get(b.id) ?? 0) - (inDegree.get(a.id) ?? 0);
      if (di !== 0) return di;
      return a.id.localeCompare(b.id);
    })[0].id;
}

function layoutLayeredTB(
  component: Component,
  rankGap: number,
  siblingGap: number,
  maxRankSize: number,
  subRankGap: number
): void {
  if (component.units.length === 0) return;
  if (component.units.length === 1) {
    component.units[0].x = 0;
    component.units[0].y = 0;
    return;
  }

  const rootId = pickTreeRoot(component);

  // BFS from root over undirected adjacency. Records depth for ranking and
  // tree-parent for the barycenter ordering inside each rank.
  const depth = new Map<string, number>();
  const parent = new Map<string, string>();
  depth.set(rootId, 0);
  const queue: string[] = [rootId];
  while (queue.length) {
    const id = queue.shift()!;
    const d = depth.get(id)!;
    const ns = Array.from(component.neighbors.get(id) ?? []).sort();
    for (const n of ns) {
      if (depth.has(n)) continue;
      depth.set(n, d + 1);
      parent.set(n, id);
      queue.push(n);
    }
  }

  // ranks[d] = units at depth d (where d=0 is the root at the top).
  let maxDepth = 0;
  for (const d of depth.values()) if (d > maxDepth) maxDepth = d;
  const ranks: Unit[][] = Array.from({ length: maxDepth + 1 }, () => []);
  for (const u of component.units) {
    ranks[depth.get(u.id) ?? 0].push(u);
  }

  // Order rank 0 by id (no parent constraint). Subsequent ranks: by parent's
  // index in the previous rank (barycenter), tie-break by id. Keeps each
  // child clustered horizontally near its parent's column.
  ranks[0].sort((a, b) => a.id.localeCompare(b.id));
  for (let d = 1; d <= maxDepth; d++) {
    const prevIdx = new Map<string, number>();
    ranks[d - 1].forEach((u, i) => prevIdx.set(u.id, i));
    ranks[d].sort((a, b) => {
      const pa = prevIdx.get(parent.get(a.id) ?? '') ?? Number.MAX_SAFE_INTEGER;
      const pb = prevIdx.get(parent.get(b.id) ?? '') ?? Number.MAX_SAFE_INTEGER;
      if (pa !== pb) return pa - pb;
      return a.id.localeCompare(b.id);
    });
  }

  // Slice each rank into sub-rows of at most maxRankSize units (in the
  // already-sorted order). Different depths separate with rankGap;
  // sub-rows of the same depth cluster with the smaller subRankGap so a
  // wrapped layer still reads as one logical level.
  type PhysRow = { units: Unit[]; isFirstSubRow: boolean };
  const physRows: PhysRow[] = [];
  for (let d = 0; d <= maxDepth; d++) {
    const units = ranks[d];
    const numSubRows = Math.max(1, Math.ceil(units.length / maxRankSize));
    for (let s = 0; s < numSubRows; s++) {
      physRows.push({
        units: units.slice(s * maxRankSize, (s + 1) * maxRankSize),
        isFirstSubRow: s === 0,
      });
    }
  }

  // Assign positions top-to-bottom. Within each row, units stack
  // horizontally with siblingGap. Between rows, advance Y by the row's
  // height plus rankGap (or subRankGap for wrapped sub-rows).
  let cursorY = 0;
  for (let i = 0; i < physRows.length; i++) {
    const row = physRows[i];
    if (i > 0) cursorY += row.isFirstSubRow ? rankGap : subRankGap;

    let rowHeight = 0;
    for (const u of row.units) if (u.height > rowHeight) rowHeight = u.height;

    let cursorX = 0;
    for (const u of row.units) {
      u.x = cursorX;
      u.y = cursorY;       // top-align within the row
      cursorX += u.width + siblingGap;
    }
    cursorY += rowHeight;
  }
}

// ============================================================
// 4b. Dagre fallback (per component, when not a tree)
//
// Dagre's `rankdir: 'TB'` puts source nodes (no incoming) at the top and
// sinks at the bottom. In our edge convention `from = sourceTable =
// dependent` and `to = targetTable = master`, so feeding edges as-is
// would put dependents on top — opposite of the layered-TB path which
// puts the master on top. We REVERSE edges before handing them to Dagre,
// making master Dagre's "source" → master at the top, matching the rest
// of the algorithm.
// ============================================================
function layoutWithDagre(component: Component, rankGap: number, siblingGap: number): void {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: 'TB',
    nodesep: siblingGap, // gap between siblings within a rank (horizontal in TB)
    ranksep: rankGap,    // gap between depth levels (vertical in TB)
    marginx: 0,
    marginy: 0,
  });
  g.setDefaultEdgeLabel(() => ({}));

  for (const u of component.units) {
    g.setNode(u.id, { width: u.width, height: u.height });
  }
  for (const e of component.directed) {
    // Reversed: master (e.to) is the "from" Dagre sees → master at the top.
    g.setEdge(e.to, e.from);
  }

  dagre.layout(g);

  // First pass: convert Dagre's center coordinates to top-left.
  for (const u of component.units) {
    const n = g.node(u.id);
    if (n) {
      u.x = n.x - u.width / 2;
      u.y = n.y - u.height / 2;
    } else {
      u.x = 0;
      u.y = 0;
    }
  }

  // Second pass: TOP-ALIGN within each Dagre rank.
  //
  // Dagre centers nodes on a shared rank Y, so when two tables in the same
  // rank have different heights their TOPS sit at different Y. We want every
  // table in a rank to share the same top Y (matches the layered-TB path).
  // We use Dagre's `rank` field as the grouping key (typed as `any` because
  // @dagrejs/dagre's TS shape doesn't expose it but it exists at runtime
  // after layout). Within each group, we snap every unit's top Y to the
  // group's topmost top (i.e. the y of the tallest table in that rank).
  const byRank = new Map<number, Unit[]>();
  for (const u of component.units) {
    const n = g.node(u.id) as { rank?: number } | undefined;
    if (!n || typeof n.rank !== 'number') continue;
    if (!byRank.has(n.rank)) byRank.set(n.rank, []);
    byRank.get(n.rank)!.push(u);
  }
  for (const units of byRank.values()) {
    if (units.length < 2) continue;
    let topY = Infinity;
    for (const u of units) if ((u.y ?? 0) < topY) topY = u.y ?? 0;
    for (const u of units) u.y = topY;
  }
}

// ============================================================
// 4. Per-component dispatch
// ============================================================
function isTree(component: Component): boolean {
  // Connected by construction (BFS); a connected graph is a tree iff it has
  // exactly n−1 undirected edges (no cycles, no multi-edges — dedup already
  // handled in unit-graph build).
  return component.directed.length === component.units.length - 1;
}

function layoutComponent(
  component: Component,
  rankGap: number,
  siblingGap: number,
  maxRankSize: number,
  subRankGap: number
): void {
  if (isTree(component)) {
    layoutLayeredTB(component, rankGap, siblingGap, maxRankSize, subRankGap);
  } else {
    layoutWithDagre(component, rankGap, siblingGap);
  }
  // Normalize so component-local frame starts at (0,0).
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const u of component.units) {
    if (u.x === undefined || u.y === undefined) continue;
    minX = Math.min(minX, u.x);
    minY = Math.min(minY, u.y);
    maxX = Math.max(maxX, u.x + u.width);
    maxY = Math.max(maxY, u.y + u.height);
  }
  if (!Number.isFinite(minX)) {
    component.bboxWidth = 0;
    component.bboxHeight = 0;
    return;
  }
  for (const u of component.units) {
    u.x = (u.x ?? 0) - minX;
    u.y = (u.y ?? 0) - minY;
  }
  component.bboxWidth = maxX - minX;
  component.bboxHeight = maxY - minY;
}

// ============================================================
// (Old top-level component skyline pack removed; the same shelf-pack now
//  serves both component-within-cluster and cluster-within-canvas placement
//  via packShelves(), so we don't duplicate the algorithm.)
// ============================================================

// ============================================================
// 5b. Per-cluster pipeline
//
// Every cluster (= schema or prefix bucket) gets its OWN run of the
// component-detection + layered-LR layout, packed into the cluster's local
// frame. Cross-cluster FK edges are still drawn at render time but don't
// influence layout (that's what keeps clusters spatially separate). After
// all clusters are laid out, they're skyline-packed at the top level — same
// algorithm we used for components, just one tier higher.
//
// Cluster boxes / labels are NOT rendered any more (per UX feedback —
// spatial separation is the only signal needed). Inner padding is small;
// the bigger gap between clusters comes from `clusterGap` at the top-level
// shelf pack.
// ============================================================
const CLUSTER_INNER_PAD = 8;

interface LaidCluster {
  key: string;
  name: string;
  units: Unit[]; // already positioned in cluster-local frame (incl. header offset)
  bboxWidth: number;
  bboxHeight: number;
  absoluteX?: number;
  absoluteY?: number;
}

function packShelves<T extends { bboxWidth?: number; bboxHeight?: number; absoluteX?: number; absoluteY?: number }>(
  items: T[],
  gap: number,
  startX: number,
  startY: number,
  maxRowWidth: number
): void {
  // Tallest-first shelf pack — shared by component packing within a cluster
  // and cluster packing at the top level.
  const sorted = [...items].sort((a, b) => (b.bboxHeight ?? 0) - (a.bboxHeight ?? 0));
  let cursorX = startX;
  let cursorY = startY;
  let rowH = 0;
  for (const it of sorted) {
    const w = it.bboxWidth ?? 0;
    const h = it.bboxHeight ?? 0;
    if (cursorX > startX && cursorX + w + gap > startX + maxRowWidth) {
      cursorY += rowH + gap;
      cursorX = startX;
      rowH = 0;
    }
    it.absoluteX = cursorX;
    it.absoluteY = cursorY;
    cursorX += w + gap;
    rowH = Math.max(rowH, h);
  }
}

function buildLaidCluster(
  key: string,
  name: string,
  units: Unit[],
  edges: LayoutEdge[],
  unitOf: Map<string, Unit>,
  rankGap: number,
  siblingGap: number,
  maxRankSize: number,
  subRankGap: number,
  componentGap: number,
  maxRowWidth: number
): LaidCluster {
  // Intra-cluster unit graph — only edges where BOTH endpoints sit in this
  // cluster contribute to layout. Cross-cluster FKs are drawn but ignored
  // here so clusters stay visually separate.
  const idsInCluster = new Set(units.map(u => u.id));
  const localEdges: LayoutEdge[] = edges.filter(e => {
    const fu = unitOf.get(e.sourceTable.toUpperCase());
    const tu = unitOf.get(e.targetTable.toUpperCase());
    return !!fu && !!tu && idsInCluster.has(fu.id) && idsInCluster.has(tu.id);
  });
  const { neighbors, directed } = buildUnitGraph(units, localEdges, unitOf);
  const components = findComponents(units, neighbors, directed);

  for (const comp of components) {
    layoutComponent(comp, rankGap, siblingGap, maxRankSize, subRankGap);
  }
  packShelves(components, componentGap, 0, 0, maxRowWidth);

  // Translate units from component-local → cluster-local frame. Small inner
  // padding keeps tables off the cluster edge; the visible "this is a chunk"
  // signal comes from clusterGap at the top level.
  let maxX = 0, maxY = 0;
  for (const comp of components) {
    for (const u of comp.units) {
      u.x = (u.x ?? 0) + (comp.absoluteX ?? 0) + CLUSTER_INNER_PAD;
      u.y = (u.y ?? 0) + (comp.absoluteY ?? 0) + CLUSTER_INNER_PAD;
      if (u.x + u.width > maxX) maxX = u.x + u.width;
      if (u.y + u.height > maxY) maxY = u.y + u.height;
    }
  }
  return {
    key,
    name,
    units,
    bboxWidth: maxX + CLUSTER_INNER_PAD,
    bboxHeight: maxY + CLUSTER_INNER_PAD,
  };
}

// ============================================================
// 6. Public entry
// ============================================================
export function computeStructuredLayout(
  tables: Table[],
  edges: LayoutEdge[],
  options: LayoutOptions
): Record<string, { x: number; y: number }> {
  if (tables.length === 0) return {};

  const {
    measure,
    rankGap,
    siblingGap,
    pairGap,
    componentGap,
    padding,
    maxRowWidth = 4000, // wide canvas; wraps only for very large schemas
    maxRankSize = 10,   // per-rank cap before wrapping into a sub-rank
    subRankGap = Math.max(20, Math.round(rankGap * 0.3)),
  } = options;

  // Cluster spacing is intentionally bigger than component spacing so the
  // chunked groups read as visually distinct without needing borders.
  const clusterGap = Math.max(componentGap, Math.round(rankGap * 1.2));

  const { units, unitOf } = buildUnits(tables, measure, pairGap);

  // Apply the same clustering rule the renderer would use, derived from the
  // master tables (the temporal _T inherits its master's cluster via
  // pair-merge automatically).
  const clusters = getClusters(units.map(u => u.master));
  const unitsByKey = new Map<string, Unit[]>();
  for (const u of units) {
    const k = clusterKey(u.master);
    if (!unitsByKey.has(k)) unitsByKey.set(k, []);
    unitsByKey.get(k)!.push(u);
  }

  const laidClusters: LaidCluster[] = clusters
    .filter(c => unitsByKey.has(c.key))
    .map(c =>
      buildLaidCluster(
        c.key,
        c.name,
        unitsByKey.get(c.key)!,
        edges,
        unitOf,
        rankGap,
        siblingGap,
        maxRankSize,
        subRankGap,
        componentGap,
        maxRowWidth
      )
    );

  // Top-level shelf-pack of clusters.
  packShelves(laidClusters, clusterGap, padding, padding, maxRowWidth);

  // Translate every unit into canvas frame and expand back to per-table
  // positions (master at unit anchor; _T side-by-side).
  const positions: Record<string, { x: number; y: number }> = {};
  for (const lc of laidClusters) {
    for (const u of lc.units) {
      const ux = (lc.absoluteX ?? 0) + (u.x ?? 0);
      const uy = (lc.absoluteY ?? 0) + (u.y ?? 0);
      positions[u.master.tableName.toUpperCase()] = {
        x: ux + u.masterDx,
        y: uy,
      };
      if (u.temporal && u.tempDx !== undefined) {
        positions[u.temporal.tableName.toUpperCase()] = {
          x: ux + u.tempDx,
          y: uy,
        };
      }
    }
  }
  return positions;
}
