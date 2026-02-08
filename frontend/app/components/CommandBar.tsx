"use client";

import { motion } from "framer-motion";
import { WorkflowStep } from "../lib/types";
import { config } from "../lib/config";
import { buttonHover, buttonPress, glowPulse } from "../lib/motion";
import ThemeToggle from "./ThemeToggle";

interface CommandBarProps {
  pipelineMode: "sample" | "backend";
  onPipelineModeChange: (mode: "sample" | "backend") => void;
  currentStep: WorkflowStep | null;
  steps: {
    [key in WorkflowStep]: {
      status: "idle" | "loading" | "success" | "error";
    };
  };
  primaryAction?: {
    label: string;
    onClick: () => void;
    enabled: boolean;
  };
  onRetry?: () => void;
  onReset?: () => void;
  onToggleInspector?: () => void;
  inspectorOpen?: boolean;
  hasError: boolean;
}

export default function CommandBar({
  pipelineMode,
  onPipelineModeChange,
  primaryAction,
  onRetry,
  onReset,
  onToggleInspector,
  inspectorOpen = false,
  hasError,
}: CommandBarProps) {
  const isBackendMode = pipelineMode === "backend";

  return (
    <div className="mx-auto flex max-w-full items-center justify-between gap-4 px-6 py-3">
      {/* Left: Logo and Mode */}
      <div className="flex items-center gap-4">
        <motion.h1
          className="text-xl font-bold text-primary"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          PatchPilot
        </motion.h1>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted">Mode:</label>
          <select
            value={pipelineMode}
            onChange={(e) => onPipelineModeChange(e.target.value as "sample" | "backend")}
            className="rounded border border-soft bg-surface-1 px-2 py-1 text-xs text-primary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="sample">Sample</option>
            <option value="backend">Backend</option>
          </select>
        </div>
        {isBackendMode && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={glowPulse}
            className="flex items-center gap-1.5 rounded-full px-2 py-0.5"
            style={{
              backgroundColor: "var(--warning)",
              color: "var(--surface-1)",
            }}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-current"></div>
            <span className="text-xs font-medium">Backend</span>
          </motion.div>
        )}
        <ThemeToggle />
      </div>

      {/* Center: Primary Action */}
      <div className="flex flex-1 items-center justify-center gap-2">
        {primaryAction && (
          <motion.button
            onClick={primaryAction.onClick}
            disabled={!primaryAction.enabled}
            whileHover={primaryAction.enabled ? buttonHover : {}}
            whileTap={primaryAction.enabled ? buttonPress : {}}
            className="btn-primary relative overflow-hidden rounded-lg px-6 py-2 text-sm font-semibold disabled:cursor-not-allowed"
            style={{
              boxShadow: primaryAction.enabled ? "var(--shadow-glow)" : undefined,
            }}
          >
            <span className="relative z-10">
              {primaryAction.label}
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        )}
        {hasError && onRetry && (
          <motion.button
            onClick={onRetry}
            whileHover={buttonHover}
            whileTap={buttonPress}
            className="rounded-lg px-4 py-2 text-sm font-medium text-surface-1 transition-colors"
            style={{
              backgroundColor: "var(--danger)",
            }}
          >
            Retry
          </motion.button>
        )}
      </div>

      {/* Right: Secondary Actions */}
      <div className="flex items-center gap-2">
        {onReset && (
          <motion.button
            onClick={onReset}
            whileHover={buttonHover}
            whileTap={buttonPress}
            className="btn-secondary rounded px-3 py-1.5 text-xs font-medium"
          >
            Reset
          </motion.button>
        )}
        {config.isDevelopment && onToggleInspector && (
          <motion.button
            onClick={onToggleInspector}
            whileHover={buttonHover}
            whileTap={buttonPress}
            className={`btn-secondary rounded px-3 py-1.5 text-xs font-medium ${
              inspectorOpen ? "border-accent" : ""
            }`}
            style={{
              backgroundColor: inspectorOpen ? "var(--accent)" : undefined,
              color: inspectorOpen ? "var(--surface-1)" : undefined,
            }}
          >
            {inspectorOpen ? "Hide" : "Dev"}
          </motion.button>
        )}
      </div>
    </div>
  );
}
