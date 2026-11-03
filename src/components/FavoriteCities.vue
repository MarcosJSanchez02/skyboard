<script setup lang="ts">
import { useFavoritesStore, type FavoriteCity } from '../stores/favorites';

const emit = defineEmits<{
  select: [city: FavoriteCity]
}>()

const favorites = useFavoritesStore()
</script>

<template>
  <ul v-if="favorites.cities.length" class="flex w-full max-w-2xl flex-wrap justify-center gap-2">
    <li
      v-for="city in favorites.cities"
      :key="`${city.latitude},${city.longitude}`"
      class="inline-flex items-center overflow-hidden rounded-full bg-white shadow-sm dark:bg-slate-800"
    >
      <button
        class="px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
        @click="emit('select', city)"
      >
        ⭐ {{ city.name }}
      </button>
      <button
        class="px-2 py-1.5 text-sm text-slate-500 hover:bg-slate-100 hover:text-red-500 dark:text-slate-400 dark:hover:bg-slate-700"
        :aria-label="`Quitar ${city.name} de favoritas`"
        @click="favorites.remove(city)"
      >
        ✕
      </button>
    </li>
  </ul>
</template>