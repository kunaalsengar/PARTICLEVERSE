import { useParticleStore } from '../../store/useParticleStore';
import { FORMATIONS } from '../../constants/formations';
import { COLOR_PALETTES } from '../../constants/palettes';
import { ChevronLeft, ChevronRight, Activity, Palette } from 'lucide-react';

export function FormationInfo() {
  const currentFormation = useParticleStore((s) => s.currentFormation);
  const nextFormation = useParticleStore((s) => s.nextFormation);
  const prevFormation = useParticleStore((s) => s.prevFormation);
  const particleCount = useParticleStore((s) => s.particleCount);
  const currentPalette = useParticleStore((s) => s.currentPalette);
  const setPalette = useParticleStore((s) => s.setPalette);

  const currentIndex = FORMATIONS.findIndex((f) => f.id === currentFormation);
  const formation = FORMATIONS[currentIndex] || FORMATIONS[0];

  return (
    <div className="fixed bottom-24 sm:bottom-28 left-4 sm:left-8 z-40 max-w-sm pointer-events-none select-none">
      <div className="glass-panel p-5 rounded-2xl pointer-events-auto border border-white/10 transition-all duration-300">
        {/* Formation Meta Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono-data text-[11px] font-semibold tracking-wider text-white/40">
              {String(currentIndex + 1).padStart(2, '0')} / {String(FORMATIONS.length).padStart(2, '0')}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono-data tracking-wider uppercase bg-white/10 text-white/80 border border-white/5">
              {formation.category}
            </span>
          </div>

          {/* Quick prev/next mini arrows */}
          <div className="flex items-center gap-1">
            <button
              onClick={prevFormation}
              aria-label="Previous Formation"
              className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextFormation}
              aria-label="Next Formation"
              className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-heading font-bold text-white tracking-tight leading-tight mb-1">
          {formation.name}
        </h2>

        {/* Subtitle / Tagline */}
        <p className="text-xs font-medium text-white/50 mb-3 tracking-wide">
          {formation.tagline}
        </p>

        {/* Description */}
        <p className="text-xs text-white/70 leading-relaxed font-sans mb-4">
          {formation.description}
        </p>

        {/* Live telemetry row */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] font-mono-data text-white/60">
            <Activity size={12} className="text-white/40" />
            <span>{particleCount.toLocaleString()} particles</span>
          </div>

          {/* Palette selector pills */}
          <div className="flex items-center gap-1.5">
            <Palette size={11} className="text-white/40 mr-1 hidden sm:inline-block" />
            {COLOR_PALETTES.map((pal) => (
              <button
                key={pal.id}
                onClick={() => setPalette(pal.id)}
                title={pal.name}
                className={`w-3.5 h-3.5 rounded-full border transition-transform cursor-pointer ${
                  currentPalette === pal.id
                    ? 'scale-125 border-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                    : 'border-white/20 hover:scale-110 opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: pal.primary }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
