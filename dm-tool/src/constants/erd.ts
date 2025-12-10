// ============================================
// ERD Constants - Exact match to db-schema-visualizer
// ============================================

// Table Colors (17 vibrant colors with lighter variants)
export const TABLE_COLORS = [
  { regular: '#6366f1', lighter: '#e0e7ff' }, // Indigo
  { regular: '#8b5cf6', lighter: '#ede9fe' }, // Violet
  { regular: '#a855f7', lighter: '#f3e8ff' }, // Purple
  { regular: '#d946ef', lighter: '#fae8ff' }, // Fuchsia
  { regular: '#ec4899', lighter: '#fce7f3' }, // Pink
  { regular: '#f43f5e', lighter: '#ffe4e6' }, // Rose
  { regular: '#ef4444', lighter: '#fee2e2' }, // Red
  { regular: '#f97316', lighter: '#ffedd5' }, // Orange
  { regular: '#f59e0b', lighter: '#fef3c7' }, // Amber
  { regular: '#eab308', lighter: '#fef9c3' }, // Yellow
  { regular: '#84cc16', lighter: '#ecfccb' }, // Lime
  { regular: '#22c55e', lighter: '#dcfce7' }, // Green
  { regular: '#10b981', lighter: '#d1fae5' }, // Emerald
  { regular: '#14b8a6', lighter: '#ccfbf1' }, // Teal
  { regular: '#06b6d4', lighter: '#cffafe' }, // Cyan
  { regular: '#0ea5e9', lighter: '#e0f2fe' }, // Sky
  { regular: '#3b82f6', lighter: '#dbeafe' }, // Blue
];

// Sizing Constants
export const SIZING = {
  TABLE_MIN_WIDTH: 220,
  TABLE_MAX_WIDTH: 400,
  COLUMN_HEIGHT: 30,
  TABLE_COLOR_HEIGHT: 6,
  TABLE_HEADER_HEIGHT: 36,
  LINE_HEIGHT: 25,
  PADDING: 5,
  TABLES_GAP_X: 80,
  TABLES_GAP_Y: 60,
  DIAGRAM_PADDING: 60,
  CONNECTION_STROKE_WIDTH: 2,
  CONNECTION_MIN_MARGIN: 40,
  CROSS_CONNECTION_MIN_MARGIN: 20,
  CONNECTION_HANDLE_OFFSET: 20,
  STAGE_SCALE_BY: 1.02,
  RELATION_SYMBOL_OFFSET: 8,
};

// Font Sizes
export const FONTS = {
  FAMILY: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  SIZE_SM: 12,
  SIZE_MD: 14,
  SIZE_LG: 16,
  SIZE_TABLE_TITLE: 14,
};

// Light Theme
export const LIGHT_THEME = {
  text: {
    primary: '#1f2937',
    secondary: '#6b7280',
  },
  connection: {
    active: '#3b82f6',
    default: '#9ca3af',
  },
  table: {
    background: '#ffffff',
    headerBackground: '#f8fafc',
    border: '#e5e7eb',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
  canvas: {
    background: '#f9fafb',
    grid: '#e5e7eb',
  },
  accent: {
    primary: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
};

// Dark Theme (Tailwind Slate - default)
export const DARK_THEME = {
  text: {
    primary: '#f3f4f6',
    secondary: '#9ca3af',
  },
  connection: {
    active: '#60a5fa',
    default: '#6b7280',
  },
  table: {
    background: '#1f2937',
    headerBackground: '#374151',
    border: '#4b5563',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  canvas: {
    background: '#111827',
    grid: '#1f2937',
  },
  accent: {
    primary: '#60a5fa',
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f87171',
  },
};

// VS Code Gray Theme Variant
export const VSCODE_GRAY_THEME = {
  text: {
    primary: '#d4d4d4',
    secondary: '#858585',
  },
  connection: {
    active: '#569cd6',
    default: '#505050',
  },
  table: {
    background: '#252526',
    headerBackground: '#2d2d30',
    border: '#3c3c3c',
    shadow: 'rgba(0, 0, 0, 0.4)',
  },
  canvas: {
    background: '#1e1e1e',
    grid: '#252526',
  },
  accent: {
    primary: '#569cd6',
    success: '#4ec9b0',
    warning: '#dcdcaa',
    danger: '#f48771',
  },
};

export type ThemeColors = typeof LIGHT_THEME;
export type DarkThemeVariant = 'slate' | 'vscode-gray';

// Helper function to get the appropriate dark theme
export const getDarkTheme = (variant: DarkThemeVariant): ThemeColors =>
  variant === 'vscode-gray' ? VSCODE_GRAY_THEME : DARK_THEME;
