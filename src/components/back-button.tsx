"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Leaves the page you are on and returns to the front page.
 *
 * It is a link, the same shape as the download control: a round
 * icon button. The word "back" is a caption chip, hidden until
 * the pointer or keyboard focus is on the button.
 *
 * On the front page there is nowhere to go back to, so the button
 * stays out of the layout. Like a hidden state in a component set.
 */
export function BackButton() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <Link href="/" className="corner-button corner-button-back" aria-label="back">
      <BackIcon />
      <span className="corner-button-caption">back</span>
    </Link>
  );
}

/** Corner-up-left arrow, drawn on the same 16px grid as the other icons. */
function BackIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="pill-svg">
      <path d="M6 9.33 2.67 6 6 2.67" />
      <path d="M13.33 13.33v-4.66a2.67 2.67 0 0 0-2.66-2.67H2.67" />
    </svg>
  );
}
