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
        setError("something went wrong. try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-3xl italic text-ink">Party Line</h1>
        <p className="mt-2 font-sans text-sm text-ink-secondary">
          {mode === "login" ? "pick up the line." : "get yourself a line."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border-b border-hairline bg-transparent py-2 font-sans text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-accent-red"
          />
          {mode === "register" && (
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-b border-hairline bg-transparent py-2 font-sans text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-accent-red"
            />
          )}
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="border-b border-hairline bg-transparent py-2 font-sans text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-accent-red"
          />

          {error && <p className="font-sans text-sm text-accent-red">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-md bg-ink py-2.5 font-sans text-sm text-background transition-opacity duration-300 hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "connecting..." : mode === "login" ? "pick up" : "join the line"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-6 font-mono text-xs uppercase tracking-widest text-ink-tertiary hover:text-ink-secondary"
        >
          {mode === "login" ? "new here? join the line" : "already on the line? pick up"}
        </button>
      </div>
    </div>
  );
}