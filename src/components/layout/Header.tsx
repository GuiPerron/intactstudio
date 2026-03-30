"use client";

import { BrandId, brands } from "@/lib/brand/config";

interface HeaderProps {
  activeBrand: BrandId;
  onBrandChange: (brand: BrandId) => void;
}

export function Header({ activeBrand, onBrandChange }: HeaderProps) {
  return (
    <header className="border-b border-[var(--platform-border)] bg-white">
      {/* Utility bar */}
      <div className="border-b border-[var(--platform-border)]">
        <div className="mx-auto max-w-7xl px-6 py-2 flex items-center justify-between">
          <span className="text-xs text-[var(--platform-muted)] tracking-wide">
            Creative & Brand Studio
          </span>
          <span className="text-xs text-[var(--platform-muted)]">
            Phase 1 — Vision Prototype
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight">
            Studio
          </span>
          <span
            className="text-lg font-light tracking-tight"
            style={{ color: "var(--platform-accent)" }}
          >
            AI
          </span>
        </div>

        {/* Brand Switcher */}
        <div className="flex items-center gap-1 bg-[var(--platform-sand)] rounded-full p-1">
          {(Object.keys(brands) as BrandId[]).map((brandId) => {
            const brand = brands[brandId];
            const isActive = activeBrand === brandId;
            return (
              <button
                key={brandId}
                onClick={() => onBrandChange(brandId)}
                className="relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200"
                style={{
                  backgroundColor: isActive ? "white" : "transparent",
                  color: isActive ? brand.colors.primary : "var(--platform-muted)",
                  boxShadow: isActive
                    ? "0 1px 3px rgba(0,0,0,0.08)"
                    : "none",
                }}
              >
                {brand.name}
              </button>
            );
          })}
        </div>

        {/* Agent indicator */}
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: brands[activeBrand].colors.primary }}
          />
          <span className="text-sm text-[var(--platform-muted)]">
            {brands[activeBrand].agentName} — {brands[activeBrand].agentRole}
          </span>
        </div>
      </div>
    </header>
  );
}
