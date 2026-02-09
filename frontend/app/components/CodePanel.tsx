"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCopyFeedback } from "../lib/useCopyFeedback";
import { config } from "../lib/config";
import { fadeSlide, pop, buttonHover, buttonPress } from "../lib/motion";
import SyntaxHighlightedCode from "./SyntaxHighlightedCode";

interface CodePanelProps {
  title: string;
  code?: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  useSyntaxHighlight?: boolean;
}

export default function CodePanel({
  title,
  code,
  isLoading = false,
  error,
  onRetry,
  useSyntaxHighlight = false,
}: CodePanelProps) {
  const { copied, copyToClipboard } = useCopyFeedback();
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  const handleCopy = () => {
    if (code) {
      copyToClipboard(code);
    }
  };

  const lines = code?.split("\n") || [];

  return (
    <div className="card w-full rounded-lg p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
        {code && (
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {copied && (
                <motion.span
                  key="copied"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={pop}
                  className="text-sm font-medium"
                  style={{ color: "var(--success)" }}
                >
                  ✓ Copied!
                </motion.span>
              )}
            </AnimatePresence>
            <motion.button
              onClick={handleCopy}
              whileHover={buttonHover}
              whileTap={buttonPress}
              className="btn-secondary relative overflow-hidden rounded-md px-3 py-1.5 text-sm font-medium"
            >
              <span className="relative z-10">Copy</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
          </div>
        )}
      </div>
      {error ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeSlide}
          className="space-y-3"
        >
          <div className="card rounded-md p-4" style={{ borderColor: "var(--danger)" }}>
            <p className="text-sm font-medium" style={{ color: "var(--danger)" }}>Error generating {title.toLowerCase()}</p>
            <p className="mt-1 text-sm" style={{ color: "var(--danger)" }}>{error}</p>
          </div>
          {onRetry && (
            <motion.button
              onClick={onRetry}
              whileHover={buttonHover}
              whileTap={buttonPress}
              className="btn-secondary rounded-md px-3 py-1.5 text-sm font-medium"
              style={{ backgroundColor: "var(--danger)", color: "var(--surface-1)" }}
            >
              Retry
            </motion.button>
          )}
          {config.isDevelopment && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs" style={{ color: "var(--danger)" }}>Show technical details</summary>
              <pre className="mt-2 overflow-x-auto rounded p-2 text-xs" style={{ backgroundColor: "var(--danger)", opacity: 0.1, color: "var(--danger)" }}>
                {error}
              </pre>
            </details>
          )}
        </motion.div>
      ) : isLoading ? (
        <div className="flex items-center gap-2 text-muted">
          <div className="h-4 w-4 animate-spin rounded-full border-2" style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}></div>
          <span>
            {title.includes("Test")
              ? "Writing Playwright test..."
              : title.includes("Patch")
                ? "Generating fix patch..."
                : `Generating ${title.toLowerCase()}...`}
          </span>
        </div>
      ) : code ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeSlide}
        >
          {useSyntaxHighlight && config.pipelineMode === "backend" ? (
            <SyntaxHighlightedCode code={code} language="typescript" />
          ) : (
            <pre
              className="overflow-x-auto rounded-md p-4"
              style={{
                backgroundColor: "var(--surface-3)",
                maxHeight: "600px",
                overflowY: "auto",
              }}
            >
              <code className="font-mono text-sm text-primary">
                {lines.map((line, index) => (
                  <motion.div
                    key={index}
                    onMouseEnter={() => setHoveredLine(index)}
                    onMouseLeave={() => setHoveredLine(null)}
                    className="px-2 py-0.5 transition-colors"
                    style={{
                      backgroundColor: hoveredLine === index ? "var(--border)" : undefined,
                    }}
                  >
                    <span className="select-all">{line || " "}</span>
                  </motion.div>
                ))}
              </code>
            </pre>
          )}
        </motion.div>
      ) : (
        <div className="card rounded-md p-4 text-center">
          <p className="text-sm text-muted">
            {title.includes("Test")
              ? "A runnable Playwright test will be generated here after analysis."
              : title.includes("Patch")
                ? "A unified diff patch with suggested fixes will appear here after test execution."
                : `No ${title.toLowerCase()} yet.`}
          </p>
        </div>
      )}
    </div>
  );
}
