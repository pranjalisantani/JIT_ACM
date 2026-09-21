import { ACMEvent, GalleryItem, ACMProject, TeamMember } from "@/types";

export const EVENTS_DATA: ACMEvent[] = [
  {
    id: "event-01",
    title: "Event title",
    date: "Date TBA",
    category: "Colloquium",
    description: "Event description and technical agenda will be announced soon.",
    status: "Open for RSVP",
    placeholder: true,
  },
  {
    id: "event-02",
    title: "Event title",
    date: "Date TBA",
    category: "Colloquium",
    description: "Event description and technical agenda will be announced soon.",
    status: "Upcoming",
    placeholder: true,
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "gal-01",
    title: "Inaugural Chapter Colloquium",
    caption: "Deep dive into distributed systems & student computing charter.",
    date: "2025",
    category: "Convening",
    dimensions: "16:9",
    accent: "#a3a3a3",
    placeholder: true,
  },
  {
    id: "gal-02",
    title: "Systems Lab Session",
    caption: "Profiling cache misses and memory hierarchies on bare metal.",
    date: "2025",
    category: "Session",
    dimensions: "4:3",
    accent: "#737373",
    placeholder: true,
  },
];

export const PROJECTS_DATA: ACMProject[] = [
  {
    id: "prj-01",
    title: "Project title",
    code: "SYS-01",
    status: "Active Research",
    category: "Systems",
    description: "Active research and computational implementation in progress.",
    techStack: ["Rust", "Systems"],
    offset: { x: -280, y: -160, rotate: -3 },
    placeholder: true,
  },
  {
    id: "prj-02",
    title: "Project title",
    code: "SYS-02",
    status: "Active Research",
    category: "Algorithms",
    description: "Active research and computational implementation in progress.",
    techStack: ["TypeScript", "Math"],
    offset: { x: 280, y: -140, rotate: 2 },
    placeholder: true,
  },
];

export const TEAM_MEMBERS_DATA: TeamMember[] = [
  {
    id: "tm-01",
    name: "Name",
    role: "Role",
    tier: "Executive",
    discipline: "Computing",
    bio: "Guiding the chapter charter, curriculum initiatives, and research affiliations.",
    row: 1,
    initials: "AC",
    socials: {},
    placeholder: true,
  },
  {
    id: "tm-02",
    name: "Name",
    role: "Role",
    tier: "Executive",
    discipline: "Computing",
    bio: "Directing strategic roadmap, chapter stewardship, and partnerships.",
    row: 1,
    initials: "AC",
    socials: {},
    placeholder: true,
  },
];
