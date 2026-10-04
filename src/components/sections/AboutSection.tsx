"use client";

import React, { useState, useEffect, useRef } from "react";
import { Diamond } from "@/components/ui/Diamond";
import { registerScrollTrigger, gsap } from "@/lib/motion/gsap";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";

type PillarKey = "people" | "events" | "projects" | "learning";

interface PillarInfo {
  key: PillarKey;
  num: string;
  title: string;
  tagline: string;
  description: string;
  stats: string;
  linkText: string;
  href: string;
}

const PILLARS: PillarInfo[] = [
  {
    key: "people",
    num: "01",
    title: "People",
    tagline: "The Fellowship of Builders",
    description:
      "A collective of students, researchers, and engineers united by computational curiosity. Bridging academic rigor and raw engineering craft.",
    stats: "6 STEWARDS · 80+ ACTIVE MEMBERS",
    linkText: "MEET FELLOWSHIP",
    href: "#team",
  },
  {
    key: "events",
    num: "02",
    title: "Events",
    tagline: "Convenings & Colloquia",
    description:
      "Weekly colloquia, paper reading sessions, and continuous 48-hour build sprints exploring machine frontiers and distributed networks.",
    stats: "5 CALENDAR FORUMS · 2 SPRINT HACKATHONS",
    linkText: "EXPLORE CALENDAR",
    href: "#events",
  },
  {
    key: "projects",
    num: "03",
    title: "Projects",
    tagline: "Research Initiatives & Systems",
    description:
      "Production software built for real infrastructure: open-source kernel telemetry, distributed consensus engines, and algorithmic tools.",
    stats: "4 CORE INITIATIVES · OPEN SOURCE",
    linkText: "INSPECT INITIATIVES",
    href: "#projects",
  },
  {
    key: "learning",
    num: "04",
    title: "Learning",
    tagline: "The Continuous Laboratory",
    description:
      "Peer-to-peer technical mentorship and foundational reading. Exploring memory hierarchies, complexity theory, and hardware limits.",
    stats: "WEEKLY READING GROUP · MENTORSHIP",
    linkText: "CHAPTER CURRICULUM",
    href: "#gallery",
  },
];

function dispatchFieldFocus(region: PillarKey | null) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("acm:field-focus", { detail: { region } })
    );
  }
}

