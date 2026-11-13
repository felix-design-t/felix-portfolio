import "./type-what-you-have.css";
import "./exploration.css";
import "./decisions.css";

/**
 * Decision 02.
 *
 * Setup was many fields. The result is one policy document: the fields,
 * and the decision that solved the case.
 * Approve sits with them. The agent has not published it.
 */

const FIELDS = [
  { label: "Type", value: "PTO" },
  { label: "Teams", value: "Sales" },
  { label: "Yearly limit", value: "14 days" },
  { label: "Wait time", value: "90 days" },
  { label: "Accrual rate", value: "1.167/month" },
  { label: "Earned rate", value: "same as accrual rate" },
];

const SOLVED = [
  {
    label: "Scenario",
    value: "Day 105 asked for 2 days with 1 earned.",
  },
  {
    label: "Auto decision",
    value: "Approve earned hours, the rest unpaid.",
  },
];

export function DecisionDocumentVisual() {
  return (
    <div className="toc-product dec-doc-product" data-visual="decision-document">
      <article className="xp-card dec-doc" aria-label="Sales PTO policy">
        <header className="xp-card-head">
          <h3 className="xp-card-title">Sales PTO policy</h3>
          <p className="xp-card-meta">Edited: 01/15/2026</p>
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

        <section className="dec-block" aria-label="Tested">
          <p className="toc-label">Tested</p>
          <dl className="dec-rows">
            {SOLVED.map((item) => (
              <div key={item.label} className="dec-row">
                <dt>{item.label}</dt>
                <dd className={item.label === "Auto decision" ? "dec-solved" : undefined}>
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="dec-gate">
          <span className="dec-secondary">Edit</span>
          <span className="xp-solid">Approve</span>
        </div>
      </article>
    </div>
  );
}
