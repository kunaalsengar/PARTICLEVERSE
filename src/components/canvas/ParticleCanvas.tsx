import { Canvas } from '@react-three/fiber';
import { ParticleMesh } from './ParticleMesh';
import { CameraRig } from './CameraRig';

export function ParticleCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 45, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#000000']} />
        
        {/* Subtle ambient lighting */}
        <ambientLight intensity={0.5} />
        
        {/* Interactive Particle Mesh */}
        <ParticleMesh />

        {/* Cinematic Camera Rig & Orbit Controls */}
        <CameraRig />
      </Canvas>
    </div>
  );
}
