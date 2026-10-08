"use client";

import React, { useEffect, useRef } from "react";
import { Diamond } from "@/components/ui/Diamond";
import { Hairline } from "@/components/ui/Hairline";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";
import { registerScrollTrigger, gsap } from "@/lib/motion/gsap";

const COMMUNITY_PILLARS = [
  "01 · SYSTEMS RIGOR",
  "02 · ALGORITHMIC CRAFT",
  "03 · OPEN RESEARCH",
  "04 · COLLECTIVE LEARNING",
];

export function OpeningSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const editorialRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const metaRef = useRef<HTMLDivElement | null>(null);
  const pillarsRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Subtle interactive parallax response to cursor movements
  useEffect(() => {
    if (reducedMotion || !containerRef.current || !editorialRef.current) return;
    const isPaused = document.documentElement.getAttribute("data-motion") === "paused";
    if (isPaused) return;

    const setX = gsap.quickTo(editorialRef.current, "x", { duration: 0.8, ease: "power2.out" });
    const setY = gsap.quickTo(editorialRef.current, "y", { duration: 0.8, ease: "power2.out" });

    const handlePointerMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;
      setX(nx * 8);
      setY(ny * 6);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [reducedMotion]);

  useEffect(() => {
    // If reduced motion is requested or motion is paused, ensure hero is immediately fully visible
    if (reducedMotion || (typeof document !== "undefined" && document.documentElement.getAttribute("data-motion") === "paused")) {
      const elements = [metaRef.current, titleRef.current, contentRef.current, pillarsRef.current, containerRef.current];
      elements.forEach((el) => {
        if (el) gsap.set(el, { opacity: 1, clearProps: "opacity,transform" });
      });
      return;
    }

    const ctx = gsap.context(() => {
      let hasRevealed = false;
      let failsafeTimer: NodeJS.Timeout | null = null;

      const playReveal = () => {
        if (hasRevealed) return;
        hasRevealed = true;

        const elements = [metaRef.current, titleRef.current, contentRef.current, pillarsRef.current];

        // Failsafe: guarantee all hero text elements are 100% visible after at most 2.5s
        failsafeTimer = setTimeout(() => {
          elements.forEach((el) => {
            if (el) gsap.set(el, { opacity: 1, clearProps: "opacity,transform" });
          });
        }, 2500);

        // Cinematic editorial entrance
        const tl = gsap.timeline({
          delay: 0.1,
          onComplete: () => {
            if (failsafeTimer) clearTimeout(failsafeTimer);
            elements.forEach((el) => {
              if (el) gsap.set(el, { opacity: 1, clearProps: "opacity,transform" });
            });
          },
        });

        if (metaRef.current) {
          tl.fromTo(
            metaRef.current,
            { opacity: 0, y: -12 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
          );
        }

        if (titleRef.current) {
          tl.fromTo(
            titleRef.current,
            { opacity: 0, y: 28, letterSpacing: "0.04em" },
            {
              opacity: 1,
              y: 0,
              letterSpacing: "-0.03em",
              duration: 1.0,
              ease: "power3.out",
            },
            "-=0.4"
          );
        }

        if (contentRef.current) {
          tl.fromTo(
            contentRef.current,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
            "-=0.5"
          );
        }

        if (pillarsRef.current) {
          tl.fromTo(
            pillarsRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
            "-=0.4"
          );
        }
      };

      // Check whether opening overlay is active
      const isOpeningActive =
        typeof document !== "undefined" &&
        document.documentElement.getAttribute("data-opening") === "1";

      if (isOpeningActive) {
        // Wait until opening experience completes or is dismissed
        const handleOpeningComplete = () => {
          playReveal();
        };

        window.addEventListener("acm:opening-complete", handleOpeningComplete, { once: true });

        // MutationObserver fallback watching for data-opening removal
        const observer = new MutationObserver(() => {
          if (document.documentElement.getAttribute("data-opening") !== "1") {
            observer.disconnect();
            playReveal();
          }
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-opening"] });

        // Maximum wait safety timeout (overlay duration is max 9.0s)
        const openingTimeout = setTimeout(() => {
          observer.disconnect();
          playReveal();
        }, 9500);

        // Store cleanup handles
        return () => {
          window.removeEventListener("acm:opening-complete", handleOpeningComplete);
          observer.disconnect();
          clearTimeout(openingTimeout);
          if (failsafeTimer) clearTimeout(failsafeTimer);
        };
      } else {
        // No opening overlay — reveal immediately on normal page load / refresh
        playReveal();
      }

      // Spatial scroll choreography: Home gently recedes into depth as scroll begins
      const ScrollTrigger = registerScrollTrigger();
      if (ScrollTrigger && containerRef.current) {
        gsap.to(containerRef.current, {
          y: -90,
          scale: 0.94,
          opacity: 0,
          ease: "power1.in",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "15% top",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
            fastScrollEnd: true,
          },
        });

        // Ensure ScrollTrigger coordinates update accurately after fonts, images, and layout settle
        const refreshST = () => {
          ScrollTrigger.refresh();
        };

        if (typeof document !== "undefined" && "fonts" in document) {
          document.fonts.ready.then(refreshST).catch(() => {});
        }

        if (typeof window !== "undefined") {
          if (document.readyState === "complete") {
            requestAnimationFrame(refreshST);
          } else {
            window.addEventListener("load", refreshST, { once: true });
          }
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      id="hero"
      ref={containerRef}
      aria-label="JIT ACM Student Chapter Introduction"
      className="relative w-full min-h-[92svh] sm:min-h-[100svh] flex flex-col justify-between pt-28 sm:pt-32 pb-12 sm:pb-16 px-6 sm:px-10 lg:px-16 text-white overflow-hidden will-change-transform"
    >
      <div className="w-full max-w-[1440px] mx-auto flex flex-col justify-between flex-1 relative">
        {/* Top Meta Line: Chapter Identity */}
        <div
          ref={metaRef}
          className="flex items-center justify-between font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.2em] text-white/50 border-b border-white/[0.14] pb-5"
        >
          <div className="flex items-center gap-3">
            <Diamond size={6} filled={true} />
            <span className="text-white/90">JIT ACM // CHAPTER 01</span>
          </div>
        </div>

        {/* Main Editorial Core with Deep Negative Space and Subtle Parallax */}
        <div 
          ref={editorialRef}
          className="my-auto py-12 sm:py-20 max-w-5xl transition-transform duration-300 ease-out will-change-transform"
        >
          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm uppercase tracking-[0.24em] text-white/60 mb-6">
            <Diamond size={5} filled={false} />
            <span>LIVING COMPUTATIONAL ENVIRONMENT</span>
          </div>

          {/* <h1> JIT ACM </h1> with authoritative editorial typography */}
          <h1
            ref={titleRef}
            aria-label="JIT ACM"
            className="text-6xl sm:text-8xl md:text-9xl lg:text-[140px] font-light tracking-tight text-white leading-[0.9] mb-8 select-none"
            style={{ fontWeight: 300 }}
          >
            JIT ACM
          </h1>

          {/* Authoritative Primary Statement */}
          <div ref={contentRef} className="space-y-4 max-w-4xl">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-light text-white/95 leading-[1.15] tracking-tight uppercase">
              ADVANCING COMPUTING. BUILDING PEOPLE.
            </h2>

            <p className="text-sm sm:text-base font-mono uppercase tracking-[0.16em] text-white/50 max-w-xl">
              An open computational space. Uncompromising engineering craft.
            </p>
          </div>

          {/* Four Architectural Pillar Badges */}
          <div
            ref={pillarsRef}
            className="mt-12 pt-6 border-t border-white/[0.10] flex flex-wrap gap-x-6 gap-y-3 font-mono text-xs uppercase tracking-[0.18em] text-white/50"
          >
            {COMMUNITY_PILLARS.map((pillar) => (
              <div key={pillar} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="hover:text-white transition-colors">{pillar}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Scroll Anchor & Hairline */}
        <div className="pt-6">
          <Hairline orientation="horizontal" className="mb-6" />
          <div className="flex items-center justify-between font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-white/50">
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById("about");
                if (target) {
                  target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
                  target.focus({ preventScroll: true });
                }
              }}
              className="flex items-center gap-2 hover:text-white transition-colors py-2 focus-visible:outline-white group"
            >
              <Diamond size={5} filled={false} />
              <span className="group-hover:translate-y-0.5 transition-transform text-white/80 group-hover:text-white">
                EXPLORE COMMUNITY ↓
              </span>
            </a>
            <div className="flex items-center gap-3 text-white/40">
              <span className="w-2 h-2 rounded-full bg-white/20 animate-pulse" />
              <span className="hidden md:inline-block">NODE KGP / ACTIVE 4 PILLARS 12 INITIATIVES</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
