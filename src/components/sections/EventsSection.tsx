"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Diamond } from "@/components/ui/Diamond";
import { Reveal } from "@/components/ui/Reveal";
import { Magnetic } from "@/components/ui/Magnetic";
import { EVENTS_DATA, FALLBACK_PLACEHOLDER_EVENTS } from "@/content/events";
import { EventItem } from "@/types";

export function EventsSection() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const rawEvents = EVENTS_DATA.length > 0 ? EVENTS_DATA : FALLBACK_PLACEHOLDER_EVENTS;
  const activeEvents = rawEvents.filter((e) => e.status !== "past");
  const pastEvents = rawEvents.filter((e) => e.status === "past");

  // JSON-LD Event generation (only for real ISO dates and placeholder !== true)
  const schemaEvents = rawEvents
    .filter((e) => Boolean(e.dateISO) && !e.placeholder)
    .map((e) => ({
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

  const toggleExpand = (slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  };

  const renderEventRow = (evt: EventItem, idx: number) => {
    const isHovered = hoveredSlug === evt.slug;
    const isAnyHovered = hoveredSlug !== null;
    const isExpanded = expandedSlug === evt.slug;

    // Dimming logic for desktop: opacity and subtle scale shift
    const rowOpacity = isAnyHovered ? (isHovered ? 1 : 0.28) : 1;

    return (
      <article
        key={evt.slug}
        onMouseEnter={() => setHoveredSlug(evt.slug)}
        onMouseLeave={() => setHoveredSlug(null)}
        onFocus={() => setHoveredSlug(evt.slug)}
        onBlur={() => setHoveredSlug(null)}
        style={{
          opacity: rowOpacity,
          transform: isHovered ? "translate3d(8px, 0, 0)" : "none",
          transitionProperty: "opacity, transform, border-color",
          transitionDuration: "320ms",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className={`relative group border-b py-8 sm:py-10 transition-colors ${
          isHovered ? "border-white/40" : "border-white/[0.12]"
        }`}
      >
        <button
          type="button"
          onClick={() => toggleExpand(evt.slug)}
          aria-expanded={isExpanded}
          aria-controls={`event-detail-${evt.slug}`}
          className="w-full text-left focus-visible:outline-white cursor-pointer"
        >
          {/* Top Line: Numerical Index, Date, Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.16em] mb-3">
            <div className="flex items-center gap-3">
              <span className="text-white/40">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="text-white/70">{evt.dateLabel}</span>
            </div>

            <div className="flex items-center gap-2">
              <Diamond size={6} filled={isHovered || evt.status === "open"} />
              <span className={isHovered ? "text-white" : "text-white/70"}>
                {evt.status.replace("-", " ").toUpperCase()}
              </span>
            </div>
          </div>

          {/* Large Editorial Headline */}
          <h3
            className={`font-light tracking-tight leading-[1.08] transition-colors ${
              isHovered ? "text-white" : "text-white/90"
            }`}
            style={{
              fontSize: "clamp(26px, 4vw, 56px)",
              fontWeight: 300,
            }}
          >
            {evt.title}
          </h3>

          {/* Mode & Location */}
          <div className="mt-2.5 flex flex-wrap items-center gap-3 font-mono text-[11px] sm:text-[12px] text-white/50 uppercase tracking-[0.16em]">
            <span>{evt.mode}</span>
            <span>·</span>
            <span>{evt.location}</span>
          </div>

          {/* Summary / Description */}
          <p
            id={`event-detail-${evt.slug}`}
            className="mt-4 text-white/70 text-sm sm:text-base font-light max-w-3xl leading-relaxed"
          >
            {evt.summary}
          </p>
        </button>

        {/* Action Bar */}
        <div className="mt-6 flex items-center justify-between">
          {evt.registerUrl ? (
            <Magnetic maxOffset={6}>
              <a
                href={evt.registerUrl}
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors focus-visible:outline-white"
              >
                <span>REGISTER</span>
                <Diamond size={4} filled={true} />
              </a>
            </Magnetic>
          ) : (
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
              Registration TBA
            </span>
          )}

          {evt.placeholder && (
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">
              [PLACEHOLDER]
            </span>
          )}
        </div>

        {/* Desktop Preview Plane (Real Image or Refined Computational Blueprint) */}
        {isHovered && (
          <div
            aria-hidden="true"
            className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none z-10 w-72 h-44 border border-white/25 bg-neutral-950 shadow-2xl overflow-hidden"
            style={{
              animation: "fadeIn 220ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {evt.image ? (
              <Image
                src={evt.image}
                alt=""
                fill
                className="object-cover grayscale"
                sizes="288px"
              />
            ) : (
              <div className="w-full h-full p-4 flex flex-col justify-between select-none">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 border-b border-white/10 pb-2">
                  <span>CONVENING // NODE</span>
                  <Diamond size={4} filled={true} />
                </div>
                <div className="my-auto font-mono text-[11px] text-white/80 tracking-wider">
                  <div className="text-white font-medium truncate">{evt.title}</div>
                  <div className="text-white/40 mt-1 text-[10px] truncate">{evt.location}</div>
                </div>
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-white/40 border-t border-white/10 pt-2">
                  <span>MODE: {evt.mode}</span>
                  <span>{evt.dateLabel}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </article>
    );
  };

  return (
    <Section id="events" index="02" label="EVENTS" title="Convenings & Activity Index">
      {/* JSON-LD for Search Engines */}
      {schemaEvents.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaEvents) }}
        />
      )}

      {/* Editorial Index Header Note */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 max-w-md">
            Chronological calendar of colloquia, systems sessions, and research forums.
          </p>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            {activeEvents.length} UPCOMING · ACTIVE INDEX
          </span>
        </div>
      </Reveal>

      {/* Rows of Active Events */}
      <div className="flex flex-col">
        {activeEvents.map((evt, idx) => (
          <Reveal key={evt.slug} delay={idx * 60}>
            {renderEventRow(evt, idx)}
          </Reveal>
        ))}
      </div>

      {/* Collapsed Past Events Archive */}
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
            {pastEvents.map((evt, idx) => renderEventRow(evt, idx + activeEvents.length))}
          </div>
        </details>
      )}
    </Section>
  );
}
