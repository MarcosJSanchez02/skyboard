import { describe, expect, it } from 'vitest'
import { convertTemp, convertWind, tempSymbol, windSymbol } from './formatters'

describe('convertTemp', () => {
  it('no cambia la temperatura en métrico', () => {
    expect(convertTemp(22.4, 'metric')).toBe(22.4)
  })

  it('convierte 0 °C a 32 °F', () => {
    expect(convertTemp(0, 'imperial')).toBe(32)
  })

  it('convierte 100 °C a 212 °F', () => {
    expect(convertTemp(100, 'imperial')).toBe(212)
  })

  it('maneja temperaturas negativas (-40 es igual en ambas escalas)', () => {
    expect(convertTemp(-40, 'imperial')).toBe(-40)
  })

  it('redondea a un decimal', () => {
    expect(convertTemp(15.64, 'metric')).toBe(15.6)
  })
})

describe('convertWind', () => {
  it('no cambia la velocidad en métrico', () => {
    expect(convertWind(8.7, 'metric')).toBe(8.7)
  })

  it('convierte km/h a mph', () => {
    expect(convertWind(10, 'imperial')).toBe(6.2)
  })

  it('devuelve 0 cuando no hay viento', () => {
    expect(convertWind(0, 'imperial')).toBe(0)
  })
})

describe('símbolos de unidad', () => {
  it('devuelve los símbolos métricos', () => {
    expect(tempSymbol('metric')).toBe('°C')
    expect(windSymbol('metric')).toBe('km/h')
  })

  it('devuelve los símbolos imperiales', () => {
    expect(tempSymbol('imperial')).toBe('°F')
    expect(windSymbol('imperial')).toBe('mph')
  })
})