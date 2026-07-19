"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { fetchMatches } from "@/lib/api";

export default function MatchDashboard() {
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    fetchMatches().then(setMatches).catch(() => setMatches([]));
  }, []);

  const possession = [
    { team: "Morocco", value: 42 },
    { team: "Portugal", value: 58 },
    { team: "Japan", value: 35 },
    { team: "Brazil", value: 65 },
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl">Match Dashboard</h1>
      <p className="text-white/50 mt-2">Live scores & AI tactical insights.</p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((m) => (
          <div key={m.id} className="glass rounded-2xl p-5">
            <div className="text-xs text-white/40 uppercase">{m.venue} · {m.status}</div>
            <div className="font-display text-xl mt-2">
              {m.home} <span className="text-brand">{m.score}</span> {m.away}
            </div>
            <div className="text-xs text-white/50 mt-3">
              ⚽ Match Intel: {m.status === "FT" ? "Tactical control decided by midfield press." : "Kickoff pending — see predicted shape."}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 glass rounded-2xl p-5">
        <div className="font-semibold mb-3">Possession % (demo)</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={possession}>
            <XAxis dataKey="team" stroke="#888" fontSize={12} />
            <YAxis stroke="#888" fontSize={12} />
            <Tooltip
              contentStyle={{ background: "#16211c", border: "none", borderRadius: 12 }}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {possession.map((_, i) => (
                <Cell key={i} fill={i % 2 ? "#22c55e" : "#3b82f6"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
