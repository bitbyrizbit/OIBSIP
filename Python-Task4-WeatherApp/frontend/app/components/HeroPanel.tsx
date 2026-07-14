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
  const unitLabel = unit === "celsius" ? "C" : "F";
  const windSpeed = unit === "celsius" ? weather.wind.speed_kmh : weather.wind.speed_mph;
  const windUnit = unit === "celsius" ? "km/h" : "mph";
  const accentClass = isStormCondition(weather.condition) ? "text-accent-storm" : "text-accent-brass";
  const accentBg = isStormCondition(weather.condition) ? "bg-accent-storm" : "bg-accent-brass";

  return (
    <section className="px-8 pt-8 pb-8 md:px-16 md:pt-12 md:pb-12 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
        
        {/* Massive Temperature */}
        <div className="lg:col-span-7 flex flex-col">
          <Reveal delay={0.1}>
            <p className={`font-mono text-[10px] uppercase tracking-[0.3em] mb-4 md:mb-8 ${accentClass}`}>
              Atmospheric Reading / {weather.condition}
            </p>
          </Reveal>
          
          <Reveal delay={0.2}>
            <div className="flex items-start">
              <span className="font-display text-[9rem] md:text-[14rem] leading-[0.8] font-light tracking-tighter text-text-primary">
                <CountUp value={temp} decimals={0} />
              </span>
              <span className={`font-sans text-2xl md:text-4xl mt-4 md:mt-8 ml-2 md:ml-6 font-light ${accentClass}`}>
                °{unitLabel}
              </span>
            </div>
          </Reveal>
        </div>

        {/* Location & Details */}
        <div className="lg:col-span-5 flex flex-col justify-end pb-4 md:pb-8">
          <Reveal delay={0.3}>
            <h1 className="font-display text-4xl md:text-5xl font-light text-text-primary leading-tight">
              {weather.location_name}
            </h1>
            <p className={`mt-2 font-mono text-[10px] uppercase tracking-[0.3em] ${accentClass}`}>
              {weather.coordinates.lat.toFixed(4)}°N &nbsp; {weather.coordinates.lon.toFixed(4)}°E
            </p>
          </Reveal>
          
          <Reveal delay={0.4}>
            <p className="mt-8 font-sans text-lg leading-relaxed text-text-primary/70 max-w-sm">
              {describeConditions(weather.condition, weather.location_name)}
            </p>
          </Reveal>
        </div>
      </div>

      <Reveal delay={0.5}>
        <div className="mt-12 md:mt-16 flex flex-wrap items-start justify-between gap-12 border-t border-hairline pt-10">
          <div className="flex gap-16 flex-wrap">
            <div>
              <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${accentClass}`}>Humidity</p>
              <p className="mt-2 font-sans text-2xl font-light text-text-primary">{weather.humidity}%</p>
            </div>
            <div>
              <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${accentClass}`}>Pressure</p>
              <p className="mt-2 font-sans text-2xl font-light text-text-primary">{weather.pressure_hpa} <span className={`text-sm ${accentClass} opacity-70`}>hPa</span></p>
            </div>
            <div>
              <p className={`font-mono text-[10px] uppercase tracking-[0.3em] ${accentClass}`}>Visibility</p>
              <p className="mt-2 font-sans text-2xl font-light text-text-primary">{weather.visibility_km.toFixed(1)} <span className={`text-sm ${accentClass} opacity-70`}>km</span></p>
            </div>
          </div>
          <div className="shrink-0 -mt-2">
            <WindCompass directionDeg={weather.wind.direction_deg} speed={windSpeed} unit={windUnit} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}