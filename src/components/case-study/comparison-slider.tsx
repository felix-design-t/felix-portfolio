"use client";

import { useCallback, useRef, useState, type PointerEvent, type KeyboardEvent } from "react";
import "./comparison-slider.css";

type ComparisonSliderProps = {
  /** Picture revealed to the left of the divider. */
  beforeSrc: string;
  /** Picture revealed to the right of the divider. */
  afterSrc: string;
  beforeLabel: string;
  afterLabel: string;
};

/** Where the divider starts: half of each picture. */
const START_PERCENT = 50;
/** One arrow key moves the divider by this much of the width. */
const KEY_STEP = 5;

/**
 * A before/after slider.
 *
 * Think of two prints stacked in one mat. A vertical rule with a
 * round handle covers the seam. Sliding it is like moving a mask:
 * more of the left print, or more of the right one.
 */
export function ComparisonSlider({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
}: ComparisonSliderProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(START_PERCENT);

  const moveTo = useCallback((nextPosition: number) => {
    setPosition(clampPercent(nextPosition));
  }, []);

  const moveFromPointer = useCallback(
    (clientX: number) => {
      const stage = stageRef.current;
      if (!stage) return;
      const bounds = stage.getBoundingClientRect();
      if (bounds.width <= 0) return;
      const percent = ((clientX - bounds.left) / bounds.width) * 100;
      moveTo(percent);
    },
    [moveTo],
  );

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    // A secondary click should not start a drag.
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    handleRef.current?.focus();
    moveFromPointer(event.clientX);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    moveFromPointer(event.clientX);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    // Read the latest position, so a held key keeps stepping
    // instead of repeating the first move.
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPosition((current) => clampPercent(current - KEY_STEP));
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setPosition((current) => clampPercent(current + KEY_STEP));
    } else if (event.key === "Home") {
      event.preventDefault();
      setPosition(0);
    } else if (event.key === "End") {
      event.preventDefault();
      setPosition(100);
    }
  }

  const shown = Math.round(position);

  return (
    <div className="comparison-slider">
      <div className="comparison-slider-labels">
        <span className="comparison-slider-mark" data-tone="rose">
          {beforeLabel}
        </span>
        <span className="comparison-slider-mark" data-tone="violet">
          {afterLabel}
        </span>
      </div>
      <div
        ref={stageRef}
        className="comparison-slider-stage"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      >
        <img
          className="comparison-slider-image"
          src={afterSrc}
          alt=""
          width={2160}
          height={1536}
          draggable={false}
        />
        <img
          className="comparison-slider-image"
          src={beforeSrc}
          alt=""
          width={2160}
          height={1536}
          draggable={false}
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        />
        <div className="comparison-slider-divider" style={{ left: `${position}%` }}>
          <div
            ref={handleRef}
            className="comparison-slider-handle"
            role="slider"
            tabIndex={0}
            aria-label={`${beforeLabel} and ${afterLabel}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={shown}
            aria-valuetext={`${shown}%`}
            onKeyDown={onKeyDown}
          >
            <LeftRightArrows />
          </div>
        </div>
      </div>
    </div>
  );
}

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value));
}

/** Two arrows on the handle, pointing left and right. */
function LeftRightArrows() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6.25 4.25 3.25 8l3 3.75" />
      <path d="M9.75 4.25 12.75 8l-3 3.75" />
    </svg>
  );
}
