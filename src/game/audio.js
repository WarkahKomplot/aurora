let ctx = null
const MUTE_KEY = 'aurora-sound-muted'
let muted = localStorage.getItem(MUTE_KEY) === 'true'

export function isMuted() {
  return muted
}

export function setMuted(val) {
  muted = Boolean(val)
  localStorage.setItem(MUTE_KEY, muted ? 'true' : 'false')
  window.dispatchEvent(new CustomEvent('aurora-mute-change', { detail: { muted } }))
  return muted
}

export function toggleMute() {
  return setMuted(!muted)
}

export function unlockAudio() {
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC || ctx) return
  ctx = new AC()
  // Silent oscillator unlocks audio on iOS Safari (requires user gesture).
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  gain.gain.value = 0
  osc.connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.01)
  if (ctx.state === 'suspended') ctx.resume()
}

function tone(freq, duration, type = 'sine', volume = 0.2, delay = 0) {
  if (muted || !ctx) return
  const t = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.linearRampToValueAtTime(volume, t + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

export const sound = {
  pickup: () => tone(520, 0.12, 'sine', 0.12),
  correct: () => { tone(660, 0.15); tone(880, 0.18, 'sine', 0.18, 0.09) },
  wrong: () => tone(200, 0.14, 'sine', 0.06),
  win: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.28, 'sine', 0.18, i * 0.13))
}
