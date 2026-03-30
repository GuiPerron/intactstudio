"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { BrandId, brands } from "@/lib/brand/config";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  brand: BrandId;
}

export function ChatPanel({ brand }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const brandConfig = brands[brand];

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Reset chat when brand changes
  useEffect(() => {
    setMessages([]);
  }, [brand]);

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

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, brand }),
      });

      if (!response.ok) throw new Error("Chat request failed");

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
            // skip malformed chunks
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? { ...m, content: "Désolé, une erreur est survenue. Réessaie!" }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState brand={brand} onSuggestionClick={handleSend} />
        ) : (
          <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
            {messages.map(
              (message) =>
                message.content && (
                  <ChatMessage
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    brand={brand}
                  />
                )
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isStreaming} brand={brand} />
    </div>
  );
}

function EmptyState({
  brand,
  onSuggestionClick,
}: {
  brand: BrandId;
  onSuggestionClick: (message: string) => void;
}) {
  const brandConfig = brands[brand];

  const suggestions =
    brand === "intact"
      ? [
          "Propose-moi 3 concepts de campagne pour les assurances habitation, dans le ton Intact.",
          "Écris un headline émotionnel pour une pub qui parle de la protection des souvenirs familiaux.",
          "Quels sont les do's and don'ts pour utiliser les brackets [ ] dans un visuel?",
          "Aide-moi à adapter une campagne anglophone en français, voix Intact.",
        ]
      : [
          "Propose-moi 3 idées de Reels Instagram avec le Petit Chevalier pour l'été.",
          "Écris un texte de pub pour promouvoir automerit auprès des Gen Z.",
          "Quelles sont les règles pour les CTAs en digital chez belairdirect?",
          "Aide-moi à simplifier ce texte d'assurance pour qu'il sonne belairdirect.",
        ];

  return (
    <div className="flex flex-1 items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
          style={{ backgroundColor: brandConfig.colors.primary }}
        >
          {brandConfig.agentName[0]}
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Brainstorme avec {brandConfig.agentName}
        </h1>
        <p className="mt-2 text-[var(--platform-muted)]">
          {brandConfig.agentRole} — Experte de la marque {brandConfig.name}
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => onSuggestionClick(suggestion)}
              className="group rounded-xl border border-[var(--platform-border)] bg-white px-4 py-3.5 text-left text-sm leading-relaxed text-[var(--platform-muted)] transition-all duration-200 hover:border-[var(--platform-muted)] hover:text-[var(--platform-text)] hover:shadow-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
