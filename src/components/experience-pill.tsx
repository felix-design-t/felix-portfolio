"use client";

import { useEffect, useState } from "react";
import { experienceStartedOn } from "@/content/site";

/**
 * The experience chip is a small live counter.
 * Think of it like a status badge in a component: the badge shows the
 * coarse reading (years and months), and hovering it opens the full timer.
 * Both readings start at February 1, 2023. The badge only changes when a
 * new month begins. The timer underneath keeps counting every second.
 */

const clockUnits = [
  { key: "years", label: "Yrs" },
  { key: "months", label: "Mths" },
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "seconds", label: "Secs" },
] as const;

type ElapsedTime = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function ExperiencePill() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timerId);
  }, []);

  const elapsed = getElapsedTime(now);
  const label = formatExperienceLabel(elapsed);

  return (
    <span className="experience-anchor">
      <button
        type="button"
        className="skill-pill"
        aria-describedby="experience-clock"
      >
        <ExperienceIcon />
        <span suppressHydrationWarning>{label}</span>
      </button>
      <span id="experience-clock" className="experience-clock" role="tooltip">
        {clockUnits.map((unit) => {
            const value = padTwoDigits(elapsed[unit.key]);
            return (
              <span
                key={unit.key}
                className="experience-unit"
                aria-label={`${value} ${unit.label}`}
                suppressHydrationWarning
              >
                <FlipCard value={value} />
                <span className="experience-unit-label" aria-hidden="true">
                  {unit.label}
                </span>
              </span>
            );
          })}
      </span>
    </span>
  );
}

function getElapsedTime(now: Date): ElapsedTime {
  const start = new Date(
    experienceStartedOn.year,
    experienceStartedOn.month - 1,
    experienceStartedOn.day,
  );

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  let hours = now.getHours() - start.getHours();
  let minutes = now.getMinutes() - start.getMinutes();
  let seconds = now.getSeconds() - start.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    const daysInPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
    ).getDate();
    days += daysInPreviousMonth;
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return { years, months, days, hours, minutes, seconds };
}

function formatExperienceLabel(elapsed: ElapsedTime): string {
  const parts = [
    formatUnit(elapsed.years, "year"),
    formatUnit(elapsed.months, "month"),
  ].filter((part) => part !== "");

  return parts.join(" ");
}

function formatUnit(amount: number, word: string): string {
  if (amount === 0) return "";
  return `${amount} ${word}${amount === 1 ? "" : "s"}`;
}

function padTwoDigits(amount: number): string {
  return String(amount).padStart(2, "0");
}

/** Matches the CSS flap timing, so the old number leaves when the fold ends. */
const flipDurationMs = 460;

/**
 * One black tile. Like a desk calendar: the top sheet hinges at the
 * middle and falls onto the bottom, and the next number is underneath.
 */
function FlipCard({ value }: { value: string }) {
  const [settled, setSettled] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (value === settled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSettled(value);
      return;
    }

    setIsFlipping(true);
    const timerId = window.setTimeout(() => {
      setSettled(value);
      setIsFlipping(false);
    }, flipDurationMs);
    return () => window.clearTimeout(timerId);
  }, [value, settled]);

  const nextValue = isFlipping ? value : settled;

  return (
    <span className="experience-card" suppressHydrationWarning>
      <span className="experience-face experience-face-top" aria-hidden="true">
        <span suppressHydrationWarning>{nextValue}</span>
      </span>
      <span className="experience-face experience-face-bottom" aria-hidden="true">
        <span suppressHydrationWarning>{settled}</span>
      </span>
      {isFlipping ? (
        <>
          <span className="experience-flap experience-flap-top" aria-hidden="true">
            <span>{settled}</span>
          </span>
          <span className="experience-flap experience-flap-bottom" aria-hidden="true">
            <span>{value}</span>
          </span>
        </>
      ) : null}
      <span className="experience-card-hinge" aria-hidden="true" />
    </span>
  );
}

function ExperienceIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="skill-pill-icon">
      <rect x="2.4" y="3.2" width="11.2" height="10" rx="1.2" />
      <path d="M2.4 6.4h11.2M5.2 2.2v2.2M10.8 2.2v2.2" />
    </svg>
  );
}
