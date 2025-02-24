import { PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { Group, Image, Layer, Stage } from 'react-konva'
import useImage from 'use-image'
import { useWindowSize } from 'react-use'
import { getDirectionName } from '../../utils'

import compassImg from '../../assets/compass.png'
import qibleArrowImg from '../../assets/arrow.png'
import kabeImg from '../../assets/kabe.png'
import arrowInImg from '../../assets/arrow-in.png'

import './compass.scss'

type CompassViewProps = PropsWithChildren<{
  alpha: number
  qible: number
}>

export const Compass = ({ alpha = 0, qible }: CompassViewProps) => {
  const [compassImage] = useImage(compassImg)
  const [qibleArrowImage] = useImage(qibleArrowImg)
  const [kabeImage] = useImage(kabeImg)
  const [arrowInImage] = useImage(arrowInImg)

  const [, setDeviceDirection] = useState<string>('')
  const [, setQiblaDirection] = useState<string>('')
  const [deviceAngle, setDeviceAngle] = useState<number>(0)

  const size = useWindowSize()

  useEffect(() => {
    if (alpha) {
      const angle = (360 - alpha) % 360
      setDeviceAngle(angle)
    }
  }, [alpha, deviceAngle])

  const anglePoint = useMemo(() => {
    let diff = Math.abs(((360 - deviceAngle) % 360) - qible)
    diff = Math.min(diff, 360 - diff)
    return diff <= 10
  }, [deviceAngle, qible])

  useEffect(() => {
    const qiblaDirection = getDirectionName(qible)
    setQiblaDirection(qiblaDirection.name)

    const deviceDirection = getDirectionName(deviceAngle)
    setDeviceDirection(deviceDirection.name)
  }, [deviceAngle, qible])

  const scale = 1.1
  const defaultWidth = useMemo(() => size.width, [size.width])
  const screenWidth = useMemo(() => size.width / scale, [size.width])
  const screenCenter = useMemo(
    () => (defaultWidth - screenWidth) / 2 + defaultWidth / 2,
    [defaultWidth, screenWidth]
  )
  const screenScale = useMemo(
    () => screenWidth / size.width,
    [screenWidth, size.width]
  )

  return (
    <>
      <Stage
        width={defaultWidth}
        height={defaultWidth}
        scale={{
          x: screenScale,
          y: screenScale
        }}>
        <Layer>
          <Group
            width={defaultWidth}
            height={defaultWidth}
            x={screenCenter}
            y={screenCenter}
            offsetX={defaultWidth / 2}
            offsetY={defaultWidth / 2}
            rotation={deviceAngle}
            duration={0.5}>
            <Image
              width={defaultWidth}
              height={defaultWidth}
              image={compassImage}
            />
            <Image
              x={defaultWidth / 2}
              y={defaultWidth / 2}
              offsetX={34}
              offsetY={125}
              width={68}
              height={91}
              image={qibleArrowImage}
              duration={0.5}
              rotation={qible}
            />
            <Image
              x={defaultWidth / 2}
              y={defaultWidth / 2}
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
            x={screenCenter}
            y={screenCenter}
            offsetX={24}
            offsetY={112}
            width={48}
            height={64}
            image={arrowInImage}
            opacity={anglePoint ? 1 : 0.5}
          />
        </Layer>
      </Stage>
    </>
  )
}
