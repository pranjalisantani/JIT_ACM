"use client";

import React, { useState, useEffect, useRef } from "react";
import { Section } from "@/components/ui/Section";
import { TwoToneHeading } from "@/components/ui/TwoToneHeading";
import { Diamond } from "@/components/ui/Diamond";
import { Reveal } from "@/components/ui/Reveal";
import { ABOUT_PILLARS } from "@/content/site";
import { registerScrollTrigger, gsap } from "@/lib/motion/gsap";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";

type PillarKey = "people" | "events" | "projects" | "learning";

export function AboutSection() {
  const [activePillar, setActivePillar] = useState<PillarKey>("people");
  const diagramRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const isPaused = document.documentElement.getAttribute("data-motion") === "paused";
    if (isPaused) return;

    const ScrollTrigger = registerScrollTrigger();
    if (!ScrollTrigger) return;

    const diagramEl = diagramRef.current;
    const sectionEl = document.getElementById("about");
    if (!diagramEl || !sectionEl) return;

    const ctx = gsap.context(() => {
      gsap.to(diagramEl, {
        y: -24,
        ease: "none",
        scrollTrigger: {
          trigger: sectionEl,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    }, sectionEl);

    return () => ctx.revert();
  }, [reducedMotion]);

  const pillarsList: { key: PillarKey; title: string; href?: string; cx: number; cy: number; leftPct: string; topPct: string }[] = [
    { key: "people", title: "People", href: "#team", cx: 200, cy: 180, leftPct: "20%", topPct: "25.7%" },
    { key: "events", title: "Events", href: "#events", cx: 800, cy: 180, leftPct: "80%", topPct: "25.7%" },
    { key: "projects", title: "Projects", href: "#projects", cx: 800, cy: 520, leftPct: "80%", topPct: "74.3%" },
    { key: "learning", title: "Learning", href: undefined, cx: 200, cy: 520, leftPct: "20%", topPct: "74.3%" },
  ];

  const satellites = [
    { cx: 360, cy: 240, r: 2.5 },
    { cx: 640, cy: 250, r: 3 },
    { cx: 480, cy: 490, r: 2.5 },
  ];

  const currentPillar = ABOUT_PILLARS[activePillar];

  return (
    <Section id="about" index="01" label="ABOUT" title="Perspective & Computational Structure">
      {/* Editorial Narrative */}
      <Reveal>
        <div className="max-w-4xl mb-12 sm:mb-16">
          <TwoToneHeading
            as="h2"
            line1="Computation as an intellectual discipline,"
            line2="and a living creative medium."
            className="text-3xl sm:text-4xl md:text-5xl mb-6"
          />
          <p className="text-white/70 text-base sm:text-lg font-light leading-relaxed max-w-3xl">
            The ACM Student Chapter provides a rigorous, collaborative environment where
            students transition from passive consumers of software to active architects of the
            computational landscape. Here, engineering rigor meets creative inquiry.
          </p>
        </div>
      </Reveal>

      {/* Semantic Crawlable HTML List (always present in SSR) */}
      <div className="mb-10">
        <h3 className="sr-only">Four Pillars of ACM FACE</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-y border-white/[0.14] py-8">
          {pillarsList.map(({ key, title, href }) => {
            const pillar = ABOUT_PILLARS[key];
            const isSelected = activePillar === key;

            return (
              <li
                key={key}
                className={`flex flex-col justify-between transition-opacity ${
                  isSelected ? "opacity-100" : "opacity-75 hover:opacity-100"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-[0.16em] text-white">
                    <Diamond size={5} filled={isSelected} />
                    {href ? (
                      <a
                        href={href}
                        onClick={() => setActivePillar(key)}
                        className="hover:underline focus-visible:outline-white"
                      >
                        {title}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActivePillar(key)}
                        className="cursor-pointer focus-visible:outline-white"
                      >
                        {title}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-white/60 font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Computational Topological Structure Diagram */}
      <div
        ref={diagramRef}
        className="relative w-full max-w-5xl mx-auto mt-12 bg-black border border-white/[0.14] rounded-lg p-4 sm:p-8 overflow-hidden will-change-transform"
      >
        {/* CSS Keyframes for slow breathing ambient motion & computational signal flows */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes nodeBreathing {
            0%, 100% { transform: translate3d(0, 0, 0); }
            50% { transform: translate3d(0, -6px, 0); }
          }
          @keyframes signalFlow {
            from { stroke-dashoffset: 24; }
            to { stroke-dashoffset: 0; }
          }
          .animate-breathing {
            animation: nodeBreathing 10s ease-in-out infinite;
          }
          .animate-signal-flow {
            stroke-dasharray: 4 6;
            animation: signalFlow 2.4s linear infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-breathing, .animate-signal-flow { animation: none !important; }
          }
          html[data-motion="paused"] .animate-breathing,
          html[data-motion="paused"] .animate-signal-flow {
            animation-play-state: paused !important;
          }
        `}} />

        {/* SVG Diagram Layer (aria-hidden) */}
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-auto select-none"
          aria-hidden="true"
        >
          {/* Outer Ring Edges */}
          <line
            x1="200" y1="180" x2="800" y2="180"
            stroke="#ffffff"
            strokeWidth="1"
            strokeOpacity={activePillar === "people" || activePillar === "events" ? 0.7 : 0.15}
            strokeDasharray="2 4"
          />
          <line
            x1="800" y1="180" x2="800" y2="520"
            stroke="#ffffff"
            strokeWidth="1"
            strokeOpacity={activePillar === "events" || activePillar === "projects" ? 0.7 : 0.15}
            strokeDasharray="2 4"
          />
          <line
            x1="800" y1="520" x2="200" y2="520"
            stroke="#ffffff"
            strokeWidth="1"
            strokeOpacity={activePillar === "projects" || activePillar === "learning" ? 0.7 : 0.15}
            strokeDasharray="2 4"
          />
          <line
            x1="200" y1="520" x2="200" y2="180"
            stroke="#ffffff"
            strokeWidth="1"
            strokeOpacity={activePillar === "learning" || activePillar === "people" ? 0.7 : 0.15}
            strokeDasharray="2 4"
          />

          {/* Radial Hairline Edges to Center Node (500, 350) with Living Signal Flow */}
          <line
            x1="500" y1="350" x2="200" y2="180"
            stroke="#ffffff"
            strokeWidth={activePillar === "people" ? "1.5" : "1"}
            strokeOpacity={activePillar === "people" ? 0.95 : 0.25}
            className={activePillar === "people" ? "animate-signal-flow" : undefined}
          />
          <line
            x1="500" y1="350" x2="800" y2="180"
            stroke="#ffffff"
            strokeWidth={activePillar === "events" ? "1.5" : "1"}
            strokeOpacity={activePillar === "events" ? 0.95 : 0.25}
            className={activePillar === "events" ? "animate-signal-flow" : undefined}
          />
          <line
            x1="500" y1="350" x2="800" y2="520"
            stroke="#ffffff"
            strokeWidth={activePillar === "projects" ? "1.5" : "1"}
            strokeOpacity={activePillar === "projects" ? 0.95 : 0.25}
            className={activePillar === "projects" ? "animate-signal-flow" : undefined}
          />
          <line
            x1="500" y1="350" x2="200" y2="520"
            stroke="#ffffff"
            strokeWidth={activePillar === "learning" ? "1.5" : "1"}
            strokeOpacity={activePillar === "learning" ? 0.95 : 0.25}
            className={activePillar === "learning" ? "animate-signal-flow" : undefined}
          />

          {/* Satellite Hairlines */}
          <line x1="500" y1="350" x2="360" y2="240" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="3 3" />
          <line x1="500" y1="350" x2="640" y2="250" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="3 3" />
          <line x1="500" y1="350" x2="480" y2="490" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.2" strokeDasharray="3 3" />

          {/* Satellite Nodes */}
          {satellites.map((sat, i) => (
            <circle key={i} cx={sat.cx} cy={sat.cy} r={sat.r} fill="#ffffff" fillOpacity="0.4" />
          ))}

          {/* Center Hub: ACM FACE Diamond with Subtle Ring */}
          <g transform="translate(500, 350)">
            <circle r="22" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.18" strokeDasharray="2 4" />
            <rect x="-8" y="-8" width="16" height="16" fill="#000000" stroke="#ffffff" strokeWidth="1.5" transform="rotate(45)" />
            <text
              x="0"
              y="32"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="11"
              fontFamily="monospace"
              letterSpacing="0.2em"
            >
              ACM FACE
            </text>
          </g>
        </svg>

        {/* Real Focusable HTML Interactive Nodes Overlaid at Percent Coordinates */}
        <div className="absolute inset-0 pointer-events-none p-4 sm:p-8">
          <div className="relative w-full h-full">
            {pillarsList.map(({ key, title, href, leftPct, topPct }) => {
              const isSelected = activePillar === key;

              const content = (
                <span className="flex flex-col items-center gap-2 group cursor-pointer">
                  <span
                    className="w-4 h-4 rotate-45 border transition-colors flex items-center justify-center"
                    style={{
                      borderColor: isSelected ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
                      backgroundColor: isSelected ? "#ffffff" : "#000000",
                    }}
                  />
                  <span
                    className={`font-mono text-xs sm:text-sm uppercase tracking-[0.16em] transition-colors ${
                      isSelected ? "text-white font-medium" : "text-white/60 group-hover:text-white"
                    }`}
                  >
                    {title}
                  </span>
                </span>
              );

              return (
                <div
                  key={key}
                  className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 animate-breathing"
                  style={{
                    left: leftPct,
                    top: topPct,
                  }}
                  onMouseEnter={() => setActivePillar(key)}
                >
                  {href ? (
                    <a
                      href={href}
                      onClick={() => setActivePillar(key)}
                      onFocus={() => setActivePillar(key)}
                      className="block p-2 focus-visible:outline-white"
                      aria-label={`${title} pillar — navigate to section`}
                    >
                      {content}
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActivePillar(key)}
                      onFocus={() => setActivePillar(key)}
                      className="block p-2 focus-visible:outline-white"
                      aria-label={`${title} pillar — show description`}
                    >
                      {content}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Pillar Interactive Description Bar */}
        <div className="mt-4 pt-4 border-t border-white/[0.14] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Diamond size={6} filled={true} />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white">
              {currentPillar.title}
            </span>
          </div>
          <p className="font-mono text-[11px] sm:text-xs text-white/70 tracking-[0.1em] max-w-xl">
            {currentPillar.description}
          </p>
        </div>
      </div>
    </Section>
  );
}
