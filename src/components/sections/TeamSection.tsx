"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Diamond } from "@/components/ui/Diamond";
import { Reveal } from "@/components/ui/Reveal";
import { TEAM_MEMBERS, FALLBACK_PLACEHOLDER_TEAM } from "@/content/team";
import { MemberItem } from "@/types";

export function TeamSection() {
  const members = TEAM_MEMBERS.length > 0 ? TEAM_MEMBERS : FALLBACK_PLACEHOLDER_TEAM;
  const [selectedMember, setSelectedMember] = useState<MemberItem | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const closeDialog = React.useCallback(() => {
    setSelectedMember(null);
    triggerRef.current?.focus();
  }, []);

  // Focus trap and ESC key management for Member Dialog
  useEffect(() => {
    if (!selectedMember) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDialog();
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

    // Focus the first focusable element inside the modal
    const closeBtn = dialogRef.current?.querySelector<HTMLButtonElement>("button");
    closeBtn?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedMember, closeDialog]);

  const openMemberDialog = (member: MemberItem, e: React.MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = e.currentTarget;
    setSelectedMember(member);
  };

  // Split members into 2 balanced rows for static offset layout
  const half = Math.ceil(members.length / 2);
  const row1 = members.slice(0, half);
  const row2 = members.slice(half);

  const renderCard = (member: MemberItem, idx: number) => (
    <button
      key={member.id || `member-${idx}`}
      type="button"
      onClick={(e) => openMemberDialog(member, e)}
      className="group text-left flex flex-col focus-visible:outline-white cursor-pointer w-full"
      aria-haspopup="dialog"
      aria-label={`View profile for ${member.name}, ${member.role}`}
    >
      {/* 4:5 Portrait Frame */}
      <div className="relative w-full aspect-[4/5] rounded-md overflow-hidden bg-neutral-900 border border-white/10 group-hover:border-white/40 transition-colors">
        {member.photo && !member.placeholder ? (
          <Image
            src={member.photo}
            alt={member.name}
            fill
            className="object-cover grayscale"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-white/40">
            <span className="font-mono text-xs uppercase tracking-[0.2em] mb-1 text-white/60">
              Photo
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">
              {member.role}
            </span>
          </div>
        )}
      </div>

      {/* Name and Role ALWAYS visible */}
      <div className="mt-3">
        <h4 className="text-white font-medium text-sm sm:text-base tracking-tight leading-snug group-hover:text-white transition-colors">
          {member.name}
        </h4>
        <p className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.16em] text-white/50 mt-0.5">
          {member.role}
        </p>
        {member.placeholder && (
          <span className="inline-block mt-1 font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">
            [PLACEHOLDER]
          </span>
        )}
      </div>
    </button>
  );

  return (
    <Section id="team" index="05" label="TEAM" title="People & Computational Community">
      {/* Header Description */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 max-w-md">
            Student researchers, systems architects, and chapter leaders directing computational programs.
          </p>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            {members.length} MEMBERS · ROSTER
          </span>
        </div>
      </Reveal>

      {/* Rows of 4:5 Uniform Portrait Cards */}
      <div className="space-y-12">
        {/* Row 1 */}
        <Reveal delay={0}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8">
            {row1.map((member, idx) => renderCard(member, idx))}
          </div>
        </Reveal>

        {/* Row 2 (Offset on larger screens) */}
        <Reveal delay={120}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8 sm:pl-8 lg:pl-16">
            {row2.map((member, idx) => renderCard(member, idx + half))}
          </div>
        </Reveal>
      </div>

      {/* Anchored Member Profile Dialog */}
      {selectedMember && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="member-modal-title"
          ref={dialogRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85"
          style={{
            animation: "fadeIn 180ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDialog();
          }}
        >
          <div className="relative w-full max-w-lg bg-neutral-950 border border-white/20 p-6 sm:p-8 rounded-lg shadow-2xl text-white">
            {/* Close Button */}
            <div className="flex items-center justify-between border-b border-white/[0.14] pb-4 mb-6">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                TEAM DOSSIER
              </span>
              <button
                type="button"
                onClick={closeDialog}
                className="font-mono text-xs uppercase tracking-[0.2em] px-2 py-1 border border-white/20 text-white/70 hover:text-white hover:border-white transition-colors cursor-pointer focus-visible:outline-white"
                aria-label="Close profile dialog"
              >
                ESC ✕
              </button>
            </div>

            {/* Profile Overview */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="relative w-28 sm:w-32 aspect-[4/5] rounded bg-neutral-900 border border-white/10 overflow-hidden shrink-0">
                {selectedMember.photo && !selectedMember.placeholder ? (
                  <Image
                    src={selectedMember.photo}
                    alt={selectedMember.name}
                    fill
                    className="object-cover grayscale"
                    sizes="128px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 font-mono text-xs">
                    Photo
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3
                  id="member-modal-title"
                  className="text-2xl font-light tracking-tight text-white"
                >
                  {selectedMember.name}
                </h3>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-white/60 mt-1">
                  {selectedMember.role}
                </p>
                {selectedMember.bio && (
                  <p className="mt-4 text-sm text-white/70 font-light leading-relaxed">
                    {selectedMember.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Social / Direct Links (Only if they exist; no filler buttons) */}
            {selectedMember.links && selectedMember.links.length > 0 && (
              <div className="mt-6 pt-6 border-t border-white/[0.14] flex flex-wrap gap-4">
                {selectedMember.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs uppercase tracking-[0.2em] text-white/80 hover:text-white flex items-center gap-2 border border-white/20 px-3 py-1.5 hover:border-white transition-colors focus-visible:outline-white"
                  >
                    <span>{link.label}</span>
                    <Diamond size={4} filled={true} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Section>
  );
}
