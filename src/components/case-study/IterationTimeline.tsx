"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import "./iteration-timeline.css";

export type TimelineImage = {
  src: string;
  alt: string;
  /** Real pixel size. Reserves the space so nothing jumps while loading. */
  width: number;
  height: number;
};

export type TimelineStep =
  | {
      kind: "iteration";
      /** One image is full width. Two sit side by side. */
      images: TimelineImage[];
      /** Marks the last step: violet node and a small "Final" tag. */
      final?: boolean;
    }
  | {
      kind: "reflection";
      title: string;
      body: string;
    };

type IterationTimelineProps = {
  steps: TimelineStep[];
  /** Small tag shown on the final step. */
  finalLabel?: string;
};

/** Where on the screen the violet line should reach, as a share of the window height. */
const FILL_ANCHOR = 0.6;

/**
 * A vertical timeline of design iterations and the reflections between them.
 *
 * Think of a git history: a line down the left, one node per step.
 * Iteration steps show screens on a soft card. Reflection steps are
 * lighter callouts that explain why the next iteration changed.
 *
 * Motion: each step fades in as it scrolls into view, and a violet
 * line fills down to the point you have scrolled to. With reduced
 * motion on, everything shows in its end state.
 * All copy and image paths are passed in. Nothing is written here.
 */
export function IterationTimeline({
  steps,
  finalLabel = "Final",
}: IterationTimelineProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const stepElements = Array.from(
      root.querySelectorAll<HTMLElement>(".timeline-step"),
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Measure where the line starts and ends: the first and last node centers.
    let lineStart = 0;
    let lineLength = 0;
    const measure = () => {
      const nodes = root.querySelectorAll<HTMLElement>(".timeline-node");
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (!first || !last) return;
      // A node sits inside its step, and the step sits inside the list.
      // offsetTop ignores the slide-up transform, so the line stays put.
      const centerInList = (node: HTMLElement) =>
        (node.offsetParent as HTMLElement).offsetTop +
        node.offsetTop +
        node.offsetHeight / 2;
      const firstCenter = centerInList(first);
      const lastCenter = centerInList(last);
      lineStart = firstCenter;
      lineLength = Math.max(lastCenter - firstCenter, 0);
      root.style.setProperty("--timeline-start", `${lineStart}px`);
      root.style.setProperty("--timeline-length", `${lineLength}px`);
    };

    const setFill = (pixels: number) => {
      root.style.setProperty("--timeline-fill", `${pixels}px`);
    };

    measure();
    root.dataset.ready = "true";

    // Images load after the first measure and change the step heights.
    const sizeObserver = new ResizeObserver(() => {
      measure();
      if (reduceMotion) setFill(lineLength);
      else requestFill();
    });
    sizeObserver.observe(root);

    if (reduceMotion) {
      stepElements.forEach((element) => {
        element.dataset.visible = "true";
      });
      setFill(lineLength);
      const onResize = () => {
        measure();
        setFill(lineLength);
      };
      window.addEventListener("resize", onResize);
      return () => {
        sizeObserver.disconnect();
        window.removeEventListener("resize", onResize);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    stepElements.forEach((element) => observer.observe(element));

    let frame = 0;
    const updateFill = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const anchor = window.innerHeight * FILL_ANCHOR;
      const reached = anchor - (rect.top + lineStart);
      setFill(Math.min(Math.max(reached, 0), lineLength));
    };
    const requestFill = () => {
      if (!frame) frame = requestAnimationFrame(updateFill);
    };
    const onResize = () => {
      measure();
      requestFill();
    };

    updateFill();
    window.addEventListener("scroll", requestFill, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizeObserver.disconnect();
      window.removeEventListener("scroll", requestFill);
      window.removeEventListener("resize", onResize);
    };
  }, [steps.length]);

  let iterationCount = 0;
  let reflectionCount = 0;

  return (
    <div className="iteration-timeline" ref={rootRef}>
      <ol className="timeline-steps">
        {steps.map((step, index) => {
          const isIteration = step.kind === "iteration";
          const position = isIteration ? ++iterationCount : ++reflectionCount;
          const label = `${isIteration ? "Iteration" : "Reflection"} ${String(
            position,
          ).padStart(2, "0")}`;
          const isFinal = isIteration && step.final === true;

          return (
            <li
              className="timeline-step"
              key={index}
              data-kind={step.kind}
              data-final={isFinal ? "true" : undefined}
              style={{ "--timeline-delay": "0ms" } as CSSProperties}
            >
              <span className="timeline-node" aria-hidden="true" />
              <div className="timeline-content">
                <p className="timeline-label">
                  {label}
                  {isFinal ? (
                    <span className="timeline-tag">{finalLabel}</span>
                  ) : null}
                </p>

                {step.kind === "iteration" ? (
                  <div
                    className="timeline-images"
                    data-count={step.images.length}
                  >
                    {step.images.map((image) => (
                      <img
                        key={image.src}
                        src={image.src}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        draggable={false}
                        loading="lazy"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="timeline-callout">
                    <h4 className="timeline-callout-title">{step.title}</h4>
                    <p className="timeline-callout-body">{step.body}</p>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
