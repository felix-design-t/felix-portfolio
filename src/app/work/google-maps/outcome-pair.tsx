import "./outcome-pair.css";

/**
 * The two Walk Explore clips share one frame.
 *
 * Each description belongs to its video, so the line sits under the
 * picture instead of above a separate card. On a wide window the pair
 * sits side by side. On a phone they stack, so a long line never
 * collides with the other video.
 */
const outcomes = [
  {
    src: "/work/google-maps/outcome-1.mp4",
    label: "01. Time-dependent circles for walkable attractions",
    alt: "Time-dependent circles showing walkable attractions",
  },
  {
    src: "/work/google-maps/outcome-2.mp4",
    label: "02. Live events and exhibition for unique travel experience",
    alt: "Live events and exhibitions for a unique travel experience",
  },
];

export function OutcomePair() {
  return (
    <div className="outcome-pair">
      {outcomes.map((outcome) => (
        <figure className="outcome-pair-item" key={outcome.src}>
          <div className="outcome-pair-phone">
            <video
              src={outcome.src}
              width={524}
              height={1080}
              autoPlay
              muted
              loop
              playsInline
              aria-label={outcome.alt}
            />
          </div>
          <figcaption>{outcome.label}</figcaption>
        </figure>
      ))}
    </div>
  );
}
