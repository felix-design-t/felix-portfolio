import "./research-profile.css";

/**
 * Who the study is for.
 *
 * Two rings, then the overlap. The dark disk is the share. The pale
 * ring is everyone else. The dots in the key are the same 6px marks
 * the Event Planning notes use. The words sit above each picture,
 * on one line, and name the group.
 */
const rings = [
  {
    share: 0.7,
    label: "primary navigation tools",
    strong: "Google Maps",
    tint: "All navigation apps",
  },
  {
    share: 0.58,
    label: "the way to explore the city",
    strong: "By walking",
    tint: "By all transportation",
  },
];

export function ResearchProfile() {
  return (
    <div className="research-profile">
      {rings.map((ring) => (
        <figure className="research-profile-item" key={ring.label}>
          <figcaption>{ring.label}</figcaption>
          <div className="research-ring" aria-hidden="true">
            {/*
              Area grows with the square of the width. A disk that
              covers 58% of the outer circle is not 58% as wide.
              It is the square root of 0.58, about 76% as wide.
            */}
            <span
              className="research-ring-core"
              style={{
                width: `${Math.sqrt(ring.share) * 100}%`,
                height: `${Math.sqrt(ring.share) * 100}%`,
              }}
            >
              {Math.round(ring.share * 100)}%
            </span>
          </div>
          <ul className="research-key">
            <li>
              <span className="research-key-dot" data-tone="strong" />
              {ring.strong}
            </li>
            <li>
              <span className="research-key-dot" data-tone="tint" />
              {ring.tint}
            </li>
          </ul>
        </figure>
      ))}

      <figure className="research-profile-item">
        <figcaption>our target user group</figcaption>
        <svg
          className="research-venn"
          viewBox="0 0 156 96"
          role="img"
          aria-label="Google Maps and walking overlap as the target group"
        >
          <g className="research-venn-fill">
            <circle cx="48" cy="48" r="44" />
            <circle cx="108" cy="48" r="44" />
          </g>
          <g className="research-venn-stroke">
            <circle cx="48" cy="48" r="44" />
            <circle cx="108" cy="48" r="44" />
          </g>
          <text x="36" y="52" textAnchor="middle">
            Google Map
          </text>
          <text x="78" y="52" textAnchor="middle">
            +
          </text>
          <text x="120" y="52" textAnchor="middle">
            Walking
          </text>
        </svg>
      </figure>
    </div>
  );
}
