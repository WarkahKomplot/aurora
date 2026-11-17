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

function triggerConfetti(container, isGrand = false) {
  const confettiWrap = document.createElement('div')
  confettiWrap.className = 'confetti-wrap'
  const colors = ['#ff5252', '#ffd740', '#69f0ae', '#40c4ff', '#e040fb', '#ff9800', '#76ff03', '#ff4081']
  const count = isGrand ? 65 : 36

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div')
    el.className = 'confetti-item'
    const color = colors[i % colors.length]
    const size = 8 + Math.random() * (isGrand ? 12 : 8)
    const left = Math.random() * 100
    const delay = Math.random() * 0.5
    const duration = (isGrand ? 2.0 : 1.4) + Math.random() * 1.0
    const shape = Math.random() > 0.4 ? '50%' : '2px'

    el.style.cssText = `
      position: absolute;
      top: -16px;
      left: ${left}%;
      width: ${size}px;
      height: ${size * (Math.random() > 0.5 ? 1 : 1.8)}px;
      background: ${color};
      border-radius: ${shape};
      opacity: 0.95;
      pointer-events: none;
      z-index: 9999;
      animation: confettiFall ${duration}s cubic-bezier(.25,.46,.45,.94) ${delay}s forwards;
    `
    confettiWrap.appendChild(el)
  }
  container.appendChild(confettiWrap)
  setTimeout(() => confettiWrap.remove(), isGrand ? 3800 : 2600)
}

