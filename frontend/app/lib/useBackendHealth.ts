"use client";

import { useState, useEffect, useCallback } from "react";
import { config } from "./config";

export type BackendHealthStatus = "checking" | "connected" | "offline" | "unknown";

export interface BackendHealthInfo {
  status: BackendHealthStatus;
  lastChecked: string | null;
  error?: string;
}

/**
 * Hook to check backend health status
 * Uses GET /docs or /openapi.json to verify backend availability
 */
export function useBackendHealth(pipelineMode: "sample" | "backend") {
  const [health, setHealth] = useState<BackendHealthInfo>({
    status: "unknown",
    lastChecked: null,
  });

  const checkHealth = useCallback(async () => {
    if (pipelineMode !== "backend") {
      setHealth({
        status: "unknown",
        lastChecked: new Date().toISOString(),
      });
      return;
    }

    setHealth((prev) => ({
      ...prev,
      status: "checking",
    }));

    try {
      // Use /health endpoint (simpler and doesn't require CORS for docs)
      const endpoints = [
        `${config.backendUrl}/health`,
      ];

      let connected = false;
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: "GET",
            signal: AbortSignal.timeout(3000), // 3 second timeout
          });
          if (response.ok) {
            connected = true;
            break;
          }
        } catch {
          // Try next endpoint
          continue;
        }
      }

      setHealth({
        status: connected ? "connected" : "offline",
        lastChecked: new Date().toISOString(),
        error: connected ? undefined : "Backend not reachable",
      });
    } catch (error) {
      setHealth({
        status: "offline",
        lastChecked: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }, [pipelineMode]);

  // Check on mount and when mode changes
  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      checkHealth();
    }, 0);
    return () => clearTimeout(timer);
  }, [checkHealth]);

  // Debounced re-check (don't spam)
  useEffect(() => {
    if (pipelineMode !== "backend") return;

    const interval = setInterval(() => {
      checkHealth();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [pipelineMode, checkHealth]);

  return {
    health,
    checkHealth,
  };
}
