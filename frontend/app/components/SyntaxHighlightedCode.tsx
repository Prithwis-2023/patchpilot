"use client";

import { useEffect, useRef } from "react";
import Prism from "prismjs";

// Import Prism languages
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("prismjs/components/prism-typescript");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("prismjs/components/prism-javascript");
}

interface SyntaxHighlightedCodeProps {
  code: string;
  language?: string;
  className?: string;
}

export default function SyntaxHighlightedCode({
  code,
  language = "typescript",
  className = "",
}: SyntaxHighlightedCodeProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code]);

  return (
    <pre
      className={`overflow-x-auto rounded-md p-4 ${className}`}
      style={{
        backgroundColor: "#1e1e1e", // Dark theme background for Prism
        maxHeight: "600px",
        overflowY: "auto",
      }}
    >
      <code ref={codeRef} className={`language-${language} font-mono text-sm`}>
        {code}
      </code>
    </pre>
  );
}
