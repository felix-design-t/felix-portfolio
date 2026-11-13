import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me",
};

/**
 * Landing spot for the About Me tab.
 * The page is only a title until the biography is written.
 */
export default function AboutPage() {
  return (
    <article className="work-page">
      <header className="work-page-header">
        <h1>About Me</h1>
      </header>
    </article>
  );
}
