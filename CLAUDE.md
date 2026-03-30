# Studio AI — Intact/belairdirect Creative Platform

## Project Overview

AI-native creative platform for IFC's (Intact Financial Corporation) Creative & Brand Studio team. Built by Guillaume Perron (Sr. Designer Consultant).

**Phase 1 goal:** Vision validation prototype — a brainstorm/onboarding tool for the client to validate the concept before real development investment. NOT a functional app. It demonstrates the platform vision through an interactive, polished UI.

**How Phase 1 starts:** The prototype opens with an interactive brainstorm experience. This is the client-facing onboarding flow — a guided conversation that walks the client (IFC leadership / Creative & Brand Studio stakeholders) through the Studio AI vision. The brainstorm showcases what the platform could do by SHOWING it: the AI agent introduces itself, demonstrates brand awareness (switching between Intact and belairdirect voices), walks through the template editor concept, previews micro-apps, and lets the client interact with the vision. Think of it as a pitch deck that's alive — not slides, but a working UI that tells the story of the platform while being the platform.

**Brainstorm philosophy:** The AI agent LEADS the conversation — it doesn't just ask questions and wait. The client (Creative & Brand Studio team) doesn't know everything Claude/AI can do, so the agent must PROPOSE ideas, SHOW possibilities, and INSPIRE. It's a creative partner, not a form to fill out.

The flow should feel like:
1. Agent introduces itself and the platform vision
2. Agent asks about the team's current pain points ("What takes too long? What's repetitive?")
3. Based on answers, agent PROPOSES concrete solutions — and DEMOS them live in the UI
4. Agent proactively suggests capabilities the client hasn't thought of ("Did you know I can switch between Intact and belairdirect voice instantly? Watch this...")
5. Agent shows template editor concept, micro-apps catalog, brand-aware content generation
6. At each step: the agent leads with ideas, the client reacts and refines

Key principle: **The client discovers what's possible by experiencing it, not by reading about it.** The agent should surprise and delight — "everything is possible" is the energy.

## Tech Stack

- **Framework:** Next.js 14+ / React 18+
- **Styling:** Tailwind CSS
- **AI:** Claude API (brand-aware agent)
- **Language:** TypeScript
- **Deployment:** Vercel (Phase 1)

## Design Direction

**Aesthetic:** Minimal, white background, black text, red accent. NOT dark mode.

```
Platform tokens (the app chrome itself):
--platform-bg:      #FFFFFF
--platform-text:    #000000
--platform-accent:  #D11338
--platform-border:  #E5E5E5
--platform-muted:   #6B7280
```

**Font:** Use a clean sans-serif (Inter or similar). The Intact/belairdirect brand fonts (Intact Serif/Sans, Montserrat/Roboto) are for content previews INSIDE templates, not for the platform UI.

**Vibe:** Think Linear meets Figma — surgical precision, generous whitespace, subtle hover states, no visual clutter. Every pixel earns its place.

### UI Inspiration from intact.ca (March 2026)

The platform UI draws from intact.ca's current design language. Key patterns to replicate:

