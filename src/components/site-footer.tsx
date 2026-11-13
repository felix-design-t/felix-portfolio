import { footerLinks } from "@/content/site";

/**
 * One closing bar. The credit sits on the left, the links on the right.
 * The id marks the closing bar.
 */
export function SiteFooter() {
  return (
    <footer className="site-footer" id="contact">
      <div className="shell-inner site-footer-inner">
        <p className="footer-credit">@ 2026 Felix Teng</p>
        <nav className="footer-links" aria-label="Elsewhere">
          {footerLinks.map((link) => (
            <a key={link.id} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
