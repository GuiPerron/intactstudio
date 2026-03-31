"use client";

import { useState } from "react";
import { AgentPanel } from "./AgentPanel";

interface AgentToggleProps {
  mode?: "default" | "template";
  currentTemplateJson?: string;
}

export function AgentToggle({ mode = "default", currentTemplateJson }: AgentToggleProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full px-5 py-3 text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
          style={{ backgroundColor: "var(--platform-accent)" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 4.5C3 3.67 3.67 3 4.5 3H13.5C14.33 3 15 3.67 15 4.5V11.5C15 12.33 14.33 13 13.5 13H6L3 16V4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="6.5" cy="8" r="0.75" fill="currentColor"/>
            <circle cx="9" cy="8" r="0.75" fill="currentColor"/>
            <circle cx="11.5" cy="8" r="0.75" fill="currentColor"/>
          </svg>
          <span className="text-sm font-medium">
            {mode === "template" ? "AI → Canvas" : "AI Agent"}
          </span>
        </button>
      )}

      {open && (
        <AgentPanel
          onClose={() => setOpen(false)}
          mode={mode}
          currentTemplateJson={currentTemplateJson}
        />
      )}
    </>
  );
}
