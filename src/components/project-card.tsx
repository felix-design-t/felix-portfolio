import Link from "next/link";
import type { Project } from "@/content/projects";
import { CoverSequence } from "@/components/case-study/cover-sequence";
import "@/components/case-study/case-study.css";

/**
 * One Selected Work slot.
 *
 * Time-Off uses the same cover frame as its case study, at that frame's
 * own height. The other projects keep an empty plate. The caption sits
 * under the plate, on the same left edge. The whole slot is the link,
 * the way a list row is one hit target.
 */
export function ProjectCard({ project }: { project: Project }) {
  const isTimeOffCover = project.slug === "time-off-copilot";

  return (
    <Link href={`/work/${project.slug}`} className="work-slot">
      <div
        className={
          isTimeOffCover
            ? "work-slot-cover case-study-frame"
            : "work-slot-cover"
        }
        data-state={isTimeOffCover ? "filled" : undefined}
        data-lock={isTimeOffCover ? "ratio" : undefined}
        aria-hidden="true"
      >
        {isTimeOffCover ? <CoverSequence /> : null}
      </div>
      <h3 className="work-slot-caption">
        {project.title}
        {project.meta ? (
          <span className="work-slot-meta"> / {project.meta}</span>
        ) : null}
      </h3>
    </Link>
  );
}
