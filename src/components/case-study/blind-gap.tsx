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
 * Accrued climbs 1.167 days every 30 days, from day 0.
 * Earned uses that same pace, but it does not start until day 60.
 * The blue area is accrued. The rose area is earned.
 * Both sit directly on the matte placeholder.
 *
 * The story plays once: the policy, then accrued, then earned.
 * It stays on that last frame. Reduced motion shows it immediately.
 */

/** Last beat. Reduced motion jumps here and stays. */
const LAST_STEP = 3;

/** Days across the chart. Ticks are every 30 days, through 120. */
const AXIS_DAYS = 150;
/** Top of the vertical scale. Accrued stops when it reaches this. */
const SCALE = 5;
/** Days added every 30 days. 14 days a year, spread across 12 months. */
const PER_MONTH = 1.167;
const MONTH_DAYS = 30;
/** Earned waits until this day, then follows the accrued pace. */
const EARN_START = 60;

const X_TICKS = [30, 60, 90, 120];
const Y_TICKS = [0, 1, 2, 3, 4, 5];

/** Day the accrued line reaches 5. It stops there instead of running off the scale. */
const ACCRUED_TOP = (SCALE / PER_MONTH) * MONTH_DAYS;
/** Samples along the accrued line. A steady rate, so these points are one slope. */
const ACCRUED_DAYS = [0, 30, 60, 90, 120, ACCRUED_TOP];
/** Earned is flat until day 60, then the same slope. */
const EARNED_DAYS = [60, 90, 120, 150];

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

/** Days of time off accrued by this day employed. */
function accruedAt(day: number): number {
  return (day / MONTH_DAYS) * PER_MONTH;
}

/** Days earned. Nothing until day 60, then the accrued rate. */
function earnedAt(day: number): number {
  if (day <= EARN_START) return 0;
  return ((day - EARN_START) / MONTH_DAYS) * PER_MONTH;
}

/**
 * Chart y. The viewBox puts 5 days at the top and 0 at the bottom,
 * so a higher balance is a smaller SVG y.
 */
function chartY(value: number): number {
  return SCALE - value;
}

function linePoints(days: number[], valueAt: (day: number) => number): string {
  return days.map((day) => `${day},${chartY(valueAt(day))}`).join(" ");
}

/** Area from the zero line up to the series. */
function areaPath(days: number[], valueAt: (day: number) => number): string {
  const top = days.map((day) => `${day},${chartY(valueAt(day))}`).join(" L ");
  const start = days[0];
  const end = days[days.length - 1];
  return `M ${start},${SCALE} L ${top} L ${end},${SCALE} Z`;
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
        60-day wait, 14 days a year, accrued and earned monthly. Accrued rises
        by 1.167 days every 30 days from day 0. Earned follows the same pace
        starting at day 60.
      </p>

      <div className="blind-gap-inner">
        <p className="blind-gap-policy" data-shown={shown(frameStep, 1)}>
          60-day wait, 14 days a year, accrued and earned monthly.
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
              <path className="blind-gap-accrued-area" d={areaPath(ACCRUED_DAYS, accruedAt)} />
              <polyline className="blind-gap-accrued-line" points={linePoints(ACCRUED_DAYS, accruedAt)} />
            </g>
            <g className="blind-gap-earned" data-shown={shown(frameStep, 3)}>
              <path className="blind-gap-earned-area" d={areaPath(EARNED_DAYS, earnedAt)} />
              <polyline className="blind-gap-earned-line" points={linePoints(EARNED_DAYS, earnedAt)} />
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
