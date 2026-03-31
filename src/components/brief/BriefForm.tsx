"use client";

import { useState } from "react";

interface BriefFormProps {
  triage: { objective: string; urgency: string; volume: string };
  onBack: () => void;
}

const BRAND_CHIPS = ["belairdirect", "Intact Insurance", "IFC", "belairdirect Affinity", "Jiffy", "NBI", "Scotia"];
const MARKET_CHIPS = ["QC FR", "QC EN", "ON", "AB", "ATL", "NS", "NL", "NB", "PEI"];
const DELIVERABLES = [
  { id: "design", label: "Design", desc: "Visuels statiques, layouts, assets" },
  { id: "motion", label: "Motion video", desc: "Animation, vidéo, reels" },
  { id: "strategy", label: "Creative strategy", desc: "Concept, direction, positionnement" },
  { id: "landing", label: "Landing page", desc: "Page web, LP, microsite" },
  { id: "illustrations", label: "Illustrations", desc: "Illustrations custom, icônes" },
  { id: "copy", label: "Copy", desc: "Rédaction, slogans, scripts" },
  { id: "ugc", label: "UGC", desc: "User-generated content" },
];

const LABELS: Record<string, string> = {
  notoriete: "🎯 Notoriété",
  conversion: "🎯 Conversion",
  engagement: "💬 Engagement",
  lancement: "🚀 Lancement",
  interne: "🏢 Interne",
  asap: "⚡ ASAP (5 jours)",
  "2weeks": "📅 2 semaines",
  flexible: "🕐 Flexible",
  petit: "📄 Petit",
  moyen: "📦 Moyen",
  grand: "🎪 Grand",
};

