"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Diamond } from "@/components/ui/Diamond";
import { PROJECTS_DATA } from "@/content/projects";
import { ProjectItem } from "@/types";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";
import { gsap } from "@/lib/motion/gsap";

function circularOffset(index: number, active: number, total: number): number {
  let delta = index - active;
  const half = Math.floor(total / 2);
  if (delta > half) delta -= total;
  if (delta < -half) delta += total;
  return delta;
}

function projectMeta(project: ProjectItem): string {
  if (project.tags && project.tags.length > 0) {
    return project.tags.slice(0, 2).join(" · ");
  }
  return project.slug;
}

function useNeighborReach() {
  const [reach, setReach] = useState(2);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width < 1024) setReach(1);
      else setReach(2);
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return reach;
}

export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const streamRef = useRef<HTMLDivElement | null>(null);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const neighborReach = useNeighborReach();

  const totalProjects = PROJECTS_DATA.length;
  const currentProject = PROJECTS_DATA[activeIndex] || PROJECTS_DATA[0];

  const goToArtifact = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activeIndex || targetIndex < 0 || targetIndex >= totalProjects) return;

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("acm:field-focus", {
            detail: { region: "projects" },
          })
        );
      }

      setActiveIndex(targetIndex);

      if (reducedMotion || !streamRef.current) return;

      gsap.fromTo(
        streamRef.current,
        { opacity: 0.82 },
        { opacity: 1, duration: 0.35, ease: "power2.out" }
      );
    },
    [activeIndex, reducedMotion, totalProjects]
  );

  const nextArtifact = useCallback(() => {
    goToArtifact((activeIndex + 1) % totalProjects);
  }, [activeIndex, totalProjects, goToArtifact]);

  const prevArtifact = useCallback(() => {
    goToArtifact((activeIndex - 1 + totalProjects) % totalProjects);
  }, [activeIndex, totalProjects, goToArtifact]);

  useEffect(() => {
    if (reducedMotion || isPaused) {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setTimeout(() => {
      nextArtifact();
    }, 5400);

    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [activeIndex, isPaused, nextArtifact, reducedMotion]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextArtifact();
    else if (e.key === "ArrowLeft") prevArtifact();
  };

  return (
    <Section
      id="projects"
      index="04"
      label="PROJECTS"
      title="Research Initiatives & Shipped Artifacts"
    >
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/50 flex items-center gap-2">
          <Diamond size={5} filled={true} />
          <span>SPATIAL INDEX // ONE IN FOCUS</span>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
          {String(activeIndex + 1).padStart(2, "0")} / {String(totalProjects).padStart(2, "0")}
        </span>
      </div>

      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        className="relative w-full overflow-hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
        aria-label="Compact project showcase. Use Arrow Left and Right to inspect artifacts."
      >
        <div
          ref={streamRef}
          aria-live="polite"
          className="relative h-[280px] sm:h-[310px] lg:h-[330px] flex items-end justify-center"
        >
          {PROJECTS_DATA.map((project, idx) => {
            const offset = circularOffset(idx, activeIndex, totalProjects);
            const distance = Math.abs(offset);
            if (distance > neighborReach) return null;

            const isFocus = offset === 0;
            const scale = isFocus ? 1 : distance === 1 ? 0.78 : 0.6;
            const opacity = isFocus ? 1 : distance === 1 ? 0.4 : 0.18;
            const slot = neighborReach === 1 ? 170 : isFocus ? 210 : 150;

            return (
              <button
                key={project.slug}
                type="button"
                onClick={() => goToArtifact(idx)}
                aria-current={isFocus ? "true" : undefined}
                aria-label={project.title}
                className="absolute bottom-0 cursor-pointer border-0 bg-transparent p-0 text-left focus-visible:outline-white"
                style={{
                  transform: `translateX(${offset * slot}px) scale(${scale})`,
                  opacity,
                  zIndex: 10 - distance,
                  transition: reducedMotion
                    ? "none"
                    : "transform 550ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease",
                }}
              >
                <div
                  className={`relative mx-auto mb-3 overflow-hidden border bg-neutral-950/40 ${
                    isFocus
                      ? "w-[210px] h-[128px] sm:w-[240px] sm:h-[148px] lg:w-[280px] lg:h-[168px] border-white/30"
                      : "w-[132px] h-[84px] sm:w-[150px] sm:h-[92px] lg:w-[170px] lg:h-[104px] border-white/12"
                  }`}
                >
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      className={`object-cover ${isFocus ? "opacity-80" : "opacity-40 grayscale"}`}
                      sizes={isFocus ? "280px" : "170px"}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col justify-between p-3 sm:p-4">
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                        SYS.{String(idx + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-light tracking-tight text-white/80 leading-tight ${
                          isFocus ? "text-sm sm:text-base" : "text-[11px]"
                        }`}
                      >
                        {project.title}
                      </span>
                    </div>
                  )}
                </div>

                {isFocus ? (
                  <div className="w-[230px] sm:w-[260px] lg:w-[300px] mx-auto text-center space-y-1.5">
                    <h3 className="text-base sm:text-lg lg:text-xl font-light tracking-tight text-white leading-snug">
                      {project.title}
                    </h3>
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
                      {projectMeta(project)}
                    </p>
                  </div>
                ) : (
                  <p className="w-[132px] sm:w-[150px] mx-auto text-center font-mono text-[10px] uppercase tracking-[0.12em] text-white/35 truncate">
                    {project.title}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={prevArtifact}
            aria-label="Previous research artifact"
            className="w-8 h-8 border border-white/20 hover:border-white text-white flex items-center justify-center font-mono text-xs transition-colors cursor-pointer focus-visible:outline-white"
          >
            ←
          </button>

          <Link
            href={`/projects/${currentProject.slug}`}
            className="font-mono text-[11px] uppercase tracking-[0.18em] px-4 py-2 border border-white/25 hover:border-white text-white/80 hover:text-white transition-colors inline-flex items-center gap-2 focus-visible:outline-white"
          >
            <span>Open spec</span>
            <span>→</span>
          </Link>

          <button
            type="button"
            onClick={nextArtifact}
            aria-label="Next research artifact"
            className="w-8 h-8 border border-white/20 hover:border-white text-white flex items-center justify-center font-mono text-xs transition-colors cursor-pointer focus-visible:outline-white"
          >
            →
          </button>
        </div>
      </div>
    </Section>
  );
}
