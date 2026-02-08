/**
 * PatchPilot Backend Adapter
 * Abstraction layer for backend integration with sample and HTTP implementations
 * 
 * ============================================================================
 * PROVISIONAL BACKEND CONTRACT (Based on /backend/app.py inspection)
 * ============================================================================
 * 
 * Endpoints:
 * 
 * 1. POST /analyze
 *    Request: multipart/form-data with "file" field (UploadFile)
 *    Response: AnalysisResponse (from schemas.py - inferred structure)
 *      - timeline: Array<{timestamp: string, description: string}>
 *      - reproSteps/repro_steps: Array<{description: string, number?: number}>
 *      - expected: string
 *      - actual: string
 *      - targetUrl/target_url?: string
 *    Uncertainties:
 *      - Field naming (camelCase vs snake_case)
 *      - Whether reproSteps includes number or we derive it
 *      - Whether targetUrl is always present
 * 
 * 2. POST /generate-test
 *    Request: JSON body (AnalysisResponse object)
 *    Response: TestResponse (from schemas.py - inferred structure)
 *      - playwrightSpec/playwright_spec: string
 *      - filename: string
 *    Uncertainties:
 *      - Field naming convention
 *      - Whether filename is required or auto-generated
 * 
 * 3. POST /run-test
 *    Request: JSON body (TestResponse object with playwrightSpec and filename)
 *    Response: RunResult (inferred from playwright_runner.py)
 *      - status: "success" | "failed"
 *      - stdout: string
 *      - stderr: string
 *      - screenshotUrl/screenshot_url?: string | null
 *    Uncertainties:
 *      - Screenshot delivery format (URL? base64? file path?)
 *      - Whether screenshot is always present or optional
 *      - Error structure in stderr
 * 
 * 4. POST /generate-patch
 *    Request: JSON body (PatchRequest from schemas.py)
 *      - analysis: AnalysisResponse
 *      - error_log: string (from run.stderr or run.stdout)
 *      - run_result?: RunResult (may be included)
 *    Response: PatchResponse (from schemas.py - inferred structure)
 *      - diff: string (unified diff format)
 *      - rationale: string
 *      - risks: Array<string>
 *    Uncertainties:
 *      - Exact PatchRequest structure
 *      - Whether run_result is included or just error_log
 *      - Risk array format
 * 
 * Error Handling:
 * - FastAPI returns standard HTTP status codes
 * - Error responses likely follow FastAPI validation error format
 * - CORS: Unknown if configured (may need CORS headers)
 * 
 * Health Check:
 * - FastAPI provides /docs (Swagger UI) and /openapi.json
 * - Can use GET /docs or /openapi.json to check backend availability
 * 
 * ============================================================================
 */

import type {
  AnalysisResult,
  GeneratedTest,
  RunResult,
  PatchResult,
} from "./types";
import {
  sampleAnalysisResult,
  sampleGeneratedTest,
  sampleRunResult,
  samplePatchResult,
} from "./sampleData";
import { config } from "./config";

/**
 * Backend Adapter Interface
 * Defines the contract for all backend implementations
 */
export interface BackendAdapter {
  analyzeVideo(file: File): Promise<AnalysisResult>;
  generateTest(
    analysis: AnalysisResult,
    targetUrl?: string
  ): Promise<GeneratedTest>;
  runTest(test: GeneratedTest): Promise<RunResult>;
  generatePatch(input: {
    analysis: AnalysisResult;
    run: RunResult;
  }): Promise<PatchResult>;
}

/**
 * API Error with detailed context
 */
export class BackendError extends Error {
  constructor(
    message: string,
    public status: number | null,
    public endpoint: string,
    public details?: unknown,
    public requestPayload?: unknown
  ) {
    super(message);
    this.name = "BackendError";
  }
}

/**
 * Request/Response tracking for debug panel
 */
