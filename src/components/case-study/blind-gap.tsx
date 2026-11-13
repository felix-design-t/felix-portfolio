"use client";

import { useEffect, useRef, useState } from "react";
import { TOC_MOVE_MS, TOC_PAUSE_MS } from "./toc-motion";
import "./blind-gap.css";

/**
 * Accrued and earned.
 *
 * A chart on the case-study frame, not a product screen.
 * Across is days employed. Up is days of time off, 0 to 5.
 *
 * Accrued stays flat, then eases up by 14/12 days around each 30th day.
 * Earned uses those same rises, but the first one is on day 90.
 * The violet area is accrued. The blue area is earned.
 * Both sit directly on the matte placeholder.
 *
 * The story plays once: the policy, then accrued, then earned.
 * It stays on that last frame. Reduced motion shows it immediately.
 */

/** Last beat. Reduced motion jumps here and stays. */
const LAST_STEP = 3;

/** Days across the chart. Ticks are every 30 days, through 120. */
const AXIS_DAYS = 150;
/** Top of the vertical scale. A later step may pass it and get clipped. */
const SCALE = 5;
/** One month of a 14-day year. Added as a step, not spread along the slope. */
const PER_MONTH = 14 / 12;

const X_TICKS = [30, 60, 90, 120];
const Y_TICKS = [0, 1, 2, 3, 4, 5];

/** Days the balance rises. Accrued starts on day 30. Earned starts on day 90. */
const ACCRUED_RISES = [30, 60, 90, 120];
const EARNED_RISES = [90, 120];
/** Days each rise takes. Short, so the flat month on either side still shows. */
const RAMP_DAYS = 12;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function shown(step: number, beat: number): "true" | "false" {
  return step >= beat ? "true" : "false";
}

/** A day, as a percentage across the drawing area after the y-axis gutter. */
function dayLeft(day: number): string {
  return `calc(var(--y-gutter) + (100% - var(--y-gutter)) * ${day} / ${AXIS_DAYS})`;
}

/**
 * Chart y. The viewBox puts 5 days at the top and 0 at the bottom,
 * so a higher balance is a smaller SVG y.
 */
function chartY(value: number): number {
  return SCALE - value;
}

/** Ease used inside one rise. Slow at both ends, so the corner is round. */
function smoothRise(progress: number): number {
  const t = Math.min(1, Math.max(0, progress));
  return t * t * (3 - 2 * t);
}

/**
 * Flat between rise days, with a short eased climb centered on each one.
 * Accrued also draws the flat run from day 0 up to its first rise.
 */
function stepPoints(riseDays: number[], fromZero: boolean): string {
  const points: string[] = [];
  const half = RAMP_DAYS / 2;
  let value = 0;
  if (fromZero) points.push(`0,${chartY(0)}`);

  riseDays.forEach((day) => {
    const start = day - half;
    const end = Math.min(AXIS_DAYS, day + half);
    points.push(`${start},${chartY(value)}`);
    const samples = 8;
    for (let i = 1; i <= samples; i += 1) {
      const x = start + ((end - start) * i) / samples;
      const progress = (x - (day - half)) / RAMP_DAYS;
      points.push(`${x},${chartY(value + PER_MONTH * smoothRise(progress))}`);
    }
    value += PER_MONTH;
  });

  points.push(`${AXIS_DAYS},${chartY(value)}`);
  return points.join(" ");
}

/** The staircase, closed down to the zero line so the area can fill it. */
function stepArea(points: string): string {
  const pairs = points.split(" ");
  const firstX = pairs[0].split(",")[0];
  const lastX = pairs[pairs.length - 1].split(",")[0];
  return `M ${firstX},${SCALE} L ${pairs.join(" L ")} L ${lastX},${SCALE} Z`;
}

const accruedLine = stepPoints(ACCRUED_RISES, true);
const earnedLine = stepPoints(EARNED_RISES, false);

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
    const parkFrame = window.requestAnimationFrame(() => {
      setSnap(true);
      setStep(0);
      releaseFrame = window.requestAnimationFrame(() => {
        setSnap(false);
        startFrame = window.requestAnimationFrame(() => {
          setStep(1);
          const accruedAtMs = TOC_MOVE_MS;
          const earnedAtMs = accruedAtMs + TOC_PAUSE_MS;
          timers.push(window.setTimeout(() => setStep(2), accruedAtMs));
          timers.push(window.setTimeout(() => setStep(3), earnedAtMs));
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
        90-day wait, 14 days a year, accrued and earned monthly. Accrued eases
        up by 14/12 days around every 30th day. Earned takes those same rises
        starting at day 90.
      </p>

      <div className="blind-gap-inner">
        <p className="blind-gap-policy" data-shown={shown(frameStep, 1)}>
          90-day wait, 14 days a year, accrued and earned monthly.
        </p>

        <ul className="blind-gap-legend">
          <li data-shown={shown(frameStep, 2)}>
            <span className="blind-gap-swatch" data-mark="accrued" aria-hidden="true" />
            Accrued
          </li>
          <li data-shown={shown(frameStep, 3)}>
            <span className="blind-gap-swatch" data-mark="earned" aria-hidden="true" />
            Earned
          </li>
        </ul>

        <div className="blind-gap-plot">
          {Y_TICKS.map((tick) => (
            <span
              key={tick}
              className="blind-gap-ytick"
              style={{
                top: `calc(var(--plot-top) + (100% - var(--plot-top) - var(--plot-bottom)) * ${(SCALE - tick) / SCALE})`,
              }}
            >
              {tick}
            </span>
          ))}

          <svg
            className="blind-gap-chart"
            viewBox={`0 0 ${AXIS_DAYS} ${SCALE}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {Y_TICKS.map((tick) => (
              <line
                key={tick}
                className="blind-gap-grid"
                x1={0}
                x2={AXIS_DAYS}
                y1={chartY(tick)}
                y2={chartY(tick)}
              />
            ))}
            <g className="blind-gap-accrued" data-shown={shown(frameStep, 2)}>
              <path className="blind-gap-accrued-area" d={stepArea(accruedLine)} />
              <polyline className="blind-gap-accrued-line" points={accruedLine} />
            </g>
            <g className="blind-gap-earned" data-shown={shown(frameStep, 3)}>
              <path className="blind-gap-earned-area" d={stepArea(earnedLine)} />
              <polyline className="blind-gap-earned-line" points={earnedLine} />
            </g>
          </svg>

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
