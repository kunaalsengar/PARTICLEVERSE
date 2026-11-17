export const particleVertexShader = `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uBaseSize;
  uniform float uMovementSpeed;
  uniform float uNoiseScale;
  uniform float uNoiseSpeed;
  uniform vec3 uMouse;
  uniform float uMouseRadius;
  uniform float uRepulsionStrength;
  uniform float uAttractionStrength;
  uniform float uMorphProgress;
  
  attribute vec3 aTargetPosition;
  attribute vec3 aRandomVec;
  attribute float aSizeOffset;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vDistanceToCamera;

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
    // Current base interpolated between current position and target position
    vec3 basePos = mix(position, aTargetPosition, uMorphProgress);

    // Autonomous living organic displacement
    float time = uTime * uNoiseSpeed * uMovementSpeed;
    float noise1 = snoise(basePos * uNoiseScale * 0.4 + vec3(time * 0.3));
    float noise2 = snoise(basePos * uNoiseScale * 0.8 + vec3(time * 0.5 + 10.0));
    float noise3 = snoise(basePos * uNoiseScale * 1.2 + vec3(time * 0.7 + 25.0));
    
    vec3 organicDisplacement = vec3(noise1, noise2, noise3) * (0.28 * aSizeOffset);
    vec3 pos = basePos + organicDisplacement;

    // Mouse interaction in 3D
    float mouseDist = distance(pos, uMouse);
    if (mouseDist < uMouseRadius) {
      vec3 dir = normalize(pos - uMouse);
      float falloff = smoothstep(uMouseRadius, 0.0, mouseDist);
      
      // Repulsion force pushing away from cursor
      pos += dir * falloff * uRepulsionStrength * 2.5;

      // Swirling vortex curl around the mouse
      vec3 vortex = cross(dir, vec3(0.0, 1.0, 0.0)) * falloff * 0.6;
      pos += vortex;
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Distance attenuation for depth perception
    float depthDist = -mvPosition.z;
    vDistanceToCamera = depthDist;

    // Size calculation with perspective divide
    float dynamicSize = uBaseSize * (0.7 + 0.6 * aSizeOffset);
    gl_PointSize = (dynamicSize * uPixelRatio * 300.0) / depthDist;
    gl_PointSize = clamp(gl_PointSize, 1.0, 64.0);

    vColor = aColor;
    
    // Depth-based subtle atmospheric falloff
    vAlpha = smoothstep(40.0, 2.0, depthDist);
  }
`;

export const particleFragmentShader = `
  uniform float uGlow;
  uniform vec3 uAmbientGlowColor;

  varying vec3 vColor;
  varying float vAlpha;
  varying float vDistanceToCamera;

  void main() {
    // Create crisp circular sprite with smooth anti-aliased edge and luminous core
    vec2 center = gl_PointCoord - vec2(0.5);
    float distSq = dot(center, center);
    
    if (distSq > 0.25) {
      discard;
    }

    float dist = sqrt(distSq);

    // Exponential glowing core
    float core = exp(-dist * 8.0);
    // Outer soft aura
    float aura = smoothstep(0.5, 0.0, dist);
    
    float intensity = core * 1.8 + aura * 0.4 * uGlow;

    // Blend base particle color with luminous ambient glow
    vec3 finalColor = mix(vColor, uAmbientGlowColor, 0.25) * intensity;

    gl_FragColor = vec4(finalColor, vAlpha * aura);
  }
`;
