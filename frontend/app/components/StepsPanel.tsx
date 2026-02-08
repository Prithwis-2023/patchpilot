"use client";

import type { ReproductionStep } from "../lib/types";
import { config } from "../lib/config";

interface StepsPanelProps {
  steps?: ReproductionStep[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function StepsPanel({
  steps,
  isLoading = false,
  error,
  onRetry,
}: StepsPanelProps) {
  return (
    <div className="card w-full rounded-lg p-6">
      <h2 className="mb-4 text-xl font-semibold text-primary">Reproduction Steps</h2>
      {error ? (
        <div className="space-y-3">
          <div className="card rounded-md p-4" style={{ borderColor: "var(--danger)" }}>
            <p className="text-sm font-medium" style={{ color: "var(--danger)" }}>Error generating reproduction steps</p>
            <p className="mt-1 text-sm" style={{ color: "var(--danger)" }}>{error}</p>
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
              <pre className="mt-2 overflow-x-auto rounded p-2 text-xs" style={{ backgroundColor: "var(--danger)", opacity: 0.1, color: "var(--danger)" }}>
                {error}
              </pre>
            </details>
          )}
        </div>
      ) : isLoading ? (
        <div className="flex items-center gap-2 text-muted">
          <div className="h-4 w-4 animate-spin rounded-full border-2" style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}></div>
          <span>Generating repro steps...</span>
        </div>
      ) : steps && steps.length > 0 ? (
        <ol className="list-decimal space-y-3 pl-6">
          {steps.map((step) => (
            <li key={step.number} className="text-primary">
              {step.description}
            </li>
          ))}
        </ol>
      ) : (
        <div className="card rounded-md p-4 text-center">
          <p className="text-sm text-muted">
            Numbered reproduction steps will be generated here, providing a clear sequence to reproduce
            the bug.
          </p>
        </div>
      )}
    </div>
  );
}
