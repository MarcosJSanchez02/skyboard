<script setup lang="ts">
import { useGeolocation } from '../composables/useGeolocation';
import type { FavoriteCity } from '../stores/favorites';

const emit = defineEmits<{
  locate: [city: FavoriteCity]
}>()

const { locating, locationError, locate } = useGeolocation()

async function onClick() {
  const coords = await locate()
  if (coords) {
    emit('locate', { name: 'Mi ubicación', ...coords })
  }
}
</script>

<template>
  <div class="flex flex-col items-center gap-2">
    <button
      class="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:opacity-60 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      :disabled="locating"
      @click="onClick"
    >
      {{ locating ? 'Buscando ubicación...' : '📍 Usar mi ubicación' }}
    </button>

    <p v-if="locationError" role="alert" class="max-w-md text-center text-sm text-red-500 dark:text-red-400">
      {{ locationError }}
    </p>
  </div>
</template>