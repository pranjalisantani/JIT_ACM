"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";

interface RevealProps {
  children: React.ReactNode;
  delay?: number; // in milliseconds
  yOffset?: number; // default 20px (16-24px rise)
  className?: string;
  as?: React.ElementType;
}

export function Reveal({
  children,
  delay = 0,
  yOffset = 20,
  className = "",
  as: Component = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [reducedMotion]);

  const style: React.CSSProperties = {
    opacity: isVisible || reducedMotion ? 1 : 0,
    transform: isVisible || reducedMotion ? "none" : `translate3d(0, ${yOffset}px, 0)`,
    transitionProperty: "opacity, transform",
    transitionDuration: "750ms",
    transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
    transitionDelay: `${delay}ms`,
    willChange: isVisible ? "auto" : "opacity, transform",
  };

  return (
    <Component ref={ref} style={style} className={className}>
      {children}
    </Component>
  );
}
