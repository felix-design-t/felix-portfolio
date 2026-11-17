import "./ideation-filter.css";
import "./iteration-redraw.css";

type RedrawPair = {
  label: string;
  before: { src: string; alt: string; width: number; height: number };
  after: { src: string; alt: string; width: number; height: number };
};

/**
 * Two screens and the arrow between them.
 *
 * The earlier screen is on the left. The arrow points to the
 * redrawn screen on the right. The line above names the feature.
 */
export function IterationRedraw({ label, before, after }: RedrawPair) {
  return (
    <figure className="ideation-filter">
      <figcaption className="ideation-filter-lead">{label}</figcaption>
      <div className="iteration-redraw">
        <img
          src={before.src}
          alt={before.alt}
          width={before.width}
          height={before.height}
          draggable={false}
        />
        <svg className="ideation-filter-arrow" viewBox="0 0 24 16" aria-hidden="true">
          <path d="M1 8h16M13 3.5 19.5 8 13 12.5" />
        </svg>
        <img
          src={after.src}
          alt={after.alt}
          width={after.width}
          height={after.height}
          draggable={false}
        />
      </div>
    </figure>
  );
}
