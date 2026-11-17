const KEY = 'aurora-progress-v1'
const LEGACY_KEY = 'animal-shapes-progress-v1'

export function getProgress() {
  try {
    const data = localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY)
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

export function setLevelStars(levelId, stars) {
  const p = getProgress()
  p[levelId] = Math.max(p[levelId] || 0, stars)
  localStorage.setItem(KEY, JSON.stringify(p))
}

export function resetProgress() {
  localStorage.removeItem(KEY)
  localStorage.removeItem(LEGACY_KEY)
}
