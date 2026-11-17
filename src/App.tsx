import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

type Formation = "heart" | "butterfly" | "helix";
type RGB = [number, number, number];
type Engine = "particles" | "physics" | "formations";

type EngineSettings = {
  particleScale: number;
  bloom: number;
  repulsion: number;
  buoyancy: number;
  returnForce: number;
};

type BaseParticle = {
  x: number;
  y: number;
  z: number;
  color: RGB;
  reveal: number;
  size: number;
};

type Particle = BaseParticle & {
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  targetColor: RGB;
  driftPhase: number;
  driftRate: number;
  buoyancy: number;
};

const PARTICLE_COUNT = 20_000;

const FORMATIONS: { id: Formation; label: string; file: string }[] = [
  { id: "heart", label: "Heart", file: "/Heart.svg" },
  { id: "butterfly", label: "Butterfly", file: "/Butterfly.svg" },
  { id: "helix", label: "Double Helix", file: "/Double-Helix.svg" },
];

const PALETTES: Record<Formation, RGB[]> = {
  heart: [
    [220, 20, 60],
    [255, 60, 145],
    [236, 28, 255],
  ],
  butterfly: [
    [24, 240, 255],
    [30, 115, 255],
    [139, 61, 255],
    [255, 62, 183],
  ],
  helix: [
    [31, 235, 255],
    [158, 74, 255],
  ],
};

const WING_PATHS = [
  "M382 420C290 390 102 325 116 156C125 49 252 74 332 177C373 230 387 323 382 420Z",
  "M378 420C284 414 132 421 143 556C155 682 291 644 358 535C378 502 385 457 378 420Z",
  "M418 420C510 390 698 325 684 156C675 49 548 74 468 177C427 230 413 323 418 420Z",
  "M422 420C516 414 668 421 657 556C645 682 509 644 442 535C422 502 415 457 422 420Z",
];

function seededRandom(seed = 7231) {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function colorMix(a: RGB, b: RGB, amount: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * amount),
    Math.round(a[1] + (b[1] - a[1]) * amount),
    Math.round(a[2] + (b[2] - a[2]) * amount),
  ];
}

function buildHeart(): BaseParticle[] {
  const random = seededRandom(193);
  const particles: BaseParticle[] = [];
  const palette = PALETTES.heart;

  while (particles.length < PARTICLE_COUNT) {
    const x = random() * 2.5 - 1.25;
    const y = random() * 2.35 - 1.15;
    const expression = (x * x + y * y - 1) ** 3 - x * x * y ** 3;
    if (expression <= 0) {
      const band = Math.min(1.999, ((x + 1.25) / 2.5) * 2);
      const index = Math.floor(band);
      particles.push({
        x: x * 0.76,
        y: -y * 0.76 + 0.04,
        z: (random() - 0.5) * (0.42 - Math.min(0.2, Math.abs(x) * 0.1)),
        color: colorMix(palette[index], palette[index + 1], band - index),
        reveal: 0,
        size: 0.55 + random() * 0.8,
      });
    }
  }
  return particles;
}

