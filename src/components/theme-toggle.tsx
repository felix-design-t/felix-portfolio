"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * One icon button in the status cluster, to the right of the clock.
 * Light on shows a sun. Light off shows a moon and darkens the page.
 * Hovering shows what the next click will do: "turn off" or "turn on".
 * The choice is remembered in this browser.
 */

type SiteTheme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<SiteTheme>("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("site-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("site-theme", theme);
  }, [theme]);

  const lightIsOn = theme === "light";
  const caption = lightIsOn ? "turn off" : "turn on";
  const [captionHost, setCaptionHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setCaptionHost(document.querySelector(".pill-nav"));
  }, []);

  return (
    <>
      <button
        type="button"
        className="pill-icon-button theme-toggle"
        aria-pressed={lightIsOn}
        aria-label={caption}
        onClick={() => setTheme(lightIsOn ? "dark" : "light")}
      >
        {lightIsOn ? <SunIcon /> : <MoonIcon />}
      </button>
      {captionHost
        ? createPortal(
            <span className="theme-caption" aria-hidden="true">
              {caption}
            </span>,
            captionHost,
          )
        : null}
    </>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="pill-svg">
      <circle cx="8" cy="8" r="2.2" />
      <path d="M8 1.6v1.6M8 12.8v1.6M1.6 8h1.6M12.8 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="pill-svg">
      <path d="M10.2 2.4A5.2 5.2 0 1 0 13.6 10 4.2 4.2 0 0 1 10.2 2.4Z" />
    </svg>
  );
}
