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
      id: "overview",
      kind: "Context",
      navTitle: "Context & Problem",
      title: "Picture an admin setting up time off policies for thousands of employees...",
      body: "Admins set up time off policies for a company: PTO, sick, jury duty, and more. Each policy is a collection of rules made of fields. They have the idea in mind, but not every variable. Legal and compliance, financial management, and employee culture all affect those variables.",
    },
    {
      id: "blank-form",
      kind: "Problem",
      continuesPrevious: true,
      title: "But the policy wants every variable, filled in by hand",
      body: "Entering each one takes too long. A missed or mistyped field is easy to make, and nothing flags it.",
      visual: {
        name: "The same sheet, again",
        aspectRatio: "16 / 10",
      },
    },
    {
      id: "type-what-you-have",
      kind: "Introducing Agent",
      title: "Type what you have in mind",
      body: "An admin starts by typing their thoughts. The agent handles the rest, which lowers the stress of not knowing where to start.",
      visual: {
        name: "Note and checklist",
        aspectRatio: "16 / 10",
      },
    },
    {
      id: "said-too-much",
      kind: "First Attempt",
      title: "The agent said too much",
      body: "The agent filled the gaps on its own. It overstepped. It wrote a full draft with carryover, payout, and blackout dates no one asked for. It was overwhelming, and none of it became a field the admin could check.",
      visual: {
        name: "Unasked draft",
        aspectRatio: "16 / 10",
      },
    },
    {
      id: "fields-first",
      kind: "Trust Building",
      title: "Your words become fields, every change stays visible",
      body: "The agent fills only what the admin said and asks about anything missing. They can edit and undo it, and nothing moves on until they confirm.",
      visual: {
        name: "Field chips and questions",
        caption: "Fields from your words, then Generate",
        aspectRatio: "16 / 10",
      },
      closingVisual: {
        name: "See every change, keep what you want",
        caption: "Edit a value, one line changes, Undo",
        aspectRatio: "16 / 10",
      },
    },
    {
      id: "mistakes-in-use",
      kind: "Admin's Worry",
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
      kind: "Exploration",
      tradeoffs: true,
      tradeoffNote:
        "Pros: a comprehensive overview. Cons: not every warning is an error, so it can overwhelm admins.",
      title: "The agent provides proactive warnings",
      body: "Before anything is published, the agent troubleshoots. It compares the new rule with the current rules, shows where they conflict, and points at what could go wrong.",
      visual: {
        name: "Draft and current rules",
        caption: "Compare, one Conflict marked",
        aspectRatio: "16 / 10",
      },
      followUp: {
        title: "Test your own scenarios",
        body: "Then the admin gets a space to name scenarios and test them. They decide which cases matter. They confirm and apply only when the results look right. The agent never publishes.",
        visual: {
          name: "Scenario tests",
          caption: "Test, Confirm, then Apply",
          aspectRatio: "16 / 10",
        },
        tradeoffNote:
          "Pros: the admin knows the worst scenario from experience, and the test is straightforward. Cons: a missed error can become a problem later.",
      },
    },
    {
      id: "decisions",
      kind: "Decisions",
      navTitle: "Decisions",
      title: "Decision 01: The admin holds the lead. The warning only assists.",
      body: "Not every warning is an error, so the warning stays an assistant. The admin reads it, decides what matters, and confirms before anything is applied. The agent never publishes.",
      visual: {
        name: "Content later.",
        aspectRatio: "16 / 10",
      },
      followUp: {
        title: "Decision 02: One document for the final policy.",
        body: "Setup is many fields. The result is one document. The fields, the answers, and the warnings the admin kept all land there, so they review one place and approve the policy that ships.",
        visual: {
          name: "Content later.",
          aspectRatio: "16 / 10",
        },
      },
    },
    {
      id: "solution",
      kind: "Solution",
      navTitle: "Solution",
      title: "Set up a time-off policy without the mistakes or the stress.",
      body: "The agent helps the admin finish setup faster. It takes over the manual entry, so a missed or mistyped field does not slip through, and it flags conflicts before the policy is published. Seeing each decision gives the admin the confidence to approve.",
      visual: {
        name: "Content later.",
        aspectRatio: "16 / 10",
      },
      closingVisual: {
        name: "Content later.",
        aspectRatio: "16 / 10",
      },
    },
    {
      id: "reflection",
      kind: "Reflection",
      navTitle: "Reflection",
      title: "Faster was the easy part. Trust was the boundary.",
      body: "The agent earned speed the moment it could fill the form. It lost the admin the moment it filled in what nobody asked for. In an agentic product, the design is the handoff: the agent drafts, asks, and warns, and only the human publishes.",
    },
  ],
};
