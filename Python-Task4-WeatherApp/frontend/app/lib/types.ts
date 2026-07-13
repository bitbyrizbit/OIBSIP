export interface Coordinates {
  lat: number;
  lon: number;
}

export interface Temperature {
  celsius: number;
  fahrenheit: number;
  feels_like_celsius: number;
  feels_like_fahrenheit: number;
}

export interface Wind {
  speed_kmh: number;
  speed_mph: number;
  direction_deg: number;
}

export interface CurrentWeather {
  location_name: string;
  country: string;
  coordinates: Coordinates;
  temperature: Temperature;
  humidity: number;
  pressure_hpa: number;
  condition: string;
  condition_description: string;
  condition_icon: string;
  wind: Wind;
  visibility_km: number;
  observed_at: number;
}

export interface HourlyForecastEntry {
  timestamp: number;
  time_label: string;
  temperature_celsius: number;
  temperature_fahrenheit: number;
  condition: string;
  condition_icon: string;
  precipitation_probability: number;
}

export interface DailyForecastEntry {
  date: string;
  day_label: string;
  temp_min_celsius: number;
  temp_max_celsius: number;
  temp_min_fahrenheit: number;
  temp_max_fahrenheit: number;
  condition: string;
  condition_icon: string;
  humidity_avg: number;
}

export interface ForecastResponse {
  location_name: string;
  country: string;
  hourly: HourlyForecastEntry[];
  daily: DailyForecastEntry[];
}

export type Unit = "celsius" | "fahrenheit";