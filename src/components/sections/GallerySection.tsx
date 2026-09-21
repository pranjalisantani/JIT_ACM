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

  const [isManualPaused, setIsManualPaused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [centerIdx, setCenterIdx] = useState<number>(0);

  const offsetRef = useRef(0);
  const contentWidthRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const startXRef = useRef(0);
  const startOffsetRef = useRef(0);
  const itemPositionsRef = useRef<number[]>([]);

  // Update cached layout metrics on resize
  const measure = useCallback(() => {
    if (!trackRef.current) return;
    const realChildren = trackRef.current.querySelectorAll<HTMLElement>("[data-gallery-real='true']");
    if (!realChildren.length) return;

    let totalWidth = 0;
    const positions: number[] = [];

    realChildren.forEach((child) => {
      positions.push(child.offsetLeft);
      totalWidth += child.offsetWidth + 24; // 24px gap
    });

    itemPositionsRef.current = positions;
    contentWidthRef.current = totalWidth;
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Handle auto-drift with GSAP ticker
  useEffect(() => {
    if (reducedMotion) return;

    const driftSpeed = 22; // px per second

    const tick = (time: number, deltaTime: number) => {
      if (isManualPaused || isInteracting) return;
      const isSitePaused = document.documentElement.getAttribute("data-motion") === "paused";
      if (isSitePaused) return;

      const dt = deltaTime / 1000;
      offsetRef.current += driftSpeed * dt;

      if (contentWidthRef.current > 0) {
        if (offsetRef.current >= contentWidthRef.current) {
          offsetRef.current = offsetRef.current % contentWidthRef.current;
        } else if (offsetRef.current < 0) {
          offsetRef.current = (offsetRef.current % contentWidthRef.current) + contentWidthRef.current;
        }
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      }

      // Calculate center emphasis without DOM layout reads
      if (containerRef.current && itemPositionsRef.current.length > 0) {
        const viewportCenter = containerRef.current.offsetWidth / 2;
        const currentRelativeCenter = (offsetRef.current + viewportCenter) % (contentWidthRef.current || 1);
        let closestDist = Infinity;
        let closestIndex = 0;

        itemPositionsRef.current.forEach((pos, idx) => {
          const dist = Math.abs(pos - currentRelativeCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closestIndex = idx;
          }
        });

        setCenterIdx(closestIndex);
      }
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
    };
  }, [reducedMotion, isManualPaused, isInteracting]);

  // Restart drift 2.5s after interaction ends
  const markInteraction = useCallback(() => {
    setIsInteracting(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 2500);
  }, []);

  // Pointer drag controls (with touch-action: pan-y)
  const onPointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    startXRef.current = e.clientX;
    startOffsetRef.current = offsetRef.current;
    markInteraction();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const dx = e.clientX - startXRef.current;
    offsetRef.current = startOffsetRef.current - dx;

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
    }
    markInteraction();
  };

  const onPointerUp = () => {
    isPointerDownRef.current = false;
  };

  // Horizontal wheel handler
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      offsetRef.current += e.deltaX;
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
      }
      markInteraction();
    }
  };

  // Non-drag alternatives (Previous / Next / Arrow keys)
  const stepOffset = (direction: "prev" | "next") => {
    markInteraction();
    const step = 320;
    offsetRef.current += direction === "next" ? step : -step;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(-${offsetRef.current}px, 0, 0)`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      stepOffset("next");
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      stepOffset("prev");
    }
  };

  const renderPhotoCard = (photo: GalleryPhoto, idx: number, isClone = false) => {
    const isCenter = !isClone && centerIdx === idx;
    const aspectStyles: Record<string, string> = {
      "4:5": "w-[260px] sm:w-[300px] h-[325px] sm:h-[375px]",
      "1:1": "w-[280px] sm:w-[320px] h-[280px] sm:h-[320px]",
      "16:10": "w-[360px] sm:w-[440px] h-[225px] sm:h-[275px]",
      "3:4": "w-[270px] sm:w-[300px] h-[360px] sm:h-[400px]",
    };

    // Derive aspect ratio from width and height
    const ratioVal = photo.width / photo.height;
    let aspectClass = aspectStyles["16:10"];
    if (Math.abs(ratioVal - 0.8) < 0.05) aspectClass = aspectStyles["4:5"];
    else if (Math.abs(ratioVal - 1.0) < 0.05) aspectClass = aspectStyles["1:1"];
    else if (Math.abs(ratioVal - 0.75) < 0.05) aspectClass = aspectStyles["3:4"];

    return (
      <div
        key={isClone ? `clone-${idx}` : `real-${idx}`}
        data-gallery-real={!isClone ? "true" : undefined}
        aria-hidden={isClone ? "true" : undefined}
        className={`shrink-0 flex flex-col justify-end transition-opacity duration-300 ${
          isCenter ? "opacity-100" : "opacity-75 hover:opacity-100"
        }`}
      >
        <div
          className={`relative rounded-md overflow-hidden bg-neutral-900 border border-white/10 ${aspectClass}`}
        >
          {photo.src && !photo.placeholder ? (
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 300px, 440px"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white/40">
              <span className="font-mono text-xs uppercase tracking-[0.2em] mb-2 text-white/60">
                Photo
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">
                {photo.alt}
              </span>
            </div>
          )}

          {photo.year && (
            <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/70 border border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/70">
              {photo.year}
            </div>
          )}
        </div>

        {/* Caption */}
        {!isClone && (
          <div className="mt-3 max-w-[280px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/80 line-clamp-1">
              {photo.alt}
            </p>
            {photo.caption && (
              <p className="font-light text-xs text-white/50 line-clamp-2 mt-0.5">
                {photo.caption}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Section id="gallery" index="03" label="GALLERY" title="Visual Documentation & Memory Stream">
      {/* Header with Accessibility Controls */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 max-w-md">
              A continuous, chronological visual stream recording student colloquia, hackathons, and research build sessions.
            </p>
          </div>

          {/* Controls: Pause / Play & Step Prev / Next */}
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em]">
            <button
              type="button"
              onClick={() => setIsManualPaused(!isManualPaused)}
              className="px-3 py-1.5 border border-white/20 hover:border-white text-white/80 hover:text-white transition-colors flex items-center gap-2 cursor-pointer focus-visible:outline-white"
              aria-label={isManualPaused ? "Resume visual stream drift" : "Pause visual stream drift"}
            >
              <Diamond size={5} filled={!isManualPaused} />
              <span>{isManualPaused ? "PLAY" : "PAUSE"}</span>
            </button>

            <button
              type="button"
              onClick={() => stepOffset("prev")}
              className="px-3 py-1.5 border border-white/20 hover:border-white text-white/80 hover:text-white transition-colors cursor-pointer focus-visible:outline-white"
              aria-label="Previous gallery image"
            >
              ←
            </button>

            <button
              type="button"
              onClick={() => stepOffset("next")}
              className="px-3 py-1.5 border border-white/20 hover:border-white text-white/80 hover:text-white transition-colors cursor-pointer focus-visible:outline-white"
              aria-label="Next gallery image"
            >
              →
            </button>
          </div>
        </div>
      </Reveal>

      {/* Gallery Track Container */}
      <div
        ref={containerRef}
        tabIndex={0}
        role="region"
        aria-label="Continuous memory stream. Use Left and Right arrow keys to navigate."
        onKeyDown={handleKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onWheel={onWheel}
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => markInteraction()}
        onFocus={() => setIsInteracting(true)}
        onBlur={() => markInteraction()}
        className={`relative w-full overflow-hidden select-none cursor-grab active:cursor-grabbing focus-visible:outline-white py-4 ${
          reducedMotion ? "overflow-x-auto scrollbar-none" : ""
        }`}
        style={{ touchAction: "pan-y" }}
      >
        <div
          ref={trackRef}
          className="flex items-end gap-6 w-max"
          style={{
            willChange: "transform",
          }}
        >
          {/* Primary Real DOM Items */}
          {GALLERY_ITEMS.map((photo, idx) => renderPhotoCard(photo, idx, false))}

          {/* Cloned Items for seamless continuous looping (bounded to 2x items) */}
          {!reducedMotion &&
            GALLERY_ITEMS.map((photo, idx) => renderPhotoCard(photo, idx, true))}
        </div>
      </div>
    </Section>
  );
}
