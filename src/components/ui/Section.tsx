"use client";

import React, { useEffect, useRef } from "react";
import { Diamond } from "./Diamond";
import { Hairline } from "./Hairline";
import { registerScrollTrigger, gsap } from "@/lib/motion/gsap";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";

interface SectionProps {
  id: string;
  index: string; // e.g. "01"
  label: string; // e.g. "ABOUT"
  title?: string;
  children: React.ReactNode;
  className?: string;
  noDivider?: boolean;
  disableWrapperMotion?: boolean;
}

export function Section({
  id,
  index,
  label,
  title,
  children,
  className = "",
  noDivider = false,
  disableWrapperMotion = false,
}: SectionProps) {
  const headingId = `${id}-heading`;
  const sectionRef = useRef<HTMLElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || disableWrapperMotion) return;
    const isPaused = document.documentElement.getAttribute("data-motion") === "paused";
    if (isPaused) return;

    const ScrollTrigger = registerScrollTrigger();
    if (!ScrollTrigger || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Chapter Hairline Divider: draws out gracefully from center
      if (dividerRef.current) {
        gsap.fromTo(
          dividerRef.current,
          { scaleX: 0.1, opacity: 0 },
          {
            scaleX: 1,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 95%",
              end: "top 65%",
              scrub: 0.5,
            },
          }
        );
      }

      // 2. Section Header: locks into focus with scroll
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { y: 20, opacity: 0.2 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 90%",
              end: "top 55%",
              scrub: 0.5,
            },
          }
        );
      }

      // 3. Section Content: spatial entrance and graceful departure into depth
      if (contentRef.current) {
        // Entrance: expands subtly from depth
        gsap.fromTo(
          contentRef.current,
          { opacity: 0.4, scale: 0.98, y: 24 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              end: "top 35%",
              scrub: 0.6,
            },
          }
        );

        // Departure: recedes into depth as scroll progresses past the section
        gsap.to(contentRef.current, {
          opacity: 0.45,
          scale: 0.97,
          y: -24,
          ease: "power1.in",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "bottom 40%",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion, disableWrapperMotion]);

  return (
    <section
      id={id}
      ref={sectionRef}
      aria-labelledby={headingId}
      className={`relative w-full text-white bg-black ${className}`}
      style={{
        paddingTop: "clamp(96px, 14vw, 200px)",
        paddingBottom: "clamp(96px, 14vw, 200px)",
      }}
    >
      {!noDivider && (
        <div
          ref={dividerRef}
          className="absolute top-0 inset-x-0 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 origin-center will-change-transform"
        >
          <Hairline orientation="horizontal" />
          <div
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 -top-1.5 flex flex-col items-center select-none pointer-events-none"
          >
            <Diamond size={5} filled={false} />
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Index Header */}
        <header ref={headerRef} className="flex items-center gap-3 mb-10 sm:mb-16 will-change-transform">
          <Diamond size={6} filled={true} />
          <span
            id={headingId}
            className="font-mono text-[11px] sm:text-[12px] uppercase font-medium tracking-[0.2em] text-white/50"
          >
            {index} · {label}
          </span>
          {title && <span className="sr-only">— {title}</span>}
        </header>

        {/* Section Content */}
        <div ref={contentRef} className="w-full will-change-transform">
          {children}
        </div>
      </div>
    </section>
  );
}
