import { useParticleStore } from '../../store/useParticleStore';
import { Settings, X, Keyboard, ShieldCheck } from 'lucide-react';

export function SettingsDrawer() {
  const activeTab = useParticleStore((s) => s.activeTab);
  const setActiveTab = useParticleStore((s) => s.setActiveTab);

  if (activeTab !== 'settings') return null;

  const shortcuts = [
    { key: 'Space', desc: 'Toggle Play / Pause simulation' },
    { key: '← / →', desc: 'Previous / Next formation' },
    { key: 'H', desc: 'Toggle Minimal UI (Cinematic mode)' },
    { key: 'R', desc: 'Toggle 3D Orbit Auto-Rotation' },
    { key: 'C', desc: 'Toggle Automatic Morph Cycle' },
    { key: 'Esc', desc: 'Close dialogs & drawers' }
  ];

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      <div
        onClick={() => setActiveTab('explore')}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
      />

      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 flex flex-col relative z-10 pointer-events-auto border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <Settings className="text-white/80" size={18} />
            <h3 className="font-heading font-semibold text-lg text-white">Engine Settings</h3>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="w-8 h-8 rounded-full glass-panel flex items-center justify-center text-white/50 hover:text-white transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 pt-5">
          {/* Keyboard Shortcuts */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-white/80 uppercase tracking-wider mb-3">
              <Keyboard size={14} className="text-white/50" />
              <span>Keyboard Controls</span>
            </div>
            <div className="space-y-2">
              {shortcuts.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-white/[0.03] border border-white/5"
                >
                  <span className="text-white/60">{s.desc}</span>
                  <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono-data text-[11px] text-white/90 border border-white/10">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Engine Architecture Information */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-2 text-xs font-semibold text-white/80 mb-1">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>GPU Accelerated Architecture</span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              Rendering powered by Three.js `THREE.Points` with single-buffer geometry and custom GLSL vertex/fragment shaders. Zero per-particle React DOM overhead.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
