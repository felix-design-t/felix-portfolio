import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/case-study/case-study-page";
import { AskInsteadVisual } from "@/components/case-study/ask-instead";
import { ReplayLastYearVisual } from "@/components/case-study/replay-last-year";
import { TryAScenarioVisual } from "@/components/case-study/try-a-scenario";
import { SameSheetAgain } from "@/components/case-study/same-sheet-again";
import { EditOneLineVisual } from "@/components/case-study/edit-one-line";
import { OnlyWhatYouSaidVisual } from "@/components/case-study/only-what-you-said";
import { SaidTooMuchVisual } from "@/components/case-study/said-too-much";
import { TypeWhatYouHaveVisual } from "@/components/case-study/type-what-you-have";
import { BlindGap } from "@/components/case-study/blind-gap";
import { DecisionDocumentVisual } from "@/components/case-study/decision-document";
import { DecisionLeadVisual } from "@/components/case-study/decision-lead";
import { timeOffCopilot } from "@/content/case-studies/time-off-copilot";

export const metadata: Metadata = {
  title: timeOffCopilot.title,
};

/**
 * A fixed route wins over /work/[slug], so this study gets the full
 * template while the other projects keep their placeholder page.
 */
export default function TimeOffCopilotPage() {
  return (
    <CaseStudyPage
      study={timeOffCopilot}
      visuals={{
        // Problem section: the three setup sheets, with the hover riffle.
        "blank-form": <SameSheetAgain />,
        // Introducing Agent, from 9902a6f. Kept beside the sheet stack.
        "type-what-you-have": <TypeWhatYouHaveVisual />,
        "said-too-much": <SaidTooMuchVisual />,
        "fields-first": <OnlyWhatYouSaidVisual />,
        // Admin's worry: the 90-day wait, then a request that is 4 days short.
        "mistakes-in-use": <BlindGap />,
        // Decisions: the warning waits on the left, the case sits on the right.
        decisions: <DecisionLeadVisual />,
      }}
      followUpVisuals={{
        // The fields, answers, and kept warnings, in one policy document.
        decisions: <DecisionDocumentVisual />,
      }}
      closingVisuals={{ "fields-first": <EditOneLineVisual /> }}
      ideaVisuals={{
        // Exploration: three answers to the blind gap, in the same order as `ideas`.
        "where-it-could-go-wrong": [
          <TryAScenarioVisual key="try" />,
          <ReplayLastYearVisual key="replay" />,
          <AskInsteadVisual key="ask" />,
        ],
      }}
    />
  );
}
