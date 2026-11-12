"use client";

import { useEffect, useRef, useState } from "react";
import { Eclipse } from "loading-dev";
import "./type-what-you-have.css";
import "./said-too-much.css";
import { TOC_HOLD_MS, TOC_STEP_MS } from "./toc-motion";

/**
 * The agent said too much.
 *
 * Section 02 already shows the request, so this loop starts at the
 * thinking line, in the middle of the frame. One line reads
 * "Generating full policy" with the loader beside it, then becomes
 * "Worked for 20s" as the loader leaves. When the policy appears,
 * that line moves up.
 * The policy card writes after that. It grows past the frame, so the
 * older lines fade at the top. Each row has a small dot on its right.
 * A gray dot is a row from the request. A red dot is a row the
 * agent added, so it reads as an error. The two notes under the card use those same dots and
 * stay quiet: the words are the normal text color, and the dot is
 * the only color.
 *
 * Reduced motion shows the finished policy, the dots, and both notes.
 */

/** How long "Generating full policy" stays before it changes. */
const LINE_MS = 720;
/** How long the line takes to slide into the space the loader left. */
const LINE_SHIFT_MS = 880;
/** A short rest after that slide, before the policy arrives. */
const AFTER_SHIFT_MS = 480;
/** How long one policy section takes to arrive before the next. Same step as section 02's thinking lines. */
const ROW_MS = TOC_STEP_MS;
const LOOP_HOLD_MS = TOC_HOLD_MS;

const GENERATING = "Generating full policy";
const WORKED = "Worked for 20s";

/**
 * One row is the yearly limit from the note. The other eight are
 * parts the agent wrote on its own. Sample lines only, not a real policy.
 */
const SECTIONS = [
  {
    title: "Eligibility",
    body: "Yearly limit, 14 days.",
    tag: "From your request",
    kind: "request",
  },
  {
    title: "Accrual",
    body: "A schedule the note never set.",
    tag: "Added by AI",
    kind: "added",
  },
  {
    title: "Carryover",
    body: "Days moving into a next year.",
    tag: "Added by AI",
    kind: "added",
  },
  {
    title: "Payout",
    body: "Unused days paid out.",
    tag: "Added by AI",
    kind: "added",
  },
  {
    title: "Blackout dates",
    body: "Dates when time off is blocked.",
    tag: "Added by AI",
    kind: "added",
  },
  {
    title: "Manager approval",
    body: "A step before the request.",
    tag: "Added by AI",
    kind: "added",
  },
  {
    title: "Part-time rules",
    body: "A split the note never named.",
    tag: "Added by AI",
    kind: "added",
  },
  {
    title: "Holiday overlap",
    body: "Holidays counted against the limit.",
    tag: "Added by AI",
    kind: "added",
  },
  {
    title: "Termination",
    body: "What happens to unused days.",
    tag: "Added by AI",
    kind: "added",
  },
] as const;

