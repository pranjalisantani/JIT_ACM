"use client";

import gsap from "gsap";
import { getPrefersReducedMotion, MOTION_EASES, MOTION_HIERARCHY } from "./tokens";

export interface TextRevealOptions {
  delay?: number;
  duration?: number;
  stagger?: number;
  yOffsetPercent?: number;
}

/**
 * Editorial typography reveal:
 * Smoothly shifts elements upwards from an overflow-hidden mask with controlled opacity.
 */
export function animateMaskedReveal(
  target: gsap.DOMTarget,
  options: TextRevealOptions = {}
): gsap.core.Tween | gsap.core.Timeline {
  const {
    delay = 0,
    duration = MOTION_HIERARCHY.medium,
    stagger = 0.08,
    yOffsetPercent = 100,
  } = options;

  if (getPrefersReducedMotion()) {
    return gsap.set(target, { opacity: 1, yPercent: 0 });
  }

  return gsap.fromTo(
    target,
    {
      opacity: 0,
      yPercent: yOffsetPercent,
    },
    {
      opacity: 1,
      yPercent: 0,
      duration,
      stagger,
      delay,
      ease: MOTION_EASES.cinematic,
    }
  );
}
