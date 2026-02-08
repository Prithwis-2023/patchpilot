"use client";

interface Step {
  number: number;
  description: string;
}

interface StepsPanelProps {
  steps?: Step[];
  isLoading?: boolean;
}

export default function StepsPanel({ steps, isLoading = false }: StepsPanelProps) {
  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Reproduction Steps</h2>
      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <span>Generating steps...</span>
        </div>
      ) : steps && steps.length > 0 ? (
        <ol className="list-decimal space-y-3 pl-6">
          {steps.map((step) => (
            <li key={step.number} className="text-gray-700">
              {step.description}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-400">No reproduction steps yet.</p>
      )}
    </div>
  );
}
