"use client";

import { useState, FormEvent, useRef, useEffect } from "react";
import { login, register, getMe, ApiError } from "../lib/api";
import { useAuth } from "../lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthScreen() {
  const { setSession } = useAuth();
  
  // Stages: 'identity' -> 'new_or_returning' -> (if new) 'dispatch' -> 'cipher' -> 'connecting'
  const [stage, setStage] = useState<"identity" | "new_or_returning" | "dispatch" | "cipher" | "connecting">("identity");
  
  const [username, setUsername] = useState("");
  const [isNew, setIsNew] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [stage, error]);

  async function handleConnect() {
    setError(null);
    setStage("connecting");
    try {
      if (isNew) {
        await register(username, email, password);
      }
      const { access_token } = await login(username, password);
      const user = await getMe(access_token);
      setSession(access_token, user);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("The line went dead. Try again.");
      }
      // Reset to cipher if it failed
      setStage("cipher");
      setPassword("");
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (error) setError(null);

    if (stage === "identity") {
      if (username.trim()) setStage("new_or_returning");
    } else if (stage === "dispatch") {
      if (email.trim()) setStage("cipher");
    } else if (stage === "cipher") {
      if (password.length >= 8) handleConnect();
      else setError("Your cipher must be at least 8 characters long.");
    }
  }

  function goBack() {
    if (stage === "new_or_returning") setStage("identity");
    else if (stage === "dispatch") setStage("new_or_returning");
    else if (stage === "cipher") {
      if (isNew) setStage("dispatch");
      else setStage("new_or_returning");
    }
    setError(null);
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "5vw",
      position: "relative",
    }}>
      <div style={{ position: "absolute", top: "40px", left: "40px" }}>
        <h1 className="font-display" style={{ fontSize: "1.2rem", fontStyle: "italic", color: "rgba(242, 234, 216, 0.4)" }}>Party Line</h1>
      </div>

      <div style={{ width: "100%", maxWidth: "800px" }}>
        <AnimatePresence mode="wait">
          
          {stage === "identity" && (
            <motion.div key="identity" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <p className="font-display" style={{ fontSize: "3rem", fontStyle: "italic", color: "#F2EAD8", marginBottom: "40px", lineHeight: 1.2 }}>
                Who is picking up the receiver?
              </p>
              <form onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your name..."
                  style={{
                    width: "100%", background: "transparent", border: "none", borderBottom: "2px solid rgba(242, 234, 216, 0.2)",
                    fontSize: "2rem", color: "#C9724A", padding: "10px 0", outline: "none", fontFamily: "var(--font-work-sans)"
                  }}
                />
              </form>
            </motion.div>
          )}

          {stage === "new_or_returning" && (
            <motion.div key="new_or_returning" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <p className="font-display" style={{ fontSize: "3rem", fontStyle: "italic", color: "#F2EAD8", marginBottom: "40px", lineHeight: 1.2 }}>
                Ah, {username}. Have you called this line before?
              </p>
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <button
                  onClick={() => { setIsNew(false); setStage("cipher"); }}
                  style={{
                    background: "transparent", border: "1px solid #7BAFC4", color: "#7BAFC4", padding: "16px 32px",
                    fontSize: "1.2rem", cursor: "pointer", borderRadius: "40px", transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#7BAFC4"; e.currentTarget.style.color = "#14110F"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#7BAFC4"; }}
                >
                  Yes, I'm returning.
                </button>
                <button
                  onClick={() => { setIsNew(true); setStage("dispatch"); }}
                  style={{
                    background: "transparent", border: "1px solid #C9724A", color: "#C9724A", padding: "16px 32px",
                    fontSize: "1.2rem", cursor: "pointer", borderRadius: "40px", transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#C9724A"; e.currentTarget.style.color = "#14110F"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C9724A"; }}
                >
                  No, this is my first time.
                </button>
                <button 
                  onClick={goBack}
                  style={{ 
                    background: "none", border: "none", color: "rgba(242, 234, 216, 0.3)", 
                    fontSize: "1rem", cursor: "pointer", textDecoration: "underline", marginLeft: "10px" 
                  }}
                >
                  Wait, that's not my name
                </button>
              </div>
            </motion.div>
          )}

          {stage === "dispatch" && (
            <motion.div key="dispatch" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <p className="font-display" style={{ fontSize: "3rem", fontStyle: "italic", color: "#F2EAD8", marginBottom: "40px", lineHeight: 1.2 }}>
                Where should we direct your missives?
              </p>
              <form onSubmit={handleSubmit} style={{ position: "relative" }}>
                <input
                  ref={inputRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your dispatch address (email)..."
                  style={{
                    width: "100%", background: "transparent", border: "none", borderBottom: "2px solid rgba(242, 234, 216, 0.2)",
                    fontSize: "2rem", color: "#C9724A", padding: "10px 0", outline: "none", fontFamily: "var(--font-work-sans)"
                  }}
                />
              </form>
              <div style={{ marginTop: "24px" }}>
                <button 
                  onClick={goBack}
                  style={{ background: "none", border: "none", color: "rgba(242, 234, 216, 0.4)", fontSize: "1rem", cursor: "pointer", textDecoration: "underline", padding: 0 }}
                >
                  Go back
                </button>
              </div>
            </motion.div>
          )}

          {stage === "cipher" && (
            <motion.div key="cipher" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <p className="font-display" style={{ fontSize: "3rem", fontStyle: "italic", color: "#F2EAD8", marginBottom: "40px", lineHeight: 1.2 }}>
                What is your secret cipher, {username}?
              </p>
              <form onSubmit={handleSubmit}>
                <input
                  ref={inputRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your cipher..."
                  style={{
                    width: "100%", background: "transparent", border: "none", borderBottom: "2px solid rgba(242, 234, 216, 0.2)",
                    fontSize: "2rem", color: "#C9724A", padding: "10px 0", outline: "none", fontFamily: "var(--font-work-sans)",
                    letterSpacing: "0.2em"
                  }}
                />
              </form>
              <div style={{ marginTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button 
                  onClick={goBack}
                  style={{ background: "none", border: "none", color: "rgba(242, 234, 216, 0.4)", fontSize: "1rem", cursor: "pointer", textDecoration: "underline", padding: 0 }}
                >
                  Go back
                </button>
                {error && (
                  <p style={{ color: "#C9724A", fontStyle: "italic", fontSize: "1.2rem", margin: 0 }}>
                    {error}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {stage === "connecting" && (
            <motion.div key="connecting" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <p className="font-display" style={{ fontSize: "4rem", fontStyle: "italic", color: "#C9724A", animation: "ambient-pulse 2s infinite" }}>
                Ringing the operator...
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}