function buildButterfly(): BaseParticle[] {
  const random = seededRandom(287);
  const particles: BaseParticle[] = [];
  const paths = WING_PATHS.map((path) => new Path2D(path));
  const hitCanvas = document.createElement("canvas");
  const context = hitCanvas.getContext("2d")!;
  const palette = PALETTES.butterfly;

  while (particles.length < 18_700) {
    const px = 90 + random() * 620;
    const py = 55 + random() * 610;
    const wing = paths.findIndex((path) => context.isPointInPath(path, px, py));
    if (wing !== -1) {
      const mix = Math.min(2.999, ((px - 90) / 620) * 3);
      const index = Math.floor(mix);
      particles.push({
        x: (px - 400) / 350,
        y: (py - 390) / 350,
        z:
          Math.cos(Math.min(1, Math.abs(px - 400) / 320) * (Math.PI / 2)) * 0.24 +
          (random() - 0.5) * 0.08,
        color: colorMix(palette[index], palette[index + 1], mix - index),
        reveal: 0,
        size: 0.5 + random() * 0.75,
      });
    }
  }

  while (particles.length < PARTICLE_COUNT) {
    const bodyParticle = particles.length < 19_700;
    const angle = random() * Math.PI * 2;
    if (bodyParticle) {
      const radius = Math.sqrt(random());
      particles.push({
        x: Math.cos(angle) * 0.045 * radius,
        y: -0.67 + random() * 1.26 + Math.sin(angle) * 0.02,
        z: (random() - 0.5) * 0.09,
        color: [139, 61, 255],
        reveal: 0,
        size: 0.7 + random() * 0.7,
      });
    } else {
      const side = particles.length % 2 ? -1 : 1;
      const t = random();
      particles.push({
        x: side * (0.03 + t * 0.22) + Math.sin(t * Math.PI) * side * 0.025,
        y: -0.72 - t * 0.25,
        z: (random() - 0.5) * 0.05,
        color: side > 0 ? palette[0] : palette[3],
        reveal: 0,
        size: 0.55 + random() * 0.55,
      });
    }
  }
  return particles;
}

function buildHelix(): BaseParticle[] {
  const random = seededRandom(491);
  const particles: BaseParticle[] = [];
  const turns = Math.PI * 4.5;

  for (let strand = 0; strand < 2; strand++) {
    for (let i = 0; i < 6_700; i++) {
      const t = random() * 2 - 1;
      const phase = t * turns + strand * Math.PI;
      const depth = Math.cos(phase);
      particles.push({
        x: Math.sin(phase) * 0.52 + (random() - 0.5) * 0.032,
        y: t * 0.93 + (random() - 0.5) * 0.012,
        z: depth * 0.32 + (random() - 0.5) * 0.035,
        color: PALETTES.helix[strand],
        reveal: 0,
        size: 0.65 + (depth + 1) * 0.34 + random() * 0.25,
      });
    }
  }

  const rungs = 24;
  while (particles.length < PARTICLE_COUNT) {
    const rung = Math.floor(random() * rungs);
    const t = -0.9 + (rung / (rungs - 1)) * 1.8;
    const phase = t * turns;
    const x1 = Math.sin(phase) * 0.52;
    const x2 = -x1;
    const z1 = Math.cos(phase) * 0.32;
    const along = random();
    particles.push({
      x: x1 + (x2 - x1) * along + (random() - 0.5) * 0.014,
      y: t + (random() - 0.5) * 0.018,
      z: z1 + (-z1 - z1) * along + (random() - 0.5) * 0.014,
      color: colorMix(PALETTES.helix[0], PALETTES.helix[1], along),
      reveal: 0,
      size: 0.42 + random() * 0.52,
    });
  }
  return particles;
}

function createFormation(formation: Formation): Particle[] {
  const baseParticles =
    formation === "heart"
      ? buildHeart()
      : formation === "butterfly"
        ? buildButterfly()
        : buildHelix();
  const random = seededRandom(formation === "heart" ? 811 : formation === "butterfly" ? 977 : 1151);

  return baseParticles.map((particle) => ({
    ...particle,
    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,
    velocityX: 0,
    velocityY: 0,
    velocityZ: 0,
    targetX: particle.x,
    targetY: particle.y,
    targetZ: particle.z,
    targetColor: particle.color,
    driftPhase: random() * Math.PI * 2,
    driftRate: 0.45 + random() * 0.9,
    buoyancy: 0.3 + random() * 0.7,
  }));
}

