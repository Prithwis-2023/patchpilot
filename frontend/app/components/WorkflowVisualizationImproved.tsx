"use client";

import { motion } from "framer-motion";
import { useState } from "react";

/* 
  Design Philosophy: Cybernetic Brutalism
  Improved workflow visualization with steps integrated into nodes
*/

interface WorkflowNode {
  id: string;
  step: string;
  label: string;
  description: string;
  color: "cyan" | "magenta" | "lime";
  position: { x: number; y: number };
  details: string[];
}

const nodes: WorkflowNode[] = [
  {
    id: "upload",
    step: "01",
    label: "UPLOAD",
    description: "Video Input",
    color: "cyan",
    position: { x: 10, y: 50 },
    details: ["30-60s recording", "MP4/WebM format", "Auto compression"]
  },
  {
    id: "analyze",
    step: "02",
    label: "ANALYZE",
    description: "AI Processing",
    color: "magenta",
    position: { x: 30, y: 20 },
    details: ["Extract frames", "Detect UI changes", "Identify states"]
  },
  {
    id: "extract",
    step: "03",
    label: "EXTRACT",
    description: "Step Timeline",
    color: "lime",
    position: { x: 50, y: 0 },
    details: ["Build sequence", "Map interactions", "Create timeline"]
  },
  {
    id: "generate",
    step: "04",
    label: "GENERATE",
    description: "Test Creation",
    color: "cyan",
    position: { x: 70, y: 20 },
    details: ["Write Playwright", "Add assertions", "Validate syntax"]
  },
  {
    id: "execute",
    step: "05",
    label: "EXECUTE",
    description: "Test Running",
    color: "magenta",
    position: { x: 90, y: 50 },
    details: ["Run test suite", "Capture results", "Log failures"]
  },
  {
    id: "patch",
    step: "06",
    label: "PATCH",
    description: "Fix Suggestion",
    color: "lime",
    position: { x: 70, y: 80 },
    details: ["Analyze error", "Suggest fix", "Generate code"]
  },
  {
    id: "export",
    step: "07",
    label: "EXPORT",
    description: "Report Output",
    color: "cyan",
    position: { x: 50, y: 100 },
    details: ["Bundle files", "Create report", "Ready to download"]
  }
];

