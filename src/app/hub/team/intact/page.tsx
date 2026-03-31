import { NavBar } from "@/components/layout/NavBar";

const INTACT_TEMPLATES = [
  { name: "Banner habitation — 728x90", format: "Banner", updated: "Hier" },
  { name: "Story Instagram — Famille", format: "Social", updated: "Il y a 2 jours" },
  { name: "Email — Renouvellement auto", format: "Email", updated: "Il y a 3 jours" },
  { name: "Post LinkedIn — Olympiques", format: "Social", updated: "Il y a 5 jours" },
  { name: "Landing page — Assurance vie", format: "Web", updated: "La semaine dernière" },
  { name: "Banner — Campagne Q2", format: "Banner", updated: "La semaine dernière" },
];

const RECENT_CONVERSATIONS = [
  { title: "Copy campagne habitation Q2", time: "Aujourd'hui" },
  { title: "Adaptation FR headline olympique", time: "Hier" },
  { title: "Ton de voix — email renouvellement", time: "Il y a 3 jours" },
];

const GUIDELINES = [
  { label: "Intact Red", value: "#DF0030", type: "color" as const },
  { label: "Soothing Sand", value: "#F7F2EA", type: "color" as const },
  { label: "Rich Black", value: "#000000", type: "color" as const },
  { label: "Intact Serif", value: "Titres", type: "font" as const },
  { label: "Intact Sans", value: "Body", type: "font" as const },
];

export default function IntactTeamPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--platform-sand)" }}>
      <NavBar />

      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar — Agent + Guidelines */}
          <div className="col-span-1 space-y-4">
            {/* Agent card */}
            <div className="rounded-xl bg-white border border-[var(--platform-border)] overflow-hidden">
              <div className="p-5" style={{ backgroundColor: "#F7F2EA" }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#DF0030] flex items-center justify-center text-white text-lg font-bold">
                    M
                  </div>
                  <div>
                    <h3 className="font-semibold">Mia</h3>
                    <p className="text-xs text-[var(--platform-muted)]">Agent IA — Intact Brand</p>
                  </div>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-black/70">
                  Je connais la voix Intact en profondeur. Ton chaleureux, sophistiqué, émotionnel — je vous aide à rester on-brand à chaque création.
                </p>
              </div>

              <div className="p-4 border-t border-[var(--platform-border)]">
                <p className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-3">
                  Conversations récentes
                </p>
                <div className="space-y-2">
                  {RECENT_CONVERSATIONS.map((c, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <p className="text-xs font-medium truncate">{c.title}</p>
                      <p className="text-[10px] text-[var(--platform-muted)] shrink-0 ml-2">{c.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Guidelines quick ref */}
            <div className="rounded-xl bg-white border border-[var(--platform-border)] p-4">
              <p className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-3">
                Palette Intact
              </p>
              <div className="space-y-2">
                {GUIDELINES.map((g) => (
                  <div key={g.label} className="flex items-center gap-3">
                    {g.type === "color" ? (
                      <div
                        className="w-6 h-6 rounded-md border border-[var(--platform-border)]"
                        style={{ backgroundColor: g.value }}
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-md bg-[var(--platform-sand)] flex items-center justify-center text-[9px] font-bold">
                        Aa
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium">{g.label}</p>
                      <p className="text-[10px] text-[var(--platform-muted)]">{g.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--platform-border)]">
                <p className="text-xs text-[var(--platform-muted)] leading-relaxed">
                  Les brackets rouges <span className="text-[#DF0030] font-bold">[ ]</span> sont le device de marque central. Toujours en Intact Red.
                </p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="col-span-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold tracking-tight">Intact Brand</h1>
                  <span className="text-xs font-medium text-[#DF0030] bg-[#FEF2F4] rounded-full px-2.5 py-0.5">
                    Mia Chen, Lead
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--platform-muted)]">
                  3 membres · 24 templates · Score conformité 96%
                </p>
              </div>
              <button
                className="rounded-full px-5 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: "#DF0030" }}
              >
                Nouveau template
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl bg-white border border-[var(--platform-border)] p-4">
                <p className="text-2xl font-bold">54</p>
                <p className="text-xs text-[var(--platform-muted)]">Assets ce mois</p>
              </div>
              <div className="rounded-xl bg-white border border-[var(--platform-border)] p-4">
                <p className="text-2xl font-bold">96%</p>
                <p className="text-xs text-[var(--platform-muted)]">Conformité marque</p>
              </div>
              <div className="rounded-xl bg-white border border-[var(--platform-border)] p-4">
                <p className="text-2xl font-bold">2.4h</p>
                <p className="text-xs text-[var(--platform-muted)]">Temps moyen / asset</p>
              </div>
            </div>

            {/* Templates library */}
            <div>
              <h2 className="text-sm font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-4">
                Bibliothèque de templates
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {INTACT_TEMPLATES.map((t, i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-white border border-[var(--platform-border)] overflow-hidden transition-all duration-200 hover:shadow-md hover:border-[var(--platform-muted)]"
                  >
                    {/* Preview */}
                    <div className="aspect-[16/10] bg-[#F7F2EA] flex items-center justify-center relative">
                      <div className="text-center px-4">
                        <p className="text-[#DF0030] font-bold text-lg" style={{ fontFamily: "Georgia, serif" }}>
                          <span className="text-[#DF0030]">[</span> Intact <span className="text-[#DF0030]">]</span>
                        </p>
                        <p className="text-[10px] text-black/60 mt-1">{t.format}</p>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium truncate">{t.name}</p>
                      <p className="text-xs text-[var(--platform-muted)]">Modifié {t.updated}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="mt-8 rounded-xl border border-dashed border-[var(--platform-border)] bg-white/50 p-5 text-center">
              <p className="text-sm text-[var(--platform-muted)]">
                Chaque équipe a sa propre page avec son propre agent AI et ses outils de marque.
              </p>
              <p className="text-xs text-[var(--platform-muted)] mt-1">
                belairdirect (Fred) · Sponsorship (Martine) · Acquisition (Solène)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
