import * as THREE from 'three';
import { FormationType } from '../types';

export class FormationEngine {
  /**
   * Generates position array [x, y, z, x, y, z...] for a specified formation and particle count.
   */
  public static generatePositions(type: FormationType, count: number): Float32Array {
    const positions = new Float32Array(count * 3);

    switch (type) {
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
      default:
        this.generateSpider(positions, count);
        break;
    }

    return positions;
  }

  // 1. Spider Organism: Biomechanical arachnid with cephalothorax, abdomen, 8 articulated segmented legs & spiky fangs
  private static generateSpider(pos: Float32Array, count: number): void {
    const thoraxCount = Math.floor(count * 0.15);
    const abdomenCount = Math.floor(count * 0.25);
    const legCount = Math.floor(count * 0.55);

    let idx = 0;

    // Cephalothorax (central anterior mass)
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

    // Abdomen (posterior larger bulbous mass)
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

    // 8 Articulated Spiky Arachnid Legs
    const particlesPerLeg = Math.floor(legCount / 8);
    for (let leg = 0; leg < 8; leg++) {
      const side = leg < 4 ? 1 : -1;
      const legIndexOnSide = leg % 4;
      const baseAngle = ((legIndexOnSide - 1.5) * 0.45) * Math.PI * 0.5;
      
      // Arc coordinates
      for (let i = 0; i < particlesPerLeg; i++) {
        const t = i / particlesPerLeg; // 0 to 1 along leg
        
        // Kinematic segments: coxa -> femur (up and out) -> tibia (down and out) -> tarsus (sharp tip)
        let lx = side * (0.6 + t * 3.4 * (1.0 + Math.sin(baseAngle) * 0.3));
        let ly = 0.2 + Math.sin(t * Math.PI * 0.8) * 1.6 - Math.pow(t, 2.2) * 2.5;
        let lz = Math.cos(baseAngle) * (0.8 + t * 2.4) - 0.2;

        // Spiky organic jitter
        const jitter = (Math.random() - 0.5) * 0.12 * (1.0 - t * 0.5);
        pos[idx++] = lx + jitter;
        pos[idx++] = ly + jitter;
        pos[idx++] = lz + jitter;
      }
    }

    // Spiky chelicerae / fangs
    while (idx < count * 3) {
      const side = Math.random() > 0.5 ? 1 : -1;
      const t = Math.random();
      pos[idx++] = side * (0.2 + t * 0.3);
      pos[idx++] = -0.3 - t * 0.8 + (Math.random() - 0.5) * 0.1;
      pos[idx++] = 1.3 + t * 0.5;
    }
  }

  // 2. Neural Network: Cortical clustered nodes + synaptic connecting fibers
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

    // Cluster nodes
    for (let i = 0; i < nodeParticles; i++) {
      const center = centers[Math.floor(Math.random() * clusterCount)];
      const r = Math.pow(Math.random(), 2.0) * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[idx++] = center.x + r * Math.sin(phi) * Math.cos(theta);
      pos[idx++] = center.y + r * Math.sin(phi) * Math.sin(theta);
      pos[idx++] = center.z + r * Math.cos(phi);
    }

