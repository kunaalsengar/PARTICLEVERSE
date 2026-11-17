import { Canvas } from '@react-three/fiber';
import { ParticleMesh } from './ParticleMesh';
import { CameraRig } from './CameraRig';
import { ShockwaveRing } from './ShockwaveRing';

export function ParticleCanvas() {
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#050508] overflow-hidden pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, isMobile ? 17.5 : 8.05], fov: 45, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#050508']} />
        
        {/* Subtle ambient lighting */}
        <ambientLight intensity={0.5} />
        
        {/* Interactive Particle Mesh with Physics & Connections */}
        <ParticleMesh />

        {/* Cinematic Shockwave Ring for Explosions */}
        <ShockwaveRing />

        {/* Cinematic Camera Rig & Orbit Controls */}
        <CameraRig />
      </Canvas>
    </div>
  );
}
