"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { StepId, SessionData, FeatureOption } from "@/lib/brainstorm/types";
import { StepIndicator } from "./StepIndicator";
import { BrainstormMessage } from "./BrainstormMessage";
import { BrainstormInput } from "./BrainstormInput";
import { WelcomeHero } from "./WelcomeHero";
import { DemoBrandVoice } from "./DemoBrandVoice";
import { PriorityRanker } from "./PriorityRanker";
import { SessionSummary } from "./SessionSummary";

// ── Blocks in the conversation ──
type Block =
  | { type: "agent"; content: string; id: string }
  | { type: "user"; content: string; id: string }
  | { type: "streaming"; content: string; id: string }
  | { type: "demo-voice"; id: string }
  | { type: "demo-template"; id: string }
  | { type: "demo-checker"; id: string }
  | { type: "priority"; id: string }
  | { type: "summary"; id: string; data: SessionData };

// ── Demo tag detection ──
const DEMO_TAGS: Record<string, Block["type"]> = {
  "[DEMO:brand-voice]": "demo-voice",
  "[DEMO:template-editor]": "demo-template",
  "[DEMO:brand-checker]": "demo-checker",
  "[DEMO:priority-ranker]": "priority",
  "[DEMO:session-summary]": "summary",
};

function extractReplies(text: string): { cleanText: string; replies: string[] } {
  const repliesMatch = text.match(/\[REPLIES:\s*"([^"]+)"(?:\s*\|\s*"([^"]+)")*\s*\]/);
  if (!repliesMatch) return { cleanText: text, replies: [] };

  // Extract all quoted strings from the tag
  const fullTag = repliesMatch[0];
  const replies: string[] = [];
  const quoteRegex = /"([^"]+)"/g;
  let match;
  while ((match = quoteRegex.exec(fullTag)) !== null) {
    replies.push(match[1]);
  }

  const cleanText = text.replace(fullTag, "").trim();
  return { cleanText, replies };
}

function extractDemoTags(text: string): { cleanText: string; demos: string[] } {
  let cleanText = text;
  const demos: string[] = [];

  for (const tag of Object.keys(DEMO_TAGS)) {
    if (cleanText.includes(tag)) {
      demos.push(tag);
      cleanText = cleanText.replace(new RegExp(`\\n?${tag.replace(/[[\]]/g, "\\$&")}\\n?`, "g"), "\n");
    }
  }

  return { cleanText: cleanText.trim(), demos };
}

// ── Phase detection based on conversation ──
function detectPhase(userMsgCount: number, content: string): StepId {
  const lowerContent = content.toLowerCase();
  if (lowerContent.includes("[demo:session-summary]")) return "summary";
  if (lowerContent.includes("[demo:priority")) return "priorities";
  if (userMsgCount === 0) return "intro";
  if (userMsgCount <= 2) return "discovery";
  if (userMsgCount <= 5) return "features";
  if (userMsgCount <= 7) return "surprise";
  if (userMsgCount <= 9) return "priorities";
  return "summary";
}

// ── Quick reply suggestions per phase ──
function getQuickReplies(phase: StepId, userMsgCount: number): string[] {
  // First response — answer the opening question
  if (userMsgCount === 0) {
    return [
      "La cohérence entre Intact et belairdirect",
      "Les déclinaisons multi-format et FR/EN",
      "Le volume de production vs la taille de l'équipe",
      "Pas d'outil centralisé — tout est éparpillé",
      "Les guidelines dans des PDFs que personne ne consulte",
      "Les allers-retours de validation qui bloquent tout",
    ];
  }

  // Discovery — follow-up responses
  if (phase === "discovery") {
    if (userMsgCount === 1) {
      return [
        "Surtout les erreurs de ton entre les deux marques",
        "Les deux — ton et visuels",
        "Les guidelines sont dans des PDFs de 50+ pages",
        "Ça arrive quotidiennement, ça impacte toute l'équipe",
        "Chaque swimlane a ses propres besoins mais les mêmes outils",
      ];
    }
    return [
      "Oui c'est exactement ça",
      "J'aimerais voir ce que vous proposez comme solutions",
      "Tout est éparpillé entre Figma, Teams et les emails",
      "On perd un temps fou sur les adaptations",
      "On peut passer aux solutions concrètes?",
    ];
  }

  // Features — react to demos
  if (phase === "features") {
    return [
      "Oui, l'équipe utiliserait ça au quotidien",
      "C'est intéressant, montrez-moi autre chose",
      "Comment ça gère le bilinguisme FR/EN?",
      "Qu'est-ce que vous proposez pour belairdirect?",
      "C'est pertinent mais pas notre priorité #1",
    ];
  }

  // Surprise
  if (phase === "surprise") {
    return [
      "Impressionnant! Quoi d'autre?",
      "Comment ça s'intègre avec nos outils actuels?",
      "On peut parler des priorités?",
    ];
  }

  // Priorities
  if (phase === "priorities") {
    return [
      "Le template editor en premier",
      "La génération de contenu AI est la priorité",
      "Le brand checker, c'est le plus urgent",
      "Montrez-moi le classement interactif",
    ];
  }

  // Summary
  if (phase === "summary") {
    return [
      "Prépare le résumé final",
      "On a tout couvert, merci!",
      "J'ai une dernière question avant le résumé",
    ];
  }

  return [];
}

