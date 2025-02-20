import { useCallback, useEffect, useState } from 'react'
import useDeviceType from './useDeviceType.ts'

export interface OrientationResult {
  loading: boolean
  absolute: boolean | null
  alpha: number | null
  timestamp: number | null
  error?: Error | IOrientationError
  log?: string
  requestPermission?: () => void
}

export interface IOrientationError {
  readonly code: number
  readonly message: string
  readonly PERMISSION_DENIED: number
}

export function useOrientation(): OrientationResult {
  const deviceType = useDeviceType()
  const [state, setState] = useState<OrientationResult>({
    loading: true,
    timestamp: Date.now(),
    absolute: null,
    alpha: null,
    error: undefined
  })

  const handleOrientation = useCallback(
    (e: DeviceOrientationEvent) => {
      console.log('orientation', e)
      let _alpha = e.alpha

      let _iosAlpha = (e as any).webkitCompassHeading
      _iosAlpha = _iosAlpha ? (360 - _iosAlpha) % 360 : 0

      if ((e as any).webkitCompassHeading) {
        _alpha = (e as any).webkitCompassHeading
      } else if (e.absolute && typeof e.alpha === 'number') {
        // _alpha = (360 - e.alpha) % 360
        // _alpha = e.alpha
      }

      if (e.absolute && typeof e.alpha === 'number') {
        _alpha = (360 - e.alpha) % 360
      }

      setState((prevState) => ({
        ...prevState,
        error: undefined,
        absolute: e.absolute,
        alpha: Math.round(_alpha || 0),
        log: `Alpha değerleri güncelleniyor. 
        angle: ${(360 - Math.round(_alpha || 0)) % 360}|
        _alpha: ${Math.round(_alpha || 0)} | 
        e.alpha: ${Math.round(e.alpha || 0)} |
        _iosAlpha: ${Math.round(_iosAlpha || 0)} | 
        CompassHeading: ${Math.round((e as any).webkitCompassHeading || 0)} |
        absolute: ${e.absolute} | 
        deviceabsolute ${typeof (DeviceOrientationEvent as any).requestPermission} |
        userAgent ${deviceType} |
        deviceorientation ${'ondeviceorientation' in window} |
        deviceorientationabsolute ${'ondeviceorientationabsolute' in window} |
        `
      }))
    },
    [deviceType]
  )

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
            log: permissionState
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
        if (deviceType === 'mobile') {
          window.addEventListener(
            'deviceorientationabsolute',
            handleOrientation
          )
        } else {
          window.addEventListener('deviceorientation', handleOrientation)
        }
        if ('DeviceOrientationEvent' in window) {
          setState((prevState) => ({
            ...prevState,
            error: undefined,
            loading: false,
            log: `Android ve eski iOS için doğrudan başlat`
          }))
        } else {
          setState((prevState) => ({
            ...prevState,
            error: undefined,
            loading: false,
            log: `DeviceOrientationEvent desteklenmiyor.`
          }))
        }
      }
    } catch (error: any) {
      setState((prevState) => ({
        ...prevState,
        error: error.message
          ? error
          : { message: 'Bilinmeyen bir hata oluştu.' },
        loading: false,
        log: 'Request Permission Exception'
      }))
    }
  }, [handleOrientation])

  useEffect(() => {
    requestPermission().catch(console.error)

    return () => {
      if ('ondeviceorientationabsolute' in window) {
        window.removeEventListener(
          'deviceorientationabsolute',
          handleOrientation
        )
      }
      if ('deviceorientation' in window) {
        window.removeEventListener('deviceorientation', handleOrientation)
      }
    }
  }, [handleOrientation, requestPermission])

  return { ...state, requestPermission }
}
