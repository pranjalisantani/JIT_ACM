"use client";

import React, { useState, useEffect, useRef } from "react";
import { Diamond } from "@/components/ui/Diamond";
import { Magnetic } from "@/components/ui/Magnetic";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Gallery", href: "#gallery" },
  { label: "Projects", href: "#projects" },
  { label: "Team", href: "#team" },
  { label: "Alumni", href: "#alumni" },
] as const;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  // Detect scroll threshold for subtle navbar background opacity shift
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // IntersectionObserver to detect active section
  useEffect(() => {
    const sectionIds = ["hero", "about", "events", "gallery", "projects", "team", "alumni"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Accessibility: Focus trap & Esc listener for mobile overlay dialog
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        menuBtnRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    firstLinkRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    menuBtnRef.current?.focus();
  };

  return (
    <>
      {/* Skip Link (First in keyboard tab order) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:outline focus:outline-2 focus:outline-white text-xs font-mono tracking-wider uppercase"
      >
        Skip to main content
      </a>

      {/* Floating Capsule Navbar Container */}
      <header className="fixed top-4 sm:top-5 inset-x-0 z-50 flex justify-center pointer-events-none px-4">
        {/* Soft Grayscale Glow sitting BEHIND the capsule */}
        <div className="relative pointer-events-auto flex items-center justify-center">
          <div
            aria-hidden="true"
            className="absolute -inset-1.5 rounded-full bg-white/[0.04] blur-xl -z-10 pointer-events-none"
          />

          {/* Main Floating Capsule Pill */}
          <nav
            aria-label="Primary Navigation"
            style={{
              backgroundColor: scrolled ? "rgba(0, 0, 0, 0.86)" : "rgba(0, 0, 0, 0.72)",
              backdropFilter: scrolled ? "blur(20px)" : "blur(16px)",
              WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(16px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: scrolled
                ? "0 0 45px -5px rgba(255, 255, 255, 0.08), 0 12px 32px -8px rgba(0, 0, 0, 0.85)"
                : "0 0 35px -5px rgba(255, 255, 255, 0.05), 0 8px 24px -6px rgba(0, 0, 0, 0.7)",
              transition: "background-color 300ms ease, box-shadow 300ms ease",
            }}
            className="flex items-center gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 py-2 rounded-full text-xs font-mono text-white"
          >
            {/* Left: Identity / Wordmark */}
            <a
              href="#hero"
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors uppercase tracking-[0.16em] font-medium py-1"
              aria-label="ACM FACE home"
            >
              <Diamond size={5} filled={true} />
              <span className="font-semibold tracking-wider">ACM FACE</span>
            </a>

            {/* Center: Desktop Nav Links (Plain text, evenly spaced, opacity shift hover) */}
            <div className="hidden md:flex items-center gap-5 lg:gap-7">
              {NAV_LINKS.map((link) => {
                const targetId = link.href.replace("#", "");
                const isActive = activeSection === targetId;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`relative py-1 flex items-center gap-1.5 uppercase tracking-[0.16em] transition-opacity duration-200 ${
                      isActive ? "text-white opacity-100 font-medium" : "text-white opacity-60 hover:opacity-100"
                    }`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {isActive && <Diamond size={4} filled={true} />}
                    <span>{link.label}</span>
                  </a>
                );
              })}
            </div>

            {/* Right: Circular Icon Buttons + Distinct Rounded Pill CTA */}
            <div className="hidden sm:flex items-center gap-2 pl-1 border-l border-white/[0.12]">
              {/* Circular Icon Button 1: Email / Contact */}
              <Magnetic maxOffset={4}>
                <a
                  href="mailto:contact@jit.acm.org"
                  aria-label="Contact chapter via email"
                  className="w-7 h-7 rounded-full border border-white/[0.14] hover:border-white/50 flex items-center justify-center text-white/60 hover:text-white transition-colors focus-visible:outline-white"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </a>
              </Magnetic>

              {/* Circular Icon Button 2: GitHub / Code */}
              <Magnetic maxOffset={4}>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chapter GitHub Repository"
                  className="w-7 h-7 rounded-full border border-white/[0.14] hover:border-white/50 flex items-center justify-center text-white/60 hover:text-white transition-colors focus-visible:outline-white"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </a>
              </Magnetic>

              {/* Distinct Rounded Pill CTA Button */}
              <Magnetic maxOffset={6}>
                <a
                  href="#about"
                  className="px-3.5 py-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black font-mono text-[11px] uppercase tracking-wider text-white transition-all flex items-center gap-1.5 focus-visible:outline-white"
                >
                  <span>Explore</span>
                  <span className="text-[10px]">↓</span>
                </a>
              </Magnetic>
            </div>

            {/* Mobile: Collapse to hamburger in same capsule */}
            <div className="flex md:hidden">
              <button
                ref={menuBtnRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="p-1 text-white/70 hover:text-white uppercase tracking-[0.16em] flex items-center gap-1.5 focus-visible:outline-white cursor-pointer"
                aria-expanded={isOpen}
                aria-controls="mobile-navigation-sheet"
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              >
                <span>{isOpen ? "CLOSE" : "MENU"}</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Full-Screen Navigation Overlay Sheet */}
      {isOpen && (
        <div
          id="mobile-navigation-sheet"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-2xl text-white p-8 md:hidden"
          style={{
            animation: "fadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
              ACM FACE · MENU
            </span>
            <button
              type="button"
              onClick={closeMenu}
              className="font-mono text-xs uppercase tracking-[0.2em] p-2 text-white/70 hover:text-white focus-visible:outline-white cursor-pointer"
              aria-label="Close navigation menu"
            >
              ESC ✕
            </button>
          </div>

          <nav className="flex flex-col gap-6 my-auto">
            {NAV_LINKS.map((link, idx) => {
              const targetId = link.href.replace("#", "");
              const isActive = activeSection === targetId;

              return (
                <a
                  key={link.href}
                  ref={idx === 0 ? firstLinkRef : undefined}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center gap-4 text-2xl font-light tracking-tight text-white hover:text-white/70 transition-colors"
                >
                  <Diamond size={6} filled={isActive} />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </nav>

          <div className="flex items-center justify-between border-t border-white/[0.14] pt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <span>A LIVING COMPUTING COMMUNITY</span>
            <a
              href="#about"
              onClick={closeMenu}
              className="text-white hover:underline"
            >
              Explore ↓
            </a>
          </div>
        </div>
      )}
    </>
  );
}
