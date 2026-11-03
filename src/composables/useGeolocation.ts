import { ref } from 'vue'

export interface Coordinates {
  latitude: number
  longitude: number
}

export function useGeolocation() {
  const locating = ref(false)
  const locationError = ref('')

  function locate(): Promise<Coordinates | null> {
    locationError.value = ''

    if (!('geolocation' in navigator)) {
      locationError.value = 'Tu navegador no soporta geolocalización.'
      return Promise.resolve(null)
    }

    locating.value = true

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          locating.value = false
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (err) => {
          locating.value = false
          if (err.code === err.PERMISSION_DENIED) {
            locationError.value =
              'Permiso denegado. Habilita la ubicación en tu navegador para usar esta función.'
          } else if (err.code === err.TIMEOUT) {
            locationError.value = 'Se agotó el tiempo para obtener tu ubicación. Intenta de nuevo.'
          } else {
            locationError.value = 'No se pudo obtener tu ubicación.'
          }
          resolve(null)
        },
        { timeout: 10000, maximumAge: 5 * 60 * 1000 },
      )
    })
  }

  return { locating, locationError, locate }
}