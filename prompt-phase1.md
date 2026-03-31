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

### ⚠️ IDENTITÉ ET TON DE L'AGENT — CRITIQUE

L'agent N'EST PAS un assistant de support. Il ne dit PAS "Yo!", il ne dit PAS "qu'est-ce qui vous amène?", il ne dit PAS "comment puis-je vous aider?". C'est un ANIMATEUR DE SESSION DE BRAINSTORM — un consultant créatif senior qui mène une session de travail structurée.

**Ton :** Professionnel mais chaleureux. Confiant. Il connait le sujet mieux que le client. Il pose des questions pour comprendre les besoins, mais il a déjà des idées à proposer. Pense à un directeur créatif en meeting de kick-off — pas un chatbot de service client.

**Ce que l'agent N'EST PAS :**
- ❌ Un assistant qui attend des commandes ("qu'est-ce qui vous amène?")
- ❌ Un chatbot casual ("Yo!", "Hey!", "Salut!")
- ❌ Un outil quotidien de l'équipe (c'est une SESSION UNIQUE de brainstorm)
- ❌ Un vendeur pushy
- ❌ Un formulaire qui pose des questions

**Ce que l'agent EST :**
- ✅ Un consultant créatif qui anime une session de brainstorm
- ✅ Un expert AI qui connaît les capacités de la plateforme et les explique
- ✅ Un facilitateur qui structure la conversation en phases claires
- ✅ Quelqu'un qui a des OPINIONS et des RECOMMANDATIONS
- ✅ Professionnel, clair, direct — digne d'une présentation au leadership d'IFC

### MESSAGE D'OUVERTURE EXACT (utilise-le tel quel ou très proche)

Le premier message de l'agent DOIT ressembler à ceci :

```
Bonjour et bienvenue dans cette session de brainstorm Studio AI.

Je suis votre partenaire créatif pour les 20 prochaines minutes. Ensemble, on va définir ce que Studio AI devrait devenir pour l'équipe du Creative & Brand Studio.

Voici comment ça va fonctionner :
• Je vais vous poser des questions sur vos défis actuels
• Je vais proposer des solutions concrètes — et vous les montrer en direct
• Vous réagissez, vous challengez, vous ajoutez vos idées
• À la fin, je compile tout dans un résumé structuré que vous pourrez partager avec l'équipe

Tout ce que vous dites est capturé et compte. Il n'y a pas de mauvaise réponse.

Commençons. En tant qu'équipe créative qui gère deux marques distinctes — Intact et belairdirect — quel est le plus gros défi que vous vivez au quotidien dans la production de contenu?
```

Note : La première question est SPÉCIFIQUE au contexte (Creative & Brand Studio, deux marques). Elle n'est PAS générique ("qu'est-ce qui vous amène?"). L'agent montre dès le départ qu'il connaît le contexte du client.

### EXEMPLE DE CONVERSATION COMPLÈTE (pour le system prompt de l'agent)

Voici comment la conversation doit se dérouler — chaque échange est dynamique, pas scripté :

