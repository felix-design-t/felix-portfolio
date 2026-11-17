import { eventPlanning } from "@/content/case-studies/event-planning";
import { expenseManagement } from "@/content/case-studies/expense-management";
import { googleMaps } from "@/content/case-studies/google-maps";
import { timeOffCopilot } from "@/content/case-studies/time-off-copilot";
import type { CaseStudy } from "@/components/case-study/types";

/**
 * The notes Fexi is allowed to answer from.
 * Each block is one case study page. The path is the page on this site.
 */
const studies: { path: string; study: CaseStudy }[] = [
  { path: "/work/time-off-copilot", study: timeOffCopilot },
  { path: "/work/expense-management", study: expenseManagement },
  { path: "/work/event-planning", study: eventPlanning },
  { path: "/work/google-maps", study: googleMaps },
];

const skippedKeys = new Set([
  "aspectRatio",
  "backdrop",
  "id",
  "kind",
  "accent",
  "icon",
  "ideasLayout",
  "unframed",
  "tradeoffs",
  "continuesPrevious",
  "hideFromNav",
  "isPlaceholderText",
]);

/** Pull the written lines out of a case study. Frames and flags stay out. */
function collectLines(value: unknown, lines: string[]) {
  if (typeof value === "string") {
    const line = value.replace(/\s+/g, " ").trim();
    if (line) lines.push(line);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectLines(item, lines);
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (skippedKeys.has(key)) continue;
      collectLines(child, lines);
    }
  }
}

export function portfolioNotes(): string {
  return studies
    .map(({ path, study }) => {
      const lines: string[] = [];
      collectLines(
        { title: study.title, meta: study.meta, sections: study.sections },
        lines,
      );
      return [`Page: ${path}`, `Title: ${study.title}`, ...lines].join("\n");
    })
    .join("\n\n");
}
