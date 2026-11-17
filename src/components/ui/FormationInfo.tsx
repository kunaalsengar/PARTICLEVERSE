import { useParticleStore } from '../../store/useParticleStore';
import { FORMATIONS } from '../../constants/formations';
import { ChevronLeft, ChevronRight, Activity } from 'lucide-react';

export function FormationInfo() {
  const currentFormation = useParticleStore((s) => s.currentFormation);
  const setFormation = useParticleStore((s) => s.setFormation);
  const nextFormation = useParticleStore((s) => s.nextFormation);
  const prevFormation = useParticleStore((s) => s.prevFormation);
  const particleCount = useParticleStore((s) => s.particleCount);

  const currentIndex = FORMATIONS.findIndex((f) => f.id === currentFormation);
  const formation = FORMATIONS[currentIndex] || FORMATIONS[0];

  return (
    <aside
      aria-label="Active Formation Telemetry"
      className="fixed bottom-22 sm:bottom-28 left-4 right-4 sm:right-auto sm:left-8 z-40 max-w-sm pointer-events-none select-none transition-all duration-300"
    >
      <div className="glass-panel-elevated p-4 rounded-3xl pointer-events-auto border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.8)]">
        {/* Header & Arrows */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono-data text-[10px] font-semibold tracking-wider text-white/40">
              {String(currentIndex + 1).padStart(2, '0')} / {String(FORMATIONS.length).padStart(2, '0')}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-data uppercase bg-white/10 text-white/70 border border-white/5">
              {formation.category}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prevFormation}
              aria-label="Previous Formation"
              title="Previous Formation [←]"
              className="w-6 h-6 rounded-full glass-pill flex items-center justify-center text-white/50 hover:text-white transition cursor-pointer active:scale-95"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={nextFormation}
              aria-label="Next Formation"
              title="Next Formation [→]"
              className="w-6 h-6 rounded-full glass-pill flex items-center justify-center text-white/50 hover:text-white transition cursor-pointer active:scale-95"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">{formation.symbolGlyph}</span>
          <h2 className="text-base sm:text-lg font-heading font-bold text-white tracking-tight leading-tight">
            {formation.name}
          </h2>
        </div>

        {/* 3 Selectable Formation Buttons */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-white/10">
          {FORMATIONS.map((f) => {
            const isActive = currentFormation === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFormation(f.id)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 border ${
                  isActive
                    ? 'bg-white text-black font-semibold shadow-[0_0_12px_rgba(255,255,255,0.25)] border-white'
                    : 'glass-panel text-white/60 hover:text-white hover:bg-white/10 border-white/5'
                }`}
              >
                <span>{f.symbolGlyph}</span>
                <span className="truncate text-[11px]">{f.id === 'helix' ? 'Helix' : f.id === 'heart' ? 'Heart' : 'Butterfly'}</span>
              </button>
            );
          })}
        </div>

        {/* Particle Count Readout */}
        <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono-data text-white/40">
          <div className="flex items-center gap-1.5">
            <Activity size={11} className="text-cyan-400/80" />
            <span>{particleCount.toLocaleString()} points</span>
          </div>
          <span>GPU 60 FPS</span>
        </div>
      </div>
    </aside>
  );
}
