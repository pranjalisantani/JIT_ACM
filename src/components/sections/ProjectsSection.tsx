"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { Diamond } from "@/components/ui/Diamond";
import { Reveal } from "@/components/ui/Reveal";
import { PROJECTS_DATA } from "@/content/projects";
import { usePrefersReducedMotion } from "@/lib/motion/tokens";
import { gsap } from "@/lib/motion/gsap";

interface ArtifactDetails {
  file: string;
  runtime: string;
  status: string;
  code: string[];
}

const ARTIFACT_DATA: Record<string, ArtifactDetails> = {
  "project-1": {
    file: "kprobe_alloc.bpf.c",
    runtime: "Linux eBPF · Kernel 6.8+",
    status: "ACTIVE KERNEL HOOK",
    code: [
      "// eBPF kernel latency & page allocation probe",
      "SEC(\"kprobe/__alloc_pages_nodemask\")",
      "int BPF_KPROBE(trace_mm_alloc, gfp_t gfp_mask, unsigned int order) {",
      "    u64 pid_tgid = bpf_get_current_pid_tgid();",
      "    u64 ts = bpf_ktime_get_ns();",
      "    bpf_map_update_elem(&start_times, &pid_tgid, &ts, BPF_ANY);",
      "    bpf_perf_event_output(ctx, &events, BPF_F_CURRENT_CPU, &evt, sizeof(evt));",
      "    return 0;",
      "}",
    ],
  },
  "project-2": {
    file: "raft_consensus.rs",
    runtime: "Rust · Deterministic Async Runtime",
    status: "VERIFIED REPLICATED ENGINE",
    code: [
      "// Deterministic Raft consensus state machine",
      "impl<S: StateMachine> RaftNode<S> {",
      "    pub async fn handle_append_entries(&mut self, req: AppendEntries) -> Result<Response> {",
      "        if req.term < self.current_term { return Ok(Reject); }",
      "        self.heartbeat_reset.tick();",
      "        self.commit_index = min(req.leader_commit, req.entries.last_index());",
      "        self.apply_entries_to_state_machine().await?;",
      "        Ok(Success(self.commit_index))",
      "    }",
      "}",
    ],
  },
  "project-3": {
    file: "matrix_graph.wgsl",
    runtime: "WebGPU · WGSL Compute Shader",
    status: "SPATIAL GPU TOPOLOGY",
    code: [
      "// WebGPU sparse matrix graph compute kernel",
      "@compute @workgroup_size(64, 1, 1)",
      "fn compute_graph_layout(@builtin(global_invocation_id) id: vec3<u32>) {",
      "    let node_idx = id.x;",
      "    let vel = velocities[node_idx];",
      "    positions[node_idx] += vel * params.dt * params.damping;",
      "    atomicAdd(&active_particles, 1u);",
      "}",
    ],
  },
  "project-4": {
    file: "verifier.rs",
    runtime: "Rust · Arkworks / Bn254 Curve",
    status: "ZK-SNARK ARITHMETIC PROVER",
    code: [
      "// Zero-Knowledge credential attestation circuit",
      "pub fn verify_credential_proof(",
      "    vk: &VerifyingKey<Bn254>,",
      "    proof: &Proof<Bn254>,",
      "    public_inputs: &[Fr],",
      ") -> Result<bool, VerificationError> {",
      "    let pvk = prepare_verifying_key(vk);",
      "    Groth16::verify_proof(&pvk, proof, public_inputs)",
      "}",
    ],
  },
};

