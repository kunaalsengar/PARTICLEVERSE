import { create } from 'zustand';
import { FormationType, ColorPaletteId, ParticleConfig, PhysicsMode, PhysicsPresetId, MorphStyle } from '../types';
import { FORMATIONS } from '../constants/formations';
import { PHYSICS_PRESETS } from '../constants/physicsPresets';

interface ParticleStoreState extends ParticleConfig {
  isPlaying: boolean;
  activeTab: 'none' | 'particle' | 'physics' | 'formation';
  showUI: boolean;
  fps: number;
  activePhysicsPreset: PhysicsPresetId;
  explosionTriggerCount: number;
  searchQuery: string;
  selectedCategory: string;

  // Actions
  setFormation: (formation: FormationType) => void;
  nextFormation: () => void;
  prevFormation: () => void;
  setPalette: (palette: ColorPaletteId) => void;
  togglePlay: () => void;
  toggleAutoCycle: () => void;
  toggleAutoCycleShuffle: () => void;
  toggleAutoRotate: () => void;
  toggleShowConnections: () => void;
  togglePhysics: () => void;
  toggleUI: () => void;
  setActiveTab: (tab: 'none' | 'particle' | 'physics' | 'formation') => void;
  setMorphStyle: (style: MorphStyle) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string) => void;
  updateConfig: (partial: Partial<ParticleConfig>) => void;
  setFPS: (fps: number) => void;
  resetConfig: () => void;

  // Physics Actions (Phase 02)
  triggerExplosion: () => void;
  applyPhysicsPreset: (presetId: PhysicsPresetId) => void;
  setPhysicsMode: (mode: PhysicsMode) => void;
  resetPhysics: () => void;
}

const DEFAULT_CONFIG: ParticleConfig = {
  particleCount: 12000,
  particleSize: 3.2,
  movementSpeed: 1.0,
  organicNoiseScale: 0.8,
  organicNoiseSpeed: 0.6,

  // Physics defaults (Phase 02)
  physicsEnabled: true,
  physicsMode: 'repulsion',
  attractionForce: 0.05,
  repulsionForce: 0.12,
  mouseInteractionRadius: 3.5,
  vortexStrength: 0.4,
  vortexDirection: 1,
  vortexRadius: 3.5,
  gravity: 0.0,
  damping: 0.85,
  explosionIntensity: 5.0,

  // Connection network defaults (Phase 02)
  showConnections: false,
  connectionDistance: 1.2,
  connectionOpacity: 0.35,
  maxConnectionsPerParticle: 3,

  // Formation & Morphing defaults (Phase 03)
  currentFormation: 'heart',
  morphStyle: 'smooth',
  morphDuration: 1.8,
  autoCycleFormations: false,
  autoCycleInterval: 8,
  autoCycleShuffle: false,

  // General controls
  rotationSpeed: 0.3,
  depth: 1.0,
  glow: 1.2,
  currentPalette: 'pure-white',
  customColors: {
    primary: '#FFFFFF',
    secondary: '#888888',
    accent: '#333333'
  },
  autoRotate: true,
  bloomIntensity: 1.5
};

export const useParticleStore = create<ParticleStoreState>((set, get) => ({
  ...DEFAULT_CONFIG,
  isPlaying: true,
  activeTab: 'none',
  showUI: true,
  fps: 60,
  activePhysicsPreset: 'default',
  explosionTriggerCount: 0,
  searchQuery: '',
  selectedCategory: 'all',

  setFormation: (formation: FormationType) => {
    set({ currentFormation: formation });
  },

  nextFormation: () => {
    const { currentFormation, autoCycleShuffle } = get();
    if (autoCycleShuffle) {
      // Pick random different formation
      const otherFormations = FORMATIONS.filter((f) => f.id !== currentFormation);
      const randomChoice = otherFormations[Math.floor(Math.random() * otherFormations.length)];
      set({ currentFormation: randomChoice.id });
    } else {
      const currentIndex = FORMATIONS.findIndex((f) => f.id === currentFormation);
      const nextIndex = (currentIndex + 1) % FORMATIONS.length;
      set({ currentFormation: FORMATIONS[nextIndex].id });
    }
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

  toggleAutoCycleShuffle: () => {
    set((state) => ({ autoCycleShuffle: !state.autoCycleShuffle }));
  },

  toggleAutoRotate: () => {
    set((state) => ({ autoRotate: !state.autoRotate }));
  },

  toggleShowConnections: () => {
    set((state) => ({ showConnections: !state.showConnections }));
  },

  togglePhysics: () => {
    set((state) => ({ physicsEnabled: !state.physicsEnabled }));
  },

  toggleUI: () => {
    set((state) => ({ showUI: !state.showUI }));
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },

  setMorphStyle: (style: MorphStyle) => {
    set({ morphStyle: style });
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
  },

  setSelectedCategory: (cat: string) => {
    set({ selectedCategory: cat });
  },

  updateConfig: (partial) => {
    set((state) => ({ ...state, ...partial }));
  },

  setFPS: (fps) => {
    set({ fps });
  },

  resetConfig: () => {
    set(DEFAULT_CONFIG);
  },

  triggerExplosion: () => {
    set((state) => ({ explosionTriggerCount: state.explosionTriggerCount + 1 }));
  },

  applyPhysicsPreset: (presetId: PhysicsPresetId) => {
    const preset = PHYSICS_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    set({
      activePhysicsPreset: presetId,
      physicsMode: preset.mode,
      attractionForce: preset.attractionForce,
      repulsionForce: preset.repulsionForce,
      mouseInteractionRadius: preset.interactionRadius,
      vortexStrength: preset.vortexStrength,
      vortexDirection: preset.vortexDirection,
      gravity: preset.gravity,
      damping: preset.damping,
      explosionIntensity: preset.explosionIntensity,
      showConnections: preset.showConnections,
      connectionDistance: preset.connectionDistance
    });
  },

  setPhysicsMode: (mode: PhysicsMode) => {
    set({ physicsMode: mode });
  },

  resetPhysics: () => {
    get().applyPhysicsPreset('default');
  }
}));

if (typeof window !== 'undefined') {
  (window as any).useParticleStore = useParticleStore;
}
