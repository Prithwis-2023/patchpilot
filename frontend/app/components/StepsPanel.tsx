"use client";

import type { ReproductionStep } from "../lib/types";

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
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Reproduction Steps</h2>
      {error ? (
        <div className="space-y-2">
          <p className="text-sm text-red-600">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
            >
              Retry
            </button>
          )}
        </div>
      ) : isLoading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <span>Generating steps...</span>
        </div>
      ) : steps && steps.length > 0 ? (
        <ol className="list-decimal space-y-3 pl-6">
          {steps.map((step) => (
            <li key={step.number} className="text-gray-700">
              {step.description}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-400">No reproduction steps yet.</p>
      )}
    </div>
  );
}
