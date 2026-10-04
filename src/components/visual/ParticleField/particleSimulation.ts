/**
 * ACM FACE — Particle Simulation
 * Living computational environment: physics-inspired cursor force fields,
 * inertia, dynamic clustering, and scroll-driven section topologies.
 */

import { PARTICLE_FIELD_CONFIG, DepthBandConfig } from "./config";

export type DepthBand = "far" | "mid" | "near";

export type ParticleRegion =
  | "center"
  | "people"
  | "events"
  | "projects"
  | "learning"
  | "bridge"
  | "ambient"
  | "team";

export interface CursorForce {
  active: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
}

export interface Particle {
  id: number;
  baseX: number;
  baseY: number;
  baseZ: number;

  // Section-specific topological targets
  heroX: number;
  heroY: number;
  heroZ: number;

  aboutX: number;
  aboutY: number;
  aboutZ: number;

  eventsX: number;
  eventsY: number;
  eventsZ: number;

  projectsX: number;
  projectsY: number;
  projectsZ: number;

  teamX: number;
  teamY: number;
  teamZ: number;

  footerX: number;
  footerY: number;
  footerZ: number;

  // Current interpolated structural anchor
  structX: number;
  structY: number;
  structZ: number;

  // Current physics position
  currX: number;
  currY: number;
  currZ: number;

  // Physics state
  vx: number;
  vy: number;
  vz: number;
  mass: number;
  damping: number;
  springK: number;
  attractionSensitivity: number;
  repulsionSensitivity: number;
  connectionRangeMultiplier: number;

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
  public currentSection: string = "hero";

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

      // 1. Fibonacci distribution blended with volumetric dispersion (default organic field)
      const yNorm = 1 - (i / (totalParticles - 1)) * 2; // -1 to 1
      const theta = goldenAngle * i;
      const phi = Math.acos(Math.max(-1, Math.min(1, yNorm)));

      let baseRadialDist: number;
      let depthZOffset: number;
      let lateralSpread: number;

      if (depthBand === "near") {
        baseRadialDist = this.randomRange(12.0, 18.0);
        depthZOffset = this.randomRange(4.0, 12.0);
        lateralSpread = 1.25;
      } else if (depthBand === "mid") {
        baseRadialDist = this.randomRange(16.0, 24.0);
        depthZOffset = this.randomRange(-6.0, 4.0);
        lateralSpread = 1.15;
      } else {
        baseRadialDist = this.randomRange(22.0, 32.0);
        depthZOffset = this.randomRange(-18.0, -6.0);
        lateralSpread = 1.35;
      }

      const harmonicDisplacement =
        Math.sin(2.5 * phi) * Math.cos(3.2 * theta) * 2.8 +
        Math.cos(1.8 * phi + theta * 0.5) * 2.0 +
        (Math.random() - 0.5) * 3.2;

      const effRadius = baseRadialDist + harmonicDisplacement;
      const sinPhi = Math.sin(phi);

      const baseX = Math.cos(theta) * sinPhi * effRadius * lateralSpread;
      const baseY = Math.cos(phi) * effRadius * 0.85;
      const baseZ = Math.sin(theta) * sinPhi * effRadius + depthZOffset;

      // ─────────────────────────────────────────────────────────────
      // 2. Section-Specific Topologies
      // ─────────────────────────────────────────────────────────────

      // ─────────────────────────────────────────────────────────────
      // 2. HERO: Living Computational Constellation framing Typography
      // ─────────────────────────────────────────────────────────────
      let heroX = baseX;
      let heroY = baseY;
      let heroZ = baseZ;

