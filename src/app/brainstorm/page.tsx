"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NavBar } from "@/components/layout/NavBar";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "Campagne été 2026 belairdirect — conversion, multi-canal, Gen Z",
  "Notoriété Intact habitation — familles, émotionnel, Q3",
  "Lancement automerit 2.0 — digital-first, belairdirect",
  "Campagne olympique Intact — partenariat Équipe Canada",
  "belairdirect Petit Chevalier — rentrée scolaire, TikTok + Instagram",
  "Intact renouvellement auto — rétention, email + bannières",
];

export default function BrainstormPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [conceptSummary, setConceptSummary] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    const assistantMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);

    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/brainstorm-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok) throw new Error("Failed");

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
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: fullText } : m))
            );
            scrollToBottom();
          } catch { /* skip */ }
        }
      }

      // Extract concept summary if present
      const summaryMatch = fullText.match(/\[CONCEPT_SUMMARY\]([\s\S]*?)\[\/CONCEPT_SUMMARY\]/);
      if (summaryMatch) {
        setConceptSummary(summaryMatch[1].trim());
        const clean = fullText.replace(/\[CONCEPT_SUMMARY\][\s\S]*?\[\/CONCEPT_SUMMARY\]/, "").trim();
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: clean || fullText } : m))
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantMsg.id ? { ...m, content: "Erreur. Réessayez." } : m))
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleExport = () => {
    if (!conceptSummary) return;
    const blob = new Blob([conceptSummary], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "concept-studio-ai.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: "var(--platform-sand)" }}>
      <NavBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Main chat */}
        <div className="flex-1 flex flex-col">
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              /* Empty state */
              <div className="flex items-center justify-center h-full px-6">
                <div className="max-w-[600px] text-center">
                  <div
                    className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center text-white text-xl font-bold"
                    style={{ backgroundColor: "var(--platform-accent)" }}
                  >
                    💡
                  </div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Brainstorm de campagne
                  </h1>
                  <p className="mt-2 text-sm text-[var(--platform-muted)] max-w-md mx-auto">
                    Décrivez votre projet et l&apos;AI développe le concept : thème créatif, messages clés, direction visuelle, headlines, CTAs, déclinaisons par canal.
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-2">
                    {STARTERS.map((s) => (
                      <button
                        key={s}
                        onClick={() => handleSend(s)}
                        className="rounded-xl border border-[var(--platform-border)] bg-white px-4 py-3 text-left text-xs text-[var(--platform-muted)] transition-all hover:border-[var(--platform-accent)] hover:text-[var(--platform-text)] hover:shadow-sm"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Messages */
              <div className="mx-auto max-w-[800px] space-y-5 px-6 py-8">
                {messages.map((msg) => (
                  <div key={msg.id}>
                    {msg.role === "user" ? (
                      <div className="flex justify-end">
                        <div className="max-w-[600px] rounded-2xl rounded-tr-sm bg-white border border-[var(--platform-border)] px-5 py-3.5 text-[15px] shadow-sm">
                          {msg.content}
                        </div>
                      </div>
                    ) : msg.content ? (
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: "var(--platform-accent)" }}>
                          SA
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-1.5 flex items-center gap-2">
                            <span className="text-sm font-semibold">Studio AI</span>
                            <span className="text-xs text-[var(--platform-muted)]">Directeur créatif</span>
                          </div>
                          <div className="rounded-2xl rounded-tl-sm bg-white border border-[var(--platform-border)] px-7 py-5 shadow-sm">
                            <div className="markdown-body">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0" style={{ backgroundColor: "var(--platform-accent)" }}>SA</div>
                        <div className="rounded-2xl rounded-tl-sm bg-white border border-[var(--platform-border)] px-6 py-4 shadow-sm">
                          <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[var(--platform-muted)] animate-bounce" />
                            <div className="w-2 h-2 rounded-full bg-[var(--platform-muted)] animate-bounce" style={{ animationDelay: "150ms" }} />
                            <div className="w-2 h-2 rounded-full bg-[var(--platform-muted)] animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-[var(--platform-border)] bg-white p-4">
            <div className="mx-auto max-w-[800px]">
              <div className="flex items-end gap-3 rounded-2xl border border-[var(--platform-border)] bg-white px-4 py-3 focus-within:border-[var(--platform-muted)] focus-within:shadow-sm">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Décrivez votre campagne ou projet..."
                  disabled={isStreaming}
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-[15px] leading-relaxed placeholder:text-[var(--platform-muted)] focus:outline-none disabled:opacity-50"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isStreaming || !input.trim()}
                  className="shrink-0 rounded-full p-2.5 text-white transition-all disabled:opacity-30"
                  style={{ backgroundColor: input.trim() && !isStreaming ? "var(--platform-accent)" : "var(--platform-border)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L8 3M8 3L13 8M8 3V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right sidebar — Concept summary (appears when ready) */}
        {conceptSummary && (
          <div className="w-[360px] border-l border-[var(--platform-border)] bg-white overflow-y-auto shrink-0">
            <div className="p-4 border-b border-[var(--platform-border)]" style={{ backgroundColor: "var(--platform-sand)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Concept prêt</h3>
                  <p className="text-[10px] text-[var(--platform-muted)]">Exportable en Markdown</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(conceptSummary)}
                    className="rounded-full border border-[var(--platform-border)] px-3 py-1.5 text-xs font-medium hover:border-[var(--platform-muted)]"
                  >
                    📋 Copier
                  </button>
                  <button
                    onClick={handleExport}
                    className="rounded-full px-3 py-1.5 text-xs font-medium text-white"
                    style={{ backgroundColor: "var(--platform-accent)" }}
                  >
                    ⬇ Exporter
                  </button>
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="markdown-body text-sm">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{conceptSummary}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
