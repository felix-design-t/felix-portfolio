import "./interaction-compare.css";

/**
 * Donation amount and tip, before and after.
 *
 * The left picture is the old dropdown. The right video is the sliding bar.
 * Rose marks what failed. Emerald marks what the new interaction fixed.
 */
const problems = [
  "Unable to see all options at first",
  "Require extra clicks to complete",
];

const improvements = [
  "View all options clearly",
  "Provide customized options",
];

export function InteractionCompare() {
  return (
    <div className="interaction-compare">
      <section className="interaction-side">
        <p className="interaction-heading">Previous</p>
        <img
          src="/work/event-planning/iteration-3.png"
          alt="A dropdown for the donation amount and another for the tip"
          width={525}
          height={335}
          draggable={false}
        />
        <ul data-tone="bad">
          {problems.map((note) => (
            <li key={note}>
              <span className="interaction-dot" />
              {note}
            </li>
          ))}
        </ul>
      </section>
      <span className="interaction-arrow" aria-hidden="true">
        →
      </span>
      <section className="interaction-side">
        <p className="interaction-heading">After Iterations</p>
        <video
          src="/work/event-planning/interaction-1.2.mp4"
          width={2460}
          height={1080}
          autoPlay
          muted
          loop
          playsInline
          aria-label="A sliding bar for choosing a donation amount and a tip"
        />
        <ul data-tone="good">
          {improvements.map((note) => (
            <li key={note}>
              <span className="interaction-dot" />
              {note}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
