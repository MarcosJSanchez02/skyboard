// @vitest-environment jsdom
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { useFavoritesStore } from './favorites'

const nogoya = { name: 'Nogoyá', latitude: -32.39, longitude: -59.79 }
const madrid = { name: 'Madrid', latitude: 40.42, longitude: -3.7 }

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('favoritas', () => {
  it('empieza vacío', () => {
    const favorites = useFavoritesStore()
    expect(favorites.cities).toEqual([])
  })

  it('agrega una ciudad con toggle', () => {
    const favorites = useFavoritesStore()
    favorites.toggle(nogoya)

    expect(favorites.cities).toHaveLength(1)
    expect(favorites.isFavorite(nogoya)).toBe(true)
  })

  it('quita la ciudad si se vuelve a hacer toggle', () => {
    const favorites = useFavoritesStore()
    favorites.toggle(nogoya)
    favorites.toggle(nogoya)

    expect(favorites.cities).toHaveLength(0)
    expect(favorites.isFavorite(nogoya)).toBe(false)
  })

  it('no duplica ciudades con las mismas coordenadas', () => {
    const favorites = useFavoritesStore()
    favorites.toggle(nogoya)

    // misma ciudad con coordenadas ligeramente distintas (mismos 2 decimales)
    const casiIgual = { name: 'Nogoyá', latitude: -32.3901, longitude: -59.7899 }
    expect(favorites.isFavorite(casiIgual)).toBe(true)
  })

  it('remove quita solo la ciudad indicada', () => {
    const favorites = useFavoritesStore()
    favorites.toggle(nogoya)
    favorites.toggle(madrid)
    favorites.remove(nogoya)

    expect(favorites.cities).toEqual([madrid])
  })

  it('guarda las favoritas en localStorage', async () => {
    const favorites = useFavoritesStore()
    favorites.toggle(madrid)
    await nextTick()

    const saved = JSON.parse(localStorage.getItem('skyboard-favorites') ?? '[]')
    expect(saved).toEqual([madrid])
  })
})

describe('carga desde localStorage', () => {
  it('recupera las favoritas guardadas', () => {
    localStorage.setItem('skyboard-favorites', JSON.stringify([nogoya, madrid]))
    setActivePinia(createPinia())

    const favorites = useFavoritesStore()
    expect(favorites.cities).toEqual([nogoya, madrid])
  })

  it('ignora JSON corrupto', () => {
    localStorage.setItem('skyboard-favorites', '{esto no es json')
    setActivePinia(createPinia())

    const favorites = useFavoritesStore()
    expect(favorites.cities).toEqual([])
  })

  it('ignora datos que no son una lista', () => {
    localStorage.setItem('skyboard-favorites', JSON.stringify({ name: 'Madrid' }))
    setActivePinia(createPinia())

    const favorites = useFavoritesStore()
    expect(favorites.cities).toEqual([])
  })

  it('descarta entradas con formato inválido y conserva las válidas', () => {
    localStorage.setItem(
      'skyboard-favorites',
      JSON.stringify([madrid, { name: 123 }, null, 'texto']),
    )
    setActivePinia(createPinia())

    const favorites = useFavoritesStore()
    expect(favorites.cities).toEqual([madrid])
  })
})