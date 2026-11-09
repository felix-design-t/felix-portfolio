"use client";

import Link from "next/link";
import { FexiMorph } from "@/components/fexi-morph";
import { ThemeToggle } from "@/components/theme-toggle";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

/**
 * Floating pill navigation.
 *
 * Think of it as one component with two frames nested inside:
 * 1. The outer capsule is the whole control.
 * 2. The top row is a status cluster: menu, clock, light and dark.
 * 3. The tab row is the site map. The selected tab is an inner pill,
 *    the same way a selected segment sits inside a control in Figma.
 *
 * The menu is a checkbox tucked behind the left icon. It starts unchecked,
 * so the capsule is only the status cluster. Checking it opens the tab
 * row. On a mouse, hovering that icon opens the row too, and leaving the
 * whole pill closes it, so the pointer can still travel down to a tab.
 * The CV download sits in its own control at the right of the column.
 *
 * Destinations: Home, Writing, and /about. The about tab reads “Ask Fexi”.
 */

type TabId = "home" | "writing" | "about";

const tabs: { id: TabId; label: string; href: string }[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "writing", label: "Writing", href: "/writing" },
  { id: "about", label: "Ask Fexi", href: "/about" },
];

export function SiteHeaderBar({ clock }: { clock: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  // True only after a mouse hover. A click from that hover must not
  // toggle the menu shut. Touch and keyboard still toggle it.
  const menuOpenedByMouse = useRef(false);

  const activeTab = getActiveTab(pathname);

  function showMenuOnMouseHover(event: PointerEvent<HTMLLabelElement>) {
    if (event.pointerType !== "mouse") return;
    menuOpenedByMouse.current = true;
    setMenuOpen(true);
  }

  function hideMenuWhenPointerLeaves(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    menuOpenedByMouse.current = false;
    setMenuOpen(false);
  }

  function keepHoverMenuOpen(event: MouseEvent<HTMLLabelElement>) {
    if (!menuOpenedByMouse.current) return;
    event.preventDefault();
  }

  return (
    <header className="pill-nav">
      <div className="pill-nav-shell" onPointerLeave={hideMenuWhenPointerLeaves}>
        <div className="pill-nav-tools">
          <input
            id="site-tabs-toggle"
            className="pill-tabs-toggle"
            type="checkbox"
            aria-label="Menu"
            aria-controls="site-tabs"
            checked={menuOpen}
            onChange={(event) => setMenuOpen(event.target.checked)}
          />
          <label
            htmlFor="site-tabs-toggle"
            className="pill-icon-button"
            aria-hidden="true"
            onPointerEnter={showMenuOnMouseHover}
            onClick={keepHoverMenuOpen}
          >
            <MenuIcon />
          </label>
          {clock}
          <ThemeToggle />
        </div>

        <nav id="site-tabs" className="pill-nav-tabs" aria-label="Primary">
          {tabs.map((tab) => {
            const isCurrent = tab.id === activeTab;

            return (
              <Link
                key={tab.id}
                href={tab.href}
                className="pill-tab"
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

function getActiveTab(pathname: string): TabId {
  if (pathname.startsWith("/writing")) return "writing";
  if (pathname.startsWith("/about")) return "about";
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
  if (name === "writing") return <WritingIcon />;
  // Same mark as the hero line: slow idle, 16px, --text-secondary.
  return <FexiMorph speed="idle" />;
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

function WritingIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="pill-svg">
      <path d="M9.1 2.7 13.3 6.9 6.2 14H2.2v-4L9.1 2.7Z" />
      <path d="M7.6 4.2 11.8 8.4" />
    </svg>
  );
}

