import { sound } from './audio.js'

const PIECE = 88
const GAP = 14
const MAGNET = 28 // forgiving hit area for little fingers

export function layoutAndBind({ playArea, pieces, onComplete }) {
  let placed = 0
  let active = null
  const total = pieces.length

  // Lay pieces out in a centered grid at the bottom of the play area.
  const pr = playArea.getBoundingClientRect()
  const cols = Math.max(1, Math.floor((pr.width - 16) / (PIECE + GAP)))
  const rows = Math.ceil(total / cols)
  const startY = Math.max(8, pr.height - rows * (PIECE + GAP) - 8)
  const rowWidth = cols * (PIECE + GAP) - GAP

  pieces.forEach((el, i) => {
    const c = i % cols
    const r = Math.floor(i / cols)
    const x = (pr.width - rowWidth) / 2 + c * (PIECE + GAP)
    const y = startY + r * (PIECE + GAP)
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    el.dataset.x = x
    el.dataset.y = y
    el.dataset.placed = 'false'
    el.addEventListener('pointerdown', onDown)
  })

  function targetAt(cx, cy) {
    const p = playArea.getBoundingClientRect()
    return [...playArea.querySelectorAll('.target')].find((t) => {
      const r = t.getBoundingClientRect()
      const bx = r.left - p.left
      const by = r.top - p.top
      return cx > bx - MAGNET && cx < bx + r.width + MAGNET &&
             cy > by - MAGNET && cy < by + r.height + MAGNET
    })
  }

  function clearHighlights() {
    playArea.querySelectorAll('.target.over').forEach((t) => t.classList.remove('over'))
  }

  function onDown(e) {
    const el = e.currentTarget
    if (el.dataset.placed === 'true' || active) return
    const rect = el.getBoundingClientRect()
    const p = playArea.getBoundingClientRect()
    active = {
      el,
      id: e.pointerId,
      offX: e.clientX - rect.left,
      offY: e.clientY - rect.top,
      x: rect.left - p.left,
      y: rect.top - p.top,
      homeX: +el.dataset.x,
      homeY: +el.dataset.y
    }
    el.setPointerCapture(e.pointerId)
    el.classList.add('dragging')
    el.style.zIndex = '1000'
    el.style.transition = 'none'
    sound.pickup()
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerup', onUp)
    el.addEventListener('pointercancel', onUp)
    e.preventDefault()
  }

  function onMove(e) {
    if (!active || e.pointerId !== active.id) return
    const p = playArea.getBoundingClientRect()
    let x = e.clientX - p.left - active.offX
    let y = e.clientY - p.top - active.offY
    x = Math.max(2, Math.min(x, p.width - active.el.offsetWidth - 2))
    y = Math.max(2, Math.min(y, p.height - active.el.offsetHeight - 2))
    active.x = x
    active.y = y
    active.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.12)`
    clearHighlights()
    const hit = targetAt(x + active.el.offsetWidth / 2, y + active.el.offsetHeight / 2)
    if (hit) hit.classList.add('over')
  }

  function onUp(e) {
    if (!active || e.pointerId !== active.id) return
    const el = active.el
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerup', onUp)
    el.removeEventListener('pointercancel', onUp)
    if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId)
    el.classList.remove('dragging')
    el.style.zIndex = ''
    clearHighlights()

    const hit = targetAt(active.x + el.offsetWidth / 2, active.y + el.offsetHeight / 2)
    if (hit && hit.dataset.key === el.dataset.key) {
      place(el, hit)
    } else {
      el.style.transition = 'transform 360ms cubic-bezier(.34,1.56,.64,1)'
      el.style.transform = `translate3d(${active.homeX}px, ${active.homeY}px, 0)`
      sound.wrong()
      setTimeout(() => { el.style.transition = '' }, 380)
    }
    active = null
  }

  function place(el, target) {
    const p = playArea.getBoundingClientRect()
    const r = target.getBoundingClientRect()
    const x = r.left - p.left + (r.width - el.offsetWidth) / 2
    const y = r.top - p.top + (r.height - el.offsetHeight) / 2
    el.style.transition = 'transform 260ms cubic-bezier(.2,.9,.3,1.2), opacity 200ms'
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(.55)`
    el.style.opacity = '0'
    el.dataset.placed = 'true'
    sound.correct()
    target.classList.add('filled', 'pop-snap')

    // Transfer the piece's color/appearance to the target hole
    const pieceShape = el.querySelector('.shape')
    const targetHole = target.querySelector('.shape-hole')
    if (pieceShape && targetHole) {
      const pieceColor = pieceShape.style.getPropertyValue('--c')
      if (pieceColor) {
        targetHole.style.setProperty('--c', pieceColor)
      }
    }

    // For animal homes: show the matched animal nestled in its home
    const pieceImg = el.querySelector('img')
    const targetInner = target.querySelector('.target-inner')
    if (pieceImg && targetInner && !target.querySelector('.animal-badge')) {
      const badge = document.createElement('img')
      badge.className = 'animal-badge'
      badge.src = pieceImg.src
      badge.alt = pieceImg.alt
      badge.draggable = false
      targetInner.appendChild(badge)
    }
    setTimeout(() => {
      el.style.display = 'none'
      burst(r.left + r.width / 2 - p.left, r.top + r.height / 2 - p.top)
      placed += 1
      if (placed === total) onComplete()
    }, 280)
  }

  function burst(x, y) {
    const colors = ['#ff5252', '#ffd740', '#69f0ae', '#40c4ff', '#e040fb', '#ff9100']
    for (let i = 0; i < 18; i++) {
      const s = document.createElement('div')
      s.className = 'spark'
      s.style.background = colors[i % colors.length]
      s.style.borderRadius = Math.random() > 0.4 ? '50%' : '3px'
      s.style.left = `${x}px`
      s.style.top = `${y}px`
      playArea.appendChild(s)
      const angle = (Math.PI * 2 * i) / 18 + (Math.random() - 0.5) * 0.3
      const dist = 50 + Math.random() * 85
      const rot = (Math.random() - 0.5) * 360
      const anim = s.animate([
        { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
        { transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0) rotate(${rot}deg)`, opacity: 0 }
      ], { duration: 650, easing: 'cubic-bezier(.2,.7,.3,1)' })
      anim.onfinish = () => s.remove()
    }
  }
}
