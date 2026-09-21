import React from "react";
import { Diamond } from "./Diamond";
import { Hairline } from "./Hairline";

interface SectionProps {
  id: string;
  index: string; // e.g. "01"
  label: string; // e.g. "ABOUT"
  title?: string;
  children: React.ReactNode;
  className?: string;
  noDivider?: boolean;
}

export function Section({
  id,
  index,
  label,
  title,
  children,
  className = "",
  noDivider = false,
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`relative w-full text-white bg-black ${className}`}
      style={{
        paddingTop: "clamp(96px, 14vw, 200px)",
        paddingBottom: "clamp(96px, 14vw, 200px)",
      }}
    >
      {!noDivider && (
        <div className="absolute top-0 inset-x-0 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <Hairline orientation="horizontal" />
          <div
            aria-hidden="true"
            className="absolute left-1/2 -translate-x-1/2 -top-1.5 flex flex-col items-center select-none pointer-events-none"
          >
            <Diamond size={5} filled={false} />
          </div>
        </div>
      )}

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Index Header */}
        <header className="flex items-center gap-3 mb-10 sm:mb-16">
          <Diamond size={6} filled={true} />
          <span
            id={headingId}
            className="font-mono text-[11px] sm:text-[12px] uppercase font-medium tracking-[0.2em] text-white/50"
          >
            {index} · {label}
          </span>
          {title && <span className="sr-only">— {title}</span>}
        </header>

        {/* Section Content */}
        {children}
      </div>
    </section>
  );
}
