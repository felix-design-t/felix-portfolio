import type { CSSProperties } from "react";
import "./results-comparison.css";

export type ResultsComparisonRow = {
  /** What was measured, e.g. "widget usability". */
  metric: string;
  /** Value from the first round. Shown a little faded. */
  round1: string;
  /** Value from the second round. Full contrast. */
  round2: string;
  /** Short verdict under the second value, e.g. "improved". */
  verdict: string;
  /** Dot color for the verdict: good is emerald, mixed is amber, bad is orange. */
  tone: "good" | "mixed" | "bad";
  /** What a participant said. Quote marks are added here. */
  quote: string;
};

export type ResultsComparisonData = {
  /** The three column labels: first round, second round, feedback. */
  headings: [string, string, string];
  rows: ResultsComparisonRow[];
};

type ResultsComparisonProps = {
  data: ResultsComparisonData;
};

/**
 * Two rounds of testing, side by side.
 *
 * Think of a before/after row in a spec table: the same measure
 * twice, then the reason in a user's own words. On desktop it is a
 * 3-column grid with hairlines between rows. On a phone every row
 * becomes its own small card (see the stylesheet).
 * All copy is passed in. Nothing is written here.
 */
export function ResultsComparison({ data }: ResultsComparisonProps) {
  const [round1Heading, round2Heading, feedbackHeading] = data.headings;

  return (
    <div className="results-comparison">
      {/* Column labels. Hidden on a phone, where each cell labels itself. */}
      <div className="results-head" aria-hidden="true">
        <span className="results-head-label" data-round="1">
          {round1Heading}
        </span>
        <span className="results-head-label" data-round="2">
          {round2Heading}
        </span>
        <span className="results-head-label">{feedbackHeading}</span>
      </div>

      <ol className="results-rows">
        {data.rows.map((row) => (
          <li className="results-row" key={row.metric}>
            <p className="results-cell results-round1">
              <span className="results-cell-label" aria-hidden="true">
                {round1Heading}
              </span>
              <span className="results-sr">{round1Heading}: </span>
              <span className="results-value">{row.round1}</span>
            </p>

            <span className="results-arrow" aria-hidden="true">
              →
            </span>

            <p className="results-cell results-round2">
              <span className="results-cell-label" aria-hidden="true">
                {round2Heading}
              </span>
              <span className="results-sr">{round2Heading}: </span>
              <span className="results-value">{row.round2}</span>
              <span
                className="results-verdict"
                style={{ "--results-tone": toneColor[row.tone] } as CSSProperties}
              >
                <span className="results-dot" aria-hidden="true" />
                {row.verdict}
              </span>
            </p>

            <p className="results-metric">
              {row.metric}
            </p>

            <blockquote className="results-quote">
              <p>{`\u201C${row.quote}\u201D`}</p>
            </blockquote>
          </li>
        ))}
      </ol>
    </div>
  );
}

const toneColor: Record<ResultsComparisonRow["tone"], string> = {
  good: "var(--accent-emerald)",
  mixed: "var(--accent-amber)",
  bad: "var(--accent-orange)",
};
