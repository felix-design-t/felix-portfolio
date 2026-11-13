import "./type-what-you-have.css";
import "./note-to-policy.css";

/**
 * Solution, first frame.
 *
 * One product window, not three separate frames. The name of the
 * policy sits in the window title, the way a file name sits in a
 * window bar. Under that, the left side is the conversation, starting
 * from the note the admin typed. The right side is the policy taking
 * shape: the fields the agent pulled out, then the lines the admin
 * corrected. Confirm sits under those lines. Nothing here has become
 * the policy until the admin confirms.
 *
 * The words are reused from "Only what you said" and "See every change".
 * Scale comes from the product tokens: title, then body, then a short
 * control. This frame does not play. Reduced motion is the same picture.
 */

const FIELDS = [
  { label: "Type", value: "PTO" },
  { label: "Teams", value: "Sales" },
  { label: "Yearly limit", value: "14 days" },
  { label: "Accrual", value: "Monthly" },
] as const;

export function NoteToPolicyVisual() {
  return (
    <div className="toc-product ntp-product" data-visual="note-to-policy">
      <div className="ntp-window">
        <header className="ntp-titlebar">
          <h3 className="ntp-title">Sales PTO policy</h3>
        </header>

        <section className="ntp-thread" aria-label="Conversation, starting from the note">
          <p className="ntp-admin">
            I need to create a <span className="ntp-source">PTO</span> policy for{" "}
            <span className="ntp-source">sales</span> teams, the{" "}
            <span className="ntp-source">yearly</span> limit is{" "}
            <span className="ntp-source">14 days</span>.
          </p>

          <div className="ntp-agent-block">
            <p className="toc-label">Agent</p>
            <p className="ntp-agent">Here&apos;s what I got from your request.</p>
            <p className="ntp-agent ntp-ask">
              I didn&apos;t see accrual. How should it work?
            </p>
          </div>

          <p className="ntp-admin">Monthly</p>

          <p className="ntp-agent">
            One line changed. Yearly limit, 14 days to 16.
          </p>

          <div className="ntp-composer" aria-label="Message">
            <p className="ntp-composer-hint">Message</p>
            <span className="ntp-composer-send" aria-hidden="true">
              <svg viewBox="0 0 16 16" className="ntp-composer-icon">
                <path d="M8 12.5V3.8M8 3.8 4.6 7.2M8 3.8l3.4 3.4" />
              </svg>
            </span>
          </div>
        </section>

        <article className="ntp-policy" aria-label="Sales PTO policy, not confirmed yet">
          <div className="ntp-body">
            <section className="ntp-group" aria-label="Fields the agent pulled out">
              <p className="toc-label">Fields</p>
              <ul className="ntp-fields">
                {FIELDS.map((field) => (
                  <li key={field.label} className="ntp-field">
                    <span className="ntp-field-label">{field.label}</span>
                    <span className="ntp-field-value">{field.value}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="ntp-group" aria-label="Lines the admin corrected">
              <div className="ntp-lines-head">
                <p className="toc-label">Lines</p>
                <p className="ntp-count">1 line changed, 3 unchanged</p>
              </div>
              <div className="ntp-lines">
                <p className="ntp-line">
                  This policy covers <span className="ntp-value">PTO</span>.
                </p>
                <p className="ntp-line">
                  It applies to the <span className="ntp-value">Sales</span> teams.
                </p>
                <p className="ntp-line" data-changed="true">
                  Each employee gets <s className="ntp-old">14 days</s>{" "}
                  <span className="ntp-value">16 days</span> of PTO per year.
                </p>
                <p className="ntp-line">
                  Days are earned <span className="ntp-value">Monthly</span>.
                </p>
              </div>
            </section>
          </div>

          <div className="ntp-controls">
            <span className="toc-label">Draft</span>
            <span className="ntp-confirm">Confirm</span>
          </div>
        </article>
      </div>
    </div>
  );
}
