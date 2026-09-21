export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export interface SectionMeta {
  id: string;
  index: string;
  title: string;
  tagline?: string;
}

export type EventStatus = "open" | "closing-soon" | "closed" | "past" | "tba";

export interface EventItem {
  slug: string;
  title: string;
  dateISO: string | null;
  dateLabel: string;
  summary: string;
  mode: string;
  location: string;
  status: EventStatus;
  registerUrl?: string;
  image?: string;
  placeholder?: boolean;
}

export interface ACMEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue?: string;
  category: "Colloquium" | "Hackathon" | "Workshop" | "Symposium" | "Tech Talk";
  description: string;
  status: "Upcoming" | "Completed" | "Open for RSVP";
  rsvpUrl?: string;
  highlights?: string[];
  placeholder?: boolean;
}

export interface GalleryPhoto {
  id?: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  year?: string;
  placeholder?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  date: string;
  category: string;
  dimensions: string;
  accent: string;
  placeholder?: boolean;
}

export interface ProjectItem {
  slug: string;
  title: string;
  summary: string;
  tags?: string[];
  url?: string;
  repoUrl?: string;
  image?: string;
  placeholder?: boolean;
}

export interface ACMProject {
  id: string;
  title: string;
  code: string;
  status: "Active Research" | "Prototype" | "Public Alpha" | "Core System";
  category: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  demoUrl?: string;
  offset: { x: number; y: number; rotate: number };
  placeholder?: boolean;
}

export interface MemberLink {
  label: string;
  url: string;
}

export interface MemberItem {
  id?: string;
  name: string;
  role: string;
  photo?: string;
  bio?: string;
  links?: MemberLink[];
  placeholder?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  tier: "Executive" | "Technical" | "Design & Operations";
  discipline: string;
  bio: string;
  row: 1 | 2 | 3;
  initials: string;
  socials: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
  placeholder?: boolean;
}

