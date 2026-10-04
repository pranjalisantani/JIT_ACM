"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { gsap } from "@/lib/motion/gsap";
import { Diamond } from "@/components/ui/Diamond";
import { GALLERY_ITEMS } from "@/content/gallery";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";
import { GalleryPhoto } from "@/types";

// Determine aspect label from dimensions
function getCardAspect(width: number, height: number): "16:9" | "4:3" | "3:4" | "1:1" {
  const ratio = width / height;
  if (ratio > 1.5) return "16:9";
  if (ratio > 1.15) return "4:3";
  if (ratio < 0.85) return "3:4";
  return "1:1";
}

// Responsive card width classes based on aspect ratio
function getCardWidthClass(aspect: "16:9" | "4:3" | "3:4" | "1:1"): string {
  switch (aspect) {
    case "16:9":
      return "w-[320px] sm:w-[480px] md:w-[540px] lg:w-[620px]";
    case "4:3":
      return "w-[270px] sm:w-[380px] md:w-[420px] lg:w-[480px]";
    case "3:4":
      return "w-[170px] sm:w-[220px] md:w-[245px] lg:w-[275px]";
    case "1:1":
    default:
      return "w-[220px] sm:w-[290px] md:w-[320px] lg:w-[365px]";
  }
}

interface StreamItemData {
  photo: GalleryPhoto;
  originalIndex: number;
  setIndex: number;
  key: string;
}

