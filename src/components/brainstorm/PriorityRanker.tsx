"use client";

import { useState } from "react";

interface PriorityRankerProps {
  items: { id: string; label: string; icon: string }[];
  onSubmit: (ordered: string[]) => void;
  disabled?: boolean;
}

export function PriorityRanker({
  items,
  onSubmit,
  disabled,
}: PriorityRankerProps) {
  const [ranked, setRanked] = useState<typeof items>([]);
  const [submitted, setSubmitted] = useState(false);

  const unranked = items.filter((item) => !ranked.find((r) => r.id === item.id));

  const addToRank = (item: (typeof items)[0]) => {
    if (submitted || disabled) return;
    setRanked((prev) => [...prev, item]);
  };

  const removeFromRank = (id: string) => {
    if (submitted || disabled) return;
    setRanked((prev) => prev.filter((item) => item.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0 || submitted) return;
    setRanked((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index === ranked.length - 1 || submitted) return;
    setRanked((prev) => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit(ranked.map((r) => r.id));
  };

  return (
    <div className="animate-fade-in-up">
      {/* Ranked items */}
      {ranked.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-2">
            Vos priorités (en ordre)
          </p>
          <div className="space-y-2">
            {ranked.map((item, i) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl bg-white border-2 p-3 transition-all duration-200"
                style={{ borderColor: "var(--platform-accent)" }}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: "var(--platform-accent)" }}
                >
                  {i + 1}
                </span>
                <span className="text-base mr-1">{item.icon}</span>
                <span className="text-sm font-medium flex-1">{item.label}</span>

                {!submitted && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveUp(i)}
                      disabled={i === 0}
                      className="p-1 rounded text-[var(--platform-muted)] hover:text-[var(--platform-text)] disabled:opacity-20"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 8.5L7 4.5L11 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => moveDown(i)}
                      disabled={i === ranked.length - 1}
                      className="p-1 rounded text-[var(--platform-muted)] hover:text-[var(--platform-text)] disabled:opacity-20"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 5.5L7 9.5L11 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => removeFromRank(item.id)}
                      className="p-1 rounded text-[var(--platform-muted)] hover:text-[var(--platform-accent)]"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unranked pool */}
      {unranked.length > 0 && !submitted && (
        <div>
          <p className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-2">
            Cliquez pour ajouter par ordre de priorité
          </p>
          <div className="flex flex-wrap gap-2">
            {unranked.map((item) => (
              <button
                key={item.id}
                onClick={() => addToRank(item)}
                className="flex items-center gap-2 rounded-full border border-[var(--platform-border)] bg-white px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-[var(--platform-accent)] hover:shadow-sm"
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Submit */}
      {ranked.length === items.length && !submitted && (
        <div className="mt-4 flex justify-end animate-fade-in-up">
          <button
            onClick={handleSubmit}
            className="rounded-full px-6 py-2 text-sm font-medium text-white transition-all duration-200"
            style={{ backgroundColor: "var(--platform-accent)" }}
          >
            Confirmer les priorités
          </button>
        </div>
      )}

      {submitted && (
        <div className="mt-3 flex items-center gap-2 text-xs text-[var(--platform-muted)]">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="var(--platform-accent)" strokeWidth="1.5"/>
            <path d="M4.5 7L6 8.5L9.5 5" stroke="var(--platform-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Priorités enregistrées
        </div>
      )}
    </div>
  );
}
