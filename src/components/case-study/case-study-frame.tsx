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
  /**
   * Keep the ratio after the visual is built. Motion inside the frame
   * stays in the box, so the page height does not change while it plays.
   */
  lockRatio?: boolean;
};

/**
 * One visual frame.
 *
 * The frame is the matte fill, with a 1px border. Whatever is inside
 * sits on that fill. There is no extra card wrapping the content.
 * The outer corner is 8px plus the 8px padding plus the 1px border,
 * so it stays even with an 8px card sitting in the padding.
 * A mono label names the visual until the real one is passed in.
 */
export function CaseStudyFrame({
  name,
  caption,
  aspectRatio,
  note,
  controls,
  children,
  lockRatio = false,
}: CaseStudyFrameProps) {
  const isPlaceholder = children === undefined || children === null;
  const locked = lockRatio && !isPlaceholder;

  return (
    <figure className="case-study-figure">
      {controls ? <div className="case-study-frame-controls">{controls}</div> : null}
      <div
        className="case-study-frame"
        style={isPlaceholder || locked ? { aspectRatio } : undefined}
        data-state={isPlaceholder ? "placeholder" : "filled"}
        data-lock={locked ? "ratio" : undefined}
      >
        {isPlaceholder ? (
          <p className="case-study-placeholder">
            <span>{name}</span>
            {note ? <span>{note}</span> : null}
          </p>
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
