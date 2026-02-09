"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { WorkflowStep, type AnalysisResult, type GeneratedTest, type RunResult, type PatchResult, type BugReport } from "../lib/types";
import TimelinePanel from "./TimelinePanel";
import StepsPanel from "./StepsPanel";
import CodePanel from "./CodePanel";
import RunOutputPanel from "./RunOutputPanel";
import ExportPanel from "./ExportPanel";
import UploadCard from "./UploadCard";
import DiffViewer from "./DiffViewer";
import { fadeSlide, buttonHover, buttonPress } from "../lib/motion";

interface WorkspaceProps {
  activeView: WorkflowStep | null;
  uploadedFile: File | null;
  onUpload: (file: File) => void;
  isUploading: boolean;
  analysis?: AnalysisResult | null;
  analysisLoading: boolean;
  analysisError: string | null;
  onAnalysisRetry?: () => void;
  test?: GeneratedTest | null;
  testLoading: boolean;
  testError: string | null;
  onTestRetry?: () => void;
  runResult?: RunResult | null;
  runLoading: boolean;
  runError: string | null;
  onRunRetry?: () => void;
  patch?: PatchResult | null;
  patchLoading: boolean;
  patchError: string | null;
  onPatchRetry?: () => void;
  bugReport?: BugReport | null;
  exportLoading: boolean;
  exportError: string | null;
  onExportRetry?: () => void;
}

