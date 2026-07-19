"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchAgents } from "@/lib/api";
import Link from "next/link";

export default function DashboardHome() {
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    fetchAgents().then(setAgents).catch(() => setAgents([]));
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl"
      >
        Your World Cup, orchestrated.
      </motion.h1>
      <p className="text-white/50 mt-2">
        Five AI agents working for you. Tap one to start a conversation.
      </p>

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link
              href="/dashboard/chat"
              className="block glass rounded-2xl p-5 hover:border-brand/40 transition h-full"
              style={{ borderTop: `3px solid ${a.color}` }}
            >
              <div className="text-3xl">{a.icon}</div>
              <div className="mt-3 font-semibold">{a.name}</div>
              <div className="text-sm text-white/50 mt-1">{a.tagline}</div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        <QuickCard href="/dashboard/match" title="Match Dashboard" sub="Live scores & insights" />
        <QuickCard href="/dashboard/crowd" title="Crowd Intelligence" sub="Heatmaps & routes" />
        <QuickCard href="/dashboard/sustain" title="Sustainability" sub="Carbon & greener travel" />
      </div>
    </main>
  );
}

function QuickCard({ href, title, sub }: { href: string; title: string; sub: string }) {
  return (
    <Link href={href} className="glass rounded-2xl p-5 hover:border-brand/40 transition">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-white/50 mt-1">{sub}</div>
    </Link>
  );
}
