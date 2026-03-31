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
  const [customWidth, setCustomWidth] = useState<number | null>(null);
  const [customHeight, setCustomHeight] = useState<number | null>(null);
  const [lockAspect, setLockAspect] = useState(true);
  const [dragging, setDragging] = useState<{ layerId: string; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const [resizing, setResizing] = useState<{ layerId: string; startX: number; startY: number; origW: number; origH: number; origLX: number; origLY: number } | null>(null);
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

  const canvasW = customWidth || format.width;
  const canvasH = customHeight || format.height;
  const maxPreviewW = 600;
  const maxPreviewH = 650;
  const scaleX = maxPreviewW / canvasW;
  const scaleY = maxPreviewH / canvasH;
  const scale = Math.min(scaleX, scaleY);

  const currentTemplateJson = useMemo(
    () => JSON.stringify(template, null, 2),
    [template]
  );

  const updateLayerProps = useCallback((layerId: string, props: Record<string, number>) => {
    const base = aiTemplate || { ...TEMPLATES.find((t) => t.id === selectedId)! };
    setAiTemplate({
      ...base,
      layers: base.layers.map((l) => (l.id === layerId ? { ...l, ...props } : l)),
    });
  }, [aiTemplate, selectedId]);

  // Mouse move handler for drag & resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        const dx = (e.clientX - dragging.startX) / scale;
        const dy = (e.clientY - dragging.startY) / scale;
        updateLayerProps(dragging.layerId, {
          x: Math.round(dragging.origX + dx),
          y: Math.round(dragging.origY + dy),
        });
      }
      if (resizing) {
        const dx = (e.clientX - resizing.startX) / scale;
        const dy = (e.clientY - resizing.startY) / scale;
        const newW = Math.max(40, Math.round(resizing.origW + dx));
        const newH = Math.max(40, Math.round(resizing.origH + dy));
        updateLayerProps(resizing.layerId, { width: newW, height: newH });
      }
    };
    const handleMouseUp = () => {
      setDragging(null);
      setResizing(null);
    };
    if (dragging || resizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [dragging, resizing, scale, updateLayerProps]);

  const startDrag = (e: React.MouseEvent, layer: Layer) => {
    e.stopPropagation();
    setEditingLayerId(layer.id);
    setDragging({ layerId: layer.id, startX: e.clientX, startY: e.clientY, origX: layer.x, origY: layer.y });
  };

  const startResize = (e: React.MouseEvent, layer: Layer) => {
    e.stopPropagation();
    const w = "width" in layer ? (layer as { width: number }).width : 200;
    const h = "height" in layer ? (layer as { height: number }).height : 200;
    setResizing({ layerId: layer.id, startX: e.clientX, startY: e.clientY, origW: w, origH: h, origLX: layer.x, origLY: layer.y });
  };

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
                onChange={(e) => {
                  setActiveFormat(e.target.value as FormatKey);
                  setCustomWidth(null);
                  setCustomHeight(null);
                }}
                className="text-xs border border-[var(--platform-border)] rounded-lg px-2.5 py-1.5 bg-white"
              >
                {Object.entries(FORMAT_DIMENSIONS).map(([key, f]) => (
                  <option key={key} value={key}>{f.label}</option>
                ))}
              </select>

              {/* Custom size */}
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={customWidth || format.width}
                  onChange={(e) => {
                    const w = parseInt(e.target.value) || format.width;
                    setCustomWidth(w);
                    if (lockAspect) {
                      const ratio = (customHeight || format.height) / (customWidth || format.width);
                      setCustomHeight(Math.round(w * ratio));
                    }
                  }}
                  className="w-16 text-xs border border-[var(--platform-border)] rounded-lg px-2 py-1.5 text-center bg-white"
                />
                <button
                  onClick={() => setLockAspect(!lockAspect)}
                  className="p-1 rounded transition-colors"
                  style={{ color: lockAspect ? "var(--platform-accent)" : "var(--platform-muted)" }}
                  title={lockAspect ? "Aspect ratio verrouillé" : "Aspect ratio libre"}
                >
                  {lockAspect ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="3" y="6" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M5 6V4.5C5 3.12 6.12 2 7.5 2V2C8.88 2 10 3.12 10 4.5V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <rect x="3" y="6" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M5 6V4.5C5 3.12 6.12 2 7.5 2V2C8.88 2 10 3.12 10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
                <input
                  type="number"
                  value={customHeight || format.height}
                  onChange={(e) => {
                    const h = parseInt(e.target.value) || format.height;
                    setCustomHeight(h);
                    if (lockAspect) {
                      const ratio = (customWidth || format.width) / (customHeight || format.height);
                      setCustomWidth(Math.round(h * ratio));
                    }
                  }}
                  className="w-16 text-xs border border-[var(--platform-border)] rounded-lg px-2 py-1.5 text-center bg-white"
                />
              </div>
            </div>

            <button className="flex items-center gap-1.5 rounded-full border border-[var(--platform-border)] px-3 py-1.5 text-xs font-medium hover:border-[var(--platform-muted)]">
              ✨ AI Assist
            </button>
          </div>

          {/* Canvas area */}
          <div className="flex-1 flex items-start justify-center p-6 pt-8 overflow-auto" onClick={() => setEditingLayerId(null)}>
            <div
              ref={canvasRef}
              className="relative shadow-xl rounded-lg overflow-hidden transition-all duration-500"
              style={{
                width: canvasW * scale,
                height: canvasH * scale,
                backgroundColor: activeBrand === template.brand ? template.backgroundColor : tokens.backgroundColor,
              }}
            >
              {template.layers.map((layer) => {
                const layerStyle = getLayerStyle(layer);

                if (layer.type === "text") {
                  const isEditing = editingLayerId === layer.id;
                  const isSelected = editingLayerId === layer.id;
                  const content = getLayerContent(layer);
                  return (
                    <div
                      key={layer.id}
                      className="absolute group"
                      style={{
                        left: layer.x * scale,
                        top: layer.y * scale,
                        cursor: dragging?.layerId === layer.id ? "grabbing" : "grab",
                      }}
                      onMouseDown={(e) => {
                        if (!(e.target as HTMLElement).getAttribute("contenteditable")) {
                          startDrag(e, layer);
                        }
                      }}
                    >
                      <div
                        className="transition-colors duration-300"
                        style={{
                          maxWidth: layer.maxWidth ? layer.maxWidth * scale : undefined,
                          fontSize: layer.fontSize * scale,
                          fontWeight: layer.fontWeight,
                          fontFamily: (layerStyle as { fontFamily?: string }).fontFamily || layer.fontFamily,
                          color: (layerStyle as { color?: string }).color || layer.color,
                          lineHeight: layer.lineHeight || 1.3,
                          whiteSpace: "pre-wrap",
                          outline: isSelected ? "2px solid rgba(255,255,255,0.6)" : "2px solid transparent",
                          outlineOffset: "2px",
                          borderRadius: "2px",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingLayerId(layer.id);
                        }}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setEditingLayerId(layer.id);
                          (e.currentTarget as HTMLElement).contentEditable = "true";
                          (e.currentTarget as HTMLElement).focus();
                        }}
                        contentEditable={isEditing}
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          setLayerContent(layer.id, e.currentTarget.textContent || "");
                          (e.currentTarget as HTMLElement).contentEditable = "false";
                        }}
                        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, "<br>") }}
                      />
                    </div>
                  );
                }

                if (layer.type === "image") {
                  const isSelected = editingLayerId === layer.id;
                  return (
                    <div
                      key={layer.id}
                      className="absolute"
                      style={{
                        left: layer.x * scale,
                        top: layer.y * scale,
                        width: layer.width * scale,
                        height: layer.height * scale,
                        cursor: dragging?.layerId === layer.id ? "grabbing" : "grab",
                      }}
                      onMouseDown={(e) => startDrag(e, layer)}
                    >
                      {layer.src ? (
                        <img
                          src={layer.src}
                          alt={layer.placeholder}
                          className="w-full h-full object-contain pointer-events-none select-none"
                          draggable={false}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: layer.bgColor || "rgba(255,255,255,0.1)" }}>
                          <span style={{ fontSize: 14 * scale, opacity: 0.6 }}>{layer.placeholder}</span>
                        </div>
                      )}
                      {/* Selection outline + resize handle */}
                      {isSelected && (
                        <>
                          <div className="absolute inset-0 border-2 border-white/60 rounded pointer-events-none" />
                          <div
                            className="absolute -right-1.5 -bottom-1.5 w-3.5 h-3.5 bg-white border-2 rounded-sm cursor-se-resize"
                            style={{ borderColor: "var(--platform-accent)" }}
                            onMouseDown={(e) => { e.stopPropagation(); startResize(e, layer); }}
                          />
                          <div
                            className="absolute -left-1.5 -top-1.5 w-3.5 h-3.5 bg-white border-2 rounded-sm cursor-nw-resize opacity-50"
                            style={{ borderColor: "var(--platform-accent)" }}
                          />
                          <div
                            className="absolute -right-1.5 -top-1.5 w-3.5 h-3.5 bg-white border-2 rounded-sm cursor-ne-resize opacity-50"
                            style={{ borderColor: "var(--platform-accent)" }}
                          />
                          <div
                            className="absolute -left-1.5 -bottom-1.5 w-3.5 h-3.5 bg-white border-2 rounded-sm cursor-sw-resize opacity-50"
                            style={{ borderColor: "var(--platform-accent)" }}
                          />
                        </>
                      )}
                    </div>
                  );
                }

                if (layer.type === "cta") {
                  const ctaStyle = layerStyle as { bgColor?: string; textColor?: string; borderRadius?: number };
                  const isSelected = editingLayerId === layer.id;
                  return (
                    <div
                      key={layer.id}
                      className="absolute transition-all duration-300"
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
                        outline: isSelected ? "2px solid rgba(255,255,255,0.6)" : "none",
                        outlineOffset: "3px",
                        cursor: dragging?.layerId === layer.id ? "grabbing" : "grab",
                      }}
                      onMouseDown={(e) => startDrag(e, layer)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingLayerId(layer.id);
                        (e.currentTarget as HTMLElement).contentEditable = "true";
                        (e.currentTarget as HTMLElement).focus();
                      }}
                      contentEditable={false}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        setLayerContent(layer.id, e.currentTarget.textContent || "");
                        (e.currentTarget as HTMLElement).contentEditable = "false";
                      }}
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
                        cursor: dragging?.layerId === layer.id ? "grabbing" : "grab",
                        outline: editingLayerId === layer.id ? "2px solid rgba(255,255,255,0.6)" : "none",
                        outlineOffset: "3px",
                      }}
                      onMouseDown={(e) => startDrag(e, layer)}
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
                          if (aiTemplate) {
                            setAiTemplate({
                              ...aiTemplate,
                              layers: aiTemplate.layers.map((l) =>
                                l.id === "mascot" && l.type === "image"
                                  ? { ...l, src: asset.src, placeholder: asset.label }
                                  : l
                              ),
                            });
                          } else {
                            // For predefined templates, wrap in aiTemplate to make it editable
                            const current = TEMPLATES.find((t) => t.id === selectedId)!;
                            setAiTemplate({
                              ...current,
                              layers: current.layers.map((l) =>
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

            {/* Position & size (selected layer) */}
            {editingLayerId && (() => {
              const layer = template.layers.find((l) => l.id === editingLayerId);
              if (!layer) return null;
              const updateLayer = (props: Record<string, number>) => {
                const t = aiTemplate || { ...TEMPLATES.find((t) => t.id === selectedId)! };
                setAiTemplate({
                  ...t,
                  layers: t.layers.map((l) =>
                    l.id === editingLayerId ? { ...l, ...props } : l
                  ),
                });
              };
              return (
                <div>
                  <p className="text-[10px] font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-2">
                    Position — {editingLayerId}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-[var(--platform-muted)]">X</label>
                      <input type="number" value={layer.x} onChange={(e) => updateLayer({ x: +e.target.value })} className="w-full rounded border border-[var(--platform-border)] px-2 py-1 text-xs" />
                    </div>
                    <div>
                      <label className="text-[9px] text-[var(--platform-muted)]">Y</label>
                      <input type="number" value={layer.y} onChange={(e) => updateLayer({ y: +e.target.value })} className="w-full rounded border border-[var(--platform-border)] px-2 py-1 text-xs" />
                    </div>
                    {"width" in layer && (
                      <div>
                        <label className="text-[9px] text-[var(--platform-muted)]">W</label>
                        <input type="number" value={(layer as { width: number }).width} onChange={(e) => updateLayer({ width: +e.target.value })} className="w-full rounded border border-[var(--platform-border)] px-2 py-1 text-xs" />
                      </div>
                    )}
                    {"height" in layer && (
                      <div>
                        <label className="text-[9px] text-[var(--platform-muted)]">H</label>
                        <input type="number" value={(layer as { height: number }).height} onChange={(e) => updateLayer({ height: +e.target.value })} className="w-full rounded border border-[var(--platform-border)] px-2 py-1 text-xs" />
                      </div>
                    )}
                    <div>
                      <label className="text-[9px] text-[var(--platform-muted)]">Font</label>
                      <input type="number" value={layer.type === "text" ? layer.fontSize : layer.type === "cta" ? layer.fontSize : 0} onChange={(e) => updateLayer({ fontSize: +e.target.value })} className="w-full rounded border border-[var(--platform-border)] px-2 py-1 text-xs" />
                    </div>
                  </div>
                </div>
              );
            })()}

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
