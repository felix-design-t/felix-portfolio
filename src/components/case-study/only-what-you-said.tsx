"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./type-what-you-have.css";
import "./only-what-you-said.css";
import {
  TOC_MOVE_MS,
  TOC_PAUSE_MS,
  TOC_PHASE_GAP_MS,
  TOC_REST_MS,
  TOC_STEP_MS,
} from "./toc-motion";

/**
 * Only what you said.
 *
 * A short chat thread, read top to bottom, in three steps:
 *   1. The agent shows what it understood, as chips pinned to the
 *      admin's own words with thin lines.
 *   2. It asks about the one field it did not see, instead of guessing.
 *   3. The admin answers, the agent says "Got it", the chip fills in,
 *      and Generate becomes available.
 *
 * "step" is the number of messages on screen (0 to 4). Think of it like
 * the active state in a stepper: earlier steps dim, the newest is full.
 * The thread plays once, the first time it scrolls into view, then holds.
 * Reduced motion shows the finished thread. Tweak the times below.
 */

/** Pause before the agent's first message. */
const INTRO_MS = TOC_MOVE_MS;
/** Time between one chip filling in and the next. */
const CHIP_STEP_MS = TOC_STEP_MS;
/** Pause after the last chip before the question arrives. */
const BEFORE_QUESTION_MS = TOC_PHASE_GAP_MS;
/** Time the question waits before an option highlights. */
const BEFORE_PICK_MS = TOC_PAUSE_MS;
/** Time between the pick, the reply, "Got it", and the filled chip. */
const PICK_STEP_MS = TOC_STEP_MS;
/** Time between the Accrual chip filling and Generate lighting up. */
const BEFORE_GENERATE_MS = TOC_STEP_MS;
/** Rest after "Got it" before the Accrual chip fills in. */
const BEFORE_FILL_MS = TOC_REST_MS;
/** Stage width where the three chips sit in one row. */
const ROW_MIN_WIDTH = 440;

type PhraseKey = "pto" | "sales" | "yearly" | "days";
type Choice = "monthly" | "all-at-once" | "skip";

type Field = {
  label: string;
  value: string;
  /** Phrases in the request this field was read from. */
  from: PhraseKey[];
};

const FIELDS: Field[] = [
  { label: "Type", value: "PTO", from: ["pto"] },
  { label: "Department", value: "Sales", from: ["sales"] },
  { label: "Yearly limit", value: "14 days", from: ["yearly", "days"] },
];

const CHOICES: { key: Choice; label: string; filled: string; reply: string }[] = [
  { key: "monthly", label: "Monthly", filled: "Monthly", reply: "Monthly" },
  { key: "all-at-once", label: "All at once", filled: "All at once", reply: "All at once" },
  { key: "skip", label: "Skip", filled: "Skipped", reply: "Skip" },
];

/** One trace per phrase: the line from a chip back to its words. */
const TRACES = FIELDS.flatMap((field, fieldIndex) =>
  field.from.map((phrase) => ({ fieldIndex, phrase })),
);

type Line = { fieldIndex: number; phrase: PhraseKey; d: string };

/**
 * One elbow with a small rounded corner. A hard 90° join on a stroke
 * piles up pixels and reads as a thick blob. The radius is capped so a
 * short run stays a straight hairline.
 */
