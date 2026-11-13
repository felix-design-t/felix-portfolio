"use client";

import { useEffect, useRef, useState } from "react";
import "./type-what-you-have.css";
import "./only-what-you-said.css";
import "./edit-one-line.css";
import "./note-to-policy.css";
import {
  TOC_BEAT_MS,
  TOC_CHAR_MS,
  TOC_HOLD_MS,
  TOC_PAUSE_MS,
  TOC_PRESS_HOLD_MS,
  TOC_STEP_MS,
} from "./toc-motion";

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

const NOTE = "I need to create a PTO policy for sales teams, the yearly limit is 14 days.";
const ANSWER = "Monthly";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function NoteToPolicyVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(0);
  const [snap, setSnap] = useState(false);
  const [typed, setTyped] = useState("");
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const frame = root.closest(".case-study-frame");
    const figure = root.closest("figure");
    const placeholder = figure?.nextElementSibling?.querySelector(".case-study-frame");
    const decision = document
      .querySelector("[data-visual='maya-scenario']")
      ?.closest(".case-study-frame");
    if (!(frame instanceof HTMLElement) || !(decision instanceof HTMLElement)) return;

    // Both solution frames stay the same size as the Decisions screen.
    const match = () => {
      const height = `${decision.offsetHeight}px`;
      frame.style.height = height;
      frame.style.overflowAnchor = "none";
      if (placeholder instanceof HTMLElement) {
        placeholder.style.height = height;
        placeholder.style.aspectRatio = "auto";
        placeholder.style.overflowAnchor = "none";
      }
    };
    match();
    const observer = new ResizeObserver(match);
    observer.observe(decision);
    return () => {
      observer.disconnect();
      frame.style.height = "";
      frame.style.overflowAnchor = "";
      if (placeholder instanceof HTMLElement) {
        placeholder.style.height = "";
        placeholder.style.aspectRatio = "";
        placeholder.style.overflowAnchor = "";
      }
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setSeen(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return;
    if (prefersReducedMotion()) {
      setStep(6);
      setTyped("");
      setPressed(false);
      return;
    }
    setSnap(true);
    setStep(0);
    setTyped("");
    setPressed(false);
    const release = window.requestAnimationFrame(() => setSnap(false));
    const timers: number[] = [];
    const at = (ms: number, work: () => void) => {
      timers.push(window.setTimeout(work, ms));
    };
    // Type a black-bubble line in the chat box, press send, then show the bubble.
    const typeThenSend = (text: string, revealStep: number, start: number) => {
      at(start, () => setTyped(""));
      for (let index = 1; index <= text.length; index += 1) {
        const count = index;
        at(start + count * TOC_CHAR_MS, () => setTyped(text.slice(0, count)));
      }
      const sendAt = start + text.length * TOC_CHAR_MS + TOC_BEAT_MS;
      at(sendAt, () => setPressed(true));
      at(sendAt + TOC_PRESS_HOLD_MS, () => {
        setPressed(false);
        setTyped("");
        setStep(revealStep);
      });
      return sendAt + TOC_PRESS_HOLD_MS;
    };

    let time = TOC_BEAT_MS;
    time = typeThenSend(NOTE, 1, time);
    time += TOC_STEP_MS;
    at(time, () => setStep(2));
    time += TOC_STEP_MS;
    at(time, () => setStep(3));
    time += TOC_PAUSE_MS;
    time = typeThenSend(ANSWER, 4, time);
    time += TOC_STEP_MS;
    at(time, () => setStep(5));
    time += TOC_STEP_MS;
    at(time, () => setStep(6));
    time += TOC_HOLD_MS;
    at(time, () => setRun((value) => value + 1));
    return () => {
      window.cancelAnimationFrame(release);
      timers.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [seen, run]);

  return (
    <div
      ref={rootRef}
      className="toc-product ntp-product ofs-product"
      data-visual="note-to-policy"
      data-fit="row"
      data-snap={snap ? "true" : undefined}
    >
      <div className="ntp-window">
        <div className="ntp-thread">
          <div className="ntp-feed">
          <article className="ofs-bubble ofs-message" data-state={step > 0 ? "current" : "hidden"} aria-label="Your request">
            <p className="ofs-request">
              I need to create a <span className="ofs-phrase">PTO</span> policy for{" "}
              <span className="ofs-phrase">sales</span> teams, the{" "}
              <span className="ofs-phrase">yearly</span> limit is{" "}
              <span className="ofs-phrase">14 days</span>.
            </p>
          </article>

          <article className="ofs-card ofs-message" data-state={step > 1 ? "current" : "hidden"} aria-label="Agent: what I got">
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

          <article className="ofs-card ofs-message" data-state={step > 2 ? "current" : "hidden"} aria-label="Agent: accrual question">
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

          <article className="ofs-bubble ofs-message" data-state={step > 3 ? "current" : "hidden"} aria-label="Your answer">
            <p className="ofs-request">Monthly</p>
          </article>

          <article className="ofs-card ofs-message" data-state={step > 4 ? "current" : "hidden"} aria-label="Agent: ready">
            <p className="ofs-lead">Got it.</p>
            <div className="ofs-chip ofs-chip-static" data-shown="true">
              <span className="ofs-chip-label">Accrual</span>
              <span className="ofs-chip-value">Monthly</span>
            </div>
          </article>

          <article className="eol-card" data-state={step > 5 ? "current" : "hidden"} aria-label="Sales PTO Policy">
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
          </div>

          <div className="ntp-composer" aria-label="Message">
            <p className="ntp-composer-hint" data-typing={typed ? "true" : "false"}>
              {typed || "Ask about this policy"}
              {typed && !pressed ? <span className="ntp-caret" aria-hidden="true" /> : null}
            </p>
            <div className="ntp-composer-bar">
              <span className="ntp-composer-plus" aria-hidden="true">
                <svg viewBox="0 0 16 16" className="ntp-composer-icon">
                  <path d="M8 3.5v9M3.5 8h9" />
                </svg>
              </span>
              <span
                className="ntp-composer-send"
                data-ready={typed ? "true" : "false"}
                data-pressed={pressed ? "true" : "false"}
                aria-hidden="true"
              >
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
