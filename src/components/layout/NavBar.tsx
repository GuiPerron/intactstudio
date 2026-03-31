"use client";

export function NavBar() {
  return (
    <nav className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="bg-white border-b border-[var(--platform-border)]">
        <div className="mx-auto max-w-[1280px] px-6 py-2 flex items-center justify-between">
          <span className="text-xs text-[var(--platform-muted)] tracking-wide">
            Intact Financial Corporation — Creative & Brand Studio
          </span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[var(--platform-muted)]">
              Prototype v1
            </span>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white border-b border-[var(--platform-border)]">
        <div className="mx-auto max-w-[1280px] px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">
              Studio
            </span>
            <span
              className="text-xl font-light tracking-tight"
              style={{ color: "var(--platform-accent)" }}
            >
              AI
            </span>
          </div>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-8">
            <span className="text-sm font-medium text-[var(--platform-text)] border-b-2 border-[var(--platform-accent)] pb-0.5">
              Brainstorm
            </span>
            <span className="text-sm text-[var(--platform-muted)] hover:text-[var(--platform-text)] transition-colors cursor-default opacity-40">
              Hub Studio
            </span>
            <span className="text-sm text-[var(--platform-muted)] hover:text-[var(--platform-text)] transition-colors cursor-default opacity-40">
              Templates
            </span>
            <span className="text-sm text-[var(--platform-muted)] hover:text-[var(--platform-text)] transition-colors cursor-default opacity-40">
              Micro-apps
            </span>
          </div>

          {/* CTA */}
          <button
            className="rounded-full px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: "var(--platform-accent)" }}
          >
            Demander une démo
          </button>
        </div>
      </div>
    </nav>
  );
}
