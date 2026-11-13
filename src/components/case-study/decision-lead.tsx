import "./type-what-you-have.css";
import "./exploration.css";
import "./decisions.css";

/**
 * Decision 01.
 *
 * One window, split the way a chat sits beside the work.
 * Left: the agent asks, the admin answers, and Confirm is still
 * waiting, so nothing has been applied.
 * Right: the case they are talking about. The count and the open
 * example are the replay from Exploration 02. The question, that the
 * policy does not say what to do, is the tested case from Exploration 03.
 */

export function DecisionLeadVisual() {
  return (
    <div className="toc-product dec-lead" data-visual="decision-lead">
      <div className="dec-split">
        <section className="dec-thread" aria-label="The agent asks and the admin answers">
          <p className="toc-label">Agent</p>
          <p className="dec-ask">
            Day 105 was approved, and the balance went to −1. The policy
            doesn&rsquo;t say what to do. Keep the warning?
          </p>
          <p className="dec-admin">
            Keep it. I&rsquo;ll confirm before anything applies.
          </p>
          <div className="dec-gate">
            <span className="toc-label">Not applied</span>
            <span className="xp-solid">Confirm</span>
          </div>
        </section>

        <article className="dec-case" aria-label="The case from last year's replay">
          <header className="xp-card-head">
            <h3 className="xp-card-title">12 of 214 requests would change</h3>
            <p className="xp-card-meta">
              Last year&rsquo;s requests, replayed on the new policy
            </p>
          </header>
          <p className="dec-example">
            <span className="toc-label">Example</span>
            <span>
              Day 105. Asked for 2 days with 1 earned. Was approved, now
              balance&nbsp;−1.
            </span>
          </p>
          <p className="dec-case-line">
            5 requested more than earned after the wait
          </p>
        </article>
      </div>
    </div>
  );
}
