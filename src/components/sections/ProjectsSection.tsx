"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { registerScrollTrigger, gsap } from "@/lib/motion/gsap";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";

interface RepoItem {
  slug: string;
  org: string;
  name: string;
  summary: string;
  language: string;
  languageColor: string;
  category: string;
  repoUrl: string;
}

const REPOSITORIES: RepoItem[] = [
  {
    slug: "project-1",
    org: "acm-face",
    name: "ebpf-kernel-mon",
    summary:
      "eBPF-driven performance monitoring infrastructure providing nanosecond-precision cache profiling and memory hierarchy analysis on Linux kernels.",
    language: "Rust",
    languageColor: "#dea584",
    category: "Systems",
    repoUrl: "https://github.com/acm-face/ebpf-kernel-mon",
  },
  {
    slug: "project-2",
    org: "acm-face",
    name: "raft-consensus-rs",
    summary:
      "High-throughput Raft consensus implementation in Rust featuring deterministic asynchronous simulation, network partition resilience, and formal TLA+ specifications.",
    language: "Rust",
    languageColor: "#dea584",
    category: "Distributed",
    repoUrl: "https://github.com/acm-face/raft-consensus-rs",
  },
  {
    slug: "project-3",
    org: "acm-face",
    name: "topology-engine-gl",
    summary:
      "Sparse matrix graph computation library and WebGL rendering pipeline designed for real-time visual inspection of high-dimensional peer networks.",
    language: "TypeScript",
    languageColor: "#3178c6",
    category: "Graphics",
    repoUrl: "https://github.com/acm-face/topology-engine-gl",
  },
  {
    slug: "project-4",
    org: "acm-face",
    name: "zk-credential-prover",
    summary:
      "Succinct non-interactive zero-knowledge argument system tailored for privacy-preserving academic credential verification and decentralized student identity.",
    language: "Rust",
    languageColor: "#dea584",
    category: "Cryptography",
    repoUrl: "https://github.com/acm-face/zk-credential-prover",
  },
];

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

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);

  // Visibly auto-advance active project every 4.8s unless reduced motion is preferred
  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (reducedMotion) return;

    timerRef.current = setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % REPOSITORIES.length);
    }, 4800);
  }, [reducedMotion]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, startTimer]);

  const handleSelectProject = (idx: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveIndex(idx);
    startTimer();
  };

  useEffect(() => {
    if (reducedMotion) {
      cardsRef.current.forEach((card) => {
        if (card) {
          card.style.opacity = "1";
          card.style.transform = "none";
        }
      });
      return;
    }

    const ScrollTrigger = registerScrollTrigger();
    const section = sectionRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || cards.length === 0) return;

    if (ScrollTrigger) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 16,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              once: true,
            },
          }
        );
      }, section);

      return () => ctx.revert();
    } else {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [reducedMotion]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      aria-label="Repositories: Open Source Systems Archive"
      className="relative w-full text-white bg-transparent py-14 sm:py-20 lg:py-24"
    >
      <div className="w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col">
        {/* Quiet Architectural Datum Hairline with Directional Asymmetry */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 font-mono text-[10px] uppercase tracking-[0.18em] sm:tracking-[0.24em] text-white/35 pb-3.5 mb-8 sm:mb-10 border-b border-white/[0.08] max-w-[92%] mr-auto w-full">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
            <span className="text-white/80 font-medium">REPOSITORIES</span>
            <span className="text-white/25">/</span>
            <span className="text-white/60">SOURCE ARCHIVE</span>
          </div>

          <div className="flex items-center gap-3 text-white/40 font-mono text-[9px] sm:text-[10px]">
            <span>04 SYSTEMS</span>
            <span className="text-white/20">·</span>
            <span className="text-white/50">OPEN SOURCE</span>
          </div>
        </div>

        {/* 2-Column Desktop / 1-Column Mobile GitHub-Style Repository Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 w-full">
          {REPOSITORIES.map((repo, idx) => {
            const isActive = idx === activeIndex;
            return (
              <div
                key={repo.slug}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                onClick={() => handleSelectProject(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelectProject(idx);
                  }
                }}
                aria-current={isActive ? "true" : undefined}
                aria-label={`Select ${repo.name} project`}
                className="group relative rounded-md border border-white/[0.10] bg-[#090a0d] hover:border-white/[0.22] hover:bg-[#0c0d12] shadow-[0_8px_30px_rgba(0,0,0,0.6)] p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Top: Repository Name + GitHub/External Icon */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-col gap-1">
                      <a
                        href={repo.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-sm sm:text-[15px] tracking-tight group-hover:text-sky-300 transition-colors focus-visible:outline-sky-400"
                      >
                        <span className="text-white/45 group-hover:text-white/65 transition-colors font-normal">
                          {repo.org} /
                        </span>
                        <span className="font-semibold text-white group-hover:text-sky-300 transition-colors">
                          {repo.name}
                        </span>
                      </a>
                    </div>

                    <a
                      href={repo.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${repo.org}/${repo.name} on GitHub`}
                      className="text-white/40 hover:text-white transition-colors p-1 focus-visible:outline-sky-400 shrink-0"
                    >
                      <GitHubIcon className="w-4 h-4 text-white/50 group-hover:text-white/90 transition-colors" />
                    </a>
                  </div>

                  {/* Middle: Short Description (approx 2 lines) */}
                  <p className="text-xs sm:text-[13px] text-white/70 font-light leading-relaxed mb-5 line-clamp-2">
                    {repo.summary}
                  </p>
                </div>

              {/* Bottom: Language / Category + GitHub Action */}
              <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs font-mono">
                {/* Language Indicator */}
                <div className="flex items-center gap-3 text-white/55 text-[11px] sm:text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                      style={{ backgroundColor: repo.languageColor }}
                      aria-hidden="true"
                    />
                    <span className="text-white/85 font-medium">{repo.language}</span>
                  </div>
                  <span className="text-white/20">·</span>
                  <span className="text-white/50">{repo.category}</span>
                </div>

                {/* Direct GitHub Action */}
                <a
                  href={repo.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${repo.name} repository`}
                  className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium uppercase tracking-wider text-sky-400/90 group-hover:text-sky-300 transition-colors focus-visible:outline-sky-400"
                >
                  <GitHubIcon className="w-3 h-3 text-sky-400/70 group-hover:text-sky-300 transition-colors" />
                  <span>GitHub ↗</span>
                </a>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
}
