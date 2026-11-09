/**
 * The CV control.
 *
 * It is a link, not a button, because a link can point at a file.
 * The `download` name is the filename the browser saves. Think of it
 * as the export setting on a frame: the file on the site, and the
 * name it gets when someone takes a copy.
 */
export function DownloadButton() {
  return (
    <a
      className="corner-button"
      href="/Felix_Teng_Resume.pdf"
      download="Felix_Teng_Resume.pdf"
      aria-label="cv"
    >
      <DownloadIcon />
      <span className="corner-button-caption">cv</span>
    </a>
  );
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="pill-svg">
      <path d="M8 2.4v6.2" />
      <path d="M5.2 6.4 8 9.2l2.8-2.8" />
      <path d="M3.2 12.4h9.6" />
    </svg>
  );
}
