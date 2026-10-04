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
    particleCount: 240,
    ambientCount: 85,
    maxConnectionsPerParticle: 2,
    maxTotalConnections: 240,
    connectionDistanceThreshold: 4.2,
    dprCap: 2.0,
  },
  mobile: {
    particleCount: 120,
    ambientCount: 35,
    maxConnectionsPerParticle: 2,
    maxTotalConnections: 90,
    connectionDistanceThreshold: 3.6,
    dprCap: 1.5,
  },
  // Spatial Geometry
  sphereRadius: {
    min: 15,
    max: 28,
    ambientMin: 34,
    ambientMax: 56,
  },
  // Depth Band Distribution: Far (48%), Mid (38%), Near (14%)
  depthBands: {
    far: {
      ratio: 0.48,
      sizeRange: [2.2, 3.4] as [number, number],
      alphaRange: [0.30, 0.48] as [number, number],
      driftSpeedMult: 0.30,
      connectionWeight: 0.40,
    },
    mid: {
      ratio: 0.38,
      sizeRange: [3.5, 5.0] as [number, number],
      alphaRange: [0.48, 0.70] as [number, number],
      driftSpeedMult: 0.50,
      connectionWeight: 0.60,
    },
    near: {
      ratio: 0.14,
      sizeRange: [5.0, 7.0] as [number, number],
      alphaRange: [0.70, 0.95] as [number, number],
      driftSpeedMult: 0.70,
      connectionWeight: 0.80,
    },
  },
  // Autonomous World Rotation
  rotation: {
    baseSpeedY: 0.0008, // Slow, calm 360° celestial drift
    wobbleSpeedX: 0.0003,
    wobbleAmpX: 0.018,
  },
  // Living Breathing Pulse
  breathing: {
    speed: 0.18,
    amplitude: 0.020,
  },
  // Cursor Influence: Gentle, discoverable, subtle local movement
  cursor: {
    tiltSensitivityX: 0.035,
    tiltSensitivityY: 0.025,
    lerpFactor: 0.035,
  },
  // Restrained Computational Palette (White + Cool-Blue + Slate)
  colors: {
    background: "#000000",
    coreWhite: "#FFFFFF",
    coolSilver: "#E2E8F0",
    coolBlueTint: "#BAE6FD",
    slateDim: "#64748B",
    ambientStar: "#334155",
    connectionBaseAlpha: 0.12, // Restrained thin hairlines
    connectionCoolTint: [0.82, 0.90, 1.0] as [number, number, number],
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
 * Calibrated section-aware densities keeping field within viewport across all sections
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
    connectionAlphaMult: 0.85,
    convergenceFactor: 0.0,
  },
  sponsors: {
    camX: 0,
    camY: 0.2,
    camZ: 34,
    rotYOffset: 0.08,
    rotXOffset: 0.01,
    fieldScale: 0.95,
    fieldShiftX: 0,
    fieldShiftY: -0.1,
    connectionAlphaMult: 0.60,
    convergenceFactor: 0.06,
  },
  about: {
    camX: 1.2,
    camY: -0.3,
    camZ: 32,
    rotYOffset: 0.18,
    rotXOffset: 0.02,
    fieldScale: 0.92,
    fieldShiftX: -0.6,
    fieldShiftY: 0.1,
    connectionAlphaMult: 0.50,
    convergenceFactor: 0.35,
  },
  events: {
    camX: -2.0,
    camY: 0.5,
    camZ: 33,
    rotYOffset: -0.25,
    rotXOffset: -0.02,
    fieldScale: 0.90,
    fieldShiftX: 1.0,
    fieldShiftY: -0.2,
    connectionAlphaMult: 0.40,
    convergenceFactor: 0.20,
  },
  gallery: {
    camX: 0,
    camY: -0.3,
    camZ: 35,
    rotYOffset: 0.45,
    rotXOffset: 0.01,
    fieldScale: 0.86,
    fieldShiftX: 0,
    fieldShiftY: 0.1,
    connectionAlphaMult: 0.30,
    convergenceFactor: 0.10,
  },
  projects: {
    camX: 0.5,
    camY: 0.4,
    camZ: 35,
    rotYOffset: 0.35,
    rotXOffset: 0.01,
    fieldScale: 0.84,
    fieldShiftX: -0.2,
    fieldShiftY: -0.2,
    connectionAlphaMult: 0.25,
    convergenceFactor: 0.06,
  },
  team: {
    camX: 0,
    camY: 0.3,
    camZ: 35,
    rotYOffset: 0.85,
    rotXOffset: 0.01,
    fieldScale: 0.82,
    fieldShiftX: 0,
    fieldShiftY: -0.2,
    connectionAlphaMult: 0.20,
    convergenceFactor: 0.05,
  },
  closing: {
    camX: 0,
    camY: 0.2,
    camZ: 35,
    rotYOffset: 1.4,
    rotXOffset: 0.01,
    fieldScale: 0.80,
    fieldShiftX: 0,
    fieldShiftY: -0.25,
    connectionAlphaMult: 0.12,
    convergenceFactor: 0.02,
  },
  footer: {
    camX: 0,
    camY: 0.2,
    camZ: 36,
    rotYOffset: 1.8,
    rotXOffset: 0.01,
    fieldScale: 0.78,
    fieldShiftX: 0,
    fieldShiftY: -0.3,
    connectionAlphaMult: 0.08,
    convergenceFactor: 0.01,
  },
};
