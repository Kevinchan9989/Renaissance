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

  // Calculate bounding box of all nodes
  const bounds = useMemo(() => {
    if (nodes.length === 0) return { minX: 0, minY: 0, maxX: 800, maxY: 600, width: 800, height: 600 };

    const minX = Math.min(...nodes.map(n => n.x)) - SIZING.DIAGRAM_PADDING;
    const minY = Math.min(...nodes.map(n => n.y)) - SIZING.DIAGRAM_PADDING;
    const maxX = Math.max(...nodes.map(n => n.x + n.width)) + SIZING.DIAGRAM_PADDING;
    const maxY = Math.max(...nodes.map(n => n.y + n.height)) + SIZING.DIAGRAM_PADDING;

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
    const timestamp = new Date().toISOString();

    // Generate CSS
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
        background: ${theme.canvas.background};
        overflow: auto;
      }
      .erd-container {
        width: 100%;
        min-height: 100vh;
        padding: 20px;
        background: ${theme.canvas.background};
      }
      .erd-header {
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid ${theme.table.border};
      }
      .erd-title {
        font-size: 24px;
        font-weight: 600;
        color: ${theme.text.primary};
        margin-bottom: 5px;
      }
      .erd-meta {
        font-size: 12px;
        color: ${theme.text.secondary};
      }
      .erd-canvas {
        position: relative;
        width: ${bounds.width}px;
        height: ${bounds.height}px;
        margin: 0 auto;
      }
      .erd-svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }
      .table-node {
        position: absolute;
        background: ${theme.table.background};
        border: 1px solid ${theme.table.border};
        border-radius: 6px;
        box-shadow: 3px 3px 6px ${theme.table.shadow};
        overflow: hidden;
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
        .erd-container {
          padding: 0;
        }
        .erd-canvas {
          transform-origin: top left;
        }
        .table-node {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `;

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
          <div class="${rowClass}">
            <div class="column-left">
              ${keyIcon}
              <span class="${nameClass}" style="${isPk ? `color: ${color.regular}` : ''}">${escapeHtml(col.name)}</span>
            </div>
            <span class="column-type">${escapeHtml(col.type)}</span>
          </div>
        `;
      }).join('');

      return `
        <div class="table-node" style="left: ${x - bounds.minX}px; top: ${y - bounds.minY}px; width: ${width}px; height: ${height}px;">
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

    // Generate SVG for edges
    const edgesHTML = edgePaths.length > 0 ? `
      <svg class="erd-svg" viewBox="0 0 ${bounds.width} ${bounds.height}" preserveAspectRatio="xMidYMid meet">
        ${edgePaths.map(ep => ep ? `
          <path
            d="${ep.path.split(' ').map(segment => {
              // Adjust coordinates relative to bounds
              return segment.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g, (_, x, y) => {
                return `${parseFloat(x) - bounds.minX},${parseFloat(y) - bounds.minY}`;
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
  <div class="erd-container">
    <div class="erd-header">
      <div class="erd-title">${escapeHtml(scriptName)} - Entity Relationship Diagram</div>
      <div class="erd-meta">
        ${tables.length} tables &bull; ${edges.length} relationships &bull;
        Generated: ${timestamp}
      </div>
    </div>
    <div class="erd-canvas">
      ${edgesHTML}
      ${tablesHTML}
    </div>
  </div>
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
