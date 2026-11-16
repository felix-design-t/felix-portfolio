import type { CaseStudy, CaseStudySectionKind } from "@/components/case-study/types";

/**
 * Event Planning page copy.
 *
 * Opening, then Context. Later sections stay off this page until their copy exists.
 * The cover wash is the tide preset: warm sand, a quiet aqua,
 * and apricot blush.
 */
export const eventPlanning: CaseStudy = {
  title: "Event Planning",
  cover: {
    label: "Cover",
    aspectRatio: "16 / 10",
    backdrop: "tide",
  },
  meta: [
    { label: "Timeline", value: "April 2024 - June 2024" },
    { label: "My role", value: "Product Designer" },
    { label: "Tools", value: "Figma / Miro / Jira / Notion" },
    { label: "Collaborators", value: "Founder, 2 Software Engineers" },
  ],
  sections: [
    {
      id: "outcome-overview",
      kind: "Outcome Overview",
      title:
        "Average user engagement rate increased by 25% and raised upwards of $100,000 in funds",
      body: "As a product designer at DIEMlife, I helped 4+ organizations run 10+ events, raising over $100,000 and boosting user engagement by 25%.",
      ideas: [
        {
          title: "01. Post Activities and Engage with the Community",
          body: "Users can share their activities and engagement with tasks in DIEMlife events, allowing them to get more involved and help the community grow.",
          name: "Post activities",
          aspectRatio: "1916 / 1080",
        },
        {
          title: "02. Donation Flow",
          body: "Users are motivated to donate to support others in achieving their goals, granting creators enough funds to organize events. The redesigned interface streamlines the donation flow, giving users an elevated experience as they make an impact.",
          name: "Donation flow",
          aspectRatio: "1916 / 1080",
        },
      ],
    },
    {
      id: "context",
      kind: "Context",
      title:
        "DIEMlife is a platform that improves employees' well-being and productivity through events.",
      body: "As remote work grew after the pandemic, employee engagement declined. DIEMlife introduced \"Quest,\" a tool for companies to organize events where employees join solo or in teams, complete tasks, and share their activity. Along the way, participants are encouraged to donate and help others reach their community goals.",
      visual: {
        name: "Context",
        aspectRatio: "16 / 9",
      },
    },
    {
      id: "research",
      kind: "Research" as CaseStudySectionKind,
      title: "Quick statistics on current user engagement",
      body: "Quest, the main tool companies use to organize events, had low retention and engagement, leaving clear room to better meet company goals.",
      ideas: [
        {
          name: "Research stats",
          aspectRatio: "16 / 5",
        },
        {
          title: "Why did users fail to actively engage with the platform?",
          body: "To understand the numbers, I ran 11 in-depth interviews and collected 153 survey responses with past users, which revealed two main insights:",
          name: "Why engagement failed",
          aspectRatio: "16 / 10",
          unframed: true,
        },
        {
          title: "01. Lack of call-to-action to get involved on the platform",
          body: "Checking off tasks was users' only way to engage, so they got bored quickly. With few online activities, they never formed a connection with the platform and wanted more ways to interact with other participants.",
          name: "Lack of call to action",
          aspectRatio: "751 / 551",
        },
        {
          title: "02. 15% of the users need financial support to achieve their goals",
          body: "15% is a small share, but across participating users it is a real group who stay motivated and still cannot engage. Donations are too low to cover what they need.",
          name: "Financial support",
          aspectRatio: "16 / 10",
        },
      ],
    },
    {
      id: "actionable-question",
      kind: "Unpack Insights to an actionable question…",
      title: "Unpack insights to an actionable question...",
      hideFromNav: true,
      body: "How might I reconstruct the platform's features to ensure employees are actively engaged and adequately funded to reach their objectives?",
      statement: {
        eyebrow: "Unpack insights to an actionable question...",
        text: "How might I reconstruct the platform's features to ensure employees are actively engaged and adequately funded to reach their objectives?",
        highlights: ["actively engaged", "adequately funded"],
        accent: "cyan",
        icon: "question",
      },
    },
    {
      id: "design-ideation",
      kind: "Design Ideation" as CaseStudySectionKind,
      title: "North Star: Social elements is the key to enhance community engagement",
      body: "Checking off assigned tasks was not enough. The research pointed to a community that feels like working in person, so I designed two approaches: share experiences, make connections, and support each other while pursuing individual goals.",
      ideas: [
        {
          name: "Revamped user flow",
          aspectRatio: "16 / 9",
        },
        {
          title: "01. New social feature: Activity Posts",
          body: "Activity posts let people share task progress with others in the same event. Research showed that is how they socialize and find people with the same interests.",
          name: "Activity posts",
          aspectRatio: "1916 / 1080",
        },
        {
          title: "02. Donation flow redesign",
          body: "Raising donations helps people who cannot fund their own goals. I split the flow into clearer steps, added more ways to customize a gift, and let donors share the impact they made.",
          name: "Donation flow compare",
          aspectRatio: "16 / 10",
        },
        {
          name: "Donation screens",
          aspectRatio: "16 / 10",
        },
      ],
    },
    {
      id: "iteration",
      kind: "Iteration" as CaseStudySectionKind,
      title:
        "Users appreciate the social elements added, but there are some situations to improve",
      body: "After ideation I ran 7 rounds of testing. Everyone preferred the clearer screens. I then iterated in three areas: Visual, Interaction, and Functionality.",
      ideas: [
        {
          title: "Visual: Crafting the ideal feed post card",
          body: "After someone posts, the feed card shows the activity and the responses. These cards shape most of how the feed looks.",
          name: "Post layout options",
          aspectRatio: "16 / 10",
        },
        {
          name: "Tag color options",
          aspectRatio: "16 / 10",
        },
        {
          title: "Interaction: Maximizing donation efficiency",
          body: "Dropdowns hid the amount and tip choices, so donating took extra clicks. I replaced them with a sliding bar that keeps every option visible and easy to customize.",
          name: "Donation interaction",
          aspectRatio: "16 / 10",
        },
        {
          title: "Functional: Sharing impact after donation",
          body: "The step-by-step flow worked, but the ending gave people no way to share their gift. I added a share step so a donation can reach the rest of the community.",
          name: "Share step compare",
          aspectRatio: "16 / 10",
        },
        {
          name: "Share step motion",
          aspectRatio: "1916 / 1080",
        },
      ],
    },
    {
      id: "measuring-success",
      kind: "Measuring Success",
      title:
        "After the social redesign, 4+ partners hosted 10+ events on DIEMlife. Engagement rose 25%, and the events raised over $100,000.",
      ideas: [
        {
          name: "Post activities",
          aspectRatio: "1916 / 1080",
        },
        {
          name: "Donation flow",
          aspectRatio: "1916 / 1080",
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
          title: "01. The key is to integrate online and offline experiences",
          body: "DIEMlife gives companies a place to launch events and build connections, but employees still have to carry those activities offline. I need to connect the two experiences, and I am designing the mobile app to make that easier.",
          name: "Online and offline",
          aspectRatio: "16 / 10",
          unframed: true,
        },
        {
          title: "02. Potential data analysis and display features",
          body: "Employees want to see their own progress, and companies want a clear measure of engagement. A dashboard can meet both needs, and it will take backend work with engineering.",
          name: "Data analysis",
          aspectRatio: "16 / 10",
          unframed: true,
        },
      ],
    },
  ],
};
