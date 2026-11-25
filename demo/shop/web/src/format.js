export function formatCount(n) {
  return n > 99 ? '99+' : String(n)
}
export const plural = (n, word) => n === 1 ? word : word + 's'
