import React from "react";
import { Header } from "@/components/navigation/Header";
import { OpeningExperience } from "@/components/opening/OpeningExperience";
import { ParticleField } from "@/components/visual/ParticleField";
import { OpeningSection } from "@/components/sections/OpeningSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { EventsSection } from "@/components/sections/EventsSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { FooterSection } from "@/components/sections/FooterSection";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-black text-white">
      {/* Persistent 3D Computational Background */}
      <ParticleField />

      {/* Experience Layer: Opening / Loading Gateway */}
      <OpeningExperience />

      {/* Main Experience: Promptly rendered for LCP and SSR */}
      <div id="site-wrapper" className="relative z-10 flex-1 flex flex-col">
        <Header />
        <main id="main-content" className="flex-1 flex flex-col focus:outline-none">
          <OpeningSection />
          <AboutSection />
          <EventsSection />
          <GallerySection />
          <ProjectsSection />
          <TeamSection />
        </main>
        <FooterSection />
      </div>
    </div>
  );
}
