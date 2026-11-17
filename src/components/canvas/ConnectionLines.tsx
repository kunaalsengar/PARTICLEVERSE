import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useParticleStore } from '../../store/useParticleStore';
import { ColorEngine } from '../../engine/ColorEngine';

const MAX_NODES = 400;
const MAX_LINES = 1200;

export function ConnectionLines({ pointsRef }: { pointsRef: React.RefObject<THREE.Points | null> }) {
  const lineMeshRef = useRef<THREE.LineSegments>(null!);
  const lineGeoRef = useRef<THREE.BufferGeometry>(null!);

  const showConnections = useParticleStore((s) => s.showConnections);
  const connectionDistance = useParticleStore((s) => s.connectionDistance);
  const connectionOpacity = useParticleStore((s) => s.connectionOpacity);
  const maxConnectionsPerParticle = useParticleStore((s) => s.maxConnectionsPerParticle);
  const currentPalette = useParticleStore((s) => s.currentPalette);

  // Pre-allocate line segment buffers: 2 vertices per line (x, y, z)
  const [linePositions, lineColors] = useMemo(() => {
    const pos = new Float32Array(MAX_LINES * 2 * 3);
    const col = new Float32Array(MAX_LINES * 2 * 3);
    return [pos, col];
  }, []);

  // Spatial grid neighbor search and dynamic line update
  useFrame(() => {
    if (!showConnections || !pointsRef.current || !lineGeoRef.current) {
      if (lineGeoRef.current) {
        lineGeoRef.current.setDrawRange(0, 0);
      }
      return;
    }

    const pointsGeo = pointsRef.current.geometry;
    const positionsAttr = pointsGeo.attributes.position;
    if (!positionsAttr) return;

    const totalParticles = positionsAttr.count;
    const step = Math.max(1, Math.floor(totalParticles / MAX_NODES));
    const sampleCount = Math.min(MAX_NODES, Math.floor(totalParticles / step));

    // Extract sampled node positions
    const posArray = positionsAttr.array as Float32Array;
    const nodes: { x: number; y: number; z: number; connections: number }[] = [];

    // Transform by point cloud's current world rotation
    const rotationY = pointsRef.current.rotation.y;
    const rotationX = pointsRef.current.rotation.x;
    const cosY = Math.cos(rotationY);
    const sinY = Math.sin(rotationY);
    const cosX = Math.cos(rotationX);
    const sinX = Math.sin(rotationX);

    for (let i = 0; i < sampleCount; i++) {
      const idx = i * step * 3;
      const lx = posArray[idx];
      const ly = posArray[idx + 1];
      const lz = posArray[idx + 2];

      // Rotate around Y and X to match point mesh orientation
      const x1 = lx * cosY + lz * sinY;
      const z1 = -lx * sinY + lz * cosY;
      const y1 = ly * cosX - z1 * sinX;
      const z2 = ly * sinX + z1 * cosX;

      nodes.push({ x: x1, y: y1, z: z2, connections: 0 });
    }

    // Spatial hash grid
    const cellSize = connectionDistance;
    const grid = new Map<string, number[]>();

    const getHash = (x: number, y: number, z: number) => {
      const cx = Math.floor(x / cellSize);
      const cy = Math.floor(y / cellSize);
      const cz = Math.floor(z / cellSize);
      return `${cx},${cy},${cz}`;
    };

    for (let i = 0; i < nodes.length; i++) {
      const key = getHash(nodes[i].x, nodes[i].y, nodes[i].z);
      const bucket = grid.get(key);
      if (bucket) {
        bucket.push(i);
      } else {
        grid.set(key, [i]);
      }
    }

    const palette = ColorEngine.getPalette(currentPalette);
    const baseColor = new THREE.Color(palette.primary);
    const distSqLimit = connectionDistance * connectionDistance;

    let lineIndex = 0;

    // Check neighboring voxels
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].connections >= maxConnectionsPerParticle) continue;

      const n1 = nodes[i];
      const cx = Math.floor(n1.x / cellSize);
      const cy = Math.floor(n1.y / cellSize);
      const cz = Math.floor(n1.z / cellSize);

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dz = -1; dz <= 1; dz++) {
            const neighborKey = `${cx + dx},${cy + dy},${cz + dz}`;
            const bucket = grid.get(neighborKey);
            if (!bucket) continue;

            for (const j of bucket) {
              if (j <= i) continue; // avoid duplicates and self-connections
              if (nodes[j].connections >= maxConnectionsPerParticle) continue;

              const n2 = nodes[j];
              const dX = n1.x - n2.x;
              const dY = n1.y - n2.y;
              const dZ = n1.z - n2.z;
              const distSq = dX * dX + dY * dY + dZ * dZ;

              if (distSq < distSqLimit && lineIndex < MAX_LINES) {
                const alpha = Math.max(0.05, 1.0 - Math.sqrt(distSq) / connectionDistance) * connectionOpacity;
                const pIdx = lineIndex * 6;

                // Vertex 1
                linePositions[pIdx] = n1.x;
                linePositions[pIdx + 1] = n1.y;
                linePositions[pIdx + 2] = n1.z;
                lineColors[pIdx] = baseColor.r * alpha;
                lineColors[pIdx + 1] = baseColor.g * alpha;
                lineColors[pIdx + 2] = baseColor.b * alpha;

                // Vertex 2
                linePositions[pIdx + 3] = n2.x;
                linePositions[pIdx + 4] = n2.y;
                linePositions[pIdx + 5] = n2.z;
                lineColors[pIdx + 3] = baseColor.r * alpha;
                lineColors[pIdx + 4] = baseColor.g * alpha;
                lineColors[pIdx + 5] = baseColor.b * alpha;

                nodes[i].connections++;
                nodes[j].connections++;
                lineIndex++;

                if (lineIndex >= MAX_LINES) break;
              }
            }
            if (lineIndex >= MAX_LINES) break;
          }
          if (lineIndex >= MAX_LINES) break;
        }
        if (lineIndex >= MAX_LINES) break;
      }
    }

    const posAttr = lineGeoRef.current.attributes.position as THREE.BufferAttribute;
    const colAttr = lineGeoRef.current.attributes.color as THREE.BufferAttribute;

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    lineGeoRef.current.setDrawRange(0, lineIndex * 2);
  });

  if (!showConnections) return null;

  return (
    <lineSegments ref={lineMeshRef}>
      <bufferGeometry ref={lineGeoRef}>
        <bufferAttribute
          attach="attributes-position"
          args={[linePositions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[lineColors, 3]}
        />
      </bufferGeometry>
      <lineBasicMaterial
        vertexColors={true}
        transparent={true}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}
