export const particleVertexShader = `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uBaseSize;
  uniform float uMovementSpeed;
  uniform float uNoiseScale;
  uniform float uNoiseSpeed;

  // Phase 03 Advanced Morph Uniforms
  uniform float uMorphProgress; // 0.0 to 1.0
  uniform int uMorphStyle;       // 0 = smooth, 1 = spiral, 2 = explosive, 3 = wave, 4 = dissolve
  uniform int uFormationType;    // 0 = heart, 1 = butterfly, 2 = helix

  // Phase 02 Physics Uniforms
  uniform float uPhysicsEnabled;
  uniform int uInteractionMode; // 0 = repulsion, 1 = attraction, 2 = vortex, 3 = hybrid
  uniform vec3 uMouse;
  uniform float uMouseRadius;
  uniform float uRepulsionStrength;
  uniform float uAttractionStrength;
  uniform float uVortexStrength;
  uniform float uVortexDirection; // 1.0 or -1.0
  uniform float uGravity;
  uniform float uDamping;

  // Explosion & Shockwave
  uniform float uExplosionProgress; // 0.0 to 1.0
  uniform float uExplosionIntensity;
  uniform vec3 uExplosionOrigin;

  attribute vec3 aTargetPosition;
  attribute vec3 aRandomVec;
  attribute float aSizeOffset;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vDistanceToCamera;
  varying float vEnergyPulse;
  varying float vColorReveal;

  // Simplex 3D noise functions
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    // ----------------------------------------------------
    // PHASE 03: 5 3D GPU MORPH TRANSITION STYLES
    // ----------------------------------------------------
    vec3 basePos = position;
    float energyPulse = 0.0;
    float t = uMorphProgress;
    float midPhase = sin(t * 3.14159265);

    // Style 0: Smooth standard nonlinear interpolation
    if (uMorphStyle == 0) {
      basePos = mix(position, aTargetPosition, t);
    }
    // Style 1: Spiral morph (helical angular curl around central Y-axis)
    else if (uMorphStyle == 1) {
      vec3 interpolated = mix(position, aTargetPosition, t);
      float spiralAngle = midPhase * 3.14159265 * (1.2 + 0.3 * aSizeOffset);
      float cosA = cos(spiralAngle);
      float sinA = sin(spiralAngle);

      basePos = vec3(
        interpolated.x * cosA - interpolated.z * sinA,
        interpolated.y + midPhase * 0.4 * aRandomVec.y,
        interpolated.x * sinA + interpolated.z * cosA
      );
      energyPulse += midPhase * 0.5;
    }
    // Style 2: Explosive morph (radial kinetic blast dispersion before re-coalescing)
    else if (uMorphStyle == 2) {
      vec3 directInterp = mix(position, aTargetPosition, t);
      vec3 blastDir = normalize(position + aRandomVec * 0.5);
      vec3 blastDisplacement = (blastDir * 3.2 + aRandomVec * 1.5) * midPhase;
      basePos = directInterp + blastDisplacement;
      energyPulse += midPhase * 0.8;
    }
    // Style 3: Wave morph (traveling vertical directional wave sweeping bottom-to-top)
    else if (uMorphStyle == 3) {
      // Normalize position.y from -3.0 to 3.0 into [0, 0.6] wave offset
      float waveOffset = clamp((position.y + 3.0) / 6.0, 0.0, 0.6) * 0.6;
      float localProgress = clamp((t - waveOffset) / 0.4, 0.0, 1.0);
      float smoothLocal = smoothstep(0.0, 1.0, localProgress);
      basePos = mix(position, aTargetPosition, smoothLocal);

      // Luminous wavefront crest
      float crest = sin(smoothLocal * 3.14159265);
      energyPulse += crest * 0.6;
    }
    // Style 4: Dissolve and reform (quantum Brownian drift & re-condensation)
    else if (uMorphStyle == 4) {
      vec3 directInterp = mix(position, aTargetPosition, t);
      float noiseX = snoise(position * 1.5 + vec3(t * 3.0));
      float noiseY = snoise(position * 1.5 + vec3(t * 3.0 + 10.0));
      float noiseZ = snoise(position * 1.5 + vec3(t * 3.0 + 20.0));
      vec3 dissolveDrift = vec3(noiseX, noiseY, noiseZ) * (midPhase * 2.8);
      basePos = directInterp + dissolveDrift;
      energyPulse += midPhase * 0.7;
    } else {
      basePos = mix(position, aTargetPosition, t);
    }

    // Autonomous living organic displacement
    float time = uTime * uNoiseSpeed * uMovementSpeed;
    float noise1 = snoise(basePos * uNoiseScale * 0.4 + vec3(time * 0.3));
    float noise2 = snoise(basePos * uNoiseScale * 0.8 + vec3(time * 0.5 + 10.0));
    float noise3 = snoise(basePos * uNoiseScale * 1.2 + vec3(time * 0.7 + 25.0));

    vec3 organicDisplacement = vec3(noise1, noise2, noise3) * (0.06 * aSizeOffset);
    vec3 pos = basePos + organicDisplacement;

    // ----------------------------------------------------
    // PHASE 02: ADVANCED PHYSICS CALCULATIONS
    // ----------------------------------------------------
    if (uPhysicsEnabled > 0.5) {
      // 1. Mouse Interaction Force Fields
      float mouseDist = distance(pos, uMouse);
      if (mouseDist < uMouseRadius) {
        vec3 toMouse = uMouse - pos;
        vec3 fromMouse = -toMouse;
        vec3 dirFromMouse = normalize(fromMouse);
        vec3 dirToMouse = normalize(toMouse);
        float falloff = smoothstep(uMouseRadius, 0.0, mouseDist);

        if (uInteractionMode == 0) {
          pos += dirFromMouse * falloff * uRepulsionStrength * 4.0;
        } else if (uInteractionMode == 1) {
          float clampedDist = max(mouseDist, 0.3);
          float attractFalloff = smoothstep(uMouseRadius, 0.2, clampedDist);
          pos += dirToMouse * attractFalloff * uAttractionStrength * 3.5;
          vec3 orbitAxis = vec3(0.0, 1.0, 0.0);
          vec3 tangent = cross(dirToMouse, orbitAxis);
          pos += tangent * attractFalloff * 0.4;
        } else if (uInteractionMode == 2) {
          vec3 vortexAxis = vec3(0.0, 1.0, 0.0);
          vec3 tangentialForce = cross(dirFromMouse, vortexAxis) * uVortexDirection;
          vec3 inwardPull = dirToMouse * 0.35;
          pos += (tangentialForce + inwardPull) * falloff * uVortexStrength * 3.0;
        } else if (uInteractionMode == 3) {
          vec3 vortexAxis = vec3(0.0, 1.0, 0.0);
          vec3 tangentialForce = cross(dirFromMouse, vortexAxis) * uVortexDirection;
          pos += (tangentialForce * uVortexStrength * 1.8 + dirToMouse * uAttractionStrength * 2.0) * falloff;
        }

        energyPulse += falloff * 0.5;
      }

      // 2. Gravitational Acceleration Field
      if (uGravity > 0.001) {
        float gravityOffset = uGravity * 3.0;
        pos.y -= gravityOffset * (0.8 + 0.4 * aSizeOffset);
        if (pos.y < -3.5) {
          pos.y = -3.5 + abs(pos.y + 3.5) * 0.2;
        }
      }

      // 3. Cinematic Explosion & Shockwave Dynamics
      if (uExplosionProgress > 0.001 && uExplosionProgress < 0.999) {
        float blastPhase = sin(uExplosionProgress * 3.14159265);
        vec3 explosionDir = normalize(pos - uExplosionOrigin + aRandomVec * 0.35);
        float blastRadius = uExplosionProgress * 12.0;
        float distToExplosion = distance(pos, uExplosionOrigin);
        float waveDist = abs(distToExplosion - blastRadius);
        float shockwave = smoothstep(1.5, 0.0, waveDist) * blastPhase;

        vec3 blastDisplacement = explosionDir * blastPhase * uExplosionIntensity * (1.0 + aSizeOffset * 0.5);
        blastDisplacement += aRandomVec * blastPhase * 1.2;

        pos += blastDisplacement;
        energyPulse += shockwave * 1.5 + blastPhase * 0.8;
      }
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depthDist = -mvPosition.z;
    vDistanceToCamera = depthDist;

    float dynamicSize = uBaseSize * (0.7 + 0.6 * aSizeOffset) * (1.0 + energyPulse * 0.8);
    gl_PointSize = (dynamicSize * uPixelRatio * 22.0) / depthDist;
    gl_PointSize = clamp(gl_PointSize, 1.5, 36.0);

    // ----------------------------------------------------
    // CURSOR-BASED DYNAMIC COLOUR REVEAL EFFECT
    // ----------------------------------------------------
    // Pointer proximity in 3D local coordinate space
    float distToMouse = distance(pos, uMouse);

    // Interaction radius with smooth Hermite falloff (GLSL compliant edge0 < edge1)
    // Clamped so proximity colors only a local region (~30-35% of the 4.0-unit formation)
    float revealRadius = min(uMouseRadius * 0.45, 1.4);
    float colorReveal = 1.0 - smoothstep(0.35, revealRadius, distToMouse);

    // Default appearance: pure neutral white
    vec3 neutralColor = vec3(0.96, 0.98, 1.0);

    // Tailored colour palettes per formation
    vec3 formationColor = vec3(1.0);

    // 1. Heart: Red, pink, and magenta
    if (uFormationType == 0) {
      float angle = atan(pos.y, pos.x) / 6.2831853 + 0.5;
      float t = fract(angle * 2.0 + pos.y * 0.25 + aSizeOffset * 0.35 + uTime * 0.05);
      vec3 deepRed = vec3(1.0, 0.05, 0.22);
      vec3 magenta = vec3(1.0, 0.12, 0.72);
      vec3 hotPink = vec3(1.0, 0.45, 0.85);
      if (t < 0.5) {
        formationColor = mix(deepRed, magenta, t * 2.0);
      } else {
        formationColor = mix(magenta, hotPink, (t - 0.5) * 2.0);
      }
    }
    // 2. Butterfly: Cyan, blue, violet, and pink
    else if (uFormationType == 1) {
      float wingDist = length(pos.xy) * 0.4;
      float t = fract(wingDist + aSizeOffset * 0.35 + uTime * 0.06);
      vec3 cyan = vec3(0.0, 0.92, 1.0);
      vec3 blue = vec3(0.10, 0.38, 1.0);
      vec3 violet = vec3(0.65, 0.12, 1.0);
      vec3 neonPink = vec3(1.0, 0.25, 0.78);
      if (t < 0.33) {
        formationColor = mix(cyan, blue, t * 3.0);
      } else if (t < 0.66) {
        formationColor = mix(blue, violet, (t - 0.33) * 3.0);
      } else {
        formationColor = mix(violet, neonPink, (t - 0.66) * 3.0);
      }
    }
    // 3. Double Helix: Cyan and violet contrasting strands
    else {
      // In double helix, the two intertwined spiral strands alternate in angular phase (pitch k = 3.534)
      float strandPhase = sin(atan(pos.z, pos.x) - pos.y * 3.534);
      float strandFactor = smoothstep(-0.2, 0.2, strandPhase);
      vec3 electricCyan = vec3(0.0, 0.95, 1.0);
      vec3 radiantViolet = vec3(0.85, 0.15, 1.0);
      formationColor = mix(electricCyan, radiantViolet, strandFactor);
    }

    // When pointer is away (colorReveal == 0.0), all particles remain pure neutral white!
    // When pointer approaches, only particles within interaction radius smoothly reveal color!
    vColor = mix(neutralColor, formationColor, colorReveal);
    vColorReveal = colorReveal;

    vEnergyPulse = energyPulse;
    vAlpha = smoothstep(45.0, 2.0, depthDist);
  }
`;

export const particleFragmentShader = `
  uniform float uGlow;
  uniform vec3 uAmbientGlowColor;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vDistanceToCamera;
  varying float vEnergyPulse;
  varying float vColorReveal;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float distSq = dot(center, center);

    if (distSq > 0.25) {
      discard;
    }

    float dist = sqrt(distSq);

    // Exponential glowing core
    float core = exp(-dist * 7.5);
    float aura = smoothstep(0.5, 0.0, dist);

    // Controlled radiance that preserves rich hue without additive blowout
    float brightness = core * 0.95 + aura * 0.4 * uGlow + vEnergyPulse * 0.6;

    // Preserves vibrant saturation in revealed particles
    vec3 finalColor = vColor * brightness;

    gl_FragColor = vec4(finalColor, vAlpha * aura * 0.85);
  }
`;
