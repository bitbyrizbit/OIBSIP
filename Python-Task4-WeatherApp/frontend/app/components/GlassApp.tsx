"use client";

import { useState } from "react";
import Header from "./Header";
import HeroPanel from "./HeroPanel";
import SearchBar from "./SearchBar";
import UnitToggle from "./UnitToggle";
import { getCurrentWeather, ApiError } from "../lib/api";
import type { CurrentWeather, Unit } from "../lib/types";
import { motion } from "framer-motion";

export default function GlassApp() {
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [unit, setUnit] = useState<Unit>("celsius");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(city: string) {
    setLoading(true);
    setError(null);
    try {
      const result = await getCurrentWeather(city);
      setWeather(result);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError(`no record found for "${city}". check the name and try again.`);
      } else {
        setError("the glass could not take a reading just now. try again shortly.");
      }
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl">
      <Header />

      <div className="flex items-center justify-between px-8 md:px-16">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} disabled={loading} />
        </div>
        <div className="ml-6">
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
      </div>

      {loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="px-8 py-12 font-mono text-sm text-text-tertiary md:px-16"
        >
          taking a reading...
        </motion.p>
      )}

      {error && !loading && (
        <p className="px-8 py-12 font-sans text-lg text-text-secondary md:px-16">{error}</p>
      )}

      {weather && !loading && !error && <HeroPanel weather={weather} unit={unit} />}

      {!weather && !loading && !error && (
        <p className="px-8 py-12 font-sans text-lg text-text-secondary md:px-16">
          the glass is waiting. log a location above to begin a reading.
        </p>
      )}
    </main>
  );
}