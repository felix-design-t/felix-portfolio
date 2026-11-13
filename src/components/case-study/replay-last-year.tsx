import { ExplorationNotes } from "./exploration-notes";
import "./type-what-you-have.css";
import "./exploration.css";

/**
 * Exploration idea 2: the agent replays last year's requests against
 * the new policy before launch.
 *
 * Top: a year of requests as dots, one column per week (page system).
 * Gray kept the same outcome. Rose would change. Under it, the product
 * card that groups the changes, with the first group open to one example.
 */

const WEEKS = 52;
const TOTAL_REQUESTS = 214;

/** Busier weeks around summer and the end of the year. */
const BUSY_WEEKS = new Set([13, 22, 26, 27, 28, 50, 51]);

/** Weeks holding a request whose outcome would change. */
const CHANGED_WEEKS = new Set([6, 11, 15, 19, 23, 27, 30, 34, 38, 42, 46, 49]);

/** Requests per week: 3 to 5, plus one in the busy weeks. Adds up to 214. */
const REQUESTS_PER_WEEK = Array.from(
  { length: WEEKS },
  (_, week) => 3 + ((week * 5) % 3) + (BUSY_WEEKS.has(week) ? 1 : 0),
);

const MONTHS = ["Jan", "Apr", "Jul", "Oct", "Dec"];

const GROUPS = [
  {
    count: 5,
    label: "Requested more than earned after the wait",
    example: "Day 132. Asked for 4 days with 2 earned. Was approved, now balance\u00a0−2.",
  },
  { count: 4, label: "Requested during the 90-day wait" },
  { count: 3, label: "Part-time, earned less each month" },
];

/** Dot geometry in SVG units. The SVG scales with the frame. */
const COLUMN_GAP = 10;
const ROW_GAP = 8;
const DOT_RADIUS = 2.75;
const PLOT_WIDTH = (WEEKS - 1) * COLUMN_GAP + DOT_RADIUS * 2;
const PLOT_HEIGHT = 6 * ROW_GAP;

export function ReplayLastYearVisual() {
  const changedCount = CHANGED_WEEKS.size;

  return (
    <div className="xp-idea" data-visual="replay-last-year">
      <figure className="xp-year">
        <svg
          className="xp-year-dots"
          viewBox={`0 0 ${PLOT_WIDTH} ${PLOT_HEIGHT}`}
          role="img"
          aria-label={`Last year, ${TOTAL_REQUESTS} requests. ${changedCount} would change under the new policy.`}
        >
          {REQUESTS_PER_WEEK.map((count, week) =>
            Array.from({ length: count }, (_, stack) => (
              <circle
                key={`${week}-${stack}`}
                cx={DOT_RADIUS + week * COLUMN_GAP}
                cy={PLOT_HEIGHT - DOT_RADIUS - stack * ROW_GAP}
                r={DOT_RADIUS}
                data-changed={CHANGED_WEEKS.has(week) && stack === week % count ? "true" : undefined}
              />
            )),
          )}
        </svg>
        <div className="xp-year-axis" aria-hidden="true">
          {MONTHS.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
        <figcaption className="xp-legend">
          <span className="xp-legend-item">
            <span className="xp-dot" aria-hidden="true" />
            Safe
          </span>
          <span className="xp-legend-item">
            <span className="xp-dot" data-changed="true" aria-hidden="true" />
            Flagged
          </span>
        </figcaption>
      </figure>

      <div className="toc-product xp-product">
        <article className="xp-card" aria-label="Replay last year">
          <header className="xp-card-head">
            <h3 className="xp-card-title">
              {changedCount} of {TOTAL_REQUESTS} requests would change
            </h3>
            <p className="xp-card-meta">Last year&rsquo;s requests, replayed on the new policy</p>
          </header>

          <ul className="xp-groups">
            {GROUPS.map((group, position) => {
              const isOpen = position === 0;
              return (
                <li key={group.label} className="xp-group" data-open={isOpen ? "true" : undefined}>
                  <div className="xp-group-row">
                    <span className="xp-group-count">{group.count}</span>
                    <span className="xp-group-label">{group.label}</span>
                    <Chevron isOpen={isOpen} />
                  </div>
                  {isOpen && group.example ? (
                    <p className="xp-group-example">
                      <span className="toc-label">Example</span>
                      <span>{group.example}</span>
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </article>
      </div>

      <ExplorationNotes
        gain="Real cases"
        cost="Needs history"
      />
    </div>
  );
}

function Chevron({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className="xp-chevron"
      data-open={isOpen ? "true" : undefined}
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <path d="M6 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