export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  const totalProjects = PROJECTS_DATA.length;
  const currentProject = PROJECTS_DATA[activeIndex] || PROJECTS_DATA[0];
  const artifact = ARTIFACT_DATA[currentProject.slug] || ARTIFACT_DATA["project-1"];

  const goToArtifact = useCallback(
    (targetIndex: number) => {
      if (targetIndex === activeIndex || targetIndex < 0 || targetIndex >= totalProjects) return;

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("acm:field-focus", {
            detail: { region: "projects" },
          })
        );
      }

      if (reducedMotion || !stageRef.current) {
        setActiveIndex(targetIndex);
        return;
      }

      // GSAP choreographed artifact morph
      const tl = gsap.timeline();
      tl.to(stageRef.current, {
        opacity: 0,
        y: -12,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          setActiveIndex(targetIndex);
        },
      });

      tl.fromTo(
        stageRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }
      );

      if (terminalRef.current) {
        tl.fromTo(
          terminalRef.current.children,
          { opacity: 0, x: -8 },
          { opacity: 1, x: 0, stagger: 0.03, duration: 0.35, ease: "power2.out" },
          "-=0.3"
        );
      }
    },
    [activeIndex, reducedMotion, totalProjects]
  );

  const nextArtifact = () => {
    goToArtifact((activeIndex + 1) % totalProjects);
  };

  const prevArtifact = () => {
    goToArtifact((activeIndex - 1 + totalProjects) % totalProjects);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") nextArtifact();
    else if (e.key === "ArrowLeft") prevArtifact();
  };

  return (
    <Section
      id="projects"
      index="04"
      label="PROJECTS"
      title="Research Initiatives & Shipped Artifacts"
    >
      {/* Header Narrative */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 border-b border-white/[0.12] pb-6">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-white/50 mb-2 flex items-center gap-2">
              <Diamond size={5} filled={true} />
              <span>ARTIFACT DISCOVERY // ONE AT A TIME</span>
            </div>
            <p className="text-white/80 text-sm sm:text-base font-light max-w-xl">
              Systems engines, low-level kernel monitors, and cryptographic prototypes built by
              chapter fellows. Inspect each research artifact as an architectural specimen.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              SPECIMEN {String(activeIndex + 1).padStart(2, "0")} / {String(totalProjects).padStart(2, "0")}
            </span>
          </div>
        </div>
      </Reveal>

      {/* Dominant Research Artifact Stage */}
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative w-full border border-white/[0.14] bg-neutral-950/85 p-6 sm:p-10 lg:p-12 overflow-hidden focus:outline-none focus:ring-1 focus:ring-white/40"
        aria-label="Dominant Project Artifact Showcase. Use Arrow Left and Right to inspect artifacts."
      >
        {/* Top Artifact Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.10] pb-5 mb-8">
          <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-white/60">
            <Diamond size={5} filled={true} />
            <span className="text-white/90">{`SYS.0${activeIndex + 1} // RESEARCH ARTIFACT`}</span>
            <span>·</span>
            <span className="text-white/40">{artifact.status}</span>
          </div>

          <div className="font-mono text-xs uppercase tracking-widest px-3 py-1 border border-white/20 bg-white/[0.04] text-white/80">
            {artifact.runtime}
          </div>
        </div>

        {/* Dynamic Artifact Core */}
        <div
          ref={stageRef}
          aria-live="polite"
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
        >
          {/* Left Column: Artifact Identity, Description & Action */}
          <div className="lg:col-span-5 space-y-6">
            <h3
              className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-white leading-[1.12]"
              style={{ fontWeight: 300 }}
            >
              {currentProject.title}
            </h3>

            <p className="text-white/70 text-sm sm:text-base font-light leading-relaxed">
              {currentProject.summary}
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {currentProject.tags?.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 bg-white/[0.04] border border-white/[0.14] text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Specification Link */}
            <div className="pt-4">
              <Link
                href={`/projects/${currentProject.slug}`}
                className="font-mono text-xs uppercase tracking-[0.2em] px-5 py-3 border border-white/30 hover:border-white text-white hover:bg-white hover:text-black transition-all inline-flex items-center gap-2 focus-visible:outline-white"
              >
                <span>READ ARCHITECTURAL SPEC</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Code & Blueprint Terminal Window */}
          <div className="lg:col-span-7">
            <div className="border border-white/[0.12] bg-black/90 rounded-sm overflow-hidden shadow-2xl">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900/90 border-b border-white/[0.10] font-mono text-[11px] text-white/50">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
                  <span className="ml-2 text-white/75">{artifact.file}</span>
                </div>
                <span className="text-[10px] tracking-wider uppercase text-white/40">
                  KERNEL TELEMETRY
                </span>
              </div>

              {/* Code Line Cascade */}
              <div
                ref={terminalRef}
                className="p-5 font-mono text-xs sm:text-sm text-white/60 leading-relaxed overflow-x-auto select-none space-y-1"
              >
                {artifact.code.map((line, idx) => {
                  const isComment = line.trim().startsWith("//");
                  const isKeyword =
                    line.includes("fn ") ||
                    line.includes("impl ") ||
                    line.includes("pub ") ||
                    line.includes("SEC(") ||
                    line.includes("@compute");
                  return (
                    <div key={idx} className="flex">
                      <span className="w-8 shrink-0 text-white/20 select-none text-[11px]">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={
                          isComment
                            ? "text-white/35 italic"
                            : isKeyword
                            ? "text-white/95 font-medium"
                            : "text-white/70"
                        }
                      >
                        {line}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Stage Navigation Stepper Footer */}
        <div className="mt-10 pt-6 border-t border-white/[0.10] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevArtifact}
              aria-label="Previous research artifact"
              className="w-10 h-10 border border-white/20 hover:border-white text-white flex items-center justify-center font-mono text-sm transition-colors cursor-pointer focus-visible:outline-white"
            >
              ←
            </button>
            <button
              type="button"
              onClick={nextArtifact}
              aria-label="Next research artifact"
              className="w-10 h-10 border border-white/20 hover:border-white text-white flex items-center justify-center font-mono text-sm transition-colors cursor-pointer focus-visible:outline-white"
            >
              →
            </button>
            <span className="ml-3 font-mono text-[11px] uppercase tracking-widest text-white/40 hidden sm:inline-block">
              INSPECT SPECIMENS [← / →]
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {PROJECTS_DATA.map((proj, idx) => (
              <button
                key={proj.slug}
                type="button"
                onClick={() => goToArtifact(idx)}
                aria-label={`View ${proj.title}`}
                className={`px-3 py-1.5 border transition-colors cursor-pointer ${
                  idx === activeIndex
                    ? "border-white bg-white text-black font-medium"
                    : "border-white/15 text-white/50 hover:border-white/40 hover:text-white"
                }`}
              >
                0{idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
