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
        setError("Transmission failed. Re-verify credentials.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <p className="mb-4 font-mono text-[10px] tracking-[0.3em] text-ink-tertiary">
            instrument no. 02
          </p>
          <h1 className="font-display text-6xl tracking-tight text-ink">Party Line</h1>
          <p className="mt-4 font-sans small-caps text-sm text-ink-secondary">
            {mode === "login" ? "Establish Connection" : "Register New Operator"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="relative">
            <label className="absolute -top-3 left-0 font-mono text-[10px] tracking-widest text-ink-tertiary">username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border-0 hairline-b bg-transparent px-0 pb-2 pt-4 font-display text-2xl italic text-ink focus:outline-none focus:ring-0 focus:border-ink"
            />
          </div>

          {mode === "register" && (
            <div className="relative mt-2">
              <label className="absolute -top-3 left-0 font-mono text-[10px] tracking-widest text-ink-tertiary">email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-0 hairline-b bg-transparent px-0 pb-2 pt-4 font-display text-2xl italic text-ink focus:outline-none focus:ring-0 focus:border-ink"
              />
            </div>
          )}

          <div className="relative mt-2">
            <label className="absolute -top-3 left-0 font-mono text-[10px] tracking-widest text-ink-tertiary">cipher</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full border-0 hairline-b bg-transparent px-0 pb-2 pt-4 font-sans text-xl tracking-widest text-ink focus:outline-none focus:ring-0 focus:border-ink"
            />
          </div>

          {error && (
            <p className="font-mono text-xs text-accent-red">
              [ ERROR: {error} ]
            </p>
          )}

          <div className="mt-8 text-center">
            <button
              type="submit"
              disabled={loading}
              className="group relative inline-block font-mono text-xs tracking-[0.2em] text-ink transition-colors disabled:opacity-30"
            >
              <span className="relative z-10">
                {loading ? "authenticating..." : mode === "login" ? "connect" : "register"}
              </span>
              <span className="absolute bottom-[-4px] left-0 h-px w-0 bg-ink transition-all duration-300 group-hover:w-full" />
            </button>
          </div>
        </form>

        <div className="mt-16 text-center">
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-mono text-[10px] tracking-widest text-ink-tertiary hover:text-ink-secondary"
          >
            {mode === "login" ? "[ issue new credentials ]" : "[ authenticate existing operator ]"}
          </button>
        </div>
      </div>
    </div>
  );
}