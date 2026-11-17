import "./ideation-filter.css";

/**
 * Three preset walk times.
 *
 * Same frame as the display filter. Each map is one duration,
 * and the caption under it is that duration.
 */
const walks = [
  {
    src: "/work/google-maps/ideation-2.1.png",
    alt: "A small walk-time circle, about a five minute walk",
    caption: "5 mins",
  },
  {
    src: "/work/google-maps/ideation-2.2.png",
    alt: "A medium walk-time circle, about a ten minute walk",
    caption: "10 mins",
  },
  {
    src: "/work/google-maps/ideation-2.3.png",
    alt: "A larger walk-time circle, about a fifteen minute walk",
    caption: "15 mins",
  },
];

export function IdeationWalk() {
  return (
    <figure className="ideation-filter">
      <figcaption className="ideation-filter-lead">
        users knows where to go within their time limit
      </figcaption>
      <div className="ideation-filter-row" data-layout="trio">
        {walks.map((walk) => (
          <div className="ideation-filter-side" key={walk.caption}>
            <img
              src={walk.src}
              alt={walk.alt}
              width={268}
              height={265}
              draggable={false}
            />
            <p>{walk.caption}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}
