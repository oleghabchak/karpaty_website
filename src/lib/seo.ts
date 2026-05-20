import type { Metadata } from "next";

export const PRODUCTION_SITE_URL = "https://fculychne.space";

export const SITE_NAME = "ФК «Уличне»";

export const DEFAULT_TITLE =
  "ФК «Уличне» (Карпати) — футбол у селі Уличне, Дрогобичський район";

export const DEFAULT_DESCRIPTION =
  "Офіційний сайт ФК «Уличне» (ФК Карпати Уличне): футбол у селі Уличне, Новини, матчі, склад, турнірна таблиця й календар ігор.";

export const SEO_KEYWORDS = [
  // Уличне
  "Уличне",
  "уличне",
  "село Уличне",
  "село Улич",
  "Уличне футбол",
  "футбол Уличне",
  // футбол в / у Уличному (різні написання)
  "футбол у Уличному",
  "футбол в Уличному",
  "футбол в уличному",
  "футбол в уличнему",
  "футбол у селі Улич",
  "футбол у селі Уличне",
  // ФК Уличне / Карпати
  "фк уличне",
  "ФК Уличне",
  "фк карпати уличне",
  "ФК Карпати Уличне",
  "фк карпати",
  "ФК Карпати",
  "фк карптаи",
  "карпати уличне",
  "Карпати Уличне",
  "карпати уличне фк",
  "футбольний клуб Уличне",
  "футбольний клуб Карпати Уличне",
  // Дрогобичський район
  "футбол дрогобицького району",
  "футбол Дрогобицького району",
  "футбол дрогобицький район",
  "футбол у Дрогобичському районі",
  "дрогобицький район футбол",
  "футбол дрогобич",
  // регіон
  "футбол львівська область",
  "футбол Львівська область",
  "футбол трускавець",
  "футбол борислав",
  // контент сайту
  "новини футбол уличне",
  "матчі ФК Уличне",
  "календар матчів Уличне",
  "турнірна таблиця Уличне",
];

export const ORGANIZATION_ALTERNATE_NAMES = [
  "ФК Карпати Уличне",
  "фк карпати уличне",
  "ФК Карпати",
  "фк карптаи",
  "Карпати Уличне",
  "ФК Уличне",
  "фк уличне",
  "FC Ulychne",
  "футбол у Уличному",
  "футбол в уличнему",
];

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/$/, "")}`;
  }
  return PRODUCTION_SITE_URL;
}

export function absoluteUrl(path = ""): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

type BuildPageMetadataOptions = {
  title: string;
  description: string;
  path?: string;
  openGraphTitle?: string;
};

export function buildPageMetadata({
  title,
  description,
  path = "/",
  openGraphTitle,
}: BuildPageMetadataOptions): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: openGraphTitle ?? title,
      description,
      url: canonical,
    },
    twitter: {
      title: openGraphTitle ?? title,
      description,
    },
  };
}

export function getGoogleSiteVerification(): string | undefined {
  const code = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();
  return code || undefined;
}

export const NOINDEX_ROBOTS: Metadata["robots"] = {
  index: false,
  follow: false,
};
