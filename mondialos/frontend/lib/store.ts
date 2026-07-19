import { create } from "zustand";
import type { AgentInfo, ChatMessage } from "./api";

type ChatState = {
  agents: AgentInfo[];
  activeAgent: string | null;
  messages: ChatMessage[];
  loading: boolean;
  setAgents: (a: AgentInfo[]) => void;
  setActiveAgent: (id: string | null) => void;
  addMessage: (m: ChatMessage) => void;
  setLoading: (b: boolean) => void;
  reset: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  agents: [],
  activeAgent: null,
  messages: [],
  loading: false,
  setAgents: (agents) => set({ agents }),
  setActiveAgent: (activeAgent) => set({ activeAgent }),
  addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ messages: [], activeAgent: null, loading: false }),
}));
