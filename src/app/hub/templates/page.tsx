"use client";

import { useState, useCallback } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { AgentToggle } from "@/components/agent/AgentToggle";

interface TextLayer {
  id: string;
  name: string;
  characters: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
}

// Fallback templates when no Figma token
const FALLBACK_TEMPLATES = [
  {
    id: "intact-habitation",
    name: "Banner habitation — Intact",
    brand: "intact" as const,
    format: "Banner 728x90",
    textLayers: [
      { id: "h1", name: "Titre (H1)", characters: "Votre chez-vous mérite la meilleure protection", fontSize: 28, fontWeight: 700, fontFamily: "Georgia" },
      { id: "body", name: "Body", characters: "Parce que votre maison, c'est bien plus que quatre murs. C'est là où vos souvenirs vivent.", fontSize: 16, fontWeight: 400, fontFamily: "Inter" },
      { id: "cta", name: "CTA", characters: "Parler à un courtier", fontSize: 14, fontWeight: 600, fontFamily: "Inter" },
      { id: "tagline", name: "Tagline", characters: "Pour tout ce qui compte", fontSize: 11, fontWeight: 500, fontFamily: "Inter" },
    ],
  },
  {
    id: "bd-auto",
    name: "Story auto — belairdirect",
    brand: "belairdirect" as const,
    format: "Story 1080x1920",
    textLayers: [
      { id: "h1", name: "Titre (H1)", characters: "Ton assurance auto, simplifiée.", fontSize: 32, fontWeight: 700, fontFamily: "Montserrat" },
      { id: "body", name: "Body", characters: "Soumission en 5 min. Zéro paperasse. Zéro détour.", fontSize: 16, fontWeight: 400, fontFamily: "Roboto" },
      { id: "cta", name: "CTA", characters: "Obtenir ma soumission", fontSize: 14, fontWeight: 600, fontFamily: "Montserrat" },
    ],
  },
  {
    id: "intact-olympic",
    name: "Post LinkedIn — Olympiques",
    brand: "intact" as const,
    format: "Social 1200x627",
    textLayers: [
      { id: "h1", name: "Titre (H1)", characters: "[ La résilience, c'est dans notre ADN ]", fontSize: 24, fontWeight: 700, fontFamily: "Georgia" },
      { id: "body", name: "Body", characters: "Fier partenaire d'Équipe Canada depuis 2025.", fontSize: 15, fontWeight: 400, fontFamily: "Inter" },
      { id: "cta", name: "CTA", characters: "En savoir plus", fontSize: 13, fontWeight: 600, fontFamily: "Inter" },
    ],
  },
  {
    id: "bd-chevalier",
    name: "Story — Petit Chevalier été",
    brand: "belairdirect" as const,
    format: "Story 1080x1920",
    textLayers: [
      { id: "h1", name: "Titre (H1)", characters: "Protégé cet été. Direct.", fontSize: 28, fontWeight: 700, fontFamily: "Montserrat" },
      { id: "body", name: "Body", characters: "Ton assurance habitation à partir de 25$/mois.", fontSize: 15, fontWeight: 400, fontFamily: "Roboto" },
      { id: "cta", name: "CTA", characters: "Voir les offres", fontSize: 14, fontWeight: 600, fontFamily: "Montserrat" },
    ],
  },
];

const BRAND_STYLES = {
  intact: {
    bg: "#F7F2EA",
    primary: "#DF0030",
    text: "#000000",
    ctaBg: "#DF0030",
    ctaText: "#FFFFFF",
    tagFont: "Georgia, serif",
    bodyFont: "Inter, sans-serif",
  },
  belairdirect: {
    bg: "#F5F8FA",
    primary: "#C8102E",
    text: "#333333",
    ctaBg: "#0F68D8",
    ctaText: "#FFFFFF",
    tagFont: "'Montserrat', sans-serif",
    bodyFont: "'Roboto', sans-serif",
  },
};

