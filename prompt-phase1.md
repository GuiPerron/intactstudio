# Prompt Phase 1 — À coller dans Claude Code

```
Lis d'abord les fichiers suivants dans l'ordre : CLAUDE.md, soul.md, memory.md, user.md, brand-reconnaissance-studio-ai.md

Puis build le prototype Phase 1 de Studio AI — une web app Next.js/React/Tailwind/TypeScript.

## Ce que tu dois construire

Le prototype s'ouvre sur un BRAINSTORM INTERACTIF. C'est une session de travail collaborative qui fait DEUX choses en même temps :
1. Vendre la vision de Studio AI par des démos live
2. Collecter du feedback structuré du client pour le futur projet

### Le brainstorm, c'est quoi exactement :

C'est une vraie session de brainstorm — comme quand un designer et un client travaillent ensemble pour définir un projet. L'agent AI MÈNE la conversation, PROPOSE des idées, MONTRE des démos, et CAPTURE les réactions du client à chaque étape.

### Méthodologie du brainstorm :

- UNE question à la fois — jamais un mur de questions
- Privilégier les choix multiples quand c'est possible (plus facile à répondre, plus facile à capturer)
- Pour chaque sujet : proposer 2-3 approches concrètes avec trade-offs, laisser le client choisir/raffiner
- Présenter les idées en petits morceaux digestibles, valider chaque section avant de continuer
- L'agent RECOMMANDE une approche et explique POURQUOI — il a une opinion, pas juste des options

### Le flow en 6 étapes :

1. **Introduction** — L'agent se présente ET explique le format de la session : "On va brainstormer ensemble ce que Studio AI devrait être. Je vais proposer des idées, vous montrer des démos, et capturer votre feedback. À la fin, vous recevrez un résumé propre de tout ce qu'on a décidé."

2. **Découverte des pain points** — "Qu'est-ce qui prend trop de temps? Qu'est-ce qui est répétitif? Où les erreurs de marque arrivent-elles?" (une question à la fois, avec des choix suggérés basés sur la connaissance du Creative & Brand Studio)

3. **Propositions de features** — Basé sur les réponses, l'agent PROPOSE des solutions concrètes avec 2-3 options par feature. Il DEMO chaque option dans le UI. Le client réagit, l'agent capture la préférence.

4. **Surprise & émerveillement** — L'agent montre des capacités que le client n'a pas imaginées : switch de voix Intact/belairdirect en live, brand checker instantané, template editor avec preview, etc.

5. **Priorisation** — L'agent demande au client de CLASSER les features par priorité (template editor? brand checker? micro-apps? AI content gen? SVG animator?)

6. **Résumé & export** — L'agent produit un document de synthèse structuré et propre :
   - Pain points identifiés
   - Solutions proposées et réactions du client
   - Priorités de features (classées)
   - Décisions prises pendant la session
   - Prochaines étapes
   - Ce résumé est TÉLÉCHARGEABLE/EXPORTABLE comme livrable

### Ce que le brainstorm CAPTURE (données structurées) :
- Pain points et leur sévérité
- Préférences de features (oui/non/peut-être + niveau de priorité)
- Besoins spécifiques par marque/swimlane
- Réactions du client à chaque démo (enthousiaste, neutre, sceptique)
- Idées et suggestions libres du client
- Priorités classées pour Phase 2

### Ce que le brainstorm N'EST PAS :
- Un formulaire de questions passif
- Un chat qui attend les commandes du client
- L'outil de travail quotidien de l'équipe (ça c'est l'après)
- Une présentation PowerPoint déguisée

### Ce que le brainstorm EST :
- Une session de travail collaborative vivante
- L'agent propose, le client découvre ET donne du feedback exploitable
- Chaque interaction génère des données utiles pour le projet
- L'énergie = "tout est possible" + "on construit ça ensemble"
- Un LIVRABLE propre à la fin — pas juste une conversation qui disparaît

## Design direction

Le UI s'inspire d'intact.ca (mars 2026). Voir la section "UI Inspiration from intact.ca" dans CLAUDE.md pour les patterns exacts. Points clés :
- Fond Soothing Sand (#F7F2EA) alternant avec blanc — PAS tout blanc
- Double nav bar (utility bar + main nav avec logo et CTA rouge)
- Cards blanches sur fond sand, icônes ligne, généreux spacing
- Primary CTA : red filled pill (#D11338). Secondary : black outlined
- Typography : Inter pour le platform UI. Hiérarchie large titres → bold labels → body regular
- PAS dark mode. Minimal, chirurgical, chaque pixel gagne sa place.

## UI spécifique au brainstorm

- Les questions à choix multiples doivent avoir un UI propre (cards cliquables, pas des radio buttons basiques)
- Les réactions du client doivent être visuellement capturées (badge "priorité haute", indicateurs de préférence)
- Le progress indicator montre où on en est dans les 6 étapes
- Le résumé final doit avoir un bouton d'export bien visible
- Les démos inline doivent apparaître dans le flow de conversation (pas dans une fenêtre séparée)

## Stack

Next.js 14+ / React 18+ / TypeScript strict / Tailwind CSS. Déploiement Vercel.

## Important

- Lis brand-reconnaissance-studio-ai.md AVANT de coder quoi que ce soit lié aux marques
- Les deux marques (Intact et belairdirect) ne se mélangent JAMAIS
- Le prototype doit WOW le client pour qu'il approuve le projet complet
- C'est un prototype de vision, pas une app fonctionnelle — le polish UI > les features
- Le résumé exportable est NON-NÉGOCIABLE — c'est le livrable concret de la session
```
