"use client";

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import "./study-gate.css";

const unlockKey = "felix-study-unlock";
const password = "cafeteria";

/**
 * A locked door in front of a case study.
 *
 * The study stays out of view until the password is right.
 * A correct answer is remembered for this browser tab, so a
 * refresh does not ask again. Closing the tab locks it again.
 */
export function StudyGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    setUnlocked(window.sessionStorage.getItem(unlockKey) === "yes");
    setReady(true);
  }, []);

  function unlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (value.trim() !== password) {
      setWrong(true);
      return;
    }
    window.sessionStorage.setItem(unlockKey, "yes");
    setWrong(false);
    setUnlocked(true);
  }

  if (!ready) return null;
  if (unlocked) return children;

  return (
    <form className="study-gate" onSubmit={unlock}>
      <label className="study-gate-label" htmlFor="study-gate-password">
        Password
      </label>
      <input
        id="study-gate-password"
        className="study-gate-input"
        type="password"
        name="password"
        autoComplete="current-password"
        value={value}
        aria-invalid={wrong}
        aria-describedby={wrong ? "study-gate-error" : undefined}
        onChange={(event) => {
          setValue(event.target.value);
          setWrong(false);
        }}
      />
      <button className="study-gate-submit" type="submit">
        Enter
      </button>
      {wrong ? (
        <p id="study-gate-error" className="study-gate-error" role="alert">
          That password is not right.
        </p>
      ) : null}
    </form>
  );
}
