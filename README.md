# 🌟 Aurora

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-brightgreen.svg?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

**Aurora** is a free, open-source, ad-free drag-and-drop learning game designed specifically for toddlers and young children. Built as a Progressive Web App (PWA), Aurora works seamlessly on tablets, phones, and desktops — online or completely offline.

---

## 🎮 Game Worlds

### 🔷 Shape World (30 Levels)
Explores **19 geometric shapes** across progressive learning modes:
* **Shapes Included**: Circle, oval, square, rectangle, triangle, diamond, star, heart, crescent, pentagon, hexagon, heptagon, octagon, nonagon, decagon, cross, arrow, trapezoid, and parallelogram.
* **Modes**: Shape-matching, color-matching, and combined shape + color challenges.

### 🐾 Animal Homes (30 Levels)
Helps children connect **24 animals** with their natural habitats and homes:
* **Animals**: Bird, bear, rabbit, fish, bee, squirrel, dog, cat, fox, owl, duck, frog, hen, cow, horse, sheep, pig, turtle, snail, ant, mole, mouse, hedgehog, and penguin.
* **Habitats**: Nests, caves, burrows, ponds, hives, doghouses, stables, lily pads, icebergs, and more.

---

## ✨ Toddler-Friendly Design Principles

* **No Ads, No Trackers**: 100% private and distraction-free.
* **Positive Reinforcement**: No countdown timers, penalty screens, or punitive "wrong" feedback.
* **Forgiving Hitboxes**: Built with generous touch magnets tailored for little fingers.
* **Smooth Physics**: Powered by CSS `translate3d` hardware acceleration and standard Pointer Events.
* **Dynamic Audio**: Gentle synthesized chimes using Web Audio API (zero bulky external audio files).

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (version 18+ recommended)
* `npm` (or `pnpm` / `yarn`)

### Installation & Development

```bash
# Clone repository
git clone https://github.com/WarkahKomplot/aurora.git
cd aurora

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser at `http://localhost:5173/` to play.

### Production Build

```bash
# Compile and bundle to dist/
npm run build

# Preview production build locally
npm run preview
```

The output in `dist/` is completely static and ready to host anywhere.

---

## 📱 Installing on Devices (PWA)

* **Android (Chrome)**: Visit your deployed URL and tap **"Install App"** or **"Add to Home screen"**.
* **iOS (Safari)**: Visit the URL in Safari, tap the **Share** button, and select **"Add to Home Screen"**.
* **Desktop (Chrome/Edge)**: Click the install icon in the address bar to install as a standalone desktop app.

---

## 🎨 Artwork Generation

All artwork in `public/art/` and `public/icons/` is 100% original and generated procedurally using Python and Pillow:

```bash
pip install pillow
python scripts/generate_art.py
```

---

## 🛠️ Tech Stack & Architecture

* **Bundler & Core**: [Vite](https://vitejs.dev/) + Modern Vanilla JavaScript (ES Modules)
* **PWA Engine**: [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) with Workbox for automatic cache & offline support
* **UI & Layout**: Modern CSS Grid and Flexbox with responsive typography (`clamp`)
* **Audio**: Native Web Audio API synthesizer
* **State & Progress**: Browser `localStorage` for star ratings

```text
aurora/
├── .github/workflows/deploy.yml   # Automatic GitHub Pages CI/CD
├── public/
│   ├── art/                       # Procedurally generated PNG artwork
│   └── icons/                     # PWA icons
├── scripts/
│   └── generate_art.py            # Pillow art generator script
├── src/
│   ├── game/
│   │   ├── audio.js               # Web Audio API chime generator
│   │   ├── dragdrop.js            # Touch/Pointer drag-and-drop mechanics
│   │   ├── levels.js              # Level configurations & geometric clip-paths
│   │   └── progress.js            # Star progress persistence
│   ├── ui/
│   │   └── screens.js             # Menu, world select, game board, victory screens
│   ├── main.js                    # Application orchestrator
│   └── styles.css                 # Responsive game styling
├── index.html                     # HTML5 entry with PWA meta tags
├── vite.config.js                 # Vite + PWA configuration
└── package.json
```

---

## 🚢 Publishing to GitHub & GitHub Pages

1. **Create a GitHub repository** named `aurora`.
2. **Push your code**:
   ```bash
   git remote add origin git@github.com:WarkahKomplot/aurora.git
   git branch -M main
   git push -u origin main
   ```
3. **Enable GitHub Pages**:
   * In your repository, go to **Settings** > **Pages**.
   * Under **Build and deployment** > **Source**, select **GitHub Actions**.
   * The included `.github/workflows/deploy.yml` workflow will automatically build and publish your game on every push to `main`!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
