import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type Unit = 'metric' | 'imperial'

const STORAGE_KEY = 'skyboard-unit'

function loadUnit(): Unit {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'imperial' ? 'imperial' : 'metric'
  } catch {
    return 'metric'
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const unit = ref<Unit>(loadUnit())

  watch(unit, (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // si el navegador bloquea el almacenamiento, simplemente no se guarda
    }
  })

  function setUnit(value: Unit) {
    unit.value = value
  }

  return { unit, setUnit }
})