    // Synaptic axonic fibers between clusters
    for (let i = 0; i < fiberParticles; i++) {
      const c1 = centers[Math.floor(Math.random() * clusterCount)];
      const c2 = centers[Math.floor(Math.random() * clusterCount)];
      const t = Math.random();

      // Curved spline path with noise
      const cx = THREE.MathUtils.lerp(c1.x, c2.x, t);
      const cy = THREE.MathUtils.lerp(c1.y, c2.y, t) + Math.sin(t * Math.PI) * 0.4;
      const cz = THREE.MathUtils.lerp(c1.z, c2.z, t);

      pos[idx++] = cx + (Math.random() - 0.5) * 0.15;
      pos[idx++] = cy + (Math.random() - 0.5) * 0.15;
      pos[idx++] = cz + (Math.random() - 0.5) * 0.15;
    }
  }

  // 3. Spiral Galaxy: Logarithmic dual spiral arms + core bulge
  private static generateGalaxy(pos: Float32Array, count: number): void {
    let idx = 0;
    const arms = 2;
    const maxRadius = 4.2;

    for (let i = 0; i < count; i++) {
      // Exponential distribution towards core
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

  // 4. Double Helix: DNA strands with periodic base connectors
  private static generateHelix(pos: Float32Array, count: number): void {
    let idx = 0;
    const strandParticles = Math.floor(count * 0.7);
    const rungParticles = count - strandParticles;

    for (let i = 0; i < strandParticles; i++) {
      const strand = i % 2;
      const t = (i / strandParticles) * Math.PI * 8; // 4 full turns
      const radius = 1.6;
      const y = ((i / strandParticles) - 0.5) * 6.5;
      const phase = strand * Math.PI;

      const x = Math.cos(t + phase) * radius;
      const z = Math.sin(t + phase) * radius;

      pos[idx++] = x + (Math.random() - 0.5) * 0.12;
      pos[idx++] = y + (Math.random() - 0.5) * 0.12;
      pos[idx++] = z + (Math.random() - 0.5) * 0.12;
    }

    for (let i = 0; i < rungParticles; i++) {
      const rungIndex = Math.floor(Math.random() * 32);
      const t = (rungIndex / 32) * Math.PI * 8;
      const y = ((rungIndex / 32) - 0.5) * 6.5;
      const lerpVal = Math.random() * 2 - 1; // -1 to 1

      const x = Math.cos(t) * 1.6 * lerpVal;
      const z = Math.sin(t) * 1.6 * lerpVal;

      pos[idx++] = x + (Math.random() - 0.5) * 0.08;
      pos[idx++] = y + (Math.random() - 0.5) * 0.08;
      pos[idx++] = z + (Math.random() - 0.5) * 0.08;
    }
  }

  // 5. Geodesic Sphere: Fibonacci distribution with harmonic relief
  private static generateSphere(pos: Float32Array, count: number): void {
    let idx = 0;
    const phi = Math.PI * (3.0 - Math.sqrt(5.0)); // Golden ratio angle

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2; // -1 to 1
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

  // 6. Tesseract / Hypercube: Orthogonal lattice with nested inner cube
  private static generateCube(pos: Float32Array, count: number): void {
    let idx = 0;
    const innerRatio = 0.55;
    const outerSize = 2.4;

    for (let i = 0; i < count; i++) {
      const isInner = Math.random() > 0.65;
      const size = isInner ? outerSize * innerRatio : outerSize;

      // Place mostly on edges and faces
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

  // 7. Torus: Tokamak containment doughnut
  private static generateTorus(pos: Float32Array, count: number): void {
    let idx = 0;
    const R = 2.2; // Major radius
    const r = 0.85; // Minor radius

    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      const thickness = r * (0.8 + Math.random() * 0.4);

      pos[idx++] = (R + thickness * Math.cos(v)) * Math.cos(u);
      pos[idx++] = thickness * Math.sin(v);
      pos[idx++] = (R + thickness * Math.cos(v)) * Math.sin(u);
    }
  }

  // 8. 3D Heart: Parametric cardioid manifold
  private static generateHeart(pos: Float32Array, count: number): void {
    let idx = 0;
    const scale = 0.16;

    for (let i = 0; i < count; i++) {
      const t = Math.random() * Math.PI * 2;
      // Parametric cardioid formula
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      
      // Volume extrusion along z with tapering
      const zSpread = (1 - Math.abs(x) / 18) * 6.0;
      const z = (Math.random() - 0.5) * zSpread;

      pos[idx++] = x * scale;
      pos[idx++] = y * scale + 0.3;
      pos[idx++] = z * scale;
    }
  }

  // 9. Infinity / Mobius Lemniscate: Non-orientable ribbon
  private static generateInfinity(pos: Float32Array, count: number): void {
    let idx = 0;
    const scale = 2.4;

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      const denom = 1 + Math.sin(t) * Math.sin(t);
      const x = (scale * Math.cos(t)) / denom;
      const z = (scale * Math.sin(t) * Math.cos(t)) / denom;
      
      // 3D ribbon depth & twist
      const v = (Math.random() - 0.5) * 0.45;
      const y = Math.sin(t * 2.0) * 0.5 + v;

      pos[idx++] = x;
      pos[idx++] = y;
      pos[idx++] = z * 1.5;
    }
  }

  // 10. Star / Stellated Octahedron with relativistic jets
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
        // Core stellar nucleus
        const r = Math.pow(Math.random(), 2.0) * 0.9;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[idx++] = r * Math.sin(phi) * Math.cos(theta);
        pos[idx++] = r * Math.sin(phi) * Math.sin(theta);
        pos[idx++] = r * Math.cos(phi);
      } else {
        // High-energy spikes along rays
        const ray = rays[Math.floor(Math.random() * rayCount)];
        const dist = Math.pow(Math.random(), 0.6) * 3.8;
        const spread = Math.pow(1.0 - dist / 3.8, 1.5) * 0.35;
        
        pos[idx++] = ray.x * dist + (Math.random() - 0.5) * spread;
        pos[idx++] = ray.y * dist + (Math.random() - 0.5) * spread;
        pos[idx++] = ray.z * dist + (Math.random() - 0.5) * spread;
      }
    }
  }

  // 11. Chaos Butterfly: Lorenz attractor dynamic wings
  private static generateButterfly(pos: Float32Array, count: number): void {
    let idx = 0;
    let x = 0.1, y = 0.0, z = 0.0;
    const dt = 0.008;
    const sigma = 10.0;
    const rho = 28.0;
    const beta = 8.0 / 3.0;

    // Warm up attractor
    for (let k = 0; k < 200; k++) {
      const dx = sigma * (y - x) * dt;
      const dy = (x * (rho - z) - y) * dt;
      const dz = (x * y - beta * z) * dt;
      x += dx; y += dy; z += dz;
    }

    const scale = 0.11;

    for (let i = 0; i < count; i++) {
      // Step Lorenz system multiple times for even point distribution
      for (let s = 0; s < 4; s++) {
        const dx = sigma * (y - x) * dt;
        const dy = (x * (rho - z) - y) * dt;
        const dz = (x * y - beta * z) * dt;
        x += dx; y += dy; z += dz;
      }

      pos[idx++] = x * scale;
      pos[idx++] = (z - 25.0) * scale;
      pos[idx++] = y * scale;
    }
  }
}
