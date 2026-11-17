# PARTICLEVERSE

> An interactive, premium 3D generative particle universe featuring organic biological formations, real-time GPU physics, custom symbols, brand logo reconstruction, and cinematic morphing.

![PARTICLEVERSE Preview](https://raw.githubusercontent.com/kunaalsengar/PARTICLEVERSE/main/public/preview.png)

---

## 🌌 Overview

**PARTICLEVERSE** is an exploration of generative art, parametric mathematics, and real-time GPU particle physics built for modern web browsers. Inspired by organic biological organisms, cosmic phenomena, and quantum geometry, PARTICLEVERSE renders tens of thousands of particles at locked 60 FPS using single-buffer geometry and custom GLSL vertex and fragment shaders.

---

## ⚡ Tech Stack & Architecture

- **Core Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **3D Graphics Engine**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Shader Pipeline**: Custom GLSL Vertex & Fragment Shaders (Simplex 3D noise, vector force fields, 5 GPU morph styles, exponential aura falloff, distance-attenuated point sizing)
- **Physics Engine**: Multi-force vector fields (Repulsion, Attraction, 3D Vortex curl, Gravitational acceleration, and Shockwave detonation)
- **Morph Engine**: 5 distinct 3D GPU transition styles (Smooth, Spiral, Explosive, Wave, Dissolve)
- **Connection Network**: Spatial voxel hashing neighbor detection rendering dynamic distance-attenuated lines in real time
- **Animation & Morphing**: [GSAP](https://greensock.com/gsap/) for smooth non-linear interpolation curves
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/) with glassmorphic depth and [Lucide Icons](https://lucide.dev/)

---

## 🌀 Advanced Morph Engine (Phase 03)

PARTICLEVERSE features 5 GPU-accelerated 3D morph transition styles:

1. **⚡ Smooth Morph**: Nonlinear cubic power3 interpolation between source and destination geometries.
2. **🌀 Spiral Morph**: Helical angular shearing ($\theta = \sin(\pi t) \cdot \pi$) twisting particles along the Y-axis during mid-phase transition.
3. **💥 Explosive Morph**: Kinetic radial blast dispersion dispersing particles outwards before snapping into the new formation coordinates.
4. **🌊 Wave Morph**: Directional vertical wave sweep ($(p_y + 3.0) / 6.0$) transitioning particles bottom-to-top with an illuminated wavefront crest.
5. **🌫️ Dissolve & Reform**: Quantum Brownian micro-fluctuation with particle size expansion, chaotic drift, and crisp re-coalescence.

---

## 🏛️ 23 Distinct Formations Catalog

### Organisms
- **🕷️ Arachne Organism**: Autonomous living predatory organism with articulated cephalothorax, abdomen, and 8 tendrils.
- **🧠 Synaptic Core**: Clustered cortical nodes interconnected by synaptic dendritic pathways.
- **🦋 Chaos Butterfly**: Lorenz attractor-inspired manifold demonstrating deterministic non-linear chaos.
- **🌳 Tree of Life**: Recursive fractal branching arbor with trunk, articulated boughs, and luminous foliage canopy.
- **🪸 Acropora Coral**: Deep sea calcareous reef lattice branching organically with polyhedral tip buds.
- **🌹 Rhodonea Rose**: Parametric 3D harmonic petal manifold blooming along spherical botanical axes.

### Geometric
- **🌐 Geodesic Sphere**: Harmonic Fibonacci spherical distribution with radial surface wave modulation.
- **🧊 Tesseract Hypercube**: Nested 4D orthogonal lattice vibrating along dimensional edge vectors.
- **🍩 Magnetic Torus**: Tokamak containment field circulating charged particles.
- **⬡ Geodesic Icosahedron**: 20-faced Platonic solid with golden-ratio vertex coordinates.
- **⬢ Dodecahedron Matrix**: 12 pentagonal faces forming a Pythagorean cosmological volume.
- **◈ Dual Octahedron**: Concentric stellated octahedra with dual pyramid inversion symmetry.
- **🏺 Klein Bottle**: Four-dimensional non-orientable surface intersecting itself without boundary.

### Cosmic
- **🌀 Andromeda Spiral**: Logarithmic dual-arm spiral galaxy with relativistic accretion disk.
- **⭐ Stellar Nova**: Multi-pointed astrophysical star emitting relativistic particle jets.
- **🌌 Emission Nebula**: Diffuse interstellar ionized gas cloud with turbulent dust filaments.
- **💫 Magnetar Pulsar**: Ultra-dense spinning neutron star beaming relativistic particle jets along magnetic poles.
- **🕸️ Cosmic Web**: Filamentary structure of dark matter connecting galaxy superclusters across megaparsecs.

### Symbols
- **🧬 Quantum Double Helix**: Intertwined genomic strands encoding synthetic bio-data with periodic base rungs.
- **🤍 Cardioid Resonator**: Parametric 3D cardioid structure pulsating with mathematical rhythm.
- **♾️ Mobius Lemniscate**: Continuous non-orientable topological loop cycling particles through infinite curvature.
- **🌙 Astral Crescent**: Parametric lunar sickle embracing an inner orbital 5-pointed companion star.
- **💎 Diamond Crystal**: Faceted brilliant-cut octa-diamond with crown, girdle, and pointed pavilion.
- **☯️ Taiji Yin-Yang**: Intertwining dual harmonic poles representing complementary cosmic equilibrium.

---

## 🎨 Color Palettes

- **Pure White**: Foundational minimal aesthetic with distance luminance shading.
- **Electric**: Cyan, deep neon blue, and pure white highlights.
- **Cosmic**: Violet, purple, and electric magenta.
- **Aurora**: Bioluminescent turquoise, emerald green, and cyan.
- **Inferno**: Incandescent amber, orange, and solar red.
- **Prism Spectrum**: Controlled polychromatic chromatic dispersion.

---

## ⌨️ Controls & Keybindings

| Key / Input | Action |
| :--- | :--- |
| **Left Click + Drag** | 3D Orbit Camera Rotation |
| **Right Click + Drag** | Pan Camera in 3D Space |
| **Scroll Wheel** | Zoom In / Out |
| **Mouse / Touch Hover** | Dynamic 3D Force Field Interaction |
| <kbd>T</kbd> | **Cycle 3D Morph Transition Style** (Smooth / Spiral / Explosive / Wave / Dissolve) |
| <kbd>S</kbd> | **Toggle Showcase Mode** (Sequential Loop vs Random Shuffle) |
| <kbd>B</kbd> | **Trigger Cinematic Particle Blast / Explosion** |
| <kbd>P</kbd> | **Toggle Physics Engine Control Panel** |
| <kbd>M</kbd> | **Cycle Interaction Force Mode** (Repulsion → Attraction → Vortex → Hybrid) |
| <kbd>Space</kbd> | Toggle Simulation Play / Pause |
| <kbd>→</kbd> / <kbd>←</kbd> | Next / Previous Formation |
| <kbd>H</kbd> | Toggle Minimal UI (Cinematic Canvas Mode) |
| <kbd>R</kbd> | Toggle 3D Auto-Rotation |
| <kbd>C</kbd> | Toggle Automatic Showcase Cycle |
| <kbd>Esc</kbd> | Close Drawers & Dialogs |

---

## 🚀 Installation & Local Development

### Prerequisites

- Node.js 18+ (tested on Node.js v24)
- npm 9+

### Quick Start

```bash
# Clone the repository
git clone https://github.com/kunaalsengar/PARTICLEVERSE.git
cd PARTICLEVERSE

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🗺️ Project Roadmap

- [x] **PHASE 01 — Particle Engine**: 3D scene, organic spider organism, autonomous movement, GLSL shaders, camera rig, mouse physics foundation.
- [x] **PHASE 02 — Advanced Physics Engine**: Attraction, repulsion, 3D vortex curl, cinematic particle explosions, shockwave propagation, dynamic connection networks, and 7 physics presets.
- [x] **PHASE 03 — Advanced Formation Engine**: 23 distinct 3D formations, 5 GPU morph transition styles, real-time formation search, and cinematic showcase sequencing.
- [ ] **PHASE 04 — Brand Engine**: PNG, JPEG, and SVG upload, alpha pixel extraction, and logo particle reconstruction.
- [ ] **PHASE 05 — Creator Studio**: Customization sliders, parameter persistence, and custom preset management.
- [ ] **PHASE 06 — Final Polish**: Video/canvas export, mobile touch optimizations, accessibility, and audio-reactive capabilities.

---

## 📄 License

MIT © [kunaalsengar](https://github.com/kunaalsengar)
