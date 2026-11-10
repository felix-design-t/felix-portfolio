import type { ReactNode } from "react";
import { CaseStudyFrame } from "./case-study-frame";
import {
  formatSectionIndex,
  type CaseStudySectionData,
} from "./types";
import styles from "./case-study.module.css";

type CaseStudySectionProps = {
  section: CaseStudySectionData;
  /** 1-based position on the page. Becomes the "01" index. */
  position: number;
  /** A built visual. Without it the section's frame stays a placeholder. */
  visual?: ReactNode;
  visualControls?: ReactNode;
};

/**
 * One section: mono index and kind on one line, the title under it,
 * one short paragraph, then the frame if the section has one.
 */
export function CaseStudySection({
  section,
  position,
  visual,
  visualControls,
}: CaseStudySectionProps) {
  const headingId = `${section.id}-title`;

  return (
    <section
      id={section.id}
      className={styles.section}
      aria-labelledby={headingId}
    >
      <p className={styles.sectionPath}>
        <span>{formatSectionIndex(position)}</span>
        <span>{section.kind}</span>
      </p>
      <h2 id={headingId} className={styles.sectionTitle}>
        {section.title}
      </h2>
      <p
        className={styles.sectionBody}
        data-placeholder={section.isPlaceholderText ? "true" : undefined}
      >
        {section.body}
      </p>
      {section.visual ? (
        <CaseStudyFrame
          name={section.visual.name}
          caption={section.visual.caption}
          aspectRatio={section.visual.aspectRatio}
          controls={visualControls}
        >
          {visual}
        </CaseStudyFrame>
      ) : null}
    </section>
  );
}
