import { useParticleStore } from '../../store/useParticleStore';
import { PHYSICS_PRESETS } from '../../constants/physicsPresets';
import { PhysicsMode, PhysicsPresetId } from '../../types';
import { Atom, Bomb, RotateCcw, X, Zap, Radio, GitFork, ArrowDown, Shield } from 'lucide-react';
import { useState } from 'react';

export function PhysicsDrawer() {
  const activeTab = useParticleStore((s) => s.activeTab);
  const setActiveTab = useParticleStore((s) => s.setActiveTab);

  // Store values
  const physicsEnabled = useParticleStore((s) => s.physicsEnabled);
  const togglePhysics = useParticleStore((s) => s.togglePhysics);
  const physicsMode = useParticleStore((s) => s.physicsMode);
  const setPhysicsMode = useParticleStore((s) => s.setPhysicsMode);
  const activePhysicsPreset = useParticleStore((s) => s.activePhysicsPreset);
  const applyPhysicsPreset = useParticleStore((s) => s.applyPhysicsPreset);
  const resetPhysics = useParticleStore((s) => s.resetPhysics);
  const triggerExplosion = useParticleStore((s) => s.triggerExplosion);
  const updateConfig = useParticleStore((s) => s.updateConfig);

  const attractionForce = useParticleStore((s) => s.attractionForce);
  const repulsionForce = useParticleStore((s) => s.repulsionForce);
  const mouseInteractionRadius = useParticleStore((s) => s.mouseInteractionRadius);
  const vortexStrength = useParticleStore((s) => s.vortexStrength);
  const vortexDirection = useParticleStore((s) => s.vortexDirection);
  const gravity = useParticleStore((s) => s.gravity);
  const damping = useParticleStore((s) => s.damping);
  const explosionIntensity = useParticleStore((s) => s.explosionIntensity);
  const showConnections = useParticleStore((s) => s.showConnections);
  const toggleShowConnections = useParticleStore((s) => s.toggleShowConnections);
  const connectionDistance = useParticleStore((s) => s.connectionDistance);
  const connectionOpacity = useParticleStore((s) => s.connectionOpacity);

  const [explosionButtonActive, setExplosionButtonActive] = useState(false);

  if (activeTab !== 'physics') return null;

  const handleExplode = () => {
    setExplosionButtonActive(true);
    triggerExplosion();
    setTimeout(() => setExplosionButtonActive(false), 300);
  };

  const modes: { id: PhysicsMode; label: string; icon: typeof Radio }[] = [
    { id: 'repulsion', label: 'Repulsion', icon: Radio },
    { id: 'attraction', label: 'Attraction', icon: Zap },
    { id: 'vortex', label: 'Vortex', icon: Atom },
    { id: 'hybrid', label: 'Hybrid', icon: GitFork }
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] glass-panel border-l border-white/10 p-6 flex flex-col justify-between overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <Atom className="text-emerald-400" size={20} />
            <h3 className="font-heading font-semibold text-base sm:text-lg text-white">
              Physics Engine
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('none')}
            className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-white/50 hover:text-white transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Master Power & Interactive Detonate Banner */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <button
            onClick={togglePhysics}
            className={`p-3 rounded-2xl flex items-center justify-between border transition cursor-pointer ${
              physicsEnabled
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-white/5 border-white/10 text-white/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span className="text-xs font-semibold">Simulation</span>
            </div>
            <span className="text-[10px] uppercase font-mono-data px-1.5 py-0.5 rounded bg-black/40">
              {physicsEnabled ? 'Active' : 'Off'}
            </span>
          </button>

          <button
            onClick={handleExplode}
            className={`p-3 rounded-2xl flex items-center justify-center gap-2 border font-medium text-xs transition cursor-pointer ${
              explosionButtonActive
                ? 'bg-white text-black scale-95 shadow-[0_0_25px_#ffffff]'
                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white active:scale-95'
            }`}
          >
            <Bomb size={15} className="text-red-400" />
            <span className="font-semibold tracking-wide">Trigger Blast</span>
          </button>
        </div>

        {/* Physics Presets Carousel */}
        <div className="mb-5">
          <span className="text-[11px] font-mono-data uppercase tracking-wider text-white/50 block mb-2">
            Physics Presets
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {PHYSICS_PRESETS.map((preset) => {
              const isSelected = activePhysicsPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => applyPhysicsPreset(preset.id as PhysicsPresetId)}
                  className={`py-2 px-2.5 rounded-xl text-left border transition cursor-pointer ${
                    isSelected
                      ? 'bg-white/20 border-white/40 text-white font-medium shadow-[0_0_12px_rgba(255,255,255,0.1)]'
                      : 'glass-panel border-white/5 text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="text-[11px] font-semibold truncate">{preset.name.split(' ')[0]}</div>
                  <div className="text-[9px] text-white/40 uppercase tracking-wider truncate">
                    {preset.mode}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Force Interaction Mode Selector */}
        <div className="mb-5">
          <span className="text-[11px] font-mono-data uppercase tracking-wider text-white/50 block mb-2">
            Cursor Force Vector Mode
          </span>
          <div className="grid grid-cols-4 gap-1 glass-panel p-1 rounded-2xl border border-white/10">
            {modes.map((m) => {
              const Icon = m.icon;
              const isCurrent = physicsMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setPhysicsMode(m.id)}
                  className={`flex flex-col items-center justify-center py-2 rounded-xl text-[10px] font-medium transition cursor-pointer ${
                    isCurrent
                      ? 'bg-white text-black font-semibold shadow-[0_2px_10px_rgba(255,255,255,0.2)]'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Icon size={13} className="mb-1" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Sliders */}
        <div className="space-y-4">
          {/* Attraction Force */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/70">Attraction Force</span>
              <span className="font-mono-data text-white/50">{attractionForce.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.02"
              value={attractionForce}
              onChange={(e) => updateConfig({ attractionForce: Number(e.target.value) })}
              className="w-full accent-white bg-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>

          {/* Repulsion Force */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/70">Repulsion Force</span>
              <span className="font-mono-data text-white/50">{repulsionForce.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.02"
              value={repulsionForce}
              onChange={(e) => updateConfig({ repulsionForce: Number(e.target.value) })}
              className="w-full accent-white bg-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>

          {/* Interaction Radius */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/70">Interaction Radius</span>
              <span className="font-mono-data text-white/50">{mouseInteractionRadius.toFixed(1)}m</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="8.0"
              step="0.2"
              value={mouseInteractionRadius}
              onChange={(e) => updateConfig({ mouseInteractionRadius: Number(e.target.value) })}
              className="w-full accent-white bg-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>

          {/* Vortex Strength & Direction */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/70">Vortex Strength</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateConfig({ vortexDirection: vortexDirection === 1 ? -1 : 1 })}
                  className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono-data text-white/80 hover:bg-white/20 cursor-pointer"
                  title="Toggle Vortex Direction"
                >
                  {vortexDirection === 1 ? 'CW ↻' : 'CCW ↺'}
                </button>
                <span className="font-mono-data text-white/50">{vortexStrength.toFixed(2)}</span>
              </div>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.5"
              step="0.05"
              value={vortexStrength}
              onChange={(e) => updateConfig({ vortexStrength: Number(e.target.value) })}
              className="w-full accent-white bg-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>

          {/* Gravity */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/70 flex items-center gap-1">
                <ArrowDown size={12} className="text-white/40" />
                Gravitational Acceleration
              </span>
              <span className="font-mono-data text-white/50">{gravity.toFixed(2)}g</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.02"
              value={gravity}
              onChange={(e) => updateConfig({ gravity: Number(e.target.value) })}
              className="w-full accent-white bg-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>

          {/* Friction / Velocity Damping */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/70">Inertia Damping</span>
              <span className="font-mono-data text-white/50">{(damping * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.99"
              step="0.01"
              value={damping}
              onChange={(e) => updateConfig({ damping: Number(e.target.value) })}
              className="w-full accent-white bg-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>

          {/* Explosion Intensity */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/70">Blast Shockwave Energy</span>
              <span className="font-mono-data text-white/50">{explosionIntensity.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="12.0"
              step="0.5"
              value={explosionIntensity}
              onChange={(e) => updateConfig({ explosionIntensity: Number(e.target.value) })}
              className="w-full accent-white bg-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>

          {/* Connection Network Section */}
          <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white/90">Dynamic Connection Lines</span>
              <button
                onClick={toggleShowConnections}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono-data uppercase tracking-wider border transition cursor-pointer ${
                  showConnections
                    ? 'bg-white text-black border-white font-semibold'
                    : 'glass-panel text-white/50 border-white/10 hover:text-white'
                }`}
              >
                {showConnections ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {showConnections && (
              <>
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-white/60">Connection Radius</span>
                    <span className="font-mono-data text-white/40">{connectionDistance.toFixed(2)}m</span>
                  </div>
                  <input
                    type="range"
                    min="0.6"
                    max="2.5"
                    step="0.1"
                    value={connectionDistance}
                    onChange={(e) => updateConfig({ connectionDistance: Number(e.target.value) })}
                    className="w-full accent-white bg-white/10 rounded-lg h-1 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-white/60">Line Opacity</span>
                    <span className="font-mono-data text-white/40">{(connectionOpacity * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.8"
                    step="0.05"
                    value={connectionOpacity}
                    onChange={(e) => updateConfig({ connectionOpacity: Number(e.target.value) })}
                    className="w-full accent-white bg-white/10 rounded-lg h-1 cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Reset Footer */}
      <div className="pt-5 border-t border-white/10 mt-6">
        <button
          onClick={resetPhysics}
          className="w-full py-2.5 rounded-xl glass-panel text-white/70 hover:text-white flex items-center justify-center gap-2 text-xs font-medium transition cursor-pointer hover:border-white/20"
        >
          <RotateCcw size={14} />
          <span>Reset Equilibrium</span>
        </button>
      </div>
    </div>
  );
}