export function renderMenu(app, c) {
  const progress = getProgress()
  const allLevels = [...levels.shapes, ...levels.animals]
  const totalStars = allLevels.reduce((sum, lv) => sum + (progress[lv.id] || 0), 0)
  const maxStars = allLevels.length * 3

  const shapesComplete = levels.shapes.every((lv) => (progress[lv.id] || 0) > 0)
  const animalsComplete = levels.animals.every((lv) => (progress[lv.id] || 0) > 0)
  const isGrandMaster = shapesComplete && animalsComplete

  app.innerHTML = `
    <div class="screen menu-screen">
      <div class="top-nav">
        <span class="nav-brand">🌟 Aurora</span>
        ${soundButtonHtml()}
      </div>
      
      <div class="mascot-wrapper">
        ${isGrandMaster ? '<span class="royal-crown">👑</span>' : ''}
        <img class="mascot mascot-anim" src="art/mascot.png" alt="Friendly owl guide" draggable="false" />
        <div class="mascot-shadow"></div>
      </div>
      
      <h1 class="game-title">Aurora</h1>
      <p class="subtitle">Fun shapes &amp; animal homes for curious toddlers</p>

      ${isGrandMaster ? `
        <div class="grand-master-banner">
          👑 <strong>Aurora Master Champion!</strong> All 60 Levels Cleared 🏆
        </div>
      ` : totalStars > 0 ? `
        <div class="star-pill">
          <span class="star-icon">⭐</span>
          <span>${totalStars} / ${maxStars} stars earned</span>
        </div>` : ''}

      <div class="menu-buttons">
        <button class="big-btn world-card-btn shapes-btn" data-world="shapes">
          <div class="btn-icon">🔷</div>
          <div class="btn-text">
            <div class="btn-title-row">
              <span class="btn-title">Shape World</span>
              ${shapesComplete ? '<span class="badge-cleared">🏆 Cleared!</span>' : ''}
            </div>
            <span class="btn-sub">30 Colorful Matching Levels</span>
          </div>
          <span class="btn-arrow">→</span>
        </button>
        
        <button class="big-btn world-card-btn animals-btn" data-world="animals">
          <div class="btn-icon">🐾</div>
          <div class="btn-text">
            <div class="btn-title-row">
              <span class="btn-title">Animal Homes</span>
              ${animalsComplete ? '<span class="badge-cleared">🏆 Cleared!</span>' : ''}
            </div>
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
  const isWorldCompleted = completedCount === list.length

  // Find the first unplayed level
  const firstUnplayed = list.findIndex((lv) => !progress[lv.id])

  app.innerHTML = `
    <div class="screen world-screen">
      <div class="top-nav">
        <button class="icon-btn back-btn" id="back" aria-label="Back to Main Menu">← Menu</button>
        <span class="world-nav-title">${worldTitle}</span>
        ${soundButtonHtml()}
      </div>

      <div class="progress-pill ${isWorldCompleted ? 'all-done' : ''}">
        <span>${isWorldCompleted ? '👑' : '🏆'} <strong>${completedCount} / ${list.length}</strong> Completed</span>
        <span class="progress-divider">•</span>
        <span>⭐ <strong>${totalStars}</strong> Stars</span>
        ${isWorldCompleted ? '<span class="world-master-tag">Mastered!</span>' : ''}
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

  const progress = getProgress()
  const shapesComplete = levels.shapes.every((lv) => (progress[lv.id] || 0) > 0)
  const animalsComplete = levels.animals.every((lv) => (progress[lv.id] || 0) > 0)
  const isGrandComplete = shapesComplete && animalsComplete
  const isFinalLevelOfWorld = currentIdx + 1 >= totalLevels

  // Case 1: Grand Finale — All 60 levels of the game finished!
  if (isFinalLevelOfWorld && isGrandComplete) {
    app.innerHTML = `
      <div class="screen complete-screen champion-screen grand-champion-screen">
        <div class="mascot-wrapper victory-mascot">
          <span class="royal-crown grand-crown-anim">👑</span>
          <img class="mascot victory-anim" src="art/mascot.png" alt="Owl wearing crown" draggable="false" />
        </div>
        
        <div class="champion-ribbon grand-ribbon">🏆 GRAND AURORA CHAMPION! 🏆</div>
        <h2 class="victory-title grand-title">You Did It All! 🎉</h2>
        <p class="victory-sub">Every shape matched &amp; every animal safely home!</p>

        <div class="stars-celebration">
          <span class="star-pop" style="animation-delay: 0.1s">⭐</span>
          <span class="star-pop" style="animation-delay: 0.25s">👑</span>
          <span class="star-pop" style="animation-delay: 0.4s">⭐</span>
        </div>

        <div class="stars-summary-pill">
          <span>🌟 60 / 60 Levels Cleared · ⭐ 180 Stars!</span>
        </div>

        <div class="complete-actions">
          <button class="big-btn next-btn" id="menu">Main Menu 🏠</button>
          <button class="big-btn again-btn" id="again">Play World Again ↺</button>
        </div>
      </div>`

    triggerConfetti(app, true)
    app.querySelector('#menu').addEventListener('click', () => c.showMenu())
    app.querySelector('#again').addEventListener('click', () => c.openWorld(level.world))
    return
  }

  // Case 2: World Champion — Finished all 30 levels of this world!
  if (isFinalLevelOfWorld) {
    const otherWorld = level.world === 'shapes' ? 'animals' : 'shapes'
    const otherWorldTitle = otherWorld === 'shapes' ? '🔷 Shape World' : '🐾 Animal Homes'
    const otherWorldCleared = otherWorld === 'shapes' ? shapesComplete : animalsComplete

    app.innerHTML = `
      <div class="screen complete-screen champion-screen">
        <div class="mascot-wrapper victory-mascot">
          <span class="royal-crown">👑</span>
          <img class="mascot victory-anim" src="art/mascot.png" alt="Owl celebrating with crown" draggable="false" />
        </div>
        
        <div class="champion-ribbon">🏆 WORLD COMPLETE! 🏆</div>
        <h2 class="victory-title">${level.world === 'shapes' ? '🔷 Shape World Champion!' : '🐾 Animal Homes Master!'}</h2>
        <p class="victory-sub">All 30 levels completed with flying colors!</p>

        <div class="stars-celebration">
          <span class="star-pop" style="animation-delay: 0.1s">⭐</span>
          <span class="star-pop" style="animation-delay: 0.25s">🏆</span>
          <span class="star-pop" style="animation-delay: 0.4s">⭐</span>
        </div>

        <div class="complete-actions">
          ${!otherWorldCleared ? `
            <button class="big-btn next-btn" id="other-world">Play ${otherWorldTitle} →</button>
          ` : ''}
          <button class="big-btn menu-btn" id="menu">Main Menu 🏠</button>
          <button class="big-btn again-btn" id="again">Play Level 30 Again ↺</button>
        </div>
      </div>`

    triggerConfetti(app, true)
    if (!otherWorldCleared) {
      app.querySelector('#other-world').addEventListener('click', () => c.openWorld(otherWorld))
    }
    app.querySelector('#menu').addEventListener('click', () => c.showMenu())
    app.querySelector('#again').addEventListener('click', () => c.startLevel(level.world, currentIdx))
    return
  }

  // Case 3: Regular Level Complete
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

  triggerConfetti(app, false)

  if (hasNext) {
    app.querySelector('#next').addEventListener('click', () => c.nextLevel(level))
  }
  app.querySelector('#again').addEventListener('click', () => c.startLevel(level.world, c.currentIndex()))
  app.querySelector('#menu').addEventListener('click', () => c.openWorld(level.world))
}
