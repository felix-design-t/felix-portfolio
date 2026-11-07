/**
 * The tray drawing, to the right of the introduction.
 *
 * The drawing is its own small page. A frame keeps its clock and its pointer
 * on that page, the way a picture frame keeps a drawing off the wall.
 * The lap plays on its own. Move the pointer over the plates and the one
 * under it lifts; the lap takes over again when the pointer leaves.
 */
export function TrayFigure() {
  return (
    <div className="hero-figure">
      <iframe
        src="/hairline/embed.html"
        title="Nine blank plates in a tray. The one under the pointer nudges up, and its neighbours rise after it."
      />
    </div>
  );
}
