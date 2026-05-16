import { LayoutClient } from "@/components/LayoutClient";
import { JsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  getGoogleSiteVerification,
  getSiteUrl,
  SEO_KEYWORDS,
  SITE_NAME,
} from "@/lib/seo";
import "../styles/index.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const siteUrl = getSiteUrl();
const googleVerification = getGoogleSiteVerification();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: siteUrl,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/teamLogo/logoWhiteBG.png",
        width: 768,
        height: 768,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  icons: {
    icon: "/teamLogo/logo_noBG.png",
    shortcut: "/teamLogo/logo_noBG.png",
    apple: "/teamLogo/logo_noBG.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="uk">
      <head />
      <body
        className={`bg-[#FCFCFC] dark:bg-[#0d2818] ${inter.className}`}
      >
        <JsonLd />
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
