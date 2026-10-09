import { GalleryPhoto } from "@/types";

/**
 * Gallery stream items in chronological order.
 * Mixed aspect ratios (16:9, 4:3, 3:4, 1:1) creating an organic photographic rhythm.
 */
export const GALLERY_ITEMS: GalleryPhoto[] = [
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