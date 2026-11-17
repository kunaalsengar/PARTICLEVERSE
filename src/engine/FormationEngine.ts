import * as THREE from 'three';
import { FormationType } from '../types';

export class FormationEngine {
  /**
   * Generates position array [x, y, z, x, y, z...] for a specified formation and particle count.
   */
  public static generatePositions(type: FormationType, count: number): Float32Array {
    const positions = new Float32Array(count * 3);

    switch (type) {
      // --- Phase 01 Formations ---
      case 'spider':
        this.generateSpider(positions, count);
        break;
      case 'neural':
        this.generateNeural(positions, count);
        break;
      case 'galaxy':
        this.generateGalaxy(positions, count);
        break;
      case 'helix':
        this.generateHelix(positions, count);
        break;
      case 'sphere':
        this.generateSphere(positions, count);
        break;
      case 'cube':
        this.generateCube(positions, count);
        break;
      case 'torus':
        this.generateTorus(positions, count);
        break;
      case 'heart':
        this.generateHeart(positions, count);
        break;
      case 'infinity':
        this.generateInfinity(positions, count);
        break;
      case 'star':
        this.generateStar(positions, count);
        break;
      case 'butterfly':
        this.generateButterfly(positions, count);
        break;

      // --- Phase 03 New Distinct Formations ---
      case 'icosahedron':
        this.generateIcosahedron(positions, count);
        break;
      case 'dodecahedron':
        this.generateDodecahedron(positions, count);
        break;
      case 'octahedron':
        this.generateOctahedron(positions, count);
        break;
      case 'klein-bottle':
        this.generateKleinBottle(positions, count);
        break;
      case 'tree-of-life':
        this.generateTreeOfLife(positions, count);
        break;
      case 'coral':
        this.generateCoral(positions, count);
        break;
      case 'rose':
        this.generateRose(positions, count);
        break;
      case 'nebula':
        this.generateNebula(positions, count);
        break;
      case 'pulsar':
        this.generatePulsar(positions, count);
        break;
      case 'cosmic-web':
        this.generateCosmicWeb(positions, count);
        break;
      case 'crescent-moon':
        this.generateCrescentMoon(positions, count);
        break;
      case 'diamond':
        this.generateDiamond(positions, count);
        break;
      case 'yin-yang':
        this.generateYinYang(positions, count);
        break;

      default:
        this.generateSpider(positions, count);
        break;
    }

    // Shared formation-normalization: centers at origin and uniformly scales max dimension to 4.0
    this.normalizePositions(positions, count, 4.0);

    return positions;
  }

  /**
   * Shared formation normalization utility.
   * - Calculates the exact 3D bounding box [min, max] and centroid.
   * - Centers all particle coordinates around the origin (0, 0, 0).
   * - Uniformly scales all axes by targetSize / maxDimension, preserving original aspect ratio.
   * - Never stretches X, Y, and Z independently.
   */
  public static normalizePositions(
    positions: Float32Array,
    count: number,
    targetSize: number = 4.0
  ): { center: [number, number, number]; bounds: [number, number, number]; scale: number } {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    for (let i = 0; i < count; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];

      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }

    const centerX = (minX + maxX) * 0.5;
    const centerY = (minY + maxY) * 0.5;
    const centerZ = (minZ + maxZ) * 0.5;

    const sizeX = maxX - minX;
    const sizeY = maxY - minY;
    const sizeZ = maxZ - minZ;

