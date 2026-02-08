"use client";

import { usePatchpilotWorkflow } from "./lib/usePatchpilotWorkflow";
import { WorkflowStep } from "./lib/types";
import UploadCard from "./components/UploadCard";
import TimelinePanel from "./components/TimelinePanel";
import StepsPanel from "./components/StepsPanel";
import CodePanel from "./components/CodePanel";
import RunOutputPanel from "./components/RunOutputPanel";
import ExportPanel from "./components/ExportPanel";

export default function Home() {
  const {
    sampleMode,
    setSampleMode,
    uploadedFile,
    steps,
    data,
    setVideo,
    analyze,
    generateTest,
    runTest,
    generatePatch,
    exportBugReport,
    retry,
    reset,
    canGenerateTest,
    canRunTest,
    canGeneratePatch,
    canExport,
  } = usePatchpilotWorkflow();

  const handleUpload = (file: File) => {
    setVideo(file);
    // Auto-trigger analyze after upload
    setTimeout(() => {
      analyze();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">PatchPilot</h1>
              <p className="mt-1 text-sm text-gray-600">
                Transform bug recordings into fixes with AI-powered analysis
              </p>
            </div>
            <div className="flex items-center gap-4">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={sampleMode}
                  onChange={(e) => setSampleMode(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Sample Mode</span>
              </label>
              {(uploadedFile || data.analysis) && (
                <button
                  onClick={reset}
                  className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-300"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
          {sampleMode && (
            <div className="mt-3 rounded-md bg-blue-50 p-3">
              <p className="text-sm text-blue-800">
                <strong>Sample Mode ON:</strong> Using sample data for demonstration. No API calls
                will be made.
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Step 1: Upload */}
          <section>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                1
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">Upload Bug Recording</h2>
            </div>
            <UploadCard
              onUpload={handleUpload}
              isUploading={steps[WorkflowStep.UPLOAD].status === "loading"}
            />
            {uploadedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Uploaded: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </section>

          {/* Step 2: Analysis Results */}
          {(steps[WorkflowStep.ANALYZE].status !== "idle" || data.analysis) && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    2
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Analysis Results</h2>
                </div>
                {steps[WorkflowStep.ANALYZE].status === "error" && (
                  <button
                    onClick={() => retry(WorkflowStep.ANALYZE)}
                    className="rounded-md bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
                  >
                    Retry Analysis
                  </button>
                )}
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <TimelinePanel
                  events={data.analysis?.timeline}
                  isLoading={steps[WorkflowStep.ANALYZE].status === "loading"}
                  error={steps[WorkflowStep.ANALYZE].error}
                  onRetry={() => retry(WorkflowStep.ANALYZE)}
                />
                <StepsPanel
                  steps={data.analysis?.reproSteps}
                  isLoading={steps[WorkflowStep.ANALYZE].status === "loading"}
                  error={steps[WorkflowStep.ANALYZE].error}
                  onRetry={() => retry(WorkflowStep.ANALYZE)}
                />
              </div>
            </section>
          )}

          {/* Step 3: Generate Test */}
          {canGenerateTest && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    3
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Generate Playwright Test</h2>
                </div>
                <button
                  onClick={generateTest}
                  disabled={steps[WorkflowStep.TEST].status === "loading"}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {steps[WorkflowStep.TEST].status === "loading" ? "Generating..." : "Generate Test"}
                </button>
              </div>
            </section>
          )}

          {/* Step 4: Test Code */}
          {(steps[WorkflowStep.TEST].status !== "idle" || data.test) && (
            <section>
              <CodePanel
                title="Generated Playwright Test"
                code={data.test?.playwrightSpec}
                isLoading={steps[WorkflowStep.TEST].status === "loading"}
                error={steps[WorkflowStep.TEST].error}
                onRetry={() => retry(WorkflowStep.TEST)}
              />
            </section>
          )}

          {/* Step 5: Run Test */}
          {canRunTest && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    4
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Run Test</h2>
                </div>
                <button
                  onClick={runTest}
                  disabled={steps[WorkflowStep.RUN].status === "loading"}
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                >
                  {steps[WorkflowStep.RUN].status === "loading" ? "Running..." : "Run Test"}
                </button>
              </div>
            </section>
          )}

          {/* Step 6: Test Results */}
          {(steps[WorkflowStep.RUN].status !== "idle" || data.runResult) && (
            <section>
              <RunOutputPanel
                status={data.runResult?.status}
                stdout={data.runResult?.stdout}
                stderr={data.runResult?.stderr}
                screenshotUrl={data.runResult?.screenshotUrl}
                isLoading={steps[WorkflowStep.RUN].status === "loading"}
                error={steps[WorkflowStep.RUN].error}
                onRetry={() => retry(WorkflowStep.RUN)}
              />
            </section>
          )}

          {/* Step 7: Generate Patch */}
          {canGeneratePatch && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    5
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Generate Fix Patch</h2>
                </div>
                <button
                  onClick={generatePatch}
                  disabled={steps[WorkflowStep.PATCH].status === "loading"}
                  className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                >
                  {steps[WorkflowStep.PATCH].status === "loading" ? "Generating..." : "Generate Patch"}
                </button>
              </div>
            </section>
          )}

          {/* Step 8: Patch Diff */}
          {(steps[WorkflowStep.PATCH].status !== "idle" || data.patch) && (
            <section>
              <CodePanel
                title="Suggested Fix Patch"
                code={data.patch?.diff}
                isLoading={steps[WorkflowStep.PATCH].status === "loading"}
                error={steps[WorkflowStep.PATCH].error}
                onRetry={() => retry(WorkflowStep.PATCH)}
              />
              {data.patch && (
                <div className="mt-4 space-y-2 rounded-lg border border-gray-200 bg-white p-4">
                  <h3 className="text-sm font-semibold text-gray-800">Rationale:</h3>
                  <p className="text-sm text-gray-700">{data.patch.rationale}</p>
                  {data.patch.risks.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-gray-800">Risks:</h4>
                      <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-gray-700">
                        {data.patch.risks.map((risk, index) => (
                          <li key={index}>{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Step 9: Export */}
          {canExport && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    6
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Export Bug Report</h2>
                </div>
                <button
                  onClick={exportBugReport}
                  disabled={steps[WorkflowStep.EXPORT].status === "loading"}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  {steps[WorkflowStep.EXPORT].status === "loading" ? "Generating..." : "Generate Report"}
                </button>
              </div>
            </section>
          )}

          {/* Export Panel */}
          {data.bugReport && (
            <section>
              <ExportPanel
                bugReport={data.bugReport.markdown}
                isLoading={steps[WorkflowStep.EXPORT].status === "loading"}
                error={steps[WorkflowStep.EXPORT].error}
                onRetry={() => retry(WorkflowStep.EXPORT)}
              />
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-600 sm:px-6 lg:px-8">
          <p>
            <strong>PatchPilot</strong> — Transform bug recordings into fixes with Gemini 3
          </p>
        </div>
      </footer>
    </div>
  );
}
