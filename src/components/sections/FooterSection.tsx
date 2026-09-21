"use client";

import React from "react";
import Link from "next/link";
import { Diamond } from "@/components/ui/Diamond";
import { Hairline } from "@/components/ui/Hairline";
import { Magnetic } from "@/components/ui/Magnetic";
import { SITE_CONFIG, SITE_NAV_LINKS, FOOTER_DATA } from "@/content/site";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";

function subscribeMotion(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("acm:motion-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("acm:motion-change", callback);
  };
}

function getMotionSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return document.documentElement.getAttribute("data-motion") === "paused";
}

function getMotionServerSnapshot(): boolean {
  return false;
}

export function FooterSection() {
  const reducedMotion = usePrefersReducedMotion();
  const isMotionPaused = React.useSyncExternalStore(
    subscribeMotion,
    getMotionSnapshot,
    getMotionServerSnapshot
  );

  const togglePauseMotion = () => {
    const current = document.documentElement.getAttribute("data-motion") === "paused";
    const nextState = !current;
    try {
      if (nextState) {
        document.documentElement.setAttribute("data-motion", "paused");
        localStorage.setItem("acm_motion_paused", "true");
      } else {
        document.documentElement.removeAttribute("data-motion");
        localStorage.removeItem("acm_motion_paused");
      }
      window.dispatchEvent(new CustomEvent("acm:motion-change"));
    } catch {
      // Ignore storage errors
    }
  };

  const handleReachTheTop = () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    });

    // Afterward, move focus to the page <h1> without replaying the opening
    setTimeout(() => {
      const h1 = document.querySelector("h1");
      if (h1) {
        h1.setAttribute("tabindex", "-1");
        h1.focus();
      }
    }, reducedMotion ? 50 : 600);
  };

  return (
    <footer
      id="footer"
      aria-label="Colophon and Site Index"
      className="w-full bg-black text-white pt-24 pb-12 px-6 sm:px-10 lg:px-16 border-t border-white/[0.14]"
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Subtle Computational System Loop Closure Echo */}
        <div
          aria-hidden="true"
          className="flex items-center gap-3 pb-8 font-mono text-[10px] text-white/30 uppercase tracking-[0.25em] select-none"
        >
          <div className="h-[1px] w-8 bg-white/20" />
          <Diamond size={5} filled={false} />
          <span>SYSTEM LOOP // TERMINUS</span>
          <div className="h-[1px] flex-1 max-w-[120px] bg-white/20" />
        </div>

        {/* Large Chapter Wordmark */}
        <div className="pb-16 sm:pb-24">
          <span
            className="block text-6xl sm:text-8xl md:text-9xl lg:text-[140px] font-light tracking-tight text-white/90 leading-none select-none"
            style={{ fontWeight: 300 }}
          >
            {FOOTER_DATA.wordmark}
          </span>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
            {SITE_CONFIG.tagline}
          </p>
        </div>

        <Hairline orientation="horizontal" className="mb-16" />

        {/* Directory & Institutional Data */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16">
          {/* Institutional Information */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-white">
              <Diamond size={5} filled={true} />
              <span>INSTITUTIONAL CHARTER</span>
            </div>
            <p className="text-sm font-light text-white/60 max-w-sm leading-relaxed">
              {SITE_CONFIG.institutionalLine}
            </p>
            <p className="text-xs font-mono text-white/40 uppercase tracking-wider">
              {FOOTER_DATA.institutionalNote}
            </p>
          </div>

          {/* Site Navigation Links */}
          <div className="md:col-span-4 space-y-4">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-white">
              DIRECTORY
            </div>
            <ul className="grid grid-cols-2 gap-3 list-none p-0 m-0">
              {SITE_NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="font-mono text-xs uppercase tracking-[0.16em] text-white/60 hover:text-white transition-colors focus-visible:outline-white inline-flex py-1"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Chapter Utilities (Replay intro & Pause motion) */}
          <div className="md:col-span-3 space-y-4">
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-white">
              EXPERIENCE CONTROLS
            </div>
            <div className="flex flex-col gap-3 font-mono text-xs uppercase tracking-[0.16em]">
              <Link
                href="/?opening=1"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors focus-visible:outline-white py-1"
              >
                <Diamond size={4} filled={false} />
                <span>REPLAY INTRO</span>
              </Link>

              <button
                type="button"
                onClick={togglePauseMotion}
                className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer focus-visible:outline-white py-1 text-left"
                aria-pressed={isMotionPaused}
              >
                <Diamond size={4} filled={isMotionPaused} />
                <span>
                  {isMotionPaused ? "RESUME MOTION" : "PAUSE MOTION"}
                </span>
              </button>
            </div>
          </div>
        </div>

        <Hairline orientation="horizontal" className="mb-8" />

        {/* Bottom Bar: Copyright, Centred Reach the Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-[11px] sm:text-xs uppercase tracking-[0.16em] text-white/40">
          <div>{FOOTER_DATA.copyright}</div>

          {/* Centred Reach the top button */}
          <Magnetic maxOffset={6}>
            <button
              type="button"
              onClick={handleReachTheTop}
              className="px-4 py-2 border border-white/20 text-white/80 hover:text-white hover:border-white transition-colors cursor-pointer focus-visible:outline-white"
              aria-label="Scroll smoothly to the top of the page"
            >
              Reach the top ↑
            </button>
          </Magnetic>

          <div>CHAPTER REVISION 2026</div>
        </div>
      </div>
    </footer>
  );
}
