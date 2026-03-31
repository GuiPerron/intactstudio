# Studio AI — Intact/belairdirect Creative Platform

## Project Overview

AI-native creative platform for IFC's (Intact Financial Corporation) Creative & Brand Studio team. Built by Guillaume Perron (Sr. Designer Consultant).

**Phase 1 goal:** Vision validation prototype — a brainstorm/onboarding tool for the client to validate the concept before real development investment. NOT a functional app. It demonstrates the platform vision through an interactive, polished UI.

**How Phase 1 starts:** The prototype opens with an interactive brainstorm session — a REAL conversation between the AI agent and the client, powered by Claude API. This is NOT a survey, NOT a form with pre-written choices, NOT a guided tour with click-to-continue buttons. It's a live AI chat that feels like sitting down with a smart creative partner who knows the brand inside-out.

**Brainstorm = Feedback Collection + Vision Demo.** Two goals in one experience:
1. **Sell the vision** — Show what's possible through live demos and proposals
2. **Collect structured feedback** — Capture what the client actually wants, what they prioritize, what surprises them, what they'd change

---

### ⚠️ CRITICAL: How the brainstorm ACTUALLY works (read carefully)

**The brainstorm is a REAL AI CONVERSATION using Claude API.** The client TYPES responses in a chat interface. The AI agent responds dynamically based on what the client says. Nothing is pre-scripted. The conversation should last 15-25 minutes, not 2 minutes.

**The WRONG way (what to avoid):**
- ❌ Pre-written multiple choice cards that the client clicks without typing
- ❌ A scripted sequence where every response is predetermined
- ❌ Showing all pain points at once as a checkbox grid
- ❌ Showing all features at once with emoji reaction buttons
- ❌ A form disguised as a conversation
- ❌ The whole thing finishing in 5 clicks
- ❌ The client never typing a single word

**The RIGHT way:**
- ✅ The AI asks ONE question, the client TYPES a response, the AI reacts intelligently
- ✅ The AI proposes an idea in 2-3 sentences, then asks "What do you think? Would this be useful for your team?"
- ✅ The client can say "Actually, our biggest problem is X" and the AI pivots
- ✅ The AI shows a LIVE DEMO embedded in the chat (e.g., brand voice switch) and then discusses it
- ✅ The conversation branches based on what the client cares about
- ✅ The AI remembers earlier answers and references them ("You mentioned brand consistency is a pain point — this feature directly addresses that")
- ✅ At the end, the AI compiles everything discussed into a structured summary

**The conversation mechanics:**
- The chat interface has a text input where the client types freely
- The AI can also offer quick-reply suggestions (2-3 short options) as clickable chips BELOW the text input — but the client can always ignore them and type something else
- The AI can embed rich UI components INSIDE chat messages: live demos, before/after comparisons, interactive previews
- The AI maintains a hidden data structure that captures every preference, reaction, and decision as the conversation progresses
- This data structure feeds the final summary/export

---

### Brainstorm = CREATIVE TOOL DEMO (not feedback collection)

**The pivot:** The brainstorm is NOT a meta-discussion about what the platform should be. It's a LIVE DEMO where the client actually USES the AI to create something real. The client leaves the session with a tangible deliverable — a complete creative brief or a fleshed-out campaign concept.

**Two paths (client chooses at the start):**

**Path A — Create a Brief**
The client uses the AI to build a creative brief from scratch. The agent asks the right questions (objective, brand, audience, deliverables, timeline), proposes creative angles, switches between brand voices to demonstrate, and produces a structured, exportable brief at the end. This is the Brief Creator micro-app — live and functional.

**Path B — Brainstorm a Campaign Concept**
The client describes a need ("we need a summer 2026 campaign for belairdirect, conversion-focused, multi-channel") and the AI helps develop the concept: creative theme, key messages, tone direction, channel strategy, visual references. The agent demonstrates brand knowledge by adapting proposals to the correct brand voice and guidelines.

**Why this is better than the old approach:**
- The client USES the tool instead of TALKING ABOUT it
- They leave with a real deliverable (brief or concept)
- It demonstrates AI capability through action, not discussion
- No risk of the AI saying something off-brand during a "free brainstorm" — the conversation is structured around creation
- The demo sells itself — if the client likes what the AI produced, the project is approved

