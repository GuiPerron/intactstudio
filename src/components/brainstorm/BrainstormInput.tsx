"use client";

import { useState, useRef, useEffect } from "react";

interface BrainstormInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  quickReplies?: string[];
}

export function BrainstormInput({
  onSend,
  disabled,
  quickReplies,
}: BrainstormInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [value]);

  // Focus input when not disabled
  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickReply = (text: string) => {
    if (disabled) return;
    onSend(text);
  };

  return (
    <div className="border-t border-[var(--platform-border)] bg-white">
      {/* Quick reply chips */}
      {quickReplies && quickReplies.length > 0 && !disabled && (
        <div className="px-6 pt-3 pb-0">
          <div className="mx-auto max-w-[800px] flex flex-wrap gap-2">
            {quickReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => handleQuickReply(reply)}
                className="rounded-full border border-[var(--platform-border)] bg-[var(--platform-sand)] px-3.5 py-1.5 text-xs text-[var(--platform-muted)] transition-all duration-200 hover:border-[var(--platform-accent)] hover:text-[var(--platform-accent)]"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Text input */}
      <div className="p-4">
        <div className="mx-auto max-w-[800px]">
          <div className="flex items-end gap-3 rounded-2xl border border-[var(--platform-border)] bg-white px-4 py-3 transition-all duration-200 focus-within:border-[var(--platform-muted)] focus-within:shadow-sm">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tapez votre réponse..."
              disabled={disabled}
              rows={1}
              className="flex-1 resize-none bg-transparent text-[15px] leading-relaxed placeholder:text-[var(--platform-muted)] focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={handleSubmit}
              disabled={disabled || !value.trim()}
              className="shrink-0 rounded-full p-2.5 text-white transition-all duration-200 disabled:opacity-30"
              style={{
                backgroundColor:
                  value.trim() && !disabled
                    ? "var(--platform-accent)"
                    : "var(--platform-border)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8L8 3M8 3L13 8M8 3V13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
