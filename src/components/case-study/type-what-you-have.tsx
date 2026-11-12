"use client";

import { useEffect, useRef, useState } from "react";
import { Eclipse } from "loading-dev";
import "./type-what-you-have.css";

/**
 * Introducing the agent.
 *
 * The frame stays one size. Three arrangements play inside it:
 * 1. The person's card sits on the right. It types, Send is pressed, then it moves up.
 * 2. That card stays on the right. On the left, a loader sits beside each of the
 *    first two lines, then leaves as the third line arrives. The lines slide
 *    left into the space it left.
 * 3. After that slide, those cards move up, and a document preview is what you look at.
 *
 * After the preview has finished appearing, it holds, then plays from
 * the start. Reduced motion stays on the preview.
 */

const REQUEST =
  "I need to create a PTO policy for sales department, the yearly limit is 14 days.";

/** How fast each letter appears. Raise it to type more slowly. */
const CHAR_MS = 48;
/** Quiet moment after the last letter, before Send presses. */
const BEFORE_SEND_MS = 320;
/** How long Send stays pressed before the card moves up. */
const SEND_HOLD_MS = 420;
/** How long each thinking line waits before the next one starts. */
const LINE_MS = 720;
/** How long the loader takes to fade once the third line is there. */
const LOADER_FADE_MS = 420;
/** How long the three lines take to slide into the loader's space. */
const LINE_SHIFT_MS = 880;
/** A short rest after the lines settle, before the preview arrives. */
const AFTER_SHIFT_MS = 480;
/** How long the preview takes to finish sliding in. Matches the CSS. */
const PREVIEW_ARRIVE_MS = 800;
/** How long the finished preview stays before the sequence starts over. */
const LOOP_HOLD_MS = 2000;

/** How many gray bars stand in for the rest of the draft. */
const LOADING_LINES = 3;

const THINKING = [
  "Understanding admin's scope...",
  "Pulling the department documents...",
  "Worked 10s",
] as const;

type Phase = "typing" | "sending" | "thinking" | "document";

/**
 * Where the loader is during the thinking reply.
 * one and two sit beside those lines. three hides the loader.
 * settled is after the lines have slid left.
 */
type ThinkBeat = "idle" | "one" | "two" | "three" | "settled";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TypeWhatYouHaveVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [beat, setBeat] = useState<ThinkBeat>("idle");
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!prefersReducedMotion()) return;
    setPhase("document");
    setTyped(REQUEST);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const doc = docRef.current;
    if (!stage || !doc) return;
    // The thinking lines sit just above the card. The card's height
    // decides how far up they go, so a taller card does not cover them.
    const measure = () => {
      stage.style.setProperty("--toc-doc-height", `${doc.offsetHeight}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(doc);
    return () => observer.disconnect();
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
      return;
    }

    setPhase("typing");
    setBeat("idle");
    setTyped("");
    let index = 0;
    const timers: number[] = [];
    const thinkingStartsAt = BEFORE_SEND_MS + SEND_HOLD_MS;
    const typer = window.setInterval(() => {
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
      timers.push(window.setTimeout(() => setBeat("three"), thinkingStartsAt + LINE_MS * 2));
      timers.push(
        window.setTimeout(
          () => setBeat("settled"),
          thinkingStartsAt + LINE_MS * 2 + LOADER_FADE_MS,
        ),
      );
      const previewStartsAt =
        thinkingStartsAt + LINE_MS * 2 + LOADER_FADE_MS + LINE_SHIFT_MS + AFTER_SHIFT_MS;
      timers.push(window.setTimeout(() => setPhase("document"), previewStartsAt));
      timers.push(
        window.setTimeout(
          () => setRun((value) => value + 1),
          previewStartsAt + PREVIEW_ARRIVE_MS + LOOP_HOLD_MS,
        ),
      );
    }, CHAR_MS);

    return () => {
      window.clearInterval(typer);
      timers.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [seen, run]);

  const status =
    phase === "thinking"
      ? "Understanding admin's scope. Pulling the department documents. Worked 10s."
      : phase === "document"
        ? "Policy created. Sales department, PTO, yearly limit 14 days. Accrual missing."
        : phase === "sending"
          ? "Sending the request"
          : "";

  const chatIsQuiet = phase === "document";

  return (
    <div
      ref={rootRef}
      className="toc-product"
      data-visual="type-what-you-have"
      data-phase={phase}
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

        <article ref={docRef} className="toc-doc" aria-hidden={phase !== "document"}>
          <p className="toc-doc-title">Sales PTO policy</p>
          <p className="toc-doc-lead">A PTO policy for the sales department.</p>
          <div className="toc-doc-note">
            <p className="toc-doc-note-title">From the request</p>
            <p className="toc-doc-note-body">
              Sales department, yearly limit 14 days. Accrual was not included.
            </p>
          </div>
          <div className="toc-doc-lines" aria-hidden="true">
            {Array.from({ length: LOADING_LINES }, (_, index) => (
              <span key={index} className="toc-doc-line" />
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
              <DownloadIcon />
            </span>
          </div>
        </article>
      </div>

      <p className="toc-sr" aria-live="polite">
        {status}
      </p>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="toc-send-icon">
      <path d="M8 2.5v7" />
      <path d="M5.2 7.2 8 10l2.8-2.8" />
      <path d="M3.5 12.5h9" />
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
