import type { ReactNode } from "react";
import { CaseStudyCover } from "./case-study-cover";
import { CaseStudySection } from "./case-study-section";
import { CaseStudyWayfinding } from "./case-study-wayfinding";
import { formatSectionIndex, type CaseStudy } from "./types";
import "./case-study.css";

type CaseStudyPageProps = {
  study: CaseStudy;
  /** Built visuals by section id. Any section missing here keeps its placeholder. */
  visuals?: Partial<Record<string, ReactNode>>;
  cover?: ReactNode;
};

/**
 * The case study template: title, cover with meta, then the sections,
 * with wayfinding in the margin. It sits inside the site's reading
 * column from the root layout, so the text never widens.
 */
export function CaseStudyPage({ study, visuals = {}, cover }: CaseStudyPageProps) {
  const topId = "case-study-top";
  const wayfindingItems = study.sections.map((section, position) => ({
    id: section.id,
    index: formatSectionIndex(position + 1),
    title: section.title,
  }));

  return (
    <article className="case-study-page" aria-labelledby={topId}>
      <CaseStudyWayfinding items={wayfindingItems} topId={topId} />

      <header className="case-study-header">
        <h1 id={topId} className="case-study-title">
          {study.title}
        </h1>
      </header>

      <CaseStudyCover cover={study.cover} meta={study.meta}>
        {cover}
      </CaseStudyCover>

      <div className="case-study-sections">
        {study.sections.map((section, position) => (
          <CaseStudySection
            key={section.id}
            section={section}
            position={position + 1}
            visual={visuals[section.id]}
          />
        ))}
      </div>
    </article>
  );
}
