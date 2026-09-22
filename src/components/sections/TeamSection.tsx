"use client";

import React, { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Diamond } from "@/components/ui/Diamond";
import { Reveal } from "@/components/ui/Reveal";
import { TEAM_MEMBERS } from "@/content/team";
import { MemberItem } from "@/types";

export function TeamSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <Section
      id="team"
      index="05"
      label="TEAM"
      title="Chapter Stewards & Research Fellows"
    >
      {/* Header Narrative Note */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16 border-b border-white/[0.12] pb-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 max-w-md">
            The student fellows and stewards guiding our research colloquia, open-source initiatives, and freshman curriculum.
          </p>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <span className="w-2 h-2 rounded-full bg-white/30 animate-pulse" />
            <span>{TEAM_MEMBERS.length} FELLOWS · 2026–2027 COHORT</span>
          </div>
        </div>
      </Reveal>

      {/* Human-Centered Stewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {TEAM_MEMBERS.map((member, idx) => {
          const isHovered = hoveredId === member.id;
          const isAnyHovered = hoveredId !== null;
          const cardOpacity = isAnyHovered ? (isHovered ? 1 : 0.4) : 1;

          // Extract initials
          const initials = member.name
            .split(" ")
            .map((n) => n[0])
            .join("");

          return (
            <article
              key={member.id || idx}
              onMouseEnter={() => setHoveredId(member.id || `tm-${idx}`)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex flex-col justify-between p-6 sm:p-8 border border-white/[0.14] bg-neutral-950/80 transition-all duration-300 group hover:border-white/40"
              style={{ opacity: cardOpacity }}
            >
              <div>
                {/* Monograph Avatar & Index */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.08]">
                  <div className="w-12 h-12 rounded-sm border border-white/20 bg-white/[0.04] flex items-center justify-center font-mono text-sm uppercase tracking-widest text-white/80 group-hover:border-white/50 group-hover:text-white transition-colors">
                    {initials}
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                    <Diamond size={4} filled={isHovered} />
                    <span>STEWARD // 0{idx + 1}</span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-xl sm:text-2xl font-light text-white tracking-tight group-hover:text-white transition-colors">
                  {member.name}
                </h3>

                {/* Role */}
                <p className="mt-1.5 font-mono text-xs text-white/60 uppercase tracking-wider">
                  {member.role}
                </p>

                {/* Bio / Research Direction */}
                <p className="mt-4 text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Links */}
              {member.links && member.links.length > 0 && (
                <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center gap-4">
                  {member.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] uppercase tracking-widest text-white/50 hover:text-white transition-colors focus-visible:outline-white inline-flex items-center gap-1"
                    >
                      <span>{link.label}</span>
                      <span>↗</span>
                    </a>
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </Section>
  );
}
