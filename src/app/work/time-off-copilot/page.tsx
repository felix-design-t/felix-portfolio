import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/case-study/case-study-page";
import { SameSheetAgain } from "@/components/case-study/same-sheet-again";
import { OnlyWhatYouSaidVisual } from "@/components/case-study/only-what-you-said";
import { SaidTooMuchVisual } from "@/components/case-study/said-too-much";
import { TypeWhatYouHaveVisual } from "@/components/case-study/type-what-you-have";
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
      }}
    />
  );
}
