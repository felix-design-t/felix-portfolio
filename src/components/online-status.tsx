"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Quiet status in the top-left of the front page.
 * The dot breathes so the count feels live.
 * The number starts at 1 and adds 2 per person on the site right now.
 * One person (just you) reads as 3. Three people read as 7.
 *
 * Other pages use that same corner for the back button, so the count
 * stays hidden there. Like two variants of one slot: home shows the
 * count, every other page shows back.
 */

const checkInEveryMs = 15_000;
const viewerStorageKey = "site-viewer";
/** Until the server answers, assume only you are here: 1 + 2. */
const onlyYouOnline = 3;

export function OnlineStatus() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [onlineCount, setOnlineCount] = useState(onlyYouOnline);

  useEffect(() => {
    if (!isHome) return;

    const viewerId = readOrCreateViewerId();
    let stopped = false;

    async function checkIn() {
      try {
        const response = await fetch("/api/presence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: viewerId }),
        });
        if (!response.ok) return;
        const data = (await response.json()) as { online?: unknown };
        if (!stopped && typeof data.online === "number") {
          setOnlineCount(data.online);
        }
      } catch {
        // Keep the last number. The dot still shows the page is open.
      }
    }

    function signOut() {
      const body = new Blob([JSON.stringify({ id: viewerId, leave: true })], {
        type: "application/json",
      });
      navigator.sendBeacon("/api/presence", body);
    }

    checkIn();
    const timerId = window.setInterval(checkIn, checkInEveryMs);
    window.addEventListener("pagehide", signOut);

    return () => {
      stopped = true;
      window.clearInterval(timerId);
      window.removeEventListener("pagehide", signOut);
    };
  }, [isHome]);

  if (!isHome) return null;

  return (
    <p className="online-status" aria-live="polite">
      <span className="online-dot" aria-hidden="true" />
      <span>{onlineCount} online</span>
    </p>
  );
}

function readOrCreateViewerId(): string {
  const saved = window.localStorage.getItem(viewerStorageKey);
  if (saved && /^[a-zA-Z0-9-]{8,64}$/.test(saved)) return saved;

  const created = window.crypto.randomUUID();
  window.localStorage.setItem(viewerStorageKey, created);
  return created;
}
