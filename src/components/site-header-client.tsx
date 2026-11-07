"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Floating pill navigation.
 *
 * Think of it as one component with two frames nested inside:
 * 1. The outer capsule is the whole control.
 * 2. The top row is a status cluster: theme, clock, menu.
 * 3. The tab row is the site map. The selected tab is an inner pill,
 *    the same way a selected segment sits inside a control in Figma.
 *
 * The menu is a checkbox tucked behind the icon. It starts unchecked,
 * so the capsule is only the status cluster. Checking it opens the tab
 * row. The theme button does not change colors yet.
 *
 * Destinations follow the current site map: Home and Contact.
 * Contact jumps to the footer on whatever page you are on.
 */

type TabId = "home" | "contact";

const tabs: { id: TabId; label: string; href: string }[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "contact", label: "Contact", href: "#contact" },
];

export function SiteHeaderBar({ clock }: { clock: ReactNode }) {
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  const activeTab = getActiveTab(hash);

  return (
    <header className="pill-nav">
      <div className="pill-nav-shell">
        <div className="pill-nav-tools">
          <button type="button" className="pill-icon-button" aria-label="Theme">
            <SunIcon />
          </button>
          {clock}
          <input
            id="site-tabs-toggle"
            className="pill-tabs-toggle"
            type="checkbox"
            aria-label="Menu"
            aria-controls="site-tabs"
          />
          <label htmlFor="site-tabs-toggle" className="pill-icon-button" aria-hidden="true">
            <MenuIcon />
          </label>
        </div>

        <nav id="site-tabs" className="pill-nav-tabs" aria-label="Primary">
          {tabs.map((tab) => {
            const isCurrent = tab.id === activeTab;
            const className = "pill-tab";

            if (tab.id === "contact") {
              return (
                <a
                  key={tab.id}
                  href={tab.href}
                  className={className}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  <TabIcon name={tab.id} />
                  {tab.label}
                </a>
              );
            }

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={className}
                aria-current={isCurrent ? "page" : undefined}
              >
                <TabIcon name={tab.id} />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export function PillClock() {
  // The first paint uses the machine clock. suppressHydrationWarning on the
  // <time> covers a one-minute difference between server and browser.
  // The effect keeps it current after that.
  const [clock, setClock] = useState(() => readClock(new Date()));

  useEffect(() => {
    const updateClock = () => setClock(readClock(new Date()));

    updateClock();
    const timerId = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(timerId);
  }, []);

  return (
    <time className="pill-clock" dateTime={clock.value} suppressHydrationWarning>
      {clock.label}
    </time>
  );
}

function getActiveTab(hash: string): TabId {
  if (hash === "#contact") return "contact";
  return "home";
}

function readClock(date: Date) {
  return {
    label: formatClock(date),
    value: date.toISOString(),
  };
}

/** 12-hour clock with a leading zero, matching 01:45. No AM/PM. */
function formatClock(date: Date): string {
  const formatted = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return formatted.replace(/\s*[AP]M$/i, "");
}

function TabIcon({ name }: { name: TabId }) {
  if (name === "home") return <HomeIcon />;
  return <ContactIcon />;
}

function SunIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="pill-svg">
      <circle cx="8" cy="8" r="2.2" />
      <path d="M8 1.6v1.6M8 12.8v1.6M1.6 8h1.6M12.8 8h1.6M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="pill-svg">
      <path d="M3 4.5h10M3 8h10M3 11.5h10" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="pill-svg">
      <path d="M2.6 7.1 8 2.7l5.4 4.4V13a.6.6 0 0 1-.6.6H10V9.2H6V13.6H3.2a.6.6 0 0 1-.6-.6V7.1Z" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="pill-svg">
      <path d="M2.2 8.1 13.6 3.4 9.1 13.2 7.5 9.2 2.2 8.1Z" />
      <path d="M7.5 9.2 13.6 3.4" />
    </svg>
  );
}
