import { useParticleStore } from '../../store/useParticleStore';
import { Eye, EyeOff, Maximize, Minimize, Sparkles, Sliders, Layers, Settings } from 'lucide-react';
import { useState } from 'react';

export function TopNav() {
  const activeTab = useParticleStore((s) => s.activeTab);
  const setActiveTab = useParticleStore((s) => s.setActiveTab);
  const showUI = useParticleStore((s) => s.showUI);
  const toggleUI = useParticleStore((s) => s.toggleUI);
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
    { id: 'explore', label: 'Explore', icon: Sparkles },
    { id: 'studio', label: 'Creator Studio', icon: Sliders },
    { id: 'presets', label: 'Presets', icon: Layers },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] as const;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 flex items-center justify-between pointer-events-none">
      {/* Brand Identity */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="flex items-center gap-2.5 glass-panel px-3.5 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all duration-300">
          <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#ffffff] animate-pulse" />
          <span className="font-heading font-semibold tracking-wider text-sm sm:text-base text-white/95">
            PARTICLEVERSE
          </span>
          <span className="text-[10px] font-mono-data px-1.5 py-0.5 rounded bg-white/10 text-white/60 uppercase tracking-widest hidden sm:inline-block">
            v0.1
          </span>
        </div>
      </div>

      {/* Center Navigation Tabs */}
      {showUI && (
        <nav className="hidden md:flex items-center gap-1 glass-panel px-2 py-1.5 rounded-full border border-white/10 pointer-events-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'glass-button-active text-white font-semibold'
                    : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                }`}
              >
                <Icon size={13} className={isActive ? 'text-white' : 'text-white/50'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Right Controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          className="glass-panel w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-all cursor-pointer"
        >
          {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
        </button>

        <button
          onClick={toggleUI}
          title={showUI ? 'Cinematic Mode (Hide UI)' : 'Show Interface'}
          className="glass-panel w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-all cursor-pointer"
        >
          {showUI ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>
    </header>
  );
}
