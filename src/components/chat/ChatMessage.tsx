"use client";

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
        {content.split("\n").map((line, i) => (
          <p key={i} className={i > 0 ? "mt-2" : ""}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
