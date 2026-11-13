import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GeistSerif } from "geist/font/serif";
import { BackButton } from "@/components/back-button";
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
  title: {
    default: siteCopy.name,
    template: `%s · ${siteCopy.name}`,
  },
  description: siteCopy.description,
};

/**
 * Root layout is the master frame.
 * Every route keeps this header, column, and footer.
 * A page only replaces the middle.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${GeistSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
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
      </body>
    </html>
  );
}
