import { levels, shapeStyle } from '../game/levels.js'
import { getProgress } from '../game/progress.js'

export function renderMenu(app, c) {
  app.innerHTML = `
    <div class="screen menu-screen">
      <img class="mascot" src="art/mascot.png" alt="Friendly owl guide" draggable="false" />
      <h1>Aurora</h1>
      <p class="subtitle">Animal Homes &amp; Shapes</p>
      <div class="menu-buttons">
        <button class="big-btn" data-world="shapes">🔷 Shape World</button>
        <button class="big-btn alt" data-world="animals">🐾 Animal Homes</button>
      </div>
    </div>`
  app.querySelectorAll('[data-world]').forEach((b) =>
    b.addEventListener('click', () => c.openWorld(b.dataset.world)))
}

export function renderWorld(app, worldId, c) {
  const list = levels[worldId]
  const progress = getProgress()
  app.innerHTML = `
    <div class="screen world-screen">
      <button class="back-btn" id="back">← Back</button>
      <h2>${worldId === 'shapes' ? 'Shape World' : 'Animal Homes'}</h2>
      <div class="level-grid">
        ${list.map((lv, i) => `
          <button class="level-card" data-index="${i}">
            <span class="level-num">${i + 1}</span>
            <span class="level-name">${lv.name || lv.title}</span>
            <span class="level-stars">${'⭐'.repeat(progress[lv.id] || 0)}</span>
          </button>`).join('')}
      </div>
    </div>`
  app.querySelector('#back').addEventListener('click', () => c.showMenu())
  app.querySelectorAll('.level-card').forEach((b) =>
    b.addEventListener('click', () => c.startLevel(worldId, +b.dataset.index)))
}

export function renderGame(app, level, c) {
  app.innerHTML = `
    <div class="screen game-screen">
      <header class="game-header">
        <button class="back-btn" id="back">←</button>
        <h2>${level.title}</h2>
        <span class="hint">${level.instruction}</span>
      </header>
      <div id="play-area" class="play-area">
        <div id="targets" class="targets">
          ${level.targets.map((t) => `
            <div class="target" data-key="${t.key}" role="button" tabindex="0" aria-label="${t.label}">
              ${t.image
                ? `<img src="${t.image}" alt="${t.label}" draggable="false" />`
                : `<div class="shape-hole shape" style="${shapeStyle(t.shape, t.color)}"></div>`}
              <span class="target-label">${t.label}</span>
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
  app.querySelector('#back').addEventListener('click', () => c.openWorld(level.world))
}

export function renderComplete(app, level, c) {
  app.innerHTML = `
    <div class="screen complete-screen">
      <img class="mascot" src="art/mascot.png" alt="" draggable="false" />
      <h2>Great job! 🎉</h2>
      <div class="stars">⭐ ⭐ ⭐</div>
      <button class="big-btn" id="again">Play again</button>
      <button class="big-btn ghost" id="next">Next level →</button>
      <button class="big-btn ghost" id="menu">Menu</button>
    </div>`
  app.querySelector('#again').addEventListener('click', () => c.startLevel(level.world, c.currentIndex()))
  app.querySelector('#next').addEventListener('click', () => c.nextLevel(level))
  app.querySelector('#menu').addEventListener('click', () => c.showMenu())
}
