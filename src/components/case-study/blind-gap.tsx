"use client";

import { useEffect, useRef, useState } from "react";
import { TOC_MOVE_MS, TOC_PAUSE_MS } from "./toc-motion";
import "./blind-gap.css";

/**
 * Blind gap.
 *
 * A chart on the case-study page, not a product screen.
 * Across is days employed. Up is days of time off.
 *
 * The policy earns about 1.2 days a month, and only after the
 * 90-day wait. The first credit lands one month later, near day 120.
 * On day 91 the balance is still 0. A request for 5 days that day
 * is the whole failure: a rose gap from 0 up to 5.
 *
 * The story plays once:
 *   1. The policy
 *   2. The 90-day wait
 *   3. Days earned, flat at 0 through day 120
 *   4. The first credit, about 1.2 days
 *   5. The request at day 91, and the 5-day gap
 *
 * It stays on that last frame. Reduced motion shows it immediately.
 */

/** Last beat. Reduced motion jumps here and stays. */
const LAST_STEP = 5;

/** Axis length in days employed. Ticks stop at 120; the line may run to the end. */
const AXIS_DAYS = 150;

const X_TICKS = [30, 60, 90, 120];

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** "true" once the playhead has reached this beat. */
function shown(step: number, beat: number): "true" | "false" {
  return step >= beat ? "true" : "false";
}

/** A day, as a percentage across the drawing area (after the y-axis gutter). */
function dayLeft(day: number): string {
  return `calc(var(--y-gutter) + (100% - var(--y-gutter)) * ${day} / ${AXIS_DAYS})`;
}

export function BlindGap() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [snap, setSnap] = useState(false);
  const [seen, setSeen] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    const frame = window.requestAnimationFrame(apply);
    media.addEventListener("change", apply);
    return () => {
      window.cancelAnimationFrame(frame);
      media.removeEventListener("change", apply);
    };
  }, []);

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

  useEffect(() => {
    if (!seen || reduced || prefersReducedMotion()) return;

    const timers: number[] = [];
    let releaseFrame = 0;
    let startFrame = 0;
    // Start from an empty chart, with no transition, then play forward once.
    const parkFrame = window.requestAnimationFrame(() => {
      setSnap(true);
      setStep(0);
      releaseFrame = window.requestAnimationFrame(() => {
        setSnap(false);
        startFrame = window.requestAnimationFrame(() => {
          setStep(1);

          const waitAt = TOC_MOVE_MS;
          const earnedAt = waitAt + TOC_PAUSE_MS;
          const creditAt = earnedAt + TOC_MOVE_MS;
          const requestAt = creditAt + TOC_MOVE_MS;

          timers.push(window.setTimeout(() => setStep(2), waitAt));
          timers.push(window.setTimeout(() => setStep(3), earnedAt));
          timers.push(window.setTimeout(() => setStep(4), creditAt));
          timers.push(window.setTimeout(() => setStep(5), requestAt));
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(parkFrame);
      window.cancelAnimationFrame(releaseFrame);
      window.cancelAnimationFrame(startFrame);
      timers.forEach((timerId) => window.clearTimeout(timerId));
    };
  }, [seen, reduced]);

  // Reduced motion holds the finished chart. The playhead above is ignored.
  const frameStep = reduced ? LAST_STEP : step;

  return (
    <div
      ref={rootRef}
      className="blind-gap"
      data-visual="blind-gap"
      data-step={frameStep}
      data-snap={snap ? "true" : undefined}
    >
      <p className="blind-gap-sr">
        90-day wait, 14 days a year, earned monthly. Days earned stay at 0
        through day 120, then step to about 1.2. A request for 5 days on day
        91 is 5 days short.
      </p>

      <div className="blind-gap-inner">
        <p className="blind-gap-policy" data-shown={shown(frameStep, 1)}>
          90-day wait, 14 days a year, earned monthly.
        </p>

        <ul className="blind-gap-legend">
          <li data-shown={shown(frameStep, 3)}>
            <span className="blind-gap-swatch" data-mark="earned" aria-hidden="true" />
            Earned
          </li>
          <li data-shown={shown(frameStep, 5)}>
            <span className="blind-gap-swatch" data-mark="requested" aria-hidden="true" />
            Requested
          </li>
        </ul>

        <div className="blind-gap-plot">
          <span className="blind-gap-ytick" data-value="5">
            5
          </span>
          <span className="blind-gap-ytick" data-value="0">
            0
          </span>

          <div className="blind-gap-band" data-shown={shown(frameStep, 2)}>
            <div className="blind-gap-band-fill" />
            <span className="blind-gap-band-label">90-day wait</span>
          </div>

          {/*
            Earned days. Flat at 0 until day 120, then one step to about
            1.2. That is 1.2 / 5 of the chart height.
          */}
          <div className="blind-gap-flat" data-shown={shown(frameStep, 3)} aria-hidden="true" />
          <div className="blind-gap-rise" data-shown={shown(frameStep, 4)} aria-hidden="true" />
          <div className="blind-gap-level" data-shown={shown(frameStep, 4)} aria-hidden="true" />

          <div className="blind-gap-rose" data-shown={shown(frameStep, 5)} aria-hidden="true">
            <div className="blind-gap-rose-fill" />
          </div>
          <span className="blind-gap-request" data-shown={shown(frameStep, 5)} aria-hidden="true" />
          <p className="blind-gap-short" data-shown={shown(frameStep, 5)}>
            5 days short
          </p>

          <div className="blind-gap-axis" aria-hidden="true">
            {X_TICKS.map((tick) => (
              <span key={tick} className="blind-gap-tick" style={{ left: dayLeft(tick) }}>
                {tick}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
