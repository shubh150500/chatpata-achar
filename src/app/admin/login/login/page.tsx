"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock } from "lucide-react";
import LogoPlaceholder from "@/components/ui/LogoPlaceholder";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@chatpata.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      window.location.href = "/admin";
    } else {
      setError("Invalid email or password");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-luxury-gradient px-5">
      <div className="pointer-events-none absolute inset-0 bg-spice-radial" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-3xl glass-strong p-8 shadow-glass"
      >
        <div className="flex flex-col items-center">
          <LogoPlaceholder />
          <h1 className="mt-4 font-display text-2xl font-bold text-brand-cream">
            Admin Dashboard
          </h1>
          <p className="text-sm text-brand-cream/50">Chatpata Achaar</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1 block text-xs text-brand-cream/60">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl glass px-4 py-3 text-brand-cream outline-none focus:ring-1 focus:ring-brand-saffron"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-brand-cream/60">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl glass px-4 py-3 text-brand-cream outline-none focus:ring-1 focus:ring-brand-saffron"
            />
          </div>
          {error && <p className="text-sm text-brand-red">{error}</p>}
          <button
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Lock className="h-4 w-4" /> Sign In
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-brand-cream/40">
          Demo: admin@chatpata.com / achaar123
        </p>
      </motion.div>
    </div>
  );
}
