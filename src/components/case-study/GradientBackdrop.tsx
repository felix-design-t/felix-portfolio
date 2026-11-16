import { useId, type CSSProperties, type ReactNode } from "react";
import { gradientPresets, type GradientName } from "@/content/gradients";
import "./gradient-backdrop.css";

type GradientBackdropProps = {
  /** Preset name from the project file. No name keeps the gray mat. */
  name: GradientName | null;
  children: ReactNode;
};

/** Same hues as the light pools, mixed down so dark mode stays calm. */
const darkBlobs: Record<GradientName, [string, string, string]> = {
  sage: ["#1E3328", "#1B2C38", "#33301F"],
  dusk: ["#1F2A44", "#2C2440", "#3A2A26"],
  periwinkle: ["#212A47", "#2B2745", "#3A2530"],
  clay: ["#3A2E22", "#3A2620", "#3A2629"],
  /* Same hues as the tide pools, mixed down onto the shared dark base. */
  tide: ["#3A2E22", "#243838", "#3A2822"],
};

const darkBase = "#121417";

/**
 * The gray plate behind a product screen, replaced with a soft wash.
 *
 * One layer stacks three colors on the base. Each color starts at an
 * edge and fades out before it can draw a shape inside the card. The
 * layer is bigger than the frame and blurred, and the frame clips it.
 * The screenshot paints above it.
 */
export function GradientBackdrop({ name, children }: GradientBackdropProps) {
  const filterId = `gradient-noise-${useId().replace(/:/g, "")}`;

  if (!name) return children;

  const preset = gradientPresets[name];
  const dark = darkBlobs[name];
  const style = {
    "--gradient-base-light": preset.base,
    "--gradient-base-dark": darkBase,
    "--c1-light": preset.blobs[0],
    "--c2-light": preset.blobs[1],
    "--c3-light": preset.blobs[2],
    "--c1-dark": dark[0],
    "--c2-dark": dark[1],
    "--c3-dark": dark[2],
  } as CSSProperties;

  return (
    <>
      <div className="gradient-backdrop" data-gradient={name} style={style} aria-hidden="true">
        <span className="gradient-wash" />
        <svg className="gradient-backdrop-noise" xmlns="http://www.w3.org/2000/svg">
          <filter id={filterId} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="2"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter={`url(#${filterId})`} />
        </svg>
      </div>
      {children}
    </>
  );
}
