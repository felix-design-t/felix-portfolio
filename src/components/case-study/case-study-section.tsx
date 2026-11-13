import { Fragment, type ReactNode } from "react";
import { CaseStudyFrame } from "./case-study-frame";
import type { CaseStudySectionData } from "./types";

type CaseStudySectionProps = {
  section: CaseStudySectionData;
  /** A built visual. Without it the section's frame stays a placeholder. */
  visual?: ReactNode;
  visualControls?: ReactNode;
  /** A built visual for the closing frame. */
  closingVisual?: ReactNode;
  /** Built visuals for `section.ideas`, matched by position. */
  ideaVisuals?: ReactNode[];
  /** A built visual for the follow-up frame. */
  followUpVisual?: ReactNode;
};

/**
 * One section: the kind on one line, the title under it,
 * one short paragraph, then the frame if the section has one.
 */
export function CaseStudySection({
  section,
  visual,
  visualControls,
  closingVisual,
  ideaVisuals = [],
  followUpVisual,
}: CaseStudySectionProps) {
  const headingId = `${section.id}-title`;

  return (
    <section
      id={section.id}
      className="case-study-section"
      aria-labelledby={headingId}
      data-continues={section.continuesPrevious ? "true" : undefined}
    >
      <p className="case-study-kicker">{section.kind}</p>
      <h2 id={headingId} className="case-study-section-title">
        {section.title}
      </h2>
      <p
        className="case-study-body"
        data-placeholder={section.isPlaceholderText ? "true" : undefined}
      >
        {section.body}
      </p>
      {section.ideas?.map((idea, position) => (
        <Fragment key={idea.name}>
          {idea.title ? (
            <h3
              className="case-study-section-title"
              data-idea-start={position > 0 ? "true" : undefined}
            >
              {idea.title}
            </h3>
          ) : null}
          {idea.body ? <p className="case-study-body">{idea.body}</p> : null}
          <CaseStudyFrame
            name={idea.name}
            caption={idea.caption}
            aspectRatio={idea.aspectRatio}
          >
            {ideaVisuals[position]}
          </CaseStudyFrame>
        </Fragment>
      ))}
      {section.visual ? (
        <CaseStudyFrame
          name={section.visual.name}
          caption={section.visual.caption}
          aspectRatio={section.visual.aspectRatio}
          controls={visualControls}
        >
          {visual}
        </CaseStudyFrame>
      ) : null}
      {section.visual && section.tradeoffs ? (
        <TradeoffFrame note={section.tradeoffNote} />
      ) : null}
      {section.closingTitle ? (
        <h3 className="case-study-section-title">{section.closingTitle}</h3>
      ) : null}
      {section.closing ? (
        <p className="case-study-body">{section.closing}</p>
      ) : null}
      {section.closingVisual ? (
        <CaseStudyFrame
          name={section.closingVisual.name}
          caption={section.closingVisual.caption}
          aspectRatio={section.closingVisual.aspectRatio}
        >
          {closingVisual}
        </CaseStudyFrame>
      ) : null}
      {section.closingVisual && section.tradeoffs ? <TradeoffFrame /> : null}
      {section.followUp ? (
        <>
          {/* Same space before this title as before "02." in Exploration. */}
          <h3 className="case-study-section-title" data-idea-start="true">
            {section.followUp.title}
          </h3>
          <p
            className="case-study-body"
            data-placeholder={
              section.followUp.isPlaceholderText ? "true" : undefined
            }
          >
            {section.followUp.body}
          </p>
          {section.followUp.visual ? (
            <CaseStudyFrame
              name={section.followUp.visual.name}
              caption={section.followUp.visual.caption}
              aspectRatio={section.followUp.visual.aspectRatio}
            >
              {followUpVisual}
            </CaseStudyFrame>
          ) : null}
          {section.followUp.visual && section.tradeoffs ? (
            <TradeoffFrame note={section.followUp.tradeoffNote} />
          ) : null}
        </>
      ) : null}
    </section>
  );
}

/** A second frame under a placeholder. It names the tradeoff of that step. */
function TradeoffFrame({ note }: { note?: string }) {
  return <CaseStudyFrame name="Tradeoffs" note={note} aspectRatio="16 / 10" />;
}