type Phase = "thinking" | "document";
type ThinkBeat = "idle" | "one" | "settled";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SaidTooMuchVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState<Phase>("thinking");
  const [beat, setBeat] = useState<ThinkBeat>("idle");
  const [line, setLine] = useState(GENERATING);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!prefersReducedMotion()) return;
    setPhase("document");
    setBeat("settled");
    setLine(WORKED);
    setShown(SECTIONS.length);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const dock = dockRef.current;
    const root = rootRef.current;
    if (!stage || !dock || !root) return;

    // The policy is meant to overflow. The frame only grows when the
    // notes under the card and a slice of the policy would collide.
    const measure = () => {
      const dockHeight = Math.ceil(dock.getBoundingClientRect().height);
      stage.style.setProperty("--toc-counter", `${dockHeight}px`);
      stage.style.setProperty("--toc-dock", `${dockHeight}px`);
      const padY =
        parseFloat(getComputedStyle(root).paddingTop) +
        parseFloat(getComputedStyle(root).paddingBottom);
      const borderY = root.offsetHeight - root.clientHeight;
      const naturalHeight = root.getBoundingClientRect().width * (10 / 16);
      const neededHeight = 176 + dockHeight + padY + borderY;
      if (neededHeight > naturalHeight + 1) {
        root.style.minHeight = `${Math.ceil(neededHeight)}px`;
      } else {
        root.style.minHeight = "";
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    observer.observe(dock);
    observer.observe(root);
    const counter = dock.querySelector(".toc-count");
    if (counter) observer.observe(counter);
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [phase, shown]);

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
      setBeat("settled");
      setLine(WORKED);
      setShown(SECTIONS.length);
      return;
    }

    setPhase("thinking");
    setBeat("one");
    setLine(GENERATING);
    setShown(0);

    const timers: number[] = [];
    timers.push(
      window.setTimeout(() => {
        setLine(WORKED);
        setBeat("settled");
      }, LINE_MS),
    );
    const writingStartsAt = LINE_MS + LINE_SHIFT_MS + AFTER_SHIFT_MS;
    timers.push(window.setTimeout(() => setPhase("document"), writingStartsAt));
    SECTIONS.forEach((_, sectionIndex) => {
      timers.push(
        window.setTimeout(() => setShown(sectionIndex + 1), writingStartsAt + sectionIndex * ROW_MS),
      );
    });
    const finishedAt = writingStartsAt + (SECTIONS.length - 1) * ROW_MS + ROW_MS;
    timers.push(window.setTimeout(() => setRun((value) => value + 1), finishedAt + LOOP_HOLD_MS));

    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [seen, run]);

  const visible = SECTIONS.slice(0, shown);
  const asked = visible.filter((section) => section.kind === "request").length;
  const added = visible.filter((section) => section.kind === "added").length;
  const status =
    phase === "document"
      ? `The agent wrote a long sales PTO policy. ${asked} from your request. ${added} added by AI. Only the yearly limit of 14 days came from the request.`
      : beat === "settled"
        ? "Worked for 20s."
        : "Generating full policy.";

  return (
    <div
      ref={rootRef}
      className="toc-product"
      data-visual="said-too-much"
      data-phase={phase}
    >
      <div className="toc-stage" ref={stageRef}>
        <div className="toc-stack" aria-hidden={phase === "document"}>
          <div className="toc-think-slot">
            <article className="toc-think" data-beat={beat}>
              <span className="toc-think-mark" aria-hidden="true">
                <Eclipse size={16} />
              </span>
              <div className="toc-think-lines">
                <p className="toc-think-line">{line}</p>
              </div>
            </article>
          </div>
        </div>

        <article className="toc-doc" aria-hidden={phase !== "document"}>
          <p className="toc-doc-title">Sales PTO policy</p>
          <p className="toc-doc-lead">A PTO policy for the sales department.</p>
          <div className="toc-policy-rows">
            {SECTIONS.map((section, index) => (
              <div
                key={section.title}
                className="toc-policy-row"
                data-shown={index < shown ? "true" : "false"}
              >
                <div className="toc-policy-head">
                  <p className="toc-policy-title">{section.title}</p>
                  <span className="toc-dot" data-kind={section.kind} aria-hidden="true" />
                </div>
                <p className="toc-policy-body">{section.body}</p>
              </div>
            ))}
          </div>
          <div className="toc-file">
            <span className="toc-page-mark" aria-hidden="true">
              <PageIcon />
            </span>
            <span className="toc-file-name">
              <span className="toc-value">Sales PTO policy</span>
              <span className="toc-label">Page</span>
            </span>
            <span className="toc-download" aria-hidden="true">
              <OpenIcon />
            </span>
          </div>
        </article>

        <div className="toc-dock" ref={dockRef}>
          <p
            className="toc-count"
            data-kind="request"
            data-shown={asked > 0 ? "true" : "false"}
          >
            <span className="toc-dot" data-kind="request" aria-hidden="true" />
            <span className="toc-count-num">{asked}</span> from your request
          </p>
          <p
            className="toc-count"
            data-kind="added"
            data-shown={added > 0 ? "true" : "false"}
          >
            <span className="toc-dot" data-kind="added" aria-hidden="true" />
            <span className="toc-count-num">{added}</span> added by AI
          </p>
        </div>
      </div>

      <p className="toc-sr" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

function OpenIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="toc-send-icon">
      <path d="M6.5 3.5H3.5v9h9V9.5" />
      <path d="M8.5 3.5H12.5V7.5" />
      <path d="M12.2 3.8 7.2 8.8" />
    </svg>
  );
}

function PageIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="toc-send-icon">
      <path d="M4.5 2.5h5.2L12.5 5.3V13.5h-8Z" />
      <path d="M9.5 2.7V5.4H12.2" />
    </svg>
  );
}

