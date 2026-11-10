import type { ReactNode } from "react";

type CaseStudyFrameProps = {
  /** Planned visual name. The placeholder shows it in a mono label. */
  name: string;
  caption?: string;
  /** CSS aspect-ratio for the slot, e.g. "16 / 10". */
  aspectRatio: string;
  /**
   * Optional row above the frame for a scenario switcher or Replay.
   * Same slot every frame uses, so controls always sit in one place.
   */
  controls?: ReactNode;
  /** The real visual. Leave empty and the frame draws its placeholder state. */
  children?: ReactNode;
};

/**
 * One visual frame, the same plate as a Selected Work cover:
 * 16/10, 8px corners, matte fill, no stroke. A mono label names the
 * visual until the real one is passed in as children.
 */
export function CaseStudyFrame({
  name,
  caption,
  aspectRatio,
  controls,
  children,
}: CaseStudyFrameProps) {
  const isPlaceholder = children === undefined || children === null;

  return (
    <figure className="case-study-figure">
      {controls ? <div className="case-study-frame-controls">{controls}</div> : null}
      <div
        className="case-study-frame"
        style={{ aspectRatio }}
        data-state={isPlaceholder ? "placeholder" : "filled"}
      >
        {isPlaceholder ? (
          <p className="case-study-placeholder">{name}</p>
        ) : (
          children
        )}
      </div>
      {caption ? (
        <figcaption className="case-study-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
