import { LayoutClient } from "@/components/LayoutClient";
import { JsonLd } from "@/components/JsonLd";
import { Inter } from "next/font/google";
import "../styles/index.css";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  "https://karpaty-website.vercel.app";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ФК «Уличне» — Офіційний сайт футбольного клубу",
    template: "%s | ФК «Уличне»",
  },
  description:
    "Офіційний сайт футбольного клубу «Уличне». Новини, матчі, команда, турнірна таблиця, календар ігор. Україна.",
  keywords: [
    "футбол уличне",
    "фк уличне",
    "уличне",
    "карпати уличне",
    "футбол дрогобицький район",
    "футбол трускавець",
    "футбол львівська область",
    "ФК Уличне",
    "Уличне футбол",
    "футбольний клуб Уличне",
    "Україна футбол",
    "новини футбол",
    "матчі Уличне",
  ],
  authors: [{ name: "ФК Уличне" }],
  creator: "ФК Уличне",
  publisher: "ФК Уличне",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: siteUrl,
    siteName: "ФК «Уличне»",
    title: "ФК «Уличне» — Офіційний сайт футбольного клубу",
    description:
      "Офіційний сайт футбольного клубу «Уличне». Новини, матчі, команда, турнірна таблиця.",
    images: [
      {
        url: "/images/logo/logo-2.svg",
        width: 280,
        height: 60,
        alt: "ФК Уличне",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ФК «Уличне» — Офіційний сайт",
    description:
      "Офіційний сайт футбольного клубу «Уличне». Новини, матчі, команда.",
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
  verification: {
    // Optional: add when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
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
