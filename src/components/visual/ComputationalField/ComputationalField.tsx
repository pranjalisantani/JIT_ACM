"use client";

import React, { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";
import {
  createSimulationState,
  stepAndRender,
  SimulationState,
  sampleCanvasPixelMetrics,
} from "./fieldSimulation";
import { ComputationalFieldProps } from "./types";
import { clearTargetsCache } from "./identityTargets";
import { OPENING_TIMELINE } from "@/config/opening";

export function ComputationalField({
  isMobile = false,
  className = "",
  onFrame,
  paused = false,
}: ComputationalFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simStateRef = useRef<SimulationState | null>(null);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const accumulatedPauseTimeRef = useRef<number>(0);
  const pauseStartRef = useRef<number | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isDisposed = false;
    let resizeTimer: NodeJS.Timeout | null = null;

    // Resize & dimension handling with DPR capping:
    // DPR capped at 2 for desktop, 1.5 for mobile
    const updateDimensions = () => {
      if (isDisposed || !canvas) return;
      clearTargetsCache();

      const width = window.innerWidth;
      const height = window.innerHeight;
      const maxDpr = isMobile ? 1.5 : 2.0;
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      simStateRef.current = createSimulationState(
        width,
        height,
        isMobile,
        reducedMotion,
        dpr
      );

      // Expose state and sampler on window for validation metrics
      if (typeof window !== "undefined") {
        // @ts-expect-error window testing hook
        window.__acm_field_sim = {
          getState: () => simStateRef.current,
          sampleMetrics: () => {
            if (!simStateRef.current) return null;
            const pxMetrics = sampleCanvasPixelMetrics(canvas);
            return {
              ...simStateRef.current.metrics,
              ...pxMetrics,
            };
          },
        };
      }

      // If reduced motion, render one static frame at stable identity phase (6.5s)
      if (reducedMotion && simStateRef.current) {
        stepAndRender(ctx, simStateRef.current, 6.5, 0.016);
      }
    };

    updateDimensions();

    // Debounced resize handler (150ms per spec)
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        updateDimensions();
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    // If reduced motion, no animation loop is needed
    if (reducedMotion) {
      return () => {
        isDisposed = true;
        if (resizeTimer) clearTimeout(resizeTimer);
        window.removeEventListener("resize", handleResize);
      };
    }

    // Direct timestamp seek support for test verification (?t=3.0, ?t=6.5, ?t=8.5)
    const urlParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const testTimeParam = urlParams?.get("t");
    const testTime = testTimeParam !== null && testTimeParam !== undefined ? parseFloat(testTimeParam) : null;

    if (testTime !== null && !isNaN(testTime) && simStateRef.current) {
      for (let s = 0.05; s <= testTime; s += 0.05) {
        stepAndRender(ctx, simStateRef.current, s, 0.05);
      }
      stepAndRender(ctx, simStateRef.current, testTime, 0.016);
      return () => {
        isDisposed = true;
        if (resizeTimer) clearTimeout(resizeTimer);
        window.removeEventListener("resize", handleResize);
      };
    }

    // High-performance requestAnimationFrame loop
    const renderLoop = (timestamp: number) => {
      if (isDisposed) return;

      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
        lastTimeRef.current = timestamp;
      }

      if (paused) {
        if (pauseStartRef.current === null) {
          pauseStartRef.current = timestamp;
        }
        rafRef.current = requestAnimationFrame(renderLoop);
        return;
      } else if (pauseStartRef.current !== null) {
        // Resume without time jump
        accumulatedPauseTimeRef.current += timestamp - pauseStartRef.current;
        pauseStartRef.current = null;
        lastTimeRef.current = timestamp;
      }

      const rawElapsed = timestamp - startTimeRef.current - accumulatedPauseTimeRef.current;
      const elapsedSec = Math.max(0, rawElapsed / 1000);
      const deltaSec = lastTimeRef.current ? Math.min((timestamp - lastTimeRef.current) / 1000, 0.05) : 0.016;
      lastTimeRef.current = timestamp;

      if (simStateRef.current) {
        stepAndRender(ctx, simStateRef.current, elapsedSec, deltaSec);
      }

      onFrame?.(elapsedSec);

      // Animation runs until hard cap 9.1s
      if (elapsedSec <= OPENING_TIMELINE.TOTAL_DURATION) {
        rafRef.current = requestAnimationFrame(renderLoop);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(renderLoop);

    // Pause on document.hidden (visibilitychange)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      } else {
        if (!rafRef.current && !isDisposed && !reducedMotion) {
          lastTimeRef.current = performance.now();
          rafRef.current = requestAnimationFrame(renderLoop);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup: cancels rAF and removes listeners
    return () => {
      isDisposed = true;
      if (resizeTimer) clearTimeout(resizeTimer);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isMobile, paused, reducedMotion, onFrame]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      tabIndex={-1}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{
        width: "100vw",
        height: "100dvh",
        backgroundColor: "#000000",
      }}
    />
  );
}
