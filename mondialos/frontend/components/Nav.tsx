"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const LINKS = [
  { href: "/dashboard", label: "Home" },
  { href: "/dashboard/chat", label: "Agents" },
  { href: "/dashboard/fan", label: "Fan" },
  { href: "/dashboard/match", label: "Matches" },
  { href: "/dashboard/crowd", label: "Crowd" },
  { href: "/dashboard/sustain", label: "Green" },
  { href: "/dashboard/map", label: "Map" },
  { href: "/dashboard/groups", label: "Groups" },
  { href: "/dashboard/memes", label: "Memes" },
];

export function Nav() {
  const path = usePathname();
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <nav className="flex items-center gap-1 overflow-x-auto px-4 py-3 border-b border-white/10">
      <span className="font-display text-lg mr-3 whitespace-nowrap">
        M<span className="text-brand">o</span>S
      </span>
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
            path === l.href
              ? "bg-brand text-black font-semibold"
              : "text-white/60 hover:text-white hover:bg-white/5"
          }`}
        >
          {l.label}
        </Link>
      ))}
      <button
        onClick={logout}
        className="ml-auto px-3 py-1.5 rounded-full text-sm text-white/40 hover:text-white whitespace-nowrap"
      >
        Sign out
      </button>
    </nav>
  );
}
