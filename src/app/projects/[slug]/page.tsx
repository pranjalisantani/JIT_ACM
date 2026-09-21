import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { PROJECTS_DATA } from "@/content/projects";
import { Diamond } from "@/components/ui/Diamond";
import { Hairline } from "@/components/ui/Hairline";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS_DATA.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS_DATA.find((p) => p.slug === slug);

  if (!project) {
    return {
      title: "Project Not Found · ACM FACE",
    };
  }

  return {
    title: `${project.title} · ACM FACE Projects`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = PROJECTS_DATA.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 sm:px-10 lg:px-16 py-16 sm:py-24 max-w-[1440px] mx-auto">
      {/* Back Navigation */}
      <nav className="mb-12">
        <Link
          href="/#projects"
          className="font-mono text-xs uppercase tracking-[0.2em] text-white/60 hover:text-white flex items-center gap-2 transition-colors focus-visible:outline-white inline-flex py-2"
        >
          <span>←</span>
          <span>RETURN TO PROJECTS</span>
        </Link>
      </nav>

      {/* Main Project Dossier */}
      <main className="max-w-4xl">
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-white/50 mb-6">
          <Diamond size={6} filled={true} />
          <span>PROJECT DOSSIER</span>
          {project.placeholder && (
            <span className="text-white/30">[PLACEHOLDER ARTIFACT]</span>
          )}
        </div>

        <h1
          className="text-4xl sm:text-6xl font-light tracking-tight text-white mb-8"
          style={{ fontWeight: 300 }}
        >
          {project.title}
        </h1>

        <p className="text-lg sm:text-xl font-light text-white/70 leading-relaxed mb-12">
          {project.summary}
        </p>

        <Hairline orientation="horizontal" className="my-10" />

        {/* Technical Stack Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="mb-10">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 mb-4">
              COMPUTATIONAL STACK
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs px-3 py-1 bg-neutral-900 border border-white/10 text-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-4 pt-6">
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-[0.2em] border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors focus-visible:outline-white inline-flex items-center gap-2"
            >
              <span>SOURCE REPOSITORY</span>
              <Diamond size={4} filled={true} />
            </a>
          )}
          {project.url && project.url !== "#demo" && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs uppercase tracking-[0.2em] border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-colors focus-visible:outline-white inline-flex items-center gap-2"
            >
              <span>LIVE DEMO</span>
              <Diamond size={4} filled={true} />
            </a>
          )}
        </div>
      </main>
    </div>
  );
}
