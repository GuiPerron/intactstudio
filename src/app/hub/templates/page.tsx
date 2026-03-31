import { NavBar } from "@/components/layout/NavBar";
import { AgentToggle } from "@/components/agent/AgentToggle";

const TEMPLATES = [
  { id: 1, name: "Banner habitation 728x90", brand: "intact", format: "Banner", preview: "bg-[#F7F2EA]" },
  { id: 2, name: "Story Instagram — Promo", brand: "intact", format: "Social", preview: "bg-[#F7F2EA]" },
  { id: 3, name: "Email renouvellement", brand: "intact", format: "Email", preview: "bg-[#F7F2EA]" },
  { id: 4, name: "Post Facebook — automerit", brand: "belairdirect", format: "Social", preview: "bg-[#F5F8FA]" },
  { id: 5, name: "Story TikTok — Chevalier", brand: "belairdirect", format: "Social", preview: "bg-[#F5F8FA]" },
  { id: 6, name: "Banner auto 300x250", brand: "belairdirect", format: "Banner", preview: "bg-[#F5F8FA]" },
];

export default function TemplateEditorPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--platform-sand)" }}>
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — Template gallery */}
        <div className="w-[280px] border-r border-[var(--platform-border)] bg-white overflow-y-auto shrink-0">
          <div className="p-4 border-b border-[var(--platform-border)]">
            <h2 className="text-sm font-semibold">Templates</h2>
            <div className="mt-3 flex gap-2">
              <FilterChip label="Tous" active />
              <FilterChip label="Intact" />
              <FilterChip label="belairdirect" />
            </div>
          </div>

          <div className="p-3 grid grid-cols-2 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                className={`rounded-lg border-2 overflow-hidden transition-all duration-200 ${t.id === 1 ? "border-[var(--platform-accent)]" : "border-[var(--platform-border)] hover:border-[var(--platform-muted)]"}`}
              >
                <div className={`aspect-[4/3] ${t.preview} flex items-center justify-center`}>
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: t.brand === "intact" ? "#DF0030" : "#0F68D8" }}
                  />
                </div>
                <div className="p-2">
                  <p className="text-[10px] font-medium truncate">{t.name}</p>
                  <p className="text-[9px] text-[var(--platform-muted)]">{t.format}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center — Live preview */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[var(--platform-border)]">
            <div className="flex items-center gap-3">
              <div className="flex rounded-full border border-[var(--platform-border)] p-0.5">
                <span className="rounded-full px-3 py-1 text-xs font-medium bg-[#DF0030] text-white">
                  Intact
                </span>
                <span className="rounded-full px-3 py-1 text-xs font-medium text-[var(--platform-muted)]">
                  belairdirect
                </span>
              </div>
              <select className="text-xs border border-[var(--platform-border)] rounded-lg px-3 py-1.5 bg-white">
                <option>Social — Story</option>
                <option>Banner — 728x90</option>
                <option>Email</option>
                <option>Landing page</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 rounded-full border border-[var(--platform-border)] px-3 py-1.5 text-xs font-medium hover:border-[var(--platform-muted)] transition-colors">
                <span className="text-sm">✨</span> AI Assist
              </button>
              <button
                className="rounded-full px-4 py-1.5 text-xs font-medium text-white"
                style={{ backgroundColor: "var(--platform-accent)" }}
              >
                Exporter PNG
              </button>
            </div>
          </div>

          {/* Preview area */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-[400px] rounded-xl overflow-hidden shadow-lg border border-[var(--platform-border)]">
              {/* Template preview — Intact habitation */}
              <div className="bg-[#F7F2EA] p-8">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#DF0030] mb-4">
                  Pour tout ce qui compte
                </p>
                <h2 className="text-2xl font-bold leading-tight mb-3" style={{ fontFamily: "Georgia, serif" }}>
                  <span className="text-[#DF0030]">[</span> Votre chez-vous mérite la meilleure protection <span className="text-[#DF0030]">]</span>
                </h2>
                <p className="text-sm leading-relaxed text-black/80 mb-6">
                  Parce que votre maison, c&apos;est bien plus que quatre murs. C&apos;est là où vos souvenirs vivent.
                </p>
                <button className="rounded-full px-5 py-2.5 text-sm font-medium text-white bg-[#DF0030]">
                  Parler à un courtier
                </button>
              </div>
              <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-[var(--platform-border)]">
                <span className="text-[10px] text-[var(--platform-muted)]">Banner habitation — 728x90</span>
                <span className="text-[10px] font-medium text-[#DF0030]">Intact Insurance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — Edit fields */}
        <div className="w-[300px] border-l border-[var(--platform-border)] bg-white overflow-y-auto shrink-0">
          <div className="p-4 border-b border-[var(--platform-border)]">
            <h2 className="text-sm font-semibold">Édition</h2>
            <p className="text-xs text-[var(--platform-muted)] mt-0.5">Banner habitation 728x90</p>
          </div>

          <div className="p-4 space-y-5">
            <EditField label="Surtitre" value="Pour tout ce qui compte" />
            <EditField label="Titre (H1)" value="Votre chez-vous mérite la meilleure protection" />
            <EditField label="Body" value="Parce que votre maison, c'est bien plus que quatre murs. C'est là où vos souvenirs vivent." multiline />
            <EditField label="CTA" value="Parler à un courtier" />

            <div>
              <label className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider">
                Image
              </label>
              <div className="mt-2 rounded-lg border border-dashed border-[var(--platform-border)] p-6 text-center">
                <p className="text-xs text-[var(--platform-muted)]">
                  Glisser une image ici
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider">
                Options visuelles
              </label>
              <div className="mt-2 flex gap-2">
                <ColorOption color="#DF0030" active />
                <ColorOption color="#F7F2EA" />
                <ColorOption color="#000000" />
                <ColorOption color="#2D716F" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AgentToggle />
    </div>
  );
}

function FilterChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      className="rounded-full px-3 py-1 text-xs font-medium border transition-colors"
      style={{
        borderColor: active ? "var(--platform-accent)" : "var(--platform-border)",
        backgroundColor: active ? "#FEF2F4" : "white",
        color: active ? "var(--platform-accent)" : "var(--platform-muted)",
      }}
    >
      {label}
    </button>
  );
}

function EditField({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <label className="text-xs font-semibold text-[var(--platform-muted)] uppercase tracking-wider">
        {label}
      </label>
      {multiline ? (
        <textarea
          defaultValue={value}
          rows={3}
          className="mt-2 w-full rounded-lg border border-[var(--platform-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--platform-accent)]"
        />
      ) : (
        <input
          type="text"
          defaultValue={value}
          className="mt-2 w-full rounded-lg border border-[var(--platform-border)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--platform-accent)]"
        />
      )}
    </div>
  );
}

function ColorOption({ color, active }: { color: string; active?: boolean }) {
  return (
    <button
      className="w-8 h-8 rounded-full border-2 transition-all"
      style={{
        backgroundColor: color,
        borderColor: active ? "var(--platform-accent)" : "var(--platform-border)",
      }}
    />
  );
}
