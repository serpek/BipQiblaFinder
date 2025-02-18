import { useEffect, useState } from 'react'

/**
 * Gürültü filtreleme: Küçük değişiklikleri yok sayarak açıyı stabilize eder.
 * @param rawAngle - Anlık sensör verisi (alpha veya trueNorth)
 * @param threshold - Küçük değişikliklerin yok sayılacağı eşik değeri (önerilen: 2°-5°)
 * @returns Filtrelenmiş açı değeri
 */
export const useFilteredAngle = (rawAngle: number, threshold: number = 2) => {
  const [filteredAngle, setFilteredAngle] = useState(rawAngle)

  useEffect(() => {
    if (Math.abs(rawAngle - filteredAngle) > threshold) {
      setFilteredAngle(rawAngle)
    }
  }, [filteredAngle, rawAngle, threshold])

  return filteredAngle
}
