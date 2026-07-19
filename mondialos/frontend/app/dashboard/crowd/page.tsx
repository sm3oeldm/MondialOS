"use client";

import { useEffect, useState } from "react";
import { fetchCrowd } from "@/lib/api";

function levelColor(l: number) {
  if (l >= 75) return "#ef4444";
  if (l >= 50) return "#f59e0b";
  return "#22c55e";
}

export default function CrowdDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchCrowd("lusail").then(setData).catch(() => setData(null));
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl">Crowd Intelligence</h1>
      <p className="text-white/50 mt-2">
        Congestion heatmap & best-entrance routing.
      </p>

      {data ? (
        <>
          <div className="mt-6 glass rounded-2xl p-5">
            <div className="text-xs uppercase text-white/40 mb-3">
              Gate congestion — {data.stadium}
            </div>
            <div className="space-y-3">
              {data.points.map((p: any) => (
                <div key={p.gate}>
                  <div className="flex justify-between text-sm">
                    <span>{p.gate}</span>
                    <span style={{ color: levelColor(p.level) }}>{p.level}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-ink-600 mt-1 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${p.level}%`, background: levelColor(p.level) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 glass rounded-2xl p-5 border-l-4 border-red-500">
            <div className="text-sm">📊 {data.recommendation}</div>
          </div>
          <p className="text-[11px] text-yellow-400/70 mt-4">
            ⚠️ Crowd figures are SIMULATED for the demo.
          </p>
        </>
      ) : (
        <p className="text-white/40 mt-6">Loading crowd data… (start the backend)</p>
      )}
    </main>
  );
}