export function AboutSection() {
  const reducedMotion = usePrefersReducedMotion();

  // Primary pinned scroll stage
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinnedStageRef = useRef<HTMLDivElement | null>(null);

  // Statement 1 Refs (Intellectual Thesis)
  const act1Ref = useRef<HTMLDivElement | null>(null);
  const act1Line1Ref = useRef<HTMLDivElement | null>(null);
  const act1Line2Ref = useRef<HTMLDivElement | null>(null);
  const act1Line3Ref = useRef<HTMLDivElement | null>(null);
  const act1TagRef = useRef<HTMLDivElement | null>(null);
  const act1SubRef = useRef<HTMLDivElement | null>(null);

  // Statement 2 Refs (Paradigm Shift)
  const act2Ref = useRef<HTMLDivElement | null>(null);
  const act2Line1Ref = useRef<HTMLDivElement | null>(null);
  const act2Line2Ref = useRef<HTMLDivElement | null>(null);
  const act2Line3Ref = useRef<HTMLDivElement | null>(null);
  const act2TagRef = useRef<HTMLDivElement | null>(null);
  const act2SubRef = useRef<HTMLDivElement | null>(null);

  // Statement 3 Refs (Systems Rigor)
  const act3Ref = useRef<HTMLDivElement | null>(null);
  const act3Line1Ref = useRef<HTMLDivElement | null>(null);
  const act3Line2Ref = useRef<HTMLDivElement | null>(null);
  const act3Line3Ref = useRef<HTMLDivElement | null>(null);
  const act3TagRef = useRef<HTMLDivElement | null>(null);
  const act3FootRef = useRef<HTMLDivElement | null>(null);

  // Factual Pillar Block Refs
  const act4Ref = useRef<HTMLDivElement | null>(null);

  // HUD and Tracker Refs
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressPercentRef = useRef<HTMLSpanElement | null>(null);
  const activeChapterPillRef = useRef<HTMLSpanElement | null>(null);

  const activeRegionRef = useRef<PillarKey | null>(null);
  const [activeStaticPillar, setActiveStaticPillar] = useState<PillarKey | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const isPaused = document.documentElement.getAttribute("data-motion") === "paused";
    if (isPaused) return;

    const ScrollTrigger = registerScrollTrigger();
    if (!ScrollTrigger || !sectionRef.current || !pinnedStageRef.current) return;

    const ctx = gsap.context(() => {
      // Primary Master Pinned Timeline
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=320%",
          pin: pinnedStageRef.current,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;

            // HUD Progress Meter updates
            if (progressBarRef.current) {
              progressBarRef.current.style.transform = `scaleX(${p})`;
            }
            if (progressPercentRef.current) {
              progressPercentRef.current.textContent = `${String(Math.round(p * 100)).padStart(2, "0")}%`;
            }
            if (activeChapterPillRef.current) {
              if (p < 0.25) activeChapterPillRef.current.textContent = "01 // THESIS";
              else if (p < 0.51) activeChapterPillRef.current.textContent = "02 // PARADIGM";
              else if (p < 0.77) activeChapterPillRef.current.textContent = "03 // CRAFT";
              else activeChapterPillRef.current.textContent = "04 // PILLARS";
            }

            // Subordinate ParticleField focus
            let targetRegion: PillarKey | null = null;
            if (p >= 0.78) targetRegion = "learning";
            else if (p >= 0.52) targetRegion = "projects";
            else if (p >= 0.26) targetRegion = "people";

            if (targetRegion !== activeRegionRef.current) {
              activeRegionRef.current = targetRegion;
              dispatchFieldFocus(targetRegion);
            }
          },
        },
      });

      // ─────────────────────────────────────────────────────────
      // INITIAL DISPLAY STATES
      // ─────────────────────────────────────────────────────────
      gsap.set(
        [
          act1Ref.current,
          act2Ref.current,
          act3Ref.current,
          act4Ref.current,
        ],
        { opacity: 0, pointerEvents: "none" }
      );
      gsap.set(
        [
          act1Line1Ref.current,
          act1Line2Ref.current,
          act1Line3Ref.current,
          act1TagRef.current,
          act1SubRef.current,
          act2Line1Ref.current,
          act2Line2Ref.current,
          act2Line3Ref.current,
          act2TagRef.current,
          act2SubRef.current,
          act3Line1Ref.current,
          act3Line2Ref.current,
          act3Line3Ref.current,
          act3TagRef.current,
          act3FootRef.current,
        ],
        { opacity: 0 }
      );

      // ─────────────────────────────────────────────────────────
      // MOMENT 1: THE INTELLECTUAL THESIS (0.00 -> 0.24)
      // "Computation as an Intellectual Discipline, & a living creative medium."
      // ─────────────────────────────────────────────────────────
      masterTl
        .to(act1Ref.current, { opacity: 1, pointerEvents: "auto", duration: 0.04, ease: "power2.out" }, 0.0)
        .fromTo(
          act1Line1Ref.current,
          { opacity: 0, xPercent: -12, letterSpacing: "0.04em" },
          { opacity: 1, xPercent: 0, letterSpacing: "0.01em", duration: 0.10, ease: "power2.out" },
          0.01
        )
        .fromTo(
          act1Line2Ref.current,
          { opacity: 0, yPercent: 25, scale: 0.94 },
          { opacity: 1, yPercent: 0, scale: 1.0, duration: 0.12, ease: "power3.out" },
          0.03
        )
        .fromTo(
          act1Line3Ref.current,
          { opacity: 0, xPercent: 12 },
          { opacity: 1, xPercent: 0, duration: 0.10, ease: "power2.out" },
          0.05
        )
        .fromTo(
          act1TagRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" },
          0.05
        )
        .fromTo(
          act1SubRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" },
          0.06
        )
        // Hold & Smooth Departure
        .to(
          act1Line1Ref.current,
          { xPercent: -18, opacity: 0, duration: 0.06, ease: "power2.in" },
          0.17
        )
        .to(
          act1Line2Ref.current,
          { scale: 1.06, yPercent: -20, opacity: 0, duration: 0.06, ease: "power2.in" },
          0.18
        )
        .to(
          act1Line3Ref.current,
          { xPercent: 18, opacity: 0, duration: 0.06, ease: "power2.in" },
          0.17
        )
        .to(
          [act1TagRef.current, act1SubRef.current],
          { opacity: 0, y: -14, duration: 0.05, ease: "power2.in" },
          0.18
        )
        .to(act1Ref.current, { opacity: 0, pointerEvents: "none", duration: 0.02 }, 0.24);

      // ─────────────────────────────────────────────────────────
      // MOMENT 2: THE PARADIGM SHIFT (0.26 -> 0.50)
      // "From passive consumers of software → Active Architects of systems."
      // ─────────────────────────────────────────────────────────
      masterTl
        .to(act2Ref.current, { opacity: 1, pointerEvents: "auto", duration: 0.04, ease: "power2.out" }, 0.26)
        .fromTo(
          act2Line1Ref.current,
          { opacity: 0, xPercent: 16 },
          { opacity: 1, xPercent: 0, duration: 0.10, ease: "power2.out" },
          0.26
        )
        .fromTo(
          act2Line2Ref.current,
          { opacity: 0, scale: 0.90, yPercent: 20 },
          { opacity: 1, scale: 1.0, yPercent: 0, duration: 0.12, ease: "power3.out" },
          0.28
        )
        .fromTo(
          act2Line3Ref.current,
          { opacity: 0, yPercent: 20 },
          { opacity: 1, yPercent: 0, duration: 0.10, ease: "power2.out" },
          0.30
        )
        .fromTo(
          act2TagRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" },
          0.30
        )
        .fromTo(
          act2SubRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" },
          0.31
        )
        // Hold & Smooth Departure
        .to(
          act2Line1Ref.current,
          { xPercent: -16, opacity: 0, duration: 0.06, ease: "power2.in" },
          0.43
        )
        .to(
          act2Line2Ref.current,
          { scale: 1.06, yPercent: -20, opacity: 0, duration: 0.06, ease: "power2.in" },
          0.44
        )
        .to(
          act2Line3Ref.current,
          { yPercent: -20, opacity: 0, duration: 0.06, ease: "power2.in" },
          0.44
        )
        .to(
          [act2TagRef.current, act2SubRef.current],
          { opacity: 0, y: -14, duration: 0.05, ease: "power2.in" },
          0.44
        )
        .to(act2Ref.current, { opacity: 0, pointerEvents: "none", duration: 0.02 }, 0.50);

      // ─────────────────────────────────────────────────────────
      // MOMENT 3: THE CRAFT & SCALE (0.52 -> 0.76)
      // "Uncompromising Engineering Craft. Grounded in Rigor. Built to Scale."
      // ─────────────────────────────────────────────────────────
      masterTl
        .to(act3Ref.current, { opacity: 1, pointerEvents: "auto", duration: 0.04, ease: "power2.out" }, 0.52)
        .fromTo(
          act3Line1Ref.current,
          { opacity: 0, yPercent: -16 },
          { opacity: 1, yPercent: 0, duration: 0.09, ease: "power2.out" },
          0.53
        )
        .fromTo(
          act3Line2Ref.current,
          { opacity: 0, scale: 0.92, yPercent: 18 },
          { opacity: 1, scale: 1.0, yPercent: 0, duration: 0.11, ease: "power3.out" },
          0.55
        )
        .fromTo(
          act3Line3Ref.current,
          { opacity: 0, xPercent: 14 },
          { opacity: 1, xPercent: 0, duration: 0.10, ease: "power2.out" },
          0.57
        )
        .fromTo(
          act3TagRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" },
          0.57
        )
        .fromTo(
          act3FootRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.08, ease: "power2.out" },
          0.58
        )
        // Hold & Smooth Departure
        .to(
          act3Line1Ref.current,
          { yPercent: -18, opacity: 0, duration: 0.06, ease: "power2.in" },
          0.69
        )
        .to(
          act3Line2Ref.current,
          { scale: 1.05, yPercent: -20, opacity: 0, duration: 0.06, ease: "power2.in" },
          0.70
        )
        .to(
          act3Line3Ref.current,
          { xPercent: -16, opacity: 0, duration: 0.06, ease: "power2.in" },
          0.70
        )
        .to(
          [act3TagRef.current, act3FootRef.current],
          { opacity: 0, y: -14, duration: 0.05, ease: "power2.in" },
          0.70
        )
        .to(act3Ref.current, { opacity: 0, pointerEvents: "none", duration: 0.02 }, 0.76);

      // ─────────────────────────────────────────────────────────
      // MOMENT 4: COMPACT FACTUAL ABOUT INFORMATION (0.78 -> 1.00)
      // Readable, useful, quieter factual block presenting the Four Pillars
      // ─────────────────────────────────────────────────────────
      masterTl
        .to(act4Ref.current, { opacity: 1, pointerEvents: "auto", duration: 0.05, ease: "power2.out" }, 0.78)
        .fromTo(
          act4Ref.current,
          { yPercent: 10, scale: 0.97 },
          { yPercent: 0, scale: 1.0, duration: 0.09, ease: "power3.out" },
          0.79
        )
        // Holds firmly through conclusion
        .to(
          act4Ref.current,
          { opacity: 0.90, yPercent: -4, duration: 0.07, ease: "power1.in" },
          0.94
        );
    }, sectionRef);

    return () => {
      ctx.revert();
      dispatchFieldFocus(null);
    };
  }, [reducedMotion]);

  // Reduced motion accessible fallback
  if (reducedMotion) {
    return (
      <section
        id="about"
        aria-label="03 / About: Perspective and Community Structure"
        className="relative w-full text-white bg-transparent py-20 px-6 sm:px-10 lg:px-16"
      >
        <div className="max-w-[1440px] mx-auto">
          {/* Header */}
          <div className="pb-8 border-b border-white/[0.12] mb-12">
            <div className="font-mono text-xs uppercase tracking-[0.24em] text-sky-300/70 mb-3 flex items-center gap-2">
              <Diamond size={5} filled={true} />
              <span>03 / ABOUT // PERSPECTIVE & DISCIPLINE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight uppercase leading-tight">
              Computation as an Intellectual Discipline,
              <span className="block text-sky-200/90 font-normal">
                and a living creative medium.
              </span>
            </h2>
          </div>

          {/* Factual Core Block */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map((pillar) => (
              <article
                key={pillar.key}
                className="p-6 border border-white/[0.10] bg-neutral-950/40 flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono text-xs text-sky-400/80 mb-2">
                    PILLAR [{pillar.num}]
                  </div>
                  <h3 className="text-2xl font-light text-white mb-2">
                    {pillar.title}
                  </h3>
                  <div className="font-mono text-[11px] uppercase tracking-wider text-white/50 mb-4">
                    {pillar.tagline}
                  </div>
                  <p className="text-sm text-white/70 font-light leading-relaxed mb-6">
                    {pillar.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between font-mono text-[10px] text-white/50">
                  <span>{pillar.stats}</span>
                  <a
                    href={pillar.href}
                    className="text-sky-300 hover:text-white transition-colors"
                  >
                    {pillar.linkText} →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="03 / About: Perspective and Community Structure"
      className="relative w-full text-white bg-transparent select-none"
    >
      {/* Scroll-Driven Pinned Viewport Stage */}
      <div
        ref={pinnedStageRef}
        className="w-full h-screen relative flex flex-col justify-between px-6 sm:px-10 lg:px-16 py-8 sm:py-10 overflow-hidden pointer-events-auto"
      >
        {/* Top Architectural HUD */}
        <header className="relative z-20 flex items-center justify-between border-b border-white/[0.10] pb-4 max-w-[1440px] w-full mx-auto">
          <div className="flex items-center gap-3">
            <Diamond size={5} filled={true} className="text-sky-400/80" />
            <span className="font-mono text-[11px] sm:text-[12px] uppercase font-medium tracking-[0.22em] text-white/75">
              03 · ABOUT // PERSPECTIVE & DISCIPLINE
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span
              ref={activeChapterPillRef}
              className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] px-2.5 py-1 border border-white/15 bg-black/50 text-sky-200/90"
            >
              01 // THESIS
            </span>
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/40">
              KGP.NODE · EST. 2026
            </span>
          </div>
        </header>

        {/* Center Stage: The Typographic Moments */}
        <div className="relative z-10 flex-1 w-full max-w-[1440px] mx-auto flex items-center justify-center my-auto">
          {/* ─────────────────────────────────────────────────────────────
              MOMENT 1: THE INTELLECTUAL THESIS
          ───────────────────────────────────────────────────────────── */}
          <div
            ref={act1Ref}
            aria-hidden="false"
            className="absolute inset-0 flex flex-col justify-center items-start text-left max-w-5xl"
          >
            <div
              ref={act1TagRef}
              className="font-mono text-xs uppercase tracking-[0.24em] text-sky-300/70 mb-6 flex items-center gap-2"
            >
              <Diamond size={4} filled={true} className="text-sky-400" />
              <span>CHAPTER THESIS // THE CRAFT</span>
            </div>

            <div
              ref={act1Line1Ref}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white/50 tracking-tight uppercase leading-[1.05]"
            >
              Computation as an
            </div>

            <div
              ref={act1Line2Ref}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white tracking-tighter uppercase leading-[1.02] my-2 sm:my-3"
            >
              Intellectual Discipline,
            </div>

            <div
              ref={act1Line3Ref}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-sky-200/80 italic tracking-tight leading-[1.1]"
            >
              & a living creative medium.
            </div>

            <div ref={act1SubRef} className="mt-8 pt-4 border-t border-white/[0.12] max-w-xl">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/45">
                NOT PASSIVE CODE. UNCOMPROMISING INTELLECTUAL CRAFT.
              </p>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              MOMENT 2: THE PARADIGM SHIFT
          ───────────────────────────────────────────────────────────── */}
          <div
            ref={act2Ref}
            aria-hidden="true"
            className="absolute inset-0 flex flex-col justify-center items-center text-center max-w-5xl mx-auto"
          >
            <div
              ref={act2TagRef}
              className="font-mono text-xs uppercase tracking-[0.24em] text-sky-300/70 mb-6 flex items-center gap-2"
            >
              <Diamond size={4} filled={true} className="text-sky-400" />
              <span>CORE ETHOS // THE PARADIGM SHIFT</span>
            </div>

            <div
              ref={act2Line1Ref}
              className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-light text-white/45 tracking-tight uppercase mb-2 sm:mb-4"
            >
              From passive consumers of software
            </div>

            <div className="flex items-center gap-4 my-1 sm:my-2">
              <span className="font-mono text-xs sm:text-sm text-sky-400/50 tracking-[0.3em] uppercase">
                [ EVOLUTION ]
              </span>
              <span className="text-sky-300/70 font-light text-lg">→</span>
            </div>

            <div
              ref={act2Line2Ref}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white tracking-tighter uppercase leading-none"
            >
              Active Architects
            </div>

            <div
              ref={act2Line3Ref}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-sky-200/85 tracking-tight mt-3 sm:mt-4"
            >
              of the computational universe.
            </div>

            <div
              ref={act2SubRef}
              className="mt-10 flex flex-wrap justify-center items-center gap-3 sm:gap-6 font-mono text-[11px] sm:text-xs uppercase tracking-[0.22em] text-white/45"
            >
              <span>SYSTEMS RIGOR</span>
              <span>·</span>
              <span>ALGORITHMIC CRAFT</span>
              <span>·</span>
              <span>OPEN INQUIRY</span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              MOMENT 3: THE CRAFT & SCALE
          ───────────────────────────────────────────────────────────── */}
          <div
            ref={act3Ref}
            aria-hidden="true"
            className="absolute inset-0 flex flex-col justify-center items-start text-left max-w-5xl mx-auto"
          >
            <div
              ref={act3TagRef}
              className="font-mono text-xs uppercase tracking-[0.24em] text-sky-300/70 mb-6 flex items-center gap-2"
            >
              <Diamond size={4} filled={true} className="text-sky-400" />
              <span>OPERATIONAL POSTURE // ARCHITECTURE</span>
            </div>

            <div
              ref={act3Line1Ref}
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white/50 tracking-tight uppercase mb-2 leading-none"
            >
              Uncompromising
            </div>

            <div
              ref={act3Line2Ref}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-white tracking-tighter uppercase leading-none"
            >
              Engineering Craft.
            </div>

            <div
              ref={act3Line3Ref}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-sky-200/85 tracking-tight uppercase mt-3 leading-none"
            >
              Grounded in Rigor. Built to Scale.
            </div>

            <div
              ref={act3FootRef}
              className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/45"
            >
              <span className="px-3 py-1.5 border border-white/10 bg-white/[0.03]">
                BARE METAL TO DISTRIBUTED SYSTEMS
              </span>
              <span className="text-sky-400/60">EST. 2026</span>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              MOMENT 4: COMPACT FACTUAL ABOUT INFORMATION
              Readable, compact, factual block showcasing Four Pillars
          ───────────────────────────────────────────────────────────── */}
          <div
            ref={act4Ref}
            aria-hidden="true"
            className="absolute inset-0 flex flex-col justify-center items-center w-full"
          >
            <div className="w-full max-w-5xl">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.12] mb-6">
                <div>
                  <div className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-sky-300/70 mb-1 flex items-center gap-2">
                    <Diamond size={4} filled={true} />
                    <span>03 / FACTUAL ARCHITECTURE // THE FOUR PILLARS</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-light text-white uppercase tracking-tight">
                    Chapter Structure & Initiatives
                  </h3>
                </div>
                <div className="hidden sm:block font-mono text-[10px] text-white/40 uppercase tracking-widest text-right">
                  <span>ACM STUDENT CHAPTER</span>
                  <span className="block text-sky-400/50">4 ACTIVE INITIATIVES</span>
                </div>
              </div>

              {/* 4 Pillars Compact Factual Grid (2x2 on Mobile, 4x1 on Desktop) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                {PILLARS.map((pillar) => (
                  <article
                    key={pillar.key}
                    onMouseEnter={() => {
                      setActiveStaticPillar(pillar.key);
                      dispatchFieldFocus(pillar.key);
                    }}
                    onMouseLeave={() => {
                      setActiveStaticPillar(null);
                      dispatchFieldFocus(null);
                    }}
                    className={`p-3 sm:p-5 border transition-all duration-300 flex flex-col justify-between backdrop-blur-md ${
                      activeStaticPillar === pillar.key
                        ? "border-sky-400/60 bg-sky-950/40 shadow-lg shadow-sky-950/20"
                        : "border-white/[0.12] bg-neutral-950/85 hover:border-white/25"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-sky-400/70 mb-1 sm:mb-2">
                        <span>PILLAR [{pillar.num}]</span>
                        <span className="text-white/30 hidden sm:inline">{pillar.key}</span>
                      </div>

                      <h4 className="text-sm sm:text-xl font-normal text-white mb-0.5 sm:mb-1 tracking-tight">
                        {pillar.title}
                      </h4>

                      <div className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-white/45 mb-1.5 sm:mb-3">
                        {pillar.tagline}
                      </div>

                      <p className="text-[10px] sm:text-xs text-white/70 font-light leading-relaxed mb-2 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                        {pillar.description}
                      </p>
                    </div>

                    <div className="pt-2 sm:pt-3 border-t border-white/[0.08] flex items-center justify-between font-mono text-[8px] sm:text-[9px] uppercase tracking-wider">
                      <span className="text-white/40 hidden sm:inline">{pillar.stats}</span>
                      <a
                        href={pillar.href}
                        className="text-sky-300/90 hover:text-white transition-colors inline-flex items-center gap-1 ml-auto sm:ml-0"
                      >
                        <span>{pillar.linkText}</span>
                        <span>→</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Progress HUD */}
        <footer className="relative z-20 flex flex-col gap-3 max-w-[1440px] w-full mx-auto border-t border-white/[0.10] pt-4">
          <div className="flex items-center justify-between font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/40">
            <div className="flex items-center gap-4">
              <span>SCROLL TO TRAVERSE PERSPECTIVE</span>
              <span className="hidden sm:inline-block">·</span>
              <span className="hidden sm:inline-block">FOUR MOMENTS</span>
            </div>

            <div className="flex items-center gap-2">
              <span>MOMENT DENSITY</span>
              <span ref={progressPercentRef} className="text-sky-300 font-mono">
                00%
              </span>
            </div>
          </div>

          {/* Hairline Scrub Progress Meter */}
          <div className="relative w-full h-[2px] bg-white/[0.08] overflow-hidden">
            <div
              ref={progressBarRef}
              className="absolute left-0 top-0 bottom-0 w-full bg-sky-400 origin-left will-change-transform"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </footer>
      </div>
    </section>
  );
}
