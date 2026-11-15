"use client";

import { useState, type FocusEvent, type PointerEvent } from "react";
import "./annotated-image.css";

/**
 * One numbered mark on a picture, and the card that explains it.
 *
 * `x` and `y` are percentages of the picture. Think of the image as a
 * 100 by 100 grid: 0,0 is the top-left corner.
 */
export type AnnotatedNote = {
  id: string;
  x: number;
  y: number;
  stat: string;
  label: string;
  detail: string;
  /** Which side of the pin the card opens on. Defaults from the pin's place. */
  cardSide?: "left" | "right";
};

type AnnotatedImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  notes: AnnotatedNote[];
  /** Problem cards use a bullet list. Approach cards are plain sentences. */
  asList?: boolean;
};

/**
 * A picture with numbered pins.
 *
 * The card stays hidden until a pin is hovered, tapped, or focused.
 * It sits beside that number. Leaving the picture hides it again.
 */
export function AnnotatedImage({
  src,
  alt,
  width,
  height,
  notes,
  asList = true,
}: AnnotatedImageProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeNote = notes.find((note) => note.id === activeId) ?? null;

  function highlight(id: string) {
    setActiveId(id);
  }

  function clearIfLeft(event: PointerEvent<HTMLElement> | FocusEvent<HTMLElement>) {
    if ("pointerType" in event && event.pointerType === "touch") return;
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    if (event.currentTarget.contains(document.activeElement)) return;
    setActiveId(null);
  }

  function onPointerEnter(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return;
    const id = event.currentTarget.dataset.note;
    if (id) highlight(id);
  }

  function onPointerLeaveItem(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return;
    if (event.currentTarget === document.activeElement) return;
    const id = event.currentTarget.dataset.note;
    setActiveId((current) => (current === id ? null : current));
  }

  function onPointerUp(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "touch") return;
    const id = event.currentTarget.dataset.note;
    if (!id) return;
    setActiveId((current) => (current === id ? null : id));
  }

  return (
    <div
      className="annotated-image"
      data-has-active={activeId ? "true" : undefined}
      onPointerLeave={clearIfLeft}
      onBlur={clearIfLeft}
    >
      <div className="annotated-stage">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          draggable={false}
        />
        {notes.map((note) => (
          <button
            key={note.id}
            type="button"
            className="annotated-pin"
            data-note={note.id}
            data-active={activeId === note.id ? "true" : undefined}
            style={{ left: `${note.x}%`, top: `${note.y}%` }}
            aria-label={`${note.id}. ${note.label}`}
            aria-describedby={activeId === note.id ? "annotated-note" : undefined}
            aria-pressed={activeId === note.id}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeaveItem}
            onPointerUp={onPointerUp}
            onFocus={() => highlight(note.id)}
          >
            {note.id}
          </button>
        ))}
        {activeNote ? (
          <div
            className="annotated-note"
            id="annotated-note"
            role="note"
            data-side={
              activeNote.cardSide ?? (activeNote.x > 50 ? "left" : "right")
            }
            style={{ left: `${activeNote.x}%`, top: `${activeNote.y}%` }}
          >
            {activeNote.stat ? (
            <p className="annotated-stat">{activeNote.stat}</p>
          ) : null}
            {asList ? (
              <ul className="annotated-points">
                {[activeNote.label, activeNote.detail]
                  .filter((line) => line.length > 0)
                  .map((line) => (
                    <li key={line}>{line}</li>
                  ))}
              </ul>
            ) : (
              [activeNote.label, activeNote.detail]
                .filter((line) => line.length > 0)
                .map((line) => (
                  <p key={line} className="annotated-context">
                    {line}
                  </p>
                ))
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
