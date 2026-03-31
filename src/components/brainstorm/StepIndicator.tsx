"use client";

import { STEPS, StepId } from "@/lib/brainstorm/types";

interface StepIndicatorProps {
  currentStep: StepId;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="bg-white border-b border-[var(--platform-border)]">
      <div className="mx-auto max-w-[1280px] px-6 py-3">
        <div className="flex items-center gap-1">
          {STEPS.map((step, i) => {
            const isActive = step.id === currentStep;
            const isDone = i < currentIndex;

            return (
              <div key={step.id} className="flex items-center gap-1 flex-1">
                {/* Step dot + label */}
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-all duration-300"
                    style={{
                      backgroundColor: isDone
                        ? "var(--platform-accent)"
                        : isActive
                          ? "var(--platform-accent)"
                          : "var(--platform-border)",
                      color: isDone || isActive ? "white" : "var(--platform-muted)",
                    }}
                  >
                    {isDone ? (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.5 6L5 8.5L9.5 4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className="text-xs font-medium truncate hidden sm:block transition-colors duration-300"
                    style={{
                      color: isActive
                        ? "var(--platform-text)"
                        : "var(--platform-muted)",
                    }}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-px mx-2" style={{
                    backgroundColor: isDone ? "var(--platform-accent)" : "var(--platform-border)",
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
