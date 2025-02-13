import useImage from 'use-image'
import { PropsWithChildren, useMemo } from 'react'
import { Circle, Group, Image, Layer, Stage } from 'react-konva'

type CompassWithCanvasProps = PropsWithChildren<{
  rotate: number
  qible: number
  width: number
  height: number
}>

export const CompassWithCanvas = ({
  rotate,
  width,
  height
}: CompassWithCanvasProps) => {
  const [CompassImage] = useImage('/assets/compass-4.png')
  const [KabaaImage] = useImage('/assets/kaaba.png')

  const offsetWidth = useMemo(() => width / 2, [])
  const offsetHeight = useMemo(() => width / 2, [])
  const radius = useMemo(() => Math.min(width, height) / 2 - 20, [])

  return (
    <Stage width={width} height={height}>
      <Layer>
        <Circle
          x={offsetWidth}
          y={offsetHeight}
          width={width}
          height={height}
          fill="red"
          rotation={rotate}
        />
        <Group
          clipFunc={(ctx) => {
            ctx.arc(
              offsetWidth,
              offsetHeight,
              Math.min(width, height) / 2,
              0,
              Math.PI * 2
            )
          }}>
          <Image
            x={offsetWidth}
            y={offsetHeight}
            offsetX={offsetWidth}
            offsetY={offsetHeight}
            width={width}
            height={height}
            image={CompassImage}
            rotation={rotate}
          />
        </Group>
        <Image
          x={offsetWidth + radius * Math.cos((Math.PI / 180) * (rotate || 0))}
          y={offsetHeight + radius * Math.sin((Math.PI / 180) * (rotate || 0))}
          offsetX={offsetWidth - offsetWidth / 2}
          offsetY={offsetHeight}
          width={40}
          height={40}
          image={KabaaImage}
          rotation={rotate}
        />
      </Layer>
    </Stage>
  )
}
