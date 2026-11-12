"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./type-what-you-have.css";
import "./only-what-you-said.css";

/**
 * Only what you said.
 *
 * Think of the action card as a form the agent fills in from the
 * admin's own words. Each field chip is "pinned" to the phrase it came
 * from with a thin line. A field with no phrase stays open, and the
 * agent asks about it once, quietly, instead of guessing.
 *
 * The loop: chips arrive and trace back to their words, the nudge
 * appears, an option is picked, Accrual fills in, Generate activates.
 * Reduced motion shows that last state. Every tweakable time is below.
 */

/** Pause before the first chip, so the chat reads first. */
const INTRO_MS = 900;
/** Time between one chip arriving and the next. */
const CHIP_STEP_MS = 1100;
/** Pause after the last chip before the nudge opens. */
const BEFORE_NUDGE_MS = 700;
/** Time the nudge waits before an option highlights. */
const BEFORE_PICK_MS = 1300;
/** Time between the pick, the filled chip, and Generate lighting up. */
const PICK_STEP_MS = 650;
/** How long the finished state is held. */
const LOOP_HOLD_MS = 2000;
/** Width where the four chips sit in one row. */
const ROW_MIN_WIDTH = 480;

type PhraseKey = "pto" | "sales" | "yearly" | "days";
type Choice = "monthly" | "all-at-once" | "skip";

type Field = {
  label: string;
  value: string;
  /** Phrases in the request this field was read from. Empty means open. */
  from: PhraseKey[];
};

const FIELDS: Field[] = [
  { label: "Type", value: "PTO", from: ["pto"] },
  { label: "Department", value: "Sales", from: ["sales"] },
  { label: "Yearly limit", value: "14 days", from: ["yearly", "days"] },
  { label: "Accrual", value: "", from: [] },
];
const ACCRUAL_INDEX = 3;

const CHOICES: { key: Choice; label: string; filled: string }[] = [
  { key: "monthly", label: "Monthly", filled: "Monthly" },
  { key: "all-at-once", label: "All at once", filled: "All at once" },
  { key: "skip", label: "Skip", filled: "Skipped" },
];

/** One trace per phrase: the line from a chip back to its words. */
const TRACES = FIELDS.flatMap((field, fieldIndex) =>
  field.from.map((phrase) => ({ fieldIndex, phrase })),
);

