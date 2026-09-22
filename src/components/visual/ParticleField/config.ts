/**
 * ACM FACE — Persistent Cinematic Computational Background Configuration
 * Grayscale, 3D Spatial Volume, Depth Bands, Organic Motion, and Section States
 */

export interface DepthBandConfig {
  ratio: number;
  sizeRange: [number, number];
  alphaRange: [number, number];
  driftSpeedMult: number;
  connectionWeight: number;
}

export interface SectionPreset {
  camX: number;
  camY: number;
  camZ: number;
  rotYOffset: number;
  rotXOffset: number;
  fieldScale: number;
  fieldShiftX: number;
  fieldShiftY: number;
  connectionAlphaMult: number;
  convergenceFactor: number; // 0 = wide scattered, 1 = converged architectural structure
}

export const PARTICLE_FIELD_CONFIG = {
  desktop: {
    particleCount: 420,
    ambientCount: 140,
    maxConnectionsPerParticle: 3,
    maxTotalConnections: 600,
    connectionDistanceThreshold: 4.8,
    dprCap: 2.0,
  },
  mobile: {
    particleCount: 200,
    ambientCount: 60,
    maxConnectionsPerParticle: 2,
    maxTotalConnections: 240,
    connectionDistanceThreshold: 4.2,
    dprCap: 1.5,
  },
  // Spatial Geometry
  sphereRadius: {
    min: 14,
    max: 26,
    ambientMin: 32,
    ambientMax: 55,
  },
  // Depth Band Distribution: Far (50%), Mid (35%), Near (15%)
  depthBands: {
    far: {
      ratio: 0.50,
      sizeRange: [1.2, 2.0] as [number, number],
      alphaRange: [0.10, 0.22] as [number, number],
      driftSpeedMult: 0.35,
      connectionWeight: 0.35,
    },
    mid: {
      ratio: 0.35,
      sizeRange: [2.2, 3.4] as [number, number],
      alphaRange: [0.22, 0.38] as [number, number],
      driftSpeedMult: 0.65,
      connectionWeight: 0.75,
    },
    near: {
      ratio: 0.15,
      sizeRange: [4.0, 6.0] as [number, number],
      alphaRange: [0.38, 0.60] as [number, number],
      driftSpeedMult: 1.0,
      connectionWeight: 1.0,
    },
  },
  // Autonomous World Rotation
  rotation: {
    baseSpeedY: 0.0014, // ~70 seconds per full 360° turn at 60fps
    wobbleSpeedX: 0.0005,
    wobbleAmpX: 0.035,
  },
  // Breathing
  breathing: {
    speed: 0.28,
    amplitude: 0.030,
  },
  // Cursor Influence
  cursor: {
    tiltSensitivityX: 0.07,
    tiltSensitivityY: 0.05,
    lerpFactor: 0.04,
  },
  // Grayscale Colors
  colors: {
    background: "#000000",
    coreWhite: "#FFFFFF",
    haloSilver: "#D4D4D8",
    grayMid: "#94A3B8",
    grayDim: "#475569",
    ambientStar: "#334155",
    connectionBaseAlpha: 0.065,
  },
  // Camera Defaults
  camera: {
    fov: 48,
    near: 0.1,
    far: 1000,
    defaultZ: 33,
    lookAt: [0, -0.4, 0] as [number, number, number],
  },
};

/**
 * Section Presets orchestrated via GSAP ScrollTrigger
 * Neutral and graceful transitions between sections
 */
export const SECTION_PRESETS: Record<string, SectionPreset> = {
  hero: {
    camX: 0,
    camY: 0,
    camZ: 33,
    rotYOffset: 0,
    rotXOffset: 0,
    fieldScale: 1.0,
    fieldShiftX: 0,
    fieldShiftY: 0,
    connectionAlphaMult: 1.0,
    convergenceFactor: 0.0,
  },
  about: {
    camX: 1.5,
    camY: -0.6,
    camZ: 28,
    rotYOffset: 0.22,
    rotXOffset: 0.02,
    fieldScale: 0.95,
    fieldShiftX: -1.0,
    fieldShiftY: 0.3,
    connectionAlphaMult: 1.35,
    convergenceFactor: 0.85,
  },
  events: {
    camX: -4.0,
    camY: 1.2,
    camZ: 31,
    rotYOffset: -0.45,
    rotXOffset: -0.03,
    fieldScale: 1.04,
    fieldShiftX: 2.2,
    fieldShiftY: -0.5,
    connectionAlphaMult: 0.95,
    convergenceFactor: 0.35,
  },
  gallery: {
    camX: 0,
    camY: -1.8,
    camZ: 36,
    rotYOffset: 0.70,
    rotXOffset: 0.04,
    fieldScale: 1.18,
    fieldShiftX: 0,
    fieldShiftY: 0.6,
    connectionAlphaMult: 0.80,
    convergenceFactor: 0.15,
  },
  projects: {
    camX: 3.5,
    camY: 0.8,
    camZ: 27,
    rotYOffset: 1.25,
    rotXOffset: -0.02,
    fieldScale: 0.98,
    fieldShiftX: -2.0,
    fieldShiftY: -0.4,
    connectionAlphaMult: 1.30,
    convergenceFactor: 0.65,
  },
  team: {
    camX: -2.8,
    camY: -1.2,
    camZ: 34,
    rotYOffset: 1.85,
    rotXOffset: 0.03,
    fieldScale: 1.10,
    fieldShiftX: 1.6,
    fieldShiftY: 0.4,
    connectionAlphaMult: 1.05,
    convergenceFactor: 0.40,
  },
  alumni: {
    camX: 1.8,
    camY: -0.6,
    camZ: 36,
    rotYOffset: 2.35,
    rotXOffset: 0.01,
    fieldScale: 0.92,
    fieldShiftX: -1.2,
    fieldShiftY: 0.2,
    connectionAlphaMult: 0.65,
    convergenceFactor: 0.22,
  },
  footer: {
    camX: 0,
    camY: 0.2,
    camZ: 40,
    rotYOffset: 3.1,
    rotXOffset: 0,
    fieldScale: 0.75,
    fieldShiftX: 0,
    fieldShiftY: -0.2,
    connectionAlphaMult: 0.22,
    convergenceFactor: 0.02,
  },
};

