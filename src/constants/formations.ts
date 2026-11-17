import { FormationMetadata } from '../types';

/**
 * Selectable Formation Library
 * Exactly three primary entities: Heart, Butterfly, Double Helix
 */
export const FORMATIONS: FormationMetadata[] = [
  {
    id: 'heart',
    name: 'Cardioid Resonator',
    category: 'symbol',
    description: 'Parametric 3D cardioid structure pulsating with mathematical rhythm and kinetic warmth.',
    particleCountRecommended: 10000,
    tagline: 'Harmonic Cardioid Form',
    symbolGlyph: '🤍'
  },
  {
    id: 'butterfly',
    name: 'Chaos Butterfly',
    category: 'organism',
    description: 'Lorenz attractor-inspired fluttering wings exhibiting deterministic dynamic chaos.',
    particleCountRecommended: 12000,
    tagline: 'Dynamic Chaos Phenomenon',
    symbolGlyph: '🦋'
  },
  {
    id: 'helix',
    name: 'Quantum Double Helix',
    category: 'symbol',
    description: 'Intertwined genomic strands encoding synthetic particle bio-data along a vertical axis.',
    particleCountRecommended: 10000,
    tagline: 'Molecular Genetic Strand',
    symbolGlyph: '🧬'
  }
];
