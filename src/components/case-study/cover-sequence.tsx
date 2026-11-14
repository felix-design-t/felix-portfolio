"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HistoryToOverdraftVisual } from "./history-to-overdraft";
import { NoteToPolicyVisual } from "./note-to-policy";
import { TOC_HOLD_MS } from "./toc-motion";
import "./cover-sequence.css";

/**
 * Cover.
 *
 * One loop. The chat box sits alone in the middle of the cover. The note
 * is typed, send turns green and presses, and the dark bubble appears.
 * Then the hours screen appears, already on the second Yes, and the
 * choices follow. The frame holds, and the empty box returns.
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
    }, TOC_HOLD_MS);
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
      : !seen || phase === "note"
        ? { mode: "start" as const }
        : { mode: "play" as const, epoch: historyEpoch, onDone: finishHistory, from: "second-yes" as const };

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
