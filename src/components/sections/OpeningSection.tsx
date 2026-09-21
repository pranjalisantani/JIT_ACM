"use client";

import React, { useEffect, useRef } from "react";
import { Diamond } from "@/components/ui/Diamond";
import { Hairline } from "@/components/ui/Hairline";
import { TwoToneHeading } from "@/components/ui/TwoToneHeading";
import { HERO_STATEMENT, SITE_CONFIG } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";
import { registerScrollTrigger, gsap } from "@/lib/motion/gsap";

export function OpeningSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || !titleRef.current) return;
    const isPaused = document.documentElement.getAttribute("data-motion") === "paused";
    if (isPaused) return;

    // Per-character split animation only for the hero headline
    const chars = titleRef.current.querySelectorAll(".hero-char");
    if (!chars.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.04,
          ease: "power3.out",
          delay: 0.2,
        }
      );

      // Subtle spatial scroll choreography: content gently recedes into depth on scroll
      const ScrollTrigger = registerScrollTrigger();
      if (ScrollTrigger && containerRef.current && contentRef.current) {
        gsap.to(contentRef.current, {
          y: -30,
          opacity: 0.85,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const titleText = SITE_CONFIG.name; // "ACM FACE"

  return (
    <section
      id="hero"
      ref={containerRef}
      aria-label="Chapter Introduction"
      className="relative w-full min-h-[90vh] sm:min-h-[95vh] flex flex-col justify-between pt-32 pb-16 px-6 sm:px-10 lg:px-16 max-w-[1440px] mx-auto text-white overflow-hidden"
    >
      {/* Subtle Corner Architectural Crosshairs */}
      <div
        aria-hidden="true"
        className="absolute top-28 left-6 sm:left-10 lg:left-16 font-mono text-[10px] text-white/20 select-none pointer-events-none"
      >
        + [0,0]
      </div>
      <div
        aria-hidden="true"
        className="absolute top-28 right-6 sm:right-10 lg:right-16 font-mono text-[10px] text-white/20 select-none pointer-events-none"
      >
        + [1440,0]
      </div>

      {/* Top Meta Line: Chapter Identity & System Node */}
      <div className="flex items-center justify-between font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.2em] text-white/50 border-b border-white/[0.14] pb-5">
        <div className="flex items-center gap-3">
          <Diamond size={6} filled={true} />
          <span className="text-white/80">SYS // LIVING COMPUTING COMMUNITY</span>
        </div>
        <div className="flex items-center gap-4 text-white/40">
          <span className="hidden md:inline-block">NODE 01 · ACTIVE</span>
          <span>EST. 2026</span>
        </div>
      </div>

      {/* Main Typographic Core with Deep Negative Space */}
      <div ref={contentRef} className="my-auto py-16 sm:py-24 max-w-5xl will-change-transform">
        <div className="flex items-center gap-2 font-mono text-xs sm:text-sm uppercase tracking-[0.22em] text-white/60 mb-6">
          <Diamond size={5} filled={false} />
          <span>{SITE_CONFIG.tagline}</span>
        </div>

        {/* <h1> ACM FACE </h1> with accessible text and per-character split */}
        <h1
          ref={titleRef}
          aria-label={titleText}
          className="text-6xl sm:text-8xl md:text-9xl lg:text-[132px] font-light tracking-tight text-white leading-none mb-10"
          style={{ fontWeight: 300 }}
        >
          {reducedMotion ? (
            titleText
          ) : (
            titleText.split("").map((char, index) => (
              <span
                key={index}
                className="hero-char inline-block"
                style={{ whiteSpace: char === " " ? "pre" : "normal" }}
              >
                {char}
              </span>
            ))
          )}
        </h1>

        {/* Restrained Two-Tone Statement */}
        <TwoToneHeading
          as="h2"
          line1={HERO_STATEMENT.line1}
          line2={HERO_STATEMENT.line2}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl max-w-4xl leading-[1.25]"
        />
      </div>

      {/* Bottom Scroll Anchor & Hairline */}
      <div className="pt-8">
        <Hairline orientation="horizontal" className="mb-6" />
        <div className="flex items-center justify-between font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-white/50">
          <a
            href={SITE_CONFIG.scrollTarget}
            className="flex items-center gap-2 hover:text-white transition-colors py-2 focus-visible:outline-white group"
          >
            <Diamond size={5} filled={false} />
            <span className="group-hover:translate-y-0.5 transition-transform">
              {HERO_STATEMENT.scrollLabel}
            </span>
          </a>
          <span className="hidden md:inline-block text-white/40">
            {SITE_CONFIG.institutionalLine}
          </span>
        </div>
      </div>
    </section>
  );
}

