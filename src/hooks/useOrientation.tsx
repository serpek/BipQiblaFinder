import { useCallback, useEffect, useState } from 'react'

export interface OrientationResult {
  loading: boolean
  absolute: boolean | null
  alpha: number | null
  timestamp: number | null
  error?: Error | IOrientationError
}

export interface IOrientationError {
  readonly code: number
  readonly message: string
  readonly PERMISSION_DENIED: number
}

export function useOrientation(): OrientationResult {
  // const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const [state, setState] = useState<OrientationResult>({
    loading: true,
    timestamp: Date.now(),
    absolute: null,
    alpha: null
  })

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    let _alpha = e.alpha
    // @ts-expect-error iOS özellik kontrolü
    if (e.webkitCompassHeading) {
      // _alpha = e.webkitCompassHeading
    } else if (e.absolute && typeof e.alpha === 'number') {
      // _alpha = (360 - e.alpha) % 360
      // _alpha = e.alpha
    }

    if (typeof e.alpha === 'number') {
      _alpha = (360 - e.alpha) % 360
    }

    setState((prevState) => ({
      ...prevState,
      absolute: e.absolute,
      alpha: Math.round(_alpha || 0)
    }))
  }, [])

  const requestPermission = useCallback(async () => {
    try {
      if (
        typeof (DeviceOrientationEvent as any) !== 'undefined' &&
        typeof (DeviceOrientationEvent as any).requestPermission === 'function'
      ) {
        const permissionState = await (
          DeviceOrientationEvent as any
        ).requestPermission()
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation)
          setState((prevState) => ({
            ...prevState,
            loading: false
          }))
        } else {
          setState((prevState) => ({
            ...prevState,
            error: {
              code: 1,
              message: 'Pusula erişim izni reddedildi.',
              PERMISSION_DENIED: 1
            },
            loading: false
          }))
        }
      } else {
        // 📌 Android ve eski iOS için doğrudan başlat
        setState((prevState) => ({
          ...prevState,
          loading: false
        }))
        window.addEventListener('deviceorientationabsolute', handleOrientation)
        window.addEventListener('deviceorientation', handleOrientation)
      }
    } catch (error: any) {
      setState((prevState) => ({
        ...prevState,
        error: error.message
          ? error
          : { message: 'Bilinmeyen bir hata oluştu.' },
        loading: false
      }))
    }
  }, [handleOrientation])

  useEffect(() => {
    requestPermission().catch(console.error)

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation)
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [handleOrientation, requestPermission])

  return state
}
