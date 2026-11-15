import type { AnnotatedNote } from "@/components/case-study/annotated-image";
import type { SuccessBlock } from "@/components/case-study/SuccessResults";
import type { TimelineStep } from "@/components/case-study/IterationTimeline";
import type { ResultsComparisonData } from "@/components/case-study/ResultsComparison";
import type { StaircaseLevel } from "@/components/case-study/StaircaseDiagram";
import type { CaseStudy } from "@/components/case-study/types";

/**
 * Expense Management page copy.
 *
 * The outcome paragraph is a shorter version of the original copy.
 * Problem pins are percentages of the screenshot: 0 is the top-left,
 * 100 is the bottom-right. Change `x` and `y` to move a pin.
 */
export const expenseManagement: CaseStudy = {
  title: "Expense Management Redesign",
  cover: {
    label: "Cover",
    aspectRatio: "16 / 10",
    backdrop: "dusk",
  },
  meta: [
    { label: "Timeline", value: "February 2025 – April 2025" },
    { label: "My role", value: "Product Designer" },
    { label: "Tools", value: "Figma / Claude Code / Dovetail / Notion" },
    {
      label: "Collaborators",
      value: "1 Product Manager, 2 Researchers, 3 Software Engineers",
    },
  ],
  sections: [
    {
      id: "outcome-overview",
      kind: "Outcome Overview",
      title:
        "Out-of-Policy submission reduced by 15% and average task completion time reduced by 60%",
      body: "Role-specific workspaces and progressive disclosure turned a roadblock into a streamlined tool for underrepresented users and raised engagement.",
      visual: {
        name: "Legacy and Redesign",
        aspectRatio: "2160 / 1536",
      },
    },
    {
      id: "problem",
      kind: "Problem",
      title: "The legacy dashboard becomes a roadblock to user's workflows",
      body: "",
      visual: {
        name: "Legacy dashboard",
        aspectRatio: "1050 / 866",
      },
    },
    {
      id: "analysis",
      kind: "Analysis",
      title:
        "Supervisors are overwhelmed and senior managers finds unusable",
      body: "From preliminary moderated research, I analyzed current user behaviors and patterns to test the following assumptions:",
      ideas: [
        {
          title: "01. Unmet needs from underrepresented user groups",
          body: "The dashboard was built for one user, junior managers, and ignored the analytical and oversight needs of Senior Managers and Admins.",
          name: "Unmet needs",
          aspectRatio: "16 / 10",
        },
        {
          title: "02. Information Overload",
          body: "A cluttered table increased cognitive load. Risk indicators were separated and unclear, which confused users further when they acted on expenses.",
          name: "Information overload",
          aspectRatio: "16 / 10",
        },
      ],
    },
    {
      id: "design-objective",
      kind: "Design Objective",
      title: "Design Objective",
      body: "Introduce and optimize widgets and visual representation to enhance usability, enabling users to discover issues and complete key tasks more efficiently.",
      hideFromNav: true,
      statement: {
        eyebrow: "Design Objective",
        text: "Introduce and optimize widgets and visual representation to enhance usability, enabling users to discover issues and complete key tasks more efficiently.",
        highlights: [
          "discover issues",
          "complete key tasks more efficiently",
        ],
      },
    },
    {
      id: "initial-design",
      kind: "Initial Design Approach",
      title: "Data visualization and information hierarchy reorganization",
      body: "I added 4 new widgets to meet the analytical needs of senior managers and admins, then reorganized the dashboard around them: a new \"Insights\" section on top for strategic operational data, and the existing \"Action Items\" list below so managers can focus on approvals.",
      ideas: [
        {
          title: "01. Make key data accessible and informational",
          name: "Key data",
          aspectRatio: "1080 / 768",
        },
        {
          title: "02. From user-driven search to system-driven actions and alerts",
          name: "Status and actions",
          aspectRatio: "998 / 530",
        },
      ],
    },
    {
      id: "usability-testing",
      kind: "Usability Testing Debrief",
      title: "",
      body: "",
      ideas: [
        {
          title: "01. Visibility without action",
          body: "Users valued the new widgets, but they offered no follow-up actions. Users still had to scroll down to the table to act, which increased task time and lowered first-click success.",
          name: "Visibility without action",
          aspectRatio: "1040 / 102",
        },
        {
          title: "02. Identifying common needs and optimizing information hierarchy",
          body: "A big gap between the widgets and the table sent users to an overwhelming review screen, even though most actions don't need full details. Every user group makes decisions on expenses, just for different purposes.",
          name: "Common needs",
          aspectRatio: "1628 / 528",
        },
      ],
    },
    {
      id: "actionable-question",
      kind: "Unpack Insights to an actionable question…",
      title: "Unpack Insights to an actionable question…",
      hideFromNav: true,
      body: "How might I refine information hierarchy and streamline expense approval workflow to improve efficiency for managers?",
      statement: {
        eyebrow: "New problem showed up...",
        text: "How might I refine information hierarchy and streamline expense approval workflow to improve efficiency for managers?",
        highlights: [
          "refine information hierarchy",
          "streamline expense approval workflow",
        ],
        accent: "violet",
        icon: "question",
      },
    },
    {
      id: "iteration-approach",
      kind: "Iteration Approach",
      title: "",
      body: "",
      ideas: [
        {
          title: "01. Dedicated workspaces for daily actionable tasks",
          body: "I added 2 action-oriented widgets and a step-by-step approval flow. Review data is split into manageable levels, so users get more detail only when they need it.",
          name: "Dedicated workspaces",
          aspectRatio: "2160 / 1536",
        },
        {
          title: "02. Simplifying decision-making with progressive information disclosure",
          body: "Instead of sending everyone straight to the full review screen, each step reveals only what's needed to act. Users can stop at the level that fits their purpose.",
          name: "Progressive disclosure",
          aspectRatio: "16 / 10",
          unframed: true,
        },
      ],
    },
    {
      id: "further-testing",
      kind: "Further Testing Results",
      title: "Surfacing more actionable information causing information overload",
      body: "Testing showed that surfacing CTAs isn't enough. Information needs structure that guides users toward resolving issues, not a long list of items that overwhelms them.",
      visual: {
        name: "Further testing results",
        aspectRatio: "3 / 2",
      },
    },
    {
      id: "further-design-changes",
      kind: "Further Design Changes",
      title: "More direct and efficient information display for CTA widgets",
      body: "The last iteration improved usability but not efficiency. So I asked which daily actions matter most, and regrouped the CTAs by root problem to match how users work through tasks.",
      ideas: [
        {
          name: "Design changes timeline",
          aspectRatio: "3 / 4",
          unframed: true,
        },
      ],
    },
    {
      id: "measuring-success",
      kind: "Measuring Success",
      title: "Measuring Success",
      body: "The redesigned dashboard focused on data visualization and a streamlined approval workflow.",
      ideas: [
        {
          name: "Success results",
          aspectRatio: "16 / 10",
          unframed: true,
        },
      ],
    },
    {
      id: "reflections",
      kind: "Reflections",
      title: "",
      body: "",
      ideasLayout: "columns",
      ideas: [
        {
          title: "01. Testing discovers, not just validates",
          body: "I went into Round 2 thinking the CTA and hierarchy problems were solved, but users revealed a new need: focusing on critical tasks and summary reports. Usability testing's real value is finding new problems, not just validating solutions.",
          name: "Testing discovers",
          aspectRatio: "16 / 10",
          unframed: true,
        },
        {
          title: "02. Future AI integration",
          body: "AI could auto-approve high-confidence, low-risk submissions, like recurring expenses or in-policy meals under $25. Managers could then focus only on the complex exceptions that need human judgment.",
          name: "Future AI integration",
          aspectRatio: "16 / 10",
          unframed: true,
        },
      ],
    },
  ],
};

