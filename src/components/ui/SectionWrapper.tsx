import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
  id: string;
  index?: string;
  title?: string;
  tagline?: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({
  id,
  index,
  title,
  tagline,
  children,
  className,
  ...props
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full border-t border-neutral-900/80 py-24 sm:py-32",
        className
      )}
      {...props}
    >
      <Container>
        {(index || title) && (
          <header className="mb-12 sm:mb-16">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 pb-6 border-b border-neutral-900/70">
              <div className="flex items-center gap-3">
                {index && (
                  <span className="font-mono text-xs tracking-widest text-neutral-500 uppercase">
                    [{index}]
                  </span>
                )}
                {title && (
                  <h2 className="text-xl sm:text-2xl font-light tracking-tight text-neutral-100">
                    {title}
                  </h2>
                )}
              </div>
              {tagline && (
                <p className="font-mono text-xs text-neutral-500 tracking-wide">
                  {tagline}
                </p>
              )}
            </div>
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
