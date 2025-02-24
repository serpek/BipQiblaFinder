import {
  type CSSProperties,
  PropsWithChildren,
  useEffect,
  useMemo,
  useState
} from 'react'
import './compass.scss'
import { Group, Image, Layer, Stage } from 'react-konva'
import useImage from 'use-image'
import { useWindowSize } from 'react-use'
import {
  useFilteredAngle,
  useShortestRotation,
  useSmoothedAngle
} from '../../hooks'
import { getDirectionName } from '../../utils'

import compassImg from '../../assets/compass.png'
import qibleArrowImg from '../../assets/arrow.png'
import kabeImg from '../../assets/kabe.png'
import arrowInImg from '../../assets/arrow-in.png'

type CompassViewProps = PropsWithChildren<
  {
    alpha: number
    qible: number
  } & CSSProperties
>

export const Compass = ({ alpha = 0, qible, ...styles }: CompassViewProps) => {
  // **Titreşim engelleyici filtreleme: Küçük değişiklikleri yok sayar**
  const correctedAngle1 = useFilteredAngle(alpha, 3) // 3° eşik değeri
  const correctedAngle2 = useSmoothedAngle(alpha, 0.85)

  const [compassImage] = useImage(compassImg)
  const [qibleArrowImage] = useImage(qibleArrowImg)
  const [kabeImage] = useImage(kabeImg)
  const [arrowInImage] = useImage(arrowInImg)

  const [, setDeviceDirection] = useState<string>('')
  const [, setQiblaDirection] = useState<string>('')
  const [deviceAngle, setDeviceAngle] = useState<number>(0)

  const size = useWindowSize()
  const correctedAngle = useShortestRotation(deviceAngle)

  useEffect(() => {
    if (alpha) {
      const angle = (360 - alpha) % 360
      setDeviceAngle(angle)
    }
  }, [alpha, deviceAngle])

  const anglePoint = useMemo(() => {
    let diff = Math.abs(((360 - deviceAngle) % 360) - qible)
    diff = Math.min(diff, 360 - diff) // 0° ve 360° geçişini düzeltir
    return diff <= 10
  }, [deviceAngle, qible])

  useEffect(() => {
    const qiblaDirection = getDirectionName(qible)
    setQiblaDirection(qiblaDirection.name)

    const deviceDirection = getDirectionName(deviceAngle)
    setDeviceDirection(deviceDirection.name)
  }, [deviceAngle, qible])

  const screenWidth = useMemo(() => size.width / 1.1, [size.width])
  const screenScale = useMemo(
    () => screenWidth / size.width,
    [screenWidth, size.width]
  )

  return (
    <>
      <div>{`angle: ${deviceAngle}° | alpha: ${alpha}°`}</div>
      <div>{`correct 1: ${correctedAngle1}° | correct 2: ${correctedAngle2}°`}</div>
      <Stage
        width={size.width}
        height={size.width}
        style={{ backgroundColor: '#ccc' }}>
        <Layer>
          <Group
            width={size.width}
            height={size.width}
            x={size.width / 2}
            y={size.width / 2}
            offsetX={size.width / 2}
            offsetY={size.width / 2}
            scale={{
              x: screenScale,
              y: screenScale
            }}
            rotation={deviceAngle}
            duration={0.5}>
            <Image
              width={size.width}
              height={size.width}
              image={compassImage}
            />
            <Image
              x={size.width / 2}
              y={size.width / 2}
              offsetX={34}
              offsetY={125}
              width={68}
              height={91}
              image={qibleArrowImage}
              duration={0.5}
              rotation={qible}
            />
            <Image
              x={size.width / 2}
              y={size.width / 2}
              offsetX={24}
              offsetY={210}
              width={48}
              height={56}
              image={kabeImage}
              duration={0.5}
              rotation={qible}
            />
          </Group>

          <Image
            x={size.width / 2}
            y={size.width / 2}
            offsetX={24}
            offsetY={112}
            width={48}
            height={64}
            image={arrowInImage}
            opacity={anglePoint ? 1 : 0.5}
            scale={{
              x: screenScale,
              y: screenScale
            }}
          />
        </Layer>
      </Stage>

      <div
        className="compass"
        style={{
          display: 'none',
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
