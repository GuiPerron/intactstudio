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

### Brainstorm methodology

The brainstorm works like a real collaborative working session (the way a designer and a client would brainstorm a project together). The AI agent LEADS with proposals, but it also LISTENS and RECORDS. Every client reaction is data for the project.

- Ask ONE question at a time — don't overwhelm
- For each topic: propose 2-3 concrete approaches with trade-offs, explain the recommended one, let the client react
- Present ideas in small digestible chunks (not a monologue), validate each before moving on
- The agent recommends an approach and explains WHY — it has an opinion, not just options
- Quick-reply chips can help guide the conversation, but the text input is always available

### The flow (6 phases, ~15-25 min total)

1. **Introduction** (~1 min) — Agent introduces itself AND the session format. Sets expectations: "We're going to brainstorm together what Studio AI should be. I'll propose ideas, show you demos, and capture your feedback. At the end, you'll get a clean summary of everything we decided. Just type your thoughts — there's no wrong answer."

2. **Pain points discovery** (~3-5 min) — Agent asks about current workflow challenges ONE AT A TIME. Example: "To start — what's the single most time-consuming repetitive task your team deals with?" Then follows up based on the answer. Goes deeper before moving on: "How often does that happen? Every week? Every day?"

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
