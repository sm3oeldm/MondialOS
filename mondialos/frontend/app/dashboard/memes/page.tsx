"use client";

import { useEffect, useState } from "react";

type Meme = { img?: string; title: string; link: string };
const MEME_SUBREDDITS = ["soccer", "footballmemes", "soccercirclejerk"];

export default function MemesPage() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const results = await Promise.all(
        MEME_SUBREDDITS.map((sub) =>
          fetch(`https://meme-api.com/gimme/${sub}/4`).then((r) => r.json()).catch(() => null)
        )
      );
      let items: any[] = [];
      results.forEach((r) => {
        if (r && Array.isArray(r.memes) && r.memes.length) items = items.concat(r.memes);
        else if (r && r.url) items.push(r);
      });
      const seen = new Set<string>();
      items = items.filter((m) => {
        const url = m.url || (m.preview && m.preview[0]);
        if (!url || seen.has(url) || m.nsfw || m.spoiler) return false;
        seen.add(url);
        return true;
      });
      if (!items.length) throw new Error("empty");
      setMemes(
        items.slice(0, 12).map((m: any) => ({
          img: m.url || (m.preview && m.preview[0]),
          title: m.title || "Football Meme",
          link: m.postLink || "#",
        }))
      );
    } catch {
      setMemes([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-3xl">World Cup Memes 🤣</h1>
        <button
          onClick={load}
          className="px-4 py-2 rounded-lg bg-brand text-black font-semibold text-sm"
        >
          🔄 Refresh
        </button>
      </div>
      <p className="text-white/50 text-sm mb-6">Real football memes pulled live from Reddit.</p>
      {loading ? (
        <p className="text-white/40 text-sm">Loading real football memes…</p>
      ) : memes.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {memes.map((m, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.img}
                alt={m.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              <div className="p-3 flex items-center justify-between gap-2">
                <a
                  href={m.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/60 truncate hover:text-white"
                >
                  {m.title}
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white/40 text-sm py-10 text-center">
          Couldn&apos;t load live memes right now. Check your connection and tap Refresh 🔄
        </p>
      )}
    </main>
  );
}
