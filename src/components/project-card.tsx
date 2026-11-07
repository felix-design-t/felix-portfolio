import Link from "next/link";
import type { Project } from "@/content/projects";

/**
 * One Selected Work slot.
 *
 * The cover is an empty plate the interactive media will replace later.
 * The caption sits under that plate, on the same left edge. The whole
 * slot is the link, the way a list row is one hit target.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link href={`/work/${project.slug}`} className="work-slot">
      <span className="work-slot-cover" aria-hidden="true" />
      <h3 className="work-slot-caption">
        {project.title}
        {project.meta ? (
          <span className="work-slot-meta"> / {project.meta}</span>
        ) : null}
      </h3>
    </Link>
  );
}
