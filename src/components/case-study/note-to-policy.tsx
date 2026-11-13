"use client";

import { useEffect, useRef } from "react";
import "./type-what-you-have.css";
import "./only-what-you-said.css";
import "./edit-one-line.css";
import "./note-to-policy.css";

/**
 * Solution, first frame.
 *
 * One column. The conversation is the Trust Building thread: the note,
 * the fields pulled from it, the accrual question, and the answer.
 * Under that sits the policy card from the same section, with the one
 * line the admin changed. There is no second column.
 */

const FIELDS = [
  { label: "Type", value: "PTO" },
  { label: "Teams", value: "Sales" },
  { label: "Yearly limit", value: "14 days" },
] as const;

export function NoteToPolicyVisual() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const figure = root.closest("figure");
    const placeholder = figure?.nextElementSibling?.querySelector(".case-study-frame");
    if (!figure || !(placeholder instanceof HTMLElement)) return;

    // The empty frame under this one stays the same height as the screen.
    const match = () => {
      placeholder.style.height = `${figure.offsetHeight}px`;
      placeholder.style.aspectRatio = "auto";
    };
    match();
    const observer = new ResizeObserver(match);
    observer.observe(figure);
    return () => {
      observer.disconnect();
      placeholder.style.height = "";
      placeholder.style.aspectRatio = "";
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="toc-product ntp-product ofs-product"
      data-visual="note-to-policy"
      data-fit="row"
    >
      <div className="ntp-window">
        <div className="ntp-thread">
          <article className="ofs-bubble ofs-message" data-state="current" aria-label="Your request">
            <p className="ofs-request">
              I need to create a <span className="ofs-phrase">PTO</span> policy for{" "}
              <span className="ofs-phrase">sales</span> teams, the{" "}
              <span className="ofs-phrase">yearly</span> limit is{" "}
              <span className="ofs-phrase">14 days</span>.
            </p>
          </article>

          <article className="ofs-card ofs-message" data-state="current" aria-label="Agent: what I got">
            <p className="ofs-lead">Here&apos;s what I got from your request</p>
            <ul className="ofs-chips">
              {FIELDS.map((field) => (
                <li key={field.label} className="ofs-chip-slot">
                  <span className="ofs-chip" data-shown="true">
                    <span className="ofs-chip-label">{field.label}</span>
                    <span className="ofs-chip-value">{field.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </article>

          <article className="ofs-card ofs-message" data-state="current" aria-label="Agent: accrual question">
            <p className="ofs-lead">I didn&apos;t see accrual. How should it work?</p>
            <div className="ofs-resolve ofs-resolve-ask">
              <div className="ofs-resolve-side ofs-options" role="group" aria-label="Accrual">
                <span className="ofs-option" data-kind="pick" data-selected="true">
                  Monthly
                </span>
                <span className="ofs-option" data-kind="pick" data-selected="false">
                  All at once
                </span>
                <span className="ofs-option" data-kind="skip" data-selected="false">
                  Skip
                </span>
              </div>
            </div>
          </article>

          <article className="ofs-bubble ofs-message" data-state="current" aria-label="Your answer">
            <p className="ofs-request">Monthly</p>
          </article>

          <article className="ofs-card ofs-message" data-state="current" aria-label="Agent: ready">
            <p className="ofs-lead">Got it.</p>
            <div className="ofs-chip ofs-chip-static" data-shown="true">
              <span className="ofs-chip-label">Accrual</span>
              <span className="ofs-chip-value">Monthly</span>
            </div>
          </article>

          <article className="eol-card" aria-label="Sales PTO Policy">
            <header className="eol-head">
              <h3 className="eol-title">Sales PTO Policy</h3>
              <p className="eol-count">1 line changed, 3 unchanged</p>
            </header>
            <div className="eol-lines">
              <p className="eol-line">
                This policy covers <span className="eol-token">PTO</span>.
              </p>
              <p className="eol-line">
                It applies to the <span className="eol-token">Sales</span> teams.
              </p>
              <p className="eol-line">
                Each employee gets{" "}
                <span className="eol-token eol-token-limit">
                  <span className="eol-step" aria-hidden="true">
                    <StepIcon plus={false} />
                  </span>
                  <span className="eol-token-values">
                    <span className="eol-new">16 days</span>
                  </span>
                  <span className="eol-step" aria-hidden="true">
                    <StepIcon plus />
                  </span>
                </span>{" "}
                of PTO per year.
              </p>
              <p className="eol-line">
                Days are earned <span className="eol-token">Monthly</span>.
              </p>
            </div>
            <div className="eol-foot">
              <div className="eol-actions">
                <span className="eol-quiet">Undo</span>
                <span className="eol-quiet">Keep change</span>
              </div>
              <span className="eol-preview" data-ready="true">
                Preview
              </span>
            </div>
          </article>

          <div className="ntp-composer" aria-label="Message">
            <p className="ntp-composer-hint">Ask about this policy</p>
            <div className="ntp-composer-bar">
              <span className="ntp-composer-plus" aria-hidden="true">
                <svg viewBox="0 0 16 16" className="ntp-composer-icon">
                  <path d="M8 3.5v9M3.5 8h9" />
                </svg>
              </span>
              <span className="ntp-composer-send" aria-hidden="true">
                <svg viewBox="0 0 16 16" className="ntp-composer-icon">
                  <path d="M8 12.5V3.8M8 3.8 4.6 7.2M8 3.8l3.4 3.4" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepIcon({ plus }: { plus: boolean }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="eol-step-icon">
      <path d="M4 8h8" />
      {plus ? <path d="M8 4v8" /> : null}
    </svg>
  );
}
