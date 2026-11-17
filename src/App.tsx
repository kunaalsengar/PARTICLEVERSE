import { useEffect } from 'react';
import { useParticleStore } from './store/useParticleStore';
import { ParticleCanvas } from './components/canvas/ParticleCanvas';
import { TopNav } from './components/ui/TopNav';
import { FormationInfo } from './components/ui/FormationInfo';
import { ControlBar } from './components/ui/ControlBar';
import { PerformanceStats } from './components/ui/PerformanceStats';
import { ExploreDrawer } from './components/ui/ExploreDrawer';
import { StudioDrawer } from './components/ui/StudioDrawer';
import { PresetsDrawer } from './components/ui/PresetsDrawer';
import { SettingsDrawer } from './components/ui/SettingsDrawer';

export function App() {
  const showUI = useParticleStore((s) => s.showUI);
  const togglePlay = useParticleStore((s) => s.togglePlay);
  const nextFormation = useParticleStore((s) => s.nextFormation);
  const prevFormation = useParticleStore((s) => s.prevFormation);
  const toggleAutoRotate = useParticleStore((s) => s.toggleAutoRotate);
  const toggleAutoCycle = useParticleStore((s) => s.toggleAutoCycle);
  const toggleUI = useParticleStore((s) => s.toggleUI);
  const setActiveTab = useParticleStore((s) => s.setActiveTab);
  const activeTab = useParticleStore((s) => s.activeTab);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextFormation();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevFormation();
          break;
        case 'KeyH':
          toggleUI();
          break;
        case 'KeyR':
          toggleAutoRotate();
          break;
        case 'KeyC':
          toggleAutoCycle();
          break;
        case 'Escape':
          if (activeTab !== 'explore') {
            setActiveTab('explore');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, nextFormation, prevFormation, toggleUI, toggleAutoRotate, toggleAutoCycle, activeTab, setActiveTab]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-white select-none">
      {/* 3D Generative Particle Universe */}
      <ParticleCanvas />

      {/* Interface Layer */}
      <TopNav />
      
      {showUI && (
        <>
          <FormationInfo />
          <ControlBar />
          <PerformanceStats />
          <ExploreDrawer />
          <StudioDrawer />
          <PresetsDrawer />
          <SettingsDrawer />
        </>
      )}
    </div>
  );
}

export default App;
