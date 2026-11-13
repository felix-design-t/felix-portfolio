/**
 * Site-wide words that are not a project.
 *
 * Think of this file as the text styles and labels on the master frame.
 * Project blurbs live in content/projects instead, so a case study
 * can change without editing the home introduction.
 *
 * The greeting and the two hero paragraphs are the introduction.
 * Skills are woven into the second paragraph as inline chips.
 * The footer still uses the shorter positioning line.
 */

/**
 * First day counted toward experience. The chip label uses years and
 * months only, so it changes on the month boundary. The hover clock
 * shows the live remainder down to the second.
 */
export const experienceStartedOn = { year: 2023, month: 2, day: 1 } as const;

export const heroSkills = [
  { id: "strategy", label: "product strategy" },
  { id: "systems", label: "systems thinking" },
  { id: "systems-design", label: "design systems" },
  { id: "code", label: "prototyping in code" },
  { id: "agentic", label: "agentic workflows" },
] as const;

export type HeroPill = (typeof heroSkills)[number];

export const siteCopy = {
  name: "Felix Teng",
  greeting: "Hi, I'm Felix.",
  description:
    "A product designer through an engineering lens, with 3 years 9 months of experience building B2B SaaS products across startups and enterprises. Most recently at Paycom.",
  positioningLine: "Product designer · 3 years 9 months · B2B SaaS",
} as const;

/** Footer bar, left to right. */
export const footerLinks = [
  { id: "email", label: "Email", href: "mailto:felixtdesign@gmail.com" },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/fangyi-teng/" },
  { id: "github", label: "Github", href: "https://github.com/felix-design-t" },
] as const;
