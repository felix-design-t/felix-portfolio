import "./ideation-filter.css";

/**
 * What Walk Explore opens into.
 *
 * The control is on top. Two arrows leave it: one to live events,
 * one to a hidden gem. These are buttons, so they sit a little
 * larger than the same control in the comparison above.
 */
export function IdeationFork() {
  return (
    <figure className="ideation-filter">
      <figcaption className="ideation-filter-lead">
        walk explore explained
      </figcaption>
      <div className="ideation-fork">
        <img
          className="ideation-fork-button"
          src="/work/google-maps/ideation-3.1.png"
          alt="Walk explore"
          width={189}
          height={54}
          draggable={false}
        />
        <svg
          className="ideation-fork-arrows"
          viewBox="0 0 100 36"
          aria-hidden="true"
        >
          <path d="M50 2 L28 32" markerEnd="url(#ideation-fork-head)" />
          <path d="M50 2 L72 32" markerEnd="url(#ideation-fork-head)" />
          <defs>
            <marker
              id="ideation-fork-head"
              viewBox="0 0 8 8"
              markerWidth="5"
              markerHeight="5"
              refX="6"
              refY="4"
              orient="auto"
            >
              <path d="M1 1.2 6.5 4 1 6.8" />
            </marker>
          </defs>
        </svg>
        <div className="ideation-fork-pair">
          <div className="ideation-filter-side">
            <img
              className="ideation-fork-button"
              src="/work/google-maps/ideation-3.2.png"
              alt="Trending"
              width={158}
              height={45}
              draggable={false}
            />
            <p>live events</p>
          </div>
          <div className="ideation-filter-side">
            <img
              className="ideation-fork-button ideation-fork-button-wide"
              src="/work/google-maps/ideation-3.3.png"
              alt="Penn and Gallery"
              width={263}
              height={45}
              draggable={false}
            />
            <p>hidden gem</p>
          </div>
        </div>
      </div>
    </figure>
  );
}
