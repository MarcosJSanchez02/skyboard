<script setup lang="ts">
import { useSettingsStore } from '../stores/settings';

const settings = useSettingsStore()
</script>

<template>
  <div class="inline-flex rounded-xl bg-slate-800 p-1" role="group" aria-label="Unidades">
    <button
      class="rounded-lg px-4 py-1.5 text-sm font-medium transition"
      :class="settings.unit === 'metric' ? 'bg-sky-500 text-white' : 'text-slate-300 hover:text-white'"
      :aria-pressed="settings.unit === 'metric'"
      @click="settings.setUnit('metric')"
    >
      °C · km/h
    </button>
    <button
      class="rounded-lg px-4 py-1.5 text-sm font-medium transition"
      :class="settings.unit === 'imperial' ? 'bg-sky-500 text-white' : 'text-slate-300 hover:text-white'"
      :aria-pressed="settings.unit === 'imperial'"
      @click="settings.setUnit('imperial')"
    >
      °F · mph
    </button>
  </div>
</template>