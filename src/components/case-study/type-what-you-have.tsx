"use client";

import { useEffect, useRef, useState } from "react";
import "./type-what-you-have.css";

/**
 * Introducing the agent.
 *
 * The frame around this is the case study. Inside, the product types
 * one request, pauses to think, then shows the rule it wrote.
 * Replay runs that again. Reduced motion stays on the finished rule.
 */

const REQUEST =
  "I need to create a PTO rule for sales department, the yearly limit is 14 days.";

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

const CHAR_MS = 32;
const THINK_MS = 900;

type Phase = "idle" | "typing" | "thinking" | "rule";
type SourceId = (typeof ROWS)[number]["source"];

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TypeWhatYouHaveVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");
  const [source, setSource] = useState<SourceId | null>(null);

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
      setPhase("rule");
      setTyped(REQUEST);
      return;
    }

    setSource(null);
    setPhase("typing");
    setTyped("");
    let index = 0;
    let thinkTimer = 0;
    const typer = window.setInterval(() => {
      index += 1;
      setTyped(REQUEST.slice(0, index));
      if (index >= REQUEST.length) {
        window.clearInterval(typer);
        setPhase("thinking");
        thinkTimer = window.setTimeout(() => setPhase("rule"), THINK_MS);
      }
    }, CHAR_MS);

    return () => {
      window.clearInterval(typer);
      window.clearTimeout(thinkTimer);
    };
  }, [seen, run]);

  const status =
    phase === "thinking"
      ? "Thinking"
      : phase === "rule"
        ? "Rule created. Sales department, PTO, yearly limit 14 days. Accrual missing."
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
        <span className="toc-label">Sample</span>
        <button type="button" className="toc-replay" onClick={() => setRun((value) => value + 1)}>
          Replay
        </button>
      </div>

      <div className="toc-still">
        <RuleBody source={source} onSource={setSource} />
      </div>

      <div className="toc-motion">
        {phase === "rule" ? (
          <RuleBody appear source={source} onSource={setSource} />
        ) : (
          <div className="toc-composer">
            <p className="toc-typed">
              {typed}
              {phase === "typing" || phase === "thinking" ? (
                <span className="toc-caret" aria-hidden="true" />
              ) : null}
            </p>
            {phase === "thinking" ? <p className="toc-thinking">Thinking</p> : null}
          </div>
        )}
        <p className="toc-sr" aria-live="polite">
          {status}
        </p>
      </div>
    </div>
  );
}

function RuleBody({
  appear = false,
  source,
  onSource,
}: {
  appear?: boolean;
  source: SourceId | null;
  onSource: (source: SourceId | null) => void;
}) {
  return (
    <div className={appear ? "toc-rule toc-rule-appear" : "toc-rule"}>
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
      <div className="toc-actions">
        <button type="button" className="toc-confirm">
          Confirm
        </button>
      </div>
    </div>
  );
}
