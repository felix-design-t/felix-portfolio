import "./iteration-hierarchy.css";

/**
 * Which chip order people approved.
 *
 * The winning order sits alone on top, with its label above it.
 * The two that lost sit underneath. The line under each screen
 * is a caption.
 */
const rejected = [
  {
    src: "/work/google-maps/iteration-3.2.png",
    alt: "Walk Explore as a chip under an empty search",
    note: "8% user approve",
    width: 278,
  },
  {
    src: "/work/google-maps/iteration-3.3.png",
    alt: "Trending first, with Walk Explore only in the search field",
    note: "21% user approve",
    width: 278,
  },
];

export function IterationHierarchy() {
  return (
    <div className="iteration-hierarchy">
      <figure className="iteration-hierarchy-winner">
        <p>Walk explore feature Top Placement</p>
        <img
          src="/work/google-maps/iteration-3.1.png"
          alt="Walk Explore first, then Trending and Penn"
          width={276}
          height={132}
          draggable={false}
        />
        <figcaption>
          <span className="iteration-dot" data-tone="good" />
          71% user approve
        </figcaption>
      </figure>
      <div className="iteration-hierarchy-pair">
        {rejected.map((item) => (
          <figure key={item.src}>
            <img
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={132}
              draggable={false}
            />
            <figcaption>
              <span className="iteration-dot" data-tone="bad" />
              {item.note}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

