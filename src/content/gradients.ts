/**
 * Soft color washes behind a product screen.
 *
 * Think of each preset as a style in a Figma library. A cover picks one
 * by name (`sage`, `dusk`). The component paints it. The gray mat stays
 * when a cover has no name.
 *
 * `base` is the flat fill. Each blob is one soft pool of color. `positions`
 * says which corner that pool sits in. The dark theme keeps these hues and
 * swaps only the base, in the component's CSS.
 */

export type GradientPosition =
  | "top-left"
  | "top-right"
  | "right"
  | "bottom"
  | "bottom-right";

export type GradientPreset = {
  base: string;
  blobs: [string, string, string];
  positions: [GradientPosition, GradientPosition, GradientPosition];
  /**
   * How much of the frame each pool covers. Leave it off for the
   * shared 55% size. Dusk uses this so the lilac stays small and
   * the peach stays the largest.
   */
  sizes?: [string, string, string];
};

export const gradientPresets = {
  sage: {
    base: "#F5F8F2",
    blobs: ["#CFE6C8", "#CFE3EE", "#F6E7C9"],
    positions: ["top-left", "right", "bottom"],
  },
  dusk: {
    base: "#F3F4FA",
    blobs: ["#C3D3F2", "#E0D2F0", "#F7D9C8"],
    positions: ["top-left", "top-right", "bottom-right"],
    sizes: ["55%", "40%", "68%"],
  },
  periwinkle: {
    base: "#F3F4FA",
    blobs: ["#C6CFF0", "#DCD3F2", "#F4D3DD"],
    positions: ["top-left", "right", "bottom"],
  },
  clay: {
    base: "#FAF5F0",
    blobs: ["#F0DCC6", "#EBCBBE", "#F3D7D7"],
    positions: ["top-left", "top-right", "bottom-right"],
  },
  /*
    Event Planning. Rose is the largest pool, mauve sits at the
    top right, and the mint stays the small quiet one, the same
    40% as dusk's lilac, so the three melt instead of reading as circles.
  */
  tide: {
    base: "#FAF5F6",
    blobs: ["#F4D3DE", "#E9D5EC", "#D4EEDF"],
    positions: ["top-left", "top-right", "bottom-right"],
    sizes: ["68%", "55%", "40%"],
  },
} as const satisfies Record<string, GradientPreset>;

export type GradientName = keyof typeof gradientPresets;

/** One dark base for every preset. The blobs stay the same hues. */
export const gradientDarkBase = "#16181D";

export function isGradientName(value: string): value is GradientName {
  return value in gradientPresets;
}
