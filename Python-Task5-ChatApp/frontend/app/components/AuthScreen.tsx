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
        setError("Connection failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#111318",
    border: "1px solid rgba(255,255,255,0.1)",
    padding: "14px 18px",
    fontSize: "1rem",
    color: "#F4F0E8",
    outline: "none",
    letterSpacing: "0.01em",
    borderRadius: "2px",
    caretColor: "#C9964A",
    fontFamily: "var(--font-work-sans), sans-serif",
    transition: "border-color 0.2s",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0C0D11",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(201,150,74,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: "460px", position: "relative", zIndex: 1 }}>
        {/* Brand mark */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h1
            className="font-display"
            style={{
              fontSize: "3.5rem",
              fontStyle: "italic",
              fontWeight: 300,
              color: "#F4F0E8",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Party Line
          </h1>
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            {/* Decorative lines flanking the subtitle */}
            <div style={{ height: "1px", width: "40px", background: "rgba(201,150,74,0.4)" }} />
            <span
              className="font-sans"
              style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#C9964A", textTransform: "uppercase" }}
            >
              Instrument No. 02
            </span>
            <div style={{ height: "1px", width: "40px", background: "rgba(201,150,74,0.4)" }} />
          </div>
        </div>

        {/* The Ticket Form */}
        <div
          style={{
            background: "#111318",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: "2px",
            overflow: "hidden",
            boxShadow: "0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,150,74,0.05) inset",
          }}
        >
          {/* Ticket header strip */}
          <div
            style={{
              background: "rgba(201,150,74,0.06)",
              borderBottom: "1px solid rgba(201,150,74,0.15)",
              padding: "14px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              className="font-sans"
              style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#C9964A", textTransform: "uppercase" }}
            >
              {mode === "login" ? "Access Request" : "Operator Registration"}
            </span>
            {/* Barcode decoration */}
            <div style={{ display: "flex", gap: "2px", alignItems: "center", opacity: 0.4 }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} style={{ width: i % 3 === 0 ? "3px" : "1.5px", height: "12px", background: "#C9964A" }} />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "28px 24px 24px" }}>
            <div>
              <label
                className="font-sans"
                style={{ display: "block", fontSize: "10px", letterSpacing: "0.12em", color: "#7A8A9E", textTransform: "uppercase", marginBottom: "8px" }}
              >
                Operator ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Your username"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,150,74,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            {mode === "register" && (
              <div>
                <label
                  className="font-sans"
                  style={{ display: "block", fontSize: "10px", letterSpacing: "0.12em", color: "#7A8A9E", textTransform: "uppercase", marginBottom: "8px" }}
                >
                  Network Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,150,74,0.5)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />
              </div>
            )}

            <div>
              <label
                className="font-sans"
                style={{ display: "block", fontSize: "10px", letterSpacing: "0.12em", color: "#7A8A9E", textTransform: "uppercase", marginBottom: "8px" }}
              >
                Cipher
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Min. 8 characters"
                style={{ ...inputStyle, letterSpacing: "0.08em" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(201,150,74,0.5)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(196,75,53,0.1)",
                  border: "1px solid rgba(196,75,53,0.3)",
                  borderRadius: "2px",
                  padding: "10px 14px",
                }}
              >
                <p className="font-sans" style={{ fontSize: "12px", color: "#C44B35", letterSpacing: "0.03em" }}>
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="font-sans"
              style={{
                marginTop: "8px",
                width: "100%",
                background: "transparent",
                border: "1px solid rgba(201,150,74,0.5)",
                padding: "14px",
                fontSize: "12px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#C9964A",
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.6 : 1,
                transition: "all 0.2s ease",
                borderRadius: "2px",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = "#C9964A";
                  e.currentTarget.style.color = "#0C0D11";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#C9964A";
              }}
            >
              {loading ? "Connecting..." : mode === "login" ? "Establish Connection" : "Register Operator"}
            </button>
          </form>
        </div>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="font-sans"
            style={{
              background: "none",
              border: "none",
              fontSize: "12px",
              color: "#7A8A9E",
              cursor: "pointer",
              letterSpacing: "0.05em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#F4F0E8")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#7A8A9E")}
          >
            {mode === "login" ? "Need access? Register here →" : "← Back to login"}
          </button>
        </div>
      </div>
    </div>
  );
}