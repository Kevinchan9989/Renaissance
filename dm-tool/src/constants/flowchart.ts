// Flowchart node sizing constants
export const FLOWCHART_SIZING = {
  // Node dimensions
  NODE_MIN_WIDTH: 140,
  NODE_MAX_WIDTH: 300,
  NODE_HEIGHT: 44,
  NODE_PADDING: 12,
  NODE_BORDER_RADIUS: 6,

  // Decision (diamond) dimensions
  DECISION_SIZE: 70,

  // Terminal (start/stop) dimensions
  TERMINAL_RADIUS: 20,

  // Fork/Join bar dimensions
  FORK_WIDTH: 80,
  FORK_HEIGHT: 6,

  // Note dimensions
  NOTE_MIN_WIDTH: 100,
  NOTE_MAX_WIDTH: 200,
  NOTE_FOLD_SIZE: 12,

  // Swimlane dimensions
  SWIMLANE_MIN_WIDTH: 200,
  SWIMLANE_HEADER_HEIGHT: 36,
  SWIMLANE_PADDING: 20,

  // Layout spacing
  GAP_X: 40,
  GAP_Y: 50,
  SWIMLANE_GAP: 16,
  DIAGRAM_PADDING: 40,

  // Connection styling
  CONNECTION_STROKE_WIDTH: 2,
  ARROWHEAD_SIZE: 8,
};

// Node colors by type
export const NODE_COLORS = {
  start: {
    fill: '#22c55e',      // Green
    stroke: '#16a34a',
    text: '#ffffff',
  },
  stop: {
    fill: '#ef4444',      // Red
    stroke: '#dc2626',
    text: '#ffffff',
  },
  activity: {
    fill: '#ffffff',
    stroke: '#e5e7eb',
    text: '#1f2937',
    accent: '#3b82f6',    // Left border color
  },
  decision: {
    fill: '#fef3c7',      // Yellow tint
    stroke: '#f59e0b',
    text: '#92400e',
  },
  fork: {
    fill: '#374151',      // Dark gray
    stroke: '#1f2937',
  },
  join: {
    fill: '#374151',
    stroke: '#1f2937',
  },
  note: {
    fill: '#fef9c3',      // Light yellow
    stroke: '#facc15',
    text: '#713f12',
  },
  partition: {
    fill: 'transparent',
    stroke: '#9ca3af',
    strokeDash: [5, 5],
  },
  whileStart: {
    fill: '#dbeafe',      // Light blue
    stroke: '#3b82f6',
    text: '#1e40af',
  },
  repeatEnd: {
    fill: '#dbeafe',
    stroke: '#3b82f6',
    text: '#1e40af',
  },
  kill: {
    fill: '#fecaca',      // Light red
    stroke: '#ef4444',
    text: '#991b1b',
  },
  detach: {
    fill: '#f3f4f6',
    stroke: '#9ca3af',
    text: '#6b7280',
  },
};

// Dark theme node colors
export const NODE_COLORS_DARK = {
  start: {
    fill: '#22c55e',
    stroke: '#4ade80',
    text: '#ffffff',
  },
  stop: {
    fill: '#ef4444',
    stroke: '#f87171',
    text: '#ffffff',
  },
  activity: {
    fill: '#374151',
    stroke: '#4b5563',
    text: '#f9fafb',
    accent: '#60a5fa',
  },
  decision: {
    fill: '#78350f',
    stroke: '#f59e0b',
    text: '#fef3c7',
  },
  fork: {
    fill: '#9ca3af',
    stroke: '#d1d5db',
  },
  join: {
    fill: '#9ca3af',
    stroke: '#d1d5db',
  },
  note: {
    fill: '#422006',
    stroke: '#facc15',
    text: '#fef9c3',
  },
  partition: {
    fill: 'transparent',
    stroke: '#6b7280',
    strokeDash: [5, 5],
  },
  whileStart: {
    fill: '#1e3a5f',
    stroke: '#60a5fa',
    text: '#bfdbfe',
  },
  repeatEnd: {
    fill: '#1e3a5f',
    stroke: '#60a5fa',
    text: '#bfdbfe',
  },
  kill: {
    fill: '#7f1d1d',
    stroke: '#ef4444',
    text: '#fecaca',
  },
  detach: {
    fill: '#4b5563',
    stroke: '#6b7280',
    text: '#d1d5db',
  },
};

// Swimlane colors palette (matches TABLE_COLORS from erd.ts for consistency)
export const SWIMLANE_COLORS = [
  { regular: '#3b82f6', lighter: '#dbeafe', header: '#1d4ed8' },  // Blue
  { regular: '#22c55e', lighter: '#dcfce7', header: '#15803d' },  // Green
  { regular: '#f59e0b', lighter: '#fef3c7', header: '#d97706' },  // Amber
  { regular: '#8b5cf6', lighter: '#ede9fe', header: '#7c3aed' },  // Violet
  { regular: '#ef4444', lighter: '#fee2e2', header: '#dc2626' },  // Red
  { regular: '#06b6d4', lighter: '#cffafe', header: '#0891b2' },  // Cyan
  { regular: '#ec4899', lighter: '#fce7f3', header: '#db2777' },  // Pink
  { regular: '#14b8a6', lighter: '#ccfbf1', header: '#0d9488' },  // Teal
];

// Connection arrow styles
export const CONNECTION_STYLES = {
  solid: [],
  dashed: [8, 4],
  dotted: [2, 4],
};

// Get node colors based on theme
export function getNodeColors(isDarkTheme: boolean) {
  return isDarkTheme ? NODE_COLORS_DARK : NODE_COLORS;
}

// Get swimlane color by index
export function getSwimlaneColor(index: number) {
  return SWIMLANE_COLORS[index % SWIMLANE_COLORS.length];
}

// Calculate text width (approximate)
export function calculateTextWidth(text: string, fontSize: number = 13): number {
  const avgCharWidth = fontSize * 0.6;
  return text.length * avgCharWidth;
}

// Calculate node width based on text content
export function calculateNodeWidth(text: string): number {
  const textWidth = calculateTextWidth(text);
  const paddedWidth = textWidth + FLOWCHART_SIZING.NODE_PADDING * 2;
  return Math.min(
    Math.max(paddedWidth, FLOWCHART_SIZING.NODE_MIN_WIDTH),
    FLOWCHART_SIZING.NODE_MAX_WIDTH
  );
}
