import type { CurrentWeather, Unit } from "../lib/types";
import { describeConditions, isStormCondition } from "../lib/copy";
import CountUp from "./CountUp";
import WindCompass from "./WindCompass";
import Reveal from "./Reveal";

interface HeroPanelProps {
  weather: CurrentWeather;
  unit: Unit;
}

export default function HeroPanel({ weather, unit }: HeroPanelProps) {
  const temp = unit === "celsius" ? weather.temperature.celsius : weather.temperature.fahrenheit;
  const unitLabel = unit === "celsius" ? "deg C" : "deg F";
  const windSpeed = unit === "celsius" ? weather.wind.speed_kmh : weather.wind.speed_mph;
  const windUnit = unit === "celsius" ? "km/h" : "mph";
  const accentClass = isStormCondition(weather.condition) ? "text-accent-storm" : "text-accent-brass";

  return (
    <section className="px-8 py-12 md:px-16 md:py-20">
      <Reveal>
        <p className={`font-mono text-xs uppercase tracking-widest ${accentClass}`}>
          present conditions over
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-4 flex items-baseline gap-4">
          <h1 className="font-display text-6xl font-light text-text-primary md:text-8xl">
            {weather.location_name}
          </h1>
          <span className="font-mono text-sm text-text-secondary">
            {weather.coordinates.lat.toFixed(2)}N, {weather.coordinates.lon.toFixed(2)}E
          </span>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-10 flex items-end gap-6">
          <span className="font-display text-8xl font-light leading-none text-text-primary md:text-9xl">
            <CountUp value={temp} decimals={1} />
          </span>
          <span className="mb-4 font-mono text-2xl text-text-secondary">{unitLabel}</span>
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <p className="mt-6 max-w-md font-sans text-lg leading-relaxed text-text-secondary">
          {describeConditions(weather.condition, weather.location_name)}
        </p>
      </Reveal>

      <Reveal delay={0.4}>
        <div className="mt-12 flex flex-wrap items-start gap-10 border-t border-hairline pt-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">humidity</p>
            <p className="mt-1 font-mono text-xl text-text-primary">{weather.humidity}%</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">pressure</p>
            <p className="mt-1 font-mono text-xl text-text-primary">{weather.pressure_hpa} hpa</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">visibility</p>
            <p className="mt-1 font-mono text-xl text-text-primary">{weather.visibility_km.toFixed(1)} km</p>
          </div>
          <WindCompass directionDeg={weather.wind.direction_deg} speed={windSpeed} unit={windUnit} />
        </div>
      </Reveal>
    </section>
  );
}