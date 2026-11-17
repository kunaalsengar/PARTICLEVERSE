import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null!);

  useFrame((state) => {
    // Subtle organic camera breathing motion
    const time = state.clock.getElapsedTime();
    state.camera.position.y += Math.sin(time * 0.4) * 0.0015;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.05}
      rotateSpeed={0.8}
      zoomSpeed={0.8}
      panSpeed={0.6}
      minDistance={3.0}
      maxDistance={25.0}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      }}
    />
  );
}
