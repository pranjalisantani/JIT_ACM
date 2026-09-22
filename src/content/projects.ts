import { ProjectItem } from "@/types";

export const PROJECTS_DATA: ProjectItem[] = [
  {
    slug: "project-1",
    title: "Kernel Memory Instrumentation",
    summary:
      "eBPF-driven performance monitoring infrastructure providing nanosecond-precision cache profiling and memory hierarchy analysis on Linux kernels.",
    tags: ["Systems", "eBPF", "Rust"],
    placeholder: false,
  },
  {
    slug: "project-2",
    title: "Distributed State Machine Consensus",
    summary:
      "High-throughput Raft consensus implementation in Rust featuring deterministic asynchronous simulation, network partition resilience, and formal TLA+ specifications.",
    tags: ["Distributed Systems", "Raft", "Formal Methods"],
    placeholder: false,
  },
  {
    slug: "project-3",
    title: "Spatial Graph & Topology Engine",
    summary:
      "Sparse matrix graph computation library and WebGL rendering pipeline designed for real-time visual inspection of high-dimensional peer networks.",
    tags: ["Algorithms", "WebGL", "Topology"],
    placeholder: false,
  },
  {
    slug: "project-4",
    title: "Zero-Knowledge Cryptographic Prover",
    summary:
      "Succinct non-interactive zero-knowledge argument system tailored for privacy-preserving academic credential verification and decentralized student identity.",
    tags: ["Cryptography", "ZK-SNARKs", "Security"],
    placeholder: false,
  },
];

export const FALLBACK_PLACEHOLDER_PROJECTS: ProjectItem[] = PROJECTS_DATA;
