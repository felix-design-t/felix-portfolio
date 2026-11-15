import type { GradientName } from "@/content/gradients";

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
  | "Reflection"
  | "Outcome Overview"
  | "Analysis"
  | "Design Objective"
  | "Initial Design Approach"
  | "Usability Testing Debrief"
  | "Iteration Approach"
  | "Further Testing Results"
  | "Further Design Changes"
  | "Measuring Success"
  | "Reflections"
  | "Unpack Insights to an actionable question…";

/** A frame that will hold a visual. Until `children` exist it is a placeholder. */
export type CaseStudyVisual = {
  /** Planned visual name. Shown in the placeholder's mono label. */
  name: string;
  /** A few words under the frame. Names the frame, never repeats the paragraph. */
  caption?: string;
  /** CSS aspect-ratio, e.g. "16 / 10". Keeps the slot the right size before the visual exists. */
  aspectRatio: string;
};

/**
 * One explored idea: a heading, one paragraph, then its frame.
 * Leave the heading off when the section's own title introduces it.
 */
export type CaseStudyIdea = CaseStudyVisual & {
  title?: string;
  body?: string;
  /**
   * The visual already draws its own frame or frames.
   * The section does not wrap it in another placeholder.
   */
  unframed?: boolean;
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
  /** Leave this beat out of the left rail and the step counter. */
  hideFromNav?: boolean;
  /**
   * A pivot statement instead of the usual kicker, title, and frame.
   * The section title and body stay for the type, and are not shown.
   */
  statement?: {
    eyebrow: string;
    text: string;
    /** Exact phrases inside `text` drawn in the accent color. */
    highlights: string[];
    /** Blue is the objective. Amber or violet is the question that follows testing. */
    accent?: "blue" | "amber" | "violet";
    /** Target for an objective. Question for an open question. */
    icon?: "target" | "question";
  };
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
  /** "columns" sets the ideas side by side on desktop. They stack on mobile. */
  ideasLayout?: "columns";
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
  cover: {
    label: string;
    aspectRatio: string;
    /** Soft wash behind the cover. Missing means the gray mat. */
    backdrop?: GradientName;
  };
  meta: CaseStudyMetaItem[];
  sections: CaseStudySectionData[];
};

/** Two-digit index shown before each section: 1 → "01". */
export function formatSectionIndex(position: number): string {
  return String(position).padStart(2, "0");
}
