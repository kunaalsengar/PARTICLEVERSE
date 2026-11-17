import { useEffect, useState } from 'react';
import { useParticleStore } from '../../store/useParticleStore';
import { MousePointer } from 'lucide-react';

export function PerformanceStats() {
  const setFPS = useParticleStore((s) => s.setFPS);
  const showUI = useParticleStore((s) => s.showUI);
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

  if (!showUI || !hintVisible) return null;

  return (
    <div className="hidden sm:block fixed bottom-24 right-4 sm:right-8 z-30 pointer-events-none select-none transition-opacity duration-700">
      <div className="glass-panel px-3.5 py-2 rounded-xl flex items-center gap-2.5 border border-white/10 text-xs text-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
        <MousePointer size={13} className="text-cyan-400 shrink-0" />
        <span className="font-mono-data text-[11px] tracking-wide">
          DRAG TO ORBIT • SCROLL TO ZOOM • POINTER REVEALS COLOR
        </span>
      </div>
    </div>
  );
}
