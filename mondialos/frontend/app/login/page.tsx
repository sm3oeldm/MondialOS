"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setInfo("Check your email to confirm your account, then sign in.");
      }
    } catch (err: any) {
      setError(err.message || "Auth error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen grid place-items-center px-6">
      <div className="w-full max-w-sm glass rounded-3xl p-8">
        <h1 className="font-display text-3xl text-center">
          M<span className="text-brand">o</span>ndial<span className="text-brand">OS</span>
        </h1>
        <p className="text-center text-white/50 text-sm mt-2">
          {mode === "login" ? "Welcome back" : "Create your account"}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@fan.com"
            className="w-full px-4 py-3 rounded-xl bg-ink-700 border border-white/10 outline-none focus:border-brand"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-full px-4 py-3 rounded-xl bg-ink-700 border border-white/10 outline-none focus:border-brand"
          />
          <button
            disabled={loading}
            className="w-full py-3 rounded-xl bg-brand text-black font-semibold hover:bg-brand-glow disabled:opacity-50"
          >
            {loading ? "..." : mode === "login" ? "Sign In" : "Sign Up"}
          </button>
        </form>

        {error && <p className="text-red-400 text-sm mt-3 text-center">{error}</p>}
        {info && <p className="text-brand-glow text-sm mt-3 text-center">{info}</p>}

        <p className="text-center text-white/40 text-sm mt-4">
          {mode === "login" ? "No account?" : "Already registered?"}{" "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-brand-glow underline"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </main>
  );
}
