"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Section } from "@/components/ui/Section";
import { Diamond } from "@/components/ui/Diamond";
import { Reveal } from "@/components/ui/Reveal";
import { TEAM_MEMBERS } from "@/content/team";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";
import { gsap } from "@/lib/motion/gsap";

function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
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

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
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

export function TeamSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const totalMembers = TEAM_MEMBERS.length;
  const currentMember = TEAM_MEMBERS[activeIndex] || TEAM_MEMBERS[0];

  const goToMember = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activeIndex || targetIndex < 0 || targetIndex >= totalMembers) return;

      if (reducedMotion || !stageRef.current) {
        setActiveIndex(targetIndex);
        return;
      }

      // GSAP continuous human stream transition
      const tl = gsap.timeline();
      tl.to(stageRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          setActiveIndex(targetIndex);
        },
      });

      tl.fromTo(
        stageRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
      );
    },
    [activeIndex, reducedMotion, totalMembers]
  );

  const nextMember = useCallback(() => {
    goToMember((activeIndex + 1) % totalMembers);
  }, [activeIndex, totalMembers, goToMember]);

  const prevMember = useCallback(() => {
    goToMember((activeIndex - 1 + totalMembers) % totalMembers);
  }, [activeIndex, totalMembers, goToMember]);

  // Gentle auto progression that stops on hover / inspection
  useEffect(() => {
    if (reducedMotion || isPaused) {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
      return;
    }

    autoPlayRef.current = setTimeout(() => {
      nextMember();
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearTimeout(autoPlayRef.current);
    };
  }, [activeIndex, isPaused, nextMember, reducedMotion]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextMember();
    else if (e.key === "ArrowLeft") prevMember();
  };

  const initials = currentMember.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Section
      id="team"
      index="05"
      label="TEAM"
      title="Chapter Stewards & Research Fellows"
    >
      {/* Narrative Header */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-white/[0.12] pb-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-white/50 mb-2 flex items-center gap-2">
              <Diamond size={5} filled={true} />
              <span>THE HUMAN STREAM // ACTIVE STEWARDS</span>
            </div>
            <p className="text-white/80 text-sm sm:text-base font-light max-w-xl">
              Meet the student fellows guiding our research colloquia, open-source initiatives,
              and academic inquiry. One fellow takes the stage at a time.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              STEWARD {String(activeIndex + 1).padStart(2, "0")} / {String(totalMembers).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Resume team stream" : "Pause team stream"}
              className="px-3 py-1.5 border border-white/20 hover:border-white text-white font-mono text-[10px] uppercase tracking-widest transition-colors inline-flex items-center gap-2 focus-visible:outline-white cursor-pointer"
            >
              <Diamond size={4} filled={!isPaused} />
              <span>{isPaused ? "PAUSED" : "STREAM ACTIVE"}</span>
            </button>
          </div>
        </div>
      </Reveal>

      {/* Shared Human-Centered Visual Stage */}
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        className="relative w-full border border-white/[0.14] bg-neutral-950/80 p-6 sm:p-10 lg:p-12 overflow-hidden focus:outline-none focus:ring-1 focus:ring-white/40"
        aria-label="Human-centered team stream. Use arrow keys to step between members."
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Fellow Directory Stream Selector */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-white/[0.10] pb-6 lg:pb-0 lg:pr-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 mb-4">
              FELLOWSHIP ROSTER
            </div>
            <div className="space-y-1">
              {TEAM_MEMBERS.map((member, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={member.id || idx}
                    type="button"
                    onClick={() => goToMember(idx)}
                    className={`w-full text-left px-3 py-2.5 rounded-xs transition-all flex items-center justify-between font-mono text-xs cursor-pointer focus-visible:outline-white ${
                      isActive
                        ? "bg-white/[0.08] text-white border-l-2 border-white pl-3 font-medium"
                        : "text-white/50 hover:text-white hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="truncate">{member.name}</span>
                    <span className="text-[10px] text-white/30 tracking-wider">
                      0{idx + 1}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Dominant Fellow Presentation Stage */}
          <div
            ref={stageRef}
            aria-live="polite"
            className="lg:col-span-8 flex flex-col justify-between space-y-6"
          >
            {/* Top Stage Bar: Monogram Badge & Fellow Index */}
            <div className="flex items-center justify-between border-b border-white/[0.10] pb-4">
              <div className="w-14 h-14 rounded-sm border border-white/30 bg-white/[0.05] flex items-center justify-center font-mono text-base font-medium tracking-wider text-white">
                {initials}
              </div>

              <div className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                <Diamond size={5} filled={true} />
                <span>STEWARDSHIP 2026–2027</span>
              </div>
            </div>

            {/* Fellow Name, Role, and Stewardship Bio */}
            <div className="space-y-3">
              <h3
                className="text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-[1.1]"
                style={{ fontWeight: 300 }}
              >
                {currentMember.name}
              </h3>

              <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.16em] text-white/70">
                {currentMember.role}
              </p>

              <p className="text-white/75 text-sm sm:text-base font-light leading-relaxed max-w-2xl pt-2">
                {currentMember.bio}
              </p>
            </div>

            {/* Clickable Social Icons (No raw text URLs) */}
            <div className="pt-4 border-t border-white/[0.10] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${currentMember.name} on GitHub`}
                  className="w-9 h-9 rounded-xs border border-white/20 hover:border-white text-white/70 hover:text-white flex items-center justify-center transition-colors focus-visible:outline-white"
                >
                  <GitHubIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${currentMember.name} on LinkedIn`}
                  className="w-9 h-9 rounded-xs border border-white/20 hover:border-white text-white/70 hover:text-white flex items-center justify-center transition-colors focus-visible:outline-white"
                >
                  <LinkedInIcon className="w-4 h-4" />
                </a>
              </div>

              {/* Stepper Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prevMember}
                  aria-label="Previous team steward"
                  className="w-9 h-9 border border-white/20 hover:border-white text-white flex items-center justify-center font-mono text-xs transition-colors cursor-pointer focus-visible:outline-white"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={nextMember}
                  aria-label="Next team steward"
                  className="w-9 h-9 border border-white/20 hover:border-white text-white flex items-center justify-center font-mono text-xs transition-colors cursor-pointer focus-visible:outline-white"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
