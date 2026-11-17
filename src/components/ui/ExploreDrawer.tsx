import { useParticleStore } from '../../store/useParticleStore';
import { FORMATIONS } from '../../constants/formations';
import { FormationType, MorphStyle } from '../../types';
import { Sparkles, X, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export function ExploreDrawer() {
  const activeTab = useParticleStore((s) => s.activeTab);
  const setActiveTab = useParticleStore((s) => s.setActiveTab);
  const currentFormation = useParticleStore((s) => s.currentFormation);
  const setFormation = useParticleStore((s) => s.setFormation);
  const nextFormation = useParticleStore((s) => s.nextFormation);
  const prevFormation = useParticleStore((s) => s.prevFormation);
  const morphStyle = useParticleStore((s) => s.morphStyle);
  const setMorphStyle = useParticleStore((s) => s.setMorphStyle);
  const morphDuration = useParticleStore((s) => s.morphDuration);
  const updateConfig = useParticleStore((s) => s.updateConfig);

  const morphStyles: { id: MorphStyle; label: string; icon: string }[] = [
    { id: 'smooth', label: 'Smooth', icon: '⚡' },
    { id: 'spiral', label: 'Spiral', icon: '🌀' },
    { id: 'explosive', label: 'Explosion', icon: '💥' },
    { id: 'wave', label: 'Wave', icon: '🌊' },
    { id: 'dissolve', label: 'Dissolve', icon: '🌫️' }
  ];

  if (activeTab !== 'formation') return null;

  const currentIdx = FORMATIONS.findIndex((f) => f.id === currentFormation);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setActiveTab('none')}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
      />

      {/* Modal Dialog */}
      <div className="glass-panel-elevated w-full max-w-2xl rounded-3xl p-6 sm:p-7 flex flex-col relative z-10 pointer-events-auto border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500/15 flex items-center justify-center border border-cyan-500/30">
              <Sparkles className="text-cyan-300" size={16} />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-base sm:text-lg text-white leading-tight">
                Formation Engine
              </h3>
              <p className="text-[11px] font-mono-data text-white/50">
                {FORMATIONS.length} Parametric Entities
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Prev / Next Formation Navigation */}
            <div className="flex items-center glass-panel rounded-full border border-white/10 px-1 py-0.5">
              <button
                onClick={prevFormation}
                title="Previous Formation (←)"
                className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="font-mono-data text-[10px] text-white/70 px-1.5">
                {String(currentIdx + 1).padStart(2, '0')}/{String(FORMATIONS.length).padStart(2, '0')}
              </span>
              <button
                onClick={nextFormation}
                title="Next Formation (→)"
                className="p-1 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <ChevronRight size={15} />
              </button>
            </div>

            <button
              onClick={() => setActiveTab('none')}
              className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-white/50 hover:text-white transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 3 Selectable Formations Cards */}
        <div className="pt-4 pb-2">
          <div className="text-[10px] font-mono-data uppercase tracking-wider text-white/40 mb-2">
            Selectable Mathematical Models:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {FORMATIONS.map((form) => {
              const isSelected = currentFormation === form.id;
              return (
                <button
                  key={form.id}
                  onClick={() => setFormation(form.id as FormationType)}
                  className={`p-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white/15 border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                      : 'glass-panel border-white/5 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xl">{form.symbolGlyph}</span>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[10px] font-mono-data text-cyan-300 font-semibold">
                          <Check size={12} /> Active
                        </span>
                      )}
                    </div>
                    <h4 className="font-heading font-semibold text-xs sm:text-sm text-white mb-0.5">
                      {form.name}
                    </h4>
                    <p className="text-[11px] text-white/40 font-medium mb-1 line-clamp-1">
                      {form.tagline}
                    </p>
                  </div>
                  <div className="pt-2 mt-2 border-t border-white/5 text-[10px] font-mono-data text-white/40 flex items-center justify-between">
                    <span>{(form.particleCountRecommended / 1000).toFixed(0)}K pts</span>
                    <span className="capitalize">{form.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Morph Transition Style & Duration */}
        <div className="pt-4 pb-2 space-y-3 shrink-0 border-t border-white/5 mt-2">
          <div>
            <div className="text-[10px] font-mono-data uppercase tracking-wider text-white/40 mb-2">
              3D GPU Morph Transition Style:
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {morphStyles.map((style) => {
                const isSelected = morphStyle === style.id;
                return (
                  <button
                    key={style.id}
                    onClick={() => setMorphStyle(style.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-white text-black border-white font-semibold shadow-[0_0_12px_rgba(255,255,255,0.25)]'
                        : 'glass-panel text-white/60 border-white/5 hover:text-white hover:border-white/20'
                    }`}
                  >
                    <span>{style.icon}</span>
                    <span>{style.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Morph Duration Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-white/70">Morph Interpolation Duration</span>
              <span className="font-mono-data text-white/50">{morphDuration.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.5"
              step="0.1"
              value={morphDuration}
              onChange={(e) => updateConfig({ morphDuration: Number(e.target.value) })}
              className="w-full accent-white bg-white/10 rounded-lg h-1.5 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