// ── Priority ranker items ──
const PRIORITY_ITEMS = [
  { id: "template-editor", label: "Template Editor", icon: "📐" },
  { id: "ai-content", label: "Génération de contenu AI", icon: "✍️" },
  { id: "brand-checker", label: "Brand Checker", icon: "🔍" },
  { id: "svg-animator", label: "SVG Animator", icon: "🎬" },
  { id: "chevalier-gen", label: "Chevalier Generator", icon: "🛡️" },
  { id: "ab-factory", label: "A/B Factory", icon: "🧪" },
];

export function BrainstormPanel() {
  const [started, setStarted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<StepId>("intro");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Dynamic quick replies from AI
  const [dynamicReplies, setDynamicReplies] = useState<string[]>([]);

  // Session data accumulator
  const [sessionData, setSessionData] = useState<SessionData>({
    painPoints: [],
    features: PRIORITY_ITEMS.map((p) => ({
      id: p.id,
      title: p.label,
      description: "",
      icon: p.icon,
    })) as FeatureOption[],
    priorities: [],
    freeNotes: [],
  });

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [blocks, scrollToBottom]);

  // ── Process completed AI message: extract demos, update phase ──
  const processCompletedMessage = useCallback(
    (messageText: string, messageId: string) => {
      // Extract quick replies first
      const { cleanText: textWithoutReplies, replies } = extractReplies(messageText);
      setDynamicReplies(replies);

      const { cleanText, demos } = extractDemoTags(textWithoutReplies);

      // Update the message text (strip demo tags)
      if (cleanText !== messageText) {
        setBlocks((prev) =>
          prev.map((b): Block =>
            b.id === messageId && b.type === "agent"
              ? { type: "agent", content: cleanText, id: b.id }
              : b
          )
        );
      }

      // Insert demo blocks after the message
      if (demos.length > 0) {
        const demoBlocks: Block[] = demos.map((tag) => {
          const demoType = DEMO_TAGS[tag];
          if (demoType === "summary") {
            return {
              type: "summary" as const,
              id: crypto.randomUUID(),
              data: sessionData,
            };
          }
          return {
            type: demoType,
            id: crypto.randomUUID(),
          } as Block;
        });

        setBlocks((prev) => [...prev, ...demoBlocks]);
      }

      // Update phase
      const userMsgCount = blocks.filter((b) => b.type === "user").length;
      const newPhase = detectPhase(userMsgCount, messageText);
      setCurrentPhase(newPhase);
    },
    [blocks, sessionData]
  );

  // ── Send message to AI ──
  const sendMessage = useCallback(
    async (content: string, isOpening = false) => {
      // Add user message (unless opening)
      setDynamicReplies([]);
      if (!isOpening) {
        setBlocks((prev) => [
          ...prev,
          { type: "user", content, id: crypto.randomUUID() },
        ]);

        // Capture notes
        setSessionData((prev) => ({
          ...prev,
          freeNotes: [...prev.freeNotes, content],
        }));
      }

      const streamId = crypto.randomUUID();
      setBlocks((prev) => [
        ...prev,
        { type: "streaming", content: "", id: streamId },
      ]);
      setIsStreaming(true);

      try {
        // Build message history
        const history = isOpening
          ? [{ role: "user" as const, content: "Commençons le brainstorm. Présente-toi et pose ta première question." }]
          : blocks
              .filter((b) => b.type === "agent" || b.type === "user")
              .map((b) => ({
                role: (b.type === "agent" ? "assistant" : "user") as
                  | "assistant"
                  | "user",
                content: (b as { content: string }).content,
              }))
              .concat([{ role: "user" as const, content }]);

        const response = await fetch("/api/brainstorm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        if (!response.ok) throw new Error("Request failed");

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error("No reader");

        let buffer = "";
        let fullText = "";

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
              fullText += parsed.text;
              setBlocks((prev) =>
                prev.map((b): Block =>
                  b.id === streamId && b.type === "streaming"
                    ? { type: "streaming", content: fullText, id: streamId }
                    : b
                )
              );
              scrollToBottom();
            } catch {
              // skip
            }
          }
        }

        // Finalize: streaming → agent
        setBlocks((prev) =>
          prev.map((b): Block =>
            b.id === streamId
              ? { type: "agent", content: fullText, id: streamId }
              : b
          )
        );

        // Process for demos and phase updates
        setTimeout(() => processCompletedMessage(fullText, streamId), 100);
      } catch {
        setBlocks((prev) =>
          prev.map((b): Block =>
            b.id === streamId
              ? {
                  type: "agent",
                  content: "Désolé, une erreur est survenue. Réessayons!",
                  id: streamId,
                }
              : b
          )
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [blocks, scrollToBottom, processCompletedMessage]
  );

  // ── Start brainstorm ──
  const handleStart = useCallback(() => {
    setStarted(true);
    sendMessage("", true);
  }, [sendMessage]);

  // ── Handle priority submit ──
  const handlePrioritiesSubmit = useCallback(
    (orderedIds: string[]) => {
      const labels = orderedIds.map(
        (id) => PRIORITY_ITEMS.find((p) => p.id === id)?.label || id
      );
      setSessionData((prev) => ({ ...prev, priorities: labels }));

      // Send as a user message to continue the conversation
      sendMessage(`Mes priorités en ordre : ${labels.join(", ")}`);
    },
    [sendMessage]
  );

  // ── Demo complete handlers ──
  const handleDemoComplete = useCallback(() => {
    // Just scroll, the user will continue chatting
    scrollToBottom();
  }, [scrollToBottom]);

  // ── Render ──
  if (!started) {
    return <WelcomeHero onStart={handleStart} />;
  }

  const userMsgCount = blocks.filter((b) => b.type === "user").length;
  // Use AI-generated replies if available, fallback to static ones
  const quickReplies = isStreaming
    ? []
    : dynamicReplies.length > 0
      ? dynamicReplies
      : getQuickReplies(currentPhase, userMsgCount);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <StepIndicator currentStep={currentPhase} />

      {/* Chat flow */}
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
                return block.content ? (
                  <BrainstormMessage
                    key={block.id}
                    role="assistant"
                    content={block.content}
                    isStreaming
                  />
                ) : (
                  <div key={block.id} className="flex items-start gap-4 animate-fade-in-up">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
                      style={{ backgroundColor: "var(--platform-accent)" }}
                    >
                      SA
                    </div>
                    <div className="rounded-2xl rounded-tl-sm bg-white border border-[var(--platform-border)] px-6 py-4 shadow-sm">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-[var(--platform-muted)] animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-[var(--platform-muted)] animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-[var(--platform-muted)] animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                );
              case "user":
                return (
                  <BrainstormMessage
                    key={block.id}
                    role="user"
                    content={block.content}
                  />
                );
              case "demo-voice":
                return (
                  <div key={block.id} className="ml-14 animate-fade-in-up">
                    <DemoBrandVoice onComplete={handleDemoComplete} />
                  </div>
                );
              case "priority":
                return (
                  <div key={block.id} className="ml-14 animate-fade-in-up">
                    <PriorityRanker
                      items={PRIORITY_ITEMS}
                      onSubmit={handlePrioritiesSubmit}
                    />
                  </div>
                );
              case "summary":
                return (
                  <div key={block.id} className="ml-14 animate-fade-in-up">
                    <SessionSummary data={block.data} />
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>

      {/* Input with quick replies */}
      <BrainstormInput
        onSend={(msg) => sendMessage(msg)}
        disabled={isStreaming}
        quickReplies={quickReplies}
      />
    </div>
  );
}
