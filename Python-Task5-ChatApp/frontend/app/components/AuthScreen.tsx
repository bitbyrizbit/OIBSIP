"use client";

import { useState, FormEvent } from "react";
import { login, register, getMe, ApiError } from "../lib/api";
import { useAuth } from "../lib/AuthContext";

export default function AuthScreen() {
  const { setSession } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "register") {
        await register(username, email, password);
      }
      const { access_token } = await login(username, password);
      const user = await getMe(access_token);
      setSession(access_token, user);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Connection failed. Check credentials.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background px-6 relative overflow-hidden">
      {/* Cinematic lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface-raised/20 via-background to-background pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="mb-16 text-center">
          <p className="mb-4 font-sans text-[10px] tracking-[0.4em] text-accent-copper uppercase">
            Instrument No. 02
          </p>
          <h1 className="font-display text-7xl italic tracking-tight text-ink drop-shadow-md">Party Line</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-surface p-10 rounded-sm shadow-xl hairline-t hairline-b hairline-l hairline-r border-hairline-dark">
          <div className="text-center mb-2">
            <h2 className="font-sans text-xs tracking-[0.2em] uppercase text-ink-secondary">
              {mode === "login" ? "Establish Link" : "Register Operator"}
            </h2>
          </div>

          <div className="relative">
            <label className="absolute -top-4 left-0 font-sans text-[10px] tracking-widest text-ink-tertiary uppercase">Operator Name</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border-0 hairline-b border-hairline-dark bg-transparent px-0 pb-2 pt-2 font-display text-2xl text-ink focus:outline-none focus:ring-0 focus:border-accent-copper transition-colors"
            />
          </div>

          {mode === "register" && (
            <div className="relative mt-2">
              <label className="absolute -top-4 left-0 font-sans text-[10px] tracking-widest text-ink-tertiary uppercase">Dispatch Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-0 hairline-b border-hairline-dark bg-transparent px-0 pb-2 pt-2 font-display text-2xl text-ink focus:outline-none focus:ring-0 focus:border-accent-copper transition-colors"
              />
            </div>
          )}

          <div className="relative mt-2">
            <label className="absolute -top-4 left-0 font-sans text-[10px] tracking-widest text-ink-tertiary uppercase">Cipher Code</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full border-0 hairline-b border-hairline-dark bg-transparent px-0 pb-2 pt-2 font-sans text-xl tracking-widest text-ink focus:outline-none focus:ring-0 focus:border-accent-copper transition-colors"
            />
          </div>

          {error && (
            <p className="font-sans text-xs tracking-wide text-[#873232]">
              Alert: {error}
            </p>
          )}

          <div className="mt-6 text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-copper/10 hairline-t hairline-b hairline-l hairline-r border-accent-copper/30 py-4 font-sans text-xs tracking-[0.2em] uppercase text-accent-copper transition-all hover:bg-accent-copper hover:text-background hover:shadow-[0_0_15px_rgba(181,115,76,0.4)] disabled:opacity-30 active:scale-[0.98]"
            >
              {loading ? "Connecting..." : mode === "login" ? "Connect" : "Register"}
            </button>
          </div>
        </form>

        <div className="mt-12 text-center">
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-sans text-[10px] tracking-widest text-ink-tertiary uppercase transition-colors hover:text-accent-copper"
          >
            {mode === "login" ? "Require new clearance?" : "Return to active duty"}
          </button>
        </div>
      </div>
    </div>
  );
}