export interface ApiCallInfo {
  timestamp: string;
  endpoint: string;
  method: string;
  requestPayload?: unknown;
  requestPayloadSize?: number;
  response?: unknown;
  responseSize?: number;
  error?: BackendError | NormalizationError;
  duration?: number;
}

/**
 * Response normalization errors
 */
export class NormalizationError extends Error {
  constructor(
    message: string,
    public missingFields: string[],
    public receivedData: unknown
  ) {
    super(message);
    this.name = "NormalizationError";
  }
}

/**
 * Endpoint configuration
 * Centralized for easy updates as backend evolves
 */
const endpoints = {
  analyze: "/analyze",
  generateTest: "/generate-test",
  runTest: "/run-test",
  generatePatch: "/generate-patch",
} as const;

/**
 * Sample Adapter
 * Uses fixture data for development/demo
 */
export class SampleAdapter implements BackendAdapter {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async analyzeVideo(_file: File): Promise<AnalysisResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { ...sampleAnalysisResult };
  }

   
  async generateTest(
    _analysis: AnalysisResult,
    _targetUrl?: string
  ): Promise<GeneratedTest> {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return { ...sampleGeneratedTest };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async runTest(_test: GeneratedTest): Promise<RunResult> {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return { ...sampleRunResult };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async generatePatch(_input: {
    analysis: AnalysisResult;
    run: RunResult;
  }): Promise<PatchResult> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { ...samplePatchResult };
  }
}

/**
 * HTTP Adapter
 * Makes real API calls with response normalization
 */
export class HttpAdapter implements BackendAdapter {
  private baseUrl: string;
  private lastApiCall: ApiCallInfo | null = null;
  private apiCallListeners: ((info: ApiCallInfo) => void)[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
  }

  /**
   * Subscribe to API call events (for debug panel)
   */
  onApiCall(callback: (info: ApiCallInfo) => void): () => void {
    this.apiCallListeners.push(callback);
    return () => {
      this.apiCallListeners = this.apiCallListeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Get last API call info (for debug panel)
   */
  getLastApiCall(): ApiCallInfo | null {
    return this.lastApiCall;
  }

  private notifyApiCall(info: ApiCallInfo) {
    this.lastApiCall = info;
    this.apiCallListeners.forEach(cb => cb(info));
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requestPayload?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const timestamp = new Date().toISOString();
    const startTime = Date.now();
    
    // Calculate request payload size (approximate)
    let requestPayloadSize: number | undefined;
    if (requestPayload) {
      try {
        const payloadStr = typeof requestPayload === 'string' 
          ? requestPayload 
          : JSON.stringify(requestPayload);
        requestPayloadSize = new Blob([payloadStr]).size;
      } catch {
        // Ignore size calculation errors
      }
    }

    const apiCallInfo: ApiCallInfo = {
      timestamp,
      endpoint,
      method: options.method || "GET",
      requestPayload: requestPayload instanceof File ? { filename: requestPayload.name, size: requestPayload.size, type: requestPayload.type } : requestPayload,
      requestPayloadSize,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
        },
      });

      const duration = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        const error = new BackendError(
          `API request failed: ${response.statusText}`,
          response.status,
          endpoint,
          { errorText, timestamp },
          requestPayload
        );
        
        apiCallInfo.error = error;
        apiCallInfo.duration = duration;
        this.notifyApiCall(apiCallInfo);
        throw error;
      }

      const data = await response.json();
      const responseSize = new Blob([JSON.stringify(data)]).size;
      
      apiCallInfo.response = data;
      apiCallInfo.responseSize = responseSize;
      apiCallInfo.duration = duration;
      this.notifyApiCall(apiCallInfo);
      
      return data as T;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      if (error instanceof BackendError) {
        apiCallInfo.error = error;
        apiCallInfo.duration = duration;
        this.notifyApiCall(apiCallInfo);
        throw error;
      }
      
      const backendError = new BackendError(
        `Network error: ${error instanceof Error ? error.message : "Unknown"}`,
        null,
        endpoint,
        { originalError: error, timestamp },
        requestPayload
      );
      
