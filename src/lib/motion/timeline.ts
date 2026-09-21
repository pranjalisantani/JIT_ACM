"use client";

import gsap from "gsap";
import { getPrefersReducedMotion, MOTION_DURATIONS, MOTION_EASES } from "./tokens";

/**
 * Creates an isomorphic GSAP timeline that automatically collapses durations
 * if the user has requested reduced motion.
 */
export function createSafeTimeline(vars?: gsap.TimelineVars): gsap.core.Timeline {
  const isReduced = getPrefersReducedMotion();
  const tl = gsap.timeline({
    ...vars,
  });

  if (isReduced) {
    tl.timeScale(100); // Instantly fast-forward animations for reduced motion
  }

  return tl;
}

/**
 * Editorial text reveal helper:
 * Reveals elements with an upward slide and opacity fade, masked by overflow hidden.
 */
export function revealTextElement(
  target: gsap.DOMTarget,
  options?: {
    delay?: number;
    duration?: number;
    stagger?: number;
    yOffset?: number;
  }
) {
  if (getPrefersReducedMotion()) {
    return gsap.set(target, { opacity: 1, y: 0 });
  }

  const {
    delay = 0,
    duration = MOTION_DURATIONS.reveal,
    stagger = 0.05,
    yOffset = 24,
  } = options || {};

  return gsap.fromTo(
    target,
    {
      opacity: 0,
      y: yOffset,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      delay,
      ease: MOTION_EASES.cinematic,
    }
  );
}

/**
 * Aperture fade-out transition helper for experience layer exit.
 */
export function exitLayerTransition(
  target: gsap.DOMTarget,
  onComplete?: () => void
) {
  if (getPrefersReducedMotion()) {
    gsap.set(target, { opacity: 0, pointerEvents: "none" });
    onComplete?.();
    return;
  }

  return gsap.to(target, {
    opacity: 0,
    duration: MOTION_DURATIONS.aperture,
    ease: MOTION_EASES.aperture,
    onComplete: () => {
      gsap.set(target, { pointerEvents: "none" });
      onComplete?.();
    },
  });
}
