import { ExplorationNotes } from "./exploration-notes";
import "./type-what-you-have.css";
import "./exploration.css";

/**
 * Exploration idea 3: once the policy is in use, the agent asks the
 * admin about a case the policy doesn't cover, instead of deciding.
 *
 * Left: the admin's inbox card (product). Right: a small timeline (page)
 * where the 6-week wait for a payroll flag becomes the same day.
 */

const CHOICES = ["Approve, balance −4", "Approve 1, 4 unpaid", "Deny with a reason"];
const CHOSEN = "Approve 1, 4 unpaid";

export function AskInsteadVisual() {
  return (
    <div className="xp-idea" data-visual="ask-instead">
      <div className="xp-ask-layout">
        <div className="toc-product xp-product">
          <article className="xp-card" aria-label="Inbox">
            <header className="xp-card-head">
              <span className="toc-label">Ask</span>
              <p className="xp-ask-question">
                Maya asked for 5 days on day 91. She has earned 1. The policy
                doesn&rsquo;t say what to do.
              </p>
            </header>

            <ul className="xp-choices">
              {CHOICES.map((choice) => {
                const isChosen = choice === CHOSEN;
                return (
                  <li key={choice} className="xp-choice" data-chosen={isChosen ? "true" : undefined}>
                    <span className="xp-radio" aria-hidden="true" />
                    <span>{choice}</span>
                    {isChosen ? <span className="toc-sr">, selected</span> : null}
                  </li>
                );
              })}
            </ul>

            <p className="xp-check">
              <span className="xp-checkbox" aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M4 8.5l2.5 2.5L12 5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
              <span>Apply to future cases like this</span>
              <span className="toc-sr">, checked</span>
            </p>

            <div className="xp-card-foot">
              <span className="xp-solid">Confirm</span>
            </div>
          </article>
        </div>

        <figure className="xp-gap" aria-label="Without asking, the admin finds out 6 weeks later from a payroll flag. Asking, the admin answers the same day.">
          <div className="xp-gap-row">
            <p className="xp-gap-title">Without asking</p>
            <div className="xp-gap-track" data-kind="late" aria-hidden="true">
              <span className="xp-gap-dot" />
              <span className="xp-gap-line" />
              <span className="xp-gap-dot" />
            </div>
            <p className="xp-gap-ends" aria-hidden="true">
              <span>Request</span>
              <span>Payroll flag</span>
            </p>
            <p className="xp-gap-span xp-gap-span-late">6 weeks</p>
          </div>
          <div className="xp-gap-row">
            <p className="xp-gap-title">Asking</p>
            <div className="xp-gap-track" data-kind="same" aria-hidden="true">
              <span className="xp-gap-dot" />
              <span className="xp-gap-line" />
              <span className="xp-gap-dot" />
            </div>
            <p className="xp-gap-ends" aria-hidden="true">
              <span>Request, answer</span>
            </p>
            <p className="xp-gap-span">Same day</p>
          </div>
        </figure>
      </div>

      <ExplorationNotes
        gain="Catches unpredicted cases"
        cost="A real employee waits"
      />
    </div>
  );
}
