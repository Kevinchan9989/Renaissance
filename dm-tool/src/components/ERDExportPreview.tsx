import { useState, useMemo, useRef, useEffect } from 'react';
import { X, FileText, Printer } from 'lucide-react';
import { Table } from '../types';
import { TABLE_COLORS, SIZING, FONTS, LIGHT_THEME, getDarkTheme, ThemeColors, DarkThemeVariant } from '../constants/erd';

interface TableNode {
  id: string;
  table: Table;
  x: number;
  y: number;
  width: number;
  height: number;
  colorIndex: number;
}

interface Edge {
  id: string;
  sourceTable: string;
  sourceColumn: string;
  targetTable: string;
  targetColumn: string;
}

interface ERDExportPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  tables: Table[];
  nodes: TableNode[];
  edges: Edge[];
  isDarkTheme: boolean;
  darkThemeVariant?: DarkThemeVariant;
  scriptName?: string;
}

// Position enum for bezier calculations
enum Position {
  Left = 'left',
  Right = 'right',
}

// Bezier curve calculation helpers
const CONNECTION_SYMBOL_OFFSET = 12;

function calculateControlOffset(distance: number, curvature: number): number {
  if (distance >= 0) {
    return 0.5 * distance;
  }
  return curvature * 25 * Math.sqrt(-distance);
}

function getControlWithCurvature(
  pos: Position,
  x1: number,
  y1: number,
  x2: number,
  _y2: number,
  curvature: number
): [number, number] {
  switch (pos) {
    case Position.Left:
      return [x1 - calculateControlOffset(x1 - x2, curvature), y1];
    case Position.Right:
      return [x1 + calculateControlOffset(x2 - x1, curvature), y1];
    default:
      return [x1, y1];
  }
}

function computeSymbolOffset(position: Position, startPoint: { x: number; y: number }): { x: number; y: number } {
  const x = position === Position.Left
    ? startPoint.x - CONNECTION_SYMBOL_OFFSET
    : startPoint.x + CONNECTION_SYMBOL_OFFSET;
  return { x, y: startPoint.y };
}

function getBezierPath(
  source: { x: number; y: number },
  target: { x: number; y: number },
  sourcePosition: Position,
  targetPosition: Position,
  curvature: number = 0.5
): string {
  const [sourceControlX, sourceControlY] = getControlWithCurvature(
    sourcePosition,
    source.x,
    source.y,
    target.x,
    target.y,
    curvature
  );

  const [targetControlX, targetControlY] = getControlWithCurvature(
    targetPosition,
    target.x,
    target.y,
    source.x,
    source.y,
    curvature
  );

  const sourceOffset = computeSymbolOffset(sourcePosition, source);
  const targetOffset = computeSymbolOffset(targetPosition, target);

  return `M${source.x},${source.y} L${sourceOffset.x},${sourceOffset.y} C${sourceControlX},${sourceControlY} ${targetControlX},${targetControlY} ${targetOffset.x},${targetOffset.y} L${target.x},${target.y}`;
}

function computeConnectionHandlePos(
  sourceX: number,
  sourceW: number,
  targetX: number,
  targetW: number
): [Position, Position, number, number] {
  const sourceEndX = sourceX + sourceW;
  const targetEndX = targetX + targetW;
  const intersectionGap = 40;

  const horizontalIntersection = Math.max(sourceEndX, targetEndX) - Math.min(sourceX, targetX);

  if (horizontalIntersection <= targetW + sourceW + intersectionGap) {
    return [Position.Left, Position.Left, sourceX, targetX];
  }

  if (sourceEndX < targetEndX) {
    return [Position.Right, Position.Left, sourceEndX, targetX];
  }

  return [Position.Left, Position.Right, sourceX, targetEndX];
}

// Relation symbols
function getOneSymbolPath(x: number, y: number, position: Position): string {
  const halfHeight = 3;
  const offset = computeSymbolOffset(position, { x, y });
  return `M${offset.x},${y - halfHeight} L${offset.x},${y + halfHeight}`;
}

function getManySymbolPath(x: number, y: number, position: Position): string {
  const halfHeight = 5;
  const offset = computeSymbolOffset(position, { x, y });
  return `M${x},${y - halfHeight} L${offset.x},${y} L${x},${y + halfHeight}`;
}

// Get theme
const getTheme = (isDark: boolean, variant: DarkThemeVariant = 'slate'): ThemeColors =>
  isDark ? getDarkTheme(variant) : LIGHT_THEME;

