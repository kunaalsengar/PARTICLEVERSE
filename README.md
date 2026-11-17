# PARTICLEVERSE

> An interactive, premium 3D generative particle universe featuring organic biological formations, real-time physics, custom symbols, brand logo reconstruction, and cinematic GPU morphing.

![PARTICLEVERSE Preview](https://raw.githubusercontent.com/kunaalsengar/PARTICLEVERSE/main/public/preview.png)

---

## 🌌 Overview

**PARTICLEVERSE** is an exploration of generative art, parametric mathematics, and real-time GPU particle physics built for modern web browsers. Inspired by organic biological organisms, cosmic phenomena, and quantum geometry, PARTICLEVERSE renders tens of thousands of particles at a locked 60 FPS using single-buffer geometry and custom GLSL vertex and fragment shaders.

---

## ⚡ Tech Stack & Architecture

- **Core Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **3D Graphics Engine**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Shader Pipeline**: Custom GLSL Vertex & Fragment Shaders (Simplex 3D noise, exponential aura falloff, distance-attenuated point sizing)
- **Animation & Morphing**: [GSAP](https://greensock.com/gsap/) for smooth non-linear interpolation curves
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Styling & UI**: [Tailwind CSS v4](https://tailwindcss.com/) with glassmorphic depth and [Lucide Icons](https://lucide.dev/)

---

## 🕷️ Initial Formations (Phase 01)

PARTICLEVERSE features 11 parametric and organic formations:

1. **Arachne Organism** (`organism`): Autonomous living predatory organism featuring an articulated cephalothorax, bulbous abdomen, eight multi-segmented spiky legs, and chelicerae.
2. **Synaptic Core** (`organism`): Clustered cortical nodes interconnected by synaptic dendritic pathways.
3. **Andromeda Spiral** (`cosmic`): Logarithmic dual-arm spiral galaxy with relativistic particle accretion disk.
4. **Quantum Double Helix** (`symbol`): Intertwined genomic strands encoding synthetic bio-data with periodic base rungs.
5. **Geodesic Sphere** (`geometric`): Harmonic Fibonacci spherical distribution with radial surface wave modulation.
6. **Tesseract Hypercube** (`geometric`): Nested 4D orthogonal lattice vibrating along dimensional edge vectors.
7. **Magnetic Torus** (`geometric`): Tokamak containment field circulating charged particles.
8. **Cardioid Resonator** (`symbol`): Parametric 3D cardioid structure pulsating with mathematical rhythm.
9. **Mobius Lemniscate** (`symbol`): Continuous non-orientable topological loop cycling particles through infinite curvature.
10. **Stellar Nova** (`cosmic`): Multi-pointed astrophysical star emitting relativistic particle jets.
11. **Chaos Butterfly** (`organism`): Lorenz attractor-inspired manifold demonstrating deterministic non-linear chaos.

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
| **Mouse Hover** | Dynamic 3D Repulsion & Vortex Perturbation |
| <kbd>Space</kbd> | Toggle Simulation Play / Pause |
| <kbd>→</kbd> / <kbd>←</kbd> | Next / Previous Formation |
| <kbd>H</kbd> | Toggle Minimal UI (Cinematic Canvas Mode) |
| <kbd>R</kbd> | Toggle 3D Auto-Rotation |
| <kbd>C</kbd> | Toggle Automatic Morph Cycle |
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
- [ ] **PHASE 02 — Physics Engine**: Advanced attraction, repulsion, vortex fields, particle explosion, and spatial connection networks.
- [ ] **PHASE 03 — Formation Engine**: Expanded symbols, complex geometric structures, and multi-stage particle morphing.
- [ ] **PHASE 04 — Brand Engine**: PNG, JPEG, and SVG upload, alpha pixel extraction, and logo particle reconstruction.
- [ ] **PHASE 05 — Creator Studio**: Customization sliders, parameter persistence, and custom preset management.
- [ ] **PHASE 06 — Final Polish**: Video/canvas export, mobile touch optimizations, accessibility, and audio-reactive capabilities.

---

## 📄 License

MIT © [kunaalsengar](https://github.com/kunaalsengar)
