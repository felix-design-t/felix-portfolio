import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GeistSerif } from "geist/font/serif";
import { BackButton } from "@/components/back-button";
import { FexiChatRoot } from "@/components/fexi-chat/fexi-chat";
import { OnlineStatus } from "@/components/online-status";
import { DownloadButton } from "@/components/download-cv-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteCopy } from "@/content/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.felix-teng.com"),
  title: {
    default: siteCopy.name,
    template: `%s · ${siteCopy.name}`,
  },
  description: siteCopy.description,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: siteCopy.name,
    title: "Felix Teng · Product designer",
    description: siteCopy.description,
    images: [{
      url: "/social-preview.png",
      width: 1200,
      height: 630,
      alt: "Felix Teng — Product designer through an engineering lens, on a soft teal, gold, and ivory gradient.",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Felix Teng · Product designer",
    description: siteCopy.description,
    images: ["/social-preview.png"],
  },
};

/**
 * Root layout is the master frame.
 * Every route keeps this header, column, and footer.
 * The chat sits on that same frame, so it can open from any page.
 * A page only replaces the middle.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${GeistSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <FexiChatRoot>
          <a className="skip-link" href="#content">
            Skip to content
          </a>
          <SiteHeader />
          <main id="content" className="shell-inner">
            <OnlineStatus />
            <BackButton />
            <DownloadButton />
            {children}
          </main>
          <SiteFooter />
        </FexiChatRoot>
      </body>
    </html>
  );
}
