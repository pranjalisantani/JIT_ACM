"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Diamond } from "@/components/ui/Diamond";
import { Reveal } from "@/components/ui/Reveal";
import { PROJECTS_DATA } from "@/content/projects";

const PROJECT_BLUEPRINTS: Record<string, string[]> = {
  "project-1": [
    "// eBPF kernel latency probe",
    "SEC(\"kprobe/__alloc_pages_nodemask\")",
    "int trace_mm_alloc(struct pt_regs *ctx) {",
    "  u64 pid = bpf_get_current_pid_tgid();",
    "  u64 ts = bpf_ktime_get_ns();",
    "  bpf_map_update_elem(&start_times, &pid, &ts, BPF_ANY);",
    "  return 0;",
    "}",
  ],
  "project-2": [
    "// Deterministic Raft consensus state",
    "impl<S: StateMachine> RaftNode<S> {",
    "  pub async fn handle_append_entries(&mut self, req: AppendEntries) -> Result<Response> {",
    "    if req.term < self.current_term { return Ok(Reject); }",
    "    self.heartbeat_reset.tick();",
    "    self.commit_index = min(req.leader_commit, req.entries.last_index());",
    "    Ok(Success(self.commit_index))",
    "  }",
    "}",
  ],
  "project-3": [
    "// WebGPU sparse matrix graph kernel",
    "@compute @workgroup_size(64, 1, 1)",
    "fn compute_graph_layout(@builtin(global_invocation_id) id: vec3<u32>) {",
    "  let node_idx = id.x;",
    "  let vel = velocities[node_idx];",
    "  positions[node_idx] += vel * dt * damping;",
    "  atomicAdd(&active_particles, 1u);",
    "}",
  ],
  "project-4": [
    "// ZK-SNARK credential verification",
    "pub fn verify_credential_proof(",
    "  vk: &VerifyingKey<Bn254>,",
    "  proof: &Proof<Bn254>,",
    "  public_inputs: &[Fr],",
    ") -> Result<bool, VerificationError> {",
    "  let pvk = prepare_verifying_key(vk);",
    "  Groth16::verify_proof(&pvk, proof, public_inputs)",
    "}",
  ],
};

export function ProjectsSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleCardHover = (idx: number | null) => {
    setHoveredIdx(idx);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("acm:field-focus", {
          detail: { region: idx !== null ? "projects" : null },
        })
      );
    }
  };

  return (
    <Section
      id="projects"
      index="04"
      label="PROJECTS"
      title="Research Initiatives & Shipped Artifacts"
    >
      {/* Header Description */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-16 border-b border-white/[0.12] pb-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 max-w-md">
            Open-source systems, algorithmic engines, and spatial computing prototypes developed by chapter fellows.
          </p>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/40">
            <span className="w-2 h-2 rounded-full bg-white/30 animate-pulse" />
            <span>{PROJECTS_DATA.length} ACTIVE INITIATIVES · ARCHITECTURAL REPO</span>
          </div>
        </div>
      </Reveal>

      {/* 2x2 Architectural Technical Workspace Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 border border-white/[0.14] divide-y md:divide-y-0 md:divide-x divide-white/[0.14] bg-black/60">
        {PROJECTS_DATA.map((project, idx) => {
          const isHovered = hoveredIdx === idx;
          const isAnyHovered = hoveredIdx !== null;
          const cardOpacity = isAnyHovered ? (isHovered ? 1 : 0.35) : 1;
          const blueprint = PROJECT_BLUEPRINTS[project.slug] || [];

          return (
            <div
              key={project.slug}
              className="relative transition-all duration-300 group flex flex-col justify-between p-6 sm:p-8 lg:p-10"
              style={{ opacity: cardOpacity }}
              onMouseEnter={() => handleCardHover(idx)}
              onMouseLeave={() => handleCardHover(null)}
            >
              <div>
                {/* Header Metadata */}
                <div className="flex items-center justify-between font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/45 mb-6 border-b border-white/[0.08] pb-3">
                  <div className="flex items-center gap-2 text-white/70">
                    <Diamond size={5} filled={isHovered} />
                    <span>{`SYS.0${idx + 1} // INITIATIVE`}</span>
                  </div>
                  <span className="text-white/40">ACTIVE SPEC</span>
                </div>

                {/* Project Headline */}
                <h3 className="text-2xl sm:text-3xl font-light tracking-tight text-white group-hover:text-white transition-colors leading-[1.2]">
                  {project.title}
                </h3>

                {/* Summary */}
                <p className="mt-4 text-xs sm:text-sm text-white/65 font-light leading-relaxed">
                  {project.summary}
                </p>

                {/* Technical Blueprint Code Window */}
                <div className="mt-6 p-4 rounded-sm bg-neutral-950/80 border border-white/[0.10] font-mono text-[11px] text-white/50 leading-relaxed overflow-x-auto select-none pointer-events-none group-hover:border-white/20 transition-colors">
                  {blueprint.map((line, lineIdx) => (
                    <div
                      key={lineIdx}
                      className={
                        line.startsWith("//")
                          ? "text-white/30"
                          : line.includes("fn") || line.includes("pub")
                          ? "text-white/80"
                          : "text-white/55"
                      }
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer: Tags & Specification Link */}
              <div className="mt-8 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-1.5">
                  {project.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-white/[0.04] border border-white/[0.12] text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  onFocus={() => handleCardHover(idx)}
                  onBlur={() => handleCardHover(null)}
                  aria-label={`View technical specification for ${project.title}`}
                  className="font-mono text-xs uppercase tracking-wider text-white/85 group-hover:text-white inline-flex items-center gap-1.5 border border-white/20 group-hover:border-white px-3 py-1.5 transition-colors focus-visible:outline-white"
                >
                  <span>SPECIFICATION</span>
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
