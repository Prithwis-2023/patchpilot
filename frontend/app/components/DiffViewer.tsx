"use client";

import { motion } from "framer-motion";
import { fadeSlide } from "../lib/motion";

interface DiffViewerProps {
  diff: string;
  className?: string;
}

interface DiffLine {
  type: "add" | "remove" | "context" | "hunk";
  content: string;
  lineNumber?: number;
}

export default function DiffViewer({ diff, className = "" }: DiffViewerProps) {
  const parseDiff = (diffText: string): DiffLine[] => {
    const lines = diffText.split("\n");
    const parsed: DiffLine[] = [];
    let lineNum = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.startsWith("@@")) {
        // Hunk header
        parsed.push({ type: "hunk", content: line });
      } else if (line.startsWith("+") && !line.startsWith("+++")) {
        // Added line
        parsed.push({ type: "add", content: line.substring(1), lineNumber: ++lineNum });
      } else if (line.startsWith("-") && !line.startsWith("---")) {
        // Removed line
        parsed.push({ type: "remove", content: line.substring(1), lineNumber: lineNum });
      } else if (line.startsWith("\\")) {
        // No newline at end of file
        parsed.push({ type: "context", content: line });
      } else {
        // Context line
        parsed.push({ type: "context", content: line.startsWith(" ") ? line.substring(1) : line, lineNumber: ++lineNum });
      }
    }

    return parsed;
  };

  const diffLines = parseDiff(diff);

  const getLineStyle = (type: DiffLine["type"]) => {
    switch (type) {
      case "add":
        return {
          backgroundColor: "rgba(34, 197, 94, 0.15)", // Green background
          borderLeft: "3px solid rgba(34, 197, 94, 0.6)",
        };
      case "remove":
        return {
          backgroundColor: "rgba(239, 68, 68, 0.15)", // Red background
          borderLeft: "3px solid rgba(239, 68, 68, 0.6)",
        };
      case "hunk":
        return {
          backgroundColor: "rgba(0, 255, 255, 0.1)", // Cyan background for hunk
          color: "#00ffff", // Neon cyan
          fontWeight: "600",
          fontFamily: "monospace",
        };
      default:
        return {
          backgroundColor: "transparent",
        };
    }
  };

  const getGutterMarker = (type: DiffLine["type"]) => {
    switch (type) {
      case "add":
        return <span className="text-green-500 font-bold">+</span>;
      case "remove":
        return <span className="text-red-500 font-bold">-</span>;
      case "hunk":
        return <span className="text-[#00ffff] font-bold">@@</span>;
      default:
        return <span className="text-gray-500"> </span>;
    }
  };

  return (
    <div
      className={`rounded-md overflow-hidden border border-gray-700 ${className}`}
      style={{
        backgroundColor: "#1e1e1e", // Dark theme background
        maxHeight: "600px",
        overflowY: "auto",
      }}
    >
      <div className="font-mono text-sm">
        {diffLines.map((line, index) => (
          <motion.div
            key={index}
            initial="hidden"
            animate="visible"
            variants={fadeSlide}
            transition={{ delay: index * 0.01 }}
            className="flex items-start gap-2 px-3 py-1 hover:bg-gray-800/50 transition-colors"
            style={getLineStyle(line.type)}
          >
            {/* Gutter */}
            <div className="flex-shrink-0 w-8 text-right text-gray-500 select-none">
              {getGutterMarker(line.type)}
            </div>
            {/* Line number */}
            {line.lineNumber !== undefined && (
              <div className="flex-shrink-0 w-12 text-right text-gray-500 select-none">
                {line.lineNumber}
              </div>
            )}
            {/* Content */}
            <div className="flex-1 text-gray-200 break-words">
              {line.type === "hunk" ? (
                <span className="font-semibold">{line.content}</span>
              ) : (
                <span className="select-all">{line.content || " "}</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
