"use client";

import { useState } from "react";
import { SessionData } from "@/lib/brainstorm/types";

interface SessionSummaryProps {
  data: SessionData;
}

function buildMarkdown(data: SessionData): string {
  const date = new Date().toLocaleDateString("fr-CA");

  let md = `# Studio AI — Résumé de session Brainstorm\n`;
  md += `**Date :** ${date}\n\n`;
  md += `---\n\n`;

  // Priorities
  if (data.priorities.length) {
    md += `## Priorités (classées)\n\n`;
    data.priorities.forEach((p, i) => {
      md += `${i + 1}. ${p}\n`;
    });
    md += `\n`;
  }

  // Features
  if (data.features.length) {
    md += `## Features proposées\n\n`;
    data.features.forEach((f) => {
      md += `- ${f.icon} **${f.title}**\n`;
    });
    md += `\n`;
  }

  // Notes from conversation
  if (data.freeNotes.length) {
    md += `## Échanges clés de la session\n\n`;
    data.freeNotes.forEach((n) => {
      md += `- ${n}\n`;
    });
    md += `\n`;
  }

  md += `---\n\n`;
  md += `_Généré par Studio AI — Plateforme créative Intact Financial Corporation_\n`;

  return md;
}

export function SessionSummary({ data }: SessionSummaryProps) {
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  const handleExport = () => {
    const date = new Date().toLocaleDateString("fr-CA");
    const md = buildMarkdown(data);
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `studio-ai-brainstorm-${date}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleEmail = async () => {
    setEmailStatus("sending");
    try {
      const date = new Date().toLocaleDateString("fr-CA");
      const md = buildMarkdown(data);

      const response = await fetch("/api/send-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: md, date }),
      });

      if (!response.ok) throw new Error("Failed");
      setEmailStatus("sent");
    } catch {
      setEmailStatus("error");
      setTimeout(() => setEmailStatus("idle"), 3000);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="rounded-xl bg-white border border-[var(--platform-border)] overflow-hidden shadow-sm">
        {/* Header */}
        <div
          className="px-6 py-4 border-b border-[var(--platform-border)]"
          style={{ backgroundColor: "var(--platform-sand)" }}
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-base font-semibold">
                Résumé de la session
              </h3>
              <p className="text-xs text-[var(--platform-muted)] mt-0.5">
                {new Date().toLocaleDateString("fr-CA", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Export button */}
              <button
                onClick={handleExport}
                className="flex items-center gap-2 rounded-full border border-[var(--platform-border)] bg-white px-4 py-2 text-sm font-medium transition-all duration-200 hover:border-[var(--platform-muted)] hover:shadow-sm"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path
                    d="M7 2V9M7 9L4 6M7 9L10 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 11H12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                Télécharger
              </button>

              {/* Email button */}
              <button
                onClick={handleEmail}
                disabled={emailStatus === "sending" || emailStatus === "sent"}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: emailStatus === "sent" ? "#009460" : "var(--platform-accent)" }}
              >
                {emailStatus === "idle" && (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <rect
                        x="1"
                        y="3"
                        width="12"
                        height="8"
                        rx="1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M1 4.5L7 8L13 4.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Envoyer par email
                  </>
                )}
                {emailStatus === "sending" && "Envoi en cours..."}
                {emailStatus === "sent" && (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M3 7L6 10L11 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Envoyé!
                  </>
                )}
                {emailStatus === "error" && "Erreur — réessayer"}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
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
                      style={{
                        backgroundColor: "var(--platform-accent)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium">{p}</span>
                    {i < data.priorities.length - 1 && (
                      <span className="text-[var(--platform-border)] mx-1">
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {data.features.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-3">
                Features proposées
              </h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {data.features.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-3 rounded-lg border border-[var(--platform-border)] p-3"
                  >
                    <span className="text-lg">{f.icon}</span>
                    <p className="text-sm font-medium">{f.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {data.freeNotes.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-3">
                Échanges clés
              </h4>
              <div className="space-y-1.5">
                {data.freeNotes.slice(0, 8).map((note, i) => (
                  <p
                    key={i}
                    className="text-sm text-[var(--platform-muted)] truncate"
                  >
                    • {note}
                  </p>
                ))}
                {data.freeNotes.length > 8 && (
                  <p className="text-xs text-[var(--platform-muted)]">
                    +{data.freeNotes.length - 8} autres échanges
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
