"use client";

import React, { useState, useEffect, useRef } from "react";
import { Diamond } from "@/components/ui/Diamond";
import { SITE_NAV_LINKS } from "@/content/site";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("about");
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  // IntersectionObserver to detect active section without scroll listeners
  useEffect(() => {
    const sectionIds = SITE_NAV_LINKS.map((item) => item.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Accessibility: Focus trap & Esc listener for mobile dialog
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
    // Move focus inside dialog
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
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:outline focus:outline-2 focus:outline-white text-xs font-mono tracking-wider uppercase"
      >
        Skip to main content
      </a>

      {/* Floating Pill Header */}
      <header className="fixed top-5 inset-x-0 z-40 flex justify-center pointer-events-none px-4">
        <div
          className="pointer-events-auto flex items-center justify-between gap-6 sm:gap-8 px-5 py-2.5 rounded-full text-xs font-mono text-white transition-colors"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.72)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
          }}
        >
          {/* Logo / Chapter Identity */}
          <a
            href="#about"
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors uppercase tracking-[0.16em] font-medium"
            aria-label="ACM FACE home"
          >
            <span>ACM FACE</span>
          </a>

          {/* Desktop Navigation Links */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6">
            {SITE_NAV_LINKS.map((link) => {
              const targetId = link.href.replace("#", "");
              const isActive = activeSection === targetId;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 flex items-center gap-2 uppercase tracking-[0.16em] transition-colors ${
                    isActive ? "text-white font-medium" : "text-white/60 hover:text-white"
                  }`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {isActive && <Diamond size={5} filled={true} />}
                  <span>{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              ref={menuBtnRef}
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="p-1 text-white/70 hover:text-white uppercase tracking-[0.16em] flex items-center gap-1.5 focus-visible:outline-white cursor-pointer"
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-dialog"
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <span>{isOpen ? "CLOSE" : "MENU"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Navigation Dialog */}
      {isOpen && (
        <div
          id="mobile-navigation-dialog"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-white p-8 md:hidden"
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
            {SITE_NAV_LINKS.map((link, idx) => {
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

          <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
            A LIVING COMPUTING COMMUNITY
          </div>
        </div>
      )}
    </>
  );
}
