"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "./type-what-you-have.css";
import "./edit-one-line.css";

/**
 * Edit one line.
 *
 * Step two of the trust story, and it picks up where "Only what you
 * said" stops: Generate was just pressed. Think of the left panel as a
 * form and the right panel as a printout of it. Each printed line is
 * "wired" to one field, so changing a field rewrites only its own
 * line. A one-line change log with Undo keeps the admin in control.
 * The story stops before Publish.
 *
 * Every time below is a "feel" knob. Change a number, the loop changes.
 */

/** Pause before Generate is pressed. */
const BEFORE_PRESS_MS = 1200;
/** How long the Generate press (scale to 0.98) lasts. */
const PRESS_MS = 300;
/** Time between one policy line writing in and the next. */
const LINE_STEP_MS = 700;
/** Pause after the last line before the first edit. */
const BEFORE_EDIT_MS = 1200;
/** How long the edited state is shown before Undo is pressed. */
const BEFORE_UNDO_MS = 2200;
/** How long the Undo press lasts. */
const UNDO_PRESS_MS = 300;
/** Pause after Undo before the admin edits again. */
const BEFORE_REEDIT_MS = 1800;
/** How long the final, edited policy is held. */
const LOOP_HOLD_MS = 2000;
/** How long the changed chip stays highlighted. */
const CHIP_HIGHLIGHT_MS = 1600;

const BASE_LIMIT = 14;
const EDITED_LIMIT = 12;
const MIN_LIMIT = 8;
const MAX_LIMIT = 20;

type FieldKey = "type" | "department" | "limit" | "accrual";

const FIELDS: { key: FieldKey; label: string; value: string }[] = [
  { key: "type", label: "Type", value: "PTO" },
  { key: "department", label: "Department", value: "Sales" },
  { key: "limit", label: "Yearly limit", value: "" },
  { key: "accrual", label: "Accrual", value: "Monthly" },
];

/** One plain sentence per field. The pill names the chip it came from. */
function policyLines(limit: number): { field: FieldKey; text: string }[] {
  return [
    { field: "type", text: "This policy covers PTO." },
    { field: "department", text: "It applies to the Sales department." },
    { field: "limit", text: `Each employee gets ${limit} days of PTO per year.` },
    { field: "accrual", text: "Days are earned monthly." },
  ];
}

