export function getPupilOffset(x: number, y: number) {
  const distance = Math.hypot(x, y)
  const scale = 12 / Math.max(60, distance)
  return { x: x * scale, y: y * scale }
}
