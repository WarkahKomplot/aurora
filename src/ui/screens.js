import { levels, shapeStyle } from '../game/levels.js'
import { getProgress } from '../game/progress.js'
import { isMuted, toggleMute } from '../game/audio.js'

function soundButtonHtml() {
  const muted = isMuted()
  return `<button class="icon-btn sound-toggle-btn" aria-label="${muted ? 'Unmute sound' : 'Mute sound'}" title="${muted ? 'Unmute' : 'Mute'}">${muted ? '🔇' : '🔊'}</button>`
}

function bindSoundButton(container) {
  const btn = container.querySelector('.sound-toggle-btn')
  if (!btn) return
  btn.addEventListener('click', () => {
    const muted = toggleMute()
    btn.textContent = muted ? '🔇' : '🔊'
    btn.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound')
  })
}

function triggerConfetti(container) {
  const confettiWrap = document.createElement('div')
  confettiWrap.className = 'confetti-wrap'
  const colors = ['#ff5252', '#ffd740', '#69f0ae', '#40c4ff', '#e040fb', '#ff9800', '#76ff03']
  const count = 36

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    el.className = 'confetti-item'
    const color = colors[i % colors.length]
    const size = 8 + Math.random() * 8
    const left = Math.random() * 100
    const delay = Math.random() * 0.4
    const duration = 1.4 + Math.random() * 0.8
    const shape = Math.random() > 0.5 ? '50%' : '2px'

    el.style.cssText = `
      position: absolute;
      top: -12px;
      left: ${left}%;
      width: ${size}px;
      height: ${size * (Math.random() > 0.5 ? 1 : 1.8)}px;
      background: ${color};
      border-radius: ${shape};
      opacity: 0.9;
      pointer-events: none;
      z-index: 9999;
      animation: confettiFall ${duration}s cubic-bezier(.25,.46,.45,.94) ${delay}s forwards;
    `
    confettiWrap.appendChild(el)
  }
  container.appendChild(confettiWrap)
  setTimeout(() => confettiWrap.remove(), 2600)
}

export function renderMenu(app, c) {
  const progress = getProgress()
  const allLevels = [...levels.shapes, ...levels.animals]
  const totalStars = allLevels.reduce((sum, lv) => sum + (progress[lv.id] || 0), 0)
  const maxStars = allLevels.length * 3

  app.innerHTML = `
    <div class="screen menu-screen">
      <div class="top-nav">
        <span class="nav-brand">🌟 Aurora</span>
        ${soundButtonHtml()}
      </div>
      
      <div class="mascot-wrapper">
        <img class="mascot mascot-anim" src="art/mascot.png" alt="Friendly owl guide" draggable="false" />
        <div class="mascot-shadow"></div>
      </div>
      
      <h1 class="game-title">Aurora</h1>
      <p class="subtitle">Fun shapes &amp; animal homes for curious toddlers</p>

      ${totalStars > 0 ? `
        <div class="star-pill">
          <span class="star-icon">⭐</span>
          <span>${totalStars} / ${maxStars} stars earned</span>
        </div>` : ''}

      <div class="menu-buttons">
        <button class="big-btn world-card-btn shapes-btn" data-world="shapes">
          <div class="btn-icon">🔷</div>
          <div class="btn-text">
            <span class="btn-title">Shape World</span>
            <span class="btn-sub">30 Colorful Matching Levels</span>
          </div>
          <span class="btn-arrow">→</span>
        </button>
        
        <button class="big-btn world-card-btn animals-btn" data-world="animals">
          <div class="btn-icon">🐾</div>
          <div class="btn-text">
            <span class="btn-title">Animal Homes</span>
            <span class="btn-sub">30 Happy Habitats &amp; Friends</span>
          </div>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>`

  bindSoundButton(app)
  app.querySelectorAll('[data-world]').forEach((b) =>
    b.addEventListener('click', () => c.openWorld(b.dataset.world)))
}