export default function WorkflowVisualizationImproved() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(nodes[0].id);

  const getColorClass = (color: "cyan" | "magenta" | "lime") => {
    switch (color) {
      case "cyan":
        return "text-[var(--neon-cyan)]";
      case "magenta":
        return "text-[var(--neon-magenta)]";
      case "lime":
        return "text-[var(--neon-lime)]";
    }
  };

  const getBorderClass = (color: "cyan" | "magenta" | "lime") => {
    switch (color) {
      case "cyan":
        return "border-[var(--neon-cyan)]";
      case "magenta":
        return "border-[var(--neon-magenta)]";
      case "lime":
        return "border-[var(--neon-lime)]";
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* SVG Visualization */}
      <div className="w-full overflow-x-auto overflow-y-visible">
        <svg
          className="w-full min-w-full h-[600px]"
          viewBox="0 -50 1000 1250"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="gradient-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ffff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00ffff" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="gradient-magenta" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff00ff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ff00ff" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="gradient-lime" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ff00" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00ff00" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Connection paths */}
          {[
            { from: 0, to: 1, gradient: "gradient-cyan" },
            { from: 1, to: 2, gradient: "gradient-magenta" },
            { from: 2, to: 3, gradient: "gradient-lime" },
            { from: 3, to: 4, gradient: "gradient-cyan" },
            { from: 4, to: 5, gradient: "gradient-magenta" },
            { from: 5, to: 6, gradient: "gradient-lime" }
          ].map((connection, index) => {
            const fromNode = nodes[connection.from];
            const toNode = nodes[connection.to];
            // Map 0-100% positions to viewBox with 50px padding top and bottom
            // This ensures Node 03 (y: 0) has room for hexagon extension above, and Node 07 (y: 100) has room below
            const x1 = (fromNode.position.x / 100) * 1000;
            const y1 = 50 + (fromNode.position.y / 100) * 1100;
            const x2 = (toNode.position.x / 100) * 1000;
            const y2 = 50 + (toNode.position.y / 100) * 1100;

            return (
              <motion.line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={`url(#${connection.gradient})`}
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: index * 0.2 }}
              />
            );
          })}

          {/* Nodes with integrated steps */}
          {nodes.map((node, index) => {
            // Map 0-100% positions to viewBox with 50px padding top and bottom
            // Node 03 (y: 0) → y = 50 (hexagon top at 10, visible)
            // Node 07 (y: 100) → y = 1150 (hexagon bottom at 1190, visible)
            // ViewBox: 0 -50 1000 1250 (starts at -50, goes to 1200)
            const x = (node.position.x / 100) * 1000;
            const y = 50 + (node.position.y / 100) * 1100;
            const isHovered = hoveredNode === node.id;
            const isSelected = selectedNode === node.id;

            return (
              <motion.g
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(node.id)}
                style={{ cursor: "pointer" }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Outer hexagon */}
                <motion.polygon
                  points={`${x},${y - 40} ${x + 35},${y - 20} ${x + 35},${y + 20} ${x},${y + 40} ${x - 35},${y + 20} ${x - 35},${y - 20}`}
                  fill={
                    isSelected
                      ? `${node.color === "cyan" ? "#00ffff" : node.color === "magenta" ? "#ff00ff" : "#00ff00"}30`
                      : isHovered
                      ? `${node.color === "cyan" ? "#00ffff" : node.color === "magenta" ? "#ff00ff" : "#00ff00"}20`
                      : "none"
                  }
                  stroke={node.color === "cyan" ? "#00ffff" : node.color === "magenta" ? "#ff00ff" : "#00ff00"}
                  strokeWidth={isSelected ? "3" : isHovered ? "2.5" : "2"}
                  animate={{
                    filter: isSelected ? "drop-shadow(0 0 15px currentColor)" : isHovered ? "drop-shadow(0 0 10px currentColor)" : "drop-shadow(0 0 0px currentColor)"
                  }}
                  transition={{ duration: 0.3 }}
                />

                {/* Step number - large */}
                <text
                  x={x}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize="24"
                  fontWeight="bold"
                  fill={node.color === "cyan" ? "#00ffff" : node.color === "magenta" ? "#ff00ff" : "#00ff00"}
                  fontFamily="monospace"
                >
                  {node.step}
                </text>

                {/* Label - smaller */}
                <text
                  x={x}
                  y={y + 15}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="white"
                  fontFamily="monospace"
                >
                  {node.label}
                </text>

                {/* Center glow */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill={node.color === "cyan" ? "#00ffff" : node.color === "magenta" ? "#ff00ff" : "#00ff00"}
                  opacity={isHovered ? 0.8 : 0.4}
                  animate={{
                    r: isHovered ? 10 : 6
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details - Desktop only - Improved contrast and integration */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="hidden md:block mt-8"
        >
          <div className={`p-6 bg-card/80 backdrop-blur-xl border-2 ${getBorderClass(nodes.find(n => n.id === selectedNode)!.color)} rounded-lg`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step info */}
              <div className="space-y-3">
                <div className={`text-5xl font-bold ${getColorClass(nodes.find(n => n.id === selectedNode)!.color)}`}>
                  {nodes.find(n => n.id === selectedNode)!.step}
                </div>
                <div>
                  <h4 className={`text-xl font-bold ${getColorClass(nodes.find(n => n.id === selectedNode)!.color)}`} style={{ fontFamily: 'var(--font-display)' }}>
                    {nodes.find(n => n.id === selectedNode)!.label}
                  </h4>
                  <p className="text-sm text-foreground/80 mt-1">
                    {nodes.find(n => n.id === selectedNode)!.description}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="md:col-span-2">
                <h5 className="text-sm font-bold text-foreground/60 mb-4 uppercase">Process Details</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {nodes.find(n => n.id === selectedNode)!.details.map((detail, index) => (
                    <motion.div
                      key={index}
                      className="p-3 bg-muted/30 border border-border/50 rounded"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="text-sm font-mono text-foreground">
                        <span className={`text-lg font-bold ${getColorClass(nodes.find(n => n.id === selectedNode)!.color)}`}>→</span> <span className="text-foreground">{detail}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mobile-friendly step list - minimal, no extra buttons */}
      <div className="md:hidden space-y-3">
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`p-6 bg-card/80 backdrop-blur-xl border-2 ${getBorderClass(nodes.find(n => n.id === selectedNode)!.color)} rounded-lg`}>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className={`text-3xl font-bold ${getColorClass(nodes.find(n => n.id === selectedNode)!.color)}`}>
                    {nodes.find(n => n.id === selectedNode)!.step}
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold ${getColorClass(nodes.find(n => n.id === selectedNode)!.color)}`} style={{ fontFamily: 'var(--font-display)' }}>
                      {nodes.find(n => n.id === selectedNode)!.label}
                    </h4>
                    <p className="text-sm text-foreground/80">
                      {nodes.find(n => n.id === selectedNode)!.description}
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-border/30">
                  <h5 className="text-sm font-bold text-foreground/60 mb-3 uppercase">Process Details</h5>
                  <div className="space-y-2">
                    {nodes.find(n => n.id === selectedNode)!.details.map((detail, index) => (
                      <div
                        key={index}
                        className="p-3 bg-muted/30 border border-border/50 rounded"
                      >
                        <div className="text-sm font-mono text-foreground">
                          <span className={`text-lg font-bold ${getColorClass(nodes.find(n => n.id === selectedNode)!.color)}`}>→</span> <span className="text-foreground">{detail}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
