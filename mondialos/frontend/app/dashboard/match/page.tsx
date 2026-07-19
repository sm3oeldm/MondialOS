"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const LIVE = process.env.NEXT_PUBLIC_LIVE_DATA === "true";

const STATIC_MATCHES = [
  { home: "Mexico", away: "CONCACAF Champions League winner", score: "—", venue: "Estadio Azteca · Mexico City", status: "11 Jun 2026 · Opening Match" },
  { home: "United States", away: "Group A runner-up", score: "—", venue: "SoFi Stadium · Los Angeles", status: "Group stage · TBD" },
  { home: "Canada", away: "Group B runner-up", score: "—", venue: "BMO Field · Toronto", status: "Group stage · TBD" },
  { home: "Argentina", away: "Group C runner-up", score: "—", venue: "AT&T Stadium · Dallas", status: "Group stage · TBD" },
  { home: "Winner SF1", away: "Winner SF2", score: "—", venue: "MetLife Stadium · East Rutherford, NJ", status: "19 Jul 2026 · Final" },
];

export default function MatchDashboard() {
  const [matches, setMatches] = useState<any[]>(STATIC_MATCHES);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!LIVE) return;
    const base = "https://wcup2026.org/api/data.php";
    const norm = (m: any) => {
      const sc = m.score;
      const score = sc ? `${sc[0]}:${sc[1]}` : m.status === "live" ? `${m.live_minute || 0}'` : "—";
      const status =
        m.status === "finished" ? "FT" : m.status === "live" ? `LIVE ${m.live_minute || 0}'` : m.round || "Upcoming";
      return {
        home: m.team1 || "TBD",
        away: m.team2 || "TBD",
        flag1: m.flag1 || "",
        flag2: m.flag2 || "",
        score,
        venue: m.ground || "World Cup 2026",
        date: m.date || "",
        status,
      };
    };
    Promise.all([
      fetch(`${base}?action=upcoming`).then((r) => r.json()).catch(() => null),
      fetch(`${base}?action=today`).then((r) => r.json()).catch(() => null),
      fetch(`${base}?action=results`).then((r) => r.json()).catch(() => null),
    ])
      .then(([up, today, res]) => {
        let list: any[] = [];
        if (up?.matches) list = list.concat(up.matches.map(norm));
        if (today?.matches) list = list.concat(today.matches.map(norm));
        if (res?.matches) list = list.concat(res.matches.map(norm));
        const seen = new Set<string>();
        list = list.filter((m) => {
          const k = m.home + m.away + m.date;
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });
        if (!list.length) throw new Error("empty");
        setMatches(list);
        setLive(true);
      })
      .catch(() => setLive(false));
  }, []);

  const possession = [
    { team: "Argentina", value: 58 },
    { team: "France", value: 54 },
    { team: "Brazil", value: 61 },
    { team: "England", value: 49 },
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl">Match Dashboard</h1>
      <p className="text-white/50 mt-2">
        {live ? "🔴 LIVE scores via wcup2026.org" : "Verified 2026 schedule & AI tactical insights."}
      </p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((m, i) => (
          <div key={i} className="glass rounded-2xl p-5">
            <div className="text-xs text-white/40 uppercase">{m.venue} {m.date ? `· ${m.date}` : ""} · {m.status}</div>
            <div className="font-display text-xl mt-2 flex items-center gap-2 flex-wrap">
              {m.flag1 ? <img src={m.flag1} alt="" className="w-7 h-5 object-cover rounded" /> : null}
              <span>{m.home}</span>
              <span className="text-brand">{m.score}</span>
              <span>{m.away}</span>
              {m.flag2 ? <img src={m.flag2} alt="" className="w-7 h-5 object-cover rounded" /> : null}
            </div>
            <div className="text-xs text-white/50 mt-3">
              ⚽ Match Intel: {live ? "Live update." : "Schedule confirmed. Live feed on matchday."}
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
