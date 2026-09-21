import {
  OPENING_TIMELINE,
  OPENING_POPULATION,
  OPENING_DEPTH_LAYERS,
  OPENING_PHYSICS,
  OPENING_EDGES,
  OPENING_IDENTITY,
} from "@/config/opening";
import { getIdentityTargets, TargetPoint } from "./identityTargets";

/**
 * Attractor definition for organic density clustering
 */
interface Attractor {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  radius: number;
  weight: number;
  driftFreqX: number;
  driftFreqY: number;
  driftAmpX: number;
  driftAmpY: number;
  phaseX: number;
  phaseY: number;
  weightFreq: number;
  weightPhase: number;
}

/**
 * High-performance field simulation state using flat TypedArrays
 */
export interface SimulationState {
  // Flat typed arrays
  x: Float32Array;
  y: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  baseX: Float32Array;
  baseY: Float32Array;
  baseRadius: Float32Array;
  baseAlpha: Float32Array;
  speedMult: Float32Array;
  layer: Uint8Array; // 0=far, 1=mid, 2=near
  targetIndex: Int16Array; // -1 if not assigned to identity
  staggerDelay: Float32Array;
  phaseOffset: Float32Array;
  noiseFreq: Float32Array;

  // Configuration & Geometry
  poolSize: number;
  width: number;
  height: number;
  dpr: number;
  isMobile: boolean;
  reducedMotion: boolean;
  connectionRadius: number;

  // Attractors & Targets
  attractors: Attractor[];
  acmTargets: TargetPoint[];
  acmFaceTargets: TargetPoint[];
  identityCenter: { x: number; y: number };

  // Runtime metrics instrumentation
  metrics: {
    visiblePoints: number;
    visibleEdges: number;
    nonBlackPixelPercent: number;
    maxSaturation: number;
    identityState: string;
  };
}

/**
 * Initializes simulation state with pre-allocated flat typed arrays
 */
