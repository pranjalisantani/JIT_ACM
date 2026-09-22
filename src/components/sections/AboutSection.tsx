"use client";

import React, { useState } from "react";
import { Section } from "@/components/ui/Section";
import { TwoToneHeading } from "@/components/ui/TwoToneHeading";
import { Diamond } from "@/components/ui/Diamond";
import { Reveal } from "@/components/ui/Reveal";

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
      "A collective of students, researchers, and theoreticians united by curiosity. We break down the barriers between academic rigor and raw engineering craft.",
    stats: "6 STEWARDS · 80+ ACTIVE MEMBERS",
    linkText: "MEET THE FELLOWSHIP ↓",
    href: "#team",
  },
  {
    key: "events",
    num: "02",
    title: "Events",
    tagline: "Convenings & Colloquia",
    description:
      "Weekly colloquia, paper reading groups, and intense 48-hour build sprints. Our stages are designed for deep technical discourse, not superficial demos.",
    stats: "5 CALENDAR FORUMS · 2 SPRINT HACKATHONS",
    linkText: "EXPLORE CALENDAR ↓",
    href: "#events",
  },
  {
    key: "projects",
    num: "03",
    title: "Projects",
    tagline: "Research Initiatives & Artifacts",
    description:
      "Real software built for real systems. We author open-source eBPF kernel monitors, Raft consensus engines, WebGPU graph engines, and zero-knowledge provers.",
    stats: "4 CORE INITIATIVES · OPEN SOURCE",
    linkText: "INSPECT INITIATIVES ↓",
    href: "#projects",
  },
  {
    key: "learning",
    num: "04",
    title: "Learning",
    tagline: "The Continuous Laboratory",
    description:
      "Peer-driven knowledge transfer. We demystify hardware memory hierarchies, distributed consensus, and complexity theory through hands-on dissection.",
    stats: "WEEKLY READING GROUP · MENTORSHIP",
    linkText: "CHAPTER CURRICULUM ↓",
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
  const [activePillar, setActivePillar] = useState<PillarKey | null>(null);

  const handlePillarHover = (key: PillarKey | null) => {
    setActivePillar(key);
    dispatchFieldFocus(key);
  };

  return (
    <Section
      id="about"
      index="01"
      label="ABOUT"
      title="Perspective & Community Structure"
    >
      {/* Editorial Narrative Thesis */}
      <Reveal>
        <div className="max-w-4xl mb-16 sm:mb-20">
          <div className="font-mono text-xs uppercase tracking-[0.22em] text-white/50 mb-4 flex items-center gap-2">
            <Diamond size={5} filled={true} />
            <span>THESIS // INTELLECTUAL CRAFT</span>
          </div>

          <TwoToneHeading
            as="h2"
            line1="Computation as an intellectual discipline,"
            line2="and a living creative medium."
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-8 leading-[1.12]"
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-white/[0.12]">
            <p className="md:col-span-7 text-white/80 text-base sm:text-lg font-light leading-relaxed">
              ACM FACE (Foundation for Algorithmic & Computational Exploration) is
              the university chapter where students transition from passive consumers
              of software to active architects of the computational universe.
            </p>
            <p className="md:col-span-5 text-white/55 text-sm sm:text-base font-light leading-relaxed">
              We cultivate a culture of uncompromising technical rigor, collaborative
              inquiry, and open-source contribution—grounding student ambition in real
              systems that run, scale, and endure.
            </p>
          </div>
        </div>
      </Reveal>

      {/* The Conceptual Quadrumvirate: PEOPLE × EVENTS × PROJECTS × LEARNING */}
      {/* Structured Editorial Composition (No generic cards) */}
      <div className="border-t border-white/[0.14]">
        <div className="py-6 flex items-center justify-between font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/45">
          <span>THE FOUR CHAPTER PILLARS</span>
          <span className="hidden sm:inline-block">PEOPLE × EVENTS × PROJECTS × LEARNING</span>
        </div>

        <div className="divide-y divide-white/[0.12]">
          {PILLARS.map((pillar) => {
            const isHovered = activePillar === pillar.key;
            const isAnyHovered = activePillar !== null;
            const rowOpacity = isAnyHovered ? (isHovered ? 1 : 0.35) : 1;

            return (
              <article
                key={pillar.key}
                onMouseEnter={() => handlePillarHover(pillar.key)}
                onMouseLeave={() => handlePillarHover(null)}
                className="py-10 sm:py-14 transition-all duration-300 group"
                style={{ opacity: rowOpacity }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-baseline">
                  {/* Column 1: Numeral & Title */}
                  <div className="lg:col-span-4 flex items-baseline gap-4 sm:gap-6">
                    <span className="font-mono text-xs sm:text-sm text-white/40 tracking-wider">
                      {pillar.num}
                    </span>
                    <div>
                      <h3 className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight group-hover:text-white transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="mt-1 font-mono text-xs uppercase tracking-[0.16em] text-white/50">
                        {pillar.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Column 2: Narrative Description */}
                  <div className="lg:col-span-5">
                    <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Column 3: Metadata & Navigation Link */}
                  <div className="lg:col-span-3 flex flex-col justify-between items-start lg:items-end gap-4">
                    <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-white/40 border border-white/10 px-2.5 py-1">
                      {pillar.stats}
                    </span>
                    <a
                      href={pillar.href}
                      onFocus={() => handlePillarHover(pillar.key)}
                      onBlur={() => handlePillarHover(null)}
                      className="font-mono text-xs uppercase tracking-[0.18em] text-white/80 hover:text-white inline-flex items-center gap-2 group/link focus-visible:outline-white py-1"
                    >
                      <span>{pillar.linkText}</span>
                      <span className="transition-transform group-hover/link:translate-x-1">→</span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
