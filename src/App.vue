<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCurrentWeather } from './api/forecast'
import HourlyChart from './components/HourlyChart.vue'
import SearchBar from './components/SearchBar.vue'
import type { CurrentWeather, ForecastResponse, GeocodingResult } from './types/weather'

const weather = ref<CurrentWeather | null>(null)
const hourly = ref<ForecastResponse['hourly'] | null>(null)
const cityName = ref('Buenos Aires')
const loading = ref(true)
const error = ref('')

async function loadWeather(lat: number, lon: number, name: string) {
  loading.value = true
  error.value = ''
  try {
    const data = await getCurrentWeather(lat, lon)
    weather.value = data.current
    hourly.value = data.hourly
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

    <p v-if="loading">Cargando clima...</p>
    <p v-else-if="error" class="text-red-400">{{ error }}</p>

    <template v-else-if="weather && hourly">
      <div class="rounded-2xl bg-slate-800 p-6 text-center">
        <p class="text-xl text-slate-300">{{ cityName }}</p>
        <p class="text-6xl font-bold">{{ weather.temperature_2m }}°C</p>
        <p class="mt-2 text-slate-300">Sensación: {{ weather.apparent_temperature }}°C</p>
        <p class="text-slate-300">Humedad: {{ weather.relative_humidity_2m }}%</p>
        <p class="text-slate-300">Viento: {{ weather.wind_speed_10m }} km/h</p>
      </div>

      <section class="w-full max-w-2xl rounded-2xl bg-slate-800 p-6">
        <h2 class="mb-4 text-lg font-semibold text-slate-200">Próximas 24 horas</h2>
        <HourlyChart :times="hourly.time" :temps="hourly.temperature_2m" />
      </section>
    </template>
  </div>
</template>