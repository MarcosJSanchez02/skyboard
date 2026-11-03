<script setup lang="ts">
import { useSettingsStore } from '../stores/settings';

const settings = useSettingsStore()
</script>

<template>
  <button
    class="rounded-xl bg-white px-3 py-2 text-xl shadow-sm transition hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
    :aria-label="settings.theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    @click="settings.toggleTheme()"
  >
    {{ settings.theme === 'dark' ? '☀️' : '🌙' }}
  </button>
</template>