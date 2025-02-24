import {
  type CSSProperties,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import './compass.scss'
import { useShortestRotation } from '../../hooks'
import { getDirectionName } from '../../utils'

type CompassViewProps = PropsWithChildren<
  {
    alpha: number | null
    angle: number
    qible: number
  } & CSSProperties
>

export const Compass = ({
  alpha,
  angle,
  qible,
  ...styles
}: CompassViewProps) => {
  // **Titreşim engelleyici filtreleme: Küçük değişiklikleri yok sayar**
  // const correctedAngle1 = useFilteredAngle(angle, 3) // 3° eşik değeri
  // const correctedAngle2 = useSmoothedAngle(angle, 0.85)

  const [, setDeviceDirection] = useState<string>('')
  const [, setQiblaDirection] = useState<string>('')
  const heading = useRef<number>(0)

  const correctedAngle = useShortestRotation(angle)

  useEffect(() => {
    if (alpha) {
      heading.current = alpha * (Math.PI / 180)
    }
  }, [alpha])

  const anglePoint = useMemo(() => {
    let diff = Math.abs(((360 - angle) % 360) - qible)
    diff = Math.min(diff, 360 - diff) // 0° ve 360° geçişini düzeltir
    return diff <= 10
  }, [angle, qible])

  useEffect(() => {
    const qiblaDirection = getDirectionName(qible)
    setQiblaDirection(qiblaDirection.name)

    const deviceDirection = getDirectionName(angle)
    setDeviceDirection(deviceDirection.name)
  }, [angle, qible])

  return (
    <>
      {`corrected ${Math.round(correctedAngle)}° | angle: ${angle}° | alpha: ${alpha}° | heading: ${heading.current}°`}
      <div
        className="compass"
        style={{
          transform: `rotate(${correctedAngle}deg)`,
          position: 'relative',
          ...styles
        }}>
        <div
          className="arrow-wrapper"
          style={{
            transform: `rotate(${qible}deg)`
          }}>
          <div className="qible-arrow">
            <div className="kabe-icon"></div>
          </div>
        </div>

        <div
          className="compass-arrow"
          style={{
            transform: `rotate(${(360 - correctedAngle) % 360}deg)`,
            opacity: anglePoint ? 1 : 0.5
          }}>
          <div className="arrow-in"></div>
        </div>
      </div>
    </>
  )
}
