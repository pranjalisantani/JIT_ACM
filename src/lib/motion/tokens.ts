"use client";

import { useSyncExternalStore } from "react";

/**
 * ACM FACE Motion Design System Tokens
 * Editorial + Cinematic + Computational Timing & Curves
 */

export const MOTION_DURATIONS = {
  micro: 0.2,       // Micro-interactions, hover highlights
  quick: 0.4,       // Swift state changes, focus transitions
  standard: 0.8,    // General UI entrance, card reveals
  reveal: 1.2,      // Editorial text masking & coordinate alignments
  breath: 3.2,      // Ambient computational node oscillation
  aperture: 0.85,   // Experience layer entry / exit transitions
} as const;

/**
 * Motion Hierarchy Scale
 * FAST: identity moments, important transitions
 * MEDIUM: content reveals
 * SLOW: computational background, ambient movement
 * VERY SLOW: large environmental transformations
 */
export const MOTION_HIERARCHY = {
  fast: 0.35,       // Identity punch, responsive states
  medium: 0.75,     // Editorial content reveals
  slow: 2.2,        // Computational field state morphing
  verySlow: 4.2,    // Environmental transformations, breathing cycles
} as const;

export const MOTION_EASES = {
  cinematic: "power3.out",
  smooth: "power2.out",
  breath: "sine.inOut",
  aperture: "power4.inOut",
  expo: "expo.out",
  linear: "none",
} as const;

export const MOTION_STAGGER = {
  fast: 0.04,
  standard: 0.08,
  cinematic: 0.14,
} as const;

/**
 * Check if prefers-reduced-motion is enabled in client environment
 */
export function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeReducedMotion(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getReducedMotionServerSnapshot(): boolean {
  return false;
}

/**
 * React hook using useSyncExternalStore to listen for reduced motion preference
 * without cascading effect re-renders in React 19.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
}
