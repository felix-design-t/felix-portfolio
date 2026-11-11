"use client";

import { useEffect, useRef, useState } from "react";
import { Eclipse } from "loading-dev";
import "./type-what-you-have.css";

/**
 * Introducing the agent.
 *
 * The frame stays one size. Three arrangements play inside it:
 * 1. The person's card sits on the right. It types, Send is pressed, then it moves up.
 * 2. That card stays on the right, and the agent's shorter reply appears on the left.
 * 3. A document fills the frame. The earlier cards step back.
 *
 * Replay runs it again. Reduced motion stays on the document.
 */

const REQUEST =
  "I need to create a PTO rule for sales department, the yearly limit is 14 days.";

/** How fast each letter appears. Raise it to type more slowly. */
const CHAR_MS = 28;
/** How long Send stays pressed before the card moves up. */
const SEND_HOLD_MS = 220;
/** How long the small thinking card stays before the document arrives. */
const THINK_MS = 1500;

const ROWS = [
  { source: "department", label: "Department", value: "Sales department" },
  { source: "type", label: "Type", value: "PTO" },
  { source: "limit", label: "Yearly limit", value: "14 days" },
] as const;

const THINKING = [
  "Pulling the department and the yearly limit",
  "Sales department, 14 days",
] as const;

type Phase = "typing" | "sending" | "thinking" | "document";
type SourceId = (typeof ROWS)[number]["source"];

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TypeWhatYouHaveVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [typed, setTyped] = useState("");
  const [source, setSource] = useState<SourceId | null>(null);

  useEffect(() => {
    if (!prefersReducedMotion()) return;
    setPhase("document");
    setTyped(REQUEST);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setSeen(true);
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return;
    if (prefersReducedMotion()) {
      setPhase("document");
      setTyped(REQUEST);
      setSource(null);
      return;
    }

    setSource(null);
    setPhase("typing");
    setTyped("");
    let index = 0;
    const timers: number[] = [];
    const typer = window.setInterval(() => {
      index += 1;
      setTyped(REQUEST.slice(0, index));
      if (index < REQUEST.length) return;
      window.clearInterval(typer);
      timers.push(window.setTimeout(() => setPhase("sending"), 160));
      timers.push(window.setTimeout(() => setPhase("thinking"), 160 + SEND_HOLD_MS));
      timers.push(
        window.setTimeout(() => setPhase("document"), 160 + SEND_HOLD_MS + THINK_MS),
      );
    }, CHAR_MS);

    return () => {
      window.clearInterval(typer);
      timers.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [seen, run]);

  const status =
    phase === "thinking"
      ? "Pulling the department and the yearly limit. Sales department, 14 days."
      : phase === "document"
        ? "Rule created. Sales department, PTO, yearly limit 14 days. Accrual missing."
        : phase === "sending"
          ? "Sending the request"
          : "";

  const chatIsQuiet = phase === "document";

  return (
    <div
      ref={rootRef}
      className="toc-product"
      data-visual="type-what-you-have"
      data-phase={phase}
      data-source={source ?? undefined}
    >
      <div className="toc-top">
        <button type="button" className="toc-replay" onClick={() => setRun((value) => value + 1)}>
          Replay
        </button>
      </div>

      <div className="toc-stage">
        <div className="toc-stack" aria-hidden={chatIsQuiet}>
          <article className="toc-chat">
            <p className="toc-typed">
              {typed}
              {phase === "typing" ? <span className="toc-caret" aria-hidden="true" /> : null}
            </p>
            <div className="toc-chat-bar">
              <button
                type="button"
                className="toc-attach"
                aria-label="Attach a document"
                tabIndex={chatIsQuiet ? -1 : 0}
              >
                <AttachIcon />
              </button>
              <button
                type="button"
                className="toc-send"
                aria-label="Send"
                aria-pressed={phase === "sending"}
                tabIndex={chatIsQuiet ? -1 : 0}
              >
                <SendIcon />
              </button>
            </div>
          </article>

          <div className="toc-think-slot">
            <article className="toc-think">
              <span className="toc-think-mark" aria-hidden="true">
                <Eclipse size={24} />
              </span>
              <div className="toc-think-lines">
                {THINKING.map((line) => (
                  <p key={line} className="toc-think-line">
                    {line}
                  </p>
                ))}
              </div>
            </article>
          </div>
        </div>

        <article className="toc-doc" aria-hidden={phase !== "document"}>
          <span className="toc-label">Sample</span>
          <div className="toc-rows">
            {ROWS.map((row) => (
              <button
                key={row.source}
                type="button"
                className="toc-row"
                data-source={row.source}
                aria-pressed={source === row.source}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setSource(row.source);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType !== "mouse") return;
                  if (event.currentTarget.matches(":focus-visible")) return;
                  setSource(null);
                }}
                onFocus={(event) => {
                  if (event.currentTarget.matches(":focus-visible")) setSource(row.source);
                }}
                onBlur={() => setSource(null)}
                onClick={(event) => {
                  if (event.pointerType === "mouse") return;
                  setSource(source === row.source ? null : row.source);
                }}
              >
                <span className="toc-label">{row.label}</span>
                <span className="toc-value">{row.value}</span>
              </button>
            ))}
            <div className="toc-row toc-row-static">
              <span className="toc-label">Accrual</span>
              <span className="toc-label">Missing</span>
            </div>
          </div>
        </article>
      </div>

      <p className="toc-sr" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

function AttachIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="toc-send-icon">
      <path d="M8 3.5v9M3.5 8h9" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="toc-send-icon">
      <path d="M8 12.5V3.8M8 3.8 4.6 7.2M8 3.8l3.4 3.4" />
    </svg>
  );
}
