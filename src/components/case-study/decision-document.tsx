import "./type-what-you-have.css";
import "./exploration.css";
import "./decisions.css";

/**
 * Decision 02.
 *
 * Setup was many fields. The result is one policy document: the fields,
 * the answers the admin gave, and the warnings they chose to keep.
 * Approve sits with them. The agent has not published it.
 */

const FIELDS = [
  { label: "Type", value: "PTO" },
  { label: "Teams", value: "Sales" },
  { label: "Yearly limit", value: "14 days" },
  { label: "Wait", value: "90 days" },
];

const ANSWERS = [
  { label: "Accrual", value: "Monthly" },
  { label: "Day 105", value: "Keep the warning" },
];

const WARNINGS = [
  "5 requested more than earned after the wait",
  "Day 105. Asked for 2 days with 1 earned. Was approved, now balance −1.",
];

export function DecisionDocumentVisual() {
  return (
    <div className="toc-product dec-doc-product" data-visual="decision-document">
      <article className="xp-card dec-doc" aria-label="Sales PTO policy">
        <header className="xp-card-head">
          <h3 className="xp-card-title">Sales PTO policy</h3>
          <p className="xp-card-meta">
            Fields, answers, and the warnings you kept
          </p>
        </header>

        <section className="dec-block" aria-label="Fields">
          <p className="toc-label">Fields</p>
          <dl className="dec-rows">
            {FIELDS.map((field) => (
              <div key={field.label} className="dec-row">
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="dec-block" aria-label="Answers">
          <p className="toc-label">Answers</p>
          <dl className="dec-rows">
            {ANSWERS.map((answer) => (
              <div key={answer.label} className="dec-row">
                <dt>{answer.label}</dt>
                <dd>{answer.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="dec-block" aria-label="Warnings kept">
          <p className="toc-label">Warnings kept</p>
          <ul className="dec-rows">
            {WARNINGS.map((warning) => (
              <li key={warning} className="dec-row">
                <span className="dec-warning">{warning}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="dec-gate">
          <span className="toc-label">Not published</span>
          <span className="xp-solid">Approve policy</span>
        </div>
      </article>
    </div>
  );
}
