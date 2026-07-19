"use client";

import { useEffect, useState } from "react";

const STATIC_GROUPS: Record<string, { t: string; h: number }[]> = {
  A: [{ t: "Mexico", h: 1 }, { t: "Canada", h: 1 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }],
  B: [{ t: "United States", h: 1 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }],
  C: [{ t: "Argentina", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }],
  D: [{ t: "France", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }],
  E: [{ t: "Brazil", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }],
  F: [{ t: "Spain", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }],
  G: [{ t: "England", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }],
  H: [{ t: "Germany", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }],
  I: [{ t: "Portugal", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }],
  J: [{ t: "Netherlands", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }],
  K: [{ t: "Japan", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }],
  L: [{ t: "Morocco", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }, { t: "TBD", h: 0 }],
};

const LIVE = process.env.NEXT_PUBLIC_LIVE_DATA === "true";
const HOSTS = ["Mexico", "Canada", "United States"];

type Row = { t: string; p: number; w: number; d: number; l: number; gd: number; pts: number; host: number };
type LiveGroup = { g: string; rows: Row[] };

export default function GroupsPage() {
  const [staticGroups] = useState(STATIC_GROUPS);
  const [liveGroups, setLiveGroups] = useState<LiveGroup[] | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!LIVE) return;
    fetch("https://wcup2026.org/api/data.php?action=standings")
      .then((r) => r.json())
      .then((data) => {
        const raw = data.standings || {};
        const norm: LiveGroup[] = Object.keys(raw)
          .map((g) => ({
            g: (g + "").replace(/^Group\s*/i, "").trim() || g,
            rows: raw[g].map((t: any) => ({
              t: t.team,
              p: t.p,
              w: t.w,
              d: t.d,
              l: t.l,
              gd: t.gd,
              pts: t.pts,
              host: HOSTS.includes(t.team) ? 1 : 0,
            })),
          }))
          .sort((a, b) => a.g.localeCompare(b.g));
        if (!norm.length) throw new Error("empty");
        setLiveGroups(norm);
        setLive(true);
      })
      .catch(() => setLive(false));
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl">Group Stage — 2026</h1>
      <p className="text-white/50 mt-2 mb-6">
        {live ? "Group-stage standings · top 2 + 8 best thirds advance." : "12 groups of 4 · top 2 + 8 best thirds advance."}{" "}
        {live ? (
          <span className="text-brand ml-2">● LIVE via wcup2026.org</span>
        ) : (
          <span className="text-white/30 ml-2">(verified static)</span>
        )}
      </p>

      {live && liveGroups ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveGroups.map((g) => (
            <div key={g.g} className="glass rounded-2xl p-4">
              <div className="font-display text-lg mb-3 text-brand">Group {g.g}</div>
              <div className="grid grid-cols-[1fr_repeat(6,auto)] gap-x-2 text-[10px] text-white/40 uppercase text-right">
                <span className="text-left">Team</span>
                <span>P</span><span>W</span><span>D</span><span>L</span><span>GD</span><span>Pts</span>
              </div>
              {g.rows.map((r, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-[1fr_repeat(6,auto)] gap-x-2 text-sm py-1 text-right ${r.host ? "font-semibold" : ""}`}
                >
                  <span className="text-left truncate flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${r.host ? "bg-brand" : "bg-white/30"}`} />
                    {r.t}
                    {r.host ? <span className="text-[9px] text-brand/70">HOST</span> : null}
                  </span>
                  <span>{r.p}</span><span>{r.w}</span><span>{r.d}</span><span>{r.l}</span>
                  <span>{r.gd > 0 ? "+" : ""}{r.gd}</span>
                  <span className="text-brand">{r.pts}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(staticGroups).map((g) => (
            <div key={g} className="glass rounded-2xl p-4">
              <div className="font-display text-lg mb-3 text-brand">Group {g}</div>
              {staticGroups[g].map((team, i) => (
                <div key={i} className={`flex items-center gap-2 py-1 text-sm ${team.h ? "font-semibold" : ""}`}>
                  <span className={`w-2 h-2 rounded-full ${team.h ? "bg-brand" : "bg-white/30"}`} />
                  {team.t}
                  {team.h ? <span className="text-[10px] text-brand/70">HOST</span> : null}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
