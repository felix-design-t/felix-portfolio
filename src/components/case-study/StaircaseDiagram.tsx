import "./staircase-diagram.css";

export type StaircaseLevel = {
  /** Level name, shown in the meta column. */
  name: string;
  /** Small muted line naming the screen the level appears on. */
  tag: string;
  /** Fields shown as pill chips. */
  fields: string[];
};

type StaircaseDiagramProps = {
  levels: StaircaseLevel[];
  /** Spoken name for the list, for screen readers. */
  label?: string;
};

/**
 * Information levels as a staircase.
 *
 * Think of nested menus: each row sits one step deeper than the one
 * above, so the page itself shows "more detail the further you go".
 * The indent and the connector lines come from CSS (see the
 * stylesheet), driven by `--stair-step`, the row's position.
 * All copy is passed in, nothing is written here.
 */
export function StaircaseDiagram({
  levels,
  label = "Information levels, from always visible to rare cases",
}: StaircaseDiagramProps) {
  return (
    <ol className="staircase" aria-label={label}>
      {levels.map((level, index) => (
        <li
          className="staircase-row"
          key={level.name}
          style={{ "--stair-step": index } as React.CSSProperties}
          data-emphasis={index === 0 ? "true" : undefined}
        >
          <div className="staircase-meta">
            <span className="staircase-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="staircase-name">{level.name}</p>
            <p className="staircase-tag">{level.tag}</p>
          </div>
          <ul className="staircase-chips">
            {level.fields.map((field) => (
              <li className="staircase-chip" key={field}>
                {field}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
