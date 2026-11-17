import { useParticleStore } from '../../store/useParticleStore';
import { Play, Pause, SkipBack, SkipForward, RefreshCw, Compass } from 'lucide-react';
import { useEffect } from 'react';

export function ControlBar() {
  const isPlaying = useParticleStore((s) => s.isPlaying);
  const togglePlay = useParticleStore((s) => s.togglePlay);
  const nextFormation = useParticleStore((s) => s.nextFormation);
  const prevFormation = useParticleStore((s) => s.prevFormation);
  const autoRotate = useParticleStore((s) => s.autoRotate);
  const toggleAutoRotate = useParticleStore((s) => s.toggleAutoRotate);
  const autoCycle = useParticleStore((s) => s.autoCycleFormations);
  const toggleAutoCycle = useParticleStore((s) => s.toggleAutoCycle);
  const autoCycleInterval = useParticleStore((s) => s.autoCycleInterval);

  // Auto-cycle effect
  useEffect(() => {
    if (!autoCycle || !isPlaying) return;

    const interval = setInterval(() => {
      nextFormation();
    }, autoCycleInterval * 1000);

    return () => clearInterval(interval);
  }, [autoCycle, isPlaying, autoCycleInterval, nextFormation]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
      <div className="glass-panel px-3 sm:px-4 py-2 sm:py-2.5 rounded-full flex items-center gap-2 sm:gap-3 pointer-events-auto border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.8)]">
        {/* Previous Formation */}
        <button
          onClick={prevFormation}
          aria-label="Previous Formation"
          className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition cursor-pointer"
          title="Previous Formation (Left Arrow)"
        >
          <SkipBack size={16} />
        </button>

        {/* Play / Pause Toggle */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
          className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/90 active:scale-95 transition shadow-[0_0_20px_rgba(255,255,255,0.4)] cursor-pointer"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
        </button>

        {/* Next Formation */}
        <button
          onClick={nextFormation}
          aria-label="Next Formation"
          className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 active:scale-95 transition cursor-pointer"
          title="Next Formation (Right Arrow)"
        >
          <SkipForward size={16} />
        </button>

        <div className="w-[1px] h-5 bg-white/15 mx-1" />

        {/* Auto Rotate Toggle */}
        <button
          onClick={toggleAutoRotate}
          aria-label="Toggle Auto Rotation"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
            autoRotate
              ? 'glass-button-active text-white'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          title="Toggle 3D Orbit Auto-Rotation"
        >
          <Compass size={14} className={autoRotate ? 'animate-spin' : ''} style={{ animationDuration: '8s' }} />
          <span className="hidden sm:inline">Rotate</span>
        </button>

        {/* Auto Cycle Formations Toggle */}
        <button
          onClick={toggleAutoCycle}
          aria-label="Toggle Auto Cycle"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
            autoCycle
              ? 'glass-button-active text-white font-semibold'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
          title="Toggle Automatic Morph Cycle"
        >
          <RefreshCw size={13} className={autoCycle ? 'animate-spin' : ''} style={{ animationDuration: '4s' }} />
          <span className="hidden sm:inline">Auto-Cycle</span>
        </button>
      </div>
    </div>
  );
}
