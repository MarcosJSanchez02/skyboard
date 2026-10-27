import type { GeocodingResponse } from '../types/weather'
import { getJson } from './client'

const BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search'

export async function searchCities(name: string, signal?: AbortSignal) {
  const params = new URLSearchParams({
    name,
    count: '5',
    language: 'es',
  })

  const data = await getJson<GeocodingResponse>(`${BASE_URL}?${params}`, signal)
  return data.results ?? []
}