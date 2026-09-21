import { EventItem } from "@/types";

export const EVENTS_DATA: EventItem[] = [
  {
    slug: "neural-architectures-systems",
    title: "State of Computation: Neural Architectures & Systems",
    dateISO: "2026-10-24T17:00:00Z",
    dateLabel: "OCTOBER 24, 2026",
    summary:
      "A technical examination of transformer efficiency, sparse attention, and low-latency edge inference models for next-generation systems.",
    mode: "In-Person & Stream",
    location: "Main Engineering Hall · Stream A",
    status: "open",
    registerUrl: "#rsvp",
    placeholder: true, // Marked placeholder until confirmed by chapter leadership
  },
  {
    slug: "algorithmic-rigor-distributed-consensus",
    title: "Algorithmic Rigor: Graph Topologies & Distributed Consensus",
    dateISO: "2026-11-12T14:00:00Z",
    dateLabel: "NOVEMBER 12, 2026",
    summary:
      "Hands-on workshop breaking down Byzantine fault tolerance, Raft implementations in systems languages, and partition survivability.",
    mode: "In-Person Workshop",
    location: "Computing Systems Lab 04",
    status: "open",
    registerUrl: "#rsvp",
    placeholder: true,
  },
  {
    slug: "winter-hack-computational-interfaces",
    title: "ACM FACE Winter Hack: Computational Interfaces",
    dateISO: "2026-12-05T09:00:00Z",
    dateLabel: "DECEMBER 05–07, 2026",
    summary:
      "Annual chapter build convening student researchers, systems engineers, and interface designers around human-computational tools.",
    mode: "Hackathon",
    location: "Design & Innovation Annex",
    status: "open",
    registerUrl: "#rsvp",
    placeholder: true,
  },
  {
    slug: "ethics-in-autonomous-agents",
    title: "Ethics in Autonomous Agents: Societal Impact Forum",
    dateISO: "2027-01-18T16:00:00Z",
    dateLabel: "JANUARY 18, 2027",
    summary:
      "Interdisciplinary forum addressing alignment, algorithmic bias in governance, and democratic accountability in agentic software.",
    mode: "Symposium",
    location: "Humanities & Sciences Auditorium",
    status: "closing-soon",
    registerUrl: "#rsvp",
    placeholder: true,
  },
  {
    slug: "inaugural-chapter-charter-convening",
    title: "Inaugural Chapter Charter Convening",
    dateISO: "2025-09-15T15:00:00Z",
    dateLabel: "SEPTEMBER 15, 2025",
    summary:
      "Ratification of chapter bylaws, research charter presentation, and inaugural executive council introduction.",
    mode: "Archived Colloquium",
    location: "Auditorium C",
    status: "past",
    placeholder: true,
  },
];

export const FALLBACK_PLACEHOLDER_EVENTS: EventItem[] = [
  {
    slug: "event-placeholder-1",
    title: "Event title",
    dateISO: null,
    dateLabel: "Date TBA",
    summary: "Event description and technical agenda will be announced soon.",
    mode: "TBA",
    location: "Venue TBA",
    status: "tba",
    placeholder: true,
  },
  {
    slug: "event-placeholder-2",
    title: "Event title",
    dateISO: null,
    dateLabel: "Date TBA",
    summary: "Event description and technical agenda will be announced soon.",
    mode: "TBA",
    location: "Venue TBA",
    status: "tba",
    placeholder: true,
  },
  {
    slug: "event-placeholder-3",
    title: "Event title",
    dateISO: null,
    dateLabel: "Date TBA",
    summary: "Event description and technical agenda will be announced soon.",
    mode: "TBA",
    location: "Venue TBA",
    status: "tba",
    placeholder: true,
  },
];