      if (i < 95) {
        // Group A: Organic Elliptical Framing Constellation around Hero Typography
        const a = (i / 95) * Math.PI * 2;
        const semiMajor = this.randomRange(14.5, 19.5);
        const semiMinor = this.randomRange(7.0, 11.2);
        const jitterR = this.randomRange(-1.2, 1.2);
        heroX = Math.cos(a) * (semiMajor + jitterR);
        heroY = 1.6 + Math.sin(a) * (semiMinor + jitterR * 0.7);
        heroZ = Math.sin(a * 2.5) * 3.0 + this.randomRange(-2.0, 3.5);
      } else if (i < 155) {
        // Group B: Flanking Architectural Cluster (Left Systems Wing)
        const a = Math.random() * Math.PI * 2;
        const r = this.randomRange(1.0, 6.2);
        heroX = -17.5 + Math.cos(a) * r * 1.25;
        heroY = 1.2 + Math.sin(a) * r * 0.85;
        heroZ = this.randomRange(-2.5, 4.0);
      } else if (i < 215) {
        // Group C: Flanking Architectural Cluster (Right Algorithmic Wing)
        const a = Math.random() * Math.PI * 2;
        const r = this.randomRange(1.0, 6.2);
        heroX = 17.5 + Math.cos(a) * r * 1.25;
        heroY = 2.0 + Math.sin(a) * r * 0.85;
        heroZ = this.randomRange(-2.5, 4.0);
      } else if (i < 265) {
        // Group D: Upper Spanning Horizon Bridge (Chapter Init Datum)
        const u = (i - 215) / 50;
        heroX = -18.0 + u * 36.0 + this.randomRange(-1.5, 1.5);
        heroY = 9.2 + Math.sin(u * Math.PI) * 1.8 + this.randomRange(-1.2, 1.2);
        heroZ = this.randomRange(-3.0, 2.0);
      } else if (i < 315) {
        // Group E: Lower Grounding Constellation (Explore Datum)
        const u = (i - 265) / 50;
        heroX = -16.0 + u * 32.0 + this.randomRange(-1.5, 1.5);
        heroY = -9.8 - Math.sin(u * Math.PI) * 1.5 + this.randomRange(-1.2, 1.2);
        heroZ = this.randomRange(-2.0, 3.0);
      } else {
        // Group F: Deep Spatial Volumetric Atmosphere & Peripheral Network
        heroX = baseX * 1.25;
        heroY = baseY * 1.15;
        heroZ = baseZ;
      }

      // Gentle framing clearance directly behind primary title text
      const textCenterX = 0;
      const textCenterY = 1.8;
      const dxText = heroX - textCenterX;
      const dyText = heroY - textCenterY;
      if (Math.abs(dxText) < 7.5 && Math.abs(dyText) < 2.2 && Math.abs(heroZ) < 2.5) {
        const textDist = Math.sqrt(dxText * dxText + dyText * dyText) || 0.1;
        const pushDist = (1.0 - textDist / 8.0) * 1.8;
        heroX += (dxText / textDist) * pushDist;
        heroY += (dyText / textDist) * pushDist * 0.5;
      }

      const aboutX = heroX;
      const aboutY = heroY;
      const aboutZ = heroZ;
      const eventsX = heroX;
      const eventsY = heroY;
      const eventsZ = heroZ;
      const projectsX = heroX;
      const projectsY = heroY;
      const projectsZ = heroZ;
      const teamX = heroX;
      const teamY = heroY;
      const teamZ = heroZ;
      const footerX = heroX;
      const footerY = heroY;
      const footerZ = heroZ;
      const region: ParticleRegion = i < 95 ? "center" : i < 155 ? "people" : i < 215 ? "projects" : "ambient";

      // Physics constants tailored per particle for natural non-uniformity
      const mass = this.randomRange(0.85, 1.35);
      const damping = this.randomRange(0.88, 0.92);
      const springK = this.randomRange(0.045, 0.075);
      const attractionSensitivity = this.randomRange(0.85, 1.30);
      const repulsionSensitivity = this.randomRange(0.95, 1.40);
      const connectionRangeMultiplier = (i < 215) ? this.randomRange(1.10, 1.35) : this.randomRange(0.85, 1.15);

      const baseSize = this.randomRange(bandConfig.sizeRange[0], bandConfig.sizeRange[1]);
      const baseAlpha = this.randomRange(bandConfig.alphaRange[0], bandConfig.alphaRange[1]);

      const driftSpeed = bandConfig.driftSpeedMult;
      const freqMultiplier = 0.08 + Math.random() * 0.12;

