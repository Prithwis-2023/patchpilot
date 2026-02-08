"use client";

import { WorkflowStep, type StepStatus } from "../lib/types";

interface StepperProps {
  steps: {
    [key in WorkflowStep]: {
      status: StepStatus;
      duration?: number;
    };
  };
  currentStep: WorkflowStep | null;
}

const stepLabels: Record<WorkflowStep, string> = {
  [WorkflowStep.UPLOAD]: "Upload",
  [WorkflowStep.ANALYZE]: "Analyze",
  [WorkflowStep.TEST]: "Generate Test",
  [WorkflowStep.RUN]: "Run Test",
  [WorkflowStep.PATCH]: "Generate Patch",
  [WorkflowStep.EXPORT]: "Export",
};

const stepOrder: WorkflowStep[] = [
  WorkflowStep.UPLOAD,
  WorkflowStep.ANALYZE,
  WorkflowStep.TEST,
  WorkflowStep.RUN,
  WorkflowStep.PATCH,
  WorkflowStep.EXPORT,
];

function getStepIcon(status: StepStatus) {
  switch (status) {
    case "success":
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
          <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    case "error":
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100">
          <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      );
    case "loading":
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        </div>
      );
    default:
      return (
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-100">
          <div className="h-2 w-2 rounded-full bg-gray-400"></div>
        </div>
      );
  }
}

function formatDuration(ms?: number): string {
  if (!ms) return "";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">Progress</h2>
      <div className="space-y-4">
        {stepOrder.map((step, index) => {
          const stepState = steps[step];
          const isCurrent = currentStep === step;
          const isCompleted = stepState.status === "success";
          const isError = stepState.status === "error";
          const isActive = isCurrent || (isCompleted && index === stepOrder.length - 1);

          return (
            <div key={step} className="flex items-start gap-4">
              {/* Icon and connector line */}
              <div className="flex flex-col items-center">
                <div className={`${isActive ? "ring-2 ring-blue-500 ring-offset-2" : ""} rounded-full`}>
                  {getStepIcon(stepState.status)}
                </div>
                {index < stepOrder.length - 1 && (
                  <div
                    className={`mt-1 h-12 w-0.5 ${
                      isCompleted || isCurrent ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>

              {/* Step content */}
              <div className={`flex-1 ${isActive ? "" : "opacity-75"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className={`text-sm font-medium ${
                        isActive ? "text-gray-900" : isError ? "text-red-600" : "text-gray-600"
                      }`}
                    >
                      {stepLabels[step]}
                    </h3>
                    {stepState.duration && stepState.status === "success" && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        Completed in {formatDuration(stepState.duration)}
                      </p>
                    )}
                    {stepState.status === "loading" && (
                      <p className="mt-0.5 text-xs text-blue-600">In progress...</p>
                    )}
                    {stepState.status === "error" && (
                      <p className="mt-0.5 text-xs text-red-600">Failed</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
