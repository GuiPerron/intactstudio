"use client";

import { useState } from "react";

interface DemoBrandVoiceProps {
  onComplete: () => void;
}

const DEMOS = {
  intact: {
    name: "Intact Insurance",
    color: "#DF0030",
    bg: "#F7F2EA",
    headline: "[ Votre refuge. Notre promesse. ]",
    body: "On protège ce qui compte vraiment pour vous.",
    cta: "En savoir plus",
    ctaStyle: "bg-[#DF0030] text-white",
    font: "serif",
    tagline: "Pour tout ce qui compte",
  },
  belairdirect: {
    name: "belairdirect",
    color: "#C8102E",
    bg: "#F5F8FA",
    headline: "Simple. Direct. Couvert.",
    body: "Ta soumission en 5 minutes. Zéro détour.",
    cta: "Obtenir ma soumission",
    ctaStyle: "bg-[#0F68D8] text-white",
    font: "sans",
    tagline: "assurance. simplifiée.",
  },
};

export function DemoBrandVoice({ onComplete }: DemoBrandVoiceProps) {
  const [activeBrand, setActiveBrand] = useState<"intact" | "belairdirect">(
    "intact"
  );
  const [hasToggled, setHasToggled] = useState(false);

  const demo = DEMOS[activeBrand];

  const handleSwitch = (brand: "intact" | "belairdirect") => {
    setActiveBrand(brand);
    if (!hasToggled) setHasToggled(true);
  };

  return (
    <div className="animate-fade-in-up">
      <div className="rounded-xl bg-white border border-[var(--platform-border)] overflow-hidden shadow-sm">
        {/* Switcher header */}
        <div className="flex items-center justify-between border-b border-[var(--platform-border)] px-5 py-3">
          <span className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider">
            Démo — Brand Voice Switch
          </span>
          <div className="flex rounded-full border border-[var(--platform-border)] p-0.5">
            <button
              onClick={() => handleSwitch("intact")}
              className="rounded-full px-4 py-1 text-xs font-medium transition-all duration-300"
              style={{
                backgroundColor:
                  activeBrand === "intact" ? demo.color : "transparent",
                color: activeBrand === "intact" ? "white" : "var(--platform-muted)",
              }}
            >
              Intact
            </button>
            <button
              onClick={() => handleSwitch("belairdirect")}
              className="rounded-full px-4 py-1 text-xs font-medium transition-all duration-300"
              style={{
                backgroundColor:
                  activeBrand === "belairdirect" ? "#0F68D8" : "transparent",
                color:
                  activeBrand === "belairdirect"
                    ? "white"
                    : "var(--platform-muted)",
              }}
            >
              belairdirect
            </button>
          </div>
        </div>

        {/* Preview card */}
        <div
          className="p-8 transition-all duration-500"
          style={{ backgroundColor: demo.bg }}
        >
          <div className="max-w-md">
            <p
              className="text-xs font-medium uppercase tracking-wider mb-4 transition-all duration-500"
              style={{ color: demo.color }}
            >
              {demo.tagline}
            </p>
            <h2
              className="text-2xl font-bold leading-tight mb-4 transition-all duration-500"
              style={{
                fontFamily:
                  activeBrand === "intact"
                    ? "Georgia, serif"
                    : "'Inter', sans-serif",
                color: activeBrand === "intact" ? "#000" : "#333",
              }}
            >
              {demo.headline}
            </h2>
            <p className="text-sm leading-relaxed mb-6 transition-all duration-500"
              style={{ color: activeBrand === "intact" ? "#000" : "#333" }}
            >
              {demo.body}
            </p>
            <button
              className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-500 ${demo.ctaStyle}`}
            >
              {demo.cta}
            </button>
          </div>
        </div>

        {/* Caption */}
        <div className="px-5 py-3 border-t border-[var(--platform-border)] bg-[var(--platform-sand)]">
          <p className="text-xs text-[var(--platform-muted)]">
            {activeBrand === "intact"
              ? "🔴 Ton chaleureux · Brackets rouges [ ] · Fond sable · CTA rouge"
              : "🔵 Ton direct et joueur · Pas de brackets · Fond neutre · CTA bleu"}
          </p>
        </div>
      </div>

      {hasToggled && (
        <div className="mt-4 flex justify-end animate-fade-in-up">
          <button
            onClick={onComplete}
            className="rounded-full px-6 py-2 text-sm font-medium text-white transition-all duration-200"
            style={{ backgroundColor: "var(--platform-accent)" }}
          >
            Impressionnant, on continue
          </button>
        </div>
      )}
    </div>
  );
}
