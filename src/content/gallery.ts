import { GalleryPhoto } from "@/types";

/**
 * Gallery stream items in chronological order.
 * Mixed aspect ratios (16:9, 4:3, 3:4, 1:1) creating an organic photographic rhythm.
 */
export const GALLERY_ITEMS: GalleryPhoto[] = [
  {
    src: "/gallery/gal-01.jpg",
    width: 1920,
    height: 1080, // 16:9
    alt: "Chapter Systems Colloquium",
    caption: "Technical keynote on distributed clusters and systems architecture in university auditorium.",
    year: "2026",
    placeholder: false,
  },
  {
    src: "/gallery/gal-02.jpg",
    width: 1200,
    height: 900, // 4:3
    alt: "Systems Lab Session: Bare Metal",
    caption: "Profiling memory hierarchies, cache hit rates, and hardware controllers on bench workstations.",
    year: "2026",
    placeholder: false,
  },
  {
    src: "/gallery/gal-03.jpg",
    width: 900,
    height: 1200, // 3:4
    alt: "Whiteboard Algorithm Dissection",
    caption: "Peer-led analysis of graph traversal algorithms, asymptotic bounds, and DAG topology proofs.",
    year: "2026",
    placeholder: false,
  },
  {
    src: "/gallery/gal-04.jpg",
    width: 1920,
    height: 1080, // 16:9
    alt: "Night Hackathon & Systems Sprint",
    caption: "Intense collaborative hacking late into the night developing chapter open-source initiatives.",
    year: "2026",
    placeholder: false,
  },
  {
    src: "/gallery/gal-05.jpg",
    width: 1024,
    height: 1024, // 1:1
    alt: "Foundational Paper Reading Circle",
    caption: "Undergraduates and researchers dissecting seminal papers in distributed systems and compilers.",
    year: "2026",
    placeholder: false,
  },
  {
    src: "/gallery/gal-06.jpg",
    width: 900,
    height: 1200, // 3:4
    alt: "Annual Research & Project Showcase",
    caption: "Student fellows presenting real-time spatial computing and WebGPU prototypes to campus community.",
    year: "2026",
    placeholder: false,
  },
  {
    src: "/gallery/evt-hackblitz.jpg",
    width: 993,
    height: 832, // 4:3
    alt: "HackBlitz Season 3 Group Photo",
    caption: "Students holding letters spelling HACKBLITZ at the two-day technology marathon organized by JIT ACM Student Chapter.",
    year: "2026",
    placeholder: false,
  },
  {
    src: "/gallery/evt-certificate-acm.jpg",
    width: 993,
    height: 559, // 16:9
    alt: "ACM-Branded Certificate Presentation",
    caption: "Certificate presentation with ACM branding visible, recognizing chapter achievement and member contributions.",
    year: "2026",
    placeholder: false,
  },
  {
    src: "/gallery/evt-shikhar.jpg",
    width: 993,
    height: 745, // 4:3
    alt: "SHIKHAR Group Photo",
    caption: "SHIKHAR team group photograph at an ACM JIT chapter event.",
    year: "2026",
    placeholder: false,
  },
  {
    src: "/gallery/evt-github-masterclass-speaker.jpg",
    width: 993,
    height: 745, // 4:3
    alt: "GitHub Master Class Speaker Session",
    caption: "Speaker presenting at the GitHub Master Class technical workshop. GPS overlay visible in original.",
    year: "2026",
    placeholder: false,
  },
];
