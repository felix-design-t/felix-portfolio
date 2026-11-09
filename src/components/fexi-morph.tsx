import { Morph } from "loading-dev";

/**
 * Fexi's mark: the loading.dev Morph shape, a square that rounds into a
 * circle and back while it turns.
 * Think of it like one component with two variants in Figma:
 * - "idle" is the calm loop in the hero pill, slow enough not to pull focus.
 * - "loader" is the library's own pace, for when the chat is thinking.
 * Color comes from --text-secondary through the .fexi-morph rule in globals.css.
 * The library turns the motion off when the visitor asks for reduced motion.
 */

/** One full morph cycle, in milliseconds. 1200 is the library default. */
export const fexiMorphDurationMs = {
  idle: 3600,
  loader: 1200,
} as const;

type FexiMorphProps = {
  speed?: keyof typeof fexiMorphDurationMs;
  className?: string;
};

export function FexiMorph({ speed = "loader", className }: FexiMorphProps) {
  return (
    <Morph
      className={["fexi-morph", className].filter(Boolean).join(" ")}
      duration={fexiMorphDurationMs[speed]}
    />
  );
}