/**
 * The three pins on the problem screenshot, and the card under each one.
 * `x` moves a pin left to right. `y` moves it top to bottom.
 */
export const overloadNotes: AnnotatedNote[] = [
  {
    id: "1",
    x: 50,
    y: 50,
    stat: "",
    label: "Failed to highlight key Information",
    detail: "Lack of quick decisioning actions",
  },
];

export const overloadRiskNotes: AnnotatedNote[] = [
  {
    id: "2",
    x: 50,
    y: 50,
    stat: "",
    label: "",
    detail:
      "Inconsistent label and color usage made users confused to quickly identify the problems.",
    cardSide: "left",
  },
];

export const iterationOneNotes: AnnotatedNote[] = [
  {
    id: "1",
    /* Percentages of the screenshot. 0 is the top-left. */
    x: 26,
    y: 34,
    stat: "Actionable Task Surfacing",
    label: "",
    detail:
      "Groups managers' most critical daily tasks in the most visible spot, so they can plan their work faster.",
  },
  {
    id: "2",
    x: 74,
    y: 34,
    stat: "Expense Warning System Alerts",
    label: "",
    detail:
      "System alerts flag potential risks throughout the decision, raising task success and cutting time on task.",
    cardSide: "left",
  },
];

export const iterationSlides: {
  src: string;
  label: string;
  caption: string;
  scale: number;
}[] = [
  {
    src: "/work/expense-redesign/iteration-2.1.png",
    label: "CTA",
    caption: "CTA overview to initiate the action",
    scale: 0.45,
  },
  {
    src: "/work/expense-redesign/iteration-2.2.png",
    label: "Card",
    caption: "Essential information for quick approval",
    scale: 0.45,
  },
  {
    src: "/work/expense-redesign/iteration-2.3.png",
    label: "Drawer",
    caption: "Review attached receipt for matching info",
    scale: 0.8,
  },
  {
    src: "/work/expense-redesign/iteration-2.4.png",
    label: "Full Review",
    caption: "All fields, only for rare complex cases",
    scale: 1,
  },
];

