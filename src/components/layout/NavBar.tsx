"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/" },
  { label: "Brainstorm", href: "/brainstorm" },
  { label: "Brief Creator", href: "/brief" },
  { label: "Templates", href: "/hub/templates" },
  { label: "Micro-apps", href: "/hub/micro-apps" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50">
      {/* Utility bar */}
      <div className="bg-white border-b border-[var(--platform-border)]">
        <div className="mx-auto max-w-[1280px] px-6 py-2 flex items-center justify-between">
          <span className="text-xs text-[var(--platform-muted)] tracking-wide">
            Intact Financial Corporation — Creative & Brand Studio
          </span>
          <span className="text-xs text-[var(--platform-muted)]">Prototype v1</span>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white border-b border-[var(--platform-border)]">
        <div className="mx-auto max-w-[1280px] px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">Studio</span>
            <span className="text-xl font-light tracking-tight" style={{ color: "var(--platform-accent)" }}>AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{
                    color: isActive ? "var(--platform-text)" : "var(--platform-muted)",
                    borderBottom: isActive ? "2px solid var(--platform-accent)" : "2px solid transparent",
                    paddingBottom: "2px",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <Link
            href="/brief"
            className="rounded-full px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:opacity-90"
            style={{ backgroundColor: "var(--platform-accent)" }}
          >
            Nouveau brief
          </Link>
        </div>
      </div>
    </nav>
  );
}
