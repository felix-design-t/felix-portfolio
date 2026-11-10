/**
 * The shape of one case study page.
 *
 * Think of it as the property panel of a page template: the components
 * in this folder are the template, and each project only fills these
 * fields. A new case study is a new data file, not a new layout.
 */

export type CaseStudySectionKind = "Problem" | "Feature" | "Reflection";

/** A frame that will hold a visual. Until `children` exist it is a placeholder. */
export type CaseStudyVisual = {
  /** Planned visual name. Shown in the placeholder's mono label. */
  name: string;
  /** A few words under the frame. Names the frame, never repeats the paragraph. */
  caption?: string;
  /** CSS aspect-ratio, e.g. "16 / 10". Keeps the slot the right size before the visual exists. */
  aspectRatio: string;
};

export type CaseStudySectionData = {
  /** Anchor id. Wayfinding scrolls to it. */
  id: string;
  kind: CaseStudySectionKind;
  /** A story beat, not a label. */
  title: string;
  /** One paragraph, three lines or fewer at body size in the column. */
  body: string;
  visual?: CaseStudyVisual;
  /** Copy that is still waiting on Felix. Rendered in the quieter placeholder style. */
  isPlaceholderText?: boolean;
};

export type CaseStudyMetaItem = { label: string; value: string };

export type CaseStudy = {
  title: string;
  cover: { label: string; aspectRatio: string };
  meta: CaseStudyMetaItem[];
  sections: CaseStudySectionData[];
};

/** Two-digit index shown before each section: 1 → "01". */
export function formatSectionIndex(position: number): string {
  return String(position).padStart(2, "0");
}
