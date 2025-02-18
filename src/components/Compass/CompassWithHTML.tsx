import { type CSSProperties, PropsWithChildren, useMemo } from 'react'
import './compass.scss'

type CompassViewProps = PropsWithChildren<
  {
    angle: number
    qible: number
  } & CSSProperties
>

export const CompassWithHTML = ({
  angle,
  qible,
  ...styles
}: CompassViewProps) => {
  const anglePoint = useMemo(() => {
    let diff = Math.abs(((360 - angle) % 360) - qible)
    diff = Math.min(diff, 360 - diff) // 0° ve 360° geçişini düzeltir
    return diff <= 10
  }, [angle, qible])

  return (
    <>
      <div
        className="compass"
        style={{
          transform: `rotate(${angle}deg)`,
          position: 'relative',
          ...styles
        }}>
        <div
          className="arrow-wrapper"
          style={{
            transform: `rotate(${qible}deg)`
          }}>
          <div className="qible-arrow">
            <img
              src="/assets/kabe.png"
              alt="Kaaba Icon"
              className="kabe-icon"
            />
          </div>
        </div>

        <div
          className="compass-arrow"
          style={{
            transform: `rotate(${(360 - angle) % 360}deg)`,
            opacity: anglePoint ? 1 : 0.5
          }}>
          <div className="arrow-in"></div>
        </div>
      </div>
    </>
  )
}
