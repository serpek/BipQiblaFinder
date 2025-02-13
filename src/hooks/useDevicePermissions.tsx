import { useCallback, useEffect, useState } from 'react'

interface LocationData {
  latitude: number | null
  longitude: number | null
  error?: string
}

interface OrientationData {
  alpha: number | null
  beta: number | null
  gamma: number | null
  error?: string
}

export function useDevicePermissions() {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null
  })
  const [orientation, setOrientation] = useState<OrientationData>({
    alpha: null,
    beta: null,
    gamma: null
  })
  const [geoPermission, setGeoPermission] = useState<PermissionState | null>(
    null
  )
  const [motionPermission, setMotionPermission] =
    useState<PermissionState | null>(null)

  // 📍 Konum İzni ve Verileri Alma
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        error: 'Geolocation desteklenmiyor.'
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        setGeoPermission('granted')
      },
      (error) => {
        setLocation({ latitude: null, longitude: null, error: error.message })
        setGeoPermission('denied')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }, [])

  // 📱 Cihaz Hareket Sensörleri
  const requestMotionPermission = useCallback(async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const permissionState = await (
          DeviceOrientationEvent as any
        ).requestPermission()
        setMotionPermission(permissionState)
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true)
        }
      } catch (error) {
        setMotionPermission('denied')
      }
    } else {
      // Android gibi izin gerektirmeyen cihazlar için doğrudan event listener ekleyelim
      setMotionPermission('granted')
      window.addEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  // 📌 Hareket Sensörü Verisini İşleme
  const handleOrientation = (event: DeviceOrientationEvent) => {
    setOrientation({
      alpha: event.alpha !== null ? parseFloat(event.alpha.toFixed(2)) : 0,
      beta: event.beta !== null ? parseFloat(event.beta.toFixed(2)) : 0,
      gamma: event.gamma !== null ? parseFloat(event.gamma.toFixed(2)) : 0
    })
  }

  // 📌 Kullanıcı sayfadan ayrıldığında sensör dinleyicilerini temizle
  useEffect(() => {
    requestLocation()

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  useEffect(() => {
    if (geoPermission === 'granted') {
      requestMotionPermission()
    }
  }, [geoPermission])

  return {
    location,
    orientation,
    requestLocation,
    requestMotionPermission,
    geoPermission,
    motionPermission
  }
}
