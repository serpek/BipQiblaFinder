import { useEffect, useRef, useState } from 'react'

export const useShortestRotation = (targetAngle: number) => {
  const [currentAngle, setCurrentAngle] = useState<number>(targetAngle)
  const targetRef = useRef(targetAngle)
  const animationRef = useRef<number | null>(null) // Fix here

  useEffect(() => {
    targetRef.current = targetAngle

    const updateAngle = () => {
      setCurrentAngle((prev) => {
        // Kısa yolu hesapla (360° wrap için)
        let delta = targetRef.current - prev
        if (delta > 180) delta -= 360
        if (delta < -180) delta += 360

        // Yumuşak geçiş (linear interpolation)
        const newAngle = prev + delta * 0.1 // 0.1 sensitivity factor

        // 0-360 aralığına normalize et
        return (newAngle + 360) % 360
      })

      animationRef.current = requestAnimationFrame(updateAngle)
    }

    animationRef.current = requestAnimationFrame(updateAngle)
    return () => cancelAnimationFrame(animationRef.current!)
  }, [targetAngle])

  return currentAngle
}