export function BriefForm({ triage, onBack }: BriefFormProps) {
  const [brands, setBrands] = useState<Set<string>>(new Set());
  const [markets, setMarkets] = useState<Set<string>>(new Set());
  const [deliverables, setDeliverables] = useState<Set<string>>(new Set());
  const [showSummary, setShowSummary] = useState(false);

  const toggleChip = (set: Set<string>, setFn: (s: Set<string>) => void, value: string) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setFn(next);
  };

  const completion = Math.min(
    100,
    (brands.size > 0 ? 20 : 0) +
    (markets.size > 0 ? 15 : 0) +
    (deliverables.size > 0 ? 25 : 0) +
    40 // triage already done
  );

  if (showSummary) {
    return (
      <div>
        <div className="rounded-xl bg-white border border-[var(--platform-border)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--platform-border)]" style={{ backgroundColor: "var(--platform-sand)" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Récapitulatif du brief</h2>
              <button
                onClick={() => {
                  const blob = new Blob(["# Brief Studio AI\n\nExporté depuis la plateforme."], { type: "text/markdown" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "brief-studio-ai.md";
                  a.click();
                }}
                className="rounded-full px-4 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: "var(--platform-accent)" }}
              >
                Exporter le brief
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-2">Triage</p>
              <div className="flex flex-wrap gap-2">
                {[triage.objective, triage.urgency, triage.volume].map((v) => (
                  <span key={v} className="rounded-full px-3 py-1 text-xs font-medium border border-[var(--platform-border)]">
                    {LABELS[v] || v}
                  </span>
                ))}
              </div>
            </div>
            {brands.size > 0 && (
              <div>
                <p className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-2">Marques</p>
                <p className="text-sm">{Array.from(brands).join(", ")}</p>
              </div>
            )}
            {markets.size > 0 && (
              <div>
                <p className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-2">Marchés</p>
                <p className="text-sm">{Array.from(markets).join(", ")}</p>
              </div>
            )}
            {deliverables.size > 0 && (
              <div>
                <p className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-2">Livrables</p>
                <p className="text-sm">{Array.from(deliverables).join(", ")}</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 text-center">
          <button onClick={() => setShowSummary(false)} className="text-sm text-[var(--platform-muted)]">← Retour au formulaire</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Triage chips + completion */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-wrap gap-2">
          {[triage.objective, triage.urgency, triage.volume].map((v) => (
            <span key={v} className="rounded-full px-3 py-1 text-xs font-medium border border-[var(--platform-border)] bg-white">
              {LABELS[v] || v}
            </span>
          ))}
          <button onClick={onBack} className="rounded-full px-3 py-1 text-xs text-[var(--platform-accent)] hover:underline">
            ✏️ Modifier
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 rounded-full bg-[var(--platform-border)]">
            <div
              className="h-2 rounded-full transition-all duration-500"
              style={{ width: `${completion}%`, backgroundColor: completion === 100 ? "#009460" : "var(--platform-accent)" }}
            />
          </div>
          <span className="text-xs font-medium" style={{ color: completion === 100 ? "#009460" : "var(--platform-muted)" }}>
            {completion}%
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Projet & demandeur */}
        <Section title="Projet & demandeur">
          <input type="text" placeholder="Nom du projet (ex: Campagne été 2026 belairdirect)" className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)]" />
          <input type="text" placeholder="Ton nom + équipe (ex: Guillaume Perron, Marketing)" className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)] mt-3" />
        </Section>

        {/* Marque & marché */}
        <Section title="Marque & marché">
          <p className="text-xs text-[var(--platform-muted)] mb-2">Marque(s)</p>
          <div className="flex flex-wrap gap-2">
            {BRAND_CHIPS.map((b) => (
              <ChipToggle key={b} label={b} active={brands.has(b)} onClick={() => toggleChip(brands, setBrands, b)} />
            ))}
          </div>
          <p className="text-xs text-[var(--platform-muted)] mb-2 mt-4">Province / Langue</p>
          <div className="flex flex-wrap gap-2">
            {MARKET_CHIPS.map((m) => (
              <ChipToggle key={m} label={m} active={markets.has(m)} onClick={() => toggleChip(markets, setMarkets, m)} />
            ))}
          </div>
        </Section>

        {/* Brief */}
        <Section title="Ton brief">
          <textarea
            rows={4}
            placeholder="Décris le contexte, l'objectif, tes idées initiales, l'audience cible, le message clé..."
            className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)] resize-none"
          />
          <div className="mt-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5">
            <p className="text-xs text-amber-700">
              💡 Un bon brief répond à : <strong>Pourquoi</strong> (contexte business), <strong>Quoi</strong> (livrables), <strong>Pour qui</strong> (audience), et <strong>Comment on mesure le succès</strong>.
            </p>
          </div>
        </Section>

        {/* Deliverables */}
        <Section title="De quoi as-tu besoin?">
          <div className="grid grid-cols-2 gap-2">
            {DELIVERABLES.map((d) => (
              <button
                key={d.id}
                onClick={() => toggleChip(deliverables, setDeliverables, d.id)}
                className="flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all duration-200"
                style={{
                  borderColor: deliverables.has(d.id) ? "var(--platform-accent)" : "var(--platform-border)",
                  backgroundColor: deliverables.has(d.id) ? "#FEF2F4" : "white",
                }}
              >
                <div
                  className="w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all"
                  style={{
                    borderColor: deliverables.has(d.id) ? "var(--platform-accent)" : "var(--platform-border)",
                    backgroundColor: deliverables.has(d.id) ? "var(--platform-accent)" : "transparent",
                  }}
                >
                  {deliverables.has(d.id) && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{d.label}</p>
                  <p className="text-[11px] text-[var(--platform-muted)]">{d.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </Section>

        {/* Conditional: Copy */}
        {deliverables.has("copy") && (
          <Section title="Détails — Copy">
            <input type="text" placeholder="Ton souhaité (ex: chaleureux, direct, professionnel)" className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)]" />
            <textarea rows={2} placeholder="Messages clés" className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)] mt-3 resize-none" />
          </Section>
        )}

        {/* Conditional: Motion */}
        {deliverables.has("motion") && (
          <Section title="Détails — Motion video">
            <input type="text" placeholder="Durée (ex: 15s, 30s, 60s)" className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)]" />
            <input type="text" placeholder="Format (reel, TVC, social)" className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)] mt-3" />
            <textarea rows={2} placeholder="Notes storyboard, voiceover" className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)] mt-3 resize-none" />
          </Section>
        )}

        {/* Conditional: Campaign (grand volume) */}
        {triage.volume === "grand" && (
          <Section title="Détails — Campagne">
            <input type="text" placeholder="Timeline de campagne" className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)]" />
            <textarea rows={2} placeholder="Exigences cross-canal, budget indicatif" className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)] mt-3 resize-none" />
          </Section>
        )}

        {/* Specs */}
        <Section title="Specs & deadline">
          <input type="date" className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)]" />
          <textarea rows={2} placeholder="Canaux & tailles (ex: Instagram Story 1080x1920, Banner 728x90...)" className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)] mt-3 resize-none" />
          <textarea rows={2} placeholder="Notes & références (insights, benchmarks, moodboard, liens...)" className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)] mt-3 resize-none" />
        </Section>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onBack} className="rounded-full border border-[var(--platform-border)] px-6 py-2.5 text-sm font-medium hover:border-[var(--platform-muted)] transition-colors">
            ← Retour
          </button>
          <button
            onClick={() => setShowSummary(true)}
            className="rounded-full px-6 py-2.5 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--platform-accent)" }}
          >
            Voir le récapitulatif
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white border border-[var(--platform-border)] p-5">
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function ChipToggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all duration-200"
      style={{
        borderColor: active ? "var(--platform-accent)" : "var(--platform-border)",
        backgroundColor: active ? "#FEF2F4" : "white",
        color: active ? "var(--platform-accent)" : "var(--platform-muted)",
      }}
    >
      {label}
    </button>
  );
}