export default function TemplateEditorPage() {
  const [figmaUrl, setFigmaUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeBrand, setActiveBrand] = useState<"intact" | "belairdirect">("intact");
  const [selectedTemplateIdx, setSelectedTemplateIdx] = useState(0);

  // Figma-loaded data
  const [figmaName, setFigmaName] = useState("");
  const [figmaPreview, setFigmaPreview] = useState("");
  const [figmaLayers, setFigmaLayers] = useState<TextLayer[]>([]);
  const [isFigmaMode, setIsFigmaMode] = useState(false);

  // Editable text state
  const [editedTexts, setEditedTexts] = useState<Record<string, string>>({});

  const selectedTemplate = FALLBACK_TEMPLATES[selectedTemplateIdx];
  const style = BRAND_STYLES[activeBrand];

  const currentLayers = isFigmaMode ? figmaLayers : selectedTemplate.textLayers;
  const getEditedText = (layer: TextLayer) => editedTexts[layer.id] ?? layer.characters;

  const handleTextChange = (layerId: string, value: string) => {
    setEditedTexts((prev) => ({ ...prev, [layerId]: value }));
  };

  const handleSelectTemplate = (idx: number) => {
    setSelectedTemplateIdx(idx);
    setIsFigmaMode(false);
    setEditedTexts({});
    setActiveBrand(FALLBACK_TEMPLATES[idx].brand);
  };

  const parseFigmaUrl = (url: string): { fileKey: string; nodeId?: string } | null => {
    const match = url.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
    if (!match) return null;
    const fileKey = match[1];
    const nodeMatch = url.match(/node-id=([^&]+)/);
    const nodeId = nodeMatch ? decodeURIComponent(nodeMatch[1]) : undefined;
    return { fileKey, nodeId };
  };

  const handleFigmaLoad = useCallback(async () => {
    const parsed = parseFigmaUrl(figmaUrl);
    if (!parsed) {
      setError("URL Figma invalide. Format attendu: figma.com/file/ABC123/...");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/figma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur Figma API");
      }

      const data = await res.json();
      setFigmaName(data.name);
      setFigmaPreview(data.previewUrl);
      setFigmaLayers(data.textLayers);
      setIsFigmaMode(true);
      setEditedTexts({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [figmaUrl]);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--platform-sand)" }}>
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — Template gallery */}
        <div className="w-[260px] border-r border-[var(--platform-border)] bg-white overflow-y-auto shrink-0">
          <div className="p-4 border-b border-[var(--platform-border)]">
            <h2 className="text-sm font-semibold">Templates</h2>
            <div className="mt-3 flex gap-2">
              <FilterChip label="Tous" active={true} />
              <FilterChip label="Intact" />
              <FilterChip label="belairdirect" />
            </div>
          </div>

          <div className="p-3 space-y-2">
            {FALLBACK_TEMPLATES.map((t, i) => (
              <button
                key={t.id}
                onClick={() => handleSelectTemplate(i)}
                className={`w-full rounded-lg border-2 p-3 text-left transition-all duration-200 ${
                  !isFigmaMode && selectedTemplateIdx === i
                    ? "border-[var(--platform-accent)] bg-[#FEF2F4]"
                    : "border-[var(--platform-border)] hover:border-[var(--platform-muted)]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: t.brand === "intact" ? "#DF0030" : "#0F68D8" }}
                  />
                  <p className="text-xs font-medium truncate">{t.name}</p>
                </div>
                <p className="text-[10px] text-[var(--platform-muted)]">{t.format}</p>
              </button>
            ))}

            {isFigmaMode && (
              <div className="rounded-lg border-2 border-[var(--platform-accent)] bg-[#FEF2F4] p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <p className="text-xs font-medium truncate">{figmaName}</p>
                </div>
                <p className="text-[10px] text-[var(--platform-muted)]">Figma — {figmaLayers.length} text layers</p>
              </div>
            )}
          </div>
        </div>

        {/* Center — Preview */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-[var(--platform-border)] gap-3">
            {/* Figma URL input */}
            <div className="flex items-center gap-2 flex-1 max-w-[400px]">
              <input
                type="text"
                value={figmaUrl}
                onChange={(e) => setFigmaUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFigmaLoad()}
                placeholder="Coller un lien Figma..."
                className="flex-1 rounded-lg border border-[var(--platform-border)] px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--platform-accent)]"
              />
              <button
                onClick={handleFigmaLoad}
                disabled={!figmaUrl.trim() || loading}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-white disabled:opacity-40"
                style={{ backgroundColor: "var(--platform-accent)" }}
              >
                {loading ? "..." : "Charger"}
              </button>
            </div>

            {/* Brand toggle + format */}
            <div className="flex items-center gap-3">
              <div className="flex rounded-full border border-[var(--platform-border)] p-0.5">
                <button
                  onClick={() => setActiveBrand("intact")}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-all"
                  style={{
                    backgroundColor: activeBrand === "intact" ? "#DF0030" : "transparent",
                    color: activeBrand === "intact" ? "white" : "var(--platform-muted)",
                  }}
                >
                  Intact
                </button>
                <button
                  onClick={() => setActiveBrand("belairdirect")}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-all"
                  style={{
                    backgroundColor: activeBrand === "belairdirect" ? "#0F68D8" : "transparent",
                    color: activeBrand === "belairdirect" ? "white" : "var(--platform-muted)",
                  }}
                >
                  belairdirect
                </button>
              </div>

              <select className="text-xs border border-[var(--platform-border)] rounded-lg px-2 py-1.5 bg-white">
                <option>Social — Story</option>
                <option>Banner — 728x90</option>
                <option>Email</option>
                <option>Landing page</option>
              </select>

              <button className="flex items-center gap-1 rounded-full border border-[var(--platform-border)] px-3 py-1.5 text-xs font-medium hover:border-[var(--platform-muted)]">
                ✨ AI Assist
              </button>
            </div>
          </div>

          {error && (
            <div className="mx-4 mt-3 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Preview area */}
          <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
            {isFigmaMode && figmaPreview ? (
              // Figma preview with text overlay
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-[var(--platform-border)] max-w-[500px]">
                <img src={figmaPreview} alt={figmaName} className="w-full block" />
                {/* Text overlays would render here in a production version */}
              </div>
            ) : (
              // Fallback template preview
              <div
                className="w-[440px] rounded-xl overflow-hidden shadow-lg border border-[var(--platform-border)] transition-all duration-500"
                style={{ backgroundColor: style.bg }}
              >
                <div className="p-8">
                  {/* Tagline */}
                  {currentLayers.find((l) => l.name === "Tagline") && (
                    <p
                      className="text-[10px] font-semibold uppercase tracking-widest mb-4"
                      style={{ color: style.primary }}
                    >
                      {getEditedText(currentLayers.find((l) => l.name === "Tagline")!)}
                    </p>
                  )}

                  {/* H1 */}
                  <h2
                    className="text-2xl font-bold leading-tight mb-3 transition-all"
                    style={{
                      fontFamily: style.tagFont,
                      color: style.text,
                    }}
                  >
                    {activeBrand === "intact" && <span style={{ color: style.primary }}>[</span>}
                    {" "}{getEditedText(currentLayers.find((l) => l.name === "Titre (H1)")!)}{" "}
                    {activeBrand === "intact" && <span style={{ color: style.primary }}>]</span>}
                  </h2>

                  {/* Body */}
                  <p
                    className="text-sm leading-relaxed mb-6 transition-all"
                    style={{ fontFamily: style.bodyFont, color: style.text, opacity: 0.8 }}
                  >
                    {getEditedText(currentLayers.find((l) => l.name === "Body")!)}
                  </p>

                  {/* CTA */}
                  <button
                    className="rounded-full px-5 py-2.5 text-sm font-medium transition-all"
                    style={{ backgroundColor: style.ctaBg, color: style.ctaText }}
                  >
                    {getEditedText(currentLayers.find((l) => l.name === "CTA")!)}
                  </button>
                </div>

                <div className="px-6 py-3 flex items-center justify-between border-t border-[var(--platform-border)] bg-white/50">
                  <span className="text-[10px] text-[var(--platform-muted)]">
                    {isFigmaMode ? figmaName : selectedTemplate.format}
                  </span>
                  <span className="text-[10px] font-medium" style={{ color: style.primary }}>
                    {activeBrand === "intact" ? "Intact Insurance" : "belairdirect"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Export bar */}
          <div className="px-4 py-3 bg-white border-t border-[var(--platform-border)] flex items-center justify-end gap-2">
            <button className="rounded-full border border-[var(--platform-border)] px-4 py-1.5 text-xs font-medium text-[var(--platform-muted)]">
              PNG
            </button>
            <button className="rounded-full border border-[var(--platform-border)] px-4 py-1.5 text-xs font-medium text-[var(--platform-muted)]">
              PDF
            </button>
            <button className="rounded-full border border-[var(--platform-border)] px-4 py-1.5 text-xs font-medium text-[var(--platform-muted)]">
              Multi-format
            </button>
          </div>
        </div>

        {/* Right panel — Edit fields */}
        <div className="w-[280px] border-l border-[var(--platform-border)] bg-white overflow-y-auto shrink-0">
          <div className="p-4 border-b border-[var(--platform-border)]">
            <h2 className="text-sm font-semibold">Édition</h2>
            <p className="text-xs text-[var(--platform-muted)] mt-0.5">
              {isFigmaMode ? `${figmaName} — ${figmaLayers.length} layers` : selectedTemplate.name}
            </p>
          </div>

          <div className="p-4 space-y-4">
            {currentLayers.map((layer) => (
              <div key={layer.id}>
                <label className="text-[10px] font-semibold text-[var(--platform-muted)] uppercase tracking-wider">
                  {layer.name}
                  {layer.fontSize && (
                    <span className="ml-1 font-normal">({layer.fontSize}px)</span>
                  )}
                </label>
                {(layer.characters?.length || 0) > 60 ? (
                  <textarea
                    value={getEditedText(layer)}
                    onChange={(e) => handleTextChange(layer.id, e.target.value)}
                    rows={3}
                    className="mt-1.5 w-full rounded-lg border border-[var(--platform-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--platform-accent)] resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={getEditedText(layer)}
                    onChange={(e) => handleTextChange(layer.id, e.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-[var(--platform-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--platform-accent)]"
                  />
                )}
              </div>
            ))}

            <div className="pt-2">
              <label className="text-[10px] font-semibold text-[var(--platform-muted)] uppercase tracking-wider">
                Image
              </label>
              <div className="mt-1.5 rounded-lg border border-dashed border-[var(--platform-border)] p-4 text-center">
                <p className="text-xs text-[var(--platform-muted)]">Glisser une image</p>
              </div>
            </div>

            <div className="pt-2">
              <label className="text-[10px] font-semibold text-[var(--platform-muted)] uppercase tracking-wider">
                Palette
              </label>
              <div className="mt-1.5 flex gap-2">
                <ColorDot color={style.primary} active />
                <ColorDot color={style.bg} />
                <ColorDot color={style.text} />
                <ColorDot color={style.ctaBg} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <AgentToggle />
    </div>
  );
}

function FilterChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className="rounded-full px-3 py-1 text-xs font-medium border transition-colors"
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

function ColorDot({ color, active }: { color: string; active?: boolean }) {
  return (
    <button
      className="w-7 h-7 rounded-full border-2 transition-all"
      style={{
        backgroundColor: color,
        borderColor: active ? "var(--platform-accent)" : "var(--platform-border)",
      }}
    />
  );
}
