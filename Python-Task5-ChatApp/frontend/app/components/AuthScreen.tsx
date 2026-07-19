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
        setError("NETWORK REJECTED");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen bg-canvas-blue overflow-hidden">
      
      {/* Left decorative panel */}
      <div className="hidden lg:flex w-1/2 bg-accent-vermilion items-center justify-center border-r-8 border-ink-alabaster relative">
        <div className="absolute top-8 left-8">
          <span className="font-mono text-xs uppercase tracking-widest text-ink-alabaster border-4 border-ink-alabaster p-2 bg-canvas-blue">
            Instrument No. 02
          </span>
        </div>
        <h1 className="font-sans text-[12rem] font-black uppercase tracking-tighter leading-none text-ink-alabaster rotate-90 scale-150 mix-blend-overlay">
          Party<br/>Line
        </h1>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col justify-center px-12 lg:px-24 relative">
        
        <div className="mb-16">
          <h2 className="font-sans text-6xl font-black uppercase tracking-tighter text-ink-alabaster leading-none">
            {mode === "login" ? "Initialize" : "Register"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-xl">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-widest text-accent-absinthe">Operator ID</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="USERNAME"
              className="w-full bg-ink-alabaster text-canvas-blue px-6 py-4 font-sans text-4xl font-black uppercase tracking-tighter border-4 border-transparent focus:border-accent-absinthe focus:outline-none transition-colors"
            />
          </div>

          {mode === "register" && (
            <div className="flex flex-col gap-2">
              <label className="font-mono text-xs uppercase tracking-widest text-accent-absinthe">Network Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="EMAIL"
                className="w-full bg-ink-alabaster text-canvas-blue px-6 py-4 font-sans text-4xl font-black uppercase tracking-tighter border-4 border-transparent focus:border-accent-absinthe focus:outline-none transition-colors"
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-widest text-accent-absinthe">Cipher</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="PASSWORD"
              className="w-full bg-ink-alabaster text-canvas-blue px-6 py-4 font-sans text-4xl font-black uppercase tracking-tighter border-4 border-transparent focus:border-accent-absinthe focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="bg-accent-vermilion border-4 border-ink-alabaster p-4">
              <p className="font-sans text-xl font-bold uppercase tracking-tight text-ink-alabaster">
                FATAL: {error}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-accent-vermilion border-4 border-ink-alabaster py-6 font-sans text-4xl font-black uppercase tracking-tighter text-ink-alabaster hover:bg-ink-alabaster hover:text-accent-vermilion transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : mode === "login" ? "Execute" : "Join Network"}
          </button>
        </form>

        <div className="mt-12">
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-sans text-xl font-bold uppercase tracking-tight text-ink-alabaster hover:text-accent-absinthe transition-colors underline decoration-4 underline-offset-4"
          >
            {mode === "login" ? "Request new clearance ->" : "<- Return to login"}
          </button>
        </div>
      </div>
    </div>
  );
}