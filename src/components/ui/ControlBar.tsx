import { useParticleStore } from '../../store/useParticleStore';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Compass,
  Bomb
} from 'lucide-react';
import { useState } from 'react';

export function ControlBar() {
  const isPlaying = useParticleStore((s) => s.isPlaying);
  const togglePlay = useParticleStore((s) => s.togglePlay);
  const nextFormation = useParticleStore((s) => s.nextFormation);
  const prevFormation = useParticleStore((s) => s.prevFormation);
  const autoRotate = useParticleStore((s) => s.autoRotate);
  const toggleAutoRotate = useParticleStore((s) => s.toggleAutoRotate);
  const triggerExplosion = useParticleStore((s) => s.triggerExplosion);

  const [blastActive, setBlastActive] = useState(false);

  const handleBlast = () => {
    setBlastActive(true);
    triggerExplosion();
    setTimeout(() => setBlastActive(false), 300);
  };

  return (
    <nav
      aria-label="Simulation Playback & Formation Controls"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none"
    >
      <div className="glass-panel-elevated px-3 sm:px-4 py-2 sm:py-2.5 rounded-full flex items-center gap-1.5 sm:gap-2.5 pointer-events-auto border border-white/12 shadow-[0_16px_48px_rgba(0,0,0,0.85)]">
        {/* Previous Formation */}
        <button
          onClick={prevFormation}
          aria-label="Previous Formation (Left Arrow)"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full glass-pill flex items-center justify-center text-white/70 hover:text-white active:scale-95 transition cursor-pointer"
          title="Previous Formation [←]"
        >
          <SkipBack size={15} />
        </button>

        {/* Play / Pause Toggle */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause Simulation (Space)' : 'Resume Simulation (Space)'}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 active:scale-95 transition shadow-[0_0_24px_rgba(255,255,255,0.45)] cursor-pointer"
          title={isPlaying ? 'Pause Simulation [Space]' : 'Play Simulation [Space]'}
        >
          {isPlaying ? (
            <Pause size={18} fill="currentColor" />
          ) : (
            <Play size={18} fill="currentColor" className="ml-0.5" />
          )}
        </button>

        {/* Next Formation */}
        <button
          onClick={nextFormation}
          aria-label="Next Formation (Right Arrow)"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full glass-pill flex items-center justify-center text-white/70 hover:text-white active:scale-95 transition cursor-pointer"
          title="Next Formation [→]"
        >
          <SkipForward size={15} />
        </button>

        <div className="w-[1px] h-5 bg-white/15 mx-1" />

        {/* Detonate Blast Trigger */}
        <button
          onClick={handleBlast}
          aria-label="Trigger Particle Detonation Blast (Key: B)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer active:scale-95 ${
            blastActive
              ? 'bg-red-500 text-white shadow-[0_0_24px_#ef4444]'
              : 'bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/25 hover:border-red-500/50'
          }`}
          title="Trigger Particle Detonation Blast [B]"
        >
          <Bomb size={14} className={blastActive ? 'scale-125 transition-transform' : ''} />
          <span className="hidden sm:inline font-semibold">Detonate</span>
          <kbd className="hidden sm:inline-block px-1 py-0.2 rounded bg-black/30 font-mono-data text-[9px] text-red-200">
            B
          </kbd>
        </button>

        <div className="w-[1px] h-5 bg-white/15 mx-1 hidden md:block" />

        {/* 3D Auto Rotate Toggle */}
        <button
          onClick={toggleAutoRotate}
          aria-label="Toggle 3D Orbit Auto-Rotation (Key: R)"
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer active:scale-95 ${
            autoRotate
              ? 'glass-button-active text-white font-semibold'
              : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
          title="Toggle 3D Orbit Auto-Rotation [R]"
        >
          <Compass
            size={14}
            className={autoRotate ? 'animate-spin' : ''}
            style={{ animationDuration: '8s' }}
          />
          <span>Rotate</span>
          <kbd className="hidden md:inline-block px-1 py-0.2 rounded bg-white/10 font-mono-data text-[9px] text-white/50">
            R
          </kbd>
        </button>
      </div>
    </nav>
  );
}
