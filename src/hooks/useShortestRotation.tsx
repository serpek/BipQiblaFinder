import { useEffect, useState } from 'react'

export const useShortestRotation = (targetAngle: number) => {
  const [currentAngle, setCurrentAngle] = useState<number>(targetAngle)

  useEffect(() => {
    let delta = targetAngle - currentAngle
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    setCurrentAngle(currentAngle + delta)
  }, [currentAngle, targetAngle])

  return currentAngle
}
