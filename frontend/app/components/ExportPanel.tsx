"use client";

import { useCopyFeedback } from "../lib/useCopyFeedback";
import { config } from "../lib/config";

interface ExportPanelProps {
  bugReport?: string;
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function ExportPanel({
  bugReport,
  isLoading = false,
  error,
  onRetry,
}: ExportPanelProps) {
  const { copied, copyToClipboard } = useCopyFeedback();

  const handleDownload = () => {
    if (bugReport) {
      const blob = new Blob([bugReport], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "bug-report.md";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleCopy = () => {
    if (bugReport) {
      copyToClipboard(bugReport);
    }
  };

  return (
    <div className="card w-full rounded-lg p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">Bug Report Export</h2>
        {bugReport && (
          <div className="flex items-center gap-2">
            {copied && <span className="text-sm" style={{ color: "var(--success)" }}>Copied!</span>}
            <button
              onClick={handleCopy}
              className="btn-secondary rounded-md px-3 py-1.5 text-sm font-medium"
            >
              Copy Markdown
            </button>
            <button
              onClick={handleDownload}
              className="btn-primary rounded-md px-4 py-2 text-sm font-medium"
            >
              Download Markdown
            </button>
          </div>
        )}
      </div>
      {error ? (
        <div className="space-y-3">
          <div className="card rounded-md p-4" style={{ borderColor: "var(--danger)" }}>
            <p className="text-sm font-medium" style={{ color: "var(--danger)" }}>Error generating bug report</p>
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
          <span>Generating report...</span>
        </div>
      ) : bugReport ? (
        <div className="card rounded-md p-4">
          <pre className="whitespace-pre-wrap font-mono text-sm text-primary">
            {bugReport}
          </pre>
        </div>
      ) : (
        <div className="card rounded-md p-4 text-center">
          <p className="text-sm text-muted">
            A complete bug report in Markdown format will be generated here after patch generation,
            ready for download or copy.
          </p>
        </div>
      )}
    </div>
  );
}