### Brainstorm methodology

- Ask ONE question at a time — don't overwhelm
- For each topic: propose 2-3 concrete approaches with trade-offs, explain the recommended one, let the client react
- Present ideas in small digestible chunks (not a monologue), validate each before moving on
- The agent recommends an approach and explains WHY — it has an opinion, not just options
- Quick-reply chips can help guide the conversation, but the text input is always available

### Client context the agent MUST know

The brainstorm agent must have deep knowledge of the Creative & Brand Studio to ask relevant questions and suggest realistic pain points. This context goes in the agent's system prompt:

- **Team:** Creative & Brand Studio — 7 people + 2 open positions
- **4 swimlanes:** Intact Brand, belairdirect, Sponsorship, Acquisition/Growth
- **Two distinct brands:** Intact (broker, warm, sophisticated) and belairdirect (direct-to-consumer, accessible, playful)
- **Real team challenges:**
  - Brand consistency between Intact and belairdirect (very different guidelines, tone/visual errors)
  - Repetitive tasks: FR/EN adaptations, multi-format variations (social, banner, email), asset resizing
  - High production volume for a small team (7 people, two brands, 4 swimlanes)
  - No centralized tool — everything scattered (Figma, emails, Teams, shared folders)
  - Brand guidelines exist but are in 50+ page PDFs nobody checks daily
  - Each swimlane has specific needs but shares the same generic tools
  - Content production often blocked by back-and-forth approval cycles

Quick-reply chip suggestions must reflect these REAL challenges. Good examples: "Brand consistency between Intact and belairdirect", "Multi-format and FR/EN adaptations take forever", "Production volume vs team size". Bad examples: ❌ "Employee onboarding" (this isn't HR), ❌ "Marketing budget" (this isn't finance).

### The flow (6 phases, ~15-25 min total)

1. **Introduction** (~1 min) — Agent introduces itself AND the session format. Sets expectations: "We're going to brainstorm together what Studio AI should be. I'll propose ideas, show you demos, and capture your feedback. At the end, you'll get a clean summary of everything we decided. Just type your thoughts — there's no wrong answer."

2. **Pain points discovery** (~3-5 min) — Agent asks about current workflow challenges ONE AT A TIME. Example: "As a creative team managing two distinct brands — Intact and belairdirect — what's the biggest challenge you face daily in content production?" Quick-reply chips: "Brand consistency between the two brands" / "Multi-format FR/EN adaptations" / "Production volume vs team size". Then follows up based on the answer. Goes deeper: "How does that manifest concretely? Is it more tone errors, visual errors, or both?"

3. **Feature proposals with live demos** (~5-8 min) — Based on pain points discussed, agent PROPOSES specific solutions. For each: explains it in 2-3 sentences, shows an inline demo/preview component, asks for the client's reaction. Example: "Based on what you said about brand consistency issues, I think a Brand Checker could help. Watch this —" [inline demo of brand checker analyzing a fake asset] "— What do you think? Would your team use something like this?"

4. **Surprise & delight** (~2-3 min) — Agent proactively shows capabilities the client hasn't imagined. These are "wow moments" embedded in the conversation. Example: [shows brand voice switch demo inline] "Did you notice the tone, colors, and CTA style all changed? This is what happens when brand knowledge is built into the platform. Your team would never accidentally write belairdirect copy in Intact's voice."

5. **Priority ranking** (~2-3 min) — Agent recaps what they discussed and asks the client to rank features. Can show a drag-and-drop list OR simply ask conversationally: "Of everything we talked about, what would make the biggest impact if we built it first?"

6. **Summary & export** — Agent produces a clean, structured summary document:
   - Identified pain points (with context from the conversation)
   - Proposed solutions and client reactions (with quotes)
   - Feature priorities (ranked)
   - Key decisions and insights from the discussion
   - Next steps
   - This summary is downloadable/exportable as a deliverable

