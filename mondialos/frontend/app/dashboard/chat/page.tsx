"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { fetchAgents, sendChat, type AgentInfo, type ChatMessage } from "@/lib/api";
import { useChatStore } from "@/lib/store";

// Built-in agent list so the chat works even when the backend is offline.
const FALLBACK_AGENTS: AgentInfo[] = [
  { id: "fan", name: "Fan Agent", icon: "🎟️", color: "#22c55e", tagline: "Personalized itineraries & recommendations" },
  { id: "stadium", name: "Stadium Agent", icon: "🏟️", color: "#3b82f6", tagline: "Every gate, restroom & checkpoint" },
  { id: "match", name: "Match Intelligence", icon: "⚽", color: "#f59e0b", tagline: "Tactics & insights, simply explained" },
  { id: "crowd", name: "Crowd Intelligence", icon: "📊", color: "#ef4444", tagline: "Beat the congestion" },
  { id: "sustain", name: "Sustainability", icon: "🌱", color: "#10b981", tagline: "Greener travel, lower footprint" },
];

// Strip markdown decorations so the bubble shows clean plain text (no stray ** or ").
function stripMd(s: string): string {
  return (s || "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/^\s*>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/^#+\s*/gm, "")
    .trim();
}

export default function ChatPage() {
  const { agents, activeAgent, messages, loading, setAgents, setActiveAgent, addMessage, setLoading } =
    useChatStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (agents.length > 0) return;
    fetchAgents()
      .then(setAgents)
      .catch(() => setAgents(FALLBACK_AGENTS));
  }, [agents.length, setAgents]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: ChatMessage = { role: "user", content: text };
    addMessage(userMsg);
    setLoading(true);
    try {
      const res = await sendChat(
        text,
        activeAgent,
        messages.map((m) => ({ role: m.role === "agent" ? "assistant" : m.role, content: m.content }))
      );
      const agentInfo: AgentInfo = {
        id: res.agent,
        name: res.agent_name,
        icon: res.agent_icon,
        color: res.agent_color,
        tagline: "",
      };
      addMessage({
        role: "agent",
        content: res.reply,
        agent: agentInfo,
        sources: res.sources,
        simulated: res.simulated,
      });
    } catch (e) {
      addMessage({
        role: "agent",
        content: "⚠️ Could not reach MondialOS backend. Is the API running?",
        agent: { id: "sys", name: "System", icon: "⚠️", color: "#ef4444", tagline: "" },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-6 h-[calc(100vh-56px)] flex flex-col">
      {/* agent chips */}
      <div className="flex gap-2 overflow-x-auto pb-3">
        <button
          onClick={() => setActiveAgent(null)}
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border transition ${
            activeAgent === null ? "bg-white text-black" : "border-white/10 text-white/60"
          }`}
        >
          Auto 🔀
        </button>
        {agents.map((a) => (
          <button
            key={a.id}
            onClick={() => setActiveAgent(a.id)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap border transition`}
            style={{
              borderColor: activeAgent === a.id ? a.color : "rgba(255,255,255,0.1)",
              background: activeAgent === a.id ? `${a.color}22` : "transparent",
              color: activeAgent === a.id ? a.color : "rgba(255,255,255,0.6)",
            }}
          >
            {a.icon} {a.name.replace(" Agent", "")}
          </button>
        ))}
      </div>

      {/* messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 py-2">
        {messages.length === 0 && (
          <div className="text-center text-white/40 mt-20">
            <div className="text-5xl mb-3">🌍</div>
            Ask about itineraries, stadium gates, tactics, congestion, or carbon.
            <br />
            Pick an agent above or let Auto route it.
          </div>
        )}
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                m.role === "user"
                  ? "bg-brand text-black"
                  : "glass border border-white/10"
              }`}
              style={
                m.role === "agent" && m.agent
                  ? { borderLeft: `3px solid ${m.agent.color}` }
                  : undefined
              }
            >
              {m.agent && m.role === "agent" && (
                <div className="text-xs font-semibold mb-1" style={{ color: m.agent.color }}>
                  {m.agent.icon} {m.agent.name}
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed">{m.role === "agent" ? stripMd(m.content) : m.content}</div>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-2 text-[10px] text-white/40">
                  sources: {m.sources.join(", ")}
                </div>
              )}
              {m.simulated && (
                <div className="mt-1 text-[10px] text-yellow-400/70">offline demo mode</div>
              )}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="glass rounded-2xl px-4 py-3 text-sm text-white/50 animate-pulse">
              agent is thinking…
            </div>
          </div>
        )}
      </div>

      {/* input */}
      <div className="flex gap-2 pt-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask MondialOS…"
          className="flex-1 px-4 py-3 rounded-xl bg-white border border-white/10 outline-none focus:border-brand text-black placeholder:text-black/40"
        />
        <button
          onClick={send}
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-brand text-white font-semibold disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </main>
  );
}