    const maxDim = Math.max(sizeX, sizeY, sizeZ);
    const scale = maxDim > 0.0001 ? targetSize / maxDim : 1.0;

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (positions[i * 3] - centerX) * scale;
      positions[i * 3 + 1] = (positions[i * 3 + 1] - centerY) * scale;
      positions[i * 3 + 2] = (positions[i * 3 + 2] - centerZ) * scale;
    }

    return {
      center: [centerX, centerY, centerZ],
      bounds: [sizeX * scale, sizeY * scale, sizeZ * scale],
      scale
    };
  }

  // ==========================================
  // PHASE 01 PRESERVED FORMATIONS
  // ==========================================

  // 1. Spider Organism
  private static generateSpider(pos: Float32Array, count: number): void {
    const thoraxCount = Math.floor(count * 0.15);
    const abdomenCount = Math.floor(count * 0.25);
    const legCount = Math.floor(count * 0.55);

    let idx = 0;

    // Cephalothorax
    for (let i = 0; i < thoraxCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 0.8;

      pos[idx++] = r * Math.sin(phi) * Math.cos(theta) * 0.9;
      pos[idx++] = r * Math.cos(phi) * 0.5 + 0.2;
      pos[idx++] = r * Math.sin(phi) * Math.sin(theta) * 1.3 + 0.5;
    }

    // Abdomen
    for (let i = 0; i < abdomenCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 1.4;

      pos[idx++] = r * Math.sin(phi) * Math.cos(theta) * 1.1;
      pos[idx++] = r * Math.cos(phi) * 0.8 + 0.4;
      pos[idx++] = r * Math.sin(phi) * Math.sin(theta) * 1.6 - 1.2;
    }

    // 8 Articulated Legs
    const particlesPerLeg = Math.floor(legCount / 8);
    for (let leg = 0; leg < 8; leg++) {
      const side = leg < 4 ? 1 : -1;
      const legIndexOnSide = leg % 4;
      const baseAngle = ((legIndexOnSide - 1.5) * 0.45) * Math.PI * 0.5;

      for (let i = 0; i < particlesPerLeg; i++) {
        const t = i / particlesPerLeg;
        let lx = side * (0.6 + t * 3.4 * (1.0 + Math.sin(baseAngle) * 0.3));
        let ly = 0.2 + Math.sin(t * Math.PI * 0.8) * 1.6 - Math.pow(t, 2.2) * 2.5;
        let lz = Math.cos(baseAngle) * (0.8 + t * 2.4) - 0.2;

        const jitter = (Math.random() - 0.5) * 0.12 * (1.0 - t * 0.5);
        pos[idx++] = lx + jitter;
        pos[idx++] = ly + jitter;
        pos[idx++] = lz + jitter;
      }
    }

    // Spiky chelicerae
    while (idx < count * 3) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const t = Math.random();
      pos[idx++] = side * (0.2 + t * 0.3);
      pos[idx++] = -0.3 - t * 0.8 + (Math.random() - 0.5) * 0.1;
      pos[idx++] = 1.3 + t * 0.5;
    }
  }

  // 2. Neural Network
  private static generateNeural(pos: Float32Array, count: number): void {
    const clusterCount = 14;
    const centers: THREE.Vector3[] = [];

    for (let c = 0; c < clusterCount; c++) {
      centers.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 5.0,
          (Math.random() - 0.5) * 4.0,
          (Math.random() - 0.5) * 5.0
        )
      );
    }

    let idx = 0;
    const nodeParticles = Math.floor(count * 0.6);
    const fiberParticles = count - nodeParticles;

    for (let i = 0; i < nodeParticles; i++) {
      const center = centers[Math.floor(Math.random() * clusterCount)];
      const r = Math.pow(Math.random(), 2.0) * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[idx++] = center.x + r * Math.sin(phi) * Math.cos(theta);
      pos[idx++] = center.y + r * Math.sin(phi) * Math.sin(theta);
      pos[idx++] = center.z + r * Math.cos(phi);
    }

    for (let i = 0; i < fiberParticles; i++) {
      const c1 = centers[Math.floor(Math.random() * clusterCount)];
      const c2 = centers[Math.floor(Math.random() * clusterCount)];
      const t = Math.random();

      const cx = THREE.MathUtils.lerp(c1.x, c2.x, t);
      const cy = THREE.MathUtils.lerp(c1.y, c2.y, t) + Math.sin(t * Math.PI) * 0.4;
      const cz = THREE.MathUtils.lerp(c1.z, c2.z, t);

      pos[idx++] = cx + (Math.random() - 0.5) * 0.15;
      pos[idx++] = cy + (Math.random() - 0.5) * 0.15;
      pos[idx++] = cz + (Math.random() - 0.5) * 0.15;
    }
  }

  // 3. Spiral Galaxy
  private static generateGalaxy(pos: Float32Array, count: number): void {
    let idx = 0;
    const arms = 2;
    const maxRadius = 4.2;

    for (let i = 0; i < count; i++) {
      const r = Math.pow(Math.random(), 1.8) * maxRadius;
      const armIndex = i % arms;
      const armOffset = (armIndex * 2.0 * Math.PI) / arms;
      const spiral = r * 1.5;
      const angle = armOffset + spiral + (Math.random() - 0.5) * (0.6 / (r + 0.5));
      const spread = (1.0 - r / maxRadius) * 0.8 + 0.05;
      const z = (Math.random() - 0.5) * spread * 0.7;

      pos[idx++] = Math.cos(angle) * r;
      pos[idx++] = z;
      pos[idx++] = Math.sin(angle) * r;
    }
  }

  // 4. Double Helix (Quantum Double Helix)
  private static generateHelix(pos: Float32Array, count: number): void {
    let idx = 0;
    // Elegant biological DNA proportions:
    // Radius = 0.95 (diameter = 1.9), height = 4.0, turns = 2.25
    // Height-to-diameter ratio ~ 2.1:1
    const radius = 0.95;
    const height = 4.0;
    const turns = 2.25;

    // 65% for the two continuous backbones, 35% for base-pair rungs
    const strandParticles = Math.floor(count * 0.65);
    const rungParticles = count - strandParticles;
    const halfStrand = Math.floor(strandParticles / 2);

    // 1. Two primary intertwined DNA strands (180 deg out of phase)
    for (let s = 0; s < 2; s++) {
      const phase = s * Math.PI;
      for (let i = 0; i < halfStrand && idx < count * 3; i++) {
        const progress = i / halfStrand;
        const y = (progress - 0.5) * height;
        const theta = progress * Math.PI * 2 * turns + phase;

        // Tube thickness around each strand backbone
        const rTube = 0.07;
        const tubeAngle = Math.random() * Math.PI * 2;
        const tubeRad = Math.sqrt(Math.random()) * rTube;

        pos[idx++] = Math.cos(theta) * radius + Math.cos(tubeAngle) * tubeRad;
        pos[idx++] = y + (Math.random() - 0.5) * 0.03;
        pos[idx++] = Math.sin(theta) * radius + Math.sin(tubeAngle) * tubeRad;
      }
    }

    // 2. Regular base-pair rungs connecting the two strands across the central axis
    const numRungs = 24;
    const particlesPerRung = Math.floor(rungParticles / numRungs);
    for (let r = 0; r < numRungs; r++) {
      const progress = (r + 0.5) / numRungs;
      const y = (progress - 0.5) * height;
      const theta = progress * Math.PI * 2 * turns;

      for (let p = 0; p < particlesPerRung && idx < count * 3; p++) {
        // Interpolate along the rung between -radius and +radius
        const u = (p / Math.max(1, particlesPerRung - 1)) * 2.0 - 1.0;
        const jitter = (Math.random() - 0.5) * 0.03;

        pos[idx++] = Math.cos(theta) * radius * u + jitter;
        pos[idx++] = y + jitter;
        pos[idx++] = Math.sin(theta) * radius * u + jitter;
      }
    }

    // Fill any remainder
    while (idx < count * 3) {
      pos[idx] = pos[idx - 3];
      idx++;
    }
  }

  // 5. Geodesic Sphere
  private static generateSphere(pos: Float32Array, count: number): void {
    let idx = 0;
    const phi = Math.PI * (3.0 - Math.sqrt(5.0));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const baseRadius = 2.4;
      const harmonic = 1.0 + Math.sin(theta * 5.0) * Math.cos(y * 6.0) * 0.08;
      const r = baseRadius * harmonic;

      pos[idx++] = Math.cos(theta) * radiusAtY * r;
      pos[idx++] = y * r;
      pos[idx++] = Math.sin(theta) * radiusAtY * r;
    }
  }

  // 6. Tesseract / Hypercube
  private static generateCube(pos: Float32Array, count: number): void {
    let idx = 0;
    const innerRatio = 0.55;
    const outerSize = 2.4;

    for (let i = 0; i < count; i++) {
      const isInner = Math.random() > 0.65;
      const size = isInner ? outerSize * innerRatio : outerSize;

      const face = Math.floor(Math.random() * 6);
      const u = (Math.random() - 0.5) * 2 * size;
      const v = (Math.random() - 0.5) * 2 * size;
      const fixed = (Math.random() > 0.5 ? 1 : -1) * size;

      let x = 0, y = 0, z = 0;
      if (face === 0 || face === 1) {
        x = fixed; y = u; z = v;
      } else if (face === 2 || face === 3) {
        x = u; y = fixed; z = v;
      } else {
        x = u; y = v; z = fixed;
      }

      pos[idx++] = x;
      pos[idx++] = y;
      pos[idx++] = z;
    }
  }

  // 7. Torus
  private static generateTorus(pos: Float32Array, count: number): void {
    let idx = 0;
    const R = 2.2;
    const r = 0.85;

    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      const thickness = r * (0.8 + Math.random() * 0.4);

      pos[idx++] = (R + thickness * Math.cos(v)) * Math.cos(u);
      pos[idx++] = thickness * Math.sin(v);
      pos[idx++] = (R + thickness * Math.cos(v)) * Math.sin(u);
    }
  }

  // 8. 3D Heart (Cardioid Resonator)
  private static generateHeart(pos: Float32Array, count: number): void {
    let idx = 0;

    // Proportions and anatomy:
    // Base 2D cardioid formula:
    // x(t) = 16 * sin^3(t)
    // y(t) = 13*cos(t) - 5*cos(2t) - 2*cos(3t) - cos(4t)
    // Lobes at y ≈ 12.39, Tip at y = -17.0. Centroid offset: y_center = -2.30.
    // Width = 32.0, Height = 29.4 (aspect ratio 1.09 : 1).
    const shellCount = Math.floor(count * 0.40);
    const domeCount = Math.floor(count * 0.40);
    const coreCount = count - shellCount - domeCount;

    // 1. Outer perimeter / boundary with 3D profile
    for (let i = 0; i < shellCount && idx < count * 3; i++) {
      const t = Math.random() * Math.PI * 2;
      const bx = 16.0 * Math.pow(Math.sin(t), 3);
      const by = (13.0 * Math.cos(t) - 5.0 * Math.cos(2 * t) - 2.0 * Math.cos(3 * t) - Math.cos(4 * t)) + 2.30;

      // 3D depth profile: thickest at the upper lobes, tapering smoothly towards bottom tip
      const normY = (by + 14.7) / 29.4; // 0 (tip) to 1 (top of lobes)
      const maxDepth = 4.5 * Math.sin(normY * Math.PI * 0.85) * (1.0 - Math.pow(Math.abs(bx) / 18.0, 2) * 0.25);
      const zSide = Math.random() > 0.5 ? 1 : -1;
      const bz = zSide * Math.sqrt(Math.random()) * Math.max(0.2, maxDepth) + (Math.random() - 0.5) * 0.25;

      pos[idx++] = bx;
      pos[idx++] = by;
      pos[idx++] = bz;
    }

    // 2. Volumetric Front & Back Domes (full 3D heart volume)
    for (let i = 0; i < domeCount && idx < count * 3; i++) {
      const t = Math.random() * Math.PI * 2;
      const bx = 16.0 * Math.pow(Math.sin(t), 3);
      const by = (13.0 * Math.cos(t) - 5.0 * Math.cos(2 * t) - 2.0 * Math.cos(3 * t) - Math.cos(4 * t)) + 2.30;

      const s = Math.sqrt(Math.random()) * 0.95;
      const px = bx * s;
      const py = by * s; // Interpolate inward toward (0, 0) since (bx, by) is already centered around 0

      const domeFactor = Math.sqrt(Math.max(0.0, 1.0 - s * s));
      const normY = (py + 14.7) / 29.4;
      const lobeDepth = 5.5 * Math.sin(normY * Math.PI * 0.8) * domeFactor;

      const zSide = Math.random() > 0.5 ? 1 : -1;
      const pz = zSide * lobeDepth * (0.8 + Math.random() * 0.2);

      pos[idx++] = px;
      pos[idx++] = py;
      pos[idx++] = pz;
    }

    // 3. Interior Core (glowing heart lattice)
    for (let i = 0; i < coreCount && idx < count * 3; i++) {
      const t = Math.random() * Math.PI * 2;
      const bx = 16.0 * Math.pow(Math.sin(t), 3);
      const by = (13.0 * Math.cos(t) - 5.0 * Math.cos(2 * t) - 2.0 * Math.cos(3 * t) - Math.cos(4 * t)) + 2.30;

      const s = Math.pow(Math.random(), 0.7) * 0.8;
      const px = bx * s;
      const py = by * s;
      const pz = (Math.random() - 0.5) * 3.5 * (1.0 - s * 0.5);

      pos[idx++] = px;
      pos[idx++] = py;
      pos[idx++] = pz;
    }

    // Fill remainder if any
    while (idx < count * 3) {
      pos[idx] = pos[idx - 3];
      idx++;
    }
  }

  // 9. Infinity / Mobius Lemniscate
  private static generateInfinity(pos: Float32Array, count: number): void {
    let idx = 0;
    const scale = 2.4;

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      const denom = 1 + Math.sin(t) * Math.sin(t);
      const x = (scale * Math.cos(t)) / denom;
      const z = (scale * Math.sin(t) * Math.cos(t)) / denom;
      const v = (Math.random() - 0.5) * 0.45;
      const y = Math.sin(t * 2.0) * 0.5 + v;

      pos[idx++] = x;
      pos[idx++] = y;
      pos[idx++] = z * 1.5;
    }
  }

  // 10. Star / Stellated Octahedron
  private static generateStar(pos: Float32Array, count: number): void {
    let idx = 0;
    const rayCount = 8;
    const rays: THREE.Vector3[] = [
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0.7, 0.7, 0.7).normalize(),
      new THREE.Vector3(-0.7, -0.7, -0.7).normalize()
    ];

    for (let i = 0; i < count; i++) {
      if (Math.random() < 0.35) {
        const r = Math.pow(Math.random(), 2.0) * 0.9;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[idx++] = r * Math.sin(phi) * Math.cos(theta);
        pos[idx++] = r * Math.sin(phi) * Math.sin(theta);
        pos[idx++] = r * Math.cos(phi);
      } else {
        const ray = rays[Math.floor(Math.random() * rayCount)];
        const dist = Math.pow(Math.random(), 0.6) * 3.8;
        const spread = Math.pow(1.0 - dist / 3.8, 1.5) * 0.35;

        pos[idx++] = ray.x * dist + (Math.random() - 0.5) * spread;
        pos[idx++] = ray.y * dist + (Math.random() - 0.5) * spread;
        pos[idx++] = ray.z * dist + (Math.random() - 0.5) * spread;
      }
    }
  }

  // 11. Chaos Butterfly (Parametric 3D Morpho Butterfly)
  private static generateButterfly(pos: Float32Array, count: number): void {
    let idx = 0;
    // 72% wings (boundary + veins + membrane fill)
    // 18% central segmented body (head, thorax, abdomen)
    // 10% delicate paired antennae
    const wingCount = Math.floor(count * 0.72);
    const bodyCount = Math.floor(count * 0.18);
    const antCount = count - wingCount - bodyCount;

    // 1. Bilateral 3D Wings with wide horizontal wingspan
    const halfWings = Math.floor(wingCount / 2);
    for (let i = 0; i < halfWings && idx < count * 3 - 5; i++) {
      const t = Math.random() * Math.PI * 2;
      // Harmonic wing envelope
      const rEnvelope = Math.exp(Math.cos(t)) - 2.0 * Math.cos(4.0 * t) + 0.35 * Math.sin(t * 2.0);
      const r = Math.max(0.15, rEnvelope);

      const dice = Math.random();
      let s: number;
      if (dice < 0.35) {
        // Outer wing margin (crisp boundary)
        s = 1.0 + (Math.random() - 0.5) * 0.04;
      } else if (dice < 0.65) {
        // Interior wing membrane
        s = Math.sqrt(Math.random()) * 0.95;
      } else {
        // Radiating wing veins
        s = Math.random() * 0.98;
      }

      // Majestic wide wingspan (horizontal spread = 1.30)
      const px = r * Math.sin(t) * s * 1.30;
      const py = r * Math.cos(t) * s;

      // 3D Dihedral wing camber: wings angle gently upward and forward with lateral distance
      const wingDist = Math.abs(px);
      let pz = Math.sin(wingDist * 0.3) * 0.7 + (Math.cos(py * 0.35) - 1.0) * 0.25;
      pz += (Math.random() - 0.5) * 0.08;

      // Right wing (+X)
      pos[idx++] = Math.abs(px);
      pos[idx++] = py;
      pos[idx++] = pz;

      // Left wing (-X) - 100% exact bilateral symmetry
      pos[idx++] = -Math.abs(px);
      pos[idx++] = py;
      pos[idx++] = pz;
    }

    // 2. Central Segmented Body (abdomen, thorax, head along Y-axis)
    for (let i = 0; i < bodyCount && idx < count * 3; i++) {
      const yProg = Math.random();
      const py = -2.0 + yProg * 3.6;
      let rad: number;

      if (py > 1.2) {
        // Head (spherical bulb)
        const headT = (py - 1.4) / 0.25;
        rad = Math.sqrt(Math.max(0.01, 1.0 - headT * headT)) * 0.22;
      } else if (py > 0.3) {
        // Thorax (thickest segment where wings attach)
        rad = 0.30 * (1.0 - Math.pow((py - 0.75) / 0.5, 2) * 0.3);
      } else {
        // Abdomen (tapered lower segment)
        const abT = (py - 0.3) / -2.3;
        rad = 0.22 * (1.0 - abT * 0.65);
      }

      const ang = Math.random() * Math.PI * 2;
      const rSample = Math.sqrt(Math.random()) * rad;
      const px = Math.cos(ang) * rSample;
      const pz = Math.sin(ang) * rSample * 0.8 + 0.1;

      pos[idx++] = px;
      pos[idx++] = py;
      pos[idx++] = pz;
    }

    // 3. Paired Antennae crowning head with curved tips
    const halfAnt = Math.floor(antCount / 2);
    for (let i = 0; i < halfAnt && idx < count * 3 - 5; i++) {
      const prog = (i + 1) / halfAnt;
      const t = prog * Math.PI * 0.6;
      const px = Math.sin(t) * 0.9 * prog;
      const py = 1.5 + Math.cos(t * 0.6) * 1.1 * prog;
      const pz = 0.15 + prog * 0.35 + Math.sin(prog * Math.PI) * 0.12;
      const jitter = (Math.random() - 0.5) * 0.03;

      // Right antenna
      pos[idx++] = px + jitter;
      pos[idx++] = py + jitter;
      pos[idx++] = pz + jitter;

      // Left antenna
      pos[idx++] = -px - jitter;
      pos[idx++] = py + jitter;
      pos[idx++] = pz + jitter;
    }

    // Fill remainder if any
    while (idx < count * 3) {
      pos[idx] = pos[idx - 3];
      idx++;
    }
  }

  // ==========================================
  // PHASE 03 NEW DISTINCT FORMATIONS
  // ==========================================

  // 12. Geodesic Icosahedron (Platonic Solid)
  private static generateIcosahedron(pos: Float32Array, count: number): void {
    const phi = (1 + Math.sqrt(5)) / 2;
    const scale = 1.6;
    const vertices: THREE.Vector3[] = [
      new THREE.Vector3(-1, phi, 0).normalize().multiplyScalar(scale),
      new THREE.Vector3(1, phi, 0).normalize().multiplyScalar(scale),
      new THREE.Vector3(-1, -phi, 0).normalize().multiplyScalar(scale),
      new THREE.Vector3(1, -phi, 0).normalize().multiplyScalar(scale),
      new THREE.Vector3(0, -1, phi).normalize().multiplyScalar(scale),
      new THREE.Vector3(0, 1, phi).normalize().multiplyScalar(scale),
      new THREE.Vector3(0, -1, -phi).normalize().multiplyScalar(scale),
      new THREE.Vector3(0, 1, -phi).normalize().multiplyScalar(scale),
      new THREE.Vector3(phi, 0, -1).normalize().multiplyScalar(scale),
      new THREE.Vector3(phi, 0, 1).normalize().multiplyScalar(scale),
      new THREE.Vector3(-phi, 0, -1).normalize().multiplyScalar(scale),
      new THREE.Vector3(-phi, 0, 1).normalize().multiplyScalar(scale)
    ];

    // 20 triangular faces
    const faces = [
      [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
      [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
      [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];

    let idx = 0;
    for (let i = 0; i < count; i++) {
      const face = faces[Math.floor(Math.random() * faces.length)];
      const v0 = vertices[face[0]];
      const v1 = vertices[face[1]];
      const v2 = vertices[face[2]];

      // Uniform barycentric sampling on triangle surface
      let r1 = Math.random();
      let r2 = Math.random();
      if (r1 + r2 > 1.0) {
        r1 = 1.0 - r1;
        r2 = 1.0 - r2;
      }
      const r3 = 1.0 - r1 - r2;

      const px = v0.x * r1 + v1.x * r2 + v2.x * r3;
      const py = v0.y * r1 + v1.y * r2 + v2.y * r3;
      const pz = v0.z * r1 + v1.z * r2 + v2.z * r3;

      // Surface normal elevation and slight edge bevel
      const jitter = (Math.random() - 0.5) * 0.05;
      pos[idx++] = px + jitter;
      pos[idx++] = py + jitter;
      pos[idx++] = pz + jitter;
    }
  }

  // 13. Dodecahedron Matrix (12 Pentagonal Faces)
  private static generateDodecahedron(pos: Float32Array, count: number): void {
    const phi = (1 + Math.sqrt(5)) / 2;
    const invPhi = 1 / phi;
    const scale = 1.45;

    // 20 Dodecahedron vertices
    const rawVertices = [
      [-1, -1, -1], [-1, -1, 1], [-1, 1, -1], [-1, 1, 1],
      [1, -1, -1], [1, -1, 1], [1, 1, -1], [1, 1, 1],
      [0, -invPhi, -phi], [0, -invPhi, phi], [0, invPhi, -phi], [0, invPhi, phi],
      [-invPhi, -phi, 0], [-invPhi, phi, 0], [invPhi, -phi, 0], [invPhi, phi, 0],
      [-phi, 0, -invPhi], [-phi, 0, invPhi], [phi, 0, -invPhi], [phi, 0, invPhi]
    ];

    const vertices = rawVertices.map(v => new THREE.Vector3(v[0], v[1], v[2]).normalize().multiplyScalar(scale));

    // Connect vertices along edges
    const edges: [number, number][] = [];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const d = vertices[i].distanceTo(vertices[j]);
        if (Math.abs(d - (scale * 0.7136)) < 0.2) {
          edges.push([i, j]);
        }
      }
    }

    let idx = 0;
    for (let i = 0; i < count; i++) {
      if (Math.random() < 0.7 && edges.length > 0) {
        // Place along edges
        const edge = edges[Math.floor(Math.random() * edges.length)];
        const t = Math.random();
        const p = vertices[edge[0]].clone().lerp(vertices[edge[1]], t);
        pos[idx++] = p.x + (Math.random() - 0.5) * 0.06;
        pos[idx++] = p.y + (Math.random() - 0.5) * 0.06;
        pos[idx++] = p.z + (Math.random() - 0.5) * 0.06;
      } else {
        // Inner pentagonal face chord lattice
        const v1 = vertices[Math.floor(Math.random() * vertices.length)];
        const v2 = vertices[Math.floor(Math.random() * vertices.length)];
        const t = Math.random();
        const p = v1.clone().lerp(v2, t).multiplyScalar(0.9);
        pos[idx++] = p.x;
        pos[idx++] = p.y;
        pos[idx++] = p.z;
      }
    }
  }

  // 14. Dual Octahedron
  private static generateOctahedron(pos: Float32Array, count: number): void {
    let idx = 0;
    const sizes = [2.2, 1.1]; // Outer and nested inner octahedron

    for (let i = 0; i < count; i++) {
      const s = sizes[i % 2 === 0 ? 0 : 1];
      // Random face selection in 8 octants
      const sx = Math.random() > 0.5 ? 1 : -1;
      const sy = Math.random() > 0.5 ? 1 : -1;
      const sz = Math.random() > 0.5 ? 1 : -1;

      // Uniform triangle sampling: x + y + z = 1
      let u = Math.random();
      let v = Math.random();
      if (u + v > 1.0) {
        u = 1.0 - u;
        v = 1.0 - v;
      }
      const w = 1.0 - u - v;

      pos[idx++] = sx * u * s;
      pos[idx++] = sy * v * s;
      pos[idx++] = sz * w * s;
    }
  }

  // 15. Klein Bottle (Figure-8 4D Immersion)
  private static generateKleinBottle(pos: Float32Array, count: number): void {
    let idx = 0;
    const r = 2.0;

    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;

      // Parametric figure-8 Klein immersion
      const cu = Math.cos(u);
      const su = Math.sin(u);
      const cu2 = Math.cos(u * 0.5);
      const su2 = Math.sin(u * 0.5);
      const sv = Math.sin(v);
      const s2v = Math.sin(2 * v);

      const rad = r + cu2 * sv - su2 * s2v;
      const x = (rad * cu) * 0.7;
      const y = (su2 * sv + cu2 * s2v) * 1.3;
      const z = (rad * su) * 0.7;

      pos[idx++] = x;
      pos[idx++] = y;
      pos[idx++] = z;
    }
  }

  // 16. Tree of Life (Fractal Bioluminescent Arbor)
  private static generateTreeOfLife(pos: Float32Array, count: number): void {
    let idx = 0;
    const trunkParticles = Math.floor(count * 0.22);
    const branchParticles = Math.floor(count * 0.38);
    const canopyParticles = count - trunkParticles - branchParticles;

    // 1. Tapered Trunk
    for (let i = 0; i < trunkParticles; i++) {
      const t = i / trunkParticles;
      const y = -2.6 + t * 2.2;
      const radius = (1.0 - t * 0.55) * 0.5;
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * radius;

      pos[idx++] = Math.cos(angle) * r;
      pos[idx++] = y;
      pos[idx++] = Math.sin(angle) * r;
    }

    // 2. Articulated Boughs
    const numBoughs = 5;
    for (let i = 0; i < branchParticles; i++) {
      const boughIdx = i % numBoughs;
      const baseAngle = (boughIdx * 2.0 * Math.PI) / numBoughs;
      const t = Math.random();

      const branchRadius = t * 2.2;
      const branchAngle = baseAngle + t * 0.6;
      const y = -0.4 + Math.sin(t * Math.PI * 0.5) * 1.8;

      pos[idx++] = Math.cos(branchAngle) * branchRadius + (Math.random() - 0.5) * 0.15;
      pos[idx++] = y + (Math.random() - 0.5) * 0.15;
      pos[idx++] = Math.sin(branchAngle) * branchRadius + (Math.random() - 0.5) * 0.15;
    }

    // 3. Foliage Canopy Sphere Clusters
    for (let i = 0; i < canopyParticles; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.6; // hemispherical top
      const r = 1.4 + Math.cbrt(Math.random()) * 1.6;

      const x = Math.sin(phi) * Math.cos(theta) * r;
      const y = Math.cos(phi) * r + 1.2;
      const z = Math.sin(phi) * Math.sin(theta) * r;

      pos[idx++] = x;
      pos[idx++] = y;
      pos[idx++] = z;
    }
  }

  // 17. Acropora Coral (Reef Lattice)
  private static generateCoral(pos: Float32Array, count: number): void {
    let idx = 0;
    const numStems = 7;
    const stemParticles = Math.floor(count / numStems);

    for (let s = 0; s < numStems; s++) {
      const angle = (s * 2.0 * Math.PI) / numStems;
      const lean = 0.4 + Math.random() * 0.3;

      for (let i = 0; i < stemParticles && idx < count * 3; i++) {
        const t = i / stemParticles;
        const h = -2.2 + t * 4.2;
        const spread = t * lean * 2.5;

        // Radial thickness with nodular bumps
        const rThickness = (0.35 + Math.sin(t * 18.0) * 0.08) * (1.2 - t * 0.4);
        const theta = Math.random() * Math.PI * 2;

        pos[idx++] = Math.cos(angle) * spread + Math.cos(theta) * rThickness;
        pos[idx++] = h + (Math.random() - 0.5) * 0.1;
        pos[idx++] = Math.sin(angle) * spread + Math.sin(theta) * rThickness;
      }
    }

    while (idx < count * 3) {
      pos[idx++] = (Math.random() - 0.5) * 0.8;
      pos[idx++] = -2.2;
      pos[idx++] = (Math.random() - 0.5) * 0.8;
    }
  }

  // 18. Rhodonea Rose (3D Botanical Petal Manifold)
  private static generateRose(pos: Float32Array, count: number): void {
    let idx = 0;
    const k = 4.0; // 4-petaled rose symmetry

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;
      const r = (1.2 + Math.cos(k * theta) * 0.8) * Math.cos(phi) * 1.8;

      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      const y = Math.sin(phi) * 1.5 + Math.sin(theta * 2.0) * 0.3;

      pos[idx++] = x;
      pos[idx++] = y;
      pos[idx++] = z;
    }
  }

  // 19. Emission Nebula
  private static generateNebula(pos: Float32Array, count: number): void {
    let idx = 0;
    const clouds = [
      new THREE.Vector3(-1.2, 0.4, 0.0),
      new THREE.Vector3(1.3, -0.3, 0.4),
      new THREE.Vector3(0.0, 1.1, -0.8)
    ];

    for (let i = 0; i < count; i++) {
      const center = clouds[Math.floor(Math.random() * clouds.length)];
      const u = Math.random();
      const r = Math.pow(u, 1.5) * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      // Filamentary wisps
      const wisp = Math.sin(theta * 6.0) * 0.3;

      pos[idx++] = center.x + (r + wisp) * Math.sin(phi) * Math.cos(theta);
      pos[idx++] = center.y + (r + wisp) * Math.sin(phi) * Math.sin(theta) * 0.6;
      pos[idx++] = center.z + (r + wisp) * Math.cos(phi);
    }
  }

  // 20. Magnetar Pulsar (Relativistic Polar Jets)
  private static generatePulsar(pos: Float32Array, count: number): void {
    let idx = 0;
    const coreCount = Math.floor(count * 0.3);
    const jetCount = count - coreCount;

    // Ultra-dense spherical neutron core
    for (let i = 0; i < coreCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 0.9;

      pos[idx++] = r * Math.sin(phi) * Math.cos(theta);
      pos[idx++] = r * Math.sin(phi) * Math.sin(theta);
      pos[idx++] = r * Math.cos(phi);
    }

    // High-speed dual polar collimated relativistic jets
    for (let i = 0; i < jetCount; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const dist = Math.pow(Math.random(), 0.7) * 4.4;
      const jetWidth = (dist / 4.4) * 0.45;
      const spiral = dist * 4.0;

      pos[idx++] = Math.cos(spiral) * jetWidth + (Math.random() - 0.5) * 0.08;
      pos[idx++] = side * (0.9 + dist);
      pos[idx++] = Math.sin(spiral) * jetWidth + (Math.random() - 0.5) * 0.08;
    }
  }

  // 21. Cosmic Web (Filamentary Dark Matter Backbone)
  private static generateCosmicWeb(pos: Float32Array, count: number): void {
    let idx = 0;
    const clusterNodes: THREE.Vector3[] = [];
    const numNodes = 12;

    for (let n = 0; n < numNodes; n++) {
      clusterNodes.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 5.6,
          (Math.random() - 0.5) * 4.2,
          (Math.random() - 0.5) * 5.6
        )
      );
    }

    const nodeCount = Math.floor(count * 0.4);
    const filamentCount = count - nodeCount;

    // Supercluster Nodes
    for (let i = 0; i < nodeCount; i++) {
      const c = clusterNodes[Math.floor(Math.random() * numNodes)];
      const r = Math.pow(Math.random(), 2.5) * 1.1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[idx++] = c.x + r * Math.sin(phi) * Math.cos(theta);
      pos[idx++] = c.y + r * Math.sin(phi) * Math.sin(theta);
      pos[idx++] = c.z + r * Math.cos(phi);
    }

    // Braided Intercluster Filaments
    for (let i = 0; i < filamentCount; i++) {
      const n1 = clusterNodes[Math.floor(Math.random() * numNodes)];
      const n2 = clusterNodes[Math.floor(Math.random() * numNodes)];
      const t = Math.random();

      const px = THREE.MathUtils.lerp(n1.x, n2.x, t);
      const py = THREE.MathUtils.lerp(n1.y, n2.y, t);
      const pz = THREE.MathUtils.lerp(n1.z, n2.z, t);

      const jitter = (Math.random() - 0.5) * 0.22;
      pos[idx++] = px + jitter;
      pos[idx++] = py + jitter;
      pos[idx++] = pz + jitter;
    }
  }

  // 22. Astral Crescent Moon
  private static generateCrescentMoon(pos: Float32Array, count: number): void {
    let idx = 0;
    const starCount = Math.floor(count * 0.15);
    const moonCount = count - starCount;

    // Crescent sickle
    for (let i = 0; i < moonCount; i++) {
      const t = (Math.random() - 0.5) * Math.PI * 1.35; // -120 to +120 degrees
      const rOuter = 2.6;
      const rInner = 2.1;
      const u = Math.random();

      // Outer circle centered at origin, inner circle offset to right
      const ox = Math.cos(t) * rOuter;
      const oy = Math.sin(t) * rOuter;
      const ix = Math.cos(t) * rInner + 0.85;
      const iy = Math.sin(t) * rInner;

      const px = THREE.MathUtils.lerp(ox, ix, u);
      const py = THREE.MathUtils.lerp(oy, iy, u);
      const zSpread = (1.0 - Math.abs(t) / (Math.PI * 0.7)) * 0.4;
      const pz = (Math.random() - 0.5) * zSpread;

      pos[idx++] = px - 0.4;
      pos[idx++] = py;
      pos[idx++] = pz;
    }

    // Five-pointed companion star inside crescent cavity
    for (let i = 0; i < starCount; i++) {
      const starAngle = Math.random() * Math.PI * 2;
      const pointHarmonic = Math.cos(starAngle * 5.0);
      const starR = (0.2 + 0.55 * Math.max(0.0, pointHarmonic)) * Math.random();

      pos[idx++] = 1.1 + Math.cos(starAngle) * starR;
      pos[idx++] = 0.2 + Math.sin(starAngle) * starR;
      pos[idx++] = (Math.random() - 0.5) * 0.15;
    }
  }

  // 23. Brilliant Cut Diamond
  private static generateDiamond(pos: Float32Array, count: number): void {
    let idx = 0;
    const tableRadius = 1.2;
    const girdleRadius = 2.2;
    const crownHeight = 1.1;
    const culetHeight = -2.2;

    for (let i = 0; i < count; i++) {
      const t = Math.random();
      const angle = Math.random() * Math.PI * 2;

      // Crown (upper table to girdle) vs Pavilion (girdle to culet point)
      if (Math.random() < 0.4) {
        // Crown facets
        const y = THREE.MathUtils.lerp(0.0, crownHeight, t);
        const r = THREE.MathUtils.lerp(girdleRadius, tableRadius, t);
        pos[idx++] = Math.cos(angle) * r;
        pos[idx++] = y;
        pos[idx++] = Math.sin(angle) * r;
      } else {
        // Pavilion conical facets
        const y = THREE.MathUtils.lerp(culetHeight, 0.0, t);
        const r = THREE.MathUtils.lerp(0.05, girdleRadius, t);
        pos[idx++] = Math.cos(angle) * r;
        pos[idx++] = y;
        pos[idx++] = Math.sin(angle) * r;
      }
    }
  }

  // 24. Taiji Yin-Yang
  private static generateYinYang(pos: Float32Array, count: number): void {
    let idx = 0;
    const R = 2.4;

    for (let i = 0; i < count; i++) {
      // Rejection sample inside circular disk of radius R
      let x = (Math.random() * 2 - 1) * R;
      let y = (Math.random() * 2 - 1) * R;
      while (x * x + y * y > R * R) {
        x = (Math.random() * 2 - 1) * R;
        y = (Math.random() * 2 - 1) * R;
      }

      // Check Yin vs Yang hemisphere
      const dUpperEye = Math.hypot(x, y - R * 0.5);
      const dLowerEye = Math.hypot(x, y + R * 0.5);

      // Subtle 3D wave curvature along S-curve
      const sCurve = Math.sin((y / R) * Math.PI);
      const zDepth = sCurve * 0.4 + (Math.random() - 0.5) * 0.15;

      // Eye voids or high-density poles
      if (dUpperEye < 0.25 || dLowerEye < 0.25) {
        pos[idx++] = x;
        pos[idx++] = y;
        pos[idx++] = zDepth * 1.5;
      } else {
        pos[idx++] = x;
        pos[idx++] = y;
        pos[idx++] = zDepth;
      }
    }
  }
}
