import type { Metadata } from "next";
import Link from "next/link";
import "./writing.css";

export const metadata: Metadata = {
  title: "Writing",
  description: "Felix is writing. A few drafts away.",
};

export default function WritingPage() {
  return (
    <article className="writing-page" aria-labelledby="writing-heading">
      <p className="writing-eyebrow">Writing</p>

      <div className="writing-draft" aria-hidden="true">
        <svg className="writing-sketch" viewBox="0 0 280 220" fill="none">
          <g transform="rotate(-7 140 110)">
            <rect x="69" y="33" width="140" height="164" rx="5" className="writing-back-sheet" />
          </g>
          <g transform="rotate(4 140 110)">
            <rect x="64" y="24" width="140" height="164" rx="5" className="writing-sheet" />
            <path d="M85 51h32" className="writing-rule" />
            <path d="M85 75h95M85 93h81M85 111h92" className="writing-rule" />
            <path d="m85 93 44-2-11 4 39-2" className="writing-crossout" />
            <path d="M85 137c5-7 7 7 13 0s7 6 13 0 7 6 13 0 7 6 13 0" className="writing-scribble" />
            <g className="writing-pencil">
              <g transform="translate(139 139) rotate(45)">
                <path d="M-5-18v-66a5 5 0 0 1 10 0v66L0 0Z" className="writing-pencil-body" />
                <path d="M-5-18H5M-5-76H5M0-76v58" className="writing-pencil-detail" />
                <path d="m0 0-1.7-6h3.4Z" className="writing-pencil-tip" />
              </g>
            </g>
          </g>
        </svg>
      </div>

      <header className="writing-copy">
        <h1 id="writing-heading">
          Felix is writing<span className="writing-dots" aria-hidden="true"><span>.</span><span>.</span><span>.</span></span>
        </h1>
        <p>A few drafts away.</p>
      </header>

      <Link className="writing-link" href="/#selected-work">
        {/* Geist Folder icon, adjusted to 1px: https://vercel.com/geist/file-tree */}
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15 7v5.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 12.5V7zm0-1V3.5H8.83a2 2 0 0 1-1.2-.4L6.17 2H1v4zM0 1h6.17a1 1 0 0 1 .6.2l1.46 1.1a1 1 0 0 0 .6.2H16v10a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5V1"
          />
        </svg>
        Explore my work
      </Link>
    </article>
  );
}
