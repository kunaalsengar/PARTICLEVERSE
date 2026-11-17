import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useParticleStore } from '../../store/useParticleStore';
import { FormationEngine } from '../../engine/FormationEngine';
import { ColorEngine } from '../../engine/ColorEngine';
import { particleVertexShader, particleFragmentShader } from '../../shaders/particleShaders';

export function ParticleMesh() {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { viewport } = useThree();

  const particleCount = useParticleStore((s) => s.particleCount);
  const particleSize = useParticleStore((s) => s.particleSize);
  const movementSpeed = useParticleStore((s) => s.movementSpeed);
  const organicNoiseScale = useParticleStore((s) => s.organicNoiseScale);
  const organicNoiseSpeed = useParticleStore((s) => s.organicNoiseSpeed);
  const glow = useParticleStore((s) => s.glow);
  const attractionForce = useParticleStore((s) => s.attractionForce);
  const repulsionForce = useParticleStore((s) => s.repulsionForce);
  const mouseRadius = useParticleStore((s) => s.mouseInteractionRadius);
  const currentFormation = useParticleStore((s) => s.currentFormation);
  const currentPalette = useParticleStore((s) => s.currentPalette);
  const customColors = useParticleStore((s) => s.customColors);
  const isPlaying = useParticleStore((s) => s.isPlaying);
  const autoRotate = useParticleStore((s) => s.autoRotate);
  const rotationSpeed = useParticleStore((s) => s.rotationSpeed);
  const morphDuration = useParticleStore((s) => s.morphDuration);

  // Mouse vector in 3D world space
  const mouse3D = useRef(new THREE.Vector3(9999, 9999, 9999));
  const prevFormationRef = useRef(currentFormation);
  const morphTimelineRef = useRef<gsap.core.Tween | null>(null);

  // Base random attributes per particle
  const [randomVecs, sizeOffsets] = useMemo(() => {
    const rVecs = new Float32Array(particleCount * 3);
    const sOffsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      rVecs[i * 3] = (Math.random() - 0.5) * 2;
      rVecs[i * 3 + 1] = (Math.random() - 0.5) * 2;
      rVecs[i * 3 + 2] = (Math.random() - 0.5) * 2;
      sOffsets[i] = 0.5 + Math.random() * 1.0;
    }
    return [rVecs, sOffsets];
  }, [particleCount]);

  // Initial positions
  const initialPositions = useMemo(() => {
    return FormationEngine.generatePositions(currentFormation, particleCount);
  }, [particleCount]);

  // Initial colors
  const initialColors = useMemo(() => {
    return ColorEngine.generateColors(currentPalette, particleCount, initialPositions, customColors);
  }, [particleCount, currentPalette, customColors, initialPositions]);

  // Custom Shader Uniforms
  const uniforms = useMemo(() => {
    const palette = ColorEngine.getPalette(currentPalette);
    return {
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uBaseSize: { value: particleSize },
      uMovementSpeed: { value: movementSpeed },
      uNoiseScale: { value: organicNoiseScale },
      uNoiseSpeed: { value: organicNoiseSpeed },
      uMouse: { value: new THREE.Vector3(9999, 9999, 9999) },
      uMouseRadius: { value: mouseRadius },
      uRepulsionStrength: { value: repulsionForce },
      uAttractionStrength: { value: attractionForce },
      uMorphProgress: { value: 0.0 },
      uGlow: { value: glow },
      uAmbientGlowColor: { value: new THREE.Color(palette.ambientGlow) }
    };
  }, []);

  // Update uniforms when configuration changes
  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uBaseSize.value = particleSize;
    materialRef.current.uniforms.uMovementSpeed.value = movementSpeed;
    materialRef.current.uniforms.uNoiseScale.value = organicNoiseScale;
    materialRef.current.uniforms.uNoiseSpeed.value = organicNoiseSpeed;
    materialRef.current.uniforms.uGlow.value = glow;
    materialRef.current.uniforms.uMouseRadius.value = mouseRadius;
    materialRef.current.uniforms.uRepulsionStrength.value = repulsionForce;
    materialRef.current.uniforms.uAttractionStrength.value = attractionForce;
  }, [particleSize, movementSpeed, organicNoiseScale, organicNoiseSpeed, glow, mouseRadius, repulsionForce, attractionForce]);

  // Update colors when palette changes
  useEffect(() => {
    if (!pointsRef.current) return;
    const geometry = pointsRef.current.geometry;
    const currentPos = geometry.attributes.position.array as Float32Array;
    const newColors = ColorEngine.generateColors(currentPalette, particleCount, currentPos, customColors);
    
    geometry.setAttribute('aColor', new THREE.BufferAttribute(newColors, 3));
    geometry.attributes.aColor.needsUpdate = true;

    const palette = ColorEngine.getPalette(currentPalette);
    if (materialRef.current) {
      materialRef.current.uniforms.uAmbientGlowColor.value.set(palette.ambientGlow);
    }
  }, [currentPalette, customColors, particleCount]);

  // Handle Morphing when formation changes
  useEffect(() => {
    if (!pointsRef.current || !materialRef.current) return;
    if (prevFormationRef.current === currentFormation) return;

    prevFormationRef.current = currentFormation;

    const geometry = pointsRef.current.geometry;
    const targetPositions = FormationEngine.generatePositions(currentFormation, particleCount);
    
    // Set target positions attribute
    geometry.setAttribute('aTargetPosition', new THREE.BufferAttribute(targetPositions, 3));
    geometry.attributes.aTargetPosition.needsUpdate = true;

    // Reset morph progress and animate with GSAP
    if (morphTimelineRef.current) {
      morphTimelineRef.current.kill();
    }

    materialRef.current.uniforms.uMorphProgress.value = 0.0;

    morphTimelineRef.current = gsap.to(materialRef.current.uniforms.uMorphProgress, {
      value: 1.0,
      duration: morphDuration,
      ease: 'power3.inOut',
      onComplete: () => {
        // Once morph completes, update base positions to target positions and reset progress
        const posAttr = geometry.attributes.position as THREE.BufferAttribute;
        (posAttr.array as Float32Array).set(targetPositions);
        posAttr.needsUpdate = true;
        materialRef.current.uniforms.uMorphProgress.value = 0.0;
      }
    });
  }, [currentFormation, particleCount, morphDuration]);

  // Mouse interaction listener in 3D
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      // Normalize mouse to [-1, 1]
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;

      // Unproject to z=0 plane in 3D
      mouse3D.current.set(nx * (viewport.width / 2), ny * (viewport.height / 2), 0);
    };

    const handlePointerLeave = () => {
      mouse3D.current.set(9999, 9999, 9999);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [viewport]);

  // Per-frame animation tick
  useFrame((_, delta) => {
    if (!materialRef.current || !pointsRef.current) return;

    if (isPlaying) {
      materialRef.current.uniforms.uTime.value += delta;
    }

    // Smoothly interpolate mouse uniform
    materialRef.current.uniforms.uMouse.value.lerp(mouse3D.current, 0.12);

    // Autonomous or user-controlled rotation
    if (autoRotate && isPlaying) {
      pointsRef.current.rotation.y += delta * rotationSpeed * 0.4;
      pointsRef.current.rotation.x = Math.sin(materialRef.current.uniforms.uTime.value * 0.15) * 0.12;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[initialPositions, 3]}
        />
        <bufferAttribute
          attach="attributes-aTargetPosition"
          args={[initialPositions, 3]}
        />
        <bufferAttribute
          attach="attributes-aRandomVec"
          args={[randomVecs, 3]}
        />
        <bufferAttribute
          attach="attributes-aSizeOffset"
          args={[sizeOffsets, 1]}
        />
        <bufferAttribute
          attach="attributes-aColor"
          args={[initialColors, 3]}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
