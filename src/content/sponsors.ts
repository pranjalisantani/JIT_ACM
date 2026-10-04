/**
 * ACM FACE — Sponsors & Ecosystem Content
 * Single source of truth for verified sponsor entities and institutional chapter affiliations.
 */

export interface Sponsor {
  id: string;
  name: string;
  category: "academic" | "systems" | "research";
  logoSrc: string;
  altText: string;
  width?: number;
  height?: number;
}

// Authentic ACM ecosystem partners and institutional chapter entities
export const SPONSORS_DATA: Sponsor[] = [
  {
    id: "acm-parent",
    name: "Association for Computing Machinery",
    category: "academic",
    logoSrc: "/images/sponsors/acm.svg",
    altText: "Association for Computing Machinery",
    width: 220,
    height: 48,
  },
  {
    id: "acm-student-chapter",
    name: "ACM Student Chapter",
    category: "academic",
    logoSrc: "/images/sponsors/acm-student-chapter.svg",
    altText: "ACM Student Chapter Charter",
    width: 200,
    height: 48,
  },
  {
    id: "acm-sigops",
    name: "ACM SIGOPS",
    category: "systems",
    logoSrc: "/images/sponsors/acm-sigops.svg",
    altText: "ACM SIGOPS · Special Interest Group on Operating Systems",
    width: 170,
    height: 48,
  },
  {
    id: "acm-sigarch",
    name: "ACM SIGARCH",
    category: "systems",
    logoSrc: "/images/sponsors/acm-sigarch.svg",
    altText: "ACM SIGARCH · Special Interest Group on Computer Architecture",
    width: 170,
    height: 48,
  },
  {
    id: "acm-sigplan",
    name: "ACM SIGPLAN",
    category: "systems",
    logoSrc: "/images/sponsors/acm-sigplan.svg",
    altText: "ACM SIGPLAN · Special Interest Group on Programming Languages",
    width: 170,
    height: 48,
  },
  {
    id: "acm-dl",
    name: "ACM Digital Library",
    category: "research",
    logoSrc: "/images/sponsors/acm-dl.svg",
    altText: "ACM Digital Library Computing Research Archive",
    width: 180,
    height: 48,
  },
];
