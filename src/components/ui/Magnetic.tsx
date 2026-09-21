"use client";

import React, { useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";

interface MagneticProps {
  children: React.ReactNode;
  maxOffset?: number; // 6 to 8px max per spec
  className?: string;
  as?: React.ElementType;
}

function subscribeFinePointer(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(pointer: fine)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getFinePointerSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: fine)").matches;
}

function getFinePointerServerSnapshot(): boolean {
  return false;
}

export function Magnetic({
  children,
  maxOffset = 6,
  className = "",
  as: Component = "div",
}: MagneticProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isFinePointer = React.useSyncExternalStore(
    subscribeFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot
  );
  const reducedMotion = usePrefersReducedMotion();

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isFinePointer || reducedMotion) return;
    const isPaused = document.documentElement.getAttribute("data-motion") === "paused";
    if (isPaused) return;

    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const relX = (e.clientX - centerX) * 0.22;
    const relY = (e.clientY - centerY) * 0.22;

    // Bounded lerp / clamp to maxOffset (max 6-8px)
    const clampedX = Math.max(-maxOffset, Math.min(maxOffset, relX));
    const clampedY = Math.max(-maxOffset, Math.min(maxOffset, relY));

    setOffset({ x: clampedX, y: clampedY });
  };

  const handlePointerLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const style: React.CSSProperties = {
    transform:
      reducedMotion || !isFinePointer
        ? "none"
        : `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition:
      offset.x === 0 && offset.y === 0
        ? "transform 350ms cubic-bezier(0.16, 1, 0.3, 1)"
        : "transform 100ms ease-out",
    display: "inline-flex",
  };

  return (
    <Component
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={style}
      className={className}
    >
      {children}
    </Component>
  );
}
