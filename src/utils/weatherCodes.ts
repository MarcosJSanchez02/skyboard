export function describeWeather(code: number): { icon: string; label: string } {
  if (code === 0) return { icon: '☀️', label: 'Despejado' }
  if (code <= 2) return { icon: '🌤️', label: 'Parcialmente nublado' }
  if (code === 3) return { icon: '☁️', label: 'Nublado' }
  if (code <= 48) return { icon: '🌫️', label: 'Niebla' }
  if (code <= 57) return { icon: '🌦️', label: 'Llovizna' }
  if (code <= 67) return { icon: '🌧️', label: 'Lluvia' }
  if (code <= 77) return { icon: '❄️', label: 'Nieve' }
  if (code <= 82) return { icon: '🌧️', label: 'Chubascos' }
  if (code <= 86) return { icon: '🌨️', label: 'Nevadas' }
  return { icon: '⛈️', label: 'Tormenta' }
}