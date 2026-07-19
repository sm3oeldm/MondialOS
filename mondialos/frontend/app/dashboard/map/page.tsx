"use client";

import dynamic from "next/dynamic";

const StadiumMap = dynamic(() => import("@/components/StadiumMap"), {
  ssr: false,
  loading: () => <div className="text-white/40 p-6">Loading map…</div>,
});

export default function MapPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl">Interactive Stadium Map</h1>
      <p className="text-white/50 mt-2 mb-6">
        FIFA World Cup 2026 venues (USA · Mexico · Canada) — congestion overlay (green = clear, red = busy).
      </p>
      <div className="glass rounded-2xl overflow-hidden">
        <StadiumMap />
      </div>
      <p className="text-[11px] text-yellow-400/70 mt-4">
        ⚠️ Gate congestion overlay is SIMULATED. Map data © OpenStreetMap.
      </p>
    </main>
  );
}