export function createSimulationState(
  width: number,
  height: number,
  isMobile: boolean,
  reducedMotion: boolean,
  dpr: number
): SimulationState {
  const poolSize = isMobile ? OPENING_POPULATION.MOBILE_MAX : OPENING_POPULATION.DESKTOP_MAX;
  const shorterEdge = Math.min(width, height);
  const connectionRadius = shorterEdge * OPENING_EDGES.CONNECTION_RADIUS_RATIO;

  const x = new Float32Array(poolSize);
  const y = new Float32Array(poolSize);
  const vx = new Float32Array(poolSize);
  const vy = new Float32Array(poolSize);
  const baseX = new Float32Array(poolSize);
  const baseY = new Float32Array(poolSize);
  const baseRadius = new Float32Array(poolSize);
  const baseAlpha = new Float32Array(poolSize);
  const speedMult = new Float32Array(poolSize);
  const layer = new Uint8Array(poolSize);
  const targetIndex = new Int16Array(poolSize);
  const staggerDelay = new Float32Array(poolSize);
  const phaseOffset = new Float32Array(poolSize);
  const noiseFreq = new Float32Array(poolSize);

  // Initialize 6 natural density attractors (within 5–8 spec)
  const attractors: Attractor[] = [
    {
      baseX: width * 0.50,
      baseY: height * 0.44,
      x: width * 0.50,
      y: height * 0.44,
      radius: shorterEdge * 0.20,
      weight: 1.0,
      driftFreqX: 0.18,
      driftFreqY: 0.22,
      driftAmpX: width * 0.03,
      driftAmpY: height * 0.025,
      phaseX: 0.0,
      phaseY: 1.1,
      weightFreq: 0.35,
      weightPhase: 0.0,
    },
    {
      baseX: width * 0.28,
      baseY: height * 0.35,
      x: width * 0.28,
      y: height * 0.35,
      radius: shorterEdge * 0.24,
      weight: 0.8,
      driftFreqX: 0.24,
      driftFreqY: 0.16,
      driftAmpX: width * 0.04,
      driftAmpY: height * 0.03,
      phaseX: 2.1,
      phaseY: 0.5,
      weightFreq: 0.28,
      weightPhase: 1.5,
    },
    {
      baseX: width * 0.72,
      baseY: height * 0.38,
      x: width * 0.72,
      y: height * 0.38,
      radius: shorterEdge * 0.22,
      weight: 0.85,
      driftFreqX: 0.19,
      driftFreqY: 0.25,
      driftAmpX: width * 0.035,
      driftAmpY: height * 0.035,
      phaseX: 1.4,
      phaseY: 3.2,
      weightFreq: 0.31,
      weightPhase: 2.8,
    },
    {
      baseX: width * 0.35,
      baseY: height * 0.65,
      x: width * 0.35,
      y: height * 0.65,
      radius: shorterEdge * 0.25,
      weight: 0.9,
      driftFreqX: 0.15,
      driftFreqY: 0.21,
      driftAmpX: width * 0.045,
      driftAmpY: height * 0.03,
      phaseX: 4.1,
      phaseY: 1.8,
      weightFreq: 0.22,
      weightPhase: 4.0,
    },
    {
      baseX: width * 0.65,
      baseY: height * 0.62,
      x: width * 0.65,
      y: height * 0.62,
      radius: shorterEdge * 0.23,
      weight: 0.85,
      driftFreqX: 0.22,
      driftFreqY: 0.18,
      driftAmpX: width * 0.04,
      driftAmpY: height * 0.035,
      phaseX: 0.9,
      phaseY: 2.4,
      weightFreq: 0.29,
      weightPhase: 0.7,
    },
    {
      baseX: width * 0.50,
      baseY: height * 0.22,
      x: width * 0.50,
      y: height * 0.22,
      radius: shorterEdge * 0.18,
      weight: 0.7,
      driftFreqX: 0.20,
      driftFreqY: 0.27,
      driftAmpX: width * 0.03,
      driftAmpY: height * 0.02,
      phaseX: 3.3,
      phaseY: 4.1,
      weightFreq: 0.25,
      weightPhase: 3.5,
    },
  ];

  // Distribute points into 3 depth layers according to spec:
  // Far: 45%, Mid: 35%, Near: 20%
  for (let i = 0; i < poolSize; i++) {
    const r = i / poolSize;
    let l: 0 | 1 | 2;
    let rad: number;
    let alp: number;
    let spd: number;

    if (r < OPENING_DEPTH_LAYERS.FAR.share) {
      l = 0;
      rad = OPENING_DEPTH_LAYERS.FAR.minRadius +
        ((i * 7) % 10) * 0.1 * (OPENING_DEPTH_LAYERS.FAR.maxRadius - OPENING_DEPTH_LAYERS.FAR.minRadius);
      alp = OPENING_DEPTH_LAYERS.FAR.minAlpha +
        ((i * 13) % 10) * 0.1 * (OPENING_DEPTH_LAYERS.FAR.maxAlpha - OPENING_DEPTH_LAYERS.FAR.minAlpha);
      spd = OPENING_DEPTH_LAYERS.FAR.speedMultiplier;
    } else if (r < OPENING_DEPTH_LAYERS.FAR.share + OPENING_DEPTH_LAYERS.MID.share) {
      l = 1;
      rad = OPENING_DEPTH_LAYERS.MID.minRadius +
        ((i * 11) % 10) * 0.1 * (OPENING_DEPTH_LAYERS.MID.maxRadius - OPENING_DEPTH_LAYERS.MID.minRadius);
      alp = OPENING_DEPTH_LAYERS.MID.minAlpha +
        ((i * 17) % 10) * 0.1 * (OPENING_DEPTH_LAYERS.MID.maxAlpha - OPENING_DEPTH_LAYERS.MID.minAlpha);
      spd = OPENING_DEPTH_LAYERS.MID.speedMultiplier;
    } else {
      l = 2;
      rad = OPENING_DEPTH_LAYERS.NEAR.minRadius +
        ((i * 19) % 10) * 0.1 * (OPENING_DEPTH_LAYERS.NEAR.maxRadius - OPENING_DEPTH_LAYERS.NEAR.minRadius);
      alp = OPENING_DEPTH_LAYERS.NEAR.minAlpha +
        ((i * 23) % 10) * 0.1 * (OPENING_DEPTH_LAYERS.NEAR.maxAlpha - OPENING_DEPTH_LAYERS.NEAR.minAlpha);
      spd = OPENING_DEPTH_LAYERS.NEAR.speedMultiplier;
    }

    layer[i] = l;
    baseRadius[i] = rad;
    baseAlpha[i] = alp;
    speedMult[i] = spd;
    targetIndex[i] = -1;
    staggerDelay[i] = ((i * 137.5) % 100) * 0.01 * OPENING_IDENTITY.STAGGER_MAX_DELAY;
    phaseOffset[i] = ((i * 137.5) * Math.PI) / 180;
    noiseFreq[i] = 1.0 / (OPENING_PHYSICS.DRIFT_PERIOD_MIN +
      ((i * 31) % 10) * 0.1 * (OPENING_PHYSICS.DRIFT_PERIOD_MAX - OPENING_PHYSICS.DRIFT_PERIOD_MIN));

    // Scatter initially across viewport with bias toward attractors
    const att = attractors[i % attractors.length];
    const angle = ((i * 137.5) * Math.PI) / 180;
    const spreadDist = Math.sqrt((i + 1) / poolSize) * att.radius * (0.8 + ((i * 17) % 10) * 0.04);
    const px = att.baseX + Math.cos(angle) * spreadDist;
    const py = att.baseY + Math.sin(angle) * spreadDist;

    x[i] = Math.max(10, Math.min(width - 10, px));
    y[i] = Math.max(10, Math.min(height - 10, py));
    baseX[i] = x[i];
    baseY[i] = y[i];

    // Initial drift vector (4–12 px/s scaled by layer speed)
    const baseSpeed = (OPENING_PHYSICS.MIN_SPEED +
      ((i * 43) % 10) * 0.1 * (OPENING_PHYSICS.MAX_SPEED - OPENING_PHYSICS.MIN_SPEED)) * spd;
    const vAngle = ((i * 73.13) * Math.PI) / 180;
    vx[i] = Math.cos(vAngle) * baseSpeed;
    vy[i] = Math.sin(vAngle) * baseSpeed;
  }

  // Sample identity targets for "ACM" and "ACM FACE"
  const identityCenter = { x: width * 0.5, y: height * 0.44 };
  const fontSizeACM = isMobile ? 88 : 132;
  const fontSizeFace = isMobile ? 54 : 84;

  const acmTargets = getIdentityTargets(
    {
      type: "text",
      text: "ACM",
      fontSize: fontSizeACM,
      fontWeight: "700",
      letterSpacing: isMobile ? 8 : 14,
    },
    {
      width,
      height,
      centerX: identityCenter.x,
      centerY: identityCenter.y,
    },
    OPENING_IDENTITY.TARGET_POINTS_COUNT
  );

  const acmFaceTargets = getIdentityTargets(
    {
      type: "text",
      text: "ACM FACE",
      fontSize: fontSizeFace,
      fontWeight: "600",
      letterSpacing: isMobile ? 6 : 10,
    },
    {
      width,
      height,
      centerX: identityCenter.x,
      centerY: identityCenter.y,
    },
    OPENING_IDENTITY.TARGET_POINTS_COUNT
  );

  // Greedily match nearest live points to ACM targets to minimize spring travel
  const assigned = new Set<number>();
  for (let t = 0; t < acmTargets.length; t++) {
    const tgt = acmTargets[t];
    let bestDist = Infinity;
    let bestIdx = -1;

    for (let p = 0; p < poolSize; p++) {
      if (assigned.has(p)) continue;
      // Prefer mid and near layer particles for identity sharpness
      const layerPref = layer[p] === 0 ? 1.8 : 1.0;
      const dx = x[p] - tgt.x;
      const dy = y[p] - tgt.y;
      const d = Math.sqrt(dx * dx + dy * dy) * layerPref;
      if (d < bestDist) {
        bestDist = d;
        bestIdx = p;
      }
    }

    if (bestIdx !== -1) {
      assigned.add(bestIdx);
      targetIndex[bestIdx] = t;
    }
  }

  return {
    x,
    y,
    vx,
    vy,
    baseX,
    baseY,
    baseRadius,
    baseAlpha,
    speedMult,
    layer,
    targetIndex,
    staggerDelay,
    phaseOffset,
    noiseFreq,
    poolSize,
    width,
    height,
    dpr,
    isMobile,
    reducedMotion,
    connectionRadius,
    attractors,
    acmTargets,
    acmFaceTargets,
    identityCenter,
    metrics: {
      visiblePoints: 0,
      visibleEdges: 0,
      nonBlackPixelPercent: 0,
      maxSaturation: 0,
      identityState: "none",
    },
  };
}

