import "./ideation-filter.css";
import "./iteration-material.css";

/**
 * Two comparisons of the same interface detail.
 *
 * Each row is a before-and-after pair. The arrow points from
 * the earlier screen on the left to the matched screen on the right.
 * The line above both rows names the change.
 */
const rows = [
  {
    before: {
      src: "/work/google-maps/iteration-6.1.png",
      alt: "Bottom bar with Explore, Go, Saved, Contribute, and Updates",
      width: 403,
      height: 95,
    },
    after: {
      src: "/work/google-maps/iteration-6.2.png",
      alt: "The same bottom bar with a blue pill behind the selected Explore tab",
      width: 403,
      height: 95,
    },
  },
  {
    before: {
      src: "/work/google-maps/iteration-6.3.png",
      alt: "Walk Explore sheet with 10, 15, 30 minute, and Custom choices",
      width: 403,
      height: 141,
    },
    after: {
      src: "/work/google-maps/iteration-6.4.png",
      alt: "Walk Explore sheet with 10 min selected in blue and Customize at the end",
      width: 403,
      height: 141,
    },
  },
];

export function IterationMaterial() {
  return (
    <figure className="ideation-filter">
      <figcaption className="ideation-filter-lead">
        match UI details in material design system
      </figcaption>
      <div className="iteration-material">
        {rows.map((row) => (
          <div className="iteration-material-row" key={row.before.src + row.after.src}>
            <img
              src={row.before.src}
              alt={row.before.alt}
              width={row.before.width}
              height={row.before.height}
              draggable={false}
            />
            <svg className="ideation-filter-arrow" viewBox="0 0 24 16" aria-hidden="true">
              <path d="M1 8h16M13 3.5 19.5 8 13 12.5" />
            </svg>
            <img
              src={row.after.src}
              alt={row.after.alt}
              width={row.after.width}
              height={row.after.height}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </figure>
  );
}
