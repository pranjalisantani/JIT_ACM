import { EventItem } from "@/types";

export const EVENTS_DATA: EventItem[] = [
  {
    slug: "acm-installation-2025",
    title: "ACM Installation",
    dateISO: "2025-07-15T09:30:00Z",
    dateLabel: "JUL 15, 2025 · 15:00 IST",
    summary:
      "Installation Ceremony for academic year 2025-26. Formal induction of the new Executive Committee. Strategic vision for the year ahead was unveiled. Guest of Honor: Suhas Katulwar Sir, Executive Member of ACM Nagpur Chapter. Address focused on continuous learning and practical skill development in technology.",
    mode: "Virtual Classroom",
    location: "",
    status: "past",
    registerUrl: "",
    placeholder: false,
  },
  {
    slug: "30days-dev-challenge-2025",
    title: "30DaysDevChallenge",
    dateISO: "2025-07-20T00:00:00Z",
    dateLabel: "JUL 20 – AUG 14, 2025",
    summary:
      "Beginner-friendly programming/software development challenge with hands-on projects in multiple programming languages. Focus on coding and problem-solving foundations, introduction to GitHub, structured 30-day learning schedule. Guided by Technical Head Ayush Mishra. Intended to build skills, confidence, creativity, dedication and consistency.",
    mode: "",
    location: "",
    status: "past",
    registerUrl: "",
    placeholder: false,
  },
  {
    slug: "github-masterclass-2025",
    title: "GitHub MasterClass",
    dateISO: "2025-07-27T09:30:00Z",
    dateLabel: "JUL 27, 2025 · 15:00 IST",
    summary:
      'Technical workshop: "Mastering Git & GitHub: From Code to Open Source". Led by Ayush Mishra, Technical Head. Covered core Git commands and project history, creating and navigating GitHub repositories, open-source contribution process. Practical exposure to version control and collaborative software workflows.',
    mode: "",
    location: "",
    status: "past",
    registerUrl: "",
    placeholder: false,
  },
  {
    slug: "hackblitz-season-3-2026",
    title: "HackBlitz Season 3",
    dateISO: "2026-03-24T00:00:00Z",
    dateLabel: "MAR 24–25, 2026",
    summary:
      "Two-day technology marathon organized by JIT ACM Student Chapter, hosted on Unstop. Two intensive 8-hour coding rounds with 177 participants across 45 teams. Live/on-the-spot problem statements; teams built functional software solutions from scratch. Evaluation included technical complexity, codebase quality, UI/UX execution and practical feasibility.",
    mode: "",
    location: "",
    status: "past",
    registerUrl: "",
    placeholder: false,
  },
  {
    slug: "discover-docker-workshop-2026",
    title: "Discover Docker: Hands-on Workshop",
    dateISO: "2026-04-18T00:00:00Z",
    dateLabel: "APR 18, 2026",
    summary:
      "Hands-on workshop led by JITACM alumnus and Web Master 2024-25, Suraj Hemnani. Introduced Docker and containerization covering build/package/deploy/manage application concepts. Connected academic learning with DevOps, backend deployment and cloud computing. Discussed career opportunities in DevOps, Cloud Computing, Backend Engineering and scalable system design.",
    mode: "",
    location: "",
    status: "past",
    registerUrl: "",
    placeholder: false,
  },
  {
    slug: "chapter-meeting-2026",
    title: "Chapter Meeting",
    dateISO: "2026-09-15T00:00:00Z",
    dateLabel: "SEP 15, 2026",
    summary:
      "Formal introductory meeting for newly selected members. Covered vision, objectives, structure and activities of JIT ACM Student Chapter. Discussed roles and responsibilities. Introduced upcoming technical initiatives, events and workshops. Focused on professional and technical development through ACM.",
    // TODO: The report abstract states "15 September 2027" while structured Start/End fields say 15-Sep-2026.
    // Using 2026 per structured fields. Verify with source which year is correct.
    mode: "",
    location: "",
    status: "past",
    registerUrl: "",
    placeholder: false,
  },
];

export const FALLBACK_PLACEHOLDER_EVENTS: EventItem[] = EVENTS_DATA;