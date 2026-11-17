import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/case-study/case-study-page";
import { googleMaps } from "@/content/case-studies/google-maps";
import { ContextThought } from "./context-thought";
import { IdeationFilter } from "./ideation-filter";
import { IdeationFork } from "./ideation-fork";
import { IdeationWalk } from "./ideation-walk";
import { IterationEntry } from "./iteration-entry";
import { IterationHierarchy } from "./iteration-hierarchy";
import { IterationMaterial } from "./iteration-material";
import { IterationRedraw } from "./iteration-redraw";
import { IterationPriority } from "./iteration-priority";
import { OutcomePair } from "./outcome-pair";
import { ResearchPains } from "./research-pains";
import { ResearchProfile } from "./research-profile";
import "./maps-cover.css";
import "./unpack-question.css";

export const metadata: Metadata = {
  title: googleMaps.title,
};

/**
 * A fixed route wins over /work/[slug], so this study uses the same
 * template as Event Planning.
 *
 * The cover is an empty plate of that study's size. cover-sequence
 * holds the shape. The screenshot is not in yet, so nothing sits on
 * top of the plate. The wash is the stone preset.
 */
export default function GoogleMapsPage() {
  return (
    <CaseStudyPage
      study={googleMaps}
      cover={
        <div className="maps-cover">
          <img
            src="/work/google-maps/google-maps.svg"
            alt="Google Maps"
            width={2017}
            height={1816}
            draggable={false}
          />
        </div>
      }
      visuals={{
        context: <ContextThought />,
        research: <ResearchProfile />,
      }}
      ideaVisuals={{
        "outcome-overview": [<OutcomePair key="outcomes" />],
        ideation: [
          <IdeationFilter key="filter" />,
          <IdeationWalk key="walk" />,
          <IdeationFork key="fork" />,
        ],
        iteration: [
          <IterationPriority key="priority" />,
          <IterationEntry key="entry" />,
          <IterationHierarchy key="hierarchy" />,
          <IterationRedraw
            key="route"
            label="redesigned route selection feature"
            before={{
              src: "/work/google-maps/iteration-4.1.png",
              alt: "The earlier route screen, with plain pins inside the walk circle",
              width: 236,
              height: 509,
            }}
            after={{
              src: "/work/google-maps/iteration-4.2.png",
              alt: "The redrawn route screen, with walk times on each stop",
              width: 236,
              height: 509,
            }}
          />,
          <IterationRedraw
            key="events"
            label="redesigned live event feature"
            before={{
              src: "/work/google-maps/iteration-5.1.png",
              alt: "The earlier live event card for Love Sculpture",
              width: 236,
              height: 509,
            }}
            after={{
              src: "/work/google-maps/iteration-5.2.png",
              alt: "The redrawn live events, with Live marks and a concert card",
              width: 235,
              height: 509,
            }}
          />,
          <IterationMaterial key="material" />,
        ],
        "final-design": [<OutcomePair key="final" />],
      }}
      followUpVisuals={{
        research: <ResearchPains />,
      }}
    />
  );
}
