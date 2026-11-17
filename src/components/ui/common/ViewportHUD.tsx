import { useParticleStore } from '../../../store/useParticleStore';

export function ViewportHUD() {
  const showUI = useParticleStore((s) => s.showUI);
  const activeTab = useParticleStore((s) => s.activeTab);
  const currentFormation = useParticleStore((s) => s.currentFormation);
  const physicsEnabled = useParticleStore((s) => s.physicsEnabled);
  const physicsMode = useParticleStore((s) => s.physicsMode);

  if (!showUI) return null;

  return (
    <div className="fixed inset-0 pointer-events-none select-none z-20 p-4 sm:p-6 flex flex-col justify-between">
      {/* Top Left HUD Metadata */}
      <div className="flex items-start justify-between">
        <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono-data text-white/30 tracking-widest uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80 animate-ping" />
          <span>VIEWPORT // INTERACTIVE 3D STAGE</span>
          <span className="text-white/15">•</span>
          <span>FOV: 45°</span>
          <span className="text-white/15">•</span>
          <span>DPR: {Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 2, 2).toFixed(1)}x</span>
        </div>

        {/* Top Right Technical Badges */}
        <div className="hidden lg:flex items-center gap-2 text-[10px] font-mono-data text-white/30 tracking-widest uppercase">
          <span>BLEND: ADDITIVE</span>
          <span className="text-white/15">•</span>
          <span>DRAW CALLS: 1</span>
          <span className="text-white/15">•</span>
          <span className={physicsEnabled ? 'text-emerald-400/80' : 'text-white/30'}>
            PHYSICS: {physicsEnabled ? physicsMode.toUpperCase() : 'OFF'}
          </span>
        </div>
      </div>

      {/* Bottom Subtle Coordinates / Active Formation Indicator */}
      <div className="flex items-end justify-between">
        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono-data text-white/25 tracking-widest uppercase">
          <span>TARGET ENTITY: {currentFormation.toUpperCase()}</span>
          <span className="text-white/15">•</span>
          <span>ACTIVE PANEL: {activeTab.toUpperCase()}</span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono-data text-white/25 tracking-widest uppercase">
          <span>SYSTEM // STABLE 60 FPS</span>
        </div>
      </div>
    </div>
  );
}
