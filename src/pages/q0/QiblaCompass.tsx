import { useEffect, useRef, useState } from 'react'
import { useDevicePermissions } from '../../hooks'
import { Qibla } from '../../utils'
import './QiblaCompass.css'

function QiblaCompass() {
  const {
    orientation,
    location,
    requestLocation,
    requestMotionPermission,
    geoPermission,
    motionPermission
  } = useDevicePermissions()

  const [pointDegree, setPointDegree] = useState(0)

  const compassCircle = useRef<HTMLDivElement>(null)
  const myPoint = useRef<HTMLDivElement>(null)

  const isIOS =
    navigator.userAgent.match(/(iPod|iPhone|iPad)/) &&
    navigator.userAgent.match(/AppleWebKit/)

  useEffect(() => {
    console.log(motionPermission, geoPermission)
  }, [motionPermission, geoPermission])

  useEffect(() => {
    const compass = orientation.alpha

    if (compass === null) return

    if (compassCircle.current) {
      compassCircle.current.style.transform = `translate(-50%, -50%) rotate(${-compass}deg)`
    }

    if (myPoint.current) {
      if (
        (pointDegree < Math.abs(compass) &&
          pointDegree + 15 > Math.abs(compass)) ||
        pointDegree > Math.abs(compass + 15) ||
        pointDegree < Math.abs(compass)
      ) {
        myPoint.current.style.opacity = '0'
      } else if (pointDegree) {
        myPoint.current.style.opacity = '1'
      }
    }
  }, [orientation, pointDegree])

  useEffect(() => {
    const { latitude, longitude } = location

    if (latitude === null || longitude === null) return

    //setPointDegree(() => calcDegreeToPoint(latitude, longitude));
    setPointDegree(() => Qibla.degreesFromTrueNorth(latitude, longitude))

    if (pointDegree < 0) {
      setPointDegree(() => pointDegree + 360)
    }
  }, [location])

  return (
    <>
      <div>
        <div>
          {geoPermission === 'denied' && (
            <button onClick={requestLocation}>Konum İzni vermek için</button>
          )}

          {isIOS && motionPermission === 'denied' && (
            <button onClick={requestMotionPermission}>
              Hareket Sensörü İzni vermek için
            </button>
          )}
        </div>
      </div>
      <div className="compass">
        <div className="arrow"></div>
        <div className="compass-circle" ref={compassCircle}></div>
        <div className="my-point" ref={myPoint}></div>
      </div>
    </>
  )
}

export default QiblaCompass