/** Information levels for the staircase. Each row is one step deeper. */
export const informationLevels: StaircaseLevel[] = [
  {
    name: "Policy Adherence",
    tag: "Card · essential info",
    fields: [
      "Expense Status",
      "Policy & Rules",
      "Descriptions",
      "Type",
      "Submitted Date",
      "Amount",
      "Warnings",
    ],
  },
  {
    name: "Re-Validation",
    tag: "Drawer · on expand",
    fields: [
      "Receipts",
      "Departments",
      "Labor Allocation",
      "Paid In Country",
      "Edit Access",
    ],
  },
  {
    name: "All-Inclusive",
    tag: "Full Review · rare cases",
    fields: [
      "Approval Workflow",
      "Comments",
      "Exceptions",
      "Account",
      "Mileage",
      "Trip Route",
    ],
  },
];

/** Round 1 vs Round 2 usability results, with what testers said. */
export const furtherTestingResults: ResultsComparisonData = {
  headings: ["Round 1", "Round 2", "Feedback"],
  rows: [
    {
      metric: "Widget usability",
      round1: "8/10",
      round2: "9/10",
      verdict: "improved",
      tone: "good",
      quote: "Widgets provide great insights and guidance on what I should do.",
    },
    {
      metric: "First click success rate",
      round1: "43%",
      round2: "56%",
      verdict: "improved but still low",
      tone: "mixed",
      quote: "It's good to have actionable items but still don't know priority.",
    },
    {
      metric: "Task completion time",
      round1: "6 mins",
      round2: "9 mins",
      verdict: "worse",
      tone: "bad",
      quote:
        "It feels overwhelming to see at least 8 items on the dashboard I have to complete.",
    },
  ],
};