      this.particles.push({
        id: i,
        baseX,
        baseY,
        baseZ,
        heroX,
        heroY,
        heroZ,
        aboutX,
        aboutY,
        aboutZ,
        eventsX,
        eventsY,
        eventsZ,
        projectsX,
        projectsY,
        projectsZ,
        teamX,
        teamY,
        teamZ,
        footerX,
        footerY,
        footerZ,
        structX: heroX,
        structY: heroY,
        structZ: heroZ,
        currX: heroX,
        currY: heroY,
        currZ: heroZ,
        vx: 0,
        vy: 0,
        vz: 0,
        mass,
        damping,
        springK,
        attractionSensitivity,
        repulsionSensitivity,
        connectionRangeMultiplier,
        region,
        depthBand,
        bandIndex,
        baseSize,
        currentSize: baseSize,
        baseAlpha,
        currentAlpha: baseAlpha,
        revealAlpha: 1.0,
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

    // Ambient Deep Starfield Particles
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
        size: this.randomRange(1.2, 2.4),
        alpha: this.randomRange(0.25, 0.45),
        revealAlpha: 1.0,
        driftSpeed: 0.05 + Math.random() * 0.05,
      });
    }
  }

  /**
   * Update particle positions, physics simulation, cursor forces, and breathing modulation
   */
  public update(
    time: number,
    breathingScale: number,
    reducedMotion: boolean,
    revealProgress: number = 1.0,
    convergenceFactor: number = 0.0,
    cursor: CursorForce | null = null,
    sectionState: string = "hero"
  ): void {
    const len = this.particles.length;
    const clampedConv = Math.max(0, Math.min(1, convergenceFactor));
    this.currentSection = sectionState;

    for (let i = 0; i < len; i++) {
      const p = this.particles[i];

      // Immediate and continuous reveal sequencing
      let bandReveal = 1.0;
      if (revealProgress < 1.0) {
        if (p.depthBand === "far") {
          bandReveal = Math.min(1.0, Math.max(0.1, revealProgress / 0.25));
        } else if (p.depthBand === "mid") {
          bandReveal = Math.min(1.0, Math.max(0.1, revealProgress / 0.35));
        } else {
          bandReveal = Math.min(1.0, Math.max(0.1, revealProgress / 0.45));
        }
      }
      p.revealAlpha = bandReveal;

      // 1. Target topological anchor (Hero Constellation as the persistent structural foundation)
      const targetTx = p.heroX;
      const targetTy = p.heroY;
      const targetTz = p.heroZ;

      // Smooth interpolation of structural anchor
      p.structX += (targetTx - p.structX) * 0.05;
      p.structY += (targetTy - p.structY) * 0.05;
      p.structZ += (targetTz - p.structZ) * 0.05;

      // Structural position in 3D volume
      const effBaseX = p.structX;
      const effBaseY = p.structY;
      const effBaseZ = p.structZ;

      if (reducedMotion) {
        // Pure static structure for reduced motion preference
        p.currX = effBaseX;
        p.currY = effBaseY;
        p.currZ = effBaseZ;
        p.currentAlpha = p.baseAlpha * p.revealAlpha;
        p.currentSize = p.baseSize;
        continue;
      }

      // 2. Organic low-frequency bounded wandering (calm and continuous)
      const wanderDamping = 1.0 - clampedConv * 0.35;
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

      // Equilibrium home target position
      const homeX = (effBaseX + dx) * breathingScale;
      const homeY = (effBaseY + dy) * breathingScale;
      const homeZ = (effBaseZ + dz) * breathingScale;

      // 3. Radial Cursor Force Field (Calmer, Restrained, Subtle local response)
      let forceX = 0;
      let forceY = 0;
      let forceZ = 0;

      if (cursor && cursor.active) {
        const cdx = cursor.x - p.currX;
        const cdy = cursor.y - p.currY;
        const cdz = cursor.z - p.currZ;

        // Depth-scaled distance
        const effDistSq = cdx * cdx + cdy * cdy + (cdz * 0.35) * (cdz * 0.35);
        const dist = Math.sqrt(effDistSq);

        const R_inner = 2.4;   // Small, intimate local repulsion zone
        const R_outer = 7.2;   // Restrained outer influence radius

        if (dist < R_outer && dist > 0.001) {
          const invDist = 1.0 / dist;
          const nx = cdx * invDist;
          const ny = cdy * invDist;
          const nz = cdz * invDist;

          // Gentle activity scaling that settles naturally when pointer stops
          const cursorSpeed = Math.sqrt(cursor.vx * cursor.vx + cursor.vy * cursor.vy);
          const activityMult = 0.35 + 0.65 * Math.min(1.0, cursorSpeed * 1.5);

          if (dist < R_inner) {
            // Smooth, non-explosive local displacement
            const rRatio = 1.0 - dist / R_inner;
            const repelMag = rRatio * rRatio * 0.28 * p.repulsionSensitivity * activityMult;
            forceX -= nx * repelMag;
            forceY -= ny * repelMag;
            forceZ -= nz * repelMag * 0.15;
          } else {
            // Subtle alignment and natural attraction back into surrounding cluster
            const ringT = (dist - R_inner) / (R_outer - R_inner);
            const attractMag = Math.sin(ringT * Math.PI) * 0.08 * p.attractionSensitivity * activityMult;
            forceX += nx * attractMag;
            forceY += ny * attractMag;
            forceZ += nz * attractMag * 0.08;
          }

          // Gentle momentum transfer from moving cursor only
          const disturbRatio = Math.max(0, 1.0 - dist / R_outer);
          forceX += cursor.vx * 0.08 * disturbRatio;
          forceY += cursor.vy * 0.08 * disturbRatio;
        }
      }

      // Contextual dampening over card and editorial sections to maintain focus
      if (
        sectionState === "projects" ||
        sectionState === "team" ||
        sectionState === "closing" ||
        sectionState === "footer"
      ) {
        forceX *= 0.45;
        forceY *= 0.45;
      }

      // 3.5. Subtle Typography Clearance (Gentle outward pressure directly behind central title)
      const textCenterX = 0;
      const textCenterY = 1.6;
      const inTextCorridor =
        Math.abs(p.currX - textCenterX) < 7.0 &&
        p.currY > 0.4 &&
        p.currY < 3.2 &&
        Math.abs(p.currZ) < 2.5;

      if (inTextCorridor) {
        const tdx = p.currX - textCenterX;
        const tdy = p.currY - textCenterY;
        const tDist = Math.sqrt(tdx * tdx + tdy * tdy) || 0.1;
        const pushMag = Math.max(0, 1.0 - tDist / 7.0) * 0.10;
        forceX += (tdx / tDist) * pushMag;
        forceY += (tdy / tDist) * pushMag;
      }

      // 4. Spring restoring force toward home position
      const springFx = (homeX - p.currX) * p.springK;
      const springFy = (homeY - p.currY) * p.springK;
      const springFz = (homeZ - p.currZ) * p.springK;

      // 5. Numerical integration with mass, inertia and damping
      p.vx = (p.vx + (forceX + springFx) / p.mass) * p.damping;
      p.vy = (p.vy + (forceY + springFy) / p.mass) * p.damping;
      p.vz = (p.vz + (forceZ + springFz) / p.mass) * p.damping;

      // Velocity Clamping to prevent any teleporting or snapping
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy + p.vz * p.vz);
      if (speed > 1.2) {
        const clampRatio = 1.2 / speed;
        p.vx *= clampRatio;
        p.vy *= clampRatio;
        p.vz *= clampRatio;
      }

      p.currX += p.vx;
      p.currY += p.vy;
      p.currZ += p.vz;

      // 6. Organic luminescence & active region modulation with section-aware density
      const pulse = 1.0 + 0.08 * Math.sin(time * p.pulseFreq + p.pulsePhase);
      let alphaMultiplier = 1.0;
      let sizeMultiplier = 1.0;

      if (this.activeRegion) {
        if (p.region === this.activeRegion || (this.activeRegion === "team" && p.depthBand === "near")) {
          alphaMultiplier = 1.3;
          sizeMultiplier = 1.2;
        } else if (p.region !== "ambient" && p.region !== "center") {
          alphaMultiplier = 0.45;
          sizeMultiplier = 0.85;
        }
      }

      // Calibrated Section-Aware Density per Prompt Specification
      let sectionAlphaMult = 1.0;
      let sectionSizeMult = 1.0;

      switch (sectionState) {
        case "hero":
          sectionAlphaMult = 1.0;
          sectionSizeMult = 1.0;
          break;
        case "sponsors":
          sectionAlphaMult = 0.85;
          sectionSizeMult = 0.95;
          break;
        case "about":
          sectionAlphaMult = 0.78;
          sectionSizeMult = 0.92;
          break;
        case "events":
          sectionAlphaMult = 0.68;
          sectionSizeMult = 0.88;
          break;
        case "gallery":
          sectionAlphaMult = 0.58;
          sectionSizeMult = 0.85;
          break;
        case "projects":
          sectionAlphaMult = 0.50;
          sectionSizeMult = 0.82;
          break;
        case "team":
          sectionAlphaMult = 0.46;
          sectionSizeMult = 0.80;
          break;
        case "closing":
          sectionAlphaMult = 0.30;
          sectionSizeMult = 0.75;
          break;
        case "footer":
          sectionAlphaMult = 0.22;
          sectionSizeMult = 0.70;
          break;
        default:
          sectionAlphaMult = 0.80;
          sectionSizeMult = 0.90;
      }

      p.currentAlpha = p.baseAlpha * pulse * p.revealAlpha * alphaMultiplier * sectionAlphaMult;
      p.currentSize = p.baseSize * (0.95 + 0.05 * pulse) * sizeMultiplier * sectionSizeMult;
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


