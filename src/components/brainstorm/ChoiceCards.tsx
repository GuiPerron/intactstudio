"use client";

import { useState } from "react";
import { ChoiceOption } from "@/lib/brainstorm/types";

interface ChoiceCardsProps {
  question: string;
  options: ChoiceOption[];
  multiSelect: boolean;
  onSubmit: (selectedIds: string[]) => void;
  disabled?: boolean;
}

export function ChoiceCards({
  question,
  options,
  multiSelect,
  onSubmit,
  disabled,
}: ChoiceCardsProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  const toggle = (id: string) => {
    if (submitted || disabled) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (multiSelect) {
        if (next.has(id)) next.delete(id);
        else next.add(id);
      } else {
        next.clear();
        next.add(id);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    if (selected.size === 0) return;
    setSubmitted(true);
    onSubmit(Array.from(selected));
  };

  return (
    <div className="animate-fade-in-up">
      <p className="text-sm font-medium text-[var(--platform-muted)] mb-3">
        {question}
        {multiSelect && (
          <span className="ml-2 text-xs opacity-60">(plusieurs choix possibles)</span>
        )}
      </p>

      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const isSelected = selected.has(option.id);
          return (
            <button
              key={option.id}
              onClick={() => toggle(option.id)}
              disabled={submitted || disabled}
              className="group text-left rounded-xl border-2 p-4 transition-all duration-200 disabled:opacity-60"
              style={{
                borderColor: isSelected
                  ? "var(--platform-accent)"
                  : "var(--platform-border)",
                backgroundColor: isSelected ? "#FEF2F4" : "white",
              }}
            >
              <div className="flex items-start gap-3">
                {/* Check indicator */}
                <div
                  className="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200"
                  style={{
                    borderColor: isSelected
                      ? "var(--platform-accent)"
                      : "var(--platform-border)",
                    backgroundColor: isSelected
                      ? "var(--platform-accent)"
                      : "transparent",
                  }}
                >
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M2 5L4 7L8 3"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight">
                    {option.label}
                  </p>
                  {option.description && (
                    <p className="mt-1 text-xs text-[var(--platform-muted)] leading-relaxed">
                      {option.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {!submitted && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={selected.size === 0}
            className="rounded-full px-6 py-2 text-sm font-medium text-white transition-all duration-200 disabled:opacity-30"
            style={{ backgroundColor: "var(--platform-accent)" }}
          >
            Confirmer{selected.size > 0 && ` (${selected.size})`}
          </button>
        </div>
      )}

      {submitted && (
        <div className="mt-3 flex items-center gap-2 text-xs text-[var(--platform-muted)]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="var(--platform-accent)" strokeWidth="1.5"/>
            <path d="M4.5 7L6 8.5L9.5 5" stroke="var(--platform-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Réponse enregistrée
        </div>
      )}
    </div>
  );
}