function ParticleField({
  formation,
  settings,
}: {
  formation: Formation;
  settings: EngineSettings;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: -1000, y: -1000, active: false });
  const requestedFormation = useRef(formation);
  const settingsRef = useRef(settings);
  const zoomRef = useRef(1);

  requestedFormation.current = formation;
  settingsRef.current = settings;

  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext("2d", { alpha: false })!;
    let activeFormation = requestedFormation.current;
    let particles = createFormation(activeFormation);
    let frame = 0;
    let width = 0;
    let height = 0;
    let scale = 1;
    let centerX = 0;
    let centerY = 0;
    let lastTime = performance.now();
    const camera = { yaw: 0, pitch: 0 };
    const random = seededRandom(4201);
    const stars = Array.from({ length: 180 }, () => ({
      x: random(),
      y: random(),
      z: random(),
      size: 0.25 + random() * 0.75,
    }));
    const screenX = new Float32Array(PARTICLE_COUNT);
    const screenY = new Float32Array(PARTICLE_COUNT);
    const screenSize = new Float32Array(PARTICLE_COUNT);
    const screenAlpha = new Float32Array(PARTICLE_COUNT);
    const glowCache = new Map<string, HTMLCanvasElement>();

    const getGlow = (red: number, green: number, blue: number) => {
      const qr = Math.round(red / 32) * 32;
      const qg = Math.round(green / 32) * 32;
      const qb = Math.round(blue / 32) * 32;
      const key = `${qr}-${qg}-${qb}`;
      const cached = glowCache.get(key);
      if (cached) return cached;

      const glow = document.createElement("canvas");
      glow.width = 40;
      glow.height = 40;
      const glowContext = glow.getContext("2d")!;
      const gradient = glowContext.createRadialGradient(20, 20, 0, 20, 20, 20);
      gradient.addColorStop(0, `rgba(${qr},${qg},${qb},0.75)`);
      gradient.addColorStop(0.18, `rgba(${qr},${qg},${qb},0.28)`);
      gradient.addColorStop(1, `rgba(${qr},${qg},${qb},0)`);
      glowContext.fillStyle = gradient;
      glowContext.fillRect(0, 0, 40, 40);
      glowCache.set(key, glow);
      return glow;
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      scale = Math.min(width * 0.36, height * 0.39);
      centerX = width / 2;
      centerY = height * (width < 640 ? 0.49 : 0.52);
    };

    const render = (time: number) => {
      const delta = Math.min(1.8, Math.max(0.35, (time - lastTime) / 16.667));
      lastTime = time;

      if (requestedFormation.current !== activeFormation) {
        const targets = createFormation(requestedFormation.current);
        for (let index = 0; index < particles.length; index++) {
          particles[index].targetX = targets[index].x;
          particles[index].targetY = targets[index].y;
          particles[index].targetZ = targets[index].z;
          particles[index].targetColor = targets[index].color;
          particles[index].driftPhase += (targets[index].driftPhase - Math.PI) * 0.12;
        }
        activeFormation = requestedFormation.current;
      }

      context.fillStyle = "#000000";
      context.fillRect(0, 0, width, height);

      const pointer = pointerRef.current;
      const controls = settingsRef.current;
      const radius = Math.max(95, Math.min(width, height) * 0.17);
      const spring = 0.012 * controls.returnForce * delta;
      const damping = Math.pow(0.91, delta);
      const cameraTargetYaw = pointer.active ? (pointer.x / width - 0.5) * 0.22 : 0;
      const cameraTargetPitch = pointer.active ? (pointer.y / height - 0.5) * -0.15 : 0;
      camera.yaw += (cameraTargetYaw - camera.yaw) * 0.025 * delta;
      camera.pitch += (cameraTargetPitch - camera.pitch) * 0.025 * delta;
      const cosineYaw = Math.cos(camera.yaw);
      const sineYaw = Math.sin(camera.yaw);
      const cosinePitch = Math.cos(camera.pitch);
      const sinePitch = Math.sin(camera.pitch);
      const zoom = zoomRef.current;

      const atmosphere = context.createRadialGradient(
        centerX,
        centerY,
        scale * 0.08,
        centerX,
        centerY,
        scale * 1.3,
      );
      atmosphere.addColorStop(0, "rgba(125,145,180,0.025)");
      atmosphere.addColorStop(0.55, "rgba(55,70,105,0.012)");
      atmosphere.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = atmosphere;
      context.fillRect(0, 0, width, height);

      context.fillStyle = "rgba(255,255,255,0.24)";
      for (const star of stars) {
        const parallaxX = camera.yaw * (star.z - 0.5) * 120;
        const parallaxY = camera.pitch * (star.z - 0.5) * 90;
        context.globalAlpha = 0.08 + star.z * 0.2;
        context.fillRect(
          star.x * width + parallaxX,
          star.y * height + parallaxY,
          star.size,
          star.size,
        );
      }
      context.globalAlpha = 1;

      for (let index = 0; index < particles.length; index++) {
        const particle = particles[index];
        const morphSpeed = (0.016 + particle.buoyancy * 0.008) * delta;
        particle.x += (particle.targetX - particle.x) * morphSpeed;
        particle.y += (particle.targetY - particle.y) * morphSpeed;
        particle.z += (particle.targetZ - particle.z) * morphSpeed;
        particle.color[0] += (particle.targetColor[0] - particle.color[0]) * morphSpeed;
        particle.color[1] += (particle.targetColor[1] - particle.color[1]) * morphSpeed;
        particle.color[2] += (particle.targetColor[2] - particle.color[2]) * morphSpeed;

        const breathing =
          Math.sin(time * 0.00045 * particle.driftRate + particle.driftPhase) * 0.006;
        const worldZ = particle.z + breathing + particle.offsetZ / Math.max(scale, 1);
        const rotatedX = particle.x * cosineYaw + worldZ * sineYaw;
        const yawZ = -particle.x * sineYaw + worldZ * cosineYaw;
        const rotatedY = particle.y * cosinePitch - yawZ * sinePitch;
        const rotatedZ = particle.y * sinePitch + yawZ * cosinePitch;
        const perspective = 2.8 / Math.max(1.8, 2.8 + rotatedZ);
        const baseX = centerX + rotatedX * scale * perspective * zoom;
        const baseY = centerY + rotatedY * scale * perspective * zoom;
        const currentX = baseX + particle.offsetX;
        const currentY = baseY + particle.offsetY;
        const dx = currentX - pointer.x;
        const dy = currentY - pointer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const normalized = Math.max(0, Math.min(1, 1 - distance / radius));
        const target = pointer.active ? normalized * normalized * (3 - 2 * normalized) : 0;
        particle.reveal +=
          (target - particle.reveal) * (target > particle.reveal ? 0.12 * delta : 0.048 * delta);

        if (target > 0) {
          const safeDistance = Math.max(distance, 8);
          const force = target * target * 0.48 * controls.repulsion * delta;
          const directionX = dx / safeDistance;
          const directionY = dy / safeDistance;
          const orbitX = Math.sin(time * 0.001 * particle.driftRate + particle.driftPhase);
          const orbitY = Math.cos(time * 0.0008 * particle.driftRate + particle.driftPhase);

          particle.velocityX += directionX * force + orbitX * target * 0.025 * delta;
          particle.velocityY +=
            directionY * force * 0.72 -
            target * particle.buoyancy * 0.075 * controls.buoyancy * delta +
            orbitY * target * 0.018 * delta;
          particle.velocityZ +=
            (Math.sin(time * 0.0013 * particle.driftRate + particle.driftPhase) * 0.045 +
              target * particle.buoyancy * 0.025) *
            target *
            controls.buoyancy *
            delta;
        }

        particle.velocityX += -particle.offsetX * spring;
        particle.velocityY += -particle.offsetY * spring;
        particle.velocityZ += -particle.offsetZ * spring * 0.8;
        particle.velocityX *= damping;
        particle.velocityY *= damping;
        particle.velocityZ *= damping;
        particle.offsetX += particle.velocityX * delta;
        particle.offsetY += particle.velocityY * delta;
        particle.offsetZ += particle.velocityZ * delta;

        const displacement = Math.sqrt(
          particle.offsetX * particle.offsetX + particle.offsetY * particle.offsetY,
        );
        const maxDisplacement = 42 + particle.buoyancy * 18;
        if (displacement > maxDisplacement) {
          const limit = maxDisplacement / displacement;
          particle.offsetX *= limit;
          particle.offsetY *= limit;
          particle.velocityX *= 0.75;
          particle.velocityY *= 0.75;
        }
        particle.offsetZ = Math.max(-24, Math.min(48, particle.offsetZ));

        const depthScale = Math.max(0.58, Math.min(1.5, perspective + particle.offsetZ / 130));
        const pointSize =
          particle.size * (width < 640 ? 0.82 : 1) * depthScale * controls.particleScale;
        const px = baseX + particle.offsetX + particle.offsetZ * 0.05;
        const py = baseY + particle.offsetY - particle.offsetZ * 0.08;
        const shimmer =
          0.82 + Math.sin(time * 0.001 * particle.driftRate + particle.driftPhase) * 0.12;
        screenX[index] = px;
        screenY[index] = py;
        screenSize[index] = pointSize;
        screenAlpha[index] = Math.max(0.3, Math.min(1, depthScale * shimmer));
      }

      context.globalCompositeOperation = "lighter";
      for (let index = 0; index < particles.length; index += 23) {
        const particle = particles[index];
        const red = Math.round(255 + (particle.color[0] - 255) * particle.reveal);
        const green = Math.round(255 + (particle.color[1] - 255) * particle.reveal);
        const blue = Math.round(255 + (particle.color[2] - 255) * particle.reveal);
        const glowSize = 14 + screenSize[index] * 8 * controls.bloom;
        context.globalAlpha =
          (0.025 + particle.reveal * 0.09) * controls.bloom * screenAlpha[index];
        context.drawImage(
          getGlow(red, green, blue),
          screenX[index] - glowSize / 2,
          screenY[index] - glowSize / 2,
          glowSize,
          glowSize,
        );
      }

      context.globalCompositeOperation = "source-over";
      let lastFill = "";
      let lastAlpha = -1;
      for (let index = 0; index < particles.length; index++) {
        const particle = particles[index];
        const red = Math.round(255 + (particle.color[0] - 255) * particle.reveal);
        const green = Math.round(255 + (particle.color[1] - 255) * particle.reveal);
        const blue = Math.round(255 + (particle.color[2] - 255) * particle.reveal);
        const fill = particle.reveal < 0.003 ? "#ffffff" : `rgb(${red} ${green} ${blue})`;
        const alpha = Math.round(screenAlpha[index] * 20) / 20;
        if (fill !== lastFill) {
          context.fillStyle = fill;
          lastFill = fill;
        }
        if (alpha !== lastAlpha) {
          context.globalAlpha = alpha;
          lastAlpha = alpha;
        }
        context.fillRect(screenX[index], screenY[index], screenSize[index], screenSize[index]);
      }
      context.globalAlpha = 1;

      frame = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      particles = [];
    };
  }, [formation]);

  const updatePointer = (event: PointerEvent<HTMLCanvasElement>) => {
    pointerRef.current = { x: event.clientX, y: event.clientY, active: true };
  };

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      onPointerMove={updatePointer}
      onPointerEnter={updatePointer}
      onPointerLeave={() => {
        pointerRef.current.active = false;
      }}
      onWheel={(event) => {
        zoomRef.current = Math.max(0.82, Math.min(1.24, zoomRef.current - event.deltaY * 0.0006));
      }}
      aria-label={`Interactive ${formation} formation made from 20,000 particles`}
    />
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <label className="range-control">
      <span>
        {label}
        <output>{Math.round(value * 100)}%</output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step="0.01"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ "--range": `${percentage}%` } as CSSProperties}
      />
    </label>
  );
}

