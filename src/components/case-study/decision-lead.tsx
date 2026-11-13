import type { ReactNode } from "react";
import "./type-what-you-have.css";
import "./exploration.css";
import "./decisions.css";
import { LastYearReport } from "./replay-last-year";

/**
 * Decision 01, as two frames.
 *
 * The first frame starts where setup ends. The policy document is
 * already generated. The agent asks to check it against last year's
 * requests, the admin says yes, and that check lands on the right.
 *
 * The second frame starts from a question about Maya. The agent
 * answers and asks if that is ok. The admin says yes, so the agent
 * offers the same choices as "Test your own scenarios."
 *
 * Static. Nothing here plays. Say policy, never rule.
 */

const CHOICES = ["Approve, balance −1", "Approve 1, 1 unpaid", "Deny with a reason"];
const CHOSEN = "Approve 1, 1 unpaid";

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
            <span className="dec-generated-state">Unpublished</span>
          </span>
        </div>

        <div className="dec-agent-message">
          <p className="dec-agent">
            <span className="toc-sr">Agent. </span>
            Setup is finished. Check this policy against last year&rsquo;s requests?
          </p>
          <div className="dec-actions" aria-label="Message actions">
            <span className="dec-action">
              <CopyIcon />
              <span className="toc-sr">Copy</span>
            </span>
            <span className="dec-action">
              <ThumbUpIcon />
              <span className="toc-sr">Good</span>
            </span>
            <span className="dec-action">
              <ThumbDownIcon />
              <span className="toc-sr">Bad</span>
            </span>
            <span className="dec-action">
              <RetryIcon />
              <span className="toc-sr">Try again</span>
            </span>
          </div>
        </div>

        <p className="dec-admin">Yes</p>

        <MessageBox />
      </section>

      <article className="dec-result" aria-label="Report from last year's requests">
        <header className="dec-titlebar">
          <p className="dec-titlebar-name">History Data Test</p>
          <span className="dec-titlebar-actions">
            <span className="dec-titlebar-settings">
              <ExpandIcon />
              <span className="toc-sr">Expand</span>
            </span>
            <span className="dec-titlebar-settings">
              <SidebarIcon />
              <span className="toc-sr">Open sidebar</span>
            </span>
          </span>
        </header>
        <div className="dec-result-body">
          <LastYearReport />
        </div>
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
          What happens if an employee requests 2 hours, with more than 2 hours accrued but less than 2 hours earned?
        </p>

        <div className="dec-agent-message">
          <p className="dec-agent">
            <span className="toc-sr">Agent. </span>
            Your current policy doesn&rsquo;t have a solution.
          </p>
          <p className="dec-agent">Do you want me to provide options?</p>
        </div>

        <p className="dec-admin">Yes</p>

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
                <span>Apply to future cases</span>
                <span className="toc-sr">, checked</span>
              </p>
              <span className="xp-solid">Confirm</span>
            </div>
          </div>
        <MessageBox isDisabled />
      </section>
    </div>
  );
}

/** The same message box under both conversations. It stays at the bottom of the thread. */
function MessageBox({ isDisabled = false }: { isDisabled?: boolean }) {
  return (
    <div
      className="dec-composer"
      data-state={isDisabled ? "disabled" : undefined}
      aria-disabled={isDisabled ? true : undefined}
      aria-label="Message"
    >
      <p className="dec-composer-hint">Ask about this policy</p>
      <div className="dec-composer-bar">
        <span className="dec-composer-plus" aria-hidden="true">
          <svg viewBox="0 0 16 16" className="dec-composer-icon">
            <path d="M8 3.5v9M3.5 8h9" />
          </svg>
        </span>
        <span className="dec-composer-send" aria-hidden="true">
          <svg viewBox="0 0 16 16" className="dec-composer-icon">
            <path d="M8 12.5V3.8M8 3.8 4.6 7.2M8 3.8l3.4 3.4" />
          </svg>
        </span>
      </div>
    </div>
  );
}

/**
 * Message actions, drawn on the site's 16px icon grid.
 * Stroke weight comes from --icon-stroke, the same token as the nav icons.
 */
function ActionIcon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="dec-action-icon">
      {children}
    </svg>
  );
}

function CopyIcon() {
  return (
    <ActionIcon>
      <path d="M6 6.25h6.25V12.5H6z" />
      <path d="M3.75 9.75V4.25c0-.28.22-.5.5-.5H9.5" />
    </ActionIcon>
  );
}

function ThumbUpIcon() {
  return (
    <ActionIcon>
      <path d="M6.25 7.25 8 3.75c.35-.7 1.4-.45 1.4.4V7.1h2.35c.65 0 1.15.58 1.05 1.22l-.65 3.05c-.1.48-.52.88-1.01.88H6.25" />
      <path d="M3.5 7.25h2.75V12.25H3.5z" />
    </ActionIcon>
  );
}

function ThumbDownIcon() {
  return (
    <ActionIcon>
      <path d="M6.25 8.75 8 12.25c.35.7 1.4.45 1.4-.4V8.9h2.35c.65 0 1.15-.58 1.05-1.22l-.65-3.05c-.1-.48-.52-.88-1.01-.88H6.25" />
      <path d="M3.5 8.75h2.75V3.75H3.5z" />
    </ActionIcon>
  );
}

function ExpandIcon() {
  return (
    <ActionIcon>
      <path d="M4.5 11.5 11.5 4.5" />
      <path d="M6.4 4.5H11.5V9.6" />
    </ActionIcon>
  );
}

function SidebarIcon() {
  return (
    <ActionIcon>
      <path d="M3.4 4.4h9.2a.8.8 0 0 1 .8.8v5.6a.8.8 0 0 1-.8.8H3.4a.8.8 0 0 1-.8-.8V5.2a.8.8 0 0 1 .8-.8Z" />
      <path d="M6.2 4.4v7.2" />
    </ActionIcon>
  );
}

function RetryIcon() {
  return (
    <ActionIcon>
      <path d="M13 8.25a5 5 0 1 1-1.46-3.54" />
      <path d="M11.4 2.4v3.1H8.3" />
    </ActionIcon>
  );
}
