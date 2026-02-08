"use client";

import { motion, AnimatePresence } from "framer-motion";
import { WorkflowStep, type GeneratedTest, type RunResult, type PatchResult, type BugReport } from "../lib/types";
import { useCopyFeedback } from "../lib/useCopyFeedback";
import { fadeSlide, pop, pulse, slideIn } from "../lib/motion";

interface SidebarProps {
  steps: {
    [key in WorkflowStep]: {
      status: "idle" | "loading" | "success" | "error";
      duration?: number;
    };
  };
  activeView: WorkflowStep | null;
  onViewChange: (step: WorkflowStep) => void;
  artifacts: {
    test?: GeneratedTest | null;
    runResult?: RunResult | null;
    patch?: PatchResult | null;
    bugReport?: BugReport | null;
  };
}

const stepLabels: Record<WorkflowStep, string> = {
  [WorkflowStep.UPLOAD]: "Upload",
  [WorkflowStep.ANALYZE]: "Analyze",
  [WorkflowStep.TEST]: "Test",
  [WorkflowStep.RUN]: "Run",
  [WorkflowStep.PATCH]: "Patch",
  [WorkflowStep.EXPORT]: "Export",
};

const stepOrder: WorkflowStep[] = [
  WorkflowStep.UPLOAD,
  WorkflowStep.ANALYZE,
  WorkflowStep.TEST,
  WorkflowStep.RUN,
  WorkflowStep.PATCH,
  WorkflowStep.EXPORT,
];

function getStepIcon(status: "idle" | "loading" | "success" | "error") {
  switch (status) {
    case "success":
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={pop}
          className="flex h-5 w-5 items-center justify-center rounded-full shadow-lg"
          style={{
            backgroundColor: "var(--success)",
            boxShadow: "0 0 10px var(--success)",
          }}
        >
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      );
    case "error":
      return (
        <motion.div
          variants={pulse}
          animate="animate"
          className="flex h-5 w-5 items-center justify-center rounded-full shadow-lg"
          style={{
            backgroundColor: "var(--danger)",
            boxShadow: "0 0 10px var(--danger)",
          }}
        >
          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.div>
      );
    case "loading":
      return (
        <motion.div
          variants={pulse}
          animate="animate"
          className="flex h-5 w-5 items-center justify-center rounded-full shadow-lg"
          style={{
            backgroundColor: "var(--accent)",
            boxShadow: "0 0 10px var(--accent)",
          }}
        >
          <div className="h-2.5 w-2.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        </motion.div>
      );
    default:
      return (
        <div
          className="flex h-5 w-5 items-center justify-center rounded-full"
          style={{
            backgroundColor: "var(--border)",
            border: "2px solid var(--surface-2)",
          }}
        >
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: "var(--muted-2)" }}
          ></div>
        </div>
      );
  }
}

