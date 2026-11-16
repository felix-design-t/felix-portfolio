import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";
import { CoverSequence } from "@/components/case-study/cover-sequence";
import { GradientBackdrop } from "@/components/case-study/GradientBackdrop";
import "@/components/case-study/case-study.css";

const coverAlt = "Redesigned Paycom expense dashboard";

/**
 * One Selected Work slot.
 *
 * Time-Off uses the same 16/10 cover frame as its case study.
 * The other projects keep an empty plate of that same size. The caption sits
 * under the plate, on the same left edge. The whole slot is the link,
 * the way a list row is one hit target.
 */
export function ProjectCard({ project }: { project: Project }) {
  const isTimeOffCover = project.slug === "time-off-copilot";
  const media = project.media;

  const metaParts = project.meta
    ? project.meta.split(" / ").map((part) => part.trim()).filter(Boolean)
    : [];

  return (
    <Link
      href={`/work/${project.slug}`}
      className="work-slot"
    >
      <div
        className={
          isTimeOffCover
            ? "work-slot-cover case-study-frame"
            : "work-slot-cover"
        }
        data-state={isTimeOffCover ? "filled" : undefined}
        data-lock={isTimeOffCover ? "ratio" : undefined}
        data-media={media ? "true" : undefined}
      >
        <GradientBackdrop name={project.backdrop}>
          <div className="work-slot-stage">
          {isTimeOffCover ? <CoverSequence /> : null}
          {media ? (
          <div className="work-slot-media">
            {/* Both themes render. CSS hides one, so a theme change never waits on an image. */}
            <Image
              className="work-slot-shot"
              data-theme-image="light"
              src={media.light}
              alt={coverAlt}
              width={861}
              height={714}
              sizes="(max-width: 640px) 90vw, 480px"
              loading="eager"
            />
            <Image
              className="work-slot-shot"
              data-theme-image="dark"
              src={media.dark}
              alt={coverAlt}
              width={1152}
              height={864}
              sizes="(max-width: 640px) 90vw, 480px"
              loading="eager"
            />
          </div>
          ) : null}
          </div>
        </GradientBackdrop>
        <div className="work-slot-band">
          <div className="work-slot-band-frame">
            <h3 className="work-slot-caption">{project.title}</h3>
            {metaParts.length > 0 ? (
              <p className="work-slot-band-meta">
                {metaParts.map((part) => (
                  <span key={part}>{part}</span>
                ))}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
