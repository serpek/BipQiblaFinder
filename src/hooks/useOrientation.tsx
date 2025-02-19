import { useCallback, useEffect, useState } from 'react'

export interface OrientationResult {
  absolute: boolean | null
  alpha: number | null
  beta: number | null
  gamma: number | null
}

export function useOrientation(): {
  orientation: OrientationResult | undefined
  requestPermission: () => Promise<void>
  isOrientationGranted: boolean
  errorMessage: string | null
} {
  // const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [orientation, setOrientation] = useState<OrientationResult>()
  const [isOrientationGranted, setIsOrientationGranted] =
    useState<boolean>(false)

  const requestPermission = useCallback(async () => {
    /*try {
                                                                  if (
                                                                    typeof DeviceOrientationEvent !== 'undefined' &&
                                                                    // @ts-expect-error iOS özellik kontrolü
                                                                    typeof DeviceOrientationEvent.requestPermission === 'function'
                                                                  ) {
                                                                    // @ts-expect-error iOS özellik kontrolü
                                                                    const permissionState = await DeviceOrientationEvent.requestPermission()
                                                                    setIsOrientationGranted(permissionState === 'granted')
                                                                  }
                                                                } catch {
                                                                  setIsOrientationGranted(false)
                                                                }*/
  }, [])

  useEffect(() => {
    const requestPermission = async () => {
      try {
        if (
          typeof DeviceOrientationEvent !== 'undefined' &&
          // @ts-ignore
          typeof DeviceOrientationEvent.requestPermission === 'function'
        ) {
          // 📌 iOS 13+ için kullanıcıdan izin iste
          const permissionState =
            // @ts-ignore
            await DeviceOrientationEvent.requestPermission()
          if (permissionState === 'granted') {
            setIsOrientationGranted(true)
            window.addEventListener('deviceorientation', handleOrientation)
          } else {
            throw new Error('Pusula erişim izni reddedildi.')
          }
        } else {
          // 📌 Android ve eski iOS için doğrudan başlat
          setIsOrientationGranted(true)
          window.addEventListener(
            'deviceorientationabsolute',
            handleOrientation
          )
          window.addEventListener('deviceorientation', handleOrientation)
        }
      } catch (error: any) {
        setErrorMessage(error.message || 'Bilinmeyen bir hata oluştu.')
      }
    }

    requestPermission()

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation)
      window.removeEventListener('deviceorientation', handleOrientation)
    }
  }, [])

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    let alpha = e.alpha
    // @ts-expect-error iOS özellik kontrolü
    if (e.webkitCompassHeading) {
      // alpha = e.webkitCompassHeading
    } else if (e.absolute && typeof e.alpha === 'number') {
      // alpha = (360 - e.alpha) % 360
      // alpha = e.alpha
    }

    if (typeof e.alpha === 'number') {
      alpha = (360 - e.alpha) % 360
    }

    setOrientation((prev) => ({
      ...prev,
      absolute: e.absolute,
      alpha: Math.round(alpha || 0),
      beta: Math.round(e.beta || 0),
      gamma: Math.round(e.gamma || 0)
    }))
  }, [])

  /*useEffect(() => {
                      if (isOrientationGranted) {
                        if (isIOS) {
                          window.addEventListener('deviceorientation', handleOrientation, true)
                        } else {
                          window.addEventListener(
                            'deviceorientationabsolute',
                            handleOrientation,
                            true
                          )
                        }
                  
                        return () => {
                          if (isIOS) {
                            window.removeEventListener('deviceorientation', handleOrientation)
                          } else {
                            window.removeEventListener(
                              'deviceorientationabsolute',
                              handleOrientation
                            )
                          }
                        }
                      }
                    }, [isOrientationGranted, handleOrientation, isIOS])*/

  /*useEffect(() => {
                requestPermission().catch(console.error)
              }, [])*/

  return { orientation, isOrientationGranted, errorMessage, requestPermission }
}
