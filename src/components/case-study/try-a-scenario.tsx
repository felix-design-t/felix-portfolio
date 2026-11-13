import { ExplorationNotes } from "./exploration-notes";
import "./type-what-you-have.css";
import "./exploration.css";

/**
 * Exploration idea 1: the admin tries a scenario before launch.
 *
 * A product card: preset chips, three input-like fields, and one result
 * line. Static: this is the end state.
 */

const PRESETS = ["Day 91", "Year end", "Part-time"];
const ACTIVE_PRESET = "Day 91";

const FIELDS = [
  { label: "Start date", value: "Jan 5, 2026" },
  { label: "Request date", value: "Apr 5, 2026" },
  { label: "Days requested", value: "5" },
];

export function TryAScenarioVisual() {
  return (
    <div className="xp-idea" data-visual="try-a-scenario">
      <div className="toc-product xp-product">
        <article className="xp-card" aria-label="Try a scenario">
          <header className="xp-card-head">
            <h3 className="xp-card-title">Sales PTO Policy</h3>
            <p className="xp-card-meta">
              90 days before PTO accrues, 14 days a year, earned monthly
            </p>
          </header>

          <div className="xp-presets" role="group" aria-label="Presets">
            {PRESETS.map((preset) => (
              <span
                key={preset}
                className="xp-preset"
                data-active={preset === ACTIVE_PRESET ? "true" : undefined}
              >
                {preset}
              </span>
            ))}
          </div>

          <dl className="xp-fields">
            {FIELDS.map((field) => (
              <div key={field.label} className="xp-field">
                <dt className="toc-label">{field.label}</dt>
                <dd className="xp-field-value">{field.value}</dd>
              </div>
            ))}
          </dl>

          <div className="xp-result">
            <span className="toc-label">Result</span>
            <span className="xp-result-dot" aria-hidden="true" />
            <p className="xp-result-line">
              Earned 1 day. Approved, balance{"\u00a0"}−4
            </p>
          </div>
        </article>
      </div>

      <ExplorationNotes
        gains={["Admin stays in control", "Sees why", "Builds trust"]}
        costs={[
          "Finds only what the admin thinks to test",
          "One case at a time",
          "Takes effort",
        ]}
        source="admin"
        moment="before-launch"
      />
    </div>
  );
}