type Edits = { limit: number; history: number[] };

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function EditOneLineVisual() {
  const rootRef = useRef<HTMLDivElement>(null);

  const [seen, setSeen] = useState(false);
  const [run, setRun] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const [generatePressed, setGeneratePressed] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [linesShown, setLinesShown] = useState(0);
  const [edits, setEdits] = useState<Edits>({ limit: BASE_LIMIT, history: [] });
  /** Restarts the tint flash on the rewritten line each time it changes. */
  const [flashKey, setFlashKey] = useState(0);
  const [chipLit, setChipLit] = useState(false);
  const [undoPressed, setUndoPressed] = useState(false);
  const [hoverField, setHoverField] = useState<FieldKey | null>(null);

  const chipTimer = useRef<number | null>(null);

  const { limit } = edits;
  const changed = limit !== BASE_LIMIT;
  const log = changed ? `Yearly limit ${BASE_LIMIT} to ${limit}, 1 line changed` : "";

  const lightChip = useCallback(() => {
    setChipLit(true);
    if (chipTimer.current) window.clearTimeout(chipTimer.current);
    chipTimer.current = window.setTimeout(() => setChipLit(false), CHIP_HIGHLIGHT_MS);
  }, []);

  const edit = useCallback(
    (next: number) => {
      setEdits((current) =>
        next === current.limit
          ? current
          : { limit: next, history: [...current.history, current.limit] },
      );
      setFlashKey((key) => key + 1);
      lightChip();
    },
    [lightChip],
  );

  const undo = useCallback(() => {
    setEdits((current) => {
      if (current.history.length === 0) return current;
      const previous = current.history[current.history.length - 1];
      return { limit: previous, history: current.history.slice(0, -1) };
    });
    setFlashKey((key) => key + 1);
    lightChip();
  }, [lightChip]);

  const showEnd = useCallback(() => {
    setGenerated(true);
    setLinesShown(4);
    setEdits({ limit: EDITED_LIMIT, history: [BASE_LIMIT] });
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

  useEffect(
    () => () => {
      if (chipTimer.current) window.clearTimeout(chipTimer.current);
    },
    [],
  );

  useEffect(() => {
    if (!seen || !autoplay || prefersReducedMotion()) return;

    const timers: number[] = [];
    const at = (ms: number, work: () => void) => {
      timers.push(window.setTimeout(work, ms));
    };

    at(0, () => {
      setGeneratePressed(false);
      setGenerated(false);
      setLinesShown(0);
      setEdits({ limit: BASE_LIMIT, history: [] });
      setChipLit(false);
      setUndoPressed(false);
    });

    let time = BEFORE_PRESS_MS;
    at(time, () => setGeneratePressed(true));
    time += PRESS_MS;
    at(time, () => {
      setGeneratePressed(false);
      setGenerated(true);
    });
    for (let line = 1; line <= 4; line += 1) {
      time += LINE_STEP_MS;
      at(time, () => setLinesShown(line));
    }
    time += BEFORE_EDIT_MS;
    at(time, () => edit(EDITED_LIMIT));
    time += BEFORE_UNDO_MS;
    at(time, () => setUndoPressed(true));
    time += UNDO_PRESS_MS;
    at(time, () => {
      setUndoPressed(false);
      undo();
    });
    time += BEFORE_REEDIT_MS;
    at(time, () => edit(EDITED_LIMIT));
    time += LOOP_HOLD_MS + CHIP_HIGHLIGHT_MS;
    at(time, () => setRun((value) => value + 1));

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [seen, run, autoplay, edit, undo]);

  /** The person took over: stop the loop and settle on a complete policy. */
  const takeOver = () => {
    if (!autoplay) return;
    setAutoplay(false);
    setGeneratePressed(false);
    setUndoPressed(false);
    setGenerated(true);
    setLinesShown(4);
  };

  const nudge = (step: number) => {
    takeOver();
    edit(Math.min(MAX_LIMIT, Math.max(MIN_LIMIT, limit + step)));
  };

  const onUndo = () => {
    takeOver();
    undo();
  };

  const status = !generated
    ? "Fields confirmed. Generate policy is ready."
    : changed
      ? `Sales PTO policy, four lines. Yearly limit changed from ${BASE_LIMIT} to ${limit}, one line changed. Undo is available.`
      : "Sales PTO policy, four lines: PTO, Sales department, 14 days a year, earned monthly.";

  return (
    <div ref={rootRef} className="toc-product eol-product" data-visual="edit-one-line">
      <div className="eol-stage">
        <section className="eol-panel" aria-label="Fields">
          <p className="eol-caption">Fields</p>
          <ul className="eol-chips">
            {FIELDS.map((field) => {
              const isLimit = field.key === "limit";
              const lit = isLimit && chipLit;
              return (
                <li
                  key={field.key}
                  className="eol-chip"
                  data-lit={lit || hoverField === field.key ? "true" : "false"}
                >
                  <span className="eol-chip-text">
                    <span className="eol-chip-label">{field.label}</span>
                    <span className="eol-chip-value">
                      {isLimit ? `${limit} days` : field.value}
                    </span>
                  </span>
                  {isLimit ? (
                    <span className="eol-stepper" role="group" aria-label="Yearly limit">
                      <button
                        type="button"
                        className="eol-step"
                        aria-label="Decrease yearly limit by one day"
                        disabled={limit <= MIN_LIMIT}
                        onClick={() => nudge(-1)}
                      >
                        <StepIcon plus={false} />
                      </button>
                      <button
                        type="button"
                        className="eol-step"
                        aria-label="Increase yearly limit by one day"
                        disabled={limit >= MAX_LIMIT}
                        onClick={() => nudge(1)}
                      >
                        <StepIcon plus />
                      </button>
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <div className="eol-foot">
            <button
              type="button"
              className="eol-generate"
              data-ready={generated ? "false" : "true"}
              data-pressed={generatePressed ? "true" : "false"}
              aria-disabled={generated}
              tabIndex={generated ? -1 : 0}
            >
              <span>Generate policy</span>
              <ArrowIcon />
            </button>
          </div>
        </section>

        <section className="eol-panel eol-policy" aria-label="Sales PTO policy">
          <div className="eol-head">
            <p className="eol-title">Sales PTO policy</p>
            <div className="eol-log" data-shown={changed ? "true" : "false"}>
              <p className="eol-log-text">{log}</p>
              <button
                type="button"
                className="eol-undo"
                data-pressed={undoPressed ? "true" : "false"}
                tabIndex={changed ? 0 : -1}
                aria-label="Undo the last change"
                onClick={onUndo}
              >
                Undo
              </button>
            </div>
          </div>

          <ol className="eol-lines">
            {policyLines(limit).map((line, index) => {
              const isChanged = line.field === "limit" && changed;
              const label = FIELDS.find((field) => field.key === line.field)?.label;
              return (
                <li
                  key={line.field}
                  className="eol-line"
                  data-shown={index < linesShown ? "true" : "false"}
                  onMouseEnter={() => setHoverField(line.field)}
                  onMouseLeave={() => setHoverField(null)}
                >
                  <div
                    key={line.field === "limit" ? `limit-${flashKey}` : line.field}
                    className="eol-row"
                    data-changed={isChanged ? "true" : "false"}
                    data-flash={line.field === "limit" && flashKey > 0 ? "true" : "false"}
                  >
                    <p className="eol-sentence">{line.text}</p>
                    <span className="eol-pill">{label}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      <p className="toc-sr" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="toc-send-icon">
      <path d="M8 12.5V3.5" />
      <path d="M4.5 7 8 3.5 11.5 7" />
    </svg>
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
