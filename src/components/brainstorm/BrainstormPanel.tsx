"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { StepId, SessionData, FeatureOption } from "@/lib/brainstorm/types";
import { StepIndicator } from "./StepIndicator";
import { BrainstormMessage } from "./BrainstormMessage";
import { BrainstormInput } from "./BrainstormInput";
import { WelcomeHero } from "./WelcomeHero";
import { ChoiceCards } from "./ChoiceCards";
import { FeatureReaction } from "./FeatureReaction";
import { DemoBrandVoice } from "./DemoBrandVoice";
import { PriorityRanker } from "./PriorityRanker";
import { SessionSummary } from "./SessionSummary";

// ── Block types for the conversation flow ──
type Block =
  | { type: "agent"; content: string; id: string }
  | { type: "user"; content: string; id: string }
  | { type: "streaming"; content: string; id: string }
  | { type: "choices"; id: string; question: string; options: { id: string; label: string; description?: string }[]; multi: boolean }
  | { type: "features"; id: string; features: FeatureOption[] }
  | { type: "demo-voice"; id: string }
  | { type: "priority"; id: string; items: { id: string; label: string; icon: string }[] }
  | { type: "summary"; id: string; data: SessionData };

// ── Feature catalog ──
const FEATURES: FeatureOption[] = [
  {
    id: "template-editor",
    icon: "📐",
    title: "Template Editor",
    description:
      "Éditeur de templates avec live preview, champs éditables (H1, texte, image, CTA), options visuelles pré-approuvées, et export PNG multi-format.",
  },
  {
    id: "ai-content",
    icon: "✍️",
    title: "Génération de contenu AI",
    description:
      "Rédaction de copy on-brand pour les deux marques. Headlines, body copy, CTAs, adaptations FR/EN — toujours dans la voix de la bonne marque.",
  },
  {
    id: "brand-checker",
    icon: "🔍",
    title: "Brand Checker",
    description:
      "Vérification instantanée de la conformité de marque. Couleurs, typo, ton de voix, utilisation du logo — détection automatique des violations.",
  },
  {
    id: "svg-animator",
    icon: "🎬",
    title: "SVG Animator",
    description:
      "Animation de SVG pour les réseaux sociaux et le web. Transitions, entrées, boucles — exportables en format optimisé.",
  },
  {
    id: "chevalier-gen",
    icon: "🛡️",
    title: "Chevalier Generator",
    description:
      "Générateur de poses et scènes pour le Petit Chevalier de belairdirect. Scénarios saisonniers, accessoires, décors thématiques.",
  },
  {
    id: "ab-factory",
    icon: "🧪",
    title: "A/B Factory",
    description:
      "Génération de variantes A/B pour les campagnes. Comparer les headlines, les visuels, les CTAs — avec prévisualisation côte à côte.",
  },
];

// ── Priority items ──
const PRIORITY_ITEMS = FEATURES.map((f) => ({
  id: f.id,
  label: f.title,
  icon: f.icon,
}));

// ── Pain point options ──
const PAIN_POINT_OPTIONS = [
  {
    id: "brand-consistency",
    label: "Cohérence de marque",
    description:
      "Difficile de maintenir la cohérence visuelle et tonale entre les deux marques et toutes les plateformes.",
  },
  {
    id: "repetitive-tasks",
    label: "Tâches répétitives",
    description:
      "Beaucoup de temps passé sur des adaptations de format, redimensionnements, et variations mineures.",
  },
  {
    id: "bilingual-adaptation",
    label: "Adaptations bilingues",
    description:
      "Le passage FR/EN prend du temps et parfois le ton de marque se perd dans la traduction.",
  },
  {
    id: "approval-bottleneck",
    label: "Goulot d'approbation",
    description:
      "Les cycles de révision et d'approbation ralentissent la production créative.",
  },
  {
    id: "brand-knowledge",
    label: "Diffusion du savoir marque",
    description:
      "Les guidelines de marque ne sont pas toujours bien comprises ou accessibles par tous.",
  },
  {
    id: "template-management",
    label: "Gestion des templates",
    description:
      "Pas de système centralisé pour les templates — versions multiples, fichiers éparpillés.",
  },
];