export default function Workspace({
  activeView,
  uploadedFile,
  onUpload,
  isUploading,
  analysis,
  analysisLoading,
  analysisError,
  onAnalysisRetry,
  test,
  testLoading,
  testError,
  onTestRetry,
  runResult,
  runLoading,
  runError,
  onRunRetry,
  patch,
  patchLoading,
  patchError,
  onPatchRetry,
  bugReport,
  exportLoading,
  exportError,
  onExportRetry,
}: WorkspaceProps) {
  // Tab state for each view
  const [analyzeTab, setAnalyzeTab] = useState<"timeline" | "steps" | "summary">("timeline");
  const [testTab, setTestTab] = useState<"spec" | "notes">("spec");
  const [runTab, setRunTab] = useState<"console" | "screenshot">("console");
  const [patchTab, setPatchTab] = useState<"diff" | "rationale" | "risks">("diff");
  const [exportTab, setExportTab] = useState<"markdown" | "actions">("markdown");

  if (!activeView || activeView === WorkflowStep.UPLOAD) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeSlide}
        className="flex h-full items-center justify-center p-8"
      >
        <div className="w-full max-w-2xl">
          <h2 className="mb-4 text-2xl font-semibold text-primary">Upload Bug Recording</h2>
          <UploadCard onUpload={onUpload} isUploading={isUploading} />
          {uploadedFile && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-sm text-muted"
            >
              Uploaded: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
            </motion.p>
          )}
        </div>
      </motion.div>
    );
  }

  if (activeView === WorkflowStep.ANALYZE) {
    return (
      <motion.div
        key="analyze"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeSlide}
        className="flex h-full flex-col overflow-hidden"
      >
        <div className="border-b border-soft surface-1 px-6 py-3">
          <h2 className="text-lg font-semibold text-primary">Analysis Results</h2>
          <div className="mt-2 flex gap-2">
            {(["timeline", "steps", "summary"] as const).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setAnalyzeTab(tab)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  analyzeTab === tab ? "" : "hover:bg-surface-2"
                }`}
                style={{
                  backgroundColor: analyzeTab === tab ? "var(--accent)" : undefined,
                  color: analyzeTab === tab ? "var(--surface-1)" : "var(--muted)",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {analyzeTab === "timeline" && (
              <motion.div
                key="timeline"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeSlide}
              >
                <TimelinePanel
                  events={analysis?.timeline}
                  isLoading={analysisLoading}
                  error={analysisError}
                  onRetry={onAnalysisRetry}
                />
              </motion.div>
            )}
            {analyzeTab === "steps" && (
              <motion.div
                key="steps"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeSlide}
              >
                <StepsPanel
                  steps={analysis?.reproSteps}
                  isLoading={analysisLoading}
                  error={analysisError}
                  onRetry={onAnalysisRetry}
                />
              </motion.div>
            )}
            {analyzeTab === "summary" && (
              <motion.div
                key="summary"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeSlide}
                className="space-y-4"
              >
                <div className="card rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-primary">Expected Behavior</h3>
                  <p className="mt-2 text-sm text-muted">{analysis?.expected || "N/A"}</p>
                </div>
                <div className="card rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-primary">Actual Behavior</h3>
                  <p className="mt-2 text-sm text-muted">{analysis?.actual || "N/A"}</p>
                </div>
                {analysis?.targetUrl && (
                  <div className="card rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-primary">Target URL</h3>
                    <p className="mt-2 font-mono text-sm text-muted">{analysis.targetUrl}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  if (activeView === WorkflowStep.TEST) {
    return (
      <motion.div
        key="test"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeSlide}
        className="flex h-full flex-col overflow-hidden"
      >
        <div className="border-b border-soft surface-1 px-6 py-3">
          <h2 className="text-lg font-semibold text-primary">Generated Playwright Test</h2>
          <div className="mt-2 flex gap-2">
            {(["spec", "notes"] as const).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setTestTab(tab)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  testTab === tab ? "" : "hover:bg-surface-2"
                }`}
                style={{
                  backgroundColor: testTab === tab ? "var(--accent)" : undefined,
                  color: testTab === tab ? "var(--surface-1)" : "var(--muted)",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {testTab === "spec" && (
              <motion.div
                key="spec"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeSlide}
              >
                <CodePanel
                  title="Playwright Test"
                  code={test?.playwrightSpec}
                  isLoading={testLoading}
                  error={testError}
                  onRetry={onTestRetry}
                  useSyntaxHighlight={true}
                />
              </motion.div>
            )}
            {testTab === "notes" && (
              <motion.div
                key="notes"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeSlide}
                className="card rounded-lg p-4"
              >
                <h3 className="text-sm font-semibold text-primary">Test Information</h3>
                {test?.filename && (
                  <div className="mt-2">
                    <span className="text-xs text-muted-2">Filename:</span>
                    <p className="mt-1 font-mono text-sm text-muted">{test.filename}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  if (activeView === WorkflowStep.RUN) {
    return (
      <motion.div
        key="run"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeSlide}
        className="flex h-full flex-col overflow-hidden"
      >
        <div className="border-b border-soft surface-1 px-6 py-3">
          <h2 className="text-lg font-semibold text-primary">Test Run Results</h2>
          <div className="mt-2 flex gap-2">
            {(["console", "screenshot"] as const).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setRunTab(tab)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  runTab === tab ? "" : "hover:bg-surface-2"
                }`}
                style={{
                  backgroundColor: runTab === tab ? "var(--accent)" : undefined,
                  color: runTab === tab ? "var(--surface-1)" : "var(--muted)",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {runTab === "console" && (
              <motion.div
                key="console"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeSlide}
              >
                <RunOutputPanel
                  status={runResult?.status}
                  stdout={runResult?.stdout}
                  stderr={runResult?.stderr}
                  screenshotUrl={null}
                  isLoading={runLoading}
                  error={runError}
                  onRetry={onRunRetry}
                />
              </motion.div>
            )}
            {runTab === "screenshot" && runResult?.screenshotUrl && (
              <motion.div
                key="screenshot"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeSlide}
                className="card rounded-lg p-4"
              >
                <h3 className="mb-4 text-sm font-semibold text-primary">Screenshot</h3>
                <div className="relative h-96 w-full overflow-auto rounded-md border border-soft surface-2">
                  <Image
                    src={runResult.screenshotUrl}
                    alt="Test failure screenshot"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>
            )}
            {runTab === "screenshot" && !runResult?.screenshotUrl && (
              <motion.div
                key="no-screenshot"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeSlide}
                className="card rounded-lg p-4 text-center"
              >
                <p className="text-sm text-muted">No screenshot available</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  if (activeView === WorkflowStep.PATCH) {
    return (
      <motion.div
        key="patch"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeSlide}
        className="flex h-full flex-col overflow-hidden"
      >
        <div className="border-b border-soft surface-1 px-6 py-3">
          <h2 className="text-lg font-semibold text-primary">Suggested Fix Patch</h2>
          <div className="mt-2 flex gap-2">
            {(["diff", "rationale", "risks"] as const).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setPatchTab(tab)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  patchTab === tab ? "" : "hover:bg-surface-2"
                }`}
                style={{
                  backgroundColor: patchTab === tab ? "var(--accent)" : undefined,
                  color: patchTab === tab ? "var(--surface-1)" : "var(--muted)",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {patchTab === "diff" && (
              <motion.div
                key="diff"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeSlide}
                className="card w-full rounded-lg p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-primary">Patch Diff</h2>
                  {patch?.diff && (
                    <motion.button
                      onClick={() => patch?.diff && navigator.clipboard.writeText(patch.diff)}
                      whileHover={buttonHover}
                      whileTap={buttonPress}
                      className="btn-secondary relative overflow-hidden rounded-md px-3 py-1.5 text-sm font-medium"
                    >
                      <span className="relative z-10">Copy Diff</span>
                    </motion.button>
                  )}
                </div>
                {patchError ? (
                  <div className="card rounded-md p-4" style={{ borderColor: "var(--danger)" }}>
                    <p className="text-sm font-medium" style={{ color: "var(--danger)" }}>Error generating patch diff</p>
                    <p className="mt-1 text-sm" style={{ color: "var(--danger)" }}>{patchError}</p>
                    {onPatchRetry && (
                      <motion.button
                        onClick={onPatchRetry}
                        whileHover={buttonHover}
                        whileTap={buttonPress}
                        className="btn-secondary mt-3 rounded-md px-3 py-1.5 text-sm font-medium"
                        style={{ backgroundColor: "var(--danger)", color: "var(--surface-1)" }}
                      >
                        Retry
                      </motion.button>
                    )}
                  </div>
                ) : patchLoading ? (
                  <div className="flex items-center gap-2 text-muted">
                    <div className="h-4 w-4 animate-spin rounded-full border-2" style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}></div>
                    <span>Generating fix patch...</span>
                  </div>
                ) : patch?.diff ? (
                  <DiffViewer diff={patch.diff} />
                ) : (
                  <div className="card rounded-md p-4 text-center">
                    <p className="text-sm text-muted">
                      A unified diff patch with suggested fixes will appear here after test execution.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
            {patchTab === "rationale" && (
              <motion.div
                key="rationale"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeSlide}
                className="rounded-lg border border-gray-200 bg-white p-4 glass"
              >
                <h3 className="text-sm font-semibold text-gray-800">Rationale</h3>
                <p className="mt-2 text-sm text-gray-700">{patch?.rationale || "N/A"}</p>
              </motion.div>
            )}
            {patchTab === "risks" && (
              <motion.div
                key="risks"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeSlide}
                className="rounded-lg border border-gray-200 bg-white p-4 glass"
              >
                <h3 className="text-sm font-semibold text-gray-800">Risks</h3>
                {patch?.risks && patch.risks.length > 0 ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-700">
                    {patch.risks.map((risk, index) => (
                      <li key={index}>{risk}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-gray-500">No risks identified</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  if (activeView === WorkflowStep.EXPORT) {
    return (
      <motion.div
        key="export"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeSlide}
        className="flex h-full flex-col overflow-hidden"
      >
        <div className="border-b border-soft surface-1 px-6 py-3">
          <h2 className="text-lg font-semibold text-primary">Bug Report Export</h2>
          <div className="mt-2 flex gap-2">
            {(["markdown", "actions"] as const).map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setExportTab(tab)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  exportTab === tab ? "" : "hover:bg-surface-2"
                }`}
                style={{
                  backgroundColor: exportTab === tab ? "var(--accent)" : undefined,
                  color: exportTab === tab ? "var(--surface-1)" : "var(--muted)",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {exportTab === "markdown" && (
              <motion.div
                key="markdown"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeSlide}
              >
                <ExportPanel
                  bugReport={bugReport?.markdown}
                  isLoading={exportLoading}
                  error={exportError}
                  onRetry={onExportRetry}
                />
              </motion.div>
            )}
            {exportTab === "actions" && (
              <motion.div
                key="actions"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeSlide}
                className="space-y-4"
              >
                <div className="card rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-primary">Export Options</h3>
                  <div className="mt-4 space-y-2">
                    <motion.button
                      onClick={() => {
                        if (bugReport?.markdown) {
                          const blob = new Blob([bugReport.markdown], { type: "text/markdown" });
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
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-primary w-full rounded-md px-4 py-2 text-sm font-medium"
                    >
                      Download Markdown
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        if (bugReport?.markdown) {
                          navigator.clipboard.writeText(bugReport.markdown);
                        }
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-secondary w-full rounded-md px-4 py-2 text-sm font-medium"
                    >
                      Copy Markdown
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeSlide}
      className="flex h-full items-center justify-center p-8"
    >
      <p className="text-muted">Select a step to view</p>
    </motion.div>
  );
}
