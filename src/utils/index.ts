export * from './console'
export * from './qibla'

type Direction = { name: string; short: string }

export const directions = [
  { name: 'Kuzey', short: 'N', angle: 0 },
  { name: 'Kuzeydoğu', short: 'NE', angle: 45 },
  { name: 'Doğu', short: 'E', angle: 90 },
  { name: 'Güneydoğu', short: 'SE', angle: 135 },
  { name: 'Güney', short: 'S', angle: 180 },
  { name: 'Güneybatı', short: 'SW', angle: 225 },
  { name: 'Batı', short: 'W', angle: 270 },
  { name: 'Kuzeybatı', short: 'NW', angle: 315 }
]

export const getDirectionName = (angle: number): Direction => {
  const index = Math.round(angle / 45) % 8
  return directions[index]
}

export function toFixed(value: number, radix: number = 0): number {
  return Number.parseFloat(value.toFixed(radix))
}

export function isUndefinedOrEmpty(
  value: string | null | undefined
): value is undefined | null | '' {
  return value === undefined || value === null || value === ''
}
