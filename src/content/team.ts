import { MemberItem } from "@/types";

export const TEAM_MEMBERS: MemberItem[] = [
  {
    id: "tm-01",
    name: "Arjun Mehta",
    role: "Chapter Chair · Systems & Compilers",
    bio: "Focuses on compiler optimizations and low-level runtime environments. Leading the ACM Student Chapter charter and academic research partnerships.",
    placeholder: false,
    links: [
      { label: "GITHUB", url: "https://github.com" },
      { label: "LINKEDIN", url: "https://linkedin.com" },
    ],
  },
  {
    id: "tm-02",
    name: "Sarah Chen",
    role: "Vice Chair · Distributed Systems",
    bio: "Undergraduate researcher in consensus protocols and fault-tolerant storage architectures. Directing chapter colloquia and technical hackathons.",
    placeholder: false,
    links: [
      { label: "GITHUB", url: "https://github.com" },
      { label: "LINKEDIN", url: "https://linkedin.com" },
    ],
  },
  {
    id: "tm-03",
    name: "Devansh Patel",
    role: "Technical Lead · Kernel & eBPF",
    bio: "Specializing in Linux kernel performance profiling, eBPF telemetry, and memory allocators. Architect of the chapter's open-source systems stack.",
    placeholder: false,
    links: [
      { label: "GITHUB", url: "https://github.com" },
      { label: "LINKEDIN", url: "https://linkedin.com" },
    ],
  },
  {
    id: "tm-04",
    name: "Priya Raman",
    role: "Research Steward · Cryptography & Theory",
    bio: "Conducting theory research in zero-knowledge argument systems and lattice-based cryptography. Host of the weekly algorithmic reading group.",
    placeholder: false,
    links: [
      { label: "GITHUB", url: "https://github.com" },
      { label: "LINKEDIN", url: "https://linkedin.com" },
    ],
  },
  {
    id: "tm-05",
    name: "Kavya Nair",
    role: "Community & Operations Steward",
    bio: "Working at the intersection of Human-Computer Interaction and developer ergonomics. Managing chapter operations, grants, and freshman mentorship.",
    placeholder: false,
    links: [
      { label: "GITHUB", url: "https://github.com" },
      { label: "LINKEDIN", url: "https://linkedin.com" },
    ],
  },
  {
    id: "tm-06",
    name: "Rohan Iyer",
    role: "Infrastructure Steward · WebGPU & Graphics",
    bio: "Exploring real-time spatial computing, sparse matrix GPU shaders, and distributed rendering topologies for the chapter's interactive projects.",
    placeholder: false,
    links: [
      { label: "GITHUB", url: "https://github.com" },
      { label: "LINKEDIN", url: "https://linkedin.com" },
    ],
  },
];

export const FALLBACK_PLACEHOLDER_TEAM: MemberItem[] = TEAM_MEMBERS;
