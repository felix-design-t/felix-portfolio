"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./type-what-you-have.css";
import "./edit-one-line.css";
import { TOC_HOLD_MS, TOC_PAUSE_MS, TOC_PHASE_GAP_MS, TOC_PRESS_HOLD_MS } from "./toc-motion";

/**
 * Review and control.
 *
 * This is the second trust visual. It opens where "Only what you said"
 * ends: Generate policy was just pressed. The draft is one card of four
 * sentences, and each field sits inside its sentence as a chip, the same
 * idea as a component instance dropped into a line of type.
 *
 * Changing the yearly limit is like editing one instance. Only that
 * sentence shows the diff. Undo steps back. Keep change confirms it,
 * and only then does Preview policy become the solid button.
 * Nothing here publishes. The sequence plays once.
 *
 * The numbers below are the feel knobs.
 */

/** Pause on the fresh draft before the edit. */
const BEFORE_EDIT_MS = TOC_PHASE_GAP_MS;
/** How long the diff sits before Keep change is pressed. */
const BEFORE_KEEP_MS = TOC_PAUSE_MS;
/** How long the Keep change press lasts. */
const PRESS_MS = TOC_PRESS_HOLD_MS;
/** How long the confirmed policy is held. Nothing restarts after this. */
const HOLD_MS = TOC_HOLD_MS;

const BASE_LIMIT = 14;
const EDITED_LIMIT = 13;
const MIN_LIMIT = 8;
const MAX_LIMIT = 20;
const LINE_COUNT = 4;

type LineId = "type" | "department" | "limit" | "accrual";

/** The sentence is split so the chip can sit in the middle of it. */
const LINES: { id: LineId; before: string; value: string; after: string }[] = [
  { id: "type", before: "This policy covers", value: "PTO", after: "." },
  { id: "department", before: "It applies to the", value: "Sales", after: "department." },
  { id: "limit", before: "Each employee gets", value: "", after: "of PTO per year." },
  { id: "accrual", before: "Days are earned", value: "Monthly", after: "." },
];

type Mark = { limit: number; kept: boolean };

type Policy = {
  /** What the sentence shows now. */
  limit: number;
  /** The last value the admin confirmed. The diff strikes this. */
  confirmed: number;
  /** True after Keep change, until a newer edit moves off that value. */
  kept: boolean;
  /** Earlier limits, newest last, so Undo can step back. */
  history: Mark[];
};

const FRESH: Policy = {
  limit: BASE_LIMIT,
  confirmed: BASE_LIMIT,
  kept: false,
  history: [],
};

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function limitLabel(days: number): string {
  return `${days} days`;
}

