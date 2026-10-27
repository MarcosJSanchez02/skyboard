import type { Unit } from '../stores/settings'

function round1(value: number) {
  return Math.round(value * 10) / 10
}

export function convertTemp(celsius: number, unit: Unit) {
  return round1(unit === 'imperial' ? (celsius * 9) / 5 + 32 : celsius)
}

export function tempSymbol(unit: Unit) {
  return unit === 'imperial' ? '°F' : '°C'
}

export function convertWind(kmh: number, unit: Unit) {
  return round1(unit === 'imperial' ? kmh * 0.621371 : kmh)
}

export function windSymbol(unit: Unit) {
  return unit === 'imperial' ? 'mph' : 'km/h'
}