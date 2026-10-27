<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getCurrentWeather } from './api/forecast'
import DailyForecast from './components/DailyForecast.vue'
import HourlyChart from './components/HourlyChart.vue'
import SearchBar from './components/SearchBar.vue'
import UnitToggle from './components/UnitToggle.vue'
import { useSettingsStore } from './stores/settings'
import type { CurrentWeather, ForecastResponse, GeocodingResult } from './types/weather'
import { convertTemp, convertWind, tempSymbol, windSymbol } from './utils/formatters'
import { describeWeather } from './utils/weatherCodes'

const settings = useSettingsStore()

const weather = ref<CurrentWeather | null>(null)
const hourly = ref<ForecastResponse['hourly'] | null>(null)
const daily = ref<ForecastResponse['daily'] | null>(null)
const cityName = ref('Buenos Aires')
const loading = ref(true)
const error = ref('')

const hourlyTemps = computed(() =>
  hourly.value
    ? hourly.value.temperature_2m.map((t) => convertTemp(t, settings.unit))
    : [],
)

async function loadWeather(lat: number, lon: number, name: string) {
  loading.value = true
  error.value = ''
  try {
    const data = await getCurrentWeather(lat, lon)
    weather.value = data.current
    hourly.value = data.hourly
    daily.value = data.daily
    cityName.value = name
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error desconocido'
  } finally {
    loading.value = false
  }
}

function onSelect(city: GeocodingResult) {
  loadWeather(city.latitude, city.longitude, city.name)
}

onMounted(() => loadWeather(-34.61, -58.38, 'Buenos Aires'))
</script>

<template>
  <div class="min-h-screen bg-slate-900 flex flex-col items-center gap-6 p-6 text-white">
    <h1 class="text-4xl font-bold text-sky-400">SkyBoard</h1>

    <SearchBar @select="onSelect" />
    <UnitToggle />

    <p v-if="loading">Cargando clima...</p>
    <p v-else-if="error" class="text-red-400">{{ error }}</p>

    <template v-else-if="weather && hourly && daily">
      <div class="rounded-2xl bg-slate-800 p-6 text-center">
        <p class="text-xl text-slate-300">{{ cityName }}</p>
        <p class="text-5xl">{{ describeWeather(weather.weather_code).icon }}</p>
        <p class="text-6xl font-bold">
          {{ convertTemp(weather.temperature_2m, settings.unit) }}{{ tempSymbol(settings.unit) }}
        </p>
        <p class="text-slate-300">{{ describeWeather(weather.weather_code).label }}</p>
        <p class="mt-2 text-slate-300">
          Sensación: {{ convertTemp(weather.apparent_temperature, settings.unit) }}{{ tempSymbol(settings.unit) }}
        </p>
        <p class="text-slate-300">Humedad: {{ weather.relative_humidity_2m }}%</p>
        <p class="text-slate-300">
          Viento: {{ convertWind(weather.wind_speed_10m, settings.unit) }} {{ windSymbol(settings.unit) }}
        </p>
      </div>

      <section class="w-full max-w-2xl rounded-2xl bg-slate-800 p-6">
        <h2 class="mb-4 text-lg font-semibold text-slate-200">Próximas 24 horas</h2>
        <HourlyChart :times="hourly.time" :temps="hourlyTemps" />
      </section>

      <section class="w-full max-w-4xl rounded-2xl bg-slate-800 p-6">
        <h2 class="mb-4 text-lg font-semibold text-slate-200">Próximos 7 días</h2>
        <DailyForecast :daily="daily" />
      </section>
    </template>
  </div>
</template>