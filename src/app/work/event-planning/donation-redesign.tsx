import "./donation-redesign.css";

/**
 * Donation, before and after.
 *
 * The old path is one long list. The new path is three steps.
 * Share impact stays a plain step. It is not a social accent.
 */
const previous = [
  "Donate amount",
  "Tip DIEMlife",
  "Billing info",
  "Payment info",
  "Receipt",
];

const redesigned = [
  { step: "Step 1", items: ["Donate amount", "Tip DIEMlife"] },
  { step: "Step 2", items: ["Billing info", "Payment info"] },
  { step: "Step 3", items: ["Receipt", "Share impact"] },
];

const problems = ["All in one page", "Hard to trace information"];

const improvements = [
  "Separate into logical steps",
  "Save mental stress of overwhelming information",
  "Prevent interface get extremely long",
];

export function DonationFlowCompare() {
  return (
    <div className="donation-flows">
      <section className="donation-column">
        <p className="donation-heading">previous flow</p>
        <ol className="donation-stack">
          {previous.map((label, index) => (
            <li key={label}>
              <p className="donation-chip">{label}</p>
              {index < previous.length - 1 ? <DownArrow /> : null}
            </li>
          ))}
        </ol>
      </section>
      <span className="donation-between" aria-hidden="true">
        →
      </span>
      <section className="donation-column">
        <p className="donation-heading">redesigned flow</p>
        <div className="donation-redesign-row">
          {redesigned.map((column, index) => (
            <div className="donation-redesign-col" key={column.step}>
              <div className="donation-step-line">
                <p className="donation-chip" data-kind="step">
                  {column.step}
                </p>
                {index < redesigned.length - 1 ? (
                  <span className="donation-step-arrow" aria-hidden="true">
                    →
                  </span>
                ) : null}
              </div>
              {column.items.map((label) => (
                <p className="donation-chip" key={label}>
                  {label}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function DonationScreens() {
  const screens = [
    {
      src: "/work/event-planning/ideation-1.2.png",
      alt: "Step 1 of the donation form, with the quest and amount",
      width: 285,
      height: 182,
      step: "Step 1",
    },
    {
      src: "/work/event-planning/ideation-1.3.png",
      alt: "Step 2 of the donation form, with billing and payment",
      width: 285,
      height: 215,
      step: "Step 2",
    },
    {
      src: "/work/event-planning/ideation-1.4.png",
      alt: "Step 3 of the donation form, the thank-you screen",
      width: 285,
      height: 161,
      step: "Step 3",
    },
  ];

  return (
    <div className="donation-screens">
      <div className="donation-notes">
        <ul data-tone="bad">
          {problems.map((note) => (
            <li key={note}>
              <span className="donation-dot" />
              {note}
            </li>
          ))}
        </ul>
        <ul data-tone="good">
          {improvements.map((note) => (
            <li key={note}>
              <span className="donation-dot" />
              {note}
            </li>
          ))}
        </ul>
      </div>
      <div className="donation-screens-stage">
        <img
          className="donation-screen-long"
          src="/work/event-planning/ideation-1.1.png"
          alt="The old donation form, with every field on one page"
          width={209}
          height={570}
          draggable={false}
        />
        <div className="donation-screen-stack">
          {screens.map((screen) => (
            <div className="donation-screen-row" key={screen.step}>
              <p className="donation-chip" data-kind="step">
                {screen.step}
              </p>
              <span className="donation-step-arrow" aria-hidden="true">
                →
              </span>
              <img
                src={screen.src}
                alt={screen.alt}
                width={screen.width}
                height={screen.height}
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DownArrow() {
  return (
    <span className="donation-down" aria-hidden="true">
      ↓
    </span>
  );
}
