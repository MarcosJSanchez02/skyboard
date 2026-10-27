<script setup lang="ts">
import type { DailyWeather } from '../types/weather';
import { describeWeather } from '../utils/weatherCodes';

defineProps<{ daily: DailyWeather }>()

function dayName(date: string, index: number) {
  if (index === 0) return 'Hoy'
  return new Date(`${date}T00:00`).toLocaleDateString('es', { weekday: 'short' })
}
</script>

<template>
  <ul class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
    <li
      v-for="(date, i) in daily.time"
      :key="date"
      class="rounded-xl bg-slate-700/60 p-3 text-center"
    >
      <p class="text-sm capitalize text-slate-300">{{ dayName(date, i) }}</p>
      <p class="my-1 text-3xl" :title="describeWeather(daily.weather_code[i]!).label">
        {{ describeWeather(daily.weather_code[i]!).icon }}
      </p>
      <p class="font-semibold">{{ Math.round(daily.temperature_2m_max[i]!) }}°</p>
      <p class="text-sm text-slate-400">{{ Math.round(daily.temperature_2m_min[i]!) }}°</p>
    </li>
  </ul>
</template>