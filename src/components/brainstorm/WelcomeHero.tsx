"use client";

interface WelcomeHeroProps {
  onStart: () => void;
}

export function WelcomeHero({ onStart }: WelcomeHeroProps) {
  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <div className="max-w-[640px] text-center animate-fade-in-up">
        {/* Logo mark */}
        <div className="mx-auto mb-8 flex items-center justify-center gap-3">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-sm"
            style={{ backgroundColor: "var(--platform-accent)" }}
          >
            S
          </div>
        </div>

        <h1 className="text-4xl font-semibold tracking-tight leading-tight">
          Bienvenue dans{" "}
          <span style={{ color: "var(--platform-accent)" }}>Studio AI</span>
        </h1>

        <p className="mt-4 text-lg text-[var(--platform-muted)] leading-relaxed max-w-[480px] mx-auto">
          Votre partenaire créatif AI pour les marques Intact et belairdirect.
          Explorons ensemble ce que cette plateforme peut faire pour votre équipe.
        </p>

        {/* Feature hints */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-left">
          <FeatureCard
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 3L3 7L10 11L17 7L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M3 13L10 17L17 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 10L10 14L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
            title="Brand Intelligence"
            description="Connaissance profonde des deux systèmes de marque"
          />
          <FeatureCard
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="3" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 8H13M7 11H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
            title="Template Editor"
            description="Création de contenu on-brand en temps réel"
          />
          <FeatureCard
            icon={
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 7V10L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            }
            title="Micro-apps"
            description="Outils spécialisés pour chaque besoin créatif"
          />
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="mt-10 rounded-full px-8 py-3.5 text-base font-medium text-white transition-all duration-200 hover:opacity-90 hover:shadow-md"
          style={{ backgroundColor: "var(--platform-accent)" }}
        >
          Commencer le brainstorm
        </button>

        <p className="mt-4 text-xs text-[var(--platform-muted)]">
          L&apos;agent AI va guider la conversation et vous montrer les possibilités
        </p>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-white border border-[var(--platform-border)] p-4 shadow-sm">
      <div className="text-[var(--platform-text)] mb-2">{icon}</div>
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 text-xs text-[var(--platform-muted)] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
