"use client";

import { useLayoutEffect } from "react";

/**
 * The empty covers copy the Time-Off cover.
 *
 * Think of the four plates as one set of cards. Time-Off is the real
 * cover, and its height is measured from the product inside it. The
 * other three stay blank, but they take that same height so the list
 * does not jump between a short plate and a tall one.
 */
export function MatchCoverSize() {
  useLayoutEffect(() => {
    const source = document.querySelector(
      ".selected-grid .work-slot-cover.case-study-frame",
    );
    if (!(source instanceof HTMLElement)) return;

    const plates = [
      ...document.querySelectorAll(
        ".selected-grid .work-slot-cover:not(.case-study-frame)",
      ),
    ].filter((node): node is HTMLElement => node instanceof HTMLElement);

    const apply = () => {
      const height = Math.round(source.getBoundingClientRect().height);
      // Ignore the first empty measure, before the report has a height.
      if (height < 80) return;
      const value = `${height}px`;
      for (const plate of plates) {
        if (plate.style.height !== value) plate.style.height = value;
        plate.style.aspectRatio = "auto";
      }
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(source);
    return () => {
      observer.disconnect();
      for (const plate of plates) {
        plate.style.height = "";
        plate.style.aspectRatio = "";
      }
    };
  }, []);

  return null;
}
