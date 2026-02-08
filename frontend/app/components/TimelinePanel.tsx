"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { TimelineEvent } from "../lib/types";
import { config } from "../lib/config";
import { fadeSlide, pop } from "../lib/motion";

interface TimelinePanelProps {
  events?: TimelineEvent[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function TimelinePanel({
  events,
  isLoading = false,
  error,
  onRetry,
}: TimelinePanelProps) {
  const [focusedEvent, setFocusedEvent] = useState<number | null>(null);

  return (
    <div className="card w-full rounded-lg p-6">
      <h2 className="mb-6 text-xl font-semibold text-primary">Timeline</h2>
      {error ? (
        <div className="space-y-3">
          <div className="card rounded-md p-4" style={{ borderColor: "var(--danger)" }}>
            <p className="text-sm font-medium" style={{ color: "var(--danger)" }}>Error extracting timeline</p>
            <p className="mt-1 text-sm" style={{ color: "var(--danger)" }}>{error}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn-secondary rounded-md px-3 py-1.5 text-sm font-medium"
              style={{ backgroundColor: "var(--danger)", color: "var(--surface-1)" }}
            >
              Retry
            </button>
          )}
          {config.isDevelopment && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs" style={{ color: "var(--danger)" }}>Show technical details</summary>
              <pre className="mt-2 overflow-x-auto rounded p-2 text-xs" style={{ backgroundColor: "var(--danger)", opacity: 0.1, color: "var(--danger)" }}>
                {error}
              </pre>
            </details>
          )}
        </div>
      ) : isLoading ? (
        <div className="flex items-center gap-2 text-muted">
          <div className="h-4 w-4 animate-spin rounded-full border-2" style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}></div>
          <span>Extracting keyframes...</span>
        </div>
      ) : events && events.length > 0 ? (
        <div className="relative">
          {/* Event Rail */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 h-full w-0.5" style={{ background: "linear-gradient(to bottom, var(--accent), var(--accent-2), var(--accent))" }}></div>

            {/* Events */}
            <div className="space-y-6">
              {events.map((event, index) => {
                const isFocused = focusedEvent === index;
                const nodeSize = index % 2 === 0 ? "h-4 w-4" : "h-3 w-3"; // Alternate sizes

                return (
                  <motion.div
                    key={index}
                    initial="hidden"
                    animate="visible"
                    variants={fadeSlide}
                    transition={{ delay: index * 0.1 }}
                    className="relative flex gap-4"
                  >
                    {/* Node */}
                    <div className="relative z-10 flex items-center">
                      <motion.button
                        onClick={() => setFocusedEvent(isFocused ? null : index)}
                        className={`relative ${nodeSize} rounded-full transition-all hover:scale-125`}
                        style={{
                          backgroundColor: "var(--accent)",
                          border: `2px solid var(--accent-2)`,
                          boxShadow: isFocused ? "0 0 0 4px var(--accent)" : undefined,
                        }}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {isFocused && (
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{ backgroundColor: "var(--accent-2)" }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                        )}
                      </motion.button>
                    </div>

                    {/* Event Content */}
                    <div className="flex-1 pb-6">
                      <motion.div
                        className={`card rounded-lg p-3 transition-all ${
                          isFocused ? "shadow-lg" : ""
                        }`}
                        style={{
                          borderColor: isFocused ? "var(--accent)" : "var(--border)",
                          backgroundColor: isFocused ? "var(--accent)" : undefined,
                          color: isFocused ? "var(--surface-1)" : undefined,
                        }}
                        whileHover={{ x: 4 }}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-mono text-xs font-semibold" style={{ color: isFocused ? "var(--surface-1)" : "var(--accent)" }}>
                            {event.timestamp}
                          </p>
                          {isFocused && (
                            <motion.div
                              initial="hidden"
                              animate="visible"
                              variants={pop}
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: "var(--surface-1)" }}
                            />
                          )}
                        </div>
                        <p className="mt-1.5 text-sm" style={{ color: isFocused ? "var(--surface-1)" : "var(--muted)" }}>{event.description}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Keyframes Placeholder */}
          <div className="card mt-8 rounded-lg p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
              Keyframes Extracted
            </h3>
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="aspect-video rounded shimmer"
                  style={{
                    background: `linear-gradient(to bottom right, var(--border), var(--muted-2))`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="card rounded-md p-4 text-center">
          <p className="text-sm text-muted">
            Key moments extracted from your recording will appear here, showing the sequence of events
            that led to the bug.
          </p>
        </div>
      )}
    </div>
  );
}