/**
 * Main simulation step & render
 */
export function stepAndRender(
  ctx: CanvasRenderingContext2D,
  state: SimulationState,
  time: number,
  deltaTime: number
): void {
  const { width, height, poolSize, isMobile, reducedMotion, attractors } = state;
  const dt = Math.min(deltaTime, 0.05); // clamp to 50ms per spec

  // Pure black prior to BLACK_END (0.6s)
  if (time < OPENING_TIMELINE.BLACK_END && !reducedMotion) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    state.metrics.visiblePoints = 0;
    state.metrics.visibleEdges = 0;
    state.metrics.identityState = "none";
    return;
  }

  // Camera push-in scale: 1.00 -> 1.06 over 9.1s (desktop only)
  let cameraScale = 1.0;
  if (!isMobile && !reducedMotion) {
    const progress = Math.min(Math.max(time / OPENING_TIMELINE.TOTAL_DURATION, 0), 1);
    // Smooth power1.inOut curve
    const eased = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    cameraScale = OPENING_PHYSICS.CAMERA_SCALE_START +
      eased * (OPENING_PHYSICS.CAMERA_SCALE_END - OPENING_PHYSICS.CAMERA_SCALE_START);
  }

  // Compute visible points count ramped from pool
  let activeCount = poolSize;
  if (!reducedMotion) {
    if (time <= OPENING_TIMELINE.POINTS_RAMP_START) {
      activeCount = 0;
    } else if (time <= OPENING_TIMELINE.POINTS_RAMP_MID) {
      // 0.6 -> 2.0s: 10 -> 40 (desktop)
      const tNorm = (time - OPENING_TIMELINE.POINTS_RAMP_START) /
        (OPENING_TIMELINE.POINTS_RAMP_MID - OPENING_TIMELINE.POINTS_RAMP_START);
      const startC = isMobile ? OPENING_POPULATION.MOBILE_COUNTS.T0_6 : OPENING_POPULATION.DESKTOP_COUNTS.T0_6;
      const endC = isMobile ? OPENING_POPULATION.MOBILE_COUNTS.T2_0 : OPENING_POPULATION.DESKTOP_COUNTS.T2_0;
      activeCount = Math.round(startC + tNorm * (endC - startC));
    } else if (time <= OPENING_TIMELINE.POINTS_RAMP_FULL) {
      // 2.0 -> 4.0s: 40 -> 150
      const tNorm = (time - OPENING_TIMELINE.POINTS_RAMP_MID) /
        (OPENING_TIMELINE.POINTS_RAMP_FULL - OPENING_TIMELINE.POINTS_RAMP_MID);
      const startC = isMobile ? OPENING_POPULATION.MOBILE_COUNTS.T2_0 : OPENING_POPULATION.DESKTOP_COUNTS.T2_0;
      const endC = isMobile ? OPENING_POPULATION.MOBILE_COUNTS.T4_0 : OPENING_POPULATION.DESKTOP_COUNTS.T4_0;
      activeCount = Math.round(startC + tNorm * (endC - startC));
    } else if (time <= OPENING_TIMELINE.CLUSTERS_ARTICULATED) {
      // 4.0 -> 5.5s: 150 -> 220
      const tNorm = (time - OPENING_TIMELINE.POINTS_RAMP_FULL) /
        (OPENING_TIMELINE.CLUSTERS_ARTICULATED - OPENING_TIMELINE.POINTS_RAMP_FULL);
      const startC = isMobile ? OPENING_POPULATION.MOBILE_COUNTS.T4_0 : OPENING_POPULATION.DESKTOP_COUNTS.T4_0;
      const endC = isMobile ? OPENING_POPULATION.MOBILE_COUNTS.T5_5 : OPENING_POPULATION.DESKTOP_COUNTS.T5_5;
      activeCount = Math.round(startC + tNorm * (endC - startC));
    } else {
      activeCount = poolSize;
    }
  }

  // Update Attractors (slow drift <= 3 px/s and oscillating weights)
  for (let a = 0; a < attractors.length; a++) {
    const att = attractors[a];
    att.x = att.baseX + Math.sin(time * att.driftFreqX + att.phaseX) * att.driftAmpX;
    att.y = att.baseY + Math.cos(time * att.driftFreqY + att.phaseY) * att.driftAmpY;
    att.weight = 0.5 + 0.5 * Math.sin(time * att.weightFreq + att.weightPhase);
  }

  // Determine Identity State & Morph
  const isConstellationActive = time >= OPENING_TIMELINE.IDENTITY_SPRINGS_ENGAGE;
  const isDimmed = time >= OPENING_TIMELINE.NON_ASSEMBLED_DIM_START;
  const isMorphActive = time >= OPENING_TIMELINE.MORPH_RELEASE_START;

  let currentIdentityState = "none";
  if (time >= OPENING_TIMELINE.HOLD_COMPLETE) {
    currentIdentityState = "ACM FACE + tagline (holding)";
  } else if (time >= OPENING_TIMELINE.IDENTITY_COMPLETE) {
    currentIdentityState = "ACM FACE + tagline";
  } else if (time >= OPENING_TIMELINE.MORPH_RELEASE_START) {
    currentIdentityState = "transitioning ACM -> ACM FACE";
  } else if (time >= OPENING_TIMELINE.CLEAN_ACM_STABLE) {
    currentIdentityState = "ACM stable";
  } else if (time >= OPENING_TIMELINE.IDENTITY_SPRINGS_ENGAGE) {
    currentIdentityState = "ACM forming";
  }
  state.metrics.identityState = currentIdentityState;

  // 1. UPDATE PHYSICS FOR ACTIVE PARTICLES
  for (let i = 0; i < activeCount; i++) {
    const tIdx = state.targetIndex[i];
    const isAssigned = tIdx >= 0;

    // Value-noise / summed-sine drift vector
    const f = state.noiseFreq[i];
    const p = state.phaseOffset[i];
    const driftX = (Math.sin(time * f * 6.28 + p) + 0.5 * Math.sin(time * f * 12.56 + p * 2)) * 6.0;
    const driftY = (Math.cos(time * f * 5.8 + p) + 0.5 * Math.cos(time * f * 11.6 + p * 1.5)) * 6.0;

    // Harmonic breathing term (amplitude <= 5.5px, period 9–14s)
    const breathPeriod = OPENING_PHYSICS.BREATH_PERIOD_MIN + (i % 5) * 1.0;
    const breathAmp = 4.5 * Math.sin((time * 6.28) / breathPeriod + p);
    const breathX = Math.cos(p) * breathAmp;
    const breathY = Math.sin(p) * breathAmp;

    // Soft Attractor gravitational pull
    const att = attractors[i % attractors.length];
    const dxA = att.x - state.x[i];
    const dyA = att.y - state.y[i];
    const distA = Math.sqrt(dxA * dxA + dyA * dyA) || 1;
    const pull = 0.0004 * att.weight * Math.min(distA, att.radius);

    // Spring toward identity targets during constellation phase
    let springFx = 0;
    let springFy = 0;
    let driftFactor = 1.0;

    if (isConstellationActive && isAssigned && !reducedMotion) {
      const stagger = state.staggerDelay[i];
      const elapsedSinceEngage = time - (OPENING_TIMELINE.IDENTITY_SPRINGS_ENGAGE + stagger);

      if (elapsedSinceEngage > 0) {
        // Interpolate target from ACM target to ACM FACE target if morph is active
        const acmTarget = state.acmTargets[tIdx];
        let targetX = acmTarget.x;
        let targetY = acmTarget.y;

        if (isMorphActive && state.acmFaceTargets[tIdx]) {
          const morphProgress = Math.min(
            (time - OPENING_TIMELINE.MORPH_RELEASE_START) /
              (OPENING_TIMELINE.IDENTITY_COMPLETE - OPENING_TIMELINE.MORPH_RELEASE_START),
            1
          );
          // Eased morph
          const mEased = morphProgress * morphProgress * (3 - 2 * morphProgress);
          const faceTarget = state.acmFaceTargets[tIdx];
          targetX = acmTarget.x + (faceTarget.x - acmTarget.x) * mEased;
          targetY = acmTarget.y + (faceTarget.y - acmTarget.y) * mEased;
        }

        const dxT = targetX - state.x[i];
        const dyT = targetY - state.y[i];

        // Critically damped spring formulation
        const stiffness = OPENING_IDENTITY.SPRING_STIFFNESS;
        const damping = OPENING_IDENTITY.SPRING_DAMPING;

        springFx = dxT * stiffness - state.vx[i] * damping;
        springFy = dyT * stiffness - state.vy[i] * damping;

        // Reduce ambient drift so the constellation breathes without freezing
        driftFactor = OPENING_IDENTITY.ASSEMBLED_DRIFT_REDUCTION;
      }
    }

    // Velocity update
    state.vx[i] += (springFx + (dxA / distA) * pull * 40) * dt;
    state.vy[i] += (springFy + (dyA / distA) * pull * 40) * dt;

    // Apply natural velocity damping
    state.vx[i] *= 0.94;
    state.vy[i] *= 0.94;

    // Position integration with drift and breathing
    state.x[i] += state.vx[i] * dt + (driftX + breathX) * driftFactor * dt;
    state.y[i] += state.vy[i] * dt + (driftY + breathY) * driftFactor * dt;
  }

  // 2. CLEAR & SET CAMERA TRANSFORM
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);

  // Apply camera push-in around identity center
  const originX = state.identityCenter.x;
  const originY = state.identityCenter.y;
  ctx.setTransform(
    cameraScale,
    0,
    0,
    cameraScale,
    originX * (1 - cameraScale),
    originY * (1 - cameraScale)
  );

  // Exit dissolve fade (8.7 -> 9.1s)
  let exitFade = 1.0;
  if (time >= OPENING_TIMELINE.EXIT_FADE_START) {
    const p = (time - OPENING_TIMELINE.EXIT_FADE_START) /
      (OPENING_TIMELINE.TOTAL_DURATION - OPENING_TIMELINE.EXIT_FADE_START);
    exitFade = Math.max(0, 1 - p);
  }

  // 3. EDGES RENDERING VIA SPATIAL HASH GRID
  // Edges only start at EDGES_START (2.4s). Strictly 0 edges at 1.0s.
  let edgeCount = 0;
  const renderEdges = time >= OPENING_TIMELINE.EDGES_START && activeCount > 20;

  if (renderEdges) {
    const cellSize = state.connectionRadius;
    const grid = new Map<string, number[]>();

    // Build spatial hash
    for (let i = 0; i < activeCount; i++) {
      const cx = Math.floor(state.x[i] / cellSize);
      const cy = Math.floor(state.y[i] / cellSize);
      const key = `${cx},${cy}`;
      const bucket = grid.get(key);
      if (bucket) {
        bucket.push(i);
      } else {
        grid.set(key, [i]);
      }
    }

    const maxNeighbors = isMobile ? OPENING_EDGES.MAX_NEIGHBORS_MOBILE : OPENING_EDGES.MAX_NEIGHBORS_DESKTOP;
    const connRadiusSq = state.connectionRadius * state.connectionRadius;

    // Edge Alpha Buckets for single beginPath() batching (5 buckets)
    // Buckets: [0.00-0.03, 0.03-0.06, 0.06-0.09, 0.09-0.12, 0.12-0.18]
    const numBuckets = OPENING_EDGES.ALPHA_BUCKETS;
    const bucketLines: Array<Array<{ x1: number; y1: number; x2: number; y2: number }>> = [];
    for (let b = 0; b < numBuckets; b++) {
      bucketLines.push([]);
    }

    const edgeRamp = Math.min((time - OPENING_TIMELINE.EDGES_START) / 1.6, 1.0);

    for (let i = 0; i < activeCount; i++) {
      const p1x = state.x[i];
      const p1y = state.y[i];
      const cx = Math.floor(p1x / cellSize);
      const cy = Math.floor(p1y / cellSize);
      let connections = 0;

      for (let ox = -1; ox <= 1 && connections < maxNeighbors; ox++) {
        for (let oy = -1; oy <= 1 && connections < maxNeighbors; oy++) {
          const key = `${cx + ox},${cy + oy}`;
          const neighborIndices = grid.get(key);
          if (!neighborIndices) continue;

          for (let k = 0; k < neighborIndices.length && connections < maxNeighbors; k++) {
            const j = neighborIndices[k];
            if (j <= i) continue; // deduplicate pairs

            const p2x = state.x[j];
            const p2y = state.y[j];
            const dx = p1x - p2x;
            const dy = p1y - p2y;
            const distSq = dx * dx + dy * dy;

            if (distSq < connRadiusSq) {
              const d = Math.sqrt(distSq);
              const ratio = 1 - d / state.connectionRadius;
              let edgeAlpha = OPENING_EDGES.MAX_EDGE_ALPHA * (ratio * ratio) * edgeRamp * exitFade;

              // Boost edges between assembled constellation points by up to 2x
              const p1Assigned = isConstellationActive && state.targetIndex[i] >= 0;
              const p2Assigned = isConstellationActive && state.targetIndex[j] >= 0;
              if (p1Assigned && p2Assigned) {
                edgeAlpha *= OPENING_IDENTITY.CONSTELLATION_EDGE_BOOST;
              } else if (isDimmed) {
                edgeAlpha *= OPENING_IDENTITY.BACKGROUND_DIM_MULTIPLIER;
              }

              edgeAlpha = Math.min(edgeAlpha, 0.28);
              if (edgeAlpha > 0.015) {
                const bIdx = Math.min(Math.floor((edgeAlpha / 0.28) * numBuckets), numBuckets - 1);
                bucketLines[bIdx].push({ x1: p1x, y1: p1y, x2: p2x, y2: p2y });
                connections++;
                edgeCount++;
              }
            }
          }
        }
      }
    }

    // Render batched lines per bucket (Pure Grayscale #FFFFFF with alpha)
    ctx.lineWidth = 1.0;
    for (let b = 0; b < numBuckets; b++) {
      const lines = bucketLines[b];
      if (lines.length === 0) continue;

      const bucketAlpha = ((b + 0.5) / numBuckets) * 0.28;
      ctx.strokeStyle = `rgba(255, 255, 255, ${bucketAlpha.toFixed(3)})`;
      ctx.beginPath();
      for (let l = 0; l < lines.length; l++) {
        const line = lines[l];
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
      }
      ctx.stroke();
    }
  }

  // 4. PARTICLES RENDERING (NODES)
  // Grayscale only: rgba(255, 255, 255, alpha)
  let visiblePointsCount = 0;

  for (let i = 0; i < activeCount; i++) {
    const isAssigned = isConstellationActive && state.targetIndex[i] >= 0;
    let alpha = state.baseAlpha[i] * exitFade;

    // Non-assembled points dim by ~35% after 5.5s
    if (isDimmed && !isAssigned) {
      alpha *= OPENING_IDENTITY.BACKGROUND_DIM_MULTIPLIER;
    } else if (isAssigned) {
      // Assembled constellation points stay crisp & luminous
      alpha = Math.min(1.0, alpha * 1.25);
    }

    if (alpha <= 0.01) continue;

    visiblePointsCount++;
    const r = state.baseRadius[i];
    const px = state.x[i];
    const py = state.y[i];

    ctx.beginPath();
    // Far layer points (layer 0) drawn 1px larger at 0.5 alpha to read as out-of-focus without blur filter
    if (state.layer[i] === 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${(alpha * OPENING_DEPTH_LAYERS.FAR.defocusAlpha).toFixed(3)})`;
      ctx.arc(px, py, r + OPENING_DEPTH_LAYERS.FAR.extraRadiusPx, 0, Math.PI * 2);
    } else {
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.arc(px, py, r, 0, Math.PI * 2);
    }
    ctx.fill();
  }

  // Record instrumentation metrics
  state.metrics.visiblePoints = visiblePointsCount;
  state.metrics.visibleEdges = edgeCount;
}

/**
 * Samples canvas pixels to measure non-black pixel % and max saturation
 * for proof table verification.
 */
export function sampleCanvasPixelMetrics(
  canvas: HTMLCanvasElement
): { nonBlackPixelPercent: number; maxSaturation: number; maxColourSpread: number; colorDeviations: number } {
  try {
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return { nonBlackPixelPercent: 0, maxSaturation: 0, maxColourSpread: 0, colorDeviations: 0 };

    const sampleW = Math.min(canvas.width, 400);
    const sampleH = Math.min(canvas.height, 300);
    const imgData = ctx.getImageData(0, 0, sampleW, sampleH);
    const data = imgData.data;
    const totalPixels = sampleW * sampleH;
    let nonBlackCount = 0;
    let maxSat = 0;
    let maxSpread = 0;
    let colorDeviations = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (a > 10 && (r > 5 || g > 5 || b > 5)) {
        nonBlackCount++;

        const spread = Math.max(r, g, b) - Math.min(r, g, b);
        if (spread > maxSpread) maxSpread = spread;

        if (Math.abs(r - g) > 2 || Math.abs(g - b) > 2) {
          colorDeviations++;
        }

        // Saturation calculation: (max - min) / max
        const maxVal = Math.max(r, g, b);
        const minVal = Math.min(r, g, b);
        const sat = maxVal > 0 ? (maxVal - minVal) / maxVal : 0;
        if (sat > maxSat) maxSat = sat;
      }
    }

    return {
      nonBlackPixelPercent: Number(((nonBlackCount / totalPixels) * 100).toFixed(2)),
      maxSaturation: Number(maxSat.toFixed(3)),
      maxColourSpread: maxSpread,
      colorDeviations,
    };
  } catch {
    return { nonBlackPixelPercent: 0, maxSaturation: 0, maxColourSpread: 0, colorDeviations: 0 };
  }
}
