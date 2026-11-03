import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Unit = 'metric' | 'imperial'
export type Theme = 'light' | 'dark'

const UNIT_KEY = 'skyboard-unit'
const THEME_KEY = 'skyboard-theme'

function loadUnit(): Unit {
  try {
    return localStorage.getItem(UNIT_KEY) === 'imperial' ? 'imperial' : 'metric'
  } catch {
    return 'metric'
  }
}

function loadTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // sin acceso al almacenamiento: se usa la preferencia del sistema
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useSettingsStore = defineStore('settings', () => {
  const unit = ref<Unit>(loadUnit())
  const theme = ref<Theme>(loadTheme())

  watch(unit, (value) => {
    try {
      localStorage.setItem(UNIT_KEY, value)
    } catch {
      // si el navegador bloquea el almacenamiento, simplemente no se guarda
    }
  })

  watch(
    theme,
    (value) => {
      document.documentElement.classList.toggle('dark', value === 'dark')
      try {
        localStorage.setItem(THEME_KEY, value)
      } catch {
        // idem
      }
    },
    { immediate: true },
  )

  function setUnit(value: Unit) {
    unit.value = value
  }

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { unit, theme, setUnit, toggleTheme }
})