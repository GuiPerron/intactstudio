"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface BrainstormMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function BrainstormMessage({
  role,
  content,
  isStreaming,
}: BrainstormMessageProps) {
  const isUser = role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in-up">
        <div className="max-w-[600px] rounded-2xl rounded-tr-sm bg-white border border-[var(--platform-border)] px-5 py-3.5 text-[15px] leading-relaxed shadow-sm">
          <p>{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-start gap-4">
        {/* Agent avatar */}
        <div
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold"
          style={{ backgroundColor: "var(--platform-accent)" }}
        >
          SA
        </div>

        {/* Message content */}
        <div className="flex-1 min-w-0">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-sm font-semibold">Studio AI</span>
            <span className="text-xs text-[var(--platform-muted)]">
              Partenaire créatif
            </span>
          </div>

          <div
            className={`rounded-2xl rounded-tl-sm bg-white border border-[var(--platform-border)] px-7 py-5 shadow-sm ${isStreaming ? "typing-cursor" : ""}`}
          >
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
