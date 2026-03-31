import { NavBar } from "@/components/layout/NavBar";
import Link from "next/link";

const QUICK_TOOLS = [
  { icon: "📐", label: "Template Editor", description: "Créer et éditer des templates on-brand", href: "/hub/templates" },
  { icon: "🔍", label: "Brand Checker", description: "Valider la conformité de vos assets", href: "/hub/micro-apps" },
  { icon: "✍️", label: "AI Agent", description: "Rédaction assistée par l'intelligence artificielle", href: "/" },
  { icon: "🧩", label: "Micro-apps", description: "Outils spécialisés pour chaque besoin", href: "/hub/micro-apps" },
];

const RECENT_ACTIVITY = [
  { asset: "Campagne Habitation Q2 — Banner 728x90", brand: "intact", user: "Sarah M.", time: "Il y a 12 min" },
  { asset: "Story Instagram — Promo automerit", brand: "belairdirect", user: "Marc-André L.", time: "Il y a 45 min" },
  { asset: "Email — Renouvellement auto", brand: "intact", user: "Julie P.", time: "Il y a 1h" },
  { asset: "Post LinkedIn — Chevalier été", brand: "belairdirect", user: "Dominique R.", time: "Il y a 2h" },
  { asset: "Landing page — Assurance locataire", brand: "intact", user: "Sarah M.", time: "Il y a 3h" },
];

const TEAMS = [
  { name: "Intact Brand", agent: "Mia", lead: "Mia Chen", color: "#DF0030", bg: "#F7F2EA", members: 3, templates: 24 },
  { name: "belairdirect", agent: "Fred", lead: "Fred Lavoie", color: "#0F68D8", bg: "#F5F8FA", members: 2, templates: 18 },
  { name: "Sponsorship", agent: "Martine", lead: "Martine Dubois", color: "#2D716F", bg: "#F0FAF8", members: 1, templates: 8 },
  { name: "Acquisition", agent: "Solène", lead: "Solène Roy", color: "#7E6484", bg: "#F8F4FA", members: 2, templates: 12 },
];

export default function HubDashboard() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--platform-sand)" }}>
      <NavBar />

      <div className="mx-auto max-w-[1280px] px-6 py-8">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Bonjour, <span style={{ color: "var(--platform-accent)" }}>Guillaume</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--platform-muted)]">
            Creative & Brand Studio — 4 équipes, 2 marques, 1 plateforme.
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard value="147" label="Assets créés ce mois" trend="+12%" />
          <StatCard value="94%" label="Score conformité marque" trend="+3%" />
          <StatCard value="62" label="Templates actifs" trend="+5" />
        </div>

        {/* Quick tools */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-4">
            Accès rapide
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {QUICK_TOOLS.map((tool) => (
              <Link
                key={tool.label}
                href={tool.href}
                className="group rounded-xl bg-white border border-[var(--platform-border)] p-5 transition-all duration-200 hover:shadow-md hover:border-[var(--platform-muted)]"
              >
                <span className="text-2xl">{tool.icon}</span>
                <h3 className="mt-3 text-sm font-semibold">{tool.label}</h3>
                <p className="mt-1 text-xs text-[var(--platform-muted)] leading-relaxed">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Activity feed */}
          <div className="col-span-2">
            <h2 className="text-sm font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-4">
              Activité récente
            </h2>
            <div className="rounded-xl bg-white border border-[var(--platform-border)] divide-y divide-[var(--platform-border)]">
              {RECENT_ACTIVITY.map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.brand === "intact" ? "#DF0030" : "#0F68D8" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.asset}</p>
                    <p className="text-xs text-[var(--platform-muted)]">
                      {item.user} · {item.time}
                    </p>
                  </div>
                  <span className="text-xs text-[var(--platform-muted)] shrink-0">
                    {item.brand === "intact" ? "Intact" : "belairdirect"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Teams */}
          <div>
            <h2 className="text-sm font-semibold text-[var(--platform-muted)] uppercase tracking-wider mb-4">
              Équipes
            </h2>
            <div className="space-y-3">
              {TEAMS.map((team) => (
                <Link
                  key={team.name}
                  href={team.name === "Intact Brand" ? "/hub/team/intact" : "#"}
                  className="block rounded-xl bg-white border border-[var(--platform-border)] p-4 transition-all duration-200 hover:shadow-sm hover:border-[var(--platform-muted)]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: team.color }}
                    >
                      {team.agent[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{team.name}</p>
                      <p className="text-xs text-[var(--platform-muted)]">
                        {team.lead} · {team.members} membres
                      </p>
                    </div>
                    <span className="text-xs text-[var(--platform-muted)]">
                      {team.templates} templates
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, trend }: { value: string; label: string; trend: string }) {
  return (
    <div className="rounded-xl bg-white border border-[var(--platform-border)] p-5">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight">{value}</span>
        <span className="text-xs font-medium text-green-600">{trend}</span>
      </div>
      <p className="mt-1 text-xs text-[var(--platform-muted)]">{label}</p>
    </div>
  );
}
