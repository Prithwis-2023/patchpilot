/* eslint-disable */
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PrismAsync as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore - vscDarkPlus is a valid style
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export default function MarkdownPreview({ content, className = "" }: MarkdownPreviewProps) {
  return (
    <div className={`markdown-preview ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ node, ...props }) => (
            <h1 className="text-3xl font-bold mb-4 mt-6 text-[var(--neon-cyan)] border-b-2 border-[var(--neon-cyan)]/30 pb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-2xl font-bold mb-3 mt-5 text-[var(--neon-magenta)] border-b border-[var(--neon-magenta)]/30 pb-1" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-xl font-bold mb-2 mt-4 text-[var(--neon-lime)]" {...props} />
          ),
          h4: ({ node, ...props }) => (
            <h4 className="text-lg font-semibold mb-2 mt-3 text-foreground" {...props} />
          ),
          h5: ({ node, ...props }) => (
            <h5 className="text-base font-semibold mb-1 mt-2 text-foreground" {...props} />
          ),
          h6: ({ node, ...props }) => (
            <h6 className="text-sm font-semibold mb-1 mt-2 text-muted-foreground" {...props} />
          ),
          // Paragraphs
          p: ({ node, ...props }) => (
            <p className="mb-4 text-foreground leading-relaxed" {...props} />
          ),
          // Lists
          ul: ({ node, ...props }) => (
            <ul className="mb-4 ml-6 list-disc space-y-2 text-foreground" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="mb-4 ml-6 list-decimal space-y-2 text-foreground" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-foreground" {...props} />
          ),
          // Code blocks
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            
            if (!inline && match) {
              return (
                <div className="my-4 rounded-lg overflow-hidden border border-[var(--neon-cyan)]/30">
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    PreTag="div"
                    className="!m-0 !p-4 text-sm"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                </div>
              );
            }
            
            return (
              <code
                className="px-1.5 py-0.5 rounded bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] font-mono text-sm border border-[var(--neon-cyan)]/30"
                {...props}
              >
                {children}
              </code>
            );
          },
          // Blockquotes
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="my-4 pl-4 border-l-4 border-[var(--neon-magenta)]/50 bg-[var(--neon-magenta)]/5 italic text-muted-foreground"
              {...props}
            />
          ),
          // Links
          a: ({ node, ...props }: any) => (
            <a
              className="text-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]/80 underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...props}
            />
          ),
          // Horizontal rule
          hr: ({ node, ...props }) => (
            <hr className="my-6 border-t border-border/50" {...props} />
          ),
          // Tables
          table: ({ node, ...props }) => (
            <div className="my-4 overflow-x-auto">
              <table className="min-w-full border-collapse border border-border/50" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead className="bg-[var(--neon-cyan)]/10" {...props} />
          ),
          tbody: ({ node, ...props }) => (
            <tbody {...props} />
          ),
          tr: ({ node, ...props }) => (
            <tr className="border-b border-border/30" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="px-4 py-2 text-left font-bold text-[var(--neon-cyan)] border border-border/30" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="px-4 py-2 text-foreground border border-border/30" {...props} />
          ),
          // Strong/Bold
          strong: ({ node, ...props }) => (
            <strong className="font-bold text-foreground" {...props} />
          ),
          // Emphasis/Italic
          em: ({ node, ...props }) => (
            <em className="italic text-foreground" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
