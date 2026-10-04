"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { SPONSORS_DATA, Sponsor } from "@/content/sponsors";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";
import { gsap } from "@/lib/motion/gsap";

// Fallback authentic chapter affiliations if data array is empty
const DEFAULT_AFFILIATIONS: Sponsor[] = [
  {
    id: "default-acm",
    name: "Association for Computing Machinery",
    category: "academic",
    logoSrc: "/images/sponsors/acm.svg",
    altText: "Association for Computing Machinery",
    width: 220,
    height: 48,
  },
  {
    id: "default-chapter",
    name: "ACM Student Chapter",
    category: "academic",
    logoSrc: "/images/sponsors/acm-student-chapter.svg",
    altText: "ACM Student Chapter",
    width: 200,
    height: 48,
  },
  {
    id: "default-sigops",
    name: "ACM SIGOPS",
    category: "systems",
    logoSrc: "/images/sponsors/acm-sigops.svg",
    altText: "ACM SIGOPS · Special Interest Group on Operating Systems",
    width: 170,
    height: 48,
  },
  {
    id: "default-sigarch",
    name: "ACM SIGARCH",
    category: "systems",
    logoSrc: "/images/sponsors/acm-sigarch.svg",
    altText: "ACM SIGARCH · Special Interest Group on Computer Architecture",
    width: 170,
    height: 48,
  },
  {
    id: "default-sigplan",
    name: "ACM SIGPLAN",
    category: "systems",
    logoSrc: "/images/sponsors/acm-sigplan.svg",
    altText: "ACM SIGPLAN · Special Interest Group on Programming Languages",
    width: 170,
    height: 48,
  },
  {
    id: "default-dl",
    name: "ACM Digital Library",
    category: "research",
    logoSrc: "/images/sponsors/acm-dl.svg",
    altText: "ACM Digital Library",
    width: 180,
    height: 48,
  },
];

export function SponsorsSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Use authentic SPONSORS_DATA, or fallback to default authentic chapter affiliations
  const sponsors = SPONSORS_DATA.length > 0 ? SPONSORS_DATA : DEFAULT_AFFILIATIONS;

  // Slow continuous seamless horizontal drift with GSAP
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    if (reducedMotion) {
      gsap.set(track, { xPercent: 0 });
      return;
    }

    const isPaused = document.documentElement.getAttribute("data-motion") === "paused";
    if (isPaused) {
      gsap.set(track, { xPercent: 0 });
      return;
    }

    // Continuous, seamless horizontal drift moving leftward
    // Set A and Set B are each 50% of the total track width.
    // Shifting -50% perfectly completes one cycle without visible jump.
    const tween = gsap.to(track, {
      xPercent: -50,
      ease: "none",
      duration: 34, // Slow, restrained, editorial drift
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, [reducedMotion, sponsors.length]);

  return (
    <section
      id="sponsors"
      ref={containerRef}
      aria-label="Sponsors and Ecosystem Affiliations"
      className="relative w-full py-8 sm:py-10 md:py-12 text-white overflow-hidden select-none"
    >
      {/* Structural Hairline Track Frame */}
      <div className="w-full border-y border-white/[0.08] py-5 sm:py-7 relative overflow-hidden">
        {/* Subtle lateral gradient edge fades to feather entry/exit */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 md:w-36 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 md:w-36 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"
        />

        {/* Horizontal Seamless Moving Track */}
        <div
          ref={trackRef}
          className="flex items-center w-max will-change-transform"
        >
          {/* Set 1: Primary Accessible Sequence */}
          <div className="flex items-center gap-12 sm:gap-20 md:gap-28 pr-12 sm:pr-20 md:pr-28 shrink-0">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="relative flex items-center justify-center shrink-0 opacity-70 hover:opacity-100 transition-opacity duration-300"
              >
                <div className="relative h-7 sm:h-8 md:h-9 w-auto max-w-[180px] sm:max-w-[220px] md:max-w-[260px] flex items-center">
                  {sponsor.logoSrc ? (
                    <Image
                      src={sponsor.logoSrc}
                      alt={sponsor.altText || sponsor.name}
                      width={sponsor.width || 180}
                      height={sponsor.height || 48}
                      unoptimized
                      className="h-7 sm:h-8 md:h-9 w-auto object-contain brightness-100"
                    />
                  ) : (
                    <span className="font-mono text-xs sm:text-sm tracking-[0.2em] text-white/80 uppercase">
                      {sponsor.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Set 2: Duplicate Clone for Seamless Loop (aria-hidden for screen-reader hygiene) */}
          <div
            aria-hidden="true"
            className="flex items-center gap-12 sm:gap-20 md:gap-28 pr-12 sm:pr-20 md:pr-28 shrink-0 select-none pointer-events-none"
          >
            {sponsors.map((sponsor, idx) => (
              <div
                key={`clone-${sponsor.id}-${idx}`}
                className="relative flex items-center justify-center shrink-0 opacity-70 transition-opacity duration-300"
              >
                <div className="relative h-7 sm:h-8 md:h-9 w-auto max-w-[180px] sm:max-w-[220px] md:max-w-[260px] flex items-center">
                  {sponsor.logoSrc ? (
                    <Image
                      src={sponsor.logoSrc}
                      alt=""
                      width={sponsor.width || 180}
                      height={sponsor.height || 48}
                      unoptimized
                      className="h-7 sm:h-8 md:h-9 w-auto object-contain brightness-100"
                    />
                  ) : (
                    <span className="font-mono text-xs sm:text-sm tracking-[0.2em] text-white/80 uppercase">
                      {sponsor.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
