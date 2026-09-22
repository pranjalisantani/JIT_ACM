import { EventItem } from "@/types";

export const EVENTS_DATA: EventItem[] = [
  {
    slug: "ebpf-kernel-systems-colloquium",
    title: "Kernel Space & eBPF Systems Colloquium",
    dateISO: "2026-10-28T17:30:00Z",
    dateLabel: "OCT 28, 2026 · 17:30 IST",
    summary:
      "A deep dive into Linux kernel tracing, safe kernel programmability with eBPF, and real-time observability pipelines on modern cloud infrastructure.",
    mode: "In-Person & Live Stream",
    location: "Hall CS-204 · Dept. of Computer Science",
    status: "open",
    registerUrl: "#rsvp",
    placeholder: false,
  },
  {
    slug: "distributed-consensus-raft-workshop",
    title: "Distributed Consensus & Raft In Practice",
    dateISO: "2026-11-14T14:00:00Z",
    dateLabel: "NOV 14, 2026 · 14:00 IST",
    summary:
      "Interactive 4-hour hands-on build implementing a verified Raft consensus engine in Rust, complete with deterministic network partition chaos testing.",
    mode: "Systems Workshop",
    location: "Turing Lab A · Systems Wing",
    status: "open",
    registerUrl: "#rsvp",
    placeholder: false,
  },
  {
    slug: "zkp-cryptography-seminar",
    title: "Zero-Knowledge Proofs & Modern Cryptography",
    dateISO: "2026-12-02T16:00:00Z",
    dateLabel: "DEC 02, 2026 · 16:00 IST",
    summary:
      "Deconstructing zk-SNARKs and PLONK arithmetic circuits. Exploring cryptographic credential attestation without information leakage.",
    mode: "Theory & Security Colloquium",
    location: "Seminar Room 302 · Cyber Center",
    status: "open",
    registerUrl: "#rsvp",
    placeholder: false,
  },
  {
    slug: "winter-hackathon-2027",
    title: "Winter Systems Sprint & Hackathon 2027",
    dateISO: "2027-01-16T09:00:00Z",
    dateLabel: "JAN 16–18, 2027 · 48H",
    summary:
      "Our flagship 48-hour systems build. Multi-disciplinary teams architecting open-source developer tooling, network protocols, and spatial interfaces.",
    mode: "48-Hour Hackathon",
    location: "Central Student Technology Commons",
    status: "closing-soon",
    registerUrl: "#rsvp",
    placeholder: false,
  },
  {
    slug: "formal-verification-tla-retrospective",
    title: "Formal Verification with TLA+ and Coq",
    dateISO: "2026-09-12T15:00:00Z",
    dateLabel: "SEP 12, 2026 · ARCHIVED",
    summary:
      "Retrospective and archival notes from our mathematical specification circle covering state machine safety invariants and liveness guarantees.",
    mode: "Research Reading Circle",
    location: "Dept. Library Annex",
    status: "past",
    placeholder: false,
  },
];

export const FALLBACK_PLACEHOLDER_EVENTS: EventItem[] = EVENTS_DATA;
