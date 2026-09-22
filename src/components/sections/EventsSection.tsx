"use client";

import React, { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Diamond } from "@/components/ui/Diamond";
import { Reveal } from "@/components/ui/Reveal";
import { EVENTS_DATA } from "@/content/events";
import { EventItem } from "@/types";

export function EventsSection() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const activeEvents = EVENTS_DATA.filter((e) => e.status !== "past");
  const pastEvents = EVENTS_DATA.filter((e) => e.status === "past");

  const schemaEvents = EVENTS_DATA.filter((e) => Boolean(e.dateISO)).map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: e.dateISO,
    description: e.summary,
    eventAttendanceMode: e.mode.includes("Stream")
      ? "https://schema.org/MixedEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: e.location,
    },
  }));

  const renderEventRow = (evt: EventItem, idx: number) => {
    const isHovered = hoveredSlug === evt.slug;
    const isAnyHovered = hoveredSlug !== null;
    const rowOpacity = isAnyHovered ? (isHovered ? 1 : 0.3) : 1;

    const isPast = evt.status === "past";

    return (
      <article
        key={evt.slug}
        onMouseEnter={() => setHoveredSlug(evt.slug)}
        onMouseLeave={() => setHoveredSlug(null)}
        onFocus={() => setHoveredSlug(evt.slug)}
        onBlur={() => setHoveredSlug(null)}
        style={{
          opacity: rowOpacity,
          transform: isHovered ? "translate3d(12px, 0, 0)" : "none",
          transitionProperty: "opacity, transform, border-color",
          transitionDuration: "280ms",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className={`relative group border-b py-10 sm:py-12 transition-colors ${
          isHovered ? "border-white/40" : "border-white/[0.12]"
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-baseline">
          {/* Col 1: Date & Status */}
          <div className="lg:col-span-3 space-y-2">
            <div className="flex items-center gap-3 font-mono text-[11px] sm:text-xs uppercase tracking-[0.2em] text-white/50">
              <span className="text-white/35">0{idx + 1}</span>
              <Diamond size={5} filled={isHovered || evt.status === "open"} />
              <span className={isHovered ? "text-white" : "text-white/70"}>
                {evt.status.replace("-", " ").toUpperCase()}
              </span>
            </div>
            <p className="font-mono text-sm sm:text-base text-white/90 font-medium tracking-wide">
              {evt.dateLabel}
            </p>
          </div>

          {/* Col 2: Title, Mode, Summary */}
          <div className="lg:col-span-6 space-y-3">
            <h3
              className={`font-light tracking-tight leading-[1.12] transition-colors ${
                isHovered ? "text-white" : "text-white/95"
              }`}
              style={{
                fontSize: "clamp(22px, 3.2vw, 38px)",
                fontWeight: 300,
              }}
            >
              {evt.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] sm:text-xs text-white/50 uppercase tracking-[0.16em]">
              <span className="text-white/75">{evt.mode}</span>
              <span>·</span>
              <span>{evt.location}</span>
            </div>

            <p className="text-white/65 text-sm sm:text-base font-light leading-relaxed max-w-2xl pt-1">
              {evt.summary}
            </p>
          </div>

          {/* Col 3: Action */}
          <div className="lg:col-span-3 flex justify-start lg:justify-end items-start pt-2">
            {!isPast && evt.registerUrl ? (
              <a
                href={evt.registerUrl}
                aria-label={`Register for ${evt.title}`}
                className="font-mono text-xs uppercase tracking-[0.2em] px-4 py-2.5 border border-white/25 hover:border-white bg-white/[0.03] hover:bg-white hover:text-black transition-all inline-flex items-center gap-2 focus-visible:outline-white"
              >
                <span>REGISTER FORUM</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
            ) : (
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/35 py-2">
                ARCHIVED SESSION
              </span>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <Section
      id="events"
      index="02"
      label="EVENTS"
      title="Convenings & Activity Index"
    >
      {/* Search Engine Event Structured Data */}
      {schemaEvents.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaEvents) }}
        />
      )}

      {/* Editorial Index Header Note */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16 border-b border-white/[0.12] pb-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 max-w-md">
            Chronological calendar of colloquia, systems sessions, and research forums.
          </p>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <span className="w-2 h-2 rounded-full bg-white/30 animate-pulse" />
            <span>{activeEvents.length} UPCOMING · ACTIVE CHAPTER CALENDAR</span>
          </div>
        </div>
      </Reveal>

      {/* Active Events Rows */}
      <div className="flex flex-col border-t border-white/[0.12]">
        {activeEvents.map((evt, idx) => renderEventRow(evt, idx))}
      </div>

      {/* Collapsible Past Events Archive */}
      {pastEvents.length > 0 && (
        <details className="group mt-16 border-t border-white/[0.14] pt-8">
          <summary className="cursor-pointer font-mono text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white flex items-center justify-between py-3 focus-visible:outline-white">
            <span className="flex items-center gap-2">
              <Diamond size={5} filled={false} />
              <span>PAST CONVENINGS ARCHIVE ({pastEvents.length})</span>
            </span>
            <span className="text-white/40 group-open:rotate-180 transition-transform">↓</span>
          </summary>
          <div className="mt-6 flex flex-col pl-4 sm:pl-8 border-l border-white/[0.14]">
            {pastEvents.map((evt, idx) =>
              renderEventRow(evt, idx + activeEvents.length)
            )}
          </div>
        </details>
      )}
    </Section>
  );
}
