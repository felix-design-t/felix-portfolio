import { Hero } from "@/components/hero";
import { SelectedWork } from "@/components/selected-work";
import { Toolkit } from "@/components/toolkit";
import { getSelectedProjects } from "@/content/projects";

export default function HomePage() {
  const selectedProjects = getSelectedProjects();

  return (
    <>
      <Hero />
      <SelectedWork projects={selectedProjects} />
      <Toolkit />
    </>
  );
}
