/**
 * The shape of one case study page.
 *
 * Think of it as the property panel of a page template: the components
 * in this folder are the template, and each project only fills these
 * fields. A new case study is a new data file, not a new layout.
 */

export type CaseStudySectionKind =
  | "Context"
  | "Problem"
  | "Admin's Worry"
  | "First Attempt"
  | "Introducing Agent"
  | "Feature"
  | "Exploration"
  | "Decisions"
  | "Solution"
  | "Trust Building"
  | "Reflection";

/** A frame that will hold a visual. Until `children` exist it is a placeholder. */
export type CaseStudyVisual = {
  /** Planned visual name. Shown in the placeholder's mono label. */
  name: string;
  /** A few words under the frame. Names the frame, never repeats the paragraph. */
  caption?: string;
  /** CSS aspect-ratio, e.g. "16 / 10". Keeps the slot the right size before the visual exists. */
  aspectRatio: string;
};

/** One explored idea: a heading, one paragraph, then its frame. */
export type CaseStudyIdea = CaseStudyVisual & {
  title: string;
  body: string;
};

export type CaseStudySectionData = {
  /** Anchor id. Wayfinding scrolls to it. */
  id: string;
  kind: CaseStudySectionKind;
  /** A story beat, not a label. The page heading uses this. */
  title: string;
  /**
   * Short name in the left rail. The page heading stays `title`.
   * Leave it off and the rail uses the kicker (`kind`).
   */
  navTitle?: string;
  /**
   * This section continues the one above it. The rail keeps the
   * previous row (the dot stays there), and the gap above tightens.
   */
  continuesPrevious?: boolean;
  /** One paragraph, three lines or fewer at body size in the column. */
  body: string;
  /** A paragraph under the frame. The body stays above it. */
  closing?: string;
  /** A heading above the closing paragraph. */
  closingTitle?: string;
  visual?: CaseStudyVisual;
  /**
   * Ideas explored one after another, in reading order. Each has its
   * own heading and paragraph above its frame. They sit under the body,
   * before `visual`.
   */
  ideas?: CaseStudyIdea[];
  /** A second frame, under the closing paragraph. */
  closingVisual?: CaseStudyVisual;
  /**
   * A Tradeoffs placeholder directly under every frame in this section.
   */
  tradeoffs?: boolean;
  /** Pros and cons inside the first Tradeoffs placeholder. */
  tradeoffNote?: string;
  /**
   * Another beat under the first frame: a heading, a paragraph,
   * and its own frame. It stays in this section.
   */
  followUp?: {
    title: string;
    body: string;
    visual?: CaseStudyVisual;
    /** Pros and cons inside the Tradeoffs placeholder under this beat. */
    tradeoffNote?: string;
    /** Copy that is still waiting. Rendered in the quieter placeholder style. */
    isPlaceholderText?: boolean;
  };
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
