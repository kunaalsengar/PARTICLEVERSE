import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useParticleStore } from '../../store/useParticleStore';
import { FormationEngine } from '../../engine/FormationEngine';
import { ColorEngine } from '../../engine/ColorEngine';
import { particleVertexShader, particleFragmentShader } from '../../shaders/particleShaders';
import { ConnectionLines } from './ConnectionLines';

export function ParticleMesh() {
  const pointsRef = useRef<THREE.Points>(null!);
  const materialRef = useRef<THREE.ShaderMaterial>(null!);
  const { viewport } = useThree();

  // Store selections
  const particleCount = useParticleStore((s) => s.particleCount);
  const particleSize = useParticleStore((s) => s.particleSize);
  const movementSpeed = useParticleStore((s) => s.movementSpeed);
  const organicNoiseScale = useParticleStore((s) => s.organicNoiseScale);
  const organicNoiseSpeed = useParticleStore((s) => s.organicNoiseSpeed);
  const glow = useParticleStore((s) => s.glow);
  const currentFormation = useParticleStore((s) => s.currentFormation);
  const currentPalette = useParticleStore((s) => s.currentPalette);
  const customColors = useParticleStore((s) => s.customColors);
  const isPlaying = useParticleStore((s) => s.isPlaying);
  const autoRotate = useParticleStore((s) => s.autoRotate);
  const rotationSpeed = useParticleStore((s) => s.rotationSpeed);
  const morphDuration = useParticleStore((s) => s.morphDuration);
  const morphStyle = useParticleStore((s) => s.morphStyle);

  // Phase 02 Physics states
  const physicsEnabled = useParticleStore((s) => s.physicsEnabled);
  const physicsMode = useParticleStore((s) => s.physicsMode);
  const attractionForce = useParticleStore((s) => s.attractionForce);
  const repulsionForce = useParticleStore((s) => s.repulsionForce);
  const mouseRadius = useParticleStore((s) => s.mouseInteractionRadius);
  const vortexStrength = useParticleStore((s) => s.vortexStrength);
  const vortexDirection = useParticleStore((s) => s.vortexDirection);
  const gravity = useParticleStore((s) => s.gravity);
  const damping = useParticleStore((s) => s.damping);
  const explosionIntensity = useParticleStore((s) => s.explosionIntensity);
  const explosionTriggerCount = useParticleStore((s) => s.explosionTriggerCount);

  // Mouse / Touch vector in 3D world space
  const mouse3D = useRef(new THREE.Vector3(9999, 9999, 9999));
  const pointer2D = useRef(new THREE.Vector2(0, 0));
  const pointerActive = useRef(false);
  const prevFormationRef = useRef(currentFormation);
  const morphProgressRef = useRef(1.0);
  const morphingRef = useRef(false);
  const targetPositionsRef = useRef<Float32Array | null>(null);
  const explosionTimelineRef = useRef<gsap.core.Tween | null>(null);
  const prevExplosionTriggerRef = useRef(explosionTriggerCount);

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

  // Interaction mode integer mapping
  const interactionModeInt = useMemo(() => {
    switch (physicsMode) {
      case 'repulsion':
        return 0;
      case 'attraction':
        return 1;
      case 'vortex':
        return 2;
      case 'hybrid':
        return 3;
      default:
        return 0;
    }
  }, [physicsMode]);

  // Morph style integer mapping
  const morphStyleInt = useMemo(() => {
    switch (morphStyle) {
      case 'smooth':
        return 0;
      case 'spiral':
        return 1;
      case 'explosive':
        return 2;
      case 'wave':
        return 3;
      case 'dissolve':
        return 4;
      default:
        return 0;
    }
  }, [morphStyle]);

  // Formation type integer mapping (0 = heart, 1 = butterfly, 2 = helix)
  const formationTypeInt = useMemo(() => {
    switch (currentFormation) {
      case 'heart':
        return 0;
      case 'butterfly':
        return 1;
      case 'helix':
        return 2;
      default:
        return 0;
    }
  }, [currentFormation]);

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
      
      // Phase 03 Morph Uniforms
      uMorphProgress: { value: 0.0 },
      uMorphStyle: { value: 0 },
      uFormationType: { value: formationTypeInt },
      
      // Physics Uniforms
      uPhysicsEnabled: { value: physicsEnabled ? 1.0 : 0.0 },
      uInteractionMode: { value: 0 },
      uMouse: { value: new THREE.Vector3(9999, 9999, 9999) },
      uMouseRadius: { value: mouseRadius },
      uRepulsionStrength: { value: repulsionForce },
      uAttractionStrength: { value: attractionForce },
      uVortexStrength: { value: vortexStrength },
      uVortexDirection: { value: vortexDirection },
      uGravity: { value: gravity },
      uDamping: { value: damping },
      
      // Explosion Uniforms
      uExplosionProgress: { value: 0.0 },
      uExplosionIntensity: { value: explosionIntensity },
      uExplosionOrigin: { value: new THREE.Vector3(0, 0, 0) },

      // Visuals
      uGlow: { value: glow },
      uAmbientGlowColor: { value: new THREE.Color(palette.ambientGlow) }
    };
  }, []);

  // Update uniforms when configuration changes
  useEffect(() => {
    if (!materialRef.current) return;
    const u = materialRef.current.uniforms;
    u.uBaseSize.value = particleSize;
    u.uMovementSpeed.value = movementSpeed;
    u.uNoiseScale.value = organicNoiseScale;
    u.uNoiseSpeed.value = organicNoiseSpeed;
    u.uGlow.value = glow;
    
    // Morph updates
    u.uMorphStyle.value = morphStyleInt;
    u.uFormationType.value = formationTypeInt;

    // Physics updates
    u.uPhysicsEnabled.value = physicsEnabled ? 1.0 : 0.0;
    u.uInteractionMode.value = interactionModeInt;
    u.uMouseRadius.value = mouseRadius;
    u.uRepulsionStrength.value = repulsionForce;
    u.uAttractionStrength.value = attractionForce;
    u.uVortexStrength.value = vortexStrength;
    u.uVortexDirection.value = vortexDirection;
    u.uGravity.value = gravity;
    u.uDamping.value = damping;
    u.uExplosionIntensity.value = explosionIntensity;
  }, [
    particleSize,
    movementSpeed,
    organicNoiseScale,
    organicNoiseSpeed,
    glow,
    morphStyleInt,
    formationTypeInt,
    physicsEnabled,
    interactionModeInt,
    mouseRadius,
    repulsionForce,
    attractionForce,
    vortexStrength,
    vortexDirection,
    gravity,
    damping,
    explosionIntensity
  ]);

  // Handle Triggering Particle Explosion & Cinematic Reconstruction
  useEffect(() => {
    if (explosionTriggerCount > prevExplosionTriggerRef.current) {
      prevExplosionTriggerRef.current = explosionTriggerCount;
      if (!materialRef.current) return;

      if (explosionTimelineRef.current) {
        explosionTimelineRef.current.kill();
      }

      const origin =
        mouse3D.current.x < 9000
          ? mouse3D.current.clone()
          : new THREE.Vector3(0, 0, 0);

      materialRef.current.uniforms.uExplosionOrigin.value.copy(origin);
      materialRef.current.uniforms.uExplosionProgress.value = 0.0;

      explosionTimelineRef.current = gsap.to(materialRef.current.uniforms.uExplosionProgress, {
        value: 1.0,
        duration: 2.2,
        ease: 'power2.out',
        onComplete: () => {
          if (materialRef.current) {
            materialRef.current.uniforms.uExplosionProgress.value = 0.0;
          }
        }
      });
    }
  }, [explosionTriggerCount]);

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

  // Handle Morphing when formation changes with Phase 03 Transitions
  useEffect(() => {
    if (!pointsRef.current || !materialRef.current) return;
    if (prevFormationRef.current === currentFormation) return;

    prevFormationRef.current = currentFormation;

    const geometry = pointsRef.current.geometry;
    const targetPositions = FormationEngine.generatePositions(currentFormation, particleCount);
    targetPositionsRef.current = targetPositions;
    
    // In-place buffer update for reliable WebGL rendering across all morphs
    if (geometry.attributes.aTargetPosition) {
      const targetAttr = geometry.attributes.aTargetPosition as THREE.BufferAttribute;
      (targetAttr.array as Float32Array).set(targetPositions);
      targetAttr.needsUpdate = true;
    } else {
      const attr = new THREE.BufferAttribute(targetPositions, 3);
      attr.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute('aTargetPosition', attr);
    }

    materialRef.current.uniforms.uMorphProgress.value = 0.0;
    materialRef.current.uniforms.uMorphStyle.value = morphStyleInt;
    materialRef.current.uniforms.uFormationType.value = formationTypeInt;

    morphProgressRef.current = 0.0;
    morphingRef.current = true;
  }, [currentFormation, particleCount, morphStyleInt, formationTypeInt]);

  // Mouse & Touch interaction listener in 3D
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      pointer2D.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer2D.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerActive.current = true;
    };

    const handlePointerLeave = () => {
      pointerActive.current = false;
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        pointer2D.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
        pointer2D.current.y = -(touch.clientY / window.innerHeight) * 2 + 1;
        pointerActive.current = true;
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerMove);
    window.addEventListener('mousedown', handlePointerMove);
    window.addEventListener('pointerup', handlePointerLeave);
    window.addEventListener('mouseup', handlePointerLeave);
    window.addEventListener('pointercancel', handlePointerLeave);
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('mouseleave', handlePointerLeave);

    // Touch event listeners for full mobile device support
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('touchmove', handleTouch, { passive: true });
    window.addEventListener('touchend', handlePointerLeave, { passive: true });
    window.addEventListener('touchcancel', handlePointerLeave, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerMove);
      window.removeEventListener('mousedown', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerLeave);
      window.removeEventListener('mouseup', handlePointerLeave);
      window.removeEventListener('pointercancel', handlePointerLeave);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('mouseleave', handlePointerLeave);

      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('touchend', handlePointerLeave);
      window.removeEventListener('touchcancel', handlePointerLeave);
    };
  }, []);

  // Per-frame animation tick
  useFrame((state, delta) => {
    if (!materialRef.current || !pointsRef.current) return;

    if (isPlaying) {
      materialRef.current.uniforms.uTime.value += delta;
    }

    if (pointerActive.current) {
      // Unproject pointer2D to 3D world space at the formation's focal plane (z = 0)
      const vector = new THREE.Vector3(pointer2D.current.x, pointer2D.current.y, 0.5);
      vector.unproject(state.camera);
      const dir = vector.sub(state.camera.position).normalize();
      if (Math.abs(dir.z) > 0.001) {
        const t = -state.camera.position.z / dir.z;
        const targetPos = state.camera.position.clone().add(dir.multiplyScalar(t));
        mouse3D.current.copy(targetPos);
      } else {
        mouse3D.current.set(
          pointer2D.current.x * (viewport.width / 2),
          pointer2D.current.y * (viewport.height / 2),
          0
        );
      }
    } else {
      mouse3D.current.set(9999, 9999, 9999);
    }

    // Convert mouse3D from world space to the local space of pointsRef so rotation/tilt is accounted for
    const localMouse = mouse3D.current.clone();
    if (mouse3D.current.x < 9000 && pointsRef.current) {
      pointsRef.current.worldToLocal(localMouse);
    }
    materialRef.current.uniforms.uMouse.value.lerp(localMouse, 0.15);

    // Frame-accurate GPU Morph Progression (independent of window focus/tab throttling)
    if (morphingRef.current) {
      morphProgressRef.current += delta / Math.max(0.2, morphDuration);
      if (morphProgressRef.current >= 1.0) {
        morphProgressRef.current = 1.0;
        morphingRef.current = false;

        const geometry = pointsRef.current.geometry;
        const posAttr = geometry.attributes.position as THREE.BufferAttribute;
        if (targetPositionsRef.current) {
          (posAttr.array as Float32Array).set(targetPositionsRef.current);
          posAttr.needsUpdate = true;
        }
        materialRef.current.uniforms.uMorphProgress.value = 0.0;
      } else {
        const p = morphProgressRef.current;
        materialRef.current.uniforms.uMorphProgress.value = p * p * (3.0 - 2.0 * p); // smoothstep
      }
    }

    if (autoRotate && isPlaying) {
      pointsRef.current.rotation.y += delta * rotationSpeed * 0.4;
      pointsRef.current.rotation.x = Math.sin(materialRef.current.uniforms.uTime.value * 0.15) * 0.12;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[initialPositions, 3]}
            usage={THREE.DynamicDrawUsage}
          />
          <bufferAttribute
            attach="attributes-aTargetPosition"
            args={[initialPositions, 3]}
            usage={THREE.DynamicDrawUsage}
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

      {/* Dynamic Neighbor Connection Lines */}
      <ConnectionLines pointsRef={pointsRef} />
    </>
  );
}
