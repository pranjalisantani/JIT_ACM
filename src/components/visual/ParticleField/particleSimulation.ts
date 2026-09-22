/**
 * ACM FACE — Particle Simulation
 * Mathematical Fibonacci sphere distribution, depth bands, and organic low-frequency bounded wandering.
 */

import { PARTICLE_FIELD_CONFIG, DepthBandConfig } from "./config";

export type DepthBand = "far" | "mid" | "near";

export type ParticleRegion = "center" | "people" | "events" | "projects" | "learning" | "bridge" | "ambient";

export interface Particle {
  id: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  structX: number;
  structY: number;
  structZ: number;
  currX: number;
  currY: number;
  currZ: number;
  region: ParticleRegion;
  depthBand: DepthBand;
  bandIndex: number;
  baseSize: number;
  currentSize: number;
  baseAlpha: number;
  currentAlpha: number;
  revealAlpha: number;
  // Bounded wandering parameters
  freqX: number;
  freqY: number;
  freqZ: number;
  phaseX: number;
  phaseY: number;
  phaseZ: number;
  ampX: number;
  ampY: number;
  ampZ: number;
  pulsePhase: number;
  pulseFreq: number;
}

export interface AmbientParticle {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  alpha: number;
  revealAlpha: number;
  driftSpeed: number;
}

export class ParticleSimulation {
  public particles: Particle[] = [];
  public ambientParticles: AmbientParticle[] = [];
  public isMobile: boolean;
  public activeRegion: string | null = null;

  constructor(isMobile: boolean = false) {
    this.isMobile = isMobile;
    this.init();
  }

