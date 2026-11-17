import "./ideation-filter.css";

/**
 * Before and after the display filter.
 *
 * The current map is on the left. The Walk Explore control sits in
 * the middle. The quieter map is on the right. The line above names
 * what the filter does.
 */
export function IdeationFilter() {
  return (
    <figure className="ideation-filter">
      <figcaption className="ideation-filter-lead">
        display only the essential information for tourists
      </figcaption>
      <div className="ideation-filter-row" data-layout="compare">
        <div className="ideation-filter-side">
          <img
            src="/work/google-maps/ideation-1.1.png"
            alt="The current Google Maps view, full of place names"
            width={300}
            height={297}
            draggable={false}
          />
          <p>current map</p>
        </div>
        <FilterArrow />
        <img
          className="ideation-filter-mark"
          src="/work/google-maps/ideation-3.1.png"
          alt="Walk explore"
          width={189}
          height={54}
          draggable={false}
        />
        <FilterArrow />
        <div className="ideation-filter-side">
          <img
            src="/work/google-maps/ideation-1.2.png"
            alt="The map after Walk Explore is on, with fewer labels"
            width={300}
            height={297}
            draggable={false}
          />
          <p>after enable walk explore</p>
        </div>
      </div>
    </figure>
  );
}

/** A short arrow. It points from the current map, through Walk Explore, to the result. */
function FilterArrow() {
  return (
    <svg className="ideation-filter-arrow" viewBox="0 0 24 16" aria-hidden="true">
      <path d="M1 8h16M13 3.5 19.5 8 13 12.5" />
    </svg>
  );
}
