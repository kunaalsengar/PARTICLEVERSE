export type FormationType =
  // Original 11 formations (Phase 01)
  | 'spider'
  | 'neural'
  | 'galaxy'
  | 'helix'
  | 'sphere'
  | 'cube'
  | 'torus'
  | 'heart'
  | 'infinity'
  | 'star'
  | 'butterfly'
  // 12 New Distinct Formations (Phase 03)
  | 'icosahedron'
  | 'dodecahedron'
  | 'octahedron'
  | 'klein-bottle'
  | 'tree-of-life'
  | 'coral'
  | 'rose'
  | 'nebula'
  | 'pulsar'
  | 'cosmic-web'
  | 'crescent-moon'
  | 'diamond'
  | 'yin-yang';

export type FormationCategory = 'organism' | 'geometric' | 'cosmic' | 'symbol';

export type MorphStyle = 'smooth' | 'spiral' | 'explosive' | 'wave' | 'dissolve';

export type ColorPaletteId =
  | 'pure-white'
  | 'electric'
  | 'cosmic'
  | 'aurora'
  | 'inferno'
  | 'rainbow'
  | 'custom';

export type PhysicsMode = 'repulsion' | 'attraction' | 'vortex' | 'hybrid';

export type PhysicsPresetId =
  | 'default'
  | 'gravity'
  | 'magnetic'
  | 'vortex'
  | 'explosion'
  | 'flow'
  | 'zero-gravity';

export interface PhysicsPreset {
  id: PhysicsPresetId;
  name: string;
  description: string;
  mode: PhysicsMode;
  attractionForce: number;
  repulsionForce: number;
  interactionRadius: number;
  vortexStrength: number;
  vortexDirection: number;
  gravity: number;
  damping: number;
  explosionIntensity: number;
  showConnections: boolean;
  connectionDistance: number;
}

export interface ColorPalette {
  id: ColorPaletteId;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  ambientGlow: string;
}

export interface ParticleConfig {
  particleCount: number;
  particleSize: number;
  movementSpeed: number;
  organicNoiseScale: number;
  organicNoiseSpeed: number;

  // Physics parameters (Phase 02)
  physicsEnabled: boolean;
  physicsMode: PhysicsMode;
  attractionForce: number;
  repulsionForce: number;
  mouseInteractionRadius: number;
  vortexStrength: number;
  vortexDirection: number; // 1 = Clockwise, -1 = Counter-Clockwise
  vortexRadius: number;
  gravity: number;
  damping: number;
  explosionIntensity: number;

  // Connection network (Phase 02)
  showConnections: boolean;
  connectionDistance: number;
  connectionOpacity: number;
  maxConnectionsPerParticle: number;

  // Formation & Morphing (Phase 03)
  currentFormation: FormationType;
  morphStyle: MorphStyle;
  morphDuration: number;
  autoCycleFormations: boolean;
  autoCycleInterval: number; // in seconds
  autoCycleShuffle: boolean;

  // General controls
  rotationSpeed: number;
  depth: number;
  glow: number;
  currentPalette: ColorPaletteId;
  customColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  autoRotate: boolean;
  bloomIntensity: number;
}

export interface FormationMetadata {
  id: FormationType;
  name: string;
  category: FormationCategory;
  description: string;
  particleCountRecommended: number;
  tagline: string;
  symbolGlyph: string;
}
