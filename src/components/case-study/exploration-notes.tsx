import "./exploration.css";

/**
 * The page-side notes under each exploration idea: what it gains, what
 * it costs, and a two-by-two showing who starts it and when.
 *
 * These are the case study talking, not the product, so they use the
 * site tokens (--text, --text-secondary, --border), never .toc-product.
 */

export type IdeaSource = "agent" | "admin";
export type IdeaMoment = "before-launch" | "in-use";

type ExplorationNotesProps = {
  gains: string[];
  costs: string[];
  source: IdeaSource;
  moment: IdeaMoment;
};

const SOURCES: { id: IdeaSource; label: string }[] = [
  { id: "agent", label: "Agent" },
  { id: "admin", label: "Admin" },
];

const MOMENTS: { id: IdeaMoment; label: string }[] = [
  { id: "before-launch", label: "Before launch" },
  { id: "in-use", label: "In use" },
];

export function ExplorationNotes({ gains, costs, source, moment }: ExplorationNotesProps) {
  return (
    <div className="xp-notes">
      <NoteList title="Gains" items={gains} />
      <NoteList title="Costs" items={costs} />
      <WhereItSits source={source} moment={moment} />
    </div>
  );
}

function NoteList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="xp-note">
      <p className="xp-note-title">{title}</p>
      <ul className="xp-note-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

/** Columns are when (before launch, in use). Rows are who starts it (agent, admin). */
function WhereItSits({ source, moment }: { source: IdeaSource; moment: IdeaMoment }) {
  const sourceLabel = SOURCES.find((item) => item.id === source)?.label;
  const momentLabel = MOMENTS.find((item) => item.id === moment)?.label;

  return (
    <div
      className="xp-grid"
      role="img"
      aria-label={`From ${sourceLabel?.toLowerCase()}, ${momentLabel?.toLowerCase()}`}
    >
      <span aria-hidden="true" />
      {MOMENTS.map((column) => (
        <span key={column.id} className="xp-grid-head" aria-hidden="true">
          {column.label}
        </span>
      ))}
      {SOURCES.map((row) => (
        <Row key={row.id} label={row.label} active={row.id === source} moment={moment} />
      ))}
    </div>
  );
}

function Row({ label, active, moment }: { label: string; active: boolean; moment: IdeaMoment }) {
  return (
    <>
      <span className="xp-grid-side" aria-hidden="true">
        {label}
      </span>
      {MOMENTS.map((column) => (
        <span
          key={column.id}
          className="xp-grid-cell"
          data-active={active && column.id === moment ? "true" : undefined}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
