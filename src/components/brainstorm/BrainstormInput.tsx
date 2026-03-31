"use client";

import { useState, useRef, useEffect } from "react";

interface BrainstormInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function BrainstormInput({ onSend, disabled }: BrainstormInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [value]);

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

  return (
    <div className="border-t border-[var(--platform-border)] bg-white p-4">
      <div className="mx-auto max-w-[800px]">
        <div className="flex items-end gap-3 rounded-2xl border border-[var(--platform-border)] bg-white px-4 py-3 transition-all duration-200 focus-within:border-[var(--platform-muted)] focus-within:shadow-sm">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Commentaire libre, question, ou idée..."
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
  );
}
