"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { ComputationalField } from "@/components/visual/ComputationalField/ComputationalField";
import {
  OPENING_TIMELINE,
  OPENING_STRINGS,
  OPENING_GATING,
} from "@/config/opening";
import {
  getStoredMutePreference,
  setStoredMutePreference,
  playWelcomeVoice,
  clearVoicePlayback,
  resetVoiceGuard,
  preloadVoiceInIdleCallback,
} from "@/lib/audio/voiceEngine";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";

interface OpeningExperienceProps {
  onEnter?: () => void;
}

// React 19 SyncExternalStore listeners for external platform state
function subscribeIsMobile(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(max-width: 767px)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getIsMobileSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

function getIsMobileServerSnapshot(): boolean {
  return false;
}

function subscribeOpeningGating(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("acm:replay-opening", callback);
  return () => window.removeEventListener("acm:replay-opening", callback);
}

function getOpeningGatingSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  const hasNoHash = !window.location.hash || window.location.hash === "";
  const isHome = (window.location.pathname === "/" || window.location.pathname === "") && hasNoHash;
  const isReplay = window.location.search.includes("opening=1");
  const visited = localStorage.getItem(OPENING_GATING.STORAGE_VISITED_KEY);
  return isHome && (!visited || isReplay);
}

function getOpeningGatingServerSnapshot(): boolean {
  return false;
}

