"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./type-what-you-have.css";
import "./edit-one-line.css";
import { TOC_PAUSE_MS, TOC_PHASE_GAP_MS, TOC_PRESS_HOLD_MS, TOC_STEP_MS } from "./toc-motion";

/**
 * Review and control.
 *
 * This is the second trust visual. It opens where "Only what you said"
 * ends: Generate policy was just pressed. The draft is one card of four
 * sentences, and each field sits inside its sentence as a chip, the same
 * idea as a component instance dropped into a line of type.
 *
 * Changing the yearly limit is like editing one instance. Only that
 * sentence shows the diff. Undo returns the limit to 14 days.
 * Keep change confirms it,
 * and only then does Preview become the solid button.
 * Nothing here publishes. The field starts at 14 days. Once, on its
 * own: minus twice to 12, Undo back to 14, plus twice to 16, then
 * Keep change. It stops there.
 */

/** How long the opening 14 days is shown before the first press. */
const INTRO_MS = TOC_PHASE_GAP_MS;
/** How long a scripted press stays down. */
const PRESS_MS = TOC_PRESS_HOLD_MS;
/** Pause between two presses of the same stepper. */
const BETWEEN_PRESSES_MS = TOC_STEP_MS;
/** Pause on 12, and again on 16, before the next button. */
const READ_MS = TOC_PAUSE_MS;

type Pressed = "minus" | "plus" | "undo" | "keep";

const BASE_LIMIT = 14;
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

type Policy = {
  /** What the sentence shows now. */
  limit: number;
  /** The last value the admin confirmed. The diff strikes this. */
  confirmed: number;
  /** True after Keep change, until a newer edit moves off that value. */
  kept: boolean;
};

const FRESH: Policy = {
  limit: BASE_LIMIT,
  confirmed: BASE_LIMIT,
  kept: false,
};

