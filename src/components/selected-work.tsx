import type { Project } from "@/content/projects";
import { ProjectCard } from "@/components/project-card";

type SelectedWorkProps = {
  projects: Project[];
};

/**
 * Four studies, one per row. Time-Off plays its cover. The other three
 * keep a plate of that same size. The caption under each one is the
 * project name and one short label. The whole slot links to that page.
 */
export function SelectedWork({ projects }: SelectedWorkProps) {
  return (
    <section
      className="selected-work"
      id="selected-work"
      aria-labelledby="selected-work-heading"
    >
      <div className="section-heading">
        <h2 id="selected-work-heading">Selected Works</h2>
      </div>
      <div className="selected-grid">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
