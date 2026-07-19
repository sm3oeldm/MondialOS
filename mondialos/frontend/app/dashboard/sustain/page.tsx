"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { fetchCarbon } from "@/lib/api";

export default function SustainDashboard() {
  const [distance, setDistance] = useState(40);
  const [mode, setMode] = useState("car");
  const [result, setResult] = useState<any>(null);

  async function calc() {
    const r = await fetchCarbon(distance, mode);
    setResult(r);
  }

  const pie =
    result &&
    [
      { name: result.mode, value: result.kg_co2, fill: "#ef4444" },
      { name: result.greener_alternative, value: Math.max(0.01, result.kg_co2 - result.savings_kg), fill: "#22c55e" },
    ];

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl">Sustainability</h1>
      <p className="text-white/50 mt-2">Estimate your trip&apos;s footprint & find the greener way.</p>

      <div className="mt-8 glass rounded-2xl p-5 space-y-4">
        <div className="flex gap-3">
          <input
            type="number"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-28 px-3 py-2 rounded-lg bg-white text-black border border-white/10 outline-none focus:border-brand"
          />
          <span className="self-center text-white/50 text-sm">km</span>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="flex-1 px-3 py-2 rounded-lg bg-white text-black border border-white/10 outline-none focus:border-brand"
          >
            <option value="car">🚗 Car</option>
            <option value="bus">🚌 Bus</option>
            <option value="train">🚆 Train</option>
            <option value="flight">✈️ Flight</option>
            <option value="walk">🚶 Walk</option>
          </select>
          <button
            onClick={calc}
            className="px-5 py-2 rounded-lg bg-brand text-black font-semibold"
          >
            Calculate
          </button>
        </div>

        {result && (
          <div className="grid sm:grid-cols-2 gap-4 items-center">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pie} dataKey="value" innerRadius={40} outerRadius={70}>
                    {pie.map((p: any, i: number) => (
                      <Cell key={i} fill={p.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#16211c", border: "none", borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-sm space-y-2">
              <div>
                <span className="text-white/50">Your trip ({result.mode}):</span>{" "}
                <span className="text-red-400 font-semibold">{result.kg_co2} kg CO₂</span>
              </div>
              <div>
                <span className="text-white/50">Greener alternative:</span>{" "}
                <span className="text-brand-glow font-semibold">{result.greener_alternative}</span>
              </div>
              <div>
                You&apos;d save{" "}
                <span className="text-brand-glow font-semibold">{result.savings_kg} kg CO₂</span> 🌱
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
