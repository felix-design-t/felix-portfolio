import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Writing",
};

/**
 * Landing spot for the Writing tab.
 * The page is only a title until the essays are ready, the same way
 * a case study page holds its place on the site map.
 */
export default function WritingPage() {
  return (
    <article className="work-page">
      <header className="work-page-header">
        <h1>Writing</h1>
      </header>
    </article>
  );
}
