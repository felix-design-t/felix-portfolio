import type { CaseStudy, CaseStudySectionKind } from "@/components/case-study/types";

/**
 * Google Maps page copy.
 *
 * Opening, Outcome Overview, Context, then Research. Later sections
 * stay off this page until their copy exists.
 * The cover is an empty plate. Its size comes from the same cover-sequence
 * shape Event Planning uses, so the slot matches that study before a
 * screenshot is dropped in.
 */
export const googleMaps: CaseStudy = {
  title: "Google Maps",
  cover: {
    label: "Cover",
    aspectRatio: "16 / 10",
    backdrop: "stone",
  },
  meta: [
    { label: "Timeline", value: "3 Months" },
    { label: "My role", value: "Product Designer" },
    { label: "Tools", value: "Figma / Miro / Notion" },
    { label: "Collaborator", value: "1 Researcher" },
  ],
  sections: [
    {
      id: "outcome-overview",
      kind: "Outcome Overview",
      title: "Walk Explore adds surprise and control to city walking",
      body: "Nearly 60% of tourists choose a city. The feature lives in Google Maps and helps tourists and residents walk it with both.",
      ideas: [
        {
          name: "Walk Explore",
          aspectRatio: "16 / 10",
          unframed: true,
        },
      ],
    },
    {
      id: "context",
      kind: "Context",
      title: "Free time opens between the spots you already planned",
      body: "In the summer of 2022, over 93 million Americans travelled in US and abroad, relying on navigation apps. Of these, 63% prefer urban areas for their vacations. While tourists often reported misguided and confused with current travel experience.",
      visual: {
        name: "The gap between plans",
        aspectRatio: "1 / 1",
      },
    },
    {
      id: "research",
      kind: "Research" as CaseStudySectionKind,
      title:
        "Tourists explore the city on foot using Google Maps for navigation.",
      body: "From 500 survey responses, city tourists share two habits: Google Maps, and walking.",
      visual: {
        name: "Who walks with Google Maps",
        aspectRatio: "16 / 7",
      },
      followUp: {
        title: "Why Google Maps may not be ideal for walking tourists?",
        body: "After conducting 12 in-depth interviews with selected user groups, we identified two main pain points that hinder walking tourists from exploring the city with ease.",
        visual: {
          name: "Interview pains",
          aspectRatio: "16 / 6",
        },
      },
    },
    {
      id: "unpack-insights",
      kind: "Unpack Insights to an actionable question…",
      title: "Unpack insights...",
      hideFromNav: true,
      body: "How might we design a route selection feature for Google Maps to encourage walking tourists to take more exploration in cities?",
      statement: {
        eyebrow: "Unpack insights...",
        text: "How might we design a route selection feature for Google Maps to encourage walking tourists to take more exploration in cities?",
        highlights: ["encourage walking tourists to take more exploration"],
        accent: "blue",
        icon: "question",
      },
    },
    {
      id: "ideation",
      kind: "Ideation" as CaseStudySectionKind,
      title: "",
      body: "",
      ideas: [
        {
          title: "01. A display filter that retains only essential information",
          name: "Display filter",
          aspectRatio: "16 / 9",
        },
        {
          title:
            "02. A preset walk-time estimation circle that provides travel destinations",
          name: "Walk time",
          aspectRatio: "16 / 9",
        },
        {
          title: "03. Provide destination options customized to different cities",
          name: "City options",
          aspectRatio: "16 / 9",
        },
      ],
    },
    {
      id: "iteration",
      kind: "Iteration" as CaseStudySectionKind,
      title: "How does walk explore stay easy to reach without interrupting the day?",
      titleHighlights: ["walk explore"],
      body: "",
      ideas: [
        {
          title: "01. Define feature priority based on different scenarios",
          name: "Feature priority",
          aspectRatio: "16 / 10",
        },
        {
          title: "02. Entry point placement",
          name: "Entry point",
          aspectRatio: "16 / 10",
        },
        {
          title: "03. Define feature hierarchy based on scenarios",
          name: "Feature hierarchy",
          aspectRatio: "16 / 10",
        },
        {
          title: "04. We redrew the pieces so they match Google Maps",
          name: "Redrawn pieces",
          aspectRatio: "16 / 10",
        },
        {
          name: "Redrawn live events",
          aspectRatio: "16 / 10",
        },
        {
          name: "Material details",
          aspectRatio: "16 / 10",
        },
      ],
    },
    {
      id: "final-design",
      kind: "Final Design" as CaseStudySectionKind,
      title:
        "Walk Explore introduced two main features for tourists and city residents to explore the city with both surprise and control.",
      body: "",
      ideas: [
        {
          name: "Final Walk Explore",
          aspectRatio: "16 / 10",
          unframed: true,
        },
      ],
    },
    {
      id: "reflection",
      kind: "Reflection",
      title: "Add more ways to travel, so more people can use it",
      body: "58% of tourists explore on foot. Many still drive, bike, or mix the two. Next is a way to combine those options, so travelers can shape the trip themselves.",
    },
  ],
};
