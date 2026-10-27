import type { ForecastResponse } from '../types/weather'
import { getJson } from './client'

const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

export function getCurrentWeather(
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
    hourly: 'temperature_2m',
    forecast_hours: '24',
    timezone: 'auto',
  })

  return getJson<ForecastResponse>(`${BASE_URL}?${params}`, signal)
}