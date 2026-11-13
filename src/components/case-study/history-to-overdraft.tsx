"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import "./type-what-you-have.css";
import "./exploration.css";
import "./decisions.css";
import "./history-to-overdraft.css";
import { LastYearReport } from "./replay-last-year";
import {
  TOC_BEAT_MS,
  TOC_CHAR_MS,
  TOC_HOLD_MS,
  TOC_MOVE_MS,
  TOC_PAUSE_MS,
  TOC_PRESS_HOLD_MS,
  TOC_REST_MS,
  TOC_STEP_MS,
} from "./toc-motion";

/**
 * Solution, second frame.
 *
 * One window, two columns. The left column is the whole chat: the
 * setup check, then the overdraft question in that same thread.
 * The right column is last year's report. There is no scenario rail.
 *
 * A new message eases up above the chat box. Messages already open
 * keep their height and slide up with it. The chat box stays put.
 */

const YES = "Yes";
const ASK =
  "What happens if an employee requests 2 hours, with more than 2 hours accrued but less than 2 hours earned?";

const CHOICES = ["Approve, balance −1", "Approve 1, 1 unpaid", "Deny with a reason"];
const CHOSEN = "Approve 1, 1 unpaid";

type Stage = "chat" | "history";

type Play = {
  leftText: string;
  leftSending: boolean;
  leftYes: boolean;
  stage: Stage;
  askText: string;
  askSending: boolean;
  askShown: boolean;
  replyShown: boolean;
  midText: string;
  midSending: boolean;
  midYes: boolean;
  choicesShown: boolean;
};

const START: Play = {
  leftText: "",
  leftSending: false,
  leftYes: false,
  stage: "chat",
  askText: "",
  askSending: false,
  askShown: false,
  replyShown: false,
  midText: "",
  midSending: false,
  midYes: false,
  choicesShown: false,
};

const END: Play = {
  ...START,
  leftYes: true,
  stage: "history",
  askShown: true,
  replyShown: true,
  midYes: true,
  choicesShown: true,
};

function subscribeToReducedMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function reducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HistoryToOverdraftVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [run, setRun] = useState(0);
  const [snap, setSnap] = useState(false);
  const reduced = useSyncExternalStore(subscribeToReducedMotion, reducedMotionSnapshot, () => false);
  const [play, setPlay] = useState<Play>(START);
  const view = reduced ? END : play;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setSeen(true);
      },
      { threshold: 0.4 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !seen) return;

    let release = 0;
    const startFrame = window.requestAnimationFrame(() => {
      setSnap(true);
      setPlay(START);
      release = window.requestAnimationFrame(() => setSnap(false));
    });

    const timers: number[] = [];
    const at = (ms: number, work: () => void) => {
      timers.push(window.setTimeout(work, ms));
    };
    const set = (partial: Partial<Play>) => {
      setPlay((current) => ({ ...current, ...partial }));
    };
    const typeInto = (text: string, key: "leftText" | "askText" | "midText", start: number) => {
      for (let index = 1; index <= text.length; index += 1) {
        const slice = text.slice(0, index);
        at(start + index * TOC_CHAR_MS, () => set({ [key]: slice }));
      }
      return start + text.length * TOC_CHAR_MS;
    };

    let time = TOC_REST_MS;
    time = typeInto(YES, "leftText", time);
    time += TOC_BEAT_MS;
    at(time, () => set({ leftSending: true }));
    time += TOC_PRESS_HOLD_MS;
    at(time, () => set({ leftSending: false, leftText: "", leftYes: true }));

    time += TOC_MOVE_MS + TOC_STEP_MS;
    at(time, () => set({ stage: "history" }));

    time += TOC_MOVE_MS + TOC_PAUSE_MS * 2;
    time += TOC_REST_MS;
    time = typeInto(ASK, "askText", time);
    time += TOC_BEAT_MS;
    at(time, () => set({ askSending: true }));
    time += TOC_PRESS_HOLD_MS;
    at(time, () => set({ askSending: false, askText: "", askShown: true }));

    time += TOC_MOVE_MS + TOC_STEP_MS;
    at(time, () => set({ replyShown: true }));

    time += TOC_MOVE_MS + TOC_STEP_MS;
    time = typeInto(YES, "midText", time);
    time += TOC_BEAT_MS;
    at(time, () => set({ midSending: true }));
    time += TOC_PRESS_HOLD_MS;
    at(time, () => set({ midSending: false, midText: "", midYes: true }));

    time += TOC_MOVE_MS + TOC_STEP_MS;
    at(time, () => set({ choicesShown: true }));

    time += TOC_MOVE_MS + TOC_HOLD_MS;
    at(time, () => setRun((value) => value + 1));

    return () => {
      window.cancelAnimationFrame(startFrame);
      window.cancelAnimationFrame(release);
      timers.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [seen, run, reduced]);

  const beat = view.choicesShown
    ? "choices"
    : view.midYes
      ? "mid-yes"
      : view.replyShown
        ? "reply"
        : view.askShown
          ? "asked"
          : view.stage === "history"
            ? "history"
            : view.leftYes
              ? "yes"
              : "chat";

  return (
    <div
      ref={rootRef}
      className="toc-product hto-product"
      data-visual="history-to-overdraft"
      data-beat={beat}
      data-snap={snap ? "true" : undefined}
    >
      <div className="hto-window">
        <section className="hto-chat" aria-label="Conversation after the policy is generated">
          <div className="hto-feed">
            <ThreadMessage shown size="chip">
              <FileChip />
            </ThreadMessage>
            <ThreadMessage shown size="note">
              <div className="dec-agent-message">
                <p className="dec-agent">
                  <span className="toc-sr">Agent. </span>
                  Setup is finished. Check this policy against last year&rsquo;s requests?
                </p>
                <MessageActions />
              </div>
            </ThreadMessage>
            <ThreadMessage shown={view.leftYes} size="yes">
              <p className="dec-admin">Yes</p>
            </ThreadMessage>
            <ThreadMessage shown={view.askShown} size="ask">
              <p className="dec-admin">{ASK}</p>
            </ThreadMessage>
            <ThreadMessage shown={view.replyShown} size="reply">
              <div className="dec-agent-message">
                <p className="dec-agent">
                  <span className="toc-sr">Agent. </span>
                  Your current policy doesn&rsquo;t have a solution.
                </p>
                <p className="dec-agent">Do you want me to provide options?</p>
              </div>
            </ThreadMessage>
            <ThreadMessage shown={view.midYes} size="yes">
              <p className="dec-admin">Yes</p>
            </ThreadMessage>
            <ThreadMessage shown={view.choicesShown} size="choices">
              <Choices />
            </ThreadMessage>
          </div>
          <Composer
            text={view.leftText || view.askText || view.midText}
            sending={view.leftSending || view.askSending || view.midSending}
          />
        </section>

        <div className="hto-stage">
          <article
            className="dec-result hto-panel hto-history"
            data-state={view.stage === "history" ? "current" : "hidden"}
            aria-label="Report from last year's requests"
            aria-hidden={view.stage === "history" ? undefined : true}
          >
            <header className="dec-titlebar">
              <p className="dec-titlebar-name">History Data Test</p>
              <span className="dec-titlebar-actions">
                <span className="dec-titlebar-settings">
                  <ExpandIcon />
                  <span className="toc-sr">Expand</span>
                </span>
                <span className="dec-titlebar-settings">
                  <SidebarIcon />
                  <span className="toc-sr">Open sidebar</span>
                </span>
              </span>
            </header>
            <div className="dec-result-body hto-report">
              <LastYearReport />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

function ThreadMessage({
  shown,
  size,
  children,
}: {
  shown: boolean;
  size: "chip" | "note" | "yes" | "ask" | "reply" | "choices";
  children: ReactNode;
}) {
  return (
    <div className="hto-message" data-size={size} data-state={shown ? "current" : "hidden"} aria-hidden={shown ? undefined : true}>
      {children}
    </div>
  );
}

function Composer({ text, sending }: { text: string; sending: boolean }) {
  const isTyping = text.length > 0;
  return (
    <div className="dec-composer" aria-label="Message">
      <p className={isTyping ? "hto-typed" : "dec-composer-hint"}>
        {isTyping ? text : "Ask about this policy"}
        {isTyping ? <span className="hto-caret" aria-hidden="true" /> : null}
      </p>
      <div className="dec-composer-bar">
        <span className="dec-composer-plus" aria-hidden="true">
          <svg viewBox="0 0 16 16" className="dec-composer-icon">
            <path d="M8 3.5v9M3.5 8h9" />
          </svg>
        </span>
        <span className="dec-composer-send hto-send" data-pressed={sending ? "true" : undefined} aria-hidden="true">
          <svg viewBox="0 0 16 16" className="dec-composer-icon">
            <path d="M8 12.5V3.8M8 3.8 4.6 7.2M8 3.8l3.4 3.4" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function FileChip() {
  return (
    <div className="dec-generated">
      <svg className="dec-generated-mark" viewBox="0 0 16 20" aria-hidden="true">
        <path d="M3 1.5h7L13.5 5V18.5H3z" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M10 1.5V5h3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <span className="dec-generated-copy">
        <span className="dec-generated-name">Sales PTO policy</span>
        <span className="dec-generated-state">Unpublished</span>
      </span>
    </div>
  );
}

function MessageActions() {
  return (
    <div className="dec-actions" aria-label="Message actions">
      <span className="dec-action">
        <CopyIcon />
        <span className="toc-sr">Copy</span>
      </span>
      <span className="dec-action">
        <ThumbUpIcon />
        <span className="toc-sr">Good</span>
      </span>
      <span className="dec-action">
        <ThumbDownIcon />
        <span className="toc-sr">Bad</span>
      </span>
      <span className="dec-action">
        <RetryIcon />
        <span className="toc-sr">Try again</span>
      </span>
    </div>
  );
}

function Choices() {
  return (
    <div className="dec-options" aria-label="Ways to handle this case">
      <ul className="xp-choices">
        {CHOICES.map((choice) => {
          const isChosen = choice === CHOSEN;
          return (
            <li key={choice} className="xp-choice" data-chosen={isChosen ? "true" : undefined}>
              <span className="xp-radio" aria-hidden="true" />
              <span>{choice}</span>
              {isChosen ? <span className="toc-sr">, selected</span> : null}
            </li>
          );
        })}
      </ul>
      <div className="xp-card-foot">
        <p className="xp-check">
          <span className="xp-checkbox" aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <path d="M4 8.5l2.5 2.5L12 5.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
          <span>Apply to future cases</span>
          <span className="toc-sr">, checked</span>
        </p>
        <span className="xp-solid">Confirm</span>
      </div>
    </div>
  );
}

function ActionIcon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="dec-action-icon">
      {children}
    </svg>
  );
}

function CopyIcon() {
  return (
    <ActionIcon>
      <path d="M6 6.25h6.25V12.5H6z" />
      <path d="M3.75 9.75V4.25c0-.28.22-.5.5-.5H9.5" />
    </ActionIcon>
  );
}

function ThumbUpIcon() {
  return (
    <ActionIcon>
      <path d="M6.25 7.25 8 3.75c.35-.7 1.4-.45 1.4.4V7.1h2.35c.65 0 1.15.58 1.05 1.22l-.65 3.05c-.1.48-.52.88-1.01.88H6.25" />
      <path d="M3.5 7.25h2.75V12.25H3.5z" />
    </ActionIcon>
  );
}

function ThumbDownIcon() {
  return (
    <ActionIcon>
      <path d="M6.25 8.75 8 12.25c.35.7 1.4.45 1.4-.4V8.9h2.35c.65 0 1.15-.58 1.05-1.22l-.65-3.05c-.1-.48-.52-.88-1.01-.88H6.25" />
      <path d="M3.5 8.75h2.75V3.75H3.5z" />
    </ActionIcon>
  );
}

function ExpandIcon() {
  return (
    <ActionIcon>
      <path d="M4.5 11.5 11.5 4.5" />
      <path d="M6.4 4.5H11.5V9.6" />
    </ActionIcon>
  );
}

function SidebarIcon() {
  return (
    <ActionIcon>
      <path d="M3.4 4.4h9.2a.8.8 0 0 1 .8.8v5.6a.8.8 0 0 1-.8.8H3.4a.8.8 0 0 1-.8-.8V5.2a.8.8 0 0 1 .8-.8Z" />
      <path d="M6.2 4.4v7.2" />
    </ActionIcon>
  );
}

function RetryIcon() {
  return (
    <ActionIcon>
      <path d="M13 8.25a5 5 0 1 1-1.46-3.54" />
      <path d="M11.4 2.4v3.1H8.3" />
    </ActionIcon>
  );
}