export function renderWorld(app, worldId, c) {
  const list = levels[worldId]
  const progress = getProgress()
  const completedCount = list.filter((lv) => progress[lv.id]).length
  const totalStars = list.reduce((sum, lv) => sum + (progress[lv.id] || 0), 0)
  const worldTitle = worldId === 'shapes' ? '🔷 Shape World' : '🐾 Animal Homes'

  // Find the first unplayed level
  const firstUnplayed = list.findIndex((lv) => !progress[lv.id])

  app.innerHTML = `
    <div class="screen world-screen">
      <div class="top-nav">
        <button class="icon-btn back-btn" id="back" aria-label="Back to Main Menu">← Menu</button>
        <span class="world-nav-title">${worldTitle}</span>
        ${soundButtonHtml()}
      </div>

      <div class="progress-pill">
        <span>🏆 <strong>${completedCount} / ${list.length}</strong> Completed</span>
        <span class="progress-divider">•</span>
        <span>⭐ <strong>${totalStars}</strong> Stars</span>
      </div>

      <div class="level-grid">
        ${list.map((lv, i) => {
          const stars = progress[lv.id] || 0
          const isCurrent = i === (firstUnplayed === -1 ? 0 : firstUnplayed)
          return `
            <button class="level-card ${stars > 0 ? 'completed' : ''} ${isCurrent ? 'is-current' : ''}" data-index="${i}">
              <span class="level-num">${i + 1}</span>
              <span class="level-name">${lv.name || lv.title}</span>
              <span class="level-stars">${stars > 0 ? '⭐'.repeat(stars) : '<span class="star-empty">···</span>'}</span>
            </button>`
        }).join('')}
      </div>
    </div>`

  bindSoundButton(app)
  app.querySelector('#back').addEventListener('click', () => c.showMenu())
  app.querySelectorAll('.level-card').forEach((b) =>
    b.addEventListener('click', () => c.startLevel(worldId, +b.dataset.index)))
}

export function renderGame(app, level, c) {
  const currentIdx = c.currentIndex()
  const totalLevels = levels[level.world].length

  app.innerHTML = `
    <div class="screen game-screen">
      <header class="game-header">
        <button class="icon-btn back-btn" id="back" aria-label="Back to Levels">←</button>
        <div class="header-center">
          <span class="level-badge">${level.world === 'shapes' ? '🔷 Shape' : '🐾 Animal'} ${currentIdx + 1} / ${totalLevels}</span>
          <h2 class="level-title">${level.title}</h2>
        </div>
        ${soundButtonHtml()}
      </header>

      <div class="instruction-bubble">
        <span class="hint">${level.instruction}</span>
      </div>

      <div id="play-area" class="play-area">
        <div id="targets" class="targets">
          ${level.targets.map((t) => `
            <div class="target" data-key="${t.key}" role="button" tabindex="0" aria-label="${t.label}">
              <div class="target-inner">
                ${t.image
                  ? `<img src="${t.image}" alt="${t.label}" draggable="false" />`
                  : `<div class="shape-hole shape" style="${shapeStyle(t.shape, t.color)}"></div>`}
                <span class="target-label">${t.label}</span>
              </div>
            </div>`).join('')}
        </div>
        <div id="pieces" class="pieces">
          ${level.pieces.map((p) => `
            <div class="piece" data-key="${p.key}" role="button" tabindex="0" aria-label="${p.label}">
              ${p.image
                ? `<img src="${p.image}" alt="${p.label}" draggable="false" />`
                : `<div class="shape" style="${shapeStyle(p.shape, p.color)}"></div>`}
            </div>`).join('')}
        </div>
      </div>
      <div id="celebration" class="celebration hidden"></div>
    </div>`

  bindSoundButton(app)
  app.querySelector('#back').addEventListener('click', () => c.openWorld(level.world))
}

export function renderComplete(app, level, c) {
  const currentIdx = c.currentIndex()
  const totalLevels = levels[level.world].length
  const hasNext = currentIdx + 1 < totalLevels

  app.innerHTML = `
    <div class="screen complete-screen">
      <div class="mascot-wrapper victory-mascot">
        <img class="mascot victory-anim" src="art/mascot.png" alt="Owl celebrating" draggable="false" />
      </div>
      
      <h2 class="victory-title">Great Job! 🎉</h2>
      <p class="victory-sub">You solved the puzzle!</p>

      <div class="stars-celebration">
        <span class="star-pop" style="animation-delay: 0.1s">⭐</span>
        <span class="star-pop" style="animation-delay: 0.28s">⭐</span>
        <span class="star-pop" style="animation-delay: 0.46s">⭐</span>
      </div>

      <div class="complete-actions">
        ${hasNext ? `
          <button class="big-btn next-btn" id="next">Next Level →</button>
        ` : ''}
        <button class="big-btn again-btn" id="again">Play Again ↺</button>
        <button class="big-btn menu-btn" id="menu">All Levels ☰</button>
      </div>
    </div>`

  triggerConfetti(app)

  if (hasNext) {
    app.querySelector('#next').addEventListener('click', () => c.nextLevel(level))
  }
  app.querySelector('#again').addEventListener('click', () => c.startLevel(level.world, c.currentIndex()))
  app.querySelector('#menu').addEventListener('click', () => c.openWorld(level.world))
}
