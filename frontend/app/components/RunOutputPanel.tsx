"use client";

import Image from "next/image";
import { useCopyFeedback } from "../lib/useCopyFeedback";
import { config } from "../lib/config";

interface RunOutputPanelProps {
  status?: "running" | "success" | "failed";
  stdout?: string;
  stderr?: string;
  screenshotUrl?: string | null;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function RunOutputPanel({
  status,
  stdout,
  stderr,
  screenshotUrl,
  isLoading = false,
  error,
  onRetry,
}: RunOutputPanelProps) {
  const { copied, copyToClipboard } = useCopyFeedback();

  const handleCopyLogs = () => {
    const logs = [stdout, stderr].filter(Boolean).join("\n\n--- Errors ---\n\n");
    if (logs) {
      copyToClipboard(logs);
    }
  };

  return (
    <div className="card w-full rounded-lg p-6">
      <h2 className="mb-4 text-xl font-semibold text-primary">Test Run Results</h2>
      {error ? (
        <div className="space-y-3">
          <div className="card rounded-md p-4" style={{ borderColor: "var(--danger)" }}>
            <p className="text-sm font-medium" style={{ color: "var(--danger)" }}>Error running test</p>
            <p className="mt-1 text-sm break-words overflow-wrap-anywhere" style={{ color: "var(--danger)" }}>{error}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn-secondary rounded-md px-3 py-1.5 text-sm font-medium"
              style={{ backgroundColor: "var(--danger)", color: "var(--surface-1)" }}
            >
              Retry
            </button>
          )}
          {config.isDevelopment && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs" style={{ color: "var(--danger)" }}>Show technical details</summary>
              <pre className="mt-2 overflow-x-auto overflow-y-auto max-h-48 rounded p-2 text-xs whitespace-pre-wrap break-words overflow-wrap-anywhere" style={{ backgroundColor: "var(--danger)", opacity: 0.1, color: "var(--danger)" }}>
                {error}
              </pre>
            </details>
          )}
        </div>
      ) : isLoading ? (
        <div className="flex items-center gap-2 text-muted">
          <div className="h-4 w-4 animate-spin rounded-full border-2" style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}></div>
          <span>Running test... capturing screenshot...</span>
        </div>
      ) : status ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span
              className="rounded-full px-3 py-1 text-sm font-medium"
              style={{
                backgroundColor:
                  status === "failed"
                    ? "var(--success)"
                    : status === "success"
                      ? "var(--danger)"
                      : "var(--warning)",
                color: "var(--surface-1)",
              }}
            >
              {status === "failed"
                ? "✓ DETECTED"
                : status === "success"
                  ? "✗ NOT DETECTED"
                  : "Running..."}
            </span>
            {(stdout || stderr) && (
              <div className="flex items-center gap-2">
                {copied && <span className="text-sm" style={{ color: "var(--success)" }}>Copied!</span>}
                <button
                  onClick={handleCopyLogs}
                  className="btn-secondary rounded-md px-3 py-1.5 text-sm font-medium"
                >
                  Copy Logs
                </button>
              </div>
            )}
          </div>
          {stdout && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-primary">Output:</h3>
              <pre className="overflow-x-auto overflow-y-auto max-h-64 rounded-md p-4 whitespace-pre-wrap break-words" style={{ backgroundColor: "var(--surface-3)" }}>
                <code className="font-mono text-sm text-primary break-words overflow-wrap-anywhere">{stdout}</code>
              </pre>
            </div>
          )}
          {stderr && (
            <div>
              <h3 className="mb-2 text-sm font-semibold" style={{ color: "var(--danger)" }}>Errors:</h3>
              <pre className="overflow-x-auto overflow-y-auto max-h-64 rounded-md p-4 whitespace-pre-wrap break-words" style={{ backgroundColor: "var(--danger)", opacity: 0.1 }}>
                <code className="font-mono text-sm break-words overflow-wrap-anywhere" style={{ color: "var(--danger)" }}>{stderr}</code>
              </pre>
            </div>
          )}
          {screenshotUrl && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-primary">Screenshot:</h3>
              <div className="relative h-64 w-full">
                <Image
                  src={screenshotUrl}
                  alt="Test failure screenshot"
                  fill
                  className="rounded-md border border-soft object-contain"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card rounded-md p-4 text-center">
          <p className="text-sm text-muted">
            Test run results will appear here, including output, errors, and a screenshot (if available)
            after the test executes.
          </p>
        </div>
      )}
    </div>
  );
}
