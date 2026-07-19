"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const AGENTS = [
  { icon: "🎟️", name: "Fan Agent", desc: "Personalized itineraries & recommendations" },
  { icon: "🏟️", name: "Stadium Agent", desc: "Every gate, restroom & checkpoint" },
  { icon: "⚽", name: "Match Intelligence", desc: "Tactics & insights, simply explained" },
  { icon: "📊", name: "Crowd Intelligence", desc: "Beat the congestion, find the fast gate" },
  { icon: "🌱", name: "Sustainability", desc: "Greener travel, lower footprint" },
];

export default function Landing() {
  const router = useRouter();

  async function enter() {
    const { data } = await supabase.auth.getSession();
    router.push(data.session ? "/dashboard" : "/login");
  }

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* animated background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand/20 blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl animate-float" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl animate-float" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1 rounded-full glass text-xs uppercase tracking-widest text-brand-glow">
            AI Operating System · FIFA World Cup
          </span>
          <h1 className="mt-6 font-display text-6xl sm:text-8xl leading-none">
            M<span className="text-brand">o</span>ndial<span className="text-brand">OS</span>
          </h1>
          <p className="mt-6 text-lg text-white/60 max-w-2xl mx-auto">
            One platform. Five AI agents. The World Cup, intelligently
            orchestrated — for fans, organizers, volunteers, and host cities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10"
        >
          <button
            onClick={enter}
            className="px-10 py-4 rounded-full bg-brand text-black font-display text-lg hover:bg-brand-glow transition animate-pulse-glow"
          >
            Enter MondialOS →
          </button>
        </motion.div>

        <div className="mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {AGENTS.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
              className="glass rounded-2xl p-5 text-left hover:border-brand/40 transition"
            >
              <div className="text-3xl">{a.icon}</div>
              <div className="mt-3 font-semibold text-sm">{a.name}</div>
              <div className="text-xs text-white/50 mt-1">{a.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
