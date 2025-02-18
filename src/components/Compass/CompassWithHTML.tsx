import { type CSSProperties, PropsWithChildren } from 'react'
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
          style={{ transform: `rotate(${(360 - angle) % 360}deg)` }}>
          <div className="arrow-in"></div>
        </div>
      </div>
    </>
  )
}
