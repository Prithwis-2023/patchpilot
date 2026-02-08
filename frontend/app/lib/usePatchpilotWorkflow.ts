"use client";

import { useState, useCallback, useMemo } from "react";
import {
  WorkflowStep,
  type StepStatus,
  type WorkflowState,
  type AnalysisResult,
  type GeneratedTest,
  type RunResult,
  type PatchResult,
  type BugReport,
} from "./types";
import { createAdapter, type BackendAdapter, BackendError, NormalizationError, HttpAdapter } from "./backendAdapter";
import { config } from "./config";

interface WorkflowData {
  analysis: AnalysisResult | null;
  test: GeneratedTest | null;
  runResult: RunResult | null;
  patch: PatchResult | null;
  bugReport: BugReport | null;
}

interface ApiErrorInfo {
  timestamp: string;
  endpoint: string;
  status: number | null;
  message: string;
  details?: unknown;
}

const initialStepState = {
  status: "idle" as StepStatus,
  error: null as string | null,
};

export function usePatchpilotWorkflow() {
  // Pipeline mode can be overridden by UI toggle (runtime switching)
  const [pipelineModeOverride, setPipelineModeOverride] = useState<"sample" | "backend" | null>(null);
  
  // Determine active pipeline mode
  const activePipelineMode = pipelineModeOverride || config.pipelineMode;
  
  // Create adapter based on active mode
  const adapter = useMemo<BackendAdapter>(() => {
    return createAdapter(activePipelineMode);
  }, [activePipelineMode]);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState<WorkflowStep | null>(null);
  const [steps, setSteps] = useState<WorkflowState["steps"]>({
    [WorkflowStep.UPLOAD]: { ...initialStepState },
    [WorkflowStep.ANALYZE]: { ...initialStepState },
    [WorkflowStep.TEST]: { ...initialStepState },
    [WorkflowStep.RUN]: { ...initialStepState },
    [WorkflowStep.PATCH]: { ...initialStepState },
    [WorkflowStep.EXPORT]: { ...initialStepState },
  });
  const [data, setData] = useState<WorkflowData>({
    analysis: null,
    test: null,
    runResult: null,
    patch: null,
    bugReport: null,
  });
  
  // Track last API error for dev panel
  const [lastApiError, setLastApiError] = useState<ApiErrorInfo | null>(null);

  const updateStepStatus = useCallback(
    (
      step: WorkflowStep,
      status: StepStatus,
      error: string | null = null,
      startTime?: number,
      endTime?: number
    ) => {
      setSteps((prev) => {
        const prevStep = prev[step];
        const duration =
          startTime && endTime ? endTime - startTime : prevStep.startTime && endTime ? endTime - prevStep.startTime : undefined;

        return {
          ...prev,
          [step]: {
            status,
            error,
            startTime: startTime || prevStep.startTime,
            endTime: endTime || prevStep.endTime,
            duration: duration || prevStep.duration,
          },
        };
      });
    },
    []
  );

  const handleError = useCallback((error: unknown, endpoint: string) => {
    let errorMessage: string;
    let apiErrorInfo: ApiErrorInfo | null = null;

    if (error instanceof BackendError) {
      errorMessage = error.message;
      apiErrorInfo = {
        timestamp: new Date().toISOString(),
        endpoint: error.endpoint,
        status: error.status,
        message: error.message,
        details: error.details,
      };
    } else if (error instanceof NormalizationError) {
      errorMessage = `${error.message}. Missing fields: ${error.missingFields.join(", ")}`;
      apiErrorInfo = {
        timestamp: new Date().toISOString(),
        endpoint,
        status: null,
        message: errorMessage,
        details: {
          missingFields: error.missingFields,
          receivedData: error.receivedData,
        },
      };
    } else if (error instanceof Error) {
      errorMessage = error.message;
      apiErrorInfo = {
        timestamp: new Date().toISOString(),
        endpoint,
        status: null,
        message: error.message,
        details: { originalError: error },
      };
    } else {
      errorMessage = "Unknown error occurred";
      apiErrorInfo = {
        timestamp: new Date().toISOString(),
        endpoint,
        status: null,
        message: errorMessage,
        details: error,
      };
    }

    setLastApiError(apiErrorInfo);
    return errorMessage;
  }, []);

  const setVideo = useCallback((file: File) => {
    const startTime = Date.now();
    setUploadedFile(file);
    const endTime = Date.now();
    updateStepStatus(WorkflowStep.UPLOAD, "success", null, startTime, endTime);
    setCurrentStep(WorkflowStep.UPLOAD);
  }, [updateStepStatus]);

  const analyze = useCallback(async () => {
    if (!uploadedFile) {
      updateStepStatus(WorkflowStep.ANALYZE, "error", "No file uploaded");
      return;
    }

    setCurrentStep(WorkflowStep.ANALYZE);
    const startTime = Date.now();
    updateStepStatus(WorkflowStep.ANALYZE, "loading", null, startTime);
    setLastApiError(null);

    try {
      const result = await adapter.analyzeVideo(uploadedFile);
      const endTime = Date.now();
      setData((prev) => ({ ...prev, analysis: result }));
      updateStepStatus(WorkflowStep.ANALYZE, "success", null, startTime, endTime);
    } catch (error) {
      const endTime = Date.now();
      const errorMessage = handleError(error, "/analyze");
      updateStepStatus(WorkflowStep.ANALYZE, "error", errorMessage, startTime, endTime);
    }
  }, [uploadedFile, adapter, updateStepStatus, handleError]);

  const generateTest = useCallback(async () => {
    if (!data.analysis) {
      updateStepStatus(WorkflowStep.TEST, "error", "Analysis required");
      return;
    }

    setCurrentStep(WorkflowStep.TEST);
    const startTime = Date.now();
    updateStepStatus(WorkflowStep.TEST, "loading", null, startTime);
    setLastApiError(null);

    try {
      const result = await adapter.generateTest(data.analysis, data.analysis.targetUrl);
      const endTime = Date.now();
      setData((prev) => ({ ...prev, test: result }));
      updateStepStatus(WorkflowStep.TEST, "success", null, startTime, endTime);
    } catch (error) {
      const endTime = Date.now();
      const errorMessage = handleError(error, "/generate-test");
      updateStepStatus(WorkflowStep.TEST, "error", errorMessage, startTime, endTime);
    }
  }, [data.analysis, adapter, updateStepStatus, handleError]);

  const runTest = useCallback(async () => {
    if (!data.test) {
      updateStepStatus(WorkflowStep.RUN, "error", "Test required");
      return;
    }

    setCurrentStep(WorkflowStep.RUN);
    const startTime = Date.now();
    updateStepStatus(WorkflowStep.RUN, "loading", null, startTime);
    setLastApiError(null);

    try {
      const result = await adapter.runTest(data.test);
      const endTime = Date.now();
      setData((prev) => ({ ...prev, runResult: result }));
      updateStepStatus(WorkflowStep.RUN, "success", null, startTime, endTime);
    } catch (error) {
      const endTime = Date.now();
      const errorMessage = handleError(error, "/run-test");
      updateStepStatus(WorkflowStep.RUN, "error", errorMessage, startTime, endTime);
    }
  }, [data.test, adapter, updateStepStatus, handleError]);

  const generatePatch = useCallback(async () => {
    if (!data.analysis || !data.runResult) {
      updateStepStatus(WorkflowStep.PATCH, "error", "Analysis and run result required");
      return;
    }

    setCurrentStep(WorkflowStep.PATCH);
    const startTime = Date.now();
    updateStepStatus(WorkflowStep.PATCH, "loading", null, startTime);
    setLastApiError(null);

    try {
      const result = await adapter.generatePatch({
        analysis: data.analysis,
        run: data.runResult,
      });
      const endTime = Date.now();
      setData((prev) => ({ ...prev, patch: result }));
      updateStepStatus(WorkflowStep.PATCH, "success", null, startTime, endTime);
    } catch (error) {
      const endTime = Date.now();
      const errorMessage = handleError(error, "/generate-patch");
      updateStepStatus(WorkflowStep.PATCH, "error", errorMessage, startTime, endTime);
    }
  }, [data.analysis, data.runResult, adapter, updateStepStatus, handleError]);

  const exportBugReport = useCallback(async () => {
    if (!data.analysis || !data.patch) {
      updateStepStatus(WorkflowStep.EXPORT, "error", "Analysis and patch required");
      return;
    }

    setCurrentStep(WorkflowStep.EXPORT);
    const startTime = Date.now();
    updateStepStatus(WorkflowStep.EXPORT, "loading", null, startTime);

    try {
      // Generate bug report from existing data (client-side)
      // In future, this could be server-generated
      const markdown = generateBugReportMarkdown(data.analysis, data.test, data.runResult, data.patch);
      const endTime = Date.now();
      setData((prev) => ({ ...prev, bugReport: { markdown } }));
      updateStepStatus(WorkflowStep.EXPORT, "success", null, startTime, endTime);
    } catch (error) {
      const endTime = Date.now();
      const errorMessage = error instanceof Error ? error.message : "Export failed";
      updateStepStatus(WorkflowStep.EXPORT, "error", errorMessage, startTime, endTime);
    }
  }, [data, updateStepStatus]);

  const retry = useCallback(
    async (step: WorkflowStep) => {
      switch (step) {
        case WorkflowStep.ANALYZE:
          await analyze();
          break;
        case WorkflowStep.TEST:
          await generateTest();
          break;
        case WorkflowStep.RUN:
          await runTest();
          break;
        case WorkflowStep.PATCH:
          await generatePatch();
          break;
        case WorkflowStep.EXPORT:
          await exportBugReport();
          break;
        default:
          break;
      }
    },
    [analyze, generateTest, runTest, generatePatch, exportBugReport]
  );

  const reset = useCallback(() => {
    setUploadedFile(null);
    setCurrentStep(null);
    setSteps({
      [WorkflowStep.UPLOAD]: { ...initialStepState },
      [WorkflowStep.ANALYZE]: { ...initialStepState },
      [WorkflowStep.TEST]: { ...initialStepState },
      [WorkflowStep.RUN]: { ...initialStepState },
      [WorkflowStep.PATCH]: { ...initialStepState },
      [WorkflowStep.EXPORT]: { ...initialStepState },
    });
    setData({
      analysis: null,
      test: null,
      runResult: null,
      patch: null,
      bugReport: null,
    });
    setLastApiError(null);
  }, []);

  // Computed: Can proceed to next step?
  const canGenerateTest =
    steps[WorkflowStep.ANALYZE].status === "success" &&
    steps[WorkflowStep.TEST].status !== "loading";
  const canRunTest =
    steps[WorkflowStep.TEST].status === "success" &&
    steps[WorkflowStep.RUN].status !== "loading";
  const canGeneratePatch =
    steps[WorkflowStep.RUN].status === "success" &&
    data.runResult?.status === "failed" &&
    steps[WorkflowStep.PATCH].status !== "loading";
  const canExport =
    steps[WorkflowStep.PATCH].status === "success" &&
    steps[WorkflowStep.EXPORT].status !== "loading";

  // Expose adapter for debug panel (only HttpAdapter has debug methods)
  const httpAdapter = useMemo(() => {
    return adapter instanceof HttpAdapter ? adapter : null;
  }, [adapter]);

  return {
    // State
    pipelineMode: activePipelineMode,
    setPipelineMode: setPipelineModeOverride,
    uploadedFile,
    currentStep,
    steps,
    data,
    lastApiError,
    // Actions
    setVideo,
    analyze,
    generateTest,
    runTest,
    generatePatch,
    exportBugReport,
    retry,
    reset,
    // Computed
    canGenerateTest,
    canRunTest,
    canGeneratePatch,
    canExport,
    // Debug (dev only)
    httpAdapter,
  };
}