function elbow(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): string {
  const rise = y2 - y1;
  const run = x3 - x1;
  const drop = y3 - y2;
  if (Math.abs(run) < 2) return `M ${x1} ${y1} V ${y3}`;
  const dirX = Math.sign(run);
  const dirDrop = Math.sign(drop) || 1;
  const radius = Math.min(3, Math.abs(rise) / 2, Math.abs(run) / 2, Math.abs(drop) / 2);
  if (radius < 1) return `M ${x1} ${y1} V ${y2} H ${x3} V ${y3}`;
  const dirRise = Math.sign(rise) || 1;
  return `M ${x1} ${y1} V ${y2 - dirRise * radius} Q ${x1} ${y2} ${x1 + dirX * radius} ${y2} H ${x3 - dirX * radius} Q ${x3} ${y2} ${x3} ${y2 + dirDrop * radius} V ${y3}`;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function OnlyWhatYouSaidVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  /** A tap that arrived before the run finished. Applied as soon as it can show. */
  const pendingChoiceRef = useRef<Choice | null>(null);

  const [seen, setSeen] = useState(false);
  const [step, setStep] = useState(0);
  const [chipsShown, setChipsShown] = useState(0);
  const [autoTrace, setAutoTrace] = useState<number | null>(null);
  const [pointerTrace, setPointerTrace] = useState<number | null>(null);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [filled, setFilled] = useState(false);
  const [finished, setFinished] = useState(false);
  const [lines, setLines] = useState<Line[]>([]);

  const showEnd = useCallback((pick: Choice) => {
    setStep(4);
    setChipsShown(FIELDS.length);
    setAutoTrace(null);
    setChoice(pick);
    setFilled(true);
    setFinished(true);
  }, []);

  useEffect(() => {
    if (!prefersReducedMotion()) return;
    showEnd(pendingChoiceRef.current ?? "monthly");
  }, [showEnd]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setSeen(true);
      },
      { threshold: 0.35 },
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

    const message = stage.querySelector<HTMLElement>('[data-message="fields"]');
    const bubble = stage.querySelector<HTMLElement>('[data-message="request"]');
    if (!message || !bubble) return;
    const messageBox = message.getBoundingClientRect();
    const bubbleBox = bubble.getBoundingClientRect();

    // Each trace is one elbow in the gap between the request and the card:
    // straight down from the word, across on its own lane, then down to the
    // top of the card above its chip. Nothing runs around the card, and
    // lanes are ordered left to right so the horizontals never cross.
    const bandTop = bubbleBox.bottom - origin.top + 6;
    const bandBottom = messageBox.top - origin.top - 4;
    const laneCount = Math.max(1, FIELDS.length);
    const usable = Math.max(0, bandBottom - bandTop);
    const laneGap = laneCount > 1 ? Math.min(4, usable / (laneCount - 1)) : 0;
    const laneOrigin = bandTop + Math.max(0, usable - laneGap * (laneCount - 1)) / 2;
    const cardLeft = messageBox.left - origin.left;
    const cardRight = messageBox.right - origin.left;
    const cardTop = messageBox.top - origin.top;

    const lead = message.querySelector(".ofs-lead")?.getBoundingClientRect();
    const leadLeft = lead ? lead.left - origin.left : cardLeft;
    const leadRight = lead ? lead.right - origin.left : cardLeft;

    const measured: {
      fieldIndex: number;
      phrase: PhraseKey;
      startX: number;
      startY: number;
      endX: number;
      chipTop: number;
      chipMid: number;
      chipRight: number;
      slot: number;
    }[] = [];

    TRACES.forEach((trace) => {
      const chip = stage.querySelector<HTMLElement>(`[data-field="${trace.fieldIndex}"]`);
      const phrase = stage.querySelector<HTMLElement>(`[data-phrase="${trace.phrase}"]`);
      if (!chip || !phrase) return;
      const chipBox = chip.getBoundingClientRect();
      const rects = phrase.getClientRects();
      const phraseBox = rects[rects.length - 1] ?? phrase.getBoundingClientRect();
      const phraseX = phraseBox.left + phraseBox.width / 2 - origin.left;
      // Touch the underline when the word is on the last line. A word on an
      // earlier line starts the line at the bubble edge, so it never cuts
      // through the line of text below it.
      const onLastLine = phraseBox.bottom > bubbleBox.bottom - 20;
      const startY = onLastLine
        ? phraseBox.bottom + 2 - origin.top
        : bubbleBox.bottom - origin.top;
      // In a row, land above that chip. Stacked chips share one x, so land
      // across the card top in field order instead of piling up.
      let endX = asRow
        ? chipBox.left + chipBox.width / 2 - origin.left
        : cardLeft + ((trace.fieldIndex + 0.5) / FIELDS.length) * (cardRight - cardLeft);
      endX = Math.min(cardRight - 16, Math.max(cardLeft + 16, endX));
      measured.push({
        fieldIndex: trace.fieldIndex,
        phrase: trace.phrase,
        startX: phraseX,
        startY,
        endX,
        chipTop: chipBox.top - origin.top,
        chipMid: chipBox.top + chipBox.height / 2 - origin.top,
        chipRight: chipBox.right - origin.left,
        slot: 0,
      });
    });

    measured.sort((a, b) => a.startX - b.startX || a.endX - b.endX);

    // Words that feed one chip share a lane and a single stem, so "yearly"
    // and "14 days" read as one hairline instead of two brackets side by side.
    const laneOfField = new Map<number, number>();
    measured.forEach((trace) => {
      if (!laneOfField.has(trace.fieldIndex)) laneOfField.set(trace.fieldIndex, laneOfField.size);
    });

    const next: Line[] = measured.map((trace) => {
      const siblings = measured.filter((item) => item.fieldIndex === trace.fieldIndex);
      const laneIndex = laneOfField.get(trace.fieldIndex) ?? 0;
      const lowestStart = Math.max(...siblings.map((item) => item.startY));
      const laneY = Math.max(lowestStart + 4, laneOrigin + laneIndex * laneGap);
      // Every line ends on its chip. A straight drop is used when that
      // column is clear of the sentence. Otherwise the line comes down the
      // card's empty side padding, crosses under the sentence, and steps
      // onto the top center of the chip.
      let d: string;
      if (asRow) {
        const chipX = trace.endX;
        const chipY = trace.chipTop;
        const clearsLead = chipX < leadLeft - 4 || chipX > leadRight + 4;
        if (clearsLead) {
          d = elbow(trace.startX, trace.startY, trace.startX, laneY, chipX, chipY);
        } else {
          const gutterX = chipX >= (cardLeft + cardRight) / 2 ? cardRight - 8 : cardLeft + 8;
          const leadBottom = lead ? lead.bottom - origin.top : cardTop;
          const channelY = Math.min(chipY, leadBottom + 4);
          d =
            channelY >= chipY - 1
              ? `${elbow(trace.startX, trace.startY, trace.startX, laneY, gutterX, chipY)} H ${chipX}`
              : `${elbow(trace.startX, trace.startY, trace.startX, laneY, gutterX, channelY)} H ${chipX} V ${chipY}`;
        }
      } else {
        const railX = cardRight - 6 - trace.fieldIndex * 3;
        d = `${elbow(trace.startX, trace.startY, trace.startX, laneY, railX, trace.chipMid)} H ${trace.chipRight}`;
      }
      return { fieldIndex: trace.fieldIndex, phrase: trace.phrase, d };
    });
    setLines(next);
  }, []);

  useLayoutEffect(() => {
    measure();
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    stage.querySelectorAll("[data-message]").forEach((el) => observer.observe(el));
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [measure, step, chipsShown]);

  useEffect(() => {
    if (!seen || prefersReducedMotion()) return;

    setStep(0);
    setChipsShown(0);
    setAutoTrace(null);
    setChoice(pendingChoiceRef.current);
    setFilled(false);
    setFinished(false);

    const timers: number[] = [];
    const at = (ms: number, work: () => void) => {
      timers.push(window.setTimeout(work, ms));
    };

    let time = INTRO_MS;
    at(time, () => setStep(1));
    FIELDS.forEach((field, index) => {
      time += CHIP_STEP_MS;
      at(time, () => {
        setChipsShown(index + 1);
        setAutoTrace(index);
      });
    });
    at(time + CHIP_STEP_MS - 200, () => setAutoTrace(null));
    time += BEFORE_QUESTION_MS;
    at(time, () => setStep(2));
    time += BEFORE_PICK_MS;
    // A tap before this beat wins. Otherwise the run picks Monthly.
    at(time, () => setChoice((current) => pendingChoiceRef.current ?? current ?? "monthly"));
    time += PICK_STEP_MS;
    at(time, () => setStep(3));
    time += PICK_STEP_MS;
    at(time, () => setStep(4));
    time += BEFORE_FILL_MS;
    at(time, () => setFilled(true));
    time += BEFORE_GENERATE_MS;
    at(time, () => setFinished(true));

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [seen]);

  /**
   * A tap never rewinds the thread. Before the run finishes it is remembered
   * and used for the reply; after that it just updates the filled chip.
   */
  const choose = (next: Choice) => {
    pendingChoiceRef.current = next;
    setChoice(next);
    if (finished || prefersReducedMotion()) {
      setFilled(true);
      setFinished(true);
      setStep(4);
      setChipsShown(FIELDS.length);
    }
  };

  const activeTrace = pointerTrace ?? autoTrace;
  const chosen = CHOICES.find((option) => option.key === choice);
  const accrualValue = filled ? (chosen?.filled ?? "") : "";

  /** A message is hidden before its step, dimmed after it, full at the end. */
  const stateOf = (messageStep: number) =>
    step < messageStep ? "hidden" : finished || step === messageStep ? "current" : "past";

  const status = finished
    ? `Ready. Type PTO, department sales, yearly limit 14 days, accrual ${accrualValue.toLowerCase()}. Generate policy is available.`
    : step >= 2
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
        <article
          className="ofs-bubble ofs-message"
          data-message="request"
          data-state={step >= 2 && !finished ? "past" : "current"}
          aria-label="Your request"
        >
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

        <article
          className="ofs-card ofs-message"
          data-message="fields"
          data-state={stateOf(1)}
          aria-label="Agent: what I got"
        >
          <p className="ofs-lead">Here&apos;s what I got from your request</p>
          <ul className="ofs-chips">
            {FIELDS.map((field, index) => (
              <li key={field.label} className="ofs-chip-slot">
                <button
                  type="button"
                  className="ofs-chip"
                  data-field={index}
                  data-shown={index < chipsShown ? "true" : "false"}
                  data-traced={activeTrace === index ? "true" : "false"}
                  aria-label={`${field.label}, ${field.value}, taken from your request`}
                  onMouseEnter={() => setPointerTrace(index)}
                  onMouseLeave={() => setPointerTrace(null)}
                  onFocus={() => setPointerTrace(index)}
                  onBlur={() => setPointerTrace(null)}
                >
                  <span className="ofs-chip-label">{field.label}</span>
                  <span className="ofs-chip-value">{field.value}</span>
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article
          className="ofs-card ofs-message"
          data-message="question"
          data-state={stateOf(2)}
          aria-label="Agent: accrual question"
        >
          <p className="ofs-lead">I didn&apos;t see accrual. How should it work?</p>
          <div className="ofs-chip ofs-chip-static" data-open="true">
            <span className="ofs-chip-label">Accrual</span>
            <span className="ofs-chip-value">Open</span>
          </div>
          <div className="ofs-options" role="group" aria-label="Accrual">
            {CHOICES.map((option) => (
              <button
                key={option.key}
                type="button"
                className="ofs-option"
                data-kind={option.key === "skip" ? "skip" : "pick"}
                data-selected={choice === option.key ? "true" : "false"}
                aria-pressed={choice === option.key}
                tabIndex={step >= 2 ? 0 : -1}
                onClick={() => choose(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </article>

        <article
          className="ofs-bubble ofs-message"
          data-message="reply"
          data-state={stateOf(3)}
          aria-label="Your answer"
        >
          <p className="ofs-request">{chosen?.reply ?? "Monthly"}</p>
        </article>

        <article
          className="ofs-card ofs-message"
          data-message="done"
          data-state={stateOf(4)}
          aria-label="Agent: ready"
        >
          <p className="ofs-lead">Got it.</p>
          <div className="ofs-done-row">
            <div className="ofs-chip ofs-chip-static" data-open={filled ? "false" : "true"} data-filled={filled ? "true" : "false"}>
              <span className="ofs-chip-label">Accrual</span>
              <span className="ofs-chip-value">{accrualValue || "Open"}</span>
            </div>
            <button
              type="button"
              className="ofs-generate"
              data-ready={finished ? "true" : "false"}
              aria-disabled={!finished}
              tabIndex={finished ? 0 : -1}
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
