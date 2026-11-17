import './styles.css'
import { levels } from './game/levels.js'
import { layoutAndBind } from './game/dragdrop.js'
import { unlockAudio, sound } from './game/audio.js'
import { setLevelStars } from './game/progress.js'
import { renderMenu, renderWorld, renderGame, renderComplete } from './ui/screens.js'

const app = document.getElementById('app')
document.addEventListener('pointerdown', unlockAudio, { once: true })

let currentWorld = 'shapes'
let currentIndex = 0

const c = {
  showMenu() {
    renderMenu(app, c)
  },
  openWorld(world) {
    currentWorld = world
    renderWorld(app, world, c)
  },
  startLevel(world, index) {
    currentWorld = world
    currentIndex = index
    const level = levels[world][index]
    renderGame(app, level, c)
    layoutAndBind({
      playArea: app.querySelector('#play-area'),
      pieces: [...app.querySelectorAll('.piece')],
      onComplete() {
        sound.win()
        setLevelStars(level.id, 3)
        setTimeout(() => renderComplete(app, level, c), 950)
      }
    })
  },
  currentIndex() {
    return currentIndex
  },
  nextLevel(level) {
    const list = levels[level.world]
    if (currentIndex + 1 < list.length) c.startLevel(level.world, currentIndex + 1)
    else c.openWorld(level.world)
  }
}

c.showMenu()
