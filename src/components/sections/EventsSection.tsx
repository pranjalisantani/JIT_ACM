"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Diamond } from "@/components/ui/Diamond";
import { Reveal } from "@/components/ui/Reveal";
import { EVENTS_DATA } from "@/content/events";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";
import { gsap } from "@/lib/motion/gsap";

const EVENT_BACKGROUNDS: Record<string, string> = {
  "ebpf-kernel-systems-colloquium": "/gallery/gal-01.jpg",
  "distributed-consensus-raft-workshop": "/gallery/gal-02.jpg",
  "zkp-cryptography-seminar": "/gallery/gal-05.jpg",
  "winter-hackathon-2027": "/gallery/gal-04.jpg",
  "formal-verification-tla-retrospective": "/gallery/gal-03.jpg",
};

export function EventsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const currentEvent = EVENTS_DATA[activeIndex] || EVENTS_DATA[0];
  const totalEvents = EVENTS_DATA.length;

  // JSON-LD structured data for search engines
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

  // Animated transition to a target event index
  const goToEvent = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activeIndex || targetIndex < 0 || targetIndex >= totalEvents) return;

      if (reducedMotion || !stageRef.current) {
        setActiveIndex(targetIndex);
        return;
      }

      // GSAP transform between event stages
      gsap.to(stageRef.current, {
        opacity: 0,
        y: -16,
        duration: 0.28,
        ease: "power2.in",
        onComplete: () => {
          setActiveIndex(targetIndex);
          if (stageRef.current) {
            gsap.fromTo(
              stageRef.current,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
            );
          }
        },
      });
    },
    [activeIndex, reducedMotion, totalEvents]
  );

  const nextEvent = useCallback(() => {
    const next = (activeIndex + 1) % totalEvents;
    goToEvent(next);
  }, [activeIndex, totalEvents, goToEvent]);

  const prevEvent = useCallback(() => {
    const prev = (activeIndex - 1 + totalEvents) % totalEvents;
    goToEvent(prev);
  }, [activeIndex, totalEvents, goToEvent]);

  // Auto progression with pause on interaction
  useEffect(() => {
    if (reducedMotion || isPaused) {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
      return;
    }

    // Animate progress bar across 7 seconds
    if (progressBarRef.current) {
      gsap.fromTo(
        progressBarRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 7.0,
          ease: "none",
          transformOrigin: "left center",
        }
      );
    }

    autoPlayTimerRef.current = setTimeout(() => {
      const next = (activeIndex + 1) % totalEvents;
      goToEvent(next);
    }, 7000);

    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [activeIndex, isPaused, reducedMotion, totalEvents, goToEvent]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      nextEvent();
    } else if (e.key === "ArrowLeft") {
      prevEvent();
    }
  };

  const bgImage = EVENT_BACKGROUNDS[currentEvent.slug] || "/gallery/gal-01.jpg";

  return (
    <Section
      id="events"
      index="02"
      label="EVENTS"
      title="Convenings & Activity Index"
    >
      {schemaEvents.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaEvents) }}
        />
      )}

      {/* Header Narrative Bar */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-white/[0.12] pb-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-white/50 mb-2 flex items-center gap-2">
              <Diamond size={5} filled={true} />
              <span>STAGE NARRATIVE // TIMELINE</span>
            </div>
            <p className="text-white/80 text-sm sm:text-base font-light max-w-xl">
              A cinematic progression of colloquia, systems sprints, and research forums.
              Experience our history and upcoming gatherings as one continuous journey.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              STAGE {String(activeIndex + 1).padStart(2, "0")} / {String(totalEvents).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Resume event progression" : "Pause event progression"}
              className="px-3 py-1.5 border border-white/20 hover:border-white text-white font-mono text-[10px] uppercase tracking-widest transition-colors inline-flex items-center gap-2 focus-visible:outline-white cursor-pointer"
            >
              <Diamond size={4} filled={!isPaused} />
              <span>{isPaused ? "PAUSED" : "AUTO STREAM"}</span>
            </button>
          </div>
        </div>
      </Reveal>

      {/* Single Dominant Event Stage Container */}
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        className="relative w-full border border-white/[0.14] bg-neutral-950/80 overflow-hidden focus:outline-none focus:ring-1 focus:ring-white/40"
        aria-label="Dominant Event Stage. Use Arrow Left and Right to navigate events."
      >
        {/* Subtle Background Ambience using authentic photo */}
        <div className="absolute inset-0 pointer-events-none opacity-20 transition-opacity duration-700">
          <Image
            src={bgImage}
            alt=""
            fill
            className="object-cover filter grayscale contrast-125 mix-blend-screen"
            sizes="(max-width: 1440px) 100vw, 1440px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
        </div>

        {/* Progress Bar indicating auto-advancement */}
        <div className="relative w-full h-[2px] bg-white/[0.08] overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full bg-white/60 origin-left"
            style={{ width: "100%", transform: "scaleX(0)" }}
          />
        </div>

        {/* Dynamic Event Content Stage */}
        <div
          ref={stageRef}
          aria-live="polite"
          className="relative z-10 p-6 sm:p-10 lg:p-14 min-h-[460px] flex flex-col justify-between"
        >
          {/* Top Meta Details */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.10] pb-6">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
              <span className="text-white/40">SYS.EVT.{String(activeIndex + 1).padStart(2, "0")}</span>
              <span>·</span>
              <span
                className={`px-2.5 py-0.5 border text-[10px] tracking-widest ${
                  currentEvent.status === "open"
                    ? "border-white/30 text-white bg-white/[0.06]"
                    : currentEvent.status === "closing-soon"
                    ? "border-amber-400/40 text-amber-300 bg-amber-400/[0.06]"
                    : "border-white/15 text-white/40 bg-transparent"
                }`}
              >
                {currentEvent.status.replace("-", " ").toUpperCase()}
              </span>
            </div>

            <div className="font-mono text-sm text-white/90 tracking-wider">
              {currentEvent.dateLabel}
            </div>
          </div>

          {/* Main Editorial Presentation */}
          <div className="my-8 max-w-4xl space-y-5">
            <h3
              className="text-3xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.08]"
              style={{ fontWeight: 300 }}
            >
              {currentEvent.title}
            </h3>

            <div className="flex flex-wrap items-center gap-2 font-mono text-xs sm:text-sm text-white/60 uppercase tracking-[0.16em]">
              <span className="text-white/90">{currentEvent.mode}</span>
              <span>·</span>
              <span>{currentEvent.location}</span>
            </div>

            <p className="text-white/75 text-base sm:text-lg font-light leading-relaxed max-w-3xl pt-2">
              {currentEvent.summary}
            </p>
          </div>

          {/* Stage Controls & Action CTA */}
          <div className="pt-6 border-t border-white/[0.10] flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevEvent}
                aria-label="Previous event in timeline"
                className="w-10 h-10 border border-white/20 hover:border-white text-white flex items-center justify-center font-mono text-sm transition-colors cursor-pointer focus-visible:outline-white"
              >
                ←
              </button>
              <button
                type="button"
                onClick={nextEvent}
                aria-label="Next event in timeline"
                className="w-10 h-10 border border-white/20 hover:border-white text-white flex items-center justify-center font-mono text-sm transition-colors cursor-pointer focus-visible:outline-white"
              >
                →
              </button>
              <span className="ml-3 font-mono text-[11px] uppercase tracking-widest text-white/40 hidden sm:inline-block">
                OR USE ARROW KEYS [← / →]
              </span>
            </div>

            {currentEvent.status !== "past" && currentEvent.registerUrl ? (
              <a
                href={currentEvent.registerUrl}
                aria-label={`Register for ${currentEvent.title}`}
                className="font-mono text-xs uppercase tracking-[0.2em] px-6 py-3 border border-white bg-white text-black hover:bg-neutral-200 transition-colors inline-flex items-center gap-2 focus-visible:outline-white"
              >
                <span>REGISTER FORUM</span>
                <span>→</span>
              </a>
            ) : (
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-white/35 py-2">
                ARCHIVED SESSION DISPATCH
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Timeline Stepper / Scrub Matrix */}
      <div className="mt-8 border-t border-white/[0.12] pt-6">
        <div className="flex items-center justify-between mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
          <span>TIMELINE INDEX</span>
          <span>SELECT TO INSPECT MOMENT</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {EVENTS_DATA.map((evt, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={evt.slug}
                type="button"
                onClick={() => goToEvent(idx)}
                className={`text-left p-3.5 border transition-all duration-200 cursor-pointer focus-visible:outline-white ${
                  isCurrent
                    ? "border-white bg-white/[0.08] text-white"
                    : "border-white/[0.10] bg-black/40 text-white/50 hover:border-white/30 hover:text-white/80"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider mb-1.5">
                  <span className={isCurrent ? "text-white" : "text-white/40"}>
                    0{idx + 1}
                  </span>
                  <Diamond size={4} filled={isCurrent} />
                </div>
                <div className="font-mono text-xs truncate leading-snug font-medium">
                  {evt.title}
                </div>
                <div className="mt-1 text-[10px] font-mono text-white/40 uppercase truncate">
                  {evt.dateLabel.split("·")[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
