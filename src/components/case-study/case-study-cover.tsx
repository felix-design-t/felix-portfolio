import type { ReactNode } from "react";
import { CaseStudyFrame } from "./case-study-frame";
import type { CaseStudy } from "./types";

type CaseStudyCoverProps = {
  cover: CaseStudy["cover"];
  meta: CaseStudy["meta"];
  /** The real cover visual, once it exists. */
  children?: ReactNode;
};

/**
 * Cover frame, then the meta block in mono at caption size.
 * A description list, because each row is a label and its value.
 */
export function CaseStudyCover({ cover, meta, children }: CaseStudyCoverProps) {
  return (
    <div className="case-study-cover">
      <CaseStudyFrame name={cover.label} aspectRatio={cover.aspectRatio}>
        {children}
      </CaseStudyFrame>
      <dl className="case-study-meta">
        {meta.map((item) => (
          <div key={item.label} className="case-study-meta-row">
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
