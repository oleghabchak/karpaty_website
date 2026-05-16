import {
  DEFAULT_DESCRIPTION,
  getSiteUrl,
  ORGANIZATION_ALTERNATE_NAMES,
  SITE_NAME,
} from "@/lib/seo";

export function JsonLd() {
  const base = getSiteUrl();
  const organizationId = `${base}/#organization`;

  const sportsTeam = {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    "@id": organizationId,
    name: SITE_NAME,
    alternateName: ORGANIZATION_ALTERNATE_NAMES,
    url: base,
    logo: `${base}/teamLogo/logoWhiteBG.png`,
    sport: "Soccer",
    sameAs: [
      "https://www.instagram.com/fc.ulychne/",
      "https://www.youtube.com/@FCUlychne/videos",
    ],
    description: DEFAULT_DESCRIPTION,
    inLanguage: "uk",
    areaServed: [
      {
        "@type": "Place",
        name: "село Улич",
      },
      {
        "@type": "AdministrativeArea",
        name: "Дрогобичський район",
      },
      {
        "@type": "AdministrativeArea",
        name: "Львівська область",
      },
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    name: SITE_NAME,
    url: base,
    inLanguage: "uk",
    publisher: { "@id": organizationId },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${base}/news?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(sportsTeam),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(website),
        }}
      />
    </>
  );
}
