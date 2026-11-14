"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HistoryToOverdraftVisual } from "./history-to-overdraft";
import { NoteToPolicyVisual } from "./note-to-policy";
import { TOC_MOVE_MS } from "./toc-motion";
import "./cover-sequence.css";

/**
 * Cover.
 *
 * One loop. The chat box sits alone in the middle of the cover. The note
 * is typed, send turns green and presses, and the dark bubble takes the
 * box's place for 1.6s. Then the hours screen types "What happens if…",
 * plays the rest of that thread, holds 0.8s, and the empty box returns.
 *
 * Each screen already knows its own motion. This only decides which
 * one is on, and when the pair loops.
 */

type Phase = "note" | "history" | "hold" | "end";

export function CoverSequence() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [phase, setPhase] = useState<Phase>("note");
  const [noteEpoch, setNoteEpoch] = useState(0);
  const [historyEpoch, setHistoryEpoch] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyReduced = () => {
      if (media.matches) setPhase("end");
    };
    applyReduced();
    media.addEventListener("change", applyReduced);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setSeen(true);
      },
      { threshold: 0.4 },
    );
    // The cover is the first frame. If it is already on screen, start now.
    // A threshold callback can miss an element that is visible at observe time.
    const box = root.getBoundingClientRect();
    if (box.height > 0 && box.top < window.innerHeight && box.bottom > 0) {
      setSeen(true);
    }
    observer.observe(root);
    return () => {
      media.removeEventListener("change", applyReduced);
      observer.disconnect();
    };
  }, []);

  // The cover is as tall as the report's contents, so the empty white
  // under the case list is not part of the frame. The height stays put
  // while the chat box and the bubble swap in the middle.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const frame = root?.closest(".case-study-frame");
    if (!(root instanceof HTMLElement) || !(frame instanceof HTMLElement)) return;

    const fit = () => {
      const report = root.querySelector(".hto-report");
      const bar = root.querySelector(".hto-history .dec-titlebar");
      if (!(report instanceof HTMLElement) || !(bar instanceof HTMLElement)) return;
      const reportStyle = getComputedStyle(report);
      const gap = parseFloat(reportStyle.rowGap || reportStyle.gap) || 0;
      const pad =
        parseFloat(reportStyle.paddingTop) + parseFloat(reportStyle.paddingBottom);
      let content = bar.offsetHeight + pad;
      const children = [...report.children];
      children.forEach((child, index) => {
        if (child instanceof HTMLElement) content += child.offsetHeight;
        if (index > 0) content += gap;
      });
      const frameStyle = getComputedStyle(frame);
      const chrome =
        parseFloat(frameStyle.paddingTop) +
        parseFloat(frameStyle.paddingBottom) +
        parseFloat(frameStyle.borderTopWidth) +
        parseFloat(frameStyle.borderBottomWidth);
      const scale =
        parseFloat(getComputedStyle(root).getPropertyValue("--cover-product-scale")) || 1;
      const next = Math.ceil(content * scale + chrome + 2);
      if (next < 80) return;
      const height = `${next}px`;
      if (frame.style.height !== height) frame.style.height = height;
      frame.style.aspectRatio = "auto";
      frame.style.overflow = "hidden";
      frame.style.overflowAnchor = "none";
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(frame);
    return () => {
      observer.disconnect();
      frame.style.height = "";
      frame.style.aspectRatio = "";
      frame.style.overflow = "";
      frame.style.overflowAnchor = "";
    };
  }, []);

  const finishNote = useCallback(() => {
    setHistoryEpoch((epoch) => epoch + 1);
    setPhase("history");
  }, []);

  const finishHistory = useCallback(() => {
    setPhase("hold");
  }, []);

  useEffect(() => {
    if (phase !== "hold") return;
    const hold = window.setTimeout(() => {
      setNoteEpoch((epoch) => epoch + 1);
      setPhase("note");
    }, TOC_MOVE_MS);
    return () => window.clearTimeout(hold);
  }, [phase]);

  const showHistory = phase !== "note";
  const notePlayback =
    !seen || phase !== "note"
      ? phase === "note"
        ? { mode: "start" as const }
        : { mode: "end" as const }
      : { mode: "play" as const, epoch: noteEpoch, onDone: finishNote, through: "bubble" as const };
  const historyPlayback =
    phase === "end" || phase === "hold"
      ? { mode: "end" as const }
      : phase !== "history"
        ? { mode: "ask-ready" as const }
        : { mode: "play" as const, epoch: historyEpoch, onDone: finishHistory, from: "ask" as const };

  return (
    <div
      ref={rootRef}
      className="cover-sequence"
      data-visual="cover-sequence"
      data-phase={phase}
    >
      <div className="cover-sequence-pane" data-active={showHistory ? "false" : "true"}>
        <NoteToPolicyVisual key={noteEpoch} playback={notePlayback} />
      </div>
      <div className="cover-sequence-pane" data-active={showHistory ? "true" : "false"}>
        <HistoryToOverdraftVisual key={historyEpoch} playback={historyPlayback} />
      </div>
    </div>
  );
}
