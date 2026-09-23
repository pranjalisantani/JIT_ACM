/**
 * ACM FACE — Site Configuration & Content
 * Single source of truth for site-wide metadata, institutional copy, and pillars.
 */

export const SITE_CONFIG = {
  name: "ACM FACE",
  tagline: "A LIVING COMPUTING COMMUNITY",
  shortDescription:
    "A living computing community grounded in computational rigor, research, and craft.",
  institutionalLine: "Association for Computing Machinery · Student Chapter",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://acm-face.org",
  year: 2026,
  scrollTarget: "#about",
  placeholder: true, // Pending owner confirmation of official chapter charter
} as const;

export const HERO_STATEMENT = {
  line1: "A living computing community",
  line2: "grounded in computational rigor, research, and craft.",
  scrollLabel: "Explore chapter ↓",
};

export interface Pillar {
  id: string;
  title: string;
  description: string;
  href?: string;
  isInteractiveButton?: boolean;
}

export const ABOUT_PILLARS: Record<"people" | "events" | "projects" | "learning", Pillar> = {
  people: {
    id: "people",
    title: "People",
    description: "Students, researchers, and engineers convening in rigorous computational practice.",
    href: "#team",
  },
  events: {
    id: "events",
    title: "Events",
    description: "Colloquia, research sessions, and continuous builds exploring machine frontiers.",
    href: "#events",
  },
  projects: {
    id: "projects",
    title: "Projects",
    description: "Open-source platforms, systems implementations, and experimental software.",
    href: "#projects",
  },
  learning: {
    id: "learning",
    title: "Learning",
    description: "Archival paper dissections, algorithmic rigor, and peer-to-peer technical mentorship.",
    href: undefined,
    isInteractiveButton: true,
  },
};

export const SITE_NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Projects", href: "#projects" },
  { label: "Team", href: "#team" },
] as const;

export const FOOTER_DATA = {
  wordmark: "ACM FACE",
  institutionalNote: "ACM Student Chapter · Computing Society & Systems Research Forum",
  copyright: "© 2026 ACM FACE. All rights reserved.",
  placeholder: true,
};
