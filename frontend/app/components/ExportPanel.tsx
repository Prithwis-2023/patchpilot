"use client";

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

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Bug Report Export</h2>
        {bugReport && (
          <button
            onClick={handleDownload}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Download Markdown
          </button>
        )}
      </div>
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
          <span>Generating report...</span>
        </div>
      ) : bugReport ? (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
            {bugReport}
          </pre>
        </div>
      ) : (
        <p className="text-gray-400">No bug report available yet.</p>
      )}
    </div>
  );
}