function formatDuration(ms?: number): string {
  if (!ms) return "";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export default function Sidebar({ steps, activeView, onViewChange, artifacts }: SidebarProps) {
  const { copied, copyToClipboard } = useCopyFeedback();

  return (
    <div className="flex h-full w-64 flex-col overflow-y-auto">
      {/* Pipeline Map Stepper */}
      <div className="border-b border-soft p-4">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted">Pipeline</h2>
        <div className="relative">
          {/* Flow Line */}
          <div className="absolute left-2.5 top-0 h-full w-0.5">
            {stepOrder.map((step, index) => {
              const stepState = steps[step];
              const isCompleted = stepState.status === "success";
              const isActive = stepState.status === "loading";
              const nextStep = stepOrder[index + 1];
              const nextCompleted = nextStep ? steps[nextStep].status === "success" : false;

              if (index === stepOrder.length - 1) return null;

              return (
                <motion.div
                  key={`line-${step}`}
                  className="absolute left-0 h-12 w-0.5"
                  style={{
                    top: `${index * 3}rem`,
                    background: isCompleted || nextCompleted
                      ? "linear-gradient(to bottom, var(--success), var(--success))"
                      : isActive
                        ? "linear-gradient(to bottom, var(--accent), var(--accent-2))"
                        : "var(--border)",
                  }}
                  initial={{ scaleY: 0 }}
                  animate={{
                    scaleY: isCompleted || isActive ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.3 }}
                />
              );
            })}
          </div>

          {/* Steps */}
          <div className="relative space-y-1">
            {stepOrder.map((step, index) => {
              const stepState = steps[step];
              const isActive = activeView === step;
              const isClickable = stepState.status !== "idle" || step === WorkflowStep.UPLOAD;

              return (
                <motion.div
                  key={step}
                  initial="hidden"
                  animate="visible"
                  variants={slideIn("right")}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.button
                    onClick={() => isClickable && onViewChange(step)}
                    disabled={!isClickable}
                    className={`relative w-full rounded-lg px-3 py-2.5 text-left transition-all ${
                      isActive
                        ? "shadow-md"
                        : isClickable
                          ? "hover:bg-surface-2"
                          : "cursor-not-allowed"
                    }`}
                    style={{
                      backgroundColor: isActive ? "var(--accent)" : undefined,
                      color: isActive
                        ? "var(--surface-1)"
                        : isClickable
                          ? "var(--text)"
                          : "var(--muted-2)",
                    }}
                    whileHover={isClickable ? { x: 4 } : {}}
                    whileTap={isClickable ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative z-10">{getStepIcon(stepState.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold">{stepLabels[step]}</div>
                        {stepState.duration && stepState.status === "success" && (
                          <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-muted"
                          >
                            {formatDuration(stepState.duration)}
                          </motion.div>
                        )}
                        {stepState.status === "loading" && (
                          <div className="mt-1 h-1 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--border)" }}>
                            <motion.div
                              className="h-full"
                              style={{ backgroundColor: "var(--accent)" }}
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-lg border-2"
                        style={{ borderColor: "var(--accent-2)" }}
                        layoutId="activeStep"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Artifacts Tray */}
      <AnimatePresence>
        {(artifacts.test || artifacts.runResult || artifacts.patch || artifacts.bugReport) && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={{
              collapsed: { height: 0, opacity: 0 },
              expanded: { height: "auto", opacity: 1 },
            }}
            className="border-b border-soft p-4"
          >
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Artifacts
            </h2>
            <div className="space-y-2">
              {artifacts.test && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeSlide}
                  className="card rounded-md p-2 glass-hover"
                >
                  <div className="mb-1 text-xs font-medium text-primary">Playwright Test</div>
                  <div className="flex gap-1">
                    <motion.button
                      onClick={() => artifacts.test && copyToClipboard(artifacts.test.playwrightSpec)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-secondary flex-1 rounded px-2 py-1 text-xs"
                    >
                      {copied ? "✓ Copied" : "Copy"}
                    </motion.button>
                  </div>
                </motion.div>
              )}
              {artifacts.runResult && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeSlide}
                  transition={{ delay: 0.1 }}
                  className="card rounded-md p-2 glass-hover"
                >
                  <div className="mb-1 text-xs font-medium text-primary">Run Logs</div>
                  <div className="flex gap-1">
                    <motion.button
                      onClick={() => {
                        if (artifacts.runResult) {
                          const logs = [artifacts.runResult.stdout, artifacts.runResult.stderr]
                            .filter(Boolean)
                            .join("\n\n--- Errors ---\n\n");
                          copyToClipboard(logs);
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-secondary flex-1 rounded px-2 py-1 text-xs"
                    >
                      {copied ? "✓ Copied" : "Copy"}
                    </motion.button>
                  </div>
                </motion.div>
              )}
              {artifacts.patch && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeSlide}
                  transition={{ delay: 0.2 }}
                  className="card rounded-md p-2 glass-hover"
                >
                  <div className="mb-1 text-xs font-medium text-primary">Patch Diff</div>
                  <div className="flex gap-1">
                    <motion.button
                      onClick={() => artifacts.patch && copyToClipboard(artifacts.patch.diff)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-secondary flex-1 rounded px-2 py-1 text-xs"
                    >
                      {copied ? "✓ Copied" : "Copy"}
                    </motion.button>
                  </div>
                </motion.div>
              )}
              {artifacts.bugReport && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeSlide}
                  transition={{ delay: 0.3 }}
                  className="card rounded-md p-2 glass-hover"
                >
                  <div className="mb-1 text-xs font-medium text-primary">Bug Report</div>
                  <div className="flex gap-1">
                    <motion.button
                      onClick={() => artifacts.bugReport && copyToClipboard(artifacts.bugReport.markdown)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-secondary flex-1 rounded px-2 py-1 text-xs"
                    >
                      {copied ? "✓ Copied" : "Copy"}
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        if (artifacts.bugReport) {
                          const blob = new Blob([artifacts.bugReport.markdown], { type: "text/markdown" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "bug-report.md";
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-secondary flex-1 rounded px-2 py-1 text-xs"
                    >
                      Download
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Artifact Graph Visualization */}
      {(artifacts.test || artifacts.runResult || artifacts.patch || artifacts.bugReport) && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeSlide}
          className="border-b border-soft p-4"
        >
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
            Pipeline Map
          </h2>
          <div className="relative h-48 w-full">
            <svg className="h-full w-full" viewBox="0 0 200 180">
              {/* Edges */}
              {[
                { from: { x: 30, y: 20 }, to: { x: 170, y: 20 } },
                { from: { x: 170, y: 20 }, to: { x: 30, y: 60 } },
                { from: { x: 30, y: 60 }, to: { x: 170, y: 60 } },
                { from: { x: 170, y: 60 }, to: { x: 30, y: 100 } },
                { from: { x: 30, y: 100 }, to: { x: 170, y: 100 } },
                { from: { x: 170, y: 100 }, to: { x: 100, y: 140 } },
              ].map((edge, index) => {
                const nodes = [
                  { id: "video", exists: true },
                  { id: "analysis", exists: !!artifacts.test || !!artifacts.runResult },
                  { id: "test", exists: !!artifacts.test },
                  { id: "run", exists: !!artifacts.runResult },
                  { id: "patch", exists: !!artifacts.patch },
                  { id: "report", exists: !!artifacts.bugReport },
                ];
                const fromNode = nodes[Math.floor(index / 2)];
                const toNode = nodes[Math.floor(index / 2) + 1];
                const isActive = fromNode?.exists && toNode?.exists;

                return (
                  <motion.line
                    key={`edge-${index}`}
                    x1={edge.from.x}
                    y1={edge.from.y}
                    x2={edge.to.x}
                    y2={edge.to.y}
                    stroke={isActive ? "var(--success)" : "var(--border)"}
                    strokeWidth={isActive ? 2 : 1}
                    strokeDasharray={isActive ? "0" : "4 4"}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: isActive ? 1 : 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                );
              })}

              {/* Nodes */}
              {[
                { x: 30, y: 20, label: "Video", exists: true },
                { x: 170, y: 20, label: "Analysis", exists: !!artifacts.test || !!artifacts.runResult },
                { x: 30, y: 60, label: "Test", exists: !!artifacts.test },
                { x: 170, y: 60, label: "Run", exists: !!artifacts.runResult },
                { x: 30, y: 100, label: "Patch", exists: !!artifacts.patch },
                { x: 100, y: 140, label: "Report", exists: !!artifacts.bugReport },
              ].map((node, index) => (
                <g key={node.label}>
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r={node.exists ? 10 : 8}
                    fill={node.exists ? "var(--success)" : "var(--border)"}
                    stroke={node.exists ? "var(--success)" : "var(--muted-2)"}
                    strokeWidth={node.exists ? 2 : 1}
                    initial="hidden"
                    animate="visible"
                    variants={node.exists ? pop : fadeSlide}
                    transition={{ delay: index * 0.1 }}
                  />
                  {node.exists && (
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r={10}
                      fill="transparent"
                      stroke="var(--success)"
                      strokeWidth={2}
                      initial={{ r: 10, opacity: 0.8 }}
                      animate={{ r: 16, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  <text
                    x={node.x}
                    y={node.y + 25}
                    textAnchor="middle"
                    className="text-xs"
                    style={{ fill: "var(--muted)" }}
                    fontSize="9"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </motion.div>
      )}
    </div>
  );
}
