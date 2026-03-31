"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface AgentPanelProps {
  onClose: () => void;
  mode?: "default" | "template";
  currentTemplateJson?: string;
}

function extractTemplateJson(text: string): { cleanText: string; templateJson: string | null } {
  const match = text.match(/\[TEMPLATE_JSON\]([\s\S]*?)\[\/TEMPLATE_JSON\]/);
  if (!match) return { cleanText: text, templateJson: null };

  const jsonStr = match[1].trim();
  const cleanText = text.replace(/\[TEMPLATE_JSON\][\s\S]*?\[\/TEMPLATE_JSON\]/, "").trim();
  return { cleanText, templateJson: jsonStr };
}

export function AgentPanel({ onClose, mode = "default", currentTemplateJson }: AgentPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const apiEndpoint = mode === "template" ? "/api/template-ai" : "/api/brainstorm";

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);
  useEffect(() => { if (!isStreaming) inputRef.current?.focus(); }, [isStreaming]);

  const handleSend = async (content?: string) => {
    const text = (content || input).trim();
    if (!text || isStreaming) return;
    setInput("");

    // In template mode, append current template context
    let fullText = text;
    if (mode === "template" && currentTemplateJson) {
      fullText = `${text}\n\n[TEMPLATE ACTUEL]\n${currentTemplateJson}`;
    }

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    const assistantMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    try {
      const history = [...messages, { ...userMsg, content: fullText }].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok) throw new Error("Failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("No reader");

      let buffer = "";
      let fullResponse = "";

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
            fullResponse += parsed.text;
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: fullResponse } : m))
            );
            scrollToBottom();
          } catch { /* skip */ }
        }
      }

      // Process completed response
      const { cleanText, templateJson } = extractTemplateJson(fullResponse);

      // Clean up display: remove [REPLIES:...] too
      const displayText = cleanText.replace(/\[REPLIES:.*?\]/g, "").trim();

      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: displayText } : m))
      );

      // If template JSON found, emit event
      if (templateJson) {
        try {
          const parsed = JSON.parse(templateJson);
          window.dispatchEvent(
            new CustomEvent("template-update", { detail: parsed })
          );
        } catch (e) {
          console.error("Failed to parse template JSON:", e);
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id ? { ...m, content: "Désolé, une erreur est survenue." } : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const suggestions = mode === "template"
    ? [
        "Crée un post social belairdirect conversion",
        "Switch ce template en version Intact",
        "Propose 3 headlines plus punchy",
      ]
    : [
        "Brainstorme un concept de campagne",
        "Écris un headline Intact habitation",
        "Guidelines du Petit Chevalier?",
      ];

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[600px] flex flex-col rounded-2xl bg-white border border-[var(--platform-border)] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--platform-border)]" style={{ backgroundColor: "var(--platform-sand)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: "var(--platform-accent)" }}>
            SA
          </div>
          <div>
            <p className="text-sm font-semibold">Studio AI</p>
            <p className="text-[10px] text-[var(--platform-muted)]">
              {mode === "template" ? "Mode Template Editor" : "Partenaire créatif"}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/60 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4L12 12M12 4L4 12" stroke="var(--platform-muted)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: "var(--platform-accent)" }}>
              SA
            </div>
            <p className="text-sm font-semibold">
              {mode === "template" ? "Template AI Assistant" : "Comment puis-je vous aider?"}
            </p>
            <p className="text-xs text-[var(--platform-muted)] mt-1 max-w-[280px] mx-auto">
              {mode === "template"
                ? "Décrivez le template que vous voulez créer, ou demandez-moi de modifier le template actuel."
                : "Brainstormez un concept, demandez de l'aide, ou posez vos questions."}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="rounded-full px-3.5 py-2 text-xs font-medium text-white transition-all hover:opacity-85"
                  style={{ backgroundColor: "var(--platform-accent)" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) =>
          msg.role === "user" ? (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[var(--platform-sand)] px-4 py-2.5 text-sm">
                {msg.content}
              </div>
            </div>
          ) : msg.content ? (
            <div key={msg.id} className="max-w-[90%]">
              <div className="rounded-2xl rounded-tl-sm border border-[var(--platform-border)] px-4 py-3">
                <div className="markdown-body text-sm">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex gap-1.5 py-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--platform-muted)] animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--platform-muted)] animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--platform-muted)] animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          )
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[var(--platform-border)] p-3">
        <div className="flex items-end gap-2 rounded-xl border border-[var(--platform-border)] px-3 py-2 focus-within:border-[var(--platform-muted)]">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={mode === "template" ? "Décris le template à créer ou modifier..." : "Tapez votre message..."}
            disabled={isStreaming}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm leading-relaxed placeholder:text-[var(--platform-muted)] focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={isStreaming || !input.trim()}
            className="shrink-0 rounded-full p-2 text-white transition-all disabled:opacity-30"
            style={{ backgroundColor: input.trim() && !isStreaming ? "var(--platform-accent)" : "var(--platform-border)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7L7 2M7 2L12 7M7 2V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
