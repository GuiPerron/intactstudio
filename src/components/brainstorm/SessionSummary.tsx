"use client";

import { SessionData } from "@/lib/brainstorm/types";

interface SessionSummaryProps {
  data: SessionData;
}

export function SessionSummary({ data }: SessionSummaryProps) {
  const handleExport = () => {
    const date = new Date().toLocaleDateString("fr-CA");
    const reactionLabels: Record<string, string> = {
      love: "🔥 J'adore",
      like: "👍 Intéressant",
      neutral: "🤔 À voir",
      skip: "⏭️ Pas prioritaire",
    };
    const severityLabels: Record<string, string> = {
      high: "🔴 Élevée",
      medium: "🟡 Moyenne",
      low: "🟢 Faible",
    };

    let md = `# Studio AI — Résumé de session Brainstorm\n`;
    md += `**Date :** ${date}\n\n`;
    md += `---\n\n`;

    // Pain points
    md += `## Pain Points identifiés\n\n`;
    const selectedPains = data.painPoints.filter((p) => p.selected);
    if (selectedPains.length) {
      selectedPains.forEach((p) => {
        md += `- **${p.label}** — Sévérité : ${severityLabels[p.severity] || p.severity}\n`;
      });
    } else {
      md += `_Aucun pain point identifié_\n`;
    }
    md += `\n`;

    // Features
    md += `## Features évaluées\n\n`;
    md += `| Feature | Réaction |\n|---------|----------|\n`;
    data.features.forEach((f) => {
      md += `| ${f.icon} ${f.title} | ${f.reaction ? reactionLabels[f.reaction] : "—"} |\n`;
    });
    md += `\n`;

    // Priorities
    if (data.priorities.length) {
      md += `## Priorités (classées)\n\n`;
      data.priorities.forEach((p, i) => {
        md += `${i + 1}. ${p}\n`;
      });
      md += `\n`;
    }

    // Notes
    if (data.freeNotes.length) {
      md += `## Notes et commentaires\n\n`;
      data.freeNotes.forEach((n) => {
        md += `- ${n}\n`;
      });
      md += `\n`;
    }

    md += `---\n\n`;
    md += `_Généré par Studio AI — Plateforme créative Intact Financial Corporation_\n`;

    // Download
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `studio-ai-brainstorm-${date}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedPains = data.painPoints.filter((p) => p.selected);
  const lovedFeatures = data.features.filter((f) => f.reaction === "love");
  const likedFeatures = data.features.filter((f) => f.reaction === "like");

  return (
    <div className="animate-fade-in-up">
      <div className="rounded-xl bg-white border border-[var(--platform-border)] overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--platform-border)]" style={{ backgroundColor: "var(--platform-sand)" }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Résumé de la session</h3>
              <p className="text-xs text-[var(--platform-muted)] mt-0.5">
                {new Date().toLocaleDateString("fr-CA", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: "var(--platform-accent)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 2V9M7 9L4 6M7 9L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 11H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Exporter (.md)
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Pain points */}
          {selectedPains.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-3">
                Pain Points identifiés
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedPains.map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border"
                    style={{
                      borderColor:
                        p.severity === "high"
                          ? "var(--platform-accent)"
                          : "var(--platform-border)",
                      backgroundColor:
                        p.severity === "high" ? "#FEF2F4" : "white",
                      color:
                        p.severity === "high"
                          ? "var(--platform-accent)"
                          : "var(--platform-text)",
                    }}
                  >
                    {p.severity === "high" && "🔴"}
                    {p.severity === "medium" && "🟡"}
                    {p.severity === "low" && "🟢"}
                    {p.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {(lovedFeatures.length > 0 || likedFeatures.length > 0) && (
            <div>
              <h4 className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-3">
                Features retenues
              </h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {[...lovedFeatures, ...likedFeatures].map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-3 rounded-lg border border-[var(--platform-border)] p-3"
                  >
                    <span className="text-lg">{f.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{f.title}</p>
                    </div>
                    <span className="text-xs">
                      {f.reaction === "love" ? "🔥" : "👍"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Priorities */}
          {data.priorities.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-3">
                Priorités
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                {data.priorities.map((p, i) => (
                  <div key={p} className="flex items-center gap-1.5">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ backgroundColor: "var(--platform-accent)" }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium">{p}</span>
                    {i < data.priorities.length - 1 && (
                      <span className="text-[var(--platform-border)] mx-1">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
