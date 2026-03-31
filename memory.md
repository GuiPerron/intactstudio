# Memory — Studio AI Project

Last updated: 2026-03-30

---

## Project State

- **Phase:** Pre-development — brand reconnaissance complete, prototype build next
- **Status:** Ready to code Phase 1 prototype
- **Blocking:** Nothing — all research done, design direction locked

## Key Decisions Made

### Architecture
- Hub-first experience: client arrives on Dashboard, navigates to tools from there
- Two FUNCTIONAL features: Brief Creator (adaptive form) + AI Agent sidebar (Claude API chat)
- Everything else = pixel-perfect mockups (Template Editor, Micro-apps Catalog, Team Page)
- NO separate "brainstorm" entry — the AI sidebar IS the brainstorm tool
- Phase 1 is a VISION VALIDATION prototype, NOT a functional app
- Goal: WOW the client into greenlighting the full build
- Brief Creator = star feature (adaptive form inspired by guip.ca/brief)

### Design
- Platform aesthetic: Minimal white, black text, red accent #D11338. NOT dark mode.
- Vibe: Linear meets Figma — surgical precision, generous whitespace
- Font: Inter (or similar clean sans-serif) for platform UI only
- Brand fonts (Intact Serif/Sans, Montserrat/Roboto) ONLY inside template previews
- Two brand systems that NEVER blend (see brand-reconnaissance-studio-ai.md)

### Tech
- Stack: Next.js 14+ / React 18+ / TypeScript / Tailwind CSS
- AI: Claude API for brand-aware agent
- Deployment: Vercel (Phase 1)
- Code in Claude Code (not Cowork)

### Scope
- Mac Mini infrastructure = Phase 3 (NOT now)
- Guillaume builds micro-apps himself (SVG Animator, Chevalier Generator, A/B Factory)
- The AI agent assists with content, brand checking, brainstorming — not creation of micro-apps

## Team Context

- Creative & Brand Studio = 7 people + 2 open positions
- 4 swimlanes: Intact Brand (Mia), belairdirect (Fred), Sponsorship (Martine), Acquisition/Growth (Solene)
- Studio team = power users (full access)
- Requestors = self-serve users (template editing with pre-approved options)

## Brand Intelligence

- Both brandbooks fully analyzed (Intact: 48 pages, belairdirect: 69 pages)
- Web research completed (campaigns, social presence, creative evolution)
- External audit merged and validated (errors corrected: Intact is NOT blue, belairdirect is NOT green)
- Full reference: brand-reconnaissance-studio-ai.md

## Critical Reminders

- belairdirect is ALWAYS lowercase. Always.
- Intact's brackets are ALWAYS red. Always.
- Blue CTAs for belairdirect digital. Never red.
- Two brands = two universes. Zero crossover.
- Prototype must demo, not function. Polish > features.
- The client is IFC/Intact — Guillaume is a consultant building this FOR them