### What the brainstorm captures (structured data, built during conversation)
- Pain points and their severity (from the client's own words)
- Feature preferences with context (not just yes/no — WHY they liked or disliked something)
- Brand-specific needs per swimlane
- Open ideas and suggestions from the client (things WE didn't propose)
- Ranked priorities for Phase 2 build
- Surprising insights (things the client said that we didn't expect)

### Agent identity and tone

The agent is NOT a support assistant. It does NOT say "Yo!", "Hey!", "What brings you here?", or "How can I help you?". It is a BRAINSTORM SESSION FACILITATOR — a senior creative consultant leading a structured working session.

**Tone:** Professional but warm. Confident. Knows the subject better than the client. Asks questions to understand needs, but already has ideas to propose. Think creative director at a kick-off meeting — not a customer service chatbot.

**Opening message must:**
- Introduce the session format (not the agent's capabilities)
- Set a time expectation (~20 minutes)
- Explain the structure: questions → proposals → demos → summary
- End with a SPECIFIC first question that shows knowledge of the client's context (Creative & Brand Studio, two brands, content production)
- NOT be generic ("what brings you here?") — must reference Intact/belairdirect directly

**Example opening:**
"Bonjour et bienvenue dans cette session de brainstorm Studio AI. Je suis votre partenaire créatif pour les 20 prochaines minutes. Ensemble, on va définir ce que Studio AI devrait devenir pour l'équipe du Creative & Brand Studio. [...] En tant qu'équipe créative qui gère deux marques distinctes — Intact et belairdirect — quel est le plus gros défi que vous vivez au quotidien dans la production de contenu?"

### Key principles
- The client discovers what's possible by experiencing it, not by reading about it
- Every interaction generates useful project data — nothing is wasted
- The agent has opinions and recommends, but the client decides
- "Everything is possible" energy — surprise and delight
- The deliverable at the end makes this session valuable even if the project doesn't get approved immediately
- **The conversation should feel natural and human — not like clicking through a wizard**

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

### Phase 1 prototype: Hub-first experience

The client arrives directly on the **Hub Studio dashboard** — the platform as it would look in daily use. No separate "brainstorm" entry point. The Hub IS the experience. From the dashboard, the client can explore different tools and screens. Most screens are static mockups (beautiful but non-functional), except:

- **Brief Creator** — FUNCTIONAL. The client can actually create a brief using the adaptive form (triage → adaptive fields → AI validation). This is the star interactive demo.
- **AI Agent sidebar** — FUNCTIONAL. A chat panel (Claude API, streaming) is always available. The client can brainstorm a campaign concept, ask questions about the platform, or get help with the brief. This demonstrates the AI's brand knowledge live.

Everything else (Template Editor, Micro-apps Catalog, Team Pages) is a pixel-perfect mockup — it shows what the platform WOULD look like, but buttons don't submit, forms don't save.

### Hub Studio screens

**Screen 1 — Dashboard (homepage after login)**
- Welcome header with user name and team
- Quick-access cards to main tools (Template Editor, Brand Checker, AI Agent, Micro-apps)
- Recent activity feed (fake data — last 5 assets created/edited by team members)
- Team shortcuts: 4 swimlane cards (Intact Brand, belairdirect, Sponsorship, Acquisition/Growth) each with their agent avatar and team lead name
- Stats widgets: assets created this month, brand compliance score, active templates
- Clean layout: cards on Soothing Sand background, generous spacing

**Screen 2 — Template Editor**
- Left panel: template gallery (thumbnails grid, filterable by brand/format/campaign)
- Center: live preview of selected template — shows a realistic Intact or belairdirect ad/banner
- Right panel: editable fields (H1, body text, CTA label, image selector) — these are visible but non-functional
- Top bar: brand selector toggle (Intact / belairdirect), format selector (social, banner, email), AI assist button
- Bottom: export options (PNG, PDF, multi-format) — visible but non-functional
- The preview should show REAL brand content with correct colors, fonts, and imagery for whichever brand is "selected"

**Screen 3 — Micro-apps Catalog**
- Grid of micro-app cards, each with: icon, name, short description, "Open →" link
- Micro-apps to show:
  - SVG Animator — "Animate your SVGs with AI prompts"
  - Chevalier Generator — "Generate Little Knight poses for belairdirect" (with small knight illustration)
  - A/B Factory — "Create A/B test variants from a single template"
  - Brand Checker — "Validate any asset against brand guidelines"
  - Brief Creator — "AI-powered adaptive creative briefs" (IMPORTANT — see detailed spec below)
  - Image Gen — "AI-powered image generation, on-brand"
- Some cards marked "Coming soon" with a subtle badge
- Each card uses brand-appropriate styling (belairdirect cards might have a subtle blue accent, Intact cards a red one)

**Screen 4 — Team Page example (Intact Brand)**
- Shows what Mia's team page looks like
- Agent sidebar: Mia's avatar, brief intro ("I'm Mia, your Intact brand expert"), recent conversations
- Team-specific template library (Intact templates only — correct red/sand/black palette)
- Team stats and recent activity
- Quick-access to Intact-specific tools and guidelines
- Everything is Intact-branded: red brackets, Soothing Sand backgrounds, Intact typography
- A small note/badge: "Each team has its own page with its own AI agent and brand-specific tools"

### Brief Creator — Detailed spec (key micro-app)

The Brief Creator is one of the most important micro-apps. Briefs are a universal pain point in creative teams — they're often incomplete, vague, or in the wrong format. Studio AI solves this with an adaptive, AI-assisted brief builder.

**How it works:**

**Step 1 — Triage (3 quick questions, card-based):**
1. "C'est quoi l'objectif?" — Notoriété / Conversion / Engagement / Lancement / Interne
2. "C'est urgent?" — ASAP (5 jours) / 2 semaines / Flexible
3. "Quel volume?" — Petit (1-3 assets, un canal) / Moyen (5-15 assets, multi-canal) / Grand (Campagne complète, déclinaisons)

These 3 answers DETERMINE which fields appear in the brief form. This is the key differentiator — the brief adapts to the request type.

**Step 2 — Adaptive brief form (changes based on triage):**
- Projet & demandeur (project name, requester name + team)
- Marque & marché (brand chips: belairdirect, Intact Insurance, IFC, etc. + province/language chips: QC FR, QC EN, ON, AB, etc.)
- Ton brief (free text area — context, objectives, ideas, audience, key message)
- De quoi as-tu besoin? (selectable list that adapts: Design, Motion video, Creative strategy, Landing page, Illustrations, Copy, UGC)
  - **If Copy is selected** → additional fields appear: tone, key messages, word count, reference materials
  - **If Motion video is selected** → additional fields: duration, format (reel, TVC, social), storyboard notes, voiceover needs
  - **If Campagne complète** → all deliverable fields appear, plus campaign timeline, cross-channel requirements
- Specs & deadline (date picker, channels & sizes, notes & references)

**Step 3 — AI validation:**
- Completion indicator (0% → 100%) that checks all required fields
- AI reviews the brief and flags gaps: "Ton brief ne mentionne pas l'audience cible — veux-tu l'ajouter?"
- "Brainstorm" button on each section — AI can help fill in sections conversationally
- "Voir le récapitulatif" — clean summary view of the complete brief, exportable

**Why it matters for Studio AI:**
- Eliminates back-and-forth ("le brief était pas clair")
- Guarantees complete briefs every time
- AI assists people who don't know how to write a good brief
- Brand context is pre-loaded (the brand chips auto-load the right guidelines)
- The brief feeds directly into the Template Editor and AI Agent for production

**Reference:** See guip.ca/brief for the UI pattern and flow inspiration.

### Important for Hub Studio mockup screens:
- Use REALISTIC content — real-looking ad copy, plausible team member names, believable stats
- Apply correct brand systems from brand-reconnaissance-studio-ai.md
- The UI quality must be impeccable — this is what sells the vision
- No "Lorem ipsum" — write actual Intact/belairdirect copy for previews
- No skeleton screens or loading states — show the "ideal" full state
- Each screen should feel like a real product screenshot

### Full platform architecture (for reference — not all built in Phase 1):

1. **Hub Studio** — Dashboard for all IFC employees. Generic tools: image gen, SVG animator, brainstorm AI, brand checker, micro-app catalog.

2. **Team Pages** — Team-specific templates, micro-apps, and contextual AI agent per swimlane:
   - Intact Brand (Mia)
   - belairdirect (Fred)
   - Sponsorship (Martine)
   - Acquisition/Growth (Solène)

### Key features (shown in mockups):

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
