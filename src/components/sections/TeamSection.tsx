"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { TEAM_MEMBERS } from "@/content/team";
import { ALUMNI_MEMBERS } from "@/content/alumni";
import { MemberItem, AlumniItem, MemberLink } from "@/types";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";

function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.77v8.37H6.46V10.9M7.85 6.25a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
    </svg>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function findLink(links: MemberLink[] | undefined, kind: "github" | "linkedin"): string | undefined {
  return links?.find((link) => link.label.toLowerCase().includes(kind))?.url;
}

/**
 * Single Member Profile Block (Equal visual weight, compact, no cards/HUD)
 */
function MemberCard({
  member,
  isClone = false,
  onLinkClick,
}: {
  member: MemberItem;
  isClone?: boolean;
  onLinkClick?: (e: React.MouseEvent) => void;
}) {
  const initials = getInitials(member.name);
  const githubUrl = findLink(member.links, "github");
  const linkedinUrl = findLink(member.links, "linkedin");

  // Increase clickable area for social links (44x44px minimum touch target)
  const linkHitAreaStyle = {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties;

  return (
    <div
      className="flex flex-col min-w-[130px] max-w-[170px] w-full sm:min-w-[150px] md:min-w-[170px] shrink-0 select-none group"
      aria-hidden={isClone ? "true" : undefined}
    >
      {/* Compact Portrait Frame with solid dark backdrop preventing particle bleed-through */}
      <div className="relative w-full aspect-square overflow-hidden bg-[#0d0f14] border border-white/[0.08] group-hover:border-white/20 transition-colors duration-300 mb-2 sm:mb-2.5 flex items-center justify-center">
        {member.photo && !member.placeholder ? (
          <Image
            src={member.photo}
            alt={isClone ? "" : member.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 130px, (max-width: 768px) 150px, 170px"
          />
        ) : (
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/[0.12] bg-white/[0.04] flex items-center justify-center font-mono text-xs sm:text-sm font-light tracking-[0.14em] text-white/90">
            {initials}
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="text-xs sm:text-sm font-medium tracking-tight text-white leading-snug truncate">
        {member.name}
      </h3>

      {/* Designation / Role */}
      <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.10em] text-white/55 mt-0.5 leading-tight truncate">
        {member.role}
      </p>

      {/* Social Links */}
      {(linkedinUrl || githubUrl) && (
        <div className="flex items-center gap-2.5 mt-1.5 text-white/40">
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={isClone ? -1 : 0}
              onClick={onLinkClick}
              aria-label={`${member.name} on LinkedIn`}
              className="hover:text-white transition-colors focus-visible:outline-sky-400"
              style={linkHitAreaStyle}
            >
              <LinkedInIcon className="w-5 h-5" />
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={isClone ? -1 : 0}
              onClick={onLinkClick}
              aria-label={`${member.name} on GitHub`}
              className="hover:text-white transition-colors focus-visible:outline-sky-400"
              style={linkHitAreaStyle}
            >
              <GitHubIcon className="w-5 h-5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Two-Lane Continuous Horizontal Stream with Pointer Drag and Touch Swipe
 */
function TeamLane({
  members,
  direction,
  reducedMotion,
  laneAriaLabel,
}: {
  members: MemberItem[];
  direction: "left" | "right";
  reducedMotion: boolean;
  laneAriaLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const cycleRef = useRef<HTMLDivElement | null>(null);

  // Position & physics state
  const posX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const isHovering = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const startOffset = useRef<number>(0);
  const hasMoved = useRef<boolean>(false);
  const isHorizontalDrag = useRef<boolean>(false);
  const isVerticalScroll = useRef<boolean>(false);
  const lastX = useRef<number>(0);
  const lastTime = useRef<number>(0);
  const momentumVel = useRef<number>(0);
  const cycleWidth = useRef<number>(0);

  // Base speed: +0.25 px/frame for rightward, -0.25 px/frame for leftward
  // Slower speed gives users more time to read member info before cards move away
  const baseSpeed = direction === "right" ? 0.25 : -0.25;

  // Ensure minimum cycle width by repeating members if count is small
  const repeatCount = Math.max(2, Math.ceil(8 / Math.max(1, members.length)));
  const cycleMembers = Array.from({ length: repeatCount }, () => members).flat();

  // Measure cycle width on mount and resize
  const measure = useCallback(() => {
    if (cycleRef.current) {
      cycleWidth.current = cycleRef.current.scrollWidth;
    }
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Animation frame loop for continuous drift & drag momentum
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const W = cycleWidth.current;

      // Pause drift when dragging, hovering, or reduced motion
      if (!isDragging.current && !isHovering.current) {
        if (Math.abs(momentumVel.current) > 0.05) {
          posX.current += momentumVel.current;
          momentumVel.current *= 0.94; // exponential friction decay
        } else {
          momentumVel.current = 0;
          if (!reducedMotion) {
            posX.current += baseSpeed;
          }
        }

        // Invisible wrap within [-W, 0]
        if (W > 0) {
          while (posX.current < -W) posX.current += W;
          while (posX.current > 0) posX.current -= W;
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${posX.current}px, 0, 0)`;
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [baseSpeed, reducedMotion]);

  // Pointer Down (Mouse drag or touch start)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startY.current = e.clientY;
    startOffset.current = posX.current;
    lastX.current = e.clientX;
    lastTime.current = performance.now();
    momentumVel.current = 0;
    hasMoved.current = false;
    isHorizontalDrag.current = false;
    isVerticalScroll.current = false;

    // Capture pointer on desktop
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore if not supported
    }
  };

  // Pointer Move (Drag tracking with vertical scroll detection)
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || isVerticalScroll.current) return;

    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    // Direction locking: If vertical delta dominates, yield to normal page scroll
    if (!isHorizontalDrag.current && !isVerticalScroll.current) {
      // More sensitive vertical detection for mobile
      const verticalThreshold = typeof window !== "undefined" && window.innerWidth < 768 ? 5 : 7;
      if (Math.abs(dy) > verticalThreshold && Math.abs(dy) > Math.abs(dx)) {
        isVerticalScroll.current = true;
        isDragging.current = false;
        return;
      }
      if (Math.abs(dx) > 5) {
        isHorizontalDrag.current = true;
      }
    }

    if (isHorizontalDrag.current) {
      hasMoved.current = true;
      const now = performance.now();
      const dt = now - lastTime.current;
      if (dt > 0) {
        // Compute speed in px/frame (~16.6ms)
        const instantSpeed = ((e.clientX - lastX.current) / dt) * 16.6;
        momentumVel.current = Math.min(Math.max(instantSpeed, -18), 18);
      }
      lastX.current = e.clientX;
      lastTime.current = now;

      posX.current = startOffset.current + dx;

      // Wrap immediately during drag
      const W = cycleWidth.current;
      if (W > 0) {
        while (posX.current < -W) posX.current += W;
        while (posX.current > 0) posX.current -= W;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${posX.current}px, 0, 0)`;
      }
    }
  };

  // Pointer Up / Cancel
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    // Reset moved flag after a short delay so link clicks during drag are cancelled
    setTimeout(() => {
      hasMoved.current = false;
    }, 80);
  };

  // Hover handlers to pause auto-drift
  const handleMouseEnter = () => {
    isHovering.current = true;
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
  };

  // Touch handlers for mobile hover-like behavior
  const handleTouchStart = () => {
    isHovering.current = true;
  };

  const handleTouchEnd = () => {
    // Brief delay to allow tap/click to register before resuming
    setTimeout(() => {
      isHovering.current = false;
    }, 150);
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (hasMoved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Increase clickable area for social links on touch devices
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const linkHitAreaStyle = {
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as React.CSSProperties;

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={laneAriaLabel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-full overflow-hidden touch-pan-y cursor-grab active:cursor-grabbing select-none"
    >
      {/* Lateral gradient edge fade masks */}
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"
      />

      {/* Moving Track */}
      <div
        ref={trackRef}
        className="flex items-start w-max will-change-transform"
      >
        {/* Cycle A: Primary accessible member instances */}
        <div
          ref={cycleRef}
          className="flex items-start gap-3 sm:gap-4 md:gap-5 pr-3 sm:pr-4 md:pr-5 shrink-0"
        >
          {cycleMembers.map((member, idx) => (
            <MemberCard
              key={`primary-${member.id || idx}-${idx}`}
              member={member}
              isClone={false}
              onLinkClick={handleLinkClick}
            />
          ))}
        </div>

        {/* Cycle B: Cloned sequence for continuous seamless loop */}
        <div
          aria-hidden="true"
          className="flex items-start gap-3 sm:gap-4 md:gap-5 pr-3 sm:pr-4 md:pr-5 shrink-0 select-none"
        >
          {cycleMembers.map((member, idx) => (
            <MemberCard
              key={`clone-${member.id || idx}-${idx}`}
              member={member}
              isClone={true}
              onLinkClick={handleLinkClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Stable deterministic combined roster: TEAM_MEMBERS + ALUMNI_MEMBERS
const ALUMNI_AS_MEMBERS: MemberItem[] = ALUMNI_MEMBERS.map((alumnus: AlumniItem) => ({
  id: alumnus.id,
  name: alumnus.name,
  role: alumnus.formerRole,
  bio: alumnus.contributions,
  links: alumnus.links,
  placeholder: false,
}));

const ALL_PEOPLE: MemberItem[] = [...TEAM_MEMBERS, ...ALUMNI_AS_MEMBERS];

export function TeamSection() {
  const reducedMotion = usePrefersReducedMotion();

  // Split authentic members deterministically across two independent horizontal rows
  // Row 1: even indices, drifts right (→)
  // Row 2: odd indices, drifts left (←)
  const row1Members = ALL_PEOPLE.filter((_, idx) => idx % 2 === 0);
  const row2Members = ALL_PEOPLE.filter((_, idx) => idx % 2 !== 0);

  return (
    <section
      id="team"
      aria-label="People: Team and Alumni Roster"
      className="relative w-full text-white bg-transparent py-10 sm:py-16 lg:py-20 overflow-hidden select-none"
    >
      <span id="people" className="sr-only" aria-hidden="true" />
      <div className="w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 flex flex-col mb-6 sm:mb-8">
        {/* Clean PEOPLE Identifier */}
        <div className="border-b border-white/[0.08] pb-3">
          <h2 className="text-xs sm:text-sm font-mono tracking-[0.24em] uppercase text-white/80 font-medium">
            PEOPLE
          </h2>
        </div>
      </div>

      {/* Two-Lane Continuous Horizontal People Roster */}
      <div className="flex flex-col space-y-4 sm:space-y-6 w-full">
        {/* ROW 1: Continuously moves rightward (→) */}
        <TeamLane
          members={row1Members}
          direction="right"
          reducedMotion={reducedMotion}
          laneAriaLabel="People Roster Lane 1"
        />

        {/* ROW 2: Continuously moves leftward (←) */}
        <TeamLane
          members={row2Members}
          direction="left"
          reducedMotion={reducedMotion}
          laneAriaLabel="People Roster Lane 2"
        />
      </div>
    </section>
  );
}
