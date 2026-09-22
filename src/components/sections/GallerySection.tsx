"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { Section } from "@/components/ui/Section";
import { Diamond } from "@/components/ui/Diamond";
import { Reveal } from "@/components/ui/Reveal";
import { GALLERY_ITEMS } from "@/content/gallery";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";
import { GalleryPhoto } from "@/types";

export function GallerySection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const [isPaused, setIsPaused] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const offsetRef = useRef(0);
  const contentWidthRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);

  // Measure track width
  const measure = useCallback(() => {
    if (!trackRef.current) return;
    const realChildren = trackRef.current.querySelectorAll<HTMLElement>(
      "[data-gallery-real='true']"
    );
    if (!realChildren.length) return;

    let totalWidth = 0;
    realChildren.forEach((child) => {
      totalWidth += child.offsetWidth + 36; // 36px gap
    });
    contentWidthRef.current = totalWidth;
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Smooth continuous auto-drift with GSAP ticker
  useEffect(() => {
    if (reducedMotion) return;

    const driftSpeed = 22; // px per second

    const tick = (_time: number, deltaTime: number) => {
      if (isPaused || isPointerDownRef.current || selectedPhoto !== null) return;
      const isSitePaused =
        document.documentElement.getAttribute("data-motion") === "paused";
      if (isSitePaused) return;

      const dt = deltaTime / 1000;
      offsetRef.current += driftSpeed * dt;

      if (contentWidthRef.current > 0) {
        if (offsetRef.current >= contentWidthRef.current) {
          offsetRef.current = offsetRef.current % contentWidthRef.current;
        } else if (offsetRef.current < 0) {
          offsetRef.current =
            (offsetRef.current % contentWidthRef.current) +
            contentWidthRef.current;
        }
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      }
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [isPaused, reducedMotion, selectedPhoto]);

  // Pointer drag controls for intuitive scrub
  const onPointerDown = (e: React.PointerEvent) => {
    if (reducedMotion) return;
    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    startOffsetRef.current = offsetRef.current;
    if (trackRef.current) {
      trackRef.current.style.cursor = "grabbing";
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    offsetRef.current = startOffsetRef.current - deltaX;

    if (contentWidthRef.current > 0) {
      if (offsetRef.current >= contentWidthRef.current) {
        offsetRef.current = offsetRef.current % contentWidthRef.current;
      } else if (offsetRef.current < 0) {
        offsetRef.current =
          (offsetRef.current % contentWidthRef.current) + contentWidthRef.current;
      }
    }

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
    }
  };

  const onPointerUp = () => {
    isPointerDownRef.current = false;
    if (trackRef.current) {
      trackRef.current.style.cursor = "grab";
    }
  };

  const handleStep = (direction: "left" | "right") => {
    const step = 460;
    offsetRef.current += direction === "right" ? step : -step;
    if (contentWidthRef.current > 0) {
      if (offsetRef.current >= contentWidthRef.current) {
        offsetRef.current = offsetRef.current % contentWidthRef.current;
      } else if (offsetRef.current < 0) {
        offsetRef.current =
          (offsetRef.current % contentWidthRef.current) + contentWidthRef.current;
      }
    }
    if (trackRef.current) {
      gsap.to(trackRef.current, {
        x: -offsetRef.current,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  };

  // Keyboard navigation for modal
  useEffect(() => {
    if (!selectedPhoto) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedPhoto]);

  const renderStreamItem = (photo: GalleryPhoto, idx: number, isClone: boolean = false) => {
    // Dynamic width & height variation for rich editorial pacing
    const isHeroic = idx % 3 === 0;
    const isPortrait = photo.height > photo.width;

    const widthClass = isHeroic
      ? "w-[480px] sm:w-[600px] lg:w-[680px]"
      : isPortrait
      ? "w-[300px] sm:w-[360px] lg:w-[400px]"
      : "w-[400px] sm:w-[480px] lg:w-[540px]";

    const heightClass = isHeroic
      ? "h-[360px] sm:h-[440px] lg:h-[480px]"
      : isPortrait
      ? "h-[420px] sm:h-[480px] lg:h-[520px]"
      : "h-[320px] sm:h-[380px] lg:h-[420px]";

    return (
      <div
        key={isClone ? `clone-${idx}` : `real-${idx}`}
        data-gallery-real={!isClone ? "true" : undefined}
        aria-hidden={isClone ? "true" : undefined}
        className={`shrink-0 flex flex-col justify-end ${widthClass} group select-none cursor-pointer`}
        onClick={() => setSelectedPhoto(photo)}
      >
        <div
          className={`relative ${heightClass} w-full overflow-hidden border border-white/20 bg-neutral-950 transition-all duration-300 group-hover:border-white/60 group-hover:scale-[1.01]`}
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            sizes="(max-width: 768px) 400px, 680px"
            loading="lazy"
          />

          {/* Datum Stamp */}
          <div className="absolute top-4 left-4 px-2.5 py-1 bg-black/80 border border-white/15 text-[10px] font-mono uppercase tracking-widest text-white/80 backdrop-blur-sm">
            FRAME // {String(idx + 1).padStart(2, "0")}
          </div>

          <div className="absolute top-4 right-4 px-2.5 py-1 bg-black/80 border border-white/15 text-[10px] font-mono uppercase tracking-widest text-white/80 backdrop-blur-sm">
            {photo.year || "2026"}
          </div>

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-95 transition-opacity pointer-events-none" />

          {/* Restrained Caption */}
          <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
            <h4 className="font-mono text-xs uppercase tracking-[0.16em] text-white font-medium truncate">
              {photo.alt}
            </h4>
            <p className="mt-1 text-xs text-white/70 font-light line-clamp-2">
              {photo.caption}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Section
      id="gallery"
      index="03"
      label="GALLERY"
      title="Visual Chronicle & Photographic Memory"
    >
      {/* Narrative Header */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 border-b border-white/[0.12] pb-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-white/50 mb-2 flex items-center gap-2">
              <Diamond size={5} filled={true} />
              <span>PHOTOGRAPHIC RECORD // REAL MEMORIES</span>
            </div>
            <p className="text-white/80 text-sm sm:text-base font-light max-w-xl">
              Authentic documentation from auditorium keynotes, late-night systems sprints, and
              chalkboard algorithm dissections. Click any frame for full-screen inspection.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Resume visual stream drift" : "Pause visual stream drift"}
              className="px-3.5 py-1.5 border border-white/20 hover:border-white text-white font-mono text-[11px] uppercase tracking-wider transition-colors inline-flex items-center gap-2 focus-visible:outline-white cursor-pointer"
            >
              <Diamond size={4} filled={!isPaused} />
              <span>{isPaused ? "STREAM PAUSED" : "DRIFT ACTIVE"}</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleStep("left")}
                aria-label="Scroll stream left"
                className="w-8 h-8 border border-white/20 hover:border-white text-white font-mono text-xs transition-colors flex items-center justify-center focus-visible:outline-white cursor-pointer"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => handleStep("right")}
                aria-label="Scroll stream right"
                className="w-8 h-8 border border-white/20 hover:border-white text-white font-mono text-xs transition-colors flex items-center justify-center focus-visible:outline-white cursor-pointer"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Horizontal Drifting / Scrubbable Photographic Stream */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden py-4 cursor-grab select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          ref={trackRef}
          className="flex items-end gap-9 will-change-transform"
          style={{ width: "max-content" }}
        >
          {GALLERY_ITEMS.map((item, idx) => renderStreamItem(item, idx, false))}
          {GALLERY_ITEMS.map((item, idx) => renderStreamItem(item, idx, true))}
        </div>
      </div>

      {/* Cinematic Full-Screen Photographic Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedPhoto.alt}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-6 sm:p-10 animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/[0.12] pb-4">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-white/60 flex items-center gap-2">
              <Diamond size={5} filled={true} />
              <span>PHOTOGRAPHIC ARCHIVE // {selectedPhoto.year || "2026"}</span>
            </div>

            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close full-screen image view"
              className="font-mono text-xs uppercase tracking-widest px-3 py-1.5 border border-white/30 hover:border-white text-white transition-colors cursor-pointer"
            >
              CLOSE [ESC] ✕
            </button>
          </div>

          {/* Grand Image Focus */}
          <div
            className="relative my-auto max-w-5xl w-full h-[65vh] mx-auto overflow-hidden border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            >
            </Image>
          </div>

          {/* Bottom Captions */}
          <div
            className="max-w-3xl mx-auto text-center space-y-2 pt-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-mono text-base uppercase tracking-wider text-white">
              {selectedPhoto.alt}
            </h3>
            <p className="text-sm font-light text-white/70 leading-relaxed">
              {selectedPhoto.caption}
            </p>
          </div>
        </div>
      )}
    </Section>
  );
}
