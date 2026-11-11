"use client";

import { useEffect, useRef, useState } from "react";
import "./type-what-you-have.css";

/**
 * Introducing the agent.
 *
 * Like a short stack of screens. The one in front slides up, and the
 * next screen comes up into the same frame. The frame never changes
 * size. Only the screen inside it changes.
 *
 * 1. A box types the request, Send is pressed, and that box moves up.
 * 2. A thinking screen takes its place, then moves up too.
 * 3. The rule the agent wrote stays in front.
 *
 * Replay runs the stack again. Reduced motion skips to the rule.
 */

const REQUEST =
  "I need to create a PTO rule for sales department, the yearly limit is 14 days.";

/** How fast each letter appears. Raise it to type more slowly. */
const CHAR_MS = 28;
/** How long Send stays pressed before the box moves up. */
const SEND_HOLD_MS = 220;
/** How long the thinking screen stays before it moves up. */
const THINK_MS = 1200;

const NOTE = [
  { text: "I need to create a " },
  { text: "PTO", source: "type" },
  { text: " rule for " },
  { text: "sales department", source: "department" },
  { text: ", the yearly limit is " },
  { text: "14 days", source: "limit" },
  { text: "." },
] as const;

const ROWS = [
  { source: "department", label: "Department", value: "Sales department" },
  { source: "type", label: "Type", value: "PTO" },
  { source: "limit", label: "Yearly limit", value: "14 days" },
] as const;

const STEPS = ["Reading the request", "Finding the fields", "Writing the rule"] as const;

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
      timers.push(window.setTimeout(() => setPhase("sending"), 180));
      timers.push(window.setTimeout(() => setPhase("thinking"), 180 + SEND_HOLD_MS));
      timers.push(
        window.setTimeout(() => setPhase("document"), 180 + SEND_HOLD_MS + THINK_MS),
      );
    }, CHAR_MS);

    return () => {
      window.clearInterval(typer);
      timers.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [seen, run]);

  const status =
    phase === "thinking"
      ? "Thinking"
      : phase === "document"
        ? "Rule created. Sales department, PTO, yearly limit 14 days. Accrual missing."
        : phase === "sending"
          ? "Sending the request"
          : "";

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
        <ChatCard typed={typed} phase={phase} />
        <ThinkingCard />
        <RuleCard phase={phase} source={source} onSource={setSource} />
      </div>

      <p className="toc-sr" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

function ChatCard({ typed, phase }: { typed: string; phase: Phase }) {
  const isFront = phase === "typing" || phase === "sending";

  return (
    <article className="toc-card toc-card-chat" aria-hidden={!isFront}>
      <div className="toc-chat">
        <p className="toc-typed">
          {typed}
          {phase === "typing" ? <span className="toc-caret" aria-hidden="true" /> : null}
        </p>
        <button
          type="button"
          className="toc-send"
          tabIndex={isFront ? 0 : -1}
          aria-pressed={phase === "sending"}
        >
          Send
        </button>
      </div>
    </article>
  );
}

function ThinkingCard() {
  return (
    <article className="toc-card toc-card-think" aria-hidden="true">
      <ol className="toc-steps">
        {STEPS.map((step) => (
          <li key={step} className="toc-step">
            {step}
          </li>
        ))}
      </ol>
    </article>
  );
}

function RuleCard({
  phase,
  source,
  onSource,
}: {
  phase: Phase;
  source: SourceId | null;
  onSource: (source: SourceId | null) => void;
}) {
  return (
    <article className="toc-card toc-card-doc" aria-hidden={phase !== "document"}>
      <span className="toc-label">Sample</span>
      <p className="toc-note">
        {NOTE.map((part, index) =>
          "source" in part ? (
            <span key={part.source} className="toc-word" data-source={part.source}>
              {part.text}
            </span>
          ) : (
            <span key={index}>{part.text}</span>
          ),
        )}
      </p>
      <div className="toc-rows">
        {ROWS.map((row) => (
          <button
            key={row.source}
            type="button"
            className="toc-row"
            data-source={row.source}
            aria-pressed={source === row.source}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") onSource(row.source);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType !== "mouse") return;
              if (event.currentTarget.matches(":focus-visible")) return;
              onSource(null);
            }}
            onFocus={(event) => {
              if (event.currentTarget.matches(":focus-visible")) onSource(row.source);
            }}
            onBlur={() => onSource(null)}
            onClick={(event) => {
              if (event.pointerType === "mouse") return;
              onSource(source === row.source ? null : row.source);
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
  );
}