export function OpeningExperience({ onEnter }: OpeningExperienceProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const acmRef = useRef<HTMLHeadingElement | null>(null);
  const faceGroupRef = useRef<HTMLDivElement | null>(null);
  const captionRef = useRef<HTMLParagraphElement | null>(null);
  const skipBtnRef = useRef<HTMLButtonElement | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const reducedMotion = usePrefersReducedMotion();
  const isMobile = React.useSyncExternalStore(
    subscribeIsMobile,
    getIsMobileSnapshot,
    getIsMobileServerSnapshot
  );
  const shouldShowOpening = React.useSyncExternalStore(
    subscribeOpeningGating,
    getOpeningGatingSnapshot,
    getOpeningGatingServerSnapshot
  );

  const [isDismissed, setIsDismissed] = useState(false);
  const isVisible = shouldShowOpening && !isDismissed;
  const [isMuted, setIsMuted] = useState(() => getStoredMutePreference());
  const isDisposedRef = useRef(false);

  const debugSnapshotsRef = useRef<Record<string, unknown>[]>([]);
  const loggedTimesRef = useRef<Set<number>>(new Set());

  // Synchronize DOM attributes with isVisible state and notify shell removal
  useEffect(() => {
    if (isVisible) {
      document.documentElement.setAttribute(OPENING_GATING.HTML_DATA_ATTR, "1");
      const siteWrapper = document.getElementById("site-wrapper");
      if (siteWrapper) siteWrapper.setAttribute("inert", "");

      // Preload voice audio in idle callback after first paint
      preloadVoiceInIdleCallback();

      // Signal painted overlay so server-rendered failsafe shell can unmount
      requestAnimationFrame(() => {
        document.documentElement.setAttribute("data-opening-painted", "1");
      });
    } else {
      document.documentElement.removeAttribute("data-opening-painted");
      document.documentElement.removeAttribute(OPENING_GATING.HTML_DATA_ATTR);
      const siteWrapper = document.getElementById("site-wrapper");
      if (siteWrapper) siteWrapper.removeAttribute("inert");
    }
  }, [isVisible]);

  // Complete cleanup function (idempotent, safe to call twice)
  const dispose = useCallback(() => {
    if (isDisposedRef.current) return;
    isDisposedRef.current = true;

    // 1. Kill GSAP timelines & tweens
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
    gsap.killTweensOf("*");

    // 2. Clear voice audio playback
    clearVoicePlayback();

    // 3. Mark visited in localStorage
    try {
      localStorage.setItem(OPENING_GATING.STORAGE_VISITED_KEY, "true");
    } catch {
      // Ignore in private browsing
    }

    // 4. Remove HTML data-opening attributes
    if (typeof document !== "undefined") {
      document.documentElement.removeAttribute("data-opening-painted");
      document.documentElement.removeAttribute(OPENING_GATING.HTML_DATA_ATTR);

      // 5. Un-inert the underlying site wrapper
      const siteWrapper = document.getElementById("site-wrapper");
      if (siteWrapper) {
        siteWrapper.removeAttribute("inert");
      }
    }

    // 6. Remove overlay from view
    setIsDismissed(true);

    // 7. Invoke completion callback
    onEnter?.();

    // 8. Return focus to top of page / main content
    const mainTarget = document.getElementById("main-content") || document.querySelector("main");
    if (mainTarget) {
      mainTarget.setAttribute("tabIndex", "-1");
      mainTarget.focus();
    }
  }, [onEnter]);

  // Keyboard navigation: ESC skips immediately from frame 1
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dispose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [dispose]);

  // Manage site wrapper inertness while opening is mounted
  useEffect(() => {
    const siteWrapper = document.getElementById("site-wrapper");
    if (siteWrapper && isVisible) {
      siteWrapper.setAttribute("inert", "");
    }
    // Auto-focus skip button for accessibility
    if (skipBtnRef.current) {
      skipBtnRef.current.focus();
    }

    return () => {
      if (siteWrapper) {
        siteWrapper.removeAttribute("inert");
      }
    };
  }, [isVisible]);

  // Master Typography & Overlay Animation Timeline
  useEffect(() => {
    if (!isVisible) return;
    isDisposedRef.current = false;

    // Reduced motion timeline (<= 2.5s total)
    if (reducedMotion) {
      const tl = gsap.timeline({
        onComplete: () => dispose(),
      });
      timelineRef.current = tl;

      tl.to(acmRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power1.inOut",
      }, OPENING_TIMELINE.REDUCED_MOTION_IDENTITY_IN)
      .to(acmRef.current, {
        opacity: 0,
        duration: 0.25,
      }, OPENING_TIMELINE.REDUCED_MOTION_FACE_IN)
      .to(faceGroupRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: "power1.inOut",
      }, OPENING_TIMELINE.REDUCED_MOTION_FACE_IN + 0.05)
      .to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: "power1.inOut",
      }, OPENING_TIMELINE.REDUCED_MOTION_EXIT);

      return () => {
        tl.kill();
      };
    }

    // Full 9.0s Cinematic Sequence Timeline
    const tl = gsap.timeline({
      onComplete: () => dispose(),
    });
    timelineRef.current = tl;

    // 1. Initial State: pure black, clean elements hidden
    gsap.set([acmRef.current, faceGroupRef.current, captionRef.current], {
      opacity: 0,
    });

    // 2. 6.0s–6.5s: Clean ACM typography cross-fades in over settled constellation
    tl.to(acmRef.current, {
      opacity: 1,
      duration: OPENING_TIMELINE.CLEAN_ACM_STABLE - OPENING_TIMELINE.CLEAN_ACM_FADE_IN_START,
      ease: "power1.inOut",
    }, OPENING_TIMELINE.CLEAN_ACM_FADE_IN_START);

    // 3. 6.5s: Voice start & subtitle fade in
    tl.call(() => {
      playWelcomeVoice({
        muted: isMuted,
        onSubtitle: (text) => {
          if (captionRef.current) {
            captionRef.current.textContent = text;
          }
        },
      });
    }, undefined, OPENING_TIMELINE.VOICE_START);

    tl.to(captionRef.current, {
      opacity: 1,
      duration: 0.35,
      ease: "power1.out",
    }, OPENING_TIMELINE.CAPTION_FADE_IN);

    // 4. 7.5s–8.2s: ACM morphs to ACM FACE
    tl.to(acmRef.current, {
      opacity: 0,
      duration: 0.35,
      ease: "power1.in",
    }, OPENING_TIMELINE.MORPH_RELEASE_START);

    // Subtitle fades out by 7.5s
    tl.to(captionRef.current, {
      opacity: 0,
      duration: 0.35,
      ease: "power1.in",
    }, OPENING_TIMELINE.CAPTION_FADE_OUT - 0.35);

    // ACM FACE fades in at 7.8s
    tl.to(faceGroupRef.current, {
      opacity: 1,
      duration: 0.4,
      ease: "power1.inOut",
    }, OPENING_TIMELINE.ACM_FACE_FADE_IN);

    // 5. 8.6s–9.0s: Exit dissolve and seamless hand-off
    tl.call(() => {
      if (typeof document !== "undefined") {
        document.documentElement.removeAttribute(OPENING_GATING.HTML_DATA_ATTR);
      }
    }, undefined, OPENING_TIMELINE.EXIT_FADE_START);

    tl.to(containerRef.current, {
      opacity: 0,
      duration: OPENING_TIMELINE.TOTAL_DURATION - OPENING_TIMELINE.EXIT_FADE_START,
      ease: "power1.inOut",
    }, OPENING_TIMELINE.EXIT_FADE_START);

    // Check test time seek param (?t=3.0, ?t=6.5, ?t=8.5)
    const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const testTimeParam = urlParams?.get("t");
    const testTime = testTimeParam !== null && testTimeParam !== undefined ? parseFloat(testTimeParam) : null;

    if (testTime !== null && !isNaN(testTime)) {
      if (testTime >= OPENING_TIMELINE.VOICE_START && testTime < OPENING_TIMELINE.CAPTION_FADE_OUT) {
        if (captionRef.current) captionRef.current.textContent = OPENING_STRINGS.SUBTITLE;
      }
      tl.seek(testTime);
      tl.pause();
    }

    return () => {
      tl.kill();
    };
  }, [isVisible, reducedMotion, isMuted, dispose]);

  // Voice toggle handler
  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setStoredMutePreference(nextMuted);
  };

  // Listen for replay requests (e.g. ?opening=1 or replay custom event)
  useEffect(() => {
    const handleReplay = () => {
      resetVoiceGuard();
      isDisposedRef.current = false;
      setIsDismissed(false);
    };

    window.addEventListener("acm:replay-opening", handleReplay);
    return () => window.removeEventListener("acm:replay-opening", handleReplay);
  }, []);

  // Debug metrics capture hook active only with ?debug=1
  const handleFrame = useCallback((elapsed: number) => {
    if (typeof window === "undefined" || !window.location.search.includes("debug=1")) return;

    const targets = [1.0, 3.0, 5.0, 6.5, 7.5, 8.5];
    for (const t of targets) {
      if (!loggedTimesRef.current.has(t) && elapsed >= t && elapsed <= t + 0.18) {
        loggedTimesRef.current.add(t);
        // @ts-expect-error window testing hook
        const sim = window.__acm_field_sim;
        const metrics = sim?.sampleMetrics();
        const faceOpacity = faceGroupRef.current ? parseFloat(window.getComputedStyle(faceGroupRef.current).opacity || "0") : 0;
        const acmOpacity = acmRef.current ? parseFloat(window.getComputedStyle(acmRef.current).opacity || "0") : 0;
        const identityOpacity = Math.max(acmOpacity, faceOpacity);

        const snap = {
          time: `${t}s`,
          visiblePoints: metrics?.visiblePoints ?? "N/A",
          visibleEdges: metrics?.visibleEdges ?? "N/A",
          nonBlackPixels: `${metrics?.nonBlackPixelPercent ?? 0}%`,
          maxColourSpread: metrics?.maxColourSpread ?? 0,
          identityOpacity: Number(identityOpacity.toFixed(2)),
        };
        debugSnapshotsRef.current.push(snap);

        if (loggedTimesRef.current.size === targets.length) {
          console.table(debugSnapshotsRef.current);
          // @ts-expect-error window testing hook
          window.__acm_debug_snapshots = debugSnapshotsRef.current;
        }
      }
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="ACM FACE Cinematic Opening"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-black text-white select-none overflow-hidden"
      style={{
        backgroundColor: "#000000",
      }}
    >
      {/* Dense Computational Field Surface */}
      <ComputationalField isMobile={isMobile} onFrame={handleFrame} />

      {/* Top Controls: VOICE ON/OFF + SKIP (Whitelist text only) */}
      <header className="relative z-20 flex items-center justify-end px-6 py-6 sm:px-10 sm:py-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSound}
            aria-label={isMuted ? "Unmute Voice" : "Mute Voice"}
            className="min-h-[44px] min-w-[44px] px-3.5 py-2 border border-neutral-800 hover:border-neutral-600 bg-black/60 hover:bg-neutral-900 transition-colors text-neutral-300 hover:text-white rounded-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-neutral-400"
          >
            <span className="font-mono tracking-widest uppercase text-[11px]">
              {isMuted ? OPENING_STRINGS.VOICE_OFF : OPENING_STRINGS.VOICE_ON}
            </span>
          </button>

          <button
            ref={skipBtnRef}
            type="button"
            onClick={dispose}
            aria-label="Skip Opening Experience"
            className="min-h-[44px] min-w-[44px] px-4 py-2 border border-neutral-800 hover:border-neutral-600 bg-black/60 hover:bg-neutral-900 transition-colors text-neutral-300 hover:text-white rounded-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-neutral-400 flex items-center gap-1.5"
          >
            <span className="font-mono tracking-widest uppercase text-[11px]">
              {OPENING_STRINGS.SKIP}
            </span>
            <span className="font-mono text-[9px] text-neutral-500 uppercase">
              {OPENING_STRINGS.ESC}
            </span>
          </button>
        </div>
      </header>

      {/* Center: Identity Typography (Constellation is rendered on Canvas underneath) */}
      <main className="relative z-20 my-auto flex flex-col items-center justify-center px-4 text-center pointer-events-none">
        <div className="relative flex flex-col items-center justify-center min-h-[160px] sm:min-h-[220px]">
          {/* Phase 1 Clean Typography: ACM */}
          <h1
            ref={acmRef}
            className="absolute text-6xl sm:text-8xl md:text-9xl font-bold tracking-[0.25em] sm:tracking-[0.3em] text-white uppercase leading-none opacity-0 select-none"
            style={{ textIndent: "0.25em" }}
          >
            {OPENING_STRINGS.IDENTITY_PRIMARY}
          </h1>

          {/* Phase 2 Clean Typography: ACM FACE + Tagline */}
          <div
            ref={faceGroupRef}
            className="flex flex-col items-center justify-center opacity-0 select-none"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-extralight tracking-tight text-white leading-none">
              {OPENING_STRINGS.IDENTITY_MORPHED}
            </h1>
            <p
              className="mt-6 text-xs sm:text-sm font-normal tracking-[0.3em] uppercase text-neutral-400"
              style={{ opacity: 0.55 }}
            >
              {OPENING_STRINGS.TAGLINE}
            </p>
          </div>
        </div>

        {/* Subtitle Caption: Restrained subtitle text, NO border, NO box, NO chip */}
        <div className="mt-10 min-h-[2.5rem] flex items-center justify-center">
          <p
            ref={captionRef}
            className="font-sans text-sm sm:text-base font-light tracking-wider text-neutral-300 opacity-0 select-none"
          >
            {OPENING_STRINGS.SUBTITLE}
          </p>
        </div>
      </main>

      {/* Bottom spacer for clean editorial layout balance */}
      <footer className="relative z-20 px-6 py-6 sm:px-10 sm:py-8 pointer-events-none" />
    </div>
  );
}
