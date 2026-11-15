"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import "./flow-carousel.css";

export type FlowSlide = {
  src: string;
  /** Short name under the numbered step. */
  label: string;
  /** Sentence in the row under the track. Only the active one is visible. */
  caption: string;
  /**
   * Fraction of the frame's max height. 1 is the Full Review size.
   * The picture keeps its shape inside that height.
   */
  scale?: number;
};

type FlowCarouselProps = {
  slides: FlowSlide[];
};

/**
 * A row of screens you can swipe.
 *
 * The centered slide is the current step. The one before it peeks in
 * from the left, and the one after peeks in from the right. The
 * numbered circles under the row are the only controls.
 */
/** How long each picture stays centered before autoplay moves on. */
const AUTOPLAY_DELAY_MS = 2000;

export function FlowCarousel({ slides }: FlowCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollingTo = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [isPointerInside, setIsPointerInside] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const scrollToSlideRef = useRef<(index: number) => void>(() => {});

  // Only autoplay while the carousel is on screen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.4 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // Advance 1 -> 2 -> 3 -> 4 -> 1 every AUTOPLAY_DELAY_MS. The timer restarts
  // whenever the active slide changes, so a manual click gets a full pause.
  useEffect(() => {
    if (!isInView || isPointerInside || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(() => {
      scrollToSlideRef.current((activeIndex + 1) % slides.length);
    }, AUTOPLAY_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [activeIndex, isInView, isPointerInside, slides.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    let settle = 0;

    // The active slide is the one whose center is nearest the track's center.
    const closestIndex = () => {
      const middle = track.scrollLeft + track.clientWidth / 2;
      let best = 0;
      let bestDistance = Infinity;
      track.querySelectorAll<HTMLElement>("[data-slide]").forEach((slide, index) => {
        const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - middle);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = index;
        }
      });
      return best;
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // A clicked step already owns the highlight until the scroll stops.
        if (scrollingTo.current === null) setActiveIndex(closestIndex());
      });
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        scrollingTo.current = null;
        setActiveIndex(closestIndex());
      }, 140);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      track.removeEventListener("scroll", onScroll);
    };
  }, [slides.length]);

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function scrollToSlide(index: number) {
    const track = trackRef.current;
    const slide = track?.querySelector<HTMLElement>(`[data-slide="${index}"]`);
    if (!track || !slide) return;
    const reduce = prefersReducedMotion();
    // Scroll the track only. scrollIntoView also moves the page.
    const left =
      slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
    setActiveIndex(index);
    // Already centered: no scroll event will come to release the lock.
    if (Math.abs(track.scrollLeft - left) < 1) return;
    scrollingTo.current = index;
    track.scrollTo({
      left,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  scrollToSlideRef.current = scrollToSlide;

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next =
      event.key === "ArrowRight"
        ? Math.min(activeIndex + 1, slides.length - 1)
        : Math.max(activeIndex - 1, 0);
    scrollToSlide(next);
  }

  return (
    <div
      className="flow-carousel"
      ref={rootRef}
      onPointerEnter={() => setIsPointerInside(true)}
      onPointerLeave={() => setIsPointerInside(false)}
    >
      <div className="case-study-frame" data-state="filled">
        <div
          className="flow-carousel-track"
          ref={trackRef}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Approval flow"
          onKeyDown={onKeyDown}
        >
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              className="flow-carousel-slide"
              data-slide={index}
              data-active={activeIndex === index ? "true" : undefined}
              aria-label={`${slide.label}. ${slide.caption}`}
              onClick={() => scrollToSlide(index)}
            >
              <img
                src={slide.src}
                alt=""
                draggable={false}
                style={
                  { "--flow-scale": slide.scale ?? 1 } as CSSProperties
                }
              />
            </button>
          ))}
        </div>
        <div className="flow-carousel-captions">
          {slides.map((slide, index) => (
            <p
              key={slide.src}
              className="flow-carousel-caption"
              data-active={activeIndex === index ? "true" : undefined}
            >
              {slide.caption}
            </p>
          ))}
        </div>
        <div
          className="flow-carousel-steps"
          style={{ "--flow-steps": slides.length } as CSSProperties}
        >
          {slides.map((slide, index) => (
            <div className="flow-carousel-step" key={slide.label}>
              {index > 0 ? <span className="flow-carousel-line" /> : null}
              <button
                type="button"
                className="flow-carousel-number"
                aria-current={activeIndex === index ? "step" : undefined}
                aria-label={`${index + 1}. ${slide.label}`}
                onClick={() => scrollToSlide(index)}
              >
                {index + 1}
              </button>
              <span className="flow-carousel-step-label">{slide.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
