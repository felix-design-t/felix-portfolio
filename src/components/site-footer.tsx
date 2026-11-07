import { footerLinks } from "@/content/site";

/**
 * One closing bar. Three keys walk a lift left to right, then back.
 * The links sit on the other side.
 * The id stays so the menu's Contact tab can still land here.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="shell-inner site-footer-inner">
        <div className="footer-strip">
          <iframe
            src="/hairline/keys.html"
            title="Three keys. A lift walks from left to right, then back."
          />
        </div>
        <nav className="footer-links" aria-label="Elsewhere">
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href}>{link.label}</a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
