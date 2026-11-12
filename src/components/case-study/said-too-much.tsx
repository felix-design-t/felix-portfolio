"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Eclipse } from "loading-dev";
import "./type-what-you-have.css";
import "./said-too-much.css";

/**
 * The agent said too much.
 *
 * Same Copilot surface as the introducing-agent screen. The sequence:
 * 1. The chat card rises from the bottom and types the short request.
 * 2. Send presses. The card leaves through the top fade.
 * 3. Thinking lines step through on the left, then shift left.
 * 4. A policy card writes section after section. It grows past the
 *    frame, so the older lines fade at the top.
 * 5. A counter at the bottom counts what was asked and what the agent added.
 *
 * The checklist beside the policy never gains a row. Reduced motion
 * shows the finished policy, the tags, and the counter.
 */

const REQUEST =
  "I need to create a PTO policy for sales department, the yearly limit is 14 days.";

/** How long the chat card takes to rise from the bottom of the frame. */
const ENTER_MS = 800;
const CHAR_MS = 48;
const BEFORE_SEND_MS = 320;
const SEND_HOLD_MS = 420;
const LINE_MS = 720;
const LOADER_FADE_MS = 420;
const LINE_SHIFT_MS = 880;
const AFTER_SHIFT_MS = 480;
/** How long one policy section takes to arrive before the next. */
const ROW_MS = 680;
const LOOP_HOLD_MS = 2000;

const THINKING = [
  "Reading the request...",
  "Drafting the full policy...",
  "Worked 8s",
] as const;

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

/** The checklist is the same three lines for the whole sequence. */
const CHECKLIST = [
  { name: "Yearly limit", state: "14 days" },
  { name: "Department", state: "Sales" },
  { name: "Accrual", state: "Missing" },
] as const;

