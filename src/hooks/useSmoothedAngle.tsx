import { useEffect, useState } from 'react'

/**
 * Ağırlıklı Ortalama (Weighted Moving Average) kullanarak açıyı stabilize eder.
 * @param rawAngle - Anlık sensör verisi (alpha veya trueNorth)
 * @param smoothFactor - Ağırlık katsayısı (0.8 - 0.98 önerilir)
 * @returns Smoothed (yumuşatılmış) açı değeri
 */
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
