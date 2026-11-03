import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export interface FavoriteCity {
  name: string
  latitude: number
  longitude: number
}

const STORAGE_KEY = 'skyboard-favorites'

// Dos ciudades se consideran la misma si sus coordenadas coinciden a 2 decimales
function cityKey(city: { latitude: number; longitude: number }) {
  return `${city.latitude.toFixed(2)},${city.longitude.toFixed(2)}`
}

function isFavoriteCity(value: unknown): value is FavoriteCity {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.name === 'string' &&
    typeof v.latitude === 'number' &&
    typeof v.longitude === 'number'
  )
}

function loadFavorites(): FavoriteCity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isFavoriteCity) : []
  } catch {
    return []
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const cities = ref<FavoriteCity[]>(loadFavorites())

  watch(
    cities,
    (value) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      } catch {
        // si el navegador bloquea el almacenamiento, simplemente no se guarda
      }
    },
    { deep: true },
  )

  function isFavorite(city: { latitude: number; longitude: number }) {
    return cities.value.some((c) => cityKey(c) === cityKey(city))
  }

  function remove(city: { latitude: number; longitude: number }) {
    cities.value = cities.value.filter((c) => cityKey(c) !== cityKey(city))
  }

  function toggle(city: FavoriteCity) {
    if (isFavorite(city)) {
      remove(city)
    } else {
      cities.value = [...cities.value, city]
    }
  }

  return { cities, isFavorite, remove, toggle }
})