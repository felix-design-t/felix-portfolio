"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type WayfindingItem = {
  id: string;
  index: string;
  title: string;
  /** This section stays on the previous rail row. */
  continuesPrevious?: boolean;
};

type CaseStudyWayfindingProps = {
  items: WayfindingItem[];
  /** Anchor for the top of the page. Previous from the first section goes here. */
  topId: string;
};

/**
 * Where am I on the page.
 *
 * Wide screens: a rail of every section title in the left margin.
 * Small screens: one line, "02 / 08", with Previous and Next.
 * Both read the same "active section" state, like two variants of one
 * component bound to the same variable. The rail is the progress, so
 * there is no bar.
 *
 * The rail marks the current section with one dot, the way Craft's
 * sidebar does. It is a single element that slides to the new row
 * (a shared indicator), and the current title steps aside so the
 * dot has a clear seat. Eight dots swapping on and off would blink.
 * Index is the first row, and the dot starts there. A section that
 * continues the one above it does not get its own row.
 */
export function CaseStudyWayfinding({ items, topId }: CaseStudyWayfindingProps) {
  // -1 means the reader is on the cover, the Index row.
  const [activeIndex, setActiveIndex] = useState(-1);
  const railListRef = useRef<HTMLDivElement>(null);
  // Distance from the top of the list to the dot. Null until measured.
  const [dotOffset, setDotOffset] = useState<number | null>(null);

  useEffect(() => {
    // A section counts as current once its top passes this share of the window.
    const activationLine = 0.35;
    let frameRequest = 0;

    function findActiveSection() {
      frameRequest = 0;
      const lineY = window.innerHeight * activationLine;
      const isAtPageEnd =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;

      if (isAtPageEnd) {
        setActiveIndex(items.length - 1);
        return;
      }

      let current = -1;
      items.forEach((item, position) => {
        const section = document.getElementById(item.id);
        if (section && section.getBoundingClientRect().top <= lineY) {
          current = position;
        }
      });
      setActiveIndex(current);
    }

    // Scroll fires many times per frame; measure at most once per frame.
    function handleScroll() {
      if (frameRequest === 0) {
        frameRequest = window.requestAnimationFrame(findActiveSection);
      }
    }

    findActiveSection();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (frameRequest !== 0) window.cancelAnimationFrame(frameRequest);
    };
  }, [items]);

  // Place the dot on the vertical center of the current row.
  // ResizeObserver catches wraps when the margin gets narrower.
  useLayoutEffect(() => {
    const list = railListRef.current;
    if (!list) return;

    const dotSize = 4;

    function placeDot() {
      const current = list?.querySelector<HTMLElement>(
        '[aria-current="location"]',
      );
      const row = current?.closest("li");
      if (!row || !list) return;
      setDotOffset(row.offsetTop + (row.offsetHeight - dotSize) / 2);
    }

    placeDot();
    const observer = new ResizeObserver(placeDot);
    observer.observe(list);
    return () => observer.disconnect();
  }, [activeIndex, items]);

  const railRows = items.reduce<
    { id: string; title: string; positions: number[] }[]
  >((rows, item, position) => {
    const previous = rows[rows.length - 1];
    if (item.continuesPrevious && previous) {
      previous.positions.push(position);
      return rows;
    }
    rows.push({ id: item.id, title: item.title, positions: [position] });
    return rows;
  }, []);

  const total = String(items.length).padStart(2, "0");
  const currentLabel =
    activeIndex >= 0 ? items[activeIndex].index : "00";
  const previousHref =
    activeIndex > 0
      ? `#${items[activeIndex - 1].id}`
      : activeIndex === 0
        ? `#${topId}`
        : null;
  const nextHref =
    activeIndex < items.length - 1 ? `#${items[activeIndex + 1].id}` : null;

  return (
    <>
      <nav className="case-study-rail" aria-label="Sections">
        <div className="case-study-rail-list" ref={railListRef}>
          <span
            className="case-study-rail-dot"
            aria-hidden="true"
            style={
              dotOffset === null
                ? undefined
                : { transform: `translateY(${dotOffset}px)` }
            }
          />
          <ol>
            <li>
              <a
                href={`#${topId}`}
                className="case-study-rail-link"
                aria-current={activeIndex < 0 ? "location" : undefined}
              >
                <span className="case-study-rail-label">Index</span>
              </a>
            </li>
            {railRows.map((row) => (
              <li key={row.id}>
                <a
                  href={`#${row.id}`}
                  className="case-study-rail-link"
                  aria-current={
                    row.positions.includes(activeIndex) ? "location" : undefined
                  }
                >
                  <span className="case-study-rail-label">{row.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      <nav className="case-study-stepper" aria-label="Section steps">
        <StepLink href={previousHref} label="Previous" />
        <span className="case-study-stepper-count" aria-live="polite">
          {currentLabel} / {total}
        </span>
        <StepLink href={nextHref} label="Next" />
      </nav>
    </>
  );
}

/** A step control that stays in place, dimmed, when there is nowhere to go. */
function StepLink({ href, label }: { href: string | null; label: string }) {
  if (href === null) {
    return (
      <span className="case-study-stepper-link" aria-disabled="true">
        {label}
      </span>
    );
  }
  return (
    <a href={href} className="case-study-stepper-link">
      {label}
    </a>
  );
}
