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
  /** Built visuals for a section's closing frame, by section id. */
  closingVisuals?: Partial<Record<string, ReactNode>>;
  cover?: ReactNode;
};

/**
 * The case study template: title, cover with meta, then the sections,
 * with wayfinding in the margin. It sits inside the site's reading
 * column from the root layout, so the text never widens.
 */
export function CaseStudyPage({ study, visuals = {}, closingVisuals = {}, cover }: CaseStudyPageProps) {
  const topId = "case-study-top";
  const wayfindingItems = study.sections.map((section, position) => ({
    id: section.id,
    index: formatSectionIndex(position + 1),
    title: section.navTitle ?? section.kind,
    continuesPrevious: section.continuesPrevious,
  }));

  return (
    <article className="case-study-page" aria-labelledby={topId}>
      <header className="case-study-header">
        <h1 id={topId} className="case-study-title">
          {study.title}
        </h1>
      </header>

      {/*
        The rail lives in this block, not on the title. On a wide
        window it is fixed to the left edge of the screen.
      */}
      <div className="case-study-main">
        <CaseStudyWayfinding items={wayfindingItems} topId={topId} />

        <CaseStudyCover cover={study.cover} meta={study.meta}>
          {cover}
        </CaseStudyCover>

        <div className="case-study-sections">
          {study.sections.map((section) => (
            <CaseStudySection
              key={section.id}
              section={section}
              visual={visuals[section.id]}
              closingVisual={closingVisuals[section.id]}
            />
          ))}
        </div>
      </div>
    </article>
  );
}
