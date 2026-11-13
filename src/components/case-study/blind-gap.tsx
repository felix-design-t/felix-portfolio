"use client";

import { useEffect, useRef, useState } from "react";
import { TOC_MOVE_MS, TOC_PAUSE_MS, TOC_REST_MS } from "./toc-motion";
import "./blind-gap.css";

/**
 * Blind gap.
 *
 * A timeline, like a chart in the margin of the case study, not a
 * product screen. Days run left to right. The balance is the line.
 *
 * The story plays once, in this order:
 *   1. Policy confirmed (day 0)
 *   2. The quiet 90-day wait, balance flat at 0
 *   3. The balance steps up to about 1 day
 *   4. A 5-day request, and the rose gap that is 4 days short
 *   5. Two outcomes, neither one chosen
 *   6. A payroll flag, 6 weeks later, when the admin finds out
 *
 * It plays once and stays on the last frame. Reduced motion shows that frame.
 */

/** Last beat. Reduced motion jumps here and stays. */
const LAST_STEP = 6;

/** Axis length in days. Day 0 is "Policy confirmed". The story ends after day 133. */
const AXIS_DAYS = 150;

const TICKS = [30, 60, 90, 120];

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** "true" once the playhead has reached this beat. */
function shown(step: number, beat: number): "true" | "false" {
  return step >= beat ? "true" : "false";
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

          // The wait is the long beat: the band draws, then sits still
          // before the balance is allowed to step.
          const waitAt = TOC_MOVE_MS;
          const stepAt = waitAt + TOC_PAUSE_MS + TOC_REST_MS;
          const requestAt = stepAt + TOC_MOVE_MS;
          const outcomesAt = requestAt + TOC_MOVE_MS;
          const foundAt = outcomesAt + TOC_MOVE_MS;

          timers.push(window.setTimeout(() => setStep(2), waitAt));
          timers.push(window.setTimeout(() => setStep(3), stepAt));
          timers.push(window.setTimeout(() => setStep(4), requestAt));
          timers.push(window.setTimeout(() => setStep(5), outcomesAt));
          timers.push(window.setTimeout(() => setStep(6), foundAt));
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
        Policy confirmed. 90-day wait, 14 days a year, earned monthly. The
        balance stays at 0 through the wait, then rises to about 1 day at day
        91. A request for 5 days is 4 days short. The outcome is ambiguous:
        approved with balance minus 4, or denied with no reason shown. A
        payroll flag shows the admin finds out 6 weeks later.
      </p>

      <div className="blind-gap-inner">
        <p className="blind-gap-policy" data-shown={shown(frameStep, 1)}>
          90-day wait, 14 days a year, earned monthly.
        </p>

        <div className="blind-gap-plot">
          <p className="blind-gap-confirmed" data-shown={shown(frameStep, 1)}>
            Policy confirmed
          </p>

          <div className="blind-gap-band" data-shown={shown(frameStep, 2)}>
            <div className="blind-gap-band-fill" />
            <span className="blind-gap-band-label">90-day wait</span>
          </div>

          {/*
            Balance. Flat at 0 through day 91, then a step up to 1 day.
            The rose column later stands on that step and reaches 5 days.
          */}
          <div className="blind-gap-flat" data-shown={shown(frameStep, 2)} aria-hidden="true" />
          <div className="blind-gap-rise" data-shown={shown(frameStep, 3)} aria-hidden="true" />
          <div className="blind-gap-level" data-shown={shown(frameStep, 3)} aria-hidden="true" />

          <div className="blind-gap-rose" data-shown={shown(frameStep, 4)} aria-hidden="true">
            <div className="blind-gap-rose-fill" />
          </div>
          <p className="blind-gap-short" data-shown={shown(frameStep, 4)}>
            4 days short
          </p>

          <div className="blind-gap-weeks" data-shown={shown(frameStep, 6)}>
            <span className="blind-gap-weeks-line" aria-hidden="true" />
            <span className="blind-gap-weeks-label">6 weeks later</span>
          </div>

          <div className="blind-gap-admin" data-shown={shown(frameStep, 6)}>
            <p className="blind-gap-admin-copy">
              <span className="blind-gap-admin-label">Admin finds out</span>
              <span className="blind-gap-flag">Payroll flag</span>
            </p>
            <span className="blind-gap-admin-dot" aria-hidden="true" />
            <span className="blind-gap-admin-stem" aria-hidden="true" />
          </div>

          <div className="blind-gap-axis" aria-hidden="true">
            {TICKS.map((tick) => (
              <span
                key={tick}
                className="blind-gap-tick"
                style={{ left: `${(tick / AXIS_DAYS) * 100}%` }}
              >
                {tick}
              </span>
            ))}
          </div>
        </div>

        <div className="blind-gap-outcomes" data-shown={shown(frameStep, 5)}>
          <p className="blind-gap-outcome">Approved, balance −4</p>
          <p className="blind-gap-outcome">Denied, no reason shown</p>
        </div>
      </div>
    </div>
  );
}
