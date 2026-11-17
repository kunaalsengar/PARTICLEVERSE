import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useParticleStore } from '../../store/useParticleStore';
import { ColorEngine } from '../../engine/ColorEngine';

export function ShockwaveRing() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const explosionTriggerCount = useParticleStore((s) => s.explosionTriggerCount);
  const currentPalette = useParticleStore((s) => s.currentPalette);
  const explosionIntensity = useParticleStore((s) => s.explosionIntensity);

  const prevTriggerRef = useRef(explosionTriggerCount);
  const ringScale = useRef({ value: 0 });
  const ringOpacity = useRef({ value: 0 });

  useEffect(() => {
    if (explosionTriggerCount > prevTriggerRef.current) {
      prevTriggerRef.current = explosionTriggerCount;

      ringScale.current.value = 0.1;
      ringOpacity.current.value = 1.0;

      gsap.to(ringScale.current, {
        value: 12.0 * (explosionIntensity / 5.0),
        duration: 1.4,
        ease: 'power2.out'
      });

      gsap.to(ringOpacity.current, {
        value: 0.0,
        duration: 1.4,
        ease: 'power3.in'
      });
    }
  }, [explosionTriggerCount, explosionIntensity]);

  useFrame(() => {
    if (!meshRef.current || !materialRef.current) return;
    const scale = ringScale.current.value;
    meshRef.current.scale.set(scale, scale, scale);
    materialRef.current.uniforms.uOpacity.value = ringOpacity.current.value;
  });

  const palette = ColorEngine.getPalette(currentPalette);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.92, 1.0, 64]} />
      <shaderMaterial
        ref={materialRef}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uColor: { value: new THREE.Color(palette.primary) },
          uOpacity: { value: 0.0 }
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uOpacity;
          varying vec2 vUv;
          void main() {
            if (uOpacity <= 0.001) discard;
            float alpha = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x);
            gl_FragColor = vec4(uColor * 2.0, uOpacity * 0.7);
          }
        `}
      />
    </mesh>
  );
}
