"use client";

import { config } from "../lib/config";
import type { AnalysisResult, GeneratedTest, RunResult, PatchResult, BugReport } from "../lib/types";

interface ApiErrorInfo {
  timestamp: string;
  endpoint: string;
  status: number | null;
  message: string;
  details?: unknown;
}

interface InspectorProps {
  lastApiError: ApiErrorInfo | null;
  data: {
    analysis: AnalysisResult | null;
    test: GeneratedTest | null;
    runResult: RunResult | null;
    patch: PatchResult | null;
    bugReport: BugReport | null;
  };
}

export default function Inspector({ lastApiError, data }: InspectorProps) {
  if (!config.isDevelopment) {
    return null;
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto surface-2">
      <div className="border-b border-soft surface-1 p-4">
        <h2 className="text-sm font-semibold text-primary">Inspector</h2>
        <p className="mt-1 text-xs text-muted">Development tools and debug information</p>
      </div>

      <div className="flex-1 space-y-4 p-4">
        {/* Last API Error */}
        {lastApiError && (
          <div className="card rounded-lg p-4" style={{ borderColor: "var(--danger)" }}>
            <h3 className="text-xs font-semibold" style={{ color: "var(--danger)" }}>Last API Error</h3>
            <div className="mt-2 space-y-1 text-xs">
              <div>
                <span className="font-medium" style={{ color: "var(--danger)" }}>Time:</span>{" "}
                <span style={{ color: "var(--danger)" }}>
                  {new Date(lastApiError.timestamp).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="font-medium" style={{ color: "var(--danger)" }}>Endpoint:</span>{" "}
                <span className="font-mono" style={{ color: "var(--danger)" }}>{lastApiError.endpoint}</span>
              </div>
              {lastApiError.status !== null && (
                <div>
                  <span className="font-medium" style={{ color: "var(--danger)" }}>Status:</span>{" "}
                  <span style={{ color: "var(--danger)" }}>{lastApiError.status}</span>
                </div>
              )}
              <div>
                <span className="font-medium" style={{ color: "var(--danger)" }}>Message:</span>{" "}
                <span style={{ color: "var(--danger)" }}>{lastApiError.message}</span>
              </div>
              {lastApiError.details !== undefined && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-medium" style={{ color: "var(--danger)" }}>
                    Details
                  </summary>
                  <pre className="mt-1 max-h-48 overflow-auto rounded p-2 text-xs" style={{ backgroundColor: "var(--danger)", opacity: 0.1, color: "var(--danger)" }}>
                    {JSON.stringify(lastApiError.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}

        {/* Raw Data */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-primary">Raw Data</h3>

          {data.analysis && (
            <div className="card rounded-lg p-3">
              <h4 className="mb-2 text-xs font-medium text-primary">Analysis</h4>
              <pre className="max-h-48 overflow-auto rounded p-2 text-xs" style={{ backgroundColor: "var(--surface-3)", color: "var(--text)" }}>
                {JSON.stringify(data.analysis, null, 2)}
              </pre>
            </div>
          )}

          {data.test && (
            <div className="card rounded-lg p-3">
              <h4 className="mb-2 text-xs font-medium text-primary">Test</h4>
              <pre className="max-h-48 overflow-auto rounded p-2 text-xs" style={{ backgroundColor: "var(--surface-3)", color: "var(--text)" }}>
                {JSON.stringify(data.test, null, 2)}
              </pre>
            </div>
          )}

          {data.runResult && (
            <div className="card rounded-lg p-3">
              <h4 className="mb-2 text-xs font-medium text-primary">Run Result</h4>
              <pre className="max-h-48 overflow-auto rounded p-2 text-xs" style={{ backgroundColor: "var(--surface-3)", color: "var(--text)" }}>
                {JSON.stringify(data.runResult, null, 2)}
              </pre>
            </div>
          )}

          {data.patch && (
            <div className="card rounded-lg p-3">
              <h4 className="mb-2 text-xs font-medium text-primary">Patch</h4>
              <pre className="max-h-48 overflow-auto rounded p-2 text-xs" style={{ backgroundColor: "var(--surface-3)", color: "var(--text)" }}>
                {JSON.stringify(data.patch, null, 2)}
              </pre>
            </div>
          )}

          {data.bugReport && (
            <div className="card rounded-lg p-3">
              <h4 className="mb-2 text-xs font-medium text-primary">Bug Report</h4>
              <pre className="max-h-48 overflow-auto rounded p-2 text-xs" style={{ backgroundColor: "var(--surface-3)", color: "var(--text)" }}>
                {JSON.stringify(data.bugReport, null, 2)}
              </pre>
            </div>
          )}

          {!data.analysis && !data.test && !data.runResult && !data.patch && !data.bugReport && (
            <p className="text-xs text-muted">No data available yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
