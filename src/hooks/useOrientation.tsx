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
    alpha: null,
    error: undefined
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
      error: undefined,
      absolute: e.absolute,
      alpha: Math.round(_alpha || 0)
    }))
  }, [])

  const requestPermission = useCallback(async () => {
    try {
      alert('requestPermission 1')
      const event = DeviceOrientationEvent as any
      if (
        typeof event !== 'undefined' &&
        typeof event.requestPermission === 'function'
      ) {
        event.requestPermission().then((permissionState: string) => {
          alert('requestPermission 3')
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation)
            setState((prevState) => ({
              ...prevState,
              error: undefined,
              loading: false
            }))
          } else {
            alert('requestPermission 4')
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
        })
      } else {
        alert('requestPermission 5')
        // 📌 Android ve eski iOS için doğrudan başlat
        setState((prevState) => ({
          ...prevState,
          error: undefined,
          loading: false
        }))
        window.addEventListener('deviceorientationabsolute', handleOrientation)
        window.addEventListener('deviceorientation', handleOrientation)
      }
    } catch (error: any) {
      alert('requestPermission 6')
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
