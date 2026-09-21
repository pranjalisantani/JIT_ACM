import { GalleryPhoto } from "@/types";

/**
 * Gallery stream items in chronological order.
 * Mixed aspect ratios: 4:5, 1:1, 16:10, 3:4.
 * When real photos are missing, labelled placeholder frames are provided.
 */
export const GALLERY_ITEMS: GalleryPhoto[] = [
  {
    src: "/gallery/gal-01.jpg",
    width: 800,
    height: 1000, // 4:5
    alt: "Inaugural Chapter Colloquium",
    caption: "Deep dive into distributed systems & student computing charter.",
    year: "2025",
    placeholder: true,
  },
  {
    src: "/gallery/gal-02.jpg",
    width: 800,
    height: 800, // 1:1
    alt: "Systems Lab Session: Kernel Space",
    caption: "Profiling cache misses and memory hierarchies on bare metal.",
    year: "2025",
    placeholder: true,
  },
  {
    src: "/gallery/gal-03.jpg",
    width: 1280,
    height: 800, // 16:10
    alt: "Human-Computer Interaction Showcase",
    caption: "Physical computing prototypes exploring non-tactile spatial inputs.",
    year: "2026",
    placeholder: true,
  },
  {
    src: "/gallery/gal-04.jpg",
    width: 750,
    height: 1000, // 3:4
    alt: "Algorithmic Code Sprint",
    caption: "Peer-led competitive programming and graph algorithm dissection.",
    year: "2026",
    placeholder: true,
  },
  {
    src: "/gallery/gal-05.jpg",
    width: 1280,
    height: 800, // 16:10
    alt: "Research Paper Reading Group",
    caption: "Deconstructing classic foundational papers in computing.",
    year: "2026",
    placeholder: true,
  },
  {
    src: "/gallery/gal-06.jpg",
    width: 800,
    height: 1000, // 4:5
    alt: "Collaborative Terminal Architecture",
    caption: "Open-source development sprint on chapter computational tools.",
    year: "2026",
    placeholder: true,
  },
];
