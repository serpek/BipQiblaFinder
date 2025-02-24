import {
  type CSSProperties,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState
} from 'react'
import './compass.scss'
import { useShortestRotation } from '../../hooks'
import { getDirectionName } from '../../utils'

type CompassViewProps = PropsWithChildren<
  {
    angle: number
    qible: number
  } & CSSProperties
>

export const Compass = ({ angle, qible, ...styles }: CompassViewProps) => {
  // **Titreşim engelleyici filtreleme: Küçük değişiklikleri yok sayar**
  // const correctedAngle = useFilteredAngle(angle, 3) // 3° eşik değeri
  // const correctedAngle = useSmoothedAngle(angle, 0.85)

  const [, setDeviceDirection] = useState<string>('')
  const [, setQiblaDirection] = useState<string>('')

  const correctedAngle = useShortestRotation(angle)

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
      {`correctedAngle ${correctedAngle}° | anglePoint: ${anglePoint}° | qible: ${qible}°`}
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
