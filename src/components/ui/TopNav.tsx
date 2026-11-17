import { useParticleStore } from '../../store/useParticleStore';
import {
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  Sliders,
  Atom,
  Sparkles,
  Activity
} from 'lucide-react';
import { useState } from 'react';

export function TopNav() {
  const activeTab = useParticleStore((s) => s.activeTab);
  const setActiveTab = useParticleStore((s) => s.setActiveTab);
  const showUI = useParticleStore((s) => s.showUI);
  const toggleUI = useParticleStore((s) => s.toggleUI);
  const physicsEnabled = useParticleStore((s) => s.physicsEnabled);
  const fps = useParticleStore((s) => s.fps);
  const particleCount = useParticleStore((s) => s.particleCount);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Exit fullscreen failed:', err);
      });
      setIsFullscreen(false);
    }
  };

  const navItems = [
    { id: 'particle', label: 'Particle Engine', icon: Sliders },
    { id: 'physics', label: 'Physics Engine', icon: Atom },
    { id: 'formation', label: 'Formation Engine', icon: Sparkles }
  ] as const;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3.5 flex items-center justify-between pointer-events-none select-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-2 glass-panel px-2.5 sm:px-3.5 py-1.5 rounded-full border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00F0FF] animate-pulse" />
          <span className="font-heading font-bold tracking-wider text-xs sm:text-sm text-white">
            PARTICLEVERSE
          </span>
        </div>
      </div>

      {/* Center Navigation Tabs — Exactly 3 Primary Sections */}
      {showUI && (
        <nav
          aria-label="Engine Navigation Tabs"
          className="flex items-center gap-1 glass-panel px-1.5 py-1 rounded-full border border-white/10 pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(activeTab === item.id ? 'none' : item.id)}
                title={item.label}
                className={`relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'glass-button-active text-white font-semibold shadow-[0_0_16px_rgba(255,255,255,0.2)]'
                    : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                }`}
              >
                <Icon
                  size={13}
                  className={`${isActive ? 'text-white' : 'text-white/50'} ${
                    item.id === 'physics' && physicsEnabled ? 'text-emerald-400' : ''
                  }`}
                />
                <span className="hidden sm:inline">{item.label}</span>
                {item.id === 'physics' && physicsEnabled && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#2dd4bf]" />
                )}
              </button>
            );
          })}
        </nav>
      )}

      {/* Right Controls & Telemetry Readout */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Live Hardware Telemetry Pill */}
        <div className="glass-panel px-3 py-1.5 rounded-full hidden sm:flex items-center gap-2 border border-white/10 text-[11px] font-mono-data text-white/70 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
          <Activity size={12} className="text-white/40" />
          <span
            className={
              fps < 30
                ? 'text-amber-400 font-semibold'
                : 'text-emerald-400 font-semibold'
            }
          >
            {fps} FPS
          </span>
          <span className="text-white/20">|</span>
          <span className="text-white/60">
            {particleCount >= 1000
              ? `${(particleCount / 1000).toFixed(0)}K`
              : particleCount}{' '}
            PTS
          </span>
        </div>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          className="glass-panel w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-all cursor-pointer active:scale-95"
        >
          {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
        </button>

        {/* Minimal / Cinematic UI Toggle */}
        <button
          onClick={toggleUI}
          title={showUI ? 'Cinematic Mode (Hide UI) [Key: H]' : 'Show Interface [Key: H]'}
          className={`glass-panel w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
            !showUI
              ? 'border-cyan-400/40 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]'
              : 'text-white/70 hover:text-white hover:border-white/30'
          }`}
        >
          {showUI ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>
    </header>
  );
}
