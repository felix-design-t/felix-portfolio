import type { ReactNode } from "react";
import styles from "./case-study.module.css";

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
 * One visual frame: 8px corners, a 1px stroke, a mono caption under it.
 *
 * Like a Figma component with two variants. "Placeholder" holds the
 * slot at the right size and names what will go there. "Filled" is
 * whatever the section passes in as children.
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
    <figure className={styles.figure}>
      {controls ? <div className={styles.frameControls}>{controls}</div> : null}
      <div
        className={styles.frame}
        style={{ aspectRatio }}
        data-state={isPlaceholder ? "placeholder" : "filled"}
      >
        {isPlaceholder ? (
          <div className={styles.placeholder}>
            <span className={styles.placeholderTag}>Placeholder</span>
            <span className={styles.placeholderName}>{name}</span>
          </div>
        ) : (
          children
        )}
      </div>
      {caption ? (
        <figcaption className={styles.caption}>{caption}</figcaption>
      ) : null}
    </figure>
  );
}
