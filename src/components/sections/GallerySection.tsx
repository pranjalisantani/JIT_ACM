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
      totalWidth += child.offsetWidth + 32; // 32px gap
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

    const driftSpeed = 24; // px per second

    const tick = (time: number, deltaTime: number) => {
      if (isPaused || isPointerDownRef.current) return;
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
  }, [isPaused, reducedMotion]);

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
    const step = 420;
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
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  const renderStreamItem = (photo: GalleryPhoto, idx: number, isClone: boolean = false) => {
    // Dynamic width based on aspect ratio
    const widthStyle =
      photo.width > photo.height
        ? "w-[440px] sm:w-[540px]"
        : photo.width === photo.height
        ? "w-[360px] sm:w-[420px]"
        : "w-[320px] sm:w-[380px]";

    return (
      <div
        key={isClone ? `clone-${idx}` : `real-${idx}`}
        data-gallery-real={!isClone ? "true" : undefined}
        aria-hidden={isClone ? "true" : undefined}
        className={`shrink-0 flex flex-col justify-end ${widthStyle} group select-none`}
      >
        {/* Photo Container: Retains rich authentic natural color */}
        <div className="relative h-[340px] sm:h-[400px] w-full overflow-hidden border border-white/20 bg-neutral-950 transition-all duration-300 group-hover:border-white/50">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 380px, 540px"
            loading="lazy"
          />

          {/* Year Badge */}
          <div className="absolute top-4 right-4 px-2.5 py-1 bg-black/75 border border-white/15 text-[10px] font-mono uppercase tracking-widest text-white/80 backdrop-blur-sm">
            {photo.year || "2026"}
          </div>

          {/* Subtle Bottom Vignette on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity pointer-events-none" />

          {/* Quick Caption Overlay on Hover */}
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
      title="Visual Chronicle & Memory Stream"
    >
      {/* Header with Narrative Description & Stream Controls */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 border-b border-white/[0.12] pb-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 max-w-md">
            A continuous photographic record documenting student research, lab sessions, whiteboard proofs, and night hackathons.
          </p>

          <div className="flex items-center gap-4">
            {/* Pause / Resume Button */}
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Resume visual stream drift" : "Pause visual stream drift"}
              className="px-3.5 py-1.5 border border-white/20 hover:border-white text-white font-mono text-[11px] uppercase tracking-wider transition-colors inline-flex items-center gap-2 focus-visible:outline-white cursor-pointer"
            >
              <Diamond size={4} filled={!isPaused} />
              <span>{isPaused ? "STREAM PAUSED" : "STREAM ACTIVE"}</span>
            </button>

            {/* Step Left / Right Controls */}
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
          className="flex items-center gap-8 will-change-transform"
          style={{ width: "max-content" }}
        >
          {/* Primary Set */}
          {GALLERY_ITEMS.map((item, idx) => renderStreamItem(item, idx, false))}
          {/* Seamless Infinite Clone Set */}
          {GALLERY_ITEMS.map((item, idx) => renderStreamItem(item, idx, true))}
        </div>
      </div>
    </Section>
  );
}
