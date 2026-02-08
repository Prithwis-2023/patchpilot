/**
 * PatchPilot Configuration
 * Reads environment variables and validates configuration
 */

type PipelineMode = "sample" | "backend";

interface Config {
  backendUrl: string;
  pipelineMode: PipelineMode;
  isDevelopment: boolean;
}

function getPipelineMode(): PipelineMode {
  const mode = process.env.NEXT_PUBLIC_PIPELINE_MODE?.toLowerCase();
  if (mode === "sample" || mode === "backend") {
    return mode;
  }
  // Default to sample mode for safety
  return "sample";
}

export const config: Config = {
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  pipelineMode: getPipelineMode(),
  isDevelopment: process.env.NODE_ENV === "development",
};

// Validate configuration
if (config.pipelineMode === "backend" && !config.backendUrl) {
  console.warn(
    "[PatchPilot Config] Backend mode enabled but NEXT_PUBLIC_BACKEND_URL is not set. Defaulting to http://localhost:8000"
  );
}
