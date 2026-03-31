"use client";

import ReactMarkdown from "react-markdown";

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
        <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: "var(--platform-accent)" }}>
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

          <div className="rounded-2xl rounded-tl-sm bg-white border border-[var(--platform-border)] px-6 py-4 shadow-sm">
            <div className={`prose prose-sm max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-lg prose-h1:mt-4 prose-h1:mb-2 prose-h2:text-base prose-h2:mt-3 prose-h2:mb-1.5 prose-h3:text-sm prose-h3:mt-2 prose-h3:mb-1 prose-p:my-2 prose-p:leading-relaxed prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-blockquote:border-l-2 prose-blockquote:border-[var(--platform-accent)] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[var(--platform-muted)] prose-strong:font-semibold prose-code:rounded prose-code:bg-[var(--platform-sand)] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[13px] prose-code:before:content-none prose-code:after:content-none prose-hr:my-4 prose-hr:border-[var(--platform-border)] ${isStreaming ? "typing-cursor" : ""}`}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
