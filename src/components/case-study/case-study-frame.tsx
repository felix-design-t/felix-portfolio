import type { ReactNode } from "react";

type CaseStudyFrameProps = {
  /** Planned visual name. The placeholder shows it in a mono label. */
  name: string;
  caption?: string;
  /** CSS aspect-ratio for the slot, e.g. "16 / 10". */
  aspectRatio: string;
  /** Extra lines inside a placeholder, under its name. */
  note?: string;
  /**
   * Optional row above the frame for a scenario switcher or Replay.
   * Same slot every frame uses, so controls always sit in one place.
   */
  controls?: ReactNode;
  /** The real visual. Leave empty and the frame draws its placeholder state. */
  children?: ReactNode;
};

/**
 * One visual frame.
 *
 * The outer box is a filled placeholder: a 1px border, then the matte
 * color in the padding. The inner sheet is a card on the page ground.
 * Its corner is 8px. The outer corner is that 8px plus the 8px padding
 * plus the 1px border, so the gap stays even around the curve.
 * A mono label names the visual until the real one is passed in.
 */
export function CaseStudyFrame({
  name,
  caption,
  aspectRatio,
  note,
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
        <div className="case-study-sheet">
          {isPlaceholder ? (
            <p className="case-study-placeholder">
              <span>{name}</span>
              {note ? <span>{note}</span> : null}
            </p>
          ) : (
            children
          )}
        </div>
      </div>
      {caption ? (
        <figcaption className="case-study-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
