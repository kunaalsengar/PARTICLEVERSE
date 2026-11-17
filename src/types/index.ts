export type FormationType =
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
  | 'butterfly';

export type ColorPaletteId =
  | 'pure-white'
  | 'electric'
  | 'cosmic'
  | 'aurora'
  | 'inferno'
  | 'rainbow'
  | 'custom';

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
  connectionDistance: number;
  attractionForce: number;
  repulsionForce: number;
  rotationSpeed: number;
  depth: number;
  glow: number;
  currentFormation: FormationType;
  currentPalette: ColorPaletteId;
  customColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  morphDuration: number;
  autoRotate: boolean;
  autoCycleFormations: boolean;
  autoCycleInterval: number; // in seconds
  showConnections: boolean;
  bloomIntensity: number;
  mouseInteractionRadius: number;
}

export interface FormationMetadata {
  id: FormationType;
  name: string;
  category: 'organism' | 'symbol' | 'geometric' | 'cosmic';
  description: string;
  particleCountRecommended: number;
  tagline: string;
}
