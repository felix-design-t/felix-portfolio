"use client";

import { useEffect, useRef } from "react";

/**
 * Toolkit row under Selected Work.
 * Each mark sits on a filled card so it reads on light and dark paper.
 * Hover shows the name in a chip. Nothing here opens another page.
 *
 * The hover is a dock, like the macOS icon bar.
 * The card nearest the pointer grows the most. Cards farther away grow
 * less, then not at all. Sliding along the row carries the swell with you.
 * The row is already as tall as the biggest card, so the section stays put.
 *
 * `ink` tells dark mode how to keep a dark drawing visible on a dark card:
 * - "mono" is a black mark (Notion, Cursor) and flips to white
 * - "ink" is a near-black brand color (Dovetail) and flips brightness, not hue
 */

/**
 * Feel of the dock. These are the knobs.
 * Reach is how far from the pointer a card still grows, in pixels.
 * Max is the biggest scale. 1 is the resting size.
 * Pointer follow and scale follow are how much of the remaining
 * distance each frame closes. Higher feels snappier.
 */
const dockReach = 136;
const dockMax = 1.42;
const pointerFollow = 0.48;
const scaleFollow = 0.26;
/** Resting gap between cards. Matches the 8px spacing step. */
const restGap = 8;

const tools = [
  { name: "Notion", src: "/toolkit/Notion.svg", ink: "mono" },
  { name: "Dovetail", src: "/toolkit/Dovetail.svg", ink: "ink" },
  { name: "Mixpanel", src: "/toolkit/Mixpanel.svg", ink: "color" },
  { name: "Obsidian", src: "/toolkit/Obsidian.svg", ink: "color" },
  { name: "Claude", src: "/toolkit/Claude.svg", ink: "color" },
  { name: "Figma", src: "/toolkit/Figma.svg", ink: "color" },
  { name: "Lovable", src: "/toolkit/Lovable.svg", ink: "color" },
  { name: "Cursor", src: "/toolkit/Cursor.svg", ink: "mono" },
  { name: "Vercel", src: "/toolkit/Vercel.svg", ink: "mono" },
  { name: "Github", src: "/toolkit/Github.svg", ink: "mono" },
] as const;

export function Toolkit() {
  const rowRef = useRef<HTMLUListElement>(null);
  // The pointer's latest horizontal position. Null means the pointer has left.
  const pointerX = useRef<number | null>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    // One scale per card. The loop eases these toward the pointer each frame.
    const scales = tools.map(() => 1);
    // A softened copy of the pointer, so the swell does not twitch.
    let smoothedPointer: number | null = null;
    let frame = 0;
    let running = false;

    function contentBox() {
      const styles = getComputedStyle(row!);
      const pad =
        parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
      return row!.clientWidth - pad;
    }

    /** Resting card size: the row, minus the gaps, shared evenly. */
    function restingSize(inner: number) {
      const size = (inner - restGap * (tools.length - 1)) / tools.length;
      return Math.max(size, 36);
    }

    /**
     * Scale for one card. Distance is measured to an even tick mark
     * across the row, the same way a dock spreads its influence.
     * Inside the reach, a smoothstep curve eases the growth.
     */
    function targetScales(pointer: number) {
      const rect = row!.getBoundingClientRect();
      const last = tools.length - 1;

      return tools.map((_, index) => {
        const anchor =
          last === 0
            ? rect.left + rect.width / 2
            : rect.left + (index / last) * rect.width;
        const distance = Math.abs(pointer - anchor);
        if (distance >= dockReach) return 1;

        const closeness = 1 - distance / dockReach;
        const eased = closeness * closeness * (3 - 2 * closeness);
        return 1 + eased * (dockMax - 1);
      });
    }

    /**
     * If the swollen cards would be wider than the row, shrink the
     * swell until they fit. Far cards stay at rest; only the extra grows.
     */
    function fitToRow(targets: number[], base: number, inner: number) {
      const sum = targets.reduce((total, scale) => total + scale, 0);
      const maxSum = (inner - 1) / base;
      if (sum <= maxSum) return targets;

      const extra = sum - targets.length;
      const room = maxSum - targets.length;
      if (extra <= 0 || room <= 0) return targets.map(() => 1);

      const keep = room / extra;
      return targets.map((scale) => 1 + (scale - 1) * keep);
    }

    function paint(base: number) {
      row!.style.setProperty("--toolkit-base", `${base}px`);
      const slots = row!.querySelectorAll<HTMLElement>(".toolkit-slot");
      slots.forEach((slot, index) => {
        slot.style.setProperty("--scale", scales[index].toFixed(4));
        // Bigger cards paint above their neighbors.
        slot.style.zIndex = String(Math.round(scales[index] * 10));
      });
    }

    function tick() {
      const inner = contentBox();
      const base = restingSize(inner);
      const canDock = !reduceMotion.matches && finePointer.matches;
      const pointer = canDock ? pointerX.current : null;

      let targets = scales.map(() => 1);
      if (pointer != null) {
        smoothedPointer =
          smoothedPointer == null
            ? pointer
            : smoothedPointer + (pointer - smoothedPointer) * pointerFollow;
        targets = fitToRow(targetScales(smoothedPointer), base, inner);
      } else {
        smoothedPointer = null;
      }

      let stillMoving = false;
      targets.forEach((target, index) => {
        const next = scales[index] + (target - scales[index]) * scaleFollow;
        scales[index] = Math.abs(target - next) < 0.005 ? target : next;
        if (Math.abs(scales[index] - target) >= 0.005) stillMoving = true;
      });

      paint(base);

      if (stillMoving || pointerX.current != null) {
        frame = window.requestAnimationFrame(tick);
      } else {
        running = false;
      }
    }

    function start() {
      if (running) return;
      running = true;
      frame = window.requestAnimationFrame(tick);
    }

    function followPointer(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      pointerX.current = event.clientX;
      start();
    }

    function rest() {
      pointerX.current = null;
      start();
    }

    paint(restingSize(contentBox()));

    const observer = new ResizeObserver(() => {
      paint(restingSize(contentBox()));
    });
    observer.observe(row);
    row.addEventListener("pointermove", followPointer);
    row.addEventListener("pointerleave", rest);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      row.removeEventListener("pointermove", followPointer);
      row.removeEventListener("pointerleave", rest);
    };
  }, []);

  return (
    <section className="toolkit" aria-labelledby="toolkit-heading">
      <div className="section-heading toolkit-heading">
        <h2 id="toolkit-heading">Toolkit</h2>
      </div>
      <ul ref={rowRef} className="toolkit-row">
        {tools.map((tool) => (
          <li key={tool.name} className="toolkit-slot">
            <button type="button" className="toolkit-item">
              <span className="toolkit-label">{tool.name}</span>
              <span className="toolkit-card">
                <img
                  className="toolkit-mark"
                  src={tool.src}
                  alt=""
                  data-ink={tool.ink}
                />
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="toolkit-caption">Updated until Oct 2026; Exploration Ongoing</p>
    </section>
  );
}
