import { NavBar } from "@/components/layout/NavBar";

const MICRO_APPS = [
  {
    icon: "🎬",
    name: "SVG Animator",
    description: "Animez vos SVGs avec des prompts AI. Transitions, entrées, boucles — exportables en format optimisé.",
    status: "active" as const,
  },
  {
    icon: "🛡️",
    name: "Chevalier Generator",
    description: "Générez des poses et scènes du Petit Chevalier pour belairdirect. Scénarios saisonniers, accessoires, décors.",
    status: "active" as const,
  },
  {
    icon: "🧪",
    name: "A/B Factory",
    description: "Créez des variantes A/B à partir d'un seul template. Comparez headlines, visuels et CTAs côte à côte.",
    status: "active" as const,
  },
  {
    icon: "🔍",
    name: "Brand Checker",
    description: "Validez vos assets contre les guidelines de marque. Couleurs, typo, ton de voix — détection instantanée.",
    status: "active" as const,
  },
  {
    icon: "📋",
    name: "Brief Creator",
    description: "Générez des briefs créatifs structurés à partir d'une conversation avec l'agent AI.",
    status: "active" as const,
  },
  {
    icon: "🖼️",
    name: "Image Gen",
    description: "Génération d'images AI on-brand. Respecte automatiquement les guidelines photo de chaque marque.",
    status: "coming" as const,
  },
  {
    icon: "🌐",
    name: "Traducteur Brand-Aware",
    description: "Traduction FR/EN qui préserve le ton de marque. Pas juste les mots — la voix.",
    status: "coming" as const,
  },
  {
    icon: "📊",
    name: "Campaign Planner",
    description: "Planification de campagnes multicanal avec suggestions de formats et de calendrier.",
    status: "coming" as const,
  },
];

export default function MicroAppsPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--platform-sand)" }}>
      <NavBar />

      <div className="mx-auto max-w-[1280px] px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Micro-apps</h1>
          <p className="mt-1 text-sm text-[var(--platform-muted)]">
            Outils spécialisés pour chaque besoin créatif de l&apos;équipe.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {MICRO_APPS.map((app) => (
            <div
              key={app.name}
              className="group rounded-xl bg-white border border-[var(--platform-border)] overflow-hidden transition-all duration-200 hover:shadow-md hover:border-[var(--platform-muted)]"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{app.icon}</span>
                  {app.status === "coming" && (
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--platform-muted)] border border-[var(--platform-border)] rounded-full px-2.5 py-0.5">
                      À venir
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-base font-semibold">{app.name}</h3>
                <p className="mt-2 text-sm text-[var(--platform-muted)] leading-relaxed">
                  {app.description}
                </p>
              </div>

              <div className="px-6 py-3.5 border-t border-[var(--platform-border)]">
                {app.status === "active" ? (
                  <button className="text-sm font-medium flex items-center gap-1.5 transition-colors" style={{ color: "var(--platform-accent)" }}>
                    Ouvrir
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                ) : (
                  <span className="text-sm text-[var(--platform-muted)]">
                    Disponible bientôt
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