  private randomRange(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  public init(): void {
    const config = this.isMobile
      ? PARTICLE_FIELD_CONFIG.mobile
      : PARTICLE_FIELD_CONFIG.desktop;

    const totalParticles = config.particleCount;
    const totalAmbient = config.ambientCount;

    const farCutoff = Math.floor(totalParticles * PARTICLE_FIELD_CONFIG.depthBands.far.ratio);
    const midCutoff = farCutoff + Math.floor(totalParticles * PARTICLE_FIELD_CONFIG.depthBands.mid.ratio);

    this.particles = [];

    // Golden ratio for Fibonacci sphere
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < totalParticles; i++) {
      let depthBand: DepthBand = "far";
      let bandConfig: DepthBandConfig = PARTICLE_FIELD_CONFIG.depthBands.far;
      let bandIndex = 0;

      if (i >= midCutoff) {
        depthBand = "near";
        bandConfig = PARTICLE_FIELD_CONFIG.depthBands.near;
        bandIndex = 2;
      } else if (i >= farCutoff) {
        depthBand = "mid";
        bandConfig = PARTICLE_FIELD_CONFIG.depthBands.mid;
        bandIndex = 1;
      }

      // Fibonacci distribution blended with volumetric dispersion (loose organic field, NOT a rigid sphere)
      const yNorm = 1 - (i / (totalParticles - 1)) * 2; // -1 to 1
      const theta = goldenAngle * i;
      const phi = Math.acos(Math.max(-1, Math.min(1, yNorm)));

      // Volumetric dispersion across deep spatial planes
      let baseRadialDist: number;
      let depthZOffset: number;
      let lateralSpread: number;

      if (depthBand === "near") {
        baseRadialDist = this.randomRange(12.0, 18.0);
        depthZOffset = this.randomRange(4.0, 12.0); // Pushed toward foreground
        lateralSpread = 1.25;
      } else if (depthBand === "mid") {
        baseRadialDist = this.randomRange(16.0, 24.0);
        depthZOffset = this.randomRange(-6.0, 4.0);  // Central constellation plane
        lateralSpread = 1.15;
      } else {
        baseRadialDist = this.randomRange(22.0, 32.0);
        depthZOffset = this.randomRange(-18.0, -6.0); // Deep background plane
        lateralSpread = 1.35;
      }

      // Organic non-uniform perturbation and loose filament clustering
      const harmonicDisplacement =
        Math.sin(2.5 * phi) * Math.cos(3.2 * theta) * 2.8 +
        Math.cos(1.8 * phi + theta * 0.5) * 2.0 +
        (Math.random() - 0.5) * 3.2;

      const effRadius = baseRadialDist + harmonicDisplacement;
      const sinPhi = Math.sin(phi);

      const baseX = Math.cos(theta) * sinPhi * effRadius * lateralSpread;
      const baseY = Math.cos(phi) * effRadius * 0.85; // Slightly cinematic wide aspect
      const baseZ = Math.sin(theta) * sinPhi * effRadius + depthZOffset;

      // Assign structured convergence coordinates for the 4 About regions + Central Hub
      let region: ParticleRegion = "ambient";
      let structX = baseX;
      let structY = baseY;
      let structZ = baseZ;

      if (i < 24) {
        // Central Hub
        region = "center";
        const a = (i / 24) * Math.PI * 2;
        const r = this.randomRange(1.2, 3.5);
        structX = Math.cos(a) * r;
        structY = Math.sin(a) * r;
        structZ = this.randomRange(-1.0, 1.5);
      } else if (i < 60) {
        // Region 01: People (Top-Left quadrant)
        region = "people";
        structX = -11.0 + this.randomRange(-3.5, 3.5);
        structY = 6.5 + this.randomRange(-3.0, 3.0);
        structZ = this.randomRange(0.0, 3.0);
      } else if (i < 96) {
        // Region 02: Events (Top-Right quadrant)
        region = "events";
        structX = 11.0 + this.randomRange(-3.5, 3.5);
        structY = 6.5 + this.randomRange(-3.0, 3.0);
        structZ = this.randomRange(0.0, 3.0);
      } else if (i < 132) {
        // Region 03: Projects (Bottom-Right quadrant)
        region = "projects";
        structX = 11.0 + this.randomRange(-3.5, 3.5);
        structY = -6.5 + this.randomRange(-3.0, 3.0);
        structZ = this.randomRange(0.0, 3.0);
      } else if (i < 168) {
        // Region 04: Learning (Bottom-Left quadrant)
        region = "learning";
        structX = -11.0 + this.randomRange(-3.5, 3.5);
        structY = -6.5 + this.randomRange(-3.0, 3.0);
        structZ = this.randomRange(0.0, 3.0);
      } else if (i < 210) {
        // Structural Connecting Bridges
        region = "bridge";
        const tBridge = (i - 168) / 42;
        if (tBridge < 0.25) {
          // People <-> Events bridge
          const f = tBridge / 0.25;
          structX = -11.0 + f * 22.0 + this.randomRange(-1.0, 1.0);
          structY = 6.5 + this.randomRange(-1.0, 1.0);
          structZ = this.randomRange(0.0, 2.0);
        } else if (tBridge < 0.5) {
          // Events <-> Projects bridge
          const f = (tBridge - 0.25) / 0.25;
          structX = 11.0 + this.randomRange(-1.0, 1.0);
          structY = 6.5 - f * 13.0 + this.randomRange(-1.0, 1.0);
          structZ = this.randomRange(0.0, 2.0);
        } else if (tBridge < 0.75) {
          // Projects <-> Learning bridge
          const f = (tBridge - 0.5) / 0.25;
          structX = 11.0 - f * 22.0 + this.randomRange(-1.0, 1.0);
          structY = -6.5 + this.randomRange(-1.0, 1.0);
          structZ = this.randomRange(0.0, 2.0);
        } else {
          // Learning <-> People bridge
          const f = (tBridge - 0.75) / 0.25;
          structX = -11.0 + this.randomRange(-1.0, 1.0);
          structY = -6.5 + f * 13.0 + this.randomRange(-1.0, 1.0);
          structZ = this.randomRange(0.0, 2.0);
        }
      }

      const baseSize = this.randomRange(bandConfig.sizeRange[0], bandConfig.sizeRange[1]);
      const baseAlpha = this.randomRange(bandConfig.alphaRange[0], bandConfig.alphaRange[1]);

      // Unique non-repeating low-frequency wandering values
      const driftSpeed = bandConfig.driftSpeedMult;
      const freqMultiplier = 0.08 + Math.random() * 0.12;

      this.particles.push({
        id: i,
        baseX,
        baseY,
        baseZ,
        structX,
        structY,
        structZ,
        currX: baseX,
        currY: baseY,
        currZ: baseZ,
        region,
        depthBand,
        bandIndex,
        baseSize,
        currentSize: baseSize,
        baseAlpha,
        currentAlpha: baseAlpha,
        revealAlpha: 0,
        freqX: (0.85 + Math.random() * 0.4) * freqMultiplier,
        freqY: (0.75 + Math.random() * 0.5) * freqMultiplier,
        freqZ: (0.90 + Math.random() * 0.35) * freqMultiplier,
        phaseX: Math.random() * Math.PI * 2,
        phaseY: Math.random() * Math.PI * 2,
        phaseZ: Math.random() * Math.PI * 2,
        ampX: (0.45 + Math.random() * 0.65) * driftSpeed,
        ampY: (0.50 + Math.random() * 0.70) * driftSpeed,
        ampZ: (0.40 + Math.random() * 0.60) * driftSpeed,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseFreq: 0.25 + Math.random() * 0.35,
      });
    }

    // Ambient Deep Starfield Particles (Atmospheric deep layer)
    this.ambientParticles = [];
    for (let j = 0; j < totalAmbient; j++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = this.randomRange(
        PARTICLE_FIELD_CONFIG.sphereRadius.ambientMin,
        PARTICLE_FIELD_CONFIG.sphereRadius.ambientMax
      );

      const sinPhi = Math.sin(phi);
      const x = r * sinPhi * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * sinPhi * Math.sin(theta);

      this.ambientParticles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: this.randomRange(0.8, 1.6),
        alpha: this.randomRange(0.12, 0.28),
        revealAlpha: 0,
        driftSpeed: 0.05 + Math.random() * 0.05,
      });
    }
  }

  /**
   * Update particle positions, convergence toward structured regions, and breathing modulation
   */
  public update(
    time: number,
    breathingScale: number,
    reducedMotion: boolean,
    revealProgress: number = 1.0,
    convergenceFactor: number = 0.0
  ): void {
    const len = this.particles.length;
    const clampedConv = Math.max(0, Math.min(1, convergenceFactor));

    for (let i = 0; i < len; i++) {
      const p = this.particles[i];

      // Depth-specific reveal sequencing
      let bandReveal = 1.0;
      if (revealProgress < 1.0) {
        if (p.depthBand === "far") {
          bandReveal = Math.min(1.0, Math.max(0.0, revealProgress / 0.45));
        } else if (p.depthBand === "mid") {
          bandReveal = Math.min(1.0, Math.max(0.0, (revealProgress - 0.25) / 0.5));
        } else {
          bandReveal = Math.min(1.0, Math.max(0.0, (revealProgress - 0.55) / 0.45));
        }
      }
      p.revealAlpha = bandReveal;

      // Interpolate between wide scattered position and structured regional position
      const effBaseX = p.baseX * (1 - clampedConv) + p.structX * clampedConv;
      const effBaseY = p.baseY * (1 - clampedConv) + p.structY * clampedConv;
      const effBaseZ = p.baseZ * (1 - clampedConv) + p.structZ * clampedConv;

      if (reducedMotion) {
        // Pure static structure
        p.currX = effBaseX;
        p.currY = effBaseY;
        p.currZ = effBaseZ;
        p.currentAlpha = p.baseAlpha * p.revealAlpha;
        p.currentSize = p.baseSize;
        continue;
      }

      // Organic bounded wandering (restrained slightly when converged into structure)
      const wanderDamping = 1.0 - clampedConv * 0.45;
      const dx =
        p.ampX *
        wanderDamping *
        (Math.sin(time * p.freqX + p.phaseX) +
          0.32 * Math.cos(time * 0.47 * p.freqX + 1.2));
      const dy =
        p.ampY *
        wanderDamping *
        (Math.sin(time * p.freqY + p.phaseY) +
          0.32 * Math.sin(time * 0.61 * p.freqY + 2.5));
      const dz =
        p.ampZ *
        wanderDamping *
        (Math.cos(time * p.freqZ + p.phaseZ) +
          0.32 * Math.cos(time * 0.53 * p.freqZ + 0.8));

      // Apply breathing expansion/contraction
      p.currX = (effBaseX + dx) * breathingScale;
      p.currY = (effBaseY + dy) * breathingScale;
      p.currZ = (effBaseZ + dz) * breathingScale;

      // Subtle organic luminescence breathing (twinkle factor)
      const pulse = 1.0 + 0.12 * Math.sin(time * p.pulseFreq + p.pulsePhase);
      let alphaMultiplier = 1.0;
      let sizeMultiplier = 1.0;

      // Subtle active region response (visitor hover/focus on About pillar)
      if (this.activeRegion && clampedConv > 0.2) {
        if (p.region === this.activeRegion) {
          alphaMultiplier = 1.45;
          sizeMultiplier = 1.35;
        } else if (p.region !== "ambient" && p.region !== "center") {
          alphaMultiplier = 0.45;
          sizeMultiplier = 0.85;
        }
      }

      p.currentAlpha = p.baseAlpha * pulse * p.revealAlpha * alphaMultiplier;
      p.currentSize = p.baseSize * (0.95 + 0.05 * pulse) * sizeMultiplier;
    }

    // Update ambient star particles
    const ambLen = this.ambientParticles.length;
    for (let j = 0; j < ambLen; j++) {
      const a = this.ambientParticles[j];
      a.revealAlpha = Math.min(1.0, revealProgress / 0.35);

      if (!reducedMotion) {
        const t = time * a.driftSpeed;
        a.x = a.baseX + Math.sin(t + j) * 0.4;
        a.y = a.baseY + Math.cos(t * 0.8 + j) * 0.4;
        a.z = a.baseZ;
      }
    }
  }
}

