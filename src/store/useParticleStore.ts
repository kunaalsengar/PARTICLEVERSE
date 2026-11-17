import { create } from 'zustand';
import { FormationType, ColorPaletteId, ParticleConfig } from '../types';
import { FORMATIONS } from '../constants/formations';

interface ParticleStoreState extends ParticleConfig {
  isPlaying: boolean;
  activeTab: 'explore' | 'studio' | 'presets' | 'settings';
  showUI: boolean;
  fps: number;
  
  // Actions
  setFormation: (formation: FormationType) => void;
  nextFormation: () => void;
  prevFormation: () => void;
  setPalette: (palette: ColorPaletteId) => void;
  togglePlay: () => void;
  toggleAutoCycle: () => void;
  toggleAutoRotate: () => void;
  toggleShowConnections: () => void;
  toggleUI: () => void;
  setActiveTab: (tab: 'explore' | 'studio' | 'presets' | 'settings') => void;
  updateConfig: (partial: Partial<ParticleConfig>) => void;
  setFPS: (fps: number) => void;
  resetConfig: () => void;
}

const DEFAULT_CONFIG: ParticleConfig = {
  particleCount: 12000,
  particleSize: 3.2,
  movementSpeed: 1.0,
  organicNoiseScale: 0.8,
  organicNoiseSpeed: 0.6,
  connectionDistance: 1.2,
  attractionForce: 0.05,
  repulsionForce: 0.08,
  rotationSpeed: 0.3,
  depth: 1.0,
  glow: 1.2,
  currentFormation: 'spider',
  currentPalette: 'pure-white',
  customColors: {
    primary: '#FFFFFF',
    secondary: '#888888',
    accent: '#333333'
  },
  morphDuration: 1.8,
  autoRotate: true,
  autoCycleFormations: false,
  autoCycleInterval: 8,
  showConnections: false,
  bloomIntensity: 1.5,
  mouseInteractionRadius: 3.5
};

export const useParticleStore = create<ParticleStoreState>((set, get) => ({
  ...DEFAULT_CONFIG,
  isPlaying: true,
  activeTab: 'explore',
  showUI: true,
  fps: 60,

  setFormation: (formation: FormationType) => {
    set({ currentFormation: formation });
  },

  nextFormation: () => {
    const current = get().currentFormation;
    const currentIndex = FORMATIONS.findIndex((f) => f.id === current);
    const nextIndex = (currentIndex + 1) % FORMATIONS.length;
    set({ currentFormation: FORMATIONS[nextIndex].id });
  },

  prevFormation: () => {
    const current = get().currentFormation;
    const currentIndex = FORMATIONS.findIndex((f) => f.id === current);
    const prevIndex = (currentIndex - 1 + FORMATIONS.length) % FORMATIONS.length;
    set({ currentFormation: FORMATIONS[prevIndex].id });
  },

  setPalette: (palette: ColorPaletteId) => {
    set({ currentPalette: palette });
  },

  togglePlay: () => {
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  toggleAutoCycle: () => {
    set((state) => ({ autoCycleFormations: !state.autoCycleFormations }));
  },

  toggleAutoRotate: () => {
    set((state) => ({ autoRotate: !state.autoRotate }));
  },

  toggleShowConnections: () => {
    set((state) => ({ showConnections: !state.showConnections }));
  },

  toggleUI: () => {
    set((state) => ({ showUI: !state.showUI }));
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  updateConfig: (partial) => {
    set((state) => ({ ...state, ...partial }));
  },

  setFPS: (fps) => {
    set({ fps });
  },

  resetConfig: () => {
    set(DEFAULT_CONFIG);
  }
}));