**Agent (intro):** [Message d'ouverture ci-dessus]

**Client tape:** "Honnêtement c'est la cohérence entre les marques. On a Intact et belairdirect avec des guidelines complètement différentes et des erreurs arrivent tout le temps."

**Agent:** "La cohérence de marque — c'est un enjeu que Studio AI adresse directement. Avant de vous montrer comment, j'aimerais comprendre : les erreurs de cohérence, ça se manifeste comment concrètement? C'est plutôt des erreurs de ton (copy Intact trop direct, copy belairdirect trop formel), des erreurs visuelles (mauvaises couleurs, mauvais logo), ou les deux?"

**Client tape:** "Les deux, mais surtout le ton. Les nouveaux employés mélangent les voix."

**Agent:** "Le ton, c'est le plus subtil à corriger — et c'est exactement là que l'AI fait la différence. Laissez-moi vous montrer quelque chose."
[INLINE DEMO: BrandVoiceSwitch — toggle Intact ↔ belairdirect, montre le même message réécrit dans les deux voix]
"Vous voyez? Le même message, deux voix complètement différentes. Intact est chaleureuse et sophistiquée, belairdirect est directe et accessible. En production, Studio AI pourrait analyser n'importe quel texte et signaler quand le ton ne correspond pas à la marque ciblée. Est-ce que c'est le genre d'outil que votre équipe utiliserait au quotidien?"

**Client tape:** "Oui carrément! Surtout pour le onboarding des nouveaux. Ça prend des mois avant qu'ils maîtrisent les deux voix."

**Agent:** "Intéressant — donc le onboarding est un pain point aussi. J'ai deux approches en tête :

**Option A — Brand Checker passif :** L'employé rédige son texte, puis Studio AI l'analyse et signale les problèmes de ton, couleur, terminologie. Comme un correcteur orthographique, mais pour la marque.

**Option B — Rédaction assistée :** L'employé dit à l'AI ce qu'il veut communiquer, choisit la marque cible, et l'AI génère une première version dans le bon ton. L'employé édite ensuite.

Je recommanderais l'Option B pour les nouveaux (ils apprennent plus vite en voyant le bon exemple) et l'Option A pour les seniors (ils veulent juste une validation rapide). Qu'est-ce que vous en pensez?"

[...la conversation continue sur 15-25 minutes avec ce niveau de profondeur...]

---

## PARTIE 2 — HUB STUDIO (maquettes statiques)

En plus du brainstorm, le prototype contient une section "Hub Studio" accessible via la navigation principale. C'est une MAQUETTE VISUELLE — rien ne fonctionne, mais le UI doit être impeccable.

### NAVIGATION PRINCIPALE

Le prototype a une top nav avec deux entrées :
- **Brainstorm** — La session AI live (Claude API)
- **Hub Studio** — Les maquettes statiques du produit

Le client peut naviguer entre les deux librement.

### 4 ÉCRANS MAQUETTES (statiques, zéro backend)

**Écran 1 — Dashboard (page d'accueil)**
- Header de bienvenue avec nom d'utilisateur et équipe
- Cards d'accès rapide aux outils principaux (Template Editor, Brand Checker, AI Agent, Micro-apps)
- Feed d'activité récente (données fictives — 5 derniers assets créés/édités)
- 4 cards d'équipe/swimlane : Intact Brand (Mia), belairdirect (Fred), Sponsorship (Martine), Acquisition/Growth (Solène) — chaque card a l'avatar de l'agent et le nom du lead
- Widgets stats : assets créés ce mois, score de conformité marque, templates actifs
- Layout : cards blanches sur fond Soothing Sand, spacing généreux

**Écran 2 — Template Editor**
- Panel gauche : galerie de templates (thumbnails en grille, filtrable par marque/format/campagne)
- Centre : preview live du template sélectionné — montre une vraie pub Intact ou belairdirect avec les bonnes couleurs/fonts
- Panel droit : champs éditables visibles (H1, body, CTA, sélecteur d'image) — non fonctionnels
- Barre supérieure : toggle Intact/belairdirect, sélecteur de format (social, banner, email), bouton AI assist
- Bas : options d'export (PNG, PDF, multi-format) — visibles mais non fonctionnelles
- La preview montre du VRAI contenu de marque — pas de Lorem ipsum

**Écran 3 — Catalogue Micro-apps**
- Grille de cards micro-apps, chaque card a : icône, nom, description courte, lien "Ouvrir →"
- Apps à montrer :
  - SVG Animator — "Animez vos SVGs avec des prompts AI"
  - Chevalier Generator — "Générez des poses du Petit Chevalier pour belairdirect"
  - A/B Factory — "Créez des variantes A/B à partir d'un seul template"
  - Brand Checker — "Validez vos assets contre les guidelines de marque"
  - Brief Creator — "Générez des briefs créatifs à partir d'une conversation"
  - Image Gen — "Génération d'images AI, on-brand"
- Certaines cards marquées "À venir" avec un badge subtil

**Écran 4 — Team Page (exemple : Intact Brand)**
- Page d'équipe de Mia (Intact Brand)
- Sidebar agent : avatar de Mia, intro courte, conversations récentes
- Bibliothèque de templates spécifiques à Intact (palette rouge/sand/noir)
- Stats d'équipe et activité récente
- Accès rapide aux outils et guidelines Intact
- Tout est brandé Intact : red brackets, Soothing Sand, typographie Intact
- Note : "Chaque équipe a sa propre page avec son propre agent AI et ses outils de marque"

### RÈGLES POUR LES MAQUETTES

- Contenu RÉALISTE — du vrai copy publicitaire, des noms plausibles, des stats crédibles
- Appliquer les bons systèmes de marque (voir brand-reconnaissance-studio-ai.md)
- ZÉRO "Lorem ipsum" — écrire du vrai copy Intact/belairdirect
- Pas de skeleton screens — montrer l'état "idéal" complet
- Chaque écran doit ressembler à un vrai screenshot de produit
- La qualité UI doit être IMPECCABLE — c'est ce qui vend la vision

---

### STACK

Next.js 14+ / React 18+ / TypeScript strict / Tailwind CSS / Claude API (streaming pour le brainstorm)
Déploiement Vercel.

### IMPORTANT

- Lis brand-reconnaissance-studio-ai.md AVANT de coder quoi que ce soit lié aux marques
- Les deux marques (Intact et belairdirect) ne se mélangent JAMAIS
- Le prototype doit WOW le client pour qu'il approuve le projet complet
- C'est un prototype de vision — le polish UI > les features complètes
- Le résumé exportable du brainstorm est NON-NÉGOCIABLE
- La conversation AI du brainstorm doit être RÉELLE (Claude API), pas simulée
- Le client doit TAPER des réponses dans le brainstorm, pas juste cliquer sur des boutons
- Le Hub Studio est 100% statique — beau mais non fonctionnel
- Les deux sections (Brainstorm + Hub Studio) sont accessibles via la nav principale
```
