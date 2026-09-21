import { ProjectItem } from "@/types";

export const PROJECTS_DATA: ProjectItem[] = [
  {
    slug: "project-1",
    title: "Project title",
    summary: "Active research and computational implementation in progress.",
    tags: ["Systems", "Prototype"],
    placeholder: true,
  },
  {
    slug: "project-2",
    title: "Project title",
    summary: "Active research and computational implementation in progress.",
    tags: ["Algorithms", "Core"],
    placeholder: true,
  },
  {
    slug: "project-3",
    title: "Project title",
    summary: "Active research and computational implementation in progress.",
    tags: ["Interface", "Web"],
    placeholder: true,
  },
  {
    slug: "project-4",
    title: "Project title",
    summary: "Active research and computational implementation in progress.",
    tags: ["Security", "Network"],
    placeholder: true,
  },
];

export const FALLBACK_PLACEHOLDER_PROJECTS: ProjectItem[] = PROJECTS_DATA;