export default function ERDExportPreview({
  isOpen,
  onClose,
  tables,
  nodes,
  edges,
  isDarkTheme,
  darkThemeVariant = 'slate',
  scriptName = 'ERD'
}: ERDExportPreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const theme = getTheme(isDarkTheme, darkThemeVariant);

  // Calculate bounding box of all nodes with tight padding
  const PREVIEW_PADDING = 30;
  const bounds = useMemo(() => {
    if (nodes.length === 0) return { minX: 0, minY: 0, maxX: 800, maxY: 600, width: 800, height: 600 };

    const minX = Math.min(...nodes.map(n => n.x)) - PREVIEW_PADDING;
    const minY = Math.min(...nodes.map(n => n.y)) - PREVIEW_PADDING;
    const maxX = Math.max(...nodes.map(n => n.x + n.width)) + PREVIEW_PADDING;
    const maxY = Math.max(...nodes.map(n => n.y + n.height)) + PREVIEW_PADDING;

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY
    };
  }, [nodes]);

  // Update preview scale based on container size
  useEffect(() => {
    if (!previewRef.current || !isOpen) return;

    const updateScale = () => {
      const container = previewRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth - 40; // padding
      const containerHeight = container.clientHeight - 40;

      const scaleX = containerWidth / bounds.width;
      const scaleY = containerHeight / bounds.height;
      const newScale = Math.min(scaleX, scaleY, 1) * 0.95;

      setPreviewScale(newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [isOpen, bounds]);

  // Get column Y position for edge connections
  const getColumnY = (node: TableNode, colName: string): number => {
    const colIndex = node.table.columns.findIndex(
      c => c.name.toUpperCase() === colName.toUpperCase()
    );
    const baseY = node.y + SIZING.TABLE_COLOR_HEIGHT + SIZING.TABLE_HEADER_HEIGHT;
    if (colIndex === -1) return baseY + SIZING.COLUMN_HEIGHT / 2;
    return baseY + (colIndex * SIZING.COLUMN_HEIGHT) + SIZING.COLUMN_HEIGHT / 2;
  };

  // Generate SVG paths for edges
  const edgePaths = useMemo(() => {
    return edges.map(edge => {
      const sourceNode = nodes.find(n => n.id === edge.sourceTable);
      const targetNode = nodes.find(n => n.id === edge.targetTable);
      if (!sourceNode || !targetNode) return null;

      const sourceY = getColumnY(sourceNode, edge.sourceColumn);
      const targetY = getColumnY(targetNode, edge.targetColumn);

      const [sourcePosition, targetPosition, sourceX, targetX] = computeConnectionHandlePos(
        sourceNode.x,
        sourceNode.width,
        targetNode.x,
        targetNode.width
      );

      const sourcePoint = { x: sourceX, y: sourceY };
      const targetPoint = { x: targetX, y: targetY };

      const pathData = getBezierPath(sourcePoint, targetPoint, sourcePosition, targetPosition);
      const sourceSymbol = getManySymbolPath(sourceX, sourceY, sourcePosition);
      const targetSymbol = getOneSymbolPath(targetX, targetY, targetPosition);

      return {
        id: edge.id,
        path: `${pathData} ${sourceSymbol} ${targetSymbol}`,
        color: theme.connection.default
      };
    }).filter(Boolean);
  }, [edges, nodes, theme]);

  // Generate the HTML content for export
  const generateHTML = () => {
    // Generate search data for JavaScript
    const searchData = nodes.map(node => ({
      id: node.id,
      tableName: node.table.tableName,
      columns: node.table.columns.map(c => c.name)
    }));

    // Calculate tight bounds (padding around actual content)
    const PADDING = 30;
    const tightBounds = {
      width: bounds.width - (2 * SIZING.DIAGRAM_PADDING) + (2 * PADDING),
      height: bounds.height - (2 * SIZING.DIAGRAM_PADDING) + (2 * PADDING)
    };

    // Generate CSS (dark mode only)
    const css = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      @page {
        size: landscape;
        margin: 10mm;
      }
      html, body {
        width: 100%;
        height: 100%;
        font-family: ${FONTS.FAMILY};
        overflow: hidden;
        background: ${theme.canvas.background};
      }
      .erd-viewport {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        position: relative;
        background: ${theme.canvas.background};
        display: flex;
      }
      /* Left sidebar panel */
      .erd-sidebar {
        width: 280px;
        height: 100%;
        background: ${theme.table.headerBackground};
        border-right: 1px solid ${theme.table.border};
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        transition: margin-left 0.3s ease, opacity 0.3s ease;
        z-index: 100;
      }
      .erd-sidebar.collapsed {
        margin-left: -280px;
        opacity: 0;
        pointer-events: none;
      }
      .erd-sidebar-header {
        padding: 16px;
        border-bottom: 1px solid ${theme.table.border};
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .erd-sidebar-title {
        font-size: 14px;
        font-weight: 600;
        color: ${theme.text.primary};
      }
      .erd-sidebar-close {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        color: ${theme.text.secondary};
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, color 0.2s;
      }
      .erd-sidebar-close:hover {
        background: rgba(255,255,255,0.1);
        color: ${theme.text.primary};
      }
      .erd-sidebar-search {
        padding: 12px 16px;
        border-bottom: 1px solid ${theme.table.border};
      }
      .erd-sidebar-search-input {
        width: 100%;
        padding: 8px 12px 8px 32px;
        border: 1px solid ${theme.table.border};
        border-radius: 6px;
        font-size: 12px;
        background: ${theme.table.background};
        color: ${theme.text.primary};
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      .erd-sidebar-search-input:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      .erd-sidebar-search-input::placeholder {
        color: ${theme.text.secondary};
      }
      .erd-sidebar-search-wrapper {
        position: relative;
      }
      .erd-sidebar-search-icon {
        position: absolute;
        left: 10px;
        top: 50%;
        transform: translateY(-50%);
        color: ${theme.text.secondary};
        pointer-events: none;
      }
      .erd-sidebar-list {
        flex: 1;
        overflow-y: auto;
        padding: 0;
      }
      /* Schema header */
      .erd-schema-block {
        border-bottom: 1px solid ${theme.table.border};
      }
      .erd-schema-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 16px;
        cursor: pointer;
        background: ${theme.table.background};
        transition: background 0.15s;
        position: sticky;
        top: 0;
        z-index: 1;
      }
      .erd-schema-header:hover {
        background: rgba(255,255,255,0.05);
      }
      .erd-schema-header-title {
        font-size: 11px;
        font-weight: 600;
        color: ${theme.text.secondary};
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .erd-schema-arrow {
        transition: transform 0.2s;
        color: ${theme.text.secondary};
      }
      .erd-schema-arrow.collapsed {
        transform: rotate(-90deg);
      }
      .erd-schema-tables {
        display: block;
      }
      .erd-schema-tables.collapsed {
        display: none;
      }
      /* Table item */
      .erd-sidebar-item {
        padding: 8px 16px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: background 0.15s;
        border-left: 3px solid transparent;
      }
      .erd-sidebar-item:hover {
        background: rgba(255,255,255,0.05);
      }
      .erd-sidebar-item.active {
        background: rgba(59, 130, 246, 0.15);
        border-left-color: #3b82f6;
      }
      .erd-sidebar-item-color {
        width: 4px;
        height: 20px;
        border-radius: 2px;
        flex-shrink: 0;
      }
      .erd-sidebar-item-content {
        flex: 1;
        min-width: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .erd-sidebar-item-name {
        font-size: 12px;
        font-weight: 500;
        color: ${theme.text.primary};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
      }
      /* Highlight match */
      .erd-highlight {
        background-color: #fef08a;
        color: #854d0e;
        font-weight: 600;
        border-radius: 2px;
        padding: 0 2px;
      }
      /* Column count badge */
      .erd-col-count-badge {
        font-size: 10px;
        color: ${theme.text.secondary};
        background: rgba(255,255,255,0.1);
        padding: 2px 6px;
        border-radius: 10px;
        margin-left: 6px;
        flex-shrink: 0;
      }
      /* Nested column list */
      .erd-column-list {
        list-style: none;
        margin: 0 0 8px 0;
        padding: 0 0 0 27px;
        border-left: 2px solid ${theme.table.border};
        margin-left: 23px;
      }
      .erd-column-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        font-size: 11px;
        color: ${theme.text.secondary};
        cursor: pointer;
        border-radius: 3px;
        transition: background 0.15s;
      }
      .erd-column-item:hover {
        background: rgba(255,255,255,0.05);
      }
      .erd-column-item-icon {
        opacity: 0.5;
        flex-shrink: 0;
      }
      .erd-column-item-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .erd-column-item-type {
        font-size: 10px;
        color: ${theme.text.secondary};
        font-family: monospace;
        flex-shrink: 0;
      }
      .erd-sidebar-empty {
        padding: 20px 16px;
        text-align: center;
        color: ${theme.text.secondary};
        font-size: 12px;
      }
      .erd-sidebar-count {
        padding: 8px 16px;
        font-size: 11px;
        color: ${theme.text.secondary};
        border-top: 1px solid ${theme.table.border};
        background: ${theme.table.background};
      }
      /* Toggle button */
      .erd-sidebar-toggle {
        position: fixed;
        left: 16px;
        top: 16px;
        z-index: 101;
        background: ${theme.table.headerBackground};
        border: 1px solid ${theme.table.border};
        border-radius: 8px;
        padding: 8px 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: ${theme.text.primary};
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: background 0.2s, transform 0.2s, left 0.3s ease;
      }
      .erd-sidebar-toggle:hover {
        background: ${theme.table.background};
        transform: scale(1.02);
      }
      .erd-sidebar-toggle.sidebar-open {
        left: 296px;
      }
      .erd-canvas-wrapper {
        flex: 1;
        height: 100%;
        overflow: hidden;
        position: relative;
      }
      .erd-canvas {
        position: absolute;
        width: ${tightBounds.width}px;
        height: ${tightBounds.height}px;
        transform-origin: 0 0;
      }
      .erd-svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
      .erd-floating-bar {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 10px 20px;
        border-radius: 10px;
        backdrop-filter: blur(8px);
        background: ${theme.table.headerBackground};
        border: 1px solid ${theme.table.border};
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      }
      .erd-title {
        font-size: 13px;
        font-weight: 600;
        white-space: nowrap;
        color: ${theme.text.primary};
      }
      .erd-divider {
        width: 1px;
        height: 20px;
        background: ${theme.table.border};
      }
      .erd-stats {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .erd-stat {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 3px 8px;
        border-radius: 5px;
        font-size: 11px;
        white-space: nowrap;
        background: rgba(255,255,255,0.1);
        color: ${theme.text.secondary};
      }
      .erd-zoom-display {
        font-size: 11px;
        min-width: 45px;
        text-align: center;
        color: ${theme.text.secondary};
      }
      .erd-hint {
        font-size: 10px;
        color: ${theme.text.secondary};
        opacity: 0.7;
      }
      .erd-search-container {
        position: relative;
        width: 200px;
      }
      .erd-search-input {
        width: 100%;
        padding: 6px 10px 6px 30px;
        border: 1px solid ${theme.table.border};
        border-radius: 5px;
        font-size: 11px;
        background: ${theme.table.background};
        color: ${theme.text.primary};
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      .erd-search-input:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
      .erd-search-input::placeholder {
        color: ${theme.text.secondary};
      }
      .erd-search-icon {
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        color: ${theme.text.secondary};
        pointer-events: none;
      }
      .erd-search-dropdown {
        position: absolute;
        bottom: 100%;
        left: 0;
        right: 0;
        margin-bottom: 4px;
        background: ${theme.table.background};
        border: 1px solid ${theme.table.border};
        border-radius: 6px;
        box-shadow: 0 -10px 25px rgba(0,0,0,0.2);
        max-height: 300px;
        overflow-y: auto;
        display: none;
        z-index: 1001;
      }
      .erd-search-dropdown.show {
        display: block;
      }
      .erd-search-result {
        padding: 8px 12px;
        cursor: pointer;
        border-bottom: 1px solid ${theme.table.border};
        transition: background 0.15s;
      }
      .erd-search-result:last-child {
        border-bottom: none;
      }
      .erd-search-result:hover {
        background: rgba(255,255,255,0.1);
      }
      .erd-search-result-table {
        font-weight: 600;
        color: ${theme.text.primary};
        font-size: 12px;
      }
      .erd-search-result-column {
        font-size: 11px;
        color: ${theme.text.secondary};
        margin-top: 2px;
      }
      .erd-search-result-type {
        font-size: 9px;
        color: ${theme.text.secondary};
        background: rgba(255,255,255,0.1);
        padding: 1px 4px;
        border-radius: 3px;
        margin-left: 5px;
      }
      .table-node {
        position: absolute;
        background: ${theme.table.background};
        border: 1px solid ${theme.table.border};
        border-radius: 6px;
        box-shadow: 3px 3px 6px ${theme.table.shadow};
        overflow: hidden;
        transition: box-shadow 0.2s;
      }
      .table-node.highlighted {
        box-shadow: 0 0 0 3px #3b82f6, 3px 3px 12px rgba(59, 130, 246, 0.4);
        z-index: 10;
      }
      .table-color-strip {
        height: ${SIZING.TABLE_COLOR_HEIGHT}px;
        width: 100%;
      }
      .table-header {
        height: ${SIZING.TABLE_HEADER_HEIGHT}px;
        padding: 0 ${SIZING.PADDING + 6}px;
        background: ${theme.table.headerBackground};
        border-bottom: 1px solid ${theme.table.border};
        display: flex;
        align-items: center;
      }
      .table-name {
        font-size: ${FONTS.SIZE_TABLE_TITLE}px;
        font-weight: bold;
        color: ${theme.text.primary};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .table-columns {
        padding: ${SIZING.PADDING}px 0;
      }
      .column-row {
        height: ${SIZING.COLUMN_HEIGHT}px;
        padding: 0 ${SIZING.PADDING + 6}px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .column-row.pk-row {
        background: rgba(99, 102, 241, 0.1);
      }
      .column-row.fk-row {
        background: rgba(240, 249, 255, 0.3);
      }
      .column-row.highlighted-col {
        background: rgba(59, 130, 246, 0.2) !important;
      }
      .column-left {
        display: flex;
        align-items: center;
        gap: 4px;
        max-width: 55%;
      }
      .column-key {
        font-size: 10px;
        flex-shrink: 0;
      }
      .column-name {
        font-size: ${FONTS.SIZE_SM}px;
        color: ${theme.text.primary};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .column-name.pk {
        font-weight: bold;
      }
      .column-type {
        font-size: ${FONTS.SIZE_SM - 1}px;
        color: ${theme.text.secondary};
        text-align: right;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 40%;
      }
      @media print {
        .erd-floating-bar,
        .erd-sidebar,
        .erd-sidebar-toggle {
          display: none !important;
        }
        .erd-viewport {
          overflow: visible;
          height: auto;
          display: block;
        }
        .erd-canvas-wrapper {
          overflow: visible;
          height: auto;
        }
        .erd-canvas {
          transform: none !important;
          position: relative !important;
        }
        .table-node {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `;

    // Define columnIconSvg before searchScript uses it
    const columnIconSvg = `<svg class="erd-column-item-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"/></svg>`;

    // Generate JavaScript for search and zoom functionality
    const searchScript = `
      const searchData = ${JSON.stringify(searchData)};
      const searchInput = document.getElementById('erd-search-input');
      const searchDropdown = document.getElementById('erd-search-dropdown');
      const canvas = document.getElementById('erd-canvas');
      const canvasWrapper = document.getElementById('erd-canvas-wrapper');
      const zoomDisplay = document.getElementById('zoom-display');

      const canvasWidth = ${tightBounds.width};
      const canvasHeight = ${tightBounds.height};
      const MIN_SCALE = 0.1;
      const MAX_SCALE = 3;
      const ZOOM_SENSITIVITY = 0.002;

      let currentScale = 1;
      let translateX = 0;
      let translateY = 0;
      let isDragging = false;
      let lastMouseX = 0;
      let lastMouseY = 0;
      let highlightedNode = null;
      let highlightedColumn = null;
      let activeSidebarItem = null;

      function calculateFitScale() {
        const sidebar = document.getElementById('erd-sidebar');
        const sidebarWidth = sidebar && !sidebar.classList.contains('collapsed') ? 280 : 0;
        const viewportWidth = window.innerWidth - sidebarWidth;
        const viewportHeight = window.innerHeight - 80;
        const scaleX = viewportWidth / canvasWidth;
        const scaleY = viewportHeight / canvasHeight;
        return Math.min(scaleX, scaleY, 1) * 0.95;
      }

      function updateTransform() {
        canvas.style.transform = 'translate(' + translateX + 'px, ' + translateY + 'px) scale(' + currentScale + ')';
        zoomDisplay.textContent = Math.round(currentScale * 100) + '%';
      }

      function centerCanvas() {
        const sidebar = document.getElementById('erd-sidebar');
        const sidebarWidth = sidebar && !sidebar.classList.contains('collapsed') ? 280 : 0;
        const viewportWidth = window.innerWidth - sidebarWidth;
        const viewportHeight = window.innerHeight - 80;
        const scaledWidth = canvasWidth * currentScale;
        const scaledHeight = canvasHeight * currentScale;
        translateX = (viewportWidth - scaledWidth) / 2;
        translateY = (viewportHeight - scaledHeight) / 2;
        updateTransform();
      }

      function fitToView() {
        currentScale = calculateFitScale();
        centerCanvas();
      }

      function clearHighlights() {
        if (highlightedNode) {
          highlightedNode.classList.remove('highlighted');
          highlightedNode = null;
        }
        if (highlightedColumn) {
          highlightedColumn.classList.remove('highlighted-col');
          highlightedColumn = null;
        }
      }

      function navigateToTable(tableId, columnName) {
        clearHighlights();
        const node = document.getElementById('table-' + tableId);
        if (node) {
          // Get node position relative to canvas
          const nodeRect = node.getBoundingClientRect();
          const canvasRect = canvas.getBoundingClientRect();
          const nodeX = (nodeRect.left - canvasRect.left) / currentScale;
          const nodeY = (nodeRect.top - canvasRect.top) / currentScale;
          const nodeWidth = nodeRect.width / currentScale;
          const nodeHeight = nodeRect.height / currentScale;

          // Account for sidebar when centering
          const sidebar = document.getElementById('erd-sidebar');
          const sidebarWidth = sidebar && !sidebar.classList.contains('collapsed') ? 280 : 0;
          const viewportWidth = window.innerWidth - sidebarWidth;
          const viewportHeight = window.innerHeight - 80;
          translateX = (viewportWidth / 2) - (nodeX + nodeWidth / 2) * currentScale;
          translateY = (viewportHeight / 2) - (nodeY + nodeHeight / 2) * currentScale;
          updateTransform();

          node.classList.add('highlighted');
          highlightedNode = node;

          if (columnName) {
            const colRow = node.querySelector('[data-column="' + columnName.toUpperCase() + '"]');
            if (colRow) {
              colRow.classList.add('highlighted-col');
              highlightedColumn = colRow;
            }
          }

          // Update sidebar active item (if setActiveSidebarItem is defined)
          if (typeof setActiveSidebarItem === 'function') {
            setActiveSidebarItem(tableId);
          }

          setTimeout(() => {
            clearHighlights();
          }, 3000);
        }
        if (searchDropdown) searchDropdown.classList.remove('show');
        if (searchInput) searchInput.value = '';
      }

      function performSearch(query) {
        if (query.length < 2) {
          searchDropdown.classList.remove('show');
          return;
        }

        const q = query.toLowerCase();
        const results = [];

        searchData.forEach(table => {
          if (table.tableName.toLowerCase().includes(q)) {
            results.push({ type: 'table', tableId: table.id, tableName: table.tableName });
          }
          table.columns.forEach(col => {
            if (col.toLowerCase().includes(q)) {
              results.push({ type: 'column', tableId: table.id, tableName: table.tableName, columnName: col });
            }
          });
        });

        results.sort((a, b) => {
          const aText = a.type === 'table' ? a.tableName : a.columnName;
          const bText = b.type === 'table' ? b.tableName : b.columnName;
          const aExact = aText.toLowerCase() === q;
          const bExact = bText.toLowerCase() === q;
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;
          if (a.type === 'table' && b.type !== 'table') return -1;
          if (a.type !== 'table' && b.type === 'table') return 1;
          return 0;
        });

        const limitedResults = results.slice(0, 15);

        if (limitedResults.length === 0) {
          searchDropdown.innerHTML = '<div style="padding: 12px; color: ${theme.text.secondary}; text-align: center;">No results found</div>';
        } else {
          searchDropdown.innerHTML = limitedResults.map(r => {
            if (r.type === 'table') {
              return '<div class="erd-search-result" onclick="navigateToTable(\\'' + r.tableId + '\\')">' +
                '<div class="erd-search-result-table">' + escapeHtml(r.tableName) + '<span class="erd-search-result-type">Table</span></div>' +
                '</div>';
            } else {
              return '<div class="erd-search-result" onclick="navigateToTable(\\'' + r.tableId + '\\', \\'' + r.columnName + '\\')">' +
                '<div class="erd-search-result-table">' + escapeHtml(r.tableName) + '</div>' +
                '<div class="erd-search-result-column">' + escapeHtml(r.columnName) + '<span class="erd-search-result-type">Column</span></div>' +
                '</div>';
            }
          }).join('');
        }

        searchDropdown.classList.add('show');
      }

      function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
      }

      // Ctrl+scroll zoom
      canvasWrapper.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();

          const rect = canvasWrapper.getBoundingClientRect();
          const mouseX = e.clientX - rect.left;
          const mouseY = e.clientY - rect.top;

          // Calculate point under mouse in canvas coordinates
          const canvasX = (mouseX - translateX) / currentScale;
          const canvasY = (mouseY - translateY) / currentScale;

          // Apply zoom
          const delta = -e.deltaY * ZOOM_SENSITIVITY;
          const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, currentScale * (1 + delta)));

          // Adjust translation to zoom towards mouse position
          translateX = mouseX - canvasX * newScale;
          translateY = mouseY - canvasY * newScale;
          currentScale = newScale;

          updateTransform();
        }
      }, { passive: false });

      // Pan with mouse drag
      canvasWrapper.addEventListener('mousedown', (e) => {
        if (e.target.closest('.erd-floating-bar') || e.target.closest('.erd-search-container')) return;
        isDragging = true;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        canvasWrapper.style.cursor = 'grabbing';
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        translateX += deltaX;
        translateY += deltaY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        updateTransform();
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
        canvasWrapper.style.cursor = 'grab';
      });

      canvasWrapper.style.cursor = 'grab';

      // Search event listeners
      searchInput.addEventListener('input', (e) => performSearch(e.target.value));
      searchInput.addEventListener('focus', () => {
        if (searchInput.value.length >= 2) performSearch(searchInput.value);
      });

      document.addEventListener('click', (e) => {
        if (!e.target.closest('.erd-search-container')) {
          searchDropdown.classList.remove('show');
        }
      });

      window.addEventListener('resize', fitToView);

      // ==========================================
      // SIDEBAR FUNCTIONALITY
      // ==========================================
      const sidebar = document.getElementById('erd-sidebar');
      const sidebarToggle = document.getElementById('erd-sidebar-toggle');
      const sidebarClose = document.getElementById('erd-sidebar-close');
      const sidebarList = document.getElementById('erd-sidebar-list');
      const sidebarSearchInput = document.getElementById('erd-sidebar-search');
      const sidebarCount = document.getElementById('erd-sidebar-count');
      const toggleText = document.getElementById('toggle-text');

      const columnIconHtml = '${columnIconSvg.replace(/'/g, "\\'")}';
      const totalTables = document.querySelectorAll('.erd-sidebar-item').length;

      function toggleSidebar() {
        const isCollapsed = sidebar.classList.toggle('collapsed');
        sidebarToggle.classList.toggle('sidebar-open', !isCollapsed);
        toggleText.textContent = isCollapsed ? 'Show Tables' : 'Hide Tables';
        // Re-fit after sidebar toggle
        setTimeout(fitToView, 350);
      }

      function toggleSchema(schemaHeader) {
        const block = schemaHeader.closest('.erd-schema-block');
        const tables = block.querySelector('.erd-schema-tables');
        const arrow = schemaHeader.querySelector('.erd-schema-arrow');
        tables.classList.toggle('collapsed');
        arrow.classList.toggle('collapsed');
      }

      function updateSidebarCount(count, total) {
        if (count === total) {
          sidebarCount.textContent = total + ' table' + (total !== 1 ? 's' : '');
        } else {
          sidebarCount.textContent = count + ' of ' + total + ' tables';
        }
      }

      function highlightText(text, query) {
        if (!query) return escapeHtml(text);
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        const index = lowerText.indexOf(lowerQuery);
        if (index === -1) return escapeHtml(text);
        return escapeHtml(text.slice(0, index)) +
          '<span class="erd-highlight">' + escapeHtml(text.slice(index, index + query.length)) + '</span>' +
          escapeHtml(text.slice(index + query.length));
      }

      function getMatchingColumns(columnsData, query) {
        if (!columnsData || !query) return [];
        const columns = columnsData.split(';;').filter(c => c);
        const q = query.toLowerCase();
        return columns
          .map(c => {
            const [name, type] = c.split('|');
            return { name, type };
          })
          .filter(c => c.name.includes(q));
      }

      function filterSidebarTables(query) {
        const items = sidebarList.querySelectorAll('.erd-sidebar-item');
        const schemaBlocks = sidebarList.querySelectorAll('.erd-schema-block');
        const q = query.toLowerCase().trim();
        let visibleCount = 0;

        // Remove all existing column lists
        sidebarList.querySelectorAll('.erd-column-list').forEach(el => el.remove());

        items.forEach(item => {
          const tableName = item.getAttribute('data-table-name') || '';
          const schema = item.getAttribute('data-schema') || '';
          const columnsData = item.getAttribute('data-columns') || '';

          const tableNameMatches = q === '' || tableName.includes(q) || schema.includes(q);
          const matchingColumns = q ? getMatchingColumns(columnsData, q) : [];
          const hasColumnMatch = matchingColumns.length > 0;
          const matches = tableNameMatches || hasColumnMatch;

          item.style.display = matches ? 'flex' : 'none';

          // Update table name with highlight
          const nameEl = item.querySelector('.erd-sidebar-item-name');
          const contentEl = item.querySelector('.erd-sidebar-item-content');
          const originalName = tableName.split('').map((c, i) =>
            tableName[i].toUpperCase() === c.toUpperCase() ? item.getAttribute('data-table-name').charAt(i) : c
          ).join('');

          // Restore original name format (we stored lowercase)
          const displayName = item.querySelector('.erd-sidebar-item-name').textContent || tableName;

          if (tableNameMatches && q) {
            nameEl.innerHTML = highlightText(displayName, q);
          } else {
            nameEl.textContent = displayName;
          }

          // Remove existing badge
          const existingBadge = contentEl.querySelector('.erd-col-count-badge');
          if (existingBadge) existingBadge.remove();

          // Show column count badge if columns match but table name doesn't
          if (hasColumnMatch && !tableNameMatches) {
            const badge = document.createElement('span');
            badge.className = 'erd-col-count-badge';
            badge.textContent = matchingColumns.length;
            contentEl.appendChild(badge);

            // Add matching columns list
            const colList = document.createElement('ul');
            colList.className = 'erd-column-list';
            matchingColumns.forEach(col => {
              const li = document.createElement('li');
              li.className = 'erd-column-item';
              li.setAttribute('data-table-id', item.getAttribute('data-table-id'));
              li.setAttribute('data-column', col.name);
              li.innerHTML = columnIconHtml +
                '<span class="erd-column-item-name">' + highlightText(col.name, q) + '</span>' +
                '<span class="erd-column-item-type">' + escapeHtml(col.type) + '</span>';
              colList.appendChild(li);
            });
            item.after(colList);
          }

          if (matches) visibleCount++;
        });

        // Show/hide schema blocks based on whether they have visible tables
        schemaBlocks.forEach(block => {
          const visibleItems = block.querySelectorAll('.erd-sidebar-item[style*="flex"]');
          block.style.display = visibleItems.length > 0 ? 'block' : 'none';

          // Expand schemas when searching
          if (q) {
            block.querySelector('.erd-schema-tables').classList.remove('collapsed');
            block.querySelector('.erd-schema-arrow').classList.remove('collapsed');
          }
        });

        updateSidebarCount(visibleCount, totalTables);

        // Show empty state if no results
        const existingEmpty = sidebarList.querySelector('.erd-sidebar-empty');
        if (existingEmpty) existingEmpty.remove();

        if (visibleCount === 0 && q !== '') {
          const emptyDiv = document.createElement('div');
          emptyDiv.className = 'erd-sidebar-empty';
          emptyDiv.textContent = 'No tables or columns match "' + q + '"';
          sidebarList.appendChild(emptyDiv);
        }
      }

      function setActiveSidebarItem(tableId) {
        if (activeSidebarItem) {
          activeSidebarItem.classList.remove('active');
        }
        const item = sidebarList.querySelector('.erd-sidebar-item[data-table-id="' + tableId + '"]');
        if (item) {
          item.classList.add('active');
          activeSidebarItem = item;
        }
      }

      // Sidebar toggle click
      sidebarToggle.addEventListener('click', toggleSidebar);
      sidebarClose.addEventListener('click', toggleSidebar);

      // Schema header toggle
      sidebarList.addEventListener('click', (e) => {
        const schemaHeader = e.target.closest('.erd-schema-header');
        if (schemaHeader) {
          toggleSchema(schemaHeader);
          return;
        }

        // Column item click
        const colItem = e.target.closest('.erd-column-item');
        if (colItem) {
          const tableId = colItem.getAttribute('data-table-id');
          const columnName = colItem.getAttribute('data-column');
          if (tableId) {
            setActiveSidebarItem(tableId);
            navigateToTable(tableId, columnName);
          }
          return;
        }

        // Table item click
        const item = e.target.closest('.erd-sidebar-item');
        if (item) {
          const tableId = item.getAttribute('data-table-id');
          if (tableId) {
            setActiveSidebarItem(tableId);
            navigateToTable(tableId);
          }
        }
      });

      // Sidebar search
      sidebarSearchInput.addEventListener('input', (e) => {
        filterSidebarTables(e.target.value);
      });

      // Initialize with fit view
      fitToView();
    `;

    // Calculate offset for tight bounds (remove original diagram padding, add our padding)
    const offsetX = bounds.minX + SIZING.DIAGRAM_PADDING - PADDING;
    const offsetY = bounds.minY + SIZING.DIAGRAM_PADDING - PADDING;

    // Generate table HTML
    const tablesHTML = nodes.map(node => {
      const { table, x, y, width, height, colorIndex } = node;
      const color = TABLE_COLORS[colorIndex];

      // Get PK and FK columns
      const pkCols = new Set<string>();
      const fkCols = new Set<string>();
      table.constraints.forEach(c => {
        const cols = c.localCols.split(',').map(s => s.trim().toUpperCase());
        if (c.type === 'Primary Key') cols.forEach(col => pkCols.add(col));
        if (c.type === 'Foreign Key') cols.forEach(col => fkCols.add(col));
      });

      const columnsHTML = table.columns.map(col => {
        const isPk = pkCols.has(col.name.toUpperCase());
        const isFk = fkCols.has(col.name.toUpperCase());
        const rowClass = isPk ? 'column-row pk-row' : (isFk ? 'column-row fk-row' : 'column-row');
        const nameClass = isPk ? 'column-name pk' : 'column-name';
        const keyIcon = isPk ? '<span class="column-key">&#128273;</span>' : (isFk ? '<span class="column-key">&#128279;</span>' : '');

        return `
          <div class="${rowClass}" data-column="${escapeHtml(col.name.toUpperCase())}">
            <div class="column-left">
              ${keyIcon}
              <span class="${nameClass}" style="${isPk ? `color: ${color.regular}` : ''}">${escapeHtml(col.name)}</span>
            </div>
            <span class="column-type">${escapeHtml(col.type)}</span>
          </div>
        `;
      }).join('');

      return `
        <div class="table-node" id="table-${escapeHtml(node.id)}" style="left: ${x - offsetX}px; top: ${y - offsetY}px; width: ${width}px; height: ${height}px;">
          <div class="table-color-strip" style="background: ${color.regular}"></div>
          <div class="table-header">
            <span class="table-name">${escapeHtml(table.tableName)}</span>
          </div>
          <div class="table-columns">
            ${columnsHTML}
          </div>
        </div>
      `;
    }).join('');

    // Generate SVG for edges (using tight bounds)
    const edgesHTML = edgePaths.length > 0 ? `
      <svg class="erd-svg" viewBox="0 0 ${tightBounds.width} ${tightBounds.height}" preserveAspectRatio="xMidYMid meet">
        ${edgePaths.map(ep => ep ? `
          <path
            d="${ep.path.split(' ').map(segment => {
              // Adjust coordinates relative to tight bounds offset
              return segment.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (_, x, y) => {
                return `${parseFloat(x) - offsetX},${parseFloat(y) - offsetY}`;
              });
            }).join(' ')}"
            fill="none"
            stroke="${ep.color}"
            stroke-width="${SIZING.CONNECTION_STROKE_WIDTH}"
            stroke-linecap="round"
            stroke-linejoin="round"
            opacity="0.7"
          />
        ` : '').join('')}
      </svg>
    ` : '';

    // SVG icons for HTML
    const searchIconSvg = `<svg class="erd-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>`;
    const sidebarSearchIconSvg = `<svg class="erd-sidebar-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>`;
    const chevronDownSvg = `<svg class="erd-schema-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;

    // Group tables by schema
    const tablesBySchema: Record<string, typeof nodes> = {};
    nodes.forEach(node => {
      const schema = node.table.schema || 'DEFAULT';
      if (!tablesBySchema[schema]) {
        tablesBySchema[schema] = [];
      }
      tablesBySchema[schema].push(node);
    });

    // Sort schemas alphabetically
    const sortedSchemas = Object.keys(tablesBySchema).sort();

    // Generate sidebar HTML grouped by schema
    const sidebarItemsHTML = sortedSchemas.map(schema => {
      const schemaTables = tablesBySchema[schema].sort((a, b) =>
        a.table.tableName.localeCompare(b.table.tableName)
      );

      const tablesHTML = schemaTables.map(node => {
        const color = TABLE_COLORS[node.colorIndex];
        // Generate columns data attribute for search
        const columnsData = node.table.columns.map(c =>
          `${c.name.toLowerCase()}|${c.type}`
        ).join(';;');

        return `
          <div class="erd-sidebar-item"
               data-table-id="${escapeHtml(node.id)}"
               data-table-name="${escapeHtml(node.table.tableName.toLowerCase())}"
               data-schema="${escapeHtml(schema.toLowerCase())}"
               data-columns="${escapeHtml(columnsData)}">
            <div class="erd-sidebar-item-color" style="background: ${color.regular}"></div>
            <div class="erd-sidebar-item-content">
              <span class="erd-sidebar-item-name">${escapeHtml(node.table.tableName)}</span>
            </div>
          </div>
        `;
      }).join('');

      return `
        <div class="erd-schema-block" data-schema="${escapeHtml(schema.toLowerCase())}">
          <div class="erd-schema-header" data-schema="${escapeHtml(schema)}">
            <span class="erd-schema-header-title">${escapeHtml(schema)}</span>
            ${chevronDownSvg}
          </div>
          <div class="erd-schema-tables">
            ${tablesHTML}
          </div>
        </div>
      `;
    }).join('');

    // Complete HTML document
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(scriptName)} - ERD Export</title>
  <style>${css}</style>
</head>
<body>
  <div class="erd-viewport">
    <!-- Sidebar Toggle Button -->
    <button id="erd-sidebar-toggle" class="erd-sidebar-toggle sidebar-open">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M3 9h18M9 21V9"/>
      </svg>
      <span id="toggle-text">Hide Tables</span>
    </button>

    <!-- Left Sidebar -->
    <div id="erd-sidebar" class="erd-sidebar">
      <div class="erd-sidebar-header">
        <span class="erd-sidebar-title">Tables</span>
        <button id="erd-sidebar-close" class="erd-sidebar-close" title="Hide sidebar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
      </div>
      <div class="erd-sidebar-search">
        <div class="erd-sidebar-search-wrapper">
          ${sidebarSearchIconSvg}
          <input type="text" id="erd-sidebar-search" class="erd-sidebar-search-input" placeholder="Filter tables..." autocomplete="off">
        </div>
      </div>
      <div id="erd-sidebar-list" class="erd-sidebar-list">
        ${sidebarItemsHTML}
      </div>
      <div id="erd-sidebar-count" class="erd-sidebar-count">
        ${tables.length} table${tables.length !== 1 ? 's' : ''}
      </div>
    </div>

    <!-- Main Canvas Area -->
    <div id="erd-canvas-wrapper" class="erd-canvas-wrapper fit-view">
      <div id="erd-canvas" class="erd-canvas">
        ${edgesHTML}
        ${tablesHTML}
      </div>
    </div>

    <div class="erd-floating-bar">
      <div class="erd-title">${escapeHtml(scriptName)}</div>
      <div class="erd-divider"></div>
      <div class="erd-stats">
        <span class="erd-stat">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          ${tables.length} tables
        </span>
        <span class="erd-stat">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          ${edges.length} relations
        </span>
      </div>
      <div class="erd-divider"></div>
      <span id="zoom-display" class="erd-zoom-display">100%</span>
      <span class="erd-hint">Ctrl+scroll to zoom</span>
      <div class="erd-divider"></div>
      <div class="erd-search-container">
        ${searchIconSvg}
        <input type="text" id="erd-search-input" class="erd-search-input" placeholder="Search tables or columns..." autocomplete="off">
        <div id="erd-search-dropdown" class="erd-search-dropdown"></div>
      </div>
    </div>
  </div>
  <script>${searchScript}</script>
</body>
</html>`;

    return html;
  };

  // Helper to escape HTML
  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Handle HTML download
  const handleDownloadHTML = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${scriptName.replace(/[^a-zA-Z0-9]/g, '_')}_ERD.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onClose();
  };

  // Handle print
  const handlePrint = () => {
    const html = generateHTML();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        width: '95%',
        maxWidth: '1400px',
        height: '90vh',
        background: isDarkTheme
          ? (darkThemeVariant === 'vscode-gray' ? '#1e1e1e' : '#1f2937')
          : '#ffffff',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: `1px solid ${theme.table.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: theme.table.headerBackground
        }}>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: theme.text.primary,
              margin: 0
            }}>
              Export ERD Preview
            </h2>
            <p style={{
              fontSize: '13px',
              color: theme.text.secondary,
              margin: '4px 0 0 0'
            }}>
              {tables.length} tables &bull; {edges.length} relationships &bull;
              Dimensions: {Math.round(bounds.width)} x {Math.round(bounds.height)}px
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              color: theme.text.secondary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = theme.table.headerBackground}
            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Preview Area */}
        <div
          ref={previewRef}
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '20px',
            background: theme.canvas.background,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{
            transform: `scale(${previewScale})`,
            transformOrigin: 'center center',
            position: 'relative',
            width: bounds.width,
            height: bounds.height,
            background: theme.canvas.background,
            border: `2px dashed ${theme.table.border}`,
            borderRadius: '8px'
          }}>
            {/* SVG for edges */}
            <svg
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
              viewBox={`0 0 ${bounds.width} ${bounds.height}`}
              preserveAspectRatio="xMidYMid meet"
            >
              {edgePaths.map(ep => ep && (
                <path
                  key={ep.id}
                  d={ep.path.split(' ').map(segment => {
                    return segment.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (_, x, y) => {
                      return `${parseFloat(x) - bounds.minX},${parseFloat(y) - bounds.minY}`;
                    });
                  }).join(' ')}
                  fill="none"
                  stroke={ep.color}
                  strokeWidth={SIZING.CONNECTION_STROKE_WIDTH}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.7}
                />
              ))}
            </svg>

            {/* Table nodes */}
            {nodes.map(node => {
              const { table, x, y, width, height, colorIndex } = node;
              const color = TABLE_COLORS[colorIndex];

              // Get PK and FK columns
              const pkCols = new Set<string>();
              const fkCols = new Set<string>();
              table.constraints.forEach(c => {
                const cols = c.localCols.split(',').map(s => s.trim().toUpperCase());
                if (c.type === 'Primary Key') cols.forEach(col => pkCols.add(col));
                if (c.type === 'Foreign Key') cols.forEach(col => fkCols.add(col));
              });

              return (
                <div
                  key={node.id}
                  style={{
                    position: 'absolute',
                    left: x - bounds.minX,
                    top: y - bounds.minY,
                    width,
                    height,
                    background: theme.table.background,
                    border: `1px solid ${theme.table.border}`,
                    borderRadius: '6px',
                    boxShadow: `3px 3px 6px ${theme.table.shadow}`,
                    overflow: 'hidden'
                  }}
                >
                  {/* Color strip */}
                  <div style={{
                    height: SIZING.TABLE_COLOR_HEIGHT,
                    background: color.regular
                  }} />

                  {/* Header */}
                  <div style={{
                    height: SIZING.TABLE_HEADER_HEIGHT,
                    padding: `0 ${SIZING.PADDING + 6}px`,
                    background: theme.table.headerBackground,
                    borderBottom: `1px solid ${theme.table.border}`,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontSize: FONTS.SIZE_TABLE_TITLE,
                      fontWeight: 'bold',
                      color: theme.text.primary,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {table.tableName}
                    </span>
                  </div>

                  {/* Columns */}
                  <div style={{ padding: `${SIZING.PADDING}px 0` }}>
                    {table.columns.map(col => {
                      const isPk = pkCols.has(col.name.toUpperCase());
                      const isFk = fkCols.has(col.name.toUpperCase());

                      return (
                        <div
                          key={col.name}
                          style={{
                            height: SIZING.COLUMN_HEIGHT,
                            padding: `0 ${SIZING.PADDING + 6}px`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: isPk ? color.lighter + '4D' : (isFk ? 'rgba(240, 249, 255, 0.3)' : 'transparent')
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            maxWidth: '55%'
                          }}>
                            {(isPk || isFk) && (
                              <span style={{ fontSize: '10px', flexShrink: 0 }}>
                                {isPk ? '🔑' : '🔗'}
                              </span>
                            )}
                            <span style={{
                              fontSize: FONTS.SIZE_SM,
                              fontWeight: isPk ? 'bold' : 'normal',
                              color: isPk ? color.regular : theme.text.primary,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {col.name}
                            </span>
                          </div>
                          <span style={{
                            fontSize: FONTS.SIZE_SM - 1,
                            color: theme.text.secondary,
                            textAlign: 'right',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '40%'
                          }}>
                            {col.type}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer with actions */}
        <div style={{
          padding: '16px 24px',
          borderTop: `1px solid ${theme.table.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: theme.table.headerBackground,
          gap: '12px'
        }}>
          <div style={{
            fontSize: '13px',
            color: theme.text.secondary
          }}>
            Preview shows how the exported HTML will appear. All tables and columns will be included.
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handlePrint}
              className="btn btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={handleDownloadHTML}
              className="btn btn-sm btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FileText size={16} />
              Download HTML
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
