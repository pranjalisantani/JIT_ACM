"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Diamond } from "@/components/ui/Diamond";
import { Hairline } from "@/components/ui/Hairline";
import { TwoToneHeading } from "@/components/ui/TwoToneHeading";
import { HERO_STATEMENT, SITE_CONFIG } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";

export function OpeningSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
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
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const titleText = SITE_CONFIG.name; // "ACM FACE"

  return (
    <section
      id="hero"
      ref={containerRef}
      aria-label="Chapter Introduction"
      className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-between pt-32 pb-16 px-6 sm:px-10 lg:px-16 max-w-[1440px] mx-auto text-white"
    >
      {/* Top Meta Line */}
      <div className="flex items-center justify-between font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.2em] text-white/50 border-b border-white/[0.14] pb-5">
        <div className="flex items-center gap-2">
          <Diamond size={6} filled={true} />
          <span>CHAPTER HERO</span>
        </div>
        <span className="hidden sm:inline-block">EST. 2026</span>
      </div>

      {/* Main Typographic Core */}
      <div className="my-auto py-12 sm:py-20 max-w-5xl">
        <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-white/60 mb-6">
          {SITE_CONFIG.tagline}
        </p>

        {/* <h1> ACM FACE </h1> with accessible text and optional per-character split */}
        <h1
          ref={titleRef}
          aria-label={titleText}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight text-white leading-none mb-10"
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
          className="text-2xl sm:text-3xl md:text-4xl max-w-3xl leading-snug"
        />
      </div>

      {/* Bottom Scroll Anchor & Hairline */}
      <div className="pt-6">
        <Hairline orientation="horizontal" className="mb-6" />
        <div className="flex items-center justify-between font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-white/50">
          <a
            href={SITE_CONFIG.scrollTarget}
            className="flex items-center gap-2 hover:text-white transition-colors py-2 focus-visible:outline-white"
          >
            <Diamond size={5} filled={false} />
            <span>{HERO_STATEMENT.scrollLabel}</span>
          </a>
          <span className="hidden md:inline-block">
            {SITE_CONFIG.institutionalLine}
          </span>
        </div>
      </div>
    </section>
  );
}
