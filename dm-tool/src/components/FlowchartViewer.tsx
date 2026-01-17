import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Stage, Layer, Rect, Text, Circle, Line, Group, Arrow } from 'react-konva';
import dagre from '@dagrejs/dagre';
import { FlowchartScript, PUMLNode } from '../types';
import {
  FLOWCHART_SIZING,
  getNodeColors,
  getSwimlaneColor,
  calculateNodeWidth,
} from '../constants/flowchart';
import {
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  ChevronDown,
} from 'lucide-react';

interface FlowchartViewerProps {
  flowchartScripts: FlowchartScript[];
  isDarkTheme?: boolean;
  darkThemeVariant?: 'slate' | 'vscode-gray';
}

interface NodePosition {
  x: number;
  y: number;
}

interface CanvasNode {
  id: string;
  node: PUMLNode;
  x: number;
  y: number;
  width: number;
  height: number;
  swimlaneIndex: number;
}

export default function FlowchartViewer({
  flowchartScripts,
  isDarkTheme = false,
  darkThemeVariant = 'slate',
}: FlowchartViewerProps) {
  // State
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(
    flowchartScripts.length > 0 ? flowchartScripts[0].id : null
  );
  const [showScriptDropdown, setShowScriptDropdown] = useState(false);
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({});
  const [stagePosition, setStagePosition] = useState({ x: 50, y: 50 });
  const [scale, setScale] = useState(0.9);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isDraggingStage, setIsDraggingStage] = useState(false);
  const [, setInitialLayoutDone] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Get selected script
  const selectedScript = useMemo(() => {
    return flowchartScripts.find(s => s.id === selectedScriptId) || null;
  }, [flowchartScripts, selectedScriptId]);

  // Theme
  const theme = useMemo(() => {
    const colors = getNodeColors(isDarkTheme);
    return {
      background: isDarkTheme
        ? (darkThemeVariant === 'vscode-gray' ? '#1e1e1e' : '#1f2937')
        : '#f8fafc',
      text: {
        primary: isDarkTheme ? '#f9fafb' : '#1f2937',
        secondary: isDarkTheme ? '#9ca3af' : '#6b7280',
      },
      toolbar: {
        background: isDarkTheme
          ? (darkThemeVariant === 'vscode-gray' ? '#252526' : '#374151')
          : '#ffffff',
        border: isDarkTheme ? '#4b5563' : '#e5e7eb',
      },
      node: colors,
    };
  }, [isDarkTheme, darkThemeVariant]);

  // Container dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Load saved positions
  useEffect(() => {
    if (selectedScript) {
      const saved = localStorage.getItem(`flowchart_positions_${selectedScript.id}`);
      if (saved) {
        setNodePositions(JSON.parse(saved));
        setInitialLayoutDone(true);
      } else {
        setNodePositions({});
        setInitialLayoutDone(false);
      }
    }
  }, [selectedScript?.id]);

  // Calculate layout using dagre
  const layoutData = useMemo(() => {
    if (!selectedScript) return { nodes: [], swimlaneWidths: {} };

    const diagram = selectedScript.data;
    const nodes = diagram.nodes;
    const connections = diagram.connections;
    const swimlanes = diagram.swimlanes;

    // Create dagre graph
    const g = new dagre.graphlib.Graph();
    g.setGraph({
      rankdir: 'TB', // Top to bottom (vertical flow)
      nodesep: FLOWCHART_SIZING.GAP_X,
      ranksep: FLOWCHART_SIZING.GAP_Y,
      marginx: FLOWCHART_SIZING.DIAGRAM_PADDING,
      marginy: FLOWCHART_SIZING.DIAGRAM_PADDING,
    });
    g.setDefaultEdgeLabel(() => ({}));

    // Add nodes to graph
    const nodeMap = new Map<string, CanvasNode>();
    nodes.forEach(node => {
      let width = FLOWCHART_SIZING.NODE_MIN_WIDTH;
      let height = FLOWCHART_SIZING.NODE_HEIGHT;

      if (node.type === 'start' || node.type === 'stop') {
        width = FLOWCHART_SIZING.TERMINAL_RADIUS * 2;
        height = FLOWCHART_SIZING.TERMINAL_RADIUS * 2;
      } else if (node.type === 'decision' || node.type === 'while-start' || node.type === 'repeat-end') {
        width = FLOWCHART_SIZING.DECISION_SIZE;
        height = FLOWCHART_SIZING.DECISION_SIZE;
      } else if (node.type === 'fork' || node.type === 'join') {
        width = FLOWCHART_SIZING.FORK_WIDTH;
        height = FLOWCHART_SIZING.FORK_HEIGHT;
      } else if (node.type === 'activity') {
        width = calculateNodeWidth(node.text);
      }

      // Find swimlane index
      const swimlaneIndex = swimlanes.findIndex(s => s.name === node.swimlane);

      g.setNode(node.id, { width, height });

      nodeMap.set(node.id, {
        id: node.id,
        node,
        x: 0,
        y: 0,
        width,
        height,
        swimlaneIndex: swimlaneIndex >= 0 ? swimlaneIndex : 0,
      });
    });

    // Add edges to graph
    connections.forEach(conn => {
      if (nodeMap.has(conn.from) && nodeMap.has(conn.to)) {
        g.setEdge(conn.from, conn.to);
      }
    });

    // Run layout
    dagre.layout(g);

    // Extract positions
    const canvasNodes: CanvasNode[] = [];
    const swimlaneWidths: Record<number, { minX: number; maxX: number }> = {};

    g.nodes().forEach(nodeId => {
      const nodeData = g.node(nodeId);
      const canvasNode = nodeMap.get(nodeId);
      if (canvasNode && nodeData) {
        canvasNode.x = nodeData.x - nodeData.width / 2;
        canvasNode.y = nodeData.y - nodeData.height / 2;

        // Track swimlane bounds
        const swimIdx = canvasNode.swimlaneIndex;
        if (!swimlaneWidths[swimIdx]) {
          swimlaneWidths[swimIdx] = { minX: canvasNode.x, maxX: canvasNode.x + canvasNode.width };
        } else {
          swimlaneWidths[swimIdx].minX = Math.min(swimlaneWidths[swimIdx].minX, canvasNode.x);
          swimlaneWidths[swimIdx].maxX = Math.max(swimlaneWidths[swimIdx].maxX, canvasNode.x + canvasNode.width);
        }

        canvasNodes.push(canvasNode);
      }
    });

    return { nodes: canvasNodes, swimlaneWidths };
  }, [selectedScript]);

  // Get node positions (use saved or layout)
  const getNodePosition = useCallback((nodeId: string, defaultPos: { x: number; y: number }) => {
    if (nodePositions[nodeId]) {
      return nodePositions[nodeId];
    }
    return defaultPos;
  }, [nodePositions]);

  // Handle node drag
  const handleNodeDragEnd = useCallback((nodeId: string, newX: number, newY: number) => {
    const newPositions = { ...nodePositions, [nodeId]: { x: newX, y: newY } };
    setNodePositions(newPositions);
    if (selectedScript) {
      localStorage.setItem(`flowchart_positions_${selectedScript.id}`, JSON.stringify(newPositions));
    }
  }, [nodePositions, selectedScript]);

  // Zoom controls
  const handleZoomIn = () => setScale(s => Math.min(s * 1.2, 3));
  const handleZoomOut = () => setScale(s => Math.max(s / 1.2, 0.3));
  const handleFitToView = () => {
    setScale(0.9);
    setStagePosition({ x: 50, y: 50 });
  };
  const handleResetView = () => {
    setScale(0.9);
    setStagePosition({ x: 50, y: 50 });
    setNodePositions({});
    if (selectedScript) {
      localStorage.removeItem(`flowchart_positions_${selectedScript.id}`);
    }
    setInitialLayoutDone(false);
  };

  // Wheel zoom
  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.02;
    const oldScale = scale;
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setScale(Math.min(Math.max(newScale, 0.3), 3));
  }, [scale]);

  // Search functionality
  useEffect(() => {
    if (!searchQuery || !selectedScript) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = selectedScript.data.nodes
      .filter(node => node.text.toLowerCase().includes(query))
      .map(node => node.id);
    setSearchResults(results);
  }, [searchQuery, selectedScript]);

  const handleSearchSelect = (nodeId: string) => {
    setHighlightedNodeId(nodeId);
    setShowSearchDropdown(false);
    setSearchQuery('');
    // Center on node
    const node = layoutData.nodes.find(n => n.id === nodeId);
    if (node) {
      const pos = getNodePosition(node.id, { x: node.x, y: node.y });
      setStagePosition({
        x: dimensions.width / 2 - pos.x * scale,
        y: dimensions.height / 2 - pos.y * scale,
      });
    }
    setTimeout(() => setHighlightedNodeId(null), 3000);
  };

  // Render node based on type
  const renderNode = (canvasNode: CanvasNode) => {
    const { id, node, width, height, swimlaneIndex } = canvasNode;
    const pos = getNodePosition(id, { x: canvasNode.x, y: canvasNode.y });
    const isHovered = hoveredNodeId === id;
    const isHighlighted = highlightedNodeId === id;
    const swimlaneColor = getSwimlaneColor(swimlaneIndex);
    const colors = theme.node;

    const commonProps = {
      key: id,
      x: pos.x,
      y: pos.y,
      draggable: true,
      onDragEnd: (e: any) => handleNodeDragEnd(id, e.target.x(), e.target.y()),
      onMouseEnter: () => setHoveredNodeId(id),
      onMouseLeave: () => setHoveredNodeId(null),
    };

    switch (node.type) {
      case 'start':
        return (
          <Group {...commonProps} x={pos.x + FLOWCHART_SIZING.TERMINAL_RADIUS} y={pos.y + FLOWCHART_SIZING.TERMINAL_RADIUS}>
            <Circle
              radius={FLOWCHART_SIZING.TERMINAL_RADIUS}
              fill={colors.start.fill}
              stroke={isHovered || isHighlighted ? swimlaneColor.regular : colors.start.stroke}
              strokeWidth={isHovered || isHighlighted ? 3 : 2}
            />
          </Group>
        );

      case 'stop':
        return (
          <Group {...commonProps} x={pos.x + FLOWCHART_SIZING.TERMINAL_RADIUS} y={pos.y + FLOWCHART_SIZING.TERMINAL_RADIUS}>
            <Circle
              radius={FLOWCHART_SIZING.TERMINAL_RADIUS}
              fill={colors.stop.fill}
              stroke={isHovered || isHighlighted ? swimlaneColor.regular : colors.stop.stroke}
              strokeWidth={isHovered || isHighlighted ? 3 : 2}
            />
            <Circle
              radius={FLOWCHART_SIZING.TERMINAL_RADIUS - 6}
              fill={colors.stop.fill}
              stroke={colors.stop.text}
              strokeWidth={2}
            />
          </Group>
        );

      case 'kill':
        return (
          <Group {...commonProps} x={pos.x + width / 2} y={pos.y + height / 2}>
            <Circle
              radius={16}
              fill={colors.kill.fill}
              stroke={colors.kill.stroke}
              strokeWidth={2}
            />
            <Text
              text="X"
              fontSize={18}
              fontStyle="bold"
              fill={colors.kill.text}
              x={-6}
              y={-10}
            />
          </Group>
        );

      case 'decision':
      case 'while-start':
      case 'repeat-end':
        const diamondColors = node.type === 'decision' ? colors.decision : colors.whileStart;
        const diamondSize = FLOWCHART_SIZING.DECISION_SIZE / 2;
        return (
          <Group {...commonProps}>
            <Line
              points={[
                diamondSize, 0,
                diamondSize * 2, diamondSize,
                diamondSize, diamondSize * 2,
                0, diamondSize,
              ]}
              closed
              fill={diamondColors.fill}
              stroke={isHovered || isHighlighted ? swimlaneColor.regular : diamondColors.stroke}
              strokeWidth={isHovered || isHighlighted ? 3 : 2}
            />
            <Text
              text={node.text.length > 15 ? node.text.substring(0, 12) + '...' : node.text}
              fontSize={11}
              fill={diamondColors.text}
              x={6}
              y={diamondSize - 6}
              width={diamondSize * 2 - 12}
              align="center"
            />
          </Group>
        );

      case 'fork':
      case 'join':
        return (
          <Group {...commonProps}>
            <Rect
              width={FLOWCHART_SIZING.FORK_WIDTH}
              height={FLOWCHART_SIZING.FORK_HEIGHT}
              fill={colors.fork.fill}
              cornerRadius={2}
            />
          </Group>
        );

      case 'activity':
      default:
        return (
          <Group {...commonProps}>
            {/* Shadow */}
            <Rect
              x={2}
              y={2}
              width={width}
              height={height}
              fill={isDarkTheme ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}
              cornerRadius={FLOWCHART_SIZING.NODE_BORDER_RADIUS}
            />
            {/* Main rect */}
            <Rect
              width={width}
              height={height}
              fill={colors.activity.fill}
              stroke={isHovered || isHighlighted ? swimlaneColor.regular : colors.activity.stroke}
              strokeWidth={isHovered || isHighlighted ? 2 : 1}
              cornerRadius={FLOWCHART_SIZING.NODE_BORDER_RADIUS}
            />
            {/* Left accent bar */}
            <Rect
              width={4}
              height={height}
              fill={swimlaneColor.regular}
              cornerRadius={[FLOWCHART_SIZING.NODE_BORDER_RADIUS, 0, 0, FLOWCHART_SIZING.NODE_BORDER_RADIUS]}
            />
            {/* Text */}
            <Text
              text={node.text}
              fontSize={13}
              fill={colors.activity.text}
              x={12}
              y={(height - 13) / 2}
              width={width - 20}
              ellipsis
            />
          </Group>
        );
    }
  };

  // Render connections
  const renderConnections = () => {
    if (!selectedScript) return null;

    return selectedScript.data.connections.map(conn => {
      const fromNode = layoutData.nodes.find(n => n.id === conn.from);
      const toNode = layoutData.nodes.find(n => n.id === conn.to);

      if (!fromNode || !toNode) return null;

      const fromPos = getNodePosition(fromNode.id, { x: fromNode.x, y: fromNode.y });
      const toPos = getNodePosition(toNode.id, { x: toNode.x, y: toNode.y });

      // Calculate connection points
      let startX = fromPos.x + fromNode.width / 2;
      let startY = fromPos.y + fromNode.height;
      let endX = toPos.x + toNode.width / 2;
      let endY = toPos.y;

      // Adjust for different node types
      if (fromNode.node.type === 'start' || fromNode.node.type === 'stop') {
        startX = fromPos.x + FLOWCHART_SIZING.TERMINAL_RADIUS;
        startY = fromPos.y + FLOWCHART_SIZING.TERMINAL_RADIUS * 2;
      }
      if (toNode.node.type === 'start' || toNode.node.type === 'stop') {
        endX = toPos.x + FLOWCHART_SIZING.TERMINAL_RADIUS;
        endY = toPos.y;
      }
      if (fromNode.node.type === 'decision' || fromNode.node.type === 'while-start') {
        startY = fromPos.y + FLOWCHART_SIZING.DECISION_SIZE;
      }
      if (toNode.node.type === 'decision' || toNode.node.type === 'while-start') {
        endY = toPos.y;
      }

      const swimlaneColor = getSwimlaneColor(fromNode.swimlaneIndex);
      const isHighlighted = hoveredNodeId === fromNode.id || hoveredNodeId === toNode.id;

      // Simple bezier curve
      const midY = (startY + endY) / 2;
      const points = [startX, startY, startX, midY, endX, midY, endX, endY];

      return (
        <Group key={conn.id}>
          <Line
            points={points}
            stroke={isHighlighted ? swimlaneColor.regular : (isDarkTheme ? '#6b7280' : '#9ca3af')}
            strokeWidth={isHighlighted ? 2.5 : 1.5}
            tension={0.3}
            bezier
          />
          {/* Arrowhead */}
          <Arrow
            points={[endX, endY - 10, endX, endY]}
            stroke={isHighlighted ? swimlaneColor.regular : (isDarkTheme ? '#6b7280' : '#9ca3af')}
            fill={isHighlighted ? swimlaneColor.regular : (isDarkTheme ? '#6b7280' : '#9ca3af')}
            pointerLength={8}
            pointerWidth={6}
          />
          {/* Condition label */}
          {conn.condition && (
            <Text
              text={conn.condition}
              fontSize={10}
              fill={theme.text.secondary}
              x={(startX + endX) / 2 + 5}
              y={(startY + endY) / 2 - 5}
            />
          )}
        </Group>
      );
    });
  };

  // Render swimlanes
  const renderSwimlanes = () => {
    if (!selectedScript || selectedScript.data.swimlanes.length === 0) return null;

    const swimlanes = selectedScript.data.swimlanes;
    const swimlaneWidth = FLOWCHART_SIZING.SWIMLANE_MIN_WIDTH;

    return swimlanes.map((swimlane, index) => {
      const color = swimlane.color || getSwimlaneColor(index).lighter;
      const headerColor = getSwimlaneColor(index).header;
      const x = index * (swimlaneWidth + FLOWCHART_SIZING.SWIMLANE_GAP);

      return (
        <Group key={swimlane.id}>
          {/* Swimlane background */}
          <Rect
            x={x}
            y={0}
            width={swimlaneWidth}
            height={dimensions.height * 2}
            fill={isDarkTheme ? `${color}15` : `${color}40`}
          />
          {/* Swimlane header */}
          <Rect
            x={x}
            y={0}
            width={swimlaneWidth}
            height={FLOWCHART_SIZING.SWIMLANE_HEADER_HEIGHT}
            fill={headerColor}
          />
          <Text
            text={swimlane.name}
            fontSize={13}
            fontStyle="bold"
            fill="#ffffff"
            x={x}
            y={10}
            width={swimlaneWidth}
            align="center"
          />
        </Group>
      );
    });
  };

  if (flowchartScripts.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.background,
          color: theme.text.secondary,
          padding: '40px',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="6" height="6" rx="1" />
            <rect x="15" y="3" width="6" height="6" rx="1" />
            <rect x="9" y="15" width="6" height="6" rx="1" />
            <path d="M6 9v3a1 1 0 001 1h10a1 1 0 001-1V9" />
            <path d="M12 13v2" />
          </svg>
        </div>
        <div style={{ fontSize: '16px', marginBottom: '8px' }}>No Flowcharts Available</div>
        <div style={{ fontSize: '13px', opacity: 0.7 }}>
          Create a flowchart in the Scripts page to view it here
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: theme.background,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 16px',
          background: theme.toolbar.background,
          borderBottom: `1px solid ${theme.toolbar.border}`,
          backdropFilter: 'blur(8px)',
          zIndex: 10,
        }}
      >
        {/* Script selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowScriptDropdown(!showScriptDropdown)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              background: isDarkTheme ? '#374151' : '#f3f4f6',
              border: `1px solid ${theme.toolbar.border}`,
              borderRadius: '6px',
              cursor: 'pointer',
              color: theme.text.primary,
              fontSize: '13px',
            }}
          >
            <span>{selectedScript?.name || 'Select Flowchart'}</span>
            <ChevronDown size={14} />
          </button>
          {showScriptDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                background: theme.toolbar.background,
                border: `1px solid ${theme.toolbar.border}`,
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 100,
                minWidth: '200px',
              }}
            >
              {flowchartScripts.map(script => (
                <button
                  key={script.id}
                  onClick={() => {
                    setSelectedScriptId(script.id);
                    setShowScriptDropdown(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '8px 12px',
                    background: script.id === selectedScriptId ? (isDarkTheme ? '#4b5563' : '#e5e7eb') : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: theme.text.primary,
                    fontSize: '13px',
                  }}
                >
                  {script.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, maxWidth: '300px' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: theme.text.secondary,
            }}
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            style={{
              width: '100%',
              padding: '6px 12px 6px 32px',
              background: isDarkTheme ? '#374151' : '#f3f4f6',
              border: `1px solid ${theme.toolbar.border}`,
              borderRadius: '6px',
              color: theme.text.primary,
              fontSize: '13px',
              outline: 'none',
            }}
          />
          {showSearchDropdown && searchResults.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '4px',
                background: theme.toolbar.background,
                border: `1px solid ${theme.toolbar.border}`,
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                maxHeight: '200px',
                overflowY: 'auto',
                zIndex: 100,
              }}
            >
              {searchResults.map(nodeId => {
                const node = selectedScript?.data.nodes.find(n => n.id === nodeId);
                return node ? (
                  <button
                    key={nodeId}
                    onClick={() => handleSearchSelect(nodeId)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 12px',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: theme.text.primary,
                      fontSize: '13px',
                    }}
                  >
                    {node.text}
                  </button>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Zoom controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={handleZoomOut}
            style={{
              padding: '6px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: theme.text.secondary,
              borderRadius: '4px',
            }}
            title="Zoom Out"
          >
            <ZoomOut size={18} />
          </button>
          <span style={{ fontSize: '12px', color: theme.text.secondary, width: '45px', textAlign: 'center' }}>
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            style={{
              padding: '6px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: theme.text.secondary,
              borderRadius: '4px',
            }}
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={handleFitToView}
            style={{
              padding: '6px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: theme.text.secondary,
              borderRadius: '4px',
            }}
            title="Fit to View"
          >
            <Maximize2 size={18} />
          </button>
          <button
            onClick={handleResetView}
            style={{
              padding: '6px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: theme.text.secondary,
              borderRadius: '4px',
            }}
            title="Reset View"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Stage
          width={dimensions.width}
          height={dimensions.height - 50}
          x={stagePosition.x}
          y={stagePosition.y}
          scaleX={scale}
          scaleY={scale}
          draggable
          onDragStart={() => setIsDraggingStage(true)}
          onDragEnd={(e) => {
            setIsDraggingStage(false);
            setStagePosition({ x: e.target.x(), y: e.target.y() });
          }}
          onWheel={handleWheel}
          style={{ cursor: isDraggingStage ? 'grabbing' : 'grab' }}
        >
          <Layer>
            {/* Swimlanes (background) */}
            {renderSwimlanes()}

            {/* Connections */}
            {renderConnections()}

            {/* Nodes */}
            {layoutData.nodes.map(renderNode)}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
