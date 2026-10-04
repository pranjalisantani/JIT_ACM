import { NavItem, SectionMeta } from "@/types";

export const NAVIGATION_ITEMS: NavItem[] = [
  { label: "Opening", href: "#opening" },
  { label: "About", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Gallery", href: "#gallery" },
  { label: "Projects", href: "#projects" },
  { label: "People", href: "#team" },
];

export const SECTIONS_META: Record<string, SectionMeta> = {
  opening: {
    id: "opening",
    index: "00",
    title: "Opening",
    tagline: "Computational Society & Design Forum",
  },
  about: {
    id: "about",
    index: "01",
    title: "About",
    tagline: "Perspective & Purpose",
  },
  events: {
    id: "events",
    index: "02",
    title: "Events",
    tagline: "Convenings & Timeline",
  },
  gallery: {
    id: "gallery",
    index: "03",
    title: "Gallery",
    tagline: "Visual Documentation & Archive",
  },
  projects: {
    id: "projects",
    index: "04",
    title: "Projects",
    tagline: "Initiatives & Research Artifacts",
  },
  team: {
    id: "team",
    index: "05",
    title: "People",
    tagline: "People & Computational Community",
  },
  footer: {
    id: "footer",
    index: "06",
    title: "Footer",
    tagline: "Colophon & Affiliations",
  },
};
