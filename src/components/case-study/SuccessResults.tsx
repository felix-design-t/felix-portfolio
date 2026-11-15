"use client";

import { useEffect, useRef, useState } from "react";
import "./success-results.css";

export type SuccessStat = {
  /** Which way the number moved. Drawn as a small arrow. */
  direction: "up" | "down";
  /** The number itself, e.g. "15%". */
  value: string;
  /** Muted line under the number. */
  label: string;
};

export type SuccessBlock = {
  /** Name after the number in the mono label, e.g. "Data Visualization Hub". */
  label: string;
  title: string;
  stats: SuccessStat[];
  image: {
    src: string;
    alt: string;
    /** Real pixel size. Keeps the shape and reserves the space. */
    width: number;
    height: number;
    /** Shown on the placeholder if the file is missing. */
    name: string;
  };
};

type SuccessResultsProps = {
  blocks: SuccessBlock[];
};

const arrows: Record<SuccessStat["direction"], string> = {
  up: "\u2191",
  down: "\u2193",
};

/**
 * One result per block, stacked: a label, a headline, the numbers, then
 * the screen that earned them. Think of a case-study "proof" card.
 * All copy and image paths are passed in. Nothing is written here.
 */
export function SuccessResults({ blocks }: SuccessResultsProps) {
  return (
    <ol className="success-results">
      {blocks.map((block, index) => (
        <li className="success-block" key={block.label}>
          <p className="success-label">
            {String(index + 1).padStart(2, "0")} · {block.label}
          </p>
          <h3 className="case-study-section-title success-title">
            {block.title}
          </h3>
          <ul className="success-stats">
            {block.stats.map((stat) => (
              <li className="success-stat" key={stat.label}>
                <p className="success-stat-value">
                  <span className="success-stat-arrow" aria-hidden="true">
                    {arrows[stat.direction]}
                  </span>
                  <span className="success-sr">
                    {stat.direction === "down" ? "Down " : "Up "}
                  </span>
                  {stat.value}
                </p>
                <p className="success-stat-label">{stat.label}</p>
              </li>
            ))}
          </ul>
          <SuccessImage image={block.image} />
        </li>
      ))}
    </ol>
  );
}

/** The screen on a soft card. A neutral 16:10 card stands in if the file is missing. */
function SuccessImage({ image }: { image: SuccessBlock["image"] }) {
  const [isMissing, setIsMissing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  // The error can fire before React attaches onError, so check once on mount.
  useEffect(() => {
    const element = imageRef.current;
    if (element && element.complete && element.naturalWidth === 0) {
      setIsMissing(true);
    }
  }, []);

  return (
    <div className="success-card">
      {isMissing ? (
        <p className="success-placeholder">{image.name}</p>
      ) : (
        <img
          ref={imageRef}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          draggable={false}
          loading="lazy"
          onError={() => setIsMissing(true)}
        />
      )}
    </div>
  );
}