const ENGINES: { id: Engine; label: string }[] = [
  { id: "particles", label: "Particle Engine" },
  { id: "physics", label: "Physics Engine" },
  { id: "formations", label: "Formation Engine" },
];

export default function App() {
  const [formation, setFormation] = useState<Formation>("heart");
  const [engine, setEngine] = useState<Engine>("formations");
  const [settings, setSettings] = useState<EngineSettings>({
    particleScale: 1,
    bloom: 0.8,
    repulsion: 1,
    buoyancy: 1,
    returnForce: 1,
  });
  const current = FORMATIONS.find((item) => item.id === formation)!;
  const setSetting = (key: keyof EngineSettings, value: number) => {
    setSettings((previous) => ({ ...previous, [key]: value }));
  };

  return (
    <main className="app-shell">
      <ParticleField formation={formation} settings={settings} />

      <header className="topbar">
        <a className="brand" href="#" aria-label="Particleverse home">
          <span className="brand-mark" />
          PARTICLEVERSE
        </a>
        <nav className="engine-tabs" aria-label="Engine workspace">
          {ENGINES.map((item) => (
            <button
              type="button"
              key={item.id}
              className={engine === item.id ? "active" : ""}
              onClick={() => setEngine(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="system-state">
          <span />
          Live
        </div>
      </header>

      <section className="formation-info" aria-live="polite">
        <p>Active formation / 0{FORMATIONS.findIndex((item) => item.id === formation) + 1}</p>
        <h1>{current.label}</h1>
        <span>20K / volumetric field</span>
      </section>

      <div className="interaction-note">
        <span className="cursor-ring" />
        Move to interact <i /> Scroll to zoom
      </div>

      <section className="control-dock">
        <header>
          <div>
            <span className="dock-indicator" />
            {ENGINES.find((item) => item.id === engine)?.label}
          </div>
          <span>Realtime</span>
        </header>

        <div className="dock-content">
          {engine === "formations" && (
            <div className="formation-controls" aria-label="Choose a particle formation">
              {FORMATIONS.map((item, index) => (
                <button
                  type="button"
                  key={item.id}
                  className={formation === item.id ? "active" : ""}
                  onClick={() => setFormation(item.id)}
                >
                  <span>0{index + 1}</span>
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {engine === "particles" && (
            <div className="parameter-grid">
              <RangeControl
                label="Particle scale"
                value={settings.particleScale}
                min={0.65}
                max={1.5}
                onChange={(value) => setSetting("particleScale", value)}
              />
              <RangeControl
                label="Optical bloom"
                value={settings.bloom}
                min={0}
                max={1.5}
                onChange={(value) => setSetting("bloom", value)}
              />
              <div className="readout">
                <span>Render field</span>
                <strong>20,000</strong>
              </div>
            </div>
          )}

          {engine === "physics" && (
            <div className="parameter-grid parameter-grid--physics">
              <RangeControl
                label="Repulsion"
                value={settings.repulsion}
                min={0.25}
                max={1.75}
                onChange={(value) => setSetting("repulsion", value)}
              />
              <RangeControl
                label="Buoyancy"
                value={settings.buoyancy}
                min={0.2}
                max={1.8}
                onChange={(value) => setSetting("buoyancy", value)}
              />
              <RangeControl
                label="Spring return"
                value={settings.returnForce}
                min={0.35}
                max={1.65}
                onChange={(value) => setSetting("returnForce", value)}
              />
            </div>
          )}
        </div>
      </section>

      <a
        className="download-link"
        href={current.file}
        download
        aria-label={`Download ${current.label} SVG`}
      >
        SVG <span aria-hidden="true">↓</span>
      </a>
    </main>
  );
}
