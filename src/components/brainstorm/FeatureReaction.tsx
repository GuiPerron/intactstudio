"use client";

import { useState } from "react";
import { FeatureOption } from "@/lib/brainstorm/types";

interface FeatureReactionProps {
  features: FeatureOption[];
  onComplete: (reactions: Record<string, "love" | "like" | "neutral" | "skip">) => void;
  disabled?: boolean;
}

const REACTIONS = [
  { id: "love" as const, emoji: "🔥", label: "J'adore" },
  { id: "like" as const, emoji: "👍", label: "Intéressant" },
  { id: "neutral" as const, emoji: "🤔", label: "À voir" },
  { id: "skip" as const, emoji: "⏭️", label: "Pas prioritaire" },
];

export function FeatureReaction({
  features,
  onComplete,
  disabled,
}: FeatureReactionProps) {
  const [reactions, setReactions] = useState<
    Record<string, "love" | "like" | "neutral" | "skip">
  >({});
  const [submitted, setSubmitted] = useState(false);

  const setReaction = (
    featureId: string,
    reaction: "love" | "like" | "neutral" | "skip"
  ) => {
    if (submitted || disabled) return;
    setReactions((prev) => ({ ...prev, [featureId]: reaction }));
  };

  const allReacted = features.every((f) => reactions[f.id]);

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete(reactions);
  };

  return (
    <div className="animate-fade-in-up space-y-3">
      {features.map((feature) => (
        <div
          key={feature.id}
          className="rounded-xl bg-white border border-[var(--platform-border)] p-5 shadow-sm transition-all duration-200"
          style={{
            borderColor: reactions[feature.id]
              ? "var(--platform-accent)"
              : "var(--platform-border)",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{feature.icon}</span>
                <h4 className="font-semibold text-sm">{feature.title}</h4>
              </div>
              <p className="mt-1.5 text-sm text-[var(--platform-muted)] leading-relaxed">
                {feature.description}
              </p>
            </div>

            {reactions[feature.id] && submitted && (
              <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: reactions[feature.id] === "love" ? "#FEF2F4" :
                    reactions[feature.id] === "like" ? "#F0F9FF" :
                    reactions[feature.id] === "neutral" ? "#FFF8E1" : "#F5F5F5",
                  color: reactions[feature.id] === "love" ? "var(--platform-accent)" :
                    reactions[feature.id] === "like" ? "#0F68D8" :
                    reactions[feature.id] === "neutral" ? "#B8860B" : "var(--platform-muted)",
                }}>
                {REACTIONS.find((r) => r.id === reactions[feature.id])?.label}
              </span>
            )}
          </div>

          {!submitted && (
            <div className="mt-3 flex gap-2">
              {REACTIONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setReaction(feature.id, r.id)}
                  disabled={disabled}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-200"
                  style={{
                    borderColor:
                      reactions[feature.id] === r.id
                        ? "var(--platform-accent)"
                        : "var(--platform-border)",
                    backgroundColor:
                      reactions[feature.id] === r.id ? "#FEF2F4" : "white",
                    color:
                      reactions[feature.id] === r.id
                        ? "var(--platform-accent)"
                        : "var(--platform-muted)",
                  }}
                >
                  <span>{r.emoji}</span>
                  {r.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {!submitted && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSubmit}
            disabled={!allReacted}
            className="rounded-full px-6 py-2 text-sm font-medium text-white transition-all duration-200 disabled:opacity-30"
            style={{ backgroundColor: "var(--platform-accent)" }}
          >
            Continuer
          </button>
        </div>
      )}
    </div>
  );
}