function limitLabel(days: number): string {
  return `${days} days`;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function EditOneLineVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  /** The scripted presses run once. A second visit does not replay them. */
  const playedRef = useRef(false);

  const [policy, setPolicy] = useState<Policy>(FRESH);
  const [seen, setSeen] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [pressed, setPressed] = useState<Pressed | null>(null);

  const { limit, confirmed, kept } = policy;
  const pending = limit !== confirmed;
  const changedLines = limit === BASE_LIMIT ? 0 : 1;
  const previewSolid = kept && !pending;
  /** The count only names a real edit. The default 14 days stays quiet. */
  const showCount = changedLines > 0;
  /** Undo and Keep change appear together once the draft is no longer the default. */
  const showActions = pending || changedLines > 0;

  const edit = useCallback((next: number) => {
    const clamped = Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, next));
    setPolicy((current) => {
      if (clamped === current.limit) return current;
      return {
        limit: clamped,
        confirmed: current.confirmed,
        kept: clamped === current.confirmed ? current.kept : false,
      };
    });
  }, []);

  const undo = useCallback(() => {
    setPolicy(FRESH);
  }, []);

  const keep = useCallback(() => {
    setPolicy((current) => ({
      ...current,
      confirmed: current.limit,
      kept: true,
    }));
  }, []);

  const showKept = useCallback(() => {
    setPolicy({ limit: 16, confirmed: 16, kept: true });
  }, []);

  useEffect(() => {
    if (!prefersReducedMotion()) return;
    const id = window.setTimeout(() => {
      playedRef.current = true;
      setAutoplay(false);
      showKept();
    }, 0);
    return () => window.clearTimeout(id);
  }, [showKept]);

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
    if (!seen || !autoplay || playedRef.current || prefersReducedMotion()) return;

    const timers: number[] = [];
    const at = (ms: number, work: () => void) => {
      timers.push(window.setTimeout(work, ms));
    };
    let finished = false;

    const tap = (control: Pressed, work: () => void, start: number) => {
      at(start, () => setPressed(control));
      at(start + PRESS_MS, () => {
        setPressed(null);
        work();
      });
      return start + PRESS_MS;
    };

    let time = INTRO_MS;
    time = tap("minus", () => edit(13), time);
    time += BETWEEN_PRESSES_MS;
    time = tap("minus", () => edit(12), time);
    time += READ_MS;
    time = tap("undo", undo, time);
    time += BETWEEN_PRESSES_MS;
    time = tap("plus", () => edit(15), time);
    time += BETWEEN_PRESSES_MS;
    time = tap("plus", () => edit(16), time);
    time += READ_MS;
    tap("keep", () => {
      finished = true;
      playedRef.current = true;
      keep();
      setAutoplay(false);
    }, time);

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      if (!finished) playedRef.current = false;
    };
  }, [seen, autoplay, edit, undo, keep]);

  /** A real tap takes over, so the scripted presses stop. */
  const takeOver = () => setAutoplay(false);

  const nudge = (step: number) => {
    takeOver();
    edit(limit + step);
  };

  const onUndo = () => {
    takeOver();
    setPressed(null);
    undo();
  };

  const onKeep = () => {
    takeOver();
    setPressed(null);
    keep();
  };

  const changedWord = changedLines === 1 ? "1 line changed" : `${changedLines} lines changed`;
  const unchanged = LINE_COUNT - changedLines;
  const unchangedWord = unchanged === 1 ? "1 unchanged" : `${unchanged} unchanged`;
  const countLabel = `${changedWord}, ${unchangedWord}`;

  const status = previewSolid
    ? `Sales PTO policy kept. Yearly limit ${limit} days. ${countLabel}. Preview is available.`
    : pending
      ? `Yearly limit changed from ${confirmed} to ${limit} days. ${countLabel}. Keep the change or undo it. Preview is waiting.`
      : "Sales PTO policy draft. PTO, Sales department, 14 days a year, earned monthly.";

  return (
    <div ref={rootRef} className="toc-product eol-product" data-visual="edit-one-line">
      <div className="eol-stage">
        <article className="eol-card" aria-label="Sales PTO Policy">
          <header className="eol-head">
            <h3 className="eol-title">Sales PTO Policy</h3>
            <p className="eol-count" data-shown={showCount ? "true" : "false"} aria-hidden={showCount ? undefined : true}>
              {showCount ? countLabel : "1 line changed, 3 unchanged"}
            </p>
          </header>

          <div className="eol-lines">
            {LINES.map((line) => {
              const isLimit = line.id === "limit";
              const isPendingLine = isLimit && pending;
              return (
                <p
                  key={line.id}
                  className="eol-line"
                  data-pending={isPendingLine ? "true" : "false"}
                  data-dim={pending && !isLimit ? "true" : "false"}
                >
                  {`${line.before} `}
                  {isLimit ? (
                    <LimitToken
                      limit={limit}
                      confirmed={confirmed}
                      pending={pending}
                      pressed={pressed}
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
            <div className="eol-actions" data-shown={showActions ? "true" : "false"} aria-hidden={showActions ? undefined : true}>
              <button
                type="button"
                className="eol-quiet"
                aria-label="Return the yearly limit to 14 days"
                data-pressed={pressed === "undo" ? "true" : "false"}
                disabled={!showActions}
                tabIndex={showActions ? 0 : -1}
                onClick={onUndo}
              >
                Undo
              </button>
              <button
                type="button"
                className="eol-quiet"
                data-pressed={pressed === "keep" ? "true" : "false"}
                tabIndex={showActions && pending ? 0 : -1}
                onClick={onKeep}
              >
                Keep change
              </button>
            </div>
            <button
              type="button"
              className="eol-preview"
              data-ready={previewSolid ? "true" : "false"}
              aria-disabled={!previewSolid}
              tabIndex={previewSolid ? 0 : -1}
            >
              Preview
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
  pressed,
  onNudge,
}: {
  limit: number;
  confirmed: number;
  pending: boolean;
  pressed: Pressed | null;
  onNudge: (step: number) => void;
}) {
  return (
    <span className="eol-token eol-token-limit" data-pending={pending ? "true" : "false"}>
      <button
        type="button"
        className="eol-step"
        aria-label="Decrease yearly limit by one day"
        data-pressed={pressed === "minus" ? "true" : "false"}
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
        data-pressed={pressed === "plus" ? "true" : "false"}
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
