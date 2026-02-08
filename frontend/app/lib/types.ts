/**
 * PatchPilot Workflow Types
 * Strict type definitions for the entire workflow pipeline
 */

export enum WorkflowStep {
  UPLOAD = "upload",
  ANALYZE = "analyze",
  TEST = "test",
  RUN = "run",
  PATCH = "patch",
  EXPORT = "export",
}

export type StepStatus = "idle" | "loading" | "success" | "error";

export interface StepState {
  status: StepStatus;
  error: string | null;
}

export interface WorkflowState {
  currentStep: WorkflowStep | null;
  steps: {
    [WorkflowStep.UPLOAD]: StepState;
    [WorkflowStep.ANALYZE]: StepState;
    [WorkflowStep.TEST]: StepState;
    [WorkflowStep.RUN]: StepState;
    [WorkflowStep.PATCH]: StepState;
    [WorkflowStep.EXPORT]: StepState;
  };
  uploadedFile: File | null;
  sampleMode: boolean;
}

export interface TimelineEvent {
  timestamp: string;
  description: string;
}

export interface ReproductionStep {
  number: number;
  description: string;
}

export interface AnalysisResult {
  timeline: TimelineEvent[];
  reproSteps: ReproductionStep[];
  expected: string;
  actual: string;
  targetUrl?: string;
}

export interface GeneratedTest {
  playwrightSpec: string;
  filename: string;
}

export interface RunResult {
  status: "success" | "failed";
  stdout: string;
  stderr: string;
  screenshotUrl: string | null;
}

export interface PatchResult {
  diff: string;
  rationale: string;
  risks: string[];
}

export interface BugReport {
  markdown: string;
}
