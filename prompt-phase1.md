# Prompt Phase 1 — À coller dans Claude Code

```
Lis d'abord les fichiers suivants dans l'ordre : CLAUDE.md, soul.md, memory.md, user.md, brand-reconnaissance-studio-ai.md

Puis build le prototype Phase 1 de Studio AI — une web app Next.js/React/Tailwind/TypeScript.

## Ce que tu dois construire

Le prototype s'ouvre sur un BRAINSTORM INTERACTIF. Ce n'est PAS un chat AI classique. C'est une expérience d'onboarding où l'agent AI guide le client (direction du Creative & Brand Studio d'Intact) à travers la vision de la plateforme Studio AI.

### Le brainstorm, c'est quoi exactement :

L'agent AI est le présentateur. Il MÈNE la conversation. Le client ne connaît pas ce que Claude/AI peut faire — c'est à l'agent de proposer, montrer, inspirer.

Le flow :
1. L'agent se présente ("Je suis votre partenaire créatif AI pour le Studio. Je connais les marques Intact et belairdirect en profondeur.")
2. L'agent demande les pain points de l'équipe ("Qu'est-ce qui prend trop de temps? Qu'est-ce qui est répétitif?")
3. Basé sur les réponses, l'agent PROPOSE des solutions concrètes et les DÉMO dans le UI — pas juste du texte, mais des previews visuelles
4. L'agent suggère des capacités que le client n'a pas imaginées ("Saviez-vous que je peux switcher entre la voix Intact et belairdirect instantanément? Regardez...")
5. L'agent montre le concept du template editor, le catalogue de micro-apps, la génération de contenu brand-aware
6. À chaque étape : l'agent mène avec des idées, le client réagit et raffine

### Ce que le brainstorm N'EST PAS :
- Un formulaire de questions
- Un chat passif qui attend les commandes du client
- L'outil de travail quotidien de l'équipe (ça c'est l'après, une fois le projet approuvé)

### Ce que le brainstorm EST :
- Un pitch deck vivant — le prototype SE présente en étant lui-même
- L'agent propose, le client découvre ce qui est possible en le vivant
- L'énergie = "tout est possible", surprise et émerveillement

## Design direction

Le UI s'inspire d'intact.ca (mars 2026). Voir la section "UI Inspiration from intact.ca" dans CLAUDE.md pour les patterns exacts. Points clés :
- Fond Soothing Sand (#F7F2EA) alternant avec blanc — PAS tout blanc
- Double nav bar (utility bar + main nav avec logo et CTA rouge)
- Cards blanches sur fond sand, icônes ligne, généreux spacing
- Primary CTA : red filled pill (#D11338). Secondary : black outlined
- Typography : Inter pour le platform UI. Hiérarchie large titres → bold labels → body regular
- PAS dark mode. Minimal, chirurgical, chaque pixel gagne sa place.

## Stack

Next.js 14+ / React 18+ / TypeScript strict / Tailwind CSS. Déploiement Vercel.

## Important

- Lis brand-reconnaissance-studio-ai.md AVANT de coder quoi que ce soit lié aux marques
- Les deux marques (Intact et belairdirect) ne se mélangent JAMAIS
- Le prototype doit WOW le client pour qu'il approuve le projet complet
- C'est un prototype de vision, pas une app fonctionnelle — le polish UI > les features
```
