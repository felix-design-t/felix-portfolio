import { ExplorationNotes } from "./exploration-notes";
import "./type-what-you-have.css";
import "./exploration.css";

/**
 * Exploration idea 3: once the policy is in use, the agent asks the
 * admin about a case the policy doesn't cover, instead of deciding.
 *
 * The admin's inbox card. The agent asks instead of deciding.
 */

const CHOICES = ["Approve, balance −4", "Approve 1, 4 unpaid", "Deny with a reason"];
const CHOSEN = "Approve 1, 4 unpaid";

export function AskInsteadVisual() {
  return (
    <div className="xp-idea" data-visual="ask-instead">
      <div className="toc-product xp-product">
          <article className="xp-card" aria-label="Inbox">
            <header className="xp-ask">
              <span className="toc-label">Ask</span>
              <p className="xp-ask-question">
                Maya asked for 3 days on day 105. She has earned 1. The policy
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

            <div className="xp-card-foot">
              <p className="xp-check">
                <span className="xp-checkbox" aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    <path d="M4 8.5l2.5 2.5L12 5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
                <span>Apply to future cases like this</span>
                <span className="toc-sr">, checked</span>
              </p>
              <span className="xp-solid">Confirm</span>
            </div>
          </article>
        </div>

      <ExplorationNotes
        gain="Catches unpredicted cases"
        cost="A real employee waits"
      />
    </div>
  );
}
