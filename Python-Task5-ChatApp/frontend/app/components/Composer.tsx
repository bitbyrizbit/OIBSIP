"use client";

import { useState, useRef, FormEvent, ChangeEvent, KeyboardEvent, useEffect } from "react";
import { SHORTCODE_MAP } from "../lib/emoji";
import { motion, AnimatePresence } from "framer-motion";

interface ComposerProps {
  onSend: (content: string) => void;
  onTyping: () => void;
  disabled?: boolean;
}

export default function Composer({ onSend, onTyping, disabled }: ComposerProps) {
  const [value, setValue] = useState("");
  const lastTypingSentRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Emoji autocomplete state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiQuery, setEmojiQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const emojiEntries = Object.entries(SHORTCODE_MAP).filter(([code]) => 
    code.includes(emojiQuery) && code !== `:${emojiQuery}:`
  );

  useEffect(() => {
    // Check if we are currently typing a shortcode
    const cursor = inputRef.current?.selectionStart || value.length;
    const textBeforeCursor = value.slice(0, cursor);
    const lastWord = textBeforeCursor.split(/\s/).pop() || "";

    if (lastWord.startsWith(":") && lastWord.length > 1) {
      const query = lastWord.slice(1).toLowerCase();
      // Only show if there are matches
      const matches = Object.keys(SHORTCODE_MAP).some(code => code.includes(query) && code !== `:${query}:`);
      if (matches) {
        setEmojiQuery(query);
        setShowEmojiPicker(true);
        setSelectedIndex(0);
      } else {
        setShowEmojiPicker(false);
      }
    } else {
      setShowEmojiPicker(false);
    }
  }, [value]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    const now = Date.now();
    if (now - lastTypingSentRef.current > 1500) {
      onTyping();
      lastTypingSentRef.current = now;
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (showEmojiPicker && emojiEntries.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.min(emojiEntries.length, 5));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + Math.min(emojiEntries.length, 5)) % Math.min(emojiEntries.length, 5));
      } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        insertEmoji(emojiEntries[selectedIndex][0]);
      } else if (e.key === "Escape") {
        setShowEmojiPicker(false);
      }
    }
  }

  function insertEmoji(shortcode: string) {
    const cursor = inputRef.current?.selectionStart || value.length;
    const textBeforeCursor = value.slice(0, cursor);
    const textAfterCursor = value.slice(cursor);
    
    // Find where the current shortcode started
    const words = textBeforeCursor.split(/\s/);
    const lastWord = words.pop() || "";
    const textWithoutShortcode = textBeforeCursor.slice(0, textBeforeCursor.length - lastWord.length);
    
    const newValue = textWithoutShortcode + shortcode + " " + textAfterCursor;
    setValue(newValue);
    setShowEmojiPicker(false);
    
    // Maintain focus
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // Don't submit if we're picking an emoji
    if (showEmojiPicker) return;
    
    const trimmed = value.trim();
    if (trimmed.length > 0) {
      onSend(trimmed);
      setValue("");
      setShowEmojiPicker(false);
    }
  }

  return (
    <div style={{
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: "40px 10vw",
      background: "linear-gradient(to top, rgba(20, 17, 15, 1) 50%, rgba(20, 17, 15, 0))",
      zIndex: 10
    }}>
      
      <AnimatePresence>
        {showEmojiPicker && emojiEntries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: "absolute",
              bottom: "100%",
              left: "10vw",
              marginLeft: "204px", // Aligns with the input (180px label + 24px gap)
              marginBottom: "10px",
              background: "#1E1A16",
              border: "1px solid rgba(242, 234, 216, 0.1)",
              borderRadius: "4px",
              padding: "8px 0",
              boxShadow: "0 -10px 40px rgba(0,0,0,0.5)",
              display: "flex",
              flexDirection: "column",
              zIndex: 20
            }}
          >
            {emojiEntries.slice(0, 5).map(([code, emoji], idx) => (
              <button
                key={code}
                onClick={() => insertEmoji(code)}
                onMouseEnter={() => setSelectedIndex(idx)}
                style={{
                  background: idx === selectedIndex ? "rgba(201, 114, 74, 0.15)" : "transparent",
                  border: "none",
                  padding: "8px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  textAlign: "left",
                  color: idx === selectedIndex ? "#C9724A" : "rgba(242, 234, 216, 0.6)",
                  fontFamily: "var(--font-work-sans)",
                  fontSize: "0.9rem",
                  transition: "background 0.1s"
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>{emoji}</span>
                <span>{code}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "24px", alignItems: "baseline", position: "relative" }}>
        <div style={{ width: "180px", flexShrink: 0, textAlign: "right" }}>
          <label style={{ fontFamily: "var(--font-work-sans)", fontSize: "1rem", color: "rgba(242, 234, 216, 0.4)" }}>
            Your voice
          </label>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Speak into the receiver..."
          disabled={disabled}
          style={{
            flex: 1, background: "transparent", border: "none", borderBottom: "1px solid rgba(242, 234, 216, 0.2)",
            color: "#F2EAD8", fontSize: "1.75rem", fontFamily: "var(--font-newsreader)", fontStyle: "italic",
            padding: "8px 0", outline: "none", caretColor: "#C9724A"
          }}
        />

        <button
          type="submit"
          disabled={disabled || value.trim().length === 0}
          style={{
            background: "none", border: "none", padding: 0, cursor: "pointer",
            fontFamily: "var(--font-work-sans)", fontSize: "1rem", color: value.trim().length > 0 ? "#C9724A" : "rgba(242, 234, 216, 0.2)",
            transition: "color 0.2s"
          }}
        >
          Speak
        </button>
      </form>
    </div>
  );
}