**Layout & Structure:**
- Double nav bar: utility bar (top, smaller) + main nav (logo left, menu center, red CTA right)
- Soothing Sand (#F7F2EA) as section background alternating with white — NOT pure white everywhere
- Very generous spacing between sections — lots of breathing room
- Content max-width ~1280px, centered
- Cards: white on sand background, subtle border, no heavy shadows

**Typography Patterns:**
- Section titles: large serif feel (we use Inter for platform, but respect the hierarchy scale)
- Card titles: bold sans-serif
- Body: regular weight, generous line-height
- Key benefit words highlighted in red (e.g. "in 20 seconds" in red within a black heading)

**Button System:**
- Primary CTA: red filled (#D11338), white text, rounded corners (pill shape)
- Secondary CTA: black outline, black text, rounded corners
- Text links: underline + arrow icon (→)
- Card actions: "Learn more" with arrow, bottom of card, subtle divider above

**Cards & Components:**
- Product cards: icon (line-style, black) + bold label + description + "Learn more →" footer
- Featured/active card: red background with white icon + white text (e.g. "Car + Home")
- Image cards: large photo, white circle arrow overlay as CTA
- FAQ: accordion style, white cards on sand bg, chevron toggle
- Icon style: line/outline, single-weight stroke, not filled

**Photography & Illustration:**
- Hero images: full-bleed or large format, vibrant saturated
- Brackets [ ] used as photo overlay (red brackets framing subjects)
- Flat illustrations for service/app sections (teal/beige/red palette)
- Athlete/sponsorship photos in horizontal scroll carousel

**Footer:**
- Dark background (near-black), white text
- Social icons in grey circles
- Structured multi-column link layout
- App download badges

## Architecture

### Two surfaces:

1. **Hub Studio** — Dashboard for all IFC employees. Generic tools: image gen, SVG animator, brainstorm AI, brand checker, micro-app catalog.

2. **Team Pages** — Team-specific templates, micro-apps, and contextual AI agent per swimlane:
   - Intact Brand (Mia)
   - belairdirect (Fred)
   - Sponsorship (Martine)
   - Acquisition/Growth (Solène)

### Key features to showcase in Phase 1:

1. **Template Editor** — Live preview, editable content (H1, text, image, CTA), pre-approved visual options, AI-assisted mode, multi-format PNG export
2. **AI Agent** — Chat interface embedded everywhere, deep brand voice knowledge for both Intact and belairdirect
3. **Micro-apps Catalog** — SVG Animator, Chevalier Generator (Little Knight poses), A/B Factory, and future tools

### Users:
- **Studio team** (power users): Full access, template creation, micro-app management
- **Requestors** (self-serve): Template editing with pre-approved options, AI-assisted content

## Brand Intelligence

**CRITICAL:** This platform serves TWO distinct brands that must NEVER be blended.

See `brand-reconnaissance-studio-ai.md` for the complete brand system (700+ lines). Key rules:

### Intact Insurance
- Primary: Intact Red #DF0030, Soothing Sand #F7F2EA, Rich Black #000000
- Fonts: Intact Serif (titles), Intact Sans (body). Fallback: Century Schoolbook / Arial
- Brand device: Red brackets [ ] — living, expandable, always red
- Tone: Warm, sophisticated, emotionally resonant. Trusted advisor.
- Never talks price. Focus on memories, moments, human connections.
- Photography: Vibrant, saturated, luminous, movement

### belairdirect
- Primary: Conquest Red #C8102E, Armour Grey #53565A
- Fonts: Montserrat (headings), Roboto (body). Fallback: Arial
- CTAs: Blue #0F68D8 (NEVER red in digital)
- Mascot: Little Knight (3D character) — one per visual, own universe only
- Tone: Approachable, direct, playful. Smart friend.
- "belairdirect" is ALWAYS lowercase, even at sentence start
- Red is NEVER used for H1 in digital (error confusion)
- Every photo has a touch of red

### Absolute rules:
1. Never blend brand elements across Intact/belairdirect
2. Never use one brand's colors on the other's content
3. Never reference the Little Knight in Intact content
4. Never use brackets [ ] as design element in belairdirect content
5. Always respect EN/FR bilingual requirements

## File Structure

```
intactstudio/
├── CLAUDE.md                          ← You are here — project instructions for Claude Code
├── brand-reconnaissance-studio-ai.md  ← Full brand system reference (700+ lines)
├── memory.md                          ← Agent working memory — project decisions, context
├── soul.md                            ← Agent personality — behavior, values, voice
├── user.md                            ← User profile — Guillaume's role, preferences
├── src/
│   ├── app/                           ← Next.js app router
│   ├── components/
│   │   ├── ui/                        ← Shared UI primitives
│   │   ├── layout/                    ← Shell, sidebar, nav
│   │   ├── editor/                    ← Template editor components
│   │   ├── agent/                     ← AI chat interface
│   │   └── micro-apps/               ← Individual micro-app UIs
│   ├── lib/
│   │   ├── brand/                     ← Brand tokens, voice configs
│   │   └── ai/                        ← Claude API integration
│   └── styles/                        ← Tailwind config, global styles
├── public/
│   └── assets/                        ← Logos, icons, brand assets
└── package.json
```

## Agent System Files

The AI agent that builds this project has four reference files beyond this CLAUDE.md:

- **brand-reconnaissance-studio-ai.md** — Read this when working on anything brand-related (colors, typography, voice, templates, previews). This is the source of truth for both Intact and belairdirect brand systems.
- **memory.md** — Project decisions, context accumulated over sessions, architectural choices. Read at session start.
- **soul.md** — How the agent should behave, communicate, and approach problems. Defines working style and values.
- **user.md** — Who Guillaume is, what he cares about, how he works. Informs tone and priorities.

## Code Conventions

- TypeScript strict mode
- Functional components with hooks
- Tailwind for styling (no CSS modules)
- Descriptive component names: `TemplateEditor`, `BrandSwitcher`, `AgentChat`
- Comments in English
- File names: kebab-case for files, PascalCase for components

## Context

- IFC = largest P&C insurer in Canada (32K employees, TSX: IFC)
- Creative & Brand Studio = 7 people + 2 open positions
- 4 swimlanes: Intact Brand, belairdirect, Sponsorship, Acquisition/Growth
- Guillaume builds the micro-apps himself — he's a designer who codes
- The prototype is meant to WOW the client into greenlighting the full build
