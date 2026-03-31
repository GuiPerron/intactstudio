"use client";

import ReactMarkdown from "react-markdown";
import { BrandId, brands } from "@/lib/brand/config";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  brand: BrandId;
}

export function ChatMessage({ role, content, brand }: ChatMessageProps) {
  const isUser = role === "user";
  const brandConfig = brands[brand];

  return (
    <div className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold"
        style={{
          backgroundColor: isUser
            ? "var(--platform-border)"
            : brandConfig.colors.primary,
          color: isUser ? "var(--platform-text)" : "white",
        }}
      >
        {isUser ? "G" : brandConfig.agentName[0]}
      </div>

      {/* Message */}
      <div
        className={`max-w-[75%] rounded-2xl px-5 py-3.5 text-[15px] leading-relaxed ${
          isUser ? "rounded-tr-sm" : "rounded-tl-sm"
        }`}
        style={{
          backgroundColor: isUser
            ? "var(--platform-sand)"
            : brandConfig.colors.background,
          color: isUser ? "var(--platform-text)" : brandConfig.colors.text,
        }}
      >
        {isUser ? (
          <p>{content}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-lg prose-h2:text-base prose-h3:text-sm prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-blockquote:border-l-2 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[var(--platform-muted)] prose-strong:font-semibold prose-code:rounded prose-code:bg-black/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[13px] prose-code:before:content-none prose-code:after:content-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
