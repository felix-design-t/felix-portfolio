import "./functional-share.css";

/**
 * How sharing sits at the end of a donation.
 *
 * Step 1 compares the old thank-you page with a share window of its own.
 * Step 2 is the motion of sharing inside the community and outside it.
 * Rose marks what failed. Emerald marks what the new step fixed.
 */
const problems = [
  "Overlooks sharing section",
  "Mixed with thank-you notice and receipt",
];

const improvements = [
  "Attentions for important call-to action",
  "Independent section to perform actions",
];

export function FunctionalCompare() {
  return (
    <div className="functional-share">
      <p className="functional-step">step 1: modal window vs. full screen</p>
      <div className="functional-compare">
        <section className="functional-side">
          <img
            src="/work/event-planning/iteration-4.1.png"
            alt="The thank-you page, with sharing mixed into the receipt"
            width={563}
            height={318}
            draggable={false}
          />
          <ul data-tone="bad">
            {problems.map((note) => (
              <li key={note}>
                <span className="functional-dot" />
                {note}
              </li>
            ))}
          </ul>
        </section>
        <span className="functional-arrow" aria-hidden="true">
          →
        </span>
        <section className="functional-side">
          <img
            src="/work/event-planning/iteration-4.2.png"
            alt="A share window of its own, over the thank-you page"
            width={563}
            height={318}
            draggable={false}
          />
          <ul data-tone="good">
            {improvements.map((note) => (
              <li key={note}>
                <span className="functional-dot" />
                {note}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export function FunctionalSpread() {
  return (
    <div className="functional-share">
      <p className="functional-step">
        step 2: spread words inside and out of the community
      </p>
      <video
        src="/work/event-planning/functional-2.mp4"
        width={1916}
        height={1080}
        autoPlay
        muted
        loop
        playsInline
        aria-label="Sharing a donation inside the community and outside it"
      />
    </div>
  );
}
