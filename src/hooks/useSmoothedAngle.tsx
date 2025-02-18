import { useEffect, useState } from 'react'

export const useSmoothedAngle = (
  rawAngle: number,
  smoothFactor: number = 0.9
) => {
  const [smoothedAngle, setSmoothedAngle] = useState(rawAngle)

  useEffect(() => {
    setSmoothedAngle(
      (prevAngle) => smoothFactor * prevAngle + (1 - smoothFactor) * rawAngle
    )
  }, [rawAngle, smoothFactor])

  return smoothedAngle
}
