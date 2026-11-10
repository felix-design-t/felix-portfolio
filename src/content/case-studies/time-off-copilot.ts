import type { CaseStudy } from "@/components/case-study/types";

/**
 * Time-Off Copilot page copy.
 *
 * Every string comes from the web page spec, word for word. Lines the
 * spec marks "Deck later" are left out. Each `visual` is the planned
 * frame; until it is built, the page draws a placeholder with that name.
 */
export const timeOffCopilot: CaseStudy = {
  title: "Time-Off Copilot",
  cover: {
    label: "Cover, content later.",
    aspectRatio: "16 / 10",
  },
  meta: [
    { label: "Project", value: "Time-Off Copilot" },
    { label: "Timeline", value: "January – February 2026" },
    { label: "My role", value: "Product Designer" },
    { label: "Tools", value: "Figma / Claude Code / Cursor" },
    {
      label: "Collaborators",
      value: "1 Product Manager, 2 Software Engineers",
    },
  ],
  sections: [
    {
      id: "blank-form",
      kind: "Problem",
      title: "Every rule starts from a blank form",
      body: "Admins set up time-off rules for every type: PTO, sick, parental, and more. Each rule is a stack of variables entered by hand. It takes too long, and a missed or mistyped field is easy.",
      visual: {
        name: "Blank setup form",
        caption: "Six rows, one mismatched accrual",
        aspectRatio: "16 / 10",
      },
    },
    {
      id: "type-what-you-have",
      kind: "Feature",
      title: "Type what you have in mind",
      body: "The agent keeps setup structured. The admin types their first thoughts. The agent captures the key information and points at what is still missing.",
      visual: {
        name: "Note and checklist",
        caption: "Sample note, captured and missing",
        aspectRatio: "16 / 10",
      },
    },
    {
      id: "said-too-much",
      kind: "Problem",
      title: "The agent said too much",
      body: "Next, I let the agent fill the gaps on its own. It overstepped. It wrote a full draft with carryover, payout, and blackout dates no one asked for. It was overwhelming, and none of it became a field the admin could check.",
      visual: {
        name: "Unasked draft",
        caption: "Extra parts marked, checklist unchanged",
        aspectRatio: "16 / 10",
      },
    },
    {
      id: "fields-first",
      kind: "Feature",
      title: "Fields first, questions, then the rule",
      body: "The agent now turns only the key information into fields. Where something is missing, it asks a question instead of guessing. It writes the rule only after the admin confirms.",
      visual: {
        name: "Field chips and questions",
        caption: "Fields, Ask, Confirm, Generate",
        aspectRatio: "16 / 10",
      },
    },
    {
      id: "mistakes-in-use",
      kind: "Problem",
      title: "Mistakes only show up in use",
      body: "Today a rule is published, and its mistakes wait until an employee makes a request. The request is approved or denied for the wrong reason. Only then does the admin go back and change the rule.",
      visual: {
        name: "Decided request",
        caption: "Day 40, approved, rule changed after",
        aspectRatio: "16 / 10",
      },
    },
    {
      id: "where-it-could-go-wrong",
      kind: "Feature",
      title: "See where it could go wrong",
      body: "Before anything is published, the agent troubleshoots. It compares the new rule with the current rules, shows where they conflict, and points at what could go wrong.",
      visual: {
        name: "Draft and current rules",
        caption: "Compare, one Conflict marked",
        aspectRatio: "16 / 10",
      },
    },
    {
      id: "test-your-scenarios",
      kind: "Feature",
      title: "Test your own scenarios",
      body: "Then the admin gets a space to name scenarios and test them. They decide which cases matter. They confirm and apply only when the results look right. The agent never publishes.",
      visual: {
        name: "Scenario tests",
        caption: "Test, Confirm, then Apply",
        aspectRatio: "16 / 10",
      },
    },
    {
      id: "reflection",
      kind: "Reflection",
      title: "Reflection",
      body: "Content later. Felix will provide it.",
      isPlaceholderText: true,
    },
  ],
};
