"use client";

import { motion } from "framer-motion";
import { WorkflowStep, type GeneratedTest, type RunResult, type PatchResult, type BugReport } from "../lib/types";
import { fadeSlide, pop } from "../lib/motion";

interface ArtifactGraphProps {
  artifacts: {
    video?: boolean;
    analysis?: boolean;
    test?: GeneratedTest | null;
    runResult?: RunResult | null;
    patch?: PatchResult | null;
    bugReport?: BugReport | null;
  };
  onNodeClick?: (node: string) => void;
}

const nodes = [
  { id: "video", label: "Video", step: WorkflowStep.UPLOAD },
  { id: "analysis", label: "Analysis", step: WorkflowStep.ANALYZE },
  { id: "test", label: "Test", step: WorkflowStep.TEST },
  { id: "run", label: "Run", step: WorkflowStep.RUN },
  { id: "patch", label: "Patch", step: WorkflowStep.PATCH },
  { id: "report", label: "Report", step: WorkflowStep.EXPORT },
];

const edges = [
  { from: "video", to: "analysis" },
  { from: "analysis", to: "test" },
  { from: "test", to: "run" },
  { from: "run", to: "patch" },
  { from: "patch", to: "report" },
];

export default function ArtifactGraph({ artifacts, onNodeClick }: ArtifactGraphProps) {
  const isNodeActive = (nodeId: string): boolean => {
    switch (nodeId) {
      case "video":
        return artifacts.video || false;
      case "analysis":
        return artifacts.analysis || false;
      case "test":
        return !!artifacts.test;
      case "run":
        return !!artifacts.runResult;
      case "patch":
        return !!artifacts.patch;
      case "report":
        return !!artifacts.bugReport;
      default:
        return false;
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 glass">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Artifact Pipeline
      </h3>
      <div className="relative h-64">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 240">
          {/* Edges */}
          {edges.map((edge, index) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            if (!fromNode || !toNode) return null;

            const fromIndex = nodes.indexOf(fromNode);
            const toIndex = nodes.indexOf(toNode);
            const fromX = 30;
            const fromY = 20 + fromIndex * 40;
            const toX = 170;
            const toY = 20 + toIndex * 40;

            const isActive = isNodeActive(edge.from) && isNodeActive(edge.to);

            return (
              <motion.line
                key={`${edge.from}-${edge.to}`}
                x1={fromX}
                y1={fromY}
                x2={toX}
                y2={toY}
                stroke={isActive ? "#22c55e" : "#e5e7eb"}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray={isActive ? "0" : "4 4"}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isActive ? 1 : 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node, index) => {
            const isActive = isNodeActive(node.id);
            const x = index % 2 === 0 ? 30 : 170;
            const y = 20 + Math.floor(index / 2) * 80;

            return (
              <g key={node.id}>
                <motion.circle
                  cx={x}
                  cy={y}
                  r={isActive ? 10 : 8}
                  fill={isActive ? "#22c55e" : "#d1d5db"}
                  stroke={isActive ? "#16a34a" : "#9ca3af"}
                  strokeWidth={isActive ? 2 : 1}
                  initial="hidden"
                  animate="visible"
                  variants={isActive ? pop : fadeSlide}
                  transition={{ delay: index * 0.1 }}
                  className="cursor-pointer"
                  onClick={() => onNodeClick?.(node.id)}
                />
                {isActive && (
                  <motion.circle
                    cx={x}
                    cy={y}
                    r={isActive ? 10 : 8}
                    fill="transparent"
                    stroke="#22c55e"
                    strokeWidth={2}
                    initial={{ r: 10, opacity: 0.8 }}
                    animate={{ r: 16, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                <text
                  x={x}
                  y={y + 25}
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                  fontSize="10"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
