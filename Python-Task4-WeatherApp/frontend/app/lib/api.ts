import type { CurrentWeather, ForecastResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({ detail: response.statusText }));
    throw new ApiError(response.status, body.detail ?? "Something went wrong");
  }

  return response.json();
}

export function getCurrentWeather(city: string): Promise<CurrentWeather> {
  return request<CurrentWeather>(`/api/weather/current?city=${encodeURIComponent(city)}`);
}

export function getForecast(city: string): Promise<ForecastResponse> {
  return request<ForecastResponse>(`/api/weather/forecast?city=${encodeURIComponent(city)}`);
}