      apiCallInfo.error = backendError;
      apiCallInfo.duration = duration;
      this.notifyApiCall(apiCallInfo);
      throw backendError;
    }
  }

  async analyzeVideo(file: File): Promise<AnalysisResult> {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const raw = await this.request<unknown>(
        endpoints.analyze,
        {
          method: "POST",
          body: formData,
        },
        { filename: file.name, size: file.size, type: file.type }
      );

      return this.normalizeAnalysis(raw);
    } catch (error) {
      if (error instanceof NormalizationError) {
        // Re-throw normalization errors with context
        throw error;
      }
      throw error;
    }
  }

  async generateTest(
    analysis: AnalysisResult,
    targetUrl?: string
  ): Promise<GeneratedTest> {
    const payload = {
      ...analysis,
      targetUrl: targetUrl || analysis.targetUrl,
    };

    try {
      const raw = await this.request<unknown>(
        endpoints.generateTest,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
        payload
      );

      return this.normalizeTest(raw);
    } catch (error) {
      if (error instanceof NormalizationError) {
        throw error;
      }
      throw error;
    }
  }

  async runTest(test: GeneratedTest): Promise<RunResult> {
    const payload = {
      playwrightSpec: test.playwrightSpec,
      filename: test.filename,
    };

    try {
      const raw = await this.request<unknown>(
        endpoints.runTest,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
        payload
      );

      return this.normalizeRun(raw);
    } catch (error) {
      if (error instanceof NormalizationError) {
        throw error;
      }
      throw error;
    }
  }

  async generatePatch(input: {
    analysis: AnalysisResult;
    run: RunResult;
  }): Promise<PatchResult> {
    const payload = {
      analysis: input.analysis,
      error_log: input.run.stderr || input.run.stdout,
      run_result: input.run,
    };

    try {
      const raw = await this.request<unknown>(
        endpoints.generatePatch,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
        payload
      );

      return this.normalizePatch(raw);
    } catch (error) {
      if (error instanceof NormalizationError) {
        throw error;
      }
      throw error;
    }
  }

  /**
   * Response Normalization Functions
   * Map backend responses to our frontend types
   * Throws descriptive errors if required fields are missing
   */

  private normalizeAnalysis(raw: unknown): AnalysisResult {
    if (typeof raw !== "object" || raw === null) {
      throw new NormalizationError(
        "Analysis response must be an object",
        ["root"],
        raw
      );
    }

    const obj = raw as Record<string, unknown>;

    // Check for timeline
    if (!Array.isArray(obj.timeline)) {
      throw new NormalizationError(
        "Analysis response missing 'timeline' array",
        ["timeline"],
        raw
      );
    }

    // Check for reproSteps
    if (!Array.isArray(obj.reproSteps) && !Array.isArray(obj.repro_steps)) {
      throw new NormalizationError(
        "Analysis response missing 'reproSteps' or 'repro_steps' array",
        ["reproSteps"],
        raw
      );
    }

    // Normalize field names (handle snake_case from backend)
    const timeline = obj.timeline.map((event: unknown) => {
      if (
        typeof event === "object" &&
        event !== null &&
        "timestamp" in event &&
        "description" in event
      ) {
        return {
          timestamp: String((event as { timestamp: unknown }).timestamp),
          description: String((event as { description: unknown }).description),
        };
      }
      throw new NormalizationError(
        "Timeline event missing required fields",
        ["timestamp", "description"],
        event
      );
    });

    const reproStepsArray = Array.isArray(obj.reproSteps)
      ? obj.reproSteps
      : Array.isArray(obj.repro_steps)
        ? obj.repro_steps
        : [];
    
    const reproSteps = reproStepsArray.map(
      (step: unknown, index: number) => {
        if (
          typeof step === "object" &&
          step !== null &&
          "description" in step
        ) {
          return {
            number: index + 1,
            description: String((step as { description: unknown }).description),
          };
        }
        throw new NormalizationError(
          "Repro step missing required fields",
          ["description"],
          step
        );
      }
    );

    return {
      timeline,
      reproSteps,
      expected: String(obj.expected || ""),
      actual: String(obj.actual || ""),
      targetUrl: obj.targetUrl
        ? String(obj.targetUrl)
        : obj.target_url
          ? String(obj.target_url)
          : undefined,
    };
  }

  private normalizeTest(raw: unknown): GeneratedTest {
    if (typeof raw !== "object" || raw === null) {
      throw new NormalizationError(
        "Test response must be an object",
        ["root"],
        raw
      );
    }

    const obj = raw as Record<string, unknown>;

    const missing: string[] = [];
    if (!obj.playwrightSpec && !obj.playwright_spec) {
      missing.push("playwrightSpec");
    }
    if (!obj.filename) {
      missing.push("filename");
    }

    if (missing.length > 0) {
      throw new NormalizationError(
        `Test response missing required fields: ${missing.join(", ")}`,
        missing,
        raw
      );
    }

    return {
      playwrightSpec: String(
        obj.playwrightSpec || obj.playwright_spec || ""
      ),
      filename: String(obj.filename),
    };
  }

  private normalizeRun(raw: unknown): RunResult {
    if (typeof raw !== "object" || raw === null) {
      throw new NormalizationError(
        "Run response must be an object",
        ["root"],
        raw
      );
    }

    const obj = raw as Record<string, unknown>;

    const missing: string[] = [];
    if (obj.status !== "success" && obj.status !== "failed") {
      missing.push("status (must be 'success' or 'failed')");
    }
    if (typeof obj.stdout !== "string" && obj.stdout !== undefined) {
      missing.push("stdout (must be string or undefined)");
    }
    if (typeof obj.stderr !== "string" && obj.stderr !== undefined) {
      missing.push("stderr (must be string or undefined)");
    }

    if (missing.length > 0) {
      throw new NormalizationError(
        `Run response missing or invalid fields: ${missing.join(", ")}`,
        missing,
        raw
      );
    }

    return {
      status: (obj.status as "success" | "failed") || "failed",
      stdout: String(obj.stdout || ""),
      stderr: String(obj.stderr || ""),
      screenshotUrl:
        obj.screenshotUrl || obj.screenshot_url
          ? String(obj.screenshotUrl || obj.screenshot_url)
          : null,
    };
  }

  private normalizePatch(raw: unknown): PatchResult {
    if (typeof raw !== "object" || raw === null) {
      throw new NormalizationError(
        "Patch response must be an object",
        ["root"],
        raw
      );
    }

    const obj = raw as Record<string, unknown>;

    const missing: string[] = [];
    if (!obj.diff) {
      missing.push("diff");
    }
    if (!obj.rationale) {
      missing.push("rationale");
    }
    if (!Array.isArray(obj.risks)) {
      missing.push("risks (must be array)");
    }

    if (missing.length > 0) {
      throw new NormalizationError(
        `Patch response missing required fields: ${missing.join(", ")}`,
        missing,
        raw
      );
    }

    return {
      diff: String(obj.diff),
      rationale: String(obj.rationale),
      risks: Array.isArray(obj.risks)
        ? obj.risks.map((r) => String(r))
        : [],
    };
  }
}

/**
 * Factory function to create the appropriate adapter
 */
export function createAdapter(mode?: "sample" | "backend"): BackendAdapter {
  const pipelineMode = mode || config.pipelineMode;
  if (pipelineMode === "backend") {
    return new HttpAdapter(config.backendUrl);
  }
  return new SampleAdapter();
}

/**
 * Get adapter instance for health checks and debug info
 * Returns HttpAdapter if in backend mode, null otherwise
 */
export function getHttpAdapter(adapter: BackendAdapter): HttpAdapter | null {
  return adapter instanceof HttpAdapter ? adapter : null;
}

// ApiCallInfo is already exported above in the interface declaration
