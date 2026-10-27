<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getCurrentWeather } from './api/forecast'
import type { CurrentWeather } from './types/weather'

const weather = ref<CurrentWeather | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    // Coordenadas de prueba: Buenos Aires
    const data = await getCurrentWeather(-34.61, -58.38)
    weather.value = data.current
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error desconocido'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4 text-white">
    <h1 class="text-4xl font-bold text-sky-400">SkyBoard</h1>

    <p v-if="loading">Cargando clima...</p>
    <p v-else-if="error" class="text-red-400">{{ error }}</p>

    <div v-else-if="weather" class="rounded-2xl bg-slate-800 p-6 text-center">
      <p class="text-6xl font-bold">{{ weather.temperature_2m }}°C</p>
      <p class="mt-2 text-slate-300">Sensación: {{ weather.apparent_temperature }}°C</p>
      <p class="text-slate-300">Humedad: {{ weather.relative_humidity_2m }}%</p>
      <p class="text-slate-300">Viento: {{ weather.wind_speed_10m }} km/h</p>
    </div>
  </div>
</template>