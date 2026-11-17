import { useEffect, useState } from 'react';
import { useParticleStore } from '../../store/useParticleStore';
import { MousePointer, Cpu } from 'lucide-react';

export function PerformanceStats() {
  const fps = useParticleStore((s) => s.fps);
  const setFPS = useParticleStore((s) => s.setFPS);
  const particleCount = useParticleStore((s) => s.particleCount);
  const [hintVisible, setHintVisible] = useState(true);

  // Measure actual rendering FPS
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measure = (now: number) => {
      frameCount++;
      if (now - lastTime >= 1000) {
        setFPS(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animationFrameId = requestAnimationFrame(measure);
    };

    animationFrameId = requestAnimationFrame(measure);

    // Fade out hint after 10 seconds
    const timer = setTimeout(() => {
      setHintVisible(false);
    }, 10000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer);
    };
  }, [setFPS]);

  return (
    <>
      {/* Top Right Performance Telemetry */}
      <div className="fixed top-4 right-4 sm:right-8 z-40 pointer-events-none select-none flex items-center gap-3">
        <div className="glass-panel px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10 text-[11px] font-mono-data text-white/70">
          <Cpu size={12} className="text-white/40" />
          <span className={fps < 30 ? 'text-amber-400' : 'text-emerald-400 font-semibold'}>{fps} FPS</span>
          <span className="text-white/20">|</span>
          <span>{particleCount >= 1000 ? `${(particleCount / 1000).toFixed(0)}K` : particleCount} pts</span>
        </div>
      </div>

      {/* Interaction Hint Overlay */}
      {hintVisible && (
        <div className="fixed bottom-24 right-4 sm:right-8 z-30 pointer-events-none select-none transition-opacity duration-700">
          <div className="glass-panel px-3.5 py-2 rounded-xl flex items-center gap-2.5 border border-white/10 text-xs text-white/60">
            <MousePointer size={13} className="text-white/40 shrink-0" />
            <span>Drag to rotate • Scroll to zoom • Move cursor to repel</span>
          </div>
        </div>
      )}
    </>
  );
}
