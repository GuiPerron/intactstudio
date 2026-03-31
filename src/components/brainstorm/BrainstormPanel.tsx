"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { BrainstormMessage } from "./BrainstormMessage";
import { BrainstormInput } from "./BrainstormInput";
import { WelcomeHero } from "./WelcomeHero";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// The agent's opening message — it leads the conversation
const OPENING_MESSAGE = `Bonjour! 👋

Je suis **Studio AI**, votre partenaire créatif pour les marques **Intact** et **belairdirect**.

Je connais en profondeur les deux systèmes de marque — la voix, les couleurs, la typographie, les règles, tout. Et je suis ici pour explorer avec vous comment une plateforme AI-native pourrait **transformer le quotidien** du Creative & Brand Studio.

Avant qu'on plonge dans les possibilités, j'aimerais mieux comprendre votre réalité :

**Quels sont les plus grands défis créatifs de votre équipe en ce moment?** Par exemple :
- Des processus qui prennent trop de temps?
- De la cohérence de marque difficile à maintenir?
- Des demandes répétitives qui drainent l'énergie créative?

Partagez ce qui vous vient en tête — c'est le point de départ idéal.`;

// Contextual suggestions that evolve with the conversation
function getSuggestions(messageCount: number): string[] {
  if (messageCount === 0) {
    return [
      "La cohérence entre les marques est un défi constant",
      "Les adaptations FR/EN prennent trop de temps",
      "On fait beaucoup de travail répétitif sur les templates",
      "Montre-moi ce que tu peux faire",
    ];
  }
  if (messageCount <= 4) {
    return [
      "Montre-moi comment tu switches entre Intact et belairdirect",
      "Comment le template editor fonctionnerait?",
      "Quelles micro-apps tu proposerais?",
      "Parle-moi de la génération de contenu brand-aware",
    ];
  }
  if (messageCount <= 8) {
    return [
      "Et pour les campagnes multicanal?",
      "Comment ça gère le bilinguisme?",
      "Qu'est-ce que tu proposes pour le Petit Chevalier?",
      "Montre-moi le concept du Hub Studio",
    ];
  }
  return [];
}

export function BrainstormPanel() {
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showOpening, setShowOpening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // When brainstorm starts, the agent speaks first
  const handleStart = useCallback(() => {
    setStarted(true);
    setShowOpening(true);

    // Simulate the agent "typing" its opening
    const openingMsg: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    };

    setMessages([openingMsg]);

    // Reveal the opening message character by character for effect
    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex += 3; // Speed: 3 chars at a time
      if (charIndex >= OPENING_MESSAGE.length) {
        setMessages([{ ...openingMsg, content: OPENING_MESSAGE }]);
        setShowOpening(false);
        clearInterval(interval);
      } else {
        setMessages([
          { ...openingMsg, content: OPENING_MESSAGE.slice(0, charIndex) },
        ]);
      }
    }, 12);

    return () => clearInterval(interval);
  }, []);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsStreaming(true);

    try {
      const apiMessages = [...messages, userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch("/api/brainstorm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
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
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMessage.id
                  ? { ...m, content: m.content + parsed.text }
                  : m
              )
            );
          } catch {
            // skip
          }
        }
      }
    } catch (error) {
      console.error("Brainstorm error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? { ...m, content: "Désolé, une erreur est survenue. Réessayons!" }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const userMessageCount = messages.filter((m) => m.role === "user").length;

  if (!started) {
    return <WelcomeHero onStart={handleStart} />;
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[800px] space-y-6 px-6 py-8">
          {messages.map(
            (message) =>
              message.content && (
                <BrainstormMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  isStreaming={
                    isStreaming &&
                    message.id === messages[messages.length - 1]?.id
                  }
                />
              )
          )}
        </div>
      </div>

      {/* Input */}
      <BrainstormInput
        onSend={handleSend}
        disabled={isStreaming || showOpening}
        suggestions={getSuggestions(userMessageCount)}
      />
    </div>
  );
}
