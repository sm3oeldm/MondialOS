import { supabase } from "./supabase";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type AgentInfo = {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  color: string;
};

export type ChatMessage = {
  role: "user" | "agent";
  content: string;
  agent?: AgentInfo;
  sources?: string[];
  simulated?: boolean;
};

async function authHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchAgents(): Promise<AgentInfo[]> {
  const r = await fetch(`${API}/agents`);
  return r.json();
}

export async function sendChat(
  message: string,
  agentId: string | null,
  history: { role: string; content: string }[]
) {
  const r = await fetch(`${API}/chat`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify({ message, agent: agentId, history }),
  });
  if (!r.ok) throw new Error("chat failed");
  return r.json();
}

export async function fetchCrowd(stadium: string) {
  const r = await fetch(`${API}/crowd/${stadium}`, { headers: await authHeaders() });
  return r.json();
}

export async function fetchCarbon(distance_km: number, mode: string) {
  const r = await fetch(`${API}/carbon`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ distance_km, mode }),
  });
  return r.json();
}

export async function fetchMatches() {
  const r = await fetch(`${API}/match`);
  return r.json();
}
