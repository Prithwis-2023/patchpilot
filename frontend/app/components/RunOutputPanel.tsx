"use client";

import Image from "next/image";

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
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Test Run Results</h2>
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
          <span>Running test...</span>
        </div>
      ) : status ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                status === "success"
                  ? "bg-green-100 text-green-800"
                  : status === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {status === "success"
                ? "✓ Passed"
                : status === "failed"
                  ? "✗ Failed"
                  : "Running..."}
            </span>
          </div>
          {stdout && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Output:</h3>
              <pre className="overflow-x-auto rounded-md bg-gray-900 p-4">
                <code className="font-mono text-sm text-gray-100">{stdout}</code>
              </pre>
            </div>
          )}
          {stderr && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-red-700">Errors:</h3>
              <pre className="overflow-x-auto rounded-md bg-red-50 p-4">
                <code className="font-mono text-sm text-red-800">{stderr}</code>
              </pre>
            </div>
          )}
          {screenshotUrl && (
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-700">Screenshot:</h3>
              <div className="relative h-64 w-full">
                <Image
                  src={screenshotUrl}
                  alt="Test failure screenshot"
                  fill
                  className="rounded-md border border-gray-200 object-contain"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-400">No test run results yet.</p>
      )}
    </div>
  );
}
