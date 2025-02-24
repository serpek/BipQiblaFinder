import { useEffect, useRef, useState } from 'react'

export const useShortestRotation = (targetAngle: number) => {
  const [cumulativeAngle, setCumulativeAngle] = useState<number>(targetAngle)
  const prevTargetRef = useRef<number>(targetAngle)
  const targetCumulativeRef = useRef<number>(targetAngle)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const prevTarget = prevTargetRef.current

    // Sensör açısındaki gerçek delta'yı hesapla (360° wrap dikkate alınarak)
    const rawDelta = targetAngle - prevTarget
    let adjustedDelta = rawDelta

    // Kısa yolu seçmek yerine ham delta'yı koru
    if (Math.abs(rawDelta) > 180) {
      adjustedDelta = rawDelta - Math.sign(rawDelta) * 360
    }

    // Kümülatif açıyı güncelle
    targetCumulativeRef.current += adjustedDelta
    prevTargetRef.current = targetAngle

    // Animasyon loop'u
    const animate = () => {
      setCumulativeAngle((prev) => {
        const delta = targetCumulativeRef.current - prev
        return prev + delta * 0.1 // Yumuşatma faktörü
      })
      animationRef.current = requestAnimationFrame(animate)
    }

    if (!animationRef.current) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [targetAngle])

  // CSS için 0-360 aralığına normalize et
  return ((cumulativeAngle % 360) + 360) % 360
}
