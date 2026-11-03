// @vitest-environment jsdom
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useSettingsStore } from './settings'

// jsdom no trae matchMedia, así que lo simulamos
function mockSystemTheme(prefersDark: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockReturnValue({ matches: prefersDark }),
  })
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
  mockSystemTheme(false)
  setActivePinia(createPinia())
})

describe('unidad', () => {
  it('empieza en métrico por defecto', () => {
    const settings = useSettingsStore()
    expect(settings.unit).toBe('metric')
  })

  it('carga la unidad guardada en localStorage', () => {
    localStorage.setItem('skyboard-unit', 'imperial')
    setActivePinia(createPinia())

    const settings = useSettingsStore()
    expect(settings.unit).toBe('imperial')
  })

  it('ignora valores inválidos guardados', () => {
    localStorage.setItem('skyboard-unit', 'cualquier-cosa')
    setActivePinia(createPinia())

    const settings = useSettingsStore()
    expect(settings.unit).toBe('metric')
  })

  it('guarda la unidad al cambiarla', async () => {
    const settings = useSettingsStore()
    settings.setUnit('imperial')
    await nextTick()

    expect(settings.unit).toBe('imperial')
    expect(localStorage.getItem('skyboard-unit')).toBe('imperial')
  })
})

describe('tema', () => {
  it('usa el tema claro si el sistema no prefiere oscuro', () => {
    const settings = useSettingsStore()
    expect(settings.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('usa el tema oscuro si el sistema lo prefiere', () => {
    mockSystemTheme(true)
    setActivePinia(createPinia())

    const settings = useSettingsStore()
    expect(settings.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('el tema guardado tiene prioridad sobre el del sistema', () => {
    mockSystemTheme(true)
    localStorage.setItem('skyboard-theme', 'light')
    setActivePinia(createPinia())

    const settings = useSettingsStore()
    expect(settings.theme).toBe('light')
  })

  it('toggleTheme alterna el tema, la clase "dark" y el almacenamiento', async () => {
    const settings = useSettingsStore()

    settings.toggleTheme()
    await nextTick()
    expect(settings.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('skyboard-theme')).toBe('dark')

    settings.toggleTheme()
    await nextTick()
    expect(settings.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(localStorage.getItem('skyboard-theme')).toBe('light')
  })
})