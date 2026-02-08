"use client";

interface CodePanelProps {
  title: string;
  code?: string;
  language?: string;
  isLoading?: boolean;
}

export default function CodePanel({
  title,
  code,
  language = "typescript",
  isLoading = false,
}: CodePanelProps) {
  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
    }
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {code && (
          <button
            onClick={handleCopy}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            Copy
          </button>
        )}
      </div>
      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <span>Generating {title.toLowerCase()}...</span>
        </div>
      ) : code ? (
        <pre className="overflow-x-auto rounded-md bg-gray-900 p-4">
          <code className={`font-mono text-sm text-gray-100`}>{code}</code>
        </pre>
      ) : (
        <p className="text-gray-400">No {title.toLowerCase()} yet.</p>
      )}
    </div>
  );
}
