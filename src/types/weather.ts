export interface CurrentWeather {
  time: string
  temperature_2m: number
  apparent_temperature: number
  relative_humidity_2m: number
  wind_speed_10m: number
  weather_code: number
}

export interface ForecastResponse {
  latitude: number
  longitude: number
  current: CurrentWeather
  hourly: {
    time: string[]
    temperature_2m: number[]
  }
}

export interface GeocodingResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country?: string
  admin1?: string
}

export interface GeocodingResponse {
  results?: GeocodingResult[]
}