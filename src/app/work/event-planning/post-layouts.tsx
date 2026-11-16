import "./post-layouts.css";

/**
 * Three tries at the feed card.
 *
 * Header on top, at a small size, is the one that worked.
 * The other two keep the same words in a worse place or a wider card.
 */
const options = [
  {
    src: "/work/event-planning/iteration-1.1.png",
    alt: "Small feed card with the author header on top",
    label: "Small + Header on top",
    tone: "good" as const,
  },
  {
    src: "/work/event-planning/iteration-1.2.png",
    alt: "Small feed card with the author header on the bottom",
    label: "Small + Header on bottom",
    tone: "bad" as const,
  },
  {
    src: "/work/event-planning/iteration-1.3.png",
    alt: "Large feed card with the author header on top",
    label: "Large + Header on top",
    tone: "bad" as const,
  },
];

/**
 * Bright tags versus one quiet tag color.
 * The palette on the left is the problem. The card on the right is the fix.
 */
export function TagColors() {
  return (
    <div className="tag-colors">
      <p className="post-layouts-step">step 2: unifying colored tags</p>
      <div className="tag-colors-row">
        <figure className="tag-colors-item">
          <img
            src="/work/event-planning/iteration-2.1.png"
            alt="Many tag colors, one group for each interest"
            draggable={false}
          />
          <figcaption className="post-layouts-caption" data-tone="bad">
            <span className="post-layouts-dot" />
            Color distinction = Confusion
          </figcaption>
        </figure>
        <span className="tag-colors-arrow" aria-hidden="true">
          →
        </span>
        <figure className="tag-colors-item">
          <img
            src="/work/event-planning/iteration-2.2.png"
            alt="A feed card with brightly colored tags"
            draggable={false}
          />
          <figcaption className="post-layouts-caption" data-tone="bad">
            <span className="post-layouts-dot" />
            Bright color creates distraction
          </figcaption>
        </figure>
        <span className="tag-colors-arrow" aria-hidden="true">
          →
        </span>
        <figure className="tag-colors-item">
          <img
            src="/work/event-planning/iteration-2.3.png"
            alt="A feed card with neutral colored tags"
            draggable={false}
          />
          <figcaption className="post-layouts-caption" data-tone="good">
            <span className="post-layouts-dot" />
            Neutral state colored tags
          </figcaption>
        </figure>
      </div>
    </div>
  );
}

export function PostLayouts() {
  return (
    <div className="post-layouts">
      <p className="post-layouts-step">step 1: choosing the post layout</p>
      <ul className="post-layouts-grid">
        {options.map((option) => (
          <li key={option.src}>
            <p className="post-layouts-caption" data-tone={option.tone}>
              <span className="post-layouts-dot" />
              {option.label}
            </p>
            <img src={option.src} alt={option.alt} draggable={false} />
          </li>
        ))}
      </ul>
    </div>
  );
}