/** Iterations and the reflections between them, in order. */
export const designChangeSteps: TimelineStep[] = [
  {
    kind: "iteration",
    images: [
      {
        src: "/work/expense-redesign/change-1.png",
        alt: "First iteration of the CTA widgets, screen 1 of 2",
        width: 972,
        height: 276,
      },
      {
        src: "/work/expense-redesign/change-2.png",
        alt: "First iteration of the CTA widgets, screen 2 of 2",
        width: 972,
        height: 276,
      },
    ],
  },
  {
    kind: "reflection",
    title: "Re-group actions by importance",
    body: "The surface should show only what every user group needs first. I moved secondary information into the follow-up action flows.",
  },
  {
    kind: "iteration",
    images: [
      {
        src: "/work/expense-redesign/change-3.png",
        alt: "Second iteration of the CTA widgets, screen 1 of 2",
        width: 981,
        height: 264,
      },
      {
        src: "/work/expense-redesign/change-4.png",
        alt: "Second iteration of the CTA widgets, screen 2 of 2",
        width: 981,
        height: 264,
      },
    ],
  },
  {
    kind: "reflection",
    title: "Clarified summary for discoverability",
    body: "\u201CExpenses waiting on me\u201D is the #1 daily task for every user group. For senior managers, the report summary became the bridge between discovery, deeper data, and follow-up actions.",
  },
  {
    kind: "iteration",
    final: true,
    images: [
      {
        src: "/work/expense-redesign/change-5.png",
        alt: "Final design of the CTA widgets",
        width: 1980,
        height: 546,
      },
    ],
  },
];

/** Result blocks for Measuring Success, in reading order. */
export const successBlocks: SuccessBlock[] = [
  {
    label: "Data Visualization Hub",
    title: "Surfacing policy risks early cut out-of-policy submissions by 15%",
    stats: [
      {
        direction: "down",
        value: "15%",
        label: "out-of-policy submissions",
      },
    ],
    image: {
      src: "/work/expense-redesign/success-1.png",
      alt: "Data visualization hub showing policy risks on the dashboard",
      width: 1125,
      height: 800,
      name: "success-1.png",
    },
  },
  {
    label: "Review Screen",
    title:
      "Progressive review made approvals 60% faster and first clicks 80% more accurate",
    stats: [
      { direction: "down", value: "60%", label: "task completion time" },
      { direction: "up", value: "80%", label: "first click success rate" },
    ],
    image: {
      src: "/work/expense-redesign/success-2.png",
      alt: "Progressive review screen for approving an expense",
      width: 1125,
      height: 800,
      name: "success-2.png",
    },
  },
];

export const problemNotes: AnnotatedNote[] = [
  {
    id: "1",
    x: 32,
    y: 44,
    stat: "60% DAU",
    label: "Low engagement",
    detail: "40% of target users skipped the dashboard daily.",
  },
  {
    id: "2",
    x: 64,
    y: 52,
    stat: "Policy misses",
    label: "Low task success",
    detail:
      "Out-of-policy expenses got approved, creating financial and compliance risk.",
  },
  {
    id: "3",
    x: 14,
    y: 68,
    stat: "6 min",
    label: "High time-on-task",
    detail: "The average approval took 6 minutes.",
  },
];

/**
 * Pins on the first approach screenshot.
 * `x` moves a pin left to right. `y` moves it top to bottom.
 */
export const approachOneNotes: AnnotatedNote[] = [
  {
    id: "1",
    x: 68,
    y: 28,
    stat: "Prioritize Expense Status Oversight",
    label: "",
    detail:
      "Senior managers and admins needed data visualization and oversight to see and control operations at a glance.",
  },
];

/**
 * Pins on the second approach screenshot.
 * `x` moves a pin left to right. `y` moves it top to bottom.
 */
export const approachTwoNotes: AnnotatedNote[] = [
  {
    id: "1",
    x: 22,
    y: 48,
    stat: "Flag Expenses by Status",
    label: "",
    detail:
      "Clear status indicators show at a glance where each expense stands and what to do next.",
  },
  {
    id: "2",
    x: 90,
    y: 52,
    stat: "Quick Actions for Faster Approvals",
    label: "",
    detail:
      "The legacy design front-loaded every detail, but research showed 70% of expenses can be handled from surface-level info.",
  },
];
