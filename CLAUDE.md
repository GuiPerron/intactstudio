# Studio AI — Intact/belairdirect Creative Platform

## Project Overview

AI-native creative platform for IFC's (Intact Financial Corporation) Creative & Brand Studio team. Built by Guillaume Perron (Sr. Designer Consultant).

**Phase 1 goal:** Vision validation prototype — a brainstorm/onboarding tool for the client to validate the concept before real development investment. NOT a functional app. It demonstrates the platform vision through an interactive, polished UI.

**How Phase 1 starts:** The prototype opens with an interactive brainstorm session. This is NOT just a pitch — it's a real working session that collects feedback AND sells the vision simultaneously. The AI agent guides the client (IFC leadership / Creative & Brand Studio stakeholders) through the Studio AI concept while capturing their priorities, ideas, and reactions for the future build.

**Brainstorm = Feedback Collection + Vision Demo.** Two goals in one experience:
1. **Sell the vision** — Show what's possible through live demos and proposals
2. **Collect structured feedback** — Capture what the client actually wants, what they prioritize, what surprises them, what they'd change

The brainstorm works like a real collaborative working session (the way a designer and a client would brainstorm a project together). The AI agent LEADS with proposals, but it also LISTENS and RECORDS. Every client reaction is data for the project.

**Brainstorm methodology (inspired by structured brainstorming):**
- Ask ONE question at a time — don't overwhelm with a wall of questions
- Prefer multiple-choice options when possible (easier to answer, easier to capture)
- For each topic: propose 2-3 concrete approaches with trade-offs, let the client pick/refine
- Present ideas in small digestible chunks (not a monologue), validate each before moving on
- The agent recommends an approach and explains WHY — it has an opinion, not just options

**The flow:**
1. **Introduction** — Agent introduces itself AND the session format ("We're going to brainstorm together what Studio AI should be. I'll propose ideas, show you demos, and capture your feedback. At the end, you'll get a clean summary of everything we decided.")
2. **Pain points discovery** — "What takes too long? What's repetitive? Where do brand errors happen?" (one question at a time)
3. **Feature proposals** — Based on answers, agent PROPOSES concrete solutions with 2-3 options. Shows live UI demos for each. Client reacts, agent captures the preference.
4. **Surprise & delight** — Agent proactively shows capabilities the client hasn't imagined ("Did you know I can switch between Intact and belairdirect voice instantly? Watch this...")
5. **Priority ranking** — Agent asks client to rank which features matter most (template editor? brand checker? micro-apps? AI content gen?)
6. **Summary & export** — Agent produces a clean, structured summary document of the entire brainstorm session:
   - Identified pain points
   - Proposed solutions and client reactions
   - Feature priorities (ranked)
   - Key decisions made
   - Next steps
   - This summary can be downloaded/exported as a deliverable to share with stakeholders

**What the brainstorm captures (structured data):**
- Pain points and their severity
- Feature preferences (yes/no/maybe + priority level)
- Brand-specific needs per swimlane
- Client reactions to each demo (excited, neutral, skeptical)
- Open ideas and suggestions from the client
- Ranked priorities for Phase 2 build

**Key principles:**
- The client discovers what's possible by experiencing it, not by reading about it
- Every interaction generates useful project data — nothing is wasted
- The agent has opinions and recommends, but the client decides
- "Everything is possible" energy — surprise and delight
- The deliverable at the end makes this session valuable even if the project doesn't get approved immediately

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
