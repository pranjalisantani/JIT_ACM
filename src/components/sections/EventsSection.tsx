"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Diamond } from "@/components/ui/Diamond";
import { EVENTS_DATA } from "@/content/events";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";
import { registerScrollTrigger, gsap } from "@/lib/motion/gsap";

interface ParsedDate {
  month: string;
  day: string;
  year: string;
  time: string;
  dayOfWeek: string;
}

function parseEventDate(dateLabel: string, dateISO: string | null): ParsedDate {
  // Extract month, day, year, time from dateLabel (e.g. "OCT 28, 2026 · 17:30 IST")
  const parts = dateLabel.split("·");
  const datePart = parts[0]?.trim() || "";
  const timePart = parts[1]?.trim() || "";

  const subParts = datePart.split(" ");
  const month = subParts[0] || "DATE";
  const day = (subParts[1] || "--").replace(",", "");
  const year = subParts[2] || "2026";

  let dayOfWeek = "SESSION";
  if (dateISO) {
    try {
      const d = new Date(dateISO);
      const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      dayOfWeek = days[d.getUTCDay()] || "SESSION";
    } catch {
      dayOfWeek = "SESSION";
    }
  }

  return { month, day, year, time: timePart, dayOfWeek };
}

export function EventsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const scrollTrackRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const totalEvents = EVENTS_DATA.length;
  const currentEvent = EVENTS_DATA[activeIndex] || EVENTS_DATA[0];
  const parsedDates = EVENTS_DATA.map((evt) => parseEventDate(evt.dateLabel, evt.dateISO));
  const activeParsed = parsedDates[activeIndex] || parsedDates[0];

  // Schema.org structured metadata for events
  const schemaEvents = EVENTS_DATA.filter((e) => Boolean(e.dateISO)).map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: e.dateISO,
    description: e.summary,
    eventAttendanceMode: e.mode.toLowerCase().includes("stream")
      ? "https://schema.org/MixedEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: e.location,
    },
  }));

  // Scroll entrance animation
  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const isPaused = document.documentElement.getAttribute("data-motion") === "paused";
    if (isPaused) return;

    const ScrollTrigger = registerScrollTrigger();
    if (!ScrollTrigger) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0.35, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "top 40%",
            scrub: 0.6,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTransitioning = useRef<boolean>(false);

  // User-driven or automated selection of a date
  const selectDate = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activeIndex || targetIndex < 0 || targetIndex >= totalEvents) return;
      if (isTransitioning.current) return;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("acm:field-focus", {
            detail: { region: "events" },
          })
        );
      }

      if (reducedMotion || !stageRef.current) {
        setActiveIndex(targetIndex);
        return;
      }

      // Subtle, high-end editorial crossfade reusing established transition
      isTransitioning.current = true;
      gsap.to(stageRef.current, {
        opacity: 0,
        y: -6,
        duration: 0.16,
        ease: "power2.in",
        onComplete: () => {
          setActiveIndex(targetIndex);
          if (stageRef.current) {
            gsap.fromTo(
              stageRef.current,
              { opacity: 0, y: 8 },
              {
                opacity: 1,
                y: 0,
                duration: 0.28,
                ease: "power2.out",
                onComplete: () => {
                  isTransitioning.current = false;
                },
              }
            );
          } else {
            isTransitioning.current = false;
          }
        },
      });
    },
    [activeIndex, reducedMotion, totalEvents]
  );

  // Automatic event progression cycling through existing events
  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (reducedMotion) return;

    timerRef.current = setTimeout(() => {
      selectDate((activeIndex + 1) % totalEvents);
    }, 5000);
  }, [activeIndex, reducedMotion, selectDate, totalEvents]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, startTimer]);

  // Ensure active date tab card stays visible in horizontal overflow track
  useEffect(() => {
    if (scrollTrackRef.current) {
      const activeBtn = scrollTrackRef.current.children[activeIndex] as HTMLElement | undefined;
      if (activeBtn && scrollTrackRef.current.scrollWidth > scrollTrackRef.current.clientWidth) {
        activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    }
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      selectDate((activeIndex + 1) % totalEvents);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      selectDate((activeIndex - 1 + totalEvents) % totalEvents);
    }
  };

  return (
    <section
      id="events"
      ref={sectionRef}
      aria-label="04 / Events: Academic Sessions and Systems Colloquia Calendar"
      className="relative w-full text-white bg-transparent py-16 sm:py-20 lg:py-24 px-6 sm:px-10 lg:px-16 select-none"
    >
      {schemaEvents.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaEvents) }}
        />
      )}

      <div className="w-full max-w-[1440px] mx-auto flex flex-col">
        {/* Top Architectural Datum Hairline */}
        <div className="flex items-center justify-between font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-white/40 pb-5 border-b border-white/[0.10] mb-8 sm:mb-10">
          <div className="flex items-center gap-3">
            <Diamond size={5} filled={true} className="text-sky-400/80" />
            <span className="text-white/80 font-medium">04 / EVENTS</span>
            <span className="text-white/30 hidden sm:inline">·</span>
            <span className="text-white/50 hidden sm:inline">CONVENINGS & SYMPOSIA</span>
          </div>

          <div className="flex items-center gap-4 text-white/40 font-mono text-[10px]">
            <span className="hidden md:inline-block">CALENDAR MATRIX</span>
            <span className="text-sky-300/70">+ [CAL.NODE // 2026–2027]</span>
          </div>
        </div>

        {/* Section Header: Editorial & Restrained */}
        <div className="pb-6 sm:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl">
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-sky-300/75 mb-2.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              <span>INTERACTIVE SCHEDULE // ACADEMIC TIMELINE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-tight uppercase leading-[1.15]">
              Collective Inquiry on the Machine Frontier
            </h2>

            <p className="mt-2 text-xs sm:text-sm font-mono text-white/50 max-w-2xl leading-relaxed uppercase tracking-[0.14em]">
              Select a date along the timeline to inspect schedule details, technical proceedings, and session venues.
            </p>
          </div>

          {/* Active Calendar Counter Badge */}
          <div className="flex items-center gap-3 self-start md:self-end font-mono text-[11px] uppercase tracking-[0.2em] border border-white/15 px-3 py-1.5 bg-black/40 backdrop-blur-sm">
            <span className="text-sky-300">ACTIVE FORUM</span>
            <span className="text-white/30">|</span>
            <span className="text-white/80">
              {String(activeIndex + 1).padStart(2, "0")} / {String(totalEvents).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            MAIN VISUAL ANCHOR: HORIZONTAL DATE / CALENDAR SYSTEM
        ───────────────────────────────────────────────────────────── */}
        <div className="relative w-full border-t border-b border-white/[0.12] py-3.5 sm:py-5 mb-6 sm:mb-8">
          {/* Calendar Rail Subheader */}
          <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-white/35 pb-2.5 px-1 border-b border-white/[0.06] mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <span>SCHEDULED HORIZON</span>
              <span>·</span>
              <span className="text-sky-300/60">2026 — 2027</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block">NAVIGATE: [← / →] OR CLICK DATE</span>
              <span className="text-white/20 sm:hidden">SWIPE DATES →</span>
            </div>
          </div>

          {/* Spatial Date Track */}
          <div
            ref={scrollTrackRef}
            role="tablist"
            aria-label="Calendar Timeline Date Track"
            className="flex sm:grid sm:grid-cols-5 gap-2.5 sm:gap-3.5 overflow-x-auto snap-x scrollbar-none pb-2 sm:pb-0 -mx-2 px-2 sm:mx-0 sm:px-0"
          >
            {EVENTS_DATA.map((evt, idx) => {
              const isSelected = idx === activeIndex;
              const date = parsedDates[idx];
              const isPast = evt.status === "past";
              const isClosingSoon = evt.status === "closing-soon";

              return (
                <button
                  key={evt.slug}
                  role="tab"
                  type="button"
                  id={`tab-${evt.slug}`}
                  aria-selected={isSelected}
                  aria-controls={`panel-${evt.slug}`}
                  onClick={() => selectDate(idx)}
                  className={`group relative text-left p-3.5 sm:p-5 border transition-all duration-200 cursor-pointer snap-start flex-shrink-0 min-w-[155px] sm:min-w-0 focus-visible:outline-sky-400 backdrop-blur-md ${
                    isSelected
                      ? "border-sky-400/80 bg-sky-950/30 text-white shadow-[0_0_24px_rgba(56,189,248,0.12)]"
                      : "border-white/[0.10] bg-neutral-950/60 text-white/45 hover:border-white/25 hover:text-white/80 hover:bg-neutral-900/50"
                  }`}
                >
                  {/* Top: Month & Year bracket */}
                  <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] mb-2">
                    <span className={isSelected ? "text-sky-300 font-medium" : "text-white/40"}>
                      {date.month} &apos;{date.year.slice(2)}
                    </span>

                    {/* Status Dot */}
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isPast
                          ? "bg-white/25"
                          : isClosingSoon
                          ? "bg-amber-400 animate-pulse"
                          : "bg-sky-400"
                      }`}
                    />
                  </div>

                  {/* Center: Large Spatial Date Numeral */}
                  <div className="my-1 sm:my-2">
                    <div
                      className={`text-2xl sm:text-4xl lg:text-5xl font-light tracking-tighter leading-none transition-colors duration-200 ${
                        isSelected ? "text-white font-normal" : "text-white/60 group-hover:text-white/90"
                      }`}
                    >
                      {date.day}
                    </div>
                  </div>

                  {/* Bottom: Day of Week & Timing */}
                  <div className="mt-2 pt-2 border-t border-white/[0.08] flex items-center justify-between font-mono text-[8px] sm:text-[9px] uppercase tracking-wider">
                    <span className={isSelected ? "text-sky-200/90" : "text-white/40"}>
                      {date.dayOfWeek}
                    </span>
                    <span className="text-white/30 truncate ml-1">
                      {date.time.split(" ")[0]}
                    </span>
                  </div>

                  {/* Active Anchor Baseline Hairline */}
                  {isSelected && (
                    <div
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-sky-400"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            BELOW CALENDAR: SELECTED EVENT EDITORIAL DOSSIER STAGE
        ───────────────────────────────────────────────────────────── */}
        <div
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="region"
          aria-label="Selected Event Dossier. Use left and right arrow keys to browse dates."
          className="relative w-full border border-white/[0.12] bg-neutral-950/75 backdrop-blur-md overflow-hidden focus:outline-none focus:ring-1 focus:ring-sky-400/50"
        >
          {/* Subtle Lateral Luminescence Accent */}
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-96 h-96 bg-sky-500/[0.03] rounded-full blur-3xl pointer-events-none"
          />

          <div
            ref={stageRef}
            id={`panel-${currentEvent.slug}`}
            role="tabpanel"
            aria-labelledby={`tab-${currentEvent.slug}`}
            className="relative z-10 p-6 sm:p-8 lg:p-10 min-h-[320px] flex flex-col justify-between"
          >
            {/* Top Dossier Technical Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.10] pb-4 sm:pb-5">
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em]">
                <span className="text-white/40">
                  SYS.EVT.{String(activeIndex + 1).padStart(2, "0")}
                </span>
                <span className="text-white/20">/</span>
                <span
                  className={`px-2.5 py-0.5 border text-[10px] tracking-widest font-mono uppercase ${
                    currentEvent.status === "open"
                      ? "border-sky-400/40 text-sky-300 bg-sky-500/[0.08]"
                      : currentEvent.status === "closing-soon"
                      ? "border-amber-400/40 text-amber-300 bg-amber-400/[0.08]"
                      : "border-white/15 text-white/40 bg-white/[0.02]"
                  }`}
                >
                  {currentEvent.status === "closing-soon"
                    ? "CLOSING SOON"
                    : currentEvent.status === "open"
                    ? "OPEN FOR RSVP"
                    : "ARCHIVED SESSION"}
                </span>
              </div>

              {/* Exact Date & Time Label */}
              <div className="font-mono text-xs sm:text-sm text-sky-200/90 tracking-[0.16em]">
                {currentEvent.dateLabel}
              </div>
            </div>

            {/* Center: Massive Dominating Event Title & Supporting Meta */}
            <div className="my-6 sm:my-7 max-w-5xl space-y-3 sm:space-y-4">
              <div className="font-mono text-xs text-sky-400/80 uppercase tracking-[0.2em] flex items-center gap-2">
                <Diamond size={4} filled={true} className="text-sky-400" />
                <span>{currentEvent.mode}</span>
              </div>

              <h3 className="text-2xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-[1.1] uppercase">
                {currentEvent.title}
              </h3>

              <div className="pt-2 flex flex-wrap items-center gap-3 font-mono text-xs text-white/50 uppercase tracking-[0.16em]">
                <span className="text-white/80">{currentEvent.location}</span>
                <span>·</span>
                <span>{activeParsed.dayOfWeek} SESSIONS</span>
              </div>

              {/* Concise Summary — Derived Strictly from Existing Data */}
              <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed max-w-3xl pt-2">
                {currentEvent.summary}
              </p>
            </div>

            {/* Bottom: Action Rail & Step Controls */}
            <div className="pt-6 border-t border-white/[0.10] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => selectDate((activeIndex - 1 + totalEvents) % totalEvents)}
                  aria-label="Previous calendar event"
                  className="px-3 py-2 border border-white/20 hover:border-white text-white/70 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span>←</span>
                  <span className="text-[10px] tracking-wider uppercase">PREV</span>
                </button>

                <button
                  type="button"
                  onClick={() => selectDate((activeIndex + 1) % totalEvents)}
                  aria-label="Next calendar event"
                  className="px-3 py-2 border border-white/20 hover:border-white text-white/70 hover:text-white transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span className="text-[10px] tracking-wider uppercase">NEXT</span>
                  <span>→</span>
                </button>

                <span className="text-[10px] text-white/30 uppercase tracking-widest hidden md:inline ml-2">
                  USE KEYBOARD [← / →] TO TRAVERSE
                </span>
              </div>

              {/* Action CTA */}
              <div className="flex items-center gap-4">
                {currentEvent.status !== "past" && currentEvent.registerUrl ? (
                  <a
                    href={currentEvent.registerUrl}
                    aria-label={`Register for ${currentEvent.title}`}
                    className="font-mono text-xs uppercase tracking-[0.2em] px-7 py-3 border border-sky-300 bg-sky-300 text-black hover:bg-white hover:border-white transition-colors inline-flex items-center gap-2 font-medium"
                  >
                    <span>REGISTER FORUM</span>
                    <span>→</span>
                  </a>
                ) : (
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-white/40 border border-white/10 px-5 py-2.5 bg-white/[0.02]">
                    ARCHIVED SESSION · TRANSCRIPT IN REPOSITORY
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