export function GallerySection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  const reducedMotion = usePrefersReducedMotion();
  const [isPaused, setIsPaused] = useState(false);

  // Position, physics, and measurement refs (no re-renders during 60/120fps ticker)
  const offsetRef = useRef(0);
  const contentWidthRef = useRef(0);
  const cardMetricsRef = useRef<{ left: number; width: number }[]>([]);
  const isPointerDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startOffsetRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);

  // Triple set (18 items total) guarantees seamless infinite wrapping on any viewport width
  const streamItems: StreamItemData[] = useMemo(() => {
    const items: StreamItemData[] = [];
    for (let set = 0; set < 3; set++) {
      GALLERY_ITEMS.forEach((photo, idx) => {
        items.push({
          photo,
          originalIndex: idx,
          setIndex: set,
          key: `stream-${set}-${idx}`,
        });
      });
    }
    return items;
  }, []);

  // Normalizes offset within the bounds of a single content set [0, contentWidth)
  const normalizeOffset = useCallback(() => {
    const singleW = contentWidthRef.current;
    if (singleW <= 0) return;
    if (offsetRef.current >= singleW) {
      offsetRef.current = offsetRef.current % singleW;
    } else if (offsetRef.current < 0) {
      offsetRef.current = (offsetRef.current % singleW) + singleW;
    }
  }, []);

  // Updates card styles (focus hierarchy, scale, opacity) based on distance from center
  const updateStreamPositions = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return;
    const currentOffset = offsetRef.current;
    trackRef.current.style.transform = `translate3d(-${currentOffset.toFixed(2)}px, 0, 0)`;

    if (reducedMotion) return;

    const containerW = containerRef.current.clientWidth;
    const viewportCenter = containerW / 2;
    const cards = cardElementsRef.current;
    const metrics = cardMetricsRef.current;
    const maxDistance = containerW * 0.42;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const metric = metrics[i];
      if (!card || !metric) continue;

      // Center of this card in container coordinates
      const cardCenter = metric.left - currentOffset + metric.width / 2;
      const dist = Math.abs(cardCenter - viewportCenter);

      // Focus ratio: 1.0 at center, 0.0 towards edges
      const rawRatio = Math.max(0, Math.min(1, 1 - dist / maxDistance));
      // Smoothstep easing
      const ratio = rawRatio * rawRatio * (3 - 2 * rawRatio);

      const scale = 0.94 + 0.08 * ratio; // 0.94 (edge) -> 1.02 (focused center)
      const opacity = 0.55 + 0.45 * ratio; // 0.55 (edge) -> 1.00 (focused center)

      card.style.transform = `scale(${scale.toFixed(3)})`;
      card.style.opacity = opacity.toFixed(3);

      const frame = card.firstElementChild as HTMLElement | null;
      if (frame) {
        if (ratio > 0.6) {
          frame.style.borderColor = `rgba(255, 255, 255, ${(0.18 + 0.32 * ratio).toFixed(2)})`;
          frame.style.boxShadow = `0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 25px rgba(56, 189, 248, ${(0.08 * ratio).toFixed(2)})`;
        } else {
          frame.style.borderColor = "rgba(255, 255, 255, 0.12)";
          frame.style.boxShadow = "0 8px 24px -10px rgba(0, 0, 0, 0.6)";
        }
      }
    }
  }, [reducedMotion]);

  // Measures track items and calculates one complete set's width
  const measure = useCallback(() => {
    if (!trackRef.current || !containerRef.current) return;
    const cards = cardElementsRef.current;
    if (!cards.length) return;

    const metrics: { left: number; width: number }[] = [];
    cards.forEach((card) => {
      if (card) {
        metrics.push({
          left: card.offsetLeft,
          width: card.offsetWidth,
        });
      }
    });
    cardMetricsRef.current = metrics;

    // A single set spans GALLERY_ITEMS.length items
    const singleSetCount = GALLERY_ITEMS.length;
    if (metrics.length >= singleSetCount * 2) {
      // Distance from card 0 of Set 0 to card 0 of Set 1 is the exact repeating pitch
      const pitch = metrics[singleSetCount].left - metrics[0].left;
      contentWidthRef.current = pitch;
    } else {
      let totalW = 0;
      for (let i = 0; i < Math.min(singleSetCount, metrics.length); i++) {
        totalW += metrics[i].width + 24;
      }
      contentWidthRef.current = totalW;
    }

    normalizeOffset();
    updateStreamPositions();
  }, [normalizeOffset, updateStreamPositions]);

  // Handle measurement on mount and window resize
  useEffect(() => {
    measure();
    const handleResize = () => {
      measure();
    };
    window.addEventListener("resize", handleResize);

    // Initial center alignment: center Plate 01 of Set 1 on initial load
    const timer = setTimeout(() => {
      measure();
      if (containerRef.current && cardMetricsRef.current.length > GALLERY_ITEMS.length) {
        const centerIndex = 0; // Plate 01
        const metric = cardMetricsRef.current[centerIndex];
        if (metric) {
          const vCenter = containerRef.current.clientWidth / 2;
          offsetRef.current = metric.left + metric.width / 2 - vCenter;
          normalizeOffset();
          updateStreamPositions();
        }
      }
    }, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [measure, normalizeOffset, updateStreamPositions]);

  // Continuous ambient auto-drift via GSAP ticker
  useEffect(() => {
    if (reducedMotion) {
      // In reduced motion, position all cards cleanly at 100% visibility
      cardElementsRef.current.forEach((card) => {
        if (card) {
          card.style.transform = "scale(1)";
          card.style.opacity = "1";
        }
      });
      return;
    }

    const DRIFT_SPEED = 24; // pixels per second — subtle, cinematic, legible

    const tick = (_time: number, deltaTime: number) => {
      if (isPaused || isPointerDownRef.current || isDraggingRef.current) return;
      const isSitePaused = document.documentElement.getAttribute("data-motion") === "paused";
      if (isSitePaused) return;

      const dt = deltaTime / 1000;
      offsetRef.current += DRIFT_SPEED * dt;
      normalizeOffset();
      updateStreamPositions();
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [isPaused, reducedMotion, normalizeOffset, updateStreamPositions]);

  // ==========================================
  // Pointer Drag Handlers (Desktop & Touch)
  // ==========================================
  const onPointerDown = (e: React.PointerEvent) => {
    if (reducedMotion) return;
    if (e.button !== 0 && e.pointerType === "mouse") return;

    isPointerDownRef.current = true;
    isDraggingRef.current = false;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    startOffsetRef.current = offsetRef.current;
    velocityRef.current = 0;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;

    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;

    // Touch check: if vertical page scrolling is dominant, release capture so page scroll works
    if (!isDraggingRef.current && e.pointerType === "touch") {
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
        isPointerDownRef.current = false;
        try {
          e.currentTarget.releasePointerCapture(e.pointerId);
        } catch {}
        return;
      }
    }

    if (Math.abs(dx) > 4) {
      isDraggingRef.current = true;
      if (containerRef.current) {
        containerRef.current.style.cursor = "grabbing";
      }
    }

    if (isDraggingRef.current) {
      const now = performance.now();
      const dt = Math.max(1, now - lastTimeRef.current);
      velocityRef.current = (e.clientX - lastXRef.current) / dt;
      lastXRef.current = e.clientX;
      lastTimeRef.current = now;

      offsetRef.current = startOffsetRef.current - dx;
      normalizeOffset();
      updateStreamPositions();
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
    }

    // Inertial momentum glide on flick release
    const flickVelocity = velocityRef.current;
    if (Math.abs(flickVelocity) > 0.25) {
      const momentumDistance = -flickVelocity * 220;
      const targetOffset = offsetRef.current + momentumDistance;
      gsap.to(offsetRef, {
        current: targetOffset,
        duration: 0.65,
        ease: "power2.out",
        onUpdate: () => {
          normalizeOffset();
          updateStreamPositions();
        },
      });
    }

    isDraggingRef.current = false;
  };

  // Directional step controls for accessibility and click navigation
  const handleStep = (direction: "left" | "right") => {
    const stepDist = 420;
    const target = offsetRef.current + (direction === "right" ? stepDist : -stepDist);
    gsap.to(offsetRef, {
      current: target,
      duration: 0.6,
      ease: "power2.out",
      onUpdate: () => {
        normalizeOffset();
        updateStreamPositions();
      },
    });
  };

  return (
    <section
      id="gallery"
      ref={sectionRef}
      aria-label="05 / Gallery: Visual Chronicle and Living Photographic Stream"
      className="relative w-full text-white bg-transparent py-12 sm:py-16 lg:py-20 overflow-hidden select-none"
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col">
        {/* Top Architectural Datum Hairline */}
        <div className="flex items-center justify-between font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-white/40 pb-5 border-b border-white/[0.10] mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <Diamond size={5} filled={true} className="text-sky-400/80" />
            <span className="text-white/80 font-medium">05 / GALLERY</span>
            <span className="text-white/30 hidden sm:inline">·</span>
            <span className="text-white/50 hidden sm:inline">VISUAL CHRONICLE</span>
          </div>

          <div className="flex items-center gap-4 text-white/40 font-mono text-[10px]">
            <span className="hidden md:inline-block">LIVING PHOTOGRAPHIC ARCHIVE</span>
            <span className="text-sky-300/70">+ [STREAM.NODE // 2026]</span>
          </div>
        </div>

        {/* Section Header: Compact, Editorial, Restrained */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-sky-300/75 mb-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400/80 animate-pulse" />
              <span>PHOTOGRAPHIC ARCHIVE // REAL DOCUMENTATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-tight uppercase">
              The Physicality of Computing
            </h2>
          </div>

          {/* Stream Controls & Drag Indicator */}
          <div className="flex items-center gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Resume archive auto-scroll" : "Pause archive auto-scroll"}
              className="px-3 py-1.5 border border-white/20 hover:border-white text-white/80 hover:text-white font-mono text-[10px] uppercase tracking-wider transition-colors inline-flex items-center gap-2 focus-visible:outline-sky-400 cursor-pointer"
            >
              <Diamond size={3.5} filled={!isPaused} className={!isPaused ? "text-sky-400" : "text-white/40"} />
              <span>{isPaused ? "STREAM PAUSED" : "AUTO-DRIFT"}</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleStep("left")}
                aria-label="Scroll photo stream left"
                className="w-7 h-7 border border-white/20 hover:border-white text-white/80 hover:text-white font-mono text-xs transition-colors flex items-center justify-center focus-visible:outline-sky-400 cursor-pointer"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => handleStep("right")}
                aria-label="Scroll photo stream right"
                className="w-7 h-7 border border-white/20 hover:border-white text-white/80 hover:text-white font-mono text-xs transition-colors flex items-center justify-center focus-visible:outline-sky-400 cursor-pointer"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic Horizontal Photographic Stream Container */}
      <div className="relative w-full overflow-hidden">
        {/* Soft edge ambient vignetting */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 lg:w-24 bg-gradient-to-l from-black via-black/50 to-transparent z-10" />

        <div
          ref={containerRef}
          className="relative w-full overflow-hidden py-3 sm:py-5 cursor-grab active:cursor-grabbing touch-pan-y"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            ref={trackRef}
            className="flex items-center gap-5 sm:gap-7 lg:gap-8 will-change-transform"
            style={{ width: "max-content" }}
          >
            {streamItems.map(({ photo, originalIndex, setIndex, key }, streamIdx) => {
              const isPriority = originalIndex === 0 && setIndex === 0;
              const aspectClass = getCardAspect(photo.width, photo.height);
              const widthClass = getCardWidthClass(aspectClass);

              return (
                <div
                  key={key}
                  ref={(el) => {
                    cardElementsRef.current[streamIdx] = el;
                  }}
                  data-gallery-plate={originalIndex}
                  data-stream-index={streamIdx}
                  className={`shrink-0 ${widthClass} h-[250px] sm:h-[310px] lg:h-[360px] transition-[border-color] duration-300`}
                  style={{ willChange: "transform, opacity" }}
                >
                  <div className="relative w-full h-full overflow-hidden border border-white/15 bg-neutral-950/80 rounded-none shadow-[0_4px_30px_rgba(0,0,0,0.6)] group transition-all duration-300">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 500px, 640px"
                      priority={isPriority}
                      loading={isPriority ? "eager" : "lazy"}
                    />

                    {/* Top Technical Metadata Badges */}
                    <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 px-2 py-0.5 bg-black/75 border border-white/15 font-mono text-[9px] uppercase tracking-widest text-white/80 backdrop-blur-sm pointer-events-none">
                      PLATE // {String(originalIndex + 1).padStart(2, "0")}
                    </div>

                    <div className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 px-2 py-0.5 bg-black/75 border border-white/15 font-mono text-[9px] uppercase tracking-widest text-sky-300/80 backdrop-blur-sm pointer-events-none">
                      {photo.year || "2026"}
                    </div>

                    {/* Bottom Ambient Vignette & Restrained Caption */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent opacity-85 group-hover:opacity-95 transition-opacity pointer-events-none" />

                    <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 pointer-events-none">
                      <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-sky-300/80 uppercase tracking-widest mb-1">
                        <span>[{String(originalIndex + 1).padStart(2, "0")}] · {aspectClass}</span>
                        <span className="text-white/40">ARCHIVE</span>
                      </div>

                      <h3 className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.14em] text-white font-normal truncate">
                        {photo.alt}
                      </h3>

                      <p className="mt-1 text-[11px] sm:text-xs text-white/60 font-light line-clamp-1">
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Technical Rail: Restrained Drag Indicator & Count */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 mt-4 sm:mt-6 flex items-center justify-between text-white/40 font-mono text-[10px] tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-sky-400" />
          <span>06 AUTHENTIC PLATES ARCHIVED</span>
        </div>

        <div className="flex items-center gap-2 text-white/50">
          <span>DRAG OR SWIPE TO EXPLORE</span>
          <span className="text-sky-400">⟷</span>
        </div>
      </div>
    </section>
  );
}
