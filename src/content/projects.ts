import { ProjectItem } from "@/types";

export const PROJECTS_DATA: ProjectItem[] = [
  {
    slug: "synapse-cli",
    title: "Synapse-CLI",
    summary:
      "A keyboard-driven terminal telemetry companion for monitoring distributed cluster workloads with minimal CPU footprint.",
    tags: ["Rust", "eBPF", "TUI", "WebAssembly"],
    repoUrl: "https://github.com",
    url: "#demo",
    placeholder: true, // Marked placeholder until repository is linked by chapter leads
  },
  {
    slug: "graphite-engine",
    title: "Graphite Engine",
    summary:
      "An in-memory property graph engine designed to model chapter member interactions and project dependencies with sub-millisecond traversal.",
    tags: ["TypeScript", "Linear Algebra", "Vector Math"],
    repoUrl: "https://github.com",
    url: "#demo",
    placeholder: true,
  },
  {
    slug: "aether-os-interface",
    title: "Aether OS Interface",
    summary:
      "An experimental spatial desktop surface treating documents as interconnected computational nodes rather than hierarchical folders.",
    tags: ["SVG Canvas", "WebGPU", "Reactive State"],
    repoUrl: "https://github.com",
    url: "#demo",
    placeholder: true,
  },
  {
    slug: "krypton-consensus",
    title: "Krypton Consensus",
    summary:
      "Lightweight pedagogical Raft implementation featuring live network visualizers for teaching distributed algorithms in undergraduate seminars.",
    tags: ["Go", "gRPC", "WebSocket", "SVG"],
    repoUrl: "https://github.com",
    url: "#demo",
    placeholder: true,
  },
];

export const FALLBACK_PLACEHOLDER_PROJECTS: ProjectItem[] = [
  {
    slug: "project-placeholder-1",
    title: "Project title",
    summary: "Active research and implementation in progress.",
    tags: ["Systems", "Prototype"],
    placeholder: true,
  },
  {
    slug: "project-placeholder-2",
    title: "Project title",
    summary: "Active research and implementation in progress.",
    tags: ["Algorithms", "Core"],
    placeholder: true,
  },
  {
    slug: "project-placeholder-3",
    title: "Project title",
    summary: "Active research and implementation in progress.",
    tags: ["Interface", "Web"],
    placeholder: true,
  },
  {
    slug: "project-placeholder-4",
    title: "Project title",
    summary: "Active research and implementation in progress.",
    tags: ["Security", "Network"],
    placeholder: true,
  },
];
