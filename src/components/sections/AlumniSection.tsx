"use client";

import React, { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Diamond } from "@/components/ui/Diamond";
import { Reveal } from "@/components/ui/Reveal";
import { ALUMNI_MEMBERS } from "@/content/alumni";

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

export function AlumniSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <Section
      id="alumni"
      index="06"
      label="ALUMNI"
      title="Before Us · The Archival Memory Layer"
    >
      {/* Narrative Transition from Current Team into Before Us */}
      <Reveal>
        <div className="mb-12 border-b border-white/[0.12] pb-8">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.24em] text-white/50 mb-3">
            <Diamond size={5} filled={false} />
            <span>TRANSITION // BEFORE US</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-baseline">
            <div className="md:col-span-7">
              <h3
                className="text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-tight leading-snug"
                style={{ fontWeight: 300 }}
              >
                Those who established the foundations before us.
              </h3>
            </div>
            <div className="md:col-span-5">
              <p className="text-white/60 text-xs sm:text-sm font-light leading-relaxed">
                The current cohort builds on the rigorous research, systems charters, and curriculum
                laid down by preceding chapter stewards. This archival layer honors their enduring
                contributions.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Progressive Archival Roster */}
      <div className="border border-white/[0.12] bg-neutral-950/60 divide-y divide-white/[0.10]">
        {ALUMNI_MEMBERS.map((alumnus, idx) => {
          const isHovered = hoveredId === alumnus.id;
          const isAnyHovered = hoveredId !== null;
          const rowOpacity = isAnyHovered ? (isHovered ? 1 : 0.45) : 1;

          return (
            <article
              key={alumnus.id}
              onMouseEnter={() => setHoveredId(alumnus.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(alumnus.id)}
              onBlur={() => setHoveredId(null)}
              className="p-6 sm:p-8 lg:p-10 transition-all duration-300 group hover:bg-white/[0.02]"
              style={{ opacity: rowOpacity }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-baseline">
                {/* Column 1: Historical Index & Tenure */}
                <div className="lg:col-span-3 space-y-1">
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                    <span className="text-white/25">0{idx + 1}</span>
                    <span>·</span>
                    <span className="text-white/80">{alumnus.tenure}</span>
                  </div>
                  <div className="font-mono text-xs text-white/50 uppercase tracking-wider">
                    {alumnus.currentRole || "Alumnus"}
                  </div>
                </div>

                {/* Column 2: Name & Former Role */}
                <div className="lg:col-span-4 space-y-1">
                  <h4 className="text-2xl sm:text-3xl font-light text-white tracking-tight group-hover:text-white transition-colors">
                    {alumnus.name}
                  </h4>
                  <p className="font-mono text-xs uppercase tracking-wider text-white/60">
                    {alumnus.formerRole}
                  </p>
                </div>

                {/* Column 3: Foundation Contribution Note */}
                <div className="lg:col-span-4">
                  <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                    {alumnus.contributions}
                  </p>
                </div>

                {/* Column 4: Links */}
                <div className="lg:col-span-1 flex items-center justify-start lg:justify-end gap-2.5">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${alumnus.name} on GitHub`}
                    className="w-8 h-8 rounded-xs border border-white/20 hover:border-white text-white/60 hover:text-white flex items-center justify-center transition-colors focus-visible:outline-white"
                  >
                    <GitHubIcon className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${alumnus.name} on LinkedIn`}
                    className="w-8 h-8 rounded-xs border border-white/20 hover:border-white text-white/60 hover:text-white flex items-center justify-center transition-colors focus-visible:outline-white"
                  >
                    <LinkedInIcon className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
