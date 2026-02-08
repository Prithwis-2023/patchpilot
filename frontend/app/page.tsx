"use client";

import { useState } from "react";
import UploadCard from "./components/UploadCard";
import TimelinePanel from "./components/TimelinePanel";
import StepsPanel from "./components/StepsPanel";
import CodePanel from "./components/CodePanel";
import RunOutputPanel from "./components/RunOutputPanel";
import ExportPanel from "./components/ExportPanel";

type WorkflowState =
  | "idle"
  | "uploading"
  | "analyzing"
  | "generating-test"
  | "running-test"
  | "generating-patch"
  | "completed"
  | "error";

interface TimelineEvent {
  timestamp: string;
  description: string;
}

interface Step {
  number: number;
  description: string;
}

export default function Home() {
  const [state, setState] = useState<WorkflowState>("idle");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // Placeholder data (will be replaced with real API data in Phase 3)
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[] | undefined>(undefined);
  const [reproductionSteps, setReproductionSteps] = useState<Step[] | undefined>(undefined);
  const [playwrightTest, setPlaywrightTest] = useState<string | undefined>(undefined);
  const [testRunStatus, setTestRunStatus] = useState<
    "running" | "success" | "failed" | undefined
  >(undefined);
  const [testStdout, setTestStdout] = useState<string | undefined>(undefined);
  const [testStderr, setTestStderr] = useState<string | undefined>(undefined);
  const [screenshotUrl, setScreenshotUrl] = useState<string | undefined>(undefined);
  const [patchDiff, setPatchDiff] = useState<string | undefined>(undefined);
  const [bugReport, setBugReport] = useState<string | undefined>(undefined);

  const handleUpload = (file: File) => {
    setUploadedFile(file);
    setState("uploading");
    // Simulate upload completion
    setTimeout(() => {
      setState("analyzing");
      // Placeholder: will be replaced with real API call in Phase 3
      setTimeout(() => {
        setTimelineEvents([
          { timestamp: "00:00", description: "Page loads" },
          { timestamp: "00:05", description: "User clicks button" },
          { timestamp: "00:10", description: "Error appears" },
        ]);
        setReproductionSteps([
          { number: 1, description: "Navigate to the application" },
          { number: 2, description: "Click on the submit button" },
          { number: 3, description: "Observe the error message" },
        ]);
        setState("idle");
      }, 2000);
    }, 1000);
  };

  const handleGenerateTest = () => {
    setState("generating-test");
    // Placeholder: will be replaced with real API call in Phase 3
    setTimeout(() => {
      setPlaywrightTest(`import { test, expect } from '@playwright/test';

test('bug reproduction', async ({ page }) => {
  await page.goto('https://example.com');
  await page.click('button[type="submit"]');
  await expect(page.locator('.error')).toBeVisible();
});`);
      setState("idle");
    }, 1500);
  };

  const handleRunTest = () => {
    setState("running-test");
    setTestRunStatus("running");
    // Placeholder: will be replaced with real API call in Phase 3
    setTimeout(() => {
      setTestRunStatus("failed");
      setTestStdout("Running test...");
      setTestStderr("Error: Element not found");
      setScreenshotUrl(undefined); // Will be populated from API
      setState("idle");
    }, 2000);
  };

  const handleGeneratePatch = () => {
    setState("generating-patch");
    // Placeholder: will be replaced with real API call in Phase 3
    setTimeout(() => {
      setPatchDiff(`--- a/src/component.tsx
+++ b/src/component.tsx
@@ -10,7 +10,7 @@ export function Component() {
   return (
     <div>
-      <button onClick={handleClick}>Submit</button>
+      <button onClick={handleClick} disabled={isLoading}>Submit</button>
     </div>
   );
 }`);
      setState("idle");
    }, 1500);
  };

  const handleExport = () => {
    // Placeholder: will be replaced with real API call in Phase 3
    setBugReport(`# Bug Report

## Timeline
- 00:00: Page loads
- 00:05: User clicks button
- 00:10: Error appears

## Reproduction Steps
1. Navigate to the application
2. Click on the submit button
3. Observe the error message

## Suggested Fix
\`\`\`diff
--- a/src/component.tsx
+++ b/src/component.tsx
@@ -10,7 +10,7 @@ export function Component() {
   return (
     <div>
-      <button onClick={handleClick}>Submit</button>
+      <button onClick={handleClick} disabled={isLoading}>Submit</button>
     </div>
   );
 }
\`\`\`
`);
  };

  const canGenerateTest = timelineEvents && reproductionSteps && state === "idle";
  const canRunTest = playwrightTest && state === "idle";
  const canGeneratePatch = testRunStatus === "failed" && state === "idle";
  const canExport = patchDiff && state === "idle";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">PatchPilot</h1>
          <p className="mt-1 text-sm text-gray-600">
            Transform bug recordings into fixes with AI-powered analysis
          </p>
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
              isUploading={state === "uploading" || state === "analyzing"}
            />
            {uploadedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Uploaded: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </section>

          {/* Step 2: Analysis Results */}
          {(state === "analyzing" || timelineEvents || reproductionSteps) && (
            <section>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  2
                </div>
                <h2 className="text-2xl font-semibold text-gray-900">Analysis Results</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <TimelinePanel
                  events={timelineEvents}
                  isLoading={state === "analyzing"}
                />
                <StepsPanel steps={reproductionSteps} isLoading={state === "analyzing"} />
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
                  onClick={handleGenerateTest}
                  disabled={state !== "idle"}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  Generate Test
                </button>
              </div>
            </section>
          )}

          {/* Step 4: Test Code */}
          {(state === "generating-test" || playwrightTest) && (
            <section>
              <CodePanel
                title="Generated Playwright Test"
                code={playwrightTest}
                language="typescript"
                isLoading={state === "generating-test"}
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
                  onClick={handleRunTest}
                  disabled={state !== "idle"}
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                >
                  Run Test
                </button>
              </div>
            </section>
          )}

          {/* Step 6: Test Results */}
          {(state === "running-test" || testRunStatus) && (
            <section>
              <RunOutputPanel
                status={testRunStatus}
                stdout={testStdout}
                stderr={testStderr}
                screenshotUrl={screenshotUrl}
                isLoading={state === "running-test"}
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
                  onClick={handleGeneratePatch}
                  disabled={state !== "idle"}
                  className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
                >
                  Generate Patch
                </button>
              </div>
            </section>
          )}

          {/* Step 8: Patch Diff */}
          {(state === "generating-patch" || patchDiff) && (
            <section>
              <CodePanel
                title="Suggested Fix Patch"
                code={patchDiff}
                language="diff"
                isLoading={state === "generating-patch"}
              />
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
                  onClick={handleExport}
                  disabled={state !== "idle"}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  Generate Report
                </button>
              </div>
            </section>
          )}

          {/* Export Panel */}
          {bugReport && (
            <section>
              <ExportPanel bugReport={bugReport} />
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
