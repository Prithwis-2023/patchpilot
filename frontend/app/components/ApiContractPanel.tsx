"use client";

import { useState } from "react";
import { config } from "../lib/config";

interface ApiErrorInfo {
  timestamp: string;
  endpoint: string;
  status: number | null;
  message: string;
  details?: unknown;
}

interface ApiContractPanelProps {
  pipelineMode: "sample" | "backend";
  lastApiError: ApiErrorInfo | null;
}

export default function ApiContractPanel({
  pipelineMode,
  lastApiError,
}: ApiContractPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Only show in development
  if (!config.isDevelopment) {
    return null;
  }

  const endpoints = [
    { method: "POST", path: "/analyze", description: "Upload video file (multipart)" },
    { method: "POST", path: "/generate-test", description: "Generate Playwright test (JSON)" },
    { method: "POST", path: "/run-test", description: "Run Playwright test (JSON)" },
    { method: "POST", path: "/generate-patch", description: "Generate fix patch (JSON)" },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full rounded-t-lg bg-gray-800 px-4 py-2 text-left text-sm font-medium text-white hover:bg-gray-700"
      >
        {isOpen ? "▼" : "▲"} Dev Tools: API Contract
      </button>
      {isOpen && (
        <div className="max-h-96 overflow-y-auto rounded-b-lg border border-gray-300 bg-white p-4 shadow-lg">
          <div className="space-y-4 text-sm">
            {/* Pipeline Mode */}
            <div>
              <h3 className="font-semibold text-gray-800">Pipeline Mode</h3>
              <p className="text-gray-600">
                <span
                  className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                    pipelineMode === "backend"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {pipelineMode.toUpperCase()}
                </span>
              </p>
            </div>

            {/* Backend URL */}
            {pipelineMode === "backend" && (
              <div>
                <h3 className="font-semibold text-gray-800">Backend Base URL</h3>
                <p className="font-mono text-xs text-gray-600">{config.backendUrl}</p>
              </div>
            )}

            {/* Endpoints */}
            <div>
              <h3 className="font-semibold text-gray-800">Known Endpoints</h3>
              <ul className="mt-1 space-y-1">
                {endpoints.map((endpoint, index) => (
                  <li key={index} className="text-xs text-gray-600">
                    <span className="font-mono font-semibold">{endpoint.method}</span>{" "}
                    <span className="font-mono">{endpoint.path}</span>
                    <br />
                    <span className="text-gray-500">{endpoint.description}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Last API Error */}
            {lastApiError && (
              <div>
                <h3 className="font-semibold text-red-800">Last API Error</h3>
                <div className="mt-1 space-y-1 rounded border border-red-200 bg-red-50 p-2 text-xs">
                  <div>
                    <span className="font-semibold">Time:</span>{" "}
                    {new Date(lastApiError.timestamp).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Endpoint:</span>{" "}
                    <span className="font-mono">{lastApiError.endpoint}</span>
                  </div>
                  {lastApiError.status !== null && (
                    <div>
                      <span className="font-semibold">Status:</span> {lastApiError.status}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">Message:</span> {lastApiError.message}
                  </div>
                  {lastApiError.details !== undefined && (
                    <details className="mt-2">
                      <summary className="cursor-pointer font-semibold">Details</summary>
                      <pre className="mt-1 overflow-x-auto text-xs">
                        {JSON.stringify(lastApiError.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            )}

            {!lastApiError && (
              <div className="text-xs text-gray-500">No API errors recorded</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
