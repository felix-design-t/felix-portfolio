import "./diemlife-flow.css";

/**
 * How DIEMlife works.
 *
 * The grid is locked to the column width. Gaps are a fraction of that
 * width, so the arrows stay visible and the words stay inside the tiles
 * when the window gets narrow. Employees is the accent tile.
 */

const tiles = [
  { label: "Onboarding" },
  { label: "Employees", highlight: true },
  { label: "Analysis", lines: ["Analysis", "Report"] },
  { label: "Tasks" },
  { label: "Fundraising" },
  { label: "Networking" },
];

export function DiemlifeFlow() {
  return (
    <div className="diem-flow-frame">
      <div
        className="diem-flow"
        role="img"
        aria-label="DIEMlife loop: Employees connect Onboarding, Tasks, Fundraising, Networking, and an Analysis Report"
      >
        <Tile {...tiles[0]} />
        <Arrow direction="left" />
        <Tile {...tiles[1]} />
        <Arrow direction="left" />
        <Tile {...tiles[2]} />

        <Arrow direction="down" />
        <span />
        <span />
        <span />
        <Arrow direction="up" />

        <Tile {...tiles[3]} />
        <Arrow direction="right" />
        <Tile {...tiles[4]} />
        <Arrow direction="right" />
        <Tile {...tiles[5]} />
      </div>
    </div>
  );
}

function Tile({
  label,
  lines,
  highlight = false,
}: {
  label: string;
  lines?: string[];
  highlight?: boolean;
}) {
  return (
    <p className="diem-tile" data-highlight={highlight ? "true" : undefined}>
      {lines ? lines.map((line) => <span key={line}>{line}</span>) : label}
    </p>
  );
}

function Arrow({ direction }: { direction: "left" | "right" | "up" | "down" }) {
  const rotation = { right: 0, down: 90, left: 180, up: 270 }[direction];
  return (
    <span className="diem-arrow-slot" data-dir={direction}>
      <svg viewBox="0 0 40 16" aria-hidden="true" style={{ transform: `translate(-50%, -50%) rotate(${rotation}deg)` }}>
        <line x1="1" y1="8" x2="28" y2="8" />
        <polyline points="22,2 38,8 22,14" />
      </svg>
    </span>
  );
}

/**
 * Context media: the case-study grid and the loop, equal width.
 * On a wide window the loop fills the photo's height.
 * On a phone they stack.
 */
export function EventContextMedia() {
  return (
    <div className="event-context">
      <figure className="event-context-item">
        <div className="event-context-visual">
          <img
            src="/work/event-planning/context-1.png"
            alt="DIEMlife case studies for East Hill, Spark, Samsung C&T, and Metro Community Center"
            width={761}
            height={491}
            draggable={false}
          />
        </div>
        <figcaption className="event-context-caption">
          Helped 50+ companies and 20,000+ employees
        </figcaption>
      </figure>
      <figure className="event-context-item">
        <div className="event-context-visual">
          <DiemlifeFlow />
        </div>
        <figcaption className="event-context-caption">
          How does DIEMlife work to help companies?
        </figcaption>
      </figure>
    </div>
  );
}
