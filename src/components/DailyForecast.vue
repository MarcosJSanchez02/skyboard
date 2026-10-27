<script setup lang="ts">
import { useSettingsStore } from '../stores/settings';
import type { DailyWeather } from '../types/weather';
import { convertTemp } from '../utils/formatters';
import { describeWeather } from '../utils/weatherCodes';

defineProps<{ daily: DailyWeather }>()

const settings = useSettingsStore()

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
      <p class="font-semibold">
        {{ Math.round(convertTemp(daily.temperature_2m_max[i]!, settings.unit)) }}°
      </p>
      <p class="text-sm text-slate-400">
        {{ Math.round(convertTemp(daily.temperature_2m_min[i]!, settings.unit)) }}°
      </p>
    </li>
  </ul>
</template>