type Phase = "typing" | "sending" | "thinking" | "document";
type ThinkBeat = "idle" | "one" | "two" | "three" | "settled";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SaidTooMuchVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [beat, setBeat] = useState<ThinkBeat>("idle");
  const [typed, setTyped] = useState("");
  const [arriving, setArriving] = useState(true);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!prefersReducedMotion()) return;
    setPhase("document");
    setTyped(REQUEST);
    setArriving(false);
    setShown(SECTIONS.length);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const dock = dockRef.current;
    const root = rootRef.current;
    if (!stage || !dock || !root) return;

    // The policy is meant to overflow. The frame only grows when the
    // counter, the checklist, and a slice of the policy would collide.
    const measure = () => {
      const beside = stage.clientWidth >= 460;
      root.dataset.fit = beside ? "beside" : "stack";
      const counter = dock.querySelector<HTMLElement>(".toc-count");
      const checklist = dock.querySelector<HTMLElement>(".toc-check");
      const counterHeight = Math.ceil(counter?.getBoundingClientRect().height ?? 0);
      const checklistHeight = Math.ceil(checklist?.getBoundingClientRect().height ?? 0);
      stage.style.setProperty("--toc-counter", `${counterHeight}px`);
      stage.style.setProperty("--toc-check", `${checklistHeight}px`);
      // Beside: the checklist sits in the right margin, so the policy
      // only has to clear the counter. Stacked: it clears both.
      const dockHeight = beside
        ? counterHeight + 12
        : counterHeight + checklistHeight + 20;
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
    const checklist = dock.querySelector(".toc-check");
    if (counter) observer.observe(counter);
    if (checklist) observer.observe(checklist);
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
      setTyped(REQUEST);
      setArriving(false);
      setShown(SECTIONS.length);
      return;
    }

    setBeat("idle");
    setTyped("");
    setShown(0);
    flushSync(() => {
      setPhase("typing");
      setArriving(true);
    });

    let typer = 0;
    let riseFrame = 0;
    const timers: number[] = [];
    const thinkingStartsAt = BEFORE_SEND_MS + SEND_HOLD_MS;
    const beginTyping = () => {
      let index = 0;
      typer = window.setInterval(() => {
        index += 1;
        setTyped(REQUEST.slice(0, index));
        if (index < REQUEST.length) return;
        window.clearInterval(typer);
        timers.push(window.setTimeout(() => setPhase("sending"), BEFORE_SEND_MS));
        timers.push(
          window.setTimeout(() => {
            setPhase("thinking");
            setBeat("one");
          }, thinkingStartsAt),
        );
        timers.push(window.setTimeout(() => setBeat("two"), thinkingStartsAt + LINE_MS));
        timers.push(
          window.setTimeout(() => setBeat("three"), thinkingStartsAt + LINE_MS * 2),
        );
        timers.push(
          window.setTimeout(
            () => setBeat("settled"),
            thinkingStartsAt + LINE_MS * 2 + LOADER_FADE_MS,
          ),
        );
        const writingStartsAt =
          thinkingStartsAt + LINE_MS * 2 + LOADER_FADE_MS + LINE_SHIFT_MS + AFTER_SHIFT_MS;
        timers.push(window.setTimeout(() => setPhase("document"), writingStartsAt));
        SECTIONS.forEach((_, sectionIndex) => {
          timers.push(
            window.setTimeout(
              () => setShown(sectionIndex + 1),
              writingStartsAt + sectionIndex * ROW_MS,
            ),
          );
        });
        const finishedAt = writingStartsAt + (SECTIONS.length - 1) * ROW_MS + ROW_MS;
        timers.push(
          window.setTimeout(() => setRun((value) => value + 1), finishedAt + LOOP_HOLD_MS),
        );
      }, CHAR_MS);
    };

    const parkFrame = window.requestAnimationFrame(() => {
      const stack = rootRef.current?.querySelector(".toc-stack");
      if (stack) void stack.getBoundingClientRect();
      riseFrame = window.requestAnimationFrame(() => setArriving(false));
    });
    timers.push(window.setTimeout(beginTyping, ENTER_MS));

    return () => {
      window.cancelAnimationFrame(parkFrame);
      window.cancelAnimationFrame(riseFrame);
      window.clearInterval(typer);
      timers.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [seen, run]);

  const visible = SECTIONS.slice(0, shown);
  const asked = visible.filter((section) => section.kind === "request").length;
  const added = visible.filter((section) => section.kind === "added").length;
  const chatIsQuiet = phase === "thinking" || phase === "document";

  const status =
    phase === "document"
      ? `The agent wrote a long sales PTO policy. ${asked} asked, ${added} added. Only the yearly limit of 14 days came from the request. The checklist did not change.`
      : phase === "thinking"
        ? "Reading the request. Drafting the full policy. Worked 8s."
        : phase === "sending"
          ? "Sending the request"
          : "";

  return (
    <div
      ref={rootRef}
      className="toc-product"
      data-visual="said-too-much"
      data-phase={phase}
      data-arrive={arriving ? "bottom" : undefined}
    >
      <div className="toc-stage" ref={stageRef}>
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
            <article className="toc-think" data-beat={beat}>
              <span className="toc-think-mark" aria-hidden="true">
                <Eclipse size={16} />
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
                  <span className="toc-tag" data-kind={section.kind}>
                    {section.tag}
                  </span>
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
          <aside className="toc-check" aria-label="Checklist">
            <p className="toc-label">Checklist</p>
            <ul className="toc-check-list">
              {CHECKLIST.map((item) => (
                <li key={item.name} className="toc-check-row">
                  <span className="toc-value">{item.name}</span>
                  <span className="toc-label">{item.state}</span>
                </li>
              ))}
            </ul>
          </aside>
          <p className="toc-count" aria-hidden={phase !== "document"}>
            <span className="toc-count-num">{asked}</span> asked,{" "}
            <span className="toc-count-num">{added}</span> added
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
