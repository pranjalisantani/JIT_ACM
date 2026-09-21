/**
 * ACM FACE — Opening Experience Configuration
 * Single source of truth for all timeline, population, physics,
 * spatial, and aesthetic constants.
 */

export const OPENING_TIMELINE = {
  // Phase landmarks (in seconds)
  BLACK_END: 0.6,
  POINTS_RAMP_START: 0.6,
  POINTS_RAMP_MID: 2.0,
  EDGES_START: 2.4,
  POINTS_RAMP_FULL: 4.0,
  CLUSTERS_ARTICULATED: 5.5,
  
  // Identity emergence (ACM)
  IDENTITY_SPRINGS_ENGAGE: 5.5,
  NON_ASSEMBLED_DIM_START: 5.5,
  CLEAN_ACM_FADE_IN_START: 6.0,
  CLEAN_ACM_STABLE: 6.5,
  
  // Voice & Subtitle
  VOICE_START: 6.5,
  CAPTION_FADE_IN: 6.5,
  CAPTION_FADE_OUT: 7.5,
  
  // Morph to ACM FACE
  MORPH_RELEASE_START: 7.5,
  ACM_FACE_FADE_IN: 7.8,
  TAGLINE_FADE_IN: 8.0,
  IDENTITY_COMPLETE: 8.2,
  
  // Hold & Reveal
  HOLD_COMPLETE: 8.7,     // ACM FACE held >= 0.5s (8.2 -> 8.7)
  EXIT_FADE_START: 8.6,   // 8.6 -> 9.0 (400ms exit)
  TOTAL_DURATION: 9.0,    // Hard cap 9.0s

  // Reduced motion timeline (total <= 2.5s)
  REDUCED_MOTION_TOTAL: 2.3,
  REDUCED_MOTION_IDENTITY_IN: 0.2,
  REDUCED_MOTION_FACE_IN: 0.9,
  REDUCED_MOTION_EXIT: 1.8,
} as const;

export const OPENING_POPULATION = {
  DESKTOP_MAX: 220, // 180–260 range
  MOBILE_MAX: 100,  // 80–120 range
  
  // Ramped reveals from pre-allocated pool (desktop counts)
  DESKTOP_COUNTS: {
    INITIAL: 0,
    T0_6: 10,
    T2_0: 40,
    T4_0: 150,
    T5_5: 220,
  },
  MOBILE_COUNTS: {
    INITIAL: 0,
    T0_6: 6,
    T2_0: 20,
    T4_0: 70,
    T5_5: 100,
  },
} as const;

export const OPENING_DEPTH_LAYERS = {
  FAR: {
    share: 0.45,
    minRadius: 0.6,
    maxRadius: 0.9,
    minAlpha: 0.18,
    maxAlpha: 0.30,
    speedMultiplier: 0.45,
    extraRadiusPx: 1.0,
    defocusAlpha: 0.5,
  },
  MID: {
    share: 0.35,
    minRadius: 1.0,
    maxRadius: 1.4,
    minAlpha: 0.35,
    maxAlpha: 0.55,
    speedMultiplier: 1.0,
  },
  NEAR: {
    share: 0.20,
    minRadius: 1.5,
    maxRadius: 2.2,
    minAlpha: 0.60,
    maxAlpha: 0.85,
    speedMultiplier: 1.6,
  },
} as const;

export const OPENING_PHYSICS = {
  // Drift velocity (css px/s)
  MIN_SPEED: 4,
  MAX_SPEED: 12,
  
  // Drift noise field periods (seconds)
  DRIFT_PERIOD_MIN: 8,
  DRIFT_PERIOD_MAX: 16,
  
  // Breathing
  BREATH_MAX_AMPLITUDE: 5.5, // <= 6px
  BREATH_PERIOD_MIN: 9,
  BREATH_PERIOD_MAX: 14,
  
  // Camera push-in
  CAMERA_SCALE_START: 1.00,
  CAMERA_SCALE_END: 1.06,
  
  // Density attractors
  ATTRACTOR_COUNT: 6, // 5–8 range
  ATTRACTOR_MIN_RADIUS_RATIO: 0.14, // 12–28% of shorter edge
  ATTRACTOR_MAX_RADIUS_RATIO: 0.26,
  ATTRACTOR_MAX_DRIFT_SPEED: 2.5,   // <= 3 px/s
  ATTRACTOR_MAX_PULL_RATIO: 0.12,   // <= 15% of velocity
} as const;

export const OPENING_EDGES = {
  CONNECTION_RADIUS_RATIO: 0.125, // 11–14% of shorter viewport edge
  MAX_NEIGHBORS_DESKTOP: 3,       // at most 3–4 nearer neighbours
  MAX_NEIGHBORS_MOBILE: 2,
  MAX_EDGE_ALPHA: 0.14,           // 0.10–0.18 range
  ALPHA_BUCKETS: 5,               // 4–6 batch paths
} as const;

export const OPENING_IDENTITY = {
  TARGET_POINTS_COUNT: 128,       // ~110–140 range
  SPRING_DAMPING: 0.85,           // critically damped
  SPRING_STIFFNESS: 4.2,          // ~0.9–1.3s to settle
  STAGGER_MAX_DELAY: 0.45,
  ASSEMBLED_DRIFT_REDUCTION: 0.25,// constellation breathes, never freezes
  CONSTELLATION_EDGE_BOOST: 1.85, // up to 2x normal alpha
  BACKGROUND_DIM_MULTIPLIER: 0.65,// dim by ~35%
} as const;

export const OPENING_STRINGS = {
  VOICE_ON: "VOICE ON",
  VOICE_OFF: "VOICE OFF",
  SKIP: "SKIP",
  ESC: "ESC",
  SUBTITLE: "Welcome to ACM.",
  IDENTITY_PRIMARY: "ACM",
  IDENTITY_MORPHED: "ACM FACE",
  TAGLINE: "A LIVING COMPUTING COMMUNITY",
} as const;

export const OPENING_AUDIO = {
  SRC: "/audio/acm-welcome.wav",
  VOICE_SOURCES: ["/audio/acm-welcome.mp3", "/audio/acm-welcome.wav"],
  STORAGE_MUTE_KEY: "acm_voice_muted",
} as const;

export const OPENING_GATING = {
  STORAGE_VISITED_KEY: "acm_visited_opening",
  QUERY_PARAM: "opening",
  HTML_DATA_ATTR: "data-opening",
} as const;
