"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let isRegistered = false;

export function registerScrollTrigger(): typeof ScrollTrigger | null {
  if (typeof window === "undefined") return null;
  if (!isRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    isRegistered = true;
  }
  return ScrollTrigger;
}

export { gsap, ScrollTrigger };