type Line = { fieldIndex: number; phrase: PhraseKey; d: string };

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function OnlyWhatYouSaidVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef(true);

  const [seen, setSeen] = useState(false);
  const [run, setRun] = useState(0);
  const [chipsShown, setChipsShown] = useState(0);
  const [autoTrace, setAutoTrace] = useState<number | null>(null);
  const [pointerTrace, setPointerTrace] = useState<number | null>(null);
  const [nudgeShown, setNudgeShown] = useState(false);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [committed, setCommitted] = useState(false);
  const [generateReady, setGenerateReady] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);

  const showEnd = useCallback(() => {
    setChipsShown(FIELDS.length);
    setAutoTrace(null);
    setNudgeShown(true);
    setChoice("monthly");
    setCommitted(true);
    setGenerateReady(true);
  }, []);

  useEffect(() => {
    if (!prefersReducedMotion()) return;
    autoplayRef.current = false;
    showEnd();
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

  /** Measure where each chip and each phrase sits, then build the lines. */
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const root = rootRef.current;
    if (!stage || !root) return;
    const origin = stage.getBoundingClientRect();
    const asRow = origin.width >= ROW_MIN_WIDTH;
    root.dataset.fit = asRow ? "row" : "column";

    const card = stage.querySelector<HTMLElement>(".ofs-card");
    const bubble = stage.querySelector<HTMLElement>(".ofs-bubble");
    if (!card || !bubble) return;
    const cardBox = card.getBoundingClientRect();
    const bubbleBox = bubble.getBoundingClientRect();
    const gap = cardBox.top - bubbleBox.bottom;

    const next: Line[] = [];
    TRACES.forEach((trace, traceIndex) => {
      const chip = stage.querySelector<HTMLElement>(`[data-field="${trace.fieldIndex}"]`);
      const phrase = stage.querySelector<HTMLElement>(`[data-phrase="${trace.phrase}"]`);
      if (!chip || !phrase) return;
      const chipBox = chip.getBoundingClientRect();
      const rects = phrase.getClientRects();
      const phraseBox = rects[rects.length - 1] ?? phrase.getBoundingClientRect();
      const phraseX = phraseBox.left + phraseBox.width / 2 - origin.left;
      const phraseY = phraseBox.bottom + 3 - origin.top;
      // Each trace gets its own horizontal lane in the gap, so they never overlap.
      const lane = cardBox.top - origin.top - Math.max(8, gap * 0.28) - traceIndex * 5;
      let d: string;
      if (asRow) {
        const startX = chipBox.left + chipBox.width / 2 - origin.left;
        const startY = chipBox.top - origin.top;
        d = `M ${startX} ${startY} V ${lane} H ${phraseX} V ${phraseY}`;
      } else {
        // Stacked chips: run down the card's left padding so no line crosses a chip.
        const gutterX = cardBox.left - origin.left + 5 + traceIndex * 2.5;
        const startX = chipBox.left - origin.left;
        const startY = chipBox.top + chipBox.height / 2 - origin.top;
        d = `M ${startX} ${startY} H ${gutterX} V ${lane} H ${phraseX} V ${phraseY}`;
      }
      next.push({ fieldIndex: trace.fieldIndex, phrase: trace.phrase, d });
    });
    setLines(next);
  }, []);

  useLayoutEffect(() => {
    measure();
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    stage.querySelectorAll(".ofs-card, .ofs-bubble").forEach((el) => observer.observe(el));
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [measure]);

  useEffect(() => {
    if (!seen || !autoplayRef.current || prefersReducedMotion()) return;

    setChipsShown(0);
    setAutoTrace(null);
    setNudgeShown(false);
    setChoice(null);
    setCommitted(false);
    setGenerateReady(false);

    const timers: number[] = [];
    const at = (ms: number, work: () => void) => {
      timers.push(window.setTimeout(work, ms));
    };

    let time = INTRO_MS;
    FIELDS.forEach((field, index) => {
      const start = time;
      at(start, () => {
        setChipsShown(index + 1);
        setAutoTrace(field.from.length ? index : null);
      });
      time += CHIP_STEP_MS;
    });
    at(time - 300, () => setAutoTrace(null));
    time += BEFORE_NUDGE_MS;
    at(time, () => setNudgeShown(true));
    time += BEFORE_PICK_MS;
    at(time, () => setChoice("monthly"));
    time += PICK_STEP_MS;
    at(time, () => setCommitted(true));
    time += PICK_STEP_MS;
    at(time, () => setGenerateReady(true));
    time += LOOP_HOLD_MS;
    at(time, () => setRun((value) => value + 1));

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [seen, run]);

  /** The person took over, so the loop stops and their choice stays. */
  const choose = (next: Choice) => {
    autoplayRef.current = false;
    setChipsShown(FIELDS.length);
    setAutoTrace(null);
    setNudgeShown(true);
    setChoice(next);
    setCommitted(true);
    setGenerateReady(true);
  };

  const activeTrace = pointerTrace ?? autoTrace;
  const chosen = CHOICES.find((option) => option.key === choice);
  const accrualValue = committed ? (chosen?.filled ?? "") : "";
  const canGenerate = generateReady;

  const status = canGenerate
    ? `Ready. Type PTO, department sales, yearly limit 14 days, accrual ${accrualValue.toLowerCase()}. Generate policy is available.`
    : nudgeShown
      ? "Type, department, and yearly limit came from your request. Accrual wasn't mentioned. Monthly, all at once, or skip?"
      : "Reading your request into fields.";

  const phraseProps = (key: PhraseKey) => ({
    "data-phrase": key,
    "data-active":
      activeTrace !== null && FIELDS[activeTrace]?.from.includes(key) ? "true" : "false",
  });

  return (
    <div
      ref={rootRef}
      className="toc-product ofs-product"
      data-visual="only-what-you-said"
      data-fit="row"
    >
      <div className="ofs-stage" ref={stageRef}>
        <article className="ofs-bubble" aria-label="Your request">
          <p className="ofs-request">
            I need to create a{" "}
            <span className="ofs-phrase" {...phraseProps("pto")}>
              PTO
            </span>{" "}
            policy for{" "}
            <span className="ofs-phrase" {...phraseProps("sales")}>
              sales
            </span>{" "}
            department, the{" "}
            <span className="ofs-phrase" {...phraseProps("yearly")}>
              yearly
            </span>{" "}
            limit is{" "}
            <span className="ofs-phrase" {...phraseProps("days")}>
              14 days
            </span>
            .
          </p>
        </article>

        <article className="ofs-card" aria-label="Agent reply">
          <div className="ofs-head">
            <p className="ofs-title">Sales PTO policy</p>
            <p className="ofs-caption">From your words</p>
          </div>

          <ul className="ofs-chips">
            {FIELDS.map((field, index) => {
              const isAccrual = index === ACCRUAL_INDEX;
              const isOpen = isAccrual && !committed;
              const value = isAccrual ? accrualValue || "Open" : field.value;
              const hasSource = field.from.length > 0;
              return (
                <li key={field.label} className="ofs-chip-slot">
                  <button
                    type="button"
                    className="ofs-chip"
                    data-field={index}
                    data-shown={index < chipsShown ? "true" : "false"}
                    data-open={isOpen ? "true" : "false"}
                    data-traced={activeTrace === index ? "true" : "false"}
                    aria-label={
                      hasSource
                        ? `${field.label}, ${field.value}, taken from your request`
                        : `${field.label}, ${value}`
                    }
                    onMouseEnter={() => hasSource && setPointerTrace(index)}
                    onMouseLeave={() => setPointerTrace(null)}
                    onFocus={() => hasSource && setPointerTrace(index)}
                    onBlur={() => setPointerTrace(null)}
                  >
                    <span className="ofs-chip-label">{field.label}</span>
                    <span className="ofs-chip-value">{value}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="ofs-nudge" data-shown={nudgeShown ? "true" : "false"}>
            <p className="ofs-nudge-text">Accrual wasn&apos;t mentioned. Monthly or all at once?</p>
            <div className="ofs-options" role="group" aria-label="Accrual">
              {CHOICES.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className="ofs-option"
                  data-kind={option.key === "skip" ? "skip" : "pick"}
                  data-selected={choice === option.key ? "true" : "false"}
                  aria-pressed={choice === option.key}
                  tabIndex={nudgeShown ? 0 : -1}
                  onClick={() => choose(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="ofs-foot">
            <button
              type="button"
              className="ofs-generate"
              data-ready={canGenerate ? "true" : "false"}
              aria-disabled={!canGenerate}
              tabIndex={canGenerate ? 0 : -1}
            >
              <span>Generate policy</span>
              <ArrowIcon />
            </button>
          </div>
        </article>

        <svg className="ofs-lines" aria-hidden="true">
          {lines.map((line) => (
            <path
              key={`${line.fieldIndex}-${line.phrase}`}
              d={line.d}
              pathLength={1}
              className="ofs-line"
              data-active={activeTrace === line.fieldIndex ? "true" : "false"}
            />
          ))}
        </svg>
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
