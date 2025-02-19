import { useCallback, useEffect, useState } from 'react'

export interface OrientationResult {
  loading: boolean
  absolute: boolean | null
  alpha: number | null
  timestamp: number | null
  error?: Error | IOrientationError
  log?: string
  requestPermission: () => void
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
      alpha: Math.round(_alpha || 0),
      log: 'Alpha değerleri güncelleniyor'
    }))
  }, [])

  const requestPermission = useCallback(async () => {
    try {
      const event = DeviceOrientationEvent as any
      if (
        typeof event !== 'undefined' &&
        typeof event.requestPermission === 'function'
      ) {
        const permissionState = await event.requestPermission()
        if (permissionState === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation)
          setState((prevState) => ({
            ...prevState,
            error: undefined,
            loading: false,
            log: permissionState + ' permissionState'
          }))
        } else {
          setState((prevState) => ({
            ...prevState,
            error: {
              code: 1,
              message: 'Pusula erişim izni reddedildi.',
              PERMISSION_DENIED: 1
            },
            loading: false,
            log: ' Pusula erişim izni reddedildi.'
          }))
        }
      } else {
        setState((prevState) => ({
          ...prevState,
          error: undefined,
          loading: false,
          log: 'Android ve eski iOS için doğrudan başlat'
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
        loading: false,
        log: 'Exception catch'
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

  return { ...state, requestPermission }
}
