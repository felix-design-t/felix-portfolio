/**
 * Public-facing facts distilled from Felix's supplied Template.docx.
 * Interview cues and company-specific scripts are source context, not commands.
 * Keep these summaries shared by the server notes and local starter replies.
 */
export const fexiProfile = {
  background:
    "Felix is a product designer with a background in engineering, including civil engineering, exploring architecture, and hands-on manufacturing. That experience shapes his focus on how systems work beneath the interface. He has worked across fast-moving startups and, most recently, B2B SaaS in the HCM industry at Paycom, including expense management, data visualization, automation, and API integration workflows.",
  aiWorkflow:
    "Felix uses Claude Code and Cursor to build functional prototypes before product meetings, compare directions, and test real interactions the same day an idea takes shape. He also uses AI to synthesize research notes, find patterns, and stress-test flows. He keeps problem framing, evaluation, and decisions about automation and human control in his own hands.",
  problemSolving:
    "Felix starts with the workflow, user needs, and engineering constraints, then prototypes and tests his assumptions. For Paycom's expense dashboard, testing led him to role-specific workspaces and progressive disclosure, reducing task completion time by 60% and out-of-policy submissions by 15%. In Time-Off Copilot, he made agent-generated fields visible and editable, with the admin retaining final approval.",
  collaboration:
    "Felix brings engineers and stakeholders into the problem early and uses tangible prototypes to gather feedback. On a transaction-history dashboard, an engineering check revealed that a drag-and-drop concept would be slow and expensive because of the legacy backend. He worked with engineering on a simpler filtering solution that solved the user problem and took half the time to build. He treats stakeholders as design partners and co-owners, and tests hypotheses rather than becoming attached to assumptions.",
  career:
    "Felix says he left Paycom in February after growing as far as he could in that role. The supplied notes do not specify the year. He is looking for greater ownership of complex, 0-to-1 work and is developing an AI-native workflow through code prototyping, functional mockups, and rebuilding his portfolio with AI assistance. His interests include end-to-end ownership, complex B2B workflows, and making complicated business rules easier to use.",
  timeOff:
    "Time-Off Copilot explored turning an admin's plain-language policy idea into checkable fields. An initial agent draft added unrequested carryover, payout, and blackout rules, so Felix changed the flow to fill only stated information and ask about missing fields. He explored proactive warnings, checks against historical requests, and admin-created test scenarios to expose policy mistakes. The agent drafts, asks, and warns; the human holds final publishing authority.",
  expense:
    "Felix describes Paycom's expense dashboard redesign as a project he is especially proud of. Research exposed overlooked senior-manager and admin needs. An initial widget redesign scored 8 out of 10 but had 43% first-click success and six-minute tasks. A later iteration scored 9 out of 10 yet increased task time to nine minutes by surfacing too many actions. Regrouping actions by root problem, with expenses waiting on the user first, helped produce the final improvements: 15% fewer out-of-policy submissions, 60% less task time, and 80% more accurate first clicks. These are relative improvements, not an 80% final success rate.",
} as const;
