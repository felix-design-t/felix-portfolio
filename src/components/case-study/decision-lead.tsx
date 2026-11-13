import "./type-what-you-have.css";
import "./exploration.css";
import "./decisions.css";

/**
 * Decision 01, as two frames.
 *
 * The first frame starts where setup ends. The policy document is
 * already generated. The agent asks to check it against last year's
 * requests, the admin says yes, and that check lands on the right.
 *
 * The second frame starts from a question about Maya. The agent
 * answers and asks if that is ok. The admin says no, so the agent
 * offers the same choices as "Test your own scenarios." The narrow
 * rail lists the scenarios the admin has already tested.
 *
 * Static. Nothing here plays. Say policy, never rule.
 */

const CHOICES = ["Approve, balance −4", "Approve 1, 4 unpaid", "Deny with a reason"];
const CHOSEN = "Approve 1, 4 unpaid";

const SCENARIOS = ["Day 105", "Year end", "Part-time", "Maya"];
const CURRENT_SCENARIO = "Maya";

/** Setup is done. The admin agrees to a historical check, and the result sits on the right. */
export function HistoricalCheckVisual() {
  return (
    <div className="toc-product dec-lead" data-visual="historical-check">
      <HistoricalCheck />
    </div>
  );
}

function HistoricalCheck() {
  return (
    <div className="dec-screen" data-screen="history">
      <section className="dec-thread" aria-label="Conversation after the policy is generated">
        <div className="dec-generated">
          <svg className="dec-generated-mark" viewBox="0 0 16 20" aria-hidden="true">
            <path
              d="M3 1.5h7L13.5 5V18.5H3z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path d="M10 1.5V5h3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <span className="dec-generated-copy">
            <span className="dec-generated-name">Sales PTO policy</span>
            <span className="toc-label">Generated</span>
          </span>
        </div>

        <div className="dec-agent-block">
          <p className="toc-label">Agent</p>
          <p className="dec-agent dec-ask">
            Setup is finished. Check this policy against last year&rsquo;s requests?
          </p>
        </div>

        <p className="dec-admin">Yes</p>

        <div className="dec-composer" aria-label="Message">
          <p className="dec-composer-hint">Message</p>
          <span className="dec-composer-send" aria-hidden="true">
            <svg viewBox="0 0 16 16" className="dec-composer-icon">
              <path d="M8 12.5V3.8M8 3.8 4.6 7.2M8 3.8l3.4 3.4" />
            </svg>
          </span>
        </div>
      </section>

      <article className="dec-result" aria-label="Result of the historical check">
        <h3 className="dec-title">12 of 214 requests would change</h3>
        <p className="dec-meta">Last year&rsquo;s requests, replayed on the new policy</p>
        <p className="dec-example">
          <span className="toc-label">Example</span>
          <span>
            Day 105. Asked for 2 days with 1 earned. Was approved, now balance&nbsp;−1.
          </span>
        </p>
        <p className="dec-meta">5 requested more than earned after the wait</p>
      </article>
    </div>
  );
}

/** The admin asks about Maya, says the answer is not ok, and gets choices to confirm. */
export function MayaScenarioVisual() {
  return (
    <div className="toc-product dec-lead" data-visual="maya-scenario">
      <MayaScenario />
    </div>
  );
}

function MayaScenario() {
  return (
    <div className="dec-screen" data-screen="scenario">
      <section className="dec-thread" aria-label="Conversation about the Maya scenario">
        <p className="dec-admin">
          How will this policy handle Maya? She asked for 3 days on day 105. She has earned 1.
        </p>

        <div className="dec-agent-block">
          <p className="toc-label">Agent</p>
          <p className="dec-agent">
            She is 2 days short. The policy doesn&rsquo;t say what to do.
          </p>
          <p className="dec-agent dec-ask">Is this ok?</p>
        </div>

        <p className="dec-admin">No</p>

        <div className="dec-agent-block">
          <p className="toc-label">Agent</p>
          <div className="dec-options" aria-label="Ways to handle Maya">
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
                    <path
                      d="M4 8.5l2.5 2.5L12 5.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
                <span>Apply to future cases like this</span>
                <span className="toc-sr">, checked</span>
              </p>
              <span className="xp-solid">Confirm</span>
            </div>
          </div>
        </div>
      </section>

      <nav className="dec-rail" aria-label="Scenarios already tested">
        <p className="toc-label">Scenarios</p>
        <ul className="dec-scenario-list">
          {SCENARIOS.map((name) => {
            const isCurrent = name === CURRENT_SCENARIO;
            return (
              <li key={name}>
                <span className="dec-scenario" data-current={isCurrent ? "true" : undefined}>
                  {name}
                  {isCurrent ? <span className="toc-sr">, current</span> : null}
                </span>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
