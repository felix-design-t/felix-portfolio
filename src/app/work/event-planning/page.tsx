import type { Metadata } from "next";
import Image from "next/image";
import { CaseStudyPage } from "@/components/case-study/case-study-page";
import { eventPlanning } from "@/content/case-studies/event-planning";
import { EventContextMedia } from "./diemlife-flow";
import { FundraisingScatter } from "./fundraising-scatter";
import { DonationFlowCompare, DonationScreens } from "./donation-redesign";
import { IdeationFlow } from "./ideation-flow";
import { FunctionalCompare, FunctionalSpread } from "./functional-share";
import { InteractionCompare } from "./interaction-compare";
import { PostLayouts, TagColors } from "./post-layouts";
import { ResearchInsight, ResearchStats } from "./research-stats";
import "@/components/case-study/cover-sequence.css";

export const metadata: Metadata = {
  title: eventPlanning.title,
};

/**
 * A fixed route wins over /work/[slug], so this study gets the full
 * template while the other projects keep their placeholder page.
 *
 * The cover is the same frame as Expense Management. An empty
 * cover-sequence holds the plate's shape. The screenshot sits on
 * top of it, inset from the top and left, running off the other edges.
 * Light keeps cover.png. Dark swaps in cover-dark.jpg, the same
 * CSS switch the home card uses. Both pictures stay in the page.
 * The tide wash comes from the study's cover, through GradientBackdrop.
 */
export default function EventPlanningPage() {
  return (
    <CaseStudyPage
      study={eventPlanning}
      cover={
        <>
          {/* Holds the plate's shape. The screenshot sits on top of it. */}
          <div className="cover-sequence" aria-hidden="true" />
          <div className="work-slot-media">
            <Image
              className="work-slot-shot"
              data-theme-image="light"
              src="/work/event-planning/cover.png"
              alt="DIEMlife event page for Effective Networking for Small Business Success"
              width={861}
              height={726}
              sizes="(max-width: 640px) 90vw, 480px"
            />
            <Image
              className="work-slot-shot"
              data-theme-image="dark"
              src="/work/event-planning/cover-dark.jpg"
              alt="DIEMlife event page for Effective Networking for Small Business Success"
              width={1152}
              height={864}
              sizes="(max-width: 640px) 90vw, 480px"
            />
          </div>
        </>
      }
      visuals={{
        context: <EventContextMedia />,
      }}
      ideaVisuals={{
        "design-ideation": [
          <IdeationFlow key="ideation-flow" />,
          <video
            key="ideation-2"
            src="/work/event-planning/Ideation-2.mp4"
            width={1916}
            height={1080}
            autoPlay
            muted
            loop
            playsInline
            aria-label="Activity posts for sharing task progress in an event"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: "var(--radius-sm)",
            }}
          />,
          <DonationFlowCompare key="donation-flow" />,
          <DonationScreens key="donation-screens" />,
        ],
        research: [
          <ResearchStats key="research-stats" />,
          null,
          <ResearchInsight key="research-insight" />,
          <FundraisingScatter key="fundraising-scatter" />,
        ],
        iteration: [
          <PostLayouts key="post-layouts" />,
          <TagColors key="tag-colors" />,
          <InteractionCompare key="interaction-compare" />,
          <FunctionalCompare key="functional-compare" />,
          <FunctionalSpread key="functional-spread" />,
        ],
        "measuring-success": [
          <video
            key="success-1"
            src="/work/event-planning/outcome-1.mp4"
            width={1916}
            height={1080}
            autoPlay
            muted
            loop
            playsInline
            aria-label="Sharing activities in a DIEMlife event"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: "var(--radius-sm)",
            }}
          />,
          <video
            key="success-2"
            src="/work/event-planning/outcome-2.mp4"
            width={1916}
            height={1080}
            autoPlay
            muted
            loop
            playsInline
            aria-label="The redesigned DIEMlife donation flow"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: "var(--radius-sm)",
            }}
          />,
        ],
        "outcome-overview": [
          <video
            key="outcome-1"
            src="/work/event-planning/outcome-1.mp4"
            width={1916}
            height={1080}
            autoPlay
            muted
            loop
            playsInline
            aria-label="Sharing activities in a DIEMlife event"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: "var(--radius-sm)",
            }}
          />,
          <video
            key="outcome-2"
            src="/work/event-planning/outcome-2.mp4"
            width={1916}
            height={1080}
            autoPlay
            muted
            loop
            playsInline
            aria-label="The redesigned DIEMlife donation flow"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: "var(--radius-sm)",
            }}
          />,
        ],
      }}
    />
  );
}
