"use client";

import { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

const FORMATS = [
  { id: "1:1", label: "1:1", desc: "Carré", w: 1080, h: 1080, icon: "◻" },
  { id: "9:16", label: "9:16", desc: "Story / Reel", w: 1080, h: 1920, icon: "▯" },
  { id: "16:9", label: "16:9", desc: "Landscape", w: 1920, h: 1080, icon: "▬" },
  { id: "4:5", label: "4:5", desc: "Portrait Feed", w: 1080, h: 1350, icon: "▮" },
  { id: "728x90", label: "728×90", desc: "Leaderboard", w: 728, h: 90, icon: "━" },
  { id: "300x250", label: "300×250", desc: "Medium Rect", w: 300, h: 250, icon: "▫" },
  { id: "300x600", label: "300×600", desc: "Half Page", w: 300, h: 600, icon: "▏" },
  { id: "600x200", label: "600×200", desc: "Email Header", w: 600, h: 200, icon: "▔" },
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

interface FieldStatus {
  label: string;
  filled: boolean;
  value?: string;
}

export function BriefForm({ triage, onBack }: BriefFormProps) {
  const [brands, setBrands] = useState<Set<string>>(new Set());
  const [markets, setMarkets] = useState<Set<string>>(new Set());
  const [deliverables, setDeliverables] = useState<Set<string>>(new Set());
  const [selectedFormats, setSelectedFormats] = useState<Set<string>>(new Set());
  const [briefText, setBriefText] = useState("");
  const [projectName, setProjectName] = useState("");
  const [requester, setRequester] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);

  const toggleChip = (set: Set<string>, setFn: (s: Set<string>) => void, value: string) => {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setFn(next);
  };

  // Field-by-field completion tracking
  const fields: FieldStatus[] = [
    { label: "Objectif / Urgence / Scope", filled: true, value: `${LABELS[triage.objective]} · ${LABELS[triage.urgency]} · ${LABELS[triage.volume]}` },
    { label: "Projet", filled: projectName.length > 0, value: projectName },
    { label: "Demandeur", filled: requester.length > 0, value: requester },
    { label: "Marque(s)", filled: brands.size > 0, value: Array.from(brands).join(", ") },
    { label: "Provinces / Langues", filled: markets.size > 0, value: Array.from(markets).join(", ") },
    { label: "Brief", filled: briefText.length > 20, value: briefText },
    { label: "Livrables", filled: deliverables.size > 0, value: Array.from(deliverables).map((d) => DELIVERABLES.find((x) => x.id === d)?.label).join(", ") },
  ];

  const filledCount = fields.filter((f) => f.filled).length;
  const completion = Math.round((filledCount / fields.length) * 100);

  if (showSummary) {
    const isComplete = completion === 100;
    return (
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSummary(false)} className="text-[var(--platform-muted)] hover:text-[var(--platform-text)]">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <h2 className="text-xl font-semibold">Récapitulatif</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { navigator.clipboard.writeText(fields.map((f) => `${f.label}: ${f.value || "—"}`).join("\n")); }}
              className="flex items-center gap-1.5 rounded-full border border-[var(--platform-border)] px-4 py-2 text-sm font-medium hover:border-[var(--platform-muted)]"
            >
              📋 Copier
            </button>
            <button
              onClick={() => {
                let md = `# Brief Studio AI\n\n`;
                fields.forEach((f) => { md += `**${f.label}:** ${f.value || "Non renseigné"}\n\n`; });
                if (selectedFormats.size > 0) md += `**Formats:** ${Array.from(selectedFormats).map((f) => FORMATS.find((x) => x.id === f)?.label).join(", ")}\n\n`;
                const blob = new Blob([md], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = "brief-studio-ai.md"; a.click();
              }}
              className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: "var(--platform-accent)" }}
            >
              ⬇ Télécharger
            </button>
          </div>
        </div>

        {/* Completion banner */}
        <div
          className="rounded-xl p-5 mb-6 flex items-center gap-4"
          style={{ backgroundColor: isComplete ? "#F0FFF4" : "#FEF2F4", border: `1px solid ${isComplete ? "#009460" : "var(--platform-accent)"}20` }}
        >
          {/* Progress circle */}
          <div className="relative w-14 h-14 shrink-0">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke={isComplete ? "#00946020" : "#D1133820"} strokeWidth="4" />
              <circle cx="28" cy="28" r="24" fill="none" stroke={isComplete ? "#009460" : "var(--platform-accent)"} strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${(completion / 100) * 150.8} 150.8`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: isComplete ? "#009460" : "var(--platform-accent)" }}>
              {completion}%
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold">{isComplete ? "Brief complet ✓" : "Brief incomplet"}</p>
            <p className="text-xs text-[var(--platform-muted)]">
              {isComplete ? "Tous les champs sont remplis. Prêt à envoyer!" : "Retourne en arrière pour compléter les champs manquants."}
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="rounded-xl bg-white border border-[var(--platform-border)] divide-y divide-[var(--platform-border)]">
          {fields.map((field) => (
            <div key={field.label} className="flex items-start gap-3 px-5 py-4">
              <div className="mt-0.5 shrink-0">
                {field.filled ? (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "#00946015", color: "#009460" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: "#D1133815", color: "var(--platform-accent)" }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="1" fill="currentColor"/></svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: field.filled ? "var(--platform-muted)" : "var(--platform-accent)" }}>
                  {field.label}
                </p>
                <p className="text-sm mt-0.5" style={{ color: field.filled ? "var(--platform-text)" : "var(--platform-accent)", fontStyle: field.filled ? "normal" : "italic" }}>
                  {field.filled ? field.value : "Non renseigné"}
                </p>
              </div>
            </div>
          ))}
          {selectedFormats.size > 0 && (
            <div className="flex items-start gap-3 px-5 py-4">
              <div className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "#00946015", color: "#009460" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-[var(--platform-muted)] uppercase tracking-wider">Formats</p>
                <p className="text-sm mt-0.5">{Array.from(selectedFormats).map((f) => FORMATS.find((x) => x.id === f)?.label).join(", ")}</p>
              </div>
            </div>
          )}
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
        <div className="flex items-center gap-2 rounded-full border border-[var(--platform-border)] bg-white pl-1 pr-3 py-1">
          <div className="relative w-7 h-7 shrink-0">
            <svg className="w-7 h-7 -rotate-90" viewBox="0 0 28 28">
              <circle cx="14" cy="14" r="11" fill="none" stroke="#E5E5E5" strokeWidth="2.5" />
              <circle cx="14" cy="14" r="11" fill="none"
                stroke={completion === 100 ? "#009460" : "var(--platform-accent)"}
                strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray={`${(completion / 100) * 69.1} 69.1`}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[7px] font-bold" style={{ color: completion === 100 ? "#009460" : "var(--platform-muted)" }}>
              {completion}
            </span>
          </div>
          <span className="text-xs font-medium" style={{ color: completion === 100 ? "#009460" : "var(--platform-muted)" }}>
            {completion}% complet
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Projet & demandeur */}
        <Section title="Projet & demandeur">
          <input type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Nom du projet (ex: Campagne été 2026 belairdirect)" className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)]" />
          <input type="text" value={requester} onChange={(e) => setRequester(e.target.value)} placeholder="Ton nom + équipe (ex: Guillaume Perron, Marketing)" className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)] mt-3" />
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

        {/* Brief + AI brainstorm button */}
        <Section title="Ton brief">
          <textarea
            rows={4}
            value={briefText}
            onChange={(e) => setBriefText(e.target.value)}
            placeholder="Décris le contexte, l'objectif, tes idées initiales, l'audience cible, le message clé..."
            className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)] resize-none"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => setShowAiModal(true)}
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--platform-accent)" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L2 8L8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                <path d="M14 2L8 8L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Brainstormer avec l&apos;AI
            </button>
            <span className="text-xs text-[var(--platform-muted)]">L&apos;AI vous aide à structurer votre brief</span>
          </div>
          <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-2.5">
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

        {/* Conditional: Campaign */}
        {triage.volume === "grand" && (
          <Section title="Détails — Campagne">
            <input type="text" placeholder="Timeline de campagne" className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)]" />
            <textarea rows={2} placeholder="Exigences cross-canal, budget indicatif" className="w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)] mt-3 resize-none" />
          </Section>
        )}

        {/* Specs & formats */}
        <Section title="Specs & deadline">
          <div className="mb-4">
            <label className="text-xs font-medium text-[var(--platform-muted)] uppercase tracking-wider">Date limite</label>
            <input type="date" className="mt-1.5 w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)]" />
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium text-[var(--platform-muted)] uppercase tracking-wider">Formats & tailles</label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {FORMATS.map((f) => {
                const isSelected = selectedFormats.has(f.id);
                return (
                  <button
                    key={f.id}
                    onClick={() => toggleChip(selectedFormats, setSelectedFormats, f.id)}
                    className="relative rounded-xl border-2 p-3 text-center transition-all duration-200 hover:shadow-sm"
                    style={{
                      borderColor: isSelected ? "var(--platform-accent)" : "var(--platform-border)",
                      backgroundColor: isSelected ? "#FEF2F4" : "white",
                    }}
                  >
                    {/* Aspect ratio preview */}
                    <div className="mx-auto mb-2 flex items-center justify-center" style={{ width: 40, height: 40 }}>
                      <div
                        className="rounded-sm transition-all"
                        style={{
                          width: Math.min(36, 36 * (f.w / Math.max(f.w, f.h))),
                          height: Math.min(36, 36 * (f.h / Math.max(f.w, f.h))),
                          backgroundColor: isSelected ? "var(--platform-accent)" : "var(--platform-border)",
                          opacity: isSelected ? 0.3 : 0.4,
                        }}
                      />
                    </div>
                    <p className="text-xs font-semibold" style={{ color: isSelected ? "var(--platform-accent)" : "var(--platform-text)" }}>
                      {f.label}
                    </p>
                    <p className="text-[10px] text-[var(--platform-muted)] mt-0.5">{f.desc}</p>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--platform-accent)" }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--platform-muted)] uppercase tracking-wider">Notes & références</label>
            <textarea rows={2} placeholder="Insights, benchmarks, moodboard, liens..." className="mt-1.5 w-full rounded-lg border border-[var(--platform-border)] px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--platform-accent)] resize-none" />
          </div>
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

      {/* AI Brainstorm Modal */}
      {showAiModal && (
        <AiBrainstormModal
          onClose={() => setShowAiModal(false)}
          onApply={(text) => {
            setBriefText((prev) => (prev ? prev + "\n\n" + text : text));
            setShowAiModal(false);
          }}
        />
      )}
    </div>
  );
}

// ── AI Brainstorm Modal ──
function AiBrainstormModal({ onClose, onApply }: { onClose: () => void; onApply: (text: string) => void }) {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; id: string }[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastAiResponse, setLastAiResponse] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, 50);
  }, []);

  const handleSend = async (content?: string) => {
    const text = (content || input).trim();
    if (!text || isStreaming) return;
    setInput("");

    const userMsg = { id: crypto.randomUUID(), role: "user" as const, content: text };
    const assistantMsg = { id: crypto.randomUUID(), role: "assistant" as const, content: "" };
    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const response = await fetch("/api/brainstorm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!response.ok) throw new Error("Failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No reader");

      let buffer = "";
      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            fullText += parsed.text;
            setMessages((prev) => prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: fullText } : m)));
            scrollToBottom();
          } catch { /* skip */ }
        }
      }
      const clean = fullText.replace(/\[REPLIES:.*?\]/g, "").trim();
      setMessages((prev) => prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: clean } : m)));
      setLastAiResponse(clean);
    } catch {
      setMessages((prev) => prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: "Erreur. Réessayez." } : m)));
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="w-[640px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--platform-border)]" style={{ backgroundColor: "var(--platform-sand)" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "var(--platform-accent)" }}>SA</div>
            <div>
              <p className="text-sm font-semibold">Brainstorm AI</p>
              <p className="text-[10px] text-[var(--platform-muted)]">Aide à structurer ton brief</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/60">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="var(--platform-muted)" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm font-semibold mb-2">Brainstormez votre brief</p>
              <p className="text-xs text-[var(--platform-muted)] mb-4">Décrivez votre projet et l&apos;AI vous aide à structurer le contenu.</p>
              <div className="flex flex-col gap-2 max-w-xs mx-auto">
                {[
                  "J'ai besoin d'une campagne été pour belairdirect",
                  "On veut promouvoir l'assurance habitation chez Intact",
                  "Aide-moi à définir l'audience pour une campagne conversion",
                ].map((s) => (
                  <button key={s} onClick={() => handleSend(s)} className="rounded-full px-4 py-2 text-xs font-medium text-white" style={{ backgroundColor: "var(--platform-accent)" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={msg.role === "user" ? "flex justify-end" : ""}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-[var(--platform-sand)] rounded-tr-sm"
                  : "border border-[var(--platform-border)] rounded-tl-sm"
              }`}>
                {msg.role === "user" ? msg.content : msg.content ? (
                  <div className="markdown-body text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex gap-1.5 py-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--platform-muted)] animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--platform-muted)] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--platform-muted)] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input + Apply button */}
        <div className="border-t border-[var(--platform-border)] p-3">
          {lastAiResponse && (
            <button
              onClick={() => onApply(lastAiResponse)}
              className="w-full mb-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#009460" }}
            >
              ✓ Appliquer au brief
            </button>
          )}
          <div className="flex items-end gap-2 rounded-xl border border-[var(--platform-border)] px-3 py-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Décrivez votre projet..."
              disabled={isStreaming}
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={isStreaming || !input.trim()}
              className="shrink-0 rounded-full p-2 text-white disabled:opacity-30"
              style={{ backgroundColor: input.trim() ? "var(--platform-accent)" : "var(--platform-border)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7L7 2M7 2L12 7M7 2V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
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