export function EditOneLineVisual() {
  const rootRef = useRef<HTMLDivElement>(null);

  const [seen, setSeen] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [policy, setPolicy] = useState<Policy>(FRESH);
  /** Bumps so the tint flash on the edited line restarts. */
  const [flashKey, setFlashKey] = useState(0);
  const [keepPressed, setKeepPressed] = useState(false);

  const { limit, confirmed, kept, history } = policy;
  const pending = limit !== confirmed;
  const changedLines = limit === BASE_LIMIT ? 0 : 1;
  const previewSolid = kept && !pending;
  const showCount = changedLines > 0 || pending;

  const flash = () => setFlashKey((key) => key + 1);

  const edit = useCallback((next: number) => {
    const clamped = Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, next));
    setPolicy((current) => {
      if (clamped === current.limit) return current;
      return {
        limit: clamped,
        confirmed: current.confirmed,
        kept: clamped === current.confirmed ? current.kept : false,
        history: [...current.history, { limit: current.limit, kept: current.kept }],
      };
    });
    flash();
  }, []);

  const undo = useCallback(() => {
    setPolicy((current) => {
      if (current.history.length === 0) return current;
      const previous = current.history[current.history.length - 1];
      return {
        limit: previous.limit,
        confirmed: current.confirmed,
        kept: previous.kept,
        history: current.history.slice(0, -1),
      };
    });
    flash();
  }, []);

  const keep = useCallback(() => {
    setPolicy((current) => ({
      ...current,
      confirmed: current.limit,
      kept: true,
    }));
  }, []);

  const showEnd = useCallback(() => {
    setPolicy({
      limit: EDITED_LIMIT,
      confirmed: EDITED_LIMIT,
      kept: true,
      history: [{ limit: BASE_LIMIT, kept: false }],
    });
  }, []);

  useEffect(() => {
    if (!prefersReducedMotion()) return;
    const id = window.setTimeout(() => {
      setAutoplay(false);
      showEnd();
    }, 0);
    return () => window.clearTimeout(id);
  }, [showEnd]);

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
    if (!seen || !autoplay || prefersReducedMotion()) return;

    const timers: number[] = [];
    const at = (ms: number, work: () => void) => {
      timers.push(window.setTimeout(work, ms));
    };

    let time = BEFORE_EDIT_MS;
    at(time, () => edit(EDITED_LIMIT));
    time += BEFORE_KEEP_MS;
    at(time, () => setKeepPressed(true));
    time += PRESS_MS;
    at(time, () => {
      setKeepPressed(false);
      keep();
    });
    time += HOLD_MS;
    at(time, () => setAutoplay(false));

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [seen, autoplay, edit, keep]);

  /** A tap means the person is driving, so the scripted presses stop. */
  const takeOver = () => setAutoplay(false);

  const nudge = (step: number) => {
    takeOver();
    edit(limit + step);
  };

  const onUndo = () => {
    takeOver();
    setKeepPressed(false);
    undo();
  };

  const onKeep = () => {
    takeOver();
    setKeepPressed(false);
    keep();
  };

  const changedWord = changedLines === 1 ? "1 line changed" : `${changedLines} lines changed`;
  const unchanged = LINE_COUNT - changedLines;
  const unchangedWord = unchanged === 1 ? "1 unchanged" : `${unchanged} unchanged`;
  const countLabel = `${changedWord}, ${unchangedWord}`;

  const status = previewSolid
    ? `Sales PTO policy kept. Yearly limit ${limit} days. ${countLabel}. Preview policy is available.`
    : pending
      ? `Yearly limit changed from ${confirmed} to ${limit} days. ${countLabel}. Keep the change or undo it. Preview policy is waiting.`
      : "Sales PTO policy draft. PTO, Sales department, 14 days a year, earned monthly.";

  return (
    <div ref={rootRef} className="toc-product eol-product" data-visual="edit-one-line">
      <div className="eol-stage">
        <article className="eol-card" aria-label="Sales PTO policy">
          <header className="eol-head">
            <h3 className="eol-title">Sales PTO policy</h3>
            <div className="eol-actions" data-shown={showCount ? "true" : "false"} aria-hidden={showCount ? undefined : true}>
              <p className="eol-count">{countLabel}</p>
              <button
                type="button"
                className="eol-quiet"
                aria-label="Undo the last change"
                disabled={history.length === 0}
                onClick={onUndo}
              >
                Undo
              </button>
              {pending ? (
                <button
                  type="button"
                  className="eol-quiet"
                  data-pressed={keepPressed ? "true" : "false"}
                  onClick={onKeep}
                >
                  Keep change
                </button>
              ) : null}
            </div>
          </header>

          <div className="eol-lines">
            {LINES.map((line) => {
              const isLimit = line.id === "limit";
              const isPendingLine = isLimit && pending;
              return (
                <p
                  key={isLimit ? `limit-${flashKey}` : line.id}
                  className="eol-line"
                  data-changed={isLimit && changedLines > 0 ? "true" : "false"}
                  data-pending={isPendingLine ? "true" : "false"}
                  data-dim={pending && !isLimit ? "true" : "false"}
                  data-flash={isLimit && flashKey > 0 ? "true" : "false"}
                >
                  {`${line.before} `}
                  {isLimit ? (
                    <LimitToken
                      limit={limit}
                      confirmed={confirmed}
                      pending={pending}
                      onNudge={nudge}
                    />
                  ) : (
                    <span className="eol-token">{line.value}</span>
                  )}
                  {line.after === "." ? "." : ` ${line.after}`}
                </p>
              );
            })}
          </div>

          <div className="eol-foot">
            <button
              type="button"
              className="eol-preview"
              data-ready={previewSolid ? "true" : "false"}
              aria-disabled={!previewSolid}
              tabIndex={previewSolid ? 0 : -1}
            >
              Preview policy
            </button>
          </div>
        </article>
      </div>

      <p className="toc-sr" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

function LimitToken({
  limit,
  confirmed,
  pending,
  onNudge,
}: {
  limit: number;
  confirmed: number;
  pending: boolean;
  onNudge: (step: number) => void;
}) {
  return (
    <span className="eol-token eol-token-limit" data-pending={pending ? "true" : "false"}>
      <button
        type="button"
        className="eol-step"
        aria-label="Decrease yearly limit by one day"
        disabled={limit <= MIN_LIMIT}
        onClick={() => onNudge(-1)}
      >
        <StepIcon plus={false} />
      </button>
      <span className="eol-token-values">
        {pending ? <s className="eol-old">{limitLabel(confirmed)}</s> : null}
        <span className="eol-new">{limitLabel(limit)}</span>
      </span>
      <button
        type="button"
        className="eol-step"
        aria-label="Increase yearly limit by one day"
        disabled={limit >= MAX_LIMIT}
        onClick={() => onNudge(1)}
      >
        <StepIcon plus />
      </button>
    </span>
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
