# 🌟 Aurora

[![Live Demo](https://img.shields.io/badge/Live_Demo-Play_Now-brightgreen.svg?logo=googlechrome&logoColor=white)](https://warkahkomplot.github.io/aurora/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-brightgreen.svg?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

🎮 **Play Live Now:** [https://warkahkomplot.github.io/aurora/](https://warkahkomplot.github.io/aurora/)

**Aurora** is a free, open-source, ad-free toddler learning and sorting game built as a Progressive Web App (PWA). Designed with warm cartoon aesthetics, forgiving touch interactions, and zero punitive feedback, Aurora helps toddlers and young children learn geometric shapes, colors, and animal habitats through delightful play.

Works completely offline on iOS, Android, and Desktop.

---

## 🎮 Game Worlds (60 Levels Total)

### 🔷 Shape World (30 Levels)
Explores **19 geometric shapes** through progressive developmental milestones:
* **Shapes Included**: Circle, oval, square, rectangle, triangle, diamond, star, heart, crescent, pentagon, hexagon, heptagon, octagon, nonagon, decagon, cross, arrow, trapezoid, and parallelogram.
* **Modes**:
  1. **Shape-Matching**: Dragging shapes into matching silhouette cutouts.
  2. **Color-Matching**: Sorting shapes into matching color-coded bins.
  3. **Combined Shape & Color**: Advanced matching of both shape and tint.

### 🐾 Animal Homes (30 Levels)
Helps toddlers connect **24 friendly animals** with their natural habitats:
* **Animals**: Bird, bear, rabbit, fish, bee, squirrel, dog, cat, fox, owl, duck, frog, hen, cow, horse, sheep, pig, turtle, snail, ant, mole, mouse, hedgehog, and penguin.
* **Habitats**: Nests, caves, burrows, ponds, hives, doghouses, stables, lily pads, icebergs, anthills, and more.
* **Habitat Badges**: When an animal finds its home, a happy circular badge appears nestled right on the habitat!

---

## ✨ Toddler-First Design & Game Feel

* 🚫 **No Ads, Trackers, or In-App Purchases**: 100% private, safe, and distraction-free.
* 🌈 **Positive Reinforcement Only**: No countdown timers, no penalty buzzers, and no "game over" screens.
* 🧲 **Forgiving Hitboxes**: Generous 28px magnetic snap tolerance engineered for little fingers.
* 🎨 **Dynamic Color Snap**: Dropping a shape into an empty cutout instantly lights up the target with the vibrant color and solid shape of the piece.
* 🔊 **Parent Mute Controls**: Includes a one-tap `🔊` / `🔇` toggle button with persistent `localStorage` memory.
* 🎵 **Synthesized Sound Effects**: Built entirely on the Web Audio API—zero bulky audio downloads, instant playback, zero lag.
* 🪶 **Animated Guide Mascot**: The friendly owl floats and breathes on the home screen, wiggles, and celebrates victories with children.
* 👑 **Grand Champion Finales**: 
  * Completing Level 30 crowns the player as the **World Champion** with a special audio fanfare and golden crown on the owl guide.
  * Clearing all 60 levels unlocks the **Grand Aurora Champion** screen with a rainbow ribbon, massive confetti cascade, and a permanent golden title banner!

---

## 📱 Progressive Web App (PWA) — Install on Any Device

Aurora runs directly in the browser and can be installed as a native-feeling standalone app that works with or without an internet connection:

* **Android (Chrome)**: Open the [live link](https://warkahkomplot.github.io/aurora/), tap the three dots or prompt, and tap **"Install App"** / **"Add to Home screen"**.
* **iOS (Safari)**: Open the [live link](https://warkahkomplot.github.io/aurora/), tap the **Share** button at the bottom, and select **"Add to Home Screen"**.
* **Desktop (Chrome/Edge/Brave)**: Click the **Install** button in the URL bar to launch Aurora in its own dedicated window.

---

## 🚀 Local Development

### Prerequisites

* [Node.js](https://nodejs.org/) (version 18 or newer)
* `npm` (or `pnpm` / `yarn`)

### Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/WarkahKomplot/aurora.git
cd aurora

# 2. Install dependencies
npm install

# 3. Start local development server (with Hot Module Replacement)
npm run dev
```

Open your browser at `http://localhost:5173/` to play and test changes in real time.

### Production Build

```bash
# Build the optimized production bundle
npm run build

# Preview the production build locally
npm run preview
```

The production output in `dist/` is completely static, precached by Workbox, and ready to host anywhere.

---

## 🎨 Procedural Art Generation

All artwork in `public/art/` and `public/icons/` is 100% original, open, and reproducible via Python's Pillow library without any external copyrighted assets:

```bash
pip install pillow
python scripts/generate_art.py
```

---

## 🛠️ Architecture & Tech Stack

```text
aurora/
├── .github/
│   └── workflows/
│       └── deploy.yml        # Automatic GitHub Pages CI/CD workflow
├── public/
│   ├── art/                  # 48+ Procedurally generated SVG/PNG sprites
│   └── icons/                # PWA icons (192px, 512px, maskable)
├── scripts/
│   └── generate_art.py       # Pillow script for regenerating all game artwork
├── src/
│   ├── game/
│   │   ├── audio.js          # Web Audio API synthesizers & mute state manager
│   │   ├── dragdrop.js       # Touch & Pointer physics, hit detection, snapping
│   │   ├── levels.js         # 60 level configurations, shape clip-paths, & palettes
│   │   └── progress.js       # LocalStorage star progression system
│   ├── ui/
│   │   └── screens.js        # Home menu, world grids, game board, & grand finale screens
│   ├── main.js               # Application state machine & orchestrator
│   └── styles.css            # Fredoka typography, animations, candy pills, & layout
├── index.html                # HTML5 entry with PWA manifest & viewport meta tags
├── vite.config.js            # Vite bundler & vite-plugin-pwa configuration
└── package.json
```

---

## 🌐 Deploying to GitHub Pages

This repository includes a continuous deployment workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

To activate it:
1. Go to your repository **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Every push to the `main` branch will automatically compile, test, and deploy to:  
   👉 **`https://warkahkomplot.github.io/aurora/`**

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Feel free to fork, customize, or contribute toddler-friendly improvements!
