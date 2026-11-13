import { Suspense } from "react";
import { ExperiencePill } from "@/components/experience-pill";
import { FexiMorph } from "@/components/fexi-morph";
import { heroSkills, siteCopy, type HeroPill } from "@/content/site";

/**
 * The introduction is one text block, like a short bio in a document.
 * The greeting is a serif heading at reading size.
 * Three sans paragraphs follow, in the same centered reading column.
 * The years and the skills are inline chips. Fexi is a mark and a word.
 * The experience chip opens a live timer. The other chips only react to hover.
 */
export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <h1 id="hero-heading" className="hero-greeting">
        {siteCopy.greeting}
      </h1>
      <div className="hero-body">
        <div className="hero-copy">
          <p>
            A product designer through an engineering lens, with{" "}
            <Suspense fallback={<span className="skill-pill">…</span>}>
              <ExperiencePill />
            </Suspense>{" "}
            of experience building B2B SaaS products across startups and
            enterprises. Most recently at{" "}
            <a className="hero-inline-link" href="https://www.paycom.com/">
              Paycom
            </a>.
          </p>
          <p>
            I own my work from concept to shipped outcomes across{" "}
            <SkillPill pill={heroSkills[0]} />,{" "}
            <SkillPill pill={heroSkills[1]} />, and{" "}
            <SkillPill pill={heroSkills[2]} />, and I use{" "}
            <SkillPill pill={heroSkills[3]} /> to craft and test{" "}
            <SkillPill pill={heroSkills[4]} /> that drive real business results.
          </p>
          <p>
            For a closer look at how I think and work,{" "}
            <span className="fexi-phrase">
              ask <FexiLink />.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* Craft accent map: strategy→blue, systems→emerald, design systems→orange,
   code→rose, agentic→violet. Amber + cyan stay available as tokens. */
const skillAccent = {
  strategy: "blue",
  systems: "emerald",
  agentic: "violet",
  "systems-design": "orange",
  code: "rose",
} as const;

function SkillPill({ pill }: { pill: HeroPill }) {
  return (
    <span className="skill-pill" data-accent={skillAccent[pill.id]}>
      <SkillIcon id={pill.id} />
      {pill.label}
    </span>
  );
}

/**
 * Fexi is the site agent: its mark and its name, inline in the sentence.
 * It is a button so the agent panel can hook its click in later;
 * for now it only reacts to hover and focus.
 */
function FexiLink() {
  return (
    <button type="button" className="fexi-link">
      <FexiMorph speed="idle" />
      <span className="fexi-word">Fexi</span>
    </button>
  );
}

function SkillIcon({ id }: { id: HeroPill["id"] }) {
  if (id === "strategy") return <StrategyIcon />;
  if (id === "systems") return <SystemsIcon />;
  if (id === "agentic") return <AgenticIcon />;
  if (id === "systems-design") return <DesignSystemsIcon />;
  return <CodeIcon />;
}

function StrategyIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="skill-pill-icon" data-motion="strategy">
      <circle cx="8" cy="8" r="2.1" />
      {/* Four ticks, one per direction, so each can travel out and back. */}
      <path className="skill-move skill-move-n" d="M8 2.2v2.1" />
      <path className="skill-move skill-move-s" d="M8 11.7v2.1" />
      <path className="skill-move skill-move-w" d="M2.2 8h2.1" />
      <path className="skill-move skill-move-e" d="M11.7 8h2.1" />
    </svg>
  );
}

function SystemsIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="skill-pill-icon" data-motion="systems">
      <circle cx="4.2" cy="4.2" r="1.35" />
      <circle cx="11.8" cy="4.2" r="1.35" />
      <circle cx="4.2" cy="11.8" r="1.35" />
      <circle cx="11.8" cy="11.8" r="1.35" />
      <path d="M5.6 4.2h5.6M4.2 5.6v5.6M11.8 5.6v5.6M5.6 11.8h5.6" />
    </svg>
  );
}

function AgenticIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="skill-pill-icon" data-motion="agentic">
      <path d="M8 1.8 9.1 6.2 13.6 7.4 9.1 8.6 8 13.2 6.9 8.6 2.4 7.4 6.9 6.2Z" />
    </svg>
  );
}

function DesignSystemsIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="skill-pill-icon" data-motion="systems-design">
      {/* Four blocks. Each class names the corner it travels toward. */}
      <rect className="skill-move skill-move-nw" x="2.4" y="2.4" width="4.6" height="4.6" rx="0.6" />
      <rect className="skill-move skill-move-ne" x="9" y="2.4" width="4.6" height="4.6" rx="0.6" />
      <rect className="skill-move skill-move-sw" x="2.4" y="9" width="4.6" height="4.6" rx="0.6" />
      <rect className="skill-move skill-move-se" x="9" y="9" width="4.6" height="4.6" rx="0.6" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="skill-pill-icon" data-motion="code">
      <path className="skill-move skill-move-w" d="M6.2 3.6 3.2 8l3 4.4" />
      <path className="skill-move skill-move-e" d="M9.8 3.6 12.8 8l-3 4.4" />
    </svg>
  );
}
