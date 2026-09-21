import { MemberItem } from "@/types";

export const TEAM_MEMBERS: MemberItem[] = [
  {
    id: "tm-01",
    name: "Dr. A. K. Sharma",
    role: "Chapter Faculty Sponsor",
    bio: "Guiding the ACM Student Chapter charter, curriculum initiatives, and institutional research affiliations.",
    links: [
      { label: "Email", url: "mailto:faculty@jit.acm.org" },
    ],
    placeholder: true, // Placeholder until verified by institution
  },
  {
    id: "tm-02",
    name: "Chairperson",
    role: "Chapter Chair",
    bio: "Directing strategic roadmap, chapter stewardship, and inter-chapter partnerships across ACM networks.",
    links: [
      { label: "GitHub", url: "https://github.com" },
      { label: "LinkedIn", url: "https://linkedin.com" },
    ],
    placeholder: true,
  },
  {
    id: "tm-03",
    name: "Vice Chair",
    role: "Vice Chairperson",
    bio: "Overseeing chapter programming, symposium colloquia, and community onboarding.",
    links: [
      { label: "GitHub", url: "https://github.com" },
      { label: "LinkedIn", url: "https://linkedin.com" },
    ],
    placeholder: true,
  },
  {
    id: "tm-04",
    name: "Treasurer",
    role: "Finance & Logistics Officer",
    bio: "Stewardship of chapter grants, project funding allocations, and annual symposium operations.",
    links: [
      { label: "Email", url: "mailto:treasury@jit.acm.org" },
    ],
    placeholder: true,
  },
  {
    id: "tm-05",
    name: "Technical Director",
    role: "Head of Systems & Infrastructure",
    bio: "Architecting chapter internal platforms, server infrastructure, and open-source tooling.",
    links: [
      { label: "GitHub", url: "https://github.com" },
    ],
    placeholder: true,
  },
  {
    id: "tm-06",
    name: "Research Lead",
    role: "Machine Intelligence Lead",
    bio: "Facilitating paper reading groups, model evaluations, and applied generative experiments.",
    links: [
      { label: "GitHub", url: "https://github.com" },
    ],
    placeholder: true,
  },
];

export const FALLBACK_PLACEHOLDER_TEAM: MemberItem[] = [
  { name: "Name", role: "Role", placeholder: true },
  { name: "Name", role: "Role", placeholder: true },
  { name: "Name", role: "Role", placeholder: true },
  { name: "Name", role: "Role", placeholder: true },
  { name: "Name", role: "Role", placeholder: true },
  { name: "Name", role: "Role", placeholder: true },
];
