"use client";

import React, { useState, useEffect, useRef } from "react";
import { Diamond } from "@/components/ui/Diamond";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Projects", href: "#projects" },
  { label: "People", href: "#team" },
] as const;

function GitHubIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
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

function LinkedInIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46V10.9M7.85 6.25a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
    </svg>
  );
}

function XIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function DiscordIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "X", href: "https://x.com/acm_face", icon: XIcon, primary: false },
  { label: "LinkedIn", href: "https://linkedin.com/company/acm-face", icon: LinkedInIcon, primary: false },
  { label: "Instagram", href: "https://instagram.com/acmface", icon: InstagramIcon, primary: false },
  { label: "Discord", href: "https://discord.gg/acm-face", icon: DiscordIcon, primary: false },
  { label: "GitHub", href: "https://github.com/acm-face", icon: GitHubIcon, primary: true },
];

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
    const sectionIds = ["hero", "about", "events", "gallery", "projects", "team"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection(id);
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

      {/* Floating Capsule Navbar & Social Cluster Container */}
      <header className="fixed top-4 sm:top-5 inset-x-0 z-50 flex items-center justify-center pointer-events-none px-3 sm:px-4 gap-2.5 sm:gap-4">
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
              border: "1px solid var(--neon-border)",
              boxShadow: scrolled
                ? "0 0 36px -8px var(--neon-glow), 0 12px 32px -8px rgba(0, 0, 0, 0.85)"
                : "0 0 28px -10px var(--neon-glow), 0 8px 24px -6px rgba(0, 0, 0, 0.7)",
              transition: "background-color 300ms ease, box-shadow 300ms ease",
            }}
            className="flex items-center gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-6 py-2 rounded-full text-xs font-mono text-white"
          >
            {/* Left: Identity / Wordmark */}
            <a
              href="#hero"
              className="flex items-center gap-2 text-white hover:text-white/80 transition-colors uppercase tracking-[0.16em] font-medium py-1"
              aria-label="JIT ACM home"
            >
              <Diamond size={5} filled={true} />
              <span className="font-semibold tracking-wider">JIT ACM</span>
            </a>

            {/* Desktop Nav Links (Quiet, elegant, uppercase tracking) */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
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
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute left-0 right-0 -bottom-[3px] h-px"
                        style={{
                          backgroundColor: "var(--neon)",
                          opacity: 0.55,
                          boxShadow: "0 0 8px var(--neon-glow)",
                        }}
                      />
                    )}
                  </a>
                );
              })}
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

        {/* Social Links Cluster (Positioned beside the navbar with deliberate breathing room) */}
        <div className="relative pointer-events-auto flex items-center">
          <div
            aria-hidden="true"
            className="absolute -inset-1 rounded-full bg-white/[0.03] blur-lg -z-10 pointer-events-none"
          />
          <div
            aria-label="Social Profiles"
            role="toolbar"
            style={{
              backgroundColor: scrolled ? "rgba(0, 0, 0, 0.86)" : "rgba(0, 0, 0, 0.72)",
              backdropFilter: scrolled ? "blur(20px)" : "blur(16px)",
              WebkitBackdropFilter: scrolled ? "blur(20px)" : "blur(16px)",
              border: "1px solid var(--neon-border)",
              boxShadow: scrolled
                ? "0 0 28px -8px var(--neon-glow), 0 12px 32px -8px rgba(0, 0, 0, 0.85)"
                : "0 0 20px -10px var(--neon-glow), 0 8px 24px -6px rgba(0, 0, 0, 0.7)",
              transition: "background-color 300ms ease, box-shadow 300ms ease",
            }}
            className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full"
          >
            {SOCIAL_LINKS.map((item) => {
              const Icon = item.icon;
              if (item.primary) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`JIT ACM on ${item.label}`}
                    className="p-1 rounded-full text-sky-300 border border-sky-400/40 bg-sky-400/10 shadow-[0_0_10px_rgba(56,189,248,0.35)] hover:border-sky-300 hover:shadow-[0_0_14px_rgba(56,189,248,0.55)] transition-all flex items-center justify-center focus-visible:outline-sky-400"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </a>
                );
              }
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`JIT ACM on ${item.label}`}
                  className="p-1 text-white/45 hover:text-white transition-colors flex items-center justify-center focus-visible:outline-white"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              );
            })}
          </div>
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
              JIT ACM · MENU
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

          {/* Mobile Sheet Social Cluster */}
          <div className="flex items-center gap-3 py-4 border-t border-white/[0.10]">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 mr-1">
              CONNECT
            </span>
            {SOCIAL_LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={`mobile-${item.label}`}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`JIT ACM on ${item.label}`}
                  className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
                    item.primary
                      ? "text-sky-300 border border-sky-400/40 bg-sky-400/10 shadow-[0_0_10px_rgba(56,189,248,0.35)]"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

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
