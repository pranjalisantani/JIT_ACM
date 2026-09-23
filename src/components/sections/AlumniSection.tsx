"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Diamond } from "@/components/ui/Diamond";
import { ALUMNI_MEMBERS } from "@/content/alumni";
import { AlumniItem, MemberLink } from "@/types";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";
import { gsap } from "@/lib/motion/gsap";

function GitHubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedInIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46V10.9M7.85 6.25a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
    </svg>
  );
}

function circularOffset(index: number, active: number, total: number): number {
  let delta = index - active;
  const half = Math.floor(total / 2);
  if (delta > half) delta -= total;
  if (delta < -half) delta += total;
  return delta;
}

function memberInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
}

function findLink(links: MemberLink[] | undefined, kind: "github" | "linkedin"): string | undefined {
  return links?.find((link) => link.label.toLowerCase().includes(kind))?.url;
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

export function AlumniSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const streamRef = useRef<HTMLDivElement | null>(null);
  const autoPlayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const neighborReach = useNeighborReach();

  const total = ALUMNI_MEMBERS.length;

  const goToMember = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activeIndex || targetIndex < 0 || targetIndex >= total) return;
      setActiveIndex(targetIndex);

      if (reducedMotion || !streamRef.current) return;
      gsap.fromTo(
        streamRef.current,
        { opacity: 0.82 },
        { opacity: 1, duration: 0.35, ease: "power2.out" }
      );
    },
    [activeIndex, reducedMotion, total]
  );

  const nextMember = useCallback(() => {
    goToMember((activeIndex + 1) % total);
  }, [activeIndex, total, goToMember]);

  const prevMember = useCallback(() => {
    goToMember((activeIndex - 1 + total) % total);
  }, [activeIndex, total, goToMember]);

  useEffect(() => {
    if (reducedMotion || isPaused) {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setTimeout(() => {
      nextMember();
    }, 5600);

    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [activeIndex, isPaused, nextMember, reducedMotion]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextMember();
    else if (e.key === "ArrowLeft") prevMember();
  };

  return (
    <section
      id="alumni"
      aria-labelledby="alumni-heading"
      className="relative w-full text-white bg-transparent pt-12 sm:pt-16"
    >
      <div className="flex items-center gap-3 mb-8 border-t border-white/[0.10] pt-10">
        <Diamond size={5} filled={false} />
        <h2
          id="alumni-heading"
          className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.24em] text-white/45"
        >
          BEFORE US // ARCHIVE
        </h2>
      </div>

      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        className="relative w-full overflow-hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
        aria-label="Alumni archive stream. Use arrow keys to step between alumni."
      >
        <div
          ref={streamRef}
          aria-live="polite"
          className="relative h-[260px] sm:h-[280px] lg:h-[300px] flex items-end justify-center"
        >
          {ALUMNI_MEMBERS.map((alumnus: AlumniItem, idx) => {
            const offset = circularOffset(idx, activeIndex, total);
            const distance = Math.abs(offset);
            if (distance > neighborReach) return null;

            const isFocus = offset === 0;
            const scale = isFocus ? 1 : distance === 1 ? 0.78 : 0.62;
            const opacity = isFocus ? 1 : distance === 1 ? 0.4 : 0.18;
            const slot = neighborReach === 1 ? 108 : isFocus ? 150 : 112;
            const githubUrl = findLink(alumnus.links, "github");
            const linkedinUrl = findLink(alumnus.links, "linkedin");

            return (
              <div
                key={alumnus.id}
                className="absolute bottom-0 flex flex-col items-center"
                style={{
                  transform: `translateX(${offset * slot}px) scale(${scale})`,
                  opacity,
                  zIndex: 10 - distance,
                  transition: reducedMotion
                    ? "none"
                    : "transform 550ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease",
                }}
              >
                <button
                  type="button"
                  onClick={() => goToMember(idx)}
                  aria-current={isFocus ? "true" : undefined}
                  aria-label={`${alumnus.name}, ${alumnus.formerRole}`}
                  className="cursor-pointer border-0 bg-transparent p-0 text-left focus-visible:outline-white"
                >
                  <div
                    className={`relative mx-auto mb-3 overflow-hidden border bg-neutral-950/30 flex items-center justify-center ${
                      isFocus
                        ? "w-[120px] h-[144px] sm:w-[132px] sm:h-[156px] lg:w-[148px] lg:h-[176px] border-white/30"
                        : "w-[76px] h-[98px] sm:w-[84px] sm:h-[108px] lg:w-[96px] lg:h-[120px] border-white/10"
                    }`}
                  >
                    <span
                      className={`font-mono tracking-[0.18em] ${
                        isFocus ? "text-base text-white/70" : "text-[10px] text-white/35"
                      }`}
                    >
                      {memberInitials(alumnus.name)}
                    </span>
                  </div>

                  {isFocus ? (
                    <div className="w-[168px] sm:w-[188px] lg:w-[200px] mx-auto text-center space-y-1">
                      <h3 className="text-base sm:text-lg font-light tracking-tight text-white">
                        {alumnus.name}
                      </h3>
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/50 leading-snug">
                        {alumnus.formerRole}
                      </p>
                    </div>
                  ) : (
                    <p className="w-[92px] sm:w-[100px] mx-auto text-center font-mono text-[10px] uppercase tracking-[0.12em] text-white/35 truncate">
                      {alumnus.name.split(" ")[0]}
                    </p>
                  )}
                </button>

                {isFocus && (githubUrl || linkedinUrl) && (
                  <div className="mt-2.5 flex items-center justify-center gap-2">
                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${alumnus.name} on GitHub`}
                        className="w-7 h-7 border border-white/20 hover:border-white text-white/70 hover:text-white flex items-center justify-center transition-colors focus-visible:outline-white"
                      >
                        <GitHubIcon />
                      </a>
                    )}
                    {linkedinUrl && (
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${alumnus.name} on LinkedIn`}
                        className="w-7 h-7 border border-white/20 hover:border-white text-white/70 hover:text-white flex items-center justify-center transition-colors focus-visible:outline-white"
                      >
                        <LinkedInIcon />
                      </a>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={prevMember}
            aria-label="Previous alumnus"
            className="w-8 h-8 border border-white/20 hover:border-white text-white flex items-center justify-center font-mono text-xs transition-colors cursor-pointer focus-visible:outline-white"
          >
            ←
          </button>
          <button
            type="button"
            onClick={nextMember}
            aria-label="Next alumnus"
            className="w-8 h-8 border border-white/20 hover:border-white text-white flex items-center justify-center font-mono text-xs transition-colors cursor-pointer focus-visible:outline-white"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
