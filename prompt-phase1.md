# Prompt Phase 1 — À coller dans Claude Code

```
Lis d'abord les fichiers suivants dans l'ordre : CLAUDE.md, soul.md, memory.md, user.md, brand-reconnaissance-studio-ai.md

Puis build le prototype Phase 1 de Studio AI — une web app Next.js/React/Tailwind/TypeScript.

## CE QUE TU DOIS CONSTRUIRE

Un prototype de plateforme créative. Le client arrive directement sur le **Hub Studio** — le dashboard de la plateforme. De là, il navigue entre les différents outils et écrans. La plupart sont des maquettes statiques (beau UI, zéro backend), sauf deux éléments fonctionnels :

1. **Brief Creator** — FONCTIONNEL. Le client peut créer un vrai brief avec le formulaire adaptatif.
2. **AI Agent sidebar** — FONCTIONNEL. Un chat panel Claude API (streaming) toujours disponible pour brainstormer un concept, poser des questions, ou aider avec le brief.

---

## ARCHITECTURE : HUB-FIRST

### Dashboard (page d'accueil)

Le client arrive ici. C'est la page principale qui montre toute la plateforme :

- Header de bienvenue avec nom d'utilisateur et équipe
- Cards d'accès rapide aux outils principaux :
  - **Brief Creator** → ouvre le Brief Creator fonctionnel
  - **Template Editor** → ouvre la maquette du template editor
  - **Micro-apps** → ouvre le catalogue de micro-apps
  - **Team Pages** → ouvre l'exemple de Team Page (Intact Brand)
- Feed d'activité récente (données fictives — 5 derniers assets créés/édités)
- 4 cards d'équipe/swimlane : Intact Brand (Mia), belairdirect (Fred), Sponsorship (Martine), Acquisition/Growth (Solène)
- Widgets stats : assets créés ce mois, score de conformité marque, templates actifs
- Layout : cards blanches sur fond Soothing Sand (#F7F2EA), spacing généreux

### AI Agent Sidebar (FONCTIONNEL — Claude API)

Un chat panel toujours accessible (bouton flottant ou sidebar rétractable). C'est un vrai chat AI propulsé par Claude API en streaming.

**Ce que l'agent peut faire :**
- Brainstormer un concept de campagne ("J'ai besoin d'une campagne été 2026 pour belairdirect, conversion, multi-canal")
- Aider à remplir le brief ("Aide-moi à décrire l'audience cible pour cette campagne")
- Démontrer la connaissance des marques (switch voix Intact ↔ belairdirect, citer les guidelines)
- Proposer des angles créatifs, des messages clés, des déclinaisons par canal
- Répondre aux questions sur la plateforme

**Identité de l'agent :**
- N'EST PAS un assistant de support. Pas de "Yo!", "Hey!", "Comment puis-je vous aider?"
- EST un partenaire créatif senior — confiant, expert, a des opinions et des recommandations
- Ton : professionnel mais chaleureux. Directeur créatif en meeting de kick-off.
- Connaît le contexte : Creative & Brand Studio, 7 personnes, 4 swimlanes, deux marques distinctes

**System prompt de l'agent doit inclure :**
- Le contexte complet du Creative & Brand Studio (équipe, swimlanes, défis)
- Les guidelines des deux marques (de brand-reconnaissance-studio-ai.md)
- Instructions de ton et personnalité
- Capacité à proposer des idées et des approches (pas juste répondre passivement)

---

## BRIEF CREATOR (FONCTIONNEL — la star de la démo)

Le Brief Creator est la feature interactive principale. Le client l'utilise vraiment. C'est un brief adaptatif assisté par AI.

**Référence UI :** guip.ca/brief pour le pattern et le flow.

### Étape 1 — Triage (3 questions rapides, cards cliquables)

1. "C'est quoi l'objectif?" — Notoriété / Conversion / Engagement / Lancement / Interne
   - Cards avec icône + titre + description courte
   - Sélection = border rouge + checkmark

2. "C'est urgent?" — ASAP (5 jours) / 2 semaines / Flexible
   - Même pattern de cards

3. "Quel volume?" — Petit (1-3 assets, un canal) / Moyen (5-15 assets, multi-canal) / Grand (Campagne complète, déclinaisons)

Progress bar en haut (3 segments rouges qui se remplissent).
Bouton "Suivant →" (red pill) + "← Retour".
Les 3 réponses apparaissent ensuite comme chips en haut du formulaire (ex: "🎯 Notoriété · 📅 2 semaines · 📦 Moyen · ✏️ Modifier").

### Étape 2 — Formulaire adaptatif

Les champs qui apparaissent CHANGENT selon les réponses du triage. C'est le différenciateur clé.

**Sections toujours présentes :**

**Projet & demandeur**
- Nom du projet (placeholder: "ex: Campagne été 2026 belairdirect")
- Ton nom + équipe (placeholder: "ex: Guillaume Perron, Marketing")
- Bouton "Brainstorm" rouge — ouvre le chat AI pour aider à nommer/cadrer le projet

**Marque & marché**
- Chips de marque sélectionnables : belairdirect, belairdirect Affinity, IFC, Jiffy, Intact Insurance, NBI, Scotia
- Chips province/langue : QC FR, QC EN, ON, AB, ATL, NS, NL, NB, PEI

**Ton brief**
- Zone texte libre (placeholder: "Décris le contexte, l'objectif, tes idées initiales, l'audience cible, le message clé...")
- Astuce jaune : "Un bon brief répond à : Pourquoi (contexte business), Quoi (livrables), Pour qui (audience), et Comment on mesure le succès."
- Bouton "Brainstorm" — l'AI aide à rédiger cette section

**De quoi as-tu besoin?** (liste sélectionnable, items toggle on/off)
- Design — Visuels statiques, layouts, assets
- Motion video — Animation, vidéo, reels
- Creative strategy — Concept, direction, positionnement
- Landing page — Page web, LP, microsite
- Illustrations — Illustrations custom, icônes
- Copy — Rédaction, slogans, scripts
- UGC — User-generated content

**Champs conditionnels (apparaissent selon la sélection) :**
- **Si Copy est sélectionné** → Ton souhaité, Messages clés, Volume de mots, Références
- **Si Motion video est sélectionné** → Durée, Format (reel/TVC/social), Notes storyboard, Voiceover
- **Si Campagne complète (volume = Grand)** → Timeline de campagne, Exigences cross-canal, Budget indicatif

**Specs & deadline**
- Date limite (date picker) + rappel intelligent "Tu as dit 2 semaines" (basé sur le triage)
- Canaux & tailles (zone texte: "Sur quels canaux? Quelles tailles par canal?")
- Notes & références (zone texte: "Insights, benchmarks, moodboard, références visuelles, liens...")
- Bouton "Brainstorm" — l'AI aide avec les specs

### Étape 3 — Validation AI

- Indicateur de complétion (0% → 100%) en haut à droite — vérifie les champs requis en temps réel
- L'AI review le brief et signale les gaps : "Ton brief ne mentionne pas l'audience cible — veux-tu l'ajouter?"
- Bouton "Voir le récapitulatif" → vue propre du brief complet, exportable (Markdown ou PDF)

---

## ÉCRANS MAQUETTES (statiques, zéro backend)

### Template Editor (maquette)

- Panel gauche : galerie de templates (thumbnails en grille, filtrable par marque/format/campagne)
- Centre : preview live du template sélectionné — montre une VRAIE pub Intact ou belairdirect avec les bonnes couleurs/fonts/copy
- Panel droit : champs éditables visibles (H1, body, CTA, sélecteur d'image) — non fonctionnels
- Barre supérieure : toggle Intact/belairdirect, sélecteur de format (social, banner, email), bouton AI assist
- Bas : options d'export (PNG, PDF, multi-format) — visibles mais non fonctionnelles
- La preview montre du VRAI contenu de marque — pas de Lorem ipsum

### Catalogue Micro-apps (maquette)

Grille de cards micro-apps :
- SVG Animator — "Animez vos SVGs avec des prompts AI"
- Chevalier Generator — "Générez des poses du Petit Chevalier pour belairdirect"
- A/B Factory — "Créez des variantes A/B à partir d'un seul template"
- Brand Checker — "Validez vos assets contre les guidelines de marque"
- Brief Creator — "Briefs créatifs adaptatifs propulsés par l'AI" (ce card link vers le Brief Creator fonctionnel)
- Image Gen — "Génération d'images AI, on-brand"
- Certaines cards marquées "À venir"

### Team Page — Intact Brand (maquette)

- Page d'équipe de Mia (Intact Brand)
- Sidebar agent : avatar de Mia, intro courte, conversations récentes
- Bibliothèque de templates spécifiques à Intact (palette rouge/sand/noir)
- Stats d'équipe et activité récente
- Tout est brandé Intact : red brackets, Soothing Sand, typographie Intact
- Note : "Chaque équipe a sa propre page avec son propre agent AI et ses outils de marque"

---

## RÈGLES GÉNÉRALES

### Design direction
- UI inspiré d'intact.ca (mars 2026) — voir CLAUDE.md section "UI Inspiration from intact.ca"
- Fond Soothing Sand (#F7F2EA) alternant avec blanc — PAS tout blanc
- Primary CTA : red filled pill (#D11338). Secondary : black outlined
- Typography : Inter pour le platform UI
- Cards blanches sur fond sand, icônes ligne, spacing généreux
- PAS dark mode. Minimal, chirurgical, chaque pixel gagne sa place.

### Contenu
- RÉALISTE — du vrai copy publicitaire, des noms plausibles, des stats crédibles
- Appliquer les bons systèmes de marque (voir brand-reconnaissance-studio-ai.md)
- ZÉRO "Lorem ipsum" — écrire du vrai copy Intact/belairdirect
- Pas de skeleton screens — montrer l'état "idéal" complet
- Chaque écran doit ressembler à un vrai screenshot de produit

### Stack
Next.js 14+ / React 18+ / TypeScript strict / Tailwind CSS / Claude API (streaming pour l'agent)
Déploiement Vercel.

### Important
- Lis brand-reconnaissance-studio-ai.md AVANT de coder quoi que ce soit lié aux marques
- Les deux marques (Intact et belairdirect) ne se mélangent JAMAIS
- Le prototype doit WOW le client pour qu'il approuve le projet complet
- C'est un prototype de vision — le polish UI > les features complètes
- Le Brief Creator est FONCTIONNEL — l'utilisateur peut vraiment créer un brief
- L'AI sidebar est FONCTIONNEL — vraie conversation Claude API
- Le reste est 100% maquette — beau mais non fonctionnel
- La qualité UI doit être IMPECCABLE — c'est ce qui vend la vision
```
