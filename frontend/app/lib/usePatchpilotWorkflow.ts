"use client";

import { useState, useCallback } from "react";
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
import {
  sampleAnalysisResult,
  sampleGeneratedTest,
  sampleRunResult,
  samplePatchResult,
  sampleBugReport,
} from "./sampleData";

interface WorkflowData {
  analysis: AnalysisResult | null;
  test: GeneratedTest | null;
  runResult: RunResult | null;
  patch: PatchResult | null;
  bugReport: BugReport | null;
}

const initialStepState = {
  status: "idle" as StepStatus,
  error: null as string | null,
};

export function usePatchpilotWorkflow() {
  const [sampleMode, setSampleMode] = useState(false);
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

  const updateStepStatus = useCallback(
    (step: WorkflowStep, status: StepStatus, error: string | null = null) => {
      setSteps((prev) => ({
        ...prev,
        [step]: { status, error },
      }));
    },
    []
  );

  const setVideo = useCallback((file: File) => {
    setUploadedFile(file);
    updateStepStatus(WorkflowStep.UPLOAD, "success");
    setCurrentStep(WorkflowStep.UPLOAD);
  }, [updateStepStatus]);

  const analyze = useCallback(async () => {
    setCurrentStep(WorkflowStep.ANALYZE);
    updateStepStatus(WorkflowStep.ANALYZE, "loading");

    try {
      if (sampleMode) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setData((prev) => ({ ...prev, analysis: sampleAnalysisResult }));
        updateStepStatus(WorkflowStep.ANALYZE, "success");
      } else {
        // TODO: Phase 3 - Real API call
        // const response = await fetch('/api/analyze', { method: 'POST', body: formData });
        // const result = await response.json();
        // setData((prev) => ({ ...prev, analysis: result }));
        // updateStepStatus(WorkflowStep.ANALYZE, "success");
        throw new Error("API integration not yet implemented. Enable Sample Mode to test.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Analysis failed";
      updateStepStatus(WorkflowStep.ANALYZE, "error", errorMessage);
    }
  }, [sampleMode, updateStepStatus]);

  const generateTest = useCallback(async () => {
    setCurrentStep(WorkflowStep.TEST);
    updateStepStatus(WorkflowStep.TEST, "loading");

    try {
      if (sampleMode) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
        setData((prev) => ({ ...prev, test: sampleGeneratedTest }));
        updateStepStatus(WorkflowStep.TEST, "success");
      } else {
        // TODO: Phase 3 - Real API call
        throw new Error("API integration not yet implemented. Enable Sample Mode to test.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Test generation failed";
      updateStepStatus(WorkflowStep.TEST, "error", errorMessage);
    }
  }, [sampleMode, updateStepStatus]);

  const runTest = useCallback(async () => {
    setCurrentStep(WorkflowStep.RUN);
    updateStepStatus(WorkflowStep.RUN, "loading");

    try {
      if (sampleMode) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setData((prev) => ({ ...prev, runResult: sampleRunResult }));
        updateStepStatus(WorkflowStep.RUN, "success");
      } else {
        // TODO: Phase 3 - Real API call
        throw new Error("API integration not yet implemented. Enable Sample Mode to test.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Test execution failed";
      updateStepStatus(WorkflowStep.RUN, "error", errorMessage);
    }
  }, [sampleMode, updateStepStatus]);

  const generatePatch = useCallback(async () => {
    setCurrentStep(WorkflowStep.PATCH);
    updateStepStatus(WorkflowStep.PATCH, "loading");

    try {
      if (sampleMode) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setData((prev) => ({ ...prev, patch: samplePatchResult }));
        updateStepStatus(WorkflowStep.PATCH, "success");
      } else {
        // TODO: Phase 3 - Real API call
        throw new Error("API integration not yet implemented. Enable Sample Mode to test.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Patch generation failed";
      updateStepStatus(WorkflowStep.PATCH, "error", errorMessage);
    }
  }, [sampleMode, updateStepStatus]);

  const exportBugReport = useCallback(async () => {
    setCurrentStep(WorkflowStep.EXPORT);
    updateStepStatus(WorkflowStep.EXPORT, "loading");

    try {
      if (sampleMode) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setData((prev) => ({ ...prev, bugReport: sampleBugReport }));
        updateStepStatus(WorkflowStep.EXPORT, "success");
      } else {
        // TODO: Phase 3 - Real API call
        throw new Error("API integration not yet implemented. Enable Sample Mode to test.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Export failed";
      updateStepStatus(WorkflowStep.EXPORT, "error", errorMessage);
    }
  }, [sampleMode, updateStepStatus]);

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
  }, []);

  // Computed: Can proceed to next step?
  const canAnalyze = steps[WorkflowStep.UPLOAD].status === "success";
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

  return {
    // State
    sampleMode,
    setSampleMode,
    uploadedFile,
    currentStep,
    steps,
    data,
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
    canAnalyze,
    canGenerateTest,
    canRunTest,
    canGeneratePatch,
    canExport,
  };
}
