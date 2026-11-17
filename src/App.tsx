import { useEffect } from 'react';
import { useParticleStore } from './store/useParticleStore';
import { ParticleCanvas } from './components/canvas/ParticleCanvas';
import { TopNav } from './components/ui/TopNav';
import { ViewportHUD } from './components/ui/common/ViewportHUD';
import { FormationInfo } from './components/ui/FormationInfo';
import { ControlBar } from './components/ui/ControlBar';
import { PerformanceStats } from './components/ui/PerformanceStats';
import { ExploreDrawer } from './components/ui/ExploreDrawer';
import { PhysicsDrawer } from './components/ui/PhysicsDrawer';
import { StudioDrawer } from './components/ui/StudioDrawer';
import { PhysicsMode, MorphStyle } from './types';

export function App() {
  const showUI = useParticleStore((s) => s.showUI);
  const togglePlay = useParticleStore((s) => s.togglePlay);
  const nextFormation = useParticleStore((s) => s.nextFormation);
  const prevFormation = useParticleStore((s) => s.prevFormation);
  const toggleAutoRotate = useParticleStore((s) => s.toggleAutoRotate);
  const toggleUI = useParticleStore((s) => s.toggleUI);
  const setActiveTab = useParticleStore((s) => s.setActiveTab);
  const activeTab = useParticleStore((s) => s.activeTab);
  const triggerExplosion = useParticleStore((s) => s.triggerExplosion);
  const physicsMode = useParticleStore((s) => s.physicsMode);
  const setPhysicsMode = useParticleStore((s) => s.setPhysicsMode);
  const morphStyle = useParticleStore((s) => s.morphStyle);
  const setMorphStyle = useParticleStore((s) => s.setMorphStyle);

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
        case 'KeyB':
          triggerExplosion();
          break;
        case 'KeyP':
          setActiveTab(activeTab === 'physics' ? 'none' : 'physics');
          break;
        case 'KeyF':
          setActiveTab(activeTab === 'formation' ? 'none' : 'formation');
          break;
        case 'KeyE':
          setActiveTab(activeTab === 'particle' ? 'none' : 'particle');
          break;
        case 'KeyM': {
          const modes: PhysicsMode[] = ['repulsion', 'attraction', 'vortex', 'hybrid'];
          const nextIdx = (modes.indexOf(physicsMode) + 1) % modes.length;
          setPhysicsMode(modes[nextIdx]);
          break;
        }
        case 'KeyT': {
          const styles: MorphStyle[] = ['smooth', 'spiral', 'explosive', 'wave', 'dissolve'];
          const nextStyleIdx = (styles.indexOf(morphStyle) + 1) % styles.length;
          setMorphStyle(styles[nextStyleIdx]);
          break;
        }
        case 'Escape':
          if (activeTab !== 'none') {
            setActiveTab('none');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    togglePlay,
    nextFormation,
    prevFormation,
    toggleUI,
    toggleAutoRotate,
    triggerExplosion,
    activeTab,
    setActiveTab,
    physicsMode,
    setPhysicsMode,
    morphStyle,
    setMorphStyle
  ]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050508] text-white select-none">
      {/* 3D Generative Particle Universe Canvas with Physics & Proximity Color Reveal */}
      <ParticleCanvas />

      {/* Viewport Sci-Fi HUD Overlays */}
      <ViewportHUD />

      {/* Interface Layer — Top Navigation */}
      <TopNav />
      
      {showUI && (
        <>
          {/* Active Formation Telemetry & Quick Select */}
          <FormationInfo />

          {/* Simulation Playback & Detonate Dock */}
          <ControlBar />

          {/* Interaction Guide */}
          <PerformanceStats />

          {/* Three Primary Engine Sections */}
          <ExploreDrawer />
          <PhysicsDrawer />
          <StudioDrawer />
        </>
      )}
    </div>
  );
}

export default App;
