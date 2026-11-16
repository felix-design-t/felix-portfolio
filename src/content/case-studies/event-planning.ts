import type { CaseStudy } from "@/components/case-study/types";

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
  ],
};
