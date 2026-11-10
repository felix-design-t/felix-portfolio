import type { Metadata } from "next";
import { CaseStudyPage } from "@/components/case-study/case-study-page";
import { timeOffCopilot } from "@/content/case-studies/time-off-copilot";

export const metadata: Metadata = {
  title: timeOffCopilot.title,
};

/**
 * A fixed route wins over /work/[slug], so this study gets the full
 * template while the other projects keep their placeholder page.
 */
export default function TimeOffCopilotPage() {
  return <CaseStudyPage study={timeOffCopilot} />;
}
