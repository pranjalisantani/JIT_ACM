import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "ACM FACE — A Living Computing Community",
    template: "%s · ACM FACE",
  },
  description:
    "A living computing community grounded in computational rigor, research, and craft.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "ACM",
    "ACM FACE",
    "Computing Community",
    "Computer Science",
    "Systems Rigor",
    "Algorithms",
    "Open Source",
  ],
  authors: [{ name: "ACM FACE" }],
  openGraph: {
    title: "ACM FACE — A Living Computing Community",
    description:
      "A living computing community grounded in computational rigor, research, and craft.",
    siteName: "ACM FACE",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ACM FACE — A Living Computing Community",
    description:
      "A living computing community grounded in computational rigor, research, and craft.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ACM FACE",
    alternateName: "A Living Computing Community",
    url: siteUrl || "https://acm-face.org",
    description:
      "A living computing community grounded in computational rigor, research, and craft.",
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} scroll-smooth dark h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var m=localStorage.getItem("acm_motion_paused");if(m==="true"){document.documentElement.setAttribute("data-motion","paused");}var p=window.location.pathname;var h=window.location.hash;var s=window.location.search;var isHome=(p==="/"||p==="")&&(!h||h==="");var isReplay=s.indexOf("opening=1")!==-1;var v=localStorage.getItem("acm_visited_opening");if(isHome&&(!v||isReplay)){document.documentElement.setAttribute("data-opening","1");}}catch(e){}})();`,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `#opening-shell{display:none;}html[data-opening="1"]:not([data-opening-painted="1"]) #opening-shell{display:block;position:fixed;inset:0;background-color:#000;z-index:90;animation:shellFailsafe 12s forwards;}@keyframes shellFailsafe{0%,99%{visibility:visible;pointer-events:auto;}100%{visibility:hidden;pointer-events:none;display:none;}}`,
          }}
        />
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: `#opening-shell{display:none!important;}`,
            }}
          />
        </noscript>
      </head>
      <body className="min-h-full flex flex-col bg-black text-white font-sans selection:bg-neutral-800 selection:text-white overflow-x-hidden">
        {/* Black failsafe shell for opening first-paint without hiding site markup */}
        <div id="opening-shell" aria-hidden="true" />

        {/* Accessible Skip Link for Keyboard Navigation */}
        <a
          href="#about"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:px-4 focus:py-2 focus:bg-neutral-800 focus:text-white focus:font-mono focus:text-xs focus:ring-2 focus:ring-white"
        >
          Skip to main content ↵
        </a>
        {children}
      </body>
    </html>
  );
}
