"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Diamond } from "@/components/ui/Diamond";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { PROJECTS_DATA, FALLBACK_PLACEHOLDER_PROJECTS } from "@/content/projects";
import { registerScrollTrigger, gsap } from "@/lib/motion/gsap";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";
import { ProjectItem } from "@/types";

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const laptopRef = useRef<SVGSVGElement | null>(null);
  const cardsRef = useRef<(HTMLLIElement | null)[]>([]);

  const reducedMotion = usePrefersReducedMotion();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const projectsToRender: ProjectItem[] =
    PROJECTS_DATA.length > 0 ? PROJECTS_DATA : FALLBACK_PLACEHOLDER_PROJECTS;

  useEffect(() => {
    const checkMobile = () => {
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const isNarrow = window.innerWidth < 768;
      setIsMobile(isCoarse || isNarrow);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const isPaused = document.documentElement.getAttribute("data-motion") === "paused";
    if (reducedMotion || isMobile || isPaused) return;

    const ScrollTrigger = registerScrollTrigger();
    if (!ScrollTrigger) return;

    const stageEl = stageRef.current;
    const sectionEl = sectionRef.current;
    if (!stageEl || !sectionEl) return;

    // Settled offsets and slight perspective rotations (<= 8 deg)
    const settledTransforms = [
      { x: -280, y: -160, rot: -3 },
      { x: 280, y: -140, rot: 2 },
      { x: -290, y: 160, rot: 2 },
      { x: 290, y: 180, rot: -2 },
    ];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: "+=120%", // Pin length ~1.2x viewport height
          pin: stageEl,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      // Phase 1: Laptop Screen Illuminates
      if (laptopRef.current) {
        tl.fromTo(
          laptopRef.current,
          { scale: 0.92, opacity: 0.6 },
          { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" },
          0
        );
      }

      // Phase 2 & 3: Project cards emerge from screen center and settle
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        const target = settledTransforms[idx % settledTransforms.length];

        // 0% -> 30%: inside laptop screen (scale 0.2, hidden)
        // 30% -> 70%: emerging outward along computed 3D vectors
        // 70% -> 100%: fully settled in balanced quadrant layout
        tl.fromTo(
          card,
          {
            x: 0,
            y: -10,
            scale: 0.22,
            opacity: 0,
            rotate: 0,
          },
          {
            x: target.x * 0.45,
            y: target.y * 0.45,
            scale: 0.65,
            opacity: 0.75,
            rotate: target.rot * 0.5,
            duration: 0.4,
            ease: "power2.inOut",
          },
          0.30
        ).to(
          card,
          {
            x: target.x,
            y: target.y,
            scale: 1,
            opacity: 1,
            rotate: target.rot,
            duration: 0.3,
            ease: "power3.out",
          },
          0.70
        );
      });
    }, sectionEl);

    return () => {
      ctx.revert(); // Completely cleans up tweens and ScrollTriggers
    };
  }, [reducedMotion, isMobile]);

  const renderCardContent = (project: ProjectItem) => (
    <article className="w-full h-full p-6 bg-black border border-white/20 hover:border-white transition-colors flex flex-col justify-between group shadow-xl">
      <div>
        <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-white/50 mb-3">
          <div className="flex items-center gap-2">
            <Diamond size={5} filled={true} />
            <span>ARTIFACT</span>
          </div>
          {project.placeholder && <span>[PLACEHOLDER]</span>}
        </div>

        <h3 className="text-xl sm:text-2xl font-light tracking-tight text-white group-hover:text-white transition-colors">
          {project.title}
        </h3>

        <p className="mt-3 text-xs sm:text-sm text-white/60 font-light leading-relaxed line-clamp-3">
          {project.summary}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-white/[0.14] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {project.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] px-2 py-0.5 bg-neutral-900 border border-white/10 text-white/70"
            >
              {tag}
            </span>
          ))}
        </div>
        <Magnetic maxOffset={4}>
          <span className="font-mono text-xs uppercase tracking-wider text-white/80 group-hover:text-white inline-flex items-center gap-1 border border-white/20 px-2.5 py-1 hover:border-white transition-colors">
            VIEW →
          </span>
        </Magnetic>
      </div>
    </article>
  );

  return (
    <Section id="projects" index="04" label="PROJECTS" title="Research Initiatives & Artifacts">
      {/* Header Description */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 max-w-md">
            Open-source systems, algorithmic engines, and spatial computing prototypes developed by chapter fellows.
          </p>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            {projectsToRender.length} ACTIVE INITIATIVES
          </span>
        </div>
      </Reveal>

      {/* MOBILE / REDUCED MOTION VIEW: Vertical stack with Reveal */}
      {(isMobile || reducedMotion) ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 list-none p-0 m-0">
          {projectsToRender.map((project, idx) => (
            <li key={project.slug}>
              <Reveal delay={idx * 80}>
                <Link
                  href={`/projects/${project.slug}`}
                  className="block focus-visible:outline-white"
                >
                  {renderCardContent(project)}
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      ) : (
        /* DESKTOP VIEW: Pinned Scroll-Scrub Stage with Static Wireframe Laptop */
        <div
          ref={stageRef}
          className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-12"
          style={{ perspective: "1000px" }}
        >
          {/* Static Inline SVG Wireframe Laptop (Hairlines only, no 3D model) */}
          <svg
            ref={laptopRef}
            viewBox="0 0 500 320"
            className="w-[420px] lg:w-[500px] h-auto select-none pointer-events-none"
            aria-hidden="true"
          >
            {/* Screen Lid & Bezel */}
            <rect
              x="70" y="20" width="360" height="230" rx="6"
              fill="#050505" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.3"
            />
            {/* Active Display Screen (Inner Rect) */}
            <rect
              x="85" y="35" width="330" height="200" rx="3"
              fill="#000000" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.2"
            />
            {/* Minimal Header inside Laptop Display */}
            <line x1="85" y1="55" x2="415" y2="55" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.2" />
            <text x="100" y="49" fill="#ffffff" fillOpacity="0.4" fontSize="8" fontFamily="monospace" letterSpacing="0.2em">
              ACM FACE WORKSPACE
            </text>

            {/* Laptop Base / Keyboard Hinge */}
            <polygon
              points="40,265 460,265 430,250 70,250"
              fill="#0a0a0a" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.3"
            />
            {/* Trackpad Hairline */}
            <rect
              x="210" y="254" width="80" height="9" rx="1"
              fill="#050505" stroke="#ffffff" strokeWidth="0.6" strokeOpacity="0.25"
            />
          </svg>

          {/* Real DOM Cards floating & settling outward */}
          <ul className="absolute inset-0 pointer-events-none flex items-center justify-center list-none p-0 m-0">
            {projectsToRender.map((project, idx) => (
              <li
                key={project.slug}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                className="absolute pointer-events-auto w-[280px] lg:w-[320px] h-[220px]"
                style={{
                  willChange: "transform, opacity",
                }}
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="block h-full focus-visible:outline-white"
                >
                  {renderCardContent(project)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
}
