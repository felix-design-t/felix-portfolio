"use client";

import { useEffect, useState } from "react";
import styles from "./case-study.module.css";

export type WayfindingItem = { id: string; index: string; title: string };

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
 */
export function CaseStudyWayfinding({ items, topId }: CaseStudyWayfindingProps) {
  // -1 means the reader is still on the cover, before section 01.
  const [activeIndex, setActiveIndex] = useState(-1);

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
      <nav className={styles.rail} aria-label="Sections">
        <ol className={styles.railList}>
          {items.map((item, position) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={styles.railLink}
                aria-current={position === activeIndex ? "location" : undefined}
              >
                <span className={styles.railIndex}>{item.index}</span>
                <span>{item.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <nav className={styles.stepper} aria-label="Section steps">
        <StepLink href={previousHref} label="Previous" />
        <span className={styles.stepperCount} aria-live="polite">
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
      <span className={styles.stepperLink} aria-disabled="true">
        {label}
      </span>
    );
  }
  return (
    <a href={href} className={styles.stepperLink}>
      {label}
    </a>
  );
}
