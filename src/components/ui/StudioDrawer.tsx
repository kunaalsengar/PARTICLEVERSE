import { useParticleStore } from '../../store/useParticleStore';
import { Sliders, RotateCcw, X } from 'lucide-react';

export function StudioDrawer() {
  const activeTab = useParticleStore((s) => s.activeTab);
  const setActiveTab = useParticleStore((s) => s.setActiveTab);
  const particleCount = useParticleStore((s) => s.particleCount);
  const particleSize = useParticleStore((s) => s.particleSize);
  const movementSpeed = useParticleStore((s) => s.movementSpeed);
  const organicNoiseScale = useParticleStore((s) => s.organicNoiseScale);
  const repulsionForce = useParticleStore((s) => s.repulsionForce);
  const rotationSpeed = useParticleStore((s) => s.rotationSpeed);
  const glow = useParticleStore((s) => s.glow);
  const morphDuration = useParticleStore((s) => s.morphDuration);
  const updateConfig = useParticleStore((s) => s.updateConfig);
  const resetConfig = useParticleStore((s) => s.resetConfig);

  if (activeTab !== 'particle') return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 glass-panel-elevated border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.9)]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <Sliders className="text-cyan-400" size={18} />
            <h3 className="font-heading font-semibold text-lg text-white">Particle Engine</h3>
          </div>
          <button
            onClick={() => setActiveTab('none')}
            className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-white/50 hover:text-white transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="space-y-5">
          {/* Particle Count */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/70">Particle Density</span>
              <span className="font-mono-data text-white/50">{particleCount.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="25000"
              step="1000"
              value={particleCount}
              onChange={(e) => updateConfig({ particleCount: Number(e.target.value) })}
              className="w-full accent-white bg-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>

          {/* Particle Size */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/70">Particle Point Size</span>
              <span className="font-mono-data text-white/50">{particleSize.toFixed(1)}px</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="6.0"
              step="0.2"
              value={particleSize}
              onChange={(e) => updateConfig({ particleSize: Number(e.target.value) })}
              className="w-full accent-white bg-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>

          {/* Movement Speed */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/70">Autonomous Velocity</span>
              <span className="font-mono-data text-white/50">{movementSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={movementSpeed}
              onChange={(e) => updateConfig({ movementSpeed: Number(e.target.value) })}
              className="w-full accent-white bg-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>

          {/* Organic Noise Scale */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/70">Organic Noise Perturbation</span>
              <span className="font-mono-data text-white/50">{organicNoiseScale.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.05"
              value={organicNoiseScale}
              onChange={(e) => updateConfig({ organicNoiseScale: Number(e.target.value) })}
              className="w-full accent-white bg-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>

          {/* Repulsion Force */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/70">Mouse Repulsion Vector</span>
              <span className="font-mono-data text-white/50">{repulsionForce.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.25"
              step="0.01"
              value={repulsionForce}
              onChange={(e) => updateConfig({ repulsionForce: Number(e.target.value) })}
              className="w-full accent-white bg-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>

          {/* Rotation Speed */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/70">3D Orbit Angular Velocity</span>
              <span className="font-mono-data text-white/50">{rotationSpeed.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.5"
              step="0.05"
              value={rotationSpeed}
              onChange={(e) => updateConfig({ rotationSpeed: Number(e.target.value) })}
              className="w-full accent-white bg-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>

          {/* Glow */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/70">Core Aura Luminance</span>
              <span className="font-mono-data text-white/50">{glow.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={glow}
              onChange={(e) => updateConfig({ glow: Number(e.target.value) })}
              className="w-full accent-white bg-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>

          {/* Morph Duration */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/70">Morphing Easing Duration</span>
              <span className="font-mono-data text-white/50">{morphDuration.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={morphDuration}
              onChange={(e) => updateConfig({ morphDuration: Number(e.target.value) })}
              className="w-full accent-white bg-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Reset Footer */}
      <div className="pt-6 border-t border-white/10 mt-6">
        <button
          onClick={resetConfig}
          className="w-full py-2.5 rounded-xl glass-panel text-white/70 hover:text-white flex items-center justify-center gap-2 text-xs font-medium transition cursor-pointer hover:border-white/20"
        >
          <RotateCcw size={14} />
          <span>Reset to Default Physics</span>
        </button>
      </div>
    </div>
  );
}
