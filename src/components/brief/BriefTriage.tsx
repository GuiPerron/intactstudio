"use client";

import { useState } from "react";

interface TriageData {
  objective: string;
  urgency: string;
  volume: string;
}

interface BriefTriageProps {
  onComplete: (data: TriageData) => void;
}

const OBJECTIVES = [
  { id: "notoriete", icon: "📢", label: "Notoriété", desc: "Faire connaître la marque ou un produit" },
  { id: "conversion", icon: "🎯", label: "Conversion", desc: "Générer des leads ou des ventes" },
  { id: "engagement", icon: "💬", label: "Engagement", desc: "Interactions sociales, communauté" },
  { id: "lancement", icon: "🚀", label: "Lancement", desc: "Nouveau produit ou service" },
  { id: "interne", icon: "🏢", label: "Interne", desc: "Communication interne IFC" },
];

const URGENCY = [
  { id: "asap", icon: "⚡", label: "ASAP", desc: "5 jours ouvrables" },
  { id: "2weeks", icon: "📅", label: "2 semaines", desc: "Délai standard" },
  { id: "flexible", icon: "🕐", label: "Flexible", desc: "Pas de deadline fixe" },
];

const VOLUME = [
  { id: "petit", icon: "📄", label: "Petit", desc: "1-3 assets, un canal" },
  { id: "moyen", icon: "📦", label: "Moyen", desc: "5-15 assets, multi-canal" },
  { id: "grand", icon: "🎪", label: "Grand", desc: "Campagne complète, déclinaisons" },
];

export function BriefTriage({ onComplete }: BriefTriageProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Partial<TriageData>>({});

  const questions = [
    { key: "objective" as const, title: "C'est quoi l'objectif?", options: OBJECTIVES },
    { key: "urgency" as const, title: "C'est urgent?", options: URGENCY },
    { key: "volume" as const, title: "Quel volume?", options: VOLUME },
  ];

  const q = questions[currentQ];

  const handleSelect = (id: string) => {
    const newAnswers = { ...answers, [q.key]: id };
    setAnswers(newAnswers);

    if (currentQ < 2) {
      setTimeout(() => setCurrentQ(currentQ + 1), 200);
    } else {
      setTimeout(() => onComplete(newAnswers as TriageData), 300);
    }
  };

  return (
    <div>
      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 flex-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: i <= currentQ ? "var(--platform-accent)" : "var(--platform-border)",
            }}
          />
        ))}
      </div>

      <div className="text-center mb-8">
        <p className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-2">
          Question {currentQ + 1} sur 3
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{q.title}</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-[720px] mx-auto">
        {q.options.map((opt) => {
          const selected = answers[q.key] === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className="rounded-xl border-2 p-6 text-center transition-all duration-200 hover:shadow-md"
              style={{
                borderColor: selected ? "var(--platform-accent)" : "var(--platform-border)",
                backgroundColor: selected ? "#FEF2F4" : "white",
              }}
            >
              <span className="text-3xl">{opt.icon}</span>
              <h3 className="mt-3 text-sm font-semibold">{opt.label}</h3>
              <p className="mt-1 text-xs text-[var(--platform-muted)] leading-relaxed">{opt.desc}</p>
            </button>
          );
        })}
      </div>

      {currentQ > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentQ(currentQ - 1)}
            className="text-sm text-[var(--platform-muted)] hover:text-[var(--platform-text)] transition-colors"
          >
            ← Retour
          </button>
        </div>
      )}
    </div>
  );
}
