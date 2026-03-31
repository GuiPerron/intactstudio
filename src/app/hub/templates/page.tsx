"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { NavBar } from "@/components/layout/NavBar";
import { AgentToggle } from "@/components/agent/AgentToggle";
import { TEMPLATES } from "@/lib/templates/data";
import {
  Template,
  Layer,
  BrandKey,
  FormatKey,
  BRAND_TOKENS,
  FORMAT_DIMENSIONS,
  KNIGHT_ASSETS,
} from "@/lib/templates/types";

export default function TemplateEditorPage() {
  const [selectedId, setSelectedId] = useState(TEMPLATES[0].id);
  const [activeBrand, setActiveBrand] = useState<BrandKey>(TEMPLATES[0].brand);
  const [activeFormat, setActiveFormat] = useState<FormatKey>(TEMPLATES[0].format);
  const [editedLayers, setEditedLayers] = useState<Record<string, Record<string, string>>>({});
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [aiTemplate, setAiTemplate] = useState<Template | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Listen for AI-generated template updates
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as Template;
      if (detail && detail.layers) {
        setAiTemplate(detail);
        setActiveBrand(detail.brand || "belairdirect");
        setActiveFormat(detail.format || "social");
        setEditedLayers({});
        setEditingLayerId(null);
      }
    };
    window.addEventListener("template-update", handler);
    return () => window.removeEventListener("template-update", handler);
  }, []);

  const template = aiTemplate || TEMPLATES.find((t) => t.id === selectedId)!;
  const tokens = BRAND_TOKENS[activeBrand];
  const format = FORMAT_DIMENSIONS[activeFormat];

  const currentTemplateJson = useMemo(
    () => JSON.stringify(template, null, 2),
    [template]
  );

  const getLayerContent = (layer: Layer): string => {
    if (layer.type === "cta") return editedLayers[selectedId]?.[layer.id] ?? layer.label;
    if (layer.type === "text") return editedLayers[selectedId]?.[layer.id] ?? layer.content;
    if (layer.type === "logo") return tokens.logoText;
    return "";
  };

  const setLayerContent = (layerId: string, value: string) => {
    setEditedLayers((prev) => ({
      ...prev,
      [selectedId]: { ...prev[selectedId], [layerId]: value },
    }));
  };

  const handleSelectTemplate = (t: Template) => {
    setSelectedId(t.id);
    setActiveBrand(t.brand);
    setActiveFormat(t.format);
    setEditingLayerId(null);
    setAiTemplate(null);
  };

  const handleBrandSwitch = (brand: BrandKey) => {
    setActiveBrand(brand);
  };

  const handleExportPng = useCallback(async () => {
    if (!canvasRef.current) return;
    const { default: html2canvas } = await import("html2canvas-pro");
    const canvas = await html2canvas(canvasRef.current, { scale: 2, useCORS: true });
    const link = document.createElement("a");
    link.download = `${template.name.replace(/\s/g, "-")}-${activeBrand}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [template.name, activeBrand]);

  // Scale the preview to fit
  const maxPreviewW = 560;
  const maxPreviewH = 520;
  const scaleX = maxPreviewW / format.width;
  const scaleY = maxPreviewH / format.height;
  const scale = Math.min(scaleX, scaleY, 0.55);

  const filteredTemplates = TEMPLATES;

  // Get brand-aware layer style
  const getLayerStyle = (layer: Layer) => {
    if (layer.type === "text") {
      const isH1 = layer.id === "h1";
      const isTagline = layer.id === "tagline";
      return {
        color: isTagline ? tokens.accentColor : (isH1 ? tokens.h1Color : tokens.bodyColor),
        fontFamily: isH1 ? tokens.h1Font : tokens.bodyFont,
      };
    }
    if (layer.type === "cta") {
      return { bgColor: tokens.ctaBg, textColor: tokens.ctaText, borderRadius: tokens.ctaRadius };
    }
    if (layer.type === "logo") {
      return { color: tokens.logoColor, fontFamily: tokens.logoFont };
    }
    return {};
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--platform-sand)" }}>
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left — Template library */}
        <div className="w-[240px] border-r border-[var(--platform-border)] bg-white overflow-y-auto shrink-0">
          <div className="p-3 border-b border-[var(--platform-border)]">
            <h2 className="text-sm font-semibold mb-2">Templates</h2>
            <p className="text-[10px] text-[var(--platform-muted)]">belairdirect — 6 templates</p>
          </div>

          <div className="p-2 space-y-1.5">
            {filteredTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => handleSelectTemplate(t)}
                className={`w-full rounded-lg border-2 overflow-hidden transition-all duration-200 ${
                  selectedId === t.id ? "border-[var(--platform-accent)]" : "border-[var(--platform-border)] hover:border-[var(--platform-muted)]"
                }`}
              >
                {/* Mini preview */}
                <div
                  className="aspect-square flex items-center justify-center p-2"
                  style={{ backgroundColor: t.backgroundColor }}
                >
                  <span className="text-[8px] font-bold text-center leading-tight" style={{ color: t.brand === "intact" ? "#000" : "#FFF" }}>
                    {t.layers.find((l) => l.type === "text" && l.id === "h1")?.type === "text"
                      ? (t.layers.find((l) => l.id === "h1") as { content: string })?.content?.slice(0, 30)
                      : t.name}
                  </span>
                </div>
                <div className="p-2">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: t.brand === "intact" ? "#D11338" : "#0F68D8" }}
                    />
                    <p className="text-[10px] font-medium truncate">{t.name}</p>
                  </div>
                  <p className="text-[9px] text-[var(--platform-muted)] mt-0.5">
                    {FORMAT_DIMENSIONS[t.format].label}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center — Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-[var(--platform-border)] gap-3">
            <div className="flex items-center gap-3">
              {/* Brand toggle */}
              <div className="flex rounded-full border border-[var(--platform-border)] p-0.5">
                <button
                  onClick={() => handleBrandSwitch("intact")}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-all duration-300"
                  style={{
                    backgroundColor: activeBrand === "intact" ? "#D11338" : "transparent",
                    color: activeBrand === "intact" ? "white" : "var(--platform-muted)",
                  }}
                >
                  Intact
                </button>
                <button
                  onClick={() => handleBrandSwitch("belairdirect")}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-all duration-300"
                  style={{
                    backgroundColor: activeBrand === "belairdirect" ? "#0F68D8" : "transparent",
                    color: activeBrand === "belairdirect" ? "white" : "var(--platform-muted)",
                  }}
                >
                  belairdirect
                </button>
              </div>

              {/* Format selector */}
              <select
                value={activeFormat}
                onChange={(e) => setActiveFormat(e.target.value as FormatKey)}
                className="text-xs border border-[var(--platform-border)] rounded-lg px-2.5 py-1.5 bg-white"
              >
                {Object.entries(FORMAT_DIMENSIONS).map(([key, f]) => (
                  <option key={key} value={key}>{f.label}</option>
                ))}
              </select>
            </div>

            <button className="flex items-center gap-1.5 rounded-full border border-[var(--platform-border)] px-3 py-1.5 text-xs font-medium hover:border-[var(--platform-muted)]">
              ✨ AI Assist
            </button>
          </div>

          {/* Canvas area */}
          <div className="flex-1 flex items-center justify-center p-6 overflow-auto" onClick={() => setEditingLayerId(null)}>
            <div
              ref={canvasRef}
              className="relative shadow-xl rounded-lg overflow-hidden transition-all duration-500"
              style={{
                width: format.width * scale,
                height: format.height * scale,
                backgroundColor: activeBrand === template.brand ? template.backgroundColor : tokens.backgroundColor,
              }}
            >
              {template.layers.map((layer) => {
                const layerStyle = getLayerStyle(layer);

                if (layer.type === "text") {
                  const isEditing = editingLayerId === layer.id;
                  const content = getLayerContent(layer);
                  return (
                    <div
                      key={layer.id}
                      className="absolute cursor-text transition-colors duration-300"
                      style={{
                        left: layer.x * scale,
                        top: layer.y * scale,
                        maxWidth: layer.maxWidth ? layer.maxWidth * scale : undefined,
                        fontSize: layer.fontSize * scale,
                        fontWeight: layer.fontWeight,
                        fontFamily: (layerStyle as { fontFamily?: string }).fontFamily || layer.fontFamily,
                        color: (layerStyle as { color?: string }).color || layer.color,
                        lineHeight: layer.lineHeight || 1.3,
                        whiteSpace: "pre-wrap",
                        outline: isEditing ? `2px solid var(--platform-accent)` : "2px solid transparent",
                        outlineOffset: "2px",
                        borderRadius: "2px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingLayerId(layer.id);
                      }}
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        setLayerContent(layer.id, e.currentTarget.textContent || "");
                      }}
                      dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br>") }}
                    />
                  );
                }

                if (layer.type === "image") {
                  return (
                    <div
                      key={layer.id}
                      className="absolute flex items-center justify-center overflow-hidden"
                      style={{
                        left: layer.x * scale,
                        top: layer.y * scale,
                        width: layer.width * scale,
                        height: layer.height * scale,
                        backgroundColor: !layer.src ? (layer.bgColor || "rgba(255,255,255,0.1)") : "transparent",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingLayerId(layer.id);
                      }}
                    >
                      {layer.src ? (
                        <img
                          src={layer.src}
                          alt={layer.placeholder}
                          className="w-full h-full object-contain"
                          style={{
                            outline: editingLayerId === layer.id ? "2px solid var(--platform-accent)" : "none",
                            outlineOffset: "2px",
                          }}
                        />
                      ) : (
                        <span style={{ fontSize: 14 * scale, opacity: 0.6 }}>{layer.placeholder}</span>
                      )}
                    </div>
                  );
                }

                if (layer.type === "cta") {
                  const ctaStyle = layerStyle as { bgColor?: string; textColor?: string; borderRadius?: number };
                  const isEditing = editingLayerId === layer.id;
                  return (
                    <div
                      key={layer.id}
                      className="absolute cursor-text transition-all duration-300"
                      style={{
                        left: layer.x * scale,
                        top: layer.y * scale,
                        backgroundColor: ctaStyle.bgColor || layer.bgColor,
                        color: ctaStyle.textColor || layer.textColor,
                        borderRadius: (ctaStyle.borderRadius || layer.borderRadius) * scale,
                        padding: `${8 * scale}px ${20 * scale}px`,
                        fontSize: layer.fontSize * scale,
                        fontWeight: "600",
                        fontFamily: layer.fontFamily,
                        border: layer.borderColor
                          ? `${(layer.borderWidth || 2) * scale}px solid ${layer.borderColor}`
                          : "none",
                        outline: isEditing ? "2px solid yellow" : "none",
                        outlineOffset: "2px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingLayerId(layer.id);
                      }}
                      contentEditable={isEditing}
                      suppressContentEditableWarning
                      onBlur={(e) => setLayerContent(layer.id, e.currentTarget.textContent || "")}
                    >
                      {getLayerContent(layer)}
                    </div>
                  );
                }

                if (layer.type === "logo") {
                  const logoStyle = layerStyle as { color?: string; fontFamily?: string };
                  return (
                    <div
                      key={layer.id}
                      className="absolute transition-all duration-300"
                      style={{
                        left: layer.x * scale,
                        top: layer.y * scale,
                        fontSize: layer.fontSize * scale,
                        fontWeight: "700",
                        fontFamily: logoStyle.fontFamily || layer.fontFamily,
                        color: logoStyle.color || layer.color,
                      }}
                    >
                      {tokens.logoText}
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>

          {/* Export bar */}
          <div className="px-4 py-2.5 bg-white border-t border-[var(--platform-border)] flex items-center justify-between">
            <span className="text-xs text-[var(--platform-muted)]">
              {format.label} · {activeBrand === "intact" ? "Intact Insurance" : "belairdirect"}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPng}
                className="rounded-full px-4 py-1.5 text-xs font-medium text-white"
                style={{ backgroundColor: "var(--platform-accent)" }}
              >
                Export PNG
              </button>
              <button className="rounded-full border border-[var(--platform-border)] px-4 py-1.5 text-xs font-medium text-[var(--platform-muted)]">
                A/B
              </button>
            </div>
          </div>
        </div>

        {/* Right — Properties */}
        <div className="w-[260px] border-l border-[var(--platform-border)] bg-white overflow-y-auto shrink-0">
          <div className="p-3 border-b border-[var(--platform-border)]">
            <h2 className="text-sm font-semibold">Propriétés</h2>
            <p className="text-[10px] text-[var(--platform-muted)] mt-0.5">{template.name}</p>
          </div>

          <div className="p-3 space-y-4">
            {/* Editable text layers */}
            <div>
              <p className="text-[10px] font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-2">
                Texte
              </p>
              <div className="space-y-3">
                {template.layers
                  .filter((l) => l.type === "text" || l.type === "cta")
                  .map((layer) => (
                    <div key={layer.id}>
                      <label className="text-[10px] font-medium text-[var(--platform-muted)] uppercase">
                        {layer.type === "text" ? layer.id : "CTA"}
                      </label>
                      <input
                        type="text"
                        value={getLayerContent(layer)}
                        onChange={(e) => setLayerContent(layer.id, e.target.value)}
                        onFocus={() => setEditingLayerId(layer.id)}
                        className="mt-1 w-full rounded-lg border border-[var(--platform-border)] px-2.5 py-1.5 text-xs focus:outline-none focus:border-[var(--platform-accent)]"
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* Palette */}
            <div>
              <p className="text-[10px] font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-2">
                Palette {activeBrand}
              </p>
              <div className="flex gap-2 flex-wrap">
                {[tokens.backgroundColor, tokens.accentColor, tokens.h1Color, tokens.ctaBg].map((c, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-7 h-7 rounded-full border border-[var(--platform-border)]" style={{ backgroundColor: c }} />
                    <span className="text-[8px] text-[var(--platform-muted)]">{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Knight assets (belairdirect only) */}
            {activeBrand === "belairdirect" && (
              <div>
                <p className="text-[10px] font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-2">
                  Petit Chevalier
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {KNIGHT_ASSETS.map((asset) => {
                    const imageLayer = template.layers.find((l) => l.type === "image" && l.id === "mascot");
                    const isActive = imageLayer?.type === "image" && imageLayer.src === asset.src;
                    return (
                      <button
                        key={asset.id}
                        onClick={() => {
                          // Update the mascot image in the current template
                          if (aiTemplate) {
                            setAiTemplate({
                              ...aiTemplate,
                              layers: aiTemplate.layers.map((l) =>
                                l.id === "mascot" && l.type === "image"
                                  ? { ...l, src: asset.src, placeholder: asset.label }
                                  : l
                              ),
                            });
                          }
                        }}
                        className="rounded-lg border-2 overflow-hidden aspect-square transition-all hover:shadow-sm"
                        style={{
                          borderColor: isActive ? "var(--platform-accent)" : "var(--platform-border)",
                        }}
                        title={asset.label}
                      >
                        <img src={asset.src} alt={asset.label} className="w-full h-full object-contain p-0.5" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA styles */}
            <div>
              <p className="text-[10px] font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-2">
                Style CTA
              </p>
              <div className="flex gap-2">
                <div
                  className="rounded-full px-3 py-1.5 text-[10px] font-medium"
                  style={{ backgroundColor: tokens.ctaBg, color: tokens.ctaText }}
                >
                  Primary
                </div>
                <div className="rounded-full px-3 py-1.5 text-[10px] font-medium border border-current" style={{ color: tokens.h1Color }}>
                  Secondary
                </div>
              </div>
            </div>

            {/* Layers list */}
            <div>
              <p className="text-[10px] font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-2">
                Layers ({template.layers.length})
              </p>
              <div className="space-y-1">
                {template.layers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setEditingLayerId(layer.id)}
                    className="w-full flex items-center gap-2 rounded px-2 py-1.5 text-left transition-colors hover:bg-[var(--platform-sand)]"
                    style={{
                      backgroundColor: editingLayerId === layer.id ? "var(--platform-sand)" : "transparent",
                    }}
                  >
                    <span className="text-[10px]">
                      {layer.type === "text" ? "T" : layer.type === "cta" ? "▣" : layer.type === "image" ? "◻" : "◆"}
                    </span>
                    <span className="text-[10px] font-medium truncate">
                      {layer.type === "logo" ? "Logo" : layer.type === "image" ? layer.placeholder : layer.id}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AgentToggle
        mode="template"
        currentTemplateJson={currentTemplateJson}
      />
    </div>
  );
}
