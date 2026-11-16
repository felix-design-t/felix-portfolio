import "./research-stats.css";

/**
 * Three engagement numbers in one row.
 *
 * Same quiet stat row as the expense study, without the colored dots.
 * On a phone the numbers stack so a long label never collides with the next one.
 */
const stats = [
  { value: "63%", label: "user retention rate" },
  { value: "45%", label: "task completion rate" },
  { value: "6%", label: "user donation rate" },
];

/**
 * The interview finding sits above its screenshot, inside one frame.
 * "80%" and "lack of motivation" take the same soft cyan wash
 * the expense study uses for a marked phrase.
 */
export function ResearchInsight() {
  return (
    <div className="research-insight">
      <p className="research-callout">
        <span className="research-callout-mark">80%</span> users reported{" "}
        <span className="research-callout-mark">lack of motivation</span> to
        complete tasks
      </p>
      <img
        src="/work/event-planning/research-1.png"
        alt="Quest task list with few ways to get involved"
        width={751}
        height={551}
        draggable={false}
      />
    </div>
  );
}

export function ResearchStats() {
  return (
    <ul className="research-stats">
      {stats.map((stat) => (
        <li key={stat.label}>
          <p className="research-stat-value">{stat.value}</p>
          <p className="research-stat-label">{stat.label}</p>
        </li>
      ))}
    </ul>
  );
}