/**
 * Generate bug report markdown from workflow data
 */
function generateBugReportMarkdown(
  analysis: AnalysisResult,
  test: GeneratedTest | null,
  runResult: RunResult | null,
  patch: PatchResult
): string {
  const timeline = analysis.timeline
    .map((e) => `- **${e.timestamp}**: ${e.description}`)
    .join("\n");

  const reproSteps = analysis.reproSteps
    .map((s) => `${s.number}. ${s.description}`)
    .join("\n");

  return `# Bug Report

## Summary
${analysis.actual || "Bug detected in application"}

## Timeline
${timeline}

## Reproduction Steps
${reproSteps}

## Expected Behavior
${analysis.expected || "N/A"}

## Actual Behavior
${analysis.actual || "N/A"}

${test ? `## Generated Test
\`\`\`typescript
${test.playwrightSpec}
\`\`\`
` : ""}

${runResult ? `## Test Results
- Status: **${runResult.status === "success" ? "PASSED" : "FAILED"}**
${runResult.stdout ? `\n### Output:
\`\`\`
${runResult.stdout}
\`\`\`
` : ""}
${runResult.stderr ? `\n### Errors:
\`\`\`
${runResult.stderr}
\`\`\`
` : ""}
` : ""}

## Suggested Fix

\`\`\`diff
${patch.diff}
\`\`\`

## Rationale
${patch.rationale}

${patch.risks.length > 0 ? `## Risks
${patch.risks.map((r) => `- ${r}`).join("\n")}
` : ""}

---
*Generated by PatchPilot - Transform bug recordings into fixes with Gemini 3*
`;
}
