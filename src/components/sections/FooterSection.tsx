"use client";

import React, { useEffect, useRef } from "react";
import { FOOTER_FOCUS_NAV, FOOTER_DATA } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";
import { registerScrollTrigger, gsap } from "@/lib/motion/gsap";

function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function FooterSection() {
  const footerRef = useRef<HTMLElement | null>(null);
  const upperRuleRef = useRef<HTMLDivElement | null>(null);
  const topNavRef = useRef<HTMLDivElement | null>(null);
  const identityRef = useRef<HTMLDivElement | null>(null);
  const identityTextRef = useRef<HTMLHeadingElement | null>(null);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const utilityRef = useRef<HTMLDivElement | null>(null);
  const returnTopBtnRef = useRef<HTMLButtonElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Subtle and restrained editorial reveal sequence:
  // 1. footer upper rule -> 2. navigation/identity -> 3. supporting info -> 4. bottom utility row -> 5. Return to Top
  useEffect(() => {
    if (reducedMotion) {
      [upperRuleRef, topNavRef, identityRef, infoRef, utilityRef, returnTopBtnRef].forEach((ref) => {
        if (ref.current) {
          ref.current.style.opacity = "1";
          ref.current.style.transform = "none";
        }
      });
      return;
    }

    const ScrollTrigger = registerScrollTrigger();
    const footer = footerRef.current;
    if (!ScrollTrigger || !footer) return;

    const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: footer,
            start: "top 82%",
            toggleActions: "play none none none",
            once: true,
            onEnter: () => {
              gsap.delayedCall(1.2, () => {
                if (identityTextRef.current) {
                  gsap.to(identityTextRef.current, {
                    y: 3,
                    duration: 3,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                  });
                }
              });
            },
          },
        });

      // 1. Footer upper rule
      if (upperRuleRef.current) {
        tl.fromTo(
          upperRuleRef.current,
          { opacity: 0, scaleX: 0.85, transformOrigin: "left center" },
          { opacity: 1, scaleX: 1, duration: 0.6, ease: "power2.out" }
        );
      }

      // 2. Navigation & Identity
      if (topNavRef.current) {
        tl.fromTo(
          topNavRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.3"
        );
      }

      if (identityRef.current) {
        tl.fromTo(
          identityRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.4"
        );
      }

      // 3. Supporting information (Institutional statement + authentic GitHub link)
      if (infoRef.current) {
        tl.fromTo(
          infoRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.35"
        );
      }

      // 4. Bottom utility row
      if (utilityRef.current) {
        tl.fromTo(
          utilityRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
          "-=0.3"
        );
      }

      // 5. Return to Top
      if (returnTopBtnRef.current) {
        tl.fromTo(
          returnTopBtnRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" },
          "-=0.2"
        );
      }
    }, footer);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleReturnToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    });

    const hero = document.getElementById("hero") || document.documentElement;
    hero.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });

    setTimeout(() => {
      const h1 = document.querySelector("h1");
      if (h1) {
        h1.setAttribute("tabindex", "-1");
        h1.focus({ preventScroll: true });
      }
    }, 400);
  };

  return (
    <footer
      id="footer"
      ref={footerRef}
      aria-label="Site Footer and Architectural Index"
      className="relative w-full pt-16 sm:pt-24 lg:pt-32 pb-20 sm:pb-28 lg:pb-32 text-white select-none overflow-hidden"
    >
      <div className="w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col">
        {/* 1. FOOTER UPPER RULE */}
        <div
          ref={upperRuleRef}
          aria-hidden="true"
          className="w-full border-t border-white/[0.08] mb-10 sm:mb-14 will-change-transform"
        />

        {/* 2. NAVIGATION AREA: Focus Navigation with Generous Negative Space */}
        <div ref={topNavRef} className="will-change-transform mb-10 sm:mb-14">
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-6 sm:gap-10 lg:gap-14">
            {FOOTER_FOCUS_NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors focus-visible:outline-sky-400 py-1"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* STRONG IDENTITY / WORDMARK */}
        <div ref={identityRef} className="will-change-transform mb-8 sm:mb-12">
          <h2
            ref={identityTextRef}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light tracking-tight text-white select-none leading-none"
          >
            ACM FACE
          </h2>
        </div>

        {/* Directional Hairline 1: Resolves from the LEFT */}
        <div
          aria-hidden="true"
          className="w-full max-w-[85%] border-t border-white/[0.10] mr-auto mb-10 sm:mb-14"
        />

        {/* 3. SUPPORTING INFORMATION AREA (Asymmetrical Editorial Rhythm) */}
        <div
          ref={infoRef}
          className="will-change-transform flex flex-col md:flex-row md:items-start justify-between gap-10 lg:gap-16 mb-12 sm:mb-16"
        >
          {/* LEFT: Institutional Statement & Mission */}
          <div className="space-y-3 max-w-md">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-white font-medium">
              {FOOTER_DATA.wordmark}
            </p>
            <p className="text-base sm:text-lg font-light tracking-tight text-white/90 uppercase leading-snug">
              {FOOTER_DATA.tagline}
            </p>
            <p className="font-mono text-[11px] sm:text-xs uppercase tracking-[0.14em] text-white/60 leading-relaxed pt-1">
              {FOOTER_DATA.institutionalNote}
            </p>
          </div>

          {/* RIGHT: Authentic Social Accounts */}
          <div className="flex flex-col items-start md:items-end space-y-3">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-white/55">
              SOCIAL
            </span>
            <a
              href={FOOTER_DATA.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ACM FACE on GitHub"
              className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.16em] text-white/70 hover:text-white transition-colors focus-visible:outline-sky-400 py-1"
            >
              <span className="w-8 h-8 rounded-sm border border-white/20 group-hover:border-white/50 bg-white/[0.04] group-hover:bg-white/[0.10] flex items-center justify-center transition-colors">
                <GitHubIcon className="w-4 h-4 text-white/80 group-hover:text-white" />
              </span>
              <span className="group-hover:text-sky-300 transition-colors">github.com/acm-face</span>
            </a>
          </div>
        </div>

        {/* Directional Hairline 2: Resolves from the RIGHT */}
        <div
          aria-hidden="true"
          className="w-full max-w-[90%] border-t border-white/[0.10] ml-auto mb-10 sm:mb-12"
        />

        {/* 4. BOTTOM UTILITY ROW: © ACM FACE + Return to Top */}
        <div
          ref={utilityRef}
          className="will-change-transform flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white/55"
        >
          {/* Left: Small Copyright */}
          <span>{FOOTER_DATA.copyright}</span>

          {/* 5. Right: Small Quiet Return to Top Control */}
          <button
            ref={returnTopBtnRef}
            type="button"
            onClick={handleReturnToTop}
            aria-label="Return to top of page"
            className="group inline-flex items-center gap-2 uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors focus-visible:outline-sky-400 cursor-pointer py-1"
          >
            <span
              className="text-sky-400 group-hover:-translate-y-0.5 transition-transform"
              aria-hidden="true"
            >
              ↑
            </span>
            <span>RETURN TO TOP</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
