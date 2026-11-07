import type { Project } from "@/content/projects";
import { ProjectCard } from "@/components/project-card";

type SelectedWorkProps = {
  projects: Project[];
};

/**
 * Four covers in a row pair. Each cover is only a placeholder; the caption
 * under it is the project name and one short label. The whole slot links
 * to that project's page.
 */
export function SelectedWork({ projects }: SelectedWorkProps) {
  return (
    <section
      className="selected-work"
      id="selected-work"
      aria-labelledby="selected-work-heading"
    >
      <div className="section-heading">
        <h2 id="selected-work-heading">Selected Work</h2>
      </div>
      <div className="selected-grid">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
