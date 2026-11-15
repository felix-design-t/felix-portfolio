import "./hierarchy-diagram.css";

type HierarchyLevel = {
  /** Quiet label above the card, such as "Always visible". */
  caption: string;
  title: string;
  items: string[];
  /** The first level is the one people see without opening anything. */
  emphasis?: boolean;
};

type HierarchyDiagramProps = {
  leftLabel?: string;
  rightLabel?: string;
  gapLabel?: string;
  levels?: HierarchyLevel[];
};

const defaultLevels: HierarchyLevel[] = [
  {
    caption: "Always visible",
    title: "Level 1: Policy Adherence",
    emphasis: true,
    items: [
      "Expense Status",
      "Policy & Rules",
      "Descriptions",
      "Type",
      "Submitted Date",
      "Amount",
      "Warnings",
    ],
  },
  {
    caption: "On expand",
    title: "Level 2: Re-Validation",
    items: [
      "Receipts",
      "Departments",
      "Labor Allocation",
      "Paid In Country",
      "Edit Access",
    ],
  },
  {
    caption: "Full detail",
    title: "Level 3: All-Inclusive",
    items: [
      "Approval Workflow",
      "Comments",
      "Exceptions",
      "Account",
      "Mileage",
      "Rate Amount",
      "Trip Route",
    ],
  },
];

/**
 * Where two needs overlap, and how much detail each step shows.
 *
 * The circles are the two needs. The dashed lens is the gap between
 * them. The cards to the right are the same information, revealed in
 * three steps. Colors and type come from the site tokens.
 */
export function HierarchyDiagram({
  leftLabel = "Visibility",
  rightLabel = "Actions",
  gapLabel = "Missing",
  levels = defaultLevels,
}: HierarchyDiagramProps) {
  return (
    <div
      className="hierarchy-diagram"
      aria-label={`${leftLabel} and ${rightLabel} overlap at ${gapLabel}, then open into ${levels.length} levels of detail`}
    >
      <div className="hierarchy-venn">
        <p className="hierarchy-circle hierarchy-circle-left">{leftLabel}</p>
        <p className="hierarchy-circle hierarchy-circle-right">{rightLabel}</p>
        <p className="hierarchy-gap">{gapLabel}</p>
      </div>

      <svg
        className="hierarchy-bridge"
        viewBox="0 0 48 56"
        aria-hidden="true"
      >
        <path
          d="M4 40 C 18 40, 26 16, 44 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M38 12 L44 16 L38 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>

      <div className="hierarchy-levels">
        {levels.map((level, index) => (
          <div className="hierarchy-level" key={level.title}>
            {index > 0 ? (
              <svg
                className="hierarchy-step"
                viewBox="0 0 12 12"
                aria-hidden="true"
              >
                <path
                  d="M2 2 L8 6 L2 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                />
              </svg>
            ) : null}
            <div className="hierarchy-level-body">
              <p className="hierarchy-caption">{level.caption}</p>
              <article
                className="hierarchy-card"
                data-emphasis={level.emphasis ? "true" : undefined}
              >
                <p className="hierarchy-card-title">{level.title}</p>
                <hr className="hierarchy-card-rule" />
                <ul className="hierarchy-card-list">
                  {level.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
