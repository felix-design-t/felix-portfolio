import "./iteration-priority.css";

/**
 * Three places the entry can live.
 *
 * One label names the row. The line under each screen is a caption.
 */
const spots = [
  {
    src: "/work/google-maps/iteration-2.1.png",
    alt: "Walk Explore as a button on the right side of the map",
    note: "21% user approve",
    tone: "bad" as const,
  },
  {
    src: "/work/google-maps/iteration-2.2.png",
    alt: "Walk Explore as the first chip under search",
    note: "65% user approve",
    tone: "good" as const,
  },
  {
    src: "/work/google-maps/iteration-2.3.png",
    alt: "Walk Explore as a tab in the bottom bar",
    note: "14% user approve",
    tone: "bad" as const,
  },
];

export function IterationEntry() {
  return (
    <div className="iteration-entry">
      <p>walk explore feature placement</p>
      <div className="iteration-priority" data-count="3">
        {spots.map((spot) => (
          <figure key={spot.src}>
            <img
              src={spot.src}
              alt={spot.alt}
              width={193}
              height={417}
              draggable={false}
            />
            <figcaption>
              {"tone" in spot ? (
                <span className="iteration-dot" data-tone={spot.tone} />
              ) : null}
              {spot.note}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
