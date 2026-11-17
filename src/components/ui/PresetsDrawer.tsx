import { useParticleStore } from '../../store/useParticleStore';
import { Layers, X, Check } from 'lucide-react';
import { FormationType, ColorPaletteId } from '../../types';

interface PresetDefinition {
  id: string;
  name: string;
  category: string;
  formation: FormationType;
  palette: ColorPaletteId;
  size: number;
  count: number;
  speed: number;
  noise: number;
  description: string;
}

const CURATED_PRESETS: PresetDefinition[] = [
  {
    id: 'arachnid-zero',
    name: 'Arachnid Zero',
    category: 'Organism',
    formation: 'spider',
    palette: 'pure-white',
    size: 3.2,
    count: 14000,
    speed: 1.2,
    noise: 0.9,
    description: 'Autonomous predatory organism pulsating with white biocrystalline vectors.'
  },
  {
    id: 'electric-synapse',
    name: 'Electric Synapse',
    category: 'Neural',
    formation: 'neural',
    palette: 'electric',
    size: 2.8,
    count: 12000,
    speed: 1.4,
    noise: 1.1,
    description: 'High-voltage cyan neural clusters transmitting cortical impulses.'
  },
  {
    id: 'cosmic-nebula',
    name: 'Cosmic Singularity',
    category: 'Astrophysics',
    formation: 'galaxy',
    palette: 'cosmic',
    size: 3.5,
    count: 18000,
    speed: 0.8,
    noise: 0.6,
    description: 'Violet relativistic accretion disk spinning around a gravitational event horizon.'
  },
  {
    id: 'inferno-core',
    name: 'Solar Flare Core',
    category: 'Cosmic',
    formation: 'star',
    palette: 'inferno',
    size: 4.0,
    count: 11000,
    speed: 1.8,
    noise: 1.3,
    description: 'Incandescent plasma ejecta streaming from a stellar fusion dynamo.'
  },
  {
    id: 'aurora-helix',
    name: 'Bioluminescent Helix',
    category: 'Genetics',
    formation: 'helix',
    palette: 'aurora',
    size: 3.0,
    count: 10000,
    speed: 0.9,
    noise: 0.5,
    description: 'Turquoise and emerald synthetic RNA helix vibrating with genetic code.'
  },
  {
    id: 'prism-butterfly',
    name: 'Spectral Attractor',
    category: 'Chaos',
    formation: 'butterfly',
    palette: 'rainbow',
    size: 2.6,
    count: 13000,
    speed: 1.1,
    noise: 0.7,
    description: 'Chromatic Lorenz attractor fluttering along non-linear phase trajectories.'
  }
];

export function PresetsDrawer() {
  const activeTab = useParticleStore((s) => s.activeTab);
  const setActiveTab = useParticleStore((s) => s.setActiveTab);
  const currentFormation = useParticleStore((s) => s.currentFormation);
  const currentPalette = useParticleStore((s) => s.currentPalette);
  const updateConfig = useParticleStore((s) => s.updateConfig);
  const setFormation = useParticleStore((s) => s.setFormation);
  const setPalette = useParticleStore((s) => s.setPalette);

  if ((activeTab as string) !== 'presets') return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      <div
        onClick={() => setActiveTab('none')}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
      />

      <div className="glass-panel w-full max-w-2xl max-h-[85vh] rounded-3xl p-6 sm:p-8 flex flex-col relative z-10 pointer-events-auto border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <Layers className="text-white/80" size={18} />
            <h3 className="font-heading font-semibold text-lg text-white">Curated Presets</h3>
          </div>
          <button
            onClick={() => setActiveTab('none')}
            className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-white/50 hover:text-white transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Presets List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 overflow-y-auto pt-4 pr-1">
          {CURATED_PRESETS.map((preset) => {
            const isMatch =
              currentFormation === preset.formation && currentPalette === preset.palette;

            return (
              <button
                key={preset.id}
                onClick={() => {
                  setFormation(preset.formation);
                  setPalette(preset.palette);
                  updateConfig({
                    particleSize: preset.size,
                    particleCount: preset.count,
                    movementSpeed: preset.speed,
                    organicNoiseScale: preset.noise
                  });
                }}
                className={`p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer border ${
                  isMatch
                    ? 'bg-white/15 border-white/40 shadow-[0_0_24px_rgba(255,255,255,0.1)]'
                    : 'glass-panel border-white/5 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono-data text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                    {preset.category}
                  </span>
                  {isMatch && (
                    <span className="flex items-center gap-1 text-[11px] font-mono-data text-white font-medium">
                      <Check size={12} /> Active
                    </span>
                  )}
                </div>
                <h4 className="font-heading font-semibold text-sm text-white mb-1">
                  {preset.name}
                </h4>
                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-3">
                  {preset.description}
                </p>
                <div className="flex items-center gap-3 text-[10px] font-mono-data text-white/40">
                  <span>{(preset.count / 1000).toFixed(0)}K points</span>
                  <span>•</span>
                  <span>{preset.speed}x velocity</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
