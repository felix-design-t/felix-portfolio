import "./ideation-flow.css";

/**
 * The revamped event flow.
 *
 * White blocks are the steps that already existed. Cyan-edged blocks
 * are the social steps added in ideation. The dashed group is where
 * people share, meet, and make an impact before they donate.
 */
const notes = [
  "Social steps come before the donation.",
  "Activities give each event its own experience.",
  "The community stays after the event ends.",
];

export function IdeationFlow() {
  return (
    <div className="ideation">
      <header className="ideation-header">
        <p className="ideation-title">revamped user flow</p>
        <ul className="ideation-legend">
          <li>
            <span className="ideation-legend-dot" data-kind="social" />
            Social elements added
          </li>
          <li>
            <span className="ideation-legend-dot" data-kind="previous" />
            Previous
          </li>
        </ul>
      </header>

      <div className="ideation-flow">
        <Step>Enroll the event</Step>
        <Fork />
        <div className="ideation-pair">
          <Step>Join tasks</Step>
          <Step>Add Wallet</Step>
        </div>
        <Fork merge />
        <div className="ideation-social-group">
          <Step social>Share experiences</Step>
          <VerticalLink />
          <Step social>Meet new friends</Step>
          <VerticalLink />
          <Step social>Establish online impact</Step>
        </div>
        <Fork />
        <div className="ideation-pair">
          <Step>Check off tasks</Step>
          <Step>Donate to the event</Step>
        </div>
        <Fork merge />
        <Step social>Community continue to exist</Step>
      </div>

      <ul className="ideation-notes">
        {notes.map((note) => (
          <li key={note}>
            <span className="ideation-note-dot" />
            {note}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Step({
  children,
  social = false,
}: {
  children: string;
  social?: boolean;
}) {
  return (
    <p className="ideation-step" data-kind={social ? "social" : "previous"}>
      {children}
    </p>
  );
}

/** A branch that splits one step into two, or joins two back into one. */
function Fork({ merge = false }: { merge?: boolean }) {
  return (
    <svg
      className="ideation-fork"
      data-merge={merge ? "true" : undefined}
      viewBox="0 0 28 88"
      aria-hidden="true"
    >
      <path d="M2 44 H12 V14 H26 M12 44 V74 H26" />
    </svg>
  );
}

/** Up and down between the three social steps. */
function VerticalLink() {
  return (
    <svg className="ideation-vlink" viewBox="0 0 16 28" aria-hidden="true">
      <line x1="8" y1="4" x2="8" y2="24" />
      <polyline points="4,8 8,2 12,8" />
      <polyline points="4,20 8,26 12,20" />
    </svg>
  );
}
