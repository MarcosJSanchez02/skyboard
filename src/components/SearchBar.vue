<script setup lang="ts">
import { ref, watch } from 'vue';
import { searchCities } from '../api/geocoding';
import type { GeocodingResult } from '../types/weather';

const emit = defineEmits<{
  select: [city: GeocodingResult]
}>()

const query = ref('')
const results = ref<GeocodingResult[]>([])
const searching = ref(false)

let timer: ReturnType<typeof setTimeout>
let controller: AbortController | null = null

watch(query, (value) => {
  clearTimeout(timer)
  controller?.abort()

  if (value.trim().length < 2) {
    results.value = []
    return
  }

  // Espera 400 ms desde la última tecla antes de buscar
  timer = setTimeout(async () => {
    controller = new AbortController()
    searching.value = true
    try {
      results.value = await searchCities(value.trim(), controller.signal)
    } catch (e) {
      if (!(e instanceof DOMException && e.name === 'AbortError')) {
        results.value = []
      }
    } finally {
      searching.value = false
    }
  }, 400)
})

function choose(city: GeocodingResult) {
  emit('select', city)
  query.value = ''
  results.value = []
}
</script>

<template>
  <div class="relative w-full max-w-md">
    <input
      v-model="query"
      type="text"
      placeholder="Buscar ciudad..."
      aria-label="Buscar ciudad"
      class="w-full rounded-xl bg-white px-4 py-3 text-slate-900 placeholder-slate-500 shadow-sm outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-800 dark:text-white dark:placeholder-slate-400 dark:focus:ring-sky-400"
    />

    <p v-if="searching" class="mt-2 text-sm text-slate-500 dark:text-slate-400">Buscando...</p>

    <ul
      v-if="results.length"
      class="absolute z-10 mt-2 w-full overflow-hidden rounded-xl bg-white shadow-lg dark:bg-slate-800"
    >
      <li v-for="city in results" :key="city.id">
        <button
          class="w-full px-4 py-3 text-left text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700"
          @click="choose(city)"
        >
          {{ city.name }}
          <span class="text-sm text-slate-500 dark:text-slate-400">
            {{ [city.admin1, city.country].filter(Boolean).join(', ') }}
          </span>
        </button>
      </li>
    </ul>
  </div>
</template>