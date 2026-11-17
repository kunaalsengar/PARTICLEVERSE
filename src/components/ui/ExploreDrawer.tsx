import { useParticleStore } from '../../store/useParticleStore';
import { FORMATIONS } from '../../constants/formations';
import { FormationType } from '../../types';
import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export function ExploreDrawer() {
  const activeTab = useParticleStore((s) => s.activeTab);
  const setActiveTab = useParticleStore((s) => s.setActiveTab);
  const currentFormation = useParticleStore((s) => s.currentFormation);
  const setFormation = useParticleStore((s) => s.setFormation);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (activeTab !== 'explore') return null;

  const categories = [
    { id: 'all', label: 'All Formations' },
    { id: 'organism', label: 'Organisms' },
    { id: 'symbol', label: 'Symbols' },
    { id: 'geometric', label: 'Geometric' },
    { id: 'cosmic', label: 'Cosmic' }
  ];

  const filteredFormations =
    selectedCategory === 'all'
      ? FORMATIONS
      : FORMATIONS.filter((f) => f.category === selectedCategory);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setActiveTab('explore')}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
      />

      {/* Modal Dialog */}
      <div className="glass-panel w-full max-w-2xl max-h-[85vh] rounded-3xl p-6 sm:p-8 flex flex-col relative z-10 pointer-events-auto border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <Sparkles className="text-white/80" size={18} />
            <h3 className="font-heading font-semibold text-lg text-white">Formation Library</h3>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-white/50 hover:text-white transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 py-4 overflow-x-auto shrink-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide transition cursor-pointer shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-white text-black font-semibold'
                  : 'glass-panel text-white/60 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Formation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1">
          {filteredFormations.map((form) => {
            const isSelected = currentFormation === form.id;
            return (
              <button
                key={form.id}
                onClick={() => {
                  setFormation(form.id as FormationType);
                }}
                className={`p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer border ${
                  isSelected
                    ? 'bg-white/15 border-white/40 shadow-[0_0_24px_rgba(255,255,255,0.1)]'
                    : 'glass-panel border-white/5 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono-data text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                    {form.category}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff]" />
                  )}
                </div>
                <h4 className="font-heading font-semibold text-sm text-white mb-1">
                  {form.name}
                </h4>
                <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                  {form.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
