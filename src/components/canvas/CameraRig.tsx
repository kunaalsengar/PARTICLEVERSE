import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null!);
  const { camera, size } = useThree();
  const prevSize = useRef({ width: 0, height: 0 });

  // Responsive camera framing: ensures 4.0-unit formation occupies ~60% of smaller dimension
  useEffect(() => {
    if (size.width === prevSize.current.width && size.height === prevSize.current.height) return;
    prevSize.current = { width: size.width, height: size.height };

    const aspect = size.width / Math.max(1, size.height);
    const minAspect = Math.min(1.0, aspect);
    // Formula: targetSize / (0.60 * 2 * tan(22.5 deg) * minAspect) = 4.0 / (0.497 * minAspect) ≈ 8.05 / minAspect
    const targetZ = 8.05 / minAspect;

    camera.position.set(0, 0, targetZ);
    camera.lookAt(0, 0, 0);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [size.width, size.height, camera]);

  useFrame((state) => {
    // Subtle organic camera breathing motion
    const time = state.clock.getElapsedTime();
    state.camera.position.y += Math.sin(time * 0.4) * 0.001;
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
      maxDistance={35.0}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
      }}
    />
  );
}
