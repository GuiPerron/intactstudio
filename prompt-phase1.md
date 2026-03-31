# Prompt Phase 1 — À coller dans Claude Code

```
Lis d'abord les fichiers suivants dans l'ordre : CLAUDE.md, soul.md, memory.md, user.md, brand-reconnaissance-studio-ai.md

Puis build le prototype Phase 1 de Studio AI — une web app Next.js/React/Tailwind/TypeScript.

## CE QUE TU DOIS CONSTRUIRE

Le prototype s'ouvre sur un BRAINSTORM INTERACTIF — une VRAIE conversation AI en temps réel avec le client, propulsée par Claude API.

### ⚠️ ATTENTION — Lis cette section DEUX FOIS avant de coder

Le brainstorm est un CHAT AI en temps réel. Le client TAPE ses réponses. L'agent AI répond dynamiquement avec Claude API. RIEN n'est pré-scripté. La conversation dure 15-25 minutes, pas 2 minutes.

### CE QUE TU NE DOIS PAS CONSTRUIRE (anti-patterns) :

❌ Un formulaire déguisé en conversation (checkboxes, grilles de choix, boutons emoji)
❌ Des pain points pré-écrits dans des cards cliquables où le client ne tape rien
❌ Toutes les features montrées d'un coup avec des boutons "J'adore / Intéressant / Pas prioritaire"
❌ Un flow linéaire scripté où chaque réponse est prédéterminée
❌ Un sondage avec un beau UI — ça c'est PAS un brainstorm
❌ Le client qui finit en 5 clics sans avoir tapé un mot
❌ Un drag-and-drop de priorités sans discussion

### CE QUE TU DOIS CONSTRUIRE (la bonne approche) :

✅ Un vrai chat interface avec un champ de texte — le client TAPE ses réponses
✅ Claude API (streaming) pour les réponses de l'agent — chaque message est généré en temps réel
✅ L'agent pose UNE question à la fois, attend la réponse, puis réagit intelligemment
✅ L'agent propose des idées en 2-3 phrases, puis demande "Qu'est-ce que vous en pensez?"
✅ Le client peut dire "en fait notre vrai problème c'est X" et l'agent PIVOTE
✅ Des quick-reply chips (2-3 suggestions courtes) sous le champ texte — mais le client peut les ignorer et taper autre chose
✅ Des démos/previews rich UI embarquées DANS les messages de chat (pas dans une fenêtre séparée)
✅ L'agent se souvient des réponses précédentes et les référence
✅ Un state caché qui capture chaque préférence/réaction/décision au fil de la conversation
✅ Un résumé structuré exportable généré à la fin à partir de ces données

### LE FLOW EN 6 PHASES (~15-25 min total)

**Phase 1 — Introduction (~1 min)**
L'agent se présente et explique le format. Donne le ton : "On va brainstormer ensemble. Tapez vos idées, répondez à mes questions, challengez mes propositions. À la fin je vous prépare un résumé propre de tout ce qu'on aura décidé."

**Phase 2 — Découverte des pain points (~3-5 min)**
L'agent pose des questions OUVERTES, une à la fois. Exemple :
- "Pour commencer — c'est quoi LA tâche répétitive qui prend le plus de temps à votre équipe chaque semaine?"
- [Le client tape sa réponse]
- L'agent creuse : "Ça arrive à quelle fréquence? Chaque jour? Et c'est qui dans l'équipe qui gère ça principalement?"
- Puis passe à la question suivante basée sur la réponse

**Phase 3 — Propositions de features avec démos live (~5-8 min)**
Basé sur les pain points discutés, l'agent PROPOSE des solutions spécifiques :
- Explique l'idée en 2-3 phrases
- Montre un composant UI de démo INLINE dans le chat (ex: brand voice switch, template editor preview, brand checker)
- Demande la réaction : "Est-ce que votre équipe utiliserait ça? Qu'est-ce que vous changeriez?"
- Le client répond AVEC SES MOTS — pas des boutons prédéfinis

**Phase 4 — Surprise & émerveillement (~2-3 min)**
L'agent montre des capacités inattendues comme moments "wow" dans la conversation. Ex: switch de voix Intact ↔ belairdirect en direct, brand checker qui analyse un asset, template editor avec preview live.

**Phase 5 — Priorisation (~2-3 min)**
L'agent récapitule ce qui a été discuté et demande au client de classer. Peut être conversationnel ("De tout ce qu'on a vu, qu'est-ce qui aurait le plus gros impact si on le construisait en premier?") OU un drag-and-drop list — mais APRÈS la discussion, pas à la place de.

**Phase 6 — Résumé & export**
L'agent compile tout en un document structuré :
- Pain points identifiés (avec contexte tiré de la conversation)
- Solutions proposées et réactions du client (avec citations)
- Features prioritaires (classées)
- Idées du client qu'on n'avait pas prévues
- Prochaines étapes
- Bouton d'export visible (Markdown ou PDF)

### ARCHITECTURE TECHNIQUE DU CHAT

Le brainstorm utilise Claude API en temps réel :
- System prompt avec le contexte brand (from brand-reconnaissance-studio-ai.md), la personnalité de l'agent, et les instructions de brainstorm
- Messages streamés pour un feel naturel
- State React qui accumule les données structurées pendant la conversation (pain points, préférences, réactions)
- Le chat supporte des "rich messages" : l'agent peut injecter des composants UI interactifs entre les messages texte (démos, previews, comparaisons)
- Quick-reply chips sous le text input (suggestions de réponse) — optionnels, le client peut toujours taper
- Progress indicator subtil montrant la phase actuelle (1-6)

### COMPOSANTS UI INLINE (dans le chat)

Ces composants apparaissent DANS le flow de conversation, déclenchés par l'agent quand c'est pertinent :
- **BrandVoiceSwitch** — Toggle Intact ↔ belairdirect, montre la différence de ton/couleurs/CTA en live
- **TemplateEditorPreview** — Mini preview d'un template éditable avec champs H1/body/CTA
- **BrandCheckerDemo** — L'agent "analyse" un visuel fictif et montre les violations de marque détectées
- **FeatureCard** — Card propre pour présenter une feature (icône, titre, description courte)
- **PriorityRanker** — Drag-and-drop pour classer les features (utilisé en Phase 5 seulement, APRÈS la discussion)
- **SessionSummary** — Le résumé final structuré avec bouton d'export

### DESIGN DIRECTION

Le UI s'inspire d'intact.ca (mars 2026). Voir CLAUDE.md section "UI Inspiration from intact.ca".
- Fond Soothing Sand (#F7F2EA) alternant avec blanc
- Primary CTA : red filled pill (#D11338). Secondary : black outlined
- Typography : Inter pour le platform UI
- Chat bubbles : agent = fond blanc avec border subtile, client = fond légèrement teinté
- Le chat occupe la majorité de l'écran — c'est L'EXPÉRIENCE, pas un widget dans un coin
- PAS dark mode. Minimal, chirurgical, chaque pixel gagne sa place.

### EXEMPLE DE CONVERSATION (pour le system prompt de l'agent)

Voici le GENRE de conversation que l'agent devrait avoir :

Agent: "Bonjour! Je suis l'agent créatif de Studio AI. On va brainstormer ensemble ce que cette plateforme devrait devenir pour votre équipe. Je vais vous proposer des idées, vous montrer des démos, et capturer tout ce qu'on décide. À la fin, vous recevrez un résumé propre à partager avec l'équipe. Prêt? Pour commencer — c'est quoi LE plus gros irritant créatif de votre équipe en ce moment?"

Client: "Honnêtement c'est la cohérence entre les marques. On a Intact et belairdirect avec des guidelines complètement différentes et des erreurs arrivent tout le temps."

Agent: "La cohérence de marque — c'est un classique et c'est exactement ce que Studio AI adresse en premier. Laissez-moi vous montrer quelque chose..."
[INLINE DEMO: BrandVoiceSwitch — toggle Intact ↔ belairdirect]
"Vous voyez la différence? Le ton, les couleurs, le style de CTA — tout change automatiquement. En production, si quelqu'un de l'équipe écrivait du copy belairdirect avec un ton Intact, le système le détecterait. Est-ce que c'est le genre d'erreur qui arrive souvent chez vous?"

Client: "Oui exactement! Surtout avec les nouveaux employés qui connaissent pas encore les deux marques."

Agent: "Intéressant — donc le onboarding des nouveaux est un pain point aussi. On pourrait imaginer deux approches : (1) un Brand Checker qui valide en temps réel, ou (2) un mode guidé où l'AI aide le nouveau employé à rédiger en lui expliquant les règles au fur et à mesure. Qu'est-ce qui serait le plus utile selon vous?"

[...la conversation continue naturellement...]

### STACK

Next.js 14+ / React 18+ / TypeScript strict / Tailwind CSS / Claude API (streaming)
Déploiement Vercel.

### IMPORTANT

- Lis brand-reconnaissance-studio-ai.md AVANT de coder quoi que ce soit lié aux marques
- Les deux marques (Intact et belairdirect) ne se mélangent JAMAIS
- Le prototype doit WOW le client pour qu'il approuve le projet complet
- C'est un prototype de vision, pas une app fonctionnelle — le polish UI > les features complètes
- Le résumé exportable est NON-NÉGOCIABLE
- La conversation AI doit être RÉELLE (Claude API), pas simulée avec des réponses hardcodées
- Le client doit TAPER des réponses, pas juste cliquer sur des boutons
```
