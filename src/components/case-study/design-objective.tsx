"use client";

import { useEffect, useRef, useState } from "react";
import "./design-objective.css";

type DesignObjectiveProps = {
  eyebrow: string;
  text: string;
  /** Exact phrases inside `text`, drawn in the accent color. */
  highlights: string[];
  accent?: "blue" | "violet" | "amber" | "cyan";
  icon?: "target" | "question";
};

/**
 * A pause in the case study.
 *
 * The eyebrow names the beat. The sentence is one step smaller than
 * the page title and runs the width of the column. It fades in once
 * it reaches the window.
 */
export function DesignObjective({
  eyebrow,
  text,
  highlights,
  accent = "blue",
  icon = "target",
}: DesignObjectiveProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className="design-objective"
      data-accent={accent}
      data-shown={shown ? "true" : "false"}
    >
      <p className="design-objective-eyebrow">
        {icon === "question" ? <QuestionIcon /> : <ObjectiveIcon />}
        {eyebrow}
      </p>
      <p className="design-objective-text">{markPhrases(text, highlights)}</p>
    </div>
  );
}

function markPhrases(text: string, highlights: string[]) {
  if (highlights.length === 0) return text;
  const pattern = new RegExp(
    `(${highlights.map(escapePhrase).join("|")})`,
    "g",
  );
  return text.split(pattern).map((part, index) =>
    highlights.includes(part) ? (
      <span key={index} className="design-objective-mark">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

function escapePhrase(phrase: string) {
  return phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** A small target. Same 16px stroke as the other icons. */
function ObjectiveIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="design-objective-icon">
      <circle cx="8" cy="8" r="5.5" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  );
}

/** A question mark, on the same 16px stroke. */
function QuestionIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="design-objective-icon">
      <path d="M6.2 6.1a1.8 1.8 0 1 1 2.9 1.4c-.6.4-1.1.8-1.1 1.6" />
      <path d="M8 11.6h.01" />
    </svg>
  );
}