export function BrainstormPanel() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState<StepId>("intro");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [interactionLocked, setInteractionLocked] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Session data
  const [sessionData, setSessionData] = useState<SessionData>({
    painPoints: [],
    features: [...FEATURES],
    priorities: [],
    freeNotes: [],
  });

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [blocks, scrollToBottom]);

  // ── Helper: add block ──
  const addBlock = useCallback(
    (block: Block) => {
      setBlocks((prev) => [...prev, block]);
      scrollToBottom();
    },
    [scrollToBottom]
  );

  // ── Helper: animated agent message ──
  const addAgentMessage = useCallback(
    (content: string) => {
      return new Promise<void>((resolve) => {
        const id = crypto.randomUUID();
        const streamBlock: Block = { type: "streaming", content: "", id };
        setBlocks((prev) => [...prev, streamBlock]);
        setInteractionLocked(true);

        let charIndex = 0;
        const interval = setInterval(() => {
          charIndex += 4;
          if (charIndex >= content.length) {
            setBlocks((prev) =>
              prev.map((b) =>
                b.id === id ? { type: "agent", content, id } : b
              )
            );
            setInteractionLocked(false);
            clearInterval(interval);
            resolve();
          } else {
            setBlocks((prev) =>
              prev.map((b) =>
                b.id === id
                  ? { ...b, content: content.slice(0, charIndex) }
                  : b
              )
            );
          }
          scrollToBottom();
        }, 10);
      });
    },
    [scrollToBottom]
  );

  // ── Step 1: Introduction ──
  const startBrainstorm = useCallback(async () => {
    setStarted(true);
    setCurrentStep("intro");

    await addAgentMessage(
      `Bonjour! 👋 Je suis **Studio AI**, votre partenaire créatif pour les marques Intact et belairdirect.\n\nOn va brainstormer ensemble ce que cette plateforme devrait être. Je vais **proposer des idées**, vous **montrer des démos en direct**, et **capturer votre feedback** à chaque étape.\n\nÀ la fin de notre session, vous recevrez un **résumé propre et exportable** de tout ce qu'on aura décidé — pain points, features prioritaires, et prochaines étapes.\n\nPrêt à commencer?`
    );

    // Transition to discovery
    setTimeout(async () => {
      setCurrentStep("discovery");
      await addAgentMessage(
        `Parfait! Commençons par comprendre votre réalité.\n\n**Quels sont les plus grands défis créatifs de votre équipe en ce moment?**\n\nJ'ai identifié les pain points les plus fréquents dans les équipes de création en assurance. Sélectionnez ceux qui résonnent avec vous :`
      );
      addBlock({
        type: "choices",
        id: crypto.randomUUID(),
        question: "Sélectionnez vos principaux défis",
        options: PAIN_POINT_OPTIONS,
        multi: true,
      });
    }, 800);
  }, [addAgentMessage, addBlock]);

  // ── Handle pain point selection ──
  const handlePainPointsSelected = useCallback(
    async (selectedIds: string[]) => {
      const selected = PAIN_POINT_OPTIONS.filter((p) =>
        selectedIds.includes(p.id)
      );

      // Update session data
      setSessionData((prev) => ({
        ...prev,
        painPoints: selected.map((p) => ({
          id: p.id,
          label: p.label,
          severity: "high" as const,
          selected: true,
        })),
      }));

      // User response
      addBlock({
        type: "user",
        content: selected.map((p) => p.label).join(", "),
        id: crypto.randomUUID(),
      });

      // Agent acknowledges and transitions to features
      const painLabels = selected.map((p) => `**${p.label}**`).join(", ");
      await addAgentMessage(
        `Excellent choix. ${painLabels} — ce sont exactement les problèmes que Studio AI est conçu pour résoudre.\n\nMaintenant, laissez-moi vous montrer **les features que je recommande** pour adresser ces défis. Pour chacune, dites-moi votre réaction — ça va m'aider à comprendre vos priorités.`
      );

      setCurrentStep("features");
      addBlock({
        type: "features",
        id: crypto.randomUUID(),
        features: FEATURES,
      });
    },
    [addAgentMessage, addBlock]
  );

  // ── Handle feature reactions ──
  const handleFeatureReactions = useCallback(
    async (
      reactions: Record<string, "love" | "like" | "neutral" | "skip">
    ) => {
      const updatedFeatures = FEATURES.map((f) => ({
        ...f,
        reaction: reactions[f.id],
      }));

      setSessionData((prev) => ({ ...prev, features: updatedFeatures }));

      const loved = updatedFeatures.filter((f) => f.reaction === "love");
      const lovedNames = loved.map((f) => `**${f.title}**`).join(", ");

      addBlock({
        type: "user",
        content: `Réactions enregistrées pour ${updatedFeatures.length} features`,
        id: crypto.randomUUID(),
      });

      // Transition to demos
      setCurrentStep("surprise");
      await addAgentMessage(
        `${loved.length > 0 ? `${lovedNames} — je vois que ça vous parle! ` : ""}Maintenant, laissez-moi vous **montrer quelque chose en direct**.\n\nUne des capacités centrales de Studio AI, c'est de **switcher instantanément entre les voix de marque** Intact et belairdirect. Essayez — cliquez pour voir la différence :`
      );

      addBlock({ type: "demo-voice", id: crypto.randomUUID() });
    },
    [addAgentMessage, addBlock]
  );

  // ── Handle demo complete ──
  const handleDemoComplete = useCallback(async () => {
    addBlock({
      type: "user",
      content: "Impressionnant, la différence est flagrante!",
      id: crypto.randomUUID(),
    });

    await addAgentMessage(
      `Exactement! Et ce n'est qu'un aperçu. En production, Studio AI pourrait :\n\n- **Vérifier automatiquement** qu'un visuel respecte les guidelines de marque\n- **Générer du contenu bilingue** en gardant le ton de chaque marque\n- **Proposer des concepts de campagne** basés sur les objectifs de votre swimlane\n- **Animer des SVG** et générer des poses du Petit Chevalier\n\nMaintenant, dernière étape avant le résumé — **classez ces features par priorité** pour la Phase 2 :`
    );

    setCurrentStep("priorities");
    addBlock({
      type: "priority",
      id: crypto.randomUUID(),
      items: PRIORITY_ITEMS,
    });
  }, [addAgentMessage, addBlock]);

  // ── Handle priorities ──
  const handlePrioritiesSubmit = useCallback(
    async (orderedIds: string[]) => {
      const orderedLabels = orderedIds.map(
        (id) => FEATURES.find((f) => f.id === id)?.title || id
      );

      setSessionData((prev) => ({
        ...prev,
        priorities: orderedLabels,
      }));

      addBlock({
        type: "user",
        content: `Priorités: ${orderedLabels.join(" → ")}`,
        id: crypto.randomUUID(),
      });

      setCurrentStep("summary");
      await addAgentMessage(
        `Merci! Voici le **résumé complet de notre session de brainstorm**. Vous pouvez l'exporter comme livrable pour partager avec l'équipe.`
      );

      addBlock({
        type: "summary",
        id: crypto.randomUUID(),
        data: {
          ...sessionData,
          priorities: orderedLabels,
        },
      });

      await addAgentMessage(
        `Et voilà! 🎉 Tout est capturé. Ce résumé est **téléchargeable en Markdown** — vous pouvez le partager avec l'équipe ou le convertir en document.\n\nSi vous avez d'autres questions ou si vous voulez explorer une feature en particulier, je suis là. Sinon, on a un excellent point de départ pour la **Phase 2** de Studio AI!`
      );
    },
    [addAgentMessage, addBlock, sessionData]
  );

  // ── AI-powered free text response ──
  const handleFreeText = useCallback(
    async (content: string) => {
      addBlock({
        type: "user",
        content,
        id: crypto.randomUUID(),
      });

      setSessionData((prev) => ({
        ...prev,
        freeNotes: [...prev.freeNotes, content],
      }));

      // Stream AI response
      const streamId = crypto.randomUUID();
      addBlock({ type: "streaming", content: "", id: streamId });
      setIsStreaming(true);

      try {
        const allMessages = blocks
          .filter((b) => b.type === "agent" || b.type === "user")
          .map((b) => ({
            role: b.type === "agent" ? ("assistant" as const) : ("user" as const),
            content: b.content,
          }));

        allMessages.push({ role: "user", content });

        const response = await fetch("/api/brainstorm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: allMessages }),
        });

        if (!response.ok) throw new Error("Request failed");

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error("No reader");

        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;
            const data = trimmed.slice(6);
            if (data === "[DONE]") break;

            try {
              const parsed = JSON.parse(data);
              setBlocks((prev) =>
                prev.map((b) =>
                  b.id === streamId && b.type === "streaming"
                    ? { ...b, content: b.content + parsed.text }
                    : b
                )
              );
              scrollToBottom();
            } catch {
              // skip
            }
          }
        }

        // Finalize the streaming block to agent block
        setBlocks((prev) =>
          prev.map((b): Block =>
            b.id === streamId && b.type === "streaming"
              ? { type: "agent", content: b.content, id: b.id }
              : b
          )
        );
      } catch {
        setBlocks((prev) =>
          prev.map((b): Block =>
            b.id === streamId
              ? { type: "agent", content: "Désolé, une erreur est survenue. Réessayons!", id: streamId }
              : b
          )
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [blocks, addBlock, scrollToBottom]
  );

  // ── Not started yet ──
  if (!started) {
    return <WelcomeHero onStart={startBrainstorm} />;
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <StepIndicator currentStep={currentStep} />

      {/* Conversation flow */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[800px] space-y-5 px-6 py-8">
          {blocks.map((block) => {
            switch (block.type) {
              case "agent":
                return (
                  <BrainstormMessage
                    key={block.id}
                    role="assistant"
                    content={block.content}
                  />
                );
              case "streaming":
                return (
                  <BrainstormMessage
                    key={block.id}
                    role="assistant"
                    content={block.content}
                    isStreaming
                  />
                );
              case "user":
                return (
                  <BrainstormMessage
                    key={block.id}
                    role="user"
                    content={block.content}
                  />
                );
              case "choices":
                return (
                  <div key={block.id} className="ml-14">
                    <ChoiceCards
                      question={block.question}
                      options={block.options}
                      multiSelect={block.multi}
                      onSubmit={handlePainPointsSelected}
                    />
                  </div>
                );
              case "features":
                return (
                  <div key={block.id} className="ml-14">
                    <FeatureReaction
                      features={block.features}
                      onComplete={handleFeatureReactions}
                    />
                  </div>
                );
              case "demo-voice":
                return (
                  <div key={block.id} className="ml-14">
                    <DemoBrandVoice onComplete={handleDemoComplete} />
                  </div>
                );
              case "priority":
                return (
                  <div key={block.id} className="ml-14">
                    <PriorityRanker
                      items={block.items}
                      onSubmit={handlePrioritiesSubmit}
                    />
                  </div>
                );
              case "summary":
                return (
                  <div key={block.id} className="ml-14">
                    <SessionSummary data={block.data} />
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>

      {/* Input — always available for free text */}
      <BrainstormInput
        onSend={handleFreeText}
        disabled={isStreaming || interactionLocked}
      />
    </div>
  );
}
